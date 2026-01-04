// ==UserScript==
// @name         Backpack.tf Button
// @version      v1
// @description  Adds a button to view items on backpack.tf
// @author       LilLovebird
// @match        https://loadout.tf/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=loadout.tf
// @namespace https://greasyfork.org/users/1468615
// @downloadURL https://update.greasyfork.org/scripts/535680/Backpacktf%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/535680/Backpacktf%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Element.prototype._attachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function () {
        return this._attachShadow( { mode: "open" } );
    };

    setTimeout(function() {
        setInterval(function () {
            document.querySelectorAll("div")[1].shadowRoot.querySelector("div").shadowRoot.querySelector("div").shadowRoot.querySelectorAll("div.item-manager-item-detail").forEach((element) => {
                if (!element.innerHTML.includes("backpack.tf")) {
                    let button = document.createElement("a");
                    button.className = "item-manager-item-detail-backpack-link capitalize";
                    button.href = "https://next.backpack.tf/stats?item=" + element.querySelector("div.item-manager-item-detail-title").textContent;
                    button.target = "_blank";
                    button.textContent = "Backpack.tf";
                    element.insertBefore(button, element.lastElementChild);
                }
            });
        }, 0);
    }, 1000);
})();