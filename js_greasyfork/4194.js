// ==UserScript==
// @name        Clear BLOCK table in HITDB
// @namespace   localhost
// @description Completely empty the BLOCK table in HITDB
// @include     https://www.mturk.com/mturk/dashboard
// @require		http://code.jquery.com/jquery-2.1.1.js
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4194/Clear%20BLOCK%20table%20in%20HITDB.user.js
// @updateURL https://update.greasyfork.org/scripts/4194/Clear%20BLOCK%20table%20in%20HITDB.meta.js
// ==/UserScript==
var HITStorage = {};
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
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

HITStorage.indexedDB.deleteBLOCKS = function () {
  var request = indexedDB.open("HITDB", v);
  console.log("request starting");
  request.onsuccess = function(e) {
    
    HITStorage.indexedDB.db = e.target.result;
    var db = HITStorage.indexedDB.db;
	  var trans = db.transaction(["BLOCKS"], "readwrite");
    var clearRequest = trans.objectStore("BLOCKS").clear();    
    clearRequest.onsuccess = function (e) {
      alert("BLOCKS deleted!");
    }
  }
}

$('body').append("<button id='deleteBlocks' >Delete Blocks</button>");

$(document).on('click', '#deleteBlocks', function () {
  console.log("Deleting blocks");
  HITStorage.indexedDB.deleteBLOCKS();
});