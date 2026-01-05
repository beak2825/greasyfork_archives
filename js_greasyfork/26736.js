// ==UserScript==
// @name         Wanikani Note Attention Grabber
// @namespace    mempo
// @version      1.0
// @description  Give extra attention to notes
// @author       Mempo
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26736/Wanikani%20Note%20Attention%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/26736/Wanikani%20Note%20Attention%20Grabber.meta.js
// ==/UserScript==

var css = ".WKNN-reading, .WKNN-meaning { "+
                 "    border: 2px solid red;"+
                 "    padding: 10px; " +
                 "}";


(function() {
    'use strict';

    addStyle(css);
    $("#option-item-info").on("click", setTimer);
    $(document).on("keydown.reviewScreen", function (event) {
        switch (event.keyCode) {
            case 70: setTimer(); //f
        }
     });
})();

function setTimer(){
    setTimeout(checkNote,300);
}

function checkNote(){
    if($.jStorage.get("questionType") === "meaning" && $(".note-meaning").html() !== "Click to add note"){
        $(".note-meaning").addClass("WKNN-meaning");
    }else if($.jStorage.get("questionType") === "reading" && $(".note-reading").html() !== "Click to add note"){
        $(".note-reading").addClass("WKNN-reading");
    }
}

function addStyle(aCss) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (head) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}