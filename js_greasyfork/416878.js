// ==UserScript==
// @name         AO3: [Wrangling] Check Unique Tag Users
// @description  Adds a button to count unique users in your unfilterable wrangling bins. Based on Check Tag Status script: https://github.com/kaerstyne/ao3-wrangling-scripts
// @version      0.2

// @author       endofthyme
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/wrangle?*&status=unfilterable
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416878/AO3%3A%20%5BWrangling%5D%20Check%20Unique%20Tag%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/416878/AO3%3A%20%5BWrangling%5D%20Check%20Unique%20Tag%20Users.meta.js
// ==/UserScript==

(function($) {
    // add the button
    var count_users_button = $('<ul class="actions" role="menu"><li><a id="count_users">Count Users</a></li></ul>');
    $("thead").find("th:contains('Taggings')").append(count_users_button);

    // when button is pressed
    $("a[id='count_users']").on("click", function() {

        // check each tag on page
        $("tbody tr").each(function(i, row) {
            var tag_link = $(this).find("a[href$='/works']").attr("href").slice(0, -6);
            var taggings_cell = $(this).find("td[title='taggings']");

            // check the tag's landing page
            $.get(tag_link, function(response) {
                var has_multiple_pages = $(response).find("div.work h4.landmark").size() > 0;

                var users = new Set();
                var user_count = 0;
                // loop through all works
                $(response).find("div.work div.header").each(function(j, row2) {
                    var found_a_user = false;
                    var found_repeat_user_or_orphaned = false;
                    var new_user_set = new Set(users);
                    // loop through all authors on a work
                    $(this).find("a[rel$='author']").each(function(k, row3) {
                        var parsed_user = $(this).text();
                        var check_pseud = parsed_user.match(/[^(]*\(([^)]*)\)/) // do not count pseuds separately
                        if (check_pseud) {
                            parsed_user = check_pseud[1]
                        }
                        if (parsed_user) {
                            found_a_user = true;
                            if (parsed_user == "orphan_account" || users.has(parsed_user)) {
                                found_repeat_user_or_orphaned = true;
                            } else {
                                new_user_set.add(parsed_user);
                            }
                        }
                    });
                    if (found_a_user && !found_repeat_user_or_orphaned) {
                        user_count++;
                        // only add users to list if the work was counted as a unique use
                        for (const x of new_user_set) {
                            users.add(x);
                        }
                    }
                });
                if (user_count > 1 || has_multiple_pages) {
                    taggings_cell.append(" (" + user_count + (has_multiple_pages ? "+" : "") + ")");
                    console.log(user_count);
                }
            });
        });

        // remove the button when finished
        $("ul").remove(":has(li a[id='count_users'])");
    });
})(jQuery);