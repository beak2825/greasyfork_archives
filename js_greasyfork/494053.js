// ==UserScript==
// @name         Icourse Anti Filtering
// @name:zh-CN   评课社区反屏蔽
// @license      gpl-3.0
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Stop the filtering of bad words in icourse.club (only takes effect on the client side)
// @description:zh-CN  绕过评课社区不文明用语的屏蔽 (仅在本地生效)
// @author       PRO
// @icon         https://icourse.club/static/image/favicon.ico
// @match        https://icourse.club/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/494053/Icourse%20Anti%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/494053/Icourse%20Anti%20Filtering.meta.js
// ==/UserScript==

(function () {
    const log = console.log.bind(console, "[Icourse Anti Filtering]");
    // `beforescriptexecute` polyfill from: https://gist.github.com/x0a/a78f6cebe3356c35a44e88b371f3a03a
    if ("onbeforescriptexecute" in document) return; // Already natively supported
    const scriptWatcher = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === "SCRIPT") {
                    const evt = new CustomEvent("beforescriptexecute", {
                        detail: node,
                        cancelable: true
                    });
                    // .dispatchEvent will execute the event synchrously, and return false if .preventDefault() is called
                    if (!document.dispatchEvent(evt)) {
                        node.remove();
                    }
                }
            }
        }
    });
    scriptWatcher.observe(document, {
        childList: true,
        subtree: true
    });
    document.addEventListener("beforescriptexecute", (e) => {
        const script = e.detail;
        // Prevent the `filter_bad_words` function from being executed
        if (script.text.includes("function filter_bad_words(index)")) {
            log("Prevented `filter_bad_words` script:", script.text);
            e.preventDefault();
            return;
        }
        // Remove manual filtering
        const regex = /\$\('\.review-filter-rule'\)\.each\(function \(index\) {[\s\S]*?}\)/;
        script.text = script.text.replace(regex, "// Removed by Icourse Anti Filtering");
    });
    log("Successfully loaded! 🎉");
})();
