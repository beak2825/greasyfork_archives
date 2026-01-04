// ==UserScript==
// @name           EasyNav syosetu
// @namespace      EasyNav syosetu
// @description    Enable Next and Prev Chapter by Pressing Right and Left Arrow key on syosetu
// @author         Flwk
// @version        1.0
// @icon           https://lh3.googleusercontent.com/-4QLkHOG36Kg/V4tpMr0smAI/AAAAAAAADg0/E11MxOtFmzEfqCDjk8_L6pMQ17_01HWSACCo/s800/left-and-right-arrow-icon-29.png
// @include        https://ncode.syosetu.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant          none
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/423960/EasyNav%20syosetu.user.js
// @updateURL https://update.greasyfork.org/scripts/423960/EasyNav%20syosetu.meta.js
// ==/UserScript==
(function() {
  var PrevLink = $("a:contains('<<')");
  var NextLink = $("a:contains('>>')");


  document.addEventListener('keydown', function(e) {
    // pressed Right Arrow
    if (e.keyCode == 39 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      window.location = NextLink[0].href;
    }
    // pressed Left Arrow
    if (e.keyCode == 37 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      window.location = PrevLink[0].href;
    }
  }, false);
})();