// ==UserScript==
// @name         hd-world 1080p filter
// @namespace    http://drfurunkel.ch/
// @version      0.2
// @description  Filters the 1080p section.  Minumum IMDB Rating. Old Flick filter. Series filter
// @author       DrFurunkel
// @match        http://hd-world.org/category/1080p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412233/hd-world%201080p%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/412233/hd-world%201080p%20filter.meta.js
// ==/UserScript==

(function() {

    //  CONFIGURATION    CONFIGURATION    CONFIGURATION    CONFIGURATION
    const minimumRating = 6;
    const seriesFilter = true;
    const removeQuote = true;
    const noOldFilms = true;
    const oldFilmLow = 1901;
    const oldFilmHigh = 1980;
    // END CONFIGURATION     END CONFIGURATION     END CONFIGURATION


    const seriesDetectorRegEx = /\.S0\d\./;
    const filmYearRegEx = /\.\d\d\d\d\./;


    function safeParseFloat(val) {
        val = val.replace(/,/g,'\.');
        return parseFloat(isNaN(val) ? val.replace(/[^\d\.]+/g, '') : val)
    }

    function superSafeParseFloat(val) {
        if (isNaN(val)) {
            val = val.replace(/,/g,'\.');
            if ((val = val.match(/([0-9\.,]+\d)/g))) {
                val = val[0].replace(/[^\d\.]+/g, '')
            }
        }
        return parseFloat(val)
    }



    'use strict';
    var sidebar = document.querySelector("#sidebar");
    sidebar.parentNode.removeChild(sidebar);

    var matches = document.querySelectorAll("div.post");
    matches.forEach(function(item, index, array) {
        var invalidate = false;
        var classified = false;
        var oldFlic = false;
        var title = item.querySelector("h1").textContent;
        title = (title == null) ? "" : title;
        var yearDirty = title.match(filmYearRegEx);
        var year = (yearDirty == null) ? 0 :parseInt(yearDirty[0].substring(1));
        //console.log(year);
        invalidate = seriesFilter && seriesDetectorRegEx.test(title);
        oldFlic = noOldFilms && (year > oldFilmLow) && (year < oldFilmHigh);

        if (!invalidate && !oldFlic)
        {
            var blubb = item.querySelectorAll("div.entry_x > p");
            blubb.forEach(function(item, index, array) {
                if (item.textContent.toLowerCase().includes("imdb"))
                {
                    var splitters = item.textContent.toLowerCase().split("imdb");
                    var rating = superSafeParseFloat(splitters[1]);
                    if ((rating != NaN) && (rating > 0.1) && (rating < 10))
                    {
                        classified = true;
                        if (rating < minimumRating)
                        {
                            invalidate = true;
                        }
                    }
                }
            });
        }
        if (!classified)
        {
            item.style.opacity = "0.45";
        }
        if (oldFlic)
        {
           // item.parentNode.removeChild(item);
            var block = item.querySelector("p.info_x");
            block.parentNode.removeChild(block);
            block = item.querySelector("div.entry_x");
            block.parentNode.removeChild(block);
        }
        if (invalidate)
        {
            item.parentNode.removeChild(item);
        }

        var blockqt = item.querySelector("blockquote");
        if (removeQuote && (blockqt != null))
        {
            blockqt.parentNode.removeChild(blockqt);
        }
    });
    var head = document.querySelector("#head");
    head.parentNode.removeChild(head);

})();