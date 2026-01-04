// ==UserScript==
// @name         CZOJ 圆角化
// @namespace    http://czoj.com.cn
// @version      1.0
// @description  CZOJ 圆角化工具
// @author       lzx
// @match        http://czoj.com.cn/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461694/CZOJ%20%E5%9C%86%E8%A7%92%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/461694/CZOJ%20%E5%9C%86%E8%A7%92%E5%8C%96.meta.js
// ==/UserScript==

const yuanjiao=document.createElement('style');
yuanjiao.innerHTML=`.section{border-radius:20px}`;
document.head.append(yuanjiao);