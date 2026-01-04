// ==UserScript==
// @name        [TORN][DEV] OC 2.0 Helper - remove userSettings
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @grant       none
// @version     1.0
// @author      -
// @description DEV USE ONLY
// @downloadURL https://update.greasyfork.org/scripts/524237/%5BTORN%5D%5BDEV%5D%20OC%2020%20Helper%20-%20remove%20userSettings.user.js
// @updateURL https://update.greasyfork.org/scripts/524237/%5BTORN%5D%5BDEV%5D%20OC%2020%20Helper%20-%20remove%20userSettings.meta.js
// ==/UserScript==

localStorage.removeItem("CMR_OC2_userSettings")
console.log("Deleted usersettings CMR_OC2_userSettings")