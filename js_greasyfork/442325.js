// ==UserScript==
// @name         RestoreLegacy
// @namespace    https://tishka.xyz/sdt
// @version      0.2
// @description  removes whitespaces & normalize numbers
// @author       Tishka
// @match        https://marketing-jet.lux-casino.co/*
// @match        https://marketing-sol.lux-casino.co/*
// @match        https://marketing-rox.lux-casino.co/*
// @match	     https://marketing.lux-casino.co/*
// @match		 https://marketing-fresh.lux-casino.co/*
// @match		 https://marketing-izzi.lux-casino.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lux-casino.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442325/RestoreLegacy.user.js
// @updateURL https://update.greasyfork.org/scripts/442325/RestoreLegacy.meta.js
// ==/UserScript==

(function() {
    'use strict';
        let list = document.querySelectorAll("span");
        for(let value of list){
           // if(value.getAttribute("style") == "color: black; font-size: 1em"){
           if(value.classList.value.match(/status_tag/)){
                value.setAttribute("style", "font-size: 1em");
                value.innerText = value.innerText.replace(/\s/g, "");
            }
        }
})();