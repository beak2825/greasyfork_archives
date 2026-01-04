// ==UserScript==
// @name         stock ban reasons
// @namespace    http://tampermonkey.net/
// @version      1
// @description  stock ban reasons.
// @author       hacker09
// @match        https://greasyfork.org/en/users/*/ban
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490532/stock%20ban%20reasons.user.js
// @updateURL https://update.greasyfork.org/scripts/490532/stock%20ban%20reasons.meta.js
// ==/UserScript==

document.querySelector("#reason").value = 'Spam';
document.querySelector("#delete_comments").checked = true