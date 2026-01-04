// ==UserScript==
// @name     AO3: [Wrangling] Paste Tag into Syn Field
// @description  Adds a button to fill the tag in the syn field, for cases where the canonical is close to the syn.
// @version  1.1
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>


// @match        *://*.archiveofourown.org/tags/*/edit
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/478242/AO3%3A%20%5BWrangling%5D%20Paste%20Tag%20into%20Syn%20Field.user.js
// @updateURL https://update.greasyfork.org/scripts/478242/AO3%3A%20%5BWrangling%5D%20Paste%20Tag%20into%20Syn%20Field.meta.js
// ==/UserScript==


function copyTag(){

  var text = document.getElementById("tag_name");

  var syn = document.getElementById("tag_syn_string_autocomplete");

  syn.value = text.value;

}

  const button = document.createElement("button")
  button.type = "button";
  button.innerText = "Copy tag into syn field"
  button.addEventListener("click", copyTag); 
  var syntext = document.getElementById("tag_syn_string").parentNode;
  syntext.appendChild(button)

 