// ==UserScript==
// @name                WME Validator Localization for South Africa
// @version             0.2.0.16
// @description         This script localizes WME Validator for South Africa. You also need main package (WME Validator) installed.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @run-at              document-start
// @namespace https://greasyfork.org/users/15244-leighgr
// @downloadURL https://update.greasyfork.org/scripts/12637/WME%20Validator%20Localization%20for%20South%20Africa.user.js
// @updateURL https://update.greasyfork.org/scripts/12637/WME%20Validator%20Localization%20for%20South%20Africa.meta.js
// ==/UserScript==
//

/*
 * 0.0.5 - Added solution links for checks 150-154 (locking policies)
 * 0.0.6 - Added check for abbreviated cardinal notation on one-way freeways
 * 0.0.7 - Uploaded to GreasyFork.
 * 0.0.8 - Re-enabled checks 137 & 138
 * 0.0.9 - Fixed GreasyFork user references
 * 0.1.0 - Fixing lock checks
 * 0.1.1 - Fixed freeway lock check not working
 * 0.1.6 - Added 135 & 136 back.
 * 0.1.7 - Added 134, then regressed
 * 0.1.8 - Initial private release
 * 0.1.9 - Freeway name format check (139) enabled after finding a missing comma
 * 0.1.9.3 - Regressing - Again
 * 0.2.0 - FW & MH basic checks (138-139) now working again
 * 0.2.0.1 Update to force disable on check 137
 * 0.2.0.2 Update to checks 137 & 138, adding '0' as a valid digit
 * 0.2.0.4 Enabled check 136 for basic mH segments
 * 0.2.0.5 Added missing ${direction} directive for check 136
 * 0.2.0.6 Check 137 still flagging R515 as a freeway. 
 * 0.2.0.7 Still not working. Not funny anymore. 
 * 0.2.0.8 Checks 137 - 139 now working much better following PesachZs' advice and example.
 * 0.2.0.9 Check 136 - added D and P letters to acceptable list .
 * 0.2.0.10 Disabled 136, 137 & 139.
 * 0.2.0.12 Disabled 136 again in prep for ZA MapRaid.
 * 0.2.0.13 Added all the known suffixes from the ZA wiki to 135 and 136.
 * 0.2.0.14 Added Mile, Nook and Turn suffixes to 135 and 136, so they aren't highlighted as incorrect.
 * 0.2.0.15 Added Quay suffix to 135 and 136, so it isn't highlighted as incorrect.
 * 0.2.0.16 Added Row suffix to 135 and 136, so it isn't highlighted as incorrect.
*/

window.WME_Validator_South_Africa = {
  ".country": "South Africa",
  ".codeISO": "ZA",
  ".author": "LeighGr",
  ".updated": "2016-04-18",
  ".link": "https://greasyfork.org/en/scripts/12637-wme-validator-south-africa-localization",
//No State name selected
  "106.enabled": false,
// Ramp name too long
  "112.enabled": false,
  "112.params": {
  "n": 55,
  },
/*
// Custom Check
  "131.enabled": false,
  "131.params": {
    "titleEN": "Wrong name on ZA National Roads",
    "problemEN": "All ZA National Roads should be named N##",
    "solutionEN": "Change name to N##",
    "template": "${typeRank}:${street}##${altStreet[0]}##${altStreet[1]}##${altStreet[2]}##${altStreet[3]}##${altStreet[4]}##${altStreet[5]}##${altStreet[6]}##${altStreet[7]}##${altStreet[8]}##${altStreet[9]}",
    "regexp": "/(15):.*\\b(?:N)[0-9]{1,3} +(?: [NSWE])\\b"
  },
//  "131.solutionLink": "W:South_Africa#Road_Network",
// Custom Check
  "132.enabled": false,
  "132.params": {
    "titleEN": "Wrong road type (Major)",
    "problemEN": "All Regional roads should be at least Major Highway",
    "solutionEN": "Change the road type to Major Highway",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![245]).*#(?:N)[0-9]+(?: | [NSWE])*@/i"
  },
  "132.solutionLink": "W:South_Africa#.C2.A0Major_Highway.C2.A0",
// Custom Check
  "133.enabled": false,
  "133.params": {
    "titleEN": "Wrong road type (Minor)",
    "problemEN": "All RXXX surfaced roads (except dirt roads) should be at least Minor Highway type",
    "solutionEN": "Change the road type to Minor Highway",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![2-5]).*#(?:(?:State Hwy |SH-|K-|LA-|M-|MA-|MS-|NC-|SC-)[0-9]+(?:| ALT| BYP| CONN| TRUCK| SCN| Scenic| [NSWE])*|(?:US Hwy |US-)[0-9]+(?: BUS| LOOP| SPUR)+(?: [NSWE])?)@/i"
  },
  "133.solutionLink": "W:South_Africa#Road_Network",
// Custom Check
  "134.enabled": true,
  "134.params": {
    "titleEN": "Wrong road type (Primary)",
    "problemEN": "All Provincal M## roads should be at least Primary Street type",
    "solutionEN": "Change the road type to Primary Street",
    "template": "${typeRank}#${street}@#${altStreet[0]}@#${altStreet[1]}@#${altStreet[2]}@#${altStreet[3]}@#${altStreet[4]}@#${altStreet[5]}@#${altStreet[6]}@#${altStreet[7]}@#${altStreet[8]}@#${altStreet[9]}@",
    "regexp": "/^[1-9](?![1-5]).*#(?:M[0-9])?@/i"
  },
  "134.solutionLink": "W:South_Africa#Road_Network",
// Custom Check - Private Road Prefix/Suffix
  "134.enabled": true,
  "134.params": {
    "titleEN": "Incorrect prefix or suffix on private segment",
    "problemEN": "Missing or incorrect prefix and/or suffix on segment",
    "solutionEN": "Change prefix/suffix to the correct abbrevation",
    "template": "${typeRank}:${street}",
    "regexp": "/(6):(?Ave |Dr |General |President |Saint |.* (Alley|Avenue|Bnd|Boulevard|Bypass|Circle|Close|Cresent|Crescant|Court|Drive|Expy|Ext|Gdns|Glen|Grn|Grv|Hill|Hwy|Link|Ln|Mews|Pl|Rd|Sq|St|Ter|Vw|Way|Walk)$|.* ^$|$)/"
  },
    "134.solutionLink": "W:South_Africa#Acceptable_suffix_abbreviations",
*/
// Custom Check - Street Prefix/Suffix
  "135.enabled": true,
  "135.params": {
    "titleEN": "Missing or incorrect prefix or suffix on street segment",
    "problemEN": "Missing or incorrect prefix and/or suffix on segment",
    "solutionEN": "Change prefix/suffix to the correct abbrevation",
    "template": "${typeRank}:${street}",
    "regexp": "/(10):(?!Avenue |Dr. |Gen. |Pres. |St. |The |.*(Aly|Anx|Arc|Ave|Bch|Bdwy|Bend|Blf|Blfs|Blvd|Br|Brk|Brks|Btm|Bypass|Byu|Cir|Cl|Clb|Cres|Cmn|Cor|Cors|Cp|Crse|Crst|Cswy|Ct|Ctr|Ctrs|Curv|Cyn|Dl|Dr|Expy|Ext|Fls|Ft|Fwy|Gdns|Glen|Grn|Grv|Hbr|Hl|Holw|Hts|Hwy|Init|Jctn|Jctns|Key|Keys|Link|Knl|Klns|Lck|Lcks|Ldg|Lf|Lgt|Lgts|Ln|Loop|Mall|Mews|Mile|Mnt|Mount|Msn|Mtn|Mtns|Mtwy|Nck|Nook|Opas|Orch|Oval|Pass|Path|Pde|Pl|Pk|Pke|Pks|Pkys|Plns|Plz|Pne|Pnes|Prr|Prt|Psge|Pts|Quay|Ramp|Rd|Rdg|Rdl|Riv|Row|Rpds|Rte|Sq|St|Strm|Ter|Thwy|Tunl|Turn|Vw|Way|Walk|Xing|Xrd)$|.* ^$|$)/"
  },
    "135.solutionLink": "W:South_Africa#Acceptable_suffix_abbreviations",
// Custom Check - Primary Street Prefix/Suffix
  "136.enabled": false,
  "136.params": {
    "titleEN": "Missing or incorrect prefix or suffix on Primary Street",
    "problemEN": "Primary street prefix or suffix missing or incorrect",
    "solutionEN": "Change suffix to the correct abbreviation.",
    "template": "${typeRank}:${street}",
// Original    "regexp": "/(11):(?!Avenue |Dr. |Gen. |Pres. |St. |The |.* (Aly|Ave|Bend|Blvd|Bypass|Cir|Cl|Cres|Cor|Ct|Dr|Expy|Ext|Gdns|Glen|Grn|Grv|Hill|Hwy|Link|Ln|Mews|Pl|Rd|Sq|St|Ter|Vw|Way|Walk)$|.* ^$|$)/"
    "regexp": "/(10):(?!Avenue |Dr. |Gen. |Pres. |St. |The |.*(Aly|Anx|Arc|Ave|Bch|Bdwy|Bend|Blf|Blfs|Blvd|Br|Brk|Brks|Btm|Bypass|Byu|Cir|Cl|Clb|Cres|Cmn|Cor|Cors|Cp|Crse|Crst|Cswy|Ct|Ctr|Ctrs|Curv|Cyn|Dl|Dr|Expy|Ext|Fls|Ft|Fwy|Gdns|Glen|Grn|Grv|Hbr|Hl|Holw|Hts|Hwy|Init|Jctn|Jctns|Key|Keys|Link|Knl|Klns|Lck|Lcks|Ldg|Lf|Lgt|Lgts|Ln|Loop|Mall|Mews|Mile|Mnt|Mount|Msn|Mtn|Mtns|Mtwy|Nck|Nook|Opas|Orch|Oval|Pass|Path|Pde|Pl|Pk|Pke|Pks|Pkys|Plns|Plz|Pne|Pnes|Prr|Prt|Psge|Pts|Quay|Ramp|Rd|Rdg|Rdl|Riv|Row|Rpds|Rte|Sq|St|Strm|Ter|Thwy|Tunl|Turn|Vw|Way|Walk|Xing|Xrd)$|.* ^$|$)/"
   },
  "136.solutionLink": "W:South_Africa#Acceptable_suffix_abbreviations",
// Custom Check - Minor Highway Name Format
  "137.enabled": false,
  "137.params": {
    "titleEN": "Incorrect name format on Minor Highway",
    "problemEN": "All Minor Highways name format should be ... (R###) numbered > 100 ",
    "solutionEN": "Change name to ... (R###)",
    "template": "${typeRank}:${street}:${direction}",
    "regexp": "/^13:(?!([DPR][1-9]\\d{2}( [NESW]:[12] ?|:3))$)/"
// orig    "regexp": "/^13:(?!([DR][1-9]\\d{2}( [NESW]:[12] ?|:3))$)/"
//    "regexp": "/(13):(?!R[0-9]{3} [NESW]:(1|2) ?|(R[0-9]{3}:(3))$)/"
  },
  "137.solutionLink": "W:South_Africa#Road_Network", 
// Custom Check - Major Highway Name Format
  "138.enabled": false,
  "138.params": {
    "titleEN": "Incorrect name format on Major Highway",
    "problemEN": "All Major Highways name format should be (N## or R##) numbered < 100",
    "solutionEN": "Change name to ... (N## or R##)",
    "template": "${typeRank}:${street}:${direction}",
    "regexp": "/^14:(?!(N[1-9]\\d{0,1}( [NESW]:[12] ?|:3)) ?|(R[1-9]\\d{0,1}( [NESW]:[12] ?|:3))$)/"
//    "regexp": "/(14):(?!N[0-9]{1,2} [NESW]:(1|2) ?|(N[0-9]{1,2}:(3)) ?|(R[0-9]{1,2} [NSEW]:(1|2) ?|(R[0-9]{1,2}:(3)))$)/"
  },
  "138.solutionLink": "W:South_Africa#Numbered_Routes",
// Custom Check - Freeway Name Format
  "139.enabled": false,
  "139.params": {
    "titleEN": "Incorrect name format on Freeway",
    "problemEN": "Freeways name format should be N## numbered < 50, and one-way segments should include cardinal letter (NSEW).",
    "solutionEN": "Change name to N## (N,E,S or W)",
    "template": "${typeRank}:${street}:${direction}",
    "regexp": "/^15:(?!(N[1-9]\\d{0,1}( [NESW]:[12] ?|:3))$)/"
//    "regexp": "/(15):(?!N[0-9]{1,2} [NESW]:(1|2) ?|(N[0-9]{1,2}:(3))$)/"
  },
  "139.solutionLink": "W:South_Africa#Numbered_Routes",
// No lock on freeway
  "150.enabled": true,
  "150.params": {
  // {number} minimum lock level
  "n": 5,
  },
  "150.solutionLink": "W:South_Africa#Freeways_.28Nx.29",
//No lock on major highway
  "151.enabled": true,
  "151.params": {
  // {number} minimum lock level
  "n": 4,
  },
  "151.solutionLink": "W:South_Africa#Major_Highways_.28Nxx_or_Mx.29",
//No lock on minor highway
  "152.enabled": true,
  "152.params": {
  // {number} minimum lock level
  "n": 3,
  },
  "152.solutionLink": "W:South_Africa#Minor_Highways_.28Nxxx_or_Mxx.29",
//No lock on ramp
  "153.enabled": true,
  "153.params": {
  // {number} minimum lock level
    "n": 3,
  },
  "153.solutionLink": "W:South_Africa#Ramps",
//No lock on primary street
  "154.enabled": true,
  "154.params": {
  // {number} minimum lock level
  "n": 2,
  },
  "154.solutionLink": "W:South_Africa#Primary_Streets",
};