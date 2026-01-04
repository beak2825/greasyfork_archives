// ==UserScript==
// @name         tp cowgame red dragon
// @version      1.0
// @description  Custom texture pack for moomoo.io #2
// @author       Zyenth
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/805514
// @downloadURL https://update.greasyfork.org/scripts/541456/tp%20cowgame%20red%20dragon.user.js
// @updateURL https://update.greasyfork.org/scripts/541456/tp%20cowgame%20red%20dragon.meta.js
// ==/UserScript==

(function() {
    const textureReplacements = [
        // Animals
        {
            test: "bull_1.png",
            replaceWith: "https://i.imgur.com/ii5D3tH.png"
        },
        {
            test: "bull_2.png",
            replaceWith: "https://i.imgur.com/7JoFD7d.png"
        },

        // Weapons - Diamond
        {
            test: "crossbow_1_d.png",
            replaceWith: "https://i.imgur.com/gOHonNq.png"
        },
        {
            test: "axe_1_d.png",
            replaceWith: "https://i.imgur.com/3Y8dZys.png"
        },
        {
            test: "great_axe_1_d.png",
            replaceWith: "https://i.imgur.com/IIxYJv6.png"
        },
        {
            test: "hammer_1_d.png",
            replaceWith: "https://i.imgur.com/zrsocWx.png"
        },
        {
            test: "great_hammer_1_d.png",
            replaceWith: "https://i.imgur.com/IIuDa9w.png"
        },
        {
            test: "samurai_1_d.png",
            replaceWith: "https://i.imgur.com/DitVZMA.png"
        },
        {
            test: "shield_1_d.png",
            replaceWith: "https://i.imgur.com/jrkOgFQ.png"
        },
        {
            test: "sword_1_d.png",
            replaceWith: "https://i.imgur.com/2gSfcOC.png"
        },
        {
            test: "musket_1_d.png",
            replaceWith: "https://i.imgur.com/gytkRQT.png"
        },
        {
            test: "bow_1_d.png",
            replaceWith: "https://i.imgur.com/8i54CQf.png"
        },
        {
            test: "spear_1_d.png",
            replaceWith: "https://i.imgur.com/kQJKyVS.png"
        },

        // Weapons - Gold
        {
            test: "sword_1_g.png",
            replaceWith: "https://i.imgur.com/0sH8PFi.png"
        },
        {
            test: "samurai_1_g.png",
            replaceWith: "https://i.imgur.com/mbDE77n.png"
        },
        {
            test: "spear_1_g.png",
            replaceWith: "https://i.imgur.com/FCrpaH8.png"
        },
        {
            test: "axe_1_g.png",
            replaceWith: "https://i.imgur.com/tiH3nIs.png"
        },
        {
            test: "great_axe_1_g.png",
            replaceWith: "https://i.imgur.com/rv9aRzJ.png"
        },
        {
            test: "bow_1_g.png",
            replaceWith: "https://i.imgur.com/tcHZWGO.png"
        },
        {
            test: "crossbow_1_g.png",
            replaceWith: "https://i.imgur.com/IBz7L2u.png"
        },
        {
            test: "hammer_1_g.png",
            replaceWith: "https://i.imgur.com/giEJVQS.png"
        },
        {
            test: "great_hammer_1_g.png",
            replaceWith: "https://i.imgur.com/ivNifPL.png"
        },
        {
            test: "musket_1_g.png",
            replaceWith: "https://i.imgur.com/kxKeWQQ.png"
        },
        {
            test: "shield_1_g.png",
            replaceWith: "https://i.imgur.com/9UkO6Pj.png"
        },

        // Hats
        {
            test: "hat_40.png",
            replaceWith: "https://i.imgur.com/lKGtlDF.png"
        },
        {
            test: "hat_12.png",
            replaceWith: "https://i.imgur.com/qFghS5s.png"
        },
        {
            test: "hat_6.png",
            replaceWith: "https://i.imgur.com/kD6iYN8.png"
        },
        {
            test: "hat_18.png",
            replaceWith: "https://i.imgur.com/in5H6vw.png"
        },
        {
            test: "hat_9.png",
            replaceWith: "https://i.imgur.com/1nY34aL.png"
        },
        {
            test: "hat_23.png",
            replaceWith: "https://i.imgur.com/B9AcmcN.png"
        },
        {
            test: "hat_7.png",
            replaceWith: "https://i.imgur.com/xJ3SBcn.png"
        },
        {
            test: "hat_16.png",
            replaceWith: "https://i.imgur.com/mtmsnrm.png"
        },
        {
            test: "hat_31.png",
            replaceWith: "https://i.imgur.com/JPMqgSc.png"
        },
        {
            test: "hat_15.png",
            replaceWith: "https://i.imgur.com/dQxRwAX.png"
        },
        {
            test: "hat_8.png",
            replaceWith: "https://i.imgur.com/kf8yAC2.png"
        },
        {
            test: "hat_13.png",
            replaceWith: "https://i.imgur.com/EwkbsHN.png"
        },
        {
            test: "hat_11.png",
            replaceWith: "https://i.imgur.com/Gu3ZJlY.png"
        },
        {
            test: "hat_20.png",
            replaceWith: "https://i.imgur.com/vcy6Xxo.png"
        },
        {
            test: "hat_11_p.png",
            replaceWith: "https://i.imgur.com/NCkyBlK.png"
        },
        {
            test: "hat_14_p.png",
            replaceWith: "https://i.imgur.com/836PpI0.png"
        },
        {
            test: "hat_14.png",
            replaceWith: "https://i.imgur.com/V4l7o1h.png"
        },
        {
            test: "hat_14_top.png",
            replaceWith: "https://i.imgur.com/zWJTlbI.png"
        },

        // Accessories
        {
            test: "access_21.png",
            replaceWith: "https://i.imgur.com/ttQ9WcS.png"
        },
        {
            test: "access_18.png",
            replaceWith: "https://i.imgur.com/0rmN7L9.png"
        },
        {
            test: "access_19.png",
            replaceWith: "https://i.imgur.com/mGYkxY1.png"
        }
    ];

    const orig = Object.getOwnPropertyDescriptor(Image.prototype, "src");
    Object.defineProperty(Image.prototype, "src", {
        set(l) {
            for (const {test, replaceWith} of textureReplacements) {
                if (l.includes(test)) {
                    l = replaceWith;
                    break;
                }
            }
            orig.set.call(this, l);
        },
        get: orig.get,
        configurable: true
    });
})();