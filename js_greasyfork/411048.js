// ==UserScript==
// @name         Disable Discord chat input
// @namespace    https://github.com/Dragosarus/Userscripts/
// @version      4.1
// @description  Avoid accidentally typing in chat
// @author       Dragosarus
// @match        http://discord.com/*
// @match        https://discord.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/411048/Disable%20Discord%20chat%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/411048/Disable%20Discord%20chat%20input.meta.js
// ==/UserScript==

// NOTE: Does not work with Greasemonkey as it neither supports GM_registerMenuCommand nor GM_unregisterMenuCommand.
// Use Tampermonkey or Violentmonkey instead.

(function() {
    'use strict';
    var persist = true; // Remember selected mode across page refreshes and browser reloads

    // Modes (use menu to cycle between these):
    // "hover": Enable chat input only when the cursor is hovering over it
    // "strict": Disables chat input completely
    // "off": Keep chat input enabled.
    var modes = ["hover", "strict", "off"];
    var menuShortcut = 'm';
    var modeIndex;
    var menuId;

    const channelObserver = new MutationObserver(channelObserverCallback);
    const serverObserver = new MutationObserver(serverObserverCallback);
    const options = {childList:true, attributes:true};
    init();

    async function init() {
        // Will activate the mode of the next index (default: hover)
        const modeIndex_default = modes.length - 1;

        // Load stored value if available and persist is set to true
        if (persist) {
            var storedMode = await GM.getValue("mode", "hover");
            modeIndex = modes.indexOf(storedMode);
            if (modeIndex != -1) {
                modeIndex = (modeIndex - 1) % modes.length;
            } else { // Mode does not exist
                modeIndex = modeIndex_default;
            }
        } else {
            modeIndex = modeIndex_default;
        }
        start();
    }

    function start(){
        switchMode();
        addObserver(serverObserver,"div[class*='content-']");
        serverObserverCallback(); // Init
    }

    function serverObserverCallback(mutationList, observer) { // When changing servers
        //console.log("server callback");
        addObserver(channelObserver,"div[class*='chat-']", disable);
        addHoverFunc();
    }
    function channelObserverCallback(mutationList, observer) { // When changing channels
        //console.log("channel callback");
        disable();
        addHoverFunc();
    }

    function addObserver(observer, query, onSuccess = function(){}) {
        var q = $(query);
        if (!q.length) { setTimeout(function(){addObserver(observer, query, onSuccess)},100);}
        else {
            observer.observe(q[0], options);
            onSuccess();
        }
    }

    function switchMode() {
        modeIndex = (modeIndex + 1) % modes.length;
        if (persist) {GM.setValue("mode",modes[modeIndex]);}
        GM_unregisterMenuCommand(menuId);
        menuId = GM_registerMenuCommand("Switch mode [current: " + modes[modeIndex] + "]", switchMode, menuShortcut);
        switch (modes[modeIndex]){
            case "hover":
            case "strict":
                disable();
                break;
            case "off":
                enable();
                break;
            default:
                console.error("Disable Discord chat input: Unimplemented mode.");
                break;
        }
    }

    function disable() {
        if (modes[modeIndex] != "off") {
            //console.log("disabled!");
            var textareaQuery = $("div[class*='slateTextArea']");
            if (textareaQuery.length) {
                textareaQuery.attr("contenteditable","false");
                textareaQuery[0].style.removeProperty("-webkit-user-modify"); // Needed for Chrome
                textareaQuery.parent().parent()[0].style.setProperty("pointer-events","none"); // Disable mouse events
            } else {
                setTimeout(disable, 100);
            }
        }
    }

    function enable() {
        var textareaQuery = $("div[class*='slateTextArea']");
        if (textareaQuery.length) {
            textareaQuery.attr("contenteditable","true");
            textareaQuery[0].style.setProperty("-webkit-user-modify", "read-write-plaintext-only");
            textareaQuery.parent().parent()[0].style.removeProperty("pointer-events");
        } else {
            setTimeout(enable, 100);
        }
    }

    function addHoverFunc() {
        var textareaQuery = $("div[class*='scrollableContainer']");
        if (textareaQuery.length) {
            textareaQuery.hover(hoverEnter, hoverExit);
        } else {
            setTimeout(addHoverFunc, 100);
        }
    }

    function hoverEnter() {
        if (modes[modeIndex] == "hover"){
            enable();
        }
    }

    function hoverExit() {
        if (modes[modeIndex] == "hover"){
            disable();
        }
    }

})();
/*eslint-env jquery*/ // stop eslint from showing "'$' is not defined" warnings
