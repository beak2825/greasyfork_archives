// ==UserScript==
// @name         南大财务
// @namespace    https://www.yaoge123.com/blog/ndcw
// @version      0.2
// @description  从https://www.yaoge123.com/blog/ndcw复制的脚本
// @author       作者要求匿名
// @match        http://ndcw.nju.edu.cn:81/wsyy/MODULES/GWK/GWK_BZHK.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30151/%E5%8D%97%E5%A4%A7%E8%B4%A2%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/30151/%E5%8D%97%E5%A4%A7%E8%B4%A2%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var form = document.forms[0],
        empId = form.ctl00_ContentPlaceHolder1_TB_YGBH,
        empIdChange = empId.onchange,
        date0 = form.ctl00$ContentPlaceHolder1$TB_XFRQ_KS,
        date1 = form.ctl00$ContentPlaceHolder1$TB_XFRQ_JS;
    if (localStorage.empId) {
        empId.value = localStorage.empId;
        empIdChange();
    }
    if (localStorage.date0) {
        date0.value = localStorage.date0;
    }
    if (localStorage.date1) {
        date1.value = localStorage.date1;
    }
    form.onsubmit = function() {
        localStorage.empId = form.ctl00_ContentPlaceHolder1_TB_YGBH.value;
        localStorage.date0 = form.ctl00$ContentPlaceHolder1$TB_XFRQ_KS.value;
        localStorage.date1 = form.ctl00$ContentPlaceHolder1$TB_XFRQ_JS.value;
    };
})();
