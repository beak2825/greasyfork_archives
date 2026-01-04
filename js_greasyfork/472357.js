// ==UserScript==
// @name         Google Meet Infinity Mirror
// @version      1.0
// @namespace    https://github.com/hackalope
// @description  Hides your own view of what you're sharing in Google Meet to prevent the infinity mirror.
// @author       hackalope
// @match        https://meet.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472357/Google%20Meet%20Infinity%20Mirror.user.js
// @updateURL https://update.greasyfork.org/scripts/472357/Google%20Meet%20Infinity%20Mirror.meta.js
// ==/UserScript==

var beVerbose = false;
var refreshShareViewDelay = 2000;

var toggleIconVisable = '👀';
var toggleIconHidden = '🙈';

var shareBoxSelector = 'div.dkjMxf';
var shareBoxIsVisible = true;

function refreshShareView() {
    var shareDisplay = 'none';
    var toggleIcon = toggleIconHidden;
    if(shareBoxIsVisible) {
        shareDisplay = '';
        toggleIcon = toggleIconVisable;
    }

    document.querySelector(shareBoxSelector).style.display = shareDisplay;
    document.querySelector('#shareToggle').innerHTML = toggleIcon;
}

function toggleShareView() {
    shareBoxIsVisible = ! shareBoxIsVisible;
    if(beVerbose) console.log("### Google Meet Infinity Mirror: Setting visibility to " + shareBoxIsVisible + ".");

    refreshShareView();
}

(function() {
    'use strict';

    window.addEventListener('load', function() {
        if(beVerbose) console.log('### Google Meet Infinity Mirror: Initializing...');

        var shareToggle = document.createElement('button');
        shareToggle.id = 'shareToggle'
        shareToggle.addEventListener('click', toggleShareView);
        shareToggle.title = 'Show/Hide Self-view';
        shareToggle.style.position = 'relative';
        shareToggle.style.top = '0px';
        shareToggle.style.left = '0px';
        shareToggle.style.margin = '1px';
        shareToggle.style.zIndex = '10';
        shareToggle.style.cursor = 'pointer';
        shareToggle.style.backgroundColor = 'transparent';
        shareToggle.style.border = 'none';
        shareToggle.innerHTML = toggleIconVisable;
        document.body.appendChild(shareToggle);

        if(beVerbose) console.log('### Google Meet Infinity Mirror: Button was added.');
        if(beVerbose) console.log(shareToggle);
    }, false);

    setInterval(refreshShareView, refreshShareViewDelay);
})();