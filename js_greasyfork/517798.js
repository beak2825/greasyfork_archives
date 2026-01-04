// ==UserScript==
// @name        江西干部学院自动刷课脚本
// @namespace   江西干部学院自动刷课脚本
// @match       https://study.jxgbwlxy.gov.cn/study/courseMine*
// @match       https://study.jxgbwlxy.gov.cn/courseDetailsNew?*
// @match       https://study.jxgbwlxy.gov.cn/videoChoose?*
// @match       https://study.jxgbwlxy.gov.cn/video?*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addValueChangeListener
// @run-at      document-end
// @version     3.0
// @author      You
// @license     MIT
// @description 把页面挂在“我的必修课”或“我的选修课”即可，可自动完成相应页面的课程学习
// @downloadURL https://update.greasyfork.org/scripts/517798/%E6%B1%9F%E8%A5%BF%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/517798/%E6%B1%9F%E8%A5%BF%E5%B9%B2%E9%83%A8%E5%AD%A6%E9%99%A2%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



(function () {
    // 监听消息
    var isplaying = false;

    GM_addValueChangeListener("multiTabMessage", (key, oldValue, newValue, remote) => {
        console.log("收到其他标签页消息：", newValue);
        newValue = newValue.split(":")[1];
        if (newValue === "playing") {
            isplaying = true;
        } else if (newValue === "finished") {
            isplaying = false;
        }
    });

    // 发送消息
    function sendMessageToOtherTabs(msg) {
        GM_setValue("multiTabMessage", `${Date.now()}:${msg}`);
    }
    if (window.location.href.indexOf("https://study.jxgbwlxy.gov.cn/study/courseMine") !== -1) {
        setInterval(() => {
            location.reload();
        }, 5 * 60 * 1000);
        setInterval(() => {
            document.querySelector('div.myRow > div.myCol4 > div.courseCard').click();
        }, 2 * 60 * 1000);
    } else if (window.location.href.indexOf("https://study.jxgbwlxy.gov.cn/courseDetailsNew?") !== -1) {
        setInterval(() => {
            if (isplaying) {
                window.close();
            } else {
                document.querySelector('button.myBtn.selected')?.click();
                if (window.location.href.indexOf("https://study.jxgbwlxy.gov.cn/video?") !== -1) {
                    location.reload();
                }
            }
        }, 1000 * 5);
    } else if (window.location.href.indexOf("https://study.jxgbwlxy.gov.cn/videoChoose?") !== -1) {
        setTimeout(() => { window.close(); }, 1000 * 5);
    } else if (window.location.href.indexOf("https://study.jxgbwlxy.gov.cn/video?") !== -1) {
        setInterval(() => {
            if (document.querySelector('.el-message-box > button') !== null) {
                sendMessageToOtherTabs("finished");
                window.close();
            }
            if (document.querySelector('video').paused === false) {
                sendMessageToOtherTabs("playing");
            }
        }, 1000 * 1);
        setInterval(() => {
            document.querySelector('video').muted = true;
            document.querySelector('video').play();
            let isFinished = document.querySelector('ul.kc_list li:last-of-type .kc-info span:last-child').textContent === "已完成"
            if (isFinished) {
                sendMessageToOtherTabs("finished");
                window.close();
            }
        }, 1000 * 5);
    }
})();
