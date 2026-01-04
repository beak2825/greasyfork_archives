// ==UserScript==
// @name         CSDN 复制代码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CSDN 复制代码，并自动高度
// @author       You
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459946/CSDN%20%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/459946/CSDN%20%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function resetHeight(it) {
        $('textarea').each((ind,it) => {
            it.style.height = it.scrollHeight + 'px';
        });
    }
    setInterval(() => {
        $('#article_content pre').each((ind,pre) => {
            $(pre).replaceWith(`<textarea style="width:100%;height: ${pre.offsetHeight}px;">${$(pre).find('code')[0].innerText}</textarea>`);
            resetHeight();
        });
    },1000);
    // Your code here...
})();