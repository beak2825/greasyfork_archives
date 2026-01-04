// ==UserScript==
// @name         Increase animevsub playback rate
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  try to take over the world!!!
// @author       luudanmatcuoi
// @license      MIT
// @include      https://animevietsub.*/*
// @include      https://anime*v*sub.*/phim/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515397/Increase%20animevsub%20playback%20rate.user.js
// @updateURL https://update.greasyfork.org/scripts/515397/Increase%20animevsub%20playback%20rate.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
};

function abaa(oho){
    var video = document.getElementById('media-player');
    var video_speed = video.getElementsByTagName('video')[0];
    video_speed.playbackRate=10;
    console.log(video_speed.playbackRate);
};
window.addEventListener('load', function() {
    waitForKeyElements("#media-player video:first", abaa);
}, false);

})();