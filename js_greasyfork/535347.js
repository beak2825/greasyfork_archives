// ==UserScript==
// @name         Kanji + Radical time label
// @namespace    Kanji + Radical time label
// @version      0.0.2
// @description  Shows the time until the next review session.
// @author       Neon Tide
// @match       https://www.wanikani.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535347/Kanji%20%2B%20Radical%20time%20label.user.js
// @updateURL https://update.greasyfork.org/scripts/535347/Kanji%20%2B%20Radical%20time%20label.meta.js
// ==/UserScript==

(function() {
    'use strict';
let items = document.getElementsByClassName("level-progress-dashboard__item");
for (let item of items) {
let child = item.firstElementChild;
let title = child.getAttribute("title");
let wordsToShow = "";
 if(title.endsWith("study.")){
    wordsToShow = "Done";
 } else if(title.startsWith("This") || title.startsWith("The")){
    
    let words = title.split(" ");
    
    if(title.endsWith("now.")){
        wordsToShow = "Now";
    } else {
        let timeValue = words[words.length - 2] + " " + words[words.length - 1].slice(0, -1);
        wordsToShow = getAbbreviation(timeValue);
    }
} else {
    const reviewTime = extractReviewTime(title);
    if(reviewTime){
        wordsToShow = getAbbreviation(reviewTime);
    }
}
let testDiv = document.createElement("div");
testDiv.textContent = wordsToShow;
item.appendChild(testDiv);
testDiv.style.textAlign = "center";
testDiv.style.fontSize = "13px";
testDiv.style.fontWeight = "700";

}
   
})();

function getAbbreviation(title){
    return title.replace("days", "d")
    .replace("day", "d")
    .replace("hours", "h")
    .replace("hour", "h")
    .replace("minutes", "m")
    .replace("minute", "m")
    .replace(" ", "");
}

function extractReviewTime(title) {
    const match = title.match(/in (?:about )?(\d+ (?:hour|hours|minute|minutes|day|days))/);
    return match ? match[1] : null;
}