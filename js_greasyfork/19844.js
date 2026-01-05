// ==UserScript==
// @name                WME Validator Localization for Iowa
// @version             0.1.1
// @author              herrchin
// @description         This script localizes WME Validator for Iowa, USA. You also need main package (WME Validator) installed.
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @grant               none
// @run-at              document-start
// @namespace https://greasyfork.org/users/23100
// @downloadURL https://update.greasyfork.org/scripts/19844/WME%20Validator%20Localization%20for%20Iowa.user.js
// @updateURL https://update.greasyfork.org/scripts/19844/WME%20Validator%20Localization%20for%20Iowa.meta.js
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
  ".updated": "2016-05-20",
  ".link": "https://greasyfork.org/en/scripts/19844-wme-validator-localization-for-iowa/code",
  "27.enabled": true,
  "90.enabled": true,
  "106.enabled": true,
  "112.enabled": false,
  
  // Catch State Hwy, County Rd, Co Rd, etc.
  "130.enabled": true,
    "130.params": {
      "titleEN": "Incorrect State Highway, County Road, or US Highway name",
      "problemEN": "Iowa uses IA-### and CR-xxx for properly abbreviated road names, and US-###",
      "solutionEN": "Rename the Street or Alt Street per Iowa Wiki Standards",
      "template": "${state}:${street}#${altStreet[#]}",
      "regexp": "/Iowa:.*(State [Hh](WY|wy|ighway)|Co(unty)? R(oa)?d|U\\.?[Ss]\\.? [Hh](WY|wy|ighway))/",
  },
  "130.solutionLink": "https://wiki.waze.com/wiki/Iowa#Major_roads",
  
  // Roads that have State set to something other than Iowa (basemap issue). This will be NOISY outside Iowa, so be sure to disable this script when editing elsewhere
  "131.enabled": true,
  "131.params": {
      "titleEN": "State is not set to Iowa",
      "problemEN": "Some Iowa basemap roads are incorrectly set to another State.",
      "solutionEN": "Verify that you are editing in Iowa, then update the State field",
      "template": "${state}",
      "regexp": "!/^Iowa/",
  },
  
  // Missing elevations
  // "131.enabled": true,
  
  
  // Iowa locking standards
  // freeway
  "150.enabled": true,
  "150.params": {
      "n": 4,
  },
  "150.solutionLink": "https://wiki.waze.com/wiki/Iowa#Locking_standard",
  // MH
  "151.enabled": true,
  "151.params": {
      "n": 3,
  },
  "151.solutionLink": "https://wiki.waze.com/wiki/Iowa#Locking_standard",
  // mH
  "152.enabled": true,
  "152.params": {
      "n": 3,
  },
  "152.solutionLink": "https://wiki.waze.com/wiki/Iowa#Locking_standard",
  // PS
  "154.enabled": true,
  "154.params": {
      "n": 2,
  },
  "154.solutionLink": "https://wiki.waze.com/wiki/Iowa#Locking_standard",
  // Ramp
  "153.enabled": true,
  "153.params": {
      "n": 4,
  },
  "153.solutionLink": "https://wiki.waze.com/wiki/Iowa#Locking_standard",
  

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
