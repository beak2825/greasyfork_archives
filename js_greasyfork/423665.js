// ==UserScript==
// @name            Camamba Hook Into OnMessage Library
// @namespace       dannysaurus.camamba
// @version         0.2
// @description     allows to add handlers for onMessage requests
// @license         MIT License
// @include         https://www.camamba.com/chat/
// @include         https://www.de.camamba.com/chat/
// ==/UserScript==

/* jslint esversion: 9 */
/* global me, camData, rooms, blockList, friendList, friendRequests, adminMessages, jsLang, byId, myRooms, knownUsers, activeRoom, selectedUser, settings */

//  https://greasyfork.org/scripts/423665-camamba-hook-into-onmessage

// === overwrite relevant property to add handler before onMessage is going to be processed
const onMessageHandlers = {
    // Keepalive response
    pong: data => {
        return true;
    },

    // Chat message
    roomChat: data => {
        return true;
    },

    // Private message
    private: data => {
        return true;
    },

    // Control messages
    control: data => {
        return true;
    },

    // User Joined Room
    joined: data => {
        return true;
    },

    // User left
    left: data => {
        return true;
    },

    // User disconnected from server
    disco: data => {
        return true;
    },

    // Room User List
    roomList: data => {
        return true;
    },

    // Room access denied
    denied: data => {
        return true;
    },

    // Private room ready
    privateCreate: data => {
        return true;
    },

    // Owner of a private room left the chat
    ownerLeft: data => {
        return true;
    },

    // User joins my room
    joinRequest: data => {
        return true;
    },

    // Room user count
    roomStats: data => {
        return true;
    },

    // Private room data
    privStats: data => {
        return true;
    },

    // Image Upload
    file: data => {
        return true;
    },

    // Cam published
    camOn: data => {
        return true;
    },

    // Cam turned off
    camOff: data => {
        return true;
    },

    // AFK mark
    afk: data => {
        return true;
    },

    // Second login overrides
    duplicate: data => {
        return true;
    },

    // Admin messages
    admin: data => {
        return true;
    },

    // Admin ban
    ban: data => {
        return true;
    },

    // Connected (control layer)
    connectConfirm: data => {
        return true;
    }
};

// === overwrite relevant property to add handler after onMessage got processed
const postMessageHandlers = {
    // Keepalive response
    pong: data => {
        return;
    },

    // Chat message
    roomChat: data => {
        return;
    },

    // Private message
    private: data => {
        return;
    },

    // Control messages
    control: data => {
        return;
    },

    // User Joined Room
    joined: data => {
        return;
    },

    // User left
    left: data => {
        return;
    },

    // User disconnected from server
    disco: data => {
        return;
    },

    // Room User List
    roomList: data => {
        return;
    },

    // Room access denied
    denied: data => {
        return;
    },

    // Private room ready
    privateCreate: data => {
        return;
    },

    // Owner of a private room left the chat
    ownerLeft: data => {
        return;
    },

    // User joins my room
    joinRequest: data => {
        return;
    },

    // Room user count
    roomStats: data => {
        return;
    },

    // Private room data
    privStats: data => {
        return;
    },

    // Image Upload
    file: data => {
        return;
    },

    // Cam published
    camOn: data => {
        return;
    },

    // Cam turned off
    camOff: data => {
        return;
    },

    // AFK mark
    afk: data => {
        return;
    },

    // Second login overrides
    duplicate: data => {
        return;
    },

    // Admin messages
    admin: data => {
        return;
    },

    // Admin ban
    ban: data => {
        return;
    },

    // Connected (control layer)
    connectConfirm: data => {
        return;
    }
};


(() => {
    'use strict';

    const onMessage = (message) => {
        const data = JSON.parse(message.data);

        let handler = onMessageHandlers[data.command];
        return (typeof handler === 'function') ? handler(data) : true;
    };

    const postMessage = (message) => {
        const data = JSON.parse(message.data);

        let handler = postMessageHandlers[data.command];
        if (typeof handler === 'function') {
            handler(data);
        }
    };

    (async () => {
        const wait = async (ms) => new Promise(res => setTimeout(res, ms));
        // wait until websocket has been connected
        while (typeof ws !== 'object' || !ws || !ws.readyState) {
            await wait(100);
        }

        const originalOnMessage = ws.onmessage;
        ws.onmessage = (message) => {
            const resultOnMessage = onMessage(message);

            if (resultOnMessage) {
                originalOnMessage(message);
                postMessage(message);
            }
        };
    })();
})();