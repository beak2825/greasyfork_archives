// ==UserScript==
// @name         AO3: [Wrangling] Fandom Assignment Shortcuts with AMTs
// @description  Adds some shortcuts to assign tags to fandoms more quickly.
// @version      1.7.1

// @author       Rhine
// @namespace    https://greasyfork.org/en/users/676543-rhine
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/edit
// @match        *://*.archiveofourown.org/tags/*/wrangle*&status=unwrangled
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422386/AO3%3A%20%5BWrangling%5D%20Fandom%20Assignment%20Shortcuts%20with%20AMTs.user.js
// @updateURL https://update.greasyfork.org/scripts/422386/AO3%3A%20%5BWrangling%5D%20Fandom%20Assignment%20Shortcuts%20with%20AMTs.meta.js
// ==/UserScript==

(function($) {

    // which page is this?
    var page_url = window.location.pathname;

    // unwrangled bin
    if (page_url.includes("/wrangle")) {

        // add shortcut checkboxes
        var current_fandom = $("h2.heading a").text();
        var fandoms_to_add = [current_fandom, "DCU", "DCU (Comics)", "Arrow (TV 2012)", "Batman - All Media Types", "The Flash - All Media Types", "Green Arrow (Comics)", "Green Lantern - All Media Types", "Justice League - All Media Types", "Superman - All Media Types", "Wonder Woman - All Media Types", "Watchmen - All Media Types", "Dangan Ronpa - All Media Types", "Pocket Monsters | Pokemon - All Media Types", "Rockman | Mega Man - All Media Types", "Original Work", "No Fandom"];
        var fandom_shortcuts = $('<ul class="filters" style="padding-bottom: .643em;"></ul>');
        for (let fandom of fandoms_to_add) {
            var escaped_fandom = fandom.replace(/"/g, "&quot;");
            fandom_shortcuts.append('<li style="display: inline"><label>' +
                                    '<input type="checkbox" name="fandom_shortcut" value="' + escaped_fandom + '">' +
                                    '<span class="indicator" aria-hidden="true"></span>' +
                                    '<span>' + fandom + '</span>' +
                                    '</label></li>');
        }
        $("dd[title='wrangle to fandom(s)']").prepend(fandom_shortcuts);

        // you should only have one fandom checked at once
        $("input[name='fandom_shortcut']").change(function() {
            $("input[name='fandom_shortcut']").not(this).prop("checked", false);
        });

        // add fandom on form submit
        $("form#wrangulator").submit(function() {
            var selected_fandom = $("input[name='fandom_shortcut']:checked").val();
            if (selected_fandom) {
                var fandom_input = $("input#fandom_string");
                var existing_fandoms = fandom_input.val();
                var separator = existing_fandoms == "" ? "" : ",";
                fandom_input.val(existing_fandoms + separator + selected_fandom);
            }
        });

    // tag edit page
    } else if (page_url.includes("/edit")) {

        // add shortcut checkboxes
        $("dt:contains('Suggested Fandoms')").next().find("ul").addClass("filters");
        var suggested_fandoms = $("dt:contains('Suggested Fandoms')").next().find("li");
        suggested_fandoms.each(function() {
            var fandom_link = $(this).html();
            var escaped_fandom = $(this).text().replace(/"/g, "&quot;");
            $(this).html('<label>' +
                         '<input type="checkbox" name="fandom_shortcuts" value="' + escaped_fandom + '">' +
                         '<span class="indicator" aria-hidden="true"></span>' +
                         '<span>' + fandom_link + '</span>' +
                         '</label>');
        });
        
        var amt_to_add = ["DCU", "DCU (Comics)", "Batman - All Media Types", "Green Lantern - All Media Types", "Green Lantern (Comics)", "Arrow (TV 2012)", "DC Extended Universe", "The Flash - All Media Types", "Green Arrow (Comics)", "Justice League - All Media Types", "Superman - All Media Types", "Teen Titans - All Media Types", "Wonder Woman - All Media Types", "Young Justice - All Media Types", "Watchmen - All Media Types", "Azur Lane (Anime)", "Coraline (2009)", "Coraline - Neil Gaiman", "The Scarlet Pimpernel Series - Baroness Orczy", "Final Fantasy IV: The After Years", "Pocket Monsters: Red & Green & Blue & Yellow | Pokemon Red Green Blue Yellow Versions", "Pocket Monsters: Gold & Silver & Crystal | Pokemon Gold Silver Crystal Versions", "Pocket Monsters: Ruby & Sapphire & Emerald | Pokemon Ruby Sapphire Emerald Versions", "Pocket Monsters: Diamond & Pearl & Platinum | Pokemon Diamond Pearl Platinum Versions", "Pocket Monsters: Black & White | Pokemon Black and White Versions", "Pocket Monsters: X & Y | Pokemon X & Y Versions", "Pocket Monsters: Sun & Moon | Pokemon Sun & Moon Versions", "Pocket Monsters: Sword & Shield | Pokemon Sword & Shield Versions", "Pocket Monsters | Pokemon (Main Video Game Series)", "Pocket Monsters | Pokemon (Anime)", "Pocket Monsters | Pokemon - All Media Types", "Dangan Ronpa - All Media Types", "僕のヒーローアカデミア | Boku no Hero Academia | My Hero Academia", "Rockman | Mega Man - All Media Types", "Rockman | Mega Man Classic", "Rockman X | Mega Man X", "Rockman Zero | Mega Man Zero", "Rockman ZX | Mega Man ZX", "Rockman DASH Series | Mega Man Legends", "Original Work", "No Fandom"];
        var amt_shortcuts = $('<ul class="tags commas" class="filters"></ul>');
        for (let amt of amt_to_add) {
            var escaped = amt.replace(/"/g, "&quot;");
            amt_shortcuts.append('<li class="tag" style="display: inline"><label>' +
                                 '<input type="checkbox" name="fandom_shortcuts" value="' + escaped + '">' +
                                 '<span class="indicator" aria-hidden="true"></span>' +
                                 '<span><a href="/tags/' + amt + '/edit">' + amt + '</a></span>' +
                                 '</label></li>');
        }
        $("dt:contains('Suggested Fandoms')").next().find("ul").prepend(amt_shortcuts);

        // add fandoms on form submit
        $("form#edit_tag").submit(function() {
            var selected_fandoms = $("input[name='fandom_shortcuts']:checked").map(function() {
                return $(this).val();
            }).toArray().join();
            var fandom_input = $("input#tag_fandom_string");
            var existing_fandoms = fandom_input.val();
            var separator = existing_fandoms == "" ? "" : ",";
            fandom_input.val(existing_fandoms + separator + selected_fandoms);
        });

    }

})(jQuery);
