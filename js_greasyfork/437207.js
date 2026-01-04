// ==UserScript==
// @name        Add to Collection
// @namespace   Forsman.Tomas
// @match       https://www.thingiverse.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021-12-17 16:27:51
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/437207/Add%20to%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/437207/Add%20to%20Collection.meta.js
// ==/UserScript==

// define a handler
function doc_keyUp(e) {

    // this would test for whichever key is 40 (down arrow) and the ctrl key at the same time
    if (e.ctrlKey && e.key === 'c') {
        // call your function to do the thing
        $("div.CollectThingWindow__hidden--OSA7G").removeClass("CollectThingWindow__hidden--OSA7G");
    }
}

document.addEventListener('keyup', doc_keyUp, false);

// Extends the search results from 20 to 200 per page
URLSearchParams.prototype._append = URLSearchParams.prototype.append;
URLSearchParams.prototype.append = function append(k, v) {
  if(k==='per_page') v = 200;
  return this._append(k, v);
};

// Add color to current page number
$( document ).ready(function() {
    var pathname = window.location.pathname;
var number = pathname.split(":")[1];
$('.pagination-link:contains(' + number + ')').css("color","blue");
});


// No waiting for downloads
waitForKeyElements ("div.ThingPage__sidebar--6ZDYI > div.SidebarMenu__sidebarMenu--3uBjd > div.SidebarMenu__sideMenuTop--3xCYh > div > a", noBullshit);

function noBullshit() {
    'use strict';

    const downloadElement = document.querySelector('div.ThingPage__sidebar--6ZDYI > div.SidebarMenu__sidebarMenu--3uBjd > div.SidebarMenu__sideMenuTop--3xCYh > div > a');
    downloadElement.href = window.location.href + '/zip';
    downloadElement.innerHTML = '<div class="button button-primary">DOWNLOAD</div>'
};


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