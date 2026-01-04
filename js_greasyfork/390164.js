// ==UserScript==
// @name         Show Youtube Videos' Publishing Date
// @namespace    https://tampermonkey.net/
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @version      2.00
// @description  Fix hidden video's publishing date
// @author       KudoAmine
// @match        https://www.youtube.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/390164/Show%20Youtube%20Videos%27%20Publishing%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/390164/Show%20Youtube%20Videos%27%20Publishing%20Date.meta.js
// ==/UserScript==

// try {
// waitForKeyElements ("[id='date']", FixDate);
// } catch (e) {
//    }

function FixDate (jNode) {
jNode.css ("font-size", "1.1rem");
       }


function waitForKeyElements(
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined"){
        targetNodes = $(selectorTxt);
       }else{
        targetNodes = $(iframeSelector).contents()
        .find(selectorTxt);
       }
    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        targetNodes.each(function() {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                var cancelFound = actionFunction(jThis);
                if (cancelFound) {
                    btargetsFound = false;
                }else{
                    jThis.data('alreadyFound', true);
            }}
        });
    } else {
        btargetsFound = false;
    }

    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    if (btargetsFound && bWaitOnce && timeControl) {
        clearInterval(timeControl);
        delete controlObj[controlKey]
    } else {
        if (!timeControl) {
            timeControl = setInterval(function() {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}