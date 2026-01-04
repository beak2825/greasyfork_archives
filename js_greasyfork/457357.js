// ==UserScript==
// @name         MSC Price/Day
// @license      MIT
// @namespace    http://www.msccroisieres.fr/
// @version      0.1
// @description  Adds price per day to MSC result list
// @author       Phenow
// @match        https://www.msccroisieres.fr/Search%20Result?*
// @match        https://www.msccroisieres.fr/search-result?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=msccroisieres.fr
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457357/MSC%20PriceDay.user.js
// @updateURL https://update.greasyfork.org/scripts/457357/MSC%20PriceDay.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var calculatePrice = function(cruise) {
    //$( document ).ready(function() {
        //var cruises = $(".itinerary-card");
        //cruises.each(function() {
            var price = cruise.find(".itinerary-card-price__service-charges-total .itinerary-card-price__price").text().replace(/[^\d]/g, '');
            var duration = cruise.find(".itinerary-card-detail__duration").first().text().replace(/[^\d]/g, '');
            var ppd = (price / duration).toFixed(0);
            var target = cruise.find(".itinerary-card-price__service-charges-total");

            target.append($('<div />').addClass('itinerary-card-price__service-charges-total-label').css('color', '#ff690e').css('font-weight', 'bold').text('Soit par nuit'));
            target.append($('<span />').addClass('itinerary-card-price__price').text(ppd + " €"));
            target.append($('<span />').addClass('itinerary-card-price__type').text("p.p.p.n."));
        //});
   // });
    }


    waitForKeyElements (".search_results__container div.itinerary-card", calculatePrice);
    waitForKeyElements (".search_results__container div.itinerary-card .itinerary-card-price__service-charges-total .itinerary-card-price__price", calculatePrice);

    /*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

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

})();
