// ==UserScript==
// @name         mojeek css
// @description  a
// @match        https://www.mojeek.com/*
// @version 0.0.1.20250826121539
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/547353/mojeek%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/547353/mojeek%20css.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
style.id = 'mojeekCssStyleId';

    style.textContent = `
html {
    color-scheme: light dark !important;
}

* {
    color: revert !important;
    background: revert !important;
}
        `;
  document.head.appendChild(style);
})();
