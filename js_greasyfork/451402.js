// ==UserScript==
// @name         AO3: Hide Summaries
// @description  Hides summaries by default, and adds a button to show them
// @version      1.0

// @author       Nexidava
// @namespace    https://greasyfork.org/en/users/725254

// @match        *://*.archiveofourown.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @downloadURL https://update.greasyfork.org/scripts/451402/AO3%3A%20Hide%20Summaries.user.js
// @updateURL https://update.greasyfork.org/scripts/451402/AO3%3A%20Hide%20Summaries.meta.js
// ==/UserScript==

var hideSummaries = true;

function setSummaries($, button, hide) {
    var summaries = $("blockquote.summary")
    if(hide) {
        button.prop("value", "Show Summaries")
        summaries.hide()
    } else {
        button.prop("value", "Hide Summaries")
        summaries.show()
    }
}

function toggleSummaries($, button) {
    hideSummaries = !hideSummaries;
    setSummaries($, button, hideSummaries);
    button.blur()
}

(function($) {
    var button = $('<input class="button" type="button" value="Show Summaries" style="margin:0.3em">')
    setSummaries($, button, hideSummaries)
    button.click(x => { toggleSummaries($, button) })
    $("li.search").prepend(button)
})(jQuery);