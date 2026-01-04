// ==UserScript==
// @name         Scoresaber Buttons
// @namespace    tzurs11-scoresaber-buttons
// @version      1.0
// @description  Adds useful buttons to scoresaber like onclick and beat saver.
// @author       TzurS11
// @match        *.scoresaber.com/leaderboard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scoresaber.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450177/Scoresaber%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/450177/Scoresaber%20Buttons.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

(function () {
    waitForElm(
        "#svelte > div.root > div.page-container.content > div > div > div > div.column.is-4 > div.card.map-card.svelte-aoq06a > div.window.card-content > div.content.svelte-aoq06a > strong"
    ).then(async () => {
        let hash = await document
        .getElementsByClassName("text-muted svelte-aoq06a")[0]
        .innerText.trim();
        fetch(`https://api.beatsaver.com/maps/hash/${hash}`)
            .then((res) => res.json())
            .then(async (json) => {
            console.log(json)
            setInterval(async () => {
                document.getElementsByClassName(
                "text-muted svelte-aoq06a"
                )[0].innerText = "";
                const boxes = await document.getElementsByClassName(
                    "content svelte-aoq06a"
                );

                const child = document.createElement("div");
                child.innerHTML = `<a href="https://beatsaver.com/maps/${json.id}" class="addonLinks"><strong>Beat Saver</strong>
                </a>&nbsp;&nbsp;&nbsp;<a href="beatsaver://${json.id}" class="addonLinks"><strong>One-Click</strong></a>&nbsp;&nbsp;&nbsp;
                <a class="addonLinks" onclick="navigator.clipboard.writeText(\`!bsr ${json.id}\`)"><strong>!bsr</strong></a>`;
                await boxes[0].appendChild(child);
                let something = document.querySelector("#svelte > div.root > div.page-container.content > div > div > div > div.column.is-4 > div.card.map-card.svelte-aoq06a > div.window.card-content > div.content.svelte-aoq06a > div:nth-child(12)")
                something.remove()
            },300)
        });
    });
})();
