// ==UserScript==
// @name         油猴学习模板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于油猴脚本的学习测试使用
// @author       wqh
// @license      MIT
// @match        https://fizzz.blog.csdn.net/article/details/102638553
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @icon64       data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cg id='XMLID_273_'%3E%3Cg id='XMLID_78_'%3E%3Cpath id='XMLID_83_' class='st0' d='M304.8,0H95.2C42.6,0,0,42.6,0,95.2v209.6C0,357.4,42.6,400,95.2,400h209.6 c52.6,0,95.2-42.6,95.2-95.2V95.2C400,42.6,357.4,0,304.8,0z M106.3,375C61.4,375,25,338.6,25,293.8c0-44.9,36.4-81.3,81.3-81.3 c44.9,0,81.3,36.4,81.3,81.3C187.5,338.6,151.1,375,106.3,375z M293.8,375c-44.9,0-81.3-36.4-81.3-81.3 c0-44.9,36.4-81.3,81.3-81.3c44.9,0,81.3,36.4,81.3,81.3C375,338.6,338.6,375,293.8,375z'/%3E%3C/g%3E%3Cg id='XMLID_67_' class='st2'%3E%3Cpath id='XMLID_74_' class='st3' d='M304.8,0H95.2C42.6,0,0,42.6,0,95.2v209.6C0,357.4,42.6,400,95.2,400h209.6 c52.6,0,95.2-42.6,95.2-95.2V95.2C400,42.6,357.4,0,304.8,0z M106.3,375C61.4,375,25,338.6,25,293.8c0-44.9,36.4-81.3,81.3-81.3 c44.9,0,81.3,36.4,81.3,81.3C187.5,338.6,151.1,375,106.3,375z M293.8,375c-44.9,0-81.3-36.4-81.3-81.3 c0-44.9,36.4-81.3,81.3-81.3c44.9,0,81.3,36.4,81.3,81.3C375,338.6,338.6,375,293.8,375z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/451123/%E6%B2%B9%E7%8C%B4%E5%AD%A6%E4%B9%A0%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/451123/%E6%B2%B9%E7%8C%B4%E5%AD%A6%E4%B9%A0%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ss=document.querySelector("#articleContentId").innerHTML
    console.log(ss)
    GM_setClipboard(ss)
    // Your code here...
})();