// ==UserScript==
// @name         DeepSeek Chat Citation Collector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically collect and replace citation URLs on chat.deepseek.com
// @author       Bui Quoc Dung
// @match        https://chat.deepseek.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527421/DeepSeek%20Chat%20Citation%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/527421/DeepSeek%20Chat%20Citation%20Collector.meta.js
// ==/UserScript==

(function () {
    const citations = new Map(); // Store citation number -> URL
    let progressBar;

    // Create progress bar
    function createProgressBar() {
        progressBar = document.createElement("div");
        progressBar.style.position = "fixed";
        progressBar.style.top = "0";
        progressBar.style.left = "0";
        progressBar.style.width = "0%";
        progressBar.style.height = "5px";
        progressBar.style.backgroundColor = "blue";
        progressBar.style.zIndex = "9999";
        document.body.appendChild(progressBar);
    }

    // Update progress
    function updateProgress(current, total) {
        if (progressBar) {
            progressBar.style.width = `${(current / total) * 100}%`;
        }
    }

    // Override window.open to BLOCK opening new tabs but still retrieve the URL
    window.open = function (url, name, specs) {
        if (window.lastClickedSpan) {
            citations.set(window.lastClickedSpan.textContent.trim(), url);
        }
        console.log("Blocked tab opening, collected URL:", url); // Debug
    };

    // Replace <span> elements with <a>, adding commas where necessary
    function replaceCitations() {
        document.querySelectorAll("span.ds-markdown-cite").forEach((span, index, array) => {
            const citeNumber = span.textContent.trim();
            if (citations.has(citeNumber)) {
                const link = document.createElement("a");
                link.href = citations.get(citeNumber);
                link.textContent = citeNumber;
                link.target = "_blank";
                link.style.color = "blue";
                link.style.textDecoration = "underline";

                if (index < array.length - 1) {
                    const comma = document.createTextNode(", ");
                    span.replaceWith(link, comma);
                } else {
                    span.replaceWith(link);
                }
            }
        });
        if (progressBar) progressBar.style.width = "100%"; // Complete
        setTimeout(() => progressBar.remove(), 1000); // Remove progress bar after 1s
    }

    // Automatically click each citation to retrieve its URL
    async function autoClickCitations() {
        const spans = document.querySelectorAll("span.ds-markdown-cite");
        if (spans.length === 0) return;
        createProgressBar(); // Create progress bar

        for (let i = 0; i < spans.length; i++) {
            window.lastClickedSpan = spans[i];
            spans[i].dispatchEvent(new Event("click", { bubbles: true }));
            updateProgress(i + 1, spans.length);
            await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 0.5s
        }
        replaceCitations(); // Replace after collecting all URLs
    }

    // Wait 2s to ensure the page has loaded, then run automatically
    setTimeout(autoClickCitations, 2000);
})();
