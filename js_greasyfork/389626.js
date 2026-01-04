/* Copyright (C) 2019 jancc
 * This program is free software: you  can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation,  either  version 3 of the License,  or any
 * later version.
 *
 * This  program  is  distributed  in  the  hope  that  it will  be  useful,
 * but  WITHOUT  ANY  WARRANTY;  without   even  the  implied  warranty  of
 * MERCHANTABILITY or FITNESS FOR A  PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details:
 *
 *     https://www.gnu.org/licenses/agpl.txt
 */

// ==UserScript==
// @name         Skrib-o-muter
// @version      1.0.2
// @description  Mute and unmute names on skribbl.io by clicking them in the player list on the left.
// @author       jancc
// @namespace    https://greasyfork.org/en/users/356726-jancc
// @license      AGPL-3.0-or-later
// @match        https://*.skribbl.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389626/Skrib-o-muter.user.js
// @updateURL https://update.greasyfork.org/scripts/389626/Skrib-o-muter.meta.js
// ==/UserScript==

(function() {
    let players = new Set(),
        mutedNames = new Set();

    const watch = (id, callback) => {
        new MutationObserver((mutationList, observer) => {
            mutationList.forEach(mutation => callback(mutation));
        }).observe(document.getElementById(id), {
            childList: true,
        })
    };

    watch('boxMessages', mutation => {
        mutation.addedNodes.forEach(message => {
            message.firstChild.tagName === 'B' && mutedNames.has(message.firstChild.innerText.slice(0, -2)) && message.remove();
        });
    });

    watch('containerGamePlayers', mutation => {
        mutation.addedNodes.forEach(player => {
            player.name = player.childNodes[1].firstChild.textContent;
            player.fadein = function () {
                this.childNodes[1].style.color = '';
                this.lastChild.style.visibility = 'visible';
            };
            player.fadeout = function () {
                this.childNodes[1].style.color = 'crimson';
                this.lastChild.style.visibility = 'hidden';
            };
            player.onclick = function () {
                if (mutedNames.has(this.name)) {
                    mutedNames.delete(this.name);
                    players.forEach(player => {
                        player.name === this.name && player.fadein();
                    });
                } else {
                    mutedNames.add(this.name);
                    players.forEach(player => {
                        player.name === this.name && player.fadeout();
                    });
                }
            };
            mutedNames.has(player.name) ? player.fadeout() : player.fadein();
            players.add(player);
        });
        mutation.removedNodes.forEach(player => {
            players.delete(player);
        });
    });
})();