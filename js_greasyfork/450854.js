// ==UserScript==
// @name         Siege Incoming Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Counts incoming troops to sieges sorted by type of attack
// @author       acv-98
// @match        https://*.grepolis.com/game/*
// @run-at       document-end
// @icon         https://wiki.en.grepolis.com/images/f/f9/Town_fight.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450854/Siege%20Incoming%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/450854/Siege%20Incoming%20Counter.meta.js
// ==/UserScript==


(function() {
    'use strict';
    function addIncomings() {
        $('.report_side_defender').each(function () {
            $(this).find('h4').html(
                "Movements of troops: " +
                "<img src='https://gpen.innogamescdn.com/images/game/unit_overview/attack_sea.png' style='vertical-align: middle;  margin-right: 5px;' />" +
                $(this).find('.attack_sea').length +
                "<img src='https://gpen.innogamescdn.com/images/game/unit_overview/attack_land.png' style='vertical-align: middle; margin-left: 10px;  margin-right: 5px;' />" +
                $(this).find('.attack_land').length +
                "<img src='https://gpen.innogamescdn.com/images/game/unit_overview/support.png' style='vertical-align: middle; margin-left: 10px; margin-right: 5px;' />" +
                $(this).find('.support').length
           );
        });
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

    waitForKeyElements (
        ".report_side_defender",
        addIncomings
    );

})();