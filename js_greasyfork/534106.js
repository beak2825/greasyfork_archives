// ==UserScript==
// @name         Block imgur home page
// @namespace    https://tampermonkey.net
// @version      2025-04-26
// @description  Block the main page of imgur from being displayed!
// @author       Lacy
// @match        https://imgur.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534106/Block%20imgur%20home%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/534106/Block%20imgur%20home%20page.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.HomeHeader {display: none !important; visibility: hidden !important;}');
addGlobalStyle(' .MainContainer {display: none !important; visibility: hidden !important;}');