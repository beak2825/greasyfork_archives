// ==UserScript==
// @name Directory Checker
// @namespace Violentmonkey Scripts
// @grant none
// @exclude https://www.google.com/search*
// @exclude https://www.bing.com/search*
// @match https://www.google.com/*
// @version 1.5
// @noframes
// @description This will check all the major lawyer directories by searching google. It's pretty accurate and a lot quicker than doing it manually.
// @downloadURL https://update.greasyfork.org/scripts/390977/Directory%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/390977/Directory%20Checker.meta.js
// ==/UserScript==

// Creates Div That Contains Buttons & Input
var inputDiv = document.createElement("div");
inputDiv.style.cssText =
  "position: fixed; padding: 20px 40px;  color: white;background-color: #b5b5b5;top: 0px;right: 0px;display: flex;flex-direction: column;height: 100%; max-width:350px; text-align:center; z-index:99998; font-size:18px;";
inputDiv.innerText =
  "Put the Attorneys Name Here to Check Their Directory Status";
document.body.appendChild(inputDiv);
// Creates Input and Appends It To Above DIV
var attorneyNameInput = document.createElement("input");
attorneyNameInput.setAttribute("type", "text");
attorneyNameInput.id = "input1";
attorneyNameInput.style.position = "relative";
inputDiv.appendChild(attorneyNameInput);
// Creates Directory Names Object To Use To Create Buttons and Event Listeners
var directoryNames = {
  "Directory Names": [
    { name: "avvo", url: "avvo.com", color: "#00447b" },
    { name: "bing", url: "bing.com", color: "#008272" },
    { name: "hg", url: "hg.org", color: "#6d1d24" },
    { name: "martindale", url: "martindale.com", color: "#ee3342" },
    { name: "lawyers.com", url: "lawyers.com", color: "#2a8fbd" },
    { name: "lawyer.com", url: "lawyer.com", color: "#2a8fbd" },
    { name: "leading Lawyers", url: "leadinglawyers.com", color: "#4682b4" },
    { name: "elite Lawyer", url: "elitelawyer.com", color: "black" },
    { name: "lead Counsel", url: "leadcounsel.org", color: "#f58821" },
    { name: "findlaw", url: "findlaw.com", color: "#ff5900" },
    { name: "justia", url: "justia.com", color: "#06357a" },
    { name: "bbb", url: "bbb.org", color: "#005a78" }
  ]
};
// Creates Style Sheet, Appends It to Head, Creates Button and Input Styles
function createStyleSheet() {
  var stylesheet = document.createElement("style");
  var css =
    "button {padding:10px 10px; font-size:14px; color:white; margin: 5px 0px;} #input1 {margin: 10px 0px; height:35px; padding: 10px; text-align:center; color:black;} button:hover {filter: invert(100%);} #lawyer.com {color:#2a8fbd;} #input1:focus {background-color: #d3d3d3}";
  stylesheet.type = "text/css";
  stylesheet.appendChild(document.createTextNode(css));
  document.head.appendChild(stylesheet);
}
// Creates Buttons Inside DIV, References Directory Names Object Properties
function createButtons() {
  for (var i = 0; i < directoryNames["Directory Names"].length; i++) {
    var button = document.createElement("button");
    button.id = directoryNames["Directory Names"][i].url;
    button.className = "motorSport";
    button.innerText =
      "Run" + " " + directoryNames["Directory Names"][i].url + " check";
    button.style.backgroundColor = directoryNames["Directory Names"][i].color;
    inputDiv.appendChild(button);
    button.addEventListener("click", function() {
      createNewTabsURLs(this.id);
    });
  }
  // Creates Click All Button
  var button = document.createElement("button");
  button.id = "clickAll";
  button.style.cssText = "background-color:gray;";
  button.innerText = "Check All Directories";
  button.addEventListener("click", function() {
    clickAllButtons();
  });
  inputDiv.appendChild(button);
  // Creates Remove Button
  var button = document.createElement("button");
  button.id = "removeChecker";
  button.style.cssText = "background-color:yellow; color: black;";
  button.innerText = "Remove Checker From Page";
  button.addEventListener("click", function() {
    removeChecker();
  });
  inputDiv.appendChild(button);
}
// Removes Div From Document
function removeChecker() {
  inputDiv.remove();
}

// After Check All Directories Button is Clicked asks user to confirm, if they Confirm passes index number to function beow
function clickAllButtons() {
  if (
    confirm(
      "This Will Open" +
        " " +
        directoryNames["Directory Names"].length +
        " New Tabs, Are You Sure You Want To Check All Directories?"
    )
  ) {
    for (var i = 0; i < directoryNames["Directory Names"].length; i++) {
      clickAllButtonsTimer(i);
    }
  }
}

var buttonArray = document.getElementsByClassName("motorSport");
// Opens New Tabs at 750 ms intervals
function clickAllButtonsTimer(i) {
  setTimeout(function() {
    buttonArray[i].click();
  }, 750 * i);
}

//Parses Input and create url parameters for click event listener function

function createNewTabsURLs(elementId) {
  var storeStrings = document.createElement("div");
  storeStrings.innerHTML = "";
  var attorneyNameValue = document.getElementById("input1").value;
  var attorneyNameString = String(attorneyNameValue);
  var stringSplit = attorneyNameString.split(" ");
  var url = "https://www.google.com/search?q=site%3A" + elementId;
  if (elementId == "bing.com") {
    url = "https://www.bing.com/search?q=";
  }
  for (var i = 0; i < stringSplit.length; i++) {
    var t = stringSplit[i];
    if (t.length > 2) {
      storeStrings.innerText = storeStrings.innerText + "+" + t;
    }
  }
  if (storeStrings.innerText !== "+") {
    window.open(url + storeStrings.innerText);
  }
  // Add Error Message Div Under Input
  else {
    var input = document.getElementById("input1");
    var errorDiv = document.createElement("div");
    var firstButton = document.getElementById("avvo.com");
    errorDiv.innerText = "Required Field";
    errorDiv.style.cssText =
      "padding:7px; background-color:white; color:red; margin-top: -7px; width:100%; z-index: 99999;";
    inputDiv.insertBefore(errorDiv, firstButton);
    input.focus();
    setTimeout(function() {
      errorDiv.remove();
    }, 3000);
  }
}

//Calls Create Stylesheet and Create Buttons Function

createStyleSheet();
createButtons();