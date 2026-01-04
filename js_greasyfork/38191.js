// ==UserScript==
// @name         Duolingo - add keyboard support to kana/kanji exercises
// @namespace    https://github.com/ciekawylogin/
// @version      0.3.0
// @description  This script adds keyboard control to kana/kanji exercises, as requested here: https://www.reddit.com/r/duolingo/comments/7v9veq/duolingo_please_do_this_part_keyboard_compatible/
// @author       Michał Artur Krawczak (ciekawylogin@github)
// @match        https://www.duolingo.com/*
// @downloadURL https://update.greasyfork.org/scripts/38191/Duolingo%20-%20add%20keyboard%20support%20to%20kanakanji%20exercises.user.js
// @updateURL https://update.greasyfork.org/scripts/38191/Duolingo%20-%20add%20keyboard%20support%20to%20kanakanji%20exercises.meta.js
// ==/UserScript==



function appendNum(elem, num) {
	var para = document.createElement("p");
	var node = document.createTextNode(num);
        para.className = "mk-keycode";
	para.appendChild(node);
	para.style.cssText = numberStyle;
	elem.style.cssText = buttonStyle;
	elem.appendChild(para);
}

var keys = "1234567890qwertyuiopasdfghjklzxcvbnm[]"

function addNumbers() {
        var buttons = Array.from(document.getElementsByClassName("iNLw3"))

	for(i in buttons) {
	    button = buttons[i];
	    appendNum(button, keys[i])
	}
}

numberStyle = "position: absolute;top: 1px;right: 1px;font-size: 7pt;color: gray;padding: 1px 3px;border: 1px solid #ccc;"

buttonStyle = "position:relative;" 

function addEvent(element, eventName, callback) {
    if (element.addEventListener) {
        element.addEventListener(eventName, callback, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + eventName, callback);
    } else {
        element["on" + eventName] = callback;
    }
}

addEvent(document, "keypress", function (e) {
    e = e || window.event;
    key = e.keyCode || e.charCode;
    var idx = keys.indexOf(String.fromCharCode((96 <= key && key <= 105)? key-48 : key).toLowerCase());
    var buttons = Array.from(document.getElementsByClassName("iNLw3"))

    buttons[idx].click();
});

function addNumbersIfNotPresent() {
  var buttonsWithoutCodes = Array.from(document.getElementsByClassName("iNLw3"))
  var buttonsWithCodes = Array.from(document.getElementsByClassName("mk-keycode"))
  if(buttonsWithoutCodes.length > 0 && buttonsWithCodes.length == 0) { 
    addNumbers();
  } 
}

setInterval(addNumbersIfNotPresent, 250);