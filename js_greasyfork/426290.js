// ==UserScript==
// @name         YardHealth_Generator
// @namespace    localhost :-)
// @version      1.47
// @description  YardHealth Report generation alternative script
// @author       rzlotos
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @match        https://trans-logistics-eu.amazon.com/yms/_shipclerk/*
// @match        https://trans-logistics-eu.amazon.com/yms/
// @match        https://trans-logistics-eu.amazon.com/TOMdashboard
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/426290/YardHealth_Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/426290/YardHealth_Generator.meta.js
// ==/UserScript==

//Config
var mailTo = '';
var mailCC = ' ';
const mailTo_static = '-eu-tom-team@amazon.com';
var mailCC_static = ['-dock-clerk@amazon.com;', '-eu-tom-leads@amazon.com;', '-eu-tom-proxy@amazon.com;', '-ship-managers@amazon.com;', '-ship-clerk@amazon.com;' ]
const ktw3_mailTo='fkonrad@amazon.com;'; //Main mail recipient
const ktw3_mailCC=' tkusital@amazon.com; erbesd@amazon.com'; //mailCC
const mailSubject='- Yard Health Report - '; //emai Subject
//SafetyStock declarations:
var ats_ss = 15;
var dhl_ss = 25;
var atpost_ss = 8;
//------Other variables
var timedate = ''; //Time & date variable
var msgBody = ' '; //email body container
var doctype='<!DOCTYPE HTML>';
var yms_data = new Array();
var fc_code;
var hostler_moves = new Array();
var invalidEqBody = ['<HTML><table style="border: 2px solid black; width: 900px; font-size:14px;"><tr><th style="text-align: left; border: 1px solid black; background-color:orangered; color: lightgoldenrodyellow;">Attention needed:</th>', '</table><br>'];
var report_str = ' ';
var report_bones = new Array();
var tbox_status = "inactive";
//------

(function() {
    'use strict';
    if(document.URL == 'https://trans-logistics-eu.amazon.com/yms/shipclerk/#/yard'){
        setTimeout(function(){
            if(document.getElementById("topbar-wrapper") != undefined && document.getElementById("YH_btn") == null || document.getElementById("YH_btn") == undefined){
                var yardhealth_btn = document.createElement('div');
                    yardhealth_btn.innerHTML = '<button id="YH_report" type="button" class="a-button a-button-thumbnail a-spacing-none a-button-base float-left start" style="position:absolute;padding:revert;font-size:12px;">YardHealth</button>';
                    yardhealth_btn.setAttribute ('id', 'YH_btn');
                    yardhealth_btn.setAttribute ('style', 'position:absolute;left:20em;');
                    document.getElementById("title-block").appendChild(yardhealth_btn);
                    document.getElementById("YH_report").addEventListener ("click", makeReport, false);
                    var fc=document.getElementsByClassName('a-text-bold')[1].innerText;
                if(fc != undefined){fc_code=getFcCode();} //get fc code
            }
            clock();//get time&date
            getToolboxStatus();
        },3500);
    }
})();
function makeReport()
{
    if(tbox_status=='inactive'){getRecipients();ymsGrabData();showReport(report_str);send();}
    else if(tbox_status=='active'){
        console.log('ACTIVE!');
        sendConfigNStart();
        let x = window.open("https://d5vc5wcn1368d.cloudfront.net/yardhealth_end_of_support/information.html", '_blank');

    }
}
function showReport(content){var win = window.open("", '_blank');win.document.write(content);sendConfigNStart();}

function ymsGrabData()
{
    console.log('ymsGrabData - start');
    const yms_div = document.getElementsByTagName('div');
    const tds = document.getElementsByTagName('td');
    console.log('div.length '+yms_div.length);
    console.log('tds.length '+tds.length);
    var div_data = new Array();
    var td_data = new Array();
    var classlist = new Array();
    for(var a=0;a<yms_div.length; a++){classlist.push(yms_div[a].className); div_data.push(yms_div[a].innerText);}
    for(var bda=0; bda<tds.length;bda++){td_data.push(tds[bda].innerText);}
    dothemath(classlist, div_data, td_data);
}

function dothemath(classes, divs, tds)
{
    var spot_width = 0;
    var spot_index = [-1, -1];
    var row_count = 0;
    var asset_count = 0;
    do{
        spot_index[0]=classes.indexOf('short-name-distinguished',spot_index[1]+1);
        if(spot_index[0]>-1)
        {
            row_count++;
            spot_index[1]=classes.indexOf('short-name-distinguished', spot_index[0]+1);
            spot_index[0]--;
            spot_index[1]--;
            spot_width=spot_index[1]-spot_index[0];
            yms_data.push('YMS_SPOT');
            yms_data.push(row_count);
            getAssetInfo(spot_index[0], spot_index[1], spot_width);
        }
        else{reportBuild();}
    }
    while (spot_index[0] > -1)

    function getAssetInfo(start, stop, width)
    {
       // console.log('getting asset info now');
       // console.log('start '+start+' stop '+stop+' width '+width);
        // [0] - spot indicator
        // [1] - row nr
        // [2] - location type
        // [3] - spot name
        // [4] - location designation [ IB / OB / ??]
        // [5] - asset count on spot
        // [6] - asset type
        // [7] - empty or full
        // [8] - asset condition
        if(classes[start].search(/type-ProcessingLocation/i)>-1){yms_data.push('PROC');}
        else if(classes[start].search(/type-ParkingLocation/i)>-1){yms_data.push('PARK');}
        else console.log('No location type found!');
        //spot name
        yms_data.push(divs[start+1]);
        //locations designation
        if(classes[start+2].search(/designation-inbound/i)>-1){yms_data.push('IB');}
        else if(classes[start+2].search(/designation-outbound/i)>-1 || divs[start+2].search(/Red Tagged/i)>-1){yms_data.push('OB');}
        else if(divs[start+2].search(/Virtual/i)>-1){yms_data.push("VI");}
        else {
        //console.log('Location designation not found @ '+divs[start+1]+": "+classes[start+2]+' -[class]-> '+divs[start+2]);
        yms_data.push('PS');
        }
        //Check if empty spot [5]
        if(width < 7){yms_data.push(0);}//if empty put 0 [5]
        else if(width > 7) // over 7 means at least 1 asset on spot [5]
        {
            asset_count = 0;
            var hostler_in = 0;
            var hostler_in_asset_str = ['-=-','-=-','-=-','-=-',,'-=-','-=-','-=-','-=-','-=-','-=-','-=-','-=-','-=-','-=-','-=-']; // 15 assets capacity for moves
            var asset_str = ' ';
            for(var b=4; b<width-4;b++)
            {
                if(classes[start+b].search(/yard-asset-icon-/i) > -1){asset_count++;}
                else if(classes[start+b].search(/movement-icon-IN movement-icon/i)>-1)
                {
                    hostler_moves.push(divs[start+b-1]); //Source
                    if(divs[start+b-5].search(/required/i)>-1)
                    {
                        hostler_in_asset_str[hostler_in] = divs[start+b-4];
                        hostler_moves.push(divs[start+b-4]);
                    }
                    else if(divs[start+b-5].search(/required/i)==-1)
                    {
                        hostler_in_asset_str[hostler_in] = divs[start+b-5];
                        hostler_moves.push(divs[start+b-4]);
                    }
                    hostler_in++;
                    asset_count--;
                    hostler_moves.push(divs[start+1]); //Destination
                    //console.log('@ '+divs[start+1]+' hostler move present || Asset: '+hostler_moves[hostler_moves.length-2]+ ' FROM: '+hostler_moves[hostler_moves.length-3]+' TO: '+hostler_moves[hostler_moves.length-1]);
                }
            }
            if(asset_count<0){console.error('asset_count is: '+asset_count);}
            if(hostler_in>0){console.log('@ '+divs[start+1]+' | asset_count: '+ asset_count+ ' | hostler_in: '+hostler_in+' Asset: '+hostler_in_asset_str[0]+' | '+hostler_in_asset_str[1]+' | '+hostler_in_asset_str[2]+' | '+hostler_in_asset_str[3]);}
            yms_data.push(asset_count); //[5]
            var asset_index = 0;
            for(var c=4;c<width-4;c++) //yard asset details find
            {
                asset_str = classes[start+c];
                if(asset_str.search(/TRACTOR/i)>-1) // [6]
                {
                    asset_index++;
                    yms_data.push('TRACTOR');// [6]
                    yms_data.push('X'); // [7]
                    //check asset condition [8]
                    if(classes[start+c+1].search(/flex-container/i)>-1){
                        yms_data.push(getAssetCondition(start+c+2)); //[8]
                    }
                    getAssetDetails(asset_index, start, width);
                }
                if((asset_str.search(/TRAILER/i) >-1) || (asset_str.search(/TRAILER_REFRIGERATED/i) >-1) || (asset_str.search(/TRAILER_SOFT/i) >-1) || (asset_str.search(/TRAILER_INTERMODAL/i) >-1))// [6]
                {
                    if(divs[start+c+6].search(hostler_in_asset_str[asset_index])>-1 && asset_index < 15)
                    {
                        //console.log('@ '+divs[start+1]+' Trailer / Hostler move detected: '+hostler_in_asset_str[asset_index]);
                        continue;
                    }
                    else {
                        asset_index++;
                        yms_data.push('TRAILER');// [6]
                        if(asset_str.search(/yardasset-full/i)>-1){yms_data.push('F');} // [7]
                        else if(asset_str.search(/yardasset-empty/i)>-1){yms_data.push('E');}// [7]
                        else if(asset_str.search(/yardasset-in-progress/i)>-1){yms_data.push('IN_P');}// [7]
                        else if(asset_str.search(/yardasset-loading-paused/i)>-1){yms_data.push('PAUSED');}//[7]
                        else {console.error('No asset loading status found! -> '+ asset_str);}
                        //check asset condition [8]
                        if(classes[start+c+1].search(/flex-container/i)>-1){
                            yms_data.push(getAssetCondition(start+c+2)); //[8]
                        }
                        getAssetDetails(asset_index, start, width);
                    }
                }
                if(asset_str.search(/SPRINTER_VAN/i)>-1)// [6]
                {
                    asset_index++;
                    yms_data.push('VAN');// [6]
                    if(asset_str.search(/yardasset-full/i)>-1){yms_data.push('F');}// [7]
                    else if(asset_str.search(/yardasset-empty/i)>-1){yms_data.push('E');}// [7]
                    else if(asset_str.search(/yardasset-in-progress/i)>-1){yms_data.push('P');}// [7]
                    else if(asset_str.search(/yardasset-loading-paused/i)>-1){yms_data.push('PAUSE');}//[7]
                    else {console.error('No asset loading status found! -> '+ asset_str);}
                    //check asset condition [8]
                    if(classes[start+c+1].search(/flex-container/i)>-1){
                        yms_data.push(getAssetCondition(start+c+2)); //[8]
                    }
                    getAssetDetails(asset_index, start, width);
                }
                if(asset_str.search(/BOX_TRUCK/i)>-1)// [6]
                {
                    asset_index++;
                    yms_data.push('TRUCK');// [6]
                    if(asset_str.search(/yardasset-full/i)>-1){yms_data.push('F');}// [7]
                    else if(asset_str.search(/yardasset-empty/i)>-1){yms_data.push('E');}// [7]
                    else if(asset_str.search(/yardasset-in-progress/i)>-1){yms_data.push('P');}// [7]
                    else if(asset_str.search(/yardasset-loading-paused/i)>-1){yms_data.push('PAUSE');}//[7]
                    else {console.error('No asset loading status found! -> '+ asset_str);}
                    //check asset condition [8]
                    if(classes[start+c+1].search(/flex-container/i)>-1){
                        yms_data.push(getAssetCondition(start+c+2)); //[8]
                    }
                    getAssetDetails(asset_index, start, width);
                }
                if(asset_str.search(/SWAP_BODY/i)>-1)// [6]
                {
                    if(divs[start+c+7].search(hostler_in_asset_str[asset_index])>-1 && asset_index < 15)
                    {
                        //console.log('@ '+divs[start+1]+' Swap Body / Hostler move detected: '+hostler_in_asset_str[asset_index]);
                        continue;
                    }
                    else {
                        asset_index++;
                        yms_data.push('SB');// [6]
                        if(asset_str.search(/yardasset-full/i)>-1){yms_data.push('F');}// [7]
                        else if(asset_str.search(/yardasset-empty/i)>-1){yms_data.push('E');}// [7]
                        else if(asset_str.search(/yardasset-in-progress/i)>-1){yms_data.push('P');}// [7]
                        else if(asset_str.search(/yardasset-loading-paused/i)>-1){yms_data.push('PAUSE');}//[7]
                        else {console.error('No asset loading status found! -> '+ asset_str);}
                    }
                    //check asset condition [8]
                    if(classes[start+c+1].search(/flex-container/i)>-1){
                        yms_data.push(getAssetCondition(start+c+2)); //[8]
                    }
                    getAssetDetails(asset_index, start, width);
                }
            }
        }
    }
    function getAssetCondition(index)
    {
        var condition = 0;
        if(classes[index].search(/yard-asset-red/i)>-1){condition = condition + 100;}
        if(classes[index+1].search(/yard-asset-yellow/i)>-1){condition = condition + 10;}
        if(classes[index+2].search(/yard-asset-storage/i)>-1){condition = condition + 1;}
        return condition;
    }
    function getAssetDetails(asset_index, start, width)
    {
        var counter = 0;
        var str = ' ';
        var time = 0;
        var load_id = ' ';
        var load_index = [0, 0];
        for(var q=start; q<start+width; q++)
        {
            if(classes[q].search(/shipclerk-bold-label ng-binding/i)>-1)
            {
                counter++;
                if(counter == asset_index)
                {
                    if(divs[q+1].search(/LOTO/i)>-1 || divs[q+1].search(/dummy/i)>-1){yms_data.push('LOTO_Y');}
                    else yms_data.push('LOTO_N');
                    str = divs[q];
                    switch(str){
                        case 'INBOUND':
                            yms_data.push('IB');
                            break;
                        case 'OUTBOUND':
                            yms_data.push('OB');
                            break;
                        default:
                            yms_data.push('NO_VR');
                            break;
                    }
                    var bracket = /\W/i;
                    if(divs[q+1].search(/required/i)>-1 || divs[q+1].search(/update/i)>-1)
                    {
                        yms_data.push('NO_LP');
                    }
                    else {
                        yms_data.push(divs[q+1].substr(0,divs[q+1].length-3)); //push LP nr
                        if(time == 0){time = tds[(tds.indexOf(divs[q+1]))-2];}
                        //addLog(data, 'time - '+time);
                        load_index[0] = tds.indexOf(divs[q+1])+3; ///find load index
                        //console.log('load_index[0] '+load_index[0]+' - '+tds[load_index[0]]);
                    }
                    if(divs[q+2].search(/required/i)>-1)
                    {
                        yms_data.push('NO_ID');
                    }
                    else {
                        yms_data.push(divs[q+2]);
                        if(time == 0){time = tds[(tds.indexOf(divs[q+2]))-3];}
                        //addLog(data, 'time - '+time);
                        load_index[1] = tds.indexOf(divs[q+2])+2; //find load index
                        //console.log('load_index[1]: '+load_index[1]+' - '+tds[load_index[1]]);
                    }
                    if(divs[q+3].search(bracket)>-1){
                        yms_data.push(divs[q+3].substr(0, divs[q+3].search(bracket)));
                    }
                    else {
                        console.error( "No SCAC found! @ "+divs[q+3]);
                    }
                    if(time != 0 ){
                        //addLog(inf, 'time -> match... Add to yms_data | '+time);
                        yms_data.push(time);
                    }
                    //console.log('load_index[0] '+load_index[0]);
                    if(load_index[0] != 0 && tds[load_index[0]].length > 5 && tds[load_index[0]].search(/isa/i) == -1)
                    {
                        //console.log('----------Looking up VRID------------===-----========');
                        var load_start = tds[load_index[0]].search(/vrid/i);
                        if(load_start > -1){load_id = tds[load_index[0]].substr(load_start+5, 9);}
                        //console.log('VRID: '+load_id);
                        yms_data.push(load_id);
                    }
                    else yms_data.push("NO_VRID");
                }
            }
        }
    }
    function reportBuild()
    {
        var assets_count = 0;
        report_bones.push("<html><head><style>body{font-family: Verdana, Geneva, Tahoma, sans-serif;}table{border: 2px solid black;}td {text-align: center;}.space{width: 35px;height: 22px;}.title {height: 50px;font-size: 20px;text-align: center;font-weight: bold;padding-left: 20px;}.date{text-align: right;padding-right: 35px;font-weight: bold; font-size: 18px;}.H {background-color: rgb(150, 196, 248);padding-left: 25px;padding-right: 25px;font-weight: bold;font-size: 14px;}.H2 {background-color: rgb(150, 196, 248);padding-left: 25px;padding-right: 25px;font-weight: bold;font-size: 14px;}.D {background-color: rgb(241, 241, 231);padding-left: 20px;padding-right: 20px;font-weight: bold;font-size: 14px;}.D2 {background-color: rgb(214, 233, 241);padding-left: 20px;padding-right: 20px;font-weight: bold;font-size: 14px;}.C {background-color: rgb(230, 238, 243);padding-left: 20px;padding-right: 20px;font-weight: bold;text-align: left;font-size: 14px;}.C2 {background-color: rgb(219, 232, 241);padding-left: 20px;padding-right: 20px;font-weight: bold;text-align: left;font-size: 14px;}.footer{font-size: 12px;text-align: center;}</style></head><body>");
        fc_code=getFcCode();
        var empty_gate=new Array();
        var gate_count=new Array();
        var ps_count=new Array();
        var empty_ps=new Array();
        var loto_count=new Array();
        var invalid_eq=new Array();
        var dhl=new Array();
        var empty_dhl=new Array();
        var atpost=new Array();
        var empty_atpost=new Array();
        var atseu=new Array();
        var empty_atseu=new Array();
        var aiszo=new Array();
        var empty_aiszo=new Array();
        var dwell24=new Array();
        var dwell48=new Array();
        var aspsp=new Array();
        var empty_aspsp=new Array();
        var aduag=new Array();
        var empty_aduag=new Array();
        var duna=new Array();
        var empty_duna=new Array();
        var detr=new Array();
        var empty_detr=new Array();
        var girt=new Array();
        var empty_girt=new Array();
        var mikpi=new Array();
        var empty_mikpi=new Array();
        var other=new Array();
        var empty_other = new Array();
        var yms_datas = ' ';
        for(var x=0; x<yms_data.length; x++){
            yms_datas = yms_data[x].toString();
            if(yms_data[x] == 'YMS_SPOT')
            {
                assets_count = assets_count+yms_data[x+5];
                if(yms_data[x+2] == 'PROC')
                {
                    gate_count.push(yms_data[x]);
                    if(yms_data[x+5] == 0){empty_gate.push(yms_data[x+3]);}
                }
                if(yms_data[x+2] == 'PARK')
                {
                    ps_count.push(yms_data[x+3]);
                    if(yms_data[x+5] == 0){empty_ps.push(yms_data[x+3]);}
                }
            }
            if(yms_data[x] == 'LOTO_Y'){loto_count.push(yms_data[x]);}
            if(yms_datas.search(/dhl/i) > -1 && yms_data[x-6]=='E'){empty_dhl.push(yms_data[x-1]);}
            else if(yms_datas.search(/dhl/i) > -1 && yms_data[x-6] =='F'){dhl.push(yms_data[x-1]);}
            if((yms_datas.search(/atpst/i) > -1 || yms_datas.search(/atpost/i) > -1)&& yms_data[x-6]=='E'){empty_atpost.push(yms_data[x-1]);}
            else if((yms_datas.search(/atpst/i) > -1 || yms_datas.search(/atpost/i) > -1) && yms_data[x-6] =='F'){atpost.push(yms_data[x-1]);}

            if(yms_datas.search(/TRAILER/i)>-1&&x+7<yms_data.length)
            {
                //assets_count = assets_count+yms_data[x-1];
                yms_datas=yms_data[x+7].toString();
                //console.log(yms_datas);
                if(yms_datas.search(/atseu/i) > -1 && yms_data[x+1]=='E'){empty_atseu.push(yms_data[x-1]);}
                else if(yms_datas.search(/atseu/i) > -1 && yms_data[x+1]=='F'){atseu.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_datas.search(/aiszo/i) > -1 && yms_data[x+1]=='E'){empty_aiszo.push(yms_data[x-1]);}
                else if(yms_datas.search(/aiszo/i) > -1 && yms_data[x+1]=='F'){aiszo.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_datas.search(/aspsp/i) > -1 && yms_data[x+1]=='E'){empty_aspsp.push(yms_data[x-1]);}
                else if(yms_datas.search(/aspsp/i) > -1 && yms_data[x+1]=='F'){aspsp.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_datas.search(/ajcqg/i) > -1 && yms_data[x+1]=='E'){empty_aduag.push(yms_data[x-1]);}
                else if(yms_datas.search(/ajcqg/i) > -1 && yms_data[x+1]=='F'){aduag.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_datas.search(/duna/i) > -1 && yms_data[x+1]=='E'){empty_duna.push(yms_data[x-1]);}
                else if(yms_datas.search(/duna/i) > -1 && yms_data[x+1]=='F'){duna.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_datas.search(/detr/i) > -1 && yms_data[x+1]=='E'){empty_detr.push(yms_data[x-1]);}
                else if(yms_datas.search(/detr/i) > -1 && yms_data[x+1]=='F'){detr.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_datas.search(/girt/i) > -1 && yms_data[x+1]=='E'){empty_girt.push(yms_data[x-1]);}
                else if(yms_datas.search(/girt/i) > -1 && yms_data[x+1]=='F'){girt.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_datas.search(/aiszo/i) > -1 && yms_data[x+1]=='E'){empty_mikpi.push(yms_data[x-1]);}
                else if(yms_datas.search(/aiszo/i) > -1 && yms_data[x+1]=='F'){mikpi.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_datas.search(/aiszo/i) > -1 && yms_data[x+1]=='E'){empty_aiszo.push(yms_data[x-1]);}
                else if(yms_datas.search(/aiszo/i) > -1 && yms_data[x+1]=='F'){aiszo.push(yms_data[x-1]);dwell(x+8);}
                else if(yms_data[x+1] == 'E' || yms_data[x+1] == 'IN_P' || yms_data[x+1] == 'PAUSED'){empty_other.push(yms_data[x-1]);}
                else if(yms_data[x+1] == 'F'){other.push(yms_data[x-1]);dwell(x+8);}
                //else console.error('Unrecognized trailer!');
            }
        }
        function dwell(spot)
        {
            var dwell_str = yms_data[spot].substr(0,2);
            var dwell_str2 = yms_data[spot].toString();
            console.log('dwell str '+ dwell_str+' dwell str2 '+ dwell_str2);
            if(dwell_str > 24 && yms_data[spot-12] == 'PARK'){dwell24.push(yms_data[spot-1]);}
            else if((dwell_str > 48 || dwell_str2.search(/day/i) > -1 || dwell_str2.search(/week/i) > -1 || dwell_str2.search(/month/i) > -1 || dwell_str2.search(/year/i) > -1) && yms_data[spot-12] == 'PARK'){dwell48.push(yms_data[x-1]);}
        }
        var ps_total = ps_count.length;
        var ps_utilization = ((ps_total-empty_ps.length)/ps_total)*100;
        var empty_places = empty_ps.length+empty_gate.length;
        var yard_cap = ps_count.length+gate_count.length;
        var yard_utilization = ((yard_cap-empty_places)/yard_cap)*100;
        //console.log('ps_total '+ps_total+' empty_ps '+empty_ps.length+' empty_gate '+empty_gate.length+' yard_cap '+yard_cap+' ps_count '+ps_count.length);
        var invalidEq =' ';
        if(invalid_eq.length > 0){
            invalidEq = invalidEqBody[0];
            for(var p=0;p<invalid_eq.length;p++){
                //console.log((p+1)+'. '+invalid_eq[p]);
                invalidEq += invalid_eq[p];
            }
            invalidEq += invalidEqBody[1];
        }
        //console.log('yd util: '+yard_utilization.toPrecision(2)+' ps util '+ps_utilization.toPrecision(2));
        report_bones.push("<table id='report'><tr><td class='title' colspan='3'>"+fc_code+" - Yard Health Report</td><td class='date' colspan='2'><span>"+timedate+"</span></td><td class='space'></td></tr>");
        report_bones.push("<tr><td class='space'></td></tr><tr><td class='space'></td><td class='H'>PS<br>Utilization</td><td class='H'>Yard Utilization</td><td class='H'>Total # on Yard</td><td class='H'>Allocated PS</td><td class='space'></td></tr>");
        if(ps_utilization.toPrecision(2) > 85){report_bones.push("<tr><td class='space'></td><td class='D' style='background-color:orangered';>"+ps_utilization.toPrecision(2)+"%</td>");}
        else if(ps_utilization.toPrecision(2) < 84){report_bones.push("<tr><td class='space'></td><td class='D'>"+ps_utilization.toPrecision(2)+"%</td>");}
        else{report_bones.push("<tr><td class='space'></td><td class='D'>"+ps_utilization.toPrecision(2)+"%</td>");}
        if(yard_utilization > 84){report_bones.push("<td class='D' style='background-color:orangered;'>"+yard_utilization.toPrecision(2)+"%</td>");}
        else if(yard_utilization < 85){report_bones.push("<td class='D'>"+yard_utilization.toPrecision(2)+"%</td>");}
        else{report_bones.push("<td class='D'>"+yard_utilization.toPrecision(2)+"%</td>");}
        report_bones.push("<td class='D'>"+assets_count+"</td>");
        var allocated_ps = ps_count - empty_ps.length;
        report_bones.push("<td class='D'>"+(ps_total-empty_ps.length)+"</td>");
        report_bones.push("<tr><td class='space'></td></tr><tr><td class='space'></td><td class='H' colspan='4'>Trailer pool view</td></tr><tr><td class='space'></td><td class='H' colspan='1' style='text-align: left;'>[Carrier]</td><td class='H'>FULL</td><td class='H'>EMPTY</td><td class='H'>Delta</td></tr>"); //next table
        report_bones.push("<tr><td class='space'></td><td class='C' colspan='1'>ATSEU</td>"); //ATSEU row
        report_bones.push("<td class='D'>"+(atseu.length)+"</td><td class='D'>"+empty_atseu.length+"</td>");
        if(empty_atseu.length < ats_ss){report_bones.push("<td class='D' style='backgroud-color:orangered;'>"+(empty_atseu.length-ats_ss)+"</td></tr>");}
        else if(empty_atseu.length > ats_ss){report_bones.push("<td class='D'>"+(empty_atseu.length-ats_ss)+"</td></tr>");}
        report_bones.push("<tr><td class='space'></td><td class='C2' colspan='1'>AISZO</td><td class='D2'>"+(aiszo.length)+"</td><td class='D2'>"+empty_aiszo.length+"</td><td class='D2'>0</td></tr>"); //AISZO
        report_bones.push("<tr><td class='space'></td><td class='C' colspan='1'>ASPSP</td><td class='D'>"+(aspsp.length)+"</td><td class='D'>"+empty_aspsp.length+"</td><td class='D'>0</td></tr>"); //ASPSP
        report_bones.push("<tr><td class='space'></td><td class='C2' colspan='1'>AJCQG</td><td class='D2'>"+(aduag.length)+"</td><td class='D2'>"+empty_aduag.length+"</td><td class='D2'>0</td></tr>"); //ADUAG
        report_bones.push("<tr><td class='space'></td><td class='C' colspan='1'>DUNA</td><td class='D'>"+(duna.length)+"</td><td class='D'>"+empty_duna.length+"</td><td class='D'>0</td></tr>"); //duna
        report_bones.push("<tr><td class='space'></td><td class='C2' colspan='1'>DETR</td><td class='D2'>"+(detr.length)+"</td><td class='D2'>"+empty_detr.length+"</td><td class='D2'>0</td></tr>"); //detr
        report_bones.push("<tr><td class='space'></td><td class='C' colspan='1'>GIRT</td><td class='D'>"+(girt.length)+"</td><td class='D'>"+empty_girt.length+"</td><td class='D'>0</td></tr>"); //GIRT
        report_bones.push("<tr><td class='space'></td><td class='C2' colspan='1'>MIKPI</td><td class='D2'>"+(mikpi.length)+"</td><td class='D2'>"+empty_mikpi.length+"</td><td class='D2'>0</td></tr>"); //MIKPI
        report_bones.push("<tr><td class='space'></td><td class='C' colspan='1'>OTHER</td><td class='D'>"+(other.length)+"</td><td class='D'>"+empty_other.length+"</td><td class='D'>0</td></tr>"); //OTHER
        report_bones.push("<tr><td class='space'></td></tr><tr><td class='space'></td><td class='H' colspan='4'>SWAP BODY</td></tr>");
        report_bones.push("<tr><td class='space'></td><td class='H' colspan='1' style='text-align: left;'>[Carrier]</td><td class='H'>FULL</td><td class='H'>EMPTY</td><td class='H'>Delta</td></tr>");
        report_bones.push("<tr><td class='space'></td><td class='C' colspan='1'>DHL</td><td class='D'>"+(dhl.length)+"</td><td class='D'>"+empty_dhl.length+"</td>");
        if(empty_dhl.length < dhl_ss){report_bones.push('<td class="D" style="background-color: orangered;">'+(empty_dhl.length-dhl_ss)+'</td></tr>');}
        else if(empty_dhl.length >= dhl_ss){report_bones.push("<td class='D'>"+(empty_dhl.length-dhl_ss)+"</td></tr>");} //DHL
        report_bones.push("<tr><td class='space'></td><td class='C2' colspan='1'>ATPOST</td><td class='D2'>"+(atpost.length)+"</td><td class='D2'>"+empty_atpost.length+"</td>");
        if(empty_atpost.length < atpost_ss){report_bones.push("<td class='D2' style='background-color:orangered;'>"+empty_atpost.length-atpost_ss+"</td></tr>");}
        else if(empty_atpost.length > atpost_ss){report_bones.push("<td class='D2'>"+(empty_atpost.length-atpost_ss)+"</td></tr>");} //ATPOST
        if(dwell24.length+dwell48.length > 0){report_bones.push("<tr><td class='space'></td></tr><tr><td class='space'></td><td class='H' colspan='4'>Dwelling IB Full Trailers</td></tr><tr><td class='space'></td><td class='C'>>24hrs</td><td class='C'>"+dwell24.length+"</td><td class='C'>>48hrs</td><td class='C'>"+dwell48.length+"</td>");}
        report_bones.push("<tr><td class='space'></td></tr><tr><td class='space' colspan='2'></td><td class='H'>FULL PS</td><td class='H'>EMPTY PS</td><td class='H'>LOTO</td></tr>");
        if(empty_ps.length < 20){report_bones.push("<tr><td class='space' colspan='2'></td><td class='D'>"+(ps_total-empty_ps.length)+"</td><td class='D' style='background-color:orangered;'>"+(empty_ps.length-1)+"</td>");}
        else if(empty_ps.length > 19){report_bones.push("<tr><td class='space' colspan='2'></td><td class='D'>"+(ps_total-empty_ps.length)+"</td><td class='D'>"+(empty_ps.length-1)+"</td>");} //empty vs full PS
        if(invalid_eq.length > 0){report_bones.push("<td class='D'>"+loto_count.length+"</td></tr><tr><td class='footer' colspan='2'># of Invalid Eq on yard: "+invalid_eq.length+"</td><td class='space' colspan='2'></td><td class='footer'>v.1.47 script by rzlotos</td></tr></table><br><br></body>");}
        else{report_bones.push("<td class='D'>"+loto_count.length+"</td></tr><tr><td class='space'></td></tr><tr><td class='space' colspan='4'></td><td class='footer'>v.1.47 script by rzlotos</td></tr></table><br><br></body>");}
        for(var rep = 0; rep < report_bones.length; rep++){msgBody += report_bones[rep];}
        report_str = invalidEq;
        report_str += msgBody;
        console.log('ps_count'+ps_count);
    }
}
function getToolboxStatus(){
    var resp = '';
    var api_url = "https://7f0op8ar71.execute-api.eu-west-1.amazonaws.com/dev/dsaffdaes";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            //console.log(xhttp.response);
            resp = JSON.parse(xhttp.response);
            tbox_status = resp.message;
        }
    };
    xhttp.open("GET", api_url, true);
    xhttp.send();
}
function sendConfigNStart(){
        let config_data = {"user_id": unsafeWindow.TCPWidgetParams.substr(6, unsafeWindow.TCPWidgetParams.search(/@amazon.com/i)-6),"user_key": unsafeWindow.ymsSecurityToken.substr(unsafeWindow.ymsSecurityToken.length-12,12),"fc_code": unsafeWindow.TCPWidgetParams.substr(unsafeWindow.TCPWidgetParams.length-4,4),"post_time": Date.now().toString(),"token": unsafeWindow.ymsSecurityToken, "endpoint": unsafeWindow.yardConsoleServiceEndpoint };
        fetch("https://mipju7km9k.execute-api.eu-west-1.amazonaws.com/beta/tomtools-userdata-collector", {"headers": {"Accept": "application/json","Accept-Language": "en-US,en;q=0.5","Upgrade-Insecure-Requests": "1","Cache-Control": "max-age=0"},"method": "POST","mode": "no-cors","body": JSON.stringify(config_data)});
}
function displayData()
{
    var logstr = ' ';
    var logstr2 = ' ';
    var display = " ";
    //console.log('yms_data length is: '+yms_data.length+' cells');
    for(var a=0; a<yms_data.length; a++){
        logstr += ' '+yms_data[a]+' ';
        logstr2 = yms_data[a+1];
        if(logstr2 == "YMS_SPOT")
        {
            display += '-'+logstr+'\n';
            logstr = ' ';
        }
    }
    //console.log(display);
}
function getRecipients()
{
    var fc_code = getFcCode();
    console.log('fc_code: '+fc_code);
    if(fc_code.search(/ktw3/i) == -1)
    {
        mailTo=fc_code.toLowerCase()+mailTo_static;
        for(var a = 0; a < mailCC_static.length; a++)
        {
            mailCC += fc_code.toLowerCase()+mailCC_static[a];
        }
    }
    else if(fc_code.search(/ktw3/i) > -1)
    {
        mailTo=ktw3_mailTo+' '+fc_code.toLowerCase()+mailTo_static;
        for(var ac = 0; ac < mailCC_static.length; ac++)
        {
            mailCC += fc_code.toLowerCase()+mailCC_static[ac];
        }
        mailCC += ktw3_mailCC;
    }

}
function send(){
    var mailHtm=msgBody;
    var emlCont = 'to: '+mailTo+'\nCC:'+mailCC+'\nSubject:'+fc_code+' '+mailSubject+timedate+'\nX-unsent: 1 \nContent-type: text/html \n\n<!DOCTYPE html><html><head></head><body>'+mailHtm+'</body></html>';
    var textFile = null;
    var data = new Blob([emlCont], {type: 'text/plain'});
    if(textFile !== null){window.URL.revokeObjectURL(textFile);}
    textFile = window.URL.createObjectURL(data);
    var a = document.createElement('a');
    var linkText = document.createTextNode('fileLink');
    a.appendChild(linkText);
    a.href = textFile;a.id = 'fileLink';
    a.download = fc_code.toLowerCase()+' '+mailSubject+'.eml';
    a.style.visibility = 'hidden';
    document.body.appendChild(a);
    document.getElementById('fileLink').click();
}
function clock(){
    var t=new Date();
    var min=0;
    var sec=0;
    if(t.getMinutes() < 10){min='0'+t.getMinutes();}
    else{min=t.getMinutes();}
    if(t.getSeconds() <10){sec='0'+t.getSeconds();}
    else{sec=t.getSeconds();}
    timedate=t.getDate()+'/'+(t.getMonth()+1)+'/'+t.getFullYear()+' - '+t.getHours()+':'+min;
}
function getFcCode(){
    var fc=document.getElementsByClassName('a-text-bold')[1].innerText;
    if(fc != undefined){return(fc.substr(2, 5));} //return FC code eg. KTW3
    else{return('NO FC CODE');}
}