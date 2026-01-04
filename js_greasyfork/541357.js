// ==UserScript==
// @name         tp cowgame eXistenZ
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Custom texture pack for moomoo.io #1
// @author       Zyenth
// @match        *://*.moomoo.io/*
// @run-at       document-start
// @icon         data:image/jpeg;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541357/tp%20cowgame%20eXistenZ.user.js
// @updateURL https://update.greasyfork.org/scripts/541357/tp%20cowgame%20eXistenZ.meta.js
// ==/UserScript==

(function() {
    const textureReplacements = [
        { test: "shield_1_r.png", replaceWith: "https://i.imgur.com/SNFV2dc.png" },
        { test: "crossbow_1_r.png", replaceWith: "https://i.imgur.com/EVesBtw.png" },
        { test: "bow_1_r.png", replaceWith: "https://i.imgur.com/Oneg3oF.png" },
        { test: "musket_1_r.png", replaceWith: "https://i.imgur.com/jPE54IT.png" },
        { test: "crossbow_2_r.png", replaceWith: "https://i.imgur.com/z4CyaXk.png" },
        { test: "dagger_1_r.png", replaceWith: "https://i.imgur.com/CDAmjux.png" },
        { test: "spear_1_r.png", replaceWith: "https://i.imgur.com/UY7SV7j.png" },
        { test: "great_hammer_1_r.png", replaceWith: "https://i.imgur.com/tmUzurk.png" },
        { test: "hammer_1_r.png", replaceWith: "https://i.imgur.com/oRXUfW8.png" },
        { test: "bat_1_r.png", replaceWith: "https://i.imgur.com/6ayjbIz.png" },
        { test: "samurai_1_r.png", replaceWith: "https://i.imgur.com/vxLZW0S.png" },
        { test: "great_axe_1_r.png", replaceWith: "https://i.imgur.com/UZ2HcQw.png" },
        { test: "axe_1_r.png", replaceWith: "https://i.imgur.com/kr8H9g7.png" },
        { test: "sword_1_r.png", replaceWith: "https://i.imgur.com/V9dzAbF.png" },
        { test: "stick_1_r.png", replaceWith: "https://i.imgur.com/uTDGDDy.png" },
        { test: "grab_1_g.png", replaceWith: "https://i.imgur.com/DRzBdFX.png" },
        { test: "grab_1_d.png", replaceWith: "https://i.imgur.com/7kbtWfk.png" },
        { test: "grab_1_r.png", replaceWith: "https://i.imgur.com/wV42LEE.png" },
        { test: "crossbow_2_d.png", replaceWith: "https://i.imgur.com/DVjCdwI.png" },
        { test: "musket_1_d.png", replaceWith: "https://i.imgur.com/jwH99zm.png" },
        { test: "bow_1_d.png", replaceWith: "https://i.imgur.com/qu7HHT5.png" },
        { test: "spear_1_d.png", replaceWith: "https://i.imgur.com/HSWcyku.png" },
        { test: "crossbow_1_d.png", replaceWith: "https://i.imgur.com/TRqDlgX.png" },
        { test: "axe_1_d.png", replaceWith: "https://i.imgur.com/OU5os0h.png" },
        { test: "great_axe_1_d.png", replaceWith: "https://i.imgur.com/aAJyHBB.png" },
        { test: "hammer_1_d.png", replaceWith: "https://i.imgur.com/WPWU8zC.png" },
        { test: "great_hammer_1_d.png", replaceWith: "https://i.imgur.com/Fg93gj3.png" },
        { test: "shield_1_d.png", replaceWith: "https://i.imgur.com/hSqLP3t.png" },
        { test: "samurai_1_d.png", replaceWith: "https://i.imgur.com/4ZxIJQM.png" },
        { test: "sword_1_d.png", replaceWith: "https://i.imgur.com/h5jqSRp.png" },
        { test: "sword_1_g.png", replaceWith: "https://i.imgur.com/wOTr8TG.png" },
        { test: "samurai_1_g.png", replaceWith: "https://i.imgur.com/QKBc2ou.png" },
        { test: "spear_1_g.png", replaceWith: "https://i.imgur.com/jKDdyvc.png" },
        { test: "stick_1_g.png", replaceWith: "https://i.imgur.com/NOaBBRd.png" },
        { test: "stick_1_d.png", replaceWith: "https://i.imgur.com/H5wGqQR.png" },
        { test: "dagger_1_d.png", replaceWith: "https://i.imgur.com/ROTb7Ks.png" },
        { test: "bat_1_g.png", replaceWith: "https://i.imgur.com/ivLPh10.png" },
        { test: "bat_1_d.png", replaceWith: "https://i.imgur.com/phXTNsa.png" },
        { test: "hat_40.png", replaceWith: "https://i.imgur.com/pe3Yx3F.png" },
        { test: "hat_12.png", replaceWith: "https://i.imgur.com/VSUId2s.png" },
        { test: "hat_6.png", replaceWith: "https://i.imgur.com/vM9Ri8g.png" },
        { test: "hat_18.png", replaceWith: "https://i.imgur.com/in5H6vw.png" },
        { test: "access_21.png", replaceWith: "https://i.imgur.com/4ddZert.png" },
        { test: "access_18.png", replaceWith: "https://i.imgur.com/0rmN7L9.png" },
        { test: "access_19.png", replaceWith: "https://i.imgur.com/sULkUZT.png" },
        { test: "hat_9.png", replaceWith: "https://i.imgur.com/gJY7sM6.png" },
        { test: "hat_16.png", replaceWith: "https://i.imgur.com/uYgDtcZ.png" },
        { test: "hat_31.png", replaceWith: "https://i.imgur.com/JPMqgSc.png" },
        { test: "hat_7.png", replaceWith: "https://i.imgur.com/vAOzlyY.png" },
        { test: "hat_15.png", replaceWith: "https://i.imgur.com/YRQ8Ybq.png" },
        { test: "hat_13.png", replaceWith: "https://i.imgur.com/EwkbsHN.png" },
        { test: "hat_11.png", replaceWith: "https://i.imgur.com/yfqME8H.png" },
        { test: "hat_20.png", replaceWith: "https://i.imgur.com/JbUPrtp.png" },
        { test: "hat_11_p.png", replaceWith: "https://i.imgur.com/yfqME8H.png" },
        { test: "hat_14_p.png", replaceWith: "https://i.imgur.com/V8JrIwv.png" },
        { test: "hat_14.png", replaceWith: "https://i.imgur.com/V8JrIwv.png" },
        { test: "hat_14_top.png", replaceWith: "https://i.imgur.com/s7Cxc9y.png" },
        { test: "hat_11_top.png", replaceWith: "https://i.imgur.com/s7Cxc9y.png" },
        { test: "hat_26.png", replaceWith: "https://i.imgur.com/2PsUgEL.png" },
        { test: "hat_52.png", replaceWith: "https://i.imgur.com/hmJrVQz.png" },
        { test: "bull_2.png", replaceWith: "https://i.imgur.com/Qq0ysR4.png" },
        { test: "bull_1.png", replaceWith: "https://i.imgur.com/3tsGyzZ.png" },
        { test: "wolf_1.png", replaceWith: "https://i.imgur.com/zLAZWOH.png" },
        { test: "wolf_2.png", replaceWith: "https://i.imgur.com/hKlpCVS.png" },
        { test: "cow_1.png", replaceWith: "https://i.imgur.com/FycnCNU.png" },
        { test: "pig_1.png", replaceWith: "https://i.imgur.com/QHtrTlY.png" },
        { test: "chicken_1.png", replaceWith: "https://i.imgur.com/UtBEmai.png" },
        { test: "enemy.png", replaceWith: "https://i.imgur.com/Ib6nqTa.png" }
    ];

    const orig = Object.getOwnPropertyDescriptor(Image.prototype, "src");
    Object.defineProperty(Image.prototype, "src", {
        set(l) {
            for (const { test, replaceWith } of textureReplacements) {
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