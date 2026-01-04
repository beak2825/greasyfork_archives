// ==UserScript==
// @name         Customized Bangumi 2.0
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  从Bangumi快捷跳转到观看网站
// @author       You
// @match        *://bgm.tv/subject/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533650/Customized%20Bangumi%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/533650/Customized%20Bangumi%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
// 1
// Get the title of the movie from the title attribute of the anchor element
var movieTitle = document.querySelector('#headerSubject > h1 > a').getAttribute('title');

// Function to generate a search URL for a given search engine
function generateSearchUrl(searchEngine, title) {
  var searchUrl;
  switch (searchEngine) {
    case 'age':
      searchUrl = 'https://www.agedm.org/search?query=' + encodeURIComponent(title);
      break;
    case 'yhdm':
      searchUrl = 'https://www.yhmxv.com/s_all?ex=1&kw=' + encodeURIComponent(title);
      break;
    case 'nunu':
      searchUrl = 'https://nnyy.in/so?q=' + encodeURIComponent(title);
      break;
    // Add more cases for other search engines if needed
    default:
      searchUrl = '';
  }
  return searchUrl;
}

// Function to create a new list item with a link
function createListItem(textContent, href) {
  var listItem = document.createElement('li');
  var link = document.createElement('a');
  link.textContent = textContent;
  link.href = href;
  link.setAttribute('target', '_blank'); // Open in a new tab or window
  listItem.appendChild(link);
  return listItem;
}

// Create list items
var listItem1 = createListItem('AGE', generateSearchUrl('age', movieTitle));
var listItem2 = createListItem('YH', generateSearchUrl('yhdm', movieTitle));
var listItem3 = createListItem('NUNU', generateSearchUrl('nunu', movieTitle));

// Get the existing list of tabs and append the new list items
var navTabs = document.querySelector('.navTabs');
navTabs.appendChild(listItem1);
<!--navTabs.appendChild(listItem2);--!>
navTabs.appendChild(listItem3);

// 2
// Find the element with class "panelProgress" and update its innerHTML
var progressPanel = document.querySelector('.panelProgress .inner small');
if (progressPanel) {
  // Replace the "0/12" string with an empty string
  progressPanel.innerHTML = progressPanel.innerHTML.replace('0/12', '');
}

// Find the element with rel="v:rating" and remove its child with class "rateEmo"
var ratingElement = document.querySelector('div[rel="v:rating"] .rateEmo');
if (ratingElement) {
  ratingElement.parentNode.removeChild(ratingElement);
}

// Find the anchor element under the element with class "doujin" and remove it
var doujinAnchor = document.querySelector('#navNeue2 #navMenuNeue .doujin a');
if (doujinAnchor) {
  doujinAnchor.parentNode.removeChild(doujinAnchor);
}

// Find the element with id "panelInterestWrapper" and remove all elements with class "shareBtn" under it
var interestWrapper = document.getElementById('panelInterestWrapper');
if (interestWrapper) {
  var shareBtnElements = interestWrapper.querySelectorAll('.shareBtn');
  shareBtnElements.forEach(function (element) {
    element.parentNode.removeChild(element);
  });
}


})();