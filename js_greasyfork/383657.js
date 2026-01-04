// ==UserScript==
// @name          Are you saying Boo or Boo-urned?
// @namespace     https://www.wanikani.com
// @description   Silly WaniKani script for Simpsons fans
// @version 1.2.0
// @include       https://www.wanikani.com/
// @include       https://www.wanikani.com/*
// @run-at	  document-end
// @grant	  none
// @author  gth99
// @downloadURL https://update.greasyfork.org/scripts/383657/Are%20you%20saying%20Boo%20or%20Boo-urned.user.js
// @updateURL https://update.greasyfork.org/scripts/383657/Are%20you%20saying%20Boo%20or%20Boo-urned.meta.js
// ==/UserScript==






function simpsonize() {

    var burnedEl = document.getElementById("burned");
    var burnedText;
    var recentRetired;

    if (burnedEl) {
        burnedText = burnedEl.innerHTML;
        if (burnedText) {
            burnedText = burnedText.replace("Burn", "Boo-urn");
            burnedEl.innerHTML = burnedText;
        }
    }

    burnedEl = document.getElementsByClassName("recent-retired");
    if (burnedEl) {
        recentRetired = burnedEl[0];
        if (recentRetired) {
            burnedText = recentRetired.innerHTML;
            burnedText = burnedText.replace("Burn", "Boo-urn");
            recentRetired.innerHTML = burnedText;

            if (recentRetired.getElementsByClassName("see-more")) {
                burnedText = recentRetired.getElementsByClassName("see-more")[0].innerHTML;
                burnedText = burnedText.replace("Burn", "Boo-urn");
                recentRetired.getElementsByClassName("see-more")[0].innerHTML = burnedText;
            }
        }
    }

    burnedEl = document.getElementsByClassName("burned");
    if (burnedEl) {
        var x = 0;
        while (recentRetired = burnedEl[x++]) {
            burnedText = recentRetired.innerHTML;
            burnedText = burnedText.replace("Burn", "Boo-urn");
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
                burnedText = burnedText.replace("Burn", "Boo-urn");
                t2[0].parentElement.parentElement.innerHTML = burnedText;
            }
        }
    }
}


function main () {

	simpsonize();

}


window.addEventListener("DOMContentLoaded", main, false);
