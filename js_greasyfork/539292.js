// ==UserScript==
// @name         deepseek css
// @description  a
// @match        https://chat.deepseek.com/*
// @version 0.0.1.20251120075957
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/539292/deepseek%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/539292/deepseek%20css.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
style.id = 'deepseekCssStyleId';

  style.textContent = `
* {
margin-left: revert !important;
margin-right: revert !important;
flex-shrink: revert !important;
}

:root {
    color-scheme: light dark !important;
}

body {
    background-color: revert !important;
}

body > div#root > div.ds-theme > div {
    margin: 0px 8px !important;
}

div:has(> div > div > svg > path[d^="M1.00008 2.41429C0.609551"]) {
background: linear-gradient(to bottom, transparent 0%, transparent 30%, black 30%, black 100%);
}

div:has(> div > div > svg > path[d^="M23.7222 4H4.27776C3.57207"]) {
    background-color: revert !important;
}

div:has(> svg > path[d^="M1.00008 2.41429C0.609551 2.02376"]) {
    display: none !important;
}

div:has(> div > svg > path[d^="M5.856 17.121a.979.979"]):has(> div > span) {
    display: none !important;
}

div:has(> button[role="button"] > div.ds-icon > svg > path[d*="M7.00003 0.500061C3.41018"]) {
    display: none !important;
}

div:not([style]) > div.ds-message > div {
    background-color: red;
    color: black !important;
}

.ds-scroll-area__vertical-gutter {
    display: none !important;
}

div[class*='ds-message'] > div[style*='--collapsible-area-title'] > div:nth-of-type(1) > div[style*='opacity: 1;'] {
    display: none !important;
}
  `;
  document.head.appendChild(style);
})();