// ==UserScript==
// @name IGN Wikis responsive
// @namespace https://gitlab.com/breatfr
// @version 1.0.1
// @description IGN's Wikis pages are more suitable for wide screens.
// @author BreatFR (https://breat.fr)
// @homepageURL https://gitlab.com/breatfr/ign-wikis
// @supportURL https://discord.gg/Q8KSHzdBxs
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match https://www.ign.com/wikis/*
// @downloadURL https://update.greasyfork.org/scripts/496869/IGN%20Wikis%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/496869/IGN%20Wikis%20responsive.meta.js
// ==/UserScript==

(function() {
let css = `
    .content {
        margin: 0px;
    }
    
    .page-content:not(.header-details) {
        padding: 0px;
    }
    
    .image,
    .video {
        border-radius: 16px;
    }
    
    .desktop-wiki-group {
        display: block;
    }
    
    @media (min-width: 641px) {
        .sticky-header.jsx-1640122255 .box-wrapper {
            padding: 0 !important;
        }
        
        .image.large,
        .video.large {
            border-radius: 16px;
            height: auto;
            max-width: 100% !important;
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
