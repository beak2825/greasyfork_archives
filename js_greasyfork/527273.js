// ==UserScript==
// @name         Jerkmate Ranked Tool
// @namespace    https://spin.rip/
// @version      2025-02-17
// @description  Adds an autoclicker and autobuyer to Jerkmate Ranked
// @author       Spinfal
// @match        https://jerkmate.com/jerkmate-ranked
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jerkmate.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527273/Jerkmate%20Ranked%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/527273/Jerkmate%20Ranked%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // define window values
    console.log("[JMTOOL]", "init window values");
    window.autoClicker = false;
    window.clickers = [];
    window.warningShown = false;
    window.autoBuyer = [false, null];

    function handleAutoClickers(action) {
        switch (action) {
            case "add":
                window.clickers.push(setInterval(() => document.querySelector("#slot1 > div > div.css-v8rsuo-idle-game-GameStyled.ejlf63y0 > div.css-jg52x1-idle-game-VideoPlayerStyled.ed98v8d0 > video").click(), 1));
                document.getElementById("amnt").innerText = window.clickers.length;
                break;
            case "clear":
                window.clickers.forEach(i => clearInterval(i));
                window.clickers = [];
                document.getElementById("amnt").innerText = window.clickers.length;
                break;
            default:
                throw new Error("no action provided to function handleAutoClickers.");
        }
    }

    // get static elements
    const underGameDiv = document.querySelector("#slot1 > div > div.css-v8rsuo-idle-game-GameStyled.ejlf63y0 > div.css-1ngur3s-idle-game-HideMobile.eb0q10s1");
    console.log("[JMTOOL]", "found and set underGameDiv");

    // create JMTOOL elements
    const buttonDiv = document.createElement("div");
    buttonDiv.style = "margin: 10px 0 0 0;";
    console.log("[JMTOOL]", "created tool container");

    const addAutoClicker = document.createElement("button"); // action: add autoclicker
    addAutoClicker.innerText = "add autoclicker";
    addAutoClicker.classList.add("buttonBuy");
    addAutoClicker.style = "width: 200px; margin: 0 5px 0 0;";
    console.log("[JMTOOL]", "created autoclicker add button");

    const removeAutoClickers = document.createElement("button"); // action: clear all autoclickers at once
    removeAutoClickers.innerText = "remove all autoclickers";
    removeAutoClickers.classList.add("buttonBuy");
    removeAutoClickers.style = "width: 200px;";
    console.log("[JMTOOL]", "created autoclicker clear button");

    const autoBuy = document.createElement("button"); // action: toggles the autobuyer for the upgrades
    autoBuy.innerText = "enable autobuy";
    autoBuy.classList.add("css-4ysqdv-idle-game-ChipStyled");
    autoBuy.style = "width: 200px;";
    console.log("[JMTOOL]", "created autobuy button");

    const autoBuySpeed = document.createElement("input"); // action: lets the user change the autobuyer speed
    autoBuySpeed.placeholder = "time in SECONDS";
    autoBuySpeed.style = "background-color: lightgray; border: 1px solid black;";
    autoBuySpeed.type = "number";
    autoBuySpeed.value = 1500;
    autoBuySpeed.min = 500;
    console.log("[JMTOOL]", "created autobuy speed input");

    const autoClickerCount = document.createElement("p"); // action: shows how many autoclickers are running
    autoClickerCount.innerHTML = `you have <b id="amnt">${window.clickers.length}</b> ${window.clickers.length === 1 ? "autoclicker" : "autoclickers"} running`;
    console.log("[JMTOOL]", "created autoclicker counter");

    console.log("[JMTOOL]", "appending elements to container...");
    buttonDiv.append(addAutoClicker);
    buttonDiv.append(removeAutoClickers);
    buttonDiv.append(autoBuy);
    buttonDiv.append(autoBuySpeed);
    buttonDiv.append(autoClickerCount);
    console.log("[JMTOOL]", "appended elements!");

    window.onload = (() => {
        console.log("[JMTOOL]", "adding container to website...");
        underGameDiv.insertBefore(buttonDiv, underGameDiv.firstChild);
        console.log("[JMTOOL]", "added container to website!");

        // setup click listeners for JMTOOL elements
        addAutoClicker.addEventListener("click", () => {
            if (!window.warningShown && window.clickers.length >= 10) {
                alert(`past this point, you'll see diminishing returns. website performance may drop with little to no gains. (${window.clickers.length})`);
                window.warningShown = true;
                console.log("[JMTOOL]", "warning shown and has been disabled");
            }
            handleAutoClickers("add");
            console.log("[JMTOOL]", "attempted to add autoclicker");
        });
        console.log("[JMTOOL]", "'add autoclicker' button listener created");

        removeAutoClickers.addEventListener("click", () => {
            handleAutoClickers("clear");
            console.log("[JMTOOL]", "attempted to clear autoclickers");
        });
        console.log("[JMTOOL]", "'clear autoclickers' button listener created");

        autoBuy.addEventListener("click", () => {
            if (!window.autoBuyer[0]) { // if autobuyer is disabled (false)
                window.autoBuyer[0] = true;
                console.log("[JMTOOL]", "set and enabled autobuyer");
                autoBuy.innerText = "disable autobuy";

                window.buyBtnCollection = document.getElementsByClassName("buttonBuy");
                window.autoBuyer[1] = setInterval(() => {
                    console.group(`JMTOOL AUTOBUYER - ${Date.now()}`);
                    for (let i = 0; i < window.buyBtnCollection.length; i++) {
                        if (window.buyBtnCollection[i].innerText.toLowerCase() === "buy") {
                            const oldPrice = window.buyBtnCollection[i].parentNode.getElementsByClassName("price")[0].innerText;
                            window.buyBtnCollection[i].click();
                            const newPrice = window.buyBtnCollection[i].parentNode.getElementsByClassName("price")[0].innerText;
                            console.log(
                                "[JMTOOL] %c%s %s",
                                oldPrice === newPrice ? "color: red; font-weight: bold;" : "color: green; font-weight: bold;",
                                oldPrice === newPrice ? "failed to purchase:" : "successfully purchased:",
                                window.buyBtnCollection[i].parentNode.firstChild.innerText
                            );
                        }
                    }
                    console.groupEnd();
                }, autoBuySpeed.value < 500 ? 500 : autoBuySpeed.value); // due to the amount of things that autobuyer does, this is a failsafe to prevent serious performance issues
            } else if (window.autoBuyer[0]) { // if autobuyer is enabled (true)
                clearInterval(window.autoBuyer[1]);
                window.autoBuyer = [false, null];
                console.log("[JMTOOL]", "cleared and disabled autobuyer");
                autoBuy.innerText = "enable autobuy";
            }
        });
        console.log("[JMTOOL]", "'toggle autobuy' button listener created");

        autoBuySpeed.addEventListener("input", () => {
            if (window.autoBuyer[0]) {
                autoBuy.click();
                autoBuy.click(); // ezpz lemon squeezy
            }
        });
    });
})();