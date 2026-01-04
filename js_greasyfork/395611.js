// ==UserScript==
// @name        SFSC no double click
// @description disable double click events on entire page 
// @version     1.1
// @grant       none
// @include     https://suse.lightning.force.com/*
// @namespace   https://greasyfork.org/users/438027
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/395611/SFSC%20no%20double%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/395611/SFSC%20no%20double%20click.meta.js
// ==/UserScript==
document.addEventListener( 'dblclick', function(event) {   
    event.preventDefault();  
    event.stopPropagation(); 
  },  true
);