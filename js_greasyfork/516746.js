// ==UserScript==
// @name         YT Youtube Miniplayer Killer Remove Delete
// @namespace    http://tampermonkey.net/
// @version      3
// @description  remove mini player in youtube
// @author       SergoZar
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      GPLv3
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/516746/YT%20Youtube%20Miniplayer%20Killer%20Remove%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/516746/YT%20Youtube%20Miniplayer%20Killer%20Remove%20Delete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // commands in menu
    ////////////////////////////////////////////////////////////////////
    console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
    var commandIdF1 = null, commandIdF2 = null, commandIdF3 = null;
    var isF1 = true, isF2 = true, isF3 = true;

    function localStorageSave(){
        var iss = `${isF1-0}${isF2-0}${isF3-0}`;
        console.log("save", iss);
        localStorage.setItem("ytttttt", iss);
    }

    function localStorageLoad(){
        var iss = localStorage.getItem("ytttttt");
        if (iss){
            // я знаю що це пиздець але це працює
            // i know it sucks but it works
            console.log("load", iss);
            isF1 = iss[0] === "1";
            isF2 = iss[1] === "1";
            isF3 = iss[2] === "1";
            console.log("load",isF1,isF2,isF3);
        }
        else localStorageSave();
    }

    localStorageLoad();
    if(isF1) f1();
    if(isF2) f2();
    if(isF3) f3();

    function toggleF(f) {
             if (f == 1) isF1 = !isF1;
        else if (f == 2) isF2 = !isF2;
        else if (f == 3) isF3 = !isF3;

        localStorageSave();
        location.reload();
    }

    function commandF(isF, commandId, func, text){
        if (commandId !== null) GM_unregisterMenuCommand(commandId);
        commandId = GM_registerMenuCommand(`${isF ? '✔️':'❌'} ${text}`, func);
    }

    commandF(isF1, commandIdF1, function () { toggleF(1) }, "waiting miniplayer" );
    commandF(isF2, commandIdF2, function () { toggleF(2) }, "constant checking for presence of miniplayer");
    commandF(isF3, commandIdF3, function () { toggleF(3) }, 'press "i" again');

    ////////////////////////////////////////////////////////////////////



    // close when it appears .ytp-miniplayer-close-button
    // I don't know if it really works, but it seems to
    function f1(){
        console.log("Miniplayer Killer - f1 - waiting miniplayer ON");
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const newElement = document.querySelector('.ytp-miniplayer-close-button');
                    if (newElement) {
                        if (newElement && document.querySelector(".ytp-miniplayer-ui").style.display !== "none"){
                            newElement.click();
                        }
                        observer.disconnect();
                    }
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }


    // click close minuplayer. repeat 500ms
    // it will work guaranteed
    function f2(){
        console.log("Miniplayer Killer - f2 - constant checking for presence of miniplayer ON");
        setInterval(function(){
            var c = document.querySelector(".ytp-miniplayer-close-button");
            if (c && document.querySelector(".ytp-miniplayer-ui").style.display !== "none"){
                c.click();
            }
        },500);
    }


    // press i after i press
    // sometimes it may not work
    function f3(){
        console.log("Miniplayer Killer - f3 - press key i simulation ON");
        document.addEventListener('keydown', function(event) {
            if (event.keyCode === 73 && !event.ctrlKey && !event.altKey && !event.shiftKey && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) && document.activeElement.id !== "contenteditable-root" ) {
                console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII", document.activeElement);
                // press key i simulation
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'i',
                    code: 'KeyI',
                    keyCode: 73,
                    charCode: 73,
                    which: 73,
                    bubbles: true,
                    cancelable: true
                }));
            }
        });
    }

    setInterval(function(){
        var button = document.querySelector(".ytp-miniplayer-button.ytp-button");
        if (button && button.style.display !== "none") button.style.display = "none";
    },250);
})();