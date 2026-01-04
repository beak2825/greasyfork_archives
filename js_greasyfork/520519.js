// ==UserScript==
// @name         Custom Select and Keyboard Control
// @namespace    https://www.dofuspourlesnoobs.com/
// @version      1.4.1
// @description  Transforms a <select> into a custom searchable dropdown, adds keyboard controls, and auto-submits.
// @author       You
// @match        https://www.dofuspourlesnoobs.com/resolution-de-chasse-aux-tresors.html
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520519/Custom%20Select%20and%20Keyboard%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/520519/Custom%20Select%20and%20Keyboard%20Control.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let searchInputG;

    let customSelectId = 'custom-select';

    function clickArrow(direction) {
        const arrowInput = document.querySelector(`input[id="hunt${direction}"]`);
        if (arrowInput) {
            arrowInput.checked = true;
            arrowInput.dispatchEvent(new Event("change"));
            console.log(`Flèche ${direction} activée`);

            if (searchInputG) {
                searchInputG.focus();
            }
        } else {
            console.warn(`Aucune flèche trouvée pour la direction "${direction}"`);
        }
    }

    function clickSubmitButton() {
        const submitButton = document.querySelector("#hunt-elt3");
        if (submitButton) {
            submitButton.click();
            console.log("Bouton 'Trouver la position de l'indice' cliqué.");
        } else {
            console.warn("Le bouton 'hunt-elt3' n'a pas été trouvé.");
        }
    }

    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "ArrowUp":
                clickArrow("upwards");
                break;
            case "ArrowLeft":
                clickArrow("left");
                break;
            case "ArrowRight":
                clickArrow("right");
                break;
            case "ArrowDown":
                clickArrow("downwards");
                break;
            default:
                break;
        }
    });

    function normalizeString(str) {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    function transformSelect(selectElement) {
        selectElement.style.display = "none";

        const customSelectContainer = document.createElement("div");
        customSelectContainer.classList.add("custom-select-container");
        customSelectContainer.id = customSelectId;
        customSelectContainer.style.position = "relative";
        customSelectContainer.style.width = "300px";

        const searchInput = document.createElement("input");
        searchInput.type = "text";
        searchInput.placeholder = "Rechercher...";
        searchInput.style.width = "100%";
        searchInput.style.padding = "10px";
        searchInput.style.boxSizing = "border-box";
        searchInput.style.border = "1px solid #BB86FC";
        searchInput.style.borderRadius = "4px";
        searchInput.style.marginBottom = "5px";
        customSelectContainer.appendChild(searchInput);

        const optionsContainer = document.createElement("div");
        optionsContainer.classList.add("custom-options");
        optionsContainer.style.position = "absolute";
        optionsContainer.style.top = "100%";
        optionsContainer.style.left = "0";
        optionsContainer.style.width = "100%";
        optionsContainer.style.maxHeight = "200px";
        optionsContainer.style.overflowY = "auto";
        optionsContainer.style.backgroundColor = "#1E1E1E";
        optionsContainer.style.border = "1px solid #BB86FC";
        optionsContainer.style.borderRadius = "4px";
        optionsContainer.style.zIndex = "1000";
        optionsContainer.style.display = "none";
        customSelectContainer.appendChild(optionsContainer);

        const optionsList = Array.from(selectElement.options).map((option, index) => {
            const optionDiv = document.createElement("div");
            optionDiv.classList.add("custom-option");
            optionDiv.style.padding = "10px";
            optionDiv.style.cursor = "pointer";
            optionDiv.style.color = "white";
            optionDiv.style.backgroundColor = index % 2 === 0 ? "#2C2C2C" : "#1E1E1E";
            optionDiv.textContent = option.textContent;
            optionDiv.dataset.value = option.value;

            optionDiv.addEventListener("click", (e) => {
                selectOption(optionDiv, e);
            });

            optionsContainer.appendChild(optionDiv);
            return optionDiv;
        });

        function selectOption(optionDiv, event) {
            searchInput.value = "";
            searchInput.placeholder = "Rechercher...";
            selectElement.value = optionDiv.dataset.value;
            console.log(`Option sélectionnée : ${optionDiv.textContent} (${optionDiv.dataset.value})`);
            optionsContainer.style.display = "none";
            if (event.type === 'click') {
                clickSubmitButton();
            }
        }

        searchInput.addEventListener("input", () => {
            const filter = normalizeString(searchInput.value);
            let firstVisibleOption = null;

            optionsList.forEach((optionDiv) => {
                const text = normalizeString(optionDiv.textContent);
                const isVisible = text.startsWith(filter);
                optionDiv.style.display = isVisible ? "block" : "none";

                if (isVisible && !firstVisibleOption) {
                    firstVisibleOption = optionDiv;
                }
            });

            optionsContainer.style.display = firstVisibleOption ? "block" : "none";
        });

        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const firstVisibleOption = optionsList.find(
                    (optionDiv) => optionDiv.style.display === "block"
                );

                if (firstVisibleOption) {
                    selectOption(firstVisibleOption, e);
                } else {
                    console.log("Aucune option visible à sélectionner.");
                }
            }
        });

        selectElement.parentNode.insertBefore(customSelectContainer, selectElement.nextSibling);
        searchInputG = searchInput;

        const customSelectElementParent = document.querySelector(`#${customSelectId}`).parentNode;
        Object.assign(customSelectElementParent.style, {
            'display': 'flex',
            'justify-align': 'center',
            'align-items': 'center',
            'height': '100%',
            'justify-content': 'center'
        });
    }

    const selectElement = document.querySelector("#clue-choice-select");
    if (selectElement) {
        transformSelect(selectElement);
    } else {
        console.error("Aucun <select> avec l'ID #clue-choice-select trouvé !");
    }

    const huntAutoCopyElement = document.querySelector('#huntautocopy');
    huntAutoCopyElement.checked = true;
})();
