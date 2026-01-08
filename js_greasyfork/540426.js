// ==UserScript==
// @name           FinecoBank.com: Hide Annoying popups (the warning-disconnection popup)
// @name:it        FinecoBank.com: Nasconde i popup fastidiosi (il popup di avviso disconnessione)
// @description    This script hides the annoying popups (the warning-disconnection popu) that are shown in the web page.
// @description:it Questo script nasconde i popup fastidiosi (il popup di avviso disconnessione) che vengono visualizzati nella pagina web.
// @namespace      https://greasyfork.org/users/788550
// @version        1.2.1
// @author         Cyrano68
// @license        MIT
// @match          https://*.finecobank.com/*
// @require        https://update.greasyfork.org/scripts/547732/1728184/BasicLib.js
// @require        https://update.greasyfork.org/scripts/535551/1728187/HideAnnoyingPopupsLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/540426/FinecoBankcom%3A%20Hide%20Annoying%20popups%20%28the%20warning-disconnection%20popup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540426/FinecoBankcom%3A%20Hide%20Annoying%20popups%20%28the%20warning-disconnection%20popup%29.meta.js
// ==/UserScript==

//
// >>>FILENAME=FinecoBank_com_HideAnnoyingPopups.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const haplib = window.HideAnnoyingPopupsLib;
    blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: Using library 'HideAnnoyingPopupsLib' (version: ${haplib.getVersion()})`);

    //// When enabled, additional log will be shown.
    //haplib.setShowDebugLog(true);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: HELLO! Loading script (version: ${myVersion})...`);

    const currUrl = window.location.href;
    blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: currUrl='${currUrl}'`);

    //document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    //window.addEventListener("load", onWindowLoaded);

    const buttonText      = "RIMANI CONNESSO";
    const minClickDelay_s = 2;
    const maxClickDelay_s = 4;

    // ONLY-FOR-DEBUG - BEGIN
    const myID = blib.generateID();
    blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: myID='${myID}'`);
    // ONLY-FOR-DEBUG - END

    let timerAlreadyRunning = false;
    function onMutatedNode(mutation, selector, foundNode)
    {
        // This function must return a boolean value: stopMutationProcessing. When it is TRUE the current "foundNode" will not be further processed.
        //

        blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: onMutatedNode - BEGIN - myID='${myID}' - foundNode.textContent=${foundNode.textContent}`);
        let stopMutationProcessing = false;

        if (selector === "button.btn.btn-primary")
        {
            if ((buttonText.length === 0) || (foundNode.textContent.toUpperCase() === buttonText.toUpperCase()))
            {
                // The popup will appear for "clickDelay_ms" milliseconds. Then the script will click "programmatically" on the button.
                if (minClickDelay_s > 0)
                {
                    if (!timerAlreadyRunning)
                    {
                        timerAlreadyRunning = true;

                        const minClickDelay_ms = minClickDelay_s * 1e3;
                        const maxClickDelay_ms = maxClickDelay_s * 1e3;
                        const clickDelay_ms    = blib.getMathRandomInteger(minClickDelay_ms, maxClickDelay_ms);
                        blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: onMutatedNode - myID='${myID}' - clickDelay_ms=${clickDelay_ms}`);

                        setTimeout(() =>
                        {
                            blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: onMutatedNode - delayed - myID='${myID}' - clicking on button programmatically`);
                            foundNode.click();
                            timerAlreadyRunning = false;
                        }, clickDelay_ms);
                    }
                    else
                    {
                        blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: onMutatedNode - myID='${myID}' - timer for delayed click already RUNNING`);
                    }
                }
                else
                {
                    blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: onMutatedNode - myID='${myID}' - clicking on button programmatically`);
                    foundNode.click();
                }
            }
            else
            {
                blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: onMutatedNode - myID='${myID}' - Button IGNORED`);
            }

            // IMPORTANT: In this case we will always return TRUE (otherwise the "haplib" will hide every matching button).
            stopMutationProcessing = true;
        }

        blib.consoleLog(`CY==> FinecoBank_com_HideAnnoyingPopups: onMutatedNode - END - myID='${myID}' - stopMutationProcessing=${stopMutationProcessing}`);
        return stopMutationProcessing;
    }

    const mutationObserverConfig = {subtree: true, childList: true};
    const mutatedNodesConfig     = {selectors: ["button.btn.btn-primary", "div#onetrust-consent-sdk", "div#onetrust-banner-sdk", "div.onetrust-pc-dark-filter"], onMutatedNode: onMutatedNode};
    haplib.configure(mutationObserverConfig, mutatedNodesConfig);

    blib.consoleLog("CY==> FinecoBank_com_HideAnnoyingPopups: Script loaded");
})();
