// ==UserScript==
// @name        Liveworksheets solver 2025
// @namespace   Violentmonkey Scripts
// @match       *://*.liveworksheets.com/*
// @grant       GM_registerMenuCommand
// @grant       GM.xmlHttpRequest
// @run-at       document-idle
// @version     1.0
// @author      -
// @namespace   https://github.com/nokeya
// @license MIT
// @description Gives answers

// @downloadURL https://update.greasyfork.org/scripts/536140/Liveworksheets%20solver%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/536140/Liveworksheets%20solver%202025.meta.js
// ==/UserScript==

(function () {
  'use strict';

	GM_registerMenuCommand("start", () => start());

	function start()
	{



var font_size = "250%"
//https://www.w3schools.com/cssref/pr_font_font-size.php
var pbutton = document.getElementById("worksheet-preview-elements")
var pbuttons = pbutton.children


var config_script = ""
var config_json = ""
var localst = ""
var localjs = ""
var is_workbook = (document.location.pathname.match("/student-workbook/") != null)
///localStorage.getItem("worksheetContent")
var scripts = document.getElementsByTagName("script")
for (var i = 0; i < scripts.length; i++) {
    if (scripts[i].attributes[1] != undefined) {
        if (scripts[i].attributes[1].nodeValue == "drupal-settings-json") {
            console.log(scripts[i].attributes[1].nodeValue == "drupal-settings-json")
            config_script = scripts[i]
        }
    }
}
if (is_workbook) {
    localst = localStorage.getItem("worksheetContent")

    localjs = JSON.parse(localst)
} else {
    localst = config_script
    localjs = JSON.parse(JSON.parse(config_script.innerText).worksheet.json)
}
for (var i = 0; i < pbuttons.length; i++) {
    var matched = ""
    for (var z = 0; z < localjs.length; z++)

        //console.warn(pbuttons[i].style.left.split("px")[0])
        if ((pbuttons[i].style.left.split("px")[0] == localjs[z][2])) {
            // console.log("x")
            if (pbuttons[i].style.top.split("px")[0] == localjs[z][1]) {
                // console.log("y")
                console.error("i:" + i + " z:" + z + "   " + localjs[z][0])
                if (pbuttons[i].attributes.contenteditable != undefined) {
                    var parsed_text = localjs[z][0].replaceAll("$", "'")
                    if (parsed_text.match("/") == "/") {
                        pbuttons[i].innerText = parsed_text.split("/")[Math.round(Math.random())]
                        pbuttons[i].innerHTML = parsed_text.split("/")[Math.round(Math.random())]
                        pbuttons[i].textContent = parsed_text.split("/")[Math.round(Math.random())]
                    } else {
                        pbuttons[i].innerText = parsed_text
                        pbuttons[i].innerHTML = parsed_text
                        pbuttons[i].textContent = parsed_text
                    }


                }
                else if (pbuttons[i].className == "worksheet-select-div worksheet-clickable-element") {
                    console.error("button")
                    if (localjs[z][0] == "select:yes") {
                        pbuttons[i].click()
                        pbuttons[i].className = "worksheet-select-div worksheet-clickable-element worksheet-select-div-selected"
                    } else if (localjs[z][0] == "select:no") {
                        pbuttons[i].click()
                        pbuttons[i].className = "worksheet-select-div worksheet-clickable-element"
                    }
                }
                else if (localjs[z][0].match("join:") == "join:") {
                    pbuttons[i].innerHTML = "<h1 style='  background-color: lightblue;text-align:center;font-size: "+font_size+";'>" + localjs[z][0].split("join:")[1] + "</h1>"
                }
                              else if (localjs[z][0].match("drag:") == "drag:") {
                    pbuttons[i].innerHTML = "<h1 style='  background-color: lightblue;text-align:center;font-size: "+font_size+";'>" + localjs[z][0].split("drag:")[1] + "</h1>"
                }
                              else if (localjs[z][0].match("drop:") == "drop:") {
                    pbuttons[i].innerHTML = "<h1 style='  background-color: lightblue;text-align:center;font-size: "+font_size+";'>" + localjs[z][0].split("drop:")[1] + "</h1>"
                }
                //localjs[z][5] = localjs[z][0]
            }

        }
}
console.log(localjs)
//localStorage.setItem("worksheetContent",JSON.stringify(localjs))

  }

}) ();