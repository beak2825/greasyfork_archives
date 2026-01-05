// ==UserScript==
// @name         HF Filter stories
// @namespace    http://www.hentai-foundry.com
// @version      0.4
// @description  Filter Hentai-Foundry stories
// @author       Mooky
// @match        http://www.hentai-foundry.com/stories/recent/all*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @grant        none
// @copyright    2016+, Mooky
// @downloadURL https://update.greasyfork.org/scripts/17963/HF%20Filter%20stories.user.js
// @updateURL https://update.greasyfork.org/scripts/17963/HF%20Filter%20stories.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

var summary = $(".summary");
summary.text(summary.text() + " (Esc to filter stories.)");

var filteredStories = [
    "Enter specific stories you wish to filter out here, like this",
];

var filteredCategory = "Original";

var filterKeywords = "scat";

$(document).on("keydown", function(e) {
    //console.log(e.keyCode);
    if(e.keyCode == 27) { //Escape
        filterStories();
    }
    if(e.keyCode == 37) { //Left arrow
        var link = $(".previous:not(.hidden) a");
        if(link.length > 0) link[0].click();
    }
    if(e.keyCode == 39) { //Right arrow
        var link = $(".next:not(.hidden) a");
        if(link.length > 0) link[0].click();
    }
});

function filterStories() {
    var totalRemoved = 0;
    var temp = 0;
    temp = onlyCategory(filteredCategory);
    totalRemoved += temp;
    if(temp > 0) appendTitle("Unoriginal stories removed: " + temp);

    temp = filterByTitle(filteredStories);
    totalRemoved += temp;
    if(temp > 0) appendTitle("Specific stories removed: " + temp);

    temp = filterByDescription(filterKeywords);
    totalRemoved += temp;
    if(temp > 0) appendTitle("Stories with keywords removed: " + temp);

    if(totalRemoved > 0) summary.text(summary.text().substring(0, summary.text().indexOf(" (")) + " (Stories filtered: " + totalRemoved + ")");
}


//=================
//    Utilities
//=================
function filterByTitle(set, reverse)
{
    var count = filterTextContent(".titlebar a", set, reverse);

    if(!reverse) console.log("Specific stories removed: " + count);
    else console.log("Only specific stories displayed; removed: " + count);

    return count;
}

function filterByDescription(keywords, reverse)
{
    var count = filterTextContent(".storyDescript", keywords, reverse);

    if(!reverse) console.log("Stories containing \"" + keywords + "\" removed: " + count);
    else console.log("Stories NOT containing \"" + keywords + "\" removed: " + count);

    return count;
}

function filterByCategory(category, reverse)
{
    var count = filterTextContent(".categoryBreadcrumbs", category, reverse);

    if(!reverse) console.log("Category \"" + category + "\" stories removed: " + count);
    else console.log("Filter all but category \"" + category + "\"; Stories removed: " + count);

    return count;
}

function onlyCategory(category) {
    return filterByCategory(category, true);
}

function filterTextContent(selector, content, reverse)
{
    //Random note: Strict mode means you can't assign to parameters.
    reverse = typeof reverse !== 'undefined' ?  reverse : false; //Filter all except matched
    var counter = 0;
    if(typeof content === 'string') {
        $(selector).each(function() {
            if((!reverse && $(this).text().indexOf(content) >= 0) || (reverse && $(this).text().indexOf(content) < 0)) {
                $(this).closest(".storyRow").remove();
                counter++;
            }
        });
    }
    else if(content.constructor === Array) {
        $(selector).each(function() {
            for (var i = content.length - 1; i >= 0; i--) {
                if((!reverse && $(this).text().indexOf(content[i]) >= 0) || (reverse && $(this).text().indexOf(content[i]) < 0)) {
                    $(this).closest(".storyRow").remove();
                    counter++;
                }
            }
        });
    }
    return counter;
}

function appendTitle(msg) {
    if(summary.attr("title") === undefined) summary.attr("title", msg);
    else summary.attr("title", summary.attr("title") + "\n" + msg);
}
