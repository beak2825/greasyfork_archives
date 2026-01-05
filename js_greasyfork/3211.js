// ==UserScript==
// @name                        MTurk Wage Reporter
// @namespace                   localhost
// @description                 Tracks a best-estimate hourly wage on active HITs being worked.
// @include                     https://www.mturk.com/mturk/accept?*
// @include                     https://www.mturk.com/mturk/continue?*
// @include                     https://www.mturk.com/mturk/previewandaccept?*
// @include                     https://www.mturk.com/mturk/preview?*
// @include                     https://www.mturk.com/mturk/dashboard*
// @include                     https://www.mturk.com/mturk/submit*
// @version                     0.7.5b
// @grant                       GM_setValue
// @grant                       GM_getValue
// @grant						GM_addStyle
// @grant						GM_getResourceText
// @require                     http://code.jquery.com/jquery-2.1.1.js
// @require						http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @require						http://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/bootstrap-datepicker.min.js
// @require      				http://cdn.jsdelivr.net/jqplot/1.0.8/jquery.jqplot.js
// @require      				http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.dateAxisRenderer.min.js
// @require      				http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.canvasAxisTickRenderer.js
// @require      				http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.canvasAxisLabelRenderer.js
// @require      				http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.canvasTextRenderer.js
// @require      				http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.categoryAxisRenderer.js
// @require      				http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.pointLabels.js
// @require						http://cdn.jsdelivr.net/jqplot/1.0.8/plugins/jqplot.barRenderer.min.js
// @require 					https://greasyfork.org/scripts/3595-jqmodal/code/jqModal.js?version=10865
// @require						http://cdnjs.cloudflare.com/ajax/libs/moment.js/2.7.0/moment.min.js
// @require						http://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.2.0/moment-timezone.min.js
// @resource		jqmodal		http://cdn.jsdelivr.net/jqmodal/0.1/jqModal.css
// @resource     	jqplot		http://cdn.jsdelivr.net/jqplot/1.0.8/jquery.jqplot.css
// @resource		jqdp		http://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/css/datepicker.min.css
// @author                      DeliriumTremens 2014
// @downloadURL https://update.greasyfork.org/scripts/3211/MTurk%20Wage%20Reporter.user.js
// @updateURL https://update.greasyfork.org/scripts/3211/MTurk%20Wage%20Reporter.meta.js
// ==/UserScript==
//
// 2014-07-10   0.1b    Beginning development.  Creating timer and tab tracker, as well as initial IndexedDB for storage of data.
//
//
// 2014-07-15   0.4.2b  Continued development.  Not ready for live usage yet.  Expanded math for wage calculation, added safeguards
//                      to prevent adding expired or missing HITs.  Added formatting for dashboard. Set up groundwork for additional
//                      math to be included in the next update.  Added a buttload of comments to the code.
//
//
// 2014-07-16   0.5b    More work!  Added function to remove a HIT that expires from the database under the assumption that expired hits
//                      were forgotten about rather than actively worked on until expiration.  Updated wage calculation because I had a major
//                      brainfart about DIVIDING DOLLARS BY HOURS -- don't ask... Yet more safeguards and checks put in place...
//
// 2014-07-16   0.5.1b  Added a dropdown to select hourly wage by requester.  Minor bug fixes.
//
// 2014-07-18   0.6b    Added functions to crosscheck HITs in the database to ensure only submitted or returned HIT's appear in the calculations.
//                      Without this, HITs that expired in queue would show up with insanely high rates of pay -- which we don't want.  This update
//                      was a massive thorn in my side, and not easy to accomplish -.-
//
// 2014-07-18   0.6.1b  Fixed a bug that was causing some PandA HITs not to appear in wages, as well as producing inaccurate wages.  
//                      Cleaned up some database closing methods.
//
// 2014-07-23   0.6.2b  Added ability to export, import, and delete the database.  A few small bugfixes.
//
// 2014-07-23   0.6.3b  Added cookie refresher button to clear cookies and rescrape status pages when hits arent "completing" correctly
//
// 2014-07-24   0.6.5b  Fixed bug in calculation function that was reporting inaccurate wages.
//
// 2014-07-25   0.6.6b  Fixed bug in CSV export and import, successfully moved the database between firefox and chrome, updating records appropriately
//                                Added chart button and wage charts.
//
// 2014-07-28	0.7b	Now reports in Amazon time.
//
// 2014-07-29   0.7.2b	Added an element to the chart div -- when you hover the bar for a specific hour, it will show you a breakdown for that hour of:
//                      Wage, # of HITs, and total Earned.
//
// 2014-07-30   0.7.4b  Added a calendar button to choose the date you want to view for HITs recorded by Wage Reporter.
//
// ------------------------------------------------------------------------------------------------------------------------------------------------
// First, create indexedDB variables.
// This sets up the various indexedDB functions and processes for interacting with WageDB.
// Parts borrowed from HITdb
//
//
// START CSS ADDSTYLE CODE
//
var jqmodCSS = GM_getResourceText("jqmodal");
var jqplotCSS = GM_getResourceText("jqplot");
var jqdpCSS = GM_getResourceText("jqdp");
GM_addStyle(jqdpCSS);
GM_addStyle(jqmodCSS);
GM_addStyle(jqplotCSS);


moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0'); // Add Amazon timezone to moment.js
//
// STOP CSS ADDSTYLE CODE
//
//
//
//
// START INDEXEDDB CODE
//
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

// Variables used for updating the wage per requester chosen
var reqList = [];
var permHitArray = [];
var wageReturn = 0;
var WageStorage = {};

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange;

var idbKeyRange = window.IDBKeyRange;

WageStorage.indexedDB = {};
WageStorage.indexedDB.db = null;

// Global catch for indexedDB errors
WageStorage.indexedDB.onerror = function (e) {
    console.log(e);
}

// Check if database exists.  If no database, create one.  
// Parts borrowed from HITdb.
var inProgress = false; // Boolean for when a HIT is continued from queue
var dbExists = true; // Boolean for when the database is already created
var v = 7; // Version of the database
WageStorage.indexedDB.create = function () { // Function that creates the database if it hasn't been created already.
    var request = indexedDB.open("WageDB", v);

    request.onupgradeneeded = function (e) {
        //console.log("CREATE THE FUCKING DATABSE, SHIT");
        WageStorage.indexedDB.db = e.target.result;

        var db = WageStorage.indexedDB.db;
        var newDB = false;

        if (!db.objectStoreNames.contains("Wage")) {
            var store = db.createObjectStore("Wage", {
                keyPath: "hitId" // Primary key of the database (not an index)
            });
            store.createIndex("date", "date", { // These are the other fields (or Indexes) of the database.
                unique: false
            });
            store.createIndex("reqName", "reqName", {
                unique: false
            });
            store.createIndex("reqId", "reqId", {
                unique: false
            });
            store.createIndex("checkId", "checkId", {
                unique: false
            });
            store.createIndex("reward", "reward", {
                unique: false
            });
            store.createIndex("start", "start", {
                unique: false
            });
            store.createIndex("stop", "stop", {
                unique: false
            });
            store.createIndex("unworked", "unworked", {
                unique: false
            });
            store.createIndex("submitted", "submitted", {
                unique: false
            });
            newDB = true;
        }
        db.close();
    }
    request.onsuccess = function (e) {
        WageStorage.indexedDB.db = e.target.result;
        var db = WageStorage.indexedDB.db;
        db.close();
    }
    request.onerror = console.log(request.errorCode);
}

// Function for adding HIT data into database.  
// Includes logic for updating HITs which were worked on in several sittings (or from queue)
WageStorage.indexedDB.addhit = function () {
    var request = indexedDB.open("WageDB", v);

    request.onsuccess = function (e) {
        WageStorage.indexedDB.db = e.target.result;

        var db = WageStorage.indexedDB.db;
        var newDB = false;

        if (!db.objectStoreNames.contains("Wage")) { // Make sure database is there... This should never fire.
            db.close();
        } else {
            var trans = db.transaction(["Wage"], 'readwrite');
            var store = trans.objectStore("Wage");
            var request;

            request = store.put({ // Insert fresh hit into database
                hitId: hitId,
                date: date,
                reqName: reqName,
                reqId: reqId[1],
                checkId: checkId,
                reward: reward,
                start: wageStart,
                stop: wageEnd,
                unworked: wageExtra,
                submitted: submitted
            });
            request.onsuccess = function (e) {
                //console.log(e.target.result);
                //console.log("Inserted HIT into database...")
            }
            request.onerror = function (e) {
                //console.log("Failed to add hit.");
            }
        }
        db.close();
    }
    request.onerror = WageStorage.indexedDB.onerror;
}

// Function for getting todays data.
// Gets reward amount, start time, stop time, and queue time (unworked time)
WageStorage.indexedDB.getWage = function () {
    //console.log("Retrieving wage for dashboard...");
    var request = indexedDB.open("WageDB", v);
	reqList.length = 0;
    request.onsuccess = function (e) {
        //console.log("getWage first request");
        WageStorage.indexedDB.db = e.target.result;

        var db = WageStorage.indexedDB.db
        var transaction = db.transaction('Wage', 'readonly');
        var store = transaction.objectStore('Wage');
        var index = store.index('date');
        var range = IDBKeyRange.only(date);

        var results = [];
        var tmp_results = {};

        index.openCursor(range).onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var hit = cursor.value;
                if (tmp_results[hit.hitId] === undefined) {
                    tmp_results[hit.hitId] = [];
                    tmp_results[hit.hitId][0] = hit.reward;
                    tmp_results[hit.hitId][1] = hit.start;
                    tmp_results[hit.hitId][2] = hit.stop;
                    tmp_results[hit.hitId][3] = hit.unworked;
                    tmp_results[hit.hitId][4] = hit.submitted;
                    if (!hit.submitted) {
                        var hitSubmitted = false;
                        //console.log(hit.checkId);
                        //console.log($.inArray(hit.checkId, permHitArray));
                        ($.inArray(hit.checkId, permHitArray) > -1 ? hitSubmitted = true : hitSubmitted = false);
                        //console.log(hitSubmitted);
                        if (hitSubmitted) {
                            if ($.inArray(hit.reqName, reqList) === -1) {
                                reqList.push(hit.reqName);
                            }
                            WageStorage.indexedDB.updateHit(hit.hitId, hitSubmitted);
                            tmp_results[hit.hitId][4] = true;
                        }
                    } else if (hit.submitted) {
                        if ($.inArray(hit.reqName, reqList) === -1) {
                            reqList.push(hit.reqName);
                        }
                    }
                }
                cursor.continue();
            } else {
                for (var key in tmp_results) {
                    if (tmp_results[key][4]) {
                        results.push(tmp_results[key]);
                    }
                }
                //console.log("Calculating wage...");
                //console.log(reqList);
                var wage = calculateWage(results); // Calls function to calculate wage
                //console.log("Wage calculated, showing results..." + wage);
                addTableElement(wage); // Calls function to add wage to dashboard after all data has been pulled
            }
        }
        db.close();
    }
    request.onerror = WageStorage.indexedDB.onerror;
}

// Function to return a wage for a specific requester
WageStorage.indexedDB.getReq = function (requesterName) {
    var request = indexedDB.open("WageDB", v);
    var requester = requesterName;
    request.onsuccess = function (e) {
        WageStorage.indexedDB.db = e.target.result;

        var db = WageStorage.indexedDB.db
        var transaction = db.transaction('Wage', 'readonly');
        var store = transaction.objectStore('Wage');
        var index = store.index('date');
        var range = IDBKeyRange.only(date);
        var results = [];
        var tmp_results = {};

        index.openCursor(range).onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var hit = cursor.value;
                if (tmp_results[hit.hitId] === undefined) {
                    tmp_results[hit.hitId] = [];
                    tmp_results[hit.hitId][0] = hit.reward;
                    tmp_results[hit.hitId][1] = hit.start;
                    tmp_results[hit.hitId][2] = hit.stop;
                    tmp_results[hit.hitId][3] = hit.unworked;
                    tmp_results[hit.hitId][4] = hit.submitted;
                    tmp_results[hit.hitId][5] = hit.reqName;
                }
                cursor.continue();
            } else {
                //console.log(tmp_results);
                for (var key in tmp_results) {
                    if (requester === 'All') {
                        tmp_results[key].pop();
                        if (tmp_results[key][4]) {
                            results.push(tmp_results[key]);
                        }
                    } else {
                        if (tmp_results[key][5] === requester) {
                            tmp_results[key].pop();
                            if (tmp_results[key][4]) {
                                results.push(tmp_results[key]);
                            }
                        }
                    }
                }
                //console.log("Calculating specific Requester wage...");
                var wage = calculateWage(results); // Calls function to calculate wage
                //console.log("Requester Wage calculated, showing results..." + wage);
                $('td[name="wageCell"]').text("$" + wage + "/hr");
                //wageReturn = wage;
                return;
            }
        }
        db.close();
        return;
    }
    return;
}

// Function to check if HIT has already been started, if so then store the start and end time so it can be updated and have unworked time added to database
WageStorage.indexedDB.getHit = function () {
    //console.log("Checking if HIT exists...");
    var request = indexedDB.open("WageDB", v);

    request.onsuccess = function (e) {
        WageStorage.indexedDB.db = e.target.result;

        var hitId2 = $('input[name="hitId"]').val();

        var db = WageStorage.indexedDB.db
        var transaction = db.transaction('Wage', 'readonly');
        var store = transaction.objectStore('Wage');

        var hitCheck = store.get(hitId2);
        hitCheck.onsuccess = function (event) {
            if (event.target.result === undefined) {
                inProgress = false;
                //console.log("New HIT...");
            } else {
                inProgress = true;
                wageExtra = (event.target.result.unworked + (wageStart - event.target.result.stop));
                wageStart = event.target.result.start;
                //console.log("HIT exists, continuing...");
            }
        }
        db.close();
    }
}

WageStorage.indexedDB.updateHit = function (updateId, submitted) {
    var request = indexedDB.open("WageDB", v);
    var remHit = remHit;
    var updater = updateId;
    //console.log("attempting to update hit " + updater);
    request.onsuccess = function (e) {
        WageStorage.indexedDB.db = e.target.result;

        var db = WageStorage.indexedDB.db
        var transaction = db.transaction(['Wage'], "readwrite");
        var store = transaction.objectStore('Wage');
        var updateRequest = store.get(updateId);

        updateRequest.onerror = function (e) {
            console.log(e)
        }
        updateRequest.onsuccess = function (e) {
            var data = e.target.result;
            data.submitted = submitted;

            var pushUpdate = store.put(data);
            pushUpdate.onerror = function (e) {
                console.log(e)
            }
            pushUpdate.onsuccess = function (e) { /* console.log("updated hit to submitted"); */
            }
        }
        db.close();
    }
    //request.onerror = console.log("nope");
}

// Function to remove bad or unused HIT from database
WageStorage.indexedDB.delHit = function (remHit) {
    //console.log("Expired HIT... Removing from DB...");
    var request = indexedDB.open("WageDB", v);
    var remHit = remHit;

    request.onsuccess = function (e) {
        WageStorage.indexedDB.db = e.target.result;

        var db = WageStorage.indexedDB.db
        var transaction = db.transaction('Wage', 'readwrite');
        var store = transaction.objectStore('Wage');

        var hitDel = store.delete(remHit);
        hitDel.onsuccess = function (event) {
            //console.log("HIT successfully deleted from database...");
        }
        db.close();
    }
}

// Function to pull all data from DB and send to export function
WageStorage.indexedDB.expDB = function () {
    var request = indexedDB.open("WageDB", v);

    request.onsuccess = function (e) {
        WageStorage.indexedDB.db = e.target.result;

        var db = WageStorage.indexedDB.db;
        var transaction = db.transaction('Wage', 'readonly');
        var store = transaction.objectStore('Wage');

        var results = [];
        var tmp_results = {};

        store.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            //console.log(cursor);
            if (cursor) {
                var hit = cursor.value;
                if (tmp_results[cursor.key] === undefined) {
                    tmp_results[cursor.key] = [];
                    tmp_results[cursor.key][0] = hit.hitId;
                    tmp_results[cursor.key][1] = hit.date;
                    tmp_results[cursor.key][2] = hit.checkId;
                    tmp_results[cursor.key][3] = hit.reqId;
                    tmp_results[cursor.key][4] = hit.reqName;
                    tmp_results[cursor.key][5] = hit.start;
                    tmp_results[cursor.key][6] = hit.stop;
                    tmp_results[cursor.key][7] = hit.unworked;
                    tmp_results[cursor.key][8] = hit.reward;
                    tmp_results[cursor.key][9] = hit.submitted;
                }
                cursor.continue();
            } else {
                for (var key in tmp_results) {
                    results.push(tmp_results[key]);
                }
                exportToCSV(results);
            }
        }
        db.close();
    }
    //request.onerror = console.log("error");
}

// Function to import a CSV into the database
WageStorage.indexedDB.impDB = function (hitData) {
    var hits = hitData.length;
    var request = indexedDB.open("WageDB", v);
    request.onsuccess = function (e) {
        var db = e.target.result;
        var trans = db.transaction('Wage', 'readwrite');
        var store = trans.objectStore('Wage');
        var req = store.openCursor().onsuccess = function (event) {
                var cursor = event.target.result;
                for (var i = 0; i < hits; i++) {
                    if (cursor) {
                        var putReq = store.put(hitData[i]);
                    } else {
                        var putReq = store.add(hitData[i]);
                    }
                }
            }
        db.close();
    }
    //request.onerror = console.log("error in import");
}

// Function to delete the database
WageStorage.indexedDB.deleteDB = function () {
    var deleteRequest = indexedDB.deleteDatabase("WageDB");
    deleteRequest.onsuccess = function (e) {
        alert("deleted");
    }
    deleteRequest.onblocked = function (e) {
        alert("blocked");
    }
    deleteRequest.onerror = WageStorage.indexedDB.onerror;
}

// Function to get all dates from database
WageStorage.indexedDB.getDates = function () {
 	var request = indexedDB.open("WageDB", v);
	var hitDates = []
    request.onsuccess = function (e) {
        WageStorage.indexedDB.db = e.target.result;

        var db = WageStorage.indexedDB.db
        var transaction = db.transaction('Wage', 'readonly');
        var store = transaction.objectStore('Wage');

        store.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            //console.log(cursor);
            if (cursor) {
        		var hit = cursor.value;
                var hitDate = hit.date.replace('"','');
                hitDate = hitDate.replace('"','');
                if (hitDates.indexOf(hitDate) === -1 && hitDate != 'date' && hitDate != "undefined") {
                    hitDates.push(hitDate);
                }
            	cursor.continue();
            } else {
    			hitDates = hitDates.sort(function (a, b) { // Function that sorts the list of HITs by time starting with the first HIT of the day
        			if (a < b) return -1;
        			if (a > b) return 1;
        			return 0;
    			});
				addCalendarElement(hitDates);
            }          
        }
        db.close();
    }
}

//
//
// END INDEXEDDB CODE
//
//
//
// START EXPORT AND IMPORT CODE
//
exportToCSV = function (results) {
    var csvData = 'hitId,date,checkId,reqId,reqName,start,stop,unworked,reward,submitted';
    for (var i = 0; i < results.length; i++) {
        csvData += formatLineCSV(results[i]);
    }
    location.href = 'data:text/csv;charset=utf8,' + encodeURIComponent(csvData);
}

importFromCSV = function (results) {

}

formatLineCSV = function (hit) {
    var line = '';
    line += '"' + hit[0] + '",';
    line += '"' + hit[1] + '",';
    line += '"' + hit[2] + '",';
    line += '"' + hit[3] + '",';
    line += '"' + hit[4] + '",';
    line += hit[5] + ',';
    line += hit[6] + ',';
    line += hit[7] + ',';
    line += hit[8] + ',';
    line += hit[9] + ',';
    line += '\n';
    return line;
}

//
// STOP EXPORT AND IMPORT CODE
//
//
//
// START WAGE CALCULATION AND INSERTION CODE
//
//
// Script Variables
var limit = 0;
var submitted = false;
var wageLost = false; // Boolean for a returned hit, and a wage that is abandoned.  Will record the time with zero payment.
var wageExtra = 0; // Placeholder for extra time that was not worked.
var wageStart = null; // Placeholder for start time of HIT
var wageEnd = null; // Placeholder for end time of HIT
var wageNix = false; // Placeholder for determining if HIT was expired or unavailable or captcha'd
var expiredHit = false; // Placeholder for expired HIT
var reqId = document.URL.match(/requesterId=(.*?)&/i); // Parse requester ID out of URL
if (reqId) {
    GM_setValue("reqId", reqId); // If no requester ID is available, it's because you accepted next hit in batch. Retrieves ID.
} else {
    reqId = GM_getValue("reqId"); // Stores requester ID in a global script var to be pulled in case of batch work.
}

// HIT Data
var hitId = $('input[name="assignmentId"]').val(); // Parses hit id from html
var checkId = null;
var submitted = false;
var reward = parseFloat($('span[class="reward"]:eq(1)').text().replace('$', '')); // Parses reward from html
var reqName = $('input[name="prevRequester"]').val(); // Parses requester name from html
var date = new Date(); // Get todays date
date = date.toLocaleDateString({
    timeZone: 'America/Los_Angeles'
}).replace(/\//g, '-'); // Convert date to usable string
var todayDate = new Date();
todayDate = todayDate.toLocaleDateString({
    timeZone: 'America/Los_Angeles'
}).replace(/\//g, '-');
// Create table element for showing hourly wage.  Parts borrowed from Today's Projected Earnings script
var allTds, thisTd;
var allTdhtml = [];

calculateWage = function (wage) { // Function that does the meat of the wage calculation. Meaty. Array has [wage,num_hits,total_earned]
    wageChartArr = { // Array that holds all the hourly data for chart.
        0: [
            [], 0, 0],
        1: [
            [], 0, 0],
        2: [
            [], 0, 0],
        3: [
            [], 0, 0],
        4: [
            [], 0, 0],
        5: [
            [], 0, 0],
        6: [
            [], 0, 0],
        7: [
            [], 0, 0],
        8: [
            [], 0, 0],
        9: [
            [], 0, 0],
        10: [
            [], 0, 0],
        11: [
            [], 0, 0],
        12: [
            [], 0, 0],
        13: [
            [], 0, 0],
        14: [
            [], 0, 0],
        15: [
            [], 0, 0],
        16: [
            [], 0, 0],
        17: [
            [], 0, 0],
        18: [
            [], 0, 0],
        19: [
            [], 0, 0],
        20: [
            [], 0, 0],
        21: [
            [], 0, 0],
        22: [
            [], 0, 0],
        23: [
            [], 0, 0]
    };
    var currStart = 0;
    var currEnd = 0;
    var currWages = [];
    var currHit = 0;
    var batch = [];
    var batchWage = 0;
    var currWage = 0;
    var hour = 0;

    var wage = wage.sort(function (a, b) { // Function that sorts the list of HITs by time starting with the first HIT of the day
        if (a[1] < b[1]) return -1;
        if (a[1] > b[1]) return 1;
        return 0;
    });

    for (var x = 0; x < wage.length; x++) {
        currEnd = wage[x][2];

        hour = new Date(currEnd);
        hour = moment(hour);
        hour = hour.tz('America/Los_Angeles').format('H');

        wageChartArr[hour][1] += 1;
        wageChartArr[hour][2] += wage[x][0];

        currEnd = 0;
    }
    for (var i = 0; i < wage.length; i++) {
        if (currStart < wage[i][1] && wage[i][1] < currEnd && moment(currEnd) === hour) {
            // If current HIT started before previous HIT was submitted during the same hour, start batch processing
            currEnd = wage[i][2];
            currHit = (wage[i][0]) / ((((currEnd - currStart) - wage[i][3]) / 1000) / 3600);
            batch.push(currHit);
        } else if ((currStart >= wage[i][1] && wage[i][1] >= currEnd) || (currStart < wage[i][1] && wage[i][1] > currEnd)) {
            // Before starting a hit outside of a confirmed batch, add contents of batch to wages
            if (batch.length >= 1) {
                for (var j = 0; j < batch.length; j++) {
                    batchWage += batch[j];
                }
                batchWage = wageRound((batchWage / batch.length), 2);
                currWages.push(batchWage);

                hour = new Date(currEnd);
                hour = moment(hour);
                hour = hour.tz('America/Los_Angeles').format('H');
                wageChartArr[hour][0].push(batchWage)

                batchWage = 0;
                batch.length = 0;

                currStart = wage[i][1];
                currEnd = wage[i][2];
                currHit = (wage[i][0]) / ((((currEnd - currStart) - wage[i][3]) / 1000) / 3600);
                batch.push(currHit);

                hour = new Date(currEnd);
                hour = moment(hour);
                hour = hour.tz('America/Los_Angeles').format('H');

            } else {
                currStart = wage[i][1];
                currEnd = wage[i][2];
                currHit = (wage[i][0]) / ((((currEnd - currStart) - wage[i][3]) / 1000) / 3600);
                batch.push(currHit);

                hour = new Date(currEnd);
                hour = moment(hour);
                hour = hour.tz('America/Los_Angeles').format('H');
            }
        }
    }

    if (batch.length >= 1) {
        for (var i = 0; i < batch.length; i++) {
            batchWage += batch[i];
        }
        batchWage = wageRound((batchWage / batch.length), 2);
        currWages.push(batchWage);
        wageChartArr[hour][0].push(batchWage);
        batchWage = 0;
        batch = [];
    }
    currWage = 0;
    for (var i = 0; i < currWages.length; i++) {
        // Add up all of the calculated wages in the current wages array
        //console.log(currWages);
        currWage += currWages[i];
    }
    // Find the rounded average of all wages in the array
    currWage = wageRound((currWage / currWages.length), 2);

    return currWage;
}


// Function to add the table cells to dashboard and displaying the wage
addTableElement = function (wage) {
    var belowThisTD = (($.inArray('<a href=\"https://www.mturk.com/mturk/dashboard\">Today\'s Projected Earnings</a>', allTdhtml) > -1) ? /Today's Projected Earnings/ : /Total Earnings/); // If Projected Earnings script is installed, this will be sure to place is in the correct spot
    var rowColor = (($.inArray('<a href=\"https://www.mturk.com/mturk/dashboard\">Today\'s Projected Earnings</a>', allTdhtml) > -1) ? "#f1f3eb" : "FFFFFF"); // If Projected Earnings script is installed, this will ensure the correct color is used for the new row
    for (var i = 0; i < allTds.length; i++) {
        thisTd = allTds[i];
        if (thisTd.innerHTML.match(belowThisTD) && thisTd.className.match(/metrics\-table\-first\-value/)) {
            var row = document.createElement('tr');
            row.setAttribute("name", "wageRow");
            row.className = "even";
            row.setAttribute("style", ("background-color:" + rowColor));

            var hourlyWageTitle = document.createElement('p');
            hourlyWageTitle.setAttribute("name", "wageTitle");
            hourlyWageTitle.innerHTML = ((date === todayDate) ? "Today's Hourly Wage &nbsp &nbsp" : (date + " Hourly Wage "));
            hourlyWageTitle.setAttribute("style", ("background-color:" + rowColor));

            var cellLeft = document.createElement('td');
            cellLeft.className = "metrics-table-first-value";
            cellLeft.appendChild(hourlyWageTitle);
            row.appendChild(cellLeft);

            var cellRight = document.createElement('td');
            cellRight.setAttribute("name", "wageCell");
            cellRight.innerHTML = "$" + wage + "/hr";
            row.appendChild(cellRight);

            thisTd.parentNode.parentNode.insertBefore(row, thisTd.parentNode.nextSibling);
        }
    }
    // Drop down menu for requesters
    $('p[name="wageTitle"]').append('<select name="requester" class="wageDrop" tabindex="2" style="width:55px;height:15px;border-style:none;">');
    $('.wageDrop').append('<option value="All">All</option>')
    for (var i = 0; i < reqList.length; i++) {
        $('.wageDrop').append('<option value="' + reqList[i] + '">' + reqList[i] + '</option>')
    }
    $('.wageDrop').append('</select>');

    // Buttons for exporting CSV, importing CSV, viewing graphs, and deleting the DB
    $('p[name="wageTitle"]').append('<button title="Export CSV" name="exportWages" class="exportWages" style="position:absolute;border-style:none;width:7px;height:10px;padding:0;margin-left:2px;margin-top:2px;background-image:url(https://i.imgur.com/n3W91o9.png);background-color:transparent;cursor:pointer;"></button>').button();
    $('p[name="wageTitle"]').append('<button title="Import CSV" name="importWages" class="importWages" style="position:absolute;border-style:none;width:7px;height:10px;padding:0;margin-left:11px;margin-top:2px;background-image:url(https://i.imgur.com/2u0Ys3M.png);background-color:transparent;cursor:pointer;"></button>').button();
    $('p[name="wageTitle"]').append('<input type="file" id="importWages" style="display:none";/>');
    $('p[name="wageTitle"]').append('<button title="Refresh Cookies" name="refWages" class="refWages" style="position:absolute;border-style:none;width:7px;height:10px;padding:0;margin-left:20px;margin-top:2px;background-image:url(https://i.imgur.com/Vtavo0C.png);background-color:transparent;cursor:pointer;"></button>').button();
    $('p[name="wageTitle"]').append('<span class="jqModal"><button title="View Graph" name="viewWages" class="viewWages" style="position:absolute;border-style:none;width:7px;height:10px;padding:0;margin-left:29px;margin-top:2px;background-image:url(https://i.imgur.com/43y0g16.png);background-color:transparent;cursor:pointer;"></button></span>').button();
	$('p[name="wageTitle"]').append('<button title="Choose Date" name="wageDate" class="wageDate" style="position:absolute;border-style:none;width:7px;height:10px;padding:0;margin-left:38px;margin-top:2px;background-image:url(https://i.imgur.com/9U616GG.png);background-color:transparent;cursor:pointer;"></button>').button();
    $('p[name="wageTitle"]').append('<div style="position:absolute;border-style:none;width:7px;height:10px;padding:0;margin-left:38px;margin-top:2px;"><input type="text" id="datepicker" style="position:relative;width:0px;height:0px;border-style:none;"></div>');
    $('p[name="wageTitle"]').append('<button title="Delete DB" name="delWages" class="delWages" style="position:absolute;border-style:none;width:7px;height:10px;padding:0;margin-left:47px;margin-top:2px;background-image:url(https://i.imgur.com/LpdS1wx.png);background-color:transparent;cursor:pointer;"></button>').button();

    // Div for chart(s)
    $("body").append('<div id="wageChartHolder" class="jqmWindow"><a href="#" class="jqmClose">Close</a><div id="wageChart" style="width:600px;height:250px;"></div><div id="chartpseudotooltip" class="jqplot-highlighter-tooltip" style="position:relative;float:right;width:125px;height:60px;top:-220px;margin-bottom:-100px;left:-20px;font-family:Arial;font-size:0.75em;"></div></div>');
    $('#wageChartHolder').jqm({
        onShow: function (hash) {
            hash.w.show();
            $('#wageChart').empty();
            wageChart(wageChartArr);
        },
        onHide: function (hash) {
            hash.w.hide();
            hash.o.remove();
        }
    });
}

addCalendarElement = function (dateRange) {
    var firstDate = dateRange[0];
    var lastDate = dateRange[dateRange.length - 1];
    
    $('#datepicker').datepicker({
        format: 'm-dd-yyyy',
        startDate: firstDate,
        endDate: lastDate,
        autoclose: true,
    });
    
    $('#datepicker').datepicker().on('changeDate', function (e) {
        date = $('#datepicker').val();
        if (date[2] === '0') {
            date = date.slice(0,2) + date.slice(3, date.length);
        }
        console.log(date);
        $('tr[name="wageRow"]').remove();
        $('.datepicker').remove();
        WageStorage.indexedDB.getWage();
        WageStorage.indexedDB.getDates();
        $('p[name="wageTitle"]').text(date + ' Hourly Wage &nbsp; &nbsp;');
    });
}

// Function(s) for graphs and charts creation, to be expanded for an on-click method
var wageChartArr = {
    0: [
        [], 0, 0],
    1: [
        [], 0, 0],
    2: [
        [], 0, 0],
    3: [
        [], 0, 0],
    4: [
        [], 0, 0],
    5: [
        [], 0, 0],
    6: [
        [], 0, 0],
    7: [
        [], 0, 0],
    8: [
        [], 0, 0],
    9: [
        [], 0, 0],
    10: [
        [], 0, 0],
    11: [
        [], 0, 0],
    12: [
        [], 0, 0],
    13: [
        [], 0, 0],
    14: [
        [], 0, 0],
    15: [
        [], 0, 0],
    16: [
        [], 0, 0],
    17: [
        [], 0, 0],
    18: [
        [], 0, 0],
    19: [
        [], 0, 0],
    20: [
        [], 0, 0],
    21: [
        [], 0, 0],
    22: [
        [], 0, 0],
    23: [
        [], 0, 0]
};

function wageChart(results) {
    //console.log(results);
    var hourlyWages = [];
    var hourlyHits = [];
    var hourlyTotal = [];
    var thisWage = 0;
    for (var i = 0; i < 24; i++) {
        if (results[i][1] === 0) {
            hourlyWages.push(0);
            hourlyHits.push(0);
            hourlyTotal.push(0);
        } else {
            for (var x = 0; x < results[i][0].length; x++) {
                thisWage += results[i][0][x];
            }
            hourlyWages.push(wageRound((thisWage / results[i][1]), 2));
            thisWage = 0;
            //hourlyWages.push(wageRound((results[i][0] / results[i][1]),2));
            hourlyHits.push(results[i][1]);
            hourlyTotal.push(results[i][2]);
        }
    }
    //console.log(hourlyWages);
    var ticks = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];
    wagePlot = $.jqplot('wageChart', [hourlyWages], {
        seriesDefaults: {
            tickRenderer: $.jqplot.CanvasAxisTickRenderer,
            renderer: $.jqplot.BarRenderer,
            rendererOptions: {
                barWidth: 15,
            },
            pointLabels: {
                show: false,
                hideZeros: true,
                formatString: '$%#.2f\/hr'
            }
        },
        title: {
            text: 'Hourly Wage By Hour For ' + $('.wageDrop :selected').text(),
            fontFamily: '"Trebuchet MS", Arial, Helvetica, sans-serif',
            fontSize: '10pt',
            textColor: '#666666'
        },
        axes: {
            xaxis: {
                renderer: $.jqplot.CategoryAxisRenderer,
                ticks: ticks,
                tickOptions: {
                    showGridline: false
                },
            },
            yaxis: {
                tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                tickOptions: {
                    fontSize: '8pt',
                    showMark: false,
                    prefix: '$'
                },
                pad: 1.2,
                min: 0
            }
        }
    });
    $('#wageChart').bind('jqplotDataHighlight', function (ev, seriesIndex, pointIndex, data) {
        var mouseX = ev.pageX; //these are going to be how jquery knows where to put the div that will be our tooltip
        var mouseY = ev.pageY;
        $('#chartpseudotooltip').html('<table class="jqplot-highlighter"> \
          		<tr><td>Wage:</td><td>$' + data[1] + '\/hr</td></tr> \
          		<tr><td>HITs:</td><td>' + hourlyHits[parseInt(pointIndex)] + '</td></tr> \
          		<tr><td>Earned:</td><td>$' + wageRound(hourlyTotal[parseInt(pointIndex)], 2).toFixed(2) + '</td></tr></table>');
    });

    $('#wageChart').bind('jqplotDataUnhighlight', function (ev) {
        $('#chartpseudotooltip').html('');
    });
}

// Function for legitimate rounding because javascript and floating point math both suck

function wageRound(num, decimals) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

//
//
// STOP WAGE CALCULATION AND INSERTION CODE
//
//
// START HIT CROSS-CHECK CODE (borrowed and edited from Today's Projected Earnings)
//
//
var NumberOfPages = 0;
var todays_values = get_todays_data();
var tempHitArray = [];

// This will grab the data from the table for today. If today doesn't exist yet we return emptyness

function get_todays_data() {
    var tables = document.getElementsByClassName('metrics-table');
    var todays_data = [];
    for (var m = 0; m < tables.length; m++) {
        var table_rows = tables[m].getElementsByTagName('tr');
        for (var n = 0; n < table_rows.length; n++) {
            var table_data = table_rows[n].getElementsByTagName('td');
            status_link = table_rows[n].getElementsByTagName('a');
            if (status_link[0]) {
                if (table_data[0].innerHTML.match(/Today/)) {
                    todays_data = table_data;
                }
            }
        }
    }
    return todays_data;
}

// Process a detailed status page by added up the value of all the hits

function process_page(link) {
    // use XMLHttpRequest to fetch the entire page, use async mode for now because I understand it
    var page = getHTTPObject();
    page.open("GET", link, false);
    page.send(null);
    return earnings_subtotal(page.responseText);
}

// Get HIT IDs

function earnings_subtotal(page_text) {
    var sub_total = 0;
    var page_html = document.createElement('div');
    page_html.innerHTML = page_text;

    var hitIds = page_html.getElementsByClassName('statusdetailRequesterColumnValue');
    for (var i = 0; i < hitIds.length; i++) {
        var thisId = (hitIds[i].getElementsByTagName('a'));
        thisId = $(thisId).attr('href').slice(60, 90);
        tempHitArray.push(thisId);
    }
    return 20;
}

function concatHits(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) a.splice(j--, 1);
        }
    }

    return a;
};

// XMLHttpRequest wrapper from web

function getHTTPObject() {
    if (typeof XMLHttpRequest != 'undefined') {
        return new XMLHttpRequest();
    }
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    return false;
}

//  Cookie functions copied from http://www.w3schools.com/JS/js_cookies.asp

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}


function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function clearCookies() {
    setCookie("WageDBSubtotal", 0, 1);
    setCookie("WageDBPagesDone", 0, 1);
    localStorage[TodaysDate] = [];
    location.reload();
    return true;
}

//
//
// STOP HIT CROSS-CHECK CODE
//
//
// START EVENT HANDLING CODE
//
//
// Dropdown specific functions and settings for the requester selector
$(document).on('click', '.wageDate', function () {
    $('#datepicker').datepicker('show');
});

$(document).on('change', '.wageDrop', function () {
    var optionSelected = $('.wageDrop option:selected').text();
    WageStorage.indexedDB.getReq(optionSelected);
});

// Button specific functions for exporting, importing, graphs, and deleting database
$(document).on('click', '.exportWages', function () {
    WageStorage.indexedDB.expDB();
});

$(document).on('click', '.refWages', function () {
    clearCookies();
});

$(document).on('click', '.delWages', function () {
    if (confirm('This will remove your Wage Database!\n Continue?')) {
        WageStorage.indexedDB.deleteDB();
    }
});

$(document).on('click', '.importWages', function () {
    $('#importWages').click();
});

$(document).on('change', '#importWages', function (e) {
    var hits = [];
    var files = e.target.files;
    var file = files[0];
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = function (e) {
        var text = e.target.result;
        //console.log(text);
        var lines = text.split("\n");
        for (i = 0; i < lines.length; i++) {
            if (i === 0) {
                continue;
            }
            var line = lines[i].split(',');
            var hit = {
                hitId: String(line[0]).replace(/['"]+/g, ''),
                date: String(line[1]).replace(/['"]+/g, ''),
                checkId: String(line[2]).replace(/['"]+/g, ''),
                reqId: String(line[3]).replace(/['"]+/g, ''),
                reqName: String(line[4]).replace(/['"]+/g, ''),
                start: parseInt(line[5]),
                stop: parseInt(line[6]),
                unworked: parseInt(line[7]),
                reward: parseFloat(line[8]),
                submitted: Boolean(line[9])
            };
            hits.push(hit);
        }
        //console.log("There are " + hits.length + " HITs to import...");
        WageStorage.indexedDB.impDB(hits);
    };
    reader.onerror = function (event) {
        console.error("File could not be read! Code " + event.target.error.code);
    };
});

// Timestamp when the HIT is accepted
$(window).ready(function () {
    WageStorage.indexedDB.create(); // Create database if not created yet
    if (document.URL === "https://www.mturk.com/mturk/dashboard" || /preview\?/i.test(document.URL)) {
        WageStorage.indexedDB.getDates();
        if (todays_values.length != 0 && document.URL === "https://www.mturk.com/mturk/dashboard") {
            // Extract Today's Date from link
            TodaysDate = todays_values[0].innerHTML;
            TodaysDate = TodaysDate.substr(TodaysDate.search(/Date=/) + 5, 8);
            permHitArray = localStorage[TodaysDate];
            //console.log(permHitArray);
            (permHitArray === undefined ? permHitArray = [] : permHitArray = permHitArray.split(','));
            //alert("You have completed " + permHitArray.length + " HITs today...");
            // Check whether the date has rolled over since the last time we were called
            if (TodaysDate != getCookie("WageDBDate")) {
                setCookie("WageDBDate", TodaysDate, 1);
                setCookie("WageDBPagesDone", 0, 1);
            }

            // Calculate Number of detailed status pages we have to add up
            // based on the fact there is a 25 hits/page limit.
            // We now only have to add in pages not already totalled and saved
            // in the MturkSubtotal cookie
            NumberOfPages = Math.ceil(todays_values[1].innerHTML / 25);
            NumberOfCompletePages = Math.floor(todays_values[1].innerHTML / 25);
            PagesDone = parseFloat(getCookie("WageDBPagesDone"));

            if (NumberOfCompletePages > PagesDone) {
                for (page = PagesDone + 1; page <= NumberOfCompletePages; page++) // process each completed detailed status page one by one
                {
                    detailed_status_page_link = "https://www.mturk.com/mturk/statusdetail?sortType=All&pageNumber=" + page + "&encodedDate=" + TodaysDate;
                    process_page(detailed_status_page_link);
                }
                setCookie("WageDBPagesDone", NumberOfCompletePages, 1);
            }
            if (NumberOfPages > NumberOfCompletePages) // Handle partial pages
            {
                detailed_status_page_link = "https://www.mturk.com/mturk/statusdetail?sortType=All&pageNumber=" + NumberOfPages + "&encodedDate=" + TodaysDate;
                process_page(detailed_status_page_link);
            }
            permHitArray = concatHits(permHitArray.concat(tempHitArray));
            localStorage[TodaysDate] = permHitArray;
        }

    } // Don't record anything on dashboard, instead add appropriate element to tables
    else {
        wageStart = new Date().getTime(); // As soon as the window can run something, set the start time.
        $('input[name="hitId"]').each(function (a, b) {
            if ($(b).attr("value") === hitId) {} else {
                checkId = $(b).attr("value");
            }
        });
        //console.log("Starting HIT");
    }
});

$(window).on('load', function () {
    allTds = document.getElementsByTagName('td'); // As soon as the page is fully loaded, grab all of the td elements to an array
    for (var i = 0; i < allTds.length; i++) {
        allTdhtml.push(allTds[i].innerHTML);
    }
    if (/preview\?/i.test(document.URL)) {
        if (/expired/i.test($('#alertboxHeader').text())) { // Remove previous HIT from database -- this one expired.
            //console.log(wageNix + " checker for expired hit");
            WageStorage.indexedDB.delHit(GM_getValue("hitId"));
        }
    } else if (/accept\?/i.test(document.URL) || /previewandaccept\?/i.test(document.URL) || /continue\?/i.test(document.URL)) {
        wageNix = (/could not/i.test($('#alertboxHeader').text())); // Set wageNix true if hit is gone
        wageNix = (/expired/i.test($('#alertboxHeader').text())); // Set wageNix true if hit is expired
        wageNix = (($('input[name="userCaptchaResponse"]').length > 0) ? true : false); // Set wageNix true if captcha
        wageNix = (/There are no more available HITs in this group/i.test($('#alertboxMessage').text()));
        //console.log(wageNix + " checker for missing hit");
        WageStorage.indexedDB.getHit(); // As soon as the apge is fully loaded, call function to check if HIT is already in DB
    } else if (/dashboard/i.test(document.URL)) {
        //console.log("On the Dashboard, get wage...");
        WageStorage.indexedDB.getWage();
    } else if (!/https:\/\/www.mturk/i.test(document.URL)) {}
});

// Detect if 'Return HIT' button has been clicked to record timer as zero-earnings.
// Timestamp when button was clicked to end time spent.
$('a[href*="/mturk/return?"]').on('click', function () {
    wageLost = true;
    wageEnd = new Date().getTime();
});

// Detect the page unloading and react accordingly.  
// If return button was clicked, record zero wage earnings, otherwise record earnings.
// Timestamp if submitted to end time spent.
$(window).on('beforeunload', function (e) {
    if (wageLost) {
        // ***** DO STUFF WHEN RETURN CLICKED *****
        reward = 0;
        submitted = true;
        WageStorage.indexedDB.addhit();
        //console.log("Wage lost due to return...");
    } else if (wageStart === null || wageNix === true || /preview\?/i.test(document.URL) || /There are no more available HITs in this group/i.test($('#alertboxMessage').text()) || /The HIT you were viewing could not be accepted/i.test($('#alertboxHeader').text())) {
        // ***** THIS HIT IS GONE OR PREVIEWED *****
        //console.log("Either HIT expired or we were on a preview page");
    } else {
        // ***** DO STUFF WHEN SUBMITTED *****
        //console.log("This should fire no matter what, unless returned...");
        wageEnd = new Date().getTime();
        GM_setValue("hitId", hitId);
        WageStorage.indexedDB.addhit();
    }
});

//
//
// STOP EVENT HANDLING CODE
//