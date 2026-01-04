// ==UserScript==
// @name         可转债优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  simplify the data of kzz from eastmoney
// @author       kinsonyang
// @match        https://data.eastmoney.com/xg/xg/?mkt=kzz
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://code.jquery.com/jquery-3.6.0.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459463/%E5%8F%AF%E8%BD%AC%E5%80%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459463/%E5%8F%AF%E8%BD%AC%E5%80%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var today = (new Date().getMonth() + 1) * 100 + new Date().getDate();
    console.log(today);
    var timer = setInterval( function(){
        var data = $('tbody').text();
        if (data) {
            $('body>div:first').hide();
            $('div.footFrame').hide();
            $('tbody>tr').each(function(){
                var marketTime = $(this).children().last().prev().text();
                console.log(marketTime);
                var dataDate = getDataDate(marketTime, today);

                if(dataDate < today || (dataDate > today + 600 && dataDate != 1300)) {
                    $(this).hide();
                }
            });
            clearInterval(timer);


        }
    },100);

    function getDataDate(date, today) {
        if(!date || date == '-') {
            return 1300;
        }
        return parseInt(date.replace("-", ""));
    }

})();