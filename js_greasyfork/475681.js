// ==UserScript==
// @name         美和易思自动刷课
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @description  新版美和易思测试demo，有问题请反馈，请使用chrome浏览器
// @author       wangyuqi
// @match        *://moot.mhys.com.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475681/%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475681/%E7%BE%8E%E5%92%8C%E6%98%93%E6%80%9D%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
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
      //去除后台播放和鼠标限制
  function unrestrict() {
    let oldAdd = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
      if (window.onblur !== null) {
        window.onblur = null;
      }
      if (args.length !== 0 && args[0] === "visibilitychange") {
        console.log("后台播放开启成功！");
        return;
      }
      return oldAdd.call(this, ...args);
    };
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

        unrestrict()

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