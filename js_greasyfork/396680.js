// ==UserScript==
// @name        warmane.com decancer
// @namespace   Violentmonkey Scripts
// @match       https://www.warmane.com/*
// @match       http://armory.warmane.com/*
// @match       http://forum.warmane.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 19/02/2020, 10:16:26
// @downloadURL https://update.greasyfork.org/scripts/396680/warmanecom%20decancer.user.js
// @updateURL https://update.greasyfork.org/scripts/396680/warmanecom%20decancer.meta.js
// ==/UserScript==

function removeElement(elementId) {
// Removes an element from the document.
var element = document. getElementById(elementId);
element. parentNode. removeChild(element);}
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//base and armory
removeElement("page-frame");
addGlobalStyle('#page-content-wrapper { top: 70px !important; }');
addGlobalStyle('#page-content-wrapper { z-index: 1 !important; }');

addGlobalStyle('.navigation-wrapper .navigation { top: 6px !important; }');
addGlobalStyle('.navigation-wrapper .navigation-logo { top: -20px !important; transform: scaleY(0.7);}');

//forum
addGlobalStyle('.above_body { top: 0px !important; z-index: 1 !important;}');
