// ==UserScript==
// @name         Bing scrollTo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Block Bing Search returns to the top
// @author       vBrasch
// @match        http*://*.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473825/Bing%20scrollTo.user.js
// @updateURL https://update.greasyfork.org/scripts/473825/Bing%20scrollTo.meta.js
// ==/UserScript==

(function() {
    'use strict';


  // Override the scrollTo method with an empty function
window.scrollTo = function() {};

// You can also override the scrollTo method for the Document object
Document.prototype.scrollTo = function() {};

// Alternatively, if you're using jQuery, you can disable the scrollTo functionality by overriding its animate function
$.fn.animate = function() {};

// Disable the scrollTo functionality for any other libraries or plugins that may provide this functionality



})();