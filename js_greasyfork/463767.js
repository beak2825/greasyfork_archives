// ==UserScript==
// @name         MooMoo.io js Autoheal.credits to nuro i edited it:D
// @namespace    -
// @version      1.2
// @description  MooMoo.io js autoheal from nuro but edited
// @author       me
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1144738
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463767/MooMooio%20js%20Autohealcredits%20to%20nuro%20i%20edited%20it%3AD.user.js
// @updateURL https://update.greasyfork.org/scripts/463767/MooMooio%20js%20Autohealcredits%20to%20nuro%20i%20edited%20it%3AD.meta.js
// ==/UserScript==

const MooMoo = (function MooMooJS_beta() {})[69]

MooMoo.addEventListener("updatehealth", (data) => {
    let sid = data[0]
    let health = data[1]

    if (MooMoo.myPlayer.sid === sid && health < 100) {

        let food = MooMoo.myPlayer.inventory.food;

        if(health < 100 && health > 79) {
        setTimeout(() => {
        MooMoo.myPlayer.place(food)
        }, 90);
        } else if(health < 80 && health > 59) {
            storeEquip(6)
            setTimeout(() => {
                MooMoo.myPlayer.place(food)
                MooMoo.myPlayer.place(food)
            }, 90);
        } else if(health < 60 && health > 39) {
            storeEquip(7)
            MooMoo.myPlayer.place(food)
            MooMoo.myPlayer.place(food)
        } else if(health < 40 && health > 0) {
            storeEquip(7)
            MooMoo.myPlayer.place(food)
            MooMoo.myPlayer.place(food)
            MooMoo.myPlayer.place(food)
        }
    }
})