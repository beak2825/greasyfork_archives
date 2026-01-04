// ==UserScript==
// @name         5ch login nofity
// @version      0.9
// @description  5ch で 未ログイン状態を強調する
// @author       scri P
// @grant        none
// @match        https://*.5ch.net/test/read.cgi/*
// @namespace https://greasyfork.org/users/385753
// @downloadURL https://update.greasyfork.org/scripts/394435/5ch%20login%20nofity.user.js
// @updateURL https://update.greasyfork.org/scripts/394435/5ch%20login%20nofity.meta.js
// ==/UserScript==

(function() {
  let isLogin = false;
  if ($('.search-login span').text().indexOf("ログアウト") != -1)
    isLogin = true;

  if (isLogin)
    $('input[name="FROM"]').val("!id:none");
  else
    $('input[name="FROM"]').css("background-color", "#e5aba4");

  $('input[name="mail"]').val("sage");

})();