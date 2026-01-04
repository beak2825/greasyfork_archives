// ==UserScript==
// @name         酷学院弹框去除
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  酷学院学习网站，视频播放弹框去除
// @author       涂涂 
// @match        https://pro.coolcollege.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457241/%E9%85%B7%E5%AD%A6%E9%99%A2%E5%BC%B9%E6%A1%86%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/457241/%E9%85%B7%E5%AD%A6%E9%99%A2%E5%BC%B9%E6%A1%86%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

let autoClick = null;

window.onpopstate = function() {
    let url = window.location.href;
    if (url.indexOf("training/trainingProject/traineeView") !== -1) {
        setTimeout(() => {
            clickPlayVideo();
        }, 3000);
    } else if (url.indexOf("/training/learning/task/watchTask") !== -1) {
        setTimeout(() => {
            clickCheckWindow();
            $("video")[0].addEventListener("ended", function() {
                if ($(".ant-btn").length) {
                    if (autoClick !== null) {
                        clearInterval(autoClick);
                    }
                    $(".ant-btn")[0].click();
                }
            });
        }, 3000);
    }
};

function clickCheckWindow() {
    if (autoClick !== null) {
        clearInterval(autoClick);
    }
    autoClick = setInterval(() => {
        if ($(".ant-modal-content .ant-modal-footer").length) {
            $(".ant-modal-content .ant-modal-footer").each(function(index, element) {
                $(element)
                    .find("button")
                    .click();
                console.log($("video").length);
                var video = $("video")[0];
                video.muted = true;
                video.play();
            });
        }
    }, 2000);
}

function clickPlayVideo() {
    if ($(".ant-btn").length) {
        if (
            $(".ant-btn span").length &&
            ($(".ant-btn span")[0].innerText === "继续学习" ||
             $(".ant-btn span")[0].innerText === "开始学习")
        ) {
            $(".ant-btn")[0].click();
        }
    }
}
