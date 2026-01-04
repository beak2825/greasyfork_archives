// ==UserScript==
// @name     AO3: [Wrangling] Autofill Not Beta Read on no beta we die like... tags 
// @description  Fills in the Not Beta Read canonical on applicable tags.
// @version  1
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>


// @match        *://*.archiveofourown.org/tags/*/edit
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/478265/AO3%3A%20%5BWrangling%5D%20Autofill%20Not%20Beta%20Read%20on%20no%20beta%20we%20die%20like%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/478265/AO3%3A%20%5BWrangling%5D%20Autofill%20Not%20Beta%20Read%20on%20no%20beta%20we%20die%20like%20tags.meta.js
// ==/UserScript==


var text = document.getElementById("tag_name");

var syntext = document.getElementById("tag_syn_string");

if(text.value.toLowerCase().includes("no beta we")){
   syntext.value = "Not Beta Read";
 }
