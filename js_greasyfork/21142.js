// ==UserScript==
// @name         קיצור חתימה אוטומתי
// @namespace    http://scripts.eithanet.co.il
// @version      1.0
// @description  מקצר את החתימות בפורום
// @author       Eithanet
// @match        http://web3.ekoloko.com/viewtopic.php?f=*&t=*
// @run-at       document-body
// @grant        none
// @require       http://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21142/%D7%A7%D7%99%D7%A6%D7%95%D7%A8%20%D7%97%D7%AA%D7%99%D7%9E%D7%94%20%D7%90%D7%95%D7%98%D7%95%D7%9E%D7%AA%D7%99.user.js
// @updateURL https://update.greasyfork.org/scripts/21142/%D7%A7%D7%99%D7%A6%D7%95%D7%A8%20%D7%97%D7%AA%D7%99%D7%9E%D7%94%20%D7%90%D7%95%D7%98%D7%95%D7%9E%D7%AA%D7%99.meta.js
// ==/UserScript==

(function ($, undefined) {
  $(function () {
    $(document).ready(function(){
 $(".signature").css("max-height", "600px");
               $(".signature").css("overflow-y", "hidden");
});
  });
})(window.jQuery.noConflict(true));
