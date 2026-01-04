// ==UserScript==
// @name         Bypass Paywall RespondeAi
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  automatically removes the RespondeAi paywall, displaying the entire contents of the book.
// @author       Hugobsan
// @license      GNU GPL v3.0. http://www.gnu.org/copyleft/gpl.html
// @match        https://www.respondeai.com.br/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441163/Bypass%20Paywall%20RespondeAi.user.js
// @updateURL https://update.greasyfork.org/scripts/441163/Bypass%20Paywall%20RespondeAi.meta.js
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

addGlobalStyle('section { filter: blur(0px) !important; }');