// ==UserScript==
// @name         京训钉视频助手
// @namespace    https://github.com/ybz640919/jxd_helper
// @version      0.2
// @description  京训钉视频自动播放自动续播刷课时自动关弹窗自动下一课
// @author       DaBing
// @grant        none
// @include      *://*.bjjnts.cn/*

// @downloadURL https://update.greasyfork.org/scripts/408582/%E4%BA%AC%E8%AE%AD%E9%92%89%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/408582/%E4%BA%AC%E8%AE%AD%E9%92%89%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("START");

    $('.change_chapter').each(function (e) {
        $(this).attr('data-lock', 0)
    });

    $('#studymovie').bind('pause', function () {
        console.log('视频暂停！' + new Date().toLocaleTimeString());
        setTimeout(function () {
            if ($('.layui-layer-btn0').length) {
                $('.layui-layer-btn0').click();
            }
        }, 1500)
    });

    $('#studymovie').bind('ended', function () {
        console.log('播放完毕！' + new Date().toLocaleTimeString());
        setTimeout(function () {
            $('.course_study_sonmenu').each(function (e) {
                if ($(this).hasClass('on')) {
                    var lessonnum = parseInt($(this).find('a').data('lessonnum')) + 1;
                    $('.lesson-' + lessonnum).click();
                    return false;
                }
            })
        }, 1500)
    });

    /**
     * second convert to hh:mm:ss
     * @param t
     * @returns {string}
     */
    function timeConvert(t) {
        let h = Math.floor(t / 3600);
        let m = Math.floor((t % 3600) / 60);
        if (m < 10) {
            m = "0" + m;
        }
        let s = Math.floor((t % 3600) % 60);
        if (s < 10) {
            s = "0" + s;
        }
        return h + ":" + m + ":" + s;
    }

    if (window.location.href.indexOf("userCourse") !== -1) {
        let totalTime = 0;
        let totalWatchedTime = 0;

        $("ul.user_courselist").children().each((index, element) => {
            let timeSplit = $(element).children("div.user_coursetext").children("div.user_coursedesc").children()[1].innerText.substr(5).split(':');
            let oneLessonTotalTime = +timeSplit[0] * 3600 + +timeSplit[1] * 60 + +timeSplit[2];
            totalTime = totalTime + Number(oneLessonTotalTime);
            let study_complete_percent_text = $(element).find("span.study_complete_percent")[0].innerText.trim();
            let study_complete_percent = study_complete_percent_text.substr(0, study_complete_percent_text.length - 1) * 0.01;

            if (study_complete_percent !== 0) {
                $(element).find(".user_coursedesc").append(`<p>已看时长：${timeConvert(study_complete_percent * oneLessonTotalTime)}</p>`)
            }else {
                $(element).find(".user_coursedesc").append(`<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>`)
            }

            totalWatchedTime = totalWatchedTime + study_complete_percent * oneLessonTotalTime;
        });

        totalTime = timeConvert(totalTime);
        totalWatchedTime = timeConvert(totalWatchedTime);

        $("div.user_courseinfo_box").append(`<p><label>视频时长：</label><span>${totalTime}</span></p>`).append(`<p><label>已看时长：</label><span>${totalWatchedTime}</span></p>`)

        console.log("totalWatchedTime: " + totalWatchedTime);
        console.log("totalTime: " + totalTime);
    }
    console.log("END");
})();
