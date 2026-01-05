// ==UserScript==
// @name       nijie auto login 
// @namespace  
// @version    0.1
// @description  nijieのログイン画面に行くと、自動でメールとパスワードを入力してログインします。
// @include  http://nijie.info/login.php*
// @include  https://nijie.info/login.php*
// @copyright  2014+, qa2
// @downloadURL https://update.greasyfork.org/scripts/4989/nijie%20auto%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/4989/nijie%20auto%20login.meta.js
// ==/UserScript==

//アカウント情報
var mail = "メールアドレス";
var pass = "パスワード";

$(function() {
  $("#login_box").attr("display", "block");
  $("input[name=email]").val(mail);
  $("input[name=password]").val(pass);
  $(".login_button").click();
});
