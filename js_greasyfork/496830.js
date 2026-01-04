// ==UserScript==
// @name Alsacréations Forum responsive
// @namespace https://gitlab.com/breatfr
// @version 1.0.1
// @description Le forum d'Alsacréations prend maintenant toute la largeur de la page.
// @author BreatFR (https://breat.fr)
// @homepageURL https://gitlab.com/breatfr/alsacreations
// @supportURL https://discord.gg/Q8KSHzdBxs
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match *://*.forum.alsacreations.com/*
// @downloadURL https://update.greasyfork.org/scripts/496830/Alsacr%C3%A9ations%20Forum%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/496830/Alsacr%C3%A9ations%20Forum%20responsive.meta.js
// ==/UserScript==

(function() {
let css = `
    main,
    #page,
    #message {
        max-width: 100% !important;
    }

    .smilies .smiley {
        width: 24px;
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
