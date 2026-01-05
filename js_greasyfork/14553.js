// ==UserScript==
// @name                WME Validator Localization for the Southeast region
// @namespace           https://greasyfork.org/users/6605
// @version             1.1.16.1
// @author              crazycaveman
// @description         This script localizes WME Validator for the Southeast region, USA. You also need main package (WME Validator) installed.
// @match               https://beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @exclude             https://*.waze.com/*user/editor/*
// @grant               none
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/14553/WME%20Validator%20Localization%20for%20the%20Southeast%20region.user.js
// @updateURL https://update.greasyfork.org/scripts/14553/WME%20Validator%20Localization%20for%20the%20Southeast%20region.meta.js
// ==/UserScript==
//
/*
  See Settings->About->Available checks for complete list of checks and their params.

  Examples:

  Enable #170 "Lowercase street name" but allow lowercase "exit" and "to":
    "170.enabled": true,
    "170.params": {
        "regexp": "/^((exit|to) )?[a-z]/",
    "},

  Enable #130 "Custom check" to find a dot in street names, but allow dots at Ramps:
    "130.enabled": true,
    "130.params": {
        "titleEN": "Street name with a dot",
        "problemEN": "There is a dot in the street name (excluding Ramps)",
        "solutionEN": "Expand the abbreviation or remove the dot",
        "template": "${type}:${street}",
        "regexp": "D/^[^4][0-9]?:.*\\./",
    },
    *Note: use D at the beginning of RegExp to enable debugging on JS console.
    *Note: do not forget to escape backslashes in strings, i.e. use "\\" instead of "\".
*/

window.WME_Validator_United_States = {
  ".country": "United States",
  ".codeISO": "US",
  ".author": "crazycaveman",
  ".updated": "2016-03-30",
  ".link": "https://greasyfork.org/en/scripts/14553-wme-validator-localization-for-the-southeast-region",
  
  //Default US checks
  "27.enabled": true,
  "90.enabled": true,
  "106.enabled": true,
  "112.enabled": false,
  "150.enabled": true,
  "150.params": {"n": 2},
  "170.enabled": true,
  "170.params": {
    "regexp": "/^(?!(to) [^a-z])((S|N|W|E) )?[a-z]/",
  },
  //  #171 ## Check for improper use of a period (.) that is not on the USA
  //          recommended abbreviations list (PesachZ)
  "171.enabled": true,
  "171.solutionLink": "W:Abbreviations_and_acronyms/USA#Standard_suffix_abbreviations",
  "171.params": {
    "regexp": "/((?!(\\bPhila|\\bPenna|.(\\bWash|\\bCmdr|\\bProf|\\bPres)|..(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|...(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|...(#| )[NEWSR])).{5}\\.|((?!(hila|enna|(\\bWash|\\bCmdr|\\bProf|\\bPres)|.(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|..(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|..(#| )[NEWSR])).{4}|(\\bhila|\\benna))\\.|((?!(ila|nna|(ash|mdr|rof|res)|(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|.(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|.(#| )[NEWSR])).{3}|\\b(ila|nna|ash|mdr|rof|res))\\.|((?!(la|na|(sh|dr|of|es)|(dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl)|(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|(#| )[NEWSR])).{2}|\\b(la|na|sh|dr|of|es|dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl))\\.|(#|^)[^NEWSR]?\\.)|(((?!\\b(D|O|L)).|#|^)\'(?![sl]\\b)|(#|^)\'s|(?!\\b(In|Na)t).{3}\'l|(#|^).{0,2}\'l)|(Dr|St)\\.(#|$)|,|;|\\\\|((?!\\.( |#|$|R))\\..|(?!\\.( .|#.|$|R\\.))\\..{2}|\\.R(#|$|\\.R))|[Ee]x(p|w)y\\b|\\b[Ee]x[dn]\\b|Tunl\\b|Long Is\\b|Brg\\b/",
    "problemEN": "The street name has incorrect abbreviation, or character",
    "solutionEN": "Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table. Remove any comma (,), backslash (\\), or semicolon (;)"
  },

  //"57.enabled": true,   //City name on ramp
  "59.enabled": true,   //City name on freeway
  "130.enabled": true,
  "130.params": {
    "titleEN": "Wrong name for state highway",
    "problemEN": "All state highways should be named SR-### in the Southeast region",
    "solutionEN": "Change name to SR-### (if it is truly a state highway)",
    "template": "${state}:#${street}#${altStreet[#]}",
    "regexp": "/^(Alabama|Florida|Georgia):.*\\b(State (Hwy|R(ou)?te)|SH-)\\b/i"
  },
  "130.solutionLink": "W:Highway_naming/USA",
  "131.enabled": true,
  "131.params": {
    "titleEN": "Wrong road type",
    "problemEN": "All US Highways should be at least Major Highway (except BUS, SPUR, LOOP)",
    "solutionEN": "Change the road type to Major Highway",
    "template": "${typeRank}:#${street}@#${altStreet[@#]}@",
    "regexp": "/^[1-9][^245]?:.*#(US Hwy |US-)[0-9]+( ALT| BYP| CONN| TRUCK| Scenic| [NSWE])*@/i"
  },
  "131.solutionLink": "W:Road_types/USA#Major_Highway",
  "132.enabled": true,
  "132.params": {
    "titleEN": "Wrong road type",
    "problemEN": "All US BUS, SPUR, LOOP highways and State Highways (except BUS, SPUR, LOOP) should be at least Minor Highway type",
    "solutionEN": "Change the road type to Minor Highway",
    "template": "${typeRank}:#${street}@#${altStreet[@#]}@",
    "regexp": "/^[1-9][^2-5]:.*#((State Hwy |SR-|SH-|IL-|IN-|K-|LA-|M-|MA-|MO-|MS-|NC-|ND-|NJ-|NV-|NY-|SC-|SD-|TN-|VT-|WIS-)[0-9]+( ALT| BYP| CONN| TRUCK| Scenic| [NSWE])*|(US Hwy |US-)[0-9]+( BUS| LOOP| SPUR)+( [NSWE])?)@/i"
  },
  "132.solutionLink": "W:Road_types/USA#Minor_Highway",
  "133.enabled": true,
  "133.params": {
    "titleEN": "Wrong road type",
    "problemEN": "All State BUS, SPUR, LOOP Highways should be at least Primary Street type",
    "solutionEN": "Change the road type to Primary Street",
    "template": "${typeRank}:#${street}@#${altStreet[@#]}@",
    "regexp": "/^[1-9][^1-5]:.*#(State Hwy |SR-|SH-|IL-|IN-|K-|LA-|M-|MA-|MO-|MS-|NC-|ND-|NJ-|NV-|NY-|SC-|SD-|TN-|VT-|WIS-)[0-9]+( BUS| LOOP| SPUR)+( [NSWE])?@/i"
  },
  "133.solutionLink": "W:Road_types/USA#Primary_Street",
  "134.enabled": true,
  "134.params": {
    "titleEN": "Wrong banner abbreviation",
    "problemEN": "Banner abbreviation may be incorrect. Abbreviations ALT, BUS, BYP, CONN, LOOP, and SPUR should be in ALL CAPS",
    "solutionEN": "Change banner abbreviation to ALT, BUS, BYP, CONN, LOOP, SPUR, or TRUCK",
    "template": "${street}#${altStreet[#]}",
    "regexp": "/[0-9]+[A-Z]? ([Aa]lt(ernate)?|[Bb](us(iness)?|yp(ass)?)|[Cc]onn(ector)?|[Ll]oop|[Ss]pur|[Tt]ruck)/"
  },
  "134.solutionLink": "W:Road_names/USA#United_States_Numbered_Highways",
  "135.enabled": true,  //City name on Ramp
  "135.params": {
    "titleEN": "City name on Ramp",
    "problemEN": "City name on Ramp may affect search results",
    "solutionEN": "In the address properties check the 'None' box next to the city name and then click 'Apply'",
    "template": "${typeRank}#${city}@",
    "regexp": "/12#.+@/"
  },
  "135.problemLink": "F:t=68015",
  "135.solutionLink": "W:Creating_and_Editing_street_segments#Address_Properties",
  "136.enabled": true, //County Roads
  "136.params": {
    "titleEN": "County Road name incorrect",
    "problemEN": "County Road are named CR-## in the SE",
    "solutionEN": "Change name to CR-##",
    "template": "${street}#${altStreet[#]}",
    "regexp": "/(County Road |CR |[Cc][Oo]\s[Rr][Dd][-\s])\d+/"
  },
  "136.solutionLink": "W:USA/Southeast#Road_Segment_Naming",
  //Freeway lock
  "150.enabled": true,
  "150.params": {
    "titleEN": "Incorrect lock on Freeway",
    // {number} minimum lock level
    "n": 5,
  },
  //Major Highway lock
  "151.enabled": true,
  "151.params": {
    "titleEN": "Incorrect lock on Major Highway",
    // {number} minimum lock level
    "n": 5,
  },
  //Minor Highway lock
  "152.enabled": true,
  "152.params": {
    "titleEN": "Incorrect lock on Minor Highway",
    // {number} minimum lock level
    "n": 4,
  },
  //Ramp lock
  "153.enabled": true,
  "153.params": {
    "titleEN": "Incorrect lock on Ramp",
    // {number} minimum lock level
    "n": 5,
  },
  //Primary Street lock
  "154.enabled": true,
  "154.params": {
    "titleEN": "Incorrect lock on Primary Street",
    // {number} minimum lock level
    "n": 3,
  }
};
