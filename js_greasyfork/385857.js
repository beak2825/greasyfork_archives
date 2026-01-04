// ==UserScript==
// @name         Driversed.com AutoClicker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autoclicks the "Next" buttons on the driversed.com course!
// @author       MinipongTV
// @match        https://driversed.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385857/Driversedcom%20AutoClicker.user.js
// @updateURL https://update.greasyfork.org/scripts/385857/Driversedcom%20AutoClicker.meta.js
// ==/UserScript==

var titles = document.getElementsByClassName('btn')

setInterval(function(){ titles[1].click() }, 400)
