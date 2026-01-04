// ==UserScript==
// @name         IdlePixel Card Game
// @namespace    com.anwinity.idlepixel
// @version      1.0.0
// @description  A playable card game for your IdlePixel cards.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/519205/IdlePixel%20Card%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/519205/IdlePixel%20Card%20Game.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class CardGamePlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("cardgame", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onLogin() {
            CToe.openAnwinityTCG = function() {
                const token = window.jwt_do_not_share;
                if(!token) {
                    return;
                }
                window.open(`https://data.idle-pixel.com/playtcg/?token=${token}`, "_blank");
            }

            const tcgUnknown = document.querySelector('itembox[data-item="tcg_unknown"]');
            if(tcgUnknown) {
                tcgUnknown.insertAdjacentHTML("beforebegin", `
<div class="itembox-rings hover" data-tooltip="tcg-play" onclick="CToe.openAnwinityTCG()">
  <div class="center mt-1"><img src="https://cdn.idle-pixel.com/images/tcg_back_50.png"></div>
  <div class="center mt-2"><span id="tcg-shop-itembox">PLAY</span></div>
</div>

                `);
            }
        }

    }

    const plugin = new CardGamePlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();