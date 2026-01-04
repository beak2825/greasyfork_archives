// ==UserScript==
// @name         Remove startup popup on teleprompter
// @namespace    http://tampermonkey.net/
// @version      2024-08-17
// @description  Remove the popup on every time you view https://cueprompter.com/teleprompter.php
// @author       Lai0602
// @match        https://cueprompter.com/teleprompter.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cueprompter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503976/Remove%20startup%20popup%20on%20teleprompter.user.js
// @updateURL https://update.greasyfork.org/scripts/503976/Remove%20startup%20popup%20on%20teleprompter.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("popup-banner-container").remove();
})