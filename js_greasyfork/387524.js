// ==UserScript==
// @name         光大信用卡
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://xyk.cebbank.com/home/ps/ps-req-newindex.htm?req_card_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387524/%E5%85%89%E5%A4%A7%E4%BF%A1%E7%94%A8%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/387524/%E5%85%89%E5%A4%A7%E4%BF%A1%E7%94%A8%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("进入光大，开始填充数据")
    document.getElementById("cName").value='自动填充姓名 O(∩_∩)O哈哈~'
    document.getElementById('idNo').value='自动填充证件号码'

})();