// ==UserScript==
// @name         bilibili视频倍速管理器
// @namespace    https://blog.csdn.net/weixin_46178937
// @homepage      https://blog.csdn.net/weixin_46178937
// @version      0.4
// @description  在视频播放窗口，倍速的地方已经被替换了。需要注意的是，脚本会在打开网站的五秒后执行    更新了记住倍速功能，即使关闭浏览器再重新打开也可以按照以前的倍速设置播放视频
// 0.2  更新了记住倍速功能，即使关闭浏览器再重新打开也可以按照以前的倍速设置播放视频  2021年10月16日11:40:19
// 0.3  优化记住倍速功能  2021年10月16日21:16:01
// 0.4  增加了对新版哔哩哔哩的支持  2023年1月7日16:21:54
// @author       ziop
// @match *://www.bilibili.com/blackboard/*
// @match *://www.bilibili.com/*video/*
// @match *://player.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433260/bilibili%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/433260/bilibili%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let count = 0;

    function init() {
        document.querySelector("body").removeEventListener("click", init);
        setTimeout(function () {
                // console.log("初始化标签开始")
                // 包裹这六个选项卡的菜单
                let menu = document.querySelector("ul.bpx-player-ctrl-playbackrate-menu");
                //六个控制标签
                let all = document.querySelectorAll("li.bpx-player-ctrl-playbackrate-menu-item");
                //++标签
                let plusPlus =all[0];
                //+标签
                let plus = all[1];
                // 用于展示当前速度的标签
                let currentSpeed = all[2];
                //用于还原默认素的的标签
                let defaultSpeed = all[3];
                //-标签
                let minus = all[4];
                //--标签
                let minusMinus = all[5];
                // 用于获取执行脚本时候的速度
                let showRateLabel = document.querySelector("div.bpx-player-ctrl-playbackrate-result");
                // 较大 的跨度
                let secondRate = 0.5;
                // 较小的跨度
                let firstRate = 0.25;
                //  默认速度
                let defaultRate = 1.0;
                let StorageLableName ="ziop_bilibili_speedManager_rate"


                // 对标签进行初始化
                plusPlus.innerText = "+0.5";
                plus.innerText = "+0.25";
                defaultSpeed.innerText = "还原默认速度";
                minus.innerText = "-0.25";
                minusMinus.innerText = "-0.5";
                //获取之前存储的速度
                if (localStorage.getItem(StorageLableName) == null) {
                    if (showRateLabel.innerHTML == "倍速") {
                        localStorage.setItem(StorageLableName, defaultRate);
                    } else {
                        localStorage.setItem(StorageLableName, showRateLabel.innerHTML);
                    }
                }
                currentSpeed.innerHTML = localStorage.getItem(StorageLableName);
                currentSpeed.dataset.value = localStorage.getItem(StorageLableName);
                setSpeed(parseFloat(currentSpeed.dataset.value))
                // console.log("初始化标签结束")

                // console.log("设置控制事件开始")
                plusPlus.onclick = function () {
                    let currentSpeedValue = currentSpeed.dataset.value;
                    let number = parseFloat(currentSpeedValue);
                    number += secondRate;
                    setSpeed(number);
                }

                plus.onclick = function () {
                    let currentSpeedValue = currentSpeed.dataset.value;
                    let number = parseFloat(currentSpeedValue);
                    number += firstRate;
                    setSpeed(number);
                }

                minus.onclick = function () {
                    let currentSpeedValue = currentSpeed.dataset.value;
                    let number = parseFloat(currentSpeedValue);
                    number -= firstRate;
                    setSpeed(number);
                }
                minusMinus.onclick = function () {
                    let currentSpeedValue = currentSpeed.dataset.value;
                    let number = parseFloat(currentSpeedValue);
                    number -= secondRate;
                    setSpeed(number);
                }

                defaultSpeed.onclick = function () {
                    setSpeed(defaultRate);
                }

                // 设置播放速度
                function setSpeed(rate) {
                    for (let i = 0; i < all.length; i++) {
                        if (i != 3) {
                            all[i].dataset.value = rate.toString();
                        }
                    }
                    currentSpeed.innerHTML = showRateLabel.innerHTML;
                    // console.log("first = " + currentSpeed.innerHTML)

                    currentSpeed.click();
                    // console.log("second = " + currentSpeed.innerHTML)
                    localStorage.setItem(StorageLableName, rate);
                }
                menu.style.cssText += 'width: 100px !important';
                document.querySelector("body").addEventListener("click", init);
                // console.log("设置控制事件结束")
                console.log("bilibili视频倍速管理器脚本已经执行" + (++count) + "次")
            }, 5000
        )

    }

    document.querySelector("body").addEventListener("click", init);
    window.onload = init;


})();