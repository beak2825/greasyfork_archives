// ==UserScript==
// @name         Spaces Full Screener
// @namespace    http://tampermonkey.net/
// @version      2024-02-26
// @description  Takes spaces to full screen on the Huggingface site
// @author       anonimbiri
// @license MIT
// @match        *://huggingface.co/spaces/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hf.space
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488343/Spaces%20Full%20Screener.user.js
// @updateURL https://update.greasyfork.org/scripts/488343/Spaces%20Full%20Screener.meta.js
// ==/UserScript==

const url = new URL(location);

if (url.href.includes('?fullscreen=true') || !url.href.includes('?fullscreen')) {
    url.searchParams.set("fullscreen", "false");
    history.pushState({}, "", url.href);

    setTimeout(function () {
        var iframe = document.querySelector('iframe.space-iframe');
        window.location.href = iframe.src;
    }, 100);

}
