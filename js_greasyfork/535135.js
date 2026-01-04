// ==UserScript==
// @name         Show Autoplay Button on YouTube
// @namespace    TechnicalGlitch
// @version      1.0
// @description  Forces YouTube autoplay toggle to be visible
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535135/Show%20Autoplay%20Button%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/535135/Show%20Autoplay%20Button%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    const css = `[aria-label~="Autoplay"] { display: inline !important; }`;
    const style = document.createElement('style');
    style.textContent = css;

    const appendStyle = () => {
        if (!document.head) return;
        if (!document.head.querySelector('style[data-autoplay-fix]')) {
            style.setAttribute('data-autoplay-fix', 'true');
            document.head.appendChild(style);
        }
    };

    const observer = new MutationObserver(appendStyle);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    appendStyle();
})();
