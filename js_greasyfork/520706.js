// ==UserScript==
// @name         屏蔽百度首页推荐流+不跳转新标签
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  屏蔽百度个人首页新出的推荐流+不跳转新标签
// @author       virgosnow(屏蔽百度个人首页新出的推荐流)-paul_guo(不跳转新标签)
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520706/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E6%B5%81%2B%E4%B8%8D%E8%B7%B3%E8%BD%AC%E6%96%B0%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/520706/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E6%8E%A8%E8%8D%90%E6%B5%81%2B%E4%B8%8D%E8%B7%B3%E8%BD%AC%E6%96%B0%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 首先点击"我的关注"
    setTimeout(function(){
        document.getElementById("s_menu_mine").click();
        // 点击后等待100ms,然后执行屏蔽操作
        setTimeout(function() {
            // 移除target属性
            var ahrefs = document.querySelectorAll('a[target]');
            for (var a_ind = 0; a_ind < ahrefs.length; a_ind++) {
                var a = ahrefs[a_ind];
                a.removeAttribute('target');
            }
        }, 100);
    }, 50);
})();