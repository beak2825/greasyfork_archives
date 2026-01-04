// ==UserScript==
// @name         Better Buzz Maths
// @namespace    https://greasyfork.org/users/1359538
// @version      2.0
// @description  Fixes weird math test images in Agilix Buzz
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agilixbuzz.com
// @homepage     https://greasyfork.org/scripts/505681
// @match        https://legacy.agilixbuzz.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505681/Better%20Buzz%20Maths.user.js
// @updateURL https://update.greasyfork.org/scripts/505681/Better%20Buzz%20Maths.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const url = /cdn\.flvs\.net\/(.*math_|assessment_images).*\.(png|gif)/;

    if (!document.querySelector("style#style-math-fix")) {
        const style = document.createElement("style");
        style.id = "style-math-fix";
        style.textContent = ".math-fix {filter: brightness(0.5) invert(1);}";
        document.head.appendChild(style);
    }

    function invert(img) {
        if (!img.classList.contains("math-fix") && url.test(img.src)) {
            img.classList.add("math-fix");
        }
    }

    const observer = new MutationObserver((mutations) => {
        for (const mut of mutations) {
            if (mut.type === "childList") {
                for (const node of mut.addedNodes) {
                    if (node.tagName === "IMG") {
                        invert(node);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        node.querySelectorAll("img").forEach(img => invert(img));
                    }
                }
            }
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});
    window.addEventListener("unload", () => observer.disconnect());

    document.querySelectorAll("img").forEach(img => invert(img));
}());