// ==UserScript==
// @name         鼠标演示
// @namespace    https://www.cnblogs.com/thetheOrange
// @version      2024-01-25
// @description  更富有弹性的光标
// @author       thetheOrange
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488159/%E9%BC%A0%E6%A0%87%E6%BC%94%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/488159/%E9%BC%A0%E6%A0%87%E6%BC%94%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个鼠标演示指针
    const body = document.querySelector("body");
    const cursor = document.createElement("div");
    // 添加样式
    cursor.setAttribute("style",`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: blue;
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    transition: 250ms cubic-bezier(0.555, 1.600, 0.370, 0.915) all;
    opacity: 0.2;
    pointer-events: none;
    z-index:10000`);
    // 插入元素
    body.appendChild(cursor);
    // 绑定鼠标移动事件
    document.addEventListener("mousemove", (event)=>{
        cursor.style.top = `${event.pageY}px`;
        cursor.style.left = `${event.pageX}px`;
    });
    // 绑定鼠标长按事件
    let ori_width = parseInt(getComputedStyle(cursor).width);
    let ori_height = parseInt(getComputedStyle(cursor).height);
    document.addEventListener("mousedown", () => {
        cursor.style.width = (parseInt(getComputedStyle(cursor).width) + 100) + "px";
        cursor.style.height = (parseInt(getComputedStyle(cursor).height) + 100) + "px";
        })
    document.addEventListener("mouseup", () => {
        // 恢复到原来的宽高
        cursor.style.width = ori_width + "px";
        cursor.style.height = ori_height + "px";
        })
})();