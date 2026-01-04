// ==UserScript==
// @name         Always dark mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  always dark, removes background and header ad
// @author       Bum
// @match        https://www.instant-gaming.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/398982/Always%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/398982/Always%20dark%20mode.meta.js
// ==/UserScript==
function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyle") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    console.log(css);
    }
GM_addStyle ( `
#backgroundLink{
pointer-events:none;
}
` );
GM_addStyle ( `
#home-top-banner-wrapper{
display:none;
}
` );

GM_addStyle ( `
#backgroundLink{
    background : #444 !important;
}
` );
(function() {
    'use strict';

var body = document.body;

body.classList.add("darkmode");
})();