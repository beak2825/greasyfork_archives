// ==UserScript==
// @name         FOP小助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  FOP开发小助手
// @author       sudongxu
// @match        *://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478368/FOP%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/478368/FOP%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
// 脚本 - FOP小助手

(function() {
    'use strict';

    // Your code here...
    let isMouseDown = false;
      const initStyle = {
        width: "40px",
        height: "100px",
        "background-color": "#fff",
        display: "flex",
        "flex-direction": "column",
        "justify-content": "flex-end",
        "border-radius": "0 0 30px 30px",
        border: "1px solid rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        transform: "translateY(-75px)",
        transition: "0.3s linear",
        cursor: "pointer",
        position: "fixed",
        "z-index": 100000000,
      };
      const hoverStyle = {
        transform: "translateY(-60px)",
        cursor: "pointer",
        "background-color": "#ffd100",
      };
      const logoStyle = {
        "-webkit-user-select": "none" /* Chrome/Safari */,
        "user-select": "none",
        width:"30px",
        height:"30px",
        "margin-left":"5px",
      };

      // 设置css样式
      function setStyle(e, styleObj) {
        Object.keys(styleObj).forEach((key) => {
          e.style[key] = styleObj[key];
        });
      }

      const container = document.createElement("div");
      // 创建img元素
      const img = document.createElement("img");

      // 设置img元素的属性
      img.src =
        "https://p0.meituan.net/travelcube/0bbafeea1f1db5387528e8ad62bbd0781653.png";
      img.draggable = false;
      setStyle(img, logoStyle);

      // 将img元素添加到指定的父元素中
      container.appendChild(img);
      // 从localStorage中获取上次的位置
      let lastLeft = localStorage.getItem("divLeft");
      if (lastLeft) {
        container.style.left = lastLeft + "px";
      }
      setStyle(container, initStyle);

      // 移入
      container.addEventListener("mouseover", function (e) {
        setStyle(container, hoverStyle);
      });
      // 移出
      container.addEventListener("mouseout", function (e) {
        setStyle(container, initStyle);
      });

      // 鼠标按下事件
      container.addEventListener("mousedown", function (e) {
        isMouseDown = true;
        e.preventDefault();
      });
      // 鼠标移动事件
      window.addEventListener("mousemove", function (e) {
        if (isMouseDown) {
          setStyle(container, hoverStyle);
          container.style.left = e.clientX - container.offsetWidth / 2 + "px";
        }
      });
      // 鼠标松开事件
      window.addEventListener("mouseup", function () {
        isMouseDown = false;
        setStyle(container, initStyle);
        // 将位置存储到localStorage中
        localStorage.setItem("divLeft", parseInt(container.style.left));
      });

      document.body.appendChild(container);
})();