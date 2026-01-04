// ==UserScript==
// @name        Entered Giveaways Filter & Sorter
// @namespace   red5thedragon
// @description Filters and sorts the entered giveaway list
// @author      red5thedragon
// @match       https://www.steamgifts.com/giveaways/entered*
// @version     0.1.2
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/31373/Entered%20Giveaways%20Filter%20%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/31373/Entered%20Giveaways%20Filter%20%20Sorter.meta.js
// ==/UserScript==
"use strict";

var columnsHeadings = document.getElementsByClassName("table__heading")[0].children;
var columnsHeadingsLength = columnsHeadings.length-1;
var gaRows = document.getElementsByClassName("table__row-inner-wrap");
var l = gaRows.length;

var column = 0;
var typeToFilter = "";
var filterInputs = [];
filterInputs.length = columnsHeadingsLength;

//--------------------------------------------------

// Removing arrows for inputs of type number and adding css to hide elements

(function () {
var a = document.createElement("STYLE");
var b = document.createTextNode("input[type=number] {-moz-appearance:textfield;}");
var c = document.createTextNode("input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button {-webkit-appearance: none; margin: 0;}");
var d = document.createTextNode(".hideRow {display: none;}");

a.appendChild(b);
a.appendChild(c);
a.appendChild(d);
document.head.appendChild(a);
})();

//--------------------------------------------------
                                
// Make headers clickable

for (let i=0; i<columnsHeadingsLength; i++) {
  columnsHeadings[i].style.cursor = "pointer";
  columnsHeadings[i].addEventListener("click", function () {columnSelector(i);}, true);
  //columnsHeadings[i].setAttribute("style","font-size:125%");
}

//--------------------------------------------------

// Numbering giveaway rows to be able to reset sorting later and hiding deleted giveaways on load

for (let i=0; i<l; i++) {
  gaRows[i].parentElement.classList.add("EGFS-"+i);
  if (gaRows[i].children[1].children[1].classList.contains("tablecolumndeleted")) {
    gaRows[i].classList.add("hideRow");
  }
}

//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------

// Creating column header popup options

var dropdown = document.createElement("FORM");
//dropdown.setAttribute("class", "dropdown-content");
dropdown.style.display = "none";
dropdown.style.position = "absolute";
dropdown.style.border = "medium solid black";
//dropdown.style.borderRadius = "7%";
dropdown.style.zIndex = "1";
dropdown.style.backgroundColor = "white";
dropdown.style.textAlign = "left";
dropdown.style.cursor = "auto";

//--------------------------------------------------

// Filter options

var filterForNumbersMin = document.createElement("INPUT");
filterForNumbersMin.classList.add("filterOption");
filterForNumbersMin.setAttribute("type", "number");
filterForNumbersMin.setAttribute("name", "numberfiltermin");
filterForNumbersMin.style.width = "4em";
filterForNumbersMin.style.padding = "0px";

var filterForNumbersMax = document.createElement("INPUT");
filterForNumbersMax.classList.add("filterOption");
filterForNumbersMax.setAttribute("type", "number");
filterForNumbersMax.setAttribute("name", "numberfiltermax");
filterForNumbersMax.style.width = "4em";
filterForNumbersMax.style.padding = "0px";

var filterForNumbers = document.createElement("SPAN");
filterForNumbers.classList.add("filterOption");
filterForNumbers.appendChild(document.createTextNode("Range:"));
filterForNumbers.appendChild(document.createElement("BR"));
filterForNumbers.appendChild(filterForNumbersMin);
filterForNumbers.appendChild(document.createTextNode(" \u2013 "));
filterForNumbers.appendChild(filterForNumbersMax);
filterForNumbers.appendChild(document.createElement("HR"));

var filterForWordsTextBox = document.createElement("INPUT");
filterForWordsTextBox.classList.add("filterOption");
filterForWordsTextBox.setAttribute("type", "text");
filterForWordsTextBox.setAttribute("name", "filterForWordsTextBox");
filterForWordsTextBox.style.width = "8em";
filterForWordsTextBox.style.padding = "0px";

var filterForWords = document.createElement("SPAN");
filterForWords.classList.add("filterOption");
filterForWords.appendChild(document.createTextNode("Filter for:"));
filterForWords.appendChild(document.createElement("BR"));
filterForWords.appendChild(filterForWordsTextBox);
filterForWords.appendChild(document.createElement("HR"));

var filterForDatesMin = document.createElement("INPUT");
filterForDatesMin.classList.add("filterOption");
filterForDatesMin.setAttribute("type", "date");
filterForDatesMin.setAttribute("name", "datefiltermin");
filterForDatesMin.title = "MM/DD/YYYY";
filterForDatesMin.style.width = "4em";
filterForDatesMin.style.padding = "0px";

var filterForDatesMax = document.createElement("INPUT");
filterForDatesMax.classList.add("filterOption");
filterForDatesMax.setAttribute("type", "date");
filterForDatesMax.setAttribute("name", "datefiltermax");
filterForDatesMax.title = "MM/DD/YYYY";
filterForDatesMax.style.width = "4em";
filterForDatesMax.style.padding = "0px";

var filterForDates = document.createElement("SPAN");
filterForDates.classList.add("filterOption");
filterForDates.appendChild(document.createTextNode("Date Range:"));
filterForDates.appendChild(document.createElement("BR"));
filterForDates.appendChild(filterForDatesMin);
filterForDates.appendChild(document.createTextNode(" \u2013 "));
filterForDates.appendChild(filterForDatesMax);
filterForDates.appendChild(document.createElement("HR"));

//--------------------------------------------------

// Sort options

//var ascendingSortOption = document.createElement("SPAN");
var ascendingSortRadio = document.createElement("INPUT");
ascendingSortRadio.classList.add("sortOption");
ascendingSortRadio.setAttribute("type", "radio");
ascendingSortRadio.setAttribute("name", "ascend-descend");
ascendingSortRadio.setAttribute("value", "ascending");
ascendingSortRadio.style.width = "2em";
ascendingSortRadio.style.verticalAlign = "middle";
//ascendingSortOption.style.border = "medium solid blue";
//ascendingSortOption.appendChild(ascendingSortRadio);
//ascendingSortOption.appendChild(document.createTextNode("Ascending"));

var descendingSortRadio = document.createElement("INPUT");
descendingSortRadio.classList.add("sortOption");
descendingSortRadio.setAttribute("type", "radio");
descendingSortRadio.setAttribute("name", "ascend-descend");
descendingSortRadio.setAttribute("value", "descending");
descendingSortRadio.style.width = "2em";
descendingSortRadio.style.verticalAlign = "middle";

//--------------------------------------------------

// Apply button

var applyButton = document.createElement("INPUT");
applyButton.classList.add("sortOption");
applyButton.setAttribute("type", "button");
applyButton.setAttribute("value", "Apply");
applyButton.addEventListener("click", function () {applyFilterOptions();});
applyButton.addEventListener("click", function () {applySortOptions();});
applyButton.style.backgroundColor = "lightgrey";
applyButton.style.cursor = "pointer";


// Reset button

var resetButton = document.createElement("INPUT");
resetButton.classList.add("sortOption");
resetButton.setAttribute("type", "button");
resetButton.setAttribute("value", "Reset");
resetButton.addEventListener("click", resetOptions);
resetButton.style.backgroundColor = "lightgrey";
resetButton.style.cursor = "pointer";

//--------------------------------------------------

// Appending onto dropdown form element

dropdown.appendChild(ascendingSortRadio);
dropdown.appendChild(document.createTextNode("Ascending"));
dropdown.appendChild(document.createElement("BR"));
dropdown.appendChild(descendingSortRadio);
dropdown.appendChild(document.createTextNode("Descending"));
dropdown.appendChild(document.createElement("BR"));
dropdown.appendChild(applyButton);
dropdown.appendChild(resetButton);

//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------

// Open popup

function columnSelector(col) {
  column = col;
  if (document.getElementById("openedDropdown")===null) {
    columnsHeadings[col].id = "openedDropdown";
    
    if (isNaN(parseFloat(gaRows[0].children[col+1].textContent))) {
      dropdown.insertBefore(filterForWords, dropdown.firstChild);
      typeToFilter = "word";
    }
    
    else if (columnsHeadings[col].textContent.toLowerCase().indexOf("date entered") > -1) {
      dropdown.insertBefore(filterForDates, dropdown.firstChild);
      typeToFilter = "date";
    }
    
    else {
      dropdown.insertBefore(filterForNumbers, dropdown.firstChild);
      typeToFilter = "number";
      
      if (gaRows[0].children[col+1].textContent.indexOf(".") > -1) {
        filterForNumbersMin.setAttribute("step", "any");
        filterForNumbersMax.setAttribute("step", "any");
      }
    }
    
    columnsHeadings[col].appendChild(dropdown);
    dropdown.style.display = "block";
    //document.getElementsByClassName("dropdown-content")[0].reset();
    dropdown.reset();
  }
}

//--------------------------------------------------

// Close popup

//window.onclick = function (event) {
window.addEventListener("click", function (event) {
  if (!event.target.matches('#openedDropdown') && !event.target.matches('.sortOption, .filterOption')) {
    /*
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i=0; i<dropdowns.length; i++) {
      dropdowns[i].style.display = "none";
    }
    */
    dropdown.style.display = "none";
    
    if (document.getElementById("openedDropdown")!==null) {
      dropdown.removeChild(dropdown.firstChild);
      document.getElementById("openedDropdown").removeAttribute("id");
      console.log("removed id from column header");
      filterForNumbersMin.removeAttribute("step", "any");
      filterForNumbersMax.removeAttribute("step", "any");
    }
  }
}
, true)

//--------------------------------------------------

// Apply filtering

function applyFilterOptions(col, filter_inputs_array) {
  if (col) {
    column = col;
  }
  console.log("----------\ncolumn = " + column + "\ncol = " + col);
  
  //var formItems = document.getElementsByClassName("dropdown-content")[0].elements;
  var formItems = dropdown.elements;
  try {
    if (typeToFilter==="number") {
      
      if (col) {
        var x = filter_inputs_array[1];
        var y = filter_inputs_array[2];
      }
      else {
        var x = formItems.namedItem("numberfiltermin").value;
        var y = formItems.namedItem("numberfiltermax").value;
        filterInputs[column]=[typeToFilter, x, y];
      }
      console.log("min = " + x + "\n" + "max = " + y);
      
      if (x && y) {
        for (let i=0; i<l; i++) {
          
          if (columnsHeadings[column].textContent.toLowerCase().indexOf("entries") > -1) {
            if (!(parseFloat(gaRows[i].children[column+1].textContent.replace(/,|\./g,'')) >= x && parseFloat(gaRows[i].children[column+1].textContent.replace(/,|\./g,'')) <= y)) {
              gaRows[i].parentElement.classList.add("hideRow");
            }
          }
          
          else {
            if (!(parseFloat(gaRows[i].children[column+1].textContent.replace(/,/g,'')) >= x && parseFloat(gaRows[i].children[column+1].textContent.replace(/,/g,'')) <= y)) {
              gaRows[i].parentElement.classList.add("hideRow");
            }
          }
          
        }
      }
      
      console.log("filterInputs["+column+"] = [" + filterInputs[column]+"]");
    }
    else if (typeToFilter==="word") {
      
      if (col) {
        var w = filter_inputs_array[1];
      }
      else {
        var w = formItems.namedItem("filterForWordsTextBox").value.toLowerCase();
        filterInputs[column]=[typeToFilter, w];
      }
      console.log("word = " + w);
      
      if (w) {
        for (let i=0; i<l; i++) {
          if (!(gaRows[i].children[column+1].textContent.toLowerCase().indexOf(w) > -1)) {
            gaRows[i].parentElement.classList.add("hideRow");
          }
        }
      }
      
      console.log("filterInputs["+column+"] = [" + filterInputs[column]+"]");
      
    }
    else if (typeToFilter==="date") {
      
      if (col) {
        var x = filter_inputs_array[1];
        var y = filter_inputs_array[2];
      }
      else {
        var x = Date.parse(formItems.namedItem("datefiltermin").value)/1000;
        var y = Date.parse(formItems.namedItem("datefiltermax").value)/1000;
        filterInputs[column]=[typeToFilter, x, y];
      }
      //console.log("earliest date = " + x + "\n" + "latest date = " + y);
      console.log("earliest date = " + (new Date(x*1000)) + "\n" + "latest date = " + (new Date(y*1000)));
      
      if (x && y) {
        for (let i=0; i<l; i++) {
          if (!(gaRows[i].children[column+1].children[0].getAttribute("data-timestamp") >= x && gaRows[i].children[column+1].children[0].getAttribute("data-timestamp") <= y)) {
            gaRows[i].parentElement.classList.add("hideRow");
          }
        }
      }
      
    }
  }
  catch (err) {
    alert("Section:\nApply filtering\n\n" + "err.name = " + err.name + "\n" + "err.message = " + err.message);
    console.log("====================\nSection:\nApply filtering\n\n" + "err.name = " + err.name + "\n" + "err.message = " + err.message + "\n====================");
  }
  
  console.log("++++++++++++++++++++");
  console.log("filterInputs.length = " + filterInputs.length);
  console.log("filterInputs = " + filterInputs);
  console.log("++++++++++++++++++++");
  
  if(typeof(Storage) !=="undefined" && !col) {
    sessionStorage.EGFSfilterInputs = JSON.stringify(filterInputs);
  }
}

//--------------------------------------------------

// Apply sorting

function applySortOptions(sort_inputs_array) {
  
  if (sort_inputs_array) {
    column = sort_inputs_array[0];
    var z = sort_inputs_array[1];
  }
  else {
    var z = dropdown.elements.namedItem("ascend-descend").value;
  }
  console.log("apply direction: " + z);
  
  try {
    if (z) {
      var switching, shouldSwitch, i;
      switching = true;
      while (switching) {
        switching = false;
        for (i=0; i<(l-1); i++) {
          shouldSwitch = false;

          if (z === "ascending") {
            if (typeToFilter==="word") {
              if (gaRows[i].children[column+1].textContent.toLowerCase() > gaRows[i+1].children[column+1].textContent.toLowerCase()) {
                shouldSwitch= true;
                break;
              }
            }
            else if (typeToFilter==="number") {
              
              if (columnsHeadings[column].textContent.toLowerCase().indexOf("entries") > -1) {
                if (parseFloat(gaRows[i].children[column+1].textContent.replace(/,|\./g,'')) > parseFloat(gaRows[i+1].children[column+1].textContent.replace(/,|\./g,''))) {
                  shouldSwitch= true;
                  break;
                }
              }
              
              else {
                if (parseFloat(gaRows[i].children[column+1].textContent) > parseFloat(gaRows[i+1].children[column+1].textContent)) {
                  shouldSwitch= true;
                  break;
                }
              }
              
            }
            else if (typeToFilter==="date") {
              if (gaRows[i].children[column+1].children[0].getAttribute("data-timestamp") > gaRows[i+1].children[column+1].children[0].getAttribute("data-timestamp")) {
                shouldSwitch= true;
                break;
              }
            }
          }
          else if (z === "descending") {
            if (typeToFilter==="word") {
              if (gaRows[i].children[column+1].textContent.toLowerCase() < gaRows[i+1].children[column+1].textContent.toLowerCase()) {
                shouldSwitch= true;
                break;
              }
            }
            else if (typeToFilter==="number") {
              
              if (columnsHeadings[column].textContent.toLowerCase().indexOf("entries") > -1) {
                if (parseFloat(gaRows[i].children[column+1].textContent.replace(/,|\./g,'')) < parseFloat(gaRows[i+1].children[column+1].textContent.replace(/,|\./g,''))) {
                  shouldSwitch= true;
                  break;
                }
              }
              
              else {
                if (parseFloat(gaRows[i].children[column+1].textContent) < parseFloat(gaRows[i+1].children[column+1].textContent)) {
                  shouldSwitch= true;
                  break;
                }
              }
              
            }
            else if (typeToFilter==="date") {
              if (gaRows[i].children[column+1].children[0].getAttribute("data-timestamp") < gaRows[i+1].children[column+1].children[0].getAttribute("data-timestamp")) {
                shouldSwitch= true;
                break;
              }
            }
          }
        }

        if (shouldSwitch) {
          gaRows[i].parentElement.parentElement.insertBefore(gaRows[i+1].parentElement, gaRows[i].parentElement);
          switching = true;
        }

      }
    }
  }
  
  catch (err) {
    alert("Section:\nApply sorting\n\n" + "err.name = " + err.name + "\n" + "err.message = " + err.message);
    console.log("====================\nSection:\nApply sorting\n\n" + "err.name = " + err.name + "\n" + "err.message = " + err.message + "\n====================");
  }
  
  if(typeof(Storage) !=="undefined") {
    sessionStorage.EGFSsortInputs = JSON.stringify([column, z]);
  }
}

//--------------------------------------------------

// this might conflict; Saving filter inputs on page unload
/*
try {
  if(typeof(Storage) !=="undefined") {
    document.body.addEventListener("unload", function () {sessionStorage.EGFSfilterInputs = JSON.stringify(filterInputs);});
  }
}
catch (err) {
  alert("err.name = " + err.name + "\n" + "err.message = " + err.message);
}
*/

//--------------------------------------------------

// Reset filtering and sorting

function resetOptions() {
  try {
    console.log("filterInputs = " + filterInputs);
    dropdown.reset();
    
    // Unhide giveaway rows
    
    var hiddenRows = document.getElementsByClassName("hideRow");
    while (hiddenRows.length > 0) {
      hiddenRows[0].classList.remove("hideRow");
    }
    
    // Reset memory
    
    console.log("emptying array");
    filterInputs = [];
    filterInputs.length = columnsHeadingsLength;
    console.log("new filterInputs = " + filterInputs);
    
    sessionStorage.removeItem("EGFSfilterInputs");
    sessionStorage.removeItem("EGFSsortInputs");
    
    // Reset sorting
    
    var switching, shouldSwitch, i, a, b;
    switching = true;
    while (switching) {
      switching = false;
      for (i=0; i<(l-1); i++) {
        shouldSwitch = false;
        var gaRowClassList1 = gaRows[i].parentElement.classList;
        var gaRowClassList2 = gaRows[i+1].parentElement.classList;
        
        for (let j=0; j<gaRowClassList1.length; j++) {
          if (gaRowClassList1.item(j).indexOf("EGFS") > -1) {
            a = gaRowClassList1.item(j).match(/\d\d|\d/)[0];
          }
          if (gaRowClassList2.item(j).indexOf("EGFS") > -1) {
            b = gaRowClassList2.item(j).match(/\d\d|\d/)[0];
          }
        }
        
        if (a && b) {
          if (parseInt(a) > parseInt(b)) {
            shouldSwitch= true;
            break;
          }
        }
        
      }
      
      if (shouldSwitch) {
        gaRows[i].parentElement.parentElement.insertBefore(gaRows[i+1].parentElement, gaRows[i].parentElement);
        switching = true;
      }
      console.log("reseting sort");
    }
    
  }
  catch (err) {
    alert("Section:\nReset filtering and sorting\n\n" + "err.name = " + err.name + "\n" + "err.message = " + err.message);
    console.log("====================\nSection:\nReset filtering and sorting\n\n" + "err.name = " + err.name + "\n" + "err.message = " + err.message + "\n====================");
  }
}

//--------------------------------------------------

// Applying previous filtering and sorting on load

(function () {
  try {
    if (sessionStorage.EGFSfilterInputs) {
      filterInputs = JSON.parse(sessionStorage.EGFSfilterInputs);
      for (let i=0; i<filterInputs.length; i++) {
        if (filterInputs[i] != null) {
          typeToFilter = filterInputs[i][0];
          applyFilterOptions(i, filterInputs[i]);
        }
      }
    }
    if (sessionStorage.EGFSsortInputs) {
      applySortOptions(JSON.parse(sessionStorage.EGFSsortInputs));
    }
  }
  catch (err) {
    alert("Section:\nApplying previous filtering and sorting on load\n\n" + "err.name = " + err.name + "\n" + "err.message = " + err.message);
    console.log("====================\nSection:\nApplying previous filtering and sorting on load\n\n" + "err.name = " + err.name + "\n" + "err.message = " + err.message + "\n====================");
  }
})();

