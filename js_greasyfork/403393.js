// ==UserScript==
// @name          Schoology Overdue Patch
// @namespace     http://ah.ah
// @description	  Fixes that annoying overdue section which crowds the page with unnecessary content. Made by Gautam Mittal, a student on Schoology who wishes he could use Edmodo.
// @include       https://pausd.schoology.com/home
// @version 0.0.1.20200515103617
// @downloadURL https://update.greasyfork.org/scripts/403393/Schoology%20Overdue%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/403393/Schoology%20Overdue%20Patch.meta.js
// ==/UserScript==
// Notes:
//   * is a wildcard character
//   .tld is magic that matches all top-level domains (e.g. .com, .co.uk, .us, etc.)


console.log("You are currently using the Schoology Overdue Patch. To view which Schoology assignments are overdue, disable this extension.")

document.getElementsByClassName("overdue-submissions")[0].remove()
