// ==UserScript==
// @name         Vote for Pacers
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  votes for pacers
// @author       Me
// @match        https://www.greater.com.au/greatermidnorthcoast*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greater.com.au
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468557/Vote%20for%20Pacers.user.js
// @updateURL https://update.greasyfork.org/scripts/468557/Vote%20for%20Pacers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var now=new Date(),
        then=new Date(),
        death=new Date(),
        diffD,
        diff,
        voted=0;
    then.setHours(5);
    then.setMinutes(0);
    then.setSeconds(0);
    death.setHours(22);
    death.setMinutes(0);
    death.setSeconds(0);
    diff=then.getTime()-now.getTime();
    diffD=death.getTime()-now.getTime();
    if (diff > 0) {
        setTimeout(function(){ location.reload(); }, diff);
        startCountdown(diff);
    } else {
        if (diffD < 0) {
            setTimeout(function(){ location.reload(); }, (7*60*60*1000) + diffD);
            startCountdown((7*60*60*1000) + diffD);
        } else {
            waitForKeyElements ( "#option_ede1f753-c0a0-44dc-b836-c378ff5ae888_2", vote);
            waitForKeyElements ( ".voting-card__vote-status--voted", setTimeout(reload,10000));
        }
    }
    function reload() {
        if (voted == 0) {
            startCountdown(5*60*1000);
            setTimeout(function(){ location.reload(); }, 5*60*1000);
        }
    }
    function vote (jNode) {
        setTimeout(function(){jNode.parents (".voting-card__cta-layout").children("button").click(); },5000);
        var timeToRefresh = Math.floor(Math.random() * (70 - 61 + 1) + 61)*60*1000;
        setTimeout(function(){
        startCountdown(timeToRefresh-10000)},10000);
        setTimeout(function(){ location.reload(); }, timeToRefresh);
        voted = 1;
    }
    function startCountdown(seconds) {
  let counter = seconds,
      timer;
        $("#e7ce1993-49aa-4a7f-8021-ea1df2979257 h2").append(" in <span id='countdownTimer'>"+new Date(counter).toISOString().substr(11, 8)+"</span>");
  const interval = setInterval(() => {
      timer = new Date(counter).toISOString().substr(11, 8);
        $("#countdownTimer").text(timer);
    counter = counter - 1000;
  }, 1000);
}
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
})();