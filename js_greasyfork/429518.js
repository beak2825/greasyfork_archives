// ==UserScript==
// @name           FinecoBank.com MyCards: Show only the credit card transactions
// @name:it        FinecoBank.com MyCards: Mostra soltanto le operazioni della carta di credito
// @description    This script adds a button in the page "My Cards" of FinecoBank.com that allows to show the list (and the total amount) of the only credit card transactions.
// @description:it Questo script aggiunge un bottone nella pagina "My Cards" di FinecoBank.com che consente di visualizzare la lista (e l'ammontare totale) delle sole operazioni con carta di credito.
// @namespace      https://greasyfork.org/users/788550
// @version        1.3.2
// @author         Cyrano68
// @license        MIT
// @match          https://*.finecobank.com/*
// @require        https://update.greasyfork.org/scripts/547732/1728184/BasicLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/429518/FinecoBankcom%20MyCards%3A%20Show%20only%20the%20credit%20card%20transactions.user.js
// @updateURL https://update.greasyfork.org/scripts/429518/FinecoBankcom%20MyCards%3A%20Show%20only%20the%20credit%20card%20transactions.meta.js
// ==/UserScript==

//
// >>>FILENAME=FinecoBank_com_MyCards_ShowOnlyCC.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: HELLO! Loading script (version: ${myVersion})...`);

    let currUrl = window.location.href;
    blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: currUrl='${currUrl}'`);

    const targetUrls = ["https://finecobank.com/conto-e-carte/mycards", "https://finecobank.com/pvt/banking/mycards"];
    blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: targetUrls='${targetUrls}'`);

    function onDOMContentLoaded()
    {
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onDOMContentLoaded - document.readyState=${document.readyState}`);

        const myCSS = document.createElement("style");

        // SEE: https://getcssscan.com/css-buttons-examples
        myCSS.textContent = `
            .button-3 {
                appearance: none;
                background-color: #2ea44f;
                border: 1px solid rgba(27, 31, 35, .15);
                border-radius: 6px;
                box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
                box-sizing: border-box;
                color: #fff;
                cursor: pointer;
                display: inline-block;
                font-family: -apple-system,system-ui,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
                font-size: 14px;
                font-weight: 600;
                line-height: 20px;
                padding: 6px 16px;
                position: relative;
                text-align: center;
                text-decoration: none;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                vertical-align: middle;
                white-space: nowrap;
            }
            .button-3:focus:not(:focus-visible):not(.focus-visible) {
                box-shadow: none;
                outline: none;
            }
            .button-3:hover {
                background-color: #2c974b;
            }
            .button-3:focus {
                box-shadow: rgba(46, 164, 79, .4) 0 0 0 3px;
                outline: none;
            }
            .button-3:disabled {
                background-color: #94d3a2;
                border-color: rgba(27, 31, 35, .1);
                color: rgba(255, 255, 255, .8);
                cursor: default;
            }
            .button-3:active {
                background-color: #298e46;
                box-shadow: rgba(20, 70, 32, .2) 0 1px 0 inset;
            }
        `;

        document.body.appendChild(myCSS);
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onDOMContentLoaded - myCSS.outerHTML='${myCSS.outerHTML}'`);
    }

    function onWindowLoaded()
    {
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onWindowLoaded - document.readyState=${document.readyState}`);

        let index = {value: -1};
        if (blib.textMatchesArray(currUrl, targetUrls, index))
        {
            blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onWindowLoaded - Function 'blib.textMatchesArray(currUrl, targetUrls, index)' returned true, index=${index.value}`);
            addMyObjects();
        }

        // Sometimes the javascript is not able to understand when the url changed, expecially in a SPA (single-page-application).
        // Therefore I start a timer that periodically will check the current url and, if needed, add/remove the "MyObjects".
        // NOTE: The start of the "CheckUrlTimer" is delayed of a random value.
        const delay_ms = blib.getMathRandomInteger(567, 1234);
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onWindowLoaded - delay_ms=${delay_ms}`);
        setTimeout(checkUrl, delay_ms);
    }

    function checkUrl()
    {
        blib.consoleLog("CY==> FinecoBank_com_MyCards_ShowOnlyCC: checkUrl");

        let timerId = 0;
        const interval_ms = 1234; // 1.234s

        timerId = blib.setInterval2((inputTimerId) =>
        {
            // NOTE: The "inputTimerId" will be undefined when this callback is called by the "setInterval" function
            // and will have a valid value when this callback is called by the "setInterval2" function.
            //

            const effectiveTimerId = (inputTimerId === undefined) ? timerId : inputTimerId;
            blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onCheckUrlTimeout - timerId=${timerId}, inputTimerId=${inputTimerId}, effectiveTimerId=${effectiveTimerId}`);

            const prevUrl = currUrl;
            currUrl = window.location.href;
            blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onCheckUrlTimeout - prevUrl='${prevUrl}', currUrl='${currUrl}'`);

            if (currUrl !== prevUrl)
            {
                let index = {value: -1};
                if (blib.textMatchesArray(currUrl, targetUrls, index))
                {
                    blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onCheckUrlTimeout - Function 'blib.textMatchesArray(currUrl, targetUrls, index)' returned true, index=${index.value} - Entered in the target url '${targetUrls[index.value]}'`);
                    addMyObjects();
                }
                else if (blib.textMatchesArray(prevUrl, targetUrls, index))
                {
                    blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onCheckUrlTimeout - Function 'blib.textMatchesArray(prevUrl, targetUrls, index)' returned true, index=${index.value} - Exited from the target url '${targetUrls[index.value]}'`);
                    removeMyObjects();
                }
            }
        }, interval_ms, false);
    }

    function addMyObjects()
    {
        blib.consoleLog("CY==> FinecoBank_com_MyCards_ShowOnlyCC: addMyObjects");

        let timerId = 0;
        const interval_ms = 250;

        timerId = blib.setInterval2((inputTimerId) =>
        {
            // NOTE: The "inputTimerId" will be undefined when this callback is called by the "setInterval" function
            // and will have a valid value when this callback is called by the "setInterval2" function.
            //

            const effectiveTimerId = (inputTimerId === undefined) ? timerId : inputTimerId;
            blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onAddMyObjectsTimeout - timerId=${timerId}, inputTimerId=${inputTimerId}, effectiveTimerId=${effectiveTimerId}`);

            const divMovimenti = document.querySelector("div.movimenti-container");
            blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onAddMyObjectsTimeout - divMovimenti=${divMovimenti}`);
            if (divMovimenti !== null)
            {
                blib.consoleLog("CY==> FinecoBank_com_MyCards_ShowOnlyCC: onAddMyObjectsTimeout - data READY");

                clearInterval(effectiveTimerId);
                blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onAddMyObjectsTimeout - TIMER STOPPED - effectiveTimerId=${effectiveTimerId}`);

                // Create a new button that will allow to show only the credit card entries.
                const myButton = Object.assign(document.createElement("button"), {id: "myButton", textContent: "SHOW ONLY CREDIT CARD", className: "button-3"});
                myButton.addEventListener("click", showOnlyCC);
                blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onAddMyObjectsTimeout - myButton.outerHTML='${myButton.outerHTML}'`);

                // The button is placed before the "divMovimenti".
                divMovimenti.before(myButton);

                blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: onAddMyObjectsTimeout - DONE`);
            }
            else
            {
                blib.consoleLog("CY==> FinecoBank_com_MyCards_ShowOnlyCC: onAddMyObjectsTimeout - data NOT READY... wait");
            }
        }, interval_ms, true);
    }

    function removeMyObjects()
    {
        blib.consoleLog("CY==> FinecoBank_com_Inbox_DeleteAll: removeMyObjects");

        const myButton = document.querySelector("button#myButton");
        if ((myButton !== undefined) && (myButton !== null))
        {
            myButton.remove();
        }

        const mySpan = document.querySelector("span#mySpan");
        if ((mySpan !== undefined) && (mySpan !== null))
        {
            mySpan.remove();
        }
    }

    function showOnlyCC()
    {
        blib.consoleLog("CY==> FinecoBank_com_MyCards_ShowOnlyCC: showOnlyCC");

        // First of all delete the span tag (eventually added in a previous click) that shows the total amount of the credit card transactions.
        const mySpan = document.querySelector("span#mySpan");
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: showOnlyCC - mySpan=${mySpan}`);
        if (mySpan !== null)
        {
            mySpan.remove();
        }

        // Then remove the bancomat entries.
        const bancomatEntries = document.querySelectorAll("div.movimenti-container div.text-right > img[src$='Bancomat.svg']");
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: showOnlyCC - bancomatEntries.length=${bancomatEntries.length}`);

        // Sometimes there was a problem when the bancomat entries were removed. In details, it happened when in the same day there was a "creditcard" entry and a "bancomat" entry.
        // After the bancomat entry was removed if I tried to expand the "creditcard" entry (in order to see the details of the transaction) an error was generated.
        // Therefore I decided to hide the "bancomat" entries instead of remove them.
        bancomatEntries.forEach((bancomatEntry, i) =>
        {
            // The bancomat entries will be hidden.
            const divAccordionWrapper = bancomatEntry.closest("div.accordionWrapper");
            blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: showOnlyCC - i=${i}, divAccordionWrapper=${divAccordionWrapper}`);
            if (divAccordionWrapper !== null)
            {
                divAccordionWrapper.style.display = "none";  // Hide node.
            }
        });

        // Finally calculate the total amount of the credit card transactions.
        calculateTotalCC();
    }

    function calculateTotalCC()
    {
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: calculateTotalCC`);

        const allEntries = document.querySelectorAll("div.accordionWrapper");
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: calculateTotalCC - allEntries.length=${allEntries.length}`);

        const ccEntries = Array.from(allEntries).filter((entry) => {return (entry.style.display !== "none");});
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: calculateTotalCC - ccEntries.length=${ccEntries.length}`);

        let totalCC = 0;
        ccEntries.forEach((ccEntry, i) =>
        {
            //consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: calculateTotalCC - i=${i}`);
            const spanAmount = ccEntry.querySelector("div.text-right.amountDetail > span.detailAmount");

            let amountText = spanAmount.textContent.slice(0,-4);

            // Try to understand the type of decimal point (dot or comma) used in the page (it is supposed that there are always two digits after the decimal point).
            if (amountText.slice(-3,-2) === ",")
            {
                // The decimal point is a comma (",")... therefore remove the "thousand" separators (".") and transform the comma decimal point in dot decimal point.
                amountText = amountText.replace(/\./g,"").replace(/\,/g,".");
            }
            else
            {
                // The decimal point is a dot (".")... Therefore only remove the "thousand" separators (",").
                amountText = amountText.replace(/\,/g,"");
            }

            // Now the variable "amountText2" is a string that contains numbers and at most the dot decimal point... i.e it can be parsed with "parseFloat".
            const amountValue = parseFloat(amountText);
            totalCC += amountValue;
        });

        addMySpan(totalCC);
    }

    function addMySpan(totalCC)
    {
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: addMySpan - totalCC=${totalCC}`);

        // Add a span (next to the new button) that shows the total amount of the credit card transactions.
        const totalCCText = " TOTAL: " + Number(Math.abs(totalCC)).toLocaleString("it-IT", {style: "currency", currency: "EUR"});
        const mySpan = Object.assign(document.createElement("span"), {id: "mySpan", textContent: totalCCText, style: "color: blue; font-weight: bold; font-size: 16px"});
        blib.consoleLog(`CY==> FinecoBank_com_MyCards_ShowOnlyCC: addMySpan - mySpan.outerHTML='${mySpan.outerHTML}'`);

        const myButton = document.querySelector("button#myButton");

        // The span is placed after the "myButton".
        myButton.after(mySpan);
    }

    if (document.readyState === "loading")
    {
        document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    }
    else
    {
        onDOMContentLoaded();
    }

    if (document.readyState === "complete")
    {
        onWindowLoaded();
    }
    else
    {
        window.addEventListener("load", onWindowLoaded);
    }

    blib.consoleLog("CY==> FinecoBank_com_MyCards_ShowOnlyCC: Script loaded");
})();
