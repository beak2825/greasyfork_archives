// ==UserScript==
// @name         LeetCode solution article widener
// @namespace    https://github.com/zica87/self-made-userscipts
// @version      2.1
// @description  Add a toggle to widen the solution articles to view long code easier.
// @author       zica
// @match        https://leetcode.com/*
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/456504/LeetCode%20solution%20article%20widener.user.js
// @updateURL https://update.greasyfork.org/scripts/456504/LeetCode%20solution%20article%20widener.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // biome-ignore lint/complexity/useRegexLiterals: escaping '/' reduces readability
    const solutionPageRegEx = new RegExp(
        "https://leetcode.com/problems/.*/solutions/.*/"
    );
    // biome-ignore lint/complexity/useRegexLiterals: escaping '/' reduces readability
    const editorialPageRegEx = new RegExp(
        "https://leetcode.com/problems/.*/editorial"
    );

    const toggle = document.createElement("button");
    toggle.innerText = "←→";
    toggle.onclick = () => {
        if (toggle.innerText === "←→") {
            const articles = document.getElementsByClassName("mx-auto");
            for (const article of articles) {
                article.style.maxWidth = "none";
            }
            toggle.innerText = "default width";
        } else {
            const articles = document.getElementsByClassName("mx-auto");
            for (const article of articles) {
                article.style = {};
            }
            toggle.innerText = "←→";
        }
    };

    const observer = new MutationObserver((_, observerInstance) => {
        if (
            !solutionPageRegEx.test(window.location.href) &&
            !editorialPageRegEx.test(window.location.href)
        ) {
            return;
        }
        const layoutButton = document.getElementById(
            "qd-layout-manager-btn"
        )?.parentElement;
        if (layoutButton === undefined || layoutButton === null) {
            return;
        }
        observerInstance.disconnect();
        layoutButton.before(toggle);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
