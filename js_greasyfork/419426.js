// ==UserScript==
// @name         rOwOfind
// @namespace    http://rofind.xyz
// @match        https://rofind.xyz
// @version      42
// @author       foxxo
// @grant        none
// @run-at       document-start
// @description  Bypass the 15 second timer on https://rofind.xyz
// @downloadURL https://update.greasyfork.org/scripts/419426/rOwOfind.user.js
// @updateURL https://update.greasyfork.org/scripts/419426/rOwOfind.meta.js
// ==/UserScript==

fetch('https://rofind.xyz/api/groupapi/').then(function(response){return response.text()}).then(function(myJson){window.location.replace("https://roblox.com/groups/" + myJson.trim())})