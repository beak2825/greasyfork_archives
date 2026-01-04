// ==UserScript==
// @name         Lichess timed puzzles
// @version      0.1
// @description  Only allow the user to take a specified amount of time when solving a lichess.org puzzle
// @author       Hugo Platzer
// @match        https://lichess.org/training*
// @grant        none
// @inject-into content
// @namespace https://greasyfork.org/users/262509
// @downloadURL https://update.greasyfork.org/scripts/380560/Lichess%20timed%20puzzles.user.js
// @updateURL https://update.greasyfork.org/scripts/380560/Lichess%20timed%20puzzles.meta.js
// ==/UserScript==

var timeout = 30000; // maximum time for solving puzzle (milliseconds)
var interval = 30; // polling interval for threads
// css style for time display
var style = 'z-index:999; position:fixed; top:0; left:5%; font-size:1000%;';

function isSolvingPuzzle() {
  var element = document.querySelector('div.view_solution');
  return (element !== null);
}

function isPuzzleWrong() {
  var element = document.querySelector('div.icon');
  return (element !== null && element.innerHTML === "✗");
}

function makePuzzleFail() {
  var button = document.querySelector('div.view_solution a');
  if (button !== null) {
      button.click();
  }
}

function countDown() {
  var currTimestamp = new Date();
  time = Math.max(timeout - (currTimestamp - timestamp), 0);
}

function checkPuzzleFail() {
  if (time === 0 || isPuzzleWrong()) {
      makePuzzleFail();
  }
}

function updateDisplay() {
  var timeMinutes = Math.floor(time / 60000);
  var timeSeconds = Math.floor((time % 60000) / 1000);
  var timeMillis = time % 1000;
  var timeMinutesStr = "" + timeMinutes;
  var timeSecondsStr;
  if (timeSeconds < 10) {
    timeSecondsStr = "0" + timeSeconds;
  } else {
    timeSecondsStr = "" + timeSeconds;
  }
  var timeMillisStr = "" + Math.floor(timeMillis / 100);
  if (time > 0) {
    displayMinutes.innerHTML = timeMinutesStr;
    displaySeparator.innerHTML = ":";
    displaySeconds.innerHTML = timeSecondsStr;
    displayMillis.innerHTML = timeMillisStr;
  } else {
    displayMinutes.innerHTML = "TIME";
    displaySeparator.innerHTML = "";
    displaySeconds.innerHTML = "";
    displayMillis.innerHTML = "";
  }
  display.style.removeProperty("visibility");
  display.style.removeProperty("color");
  displayMillis.style.visibility = "hidden";
  if (time < 10000) {
    display.style.color = "red";
    displayMillis.style.removeProperty("visibility");
    if (time < 5000) {
      if ((timeMillis % 200) > 100) {
        display.style.visibility = "hidden";
      }
    }
  }
}

function puzzleThread() {
  countDown();
  checkPuzzleFail();
  updateDisplay();
}

function managerThread() {
  if (puzzleThreadId === null) {
    if (isSolvingPuzzle()) {
      timestamp = new Date();
      time = timeout;
      puzzleThreadId = setInterval(puzzleThread, interval);
    }
  } else {
    if (!isSolvingPuzzle()) {
      display.style.removeProperty("visibility"); // could have been hidden when blinking
      clearInterval(puzzleThreadId);
      puzzleThreadId = null;
    }
  }
}

var display = document.createElement('div');
var displayMinutes = document.createElement('span');
var displaySeparator = document.createElement('span');
var displaySeconds = document.createElement('span');
var displayMillis = document.createElement('span');
displayMillis.style['font-size'] = "50%";
display.appendChild(displayMinutes);
display.appendChild(displaySeparator);
display.appendChild(displaySeconds);
display.appendChild(displayMinutes);
display.appendChild(displaySeparator);
display.appendChild(displaySeconds);
display.appendChild(displayMillis);
display.setAttribute('style', style);
document.body.appendChild(display);

var timestamp = null;
var time = null;
var puzzleThreadId = null;

setInterval(managerThread, interval);
