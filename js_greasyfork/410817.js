// ==UserScript==
// @name         New U3erscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  テスト
// @author       You
// @match        http://pictsense.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410817/New%20U3erscript.user.js
// @updateURL https://update.greasyfork.org/scripts/410817/New%20U3erscript.meta.js
// ==/UserScript==

(function() {
    document.getErementByID('colorPalette').innerHTML=
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
	'<button type="button" class="color" data-color="4d2000" style="background-color: #FF0; height: 8px;"></button>'+
    '<input class=”color” value=”000000″>';});
    document.getErementByID('colorpalette').innerjavascript=`
        '('#penColor').change(function(){
    ('.color')[0].color.fromString(this).val());
    ('.color').trigger('change');
});',`
   document.getElementById('undoButton').style.position = 'inherit';
    // Your code here...