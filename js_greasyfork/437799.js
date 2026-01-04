// ==UserScript==
// @name         智慧树在线大学校内课自动刷课
// @namespace    https://github.com/poxerial/zhihuishu
// @version      0.1
// @description  智慧树自动刷课，chrome版本 95.0.4638.69（64 位）实测可用，仅限在线大学课程(*://hike.zhihuishu.com/aidedteaching/sourceLearning/*)
// @author       poxerial
// @match        *://hike.zhihuishu.com/aidedteaching/sourceLearning/*
// @icon         https://www.google.com/s2/favicons?domain=zhihuishu.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437799/%E6%99%BA%E6%85%A7%E6%A0%91%E5%9C%A8%E7%BA%BF%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%86%85%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/437799/%E6%99%BA%E6%85%A7%E6%A0%91%E5%9C%A8%E7%BA%BF%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%86%85%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = unsafeWindow.jQuery;
    setTimeout(function(){
               $(".volumeIcon").click();
               $(".speedTab15").click();
               $(".bigPlayButton.pointer").click();
               $(".line1bq").click();
        },2000);
    console.log("加载成功");
    setInterval(function(){
        if ($("div.file-item.active i.icon-finish").length > 0){
            changeFile(parseInt($(".file-item.active").attr("id").slice(5)) + 1);
            setTimeout(function(){
                $(".volumeIcon").click();
                $(".speedTab15").click();
                $(".bigPlayButton.pointer").click();
                $(".line1bq").click();
            },2000);
        }
        if ($(".bigPlayButton.pointer").css("display") == "block"){
            $(".bigPlayButton.pointer").click();
        }
    }, 2000)
})();