// ==UserScript==
// @name         酸奶注册自动填
// @namespace    酸奶注册自动填
// @version      5.2.0
// @description  酸奶注册自动填，需手动点一下注册。
// @match        https://shynia.com/auth/register
// @match        https://shynia.cc/auth/register
// @author       情续
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/460733/%E9%85%B8%E5%A5%B6%E6%B3%A8%E5%86%8C%E8%87%AA%E5%8A%A8%E5%A1%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/460733/%E9%85%B8%E5%A5%B6%E6%B3%A8%E5%86%8C%E8%87%AA%E5%8A%A8%E5%A1%AB.meta.js
// ==/UserScript==

(function() {
   function zhuce(){
       document.getElementById("name").value = "情续";
       document.getElementById("passwd").value = "12345678";
       document.getElementById("repasswd").value = "12345678";
       document.getElementById("email").value = Math.floor(Math.random() * (1 - 999999999)) + 999999999;
       document.getElementById("agree").checked=true;
       document.getElementById("register_submit").click();

   }
   zhuce();

})();