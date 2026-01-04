// ==UserScript==
// @name         Auto Copy for Google Calendar
// @namespace    https://almedawaterwell.com/
// @version      0.1.0
// @description  Button that selects title, description, and address text from an open Google Calendar event and copies it to the clipboard.
// @author       Luke Pyburn
// @include      https://calendar.google.com/calendar/u/*
// @include      fonts.googleapis.com/css?family=Open+Sans
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/411504/Auto%20Copy%20for%20Google%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/411504/Auto%20Copy%20for%20Google%20Calendar.meta.js
// ==/UserScript==

//Define variables.

var $ = window.jQuery;
var nameCheck;
var addressCheck;
var descriptionCheck;

// Create the Google Calendar auto copy button in a container div. It will be styled and
// positioned with CSS.


var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Copy Entry</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

// Manually set id parameter for description div and address div

document.addEventListener('mouseup', function() {
    $('[class="NI2kfb S4zwaf"').each(function(i, ele) {
            var id = "description";
            $(this).attr('id', id);
        });
    $('[class="JAPzS DX3x9d"').each(function(i, ele) {
            var id = "address";
            $(this).attr('id', id);
        });
});

// Checks to see if the event window exists. If so, the title, description,
// and address are copied to the clipboard and the user is alerted.
// If no event window exists, the user is alerted and prompted to open one.

function ButtonClickAction (zEvent) {
    var checkExist = setInterval(startCheck, 100);
    function startCheck() {
     if ($('#xDtlDlgCt').length) {
      nameCheck = document.getElementById("rAECCd").innerHTML;
      descriptionCheck = document.getElementById("description").innerText;
      addressCheck = document.getElementById("address").innerText;
          console.log("Heyo!");
          console.log(nameCheck);
          console.log(descriptionCheck);
          console.log(addressCheck);
          GM_setClipboard(nameCheck + "\n" + descriptionCheck + "\n" + addressCheck);
          alert("Event details copied to the clipboard. You're welcome Mike.");
     clearInterval(checkExist);
          }
      else {
          alert("You forgot to select an event, Mike.");
          clearInterval(checkExist);
      }
}
};

// Style our newly added elements using CSS.
GM_addStyle ( `
.text {
        font-family:    Helvetica, sans-serif !important;
    }
    #myContainer {
        position:               absolute;
        top:                    18px;
        right:                  460px;
        font-size:              12px;
        background:             #007de3;
        border:                 1px solid #555555;
        margin:                 0px;
        opacity:                0.85;
        z-index:                1100;
        padding:                3px 10px;
        border-radius:          4px;
    }
    #myButton {
        cursor:                 pointer;
        border-radius:          4px;
        align-content:          center;
        font-family:            Open Sans, !important;
        font-style:             normal;
        font-size:              15px;
        background-color:       white;
        color:                  black;
        border:                 1px solid #555555;
    }
    #myContainer p {
        color:                  red;
        background:             white;
        align-content:          center;
    }
` );