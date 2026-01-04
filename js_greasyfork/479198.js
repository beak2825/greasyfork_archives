// ==UserScript==
// @name         Funny Bones Upload Fixer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Funny Bones!
// @author       Plopilpy
// @match        https://*.3dmm.com/*
// @icon         https://*.3dmm.com/favicon_3dmmcom_logo.ico
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/479198/Funny%20Bones%20Upload%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/479198/Funny%20Bones%20Upload%20Fixer.meta.js
// ==/UserScript==
/* eslint-env jquery */

for (let i = 0; $("video[src*='backblaze']")[i] !== undefined; i++) {
    $("a[href*='backblaze']")[i].href = $("a[href*='backblaze']")[i].toString().replace("backblaze.com", "backblazeb2.com")
    $("a[href*='backblaze']")[i].innerHTML = $("a[href*='backblaze']")[i].toString().replace("backblaze.com", "backblazeb2.com")
    $("video[src*='backblaze']")[i].src = $("video[src*='backblaze']")[i].src.toString().replace("backblaze.com", "backblazeb2.com")
}