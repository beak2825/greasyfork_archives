// ==UserScript==
// @name         YidaiUInvestMoneyHelper
// @namespace    https://greasyfork.org/en/scripts/19888-yidaiuinvestmoneyhelper
// @version      0.2
// @description  计算回款日期的余额
// @author       Jarod Liu<liuyuanzhi@gmail.com>
// @match        http://www.yidai.com/uinvestmoney/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19888/YidaiUInvestMoneyHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/19888/YidaiUInvestMoneyHelper.meta.js
// ==/UserScript==

function getCurrentBalence() {
    var deferred = $.Deferred();
    $.get('http://www.yidai.com/', function(html) {
        var b = parseFloat($('.user-login-info span', html).text());
        deferred.resolveWith(html, [b]);
    }, 'html');
    return deferred.promise();
}

function calCurrentPageBalence(total) {
    var vals = $('.uc-tables tr td:nth-child(3)').map(function(index,it){
        return parseFloat($(it).text());
    });
    $('.uc-tables tr').each(function(index,row){
        if (index===0) {
            $(row).prepend('<th>余额</th>');
            return;
        }
        total+=vals[index-1];
        $(row).prepend('<td>' + total.toFixed(2) + '</td>');
    });
}

getCurrentBalence().done(calCurrentPageBalence);