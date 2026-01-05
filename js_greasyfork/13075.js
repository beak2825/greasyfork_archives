// ==UserScript==
// @name                WME Validator Localization for Massachusetts
// @namespace           https://greasyfork.org/en/users/
// @version             1.03
// @author              Massachusetts Editors
// @credit              Credit to xanderb,tythesly, dsfargeg, and PesachZ for the base template.
// @description         This script localizes WME Validator for Massachusetts. You also need main package (WME Validator) installed.
// @match               https://editor-beta.waze.com/*editor/*
// @match               https://www.waze.com/*editor/*
// @grant               none
// @run-at              document-start
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAB9VBMVEUAAAD/gAD/nwD/lQD/nwD/mQD/lQD/kgD/mwD/lwD/nAD/mQD/lwD/mgD/mAD/mwD/mQD/lwD/mAD/mgD/mQD/mAD/mgD/mAD/mgD/mQD/mAD/mQD/mQD/mgD/mQD/////mAD/////mQD/////mQD/////mgD/mQD/////mAD/////mQD/mQD/mQD/////mgD//////Pj/mQD/////mAD/////mQD/mQD/////mgD/////mQD/mAD/////mQD/////mQD/////mgD/////mQD/mAD/////mQD/////mQD/mQD/////mQD/////mQD/////mQD/////mQD/////mQD/mQD/////mQD/////mQD/tkf/ulT/mQD/////mQD/mgD/mQD/////mgD/0Yz/mQD/////mQD///8AAAABAQECAgIDAwMJCQkRERESEhIWFhYZGRkaGhocHBwvLy8xMTFERERISEhXV1doaGhqamqBgYGEhISioqKjo6Ourq64uLi+vr7g4ODn5+fr6+v19fX4+Pj5+fn8/Pz9/f3+/v7/mQD/mwT/ngz/piD/qSj/rjT/s0D/uVD/u1T/w2j/xGz/xnD/x3T/zID/z4j/0Yz/05D/1pj/2aD/26T/3qz/5b//7M//79f/8dv/8t///Pf//fv////VAUOcAAAAaHRSTlMABAgMEBQYHBwgJCgsMDQ4PEBDR0tPU1dbX2Nna29zc3d3e3t/f4OHh4uLj5GTk5eXmZubn5+jp6erq6+zs7e3u7u/v8PHx8vLz9PT19fb29/f4+Pl5+fr6+3t7e/v8PLz8/T29/f7+1UbC/wAAAU+SURBVGje7drtf9NEHADwa7eWZRXWrKxrwAwfKlonghiRbt2YcQM2B4bCHChKFdpmPj/hs+KzLooPoKKITp3k7zRLcsk195iUvvHD71WbNPnud7mn3A0AUjxm24+AXoe9EU/c1VNjv+1Fe6KHSNsO4vEdvSEGi79e/vGH7y5e/MYKom44oet6TdN2l8tjilKQ85LUl+j+6eHKXMOKES3DOKTrrlyWhYh8NRYQjbIAIR+yugs+kqpYVq+RVLVrw1J5iNa9YSkcY6vVeyRdR3/87feXf/tj7a/19X/DNrnuxD9ra2t/Xrt29cqVn57SZvQ5wzgXB1HDej/9+982M94wTfMd2376fu/Pk6QhuaAoqtNONrMRAxpVaQ9TeM30YsX8wrYfjdXOC9CoAfAs5fYbt/7MROMVp5++h1FfI99h9V3O+J28vYohKyYeG/30FMXom+2s0ZmWj9zhjlbw7zZ5yop34tgOohFpN9thaQ3ARD7274Ik9CYxES+miEanMu0bM+Fohd3HNhkIZmQXo31AGtb2EgBN76oPgxut+k/oE9x4GxrHaQaibPEPnOvzS+stUygC5HaqYVnb/GPbwtI6ZpvC8S402gzDahW9g7CPrziJiBvhE5lgGIHycND1TK0mQZgGVGb9b7L7RF6NixzpMHJ1fBpQRDqunN9IvuoikdwSabJRDBHpJKtR0JQm17AsHQDYTNJoJ/KRKLKHb8w6bQN+Pkjod+nxKV5aDCNA8O79PD+Rg1xj0p1m0hGnQ6EZL2OJ5MlG1RtXWIgTr7MSORkaDZbBQ8h12j91r6DBR5x4ntJKRI0AST3UjN776qXr8OMLqPGSf/CAqAHgA5Ocz0c6DcsKFUYiFENL4fMhyf020UYNRCEY/mhVIBvjpEmXBA8cR4xQCScS70PkTvfnxRbfAEf9o7eEhw6ERqCYnUNyMFoJGUAPuno0zoa/jyodo5WYQUZU9ApPIXbyggYRUTuv6VDQ0YpiVLBJ0j585q9Gr3IVzziPJDLaEn3l0jBExa9zlRU0kSbxd7TXOgwhXguVFYg8GMfAkPSiRVNM873wsccx8EyyVOVF83NoHI5lgL2RGSVVefI6MtWPZxAePE2pPtD88gNvFnyWvNIyCsQRqpJy++mvL/xCNoogDsJQwP62/XNcg4ywFDAe26AgDCWBEczqS0BMuS+BQenq6QoxGgWQDImhNPIgKSKscA0WIqiEhlz2Qqat3gyChAqSR5m2UojNVmIqaFklRLjKEvo8kiIcZSmH/ha207G4CFPpNGi9hwDCUCJGNwhViRp0ZN4/McRoS9lTJOO5HBBFWI2RqTRyQBip+SdGQTzlVBaII5rYUntUIRl0BDagXSCOQjSCoh+OnijBlQNeT5p9hmfQn+9m+BzTPGXTGY4BYFXHVtSDhc4RIKrQDLBMbXMwxyoQVE7005a1Yab4qTG4nJoVU05Qd/5gydfxUwNxttc2naEb4NZwYRaLGZjKgICSYexgTtJeGTfeymAq88m2QIPdjNOMKpSCr/LW4pZukDy8DbFiKMhC23ByZCcsEHKe6GZpfe/WTLLSgmvCd1PqXuRd+WhtXC3KUn+iRKiDhkKb7xjGrK5Pa25UykGoilKSZQmpjn27g/Eyxd8FjBcNY17X91X1hRZjPSKIka62ydGXCFbHIU3eGKTC2ZGv3QBjgTtiSDsXujSWJKF/w1CrRnJjflC4xmeGSmWtNmfErQuny+kkrbhfkmRZHlHcuC1sJ7s0rarPGcuoUNveD3oTGWlIlouynM+Cm3Ez/rfxH6STRnmdq/GgAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/13075/WME%20Validator%20Localization%20for%20Massachusetts.user.js
// @updateURL https://update.greasyfork.org/scripts/13075/WME%20Validator%20Localization%20for%20Massachusetts.meta.js
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
  ".country": "Massachusetts State, USA",
  ".codeISO": "US",
  ".author": "<a href=http://www.waze.com/forum/ucp.php?i=pm&mode=compose&username=tythesly>tythesly</a>, <a href=http://www.waze.com/forum/ucp.php?i=pm&mode=compose&username=dsfargeg>dsfargeg</a>, and <a href=http://www.waze.com/forum/ucp.php?i=pm&mode=compose&username=PesachZ>PesachZ</a>",
  ".updated": "2015-10-11",
  ".link": "https://greasyfork.org/en/scripts/12793-wme-validator-localization-for-new-york",
  //Default US checks
  "27.enabled": true,
  "90.enabled": true,
  "106.enabled": true,
  "112.enabled": false,
/* #130  ## Disabled check for PLR <30m
  "130.enabled": true,
  "130.params": {
    "titleEN": "Short Parking Lot",
    "problemEN": "Dead End Parking Lot is less that 30 meters",
    "solutionEN": "Does it really need to be there?",
    "template": "${deadEnd}:${typeRank}:${length}",
    "regexp": "/1:7:([0-2]?[0-9])$/"
  },
  "130.solutionLink": "W:Best_map_editing_practice#Parking_Lots",
*/
  //  #131 ##Check that all segments have MA as state. This check is active everywhere.
  "131.enabled": true,
  "131.params": {
    "titleEN": "Not Massachusetts",
    "problemEN": "The segment is assigned to another state",
    "solutionEN": "Make sure you are editing in MA and change it. If you are editing outside MA you can disable this check by entering \"!131, *\" (without the quotes) in the Reported As: field of Validators search settings (magnifying glass)",
    "template": "${state}",
    "regexp": "!/^Massachusetts/"
  },
  "131.solutionLink": "W:Creating_and_editing_road_segments#Address_Properties",
  //  #132 ## Check for proper Exit ##: or to names, and check all ramps have an Exit or to name, or no-name.
  "132.enabled": true,
  "132.solutionLink": "W:Road_names/USA#Exit_ramps_and_entrance_ramps_.28on-ramps.29",
  "132.params": {
      "titleEN": "Improper Exit Naming",
      "problemEN": "This segment has an entrance / exit name which does not follow the USA standards for exit naming, or is a ramp with non entrance / exit name",
      "solutionEN": "For numbered exits use \"Exit(s) ##: Name / Other Name\". For entrances & unnumbered exits use \"to Name / Other Name\". Separate all shields and names with slashes (/) and spaces. Verify if this is supposed to be a ramp",
      "template": "${rank}#${street}",
      "regexp": "/4#(?!(Exit|to|$))|( |\\b)(To|[Ee](?!xits? [\\dA-Z-]+:)[Xx][Ii][Tt][Ss]?( [Tt][Oo])?:?|to:|TO|Exits? \\d+[\\w\\-]*( \\\/ | \\- | |:[ \\w]*:))( |\\b|$)/"
  },
  //  #133 ## Check for database generated improper city names.
  "133.enabled": true,
  "133.solutionLink": "W:Duplicate_cities#Changing_or_Merging_an_Entire_City_Name",
  "133.params": {
      "titleEN": "Improper City Naming",
      "problemEN": "This segment has a generated city name which is not its' proper name",
      "solutionEN": "Fill out the form to have the city renamed, and contact your SM or RC to finalize the process",
      "template": "${city}#${altCity[#]}",
      "regexp": "/(^|#)Greater [\\w -]+ Area|[\\w -]+\\(\\d+\\)(#|$)/"
  },
  //  #134  ## Check for lowercase banners
  "134.enabled": true,
  "134.params": {
    "titleEN": "Potential Incorrect BANNER Abbreviation",
    "problemEN": "Name abbreviation may be incorrect. Alternative routes should be labeled ALT and abbreviations ALT, BUS, BYP, CONN, LOOP, SCN, SPUR, or TRUCK should be in ALL CAPS",
    "solutionEN": "Change abbreviation to ALT, BUS, BYP, CONN, LOOP, SCN, SPUR, or TRUCK in ALL CAPS",
    "template": "${street}#{altStreet[#]}",
    "regexp": "/!?[0-9].+(Alt|Bus(iness)?|Byp|Conn?|L(oo)?p|Scn|Spu?r|Truck)\\b/"
  },
  //  #135  ## Blank
  //  #136  ## Check for lock standards on RR, Ferry statewide, and on PS, mH, MH in NYC.
  "136.enabled": true,
  "136.params": {
    "titleEN": "NYS Minimum Lock Levels",
    "problemEN": "NYC has higher locking levels than the rest of NYS. Ferries and RR should be locked as well",
    "solutionEN": "Lock the segment to at least; PS>=3, mH>=4, MH>=5, FW>=5, Ramp>=highest connection, Ferry>=5, RR>=2",
    "template": "${state}:${city}#${type}:${lock}",
    "regexp": "/^New York:((New York|Manhattan|Queens|Brooklyn|Bronx|Staten Island)#(6:[1-4]|7:[1-3]|2:[12])|.*#(15:[1-4]|18:1))/"
  },
  "136.solutionLink": "W:NY#Locking_standard",
  //  #137  ## Check for cardinals not properly capitalized, or encased in improper characters (eg quotes, dashes, slashes, colons, semicolons)
  "137.enabled": true,
  "137.params": {
    "titleEN": "Improper Cardinal Usage",
    "problemEN": "This name contains a cardinal direction (NEWS) which does not match wiki guidelines",
    "solutionEN": "If this cardinal should be spoken as a direction by TTS, make sure it has space on either side of it. If this cardinal should be spoken by TTS as a letter, follow it with a period. All cardinals should be capitalized",
    "template": "${street} ${altStreet[#]}",
    "regexp": "/(^| )([NEWS]?[news][NEWS]?|[\"\']?(([ns]|N(?!-\\d{1,3}\\b)|S(?!-\\d{1,2}[A-Z]\\b))[EeWw]?|[EeWw])[\'\":;-]|[\"\']([NnSs][EeWw]?|[EeWw])[\'\":-]?)(\\b|\\d| |$)/"
  },
  "137.solutionLink": "W:Abbreviations_and_acronyms/USA#Standard_suffix_abbreviations",
  //  #138  ## Check for standard hwy names (I-##, US-##, SR-##, CR-##, FS-##)
  "138.enabled": true,
  "138.params": {
    "titleEN": "Incorrect Hwy Name Prefix",
    "problemEN": "NY follows national guidelines for hwy naming prefixes (I-##, US-##, CR-##, FS-##), and uses NY-## for state routes",
    "solutionEN": "Rename the Street or Alt Street",
    "template": "${state}:${street}#${altStreet[#]}",
    "regexp": "/^Massachusetts:.*\\b((([Uu]\\.? ?( S|S(?!-\\d)[- ]|S\\.|s\\.?)|[Nn](?! \\d)(ew )?(y|Y- |[Yy]ork)? ?|[Ss]tate |[Ss] ?[RrHh]|[Cc]o(unty)? ?|[Rr]o?u?[Tt]e?|[Ff](s|S(?!-\\d)|[Rr]))([Ss][Pp][Uu][Rr]|[Rr]((ou)?(te)?|(oa)?d)|[Hh]((igh)?[Ww]a?[Yy])?)?|Ny|NY=|I- |[Cc]([HhrSs]|R(?!-\\d))|([Ii]|[NnCcUu][YyRrSs])[ =])[- ]{0,2}\\d+|([Uu] ?[Ss][- ]?)?([Hh](igh)?[Ww]a?[Yy] )?[Ff] ?([Ss] ?|[Ss]? ?[Rr])(oa)?d? )/"
  },
  "138.solutionLink": "W:NY#Major_roads",
  //  #139  ##  Check for common name errors causing improper TTS (Street/saint)
  "139.enabled": true,
  "139.params": {
    "titleEN": "Bad TTS Street name",
    "problemEN": "Streets that start with St and Dr result in TTS reading Street or Drive",
    "solutionEN": "Add a period after St or Dr at the beginning of the street name",
    "template": "${street}#${altStreet[#]}",
    "regexp": "/((^|#|(\\/|[NEWS]|Rue|Place)\\s)(St|Dr)|(Jr|Rev)) /"
  },
  "139.solutionLink": "W:Abbreviations_and_acronyms/USA#Recommended_abbreviations",
  //  #59  ## There already is a city on freeway check, enable it
  //  disabling city on fwy check for now, we allow city names on fwy in NY >> "59.enabled": true,
  //  #150 ## Freeway lock
  "150.enabled": true,
  "150.params": {
  // {number} minimum lock level
  "n": 5,
  },
  //  #151 ## Major Highway lock
  "151.enabled": true,
  "151.params": {
  // {number} minimum lock level
  "n": 4,
  },
  //  #152 ## Minor Highway lock
  "152.enabled": true,
  "152.params": {
  // {number} minimum lock level
  "n": 3,
  },
  //  #153 ## Ramp lock
  "153.enabled": true,
  "153.solutionLink": "W:Road_types/USA#Ramps",
  "153.params": {
  // {number} minimum lock level
    "n": 5,
    "problemEN": "Ramps generally connect to Freeways, so they should be locked to Lvl 5. If not connected to a freeway, verify that this meets the criteria to be a ramp",
    "solutionEN": "Lock the segment, change it to a non-ramp type, or just verify it should be a ramp",
  },
  //  #154 ## Primary Street lock
  "154.enabled": true,
  "154.params": {
  // {number} minimum lock level
  "n": 2,
  },
  //  #170 ## Enable check for lower case street name
  "170.enabled": true,
  "170.params": {
      regexp: "/^(?!to [^a-z])((S|N|W|E)(E|W)? )?[a-z]/"
  },
  //  #171 ## Check for improper use of a period (.) that is not on the USA recommended abbreviations list.
  "171.enabled": true,
  "171.solutionLink": "W:Abbreviations_and_acronyms/USA#Standard_suffix_abbreviations",
  "171.params": {
      "regexp": "/((?!(\\bPhila|\\bPenna|.(\\bWash|\\bCmdr|\\bProf|\\bPres)|..(Adm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|...(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|...(#| )[NEWSR])).{5}\\.|(?!(hila|enna|(\\bWash|\\bCmdr|\\bProf|\\bPres)|.(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|..(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|..(#| )[NEWSR])).{4}\\.|(?!(ila|nna|(ash|mdr|rof|res)|(\\bAdm|\\bSte|\\bCpl|\\bMaj|\\bSgt|\\bRe[vc]|\\bR\\.R|\\bGov|\\bGen|\\bHon|\\bCpl)|.(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|.(#| )[NEWSR])).{3}\\.|(?!(la|na|(sh|dr|of|es)|(dm|te|pl|aj|gt|e[vc]|\\.R|ov|en|on|pl)|(\\bSt|\\b[JSD]r|\\bLt|\\bFt)|(#| )[NEWSR])).{2}\\.|(#|^)[^NEWSR]?\\.)|(((?!\\bO).|#|^)\'(?![sl]\\b)|(?!\\bNat).{3}\'l|(#|^).{0,2}\'l)|(Dr|St)\\.(#|$)|,|;|\\\\|((?!\\.( |#|$|R))\\..|(?!\\.( .|#.|$|R\\.))\\..{2}|\\.R(#|$|\\.R))|[Ee]x(p|w)y|Tunl|Long Is\\b|Brg/",
      "problemEN": "The street name has incorrect abbreviation, or character",
      "solutionEN": "Check upper/lower case, a space before/after the abbreviation and the accordance with the abbreviation table. Remove any comma (,), backslash (\\), or semicolon (;)"
  },
};




// --------------------------- Modifications for permalink buttons to NYS Orthos, and FC Viewer below this point -------------------------------------------------

//  add NY Orthos PL button (credit: based on bookmarlet posted in NYS Waze wiki
function  open_map(server) {
  var center_lonlat=new OpenLayers.LonLat(wazeMap.center.lon,wazeMap.center.lat);
     center_lonlat.transform(new OpenLayers.Projection('EPSG:900913'),new OpenLayers.Projection('EPSG:4326'));
  var NYS_Orthos_PL = 'http://maps.massgis.state.ma.us/map_ol/oliver.php?center='+center_lonlat.lat+','+center_lonlat.lon+'&zoom='+((wazeMap.zoom)+12);
  
  window.open(NYS_Orthos_PL,'NYSOrthos');
}
 
var WazePermalink;
setTimeout(function() {
 
    WazePermalink = document.getElementsByClassName('WazeControlPermalink')[0];
    var map_links = document.createElement('span');
 
 
    map_links.innerHTML = '<img src="http://maps.massgis.state.ma.us/map_ol/img/oliver_small.png" alt="NYS Orthos" width="18" height="18" id="NYS_Orthos_PL" title="NYS Orthos Permalink" style="cursor: pointer; float: left; display: inline-block; margin: 2px 5px 0 3px;"> ';
    map_links.innerHTML += '<style>.olControlAttribution {display: none;}</style>';
 
 
    WazePermalink.appendChild(map_links);
 
    document.getElementById("NYS_Orthos_PL")
        .addEventListener("click", open_map, false);
 
}, 5000);
// End pl button

//  add NY FC PL button (credit: Joyriding)
// TODO: 1) Move away from external library. 2) Fix zoom issue or wait until NY FC Viewer is upgraded. 3) Fix centering issue.
function  open_FC(server) {
    var e=wazeMap.getExtent();
    var geoNW=new OL.Geometry.Point(e.left,e.top);
    var geoSE=new OL.Geometry.Point(e.right,e.bottom);
    
    // Currently using Proj4js library (http://proj4js.org/) to handle the projection transformation to EPSG:26918. 
    // The Proj4hs library is referenced in the header.  If we continue to use it we should host it somewhere stable other than its source repository.
    // Transformation is also not perfect, the center is off by a small amount. I have not looked into why that is yet. May just be diffences in initial zoom vs scale.
    //
    // ** To move away from an external library we must understand and implement the conversion forumlas.
    // An example for creating a custom projection: http://openlayers.org/en/master/examples/wms-custom-proj.html?mode=raw
    // We would need to implement all of the functions they define there, customized for EPSG:26918.
    
    Proj4js.defs["EPSG:26918"] = "+proj=utm +zone=18 +ellps=GRS80 +datum=NAD83 +units=m +no_defs";

    var source = new Proj4js.Proj('EPSG:900913');    
    var dest = new Proj4js.Proj('EPSG:26918');

    var geoNW = new Proj4js.Point(geoNW.x,geoNW.y);
    var geoSE = new Proj4js.Point(geoSE.x,geoSE.y);

    Proj4js.transform(source, dest, geoNW);
    Proj4js.transform(source, dest, geoSE);
    
    // Zoom/scale in the NY FC Viewer does not currently work and defaults to 400ft if a location is specified.
    // I don't yet know exactly how zoom/scale levels are represented, but the values below work as expected if a location (&extents=) is not given.
    // If the NY FC Viewer is ever upgraded the zoom should then work correctly.
    
    // FC Viewer supports displaying FC layer at 400 ft - 4 mile scale
    // 4 mile: 288895.277144
    // 2 mile: 144447.638572
    // 1 mile: 72223.819286 
    // 0.4 mile: 36111.909643 
    // 0.2 mile: 18055.954822
    // 600 ft: 9027.977411
    // 300 ft: 4513.988705
    // 200 ft: 2256.994353
    // 60 ft: 1128.497176
    
    // WME zoom levels to FC Viewer scale:
    // zoom 0 / 1 mile : 72223.819286
    // zoom 1 / 5000 ft : 72223.819286
    // zoom 2 / 2000 ft : 36111.909643
    // zoom 3 / 1000 ft : 18055.954822
    // zoom 4 / 500 ft : 9027.977411
    
    var mapScale = 36111.909643
    
    switch (wazeMap.zoom) {
    case 0:
    case 1:
        mapScale = 72223.819286;
        break;
    case 2:
        mapScale = 36111.909643;
        break;
    case 3:
        mapScale = 18055.954822;
        break;
    default:
        mapScale = 9027.977411;
        break;
    }
        
    var URL='http://gis3.dot.ny.gov/html5viewer/?viewer=FC&scale='+mapScale+'&extent='+geoNW.x+'%2C'+geoNW.y+'%2C'+geoSE.x+'%2C'+geoSE.y;
    
    window.open(URL,"_blank");
}
 
var WazePermalinkFC;
setTimeout(function() {
 
    WazePermalinkFC = document.getElementsByClassName('WazeControlPermalink')[0];
    var map_links = document.createElement('span');
 
 
    map_links.innerHTML = '<img src="https://www.dot.ny.gov/favicon.ico" alt="NYS FC" width="18" height="18" id="NYS_FC_PL" title="NYS FC Permalink" style="cursor: pointer; float: left; display: inline-block; margin: 2px 5px 0 3px;"> ';
    map_links.innerHTML += '<style>.olControlAttribution {display: none;}</style>';
 
 
    WazePermalinkFC.appendChild(map_links);
 
    document.getElementById("NYS_FC_PL")
        .addEventListener("click", open_FC, false);
 
}, 5000);
// End pl button

//  add NYCityMap PL button
// TODO: 1) Move away from external library. 2) Fix zoom issue or wait until NY FC Viewer is upgraded. 3) Fix centering issue.
function  open_NYC(server) {
    
   var geoPoint=new OL.Geometry.Point(wazeMap.center.lon,wazeMap.center.lat);

   Proj4js.defs["ESRI:102718"] = "+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 no_defs";

   var source = new Proj4js.Proj('EPSG:900913');    
   var dest = new Proj4js.Proj('ESRI:102718');

   Proj4js.transform(source, dest, geoPoint);

    
    // Currently using Proj4js library (http://proj4js.org/) to handle the projection transformation to EPSG:26918. 
    // The Proj4hs library is referenced in the header.  If we continue to use it we should host it somewhere stable other than its source repository.
    // Transformation is also not perfect, the center is off by a small amount. I have not looked into why that is yet. May just be diffences in initial zoom vs scale.
    //
    // ** To move away from an external library we must understand and implement the conversion forumlas.
    // An example for creating a custom projection: http://openlayers.org/en/master/examples/wms-custom-proj.html?mode=raw
    // We would need to implement all of the functions they define there, customized for EPSG:26918.
    
    var zoom = (wazeMap.zoom)+3;
    
    var URL='http://maps.nyc.gov/doitt/nycitymap/?z='+zoom+'&p='+Math.round(geoPoint.x)+','+Math.round(geoPoint.y)+'&c=GISBasic&f=DDC_PROJECTS';
    
    window.open(URL,"_blank");
}
 
var WazePermalinkNYC;
setTimeout(function() {
 
    WazePermalinkNYC = document.getElementsByClassName('WazeControlPermalink')[0];
    var map_links = document.createElement('span');
 
 
    map_links.innerHTML = '<img src="http://i.imgur.com/GnnrKxc.png" alt="NYCityMap" width="18" height="18" id="NYC_PL" title="NYCityMap Permalink" style="cursor: pointer; float: left; display: inline-block; margin: 2px 5px 0 3px;"> ';
    map_links.innerHTML += '<style>.olControlAttribution {display: none;}</style>';
 
 
    WazePermalinkNYC.appendChild(map_links);
 
    document.getElementById("NYC_PL")
        .addEventListener("click", open_NYC, false);
 
}, 5000);
// End pl button