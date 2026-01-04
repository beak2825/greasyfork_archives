// ==UserScript==
// @name         Remove Kahoot Log In Pop Up
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide kahoot log in pop up
// @author       doggolive
// @match        *://play.kahoot.it/*
// @exclude      *://play.kahoot.it/v2/assets/*
// @icon        
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/493101/Remove%20Kahoot%20Log%20In%20Pop%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/493101/Remove%20Kahoot%20Log%20In%20Pop%20Up.meta.js
// ==/UserScript==

// ---------------------------------------------------------
// script settings
//-----------------------------------------------------------
// check for log in screen
window.parent.kahootloginscreen = true
// 

setInterval(() => {
    var kahootloginscreen = document.querySelector("#root > div.app__AppWrapper-sc-8krux4-0.hcCgdU > div > div:nth-child(3) > div")
    if (kahootloginscreen && window.parent.kahootloginscreen === true) {kahootloginscreen.remove();console.log("Kahoot Log In Screen Hidden")}
})