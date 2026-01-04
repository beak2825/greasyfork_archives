// ==UserScript==
// @name     AO3: [Wrangling] Delete Subtag Field
// @description  Deletes the subtag field from tag edit pages to prevent accidents. Currently only works on canonical tags that have no subtags.

// @version  1
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>


// @match        *://*.archiveofourown.org/tags/*/edit
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/433104/AO3%3A%20%5BWrangling%5D%20Delete%20Subtag%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/433104/AO3%3A%20%5BWrangling%5D%20Delete%20Subtag%20Field.meta.js
// ==/UserScript==


var fields = document.getElementsByClassName('tags listbox group');

for (var i = 0; i < fields.length; i++) {
  if (fields[i].innerText == "Add SubTags:") {
    fields[i].style.visibility = "hidden";
    break;
  }
}
