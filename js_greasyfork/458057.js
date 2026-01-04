// ==UserScript==
// @name        Hacker News Search
// @namespace   https://news.ycombinator.com/
// @match     https://news.ycombinator.com/*
// @author       Jonathan Woolf
// @description Add a search box on the top of the page and make it search all of HackerNews.
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/458057/Hacker%20News%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/458057/Hacker%20News%20Search.meta.js
// ==/UserScript==

// Create the search container
var searchContainer = document.createElement("center");
searchContainer.setAttribute("style", "background-color: #FFFFFF; padding: 10px;");

// Create the search input
var searchInput = document.createElement("input");
searchInput.setAttribute("type", "text");
searchInput.setAttribute("placeholder", "Search Hacker News");
searchInput.setAttribute("style", "padding: 5px;");
searchInput.setAttribute("id", "search-input")

// Create the search button
var searchButton = document.createElement("button");
searchButton.innerHTML = "Search";
searchButton.setAttribute("style", "padding: 5px; margin-left: 10px;");

// Add the search input and button to the container
searchContainer.appendChild(searchInput);
searchContainer.appendChild(searchButton);

// Add the container to the top of the page
document.body.insertBefore(searchContainer, document.body.firstChild);

// Add an event listener to the search button
searchButton.addEventListener("click", function() {
  performSearch();
});

//Add event listener for return key press
document.getElementById("search-input").addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    event.preventDefault();
    performSearch();
  }
});

function performSearch() {
  // Get the search query
  var query = searchInput.value;

  // Build the search URL
  var searchURL = "https://hn.algolia.com/?dateRange=all&page=0&prefix=false&query=" + query + "&sort=byPopularity&type=story";

  // Redirect to the search URL
  window.location.href = searchURL;
}
