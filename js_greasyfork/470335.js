// ==UserScript==
// @name         WebUntis Scrollable Table + first collum filter
// @version      0.1
// @description  Filter and get more table data
// @author       friend and me
// @match        https://*.webuntis.com/WebUntis/monitor?*
// @grant        none
// @run-at       document-start

// @namespace https://greasyfork.org/users/888286
// @downloadURL https://update.greasyfork.org/scripts/470335/WebUntis%20Scrollable%20Table%20%2B%20first%20collum%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/470335/WebUntis%20Scrollable%20Table%20%2B%20first%20collum%20filter.meta.js
// ==/UserScript==

function WaitForClass(selector, callback) {
  if (document.getElementsByClassName(selector).length != 0) {
    callback();
  } else {
    setTimeout(function () {
      WaitForClass(selector, callback);
    }, 100);
  }
}

function WaitForElement(selector, callback) { // @_@
    if (document.querySelector(selector)) {
        callback();
    } else {
        setTimeout(function() {
            WaitForElement(selector, callback);
        }, 100);
    }
}

function GetColumnName(column) {
  var tds = column.getElementsByTagName("td");
  if (tds.length == 0) return "";
  return tds[0].innerText;
}

function StopScrolling() {
  var styles = `
  table {
      top: 0px !important;
  }`;

  let s = document.createElement("style");
  s.type = "text/css";
  s.innerHTML = styles;
  (document.head || document.documentElement).appendChild(s);
}

// intercept xhr request send
!(function (send) {
  XMLHttpRequest.prototype.send = function (data) {
    if (!data) return send.call(this);
    if (!data.includes("dateOffset")) return send.call(this, data); //check if its a request we want to edit

    var parsedData;
    try {
      parsedData = JSON.parse(data); // parse as JSON
    } catch (e) {
      console.log("Error parsing JSON: " + e);
    }

    parsedData.showExamSupervision = true; //this may reveal some cool info but idk
    parsedData.showUnheraldedExams = true;

    parsedData.dateOffset = getUrlParam("offset"); // get user specified offset // modify offset

    data = JSON.stringify(parsedData); // stringify back to overwrite
    send.call(this, data);
  };
})(XMLHttpRequest.prototype.send);

function getUrlParam(param) {
  var currUrl = new URL(document.URL);
  return currUrl.searchParams.get(param);
}
function setUrlParam(param, value) {
  var currUrl = new URL(document.URL);
  currUrl.searchParams.set(param, value);
  return currUrl;
}

function NextPageUrl(direction) {
  var currOffset = getUrlParam("offset");
  if (currOffset) {
    offset = parseInt(currOffset) + direction;
    currUrl = setUrlParam("offset", offset);
  } else {
    offset = direction;
    currUrl = setUrlParam("offset", offset);
  }
  window.location.href = currUrl;
}

function changeClassFilter() {
  selection = document.getElementById("classInput").value;
  window.location.href = setUrlParam("classFilter", selection);
}

function OnTableLoaded() {

  try {
    document.getElementById("dijit__Widget_0").remove();
    var table = document.getElementsByTagName("table")[1];
    table.parentElement.style.overflow = "auto"; // enable scrolling
    var columns = table.getElementsByTagName("tr");

    var classFilter = getUrlParam("classFilter");

    if (classFilter) {
      document.getElementsByTagName("table")[2].remove(); // remove unnecessary second table
      var filteredColumns = [];
      for (var column of columns) {
        column.hidden = true; // hide all columns
        if (GetColumnName(column) != classFilter) continue;
        filteredColumns.push(column);
      }

      for (var column of filteredColumns) {
        column.hidden = false;
        table.appendChild(column, table.firstChild);
      }
    }
  } catch (err) {
    console.log("Error formatting or no table was provided");
  }
}

function createButtons() {
  var menuButtons = document.createElement("div");

  var buttonLeft = document.createElement("button");
  var buttonSetting = document.createElement("button");
  var buttonRight = document.createElement("button");

  menuButtons.append(buttonLeft);
  menuButtons.append(buttonSetting);
  menuButtons.append(buttonRight);

  var buttonStyle = `
                    background-color: #fff;
                    border: 1px solid #000;
                    margin: 5px;
                    width: 30%;
                    height: 50px;
                    border-radius: 3px;
                `;

  var settingStyle = `
                    background-color: #fff;
                    border: 1px solid #000;
                    margin: 5px;
                    width: 75px;
                    height: 50px;
                    border-radius: 3px;
                `;

  var labelStyle = `
                    background-color: #fff;
                    margin: 5px;
                    font-size: medium;
                `;

  var inputStyle = `
                    font-size: medium;
                    background-color: #fff;
                    border: 1px solid #000;
                    margin: 5px;
                    width: 10%;
                    height: 40px;
                    border-radius: 3px;
                `;

  buttonLeft.innerText = "Back";
  buttonLeft.style = buttonStyle;
  buttonLeft.onclick = function () {
    NextPageUrl(-1);
  };

  buttonSetting.innerText = "Setting";
  buttonSetting.style = settingStyle;
  buttonSetting.onclick = function () {
    settings = document.getElementById("settingsArea");
    if (settings.hidden == false) {
      settings.hidden = true;
    } else {
      settings.hidden = false;
    }
  };

  buttonRight.innerText = "Next";
  buttonRight.style = buttonStyle;
  buttonRight.onclick = function () {
    NextPageUrl(+1);
  };

  var settings = document.createElement("div");
  settings.id = "settingsArea";
  settings.hidden = true;

  var label = document.createElement("label");
  var input = document.createElement("input");
  var buttonApply = document.createElement("button");
  var buttonShowAll = document.createElement("button");

  settings.append(label);
  settings.append(input);
  settings.append(buttonApply);
  settings.append(buttonShowAll);

  label.innerText = "Filter for class Name:";
  label.style = labelStyle;

  input.style = inputStyle;
  input.id = "classInput";
  input.value = getUrlParam("classFilter");

  buttonApply.innerText = "Apply";
  buttonApply.style = settingStyle;
  buttonApply.onclick = function () {
    changeClassFilter();
  };

  buttonShowAll.innerText = "Show All";
  buttonShowAll.style = settingStyle;
  buttonShowAll.onclick = function () {
    window.location.href = setUrlParam("classFilter", "");
  };

  myArea = document.getElementsByClassName("title")[0].parentElement;
  myArea.prepend(settings);
  myArea.prepend(menuButtons);
}

(function () {
  StopScrolling();
  WaitForClass("title", createButtons);
  WaitForElement("table", OnTableLoaded);
})();