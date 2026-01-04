// ==UserScript==
// @name spiegel.de: Entferne Plus Links mit Icon aus Artikel-Texten
// @description erhält den im Link enthaltenen Text
// @namespace   https://greasyfork.org/en/forum/profile/5767/LittlePluto
// @match       *://www.spiegel.de/*.html
// @match       *://www.spiegel.de/*.html#*
// @exclude-match     *://www.spiegel.de/forum/votes/a-589480.html
// @exclude-match     *://www.spiegel.de/*/archiv*.html
// @exclude-match     *://www.spiegel.de/fotostrecke/*.html
// @exclude-match     *://www.spiegel.de/nachrichtenarchiv/*
// @exclude-match     *://www.spiegel.de/video/*
// @exclude-match     *://www.spiegel.de/forum/*
// @exclude-match     *://www.spiegel.de/international/*
// @noframes
// @grant none
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/388304/spiegelde%3A%20Entferne%20Plus%20Links%20mit%20Icon%20aus%20Artikel-Texten.user.js
// @updateURL https://update.greasyfork.org/scripts/388304/spiegelde%3A%20Entferne%20Plus%20Links%20mit%20Icon%20aus%20Artikel-Texten.meta.js
// ==/UserScript==

//Beispielseite https://www.spiegel.de/panorama/justiz/charles-manson-villa-tatort-zweier-sekten-morde-wird-fuer-zwei-millionen-verkauft-a-1279485.html
//entfernt auch aus nicht-Fließtext: https://www.spiegel.de/wissenschaft/mensch/rauchen-tabakkonzerne-ziehen-neue-suechtige-heran-a-1279912.html
// Beispiel für lp-text-link-int: https://www.spiegel.de/einestages/ersatz-religion-jugendweihe-in-der-ddr-und-heute-in-ostdeutschland-a-1280724.html
// Unterschied zu lp-text-link-ext unbekannt

var links = document.querySelectorAll("a.text-link.lp-text-link-ext.article-icon.spplus, a.text-link.lp-text-link-int.article-icon.spplus");
//if (links.length >0){
  //alert(links.length + " plus links");
//}
for (var link of links){
  link.replaceWith(...link.childNodes);
  //console.log("entferne Plus Link", link);
  
}