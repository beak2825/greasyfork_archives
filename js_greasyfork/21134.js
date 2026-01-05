// ==UserScript==
// @name         בדיקת חתימה
// @namespace    http://scripts.eithanet.co.il
// @version      1.3
// @description  בודק אם החתימה של המשתמש ארוכה
// @author       Eithanet
// @match        http://web3.ekoloko.com/memberlist.php?mode=viewprofile&u=*
// @run-at       document-body
// @grant        none
// @require       http://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21134/%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%97%D7%AA%D7%99%D7%9E%D7%94.user.js
// @updateURL https://update.greasyfork.org/scripts/21134/%D7%91%D7%93%D7%99%D7%A7%D7%AA%20%D7%97%D7%AA%D7%99%D7%9E%D7%94.meta.js
// ==/UserScript==

(function ($, undefined) {
  $(function () {
    $(document).ready(function(){
function showHeight( element, height ) {
if(601 < height) {
    var howmatch = height;
    var num = howmatch - 601;
  $(".signature").before("<b style='font-size:20px;'>החתימה של המשתמש ארוכה!</b><p>החתימה שלו ארוכה ב" + num + " פיקסלים");
} else {
    $(".signature").before("<p>החתימה של המשתמש באורך המותר</p>");
}
}
  showHeight( ".signature", $( ".signature" ).height() );
});
  });
})(window.jQuery.noConflict(true));