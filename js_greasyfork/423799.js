// ==UserScript==
// @name            Camamba Chat Enable all rooms
// @namespace       dannysaurus.camamba
// @version         0.0.2a
// @description     enables to join all rooms
// @license         MIT License
// @include         https://www.camamba.com/chat/
// @include         https://www.de.camamba.com/chat/
// @require         https://greasyfork.org/scripts/423665-camamba-hook-into-onmessage/code/Camamba%20Hook%20Into%20OnMessage.js?version=913868
// @downloadURL https://update.greasyfork.org/scripts/423799/Camamba%20Chat%20Enable%20all%20rooms.user.js
// @updateURL https://update.greasyfork.org/scripts/423799/Camamba%20Chat%20Enable%20all%20rooms.meta.js
// ==/UserScript==

/* jslint esversion: 9 */
/* global me, camData, rooms, blockList, friendList, friendRequests, adminMessages, jsLang, byId, myRooms, knownUsers, activeRoom, selectedUser, joinRoom, onMessageHandlers, postMessageHandlers */

(function() {
    'use strict';

    const allRooms = {
        // English
        engeneral1: -1,
        engeneral2: -1,
        engeneral3: -1,
        enagerestrict1: -1,

        // Deutsch
        degeneral1: -1,
        degeneral2: -1,
        deflirt1: -1,

        // Espanol
        deagerestrict1: -1,
        esgeneral1: -1,
        esgeneral2: -1,

        // International
        asian: -1,
        franc: -1,
        ital: -1,
        neder: -1,
        nihong: -1,
        norge: -1,
        portu: -1,
        ruski: -1,
        soumi: -1,
        svenska: -1,
        inter1: -1,
    };

    postMessageHandlers.roomStats = data => {

        for(let [room, count] of Object.entries({...allRooms, ...data.counters})) {
            if (byId(room+"-count")) {
                byId(room+"-count").innerHTML = count;
            }

            if (byId('roomListIcon-'+room) && myRooms.indexOf(room) == -1) {
                byId('roomListIcon-'+room).innerHTML = "<span class='fa fa-arrow-right'></span>";
                ((thisRoom) => {
                    byId('joiner-'+thisRoom).onclick = () => {
                        joinRoom(thisRoom);
                    };
                })(room);

                byId('joiner-'+room).className = "hoverEffect";
            }
        }
    };
})();