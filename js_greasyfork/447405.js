// ==UserScript==
// @name         AO3: [Wrangling] raining_kittens' Fandom Assignment Shortcuts
// @description  Adds some shortcuts to assign tags to raining_kittens' fandoms more quickly.
// @version      1.2

// @author       kaerstyne (edits owlwinter)
// @namespace    https://github.com/kaerstyne/ao3-wrangling-scripts
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/edit
// @match        *://*.archiveofourown.org/tags/*/wrangle*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447405/AO3%3A%20%5BWrangling%5D%20raining_kittens%27%20Fandom%20Assignment%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/447405/AO3%3A%20%5BWrangling%5D%20raining_kittens%27%20Fandom%20Assignment%20Shortcuts.meta.js
// ==/UserScript==

(function($) {

    // which page is this?
    var page_url = window.location.pathname;

    // unwrangled bin
    if (page_url.includes("/wrangle")) {

        let current_fandom = {nickname: document.querySelector("#main > h2 > a").innerText, propername: document.querySelector("#main > h2 > a").innerText}

        let bin_shortcuts = [];

        //Nickname is what you want to appear on the fandom checklist
        //Propername is the canonized fandom name
        bin_shortcuts.push({nickname: "No Fandom", propername: "No Fandom"});
        bin_shortcuts.push({nickname: "Original Work", propername: "Original Work"});
        bin_shortcuts.push({nickname: "Hero Academia", propername: "僕のヒーローアカデミア | Boku no Hero Academia | My Hero Academia"});
        bin_shortcuts.push({nickname: "Bleach", propername: "Bleach"});
        bin_shortcuts.push({nickname: "Scum Villain's Self-Saving System", propername: "人渣反派自救系统 - 墨香铜臭 | The Scum Villain's Self-Saving System - Mòxiāng Tóngxiù"});
        bin_shortcuts.push({nickname: "Scumbag System", propername: "穿书自救指南 | Scumbag System (Cartoon)"});

        //Include the current fandom, if it's not already in the list
        if (bin_shortcuts.filter(item => item.propername == current_fandom.propername).length == 0) {
            bin_shortcuts.unshift(current_fandom);
        }

        var fandom_shortcuts = $('<ul class="filters" style="padding-bottom: .643em;"></ul>');
        for (let fandom of bin_shortcuts) {
             var escaped_fandom = fandom.propername.replace(/"/g, "&quot;");
             fandom_shortcuts.append('<li style="display: inline"><label>' +
                                     '<input type="checkbox" name="fandom_shortcut" value="' + fandom.propername + '">' +
                                     '<span class="indicator" aria-hidden="true"></span>' +
                                     '<span>' + fandom.nickname + '</span>' +
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

        function create_fandom_checkbox(nickname, propername, url, used) {
            const escaped_name = propername.replace(/"/g, "&quot;");
            if (used) {
                return $("<li></li>").html(`<label>
                               <input type="checkbox" name="fandom_shortcuts" value="${propername}">
                               <span class="indicator" aria-hidden="true"></span>
                               <span><b><a class="tag" href="${url}">${nickname}</a></b></span>
                               </label>`);
            }
            return $("<li></li>").html(`<label>
                               <input type="checkbox" name="fandom_shortcuts" value="${propername}">
                               <span class="indicator" aria-hidden="true"></span>
                               <span><a class="tag" href="${url}">${nickname}</a></span>
                               </label>`);
        }

        // add shortcut checkboxes
        const fandom_list = $("dt:contains('Suggested Fandoms')").next().find("ul");
        fandom_list.addClass("filters");
        var suggested_fandoms = $("dt:contains('Suggested Fandoms')").next().find("li").map(function() {
            return [{nickname: $(this).text(), propername: $(this).text(), url: $(this).find("a")[0].href, used:true }];
        }).get();

        //Nickname is what you want to appear on the fandom checklist
        //Propername is the canonized fandom name
        suggested_fandoms.push({nickname: "No Fandom", propername: "No Fandom", url: "/tags/No%20Fandom/edit", used:false});
        suggested_fandoms.push({nickname: "Original Work", propername: "Original Work", url: "/tags/Original%20Work/edit", used:false});
        suggested_fandoms.push({nickname: "Boku no Hero Academia", propername: "僕のヒーローアカデミア | Boku no Hero Academia | My Hero Academia", url: "/tags/僕のヒーローアカデミア%20%7C%20Boku%20no%20Hero%20Academia%20%7C%20My%20Hero%20Academia/edit", used:false});
        suggested_fandoms.push({nickname: "Bleach", propername: "Bleach", url: "/tags/Bleach/edit", used:false});
        suggested_fandoms.push({nickname: "Scum Villain's Self-Saving System", propername: "人渣反派自救系统 - 墨香铜臭 | The Scum Villain's Self-Saving System - Mòxiāng Tóngxiù", url: "/tags/人渣反派自救系统%20-%20墨香铜臭%20%7C%20The%20Scum%20Villain's%20Self-Saving%20System%20-%20Mòxiāng%20Tóngxiù/edit", used:false});
        suggested_fandoms.push({nickname: "Scumbag System", propername: "穿书自救指南 | Scumbag System (Cartoon)", url: "/tags/穿书自救指南%20%7C%20Scumbag%20System%20(Cartoon)/edit", used:false});

        var deduplicated_fandoms = [];
        suggested_fandoms.forEach(oi => {
            if (deduplicated_fandoms.filter(item => item.propername == oi.propername).length == 0) {
                deduplicated_fandoms.push(oi);
            }
        })
        fandom_list.html(deduplicated_fandoms.map(({nickname, propername, url, used}) => create_fandom_checkbox(nickname, propername, url, used)));

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