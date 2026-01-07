// ==UserScript==
// @name           MondoMobileWeb.it: Hide Annoying popups (the anti-adblock popup and others)
// @name:it        MondoMobileWeb.it: Nasconde i popup fastidiosi (il popup anti-adblock ed altri)
// @description    This script hides the annoying popups (the anti-adblock popup and others) that are shown in the web page.
// @description:it Questo script nasconde i popup fastidiosi (il popup anti-adblock e altri) che vengono visualizzati nella pagina web.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.3
// @author         Cyrano68
// @license        MIT
// @match          https://*.mondomobileweb.it/*
// @require        https://update.greasyfork.org/scripts/547732/1725674/BasicLib.js
// @require        https://update.greasyfork.org/scripts/535551/1726151/HideAnnoyingPopupsLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/538072/MondoMobileWebit%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538072/MondoMobileWebit%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.meta.js
// ==/UserScript==

//
// >>>FILENAME=MondoMobileWeb_it_HideAnnoyingPopups.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> MondoMobileWeb_it_HideAnnoyingPopups: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const haplib = window.HideAnnoyingPopupsLib;
    blib.consoleLog(`CY==> MondoMobileWeb_it_HideAnnoyingPopups: Using library 'HideAnnoyingPopupsLib' (version: ${haplib.getVersion()})`);

    //// When enabled, additional log will be shown.
    //haplib.setShowDebugLog(true);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> MondoMobileWeb_it_HideAnnoyingPopups: HELLO! Loading script (version: ${myVersion})...`);

    const currUrl = window.location.href;
    blib.consoleLog(`CY==> MondoMobileWeb_it_HideAnnoyingPopups: currUrl='${currUrl}'`);

    //document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    //window.addEventListener("load", onWindowLoaded);

    function onMutatedAttribute(mutation)
    {
        // This function must return a boolean value: stopMutationProcessing. When it is TRUE the current mutation will not be further processed.
        //

        blib.consoleLog(`CY==> MondoMobileWeb_it_HideAnnoyingPopups: onMutatedAttribute - BEGIN`);
        let stopMutationProcessing = false;

        if ((mutation.attributeName === "class") && (mutation.target.tagName === "BODY") && mutation.target.classList.contains("tie-popup-is-opend"))
        {
            blib.consoleLog(`CY==> MondoMobileWeb_it_HideAnnoyingPopups: onMutationList - BEFORE: mutation.target.classList='${mutation.target.classList}'`);
            mutation.target.classList.remove("tie-popup-is-opend");
            blib.consoleLog(`CY==> MondoMobileWeb_it_HideAnnoyingPopups: onMutationList - AFTER: mutation.target.classList='${mutation.target.classList}' ---> attribute modification REMOVED`);
            stopMutationProcessing = true;
        }

        blib.consoleLog(`CY==> MondoMobileWeb_it_HideAnnoyingPopups: onMutatedAttribute - END - stopMutationProcessing=${stopMutationProcessing}`);
        return stopMutationProcessing;
    }

    const mutationObserverConfig  = {subtree: true, childList: true, attributes: true, attributeOldValue: true, attributeFilter: ["style", "class"]};
    const mutatedNodesConfig      = {selectors: ["div#tie-popup-adblock"]/*, onMutatedNode: onMutatedNode*/};
    const mutatedAttributesConfig = {attributeInfos: [{attributeName: "style", targetTagName: "HTML"}, {attributeName: "class", targetTagName: "BODY"}], onMutatedAttribute: onMutatedAttribute};
    haplib.configure(mutationObserverConfig, mutatedNodesConfig, mutatedAttributesConfig);

    blib.consoleLog("CY==> MondoMobileWeb_it_HideAnnoyingPopups: Script loaded");
})();
