// ==UserScript==
// @name Comat System
// @description none as of yet.
// 
// @match http://*/geofs.php*
// @match https://*/geofs.php*
// @run-at document-end
// @version 0.2.0-alpha-FCS_snapshot-2
// @grant none
// @namespace https://greasyfork.org/users/1006012
// @downloadURL https://update.greasyfork.org/scripts/457528/Comat%20System.user.js
// @updateURL https://update.greasyfork.org/scripts/457528/Comat%20System.meta.js
// ==/UserScript==
/*--------------------*/
/*The following section of the code is borrowed from a string manipulator library by esamattis. Here is the posted liscense.

The MIT License

Copyright (c) 2011 Esa-Matti Suuronen esa-matti@suuronen.org

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),

to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,

and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,

FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,

WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
/*Basically this scores how many character differences there are between the two strings. Should be very useful in comparing the typed missile
to the missiles on the list in order to decide which one matches the closest.*/




(function() {
  /*--------------------*/
  /*HERE STARTS BORROWED CODE*/
  function makeString(object) {
      if (object === null) return '';
      return '' + object;
  }

  function levenshtein(str1, str2) {
    'use strict';
    str1 = makeString(str1);
    str2 = makeString(str2);

    // Short cut cases
    if (str1 === str2) return 0;
    if (!str1 || !str2) return Math.max(str1.length, str2.length);

    // two rows
    var prevRow = new Array(str2.length + 1);

    // initialise previous row
    for (var i = 0; i < prevRow.length; ++i) {
      prevRow[i] = i;
    }

    // calculate current row distance from previous row
    for (i = 0; i < str1.length; ++i) {
      var nextCol = i + 1;

      for (var j = 0; j < str2.length; ++j) {
        var curCol = nextCol;

        // substution
        nextCol = prevRow[j] + ((str1.charAt(i) === str2.charAt(j)) ? 0 : 1);
        // insertion
        var tmp = curCol + 1;
        if (nextCol > tmp) {
            nextCol = tmp;
        }
        // deletion
        tmp = prevRow[j + 1] + 1;
        if (nextCol > tmp) {
            nextCol = tmp;
        }

        // copy current col value into previous (in preparation for next iteration)
        prevRow[j] = curCol;
      }

      // copy last col value into previous (in preparation for next iteration)
      prevRow[j] = nextCol;
    }

    return nextCol;
  }
  /*HERE ENDS BORROWED SECTION OF CODE.*/
  /*--------------------*/

  function findMatch(missile) {
    /*All missiles here were changed from three arrays into one array of objects. This greatly simplifies the code and made it much cleaner.*/
    const missiles = [
      /*Brazil*/
      {missile: "MAA-1A Piranha", foxCode: 2},
      {missile: "MAA-1B Piranha", foxCode: 2},
      {missile: "MAA-1A", foxCode: 2},
      {missile: "MAA-1B", foxCode: 2},
      {missile: "A-Darter", foxCode: 2},
      /*France*/
      {missile: "Meteor", foxCode: 3},
      {missile: "MICA-EM", foxCode: 3},
      {missile: "Matra R.510", foxCode: 2},
      {missile: "R.510", foxCode: 2},
      {missile: "Matra R.550 Magic", foxCode: 2},
      {missile: "R.550", foxCode: 2},
      {missile: "R.530E", foxCode: 2},
      {missile: "Matra Magic II", foxCode: 2},
      {missile: "Matra Mistral", foxCode: 2},
      {missile: "MICA-IR", foxCode: 2},
      {missile: "Matra R.511", foxCode: 1},
      {missile: "R.511", foxCode: 1},
      {missile: "Matra R.530", foxCode: 1},
      {missile: "R.530", foxCode: 1},
      {missile: "Matra Super 530F", foxCode: 1},
      {missile: "Matra Super 530D", foxCode: 1},
      {missile: "530D", foxCode: 1},
      {missile: "530F", foxCode: 1},
      /*Germany*/
      {missile: "IRIS-T", foxCode: 2},
      {missile: "Dornier Viper", foxCode: 2},
      /*India*/
      {missile: "Astra Mk.I", foxCode: 3},
      {missile: "K-100", foxCode: 3},
      /*Iran*/
      {missile: "Fatter", foxCode: 2},
      {missile: "Fakour-90", foxCode: 3},
      {missile: "Sedjil", foxCode: 1},
      /*Iraq*/
      {missile: "Al Humurrabi", foxCode: 1},
      /*Israel*/
      {missile: "Derby (Alto)", foxCode: 3},
      {missile: "Python", foxCode: 2},
      {missile: "Python 3", foxCode: 2},
      {missile: "Python 4", foxCode: 2},
      {missile: "Python 5", foxCode: 2},
      {missile: "Shafrir 1", foxCode: 2},
      {missile: "Shafrir 2", foxCode: 2},
      /*Italy*/
      {missile: "Aspide", foxCode: 1},
      /*Japan*/
      {missile: "AAM-4", foxCode: 3},
      {missile: "AAM-1", foxCode: 2},
      {missile: "AAM-2", foxCode: 2},
      {missile: "AAM-3", foxCode: 2},
      {missile: "AAM-5", foxCode: 2},
      /*China*/
      {missile: "PL-12 (SD-10)", foxCode: 3},
      {missile: "F80", foxCode: 3},
      {missile: "PL-15", foxCode: 3},
      {missile: "PL-5B", foxCode: 2},
      {missile: "PL-5C", foxCode: 2},
      {missile: "PL-5E", foxCode: 2},
      {missile: "PL-8", foxCode: 2},
      {missile: "PL-9", foxCode: 2},
      {missile: "PL-9C", foxCode: 2},
      {missile: "PL-10", foxCode: 2},
      {missile: "PL-ASR", foxCode: 2},
      /*Russian Federation*/
      {missile: "alamo-a", foxCode: 1},
      {missile: "alamo-c", foxCode: 1},
      {missile: "alamo-b", foxCode: 2},
      {missile: "alamo-d", foxCode: 2},
      {missile: "R-33S", foxCode: 3},
      {missile: "R-27EA", foxCode: 3},
      {missile: "R-27EM", foxCode: 3},
      {missile: "R-77", foxCode: 3},
      {missile: "RVV-AE", foxCode: 3},
      {missile: "R-77-1", foxCode: 3},
      {missile: "RVV-SD", foxCode: 3},
      {missile: "KS-172", foxCode: 3},
      {missile: "Izdeliye 170", foxCode: 3},
      {missile: "Izdeliye 172", foxCode: 3},
      {missile: "Izdeliye 180", foxCode: 3},
      {missile: "Izdeliye 190", foxCode: 3},
      {missile: "Izdeliye 610", foxCode: 3},
      {missile: "Izdeliye 810", foxCode: 3},
      {missile: "K-13", foxCode: 2},
      {missile: "R-40TD", foxCode: 2},
      {missile: "R-23T", foxCode: 2},
      {missile: "R-24T", foxCode: 2},
      {missile: "R-60", foxCode: 2},
      {missile: "R-27T", foxCode: 2},
      {missile: "R-27T1", foxCode: 2},
      {missile: "R-27ET1", foxCode: 2},
      {missile: "R-27ET", foxCode: 2},
      {missile: "R-73", foxCode: 2},
      {missile: "R-73M", foxCode: 2},
      {missile: "R-74M", foxCode: 2},
      {missile: "R-74M2", foxCode: 2},
      {missile: "RVV-MD", foxCode: 2},
      {missile: "RVV-TE", foxCode: 2},
      {missile: "R-77T", foxCode: 2},
      {missile: "K-MD", foxCode: 2},
      {missile: "RVV-MD", foxCode: 2},
      {missile: "Izdeliye 160", foxCode: 2},
      {missile: "Izdeliye 300", foxCode: 2},
      {missile: "Izdeliye 310", foxCode: 2},
      {missile: "Izdeliye 320", foxCode: 2},
      {missile: "Izdeliye 360 ", foxCode: 2},
      {missile: "Izdeliye 740", foxCode: 2},
      {missile: "Izdeliye 750", foxCode: 2},
      {missile: "Izdeliye 760", foxCode: 2},
      {missile: "R-40RD", foxCode: 1},
      {missile: "R-23R", foxCode: 1},
      {missile: "R-24R", foxCode: 1},
      {missile: "R-33", foxCode: 1},
      {missile: "R-27R", foxCode: 1},
      {missile: "R-27R1", foxCode: 1},
      {missile: "R-27ER", foxCode: 1},
      {missile: "R-27ER1", foxCode: 1},
      {missile: "R-27EA", foxCode: 3},
      {missile: "R-26EM", foxCode: 3},
      {missile: "R-77P", foxCode: 1},
      {missile: "RVV-PE", foxCode: 1},
      {missile: "R-37", foxCode: 1},
      {missile: "Izdeliye 140", foxCode: 1},
      {missile: "Izdeliye 340", foxCode: 1},
      /*South Africa*/
      {missile: "R-Darter", foxCode: 3},
      {missile: "V3 Kukri", foxCode: 2},
      /*Taiwan*/
      {missile: "Sky Sword II", foxCode: 3},
      {missile: "TC 2", foxCode: 3},
      {missile: "Sky Sword I", foxCode: 2},
      {missile: "TC 1", foxCode: 2},
      /*Turkey*/
      {missile: "Bozdoğan", foxCode: 2},
      {missile: "Merlin", foxCode: 2},
      /*United Kingdom*/
      {missile: "AIM-132 ASRAAM", foxCode: 2},
      /*United States of America*/
      {missile: "AIM-120 AMRAAM", foxCode: 3},
      {missile: "AIM-132", foxCode: 2},
      {missile: "AIM-9 Sidewinder", foxCode: 2},
      {missile: "AIM-9", foxCode: 2},
      {missile: "AIM-92 Stinger", foxCode: 2},
      {missile: "AIM-92", foxCode: 2},
      {missile: "AIM-7", foxCode: 1},
      {missile: "AIM-9C", foxCode: 1}
    ];
    let missPross, foxCode;
    let scores = [];

    /*Sets all the missile names to the same case for greater accuracy.*/
    missPross = missiles;
    missPross.forEach(function(item) {
      item.missile = item.missile.toLowerCase();
    });
    missile = missile.toLowerCase();

    /*levnshtein function loops through all of the missiles comparing each of them with
    the given missile in order to find how close each one matches.*/
    for(let i = 0; i < missPross.length; i++) {
      scores.push(levenshtein(missile, missPross[i].missile));
    }

    /*Thereby finding the fox code.*/
    let num = arraySmallest(scores);
    foxCode = missPross[num].foxCode;
    return foxCode;
  }

  function arraySmallest(array) {
    /*Identifies the address of the smallest score in the array.*/
    let size, currSmall, b;
    size = array.length;
    currSmall = 0;
    b = 1;

    while (true) {
      if (array[b] < array[currSmall]) {
        currSmall = b;
      }
      if (b == array.length) {
        break;
      }
      b++;
    }
    return currSmall;
  }
    function getDistanceToUser(callsign) {
	let user = getUserByCallsign(callsign);
	let loc_B = user.co;
	console.log("Target Coordinates: "+loc_B[0]+" Longitude, "+loc_B[1]+" Latitude, "+loc_B[2]+" Altitude.")
	let loc_A = geofs.aircraft.instance.llaLocation;
	console.log("Local Coordinates: "+loc_A[0]+" Longitude, "+loc_A[1]+" Latitude, "+loc_A[2]+" Altitude.")
	let vel_B = getAS(callsign);
	let vel_A = geofs.aircraft.instance.velocityScalar;
	let distance_A_B = Math.sqrt(((loc_B[0]-loc_A[0])**2)+((loc_B[1]-loc_A[1])**2));
	console.log("Distance to Target: "+distance_A_B+" meters");
}
    
    
    

  function loadFciUi() {
    /*Fox code identification*/
    let missile;
    let foxCode = "";
    /*sets up input box.*/
    let input = document.createElement("input");
    input.placeholder = "missile lookup";
    input.id = "acs_fci_btn";
    input.classList.add("geofs-stopKeyboardPropagation");
    input.classList.add("geofs-stopKeyupPropagation");
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(input);

    /*sets up search button.*/
    let btn = document.createElement("button");
    btn.innerText = "Search";
    btn.onclick = function() {
      /*manages findMatch()*/
      missile = document.getElementById("acs_fci_btn").value;
      foxCode = findMatch(missile);
      input.value = foxCode;
    };
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(btn);
  }

  function loadFcsUi() {
    /*Fire Control System*/
    /*Adds Flares button*/
    let flares = document.createElement("button");
    flares.innerText = "FLARES!";
    flares.onclick = function() {
      multiplayer.chatMessage = "flares";
    };
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(flares);

    /*Adds chaff button*/
    let chaff = document.createElement("button");
    chaff.innerText = "CHAFF!";
    chaff.onclick = function() {
      multiplayer.chatMessage = "chaff";
    };
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(chaff);

    /*Adds evasive button*/
    let evasive = document.createElement("button");
    evasive.innerText = "EVASIVE!";
    evasive.onclick = function() {
      multiplayer.chatMessage = "evasive";
    };
    document.getElementsByClassName("geofs-ui-bottom")[0].appendChild(evasive);
  }

  /*Main core function. Everthing else will start from here.*/
  function init() {
    loadFciUi();
    loadFcsUi();
  }
  init();
})();
