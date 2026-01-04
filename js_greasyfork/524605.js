// ==UserScript==
// @name         Bing URL Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在访问bing.com时检测URL是否符合特定条件，并修改URL
// @author       DeepSeek & awa
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524605/Bing%20URL%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/524605/Bing%20URL%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 空函数：用于检测URL是否符合特定条件
    function checkUrlCondition(url) {
        return url.includes('&cvid=') || url.includes('&FPIG=') || url.includes('&form=')
    }

    // 空函数：用于修改URL
    function modifyUrl(url) {
        return url.replace(/&cvid=[0-9A-F]+/g, '').replace(/&FPIG=[0-9A-F]+/g, '').replace(/&form=[A-Z]+/g, '')
    }

    // 获取当前URL
    const currentUrl = window.location.href;

    // 检测URL是否符合条件
    if (checkUrlCondition(currentUrl)) {
        // 修改URL
        const newUrl = modifyUrl(currentUrl);

        // 跳转到修改后的URL
        history.replaceState({}, '', newUrl)
        window.location.href = newUrl
    }
})();