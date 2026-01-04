// ==UserScript==
// @name        Autonext - anilibria.tv
// @namespace   HalferScripts
// @match       *://*.anilibria.tv/release/*
// @grant       none
// @version     1.1
// @author      strelokhalfer
// @description Автоматически включает следующую серию для PlayerJS плеера.
// @downloadURL https://update.greasyfork.org/scripts/430390/Autonext%20-%20anilibriatv.user.js
// @updateURL https://update.greasyfork.org/scripts/430390/Autonext%20-%20anilibriatv.meta.js
// ==/UserScript==
(async() => {
    while(!window.hasOwnProperty("player")) // Плеер инициализируется не сразу, проверяем раз в какое то время
        await new Promise(resolve => setTimeout(resolve, 1000));
    window.player.api("autonext", 1)//Включить автопригрыш
})();