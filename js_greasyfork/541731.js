// ==UserScript==
// @name        mistral css
// @description a
// @match       https://chat.mistral.ai/*
// @run-at      document-start
// @version 0.0.1.20251013165414
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/541731/mistral%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/541731/mistral%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
* {
gap: unset !important;
}

:root {
    color-scheme: light dark !important;
}

body, main {
    background-color: revert !important;
}

body {
    box-shadow: inset 0 0 0 1px red;
}

.bg-subtle {
    background-color: revert !important;
}

a[href="/upgrade"] {
display: none !important;
}

div:has(> button > svg.lucide-arrow-down > path[d^="M12 5v14"]) {
    display: none !important;
}

div[data-message-author-role="user"] > div > div:not(:has(> div > button)) {
    background-color: red !important;
    color: black !important;
}

body > main > div > div > div > main > div > div > div > div:nth-of-type(1) {
  /*display: none !important;*/
}

div[class*="@container/layout"] > div > canvas {
    display: none !important;
}

img[alt="LeChat - Mistral"] {
    display: none !important;
}

footer {
    display: none !important;
}
  `;
    const style = document.createElement('style');
style.id = 'mistralCssStyleId';

    style.textContent = css;
    document.head.appendChild(style);
})();