// ==UserScript==
// @name localav
// @namespace https://github.com/doomred
// @description Lightweight avfun video dumper
// @version 0.22
// @encoding utf-8
// @license GPLv3
// @copyleft dye `Eric' jarhoo
// @author dye `Eric' jarhoo
// @homepageURL htpp://saltyremix.com
// @icon https://raw.github.com/doomred/localav/master/localav_icon.png
// @include http://*.acfun.*/v/ac*
// @run-at document-end
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// @grant GM_openInTab
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/4926/localav.user.js
// @updateURL https://update.greasyfork.org/scripts/4926/localav.meta.js
// ==/UserScript==

/***********
 * Many thanks for the followings, without you the mates,
 * `localav' would not make sense.
 *   zjworks for debuging & testing
 *   持续飞翔的胖子 & acfun_tv & 冷色猫咪 for suggestion alternative solution
 *
\*********************************************************/



function forceupdate() {
	'use strict'; 
	GM_openInTab('https://raw.github.com/doomred/localav/master/localav.user.js');
	return 0;
}

var lvDebug, lvLeft, lvBt, lvEasterEgg;
lvDebug = 0;	// debug usage, value: 0/1/2
lvLeft = GM_getValue('gm_lv_left', '1em');
lvBt = GM_getValue('gm_lv_bt', '1em');
lvEasterEgg = 0;
GM_registerMenuCommand('localav| Force Update!', forceupdate, 'a');

var lvDiv, lvCloseDiv, lvContDiv;
/* init lv-box */
lvDiv = document.createElement('div');
lvDiv.style.border = '2px solid';
lvDiv.style.left = lvLeft;
lvDiv.style.bottom = lvBt;
lvDiv.style.display = 'none';  //init
lvDiv.style.lineHeight = '1em';  //fix inherit
lvDiv.style.zIndex = '9999';
lvDiv.style.position = 'fixed';
lvDiv.style.textAlign = 'right';
lvDiv.style.backgroundColor = '#ffe';  //may use BG-image
lvDiv.id = 'lv-box';
lvDiv.setAttribute('draggable', 'true');
window.document.body.appendChild(lvDiv);

lvCloseDiv = document.createElement('span');
lvCloseDiv.id = 'lv-topbar';
lvCloseDiv.innerHTML = '[X]';
lvCloseDiv.style.cursor = 'pointer';
lvCloseDiv.style.fontSize = '16pt';
lvCloseDiv.style.color = 'white';
lvCloseDiv.style.background = '#810400';
lvCloseDiv.onclick = function() {
	lvDiv.style.display = 'none';
};
lvDiv.appendChild(lvCloseDiv);

lvContDiv = document.createElement('div');
lvContDiv.id = 'lv-contbox';
lvDiv.appendChild(lvContDiv);

var lvTarget, anchorBtn, i, lvName;
anchorBtn = document.getElementsByTagName('a');
lvTarget = [];
window.lvName = [];
for(i = anchorBtn.length; i--;) {
if(anchorBtn[i].getAttribute('title')) {

	if(anchorBtn[i].getAttribute('title').search('Part') !== -1) {  // dirty hack, may fail
		lvTarget.push(anchorBtn[i].getAttribute('data-vid'));
		window.lvName.push(anchorBtn[i].innerHTML);
	}
}
}


for(i = lvTarget.length; i--;) {
	playerDLURL = "https://ssl.acfun.tv//aliyun/index.php?&type=mobileclient&vid=" + lvTarget[i];
				// key core of localav, another API: jiexi.avfun.info/index.php?vid=xxx
	if(lvDebug) {window.alert(playerDLURL);}

	function dynaparts(obj, id) {
		var key, lvContBox, lvContSize, lvContName, temp, i, lvContURL, contDiv, lvContQuality, lvContType, lvTowerBuilder;
		contDiv = window.top.document.getElementById('lv-contbox');
		lvContName = document.createElement('div');
		lvContName.style.margin = '1em 0 0 0';
		lvContName.style.textAlign = 'center';
		lvContName.innerHTML = window.lvName[id];
		contDiv.appendChild(lvContName);
		for(key in obj) {
			if(obj.hasOwnProperty(key)) {
				lvContBox = document.createElement('div');
				lvContBox.classList.add('lv-content');
				lvContBox.style.margin = '0 1.5em 0 1.5em';
				lvContBox.style.cursor = 'pointer';
				lvContBox.style.cssFloat = 'left';
				lvContQuality = obj[key].quality;
				lvContType = obj[key].files[0].type;
				temp = 0;
				lvContURL = '';
				for(i = 0; i < obj[key].files.length; i++) {
					lvContURL += obj[key].files[i].url;
					lvContURL += '^';			// split urls
					temp += obj[key].files[i].bytes;	// add up bytes
				}
				lvContBox.setAttribute('data-lv', lvContURL);
				if(lvDebug) {window.alert(lvContURL);}
				temp = temp / 1024 / 1024 * 100;  // leave two float point
				lvContSize = parseInt(temp, 10) / 100 + 'MB';
				if(lvContURL.search('.hlv?') !== -1) {  // sina hlv fix
					lvContType = 'hlv';
				}
				if(!parseInt(lvContSize, 10)) {lvContSize = '大小仍是个迷';}
				lvContBox.innerHTML = lvContQuality + ' [' + lvContType + ']<br />' + lvContSize;
				
				lvContBox.addEventListener('click', function (e) {  // download with purejs, midified via SO
					var iframe, eventSender, cSrc, arraySrc, i;
					if (!e && window.event) {e = window.event;}
					eventSender = (window.event) ? e.srcElement : e.target;
					cSrc = eventSender.getAttribute('data-lv');
					if(lvDebug > 1) {window.alert(lvContURL);}
					arraySrc = cSrc.split('^');
					if(cSrc.search('.hlv?') !== -1) {  // sina hlv fix
						for(i = 0; i < arraySrc.length - 1; i++) {  //dirty hack, trim tailling one
							if(lvDebug > 1) {alert(arraySrc[i]);}
							GM_openInTab(arraySrc[i]);
						}
					temp = null;
					} else {
						for(i = 0; i < arraySrc.length - 1; i++) {
							iframe = document.createElement('iframe');
							iframe.style.display = 'none';
							iframe.style.position = 'absoulte';
							iframe.style.top = '0px';
							iframe.style.left = '0px';
							iframe.src = arraySrc[i];
							document.body.appendChild(iframe);
						}
					}
				}, false);
				if(lvContURL.search('&id=tudou') !== -1 || 0) {  // add broken parsed urls here, blame API
					lvContBox.style.backgroundColor = 'grey';
					lvContBox.innerHTML += "<br />可能失效";
				}
				contDiv.appendChild(lvContBox);
				lvContBox.id = 'lv_' + id;
				/* fix sina duplicate generated API*/
				if(lvContURL.search('v.iask.com') !== -1) {
					break;
				}
			}
		}
		lvTowerBuilder = document.createElement('hr');
		lvTowerBuilder.style.clear = 'both';
		contDiv.appendChild(lvTowerBuilder);
	}
	GM_xmlhttpRequest({
		method: "GET",
		url: playerDLURL,
		headers: {
			"Accept": "application/json"
		},
		onload: function(response) {
			var foo = JSON.parse(response.responseText)
			var bar = response.finalUrl.search('mobileclient&vid=');
			var index = lvTarget.indexOf(response.finalUrl.substr(bar + 17));
			dynaparts(foo.result, index);

		}
	});
}

if(lvTarget.length > 4 ) {  //side style trigger
	var lvSidemode;
	window.lvSidemode = 1;
}

function feedbugback() {  //make a dirty joke here
	lvCloseDiv.style.height = '100px';
	lvFB = document.createElement('div');
	lvFB.innerHTML = '[feedback]';
	lvFB.style.height = '50px';
	lvFB.style.width = '300%';
	lvFB.style.borderRadius = '100px';
	lvFB.style.backgroundColor = 'brown';
	lvFB.style.cursor = 'pointer';
	lvFB.style.textAlign = 'right';
	lvFB.style.width = '100%';
	lvFB.style.textDecoration = 'underline';
	lvFB.onclick = function() {
		window.open('https://github.com/doomred/localav/issues', 'FEED_ME_BUG');
	};
	lvDiv.appendChild(lvFB);
}

	/* HTML5 drag & drop element
	 * Modified via	http://jsfiddle.net/robertc/kKuqH/
	 * More info	https://stackoverflow.com/questions/6230834/html5-drag-and-drop-anywhere-on-the-screen */
	function drag_start(event) {
    	var style = window.getComputedStyle(event.target, null);
    	event.dataTransfer.setData("text/plain",
    	parseInt(style.getPropertyValue("left"),10) + ',' + parseInt(event.clientX) + ',' +
		parseInt(style.getPropertyValue("bottom"),10) + ',' + parseInt(event.clientY));
	} 
	function drag_over(event) { 
    	event.preventDefault(); 
    	return false;
	} 
	function drop(event) { 
	    var offset = event.dataTransfer.getData("text/plain").split(',');
    	var dg = document.getElementById('lv-box');
		var dgRel = document.getElementById('lv-topbar');
    	dg.style.left = (event.clientX + parseInt(offset[0],10) - parseInt(offset[1],10)) + 'px';
    	dg.style.bottom = (-event.clientY + parseInt(offset[2],10) + parseInt(offset[3],10)) + 'px';
		if(window.lvSidemode) {
    		dgRel.style.left = (event.clientX + parseInt(offset[0],10) - parseInt(offset[1],10)) + 'px';
    		dgRel.style.top = (event.clientY + parseInt(dgRel.style.top,10) - parseInt(offset[3],10)) + 'px';
		} else {
			GM_setValue('gm_lv_left', dg.style.left);
			GM_setValue('gm_lv_bt', dg.style.bottom);
		}
		
    	event.preventDefault();
    	return false;
	} 
if(document.getElementById('lv_' + (lvTarget.length - 1))) {

}

function checkload() {
//	'use strict';
	if(document.getElementById('lv_' + (lvTarget.length - 1))) {  //sidebar mode on, rewrite lvCloseDiv style
		document.getElementById('lv-box').style.display = 'block';
		document.getElementById('lv-box').addEventListener('dragstart',drag_start,false); 
		document.body.addEventListener('dragover',drag_over,false); 
		document.body.addEventListener('drop',drop,false); 
		
		if(window.lvSidemode) {
			lvCloseDiv = window.top.document.getElementById('lv-topbar');
			lvDiv = window.top.document.getElementById('lv-box');
			lvDiv.style.position = 'fixed';
			lvDiv.style.left = lvDiv.style.bottom = 0;
			lvDiv.style.height = '100%';
			lvDiv.style.overflowY = 'scroll';
			lvCloseDiv.style.position = 'fixed';
			lvCloseDiv.style.left = lvCloseDiv.style.top = 0;
		}
		if(lvEasterEgg) {feedbugback()}
	} else {
		window.setTimeout(checkload, 500);  //api load
	}
}
window.setTimeout(checkload, 500);
