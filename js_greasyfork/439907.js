// ==UserScript==
// @name         NOTAMs GeoHelper
// @namespace    http://notamweb.aviation-civile.gouv.fr/
// @version      1.1.1
// @description  Add Google Maps links to geolocalisation strings on NOTAM from notamweb.aviation-civile.gouv.fr
// @author       Mathieu D.
// @match        https://www.notamweb.aviation-civile.gouv.fr/Script/IHM/Bul_*
// @supportURL   https://gitlab.com/mdaitn/notams-geohelper/-/issues
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439907/NOTAMs%20GeoHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/439907/NOTAMs%20GeoHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', (event) => {
        // radius regex, if usable one day... -> (?<Radius>[0-9]{3})*
        const regex = /(?<LatDeg>[0-9]{2})(?<LatMin>[0-9]{2})(?:\'{1})*(?<LatSec>[0-9]{2})*(?<LatDec>(\.|\,)[0-9]{0,3})*(?:\'{2})*(?<NorthSouth>[NS]{1})(?: -)*(?:\s{1})*(?<LonDeg>[0-9]{3})(?<LonMin>[0-9]{2})(?:\'{1})*(?<LonSec>[0-9]{2})*(?<LonDec>(\.|\,)[0-9]{0,3})*(?:\'{2})*(?<EastWest>[EW]{1})/gm;
        const regexReplace = "<a href=\"https://google.com/maps/place/$<LatDeg>%C2%B0$<LatMin>'$<LatSec>$<LatDec>%22$<NorthSouth>+$<LonDeg>%C2%B0$<LonMin>'$<LonSec>$<LonDec>%22$<EastWest>\" target=\"_blank\" rel=\"noopener noreferrer\">URL<\/a>"
        const els = document.body.getElementsByClassName("NOTAM-CORPS");

        for(var i = 0, l = els.length; i < l; i++) {
            const el = els[i];
            const str = el.innerHTML;
            if (regex.test(str)) {
                for (const match of str.match(regex)) {
                    el.innerHTML = str.replace(regex, regexReplace).replace(/URL/g, match).replaceAll("'%22", "'0%22");
                }
            }
        }
    });
})();