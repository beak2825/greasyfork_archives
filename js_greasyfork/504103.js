// ==UserScript==
// @name         SCP基金会自动重定向至中文版
// @namespace    ack20a@gmail.com
// @version      0.1
// @description  自动从SCP基金会各个语言分支重定向到中文分支。
// @author       ack20
// @match        *://scp-wiki.wikidot.com/*
// @match        *://scp-*.wikidot.com/*
// @match        *://scp-pt-br.wikidot.com/*
// @match        *://scpko.wikidot.com/*
// @match        *://fondazionescp.wikidot.com/*
// @match        *://fondationscp.wikidot.com/*
// @match        *://lafundacionscp.wikidot.com/*
// @redirect     http://scp-wiki-cn.wikidot.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504103/SCP%E5%9F%BA%E9%87%91%E4%BC%9A%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3%E4%B8%AD%E6%96%87%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/504103/SCP%E5%9F%BA%E9%87%91%E4%BC%9A%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3%E4%B8%AD%E6%96%87%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the current URL matches any of the specified patterns
    if (
        currentUrl.match(/:\/\/(scp-wiki|scp-[a-z-]*|scp-pt-br|scpko|fondazionescp|fondationscp|lafundacionscp)\.wikidot\.com\//)
    ) {
        // Construct the corresponding URL on the Chinese branch
        const newUrl = 'http://scp-wiki-cn.wikidot.com/' + currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

        // Redirect to the Chinese branch
        window.location.replace(newUrl);
    }
})();