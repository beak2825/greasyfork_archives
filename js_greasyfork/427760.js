// ==UserScript==
// @name         皖西学院MOOC平台刷课插件
// @namespace    Yangjianwen
// @author       Yangjianwen
// @match        http://211.70.163.194/course/*
// @grant        none
// @version      1.0.0
// @description  皖院MOOC平台刷课插件
// @license      MIT
// @original-author yangjianwen
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/427760/%E7%9A%96%E8%A5%BF%E5%AD%A6%E9%99%A2MOOC%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/427760/%E7%9A%96%E8%A5%BF%E5%AD%A6%E9%99%A2MOOC%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function() {
    setInterval(() => {
        document.querySelector('#learn-btn').click();
        setTimeout(()=>{
            document.querySelector('.btn-primary').click();
        },100);
    }, 5000)
})();