// ==UserScript==
// @name         itch.io Hide Library Items / Purchases
// @namespace    http://tampermonkey.net/
// @version      2024-07-09 (5)
// @description  Hide games / purchases in your library. CTRL+SHIFT+H to show settings.
// @author       Grindle
// @match        https://itch.io/my-purchases
// @match        https://itch.io/my-collections
// @icon         https://itch.io/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500118/itchio%20Hide%20Library%20Items%20%20Purchases.user.js
// @updateURL https://update.greasyfork.org/scripts/500118/itchio%20Hide%20Library%20Items%20%20Purchases.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const ids = (() => {
        !GM_listValues().includes("gameIds") && GM_setValue("gameIds", []);

        return GM_getValue("gameIds");
    })();

    function createHideButton(element) {
        const id = element.getAttribute("data-game_id");
        const button = document.createElement("button");

        button.textContent = "Hide item";
        button.classList.add("hide-item-button");
        button.addEventListener("click", () => {
            ids.push(id);
            GM_setValue("gameIds", ids);
            element.remove();
        });

        return button;
    }

    const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
            if (m.addedNodes.length === 0) {
                continue;
            }

            for (const n of m.addedNodes) {
                if (n.nodeType !== Node.ELEMENT_NODE || !n.hasAttribute("data-game_id")) {
                    continue;
                }

                const id = n.getAttribute("data-game_id");

                if (ids.includes(id)) {
                    n.remove();
                    continue;
                }

                n.appendChild(createHideButton(n));

                continue;
            }
        }
    });

    function initialRemove() {
        const elements = document.querySelectorAll("[data-game_id]");

        for (const e of elements) {
            const id = e.getAttribute("data-game_id");

            if (ids.includes(id)) {
                e.remove();
                continue;
            }

            e.appendChild(createHideButton(e));
        }
    }

    function showModal() {
        const modal = document.createElement("div");
        const modalContent = document.createElement("div");
        const deleteButton = document.createElement("button");
        const closeButton = document.createElement("button");

        modal.id = "myModal";
        modal.style.display = "block";
        modal.style.position = "fixed";
        modal.style.zIndex = "1";
        modal.style.left = "0";
        modal.style.top = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.overflow = "auto";
        modal.style.backgroundColor = "rgba(0,0,0,0.4)";

        modalContent.style.backgroundColor = "#fefefe";
        modalContent.style.margin = "15% auto";
        modalContent.style.padding = "20px";
        modalContent.style.border = "1px solid #888";
        modalContent.style.width = "80%";

        deleteButton.innerHTML = "Clear hidden items";
        deleteButton.onclick = () => GM_setValue("gameIds", []);

        closeButton.innerHTML = "Close";
        closeButton.onclick = () => document.body.removeChild(modal);

        modalContent.appendChild(deleteButton);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    initialRemove();
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("keydown", function (event) {
        if (event.key === "H" && event.ctrlKey) {
            showModal();
        }
    });
})();