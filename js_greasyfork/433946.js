// ==UserScript==
// @name         Mangadex Updates Compact
// @namespace    www.google.com
// @version      1.4
// @description  Reduce bloated image sizes on Mangadex's Updates page.
// @author       LookAtYrOwnName
// @match        *mangadex.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433946/Mangadex%20Updates%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/433946/Mangadex%20Updates%20Compact.meta.js
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

addGlobalStyle('.chapter-grid{padding-top:0rem !important; }');
addGlobalStyle('.chapter-grid.flex-grow{height:24px !important; }');
addGlobalStyle('.chapter-feed__container{grid-template-columns:37px !important; }');
addGlobalStyle('.chapter-feed__container{padding:0rem !important; }');
addGlobalStyle('.chapter-feed__title{grid-area:title;border-bottom:1px solid hsla(0,0%,50.2%,0) !important; }');
addGlobalStyle('.chapter-feed__cover{border-radius:0rem !important; }');
addGlobalStyle('.mx-1.inline-block {width:0px !important; }');
addGlobalStyle('.rounded{border-radius:0rem !important; }');
addGlobalStyle('.mb-4{margin-bottom:0.25rem !important; }');