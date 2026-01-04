// ==UserScript==
// @name     [AO3 Tag Wrangling] Toggle Remove on all Tags
// @version  1
// @grant    none
// @author   Ebonwing
// @description  Checks off all Remove boxes on a page
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @match        *://*.archiveofourown.org/tags/*/wrangle?*&status=unfilterable
// @match        *://*.archiveofourown.org/tags/*/wrangle?*&status=synonymous
// @match        *://*.archiveofourown.org/tags/*/wrangle?*&status=canonical



// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js

// @namespace https://greasyfork.org/users/819864
// @downloadURL https://update.greasyfork.org/scripts/466525/%5BAO3%20Tag%20Wrangling%5D%20Toggle%20Remove%20on%20all%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/466525/%5BAO3%20Tag%20Wrangling%5D%20Toggle%20Remove%20on%20all%20Tags.meta.js
// ==/UserScript==ccc


  (function($) {
        // add the button
        var count_users_button = $('<ul class="actions" role="menu"><li><a id="count_users">toggle remove</a></li></ul>');
        $("thead").find("th:contains('Taggings')").append(count_users_button);
     
        $("a[id='count_users']").on("click", function() {
     
            // check each tag
            $("tbody tr").each(function(i, row) {
              console.log(row);
              if(! window.location.href.includes("show=relationships")){
                console.log(row.children[5].children[0].children[0].children[0].children[0]);
              	row.children[5].children[0].children[0].children[0].children[0].checked = true;
              } else {
                 console.log(row.children[6].children[0].children[0].children[0].children[0]);
              	row.children[6].children[0].children[0].children[0].children[0].checked = true;
              }

            });
     

        });
    })(jQuery);