// ==UserScript==
// @name              Worker-MTurk Qual Sorter (with fix)
// @author            Eisenpower
// @namespace         Uchiha Clan
// @version           0.531
// @icon              https://i.imgur.com/M0jWVYS.png
// @description       Keep Track Of Qualifications And Create A More Sortable List.
// @include           https://worker.mturk.com/dashboard*
// @include           https://worker.mturk.com/qualtable*
// @require           https://code.jquery.com/jquery-3.3.1.min.js
// @require           https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.1/js/jquery.dataTables.js
// @resource       fa https://ddvx2zdcut4vw.cloudfront.net/assets/application-c6bbd5228d4b2574a79e8828bf98dfe4b2f37ab3cc3052173436ac49f2b434f0.css
// @resource  datatab https://greasyfork.org/scripts/4258-datatables-css-cdn-with-images/code/Datatables%20CSS%20CDN%20with%20Images.js?version=13654
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_addStyle
// @grant             GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/457278/Worker-MTurk%20Qual%20Sorter%20%28with%20fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457278/Worker-MTurk%20Qual%20Sorter%20%28with%20fix%29.meta.js
// ==/UserScript==
 
// Original Code By 'DeliriumTremens 2014' - Patched And Revamped
 
//
// GET CSS MODULES
//
 
GM_addStyle(GM_getResourceText("datatab"));
GM_addStyle(GM_getResourceText("fa"));
 
//
// END CSS MODULES
//
// ******************************************************************
//
//	START VARIABLE DEFINITIONS
//
 
var qualCount = null; // hold onto that sweet, sweet qual count
var qualPrev = GM_getValue("quals"); // store the previous qual count
var qualDiff = 0; // difference in qual count between dashboard refreshes
var nextPage = "https://worker.mturk.com/qualifications/assigned.json?page_size=100"; // Starting Page of Scrape
var qualObject = {}; // Storage for qualification details to be sent to database
var QualStorage = {}; // QualStorage object definition
var Scraping = true; // Used to start and kill scraping
var scrapeNumber = 0; // Unused currently
var currScrape = null; // Container for current page being scraped
var skipQuals = ['Exc: ', 'Qualification_', 'SurveyGroup ', 'TP Panel:', 'Inc: ', 'campaign_'];
 
//
//	END VARIABLE DEFINITIONS
//
// ******************************************************************
//
//	START INDEXEDDB METHODS
//
 
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.mozIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.mozIDBKeyRange;
var idbKeyRange = window.IDBKeyRange;
QualStorage.indexedDB = {};
QualStorage.indexedDB.db = null;
var v = 1; // Database version.
var dbExists = true; // Boolean if database exists.
 
// Method for creating the new database.
QualStorage.indexedDB.create = function () {
    var request = indexedDB.open("QualDB", v);
    request.onupgradeneeded = function (e) { QualStorage.indexedDB.upgrade(e) };
    request.onsuccess = function (e) {
        QualStorage.indexedDB.db = e.target.result;
        var db = QualStorage.indexedDB.db;
        db.close();
    };
    //request.onerror = console.log(request.errorCode);
};
 
QualStorage.indexedDB.upgrade = function (e) {
    QualStorage.indexedDB.db = e.target.result;
    var db = QualStorage.indexedDB.db;
    var newDB = false;
    if(!db.objectStoreNames.contains("Quals")) {
        var store = db.createObjectStore("Quals", {
            keyPath: "qualId"
        });
        store.createIndex("qualName", "qualName", {
            unique: false
        });
        store.createIndex("author", "author", {
            unique: false
        });
        store.createIndex("desc", "desc", {
            unique: false
        });
        store.createIndex("assDate", "assDate", {
            unique: false
        });
        store.createIndex("retake", "retake", {
            unique: false
        });
        store.createIndex("hasTest", "hasTest", {
            unique: false
        });
        store.createIndex("value", "value", {
            unique: false
        });
        newDB = true;
    }
    db.close();
}
 
QualStorage.indexedDB.addQual = function (qual) {
    var request = indexedDB.open("QualDB", v);
    var qualPut = qual;
    request.onsuccess = function (e) {
        QualStorage.indexedDB.db = e.target.result;
 
        var db = QualStorage.indexedDB.db;
        var newDB = false;
 
        if (!db.objectStoreNames.contains("Quals")) {
            db.close();
        } else {
            var trans = db.transaction(["Quals"], 'readwrite');
            var store = trans.objectStore("Quals");
            var request;
 
            request = store.put({
                qualId: qualPut["qualId"],
                qualName: qualPut["qualName"],
                author: qualPut["author"],
                desc: qualPut["desc"],
                assDate: qualPut["assDate"],
                retake: qualPut["retake"],
                hasTest: qualPut["hasTest"],
                value: qualPut["value"]
            });
            request.onsuccess = function (e) {
            };
            request.onerror = function (e) {
            };
        }
        db.close();
    };
    request.onerror = QualStorage.indexedDB.onerror;
};
 
QualStorage.indexedDB.getQuals = function (e) {
    var request = indexedDB.open("QualDB", v);
 
    request.onupgradeneeded = function (e) {
        QualStorage.indexedDB.upgrade(e);
        QualStorage.indexedDB.getQuals();
    };
 
    request.onsuccess = function (e) {
        if (e.target.result.objectStoreNames.length === 0) {
            e.target.result.close();
            var DBDeleteRequest = indexedDB.deleteDatabase('QualDB')
            DBDeleteRequest.onsuccess = function (e) {
                return QualStorage.indexedDB.getQuals();
            }
        }
 
        QualStorage.indexedDB.db = e.target.result;
 
        var db = QualStorage.indexedDB.db;
        var transaction = db.transaction('Quals', 'readonly');
        var store = transaction.objectStore('Quals');
 
        var results = [];
        var tmp_results = {};
 
        store.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                var qual = cursor.value;
                if (tmp_results[cursor.key] === undefined) {
                    tmp_results[cursor.key] = [];
                    tmp_results[cursor.key][0] = qual.qualId;
                    tmp_results[cursor.key][1] = qual.qualName;
                    tmp_results[cursor.key][2] = qual.author;
                    tmp_results[cursor.key][3] = qual.desc;
                    tmp_results[cursor.key][4] = qual.assDate;
                    tmp_results[cursor.key][5] = qual.retake;
                    tmp_results[cursor.key][6] = qual.hasTest;
                    tmp_results[cursor.key][7] = qual.value;
                }
                cursor.continue();
            } else {
                for (var key in tmp_results) {
                    results.push(tmp_results[key]);
                }
                buildQualTable(results);
            }
        };
        db.close();
    };
};
 
//
//	END INDEXEDDB METHODS
//
// ******************************************************************
//
//	START SCRAPER METHODS
//
 
const scrapeQuals = function (page) {
    QualStorage.indexedDB.create();
    $.get(page, function(data) {
        const quals = data.assigned_qualifications;
 
        for (var i = 0; i < quals.length; i++) {
            qualObject = {
                "qualId": quals[i].retake_test_url.match(/[A-Z0-9]{15,}/)[0],
                "qualName": quals[i].name,
                "author": quals[i].creator_name,
                "desc": quals[i].description,
                "assDate": quals[i].grant_time,
                "retake": quals[i].can_retake_test_or_rerequest ? "Yes" : "No",
                "hasTest": quals[i].has_test ? quals[i].retake_test_url : "No",
                "value": quals[i].value
            };
            QualStorage.indexedDB.addQual(qualObject);
        }
 
        if (data.next_page_token) {
            const next = `https://worker.mturk.com/qualifications/assigned.json?page_size=100&next_token=${encodeURIComponent(data.next_page_token)}`
            setTimeout(() => scrapeQuals(next), 3000);
        }
 
        else {
            if (window.location.href === 'https://worker.mturk.com/qualtable') window.location.reload();
            $('.updatePercentage').css('visibility', 'visible');
            $('.updatePercentage').css('color', 'darkseagreen');
            $('.updateLink > .fa-refresh')[0].classList.remove("rotate");
        }
    });
};
 
//
//	END SCRAPER METHODS
//
// ******************************************************************
//
// START EVENT HANDLERS
//
 
const addQualElement = function () {
    $('.expand-collapse-projects-holder').prepend('<div class="qualSorterContainer" style="line-height: 1; white-space: nowrap; margin-right: 20px;"></div>');
    $('.qualSorterContainer').prepend('<span>Qual Sorter:</span>');
    $('.qualSorterContainer').append('<div class="qualSorterButtonContainer" style="font-size: large"></div>');
    $('.qualSorterButtonContainer').append('<a href="#" title="View Quals" class="qualTableBut" style="margin-left: 12px"><i class="fa fa-columns"></i></a>')
    $('.qualSorterButtonContainer').append('<a href="#" title="Update Quals" class="updateLink" style="margin-left: 8px"><i class="fa fa-refresh"></i></a>');
    $('.qualSorterButtonContainer').append('<span class="updatePercentage" style="font-size: small; visibility: hidden;"><i class="fa fa-check-circle-o"></i></span>')
};
 
const buildQualTable = function (qualStore) {
    $('#qualTable').append('<thead><tr><th>Qual ID</th><th>Qual Name</th><th>Author</th><th>Description</th><th width="75px" style="text-align: center">Assgn</th><th style="text-align: center">Retake Available</th><th style="text-align: center">Has Test</th><th style="text-align: center">Value</th></tr></thead>');
    $('#qualTable').append('<tbody></tbody>');
    for (var j = 0; j < qualStore.length; j++) {
        if (!skipQuals.some(function(v) { return qualStore[j][1].indexOf(v) >= 0; })) {
            var qualRow = String(".qualRow" + j);
 
            var tr = document.createElement("tr");
            tr.setAttribute('class', ('qualRow' + j));
 
            $(tr).append(`<td>${qualStore[j][0]}</td>`);
            $(tr).append(`<td>${qualStore[j][1]}</td>`);
            $(tr).append(`<td>${qualStore[j][2]}</td>`);
            $(tr).append(`<td style='width:350px'>${qualStore[j][3]}</td>`);
            $(tr).append(`<td>${qualStore[j][4]}</td>`);
            $(tr).append(`<td style='text-align: center'>${qualStore[j][5]}</td>`);
            $(tr).append(`<td style='text-align: center'>${qualStore[j][6] == "No" ? "No" : `<a href=${qualStore[j][6]}>TEST</a>`} </td>`);
            $(tr).append(`<td style='text-align: center'>${qualStore[j][7]}</td>`);
 
            $('#qualTable tbody').append(tr);
        }
    }
    $('#qualTable').dataTable({
        paging: false
    });
    $('#qualTable_wrapper').prepend(`<a href="#" title="Update Quals" class="updateLink" style="margin-left: 8px; font-size: x-large; color: #146EB4; vertical-align: -webkit-baseline-middle;"><i class="fa fa-refresh"></i></a>`);
    $('#qualTable_wrapper').prepend(`<div style="float: left; padding: 5px;"><b>Total Quals: </b>${qualStore.length.toLocaleString()}</div>`);
};
 
$(document).on('click', '.updateLink', function (e) {
    e.preventDefault();
    $('.updateLink > .fa-refresh')[0].classList.add("rotate");
    $('.updatePercentage').css('visibility', 'hidden');
    $('.updatePercentage').css('color', '');
    scrapeQuals(nextPage);
});
 
$(document).ready( function () {
    if (document.URL.includes("https://worker.mturk.com/qualtable")) {
        $('body').html('');
        var qualTable = document.createElement("table");
        qualTable.setAttribute('class', 'display');
        qualTable.setAttribute('id', 'qualTable');
        $('body').append(qualTable);
 
        var qualElements = QualStorage.indexedDB.getQuals();
    }
});
 
$(document).on('click', '.qualTableBut', function () {
    window.open("https://worker.mturk.com/qualtable", '_blank');
});
 
//
//	END EVENT HANDLERS
//
// ******************************************************************
//
//  START STYLING
//
 
const styles = function() {
  var styleEm = document.createElement('style');
  document.head.appendChild(styleEm);
  var styleSheet = styleEm.sheet;
 
  var rule1 = `@-webkit-keyframes rotate {
                    from{
                        -webkit-transform: rotate(0deg);
                    }
                    to{
                        -webkit-transform: rotate(360deg);
                    }
                }`
 
  var rule2 = `.rotate {
                    -webkit-animation: rotate 1s linear infinite;
                }`
 
    styleSheet.insertRule(rule1, styleSheet.cssRules.length);
    styleSheet.insertRule(rule2, styleSheet.cssRules.length);
}
 
//
//  END STYLING
//
 
addQualElement();
styles();