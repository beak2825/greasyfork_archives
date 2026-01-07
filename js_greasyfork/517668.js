// ==UserScript==
// @name           TuttoSport.com: Hide Annoying popups (the anti-adblock popup and others)
// @name:it        TuttoSport.com: Nasconde i popup fastidiosi (il popup anti-adblock ed altri)
// @description    This script hides the annoying popups (the anti-adblock popup and others) that are shown in the web page.
// @description:it Questo script nasconde i popup fastidiosi (il popup anti-adblock e altri) che vengono visualizzati nella pagina web.
// @namespace      https://greasyfork.org/users/788550
// @version        1.1.9
// @author         Cyrano68
// @license        MIT
// @match          https://*.tuttosport.com/*
// @require        https://update.greasyfork.org/scripts/547732/1725674/BasicLib.js
// @require        https://update.greasyfork.org/scripts/535551/1726151/HideAnnoyingPopupsLib.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/517668/TuttoSportcom%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.user.js
// @updateURL https://update.greasyfork.org/scripts/517668/TuttoSportcom%3A%20Hide%20Annoying%20popups%20%28the%20anti-adblock%20popup%20and%20others%29.meta.js
// ==/UserScript==

//
// >>>FILENAME=TuttoSport_com_HideAnnoyingPopups.js<<<
//

// This is a IIFE (Immediately Invoked Function Expression).
(function()
{
    "use strict";

    const blib = window.BasicLib;
    //blib.setShowLogToScreen(true, 200);
    blib.consoleLog(`CY==> TuttoSport_com_HideAnnoyingPopups: Using library 'BasicLib' (version: ${blib.getVersion()})`);

    const haplib = window.HideAnnoyingPopupsLib;
    blib.consoleLog(`CY==> TuttoSport_com_HideAnnoyingPopups: Using library 'HideAnnoyingPopupsLib' (version: ${haplib.getVersion()})`);

    //// When enabled, additional log will be shown.
    //haplib.setShowDebugLog(true);

    const myVersion = GM_info.script.version;
    blib.consoleLog(`CY==> TuttoSport_com_HideAnnoyingPopups: HELLO! Loading script (version: ${myVersion})...`);

    const currUrl = window.location.href;
    blib.consoleLog(`CY==> TuttoSport_com_HideAnnoyingPopups: currUrl='${currUrl}'`);

    //document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
    //window.addEventListener("load", onWindowLoaded);

    const mutationObserverConfig  = {subtree: true, childList: true, attributes: true, attributeOldValue: true, attributeFilter: ["style"]};
    const mutatedNodesConfig      = {selectors: ["div.fc-dialog-container", "div#didomi-host", "div#videoFloat"]/*, onMutatedNode: onMutatedNode*/};
    const mutatedAttributesConfig = {attributeInfos: [{attributeName: "style", targetTagName: "HTML"}, {attributeName: "style", targetTagName: "BODY"}]/*, onMutatedAttribute: onMutatedAttribute*/};
    haplib.configure(mutationObserverConfig, mutatedNodesConfig, mutatedAttributesConfig);

    blib.consoleLog("CY==> TuttoSport_com_HideAnnoyingPopups: Script loaded");
})();
