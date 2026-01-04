// ==UserScript==
// @name          Burn Level Renamer
// @namespace     https://www.wanikani.com
// @description   Rename the final SRS progress level from Burned to whatever you like
// @version 1.1.0
// @include       https://www.wanikani.com/
// @include       https://www.wanikani.com/*
// @run-at	  document-end
// @grant	  GM_registerMenuCommand
// @author  gth99
// @downloadURL https://update.greasyfork.org/scripts/383721/Burn%20Level%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/383721/Burn%20Level%20Renamer.meta.js
// ==/UserScript==


function GMsetup() {
  if (GM_registerMenuCommand) {
    GM_registerMenuCommand('Burn Level Renamer: Set name', function() {
      var curEntry = localStorage.getItem("WKBLRBurnLevelName") || "Burned";
      var newText = prompt('New name:', curEntry);
      if (newText != null) {
          if (typeof(newText) !== "string") {
              newText = String(newText);
          }
          localStorage.setItem("WKBLRBurnLevelName", newText);
          if (curEntry != newText) {
              location.reload();
          }
      }
    });

  }
}


function renameBurnedLevel() {

    var desiredName = localStorage.getItem("WKBLRBurnLevelName") || "Burned";
    var burnedEl = document.getElementById("burned");
    var burnedText;
    var recentRetired;

    if (desiredName == "Burned") {
        return;
    }

    if (burnedEl) {
        burnedText = burnedEl.innerHTML;
        if (burnedText) {
            burnedText = burnedText.replace("Burned", desiredName);
            burnedEl.innerHTML = burnedText;
        }
    }

    burnedEl = document.getElementsByClassName("recent-retired");
    if (burnedEl) {
        recentRetired = burnedEl[0];
        if (recentRetired) {
            burnedText = recentRetired.innerHTML;
            burnedText = burnedText.replace("Burned", desiredName);
            recentRetired.innerHTML = burnedText;

            if (recentRetired.getElementsByClassName("see-more")) {
                burnedText = recentRetired.getElementsByClassName("see-more")[0].innerHTML;
                burnedText = burnedText.replace("Burned", desiredName);
                recentRetired.getElementsByClassName("see-more")[0].innerHTML = burnedText;
            }
        }
    }

    burnedEl = document.getElementsByClassName("burned");
    if (burnedEl) {
        var x = 0;
        while (recentRetired = burnedEl[x++]) {
            burnedText = recentRetired.innerHTML;
            burnedText = burnedText.replace("Burned", desiredName);
            recentRetired.innerHTML = burnedText;
        }
    }

    burnedEl = document.getElementsByClassName("legend");
    if (burnedEl) {
        recentRetired = burnedEl[0];
        if (recentRetired) {
            var t2 = recentRetired.getElementsByClassName("burned");
            if (t2 && t2[0].parentElement && t2[0].parentElement.parentElement) {
                burnedText = t2[0].parentElement.parentElement.innerHTML;
                burnedText = burnedText.replace("Burned", desiredName);
                t2[0].parentElement.parentElement.innerHTML = burnedText;
            }
        }
    }
}


function main () {

    GMsetup();
	renameBurnedLevel();

}


window.addEventListener("DOMContentLoaded", main, false);
