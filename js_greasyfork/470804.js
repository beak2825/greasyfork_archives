// ==UserScript==
// @name         我的bilibili是真的用来学习的
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bilibili 去掉首页吸引人注意力的东西，只保留收藏，和登录，方便学习使用
// @author       You
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470804/%E6%88%91%E7%9A%84bilibili%E6%98%AF%E7%9C%9F%E7%9A%84%E7%94%A8%E6%9D%A5%E5%AD%A6%E4%B9%A0%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/470804/%E6%88%91%E7%9A%84bilibili%E6%98%AF%E7%9C%9F%E7%9A%84%E7%94%A8%E6%9D%A5%E5%AD%A6%E4%B9%A0%E7%9A%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
        setTimeout(() => {
        document.querySelectorAll('.right-entry-item').forEach((ele, index) => {
            if (![0, 4].includes(index)) {
                ele.remove()
            }
        });

        ['.feed2', '.bili-header__channel', '.left-entry',].forEach(mark => {
            document.querySelectorAll(mark).forEach(item => item.remove())
        })
    }, 1000)
})();