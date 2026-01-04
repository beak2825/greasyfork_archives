// ==UserScript==
// @name         IdlePixel Chat History
// @namespace    lbtechnology.info
// @version      1.1.0
// @description  Adds the previous 5 chat messages when you log in
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/479474/IdlePixel%20Chat%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/479474/IdlePixel%20Chat%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class ChatHistoryPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("chathist", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.previous = "";
            this.tradeHistStream = [];
        }

        onLogin(){
            this.tradeHistStream = []
            
            const content = `chathist:logon:hello`
            const payload = {
                content: content, 
                onResponse: function(player, content, callbackId) {
                    return true;
                    },
                onOffline: function(player, content) {
                    console.log(content)
                },
                timeout: 2000 // callback expires after 2 seconds
            }
            IdlePixelPlus.sendCustomMessage("luxbot", payload)
        }
    
        onCustomMessageReceived(player, content, callbackId){
            const customData = this.parseCustom(player, content, callbackId)
            if (!(customData.plugin === "chathist" || customData.anwinFormatted)){
                return
            }
            if (customData.player === "luxbot"){
                if (customData.command === "addMessage"){
                    this.tradeHistStream.push(customData.payload)
                } else if (customData.command === "endstream"){
                    this.addToChat(this.tradeHistStream)
                }
            }
        }
    
        parseCustom(player, content, callbackId){
            const customData = {
                player: player,
                callbackId: callbackId,
                anwinFormatted: false
            }
            const splitPayload = content.split(":")
            if(splitPayload.length >= 3){
                customData.anwinFormatted = true
                customData.plugin = splitPayload[0]
                customData.command = splitPayload[1]
                customData.payload = splitPayload.slice(2).join(":")
            } else {
                customData.anwinFormatted = false
                customData.plugin = "unknown"
                customData.command = "unknown"
                customData.payload = content
            }
    
            return customData

        }
    
        addToChat(chatHistList){
            chatHistList.forEach(message => {
                Chat.add_to_chat_box(message)
                if ("chatlinks" in IdlePixelPlus.plugins){
                    IdlePixelPlus.plugins['chatlinks'].onChat("")
                }
            })
        }
    }

    const plugin = new ChatHistoryPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
