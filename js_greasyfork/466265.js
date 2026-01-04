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

// ==UserScript==
// @name         NerinyanDL
// @version      0.1
// @description  nerinyan.moe에서 비트맵을 바로 다운로드 할 수 있는 버튼을 추가합니다.
// @author       [Minato] (https://osu.ppy.sh/users/13403126)
// @match        *://osu.ppy.sh/beatmapsets/*
// @grant        none
// @namespace https://greasyfork.org/users/1078999
// @downloadURL https://update.greasyfork.org/scripts/466265/NerinyanDL.user.js
// @updateURL https://update.greasyfork.org/scripts/466265/NerinyanDL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    waitForKeyElements(".beatmapset-header__buttons", () => {
        let mapid = window.location.pathname.split("/")[2];
        let container = document.getElementsByClassName("beatmapset-header__buttons")[0];
        container.innerHTML += `<a class="btn-osu-big btn-osu-big--beatmapset-header " href="https://api.nerinyan.moe/d/${mapid}" data-turbolinks="false"><span class="btn-osu-big__content"><span class="btn-osu-big__left"><span class="btn-osu-big__text-top">nerinyan.moe</span></span><span class="btn-osu-big__icon"><span class="fa fa-fw"><span class="fas fa-download"></span></span></span></span></a>`;
    });
})();