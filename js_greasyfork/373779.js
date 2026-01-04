// ==UserScript==
// @name        opinionworld で自動ログイン
// @namespace   opinionworld-autologin
// @include     https://www.opinionworld.jp/ja-jp
// @description 使用する前にメールアドレスとパスワードを設定してください
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373779/opinionworld%20%E3%81%A7%E8%87%AA%E5%8B%95%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/373779/opinionworld%20%E3%81%A7%E8%87%AA%E5%8B%95%E3%83%AD%E3%82%B0%E3%82%A4%E3%83%B3.meta.js
// ==/UserScript==
window.onload = function() {
document.getElementById("JanRainSocialBtn").click();
document.getElementById("apsusername").value = "ここにメールアドレスを入力";
document.getElementById("apspassword").value = "ここにパスワードを入力";
setTimeout(function(){document.getElementById("apslogin").click()}, 800);
}