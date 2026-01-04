// ==UserScript==
// @name         EasySigaa
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Trying to make our lives easier.
// @author       Archangel777
// @match        https://si3.ufc.br/sigaa/verTelaLogin.do*
// @match        https://si3.ufc.br/sigaa/logar.do?dispatch=logOn*
// @match        https://si3.ufc.br/sigaa/logar.do?dispatch=logOff*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/36644/EasySigaa.user.js
// @updateURL https://update.greasyfork.org/scripts/36644/EasySigaa.meta.js
// ==/UserScript==

window.alert = () => false;
Window.prototype.alert = () => false;

window.addEventListener('load', enableInputs, false);

function enableInputs() {
    for (let input of document.getElementsByTagName('input'))
        input.disabled = false;
    console.log('Enabling...');
}