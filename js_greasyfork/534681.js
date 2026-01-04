// ==UserScript==
// @name         PokeRogue - BOSS RUSH MODE
// @name:en      PokeRogue - BOSS RUSH MODE
// @name:ja      PokeRogue - ボスラッシュ
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-08-02
// @description  Boss Rush Mode | Boosts enemies' level cap.
// @description:en Boss Rush Mode | Boosts enemies' level cap.
// @description:ja ボスラッシュモード | 敵の強化
// @author       ぐらんぴ
// @match        https://pokerogue.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokerogue.net
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534681/PokeRogue%20-%20BOSS%20RUSH%20MODE.user.js
// @updateURL https://update.greasyfork.org/scripts/534681/PokeRogue%20-%20BOSS%20RUSH%20MODE.meta.js
// ==/UserScript==

const MODS = {
    BOSS_RUSH_MODE:    { segments: 2 },  // HP[▉▉▉▉|▉▉▉▉]
    //Double_only:       {}, // testing
    Enemy_Level_Boost: { level: boost1}, // boost1: lv.5 → 8 | lv.200 → 232
};                                       // boost2: lv.5 → 6 | lv.200 → 240
 
const CustomizeEnemy = {
    IVs:   { enabled: false, ivs: [31, 31, 31, 31, 31, 31] }, // ["HP", "ATK", "DEF", "SPATK", "SPDEF", "SPD"]
    level: {},
    modifiers: {},
};
 
///---------------------------------------------------///
function boost1(baseLevel){
    const p = 0.15;
    const c = 2;
    return Math.round(baseLevel * (1 + p) + c);
}// console.log(`lv.5 → ${boost1(5)}`); console.log(`lv.200 → ${boost1(200)}`);
 
function boost2(baseLevel){
    const multiplier = 1.2;
    return Math.ceil(baseLevel * multiplier);
}// console.log(`lv.5 → ${boost2(5)}`); console.log(`lv.200 → ${boost2(200)}`);
///---------------------------------------------------///
 
const segments = MODS.BOSS_RUSH_MODE.segments;
 
let lv, newArr;
 
Object.defineProperties(Object.prototype, {
    'localStorageKey': {
        set() {
            if(this.title == "General"){
                this.settings.push({
                    key: 'BOSS_RUSH_MODE',
                    label: 'Boss Rush Mode',
                    options: [
                        {value: 'Off', label: 'Off'},
                        {value: 'On', label: 'On'}
                    ],
                    default: 0,
                    type: 2
                });
                this.settings.push({
                    key: 'Enemy_Level_Boost',
                    label: 'Enemy Level Boost',
                    options: [
                        {value: 'Off', label: 'Off'},
                        {value: 'On', label: 'On'}
                    ],
                    default: 0,
                    type: 2
                });
                /*
                this.settings.push({
                    key: 'Double_only',
                    label: 'Double Only',
                    options: [
                        {value: 'Off', label: 'Off'},
                        {value: 'On', label: 'On'}
                    ],
                    default: 0,
                    type: 2
                });
                */
            };
        },
        get() { return "settings" },
    },
    'bossSegments': {
        set(v) {
            if(JSON.parse(localStorage.settings).BOSS_RUSH_MODE == 1){
                if(v === undefined || v <= segments){
                    this._bossSegments = segments;
                }else{ this._bossSegments = v }
 
                try{ this.boss = true }catch{}
            }
        },
        get() { return this._bossSegments },
    },
    'isBoss': {
        set() {},
        get() { return true; },
    },
    'trainerSlot': {// kx, variant
        set() {
            if(JSON.parse(localStorage.settings).BOSS_RUSH_MODE == 1) this.setBoss(true)
            if(JSON.parse(localStorage.settings).Enemy_Level_Boost == 1) this.level = MODS.Enemy_Level_Boost.level(this.level);
            if(CustomizeEnemy.IVs.enabled) this.ivs = CustomizeEnemy.IVs.ivs
        },
        get() {},
    },
    /*
    'double': {
        set() {},
        get() { return true },
    },
    'enemyLevels': {
        set(x) {
            if(x.length <= 2){
                lv = Number(x[0]);
                newArr = [lv, lv];
            }
        },
        get(x) { return newArr },
    },
    */
});