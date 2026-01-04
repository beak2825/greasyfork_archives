// ==UserScript==
// @name         Hotkey zoom for GeoGuessr
// @namespace    http://tampermonkey.net/
// @version      2024-03-09
// @description  Zoom in on 'v' and out on 'x', works for both map and game. Only tested on chrome.
// @author       github.com/hallunbaek
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489414/Hotkey%20zoom%20for%20GeoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/489414/Hotkey%20zoom%20for%20GeoGuessr.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var event;

    document.addEventListener('mousemove', e => {
        event = e;
    }, {passive: true});

    var interval;

    const scroller = (up) => {
        if (interval) window.clearInterval(interval);
        interval = window.setInterval(() => {
            event.initEvent('wheel', true, true);
            event.deltaY = up ? 1 : -1;
            document.elementFromPoint(event.clientX, event.clientY).dispatchEvent(event);
        }, 10);
    };

    window.addEventListener('keydown', (e) => {
        if (e.key == "x"){
            scroller(true);
        } else if (e.key == "v"){
            scroller(false);
        }
    });

    window.addEventListener('keyup', () => window.clearInterval(interval));
})();