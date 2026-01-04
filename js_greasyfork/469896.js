// ==UserScript==
// @name         Fix Twitter Share Link
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace `twitter` to `vxtwitter` when sharing links
// @author       You
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469896/Fix%20Twitter%20Share%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/469896/Fix%20Twitter%20Share%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const originalExecCommand = document.execCommand;
    const hijackedExecCommand = (...attrs) => {
        if (attrs[0] == 'copy') {
            const selected = window.getSelection().toString();
            if (selected.match(/^https+:\/\/((.+)\.)?x\.com\/(.+)\/status\/(\d+)(\?.+)?$/)) {
                const newUrl = selected.replace(/^https+:\/\/((.+)\.)?x\.com\/(.+)\/status\/(\d+)(\?.+)?$/, 'https://vxtwitter.com/$3/status/$4');
                copyTextToClipboard(newUrl);
                return;
            }
        }
        callExecCommand(...attrs);
    }
    const callExecCommand = (...attrs) => {
        document.execCommand = originalExecCommand;
        document.execCommand(...attrs);
        document.execCommand = hijackedExecCommand;
    }
    const copyTextToClipboard = (text) => {
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        callExecCommand('copy', true);
        document.body.removeChild(textarea);
    }

    document.execCommand = hijackedExecCommand;
})();