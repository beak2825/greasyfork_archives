// ==UserScript==
// @name         IdlePixel Combat Chat
// @namespace    com.zlef.idlepixel
// @version      1.0.1
// @description  Nades has added this to UI Tweaks, uninstall this plugin.
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/490760/IdlePixel%20Combat%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/490760/IdlePixel%20Combat%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class CombatChat extends IdlePixelPlusPlugin {
        constructor() {
            super("combat_chat", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onLogin() {
            console.log("Nades has added this to UI Tweaks, uninstall this plugin.");
            // this.addChatDisplayWatcher();
        }

        addChatDisplayWatcher() {
            const chatElement = document.getElementById('game-chat');
            if (!chatElement) {
                console.log('Chat element not found.');
                return;
            }

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'style' && chatElement.style.display === 'none') {
                        chatElement.style.display = 'block'; // Force chat to be visible
                    }
                });
            });

            observer.observe(chatElement, { attributes: true, attributeFilter: ['style'] });
        }
    }

    // Update class initialiser
    const plugin = new CombatChat();
    IdlePixelPlus.registerPlugin(plugin);

})();
