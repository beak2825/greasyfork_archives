// ==UserScript==
// @name         IdlePixel Quick Fight Go Brrrrr
// @namespace    com.anwinity.idlepixel
// @version      1.0.0
// @description  Adds space hotkey for "Collect Loot & Fight Again" button when quick fighting.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/524784/IdlePixel%20Quick%20Fight%20Go%20Brrrrr.user.js
// @updateURL https://update.greasyfork.org/scripts/524784/IdlePixel%20Quick%20Fight%20Go%20Brrrrr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const IMAGE_URL = "https://cdn.idle-pixel.com/images/";

    class QuickFightGoBrrrrrPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("quickfightgobrrrrr", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        handleSpace(event) {
            const focused = document.activeElement;
            if(focused && (focused.tagName == 'INPUT' || focused.tagName == 'TEXTAREA' || focused.isContentEditable)) {
                return;
            }

            const button = document.querySelector("#modal-loot.show button#modal-loot-collect-and-fight");
            if(!button) {
                return;
            }
            const computedButtonStyles = window.getComputedStyle(button);
            if(computedButtonStyles.display == "none" || computedButtonStyles.visibility == "hidden") {
                return;
            }

            event.preventDefault();
            button.click();
        }

        onLogin() {
            document.addEventListener("keydown", (event) => {
                if(event.key === " ") {
                    this.handleSpace(event);
                }
            });
        }
    }

    const plugin = new QuickFightGoBrrrrrPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();