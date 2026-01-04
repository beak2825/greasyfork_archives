// ==UserScript==
// @name         json global variable for JSON Formatter
// @namespace    martin@larsen.dk
// @version      0.1
// @description  Brings back the json global variable for JSON Formatter, https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa
// @author       Martin Larsen
// @match        http*://*/*.json
// @license      GNU GPLv3

// @downloadURL https://update.greasyfork.org/scripts/473171/json%20global%20variable%20for%20JSON%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/473171/json%20global%20variable%20for%20JSON%20Formatter.meta.js
// ==/UserScript==

/* globals json */
json = JSON.parse(document.getElementById("jsonFormatterRaw").querySelector("pre").innerText);
console.log("Type json in the console to inspect and manipulate the JSON object");