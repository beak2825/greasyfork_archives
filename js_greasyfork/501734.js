// ==UserScript==
// @name         Consolidate Worker Information
// @namespace    http://tampermonkey.net/
// @version      07-24-2024
// @description  Adds full name + role + alias for easier copy paste into reports
// @author       Evan Severtson (evasever)
// @match        https://phonetool.amazon.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501734/Consolidate%20Worker%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/501734/Consolidate%20Worker%20Information.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var alias = document.getElementsByClassName('login')[0].firstChild.data;
    var name = document.getElementsByClassName('name')[1].innerText;
    var title = document.getElementsByClassName('optional-wrapper')[2].innerText;
    if (!alias) {
        console.log("Could not find alias");
    }
    if (!name) {
        console.log("Could not find name");
    }
    if (!title) {
        console.log("Could not find title");
    }
    var fullName = title + " " + name + " (" + alias + ')'
    //console.log(fullName)
    var infoPane = document.getElementsByClassName("employee-info")[0]
    //console.log(infoPane)
    var newDiv = document.createElement("div")
    newDiv.innerText = fullName
   // console.log(newDiv)
    infoPane.appendChild(newDiv)
    }
)();