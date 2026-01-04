// ==UserScript==
// @name         IdlePixel Cryptoe AutoRefresh
// @namespace    com.anwinity.idlepixel
// @version      1.0.0
// @description  Automatically refresh cryptoe panel when open.
// @author       Wynaan
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/480327/IdlePixel%20Cryptoe%20AutoRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/480327/IdlePixel%20Cryptoe%20AutoRefresh.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class CryptoePlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("cryptoe_overhaul", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.refreshIntervalId = undefined;
        }

        onConfigsChanged() {

        }

        onLogin() {
            $("head").append(`
            <style id="styles-cryptoe">
                
            </style>
            `);
         }

        onPanelChanged(_, panelAfter) {
            if(/criptoe/.test(panelAfter)) {
                CToe.called = false;
                CToe.refresh_panel();

                this.refreshIntervalId = setInterval(() => {
                    CToe.called = false;
                    CToe.refresh_panel();
                }, 30000);
            }
            else if(this.refreshIntervalId) {
                clearInterval(this.refreshIntervalId);
            }
        }
    }

    const plugin = new CryptoePlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();