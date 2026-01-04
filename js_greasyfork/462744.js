// ==UserScript==
// @name         油猴脚本网站页面去广告
// @description  优化油猴脚本网站中文版（https://greasyfork.org/zh-CN）代码显示区，采用暗色彩色风格和Consolas字体，阅读代码更加舒服。
// @icon         data:image/svg+xml,%3C?xml version='1.0' encoding='utf-8'?%3E%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cg id='XMLID_273_'%3E%3Cg id='XMLID_78_'%3E%3Cpath id='XMLID_83_' class='st0' d='M304.8,0H95.2C42.6,0,0,42.6,0,95.2v209.6C0,357.4,42.6,400,95.2,400h209.6 c52.6,0,95.2-42.6,95.2-95.2V95.2C400,42.6,357.4,0,304.8,0z M106.3,375C61.4,375,25,338.6,25,293.8c0-44.9,36.4-81.3,81.3-81.3 c44.9,0,81.3,36.4,81.3,81.3C187.5,338.6,151.1,375,106.3,375z M293.8,375c-44.9,0-81.3-36.4-81.3-81.3 c0-44.9,36.4-81.3,81.3-81.3c44.9,0,81.3,36.4,81.3,81.3C375,338.6,338.6,375,293.8,375z'/%3E%3C/g%3E%3Cg id='XMLID_67_' class='st2'%3E%3Cpath id='XMLID_74_' class='st3' d='M304.8,0H95.2C42.6,0,0,42.6,0,95.2v209.6C0,357.4,42.6,400,95.2,400h209.6 c52.6,0,95.2-42.6,95.2-95.2V95.2C400,42.6,357.4,0,304.8,0z M106.3,375C61.4,375,25,338.6,25,293.8c0-44.9,36.4-81.3,81.3-81.3 c44.9,0,81.3,36.4,81.3,81.3C187.5,338.6,151.1,375,106.3,375z M293.8,375c-44.9,0-81.3-36.4-81.3-81.3 c0-44.9,36.4-81.3,81.3-81.3c44.9,0,81.3,36.4,81.3,81.3C375,338.6,338.6,375,293.8,375z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E
// @namespace    
// @version      1.0
// @author       islx
// @run-at       document-onload
// @match        https://greasyfork.org/zh-CN/scripts*
// @match        *://*.tampermonkey.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462744/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%BD%91%E7%AB%99%E9%A1%B5%E9%9D%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/462744/%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E7%BD%91%E7%AB%99%E9%A1%B5%E9%9D%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=() =>{
    const ins = document.querySelectorAll('ins')
    for(let i =0;i<ins.length;i++) {
        ins[i].remove()
    }
    document.querySelector('.mys-wrapper').remove()
        document.querySelector('.w300').remove()
    }
})();