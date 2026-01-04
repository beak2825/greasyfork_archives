// ==UserScript==
// @name         QS-LYS||资源解析下载(目前支持：包图网、千图网、熊猫办公、千库网、风云办公、觅元素、图品汇、摄图、觅知、字魂)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  QS-LYS||资源解析下载(目前支持：包图网、千图网、熊猫办公、千库网、风云办公、觅元素、图品汇、摄图、觅知、字魂),慎用，毋传！
// @author       QS-LYS
// @match        https://ibaotu.com/*.html*
// @match        https://www.58pic.com/*.html*
// @match        https://www.tukuppt.com/*.html*
// @match        https://588ku.com/*.html*
// @match        https://www.ppt118.com/*.html*
// @match        https://www.51yuansu.com/*.html*
// @match        https://www.88tph.com/*.html*
// @match        https://699pic.com/*.html*
// @match        https://www.51miz.com/*.html*
// @match        https://izihun.com/*.html*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445229/QS-LYS%7C%7C%E8%B5%84%E6%BA%90%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%28%E7%9B%AE%E5%89%8D%E6%94%AF%E6%8C%81%EF%BC%9A%E5%8C%85%E5%9B%BE%E7%BD%91%E3%80%81%E5%8D%83%E5%9B%BE%E7%BD%91%E3%80%81%E7%86%8A%E7%8C%AB%E5%8A%9E%E5%85%AC%E3%80%81%E5%8D%83%E5%BA%93%E7%BD%91%E3%80%81%E9%A3%8E%E4%BA%91%E5%8A%9E%E5%85%AC%E3%80%81%E8%A7%85%E5%85%83%E7%B4%A0%E3%80%81%E5%9B%BE%E5%93%81%E6%B1%87%E3%80%81%E6%91%84%E5%9B%BE%E3%80%81%E8%A7%85%E7%9F%A5%E3%80%81%E5%AD%97%E9%AD%82%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445229/QS-LYS%7C%7C%E8%B5%84%E6%BA%90%E8%A7%A3%E6%9E%90%E4%B8%8B%E8%BD%BD%28%E7%9B%AE%E5%89%8D%E6%94%AF%E6%8C%81%EF%BC%9A%E5%8C%85%E5%9B%BE%E7%BD%91%E3%80%81%E5%8D%83%E5%9B%BE%E7%BD%91%E3%80%81%E7%86%8A%E7%8C%AB%E5%8A%9E%E5%85%AC%E3%80%81%E5%8D%83%E5%BA%93%E7%BD%91%E3%80%81%E9%A3%8E%E4%BA%91%E5%8A%9E%E5%85%AC%E3%80%81%E8%A7%85%E5%85%83%E7%B4%A0%E3%80%81%E5%9B%BE%E5%93%81%E6%B1%87%E3%80%81%E6%91%84%E5%9B%BE%E3%80%81%E8%A7%85%E7%9F%A5%E3%80%81%E5%AD%97%E9%AD%82%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var url = window.location.href
    var site = ["ibaotu", "58pic", "tukuppt", "588ku", "ppt118", "51yuansu", "88tph", "699pic", "51miz", "izihun"] //88tph.com、58pic    暂可能无效
    url = url.replace("-", "/") //将url中“-”替换成“/”，主要针对"699pic"
    var idpr = url.split("/")
    var idfn = idpr[4].split(".")
    var sitenumb = 0
    for (var i = 0; i < site.length; i++) {
        if (url.includes(site[i])) {
            sitenumb = i
            break
        }
    }
    switch (sitenumb) {

        case sitenumb = 0:
            $('div.download-wrap.clearfix').find('a:contains("下载")').each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 1:
            $(".show-download-row.clearfix").find("div:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 2:
            $(".work-down").find("span:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 3:
            $("div.clearfix.btns-box").find("a:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 4:
            $('div.detailinfo').find("a.downbtn.btn:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 5:
            $('div.show-pic-operate').find("a:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 6:
            $('div.fr-bg.fr-t').find("button:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 7:
            $('div.video-type').find("a:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 8:
            $("div.main-content-right-box-1.pr").find("a:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=" + idpr[3] + "&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
        case sitenumb = 9:
            $("div.mr-top.load-auth-record-pop").find("button:contains('下载')").each(function (index, DOM) {
                var Curl = "https://www.kelongwo.com/hsdd/hsdd_jx_text.php?mark=" + site[sitenumb] + "&title=LYS&type=font&parentid=" + idfn[0] + "&subid=" + index + "&payurl=" + window.location.href
                $(this).attr("onclick", 'window.open("' + Curl + '")')
            })
            break
            //后续待添加
    }

})();