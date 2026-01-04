// ==UserScript==
// @name HuggingChat responsive
// @namespace https://gitlab.com/breatfr
// @version 1.0.2
// @description HuggingChat website is more suitable for wide screens.
// @author BreatFR (https://breat.fr)
// @homepageURL https://gitlab.com/breatfr/huggingchat
// @supportURL https://discord.gg/Q8KSHzdBxs
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match https://huggingface.co/chat/*
// @downloadURL https://update.greasyfork.org/scripts/496858/HuggingChat%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/496858/HuggingChat%20responsive.meta.js
// ==/UserScript==

(function() {
let css = `
    .xl\\:max-w-4xl,
    form,
    [aria-label="file dropzone"] {
        max-width: 100% !important;
    }
    
    pre {
        white-space: wrap;
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
