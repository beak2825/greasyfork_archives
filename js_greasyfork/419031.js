// ==UserScript==
// @name           OpenCaching.pl -> GC Linkifier
// @version        1.2
// @description    Zamienia numer GC na OC.pl w link
// @description:en Turns the GC number on OC.pl into a link
// @author         Jendrej
// @match          https://opencaching.pl/viewcache.php*
// @grant          none
// @namespace https://greasyfork.org/users/26725
// @downloadURL https://update.greasyfork.org/scripts/419031/OpenCachingpl%20-%3E%20GC%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/419031/OpenCachingpl%20-%3E%20GC%20Linkifier.meta.js
// ==/UserScript==

(function() {
    var divNr = 11, spanNr = 2;
    while (document.querySelector("#viewcache-baseinfo > div.list-of-details > div:nth-child(" + divNr +")").innerHTML.search("Zar") == -1) divNr++;
    while (document.querySelector("#viewcache-baseinfo > div.list-of-details > div:nth-child(" + divNr + ") > span:nth-child(" + spanNr + ")").innerHTML.search("Geocaching") == -1) spanNr++;
    var tekst = document.querySelector("#viewcache-baseinfo > div.list-of-details > div:nth-child(" + divNr + ") > span:nth-child(" + spanNr + ")").innerHTML;
    var geoCode = "GC", i = 46;
    while (tekst.charAt(i) != ')') { geoCode+= tekst.charAt(i); i++; }
    document.querySelector("#viewcache-baseinfo > div.list-of-details > div:nth-child(" + divNr + ") > span:nth-child(" + spanNr + ")").innerHTML = "<a href=\"https://www.geocaching.com/geocache/" + geoCode + "\" target=\"_blank\">" + tekst + "</a>";
})();