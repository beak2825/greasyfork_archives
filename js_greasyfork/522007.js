// ==UserScript==
// @name         IC Auto Crafter
// @namespace    http://tampermonkey.net/
// @version      1.7
// @license      MIT
// @description  Automatically craft by inputting a lineage.
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://neal.fun/infinite-craft/
// @match        https://beta.neal.fun/infinite-craft/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522007/IC%20Auto%20Crafter.user.js
// @updateURL https://update.greasyfork.org/scripts/522007/IC%20Auto%20Crafter.meta.js
// ==/UserScript==

(function() {
    "use strict";

    (window.AT ||= {}).autocrafterdata = {
        iconthing: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDQ1LjM2MyA0NS4zNjMiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0xLjc4OCwxNi45NDVjMC4zODgsMC4zODUsMC45MTMsMC42MDEsMS40NTksMC42MDFsMjcuNDkzLTAuMDM1djMuODMxYzAuMDAzLDAuODM2LDAuNTU2LDEuNTg2LDEuMzI5LDEuOTA0DQoJCQljMC43NzEsMC4zMTQsMS42NTgsMC4xMzUsMi4yNDYtMC40NTlsOS4wOTEtOS4xOGMxLjA2Mi0xLjA3MSwxLjA2LTIuODAxLTAuMDA5LTMuODY4bC05LjEzNy05LjEzNA0KCQkJYy0wLjU5LTAuNTkxLTEuNDc5LTAuNzY4LTIuMjUtMC40NDZjLTAuNzcsMC4zMTktMS4yNzEsMS4wNzQtMS4yNywxLjkwOEwzMC43NCw1LjlMMy4yMTksNS45MzcNCgkJCUMyLjA4LDUuOTQsMS4xNjEsNi44NjQsMS4xNjMsOC4wMDRsMC4wMTgsNy40ODNDMS4xODIsMTYuMDM0LDEuNDAxLDE2LjU2LDEuNzg4LDE2Ljk0NXoiLz4NCgkJPHBhdGggZD0iTTQyLjE0NiwyNy45MDFsLTI3LjUyMi0wLjAzNWwtMC4wMDEtMy44MzRjMC4wMDItMC44MzUtMC41LTEuNTg3LTEuMjctMS45MDdjLTAuNzcxLTAuMzIxLTEuNjYtMC4xNDYtMi4yNSwwLjQ0NQ0KCQkJbC05LjEzNiw5LjEzNWMtMS4wNjcsMS4wNjQtMS4wNzEsMi43OTYtMC4wMDksMy44NjZsOS4wOSw5LjE4MWMwLjU4OCwwLjU5NiwxLjQ3NSwwLjc3MiwyLjI0NywwLjQ1OA0KCQkJYzAuNzcyLTAuMzE2LDEuMzI2LTEuMDY2LDEuMzI5LTEuOTA0di0zLjgzbDI3LjQ5MywwLjAzNWMwLjU0NywwLDEuMDcyLTAuMjE2LDEuNDU5LTAuNjAyczAuNjA1LTAuOTEsMC42MDctMS40NTZMNDQuMiwyOS45Nw0KCQkJQzQ0LjIwMywyOC44Myw0My4yODQsMjcuOTAzLDQyLjE0NiwyNy45MDF6Ii8+DQoJPC9nPg0KPC9nPg0KPC9zdmc+",
        infinitecraft: null,
        autocraftButton: null,
        anticheat: true,
        saveInfo: true, // Stores how you crafted something
        isCrafting: false,
        safeMode: false,
        popupHTML: `
            <style>
                body {
                    margin: 0;
                    font-family: Arial, sans-serif;
                    background-color: #1e1e1e;
                    color: #f0f0f0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                }
                textarea {
                    width: 90%;
                    height: 100px;
                    margin-bottom: 10px;
                    background-color: #2d2d2d;
                    color: #f0f0f0;
                    border: 1px solid #555;
                    border-radius: 5px;
                    padding: 10px;
                }
                label {
                    font-size: 14px;
                }
                input[type="checkbox"] {
                    margin-right: 5px;
                }
                hr {
                    width: 90%;
                    border: none;
                    border-top: 1px solid #555;
                    margin: 15px 0;
                }
                .highlight {
                    font-weight: bold;
                    color: #ffffff; /* Plain white */
                    margin-bottom: 20px; /* Increased spacing */
                }
                button {
                    color: #ffffff; /* White text */
                    font-weight: bold;
                    text-shadow: 1px 1px 2px #000000; /* Black outline for text */
                    border: none;
                    border-radius: 5px;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px; /* Increased spacing */
                }
                button#submitButton {
                    background-color: #4caf50;
                }
                button#submitButton:hover {
                    filter: brightness(0.9);
                }
                button#autoCraftButton {
                    background-color: #d4b106;
                }
                button#autoCraftButton:hover {
                    filter: brightness(0.9);
                }
            </style>
            <textarea id="userInput" placeholder="Enter your lineage..."></textarea>
            <button id="submitButton">Craft</button>
            <button id="autoCraftButton"></button>
            <hr>
            <div class="highlight">Settings:</div>
            <label>
                <input type="checkbox" id="anticheatToggle" checked> Enable Anti-Cheat
            </label>
            <label>
                <input type="checkbox" id="safeMode"> Safe Mode (Prevent first discoveries)
            </label>
            `,
        processLineage: async function () {
            const userInput = await this.getUserInput();
            if (typeof userInput.autoCraft === "boolean"){
                console.log("Autocrafter: Auto craft started/stopped", this.isCrafting);
                this.craftSomething();
                return;
            }
            const { lineage, anticheatEnabled } = userInput;
            this.anticheat = anticheatEnabled; // Update anticheat option
            const recipes = this.parseRecipes(lineage);

            for (let i = 0; i < recipes.length; i++) {
                const [string1, string2] = recipes[i];
                // Anti cheat
                const element1Exists = this.infinitecraft.items.some(el => el.text?.toLowerCase() === string1?.toLowerCase());
                const element2Exists = this.infinitecraft.items.some(el => el.text?.toLowerCase() === string2?.toLowerCase());
                if (!this.anticheat || (element1Exists && element2Exists)) {
                    await this.infinitecraft.craft({text: string1}, {text: string2});
                    this.saveInfo && (this.infinitecraft.items.at(-1).autocraft = (
                        (element1Exists && element2Exists) ? "lineage" : "cheatlineage") // add craft info
                    );
                    this.infinitecraft.instances.pop();
                } else {
                    await this.showToast(`Skipping craft: You don"t have one of these elements: "${string1}", "${string2}"`);
                }
            }
        },
        parseRecipes: function (lineage) {
            const recipes = [];
            const lines = lineage.split("\n").map(line => line.trim());
            const isNumberedLineage = lines[0].match(/^\d+\.\s*/);

            lines.forEach(line => {
                if (!line || !line.includes(" = ")) return;

                if (isNumberedLineage) {
                    line = line.replace(/^\d+\.\s*/, ""); // Account for numbered lineages
                }

                const [ingredients, result] = line.split(" = ");
                if (!ingredients || !result) return;
                const ingredientList = ingredients.trim().split(" + ");
                if (ingredientList.length < 2) return;
                recipes.push(ingredientList.map(ingredient => ingredient.trim()));
            });

            return recipes;
        },
        craftSomething: async function () { // randomly craft 2 items
            while (this.isCrafting) {
                const first = this.infinitecraft.items.at(this.infinitecraft.items.length * Math.random()).text;
                const second = this.infinitecraft.items.at(this.infinitecraft.items.length * Math.random()).text;
                const safe = !this.safeMode || await this.isSafe(first, second); // Don't check if safe mode is off
                if (safe) {
                    await this.infinitecraft.craft({text: first}, {text: second});
                    this.saveInfo && (this.infinitecraft.items.at(-1).autocraft = "random"); // set craft info
                    this.infinitecraft.instances = [];
                    await new Promise(resolve => setTimeout(resolve, 200));
                } else {
                    console.error("Autocrafter: Skipped unsafe recipe:", {first, second, safe});
                }
            }
        },
        isSafe: async function (first, second) { // Test if recipe is new
            const start = Date.now();
            return fetch(`https://neal.fun/api/infinite-craft/check?first=${first}&second=${second}&result=Nothing`)
                .then(() => (Date.now() - start) < 200); // Return if it took shorter than 200ms
            // None existent recipes take ~200ms to verify with check endpoint
        },
        getUserInput: async function () {
            return new Promise((resolve) => {
                const screenWidth = window.screen.width;
                const screenHeight = window.screen.height;
                const popupWidth = 400;
                const popupHeight = 350;
                const left = (screenWidth - popupWidth) / 2;
                const top = (screenHeight - popupHeight) / 2;
                let popup = window.open("", "", `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`);
                popup.document.write(this.popupHTML); // Open popup
                const autoCraftButton = popup.document.getElementById("autoCraftButton");
                if (this.isCrafting) { // Set auto craft button
                    autoCraftButton.textContent = "Stop Auto Craft";
                    autoCraftButton.style.backgroundColor = "#ff0000";
                } else {
                    autoCraftButton.textContent = "Start Auto Craft";
                    autoCraftButton.style.backgroundColor = "#d4b106";
                }
                popup.document.getElementById("safeMode").checked = this.safeMode;
                // Auto craft event listener
                autoCraftButton.addEventListener("click", () => {
                    this.isCrafting = !this.isCrafting;
                    const safeMode = popup.document.getElementById("safeMode").checked
                    this.safeMode = safeMode;
                    popup.close();
                    resolve({ autoCraft: this.isCrafting, safeMode: safeMode });
                });
                // Lineage craft event listener
                popup.document.getElementById("submitButton").addEventListener("click", function () {
                    let userInput = popup.document.getElementById("userInput").value;
                    let anticheatEnabled = popup.document.getElementById("anticheatToggle").checked;
                    popup.close();
                    resolve({ lineage: userInput, anticheatEnabled: anticheatEnabled });
                });
                // Safe mode event listener
                popup.addEventListener("beforeunload", () => {
                    this.safeMode = popup.document.getElementById("safeMode").checked;
                });
            });
        },
        showToast: function(message) {
            const toast = document.createElement("div");
            toast.textContent = message;
            Object.assign(toast.style, {
                position: "fixed",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "10px 20px",
                backgroundColor: "#333",
                color: "#fff",
                borderRadius: "5px",
                fontSize: "16px",
                opacity: "0",
                transition: "opacity 0.5s ease, bottom 0.3s ease",
                marginTop: "10px"
            });
            const existingToasts = document.querySelectorAll(".toast");
            const offset = existingToasts.length * (toast.offsetHeight + 40);
            toast.style.bottom = `${30 + offset}px`;
            toast.classList.add("toast");
            document.body.appendChild(toast);
            (async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                toast.style.opacity = "1";
                await new Promise(resolve => setTimeout(resolve, 3000));
                toast.style.opacity = "0";
                await new Promise(resolve => setTimeout(resolve, 500));
                toast.remove();
                const remainingToasts = document.querySelectorAll(".toast");
                remainingToasts.forEach((t, index) => {
                    t.style.bottom = `${30 + index * (toast.offsetHeight + 40)}px`;
                });
            })();
            return new Promise(resolve => setTimeout(resolve, 50)); // 0.05 delay
        },
        addUiOption: function () {
            this.autocraftButton = document.createElement("img");
            //this.autocraftButton.innerText = "Auto crafter";
            this.autocraftButton.classList.add("tool-icon");
            this.autocraftButton.src = this.iconthing;

            this.autocraftButton.style.width = "32px";
            this.autocraftButton.style.height = "32px";


            this.autocraftButton.onclick = function () {
                window.AT.autocrafterdata.processLineage();
            };

            document.querySelector(".side-controls").appendChild(this.autocraftButton);
            return true;
        },
        updateInstance: function (instance) {
            const element = this.infinitecraft.items.find(
                (element) =>
                element.text.toLowerCase() === instance.text.toLowerCase()
            );
            element.autocraft &&
            instance.elem.setAttribute("autocraft", element.autocraft);
        },
        start: function () {
            if (document.querySelector(".container")?.__vue__) { // Wait for IC
                console.log("IC Auto crafter launched");
                this.infinitecraft = document.querySelector(".container").__vue__;
                this.addUiOption();
                const setInstanceZIndex = this.infinitecraft.setInstanceZIndex;
                this.infinitecraft.setInstanceZIndex = ((instance, instanceID) => {
                    setTimeout(() => {
                        this.updateInstance(instance);
                    }, 0);
                    return setInstanceZIndex(instance, instanceID);
                });
            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };
    window.AT.autocrafterdata.start();

})();