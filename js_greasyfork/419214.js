// ==UserScript==
// @name         Flight Rising: AH Sell Page Item Filtering
// @namespace    https://greasyfork.org/en/users/721326-dionysus
// @version      0.1
// @description  Adds a way to filter items on the AH sell pages. Searches are case insensitive. This code uses CSS selectors and filters items using the existing data-name attribute in the code for each item's icon and your input into a text box.
// @author       Dionysus of Greasy Fork
// @match        https://www1.flightrising.com/auction-house/sell/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419214/Flight%20Rising%3A%20AH%20Sell%20Page%20Item%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/419214/Flight%20Rising%3A%20AH%20Sell%20Page%20Item%20Filtering.meta.js
// ==/UserScript==

(function() {
    'use strict';
    waitForElementToDisplay("#ah-sell-left",function(){addElements();},1000,9000);

})();

function addElements() {
    var container = document.getElementById("ah-sell-left");
    if (container.querySelector(".ah-sell-item-list")) {
        var afterMe = container.querySelector(".ah-sell-tip"),
            searchBoxContainer = document.createElement('div'),
            searchBox = document.createElement('input'),
            searchButton = document.createElement('button'),
            clearButton = document.createElement('button'),
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        searchBoxContainer.id = "ah-filtering";
        searchBoxContainer.style = "margin: 10px 0;";

        style.id = "search-js-css";
        style.type = 'text/css';
        style.innerText = '.ah-sell-item-padcontainer { font-size: 0px; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; }' +
        '.itemicon.itemicon-small.ah-sell-item[style*="none;"] { display: block !important; opacity: 0.3; }' +
        '.search-btn { margin: 0 0 0 5px; background: #e4e1d4; border: 2px outset #731d08; padding: 2px 5px; border-radius: 5px; transition: 0.3s border-color; }' +
        '.search-btn:hover, .search-btn:focus { border-color: #fdb54a; }';

        searchBox.id = "search-input";
        searchBox.placeholder = "Filter items...";
        searchBox.style = "width: 185px; padding: 3px 5px;";

        searchButton.id = "search-btn";
        searchButton.innerText = "Filter";
        searchButton.classList = "search-btn";

        clearButton.id = "clear-search-btn";
        clearButton.innerText = "Reset";
        clearButton.classList = "search-btn";

        head.appendChild(style);
        insertAfter(searchBoxContainer, afterMe);
        searchBoxContainer.appendChild(searchBox);
        searchBoxContainer.appendChild(searchButton);
        searchBoxContainer.appendChild(clearButton);

        searchButton.addEventListener("click", function() { searchTime() }, false);
        clearButton.addEventListener("click", function() { clearSearch() }, false);
        searchBox.focus();
    }
}

function searchTime() {
    var input = document.getElementById("search-input").value;
    console.log('filtering for: "' + input + '"');
    var style = document.getElementById("search-js-css");
    style.innerText = '.ah-sell-item-padcontainer { font-size: 0px; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; }' +
        '.itemicon.itemicon-small.ah-sell-item, .itemicon.itemicon-small.ah-sell-item[style*="inline-block;"] { display: none !important; }' +
        '.itemicon.itemicon-small.ah-sell-item[data-name*="' + input + '" i] { display:inline-block  !important; } ' +
        '.itemicon.itemicon-small.ah-sell-item[style*="none;"] { opacity: 0.3; }' +
        '.search-btn { margin: 0 0 0 5px; background: #e4e1d4; border: 2px outset #731d08; padding: 2px 5px; border-radius: 5px; transition: 0.3s border-color }' +
        '.search-btn:hover, .search-btn:focus { border-color: #fdb54a; }';
}

function clearSearch() {
    var style = document.getElementById("search-js-css");
    var input = document.getElementById("search-input");
    style.innerText = '.ah-sell-item-padcontainer { font-size: 0px; display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 1fr; }' +
        '.itemicon.itemicon-small.ah-sell-item[style*="none;"] { display: block !important; opacity: 0.3; }' +
        '.search-btn { margin: 0 0 0 5px; background: #e4e1d4; border: 2px outset #731d08; padding: 2px 5px; border-radius: 5px; transition: 0.3s border-color }' +
        '.search-btn:hover, .search-btn:focus { border-color: #fdb54a; }';
    input.value = '';
    input.focus();
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}