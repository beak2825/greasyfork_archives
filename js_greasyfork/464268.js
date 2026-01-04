// @ts-check
// ==UserScript==
// @name         Minimal theme
// @version      0.4
// @description  Make everything simpler and easy on the eyes.
// @match        *://*/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @namespace    TRAPNSTUDIO.DEV
// @author       TRAPNSTUDIO.DEV
// @downloadURL https://update.greasyfork.org/scripts/464268/Minimal%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/464268/Minimal%20theme.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.innerHTML = `
:root {
  --min-theme-color-primary: #333333;
  --min-theme-color-secondary: #F0F0F0;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --min-theme-color-primary: #F0F0F0;
    --min-theme-color-secondary: #333333;
  }
}

* {
  fill: var(--min-theme-color-primary) !important;
  color: var(--min-theme-color-primary) !important;
  border-color: var(--min-theme-color-primary) !important;
  outline-color: var(--min-theme-color-primary) !important;
  background-color: transparent !important;
  text-decoration-color: var(--min-theme-color-primary) !important;
  box-shadow: none !important;
  text-shadow: none !important;
  opacity: 1 !important;
}

*:hover, *:active, *:focus {
  background-color: var(--min-theme-color-secondary) !important;
}


html, body {
  background-color: var(--min-theme-color-secondary) !important;
}


::placeholder {
  color: var(--min-theme-color-primary) !important;
}

::selection {
  background-color: var(--min-theme-color-primary) !important;
  color: var(--min-theme-color-secondary) !important;
}
`;
  document.getElementsByTagName('head')[0].appendChild(style);
})();
