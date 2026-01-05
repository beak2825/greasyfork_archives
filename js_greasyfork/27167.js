// ==UserScript==
// @name            字幕组字幕下载页面扩展脚本
// @icon            http://www.rrys2019.com/favicon.ico
// @author          LisonFan
// @version         1.0.1
// @description     给字幕组的字幕下载页面增加一个字幕版本对应的视频文件下载链接
// @match           http://www.rrys2019.com/subtitle/*
// @grant           none
// @license         MIT License
// @require         https://lib.baomitu.com/jquery/3.4.1/jquery.min.js
// @namespace https://github.com/LisonFan/
// @downloadURL https://update.greasyfork.org/scripts/27167/%E5%AD%97%E5%B9%95%E7%BB%84%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E9%A1%B5%E9%9D%A2%E6%89%A9%E5%B1%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/27167/%E5%AD%97%E5%B9%95%E7%BB%84%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD%E9%A1%B5%E9%9D%A2%E6%89%A9%E5%B1%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    let subtitleInfoList = $("ul.subtitle-info").find("li")
    $.each(subtitleInfoList, function () {
        let tmpStr = $(this).text()
        if (tmpStr.search(/^版本/g) > -1) {
            let title = tmpStr.substring(3)
            title = title.replace(/(\.zip|\.rar)$/, "")
            let url = "https://rarbg.to/torrents.php?search=" + title
            let a = "<a href='" + url + "' target='_blank' style='color: red;'>" + title + "</a>"
            $(this).html($(this).text().replace(title, a + " <- 点击跳转"))
        }
    })
})(jQuery);
