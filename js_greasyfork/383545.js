// ==UserScript==
// @name         巴哈姆特首頁 - 登入自動簽到 v1.0
// @namespace    https://www.facebook.com/airlife917339
// @version      1.0
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        https://www.gamer.com.tw/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383545/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E9%A6%96%E9%A0%81%20-%20%E7%99%BB%E5%85%A5%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/383545/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E9%A6%96%E9%A0%81%20-%20%E7%99%BB%E5%85%A5%E8%87%AA%E5%8B%95%E7%B0%BD%E5%88%B0%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var s_sign = document.getElementById("signin-btn").text;
    var s_msg = 'check_box每日簽到已達成';
    if(s_sign !== s_msg) {
        Signin.start(this);
    } else {
        console.log('已簽到!');
    }
})();