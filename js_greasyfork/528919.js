// ==UserScript==
// @name         Terraria Wiki Class Setup Guide Filter
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  You are able to hide all the classes you dont want to see in terraria wiki class setups
// @author       gabrielsfh
// @match        https://terraria.wiki.gg/wiki/Guide:Class_setups
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528919/Terraria%20Wiki%20Class%20Setup%20Guide%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/528919/Terraria%20Wiki%20Class%20Setup%20Guide%20Filter.meta.js
// ==/UserScript==

(function () {
    const progression = [
        "Pre-Bosses", "Pre-Skeletron", "Pre-Wall_of_Flesh",
        "Pre-Mechanical_Bosses", "Pre-Plantera", "Pre-Golem",
        "Pre-Lunatic_Cultist", "Pre-Moon_Lord", "Endgame"
    ];

    const classNames = ["Melee", "Ranged", "Magic", "Summoning", "Mixed"];
    const twoParagraphStages = ["Pre-Mechanical_Bosses", "Pre-Plantera", "Pre-Golem"];

    // Toggles the visibility of a specific class
    function toggleDivs(event) {
        let checkboxes = document.querySelectorAll(".class-toggle");
        let divs = Array.from(document.querySelectorAll(".infocard.clearfix.guide-class-setups")).slice(0, 45); // Limit to first 45 infocards

        // Sync all checkboxes
        const changedCheckbox = event.target;
        const classIndex = Array.from(changedCheckbox.parentNode.parentNode.children).indexOf(changedCheckbox.parentNode);

        checkboxes.forEach(cb => {
            if (Array.from(cb.parentNode.parentNode.children).indexOf(cb.parentNode) === classIndex) {
                cb.checked = changedCheckbox.checked;
            }
        });

        // Prevents the only toggled checkbox to be disabled when it's clicked at it
        let checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        if (checkedCount === 0) {
            changedCheckbox.checked = true;
            checkboxes.forEach(cb => {
                if (Array.from(cb.parentNode.parentNode.children).indexOf(cb.parentNode) === classIndex) {
                    cb.checked = true;
                }
            });
            return;
        }

        // Toggle visibility for each class
        checkboxes.forEach((checkbox, index) => {
            if (divs[index]) {
                let position = index;
                // Loops to show/hide a specific class
                for (let i = 0; i < 9; i++) {
                    if (divs[position]) {
                        divs[position].style.display = checkbox.checked ? "" : "none";
                    }
                    position += 5;
                }
            }
        });

        saveCheckboxState();
    }

    // Toggle all checkboxes when button is clicked
    function toggleAll(state) {
        document.querySelectorAll(".class-toggle").forEach(checkbox => {
            checkbox.checked = state;
        });
        toggleDivs({ target: document.querySelector(".class-toggle") });
    }

    // Saves the order of the toggled checkboxes to localStorage
    function saveCheckboxState() {
        let checkboxStates = {};
        classNames.forEach((name, index) => {
            checkboxStates[name] = document.querySelector(`.class-toggle[data-class="${name}"]`).checked;
        });
        localStorage.setItem("checkboxStates", JSON.stringify(checkboxStates));
    }

    // Load saved checkbox states from localStorage
    function loadCheckboxState() {
        let savedStates = localStorage.getItem("checkboxStates");
        if (savedStates) {
            savedStates = JSON.parse(savedStates);
            classNames.forEach(name => {
                let checkbox = document.querySelector(`.class-toggle[data-class="${name}"]`);
                if (checkbox && savedStates[name] !== undefined) {
                    checkbox.checked = savedStates[name];
                }
            });
            toggleDivs({ target: document.querySelector(".class-toggle") });
        }
    }

    // Add checkboxes to each progression stage
    function addCheckboxes() {
        progression.forEach(stage => {
            let headline = document.querySelector(`h2 span#${stage}`);
            if (!headline) return;

            let paragraph = headline.closest("h2").nextElementSibling;
            while (paragraph && paragraph.tagName !== "P") {
                paragraph = paragraph.nextElementSibling;
            }
            if (!paragraph) return;

            // If stage have two paragraphs, moves the position to be after the second <p>
            if (twoParagraphStages.includes(stage)) {
                let nextParagraph = paragraph.nextElementSibling;
                while (nextParagraph && nextParagraph.tagName !== "P") {
                    nextParagraph = nextParagraph.nextElementSibling;
                }
                if (nextParagraph && nextParagraph.tagName === "P") {
                    paragraph = nextParagraph;
                }
            }

            // Check if checkboxes already exist for this stage
            if (paragraph.nextElementSibling && paragraph.nextElementSibling.className === "container") return;

            let container = document.createElement("div");
            let checkboxes = document.createElement("div");

            container.className = "container";
            checkboxes.className = "checkboxes";

            classNames.forEach((name) => {
                let label = document.createElement("label");
                label.className = "label";

                let checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.className = "class-toggle";
                checkbox.dataset.class = name;
                checkbox.checked = true;
                checkbox.addEventListener("change", toggleDivs);

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(`${name}`));
                checkboxes.appendChild(label);
            });

            // Add "Enable All" button
            let enableAll = document.createElement("button");
            let buttonContainer = document.createElement("div");

            enableAll.innerText = "Enable All";
            enableAll.addEventListener("click", () => toggleAll(true));
            enableAll.classList.add("enableAll");
            buttonContainer.classList.add("buttonContainer");

            container.appendChild(checkboxes);
            buttonContainer.appendChild(enableAll);
            container.appendChild(buttonContainer);

            paragraph.parentNode.insertBefore(container, paragraph.nextSibling);
        });

        // Load saved state after all checkboxes are added
        loadCheckboxState();
    }

    // All the CSS
    GM_addStyle(`
        .container {
            display: flex;
            padding-bottom: 10px;
            padding-top: 10px;
        }

        .enableAll {
            border: 2px solid #eae3d1;
            text-decoration: none;
            color: #eae3d1;
            background-color: #5a433a;
            transition: all 0.3s ease;
            padding: 5px 10px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
            cursor: pointer;
        }

        .enableAll:hover {
            background-color: #6b4f44;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
        }

        .enableAll:active {
            background-color: #8b6e5f;
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
        }

        .class-toggle {
            margin-right: 5px;
            accent-color: #9FECF0;
            background-color: #5e3333;
        }

        .label {
            margin-right: 10px;
        }

        .div {
            margin-bottom: 1px;
        }

        @media (max-width: 492px) {
            .container {
                flex-direction: column;
            }

            .checkboxes {
                margin: 0 auto;
                width: fit-content;
            }

            .buttonContainer {
                margin: 0 auto;
                width: fit-content;
            }

            .enableAll {
                padding: 5px 150px;
            }
        }

        @media (max-width: 400px) {
            .container {
                flex-direction: row;
            }

            .buttonContainer {
                margin: auto;
            }

            .checkboxes {
                display: flex;
                flex-direction: column;
            }

            .enableAll {
                padding: 5px 10px;
            }
        }
    `);

    window.addEventListener("load", addCheckboxes);
})();