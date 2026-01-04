// ==UserScript==
// @name         六职快速教学评价
// @namespace    https://wyq.icu/
// @version      0.0.1
// @description  六安职业技术学院教务系统快速评教
// @author       You
// @match        http://jwgl.lvtc.edu.cn//jxkp/Stu_WSKP_pj.aspx?*
// @icon         https://www.lvtc.edu.cn/_upload/tpl/00/01/1/template1/images/logo-blue_06.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483665/%E5%85%AD%E8%81%8C%E5%BF%AB%E9%80%9F%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/483665/%E5%85%AD%E8%81%8C%E5%BF%AB%E9%80%9F%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isSubmit = false; // 如果需要自动提交请将此处改成true
    var list = document.querySelectorAll('input[djdm="01"]');
    for (var i = 0; i < list.length; i++) {
        list[i].click();
    }
    if(isSubmit){
       //document.querySelector("body > form > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(49) > td > input:nth-child(2)").click();
    }
})();