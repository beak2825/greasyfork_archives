// ==UserScript==
// @name         chatgpt css
// @description  Customize styles for ChatGPT tables and text
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @version 0.0.1.20251227174314
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/539249/chatgpt%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/539249/chatgpt%20css.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
style.id = 'chatgptCssStyleId';

    style.textContent = `
        *:not(.katex):not(.katex *) {
            min-width: revert !important;
            -webkit-line-clamp: revert !important;
            white-space: revert !important;
            margin-left: revert !important;
            margin-right: revert !important;
        }

        html,
        body {
            background-color: revert !important;
        }

html {
    box-shadow: inset 0 0 0 1px red;
}

body > div {
    max-width: 100%;
}

        div:has(> div > button[data-testid="open-sidebar-button"]) {
            background-color: revert !important;
        }

        .content-fade:after {
            background-image: revert !important;
        }

        div[class*="tableContainer"] {
            /*width: unset !important;*/
            width: revert !important;
        }

        div[class*="tableContainer"] *:not(.katex):not(.katex *) {
            padding: revert !important;
            height: revert !important;
        }

        div.text-base {
            padding: revert !important;
        }

        .katex {
            display: block !important;
            overflow-x: auto !important;
            overflow-y: hidden !important;
        }

        .bg-token-message-surface, .user-message-bubble-color {
            background-color: red !important;
    color: black;
        }

        button {
            white-space: revert !important;
        }

        div[data-radix-popper-content-wrapper] {
            transform: revert !important;
            left: revert !important;
        }

[dir=ltr] div[data-radix-popper-content-wrapper]:has(>div[data-side=right]) {
    left: revert !important;
}
        div[data-radix-popper-content-wrapper],
        div[data-radix-popper-content-wrapper] * {
            width: revert !important;
            min-width: revert !important;
            white-space: revert !important;
            overflow-wrap: anywhere !important;
        }

        div:has(> button > div > span > svg > path[d^="M6.24992 11.0417C6.65578 11.0417 7.04227"]) {
            width: revert !important;
        }

div:has(> button > svg > path[d^="M9.33468 3.33333C9.33468"]) {
    display: none !important;
}

div:has(> div > div > div > aside > div > div > img[src="https://openaiassets.blob.core.windows.net/$web/chatgpt/filled-plus-icon.png"]) {
    display: none !important;
}

button:has(> svg > path[d*='M16.002 10.665H10.665V16.835H14.167C15.1803']) {
    display: none !important;
}

header div:has(> div > button > svg > use[href*="/cdn/assets/sprites-core-j9fay8bq.svg#2e54eb"]),
header div:has(> div > button > svg > use[href*=".svg#5f66c3"]), header button[aria-label*="Model selector"], div#stage-popover-sidebar div:has(> button[aria-label="Upgrade"]), div[data-radix-popper-content-wrapper] > div[data-radix-menu-content] > div div[role="menuitem"]:has(> div > svg.lucide-sparkle), div[aria-label="Open profile menu"] > div > div > div:has(> span > span), div#thread-bottom-container div:has(> div > button > svg > use[href*=".svg#ac89a7"]) {
    display: none !important;
}
        `;
    document.head.appendChild(style);
})();