// ==UserScript==
// @name           Motor1.com: Hide Annoying popups (the anti-adblock popup and others)
// @name:it        Motor1.com: Nasconde i popup fastidiosi (il popup anti-adblock ed altri)
// @description    This script hides the annoying popups (the anti-adblock popup and others) that are shown in the web page.
// @description:it Questo script nasconde i popup fastidiosi (il popup anti-adblock e altri) che vengono visualizzati nella pagina web.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.2
// @author         Cyrano68
// @license        MIT
// @match          https://*.motor1.com/*
// @require        https://update.greasyfork.org/scripts/547732/1725674/BasicLib.js
// @require        https://update.greasyfork.org/scripts/535551/1726151/HideAnnoyingPopupsLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/539409/Motor1com%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539409/Motor1com%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.meta.js
// ==/UserScript==

//
// >>>FILENAME=Motor1_com_HideAnnoyingPopups.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> Motor1_com_HideAnnoyingPopups: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const haplib = window.HideAnnoyingPopupsLib;
    blib.consoleLog(`CY==> Motor1_com_HideAnnoyingPopups: Using library 'HideAnnoyingPopupsLib' (version: ${haplib.getVersion()})`);

    //// When enabled, additional log will be shown.
    //haplib.setShowDebugLog(true);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> Motor1_com_HideAnnoyingPopups: HELLO! Loading script (version: ${myVersion})...`);

    const currUrl = window.location.href;
    blib.consoleLog(`CY==> Motor1_com_HideAnnoyingPopups: currUrl='${currUrl}'`);

    //document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    //window.addEventListener("load", onWindowLoaded);

    function onMutatedAttribute(mutation)
    {
        // This function must return a boolean value: stopMutationProcessing. When it is TRUE the current mutation will not be further processed.
        //

        blib.consoleLog(`CY==> Motor1_com_HideAnnoyingPopups: onMutatedAttribute - BEGIN`);
        stopMutationProcessing = false;

        if ((mutation.attributeName === "class") && (mutation.target.tagName === "HTML") && mutation.target.classList.contains("sp-message-open"))
        {
            blib.consoleLog(`CY==> Motor1_com_HideAnnoyingPopups: onMutationList - BEFORE: mutation.target.classList='${mutation.target.classList}'`);
            mutation.target.classList.remove("sp-message-open");
            blib.consoleLog(`CY==> Motor1_com_HideAnnoyingPopups: onMutationList - AFTER: mutation.target.classList='${mutation.target.classList}' ---> attribute modification REMOVED`);
            stopMutationProcessing = true;
        }

        blib.consoleLog(`CY==> Motor1_com_HideAnnoyingPopups: onMutatedAttribute - END - stopMutationProcessing=${stopMutationProcessing}`);
        return stopMutationProcessing;
    }

    const mutationObserverConfig  = {subtree: true, childList: true, attributes: true, attributeOldValue: true, attributeFilter: ["class"]};
    const mutatedNodesConfig      = {selectors: ["div#sp_message_container_1310761"]/*, onMutatedNode: onMutatedNode*/};
    const mutatedAttributesConfig = {attributeInfos: [{attributeName: "class", targetTagName: "HTML"}], onMutatedAttribute: onMutatedAttribute};
    haplib.configure(mutationObserverConfig, mutatedNodesConfig, mutatedAttributesConfig);

    blib.consoleLog("CY==> Motor1_com_HideAnnoyingPopups: Script loaded");
})();
