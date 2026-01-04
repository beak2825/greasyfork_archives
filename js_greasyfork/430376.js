// ==UserScript==
// @name         校本通-全国中小学教师继续教育-信息技术2.0视频自动播放
// @namespace    http://xbtxbtyx.xiaobentong.com/
// @version      0.2
// @description  校本通-信息技术2.0视频自动静音播放，播放完毕自动切换下一个
// @author       星星课
// @match        http://xbtxbtyx.xiaobentong.com/autActivity/intoAutoStudy?courseCode=*
// @icon         http://xbtxbtyx.xiaobentong.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430376/%E6%A0%A1%E6%9C%AC%E9%80%9A-%E5%85%A8%E5%9B%BD%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/430376/%E6%A0%A1%E6%9C%AC%E9%80%9A-%E5%85%A8%E5%9B%BD%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2-%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF20%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
function goNext() {
    var a_tags = $("a[class='flt']");
    var next_course = false;
    for (var i = 0; i < a_tags.length; i += 1) {
        var a_tag = a_tags[i];
        var course_cata_id = getUrlParam("courseCataId");
        var href = $(a_tag).attr("href");
        // console.log(course_id, href);
        if (next_course == true) {
            a_tag.click();
            break
        }
        if (href.indexOf(course_cata_id) != -1) next_course = true;
    }
}
(function () {
    'use strict';
    setInterval(() => {
        var play_btn = $("#replaybtn");
        var video = $("video").get(0);
        if (typeof (video) == "undefined") {
            goNext();
            return;
        };
        video.volume = 0;
        if (play_btn.attr("class") == "ccH5PlayBtn") {
            console.log("开始播放");
            play_btn.click();
        }
        if (play_btn.attr("class") == "adrPlayBtn") {
            console.log("已播放完毕");
            goNext();
        };
    }, 5e3)
})();