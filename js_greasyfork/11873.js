// ==UserScript==
// @name        MTurk HIT DataBase Utility - Check for outdated unpaid HITs
// @namespace https://greasyfork.org/users/12875
// @description Check HIT DataBase for orphaned HITs (older than 45 days and not in a Paid or Rejected status)
// @include     https://www.mturk.com/mturk/checkdb
// @version     0.2
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require     http://code.highcharts.com/highcharts.js
// @require     https://greasyfork.org/scripts/2351-jsdiff/code/jsdiff.js?version=6256
// @require     https://greasyfork.org/scripts/2350-filesaver-js/code/filesaverjs.js?version=6255
// @require     https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.4.0/moment-timezone-with-data-2010-2020.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/11873/MTurk%20HIT%20DataBase%20Utility%20-%20Check%20for%20outdated%20unpaid%20HITs.user.js
// @updateURL https://update.greasyfork.org/scripts/11873/MTurk%20HIT%20DataBase%20Utility%20-%20Check%20for%20outdated%20unpaid%20HITs.meta.js
// ==/UserScript==

var HITStorage = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange;
HITStorage.IDBTransactionModes = { "READ_ONLY": "readonly", "READ_WRITE": "readwrite", "VERSION_CHANGE": "versionchange" };
var IDBKeyRange = window.IDBKeyRange;

HITStorage.indexedDB = {};
HITStorage.indexedDB.db = null;

HITStorage.indexedDB.onerror = function(e) {
    console.log(e);
};
var v = 6;

$("body").html('');
$("body").append("<h1>Check HIT DataBase for Orphaned HITs</h1>");// (Older than " + moment().subtract(45, 'days').format('YYYY-MM-DD') + ")</h1>");
$("body").append("<ul id='badhits'></ul>");

var request = indexedDB.open("HITDB", v);

request.onsuccess = function(e) {
    //HITStorage.update_status_label('Please wait: checking database', 'red');
    HITStorage.indexedDB.db = e.target.result;
    var db = HITStorage.indexedDB.db;
    var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_ONLY);
    var store = trans.objectStore("HIT");
    var index = store.index('date');
	var lastdate = moment().format('YYYY-MM-DD');//.subtract(45, 'days')
    var range = IDBKeyRange.upperBound(lastdate, false);
	var req;
	var badHits = {};

    index.openCursor(range).onsuccess = function(event) {
        var cursor = event.target.result;
		if (cursor) {
			if (cursor.value.status !== 'Rejected' && cursor.value.status !== 'Paid') {
				if (badHits[cursor.value.date] === undefined) {
					badHits[cursor.value.date] = 0;
				}
				badHits[cursor.value.date] += 1;
				//badHits.push("Title: " + cursor.value.title + "<br />Date: " + cursor.value.date + "<br />Status: " + cursor.value.status + "<br />Reward: $" + parseFloat(cursor.value.reward).toFixed(2));
			}
			cursor.continue();
        } else {
			console.log(_.size(badHits));
        	for (var i = 0; i < _.size(badHits); i++) {
				key = Object.keys(badHits)[i];
				$("#badhits").append($("<li></li>").html(key + ': ' + badHits[key] + ' pending'));
        		//$("#badhits").append($("<li></li>").html(badHits[i]));
        	}
        }
    };
	db.close();
};
request.onerror = HITStorage.indexedDB.onerror;