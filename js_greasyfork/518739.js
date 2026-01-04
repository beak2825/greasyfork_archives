// ==UserScript==
// @name         AO3 Bookmark wordcount autofill
// @namespace    https://brickgrass.uk
// @version      0.2
// @description  Automatically add wordcount tags to the ao3 bookmark form whenever it is opened.
// @author       BrickGrass
// @include      https://archiveofourown.org/*
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518739/AO3%20Bookmark%20wordcount%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/518739/AO3%20Bookmark%20wordcount%20autofill.meta.js
// ==/UserScript==

// following two are similar, check first *then* second if failed first
const work_bookmarks_url = /https:\/\/archiveofourown\.org\/works\/\d+\/bookmarks/;
const work_url = /https:\/\/archiveofourown\.org\/works\/\d+/;
const series_url = /https:\/\/archiveofourown\.org\/series\/\d+/;
const bookmark_form_url = /https:\/\/archiveofourown\.org\/bookmarks\/\d+\/edit/;

const num_separators = /[\.,]/;

const wordcount_tags = {
    "0-99": "Wordcount: 0-100",
    "100-999": "Wordcount: 100-1k",
    "1000-4999": "Wordcount: 1k-5k",
    "5000-9999": "Wordcount: 5k-10k",
    "10000-29999": "Wordcount: 10k-30k",
    "30000-49999": "Wordcount: 30k-50k",
    "50000-99999": "Wordcount: 50k-100k",
    "100000-199999": "Wordcount: 100k-200k",
    "199999-9999999999999": "Wordcount: Over 200k"
}

function autopopulate_wordcount() {
    if (this === window) {
        return; // Don't know why, but the id selector also returns window?
    }

    let dds = $(this).find("fieldset > fieldset > dl > dd");
    let tag_dd = dds[1];
    let tag_list = $(tag_dd).children("ul");
    console.log('Tag list:');
    console.log(tag_list);
    const seriesTags = document.querySelectorAll('span.series span.position a');
    console.log({ seriesTags });
    console.log(seriesTags[0].innerHTML);

    let tag_input = $(this).find("[id=bookmark_tag_string_autocomplete]");
    console.log({ tag_input });
    tag_input = tag_input[0]; // get actual DOM node

    // what page is this? can we find the wordcount?
    let href = window.location.href;
    let wordcount = null;
    if (!href.match(work_bookmarks_url) && href.match(work_url)) {
        // Work page, need to look in slightly different place for wordcount
        console.log('Work page');

        wordcount = $("#main div.wrapper dd.stats dd.words");
    } else if (href.match(series_url)) {
        // Series page, need to look in slightly different place for wordcount
        console.log('Series page');

        wordcount = $("#main div.wrapper dd.stats dd").first();
    } else if (href.match(bookmark_form_url)) {
        // Dedicated bookmark edit page, wordcount not accessable
        console.log('Dedicated bookmark edit page');
        return;
    } else {
        // All other pages have the bookmark form nested within a bookmark article
        console.log('other page');

        let bookmark_article = $(this).closest("li.bookmark[role=article]");
        console.log({ bookmark_article });
        let has_podfic_tag = $(bookmark_article).find("ul.tags > li.freeforms:contains('Podfic')");
        console.log({ has_podfic_tag });
        let has_podficced_works_tag = $(bookmark_article).find("ul.tags > li.freeforms:contains('Podfic & Podficced Works')");
        console.log({ has_podficced_works_tag });
        if (has_podfic_tag.length || (has_podficced_works_tag.length && has_podfic_tag.length === 1)) return;
        wordcount = $(bookmark_article).find("dl.stats > dd.words");
        console.log({ wordcount });
        // Series listings have wordcount laid out differently
        if (wordcount.length === 0) {
            wordcount = $(bookmark_article).find("dl.stats > dd").first();
        }
    }

    wordcount = wordcount.text();
    wordcount = wordcount.replace(num_separators, "");
    wordcount = parseInt(wordcount);
    console.log({ wordcount });

    let tag = "";
    for (const [range, tag_str] of Object.entries(wordcount_tags)) {
        let [ low, high ] = range.split("-");
        [ low, high ] = [ parseInt(low), parseInt(high) ];

        if (low <= wordcount && wordcount <= high) {
            tag = tag_str;
            break;
        }
    }

    // adding tag spoofing from: https://github.com/LazyCats-dev/ao3-podfic-posting-helper/blob/main/src/inject.js
    const event = new InputEvent('input', {bubbles: true, data: tag});
    tag_input.value = tag;
    // Replicates the value changing.
    tag_input.dispatchEvent(event);
    // Replicates the user hitting comma.
    tag_input.dispatchEvent(new KeyboardEvent('keydown', {'key': ','}));
}

function set_context(j_node) {
    autopopulate_wordcount.call(j_node);
}

function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
                                       .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis = $(this);
            var alreadyFound = jThis.data ('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (selectorTxt,
                                        actionFunction,
                                        bWaitOnce,
                                        iframeSelector
                    );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

// $("[id='idofelement']") due to multiple elements with same id being possible on ao3 bookmark page
waitForKeyElements("[id='bookmark-form']", set_context, false /*false = continue searching after first*/);