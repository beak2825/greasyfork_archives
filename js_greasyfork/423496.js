// ==UserScript==
// @name         auto风格
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  How to make everything automatic!
// @author       @jljiu
// @match        *://*/*
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423496/auto%E9%A3%8E%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/423496/auto%E9%A3%8E%E6%A0%BC.meta.js
// ==/UserScript==

// toArray(); .eq() :has()

//设置选中文本的背景颜色（这里设置为了浅绿色）
$('<style>::selection{background:#c3d6cb;}</style>').appendTo('html');