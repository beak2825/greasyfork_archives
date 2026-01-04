// ==UserScript==
// @name            tophub&greasyfork新标签页打开
// @namespace       mine.com
// @description     链接从新标签页打开
// @match        *://tophub.today/*
// @match        *://greasyfork.org/zh-CN/scripts*
// @version         1.0.2
// @downloadURL https://update.greasyfork.org/scripts/418883/tophubgreasyfork%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/418883/tophubgreasyfork%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('a').forEach(item => {
        //不给空href和greasyfork的page页加_blank
        if(!/javascript/.test(item.href) && !/page/.test(item.href)) {
            item.setAttribute('target','_blank');
        }
    });
})();