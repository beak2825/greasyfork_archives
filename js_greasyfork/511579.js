// ==UserScript==
// @name         IdlePixel Harvest All Mover
// @namespace    luxferre.dev
// @version      1.0.0
// @description  Moves the Harvest All buddy to the start
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/511579/IdlePixel%20Harvest%20All%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/511579/IdlePixel%20Harvest%20All%20Mover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class HarvestMovePlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("harvest_move", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            })
        }
        onLogin() {
			const container = $(".unselectable", $("#panel-farming"))
			const harvest = container.find(`[data-item='green_leaf_buddy']`)
			harvest.prependTo(container)
		}
    }

    const plugin = new HarvestMovePlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();
