// ==UserScript==
// @name         Youtube Shorts Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script automatically redirects the page to the normal youtube video player when a short is loaded. Due to the nature of this script, this breaks the shorts browser from the menu button below the explore page.
// @author       Wantitled
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448009/Youtube%20Shorts%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/448009/Youtube%20Shorts%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            onUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});

    function onUrlChange(){
        if (/shorts\/+/.test(window.location.href)){
            window.location.replace(window.location.href.replace("shorts/", "watch?v="))
        }
    }
})();