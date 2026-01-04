// ==UserScript==
// @name         王者荣耀-官网首页21:9宽屏优化
// @namespace    https://www.52pojie.cn/home.php?mod=space&uid=508077
// @version      1.2
// @description  优化官网21:9宽屏视觉效果
// @author       未知的动力
// @match        https://pvp.qq.com/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/420847/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80-%E5%AE%98%E7%BD%91%E9%A6%96%E9%A1%B521%3A9%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/420847/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80-%E5%AE%98%E7%BD%91%E9%A6%96%E9%A1%B521%3A9%E5%AE%BD%E5%B1%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获取背景元素
    const imgBg = document.querySelector(".wrapper .kv-bg-container .kv-bg");
    if (imgBg) imgBg.style.backgroundSize = "cover";

    // 获取body元素
    const bodyEle = document.body;
    if (bodyEle) {
        // 移除style属性
        bodyEle.removeAttribute("style");
        // 修改padding属性
        bodyEle.style["padding-top"] = "0px";
    }

    // 移除滚动条
    const styleEle = document.createElement("style");
    styleEle.innerHTML = `
    body::-webkit-scrollbar {
        display:none;
    }    `;
    document.head.appendChild(styleEle);



    // 获取顶部白条 去除
    const topBoxEle = document.querySelector("#ost_box");
    if (topBoxEle) topBoxEle.style.display = "none";


    // 上移导航条 只能在onload事件后处理 否则可能失效
    // 由于二次渲染导致的，我们可以添加元素监听来解决，但是为了使代码更轻量
    // 此处简单使用onload事件进行处理
    window.addEventListener("load", event_moveNaviBar, false);
    // 事件处理函数
    function event_moveNaviBar() {
        // 获取header元素 去除top=42px属性
        const headerEle = document.querySelector(".header");
        if (headerEle) headerEle.style.top = "0px";
    }

    // 获取顶部菜单 下移100像素提升海报视觉效果
    const menuTop = document.querySelector(".main_top");
    if (menuTop) menuTop.style["margin-top"] = "100px";

})();