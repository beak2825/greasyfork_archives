// ==UserScript==
// @name         B站直播间去除马赛克
// @namespace    http://tampermonkey.net/
// @version      2024-08-18
// @description  使用【Alt+M】切换模式(正常, 隐藏, 外框线)
// @author       Zhangsq37
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @noframes
// @license      MIT
// @homepage https://space.bilibili.com/485399943
// @downloadURL https://update.greasyfork.org/scripts/503230/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%8E%BB%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/503230/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E5%8E%BB%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function myLog(msg) {
        console.log(`【B站直播间去除马赛克】(${new Date().toLocaleString()})：${msg}`);
    }

    myLog("已加载");

    GM_addStyle(
        `
        div#web-player-module-area-mask-panel>div {
            transition: all 2s ease-in-out 0.5s;
        }

        div#web-player-module-area-mask-panel[mosaic-mode="hide"]>div {
            opacity: 0;
        }

        div#web-player-module-area-mask-panel[mosaic-mode="outline"]>div {
            outline: 1px solid gray;
        }
        `
    );

    var mosaicMode = ["normal", "hide", "outline"];
    var mosaicModeText = ["正常", "隐藏", "外框线"];
    var i = 0;
    window.addEventListener('keydown', async (e) => {
        if (e.altKey && (e.key == 'm' || e.key == 'M')) {
            e.preventDefault();
            var maskLayer = document.querySelector("div#web-player-module-area-mask-panel");
            if (maskLayer) {
                i = (i + 1) % 3;
                console.log(`直播间共有马赛克 ${maskLayer.childElementCount} 个，切换其显示模式为：${mosaicModeText[i]}`);
                maskLayer.setAttribute("mosaic-mode", mosaicMode[i]);
                if (mosaicMode[i] == "outline") {
                    maskLayer.children.forEach((mosaicArea) => {
                        mosaicArea.setAttribute("backdrop-filter", mosaicArea.style.backdropFilter);
                        mosaicArea.style.backdropFilter = "unset";
                    });
                }
                if (mosaicMode[(i + 2) % 3] == "outline") {
                    maskLayer.children.forEach((mosaicArea) => {
                        mosaicArea.style.backdropFilter = mosaicArea.getAttribute("backdrop-filter");
                    });
                }
            }
            else {
                myLog("直播间未设置马赛克");
            }
        }
    });
})();