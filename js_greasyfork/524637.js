// ==UserScript==
// @name        Copia codice salesforce
// @namespace   Salesforce tools
// @match       https://*.my.salesforce-sites.com/tools*
// @grant       none
// @version     1.0
// @author      Fab1can
// @description 15/01/2025, 10:30:50
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524637/Copia%20codice%20salesforce.user.js
// @updateURL https://update.greasyfork.org/scripts/524637/Copia%20codice%20salesforce.meta.js
// ==/UserScript==
function copiaNegliAppunti(testo) {
  navigator.clipboard.writeText(testo).then(() => {
    console.log("Testo copiato negli appunti!");
  }).catch(err => {
    console.error("Errore nella copia:", err);
  });
}
cod=document.getElementById("codice")
cod.style.cursor="copy"
cod.addEventListener('click', (e)=>copiaNegliAppunti(e.target.innerHTML))