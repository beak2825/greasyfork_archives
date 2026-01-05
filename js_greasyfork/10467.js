// ==UserScript==
// @name                WME Validator Localization for Minnesota
// @namespace           https://greasyfork.org/en/users/9555
// @version             1.1.1.3
// @author              gadgetmts, via xanderb
// @description         This script localizes WME Validator for Minnesota, USA. You also need main package (WME Validator) installed.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/10467/WME%20Validator%20Localization%20for%20Minnesota.user.js
// @updateURL https://update.greasyfork.org/scripts/10467/WME%20Validator%20Localization%20for%20Minnesota.meta.js
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
    *Note: do not forget to escape backslashes in strings, i.e. use "\\" instead of 

"\".
*/

window.WME_Validator_United_States = {
  ".country": "United States",
  ".codeISO": "US",
  ".author": "xanderb, hacked by gadgetmts",
  ".updated": "2015-06-16",
  ".link": "TODO: ",
  "128.enabled": true,
  "128.params": {
    "titleEN": "Bad TTS Street name",
    "problemEN": "Streets that start with St and Dr result in TTS reading Street or Drive",
    "solutionEN": "Add a period after St or Dr at the beginning of the street name",
    "template": "${street}#${altStreet[#]}",
    "regexp": "/^([SNEW] )+(St |Dr )|^St |^Dr |Jr /"
  },
  "128.solutionLink": "W:Abbreviations_and_acronyms#Standard_suffix_abbreviations",
  "129.enabled": true,
  "129.params": {
    "titleEN": "Incorrect State or US Highway",
    "problemEN": "Minnesota uses MN and US for numbered highway names",
    "solutionEN": "Rename the Street or Alt Street",
    "template": "${state}:${street}#${altStreet[#]}",
    "regexp": "/Minnesota:.*(Mn Hwy |State Hwy |Mn-|SR-|SH-|State Rd |MN=|State Rte |US Hwy |Us Hwy |us hwy )/"
  },
  "129.solutionLink": "W:Minnesota",
  "130.enabled": true,
  "130.params": {
    "titleEN": "Short Parking Lot",
    "problemEN": "Dead End Parking Lot is less that 50 meters",
    "solutionEN": "Does it really need to be there?",
    "template": "${deadEnd}:${typeRank}:${length}",
    "regexp": "/1:7:([0-4]?[0-9])$/"
  },
  "130.solutionLink": "W:Best_map_editing_practice#Parking_Lots",
  "131.enabled": true,
  "131.params": {
    "titleEN": "Not Minnesota",
    "problem": "The segment is assigned to another state",
    "solutionEN": "Make sure you are editing in Minnesota and change it",
    "template": "${state}",
    "regexp": "!/Minnesota/"
  },
  "131.solutionLink":"W:Creating_and_editing_road_segments#Address_Properties",
  "132.enabled": true,
  "132.params": {
    "titleEN": "Wrong name for City or County street",
    "problemEN": "CS and Cs are not read correctly by TTS or County Hwy Name is wrong",
    "solutionEN": "Check sources and change the street's name",
    "template": "${state}:${street}#${altStreet[#]}",
    "regexp": "/Minnesota:.*(Cs-|CS-|County Hwy |County Rd |Cr-|Ch-|Co Rd )/"
  },
  "132.solutionLink": "W:Minnesota",
  "133.enabled": true,
  "133.params": {
    "titleEN": "City Name on Freeway",
    "problemEN": "City names on Freeway segments can cause detours",
    "solutionEN": "Remove the City Name",
    "template": "${typeRank}:${city}",
    "regexp": "/15:.+$/"
  },
  "135.enabled": true,
  "135.params": {
    "titleEN": "Wrong road type (major)",
    "problemEN": "All US Highways should be at least Major Highway (except BUS, SPUR, LOOP)",
    "solutionEN": "Change the road type to Major Highway",
    "template": "${typeRank}:#${street}@#${altStreet[@#]}@",
    "regexp": "/^[1-9][^245]?:.*#(US Hwy |US-)[0-9]+( ALT| BYP| CONN| TRUCK| Scenic| [NSWE])*@/i"
  },
  "135.solutionLink": "W:Road_types/USA#Major_Highway",
  "136.enabled": true,
  "136.params": {
    "titleEN": "Wrong road type (minor)",
    "problemEN": "All US BUS, SPUR, LOOP highways and State Highways (except BUS, SPUR, LOOP) should be at least Minor Highway type",
    "solutionEN": "Change the road type to Minor Highway",
    "template": "${typeRank}:#${street}@#${altStreet[@#]}@",
    "regexp": "/^[1-9][^2-5]:.*#((State Hwy |SR-|SH-|IL-|IN-|K-|LA-|M-|MA-|MN-|MO-|MS-|NC-|ND-|NJ-|NV-|NY-|SC-|SD-|TN-|VT-|WIS-)[0-9]+( ALT| BYP| CONN| TRUCK| Scenic| [NSWE])*|(US Hwy |US-)[0-9]+( BUS| LOOP| SPUR)+( [NSWE])?)@/i"
  },
  "136.solutionLink": "W:Road_types/USA#Minor_Highway",
  "137.enabled": true,
  "137.params": {
    "titleEN": "Wrong road type (primary)",
    "problemEN": "All State BUS, SPUR, LOOP Highways should be at least Primary Street type",
    "solutionEN": "Change the road type to Primary Street",
    "template": "${typeRank}:#${street}@#${altStreet[@#]}@",
    "regexp": "/^[1-9][^1-5]:.*#(State Hwy |SR-|SH-|IL-|IN-|K-|LA-|M-|MA-|MN-|MO-|MS-|NC-|ND-|NJ-|NV-|NY-|SC-|SD-|TN-|VT-|WIS-)[0-9]+( BUS| LOOP| SPUR)+( [NSWE])?@/i"
  },
  "137.solutionLink": "W:Road_types/USA#Primary_Street",
  "138.enabled": true,
  "138.params": {
    "titleEN": "Wrong banner abbreviation",
    "problemEN": "Banner abbreviation may be incorrect. Abbreviations ALT, BUS, BYP, CONN, LOOP, and SPUR should be in ALL CAPS",
    "solutionEN": "Change banner abbreviation to ALT, BUS, BYP, CONN, LOOP, SPUR, or TRUCK",
    "template": "${street}#${altStreet[#]}",
    "regexp": "/[0-9]+[A-Z]? ([Aa]lt(ernate)?|[Bb](us(iness)?|yp(ass)?)|[Cc]onn(ector)?|[Ll]oop|[Ss]pur|[Tt]ruck)/"
  },
  "138.solutionLink": "W:Road_names/USA#United_States_Numbered_Highways",
  "171.params": {
  // {string} regular expression to match incorrect abbreviations
  "regexp": "/\\.$/",
  },
  //Freeway lock
  "150.enabled": true,
  "150.params": {
  // {number} minimum lock level
  "n": 5,
  },
  //Major Highway lock
  "151.enabled": true,
  "151.params": {
  // {number} minimum lock level
  "n": 3,
  },
  //Minor Highway lock
  "152.enabled": true,
  "152.params": {
  // {number} minimum lock level
  "n": 3,
  },
  //Ramp lock
  "153.enabled": true,
  "153.params": {
    // {number} minimum lock level
    "n": 2,
  },
  //Primary Street lock
  "154.enabled": true,
  "154.params": {
  // {number} minimum lock level
  "n": 2,
  },
  //Default US checks
  "27.enabled": !0,
  "90.enabled": !0,
  "106.enabled": !0,
  "112.enabled": !1,
  "170.enabled": !0,
  "170.params": {
      regexp: "/^(?!(to) [^a-z])((S|N|W|E) )?[a-z]/"
  },
  "171.enabled": !0,
  "171.solutionLink": "W:Abbreviations_&_Acronyms#Standard_Suffix_Abbreviations"
};
