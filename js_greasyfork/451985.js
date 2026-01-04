// ==UserScript==
// @name         饥饿的猫评论过滤
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于饥饿的猫的一个过滤评论的插件
// @author       HaiJeng
// @license      MIT
// @match        https://cn.ff14angler.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451985/%E9%A5%A5%E9%A5%BF%E7%9A%84%E7%8C%AB%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/451985/%E9%A5%A5%E9%A5%BF%E7%9A%84%E7%8C%AB%E8%AF%84%E8%AE%BA%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
(function (param) {

    let fun = function () {
        'use strict';
        // Your code here...
        let sar = [
            '死一死', '屁股', '长嘴', '司马',
        ]
        const cmls = document.getElementsByClassName('comment_list')[0];
        let chls = cmls.childNodes;
        let arr = [];
        for (let it of chls) {
            for (let s of sar) {
                if (it.textContent.indexOf(s) > 0)
                    arr.push(it)
                else if (it.innerText.indexOf(s) > 0)
                    arr.push(it)
            }
        }
        for (let it of arr) {
            cmls.removeChild(it);
        }
    };
    window.onload = fun;
})()