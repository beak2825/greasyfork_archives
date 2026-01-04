// ==UserScript==
// @name         IdlePixel No More No Arrows
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Suppresses the green text animation when you're out of arrows
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/479263/IdlePixel%20No%20More%20No%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/479263/IdlePixel%20No%20More%20No%20Arrows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class NoNoArrowPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("nonoarrow", {
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
            var defaultToastAnim = Animations.scrollText
            Animations.scrollText = (icon, colorChosen, textChosen) => {
                if (textChosen==="YOU DON'T HAVE ANY ARROWS!"){
                    return
                } else {
                    defaultToastAnim(icon, colorChosen, textChosen)
                }
            }
        }
    }

    const plugin = new NoNoArrowPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
