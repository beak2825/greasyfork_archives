// ==UserScript==
// @name Коммерсант: эксклюзивные статьи
// @namespace github.com/a2kolbasov
// @version 1.1.0
// @description Доступ к эксклюзивным статьям Коммерсанта без аккаунта
// @author Aleksandr Kolbasov
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.kommersant.ru/*
// @downloadURL https://update.greasyfork.org/scripts/478552/%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D1%80%D1%81%D0%B0%D0%BD%D1%82%3A%20%D1%8D%D0%BA%D1%81%D0%BA%D0%BB%D1%8E%D0%B7%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5%20%D1%81%D1%82%D0%B0%D1%82%D1%8C%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/478552/%D0%9A%D0%BE%D0%BC%D0%BC%D0%B5%D1%80%D1%81%D0%B0%D0%BD%D1%82%3A%20%D1%8D%D0%BA%D1%81%D0%BA%D0%BB%D1%8E%D0%B7%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5%20%D1%81%D1%82%D0%B0%D1%82%D1%8C%D0%B8.meta.js
// ==/UserScript==

(function() {
let css = `
    .doc--regwall {
        max-height: unset;
    }

    .doc--regwall:after {
        box-shadow: unset;
    }

    .regwall {
        display: none;
    }

    .doc--regwall_manual * {
        display: revert !important;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
