// ==UserScript==
// @name        Reversewigo solver ✓🐵 DEV
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  Reversewigo solver ✓🐵  - solve reverse wherigo automatically on cache page. Solver code originated from Rick Rickhardson's reverse-wherigo source (public domain). Also, creates show source button for mystery cacahes.
// @author       mrummuka@hotmail.com
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_setClipboard
// @match       https://*.geocaching.com/geocache/*
// @match       https://*.geocaching.com/*/cache_details*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://cdn.jsdelivr.net/gh/xxjapp/xdialog@3.4.0/xdialog.js#sha256=r4yDdWZiML48gILBpDiF+c3/aq7ljwt7wRCtqzl6AvI=
// @resource   IMPORTED_CSS https://cdn.jsdelivr.net/gh/xxjapp/xdialog@3/xdialog.css
// @grant      GM_getResourceText
// @grant      GM_addStyle
//

// @downloadURL https://update.greasyfork.org/scripts/404444/Reversewigo%20solver%20%E2%9C%93%F0%9F%90%B5%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/404444/Reversewigo%20solver%20%E2%9C%93%F0%9F%90%B5%20DEV.meta.js
// ==/UserScript==

//TODO: copy to clipboard button for final solved coords!
// placeholder for calculated reverse wherigo coordinates
// used by pollDOM to update them to popup dialog
// TODO: definitely not the best practise but a quick hack that seems to work (for now)
var newCoordinates = "";
let DEBUG = true;

GM_registerMenuCommand("Configure", () => { gmc.open() }, "C");
GM_registerMenuCommand("Set codes", () => { readCodes() }, "S");
let minmaxRangeObj;

let gmc = new GM_config(
    {
      'id': 'MyConfig', // The id used for this instance of GM_config
      'title': 'Script Settings', // Panel Title
      'fields': // Fields object
      {
        'OutputDD':
        {
        'label': 'Show dd (decimal degrees) format (60.12345 25.4321) coordinates in output', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': false // Default value if user doesn't change it
        },
        'OutputCodes':
        {
        'label': 'Show wherigo codes in output', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': false // Default value if user doesn't change it
        }
        ,
        'OutputDistance':
        {
        'label': 'Show distance to bogus in output', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': false // Default value if user doesn't change it
        },
        'replaceInfoHTML':
        {
        'label': 'Replace HTML element with content? (default: only append)', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': false // Default value if user doesn't change it
        },
        'infoHtmlElID':
        {
        'label': 'HTML element id for info', // Appears next to field
        'type': 'text', // Makes this setting a checkbox input
        'default': "ctl00_ContentBody_CacheInformationTable" // Default value if user doesn't change it
        },
        'replaceRegexHTML':
        {
        'label': 'Replace HTML element with regexp result? (default: only append)', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': false // Default value if user doesn't change it
        },
         'regexHtmlElID':
        {
        'label': ' HTML element id for regexp results', // Appears next to field
        'type': 'text', // Makes this setting a checkbox input
        'default': "ctl00_ContentBody_detailWidget" // Default value if user doesn't change it
        }
        ,
        'addBogusDDToPage':
        {
        'label': 'Show bogus in DD', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
        },
        'addMinMaxLatLonToPage':
        {
        'label': 'Show min/max lon/lat', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
        },
        'addMinMaxLatLonDDToPage':
        {
        'label': 'Show min/max lon/lat also in DD', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
        },
        'parsedBogusOverride':
        {
        'label': 'Manual override for bogus coordinates (use dd syntax eg. 60.1234 24.42134).', // Appears next to field
        'type': 'text', // Makes this setting a text input
        'default': "" // Default value if user doesn't change it
        },
        'writeFinalToClipboard':
        {
        'label': 'Write final coordinates directly to clipboard?', // Appears next to field
        'type': 'checkbox', // Makes this setting a checkbox input
        'default': true // Default value if user doesn't change it
        }
      },
      'events': {
        'init': () => {
            // initialization complete
            // value is now available
            gmc.initializedResolve && gmc.initializedResolve();
            gmc.initializedResolve = null;
          }
      }
    });

    gmc.initialized = new Promise(r=>(gmc.initializedResolve=r));

 async function dd2dm(latdd, londd) {
    if(DEBUG) console.debug("Starting dd2dm", latdd, londd);
    var lat = latdd;
    var lon = londd;

    var latResult, lonResult, dmsResult;

    lat = parseFloat(lat);
    lon = parseFloat(lon);

    latResult = await lat_dd2dm(lat);
    lonResult = await lon_dd2dm(lon);

    // Joining both variables and separate them with a space.
    dmsResult = latResult + ' ' + lonResult;

    // Return the resultant string
    if(DEBUG) console.debug("Finishing dd2dm", dmsResult, latResult, lonResult);
    return { result: dmsResult, lat: latResult, lon: lonResult };
}

 async function lat_dd2dm(val) {
    var valDeg, valMin, result;

    val = Number(val);
    result = (val >= 0)? 'N' : 'S';
    result += " ";

    val = Math.abs(val);
    valDeg = Math.floor(val);

    if( valDeg < 10 ) {
    result += "0" + valDeg;
    }
    else {
    result += valDeg;
    }
    result += "\xB0";
    result += " ";

    valMin = ((val - valDeg) * 60).toFixed(3);
    if( valMin < 10) {
        result += "0" + valMin;
    }
    else {
        result += valMin;
    }
    return result;
}

 async function lon_dd2dm(val) {
    var valDeg, valMin, result;

    val = Number(val);

    result = (val >= 0)? 'E' : 'W';
    result += " ";

    val = Math.abs(val);
    valDeg = Math.floor(val);

    if( valDeg < 10 ) {
        result += "00" + valDeg;
    }
    else if( valDeg < 100) {
        result += "0" + valDeg;
    }
    else {
        result += valDeg;
    }
    result += "\xB0";
    result += " ";

    valMin = ((val - valDeg) * 60).toFixed(3);
    if( valMin < 10) {
        result += "0" + valMin;
    }
    else {
        result += valMin;
    }
    return result;
}

// convert latitude longitude array [ lat side (N/S), lat deg, lat mindec, lon side (E/W), lon deg, lon mindec ] to dd
// return { lat: latitude dd , lon: longitude dd }
async function bogusStr2DD( coordsStr ) {
    let coordsArr = coordsStr.split(" ");
    let lat = await dm2dd( coordsArr[0], coordsArr[1], coordsArr[2] );
    let lon = await dm2dd( coordsArr[3], coordsArr[4], coordsArr[5] );
    return { lat: lat, lon: lon };
}
async function coordStr2DD( coordsStr ) {
    let coordsArr = coordsStr.split(" ");
    let lat = await dm2dd( "N", coordsArr[0], coordsArr[1] );
    let lon = await dm2dd( "E", coordsArr[2], coordsArr[3] );
    return { lat: lat, lon: lon };
}

// calculate minimum possible latitude (usually 3200m south from bogus)
// @return latitude in DD
async function minLat(crd, distance) {
    console.debug("Starting minLat");

    let res = await haversineProjection( crd.lat, crd.lon, 180, distance );
    console.debug( JSON.stringify(res) );
    return res[0];
}
// calculate maximum possible latitude (3200m north from bogus)
// @return latitude in DD
async function maxLat(crd, distance) {
    console.debug("Starting maxLat");

    let res = await haversineProjection( crd.lat, crd.lon, 0, distance );
    console.debug( JSON.stringify(res) );
    return res[0];
}
// calculate minimum possible longitude (3200m west from bogus)
// @return longitude in DD
async function minLon(crd, distance) {
    console.debug("Starting minLon");
    
    let res = await haversineProjection( crd.lat, crd.lon, 270, distance );
    console.debug( JSON.stringify(res) );
    return res[1];
}
// calculate maximum possible longitude (3200m east from bogus)
// @return longitude in DD
async function maxLon(crd, distance) {
    console.debug("Starting maxLon");

    let res = await haversineProjection( crd.lat, crd.lon, 90, distance );
    console.debug( JSON.stringify(res) );
    return res[1];
}

// returns { minLat, minLon, maxLat, maxLon } ie
// minimum and maximum latitude/longitude values with (usually) 3.2km from bogus
async function minmaxRange(crd, distance) {
    console.debug("Starting minmaxRange for", crd, " at ", distance);

    let minLatVal = await minLat(crd, distance);
    let maxLatVal = await maxLat(crd, distance);
    let minLonVal = await minLon(crd, distance);
    let maxLonVal = await maxLon(crd, distance);

    let minmax = { 
        minLat : minLatVal, 
        minLon : minLonVal, 
        maxLat : maxLatVal, 
        maxLon : maxLonVal, 
        distance : distance, 
        origin_lat : crd.lat,
        origin_lon : crd.lon }
    return minmax;
}
/*********
 * calculate min and max possible lat & lon
 */

async function minmaxLatLon2DDM( minmaxObj ) {
    console.debug("Starting minmaxLatLon2DDM() for", minmaxObj)

    let minLatDDM = await lat_dd2dm(minmaxObj.minLat)
    let maxLatDDM = await lat_dd2dm(minmaxObj.maxLat)

    let minLonDDM = await lon_dd2dm(minmaxObj.minLon);
    let maxLonDDM = await lon_dd2dm(minmaxObj.maxLon);

    return { minLat : minLatDDM, minLon : minLonDDM, maxLat : maxLatDDM, maxLon : maxLonDDM }
}


 async function code2LatLon(varA, varB, varC) {
    let latSign, lonSign, lonValue, latValue;

    console.debug("Converting [" + varA + ", " + varB + ", " + varC + "] to LatLon" )

    // 123456 => digit 1 (d1) = 6; digit 2 (d2) = 5; ...
    // syntax for varA => digit 1 var A = A1; digit 2 varA = A2; ...
    // A3
    if ((varA % 1000 - varA % 100) / 100 == 1) {
        latSign = 1;
        lonSign = 1;
    }
    // A3
    else if ((varA % 1000 - varA % 100) / 100 == 2) {
        latSign = -1;
        lonSign = 1;
    }
    // A3
    else if ((varA % 1000 - varA % 100) / 100 == 3) {
        latSign = 1;
        lonSign = -1;
    }
    // A3
    else if ((varA % 1000 - varA % 100) / 100 == 4) {
        latSign = -1;
        lonSign = -1;
    }
//T41140 / Q1TQ01 / 14S4RS
    // A6 B3 B4 B6 C1 C2 C4
    // TODO: how to iterate only these, not full range ??
    // C (d5 + d2) eli C5 + C2 = parillinen
    if ( ((varC % 100000 - varC % 10000) / 10000 + (varC % 100 - varC % 10) / 10) % 2 === 0) {
        // A4 B2  B5 C3 A6 C2 A1
        latValue = Number(((varA % 10000 - varA % 1000) / 1000 * 10 + (varB % 100 - varB % 10) / 10 + (varB % 100000 - varB % 10000) / 10000 * 0.1 + (varC % 1000 - varC % 100) / 100 * 0.01 + (varA % 1000000 - varA % 100000) / 100000 * 0.001 + (varC % 100 - varC % 10) / 10 * 1.0E-4 + varA % 10 * 1.0E-5));
        // A5 C6 C1  B3 B6 A2 C5 B1
        lonValue = Number(((varA % 100000 - varA % 10000) / 10000 * 100 + (varC % 1000000 - varC % 100000) / 100000 * 10 + varC % 10 + (varB % 1000 - varB % 100) / 100 * 0.1 + (varB % 1000000 - varB % 100000) / 100000 * 0.01 + (varA % 100 - varA % 10) / 10 * 0.001 + (varC % 100000 - varC % 10000) / 10000 * 1.0E-4 + varB % 10 * 1.0E-5));
    }
    // C (d5 + d2) eli C5+C2= pariton
    else if ( ((varC % 100000 - varC % 10000) / 10000 + (varC % 100 - varC % 10) / 10) % 2 !== 0) {
        // B6 A1  A4 C6 C3 C2 A6
        latValue = Number(((varB % 1000000 - varB % 100000) / 100000 * 10 + varA % 10 + (varA % 10000 - varA % 1000) / 1000 * 0.1 + (varC % 1000000 - varC % 100000) / 100000 * 0.01 + (varC % 1000 - varC % 100) / 100 * 0.001 + (varC % 100 - varC % 10) / 10 * 1.0E-4 + (varA % 1000000 - varA % 100000) / 100000 * 1.0E-5))
        // B2 C1 A2  A5 B3 B1 C5 B5
        lonValue = Number(((varB % 100 - varB % 10) / 10 * 100 + varC % 10 * 10 + (varA % 100 - varA % 10) / 10 + (varA % 100000 - varA % 10000) / 10000 * 0.1 + (varB % 1000 - varB % 100) / 100 * 0.01 + varB % 10 * 0.001 + (varC % 100000 - varC % 10000) / 10000 * 1.0E-4 + (varB % 100000 - varB % 10000) / 10000 * 1.0E-5));
    }
    // B4 C4 = ALWAYS ignore

    latValue = latSign * latValue;
    lonValue = lonSign * lonValue;

    return { lat: latValue, lon: lonValue }
}

function fix(v, left, right) {
    return (v < 0 ? '-' : ' ') + Math.abs(v).toFixed(right).padStart(left + right + 1, '0');
}

async function haversineDistance(lat1,lon1,lat2,lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in metres
    return d;
  }

const degrees_to_radians = deg => (deg * Math.PI) / 180.0;
const radians_to_degrees = rad => (rad * 180.0) / Math.PI;

// φ is latitude, λ is longitude,
async function haversineProjection(lat1, lon1, degr, dist) {
    const R = 6371e3; // metres

    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const λ1 = lon1 * Math.PI/180;
    let θ = degrees_to_radians(degr);
    let d = dist;

    const δ = d/R;
    const Δφ = δ * Math.cos(θ);
    const φ2 = φ1 + Δφ;

    const Δψ = Math.log(Math.tan(φ2/2+Math.PI/4)/Math.tan(φ1/2+Math.PI/4));
    const q = Math.abs(Δψ) > 10e-12 ? Δφ / Δψ : Math.cos(φ1); // E-W course becomes ill-conditioned with 0/0

    const Δλ = δ*Math.sin(θ)/q;
    const λ2 = λ1 + Δλ;

    // check for some daft bugger going past the pole, normalise latitude if so
    if (Math.abs(φ2) > Math.PI/2) φ2 = φ2>0 ? Math.PI-φ2 : -Math.PI-φ2;

    let lat2 = φ2 / Math.PI * 180;
    let lon2 = λ2 / Math.PI * 180;
    return [ lat2 , lon2 ]
}

async function dm2dd( nsew, deg, min ) {
      let sign;
      if( nsew == 'N' || nsew == 'E' ) {
          sign = 1;
      }
      else {
          sign = -1;
      }

      let numdeg = parseInt(deg);
      let nummin = parseFloat(min);

      let dd = sign * (numdeg + nummin/60);
      return dd;
  }

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function createShowSourceButton() {
    console.debug("Starting createShowSourceButton");

    let mybutton = document.createElement("srcbutton");
    mybutton.innerHTML = "View source";
    mybutton.setAttribute("style", "-webkit-appearance: button;-moz-appearance: button;appearance: button;  background-color: green; color: white; border: none; text-align: center;  display: inline-block; padding: 3px 10px; border: 1px solid black; cursor: pointer;");
    let noteref = document.getElementsByClassName("minorCacheDetails Clear")[0];
    noteref.appendChild(mybutton);

    mybutton.addEventListener("click", function() {
        var desc1 = document.getElementById("ctl00_ContentBody_ShortDescription").innerHTML;
        var desc2 = document.getElementById("ctl00_ContentBody_LongDescription").innerHTML;
        xdialog.open({
            title: 'UserSuppliedContent from source',
            body: '\
            <div style="height: auto; border: 1px solid green; padding: 0.5em;">\
            <pre>'+escapeHtml(desc1)+"\n"+escapeHtml(desc2)+
            '</pre>\
            </div>',
            style: 'width: 80%;'
        });
    });
}

async function createLaunchRwigoButton() {
    console.debug("Starting launchRwigoButton");

    await gmc.initialized.then();

    let mybuttonRW = document.createElement("rwigobutton");
    mybuttonRW.innerHTML = "RWIGO";
    mybuttonRW.setAttribute("style", "-webkit-appearance: button;-moz-appearance: button;appearance: button;  background-color: green; color: white; border: none; text-align: center;  display: inline-block; padding: 3px 10px; border: 1px solid black; cursor: pointer;");
    let noterefRW = document.getElementsByClassName("minorCacheDetails Clear")[0];
    noterefRW.appendChild(mybuttonRW);

    mybuttonRW.addEventListener("click", function() {
        rwigoAssistDialog();
    });
}

async function createShowSolveREReverseButton() {
    console.debug("Starting createShowSolveREReverseButton");

//    let mybutton = document.createElement("solvebutton");
    let mybutton = document.createElement("a");
    mybutton.innerHTML = "Solve Regexp";

    mybutton.className = "mybtn"
    //css
    mybutton.setAttribute("style", "-webkit-appearance: button;-moz-appearance: button;appearance: button;  background-color: green; color: white; border: none; text-align: center;  display: inline-block; padding: 3px 10px; border: 1px solid black; cursor: pointer;");


    let noteref = document.getElementsByClassName("minorCacheDetails Clear")[0];
    noteref.appendChild(mybutton);

    mybutton.addEventListener("click", function() {
         solveReverseRE();
    });

}

async function createDialog( ) {
    console.debug("Starting createDialog");

    await gmc.initialized.then();

    let mydialog = document.createElement("div");
    mydialog.id = "dialog";
    mydialog.title = "Results";
    let resultmsg = document.createElement("p");
    resultmsg.id = "resultmsg";
    mydialog.appendChild(resultmsg);

    // initialization complete
    // value is now available
    let reElID = gmc.get('regexHtmlElID');
    console.debug("rexegHtmlElID", reElID);

    // regexHtmlElID by default ctl00_ContentBody_detailWidget
    let noteref = document.getElementById( reElID );

    let replace = gmc.get('replaceInfoHTML');
    if( replace ) {
        noteref = mydialog;
    }
    else {
        noteref.appendChild(mydialog);
    }    
}

// TODO: definitely not the best practice, but works (for now)
function pollDOM() {
    console.debug("Starting pollDOM");

    const newCrd = document.getElementById('newCoordinates');

    if (newCrd != null) {
      // Do something with el
      newCrd.value = newCoordinates;

      let submitBtn = document.getElementsByClassName("btn-cc-parse")[0];
      //ssubmitBtn.click();
      } else {
      setTimeout(pollDOM, 1000); // try again in 300 milliseconds
    }
}

async function updateCoordinates( newCoords ) {
    console.debug("Starting updateCoordinates", newCoords);

    let crd = document.getElementById("uxLatLonLink");
    crd.click();

    newCoordinates = newCoords;

    pollDOM();
    console.debug("XX: " + newCoords);
}


async function getBogusStringFromPage() {
    console.debug("Starting getBogusStringFromPage");
    let uxlatlonel = document.getElementById("uxLatLon")
    if ( uxlatlonel != null ) {
        return uxlatlonel.textContent;
    }
    console.error("uxLatLon element not found")
    throw new Error("uxLatLon element not found");
}

// retrieve bogus coordinates in ddm
// returns array [ lat side (N/S), lat deg, lat mindec, lon side (E/W), lon deg, lon mindec ];
async function getBogusCoordsFromPage() {
    console.debug("Starting getBogusCoordsFromPage");

    let uxlatlonText = await getBogusStringFromPage();
        if(uxlatlonText != null ) {
            let coords = uxlatlonText.split(" ");
            if( coords.length != 6 ) {
                console.error("Error parsing coordinates");
                throw new Error("uxLatLon element not found");
            }
            else {
                return coords;
            }

        }
}

async function getBogusCoordsDD() {
    if(DEBUG) console.debug("Starting getBogusCoordsDD");
    await gmc.initialized.then();

    // checking if we have user override for parsed bogus coordinates
    let userOverrideBogus = gmc.get('parsedBogusOverride');
    if( userOverrideBogus == "" ) {
        if(DEBUG) console.debug("No user override for bogus")
        let bogusLatLonArr = await getBogusCoordsFromPage();
        if(DEBUG) console.debug("Got bogus", JSON.stringify(bogusLatLonArr));
        // convert bogus coordinates from deg-min-dec to deg-dec
        let bogusDD = await latLonDmArr2dd(bogusLatLonArr);
        if(DEBUG) console.debug("Got bogus", JSON.stringify(bogusDD));
        return bogusDD;
    }
    else {
        //bogusDD.lat + "  " + bogusDD.lon
        if(DEBUG) console.debug("Using parsedBogusOverride", parsedBogusOverride);
        let userOverrideBoguslat = userOverrideBogus.trim().split(" ")[0];
        let userOverrideBoguslon = userOverrideBogus.trim().split(" ")[1];
        let userOverrideBogusObj = {
            lat: userOverrideBoguslat,
            lon: userOverrideBoguslon
        }; 
        if(DEBUG) console.debug("Got userOverrideBogusObj", JSON.stringify(userOverrideBogusObj) );
        return userOverrideBogusObj;    
    }
}

// convert latitude longitude array [ lat side (N/S), lat deg, lat mindec, lon side (E/W), lon deg, lon mindec ] to dd
// return { lat: latitude dd , lon: longitude dd }
async function latLonDmArr2dd( latLonDmArray ) {
    console.debug("Starting latLonDmArr2dd", latLonDmArray);

    // convert bogus coordinates from deg-mindec to deg-dec
    let bogusLat = await dm2dd( latLonDmArray[0], latLonDmArray[1], latLonDmArray[2] );
    let bogusLon = await dm2dd( latLonDmArray[3], latLonDmArray[4], latLonDmArray[5] );
    return { lat : bogusLat, lon : bogusLon }
}

// htmlsnip = html snippet in string
// replace = boolean; true = replace existing html fully
async function addHTMLtoPage( htmlsnip ) {
    console.debug("Starting addHTMLtoPage", htmlsnip);

    await gmc.initialized.then();

//    let docEl = document.getElementsByClassName("Note Disclaimer")[0];
    //let docEl = document.getElementById("ctl00_ContentBody_CacheInformationTable");
    let docEl = document.getElementById( gmc.get('infoHtmlElID') );

    let replace = gmc.get('replaceInfoHTML')
    if( replace ) {
        docEl.innerHTML = htmlsnip;
    }
    else {
        docEl.innerHTML = docEl.innerHTML + htmlsnip;
    }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function* makeRangeIterator(start = 0, end = 100, step = 1) {
    let iterationCount = 0;
    for (let i = start; i < end; i += step) {
        iterationCount++;
        yield i;
    }
    return iterationCount;
}

async function* makeRangeIterator2(variables = 1, start = 0, end = 100, step = 1) {
    let iterationCount = 0;
    for (let i = start; i < end; i += step) {
        iterationCount++;
        yield i;
    }
    return iterationCount;
}

async function testGenerator() {
    const it = await makeRangeIterator(0, 9, 1);

    let result = it.next();
    while (!result.done) {
        console.log(result.value); // 0 1 2 3 4 5 6 7 8 9
        result = it.next();
    }

}

// Works in Chrome devtools console
async function* codeGenerator ( codes, vars ) {
    // check if no variables left => return final codes
    console.debug("Vars.length = " + vars.length);

    if( vars == null || vars.length == 0 ) {
        console.debug("Yield" + JSON.stringify(codes));
        yield codes;
    }
    else {
        // generate regexp to replace VAR => number
        let replRE = new RegExp("/"+vars[0]+"/g");
        console.debug("RE " + JSON.stringify(replRE));

        // for each var value [0,9]
        for(let i=0; i<10; i++ ) {
            let c = [];
            c[0] = codes[0].replace(vars[0], i.toString());
            c[1] = codes[1].replace(vars[0], i.toString());
            c[2] = codes[2].replace(vars[0], i.toString());
            console.debug("/"+vars[0]+"/g -> " + JSON.stringify(c));
            // recursively get the other variables processed
            yield* await codeGenerator( c, vars.slice(1) );
        }
    }
}

// replace char at position index for string with replacement
String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

async function solveReverseRE() {
    console.debug("Starting solveReverseRE");
    await gmc.initialized.then();

    //TODO: replace with loadCodes() parseCodes()
    console.debug("Attempting to parse codes from note.");
    let resultmsg = document.getElementById("resultmsg");
    resultmsg.innerText = "Generated coordinates:\n";

    let codes = await parseCodesFromNote();
    if(codes.length != 3) {
        console.error("Error: >3 or <3 codes found:" + JSON.stringify(codes));
    }

    // cleanse
    for(let i=0; i<3; i++) {
      codes[i] = codes[i].trim();
    }
    console.debug("Parsed: " + JSON.stringify(codes));


    // TODO: remove vars from non meaningful items : B4 C4 = ALWAYS ignore
    console.log("Emptying non-meaninful digits B4 C4");
    codes[1] = codes[1].replaceAt( 6-4, "0"); //reset B4
    codes[2] = codes[2].replaceAt( 6-4, "0"); //reset C4

    console.debug("Cleansed: " + JSON.stringify(codes));
// TODO end loadCodes()

// TODO start regexp from here

    // calculate # of variables/unknowns per code
    let vars = [];
    for(let i=0; i<3; i++) {
        let matching = codes[i].match(/[A-Za-z]/g);
        if(matching != null) {
            vars = vars.concat( matching );
        }
    }
    console.debug("Vars: " + JSON.stringify(vars));
    let uniqVars = vars.filter(onlyUnique);

    console.log(uniqVars.length + " unique variables");
    console.warn("Possible total combos: " + 10**uniqVars.length);

    let bogusDD = await getBogusCoordsDD();

    console.debug("Converted coords: " + bogusDD.lat + "  " + bogusDD.lon);
    console.debug("Iterating...");

    console.log("code1,code2,code3,lat(dd),lon(dd),lat(gps),lon(gps),dist(m)");
    let counter = 0;

    let codeGen = await codeGenerator( codes, uniqVars );

    let nextCode = await codeGen.next();
    console.debug(JSON.stringify(nextCode));
    while (!nextCode.done) {
        // convert to dd
        let ddlatlon = await code2LatLon( parseInt( nextCode.value[0] ), parseInt( nextCode.value[1] ) , parseInt( nextCode.value[2]) );
        console.debug("Convertion results: " + JSON.stringify(ddlatlon));
        if( ddlatlon.lat == NaN || ddlatlon.lon == NaN ) continue;
        else {
            let dist = await haversineDistance( bogusDD.lat, bogusDD.lon, ddlatlon.lat, ddlatlon.lon );
            console.debug("distance:", dist);
            if( dist < 3220 ) {
                counter = counter+1;
                let dmlatlon =  await dd2dm( ddlatlon.lat, ddlatlon.lon);
                let result = nextCode.value[0] + "," + nextCode.value[1] + "," + nextCode.value[2] + "," + fix(ddlatlon.lat, 2, 6) + "," + fix(ddlatlon.lon, 3, 6) + "," + dmlatlon.lat + "," + dmlatlon.lon + "," + dist.toFixed(0) ;
                console.log(result);

                let result2 = "";
                // if config output DD on, print also DD coords to output (makes it easier to deduce some variables)
                if( gmc.get('OutputDD') ) {
                    result2 = fix(ddlatlon.lat, 2, 6) + " " + fix(ddlatlon.lon, 3, 6) + " | ";
                    console.debug("OutputDD", result2);
                }
                // default output
                result2 = result2 + dmlatlon.lat + " " + dmlatlon.lon;
                // if config option OutputCodes = true, output also calculated wigo codes
                if( gmc.get('OutputCodes') ) {
                    result2 = result2 + " [" + nextCode.value[0] + "," + nextCode.value[1] + "," + nextCode.value[2] + "]" ;
                    console.debug("OutputCodes", result2);
                }
                if( gmc.get('OutputDistance') ) {
                    result2 = result2 + " ⟼ " + dist.toFixed(0) + " m";
                    console.debug("OutputDistance", result2);
                }
                // TODO: to dialog
                resultmsg.innerText = resultmsg.innerText + "\n" + result2;
            }
            /* else {
                let dmlatlon = dd2dm( ddlatlon.lat, ddlatlon.lon);
                let result = nextCode.value[0] + "," + nextCode.value[1] + "," + nextCode.value[2] + "," + fix(ddlatlon.lat, 2, 6) + "," + fix(ddlatlon.lon, 3, 6) + "," + dmlatlon.lat + "," + dmlatlon.lon + "," + dist.toFixed(0) + "out of range" ;
                console.warn(result);
            } */
        }

        nextCode = await codeGen.next();
    }
    console.log("Total hits in range: " + counter);

}

async function addBogusDDToPage() {
    if(DEBUG) console.debug("Starting addBogusDDToPage");

    let bogusDD = await getBogusCoordsDD();
    console.debug("Converted coords: " + bogusDD.lat + "  " + bogusDD.lon);

    // add bogus dd coordinates on page
    await addHTMLtoPage( "<strong> Bogus: " + bogusDD.lat + "  " + bogusDD.lon + " </strong><br>" );
}

async function addMinMaxLatLonToPage() {
    if(DEBUG) console.debug("Starting addMinMaxLatLonToPage");
    let rwigoBogus = await getBogusStringFromPage();
    if(DEBUG) console.debug("Parsed bogus", rwigoBogus);
    let rwigoBogusDD = await bogusStr2DD(rwigoBogus);

    let minmaxRangeObj = await minmaxRange(rwigoBogusDD, 3200);
    let mm = await minmaxLatLon2DDM( minmaxRangeObj );

    if(DEBUG) console.debug("Lat/minmax range: " + mm.minLat + "  " + mm.maxLat);
    if(DEBUG) console.debug("Lon/minmax range: " + mm.minLon + "  " + mm.maxLon);

    if( gmc.get("addMinMaxLatLonDDToPage") ) {
        if(DEBUG) console.debug("Lat/minmax range: " + minmaxRangeObj.minLat + "  " + minmaxRangeObj.maxLat);
        if(DEBUG) console.debug("Lon/minmax range: " + minmaxRangeObj.minLon + "  " + minmaxRangeObj.maxLon);

        // add bogus dd coordinates on page
        await addHTMLtoPage( "<strong> " + mm.minLat + "  " + mm.minLon + " (min) </strong> "+ minmaxRangeObj.minLat.toPrecision(7) + " " + minmaxRangeObj.minLon.toPrecision(8)+ "<br>" );
        await addHTMLtoPage( "<strong> " + mm.maxLat + "  " + mm.maxLon + " (max) </strong> "+ minmaxRangeObj.maxLat.toPrecision(7) + " " + minmaxRangeObj.maxLon.toPrecision(8)+ "<br>" );      
    }
    else {
    // add bogus dd coordinates on page
    await addHTMLtoPage( "<strong> " + mm.minLat + "  " + mm.minLon + " (min) </strong><br>" );
    await addHTMLtoPage( "<strong> " + mm.maxLat + "  " + mm.maxLon + " (max) </strong><br>" );
        
    }
}


// takes wigo codes as strings (may consist not numbers (variables) e.g. 022345 042x21 924ab9)
// returns resulting coordinate (DD) string
function evalPartialReverseWigo(codeA, codeB, codeC) {
    console.debug("Starting evalPartialReverseWigo", codeA, codeB, codeC);

    // validate that these are numbers
    console.debug("Input: " + codeA + ", " + codeB + ", " + codeC);
    if( isNaN( codeC[6-5] ) == false && isNaN( codeC[6-2] ) == false ) {
        // C5 + C2 = parillinen
        if( (Number(codeC[6-5]) + Number(codeC[6-2])) % 2 === 0 ) {
            console.debug("parillinen");
            // A4 B2  B5 C3 A6 C2 A1
            let resLat = "" + codeA[6-4] + codeB[6-2] + "." + codeB[6-5] + codeC[6-3] + codeA[6-6] + codeC[6-2] + codeA[6-1];
            // A5 C6 C1  B3 B6 A2 C5 B1
            let resLon = "" + codeA[6-5] + codeC[6-6] + codeC[6-1] + "." + codeB[6-3] + codeB[6-6] + codeA[6-2] + codeC[6-5] + codeB[6-1];
            console.debug(resLat + " " + resLon);
            return resLat + " " + resLon;
        }
        // C (d5 + d2) eli C5+C2= pariton
        else if ( (Number(codeC[6-5]) + Number(codeC[6-2])) %2 !== 0 ) {
            console.debug("pariton");
            // B6 A1  A4 C6 C3 C2 A6
            let resLat = "" + codeB[6-6] + codeA[6-1] + "." + codeA[6-4] + codeC[6-6] + codeC[6-3] + codeC[6-2] + codeA[6-6];
            // B2 C1 A2  A5 B3 B1 C5 B5
            let resLon = "" + codeB[6-2] + codeC[6-1] + codeA[6-2] + "." + codeA[6-5] + codeB[6-3] + codeB[6-1] + codeC[6-5] + codeB[6-5];
            console.debug(resLat + " " + resLon);
            return resLat + " " + resLon;

        }
    }
    else {
        console.debug("parillinen tai pariton");
        // TODO cannot deduce is many times not correct - by using range for first digits 
        // it still may be possible to deduce more automatically !
        console.warn("Cannot deduce which equation to use - showing both results");
            let resLat1 = "" + codeA[6-4] + codeB[6-2] + "." + codeB[6-5] + codeC[6-3] + codeA[6-6] + codeC[6-2] + codeA[6-1];
            // A5 C6 C1  B3 B6 A2 C5 B1
            let resLon1 = "" + codeA[6-5] + codeC[6-6] + codeC[6-1] + "." + codeB[6-3] + codeB[6-6] + codeA[6-2] + codeC[6-5] + codeB[6-1];

            let resLat2 = "" + codeB[6-6] + codeA[6-1] + "." + codeA[6-4] + codeC[6-6] + codeC[6-3] + codeC[6-2] + codeA[6-6];
            // B2 C1 A2  A5 B3 B1 C5 B5
            let resLon2 = "" + codeB[6-2] + codeC[6-1] + codeA[6-2] + "." + codeA[6-5] + codeB[6-3] + codeB[6-1] + codeC[6-5] + codeB[6-5];
            console.debug( resLat1 + " " + resLon1 + "\n OR \n" + resLat2 + " " + resLon2 );
            return resLat1 + " " + resLon1 + " <br>OR<br> " + resLat2 + " " + resLon2;
    }
    // A3 B4 C4 = ALWAYS ignore

}

async function rwigoAssistDialog() {
    if(DEBUG) console.debug("Starting rwigoAssistDialog()")
    let rwigoBogus = await getBogusStringFromPage();
    if(DEBUG) console.debug("Parsed bogus", rwigoBogus);
    let rwigoBogusDD = await bogusStr2DD(rwigoBogus);

    minmaxRangeObj = await minmaxRange(rwigoBogusDD, 3200);

    let mm = await minmaxLatLon2DDM( minmaxRangeObj );

    await xdialog.open({
        title: 'Reverse Wherigo Solver',
        body: '\
        <style>\
            .demo4-items {display:flex;flex-direction:column;align-items:center;}\
            .demo4-item {display:block;height:70px;width:90%;margin:3px;padding:1px;}\
            .demo4-button {display:block;height:30px;width:30%;margin:3px;padding:1px;}\
            .demo4-results {display:flex;flex-direction:column;align-items:center;}\
        </style>\
        <div id="demo4-header" class="demo4-items">\
        <div class="demo4-items">\
        <p>Min: '
        + mm.minLat + " " + mm.minLon + "<p>Max: " + mm.maxLat + " " + mm.maxLon +
        '<p>Enter reversewherigo codes below</p>\
            <textarea id="rwigo-codes-input" class="demo4-item"></textarea>\
        </div>\
        <div id="rwigo-codes-result" class="demo4-results"></div>\
        ',
        // buttons: ['ok', 'delete', 'cancel'],
        buttons: {
            delete: "run",
            ok: "Close"
        },
        style: 'width: 400px;left: 30%;',
        listenEnterKey: false,
        beforeshow: function(param) {
            [].slice.call(param.element.querySelectorAll('.xd-body *')).forEach(function(el) {
                let border = false;

                if (el instanceof HTMLInputElement) {
                    border = true;
                }

                if (['BUTTON', 'SELECT', 'TEXTAREA'].indexOf(el.tagName) >= 0) {
                    border = true;
                }

                if (border) {
                    el.setAttribute('style', 'border: 2px solid green;');
                }
            });
        },
        ondelete: function(param) {
            console.debug("Starting ondelete", param);

            let codesText = param.element.querySelector('#rwigo-codes-input');
            console.debug("xdialog user input:",codesText);

            let parsedCodes = parseCodesDialog( codesText.value );
            if( parsedCodes !== null && parsedCodes.length >= 3 ) {
                console.debug("Match: " + parsedCodes[0] + "," + parsedCodes[1] + "," + parsedCodes[2] );

                let reverseRes = evalPartialReverseWigo( parsedCodes[0], parsedCodes[1], parsedCodes[2] );
                console.debug("Partial evaluation result:", reverseRes);

                let res = param.element.querySelector('#rwigo-codes-result');
                let resp = document.createElement('p');
                resp.textContent = reverseRes;
                res.appendChild(resp);
            }
            return false;
        }
    });
}


// DEPRECATED
async function readCodes() {
    console.warn("DEPRECATED readCodes()")
    if(DEBUG) console.debug("Starting readCodes()")
    let rwigoBogus = await getBogusStringFromPage();
    if(DEBUG) console.debug("Parsed bogus", rwigoBogus);
    let rwigoBogusDD = await bogusStr2DD(rwigoBogus);
    minmaxRangeObj = await minmaxRange(rwigoBogusDD, 3200);

    let mm = await minmaxLatLon2DDM( minmaxRangeObj );

    await xdialog.open({
        title: 'Reverse Wherigo Solver',
        body: '\
        <style>\
            .demo4-items {display:flex;flex-direction:column;align-items:center;}\
            .demo4-item {display:block;height:70px;width:90%;margin:3px;padding:1px;}\
            .demo4-button {display:block;height:30px;width:30%;margin:3px;padding:1px;}\
            .demo4-results {display:flex;flex-direction:column;align-items:center;}\
        </style>\
        <div id="demo4-header" class="demo4-items">\
        <div class="demo4-items">\
        <p>Min: '
        + mm.minLat + " " + mm.minLon + "<p>Max: " + mm.maxLat + " " + mm.maxLon +
        '<p>Enter reversewherigo codes below</p>\
            <textarea id="rwigo-codes-input" class="demo4-item"></textarea>\
        </div>\
        <div id="rwigo-codes-result" class="demo4-results"></div>\
        ',
        // buttons: ['ok', 'delete', 'cancel'],
        buttons: {
            delete: "run",
            ok: "Close"
        },
        style: 'width: 400px;left: 30%;',
        listenEnterKey: false,
        beforeshow: function(param) {
            [].slice.call(param.element.querySelectorAll('.xd-body *')).forEach(function(el) {
                let border = false;

                if (el instanceof HTMLInputElement) {
                    border = true;
                }

                if (['BUTTON', 'SELECT', 'TEXTAREA'].indexOf(el.tagName) >= 0) {
                    border = true;
                }

                if (border) {
                    el.setAttribute('style', 'border: 2px solid green;');
                }
            });
        },
        ondelete: function(param) {
            console.debug("Starting ondelete", param);

            let codesText = param.element.querySelector('#rwigo-codes-input');
            console.debug("xdialog user input:",codesText);

            let parsedCodes = parseCodesDialog( codesText.value );
            if( parsedCodes !== null && parsedCodes.length >= 3 ) {
                console.debug("Match: " + parsedCodes[0] + "," + parsedCodes[1] + "," + parsedCodes[2] );

                let reverseRes = evalPartialReverseWigo( parsedCodes[0], parsedCodes[1], parsedCodes[2] );
                console.debug("Partial evaluation result:", reverseRes);

                let res = param.element.querySelector('#rwigo-codes-result');
                let resp = document.createElement('p');
                resp.textContent = reverseRes;
                res.appendChild(resp);
            }
            return false;
        }
    });
}
// input: string
// Return: array (match results)
function parseCodesDialog( myText ) {
    console.debug("Starting parseCodes", myText )

    let re2 = /[0-9A-Za-z]{6}/g;
    console.log("Trying to find codes from user input:");
    let text = myText;
    let codes = text.match( re2 );
    console.debug( JSON.stringify( codes ) );
    return codes;
}

// parse reverse wherigo codes from note
async function parseCodesFromNote() {
    console.debug("Starting parseCodesFromNote" )

    let re1 = /RWIGO:/g;
    let re2 = /[0-9A-Za-z]{6}/g;
    console.log("Trying to find codes from user note:");
    let text = document.getElementById("viewCacheNote").innerText;
    if( text.match( re1 ) ) {
        console.debug("Match found (RWIGO:)");
        let codes = text.match( re2 );
        console.debug( JSON.stringify( codes ) );
        return codes;
    }
    else {
        console.debug("No codes found from Personal Note");
        return null;
    }
}

// async parse codes from cache description
async function parseCodesFromDescription() {
    console.debug("Starting parseCodesFromDescription" )

    let re = /[0-9]{6}/g;
    let codes = document.getElementsByClassName("UserSuppliedContent")[1].innerText.match( re );
    return codes;
}


  (async function() {
    'use strict';
    console.debug("Starting monkey init" )

    await gmc.initialized.then();
    console.debug("monkey init - gmc init done" )

    const my_css = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(my_css);
    console.debug("style added" )

    let from, result;

    let cacheType = document.getElementsByClassName("cacheImage")[0].title;

    await createShowSourceButton();

    if( gmc.get('addBogusDDToPage') ) {
        await addBogusDDToPage();
    }
    if( gmc.get('addMinMaxLatLonToPage') ) {
        await addMinMaxLatLonToPage();
    }

    if( cacheType == "Wherigo Cache" ) {
        await createShowSolveREReverseButton();
        await createDialog();

        let codes = await parseCodesFromNote();
        // Codes found from Personal Note
        if( codes !== null && codes.length >= 3 ) {
            console.log("Found some codes from UserSuppliedContent");

            console.debug("Match: " + codes[0] + "," + codes[1] + "," + codes[2] );

            let reverseRes = evalPartialReverseWigo( codes[0], codes[1], codes[2] );
            await addHTMLtoPage("<br><strong>Codes with variables converted to coordinates: <br>"+reverseRes+"</strong>" );

            // TODO: how to check if code 2 coords conversion is valid => only show if it is
            let ddlatlon =  await  code2LatLon( codes[0], codes[1], codes[2] );
            let dmlatlon =  await  dd2dm( ddlatlon.lat, ddlatlon.lon);
            from = codes[0] + " " + codes[1] + " " + codes[2] + " => ";
            let resultDD = fix(ddlatlon.lat, 2, 6) + " " + fix(ddlatlon.lon, 3, 6);
            let resultDMD = dmlatlon.lat + " " + dmlatlon.lon;
            result = resultDMD;
            console.log( from + " " + resultDD + " = " + resultDMD );

            if( gmc.get("writeFinalToClipboard") ) {
                GM_setClipboard( result, "text" );
            }
            await addHTMLtoPage("<br><strong> Reversewigo final coordinates =  " + result + " </strong>" );
            if( result != "S NaN° NaN W NaN° NaN")
            {
                await updateCoordinates( resultDMD );
            }
        }
        // No codes in Personal Note - trying to retrieve directly from description
        else {
            console.log("Trying to find codes from UserSuppliedContent");
            codes = await parseCodesFromDescription();
            if( codes !== null && (codes.length == 3 || codes.length == 6 || codes.length == 9) ) {
                console.debug("Parsed codes from UserSuppliedContent: " + JSON.stringify(codes) );

                let reverseRes = evalPartialReverseWigo( codes[0], codes[1], codes[2] );
                await addHTMLtoPage("<br><strong>Reverse results = "+reverseRes+"</strong>", false);

                let ddlatlon =  await  code2LatLon( codes[0], codes[1], codes[2] );
                let dmlatlon =  await  dd2dm( ddlatlon.lat, ddlatlon.lon);
                from = codes[0] + " " + codes[1] + " " + codes[2] + " => ";
                let resultDD = fix(ddlatlon.lat, 2, 6) + " " + fix(ddlatlon.lon, 3, 6);
                let resultDMD = dmlatlon.lat + " " + dmlatlon.lon;
                result = resultDMD;
                console.debug( from + " " + resultDD + " = " + resultDMD );

                if( gmc.get("writeFinalToClipboard") ) {
                    GM_setClipboard( result, "text" );
                }
    
                await addHTMLtoPage("<br><strong> Reversewigo final coordinates =  " + result + " </strong>" );
                if( result != "S NaN° NaN W NaN° NaN") {
                    await updateCoordinates( resultDMD );
                }
            }
            else {
                result = "Error: Reverse wherigo codes not found from description/note. <br>Enter codes to Personal Note as shown below, save and reload. <br>RWIGO:<br>123ABC<br>23D45G<br>423444";
                console.log( result );
                await addHTMLtoPage("<br><strong>" + result + " </strong>", false);
            }
        }
    }
})();



