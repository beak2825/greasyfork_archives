// ==UserScript==
// @name        MTurk HIT DataBase Testing
// @namespace   localhost
// @description Extended ability to search HITs you have worked on and other useful //tools (CSV export/import, requester notes, requester block, //pending/projectedearnings)
// @include     https://www.mturk.com/mturk/searchbar*
// @include     https://www.mturk.com/mturk/findhits*
// @include     https://www.mturk.com/mturk/viewhits*
// @include     https://www.mturk.com/mturk/viewsearchbar*
// @include     https://www.mturk.com/mturk/sortsearchbar*
// @include     https://www.mturk.com/mturk/sorthits*
// @include     https://www.mturk.com/mturk/dashboard
// @include     https://www.mturk.com/mturk/preview?*
// @version     1.5.6
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @require     http://code.highcharts.com/highcharts.js
// @require https://greasyfork.org/scripts/2350-filesaver-js/code/filesaverjs.js?version=6255
// @downloadURL https://update.greasyfork.org/scripts/3721/MTurk%20HIT%20DataBase%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/3721/MTurk%20HIT%20DataBase%20Testing.meta.js
// ==/UserScript==

//
// 2012-10-03 0.9.7: This is rewrite of MTurk Extended HIT Search (http://userscripts.org/scripts/show/146277)
//                   with some extra features (and some missing for now: search by date).
//                   It now uses IndexedDB (http://en.wikipedia.org/wiki/Indexed_Database_API)
//
// 2012-10-04 0.9.8: Improved use of indexes, check Pending Payment HITs
//            0.9.9: Minor improvements
//
// 2012-10-04 0.10:  Added date options
//
// 2012-10-07 0.11:  Requester notes, bug fixes
//            0.12:  CSV export
//
// 2012-10-09 0.13: "Block" requesters or specific HITs
//
// 2012-10-10 0.14: Requester Overview, shows summary of all requesters in DB
//
// 2012-10-11 0.15: Blocked HITs are always on bottom of the page
//
// 2012-10-14 0.16: Requester Overview improvements
//
// 2012-10-17 0.17: Bug fixes and error checks
//
// 2012-10-18 0.18: Import HIT data from MTurk Extended HIT Search script
//
// 2012-10-21 0.19: Moved main interface to dashboard, show pending earnings on dashboard,
//                  summary of all requesters with pending HITs.
//
// 2012-10-23 0.20: Added Turkopticon (https://turkopticon.differenceengines.com/) links to overview pages
//            0.21: Fixed overview pages reward to include only 'Paid' and 'Approved - Pending Payment' HITs.
//
// 2012-10-28 0.22: Limited Auto Update.
//            0.23: Minor improvements
//
// 2012-10-30 0.24: Projected earnings for today
//
// 2012-11-02 0.25: Smarter Auto Update
//
// 2012-11-03 0.26: GUI update
//
// 2012-11-05 0.30: Extra non-amazonian script monkeys
//
// 2012-11-06 0.31: Projected earnings progress bar
//
// 2012-11-08 0.32: Minor GUI fixes to look better on Chrome. Looks like it now works on stable Chrome!
//
// 2012-11-13 0.33: Time limits now work with Requester Overview
//
// 2012-11-15 0.34: Bug/compatibility fixes
//
// 2012-11-18 0.40: Daily Overview, update database to use YYYY-MM-DD date format.
//
// 2012-11-22 0.41: R and T button on HIT preview page. Auto-Approval time.
//
// 2012-11-30 0.42: Changes on MTurk pages. Status page in now on one page!
//
// 2012-12-02 1.0: Added @downloadURL and @updateURL
//
// 2012-12-06 1.1: Requester details.
//                 Try to fetch few extra days at first update (not showing on status page).
//
// 2012-12-11 1.2: Import HITs from previously exported CSV-files.
//                 Removed Extended HIT Search import.
//
// 2012-12-13 1.3: Fix CSV-import to put empty string instead if undefined if feedback is empty.
//
// 2012-12-14 1.4: Rewritten database update more properly.
//
// 2012-12-16 1.5: Fixed broken Auto Update (forgot to check that on pervious update).
//
// 2013-08-20 1.5.5:Firefox 23 Compatibility Issues. Removed New Windows and replaced with a Faux Frame.
//					ReplacedTurkopticon Links with https versions
//
// 2013-11-06 1.5.6:Firefox 25 Compatibility Issues. Database transaction modes weren't working with defined variables.

FauxFrameobj = document.createElement('div');
FauxFrameobj.style.display = 'none'; 
FauxFrameobj.style.position = 'fixed';
FauxFrameobj.style.top = '10%';
FauxFrameobj.style.left = '10%';
FauxFrameobj.style.height = '80%';
FauxFrameobj.style.width = '80%';
FauxFrameobj.style.overflow = 'scroll';
FauxFrameobj.style.padding = '10px';
FauxFrameobj.style.backgroundColor = '#7fb4cf'; 
FauxFrameobj.name = "FauxFrame";
FauxFrameobj.ID = "FauxFrame";
FauxFrameobj.innerHTML = "";
body = document.getElementsByTagName('body')[0];
body.appendChild(FauxFrameobj);

var DAYS_TO_FETCH = [];
var DAYS_TO_FETCH_CHECK;

var HITStorage = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB ||
                window.mozIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange;

var IDBKeyRange = window.IDBKeyRange;

HITStorage.indexedDB = {};
HITStorage.indexedDB = {};
HITStorage.indexedDB.db = null;

HITStorage.indexedDB.onerror = function(e) {
  console.log(e);
};
var v = 4;

HITStorage.indexedDB.create = function() {

  var request = indexedDB.open("HITDB", v);

  request.onupgradeneeded = function (e) {
    HITStorage.indexedDB.db = e.target.result;
    var db = HITStorage.indexedDB.db;
    var new_empty_db = false;

    if(!db.objectStoreNames.contains("HIT")) {
      var store = db.createObjectStore("HIT", { keyPath: "hitId" });

      store.createIndex("date", "date", { unique: false });
      store.createIndex("requesterName", "requesterName", { unique: false });
      store.createIndex("title", "title", { unique: false });
      store.createIndex("reward", "reward", { unique: false });
      store.createIndex("status", "status", { unique: false });
      store.createIndex("requesterId", "requesterId", { unique: false });

      new_empty_db = true;
      
      // At first update try to get few extra days that do not show on status page
      localStorage['HITDB TRY_EXTRA_DAYS'] = 'YES';
    }
    if(!db.objectStoreNames.contains("STATS")) {
      var store = db.createObjectStore("STATS", { keyPath: "date" });
    }
    if(!db.objectStoreNames.contains("NOTES")) {
      var store = db.createObjectStore("NOTES", { keyPath: "requesterId" });
    }
    if(!db.objectStoreNames.contains("BLOCKS")) {
      var store = db.createObjectStore("BLOCKS", { keyPath: "id", autoIncrement: true });

      store.createIndex("requesterId", "requesterId", { unique: false });
    }

    if (new_empty_db == false)
    {
      alert("HIT DataBase date format must be upgraded (MMDDYYYY => YYYY-MM-DD)\n" +
            "Please don't close or reload this page until it's done.\n" + 
            "Press OK to start. This shouldn't take long. (few minutes max)" +
            "Sorry for the inconvenience.");
      HITStorage.update_date_format(true);
    }
    db.close();
    //alert("DataBase upgraded to version " + v + '!');
  }

  request.onsuccess = function(e) {
    HITStorage.indexedDB.db = e.target.result;
    var db = HITStorage.indexedDB.db;
    db.close();
  };

  request.onerror = HITStorage.indexedDB.onerror;
}

HITStorage.update_date_format = function(verbose)
{
  var request = indexedDB.open("HITDB", v);
  request.onsuccess = function(e) {
    HITStorage.indexedDB.db = e.target.result;
  		 var db = HITStorage.indexedDB.db;
		  var trans = db.transaction(["HIT"], "readwrite");
		  var store = trans.objectStore("HIT");
    
    store.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor)
      {
        if (cursor.value.date.indexOf('-') < 0)
        {
          var i = cursor.value;
          i.date = convert_date(i.date);
          i.requesterName = i.requesterName.trim(); 
          i.title = i.title.trim();
          cursor.update(i);
        }
        cursor.continue();
      }
      else
      {
        db.close();
        HITStorage.update_stats_date_format(verbose);
      }
    };
  }
}

console.log("HitDB creation beginning");
HITStorage.indexedDB.create();
console.log("HitDB Created");
