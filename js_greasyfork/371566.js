// ==UserScript==
// @name         Chase Bank Selectable Printing
// @name:zh-CN   摩根大通银行账单文字可选择可搜索
// @namespace    gqqnbig.me
// @version      0.1
// @description  Allow to print Chase Bank statements where the text is searchable and selectable.
// @description:zh-CN  在摩根大通网上银行打印的账单里面的文字本来是不可选择不可搜索的，十分不方便。本脚本去除了此限制。
// @author       gqqnbig
// @match        https://*.chase.com/web/auth/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371566/Chase%20Bank%20Selectable%20Printing.user.js
// @updateURL https://update.greasyfork.org/scripts/371566/Chase%20Bank%20Selectable%20Printing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let count=0;
    let handle = setInterval(()=>
    {
        let containers= $(".overview-activity-container").filter(function(){
            return $(this).closest("#pendingActivityContainerdashboardEtdActivity").length===0;
        });

        containers.removeClass("print-hide");

        if(containers.length >0 || count===10)
            clearInterval(handle);

        count++;
    },1000);

})();