// ==UserScript==
// @name         Weibo Pic Helper
// @namespace    https://greasyfork.org/zh-CN/users/220174-linepro
// @version      1.0
// @description  抓取上传后的微博图片的地址及以 Markdown 格式化。
// @author       LinePro
// @match        *://weibo.com/*
// @grant        GM_setClipboard
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373426/Weibo%20Pic%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/373426/Weibo%20Pic%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function getPicUrl() {
        var m_num = jQuery(".num_totla").text();
        var urltext = new Array();
        for (var m_i1 = 0; m_i1 < m_num; ++m_i1) {
            var exec = "li.pic:eq(" + m_i1 + ")";
            var htmltext = jQuery(exec).html();
            var my1 = htmltext.indexOf("https");
            var my2 = htmltext.indexOf(".jpg");
            urltext[m_i1] = htmltext.substring(my1, my2 + 4);
            urltext[m_i1] = urltext[m_i1].replace("square", "large");
        }
        var url_total = "";
        for (var m_i2 = 0; m_i2 < m_num; ++m_i2) {
            url_total = url_total + "![](" + urltext[m_i2] + ")\n";
        }
        return url_total;
    }
    window.onload = function(){
        jQuery(".home.S_txt1").replaceWith('<button class = W_btn_a id = "m_btn">复制图片 Markdown</button>');
        jQuery("#m_btn").click(function (event) {
            GM_setClipboard(getPicUrl());
            document.getElementById("m_btn").innerText = "已复制";
        });
    }
})();