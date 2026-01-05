// ==UserScript==
// @name         WME Validator Kansas Localization
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script localizes WME Validator for United States. You also need main package (WME Validator) installed.
// @match        https://editor-beta.waze.com/*editor/
// @author       FastestBeef
// @match        https://www.waze.com/*editor/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/27668/WME%20Validator%20Kansas%20Localization.user.js
// @updateURL https://update.greasyfork.org/scripts/27668/WME%20Validator%20Kansas%20Localization.meta.js
// ==/UserScript==

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
    ".author": "FastestBeef",
    ".updated": "2017-03-31",
    ".lng": "EN-US",
    ".link": "https://greasyfork.org/en/scripts/24545-wme-validator-Kansas-localization",

    "27.enabled": true, // no city name on railroad

    //Freeway min lock
    "150.enabled": true,
    "150.params": {
        // {number} minimum lock level
        "n": 4,
    },
    //MH min lock
    "151.enabled": true,
    "151.params": {
        // {number} minimum lock level
        "n": 3,
    },
    //mH min lock
    "152.enabled": true,
    "152.params": {
        // {number} minimum lock level
        "n": 3,
    },
    //Ramp min lock
    "153.enabled": false,
    "153.params": {
        // {number} minimum lock level
        "n": 4,
    },
    // Primary Street min lock
    "154.enabled": true,
    "154.params": {
        // {number} minimum lock level
        "n": 2,
    },
    "167.enabled": true,
    "167.solutionLink": "W:Railroad#Railroad",
    "167.params": {
        "solutionEN": "Railroad should have no name rather than 'Railroad'",
        "regexp": "/^Railroad$/",
    },
    // check TTS, shamlessly stolen from xanderb
    "128.enabled": true,
    "128.params": {
        "titleEN": "Bad TTS Street name",
        "problemEN": "Streets that start with St and Dr result in TTS reading Street or Drive",
        "solutionEN": "Add a period after Jr, St, Dr, or Rev where required",
        "template": "${street}#${altStreet[#]}",
        "regexp": "/((^| )(St|Dr)(?! ((Ext|[NEWS][EW]?)\\b|\/|\\())|(Jr|Rev)) /"
    },

    // custom check: State must be Kansas
    "130.enabled": true,
    "130.params": {
        // {string} expandable template
        "template": "${state}",
        // {string} regular expression to match the template
        "regexp": "!/^Kansas$/",
        // {string} check title in English
        "titleEN": "Wrong state selected",
        // {string} problem description in English
        "problemEN": "Selected state must be Kansas",
        // {string} solution instructions in English
        "solutionEN": "Set state to Kansas if within state limits",
    },
    "131.enabled": true,
    "131.solutionLink": "W:Kansas#Major_roads",
    "131.params": {
        "titleEN": "Bad Street Name",
        "problemEN": "Street Name or Alt Name has been identified as incorrect. (dfa, nul, null, no street, K-XX)",
        "solutionEN": "Correct the street name, KS State Highway (K-###) (refer to KS wiki), remove names dfa, nul, null, no street.",
        "template": "${state}:${street}#${altStreet[#]}#`",
        "regexp": "/^Kansas:.*\\b(?:dfa|nul|null|no street|(SR |CR |SH-|State Hwy |Co Rd |County Rd |County Road |KS-)[0-9]+|(KS-|K-|State Hwy )[A-Z]+)\\b/i"
    },
};