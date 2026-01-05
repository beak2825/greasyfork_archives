// ==UserScript==
// @id             f356086e-0c23-4cec-b3d3-e8c12dfd94ad
// @name           page=mouvements:affiche-entrees-sorties
// @version        1.1
// @namespace      nil
// @author         nil
// @description    [FR] affiche le total des entrées sorties sur la page de mouvement des comptes
// @include        https://www.boursorama.com/comptes/banque/detail/mouvements.phtml?*
// @downloadURL https://update.greasyfork.org/scripts/4567/page%3Dmouvements%3Aaffiche-entrees-sorties.user.js
// @updateURL https://update.greasyfork.org/scripts/4567/page%3Dmouvements%3Aaffiche-entrees-sorties.meta.js
// ==/UserScript==

function showInAndOut() {
  totalIN = 0.0;
  totalOUT = 0.0;

  collection = document.getElementsByClassName("amount");
  if (0 === collection.length) {
    alert("Err1: Userscript showInAndOut probably needs to be updated");
    return;
  }

  for (var elt, i=0; elt = collection.item(i); i++) {
    amount = parseFloat(elt.textContent.replace(/\s+/g, '').replace(',', '.'));
    if(-1 !== elt.className.search('pos')) {
      totalIN += amount;
    } else {
      totalOUT += amount;
    }
  }
  total_tr = collection.item(0).parentNode.parentNode.lastElementChild;

  if (-1 === total_tr.className.search('total')) {
    alert("Err2: Userscript showInAndOut probably needs to be updated");
    return;
  }
  
  td_dest = total_tr.firstElementChild;
  td_dest.innerHTML = td_dest.innerHTML.replace('<br>', '<br>Entrées :<span class=pos> +' + totalIN.toFixed(2) +" EUR</span><br>Sorties : <span class=neg>" + totalOUT.toFixed(2) + " EUR</span><br>");
}

document.addEventListener('DOMContentLoaded', showInAndOut);

