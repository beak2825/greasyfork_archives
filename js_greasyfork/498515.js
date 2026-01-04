// ==UserScript==
// @name         [redmine] remember scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remember scroll position, and apply on reload.
// @author       You
// @match        https://sd.acbel.com/redmine/sprints/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498515/%5Bredmine%5D%20remember%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/498515/%5Bredmine%5D%20remember%20scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sessionKey = 'remember_scroll:' + window.location.href;

    window.onscrollend = function () {
        let scrollPos;
        if (typeof window.pageYOffset != 'undefined') {
            scrollPos = window.pageYOffset;
        }
        else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollTop;
        }
        else if (typeof document.body != 'undefined') {
            scrollPos = document.body.scrollTop;
        }
        sessionStorage.setItem(sessionKey, scrollPos);
    }

    window.onload = function () {
        let lastPos = sessionStorage.getItem(sessionKey);
        if (lastPos) {
            document.documentElement.scrollTop = lastPos;
            document.body.scrollTop = lastPos;
        }
    }
})();