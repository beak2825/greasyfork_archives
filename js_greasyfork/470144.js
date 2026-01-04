// ==UserScript==
// @name         TorrentBD - Online User Count
// @namespace    https://www.torrentbd.com/
// @version      0.1
// @description  See how many users are online on TorrentBD in the "Online Users" section 
// @author       ItsTHEAvro
// @match        https://www.torrentbd.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentbd.com
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/470144/TorrentBD%20-%20Online%20User%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/470144/TorrentBD%20-%20Online%20User%20Count.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const h6Elements = document.querySelectorAll('h6.left');
    let targetElement = null;
    for (let i = 0; i < h6Elements.length; i++) {
        const h6Element = h6Elements[i];
        if (h6Element.textContent === 'Online Users') {
            targetElement = h6Element;
            break;
        }
    }
    targetElement.click();
    setTimeout(function() {
        let onlineUserCount = document.getElementsByClassName("online-users-content")[0].innerText.split(" , ").length;
        targetElement.innerText = 'Online Users: ' + onlineUserCount;
    }, 2000);
})();