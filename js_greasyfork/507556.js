// ==UserScript==
// @name         AO3: [Wrangling] Add Characters from relationship
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add Characters from relationship
// @author       daydreamorama
// @match        *://*.archiveofourown.org/tags/*/edit
// @grant        none
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @downloadURL https://update.greasyfork.org/scripts/507556/AO3%3A%20%5BWrangling%5D%20Add%20Characters%20from%20relationship.user.js
// @updateURL https://update.greasyfork.org/scripts/507556/AO3%3A%20%5BWrangling%5D%20Add%20Characters%20from%20relationship.meta.js
// ==/UserScript==

var counter = 0
var chars

function getTags($) {
    // get character tags
    const name = $("input#tag_name").val()
    chars = name.split(/\s?[/&]\s?/g)
}

function autofill($) {
    var tag = chars[counter]
    counter++

    //console.log("filling in " + tag + " for " + counter)

    var char_autocomplete = $("input#tag_character_string_autocomplete")
    char_autocomplete.val(tag)
    char_autocomplete.focus()

    // prevent window from jumping to the top
    return false
}

// set up buttons
(function($) {
    // only function on relationship tags
    if ($("strong:contains('Relationship')").add("option:selected:contains('Relationship')").length == 0) { return }

    const fill = $('<li><a href="#" id="autofill-fill">Fill</a></li>')
    const buttons = $('<ul class="actions" role="menu" style="float: left"></ul>')
    const dd = $('<dd></dd>')
    const prev = $("input#tag_character_string_autocomplete").parent()

    // get all characters involved first
    getTags($)

    fill.click(x => autofill($))
    buttons.append(fill)
    dd.append(buttons)
    prev.after(dd)

})(jQuery);