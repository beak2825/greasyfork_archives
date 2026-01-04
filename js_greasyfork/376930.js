// ==UserScript==
// @name         shenghuo_alipay_bank
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       hexiaolei
// @match        https://shenghuo.alipay.com/transfercore/fill.htm*
// @grant        GM_setValue
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/376930/shenghuo_alipay_bank.user.js
// @updateURL https://update.greasyfork.org/scripts/376930/shenghuo_alipay_bank.meta.js
// ==/UserScript==

(function() {
  'use strict';
  $(function() {
    start();
  });

  function start() {
    analysisExe();
  }

  function analysisExe() {

    var banklis = $("#myContactsContainer > div > ul > li > a");
    var result = [];
    for (var i = 0; i < banklis.length; i++) {
      var item = $(banklis[i]);

      var cardid = item.attr("cardid").trimAll();
      var cardname = item.attr("cardname").trimAll();
      var cardno = item.attr("cardno").trimAll();
      var bankname = item.attr("bankname").trimAll();
      var bankshortname = item.attr("bankshortname").trimAll();

      var j = {};
      j.银行卡ID = cardid;
      j.开户名 = cardname;
      j.银行卡号 = cardno
      j.银行名称 = bankname;
      j.银行编码 = bankshortname;
      result.push(j);

      console.log(j);

    }
    exporttxt(result);

  }

  function exporttxt(store) {

    var now = new Date();
    var fileName = "shenghuo_alipay_bank_" + now.getTime();
    var a = document.createElement("a");
    a.href = "data:text," + JSON.stringify(store); //content
    a.download = fileName + ".txt"; //file name
    a.click();
  }
  // Your code here...
})();
