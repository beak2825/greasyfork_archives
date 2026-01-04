// ==UserScript==
// @name         Reverso Context Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the blur and registration notice from the bottom results on context.reverso.net. Note: it does not give access to more results than are on the page.
// @author       Cocconator
// @match        https://context.reverso.net/*/*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        aGM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/424709/Reverso%20Context%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/424709/Reverso%20Context%20Script.meta.js
// ==/UserScript==

function waitForKeyElements (
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
    else targetNodes = $(iframeSelector).contents () .find (selectorTxt);
        if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        targetNodes.each ( function () {
            var jThis = $(this);
            var alreadyFound = jThis.data ('alreadyFound') || false;

            if (!alreadyFound) {
                var cancelFound = actionFunction (jThis);
                if (cancelFound) btargetsFound = false;
                else jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    if (btargetsFound && bWaitOnce && timeControl) {
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements ( selectorTxt,
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
    waitForKeyElements.controlObj = controlObj;
}

waitForKeyElements (".example.blocked", removeDSclass);

function removeDSclass (jNode) {
    console.log ("Cleaned node: ", jNode);
    jNode.removeClass ("blocked");
}

(function() {
    'use strict';
    document.querySelector('#blocked-results-banner').remove();
})();