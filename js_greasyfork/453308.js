// ==UserScript==
// @name         WildHareTools - copy api key
// @namespace    WildHareToolsCopyApiKey
// @version      1
// @description  Copy API Key from localstorage used by another script
// @author       WildHare
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453308/WildHareTools%20-%20copy%20api%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/453308/WildHareTools%20-%20copy%20api%20key.meta.js
// ==/UserScript==
 
 
let api = localStorage["finally.torn.api"];
localstorage["wildhare.torn.api"] = api;
