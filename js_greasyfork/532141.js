// ==UserScript==
// @name         atyponrex 投稿系统的基金名称
// @namespace    http://tampermonkey.net/
// @version      2025-05-03-002
// @description  atyponrex 投稿系统的基金名称要显示全部
// @author       You
// @match        https://ieee.atyponrex.com/submission/submissionBoard/*/verifyOrganizations
// @match        https://wiley.atyponrex.com/submission/submissionBoard/*/verifyOrganizations
// @match        https://*.atyponrex.com/submission/submissionBoard/*/verifyOrganizations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atyponrex.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532141/atyponrex%20%E6%8A%95%E7%A8%BF%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%9F%BA%E9%87%91%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/532141/atyponrex%20%E6%8A%95%E7%A8%BF%E7%B3%BB%E7%BB%9F%E7%9A%84%E5%9F%BA%E9%87%91%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    
    
    const selector = ".fundersWithGrantsFieldItem-flexField .selectBoxSelectContainer.fundersWithGrantsFieldItem-inputField .selectBoxValueContainer .selectBoxSingleValue, .fundersWithGrantsFieldItem-flexField .fundersWithGrantsFieldItem-inputField div.selectBoxValueContainer div.selectBoxSingleValue";

    setInterval(()=>updateElementStyles,1000)


    function updateElementStyles() {
        document.querySelectorAll(selector).forEach(e => {
            e.style.position = "unset";
        });
    }

    // // 使用 MutationObserver 监听 DOM 变化
    // const observer = new MutationObserver(updateElementStyles);

    // observer.observe(document.body, {
    //     childList: true,
    //     subtree: true
    // });

    // // 初始执行一次
    // updateElementStyles();
})();