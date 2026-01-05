// ==UserScript==
// @name         אקורוישפר היה כאן
// @namespace    http://scripts.eithanet.co.il
// @version      1.0
// @description  אקורוישפר אוהב אותכם
// @author       Eithanet
// @match        http://web3.ekoloko.com/*
// @run-at       document-body
// @grant        none
// @require       http://cdn.jsdelivr.net/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21571/%D7%90%D7%A7%D7%95%D7%A8%D7%95%D7%99%D7%A9%D7%A4%D7%A8%20%D7%94%D7%99%D7%94%20%D7%9B%D7%90%D7%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/21571/%D7%90%D7%A7%D7%95%D7%A8%D7%95%D7%99%D7%A9%D7%A4%D7%A8%20%D7%94%D7%99%D7%94%20%D7%9B%D7%90%D7%9F.meta.js
// ==/UserScript==

(function ($, undefined) {
  $(function () {
    $(document).ready(function(){
        $(".signature").html("<b>אקורוישפר היה כאן אחים שלי</b>");
});
  });
})(window.jQuery.noConflict(true));
