// ==UserScript==
// @name        RGdoi
// @namespace   https://github.com/ashwinvis/greasyfork
// @description Convert DOI links in Researchgate to hyperlinks
// @author      ashwinvis
// @license     GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @include     http://www.researchgate.net/publication/*
// @include     https://www.researchgate.net/publication/*
// @version     0.0.5
// @supportURL  https://github.com/ashwinvis/greasyfork
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39256/RGdoi.user.js
// @updateURL https://update.greasyfork.org/scripts/39256/RGdoi.meta.js
// ==/UserScript==

var matchRegexpGlobal = /DOI.*/mg;
var extractRegexp = /(?:DOI:\s)([\w\.\/\-])*/g;
var extractRegexpAfterLogin = /<li(.*?)>(.*?)<\/li>/;

function extractDoiAndHyperlink(text)
{
    var root = "https://doi.org/";

    // var text = window.document.body.textContent;
    while((match = matchRegexpGlobal.exec(text)) != null) {
        var doi = extractRegexp.exec(match[0]);
        var doiLogin = extractRegexpAfterLogin.exec(match[0]);
        if (doi != null) {
            console.log("DOI detected: " + doi[0]);
            var doi_link = doi[0].replace(/DOI\:\s/i, "");
            replaceElement(doi_link);
        }
        else if (doiLogin != null) {
            console.log("DOI detected: " + doiLogin[2]);
            replaceElementAfterLogin(doiLogin[2]);
        }
        else {
            console.log("DOI not detected by extract regex!")
        }
    }
    console.log("End of RGdoi.js")
}


function replaceElement(doi) {
    var divs = document.querySelectorAll(".publication-meta-secondary");
    var element = divs[0];
    console.log("Wrapping hyperlink on " + element.innerHTML)
    var replace = '<a href="https://doi.org/' + doi +'">' + element.innerHTML +  '</a>';
    element.innerHTML = replace;
}


function replaceElementAfterLogin(doi) {
    var lis = document.querySelectorAll(".nova-e-list__item");
    var element = lis[3];
    console.log("Wrapping hyperlink on " + element.innerHTML)
    var replace = '<a href="https://doi.org/' + doi +'">' + element.innerHTML +  '</a>';
    element.innerHTML = replace;
}


// Old method: which gets blocked 
// extractDoiAndHyperlink(window.top)

GM.xmlHttpRequest({
  method: "GET",
  url: location.href,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  onload: function(response) {
    extractDoiAndHyperlink(response.responseText);
  }
});
