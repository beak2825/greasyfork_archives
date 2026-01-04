// ==UserScript==
// @name         回到顶部/底部
// @namespace    https://greasyfork.org/zh-CN/users/188704
// @version      0.4
// @description  快速滚到页面顶部或底部
// @author       linmii
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377905/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/377905/%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E5%BA%95%E9%83%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (document.documentElement.offsetHeight > document.documentElement.clientHeight) {
        let top = document.documentElement.scrollTop;
        let lmUpDiv = document.createElement("div");
        lmUpDiv.id = "lm-up-div";
        lmUpDiv.style.cssText = "position: fixed; z-index: 999999; background-color: #fff; bottom: 70px; left: 30px; width: 30px; height: 30px; border-radius: 50%; font-size: 12px; white-space: nowrap; line-height: 30px; text-align: center; border: solid 1px #999999; color: #999999; cursor: pointer; display: " + (top > 30 ? "block" : "none") + "; opacity: 0.8;";
        lmUpDiv.innerText = "顶部";
        lmUpDiv.onclick = function () {
            document.documentElement.scrollTop = 0;
        };

        let lmDownDiv = document.createElement("div");
        lmDownDiv.id = "lm-down-div";
        lmDownDiv.style.cssText = "position: fixed; z-index: 999999; background-color: #fff; bottom: 30px; left: 30px; width: 30px; height: 30px; border-radius: 50%; font-size: 12px; white-space: nowrap; line-height: 30px; text-align: center; border: solid 1px #999999; color: #999999; cursor: pointer; display: " + (top + document.documentElement.clientHeight === document.documentElement.offsetHeight ? "none" : "block") + "; opacity: 0.8;";
        lmDownDiv.innerText = "底部";
        lmDownDiv.onclick = function () {
            document.documentElement.scrollTop = document.documentElement.offsetHeight;
        };

        let body = document.querySelector("body");
        body.appendChild(lmUpDiv);
        body.appendChild(lmDownDiv);

        bindScrollEvent();
    }
})();

function bindScrollEvent() {
    window.addEventListener("scroll", function () {
        let up = document.querySelector("#lm-up-div");
        let down = document.querySelector("#lm-down-div");
        let top = document.documentElement.scrollTop;
        if (top + document.documentElement.clientHeight === document.documentElement.offsetHeight) {
            up.style.bottom = "30px";
            up.style.display = "block";
            down.style.display = "none";
        } else if (top < 30) {
            up.style.display = "none";
            down.style.display = "block";
        } else {
            up.style.bottom = "70px";
            up.style.display = "block";
            down.style.display = "block";
        }
    });
}