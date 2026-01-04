// ==UserScript==
// @name         bilibili播放页清爽版
// @version      0.1
// @description  bilibili播放页清爽版，去除header，右侧所有，和播放结束后的推荐
// @author       admin@bestcondition.cn
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      Apache 2.0
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/481115/bilibili%E6%92%AD%E6%94%BE%E9%A1%B5%E6%B8%85%E7%88%BD%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/481115/bilibili%E6%92%AD%E6%94%BE%E9%A1%B5%E6%B8%85%E7%88%BD%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=>{
        ['bili-header','right-container','bpx-player-ending-wrap'].map(
            (cl)=>{
                Array.from(document.getElementsByClassName(cl)).map(
                    (e)=>{
                        e.style.display='none';
                    }
                );
            }
        );
    }, 1000); // 每秒执行一次

    // Your code here...
})();