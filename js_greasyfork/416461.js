// ==UserScript==
// @name         Krunker.io skin hack
// @namespace    https://krunker.io/social.html?p=profile&q=MrLaugh
// @version      v3.3.2
// @description  Krunker.io skin hack v3.3.2
// @author       MrLaugh
// @match        *://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416461/Krunkerio%20skin%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/416461/Krunkerio%20skin%20hack.meta.js
// ==/UserScript==

let skinConfig = {}

function s(c) {
    c.send = new Proxy(c.send, {
        apply(target, thisArg, msg) {
            if (msg[0] === "ent")
                skinConfig = {
                    main: msg[1][2][0],
                    secondary: msg[1][2][1],
                    hat: msg[1][3],
                    body: msg[1][4],
                    knife: msg[1][9],
                    dye: msg[1][14],
                    waist: msg[1][17],
                }

            return target.apply(thisArg, msg);
        }
    });
    c._dispatchEvent = new Proxy(c._dispatchEvent, {
        apply(target, thisArg, [type, msg]) {
            if (skinConfig && type === "0") {
                let playersInfo = msg[0];
                let perPlayerSize = 38;
                while (playersInfo.length % perPlayerSize !== 0)
                    perPlayerSize++;

                for(let i = 0; i < playersInfo.length; i += perPlayerSize)
                    if (playersInfo[i] === c.socketId) {
                        playersInfo[i + 12] = [skinConfig.main, skinConfig.secondary];
                        playersInfo[i + 13] = skinConfig.hat;
                        playersInfo[i + 14] = skinConfig.body;
                        playersInfo[i + 19] = skinConfig.knife;
                        playersInfo[i + 25] = skinConfig.dye;
                        playersInfo[i + 33] = skinConfig.waist;
                    }
            }
            return target.apply(thisArg, arguments[2]);
        }
    });
}

const events = Symbol("kpal")
Object.defineProperty(Object.prototype, "events", {enumerable:!1,get(){return this[events]},set(v){if(this.ahNum===0){s(this)}this[events]=v;}})
const skins = Symbol("lol anticheat")
Object.defineProperty(Object.prototype, "skins", {
    enumerable: false,
    get() {
        if (this.stats) {
            let skins = [];
            for(let i = 0; i < 5000; i++)
                skins.push({ind: i, cnt: i});

            return skins;
        }
        return this[skins];
    },
    set(v) { this[skins] = v; }
});