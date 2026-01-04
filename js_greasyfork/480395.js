// ==UserScript==
// @name         IdlePixel+ Plugin Template
// @namespace    luxferre.dev
// @version      1.2.1
// @description  Blank plugin with all IP+ methods, and custom message handling
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 https://greasyfork.org/scripts/484046/code/IdlePixel%2B%20Custom%20Handling.js?anticache=20240721
// @downloadURL https://update.greasyfork.org/scripts/480395/IdlePixel%2B%20Plugin%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/480395/IdlePixel%2B%20Plugin%20Template.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class TemplatePlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("template", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "template",
                        label: "template",
                        type: "string",
                        max: 2000,
                        default: ""
                    }
                ]
            });
            this.previous = "";
        }

        onConfigsChanged() { }
        onLogin() { }
        onMessageReceived(data) { }
        onVariableSet(key, valueBefore, valueAfter) { }
        onChat(data) { }
        onPanelChanged(panelBefore, panelAfter) { }
        onCombatStart() { }
        onCombatEnd() { }
        onCustomMessagePlayerOffline(player, content) { }
        onCustomMessageReceived(player, content, callbackId) {
            const customData = Customs.parseCustom(player, content, callbackId)        // Parses custom data into an object, assumes the Anwinity Standard
            if (!(customData.plugin === "--template--" || customData.anwinFormatted)){      // Checks if custom is formatted in the correct way, and from the correct plugin
                return
            }
            if (customData.player === "--template--"){      // Checks if custom is received from the correct player
                if (customData.command === "--template--"){     // Runs relevant command code, replace with switch statment if using many commands
                    console.log(customData.payload)
                }
            }
        }
    }

    const plugin = new TemplatePlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
