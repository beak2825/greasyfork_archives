// ==UserScript==
// @name                WME Validator Idaho Localization
// @version             0.0.1.4
// @description         This script localizes WME Validator for Idaho. You also need main package (WME Validator) installed.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @run-at              document-start
// @namespace           https://greasyfork.org/en/users/29545-matthewstarbuck
// @author              MatthewStarbuck
// @downloadURL https://update.greasyfork.org/scripts/21157/WME%20Validator%20Idaho%20Localization.user.js
// @updateURL https://update.greasyfork.org/scripts/21157/WME%20Validator%20Idaho%20Localization.meta.js
// ==/UserScript==
//

/*
 * 0.1.4 - Minor Tweaks
 */


/*
  See Settings->About->Available checks for complete list of checks and their params.

  Examples:

  Enable #170 "Lowercase street name" but allow lowercase "exit" and "to":
    "170.enabled": true,
    "170.params": {
        "regexp": "/^((exit|to) )?[a-z]/",
    "},

 
    *Note: use D at the beginning of RegExp to enable debugging on JS console.
    *Note: do not forget to escape backslashes in strings, i.e. use "\\" instead of "\".
*/

window.WME_Validator_United_States = {
  ".country": "United States",
  ".codeISO": "US",
  ".author": "MatthewStarbuck",
  ".updated": "2016-06-17",
  ".link": "https://greasyfork.org/en/scripts/",
// Ramp name too long
  "112.enabled": false,
  "112.params": {
  "n": 55,
  },
// Custom Check
  "130.enabled": true,
  "130.params": {
    "titleEN": "Potential Incorrect Abbreviation",
    "problemEN": "Name abbreviation may be incorrect. Alternative routes should be labeled ALT and abbreviations ALT, BUS, BYP, CONN, LOOP, SCN, SPUR, or TRUCK should be in ALL CAPS",
    "solutionEN": "Change abbreviation to ALT, BUS, BYP, CONN, LOOP, SCN, SPUR, or TRUCK in ALL CAPS",
    "template": "${street}##${altStreet[0]}##${altStreet[1]}##${altStreet[2]}##${altStreet[3]}##${altStreet[4]}##${altStreet[5]}##${altStreet[6]}##${altStreet[7]}##${altStreet[8]}##${altStreet[9]}",
    "regexp": "/!?[0-9].+(Alt|Business|Bus|Byp|Conn|Loop|Scn|Spur|Truck)\\b/"
  },
// Custom Check
  "131.enabled": true,
  "131.params": {
    "titleEN": "Wrong name on US Highway",
    "problemEN": "All US highways should be named US-###",
    "solutionEN": "Change name to US-###",
    "template": "${street}##${altStreet[0]}##${altStreet[1]}##${altStreet[2]}##${altStreet[3]}##${altStreet[4]}##${altStreet[5]}##${altStreet[6]}##${altStreet[7]}##${altStreet[8]}##${altStreet[9]}",
    "regexp": ".*\\b(?:US Highway |US Hwy Route |US Hwy Rte |US Hwy |US Rte |US- |US )[0-9]{1,3}\\b/i"
  },
  "131.solutionLink": "W:Idaho#Major_Roads",
// Custom Check
  "132.enabled": true,
  "132.params": {
    "titleEN": "Wrong road type (Major)",
    "problemEN": "All US Highways should be at least Major Highway (except BUS, SPUR, LOOP)",
    "solutionEN": "Change the road type to Major Highway",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![245]).*#(?:US Hwy |US-)[0-9]+(?: ALT| BYP| CONN| TRUCK| SCN| Scenic| [NSWE])*@/i"
  },
  "132.solutionLink": "W:Road_types/USA#Major_Highway",
// Custom Check
  "133.enabled": true,
  "133.params": {
    "titleEN": "Wrong road type (Minor)",
    "problemEN": "All US BUS, SPUR, LOOP Highways and all State Highways (except BUS, SPUR, LOOP) should be at least Minor Highway type",
    "solutionEN": "Change the road type to Minor Highway",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![2-5]).*#(?:(?:State Hwy |SH-|K-|LA-|M-|MA-|MS-|NC-|SC-)[0-9]+(?:| ALT| BYP| CONN| TRUCK| SCN| Scenic| [NSWE])*|(?:US Hwy |US-)[0-9]+(?: BUS| LOOP| SPUR)+(?: [NSWE])?)@/i"
  },
  "133.solutionLink": "W:Road_types/USA#Minor_Highway",
// Custom Check
  "134.enabled": true,
  "134.params": {
    "titleEN": "Wrong road type (Primary)",
    "problemEN": "All State BUS, SPUR, LOOP Highways should be at least Primary Street type",
    "solutionEN": "Change the road type to Primary Street",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![1-5]).*#(?:State Hwy |SH-|K-|LA-|M-|MA-|MS-|NC-|SC-)[0-9]+(?: BUS| LOOP| SPUR)+(?: [NSWE])?@/i"
  },
  "134.solutionLink": "W:Road_types/USA#Primary_Street",
// Custom Check - State Name = Idaho
  "135.enabled": true,
  "135.params": {
    "titleEN": "Not Idaho",
    "problemEN": "Incorrect State Name - State name should be Idaho (Where are you?)",
    "solutionEN": "Verify correct state name on segment.",
    "template": "${state}",
    "regexp": "!/^Idaho$/"
  },
  "135.solutionLink": "W:Idaho",
  // Custom Check
  "136.enabled": true,
  "136.params": {
    "titleEN": "Wrong name on Idaho State Highway",
    "problemEN": "All designated state Highways should be named State Hwy",
    "solutionEN": "Change name to State Hwy ###",
    "template": "${state}:##${street}##${altStreet[0]}##${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^Idaho:.*(?:State Rd |State Rte |ID |ID- |SH- |ID Hwy |ID-Hwy)(?:[1-5]{0,1}[1-9]{0,2})#/i"
  },
  "136.solutionLink": "W:Idaho#Major_Roads",
// Custom Check
  "137.enabled": true,
  "137.params": {
    "titleEN": "Wrong name on Idaho County Road",
    "problemEN": "All County Roads should be named CR-###",
    "solutionEN": "Change name to CR-###",
    "template": "${state}:##${street}##${altStreet[0]}##${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^Idaho:.*(?:County Road |County Rd |Co Road |Co Rd |C O)(?:(?:[6-9][1-9]{2,})|(?:[1-9]{4,}))#/i"
  },
  "137.solutionLink": "W:Road_types/USA#Service_Road",
// Custom Check
  "138.enabled": true,
  "138.params": {
    "titleEN": "Service Road",
    "problemEN": "Incorrect Function Class - Do not use Service Road Function Class",
    "solutionEN": "Change Function Class to Street",
    "template": "${typeRank}",
    "regexp": "/^9$/"
  },
  "138.solutionLink": "W:Road_types/USA#Service_Road",
// Custom Check
  "139.enabled": true,
  "139.params": {
    "titleEN": "Bad Street Name",
    "problemEN": "Street Name has been identified as mass entered name that is incorrect. (dfa, nul, or null)",
    "solutionEN": "Correct the street name to remove dfa, nul, or null",
    "template": "${street}##${altStreet[0]}##${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": ".*\\b(dfa|nul|null)\\b/i"
  },
  "139.solutionLink": "W:Road_types/USA#Primary_Street",
  //No lock on freeway
  "150.enabled": true,
  "150.params": {
// {number} minimum lock level
  "n": 4,
  },
//No lock on Major Highway
  "151.enabled": true,
  "151.params": {
  // {number} minimum lock level
  "n": 3,
  },
//No lock on Minor Highway
  "152.enabled": true,
  "152.params": {
  // {number} minimum lock level
  "n": 2,
  },
//No lock on Ramp
  "153.enabled": true,
  "153.params": {
    // {number} minimum lock level
    "n": 4,
  },
//No lock on Primary Street
  "154.enabled": true,
  "154.params": {
  // {number} minimum lock level
  "n": 1,
  },
//No State name selected
  "106.enabled": true,
//Default US checks 
"24.enabled": !0, 
"25.enabled": !0, 
"27.enabled": !0, 
"34.enabled": !0, 
"35.enabled": !0, 
"38.enabled": !0, 
"39.enabled": !0, 
"43.enabled": !0, 
"48.enabled": !0, 
"78.enabled": !0, 
"87.enabled": !0, 
"90.enabled": !0, 
"107.enabled": !0, 
"108.enabled": !0, 
"109.enabled": !0,
"112.enabled": !1,
"118.enabled": !0,
"116.enabled": !0,
"119.enabled": !0,
"120.enabled": !0,
"121.enabled": !0,
"172.enabled": !0,
"173.enabled": !0,
"190.enabled": !0,
"192.enabled": !0,
"170.enabled": !0,
"170.params": {
      "regexp": "/^(?!(to) [^a-z])((S|N|W|E) )?[a-z]/"
  },
  "171.enabled": true,
  "171.solutionLink": "W:Abbreviations_and_acronyms/USA#Standard_suffix_abbreviations",
  "171.params": {
    "regexp": "/((?!(\\bPhila|\\bPenna|.(\\bWash|\\bCmdr|\\bProf|\\bPres)|..(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|...(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|...(#| )[NEWSR])).{5}\\.|((?!(hila|enna|(\\bWash|\\bCmdr|\\bProf|\\bPres)|.(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|..(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|..(#| )[NEWSR])).{4}|(\\bhila|\\benna))\\.|((?!(ila|nna|(ash|mdr|rof|res)|(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|.(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|.(#| )[NEWSR])).{3}|\\b(ila|nna|ash|mdr|rof|res))\\.|((?!(la|na|(sh|dr|of|es)|(dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl)|(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|(#| )[NEWSR])).{2}|\\b(la|na|sh|dr|of|es|dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl))\\.|(#|^)[^NEWSR]?\\.)|(((?!\\b(D|O|L)).|#|^)\'(?![sl]\\b)|(#|^)\'s|(?!\\b(In|Na)t).{3}\'l|(#|^).{0,2}\'l)|(Dr|St)\\.(#|$)|,|;|\\\\|((?!\\.( |#|$|R))\\..|(?!\\.( .|#.|$|R\\.))\\..{2}|\\.R(#|$|\\.R))|[Ee]x(p|w)y\\b|Tunl\\b|Long Is\\b|Brg\\b/",
    "problemEN": "The street name has incorrect abbreviation, or character",
    "solutionEN": "Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table. Remove any comma (,), backslash (\\), or semicolon (;)"
  },
};