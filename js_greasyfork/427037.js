// ==UserScript==
// @name         YardHealth_Generator BCK
// @namespace    localhost :-)
// @version      1.27
// @description  YardHealth Report generation alternative script
// @author       rzlotos
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @match        https://trans-logistics-eu.amazon.com/TOMdashboard
// @icon         https://www.google.com/s2/favicons?domain=amazon.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/427037/YardHealth_Generator%20BCK.user.js
// @updateURL https://update.greasyfork.org/scripts/427037/YardHealth_Generator%20BCK.meta.js
// ==/UserScript==
var resp = ' ';
var anim = document.createElement('style');
var strResponse;
int = 0;
(function() {
    'use strict';
    if(document.getElementsByTagName('title') != undefined && document.URL == 'https://trans-logistics-eu.amazon.com/TOMdashboard')
    {
 
        anim.setAttribute('type','text/css');
        anim.setAttribute('rel','stylesheet');
        anim.setAttribute('href','https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
 
        var title_obj = document.getElementsByTagName('title');
        title_obj[0].innerText = 'KTW3 TOM Live Dashboard';
        document.getElementById('a-page').remove();
        console.clear();
        //inject('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
        document.body.setAttribute('class', 'dashboard');
        document.body.setAttribute('style', 'background-color: black;overflow:hidden;');
        var starfield = document.createElement('div');
        starfield.setAttribute('style', 'position:absolute;top:0px;left:0px;width:100vW;height:100vh;overflow:hidden;');
starfield.innerHTML = '<canvas id="stars"></canvas>';
        var load_splash = document.createElement('div');
        load_splash.innerHTML = '<span id="wait" style="font-size:28px;text-align:center;overflow:hidden;">Please wait....</span>';
        load_splash.setAttribute('id', 'load_splash');
        load_splash.setAttribute('style', 'position:absolute;left:0vh;top:45vh;width:100vw;height:5vh;color:white;text-align:center;z-index:10;');
        starfield.appendChild(load_splash);
        document.body.appendChild(starfield);
fetcher('https://gist.githubusercontent.com/SzybkiLopez666/02a959e4a8d15928385e95222f669338/raw/c52788cb905baab95d1ebe3d3f7300051ab0d5ae/starfield.js',0);
 
        fetcher('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css',1);
        var head = document.head || document.getElementsByTagName('head')[0];
                head.insertBefore(anim, head.lastChild);
        var script = document.createElement('script');
        script.type='text/javascript';
 
 
        head.insertBefore(script, head.lastChild);
document.getElementById('load_splash').setAttribute('class', 'animate__animated animate__heartBeat animate__infinite animate__slower');
    }
 
//SafetyStock declarations:
var ats_ss = 15;
var dhl_ss = 30;
var atpost_ss = 8;
//End of SS declaration
function nemezisLaunch(){var win = window.open("https://trans-logistics-eu.amazon.com/TOMdashboard", '_blank');}
    function fetcher(urel, int)
    {
        GM_xmlhttpRequest(
        {
            method: "GET",
            url: urel,
            onload: function(response) {
            strResponse = response.responseText;
                resp=strResponse.toString();
                if(int == 0 ){script.innerHTML = resp};
                if(int == 1){anim.innerHTML = resp};
 
 
        }
    });
        };
function clock() {var t=new Date();var m=new Date();var d=new Date();var minutes=0;if(m.getMinutes() < 10){minutes='0'+m.getMinutes();}else{minutes=m.getMinutes();}timedate=d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' - '+t.getHours()+':'+minutes;}
  if(document.URL == 'https://trans-logistics-eu.amazon.com/yms/shipclerk/#/yard'){
      setInterval(function(){
    if(document.getElementById("topbar-wrapper") != undefined && document.getElementById("YH_btn") == null || document.getElementById("YH_btn") == undefined){
        var yardhealth_btn = document.createElement('div');
        if(document.getElementsByClassName('a-color-link a-text-bold')[0].innerText.search(/rzlotos/i)>-1)
        {
            yardhealth_btn.innerHTML = '<button id="YH_report" type="button" class="a-button a-button-thumbnail a-spacing-none a-button-base float-left start" style="position:absolute;padding:revert;font-size:12px;">YardHealth</button><button id="nemezis" type="button" class="a-button a-button-thumbnail a-spacing-none a-button-base float-left start" style="position:absolute;left:7em;padding:revert;font-size:12px;">Nemezis</button>';
            yardhealth_btn.setAttribute ('id', 'YH_btn');
            yardhealth_btn.setAttribute ('style', 'position:absolute;left:20em;');
            document.getElementById("title-block").appendChild(yardhealth_btn);
            document.getElementById("YH_report").addEventListener ("click", makeReport, false);
            document.getElementById("nemezis").addEventListener ("click", nemezisLaunch, false);
        }
        else
        {
            yardhealth_btn.innerHTML = '<button id="YH_report" type="button" class="a-button a-button-thumbnail a-spacing-none a-button-base float-left start" style="position:absolute;padding:revert;font-size:12px;">YardHealth</button>';
            yardhealth_btn.setAttribute ('id', 'YH_btn');
            yardhealth_btn.setAttribute ('style', 'position:absolute;left:20em;');
            document.getElementById("title-block").appendChild(yardhealth_btn);
            document.getElementById("YH_report").addEventListener ("click", makeReport, false);
            var fc=document.getElementsByClassName('a-text-bold')[1].innerText;
        }
        if(fc != undefined){fc_code=fc.substr(2, 5);} //get fc code
    }clock();//get time&date
},1000);
}
var invalidEq = " ";
var tdata; //temp var
 
function send()
{
    var mailHtm=msgBody;
    var emailTo='fkonrad@amazon.com\nCC:ktw3-eu-tom-leads@amazon.com; ktw3-eu-tom-team@amazon.com; ktw3-ship-managers@amazon.com; ktw3-ship-clerk@amazon.com; tkusital@amazon.com; ktw3-dock-clerk@amazon.com; erbesd@amazon.com';
    var emailsubject='KTW3 - Yard Health Report - '+timedate;
    var emlCont = 'to: '+emailTo+'\n';emlCont += 'Subject:'+emailsubject+'\n';
    emlCont += 'X-unsent: 1 \n';
    emlCont += 'Content-type: text/html \n';
    emlCont += '\n';
    emlCont += '<!DOCTYPE html><html><head></head><body>'+mailHtm+'</body></html>';
    var textFile = null;
    var data = new Blob([emlCont], {type: 'text/plain'});
    if(textFile !== null){window.URL.revokeObjectURL(textFile);}
    textFile = window.URL.createObjectURL(data);
        var a = document.createElement('a');
        var linkText = document.createTextNode('fileLink');
        a.appendChild(linkText);
        a.href = textFile;a.id = 'fileLink';
        a.download = emailsubject+'.eml';
        a.style.visibility = 'hidden';
        document.body.appendChild(a);
        document.getElementById('fileLink').click();
}
function makeReport(){
    report_bones.push("<html><head><style>body{font-family: Verdana, Geneva, Tahoma, sans-serif;}table{border: 2px solid black;}td {text-align: center;}.space{width: 35px;height: 22px;}.title {height: 50px;font-size: 20px;text-align: center;font-weight: bold;padding-left: 20px;}.date{text-align: right;padding-right: 35px;font-weight: bold; font-size: 18px;}.H {background-color: rgb(150, 196, 248);padding-left: 25px;padding-right: 25px;font-weight: bold;font-size: 14px;}.H2 {background-color: rgb(150, 196, 248);padding-left: 25px;padding-right: 25px;font-weight: bold;font-size: 14px;}.D {background-color: rgb(241, 241, 231);padding-left: 20px;padding-right: 20px;font-weight: bold;font-size: 14px;}.D2 {background-color: rgb(214, 233, 241);padding-left: 20px;padding-right: 20px;font-weight: bold;font-size: 14px;}.C {background-color: rgb(230, 238, 243);padding-left: 20px;padding-right: 20px;font-weight: bold;text-align: left;font-size: 14px;}.C2 {background-color: rgb(219, 232, 241);padding-left: 20px;padding-right: 20px;font-weight: bold;text-align: left;font-size: 14px;}.footer{font-size: 12px;text-align: center;}</style></head><body>");
    if(getYardConfig(yardConfigUrl) == -1){alert("Warning!\nSomething is wrong with yardConfig.\n\nReport will be made with default config.\n\nNote that presented data can be inaccurate.");}
    else if(getYardData() == 0){buildReport();showReport(report_str); send(); console.log('dwell24 '+dwell24.length+' dwell48 '+dwell48.length);}
    else {alert("Data cannot be collected - Hostler moves are in progress... \nTry again when hostler moves are completed.");}}
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
    //simple yard config
    var ps_count = new Array();
    var gate_count = new Array();
    //other data
    var empty_gate = new Array();
    var empty_ps = new Array();
    var loto_count = new Array();
 var row = 0;
var invalidEqBody = ['<HTML><table style="border: 2px solid black; width: 900px; font-size:14px;"><tr><th style="text-align: left; border: 1px solid black; background-color:orangered; color: lightgoldenrodyellow;">Attention needed:</th>', '</table><br>'];
function getYardConfig(path){return 0;}
var cell_str = " ";
var cell_str2 = " "; //temp string containers
var timedate =" ";
function fillRow(cellsNr){for(var fill=0;fill<cellsNr;fill++){yardDataTable.push(' -#- ');}} //fill rest of the row}
function seek(set){
    var looper = next_spot_distance-2;
    var asset_index = 0;
    var asset_start = 0;
    for(var e=0;e<looper;e++){
        var tag = 0;
        if(classList[spot_index+e].search(/yard-asset-icon-/i) > -1){
            asset_index++;
            if(gui_values[spot_index+10].search(/loto/i) > -1 && gui_values[spot_index+11].search(/ID not required/i) > -1 && e+9 < looper){yardDataTable.push('LOTO_Y');}//LOTO[4] on spot present
            else {yardDataTable.push('LOTO_N');} // no LOTO
            yardDataTable.push(classList[spot_index+e].substr(32, 8)); // [5] - 1st type
            if(classList[spot_index+e].search(/TRACTOR/i) > -1){yardDataTable.push('  ^  ');}
            else if(classList[spot_index+e].search(/TRACTOR/i) == -1 && (classList[spot_index+e].search(/yardasset-empty/i) > -1 || classList[spot_index+e].search(/yardasset-in-progress/i) > -1 || classList[spot_index+e].search(/yardasset-loading-paused/i) > -1)){yardDataTable.push('EMPTY');} //EMPTY
            else if(classList[spot_index+e].search(/yardasset-full/i) > -1){yardDataTable.push('FULL_');}
            if(classList[spot_index+e+2].search(/yard-asset-red/i) > -1){tag++;}
            if(classList[spot_index+e+3].search(/yard-asset-yellow/i) > -1){tag=tag+10;}
            if(classList[spot_index+e+4].search(/yard-asset-storage/i) > -1){tag=tag+100;}
            yardDataTable.push(tag); // 0-no tag / 1-red / 10-yellow / 100-storage / 101-red storage / 110 yello storage / 111 - red yello storage
            no_err = 100; //no error indicator if == 100 assset found
            var runner = 0;
            for(var x = spot_index+e;x<spot_index+next_spot_distance;x++){
                if(classList[x].search(/shipclerk-bold-label ng-binding/i) >-1){runner++;}
                if(classList[x].search(/shipclerk-bold-label ng-binding/i) >-1 && runner == asset_index){
                    asset_start = x;
                    if(classList[asset_start].search(/shipclerk-bold-label ng-binding/i) > -1) //asset indicator / visit reason
                    {
                        var asset_txt = " ";
                        var time_index = 0;
                        cell_str=gui_values[asset_start];
                        //VISIT_REASON
                        if(cell_str.search(/inbound/i) >-1){yardDataTable.push('VR_IB');}
                        else if(cell_str.search(/outbound/i) >-1){yardDataTable.push('VR_OB');}
                        else if(cell_str.search(/non-inventory/i) >-1){yardDataTable.push('VR_NI');}
                        else{yardDataTable.push('NO_VR');}
                        //License plate
                        if(gui_values[asset_start+1].search(/not required/i) > -1 || gui_values[asset_start+1].search(/update/i) > -1){yardDataTable.push('NO_LP_NR');}
                        else{
                            asset_txt =gui_values[asset_start+1];
                            yardDataTable.push(asset_txt);
                            if(td_classes.indexOf(asset_txt) > -1){time_index = td_classes.indexOf(asset_txt);}
                        }
                        //Asset Id
                        if(gui_values[asset_start+2] == 'Vehicle ID not required'){yardDataTable.push('NO_ID_NR');}
                        else{
                            asset_txt =gui_values[asset_start+2];
                            yardDataTable.push(asset_txt);
                            if(td_classes.indexOf(asset_txt) > -1){time_index = td_classes.indexOf(asset_txt) - 1;}
                        }
                        //Time on yard
                        yardDataTable.push(td_classes[time_index+2]);
                        //Owner
                        if(asset_start+3 < spot_index+next_spot_distance){ yardDataTable.push(gui_values[asset_start+3]);}
                        //console.log(gui_values[asset_start+3]);
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
const configLoader = "config loader goes here";
const yardConfigUrl = "--------------"; //yardConfig path to download
var fc_code = " "; //FC codename eg.KTW3
var gui_nodes;
var td_nodes;
var reportConfig = new Array();
var yardDataTable = new Array();
 
var invalid_eq = new Array();
var ultra = new Array();
var ultra2 = new Array();
var report_str = " ";
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
var preview = " ";
function getYardData(){
    gui_nodes = document.querySelectorAll('div');
    td_nodes = document.querySelectorAll('td');
    for(var z=0;z<td_nodes.length;z++){
        if(td_nodes[z].className == 'col4'){
            if(td_nodes[z+2].innerText == 'License plate not required' || 	td_nodes[z+2].innerText == 'Update license plate details'){td_classes.push('NULL');}
            else {td_classes.push(td_nodes[z+2].innerText);}
            if(td_nodes[z+3].innerText == 'Vehicle ID not required'){td_classes.push('NULL');}
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
    for(var b=0;b<spot_count.length;b++){
        var search_index = 0; //index for search
        var location_type = " "; //0
        var spot_ib_ob = " "; //2
        var at_spot = 0; //0-empty 1-asset 2-eg.2xSB 3-eg.3xsb
        spot_index=spot_count[b];
        cell_str=classList[spot_index];
        if(cell_str.search(/short-name-distinguished/i) > -1 && classList[spot_index-1].search(/location-type/i) > -1 && classList[spot_index-1].search(/location-type/i) < 2){
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
            else {
                yardDataTable.push('NULL');
                console.log('No designation field: '+spot_count[b]+" || "+classList[spot_index+1]+" > "+gui_values[spot_index+1]);
                error_container.push('No designation field: '+spot_count[b]+" || "+classList[spot_index+1]+" > "+gui_values[spot_index-1]);
            }
            if(gui_values[spot_index-1].search(/virtual/i) > -1)
            {
                yardDataTable.push('0');
               yardDataTable.push('LOTO_N');
                fillRow(27);
                continue;
            }
          //--END of single SPOT COLLECTION
          //--START OF ASSET COLLECTION
          //Free or occupied [nr of assets: 0, 1, 2, 3] - yardDataTable[3]
            var assetString = ' ';
            if(b<spot_count.length && spot_count[b+1]-spot_count[b] > 0){
                next_spot_distance = spot_count[b+1]-spot_count[b];
                //IF empty spot
                if(next_spot_distance < 7 && gui_values[spot_index+4].search(/yard-asset-icon-/i) == -1){
                    yardDataTable.push(0);
                    yardDataTable.push('LOTO_N'); // [3]=0 - free +  [4]Loto 'N'
                    fillRow(27); //Insert 44 cells
                    }
                //SOLO / TRAILER / 1xSB
                if(next_spot_distance > 7 && next_spot_distance < 35){
                    yardDataTable.push(1); // [3]=1 - SOLO / TRAILER / 1xSB
                    seek(2); //seek info & add empty 2 asset
                    fillRow(1);
                }
                if(next_spot_distance > 35 && next_spot_distance < 57 && (classList[spot_index+4].search(/multi-vehicle-cell/i) > -1 || classList[spot_index+3].search(/multi-vehicle-cell/i) > -1 || classList[spot_index+2].search(/multi-vehicle-cell/i) > -1)){
                    yardDataTable.push(2); // double asset
                    seek(1); //seek info & add empty 1 asset
                    fillRow(1);
                }
                if(classList[spot_index+24].search(/hostler/i) == -1 && next_spot_distance > 57 && next_spot_distance < 80 && (classList[spot_index+4].search(/multi-vehicle-cell/i) > -1 || classList[spot_index+3].search(/multi-vehicle-cell/i) > -1 || classList[spot_index+2].search(/multi-vehicle-cell/i) > -1)){
                    yardDataTable.push(3); // triple asset
                    seek(0); //seek info - 0 add
                    fillRow(1);
                }
                if(next_spot_distance > 45 && (classList[spot_index+21].search(/ownerVehicleMoveFlag/i) > -1 || classList[spot_index+20].search(/ownerVehicleMoveFlag/i) > -1 || classList[spot_index+24].search(/hostler/i) > -1))
                {
                    yardDataTable.push(2); //hosler move anyway...
                    seek(0);
                    fillRow(1);
                }
            }
        }
    }
    var index = classList.indexOf('short-name-distinguished');
    if(error_container != null && error_container != undefined && error_container.length > 0){
        console.log('There was '+error_container.length+' errors...');
        for(var d=0;d<error_container.length;d++){console.log((d+1)+". "+error_container[d]);}
    }
    //makePreview();
    var check = 0;
    var limit = yardDataTable.length;
    for(var j=0;j<limit;j=j+32)
    {
        //if(j>=limit){j=yardDataTable.length;}
        console.log('j '+j+' ydt: '+yardDataTable.length+' - '+yardDataTable[j+1]);
        try {
            var qq = yardDataTable[j].search(/proc/i);
            var ww = yardDataTable[j].search(/park/i);
        }
        catch {
            console.log('error: yardDataTable[j].search(/proc/i) = '+ qq +' yardDataTable[j].search(/park/i); = '+ww + ' yardDataTable['+j+'] - '+yardDataTable[j]);
        }
        if(yardDataTable[j].search(/proc/i) > -1 || yardDataTable[j].search(/park/i) > - 1)
        {
            check++;
        }
    }
    if(check == spot_count.length){return 0;}
    else
    {
        console.log('check: '+ check + '\n Spot count: '+spot_count.length);
 
        return -1;
    }
}
function makePreview(){
    var yardStr = " ";
    var row_length = 0; //cells in one row
    var row_count = 1;
    var spacer = ['- ', '  - ', '    - '];
    var spc = 2;
    for(var c=0;c<yardDataTable.length;c++){
        yardStr += yardDataTable[c]+' ';
        row_length++;
        if(row_length == 32){
            if(row_count > 99){spc = 0;}
            else if(row_count > 9){spc = 1;}
            else if(row_count < 10){spc = 2;}
            preview += row_count+"."+spacer[spc]+yardStr+"<br>";
            row_length = 0;
            row_count++;
            yardStr=' ';
        }
    }
    //
 
    showReport(preview);
    //
    //showReport(classList);
    //showReport(ultra);
    //
 
    //showReport(td_classes);
}
function showReport(content){var win = window.open("", '_blank');win.document.write(content);}
var asset_count = new Array();
var empty_atseu = new Array();
    var empty_dhl = new Array();
    var empty_atpost = new Array();
    var empty_aiszo = new Array();
    var empty_aspsp = new Array();
    var empty_aduag = new Array();
    var empty_duna = new Array();
    var empty_detr = new Array();
    var empty_girt = new Array();
    var empty_mikpi = new Array();
    var empty_other = new Array();
var msgBody = " ";
 
function getDwell(spot){
    var dwelltime;
    if(yardDataTable[spot+12].search(/store/i) == -1 && yardDataTable[spot].search(/park/i) > -1 && yardDataTable[spot+6].search(/full/i) > -1 &&yardDataTable[spot+8].search(/OB/i) == -1 && yardDataTable[spot+11].search(/[0-9]/g) > -1 && yardDataTable[spot+11].length > 4)
    {
        dwelltime = yardDataTable[spot+11].substr(0,2);
        if(dwelltime > 24 && dwelltime < 47){dwell24.push(yardDataTable[spot+1]);}
        if(dwelltime > 47 || yardDataTable[spot+11].search(/week/i) > -1 || yardDataTable[spot+11].search(/month/i) > -1 || yardDataTable[spot+11].search(/year/i) > -1){dwell48.push(yardDataTable[spot+1]);}
    }
}
function buildReport(){
    var entry_length = 32; //row length in the yardarray - PARSER CONFIG
    for(row=0;row<yardDataTable.length;row=row+entry_length){
        if(yardDataTable[row].search(/proc/i)>-1){
            if(yardDataTable[row+3] == 0){empty_gate.push(yardDataTable[row+2]);} //is empty
            else if(yardDataTable[row+3]>0){
                gate_count.push(yardDataTable[row+2]); //+IB / OB
                checkLoto();
                getAssetInfo(row);
            getDwell(row);}
            else{console.log('Error: GATE - yardDataTable asset_count - '+yardDataTable[row+1]);}
        }
        else if(yardDataTable[row].search(/park/i)>-1){
            if(yardDataTable[row+3] == 0){empty_ps.push(yardDataTable[row+2]);} //is empty
            else if(yardDataTable[row+3]>0){
                ps_count.push(yardDataTable[row+2]); //+IB / OB
                checkLoto();
                getAssetInfo(row);
            getDwell(row);}
            else{console.log('Error: PARK - yardDataTable asset_count - '+yardDataTable[row+1]);}
        }
    }
 
    var ps_total = ps_count.length+empty_ps.length;
    var ps_utilization = ((ps_total-empty_ps.length)/ps_total)*100;
    var empty_places = empty_ps.length+empty_gate.length;
    var yard_cap = ps_count.length+gate_count.length+empty_ps.length+empty_gate.length;
    var yard_utilization = ((yard_cap-empty_places)/yard_cap)*100;
    console.log('ps_total '+ps_total+' empty_ps '+empty_ps.length+' empty_gate '+empty_gate.length+' yard_cap '+yard_cap+' ps_count '+ps_count.length);
    if(invalid_eq.length > 0){
        invalidEq = invalidEqBody[0];
        for(var p=0;p<invalid_eq.length;p++){
            //console.log((p+1)+'. '+invalid_eq[p]);
            invalidEq += invalid_eq[p];
        }
        invalidEq += invalidEqBody[1];
        
    }
    console.log('yd util: '+yard_utilization.toPrecision(2)+' ps util '+ps_utilization.toPrecision(2));
    report_bones.push("<table id='report'><tr><td class='title' colspan='3'>"+fc_code+" - Yard Health Report</td><td class='date' colspan='2'><span>"+timedate+"</span></td><td class='space'></td></tr>");
    report_bones.push("<tr><td class='space'></td></tr><tr><td class='space'></td><td class='H'>PS<br>Utilization</td><td class='H'>Yard Utilization</td><td class='H'>Total # on Yard</td><td class='H'>Allocated PS</td><td class='space'></td></tr>");
    if(ps_utilization.toPrecision(2) > 85){report_bones.push("<tr><td class='space'></td><td class='D' style='background-color:orangered';>"+ps_utilization.toPrecision(2)+"%</td>");}
    else if(ps_utilization.toPrecision(2) < 84){report_bones.push("<tr><td class='space'></td><td class='D'>"+ps_utilization.toPrecision(2)+"%</td>");}
    else{report_bones.push("<tr><td class='space'></td><td class='D'>"+ps_utilization.toPrecision(2)+"%</td>");}
    if(yard_utilization > 84){report_bones.push("<td class='D' style='background-color:orangered;'>"+yard_utilization.toPrecision(2)+"%</td>");}
    else if(yard_utilization < 85){report_bones.push("<td class='D'>"+yard_utilization.toPrecision(2)+"%</td>");}
    else{report_bones.push("<td class='D'>"+yard_utilization.toPrecision(2)+"%</td>");}
    report_bones.push("<td class='D'>"+asset_count+"</td>");
    var allocated_ps = ps_count - empty_ps.length;
    report_bones.push("<td class='D'>"+(ps_total-empty_ps.length)+"</td>");
    report_bones.push("<tr><td class='space'></td></tr><tr><td class='space'></td><td class='H' colspan='4'>Trailer pool view</td></tr><tr><td class='space'></td><td class='H' colspan='1' style='text-align: left;'>[Carrier]</td><td class='H'>FULL</td><td class='H'>EMPTY</td><td class='H'>Delta</td></tr>"); //next table
    report_bones.push("<tr><td class='space'></td><td class='C' colspan='1'>ATSEU</td>"); //ATSEU row
    report_bones.push("<td class='D'>"+(atseu.length)+"</td><td class='D'>"+empty_atseu.length+"</td>");
    if(empty_atseu.length < ats_ss){report_bones.push("<td class='D' style='backgroud-color:orangered;'>"+(empty_atseu.length-ats_ss)+"</td></tr>");}
    else if(empty_atseu.length > ats_ss){report_bones.push("<td class='D'>"+(empty_atseu.length-ats_ss)+"</td></tr>");}
    report_bones.push("<tr><td class='space'></td><td class='C2' colspan='1'>AISZO</td><td class='D2'>"+(aiszo.length)+"</td><td class='D2'>"+empty_aiszo.length+"</td><td class='D2'>0</td></tr>"); //AISZO
    report_bones.push("<tr><td class='space'></td><td class='C' colspan='1'>ASPSP</td><td class='D'>"+(aspsp.length)+"</td><td class='D'>"+empty_aspsp.length+"</td><td class='D'>0</td></tr>"); //ASPSP
    report_bones.push("<tr><td class='space'></td><td class='C2' colspan='1'>ADUAG</td><td class='D2'>"+(aduag.length)+"</td><td class='D2'>"+empty_aduag.length+"</td><td class='D2'>0</td></tr>"); //ADUAG
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
    if(empty_ps.length < 20){report_bones.push("<tr><td class='space' colspan='2'></td><td class='D'>"+(ps_total-empty_ps.length)+"</td><td class='D' style='background-color:orangered;'>"+empty_ps.length+"</td>");}
    else if(empty_ps.length > 19){report_bones.push("<tr><td class='space' colspan='2'></td><td class='D'>"+(ps_total-empty_ps.length)+"</td><td class='D'>"+empty_ps.length+"</td>");} //empty vs full PS
    if(invalid_eq.length > 0){report_bones.push("<td class='D'>"+loto_count.length+"</td></tr><tr><td class='footer' colspan='2'># of Invalid Eq on yard: "+invalid_eq.length+"</td><td class='space' colspan='2'></td><td class='footer'>v.1.27 script by rzlotos</td></tr></table><br><br></body>");}
    else{report_bones.push("<td class='D'>"+loto_count.length+"</td></tr><tr><td class='space'></td></tr><tr><td class='space' colspan='4'></td><td class='footer'>v.1.25 script by rzlotos</td></tr></table><br><br></body>");}
    for(var rep = 0; rep < report_bones.length; rep++){msgBody += report_bones[rep];}
    report_str = invalidEq;
    report_str += msgBody;
 
}
function getAssetInfo(spot){
    var offset = [4, 5, 6, 7, 8, 9, 10, 11, 12];
    var asset_buffer = " ";
    var ch = /\W/i;
    var ch_index = 0;
    for(var x=0;x<yardDataTable[spot+3];x++)
    {
        if((spot+offset[8]+(x*9))<yardDataTable.length){
                        asset_buffer = yardDataTable[spot+offset[8]+(x*9)]; //SCAC select and continue
        }
        if(asset_buffer.search(ch)>-1 && yardDataTable[spot+offset[2]+(x*9)]=="EMPTY"){ch_index=asset_buffer.search(ch)+1;
            if(yardDataTable[spot+offset[0]+(x*9)]!="LOTO_Y" && yardDataTable[spot+offset[1]+(x*9)]!="TRACTOR"){
                asset_count++;
                carriers.push(asset_buffer.substr(0,ch_index));
                if(asset_buffer.search(/atseu/i)>-1&&asset_buffer.search(/atseu/i)<5){empty_atseu.push('E'+yardDataTable[spot+7]);} //empty+tag
                if(asset_buffer.search(/aiszo/i)>-1&&asset_buffer.search(/aiszo/i)<5){empty_aiszo.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/aspsp/i)>-1&&asset_buffer.search(/aspsp/i)<5){empty_aspsp.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/aduag/i)>-1&&asset_buffer.search(/aduag/i)<5){empty_aduag.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/duna/i)>-1&&asset_buffer.search(/duna/i)<5){empty_duna.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/detr/i)>-1&&asset_buffer.search(/detr/i)<5){empty_detr.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/girt/i)>-1&&asset_buffer.search(/girt/i)<5){empty_girt.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/mikpi/i)>-1&&asset_buffer.search(/mikpi/i)<5){empty_mikpi.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/othr/i)>-1&&asset_buffer.search(/othr/i)<5){empty_other.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/dhl/i)>-1&&asset_buffer.search(/dhl/i)<5&&yardDataTable[spot].search(/park/i)>-1){empty_dhl.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/atpst/i)>-1&&asset_buffer.search(/atpst/i)<5&&yardDataTable[spot].search(/park/i)>-1){empty_atpost.push(yardDataTable[spot+7]);}
            }
        }
        else if(asset_buffer.search(ch)>-1 && yardDataTable[spot+offset[2]+(x*9)].search(/FULL/i)>-1){
            ch_index=asset_buffer.search(ch)+1;
            if(yardDataTable[spot+offset[0]+(x*9)]!="LOTO_Y" && yardDataTable[spot+offset[1]+(x*9)]!="TRACTOR"){
                asset_count++;
                carriers.push(asset_buffer.substr(0,ch_index));
                if(asset_buffer.search(/atseu/i)>-1&&asset_buffer.search(/atseu/i)<5){atseu.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/aiszo/i)>-1&&asset_buffer.search(/aiszo/i)<5){aiszo.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/aspsp/i)>-1&&asset_buffer.search(/aspsp/i)<5){aspsp.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/aduag/i)>-1&&asset_buffer.search(/aduag/i)<5){aduag.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/duna/i)>-1&&asset_buffer.search(/duna/i)<5){duna.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/detr/i)>-1&&asset_buffer.search(/detr/i)<5){detr.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/girt/i)>-1&&asset_buffer.search(/girt/i)<5){girt.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/mikpi/i)>-1&&asset_buffer.search(/mikpi/i)<5){mikpi.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/othr/i)>-1&&asset_buffer.search(/othr/i)<5){other.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/dhl/i)>-1&&asset_buffer.search(/dhl/i)<5&&yardDataTable[spot].search(/park/i)>-1){dhl.push(yardDataTable[spot+7]);}
                if(asset_buffer.search(/atpst/i)>-1&&asset_buffer.search(/atpst/i)<5&&yardDataTable[spot].search(/park/i)>-1){atpost.push(yardDataTable[spot+7]);}
            }
        }
    }
    //Eqipment validator
    var invalid_option = ['probably valid', 'wrong SCAC/Owner, must be: ATSEU(____)', ' wrong ID, must be VSxxxxxx', 'invalid License plate and Id ', 'N/A - check asset details', 'wrong SCAC - must be ATPST(ATPST)', 'wrong ID - check asset details', 'wrong SCAC - must be DHL(____) or DHL(DPOTT)'];
    var selector = 0;
    var eq_str = [yardDataTable[spot+9], yardDataTable[spot+10], yardDataTable[spot+12], yardDataTable[spot+18], yardDataTable[spot+19], yardDataTable[spot+21], yardDataTable[spot+27], yardDataTable[spot+28], yardDataTable[spot+30]];
    if(eq_str[0] == eq_str[1] || eq_str[0].search(/vs/i)>-1 || eq_str[1].search(/vs/i)>-1 || eq_str[2].search(/ats/i)>4){
        if(eq_str[2].search(/ats/i)>4){selector = 1;}
        if(eq_str[0] == eq_str[1] && eq_str[1].search(/vs/i)>-1){selector = 3;}
        if(eq_str[2].search(/ats/i)>-1 && eq_str[1].search(/vs/i)> -1 && selector == 3){selector = 2;}
        if(eq_str[1].search(/vs/i)>-1 && eq_str[2].search(/atseu/i)==-1){selector = 1;}
        if(selector > 0){
            if(selector ==0){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATS '+yardDataTable[spot+5]+' '+yardDataTable[spot+10]+' '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[selector]+'&nbsp;&nbsp;</tr>');}
            if(selector ==1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATS '+yardDataTable[spot+5]+' '+yardDataTable[spot+10]+' <span style="color: red; font-weight: bold;">'+eq_str[2]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[selector]+'&nbsp;&nbsp;</tr>');}
            if(selector ==2){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATS '+yardDataTable[spot+5]+' <span style="color: red; font-weight: bold;">'+yardDataTable[spot+10]+'</span> '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[selector]+'&nbsp;&nbsp;</tr>');}
            if(selector ==3){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATS '+yardDataTable[spot+5]+' <span style="color: red; font-weight: bold;">'+yardDataTable[spot+10]+'</span> '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[selector]+'&nbsp;&nbsp;</tr>');}
        }
    }
    if(eq_str[2].search(/atpost/i) > -1 || eq_str[5].search(/atpost/i) > -1 || eq_str[8].search(/atpost/i) > -1){
        if(eq_str[2].search(/atpost/i) > -1 && eq_str[2].search(/atpost/i) < 5){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+5]+'Y '+yardDataTable[spot+10]+' <span style="color: red; font-weight: bold;">'+eq_str[2]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}
        if(eq_str[5].search(/atpost/i) > -1 && eq_str[5].search(/atpost/i) < 5){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+14]+'Y '+yardDataTable[spot+19]+' <span style="color: red; font-weight: bold;">'+eq_str[5]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}
        if(eq_str[8].search(/atpost/i) < 5 && eq_str[8].search(/atpost/i) > -1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+23]+'Y '+yardDataTable[spot+28]+' <span style="color: red; font-weight: bold;">'+eq_str[8]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}
    }
    if((eq_str[2].search(/atpst/i) > -1 && eq_str[2].search(/atpst/i) < 5) || (eq_str[5].search(/atpst/i) > -1 && eq_str[5].search(/atpst/i) < 5) || (eq_str[8].search(/atpst/i) > -1 && eq_str[8].search(/atpst/i) < 5)){
        if(eq_str[1] > 9999 || eq_str[1].search(/[^0-9]/g) > -1){if(eq_str[1].search(/#/i)==-1&&yardDataTable[spot+5].search(/tractor/i)==-1&&yardDataTable[spot+5].search(/trailer/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+5]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+10]+'</span> '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}}
        if(eq_str[4] > 9999 || eq_str[4].search(/[^0-9]/g) > -1){if(eq_str[4].search(/#/i)==-1&&yardDataTable[spot+14].search(/tractor/i)==-1&&yardDataTable[spot+5].search(/trailer/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+14]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+19]+'</span> '+eq_str[5]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}}
        if(eq_str[7] > 9999 || eq_str[7].search(/[^0-9]/g) > -1){if(eq_str[7].search(/#/i)==-1&&yardDataTable[spot+23].search(/tractor/i)==-1&&yardDataTable[spot+5].search(/trailer/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+23]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+28]+'</span> '+eq_str[8]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}}
    }
    if((eq_str[2].search(/atpst/i) > -1 && eq_str[2].search(/atpst/i) > 3) || (eq_str[5].search(/atpst/i) > -1 && eq_str[5].search(/atpst/i) > 3) || (eq_str[8].search(/atpst/i) > -1 && eq_str[8].search(/atpst/i) > 3)){
        if(eq_str[1] < 9999 || eq_str[1] > 1000){if(eq_str[1].search(/#/i)==-1&&yardDataTable[spot+5].search(/tractor/i)==-1 && eq_str[2].search(/atpst/i) > 3){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+5]+'Y '+yardDataTable[spot+10]+' <span style="color: red; font-weight: bold;">'+eq_str[2]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}}
        if(eq_str[4] < 9999 || eq_str[4] > 1000){if(eq_str[4].search(/#/i)==-1&&yardDataTable[spot+14].search(/tractor/i)==-1 && eq_str[5].search(/atpst/i) > 3){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+14]+'Y '+yardDataTable[spot+19]+' <span style="color: red; font-weight: bold;">'+eq_str[5]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}}
        if(eq_str[7] < 9999 || eq_str[7] > 1000){if(eq_str[7].search(/#/i)==-1&&yardDataTable[spot+23].search(/tractor/i)==-1 && eq_str[8].search(/atpst/i) > 3){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+23]+'Y '+yardDataTable[spot+28]+' <span style="color: red; font-weight: bold;">'+eq_str[8]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}}
    }
        if((eq_str[1] < 9999 && eq_str[1] > 1000) && yardDataTable[spot+5].search(/swap_bod/i) > -1 && eq_str[2].search(/atpst/i) == -1){if(eq_str[1].search(/#/i)==-1&&yardDataTable[spot+5].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+5]+'Y '+yardDataTable[spot+10]+' <span style="color: red; font-weight: bold;">'+eq_str[2]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}}
        if((eq_str[4] < 9999 && eq_str[4] > 1000) && yardDataTable[spot+5].search(/swap_bod/i) > -1 && eq_str[5].search(/atpst/i) == -1){if(eq_str[4].search(/#/i)==-1&&yardDataTable[spot+14].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+14]+'Y '+yardDataTable[spot+19]+' <span style="color: red; font-weight: bold;">'+eq_str[5]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}}
        if((eq_str[7] < 9999 && eq_str[7] > 1000) && yardDataTable[spot+5].search(/swap_bod/i) > -1 && eq_str[8].search(/atpst/i) == -1){if(eq_str[7].search(/#/i)==-1&&yardDataTable[spot+23].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' ATPOST '+yardDataTable[spot+23]+'Y '+yardDataTable[spot+28]+' <span style="color: red; font-weight: bold;">'+eq_str[8]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[5]+'&nbsp;&nbsp;</tr>');}}
        if((eq_str[1] < 999999 && eq_str[1] > 100000) && yardDataTable[spot+5].search(/swap_bod/i) > -1 && eq_str[2].search(/dhl/i) == -1){if(eq_str[1].search(/#/i)==-1&&yardDataTable[spot+5].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' DHL '+yardDataTable[spot+5]+'Y '+yardDataTable[spot+10]+' <span style="color: red; font-weight: bold;">'+eq_str[2]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[7]+'&nbsp;&nbsp;</tr>');}}
        if((eq_str[4] < 999999 && eq_str[4] > 100000) && yardDataTable[spot+5].search(/swap_bod/i) > -1 && eq_str[5].search(/dhl/i) == -1){if(eq_str[4].search(/#/i)==-1&&yardDataTable[spot+14].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' DHL '+yardDataTable[spot+14]+'Y '+yardDataTable[spot+19]+' <span style="color: red; font-weight: bold;">'+eq_str[5]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[7]+'&nbsp;&nbsp;</tr>');}}
        if((eq_str[7] < 999999 && eq_str[7] > 100000) && yardDataTable[spot+5].search(/swap_bod/i) > -1 && eq_str[8].search(/dhl/i) == -1){if(eq_str[7].search(/#/i)==-1&&yardDataTable[spot+23].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' DHL '+yardDataTable[spot+23]+'Y '+yardDataTable[spot+28]+' <span style="color: red; font-weight: bold;">'+eq_str[8]+' </span>&nbsp;&nbsp;&nbsp;<= '+invalid_option[7]+'&nbsp;&nbsp;</tr>');}}
 
    if(yardDataTable[spot+5].search(/swap_bod/i) > -1 && eq_str[2].search(/dhl/i) > -1){
        if(eq_str[1] > 999999 || eq_str[1] < 100000 || eq_str[1].search(/[^0-9]/g) > -1){if(eq_str[1].search(/#/i)==-1&&yardDataTable[spot+5].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' DHL '+yardDataTable[spot+5]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+10]+'</span> '+eq_str[2]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}}
        if(eq_str[4] > 999999 || eq_str[4] < 100000 || eq_str[4].search(/[^0-9]/g) > -1){if(eq_str[4].search(/#/i)==-1&&yardDataTable[spot+14].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' DHL '+yardDataTable[spot+14]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+19]+'</span> '+eq_str[5]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}}
        if(eq_str[7] > 999999 || eq_str[7] < 100000 || eq_str[7].search(/[^0-9]/g) > -1){if(eq_str[7].search(/#/i)==-1&&yardDataTable[spot+23].search(/tractor/i)==-1){invalid_eq.push('<tr><td style="text-align: left;">'+(invalid_eq.length+1)+' - @ '+yardDataTable[spot+1]+' DHL '+yardDataTable[spot+23]+'Y <span style="color: red; font-weight: bold;"> '+yardDataTable[spot+28]+'</span> '+eq_str[8]+' &nbsp;&nbsp;&nbsp;<= '+invalid_option[6]+'&nbsp;&nbsp;</tr>');}}
    }
}
var dwell24 = new Array();
var dwell48 = new Array();
function inject(src, callback)
{
    if (typeof callback != 'function') callback = function() { };
    var el;
    if (typeof src != 'function' && /\.css[^\.]*$/.test(src)) {
        el = document.createElement('link');
        el.type = 'text/css';
        el.rel = 'stylesheet';
        el.href = src;
    } else {
        el = document.createElement('script');
        el.type = 'text/javascript';
    }
    el.class = 'injected';
    if (typeof src == 'function') {
        el.appendChild(document.createTextNode('(' + src + ')();'));
        callback();
    } else {
        el.src= src;
        el.async = false;
        el.onreadystatechange = el.onload = function() {
            var state = el.readyState;
            if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback();
            }
        };
    }
 
    var head = document.head || document.getElementsByTagName('head')[0];
    head.insertBefore(el, head.lastChild);
}
function checkLoto(){if(yardDataTable[row+4].search(/Y/i)>-1||yardDataTable[row+13].search(/Y/i)>-1||yardDataTable[row+22].search(/Y/i)>-1||yardDataTable[row+9].search(/LOTO/i)>-1||yardDataTable[row+18].search(/LOTO/i)>-1||yardDataTable[row+27].search(/LOTO/i)>-1){loto_count.push(yardDataTable[row+1]);}}
    })();