// ==UserScript==
// @name         Skip Google Adservice Links
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Skip any Google adservice link 
// @author       You
// @match        *://www.googleadservices.com/*
// @grant        none 
// @downloadURL https://update.greasyfork.org/scripts/511280/Skip%20Google%20Adservice%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/511280/Skip%20Google%20Adservice%20Links.meta.js
// ==/UserScript==

function getProductPageUrl(url) {
  // Create a URL object to easily parse query parameters
  const urlObj = new URL(url);
  
  // Extract the 'adurl' parameter from the query string
  const productUrl = urlObj.searchParams.get('adurl');

  // If 'adurl' exists, return it; otherwise return the original URL
  return productUrl ? productUrl : url;
}

function skipLink() {   
  try {  
    window.location.href = getProductPageUrl(window.location.href);  
  } catch(error) {      
    console.error(error);
  }
}

function handleClicks() {
  document.addEventListener('click', function(event) {    
    if (event.target.href && event.target.href.includes('googleadservice')) {
      event.preventDefault();       
      skipLink();
    }   
  });
} 