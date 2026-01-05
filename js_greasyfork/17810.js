// ==UserScript==
// @name                WME Validator Localization for Rhode Island Mapraid
// @namespace           https://greasyfork.org/users/6605
// @version             1.1.13
// @author              crazycaveman, dsfargeg
// @description         This script localizes WME Validator for Rhode Island, USA. You also need main package (WME Validator) installed.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/17810/WME%20Validator%20Localization%20for%20Rhode%20Island%20Mapraid.user.js
// @updateURL https://update.greasyfork.org/scripts/17810/WME%20Validator%20Localization%20for%20Rhode%20Island%20Mapraid.meta.js
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
  ".author": "crazycaveman and dsfargeg",
  ".updated": "2016-03-06",
  ".link": "",
  
  //Default US checks
  "27.enabled": true,
  "90.enabled": true,
  "106.enabled": true,
  "112.enabled": false,
  "170.enabled": true,
  "170.params": {
      regexp: "/^(?!(to) [^a-z])([SNWE] )?[a-z]/"
  },
  "171.enabled": true,
  "171.params" : {
	  regexp: "/((?!(\\bPhila|\\bPenna|.(\\bWash|\\bCmdr|\\bProf|\\bPres)|..(Adm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|...(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|...(#| )[NEWSR])).{5}\\.|(?!(hila|enna|(\\bWash|\\bCmdr|\\bProf|\\bPres)|.(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|..(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|..(#| )[NEWSR])).{4}\\.|(?!(ila|nna|(ash|mdr|rof|res)|(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|.(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|.(#| )[NEWSR])).{3}\\.|(?!(la|na|(sh|dr|of|es)|(dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl)|(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|(#| )[NEWSR])).{2}\\.|(#|^)[^NEWSR]?\\.)|(((?!\\b(D|O)).|#|^)'(?![sl]\\b)|(?!\\bNat).{3}'l|(#|^).{0,2}'l)|(Dr|St)\\.(#|$)|,|;|\\\\|((?!\\.( |#|$|R))\\..|(?!\\.( .|#.|$|R\\.))\\..{2}|\\.R(#|$|\\.R))|[Ee]x(p|w)y|Tunl|Long Is\\b|Brg/",
	  problemEN: "The street name has incorrect abbreviation, or character",
	  solutionEN: "Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table. Remove any comma (,), backslash (\\), or semicolon (;)"
  },
  "171.solutionLink": "W:Abbreviations_and_acronyms/USA#Standard_suffix_abbreviations",
  
  "130.enabled": true,
  "130.params": {
    "titleEN": "Wrong name for highway",
    "problemEN": "Invalid highway name",
    "solutionEN": "Change name to RI-## (if it is truly a state highway) or US-##",
    "template": "${state}:#${street}#${altStreet[#]}",
    "regexp": "/^Rhode Island:.*\\b(?:State (Hwy|R(ou)?te)|(S[HR]-?|Ri-?|RI)[ =]|U\.?[Ss]\.? [Hh](WY|wy|ighway))\\b/i"
  },
  "130.solutionLink": "W:Road_names/USA#United_States_Numbered_Highways",
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
    "regexp": "/^[1-9][^2-5]:.*#((State Hwy |SR-|SH-|IL-|IN-|K-|LA-|M-|MA-|MO-|MS-|NC-|ND-|NJ-|NV-|NY-|RI-|SC-|SD-|TN-|VT-|WIS-)[0-9]+( ALT| BYP| CONN| TRUCK| Scenic| [NSWE])*|(US Hwy |US-)[0-9]+( BUS| LOOP| SPUR)+( [NSWE])?)@/i"
  },
  "132.solutionLink": "W:Road_types/USA#Minor_Highway",
  "133.enabled": true,
  "133.params": {
    "titleEN": "Wrong road type",
    "problemEN": "All State BUS, SPUR, LOOP Highways should be at least Primary Street type",
    "solutionEN": "Change the road type to Primary Street",
    "template": "${typeRank}:#${street}@#${altStreet[@#]}@",
    "regexp": "/^[1-9][^1-5]:.*#(State Hwy |SR-|SH-|IL-|IN-|K-|LA-|M-|MA-|MO-|MS-|NC-|ND-|NJ-|NV-|NY-|RI-|SC-|SD-|TN-|VT-|WIS-)[0-9]+( BUS| LOOP| SPUR)+( [NSWE])?@/i"
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
  "135.enabled": true,
  "135.params": {
    "titleEN": "Wrong city name",
    "problemEN": "City name is not in the approved list",
    "solutionEN": "Correct the city name on the segment",
    "template": "${state}:#${city}#${altCity[#]}#",
    "regexp": "/Rhode Island:#(?!((.{0}|Barrington|Bristol|Burrillville|Central Falls|Charlestown|Coventry|Cranston|Cumberland|East Greenwich|East Providence|Exeter|Foster|Glocester|Hopkinton|Jamestown|Johnston|Lincoln|Little Compton|Middletown|Narragansett|New Shoreham|Newport|North Kingstown|North Providence|North Smithfield|Pawtucket|Portsmouth|Providence|Richmond|Scituate|Smithfield|South Kingstown|Tiverton|Warren|Warwick|West Greenwich|West Warwick|Westerly|Woonsocket|Ashaway|Bradford|Carolina|Chepachet|Clayville|Forestdale|Glendale|Greene|Greenville|Harmony|Harrisville|Hope|Hope Valley|Kenyon|Kingston|Manville|Mapleville|North Scituate|Oakland|Pascoag|Prudence Island|Riverside|Rockville|Rumford|Saunderstown|Shannock|Slatersville|Slocum|Wakefield|West Kingston|Wood River Junction|Wyoming)#)*$)/"
  },
  "135.solutionLink": "W:Rhode_Island/Cities_and_towns",
  "136.enabled": false,
  "136.params": {
    "titleEN": "City name not needed",
    "problemEN": "City names are not used for numbered routes",
    "solutionEN": "Remove the city name from the appropriate name",
    "template": "#${street}@${city}#${altStreet[0]}@${altCity[0]}#${altStreet[1]}@${altCity[1]}#${altStreet[2]}@${altCity[2]}#${altStreet[3]}@${altCity[3]}#${altStreet[4]}@${altCity[4]}#${altStreet[5]}@${altCity[5]}#${altStreet[6]}@${altCity[6]}#${altStreet[7]}@${altCity[7]}#${altStreet[8]}@${altCity[8]}#${altStreet[9]}@${altCity[9]}#",
    "regexp": "/#(RI|State Hwy|US|I)[- ][0-9]+[^@]*@[^#]+/"
  },
  "136.solutionLink": "W:Rhode_Island/Cities_and_towns",
   "137.enabled": true,
  "137.params": {
    "titleEN": "Negative Elevation",
    "problemEN": "There are no tunnels in RI",
    "solutionEN": "Set the elevation to Ground or Above. Also verify that the Tunnel checkbox is not checked",
    "template": "${elevation}",
    "regexp": "/^-/"
  },
  "137.solutionLink": "W:Rhode_Island/Mapraid_Rhode_Island_2016#Elevations",
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
  "153.solutionLink": "W:Road_types/USA#Ramps",
  "153.params": {
  // {number} minimum lock level
    "n": 5,
    "problemEN": "Ramps generally connect to Freeways, so they should be locked to Lvl 5. If not connected to a freeway, verify that this meets the criteria to be a ramp",
    "solutionEN": "Lock the segment, change it to a non-ramp type, or just verify it should be a ramp",
  },
  //Primary Street lock
  "154.enabled": false
};
