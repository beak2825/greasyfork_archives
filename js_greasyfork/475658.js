// ==UserScript==
// @name         N0ts - 新版美和易思自动刷课
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自动切换下一课，取消鼠标限制，彻底解脱双手
// @author       N0ts
// @match        *://moot.mhys.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475658/N0ts%20-%20%E6%96%B0%E7%89%88%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475658/N0ts%20-%20%E6%96%B0%E7%89%88%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    let initState = false;

    setInterval(() => {
        isCoursePage();
    }, 500);

    function isCoursePage() {
        if (!window.location.hash.includes("#/coursePlay")) {
            console.log("暂未检测到播放课程");
            return (initState = false);
        }
        if (initState) return;
        initState = true;
        console.log("课程已检测完成，开始自动刷课");
        init();
    }

    let play = null;
    let menu = null;
    function init() {
        menu = document.querySelector(".operation button");
        if (!menu) {
            return setTimeout(() => {
                init();
            }, 300);
        }
        menu.click();
        play = player.parentNode.__vue__.player;
        if (!play) {
            return setTimeout(() => {
                init();
            }, 300);
        }

        window.onblur = () => {};

        play.on("s2j_onPlayOver", () => {
            console.log("播放完毕，切换下一节");
            if (!document.querySelector(".user-info-content")) {
                menu.click();
            }
            setTimeout(() => {
                let doms = document.querySelectorAll(".father-ul .son-li");
                for (let i = 0; i < doms.length; i++) {
                    if (doms[i].querySelector(".active")) {
                        console.log(doms[i + 1]);
                        doms[i + 1].click();
                        break;
                    }
                }
            }, 100);
        });
    }
})();
