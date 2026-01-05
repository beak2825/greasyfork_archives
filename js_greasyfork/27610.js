// ==UserScript==
// @name         Redacted :: Remove File Lists Search and Collector
// @author       newstarshipsmell
// @namespace    https://greasyfork.org/en/scripts/27610-redacted-remove-file-lists-search-and-collector
// @description  Remove the File Lists Search and Collector panels in the sidebar on artist pages.
// @version      1.0
// @include      https://redacted.ch/artist.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27610/Redacted%20%3A%3A%20Remove%20File%20Lists%20Search%20and%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/27610/Redacted%20%3A%3A%20Remove%20File%20Lists%20Search%20and%20Collector.meta.js
// ==/UserScript==

var fileListsSearch = document.querySelector('.box_search');
fileListsSearch.parentNode.removeChild(fileListsSearch);

var collector = document.querySelector('.box_zipdownload');
collector.parentNode.removeChild(collector);