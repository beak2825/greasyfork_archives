// ==UserScript==
// @name MiSans
// @namespace MiSans
// @version  1.1
// @description 在网页中使用MiSans
// @author LWF
// @license MIT
// @grant none
// @match *://*/*
// @exclude *://fanqienovel.com/reader/*
// @exclude *://*.android.google.cn/*
// @exclude *://ai.qaqgpt.com/*
// @exclude *://zifh.com/*
// @exclude *://m3.material.io/*
// @exclude *://www.mdui.org/*
// @exclude *://blog.xiaoqianlan.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/512207/MiSans.user.js
// @updateURL https://update.greasyfork.org/scripts/512207/MiSans.meta.js
// ==/UserScript==

(function() {
    // 创建一个 <style> 元素
    const css = document.createElement('style');
    
    // 为 <style> 元素设置 CSS 内容，导入外部字体，并强制所有元素使用 MiSans 字体
    css.innerHTML = "@import url('https://font.sec.miui.com/font/css?family=MiSans:300,400,500,600,700:Chinese_Simplify,Chinese_Traditional,Latin&display=swap');*{font-family:MiSans!important;}";
    
    // 将 <style> 元素添加到页面的 <head> 部分
    document.head.appendChild(css);
})();