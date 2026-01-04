// ==UserScript==
// @name         Pan Link Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键提取链接并自动跳装
// @author       huohuoma
// @match        https://www.seedhub.cc/link_start/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=seedhub.cc
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523647/Pan%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/523647/Pan%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let panLinkValue = null;

    // 查找包含 panLink 的 script 标签
    for (let script of document.getElementsByTagName('script')) {
        if (script.innerText.includes('panLink')) {
            let match = script.innerText.match(/panLink\s*=\s*['"](.*?)['"]/);
            if (match && match[1]) {
                panLinkValue = match[1];
                break;
            }
        }
    }

    // 如果找到了 panLink，跳转到该链接，否则显示提示
    if (panLinkValue) {
        window.location.href = panLinkValue;
    } else {
        // 显示提示信息
        let mobilePanDiv = document.querySelector('.mobile-pan');
        if (mobilePanDiv) {
            mobilePanDiv.innerHTML = '未找到有效链接，请检查页面设置。';
            mobilePanDiv.style.color = 'red';
        } else {
            console.warn('Div with class "mobile-pan" not found on this page.');
        }
    }
})();