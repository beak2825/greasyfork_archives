// ==UserScript==
// @name         墨刀V8预览演示可操作高亮
// @namespace    dd
// @version      0.3
// @description  墨刀原型+v8演示都有效,不漏需求不漏交互细节
// @author       dlq
// @icon         https://modao.cc/mb-dashboard/vis/modao/favicon.ico
// @grant        none
// @include      *://*.modao.cc/*
// @include      *modao.cc/*
// @downloadURL https://update.greasyfork.org/scripts/492289/%E5%A2%A8%E5%88%80V8%E9%A2%84%E8%A7%88%E6%BC%94%E7%A4%BA%E5%8F%AF%E6%93%8D%E4%BD%9C%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492289/%E5%A2%A8%E5%88%80V8%E9%A2%84%E8%A7%88%E6%BC%94%E7%A4%BA%E5%8F%AF%E6%93%8D%E4%BD%9C%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
     // 创建一个新的 script 元素
    var script = document.createElement("script");
    // 设置 script 的 src 属性为 jQuery 的 CDN 地址
    script.src = "https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js";
    // 在页面中插入 script 元素
    document.body.appendChild(script);

    // 执行你的代码，确保在 jQuery 加载完成后使用
    script.onload = function() {
        // 在这里写入你需要使用 jQuery 的代码
        console.log("jQuery 已加载");
    };
    setInterval(() => {$('.region').css("display", "block")}, 100)
    setInterval(() => {$('.fObEld .clickable > .region').css("display", "block");}, 1000)
})();