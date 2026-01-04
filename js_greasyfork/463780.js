// ==UserScript==
// @name         IdlePixel Armour Uncrafter
// @namespace    lbtechnology.info
// @version      1.0.1
// @description  Uses needle to uncraft all armour pieces.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/463780/IdlePixel%20Armour%20Uncrafter.user.js
// @updateURL https://update.greasyfork.org/scripts/463780/IdlePixel%20Armour%20Uncrafter.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    class UncrafterPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("uncrafter", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },config: [
                    {
                        id: "keepBat",
                        label: "Keep one set of bat armour?",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "keepLizard",
                        label: "Keep one set of lizard armour?",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "keepBear",
                        label: "Keep one set of bear armour?",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "keepReaper",
                        label: "Keep one set of reaper armour?",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "keepCroc",
                        label: "Keep one set of croc armour?",
                        type: "boolean",
                        default: true
                    }
            ]
            });
            this.previous = "";
        }

        onLogin(){
            const needles = ["needle", "sapphire_needle", "emerald_needle", "ruby_needle", "diamond_needle"]

            needles.forEach((needle)=>{
                if (window["var_"+needle] != "undefined"){
                    if (window["var_"+needle] > 0){
                        const needleLoc = $(`itembox[data-item="${needle}"]`);
                        needleLoc.attr("oncontextmenu", "event.preventDefault(); IdlePixelPlus.plugins.uncrafter.uncraftAll()")
                    }
                }
            })
            
        }

        uncraftAll(){
            const armourMats = ["bat", "lizard", "bear", "reaper", "crocodile"];
            const armourSlots = ["body", "boots", "gloves", "mask", "legs", "hood", "skirt"]
            const keepObj = {
                keepbat: this.getConfig("keepBat"),
                keeplizard: this.getConfig("keepLizard"),
                keepbear: this.getConfig("keepBear"),
                keepreaper: this.getConfig("keepReaper"),
                keepcrocodile: this.getConfig("keepCroc")
            }


            armourMats.forEach((mat)=>{
                const keepSub = keepObj["keep"+mat]? 1 : 0;
                armourSlots.forEach((slot)=>{
                    const armourString = `${mat}_${slot}`
                    const armourCount = window["var_" + armourString]
                    if (typeof armourCount != "undefined"){
                        const uncraftAmount = armourCount - keepSub
                        if (uncraftAmount > 0){
                            IdlePixelPlus.sendMessage(`USE_NEEDLE=${armourString}~${uncraftAmount}`)
                        }
                    }       
                })
            })
        }
    }
 
    const plugin = new UncrafterPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})(); 