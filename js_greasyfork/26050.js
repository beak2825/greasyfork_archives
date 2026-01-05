// ==UserScript==
// @name           BVS Scratchy Helper
// @namespace      kaz
// @description    Makes obtaining a Claymore ergonomic!
// @include        http://www.animecubed.com/billy/bvs/partyhouse.html
// @version        0.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/26050/BVS%20Scratchy%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/26050/BVS%20Scratchy%20Helper.meta.js
// ==/UserScript==

// This script requires that you are S2+ Legacy to work!
// Hotkeys: d - take action

function clickSuperBilly() {
   var images = Array.prototype.slice.apply(document.getElementsByTagName('img'));
   var length = images.length;
   for(var i = 0; i < length; ++i) {
      if(images[i].src == "http://www.animecubed.com/billy/layout/scratchJackpotX.jpg") {
        images[i].onclick();
        return;
      }
   }
}

function clickRandomSpots() {
  var randomSpots = document.querySelectorAll("a[href^='javascript:quickcheck']")[0].href.substring(21).replace(/%20|\(|\)|;|'/g,"").split(',');
  quickcheck(randomSpots[0], randomSpots[1], randomSpots[2]);
}

function processEvent(event) {
  var input = event.keyCode;
  var supupd = null;
  if (input == 68) {
    var supupd = document.getElementById("supupd");
    if (supupd != null) {
      supupd.checked = true;
      document.scratch.submit();
    } else {
      clickRandomSpots();
      clickSuperBilly();
      document.mainform2.submit();
    }
  }
}

window.addEventListener("keyup", processEvent, false);
