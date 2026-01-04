// ==UserScript==
// @name        Audible Add "shelves" to the library
// @version     1.1.3
// @include     https://www.audible.com/lib*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @description Adding a shelving system to Audibles Library
// @namespace   https://www.reddit.com/user/Coolgamer7/
// @downloadURL https://update.greasyfork.org/scripts/377436/Audible%20Add%20%22shelves%22%20to%20the%20library.user.js
// @updateURL https://update.greasyfork.org/scripts/377436/Audible%20Add%20%22shelves%22%20to%20the%20library.meta.js
// ==/UserScript==
/*global document: false */
/*global async: false */
/* changelog
       Version 1.0 
            - First Release
       Version 1.1 
            - Button corrections, everything should update properly now
            - Changed logic to detect how many books are displayed on each page and query correctly
            - Added Import/Export
            - Small performance Improvements
       Version 1.1.1
            - Fixed Bug when adding a new shelf
       Version 1.1.2
            - Fixed Bugs when adding and removing shelves
            - Dropdown and displayed books now maintain and update when a book is added or removed from a shelf
       Version 1.1.3
            - Correcting White space left after putting books on a shelf
                 - This seems to have corrects the ratings not showing up as well
            - Fixed bug with Shelf list not updating
            

  */

var table = document.getElementById("adbl-library-content-main").getElementsByTagName('table')[0].getElementsByTagName('tbody')[0];
var rows = table.getElementsByTagName('tr');
var page = document.getElementById("center-5").getElementsByTagName('form')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[0].getElementsByTagName('div')[1].getElementsByTagName('div')[0].getElementsByTagName('span')[0].getElementsByTagName('ul')[0].getElementsByTagName('li');
var pageCount = parseInt(page[page.length - 2].getElementsByTagName('a')[0].innerHTML, 10);
var progress = 2;
var bookID = "";
var titlesPerPage = document.getElementById("center-5").getElementsByTagName('select')[0].value;
var form = $("[data-form-id=filtering]")[0];

function createButton(text, id, functionCall){
  var shelfCellSpan = document.createElement("span");
  var shelfCellSpan2 = document.createElement("span");
  var link = document.createElement("a");
  link.appendChild(document.createTextNode(text));
  link.setAttribute("class","bc-button-text");
  link.setAttribute("id",id);
  shelfCellSpan.setAttribute("class", "bc-text bc-button-text-inner bc-size-small bc-button-text");
  shelfCellSpan2.setAttribute("class", "bc-button bc-button-secondary adbl-lib-action-download  bc-button-small");
  link.onclick = function() { functionCall() };
  shelfCellSpan.appendChild(link);
  shelfCellSpan2.appendChild(shelfCellSpan);
  return shelfCellSpan2;
}

function exportShelves(textArea){
  (async() => {
    var jsonVars = {};
    var allVars = await GM.listValues();
    for(var i = allVars.length - 1; i >= 0; i--){
      console.log(allVars[i]);
      jsonVars[allVars[i]] = await GM.getValue(allVars[i], "");
    }
    textArea.value = JSON.stringify(jsonVars); 
  })();
}

function importShelves(textArea){
  var allShelves = textArea.value;
  (async() => {
    var obj = JSON.parse(allShelves); 
    for (var key in obj) {
      await GM.setValue(key, obj[key]);
    }
    location.reload();
  })();
}

function addExportShelvesButton() {
  (async() => {
    var exportPopUpContent = document.createElement("div");
    var importExportBox = document.createElement("TEXTAREA");
    var importExportButton = createButton("Import/Export Shelves", "importExportShelves", function(){ return togglePopUpDiv(exportPopUpContent); });
    var importButton = createButton("Import Shelves", "importShelves", function(){ return importShelves(importExportBox); });
    var exportButton = createButton("Export Shelves", "exportShelves", function(){ return exportShelves(importExportBox); });
    var closeImportExportButton = createButton("Close", "closeShelves", function(){ return showDiv(bookID); });
    importExportButton.style.float = "inline-end";
    exportPopUpContent.appendChild(importExportBox);
    exportPopUpContent.appendChild(document.createElement("br"));
    exportPopUpContent.appendChild(document.createElement("br"));
    exportPopUpContent.appendChild(importButton);
    exportPopUpContent.appendChild(document.createElement("br"));
    exportPopUpContent.appendChild(exportButton);
    exportPopUpContent.appendChild(document.createElement("br"));
    exportPopUpContent.appendChild(closeImportExportButton);
    form.appendChild(importExportButton);
  })();
}

function addShelfDropDown() {
  (async() => {
    let shelves = (await GM.getValue("shelves", "")).split(";");
    var shelfListSpan = document.getElementById("ShelfFilter");
    var shelfListSelect = document.getElementById("shelfSelect");
    var selectedItem = "";
    if (shelfListSpan == null) {
      shelfListSpan = document.createElement("span");
      shelfListSelect = document.createElement("select");
    } else {
      selectedItem = shelfListSelect.value;
      shelfListSpan.innerHTML = "";
      shelfListSelect.innerHTML = "";
      
    }
    shelfListSpan.setAttribute("class", "bc-dropdown bc-dropdown-inline bc-dropdown-small");
    shelfListSpan.setAttribute("id", "ShelfFilter");
    
    shelfListSelect.setAttribute("class", "bc-input bc-color-base bc-color-border-focus bc-color-background-base bc-color-border-base refinementFormDropDown refinementDropdown-purchaseDateFilter  bc-input-inline bc-input-small");
    shelfListSelect.setAttribute("name","shelfFilter");
    shelfListSelect.setAttribute("id", "shelfSelect");
    shelfListSelect.onchange = function() { hideShleves(shelfListSelect.value); };
    var option = document.createElement("option");
    option.text = "All Shelves";
    shelfListSelect.add(option)
    option = document.createElement("option");
    option.text = "Unshelved";
    shelfListSelect.add(option);
    shelves.forEach(function(shelf) {
      if (shelf != "") {
        option = document.createElement("option");
        option.text = shelf;
        shelfListSelect.add(option);
      }
    });
    shelfListSpan.appendChild(shelfListSelect);
    if(selectedItem != ""){
      shelfListSelect.value = selectedItem;
      hideShleves(selectedItem);
    }
    form.appendChild(shelfListSpan);
    shelfListSpan.insertAdjacentHTML('beforeend', '<i class="bc-icon bc-icon-chevron-down" aria-hidden="true"></i>');
  })();
}


addShelfDropDown();
addExportShelvesButton();

for (var i = rows.length - 2; i > 0; i--) {
  bookID = rows[i].getAttribute("id");
  addShelfText(bookID);
}
while (progress <= pageCount) {
  var url = "https://www.audible.com/lib?purchaseDateFilter=all&programFilter=all&sortBy=PURCHASE_DATE.dsc&page=" + progress + "&pageSize=" + titlesPerPage;
  request(url, "page"+progress);
  progress++;
}

function request(url, pageNum) {
  $.get(url, function(data, status) {
    var gatheredRows = new DOMParser().parseFromString(data, "text/html").getElementById("adbl-library-content-main").getElementsByTagName('table')[0].getElementsByTagName('tr');
    for (var i = gatheredRows.length - 2; i > 0; i--) {
      table.appendChild(gatheredRows[i].cloneNode(true));
      addShelfText(gatheredRows[i].getAttribute("id"));
    }
  });
}

function addShelfText(bookID) {
  (async() => {
    let shelf = await GM.getValue(bookID, "");
    var bookRow = document.getElementById(bookID);
    bookRow.setAttribute("GM_Shelf_Value",shelf);
    var columns = bookRow.getElementsByTagName("td");
    var shelfCellSpan2;
    if(shelf == "") {
      shelfCellSpan2 = createButton("Add to Shelf", "addToShelf" + bookID, function(){ return showDiv(bookID); });
    }else{
      shelfCellSpan2 = createButton("Change Shelf", "addToShelf" + bookID, function(){ return showDiv(bookID); });
    }
    columns[7].appendChild(shelfCellSpan2);
  })();
}

function addShelvesToDiv(shelfDiv, bookID) {
  (async() => {
    let existingShelf = await GM.getValue(bookID, "");
    let shelves = (await GM.getValue("shelves", "")).split(";");
    shelfDiv.style.height = (170 + shelves.length * 25) + "px";
    var newShelfToAdd = document.createElement("span");
    var link = document.createElement("a");

    shelves.forEach(function(shelf) {
      link.setAttribute("id",bookID + shelf);
      if (shelf != "") {
        newShelfToAdd.appendChild(document.createTextNode(shelf));
        if (shelf == existingShelf) {
          link.appendChild(document.createTextNode(" (remove)"));
          link.onclick = function() { removeFromShelf(shelf, bookID); };
        } else {
          link.appendChild(document.createTextNode(" (add)"));
          link.onclick = function() { addToShelf(shelf, bookID); };
        }

        newShelfToAdd.appendChild(link);
        link = document.createElement("a");
        link.appendChild(document.createTextNode(" (Delete Shelf)"));
        link.onclick = function() { deleteShelf(shelf, bookID); };
        newShelfToAdd.appendChild(link);
        newShelfToAdd.appendChild(document.createElement("br"));
        shelfDiv.appendChild(newShelfToAdd);
        link = document.createElement("a");
        newShelfToAdd = document.createElement("span");
      }
    });
    shelfDiv.appendChild(document.createElement("br"));
    var newShelfInput = document.createElement("input");
    newShelfInput.setAttribute("type","search");
    newShelfInput.setAttribute("class","bc-input bc-color-border-focus bc-color-base bc-color-background-base bc-color-border-base");
    newShelfInput.setAttribute("id","newShelfToAdd");
    newShelfInput.setAttribute("placeholder","New Shelf Name");
    shelfDiv.appendChild(newShelfInput);
    var newShelfButton = createButton("Add to New Shelf", "addToNewShelf", function(){ createNewShelf(newShelfInput,bookID); });
    shelfDiv.appendChild(newShelfButton);
    shelfDiv.appendChild(document.createElement("br"));
    var closeButton = createButton("Close", "closeShelves", function(){ return showDiv(bookID); });
    shelfDiv.appendChild(closeButton);
  })();
}

function deleteShelf(shelfToRemove, bookID) {
  (async() => {
    let shelves = (await GM.getValue("shelves", "")).split(";");
    var newShelves = [];
    shelves.forEach(function(shelf) {
      if (shelfToRemove != shelf) {
        newShelves.push(shelf);
      }
    });
    await GM.setValue("shelves", newShelves.join(";"));
    showDiv(bookID);
    showDiv(bookID);
    addShelfDropDown();
    var rows = table.getElementsByTagName('tr');
    var addToShelfButton;
    for (var i = 1; i <= rows.length - 1; i++) {
      if(rows[i].getAttribute("GM_Shelf_Value") == shelfToRemove ) {
        rows[i].setAttribute("GM_Shelf_Value","");
        await GM.setValue(rows[i].getAttribute("id"), "");
        addToShelfButton = document.getElementById("addToShelf"+rows[i].getAttribute("id"));
        addToShelfButton.textContent="Add to Shelf";
      }
    }

  })();
}

function createNewShelf(newShelfInput, bookID) {
  (async() => {
    await GM.setValue(bookID, newShelfInput.value);
    let shelves = (await GM.getValue("shelves", "")).split(";");
    var n = shelves.includes(newShelfInput.value);
    if (!n) {
      shelves.push(newShelfInput.value);
      await GM.setValue("shelves", shelves.join(";"));
    }
    refreshShelfSelectMenu(bookID);
    var addToShelfButton = document.getElementById("addToShelf" + bookID);
    addToShelfButton.textContent = "Change Shelf";
    addShelfDropDown();
    var row = document.getElementById(bookID);
    row.setAttribute("GM_Shelf_Value", newShelfInput.value);
  })();
}

function refreshShelfSelectMenu(bookID) {
  showDiv(bookID);
  showDiv(bookID);
}

function addToShelf(shelf, book) {
  console.log("Adding to Shelf");
  var link = document.getElementById(book+shelf);
  var row = document.getElementById(book);
  link.innerHTML = " (remove)";
  (async() => {
    await GM.setValue(book, shelf);
    row.setAttribute("GM_Shelf_Value",shelf);
    var addToShelfButton = document.getElementById("addToShelf" + book);
    addToShelfButton.textContent = "Change Shelf";
    refreshShelfSelectMenu(book);
    addShelfDropDown();
  })();
}

function removeFromShelf(shelf,book) {
  console.log("Removing From Shelf");
  var link = document.getElementById(book+shelf);
  var row = document.getElementById(book);
  link.innerHTML = " (add)";
  (async() => {
    await GM.setValue(book, "");
    row.setAttribute("GM_Shelf_Value","");
    var addToShelfButton = document.getElementById("addToShelf"+book);
    addToShelfButton.textContent = "Add to Shelf";
    refreshShelfSelectMenu(book);
    addShelfDropDown();
  })();
}

function togglePopUpDiv(element) {
  var shelfDiv = document.getElementById("GM_popUpDiv");
  if (shelfDiv == null) {
    shelfDiv = document.createElement("div");
    document.getElementsByTagName('body')[0].appendChild(shelfDiv);
    shelfDiv.style.position = "fixed";
    shelfDiv.style.zIndex = "15";
    shelfDiv.style.top = "30%";
    shelfDiv.style.right = "50%";
    shelfDiv.style.margin = "-100px 0 0 -150px";
    shelfDiv.style.border = "1px solid #cdcdcd";
    shelfDiv.style.boxShadow = "2px 2px 6px 0 rgba(51,51,51,.25)";
    shelfDiv.style.background = "rgb(255, 255, 255)";
    shelfDiv.style.padding = "20px";
    shelfDiv.setAttribute("id","GM_popUpDiv");
  } else {
    shelfDiv.innerHTML = "";
  }
  toggleVisible(shelfDiv);
  shelfDiv.appendChild(element);
  toggleBlackOutDiv();
}

function showDiv(bookShelfSelect) {
  var absShelfDiv = document.createElement("div");
  var shelfDivider = document.createElement("div");
  var columns = document.getElementById(bookShelfSelect).getElementsByTagName("td");
  shelfDivider.setAttribute("class", "bc-divider");
  absShelfDiv.appendChild(document.createTextNode("Select a Shelf for this book:"));
  absShelfDiv.appendChild(document.createElement("br"));
  absShelfDiv.appendChild(document.createElement("br"));
  absShelfDiv.appendChild(shelfDivider);
  absShelfDiv.appendChild(document.createElement("br"));
  addShelvesToDiv(absShelfDiv, bookShelfSelect);
  togglePopUpDiv(absShelfDiv);
}

function toggleBlackOutDiv() {
  var blackOut = document.getElementById("GM_blackOut");
  if (blackOut == null) {
    blackOut = document.createElement("div");
    document.getElementsByTagName('body')[0].appendChild(blackOut);
    blackOut.style.background = "rgb(0, 0, 0)";
    blackOut.style.position = "fixed";
    blackOut.style.height = "100%";
    blackOut.style.width = "100%";
    blackOut.style.zIndex = "14";
    blackOut.setAttribute("id", "GM_blackOut");
    blackOut.style.top = "0px";
    blackOut.style.opacity = ".5";
  }
  toggleVisible(blackOut);
}

function toggleVisible(element){
  if (element.style.visibility != "visible") {
    element.style.visibility = "visible";
  } else {
    element.style.visibility = "hidden";
  }
}


function hideShleves(selectedShelf) {
  var rows = table.getElementsByTagName('tr');
  if (selectedShelf == "Unshelved") {
    for (var i = rows.length - 1; i > 0; i--) {
      if (rows[i].getAttribute("GM_Shelf_Value") == "Unshelved" || rows[i].getAttribute("GM_Shelf_Value") == "") {
        rows[i].style.visibility = 'visible';
        rows[i].style.display = '';
      } else {
        rows[i].style.visibility = 'collapse';
        rows[i].style.display = 'none';
      }
    }
  } else if (selectedShelf == "All Shelves") {
    for (var i = rows.length - 1; i > 0; i--) {
      rows[i].style.visibility = 'visible';
      rows[i].style.display = '';
    }
  } else {
    for (var i = rows.length - 1; i > 0; i--) {
      if (rows[i].getAttribute("GM_Shelf_Value") != selectedShelf) {
        rows[i].style.visibility = 'collapse';
        rows[i].style.display = 'none';
      } else {
        rows[i].style.visibility = 'visible';
        rows[i].style.display = '';
      }
    }
  }
}

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}