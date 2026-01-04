// ==UserScript==
// @name                WME Validator Localization for South Carolina
// @namespace           https://greasyfork.org/users/6605
// @version             2018.07.27
// @author              crazycaveman
// @description         This script localizes WME Validator for South Carolina, USA. You also need main package (WME Validator) installed.
// @include             https://www.waze.com/editor
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @grant               none
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/370603/WME%20Validator%20Localization%20for%20South%20Carolina.user.js
// @updateURL https://update.greasyfork.org/scripts/370603/WME%20Validator%20Localization%20for%20South%20Carolina.meta.js
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

/* eslint no-template-curly-in-string:0 max-len:0 */

window.WME_Validator_United_States = {
    '.country': 'United States',
    '.codeISO': 'US',
    '.author': 'crazycaveman',
    '.updated': GM_info.script.version,
    '.link': 'https://greasyfork.org/en/scripts/6268-wme-validator-localization-for-south-carolina',
    '.lng': ['en', 'en-US', 'en-GB'],

    //Default US checks
    '27.enabled': true,
    '90.enabled': true,
    '106.enabled': true,
    '112.enabled': false,
    '170.enabled': true,
    '170.params': {
        regexp: '/^(?!(to) [^a-z])((S|N|W|E) )?[a-z]/',
    },
    //  #171 ## Check for improper use of a period (.) that is not on the USA
    //          recommended abbreviations list (PesachZ)
    '171.enabled': true,
    '171.problem': 'The street name has incorrect abbreviation, or character',
    '171.solution': 'Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table. Remove any comma (,), backslash (\\), or semicolon (;)',
    '171.solutionLink': 'W:USA/Abbreviations_and_acronyms#Standard_suffix_abbreviations',
    '171.params': {
        regexp: "/((?!(\\bPhila|\\bPenna|.(\\bWash|\\bCmdr|\\bProf|\\bPres)|..(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|...(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|...(#| )[NEWSR])).{5}\\.|((?!(hila|enna|(\\bWash|\\bCmdr|\\bProf|\\bPres)|.(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|..(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|..(#| )[NEWSR])).{4}|(\\bhila|\\benna))\\.|((?!(ila|nna|(ash|mdr|rof|res)|(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|.(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|.(#| )[NEWSR])).{3}|\\b(ila|nna|ash|mdr|rof|res))\\.|((?!(la|na|(sh|dr|of|es)|(dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl)|(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|(#| )[NEWSR])).{2}|\\b(la|na|sh|dr|of|es|dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl))\\.|(#|^)[^NEWSR]?\\.)|(((?!\\b(D|O|L)).|#|^)\'(?![sl]\\b)|(#|^)\'s|(?!\\b(In|Na)t).{3}\'l|(#|^).{0,2}\'l)|(Dr|St)\\.(#|$)|,|;|\\\\|((?!\\.( |#|$|R))\\..|(?!\\.( .|#.|$|R\\.))\\..{2}|\\.R(#|$|\\.R))|[Ee]x(p|w)y\\b|\\b[Ee]x[dn]\\b|Tunl\\b|Long Is\\b|Brg\\b/",
        problemEN: 'The street name has incorrect abbreviation, or character',
        solutionEN: 'Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table. Remove any comma (,), backslash (\\), or semicolon (;)',
    },

    //Custom checks
    '130.enabled': true,
    '130.title': 'Wrong name for state highway',
    '130.problem': 'All state highways should be named SC-### in South Carolina',
    '130.solution': 'Change name to SC-### (if it is truly a state highway)',
    '130.solutionLink': 'W:USA/Highway_naming',
    '130.params': {
        titleEN: 'Wrong name for state highway',
        problemEN: 'All state highways should be named SC-### in South Carolina',
        solutionEN: 'Change name to SC-### (if it is truly a state highway)',
        template: '${state}:#${street}#${altStreet[#]}',
        regexp: '/^South Carolina:.*\\b(State Hwy |S[cHhRr][- =])[0-9]{1,3}/',
    },

    '131.enabled': true,
    '131.title': 'Wrong road type (major)',
    '131.problem': 'All US Highways should be at least Major Highway (except BUS, SPUR, LOOP)',
    '131.solution': 'Change the road type to Major Highway',
    '131.solutionLink': 'W:USA/Road_types/USA#Major_Highway',
    '131.params': {
        titleEN: 'Wrong road type (major)',
        problemEN: 'All US Highways should be at least Major Highway (except BUS, SPUR, LOOP)',
        solutionEN: 'Change the road type to Major Highway',
        template: '${typeRank}:#${street}@#${altStreet[@#]}@',
        regexp: '/^[1-9][^245]?:.*#(US Hwy |US-)[0-9]+( ALT| BYP| CONN| TRUCK| Scenic| [NSWE])*@/i',
    },

    '132.enabled': true,
    '132.title': 'Wrong road type (minor)',
    '132.problem': 'All US BUS, SPUR, LOOP highways and State Highways (except BUS, SPUR, LOOP) should be at least Minor Highway type',
    '132.solution': 'Change the road type to Minor Highway',
    '132.solutionLink': 'W:USA/Road_types#Minor_Highway',
    '132.params': {
        titleEN: 'Wrong road type (minor)',
        problemEN: 'All US BUS, SPUR, LOOP highways and State Highways (except BUS, SPUR, LOOP) should be at least Minor Highway type',
        solutionEN: 'Change the road type to Minor Highway',
        template: '${typeRank}:#${street}@#${altStreet[@#]}@',
        regexp: '/^[1-9][^2-5]:.*#((State Hwy |SR-|SH-|IL-|IN-|K-|LA-|M-|MA-|MO-|MS-|NC-|ND-|NJ-|NV-|NY-|SC-|SD-|TN-|VT-|WIS-)[0-9]+( ALT| BYP| CONN| TRUCK| Scenic| [NSWE])*|(US Hwy |US-)[0-9]+( BUS| LOOP| SPUR)+( [NSWE])?)@/i',
    },

    '133.enabled': true,
    '133.title': 'Wrong road type (primary)',
    '133.problem': 'All State BUS, SPUR, LOOP Highways should be at least Primary Street type',
    '133.solution': 'Change the road type to Primary Street',
    '133.solutionLink': 'W:USA/Road_types#Primary_Street',
    '133.params': {
        titleEN: 'Wrong road type (primary)',
        problemEN: 'All State BUS, SPUR, LOOP Highways should be at least Primary Street type',
        solutionEN: 'Change the road type to Primary Street',
        template: '${typeRank}:#${street}@#${altStreet[@#]}@',
        regexp: '/^[1-9][^1-5]:.*#(State Hwy |SR-|SH-|IL-|IN-|K-|LA-|M-|MA-|MO-|MS-|NC-|ND-|NJ-|NV-|NY-|SC-|SD-|TN-|VT-|WIS-)[0-9]+( BUS| LOOP| SPUR)+( [NSWE])?@/i',
    },

    '134.enabled': true,
    '134.solutionLink': 'W:USA/Road_names#United_States_Numbered_Highways',
    '134.title': 'Wrong banner abbreviation',
    '134.problem': 'Banner abbreviation may be incorrect. Abbreviations ALT, BUS, BYP, CONN, LOOP, and SPUR should be in ALL CAPS',
    '134.solution': 'Change banner abbreviation to ALT, BUS, BYP, CONN, LOOP, SPUR, or TRUCK',
    '134.params': {
        titleEN: 'Wrong banner abbreviation',
        problemEN: 'Banner abbreviation may be incorrect. Abbreviations ALT, BUS, BYP, CONN, LOOP, and SPUR should be in ALL CAPS',
        solutionEN: 'Change banner abbreviation to ALT, BUS, BYP, CONN, LOOP, SPUR, or TRUCK',
        template: '${street}#${altStreet[#]}',
        regexp: '/[0-9]+[A-Z]? ([Aa]lt(ernate)?|[Bb](us(iness)?|yp(ass)?)|[Cc]onn(ector)?|[Ll]oop|[Ss]pur|[Tt]ruck)/',
    },

    '135.enabled': true,
    '135.title': 'Wrong name on secondary road',
    '135.problem': 'Secondary state roads should follow the format S-##-XXX',
    '135.solution': "Change road name to only be S-##-XXX, where ## is the county number (remember, it doesn't go as a primary name, only alt)",
    '135.solutionLink': 'W:USA/South_Carolina#Naming',
    '135.params': {
        titleEN: 'Wrong name on secondary road',
        problemEN: 'Secondary state roads should follow the format S-##-XXX',
        solutionEN: "Change road name to only be S-##-XXX, where ## is the county number (remember, it doesn't go as a primary name, only alt)",
        template: '${state}:#${street}#${altStreet[#]}#',
        regexp: '/^South Carolina:.*#((S[- ]|State (Rd|Road|Rte|Route) )|.* S-[0-9]{1,2}-)[0-9]+#/i',
    },

    '136.enabled': true,
    '136.title': 'Name on railroad',
    '136.problem': 'Railroads should not be named',
    '136.solution': 'Remove the name from the railroad',
    '136.solutionLink': 'W:USA/Road_types#Railroad',
    '136.params': {
        titleEN: 'Name on railroad',
        problemEN: 'Railroads should not be named',
        solutionEN: 'Remove the name from the railroad',
        template: '${type}:${street}',
        regexp: '/^18:.+/',
    },
  
    '137.enabled': true,
    '137.title': 'Wrong abbreviation for Saint or Doctor',
    '137.problem': 'Saint and Doctor should be abbreviated St. and Dr., respectively',
    '137.solution': 'Add a period to the abbreviation',
    '137.params': {
        titleEN: 'Wrong abbreviation for Saint or Doctor',
        problemEN: 'Saint and Doctor should be abbreviated St. and Dr., respectively',
        solution: 'Add a period to the abbreviation',
        template: '${street}',
        regexp: '/^([NESW]{1,2} )?(St|Dr)(?!\.)\b/'
    },

    //Freeway lock
    '150.enabled': true,
    '150.params': {
    // {number} minimum lock level
        n: 5,
    },
    //Major Highway lock
    '151.enabled': true,
    '151.params': {
    // {number} minimum lock level
        n: 4,
    },
    //Minor Highway lock
    '152.enabled': true,
    '152.params': {
    // {number} minimum lock level
        n: 3,
    },
    //Ramp lock
    '153.enabled': true,
    '153.params': {
    // {number} minimum lock level
        n: 2,
    },
    //Primary Street lock
    '154.enabled': true,
    '154.params': {
    // {number} minimum lock level
        n: 2,
    },
};
