// ==UserScript==
// @name         Facebook new theme font fix
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Facebook new theme font fix (Tested)
// @author       Le Hoang
// @match        https://*.facebook.com/*
// @downloadURL https://update.greasyfork.org/scripts/411832/Facebook%20new%20theme%20font%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/411832/Facebook%20new%20theme%20font%20fix.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var body, style;
    body = document.getElementsByTagName('body')[0];
    if (!body) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    body.appendChild(style);
}

addGlobalStyle(
    `* {font-family: "Segoe UI", Arial, sans-serif !important;
    }
    .rrkovp55 { font-family: "Segoe UI", Arial, sans-serif !important; 
    }
`);