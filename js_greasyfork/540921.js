// ==UserScript==
// @name         easylearn
// @namespace    http://tampermonkey.net/
// @version      2025-05-14
// @description  EasyLearn
// @author       You
// @match        https://easylearn.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org

// @require      https://code.jquery.com/jquery-3.6.1.js
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/540921/easylearn.user.js
// @updateURL https://update.greasyfork.org/scripts/540921/easylearn.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForKeyElements ( selectorTxt,  actionFunction,  bWaitOnce,    iframeSelector) {
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

    waitForKeyElements('.more-text',r=>{
        $('.more-text').click();
        setTimeout(()=>{

            $('.dan-btn').click();
            $(".exercise-btn-4").click();

           

        },100);
    })

    waitForKeyElements('.expand-btn',r=>{
       $(".expand-btn").click();
    })

})();