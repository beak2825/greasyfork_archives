// ==UserScript==
// @name         AUTO Show Assignee field in JIRA Create Linked Issue
// @namespace    https://www.hicaliber.com.au
// @version      0.2
// @description  Show Assignee field in the JIRA modal window of Create Linked Issue
// @author       Nikita Alekseev
// @match        http*://*.atlassian.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422513/AUTO%20Show%20Assignee%20field%20in%20JIRA%20Create%20Linked%20Issue.user.js
// @updateURL https://update.greasyfork.org/scripts/422513/AUTO%20Show%20Assignee%20field%20in%20JIRA%20Create%20Linked%20Issue.meta.js
// ==/UserScript==

//waitForKeyElements coped from https://gist.github.com/mjblay/18d34d861e981b7785e407c3b443b99b

function waitForKeyElements (
selectorTxt,    /* Required: The selector string that
                        specifies the desired element(s).
                    */
 actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
 bWaitOnce      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
) {
    var targetNodes, btargetsFound;
    targetNodes = document.querySelectorAll(selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.forEach(function(element) {
            var alreadyFound = element.dataset.found == 'alreadyFound' ? 'alreadyFound' : false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (element);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    element.dataset.found = 'alreadyFound';
            }
        } );
    }
    else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj  = waitForKeyElements.controlObj  ||  {};
    var controlKey  = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

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
                                    bWaitOnce
                                   );
            },
                                       300
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

waitForKeyElements("#create-linked-issue-dialog .jira-dialog-content #qf-field-assignee", (jNode) => jNode && jNode.removeAttribute('style'));