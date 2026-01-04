// ==UserScript==
// @name        URGENT Audio - service-now.com
// @namespace   Violentmonkey Scripts
// @match       https://aut.service-now.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/7/2020, 12:53:30 PM
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/399817/URGENT%20Audio%20-%20service-nowcom.user.js
// @updateURL https://update.greasyfork.org/scripts/399817/URGENT%20Audio%20-%20service-nowcom.meta.js
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
    "#sc_task.short_description",
    enableAudio
);


//var urgentDetect = document.getElementById("sc_task.short_description").value
var detectResult

function enableAudio(urgentDetect){
    //if Desc contains urgent, Urgent, URGENT, urgently, Urgently or URGENTLY
    if(urgentDetect.includes("urgent") || urgentDetect.includes("Urgent") || urgentDetect.includes("URGENT") || urgentDetect.includes("urgently") || urgentDetect.includes("Urgently") || urgentDetect.includes("URGENTLY")){
      detectResult = true
      alert("URGENT DETECTED")
      detectResult2 = "detected"
      console.log("detected")
    }
    else{
      detectResult = false
      alert("URGENT NOT DETECTED")
      detectResult2 = "not detected"
      console.log("not detected")
    }
    
    //play audio
}





















