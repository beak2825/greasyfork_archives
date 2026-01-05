// ==UserScript==
// @name                WME Validator Localization for Canada
// @version             1.1.7
// @description         This script localizes WME Validator for Canada. You also need main package (WME Validator) installed.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @run-at              document-start
// @namespace https://greasyfork.org/users/14507
// @downloadURL https://update.greasyfork.org/scripts/11907/WME%20Validator%20Localization%20for%20Canada.user.js
// @updateURL https://update.greasyfork.org/scripts/11907/WME%20Validator%20Localization%20for%20Canada.meta.js
// ==/UserScript==
//
 
window.WME_Validator_Canada = {
  ".country": "Canada",
  ".codeISO": "CA",
  ".author": "manoeuvre",
  ".updated": "2015-08-21",
     
  "129.enabled": true,
  "129.params": {
    "titleEN": "Wrong Abbreviation",
    "problemEN": "Street name has the wrong abbreviation",
    "solutionEN": "Use the correct abbreviation",
    "template": "${type}:${street}",
    "regexp": "/ (Aly|Avenue|Autoroute|Bnd|Boulevard|Bridge|By-pass|Carrefour|Cct|Centre|Center|Chemin|Circle|Circuit|Cl|Cmn|Concession|Cors|Court|Corners|Cr|Ct|Crescent|Croissant|Cross|Cul-de-sac|Cv|Diversion|Drive|Échangeur|Esplanade|Estates|Expressway|Expwy|Extension|Ext|Fld|Gardens|Gln|Grn|Grounds|Grv|Harbour|Harbor|Hbr|Heights|Highway|Highlands|Hl|Holw|Impasse|Inlt|Is|Knl|Landing|Limits|Ln|Lndg|Lookout|Mnr|Mdw|Mountain|Mt|Orchard|Park|Parkway|Passage|Pass|Pathway|Place|Plateau||Plz|Pnes|Point|Pkwy|Private|Promenade|Prt|Range|Rdge|Road|Rond-pont|Ruelle|Sentier|Square|Street|Subdivision|Tce|Terrace|Ter|Terrasse|Thicket|Townline|Trl|Tr|Turnabout|Village|Vlg|North|East|South|West|Xing)$/i",
  },
 
  "128.enabled": true,
  "128.params": {
    "titleEN": "St. not St",
    "problemEN": "St. not St",
    "solutionEN": "Use St. instead of St",
    "template": "${street}",
    "regexp": "^St .*/",
  },
  "150.enabled": true,
  "150.params": {
  // {number} minimum lock level
  "n": 5,
  },
  "151.enabled": true,
  "151.params": {
  // {number} minimum lock level
  "n": 4,
  },
  "152.enabled": true,  
  "152.params": {
  // {number} minimum lock level
  "n": 3,
  },
  "153.enabled": true,  
  "153.params": {
  // {number} minimum lock level
  "n": 4,
  },
  "154.enabled": true,  
  "154.params": {
  // {number} minimum lock level
  "n": 2,
  },
}