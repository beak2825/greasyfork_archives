// ==UserScript==
// @name         GGn Inventory Safe Mode
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Add toggles to remove trash icons and use buttons in inventory.
// @author       Animaker
// @match        https://gazellegames.net/user.php*
// @icon         https://icons.duckduckgo.com/ip3/gazellegames.net.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526626/GGn%20Inventory%20Safe%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/526626/GGn%20Inventory%20Safe%20Mode.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Utility to save and load toggle states from localStorage
    const saveToggleState = (key, state) => localStorage.setItem(key, state ? "true" : "false");
    const loadToggleState = (key) => localStorage.getItem(key) === "true";

    // Select the container where the toggles will be added
    const centerDiv = document.querySelector("div.center");
    if (!centerDiv) return;

    // Create a toggle switch
    function createToggle(labelText, toggleKey, callback) {
        const container = document.createElement("div");
        container.style.marginBottom = "10px";

        const label = document.createElement("label");
        label.style.display = "flex";
        label.style.alignItems = "center";
        label.style.color = "#fff";
        label.style.fontSize = "14px";

        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.checked = loadToggleState(toggleKey);
        toggle.style.marginRight = "8px";
        toggle.addEventListener("change", () => {
            const isChecked = toggle.checked;
            saveToggleState(toggleKey, isChecked);
            callback(isChecked);
        });

        label.appendChild(toggle);
        label.appendChild(document.createTextNode(labelText));
        container.appendChild(label);

        return container;
    }

    // Toggle for trash icons
    const trashToggle = createToggle("Hide Trash Icons", "hideTrashIcons", (isChecked) => {
        const trashIcons = document.querySelectorAll("img.trash_icon");
        trashIcons.forEach((icon) => {
            if (icon.getAttribute("onclick")?.startsWith("Trash(")) {
                icon.style.display = isChecked ? "none" : "";
            }
        });
    });

    // Toggle for "Use" buttons
    const useToggle = createToggle("Hide 'Use' Buttons", "hideUseButtons", (isChecked) => {
        const useButtons = document.querySelectorAll('input[type="submit"].use_btn.submit');
        useButtons.forEach((button) => {
            button.style.display = isChecked ? "none" : "";
        });
    });

    // Toggle for "Unpack/Open" buttons
    const unpackToggle = createToggle("Hide 'Open/Unpack' Buttons", "hideUnpackButtons", (isChecked) => {
        const useButtons = document.querySelectorAll('input[type="submit"].unpack_btn.submit');
        useButtons.forEach((button) => {
            button.style.display = isChecked ? "none" : "";
        });
    });

    // Add toggles to the center div
    centerDiv.appendChild(trashToggle);
    centerDiv.appendChild(useToggle);
    centerDiv.appendChild(unpackToggle);

    // Apply the initial states of the toggles (It's what guarantees the loaded state from cache is applied)
    trashToggle.querySelector("input").dispatchEvent(new Event("change"));
    useToggle.querySelector("input").dispatchEvent(new Event("change"));
    unpackToggle.querySelector("input").dispatchEvent(new Event("change"));
})();
