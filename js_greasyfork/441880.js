// ==UserScript==
// @name         Extra Croutons (BETA)+
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  An automation script for 4TSOS's Extra Croutons
// @author       Hussam
// @match        *crouton.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crouton.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441880/Extra%20Croutons%20%28BETA%29%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/441880/Extra%20Croutons%20%28BETA%29%2B.meta.js
// ==/UserScript==

(function() {

    let summonBtn = document.querySelector("body > button");
    let autoClicker = document.createElement("button", { class: "auto-clicker" });
    autoClicker.innerHTML = "Free Croutons";
    
    // style
    autoClicker.style.cssText = "float: right; margin: 8px; border: none; border-radius: 10px; width: 90px; height: 60px; background-color: #d2d2d2c";
    
    autoClicker.addEventListener('click', (sec) => {
        sec = prompt("a new crouton every __ second/s", 1)
        setInterval(() => {
            summonBtn.click();
        }, sec * 1000)
    }
                                 );
document.body.appendChild(autoClicker);

})();