// ==UserScript==
// @name         leetcode快捷键
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  leetcode快捷键0.11
// @author       You
// @match        https://leetcode.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445691/leetcode%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/445691/leetcode%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*
 * @Author: LOG
 * @FilePath: \油猴脚本\leetcode快捷键.js
 * @Descripttion:
 * @version:
 * @Date: 2022-05-29 13:54:07
 * @LastEditors: LOG
 * @LastEditTime: 2022-05-29 13:56:19
 */

// 监听F5键
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 116) {
        e.preventDefault();
        let RunCode=document.querySelectorAll('.runcode__20UZ')[0];
        console.log("runcode:",RunCode);
        RunCode.click();
    }
});
// 监听ctrl+s键
document.addEventListener('keydown', function(e) {
    if (e.keyCode == 83 && e.ctrlKey) {
        e.preventDefault();
        let SubmitCode=document.querySelectorAll('.submit__-6u9')[0];
        console.log("SubmitCode:",SubmitCode);
    }
})
    // Your code here...
})();