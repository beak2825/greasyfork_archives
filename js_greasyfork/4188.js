// ==UserScript==
// @name			MTurk QualSorter
// @namespace	localhost
// @description	Keep track of qualifications and create a more sortable list.
// @version		0.3b
// @include		https://www.mturk.com/mturk/dashboard*
// @include		https://www.mturk.com/mturk/qualtable*
// @require		http://code.jquery.com/jquery-2.1.1.js
// @require		http://code.jquery.com/ui/1.10.3/jquery-ui.js
// @require		http://cdnjs.cloudflare.com/ajax/libs/datatables/1.10.1/js/jquery.dataTables.js
// @resource datatab https://greasyfork.org/scripts/4258-datatables-css-cdn-with-images/code/Datatables%20CSS%20CDN%20with%20Images.js?version=13654
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_addStyle
// @grant			GM_getResourceText
// @author			DeliriumTremens 2014
// @downloadURL https://update.greasyfork.org/scripts/4188/MTurk%20QualSorter.user.js
// @updateURL https://update.greasyfork.org/scripts/4188/MTurk%20QualSorter.meta.js
// ==/UserScript==

//
//
// GET CSS MODULES
//
var jqtableCSS = GM_getResourceText("datatab");
GM_addStyle(jqtableCSS);
//
// END CSS MODULES
//
//
// ******************************************************************
//
//
//	START VARIABLE DEFINITIONS
//
var qualCount = null; // hold onto that sweet, sweet qual count
var qualPrev = GM_getValue("quals"); // store the previous qual count
var qualDiff = 0; // difference in qual count between dashboard refreshes
var nextPage = "https://www.mturk.com/mturk/findquals?requestable=false&earned=true";

$.get("https://www.mturk.com/mturk/findquals?requestable=false&earned=true", function(data) {
    var $quals = $(data).find('td[class="title_orange_text"]').text().trim();
    $quals = $quals.substr(8);
    qualCount = $quals.slice(0, -8);
    qualCount = parseInt(qualCount);
    qualDiff = qualCount - qualPrev;
    addQualElement();
    GM_setValue("quals",qualCount);
});

var qualObject = {}; // Storage for qualification details to be sent to database
var QualStorage = {}; // QualStorage object definition
var Scraping = true; // Used to start and kill scraping
var scrapeNumber = 0; // Unused currently
var currScrape = null; // Container for current page being scraped
//
//	END VARIABLE DEFINITIONS
//
//
// ******************************************************************
//
//
//	START INDEXEDDB METHODS
//
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
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
	request.onupgradeneeded = function (e) {
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
			store.createIndex("retDate", "retDate", {
				unique: false
			});
			store.createIndex("users", "users", {
				unique: false
			});
			store.createIndex("value", "value", {
				unique: false
			});
			newDB = true;
		}
		db.close();
	}
	request.onsuccess = function (e) {
		QualStorage.indexedDB.db = e.target.result;
		var db = QualStorage.indexedDB.db;
		db.close();
	}
	//request.onerror = console.log(request.errorCode);
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
                retDate: qualPut["retDate"],
                users: qualPut["users"],
                value: qualPut["value"]
            });
            request.onsuccess = function (e) {
            }
            request.onerror = function (e) {
            }
        }
        db.close();
    }
    request.onerror = QualStorage.indexedDB.onerror;
}

QualStorage.indexedDB.getQuals = function () {
    var request = indexedDB.open("QualDB", v);

    request.onsuccess = function (e) {
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
                    tmp_results[cursor.key][5] = qual.retDate;
                    tmp_results[cursor.key][6] = qual.users;
                    tmp_results[cursor.key][7] = qual.value;
                }
                cursor.continue();
            } else {
                for (var key in tmp_results) {
                    results.push(tmp_results[key]);
                }
                buildQualTable(results);
            }
        }
        db.close();
    }
}
//
//	END INDEXEDDB METHODS
//
//
// ******************************************************************
//
//
//	START SCRAPER METHODS
//
getNextURL = function (data) {
    var nextURL = $(data).find('a[href^="/mturk/viewquals"]:contains("Next")').attr("href");
    return nextURL;
}

scrapeQuals = function (nextPage) {
    QualStorage.indexedDB.create();
    var nextPage = nextPage;
    var currPage = $.get(nextPage, function(data) {
        var maxpagerate = $(data).find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
        if (maxpagerate.length === 0) {
            $('.updateLink').html(parseInt((scrapeNumber / qualCount) * 100) + "\%");
            
            var qualId = $(data).find('a[id*="requestQualLink"]');
            var title = $(data).find('a[class="capsulelink"]');
            
            scrapeNumber += title.length;
            
            var author = $(data).find('td[class="capsule_field_title"]:contains("Author:")').next();
            var value = $(data).find('td[class="capsule_field_title"]:contains("Qualification Value:")').next();
    		var users = $(data).find('td[class="capsule_field_title"]:contains("Qualified Users:")').next();
    		var description = $(data).find('td[class="capsule_field_title"]:contains("Description:")').next();
    		var dateassigned = $(data).find('td[class="capsule_field_title"]:contains("Date Assigned:")').next();
    		var dateretake = $(data).find('td[class="capsule_field_title"]:contains("Retake date:")').next();
            for (var i = 0; i < title.length; i++) {
               	qualObject["qualId"] = qualId.eq(i).attr("href").split('=')[1];
               	qualObject["qualName"] = title.eq(i).text().trim();
               	qualObject["author"] = author.eq(i).text().trim();
               	qualObject["desc"] = description.eq(i).text().trim();
               	qualObject["assDate"] = dateassigned.eq(i).text().trim();
               	qualObject["retDate"] = dateretake.eq(i).text().trim();
               	qualObject["users"] = users.eq(i).text().trim();
               	qualObject["value"] = value.eq(i).text().trim();
               	QualStorage.indexedDB.addQual(qualObject);
               	qualObject = {};
            }
            nextPage = getNextURL(data);
            if (! nextPage) {
            	$('.updateLink').html("Update ");   
            } else {
            	setTimeout(scrapeQuals(nextPage), 500);
            }
        } else {
            setTimeout(scrapeQuals(nextPage), 2000);
        }
    });        
}

//
//	END SCRAPER METHODS
//
//
// ******************************************************************
//
//
// START EVENT HANDLERS
//
addQualElement = function () {
	var allas, thisa;
	allas = document.getElementsByTagName('a');
	for (var i = 0; i < allas.length; i++)
	{
    	thisa = allas[i];
    	if ( thisa.innerHTML.match(/Transfer Earnings/))
    	{
        	var hed = document.createElement('tr');
        	hed.className = "metrics-table-header-row";
        
        	var qualsHeader = document.createElement('th');
        	qualsHeader.innerHTML = "Qualifications";
        	qualsHeader.className = "metrics-table-first-header";
        	hed.appendChild(qualsHeader);
        
        	var qualsValue = document.createElement('th');
        	qualsValue.innerHTML = "Value";
        	hed.appendChild(qualsValue);
        
        	var row = document.createElement('tr');
        	row.className = "odd";
            
            var qualsAssignedText = document.createElement('p');
            qualsAssignedText.setAttribute("name", "qualTitle");
        	qualsAssignedText.innerHTML = "Qualifications Assigned &nbsp;";
 
        	var cellLeft = document.createElement('td');
        	cellLeft.className = "metrics-table-first-value";
        	cellLeft.appendChild(qualsAssignedText);
        	row.appendChild(cellLeft);
                   
        	var cellRight = document.createElement('td');
            cellRight.innerHTML = qualCount + (qualDiff === 0 ? '' : (' (' + (qualDiff > 0 ? ('+' + qualDiff) : (qualDiff)) + ')'));
        	row.appendChild(cellRight);
                    
        	thisa.parentNode.parentNode.parentNode.insertBefore(hed,thisa.parentNode.parentNode.nextSibling);
        	hed.parentNode.insertBefore(row,hed.nextSibling);
        	//thisa.parentNode.parentNode.parentNode.insertBefore(row,thisa.parentNode.parentNode.nextSibling);
            
            $('p[name="qualTitle"]').append('<a href="#" class="updateLink" >Update </a>');
            $('p[name="qualTitle"]').append('<button title="View Qual Table" name="qualTableBut" class="qualTableBut" style="position:absolute;border-style:none;width:7px;height:10px;padding:0;margin-left:10px;margin-top:2px;background-image:url(https://i.imgur.com/iu7zXPz.png);background-color:transparent;cursor:pointer;"></button>').button();
    	}
	}
}

buildQualTable = function (qualStore) {
    $('#qualTable').append('<thead><tr><th>Qual ID</th><th>Qual Name</th><th>Author</th><th>Description</th><th width="75px">Assgn</th><th>Retake</th><th>Users</th><th>Value</th></tr></thead>');	
    $('#qualTable').append('<tbody></tbody>');
    for (var j = 0; j < qualStore.length; j++) {
        var qualRow = String(".qualRow" + j);
        
    	var tr = document.createElement("tr");
        tr.setAttribute('class', ('qualRow' + j));
        
		$(tr).append("<td>" + qualStore[j][0] + "</td>");        
        $(tr).append("<td>" + qualStore[j][1] + "</td>");
        $(tr).append("<td>" + qualStore[j][2] + "</td>");
        $(tr).append("<td style='width:350px'>" + qualStore[j][3] + "</td>");
        $(tr).append("<td>" + qualStore[j][4] + "</td>");
        $(tr).append("<td>" + qualStore[j][5] + "</td>");
        $(tr).append("<td>" + qualStore[j][6] + "</td>");
        $(tr).append("<td>" + qualStore[j][7] + "</td>");    
        
        $('#qualTable tbody').append(tr);
    }
    $('#qualTable').dataTable({
        paging: false
    });
}

$(document).on('click', '.updateLink', function () {
    scrapeQuals(nextPage);
});

$(document).ready( function () {
    if (document.URL === "https://www.mturk.com/mturk/qualtable") {
        $('body').html('');
        var qualTable = document.createElement("table");
        qualTable.setAttribute('class', 'display');
        qualTable.setAttribute('id', 'qualTable');
        $('body').append(qualTable);
        
        var qualElements = QualStorage.indexedDB.getQuals();
    }
});

$(document).on('click', '.qualTableBut', function () {
    window.open("https://www.mturk.com/mturk/qualtable", '_blank');
});
//
//	END EVENT HANDLERS
//
//