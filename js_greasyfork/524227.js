// ==UserScript==
// @name         IB Lineage Verifyer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Adds option to verify lineages in IB
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://infinibrowser.wiki/item/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524227/IB%20Lineage%20Verifyer.user.js
// @updateURL https://update.greasyfork.org/scripts/524227/IB%20Lineage%20Verifyer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (window.AT ||= {}).lineagefverify = {
        lineage: null,
        getLineage: async function() {
            const itemID = location.href.split("item/")[1];
            const custom = document.getElementById("item_footer")?.textContent == "This is an unverified user-submitted element";
            const baseURL = (custom ? "https://infinibrowser.wiki/api/recipe/custom?id=" : "https://infinibrowser.wiki/api/recipe?id=");
            const response = await fetch(baseURL + itemID);
            this.lineage = (await response.json()).steps;
        },
        createElements: async function() { // Create the button and popup
            document.querySelector("h3").insertAdjacentHTML
            ('afterend',
             '<div style="margin-top:1rem"><button id="verify-recipe" class="btn">Verify Recipe</button></div>'
            );
            this.verifyButton = document.getElementById("verify-recipe");

            // Import required CSS
            document.head.appendChild(Object.assign(document.createElement("style"), {
                textContent: await (await fetch(
                    "https://infinibrowser.wiki/static/bundle/search.css"
                )).text()
            }));

            // Make Popup
            document.querySelector("main").insertAdjacentHTML(
                "beforeend",
                `<div id="modal_wrapper" class="modal_wrapper" style="display: none;">
                        <div class="modal" id="modal">
                            <div class="top">
                                <h1>${document.querySelector("h1").innerHTML}</h1>
                                <button id="close" name="Close" class="close_modal" onclick="document.getElementById('modal_wrapper').style.display = 'none';">
                                    <img src="/static/icon/button/close.svg" alt="Close" draggable="false" class="close_modal">
                                </button>
                            </div>
                            <div id="a_item_footer"></div>
                        </div>
                 </div>`
            );
            this.boxInput = document.getElementById("a_item_footer");
        },
        openPopUp: function () {
            document.querySelector(".modal_wrapper").style = "";
        },
        getUncrafted: async function() {
            const uncrafted = new Set();
            this.lineage.forEach((step, i) => {
                const partLineage = this.lineage.slice(0, i); // Slice lineage to avoid circular recipes
                // Verify if ingredients have been crafted
                const ingredientAValid = !partLineage.every(partStep => !(
                    step.a.id.toLowerCase() === partStep.result.id.toLowerCase()
                ));
                const ingredientBValid = !partLineage.every(partStep => !(
                    step.b.id.toLowerCase() === partStep.result.id.toLowerCase()
                ));

                if (!ingredientAValid) uncrafted.add(step.a.id);
                if (!ingredientBValid) uncrafted.add(step.b.id);
            });
            return [...uncrafted];
        },
        check: async function (first, second, result, mainneal=false) {
            // Either proxy or neals server
            const baseURL = (mainneal ? "https://neal.fun/api/infinite-craft/pair?ref=app&" : "https://infiniteback.active-tutorial-video.workers.dev/?");
            const response = await fetch(`${baseURL}first=${encodeURIComponent(first)}&second=${encodeURIComponent(second)}`);
            const data = await response?.json()
            return data?.result?.toLowerCase() === result?.toLowerCase(); // Return if its true
        },
        verifyLineage: async function() {
            let uncrafted = await this.getUncrafted();
            const incorrectCrafts = [];
            const allowedUncrafted = ["Water", "Fire", "Earth", "Wind"]; // Allowed missing items
            uncrafted = uncrafted.filter(item => !allowedUncrafted.includes(item)); // Subtract allowed items
            console.log(uncrafted);
            this.boxInput.innerHTML = "";
            this.openPopUp();
            this.boxInput.innerHTML += "Uncrafted items: <br>" + JSON.stringify(uncrafted);
            this.lineage.forEach(async step => {
                await this.check(step.a.id, step.b.id, step.result.id, false) ||
                    await this.check(step.a.id, step.b.id, step.result.id, true) ||
                    incorrectCrafts.push(step); // If false both times, craft is incorrect
            });
            console.log(incorrectCrafts);
            this.boxInput.innerHTML += "<br>Incorrect lineage steps: <br>" + JSON.stringify(incorrectCrafts).replace(/,/g, '<br>');

            if (!(incorrectCrafts.length || uncrafted.length)) {
                this.boxInput.innerHTML += "<br>Lineage fully valid!";
            } else {
                this.boxInput.innerHTML += "<br>Lineage invalid!";
            }
        },
        start: function () {
            if (document.querySelector('.step')) { // Wait for IB to load
                this.createElements();
                // Button event listener
                this.verifyButton.addEventListener("click", this.verifyLineage.bind(this));
                // Get current lineage
                this.getLineage();

            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };

    window.AT.lineagefverify.start();
})();