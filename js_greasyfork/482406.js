// ==UserScript==
// @name         Twitter to vxtwitter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Replace `twitter` to `vxtwitter` when sharing links
// @author       Dinomcworld
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @match        https://x.com/*
// @match        https://*.x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482406/Twitter%20to%20vxtwitter.user.js
// @updateURL https://update.greasyfork.org/scripts/482406/Twitter%20to%20vxtwitter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const convertUrl = (url) => {
        const regex = /^(https?:\/\/)?((?:www\.)?x\.com\/)([\w-]+\/status\/\d+)(\?.*)?$/;
        return url.replace(regex, 'https://vxtwitter.com/$3');
    };

    const copyTextToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('URL converted and copied successfully:', text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    document.addEventListener('copy', function(e) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.includes('x.com')) {
            e.preventDefault();
            const convertedUrl = convertUrl(selectedText);
            copyTextToClipboard(convertedUrl);
        }
    }, true);

})();