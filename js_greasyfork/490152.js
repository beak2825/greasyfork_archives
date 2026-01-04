// ==UserScript==
// @name         YanDex翻译
// @namespace    https://translate.yandex.com/
// @version      0.1
// @description  使用Yandex Translate API对网页进行翻译
// @author       未知
// @run-at       document-end
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490152/YanDex%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/490152/YanDex%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(() => {
    // 创建一个包裹翻译组件的div
    const wrap = document.createElement("div");
    Object.assign(wrap.style, {
        position: "fixed", // 固定定位，使其相对于视口固定
        top: innerHeight - 50 + "px", // 离视口顶部的距离
        left: innerWidth - 200 + "px", // 离视口左侧的距离
        margin: 10 + "px", // 外边距
        width: 180 + "px", // 宽度
        height: 30 + "px", // 高度
        backgroundColor: "transparent", // 背景颜色透明
        zIndex: 99999999, // 堆叠顺序，越大越在上层
    });
    wrap.id = "ytWidget"; // 设置div的id
    document.body.appendChild(wrap);

    // 创建一个script元素用于加载翻译组件的脚本
    const a = document.createElement("script");
    // 设置翻译组件脚本的来源，这里是Yandex Translate API的地址
    a.src =
        "https://translate.yandex.net/website-widget/v1/widget.js?widgetId=ytWidget&pageLang=en&widgetTheme=light&autoMode=false";
    document.body.appendChild(a);
})();