// ==UserScript==
// @name         Fanatical Keys Backup
// @namespace    Lex@GreasyFork
// @version      0.3.0
// @description  Displays a text area with game titles and keys so you can copy them out easily.
// @author       Lex
// @match        https://www.fanatical.com/en/orders*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403369/Fanatical%20Keys%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/403369/Fanatical%20Keys%20Backup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Formats games array to a string to be displayed
    // Games is an array [ [title, key], ... ]
    function formatGames(games, includeUnrevealed, bundleTitle) {
        if (!includeUnrevealed)
            games = games.filter(e => e.gameKey);
        // Format the output as tab-separated
        if (bundleTitle) {
            games = games.map(e => bundleTitle + "\t" + e.gameTitle + "\t" + e.gameKey);
        } else {
            games = games.map(e => e.gameTitle + "\t" + e.gameKey);
        }
        return games.join("\n");
    }

    function revealAllKeys(articles) {
        articles.filter(a => !a.gameKey).forEach(a => {
          a.element.querySelector(".key-container button").click();
        });
    }

    function createRevealButton(bundle) {
        const btn = document.createElement("button");
        btn.type = "button"; // no default behavior
        btn.innerText = "Reveal this bundle's keys";
        btn.addEventListener("click", () => {
            revealAllKeys(bundle.articles);
            btn.style.display = "none";
        })
        return btn;
    }

    function createCopyButton(area) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "Copy to Clipboard";
        btn.style.cssText = "display: block; margin: 5px 0; padding: 5px 10px; cursor: pointer;";
        btn.addEventListener("click", async () => {
            await navigator.clipboard.writeText(area.value);
            btn.textContent = "Copied!";
            setTimeout(() => (btn.textContent = "Copy to Clipboard"), 1500);
        });
        return btn;
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
            createCheckbox("Include Unrevealed", "includeUnrevealed", false)
        );
        container.className = "ktt-config-container"
        return container;
    }

    // Adds a textarea to the bottom of the games listing with all the titles and keys
    function handleBundle(bundle) {
        const games = bundle.articles;
        const keyCount = games.filter(e => e.gameKey).length;

        const lastArticleElement = bundle.articles[bundle.articles.length - 1].element;
        let div = lastArticleElement.nextElementSibling;
        if (!div || div.className !== "ktt-output-container") {
            div = document.createElement("div")
            div.className = "ktt-output-container"
            div.style.width = "100%";
            lastArticleElement.insertAdjacentElement('afterend', div);

            if (games.length != keyCount) {
                div.append(createRevealButton(bundle));
            }

            const notify = document.createElement("div");
            notify.className = "ktt-notify";

            const configCallback = () => { refreshOutput(); };

            const area = document.createElement("textarea");
            area.className = "ktt-area";
            area.style.width = "100%";
            area.setAttribute('readonly', true);
            div.append(notify, createConfig(configCallback), area, createCopyButton(area));
        }

        const color = games.length === keyCount ? "" : "tomato";
        let newInner = `Dumping keys for ${bundle.name}: Found ${games.length} items and <span style="background-color:${color}">${keyCount} keys</span>.`;
        if (games.length != keyCount) {
            newInner += " Are some keys not revealed?";
        }
        const notify = div.querySelector(".ktt-notify");
        if (notify.innerHTML != newInner) {
            notify.innerHTML = newInner;
        }

        const area = div.querySelector(".ktt-area");
        const includeTitle = div.querySelector(".includeTitle").checked;
        const includeUnrevealed = div.querySelector(".includeUnrevealed").checked;
        const gameStr = formatGames(games, includeUnrevealed, includeTitle ? bundle.name : "");
        if (area.value != gameStr) {
            area.value = gameStr;
            // Adjust the height so all the contents are visible
            area.style.height = "";
            area.style.height = area.scrollHeight + 20 + "px";
        }
    }

    function refreshOutput() {
        let currentBundle = null;
        const bundles = [];

        function traverse(element) {
            if (!element) return;
            if (element.matches("section")) {
                const bundleContainer = element.querySelector(".bundle-name-container");
                if (bundleContainer) {
                    const bundleTitle = bundleContainer.textContent.trim();
                    if (currentBundle && currentBundle.articles.length === 0) {
                        currentBundle.name = bundleTitle;
                    } else {
                        currentBundle = {
                            name: bundleTitle,
                            articles: []
                        };
                        bundles.push(currentBundle);
                    }
                }
            }

            if (element.matches("article")) {
                if (!currentBundle) {
                    currentBundle = {
                        name: "unknown",
                        articles: []
                    }
                    bundles.push(currentBundle)
                }
                currentBundle.articles.push({
                    element,
                    gameTitle: element.querySelector(".game-name")?.textContent.trim() ?? "",
                    gameKey: element.querySelector("[aria-label='reveal-key']")?.value ?? "",
                });
                return; // Stop traversing further inside this article
            }

            for (const child of element.children) {
                if (child)
                    traverse(child);
            }
        }
        const container = document.querySelector("section.single-order");
        traverse(container);

        bundles.forEach(handleBundle);

        return bundles;
    }

    let loopCount = 0;
    function handleOrderPage() {
        const bundles = refreshOutput();

        if (bundles.length > 0) {
            if (loopCount++ < 100) {
              setTimeout(handleOrderPage, 500);
            }
        } else {
            if (loopCount++ < 100) {
                setTimeout(handleOrderPage, 100);
            }
        }
    }

    handleOrderPage();
})();