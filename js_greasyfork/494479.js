// ==UserScript==
// @name         GMail POP3 Checker sug
// @description  GMail POP3 Checker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       ArK38
// @match        https://mail.google.com/mail/u/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494479/GMail%20POP3%20Checker%20sug.user.js
// @updateURL https://update.greasyfork.org/scripts/494479/GMail%20POP3%20Checker%20sug.meta.js
// ==/UserScript==

let result = function() {
   'use strict';
  if (/#settings\/accounts/.test(location.hash)) {
    var iid = setInterval(function () {
      // 日本語と英語に対応
      (document.evaluate('//*[@role="link" and .="メールを今すぐ確認する"]', document).iterateNext() || document.evaluate('//*[@role="link" and .="Check mail now"]', document).iterateNext()).click();
      location.hash = "#inbox";
      clearInterval(iid);
    }, 1000);
  }
  setTimeout(result, 1000*60*2);//2分
};
result();