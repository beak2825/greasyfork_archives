// ==UserScript==
// @name           Repubblica.it: Hide the "ExitIntent" popup
// @name:it        Repubblica.it: Nasconde il popup "ExitIntent"
// @description    This script hides the "ExitIntent" popup that sometimes is shown when you want to exit from the current page of the site.
// @description:it Questo script nasconde il popup "ExitIntent" che a volte viene visualizzato quando si vuole uscire dalla pagina corrente del sito.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.5
// @author         Cyrano68
// @license        MIT
// @match          https://*.repubblica.it/*
// @require        https://update.greasyfork.org/scripts/547732/1725674/BasicLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/450050/Repubblicait%3A%20Hide%20the%20%22ExitIntent%22%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/450050/Repubblicait%3A%20Hide%20the%20%22ExitIntent%22%20popup.meta.js
// ==/UserScript==

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true);
    //blib.setMaxNumScreenLogs(200);
    blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    var myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: HELLO! Loading script (version: ${myVersion})...`);

    document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    window.addEventListener("load", onWindowLoaded);

    createMutationObserver();

    function onDOMContentLoaded()
    {
        blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: onDOMContentLoaded - document.readyState=${document.readyState}`);
        // DO NOTHING!
    }

    function onWindowLoaded()
    {
        blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: onWindowLoaded - document.readyState=${document.readyState}`);
        // DO NOTHING!
    }

    function onMutationList(mutationList, observer)
    {
        //blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: onMutationList - mutationList.length=${mutationList.length}`);
        mutationList.forEach((mutation, i) =>
        {
            //blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: onMutationList - mutation[${i}] - mutation.type=${mutation.type}`);
            if (mutation.type === "childList")
            {
                let addedNodes = mutation.addedNodes;
                if (addedNodes.length > 0)
                {
                    //blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: onMutationList - mutation[${i}] - addedNodes.length=${addedNodes.length}`);
                    addedNodes.forEach((addedNode, j) =>
                    {
                        let searchedDiv = searchVisibleNode(addedNode, "div#adagio-overlay-try-buy");
                        if (searchedDiv !== null)
                        {
                            //blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: onMutationList - searchedDiv.outerHTML='${searchedDiv.outerHTML}'`);

                            let parentElement = searchedDiv.parentElement;
                            blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: onMutationList - parentElement='${parentElement}'`);

                            searchedDiv.style.display = "none";  // Hide node.
                            document.body.style.overflowY = "scroll";  // Show vertical scrollbar.
                            blib.consoleLog(`CY==> Repubblica_it_HideExitIntentPopup: onMutationList - 'adagio-overlay-try-buy' - mutation[${i}], addedNode[${j}] - searchedDiv.tagName='${searchedDiv.tagName}', searchedDiv.id='${searchedDiv.id}' ---> HIDDEN`);
                        }
                    });
                }
            }
        });
    }

    function searchVisibleNode(node, selector)
    {
        let parentElement = node.parentElement;
        return (parentElement === null ? null : parentElement.querySelector(`${selector}:not([style*=\"display:none\"]):not([style*=\"display: none\"])`));
    }

    function createMutationObserver()
    {
        blib.consoleLog("CY==> Repubblica_it_HideExitIntentPopup: createMutationObserver");

        // SEE: https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

        // Create an observer instance linked to the callback function.
        const observer = new MutationObserver(onMutationList);

        // Options for the observer (which mutations to observe).
        const config = {subtree: true, childList: true};

        // Start observing the target node for configured mutations.
        observer.observe(document, config);
    }

    blib.consoleLog("CY==> Repubblica_it_HideExitIntentPopup: Script loaded");
})();
