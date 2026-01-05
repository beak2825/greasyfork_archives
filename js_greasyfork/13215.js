// ==UserScript==
// @name        adfiver.com - Main
// @namespace   *
// @description adfiver.com- Main  - choose link and open
// @include     *adfiver.com/viewads.php*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13215/adfivercom%20-%20Main.user.js
// @updateURL https://update.greasyfork.org/scripts/13215/adfivercom%20-%20Main.meta.js
// ==/UserScript==
function doText() {
  //if (stopIt!=0) break;
  var inputs = document.getElementsByTagName('input');
  var j = 0;
  for (var i = 0; i < inputs.length; i++)
  {
    if ((inputs[i].getAttribute('class') == 'input-title fixed-bg' 
         || inputs[i].getAttribute('class') == 'input-title sticky-bg' 
         
         )&& inputs[i].getAttribute('style') == '')
    {
      inputs[i].click();
    }
  }
}
var myInterval = setInterval(doText, 10000);
//alert('a');
