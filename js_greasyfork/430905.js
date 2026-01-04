// ==UserScript==
// @name           AO3: [Wrangling] Character Counter when Creating New Tags
// @description    find out how long your tag is right as you put it in
// @version        1.1
// @author         Rhine
// @namespace      https://github.com/RhineCloud
// @match          https://*.archiveofourown.org/tags/new
// @match          https://*.archiveofourown.org/tags/*/edit
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant          none
// @license        GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @downloadURL https://update.greasyfork.org/scripts/430905/AO3%3A%20%5BWrangling%5D%20Character%20Counter%20when%20Creating%20New%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/430905/AO3%3A%20%5BWrangling%5D%20Character%20Counter%20when%20Creating%20New%20Tags.meta.js
// ==/UserScript==

(function($) {
    // find out which page is open
    var page_url = window.location.pathname;
    // how to find the relevant elements on tag edit pages
    var legend_sel = '#edit_tag [for="tag_syn_string_autocomplete"]';
    var field_sel = '#edit_tag #tag_syn_string_autocomplete';
    // how to find the relevant bits on the new tag page instead
    if (page_url.endsWith('/tags/new')) {
        legend_sel = '#new_tag [for="tag_name"]';
        field_sel = '#new_tag #tag_name';
    }
    var tag_length = 0;
    // add the neutral/default counter text
    $(legend_sel).append('<span style="font-size:0.8em;">&nbsp; (tag&nbsp;length:&nbsp;' +
                         '<span class="counted_length">...</span>)</span>');
    // do this thing once the typing is done
    $(field_sel).on('keyup', function() {
        // find out what was entered
        var tag_input = $(this).val();
        // figure out the length of the input
        if (tag_input) {tag_length = tag_input.length;}
        // insert the length into the counter text
        $('.counted_length').text(tag_length);
        // change the appearance of the field
        // depending on whether the resulting tag would be too long
        if (tag_length > 150) {
            $(this).css({'color':'white',
                         'background-color':'darkred'});
        } else {
            $(this).css({'color':'#222',
                         'background-color':'honeydew'});
        }
    });
})(jQuery);
