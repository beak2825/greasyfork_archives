// ==UserScript==
// @name         Fetch more tasks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fetch more tasks (HiveMicro)
// @author       You
// @match        https://hivemicro.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hivemicro.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443705/Fetch%20more%20tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/443705/Fetch%20more%20tasks.meta.js
// ==/UserScript==

setInterval(function(){
    document.evaluate("//span[text()='Fetch more tasks']", document).iterateNext().click();
},1000);