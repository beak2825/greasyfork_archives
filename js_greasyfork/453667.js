// ==UserScript==
// @name     AO3: [Wrangling] Numbered fandoms on wrangling page
// @description Numbers fandoms on the wrangling home page. Does not update with scripts that hide fandoms, so the numbering will have gaps if you use both.
// @version  1
// @author   Ebonwing
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @match        *://*.archiveofourown.org/tag_wranglers/*
// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/453667/AO3%3A%20%5BWrangling%5D%20Numbered%20fandoms%20on%20wrangling%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/453667/AO3%3A%20%5BWrangling%5D%20Numbered%20fandoms%20on%20wrangling%20page.meta.js
// ==/UserScript==
 


elem = document.getElementsByTagName("th");

j = 1
for (var i = 0; i < elem.length; i++) {
    if(elem[i].attributes[0].nodeValue == "row"){
      elem[i].firstChild.innerText = j + ". " + elem[i].firstChild.innerText
      j++;
  }
}

