// ==UserScript==
// @name Quora responsive
// @namespace https://gitlab.com/breatfr
// @version 1.0.1
// @description Quora website is more suitable for wide screens.
// @author BreatFR (https://breat.fr)
// @homepageURL https://gitlab.com/breatfr/quora
// @supportURL https://discord.gg/Q8KSHzdBxs
// @license AGPL-3.0-or-later; https://www.gnu.org/licenses/agpl-3.0.txt
// @grant GM_addStyle
// @run-at document-start
// @match *://*.quora.com/*
// @downloadURL https://update.greasyfork.org/scripts/497022/Quora%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/497022/Quora%20responsive.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Left menu */
    .q-box .dom_annotate_feed_switcher div {
        font-size: 1rem !important;
        gap: 10px !important;
    }
    
    /* Avatar menu */
    #POPOVER31 > div > div.q-box.qu-bg--raised.qu-borderRadius--small.qu-borderAll.qu-borderColor--gray.qu-overflow--hidden.qu-boxShadow--large > div > div > div:nth-child(3) {
        max-width: 260px !important;
    }
    #POPOVER31 > div > div.q-box.qu-bg--raised.qu-borderRadius--small.qu-borderAll.qu-borderColor--gray.qu-overflow--hidden.qu-boxShadow--large > div > div > div:nth-child(3) > div:nth-child(1) > div > div > div.q-box.qu-flex--auto.qu-overflow--hidden {
        max-width: 150px !important;
    }
    #POPOVER31 > div > div.q-box.qu-bg--raised.qu-borderRadius--small.qu-borderAll.qu-borderColor--gray.qu-overflow--hidden.qu-boxShadow--large > div > div > div:nth-child(3) > div:nth-child(1) > div > div > div.q-box.qu-flex--none.qu-display--inline-flex {
        max-width: 42px !important
    }
    
    /* Ads */
    .q-box > div > div:nth-child(3) > div > div > div:nth-child(3) {
        display: none;
        width: 0;
    }
    
    /* Add question */
    #root > div > div.q-box > div > div.q-fixed.qu-fullX.qu-zIndex--header.qu-bg--raised.qu-borderBottom.qu-boxShadow--medium.qu-borderColor--raised > div > div:nth-child(2) > div > div.q-box.qu-ml--small > div > button > div > div > div {
        padding-bottom:5px !important;
    }
    
    /* Wide */
    body {
        overflow-x: hidden !important;
    }
    [width="100%"] {
        padding-right: 20px !important;
    }
    
    [width="1100"] {
        margin-left: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
    }
    [width="1072"] {
        width: 100% !important;
    }
    [width="636"] {
        margin-left: 0 !important;
        width: 98% !important;
    }
    [width="658"],
    [width="588.5"] {
        max-width: calc(100% - 300px) !important;
        width: calc(100% - 250px) !important;
    }
    [width="356"] {
        max-width: 500px !important;
        padding: 0 20px !important;
    }
    [width="123.5"] {
        width: 250px!important;
    }
    #mainContent > div.q-flex.qu-alignItems--center.qu-flexWrap--wrap > div > span > span > a {
        white-space: nowrap !important;
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
