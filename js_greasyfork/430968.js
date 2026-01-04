// ==UserScript==
// @name         屏蔽百度小说广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽百度小网页说广告
// @author       You
// @match        https://m.baidu.com/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430968/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B0%8F%E8%AF%B4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/430968/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E5%B0%8F%E8%AF%B4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('float')[0].style.display="none";
    let time = 1000;
    setInterval(() => {
        for (var a=0;a<document.getElementsByClassName('afd-ad').length;a++)
        {
            document.getElementsByClassName('afd-ad')[a].style.display = "none";
        }
    },time);
    // Your code here...
})();