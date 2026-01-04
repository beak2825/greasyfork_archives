// ==UserScript==
// @name            Testing Stay extension
// @description     Inject some javascript into these websites
// @version         1.0.1
// @author          Oliver P
// @namespace       https://github.com/OlisDevSpot
// @license         MIT
// @match           *://*/*
// @run-at          document-end
// @compatible      safari
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/541038/Testing%20Stay%20extension.user.js
// @updateURL https://update.greasyfork.org/scripts/541038/Testing%20Stay%20extension.meta.js
// ==/UserScript==
 
// jshint esversion: 8
 
(async function () {
  "use strict";
    
    const name = prompt("what is your name?")
  
  alert(`Hi, ${name}`)
})();