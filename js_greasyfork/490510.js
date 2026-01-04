// ==UserScript==
// @name         cesium官方文档，不该翻译的别翻译
// @namespace    http://tampermonkey.net/
// @version      2024.4.0
// @description  cesium官网是英文的，浏览器自带的翻译会翻译不该翻译的单词，比如代码、类名、方法名，通过此脚本，过滤不需要翻译的元素
// @author       GreenBoy0526
// @match        https://cesium.com/learn/cesiumjs/ref-doc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cesium.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490510/cesium%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%EF%BC%8C%E4%B8%8D%E8%AF%A5%E7%BF%BB%E8%AF%91%E7%9A%84%E5%88%AB%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/490510/cesium%E5%AE%98%E6%96%B9%E6%96%87%E6%A1%A3%EF%BC%8C%E4%B8%8D%E8%AF%A5%E7%BF%BB%E8%AF%91%E7%9A%84%E5%88%AB%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selectors=['title','.nameContainer .name','.page-title','.props .type','.params .type','#ClassList','h5','.see-list']

    selectors.forEach(selector=>{
        let els=document.querySelectorAll(selector)
        els.forEach(item=>item.setAttribute('translate','no'))
    })
})();