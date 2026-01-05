// ==UserScript==
// @name        Maps UfaNet ru Uppod HTML5
// @description Добавляет Uppod HTML5 видеоплеер.
// @namespace   2k1dmg@userscript
// @license     GPL version 3 or any later version; http://www.gnu.org/licenses/gpl.html
// @version     0.1.1
// @grant       none
// @author      2k1dmg
// @noframes
// @run-at      document-start
// @require     https://greasyfork.org/scripts/9319-uppod-html5/code/uppod_html5.js?version=140068
// @match       *://maps.ufanet.ru/*
// @downloadURL https://update.greasyfork.org/scripts/22028/Maps%20UfaNet%20ru%20Uppod%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/22028/Maps%20UfaNet%20ru%20Uppod%20HTML5.meta.js
// ==/UserScript==

(function() {
'use strict';

var VIDEO_PLAYER_ID = 'mu-uppod-html5-player';

function addStyleSheet() {
	/*var height = (function() {
		try {
			return document.querySelector('.uppod-control_control_bar').querySelector('canvas').clientHeight;
		}
		catch(ex) {
			return 35;
		}
	})();*/
	var cssStyle = document.createElement('style');
	cssStyle.type = 'text/css';
	cssStyle.textContent = [
		'#ModalBodyPlayer, .nav-pills > li[data-format="jpg"] {',
		'	display: none;',
		/*'}',
		'#'+VIDEO_PLAYER_ID+'.uppod-html5-playing .uppod-control_control_bar {',
		'	margin-top: '+height+'px;',
		'	transition: margin 350ms ease-in 350ms;',
		'}',
		'#'+VIDEO_PLAYER_ID+'.uppod-html5-playing:hover .uppod-control_control_bar {',
		'	margin-top: 0px;',
		'	transition: margin 150ms ease-in;',*/
		'}'
	].join('\n');
	document.head.appendChild(cssStyle);
}

function stopFlash(i) {
	i = i || 5;
    var interval = setInterval(function() {
		if(typeof swfobject !== 'undefined' && document.querySelector('#ModalBodyPlayerFrame')) {
            setTimeout(function() {
				swfobject.removeSWF('ModalBodyPlayerFrame');
				clearInterval(interval);
			}, 1000);
        }
        i-- || clearInterval(interval);
    }, 250);
}

var uppodPlayer;

function addPlayer() {
	var file = 'http://' + window.cache.camera.server + '/' + window.cache.camera.number + '/index.m3u8?token=' + window.cache.camera.token;

	//stopFlash(20);

	if(uppodPlayer) {
		uppodPlayer.Play(file);
		return;
	}

	var player = document.createElement('div');
	player.id = VIDEO_PLAYER_ID;
	player.classList.add('player');

	var modalBody = document.querySelector('#ModalBody');
	modalBody.appendChild(player);

	if(typeof Uppod === 'undefined')
		return;

	setTimeout(function() {
		uppodPlayer = new Uppod({
			m:'video',
			uid:VIDEO_PLAYER_ID,
			cntrlhide:true,
			tip:true,
			//controls:'play,time_play,volume,volbarline',
			onReady: function(uppod) {
				uppod.Play(file);
			}
		});
	},0);

	/*player.addEventListener('play', function() {
		this.classList.add('uppod-html5-playing');
	});
	player.addEventListener('pause', function() {
		this.classList.remove('uppod-html5-playing');
	});*/
}

function onAttrChang(mutation) {
	if(mutation.attributeName == 'style') {
		var styleStr = mutation.target.getAttribute('style');
		var styleList = styleStr.split(';');

		for(var i=0; i<styleList.length; i++) {
			var style = styleList[i].split(':');
			if(style[0] && style[0].trim() == 'display') {
				if(style[1] && style[1].trim() == 'block') {
					addPlayer();
				}
				else {
					if(uppodPlayer)
						uppodPlayer.Stop();
				}
			}
		}
	}
}

function addObserver(target, config, callback) {
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			callback.call(this, mutation);
		});
	});
	observer.observe(target, config);
	return observer;
}

function removeObserver(observer) {
	observer.disconnect();
}

function observeModal() {
	var target = document.querySelector('#Modal');
	var config = { attributes: true };
	var observer = addObserver(target, config, onAttrChang);
	window.addEventListener('unload', function(event) {
		removeObserver(observer);
	}, false);
}

function canPlayMedia(type) {
	try {
		var v = document.createElement('video');
		return v.canPlayType(type) !== '';
	}
	catch(ex) {
		return false;
	}
}

document.addEventListener('DOMContentLoaded', function() {
	if(!canPlayMedia('video/mp4'))
		return;
	addStyleSheet();
	observeModal();
}, false);

})();
