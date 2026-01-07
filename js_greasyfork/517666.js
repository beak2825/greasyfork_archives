// ==UserScript==
// @name           LaStampa.it: Hide Annoying popups (the anti-adblock popup and others)
// @name:it        LaStampa.it: Nasconde i popup fastidiosi (il popup anti-adblock ed altri)
// @description    This script hides the annoying popups (the anti-adblock popup and others) that are shown in the web page.
// @description:it Questo script nasconde i popup fastidiosi (il popup anti-adblock e altri) che vengono visualizzati nella pagina web.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.9
// @author         Cyrano68
// @license        MIT
// @match          https://*.lastampa.it/*
// @require        https://update.greasyfork.org/scripts/547732/1725674/BasicLib.js
// @require        https://update.greasyfork.org/scripts/535551/1726151/HideAnnoyingPopupsLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/517666/LaStampait%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517666/LaStampait%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.meta.js
// ==/UserScript==

//
// >>>FILENAME=LaStampa_it_HideAnnoyingPopups.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> LaStampa_it_HideAnnoyingPopups: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const haplib = window.HideAnnoyingPopupsLib;
    blib.consoleLog(`CY==> LaStampa_it_HideAnnoyingPopups: Using library 'HideAnnoyingPopupsLib' (version: ${haplib.getVersion()})`);

    //// When enabled, additional log will be shown.
    //haplib.setShowDebugLog(true);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> LaStampa_it_HideAnnoyingPopups: HELLO! Loading script (version: ${myVersion})...`);

    const currUrl = window.location.href;
    blib.consoleLog(`CY==> LaStampa_it_HideAnnoyingPopups: currUrl='${currUrl}'`);

    //document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    //window.addEventListener("load", onWindowLoaded);

    const mutationObserverConfig = {subtree: true, childList: true};
    const mutatedNodesConfig     = {selectors: ["div.fc-dialog-container", "div#iubenda-cs-banner"]/*, onMutatedNode: onMutatedNode*/};
    haplib.configure(mutationObserverConfig, mutatedNodesConfig);

    blib.consoleLog("CY==> LaStampa_it_HideAnnoyingPopups: Script loaded");
})();
