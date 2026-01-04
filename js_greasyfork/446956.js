// ==UserScript==
// @name         AO3: [Wrangling] Personalized Fandom Assignment Shortcuts
// @description  Adds some shortcuts to assign tags to fandoms more quickly
// @version      1.0

// @author       kaerstyne (edits owlwinter)
// @namespace    https://github.com/kaerstyne/ao3-wrangling-scripts
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/edit
// @match        *://*.archiveofourown.org/tags/*/wrangle*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446956/AO3%3A%20%5BWrangling%5D%20Personalized%20Fandom%20Assignment%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/446956/AO3%3A%20%5BWrangling%5D%20Personalized%20Fandom%20Assignment%20Shortcuts.meta.js
// ==/UserScript==

(function($) {

    // which page is this?
    var page_url = window.location.pathname;

    // unwrangled bin
    if (page_url.includes("/wrangle")) {

        var fandoms_to_add;

        if (page_url.includes("tags/The%20Expanse%20(TV)/")) {
            fandoms_to_add = ["The Expanse Series - James S. A. Corey", "Original Work", "No Fandom"]
        } else if (page_url.includes("/tags/The%20Expanse%20Series%20-%20James%20S*d*%20A*d*%20Corey/")) {
            fandoms_to_add = ["The Expanse (TV)", "Original Work", "No Fandom"]
        } else if (page_url.indexOf('/tags/Dragon%20Age') !== -1) {
            fandoms_to_add = ["Dragon Age - All Media Types", "Original Work", "No Fandom"]
        } else if (page_url.includes("tags/The%20Last%20Kingdom%20(TV)/")) {
            fandoms_to_add = ["The Warrior Chronicles | The Saxon Stories - Bernard Cornwell", "Original Work", "No Fandom"]
        } else if (page_url.includes("tags/American%20Revolution%20RPF/") || page_url.includes("/tags/Turn%20(TV%202014)/")) {
            fandoms_to_add = ["18th Century CE RPF", "Original Work", "No Fandom"]
        } else if (page_url.includes("/tags/Historical%20RPF/")) {
            fandoms_to_add = ["15th Century CE RPF", "16th Century CE RPF", "17th Century CE RPF", "18th Century CE RPF", "19th Century CE RPF", "20th Century CE RPF", "Original Work", "No Fandom"]
        }

        // add shortcut checkboxes
        var current_fandom = $("h2.heading a").text();
        if (fandoms_to_add == null) {
           fandoms_to_add = [current_fandom, "Original Work", "No Fandom"];
        } else if (!fandoms_to_add.includes(current_fandom)) {
            fandoms_to_add.unshift(current_fandom);
        }
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
        function create_fandom_checkbox(name, url, used) {
          const escaped_name = name.replace(/"/g, "&quot;");
          if (used) {
             return $("<li></li>").html(`<label>
                               <input type="checkbox" name="fandom_shortcuts" value="${escaped_name}">
                               <span class="indicator" aria-hidden="true"></span>
                               <span><b><a class="tag" href="${url}">${name}</a></b></span>
                               </label>`);
          }
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
          return [{name: $(this).text(), url: $(this).find("a")[0].href, used:true }];
        }).get();

        suggested_fandoms.push({name: "No Fandom", url: "/tags/No%20Fandom/edit", used:false});
        suggested_fandoms.push({name: "Original Work", url: "/tags/Original%20Work/edit", used:false});

        var deduplicated_fandoms = [];
        suggested_fandoms.forEach(oi => {
            if (deduplicated_fandoms.filter(item => item.name == oi.name).length == 0) {
                deduplicated_fandoms.push(oi);
            }
        })
        fandom_list.html(deduplicated_fandoms.map(({name, url, used}) => create_fandom_checkbox(name, url, used)));

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