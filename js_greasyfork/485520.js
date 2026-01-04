// ==UserScript==
// @name         AO3: [Wrangling] Canonize from Spreadsheet with URL Parameters
// @description  Autofills syn field with URL parameter
// @version      0.1

// @author       endofthyme
// @namespace    http://tampermonkey.net/
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>

// @match        *://*.archiveofourown.org/tags/*/edit?*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485520/AO3%3A%20%5BWrangling%5D%20Canonize%20from%20Spreadsheet%20with%20URL%20Parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/485520/AO3%3A%20%5BWrangling%5D%20Canonize%20from%20Spreadsheet%20with%20URL%20Parameters.meta.js
// ==/UserScript==

(function($) {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.has('canontag')) return;

    var canontag = searchParams.get('canontag')

    var syn_autocomplete = $("input#tag_syn_string_autocomplete")
    syn_autocomplete.val(canontag.replaceAll("*s*", "/"))

})(jQuery);