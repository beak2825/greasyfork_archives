// ==UserScript==
// @name         修改知乎日报标题
// @namespace    https://blog.xlab.app/
// @more         https://github.com/ttttmr/UserJS
// @version      0.6
// @description  修改知乎日报标题为文章标题
// @author       tmr
// @match        *://daily.zhihu.com/story/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405276/%E4%BF%AE%E6%94%B9%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/405276/%E4%BF%AE%E6%94%B9%E7%9F%A5%E4%B9%8E%E6%97%A5%E6%8A%A5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function rename() {
        let zh_title = document.querySelector("p[class=DailyHeader-title]").innerText;
        let new_title = zh_title + "-知乎日报";
        if (document.title !== new_title) {
            document.title = new_title;
        }
        setTimeout(rename, 1000);
    }
    rename();
})();