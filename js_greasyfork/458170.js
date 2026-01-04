// ==UserScript==
// @name         力扣屏蔽单题难度标签
// @namespace    markshawn.com
// @version      0.2
// @description  力扣屏蔽单题难度标签~
// @author       markshawn2020
// @match        https://leetcode.cn/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458170/%E5%8A%9B%E6%89%A3%E5%B1%8F%E8%94%BD%E5%8D%95%E9%A2%98%E9%9A%BE%E5%BA%A6%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/458170/%E5%8A%9B%E6%89%A3%E5%B1%8F%E8%94%BD%E5%8D%95%E9%A2%98%E9%9A%BE%E5%BA%A6%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let getLevelEle = () => document.querySelector("#qd-content > div.h-full.flex-col.ssg__qd-splitter-primary-w > div > div.min-h-0.flex-grow > div > div.flex.h-full.w-full.overflow-y-auto > div > div > div.w-full.px-5.pt-4 > div > div.mt-3.flex.space-x-4 > div");

    let checkLevelEle = () => {
        let levelEle = getLevelEle();
        if(levelEle) levelEle.style.display = 'none';
        console.log(`checking level ele: ${levelEle ? "OK" : "FAILED"}`);
        return levelEle;
    }

    // ref: https://stackoverflow.com/a/67825703
    const observer = new MutationObserver(function(mutations) {
        // TODO: add more conditions to avoid unnecessary check
        checkLevelEle();
    });
    const config = {subtree: true, childList: true};
    observer.observe(document, config);

    // init, loop
    let check = () => setTimeout(() => {
        if(!checkLevelEle()) check();
    }, 100);
    check();
})();
