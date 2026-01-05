// ==UserScript==
// @name        MTurk HIT DataBase Patch v1
// @namespace https://greasyfork.org/users/710
// @description Removes current day's hits from the DB to prepare it for the new update
// @include     https://www.mturk.com/mturk/dashboard
// @version     10
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10220/MTurk%20HIT%20DataBase%20Patch%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/10220/MTurk%20HIT%20DataBase%20Patch%20v1.meta.js
// ==/UserScript==

var HITStorage = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB ||
    window.mozIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange;
HITStorage.IDBTransactionModes = { "READ_ONLY": "readonly", "READ_WRITE": "readwrite", "VERSION_CHANGE": "versionchange" };
var IDBKeyRange = window.IDBKeyRange;

HITStorage.indexedDB = {};
HITStorage.indexedDB = {};
HITStorage.indexedDB.db = null;

HITStorage.indexedDB.onerror = function(e) {
    console.log(e);
};
var v = 4;

var d = new Date(); // today!
nowYear = d.getFullYear();
nowMonth = d.getMonth()+1;
nowDay = d.getDate();
if (nowMonth < 10)
    nowMonth = "0"+nowMonth;
if (nowDay < 10)
    nowDay = "0"+nowDay;
var x = 40; // go back 45 days!
d.setDate(d.getDate() - x);
thenYear = d.getFullYear();
thenMonth = d.getMonth()+1;
thenDay = d.getDate();
if (thenMonth < 10)
    thenMonth = "0"+thenMonth;
if (thenDay < 10)
    thenDay = "0"+thenDay;
var now = nowYear+"-"+nowMonth+"-"+nowDay;
var then = thenYear+"-"+thenMonth+"-"+thenDay;

if (!localStorage["20150602fix"])
{
    if (confirm("This will delete all hits done from your DB from "+then+" through "+now))
    {
        localStorage["20150602fix"] = 1;
        var request = indexedDB.open("HITDB", 4);
        request.onsuccess = function(e) {
            HITStorage.indexedDB.db = e.target.result;
            var db = HITStorage.indexedDB.db;
            var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_WRITE);
            var store = trans.objectStore("HIT");
            range = IDBKeyRange.bound(then, now, false, false);

            store.index('date').openCursor(range).onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor)
                {
                    console.log(cursor.value.date);
                    cursor.delete();
                    cursor.continue();
                }
                else
                {
                    db.close();
                }
            };
        }
        request = indexedDB.open("HITDB", 4);
        request.onsuccess = function(e) {
            HITStorage.indexedDB.db = e.target.result;
            var db = HITStorage.indexedDB.db;
            var trans = db.transaction(["HIT"], HITStorage.IDBTransactionModes.READ_WRITE);
            var store = trans.objectStore("HIT");
            trans = db.transaction(["STATS"], HITStorage.IDBTransactionModes.READ_WRITE);
            store = trans.objectStore("STATS");

            console.log("Second");
            store.openCursor(range).onsuccess = function(event) {
                var cursor = event.target.result;
                if (cursor)
                {
                    console.log(JSON.stringify(cursor.value));
                    cursor.delete();
                    cursor.continue();
                }
                else
                {
                    db.close();
                }
            };
        }
    }
}