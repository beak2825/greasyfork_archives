// ==UserScript==
// @name         ZLOJ圆角卡片
// @namespace    https://greasyfork.org/zh-CN/users/921602
// @version      1.0
// @description  将ZLOJ卡片设置为圆角。
// @author       东北虎
// @match        *://220.180.209.150:30000/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445956/ZLOJ%E5%9C%86%E8%A7%92%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/445956/ZLOJ%E5%9C%86%E8%A7%92%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

const a = document.createElement('style');
a.innerHTML = `.section{border-radius:10px}`;
document.head.append(a);