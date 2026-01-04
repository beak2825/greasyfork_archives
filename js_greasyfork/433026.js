// ==UserScript==
// @name         华师在线学习
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  华师在线学习-自动学习
// @author       Wellen
// @match        *://gdou.scnu.edu.cn/learnspace/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433026/%E5%8D%8E%E5%B8%88%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/433026/%E5%8D%8E%E5%B8%88%E5%9C%A8%E7%BA%BF%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function () {
        console.log('click start >>> '+ new Date());
        $('.layui-layer-btn0').click();
        console.log('click end');
    }, 60000);

})();