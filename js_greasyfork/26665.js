// ==UserScript==
// @name         WaterlooWorks Plus
// @namespace    http://jareds.site/
// @version      1.5
// @description  A little script to patch some of the UI atrocities that exist in WaterlooWorks. Contribute at github.com/Jaribeau/waterloo-works-plus
// @author       Jared Baribeau
// @match        https://waterlooworks.uwaterloo.ca/myAccount/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26665/WaterlooWorks%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/26665/WaterlooWorks%20Plus.meta.js
// ==/UserScript==

function fixUI() {
    'use strict';

    // Remove the massive sidebar
    $(".span2").remove();
    $(".row-fluid .span10").css("width", "100%");  // Expand the table to fill the newly obtained space

    // Shrink the '# of apps' columns
    var numAppsHeader = $("a:contains(Students' Applications)");
    if (numAppsHeader[0]){
        numAppsHeader[0].innerHTML = "# Apps";
    }

    // Change text wrap settings for various columns
    // TEMPORARILY COMMENTED OUT (NEEDS FIXING)
    //$(function() {
    //    $("tbody td").each(function (index, value) {
    //        $(this).css('white-space', ['nowrap', 'nowrap', 'nowrap', 'pre-wrap', 'pre-wrap', 'pre-wrap','pre-wrap','pre-wrap','pre-wrap','pre-wrap','','',''][index % 13]); // Where there are 13 columns, and each corresponds
    //    });
    //});

    // Resize "Remove from shortlist" button to match the add button
    $(function() {
        jQuery.each($("a.favourite:contains(Remove from shortlist)"), function(index, value) {
            if(value) {
                value.innerHTML = "Remove";
            }
        }).css("background-color", "orange");
    });

    // Function to rearrange table columns
    jQuery.moveColumn = function (table, fromIndex, toIndex) {
        var rows = jQuery('tr', table);
        var cols;
        rows.each(function() {
            cols = jQuery(this).children('th, td');
            cols.eq(fromIndex).detach().insertBefore(cols.eq(toIndex));
        });
    };

    // Rearrang the table columns as desired
    var tbl = jQuery('table');
    jQuery.moveColumn(tbl, 12, 1); // Moves 'Not Interested' button to second column
    jQuery.moveColumn(tbl, 2, 13); // Moves job ID to the very end

};

//Make sure you're on the search results page
if ($('h1:contains(Search Results)')[0]){

    //Run script once on load, then again when user clicks any link (except for "Not Interested")
    fixUI();
    $(document).on('click', '#postingsTablePlaceholder a:not(:has(img[title="Not Interested"]))', function(e) {
        if (!e.shiftKey && !e.ctrlKey && !e.metaKey){
            // TODO: Make this smarter to eliminate race condition
            setTimeout(fixUI, 700); // Delay while the table content is updated
        }
    });
}
