// ==UserScript==
// @name         Hardcover Plus: Search MAM Buttons
// @namespace    https://greasyfork.org/en/users/1457912
// @version      0.1.17
// @description  Add "Search MAM" buttons to Hardcover.app book and series pages (Title/Series and Title/Series + Author)
// @author       WilliestWonka
// @match        https://hardcover.app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532844/Hardcover%20Plus%3A%20Search%20MAM%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/532844/Hardcover%20Plus%3A%20Search%20MAM%20Buttons.meta.js
// ==/UserScript==

(function () {
    const addSearchButtons = () => {
        const titleElement = document.querySelector("h1.text-3xl, h1.text-4xl, h1.text-2xl, h1.lg\\:text-4xl, h1.font-serif");
        const authorElement = document.querySelector("a[href^='/authors/'] span");

        if (!titleElement || !authorElement) {
            console.log("[HC+] Required elements not found.");
            return;
        }

        if (document.querySelector(".mam-button-container")) {
            console.log("[HC+] Buttons already exist.");
            return;
        }

        const isSeriesPage = window.location.pathname.startsWith("/series/");
        let title = titleElement.innerText.trim();
        let author = authorElement.innerText.trim();

        console.log(`[HC+] Title: ${title}`);
        console.log(`[HC+] Author: ${author}`);

        const mamUrlTitle = `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodeURIComponent(title)}`;
        const mamUrlTitleAuthor = `https://www.myanonamouse.net/tor/browse.php?tor[text]=${encodeURIComponent(title + " " + author)}`;

        const mamButtonTitle = document.createElement("a");
        mamButtonTitle.href = mamUrlTitle;
        mamButtonTitle.target = "_blank";
        mamButtonTitle.textContent = isSeriesPage ? "Search MAM Series" : "Search MAM Title";

        const mamButtonTitleAuthor = document.createElement("a");
        mamButtonTitleAuthor.href = mamUrlTitleAuthor;
        mamButtonTitleAuthor.target = "_blank";
        mamButtonTitleAuthor.textContent = isSeriesPage ? "Search MAM Series + Author" : "Search MAM Title + Author";

        const buttonClass = "inline-flex items-center justify-center rounded-lg bg-yellow-400 text-yellow-900 font-semibold shadow-md hover:bg-yellow-300 transition px-4 py-2 mt-4";
        mamButtonTitle.className = buttonClass;
        mamButtonTitleAuthor.className = buttonClass;

        mamButtonTitle.style.boxShadow = "0 4px #b58105";
        mamButtonTitleAuthor.style.boxShadow = "0 4px #b58105";
        mamButtonTitle.style.marginRight = "10px";

        const buttonContainer = document.createElement("div");
        buttonContainer.className = "mam-button-container";
        buttonContainer.style.display = "flex";
        buttonContainer.style.alignItems = "center";
        buttonContainer.style.justifyContent = "flex-start";

        buttonContainer.appendChild(mamButtonTitle);
        buttonContainer.appendChild(mamButtonTitleAuthor);

        titleElement.parentNode.appendChild(buttonContainer);
        console.log("[HC+] 'Search MAM' buttons added!");
    };

    const waitForPageReady = () => {
        let retries = 0;
        const maxRetries = 30;

        const interval = setInterval(() => {
            const pathname = window.location.pathname;
            if (!/^\/(books|series)\//.test(pathname)) {
                clearInterval(interval);
                return;
            }

            const titleElement = document.querySelector("h1.text-3xl, h1.text-4xl, h1.text-2xl, h1.lg\\:text-4xl, h1.font-serif");
            const authorElement = document.querySelector("a[href^='/authors/'] span");

            if (titleElement && authorElement) {
                console.log("[HC+] Page is ready, injecting buttons...");
                clearInterval(interval);

                // Add a longer delay to help avoid flashing
                setTimeout(() => {
                    addSearchButtons();

                    // Safety net in case dynamic rendering overrides
                    setTimeout(() => {
                        if (!document.querySelector(".mam-button-container")) {
                            console.log("[HC+] Safety reinjection triggered.");
                            addSearchButtons();
                        }
                    }, 1000);
                }, 500); // Slightly longer delay
            } else {
                console.log("[HC+] Waiting for title/author elements...");
            }

            if (++retries > maxRetries) {
                console.log("[HC+] Gave up waiting after retries.");
                clearInterval(interval);
            }
        }, 400);
    };

    const observeUrlChanges = () => {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                console.log(`[HC+] URL changed to ${currentUrl}`);
                lastUrl = currentUrl;

                if (/^https:\/\/hardcover\.app\/(books|series)\//.test(currentUrl)) {
                    waitForPageReady();
                } else {
                    const existing = document.querySelector(".mam-button-container");
                    if (existing) {
                        console.log("[HC+] Navigated away, removing buttons.");
                        existing.remove();
                    }
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
    };

    window.addEventListener("load", () => {
        console.log("[HC+] Script loaded, waiting for page to be ready...");
        if (/^\/books\//.test(window.location.pathname) || /^\/series\//.test(window.location.pathname)) {
            waitForPageReady();
        }
        observeUrlChanges();
    });
})();
