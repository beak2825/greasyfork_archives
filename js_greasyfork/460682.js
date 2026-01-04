// ==UserScript==
// @name         YT Shorts Redirect
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  always redirect to normal video
// @description:pt-BR always redirect to normal video
// @description:ar always redirect to normal video
// @description:bg always redirect to normal video
// @description:cs always redirect to normal video
// @description:da always redirect to normal video
// @description:de always redirect to normal video
// @description:el always redirect to normal video
// @description:eo always redirect to normal video
// @description:es always redirect to normal video
// @description:fi always redirect to normal video
// @description:fr always redirect to normal video
// @description:fr-CA always redirect to normal video
// @description:he always redirect to normal video
// @description:hu always redirect to normal video
// @description:id always redirect to normal video
// @description:it always redirect to normal video
// @description:ja always redirect to normal video
// @description:ko always redirect to normal video
// @description:nb always redirect to normal video
// @description:nl always redirect to normal video
// @description:pl always redirect to normal video
// @description:ro always redirect to normal video
// @description:ru always redirect to normal video
// @description:sk always redirect to normal video
// @description:sr always redirect to normal video
// @description:sv always redirect to normal video
// @description:th always redirect to normal video
// @description:tr always redirect to normal video
// @description:uk always redirect to normal video
// @description:ug always redirect to normal video
// @description:vi always redirect to normal video
// @description:zh-CN always redirect to normal video
// @description:zh-TW always redirect to normal video
// @author       fienestar
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460682/YT%20Shorts%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/460682/YT%20Shorts%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("yt-navigate-start", (event) => {
        console.log(event)
        const uri=event.target.baseURI;
        if(uri.includes('shorts/'))
            location.replace(uri.replace('shorts', 'v'))
    });

    document.getElementsByClassName('ytp-pause-overlay-container')?.forEach?.(container => container.remove())
    if(uri.includes('youtube.com/shorts'))
        location.replace(location.href.replace('shorts', 'v'))

})();