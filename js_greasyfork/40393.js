// ==UserScript==
// @name         ShellShockADBlocker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Ad Blocker
// @author       Th3K1n9
// @match        https://shellshock.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40393/ShellShockADBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/40393/ShellShockADBlocker.meta.js
// ==/UserScript==

//removes stuff
document.getElementById("shellshock-io_300x250").remove();

document.getElementById("preroll").remove();

var aipGameContainer = document.getElementById('aipGameContainer');
     aipGameContainer.style = " ";



