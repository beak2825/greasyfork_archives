// ==UserScript==
// @name            IMDB List Importer
// @namespace       Neinei0k_imdb
// @include         https://www.imdb.com/list/*
// @version         10.3
// @license         GNU General Public License v3.0 or later
// @description	Import list of titles or people in the imdb list
// @downloadURL https://update.greasyfork.org/scripts/23584/IMDB%20List%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/23584/IMDB%20List%20Importer.meta.js
// ==/UserScript==

var request_data_add_item = {
    "query": "mutation AddConstToList($listId: ID!, $constId: ID!, $includeListItemMetadata: Boolean!, $refTagQueryParam: String, $originalTitleText: Boolean) {\n  addItemToList(input: {listId: $listId, item: {itemElementId: $constId}}) {\n    listId\n    modifiedItem {\n      ...ListItemMetadata\n      listItem @include(if: $includeListItemMetadata) {\n        ... on Title {\n          ...TitleListItemMetadata\n        }\n        ... on Name {\n          ...NameListItemMetadata\n        }\n        ... on Image {\n          ...ImageListItemMetadata\n        }\n        ... on Video {\n          ...VideoListItemMetadata\n        }\n      }\n    }\n  }\n}\n\nfragment ListItemMetadata on ListItemNode {\n  itemId\n  createdDate\n  description {\n    originalText {\n      markdown\n      plaidHtml(showLineBreak: true)\n      plainText\n    }\n  }\n}\n\nfragment TitleListItemMetadata on Title {\n  ...BaseTitleCard\n  plot {\n    plotText {\n      plainText\n    }\n  }\n  latestTrailer {\n    id\n  }\n  series {\n    series {\n      id\n      originalTitleText {\n        text\n      }\n      releaseYear {\n        endYear\n        year\n      }\n      titleText {\n        text\n      }\n    }\n  }\n}\n\nfragment BaseTitleCard on Title {\n  id\n  titleText {\n    text\n  }\n  titleType {\n    id\n    text\n    canHaveEpisodes\n    displayableProperty {\n      value {\n        plainText\n      }\n    }\n  }\n  originalTitleText {\n    text\n  }\n  primaryImage {\n    id\n    width\n    height\n    url\n    caption {\n      plainText\n    }\n  }\n  releaseYear {\n    year\n    endYear\n  }\n  ratingsSummary {\n    aggregateRating\n    voteCount\n  }\n  runtime {\n    seconds\n  }\n  certificate {\n    rating\n  }\n  canRate {\n    isRatable\n  }\n  titleGenres {\n    genres(limit: 3) {\n      genre {\n        text\n      }\n    }\n  }\n  canHaveEpisodes\n}\n\nfragment NameListItemMetadata on Name {\n  id\n  primaryImage {\n    url\n    caption {\n      plainText\n    }\n    width\n    height\n  }\n  nameText {\n    text\n  }\n  primaryProfessions {\n    category {\n      text\n    }\n  }\n  knownFor(first: 1) {\n    edges {\n      node {\n        summary {\n          yearRange {\n            year\n            endYear\n          }\n        }\n        title {\n          id\n          originalTitleText {\n            text\n          }\n          titleText {\n            text\n          }\n          titleType {\n            canHaveEpisodes\n          }\n        }\n      }\n    }\n  }\n  bio {\n    displayableArticle {\n      body {\n        plaidHtml(\n          queryParams: $refTagQueryParam\n          showOriginalTitleText: $originalTitleText\n        )\n      }\n    }\n  }\n}\n\nfragment ImageListItemMetadata on Image {\n  id\n  url\n  height\n  width\n  caption {\n    plainText\n  }\n  names(limit: 4) {\n    id\n    nameText {\n      text\n    }\n  }\n  titles(limit: 1) {\n    id\n    titleText {\n      text\n    }\n    originalTitleText {\n      text\n    }\n    releaseYear {\n      year\n      endYear\n    }\n  }\n}\n\nfragment VideoListItemMetadata on Video {\n  id\n  thumbnail {\n    url\n    width\n    height\n  }\n  name {\n    value\n    language\n  }\n  description {\n    value\n    language\n  }\n  runtime {\n    unit\n    value\n  }\n  primaryTitle {\n    id\n    originalTitleText {\n      text\n    }\n    titleText {\n      text\n    }\n    titleType {\n      canHaveEpisodes\n    }\n    releaseYear {\n      year\n      endYear\n    }\n  }\n}",
    "operationName": "AddConstToList",
    "variables": {
        "listId": "",
        "constId": "",
        "includeListItemMetadata": true,
        "refTagQueryParam": "lsedt_add_items",
        "originalTitleText": false
    }
}

var request_data_add_description = {
    "query": "mutation EditListItemDescription($listId: ID!, $itemId: ID!, $itemDescription: String!) {\n  editListItemDescription(\n    input: {listId: $listId, itemId: $itemId, itemDescription: $itemDescription}\n  ) {\n    formattedItemDescription {\n      originalText {\n        markdown\n        plaidHtml(showLineBreak: true)\n        plainText\n      }\n    }\n  }\n}",
    "operationName": "EditListItemDescription",
    "variables": {
        "listId": "",
        "itemId": "",
        "itemDescription": ""
    }
}

var request_data_reorder_item = {
    "query": "mutation reorderListItems($input: ReorderListInput!) {\n  reorderList(input: $input) {\n    listId\n  }\n}",
    "operationName": "reorderListItems",
    "variables": {
        "input": {
            "newPositions": [
                /*{
                    "position": -1,
                    "itemId": ""
                }*/
            ],
            "listId": ""
        }
    }
}

if (/^https:\/\/(www.)?imdb.com\/list\/ls[0-9]+\/edit/.test(document.location)) {
    var elements = createHTMLForm();
}

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
    
    elements.isReverse = createReverseCheckbox(root);
    elements.insert = createInsertRadio(root);
    elements.insertOther = createInsertOtherInput(root);
    
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
	let container = document.querySelector('section.ipc-page-section--base');
	if (container === null) {
		throw "section.section.ipc-page-section--base element not found";
	}
	let root = document.createElement('div');
	root.setAttribute('class', 'search-bar ipc-list-card--base ipc-list-card--border-line');
	root.style.height = 'initial';
  root.style.marginTop = '30px';
  root.style.marginBottom = '30px';
  root.style.padding = '10px';
	container.insertBefore(root, container.children[1]);

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

function createRadio(name, value, textContent) {
  let radio = document.createElement('input');
	radio.type = 'radio';
	radio.style = 'width: initial;';
  radio.name = name;
  radio.value = value;

	let text = document.createElement('span');
	text.style = 'font-weight: normal;';
	text.textContent = textContent;

	let label = document.createElement('label');
	label.appendChild(radio);
	label.appendChild(text);

	return {label: label, radio: radio};
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

function createReverseCheckbox(root) {
  let isReverse = createCheckbox("Reverse Items on Insertion");
  root.appendChild(document.createElement('br'));
	root.appendChild(isReverse.label);
	root.appendChild(document.createElement('br'));

	return isReverse.checkbox;
}

function createInsertRadio(root) {
  let insertBegin = createRadio("imdb_list_importer_insert", "1", "Insert in the Beginning");
  let insertEnd = createRadio("imdb_list_importer_insert", "-1", "Insert in the End");
  let insertOther = createRadio("imdb_list_importer_insert", "0", "Insert in Other Position");
  
  insertEnd.radio.checked = true;
  
  root.appendChild(insertBegin.label);
  root.appendChild(document.createElement('br'));
  root.appendChild(insertEnd.label);
  root.appendChild(document.createElement('br'));
  root.appendChild(insertOther.label);
  root.appendChild(document.createElement('br'));
  
  insertBegin.radio.addEventListener('change', isOtherHandler, false);
  insertEnd.radio.addEventListener('change', isOtherHandler, false);
  insertOther.radio.addEventListener('change', isOtherHandler, false);
  
  return {'begin': insertBegin.radio, 'end': insertEnd.radio, 'other': insertOther.radio};
}

function createInsertOtherInput(root) {
  let insertOtherInput = document.createElement('input');
  insertOtherInput.type = 'text';
  insertOtherInput.disabled = true;
  root.appendChild(insertOtherInput);
  root.appendChild(document.createElement('br'));
  root.appendChild(document.createElement('br'));
  
  return insertOtherInput;
}

function isOtherHandler(event) {
  let isDisable = event.target.value != "0";
  elements.insertOther.disabled = isDisable;
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
	return "[a-z]{2}[0-9]{7,8}";
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
	let fieldNumbers = {'const': -1, 'description': -1};

	for (let i = 0; i < fieldNames.length; i++) {
		let fieldName = fieldNames[i].toLowerCase().trim();
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

async function importList(list) {
	if (list.length === 0)
		return;

	let msg = "Elements to add: ";
	for (let i = 0;  i < list.length; i++)
		msg += list[i].const + ",";
	log("Info", msg);

	let list_id = /ls[0-9]{1,}/.exec(location.href)[0];
  
  if (elements.isReverse.checked) {
   	list.reverse();
  }

  let items = [];
  for (let i = 0; i < list.length; ++i) {
    log("Info", `Adding element ${String(i+1)}: ${list[i].const}...`);

    request_data_add_item.variables.listId = list_id;
  	request_data_add_item.variables.constId = list[i].const;
    let response = await sendRequest(request_data_add_item);
    
    let listItemId = response.data.addItemToList.modifiedItem.itemId;
    log("Info", `${list[i].const} added as ${listItemId}`);
    items.push(listItemId);
      
		if (list[i].description.length !== 0) {
      log("Info", `Adding description to ${listItemId}...`);
      request_data_add_description.variables.listId = list_id;
    	request_data_add_description.variables.itemId = listItemId;
    	request_data_add_description.variables.itemDescription = list[i].description;
      await sendRequest(request_data_add_description);
    }
    
    setStatus(`Ready ${String(i+1)} of ${list.length}.`);  
  }
  
  let insertPosition = -1;
  if (elements.insert.begin.checked) {
   	insertPosition = 1;
  } else if (elements.insert.other.checked) {
   	insertPosition = Number(elements.insertOther.value);
    if (isNaN(insertPosition) || insertPosition < 1) {
     	insertPosition = -1; 
    }
  }
  if (insertPosition != -1) {
    request_data_reorder_item.variables.input.newPositions = [];
    request_data_reorder_item.variables.input.listId = list_id;

    for (let i = items.length - 1; i >= 0; i--) {
      request_data_reorder_item.variables.input.newPositions.push({
        "position": insertPosition,
        "itemId": items[i]
      });
    }

    log("Info", `Moving items to position ${insertPosition}...`);
    await sendRequest(request_data_reorder_item);
  }
  
  location.reload();
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