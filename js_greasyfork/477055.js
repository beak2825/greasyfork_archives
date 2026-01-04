// ==UserScript==
// @name         courseraSubtitles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Coursera 视频字幕
// @author       You
// @match        https://www.coursera.org/learn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coursera.org
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477055/courseraSubtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/477055/courseraSubtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    // Your code here...
    function video(){
        console.log('find video');
        $("<div id='newSubtitle'>subtitles here......</div>").appendTo(".css-w2o4pw").prependTo(".css-w2o4pw");
        $("#newSubtitle").css("background-color", "rgb(219 232 14)");
        $("#newSubtitle").css("color", "rgb(232 46 4)");
        $("#newSubtitle").css("font-size", "25px");
        $("#newSubtitle").css("font-weight", "bold");
        $("#newSubtitle").css("height", "80px");
    }

    waitForKeyElements('.css-w2o4pw', video);

    function subtitles(){
//        console.log('find active subtitles');
        var txt = $('.active').children("span").text();
//        console.log(txt);

        $('#newSubtitle').html(txt);
    }
    waitForKeyElements('.active', subtitles);
})();