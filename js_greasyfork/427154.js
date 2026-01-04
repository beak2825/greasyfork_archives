// ==UserScript==
// @name MAM Auto Buy BP
// @namespace zzz
// @author yyyzzz999
// @description 3/18/23 Watches bonus points and spends them before hitting 99,999 point limit
// @match https://www.myanonamouse.net/store.php
// @icon  https://cdn.myanonamouse.net/imagebucket/164109/FixStore.png
// @version 1.3
// @run-at document-end
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @grant window.onurlchange
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addElement
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/427154/MAM%20Auto%20Buy%20BP.user.js
// @updateURL https://update.greasyfork.org/scripts/427154/MAM%20Auto%20Buy%20BP.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

// This should have been named Auto SPEND BP, or BUY W/BP, but I'm not changing it for consistency...
// Offline detection added 3/8/23 for more reliable reloads, and a log table for progress history

// Function from https://stackoverflow.com/questions/41296950/
const milliseconds = (h, m, s) => ((h*60*60+m*60+s)*1000);
//This function will now be called in ReloadIfOnline after callback verifies online status
function auto_reload() {
	window.location = 'https://www.myanonamouse.net/store.php';
}

var DEBUG =2; // Debugging mode on (1) or off (0)
var Btn = 3; //Default 10,000 points V.6

if (DEBUG) console.log("MAM Auto Buy BP v1.2"); // Just making sure we're watching the right console window
// Check for "504 Gateway Time-out" and similar errors from CDN or MAM. v1.2
const h1 = document.querySelector('h1');
/* Replaced with code to handle other errors v1.2
    if (h1 && h1.textContent.startsWith('504')) {
    logToBoth("ulog"," " + h1.textContent);
    safeReload();
} */

// Needed elements from UP/Down check for safeReload
var elc = document.querySelector("div[id='mainBody'] div[class='blockFoot']"); //Bar under table
if (!elc) { // this is needed on 504 Gateway Time-out pages!!
  elc = document.createElement("div");
  elc.id = "mainBody";
  elc.className = "blockFoot";
  elc.textContent = " - ";
  document.body.appendChild(elc);
}
var span = document.createElement("span");
span.id = "status";
span.textContent = " - Online - ";
elc.innerHTML = "";
elc.appendChild(span);
const statusDisplay = document.getElementById("status");
//createButton.bind(null, elc)("Reload if STILL Online", safeReload, "MTT_Buttn");
 createButton(elc, "Reload if STILL Online", safeReload, "MTT_Buttn");
// error: Ignoring get or set of property that has [LenientThis] because the “this” object is incorrect.

const imgurl= "https://www.myanonamouse.net/pic/anchor-icon.png";
 //will this work on cdn instead of www?  That'd be less load on server, but this assures server is up too.
var timestmp;
var LOGGING = 0; // "Use var or const instead of let" Bing AI Chat bot bug fix!
    //When LOGGING >0 we have gone offline.
var maxLogLength = 200; // Limit on GM storage use

// Define the height and width of the textarea in lines and characters
var height = 10;
var width = 40;
// Define the list of lognames and logtitle pairs
// This should work for three logs, four if shorter timestamps
var logList = [
    {logname: 'ulog', logtitle: 'Up/Down MAM Reachable log'},
    {logname: 'rlog', logtitle: 'Reload log'}
];
// May add a third log of purchases

// Call the create table function
createTable(height, width, logList);

if (h1) {
  const estr = h1.textContent.substring(0, 3); //String with error code
  if (estr === '400' || estr === '401' || estr === '403' || estr === '404' || estr === '500' || estr === '503' || estr === '504') {

    logToGM_setValue("ulog", h1.textContent);
    safeReload();
  }
}
// The following might fail or return null if correct page does not load
var headr = document.querySelector("div[class='blockHeadCon']"); //v.75 moved to 1st header
    //if (DEBUG) console.log(headr.innerHTML);
if (!headr) {
    logToBoth("ulog"," Table Header Not Found");
    headr = document.createElement("div"); // is this really necessary?
    headr.className = "blockHeadCon";
    document.body.appendChild(headr);
    safeReload();
}

var now = new Date();
var day = now.getUTCDay(); //Sun 0 .. Sat 6
//if (DEBUG) console.log(headr.innerHTML);
headr.innerText = "Loaded at: " + now.toUTCString();
if (DEBUG) console.log(headr.innerHTML);

//https://stackoverflow.com/questions/629671/how-can-i-intercept-xmlhttprequests-from-a-greasemonkey-script
// Spy on MAM AJAX request/response to get hidden ratio and seedbonus updates not posted in page header
// This works in Basilisk Scratchpad, Tampermonkey w/Firefox, but not Greasmonkey 3.9 in Basilisk

// This next block Updates Ratio and Bonus Points in Store header after purchase
let ResultObj; // I scoped this out of the function in case I want to reference it later in other contexts
(function(open) {
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("readystatechange", function() {
        if (DEBUG >1) console.log(this.readyState);
		if (DEBUG >1) console.log(this.responseText);
			if (this.readyState == 4 && this.status == 200) {
				ResultObj = JSON.parse(this.responseText);
				if (DEBUG) console.log("New Ratio: " + ResultObj.ratio);
				if (DEBUG) console.log("Seedbonus: " + ResultObj.seedbonus);
				if( ResultObj.ratio) {document.getElementById("tmR").textContent=ResultObj.ratio.toFixed(6);}
				if( ResultObj.seedbonus) document.getElementById("tmBP").textContent="Bonus: " + Math.floor(ResultObj.seedbonus);
			// The above two lines of code are similar to code I'd like to see in the MAM site.js.
			}
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

// Specify page reload time in hours, minutes, and seconds
const reloadTime = milliseconds(1, 2, 0); // Never set below 1 minute! <--**********
// Do not run more often than several times a day except when debugging!
// We don't want to put a heavy load on the server

// https://davidwalsh.name/automatically-refresh-page-javascript-meta-tags
// Set page to reload every reloadTime

now.setMilliseconds(now.getMilliseconds() + reloadTime);
headr.innerText += " -> Reloading at: " + now.toUTCString() + " or locally " + now.toLocaleString();



// This line reloaded the page roughly reloadTime + 10 seconds after first purchase needed, and the script starts all over
setTimeout(safeReload,reloadTime); // Works in Tampermonkey etc.

// Get the mouse Bonus Points
var bp = document.getElementById("tmBP").textContent.split(":")[1].trim(); //Did not update with changes before site fix
//let bp = document.getElementById("currentBonusPoints").textContent
if (DEBUG) console.log("l 85, Bonus Points: " + bp);

// Click on "Buy upload credit" to show bonus button row
//document.getElementById("uploadCredit").click(); //Why doesn't this work?
// Just use the layout that always shows buttons for now - How to detect which layout we're in?

var buttons = document.getElementsByTagName('button');
var bl = buttons.length;
if (DEBUG) console.log("We start with " + bl + " buttons on this page.");

// Spend bonus points if we have enough  (Don't set less than you spend + a reserve)
/*
Button Points Credit
  0      500  1 GB
  1     1250  2.5 GB
  2     2500  5 GB
  3    10000  20 GB
  4    50000  100 GB
  5      ALL  Max GB
  10      FL wedge worth more than high ratio!

*/

// Spend Bonus Points on upload credit, checked every reload
if(bp > 78000){ // Keep some points for vault, gifts, and VIP <--**********  This was originally around 2000 to 10,000
// 4 for 100Gb upload credit, at a certain point 10 for FL wedge bp>78000 more during signups!
    if (day == 3 || day==6) { //Keep more points in reseve during new user sign up days
        Btn = 3;
    } else if (day < 2) {
        Btn = 10; // Get FL Sunday & Monday
    } else { // Buy Upload credit these days
        Btn = 4;
    }
// NO WORK IN USERSCRIPT document.getElementsByTagName('button')[0].click(); // Number in [ ] selects button by above table
//    buttons[0].dispatchEvent(evt);  //THIS NO WORK EITHER!
// Problem was jQuery functions not yet loaded when DOM complete
    setTimeout(function(){ // This finally made the 1st button click work!
 // https://stackoverflow.com/questions/41088878/button-click-doesnt-work-in-greasemonkey-tampermonkey-script-already-tried-sta
//       if ((Btn==3 && Math.random()<.12 ) || (Btn==4)) { //V.7 randomize the smaller purchase to look less automated
	buttons[Btn].dispatchEvent(new MouseEvent('click'));
        // Add a spend log here?  v1.1?
//  buttons[0].click(); //Test to see if all this mouseEvent crap was over kill?  FAILED TO CliCK
if (DEBUG) console.log("clicked button ",Btn); //Was spending 10,000bp every 4 hours for bp income about 2500/hour
//    }
	}, 1000); // Wait 1 second for site.js jQuery to load and finish running

    setTimeout(function(){
    buttons = document.getElementsByTagName('button');
	bl = buttons.length;
	if (DEBUG) console.log("Then " + bl + " buttons on this page.");
	buttons[bl-1].style.color="SpringGreen"; // Color our new buttons for identification
	buttons[bl-2].style.color="Blue"; //OK Button 15 on dialog
	buttons[bl-3].style.color="Purple"; //
	}, 2500 ); // Allow 1.5 seconds for dialog box to appear with OK button
	setTimeout(function(){
    buttons = document.getElementsByTagName('button');
	bl = buttons.length;
	if (DEBUG) console.log("And now " + bl + " buttons on this page.");
  	buttons[buttons.length-2].dispatchEvent(new MouseEvent('click')); //Click the OK Button on pop up dialog
	}, 15000); // 10 seconds after coloring, click button.  If page changes in the future, color will provide clue. 7500
}
//  Color the buttons just to show script is active on this page, and help identify each button's matching number
//setTimeout(function(){
document.getElementsByTagName('button')[0].style.backgroundColor="SpringGreen";
document.getElementsByTagName('button')[1].style.backgroundColor="Yellow";
document.getElementsByTagName('button')[2].style.backgroundColor="Orange";
document.getElementsByTagName('button')[3].style.backgroundColor="Red";
document.getElementsByTagName('button')[4].style.backgroundColor="Purple";
document.getElementsByTagName('button')[5].style.backgroundColor="Blue";
document.getElementsByTagName('button')[6].style.backgroundColor="Pink";
document.getElementsByTagName('button')[7].style.backgroundColor="Indigo";
document.getElementsByTagName('button')[8].style.backgroundColor="Violet";
document.getElementsByTagName('button')[9].style.backgroundColor="Aqua";
document.getElementsByTagName('button')[10].style.backgroundColor="Green";
document.getElementsByTagName('button')[11].style.backgroundColor="Brown";
document.getElementsByTagName('button')[12].style.backgroundColor="CornflowerBlue";
document.getElementsByTagName('button')[13].style.backgroundColor="DarkMagenta";
//}, 1500); // Note this happens before the spend block, not in the order of source code

// *** New Code to prevent death by internet outage, and run and outage logs ***
if (DEBUG) console.log("Beginning Online Check section");



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
    for (let i = 0; i < logList.length; i++) {
        let log = logList[i];
        if (log.logname == logname) { //find the matching log object
            let textArea = log.textarea; //get the textarea element
            // Avoid duplicate timestamp someday
            let sep = ": "; if (logline.length == 0) sep =""; //skip separator if no message
            if (DEBUG) console.log("sep: " + sep);
            textArea.value += '\n' + new Date().toLocaleString().replace(/,/g, "") + sep + logline; //append the new line with n character
            textArea.scrollTop = textArea.scrollHeight; //scroll to the bottom
            break; //exit the loop
        }
    }
}
// An alternate approach would be to use the log's index 0,1,...
// Append a new line of text to the first log's text area
// appendLine(logList[0].textarea, "This is a new line of text");

// Appends a new line of text to a given text area
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


// *** The next three functions accompish online Internet Up or Down detection without leaving our target URL!

// Operates on boolian status results from checkServer callback
// **** This is where we respond to online status changes, and now reload if safe ****
function ReloadIfOnline(status){
now = new Date();
timestmp = now.toLocaleString().replace(/,/g, "");
//if (DEBUG) console.log(timestmp + ": Safe Reload clicked"); // Wrong timestamp as delayed by callback v.8
if (status) { statusDisplay.textContent = " - ONline - ";
    if (DEBUG) {console.log("Reload code run at: " + now.toLocaleString() );
              if (LOGGING) console.log(timestmp + ": Internet back up");
               }
    if (LOGGING) { logToBoth("ulog"," Up" );
                  //logToGM_setValue("ulog"," Back up" ); Removed v1.2
                  //appendLine(logList[0].textarea, timestmp + " Back up");
                  LOGGING = 1;
                 }
logToBoth("rlog","" );
// reload code goes here:
 auto_reload();
}
else { statusDisplay.textContent = " - OFFline - ";
   if (DEBUG) {console.log(timestmp + ": Recheck online timer scheduled");
               if (LOGGING) console.log(timestmp + ": Internet offline");
              }
   if (!LOGGING) { now = new Date(); //v.9
       logToBoth("ulog"," Down");
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
     //   if (DEBUG > 1) debugger;
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
