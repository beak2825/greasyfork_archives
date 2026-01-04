// ==UserScript==
// @name         AO3: [Wrangling] Fandom Assignment Shortcut Groups
// @description  Adds groups of shortcuts to assign tags to related fandoms more quickly.
// @version      1.4

// @author       Nexidava (original by kaerstyne, contributions by raining_kittens, escctrl)
// @namespace    https://greasyfork.org/en/users/725254
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/edit
// @match        *://*.archiveofourown.org/tags/*/wrangle*
// @match        *://*.archiveofourown.org/tags/search*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457962/AO3%3A%20%5BWrangling%5D%20Fandom%20Assignment%20Shortcut%20Groups.user.js
// @updateURL https://update.greasyfork.org/scripts/457962/AO3%3A%20%5BWrangling%5D%20Fandom%20Assignment%20Shortcut%20Groups.meta.js
// ==/UserScript==


// CONFIG

// !! MAKE SURE TO COPY THIS SOMEWHERE SAFE BEFORE UPDATING !!

// configure custom fandom group associations
// these strings should be the canonical names of fandoms
// when a current or suggested fandom matches a set, all fandoms from that set will be inserted at the beginning of the list of fandoms, in the order listed here
// when a current or suggested fandom matches the first subarray of a nested array, all fandoms from the second subarray will be inserted
var fandom_sets = [
    [
        "Fire Emblem: Fuukasetsugetsu | Fire Emblem: Three Houses",
        "Fire Emblem Musou: Fuukasetsugetsu | Fire Emblem Warriors: Three Hopes",
        "Fire Emblem Series",
    ],
    [ // show Hololive and VShojo in VSAC without showing Hololive in VShojo and vice-versa
       [
           "Virtual Streamer Animated Characters"
       ],
       [
           "Hololive (Virtual Streamers)",
           "VShojo (Virtual Streamers)",
       ]
    ],
    [ // show VSAC in Hololive and VShojo without showing Hololive in VShojo and vice-versa
       [
           "Hololive (Virtual Streamers)",
           "VShojo (Virtual Streamers)",
       ],
       [
           "Virtual Streamer Animated Characters"
       ],
    ],
]

// always append these fandoms to the suggested list, regardless of current or tagged fandoms
var always_fandoms = [
    "No Fandom",
    "Original Work",
]

// only display the last pipe of fandoms if true
// show the full fandom names if false
var last_pipe_only = true

// further customize nicknames with canonical:nickname pairs
// these nicknames will appear exactly as written, ignoring last_pipe_only (and can therefore be used to selectively disable it)
var custom_nicknames = {
    "The Locked Tomb Series | Gideon the Ninth Series - Tamsyn Muir": "The Locked Tomb Series",
    "Hourou Musuko | Wandering Son": "Hourou Musuko | Wandering Son",
}

// enable for tag search
var do_tag_search = false

// fandom list for tag search
var tag_search_fandoms = [
    "No Fandom",
]


// CODE

// construct sets
fandom_sets = fandom_sets.map(set => {
    if (Array.isArray(set[0])) {
        return [new Set(set[0]), new Set(set[1])]
    } else {
        let temp = new Set(set)
        return [temp, temp]
    }
})

// helper functions
function encodeTagURL(tag) {
    return "https://archiveofourown.org/tags/" + encodeURI(tag).replace("/", "*s*").replace(".", "*d*").replace("#", "*h*").replace("?", "*q*").replace("&", "*a*") + "/edit";
};

function intersect(a, b) {
    return new Set(Array.from(a).filter(x => b.has(x)));
}

function union(a, b) {
    return new Set([...a, ...b]);
}

function format_fandom(string) {
    return custom_nicknames[string] || (last_pipe_only ? string.split(" | ").slice(-1)[0] : string)
}

function get_fandom_groups(current_fandoms) {
    var new_fandoms = new Set(current_fandoms)
    for (let fandom_set of fandom_sets.reverse()) {
        // if current fandom in a set, add all fandoms from the set
        if (intersect(fandom_set[0], current_fandoms).size !== 0) {
            // place disjoint sets after initial entry, otherwise before
            if (fandom_set[0] === fandom_set[1]) {
                new_fandoms = union(fandom_set[1], new_fandoms);
            } else {
                new_fandoms = union(new_fandoms, fandom_set[1]);
            }
        }
    }
    return union(new_fandoms, always_fandoms)
}


(function($) {

    // which page is this?
    var page_url = window.location.pathname;

    // unwrangled bin
    if (page_url.includes("/wrangle")) {

        // add shortcut checkboxes
        var current_fandom = $("h2.heading a").text();
        var fandom_shortcuts = $('<ul class="filters" style="padding-bottom: .643em;"></ul>');
        var suggested_fandoms = new Set([current_fandom]);

        suggested_fandoms = get_fandom_groups(suggested_fandoms)

        for (let fandom of suggested_fandoms) {
            var escaped_fandom = fandom.replace(/"/g, "&quot;");
            fandom_shortcuts.append('<li style="display: inline-block; margin: 0.1em 0"><label>' +
                                    '<input type="checkbox" name="fandom_shortcut" value="' + escaped_fandom + '">' +
                                    '<span class="indicator" aria-hidden="true"></span>' +
                                    '<span>' + format_fandom(fandom) + '</span>' +
                                    '</label></li>');
        }
        $("dd[title='wrangle to fandom(s)']").prepend(fandom_shortcuts);

        // deselect any previously selected fandoms when selecting a new fandom
        $("input[name='fandom_shortcut']").change(function() {
            $("li.added.tag").remove();
            $("input#fandom_string").val("");
        });

        // add fandom on form submit
        $("form#wrangulator").submit(function() {
            var selected_fandoms = $("input[name='fandom_shortcut']:checked").map((i,v) => v.value).toArray().join(",")
            if (selected_fandoms) {
                var fandom_input = $("input#fandom_string");
                var existing_fandoms = fandom_input.val();
                var separator = existing_fandoms == "" ? "" : ",";
                fandom_input.val(existing_fandoms + separator + selected_fandoms);
            }
        });

    // tag edit page
    } else if (page_url.includes("/edit")) {

        function create_fandom_checkbox(name) {
            const escaped_name = name.replace(/"/g, "&quot;");
            return $("<li></li>").html(`<label>
                                        <input type="checkbox" name="fandom_shortcuts" value="${escaped_name}">
                                        <span class="indicator" aria-hidden="true"></span>
                                        <span><a class="tag" href="${encodeTagURL(name)}">${format_fandom(name)}</a></span>
                                        </label>`);
        }

        // add shortcut checkboxes
        const fandom_list = $("dt:contains('Suggested Fandoms')").next().find("ul");
        fandom_list.addClass("filters");
        var suggested_fandoms = new Set($("dt:contains('Suggested Fandoms')").next().find("li").map(function() {
          return $(this).text();
        }).get());

        suggested_fandoms = get_fandom_groups(suggested_fandoms)
        fandom_list.html(Array.from(suggested_fandoms).map(create_fandom_checkbox));

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

    // tag search page
    } else if (page_url.includes("/search") && do_tag_search && tag_search_fandoms) {

        var fandom_tickies = $('<ul class="filters" style="padding-top: .643em;"></ul>');
        for (let fandom of tag_search_fandoms) {
            var escaped_name = fandom.replace(/"/g, "&quot;");
            fandom_tickies.append('<li style="display: inline-block; margin: 0.1em 0;"><label>' +
                                    '<input type="checkbox" name="fandom_shortcut" value="' + escaped_name + '">' +
                                    '<span class="indicator" aria-hidden="true"></span>' +
                                    '<span>' + fandom + '</span>' +
                                    '</label></li>');
        }
        $("#tag_search_fandoms_autocomplete").parent().parent().prepend(fandom_tickies);

        // deselect any previously selected fandoms when selecting a new fandom
        $("input[name='fandom_shortcut']").change(function() {
            $("li.added.tag").remove();
        });

        // add fandom on form submit
        $("form#new_tag_search").submit(function() {
            var search_fandoms = $("input[name='fandom_shortcut']:checked").map((i,e) => e.value).toArray()
            // get existing fandom filters from added tags since input#tag_search_fandoms doesn't reflect removed tags
            $("li.added.tag").contents(":not(span)").map((i,e)=>search_fandoms.push(e.data.trim()))
            // filter empty values and duplicates
            search_fandoms = [...new Set(search_fandoms)].filter(e => e)
            $("input#tag_search_fandoms").val(search_fandoms.join(","));
        });
   }

})(jQuery);