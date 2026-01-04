// ==UserScript==
// @name        Rule34 Quick Buttons
// @namespace   miep
// @include     *://rule34.xxx/*
// @grant       none
// @version     Final
// @author      jAstn
// @description Just a few buttons that a useful
// @require     https://code.jquery.com/jquery-3.5.1.min.js
// @icon        https://i.imgur.com/m2kIFiy.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524444/Rule34%20Quick%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/524444/Rule34%20Quick%20Buttons.meta.js
// ==/UserScript==

// this function get exicuted when the document is ready so all the elements on the page are loaded and we can access everything we need for the scipt
// first and only thing i just form the jquery libary but it has so many more things that are just nice to have (that we install with the  @require     https://code.jquery.com/jquery-3.5.1.min.js line)
// libary = is basical a colection of code that you can use if you import the libary into the program
$("document").ready(function() {
  var searchField = document.getElementsByName("tags")[0];
  var searchButton = document.getElementsByName("tag-search")[0];

function createButton(text, innerHTML) {
  var button = document.createElement("button");
  button.innerHTML = innerHTML;
  button.style.cursor = "pointer";
  button.style.margin = "2px";
  button.onclick = function() {
    // Appending the text to the searchField value
    searchField.value += " " + text;

    // Triggering click event on the searchButton
    searchButton.click();
  };
  return button;
}

// If you want to create a button just remove the // from the last line and copy the new buttons name down in tagSearchContainer
var sortScoreButton = createButton("sort:score", "Sort by Score");
var animatedButton = createButton("-animated -video", "No Animation");
var sortIDButton = createButton("sort:id:desc", "Sort by ID");
var sortScoreanimatedButton = createButton("sort:score -animated -video height:>1000", "Combined");
var HeightButton = createButton("height:>1000", "Height");
// var NAMEButton = createButton ("TAG THAT YOU WANT TO SEARCH", "TEXT ON THE BUTTON");

// Appending the buttons to the container div
var tagSearchContainer = document.getElementsByClassName("tag-search")[0];
tagSearchContainer.appendChild(sortScoreanimatedButton);
tagSearchContainer.appendChild(sortScoreButton);
tagSearchContainer.appendChild(animatedButton);
tagSearchContainer.appendChild(sortIDButton);
tagSearchContainer.appendChild(HeightButton);
// tagSearchContainer.appendChild(NAMEButton);
});
