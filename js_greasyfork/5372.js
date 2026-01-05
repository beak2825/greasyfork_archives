// ==UserScript==
// @name                WME UR Răspunsuri tipice Romania
// @namespace           @spookyx
// @description         NU MAI FOLOSIȚI ACEST SCRIPT. ESTE VECHI. FOLOSIȚI URCOMMENTS + ROMANIAN LIST.
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/editor/*
// @include             https://beta.waze.com/editor/*
// @include             https://beta.waze.com/*/editor/*
// @icon                data:image/png;base64,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
// @grant				GM_xmlhttpRequest
// @version             1.2.2
// @copyright   		2016, Myriades & SpookyX
// @downloadURL https://update.greasyfork.org/scripts/5372/WME%20UR%20R%C4%83spunsuri%20tipice%20Romania.user.js
// @updateURL https://update.greasyfork.org/scripts/5372/WME%20UR%20R%C4%83spunsuri%20tipice%20Romania.meta.js
// ==/UserScript==

/***	Remerciements : DummyD2, seb-d59, Yopinet et tous les testeurs :)	***/

/**************************/
/***	UR2T object		***/
/**************************/
console.info('WME_UR2T_' + GM_info.script.version + ' : ' + 'Init start');
var UR2T = {};
//if(localStorage.UR2T){
    /*
	UR2T = JSON.parse(localStorage.UR2T);
	//	Ajout/modification des objets V0.6 -> V1.0
	UR2T.scriptVer = GM_info.script.version;
	UR2T.answers.UR['outils'].objects[1] = {'question': 'Introdu semnătura mea', 'answer': 'UR2T_insertSign'};
	UR2T.answers.UR['outils'].objects[3] = {'question': 'Răspuns nou', 'answer': 'UR2T_AddResponses'};
	UR2T.answers.UR['outils'].objects[5] = {'question': 'Import / export', 'answer': 'UR2T_importExport'};
	UR2T.answers.UR['outils'].objects[6] = {'question': 'Despre', 'answer': 'UR2T_apropos'};
	var URs = UR2T.answers.UR;
	for(var URType in URs){
		for(var URId in URs[URType].objects){
			if(typeof(URs[URType].objects[URId].isPerso) == 'undefined')URs[URType].objects[URId].isPerso = false;
		}
	}
    */
//}
//else{
	UR2T.debug_level = 3;
	UR2T.UR_Selected = false;
	UR2T.oldVer = '';
	UR2T.userSign = '';
	UR2T.scriptVer = GM_info.script.version;
    UR2T.textComun = '\nPentru a sta la curent cu noutățile, a comunica cu noi și pentru a te implica intră pe www.waze.ro, facebook.com/WazeRomania (un Like te rog). Te așteptăm și pe grupul de discuții de pe facebook.com/groups/WazeRomania\nÎți mulțumim pentru contribuția ta la îmbunătățirea Waze.';
    UR2T.noReply = '\nTe rog să răspunzi din aplicație sau din editorul de hartă. Nu răspunde direct prin email pentru că nimeni nu va primi răspunsul tău.';
	UR2T.answers = {};
	UR2T.answers.UR = {};
	//	Outils
	UR2T.answers.UR['outils'] = {'name': 'Utile', 'objects': {}};
	UR2T.answers.UR['outils'].objects[0] = {'question': 'Ștergere text', 'answer': '', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[1] = {'question': 'Introdu semnătrua mea', 'answer': 'UR2T_insertSign', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[2] = {'question': 'Editează răspunsurile', 'answer': 'UR2T_EditResponses', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[3] = {'question': 'Răspuns nou', 'answer': 'UR2T_AddResponses', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[4] = {'question': 'Editează semnătura mea', 'answer': 'UR2T_EditSigns', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[5] = {'question': 'Import / export', 'answer': 'UR2T_importExport', 'isPerso': false};
	UR2T.answers.UR['outils'].objects[6] = {'question': 'Despre', 'answer': 'UR2T_apropos', 'isPerso': false};
//	Rezolvare/resolicitare
UR2T.answers.UR['actiuni'] = {'name': 'Atențiune!!!!!!', 'objects': {}};
UR2T.answers.UR['actiuni'].objects[0] = {'question': 'NU MAI FOLOSIȚI ACEST SCRIPT', 'answer': 'folosiți URComments împreună cu Romanian list (deci aveți de descărcat 2 scripturi!!!!).', 'isPerso': false};

//}
UR2T.oldVer = GM_info.script.version;
//	Mise à jour du LS
UpdateLS();

/**********************************************/
/***	bootstrap, will call UR2T_init()	***/
/**********************************************/
function UR2T_bootstrap(){
	UR2T_addLog(1, 'info', 'bootstrap starts');
	if (typeof(unsafeWindow) === "undefined"){
		unsafeWindow = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		}) ();
	}
	/* begin running the code! */
	setTimeout(UR2T_init, 1000);
}

/* helper functions */
function UpdateLS(){
	localStorage.UR2T = JSON.stringify(UR2T);
}

function getId(node){
	if(node != '')return document.getElementById(node);
	return false;
}

function DOMDataFilter(obj){
	return JSON.parse(JSON.stringify(obj));
}

function getSelectedValue(node){
	var t = getId(node);
	return t.options[t.selectedIndex].value;
}

function getSelectedText(node){
	var t = getId(node);
	return t.options[t.selectedIndex].text;
}

function UR2T_addLog(UR2T_Level, UR2T_type, UR2T_text){
	if(UR2T_Level <= UR2T.debug_level){
		var HLaL_text = 'WME_UR2T_' + GM_info.script.version + ' : ' + UR2T_text;
		switch(UR2T_type){
			case 'info':
				console.info(HLaL_text);
				break;
			case 'error':
				console.error(HLaL_text);
				break;
			default:
				console.log(HLaL_text);
				break;
		}
		if(typeof(arguments[3]) !== 'undefined'){
			// console.debug(HLaL_text);
			console.debug(arguments[3]);
		}
	}
}

function UR2T_init(){
	// Waze object needed
	//		New WME compatibility
	if(typeof(unsafeWindow.require) === "undefined"){
		UCME_addLog('require NOK');
		window.setTimeout(UCME_init, 500);
		return;
	}
	require = unsafeWindow.require;
	//	Waze
	if(typeof(unsafeWindow.Waze) == 'undefined'){
		UR2T_addLog(1, 'error', 'unsafeWindow.Waze NOK', unsafeWindow.Waze);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze = unsafeWindow.Waze;
	//	Waze.map
	if(typeof(UR2T_Waze.map) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze.map NOK', UR2T_Waze.map);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze_map = UR2T_Waze.map;
	//	Waze.map.updateRequestLayer
	if(typeof(UR2T_Waze_map.updateRequestLayer) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze_map.updateRequestLayer NOK', UR2T_Waze_map.updateRequestLayer);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_updateRequestLayer = UR2T_Waze_map.updateRequestLayer;
	//	Waze.model
	if(typeof(UR2T_Waze.model) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze.model NOK', UR2T_Waze.model);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze_model = UR2T_Waze.model;
	//	Waze.model.updateRequestSessions
	if(typeof(UR2T_Waze_model.updateRequestSessions) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze_model.mapUpdateRequests NOK', UR2T_Waze_model.updateRequestSessions);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_model_updateRequestSessions = UR2T_Waze_model.updateRequestSessions;
	//	Waze.model.mapUpdateRequests
	if(typeof(UR2T_Waze_model.mapUpdateRequests) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze_model.mapUpdateRequests NOK', UR2T_Waze_model.mapUpdateRequests);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_model_mapUpdateRequests = UR2T_Waze_model.mapUpdateRequests;
	//	Waze.loginManager
	if(typeof(UR2T_Waze.loginManager) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze.loginManager NOK', UR2T_Waze.loginManager);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze_loginManager = UR2T_Waze.loginManager;
	//	Waze.loginManager.user
	if(typeof(UR2T_Waze_loginManager.user) == 'undefined'){
		UR2T_addLog(1, 'error', 'UR2T_Waze_loginManager.user NOK', UR2T_Waze_loginManager.user);
		window.setTimeout(UR2T_init, 500);
		return;
	}
	UR2T_Waze_user = UR2T_Waze_loginManager.user;
	UR2T_addLog(1, 'info', 'GVars done');
	lastURfid = null;
	UR2T.UR_Selected = null;
	//	Test
	// var test = UR2T_Waze_loginManager.getLoggedInUser();
	// console.dir(test);
	//	HTML
	_UR2T_Html = new UR2T_Html();
	_UR2T_Html.UR2T_Html();
	UR2T_addLog(1, 'info', 'Html renderer done');
	//	UR parser
	_UR2T_URparser = new UR2T_URparser();
	_UR2T_URparser.init();
	UR2T_addLog(1, 'info', 'UR parser in progress');
	//	Bibliothèque d'images
	_imgs = new UR2T_imgs();
	//	Periodic updates
	window.setInterval(_UR2T_Html.checkVisibility, 250);	//	pas d'event de sélection sur les UR :/
	UR2T_addLog(1, 'info', 'Periodic uptdates done');
	//	Events
	UR2T_addLog(1, 'info', 'Events done');
	// UR2T_RR_HTML();
	//	Données externes
	UR2T_GetUserResponses();
	//	Init finished
	UR2T_addLog(1, 'info', 'Init done');
}

function UR2T_imgs(){
	this.arrowShowWhite = '<svg height="10" width="20" style="stroke:white;stroke-width:2"><line x1="1" y1="3" x2="9" y2="3"/><line x1="1" y1="3" x2="5" y2="10"/><line x1="9" y1="3" x2="5" y2="10"/>Sorry, your browser does not support inline SVG.</svg>';
	this.arrowHideWhite = '<svg height="10" width="20" style="stroke:white;stroke-width:2"><line x1="1" y1="10" x2="9" y2="10"/><line x1="1" y1="10" x2="5" y2="3"/><line x1="9" y1="10" x2="5" y2="3"/>Sorry, your browser does not support inline SVG.</svg>';
}

function UR2T_URparser(){
	var _htmlURs = null;

	this.init = function(){
		var layerActive = UR2T_updateRequestLayer.getVisibility();
		if(!layerActive)UR2T_updateRequestLayer.setVisibility(true);
		_htmlURs = getId(UR2T_updateRequestLayer.id);
	}

	this.getSelURId = function(){
		var _htmlURList = _htmlURs.getElementsByTagName('div');
		for(var htmlURId in _htmlURList){
			var theEl = _htmlURList[htmlURId];
			if(typeof(theEl) != 'object')continue;
			var patt = new RegExp(/selected/);
			if(patt.test(theEl.className))return theEl.getAttribute('data-id');
		}
		return false;
	}
}

function UR2T_Html(){
	var _moveEl = false;
	var _UR2T_overlay = null;
	var _URId = null;
	var _URType = null;
	var _lastURId = null;
	var _theUR = null;
	var _panelsExpanded = false;
	var WME_map = getId('map');
	var WME_panel_container = getId('panel-container');
	var _lastURId = '';
	var _UR2T_editor = new UR2T_editor();
	var _showHidePanel = new showHidePanel();
	var _UR2T_editorId = null;

	this.UR2T_Html = function(){
		// UR2T_addLog(1, 'info', 'UR2T_Html called');
		//	create the ur2t overlay
		// var baseHtml = getId('map');
		var UR2T_overlay = document.createElement('div');
		UR2T_overlay.id = 'UR2T-overlay';
		UR2T_overlay.style.borderRadius = '5px';
		UR2T_overlay.style.zIndex = 1000;
		UR2T_overlay.style.backgroundColor = 'cyan';
		UR2T_overlay.style.textAlign = 'center';
		UR2T_overlay.style.padding = '10px';
		UR2T_overlay.style.display = 'none';
		UR2T_overlay.style.position = 'absolute';
		UR2T_overlay.style.height = '90px';
		UR2T_overlay.style.width = '350px';
		UR2T_overlay.style.top = Number(getId('toolbar').clientHeight + 10) + 'px';
		UR2T_overlay.style.left = '350px';
		/***	le titre du plugins		***/
		UR2T_container = document.createElement('div');
		UR2T_content = document.createElement('h3');
		UR2T_content.id = 'UR2T-overlay-titre';
		UR2T_content.innerHTML = GM_info.script.name;
		UR2T_container.appendChild(UR2T_content);
		//	le contenue des réponses
		UR2T_container2 = document.createElement('div');
		UR2T_container2.id = "UR2T-overlay-responses";
		UR2T_container2.style.marginTop = '10px';
		UR2T_container.appendChild(UR2T_container2);
		//	on insère la zone de réponse
		UR2T_overlay.appendChild(UR2T_container);
		//	On insère le tout
		WME_map.appendChild(UR2T_overlay);
		_UR2T_overlay = getId('UR2T-overlay');
		// UR2T_addLog(1, 'info', 'UR2T_Html init finished', _UR2T_overlay);
		//	events
		var _moveDiv = new moveDiv();
		getId('UR2T-overlay-titre').onmousedown = _moveDiv.set;
		getId('UR2T-overlay-titre').onmouseup = _moveDiv.reset;
		WME_map.onmousemove = _moveDiv.moveEl;
	};

	this.checkVisibility = function(){
		if(WME_panel_container.innerHTML == ''){
			getId('UR2T-overlay-responses').innerHTML = '';
			_lastURId = '';
			_theUR = null;
			resetPlug('none');
			_panelsExpanded = false;
			return;
		}
		_URId = _UR2T_URparser.getSelURId();
		// console.info(_URId);
		if(_URId === false)return;
		_URType = UR2T_model_mapUpdateRequests.get(_URId).attributes.type;
		// console.dir(_theUR);
		//	Fast UR change
		if(_URId != _lastURId){
			// console.info('IS fast UR change : ' + _URId + ' ' + _lastURId);
			_lastURId = _URId;
			getId('UR2T-overlay-responses').innerHTML = '';
			_panelsExpanded = false;
		}
		else return;
		//	Update _lastURId
		_lastURId = _URId;
		//	post traitements
		expandPanels();
		fixTextArea();
		_showHidePanel.init();
		populateURResponses();
		resetPlug('block');
	};

	function moveDiv(){
		var _rec = WME_map.getBoundingClientRect();
		var _moveEl = false;
		var _layerX = null;
		var _layerY = null;

		this.init = function(){
		}

		this.set = function(){
			getId('UR2T-overlay-titre').style.cursor = 'move';
			_moveEl = true;
		}

		this.reset = function(){
			getId('UR2T-overlay-titre').style.cursor = 'default';
			_layerX = null;
			_layerY = null;
			_moveEl = false;
		}

		this.moveEl = function(event){
			if(_moveEl){
				if(_layerX == null && _layerY == null){
					_layerX = event.layerX;
					_layerY = event.layerY;
				}
				var _left = Number(event.clientX - _layerX - _rec.left);
				if(_left < 0)_left = 0;
				var _top = Number(event.clientY - _layerY - _rec.top);
				if(_top < 0)_top = 0;
				_UR2T_overlay.style.left = _left + 'px';
				_UR2T_overlay.style.top = _top + 'px';
			}
		}

	}

	function resetPlug(displayType){
		_UR2T_overlay.style.display = displayType;
		_UR2T_editor.hide();
	}

	function expandPanels(){
		if(!_panelsExpanded){
			// console.info('expandPanels called');
			var bodyDivs = WME_panel_container.getElementsByClassName('body')[0].getElementsByTagName('div');
			for(var el in bodyDivs){
				var theEl = bodyDivs[el];
				if(typeof(theEl.className) != 'string')continue;
				patt = new RegExp(/actions section/);
				var patt = new RegExp('collapsed');
				if(patt.test(theEl.className))theEl.className = theEl.className.replace(/ ?collapsed ?/, '');
				patt = new RegExp(/actions section/);
				if(patt.test(theEl.className))theEl.className = theEl.className + ' collapsed';
			}
			_panelsExpanded = true;
			// fixTextArea();
		}

	}

	function fixTextArea(){
		var _body = WME_panel_container.getElementsByClassName('body')[0];
		var _section = _body.getElementsByClassName('conversation section')[0];
		var _textarea = _section.getElementsByClassName('form-control new-comment-text')[0];
		if(typeof(_textarea) == 'undefined'){
			window.setTimeout(fixTextArea, 250);
			return;
		}
		_textarea.style.height = '110px';

	}

	function showHidePanel(){
		var _body = null;
		var _texte = null;
		var _newContainer = null;

		this.init = function(){
			_body = WME_panel_container.getElementsByClassName('body')[0];
			var reported = WME_panel_container.getElementsByClassName('reported')[0];
			_texte = reported.innerHTML;
			reported.innerHTML = '';
			var container = document.createElement('span');
			container.id = 'UR2T-showHidePanels';
			container.style.cursor = 'pointer';
			container.innerHTML = _imgs.arrowHideWhite + _texte;
			reported.appendChild(container);
			_newContainer = getId('UR2T-showHidePanels');
			_newContainer.onclick = checkState;
		}

		function show(){
			_newContainer.innerHTML = _imgs.arrowHideWhite + _texte;
			_body.style.display = 'block';
			_UR2T_overlay.style.display = 'block';
		}

		function hide(){
			if(_UR2T_editorId != null)_UR2T_editorId.style.display = 'none';
			_newContainer.innerHTML = _imgs.arrowShowWhite + _texte;
			_body.style.display = 'none';
			_UR2T_overlay.style.display = 'none';
		}

		function checkState(){
			if(_body.style.display == 'block' || _body.style.display == '')hide();
			else show();
		}
	}

	function populateURResponses(){
		var UR2T_overlay_responses = getId('UR2T-overlay-responses');
		if(UR2T_overlay_responses.innerHTML != "")return;
		var UR2T_content = document.createElement('select');
		UR2T_content.id = 'UR2T_msgs';
		UR2T_overlay_responses.appendChild(UR2T_content);
		//	Populate the select
		var dummy = document.createElement('option');
		dummy.text = 'Alege un tip de răspuns';
		UR2T_content.add(dummy);
		//	events
		getId('UR2T_msgs').onchange = AutoComment;
		//	Populate the select
		console.info(_URType);
		if(_URType != -1){
			if(_URType > 5 && _URType < 8 || _URType > 8 && _URType < 17 || _URType == 18){
				var cat_name = UR2T.answers.UR[_URType].name;
				var dummygroup = document.createElement('optgroup');
				dummygroup.label = UR2T.answers.UR[_URType].name;
				dummygroup.style.backgroundColor = '#FFCC00';
				UR2T_content.add(dummygroup);
				var answers = UR2T.answers.UR[_URType].objects;
				for(var answer in answers){
					if(isNaN(answer))continue;
					var dummy = document.createElement('option');
					dummy.value = _URType + '-' + answer;
					dummy.text = '- ' + UR2T.answers.UR[_URType].objects[answer].question.slice(0, 45);
					UR2T_content.add(dummy);
				}
			}
			else{	//	author alert
				dummygroup = document.createElement('optgroup');
				dummygroup.label = 'Please alert author: Myriades';
				dummygroup.style.backgroundColor = 'red';
				UR2T_content.add(dummygroup);
				dummygroup = document.createElement('optgroup');
				dummygroup.label = 'Unknow request type : ' + _URType;
				dummygroup.style.backgroundColor = 'red';
				UR2T_content.add(dummygroup);
			}
		}
		//	Actiuni rapide UR
		dummygroup = document.createElement('optgroup');
		dummygroup.label = UR2T.answers.UR['actiuni'].name;
		dummygroup.style.backgroundColor = '#44B9EC';
		UR2T_content.add(dummygroup);
		var answers = UR2T.answers.UR['actiuni'].objects;
		for(var answer in answers){
			if(isNaN(answer))continue;
			dummy = document.createElement('option');
			dummy.value = 'actiuni-' + answer;
			dummy.text = '- ' + UR2T.answers.UR['actiuni'].objects[answer].question;
			UR2T_content.add(dummy);
		}
		//	Speed limits
		dummygroup = document.createElement('optgroup');
		dummygroup.label = UR2T.answers.UR['speedlimit'].name;
		dummygroup.style.backgroundColor = '#FF0000';
		UR2T_content.add(dummygroup);
		var answers = UR2T.answers.UR['speedlimit'].objects;
		for(var answer in answers){
			if(isNaN(answer))continue;
			dummy = document.createElement('option');
			dummy.value = 'speedlimit-' + answer;
			dummy.text = '- ' + UR2T.answers.UR['speedlimit'].objects[answer].question;
			UR2T_content.add(dummy);
		}
		//	Divers
		dummygroup = document.createElement('optgroup');
		dummygroup.label = UR2T.answers.UR['divers'].name;
		dummygroup.style.backgroundColor = '#44B9EC';
		UR2T_content.add(dummygroup);
		var answers = UR2T.answers.UR['divers'].objects;
		for(var answer in answers){
			if(isNaN(answer))continue;
			dummy = document.createElement('option');
			dummy.value = 'divers-' + answer;
			dummy.text = '- ' + UR2T.answers.UR['divers'].objects[answer].question;
			UR2T_content.add(dummy);
		}
		//	Locuri și adrese
		dummygroup = document.createElement('optgroup');
		dummygroup.label = UR2T.answers.UR['places'].name;
		dummygroup.style.backgroundColor = '#00FF00';
		UR2T_content.add(dummygroup);
		var answers = UR2T.answers.UR['places'].objects;
		for(var answer in answers){
			if(isNaN(answer))continue;
			dummy = document.createElement('option');
			dummy.value = 'places-' + answer;
			dummy.text = '- ' + UR2T.answers.UR['places'].objects[answer].question;
			UR2T_content.add(dummy);
		}
		//	Outils
		dummygroup = document.createElement('optgroup');
		dummygroup.label = UR2T.answers.UR['outils'].name;
		dummygroup.style.backgroundColor = '#33CC33';
		UR2T_content.add(dummygroup);
		var answers = UR2T.answers.UR['outils'].objects;
		for(var answer in answers){
			if(isNaN(answer))continue;
			dummy = document.createElement('option');
			dummy.value = 'outils-' + answer;
			dummy.text = '- ' + UR2T.answers.UR['outils'].objects[answer].question;
			UR2T_content.add(dummy);
		}
	}

	function AutoComment(){
		var myTextArea = document.getElementsByClassName('form-control new-comment-text')[0];
		var UR2T_msgs = getId('UR2T_msgs');
		if(UR2T_msgs.selectedIndex > 0){
			_UR2T_editor.init();
			_UR2T_editor.hide();
			var indexes = getSelectedValue('UR2T_msgs').split('-');
			var le_texte = UR2T.answers.UR[indexes[0]].objects[indexes[1]].answer;
			if(le_texte.indexOf('UR2T_') == 0){
				switch(le_texte){
					case'UR2T_EditResponses':
						_UR2T_editor.editResponses();
						_UR2T_editor.show();
						break;
					case'UR2T_apropos':
						_UR2T_editor.apropos();
						_UR2T_editor.show();
						break;
					case'UR2T_EditSigns':
						_UR2T_editor.editSigns();
						_UR2T_editor.show();
						break;
					case'UR2T_insertSign':
						myTextArea.value = myTextArea.value + '\n\n' + UR2T.userSign;
						break;
					case'UR2T_AddResponses':
						// _UR2T_editor.showBtns('Anulează|Salvează');
						// UR2T_AddResponses();
						break;
					case'UR2T_importExport':
						// importExport = new UR2T_importExport;
						// importExport.IE_init();
						break;
				}
			}
			else{
				if(le_texte.length > 0){
					var le_texte = bonJourSoir(le_texte);
					if(UR2T.userSign.length > 0)le_texte = le_texte + '\n\n' + UR2T.userSign;
				}
				myTextArea.value = le_texte;
			}
			UR2T_msgs.selectedIndex = 0;
			// if(typeof(UR2T.answers.UR[indexes[0]].objects[indexes[1]].special) !== 'undefined'){
				// getId('state--1').checked = false;
				// getId('state-0').checked = true;
			// }
		}

		function bonJourSoir(leTexte){
			var recherche = new RegExp('^(bună (ziua|seara|dimineața))', 'i');
			if(leTexte.match(recherche) === null){
				return leTexte;
			}
			//	Vérification de l'heure du jour
			var UR2T_date = new Date();
			var heure = UR2T_date.getHours();
			var UR2T_replace = 'Bună ziua';
            if(heure < 12)UR2T_replace = 'Bună dimineața';
			if(heure > 17 || heure < 4)UR2T_replace = 'Bună seara';
			return leTexte.replace(recherche, UR2T_replace);
		}
	}

	function fixBoxHeight(boxHeight){
		updateLogZone('green', '', 0);
		/***	position V2	***/
		//	on nettoie la zone à peupler
		// getId('UR2T-overlay-content').innerHTML = '';
		//	On remet le bouton annuler/fermer sur fermer
		// getId('UR2T-overlay-btn-cancel').innerHTML = 'Fermer';
		//	On règle la hauteur de la box
		_UR2T_overlay.style.height = boxHeight + 'px';
		//	On règle la position de la box
		// var topPosition = getId('toolbar').clientHeight + getId('update-request-panel').clientHeight + 20;
		// UR2T_overlay.style.top = topPosition + 'px';
		// var leftPosition = document.getElementsByClassName('ur-comment-list')[0].clientWidth + 20;
		// UR2T_overlay.style.left = leftPosition + 'px';
	}

	function UR2T_editor(){
		var _UR2T_container = null;

		this.init = function(){
			// UR2T_addLog(1, 'info', 'UR2T_editor called');
			if(_UR2T_editorId != null)return;
			/***	le conteneur	***/
			var UR2T_editor = document.createElement('div');
			UR2T_editor.id = 'UR2T-editor';
			UR2T_editor.style.borderRadius = '5px';
			UR2T_editor.style.zIndex = 1000;
			UR2T_editor.style.backgroundColor = 'white';
			UR2T_editor.style.textAlign = 'center';
			UR2T_editor.style.padding = '10px';
			UR2T_editor.style.display = 'none';
			UR2T_editor.style.position = 'absolute';
			UR2T_editor.style.height = '350px';
			UR2T_editor.style.width = '500px';
			UR2T_editor.style.top = Number(getId('UR2T-overlay').clientHeight + getId('toolbar').clientHeight + 20) + 'px';
			UR2T_editor.style.left = '350px';
			/***	Les boutons		***/
			var UR2T_container = document.createElement('div');
			UR2T_container.id = 'UR2T-editor-btn';
			UR2T_container.style.position = 'absolute';
			UR2T_container.style.bottom = '10px';
			UR2T_container.style.right = '10px';
			UR2T_editor.appendChild(UR2T_container);
			// Le bouton 1
			var UR2T_btn_1 = document.createElement('button');
			UR2T_btn_1.id = 'UR2T-editor-btn-1';
			UR2T_btn_1.style.visibility = 'hidden';
			UR2T_btn_1.innerHTML = 'Salvează';
			UR2T_container.appendChild(UR2T_btn_1);
			// Le bouton 0
			var UR2T_btn_0 = document.createElement('button');
			UR2T_btn_0.id = 'UR2T-editor-btn-0';
			UR2T_btn_0.style.marginLeft = '10px';
			UR2T_btn_0.style.visibility = 'hidden';
			UR2T_btn_0.innerHTML = 'Anulează';
			UR2T_container.appendChild(UR2T_btn_0);
			/***	La zone de log	***/
			UR2T_container = document.createElement('div');
			UR2T_container.id = 'UR2T-editor-log';
			UR2T_container.style.position = 'absolute';
			UR2T_container.style.bottom = '10px';
			UR2T_container.style.left = '10px';
			UR2T_container.style.fontWeight = 'bold';
			UR2T_editor.appendChild(UR2T_container);
			/***	la zone de contenu	***/
			UR2T_container = document.createElement('div');
			UR2T_container.id = 'UR2T-editor-content';
			UR2T_editor.appendChild(UR2T_container);
			/***	On insère le tout	***/
			WME_map.appendChild(UR2T_editor);
			_UR2T_editorId = getId('UR2T-editor');
			_UR2T_container = getId('UR2T-editor-content');
		}

		this.show = function(){
			_UR2T_editorId.style.display = 'block';
		}

		this.hide = function(){
			_UR2T_editorId.style.display = 'none';
		}

		this.apropos = function(){
			fixBox('210');
			//	Les boutons
			showBtns('Fermer');
			//	le contenant
			_UR2T_container.innerHTML = '';
			/***	Le contenu	***/
			var UR2T_content = document.createElement('h2');
			UR2T_content.id = "UR2T_titre";
			UR2T_content.innerHTML = 'Despres';
			_UR2T_container.appendChild(UR2T_content);
			//	script name
			UR2T_content = document.createElement('h3');
			UR2T_content.style.marginTop = '10px';
			UR2T_content.innerHTML = GM_info.script.name;
			_UR2T_container.appendChild(UR2T_content);
			//	script version
			UR2T_content = document.createElement('div');
			UR2T_content.style.marginTop = '10px';
			UR2T_content.innerHTML = 'Script version : ' + GM_info.script.version;
			_UR2T_container.appendChild(UR2T_content);
			//	Forum
			UR2T_content = document.createElement('div');
			UR2T_content.style.marginTop = '10px';
			UR2T_content.innerHTML = 'Forum: <a href="https://www.waze.com/forum/viewtopic.php?f=120" target="_blank">română</a>';
			_UR2T_container.appendChild(UR2T_content);

			//	Contact author
			UR2T_content = document.createElement('div');
			UR2T_content.style.marginTop = '10px';
			UR2T_content.innerHTML = 'Contactează autorul : <a href="https://www.waze.com/forum/ucp.php?i=pm&mode=compose&username_list=spookyx&subject=' + GM_info.script.name + ' ' + GM_info.script.version + '" target="_blank">SpookyX</a>';
			_UR2T_container.appendChild(UR2T_content);
			/***	events	***/
			getId('UR2T-editor-btn-0').onclick = this.hide;
		}

		this.editSigns = function(){
			var _oldSign = UR2T.userSign;
			fixBox('155');
			//	Les boutons
			showBtns('Fermer');
			//	le contenant
			_UR2T_container.innerHTML = '';
			/***	Le contenu	***/
			var UR2T_content = document.createElement('h2');
			UR2T_content.id = "UR2T_titre";
			UR2T_content.innerHTML = 'Editare semnătură';
			_UR2T_container.appendChild(UR2T_content);
			//	La zone de texte
			UR2T_content = document.createElement('textarea');
			UR2T_content.id = 'UR2T-editor-userSign';
			UR2T_content.setAttribute('placeholder', 'Introdu semnătura ta aici');
			UR2T_content.style.width = '100%';
			UR2T_content.style.height = '55px';
			UR2T_content.style.marginTop = '10px';
			UR2T_content.value = _oldSign;
			_UR2T_container.appendChild(UR2T_content);
			/***	Events	***/
			getId('UR2T-editor-userSign').oninput = function(){showBtns('Annuler|Enregistrer')};
			getId('UR2T-editor-btn-1').onclick = saveDatas;
			getId('UR2T-editor-btn-0').onclick = this.hide;

		}

		this.editResponses = function(){
			fixBox('360');
			//	Les boutons
			showBtns('Fermer');
			//	le contenant
			_UR2T_container.innerHTML = '';
			/***	Le contenu	***/
			var UR2T_container2 = document.createElement('div');
			var UR2T_content = document.createElement('h2');
			UR2T_content.id = "UR2T_titre";
			UR2T_content.innerHTML = 'Editează răspunsuri automate';
			UR2T_container2.appendChild(UR2T_content);
			_UR2T_container.appendChild(UR2T_container2);
			/***	Le contenu 1	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			UR2T_content.setAttribute('for', 'UR2T-editor-cat');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Section';
			UR2T_container2.appendChild(UR2T_content);
			var UR2T_select = document.createElement('select');
			UR2T_select.id = 'UR2T-editor-cat';
			UR2T_select.innerHTML = '<option value="">Selectează o secțiune</option>';
			UR2T_container2.appendChild(UR2T_select);
			//	Populate the dropdown
			var UR2T_options = [];
			for(var URIndex in UR2T.answers.UR){
				UR2T_options.push(UR2T.answers.UR[URIndex].name);
			}
			UR2T_options.sort();
			//	Get the indexes
			var UR2T_options_index = [];
			for(var URDesc in UR2T_options){
				for(var URIndex in UR2T.answers.UR){
					if(UR2T_options[URDesc] == UR2T.answers.UR[URIndex].name){
						UR2T_options_index.push(URIndex);
						break;
					}
				}
			}
			for(var i=0; i<UR2T_options.length; i++){
				if(UR2T_options[i] == 'Outils')continue;
				var UR2T_option = document.createElement('option');
				UR2T_option.value = UR2T_options_index[i];
				UR2T_option.innerHTML = UR2T_options[i];
				UR2T_select.appendChild(UR2T_option);
			}
			/***	Le contenu 2	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			// UR2T_content.setAttribute('for', 'UR2T-editor-question');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Intitulé';
			UR2T_container2.appendChild(UR2T_content);
			UR2T_select = document.createElement('select');
			UR2T_select.id = 'UR2T-editor-question';
			UR2T_select.innerHTML = '<option>Alege o întrebare</option>';
			UR2T_container2.appendChild(UR2T_select);
			/***	Le contenu 3	***/
			UR2T_container2 = document.createElement('div');
			UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			UR2T_content = document.createElement('label');
			// UR2T_content.setAttribute('for', 'UR2T-editor-response');
			UR2T_content.style.marginRight = '10px';
			UR2T_content.innerHTML = 'Textul răspunsului automat';
			UR2T_container2.appendChild(UR2T_content);
			/***	Le contenu 4	***/
			UR2T_container2 = document.createElement('div');
			// UR2T_container2.style.marginTop = '10px';
			_UR2T_container.appendChild(UR2T_container2);
			var UR2T_textarea = document.createElement('textarea');
			UR2T_textarea.id = 'UR2T-editor-response';
			UR2T_textarea.setAttribute('placeholder', 'Introdu răspunsul tău aici');
			UR2T_textarea.style.width = '100%';
			UR2T_textarea.style.height = '150px';
			UR2T_container2.appendChild(UR2T_textarea);
			/***	On insère le tout	***/
			_UR2T_container.appendChild(UR2T_container2);
			/***	Events	***/
			getId('UR2T-editor-cat').onchange = PopulateQuestions;
			getId('UR2T-editor-question').onchange = PopulateAnswers;
			getId('UR2T-editor-response').oninput = function(){showBtns('Annuler|Enregistrer');};
			getId('UR2T-editor-btn-0').onclick = this.hide;
			getId('UR2T-editor-btn-1').onclick = saveDatas;

			function PopulateAnswers(){
				var theCat = getId('UR2T-editor-cat');
				var theCatValue = theCat.options[theCat.selectedIndex].value;
				if(theCat.selectedIndex > 0){
					var theQuestion = getId('UR2T-editor-question');
					var theQuestionValue = theQuestion.options[theQuestion.selectedIndex].value;
					if(theQuestion.selectedIndex > 0){
						var UR2T_OR = getId('UR2T-editor-response');
						UR2T_OR.value = UR2T.answers.UR[theCatValue].objects[theQuestionValue].answer;
						return;
					}
				}
				getId('UR2T-editor-response').value = "";
			}
		}

		function PopulateQuestions(){
			getId('UR2T-editor-response').value = "";
			var UR2T_cat_dropDown = getId('UR2T-editor-cat');
			var UR2T_question_dropdown = getId('UR2T-editor-question');
			UR2T_question_dropdown.innerHTML = '<option>Alege o întrebare</option>';
			if(UR2T_cat_dropDown.selectedIndex > 0){
				var theRef = getSelectedValue('UR2T-editor-cat');
				var URObjects = UR2T.answers.UR[theRef].objects;
				var UR2T_questions = [];
				for(var QId in URObjects){
					UR2T_questions.push(URObjects[QId].question);
				}
				UR2T_questions.sort();
				//	Get the indexes
				var UR2T_questions_index = [];
				for(var URQuestion in UR2T_questions){
					for(var URIndex in URObjects){
						if(UR2T_questions[URQuestion] == URObjects[URIndex].question){
							UR2T_questions_index.push(URIndex);
							break;
						}
					}
				}
				for(var i=0; i<UR2T_questions.length; i++){
					var UR2T_option = document.createElement('option');
					UR2T_option.value = UR2T_questions_index[i];
					UR2T_option.innerHTML = UR2T_questions[i];
					UR2T_question_dropdown.appendChild(UR2T_option);
				}
			}
			else{
				showBtns('Salvează');
				UR2T_question_dropdown.innerHTML = '<option>Alege o întrebare</option>';
			}
		}

		function showBtns(btnList){
			var btnsArr = btnList.split('|');
			for(var i=0; i < 2;i++){
				if(i < btnsArr.length){
					getId('UR2T-editor-btn-' + i).style.visibility = 'visible';
					getId('UR2T-editor-btn-' + i).innerHTML = btnsArr[i];
				}
				else
					getId('UR2T-editor-btn-' + i).style.visibility = 'hidden';
			}
		}

		function fixBox(boxHeight){
			_UR2T_editorId.style.height = boxHeight + 'px';
		}

		function updateLogZone(color, text, timeBefore){
			if(typeof(timeOut) != 'undefined'){
				// console.info(timeOut);
				clearTimeout(timeOut);
			}
			var textZone = getId('UR2T-editor-log');
			if(timeBefore > 0){
				textZone.style.color = color;
				textZone.innerHTML = text;
				timeOut = window.setTimeout(function(){textZone.innerHTML = '';}, timeBefore);
			}
			else textZone.innerHTML = '';
		}

		function saveDatas(){
			switch(getId('UR2T_titre').innerHTML){
				case'Editează semnătura':
					UR2T.userSign = getId('UR2T-editor-userSign').value;
					break;
				case'Editează răspunsuri automate':
					try{
						if(getSelectedValue('UR2T-editor-cat') == 0)throw 'Nu este selectată categoria';
						if(isNaN(getSelectedValue('UR2T-editor-question')))throw 'Nu este selectată întrebarea';
						if(getId('UR2T-editor-response').value == '')throw 'Răspuns gol';
					}
					catch(e){
						showBtns('Sașvează');
						updateLogZone('red', e, 5000);
						return;
					}
					UR2T.answers.UR[getSelectedValue('UR2T-editor-cat')].objects[getSelectedValue('UR2T-editor-question')].answer = getId('UR2T-editor-response').value;
					break;
/*				case'Adăugați un răspuns automat':
					console.info('getId(\'UR2T-overlay-cat\').selectedIndex : ' + getSelectedValue('UR2T-overlay-cat'));
					if(getId('UR2T-overlay-cat').selectedIndex == 0)return;
					console.info('getId(\'UR2T-overlay-question-id\').value : ' + getId('UR2T-overlay-question-id').value);
					if(getId('UR2T-overlay-question').value.length == 0)return;
					console.info('getId(\'UR2T-overlay-question\').value : ' + getId('UR2T-overlay-question').value);
					if(getId('UR2T-overlay-response').value.length == 0)return;
					console.info('getId(\'UR2T-overlay-response\').value : ' + getId('UR2T-overlay-response').value);
					var t = UR2T.answers.UR[getSelectedValue('UR2T-overlay-cat')].objects[getId('UR2T-overlay-question-id').value] = {};
					t.question = getId('UR2T-overlay-question').value;
					t.answer = getId('UR2T-overlay-response').value;
					t.isPerso = true;
					console.dir(UR2T.answers.UR[getSelectedValue('UR2T-overlay-cat')].objects);
					UpdateLS();
					UR2T_SaveUserResponses();
					break;
				case'Import / export':
					if(importExport.imports()){
						UpdateLS();
						UR2T_SaveUserResponses();
					}
					break;*/
			}
			UpdateLS();
			externalSave();

			function externalSave(){
				var UR2T_export = {};
				UR2T_export.script = "UR2T";
				UR2T_export.user = {};
				UR2T_export.user.id = UR2T_Waze_user.id;
				UR2T_export.user.rank = UR2T_Waze_user.rank;
				UR2T_export.user.userName = UR2T_Waze_user.userName;
				UR2T_export.user.userSign = UR2T.userSign;
				UR2T_export.user.scriptVer = UR2T.scriptVer;
				UR2T_export.action = '';
				UR2T_export.datas = {};
				//	Sauvegarde partielle
				switch(getId('UR2T_titre').innerHTML){
					case'Editează semnătura':
						if(getId('UR2T-editor-userSign').value == "")return;
						UR2T_export.user.userSign = getId('UR2T-editor-userSign').value;
						break;
					case'Editează răspunsuri automate':
						UR2T_export.datas[getSelectedValue('UR2T-editor-cat')] = {'name': getSelectedText('UR2T-editor-cat'), 'objects': {}};
						UR2T_export.datas[getSelectedValue('UR2T-editor-cat')].objects[getSelectedValue('UR2T-editor-question')] = {'question': getSelectedText('UR2T-editor-question'), 'answer': getId('UR2T-editor-response').value};
						break;
/*					case'Adăugați un răspuns automat':
						if(getId('UR2T-editor-cat').selectedIndex == 0)return;
						UR2T_export.datas[getSelectedValue('UR2T-editor-cat')] = {'name': getSelectedText('UR2T-editor-cat'), 'objects': {}};
						UR2T_export.datas[getSelectedValue('UR2T-editor-cat')].objects[getId('UR2T-editor-question-id').value] = {'question': getId('UR2T-editor-question').value, 'answer': getId('UR2T-editor-response').value};
						console.dir(UR2T_export);
						break;
					case'Import / export':
						UR2T_export.datas = UR2T.answers.UR;
						break;*/
				}
				transmitDatas();
				function transmitDatas(){
					var UR2T_export_JSON = JSON.stringify(UR2T_export);
					var ret = GM_xmlhttpRequest({
						method: "POST",
						// url: "http://wmebookmarks.free.fr/manageDatas.php",
						url: "http://waze.gensig.info/WME/WME%20UR2T/manageDatas.php",
						data: 'JSONdatas=' + UR2T_export_JSON,
						headers: {
										"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
									},
						onload: function(r){showBtns('Fermer');updateLogZone('green', r.responseText, 5000);console.log("WME UR2T: Saving: " + r.responseText);},
						onerror: function(r){console.log("WME UR2T: Error: " + r.responseText);}
					});
				}
			}
		}
	}
}


/*****************************************************/
/***				OLD VER						   ***/
/*****************************************************/

function UR2T_RR_HTML(){
	var theMap = getId('map');
	var UR2T_container = document.createElement('div');
	UR2T_container.id = 'UR2T-overlay';
	UR2T_container.className = 'form-control';
	UR2T_container.style.zIndex = 990;
	UR2T_container.style.backgroundColor = 'white';
	UR2T_container.style.textAlign = 'center';
	UR2T_container.style.margins = '10px';
	UR2T_container.style.display = 'none';
	UR2T_container.style.position = 'absolute';
	// UR2T_container.style.height = '360px';
	UR2T_container.style.width = '600px';
	/***	La zone d'information	***/
	var UR2T_container2 = document.createElement('div');
	UR2T_container2.id = 'UR2T-overlay-log';
	UR2T_container2.style.position = 'absolute';
	UR2T_container2.style.bottom = '10px';
	UR2T_container2.style.left = '10px';
	UR2T_container2.style.fontWeight = 'bold';
	UR2T_container.appendChild(UR2T_container2);
	/***	Les boutons		***/
	UR2T_container2 = document.createElement('div');
	UR2T_container2.id = 'UR2T-overlay-btn';
	UR2T_container2.style.position = 'absolute';
	UR2T_container2.style.bottom = '10px';
	UR2T_container2.style.right = '10px';
	UR2T_container.appendChild(UR2T_container2);
	//	Le bouton enregistrer
	var UR2T_btn_save = document.createElement('button');
	UR2T_btn_save.id = 'UR2T-overlay-btn-save';
	UR2T_btn_save.innerHTML = 'Salvează';
	UR2T_container2.appendChild(UR2T_btn_save);
	//	Le bouton annuler
	var UR2T_btn_cancel = document.createElement('button');
	UR2T_btn_cancel.id = 'UR2T-overlay-btn-cancel';
	UR2T_btn_cancel.style.marginLeft = '10px';
	UR2T_btn_cancel.innerHTML = 'Anulează';
	UR2T_container2.appendChild(UR2T_btn_cancel);
	//	The real container
	UR2T_container2 = document.createElement('div');
	UR2T_container2.id = 'UR2T-overlay-content';
	UR2T_container.appendChild(UR2T_container2);
	//	On insère le tout
	theMap.appendChild(UR2T_container);
	//	events
	getId('UR2T-overlay-btn-cancel').onclick = UR2T_CancelResponses;
	getId('UR2T-overlay-btn-save').onclick = UR2T_SaveResponses;
}

function UR2T_ER_HTML(){
	UR2T_fixBox('360');
	var UR2T_container = getId('UR2T-overlay-content');
	/***	Le contenu	***/
	UR2T_container2 = document.createElement('div');
	UR2T_container.appendChild(UR2T_container2);
	UR2T_content = document.createElement('h2');
	UR2T_content.id = "UR2T_titre";
	UR2T_content.innerHTML = 'Editează răspunsuri automate';
	UR2T_container2.appendChild(UR2T_content);
	/***	Le contenu 1	***/
	UR2T_container2 = document.createElement('div');
	UR2T_container2.style.marginTop = '10px';
	UR2T_container.appendChild(UR2T_container2);
	UR2T_content = document.createElement('label');
	UR2T_content.setAttribute('for', 'UR2T-overlay-cat');
	UR2T_content.style.marginRight = '10px';
	UR2T_content.innerHTML = 'Section';
	UR2T_container2.appendChild(UR2T_content);
	var UR2T_select = document.createElement('select');
	UR2T_select.id = 'UR2T-overlay-cat';
	UR2T_select.innerHTML = '<option value="">Alege o secțiune</option>';
	UR2T_container2.appendChild(UR2T_select);
	//	Populate the dropdown
	var UR2T_options = [];
	for(var URIndex in UR2T.answers.UR){
		UR2T_options.push(UR2T.answers.UR[URIndex].name);
	}
	UR2T_options.sort();
	//	Get the indexes
	var UR2T_options_index = [];
	for(var URDesc in UR2T_options){
		for(var URIndex in UR2T.answers.UR){
			if(UR2T_options[URDesc] == UR2T.answers.UR[URIndex].name){
				UR2T_options_index.push(URIndex);
				break;
			}
		}
	}
	for(var i=0; i<UR2T_options.length; i++){
		if(UR2T_options[i] == 'Outils')continue;
		var UR2T_option = document.createElement('option');
		UR2T_option.value = UR2T_options_index[i];
		UR2T_option.innerHTML = UR2T_options[i];
		UR2T_select.appendChild(UR2T_option);
	}
	/***	Le contenu 2	***/
	UR2T_container2 = document.createElement('div');
	UR2T_container2.style.marginTop = '10px';
	UR2T_container.appendChild(UR2T_container2);
	UR2T_content = document.createElement('label');
	// UR2T_content.setAttribute('for', 'UR2T-overlay-question');
	UR2T_content.style.marginRight = '10px';
	UR2T_content.innerHTML = 'Intitulé';
	UR2T_container2.appendChild(UR2T_content);
	UR2T_select = document.createElement('select');
	UR2T_select.id = 'UR2T-overlay-question';
	UR2T_select.innerHTML = '<option>Alege o întrebare</option>';
	UR2T_container2.appendChild(UR2T_select);
	/***	Le contenu 3	***/
	UR2T_container2 = document.createElement('div');
	UR2T_container2.style.marginTop = '10px';
	UR2T_container.appendChild(UR2T_container2);
	UR2T_content = document.createElement('label');
	// UR2T_content.setAttribute('for', 'UR2T-overlay-response');
	UR2T_content.style.marginRight = '10px';
	UR2T_content.innerHTML = 'Textul răspunsului automat';
	UR2T_container2.appendChild(UR2T_content);
	/***	Le contenu 4	***/
	UR2T_container2 = document.createElement('div');
	// UR2T_container2.style.marginTop = '10px';
	UR2T_container.appendChild(UR2T_container2);
	var UR2T_textarea = document.createElement('textarea');
	UR2T_textarea.id = 'UR2T-overlay-response';
	UR2T_textarea.setAttribute('placeholder', 'Introdu răspunsul tău');
	UR2T_textarea.style.width = '100%';
	UR2T_textarea.style.height = '150px';
	UR2T_container2.appendChild(UR2T_textarea);
	//	events
	getId('UR2T-overlay-cat').onchange = UR2T_PopulateQuestions;
	getId('UR2T-overlay-question').onchange = UR2T_PopulateAnswers;
	getId('UR2T-overlay-response').oninput = function(){getId('UR2T-overlay-btn-cancel').innerHTML = 'Annuler';};
	UR2T_showBtn('cancel|save');
}

function UR2T_AddResponses(){
	UR2T_fixBox('360');
	var UR2T_container = getId('UR2T-overlay-content');
	/***	Le titre	***/
	UR2T_container2 = document.createElement('div');
	UR2T_container.appendChild(UR2T_container2);
	UR2T_content = document.createElement('h2');
	UR2T_content.id = "UR2T_titre";
	UR2T_content.innerHTML = 'Adaugă un răspuns automat';
	UR2T_container2.appendChild(UR2T_content);
	/***	Le dropdown de catégorie	***/
	UR2T_container2 = document.createElement('div');
	UR2T_container2.style.marginTop = '10px';
	UR2T_container.appendChild(UR2T_container2);
	UR2T_content = document.createElement('label');
	UR2T_content.setAttribute('for', 'UR2T-overlay-cat');
	UR2T_content.style.marginRight = '10px';
	UR2T_content.innerHTML = 'Section';
	UR2T_container2.appendChild(UR2T_content);
	var UR2T_select = document.createElement('select');
	UR2T_select.id = 'UR2T-overlay-cat';
	UR2T_select.innerHTML = '<option value="">Alege o secțiune</option>';
	UR2T_container2.appendChild(UR2T_select);
	//	Populate the dropdown
	var UR2T_options = [];
	for(var URIndex in UR2T.answers.UR){
		UR2T_options.push(UR2T.answers.UR[URIndex].name);
	}
	UR2T_options.sort();
	//	Get the indexes
	var UR2T_options_index = [];
	for(var URDesc in UR2T_options){
		for(var URIndex in UR2T.answers.UR){
			if(UR2T_options[URDesc] == UR2T.answers.UR[URIndex].name){
				UR2T_options_index.push(URIndex);
				break;
			}
		}
	}
	for(var i=0; i<UR2T_options.length; i++){
		if(UR2T_options[i] == 'Utile')continue;
		var UR2T_option = document.createElement('option');
		UR2T_option.value = UR2T_options_index[i];
		UR2T_option.innerHTML = UR2T_options[i];
		UR2T_select.appendChild(UR2T_option);
	}
	/***	L'intitulé	***/
	UR2T_container2 = document.createElement('div');
	UR2T_container2.style.marginTop = '10px';
	UR2T_container.appendChild(UR2T_container2);
	UR2T_content = document.createElement('label');
	UR2T_content.setAttribute('for', 'UR2T-overlay-question');
	UR2T_content.style.marginRight = '10px';
	UR2T_content.innerHTML = 'Intitulé';
	UR2T_container2.appendChild(UR2T_content);
	//	la zone de texte
	var UR2T_input = document.createElement('input');
	UR2T_input.setAttribute('placeholder', '40 caractères maximum...');
	UR2T_input.setAttribute('maxlength', '40');
	UR2T_input.id = 'UR2T-overlay-question';
	UR2T_container2.appendChild(UR2T_input);
	//	L'id invisible
	UR2T_input = document.createElement('input');
	UR2T_input.id = 'UR2T-overlay-question-id';
	UR2T_input.value = '';
	UR2T_input.style.display = 'none';
	UR2T_container2.appendChild(UR2T_input);
	/***	La zone de réponse	***/
	UR2T_container2 = document.createElement('div');
	UR2T_container2.style.marginTop = '10px';
	UR2T_container.appendChild(UR2T_container2);
	UR2T_content = document.createElement('label');
	// UR2T_content.setAttribute('for', 'UR2T-overlay-response');
	UR2T_content.style.marginRight = '10px';
	UR2T_content.innerHTML = 'Le texte de réponse automatique';
	UR2T_container2.appendChild(UR2T_content);
	/***	Le contenu 4	***/
	UR2T_container2 = document.createElement('div');
	// UR2T_container2.style.marginTop = '10px';
	UR2T_container.appendChild(UR2T_container2);
	var UR2T_textarea = document.createElement('textarea');
	UR2T_textarea.id = 'UR2T-overlay-response';
	UR2T_textarea.setAttribute('placeholder', 'Inscrivez votre réponse ici.');
	UR2T_textarea.style.width = '100%';
	UR2T_textarea.style.height = '150px';
	UR2T_container2.appendChild(UR2T_textarea);
	//	events
	getId('UR2T-overlay-cat').onchange = UR2T_getURId;
	// getId('UR2T-overlay-question').onchange = UR2T_PopulateAnswers;
	getId('UR2T-overlay-response').oninput = function(){getId('UR2T-overlay-btn-cancel').innerHTML = 'Annuler';};
	//	Les boutons
	UR2T_showBtn('cancel|save');
	//	On affiche
	getId('UR2T-overlay').style.display = 'block';
}

function UR2T_EditResponses(){
	//	Enfin on affiche
	getId('UR2T-overlay').style.display = 'block';
	UR2T_ER_HTML();
}

function UR2T_CancelResponses(){
	var UR2T_overlay = getId('UR2T-overlay');
	if(UR2T_overlay.style.display == 'block'){
		switch(getId('UR2T_titre').childNodes[0].innerHTML){
			case'Éditeur de réponses automatiques':
				getId('UR2T-overlay-cat').selectedIndex = 0;
				getId('UR2T-overlay-question').selectedIndex = 0;
				getId('UR2T-overlay-question').innerHTML = '<option>Alege o întrebare</option>';
				getId('UR2T-overlay-response').value = "";
				break;
		}
		UR2T_overlay.style.display = 'none';
	}
}

function UR2T_GetUserResponses(){
	var UR2T_import = {};
	UR2T_import.script = "UR2T";
	UR2T_import.user = {};
	UR2T_import.user.id = UR2T_Waze_user.id;
	UR2T_import.user.rank = UR2T_Waze_user.rank;
	UR2T_import.user.userName = UR2T_Waze_user.userName;
	var UR2T_import_JSON = JSON.stringify(UR2T_import);
	var ret = GM_xmlhttpRequest({
		method: "POST",
		// url: "http://wmebookmarks.free.fr/manageDatas.php",
		url: "http://waze.gensig.info/WME/WME%20UR2T/manageDatas.php",
		data: 'JSONdatas=' + UR2T_import_JSON,
		headers: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
		onload: function(r){UR2T_convertResponses(r.responseText)},
		onerror: function(r){console.log("WME UR2T: Error: " + r.responseText);}
	});
}

function UR2T_convertResponses(jsonText){
	// console.info(jsonText);
	var resultat = JSON.parse(jsonText);
	// console.dir(resultat);
	//	Les UR
	for(var index in resultat.UR){
		var res = resultat.UR[index];
		// console.dir(res);
		UR2T.answers.UR[res[0]].objects[res[1]] = {};
		UR2T.answers.UR[res[0]].objects[res[1]].answer = res[2];
		UR2T.answers.UR[res[0]].objects[res[1]].question = res[3];
	}
	//	La signature
	UR2T.userSign = resultat.userSign[0];
	UpdateLS();
}

function UR2T_importExport(){
	this.IE_init = function(){
						// console.info('IE_init called');
						UR2T_fixBox('360');
						var UR2T_container = getId('UR2T-overlay-content');
						/***	Le titre	***/
						UR2T_container2 = document.createElement('div');
						UR2T_container.appendChild(UR2T_container2);
						UR2T_content = document.createElement('h2');
						UR2T_content.id = "UR2T_titre";
						UR2T_content.innerHTML = 'Import / export';
						UR2T_container2.appendChild(UR2T_content);
						/***	Les cases à cocher et le type	***/
						UR2T_container2 = document.createElement('div');
						UR2T_container2.style.marginTop = '10px';
						UR2T_container.appendChild(UR2T_container2);
						/***	La case à cocher import	et son label	***/
						UR2T_content = document.createElement('input');
						UR2T_content.setAttribute('type', 'radio');
						UR2T_content.setAttribute('name', 'UR2T_IE');
						UR2T_content.setAttribute('checked', '');
						UR2T_content.id = "UR2T_import";
						UR2T_container2.appendChild(UR2T_content);
						UR2T_content = document.createElement('label');
						UR2T_content.setAttribute('for', 'UR2T_import');
						UR2T_content.style.marginLeft = '10px';
						UR2T_content.innerHTML = 'Import';
						UR2T_container2.appendChild(UR2T_content);
						/***	La case à cocher export	et son label	***/
						UR2T_content = document.createElement('input');
						UR2T_content.style.marginLeft = '30px';
						UR2T_content.setAttribute('type', 'radio');
						UR2T_content.setAttribute('name', 'UR2T_IE');
						UR2T_content.id = "UR2T_export";
						UR2T_container2.appendChild(UR2T_content);
						UR2T_content = document.createElement('label');
						UR2T_content.setAttribute('for', 'UR2T_export');
						UR2T_content.style.marginLeft = '10px';
						UR2T_content.innerHTML = 'Export';
						UR2T_container2.appendChild(UR2T_content);
						/***	Le type	***/
						UR2T_content = document.createElement('label');
						UR2T_content.setAttribute('for', 'UR2T_type');
						UR2T_content.style.marginLeft = '50px';
						UR2T_content.innerHTML = 'Format';
						UR2T_container2.appendChild(UR2T_content);
						UR2T_content = document.createElement('select');
						UR2T_content.id = "UR2T_type";
						UR2T_content.style.marginLeft = '10px';
						UR2T_container2.appendChild(UR2T_content);
						/***	Les options		***/
						//	CSV
						UR2T_content2 = document.createElement('option');
						UR2T_content2.value = "CSV";
						UR2T_content2.innerHTML = "CSV";
						UR2T_content.appendChild(UR2T_content2);
						//	JSON
						UR2T_content2 = document.createElement('option');
						UR2T_content2.value = "JSON";
						UR2T_content2.innerHTML = "JSON";
						UR2T_content.appendChild(UR2T_content2);
						//	XML
						UR2T_content2 = document.createElement('option');
						UR2T_content2.value = "XML";
						UR2T_content2.innerHTML = "XML";
						UR2T_content.appendChild(UR2T_content2);
						/***	La zone de texte	***/
						UR2T_container2 = document.createElement('div');
						UR2T_container2.style.marginTop = '10px';
						UR2T_container.appendChild(UR2T_container2);
						UR2T_content = document.createElement('textarea');
						UR2T_content.id = "UR2T_text";
						UR2T_content.style.width = "570px";
						UR2T_content.style.height = "210px";
						UR2T_container2.appendChild(UR2T_content);
						//	Events
						getId('UR2T_import').onclick = imports;
						getId('UR2T_export').onclick = exports;
						getId('UR2T_type').onchange = checkFormat;
						getId('UR2T_text').onfocus = selectAll;
						getId('UR2T_text').onclick = selectAll;
						imports();
						show();
					}

	this.imports = function(){
						var myTextarea = getId('UR2T_text');
						var leTexte = myTextarea.value;
						var myImport = false;
						var identical = false;
						switch(getSelectedValue('UR2T_type')){
							case'JSON':
								updateLogZone('green', '', 0);
								try{
									var UR2T_import = JSON.parse(leTexte);
								}
								catch(e){
									updateLogZone('red', 'Erreur de syntaxe JSON : @char ' + (e.message.match(/column ([0-9]+)/)[1] - 1), 15000);
									return;
								}
								for(var cat in UR2T_import){
									//	Protect object
									if(typeof(UR2T.answers.UR[cat]) == 'undefined')continue;
									//	Update object
									for(var scat in UR2T_import[cat].objects){
										if(typeof(UR2T.answers.UR[cat].objects[scat]) == 'undefined'){
											UR2T.answers.UR[cat].objects[scat] = {};
											UR2T.answers.UR[cat].objects[scat].question = UR2T_import[cat].objects[scat].question;
											UR2T.answers.UR[cat].objects[scat].answer = UR2T_import[cat].objects[scat].answer;
											myImport = true;
										}
										else{
											if(UR2T.answers.UR[cat].objects[scat].question != UR2T_import[cat].objects[scat].question || UR2T.answers.UR[cat].objects[scat].answer != UR2T_import[cat].objects[scat].answer){
												UR2T.answers.UR[cat].objects[scat].question = UR2T_import[cat].objects[scat].question;
												UR2T.answers.UR[cat].objects[scat].answer = UR2T_import[cat].objects[scat].answer;
												myImport = true;
											}
											else identical = true;
										}
									}
								}
								break;
							case'CSV':
								var myCSV = new CSV();
								var CSVarray = leTexte.split('"\n');
								// console.dir(CSVarray);
								/***	Check CSV datas		***/
								if(CSVarray.length < 2){
									updateLogZone('red', 'Erreur de syntaxe CSV : @line 1', 15000);
									return;
								}
								var error = false;
								for(var line in CSVarray){
									var datas = CSVarray[line].split(',');
									if(datas.length != 4){
										error = true;
									}
									if(line == 0 && !error){
										if(myCSV.unescape(datas[0]) != 'URId'){
											error = true;
											if(myCSV.unescape(datas[1]) != 'URSId' && !error){
												error = true;
												if(myCSV.unescape(datas[2]) != 'question' && !error){
													error = true;
													if(myCSV.unescape(datas[3]) != 'réponse' && !error){
														error = true;
													}
												}
											}
										}
									}
									if(error){
										updateLogZone('red', 'Erreur de syntaxe CSV : @line ' + Number(line+1), 15000);
										return;
									}
									console.info(line);
									console.dir(datas);
									var CId = myCSV.unescape(datas[0]);
									//	Protect object
									if(typeof(UR2T.answers.UR[CId]) == 'undefined')continue;
									var sCId = myCSV.unescape(datas[1]);
									var question = myCSV.unescape(datas[2]);
									var answer = myCSV.unescape(datas[3]);
									console.log(CId + ' ' + sCId + '\n' + question + '\n' + answer);
								}
								break;
							case'XML':
								if(window.DOMParser){
									var parser=new DOMParser();
									var xmlDoc=parser.parseFromString(leTexte,"text/xml");
									// console.info(xmlDoc);
									if(typeof(xmlDoc.getElementsByTagName("parsererror")[0]) != 'undefined'){
										var error = xmlDoc.getElementsByTagName("parsererror")[0];
										textError = error.innerHTML;
										// console.info(textError);
										updateLogZone('red', 'Erreur de syntaxe XML : @line ' + textError.match(/ligne ([0-9]+)/)[1], 15000);
										return;
									}
									var base = xmlDoc.getElementsByTagName("UR2T")[0];
									for(var catIndex in base.getElementsByTagName("categorie")){
										var cat = base.getElementsByTagName("categorie")[catIndex];
										if(typeof(cat) != 'object')continue;
										var CId = cat.getElementsByTagName("id")[0].innerHTML;
										// Protect objects
										if(typeof(UR2T.answers.UR[CId]) == 'undefined')continue;
										// console.info('Catégorie : ' + UR2T.answers.UR[CId].name);
										var objects = cat.getElementsByTagName("objects")[0];
										for(var childScat in objects.getElementsByTagName("subCat")){
											var myHtml = new htmlTools();
											var scat = objects.getElementsByTagName("subCat")[childScat];
											if(typeof(scat) != 'object')continue;
											var sCId = scat.getElementsByTagName("id")[0].innerHTML;
											// console.info(CId + " " + sCId);
											var SCQuestion = myHtml.decode(scat.getElementsByTagName("question")[0].innerHTML);
											// console.info(typeof(SCQuestion));
											var SCAnswer = myHtml.decode(scat.getElementsByTagName("answer")[0].innerHTML);
											// console.info(typeof(SCAnswer));
											//	update object
											var UR2T_object = UR2T.answers.UR[CId].objects[sCId];
											// console.dir(UR2T_object);
											if(typeof(UR2T_object) == 'undefined'){
												// console.info('new element');
												UR2T_object = {};
												UR2T_object.question = SCQuestion;
												UR2T_object.answer = SCAnswer;
												// console.dir(UR2T);
												myImport = true;
											}
											else{
												// console.info('updating element');
												if(UR2T_object.question != SCQuestion || UR2T_object.answer != SCAnswer){
													UR2T_object.question = SCQuestion;
													UR2T_object.answer = SCAnswer;
													myImport = true;
													// console.info('elements are different');
												}
												else{
													identical = true;
													// console.info('elements are similar');
												}
											}
										}
									}
								}
								break;
						}
						if(myImport){
							updateLogZone('green', 'Importul a reușit', 15000);
							return true;
						}
						else{
							if(identical)updateLogZone('green', 'Données identiques', 15000);
							else updateLogZone('red', 'Données incorrecte', 15000);
							return false;
						}
					}

	function show(){
		getId('UR2T-overlay').style.display = 'block';
	}

	function clearAeraText(){
		updateLogZone('green', '', 0);
		var myTextarea = getId('UR2T_text');
		myTextarea.value = '';
	}

	function selectAll(){
		if(getId('UR2T_export').checked){
			var myTextarea = getId('UR2T_text');
			myTextarea.select();
		}
	}

	function imports(){
		clearAeraText();
		UR2T_showBtn('cancel|import');
	}

	function exports(){
		clearAeraText();
		UR2T_showBtn('cancel');
		checkFormat();
	}

	function checkFormat(){
		if(getId('UR2T_import').checked)return;
		var fill = false;
		switch(getSelectedValue('UR2T_type')){
			case'JSON':
				var UR2T_export = {};
				for(var cat in UR2T.answers.UR){
					if(cat == 'outils')continue;
					UR2T_export[cat] = UR2T.answers.UR[cat];
				}
				UR2T_export = JSON.stringify(UR2T_export);
				fill = true;
				break;
			case'CSV':
				var myCSV = new CSV();
				var UR2T_export = '"URId","URSId","întrebare","răspuns"\n';
				for(var cat in UR2T.answers.UR){
					if(cat == 'outils')continue;
					for(var scat in UR2T.answers.UR[cat].objects){
						UR2T_export += cat + ',' + scat + ',"' + myCSV.escape(UR2T.answers.UR[cat].objects[scat].question) + '","' + myCSV.escape(UR2T.answers.UR[cat].objects[scat].answer) + '"\n';
					}
				}
				UR2T_export = UR2T_export.slice(0, UR2T_export.lastIndexOf('\n'));
				fill = true;
				break;
			case'XML':
				var UR2T_export = '<?xml version="1.0" encoding="UTF-8"?>\n<UR2T>\n';
				for(var cat in UR2T.answers.UR){
					if(cat == 'outils')continue;
					UR2T_export += '<categorie>\n<id>' + cat + '</id>\n<name>' + UR2T.answers.UR[cat].name + '</name>\n<objects>\n';
					for(var scat in UR2T.answers.UR[cat].objects){
						UR2T_export += '<subCat>\n';
						UR2T_export += '<id>' + scat + '</id>\n';
						UR2T_export += '<question>' + UR2T.answers.UR[cat].objects[scat].question + '</question>\n';
						UR2T_export += '<answer>' + UR2T.answers.UR[cat].objects[scat].answer + '</answer>\n';
						UR2T_export += '</subCat>\n';
					}
					UR2T_export += '</objects>\n</categorie>\n';
				}
				UR2T_export += '</UR2T>';
				fill = true;
				break;
		}
		if(fill){
			var myTextarea = getId('UR2T_text');
			myTextarea.value = UR2T_export;
			myTextarea.focus();
		}
		selectAll();
	}

	function CSV(){
		this.escape = function(texte){
				// console.info('CSV.escape called : ' + texte);
				// texte = texte.replace(/\n/gm, "0x0D");
				texte = texte.replace(/"/gm, "0x22");
				// texte = texte.replace(/'/gm, "0x27");
				texte = texte.replace(/,/gm, "0x2C");
				// texte = texte.replace(/;/gm, "0x3B");
				return texte;
			};
		this.unescape = function(texte){
				texte = unquote(texte);
				// texte = texte.replace(/0x0D/gm, "\n");
				texte = texte.replace(/0x22/gm, "\"");
				// texte = texte.replace(/0x27/gm, "'");
				texte = texte.replace(/0x2C/gm, ",");
				// texte = texte.replace(/0x3B/gm, ";");
				return texte;
			};
		function unquote(texte){
			texte = texte.replace(/^"|"$/gm,'');
			return texte;
		};
		// console.info('CSV called');
	}

	function htmlTools(){
		this.decode = function(texte){
				texte = texte.replace(/&gt;/gm, ">");
				texte = texte.replace(/&lt;/gm, "<");
				texte = texte.replace(/&amp;/gm, "&");
				texte = texte.replace(/&nbsp;/gm, " ");
				texte = texte.replace(/&quot;/gm, "\"");
				return texte;
			}
		this.encode = function(texte){
				texte = texte.replace(/>/gi, "&gt;");
				texte = texte.replace(/</gi, "&lt;");
				texte = texte.replace(/&amp;/gi, "&");
				texte = texte.replace(/&nbsp;/gi, " ");
				texte = texte.replace(/&quot;/gi, "\"");
				return texte;
			}
	}
}

UR2T_bootstrap();

/*
1.1.6.5 - corectări diverse + url wslb.tk. suport pentru noul beta
1.1.6 - limite de viteza
1.1.5 - actualizare și adăugare răspunsuri noi
1.1.4 - actualizare răspunsuri

	Version : 1.1
	- add : ability of moving the plugin
	- add : show/hide UR and UR2T
	- fix : some bugs

	Version : 1.0.1
	- fix : UR detection bug

	Version : 1.0
	- add : panel expand/collapse (1 click instead of 3)
	- fix : fast UR change
	- fix : UR detection (new system)
	- fix : some bugs

	Version : 0.8
	- fix : fast fix for new WME update

	Version : 0.7
	- add : Vous pouvez ajouter vos propres Questions/Réponses

	Version : 0.6
	- add : A propos
	- add : Éditeur de signature

	Version : 0.5
	- Improvement : ability to edit defined answers
	- Improvement : edited answers saved on external server. If you logon at an another comp, everything will be restaured
	- Fix : bug on chrome that shown undefined elements

	Version : 0.4
	- Add : New UR that can be posted from livemap
	- Add : Special UR feature (must be improved)

	Version : 0.3
	- Add : new ur response type : POI request
	- BugFix : UR change without clicking the close button

	Version : 0.2
	- Improvement: "bonjour" auto change according to localtime and hour of the day : bonjour < 18h <= bonsoir <= 3h < bonjour
	- Update : "Zone de danger" deviens "Zone de contrôle"

	Version : 0.1
	- First release
*/