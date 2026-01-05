// ==UserScript==
// @name        YouTube Dozenator part 1
// @namespace   none
// @description Dozenates Youtube
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23330/YouTube%20Dozenator%20part%201.user.js
// @updateURL https://update.greasyfork.org/scripts/23330/YouTube%20Dozenator%20part%201.meta.js
// ==/UserScript==
function convertInt(number){
            var c = "";
            if (number < 0)
            {
                c = "-";
                number = -1 * number;
            }
            else
            {
                c = "";
            }
            var target_base = 12;
            var symbols = new Array("0","1","2","3","4","5","6","7","8","9","X","E");
            var n = target_base;
            var q = number;
            var r;
            var rtn = "";

            while (q >= n)
            {

                r = q % n;
                q = Math.floor(q / n);

                rtn = symbols[r] + rtn;

            }
            rtn = symbols[q] + rtn;

            return c + rtn;
}
var a = document.getElementsByClassName("yt-lockup-meta-info");
for(var i = 0; i < a.length; i++){
  var b = a[i].firstElementChild;
  var c = b.textContent.replace(" views","").replace(/,/g,"");
  var d = convertInt(parseInt(c)) + " views";
  b.textContent = d;
}
var a = document.getElementsByClassName("yt-subscription-button-subscriber-count-branded-horizontal yt-subscriber-count");
for(var i = 0; i < a.length; i++){
  var b = a[i];
  var c = b.textContent.replace(/,/g,"");
  var d = convertInt(parseInt(c));
  b.textContent = d;
}