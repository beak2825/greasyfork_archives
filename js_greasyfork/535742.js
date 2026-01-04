// ==UserScript==
// @name         Instiz iOS Zoom Blocker (Light)
// @version      1.0
// @description  Fix iOS Safari input zoom by setting font-size to 16px
// @match        *://*.instiz.net/*
// @match        *://instiz.net/*
// @namespace https://greasyfork.org/users/1468855
// @downloadURL https://update.greasyfork.org/scripts/535742/Instiz%20iOS%20Zoom%20Blocker%20%28Light%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535742/Instiz%20iOS%20Zoom%20Blocker%20%28Light%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fixInputZoom() {
        const els = document.querySelectorAll('input, textarea, select');
        els.forEach(el => {
            el.style.setProperty('font-size', '16px', 'important');
            el.style.setProperty('-webkit-text-size-adjust', '100%', 'important');
        });
    }

    function fixViewport() {
        let meta = document.querySelector('meta[name=viewport]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }

    fixViewport();
    fixInputZoom();
})();