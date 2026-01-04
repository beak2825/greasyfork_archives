// ==UserScript==
// @name         Youtube Music I'm still here listening
// @namespace    http://tampermonkey.net/
// @version      2025-05-13(2)
// @description  Clicks on the annoying button for you and trying to fake page focus so this message won't appear at all
// @author       kkrow
// @license      MIT
// @match        https://music.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=music.youtube.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535841/Youtube%20Music%20I%27m%20still%20here%20listening.user.js
// @updateURL https://update.greasyfork.org/scripts/535841/Youtube%20Music%20I%27m%20still%20here%20listening.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Util to redefine getters
    function defineGetter(obj, prop, value) {
        Object.defineProperty(obj, prop, {
            get: () => value,
            configurable: true
        });
    }

    // Page Visibility API — always visible
    defineGetter(document, 'hidden', false);
    defineGetter(document, 'webkitHidden', false);
    defineGetter(document, 'visibilityState', 'visible');
    defineGetter(document, 'webkitVisibilityState', 'visible');

    // hasFocus() — always true
    window.hasFocus = () => true;
    document.hasFocus = () => true;

    // Block registry of tracking listeners
    const origDocumentAddEventListener = document.addEventListener;
    document.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange' || type === "blur" || type === "focus") {
            // console.log("rejected attempt of adding new document listener: " + type)
            return;
        }
        return origDocumentAddEventListener.call(this, type, listener, options);
    };
    const origWindowAddEventListener = document.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'visibilitychange' || type === "blur" || type === "focus") {
            // console.log("rejected attempt of adding new window listener: " + type)
            return;
        }
        return origWindowAddEventListener.call(this, type, listener, options);
    };

    // If tab lose focus turn focus back immediately
    window.addEventListener('blur', () => {
        window.focus();
    });

    // Click these button as soon as they appear
    setInterval(() => {
        try {
            document.getElementsByClassName('yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--call-to-action-inverse yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment')[0].click()
        } catch {}
    }, 1000);
    setInterval(() => {
        try {
            document.getElementsByClassName('yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--call-to-action yt-spec-button-shape-next--size-m yt-spec-button-shape-next--enable-backdrop-filter-experiment')[0].click()
        } catch {}
    }, 1000);

})();