// ==UserScript==
// @name         3dmm.com Flag Restorer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Oh Canada!
// @author       Plopilpy
// @match        https://*.3dmm.com/*
// @icon         https://*.3dmm.com/favicon_3dmmcom_logo.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479200/3dmmcom%20Flag%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/479200/3dmmcom%20Flag%20Restorer.meta.js
// ==/UserScript==
var flags = document.querySelectorAll('*[id*="post"] td.alt2'), i;
for (i = 0; i < flags.length; ++i) { flags[i].innerHTML = flags[i].innerHTML.replace('<!--', '').replace('-->', ''); }