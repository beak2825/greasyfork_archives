// ==UserScript==
// @name         IdlePixel Magnus Macros
// @namespace    com.anwinity.idlepixel
// @version      1.0.0
// @description  Build some critical thinking skills. Tell off some noobs. Make lasting friendships.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/451400/IdlePixel%20Magnus%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/451400/IdlePixel%20Magnus%20Macros.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MagnusMacrosPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("magnus-macros", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        label: "Macros",
                        type: "label"
                    },
                    {
                        id: "macro1",
                        label: "/mm 1",
                        type: "string",
                        default: ""
                    },
                    {
                        id: "macro2",
                        label: "/mm 2",
                        type: "string",
                        default: ""
                    },
                    {
                        id: "macro3",
                        label: "/mm 3",
                        type: "string",
                        default: ""
                    },
                    {
                        id: "macro4",
                        label: "/mm 4",
                        type: "string",
                        default: ""
                    },
                    {
                        id: "macro5",
                        label: "/mm 5",
                        type: "string",
                        default: ""
                    },
                    {
                        id: "macro6",
                        label: "/mm 6",
                        type: "string",
                        default: ""
                    },
                    {
                        id: "macro7",
                        label: "/mm 7",
                        type: "string",
                        default: ""
                    },
                    {
                        id: "macro8",
                        label: "/mm 8",
                        type: "string",
                        default: ""
                    },
                    {
                        id: "macro9",
                        label: "/mm 9",
                        type: "string",
                        default: ""
                    }
                ]
            });
        }

        onLogin() {
            IdlePixelPlus.registerCustomChatCommand("mm", (command, message) => {
                    message = (message||"").trim();
                    if(!message) {
                        return;
                    }
                    if(/^[0-9]$/.test(message)) {
                        const text = this.getConfig(`macro${message}`);
                        if(text) {
                            //console.log(`CHAT=${text}`);
                            IdlePixelPlus.sendMessage(`CHAT=${text}`);
                        }
                    }

                }, "Send a configured macro in chat with /%COMMAND% 1, /%COMMAND% 2, /%COMMAND% 3, etc.");

        }


    }

    const plugin = new MagnusMacrosPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();