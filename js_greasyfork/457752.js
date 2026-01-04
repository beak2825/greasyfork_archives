// ==UserScript==
// @name            IMDB List Importer
// @namespace       Neinei0k_imdb
// @match           https://www.imdb.com/list/*
// @version         8.1
// @license         GNU General Public License v3.0 or later
// @description	    Import list of titles or people in the imdb list
// @downloadURL https://update.greasyfork.org/scripts/457752/IMDB%20List%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/457752/IMDB%20List%20Importer.meta.js
// ==/UserScript==

let elements = createHTMLForm();

function log(level, message) {
	console.log("(IMDB List Importer) " + level + ": " + message);
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

    elements.isCSV = createCSVCheckbox(root);
    elements.isUnique = createUniqueCheckbox(root);
    elements.isWait = createWaitCheckbox(root);
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
	let container = document.querySelector('.lister-search');
	if (container === null) {
		throw ".lister-search element not found";
	}
	let root = document.createElement('div');
	root.setAttribute('class', 'search-bar');
	root.style.height = 'initial';
  root.style.marginBottom = '30px';
	container.appendChild(root);

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

function createCSVCheckbox(root) {
	let isCSV = createCheckbox("Data from .csv file (otherwise extract ids from text)");
	isCSV.checkbox.checked = true;
	root.appendChild(isCSV.label);
	root.appendChild(document.createElement('br'));

	return isCSV.checkbox;
}

function createUniqueCheckbox(root) {
	let isUnique = createCheckbox("Add only unique elements");
	root.appendChild(isUnique.label);
	root.appendChild(document.createElement('br'));

	return isUnique.checkbox;
}

function createWaitCheckbox(root) {
	let isWait = createCheckbox("Wait?");
	root.appendChild(isWait.label);
	root.appendChild(document.createElement('br'));

	return isWait.checkbox;
}

function createStatusBar(root) {
	let status = document.createElement('div');
	status.textContent = "Set-up parameters. Insert text or choose file. Press 'Import List' button.";
  status.style.marginTop = '10px';
  status.style.marginBottom = '10px';
	root.appendChild(status);

	return status;
}

function createImportButton(root) {
	let importList = document.createElement('button');
	importList.class = 'btn';
	importList.textContent = "Import List";
	root.appendChild(importList);

	importList.addEventListener('click', importListClickHandler, false);
}

function importListClickHandler(event) {
	if (elements.hasOwnProperty('isFromFile') && elements.isFromFile.checked) {
		readFile();
	} else {
		importList(extractItems(elements.text.value));
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
		importList(extractItems(event.target.result));
	} else {
		log("Error", e.target.error);
		setStatus("Error: " + e.target.error);
	}
}

function extractItems(text) {
	try {
		let itemRegExp = getRegExpForItems();

		if (elements.isCSV.checked) {
			return extractItemsFromCSV(itemRegExp, text);
		} else {
			return extractItemsFromText(itemRegExp, text);
		}
	} catch (message) {
		log("Error", message);
		setStatus("Error: " + message);
		return [];
	}
}

function getRegExpForItems() {
	let listType;
	if (isPeopleList()) {
		log("Info", "List type: people");
		listType = "nm";
	} else if (isTitlesList()) {
		log("Info", "List type: titles");
		listType = "tt";
	} else {
		throw "Could not determine list type";
	}
	return listType + "[0-9]{7,8}";
}

function isPeopleList() {
	return document.querySelector('[data-type="People"]') !== null;
}

function isTitlesList() {
	return document.querySelector('[data-type="Titles"]') !== null;
}

function extractItemsFromCSV(re, text) {
	let table = parseCSV(text);
	let fields = findFieldNumbers(table);

  if (fields.description !== -1) {
		log("Info", "Found csv file fields Const(" + fields.const + ") and Description(" + fields.description + ")");
  } else {
    log("Info", "Found csv file field Const(" + fields.const + "). Description field is not found.");
  }

	re = new RegExp("^" + re + "$");
	let items = [];
	// Add elements to the list
	for (let i = 1; i < table.length; i++) {
		let row = table[i];
		if (re.exec(row[fields.const]) === null) {
			throw "Invalid 'const' field format on line " + (i+1);
		}
		if (elements.isUnique.checked) {
			let exists = items.findIndex(function(v){
				return v.const === row[fields.const];
			});
			if (exists !== -1) continue;
		}
		items.push({const: row[fields.const], description: (fields.description == -1 ? "" : row[fields.description])});
	}

	return items;
}

function parseCSV(text) {
	let lines = text.split('\n');
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
	let fieldNumbers = {'const': -1, 'description': -1};

	for (let i = 0; i < fieldNames.length; i++) {
		let fieldName = fieldNames[i].toLowerCase();
		if (fieldName === 'const') {
			fieldNumbers.const = i;
		} else if (fieldName === 'description') {
			fieldNumbers.description = i;
		}
	}

	if (fieldNumbers.const === -1) {
		throw "Field 'const' not found."
	}
	return fieldNumbers;
}

function extractItemsFromText(re, text) {
	re = new RegExp(re);
	let items = [];
	let e;
	while ((e = re.exec(text)) !== null) {
		let flag = '';
		if (elements.isUnique.checked)
			flag = 'g';
		text = text.replace(new RegExp(e[0], flag), '');
		items.push({const: e[0], description: ""});
	}
	return items;
}

const sleep = async (milliseconds) => {
    await new Promise(resolve => {
        return setTimeout(resolve, milliseconds)
    });
};

function importList(list) {
	if (list.length === 0)
		return;

	let msg = "Elements to add: ";
	for (let i = 0;  i < list.length; i++)
		msg += list[i].const + ",";
	log("Info", msg);

	let l = {};
	l.list = list;
	l.ready = 0;
	l.list_id = /ls[0-9]{1,}/.exec(location.href)[0];
	l.hiddenElementData = getHiddenElementData(); // Data needs to be send with all requests.

    sendItem(l);
}

function getHiddenElementData() {
	let hiddenElement = document.querySelector('#main > input');
	if (hiddenElement === null) {
	 	log("Error", "Hidden element not found. It is required to be sent with every request.");
    setStatus("Error: Hidden element not found. It is required to be sent with every request.");
		return "";
	}
	return hiddenElement.id + "=" + hiddenElement.value;
}

function sendItem(l) {
	log("Info", 'Add element ' + l.ready + ': ' + l.list[l.ready].const);
	let url = 'https://www.imdb.com/list/' + l.list_id + '/' + l.list[l.ready].const + '/add';
    const testSleep = async () => {
    if (elements.isWait.checked) {
        await sleep(5000);
    }
    sendRequest(sendItemHandler, l, url, l.hiddenElementData);
    }
    testSleep();
}

function sendRequest(handler, l, url, data) {
  var x = new XMLHttpRequest();
	x.onreadystatechange = function(event) {
			handler(l, event);
  }
	x.open('POST', url, true);
	x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	x.send(data);
}

function sendItemHandler(l, event) {
  let target = event.target;
	log("Info", "Add element(" + l.list[l.ready].const + ") request: readyState(" + target.readyState + "), status(" + target.status + ")");
	if (target.readyState == 4 && target.status == 200) {
		let description = l.list[l.ready].description;
		if (description.length !== 0) {
			let listItemId = JSON.parse(target.responseText).list_item_id;
			let url = 'https://www.imdb.com/list/' + l.list_id + '/edit/itemdescription';
			let data = 'newDescription=' + description + '&listItem=' + listItemId + '&' + l.hiddenElementData
			sendRequest(sendItemDescriptionHandler, l, url, data);
		} else {
			showReady(l);
		}
	}
}

function sendItemDescriptionHandler(l, event) {
    let target = event.target;
	log("Info", "Add element(" + l.list[l.ready].const + ") description request: readyState(" + target.readyState + "), status(" + target.status + ")");
	if (target.readyState == 4 && target.status == 200) {
		showReady(l);
	}
}

function showReady(l) {
	l.ready += 1;
	setStatus('Ready ' + l.ready + ' of ' + l.list.length + '.');
	if (l.ready == l.list.length) {
		location.reload();
	} else {
		sendItem(l);
	}
}