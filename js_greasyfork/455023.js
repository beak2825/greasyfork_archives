// ==UserScript==
// @name         cctalk倍速播放
// @namespace
// @version      0.2
// @description  一个cctalk倍速播放脚本
// @author       Mzy
// @match        *://ocs.hujiang.com/*/*/*
// @grant        none
// @license MIT
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/455023/cctalk%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455023/cctalk%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

// 设置倍速默认为2，最高为16
const rate = 2;


(function() {
    'use strict';
    window.addEventListener("load", () => {
        let sleep = function (time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        };
        const start = () => {
            let container = document.querySelector('.video-overlay');
            if (container === null) {
                sleep(500).then(() => {
                    start();
                    console.log(container);
                })
                return;
            }
            const selectNode = document.createElement("select")
            for (let i = 1; i <= rate; i += 0.25) {
                const optionNode = document.createElement("option")
                optionNode.value = i
                optionNode.innerHTML = i;
                selectNode.appendChild(optionNode)
            }
            selectNode.addEventListener("change", () => {
                let videoNode = document.querySelector("div video");
                videoNode.playbackRate = parseFloat(selectNode.value);
            })
            sleep(1000).then(() => {
                container.appendChild(selectNode);
            })

        }
        sleep(500).then(() => {
            start();
        })
    })
})();