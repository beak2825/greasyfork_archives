

// ==UserScript==
// @name         AO3: [Wrangling] Open edit pages
// @description  Opens each edit page on a bin wrangling page. Based on endofthyme's Check Unique Tag Users script for getting all the links.
// @version      1.2
// @author       Ebonwing
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
     
// @match        *://*.archiveofourown.org/tags/*/wrangle?*&status=unwrangled
// @match        *://*.archiveofourown.org/tags/*/wrangle?*show=mergers*
// @match        *://*.archiveofourown.org/tags/*/wrangle?*show=relationships*


// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461131/AO3%3A%20%5BWrangling%5D%20Open%20edit%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/461131/AO3%3A%20%5BWrangling%5D%20Open%20edit%20pages.meta.js
// ==/UserScript==

    (function($) {
        // add the button
        var count_users_button = $('<ul class="actions" role="menu"><li><a id="count_users">Open Edit Pages</a></li></ul>');
        $("thead").find("th:contains('Taggings')").append(count_users_button);
     
        $("a[id='count_users']").on("click", function() {
     
            // check each tag
            $("tbody tr").each(function(i, row) {
              console.log(row);
              //the tag mergers page has an additional remove button so retrieving the link isn't the same
              if(window.location.href.includes("&status=unwrangled") && ! window.location.href.includes("show=relationships")){
                 window.open(row.children[5].children[0].children[0].children[0].href);
              }
              if (window.location.href.includes("show=mergers")){
                 window.open(row.children[5].children[0].children[1].children[0].href);
            	}
              if(window.location.href.includes("show=relationships") && !window.location.href.includes("&status=unwrangled")){
                window.open(row.children[6].children[0].children[1].children[0].href);
              }
              if(window.location.href.includes("&status=unwrangled") && window.location.href.includes("show=relationships")){
                window.open(row.children[6].children[0].children[0].children[0].href);
              }
            });
     

        });
    })(jQuery);

  

