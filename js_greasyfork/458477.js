// ==UserScript==
// @name         Mturk Qualification Database and Scraper
// @namespace    https://greasyfork.org/en/users/1004048-elias041
// @version      0.84
// @description  Scrape, display, sort and search your Mturk qualifications
// @author       Elias041
// @match        https://worker.mturk.com/qualifications/assigned*
// @match        https://worker.mturk.com/qt
// @require      https://code.jquery.com/jquery-3.6.3.js
// @require      https://code.jquery.com/ui/1.13.1/jquery-ui.min.js
// @require      https://unpkg.com/ag-grid-community@29.0.0/dist/ag-grid-community.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mturk.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458477/Mturk%20Qualification%20Database%20and%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/458477/Mturk%20Qualification%20Database%20and%20Scraper.meta.js
// ==/UserScript==

const buttonStyle = {
	color: "#fff",
	padding: "10px",
	boxShadow: "2px 2px 4px #888888",
	opacity: "0.5",
	cursor: "pointer"
};

const BUTTON_IDS = {
	scrapeButton: "button",
	cancelButton: "cancelButton",
	progress: "progress",
	dbButton: "dbButton"
};

let timeout = 1850;
let counter = " ";
let retry_count = 0;
let error_count = 0;
let scraping = false;


function createButton(parent, id, text, color, clickHandler) {
	const btn = document.createElement("div");
	Object.assign(btn.style, buttonStyle);
	btn.style.background = color;
	btn.id = id;
	btn.innerHTML = text;
	parent.insertBefore(btn, parent.firstChild);
	btn.addEventListener("click", clickHandler);
}

const parentDiv = document.getElementsByClassName("col-xs-5 col-md-3 text-xs-right p-l-0")[0]?.parentNode;
if (parentDiv) {
	createButton(parentDiv, BUTTON_IDS.scrapeButton, "Scrape&nbspQuals", "#33773A", function() {
		localStorage.setItem('incompleteScrape', true);
		scraping = true;
		getAssignedQualifications();
		$("#button").css('background', '#383c44');
		$("#cancelButton").css('background', '#CE3132');
	});

	createButton(parentDiv, BUTTON_IDS.cancelButton, "Cancel", "#383c44", function() {
		retry_count = 0;
		scraping = false;
		$("#cancelButton").css('background', '#383c44');
		$("#button").css('background', '#33773A');
		$("#progress").html("-");
	});
	createButton(parentDiv, BUTTON_IDS.dbButton, "Database", "#323552", function() {
		window.open("https://worker.mturk.com/qt", "_blank");
	});

	createButton(parentDiv, BUTTON_IDS.progress, "-", "#323552", function() {

	});

	function initializeDatabase() {
		const dbName = "qualifications_v2";
		const storeName = "quals";
		const version = 2;
		const openRequest = indexedDB.open(dbName, version);

		openRequest.onupgradeneeded = function(event) {
			const db = event.target.result;

			if (!db.objectStoreNames.contains(storeName)) {
				const objectStore = db.createObjectStore(storeName, {
					keyPath: "id"
				});

				objectStore.createIndex("id", "id", {
					unique: true
				});
				objectStore.createIndex("requester", "requester", {
					unique: false
				});
				objectStore.createIndex("description", "description", {
					unique: false
				});
				objectStore.createIndex("score", "score", {
					unique: false
				});
				objectStore.createIndex("date", "date", {
					unique: false
				});
				objectStore.createIndex("qualName", "qualName", {
					unique: false
				});
				objectStore.createIndex("reqURL", "reqURL", {
					unique: false
				});
				objectStore.createIndex("reqQURL", "reqQURL", {
					unique: false
				});
				objectStore.createIndex("retURL", "retURL", {
					unique: false
				});
				objectStore.createIndex("canRetake", "canRetake", {
					unique: false
				});
				objectStore.createIndex("hasTest", "hasTest", {
					unique: false
				});
				objectStore.createIndex("canRequest", "canRequest", {
					unique: false
				});
				objectStore.createIndex("isSystem", "isSystem", {
					unique: false
				});
			}
		};
	}


	initializeDatabase()
}

function openDatabase() {
	return new Promise((resolve, reject) => {
		const dbName = "qualifications_v2";
		const openRequest = indexedDB.open(dbName);

		openRequest.onsuccess = (event) => {
			resolve(event.target.result);
		};

		openRequest.onerror = (event) => {
			reject(event.target.errorCode);
		};
	});
}



function readDatabase() {
	return openDatabase().then((db) => {
		return new Promise((resolve, reject) => {
			const storeName = "quals";
			const transaction = db.transaction(storeName, "readonly");
			const objectStore = transaction.objectStore(storeName);
			const request = objectStore.getAll();

			request.onsuccess = (event) => {
				resolve(event.target.result);
			};

			request.onerror = (event) => {
				reject(event.target.errorCode);
			};
		});
	});
}

async function compareDatabases(oldDBPromise) {

	const newDB = await readDatabase()
	return oldDBPromise.then(oldDB => {
		let changes = [];

		for (let i = 0; i < newDB.length; i++) {
			let newRecord = newDB[i];
			let oldRecord = oldDB.find(r => r.id === newRecord.id);


			if (oldRecord && oldRecord.score !== newRecord.score) {
				changes.push({
					id: newRecord.id,
					field: "score",
					requester: newRecord.requester,
					qualName: newRecord.qualName,
					oldValue: oldRecord.score,
					newValue: newRecord.score
				});
			}
		}

		if (changes.length > 0) {
			localStorage.setItem("changes", JSON.stringify(changes));
			localStorage.setItem("hasChanges", true);
			return changes;
		}
	})
}


function checkFirstRun() {
	openDatabase()
		.then((db) => {
			const storeName = "quals";
			const transaction = db.transaction(storeName, "readonly");
			const objectStore = transaction.objectStore(storeName);
			const request = objectStore.count();

			request.onsuccess = (event) => {
				const count = event.target.result;

				if (count === 0) {
					localStorage.setItem("firstRun", true);
				} else {
					localStorage.setItem("firstRun", false);
				}
			};

			request.onerror = (event) => {
				console.error("Error counting records:", event.target.errorCode);
			};
		})
		.catch((error) => {
			console.error("Error opening database:", error);
		});
}

function addEntries(assigned_qualifications) {
	const dbName = "qualifications_v2";
	const storeName = "quals";
	const openRequest = indexedDB.open(dbName);

	openRequest.onsuccess = function(event) {
		const db = event.target.result;
		const transaction = db.transaction(storeName, "readwrite");
		const objectStore = transaction.objectStore(storeName);

		assigned_qualifications.forEach(function(t) {
			const entry = {
				id: t.request_qualification_url,
				requester: t.creator_name,
				description: t.description,
				canRetake: t.can_retake_test_or_rerequest,
				retry: t.earliest_retriable_time,
				score: t.value,
				date: t.grant_time,
				qualName: t.name,
				reqURL: t.creator_url,
				retURL: t.retake_test_url,
				isSystem: t.is_system_qualification,
				canRequest: t.is_requestable,
				hasTest: t.has_test,
			};

			objectStore.put(entry);
		});

		transaction.oncomplete = function() {
			console.log("All entries added successfully");
		};

		transaction.onerror = function(event) {
			console.error("Error adding entries:", event.target.errorCode);
		};
	};

	openRequest.onerror = function(event) {
		console.error("Error opening database:", event.target.errorCode);
	};
}
checkFirstRun();



let page = "https://worker.mturk.com/qualifications/assigned.json?page_size=100";
let timeoutId;
let oldDBPromise;
let totalRetries = 0;

function getAssignedQualifications(nextPageToken = "") {
	if (oldDBPromise === undefined) {
		oldDBPromise = readDatabase();

	}
	if (!scraping) {
		return;
	}
	$("#progress").html(counter);
	$.getJSON(page)

		.then(function(data) {
			counter++
			retry_count = 0

			addEntries(data.assigned_qualifications);


			if (data.next_page_token !== null) {
				timeoutId = setTimeout(() => {
					page = `https://worker.mturk.com/qualifications/assigned.json?page_size=100&next_token=${encodeURIComponent(data.next_page_token)}`
					getAssignedQualifications(data.next_page_token);
				}, timeout);

			} else if (data.next_page_token === null) {
				console.log("Scraping completed");
				console.log(counter + " pages");
				console.log(totalRetries + " timeouts");
				console.log("Clock was " + timeout);
				if (localStorage.getItem("firstRun") === "false") {

					compareDatabases(oldDBPromise)
				}
				localStorage.setItem('incompleteScrape', false);
				$("#cancelButton").css('background', '#383c44');
				$("#progress").css('background', '#25dc12');
				$("#progress").html('&#10003;');
				$("#dbButton").css('background', '#57ab4f');

			} else {
				console.log("Timeout or abort. Clock was " + timeout);
				$("#progress").css('background', '#FF0000');
				$("#progress").html('&#88;');
				return;
			}
		})

		.catch(function(error) {
			if (error.status === 429 && retry_count < 20) {

				retry_count++
				totalRetries++
				setTimeout(() => {
					getAssignedQualifications(nextPageToken);
				}, 3000);
			} else if (error.status === 429 && retry_count > 20) {
				console.log("error " + error_count)
				error_count++;
				timeout += 1000
				setTimeout(() => {
					getAssignedQualifications(nextPageToken);
				}, 10000);

			} else if (error.status === 429 && retry_count > 20 && error_count > 3) {
				alert("There was a problem accessing the Mturk website. Scraping halted.")
				scraping = false
				return;

			} else if (error.status === 503) {
				$("#progress").css('background', '#FFFF00');
				$("#progress").html('&#33;');
				if (confirm("Mturk responded with 503: Service Unavailable. Retry?")) {
					$("#progress").css('background', '#33773A');
					setTimeout(() => {
						getAssignedQualifications(nextPageToken);
					}, 10000);
				} else {
					$("#progress").css('background', '#FF0000');
					$("#progress").html('&#88;');
					console.log("User declined retry.");
					return;
				}
			}
		})
}



if (location.href === "https://worker.mturk.com/qt") {
	document.body.innerHTML = "";
	let gridDiv = document.createElement("div");
	gridDiv.setAttribute("id", "gridDiv");
	document.body.appendChild(gridDiv);
	document.title = "Qualifications";
	window.closeModal = function() {
		document.getElementById("changesModal").style.display = "none";
		localStorage.setItem("hasChanges", false);

	}
	window.closeIModal = function() {
		document.getElementById("incompleteModal").style.display = "none";
	}


	function getDataFromDatabase() {
		return new Promise((resolve, reject) => {
			const dbName = "qualifications_v2";
			const storeName = "quals";
			const openRequest = indexedDB.open(dbName);

			openRequest.onsuccess = function(event) {
				const db = event.target.result;
				const transaction = db.transaction(storeName, "readonly");
				const objectStore = transaction.objectStore(storeName);
				const request = objectStore.getAll();

				request.onsuccess = function() {
					resolve(request.result);
				};

				request.onerror = function() {
					reject(new Error("Error retrieving data from the database"));
				};
			};

			openRequest.onerror = function(event) {
				reject(new Error("Error opening the database"));
			};
		});
	}

	function displayChangeDetails() {
		if (localStorage.getItem("firstRun") === "true") {
			document.getElementById("changesModal").style.display = "none";
			localStorage.setItem("hasChanges", false);
			return;
		}
		if (localStorage.getItem("hasChanges") === "true") {
			let storedData = localStorage.getItem("changes");
			if (storedData) {
				let changeDetails = JSON.parse(storedData);
				let changesList = document.getElementById("changesList");
				changeDetails.forEach(function(detail) {
					let changeText = detail.requester + " - " + detail.qualName + " - " + detail.field + ": " + detail.oldValue + " -> " + detail.newValue;
					let changeItem = document.createElement("div");
					changeItem.textContent = changeText;
					changesList.appendChild(changeItem);
				});
				document.getElementById("changesModal").style.display = "block";
			}
		}
	}

	function incompleteScrapeNotification() {
		if (localStorage.getItem("incompleteScrape") === "true") {
			document.getElementById("incompleteModal").style.display = "block";
		}
	}

	gridDiv.innerHTML = `
<div id="myGrid"  class="ag-theme-alpine">
<style>
.ag-theme-alpine {
    --ag-grid-size: 3px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

  .modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: auto;
    margin-top: 10%;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 600px;
}

.modal-footer {
    padding: 10px;
    text-align: right;
}

.modal-close {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 8px 16px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
}


@media screen and (min-height: 600px) {
    .modal-content {
        margin-top: 15%;
    }}}
</style>
<div id="changesModal" class="modal">
    <div class="modal-content">
        <h4>Changes Detected</h4>
        <p id="changesList"></p>
    </div>
    <div class="modal-footer">
        <button class="modal-close" ">Close</button>
    </div>
</div>
     </div>


<div id="incompleteModal" class="modal">
    <div class="modal-content">
        <h4>Incomplete Scrape Detected</h4>
        <p>A scrape is in progress or the last scrape was incomplete.</p>
    </div>
    <div class="modal-footer">
        <button class="modal-close" ">Close</button>
    </div>
</div>
     </div>
     `


	const gridOptions = {
		columnDefs: [{
				headerName: 'Mturk Qualification Database and Scraper',
				children: [{
						field: "qualName",
						comparator: function(valueA, valueB, nodeA, nodeB, isInverted) {
							return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
						}
					},
					{
						headerName: "Requester",
						field: "requester",
						comparator: function(valueA, valueB, nodeA, nodeB, isInverted) {
							return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
						}
					}
				]
			},


			{
				headerName: ' ',
				children: [{
						field: "description",
						width: 350,
						cellRenderer: function(params) {
							return '<span title="' + params.value + '">' + params.value + '</span>';
						},
						comparator: function(valueA, valueB, nodeA, nodeB, isInverted) {
							return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
						}
					},
					{
						headerName: "Value",
						field: "score",
						width: 100
					},
					{
						headerName: "Date",
						field: "date",
						width: 100,
						valueGetter: function(params) {
							var date = new Date(params.data.date);
							return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
						},
						comparator: function(valueA, valueB, nodeA, nodeB, isInverted) {
							var dateA = new Date(valueA);
							var dateB = new Date(valueB);
							return dateA - dateB;
						},
					},
					{

						headerName: "Requester ID",
						width: 150,
						field: "reqURL",
						valueFormatter: function(params) {
							var parts = params.value.split("/");
							return parts[2];

						},

					},
					{
						headerName: "Qual ID",
						field: "id",

						valueFormatter: function(params) {
							if (!params.value || params.value === '') return '';
							var parts = params.value.split("/");
							return parts[2];
						}
					}
				]
			},
			{
				headerName: 'More',
				children: [{
						headerName: " ",
						field: " ",
						width: 100,
						columnGroupShow: 'closed'
					},
					{
						headerName: "Retake",
						field: "canRetake",
						width: 100,
						columnGroupShow: 'open',
						suppressMenu: true
					},
					{
						headerName: "hasTest",
						field: "hasTest",
						width: 100,
						columnGroupShow: 'open',
						suppressMenu: true
					},
					{
						headerName: "canReq",
						field: "canRequest",
						width: 100,
						columnGroupShow: 'open',
						suppressMenu: true
					},
					{
						headerName: "System",
						field: "isSystem",
						width: 100,
						columnGroupShow: 'open',
						suppressMenu: true
					},
				]
			}
		],
		defaultColDef: {
			sortable: true,
			filter: true,
			editable: true,
			resizable: true,
		},
		rowSelection: 'multiple',
		animateRows: true,
		rowData: []
	};
	const closeModalButtons = gridDiv.querySelectorAll(".modal-close");
	closeModalButtons.forEach((button) => {
		button.addEventListener("click", function() {
			const modal = button.closest(".modal");
			modal.style.display = "none";
			if (modal.id === "changesModal") {
				localStorage.setItem("hasChanges", false);
			}
		});
	});

	function addCSS(url, callback) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = url;
		link.onload = callback;
		document.head.appendChild(link);
	}

	addCSS('https://cdn.jsdelivr.net/npm/ag-grid-community/styles/ag-grid.css', function() {
		addCSS('https://cdn.jsdelivr.net/npm/ag-grid-community@29.2.0/styles/ag-theme-alpine.css', function() {
			initializeAgGrid();
		});
	});
	async function initializeAgGrid() {
		window.addEventListener("load", function() {
			displayChangeDetails();
			incompleteScrapeNotification();
			const gridDiv = document.querySelector("#myGrid");
			getDataFromDatabase()
				.then((data) => {
					var filteredData = data.filter(function(row) {
						return !row.qualName.includes("Exc: [");
					});
					gridOptions.rowData = filteredData;
					new agGrid.Grid(gridDiv, gridOptions);
				})
				.catch((error) => {
					console.error("Error loading data for ag-grid:", error);
				});
		});
	};
}