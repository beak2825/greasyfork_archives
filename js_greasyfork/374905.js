// ==UserScript==
// @name         Weight Search Autoselector
// @version      1.1
// @description  Automatically focus cursor on weight box in edit mode
// @match        https://owaisashfaq.quickbase.com/db/bixmzbcjn?a=er*
// @grant        none
// @namespace https://greasyfork.org/users/228706
// @downloadURL https://update.greasyfork.org/scripts/374905/Weight%20Search%20Autoselector.user.js
// @updateURL https://update.greasyfork.org/scripts/374905/Weight%20Search%20Autoselector.meta.js
// ==/UserScript==

setTimeout(selectWeight,2000)

function selectWeight (){
document.getElementById("_fid_124").focus();
document.getElementById("_fid_124").select();
}
