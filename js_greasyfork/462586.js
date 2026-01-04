// ==UserScript==
// @name         Messages for Web Location Linker
// @namespace    https://fxzfun.com/userscripts
// @version      0.4
// @description  Converts locations in messages to a link to maps
// @author       FXZFun
// @match        https://messages.google.com/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=messages.google.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/462586/Messages%20for%20Web%20Location%20Linker.user.js
// @updateURL https://update.greasyfork.org/scripts/462586/Messages%20for%20Web%20Location%20Linker.meta.js
// ==/UserScript==

/* global trustedTypes */

(function() {
    'use strict';

    const stateAbbreviations = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    const streetSuffixes = [ "alley", "aly", "annex", "anx", "arcade", "arc", "avenue", "ave", "bayoo", "byu", "beach", "bch", "bend", "bnd", "bluff", "blf", "bluffs", "blfs", "bottom", "btm", "boulevard", "blvd", "branch", "br", "bridge", "brg", "brook", "brk", "brooks", "brks", "burg", "bg", "burgs", "bgs", "bypass", "byp", "camp", "cp", "canyon", "cyn", "cape", "cpe", "causeway", "cswy", "center", "ctr", "centers", "ctrs", "circle", "cir", "circles", "cirs", "cliff", "clf", "cliffs", "clfs", "club", "clb", "common", "cmn", "corner", "cor", "corners", "cors", "course", "crse", "court", "ct", "courts", "cts", "cove", "cv", "coves", "cvs", "creek", "crk", "crescent", "cres", "crest", "crst", "crossing", "xing", "crossroad", "xrd", "curve", "curv", "dale", "dl", "dam", "dm", "divide", "dv", "drive", "dr", "drives", "drs", "estate", "est", "estates", "ests", "expressway", "expy", "extension", "ext", "extensions", "exts", "fall", "fall", "falls", "fls", "ferry", "fry", "field", "fld", "fields", "flds", "flat", "flat", "flats", "flts", "ford", "frd", "fords", "frds", "forest", "frst", "forge", "frg", "forges", "frgs", "fork", "frk", "forks", "frks", "fort", "ft", "freeway", "fwy", "garden", "gdn", "gardens", "gdns", "gateway", "gtwy", "glen", "gln", "glens", "glns", "green", "grn", "greens", "grns", "grove", "grv", "groves", "grvs", "harbor", "hbr", "harbors", "hbrs", "haven", "hvn", "heights", "hts", "highway", "hwy", "hill", "hl", "hills", "hls", "hollow", "holw", "inlet", "inlt", "island", "is", "islands", "iss", "isle", "isle", "junction", "jct", "junctions", "jcts", "key", "ky", "keys", "kys", "knoll", "knl", "knolls", "knls", "lake", "lk", "lakes", "lks", "land", "lndg", "landing", "lndg", "lane", "ln", "light", "lgt", "lights", "lgts", "loaf", "lf", "lock", "lck", "locks", "lcks", "lodge", "ldg", "loop", "loop", "mall", "mall", "manor", "mnr", "manors", "mnrs", "meadow", "mdw", "meadows", "mdws", "mews", "mews", "mill", "ml", "mills", "mls", "mission", "msn", "motorway", "mtwy", "mount", "mt", "mountain", "mtn", "mountains", "mtns", "neck", "nck", "orchard", "orch", "oval", "oval", "overpass", "opas", "park", "park", "parks", "park", "parkway", "pkwy", "parkways", "pkwy", "pass", "pass", "passage", "psge", "path", "path", "pike", "pike", "pine", "pne", "pines", "pnes", "place", "pl", "plain", "pln", "plains", "plns", "plaza", "plz", "point", "pt", "points", "pts", "port", "prt", "ports", "prts", "prairie", "pr", "radial", "radl", "ramp", "ramp", "ranch", "rnch", "rapid", "rpd", "rapids", "rpds", "rest", "rst", "ridge", "rdg", "ridges", "rdgs", "river", "riv", "road", "rd", "roads", "rds", "route", "rte", "row", "row", "rue", "rue", "run", "run", "shoal", "shl", "shoals", "shls", "shore", "shr", "shores", "shrs", "skyway", "skwy", "spring", "spg", "springs", "spgs", "spur", "spur", "spurs", "spur", "square", "sq", "squares", "sqs", "station", "sta", "stravenue", "stra", "stream", "strm", "street", "st", "streets", "sts", "summit", "smt", "terrace", "ter", "throughway", "trwy", "trace", "trce", "track", "trak", "trafficway", "trfy", "trail", "trl", "tunnel", "tunl", "turnpike", "tpke", "underpass", "upas", "union", "un", "unions", "uns", "valley", "vly", "valleys", "vlys", "viaduct", "via", "view", "vw", "views", "vws", "village", "vlg", "villages", "vlgs", "ville", "vl", "vista", "vis", "walk", "walk", "walks", "walk", "wall", "wall", "way", "way", "ways", "ways", "well", "wl", "wells", "wls" ];
    const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", { createHTML: (to_escape) => to_escape })
    let messages;

    function linkLocations() {
        messages = document.querySelectorAll(".text-msg-content");

        [...messages].forEach(message => {
            let result = message.innerText.match(/([0-9]+) *([\w\s]*)(,*) *([\w\s]*)(,*) *([\w]*) *([0-9]*)*/);
            let street = result?.[2].split(" ");
            if (result && !isNaN(parseInt(result[1])) && (streetSuffixes.includes(street?.[street.length-1]?.toLowerCase()) || streetSuffixes.includes(street?.[street.length-2]?.toLowerCase())) && stateAbbreviations.includes(result[6]) && (!result[7] || result[7].length === 5)) {
                // standard format
                message.innerHTML = escapeHTMLPolicy.createHTML(message.innerHTML.replace(result[0], `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result[0])}" target="_blank">${result[0]}</a>`));
            } else if (result && !isNaN(parseInt(result[1])) && !!result[2] && (streetSuffixes.includes(street?.[street.length-1]?.toLowerCase()) || streetSuffixes.includes(street?.[street.length-2]?.toLowerCase())) && !result[3] && !result[4] && !result[5] && !result[6] && !result[7]) {
                // only hn and street
                message.innerHTML = escapeHTMLPolicy.createHTML(message.innerHTML.replace(result[0], `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(result[0])}" target="_blank">${result[0]}</a>`));
            } else if (message.innerText.match(/(^|\s)([23456789CFGHJMPQRVWX]{4,6}\+[23456789CFGHJMPQRVWX]{2,3})([\s]|$)?/i)) {
                message.innerHTML = escapeHTMLPolicy.createHTML(`<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(message.innerText)}" target="_blank">${message.innerText}</a>`);
            }
        });
    }

    let interval = setInterval(() => {
        if (!!document.querySelector(".text-msg-content")) {
            clearInterval(interval);
            window.linkLocations = linkLocations;
            setInterval(linkLocations, 1000);
        }
    }, 500);
})();
