// ==UserScript==
// @name      Modify Copied Twitter/X Links to fixupx.com
// @name:zh-CN   将复制的 Twitter/X 链接改为 fixupx.com
// @name:zh-TW   將複製的 Twitter/X 連結改為 fixupx.com
// @description    Modify copied twitter.com/x.com links to fixupx.com
// @description:zh-CN  将复制的 twitter.com/x.com 链接改为 fixupx.com
// @description:zh-tw  將複製的 twitter.com/x.com 連結改為 fixupx.com
// @version      1.0
// @author       Foxxoccino
// @license      MIT
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @namespace https://greasyfork.org/zh-CN/users/1458898-foxxoccino

// @downloadURL https://update.greasyfork.org/scripts/533103/Modify%20Copied%20TwitterX%20Links%20to%20fixupxcom.user.js
// @updateURL https://update.greasyfork.org/scripts/533103/Modify%20Copied%20TwitterX%20Links%20to%20fixupxcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('copy', function(event) {
        const selection = window.getSelection().toString();
        if (selection && (selection.startsWith('https://x.com/') || selection.startsWith('https://twitter.com/'))) {
            navigator.clipboard.writeText(selection.replace(/^https:\/\/(?:x|twitter)\.com\//, 'https://fixupx.com/'));
        }
    });
})();