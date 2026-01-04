// ==UserScript==
// @name         interview-hack
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  显示interview2.poetries隐藏内容
// @author       icecred
// @include    *://*.poetries.top/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444139/interview-hack.user.js
// @updateURL https://update.greasyfork.org/scripts/444139/interview-hack.meta.js
// ==/UserScript==

!function(n){if(!n.getElementById("interview2-hack")){var e=n.createElement("style");e.id="interview2-hack",e.innerHTML="\n    .theme-default-content.lock .content__default>:nth-child(32){\n        opacity:1\n    }\n    .readMore-wrapper{\n        display:none\n    }\n\n    .theme-default-content.lock .content__default>:nth-child(n+33){\n        display:block\n    }\n\n #container{\n overflow:auto !important \n} .readMore-wrapper,#read-more-wrap{\n display:none \n} \n.theme-default-content.lock .content__default>:nth-child(30) {\n opacity:1 \n}",n.head.appendChild(e)}}(document);