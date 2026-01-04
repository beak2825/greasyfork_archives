// ==UserScript==
// @name         MooMoo.io Hat macros
// @namespace    -
// @version      1.2
// @description  change hats quick
// @author       Stew
// @match        *://sandbox.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430921/MooMooio%20Hat%20macros.user.js
// @updateURL https://update.greasyfork.org/scripts/430921/MooMooio%20Hat%20macros.meta.js
// ==/UserScript==

let gconfig = {
    pressedKey: null,
    keys: {
        bullHelmet : 'r',
        soldier : 'b',
        booster : 'z',
        turret : 't',
        tankgear : 'g'
    },
    ids: {
        bullhelmet: 7,
        soldier: 6,
        booster: 12,
        turret: 53,
        tankgear: 40
    },
    document: document,
    functions: {
        injectKeys: function(keycode) {
            gconfig.pressedKey = keycode.key
            gconfig.functions.getKeys(gconfig.pressedKey)
        },
        getKeys: function(arg) {
            switch(arg) {
                case gconfig.keys.bullHelmet: {
                    gconfig.functions.equipHat(gconfig.ids.bullhelmet);
                }
                    break;
                case gconfig.keys.soldier: {
                    gconfig.functions.equipHat(gconfig.ids.soldier);
                }
                    break;
                case gconfig.keys.booster: {
                    gconfig.functions.equipHat(gconfig.ids.booster);
                }
                break;
                case gconfig.keys.turret: {
                    gconfig.functions.equipHat(gconfig.ids.turret);
                }
                    break;
                case gconfig.keys.tankgear: {
                    gconfig.functions.equipHat(gconfig.ids.tankgear);
                }
                    break;

            }
        },
        equipHat: function(argsNum) {
            console.log(argsNum)
            gconfig.window.storeEquip(argsNum)
        }
    },
    window: window
};


document.addEventListener('keydown', e => {
    gconfig.functions.injectKeys(e)
})