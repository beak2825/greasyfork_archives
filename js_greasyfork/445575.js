// ==UserScript==
// @name         WeLearn 自动挂机
// @namespace    https://github.com/hui-shao
// @version      0.3
// @description  用于WeLearn学习挂机，自动切换下一页，并模拟点击播放相关音频，避免出现“30分钟未学习”提示。此外，还在页面右上角添加一个“显示答案”的按钮，可用于检查答案是否正确。仅做测试用 建议使用Chrome浏览器。
// @author       hui-shao
// @license      GPLv3
// @match        http*://welearn.sflep.com/*/*tudyCourse.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sflep.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/445575/WeLearn%20%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/445575/WeLearn%20%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function getDoc() {
        // 获取iframe并设置其加载完成的触发器
        for (let i = 1; i < 50; i++) {
            await sleep(100)
            var iframe = document.querySelector("#contentFrame");
            if (iframe) {
                iframe.onload = () => {
                    doc = iframe.contentDocument;
                }
                break;
            }
        }

        if (!iframe) {
            console.warn("[Script] Can not get iframe, Skip click function!")
            return false;
        }

        // 等待从iframe获取到document
        for (let i = 0; i < 100; i++) {
            await sleep(200)
            if (doc) {
                return true;
            }
        }
        console.warn("[Script] Can not get document from iframe, Skip click function!")
        return false;
    }

    function createButton() {
        var button = document.createElement("button");
        button.id = "btn001";
        button.textContent = "Loading...";
        button.style.color = "black";
        button.style.width = "110px";
        button.style.height = "90%";
        button.style.align = "center";
        button.style.marginRight = "0.5%";
        button.style.marginLeft = "-30%";
        doc.getElementsByClassName("controls")[0].appendChild(button);

        let btn = doc.querySelector(".controls .sub .subInner et-button button");
        if (btn) {
            button.textContent = btn.firstChild.innerHTML;
            button.onclick = function () {
                console.log("[Script] Pressed the button.");
                btn.click();
            };
        }
        else {
            button.textContent = "None"
            console.warn("[Script] Can not find key/script btn");
            return;
        }
    }

    function myClick() {
        var arr = null;
        var temp = null;

        // 和下面一小段似乎有重复
        // arr = doc.getElementsByClassName("vjs-big-play-button");
        // if (arr.length) arr[0].click();
        // else console.log("[Script] Can not get vjs-big-play-button");

        arr = doc.getElementsByClassName("vjs-play-control");
        if (arr.length) arr[0].click();
        else console.log("[Script] Can not get vjs-play-button");

        temp = doc.querySelector("et-audio div");
        if (temp) temp.click();
        else console.log("[Script] Can not get et-audio div");

        temp = doc.querySelector("et-button button[ng-click]");
        if (temp && temp.hasChildNodes()) {
            if (temp.childNodes[0].className.includes("microphone") || temp.childNodes[0].innerHTML.includes("Submit") || temp.childNodes[0].innerHTML.includes("Script") || temp.childNodes[0].innerHTML.includes("Key")) { } // 含有麦克风和Submit时跳过录音
            else temp.click();
        }
        else console.log("[Script] Can not get et-button button[ng-click]");
    }

    function setRefreshOnNextButton() {
        var next_btn = null;
        next_btn = document.querySelector(".courseware_sidebar_2 .c_s_3_2");
        if (next_btn) {
            next_btn.onclick = () => {
                sleep(20).then(() => { location.reload(); });
            }
        }
        else console.warn("[Script] Can not get Next_Btn.")
    }

    async function runClick() {
        await getDoc();
        if (doc) {
            var autoClick = setInterval(function () {
                console.log("click");
                myClick();
            }, (Math.round(Math.random() * 5 + 12)) * 1000); // 12~17s

            createButton(); // 绘制KEY按钮
        }
    }

    console.log("[Script] Script loaded.");
    var doc = null;
    var autoNext = setInterval(function () {  // 放在外部 可以确保自动切换能正常运行, 防止脚本终止
        console.log("[Script] Next.");
        NextSCO(); // NextSCO() 是welearn网页定义的
        sleep(200).then(() => { location.reload(); })  // 刷新页面以便于重新加载运行脚本, 重新获取iframe
    }, (Math.round(Math.random() * 5 + 3)) * 1000 * 60);

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            setRefreshOnNextButton(); // 为手动点击Next按钮设置刷新任务
        }
    }

    runClick();

})();