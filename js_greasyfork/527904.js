// ==UserScript==
// @name         2025高等教育本科院校寒假教师研修自动刷视频
// @namespace    http://tampermonkey.net/
// @version      2025.02.24
// @description  手动点击开始学习进入播放页面后运行
// @author       zain777
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_*
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.all.min.js
// @resource     css https://fastly.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       window-load
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527904/2025%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%9C%AC%E7%A7%91%E9%99%A2%E6%A0%A1%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/527904/2025%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%9C%AC%E7%A7%91%E9%99%A2%E6%A0%A1%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(GM_getResourceText("css"));
    function msg(txt, ms = 3000) {
        Swal.fire({
            html: txt,
            position: "center",
            icon: "success",
            showConfirmButton: false,
            timer: ms,
            timerProgressBar: true,
        })
    }
    var log = console.log;
    var course_name = "2025年高校教师寒假研修";
    function next() {
        var video = null;
        function find_video() {
            var allVideoTitleElements = document.querySelectorAll('.video-title.clearfix');
            var result = Array.prototype.filter.call(allVideoTitleElements, function(el) {
                var dataProgress = parseFloat(el.getAttribute('data-progress') || 0); // Default to 0 if data-progress is missing or invalid
                return dataProgress < 1;
            });
            video = result[0];
        }
        find_video();
        if (video) {
            video.click();
        } else {
            Swal.fire("该专题已经播放完！", "", "success");
        }
    }


    function play(v = null) {
        if (!v) {
            v = document.getElementsByTagName("video")[0];
        }
        if (v) {
            v.muted = true;
            v.playbackRate = 2;
            v.play();
        }
        let btn = document.getElementsByClassName("layui-layer-btn0")[0];
        if (btn && btn.innerText.includes("确定")) {
            btn.next();
        }
    }

    function main() {
        var delay = 1000 * 10
        var href = window.location.href;
        msg(`等待加载视频, 【${delay / 1000}】秒后自动播放视频`, delay);
        setInterval(function () {
            next();
            play();
        }, delay);
    }

    if (document.readyState === "complete") {
        main();
    } else {
        window.addEventListener("load", main);
    }
})();
