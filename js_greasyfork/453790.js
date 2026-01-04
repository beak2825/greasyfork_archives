// ==UserScript==
// @name        Results in Megabytes - librespeed.org
// @namespace   librespeed-to-bytes
// @match       https://librespeed.org/
// @grant       none
// @version     1.15
// @author      Gum Coblin
// @license MIT
// @description Automatically convert librespeed.org results to display MB/s instead of Megabit
// @downloadURL https://update.greasyfork.org/scripts/453790/Results%20in%20Megabytes%20-%20librespeedorg.user.js
// @updateURL https://update.greasyfork.org/scripts/453790/Results%20in%20Megabytes%20-%20librespeedorg.meta.js
// ==/UserScript==


var x = setInterval(function() {

  if(document.getElementById("resultsImg").width > 10) {
    console.log("Exists!");
    var unit = document.getElementsByClassName("unit") ;
    var dlF = parseFloat(document.getElementById("dlText").innerHTML)
    var ulF = parseFloat(document.getElementById("ulText").innerHTML)
    document.getElementById("dlText").innerHTML = (dlF * 0.125);
    document.getElementById("ulText").innerHTML = (ulF * 0.125);

    clearInterval(x);

    unit[2].innerHTML = "MB/s"
    unit[3].innerHTML = "MB/s"
    clearInterval(x);
  }
}, 100); // check every 100ms


var y = setInterval(function() {

  if(document.getElementById("ip").innerHTML.length > 10) {
    console.log("Exists!");
    document.getElementById("ip").style.backgroundColor = "rgb(96, 96, 170)";
    document.getElementById("ip").style.color = "transparent";

    document.getElementById("ip").onmouseover = function() {
      this.style.color = "black"
    }

    document.getElementById("ip").onmouseleave = function() {
      this.style.color = "transparent"
    }


    clearInterval(y);
    clearInterval(y);
  }
}, 25); // check every 100ms