// ==UserScript==
// @name         读取本地文件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  对本地文件进行读取操作
// @author       畅心
// @match        https://pbihub.cn/*
// @license      MIT
// @icon         https://pbihub.cn/uploads/avatars/44_1536391253.jpg?imageView2/1/w/380/h/380
// @resource txt1 file:///F:/test/test.csv
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/477657/%E8%AF%BB%E5%8F%96%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/477657/%E8%AF%BB%E5%8F%96%E6%9C%AC%E5%9C%B0%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

const txt = GM_getResourceText('txt1');
alert(txt);
