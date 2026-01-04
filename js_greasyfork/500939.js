// ==UserScript==
// @name         三晋会计网简易刷课
// @version      0.0.1
// @description  三晋会计网课程速过, 进入课程学习页面,点击当前课程的跳过按钮可跳过50分钟学习,后续需求可联系更新
// @license      MIT
// @namespace    stonepy
// @author       stonepy
// @match        https://www.sxacc.cn/Course/*
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @icon         https://www.sxacc.cn/images/icon/blue.png
// @downloadURL https://update.greasyfork.org/scripts/500939/%E4%B8%89%E6%99%8B%E4%BC%9A%E8%AE%A1%E7%BD%91%E7%AE%80%E6%98%93%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/500939/%E4%B8%89%E6%99%8B%E4%BC%9A%E8%AE%A1%E7%BD%91%E7%AE%80%E6%98%93%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let course_list = document.getElementsByClassName("course-kpoint");
    let local_play = course_list[0].querySelector(".cur");
    let KPOINT_ID = local_play.id.substring(local_play.id.indexOf('_') + 1)
    //获取searchParams
    const searchParams = new URLSearchParams(location.search);
    //获取id参数
    const COURSE_ID = searchParams.get('id');
    let div = document.getElementById(`kpoint_${KPOINT_ID}`)
    div.outerHTML = `<a id="kpoint_${KPOINT_ID}" class="pa f12 text-c" style="cursor: pointer; background-color: rgb(237, 113, 59);">跳过</a>`;
    // 插入到页面的body中
    var study = 0
    local_play.onclick = function (event) {
        while(study<50){
            $.ajax({
                type: 'POST',
                url:`https://www.sxacc.cn/Ashx/CourseHandler.ashx?act=video&rand=${Date.now()}`,
                data:`KPOINT_ID=${KPOINT_ID}&COURSE_ID=${COURSE_ID}&xuexisch=65`,
                contentType: "application/x-www-form-urlencoded",
                success: function(response) {
                    console.log(response);
                    let loding = response.split('|')[2]
                    if(loding >= 100){
                        // alert("success")
                        study=100;
                    }
                }
            });
            study+=1;
        }

    };
})();