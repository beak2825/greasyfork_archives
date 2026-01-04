// ==UserScript==
// @name         aopeng
// @namespace    http://tampermonkey.net/
// @version      0.1.2022年3月7日
// @description  奥鹏
// @author       osci
// @license      MIT
// @match        https://learn.open.com.cn/StudentCenter/CourseWare/ShowResource*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=open.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441063/aopeng.user.js
// @updateURL https://update.greasyfork.org/scripts/441063/aopeng.meta.js
// ==/UserScript==
$(document).ready(function () {
    function get_video_obj() {
        let ifr = document.querySelector("#ifr").contentWindow;
        return ifr.document.querySelector("video");
    }

    function play_a_video() {
        $("#coursePlayer").click();
        let course_list = $("#coursetree .icon_video");
        for (const courseListKey in course_list) {
            let this_course = $(course_list[courseListKey]).parent().parent();
            let this_course_statues = $(this_course).find(".progress_btn");
            if ($(this_course_statues).attr("class").search("all_play") === -1) {
                $(this_course).find('a').click();
                break;
            }
        }
    }

    if (localStorage.getItem("UserName") === 'liuyuee') {
        setInterval(function () {
            let video = get_video_obj();
            if (video !== null) {
                    if (video.ended) {
                    console.log("播放完毕了")
                    play_a_video();
                } else {
                    console.log("未播放完")
                    if (video.played) {
                        video.play();
                    }
                }
            } else {
                console.log("等")
            }

        }, 1000)
    } else {
        alert("用户不是：liuyuee")
    }

})




