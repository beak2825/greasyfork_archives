// ==UserScript==
// @name        rpgx_keyboard
// @description Keyboard assist for Taimanin RPGX
// @description:ja 対魔忍RPGXにキーボードでページ送り又はスキップする
// @namespace   http://pc-play.games.dmm.co.jp/play/taimanin_rpgx/
// @include     http://taimanin-rpg.com/game/empty*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/372690/rpgx_keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/372690/rpgx_keyboard.meta.js
// ==/UserScript==
var mouse_down = new window.MouseEvent('mousedown', {view:unsafeWindow,bubbles:true,cancelable:true});
var mouse_up = new window.MouseEvent('mouseup', {view:unsafeWindow,bubbles:true,cancelable:true});
var timeoutId, direction;

function delayLoad()
{
	if (document.getElementById('#canvas')) {
		register();
	} else {
		timeoutId = setTimeout(delayLoad, 1000);
	}
}

function register()
{
	document.addEventListener('keydown', function(event) {
		if (event.keyCode == 17 || event.keyCode == 13) {
	        var canvas = document.getElementById('#canvas');
	        if (canvas) {
				if (event.keyCode == 17) {
					canvas.dispatchEvent(direction? mouse_up : mouse_down);
					direction = !direction;
				} else {
					canvas.dispatchEvent(mouse_down);
				}
				event.preventDefault();
	        }
		}
	});
	document.addEventListener('keyup', function(event) {
		if (event.keyCode == 17 || event.keyCode == 13) {
			var canvas = document.getElementById('#canvas');
			if (canvas) {
				direction = false;
				canvas.dispatchEvent(mouse_up);
				event.preventDefault();
			}
		}
	});
	console.log('rpgx_keyboard loaded.');
}

delayLoad();