// ==UserScript==
// @name         Dark JVC Fix
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Fix Dark JVC
// @author       Dwnlt
// @include      https://www.jeuxvideo.com/*
// @include      https://www.jeuxvideo.com/recherche/forums/0-*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/412266/Dark%20JVC%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/412266/Dark%20JVC%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let fixCss =
    `

body{

}

.layout--withBackground{
    background-image:none !important;
    background-color:#202020 !important;
}

.layout__content{
    background-color:#1C1C1C !important;
}

.layout__breadcrumb{
  background-color:#1C1C1C !important;
}

.topic-list .dfp__atf ~ li:nth-of-type(even) {
    background: #2E2E2E !important;
}
.topic-list .dfp__atf ~ li:nth-of-type(odd) {
    background: #2A2A2A !important;
}

.topic-list li.topic-delete-gta{
    background: #2E2E2E !important;
}

.topic-list .dfp__atf ~ li:nth-of-type(even):hover, .topic-list .dfp__atf ~ li:nth-of-type(odd):hover {
    background: #202020 !important;
}

.jv-top-nav-link{
background: #000 !important;
border-bottom: .0625rem solid #505050 !important;

}

.jv-top-nav-lvl1 > .jv-top-nav-item .nav-link{
color: #bdbdbd !important;
}

.layout--withBackground .layout__breadcrumb, .layout--withBackground .layout__content, .layout--withBackground .layout__contentAfter, .layout--withBackground .layout__contentAside, .layout--withBackground .layout__contentBefore, .layout--withBackground .layout__contentHeader, .layout--withBackground .layout__contentMain, .layout--withBackground .layout__contentMainMedia, .layout--withBackground .layout__contentMainMedia--anchor, .layout--withBackground .layout__contentMainMediaHeader, .layout--withBackground .layout__contentTop, .layout--withBackground .layout__contextBottom {
background-color: #1c1c1c !important;
}


    `
    function injectCss(){
        let head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = fixCss;
        head.appendChild(style);
    }
    injectCss();
})();