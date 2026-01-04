// ==UserScript==
// @name         </> Kurt Mod - İsim 
// @namespace    http://tampermonkey.net/
// @version      78.2
// @description  !adminyetki
// @icon         https://cdn.discordapp.com/emojis/821847415899947008.png?v=1
// @author       Kurt
// @match        http://tc-mod.glitch.me/
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/427852/%3C%3E%20Kurt%20Mod%20-%20%C4%B0sim.user.js
// @updateURL https://update.greasyfork.org/scripts/427852/%3C%3E%20Kurt%20Mod%20-%20%C4%B0sim.meta.js
// ==/UserScript==

// İsim
game.network.sendEnterWorld2 = game.network.sendEnterWorld;
game.network.sendEnterWorld = (data) => {
    data.displayName = `  ƬƇ\n  ƘƲƦƬ`;
    game.network.sendEnterWorld2(data);
}