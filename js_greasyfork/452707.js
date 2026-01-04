// ==UserScript==
// @name         IdlePixel Tick Pulse
// @namespace    com.anwinity.idlepixel
// @version      1.0.1
// @description  Adds a little circle that pulses each combat tick.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/452707/IdlePixel%20Tick%20Pulse.user.js
// @updateURL https://update.greasyfork.org/scripts/452707/IdlePixel%20Tick%20Pulse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PULSE_DURATION = 500;

    class TickPulsePlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("tickpulse", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        pulse() {
            const circle = $("#pulse-circle");
            circle.removeAttr("style");
            circle.animate({
                "width": "40px",
                "height": "40px",
                "margin-top": "-20px",
                "margin-left": "-20px",
                "opacity": 0
            }, PULSE_DURATION, "swing");
        }

        onMessageReceived(data) {
            if(data.includes("ANIMATE")) {
                console.log(data);
            }
            if(data.startsWith("SET_ITEMS=") && data.includes("hp~") && !data.includes("playtime~")) {
                this.pulse();
            }
        }

        onLogin() {
            $("head").append(`
            <style id="styles-tickpulse">
              #pulse-circle {
                  width: 0px;
                  height: 0px;
                  margin-top: 0px;
                  margin-left: 0px;
                  border-radius: 20px;
                  background: rgb(42, 200, 200);
                  opacity: 1;
              }
            </style>
            `);
            $("#combat-presets-area").closest("td").next("td").append('<div id="pulse-circle"></div>');
        }

    }

    const plugin = new TickPulsePlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();