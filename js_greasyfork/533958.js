// ==UserScript==
// @name           AdnKronos.com: Hide Annoying popups (the anti-adblock popup and others)
// @name:it        AdnKronos.com: Nasconde i popup fastidiosi (il popup anti-adblock ed altri)
// @description    This script hides the annoying popups (the anti-adblock popup and others) that are shown in the web page.
// @description:it Questo script nasconde i popup fastidiosi (il popup anti-adblock e altri) che vengono visualizzati nella pagina web.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.6
// @author         Cyrano68
// @license        MIT
// @match          https://*.adnkronos.com/*
// @require        https://update.greasyfork.org/scripts/547732/1728184/BasicLib.js
// @require        https://update.greasyfork.org/scripts/535551/1728187/HideAnnoyingPopupsLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/533958/AdnKronoscom%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533958/AdnKronoscom%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.meta.js
// ==/UserScript==

//
// >>>FILENAME=AdnKronos_com_HideAnnoyingPopups.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> AdnKronos_com_HideAnnoyingPopups: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const haplib = window.HideAnnoyingPopupsLib;
    blib.consoleLog(`CY==> AdnKronos_com_HideAnnoyingPopups: Using library 'HideAnnoyingPopupsLib' (version: ${haplib.getVersion()})`);

    //// When enabled, additional log will be shown.
    //haplib.setShowDebugLog(true);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> AdnKronos_com_HideAnnoyingPopups: HELLO! Loading script (version: ${myVersion})...`);

    const currUrl = window.location.href;
    blib.consoleLog(`CY==> AdnKronos_com_HideAnnoyingPopups: currUrl='${currUrl}'`);

    //document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    //window.addEventListener("load", onWindowLoaded);

    const mutationObserverConfig = {subtree: true, childList: true};
    const mutatedNodesConfig     = {selectors: ["div#qc-cmp2-container", "div.gdpr_container"]/*, onMutatedNode: onMutatedNode*/};
    haplib.configure(mutationObserverConfig, mutatedNodesConfig);

    blib.consoleLog("CY==> AdnKronos_com_HideAnnoyingPopups: Script loaded");
})();
