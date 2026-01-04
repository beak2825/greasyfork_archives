// ==UserScript==
// @name         新视野英语在线刷新脚本
// @namespace    https://wx2020.cn/
// @version      1.0
// @description  try to take over the world!
// @author       wx2020
// @match        http://210.44.112.108/login/hponlinetime.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40648/%E6%96%B0%E8%A7%86%E9%87%8E%E8%8B%B1%E8%AF%AD%E5%9C%A8%E7%BA%BF%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/40648/%E6%96%B0%E8%A7%86%E9%87%8E%E8%8B%B1%E8%AF%AD%E5%9C%A8%E7%BA%BF%E5%88%B7%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function myrefresh()
    {
        window.location.reload();
    }
    setTimeout(myrefresh,Math.round(Math.random())*30000); //指定30秒内刷新一次
})();