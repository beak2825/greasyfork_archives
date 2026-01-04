// ==UserScript==
// @name         LinkedIn Endorse All Button
// @namespace    http://fenleytech.com/
// @version      1.0
// @description  Adds an Endorse All button to linked profiles you view
// @author       Kaleb Fenley
// @match        https://www.linkedin.com/in/*
// @icon         https://cdn-icons-png.flaticon.com/512/174/174857.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458134/LinkedIn%20Endorse%20All%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/458134/LinkedIn%20Endorse%20All%20Button.meta.js
// ==/UserScript==


let endorseAll = function() {
    let endorseButtons = Array.from(document.querySelectorAll("button")).filter(element => element.textContent.includes("Endorse") && !element.textContent.includes("Endorsed"));
    for (let button of endorseButtons) {
        button.click();
    }
}


let endorseAllButton = document.createElement("button");
endorseAllButton.innerHTML = "Endorse All Skills";
endorseAllButton.id = "endorse-all-button";
endorseAllButton.onclick = endorseAll;
endorseAllButton.className = "ml2 white-space-nowrap artdeco-pill artdeco-pill--slate artdeco-pill--3 artdeco-pill--choice artdeco-pill--selected ember-view";
endorseAllButton.style.cssText = "position:fixed;top:5px;right:10px;z-index:9999;background-color:green;width:150px;height:40px;border-radius:15px;";
document.body.appendChild(endorseAllButton);
