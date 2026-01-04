// ==UserScript==
// @name         Uncapped Placement
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Removes the annoying "I need to rest" block placement limit
// @author       Zoltar
// @match        http://manyland.com/*
// @icon         https://cdn.discordapp.com/icons/852442189283983380/a_70793eeb1f509f9c4aa1021e5691fab4.webp
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/428429/Uncapped%20Placement.user.js
// @updateURL https://update.greasyfork.org/scripts/428429/Uncapped%20Placement.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // took this part from Eternity's mod
    async function loadObf() {
        if (typeof Deobfuscator == 'undefined')
            await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js")

    }
    // Parses smooth loader
    !async function loader() {
        let loading = setInterval(() => {
            if (typeof ig === "undefined") return
            else if (typeof ig.game === "undefined") return
            else if (typeof ig.game.screen === "undefined") return
            else if (ig.game.screen.x == 0) return
            else if (typeof Settings !== "function") return

            clearInterval(loading);
            loadObf().then(() => {
                let placementCheck = Deobfuscator.function(ig.game.websocket, 'ig.game.decorator.playerPuff(e)', true);
                let worldHandler = Deobfuscator.object(ig.game, 'deleteThingAt', true);
                let speechHandler = Deobfuscator.object(ig.game, 'symbolPos', true);
                let vocabIndexCall = Deobfuscator.function(ig.game[speechHandler], '1.5<=', true);

                let replaceString = `:ig.game.${worldHandler}.deleteThingAt(d.x,d.y,!0)`;
                let replaceString2 = `ig.game.${speechHandler}.${vocabIndexCall}("tired")`;

                eval(`ig.game.websocket.${placementCheck} = function(a,b,c,d) {` + ig.game.websocket[placementCheck].toString().split('function(a,b,c,d){')[1].split(replaceString).join(':console.log("")').split(replaceString2).join("console.log('')"))
            });
        }, 250)
    }()
})();