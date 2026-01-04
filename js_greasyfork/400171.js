// ==UserScript==
// @name        John Q Listings
// @namespace   Violentmonkey Scripts
// @match       https://rwremuera.co.nz/team/agents/john-quiambao/
// @grant       none
// @version     1.0.0
// @author      -
// @description 4/10/2020, 10:56:29 AM
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/400171/John%20Q%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/400171/John%20Q%20Listings.meta.js
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


var houses = {};

waitForKeyElements (
  //".zoomIt", 
  ".propertyQuick ", 
  grab_data
);


function grab_data(listing)
{
  //the space behind zoomIt is necessary, and we have to filter like this cause there's also all of the sold listings which have zoomIt in their class, but it's not the whole thing
  if (listing[0].childNodes[3].getAttribute("class") == "zoomIt ")
  {
    link = listing[0].childNodes[3].href;
    image_link = "https://rwremuera.co.nz" + listing[0].childNodes[3].children[0].childNodes[1].dataset.src;
    image_link = image_link.split("?")[0]
    base_info = listing[0].childNodes[5].firstElementChild.innerText.split("\n"); //gives us [0] the suburb, [1] the address, [2] rough pricing
    console.log("\n");
    console.log(link);
    console.log(image_link);
    console.log(base_info);
  }
}
console.log(houses);


