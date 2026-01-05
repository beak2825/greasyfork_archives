// ==UserScript==
// @name             WME Export Trajet
// @name:fr          WME Export Trajet
// @version          1.9
// @description      Export GPS point of your drives.
// @description:fr   Export des coordonées GPS de vos trajets.
// @include          https://www.waze.com/editor*
// @include          https://www.waze.com/*/editor*
// @include          https://beta.waze.com/editor*
// @include          https://beta.waze.com/*/editor*
// @exclude          https://www.waze.com/user*
// @exclude          https://www.waze.com/*/user*
// @namespace        https://greasyfork.org/scripts/14832-wme-export-trajet
// @icon             data:image/png;base64,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
// @author           seb-d59
// @copyright        seb-d59 - 2015
// @downloadURL https://update.greasyfork.org/scripts/14832/WME%20Export%20Trajet.user.js
// @updateURL https://update.greasyfork.org/scripts/14832/WME%20Export%20Trajet.meta.js
// ==/UserScript==
 
 
 
var WMEExpT_Version = 1.9;
var WMEExpT_Name = "WME Export Trajet";
 
var WMEExpT = {};
var icon_export="iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wgBFAggT+iJkgAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADUklEQVR42u2dTWsTURSGn5lOrEoJVYsff0AqUhHEreBW40IR/FiJKze6cV2NuhFdiFgQXLgQf0ARXIk7t3UhLYp/QBTFEksbmibjYk4kxHSMucn96JwXhtAmTU6fOfecc++cuYmwoxIQ459aQMPkDSILRk4CN4EZDwEuAQ+BZTxVCbgH/ACaHh4/gUdykr3UODAvxqaeHkYQY1STwBXg9iAQEwcG14AFYMXBZ1c2ifttiAB3/icmugC4AFwWI1OLoeRlF7waUDaF6ALgihhXd1CydOo5cNUUoqsYmDr63E6I0wKxZhITi5xEGsB9U4hFz8LLMlQHhqhljCFEBWgIUQEaQlSAhhAVoCHEpMCgJoBdspjQrTUpccgptleBapEBHpPpXd6cvJQzYzkMxEUGWAZO9vG6U3klYJEBDpIDWt1/U5Qk0iJbvq8N+42L4oENsmsfMNi1mRjYAM4UFWC7PKkOOOrGgRdF9sBOT3QaRFUKUAEqQAWoUoAKUAH2rW3ADux0km05gBGwBzgnj5ECHGwadR64AUz5BjEEgBGwl2xR87pvEENJIjFwwEeIIWVhLyGOejVmA7jI8DqxOiECPAG+465ZaeQA273Io/JE5xCTnMA9JsZGjkfIPmB7DsQImAO+uYDYC+AYWe9cBTgC7HQIMQH2AwdzPPGaQL4FfLUNMenhedPAXeAE2fVP14km/sdzU8AF+XnWticmPbyvIvCmAsrQZeCseOBjiYlOzm4sw2UiwHn9buAScBqL13q6AbaAz7i5BcFU68Ai8H4Emb9vgE3gNfBOhsFGIPDqwBuJ3R9dxsBUDJjtysKuEsmYZNhDYkcevCrwwfZJTzYpfpeAT/IPuJ4pzQBPgaO+wcsrpFMxxvUQXpfMWvcRXmiLCd7BswGw1+2ur+T3wcML0QO9gmdjNWaYWgXe+gQvJIBrHXWeN/BCAdiUwn7eN3ghAEzJGiOfAV9sTtG2kgf+kiP10bgQAKY+G6e9MQpQASpABahSgApQASpAlQJUgApQAaoUoAIMSC7WA/M2vPFVk2zSseYCYD8b3vimCeB4rxHrAmC/G94EEe4Sn4zRJPK3RrbhjWPVyJo5W6P2QNMNb3zVIvAAaNi6faHE1iqZ/nyNxm/UEhZ+/DhJcwAAAABJRU5ErkJggg==";
var lang={};
WMEExpT.Trajets = {'list': {},'objects':{}};
WMEExpT.typeExport= "" ;
 
var resultRequest={};
 
var debug=false;
var WME_FixUI_run = false;
 
// *********************
// ** HELPER FUNCTION **
// *********************
 
function log(msg, obj)
{
    if (obj === undefined)
        console.log(WMEExpT_Name + " v" + WMEExpT_Version + " - " + msg);
    else if (debug)
        console.debug(WMEExpT_Name + " v" + WMEExpT_Version + " - " + msg + " " ,obj);
}
 
function getId(node) {
    return document.getElementById(node);
}
function getElementsByClassName(classname, node) {
    node || (node = document.getElementsByTagName("body")[0]);
    for (var a = [], re = new RegExp("\\b" + classname + "\\b"), els = node.getElementsByTagName("*"), i = 0, j = els.length;i < j;i++) {
        re.test(els[i].className) && a.push(els[i]);
    }
    return a;
}
function getFunctionWithArgs(func, args) {
    return (
        function () {
            var json_args = JSON.stringify(args);
            return function() {
                var args = JSON.parse(json_args);
                func.apply(this, args);
            };
        }
    )();
}
function getMonthNumber(mName){
    var n;
    for (n=1; n<=12; n++){
        if (mName === I18n.translations[I18n.locale].date.month_names[n])
            return n;
    }
}
 
 
// *************
// **  INIT   **
// *************
function WMEExpT_bootstrap() {
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
 
    /* begin running the code! */
    log("starting");
    WMEExpT_init();
}
 
 
function WMEExpT_init(){
    // Waze object needed
 
    WMEExpTWaze = unsafeWindow.W;
    if(typeof WMEExpTWaze == "undefined" || WMEExpTWaze == null){
        if (debug) { console.error("WME Export Trajet - WMEExpTWaze : NOK"); }
        window.setTimeout(WMEExpT_init, 500);
        return;
    }
    WMEExpTLoginManager = unsafeWindow.W.loginManager;
    if(typeof WMEExpTLoginManager == "undefined" || WMEExpTLoginManager == null){
        if (debug) { console.error("WME Export Trajet - WMEExpTLoginManager : NOK"); }
        window.setTimeout(WMEExpT_init, 500);
        return;
    }
    WMEExpTUser = unsafeWindow.W.loginManager.user;
    if(typeof WMEExpTUser == "undefined" || WMEExpTUser == null){
        if (debug) { console.error("WME Export Trajet - WMEExpTUser : NOK"); }
        window.setTimeout(WMEExpT_init, 500);
        return;
    }
    userName = unsafeWindow.W.loginManager.user.userName;
    if(typeof userName == "undefined" || userName == null ){
        if (debug) { console.error("WME Export Trajet - userName : NOK"); }
        window.setTimeout(WMEExpT_init, 500);
        return;
 
    }
 
    //    Traductions
    WMEExpTI18n = unsafeWindow.I18n.locale;
    if(typeof(WMEExpTI18n) === 'undefined'){
        if (debug) { console.error("WME Export Trajet - WMEExpTI18n : NOK"); }
        setTimeout(WMEExpT_init, 500);
        return;
    }
    //    Waze GUI needed
 
    WMEExpT_userInfo = getId("user-info");
    if(typeof(WMEExpT_userInfo) === 'undefined'){
        if (debug) { console.error("WME Export Trajet - WMEExpT_userInfo : NOK"); }
        setTimeout(WMEExpT_init, 500);
        return;
    }
    WMEExpT_navTabs = getElementsByClassName("nav-tabs", WMEExpT_userInfo)[0];
    if(typeof(WMEExpT_navTabs) === 'undefined'){
        if (debug) { console.error("WME Export Trajet - WMEExpT_navTabs : NOK"); }
        setTimeout(WMEExpT_init, 500);
        return;
    }
    WMEExpT_tabContent = getElementsByClassName("tab-content", WMEExpT_userInfo)[0];
    if(typeof(WMEExpT_tabContent) === 'undefined'){
        if (debug) { console.error("WME Export Trajet - WMEExpT_tabContent : NOK"); }
        setTimeout(WMEExpT_init, 500);
        return;
    }
 
    WMEExpTDrives = getId("sidepanel-drives");
    if(typeof(WMEExpTDrives) === 'undefined'){
        if (debug) { console.error("WME Export Trajet - WMEExpTDrives : NOK"); }
        setTimeout(WMEExpT_Main, 1000);
        return;
    }
	
 
    //======================================================
 
    // Translation
    if (WMEExpTI18n  == "fr") {
        lang = new Array("Export","Selectionnez le trajet","Heure","Vitesse");
    }
    else {
        lang = new Array("Export","Select the Drive","Time","Speed");
    }
 
    log("init ok");
 
    // MTE mode event
	/*
	W.app.modeController.model.bind('change:mode', function(){
	    if (W.app.modeController.getState() === undefined){
	        WMEExpT_html();
	    }
	  });
	  */
	  // reload after changing WME units
	  W.prefs.on('change:isImperial', function(){
	      WMEExpT_html();
	  });
 
    // Then running
    WMEExpT_css();
 
}
 
 
// *************
// **  HTML   **
// *************
 
function WMEExpT_css() {
    var Scss = document.createElement("style");
    Scss.type = "text/css";
    var css =".CSETcontent {width:auto; height:100px; box-shadow: 1px 4px 10px #40A497; border:2px solid #40A497;}";
    css +=".divl {float:left; height:20px; text-align:center;}";
    css +=".divr {float:right; height:20px; text-align:center;}";
    css +="#export {width:35px; height:22px;}";
    Scss.innerHTML = css;
    document.body.appendChild(Scss);
    log('CSS Ok');
    WMEExpT_html();
}
 
 
function WMEExpT_html() {
  WMEExpTDrives = getId("sidepanel-drives");
 
  var addon= document.createElement('div', "ExpT-cotent");
  var content = "<div class='CSETcontent'>";
  content += "<div style='float:left; margin-left:5px; margin-top:5px;'><b><a href='https://www.waze.com/forum/viewtopic.php?f=1316&t=170293' target='_blank'><u>"+ WMEExpT_Name +"</u></a></b> v"+ WMEExpT_Version +"</div><br>";
  content += "<div class='divl' style='width:240px; height:32px; margin-left:10px; margin-top:5px; text-align:left;'><select id='selectTrajet'>";// style='width:200px;'>";
  content += "<option value='0' id='0'>"+lang[1]+"</option>";
  content += "</select></div><br>";
  content += "<div id='selTypeExport' style='height:30px; margin-left:10px; margin-top:5px; clear:both; padding-top:10px;'>";
  content += "<div class='divl' style='width:60px;'><input type='radio' id='gpx' value='GPX' checked>&nbspGPX</div>";
  content += "<div class='divl' style='width:60px;'><input type='radio' id='kml' value='KML'>&nbspKML</div>";
  content += "<div class='divl' style='width:20px;'><a href='#' id='exportTrajet'><img style='width:20px;' title='"+ lang[0] +"' src='data:image/png;base64,"+ icon_export +"' /></a></div></div></div>";
  addon.innerHTML = content;
  WMEExpTDrives.appendChild(addon);
 
  getId('selectTrajet').onfocus = updateTrajetsList;
  getId('selectTrajet').onchange = ExpTrajet;
  getId('gpx').onclick = function(){if (getId('kml').checked) getId('kml').checked=false;generateTypeExport();};
  getId('kml').onclick = function(){if (getId('gpx').checked) getId('gpx').checked=false;generateTypeExport();};
  generateTypeExport();
  log('html Ok');
 
}
function generateTypeExport(){
  var typeGpx = getId('gpx').checked;
  var typeKml = getId('kml').checked;
  WMEExpT.typeExport = (typeKml && !typeGpx) ? "kml" : "gpx";
  log('WMEExpT.typeExport',WMEExpT.typeExport);
  ExpTrajet();
}
 
 
function updateTrajetsList()
{
  WME_FixUI_run = (getId("sidepanel-FixUI") != null ? true : false);
  log("WME_FixUI_run",WME_FixUI_run);
  
  var available_Trajets = getElementsByClassName('result session session-available');
  if(typeof(available_Trajets) === 'undefined'){
	if (debug) { console.error("WME Export Trajet - available_Trajets : NOK"); }
    return;
  }
  log('available_Trajets',available_Trajets);
  var selectTrajet = getId('selectTrajet');
	selectTrajet.options.length = 1;
 
 
  for (var i=0;i<available_Trajets.length;i++){
 
    var trajetID =  available_Trajets[i].dataset.id;
    var trajetDetail = {};
	var d;
    WMEExpT.Trajets.list[trajetID] = {"text": "", "startDate": "", "endDate": "", "startTime": "", "endTime": ""};
	
	if (WME_FixUI_run){
		trajetDetail.DateTime = new Date(available_Trajets[i].childNodes[0].childNodes[0].textContent);
		d = new Date(trajetDetail.DateTime);
		trajetDetail.Date = d.getFullYear() + "-" + (parseInt(d.getMonth() + 1) > 9 ? parseInt(d.getMonth() + 1) : "0" + parseInt(d.getMonth() + 1)) + "-" + (d.getDate()>9 ? d.getDate() : "0"+d.getDate());
		trajetDetail.Time = (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) + "h" + (d.getMinutes()>9 ? d.getMinutes() : "0"+d.getMinutes());
    }else{
		trajetDetail.DateTime = available_Trajets[i].childNodes[0].childNodes[0].textContent;
		trajetDetail.DateTime = trajetDetail.DateTime.split(",");
		trajetDetail.Date = trajetDetail.DateTime[1].trim() + "-" + getMonthNumber(trajetDetail.DateTime[0].trim().split(" ")[0]) + "-" + trajetDetail.DateTime[0].trim().split(" ")[1];
		trajetDetail.Time = trajetDetail.DateTime[2].replace(/\:/g,'h').trim();
		d = new Date(trajetDetail.Date);
		d.setHours(trajetDetail.Time.split("h")[0],trajetDetail.Time.split("h")[1],0);
	}
	log('trajetDetail.DateTime',trajetDetail.DateTime);
	
	//trajetDetail.Time = available_Trajets[i].childNodes[1].childNodes[0].textContent;
    //trajetDetail.Time = trajetDetail.Time.substr(trajetDetail.DateTime.indexOf(":")-2).trim().replace(/\:/g,'h');
    trajetDetail.dst = available_Trajets[i].childNodes[1].childNodes[0].textContent;
    trajetDetail.tps = available_Trajets[i].childNodes[1].childNodes[1].textContent;
    log("trajetDetail.tps", trajetDetail.tps);
    
    log('trajetDetail',trajetDetail);
 
    //var d = new Date(W.model.archives.objects[trajetID].startTime);
    //var d = new Date(trajetDetail.Date);
    //d.setHours(trajetDetail.Time.split("h")[0],trajetDetail.Time.split("h")[1],0);
    log('startTime d',d);
    WMEExpT.Trajets.list[trajetID].startDate = d.getFullYear() + "-" + (parseInt(d.getMonth() + 1) > 9 ? parseInt(d.getMonth() + 1) : "0" + parseInt(d.getMonth() + 1)) + "-" + (d.getDate()>9 ? d.getDate() : "0"+d.getDate());
    WMEExpT.Trajets.list[trajetID].startTime = (d.getHours() > 9 ? d.getHours() : "0" + d.getHours()) + ":" + (d.getMinutes()>9 ? d.getMinutes() : "0"+d.getMinutes()) + ":" + (d.getSeconds()>9 ? d.getSeconds() : "0"+d.getSeconds());
 
    //trajetDetail.tps = trajetDetail.tps.replace(" min",'').replace(" h ",':').split(":");
    
	var temp = trajetDetail.tps.split(" ");
	log("trajetDetail.tps.split", temp);
	var tps= [];
	for (var l=0;l<temp.length;l++){
		if (temp[l].match(/^[0-9]{1,10}/g) != null)
    	tps.push(temp[l]);
	}
	trajetDetail.tps = trajetDetail.tps.replace(/\s/g,"")
    log("trajetDetail.tps", trajetDetail.tps);
    
	var ms;
    if (tps.length ==1){
        ms = tps[0] * 60000;
    }else{
        ms = tps[0] * 3600000 + tps[1] * 60000;
    }
 
    var d2 = new Date(d.getTime() + ms);
    log('tps d2',d2);
 
    WMEExpT.Trajets.list[trajetID].endDate = d2.getFullYear() + "-" + (parseInt(d2.getMonth() + 1) > 9 ? parseInt(d2.getMonth() + 1) : "0" + parseInt(d2.getMonth() + 1)) + "-" + (d2.getDate()>9 ? d2.getDate() : "0"+d2.getDate());
    WMEExpT.Trajets.list[trajetID].endTime = (d2.getHours() > 9 ? d2.getHours() : "0" + d2.getHours()) + ":" + (d2.getMinutes()>9 ? d2.getMinutes() : "0"+d2.getMinutes()) + ":" + (d2.getSeconds()>9 ? d2.getSeconds() : "0"+d2.getSeconds());
 
    //WMEExpT.Trajets.list[trajetID].text = WMEExpT.Trajets.list[trajetID].startDate + " - " + trajetDetail.Time + " - " + trajetDetail.dst + " - " + trajetDetail.tps;
 
    WMEExpT.Trajets.list[trajetID].text = trajetDetail.Date + " - " + trajetDetail.Time + " - " + trajetDetail.dst + " - " + trajetDetail.tps;
    log("WMEExpT.Trajets.list[trajetID]",WMEExpT.Trajets.list[trajetID]);
 
    var expTrOption = document.createElement('option');
	  var expTrText = document.createTextNode(WMEExpT.Trajets.list[trajetID].text);
	  expTrOption.setAttribute('value','0');
	  expTrOption.setAttribute('id', trajetID);
	  expTrOption.appendChild(expTrText);
	  selectTrajet.appendChild(expTrOption);
  }
  log('updateTrajetsList Ok');
  log("WMEExpT",WMEExpT);
}
 
function ExpTrajet() {
  log('ExpTrajet');
  var selectTrajet = getId('selectTrajet');
 
  if (selectTrajet.selectedIndex <= 0)
    return;
 
  var id = selectTrajet.options[selectTrajet.selectedIndex].id;
 
  if (id <= 0)
    return;
 
 
  if (!WMEExpT.Trajets.objects.hasOwnProperty(id)){
    var url = document.location.origin;
    if (url.search("beta") != -1){
      url += "/row-Descartes/app/Archive/SessionGPS?id="+id;
    }else{
      url += "/row-Descartes-live/app/Archive/SessionGPS?id="+id;
    }
 
    RequestObject = window.ActiveXObject ? new ActiveXObject("Msxml2.XMLHTTP") : new XMLHttpRequest();
    RequestObject.onreadystatechange = function(){
    	if(RequestObject.readyState == 4) {
    		resultRequest={};
        resultRequest = JSON.parse(RequestObject.responseText);
    		WMEExpT.Trajets.objects[id] = resultRequest.archiveSessions.objects[0];
    		log('New data download link ok: '+ WMEExpT.Trajets.list[id].text+'; id= '+ id);
    		if (WMEExpT.typeExport == "gpx") generateGpxFile(id);
    		if (WMEExpT.typeExport == "kml") generateKmlFile(id);
 
      }
    };
    RequestObject.open("GET", url,false);
    RequestObject.send(null);
 
	}else if (WMEExpT.Trajets.objects.hasOwnProperty(id)){
 	  if (WMEExpT.typeExport == "gpx"){
 	    if (!WMEExpT.Trajets.objects[id].hasOwnProperty("gpx")){
 	      generateGpxFile(id);
 	    }else if (WMEExpT.Trajets.objects[id].hasOwnProperty("gpx")){
 	      log('data download link ok: '+ WMEExpT.Trajets.list[id].text+'.gpx '+'; id= '+ id);
        getId('exportTrajet').setAttribute('download',  userName + " - " + WMEExpT.Trajets.list[id].text+ '.gpx');
        getId('exportTrajet').href='data:Application/octet-stream,' + encodeURIComponent(WMEExpT.Trajets.objects[id].gpx);
 	    }
 	  }else if (WMEExpT.typeExport == "kml"){
 	    if (!WMEExpT.Trajets.objects[id].hasOwnProperty("kml")){
 	      generateKmlFile(id);
 	    }else if (WMEExpT.Trajets.objects[id].hasOwnProperty("kml")){
 	      log('data download link ok: '+ WMEExpT.Trajets.list[id].text+'.kml '+'; id= '+ id);
        getId('exportTrajet').setAttribute('download',  userName + " - " + WMEExpT.Trajets.list[id].text+ '.kml');
        getId('exportTrajet').href='data:Application/octet-stream,' + encodeURIComponent(WMEExpT.Trajets.objects[id].kml);
 	    }
 	  }
 	}
 
}
 
function generateGpxFile(id){
  log('generateGpxFile');
 
  //************************************************//
  //  Format du Fichier:
  //
  //    <gpx .......>
  //      <trk>
  //      <name>Test Traces</name>
  //        <trkseg>
  //          <trkpt lat="..." lon="..."></trkpt>
  //           .....
  //          <trkpt lat="..." lon="..."></trkpt>
  //         </trkseg>
  //       </trk>
  //      </gpx>
  //
  //***********************************************//
 
  var entete = '<?xml version="1.0" encoding="UTF-8"?>\n<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="seb-d59" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n';
  entete += '<trk>\n';
 
  /*
  WMEExpT.Trajets.objects[id].driveParts: [{matchType: "MATCHED", geometry: {type: "LineString",…}}]
  WMEExpT.Trajets.objects[id].fromLocation: {street: "....", city: "....", country: "...."}
  WMEExpT.Trajets.objects[id].toLocation: {street: "....", city: "....", country: "...."}
  */
 
  var temp="";
  var roadName=[];
  var traitementlonlat=[];
  
  temp = (WMEExpT.Trajets.objects[id].fromLocation != null) ? String(WMEExpT.Trajets.objects[id].fromLocation.street)+', '+String(WMEExpT.Trajets.objects[id].fromLocation.city)+', '+String(WMEExpT.Trajets.objects[id].fromLocation.country) : String(I18n.translations[I18n.locale].segment.address.none);
  roadName.push(temp);
  temp = (WMEExpT.Trajets.objects[id].toLocation != null) ? String(WMEExpT.Trajets.objects[id].toLocation.street)+', '+String(WMEExpT.Trajets.objects[id].toLocation.city)+', '+String(WMEExpT.Trajets.objects[id].toLocation.country) : String(I18n.translations[I18n.locale].segment.address.none);
  roadName.push(temp);
 
  log('roadName', roadName );
 
  log(roadName[0] +' vers '+ roadName[1]);
 
  var nameIti = '<name>'+ roadName[0] +' vers '+ roadName[1] +'</name>\n<trkseg>\n';
 
  var lonlat=[];
  traitementlonlat=WMEExpT.Trajets.objects[id].driveParts;
 
  for (i=0; i < traitementlonlat.length; i++){
    for (j=0; j < traitementlonlat[i].geometry.coordinates.length; j++){
      if (i==0 & j==0){
        lonlat.push(traitementlonlat[i].geometry.coordinates[j]);
      }else if (!((lonlat[lonlat.length-1][0] == traitementlonlat[i].geometry.coordinates[j][0]) && (lonlat[lonlat.length-1][1] == traitementlonlat[i].geometry.coordinates[j][1]))) {
        lonlat.push(traitementlonlat[i].geometry.coordinates[j]);
      }
    }
  }
  var lonlatText = "";
  for (i=0; i<lonlat.length;i++){
    lonlatText += '<trkpt lon="' + lonlat[i][0] +'" lat="'+ lonlat[i][1] +'"></trkpt>\n';
  }
 
  var end  = '</trkseg>\n</trk>\n</gpx>';
  WMEExpT.Trajets.objects[id].gpx = entete + nameIti + lonlatText + end;
 
  log('WMEExpT.Trajets.objects[id].gpx',WMEExpT.Trajets.objects[id].gpx);
  getId('exportTrajet').setAttribute('download',  userName + " - " + WMEExpT.Trajets.list[id].text+ '.gpx');
  getId('exportTrajet').href='data:Application/octet-stream,' + encodeURIComponent(WMEExpT.Trajets.objects[id].gpx);
 
}
 
 
function generateKmlFile(id){
 
  log('generateKmlFile');
  var entete = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n';
  entete += '<Document>\n';
  entete += '<name>' +  userName + " - " + WMEExpT.Trajets.list[id].text +'.kml</name>\n';
  entete += '<Style id="lineStyle">\n<LineStyle>\n<color>e5f00014</color>\n<width>3</width>\n</LineStyle>\n</Style>\n<StyleMap id="route">\n<Pair>\n<key>normal</key>\n<styleUrl>#route_n</styleUrl>\n</Pair>\n<Pair>\n<key>highlight</key>\n<styleUrl>#route_h</styleUrl>\n</Pair>\n</StyleMap>\n<Style id="route_n">\n<IconStyle>\n<Icon><href>http://earth.google.com/images/kml-icons/track-directional/track-none.png</href></Icon>\n</IconStyle>\n</Style>\n<Style id="route_h">\n<IconStyle>\n<scale>1.2</scale>\n<Icon><href>http://earth.google.com/images/kml-icons/track-directional/track-none.png</href></Icon>\n</IconStyle>\n</Style>\n';
 
 
  var temp="";
  var roadName=[];
  var time=[];
  var speed=[];
  var traitementlonlat=[];
 
  temp = (WMEExpT.Trajets.objects[id].fromLocation != null) ? String(WMEExpT.Trajets.objects[id].fromLocation.street)+', '+String(WMEExpT.Trajets.objects[id].fromLocation.city)+', '+String(WMEExpT.Trajets.objects[id].fromLocation.country) : String(I18n.translations[I18n.locale].segment.address.none);
  roadName.push(temp);
  temp = (WMEExpT.Trajets.objects[id].toLocation != null) ? String(WMEExpT.Trajets.objects[id].toLocation.street)+', '+String(WMEExpT.Trajets.objects[id].toLocation.city)+', '+String(WMEExpT.Trajets.objects[id].toLocation.country) : String(I18n.translations[I18n.locale].segment.address.none);
  roadName.push(temp);
 
  log('roadName', roadName );
 
  log(roadName[0] +' vers '+ roadName[1]);
	var nameIti = '<Folder><name>'+ roadName[0] +' vers '+ roadName[1] +'</name>\n';
 
 
  //log('traitementlonlat',traitementlonlat);
  traitementlonlat=WMEExpT.Trajets.objects[id].driveParts;
 
  var lonlat=[];
 
  var itiWay = '<Folder>\n<name>Points</name>\n';
 
  for (i=0; i < traitementlonlat.length; i++){
    for (j=0; j < traitementlonlat[i].geometry.coordinates.length; j++){
      if (i==0 & j==0){
        lonlat.push(traitementlonlat[i].geometry.coordinates[j]);
        itiWay += '<Placemark>\n<name>'+ roadName[0] +'</name>\n<snippet></snippet>\n<description><![CDATA[<table>\n<tr><td>Longitude: '+lonlat[0][0]+' </td></tr>\n<tr><td>Latitude: '+ lonlat[0][1] +' </td></tr>\n<tr><td>'+ lang[2] +': '+ WMEExpT.Trajets.list[id].startTime +'</td></tr>\n</table>]]></description>\n<LookAt>\n<longitude>'+lonlat[0][0]+'</longitude>\n<latitude>'+ lonlat[0][1] +'</latitude>\n<altitude>0</altitude>\n<heading>0</heading>\n<tilt>66</tilt>\n<range>0</range>\n</LookAt>\n<TimeStamp><when>'+WMEExpT.Trajets.list[id].startDate+'T'+WMEExpT.Trajets.list[id].startTime+'Z</when></TimeStamp>\n\n<styleUrl>#route</styleUrl>\n<Point>\n<coordinates>'+lonlat[0][0] +','+ lonlat[0][1] +',0</coordinates>\n</Point>\n</Placemark>\n';
      } else if (!((lonlat[lonlat.length-1][0] == traitementlonlat[i].geometry.coordinates[j][0]) && (lonlat[lonlat.length-1][1] == traitementlonlat[i].geometry.coordinates[j][1]))) {
        lonlat.push(traitementlonlat[i].geometry.coordinates[j]);
        if ((i==traitementlonlat.length-1) & (j==traitementlonlat[i].geometry.coordinates.length-1))
          itiWay += '<Placemark>\n<name>'+ roadName[1] +'</name>\n<snippet></snippet>\n<description><![CDATA[<table>\n<tr><td>Longitude: '+lonlat[lonlat.length-1][0]+' </td></tr>\n<tr><td>Latitude: '+ lonlat[lonlat.length-1][1] +' </td></tr>\n<tr><td>'+ lang[2] +': '+ WMEExpT.Trajets.list[id].endTime +'</td></tr>\n</table>]]></description>\n<LookAt>\n<longitude>'+lonlat[lonlat.length-1][0]+'</longitude>\n<latitude>'+ lonlat[lonlat.length-1][1] +'</latitude>\n<altitude>0</altitude>\n<heading>0</heading>\n<tilt>66</tilt>\n<range>0</range>\n</LookAt>\n<TimeStamp><when>'+WMEExpT.Trajets.list[id].endDate+'T'+WMEExpT.Trajets.list[id].endTime+'Z</when></TimeStamp>\n\n<styleUrl>#route</styleUrl>\n<Point>\n<coordinates>'+lonlat[lonlat.length-1][0] +','+ lonlat[lonlat.length-1][1] +',0</coordinates>\n</Point>\n</Placemark>\n';
        else
          itiWay += '<Placemark>\n<name></name>\n<snippet></snippet>\n<description><![CDATA[<table>\n<tr><td>Longitude: '+lonlat[lonlat.length-1][0]+' </td></tr>\n<tr><td>Latitude: '+ lonlat[lonlat.length-1][1] +' </td></tr>\n</table>]]></description>\n<LookAt>\n<longitude>'+lonlat[lonlat.length-1][0]+'</longitude>\n<latitude>'+ lonlat[lonlat.length-1][1] +'</latitude>\n<altitude>0</altitude>\n<heading>0</heading>\n<tilt>66</tilt>\n<range>0</range>\n</LookAt>\n<styleUrl>#route</styleUrl>\n<Point>\n<coordinates>'+lonlat[lonlat.length-1][0] +','+ lonlat[lonlat.length-1][1] +',0</coordinates>\n</Point>\n</Placemark>\n';
      }
    }
  }
 
  itiWay += '</Folder>\n';
 
  var lonlatText = '<Placemark>\n<name>Path</name>\n<styleUrl>#lineStyle</styleUrl>\n<LineString>\n<tessellate>1</tessellate>\n<coordinates>';
 
  log('lonlat',lonlat);
  for (i=0; i<lonlat.length;i++){
    lonlatText += lonlat[i][0] +','+ lonlat[i][1] +',0 ';
  }
  lonlatText += '</coordinates>\n</LineString>\n</Placemark>\n</Folder>\n';
 
  var end  = '</Document>\n</kml>';
 
  WMEExpT.Trajets.objects[id].kml = entete + nameIti + itiWay + lonlatText + end;
  //WMEExpT.Trajets.objects[id].kml = entete + nameIti + lonlatText + end;
  log('WMEExpT.Trajets.objects[id].kml',WMEExpT.Trajets.objects[id].kml);
 
  getId('exportTrajet').setAttribute('download',  userName + " - " + WMEExpT.Trajets.list[id].text+ '.kml');
  getId('exportTrajet').href='data:Application/octet-stream,' + encodeURIComponent(WMEExpT.Trajets.objects[id].kml);
 
}
 
/* begin running the code! */
WMEExpT_bootstrap();
 
 
