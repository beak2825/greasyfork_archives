// ==UserScript==
// @name        SFSC no mouseover
// @description disable mouseover on entire page 
// @version     1.0
// @grant       none
// @include     https://suse.lightning.force.com/*
// @namespace   https://greasyfork.org/users/438027
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/395747/SFSC%20no%20mouseover.user.js
// @updateURL https://update.greasyfork.org/scripts/395747/SFSC%20no%20mouseover.meta.js
// ==/UserScript==
document.addEventListener( 'mouseover', function(event) {
    if (!event.shiftKey) {
    	event.preventDefault();  
    	event.stopPropagation();
    }
  },  true
);