// ==UserScript==
// @name         小米搶折價卷無窮迴圈
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374094/%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7%E7%84%A1%E7%AA%AE%E8%BF%B4%E5%9C%88.user.js
// @updateURL https://update.greasyfork.org/scripts/374094/%E5%B0%8F%E7%B1%B3%E6%90%B6%E6%8A%98%E5%83%B9%E5%8D%B7%E7%84%A1%E7%AA%AE%E8%BF%B4%E5%9C%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {
        $(".J_couponArea").removeAttr("disabled");
        $(".J_couponArea").click();
}
window.setInterval (checkForMoniDisplayChange, 300);
alert ={}

})();