// ==UserScript==
// @name            Camamba OnMessageHandling
// @namespace       dannysaurus.camamba
// @version         0.2.9
// @description     handles requests
// @license         MIT License
// @include         https://www.camamba.com/chat/
// @include         https://www.de.camamba.com/chat/
// @connect         camamba.com
// @grant           GM_xmlhttpRequest
//
// @require         https://greasyfork.org/scripts/405143-simplecache/code/SimpleCache.js
// @require         https://greasyfork.org/scripts/405144-httprequest/code/HttpRequest.js
// @require         https://greasyfork.org/scripts/391854-enum/code/Enum.js
// @require         https://greasyfork.org/scripts/405699-camamba-user/code/Camamba%20User.js
//
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
//
// @require         https://greasyfork.org/scripts/423722-camamba-chat-helpers-library/code/Camamba%20Chat%20Helpers%20Library.js?version=960246
//
// @require         https://greasyfork.org/scripts/423662-camamba-chat-settings/code/Camamba%20Chat%20Settings.js?version=913122
// @require         https://greasyfork.org/scripts/423665-camamba-hook-into-onmessage/code/Camamba%20Hook%20Into%20OnMessage.js?version=916216
// @downloadURL https://update.greasyfork.org/scripts/423670/Camamba%20OnMessageHandling.user.js
// @updateURL https://update.greasyfork.org/scripts/423670/Camamba%20OnMessageHandling.meta.js
// ==/UserScript==

/* jslint esversion: 9 */
/* global me, camData, rooms, blockList, friendList, friendRequests, adminMessages, jsLang, byId, myRooms, knownUsers, activeRoom, selectedUser, settings, onMessageHandlers, postMessageHandlers */
(function() {
    'use strict';
    // don't bullshit when beeing mod
    if (me && me.admin) {
        return;
    }
    
    const threatAsFriends = [
        1276484, // Vys
    ];

    // ---------------- //
    // --- Handlers --- //
    // ---------------- //
    onMessageHandlers.control = data => {
        const user = knownUsers.byId(data.id);
        if (!user.length) {
            return false;
        }

        user.save();

        switch (String(data.request)) {
            case "camWant":
                // permit who is cammed
                if (user.byIsCammed().length) {
                    return true;
                }

                // when auto accept for friends
                if (settings.camAcceptFriends) {
                    const userMale = user.byGender('m')[0];
                    if (userMale && userMale.friend) {
                        userMale.friend = 0;
                    }
                }
                
                if (threatAsFriends.some(id => id == user.id)) {
                    return true;
                }

                break;
        }

        return true;
    };

    postMessageHandlers.control = data => {
        const user = knownUsers.byId(data.id);
        if (!user) {
            return false;
        }

        user.restore();
    };
})();