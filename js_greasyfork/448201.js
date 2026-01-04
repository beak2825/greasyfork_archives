// ==UserScript==
// @name         视频自动播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ccspx视频自动播放
// @author       You
// @match        https://www.ccspx.cn/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ccspx.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448201/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/448201/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';
    const interval = setInterval(()=>{
        const p = document.querySelector('.task-item.active .task-item--suffix.pull-right').innerText;
        if(p === '100%'){
            const es = document.querySelectorAll('.task-item .task-item--suffix.pull-right');
            for (let index = 0; index < es.length; index++) {
                if(es[index].innerText !== '100%'){
                    es[index].click();
                    return;
                }
            }
            clearInterval(interval);
            return;
        }
        if(document.querySelector('.prism-big-play-btn').style.display !== 'none'){
            document.querySelector('.prism-big-play-btn').click();
        }
    },3000);
})();