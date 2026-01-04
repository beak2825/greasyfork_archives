// ==UserScript==
// @name         Remove YouTube start_radio
// @namespace    kosert.me
// @version      1.1
// @description  Remove the &start_radio=1 parameter from YouTube URLs
// @author       Kosert
// @match        *://www.youtube.com/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546806/Remove%20YouTube%20start_radio.user.js
// @updateURL https://update.greasyfork.org/scripts/546806/Remove%20YouTube%20start_radio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function onUrl(url) {
        if (url.searchParams.has("start_radio")) {
            url.searchParams.delete("start_radio");
            url.searchParams.delete("list");
            window.location = url;
        }
    }

    const url = new URL(window.location.href);
    onUrl(url);

    navigation.addEventListener('navigate', (event) => {
        const url = new URL(event.destination.url);
        onUrl(url);
    });

})();

