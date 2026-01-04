// ==UserScript==
// @name         Pukiwiki NewPage
// @description  Pukiwikiの新しい日記を作る
// @match        https://www.icd.cs.tut.ac.jp/pukiwiki/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version 0.0.1.20190402091938
// @namespace https://greasyfork.org/users/167332
// @downloadURL https://update.greasyfork.org/scripts/381273/Pukiwiki%20NewPage.user.js
// @updateURL https://update.greasyfork.org/scripts/381273/Pukiwiki%20NewPage.meta.js
// ==/UserScript==

(function () {
  document.addEventListener('keydown', function (e) {
    // pressed alt + N
    if (e.keyCode == 78 && !e.shiftKey && !e.ctrlKey && e.altKey && !e.metaKey) {
      var today = new Date();
      var today_str = today.getFullYear() + "-" + ("0"+(today.getMonth() + 1)).slice(-2) + "-" + ("0"+(today.getDate())).slice(-2);
      var new_page = "https://www.icd.cs.tut.ac.jp/pukiwiki/?cmd=edit&page=%C0%BE%CF%C6%CD%B5%BA%EE/Daily%20Progress/" + today_str + "&refer=%C0%BE%CF%C6%CD%B5%BA%EE%2FDaily%20Progress"
      window.location = new_page;
    }
  }, false);
}) ();
