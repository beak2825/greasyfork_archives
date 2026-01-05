// ==UserScript==
// @name        ChessTempo ECF Grade Estimate
// @namespace   http://xyxyx.org/
// @include     http://chesstempo.com/chess-statistics.html*
// @version     3
// @grant       none
// @description Add estimated ECF grade to ChessTempo statistics page.
// @downloadURL https://update.greasyfork.org/scripts/2188/ChessTempo%20ECF%20Grade%20Estimate.user.js
// @updateURL https://update.greasyfork.org/scripts/2188/ChessTempo%20ECF%20Grade%20Estimate.meta.js
// ==/UserScript==

var regex = new RegExp(/^FIDE Estimated Rating based on ([^:]*): (\d+)/);

var summaryChildren = document.getElementById("summaryTab").childNodes;

function log(message) {
	console.log("ChessTempo ECF Grade Estimate: " + message);

}

function fide_to_ecf(fide) {
	return Math.round((fide-650)/8);
}

try {
	log("Editing page to show ECF grade");
	
    for (var i = 0; i < summaryChildren.length; i++) {
        var child = summaryChildren.item(i);
        var data = child.data;
        
        if (data) {
            var match = regex.exec(data);
            if (match && match.length > 2) {
				log("Found a match: " + match[0]);
			   var basis = match[1];
               var fide = match[2];
                log("FIDE: " + fide);
                var ecf = fide_to_ecf(fide);
                log ("ECF: " + ecf);
                child.data = "Estimated rating based on " + basis + ": " + fide + " FIDE / " + ecf + " ECF";
            }
        }
    }
    
} catch (e) {
    log("Error: " + e);
}