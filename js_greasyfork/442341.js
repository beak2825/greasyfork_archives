// ==UserScript==
// @name         AO3: [Wrangling] Synonym Autofill
// @description  Adds buttons to relationship edit tag pages to autofill synonym field from tagged characters
// @version      1.0

// @author       Nexidava
// @namespace    https://greasyfork.org/en/users/725254

// @match        *://*.archiveofourown.org/tags/*/edit
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @downloadURL https://update.greasyfork.org/scripts/442341/AO3%3A%20%5BWrangling%5D%20Synonym%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/442341/AO3%3A%20%5BWrangling%5D%20Synonym%20Autofill.meta.js
// ==/UserScript==

class Tag {
    constructor(tag, western) {
        this.tag = tag
        const match = tag.match(/(.*?) ?(\(.*\))?\s?$/)
        this.name = match[1]
        this.disambig = match[2]
        this.western = western
        this.order = this.getOrder()
    }
    getOrder() {
        var order = this.name
        if (this.western) {
            // put the last name first.  this will unavoidably break with multiple space-separated last names, but does handle middle names
            order = order.split(" | ").map(name => name.split(" ")).map(words => words.slice(-1).concat(words.slice(0,-1)).join(" ")).join(" | ")
        }
        if (this.disambig) {
            order += " " + this.disambig
        }
        return order
    }
}

function autofill($, western) {
    // get character tags
    const charbox = $("dd[title=Characters].tags.listbox.group")
    const taglist = charbox.find("a.tag, li.added.tag")
    const charobj = taglist.map(function(t) { return $(this).contents().filter(function() { return this.nodeType === 3; }).text().trim() })
    var charr = $.makeArray(charobj)
    const name = $("input#tag_name").val()

    // if no chars tagged, get characters from tag
    if (!charr.length) {
        charr = name.split(/\s?[/&]\s?/g)
    }

    // construct and sort char objects
    var chars = charr.map(x => new Tag(x, western))
    chars.sort((a, b) => a.order.localeCompare(b.order))

    // get rel type from tag name
    var sep
    if (name.match(/\//g)) { sep = "/" }
    else if (name.match(/&/g)) { sep = " & " }
    else { sep = " # " ; console.log("Unable to intuit correct rel type, using #") }

    // construct rel tag
    const hasdis = chars.map(x => x.disambig).filter(Boolean)
    const ndis = (new Set(hasdis)).size
    const keep_disambig = $("input[id='keep_disambig']:checked").length === 1
    var tag

    if (ndis == 1 && !keep_disambig) {
        tag = chars.map(x => x.name).join(sep)

        if (hasdis.length == chars.length) {
            tag += " " + chars[0].disambig
        }
    }
    else {
        tag = chars.map(x => x.tag).join(sep)
    }

    var canonical_checkbox = $("input#tag_canonical")
    var syn_autocomplete = $("input#tag_syn_string_autocomplete")

    // if computed tag matches existing name, tick canonical box instead of autofilling
    if (tag === name) {
        canonical_checkbox.prop('checked', true)
        syn_autocomplete.val("")
    }
    // else input rel tag to synonym field and uncheck canonical checkbox if needed
    else {
        canonical_checkbox.prop('checked', false)
        syn_autocomplete.val(tag)
    }
}

// set up buttons
(function($) {
    // only function on relationship tags
    if ($("strong:contains('Relationship')").add("option:selected:contains('Relationship')").length == 0) { return }

    const label = $('<dt><label for="tag_syn_autofill">Autofill Synonym</label></dt>')
    const gf = $('<li><a href="#" id="autofill-gf">Given Family (Western)</a></li>')
    const fg = $('<li><a href="#" id="autofill-fg">Family Given (Eastern)</a></li>')
    const clear = $('<li><a href="#" id="autofill-clear">Clear</a></li>')
    const buttons = $('<ul class="actions" role="menu" style="float: left"></ul>')
    const disambig = $('<ul class="tags commas filters actions" role="menu" style="float: left"><li><label draggable="true" style="cursor: pointer; margin: 0.375em auto; float: left"><span>Disambiguate </span><input type="checkbox" value="1" id="keep_disambig"><span class="indicator" id="kdi" aria-hidden="true"></span></label></li></ul>')
    document.styleSheets[0].addRule('#kdi:before','border: 0; margin-right: 0;')
    const dd = $('<dd></dd>')
    const prev = $("input#tag_syn_string").parent()

    gf.click(x => autofill($, true))
    fg.click(x => autofill($, false))
    clear.click(x => { $("input#tag_syn_string_autocomplete").val(""); $("input#tag_canonical").prop("checked", false) })
    buttons.append(gf, fg, clear)
    dd.append(buttons)
    buttons.after(disambig)
    prev.after(label, dd)

})(jQuery);
