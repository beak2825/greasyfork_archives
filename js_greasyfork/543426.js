// ==UserScript==
// @name         next space flight css
// @description  a
// @match        https://nextspaceflight.com/*
// @version 0.0.1.20250723124535
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/543426/next%20space%20flight%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/543426/next%20space%20flight%20css.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');

    style.textContent = `
.mdl-grid {
    padding: 0 !important;
}

.mdl-grid > div {
    margin-left: 0 !important;
    margin-right: 0 !important;
}
        `;
    document.head.appendChild(style);
})();