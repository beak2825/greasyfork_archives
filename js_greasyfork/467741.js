// ==UserScript==
// @name         Piped Underline Timestamps
// @namespace    https://femboy.group/
// @version      1.3
// @description  Underline timestamps on comments.
// @match        https://piped.projectsegfau.lt/*
// @icon         https://piped.projectsegfau.lt/favicon.ico
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/467741/Piped%20Underline%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/467741/Piped%20Underline%20Timestamps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle() {
        var style = document.createElement('style');
      	style.id = "change-timestamp-color";
        style.innerHTML = `
            .comment-content.pl-2 > .whitespace-pre-wrap > a {
                text-decoration: underline !important;
                --un-text-opacity: 1;
                color: rgba(59, 130, 246, var(--un-text-opacity));
            }
						.break-words > a {
                text-decoration: underline !important;
                --un-text-opacity: 1;
                color: rgba(59, 130, 246, var(--un-text-opacity));
						}
        `;
        document.head.appendChild(style);
    }

    // Check if the targeted elements are available, and if not, wait for the DOM to load
    function waitForElements() {
        var targetElements = document.querySelectorAll('.comment-content.pl-2 > .whitespace-pre-wrap > a');
        if (targetElements.length === 0) {
            setTimeout(waitForElements, 100);
        } else {
            addStyle();
        }
    }

    function checkStyleAdded() {
    	var style_added = document.getElementById("change-timestamp-color");
      var style_is_added = false;
    	while (!style_is_added){
      	if (style_added === null) {
      		setTimeout(waitForElements, 100);
      	} else {
      		style_is_added = true;
      	}
      }
    }

		waitForElements();
  	//checkStyleAdded();
})();