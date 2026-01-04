// ==UserScript==
// @name         GrimTool Map Full Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button on map toolbar to expand the map to full page.
// @author       Anthony Jiang
// @match        https://www.grimtools.com/map/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grimtools.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440997/GrimTool%20Map%20Full%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/440997/GrimTool%20Map%20Full%20Page.meta.js
// ==/UserScript==

function setFullPage() {
    document.getElementsByClassName('nav-menu-container')[0].setAttribute('style','visibility:hidden');
    document.getElementsByClassName('main-container web')[0].setAttribute('style','margin: 0; top: 0;');
}

function revert() {
    document.getElementsByClassName('nav-menu-container')[0].setAttribute('style','');
    document.getElementsByClassName('main-container web')[0].setAttribute('style','');
}

function setPage() {
    var btn = document.getElementById('btn-fullpage');
    if (btn.getAttribute('title') == 'Set Full Page')
    {
        setFullPage();
        btn.setAttribute('title', 'Revert');
        useRevertSVG();
    }
    else
    {
        revert();
        btn.setAttribute('title', 'Set Full Page');
        useSetFullSVG();
    }
}

function addButton() {
    var button_text = '<a id="btn-fullpage" class="btn fullpage" title="Set Full Page">';
    var nav_bar = document.getElementsByClassName('buttons nav')[0].innerHTML += button_text;
    document.getElementById('btn-fullpage').addEventListener('click', setPage);
    useSetFullSVG();
}

function useSetFullSVG() {
    var btn = document.getElementById('btn-fullpage');
    btn.innerHTML = '<svg height="100%" version="1.1" viewBox="5 5 28 28" width="100%" style="fill: #8c8c82;"><g class="ytp-fullscreen-button-corner-0"><use class="ytp-svg-shadow" xlink:href="#ytp-id-6"></use><path class="ytp-svg-fill" d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" id="ytp-id-6"></path></g><g class="ytp-fullscreen-button-corner-1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-7"></use><path class="ytp-svg-fill" d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" id="ytp-id-7"></path></g><g class="ytp-fullscreen-button-corner-2"><use class="ytp-svg-shadow" xlink:href="#ytp-id-8"></use><path class="ytp-svg-fill" d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z" id="ytp-id-8"></path></g><g class="ytp-fullscreen-button-corner-3"><use class="ytp-svg-shadow" xlink:href="#ytp-id-9"></use><path class="ytp-svg-fill" d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" id="ytp-id-9"></path></g></svg></a>';
}

function useRevertSVG() {
    var btn = document.getElementById('btn-fullpage');
    btn.innerHTML = '<svg height="100%" version="1.1" viewBox="5 5 28 28" width="100%" style="fill: #8c8c82;"><g class="ytp-fullscreen-button-corner-2"><use class="ytp-svg-shadow" xlink:href="#ytp-id-50"></use><path class="ytp-svg-fill" d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z" id="ytp-id-50"></path></g><g class="ytp-fullscreen-button-corner-3"><use class="ytp-svg-shadow" xlink:href="#ytp-id-51"></use><path class="ytp-svg-fill" d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z" id="ytp-id-51"></path></g><g class="ytp-fullscreen-button-corner-0"><use class="ytp-svg-shadow" xlink:href="#ytp-id-52"></use><path class="ytp-svg-fill" d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z" id="ytp-id-52"></path></g><g class="ytp-fullscreen-button-corner-1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-53"></use><path class="ytp-svg-fill" d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z" id="ytp-id-53"></path></g></svg>';
}

(function() {
    'use strict';
    addButton();
    // Your code here...
})();