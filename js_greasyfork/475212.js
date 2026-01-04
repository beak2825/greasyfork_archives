// ==UserScript==
// @name        Custom - hotpornfile.org Improved Search Fields
// @namespace   Violentmonkey Scripts
// @match       https://www.hotpornfile.org/?s=*
// @match       https://www.hotpornfile.org/page/*?s=*
// @grant       none
// @version     1.0.3
// @author      KeratosAndro4590
// @description Improves the search function of hotpornfile.org by adding the search terms to the search results input box.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=hotpornfile.org
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/475212/Custom%20-%20hotpornfileorg%20Improved%20Search%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/475212/Custom%20-%20hotpornfileorg%20Improved%20Search%20Fields.meta.js
// ==/UserScript==

var url_string = window.location.href;
var url = new URL(url_string);
var searchText = url.searchParams.get("s");

// Adds search text to field
document.getElementById("s").value = searchText;
//alert(searchText);