// ==UserScript==
// @name         Spotdark
// @namespace    none
// @version      0.2
// @description  Remove spotlight icon from header on Google Maps Street View
// @author       me
// @include		 https://*.google.com/maps*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457371/Spotdark.user.js
// @updateURL https://update.greasyfork.org/scripts/457371/Spotdark.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements('.jN2ORe', () => {
        console.log('Removing spotlight header element');
        document.getElementsByClassName('jN2ORe Hk4XGb')[0].style.display = 'none';
    })

})();

function waitForKeyElements (
    selectorTxt,    /* Required: The selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
) {
    var targetNodes, btargetsFound;
    targetNodes = document.querySelectorAll(selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.forEach(function(element) {
            var alreadyFound = element.dataset.found == 'alreadyFound' ? 'alreadyFound' : false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (element);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    element.dataset.found = 'alreadyFound';
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj  = waitForKeyElements.controlObj  ||  {};
    var controlKey  = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey];
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}