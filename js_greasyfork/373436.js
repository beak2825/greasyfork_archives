// ==UserScript==
// @name         Spot Vic Scam
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  swaps vic and xan in the bazaar when trying to scam
// @author       miros
// @match        https://www.torn.com/bazaar.php
// @require      http://code.jquery.com/jquery-2.2.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373436/Spot%20Vic%20Scam.user.js
// @updateURL https://update.greasyfork.org/scripts/373436/Spot%20Vic%20Scam.meta.js
// ==/UserScript==

jQuery.noConflict();

(function() {
    'use strict';
    waitForKeyElements( '#bazaar-page-wrap li.last', fix_scam, true);

})();


function fix_scam () {
    var bazaar= jQuery( '#bazaar-page-wrap');

    // look for vic and xan
    var vic= bazaar.find( 'span.info:contains("Vicodin")');
    var xan= bazaar.find( 'span.info:contains(Xanax)');

    if( vic.length && xan.length) {
        // we have both, check the price of the vic
        var vic_price= dollars_to_number( vic.find( 'div.price').text());
        if( vic_price > 750000) {
            // got vastly overpriced vic (test is quite broad on purpose)

            // swap the contents of the 2 li enclosing elements
            // (the li contains all of the elements needed to display and buy)
            var xan_li= xan.closest( 'li');
            var vic_li= vic.closest( 'li');
            var tmp = jQuery('<div>').hide(); // use a temp holding div
            xan_li.children().appendTo(tmp);
            vic_li.children().appendTo(xan_li);
            tmp.children().appendTo(vic_li);

            // add a couple of warnings
            xan.find( 'p.t-overflow').append( ' <span style="color: red; font-weight: bold;">SCAMMER</span>');
            vic.find( 'p.t-overflow').append( ' <span style="color: red; font-weight: bold;">SCAMMER</span>');

            // disable vic buying (and add more "SCAM" warnings
            vic.find('span.buy').html( 'SCAM');
            // FIX: this disables the buy link on vic, but doesn't actually display the "X" or change the cursor
            vic.find('span.buy-h').replaceWith( '<span style="font-size: 2em; color: red; cursor: not-allowed;">X</span>');
            vic.closest( 'p').off( '**'); // handler seems to be there, not sure though
        }
    }
}

    function dollars_to_number (dollars) {
        return Number(dollars.replace(/[^0-9\.]+/g, ""));
    }

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
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
