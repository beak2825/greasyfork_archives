// ==UserScript==
// @name Show Silhouette Valion
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description Version alternative du show Silhouette
// @author Valion
// @grant GM_addStyle
// @run-at document-start
// @match https://www.dreadcast.net/Main
// @downloadURL https://update.greasyfork.org/scripts/415246/Show%20Silhouette%20Valion.user.js
// @updateURL https://update.greasyfork.org/scripts/415246/Show%20Silhouette%20Valion.meta.js
// ==/UserScript==

(function() {
let css = `
    .inventaire_content .personnage_image {
        top: 10% !important;
        left: 20% !important;
    }

    .inventaire_content .zone_case-2 {
        left: 60% !important;
        top: 61% !important;
        filter: brightness(50%);
    }

    .inventaire_content .zone_case1 {
        left: 0% !important;
        top: 1% !important;
    }

    .inventaire_content .zone_case5 {
        left: 0% !important;
        top: 21% !important;
    }

    .inventaire_content .zone_case-1 {
        left: 0% !important;
        top: 41% !important;
    }

    .inventaire_content .zone_case6 {
        left: 0% !important;
        top: 61% !important;
    }

    .inventaire_content .zone_case2 {
        left: 60% !important;
        top: 1% !important;
    }

    .inventaire_content .zone_case3 {
        left: 60% !important;
        top: 21% !important;
    }

    .inventaire_content .zone_case4 {
        left: 60% !important;
        top: 41% !important;
    }

    .inventaire_content .zone_case7 {
        top: 1% !important;
        right: 2.5% !important;
    }
    .inventaire_content .zone_case8 {
        top: 21% !important;
        right: 2.5% !important;
    }
    .inventaire_content .zone_case9 {
        top: 41% !important;
        right: 2.5% !important;
    }

    .inventaire_content .zone_case10 {
        left: 0% !important;
        top: -2000% !important;
    }

    .inventaire_content .zone_case11 {
        left: 20% !important;
        top: -2000% !important;
    }

    .inventaire_content .zone_case12 {
        left: 40% !important;
        top: -2000% !important;
    }

    .inventaire_content .zone_case13 {
        left: 60% !important;
        top: -2000% !important;
    }

    .inventaire_content #ciseauxInventaire {
        right: 6% !important;
        top: 76%;
    }

    .inventaire_content #poubelleInventaire {
        right: 6% !important;
        top: 88%;
    }

    .inventaire_content #statsInventaire {
        width: 10%;
        right: 6% !important;
        top: 64%;
    }

    .inventaire_content #stockInventaire {
        right: 2.5% !important;
        display: none;
    }

    #annexe_inventaire_ext {
        padding-top: 1%;
    }

    .inventaire {
        margin-left: 8%;
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
