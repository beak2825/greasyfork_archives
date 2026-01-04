// ==UserScript==
// @name         Targetprocess: Week starts on Monday
// @namespace    postsharp.net
// @version      1.0
// @description  Makes the week start on Monday instead of Sunday in the calendar
// @author       PostSharp Technologies
// @match        http://tp.postsharp.net/*
// @match        https://tp.postsharp.net/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404929/Targetprocess%3A%20Week%20starts%20on%20Monday.user.js
// @updateURL https://update.greasyfork.org/scripts/404929/Targetprocess%3A%20Week%20starts%20on%20Monday.meta.js
// ==/UserScript==

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

(function() {
    'use strict';
    function weekStartsOnMonday(jnode) {
        // Header
        var allRows = $(jnode).children("thead").children("tr");
        allRows.each((index, element) => {
            $(element).children(":first").detach().appendTo(element);
        });
        // Body
        var tbody = $(jnode).children("tbody");
        var mainrows = tbody.children("tr");
        for (var i = 0; i < mainrows.length; i++) {
            var detached = $(mainrows.get(i)).children(":first").detach();
            if (i == 0) {
                if (detached.html().includes("a")) {
                    console.log(detached.html());
                    var newRow = $("<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td class='ui-datepicker-week-end'>&nbsp;</td></tr>");
                    detached.appendTo(newRow);
                    newRow.prependTo(tbody);
                }
            }
            else {
                detached.appendTo(mainrows.get(i-1));
            }
            if (i == mainrows.length - 1) {
               $("<td class='ui-datepicker-week-end'>&nbsp;</td>").appendTo(mainrows.get(i));
            }

        }
        $(tbody).find("td.ui-datepicker-week-end").attr("style","background-color: #EEEEEE;");
    }

    waitForKeyElements (".ui-datepicker-calendar", weekStartsOnMonday);
})();