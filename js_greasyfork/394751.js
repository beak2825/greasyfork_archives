// ==UserScript==
// @name         FurAffinity - Remove Selected at top
// @description  Copies the button to remove selected submission notifications to the top of the page.
// @namespace    Shaun Dreclin
// @version      1.0
// @match        *://*.furaffinity.net/msg/submissions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394751/FurAffinity%20-%20Remove%20Selected%20at%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/394751/FurAffinity%20-%20Remove%20Selected%20at%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let bottomRemove = document.querySelector("button.remove-checked");
    let topRemove = bottomRemove.cloneNode(true);

    let topContainer = document.createElement("div")
    document.querySelector("#standardpage > section:nth-of-type(1) > div.section-body > div.aligncenter").appendChild(topContainer);
    topContainer.style.marginTop = "50px";
    topContainer.appendChild(topRemove);
})();
