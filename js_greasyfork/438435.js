// ==UserScript==
// @name	Big In Japan - Hide shipped order
// @match     https://*.biginjap.com/*/order-history
// @match     https://*.biginjap.com/*/historique-des-commandes
// @description        Hide shipped order
// @description:zh-TW  Cache les commandes déja expédiées
// @version  1
// @grant    none
// @author Nemotaku
// @namespace nemotaku.biginjapan
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438435/Big%20In%20Japan%20-%20Hide%20shipped%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/438435/Big%20In%20Japan%20-%20Hide%20shipped%20order.meta.js
// ==/UserScript==
Array.from(document.getElementsByClassName("history_state")).forEach (
  e => { 
		if(e.innerHTML == "Votre commande a ete expediee" || e.innerHTML == "Your order has shipped" ) e.parentNode.style.display = "none";
})
