// ==UserScript==
// @name ServiceNow Reports ms to seconds
// @version 2.0.1
// @description Convert ms to seconds
// @namespace Violentmonkey Scripts
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @grant GM_addStyle
// @match https://aut.service-now.com/*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/399635/ServiceNow%20Reports%20ms%20to%20seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/399635/ServiceNow%20Reports%20ms%20to%20seconds.meta.js
// ==/UserScript==

//Could we replace the below with a simple
// @require https://gist.githubusercontent.com/raw/2625891/waitForKeyElements.js
//in the header? Yes, but greasyfork won't allow that


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
    "tspan", 
    static_time
);


function static_time(center_time)
{
  // check for x because otherwise this will affect a bunch of other shit
  // check for dy cause otherwise it interferes with the mouse-over
  if (center_time[0].hasAttribute("dy") == false && center_time[0].hasAttribute("x"))
  {
    users_time_in_ms = center_time[0]["innerHTML"]
    users_time_in_ms = users_time_in_ms.replace(/,/g, "")
    users_time_in_ms = parseInt(users_time_in_ms)
    users_time_in_ms = (users_time_in_ms / 60000)
    users_time_in_h = Math.floor(users_time_in_ms / 60)
    users_time_in_min = users_time_in_ms % 60
    time_string = users_time_in_h + " hours, " + users_time_in_min + " min"
    // cause this interferes with the mouse-over, the easiest work around is just
    // not to do the replacement if it's gonna replace it with an error
    if (users_time_in_h == NaN || users_time_in_min == NaN)
    {
      console.log("NAAA")
    }
    else
    {
      center_time[0]["innerHTML"] = time_string
    }
  }
}


// this part is only loaded on-demand, namely the mouse-over
waitForKeyElements (
    ".highcharts-point ", 
    tooltip_time
);


function tooltip_time(time_rect)
{
  console.log(time_rect[0].point["y_tooltip"])
  users_time_in_ms = time_rect[0].point["y_tooltip"]
  users_time_in_ms = users_time_in_ms.replace(/,/g, "")
  users_time_in_ms = parseInt(users_time_in_ms)
  users_time_in_ms = (users_time_in_ms / 60000)
  users_time_in_h = Math.floor(users_time_in_ms / 60)
  users_time_in_min = users_time_in_ms % 60
  time_string = users_time_in_h + " hours, " + users_time_in_min + " min"
  time_rect[0].point["y_tooltip"] = time_string
}
