// ==UserScript==
// @name         AO3: [Wrangling] Edit Tag page cleanup
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @description  Removes descriptions and some fields from Edit Tag pages to avoid wrangling accidents
// @author       escctrl
// @version      6.2
// @match        *://*.archiveofourown.org/tags/*/edit
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/491888/1355841/Light%20or%20Dark.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446941/AO3%3A%20%5BWrangling%5D%20Edit%20Tag%20page%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/446941/AO3%3A%20%5BWrangling%5D%20Edit%20Tag%20page%20cleanup.meta.js
// ==/UserScript==
 
/* eslint-disable no-multi-spaces */
/* global jQuery, lightOrDark */

(function($) {
    'use strict';
 
    // store commonly referred to IDs to reduce DOM traversal
    const fieldCanonical = $('#tag_canonical');
    const fieldUnwrangleable = $('#tag_unwrangleable');
    const fieldSynonym = $('#tag_syn_string');
    const formEdit = $('#edit_tag');

    // Checks if using a dark mode by calculating the 'brightness' of the page background color
    const colorHighlight = lightOrDark(window.getComputedStyle(document.body).backgroundColor) == "dark" ? 'rgb(132, 107, 8)' : 'yellow' ;

    // remove all descriptions to save space. experienced wranglers know them by heart
    $(formEdit).find('dl dd p').not('.actions').hide();
 
    // what's the status of my tag?
    const is_canonical = $(fieldCanonical).prop('checked');
    const is_unwrangleable = $(fieldUnwrangleable).prop('checked');
    const is_synonym = ($(fieldSynonym).prev().find("li.added").length === 1) ? true : false;
 
    // if the tag is two things at once, something was already incorrect, and we'd rather display all fields again to allow fixing it
    if (is_canonical && (is_unwrangleable || is_synonym) || (is_unwrangleable && is_synonym)) { return false; }

    // to watch if a new fandom gets added or removed (we only use this when the tag is marked unwrangleable)
    const newFandom = new MutationObserver(function(mutList, obs) {
        for (const mut of mutList) { for (const node of mut.addedNodes) {
            // check if the added node is a new fandom
            if (node.nodeType === 1 && node.nodeName === 'LI') {
                unwrangleable_has_fandom(); // alert user if the selected fandom is No Fandom, or none was selected yet
            }
        }}
        for (const mut of mutList) { for (const node of mut.removedNodes) {
            // check if the added node is a new fandom
            if (node.nodeType === 1 && node.nodeName === 'LI') {
                unwrangleable_has_fandom(); // alert user if the selected fandom is No Fandom, or none was selected yet
            }
        }}
    });

    // if the tag is not canonical
    if (!is_canonical) {
        $(formEdit).find('dd[title="MetaTags"]').hide().prev().hide(); // remove the metatag field

        // on non-canonical fandoms remove the fandom signup link
        // why not on other tag types? they're either unwrangled (no fandom = no signup link) or wrangled to a canonical fandom (link points to correct fandom)
		if ($('#tag_sortable_name').length > 0) { // only fandom tags have the name-for-sorting field
            if (is_synonym) $(formEdit).find('a[href*="/tag_wranglers?"]').hide().before("To assign this fandom to yourself, go to the canonical tag it's synned to.");
            else $(formEdit).find('a[href*="/tag_wranglers?"]').hide().before("You can't assign this fandom to yourself because the tag is not canonical.");
        }
    }
 
    if (is_canonical) {
        // remove the unwrangleable button
        hide_fields(false, true, false);
 
        /*
        // disable the canonical checkbox if there is a metatag (to avoid the filter bug)
        if ($('#parent_MetaTag_associations_to_remove_checkboxes').length == 1) {
            $(fieldCanonical).prop("disabled", true);

            // if the metatags get selected for deletion, let the canonical checkbox be edited too
            $('#parent_MetaTag_associations_to_remove_checkboxes').on('change', 'input[type="checkbox"]', () => {
                if ($('#parent_MetaTag_associations_to_remove_checkboxes').find('input[type="checkbox"]').not(':checked').length === 0) $(fieldCanonical).prop("disabled", false);
                else $(fieldCanonical).prop('checked', true).prop("disabled", true);
            });
        }
        */
 
        // remove the Add Subtags and Add Synonyms fields
        // there's a button to show the fields when you need them, but if you don't want this at all, add // at the beginning of the next line
        hide_addsubsyn();
    }
    else if (is_synonym) {
        // remove the canonical and unwrangleable button
        hide_fields(true, true, false);
 
        // make the canonical tag itself an edit link like all other referenced tags on this page. then the Edit button can be removed
        var taglink = $(fieldSynonym).siblings('p.actions').hide().find('a').attr("href");
        $(fieldSynonym).siblings('ul.autocomplete').find('li.added').contents().first().wrap('<a class="tag" href="'+taglink+'"></a>');
    }
    else if (is_unwrangleable) {
        hide_fields(true, false, true); // remove canonical button and synonym field
        $(fieldUnwrangleable).parent().prev().css('background-color', colorHighlight); // highlight the label for awareness
        unwrangleable_has_fandom(); // alert user if the selected fandom is No Fandom, or none was selected yet
        newFandom.observe($('dd[title="Fandoms"] .autocomplete').get(0), { attributes: false, childList: true, subtree: false }); // start listening to fandoms being added/removed
    }
    else {
        document.getElementById('tag_syn_string_autocomplete').focus();
    }
 
    // highlight if the tag is draft only, or a syn with zero uses
    // retrieve the numbers showing in the sidebar. we only need ones that are not linked (drafts, private bookmarks, collections, total taggings)
    const taggings = {};
    $('#dashboard').filter('.tag.wrangling').find('li span').each( function() {
        // we grab the text, match only the number in it, convert it from string to int
        if ($(this).text().trim().startsWith("Drafts")) taggings.drafts = [parseInt($(this).text().match(/\d+/g)), $(this)];
        if ($(this).text().trim().startsWith("Taggings Count")) taggings.total = [parseInt($(this).text().match(/\d+/g)), $(this)];
    });
 
    // if drafts and total count are equal (and total count not zero), the tag is draft only
    if (taggings.drafts[0] === taggings.total[0] && taggings.total[0] > 0) {
        $(taggings.drafts[1])
            .css('background-color', colorHighlight)
            .attr('title',"This tag is still in draft, you don't need to wrangle it yet");
    }
    // if a synonym tag isn't in use anymore...
    else if (taggings.total[0] === 0 && is_synonym) {
        taggings.total[1]
            .css('background-color', colorHighlight)
            .attr('title',"This tag is unused, you can try to let it rake");
    }

    // lazy click on canonical, in a way that will trigger Mark Illegal Characters
    $(fieldCanonical).parent().on('click', (e) => {
        if (e.target.tagName === "DD") $(fieldCanonical).trigger('click');
    });

    // lazy click on unwrangleable
    $(fieldUnwrangleable).parent().on('click', (e) => {
        if (e.target.tagName === "DD") $(fieldUnwrangleable).trigger('click');
    });

    // if the tag's unwrangleable status is changed
    $(fieldUnwrangleable).on("input", (event) => {
        unwrangleable_has_fandom(); // alert user if the selected fandom is No Fandom, or none was selected yet

        if (event.target.checked) {
            newFandom.observe($('dd[title="Fandoms"] .autocomplete').get(0), { attributes: false, childList: true, subtree: false }); // start listening to fandoms being added/removed
            $(fieldUnwrangleable).parent().prev().css('background-color', colorHighlight); // highlight label is set to unwrangleable
        }
        else {
            newFandom.disconnect(); // stop listening while tag is not unwrangleable
            $(fieldUnwrangleable).parent().prev().css('background-color', 'unset'); // highlight label is set to unwrangleable
        }
    });
    // if the selected fandoms change on a tag that is unwrangleable
    $(formEdit).on("input", '#parent_Fandom_associations_to_remove_checkboxes input[type="checkbox"], input[name="fandom_shortcuts"]', (event) => {
        unwrangleable_has_fandom();
    });
 
    // CONVENIENCE FUNCTIONS
 
    // hides the canonical/unwrangled checkboxes and synonym field
    function hide_fields(c, u, s) {
        if (c) { $(fieldCanonical).parent().hide().prev().hide(); }
        if (u) { $(fieldUnwrangleable).parent().hide().prev().hide(); }
        if (s) { $(fieldSynonym).parent().hide().prev().hide(); }
    }
 
    // hides the "add subtag" and "add synonym" fields - or the whole line if no sub/syn tags exist to save space
    function hide_addsubsyn() {
        let dd_sub = $('#tag_sub_tag_string').parentsUntil('dd').parent();      // the <dd> containing the subtags
        let dd_syn = $('#tag_merger_string').parentsUntil('dd').parent();       // the <dd> containing the synonyms

        if ($('#child_SubTag_associations_to_remove_checkboxes').length == 0) dd_sub.hide().addClass('cleanup-togglevis').prev().hide().addClass('cleanup-togglevis');
        else dd_sub.children('div[title="add tags"],h5.heading').hide().addClass('cleanup-togglevis'); // if there are subtags currently, hide only the Add input

        if ($('#child_Merger_associations_to_remove_checkboxes').length == 0) dd_syn.hide().addClass('cleanup-togglevis').prev().hide().addClass('cleanup-togglevis');
        else dd_syn.children('div[title="add tags"],h5.heading').hide().addClass('cleanup-togglevis'); // if there are synonyms currently, hide only the Add input

        // if there's nothing currently to show in this <dl>, hide the whole <dl> so the box isn't bigger than the remaining buttons
        if ($(dd_sub).parent().children(':visible').length === 0) $(dd_sub).parent().hide().addClass('cleanup-togglevis');

        // add a button to show those hidden fields again, so people can still add them from this canonical (if that's their workflow)
        dd_sub.parent().parent().children('p.actions').prepend(`<a href="javascript:void(0)" id="cleanup-toggle">Add Subtags or Synonyms</a>`);
        $('#cleanup-toggle').on('click', () => {
            $('.cleanup-togglevis').show();
			$('#cleanup-toggle').hide();
        });
    }

    function unwrangleable_has_fandom() {
        $(fieldUnwrangleable).parent().find('span.error').remove(); // reset error messages

        if ($(fieldUnwrangleable).prop('checked')) {
            /* multiple options:
               - a new one has been added from the autocomplete
               - an old one is listed with a checkbox to remove (we're only interested in what's being kept aka not-checked)
               - something has been selected to be added from the Suggested list (we only need what's currently checked) */

            let oldFandoms = $('#parent_Fandom_associations_to_remove_checkboxes').find('input[type="checkbox"]').not(':checked');
            let newFandoms = $(formEdit).find('dd[title="Fandoms"] li.added.tag');
            let selFandoms = $(formEdit).find('dd[title="Fandoms"]').parent().find('input[name="fandom_shortcuts"]').filter(':checked');

            // if all of them are 0, there hasn't been a fandom selected for this tag yet
            if (oldFandoms.length + newFandoms.length + selFandoms.length === 0) {
                $(fieldUnwrangleable).after(`<span class="error">You haven't selected a fandom yet! Please do so before saving.</span>`);
            }
            // find names of the selected fandoms, alert if one of them is No Fandom
            else if ($(oldFandoms).find('a.tag').filter((ix, el) => $(el).text().trim() === "No Fandom").length > 0 ||
                $(newFandoms).filter((ix, el) => el.childNodes[0].textContent.trim() === "No Fandom").length > 0 ||
                $(selFandoms).filter((ix, el) => $(el).val() === "No Fandom").length > 0) {
                $(fieldUnwrangleable).after(`<span class="error">No Fandom tags should not be marked as unwrangleable.</span>`);
            }
        }
    }
 
})(jQuery);
