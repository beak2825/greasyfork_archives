// ==UserScript==
// @name         Virtualmanager.com - Open all on free transfer to training page
// @namespace    https://greasyfork.org/en/users/884999-l%C3%A6ge-manden
// @version      0.2
// @description  Open all on free transfer to training page
// @author       VeryDoc
// @match        https://www.virtualmanager.com/free_transfer_listings?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=virtualmanager.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475804/Virtualmanagercom%20-%20Open%20all%20on%20free%20transfer%20to%20training%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/475804/Virtualmanagercom%20-%20Open%20all%20on%20free%20transfer%20to%20training%20page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let OpenAllButton = document.createElement('button');
    OpenAllButton.className = 'button';
    OpenAllButton.innerText = 'Open all';
    OpenAllButton.onclick = function () { OpenAll(); };

    let OpenAllButtonAutoClose = document.createElement('button');
    OpenAllButtonAutoClose.className = 'button';
    OpenAllButtonAutoClose.innerText = 'Open all (auto close)';
    OpenAllButtonAutoClose.onclick = function () { OpenAllAutoClose(); };

    var attachbox = document.getElementsByClassName('search')[0];

    attachbox.appendChild(OpenAllButton);
    attachbox.appendChild(OpenAllButtonAutoClose);

    function OpenAll() {
        var photos = document.getElementsByClassName('photo');
        var x = 100;
        for (let photo of photos) {
            setTimeout(openWindow, x, photo.href + "/training");
            x += 100;
        }
    }

    function OpenAllAutoClose() {
        var photos = document.getElementsByClassName('photo');
        var x = 100;
        for (let photo of photos) {
            setTimeout(openWindow, x, photo.href + "/training?auto=true");
            x += 100;
        }
    }

    function openWindow(s){
        // console.log(s);
        window.open(s, "_blank");
    }
})();