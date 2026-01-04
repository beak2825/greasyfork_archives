// ==UserScript==
// @name         MAM Total Torrents Test Online Detection
// @namespace    https://greasyfork.org/en/users/705546-yyyzzz999
// @version      1.2
// @license      MIT
// @description  3/8/23 Shows the total number of torrents on all clients
// @author       yyyzzz999
// @match        https://www.myanonamouse.net/userClientDetails.php
// @icon         https://cdn.myanonamouse.net/imagebucket/164109/gsum.png
// @homepage     https://greasyfork.org/en/users/705546-yyyzzz999
// @grant       GM_setValue
// @grant       GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/461041/MAM%20Total%20Torrents%20Test%20Online%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/461041/MAM%20Total%20Torrents%20Test%20Online%20Detection.meta.js
// ==/UserScript==
/*jshint esversion: 6 */
/*eslint no-multi-spaces:0 */

(function() {
    'use strict';

var DEBUG =1; // Debugging mode on (1) or off (0)
if (DEBUG > 0) console.log("Starting MAM Total Torrents");
// Online Detection Status: https://gist.github.com/gitdagray/f310be81be217750fc9d2b233e2ae70c
let elc = document.querySelector("div[id='mainBody'] div[class='blockFoot']"); //Bar under table
elc.innerHTML = "<span id='status'> - Online - </span>";
createButton(elc, "Check Online", safeReload, "MTT_Buttn");

//createButton(document.querySelectorAll("div[class='blockCon']")[1], "Safe Reload", ReloadIfOnline, "MTT_Buttn");
//elc.innerHTML = elc.innerHTML + "<span id='status'> - Online</span>";
//elc.innerText = " - Online";
const statusDisplay = document.getElementById("status");

// Total All Torrents in table
let client_table = document.querySelector("div[class='blockBodyCon left']");
let links = client_table.getElementsByTagName('a'); // get all the client links
let uns = document.querySelector("#tmUN");
let total = 0;
   if (links.length > 2) {
      for (let i = 2; i < links.length-1; i++) {
	  if (links[i].href.match(/peers/)){
		if (DEBUG > 0) console.log("i= "+ i + " " + links[i].innerText );
		if (!isNaN(links[i].innerText)) total += parseInt(links[i].innerText);
		if (DEBUG > 0) console.log("Total: " + total);
	    }
      }
   }
// Append total to display title, and subtract unsats if displayed in header
let elb = document.querySelector("div[id='mainBody'] div[class='blockHeadCon']"); //Top Bar over table
if (uns != null) { // Added check for Unsats shown in the top menu bar in MAM Main Menu Preferences
    let unsat = parseInt(uns.textContent.split(" ")[0]);
    const net = total - unsat;
    if (DEBUG > 0) console.log("net: " + net);
    elb.innerHTML = elb.innerHTML.replace('</h4>', '') + " | Total Torrents: " + total +
    " - Unsats = " + net + '</h4>' ;
} else { // Unsats not shown
elb.innerHTML = elb.innerHTML.replace('</h4>', '') + " | Total Torrents: " + total + '</h4>' ;
}
if (DEBUG) console.log("Torent Total Portion finished");

// Functions below for online detection

/*  DIDN'T WORK, DIDN'T USE ****************************************
// https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
AbortSignal.timeout ??= function timeout(ms) {
  const ctrl = new AbortController()
  setTimeout(() => ctrl.close(), ms)
  return ctrl.signal
} */

/*
// https://dmitripavlutin.com/timeout-fetch-request/
async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 3000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);
  return response;
} */

/* COULD NOT GET THESE EXAMPLES TO WORK
// https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout
// https://gist.github.com/gitdagray/f310be81be217750fc9d2b233e2ae70c
async function  checkIfOnline() {
if (DEBUG) console.log("requesting fetch...");
  try {

 //     const online = fetch("/pic/anchor-icon.png");
//   const online = fetch("/pic/anchor-icon.png", {cache: 'no-cache', signal: AbortSignal.timeout(5000)});
      const response = await fetch("/pic/anchor-icon.png", { signal: AbortSignal.timeout(5000)});
/*      if (DEBUG) console.log(response.blob());
      if (DEBUG) console.log(response.text());
     if (response.ok) { // check if response worked (no 404 errors etc...) * /

      let data = await response.blob(); // online.json() is another promise
//      const online = fetchWithTimeout("/pic/anchor-icon.png");
      if (DEBUG) console.log("fetch status: " + data.blob()); //.status

/*  } else { * /
      if (DEBUG) console.log('HTTP Status: ' + response.status);

//      if (DEBUG) console.log(await online.json());
//    return online.status >= 200 && online.status < 300; // either true or false
  } catch (err) {
      if (DEBUG) console.error(err);
    return false; // definitely offline
  }
};

function ReloadIfOnline(){
if (DEBUG) console.log("Safe Reload clicked");
if (checkIfOnline()) {
  statusDisplay.textContent = " - Checking - ";
// Reload page here once we figure out how to confirm we're online first!
}
else {statusDisplay.textContent = " - OFFline - ";}
} ****************** END OF STUFF THAT DIDN'T WORK */

const imgurl= "https://www.myanonamouse.net/pic/anchor-icon.png";
 //will this work on cdn instead of www?  That'd be less load on server, but this assures server is up too.

var now = new Date();
var timestmp;
var LOGGING = 0; // "Use var or const instead of let" Bing AI Chat bot bug fix!
    //When LOGGING >0 we have gone offline.
var maxLogLength = 200; // Limit on GM storage use
if (DEBUG) console.log("Beginning Uptime Check");

// Define the height and width of the textarea in lines and characters
var height = 10;
var width = 40;
// Define the list of lognames and logtitle pairs
// This should work for three logs, four if shorter timestamps
var logList = [
    {logname: 'ulog', logtitle: 'Up/Down log'},
    {logname: 'rlog', logtitle: 'Reload log'}
];

// Call the create table function
createTable(height, width, logList);

// Define the function to create a table
function createTable(height, width, logList) {
        // Create a table element
        var table = GM_addElement(document.body, 'table');
        // Set the table style
        table.style.border = '1px solid black';
        table.style.margin = '10px';
        // Create a table header row
        var header = GM_addElement(table, 'tr');
// Loop through the logList array
for (let i = 0; i < logList.length; i++) {
    // Create a table header cell for the current log
    var logtitle = GM_addElement(header, 'th');
    // Set the text content to the current logtitle
    logtitle.textContent = logList[i].logtitle;
}
    // Create a table row for textareas
    var textareaRow = GM_addElement(table, 'tr');
    // Set the colspan attribute to span across three columns
    textareaRow.setAttribute('colspan', '3');
    // Loop through the logList
for (var i = 0; i < logList.length; i++) {
    // Get the logname and logtitle pair
    var log = logList[i];
    // Create a table cell for textarea
    var textareaCell = GM_addElement(textareaRow, 'td');
    // Create a textarea element
    var textArea = GM_addElement(textareaCell, 'textarea');
    // Set the textarea style
    textArea.style.resize = 'both';
    textArea.style.height = height + 'em';
    textArea.style.width = width + 'em';
    // Get the log content from the local storage
    var logContent = GM_getValue(log.logname, '');
    // Remove the quotes from each line
    logContent = logContent.replace(/"/g, '');
    // Replace the comma separating the lines with a line break
    logContent = logContent.replace(/,/g, '\n');
    logContent = logContent.substring(1, logContent.length - 1); // remove [ ], could also use replace(/^\[|\]$/g, '');

	// Set the textarea value
	textArea.value = logContent;
	// Autoscroll to the bottom
    textArea.scrollTop = textArea.scrollHeight;
	// Add a property to store the reference to the text area
	log.textarea = textArea;
    }
}

//function to append lines to the appropriate text area for a log, by log name
function appendLineToLog(logname, logline) {
    for (var i = 0; i < logList.length; i++) {
        var log = logList[i];
        if (log.logname == logname) { //find the matching log object
            var textArea = log.textarea; //get the textarea element
            // Avoid duplicate timestamp someday
            textArea.value += '\n' + new Date().toLocaleString().replace(/,/g, "") + ": " + logline; //append the new line with n character
            textArea.scrollTop = textArea.scrollHeight; //scroll to the bottom
            break; //exit the loop
        }
    }
}
// An alternate approach would be to use the log's index 0,1,...
// Append a new line of text to the first log's text area
// appendLine(logList[0].textarea, "This is a new line of text");

// Define a function that appends a new line of text to a given text area
function appendLine(textArea, newText) {
  // Add a line break and then the new text
  textArea.value += "\n" + newText;

  // Autoscroll to the bottom
  textArea.scrollTop = textArea.scrollHeight;
}

// Write to log and text area at the same time
function logToBoth(logname, message) {
  // Call the logToGM_setValue function to write to the logfile
  logToGM_setValue(logname, message);
  // Call the appendLineToLog function to write to the textarea
  appendLineToLog(logname, message); //Did not include timestamp
}


// *** The next three functions accompish online Internet Up or Down detection with out leaving our target URL!

// Operates on boolian status results from checkServer callback
// This is where we respond to online status changes
function ReloadIfOnline(status){
now = new Date();
timestmp = now.toLocaleString().replace(/,/g, "");
//if (DEBUG) console.log(timestmp + ": Safe Reload clicked"); // Wrong timestamp as delayed by callback v.8
if (status) { statusDisplay.textContent = " - ONline - ";
    if (DEBUG) {console.log("Reload code run at: " + now.toLocaleString() );
              if (LOGGING) console.log(timestmp + ": Internet back up");
               }
    if (LOGGING) { logToBoth("ulog"," Back up" );
                  //logToGM_setValue("ulog"," Back up" ); Removed v1.2
                  //appendLine(logList[0].textarea, timestmp + " Back up");
                  LOGGING = 1;
                 }
// reload code to go here eventually...
logToBoth("rlog"," Reload Requested" );
}
else { statusDisplay.textContent = " - OFFline - ";
   if (DEBUG) {console.log(timestmp + ": Recheck online timer scheduled");
               if (LOGGING) console.log(timestmp + ": Internet offline");
              }
   if (!LOGGING) { now = new Date(); //v.9
       logToBoth("ulog"," Offline");
   }
      LOGGING = 1; // This didn't work until I changed let to var in declaring this boolean
      setTimeout(safeReload, 30000); // Creates a loop checking for restored connection every 30 seconds
    }
//if (DEBUG) console.log("GM_listValues(): " + GM_listValues());
}

// Called by test button, or by script when it's time to check a page again for something to do.
// Actual page reload would be done in the ReloadIfOnline callback function
function safeReload(){
now = new Date();
timestmp = now.toLocaleString().replace(/,/g, "");
if (DEBUG) console.log(timestmp + ": Safe Reload clicked");
    // Timestamp debug log moved here!  v.9
   // logToBoth("rlog"," Offline");
checkServer(ReloadIfOnline);
}

// https://stackoverflow.com/questions/5224197/javascript-check-if-server-is-online
function checkServer(callback) {
    statusDisplay.textContent = " - Checking - ";
    let img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = imgurl + '?r=' + Math.random(); /* avoids caching */
}

function logToGM_setValue(logname, message) {
  // Get the current log array from GM_setValue or create a new one
  var log = JSON.parse(GM_getValue(logname,null)) || [];
//if (DEBUG > 0) console.log("log: " + log);
  // Push the message to the log array with a timestamp
let str = new Date().toLocaleString().replace(/,/g, "") + ": " + message;
  log.push(str);
if (DEBUG > 0) console.log(logname + ": " + str);
  // Trim the log array if it exceeds maxLogLength lines
  if (log.length > maxLogLength) {
    log = log.slice(-maxLogLength);
  }
if (DEBUG > 0) console.log("logToGM log.length: " + log.length);

  // Save the log array back to GM_setValue
  GM_setValue(logname, JSON.stringify(log));
if (DEBUG) {console.log("GM_listValues(): " + GM_listValues());
            console.log(JSON.stringify(log));
           }
}

/*
// Generated by https://www.bing.com/search?q=bing+ai
function logToLocalStorage(logname, message) { // v.9 add logname arg
  // Get the current log array from local storage or create a new one
  var log = JSON.parse(localStorage.getItem(logname)) || [];

  // Push the message to the log array with a timestamp
  log.push(new Date().toLocaleString().replace(/,/g, "") + ": " + message); // Changed format to toLocaleString .8

  // Trim the log array if it exceeds 200 lines
  if (log.length > 200) {
    log = log.slice(-200);
  }

  // Save the log array back to local storage
  localStorage.setItem(logname, JSON.stringify(log));
}
*/

/* // View localstorage log in console with:

// Get the log array from local storage

var log = JSON.parse(localStorage.getItem("ulog"));
// Loop through the log array and print each message
for (var i = 0; i < log.length; i++) {
  console.log(log[i]);
}

Example output from original code:
2023-03-05T08:54:19.934Z - Internet offline at: 3/5/2023, 2:54:19 AM
2023-03-05T09:08:28.064Z - Internet back up at: 3/5/2023, 3:08:28 AM
*/

// Similar to https://stackoverflow.com/questions/45056949/adding-button-to-specific-div
function createButton(elemnt, value, func, id, color) {
  var button = document.createElement("input");
  button.type = "button";
  if (id) button.id = id; //won't work for falsy ids like 0 or NaN
  button.value = value; //button label or in some cases set name
  color = color || "White";
  button.style.backgroundColor = color;
  button.style.borderRadius = "10%";
  button.onclick = func;
  elemnt.appendChild(button);
}

})();