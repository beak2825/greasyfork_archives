// ==UserScript==
// @name ShowSilhouette - By Isilin
// @namespace github.com/openstyles/stylus
// @version 1.0.2
// @description Version originale de ShowSilhouette, adaptée pour Dreadcast 4.7.
// @author Isilin
// @grant GM_addStyle
// @run-at document-start
// @match https://www.dreadcast.net/Main
// @downloadURL https://update.greasyfork.org/scripts/415259/ShowSilhouette%20-%20By%20Isilin.user.js
// @updateURL https://update.greasyfork.org/scripts/415259/ShowSilhouette%20-%20By%20Isilin.meta.js
// ==/UserScript==

(function() {
let css = `
    .inventaire_content .personnage_image {
        top: 10% !important;
        left: 20% !important;
    }
    
    /* Implant */
    .inventaire_content .zone_case-2 {
    	left: 60% !important;
        top: 1% !important;
    }
    
    /* Equipement */
    /* Tête */
    .inventaire_content .zone_case1 {
    	left: 0% !important;
        top: 1% !important;
    }
    /* Buste */
    .inventaire_content .zone_case5 {
    	left: 0% !important;
        top: 21% !important;
    }
    /* Jambes */
    .inventaire_content .zone_case-1 {
    	left: 0% !important;
        top: 41% !important;
    }
    /* Pieds */
    .inventaire_content .zone_case6 {
    	left: 0% !important;
        top: 61% !important;
    }
    /* Secondaire */
    .inventaire_content .zone_case2 {
    	left: 60% !important;
        top: 61% !important;
    }
    
    /* Armes */
    .inventaire_content .zone_case3 {
    	left: 60% !important;
        top: 21% !important;
    }
    .inventaire_content .zone_case4 {
    	left: 60% !important;
        top: 41% !important;
    }
    
    /* Sacs */
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
    
    /* RP */
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
    
    /* Utils */
    .inventaire_content #ciseauxInventaire {
        right: 10.5% !important;
    }
    
    .inventaire_content #poubelleInventaire {
        right: 10.5% !important;
    }
    
    .inventaire_content #statsInventaire {
        right: 2.5% !important;
    }
    
    .inventaire_content #stockInventaire {
        right: 2.5% !important;
    }
    
    /* Fiche RP */
    .flipmobile-card-front .inventaire {
        left: 12.5% !important;
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
