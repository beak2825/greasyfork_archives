// ==UserScript==
// @name         Skip Google Adservice Links
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Skip any Google adservice link 
// @author       You
// @match        *://www.googleadservices.com/*
// @grant        none 
// @downloadURL https://update.greasyfork.org/scripts/466428/Skip%20Google%20Adservice%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/466428/Skip%20Google%20Adservice%20Links.meta.js
// ==/UserScript==

function getProductPageUrl(url) {
  let productUrl = url.replace('googleadservice', '');  
  let queryString = url.split('?')[1];
  if (queryString) {
    productUrl += '&' + queryString;    
  }   
  return productUrl;
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

if (window.location.href.includes('googleadservice')) {
  skipLink();
} else {
  handleClicks();
}