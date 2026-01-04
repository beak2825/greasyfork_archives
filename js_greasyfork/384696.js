// ==UserScript==
// @name         DomJudge Collapsible run in/output
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Collapsible run in- and output on DomJudge submissions
// @author       Sten
// @match        https://domjudge.cs.uu.nl/dj/ds/team/submission_details.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384696/DomJudge%20Collapsible%20run%20inoutput.user.js
// @updateURL https://update.greasyfork.org/scripts/384696/DomJudge%20Collapsible%20run%20inoutput.meta.js
// ==/UserScript==

(function() {
    var expandBtn = document.createElement("a");
    expandBtn.innerText = "[+]";
    expandBtn.setAttribute("href", "#");

    $(".output_text").add($("div > .output_text").parent()).css("display", "none");

    $(".output_text").add($("div > .output_text").parent()).prev("h5").each((index, elem) => {
    elem.innerText += " ";
    let newExpandBtn = expandBtn.cloneNode(true);
		newExpandBtn.addEventListener("click", function(event){
            event.preventDefault();
            let nextElem = event.target.parentElement.nextElementSibling;
			      if (nextElem.tagName.toLowerCase() === "div") nextElem = nextElem.nextElementSibling;
            let nextVis = nextElem.style.display == "";
            event.target.innerText = nextVis ? "[+]" : "[-]";
            nextElem.style.display = nextVis ? "none" : "";
		});
        elem.appendChild(newExpandBtn);
    });
})();