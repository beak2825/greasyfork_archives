// ==UserScript==
// @name         Hotkeys for webtoons.com navigation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add navigation hotkeys to Webtoons.com
// @author       github.com/giantpinkwalrus
// @match        https://www.webtoons.com/*/viewer?*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/387601/Hotkeys%20for%20webtoonscom%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/387601/Hotkeys%20for%20webtoonscom%20navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const NEXT = '._nextEpisode';
    const PREV = '._prevEpisode';

    function nav(selector) {
        navigateTo(findElement(selector));
    }

    function navigateTo(elem) {
        if(elem != null && elem.href) {
            window.location = elem.href;
        }
    }

    function findElement(selector) {
        return document.querySelector(selector);
    }

    document.addEventListener("keydown", function onPress(event) {
        switch(event.key) {
            case 'ArrowLeft': return nav(PREV);
            case 'ArrowRight': return nav(NEXT);
            default: return;
        }
    });
})();