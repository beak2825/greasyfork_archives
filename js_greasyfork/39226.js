// ==UserScript==
// @name         计算补仓总份数
// @namespace    https://qieman.com/
// @version      0.1.1
// @description  添加补仓总份数信息
// @author       Zed
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match        https://*.qieman.com/longwin/cover-advice
// @downloadURL https://update.greasyfork.org/scripts/39226/%E8%AE%A1%E7%AE%97%E8%A1%A5%E4%BB%93%E6%80%BB%E4%BB%BD%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/39226/%E8%AE%A1%E7%AE%97%E8%A1%A5%E4%BB%93%E6%80%BB%E4%BB%BD%E6%95%B0.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var done = null;
    var calculate = function() {
        var sum=0;
        if($('.plan-cover-advice__table').length) {
            $('.plan-cover-advice__table tbody tr td:last-child')
                .not('.advice-table__header')
                .each(function(index,el){ sum += Number($(el).text()); });
            $('.plan-cover-advice__table tbody').append("<tr><td colSpan=4>总计</td><td>" + sum + "</td></tr>");
            clearInterval(done);
        }

    };
    $(document).ready(function() {
        done = setInterval(calculate, 100);
    });
})();