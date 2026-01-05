// ==UserScript==
// @name                WME Validator Localization for Utah - herrchin
// @version             0.1.2
// @author              herrchin
// @description         This script localizes WME Validator for Utah, USA. You also need the main WME Validator installed.
// @include             ^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @grant               none
// @run-at              document-start
// @namespace https://greasyfork.org/users/23100
// @downloadURL https://update.greasyfork.org/scripts/21406/WME%20Validator%20Localization%20for%20Utah%20-%20herrchin.user.js
// @updateURL https://update.greasyfork.org/scripts/21406/WME%20Validator%20Localization%20for%20Utah%20-%20herrchin.meta.js
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
  ".author": "herrchin",
  ".updated": "2016-07-15",
  ".link": "https://greasyfork.org/en/scripts/21406-wme-validator-localization-for-utah-herrchin/code",

  //Find "cardinal #### cardinal" that are malformed
  "128.enabled": true,
    "128.params": {
      "titleEN": "Missing cardinal directions",
      "problemEN": "Utah roads of the N 2600 W format are properly expressed with leading and trailing directions",
      "solutionEN": "Add the missing leading or trailing cardinal direction",
      "template": "${state}:#${street}#${altStreet[#]}#",
      "regexp": "/^Utah:.*#(\\d+ [NEWS]|\\d+)#/",
  },
  "128.solutionLink": "W:Utah#Statewide",

  // Catch State Route, State Rte, etc.
  "130.enabled": true,
    "130.params": {
      "titleEN": "Incorrect State Highway or US Highway name",
      "problemEN": "Utah uses SR-### and US-### for properly abbreviated road names",
      "solutionEN": "Rename the Street or Alt Street per Utah Wiki Standards",
      "template": "${state}:${street}#${altStreet[#]}",
      "regexp": "/Utah:.*(Ut Hwy |State Hwy |I- |U[Tt]-|SH-|State Rd |SR=|State [Rr](TE|te|oute|OUTE)|U\\.?[Ss]\\.? [Hh](WY|wy|ighway))/",
  },
  "130.solutionLink": "W:Utah#Major_roads",

  // Roads that have State set to something other than Utah (basemap issue). This will be NOISY outside Utah, so be sure to disable this script when editing elsewhere
  "131.enabled": true,
  "131.params": {
      "titleEN": "State is not set to Utah",
      "problemEN": "Some Utah basemap roads are incorrectly set to another State.",
      "solutionEN": "Verify that you are editing in Utah, then update the State field",
      "template": "${state}",
      "regexp": "!/^Utah$/",
  },

  "132.enabled": true,
    "132.params": {
    "titleEN": "Alley not PLR",
    "problemEN": "Alleys should be set to the PLR type",
    "solutionEN": "Change Road Type to Parking Lot Road",
    "template": "${street}:${typeRank}",
    "regexp": "/.*(Alley| Aly):[^7]/"
  },
  "132.solutionLink": "W:Road_types/USA#Parking_Lot_Road",

  "133.enabled": true,
  "133.params": {
    "titleEN": "Walking Trail",
    "problemEN": "Utah does not use the Walking Trail type except in extremely rare cases",
    "solutionEN": "Delete the trail, unless it is a vehicle road, in which case correct its type",
    "template": "${type}",
    "regexp": "/^5$/"
  },
  "133.solutionLink": "W:Utah#Walking_Trails",

  "167.enabled": true,
  "167.params": {
    "titleEN": "Named Railroad",
    "problemEN": "Utah does not name Railroad segments",
    "solutionEN": "Set the name to None (and the City) for Railroad segments",
    //"template": "${type}:${street}",
    //"regexp": "/^18:.+$/"
    "regexp": ".+"
  },
  "167.solutionLink": "W:Utah#Railroads",

  // Missing elevations
  // "131.enabled": true,


  // Utah locking standards, temporary lower version
  // freeway
  "150.enabled": true,
  "150.params": {
      "n": 4,
  },
  "150.solutionLink": "W:Utah#Locking_standard",
  // Ramp
  "153.enabled": true,
  "153.params": {
      "n": 4,
  },
  "153.solutionLink": "W:Utah#Locking_standard",
  // MH
  "151.enabled": true,
  "151.params": {
      "n": 3,
  },
  "151.solutionLink": "W:Utah#Locking_standard",
  // mH
  "152.enabled": true,
  "152.params": {
      "n": 2,
  },
  "152.solutionLink": "W:Utah#Locking_standard",
  // PS
  "154.enabled": true,
  "154.params": {
      "n": 2,
  },
  "154.solutionLink": "W:Utah#Locking_standard",


  "170.enabled": true,
  "170.params": {
    "regexp": "/^(?!(to) [^a-z])((S|N|W|E) )?[a-z]/"
  },
  "171.enabled": true,
  "171.params": {
    "regexp": "/((?!(\\bPhila|\\bPenna|.(\\bWash|\\bCmdr|\\bProf|\\bPres)|..(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|...(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|...(#| )[NEWSR])).{5}\\.|((?!(hila|enna|(\\bWash|\\bCmdr|\\bProf|\\bPres)|.(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|..(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|..(#| )[NEWSR])).{4}|(\\bhila|\\benna))\\.|((?!(ila|nna|(ash|mdr|rof|res)|(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|.(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|.(#| )[NEWSR])).{3}|\\b(ila|nna|ash|mdr|rof|res))\\.|((?!(la|na|(sh|dr|of|es)|(dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl)|(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|(#| )[NEWSR])).{2}|\\b(la|na|sh|dr|of|es|dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl))\\.|(#|^)[^NEWSR]?\\.)|(((?!\\b(D|O|L)).|#|^)'(?![sl]\\b)|(#|^)'s|(?!\\b(In|Na)t).{3}'l|(#|^).{0,2}'l)|(Dr|St)\\.(#|$)|,|;|\\\\|((?!\\.( |#|$|R))\\..|(?!\\.( .|#.|$|R\\.))\\..{2}|\\.R(#|$|\\.R))|[Ee]x(p|w)y\\b|\\b[Ee]x[dn]\\b|Tunl\\b|Long Is\\b|Brg\\b/",
    "problemEN": "The street name has incorrect abbreviation, or character",
    "solutionEN": "Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table. Remove any comma (,), backslash (\\), or semicolon (;)"
  },
  "171.solutionLink": "W:Abbreviations_and_acronyms/USA#Standard_suffix_abbreviations"
};
