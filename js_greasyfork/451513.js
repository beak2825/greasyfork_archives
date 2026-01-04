// ==UserScript==
// @name         IdlePixel Chat Links
// @namespace    com.anwinity.idlepixel
// @version      1.0.1
// @description  Make links great again.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require      https://cdnjs.cloudflare.com/ajax/libs/anchorme/2.1.2/anchorme.min.js
// @downloadURL https://update.greasyfork.org/scripts/451513/IdlePixel%20Chat%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/451513/IdlePixel%20Chat%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ChatLinksPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("chatlinks", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        replaceLinks(message) {
            return anchorme({
                input: message,
                options: {
                    attributes: {
                        target: "_blank"
                    }
                }
            }).replace(/<a(.*?)href="(.+?)"(.*?)>(.+?)<\/a>(-+)/g, '<a$1href="$2$5"$3>$4$5</a>');
        }

        onChat(data) {
            const el = $("#chat-area > *").last();
            el.html(this.replaceLinks(el.html()));
        }

    }

    const plugin = new ChatLinksPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();