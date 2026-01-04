// ==UserScript==
// @name         IT 之家手机版优化显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示客户端类型
// @author       You
// @match        https://m.ithome.com/html/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409097/IT%20%E4%B9%8B%E5%AE%B6%E6%89%8B%E6%9C%BA%E7%89%88%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/409097/IT%20%E4%B9%8B%E5%AE%B6%E6%89%8B%E6%9C%BA%E7%89%88%E4%BC%98%E5%8C%96%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let inter = setInterval(function(user_data) {
        for(let idx = 0; idx < user_data.length; ++idx) {
            let mobile_span = user_data[idx].getElementsByTagName("span")[1];
            let mobile_name = mobile_span.className;
            mobile_span.getElementsByTagName("a")[0].innerText = mobile_name;
        }
    }, 500, document.getElementsByClassName("user-mes "));
})();