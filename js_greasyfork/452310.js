// ==UserScript==
// @name         隐藏智慧校园防诈骗弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  直接隐藏重庆电子工程职业学院智慧校园的防诈骗弹窗
// @author       fightingHawk
// @match        https://sso.cqcet.edu.cn/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452310/%E9%9A%90%E8%97%8F%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD%E9%98%B2%E8%AF%88%E9%AA%97%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/452310/%E9%9A%90%E8%97%8F%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD%E9%98%B2%E8%AF%88%E9%AA%97%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 每隔1ms执行一次关闭弹窗，懒得考虑其他问题，能关闭就行了
    setInterval(function() {
        layer.close(layer.index)
    },1)


    
})();