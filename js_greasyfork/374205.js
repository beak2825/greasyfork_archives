// ==UserScript==
// @name         小米搶11特價物
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Hello world!
// @author       H
// @match        https://event.mi.com/tw/sales2018/super-sales-day
// @include      https://event.mi.com/tw/sales2018/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/374205/%E5%B0%8F%E7%B1%B3%E6%90%B611%E7%89%B9%E5%83%B9%E7%89%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/374205/%E5%B0%8F%E7%B1%B3%E6%90%B611%E7%89%B9%E5%83%B9%E7%89%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkForMoniDisplayChange () {

        $(".J_flashBuyBtn[data-gid=4170700013]").removeAttr("disabled").click();;
        $(".J_flashBuyBtn[data-gid=4181600032]").removeAttr("disabled").click();;
}

window.setInterval (checkForMoniDisplayChange, 10);
alert ={}

})();