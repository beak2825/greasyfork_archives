// ==UserScript==
// @name         Fullscreen Button
// @name:zh-CN   全屏按钮
// @match        *://*/*
// @version      0.2
// @description  A simple float button for entering fullscreen.
// @description:zh-CN 一个简单的浮动按钮用于全屏显示网页。
// @noframes
// @license      CC0
// @namespace    https://greasyfork.org/users/123506
// @downloadURL https://update.greasyfork.org/scripts/474531/Fullscreen%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/474531/Fullscreen%20Button.meta.js
// ==/UserScript==
'use strict';

// Check if the fullscreen button already exists
var btn = document.getElementById("b0n");

// If it doesn't exist, create it
if (!btn) {
    document.body.insertAdjacentHTML("afterbegin", '<div id="b0n" style="background-color: rgb(209, 209, 209);position: fixed;display: flex;opacity: 0.66;margin: 1em;z-index: 2147483647" ><svg width="24" height="24"><path d="M7,14L5,14v5h5v-2L7,17v-3zM5,10h2L7,7h3L10,5L5,5v5zM17,17h-3v2h5v-5h-2v3zM14,5v2h3v3h2L19,5h-5z"/></svg></div>');
    btn = document.getElementById("b0n");
}

var reF = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;

var action = function () {
    reF.call(document.documentElement);
}

btn.onclick = action;

// Variables for long press and touch events
var longPressTimer;
var isTouching = false;
var touchOffsetX, touchOffsetY;

// Add touch event listeners
btn.addEventListener("touchstart", function (e) {
    isTouching = true;
    var touch = e.touches[0];
    touchOffsetX = touch.clientX - btn.getBoundingClientRect().left;
    touchOffsetY = touch.clientY - btn.getBoundingClientRect().top;

    // Set a long press timer for 500 milliseconds
    longPressTimer = setTimeout(function () {
        btn.style.cursor = "grabbing";
    }, 500);
});

btn.addEventListener("touchmove", function (e) {
    if (!isTouching) return;
    var touch = e.touches[0];
    var x = touch.clientX - touchOffsetX;
    var y = touch.clientY - touchOffsetY;
    btn.style.left = x + "px";
    btn.style.top = y + "px";
    e.preventDefault(); // Prevent page scrolling while dragging
});

btn.addEventListener("touchend", function () {
    isTouching = false;
    clearTimeout(longPressTimer);
    btn.style.cursor = "grab";
});
