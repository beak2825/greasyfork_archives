// ==UserScript==
// @name        Google News css
// @description a
// @match       https://www.google.com/search?*tbm=nws*
// @run-at      document-start
// @version 0.0.1.20250930175253
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/534800/Google%20News%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/534800/Google%20News%20css.meta.js
// ==/UserScript==

(function () {
  const css = `
  :root {
    color-scheme: light dark !important;
  }

  * {
    color: revert !important;
    background-color: revert !important;
}

  .UFQ0Gb {
      column-gap: 0 !important;
    }

    .lSfe4c {
      flex-direction: column-reverse !important;
    }

    .r5bEn .gpjNTe {
      margin: 0 !important;
    }

    .gpjNTe {
      display: block !important;
    }

    .SoAPf {
      max-width: 290px !important;
      width: 100% !important;
    }

    .SoAPf .n0jPhd,
    .SoAPf .GI74Re {
      display: block !important;
      -webkit-line-clamp: unset !important;
      -webkit-box-orient: unset !important;
      overflow: visible !important;
      text-overflow: unset !important;
      white-space: normal !important;
    }
    `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();