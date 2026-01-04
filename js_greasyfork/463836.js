// ==UserScript==
// @name            IMDB Ratings Importer
// @namespace       Neinei0k_imdb
// @include         https://www.imdb.com/user/ur*/ratings*
// @grant           none
// @version         2.01
// @license         GNU General Public License v3.0 or later
// @description	    Import ratings for movies, TV series and episodes from a csv file.
// @downloadURL https://update.greasyfork.org/scripts/463836/IMDB%20Ratings%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/463836/IMDB%20Ratings%20Importer.meta.js
// ==/UserScript==

let request_data_add_rating = {
    "query": "mutation UpdateTitleRating($rating: Int!, $titleId: ID!) {\n  rateTitle(input: {rating: $rating, titleId: $titleId}) {\n    rating {\n      value\n    }\n  }\n}",
    "operationName": "UpdateTitleRating",
    "variables": {
        "rating": 0,
        "titleId": ""
    }
}

let elements = createHTMLForm();
 
function log(level, message) {
	console.log("(IMDB Ratings Importer) " + level + ": " + message);
}
 
function setStatus(message) {
	elements.status.textContent = message;
}
 
function createHTMLForm() {
	let elements = {};
 
  try {
    let root = createRoot();
    elements.text = createTextField(root);
 
    if (isFileAPISupported()) {
      elements.file = createFileInput(root);
      elements.isFromFile = createFromFileCheckbox(root);
    } else {
      createFileAPINotSupportedMessage(root);
    }
    elements.status = createStatusBar(root);
    
    createImportButton(root);
  } catch (message) {
   	log("Error", message);
  }
 
	return elements;
}
 
function isFileAPISupported() {
	return window.File && window.FileReader && window.FileList && window.Blob;
}
 
function createRoot() {
	let container = document.querySelector('.ipc-page-section--base');
	if (container === null) {
		throw ".ipc-page-section--base element not found";
	}
  let nextChild = container.children[0];
	let root = document.createElement('div');
	root.setAttribute('class', 'aux-content-widget-2 ipc-list-card--base ipc-list-card--border-line');
	root.style.height = 'initial';
  root.style.marginTop = '30px';
  root.style.marginBottom = '30px';
  root.style.padding = '10px';
	container.insertBefore(root, nextChild);
 
	return root;
}
 
function createTextField(root) {
	let text = document.createElement('textarea');
	text.style = "background-color: white; width: 100%; height: 100px; overflow: initial;";
	root.appendChild(text);
	root.appendChild(document.createElement('br'));
 
	return text;
}
 
function createFileInput(root) {
	let file = document.createElement('input');
	file.type = 'file';
	file.disabled = true;
  file.style.marginBottom = '10px';
	root.appendChild(file);
	root.appendChild(document.createElement('br'));
 
	return file;
}
 
function createFromFileCheckbox(root) {
	let isFromFile = createCheckbox("Import from file (otherwise import from text)");
	root.appendChild(isFromFile.label);
	root.appendChild(document.createElement('br'));
 
	isFromFile.checkbox.addEventListener('change', fromFileOrTextChangeHandler, false);
	
	return isFromFile.checkbox;
}
 
function createCheckbox(textContent) {
	let checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.style = 'width: initial;';
 
	let text = document.createElement('span');
	text.style = 'font-weight: normal;';
	text.textContent = textContent;
 
	let label = document.createElement('label');
	label.appendChild(checkbox);
	label.appendChild(text);
 
	return {label: label, checkbox: checkbox};
}
 
function fromFileOrTextChangeHandler(event) {
	let isChecked = event.target.checked;
	elements.text.disabled = isChecked;
	elements.file.disabled = !isChecked;
}
 
function createFileAPINotSupportedMessage(root) {
	let notSupported = document.createElement('div');
	notSupported.style = 'font-weight: normal;';
  notSupported.style.marginTop = '10px';
  notSupported.style.marginBottom = '10px';
	notSupported.textContent = "Your browser does not support File API for reading local files.";
	root.appendChild(notSupported);
}
 
function createStatusBar(root) {
	let status = document.createElement('div');
	status.textContent = "Insert text or choose file. Press 'Import Ratings' button.";
  status.style.marginTop = '10px';
  status.style.marginBottom = '10px';
	root.appendChild(status);
 
	return status;
}
 
function createImportButton(root) {
	let importList = document.createElement('button');
	importList.class = 'btn';
	importList.textContent = "Import Ratings";
	root.appendChild(importList);
 
	importList.addEventListener('click', importRatingsClickHandler, false);
}
 
function importRatingsClickHandler(event) {
	if (elements.hasOwnProperty('isFromFile') && elements.isFromFile.checked) {
		readFile();
	} else {
		importRatings(extractItems(elements.text.value));
	}
}
 
function readFile() {
	let file = elements.file.files[0];
	if (file !== undefined) {
		log("Info", "Reading file " + file.name);
		setStatus("Reading file " + file.name);
		let fileReader = new FileReader();
		fileReader.onload = fileOnloadHandler;
		fileReader.readAsText(file);
	} else {
		setStatus("Error: File is not selected");
	}
}
 
function fileOnloadHandler(event) {
	if (event.target.error === null) {
		importRatings(extractItems(event.target.result));
	} else {
		log("Error", e.target.error);
		setStatus("Error: " + e.target.error);
	}
}
 
function extractItems(text) {
	try {
		return extractItemsFromCSV(text);
	} catch (message) {
		log("Error", message);
		setStatus("Error: " + message);
		return [];
	}
}
 
function extractItemsFromCSV(text) {
	let table = parseCSV(text);
	let fields = findFieldNumbers(table);
 
	log("Info", "Found csv file fields Const(" + fields.const + ") and Your Rating(" + fields.rating + ")");
 
	re = new RegExp("^tt[0-9]{7,8}$");
	let items = [];
	// Add elements to the list
	for (let i = 1; i < table.length; i++) {
    let fconst = table[i][fields.const];
    let frating = table[i][fields.rating];
		if (re.exec(fconst) === null) {
			throw "Invalid 'const' field format on line " + (i+1);
		}
    if (frating === "") {
      continue;
    }
    frating = parseInt(frating);
    if (isNaN(frating)) {
     	throw "Invalid 'your rating' field format on line " + (i+1); 
    }
		items.push({const: fconst, rating: frating});
	}
 
	return items;
}
 
function parseCSV(text) {
	let lines = text.split(/\r|\n/);
	let table = [];
	for (let i=0; i < lines.length; i++) {
		if (isEmpty(lines[i])) {
			continue;
		}
		let isInsideString = false;
		let row = [""];
		for (let j=0; j < lines[i].length; j++) {
			if (!isInsideString && lines[i][j] === ',') {
				row.push("");
			} else if (lines[i][j] === '"') {
				isInsideString = !isInsideString;
			} else {
				row[row.length-1] += lines[i][j];
			}
		}
		table.push(row);
		if (isInsideString) {
			throw "Wrong number of \" on line " + (i+1);
		}
		if (row.length != table[0].length) {
			throw "Wrong number of fields on line " + (i+1) + ". Expected " + table[0].length + " but found " + row.length + ".";
		}
	}
 
	return table;
}
 
function isEmpty(str) {
	return str.trim().length === 0;
}

function findFieldNumbers(table) {
	let fieldNames = table[0];
	let fieldNumbers = {'const': -1, 'rating': -1};
 
	for (let i = 0; i < fieldNames.length; i++) {
		let fieldName = fieldNames[i].toLowerCase().trim();
		if (fieldName === 'const') {
			fieldNumbers.const = i;
		} else if (fieldName === 'your rating') {
			fieldNumbers.rating = i;
		}
	}
 
	if (fieldNumbers.const === -1) {
		throw "Field 'const' not found.";
	} else if (fieldNumbers.rating === -1) {
   	throw "Field 'your rating' not found."; 
  }
	return fieldNumbers;
}
 
async function importRatings(list) {
	if (list.length === 0)
		return;
 
	let l = {};
	l.list = list;
	l.ready = 0;
  
  for (let i = 0; i < list.length; ++i) {
    log("Info", `Setting rating ${list[i].rating} for ${list[i].const}...`);
    request_data_add_rating.variables.rating = list[i].rating;
    request_data_add_rating.variables.titleId = list[i].const;
    await sendRequest(request_data_add_rating);
    setStatus(`Ready ${i+1} of ${list.length}.`);
  }
}
 
function sendRequest(data) {
  return fetch("https://api.graphql.imdb.com/", {
    "credentials": "include",
    "headers": {
        "Accept": "application/graphql+json, application/json",
        "content-type": "application/json",
    },
    "referrer": "https://www.imdb.com/",
    "body": JSON.stringify(data),
    "method": "POST",
    "mode": "cors"
	}).then((response) => {
  	if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    return response.json();
  });
}