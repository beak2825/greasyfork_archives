// ==UserScript==
// @name         moot
// @version      9.9.9
// @description  彻底解脱双手
// @author       大二学长
// @match        *://moot.mhys.com.cn/*
// @namespace https://greasyfork.org/users/1033406
// @downloadURL https://update.greasyfork.org/scripts/478070/moot.user.js
// @updateURL https://update.greasyfork.org/scripts/478070/moot.meta.js
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
