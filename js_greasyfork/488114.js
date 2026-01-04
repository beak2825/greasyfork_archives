// ==UserScript==
// @name         Amazon Star Detailed Ratings
// @description  Show detailed star ratings on Amazon.com listing page!  You must click "Add ratings" button in bottom right of screen.  Unfortunately, the detailed rating data is not loaded by default, so the script will systematically hover over every item to get the detailed rating.
// @version      2
// @grant        none
// @match        https://www.amazon.com/*
// @namespace    kowabungadude
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/488114/Amazon%20Star%20Detailed%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/488114/Amazon%20Star%20Detailed%20Ratings.meta.js
// ==/UserScript==

(() => {
    async function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function getVisiblePopups() {
        return [...document.querySelectorAll(".a-popover-inner")].filter(
            (x) => x.parentNode.parentNode.style.display !== "none"
        );
    }

    async function waitForPopup() {
        await sleep(1);
        for (let i = 0; i < 50; i += 1) {
            const visiblePopups = getVisiblePopups();
            if (visiblePopups.length === 1 && visiblePopups[0].innerText.match(/5 star/)) {
                return visiblePopups[0];
            }
            await sleep(10);
        }
        const visiblePopups = getVisiblePopups();
        console.error("Popup not found: ", visiblePopups);
        throw new Error(`Popup not found: ${visiblePopups}`);
    }

    async function waitForNoPopups() {
        await sleep(1);
        for (let i = 0; i < 50; i += 1) {
            const visiblePopups = getVisiblePopups();
            if (visiblePopups.length === 0) {
                return;
            }
            await sleep(10);
        }
        const visiblePopups = getVisiblePopups();
        throw new Error(`Popup found: ${visiblePopups}`);
    }

    async function addRating(el) {
        el.click();
        const popup = await waitForPopup();

        var text = popup.innerText;
        console.log("FOND POPUP", text);

        const star5 = text.match(/5 star[ \t\n\r]+([0-9]+%)/i)[1];
        const star4 = text.match(/4 star[ \t\n\r]+([0-9]+%)/i)[1];
        const star3 = text.match(/3 star[ \t\n\r]+([0-9]+%)/i)[1];
        const star2 = text.match(/2 star[ \t\n\r]+([0-9]+%)/i)[1];
        const star1 = text.match(/1 star[ \t\n\r]+([0-9]+%)/i)[1];

        const extra = el.querySelector(".my-custom-rating") || document.createElement("div");
        extra.className = "my-custom-rating";
        extra.innerText = `5 star - ${star5}\n4 star - ${star4}\n3 star - ${star3}\n2 star - ${star2}\n1 star - ${star1}`;

        el.appendChild(extra);
    }

    async function addAllRatings() {
        const products = document.querySelectorAll(".s-card-container .a-popover-trigger.a-declarative");

        document.body.click();
        await waitForNoPopups();

        for (let element of products) {
            await addRating(element);
        }

        document.body.click();
        await waitForNoPopups();
    }

    function addUI() {
        // remove previous
        if ([...document.head.childNodes].find((x) => x.className === "my-custom-rating-css")) {
            [...document.head.childNodes].find((x) => x.className === "my-custom-rating-css").remove();
        }
        if (document.querySelector(".my-custom-rating-ui")) {
            document.querySelector(".my-custom-rating-ui").remove();
        }

        // button
        var addRating = document.createElement("button");
        addRating.className = "my-custom-rating-ui";
        addRating.innerText = "Add ratings";
        addRating.onclick = () => {
            addAllRatings().catch(console.error);
        };
        document.body.appendChild(addRating);

        // style
        var style = document.createElement("style");
        style.className = "my-custom-rating-css";
        style.innerHTML = `
    .my-custom-rating-ui {
        position: fixed;
        bottom: 10px;
        right: 10px;

        background-color: white;
        padding: 10px;
        border: 1px solid black;
        z-index: 1000;
        cursor: pointer;
    }
    .my-custom-rating-ui:hover {
        background-color: green;
    }
    `;
        document.head.appendChild(style);
    }

    addUI();
})();
