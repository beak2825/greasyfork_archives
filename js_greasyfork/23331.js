// ==UserScript==
// @name        Youtube Dozenator part 2
// @namespace   none
// @description:en Dozenates Youtube
// @include     https://www.youtube.com/watch*
// @version     1
// @grant       none
// @description Dozenates Youtube
// @downloadURL https://update.greasyfork.org/scripts/23331/Youtube%20Dozenator%20part%202.user.js
// @updateURL https://update.greasyfork.org/scripts/23331/Youtube%20Dozenator%20part%202.meta.js
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
var a = document.getElementsByClassName("watch-view-count");
var b = a[0];
var c = b.textContent.replace(" views","").replace(/,/g,"");
var d = convertInt(parseInt(c)) + " views";
b.textContent = d;
var a = document.getElementsByClassName("stat view-count");
for(var i = 0; i < a.length; i++){
  var b = a[i];
  var c = b.textContent.replace(" views","").replace(/,/g,"");
  var d = convertInt(parseInt(c)) + " views";
  b.textContent = d;
}
var a = document.getElementsByClassName("yt-uix-button-content");
for(var i = 0; i < a.length; i++){
  var b = a[i];
  var c = b.textContent.replace(/,/g,"");
  if(!isNaN(parseInt(c))){
     var d = convertInt(parseInt(c));
     b.textContent = d;   
  }
}