// ==UserScript==
// @name         Check IN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include        http://www.aibjx.biz/plugin.php?id=dsu_paulsign:sign
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394598/Check%20IN.user.js
// @updateURL https://update.greasyfork.org/scripts/394598/Check%20IN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function(){document.getElementById("yl").click()},4000);
    function qd(){var btns = document.getElementsByTagName("input");
  for (var n = 0; n < btns.length; n ++) {
    if (btns[n].className == "btn") {
      btns[n].click();
    }
  }
              }
   setTimeout(qd,5000)
})();