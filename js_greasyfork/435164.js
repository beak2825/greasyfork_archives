// ==UserScript==
// @name            [MooMoo] Авто-хил
// @name:en         [MooMoo] Auto-heal
// @namespace       tuxuuman:moomoo.io.auto-heal
// @version         0.0.3
// @description:en  auto healing
// @description     автоматический отхил
// @author          tuxuuman<tuxuuman@gmail.com>
// @match           *://moomoo.io/*
// @require         https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/EventEmitter/5.2.8/EventEmitter.min.js
// @require         https://greasyfork.org/scripts/372832-moomoo-api/code/moomoo-api.js?version=991431
// @run-at          document-end
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/435164/%5BMooMoo%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D1%85%D0%B8%D0%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/435164/%5BMooMoo%5D%20%D0%90%D0%B2%D1%82%D0%BE-%D1%85%D0%B8%D0%BB.meta.js
// ==/UserScript==

(function () {
    let playerId = 0;
    let playerHp = 100;
    let healTimer = null;
    let hilka = 0;
    let food = 0;
    let MooMoo = MooMooApi();

    MooMoo.on("enterGame", (data) => {
        playerHp = 100;
        hilka = 0;
        food = 0;
        playerId = data.playerId;
        clearInterval(healTimer);
        healTimer = setInterval(() => {
            if (playerHp < 100 && (
                (hilka === 0 && food >= 10) ||
                (hilka === 1 && food >= 15) ||
                (hilka === 2 && food >= 25)
            )) {
                MooMoo.actions.useItem(hilka);
            }
        }, 250);
    });

    MooMoo.on("dead", (data) => {
        clearInterval(healTimer);
    });

    MooMoo.on("resources", (data) => {
        if (data.name == "food") {
            food = data.total;
        }
    });

    MooMoo.on("hp", (data) => {
        if (data.playerId === playerId) {
            playerHp = data.hp;
        }
    });

    MooMoo.on("items", (items) => {
        if (items.includes(1)) {
            hilka = 1;
        } else  if (items.includes(2)) {
            hilka = 2;
        }
    });
})();
