// ==UserScript==
// @name         Quick Cookbook
// @namespace    uniquenamespace
// @version      1.0.1
// @description  Right click cook book to claim and start the same recipe.
// @author       shtos
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/453118/Quick%20Cookbook.user.js
// @updateURL https://update.greasyfork.org/scripts/453118/Quick%20Cookbook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class QuickCookbook extends IdlePixelPlusPlugin {
        constructor() {
            super("quick_cookbook", { // unique plugin id, "sample"
                about: { // optional, but highly recommended
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }
        onLogin(){
            $(`itembox[data-item="cooks_book"]`).on("contextmenu", event => {
                event.stopPropagation();
                event.preventDefault();
                if (IdlePixelPlus.getVarOrDefault('cooks_book_timer', 2, 'int') >0){
                    let recipe = IdlePixelPlus.getVarOrDefault('cooks_book_item', 0, 'string')
                    websocket.send('COOKS_BOOK_READY')
                    if (recipe == 'none') return
                    setTimeout(()=>{
                        websocket.send('COOKS_BOOK=' + recipe)
                    },1100)
                } 
              });
        }
    }

    const plugin = new QuickCookbook();
    IdlePixelPlus.registerPlugin(plugin); // register the plugin

})();