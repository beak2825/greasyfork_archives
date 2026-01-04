// ==UserScript==
// @name         Page Error Prank
// @namespace    *
// @version      1
// @description Simple script to delete a any page when enabled
// @author       Boundless
// @match        *
// @grant        *
// @downloadURL https://update.greasyfork.org/scripts/390108/Page%20Error%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/390108/Page%20Error%20Prank.meta.js
// ==/UserScript==

window.addEventListener('load', function(e){
   document.body.style.display = 'none';
});