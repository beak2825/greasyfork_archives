// ==UserScript==
// @name         PH! kalkulátor
// @namespace    http://prohardver.hu/tag/ursache.html
// @version      0.4
// @description  A felhasználói adatlapokon kiszámolódik a következő ranghoz szükséges HSZ-ek száma, és a következő rang is.
// @author       Ursache
// @include      /^https://(prohardver|itcafe|gamepod|logout|mobilarena)\.hu/tag/*/
// @downloadURL https://update.greasyfork.org/scripts/10018/PH%21%20kalkul%C3%A1tor.user.js
// @updateURL https://update.greasyfork.org/scripts/10018/PH%21%20kalkul%C3%A1tor.meta.js
// ==/UserScript==

//PH! által megadott súlyok
const szakmai_suly = 1;
const kozossegi_suly = 0.25;
const piaci_suly = 0.1;

//PH! által megadott rangok és határaik
const rangok = ["újonc", "lelkes újonc", "kvázi-tag", "tag", "fanatikus tag", "senior tag", "őstag", "PH! addikt", "PH! kedvence", "PH! nagyúr", "PH! félisten", "Jómunkásember"];
const hatarok = [0, 50, 100, 200, 400, 800, 1750, 3500, 6000, 10000, 17000, 25000];
const napok = [0, 15, 30, 60, 100, 180, 270, 365, 450, 600, 850, 1100];

//A regnapokat egyszerűbb "lekérni" reguláris kifejezéssel
const pattern = /, azaz [0-9]+ napja - /;

var sulyozott = getWeightedComment();
var result = document.body.textContent.match(pattern);
var regnapok = parseInt(result[result.length-1].split(' ')[2]);

var j;
for (j = 0; sulyozott >= hatarok[j] && j < hatarok.length; j++);

var rang_header = "<br><h1>Következő rang: " + rangok[j] + "</h1>";
var rang_p = "<p>" + (hatarok[j] - sulyozott) + " db hozzászólás kell a következő rangodhoz.</p>";
var nap_p = "<p>" + Math.max(napok[j] - regnapok, 0) + " nap kell a következő rangodhoz.</p>";

if (j == hatarok.length)
{
    rang_header = "<br>";
    rang_p = "<h1>Gratulálok, elérted a legnagyobb rangot!</h1>";
    nap_p = "";
}

var div = document.createElement("div");
div.innerHTML = rang_header;
div.innerHTML += rang_p;
div.innerHTML += nap_p;
//document.body.childNodes[1].childNodes[1].appendChild(div);
document.getElementsByClassName("full inline center")[0].appendChild(div);

function getWeightedComment()
{
    var as = document.getElementsByClassName("tiny");
    var szakmai = parseInt(as[0].childNodes[3].textContent);
    szakmai = isNaN(szakmai)? 0 : szakmai;
    var kozossegi = parseInt(as[1].childNodes[3].textContent);
    kozossegi = isNaN(kozossegi)? 0 : kozossegi;
    var piaci = parseInt(as[2].childNodes[3].textContent);
    piaci = isNaN(piaci)? 0 : piaci;
    return parseInt(szakmai_suly * szakmai + kozossegi_suly * kozossegi + piaci_suly * piaci);
}
