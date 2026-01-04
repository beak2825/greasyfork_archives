// ==UserScript==
// @name         IdlePixel Noncify
// @namespace    com.zlef.idlepixel
// @version      2.0.0
// @description  Fix the username of the nonce, V2 includes message fixing!
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/477803/IdlePixel%20Noncify.user.js
// @updateURL https://update.greasyfork.org/scripts/477803/IdlePixel%20Noncify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Noncify extends IdlePixelPlusPlugin {
        constructor() {
            super("noncify", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });


        }

        onChat(data) {
            if (data.username === "huay") {
                const chatArea = document.querySelector('#chat-area');
                const chatMessages = chatArea.querySelectorAll('div');

                chatMessages.forEach((msg) => {
                    const usernameSpan = msg.querySelector('.chat-username');
                    if (usernameSpan && usernameSpan.innerText === 'huay') {
                        usernameSpan.innerText = 'nonce';

                        const messagePart = msg.lastChild;
                        if (messagePart && messagePart.nodeValue) {
                            messagePart.nodeValue = ` ${String.fromCodePoint(128557)}${String.fromCodePoint(128557)}${String.fromCodePoint(128557)}`;
                        }
                    }
                });
            }
        }

    }

    const plugin = new Noncify();
    IdlePixelPlus.registerPlugin(plugin);

})();