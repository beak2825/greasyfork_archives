// ==UserScript==
// @name         Remove Facebook Trending Topics
// @namespace    http://polybius.design
// @version      0.1
// @description  Hide the "Trending Topics" section of Facebook, reduce stress in your life.
// @author       Lumiras
// @match        https://www.facebook.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21293/Remove%20Facebook%20Trending%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/21293/Remove%20Facebook%20Trending%20Topics.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = "#pagelet_trending_tags_and_topics { display: none}";
    document.body.appendChild(css);
})();