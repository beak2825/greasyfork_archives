// ==UserScript==
// @name        Brave css
// @description a
// @match       https://search.brave.com/*
// @run-at      document-start
// @version 0.0.1.20260126130853
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/534810/Brave%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/534810/Brave%20css.meta.js
// ==/UserScript==

(function () {
    const css = `
* {
  gap: unset !important;
  overflow-wrap: anywhere !important;
}

*:not(#primary-tabs *) {
  white-space: revert !important;
}

/* Disable WebKit line clamping */
[class*="line-clamp"] {
  -webkit-line-clamp: none !important;
}

/* Ensure result descriptions aren’t hidden */
.desc {
  display: block !important;
}

.result-content.svelte-16hzhkl {
  display: block;
}

/* Allow title wrapping normally
    .title.svelte-yo6adg {
      white-space: normal !important;
    }*/

.title {
  white-space: revert !important;
}

aside {
  display: none !important;
}

a:has(> div.image-wrapper) {
  display: inline-block !important;
}
  `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
