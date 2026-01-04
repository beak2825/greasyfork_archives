// ==UserScript==
// @name         @quickSetScrollY
// @namespace    https://greasyfork.org/zh-CN/users/866669-your-chef
// @version      0.05
// @description  快速设置滚动条Y位置
// @author       your_chef
// @run-at       document-body
// @match        http://*/*
// @match        https://*/*
// @downloadURL https://update.greasyfork.org/scripts/459904/%40quickSetScrollY.user.js
// @updateURL https://update.greasyfork.org/scripts/459904/%40quickSetScrollY.meta.js
// ==/UserScript==

// 2023-01-29

(function () {
    'use strict';
    console.log("[@quickSetScrollY] Script On");
    let intervalFlag = false;
    document.body.addEventListener("keydown", function (e) {
        if (e.altKey && e.keyCode == 83) {  // alt + s
            let res = prompt("set scrollY", scrollY.toString());
            console.log("input: ", res);
            let newValue = Number(res);
            // console.log(intervalFlag)
            if (!intervalFlag && res != null && (newValue === 0 || newValue)) {
                scrollTo(0, newValue);
                if (Math.abs(scrollY - newValue) > 10) {
                    let repeatCount = 0;
                    let lastScrollY;
                    intervalFlag = true;
                    let checkInterval = setInterval(function () {
                        if (Math.abs(scrollY - newValue) < 10 || repeatCount > 2) {
                            clearInterval(checkInterval);
                            intervalFlag = false;
                        } else {
                            lastScrollY = scrollY;
                            scrollTo(0, newValue);
                            console.log("last scrollY ", lastScrollY.toString());
                            console.log("current scrollY ", scrollY.toString());
                            // console.log(repeatCount)
                            // console.log(Math.abs(scrollY - newValue) < 10 || repeatCount > 3)
                            // console.log(Math.abs(scrollY - newValue) < 10)
                            if (lastScrollY === scrollY) {
                                repeatCount++;
                            } else {
                                repeatCount = 0;
                            }
                        }
                    }, 1000);
                }
            }
        }
    })
})();
