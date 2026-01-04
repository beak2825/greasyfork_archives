// ==UserScript==
// @name           FinecoBank.com Inbox: Mark all messages as read and Delete all messages
// @name:it        FinecoBank.com Inbox: Segna tutti i messaggi come letti e Cancella tutti i messaggi
// @description    This script adds two buttons in the page "Inbox" of FinecoBank.com that allow to mark all messages as read and to delete all messages.
// @description:it Questo script aggiunge due bottoni nella pagina "Inbox" di FinecoBank.com che consentono di segnare tutti i messaggi come letti e di cancellare tutti i messaggi.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.6
// @author         Cyrano68
// @license        MIT
// @match          https://finecobank.com/*
// @require        https://update.greasyfork.org/scripts/547732/1725674/BasicLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/491165/FinecoBankcom%20Inbox%3A%20Mark%20all%20messages%20as%20read%20and%20Delete%20all%20messages.user.js
// @updateURL https://update.greasyfork.org/scripts/491165/FinecoBankcom%20Inbox%3A%20Mark%20all%20messages%20as%20read%20and%20Delete%20all%20messages.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true);
    //blib.setMaxNumScreenLogs(200);
    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: HELLO! Loading script (version: ${myVersion})...`);

    let currUrl = window.location.href;
    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: currUrl='${currUrl}'`);

    const targetUrls = ["https://finecobank.com/pvt/myfineco/mailbox"];
    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: targetUrls='${targetUrls}'`);

    function onDOMContentLoaded()
    {
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onDOMContentLoaded - document.readyState=${document.readyState}`);

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
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onDOMContentLoaded - myCSS.outerHTML='${myCSS.outerHTML}'`);
    }

    function onWindowLoaded()
    {
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onWindowLoaded - document.readyState=${document.readyState}`);

        let index = {value: -1};
        if (blib.textMatchesArray(currUrl, targetUrls, index))
        {
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onWindowLoaded - Function 'blib.textMatchesArray(currUrl, targetUrls, index)' returned true, index=${index.value}`);
            addMyObjects();
        }

        // Sometimes the javascript is not able to understand when the url changed, expecially in a SPA (single-page-application).
        // Therefore I start a timer that periodically will check the current url and, if needed, add/remove the "MyObjects".
        // NOTE: The start of the "CheckUrlTimer" is delayed of a random value.
        const delay_ms = blib.getMathRandomInteger(567, 1234);
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onWindowLoaded - delay_ms=${delay_ms}`);
        setTimeout(checkUrl, delay_ms);
    }

    function checkUrl()
    {
        blib.consoleLog("CY==> FinecoBank_com_Inbox_DeleteAll: checkUrl");

        let timerId = 0;
        const interval_ms = 1234; // 1.234s

        timerId = blib.setInterval2((inputTimerId) =>
        {
            // NOTE: The "inputTimerId" will be undefined when this callback is called by the "setInterval" function
            // and will have a valid value when this callback is called by the "setInterval2" function.
            //

            const effectiveTimerId = (inputTimerId === undefined) ? timerId : inputTimerId;
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onCheckUrlTimeout - timerId=${timerId}, inputTimerId=${inputTimerId}, effectiveTimerId=${effectiveTimerId}`);

            const prevUrl = currUrl;
            currUrl = window.location.href;
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onCheckUrlTimeout - prevUrl='${prevUrl}', currUrl='${currUrl}'`);

            if (currUrl !== prevUrl)
            {
                let index = {value: -1};
                if (blib.textMatchesArray(currUrl, targetUrls, index))
                {
                    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onCheckUrlTimeout - Function 'blib.textMatchesArray(currUrl, targetUrls, index)' returned true, index=${index.value} - Entered in the target url '${targetUrls[index.value]}'`);
                    addMyObjects();
                }
                else if (blib.textMatchesArray(prevUrl, targetUrls, index))
                {
                    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onCheckUrlTimeout - Function 'blib.textMatchesArray(prevUrl, targetUrls, index)' returned true, index=${index.value} - Exited from the target url '${targetUrls[index.value]}'`);
                    removeMyObjects();
                }
            }
        }, interval_ms, false);
    }

    function addMyObjects()
    {
        blib.consoleLog("CY==> FinecoBank_com_Inbox_DeleteAll: addMyObjects");

        let timerId = 0;
        const interval_ms = 250;

        timerId = blib.setInterval2((inputTimerId) =>
        {
            // NOTE: The "inputTimerId" will be undefined when this callback is called by the "setInterval" function
            // and will have a valid value when this callback is called by the "setInterval2" function.
            //

            const effectiveTimerId = (inputTimerId === undefined) ? timerId : inputTimerId;
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onAddMyObjectsTimeout - timerId=${timerId}, inputTimerId=${inputTimerId}, effectiveTimerId=${effectiveTimerId}`);

            const divInbox = document.querySelector("div#inbox-client-app");
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onAddMyObjectsTimeout - divInbox=${divInbox}`);
            if (divInbox !== null)
            {
                blib.consoleLog("CY==> FinecoBank_com_Inbox_DeleteAll: onAddMyObjectsTimeout - data READY");

                clearInterval(effectiveTimerId);
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onAddMyObjectsTimeout - TIMER STOPPED - effectiveTimerId=${effectiveTimerId}`);

                // Create a new button that will allow to mark all messages as read.
                const myButton1 = Object.assign(document.createElement("button"), {id: "myButton1", textContent: "MARK ALL AS READ", className: "button-3", style: "margin-right: 5px"});
                myButton1.addEventListener("click", markAllAsRead);
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onAddMyObjectsTimeout - myButton1.outerHTML='${myButton1.outerHTML}'`);

                // The button is placed before the "divInbox".
                divInbox.before(myButton1);

                // Create a new button that will allow to delete all messages.
                const myButton2 = Object.assign(document.createElement("button"), {id: "myButton2", textContent: "DELETE ALL", className: "button-3", style: "margin-left: 5px"});
                myButton2.addEventListener("click", deleteAll);
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onAddMyObjectsTimeout - myButton2.outerHTML='${myButton2.outerHTML}'`);

                // The button is placed before the "divInbox".
                divInbox.before(myButton2);

                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onAddMyObjectsTimeout - DONE`);
            }
            else
            {
                blib.consoleLog("CY==> FinecoBank_com_Inbox_DeleteAll: onAddMyObjectsTimeout - data NOT READY... wait");
            }
        }, interval_ms, true);
    }

    function removeMyObjects()
    {
        blib.consoleLog("CY==> FinecoBank_com_Inbox_DeleteAll: removeMyObjects");

        const myButton1 = document.querySelector("button#myButton1");
        if ((myButton1 !== undefined) && (myButton1 !== null))
        {
            myButton1.remove();
        }

        const myButton2 = document.querySelector("button#myButton2");
        if ((myButton2 !== undefined) && (myButton2 !== null))
        {
            myButton2.remove();
        }
    }

    async function markAllAsRead()
    {
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: markAllAsRead`);
        let counter = 0;
        while (true)
        {
            const divReadMessages = document.querySelectorAll("div#inbox-client-app div.messageRow.read.row");
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: markAllAsRead - counter=${counter} - divReadMessages.length=${divReadMessages.length}`);

            const divUnreadMessages = document.querySelectorAll("div#inbox-client-app div.messageRow.messageunread.row");
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: markAllAsRead - counter=${counter} - divUnreadMessages.length=${divUnreadMessages.length}`);
            if (divUnreadMessages.length == 0)
            {
                break;
            }

            const divUnreadMessage = divUnreadMessages[0];
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: markAllAsRead - counter=${counter} - divUnreadMessage.outerHTML=${divUnreadMessage.outerHTML}`);

            const divButton = divUnreadMessage.querySelector("div[role=\"button\"]");
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: markAllAsRead - counter=${counter} - divButton=${divButton}`);
            if (divButton !== null)
            {
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: markAllAsRead - counter=${counter} - divButton.outerHTML='${divButton.outerHTML}'`);
                await openCloseMessagePage(divButton);
                await messageListReady();
            }

            counter++;
        }
    }

    async function openCloseMessagePage(divButton)
    {
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: openCloseMessagePage`);
        divButton.click();  // Open the message-page.

        const promise = new Promise((resolve, reject) =>
        {
            let timerId = 0;
            const interval_ms = 250;

            timerId = blib.setInterval2((inputTimerId) =>
            {
                // NOTE: The "inputTimerId" will be undefined when this callback is called by the "setInterval" function
                // and will have a valid value when this callback is called by the "setInterval2" function.
                //

                const effectiveTimerId = (inputTimerId === undefined) ? timerId : inputTimerId;
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenCloseMessagePageTimeout - timerId=${timerId}, inputTimerId=${inputTimerId}, effectiveTimerId=${effectiveTimerId}`);

                const divMsgNavigator = document.querySelector("div#msg-navigator");
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenCloseMessagePageTimeout - divMsgNavigator=${divMsgNavigator}`);
                if (divMsgNavigator !== null)
                {
                    const pathX = divMsgNavigator.querySelector("path[data-name|='Icons / Close / Solid']");
                    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenCloseMessagePageTimeout - pathX=${pathX}`);
                    if (pathX !== null)
                    {
                        const buttonX = pathX.closest("button.btn.btn-secondary");
                        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenCloseMessagePageTimeout - buttonX='${buttonX}'`);
                        if (buttonX !== null)
                        {
                            clearInterval(effectiveTimerId);
                            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenCloseMessagePageTimeout - TIMER STOPPED - effectiveTimerId=${effectiveTimerId}`);

                            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenCloseMessagePageTimeout - buttonX.outerHTML='${buttonX.outerHTML}'`);
                            buttonX.click();  // Close the message-page.
                            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenCloseMessagePageTimeout - RESOLVE`);
                            resolve();
                        }
                    }
                }
            }, interval_ms, true);
        });

        return promise;
    }

    async function messageListReady()
    {
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: messageListReady`);
        const promise = new Promise((resolve, reject) =>
        {
            let timerId = 0;
            const interval_ms = 250;

            timerId = blib.setInterval2((inputTimerId) =>
            {
                // NOTE: The "inputTimerId" will be undefined when this callback is called by the "setInterval" function
                // and will have a valid value when this callback is called by the "setInterval2" function.
                //

                const effectiveTimerId = (inputTimerId === undefined) ? timerId : inputTimerId;
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onMessageListReadyTimeout - timerId=${timerId}, inputTimerId=${inputTimerId}, effectiveTimerId=${effectiveTimerId}`);

                const divReadMessages = document.querySelectorAll("div#inbox-client-app div.messageRow.read.row");
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onMessageListReadyTimeout - divReadMessages.length=${divReadMessages.length}`);

                const divUnreadMessages = document.querySelectorAll("div#inbox-client-app div.messageRow.messageunread.row");
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onMessageListReadyTimeout - divUnreadMessages.length=${divUnreadMessages.length}`);

                if ((divReadMessages.length + divUnreadMessages.length) > 0)
                {
                    clearInterval(effectiveTimerId);
                    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onMessageListReadyTimeout - TIMER STOPPED - effectiveTimerId=${effectiveTimerId}`);

                    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onMessageListReadyTimeout - RESOLVE`);
                    resolve();
                }
            }, interval_ms, true);
        });

        return promise;
    }

    async function deleteAll()
    {
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll`);
        let counter = 0;
        while (true)
        {
            const divReadMessages = document.querySelectorAll("div#inbox-client-app div.messageRow.read.row");
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll - counter=${counter} - divReadMessages.length=${divReadMessages.length}`);

            const divUnreadMessages = document.querySelectorAll("div#inbox-client-app div.messageRow.messageunread.row");
            blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll - counter=${counter} - divUnreadMessages.length=${divUnreadMessages.length}`);
            if ((divReadMessages.length == 0) && (divUnreadMessages.length == 0))
            {
                break;
            }

            if (divReadMessages.length > 0)
            {
                const divReadMessage = divReadMessages[0];
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll - counter=${counter} - divReadMessage.outerHTML=${divReadMessage.outerHTML}`);

                const divButton = divReadMessage.querySelector("div[role=\"button\"]");
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll - counter=${counter} - divButton=${divButton}`);
                if (divButton !== null)
                {
                    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll - counter=${counter} - divButton.outerHTML='${divButton.outerHTML}'`);
                    await openDeleteMessagePage(divButton);
                    if ((divReadMessages.length + divUnreadMessages.length) > 1)
                    {
                        await messageListReady();
                    }
                }

                counter++;
            }
            else if (divUnreadMessages.length > 0)
            {
                const divUnreadMessage = divUnreadMessages[0];
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll - counter=${counter} - divUnreadMessage.outerHTML=${divUnreadMessage.outerHTML}`);

                const divButton = divUnreadMessage.querySelector("div[role=\"button\"]");
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll - counter=${counter} - divButton=${divButton}`);
                if (divButton !== null)
                {
                    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: deleteAll - counter=${counter} - divButton.outerHTML='${divButton.outerHTML}'`);
                    await openDeleteMessagePage(divButton);
                    if ((divReadMessages.length + divUnreadMessages.length) > 1)
                    {
                        await messageListReady();
                    }
                }

                counter++;
            }
        }
    }

    async function openDeleteMessagePage(divButton)
    {
        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: openDeleteMessagePage`);
        divButton.click();  // Open the message-page.

        const promise = new Promise((resolve, reject) =>
        {
            let timerId = 0;
            const interval_ms = 250;

            timerId = blib.setInterval2((inputTimerId) =>
            {
                // NOTE: The "inputTimerId" will be undefined when this callback is called by the "setInterval" function
                // and will have a valid value when this callback is called by the "setInterval2" function.
                //

                const effectiveTimerId = (inputTimerId === undefined) ? timerId : inputTimerId;
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenDeleteMessagePageTimeout - timerId=${timerId}, inputTimerId=${inputTimerId}, effectiveTimerId=${effectiveTimerId}`);

                const divMsgNavigator = document.querySelector("div#msg-navigator");
                blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenDeleteMessagePageTimeout - divMsgNavigator=${divMsgNavigator}`);
                if (divMsgNavigator !== null)
                {
                    const buttonTrash = document.querySelector("button.btn-trash.btn.btn-secondary");
                    blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenDeleteMessagePageTimeout - buttonTrash='${buttonTrash}'`);
                    if (buttonTrash !== null)
                    {
                        clearInterval(effectiveTimerId);
                        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenDeleteMessagePageTimeout - TIMER STOPPED - effectiveTimerId=${effectiveTimerId}`);

                        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenDeleteMessagePageTimeout - buttonTrash.outerHTML='${buttonTrash.outerHTML}'`);
                        buttonTrash.click();  // Delete the message-page.
                        blib.consoleLog(`CY==> FinecoBank_com_Inbox_DeleteAll: onOpenDeleteMessagePageTimeout - RESOLVE`);
                        resolve();
                    }
                }
            }, interval_ms, true);
        });

        return promise;
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

    blib.consoleLog("CY==> FinecoBank_com_Inbox_DeleteAll: Script loaded");
})();
