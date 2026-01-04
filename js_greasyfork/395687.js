// ==UserScript==
// @name        Saaristolotto
// @namespace   Saaristolotto
// @description Automatic lottery machine
// @match       http://mysterium.torppari.org/caches/GC2D1K0/lottery.php
// @grant       none
// @version     1.0
// @author      -
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/395687/Saaristolotto.user.js
// @updateURL https://update.greasyfork.org/scripts/395687/Saaristolotto.meta.js
// ==/UserScript==
while(check_count<7) {
  var i = 1+Math.floor(Math.random() * 38);
  var val = document.getElementById('S'+i);
  x = document.forms[0].elements[i-1];
  var v = x.value;
  if (v != 'X') {
   x.value = 'X';
   check_count--;
   val.style.backgroundColor = '#FFFFFF';
  } else {
   x.value = i;
   val.style.backgroundColor = '#FF0000';
   check_count++;
   if (check_count == 7)
     document.forms[0].submit();
   document.getElementById("nums").innerHTML = (7-check_count);
  }
}