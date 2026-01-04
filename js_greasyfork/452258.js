// ==UserScript==
// @name         clear twitter track link
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在推特页面复制分享链接时，自动将链接后的追踪参数删除
// @author       kaho
// @match        https://x.com/*
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452258/clear%20twitter%20track%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/452258/clear%20twitter%20track%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.addEventListener('copy', async (e) => {
        const copyData = await navigator.clipboard.readText();
        const newLink = /https:\/\/(twitter|x).com\/[a-zA-Z0-9\_\-\.]+\/status\/[0-9]+/.exec(copyData)?.at(0);
        if (newLink) {
            await navigator.clipboard.writeText(newLink);
        }
        e.preventDefault()
    })

})();