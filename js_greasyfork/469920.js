// ==UserScript==
// @name         Discord Scroll bar highlight(discord滚动条高亮)
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @license MIT
// @description  discord的亮色主题太刺眼了，暗黑的滚动条看的不清晰，所以通过脚本把滚动条改个颜色进行高亮，方便滚动
// description:en discord's bright theme was too harsh and the dark scroll bar was not clear, so I used a script to highlight the scroll bar with a different color to make scrolling easier
// @author       xiaolaji
// @match        https://discord.com/channels/*
// @downloadURL https://update.greasyfork.org/scripts/469920/Discord%20Scroll%20bar%20highlight%28discord%E6%BB%9A%E5%8A%A8%E6%9D%A1%E9%AB%98%E4%BA%AE%29.user.js
// @updateURL https://update.greasyfork.org/scripts/469920/Discord%20Scroll%20bar%20highlight%28discord%E6%BB%9A%E5%8A%A8%E6%9D%A1%E9%AB%98%E4%BA%AE%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(() => {
        // 创建一个新的 <style> 元素
        var style = document.createElement('style');
        // 设置 <style> 元素的内容为需要添加的CSS样式
        style.innerHTML = '/* 设置滚动条的颜色 */ ::-webkit-scrollbar { background-color: red; width: 12px; } /* 设置滚动条上的滑块的颜色 */ ::-webkit-scrollbar-thumb { background-color: skyblue !important; border-radius: 10px; }';
        // 将 <style> 元素添加到 <head> 元素中
        document.head.appendChild(style);
    }, 3 * 1000)
})();
