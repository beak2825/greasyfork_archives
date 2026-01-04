// ==UserScript==
// @name         Acwing Clean
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.acwing.com/*
// @icon         https://www.google.com/s2/favicons?domain=acwing.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/438600/Acwing%20Clean.user.js
// @updateURL https://update.greasyfork.org/scripts/438600/Acwing%20Clean.meta.js
// ==/UserScript==

(function() {
    const node = document.createElement('style')
		node.innerText = `.bullet-screen { display: none !important}`
		document.head.appendChild(node)

    const modal = document.querySelector('#modal-warning')
    const ad = document.querySelector('[id$=activity]')

    ad && ad.remove()
    modal && modal.remove()
})();