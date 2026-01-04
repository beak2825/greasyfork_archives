// ==UserScript==
// @name         e2ds高中URP教务系统助手
// @namespace    https://www.muyuanhuck.cn/archives/312
// @version      0.1.1
// @description  URP教务系统进行教学评估
// @author       爱吃花椒的胖头鱼
// @match        http://39.153.170.82:46110/*
// @match        http://172.16.11.161/*
// @grant        muyuan
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/446173/e2ds%E9%AB%98%E4%B8%ADURP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446173/e2ds%E9%AB%98%E4%B8%ADURP%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {

        //自动选择最优选项
        var keyWord = ["非常", "从不", "很严格", "全神贯注", "清晰", "较多", "适中", "很大"];

        $(".ace").each(function() {
            var self = $(this);
            var text = $(this).next().next().html();
            keyWord.forEach(function(value) {
                if (text.indexOf(value) != -1)
                    self.click();
            });
            console.log(text);
        })

        //自动填写主观评价
        var content = "上课有热情，精神饱满，有感染力"; //自行填写
        $("textarea").val(content);

        //30min后提交
        setTimeout(function() {
            $("#buttonSubmit").click()
        }, 1000 * 30 * 1.1);
    });
})();
