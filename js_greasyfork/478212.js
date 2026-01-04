// ==UserScript==
// @name         Block Google 贊助
// @namespace    https://www.google.com/
// @version      0.1
// @description  一野BLOCK 撚咗 Google 贊助
// @author       Hon
// @match        http*://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478212/Block%20Google%20%E8%B4%8A%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/478212/Block%20Google%20%E8%B4%8A%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const callback = (records) => {
        document.querySelectorAll("#tvcap").forEach(element => {
            element.remove();
        })
    }
    const observer = new MutationObserver(callback);
    observer.observe(document.body, { childList: true, subtree: true })
})();