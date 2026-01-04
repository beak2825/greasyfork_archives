// ==UserScript==
// @name         eBay FR - Anti Hub Vendeur
// @namespace    eBay_FR_AHV
// @version      2.0
// @description  Permet d'éviter le nouveau "Hub Vendeur" de eBay
// @author       Micdu70
// @match        https://www.ebay.fr/sh*
// @match        https://*.ebay.fr/sh*
// @match        http://www.ebay.fr/sh*
// @match        http://*.ebay.fr/sh*
// @exclude      https://www.ebay.fr/ship*
// @exclude      https://*.ebay.fr/ship*
// @exclude      http://www.ebay.fr/ship*
// @exclude      http://*.ebay.fr/ship*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/413225/eBay%20FR%20-%20Anti%20Hub%20Vendeur.user.js
// @updateURL https://update.greasyfork.org/scripts/413225/eBay%20FR%20-%20Anti%20Hub%20Vendeur.meta.js
// ==/UserScript==

function AntiHubVendeur() {
    var newurl = 'https://www.ebay.fr/mys/active/rf/container_sort=TIME_LEFT_ENDING_SOONEST&container_filter=ALL&container_limit=25';
    window.location.replace(newurl);
}

AntiHubVendeur();