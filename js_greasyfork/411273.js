/*jshint esversion: 6 */
// ==UserScript==
// @name         AnimeFLV Firefox "Estreno" fix
// @version      0.1.2
// @description  Move Element<Spam> "Estreno" to parent
// @author       Eliaxs1900
// @match        https://www3.animeflv.net/
// @grant        none
// @namespace https://greasyfork.org/users/687119
// @downloadURL https://update.greasyfork.org/scripts/411273/AnimeFLV%20Firefox%20%22Estreno%22%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/411273/AnimeFLV%20Firefox%20%22Estreno%22%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let allList = document.getElementsByClassName('Anime alt B');

    for (let carta of allList) {
        //Mover elemento [./a.spam] a [./spam, ./a]
        let SpamElem = carta.children[0].children[0];
        if (SpamElem.nodeName === "SPAN"){
            carta.children[0].children[0].remove()
            carta.appendChild(SpamElem)
        }
    }
})();