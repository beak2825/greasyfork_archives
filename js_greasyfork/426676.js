// ==UserScript==
// @name         Champion Avatars
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show avatar and rarity of champions in overview pages on ayumilove.net
// @author       https://github.com/zerfl
// @match        https://ayumilove.net/*
// @downloadURL https://update.greasyfork.org/scripts/426676/Champion%20Avatars.user.js
// @updateURL https://update.greasyfork.org/scripts/426676/Champion%20Avatars.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHAMPS = document.querySelectorAll(".entry-content li a")

    for (const value of CHAMPS) {
        const avatar_prefix = "https://ayumilove.net/files/games/raid_shadow_legends/avatar/";
        const regex_champ = /(.+?(?= \|)).+?-(.)/;
        const regex_az = /[^a-z_]/gmi;

        const colors = {
            C: "#a6a6a6",
            U: "#00d14f",
            R: "#60c0ff",
            E: "#e653e6",
            L: "#e9c800"
        };

        let text = value.text;
        let match;

        if ((match = regex_champ.exec(text)) !== null) {
            let filename;
            let champion = match[1];
            let rarity = match[2];
            filename = champion.replace(/-/g, "_")
            filename = filename.replace(/ /g, "_");
            filename = filename.replace(regex_az, "");

            let parentNode = value.parentNode;
            let image = document.createElement("img")
            let color = colors[rarity];
            image.src = `${avatar_prefix}${filename}.png`;
            image.title = champion;
            image.style = `
border: 3px solid ${color};
padding: 1px;
vertical-align: middle;
margin: 2px 10px 2px 2px;
display: inline-block;
max-width: 50px;
height: auto;`
            value.insertAdjacentElement('afterbegin', image);
        }
    }
})();

