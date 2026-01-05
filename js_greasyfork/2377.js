// ==UserScript==
// @name                WME Invalidated Camera Mass Eraser
// @namespace           @UCME_Myriades
// @description         Allow delete visible, unvalidated and in your managed area all speed camera in 1 click!
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @icon                
// @version             0.5.1
// @grant               WME_GB_Myriades
// @downloadURL https://update.greasyfork.org/scripts/2377/WME%20Invalidated%20Camera%20Mass%20Eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/2377/WME%20Invalidated%20Camera%20Mass%20Eraser.meta.js
// ==/UserScript==

var wme_ucme_script_name = 'WME Unvalidated Camera Mass Eraser';
wme_ucme_version = GM_info.script.version;
var wme_ucme_script_url = 'https://greasyfork.org/scripts/2377-wme-invalidated-camera-mass-eraser';

/* bootstrap, will call initialiseHighlights() */
function UCME_bootstrap(){
	UCME_addLog('init');
	if (typeof(unsafeWindow) === "undefined"){
		unsafeWindow = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		}) ();
	}
	/* begin running the code! */
	window.setTimeout(UCME_init, 500);
}

/* helper function */
function onScreen(obj){
    if(obj.geometry)return UCME_waze_Map.getExtent().intersectsBounds(obj.geometry.getBounds());
    return false;
}

function getId(node) {
  return document.getElementById(node);
}

function UCME_addLog(UCME_text){
	console.log('WME_UCME_' + wme_ucme_version + ' : ' + UCME_text);
}

function UCME_del_cams(){
	UCME_addLog('del cams called');
	if(UCME_waze_Map.camerasLayer.visibility === false)return;
	UCME_addLog('cam layer ok');
	if(UCME_waze_controler.zoom < 1)return;
	UCME_addLog('zoom ok');
	var delCams = 0;
	for(var cams in UCME_waze_cameras.objects){
		var the_cam = UCME_waze_cameras.objects[cams];
		if(!onScreen(the_cam)){
			UCME_addLog('Cam n° : ' + cams + ' not on screen -> not deleted');
			continue;
		}
		if(the_cam.attributes.validated === true){
			UCME_addLog('Cam n° : ' + cams + ' already validated -> not deleted');
			continue;
		}
		if(the_cam.state == 'Delete'){
			UCME_addLog('Cam n° : ' + cams + ' already deleted -> do not delete again');
			continue;
		}
		if(the_cam.attributes.permissions == -1){
			UCME_addLog('Cam n° : ' + cams + ' is in editable area -> OK deleted');
			delCams++;
			UCME_waze_model.actionManager.add(new DeleteObject(UCME_waze_cameras.objects[cams]));
		}
        else
			UCME_addLog('Cam n° : ' + cams + ' is NOT in editable area -> not deleted');
	}
	UCME_addLog('Deleted cams : ' + delCams);
}

function UCME_html(){
	WME_UCME_addon = document.createElement('div');
	WME_UCME_addon.id = 'UCME_btn';
	WME_UCME_addon.innerHTML = '<input type="button" id="_UCME_btn" value="Delete unvalidated cameras" /><hr>';
	UCME_userInfos.appendChild(WME_UCME_addon);
	//	Event
	getId('_UCME_btn').onclick = UCME_del_cams;
	UCME_addLog('HTML renderred');
}

function UCME_init(){
	//	Waze object needed
	UCME_Waze = unsafeWindow.W;
	if(typeof(UCME_Waze) === 'undefined'){
		UCME_addLog('unsafeWindow.W NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	UCME_waze_loginmanager = UCME_Waze.loginManager;
	if(typeof(UCME_waze_loginmanager) === 'undefined'){
		UCME_addLog('login manager NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	UCME_waze_user = UCME_waze_loginmanager.user;
	if(typeof(UCME_waze_user) === 'undefined' || UCME_waze_user === null){
		UCME_addLog('user NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	if(UCME_waze_user.rank < 2){
		UCME_addLog('User rank is not high enough. Exiting script.');
		return;
	}
	UCME_addLog('User rank OK : ' + eval(UCME_waze_user.rank + 1));
	UCME_waze_controler = UCME_Waze.controller;
	if(typeof(UCME_waze_controler) === 'undefined'){
		UCME_addLog('UCME_waze_controler NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	UCME_waze_Map = UCME_Waze.map;
	if(typeof(UCME_waze_Map) === 'undefined'){
		UCME_addLog('map NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	UCME_waze_model = UCME_Waze.model;
	if(typeof(UCME_waze_model) === 'undefined'){
		UCME_addLog('model NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	UCME_waze_cameras = UCME_waze_model.cameras;
	if(typeof(UCME_waze_cameras) === 'undefined'){
		UCME_addLog('cameras NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	//		New WME compatibility
	if(typeof(unsafeWindow.require) === "undefined"){
		UCME_addLog('require NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	require = unsafeWindow.require;
	DeleteObject = require("Waze/Action/DeleteObject");
	UCME_addLog('Waze OK');
	//	Waze GUI needed
	UCME_userInfos = getId('user-details');
	if(typeof(UCME_userInfos) === 'undefined'){
		UCME_addLog('userInfos NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	//	Then do the job
	//	HTML
	UCME_html();
}

/* engage! =================================================================== */
UCME_bootstrap();
/* end ======================================================================= */