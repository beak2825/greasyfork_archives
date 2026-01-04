// ==UserScript==
// @name         שבור עמוד
// @namespace    http://pa0neix.github.io/
// @version      1.0
// @description  lo
// @author       pnx <pa0neix@gmail.com>
// @match        https://www.fxp.co.il/showthread.php?t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33956/%D7%A9%D7%91%D7%95%D7%A8%20%D7%A2%D7%9E%D7%95%D7%93.user.js
// @updateURL https://update.greasyfork.org/scripts/33956/%D7%A9%D7%91%D7%95%D7%A8%20%D7%A2%D7%9E%D7%95%D7%93.meta.js
// ==/UserScript==

var btn = document.createElement('button');
btn.id = 'qr_sb0r';
btn.className = 'button';
btn.style.marginLeft = '3px';
btn.innerText = 'שבור';
btn.onclick = 'seTy();';
document.querySelector('#qr_submit').parentNode.insertBefore(btn, document.querySelector('#qr_submit'));

function seTy() {
	if(!document.querySelector('#cke_contents_vB_Editor_QR_editor>textarea')) {
		CKEDITOR.tools.callFunction(5);
		return seTy();
    }
	document.querySelector('#cke_contents_vB_Editor_QR_editor>textarea').value = '[LIST][QUOTE][*][/QUOTE][/LIST]‎‎';
	document.querySelector('#qr_submit').click();
}