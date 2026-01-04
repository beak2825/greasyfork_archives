// ==UserScript==
// @name        UnBlur: Budstikka.no
// @namespace   Violentmonkey Scripts
// @license     MIT
// @match       https://*.budstikka.no/*
// @icon https://budstikka.no/favicon.ico
// @grant       none
// @version     1.0
// @author      pwa
// @description 11/23/2022, 10:36:30 PM
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/461861/UnBlur%3A%20Budstikkano.user.js
// @updateURL https://update.greasyfork.org/scripts/461861/UnBlur%3A%20Budstikkano.meta.js
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


// incentive-onboarding bacchus-incentive-wrapper


waitForKeyElements (
    '.bacchus-incentive-wrapper', unNag
);


function unNag (jNode) {
  console.log("unNag")
  let nag = document.getElementsByClassName('incentive-onboarding bacchus-incentive-wrapper')[0]
  nag.setAttribute('hidden', true);

  let blur = document.querySelector('.aid-background-blur');
  blur.style.filter = "blur(0px)";

  document.getElementById('aid-overlay').style.zIndex = -1;

  let d = document.body.appendChild(
    Object.assign(document.createElement('div'),{ id : 'pwa'})
  )

  d.style.top = 0;
  d.style.position = "absolute";
  d.style.background = "#f00";
  d.style.color = "#ccc";
  d.style.fontFamily = "var(--openSans)";
  d.style.textTransform = "uppercase";
  d.innerText = "Unblur 😈"
  d.style.zIndex = 999999;

}