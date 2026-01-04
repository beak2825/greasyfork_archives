// ==UserScript==
// @name         黄大人给你评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  HBUT教务评教系统评教功能
// @author       黄大人
// @match        http://202.114.177.191/pyxx/Default.aspx
// @match        http*://202.114.177.191/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=177.191
// @grant        none
// @license      uashUH_shf
// @downloadURL https://update.greasyfork.org/scripts/446307/%E9%BB%84%E5%A4%A7%E4%BA%BA%E7%BB%99%E4%BD%A0%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/446307/%E9%BB%84%E5%A4%A7%E4%BA%BA%E7%BB%99%E4%BD%A0%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
console.log("开始");
var s_length = document.getElementsByClassName('GridViewRowStyle');
console.log(s_length.length);
var data_id = 'MainWork_dgData_drppjjg_';
for(var j=0;j<(s_length.length);j++){
    var idid = data_id+j;
    console.log(idid+'******'+j);
    var selectEle = document.getElementById(idid);
    for (var i = 0; i < selectEle.length; i++) {
        if (selectEle.options[i].text === '优秀') {
            selectEle.options[i].selected = true;
        }
    }
}

var text = document.getElementById('MainWork_txtpjyj');
text.value = "老师讲的很不错";
})();