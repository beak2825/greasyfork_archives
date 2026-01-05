// ==UserScript==
// @name            Pinned Threads Remover for the E-Hentai Forums
// @description     Hide Pinned Threads in the E-Hentai Forums
// @include         http://forums.e-hentai.org/index.php?*
// @version 0.0.1.20150415072819
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/5458/Pinned%20Threads%20Remover%20for%20the%20E-Hentai%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/5458/Pinned%20Threads%20Remover%20for%20the%20E-Hentai%20Forums.meta.js
// ==/UserScript==

var divs = document.querySelectorAll('tr>td.row1>div')
if(divs) {
    for(var i=divs.length-1; i>=0; i--) { if(/Pinned:/.test(divs[i].textContent)) { divs[i].parentNode.parentNode.style.display = 'none' } }
}

