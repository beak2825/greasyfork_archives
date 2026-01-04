// ==UserScript==
// @name         Genius - Bring Back Old Song Page
// @namespace    https://github.com/Voxalice/
// @version      3
// @license      MIT
// @description  Redirects to old song page
// @author       Voxalice
// @match        https://genius.com/*
// @icon         https://genius.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473140/Genius%20-%20Bring%20Back%20Old%20Song%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/473140/Genius%20-%20Bring%20Back%20Old%20Song%20Page.meta.js
// ==/UserScript==
document.body.innerText.indexOf("We need your help to continue improving contributor features")>9&&(window.location.href+="?bagon=1");