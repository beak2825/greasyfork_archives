// ==UserScript==
// @name AutoSpamCop
// @namespace   Violentmonkey Scripts
// @version	2.3
// @description	GreaseMonkey script for validating SpamCop reports
// @licence MIT License (MIT)
// @namespace Violentmonkey Scripts
// @match *://www.spamcop.net/*
// @match *://spamcop.net/*
// @run-at document-end
// @icon https://www.spamcop.net/images/05logo.png
// @grant none
// @date 30/08/2023
// @downloadURL https://update.greasyfork.org/scripts/382291/AutoSpamCop.user.js
// @updateURL https://update.greasyfork.org/scripts/382291/AutoSpamCop.meta.js
// ==/UserScript==

console.log("AutoSpamCop : Started.");

function SearchNextReport()
{
console.log("AutoSpamCop : SearchNextReport.");
var aTags = document.getElementsByTagName("a");
var searchText = "\nReport Now";
  for (var i = 0; i < aTags.length; i++) {
    if (aTags[i].textContent == searchText) {
      window.location.href = aTags[i].href;
      break;
    } 
  }
}

/* Skip too old repports  */

var content = document.body.textContent || document.body.innerText;
var hasText = content.indexOf("Sorry, this email is too old to file a spam report")!==-1;
if (hasText) {
    console.log("AutoSpamCop : too old to file, skipped.");
    SearchNextReport();
} else {
    console.log("AutoSpamCop : Process report.");
    var form = document.getElementsByName('sendreport');
    if(form[0])
      document.forms[1].submit();
    else
      SearchNextReport();
  
    console.log("AutoSpamCop : Done.");
    return;
}
