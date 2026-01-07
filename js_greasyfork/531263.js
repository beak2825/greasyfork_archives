// ==UserScript==
// @name           Tellows.it: Hide Annoying popups (the anti-adblock popup and others)
// @name:it        Tellows.it: Nasconde i popup fastidiosi (il popup anti-adblock ed altri)
// @description    This script hides the annoying popups (the anti-adblock popup and others) that are shown in the web page.
// @description:it Questo script nasconde i popup fastidiosi (il popup anti-adblock e altri) che vengono visualizzati nella pagina web.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.6
// @author         Cyrano68
// @license        MIT
// @match          https://*.tellows.it/*
// @require        https://update.greasyfork.org/scripts/547732/1725674/BasicLib.js
// @require        https://update.greasyfork.org/scripts/535551/1726151/HideAnnoyingPopupsLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/531263/Tellowsit%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531263/Tellowsit%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.meta.js
// ==/UserScript==

//
// >>>FILENAME=Tellows_it_HideAnnoyingPopups.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> Tellows_it_HideAnnoyingPopups: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const haplib = window.HideAnnoyingPopupsLib;
    blib.consoleLog(`CY==> Tellows_it_HideAnnoyingPopups: Using library 'HideAnnoyingPopupsLib' (version: ${haplib.getVersion()})`);

    //// When enabled, additional log will be shown.
    //haplib.setShowDebugLog(true);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> Tellows_it_HideAnnoyingPopups: HELLO! Loading script (version: ${myVersion})...`);

    const currUrl = window.location.href;
    blib.consoleLog(`CY==> Tellows_it_HideAnnoyingPopups: currUrl='${currUrl}'`);

    //document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    //window.addEventListener("load", onWindowLoaded);

    const mutationObserverConfig = {subtree: true, childList: true};
    const mutatedNodesConfig     = {selectors: ["div.fc-dialog-container"]/*, onMutatedNode: onMutatedNode*/};
    haplib.configure(mutationObserverConfig, mutatedNodesConfig);

    blib.consoleLog("CY==> Tellows_it_HideAnnoyingPopups: Script loaded");
})();
