// ==UserScript==
// @name Drukuj suchy tekst z forum dobreprogramy
// @namespace print-dobre-programy
// @version 1.0.3
// @description Ukrywa grafiki na wydruku, by nie szukać tego w opcjach przeglądarek i ciągle przestawiać
// @author krystian3w
// @license CC-BY-SA-4.0 (https://creativecommons.org/licenses/by-sa/4.0/)
// @grant GM_addStyle
// @run-at document-start
// @match *://*.forum.dobreprogramy.pl/*
// @downloadURL https://update.greasyfork.org/scripts/529295/Drukuj%20suchy%20tekst%20z%20forum%20dobreprogramy.user.js
// @updateURL https://update.greasyfork.org/scripts/529295/Drukuj%20suchy%20tekst%20z%20forum%20dobreprogramy.meta.js
// ==/UserScript==

(function() {
let css = `
@media print {
    .topic-post img,
    .post img {
        display: none !important;
    }
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
