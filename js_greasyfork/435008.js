// ==UserScript==
// @name Clickable smrtPhone Links
// @description Make Google Maps and Zillow links clickable
// @include https://*
// @grant none
// @version 0.0.1.20211107015944
// @namespace https://greasyfork.org/users/832223
// @downloadURL https://update.greasyfork.org/scripts/435008/Clickable%20smrtPhone%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/435008/Clickable%20smrtPhone%20Links.meta.js
// ==/UserScript==

function main(where) {
  // do stuff here with  where  instead of  document
  // e.g. use  where.querySelector()  in place of  document.querySelector()
  // and add stylesheets with  where.head.appendChild(stylesheet)
}

main(document); // run it on the top level document (as normal)

waitForKeyElements("iframe, frame", function(elem) {
  elem.removeAttribute("wfke_found"); // cheat wfke's been_there, use our own
  for (let f=0; f < frames.length; f++) {
    if (!frames[f].document.body.getAttribute("tr.extra-fields-row")) {

      main(frames[f].document);

      frames[f].document.body.setAttribute("tr.extra-fields-row", 1);
    }
  }
});

var extraFields = document.querySelectorAll("tr.extra-fields-row")
extraFields.forEach(function(extraField) {
    console.log("Before If");
    if ( extraField.innerHTML.includes("https:") ) {
        console.log("Inside If");
        var xInnerHTML = ""
        xInnerHTML = extraField.innerHTML
        xInnerHTML = xInnerHTML.replace( "<span.*<\/span>", "")
        //extraField.innerHTML = xInnerHTML
        extraField.innerHTML = "found https"
    }
});