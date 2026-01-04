// ==UserScript==
// @name Discuz!简化样式表Fork
// @description 隐藏不实用的界面元素，让界面简洁轻爽一点。
// @namespace Violentmonkey Scripts
// @match *://bbs.dippstar.com/*
// @match *://bbs.saraba1st.com/*
// @grant none
// @version 0.0.2.20240309001
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486840/Discuz%21%E7%AE%80%E5%8C%96%E6%A0%B7%E5%BC%8F%E8%A1%A8Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/486840/Discuz%21%E7%AE%80%E5%8C%96%E6%A0%B7%E5%BC%8F%E8%A1%A8Fork.meta.js
// ==/UserScript==
 
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".pl .quote, .pl .quote blockquote { background-image: none; } .pl .quote {border-style: solid; border-width: 1px 1px 1px 3px; border-color: #CDCDCD; padding-left: 10px} .favatar > *, table.plhin > tbody:nth-child(1) > tr:nth-child(1n+2), table.plhin > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(1) { display: none; } .favatar div:nth-of-type(1), .favatar div:nth-of-type(2), .favatar div:nth-of-type(3) {display: block} table.plhin > tbody:nth-child(1) > tr:nth-child(4) {display: contents} table.plhin > tbody > tr:nth-child(1) {border-width: 1px 0 0 0; border-style: solid; border-color: #CDCDCD} td.pls {background-color: #f9f9f9}";
document.head.appendChild(css);