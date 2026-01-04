// ==UserScript==
// @name         National Dex Ubers UU Teambuilder Table Patch
// @namespace    http://tampermonkey.net/
// @version      2025-02-08
// @description  Import National Dex Ubers UU banlist from PS! source to hide banned Pokemon in the teambuilder.
// @author       Zrp200
// @match        https://play.pokemonshowdown.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/526158/National%20Dex%20Ubers%20UU%20Teambuilder%20Table%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/526158/National%20Dex%20Ubers%20UU%20Teambuilder%20Table%20Patch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fetch("https://raw.githubusercontent.com/smogon/pokemon-showdown/refs/heads/master/config/formats.ts")
    .then(y => y.text())
    .then(text => {
        const regex = /name:\s*"\[Gen 9] National Dex Ubers UU".*?banlist:\s*(\[.*?])/s;
        const match = regex.exec(text);

        if (match) {
            console.log(
                BattleTeambuilderTable.gen9natdex.ubersUUBans = eval(match[1])
                    .map(name => Dex.species.get(name === 'Power Construct' ? "Zygarde-Complete" : name))
                    .filter(s => s.exists)
                    .reduce((p, s) => ({...p, ...{[s.id]: 1}}), {}));
        }
    })
})();