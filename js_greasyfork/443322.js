// ==UserScript==
// @name        Discord SpellCheck
// @version     1.0
// @description Enable spellcheck 4/13/2022, 13:30:00
// @namespace   Violentmonkey Scripts
// @match        http://discord.com/*
// @match        https://discord.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@1
// @require      http://code.jquery.com/jquery-latest.js
// @license MIT
// @author      RahulRaj@Gmail.com
// @copyright 2022, rahuraj80 (https://github.com/rahulraj80)
// @downloadURL https://update.greasyfork.org/scripts/443322/Discord%20SpellCheck.user.js
// @updateURL https://update.greasyfork.org/scripts/443322/Discord%20SpellCheck.meta.js
// ==/UserScript==

(function() {
    //console.log("US:Utilities : ");
    console.log("US:Utilities : Entered Discord SpellCheck Function");
    'use strict';
    var persist = true; // Remember selected mode across page refreshes and browser reloads
 
    const channelObserver = new MutationObserver(channelObserverCallback);
    const serverObserver = new MutationObserver(serverObserverCallback);
    const options = {childList:true, attributes:true};
    init();
 
    async function init() {
        start();
    }
 
    function start(){
        addObserver(serverObserver,"div[class*='content-']");
        serverObserverCallback(); // Init
    }
 
    function serverObserverCallback(mutationList, observer) { // When changing servers
        addObserver(channelObserver,"div[class*='chat-']", SCenable);
    }

    function channelObserverCallback(mutationList, observer) { // When changing channels
        SCenable();
    }
 
    function addObserver(observer, query, onSuccess = function(){}) {
        var q = $(query);
        if (!q.length) { setTimeout(function(){addObserver(observer, query, onSuccess)},100);}
        else {
            observer.observe(q[0], options);
            onSuccess();
        }
    }
 
    function SCenable() {
        console.log("US:Utilities : SCenable() entry ");
      
            var textareaQuery = $("div[class*='slateTextArea']");
            if (textareaQuery.length) {
                console.log("US:Utilities : SCenable() before : " + textareaQuery.spellcheck + ":_");
                textareaQuery.attr("spellcheck","true");
                textareaQuery[0].style.removeProperty("-webkit-user-modify"); // Needed for Chrome
                console.log("US:Utilities : SCenable() after : " + textareaQuery.spellcheck + ":_");
                //textareaQuery.parent().parent()[0].style.setProperty("pointer-events","none"); // Disable mouse events
            } else {
                console.log("US:Utilities : SCenable() try again : " + textareaQuery.spellcheck + ":_");
              setTimeout(SCenable, 100);
            }
    }
 
 
})();
/*eslint-env jquery*/ // stop eslint from showing "'$' is not defined" warnings