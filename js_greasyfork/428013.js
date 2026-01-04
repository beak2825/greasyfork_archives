// ==UserScript==
// @name         SLOWLY Arrival Times
// @namespace    https://migdaliyr.com
// @version      1.0
// @description  Display arrival time estimations for SLOWLY.
// @author       MigdaliyrArchitect TheArchitect@migdaliyr.com
// @match        https://web.slowly.app/friend*
// @icon         https://www.google.com/s2/favicons?domain=slowly.app
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/428013/SLOWLY%20Arrival%20Times.user.js
// @updateURL https://update.greasyfork.org/scripts/428013/SLOWLY%20Arrival%20Times.meta.js
// ==/UserScript==

(function() {
    'use strict';

waitForKeyElements (".small.mb-2", fixText );

function fixText(item) {
    var innerText = item[0].innerText;
    var newTime;
    var re = /in\s(\d+)\s(.+)/;

    innerText = innerText.trim();

    if (innerText == 'in an hour') {
        newTime = moment().add(1, 'hours').calendar();
    } else if (innerText == 'in a day') {
        newTime = moment().add(1, 'days').calendar();
    } else {
        var match = innerText.match(re);
        if (match != null) {
            newTime = moment().add(match[1], match[2]).calendar();
        }
    }

    if (newTime != undefined) {
        item[0].innerText += "\r\n(" + newTime + ")";
    }
}


//* THE BELOW CODE IS FROM https://gist.github.com/raw/2625891/waitForKeyElements.js
//* DUE TO GREASYFORK BEING FULL OF TERRIFIED CHILDREN, IT IS NOT ALLOWED TO BE REQUIRED
//* SO I MUST INCLUDE IT MANUALLY */
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

})();