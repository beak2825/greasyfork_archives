// ==UserScript==
// @name         אנטר לשליחה
// @namespace    http://scripts.eithanet.co.il
// @version      1.1
// @description  שלוחצים אנטר זה שולח
// @author       Eithanet
// @match        http://web3.ekoloko.com/posting.php?mode=*&f=823&*
// @run-at       document-body
// @grant        none
// @require       http://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21570/%D7%90%D7%A0%D7%98%D7%A8%20%D7%9C%D7%A9%D7%9C%D7%99%D7%97%D7%94.user.js
// @updateURL https://update.greasyfork.org/scripts/21570/%D7%90%D7%A0%D7%98%D7%A8%20%D7%9C%D7%A9%D7%9C%D7%99%D7%97%D7%94.meta.js
// ==/UserScript==

$(document).ready(function() {
   $('#message').keydown(function(event) {
    if (event.keyCode == 13) {
         document.getElementsByName("post")[0].setAttribute("id", "post");
    document.getElementById("post").click();
    }
});
});