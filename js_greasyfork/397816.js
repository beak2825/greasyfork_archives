// ==UserScript==
// @name         超星作答区域增大
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  默认区域太小了，增大亿点
// @author       Stood
// @match        *://mooc1-2.chaoxing.com/work/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397816/%E8%B6%85%E6%98%9F%E4%BD%9C%E7%AD%94%E5%8C%BA%E5%9F%9F%E5%A2%9E%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/397816/%E8%B6%85%E6%98%9F%E4%BD%9C%E7%AD%94%E5%8C%BA%E5%9F%9F%E5%A2%9E%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function () {
        document.getElementById('edui1_iframeholder').style.height='900px'
    }, 1500);
})();