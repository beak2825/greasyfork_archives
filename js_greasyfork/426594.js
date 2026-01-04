// ==UserScript==
// @name         Yard H
// @namespace    yms.amazon.com
// @version      0.7
// @description  Alternative method of Yard Health Report generation
// @author       rzlotos
// @match        file:///C:/Users/Rafcio/Desktop/YH%20Generator/Yard%20Management.html
// @match        file:///C:/Users/Rafcio/Desktop/testtube/Yard%20Management.mhtml
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @run-at       document-end
// @grant        GM_XmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/426594/Yard%20H.user.js
// @updateURL https://update.greasyfork.org/scripts/426594/Yard%20H.meta.js
// ==/UserScript==
var tdata; //temporary variable fr testing
//Set of global scope variables
const configLoader = "config loader goes here";
const yardConfigUrl = "//ant/dept-eu/KTW3/Public/YardHealthConfigFiles"; //yardConfig path to download
var fc_code = " "; //FC codename eg.KTW3
var gui_nodes;
var td_nodes;
var reportConfig = new Array(); //Configuration of report rules eg. Safety Stock
var yardDataTable = new Array(); // clean & ordered YMS data to work on
// Data structure in array: 0        1        2        3        4        5        6        7        8        9        10        11        12        13
var invalid_eq = new Array();
var ultra = new Array();
var ultra2 = new Array();

var classList = new Array();
    var gui_values = new Array();
    var td_values = new Array();
    var td_index = 0;
    var spot_index = 0;
    var spot_count = new Array();
    var td_spots = new Array();
var next_spot_distance = 'NO MORE SPOTS';
var td_time = new Array();
var td_count = 0;
    var no_err = 0;
var error_container = new Array();
var td_classes = new Array();

//SafetyStock declarations:
var ats_ss = 15;
var dhl_ss = 30;
var atpost_ss = 8;
//End of SS declaration
var report_bones = new Array();
var add = 0;
var carriers = new Array();
    //carrier count arrays
    var atseu = new Array(); //ATS container
    var dhl = new Array();
    var atpost = new Array();
    var ats = new Array();
    var aiszo = new Array();
    var aspsp = new Array();
    var aduag = new Array();
    var duna = new Array();
    var detr = new Array();
    var girt = new Array();
    var mikpi = new Array();
    var other = new Array();
    //arrays for simple yardconfig:
    var ps_count = new Array();
    var gate_count = new Array();
    //other data
    var empty_gate = new Array();
    var empty_ps = new Array();
    var loto_count = new Array();
 var row = 0;
setInterval(function(){
    if(document.getElementById("topbar-wrapper") != undefined && document.getElementById("YH_btn") == null || document.getElementById("YH_btn") == undefined){
        var yardhealth_btn = document.createElement('div');
        yardhealth_btn.innerHTML = '<button id="YH_report" type="button" class="a-button a-button-thumbnail a-spacing-none a-button-base float-left start" style="position:absolute;padding:revert;font-size:14px;">YardHealth</button>';
        yardhealth_btn.setAttribute ('id', 'YH_btn');
        yardhealth_btn.setAttribute ('style', 'position:absolute;left:20em;');
        document.getElementById("title-block").appendChild(yardhealth_btn);
        document.getElementById("YH_report").addEventListener ("click", makeReport, false);
        console.clear();
        var fc=document.getElementsByClassName('a-text-bold')[1].innerText;
        if(fc != undefined){fc_code=fc.substr(2, 4);} //get fc code
    }
    clock();
},1000);
function makeReport(){
    //Try to load yard config from file and catch possible errors, and continue in default settings if error
    if(getYardConfig(yardConfigUrl) == -1){alert("Warning!\nSomething is wrong with yardConfig.\n\nReport will be made with default config.\n\nNote that presented data can be inaccurate.");}
    else if(getYardData() == 0){buildReport();}
    else {alert("Data cannot be collected - Hostler moves are in progress... \nTry again if Hostler moves are completed.");}//Collect and convert data to be easily handled
    //buildReport();
    //showReport(tdata);
    //getYardData();
    //console.log('loto_count: '+loto_count.length);
    //console.log('invalid equipment: '+ invalid_eq.length);
    //console.log('carriers_length: '+carriers.length);
    //console.log('--------------------------');
    console.log('atseu: '+atseu.length);
    console.log(atseu);
    console.log('aiszo: '+aiszo.length);
    console.log(aiszo);
    console.log('aspsp: '+aspsp.length);
    console.log(aspsp);
    console.log('aduag: '+aduag.length);
    console.log(aduag);
    console.log('duna: '+duna.length);
    console.log(duna);
    console.log('detr: '+detr.length);
    console.log(detr);
    console.log('girt: '+girt.length);
    console.log(girt);
    console.log('mikpi: '+mikpi.length);
    console.log(mikpi);
    console.log('other: '+other.length);
    console.log(other);
    console.log('dhl: '+dhl.length);
    console.log(dhl);
    console.log('atpost: '+atpost.length);
    console.log(atpost);
    //console.log('--------------------------');
    console.log("invalidd eq entries:" +invalid_eq.length);
    if(invalid_eq.length > 0)
    {
        var invalidEq = invalidEqBody[0];
        for(var p=0;p<invalid_eq.length;p++)
        {
            console.log((p+1)+'. '+invalid_eq[p]);
            invalidEq += invalid_eq[p];
        }
        invalidEq += invalidEqBody[1];
        report_bones.push(invalidEq);
    }
    else{report_bones.push('<html>');}
    showReport(invalidEq);
}
var invalidEqBody = ['<HTML><table style="border: 2px solid black; width: 800px;"><tr><th style="text-align: left; border: 1px solid black; background-color:orangered; color: lightgoldenrodyellow;">Attention needed:</th>', '</table><br>'];
function getYardConfig(path){
    return 0;
}
var cell_str = " ";
var cell_str2 = " "; //temp string containers
var timedate =" ";
function clock() {var t=new Date();var m=new Date();var d=new Date();var minutes=0;if(m.getMinutes() < 10){minutes='0'+m.getMinutes();}else{minutes=m.getMinutes();}timedate=d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' - '+t.getHours()+':'+minutes;}

function fillRow(cellsNr){
              for(var fill=0;fill<cellsNr;fill++)
              {
                  yardDataTable.push(' -#- ');
              }
          } //fill rest of the row}
function seek(set)
{
//function for
//asset properties loop
    var looper = next_spot_distance-2;
    var asset_index = 0;
    var asset_start = 0;
    for(var e=0;e<looper;e++)
    {
        var tag = 0;
        if(classList[spot_index+e].search(/yard-asset-icon-/i) > -1)
        {
            asset_index++;
            if(gui_values[spot_index+10].search(/loto/i) > -1 && gui_values[spot_index+11].search(/ID not required/i) > -1 && e+9 < looper){yardDataTable.push('LOTO_Y');}//LOTO[4] on spot present
            else {yardDataTable.push('LOTO_N');} // no LOTO
            yardDataTable.push(classList[spot_index+e].substr(32, 8)); // [5] - 1st type
            //
            if(classList[spot_index+e].search(/TRACTOR/i) > -1){yardDataTable.push('  ^  ');}
            else if(classList[spot_index+e].search(/TRACTOR/i) == -1 && (classList[spot_index+e].search(/yardasset-empty/i) > -1 || classList[spot_index+e].search(/yardasset-in-progress/i) > -1 || classList[spot_index+e].search(/yardasset-loading-paused/i) > -1))
            {
                yardDataTable.push('EMPTY');
            } //EMPTY
            else if(classList[spot_index+e].search(/yardasset-full/i) > -1){yardDataTable.push('FULL_');} //FULL
        //console.log('single asset found @ '+gui_values[spot_index]+' as: '+classList[spot_index+e].substr(32, 9)+' that is >-'+yardDataTable[yardDataTable.length-1]+'-<');
            //
            if(classList[spot_index+e+2].search(/yard-asset-red/i) > -1){tag++;}
            if(classList[spot_index+e+3].search(/yard-asset-yellow/i) > -1){tag=tag+10;}
            if(classList[spot_index+e+4].search(/yard-asset-storage/i) > -1){tag=tag+100;}
            yardDataTable.push(tag); // 0-no tag / 1-red / 10-yellow / 100-storage / 101-red storage / 110 yello storage / 111 - red yello storage
            no_err = 100; //no error indicator if == 100 assset found
            var runner = 0;
            for(var x = spot_index+e;x<spot_index+next_spot_distance;x++)
            {
                if(classList[x].search(/shipclerk-bold-label ng-binding/i) >-1){runner++;}
                if(classList[x].search(/shipclerk-bold-label ng-binding/i) >-1 && runner == asset_index)
                {
                    asset_start = x;
                    //console.log('current asset_index: '+asset_start+ " -> "+classList[asset_start]+" = "+gui_values[asset_start]);
                    if(classList[asset_start].search(/shipclerk-bold-label ng-binding/i) > -1) //asset indicator / visit reason
                    {
                        var asset_txt = " ";
                        var time_index = 0;
                        cell_str=gui_values[asset_start];
                        //VISIT_REASON
                        if(cell_str.search(/inbound/i) >-1){yardDataTable.push('VR_IB');}
                        else if(cell_str.search(/outbound/i) >-1){yardDataTable.push('VR_OB');}
                        else if(cell_str.search(/non-inventory/i) >-1){yardDataTable.push('VR_NI');}
                        else
                        {
                            //console.log('No Visit reason for: '+gui_values[spot_index]);
                            yardDataTable.push('NO_VR');
                        }
                        //License plate
                        if(gui_values[asset_start+1].search(/not required/i) > -1 || gui_values[asset_start+1].search(/update/i) > -1)
                        {
                            yardDataTable.push('NO_LP_NR');
                        }
                        else
                        {
                            asset_txt =gui_values[asset_start+1];
                            yardDataTable.push(asset_txt);
                            if(td_classes.indexOf(asset_txt) > -1)
                            {
                                time_index = td_classes.indexOf(asset_txt);
                            }
                        }
                        //Asset Id
                        if(gui_values[asset_start+2] == 'Vehicle ID not required')
                        {
                            yardDataTable.push('NO_ID_NR');
                        }
                        else
                        {
                            asset_txt =gui_values[asset_start+2];
                            yardDataTable.push(asset_txt);
                            if(td_classes.indexOf(asset_txt) > -1)
                            {
                                time_index = td_classes.indexOf(asset_txt) - 1;
                            }
                        }
                        //console.log(time_index + td_classes[time_index+2]);
                        //Time on yard
                        yardDataTable.push(td_classes[time_index+2]);
                        //Owner
                        if(asset_start+3 < spot_index+next_spot_distance){ yardDataTable.push(gui_values[asset_start+3]);}
                        console.log(gui_values[asset_start+3]);
                        asset_start = asset_start+15;
                    }
                }
            }
        }
        else if(no_err==0){no_err++;}
        else if(classList[spot_index+e].search(/yard-asset-icon-/i) == -1 && e == looper ){console.log('Error @ '+gui_values[spot_index]+' no asset indicator found -> '+classList[spot_index+e]+' -> '+gui_values[spot_index+e]);error_container.push('Error @ '+gui_values[spot_index]+' no asset indicator -> '+classList[spot_index+e]+' -> '+gui_values[spot_index+e]);}
    }
    if(set > 0)//fill missing asset (type + tag)
    {
        fillRow(set*9);
              set = 0;
    }

}

function getYardData(){
    gui_nodes = document.querySelectorAll('div');
    td_nodes = document.querySelectorAll('td');
    for(var z=0;z<td_nodes.length;z++)
    {
        if(td_nodes[z].className == 'col4')
        {
            if(td_nodes[z+2].innerText == 'License plate not required' || 	td_nodes[z+2].innerText == 'Update license plate details')
            {
                td_classes.push('NULL');
            }
            else {td_classes.push(td_nodes[z+2].innerText);}
            if(td_nodes[z+3].innerText == 'Vehicle ID not required')
            {
                td_classes.push('NULL');
            }
            else {td_classes.push(td_nodes[z+3].innerText);}
            td_classes.push(td_nodes[z].innerText);
            td_classes.push('<br>');
        }
    }
    spot_index=classList.indexOf('short-name-distinguished');//find first spot index [gate/parking]
    for(var a=0;a<gui_nodes.length;a++) //prepare data to work
    {
        if(td_values.length<td_nodes.length){td_values.push(td_nodes[a].innerText);ultra2.push(td_nodes[a].className + " " +td_nodes[a].innerText+'<br>');}
        classList.push(gui_nodes[a].className);
        gui_values.push(gui_nodes[a].innerText);
        ultra.push("  "+a+". "+ gui_nodes[a].className +'   -----------=-----------    '+ gui_nodes[a].innerText +'<br>');
        if(spot_index<classList.length && classList.indexOf('short-name-distinguished', spot_index) > -1){
            spot_count.push(classList.indexOf('short-name-distinguished', spot_index));//get rows where spot names are
            spot_index=classList.indexOf('short-name-distinguished', spot_index)+3;
            td_spots.push(td_values.indexOf(spot_count[spot_count.length-1],td_index));//get td rows where spot names are
            td_index=td_spots[td_spots.length-1]+2;
        }
    }
    var search_td = 0;
    for(var b=0;b<spot_count.length;b++)
    {
        var search_index = 0; //index for search
        var location_type = " "; //0
        var spot_ib_ob = " "; //2
        var at_spot = 0; //0-empty 1-asset 2-eg.2xSB 3-eg.3xsb
        spot_index=spot_count[b];
        cell_str=classList[spot_index];
        if(cell_str.search(/short-name-distinguished/i) > -1 && classList[spot_index-1].search(/location-type/i) > -1 && classList[spot_index-1].search(/location-type/i) < 2)
        {
            search_index = classList[spot_index-1].search(/location-type-/i);
            location_type = classList[spot_index-1].substr(search_index+14, 15);
            if(location_type.search(/processing/i) > -1 && location_type.search(/processing/i) < 2){yardDataTable.push('PROC');} //Type Process/Gate [0]
            else if(location_type.search(/parkingLocation/i) > -1){yardDataTable.push('PARK');} //Parking [0]
            else {yardDataTable.push('NULL');console.log('Error with location_type: '+spot_count[b]+' || '+classList[spot_index-1]+' -^- '+gui_values[spot_index-1]);error_container.push('Error with location_type: '+spot_count[b]+" || "+classList[spot_index-1]+' -^- '+gui_values[spot_index-1]);} //Error

            yardDataTable.push(gui_values[spot_index]); //Spot Name [1]

            search_index = classList[spot_index+1].search(/location-designation-/i);
            spot_ib_ob = classList[spot_index+1].substr(search_index+21, 9); //IB or OB [2]
            if(spot_ib_ob.search(/inbound/i) > -1 && spot_ib_ob.search(/inbound/i) < 2){yardDataTable.push('IB');}//IB / OB or Virtual [2]
            else if(spot_ib_ob.search(/outbound/i) > -1 && spot_ib_ob.search(/outbound/i) < 2){yardDataTable.push('OB');}
            else {yardDataTable.push('NULL');console.log('No designation field: '+spot_count[b]+" || "+classList[spot_index+1]+" > "+gui_values[spot_index+1]);error_container.push('No designation field: '+spot_count[b]+" || "+classList[spot_index+1]+" > "+gui_values[spot_index-1]);}
          //--END of single SPOT COLLECTION
          //--START OF ASSET COLLECTION
          //Free or occupied [nr of assets: 0, 1, 2, 3] - yardDataTable[3]
            var assetString = ' ';
            if(b<spot_count.length && spot_count[b+1]-spot_count[b] > 0){
                next_spot_distance = spot_count[b+1]-spot_count[b];
         //console.log('@ '+gui_values[spot_index]+' Spot distance: '+gui_values[spot_index]+' -> '+gui_values[spot_index+next_spot_distance]+' distance: '+next_spot_distance);
                //
                //IF empty spot
                if(next_spot_distance < 7 && gui_values[spot_index+4].search(/yard-asset-icon-/i) == -1)
                {
                    yardDataTable.push(0);
                    yardDataTable.push('LOTO_N'); // [3]=0 - free +  [4]Loto 'N'
                    fillRow(27); //Insert 44 cells
                    //console.log('yardDataTable.length: '+yardDataTable.length);

                }
                //SOLO / TRAILER / 1xSB
                if(next_spot_distance > 7 && next_spot_distance < 35)
                {
                    yardDataTable.push(1); // [3]=1 - SOLO / TRAILER / 1xSB
                    seek(2); //seek info & add empty 2 asset
                    fillRow(1);
                }
                if(next_spot_distance > 35 && next_spot_distance < 57 && (classList[spot_index+4].search(/multi-vehicle-cell/i) > -1 || classList[spot_index+3].search(/multi-vehicle-cell/i) > -1 || classList[spot_index+2].search(/multi-vehicle-cell/i) > -1))
                {
                    yardDataTable.push(2); // double asset
                    seek(1); //seek info & add empty 1 asset
                    fillRow(1);
                }
                if(next_spot_distance > 60 && next_spot_distance < 78 && (classList[spot_index+4].search(/multi-vehicle-cell/i) > -1 || classList[spot_index+3].search(/multi-vehicle-cell/i) > -1 || classList[spot_index+2].search(/multi-vehicle-cell/i) > -1))
                {
                    yardDataTable.push(3); // triple asset
                    seek(0); //seek info - 0 add
                    fillRow(1);
                }
                //console.log('yardDataTable: '+yardDataTable.length);
            }
        }
    }
    var index = classList.indexOf('short-name-distinguished');
    console.log('fc code: '+fc_code);
    //console.log('gui_nodes: '+gui_nodes.length);
    //console.log('classList: '+classList.length);
    //console.log('gui_values: '+gui_values.length);
    //console.log('td_values: '+td_values.length);
    //console.log('td_spots: '+td_spots.length);
    //console.log('td_values->IB101: '+td_values.indexOf('IB101'));
    //console.log('index: '+index+" -> "+classList[index+1].substr(21,7)+" "+classList[index-1].substr(14,18)+" "+gui_values[index]+" "+classList[index+3].substr(0,5));
    //console.log('next index: '+classList.indexOf('short-name-distinguished',index+1));
    console.log('spot_count: '+spot_count.length);
    if(error_container != null && error_container != undefined && error_container.length > 0)
    {
        console.log('There was '+error_container.length+' errors...');
        for(var d=0;d<error_container.length;d++){console.log((d+1)+". "+error_container[d]);}
    }
    makePreview();
    var check = 0;
    for(var j=0;j<yardDataTable.length;j=j+32)
    {
        if(yardDataTable[j].search(/proc/i) > -1 || yardDataTable[j].search(/park/i) > - 1)
        {
            check++;
        }
    }
    if(check == spot_count.length)
    {
        console.log('check: '+ check);
        console.log((yardDataTable.length/32));
        return 0;
    }
    else { console.log('check: '+ check + '\n Spot count: '+spot_count.length);return -1;}
}

function makePreview() //prepare prewiev
{
    var yardStr = " ";
    var preview = " ";
    var row_length = 0; //cells in one row
    var row_count = 1;
    var spacer = ['- ', '  - ', '    - '];
    var spc = 2;
    for(var c=0;c<yardDataTable.length;c++)
    {
        yardStr += yardDataTable[c]+' ';
        row_length++;
        if(row_length == 32)
        {
            if(row_count > 99){spc = 0;}
            else if(row_count > 9){spc = 1;}
            else if(row_count < 10){spc = 2;}
            preview += row_count+"."+spacer[spc]+yardStr+"<br>";
            row_length = 0;
            row_count++;
            yardStr=' ';
        }
    }
    showReport(preview);

    //showReport(ultra);
    //showReport(td_classes);
}
function showReport(content){var win = window.open("", '_blank');win.document.write(content);}
function buildReport(){
    console.log('Building report...');
    var entry_length = 32; //row length in the yardarray - PARSER CONFIG
    console.log('yard: '+yardDataTable.length);
    console.log('yard/row: '+yardDataTable.length/entry_length);
    //console.log('yard[0]: '+yardDataTable[0]+' / '+yardDataTable[32]);
    for(row=0;row<yardDataTable.length;row=row+entry_length)
    {
        var asset_count = 0;
        if(yardDataTable[row].search(/proc/i)>-1)
        {
            if(yardDataTable[row+3] == 0){empty_gate.push(yardDataTable[row+2]);} //is empty
            else if(yardDataTable[row+3]>0){
                gate_count.push(yardDataTable[row+2]); //+IB / OB
                checkLoto();
                asset_count = yardDataTable[row+3];
                getAssetInfo(row);}
            else{console.log('Error: GATE - yardDataTable asset_count - '+yardDataTable[row+1]);}
        }
        else if(yardDataTable[row].search(/park/i)>-1) //parking
        {
            if(yardDataTable[row+3] == 0){empty_ps.push(yardDataTable[row+2]);} //is empty
            else if(yardDataTable[row+3]>0){
                ps_count.push(yardDataTable[row+2]); //+IB / OB
                checkLoto();
                asset_count = yardDataTable[row+3];
                getAssetInfo(row);}
            else{console.log('Error: PARK - yardDataTable asset_count - '+yardDataTable[row+1]);}
        }
    }
    var ps_utilization = ((ps_count.length-empty_ps.length)/ps_count)*100;
    var empty_places = empty_ps.length+empty_gate.length;
    var yard_cap = ps_count.length+gate_count.length;
    var yard_utilization = ((yard_cap-empty_places)/yard_cap)*100;
    if(ps_utilization > 84)
    {
        report_bones.push("<tr><td class='space'></td><td class='D' style='background-color:orangered;>"+ps_utilization.toPrecision(2)+"%</td>");
    }
    else if(ps_utilization < 84)
    {
        report_bones.push("<tr><td class='space'></td><td class='D'>"+ps_utilization.toPrecision(2)+"%</td>");
    }
    else
    {
         report_bones.push("<tr><td class='space'></td><td class='D'>"+ps_utilization.toPrecision(2)+"%</td>");
    }
    if(yard_utilization > 84)
    {
        report_bones.push("<td class='D' style='background-color:orangered;'>"+yard_utilization.toPrecision(2)+"%</td>");
    }
    else if(yard_utilization < 84)
    {
        report_bones.push("<td class='D'>"+yard_utilization.toPrecision(2)+"%</td>");
    }
    else
    {
         report_bones.push("<td class='D'>"+yard_utilization.toPrecision(2)+"%</td>");
    }
    report_bones.push("<head><style>body{font-family: Verdana, Geneva, Tahoma, sans-serif;}table{border: 1px solid black;}td {text-align: center;}.space{width: 55px;height: 20px;}.title {height: 50px;font-size: 24px;text-align: center;font-weight: bold;}.date{text-align: right;padding-right: 35px;font-weight: bold;}.H {background-color: rgb(167, 196, 233);padding-left: 25px;padding-right: 25px;font-weight: bold;font-size: 14px;}.D {background-color: rgb(241, 241, 222);padding-left: 25px;padding-right: 25px;font-weight: bold;font-size: 14px;}.C {background-color: rgb(214, 231, 226);padding-left: 25px;padding-right: 25px;font-weight: bold;text-align: left;font-size: 14px;}.footer{font-size: 14px;text-align: center;}</style></head>");
    report_bones.push("<body><table id='report'><tr><td class='title' colspan='4'>"+fc_code+" - Yard Health Report</td><td class='date' colspan='3'><span>"+timedate+"</span></td></tr>");
    report_bones.push("<tr><td class='space'></td></tr><tr><td class='space'></td><td class='H'>PS<br>Utilization</td><td class='H'>Yard Utilization</td><td class='H'>Total # on Yard</td><td class='space'></td><td class='H'>Allocated PS</td><td class='space'></td></tr>");
}
function getAssetInfo(spot){
    var offset = [4, 5, 6, 7, 8, 9, 10, 11, 12];
    var asset_buffer = " ";
    var ch = /\W/i;
    var ch_index = 0;
    for(var x=0;x<yardDataTable[spot+3];x++){
        asset_buffer = yardDataTable[spot+offset[8]+(x*9)]; //SCAC select
        if(asset_buffer.search(ch)>-1 && yardDataTable[spot+offset[2]+(x*9)]=="EMPTY"){
            ch_index=asset_buffer.search(ch)+1;
            if(yardDataTable[spot+offset[0]+(x*9)]!="LOTO_Y" && yardDataTable[spot+offset[1]+(x*9)]!="TRACTOR")
            {
                carriers.push(asset_buffer.substr(0,ch_index));
                if(asset_buffer.search(/atseu/i)>-1&&asset_buffer.search(/atseu/i)<5){atseu.push('E_'+yardDataTable[spot+7]);} //empty+tag
                if(asset_buffer.search(/aiszo/i)>-1&&asset_buffer.search(/aiszo/i)<5){aiszo.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/aspsp/i)>-1&&asset_buffer.search(/aspsp/i)<5){aspsp.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/aduag/i)>-1&&asset_buffer.search(/aduag/i)<5){aduag.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/duna/i)>-1&&asset_buffer.search(/duna/i)<5){duna.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/detr/i)>-1&&asset_buffer.search(/detr/i)<5){detr.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/girt/i)>-1&&asset_buffer.search(/girt/i)<5){girt.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/mikpi/i)>-1&&asset_buffer.search(/mikpi/i)<5){mikpi.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/othr/i)>-1&&asset_buffer.search(/othr/i)<5){other.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/dhl/i)>-1&&asset_buffer.search(/dhl/i)<5){dhl.push('E_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/atpst/i)>-1&&asset_buffer.search(/atpst/i)<5){atpost.push('E_'+yardDataTable[spot+7]);}
            }
            console.log('ch_index: '+ch_index+' '+(carriers.length-1)+'# SCAC: '+carriers[carriers.length-1]+' -> '+asset_buffer.substr(ch_index+1,(asset_buffer.length-ch_index)-2));}
        else if(asset_buffer.search(ch)>-1 && yardDataTable[spot+offset[2]+(x*9)]=="FULL"){
            ch_index=asset_buffer.search(ch);
            if(yardDataTable[spot+offset[0]+(x*9)]!="LOTO_Y" && yardDataTable[spot+offset[1]+(x*9)]!="TRACTOR")
            {
                carriers.push(asset_buffer.substr(0,ch_index));
                if(asset_buffer.search(/atseu/i)>-1&&asset_buffer.search(/atseu/i)<5){atseu.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/aiszo/i)>-1&&asset_buffer.search(/aiszo/i)<5){aiszo.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/aspsp/i)>-1&&asset_buffer.search(/aspsp/i)<5){aspsp.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/aduag/i)>-1&&asset_buffer.search(/aduag/i)<5){aduag.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/duna/i)>-1&&asset_buffer.search(/duna/i)<5){duna.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/detr/i)>-1&&asset_buffer.search(/detr/i)<5){detr.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/girt/i)>-1&&asset_buffer.search(/girt/i)<5){girt.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/mikpi/i)>-1&&asset_buffer.search(/mikpi/i)<5){mikpi.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/othr/i)>-1&&asset_buffer.search(/othr/i)<5){other.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/dhl/i)>-1&&asset_buffer.search(/dhl/i)<5){dhl.push('F_'+yardDataTable[spot+7]);}
                if(asset_buffer.search(/atpst/i)>-1&&asset_buffer.search(/atpst/i)<5){atpost.push('F_'+yardDataTable[spot+7]);}
            }
            console.log('ch_index: '+ch_index+' '+(carriers.length-1)+'# SCAC: '+carriers[carriers.length-1]+' -> '+asset_buffer.substr(ch_index+1,(asset_buffer.length-ch_index)-2));}
    }
    //Eqipment validator
    var invalid_option = ['probably valid', 'wrong SCAC/Owner, must be: ATSEU(____)', ' wrong ID, must be VSxxxxxx', 'invalid License plate and Id ', 'N/A - check asset details', 'wrong SCAC - must be ATPST not ATPOST', 'wrong ID - check asset details'];
    var selector = 0;
    var eq_str = [yardDataTable[spot+9], yardDataTable[spot+10], yardDataTable[spot+12], yardDataTable[spot+18], yardDataTable[spot+19], yardDataTable[spot+21], yardDataTable[spot+27], yardDataTable[spot+28], yardDataTable[spot+30]];
    console.log('eq_str - '+eq_str);
    if(eq_str[0] == eq_str[1] || eq_str[0].search(/vs/i)>-1 || eq_str[1].search(/vs/i)>-1 || eq_str[2].search(/ats/i)>4)
    {
        if(eq_str[2].search(/ats/i)>4){selector = 1;}
        if(eq_str[0] == eq_str[1] && eq_str[1].search(/vs/i)>-1){selector = 3;}
        if(eq_str[2].search(/ats/i)>-1 && eq_str[1].search(/vs/i)> -1 && selector == 3){selector = 2;}
        if(eq_str[1].search(/vs/i)>-1 && eq_str[2].search(/atseu/i)==-1){selector = 1;}
        if(selector > 0){
            if(selector ==0){invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATS '+yardDataTable[spot+5]+' '+yardDataTable[spot+10]+' '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[selector]+'&nbsp;&nbsp;</tr>');}
            if(selector ==1){invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATS '+yardDataTable[spot+5]+' '+yardDataTable[spot+10]+' <span style="color: red; font-weight: bold;">'+eq_str[2]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[selector]+'&nbsp;&nbsp;</tr>');}
            if(selector ==2){invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATS '+yardDataTable[spot+5]+' <span style="color: red; font-weight: bold;">'+yardDataTable[spot+10]+'</span> '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[selector]+'&nbsp;&nbsp;</tr>');}
            if(selector ==3){invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATS '+yardDataTable[spot+5]+' <span style="color: red; font-weight: bold;">'+yardDataTable[spot+10]+'</span> '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[selector]+'&nbsp;&nbsp;</tr>');}
            //console.log(invalid_eq[invalid_eq.length-1]);
        }
    }
    if(eq_str[2].search(/atpost/i) > -1 || eq_str[5].search(/atpost/i) > -1 || eq_str[8].search(/atpost/i) > -1)
    {
        if(eq_str[2].search(/atpost/i) > -1 && eq_str[2].search(/atpost/i) < 5)
        {
            invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+5]+' '+yardDataTable[spot+10]+' <span style="color: red; font-weight: bold;">'+eq_str[2]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');
        }
        if(eq_str[5].search(/atpost/i) > -1 && eq_str[5].search(/atpost/i) < 5)
        {
            invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+14]+' '+yardDataTable[spot+19]+' <span style="color: red; font-weight: bold;">'+eq_str[5]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');
        }
        if(eq_str[8].search(/atpost/i) < 5 && eq_str[8].search(/atpost/i) > -1)
        {
            invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+23]+' '+yardDataTable[spot+28]+' <span style="color: red; font-weight: bold;">'+eq_str[8]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');
        }
    }
    if((eq_str[2].search(/atpst/i) > -1 && eq_str[2].search(/atpst/i) < 5) || (eq_str[5].search(/atpst/i) > -1 && eq_str[5].search(/atpst/i) < 5) || (eq_str[8].search(/atpst/i) > -1 && eq_str[8].search(/atpst/i) < 5))
    {
        if(eq_str[1] > 9999 || eq_str[1].search(/[^0-9]/g) > -1)
        {
            if(eq_str[1].search(/#/i)==-1){invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+5]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+10]+'</span> '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}
        }
        if(eq_str[4] > 9999 || eq_str[4].search(/[^0-9]/g) > -1)
        {
            if(eq_str[4].search(/#/i)==-1){invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+14]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+19]+'</span> '+eq_str[5]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}
        }
        if(eq_str[7] > 9999 || eq_str[7].search(/[^0-9]/g) > -1)
        {
            if(eq_str[7].search(/#/i)==-1){invalid_eq.push('<tr><td>'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+23]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+28]+'</span> '+eq_str[8]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}
        }
    }

}

function checkLoto(){if(yardDataTable[row+4]=="LOTO_Y"||yardDataTable[row+13]=="LOTO_Y"||yardDataTable[row+13]=="LOTO_Y"){loto_count.push(yardDataTable[row+1]);}}