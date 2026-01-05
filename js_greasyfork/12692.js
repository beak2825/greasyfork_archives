// ==UserScript==
// @name                WME Validator Localization for United Kingdom
// @version             1.12
// @author              Timbones
// @description         This script localizes WME Validator for United Kingdom. You also need main package (WME Validator) installed.
// @match               https://beta.waze.com/*editor*
// @match               https://www.waze.com/*editor*
// @exclude             https://www.waze.com/*user/*editor/*
// @grant               none
// @run-at              document-start
// @namespace           https://greasyfork.org/users/3339
// @downloadURL https://update.greasyfork.org/scripts/12692/WME%20Validator%20Localization%20for%20United%20Kingdom.user.js
// @updateURL https://update.greasyfork.org/scripts/12692/WME%20Validator%20Localization%20for%20United%20Kingdom.meta.js
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

window.WME_Validator_UK = {
    ".country": "United Kingdom",
    ".codeISO": "GB",
    ".author": "Timbones",
    ".updated": "2019-04-13",
    ".link": "https://www.waze.com/forum/viewtopic.php?f=55&t=161749",
    
    "1.enabled": true,  // WME Toolbox: Roundabout which may cause issues
    
    "27.enabled": true, // City name on Railroad
    
    "74.enabled": true, // Multiple segments connected at roundabout
    
    "130.enabled": true,
    "130.problemLink": "https://wazeopedia.waze.com/wiki/UnitedKingdom/Roads#Abbreviations",
    "130.params": {
        "titleEN": "Incorrect abbreviation of Saint",
        "problemEN": "St is the abbreviation of Street, not Saint",
        "solutionEN": "Use St. with a dot when abbreviating Saint",
        "template": "${street}",
        "regexp": "/(^| - )(St|Saint) /",
    },
    
    "131.enabled": true,
    "131.problemLink": "https://wazeopedia.waze.com/wiki/UnitedKingdom/Roads#Abbreviations",
    "131.params": {
        "titleEN": "Incorrect abbreviation using .",
        "problemEN": "Abbreviations should not end in dot, except for St. (Saint)",
        "solutionEN": "Remove the dot from the end of the abbreviation",
        "template": "${street}",
        "regexp": "/(?:(?!St).{2})\\.(\\b|$)/",
    },

    "132.enabled": true,
    "132.problemLink": "https://wazeopedia.waze.com/wiki/UnitedKingdom/Roads#Junctions",
    "132.params": {
        "titleEN": "Incorrect ramp name",
        "problemEN": "Ramp has not been named according to UK guidelines",
        "solutionEN": "Fix it!",
        "template": "${street}",
        "regexp": "^(Jct|To|Exit|Entry|>) /",
    },

    "161.enabled": true,
    "161.params": {
        "regexp": "!/A[0-9]+( .[NESW].)?( - [A-Z].+)?$/"
    },
    
    "162.enabled": true,
    "162.params": {
        "regexp": "!/A[0-9]+( .[NESW].)?( - [A-Z].+)?$/"
    },
    
    "164.enabled": true,
    "164.params": {
        "regexp": "/B.*(:|\\s-\\w|\\w-\\s)/"
    },
    
    "170.enabled": true,
    "170.params": {
        "regexp": "/(^| )(?!(?:to|and|s|of)\\b)(?:[a-záéíóú]\\w*)\\b/"
    },
    
    "171.enabled": true,
    "171.problemLink": "https://wazeopedia.waze.com/wiki/UnitedKingdom/Roads#Abbreviations",
    "171.params": {
        "regexp": "/(?!The).{3} (Av|Avenue|Ch|Circ|Crt|Close|Cls|Court|Cres|Crescent|Crs|Drv|Drive|East|Est|Gardens?|Grdns?|Grn|Green|Gro|Grove|Grv|Grove|Jctn|Lane|Ldg|Lwr|Place|Hbr|Hl|North|Pde|Private|Road|South|Squ?are|Stn|Street|Te|Tce|Terr|Terrace|Uppr|Uper|Val|West|Wk|Wy)( [NESW])?$/"
    },
    
    "174.enabled": true,
    "174.params": {
        "regexp": "/\\b(Cemetary|Terace|By-pass)\\b/"
    },
    
    "150.enabled": true, // No lock on Freeway
    
    "151.enabled": true, // No lock on Major Highway
    
    "200.enabled": false, // Node A: Unconfirmed turn on minor road
    
    "300.enabled": false, // Node B: Unconfirmed turn on minor road
};