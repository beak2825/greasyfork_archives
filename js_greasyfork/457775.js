// ==UserScript==
// @name         Scenexe Socket Fiddler
// @namespace    ScenexeSocketFiddler
// @version      0.4
// @description  Scenexe socket fiddler. Modify incoming and outgoing packets by writing functions for incoming and outgoing.
// @author       discordtehe
// @match        https://*.scenexe.io
// @grant        none
// ==/UserScript==

window.MSG_TYPES = {
    INCOMING: {
        GAME_UPDATE: 0,
        ADD_UPGRADE_POINT: 1,
        SET_STAT_UPGRADES: 2,
        ON_KILL: 3,
        RECEIVE_ANNOUNCEMENT: 4,
        RECEIVE_TIMER: 5,
        RECEIVE_NOTIFICATION: 6,
        RECEIVE_BODY_UPGRADES: 7,
        RECEIVE_WEAPON_UPGRADES: 8,
        PING: 9,
        RECEIVE_DIMENSION_ATTRIBUTES: 16,
        RECEIVE_CLASS_TREE: 17,
        COPY_TEXT: 32,
        ON_DEATH: 33,
        RENDER_ENTITY: 34,
        RECEIVE_TANK: 35,
        GATES_UPDATE: 36,
        EDITMODE: 37,
        SEND_TO_SERVER: 39,
        POPUP: 40,
        INIT_LEADERBOARD: 41,
        KICK_REASON: 42,
        ADD_STARS: 43,
        COMPLETE_ACHIEVEMENT: 44,
        CHANGE_ACHIEVEMENT_COMPLETION: 45
    },
    OUTGOING: {
        ROTATION_INPUT: 0,
        MOVEMENT_INPUT: 1,
        SHOOTING_INPUT: 2,
        PASSIVE_MODE: 3,
        SEND_CHAT_MESSAGE: 4,
        UPGRADE_STAT: 5,
        UPGRADE_BODY: 6,
        UPGRADE_WEAPON: 7,
        CHANGE_CONTROL_STATE: 8,
        PING: 9,
        CHANGE_CONTROL_POSITION: 10,
        SET_TYPING: 11,
        LOAD_WEAPON_UPGRADE: 16,
        LOAD_BODY_UPGRADE: 17,
        CHANGE_WEAPON: 18,
        CHANGE_BODY: 19,
        JOIN_GAME: 20,
        SESSION_ID: 21
    }
}

window.incoming = (data)=>{return data};
window.outgoing = (data)=>{return data};

WebSocket.prototype.addEventListener = new Proxy(WebSocket.prototype.addEventListener, {
    apply: function (target, scope, args) {
        if (args[0] === 'message') {
            args[1] = new Proxy(args[1], {
                apply: function(ftarget, fscope, fargs) {
                    var decoded = decode(new Uint8Array(fargs[0].data));
                    decoded = incoming(decoded);
                    if (decoded != undefined)
                        fargs[0] = new MessageEvent('message', {data: encode(decoded)})
                    if (decoded != 'discard') {
                        let fdata = ftarget.apply(fscope, fargs);
                        return fdata;
                    }
                    return;
                }
            })
        }
        let data = target.apply(scope, args);
        return data;
    }
})

WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
    apply: function (target, scope, args) {
        var decoded = decodeInverse(new Uint8Array(args[0])); //decodeInverse because this data has been already encoded by scenexe's main.js
        decoded = outgoing(decoded);
        if (decoded != undefined)
            args[0] = encodeInverse(decoded);
        if (decoded != 'discard') {
            let data = target.apply(scope, args);
            return data;
        }
        return;
    }
})