// ==UserScript==
// @name         AntibotHokage
// @namespace    AntibotHokage
// @version      1.3
// @description  like4like Antibot hider
// @match        http://www.like4like.org/*
// @match        https://www.like4like.org/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        GM_addStyle
// @author       Supreme100
// @downloadURL https://update.greasyfork.org/scripts/36461/AntibotHokage.user.js
// @updateURL https://update.greasyfork.org/scripts/36461/AntibotHokage.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/
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
waitForKeyElements (
    "a[href*='earn-youtube.php'], img[src*='earn-youtube.php']",
    hideNode
);

function hideNode (jNode) {
    jNode.hide ();
}
waitForKeyElements (
    "a[href*='earn-youtube-subscribe.php'], img[src*='earn-youtube-subscribe.php']",
    hideNode
);

function hideNode (jNode) {
    jNode.hide ();
}
waitForKeyElements (
    "a[href*='https://www.like4like.org/*'], img[src*='https://www.like4like.org/*']",
    hideNode
);

function hideNode (jNode) {
    jNode.hide ();
}
waitForKeyElements (
    "a[href*='https://www.like4like.org/user/earn-youtube.php*'], img[src*='https://www.like4like.org/user/earn-youtube.php*']",
    hideNode
);

function hideNode (jNode) {
    jNode.hide ();
}