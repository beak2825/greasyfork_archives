// ==UserScript==
// @name        New YouTube Green Likes Bar
// @description Turns the like bar green and makes it higher, works as of 14-Aug-2021
// @include     https://www.youtube.com/*
// @namespace   https://greasyfork.org/users/8233
// @version 0.0.5
// @namespace https://greasyfork.org/users/8233
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368166/New%20YouTube%20Green%20Likes%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/368166/New%20YouTube%20Green%20Likes%20Bar.meta.js
// ==/UserScript==
function recolorBars(sentimentbar)
{
    var likesbar = sentimentbar[0].children[0].children[0];
    var dislikesbar = sentimentbar[0].children[0];
    //make the bars 5 pixels instead of whatever the default is
    likesbar.style.height = '5px';
    dislikesbar.style.height = '5px';
    //change colors to nice deep green and red
    likesbar.style.backgroundColor = '#007f00';
    dislikesbar.style.backgroundColor = '#7f0000';
}
waitForKeyElements('ytd-sentiment-bar-renderer', recolorBars);
/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content. From: https://git.io/vMmuf
    
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
function waitForKeyElements(selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes,
    btargetsFound;
    if (typeof iframeSelector == 'undefined')
    targetNodes = $(selectorTxt);
    else
    targetNodes = $(iframeSelector).contents().find(selectorTxt);
    if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
        var jThis = $(this);
        var alreadyFound = jThis.data('alreadyFound') || false;
        if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound)
        btargetsFound = false;
            else
        jThis.data('alreadyFound', true);
        }
    });
    }
    else {
    btargetsFound = false;
    }  //--- Get the timer-control variable for this selector.
    
    var controlObj = waitForKeyElements.controlObj || {
    };
    var controlKey = selectorTxt.replace(/[^\w]/g, '_');
    var timeControl = controlObj[controlKey];
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey]
    }
    else {
    //--- Set a timer, if needed.
    if (!timeControl) {
        timeControl = setInterval(function () {
        waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector
        );
        }, 300
        );
        controlObj[controlKey] = timeControl;
    }
    }
    waitForKeyElements.controlObj = controlObj;
}

