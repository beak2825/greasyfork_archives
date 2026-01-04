// ==UserScript==
// @name         NoxTo 1080p filter
// @namespace    http://drfurunkel.ch/
// @version      0.2
// @description  Filters the 1080p section.  Minumum IMDB Rating. Old Flick filter. Series filter
// @author       DrFurunkel
// @match        https://nox.to/Category/Filme/*
// @icon         https://www.google.com/s2/favicons?domain=nox.to
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425978/NoxTo%201080p%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/425978/NoxTo%201080p%20filter.meta.js
// ==/UserScript==

waitForKeyElements ("tbody", runFilti);


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
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
            .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements (    selectorTxt,
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
    waitForKeyElements.controlObj   = controlObj;
}

function runFilti() {

    //  CONFIGURATION    CONFIGURATION    CONFIGURATION    CONFIGURATION
    const minimumRating = 6;
    //const seriesFilter = true;
    //const removeQuote = true;
    const releaseMaxAgeDays = 100;
    //const oldFilmLow = 1901;
    //const oldFilmHigh = 1980;
    // END CONFIGURATION     END CONFIGURATION     END CONFIGURATION


    //const seriesDetectorRegEx = /\.S0\d\./;
    //const filmYearRegEx = /\.\d\d\d\d\./;


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
    $("tbody > tr").each(function( ) {
        var invalidate = false;

        // Check IMDB Rating
        var rating = superSafeParseFloat($("td:eq(2)", this).text());
        if (!isNaN(rating) && (rating > 0.1) && (rating < 10))
        {
            var classified = true;
            if (rating < minimumRating)
            {
                invalidate = true;
            }
        }
        // Check Releasedate
        var parts = $("td:eq(0)",this).text().split("|")[0].split(".");
        var rlsDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        var cmpDate = new Date();
        cmpDate.setDate(cmpDate.getDate() - releaseMaxAgeDays);
        if (rlsDate<cmpDate)
        {
            invalidate = true;
        }
        if (invalidate)
        {
            this.parentNode.removeChild(this);
        }
    });
}