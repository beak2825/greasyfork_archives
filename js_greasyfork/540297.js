// ==UserScript==
// @name         grok css
// @description  a
// @match        https://grok.com/*
// @version 0.0.1.20251126055912
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/540297/grok%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/540297/grok%20css.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
style.id = 'grokCssStyleId';

    style.textContent = `
* {
            min-width: revert !important;
            gap: revert !important;
            padding-left: revert !important;
            padding-right: revert !important;
            margin-left: revert !important;
            margin-right: revert !important;
            /*overflow: revert !important;
            white-space: revert !important;*/
            mask-image: revert !important;
        }

        body {
        background: revert !important;
        }

        table * {
          /*overflow-wrap: anywhere !important;*/
        }

        .message-bubble:not(.w-full) {
            background-color: red;
color: black !important;
        }

                .message-bubble:not(.w-full) * {
color: black !important;
        }

button {
white-space: revert !important;
}

button[aria-label="Scroll down"] {
display: none !important;
}

canvas {
display: none !important;
}

div:has(> button > svg > path[d^="M12 4H8C5.79086 4 4 5.79086"]) {
    display: none !important;
}

div:has(> div > div > button[aria-label="Toggle sidebar"]) {
    background: revert !important;
    background-color: canvas !important;
    }

  div:has(> div[data-sidebar="sidebar"]) {
    background-color: canvas !important;
    border: none !important;
  }

div:has(> div > div > button > svg > path[d^="M17.64 18.67 20"]) {
    display: none !important;
}

div[role="button"]:has(> div > div > svg > path[d^="M82.7365 14.0405V0.652524H84.8705V9.48811L89.3839"]) {
    display: none !important;
}

div.table-container {
  overflow-x: scroll !important;
}

.w-fit {
    width: revert !important;
}

thead.sticky {
  top: 0 !important;
}

section[aria-label*='Notifications']:has(> ol[class*='toaster group']) {
    display: none !important;
}

div:has(> button > svg > path[d*='M4 4v7a4 4 0 0 0 4 4h12']) {
    display: none !important;
}

div:has(> button[aria-label*='Attach'] > svg > path[d*='M10 9V15C10 16.1046 10.8954 17']) {
    position: revert !important;
}

div:has(> div > form div[contenteditable='true']) > ul {
    display: none !important;
}
        `;
    document.head.appendChild(style);
})();