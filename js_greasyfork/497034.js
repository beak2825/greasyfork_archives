// ==UserScript==
// @name SuperSoluce responsive
// @namespace https://gitlab.com/breatfr
// @version 1.0.1
// @description Le site SuperSoluce est mieux adapté aux écrans larges.
// @author BreatFR (https://breat.fr)
// @homepageURL https://gitlab.com/breatfr/supersoluce
// @supportURL https://discord.gg/Q8KSHzdBxs
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match *://*.supersoluce.com/*
// @downloadURL https://update.greasyfork.org/scripts/497034/SuperSoluce%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/497034/SuperSoluce%20responsive.meta.js
// ==/UserScript==

(function() {
let css = `
    p {
        font-size: 1.2rem !important;
    }
    
    body {
        background: transparent;
        max-width: 100% !important;
        padding-left: 20px;
        padding-right: 20px;
    }
    body>section,
    body>section>div,
    .container,
    .content,
    .inner_container_large {
        max-width: 100% !important;
        width: 100% !important;
    }
    article > .content p {
        margin-right: 20px !important;
    }

    .page_content_right {
        float: none !important;
        width: 100% !important;
    }
    
    #game_block,
    .sidebar,
    .rwad-with-placeholder.rwad-with-placeholder-pos-1,
    #multimedia_wrapper_mobile {
        display: none !important;
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
