// ==UserScript==
// @name         Torn Character Model Toggle
// @namespace    torn_button_test
// @version      1.3
// @license      MIT
// @description  Adds a button to toggle character model on both Torn loader and items pages.
// @author       yoyoYossarian
// @match        https://www.torn.com/loader.php?*
// @match        https://www.torn.com/item.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525675/Torn%20Character%20Model%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/525675/Torn%20Character%20Model%20Toggle.meta.js
// ==/UserScript==

(function() {
    console.log("Torn Character Model Toggle script loaded");

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const node = document.querySelector(selector);
            if (node) {
                clearInterval(interval);
                callback(node);
            }
        }, 200);
    }

    function toggleCharacterModel() {
        console.log("Button clicked");
        const modelImg = document.querySelector("div[class^='model___'] img");
        if (modelImg) {
            console.log("Model div found:", modelImg.outerHTML);
            const currentSrc = modelImg.getAttribute("src");
            const maleModel = "/images/v2/attack/models/male_model.png";
            const femaleModel = "/images/v2/attack/models/female_model.png";
            
            if (currentSrc.includes("female_model.png")) {
                modelImg.setAttribute("src", maleModel);
                console.log("Character model switched to male");
            } else {
                modelImg.setAttribute("src", femaleModel);
                console.log("Character model switched to female");
            }
        } else {
            console.log("Model div not found");
        }
    }

    function addTestButton(node) {
        const btn = document.createElement("button");
        btn.innerText = "Toggle Model";
        btn.id = "test-button";
        btn.classList.add("torn-btn");
        btn.style.marginLeft = "10px";
        
        btn.addEventListener("click", toggleCharacterModel);
        
        node.insertAdjacentElement("beforeBegin", btn);
        console.log("Toggle Model button added to page");
    }
    
    if (window.location.href.includes("loader.php")) {
        waitForElement('div[class^="bottomSection"]', addTestButton);
    } else if (window.location.href.includes("item.php")) {
        waitForElement("#mainContainer > div.content-wrapper.winter > div.main-items-cont-wrap > div.content-title.m-bottom10", addTestButton);
    }
})();
