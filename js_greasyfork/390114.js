// ==UserScript==
// @name            auto sakurafile
// @name:ja         Sakurafile自動スクリプト
// @namespace       https://9ketsuki.info
// @version         1.*
// @description     none
// @description:ja  sakurafileCAPTCHA自動
// @author          9ketsuki
// @match           *://sakurafile.com/*
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/390114/auto%20sakurafile.user.js
// @updateURL https://update.greasyfork.org/scripts/390114/auto%20sakurafile.meta.js
// ==/UserScript==
(function () {
  'use strict';
  if ($(".error_message").length !== 0 || $(".err").length !== 0) {} else if (typeof $('#dlink').attr("href") !== "undefined") {
    location.href = $('#dlink').attr("href");
  } else if ($('[name="op"]').val() === "download2") {
    var arr = [];
    pass = "";
    var index = 0;
    var elems = $("td[align='right']>div>span");
    $(elems).each(function (i, e) {
      var int = $(e).css("padding-left").replace(/px/g, "")
      arr.push(parseInt(int))
    })
    arr = arr.sort(function (a, b) {
      return (a < b ? -1 : 1);
    });
    while (pass.length != 4) {
      $(elems).each(function (i, e) {
        if ($(e).css("padding-left").replace(/px/g, "") == arr[index]) {
          pass += $(e).text()
          index++;
        }
      })
    }
    $(".captcha_code").val(pass);
    setInterval(function () {
      if ($('.seconds').text() <= 1) $('form').submit();
    }, 1000);
  } else if ($('[name="op"]').val() === "download1") {
    $('[name=method_free]').click();
  }
})();