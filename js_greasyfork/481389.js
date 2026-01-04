// ==UserScript==
// @name         IdlePixel Websocket Messenger
// @namespace    lbtechnology.info
// @version      1.1.1
// @description  Sends websocket messages
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20240410
// @downloadURL https://update.greasyfork.org/scripts/481389/IdlePixel%20Websocket%20Messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/481389/IdlePixel%20Websocket%20Messenger.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
  
    class WSMessengerPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("wsmessenger", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.previous = "";
        }

        createPanel(){
            IdlePixelPlus.addPanel("wsmessenger", "Websocket Messenger", function() {
                const content = `
                    <div>
                        <form onsubmit='event.preventDefault(); IdlePixelPlus.plugins.wsmessenger.sendMessage()'>
                            <div class="d-flex flex-fill">
                                <div class="col-11">
                                    <input type="text" class="w-100" id="wsmessenger_input" placeholder="message">
                                </div>
                                <div class="col-1">
                                    <input type="submit" class="w-100" value="Send">
                                </div>
                            </div>
                        </form>
                    </div>
                `
                return content
            });
        }

        onLogin(){
			Paneller.registerPanel("wsmessenger", "Websocket Messenger")
            this.createPanel()
        }
    
        sendMessage(){
            const inputbox = $("#wsmessenger_input")
            const message = inputbox.val()
            inputbox.val("")
            IdlePixelPlus.sendMessage(message)
        }
    
    }
 
    const plugin = new WSMessengerPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})(); 