// ==UserScript==
// @name        CubeCraft new report appeals link
// @namespace   Violentmonkey Scripts
// @match       https://reports.cubecraft.net/report/create
// @grant       none
// @version     1.1
// @author      Caliditas
// @description Adds a link to the appeals site to check if the user has been punished already.
// @downloadURL https://update.greasyfork.org/scripts/406772/CubeCraft%20new%20report%20appeals%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/406772/CubeCraft%20new%20report%20appeals%20link.meta.js
// ==/UserScript==

function program() {
  var inputElem = document.getElementById("user-text");
  var outer = inputElem.outerHTML;
  outer = outer.slice(0, outer.indexOf("placeholder")) + "oninput=\"displayInput()\" " + outer.slice(outer.indexOf("placeholder"));
  inputElem.outerHTML = outer;
}

var script = document.createElement("script");
var text = document.createTextNode("function displayInput() {var inputElem = document.getElementById(\"user-text\"); inputElem.parentElement.children[0].outerHTML = \"<a target=\\\"_blank\\\"href=\\\"https://appeals.cubecraft.net/find_appeals/\" + inputElem.value + \"\\\">Username of the person you are reporting:</a>\";}");
script.appendChild(text);
document.body.appendChild(script);

function displayInput() {
  var inputElem = document.getElementById("user-text");
  inputElem.parentElement.children[0].outerHTML = "<a href=\"https://www.w3schools.com\">Username of the person you are reporting:</a>";
}

readyInterval = setInterval(function() {
  var inputElem = document.getElementById("user-text");
  if (!inputElem.outerHTML.includes("displayInput")) {
    program();
    // console.log(inputElem.outerHTML)
  }
}, 500);

window.onload = program;

