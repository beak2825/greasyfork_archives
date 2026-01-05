// ==UserScript==
// @name        stats-improvements
// @description Drobne poprawki do statystyk Waze publikowanych przez mousepl
// @namespace   pl.one.mouse.statystyki
// @include     http://statystyki.mouse.one.pl/v1.0/
// @version     1.0
// @grant       none
// @author      FZ69617
// @downloadURL https://update.greasyfork.org/scripts/12640/stats-improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/12640/stats-improvements.meta.js
// ==/UserScript==


console.log("stats-improvements v1.0 started");


function sortCities() {
  var middle = document.getElementById("middle");
  var box = middle.firstChild;
  
  var chunks = [];
  
  while (box.childNodes.length >= 3) {
    var l = box.childNodes.length;
    var chunk = [ box.childNodes[l - 3], box.childNodes[l - 2], box.childNodes[l - 1] ];
    if (chunk[0].tagName === "DIV" && chunk[1].tagName === "A" && chunk[2].tagName === "P") {
      chunks.push(chunk);
      chunk.forEach(function (e) { e.remove(); });
    } else {
      break;
    }
  }

  var stats_expr = /(\d+).*\|.*(\d+).*\|.*(\d+)/;
  var name_expr = /h2>(.*)</;
      
  chunks.sort(function (a, b) {
    var ar = stats_expr.exec(a[2].innerHTML);
    var br = stats_expr.exec(b[2].innerHTML);
    var cr = br[1] - ar[1];
    if (cr) return cr;
    cr = br[2] - ar[2];
    if (cr) return cr;
    var an = name_expr.exec(a[0].innerHTML)[1];
    var bn = name_expr.exec(b[0].innerHTML)[1];
    return an.localeCompare(bn);
  });
  
  chunks.forEach(function (chunk) {
    chunk.forEach(function (e) { box.appendChild(e); });
  });
}


document.body.style =
document.getElementById("outside").style =
document.getElementById("middle").style =
  "background-color: white; border: white;";


sortCities();
