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
// @name         Show-must-go-on
// @version      1.1.0
// @description  Carry-on mode via disabling canvas clear between turns. Can get divergent canvas states because Skribbl isn't very good at sending the same brush strokes to everyone.
// @author       jancc
// @namespace    https://greasyfork.org/en/users/356726-jancc
// @license      AGPL-3.0-or-later
// @match        https://*.skribbl.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392720/Show-must-go-on.user.js
// @updateURL https://update.greasyfork.org/scripts/392720/Show-must-go-on.meta.js
// ==/UserScript==

(function() {
    /* Keep track of the players for forwards compatibility. Just in case. */
    const players = new Set();

    /* A node will have a timeout and a delay associated with it. This is
     * necessary because players would leave and their pencils wouldn't get
     * processed, but their unfreeze timeouts would remain, and the canvas
     * would get cleared for the next player.
     */
    const setupNode = (nodeId, ms) => {
        let node = document.getElementById(nodeId);
        node.timeoutId = null;
        node.delay = ms;
        return node;
    };

    const gameCanvas = setupNode('canvasGame', 4500);
    const trashBin = setupNode('buttonClearCanvas', 500);

    const delay = node => new Promise(resolve => {
        clearTimeout(node.timeoutId);
        node.timeoutId = setTimeout(resolve, node.delay);
    });

    /* Unhide the trash bin after the canvas can be cleared, in case someone
     * lagged; to avoid canvas divergence if someone clicks the bin too soon.
     */
    trashBin.enable = function() {
        delay(this).then(() => (this.style.visibility = 'visible'));
    };

    trashBin.disable = function() {
        clearTimeout(this.timeoutId);
        this.style.visibility = 'hidden';
    };

    /* As a first approximation, decide that the lobby is private if the
     * question mark is in the URL. This can fail for the player who creates
     * the lobby, in which case there is an additional check for the crown
     * icon later. People really should take care of disabling and enabling
     * the script themselves, though. :-)
     */
    let privateLobby = window.location.href.indexOf('?') > -1;

    gameCanvas.unfreeze = function() {
        if (privateLobby) {
            /* When a player starts drawing, Skribbl's game.js clears the
             * canvas via calling fillRect. One can try to wait out a short
             * time, in the range of 50-200 ms, and load the previous
             * canvas state. But sometimes it lags, and the clearing
             * happens after the state has been loaded. The workaround here
             * is to disable the fillRect method entirely for a few seconds
             * after a turn's start, and reënable it afterwards. This also
             * disables clearing the canvas via pressing the trash bin
             * icon, which is made apparent by temporarily hiding the
             * icon.
             */
            delay(this).then(() => {
                let ctx = this.getContext('2d');
                ctx.fillRect = ctx.constructor.prototype.fillRect;
                trashBin.enable();
            });
        }
    };

    gameCanvas.freeze = function() {
        if (privateLobby) {
            clearTimeout(this.timeoutId);
            this.getContext('2d').fillRect = () => {};
            trashBin.disable();
        }
    };

    const watch = (id, callback) => {
        new MutationObserver((mutationList, observer) => {
            mutationList.forEach(mutation => callback(mutation));
        }).observe(document.getElementById(id), {
            childList: true,
        })
    };

    watch('containerGamePlayers', mutation => {
        mutation.addedNodes.forEach(player => {
            players.add(player);
            /* If the crown icon is visible for any player, decide that the
             * lobby is private. This only matters for the lobby creator, and
             * the creator always sees themselves with a crown before the game
             * begins, so this should be airtight.
             */
            player.crown = player.childNodes[2].lastChild.previousSibling;
            player.crown.style.display === '' && (privateLobby = true);
            /* Observe each pencil and do things accordingly. 👀. */
            player.pencil = player.childNodes[2].lastChild;
            player.carryOn = new MutationObserver((mutationList, observer) => {
                /* Pencil appears => unfreeze the canvas with a 5-second delay.
                 * Pencil disappears => freeze it.
                 */
                player.pencil.style.display === '' ? gameCanvas.unfreeze() : gameCanvas.freeze();
            });
            player.carryOn.observe(player.pencil, {
                attributes: true,
                attributeFilter: ['style'],
            });
        });
        mutation.removedNodes.forEach(player => {
            /* If the leaving player is the drawer, prevent the canvas from
             * getting cleared. Otherwise any quitter can erase the drawing for
             * everyone.
             */
            player.pencil.style.display === '' && gameCanvas.freeze();
            player.carryOn.disconnect();
            players.delete(player);
        });
    });

    /* Finally, disable clearing preëmptively when the player joins a lobby, so that
     * the canvas doesn't get erased between turns. Has the trade-off that a new player
     * won't get their canvas cleared if the drawer does so at their first turn.
     * Whoopsies!
     */
    gameCanvas.freeze();
})();