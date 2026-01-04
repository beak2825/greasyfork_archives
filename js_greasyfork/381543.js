// ==UserScript==
// @name         AO3: [Wrangling] Wrangling Home Filter Redux
// @description  A variation on the Wrangling Home Filter script that lets you filter by cowrangled or solo-wrangled fandoms.
// @version      1.0.2

// @author       kaerstyne
// @namespace    https://github.com/kaerstyne/ao3-wrangling-scripts
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tag_wranglers/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381543/AO3%3A%20%5BWrangling%5D%20Wrangling%20Home%20Filter%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/381543/AO3%3A%20%5BWrangling%5D%20Wrangling%20Home%20Filter%20Redux.meta.js
// ==/UserScript==


// SETTINGS //

// Add a list of your cowrangled fandoms below! Replace the example fandoms with your own.
// Put each fandom on a separate line.
// Use the EXACT NAME of the fandom as it appears on your wrangling page.

var cowrangled = `
Dangan Ronpa - All Media Types
Homestuck
Star Wars - All Media Types
`;

// END OF SETTINGS //


var cowrangled_list = cowrangled.trim().split("\n");

(function($) {

    var all_fandoms = $(".assigned tbody tr");

    // check if user has applied alternating row colors to the table
    let alternating_rows = false;
    if (all_fandoms.eq(0).css("background-color") !== all_fandoms.eq(1).css("background-color")) {
      alternating_rows = [
        all_fandoms.children("th[scope='row']").eq(0).css("background-color"), // odd fandom name columns
        all_fandoms.eq(0).css("background-color"), // odd tag columns
        all_fandoms.children("th[scope='row']").eq(1).css("background-color"), // even fandom name columns
        all_fandoms.eq(1).css("background-color") // even tag columns
      ];
    }

    // label fandoms with shared and unwrangled status
    all_fandoms.each(function() {
        var fandom_name = $(this).find("th").text();
        var unwrangled_counts = $(this).find("td").slice(3, 6).text();

        if (cowrangled_list.includes(fandom_name)) {
            $(this).addClass("shared-fandom");
        } else {
            $(this).addClass("solo-fandom");
        }
        if (unwrangled_counts == "   ") {
            $(this).addClass("no-unwrangled");
        }
    });

    // add toggle menu
    $("#user-page table").before("<p id='filter-fandoms'>Filter fandoms:&nbsp;&nbsp;" +
                                 "<a id='shared-unwrangled'>[ shared unwrangled ]</a>&nbsp;&nbsp;" +
                                 "<a id='solo-unwrangled'>[ solo unwrangled ]</a>&nbsp;&nbsp;" +
                                 "<a id='all-unwrangled'>[ all unwrangled ]</a>&nbsp;&nbsp;" +
                                 "<a id='all-fandoms'>[ all fandoms ]</a>" +
                                 "</p>");

    // add toggle functions
    function add_toggle(toggle_class, ...classes_to_hide) {
        $(toggle_class).click(function() {
            all_fandoms.show();
            classes_to_hide.forEach(function(class_to_hide) {
                $(class_to_hide).hide();
            });
            // reapply alternating colors if applicable
            if (alternating_rows) {
              // fun fact, in jQuery the indexes are 0-based so the even/odd designations are backwards from vanilla CSS
              all_fandoms.children("th[scope='row']:visible:even").css("background-color", alternating_rows[0]);
              all_fandoms.filter(":visible:even").css("background-color", alternating_rows[1]);
              all_fandoms.children("th[scope='row']:visible:odd").css("background-color", alternating_rows[2]);
              all_fandoms.filter(":visible:odd").css("background-color", alternating_rows[3]);
            }
            $("#filter-fandoms").find("a").css("font-weight", "normal");
            $(this).css("font-weight", "bold");
        });
    }

    add_toggle("#shared-unwrangled", ".solo-fandom", ".no-unwrangled");
    add_toggle("#solo-unwrangled", ".shared-fandom", ".no-unwrangled");
    add_toggle("#all-unwrangled", ".no-unwrangled");
    add_toggle("#all-fandoms");

})(jQuery);
