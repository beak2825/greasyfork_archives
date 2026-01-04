// ==UserScript==
// @name         カラーパレット拡張(ピクトセンス)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  chromiumベースパレット拡張(https://pictsense.xxxxxxxx.jp)のtampermonkey版だよ これならfirefoxとかedgeでも使えるね！！
// @author       You
// @match        https://pictsense.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409830/%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%91%E3%83%AC%E3%83%83%E3%83%88%E6%8B%A1%E5%BC%B5%28%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/409830/%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%91%E3%83%AC%E3%83%83%E3%83%88%E6%8B%A1%E5%BC%B5%28%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%29.meta.js
// ==/UserScript==

(function() {
    document.getElementById('colorPalette').innerHTML =
    '<button type="button" class="color" data-color="000000" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="808080" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="d3d3d3" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffffff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff0000" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff0055" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff00aa" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff00ff" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="d500ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="aa00ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="5500ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="0000ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="002bff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="0055ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00aaff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00d5ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00ffd5" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00ff80" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00ff2b" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="71ff0e" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="aaff00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="d5ff00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffff00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffdd00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff7f00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff2b00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="4d2000" style="background-color: #FF0; height: 8px;"></button>';
    'use strict';
    document.getElementById('undoButton').style.position = 'inherit';
    // Your code here...
})();