
// ==UserScript==
// @name        UnNag: Inoreader.com
// @namespace   pwa
// @license MIT
// @match       https://www.inoreader.com/*
// @icon https://inoreader.com/favicon.ico
// @grant       none
// @version     1.2
// @author      pwa
// @description 7/6/2022, 4:54:57 PM

// @downloadURL https://update.greasyfork.org/scripts/461858/UnNag%3A%20Inoreadercom.user.js
// @updateURL https://update.greasyfork.org/scripts/461858/UnNag%3A%20Inoreadercom.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

/*
<script>$(function(){ setTimeout(function(){ show_kickstart_hint('3', '0,99 €', '8,99 €');},1000); });</script>
*/

// called onload:
function removeSpam() {
  document.getElementById("kickstart_hint_dialog_wrapper").hidden = true;
  document.getElementById("tree_announce").hidden = true;
  
  {
    elt = document.getElementById("kickstart_hint_dialog_wrapper");
    if (elt) {
      elt.hidden = true;
      console.log("[BLOCK] 'kickstart_hint_dialog_wrapper'")
    }
  }

  {
    let elt = document.getElementById("tree_announce")
    if (elt) {
      ta.hidden = true;
      console.log("[BLOCK] 'tree_announce'")
    }
  }

  if (typeof close_black_friday_banner === "function") {
    console.log("[BLOCK] 'calling 'close_black_friday_banner'")
    close_black_friday_banner();
  }
}



var observer = new MutationObserver(resetTimer);
var timeout_ms = 100
var timer = setTimeout(action, timeout_ms, observer);
observer.observe(document, {childList: true, subtree: true});


// reset timer every time something changes
function resetTimer(changes, observer) {
    clearTimeout(timer);
    timer = setTimeout(action, timeout_ms, observer);
}

function clear_all_timeouts()
{
  var highestTimeoutId = setTimeout(";");
  for (var i = 0 ; i < highestTimeoutId ; i++) {
    clearTimeout(i);
  }
}

function action(observer)
{
  clearTimeout(timer);
  try {
    clear_all_timeouts()

    observer.disconnect();
    console.log("[BLOCK]: timeouts removed")
    removeSpam();
  } catch (err) {
    console.log("PWA: page has not loaded");
  }
}


window.onload = () => {
  removeSpam();
}


