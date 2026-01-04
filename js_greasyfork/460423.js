// ==UserScript==
// @name         IdlePixel Sigil Randomizer
// @namespace    lbtechnology.info
// @version      1.2.0
// @description  Randomizes sigil after every message
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/460423/IdlePixel%20Sigil%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/460423/IdlePixel%20Sigil%20Randomizer.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let sigilList = []

    function randInt(max) {
        return Math.floor(Math.random() * max);
    }
 
    class SigilPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("sigils", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [{
                    id: "activeNames",
                    label: "List of your accounts that have the randomizer active (leave empty for all.)",
                    type: "string",
                    max: 2000,
                    default: ""
                },
                {
                    id: "randomizerEnabled",
                    label: "Randomizer enabled?",
                    type: "boolean",
                    default: true
                }]
            });
            this.previous = "";
        }
  
        onChat(data) {
            const nameList = this.getConfig("activeNames");
            const randomizerEnabled = this.getConfig("randomizerEnabled");
            if(randomizerEnabled){
                if (nameList.includes(var_username) || nameList == "") {
                    if (data.username === var_username){
                        IdlePixelPlus.sendMessage('CHAT_SIGIL=' + sigilList[randInt(sigilList.length)])
                    }
                }
            }
        }
 
        onLogin(){
            this.fetchSigils()
        }

        fetchSigils(){
            const sigilSelection = $(`itembox[data-tooltip="sigil"]`).not(`itembox[style="display: none;"]`)
            
            sigilSelection.each((k, v)=> {sigilList.push($(v).data("item"))})
        }
    }
 
    const plugin = new SigilPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})(); 