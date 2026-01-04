// ==UserScript==
// @name         Papergames Ban Bypass
// @namespace    github.com/longkidkoolstar
// @version      2.1
// @description  Simple userscript to clear local storage, session storage, and cookies for unban purposes.
// @author       longkidkoolstar
// @icon         https://i.imgur.com/nxEJksd.png
// @match        https://papergames.io/*
// @grant        GM_registerMenuCommand
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504755/Papergames%20Ban%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/504755/Papergames%20Ban%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to delete a cookie by name, path, and domain
   // Function to delete cookies for a specific domain
function deleteCookie(name, domain) {
    const paths = ['/', '/path/', '/cookiepath/', '/morepath/', '/allpaths/']; // Add more paths or wildcard

    
    if (domain) {
      // Delete cookie for specific domain
      paths.forEach(path => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=${path}`;
      });
    } else {
      // Delete cookie for current domain
      paths.forEach(path => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
      });
    }
  }
  
  // Function to clear cookies for a specific domain
  function clearCookiesForDomain(domain) {
    const cookies = document.cookie.split("; ");
    cookies.forEach(cookie => {
      const cookieName = cookie.split("=")[0];
      deleteCookie(cookieName, domain);
      deleteCookie(cookieName, `.${domain}`); // Try subdomains
    });
  }
  
  // Function to clear local storage, session storage, and cookies
  function clearDataForDomain(domain) {
    console.log(`Clearing data for domain: ${domain}`);
    
    // Clear cookies for the domain and subdomains
    clearCookiesForDomain(domain);
  
    // Clear local storage and session storage
    localStorage.clear();
    sessionStorage.clear();
  }
  
  // Function to clear data for current domain and other specified domains
  function clearAllData() {
    // Clear data for the current domain
    clearDataForDomain(window.location.hostname);
  
    // Clear data for other domains (like Google)
    const otherDomains = ["papergames.io", "www.google.com"];
    otherDomains.forEach(domain => clearDataForDomain(domain));
  
    alert("Local storage, session storage, and cookies cleared.");
  }
  
  // Create "Unban" button in the Greasemonkey/Tampermonkey menu
  GM_registerMenuCommand("Unban", clearAllData);
  
  })();