// ==UserScript==
// @name         Thaana Qaafu
// @namespace    http://tampermonkey.net/
// @version      2024-10-29newfeature_bold2
// @description  Designed for OWOT users to paste the thaana qaafu symbol.
// @author       Out
// @match        *ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514713/Thaana%20Qaafu.user.js
// @updateURL https://update.greasyfork.org/scripts/514713/Thaana%20Qaafu.meta.js
// ==/UserScript==

// assuming all functions are defined
/*thaana qaafu*/
!function(){
    function thaanaqaafu(){
        OWOT.typeChar(String.fromCharCode(1956),true,YourWorld.Color,true,true,YourWorld.BgColor,false,false,false);
    }
    function thaanaqaafubold(){
        OWOT.typeChar(String.fromCharCode(1956),true,YourWorld.Color,true,true,YourWorld.BgColor,true,false,false);
    }
    menu.addOption(String.fromCharCode(1956),()=>{
        thaanaqaafu()
    })
    menu.addOption("bold "+String.fromCharCode(1956),()=>{
        thaanaqaafubold()
    })
}();