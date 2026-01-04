// ==UserScript==
// @name         Tumblr dashboard: hide photosets
// @description  Deletes any posts with two or more media files from the Tumblr dashboard
// @version      1.0.0
// @match        https://www.tumblr.com/dashboard
// @author       Konf
// @namespace    https://greasyfork.org/users/424058
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419248/Tumblr%20dashboard%3A%20hide%20photosets.user.js
// @updateURL https://update.greasyfork.org/scripts/419248/Tumblr%20dashboard%3A%20hide%20photosets.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
  'use strict';

  const queries = { // could change at anytime..
    post: '._1DxdS._2jOH-',
    anyMedia: '.daUfr'
  }

  document.arrive(queries.post, { existing: true }, (postNode) => {
    const mediaNodes = postNode.querySelectorAll(queries.anyMedia);

    if (mediaNodes.length > 1) {
      // postNode.style.opacity = 0.3; // for testing
      postNode.remove();
    }
  });
})();
