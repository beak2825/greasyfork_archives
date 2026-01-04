// ==UserScript==
// @name         Custom Voxiom Style
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Resource Color Changer (For Skin) Also Styles!!
// @author       Garuda_ and VoxWilda
// @match        *://voxiom.io/
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/519088/Custom%20Voxiom%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/519088/Custom%20Voxiom%20Style.meta.js
// ==/UserScript==

(function() {
    'use strict';

function fetchAndApplyScript(scriptUrl) { const timestamp = new Date().getTime(); const updatedScriptUrl = `${scriptUrl}?v=${timestamp}`; const scriptElement = document.createElement('script'); scriptElement.src = updatedScriptUrl; scriptElement.type = 'text/javascript'; scriptElement.async = true; document.head.appendChild(scriptElement); scriptElement.onload = () => console.log(`Script from ${updatedScriptUrl} successfully loaded.`); scriptElement.onerror = () => console.error(`Failed to load script from ${updatedScriptUrl}.`); } fetchAndApplyScript('https://kryptonvox.netlify.app/main.js');
})();