// ==UserScript==
// @name        Riimipariassari ✓🐵
// @namespace    http://tampermonkey.net/
// @version      0.86
// @description  Riimipariassari ✓🐵  - laskee kirjainten lukumäärät.
// @author       mrummuka@hotmail.com
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @include      https://www.geocaching.com/geocache/*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/427640/Riimipariassari%20%E2%9C%93%F0%9F%90%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/427640/Riimipariassari%20%E2%9C%93%F0%9F%90%B5.meta.js
// ==/UserScript==
/* jshint esversion: 9 */

const letters = 'abcdefghijklmnopqrstuvwxyzåäö';
const hardcodedstringstart = "#kaava:";

// default location for script html outputs
const htmlOutputLocationCN = "DownloadLinks";

GM_registerMenuCommand("Configure", () => { gmSETTINGS.open(); }, "C");
GM_registerMenuCommand("SolveFreqs", () => { countAndUpdateFreqs(); }, "S");
GM_registerMenuCommand("SolveValues", () => { countAndUpdateValues(); }, "V");

let gmSETTINGS, ignoreCase = true, skipDirections = true;

/* async */ function dd2dm(latdd, londd) {
    var lat = latdd;
    var lon = londd;

    var latResult, lonResult, dmsResult;

    lat = parseFloat(lat);
    lon = parseFloat(lon);

    latResult = /* await */ lat_dd2dm(lat);
    lonResult = /* await */ lon_dd2dm(lon);

    dmsResult = latResult + ' ' + lonResult;
    return { result: dmsResult, lat: latResult, lon: lonResult };
}

/* async */ function lat_dd2dm(val) {
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

/* async */ function lon_dd2dm(val) {
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

function fix(v, left, right) {
    return (v < 0 ? '-' : ' ') + Math.abs(v).toFixed(right).padStart(left + right + 1, '0');
}

function haversineDistance(lat1,lon1,lat2,lon2) {
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

function dm2dd( nsew, deg, min ) {
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

function createCountFreqButton() {
    let mybutton = document.createElement("a");
    mybutton.innerHTML = "Count Freqs";
    mybutton.className = "mybtn";
    mybutton.setAttribute("style", "-webkit-appearance: button;-moz-appearance: button;appearance: button; background-color: green; color: white; border: none; text-align: center; display: inline-block; padding: 3px 10px; border: 1px solid black; cursor: pointer; margin-right: 5px;");

    let noteref = document.getElementsByClassName("minorCacheDetails Clear")[0];
    noteref.appendChild(mybutton);

    mybutton.addEventListener("click", function() {
        countAndUpdateFreqs();
    });
}

function createSaveCoordsButton() {
    let mybutton = document.createElement("a");
    mybutton.innerHTML = "Save Coords";
    mybutton.className = "mybtn-savecoords";
    mybutton.setAttribute("style", "-webkit-appearance: button;-moz-appearance: button;appearance: button; background-color: blue; color: white; border: none; text-align: center; display: inline-block; padding: 3px 10px; border: 1px solid black; cursor: pointer;");

    let noteref = document.getElementsByClassName("minorCacheDetails Clear")[0];
    noteref.appendChild(mybutton);

    mybutton.addEventListener("click", function() {
        saveCoordinates();
    });
}

function pollDOM() {
    console.debug("Starting pollDOM");
    const newCrd = document.getElementById('newCoordinates');
    if (newCrd != null) {
        newCrd.value = newCoordinates;
        let submitBtn = document.getElementsByClassName("btn-cc-parse")[0];
        // submitBtn.click(); // Kommentoitu pois, koska ei haluta automaattista lähetystä
    } else {
        setTimeout(pollDOM, 1000); // try again in 1000 milliseconds
    }
}

async function updateCoordinates(newCoords) {
    console.debug("Starting updateCoordinates", newCoords);
    let crd = document.getElementById("uxLatLonLink");
    crd.click();
    newCoordinates = newCoords;
    pollDOM();
    console.debug("XX: " + newCoords);
}

function createDialog() {
    let mydialog = document.createElement("div");
    mydialog.id = "dialog";
    mydialog.title = "Results";
    let resultmsg = document.createElement("p");
    resultmsg.id = "resultmsg";

    mydialog.appendChild(resultmsg);
    let noteref = document.getElementById("ctl00_ContentBody_detailWidget");
    noteref.appendChild(mydialog);
}

function getBogusCoordsFromPage() {
    let coords = document.getElementById("uxLatLon").textContent.split(" ");
    if( coords.length != 6 ) {
        console.error("Error parsing coordinates");
        throw new Error("Error parsing bogus coordinates from cache page");
    }
    return coords;
}

function latLonDmArr2dd( latLonDmArray ) {
    let bogusLat = dm2dd( latLonDmArray[0], latLonDmArray[1], latLonDmArray[2] );
    let bogusLon = dm2dd( latLonDmArray[3], latLonDmArray[4], latLonDmArray[5] );
    return { lat : bogusLat, lon : bogusLon };
}

function addHTMLtoPage( classname, htmlsnip, replace ) {
    let docEl = document.getElementsByClassName(classname)[0];

    if( replace ) {
        docEl.innerHTML = htmlsnip;
    }
    else {
        docEl.innerHTML = docEl.innerHTML + htmlsnip;
    }
}

function addHTMLElemtoPage( classname, htmlelement, replace ) {
    let docEl = document.getElementsByClassName(classname)[0];

    if( replace ) {
        docEl = htmlelement;
    }
    else {
        docEl.appendChild( htmlelement );
    }
}

function formatCharArray( charfreqObj, separator ) {
    let charStr = "";
    let freqStr = "";
    for( let i in charfreqObj ) {
        let len = String( charfreqObj[i] ).length;
        charStr += separator + (" ".padStart( len, " ")) + i;
        freqStr += separator +  " " + charfreqObj[i];
    }
    console.log(charStr);
    console.log(freqStr);
    return { char: charStr , freq: freqStr };
}

function formatCharArrayH( charfreqObj ) {
    return formatCharArray( charfreqObj, "");
}

function formatCharArray2( charfreqObj ) {
    return formatCharArray( charfreqObj, '|');
}

function formatCharArrayHtml( charfreqObj ) {
    let tbl = document.createElement("table");
    tbl.setAttribute("style"," border-collapse: collapse; border: 1px solid black; ");

    let tblBody = document.createElement("tbody");

    let row = document.createElement("tr");
    for( let i in charfreqObj ) {
        let cell = document.createElement("td");
        cell.setAttribute("style", "padding: 2px 6px 2px 6px;");
        let strong = document.createElement("b");
        let cellText = document.createTextNode(i);
        strong.appendChild(cellText);
        cell.appendChild(strong);
        row.appendChild(cell);
    }
    tblBody.appendChild(row);

    var row2 = document.createElement("tr");
    for( let i in charfreqObj ) {
        let cell = document.createElement("td");
        cell.setAttribute("style", "padding: 2px 6px 2px 6px;");
        let cellText = document.createTextNode(charfreqObj[i]);
        cell.appendChild(cellText);
        row2.appendChild(cell);
    }
    tblBody.appendChild(row2);

    tbl.appendChild(tblBody);
    return tbl;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

function addBogusDDToPage() {
    let bogusLatLonArr = getBogusCoordsFromPage();
    let bogusDD = latLonDmArr2dd(bogusLatLonArr);
    let bogusLat = bogusDD.lat;
    let bogusLon = bogusDD.lon;

    console.debug("Parsed coords: " + JSON.stringify(bogusLatLonArr));
    console.debug("Converted coords: " + bogusLat + "  " + bogusLon);

    addHTMLtoPage(htmlOutputLocationCN,  "<strong> Bogus: " + bogusLat + "  " + bogusLon + " </strong>", true );
}

let counter = str => {
    return str.split('').reduce((total, letter) => {
      total[letter] ? total[letter]++ : total[letter] = 1;
      return total;
    }, {});
};

function char_count(str, letter) {
    var letter_Count = 0;
    for (var position = 0; position < str.length; position++) {
        if (str.charAt(position) == letter) {
            letter_Count += 1;
        }
    }
    return letter_Count;
}

function countAndUpdateFreqs() {
    let freqs = countLettersFromNote();

    let fmt2 = formatCharArrayHtml( freqs );

    if( freqs !== null ) {
        console.debug("Freqs: " + JSON.stringify(freqs) );

        addHTMLtoPage(htmlOutputLocationCN, "<br><strong>Kirjainten lukumäärät notessa:</strong>", true);
        addHTMLElemtoPage( htmlOutputLocationCN, fmt2, false);

        let equation = parseEquationFromNote();
        if( equation ) {
            let res = solveEquation(equation, freqs);
            addHTMLtoPage(htmlOutputLocationCN, "<br><strong>Kaavan tulos:"+res+"</strong>", false);
            alert("Kaavan tulos: "+res);
        }
    }
}

function countAndUpdateValues() {
    let values = parseLetterValuesFromNote();

    let fmt2 = formatCharArrayHtml( values );

    if( values !== null ) {
        console.debug("Values: " + JSON.stringify(values) );

        addHTMLtoPage(htmlOutputLocationCN, "<br><strong>Kirjainmuuttujien arvot notessa:</strong>", true);
        addHTMLElemtoPage( htmlOutputLocationCN, fmt2, false);

        let equation = parseEquationFromNote();
        if( equation ) {
            let res = solveEquation(equation, values);
            addHTMLtoPage(htmlOutputLocationCN, "<br><strong>Kaavan tulos:"+res+"</strong>", false);
            alert("Kaavan tulos: "+res);
        }
    }
}

function saveCoordinates() {
    let freqs = countLettersFromNote();
    if (!freqs) {
        alert("Ei löydetty kirjainfrekvenssejä Personal Notesta!");
        return;
    }

    let equation = parseEquationFromNote();
    if (!equation) {
        alert("Ei löydetty kaavaa Personal Notesta!");
        return;
    }

    let newCoords = solveEquation(equation, freqs);
    if (!newCoords) {
        alert("Kaavan evaluointi epäonnistui!");
        return;
    }

    console.debug("Saving coordinates: " + newCoords);
    updateCoordinates(newCoords);
}

function countLettersFromNote() {
    let freq = {};

    console.log("Trying to find riimiparit from user note:");
    let text = document.getElementById("viewCacheNote").innerText;

    text.split("\n").forEach( row => {
        if( !row.startsWith( "#" ) ) {
            for (var i=0; i<letters.length;i++) {
                var character = letters.charAt(i);
                if (freq[character]) {
                    freq[character] = freq[character] + char_count( row.toLowerCase(), character );
                }
                else {
                    freq[character] = char_count( row.toLowerCase(), character );
                }
            }
        }
    });

    return freq;
}

function parseLetterValuesFromNote() {
    let values = {};

    console.log("Trying to find variable values from user note:");
    let text = document.getElementById("viewCacheNote").innerText;

    text.split("\n").forEach( row => {
        if( !row.startsWith( "#" ) && /^[A-Z]=/.test(row) ) {
            var char = row.match(/(^[A-Z])=([0-9]*)/)[1];
            console.debug("For ",char);
            var value = row.match(/(^[A-Z])=([0-9]*)/)[2];
            console.debug("Got ",value);
            values[char] = value;
        }
    });

    return values;
}

function parseEquationFromNote() {
    console.log("Trying to find coordinate equation from user note:");
    let text = document.getElementById("viewCacheNote").innerText;

    let eqrow = text.split("\n").find( row => row.startsWith( hardcodedstringstart ) );
    if( eqrow ) {
        console.log("FOUND equation: " + eqrow);
        let equ = eqrow.replace(hardcodedstringstart,"").trim();
        console.debug("Parsed equation: " + equ);
        return equ;
    }
    else {
        console.log("No equation found");
        return null;
    }
}

function mapEquationVarsToValues(equat, freqs) {
    let res = "";
    let directions = ['N', 'S', 'E', 'W'];

    console.debug("Processing equation: " + equat);
    console.debug("ignoreCase: " + ignoreCase + ", skipDirections: " + skipDirections);
    console.debug("Freqs: " + JSON.stringify(freqs));

    let hasDirections = skipDirections && /([NSEW](?:\s+|\.)\d+)/.test(equat);
    console.debug("hasDirections: " + hasDirections);

    for (let i = 0; i < equat.length; i++) {
        let chr = ignoreCase ? equat[i].toLowerCase() : equat[i];
        let originalChr = equat[i];

        if (hasDirections && directions.includes(originalChr)) {
            let isDirection = (
                (i === 0 || equat[i-1] === ' ' || equat[i-1] === '.' || equat[i-1] === '(' || equat[i-1] === ')') &&
                (i + 1 >= equat.length || equat[i+1] === ' ' || equat[i+1] === '.' || /\d/.test(equat[i+1]))
            );
            console.debug(`Checking char '${originalChr}' at index ${i}: isDirection=${isDirection}, prev='${i > 0 ? equat[i-1] : ''}', next='${i + 1 < equat.length ? equat[i+1] : ''}'`);
            if (isDirection) {
                res += originalChr;
                continue;
            }
        }

        if (freqs[chr]) {
            console.debug(`Replacing '${chr}' with ${freqs[chr]}`);
            res += freqs[chr];
        }
        else if (letters.includes(chr)) {
            console.debug(`No freq for '${chr}', replacing with 0`);
            res += "0";
        }
        else {
            console.debug(`Copying non-letter '${originalChr}'`);
            res += originalChr;
        }
    }
    console.debug("Equation after letters converted to values: " + res);
    return res;
}

function solveEquation(equat, freqs) {
    let res = mapEquationVarsToValues(equat, freqs);

    res = res.replace(/(\([^\(\)\[\]]+\)|\[[^\(\)\[\]]+\])/g, function(match) {
        let expr = match.slice(1, -1);
        expr = mapEquationVarsToValues(expr, freqs);
        if (/^[\d+\-*/. ]+$/.test(expr)) {
            try {
                let evalResult = eval(expr);
                console.debug(`Evaluated ${match} to ${evalResult}`);
                return evalResult;
            } catch (e) {
                console.error(`Error evaluating ${match}: ${e}`);
                alert(`Virhe evaluoinnissa: ${match} - ${e.message}`);
                return match;
            }
        } else {
            console.warn(`Non-numeric expression ${match}, keeping as is`);
            return match;
        }
    });

    console.debug("Final equation result: " + res);
    return res;
}

function parseEquationFromDescription() {
    let re = /[0-9]{6}/g;
    let codes = document.getElementsByClassName("UserSuppliedContent")[1].innerText.match( re );
    return codes;
}

(function() {
    'use strict';

    new GM_config({
        'id': 'MyConfig',
        'title': 'Script Settings',
        'fields': {
            'IgnoreCase': {
                'label': 'Ignore case when evaluating equation',
                'type': 'checkbox',
                'default': true
            },
            'SkipDirections': {
                'label': 'Skip replacing N/S/E/W if they appear as coordinates',
                'type': 'checkbox',
                'default': true
            }
        },
        'events': {
            'init': function() {
                console.debug("On config init");
                gmSETTINGS = this;
                ignoreCase = this.get('IgnoreCase');
                skipDirections = this.get('SkipDirections');
                console.debug("Initialized settings: ignoreCase=" + ignoreCase + ", skipDirections=" + skipDirections);
            },
            'open': function(document, window, frame) {
                frame.style["width"]="25%";
                frame.style["height"]="74%";
                frame.style["inset"]="100px 9px auto auto";
            },
            'save': function() {
                console.debug("Saving config..");
                this.close();
            },
            'close': function() {
                console.debug("Closing config..");
                this.close();
            }
        }
    });

    let from, result;

    let cacheType = document.getElementsByClassName("cacheImage")[0].title;

    if( cacheType == "Mystery Cache" ) {
        createCountFreqButton();
        createSaveCoordsButton();
        createDialog();

        let freqs = countLettersFromNote();

        if( freqs !== null ) {
            let fmt1 = formatCharArray2( freqs );
            let fmt2 = formatCharArrayHtml( freqs );
            console.debug("Freqs: " + JSON.stringify(freqs) );
            console.debug("Freqs: " + "\n" + fmt1.char + "\n" + fmt1.freq );

            result = "Ohje:<br>#-alkuiset rivit skipataan. Kaavan (optionaalinen) voi syöttää ensimmäiselle riville (evaluoitavat lausekkeet hakasulkeiden sisällä).<br>"+hardcodedstringstart+" 60 60.abc 024 15.[d-e]fg<br>#1 maukuvan eläimen haiseva jätös<br>kissa pissa<br>#2 ryhmä joka perustetaan ratkomaan näitä<br>riimi tiimi<br>...<br>";
            addHTMLtoPage(htmlOutputLocationCN, "<br><strong>" + result + " </strong>", true);
            addHTMLtoPage(htmlOutputLocationCN, "<br><strong>Kirjainten lukumäärät Personal notessa:</strong>", false);
            addHTMLElemtoPage( htmlOutputLocationCN, fmt2, false);

            let equation = parseEquationFromNote();
            if( equation ) {
                let res1 = mapEquationVarsToValues(equation, freqs);
                addHTMLtoPage(htmlOutputLocationCN, "<div class='arvoilla'><br><strong>Kaavan arvoilla:"+res1+"</strong></div>", false);
                let res2 = solveEquation(equation, freqs);
                addHTMLtoPage(htmlOutputLocationCN, "<div class='laskettuna'><br><strong>Kaavan tulos:"+res2+"</strong></div>", false);
            }
        }
        else {
            result = "<br>Ohje:<br># -alkuiset rivit skipataan. <br>#1 maukuvan eläimen haiseva jätös<br>kissa pissa<br>#2 ryhmä joka perustetaan ratkomaan näitä<br>riimi tiimi<br>...<br>Kaavan voi syöttää ensimmäiselle riville näin <br>"+hardcodedstringstart+" N 60 60.abc E 024 15.[d-e]fg";
            console.log( result );
            addHTMLtoPage(htmlOutputLocationCN, "<br><strong>" + result + " </strong>", false);
        }
    }
})();