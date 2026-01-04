// ==UserScript==
// @name         Sandbox Auto Level Up
// @namespace    http://tampermonkey.net/
// @version      6969.6969
// @description  level up without pressing K
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512148/Sandbox%20Auto%20Level%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/512148/Sandbox%20Auto%20Level%20Up.meta.js
// ==/UserScript==

setInterval(()=>{if(input.doesHaveTank() && __common__.active_gamemode === "sandbox") document.querySelector("#sandbox-max-level").click()}, 100);