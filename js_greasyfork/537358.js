// ==UserScript==
// @name         AO3 Avg Chapter Lengths
// @namespace    https://semperintrepida.com
// @version      0.2
// @description  Adds average chapter length to AO3 pages
// @author       semperintrepida@protonmail.com
// @match        https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/537358/AO3%20Avg%20Chapter%20Lengths.user.js
// @updateURL https://update.greasyfork.org/scripts/537358/AO3%20Avg%20Chapter%20Lengths.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Initializing AO3 Avg Chapter Lengths...');

    var statEntries = $('dl.stats');
    //console.log(statEntries);
    for (var i=0; i < statEntries.length; i++) {
        var stats = statEntries[i];
        var wordcount = parseInt($(stats).find('dd.words').text().replace(/,/g, ""));
        var chaptersTag = $(stats).find('dd.chapters');
        var chapterValues = chaptersTag.text().split('/');
        var currentChapter = parseInt(chapterValues[0]);
        var totalChapters = parseInt(chapterValues[1]);
        var isIncomplete = false;
        if (chapterValues[1] === '?' || currentChapter < totalChapters) {
            isIncomplete = true;
        }
        //console.log(wordcount, currentChapter, totalChapters);

        var showAverage = true;
        var average;
        if (isIncomplete) {
            average = Math.floor(wordcount / currentChapter);
        } else if (currentChapter === 1 && totalChapters === 1) {
            showAverage = false;
        } else {
            average = Math.floor(wordcount / totalChapters);
        }

        //console.log(average);
        if (showAverage) {
            chaptersTag.append(' <span>(avg: ' + average + ')</span>');
        }
    }
})();