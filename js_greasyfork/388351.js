// ==UserScript==
// @name         AO3: [Wrangling] Fandom Assignment Shortcuts
// @description  Adds some shortcuts to assign tags to fandoms more quickly.
// @version      1.1

// @author       kaerstyne
// @namespace    https://github.com/kaerstyne/ao3-wrangling-scripts
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/edit
// @match        *://*.archiveofourown.org/tags/*/wrangle*&status=unwrangled
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388351/AO3%3A%20%5BWrangling%5D%20Fandom%20Assignment%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/388351/AO3%3A%20%5BWrangling%5D%20Fandom%20Assignment%20Shortcuts.meta.js
// ==/UserScript==

(function($) {

    // which page is this?
    var page_url = window.location.pathname;

    // unwrangled bin
    if (page_url.includes("/wrangle")) {

        // add shortcut checkboxes
        var current_fandom = $("h2.heading a").text();
        var fandoms_to_add = [current_fandom, "No Fandom", "Original Work"];
        var fandom_shortcuts = $('<ul class="filters" style="padding-bottom: .643em;"></ul>');
        for (let fandom of fandoms_to_add) {
            var escaped_fandom = fandom.replace(/"/g, "&quot;");
            fandom_shortcuts.append('<li style="display: inline"><label>' +
                                    '<input type="checkbox" name="fandom_shortcut" value="' + escaped_fandom + '">' +
                                    '<span class="indicator" aria-hidden="true"></span>' +
                                    '<span>' + fandom + '</span>' +
                                    '</label></li>');
        }
        $("dd[title='wrangle to fandom(s)'").prepend(fandom_shortcuts);

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

        function create_fandom_checkbox(name, url) {
          const escaped_name = name.replace(/"/g, "&quot;");
          return $("<li></li>").html(`<label>
                               <input type="checkbox" name="fandom_shortcuts" value="${escaped_name}">
                               <span class="indicator" aria-hidden="true"></span>
                               <span><a class="tag" href="${url}">${name}</a></span>
                               </label>`);
        }

        // add shortcut checkboxes
        const fandom_list = $("dt:contains('Suggested Fandoms')").next().find("ul");
        fandom_list.addClass("filters");
        var suggested_fandoms = $("dt:contains('Suggested Fandoms')").next().find("li").map(function() {
          return [[ $(this).text(), $(this).find("a")[0].href ]];
        }).get();
        suggested_fandoms.push(["No Fandom", "/tags/No%20Fandom/edit"]);
        suggested_fandoms.push(["Original Work", "/tags/Original%20Work/edit"]);
        fandom_list.html(suggested_fandoms.map(([name, link]) => create_fandom_checkbox(name, link)));

        // add fandoms on form submit
        $("form#edit_tag").submit(function() {
            var selected_fandoms = $("input[name='fandom_shortcuts']:checked").map(function() {
                return $(this).val();
            }).toArray().join();
            var fandom_input = $("input#tag_fandom_string");
            var existing_fandoms = fandom_input.val();
            var separator = existing_fandoms == "" ? "" : ","
            fandom_input.val(existing_fandoms + separator + selected_fandoms);
        });

    }

})(jQuery);
