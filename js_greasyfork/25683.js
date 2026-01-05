// ==UserScript==
// @name         Keygen.nl skipper
// @namespace    https://greasyfork.org/en/users/2329-killerbadger
// @version      0.1
// @description  removes timer from keygen download page
// @author       You
// @match        http://keygens.nl/crack/*
// @match        http://keygens.co/crack/*
// @match        http://keygens.pro/crack/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25683/Keygennl%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/25683/Keygennl%20skipper.meta.js
// ==/UserScript==

window.onload = function() {skipTimer();};

skipTimer();
//alert("ran outside");
//simulated click - doesn't work
//document.getElementsByClassName("keygen-download-button")[0].click();


function skipTimer() {
    var timer = document.getElementById('timer');
    clearInterval(interval);
    timer.removeAttribute('disabled');
    window.scroll(0,findPos(timer)); // horizontal and vertical scroll targets
}

//Finds y value of given object
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj == obj.offsetParent);
    return [curtop];
    }
}

/* Original code from page
<script>
window.onload = function () {
  var timer = document.getElementById('timer');
  var seconds = timer.getAttribute('t') || 15;
  var first_value = timer.value;
  timer.setAttribute('disabled', 'disabled');
  interval = setInterval(function () {
    if (seconds == 0) {
      clearInterval(interval);
      timer.value = first_value;
      timer.removeAttribute('disabled');
      return;
    }
    var second_text = seconds > 1 ? 'seconds' : 'second';
    timer.value = 'Preparing keygen download...' + seconds + ' ' + second_text + ' left.';
    seconds--;
  }, 1000)
}
</script>
*/