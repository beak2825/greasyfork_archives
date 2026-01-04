// ==UserScript==
// @name GreasyFork Header Style Fix
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description To fix GreasyFork Header Style
// @author CY Fung
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.greasyfork.org/*
// @downloadURL https://update.greasyfork.org/scripts/473269/GreasyFork%20Header%20Style%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/473269/GreasyFork%20Header%20Style%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Insert code here... */
    html {
        --main-header-scale: 1.0;
    }

    #site-nav {
        font-size: min(16px, calc(20px * var(--main-header-scale)));
    }

    #site-name {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        margin: 0;
    }
    #site-name-text h1 {

        font-size: calc(38pt * var(--main-header-scale));
        white-space: nowrap;
        margin: 0;
    }

    #site-name-text {
        margin: 0;
    }

    #main-header > .width-constraint:only-child {
        display: flex;
        place-items: center;
        padding-top: calc(8px * var(--main-header-scale));
        padding-bottom: calc(8px * var(--main-header-scale));
        padding-right: calc(24px * var(--main-header-scale));
        padding-left: calc(24px * var(--main-header-scale));
        flex-direction: row;
        margin: 0;
    }
    #site-nav > nav,
    #nav-user-info {
        position: static;
        margin: 0;
    }

    #site-nav {

        display: flex;
        row-gap: 4px;
        flex-direction: column;
        margin: 0;
    }
    #main-header > .width-constraint:only-child > #site-nav:last-child {
        flex-grow: 1;
        margin: 0;
    }

    html #site-name img {
        width: calc(58px * var(--main-header-scale));
        height: calc(58px * var(--main-header-scale));
        margin: 0;
    }


    @media screen and (max-width: 768px) {

        html {
            --main-header-scale: 0.74;
        }
    }



    @media screen and (max-width: 672px) {

        html {
            --main-header-scale: 0.62;
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
