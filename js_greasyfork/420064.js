// ==UserScript==
    // @name         小韦博客测试
    // @namespace    http://blog.alipay168.cn/
    // @version      0.0.2
    // @description  博客信息查询
    // @author       火星种水稻
    // @match        http://blog.alipay168.cn/
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420064/%E5%B0%8F%E9%9F%A6%E5%8D%9A%E5%AE%A2%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/420064/%E5%B0%8F%E9%9F%A6%E5%8D%9A%E5%AE%A2%E6%B5%8B%E8%AF%95.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // Your code here...
        function test(){
            var body=  document.getElementById('header-navbar');
            body.innerHtml = '你好，哈哈哈';
        }
        test();


    })();