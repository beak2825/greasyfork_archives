// ==UserScript==
// @name         Jira Backlog Order
// @namespace    http://tampermonkey.net/
// @version      2024-11-12
// @description  Insert temporary backlog ordering numbers on the items within a sprint.
// @author       Jarrod Lombardo
// @match        https://*.atlassian.net/jira/*/backlog*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517403/Jira%20Backlog%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/517403/Jira%20Backlog%20Order.meta.js
// ==/UserScript==

/* eslint-env jquery */

/*--- waitForKeyElements():
FIND IT HERE :
https://gist.github.com/raw/2625891/waitForKeyElements.js

A utility function, for Greasemonkey scripts,
that detects and handles AJAXed content.

Usage example:
waitForKeyElements ("div.comments", commentCallbackFunction);
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
                //else
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
        delete controlObj [controlKey];
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

/* Now do the actual work to number the rows: */

let cardListSelector = "div[data-testid*='software-backlog.card-list.id-']";
let cardRowSelector = "div[data-testid*='software-backlog.card-list.card.card-contents.card-container']";
let boiClass = "class=backlogOrderIndex";
let boiSelector = "div[" + boiClass + "]";

waitForKeyElements (cardRowSelector, actionFunction, false);

function addBoiSpan(node, index) {
    let indexString = '000' + (index + 1);
    node.append('<div ' + boiClass + '>' + indexString.substr(indexString.length - 3) + '</div>');
    node.data ('backlogOrderIndex', index);
    node.data ('alreadyFound', true);
}

function actionFunction (jNode) {
    let listNode = jNode.parents(cardListSelector);
    let rowdivs = listNode.find(cardRowSelector);
    rowdivs.each (function (index) {
        let jThis = $(this)
        let boiNodes = jThis.find(boiSelector);
        let oldBoiIndex = jThis.data('backlogOrderIndex') || false;
        if (boiNodes.length === 0) {
            addBoiSpan(jThis, index);
        } else if (oldBoiIndex && oldBoiIndex !== index) {
            boiNodes.remove();
            addBoiSpan(jThis, index);
        }
    });
}
