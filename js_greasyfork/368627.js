// ==UserScript==
// @name         笔趣阁
// @namespace    
// @version      v1.2
// @description  净化小说页面
// @author       iKurum
// @match        http://www.biqiuge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368627/%E7%AC%94%E8%B6%A3%E9%98%81.user.js
// @updateURL https://update.greasyfork.org/scripts/368627/%E7%AC%94%E8%B6%A3%E9%98%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let displayNone = (...args) => {
        for (let i = 0; i < args.length; i++) {
            let v = (args[i][1] == 1) ? document.getElementsByClassName(args[i][0]) : document.getElementsByTagName(args[i][0]);
            if (v.length != 0  && v.length < 9) {
                for (let j = 0; j < v.length; j++) {
                    v[j].style.display = 'none';
                }
            }
        }
    };
    displayNone(['link', 1], ['close_id', 1], ['ywtop', 1], ['nav', 1], ['footer', 1], ['page_chapter', 1], ['path', 1], ['img', 0]);
})();