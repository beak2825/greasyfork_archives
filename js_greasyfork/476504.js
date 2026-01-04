// ==UserScript==
// @name vocabtracker wide mode
// @namespace vocabtrackermod
// @author iniquitousx
// @description Moves the transcript element to the otherwise unoccupied area to the right of the window
// @match https://*.vocabtracker.com/getPage/Studying/*
// @license MIT
// @version 1.22
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/476504/vocabtracker%20wide%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/476504/vocabtracker%20wide%20mode.meta.js
// ==/UserScript==



var intv = setInterval(function() {



var sect = document.querySelector("#root > section");
var col = document.querySelector("#root > section > div");
col.id = "main_col";

if(!(col.childElementCount>3)){
    console.log("no elements");
    return false;

}

var newDiv = document.createElement("div");
newDiv.style.display="flex";
newDiv.style.flexDirection = "column";
newDiv.style.flexGrow = "1";
newDiv.style.backgroundColor = "white";

col.parentNode.appendChild(newDiv);
newDiv.id = "new_col";

var main_col = document.getElementById("main_col");
var new_col = document.getElementById("new_col");

var page_select = document.querySelector("#main_col > div:nth-child(3)");

try {
    new_col.appendChild(page_select);
} catch (error) {
    console.log("error adding page turner to new column")
}

var word_list = document.querySelector("#main_col > div:nth-child(3)");

try {
    new_col.appendChild(word_list);
} catch (error) {
    console.log("error adding word list to new column")
}

var word_span = document.querySelector("#new_col > div:nth-child(2) > div > span");

word_span.style.float = "right"
word_span.style["padding-right"] = "100px"

var translation = document.querySelector("#new_col > div:nth-child(2) > div:nth-child(2)");
try {
    main_col.appendChild(translation);
} catch (error) {
    console.log("error adding translation dialog to left column")
}

document.addEventListener('click',function(e){
    var link = e.target.getAttribute("href")
    if(link != null && !e.target.href.includes('https://www.vocabtracker.com/getPage/Studying/') && e.target.href.includes('https://www.vocabtracker.com/getPage/'))
    {
        // this div has been clicked
        new_col.remove()
    }
});

clearInterval(intv);

return true;

}, 300);