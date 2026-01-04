// ==UserScript==
// @name         IdlePixel Database Link Remover
// @namespace    lbtechnology.info
// @version      1.0.1
// @description  Stops items being turned into database etc links in chat
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/477042/IdlePixel%20Database%20Link%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/477042/IdlePixel%20Database%20Link%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class NoLinksPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("nolinks", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.previous = "";
        }

    onLogin(){
            SearchAnythingData.create_link_for_chat = (data) => {return data}
        }
    }

    const plugin = new NoLinksPlugin();
        IdlePixelPlus.registerPlugin(plugin);
    
})(); 