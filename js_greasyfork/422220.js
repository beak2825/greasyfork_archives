// ==UserScript==
// @name         ピクトセンスカラーパレット拡張星型
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  -
// @author       You
// @match        https://pictsense.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422220/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%91%E3%83%AC%E3%83%83%E3%83%88%E6%8B%A1%E5%BC%B5%E6%98%9F%E5%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422220/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%91%E3%83%AC%E3%83%83%E3%83%88%E6%8B%A1%E5%BC%B5%E6%98%9F%E5%9E%8B.meta.js
// ==/UserScript==

(function() {
    document.getElementById('colorPalette').innerHTML =
    '<button type="button" class="color" data-color="000000" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="7f7f7f" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="cccccc" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffffff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff0000" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff6b6b" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="f54f86" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="aa00ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="0000ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="214691" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00b4ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="a2defc" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="3c6e71" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="026550" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="01ffd6" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="abff02" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffff00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffffa0" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff7f00" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="bf574f" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="fed1ad" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="f6b070" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffefe1" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffcfc0" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ffa799" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ec988f" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="d0746c" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="683b33" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="91423c" style="background-color: #FF0; height: 8px;"></button>';
    'use strict';
    document.getElementById('undoButton').style.position = 'inherit';
    // Your code here...
})();