// ==UserScript==
// @name         ProWritingAid Premium Unlocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to unlock ProWritingAid premium features!
// @author       You
// @match        https://prowritingaid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527614/ProWritingAid%20Premium%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/527614/ProWritingAid%20Premium%20Unlocker.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // Attempt to remove premium feature restrictions
  function removeRestrictions() {
    // Remove "Upgrade to Premium" buttons
    var upgradeButtons = document.querySelectorAll('.upgrade-to-premium');
    upgradeButtons.forEach(function(button) {
      button.remove();
    });
    
    // Remove "Premium feature" overlays
    var premiumOverlays = document.querySelectorAll('.premium-feature-overlay');
    premiumOverlays.forEach(function(overlay) {
      overlay.remove();
    });
    
    // Attempt to enable premium features
    var premiumFeatures = document.querySelectorAll('.premium-feature');
    premiumFeatures.forEach(function(feature) {
      feature.classList.remove('disabled');
      feature.classList.add('enabled');
    });
  }
  
  // Attempt to modify cookies to simulate a premium subscription
  function modifyCookies() {
    // Get the current cookies
    var cookies = document.cookie.split('; ');
    
    // Find the cookie that stores the subscription status
    var subscriptionCookie = cookies.find(function(cookie) {
      return cookie.startsWith('subscription_status=');
    });
    
    // If the cookie exists, attempt to modify it to simulate a premium subscription
    if (subscriptionCookie) {
      var newCookieValue = 'subscription_status=premium';
      document.cookie = newCookieValue + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
      
      // Reload the page to apply the changes
      location.reload();
      
      return;
      
      } 
      
     else { 
     
       console.log("No Cookie found")
       
       }
     
   }
   
   removeRestrictions();
   modifyCookies();
   
})();