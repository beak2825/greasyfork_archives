// ==UserScript==
// @name         WME Validator Localization for Texas
// @namespace    https://greasyfork.org/en/scripts/tbd
// @version      1.0
// @description  This script localizes WME Validator for United States/Texas. You also need main package (WME Validator) installed.
// @author       MRedRaider
// @match        https://editor-beta.waze.com/*editor/*
// @match        https://www.waze.com/*editor/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/13181/WME%20Validator%20Localization%20for%20Texas.user.js
// @updateURL https://update.greasyfork.org/scripts/13181/WME%20Validator%20Localization%20for%20Texas.meta.js
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
	
	Changelog:
	0.1 - Initial copy of Oklahoma script
        1.0 - Removed Jr search from #135 per KarlCR9911
*/
window.WME_Validator_United_States = {
  ".country": "United States/Texas",
  ".codeISO": "US",
  ".author": "MRedRaider",
  ".updated": "2015-11-30",
  ".link": "TODO: ",
  
   //Default US checks
  "27.enabled": !0,
  "90.enabled": !0,
  "106.enabled": !0,
  "112.enabled": !1,
  "170.enabled": !0,
  "170.params": {
	"regexp": "/^(?!(to) [^a-z])((S|N|W|E) )?[a-z]/"
  },
  "171.enabled": !0,
  "171.solutionLink": "W:Abbreviations_&_Acronyms#Standard_Suffix_Abbreviations",
  
 "130.enabled": true,
 "130.params": {
	"titleEN": "Not Texas",
	"problem": "The segment is assigned to another state",
	"solutionEN": "Make sure you are editing in TX and change it or disable script when working in another state",
	"template": "${state}",
	"regexp": "!/Texas/"
  },
  "130.solutionLink": "W:Creating_and_editing_road_segments#Address_Properties",   
  "131.enabled": true,
  "131.params": {
	"titleEN": "Wrong banner abbreviation",
	"problemEN": "Banner abbreviation may be incorrect. Abbreviations ALT, BUS, BYP, CONN, LOOP, and SPUR should be in ALL CAPS",
	"solutionEN": "Change banner abbreviation to ALT, BUS, BYP, CONN, LOOP, SPUR, or TRUCK",
	"template": "${street}#${altStreet[#]}",
	"regexp": "/[0-9]+[A-Z]? ([Aa]lt(ernate)?|[Bb](us(iness)?|yp(ass)?)|[Cc]onn(ector)?|[Ll]oop|[Ss]pur|[Tt]ruck)/"
  },
  "131.solutionLink": "W:Road_names/USA#United_States_Numbered_Highways",
  "132.enabled": true,
  "132.params": {
	"titleEN": "Incorrect Segment Name",
	"problemEN": "TX uses CR for county road, SH for state highway, US for national highway, and I for interstate names",
	"solutionEN": "Rename the Street or Alt Street",
	"template": "${state}:${street}#${altStreet[#]}",
    "regexp": "/^Texas:.*(?!(SH|CR|US|I)-[0-9]+ ?[A-Za-z]*)([Ii](- | -|-|=| =|= )?|[Uu]\.?[Ss]\.?( [Hh](WY|wy|ighway)| Rte| -|- |-|=| =|= )?|([Tt][Xx]|[Ss]tate|[Cc](ounty|[Oo])) ?([Hh](WY|wy|ighway)|[Rr][Dd]|Rte)|(([Tt][Xx]|([Ss]|[Cc])([Hh]|[Rr]))(- | -|-|=| =|= ))) ?[0-9]+ ?[A-Za-z]*/"
  },
  "133.solutionLink": "W:Road_types/USA#Quick_reference_chart",
  "134.solutionLink": "W:Texas#Roads",    
  "135.enabled": true,
  "135.params": {
    "titleEN": "Bad TTS Street name",
    "problemEN": "Streets that start with St and Dr result in TTS reading Street or Drive",
    "solutionEN": "Add a period after Jr or St or Dr where required",
    "template": "${street}#${altStreet[#]}",
    "regexp": "/^([SNEW] )+(St |Dr )|^St |^Dr |Rev /"
  },
  "135.solutionLink": "W:Abbreviations_and_acronyms#Standard_suffix_abbreviations",
  //Freeway Lock
  "150.enabled": true,
  "150.params": {
	  "n": 5,
  },
  //Major Highway Lock
  "151.enabled": true,
  "151.params": {
	  "n": 5,
  },
  //Minor Highway Lock
  "152.enabled": true,
  "152.params": {
	  "n": 4,
  },
  //Ramp Lock
  "153.enabled": true,
    "153.params": {
	  "n": 4,
  },
  //Primary Street Lock
  "154.enabled": true,
  "154.params": {
	  "n": 3,
  },
};