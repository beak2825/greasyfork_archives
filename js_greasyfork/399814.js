  // ==UserScript==
// @name        Convert MS to Hours/Minutes - service-now.com
// @namespace   Violentmonkey Scripts
// @match       https://aut.service-now.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/6/2020, 9:44:31 AM
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/399814/Convert%20MS%20to%20HoursMinutes%20-%20service-nowcom.user.js
// @updateURL https://update.greasyfork.org/scripts/399814/Convert%20MS%20to%20HoursMinutes%20-%20service-nowcom.meta.js
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

waitForKeyElements (
    ".highcharts-point ",
    ms_to_m
);

// Add Create Appointment button
// 
//https://www.w3schools.com/jsref/met_node_appendchild.asp
var appt_button = document.createElement("button");
appt_button.style = "white-space: nowrap";
appt_button.innerHTML = "Convert to Minutes";
appt_button.id = "ms_to_m";
appt_button.onClick = "ms_to_m()";

//document.getElementById("sysverb_update_and_stay").insertAdjacentElement("beforebegin", appt_button);
document.getElementById("history-button").insertAdjacentElement("beforebegin", appt_button);

button = document.getElementById("ms_to_m");
button.addEventListener("click", ms_to_m, false);

function ms_to_m(time_rect){
  for (i = 5 ; i < (document.getElementsByTagName("rect").length - 1) ; i++){
    console.log(document.getElementsByTagName("rect")[i])
    users_time_in_ms = document.getElementsByTagName("rect")[i].point.y_tooltip;
    users_time_in_ms = users_time_in_ms.replace(/,/g, "")
    users_time_in_ms = parseInt(users_time_in_ms)
    users_time_in_ms = users_time_in_ms / 60000
    users_time_in_h = Math.floor(users_time_in_ms / 60)
    users_time_in_min = users_time_in_ms % 60
    time_string = users_time_in_h + " hours, " + users_time_in_min + " min"
    document.getElementsByTagName("rect")[i].point.y_tooltip = time_string
  }
}
