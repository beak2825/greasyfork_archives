// ==UserScript==
// @name         UCAS课程网站优化
// @namespace    http://ucas.ac.cn/
// @version      0.1
// @description  课程视频显示完整名称
// @author       友情小爪
// @match        https://course.ucas.ac.cn/
// @grant        none
// @match        *://course.ucas.ac.cn/*
// @downloadURL https://update.greasyfork.org/scripts/398365/UCAS%E8%AF%BE%E7%A8%8B%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/398365/UCAS%E8%AF%BE%E7%A8%8B%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 显示视频完整标题
    const a_tag = $(".col_1 a");
    $.each( a_tag, function(index, i ) {
    i.text = i.title;
    console.log(i);
    });

    // 视频标题撑开换行
    const col_1 = $(".col_1");
    $.each(col_1, (index, i)=>{
        i.style.height = 'unset';
    });

    //直播视频高度
    const video = $("#video-container video");
    if (video.length) {
        video.style.width = 'auto';
    }

    function refresh_course_time() {
        if ($("#videoState").length){
            $("#videoState").val("1");
            checkTime();
        }
    }
    setInterval(refresh_course_time,"60000");


})();