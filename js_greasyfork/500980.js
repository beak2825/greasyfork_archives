// ==UserScript==
// @name         Force ChatGPT-4 Model
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      GPLv3
// @description  Redirect to ChatGPT-4 model if not already set, avoiding redirect loops
// @author       You
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500980/Force%20ChatGPT-4%20Model.user.js
// @updateURL https://update.greasyfork.org/scripts/500980/Force%20ChatGPT-4%20Model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function currentUrlHasModel() {
        // Check if the URL has the model query parameter
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.has('model');
    }

    function currentUrlHasCustomGpt() {
        // Check if the URL contains the custom GPT path "/g/"
        return window.location.pathname.includes('/g/');
    }

    if (!currentUrlHasModel() && !currentUrlHasCustomGpt()) {
        if (!sessionStorage.getItem('redirected')) {
            // Check if not already redirected in this session and not a custom model path
            sessionStorage.setItem('redirected', 'true'); // Mark it as redirected
            console.log('Redirecting to ChatGPT-4 model...');
            window.location.href = "https://chatgpt.com/?model=gpt-4"; // Perform redirect
        } else {
            console.log('Already redirected once in this tab.');
        }
    } else {
        console.log('ChatGPT-4 model is already set or custom model path detected.');
    }
})();
