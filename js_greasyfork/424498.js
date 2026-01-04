// ==UserScript==
// @name         Startpage.com search result on page title
// @namespace    https://greasyfork.org/en/scripts/424498-startpage-com-search-result-on-page-title
// @version      1.0
// @description  Update Startpage.com search page title with the search term so the tabs are easier to distinguish and organize.
// @author       Author
// @match        https://startpage.com/sp/search*
// @match        https://startpage.com/do/dsearch*
// @match        https://www.startpage.com/sp/search*
// @match        https://www.startpage.com/do/dsearch*
// @grant        none
// @license      GPL v2+, MPL, MIT, BSD, CC0, WTFPL
// @downloadURL https://update.greasyfork.org/scripts/424498/Startpagecom%20search%20result%20on%20page%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/424498/Startpagecom%20search%20result%20on%20page%20title.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.title = `${document.getElementById('q').value} - Startpage.com`;
})();