// ==UserScript==
// @name     [AO3] Remove Comma from stats page
// @description Removes the comma separators from numbers on the AO3 stats page.
// @version  1
// @grant    none
// @match        *://*.archiveofourown.org/users/*/stats
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/452773/%5BAO3%5D%20Remove%20Comma%20from%20stats%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/452773/%5BAO3%5D%20Remove%20Comma%20from%20stats%20page.meta.js
// ==/UserScript==


var numbers = document.getElementsByTagName("dd");

for(let number of numbers){
  number.firstChild.nodeValue = number.firstChild.nodeValue.replace(",","");
}