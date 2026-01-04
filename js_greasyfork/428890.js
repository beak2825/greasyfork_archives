// ==UserScript==
// @name         安阳师范学院专升本课程小题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安阳师范学院专升本课程小题自动完成
// @author       KangNian
// @match        https://kc.jxjypt.cn/classroom/index?scode=*
// @icon         https://kc.jxjypt.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428890/%E5%AE%89%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E4%B8%93%E5%8D%87%E6%9C%AC%E8%AF%BE%E7%A8%8B%E5%B0%8F%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/428890/%E5%AE%89%E9%98%B3%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E4%B8%93%E5%8D%87%E6%9C%AC%E8%AF%BE%E7%A8%8B%E5%B0%8F%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('div[class="top-r-back z-t-b"]').prepend('<a href="javascript:;" id="autoSub">自动学习并填充答案</a>')
    $("#autoSub").on("click", function () {
        var all = $("div[class='course-list-txt'] dl dd[class='z-gery-icon']")
        console.log(all)
        //定义累加器
        var ix = 0;
        //开始填充答案
        function start() {
            all[ix].click()
            setTimeout(function () {
                var getDaAn = $("div[class='wenzi']")[0].innerText.replace(/[\r\n]/g,"").trim()
                $("dd[data-value='"+getDaAn+"']").click()
                ix++;
                if (ix < all.length) {
                    start();
                }
            },5000);
        }
        start()

    });
})();