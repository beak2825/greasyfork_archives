// ==UserScript==
// @name         testing
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-05-01
// @description  BOSS RUSH!!
// @author       ぐらんぴ
// @match        https://pokerogue.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokerogue.net
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514511/testing.user.js
// @updateURL https://update.greasyfork.org/scripts/514511/testing.meta.js
// ==/UserScript==

const MODS = {
    BOSS_RUSH_MODE: { enabled: false, segments: 2 }, // HP[▉▉▉▉|▉▉▉▉]
    Enemy_Level_Boost: { enabled: true, multiplier: 1.2 }, // lv.200 → 240
};

const CustomizeEnemy = {
    IVs: { enabled: true, ivs: [31, 31, 31, 31, 31, 31] }, // ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"]
};

///---------------------------------------------------///

const segments = MODS.BOSS_RUSH_MODE.segments;
const multiplier = MODS.Enemy_Level_Boost.multiplier;
const log = console.log

Object.defineProperties(Object.prototype, {
    'bossSegments': {
        set(v) {
            if(MODS.BOSS_RUSH_MODE.enabled == true){
                if(v === undefined || v <= segments){
                    this._bossSegments = segments;
                }else{
                    this._bossSegments = v;
                }
                try{
                    this.boss = true;
                }catch{}
            }
        },
        get() { return this._bossSegments },
    },
    'isBoss': {
        set() {},
        get() { return true; },
    },
    'trainerSlot': {// kx
        set() {
            if(MODS.BOSS_RUSH_MODE.enabled == true) this.setBoss(true)
            if(MODS.Enemy_Level_Boost.enabled == true) this.level += Math.ceil(this.level * multiplier);
            //
            if(CustomizeEnemy.IVs.enabled == true) this.ivs = CustomizeEnemy.IVs.ivs
            //log(this)
        },
        get() {},
    },
});