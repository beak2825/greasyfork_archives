// ==UserScript==
// @name         Show all localStorage keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Just to see localstorage data on android
// @author       Yes
// @match        *://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395340/Show%20all%20localStorage%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/395340/Show%20all%20localStorage%20keys.meta.js
// ==/UserScript==

let frame = document.createElement("div")
frame.style = "z-index: 999; background: white; width: 100%; height: 100%; position: absolute; top: 0; left: 0; color: white; background: black"
frame.innerText = JSON.stringify(localStorage)
document.body.appendChild(frame)