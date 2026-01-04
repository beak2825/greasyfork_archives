// ==UserScript==
// @name        No Zoom on iOS
// @namespace   Violentmonkey Scripts
// @icon        https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.59f2e898.png
// @match       https://chat.openai.com/*
// @grant       none
// @noframes
// @version     0.1.2
// @author      y-saeki
// @supportURL  https://github.com/y-saeki/UserScript
// @description disable input form auto-zoom function on iOS
// @downloadURL https://update.greasyfork.org/scripts/478562/No%20Zoom%20on%20iOS.user.js
// @updateURL https://update.greasyfork.org/scripts/478562/No%20Zoom%20on%20iOS.meta.js
// ==/UserScript==

check();

// Observe Screen Transition
const observeTarget = document.querySelector('head');
const observer = new MutationObserver(check);
observer.observe(observeTarget, { childList: true });

// Runs everytime when mutated
function check() {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        const content = viewportMeta.getAttribute("content");
        if (content) {
            if (!content.includes("user-scalable=no")) {
                viewportMeta.setAttribute(
                    "content",
                    content + ", user-scalable=no"
                );
            }
        } else {
            viewportMeta.setAttribute("content", "user-scalable=no");
        }
    } else {
        const newViewportMeta = document.createElement("meta");
        newViewportMeta.name = "viewport";
        newViewportMeta.content = "user-scalable=no";
        document.getElementsByTagName("head")[0].appendChild(newViewportMeta);
    }
}