// ==UserScript==
// @name Goodreads Plus RED
// @namespace 
// @version 0.1
// @description Add "Search RED" button to Goodreads
// @author 
// @include http*://www.goodreads.com/* 
// @include http*://goodreads.com/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/27818/Goodreads%20Plus%20RED.user.js
// @updateURL https://update.greasyfork.org/scripts/27818/Goodreads%20Plus%20RED.meta.js
// ==/UserScript==

console.log("[M+] Tweaking Goodreads...");

// Grab book title (and only title)
var bookTitle = document.getElementById("bookTitle").innerHTML.trim().split('<', 1);
console.log("Book title: " + bookTitle);
var REDSearchUrl = "https://redacted.ch/torrents.php?groupname=" + bookTitle + "&order_by=time&order_way=desc&group_results=1&filter_cat%5B3%5D=1&filter_cat%5B4%5D=1&filter_cat%5B7%5D=1&action=advanced&searchsubmit=1";

// Add 'Search RED' button
var buttonBar = document.getElementById("buyButtonContainer");
if (buttonBar === null || buttonBar == "null") {
buttonBar = document.getElementById("asyncBuyButtonContainer");
}
var buttonUl = buttonBar.getElementsByTagName("ul");
var REDButton = document.createElement("li");
REDButton.innerHTML = '<a id="REDLink" href="' + REDSearchUrl + '" target="_blank" class="buttonBar">Search RED</a>';
REDButton.className = "Button";
buttonUl[0].appendChild(REDButton);

console.log("[M+] 'Search RED' button added!");