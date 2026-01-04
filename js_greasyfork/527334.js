// ==UserScript==
// @name         change PLOS font-size
// @name:zh-CN   让change PLOS font-size
// @name:en      Make change PLOS font-size
// @description  For Google Translate, you can customize and specify tags and keywords without translating
// @author       @amormaid
// @run-at       document-end
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description:zh-cn 针对谷歌翻译，可以自定义指定标签、关键词不翻译
// @description:en  For Google Translate, you can customize and specify tags and keywords without translating
// @match        *://*.plos.org/*
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527334/change%20PLOS%20font-size.user.js
// @updateURL https://update.greasyfork.org/scripts/527334/change%20PLOS%20font-size.meta.js
// ==/UserScript==




(function () {
'use strict'

const css = 'p { font-size: 16px; line-height: 20px; }'

const head = document.head || document.getElementsByTagName('head')[0]
const style = document.createElement('style');

head.appendChild(style);

style.type = 'text/css';
style.appendChild(document.createTextNode(css));



})();