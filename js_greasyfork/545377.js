// ==UserScript==
// @name           AnconaToday.it: Hide Annoying popups (the anti-adblock popup and others)
// @name:it        AnconaToday.it: Nasconde i popup fastidiosi (il popup anti-adblock ed altri)
// @description    This script hides the annoying popups (the anti-adblock popup and others) that are shown in the web page.
// @description:it Questo script nasconde i popup fastidiosi (il popup anti-adblock e altri) che vengono visualizzati nella pagina web.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.2
// @author         Cyrano68
// @license        MIT
// @match          https://*.anconatoday.it/*
// @require        https://update.greasyfork.org/scripts/547732/1728184/BasicLib.js
// @require        https://update.greasyfork.org/scripts/535551/1728187/HideAnnoyingPopupsLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/545377/AnconaTodayit%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545377/AnconaTodayit%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.meta.js
// ==/UserScript==

//
// >>>FILENAME=AnconaToday_it_HideAnnoyingPopups.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> AnconaToday_it_HideAnnoyingPopups: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const haplib = window.HideAnnoyingPopupsLib;
    blib.consoleLog(`CY==> AnconaToday_it_HideAnnoyingPopups: Using library 'HideAnnoyingPopupsLib' (version: ${haplib.getVersion()})`);

    //// When enabled, additional log will be shown.
    //haplib.setShowDebugLog(true);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> AnconaToday_it_HideAnnoyingPopups: HELLO! Loading script (version: ${myVersion})...`);

    const currUrl = window.location.href;
    blib.consoleLog(`CY==> AnconaToday_it_HideAnnoyingPopups: currUrl='${currUrl}'`);

    //document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    //window.addEventListener("load", onWindowLoaded);

    function onMutatedAttribute(mutation)
    {
        // This function must return a boolean value: stopMutationProcessing. When it is TRUE the current mutation will not be further processed.
        //

        blib.consoleLog(`CY==> AnconaToday_it_HideAnnoyingPopups: onMutatedAttribute - BEGIN`);
        let stopMutationProcessing = false;

        if ((mutation.attributeName === "class") && (mutation.target.tagName === "DIV") && mutation.target.classList.contains("iub--active"))
        {
            blib.consoleLog(`CY==> AnconaToday_it_HideAnnoyingPopups: onMutationList - BEFORE: mutation.target.classList='${mutation.target.classList}'`);
            mutation.target.classList.remove("iub--active");
            blib.consoleLog(`CY==> AnconaToday_it_HideAnnoyingPopups: onMutationList - AFTER: mutation.target.classList='${mutation.target.classList}' ---> attribute modification REMOVED`);
            stopMutationProcessing = true;
        }

        blib.consoleLog(`CY==> AnconaToday_it_HideAnnoyingPopups: onMutatedAttribute - END - stopMutationProcessing=${stopMutationProcessing}`);
        return stopMutationProcessing;
    }

    const mutationObserverConfig  = {subtree: true, childList: true, attributes: true, attributeOldValue: true, attributeFilter: ["class"]};
    const mutatedNodesConfig      = {selectors: ["div#iubenda-cs-banner"]/*, onMutatedNode: onMutatedNode*/};
    const mutatedAttributesConfig = {attributeInfos: [{attributeName: "class", targetTagName: "DIV"}], onMutatedAttribute: onMutatedAttribute};
    haplib.configure(mutationObserverConfig, mutatedNodesConfig, mutatedAttributesConfig);

    blib.consoleLog("CY==> AnconaToday_it_HideAnnoyingPopups: Script loaded");
})();
