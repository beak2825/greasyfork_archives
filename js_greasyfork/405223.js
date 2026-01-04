// ==UserScript==
// @name        CubeCraft appeal site improvements
// @namespace   Violentmonkey Scripts
// @match       https://appeals.cubecraft.net/find_appeals/*
// @grant       none
// @version     1.4.2
// @author      Caliditas
// @description Changes the date of the infraction to the local timezone and makes links clickable. Also adds a namemc link.
// @downloadURL https://update.greasyfork.org/scripts/405223/CubeCraft%20appeal%20site%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/405223/CubeCraft%20appeal%20site%20improvements.meta.js
// ==/UserScript==

var infractions = document.getElementsByClassName("col-sm-8");
var amountOfInfractions = infractions[0].children.length;

for (var i = 0; i < amountOfInfractions; i++) {
  replaceDate(infractions[0].children[i].firstElementChild);
}

function replaceDate(element) {
  var contentString = element.innerHTML;
  dateStringOld = contentString.slice(contentString.indexOf(" at") + 3, contentString.indexOf(" for")) + " UTC";
  var dateOldMs = Date.parse(dateStringOld);
  var dateOld = new Date(dateOldMs);
  var contentStringChanged = contentString.slice(0, contentString.indexOf(" at ") + 4) + dateOld.toString().slice(4, 10) + "," + dateOld.toString().slice(10, 25) + initials(new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1])
  contentStringChanged += contentString.slice(contentString.indexOf(" for"));
  if (contentStringChanged.includes("http")) {
    var evidenceLink = contentStringChanged.slice(contentStringChanged.indexOf("http"))
    // evidenceLink.slice
    var evidenceLinkShort = evidenceLink.slice(0, evidenceLink.indexOf("\t"));
    evidenceLinkShort = evidenceLinkShort.slice(0, evidenceLinkShort.indexOf(" "));
    // console.log(evidenceLinkShort)
    contentStringChanged = contentStringChanged.slice(0, contentStringChanged.indexOf("http")) + "<a target=\"_blank\" href=\"" + evidenceLinkShort + "\">" + evidenceLinkShort + "</a>" + contentStringChanged.slice(contentStringChanged.indexOf("http") + evidenceLinkShort.length) //evidenceLink.slice(evidenceLink.indexOf("\t"));
  }
  // console.log(contentStringChanged)
  element.innerHTML = contentStringChanged;
}

function initials(words) {
  if (words.includes(" ")) {
    var wordsArray = words.split(" ");
    var initials = "";
    for (var i = 0; i < wordsArray.length; i++) {
      initials += wordsArray[i][0];
    }
    return initials;
  } else {
    return words;
  }  
}

var nameElem = document.getElementsByClassName("col-sm-4")[0];
var uuid = nameElem.children[0].outerHTML.slice(nameElem.children[0].outerHTML.indexOf("user=") + 5, nameElem.children[0].outerHTML.indexOf("\" style"));
var outer = nameElem.outerHTML;
var newOuter = outer.slice(0, outer.indexOf(">")) + "onclick=\"window.open('https://namemc.com/profile/" + uuid + "');\" style=\"cursor: pointer;\"" + outer.slice(outer.indexOf(">"))
nameElem.outerHTML = newOuter;
