// ==UserScript==
// @name IAFD Layout
// @namespace https://github.com/peolic
// @version 0.1.9
// @description iafd.com improvements
// @author peolic
// @homepageURL https://gist.github.com/peolic/9e2981a8a14a49b9626cb277f878b157
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.iafd.com/*
// @downloadURL https://update.greasyfork.org/scripts/498189/IAFD%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/498189/IAFD%20Layout.meta.js
// ==/UserScript==

(function() {
let css = `
    /*********************************
     * iafd.com styling improvements *
     *********************************/

    /**
     * Title pages
     */

    /* Fade-out NonSex performers */
    .castbox.nonsex {
        opacity: 0.6;
        transition: opacity .15s linear;
    }
    .castbox.nonsex:hover {
        opacity: unset;
    }

    /* Place NonSex performers after "Sex" performers */
    .padded-panel > .row > .col-sm-12 {
        display: flex;
        flex-wrap: wrap;
    }
    .castbox {
        float: unset;
    }
    .castbox.nonsex {
        order: 1;
    }

    /* Fix castbox styling */
    .castbox {
        margin-left: 0;
    }
    .castbox img.headshot {
        margin-left: -14px;
    }

    /* Improve scene breakdowns styling */
    #sceneinfo table td:first-of-type {
        padding: 8px;
        width: 5.5em;
    }

    /**
     * Correction pages
     */

    /* Correction confirmation text width */
    #cd .texty {
        width: unset;
    }

    /**
     * Person update pages
     */

    /* Fix person update pages on small screens */
    @media (max-width: 390px) {
        .headshotrow {
            padding-top: 0;
            padding-bottom: 0;
            --min-height: calc(46vw / 0.85);
        }
        .headshotrow > div {
            min-height: calc(var(--min-height) + 4em);
            padding: 0.5em;
        }
        .headshotrow:has(.pictag > br) > div {
            min-height: calc(var(--min-height) + 5.5em);
        }
        .headshotrow > div img {
            width: 46vw;
            height: auto;
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
