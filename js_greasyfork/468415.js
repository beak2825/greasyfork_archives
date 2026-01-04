// ==UserScript==
// @name         AV助手 - 支持私人功能定制，通用草榴社区 | 91porn | ……
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2025.07.27.140829
// @description  功能介绍：1、草榴社区移除因广告拦截等待10s，无需手动点击<同意加载>提示 2、移除91porn广告，静音自动循环播放，新标签页打开视频
// @author       Kay
// @match        *://*/*
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jquery/4.0.0-beta.2/jquery.min.js
// @grant        none
// @noframes
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @downloadURL https://update.greasyfork.org/scripts/468415/AV%E5%8A%A9%E6%89%8B%20-%20%E6%94%AF%E6%8C%81%E7%A7%81%E4%BA%BA%E5%8A%9F%E8%83%BD%E5%AE%9A%E5%88%B6%EF%BC%8C%E9%80%9A%E7%94%A8%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%20%7C%2091porn%20%7C%20%E2%80%A6%E2%80%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/468415/AV%E5%8A%A9%E6%89%8B%20-%20%E6%94%AF%E6%8C%81%E7%A7%81%E4%BA%BA%E5%8A%9F%E8%83%BD%E5%AE%9A%E5%88%B6%EF%BC%8C%E9%80%9A%E7%94%A8%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%20%7C%2091porn%20%7C%20%E2%80%A6%E2%80%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const url = location.href;
    let style = `<style id="stylex"></style>`;
    $("body").append(style);
    if (url.indexOf("https://t66y.com") > -1 && url != "https://t66y.com/") {
        let a = setTimeout(() => { }, 0);
        for (let i = 0; i < a; i++) { clearTimeout(i); }
        $("a:contains(同意加載)").click();
        let b = `
        .ftad-ct,
        br+.tips[style="width:auto"],
        tr.do_not_catch th:last-child br {
            display: none;
        }
        `;
        $("#stylex").html(b);
        $("#conttpc img").attr("src", function () { return $(this).attr("ess-data"); });
    }
    else if (document.title.indexOf("Chinese homemade video") > -1) {
        $("#wrapper").prev("div").remove();
        $("#row iframe").remove();
        let a = $("#player_one source").attr("src");
        $(".video-container").prepend("<video style='width:100%; max-height:calc(100vh - 300px);' controls autoplay loop muted><source src=" + a + "></video>");
        $("#player_one").remove();
        $(".video-title").parent().attr("target", "_blank");
        let b = `
        body,
        .video-container {
            background-color: black !important;
        }

        div:has(+ #wrapper):not(.navbar),
        *:has(~ .video-container):not(h4),
        #row iframe,
        .ad_img,
        #player_one {
            display: none !important;
        }
        `;
        $("#stylex").html(b);
    }
})();
// End-60-2025.07.27.140829
