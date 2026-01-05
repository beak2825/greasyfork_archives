// ==UserScript==
// @name        Scan Mod
// @namespace   com.indeed
// @description Scan All Surveyors
// @version     4
// @match        http://*.war-facts.com/sensorArray.php*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12894/Scan%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/12894/Scan%20Mod.meta.js
// ==/UserScript==

var scannerList = document.getElementById('fc_ScanTeam').children;
var index = 0;
var scannerListLength = scannerList.length;
var fleetIdRegex = /menufleet_(\d+)/g;

var table = $("table")[1];
var button = document.createElement('div');
button.innerHTML = '<input type="submit" style="float: left; margin-top: 5px;" name="Auto Perimeter Scan" value="Auto Perimeter Scan" />';
table.parentElement.appendChild(button);
button.onclick = (function() {

    requestAllBuoys(scannerListLength, function(requests) {
        // Take out the responses, they are collected in the order they were
        // requested.
        responses = requests.map(function(request) {
            return request.responseText;
        });

        console.log('Got results! ' +responses.length);

        var scanTable = document.createElement('table');
        scanTable.width = "100%";
        var scanDiv = document.createElement('div');
        scanDiv.className = 'block';
        scanDiv.appendChild(scanTable);
        var div = $('div', document.getElementById('midcolumn'))[0];
        div.appendChild(scanDiv);

        var count = 1;
        responses.forEach(function(scan) {
            console.log('process response ' + count++);
            var el = $( '<div></div>' );
            el.html(scan);
            var el2 = $('table', el)[1];
            for (x = 1; x < el2.rows.length ; x++) {
                var scanRow = scanTable.insertRow(-1);

                for (y = 0; y < el2.rows.item(x).cells.length; y++) {
                    var cell = scanRow.insertCell(-1);
                    cell.innerHTML = el2.rows.item(x).cells[y].innerHTML;
                }

            }
        });

    });
});

var filters = document.getElementById('filterRow').getElementsByTagName('table')[0];
var cell = filters.rows[0].insertCell();
cell.innerHTML = '<input id="selfToggle" type="checkbox" name="self" checked> Show Self';
for (var x = 0; x < filters.rows[0].cells.length; x++) {
    filters.rows[0].cells[x].width = undefined;
}

var toggle = document.getElementById('selfToggle');
toggle.onclick = (function(e) {
    var x, row, owner;
    if (e.target.checked) {
        for (x = 6; x < table.rows.length; x++) {
            row = table.rows[x];
            owner = row.cells[1].innerText;
            if (owner === 'Self') {
                row.hidden = false;
            }
        }
    } else {
        for (x = 6; x < table.rows.length; x++) {
            row = table.rows[x];
            owner = row.cells[1].innerText;
            if (owner === 'Self') {
                row.hidden = true;
            }
        }
    }
});

// Makes request to all buoy url's, calling the given callback once
// all have completed with an array of xmlRequests.
function requestAllBuoys (n, cb) {

    var latch = makeLatch(n, cb);

    makeBuoyURLTo(n).map(function (url, i) {
        startXMLRequest('GET', url, latch.bind(undefined, i));
    });

}

// Generates a latch function, that will execute the given callback
// only once the function it returns has been called n times.
function makeLatch (n, cb) {

    var remaining = n,
        results = [],
        countDown;

    countDown = function (i, result) {
        results[i] = result;
        if (--remaining === 0 && typeof cb == 'function') {
            cb(results);
        }
    };

    return countDown;

}

var scannerList = document.getElementById('fc_ScanTeam').children;
// Generates an array of buoy URL's from 1 to n.
function makeBuoyURLTo (n) {

    var i, buoyUrls = [];

    for (i = 0; i < n; i++) {
        var match =  fleetIdRegex.exec(scannerList[i].children[0].id);
        var fleetId = match === null ? 0 : match[1];

        buoyUrls.push('http://www.war-facts.com/extras/scan.php?fleet=' + fleetId);
        fleetIdRegex.lastIndex = 0;
    }

    return buoyUrls;

}

// Create and initiate an XMLRequest, with the given method to the given url.
// The optional callback will be called on successful completion.
function startXMLRequest (method, url, cb) {

    var xmlRequest = createXMLRequest();

    xmlRequest.onreadystatechange = function () {
        if (isXMLFinished(xmlRequest)) {
            if (cb && typeof cb == 'function') {
                cb(xmlRequest, method, url);
            }
        }
    };

    xmlRequest.open(method, url, true);
    xmlRequest.send();

    return xmlRequest;

}

// Initiates an XMLRequest from either HTML5 native, or MS ActiveX depending
// on what is available.
function createXMLRequest () {

    var xmlRequest;

    if (XMLHttpRequest) {
        xmlRequest = new XMLHttpRequest();
    } else {
        xmlRequest = new ActiveXObject('Microsoft.XMLHTTP');
    }

    return xmlRequest;

}

// Verifies that XMLRequest has finished, with a status 200 (OK).
function isXMLFinished (xmlRequest) {
    return (xmlRequest.readyState == 4) && (xmlRequest.status == 200);
}