// ==UserScript==
// @name         bilibili-Count
// @namespace    https://github.com/cuicui-V5/BilibiliCount
// @version      0.3.0
// @description  统计bilibili合集总时长与观看百分比
// @author       cuicui
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452901/bilibili-Count.user.js
// @updateURL https://update.greasyfork.org/scripts/452901/bilibili-Count.meta.js
// ==/UserScript==

(function () {
    "use strict";

    setTimeout(function () {
        console.log("bilibiliCount: 运行了");

        let lis = document.querySelectorAll(
            ".video-pod__list .video-pod__item",
        );

        let timer = null;
        if (lis.length > 0) {
            count();
        }
        function count() {
            // 使用防抖
            clearTimeout(timer);
            timer = setTimeout(function () {
                console.log("bilibiliCount: 统计中.....");
                let totalSec = 0;
                let watchedSec = 0;
                let totalHur = 0;
                let watchedHur = 0;
                let rate = 0;
                let flag = true; //假如为假, 就不再计算已看时间

                for (let i = 0; i < lis.length; i++) {
                    let TimeStr;

                    TimeStr = lis[i].querySelector(
                        ".stat-item.duration",
                    ).innerHTML;

                    const TimeArr = TimeStr.split(":");
                    // console.log(TimeArr); //['02', '34']
                    if (TimeArr.length === 3) {
                        totalSec += Number(TimeArr[0]) * 3600;
                        totalSec += Number(TimeArr[1]) * 60;
                        totalSec += Number(TimeArr[2]);
                    } else if (TimeArr.length === 2) {
                        totalSec += Number(TimeArr[0]) * 60;
                        totalSec += Number(TimeArr[1]);
                    } else if (TimeArr.length === 1) {
                        totalSec += Number(TimeArr[0]);
                    }

                    if (flag) {
                        watchedSec = totalSec;
                    }

                    if (
                        lis[i].className.indexOf("active") != -1 ||
                        lis[i].querySelector(".active") != null
                    ) {
                        console.log(
                            "bilibiliCount: 当前正在观看" + (i + 1) + "p",
                        );
                        flag = false;
                    }
                }
                totalHur = (totalSec / 3600).toFixed(1);
                watchedHur = (watchedSec / 3600).toFixed(1);
                rate = ((watchedHur / totalHur) * 100).toFixed(2);
                //在页面中添加文字
                let tittle;

                tittle = document.querySelector(
                    ".video-pod .header-top .title",
                );

                tittle.innerHTML = `${watchedHur}/${totalHur}h,${rate}%`;
                tittle.style.fontSize = "14px";
                // 绘制进度条
                let bar;

                bar = document.querySelector(".header-top");

                // 先检查是否有进度条, 如果有就移除
                let oldProgress = bar.querySelector(".progressBar");
                if (oldProgress) {
                    bar.removeChild(oldProgress);
                }

                let progress = document.createElement("div");
                progress.className = "progressBar";
                progress.style.backgroundColor = "#03a0d6";
                let barWidth = bar.offsetWidth * (rate / 100);
                console.log(barWidth);
                progress.style.width = barWidth + "px";
                progress.style.height = "6px";
                bar.style.position = "relative";
                progress.style.position = "absolute";
                progress.style.bottom = "-6px";
                progress.style.zIndex = "999";
                bar.appendChild(progress);
            }, 2000);
        }

        //当分集切换重新统计
        let targetNode;

        targetNode = document.querySelector(".video-pod__list");

        if (targetNode) {
            var observerOptions = {
                childList: true, // 观察目标子节点的变化，是否有添加或者删除
                attributes: true, // 观察属性变动
                subtree: true, // 观察后代节点，默认为 false
            };

            var observer = new MutationObserver(() => {
                console.log("bilibiliCount: 分集切换, 重新统计");
                debance(count, 200)();
            });

            observer.observe(targetNode, observerOptions);
        }
    }, 2500);
})();
function debance(fn, delay = 500) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(null, args);
            timer = null;
        }, delay);
    };
}
