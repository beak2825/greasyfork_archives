// ==UserScript==
// @name        Remove "Channel violations" from YouTube Studio dashboard
// @match       https://studio.youtube.com/*
// @grant       none
// @version     1.2
// @author      Dax009
// @license     Unlicense
// @description I got a Community Guidelines warning. It won't go away on the dashboard. It makes me angry. This is coded semi-poorly.
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @namespace https://greasyfork.org/users/1019212
// @downloadURL https://update.greasyfork.org/scripts/459166/Remove%20%22Channel%20violations%22%20from%20YouTube%20Studio%20dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/459166/Remove%20%22Channel%20violations%22%20from%20YouTube%20Studio%20dashboard.meta.js
// ==/UserScript==

/*
  setInterval(() => {
    var element =  document.getElementById('strikes-label');
      if (typeof(element) != 'undefined' && element != null)
    {

    }
  }, 1)
*/

function removeit() {
  //amazing code tbh
  //document.getElementById("strikes-label").parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
  document.querySelectorAll('[test-id="channel-dashboard-strikes-card"]')[0].remove()
}

waitForKeyElements (
  "#strikes-label",
  removeit,
  false
);


//https://gist.github.com/BrockA/2625891 taken from here, used under CC0 1.0 Universal (CC0 1.0)
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
