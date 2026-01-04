// ==UserScript==
// @name         IdlePixel Pinger
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Adds a chat command that pings other players
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/475222/IdlePixel%20Pinger.user.js
// @updateURL https://update.greasyfork.org/scripts/475222/IdlePixel%20Pinger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class PingerPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("pinger", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.previous = "";
        }
    
        onLogin(){
            IdlePixelPlus.registerCustomChatCommand("ping", (command, message) => {
                IdlePixelPlus.sendCustomMessage(message, {
                    content: `PINGER:PING`
                });
                }, "Sends a ping to the player. /ping <player>");
        }
    
        onCustomMessageReceived(player, content, callbackId) {
            if (content.startsWith("PINGER:")){
                Modals.open_image_modal("PING!", "images/birdhouse.png", `Ping from: ${player}!`, "Okay!", null, "Cancel", false)
            }
        }

    }

    const plugin = new PingerPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})(); 