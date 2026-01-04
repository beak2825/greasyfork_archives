// ==UserScript==
// @name         哔哩哔哩(B站|Bilibili)全屏直播净化
// @namespace    https://github.com/afyi/bliveclear
// @version      1.3.7.1
// @description  1. 去掉B站(live.bilibili.com)网页全屏或者全屏时出现的讨厌的打赏工具栏的小工具，2. 去掉直播间左下或者右下马赛克的功能
// @author       猫东东 <https://del.pub>
// @match        *://live.bilibili.com/*
// @website      https://greasyfork.org/zh-CN/scripts/483878-b%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%A8%E5%B1%8F%E6%97%B6%E5%B7%A5%E5%85%B7%E6%A0%8F%E6%B8%85%E7%90%86
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNzA0Mzg5MzgyMzQyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDExMjkgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjQyMzIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjIwLjUwNzgxMjUiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNMjM0LjkwOSA5LjY1NmE4MC40NjggODAuNDY4IDAgMCAxIDY4LjM5OCAwIDE2Ny4zNzQgMTY3LjM3NCAwIDAgMSA0MS44NDMgMzAuNTc4bDE2MC45MzcgMTQwLjgyaDExNS4wN2wxNjAuOTM2LTE0MC44MmExNjguOTgzIDE2OC45ODMgMCAwIDEgNDEuODQzLTMwLjU3OEE4MC40NjggODAuNDY4IDAgMCAxIDkzMC45NiA3Ni40NDVhODAuNDY4IDgwLjQ2OCAwIDAgMS0xNy43MDMgNTMuOTE0IDQ0OS44MTggNDQ5LjgxOCAwIDAgMS0zNS40MDYgMzIuMTg3IDIzMi41NTMgMjMyLjU1MyAwIDAgMS0yMi41MzEgMTguNTA4aDEwMC41ODVhMTcwLjU5MyAxNzAuNTkzIDAgMCAxIDExOC4yODkgNTMuMTA5IDE3MS4zOTcgMTcxLjM5NyAwIDAgMSA1My45MTQgMTE4LjI4OHY0NjIuNjkzYTMyNS44OTcgMzI1Ljg5NyAwIDAgMS00LjAyNCA3MC4wMDcgMTc4LjY0IDE3OC42NCAwIDAgMS04MC40NjggMTEyLjY1NiAxNzMuMDA3IDE3My4wMDcgMCAwIDEtOTIuNTM5IDI1Ljc1aC03MzguN2EzNDEuMTg2IDM0MS4xODYgMCAwIDEtNzIuNDIxLTQuMDI0QTE3Ny44MzUgMTc3LjgzNSAwIDAgMSAyOC45MSA5MzkuMDY1YTE3Mi4yMDIgMTcyLjIwMiAwIDAgMS0yNy4zNi05Mi41MzlWMzg4LjY2MmEzNjAuNDk4IDM2MC40OTggMCAwIDEgMC02Ni43ODlBMTc3LjAzIDE3Ny4wMyAwIDAgMSAxNjIuNDg3IDE3OC42NGgxMDUuNDE0Yy0xNi44OTktMTIuMDctMzEuMzgzLTI2LjU1NS00Ni42NzItMzkuNDNhODAuNDY4IDgwLjQ2OCAwIDAgMS0yNS43NS02NS45ODQgODAuNDY4IDgwLjQ2OCAwIDAgMSAzOS40My02My41N00yMTYuNCAzMjEuODczYTgwLjQ2OCA4MC40NjggMCAwIDAtNjMuNTcgNTcuOTM3IDEwOC42MzIgMTA4LjYzMiAwIDAgMCAwIDMwLjU3OHYzODAuNjE1YTgwLjQ2OCA4MC40NjggMCAwIDAgNTUuNTIzIDgwLjQ2OSAxMDYuMjE4IDEwNi4yMTggMCAwIDAgMzQuNjAxIDUuNjMyaDY1NC4yMDhhODAuNDY4IDgwLjQ2OCAwIDAgMCA3Ni40NDQtNDcuNDc2IDExMi42NTYgMTEyLjY1NiAwIDAgMCA4LjA0Ny01My4xMDl2LTM1NC4wNmExMzUuMTg3IDEzNS4xODcgMCAwIDAgMC0zOC42MjUgODAuNDY4IDgwLjQ2OCAwIDAgMC01Mi4zMDQtNTQuNzE5IDEyOS41NTQgMTI5LjU1NCAwIDAgMC00OS44OS03LjI0MkgyNTQuMjJhMjY4Ljc2NCAyNjguNzY0IDAgMCAwLTM3LjgyIDB6IG0wIDAiIGZpbGw9IiMyMEIwRTMiIHAtaWQ9IjQyMzMiPjwvcGF0aD48cGF0aCBkPSJNMzQ4LjM2OSA0NDcuNDA0YTgwLjQ2OCA4MC40NjggMCAwIDEgNTUuNTIzIDE4LjUwNyA4MC40NjggODAuNDY4IDAgMCAxIDI4LjE2NCA1OS41NDd2ODAuNDY4YTgwLjQ2OCA4MC40NjggMCAwIDEtMTYuMDk0IDUxLjUgODAuNDY4IDgwLjQ2OCAwIDAgMS0xMzEuOTY4LTkuNjU2IDEwNC42MDkgMTA0LjYwOSAwIDAgMS0xMC40Ni01NC43MTl2LTgwLjQ2OGE4MC40NjggODAuNDY4IDAgMCAxIDcwLjAwNy02Ny41OTN6IG00MTYuMDIgMGE4MC40NjggODAuNDY4IDAgMCAxIDg2LjEwMiA3NS42NHY4MC40NjhhOTQuMTQ4IDk0LjE0OCAwIDAgMS0xMi4wNyA1My4xMSA4MC40NjggODAuNDY4IDAgMCAxLTEzMi43NzMgMCA5NS43NTcgOTUuNzU3IDAgMCAxLTEyLjg3NS01Ny4xMzNWNTE5LjAyYTgwLjQ2OCA4MC40NjggMCAwIDEgNzAuMDA3LTcwLjgxMnogbTAgMCIgZmlsbD0iIzIwQjBFMyIgcC1pZD0iNDIzNCI+PC9wYXRoPjwvc3ZnPg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483878/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28B%E7%AB%99%7CBilibili%29%E5%85%A8%E5%B1%8F%E7%9B%B4%E6%92%AD%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/483878/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28B%E7%AB%99%7CBilibili%29%E5%85%A8%E5%B1%8F%E7%9B%B4%E6%92%AD%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (/live.bilibili.com/.test(location.host)) {
        console.log("B站直播全屏时工具栏清理");
        const observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // console.log('body类名发生了改变');
                    // 这里可以添加处理逻辑
                    let classList = Object.values(document.querySelector('body').classList);
                    // 查看一下对应的值
                    // console.log(typeof classList, classList);
                    // 获取当前播放器对象
                    let livePlayer = document.getElementById("live-player");
                    let video = livePlayer.querySelector("video");
                    // 判定是否有播放器全屏的样式
                    if (classList.includes("player-full-win") || classList.includes("fullscreen-fix")) {
                        // 取消打赏栏的可见性
                        document.getElementById("web-player__bottom-bar__container").style = "display:none; width: 0;";
                        // 将高度信息存储到localStorage中
                        localStorage.setItem('bilivideoHeight', video.style.height);
                        // 然后将高度设为100%
                        video.style.height = '100%';
                    } else {
                        // 还原打赏栏可见性
                        document.getElementById("web-player__bottom-bar__container").style = "display:block; width:100%;";
                        // 从localStorage中读取打赏栏高度，若值为空，则恢复为默认值 calc(100% - 114px)
                        video.style.height = localStorage.getItem('bilivideoHeight') || 'calc(100% - 114px)';
                    }
                }
            }
        });
        // 配置观察选项
        const config = { attributes: true };
        // 开始观察目标节点（body）及其子节点的变动
        observer.observe(document.querySelector('body'), config);
        
        // 定义一个变量来跟踪检测次数
        let checkCount = 0, isRemoved = false, reTry = 5;
            
        // 定义一个方法，来指定次数移除遮罩层
        let checkAndRemoveMask = function () {
            // 最多执行{$reTry}次就停止
            if (checkCount >= reTry || isRemoved) {
                console.log("检测结束，一共执行了", checkCount, "次，但未能找到遮罩层...");
                return; // 停止执行
            }
            // 获取遮罩层节点
            let mask = document.querySelector(".web-player-module-area-mask");
            if (mask) {
                console.log('找到遮罩层，正在删除...');
                mask.parentNode.removeChild(mask);
                console.log('遮罩层已移除，脚本停止。');
                isRemoved = true;
                return;
            } 
            // 增加次数
            checkCount++;
            // 如果节点未被删除，设置定时器1秒后再次执行该函数
            if (!mask && !isRemoved) setTimeout(checkAndRemoveMask, 1000);
        }
        // 初次执行
        checkAndRemoveMask();
    }
})();