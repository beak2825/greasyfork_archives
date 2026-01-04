// ==UserScript==
// @name         QuoraBypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates bypassing the Quora login and sign up pop-up
// @author       basuracan1@gmail.com
// @match        https://www.quora.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quora.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/466287/QuoraBypass.user.js
// @updateURL https://update.greasyfork.org/scripts/466287/QuoraBypass.meta.js
// ==/UserScript==








var elements = document.getElementsByClassName("q-box qu-p--large qu-pt--huge qu-bg--gray_ultralight qu-borderRadius--medium qu-boxShadow--small");
if (elements.length > 0) {
    window.location.href += '?share=1'
}

