// ==UserScript==
// @name                WME Validator Localization for Ireland
// @version             2020.06.17.02
// @author              lsin023
// @description         This script localizes WME Validator for Ireland. You also need main package (WME Validator) installed.
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @grant               none
// @run-at              document-start
// @namespace           https://greasyfork.org/users/15899
// @downloadURL https://update.greasyfork.org/scripts/12559/WME%20Validator%20Localization%20for%20Ireland.user.js
// @updateURL https://update.greasyfork.org/scripts/12559/WME%20Validator%20Localization%20for%20Ireland.meta.js
// ==/UserScript==
//
/*
    *Note: use D at the beginning of RegExp to enable debugging on JS console.
    *Note: do not forget to escape backslashes in strings, i.e. use "\\" instead of "\".
*/

window.WME_Validator_Ireland = {
    ".country": "Ireland",
    ".codeISO": "IE",
    ".author": "lsin023",
    ".updated": "2020-06-17",
    ".link": "TODO: ",
    "27.enabled": true, // City name on Railroad
    "70.enabled": true, // Must be a Freeway
    "70.problemLink": "W:Ireland/Roads#Road_Types",
    "71.enabled": true, // Must be a Major Highway
    "71.problemLink": "W:Ireland/Roads#Road_Types",
    "72.enabled": true, // Must be a Minor Highway
    "72.problemLink": "W:Ireland/Roads#Road_Types",
    "130.enabled": true,
    "130.params": {
        "titleEN": "Incorrectly named street",
        "problemEN": "The street name should be abbreviated.",
        "solutionEN": "Rename the street in accordance with the abbreviation table",
        "template": "${street}",
        "regexp": "/(?!The).{3}\\s(?:Avenue|Close|Court|Crescent|Drive|Lane|Place|Road|Square|Street|Terrace)(?:\\s+(?:Lwr|Upr|[NSWE]|Great|Little|Middle|Extension))?$/"
    },
    "130.problemLink": "W:Ireland/Roads#Abbreviations",
    "131.enabled": true,
    "131.params": {
        "titleEN": "Incorrect abbreviation using . (dot)",
        "problemEN": "Abbreviations should not end in dot, except for St. (Saint)",
        "solutionEN": "Remove the dot from the end of the abbreviation",
        "template": "${street}",
        "regexp": "/(?:(?!St).{2})\\./"
    },
    "131.problemLink": "W:Ireland/Roads#Abbreviations",
    "132.enabled": true,
    "132.params": {
        "titleEN": "Incorrectly named street (Cardinals)",
        "problemEN": "Cardinals North/East/South/West should be abbreviated in suffixes. Prefixes should not.",
        "solutionEN": "Rename the street in accordance with the guidelines",
        "template": "${street}",
        "regexp": "/^[NESW]\\s|\\s(?:North|East|South|West)$/"
    },
    "132.problemLink": "W:Ireland/Roads#Motorways_and_Dual_Carriageways",
    "133.enabled": true,
    "133.params": {
        "titleEN": "Incorrectly abbreviated street name",
        "problemEN": "Abbreviations are not used as suffix.",
        "solutionEN": "Rename the street and abbreviate only suffixes",
        "template": "${street}",
        "regexp": "/(?:^|\\s)(?:Ave|Cl|Ct|Cres|Dr|Ln|Pk|Pl|Rd|Sq|St|Tce)(?!(?:$|\\S|\\s(?:Lwr|Upr|[NSWE]|Great|Little|Middle|Extension)$))/"
    },
    "133.problemLink": "W:Ireland/Roads#Abbreviations",
    "134.enabled": true, // ES2018: Chrome 62+ / Firefox 78+ / Edge 79+ / Opera 49+ required
    "134.params": {
        "titleEN": "Incorrectly named street",
        "problemEN": "Park should be abbreviated.",
        "solutionEN": "Rename the street in accordance with the abbreviation table",
        "template": "${typeRank}:${street}",
        "regexp": "/^(?:[689]|1[0134]):.*(?<!The|Car|Bus|Business|Retail|Industrial|Logistics|Technology|Enterprise|Office|Commercial|National|Forest)\\sPark(?:\\s+(?:Lwr|Upr|[NSWE]|Great|Little|Middle|Extension))?$/"
    },
    "134.problemLink": "W:Ireland/Roads#Abbreviations",
    "135.enabled": true,
    "135.params": {
        "titleEN": "Incorrectly named street",
        "problemEN": "The street name should not contain invalid words.",
        "solutionEN": "Rename the street in accordance with the guidelines",
        "template": "${street}",
        "regexp": "/(?:^|\\s)(?:Local|Parking|Please|Private|Rename|Unknown|Closed)(?:$|\\s)/i"
    },
    "135.problemLink": "W:Ireland/Roads#Abbreviations",
    "136.enabled": true,
    "136.params": {
        "titleEN": "Named Parking Lot Road",
        "problemEN": "Parking lot roads should not be named.",
        "solutionEN": "Unname and/or convert into Parking lot place in accordance with the guidelines",
        "template": "${typeRank}:${street}",
        "regexp": "/^7:(?:.+)/"
    },
    "136.problemLink": "W:Ireland/Roads#Road_Types",
    "160.enabled": true,
    "160.params": {
        "solutionEN": "Rename the street to 'Mxx' or 'Mxx N/S/W/E' or change the road type",
        "regexp": "!/^M[0-9]+(?:\\s[NSWE](?:\\s.*Tunnel)?)?$/"
    },
    "160.problemLink": "W:Ireland/Roads#Road_Types",
    "161.enabled": true,
    "161.params": {
        "solutionEN": "Rename the street to 'Nxx' or 'Nxx Local Name' or change the road type",
        "regexp": "!/^N[0-9]+( .*)?$/"
    },
    "161.problemLink": "W:Ireland/Roads#Road_Types",
    "162.enabled": true,
    "162.params": {
        "solutionEN": "Rename the street to 'Rxxx' or 'Rxxx Local Name' or change the road type",
        "regexp": "!/^R[0-9]+( .*)?$/"
    },
    "162.problemLink": "W:Ireland/Roads#Road_Types",
    "169.enabled": true,
    "169.params": {
        "solutionEN": "Rename the segment in accordance with the guidelines",
        "regexp": "!/^[a-záéíóúA-ZÁÉÍÓÚ0-9\\., &'>(/)-]+$/"
    },
    "169.problemLink": "W:Ireland/Roads#Abbreviations",
    "170.enabled": true, // Irish eclipses
    "170.params": {
        "regexp": "/(?:^|\\s)(?!(?:to|of|na|and?|(?:bP|dT|gC|h[AÁEÉIÍOÓUÚ]|mB|t[AÁS])\\S*)(?:$|\\s))(?:[a-záéíóú].*)(?:$|\\s)/"
    },
    "171.enabled": true,
    "171.params": {
        "regexp": "/(?:^|\\s)(?:Aly|Arc|Bch|Bdwy|Bnd|Btm|Blvd|Brg?|Bdge?|Brks?|Bgs?|Byp|Cswy|Ct[gr]s?|Cirs?|Clfs?|Cors?|Cr[kt]?|Cvs?|Crs[et]|Dl|Ests?|Ext|Flds?|Gdns?|Gtwy|Gl?ns?|Gt|Gr[nv]?s?|Hvn|Hbrs?|Hls?|Hts|Hghts|Hse|Ind|Jctn|Lc?ks?|Lil|Ldg|Lower(?!\\s(?:Rd|St))|Lr|Lwn?|Mls?|Mnrs?|Mdws?|Msn|Mt|N\/A|Orch|Ps?ge|Pde|Pnes?|Plns?|Pl[sz]|Prts?|Private|Qy|Rdge?s?|Rs|Spgs?|Saint|St(?!(?:\\.|$|\\s(?:Lwr|Upr|[NSWE]|Great|Little|Middle|Extension)$))|St[an]|Str|Stret|Ter|Terace|Trce|Tunl|Upper(?!\\s(?:Rd|St))|Ur|Val|Vlys?|Vdct|Vw|Vlgs?|Wl?k|Wls?|Works?|Xing|Xrd|Nth|Est|Sth|Wst)(?:$|\\s)/i"
    },
    "171.problemLink": "W:Ireland/Roads#Abbreviations",
    "258.enabled": false, // Place: Is it a Point?
    "271.enabled": false  // Place: Parking Cost Type?
};