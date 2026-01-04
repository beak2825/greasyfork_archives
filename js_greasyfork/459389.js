// ==UserScript==
// @name         feishu_minutes_single
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将飞书妙记转化为单栏
// @author       Ovler-Young
// @match        https://*.feishu.cn/minutes/*
// @exclude      https://*.feishu.cn/minutes/me
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feishu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459389/feishu_minutes_single.user.js
// @updateURL https://update.greasyfork.org/scripts/459389/feishu_minutes_single.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // Create a floating ball
    var ball = document.createElement("div");
    ball.style.backgroundColor = "red";
    ball.style.width = "30px";
    ball.style.height = "30px";
    ball.style.borderRadius = "15px";
    ball.style.position = "fixed";
    ball.style.right = "20px";
    ball.style.bottom = "20px";
    ball.style.cursor = "pointer";
    document.body.appendChild(ball);

    // Add an event listener to run code when the ball is clicked
    ball.addEventListener("click", function () {
        var isHidden = ball.getAttribute("data-hidden") === "true";
        // 1. remove extra-info-wrapper
        var extrainfowrapper =
            document.getElementsByClassName("extra-info-wrapper")[0];
        extrainfowrapper.style.display = "none";

        // 2. remove keywords-comp-inner
        var keywordsCompInner = document.getElementsByClassName(
            "keywords-comp-inner"
        )[0];
        keywordsCompInner.style.display = "none";
        console.log("success")

        // 3. move right-area to left-area
        var rightAreaInner = document.querySelector('.right-area-inner');
        var leftArea = document.querySelector('.left-area');
        var rightArea = document.querySelector('.right-area');
        var collapseCompExpand = document.querySelector('.collapse-comp-expand');
        leftArea.appendChild(rightAreaInner);
        rightArea.style.display = "none";
        collapseCompExpand.style.display = "none";

        // 4 remove header
        var larkwWebHeader = document.querySelector('.larkw-web-header');
        larkwWebHeader.style.display = "none";
    });
})();