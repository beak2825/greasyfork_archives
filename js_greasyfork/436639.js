// ==UserScript==
// @name         Finish AutoComplete
// @namespace    http://tampermonkey.net/
// @version      1
// @description  fills out the finish task info
// @author       You
// @match        https://intranet.netfor.net/modules.php?name=Tickets&file=autoclose*
// @match        https://intranet.netfor.com/modules.php?name=Tickets&file=autoclose*
// @icon         https://www.google.com/s2/favicons?domain=netfor.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436639/Finish%20AutoComplete.user.js
// @updateURL https://update.greasyfork.org/scripts/436639/Finish%20AutoComplete.meta.js
// ==/UserScript==

document.getElementById('Cause.value').value = 'cc';
document.getElementById('Cause.display').value = 'cc';

document.getElementById('CallStatus.display').value = 'Resolved with Service Desk KEDB';
document.getElementById('CallStatus.value').value = 'Closed: Resolved with Service Desk KEDB';