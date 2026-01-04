// ==UserScript==
// @name         VIP4（智慧树）
// @namespace    http://shua.ccking.top//
// @version      1.0.3
// @description  try to take over the world!
// @author       You
// @match        *://examh5.zhihuishu.com/*
// @match        *://study.zhihuishu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376967/VIP4%EF%BC%88%E6%99%BA%E6%85%A7%E6%A0%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376967/VIP4%EF%BC%88%E6%99%BA%E6%85%A7%E6%A0%91%EF%BC%89.meta.js
// ==/UserScript==
/**
 * 更新时间：2019-03-12
 * 协议方式：模拟页面操作
 * 风险等级：轻微
 * @author  Jokin
 * @version 2.0.1-beta
 * BY陳大飛 QQ群：246363653
 */

function query() {
    if ($("#popbox_title").length > 0) {
        document.getElementById("tmDialog_iframe").setAttribute("src","http://study.zhihuishu.com/learning/lessonPopupExam?time=01:01:15&lessonId=478019&lessonVideoId=601610&rid=10611&courseId=2038267");
        $(".popboxes_close")[0].click();
        console.log('关闭窗口');
    }

    if ($("#chapterList .time_ico.fl").nextAll()[2].children[0].style.width === "100%" || $("video").get(0).ended) {
        var num = -1;
        var text = $("#chapterList .time_ico.fl").parent().nextAll()[++num].id;
        while (text === "" ||
               text.substr(0, 5) != "video" ||
               text.substr(0, 7) === "video-0") {
            text = $("#chapterList .time_ico.fl").parent().nextAll()[++num].id;
        }
        $("#chapterList .time_ico.fl").parent().nextAll()[num].click();
    }
    // 高清则切换
    if($(".definiLines .active")[0].className === "line1gq active") {
        console.log('切换到标清');
        $(".line1bq")[0].click();
    }

    if ($("video").length > 0 && $("video").get(0).playbackRate != 1.5) {
        console.log('切换到1.5倍');
        $(".speedTab15")[0].click();
    }

    if ($("video").get(0).volume > 0) {
        $(".volumeIcon").click();
    }
}

window.setInterval(query, 1000);
