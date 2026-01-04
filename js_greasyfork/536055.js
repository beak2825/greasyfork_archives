// ==UserScript==
// @name         AO3: [Wrangling] Smaller Tag Search - NEW includes new tag status options
// @namespace    https://greasyfork.org/en/users/1470365-moodymadi101
// @version      1.0
// @description  makes the new Tag Search form take up less space (best on desktop/landscape screens) - Now includes the tag status options for Synonymous, Canonical and Synonymous, and Non-canonical and non-synonymous
// @author       Madi
// @match        *://*.archiveofourown.org/tags/search*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536055/AO3%3A%20%5BWrangling%5D%20Smaller%20Tag%20Search%20-%20NEW%20includes%20new%20tag%20status%20options.user.js
// @updateURL https://update.greasyfork.org/scripts/536055/AO3%3A%20%5BWrangling%5D%20Smaller%20Tag%20Search%20-%20NEW%20includes%20new%20tag%20status%20options.meta.js
// ==/UserScript==


// CONFIGURATION OPTIONS
    // hides the "sort by" and "sort direction" options, can be either true or false
    var hide_sort_options = false;

    // hides the labels from the dropdowns and brings them all onto a single line, can be either true or false
    var hide_labels = false;

    // hides the labels from the tag name and fandom inputs, and moves both input fields into the same line, can be either true or false
    var make_textinput_smaller = false;

    // Tag Type shall default to this selection, can be one of: "", "Fandom", "Character", "Relationship", "Freeform", "UnsortedTag"
    var default_search_type = "";

    // Wrangling Status shall default to this selection, can be one of: "", "Canonical", "Non-canonical", "Synonymous", "Canonical or synonymous", "Non-canonical and non-synonymous"
    var default_search_status = "";



(function($) {
    'use strict';

    // ** 1 ** Display the Type and Wrangling Status choices as dropdowns again to save screen space

    // switch default_search_status config to values AO3 recognizes
    switch (default_search_status) {
        case "Canonical":
            default_search_status = "canonical";
            break;
        case "Non-canonical":
            default_search_status = "noncanonical";
            break;
        case "Synonymous":
            default_search_status = "synonymous";
            break;
        case "Canonical or Synonymous":
            default_search_status = "canonical_synonymous";
            break;
        case "Non-canonical and non-synonymous":
            default_search_status = "noncanonical_nonsynonymous";
            break;
        default:
            default_search_status = "";
            break;
    }

    // check URL parameters so we can set the correct selected="selected" option from the last search
    var searchParams = new URLSearchParams(window.location.search);
    var search_type = searchParams.has('tag_search[type]') ? searchParams.get('tag_search[type]') : default_search_type;
    var search_canonical = searchParams.has('tag_search[wrangling_status]') ? searchParams.get('tag_search[wrangling_status]') : default_search_status;
    var selected = 'selected="selected"';

    // create new dropdown for tag types (and add descriptor on "Any" option if labels are hidden)
    var type_select = '<select id="tag_search_type" name="tag_search[type]">'
    + '<option value="Fandom"' + (search_type == "Fandom" ? selected : "") + '>Fandoms</option>'
    + '<option value="Character"' + (search_type == "Character" ? selected : "") + '>Characters</option>'
    + '<option value="Relationship"' + (search_type == "Relationship" ? selected : "") + '>Relationships</option>'
    + '<option value="Freeform"' + (search_type == "Freeform" ? selected : "") + '>Freeforms</option>'
    + '<option value="UnsortedTag"' + (search_type == "UnsortedTag" ? selected : "") + '>UnsortedTags</option>'
    + '<option value=""' + (search_type == "" ? selected : "") + '>Any' + (hide_labels == true ? " tag type" : "") + '</option>'
    + '</select>';

    // create new dropdown for tag wrangling status (and add descriptor on "Any" option if labels are hidden)
    var status_select = '<select id="tag_search_status" name="tag_search[wrangling_status]">'
    + '<option value="canonical"' + (search_canonical == "canonical" ? selected : "") + '>Canonical</option>'
    + '<option value="noncanonical"' + (search_canonical == "noncanonical" ? selected : "") + '>Non-canonical</option>'
    + '<option value="synonymous"' + (search_canonical == "synonymous" ? selected : "") + '>Synonymous</option>'
    + '<option value="canonical_synonymous"' + (search_canonical == "canonical_synonymous" ? selected : "") + '>Canonical or synonymous</option>'
    + '<option value="noncanonical_nonsynonymous"' + (search_canonical == "noncanonical_nonsynonymous" ? selected : "") + '>Non-canonical and non-synonymous</option>'
    + '<option value=""' + (search_canonical == "" ? selected : "") + '>Any' + (hide_labels == true ? " wrangling status" : "") + '</option>'
    + '</select>';

    // add in new dropdowns
    var searchform = $("#new_tag_search dl dd fieldset");
    $(searchform).first().before(type_select);
    $(searchform).last().before(status_select);

    // wrap tag type and status labels in a <label> element, so they behave the same as the sorting labels
    $(searchform).first().parent().prev().wrapInner('<label for="tag_search_type"></label>');
    $(searchform).last().parent().prev().wrapInner('<label for="tag_search_status"></label>');

    // remove the radiobuttons at last
    $(searchform).remove();

    // ** 2 ** hide the description below the fandom field
    $("#fandom-field-description").hide();

    // ** 3 ** Hide sort options
    if (hide_sort_options) {
        $("#tag_search_sort_column").parent().hide().prev().hide();
        $("#tag_search_sort_direction").parent().hide().prev().hide();
    }

    // ** 4 ** Reduce label widths and hide those of the dropdowns
    $("#tag_search_status").parent().prev().find('label').html('Status');

    var style = $('<style type="text/css"></style>').appendTo($('head'));
    style.html(`.tagsearch-label { width: 12%; min-width: unset; } .tagsearch-select { width: 20%; margin-left: 0.2em; margin-right: 0.2em; }
                #new_tag_search p.submit.actions { margin-top: -4em; } /* moves Search button up into the dropdown line */
                .tagsearch-select select { min-width: unset; } /* this avoids labels overlapping on zoom */
                .tagsearch-floatlabel { width: 15%; clear: none; margin-left: 2%; } .tagsearch-input { width: 45%; margin-right: 2em; }  `);

    // add classes to all the dds and dts
    $("#new_tag_search dl dt").addClass("tagsearch-label");
    $("#new_tag_search dl dd select").parent().addClass("tagsearch-select");

    // no labels: all shown dropdowns move into a single line
    var search_labels = $(".tagsearch-label");
    if (hide_labels) {
        $(search_labels).slice(2).hide();
        // while we're here, add descriptors to the sort options (if shown)
        if (!hide_sort_options) {
            $("#tag_search_sort_column option").prepend("Sort by ");
            $("#tag_search_sort_direction option").prepend("List ");
        }
    }
    // with labels: float the even-numbered labels to build two columns of dropdowns
    else if (hide_sort_options) {
            $(search_labels).slice(3,4).addClass("tagsearch-floatlabel");
            $(search_labels).slice(5,6).addClass("tagsearch-floatlabel");
    }
    // when all four dropdowns are shown, change the order so the tag type and status are on top of each other
    else {
        var selects = $('#new_tag_search dl').children();
        var moving = selects.slice(-6,-4);
        $(selects).slice(-6, -4).remove();
        $(selects).slice(-2, -1).before(moving);
        $(selects).slice(-4,-3).addClass("tagsearch-floatlabel");
        $(selects).slice(-2,-1).addClass("tagsearch-floatlabel");
    }

    // ** 5 ** Go extreme - also make the text fields smaller
    if (make_textinput_smaller) {

        // hide the labels
        $(search_labels).slice(0,2).hide();

        // add placeholder text to recognize the fields instead of the labels
        $("#tag_search_name").attr("placeholder", "Enter search term");
        $("#tag_search_fandoms_autocomplete").attr("placeholder", "Choose a fandom");

        // make textfields narrower to fit into a single line
        $("#tag_search_name").parent().addClass("tagsearch-input");
        var searchfandom = $("#tag_search_fandoms_autocomplete").parentsUntil("dd").parent().slice(0,1);
        $(searchfandom).addClass("tagsearch-input");
        // fandom search elements need to lose some margin to make it line up with the tag name textfield
        $(searchfandom).find("li.input").css("margin", "0");
    }
    
    // ** 6 ** jump the focus to the text field if there was no search yet
    if (searchParams == "") {
        document.getElementById('tag_search_name').focus();
    }

})(jQuery);