// ==UserScript==
// @name         IdlePixel Shut Up, Alt
// @namespace    com.zlef.idlepixel
// @version      1.0.6
// @description  Never accidentally send a message on an alt again. Add alt names in the plugin settings to disable sending messages.
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/477766/IdlePixel%20Shut%20Up%2C%20Alt.user.js
// @updateURL https://update.greasyfork.org/scripts/477766/IdlePixel%20Shut%20Up%2C%20Alt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ShutUpAlt extends IdlePixelPlusPlugin {
        constructor() {
            super("shutupalt", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "confused",
                        label: "Example list: name,name2,name3,amyjane1991,name4",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "altIDList",
                        label: "List the names of alts you want the chat disabled for.",
                        type: "string",
                        max: 200000,
                        default: "PlaceIDsHere"
                    }
                ]
            });


        }

        onConfigsChanged() {
            this.chatDisabledList = IdlePixelPlus.plugins.shutupalt.getConfig("altIDList").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase().split(',');
            this.disableChat();
        }

        onLogin() {
            this.username = document.querySelector('item-display[data-key="username"]').innerText;
            this.chatDisabledList = IdlePixelPlus.plugins.shutupalt.getConfig("altIDList").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase().split(',');

            setTimeout(() => {
                this.disableChat();
            }, 1000);
        }

        disableChat() {
            const chatInput = document.querySelector('.chat-area-input');
            if (this.chatDisabledList.includes(this.username)) {
                chatInput.setAttribute('disabled', 'disabled');
                chatInput.setAttribute('placeholder', `${this.username} (Chat disabled)`);
            } else {
                chatInput.removeAttribute('disabled');
                chatInput.setAttribute('placeholder', this.username);
            }
        }

    }

    const plugin = new ShutUpAlt();
    IdlePixelPlus.registerPlugin(plugin);

})();