// ==UserScript==
// @name         drabble judgment
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  is that thing tagged drabble actually a drabble
// @author       scriptfairy
// @match        http*://archiveofourown.org/*works*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19039/drabble%20judgment.user.js
// @updateURL https://update.greasyfork.org/scripts/19039/drabble%20judgment.meta.js
// ==/UserScript==

(function($) {
    var works = $('li.blurb');
    for (i=0;i<works.length;i++) {
        var freeforms = $('li.freeforms',works[i]), wordCount = $('dd.words',works[i]).text(), chapterCount = $('dd.chapters',works[i]).text();
        wordCount = parseInt(wordCount.replace(',',''));
        chapterCount = parseInt(chapterCount.substring(0,chapterCount.indexOf('/')));
        freeforms = freeforms.filter(function(index){
            return $(this).text().search(/[Dd]rabbles?$/) != -1;
        });
        if (freeforms.length >= 1 && (wordCount/chapterCount <= 90 || (wordCount/chapterCount >= 110) && wordCount/chapterCount <= 300)) {
            $('a',freeforms[0]).text('Probably not a Drabble');
        }
        else if (freeforms.length >=1 && wordCount/chapterCount > 300 && wordCount/chapterCount <= 1000) {
            $('a',freeforms[0]).text('Not actually a Drabble');
        }
        else if (freeforms.length >=1 && wordCount/chapterCount > 1000) {
            $('a',freeforms[0]).text('NOTHING LIKE A DRABBLE');
        }
    }
})(window.jQuery);