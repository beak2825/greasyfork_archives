// ==UserScript==
// @name         Inoreader Auto-Load Full Article
// @namespace    elddc
// @version      2.0
// @description  Automatically load full content when opening an article in Inoreader
// @author       Elddc
// @match        https://www.inoreader.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428293/Inoreader%20Auto-Load%20Full%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/428293/Inoreader%20Auto-Load%20Full%20Article.meta.js
// ==/UserScript==

//----- configure (change as desired) -----
const excludedSources = ["Associated Press"]; // subscriptions to exclude from auto-load
const buttonSelector = ".icon-article_topbar_mobilize_empty"; // modify this if the button class name changes
const sourceSelector = ".article_sub_title a";
//------------------------------------

function loadFullArticle(button) {
    let source = ""; // fallback if there is an error finding the article source
    try {
        source = document.querySelector(".article_sub_title a").innerText.trim();
    } catch (err) {
        console.log("The source selector has changed! Open an issue here to let me know: https://github.com/elddc/inoreader-autoload-full-content/issues");
    }

    console.log(source);
    if (!excludedSources.includes(source)) {
        button.click();
    }
}

function handleNav() {
    if (!window.location.pathname.includes("article/")) {
        return;
    }

    const button = document.querySelector(buttonSelector);
    if (button) {
        loadFullArticle(button);
    }

    const observer = new MutationObserver(() => {
        const button = document.querySelector(buttonSelector);
        if (button) {
            observer.disconnect();
            loadFullArticle(button);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

handleNav();
window.onpopstate = handleNav;
