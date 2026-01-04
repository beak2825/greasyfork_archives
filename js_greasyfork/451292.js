// ==UserScript==
// @name         Godot 在线文档宽屏显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Godot 在线文档宽屏显示，解决表格被overflow属性隐藏的问题，内容视觉占比从57%提高到了89%
// @author       beibeibeibei
// @match        *docs.godotengine.org/zh_CN/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451292/Godot%20%E5%9C%A8%E7%BA%BF%E6%96%87%E6%A1%A3%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/451292/Godot%20%E5%9C%A8%E7%BA%BF%E6%96%87%E6%A1%A3%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelector("body").style.width = "90%";
    document.querySelector("body").style.maxWidth = "1713px";
    document.querySelector("body > div.wy-grid-for-nav > section.wy-nav-content-wrap > div.wy-nav-content").style.width = "90%";
    document.querySelector("body > div.wy-grid-for-nav > section.wy-nav-content-wrap > div.wy-nav-content").style.maxWidth = "1411px";
})();