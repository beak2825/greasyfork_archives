// ==UserScript==
// @name         Humble Bundle Keys Backup
// @namespace    Lex@GreasyFork
// @version      0.2.0
// @description  Displays a text area with game titles and keys so you can copy them out easily.
// @author       Lex
// @match        https://www.humblebundle.com/downloads*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404455/Humble%20Bundle%20Keys%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/404455/Humble%20Bundle%20Keys%20Backup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatGames(games, bundleTitle) {
        // Format the output as tab-separated
        if (bundleTitle) {
            games = games.map(e => (bundleTitle + "\t" + e.title+"\t"+e.key).trim());
        } else{
            games = games.map(e => (e.title+"\t"+e.key).trim());
        }
        return games.join("\n");
    }

    function createNotify() {
        const notify = document.createElement("div");
        notify.className = "ktt-notify";
        return notify;
    }

    function updateNotify(bundle, message) {
        const notify = bundle.querySelector(".ktt-notify");
        notify.innerHTML = message;
    }

    function createConfig(updateCallback) {
        const createCheckbox = (labelText, className, defaultChecked) => {
            const label = document.createElement("label");
            label.style.marginRight = "10px";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = className;
            checkbox.checked = defaultChecked;
            checkbox.addEventListener("change", updateCallback);

            label.append(` ${labelText} `, checkbox,);
            return label;
        };

        const container = document.createElement("div");
        container.append(
            createCheckbox("Include Bundle Title", "includeTitle", false),
            createCheckbox("Include Unrevealed", "includeUnrevealed", true)
        );
        container.className = "ktt-config-container"
        return container;
    }

    function createArea() {
        const area = document.createElement("textarea");
        area.className = "key-text-area";
        area.style.width = "100%";
        area.setAttribute('readonly', true);
        return area;
    }

    // Updates an area if it needs updating, adjusting the height to fit the contents
    function updateArea(bundle, updateStr) {
        const area = bundle.querySelector(".key-text-area")
        if (area.value != updateStr) {
            area.value = updateStr;
            // Adjust the height so all the contents are visible
            area.style.height = "";
            area.style.height = area.scrollHeight + 20 + "px";
        }
    }

    function createCopyButton(area) {
        const button = document.createElement("button");
        button.textContent = "Copy to Clipboard";
        button.style.cssText = "display: block; margin: 5px 0; padding: 5px 10px; cursor: pointer;";
        button.addEventListener("click", async () => {
            await navigator.clipboard.writeText(area.value);
            button.textContent = "Copied!";
            setTimeout(() => (button.textContent = "Copy to Clipboard"), 1500);
        });
        return button;
    }

    // Returns array of the games in the target bundle
    function getGames(bundle) {
        let games = [];
        bundle.querySelectorAll(".key-redeemer").forEach(div => {
            let game = {};
            game.title = div.querySelector(".heading-text h4").innerText;
            const keyfield = div.querySelector(".keyfield");
            if (!keyfield) return;
            game.key = keyfield.title;
            if (game.key.startsWith("Reveal your ")) {
                game.key = "";
                game.revealed = false;
            } else {
                game.revealed = true;
            }
            game.isGift = keyfield.classList.contains("redeemed-gift");
            game.isKey = keyfield.classList.contains("redeemed");
            games.push(game);
        });
        return games;
    }

    function refreshOutput(bundle) {
        const gameCount = document.querySelectorAll(".keyfield").length;
        const revealedCount = document.querySelectorAll(".redeemed,.redeemed-gift").length;

        const color = gameCount == revealedCount ? "" : "tomato";
        let notifyHtml = `Found ${gameCount} keyfields. <span style="background:${color}">${revealedCount} are revealed.</span>`;
        if (gameCount != revealedCount) {
            notifyHtml += " Are some keys not revealed?";
        }

        if (!bundle.querySelector(".ktt-config-container")) {
            const updateCallback = () => refreshOutput(bundle);
            const textArea = createArea();
            bundle.append(createNotify(), createConfig(updateCallback), textArea, createCopyButton(textArea))
        }

        updateNotify(bundle, notifyHtml)

        let games = getGames(bundle);
        const includeTitle = bundle.querySelector(".includeTitle").checked;
        const bundleTitle = includeTitle ? $('h1#hibtext')[0].childNodes[2].textContent.trim() : null;
        const includeUnrevealed = bundle.querySelector(".includeUnrevealed").checked;
        if (!includeUnrevealed) games = games.filter(e => e.key);
        const outputText = formatGames(games, bundleTitle);
        updateArea(bundle, outputText);
    }

    function handlePage() {
        document.querySelectorAll(".key-container.wrapper").forEach(refreshOutput);
    }

    function waitForLoad(query, callback) {
        if (document.querySelector(query)) {
            callback();
        } else {
            setTimeout(waitForLoad.bind(null, query, callback), 100);
        }
    }

    waitForLoad(".key-redeemer", handlePage);
})();