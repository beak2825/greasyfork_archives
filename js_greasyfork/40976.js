// ==UserScript==
// @name         Welcome To GDocs
// @namespace    mac_henni/random_usjs
// @version      2.0
// @description  Adds a simple welcome message to Google Docs' pages, including the homepage.
// @author       Mac Henni
// @match        https://docs.google.com/document/*
// @grant        none
// @iconURL      https://clas-pages.uncc.edu/techne/wp-content/uploads/sites/93/2015/02/Google-Docs-Icon.png
// @homepageURL  http://http://mmnfmacjosh.my-free.website/
// @downloadURL https://update.greasyfork.org/scripts/40976/Welcome%20To%20GDocs.user.js
// @updateURL https://update.greasyfork.org/scripts/40976/Welcome%20To%20GDocs.meta.js
// ==/UserScript==

(function() {
    'use strict';
   if(window.location.href !== "https://docs.google.com/document/u/1/?tgif=c")
      {
      alert("Hello, and welcome to Google Docs!");
}
    // Your code here...
})();