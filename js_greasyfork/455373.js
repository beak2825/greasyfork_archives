// ==UserScript==
// @name         feastogether
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  饗賓餐廳訂位
// @author       You
// @match        https://www.feastogether.com.tw/booking/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feastogether.com.tw
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455373/feastogether.user.js
// @updateURL https://update.greasyfork.org/scripts/455373/feastogether.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#peopleNums').val(4); // 人數
    $('#townShip').val('台北市'); // 地點
    $('#date').val('2022-12-25'); // 日期
    $('#mealTime').val('午餐');   // 時段
    $('#time').val('2022-12-25'); // 日期
    $('#store').val('微風店');    // 分店
    $('#timeMobile').val('');
    $('#storeMobile').val('');
    $('[name="booking_form"]').submit();
})();