// ==UserScript==
// @name         Fork Helper
// @namespace    https://greasyfork.org/en/users/197274-m-c-krish
// @version      3.4
// @description  turky, forky and Panda Helper
// @author       M C KRISH
// @match        https://worker.mturk.com/?finder_beta
// @include      https://worker.mturk.com/?hit_forker
// @downloadURL https://update.greasyfork.org/scripts/376279/Fork%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/376279/Fork%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
setInterval(
  function() {
var checkClick = document.getElementById("clickhit");
if(checkClick != null) {
          document.getElementById("clickhit").click();
          document.getElementById('clickhit').onclick = function() {
          document.getElementById("clickhit").removeAttribute("id");
      }
}

}, 500);
$('#menubar, #scan_button, #latest_hits, #logged_hits').hide();
    // Your code here...
})();