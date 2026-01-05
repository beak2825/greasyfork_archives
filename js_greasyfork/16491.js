// ==UserScript==
// @name           Boursorama - compte/mouvements - ajoute bilan entrees/sorties
// @version        1.2
// @namespace      nil
// @author         nil
// @grant          none
// @description    [FR] affiche le total des entrées sorties sur la page de mouvement des comptes
// @include        https://clients.boursorama.com/compte/cav/*/mouvements
// @include        https://clients.boursorama.com/compte/cav/*/mouvements?*
// @include        https://clients.boursorama.com/budget/mouvements*
// @downloadURL https://update.greasyfork.org/scripts/16491/Boursorama%20-%20comptemouvements%20-%20ajoute%20bilan%20entreessorties.user.js
// @updateURL https://update.greasyfork.org/scripts/16491/Boursorama%20-%20comptemouvements%20-%20ajoute%20bilan%20entreessorties.meta.js
// ==/UserScript==

function init_showInAndOut() {
  var ul = null, ul_cp, collection;
   
  collection = document.getElementsByClassName("list__movement__line--amount");
  if (0 === collection.length) {
    console.log("Warn1: Userscript showInAndOut probably needs to be updated");
    // let's try again in 1 sec
    window.setTimeout(init_showInAndOut, 1000);
    return;
  }
        
  collection = document.getElementsByClassName("summary__numbers");
  for (var elt, i=0; elt = collection.item(i); i++) {
    if ('UL' !== elt.nodeName)
      continue;
    ul = elt;
    break;
  }

  if (null === ul) {
    alert("Err2: ul.summary__numbers not found\n\n"+str_movements);
    return;
  }

  var ul_cp = ul.cloneNode(false);
  ul_cp.id = "showInAndOut";
  ul.parentNode.insertBefore(ul_cp, ul.nextSibling);
  
  function formatNumberToPrettyDecimal(num) {
    // at least 3 characters (pad with 0)
    num_str = num.toString().replace(/^[+-]?/, '$&000');
    // make it decimal (:100), and remove unnecessary leading zero
    num_str = num_str.replace(/\d\d$/, ',$&').replace(/^([+-]?)0{1,3}([^,])/, '$1$2');
    // space it a little bit
    num_str = num_str.replace(/(\d)(\d\d\d),/, '$1 $2,');
    // prefix it with a + if not negative
    num_str = num_str.replace(/^[^-]/, '+$&');
    return num_str;
  }
  
  function refresh_showInAndOut() {
    var str_movements, fromDate, toDate, period;
    var collection, resulting_movement, resulting_movement_str;
    var totalIN = 0, totalOUT = 0, nbIN = 0, nbOUT = 0;
    var totalIN, totalOUT, totalIN_str, totalOUT_str;
    var ul = document.getElementById("showInAndOut"), ul_innerHTML;
    if (!ul) {
      console.log("#showInAndOut not found")
      return;
    }
    var collection = document.getElementsByClassName("list__movement__line--amount");
    var re = /\blist__movement__line--amount__split\b/
    for (var elt, i=0; elt = collection.item(i); i++) {
      // skip details for split operations
      if (null !== elt.className.match(re)){
        continue;
      }
      // remove coma (like doing * 100)
      amount = parseFloat(elt.textContent.replace(/\s+€?/g, '').replace(',', ''));
      if(amount >= 0) {
        totalIN += amount;
        nbIN++;
      } else {
        totalOUT += amount;
        nbOUT++;
      }
    }
    
    str_movements = "in: " + totalIN + " €, out: " + totalOUT + " €";
    fromDate = document.getElementById("movementSearch_fromDate").value;
    toDate = document.getElementById("movementSearch_toDate").value;
    if (0 < fromDate.length)
      period = "sur la période<br> du " + fromDate + " au " + toDate;
    else
      period = "sur un mois glissant";

    resulting_movement = totalIN + totalOUT;
    resulting_movement_str = formatNumberToPrettyDecimal(resulting_movement);
    totalIN_str = formatNumberToPrettyDecimal(totalIN);
    totalOUT_str = formatNumberToPrettyDecimal(totalOUT);
    ul_innerHTML = "<li class='summary__number " + (resulting_movement >= 0.0 ? "positive" : "negative") + "'>";
    ul_innerHTML += "<h4 class='summary__title'>Mouvement résultant " + period + "</h4><h3 class='summary__value'>"+ resulting_movement_str + " <sup>€</sup></h3></li>";
    ul_innerHTML += "<li class='summary__number positive'><h4 class='summary__title'>Total des " + nbIN + " entrées</h4><h3 class='summary__value'>" + totalIN_str + " <sup>€</sup></h3></li>";
    ul_innerHTML += "<li class='summary__number negative'><h4 class='summary__title'>Total des " + nbOUT + " sorties</h4><h3 class='summary__value'>" + totalOUT_str + " <sup>€</sup></h3></li>";
    ul.innerHTML = ul_innerHTML;
  }

  refresh_showInAndOut();
  // force refresh on click
  ul_cp.addEventListener('click', refresh_showInAndOut, false);
  window.setInterval(refresh_showInAndOut, 30000);
}

window.addEventListener('load', init_showInAndOut);
