// ==UserScript==
// @name         Google Meet Small Self-View
// @namespace    github.com/msmeeks/google-meet-small-self-view
// @version      0.2
// @description  Automatically shrink the self-view thumbnail in google.meet and move it to the top left corner
// @author       msmeeks
// @match        https://meet.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430437/Google%20Meet%20Small%20Self-View.user.js
// @updateURL https://update.greasyfork.org/scripts/430437/Google%20Meet%20Small%20Self-View.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function resize() {
        var width = '100px',
            height = '50px';

        var thumbnail = document.querySelector('div.ADivge');
        thumbnail.style.width = width;
        thumbnail.style.height = height;

        var vid = thumbnail.querySelector('video');
        vid.style.width = width;
        vid.style.height = height;

        var container = thumbnail.parentElement.parentElement;
        container.style.position = 'fixed';
        container.style.top = '-10px';
        container.style.right = '-10px';

        var label = thumbnail.querySelector('[data-self-name]');
        label.style.visibility = 'hidden';
    };

    setInterval(resize, 5000);
})();