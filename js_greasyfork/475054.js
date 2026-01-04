// ==UserScript==
// @name        Fix camwhoresbay.com (IMG and Anchors)
// @namespace   Violentmonkey Scripts
// @match       https://www.camwhoresbay.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 9/11/2023, 10:58:58 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475054/Fix%20camwhoresbaycom%20%28IMG%20and%20Anchors%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475054/Fix%20camwhoresbaycom%20%28IMG%20and%20Anchors%29.meta.js
// ==/UserScript==

// Find the element to remove using its CSS selector
var elementToRemove = document.querySelector('div.content div#block-chat.block-video div.table');

// Check if the element exists before attempting to remove it
if (elementToRemove) {
  elementToRemove.remove(); // Remove the element from the DOM
} else {
  console.log("Element not found.");
}

// Select all IMG elements
var imgElements = document.querySelectorAll('img');

// Loop through each IMG element
imgElements.forEach(function (img) {

  // Check if the IMG element has a data-original attribute
  if (img.hasAttribute('data-original')) {
    // Get the value of the data-original attribute
    var dataValue = img.getAttribute('data-original');

    // Add "https:" to the data-original value and set it as the src value
    img.setAttribute('src', 'https:' + dataValue);
  }
});

// Select all anchor elements
var anchorElements = document.querySelectorAll('a');

// Loop through each anchor element
anchorElements.forEach(function (anchor) {
  // Check if the anchor element has a data-href attribute
  if (anchor.hasAttribute('data-href')) {
    // Get the value of the data-href attribute
    var dataValue = anchor.getAttribute('data-href');

    // Add "https:" to the data-href value and set it as the href value
    anchor.setAttribute('href', dataValue);
  }
});


// Function to force anchor elements to use the href attribute
function forceHrefUsage(event) {
  event.preventDefault(); // Prevent the default behavior (navigation)
  var href = event.currentTarget.getAttribute('href');
  if (href) {
    // You can perform custom actions here with the href value if needed
    console.log('Using href:', href);
    // You can navigate to the href value programmatically if desired
    window.location.href = href;
  }
}

anchorElements.forEach(function (anchor) {
  anchor.addEventListener('click', forceHrefUsage);
});