// ==UserScript==
// @name         [AoR] Авто ТП
// @namespace    tuxuuman:aor:auto-tp
// @version      0.1
// @description  Телепортируется в город банкой ТП, при нападении 
// @author       tuxuuman
// @match        *://game.aor-game.ru/*
// @grant        unsafeWindow
// @require      https://greasyfork.org/scripts/371630-aor-gameapi/code/%5BAoR%5D%20GameAPI.js?version=624108
// @downloadURL https://update.greasyfork.org/scripts/372471/%5BAoR%5D%20%D0%90%D0%B2%D1%82%D0%BE%20%D0%A2%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/372471/%5BAoR%5D%20%D0%90%D0%B2%D1%82%D0%BE%20%D0%A2%D0%9F.meta.js
// ==/UserScript==

(function(d) {
    'use strict';
    AoR.on("NewsInfo", (data) => {
        if (data.newsType == "YOU_IN_TARGET"){
            console.warn("На вас напали!");
            let tp = AoR.gameApi.getInventoryItem("item_id", 357);
            if (tp) {
                AoR.gameApi.useItem(tp);
            } else {
                console.warn("Нету банок ТП");
            }
        } else if (data.newsType == "ADD_BUFF" && data.attr[1] == 116) {
            unsafeWindow.location.reload() // короче тут это не поможет, нужно выходить из игры
        }
    });
})();