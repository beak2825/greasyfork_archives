// ==UserScript==
// @name         某网站自动跳转下一集
// @author       某个高中不努力毕业上大专的傻逼
// @match        *://moot.mhys.com.cn/*
// @description  某网站自动跳转下一集的脚本，可以配合视频10倍速脚本使用
// @license MIT
// @version 1.2
// @namespace https://greasyfork.org/users/1195951
// @downloadURL https://update.greasyfork.org/scripts/477418/%E6%9F%90%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/477418/%E6%9F%90%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
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
            }, 11000);
        });
    }
})();