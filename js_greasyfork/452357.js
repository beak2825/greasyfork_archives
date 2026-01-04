// ==UserScript==
// @name         IdlePixel Item Hider
// @namespace    com.anwinity.idlepixel
// @version      1.0.0
// @description  Hide yo wife, hide yo kids, hide yo itemboxes
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/452357/IdlePixel%20Item%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/452357/IdlePixel%20Item%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const items = $("itembox[data-item]").toArray().map(el => el.getAttribute("data-item")).sort();

    class ItemHiderPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("itemhider", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    ... items.map(i => {
                        return {
                            id: "hide-"+i,
                            label: "Hide "+i,
                            type: "boolean",
                            default: false
                        }
                    })
                ]
            });
        }

        onConfigsChanged() {
            items.forEach(i => {
                const hide = this.getConfig("hide-"+i);
                if(hide) {
                    $(`itembox[data-item="${i}"]`).addClass("force-hidden");
                }
                else {
                    $(`itembox[data-item="${i}"]`).removeClass("force-hidden");
                }
            });
        }


        onLogin() {
            const self = this;

            $("head").append(`
            <style id="styles-itemhider">

              itembox.force-hidden {
                display: none !important;
              }

            </style>
            `);

            this.onConfigsChanged();
        }

    }

    const plugin = new ItemHiderPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();