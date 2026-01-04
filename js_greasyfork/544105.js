// ==UserScript==
// @name         FlatMMO+ SamplePlugin
// @namespace    com.dounford.flatmmo.sample
// @version      0.0.2
// @description  FlatMMO+ Template Script
// @author       Anwinity ported by Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @downloadURL https://update.greasyfork.org/scripts/544105/FlatMMO%2B%20SamplePlugin.user.js
// @updateURL https://update.greasyfork.org/scripts/544105/FlatMMO%2B%20SamplePlugin.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class SamplePlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("sample", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        type: "label",
                        label: "Section Label:"
                    },
                    {
                        id: "MyCheckbox",
                        label: "Yes / No",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "MyInteger",
                        label: "Pick a Integer Number",
                        type: "integer",
                        min: 1,
                        max: 10,
                        type: "integer",
                        default: 1
                    },
                    {
                        id: "MyNumber",
                        label: "Pick a Float Number",
                        type: "number",
                        min: 0,
                        max: 10,
                        step: 0.1,
                        default: 1.5
                    },
                    {
						id: "myRange",
						label: "Choose a volume",
						type: "range",
						min: 0,
						max: 100,
						step: 1,
						default: 100,
					},
                    {
                        id: "MyString",
                        label: "Enter a Thing",
                        type: "string",
                        max: 20,
                        default: "x"
                    },
                    {
                        id: "MySelect",
                        label: "Pick One",
                        type: "select",
                        options: [
                            {value: "opt1", label: "Option 1"},
                            {value: "opt2", label: "Option 2"},
                            {value: "opt3", label: "Option 3"}
                        ],
                        default: "opt2"
                    },
                    {
                        id: "myColor",
                        label: "Pick a color",
                        type: "color"
                    },
                    {
                        id: "inventoryPanel",
                        label: "Go to Inventory",
                        type: "panel",
                        panel: "inventory"
                    }
                ]
            });
        }

        
        
        onConfigsChanged() {
            console.log("SamplePlugin.onConfigsChanged");
        }
        
        //Run this function when the login is completed, if the plugin is loaded after login it will run as soon as possible
        onLogin() {
            console.log("SamplePlugin.onLogin");
        }
        
        
        //Receives all messages sent by the game server
        onMessageReceived(data) {
            // Will spam the console, uncomment if you want to see it
            //console.log("SamplePlugin.onMessageReceived: ", data);
        }
        
        //This is called on pm, local and global chat messages
        onChat(data) {
            //This is how data is passed:
            const chatData = {
                username: "felipe",
                tag: "investor",
                sigil: "images/ui/gift_sigil.png",
                color: "white",
                message: "This is a message",
                yell: false
            }
            // Could spam the console, uncomment if you want to see it
            //console.log("SamplePlugin.onChat", data);
        }
        
        //Called on UI panel switches
        onPanelChanged(panelBefore, panelAfter) {
            console.log("SamplePlugin.onPanelChange", panelBefore, panelAfter);
        }
        
        //Called when the player changes map
        onMapChanged(mapBefore, mapAfter) {
            // console.log("SamplePlugin.onMapChange", mapBefore, mapAfter);
        }
        
        //Called everytime something changes in the inventory
        onInventoryChanged(inventoryBefore, inventoryAfter) {
            //It sends the full inventory even if you just got one item
            //It spams the console each time any modification happens
            // console.log("SamplePlugin.onInventoryChange", inventoryBefore, inventoryAfter);
        }

        //Called when the player engages in a fight
        onFightStarted() {

        }

        //Called when the player was fighting but starts doing other action, this can have a little delay
        onFightEnded() {

        }

        //Called when the player animation changes
        onActionChanged() {
            console.log(FlatMMOPlus.currentAction);
        }

        //Called every frame after every other paint
        onPaint() {

        }

        //Called every frame between paint_layer_1 and paint_map_objects_lower_shadows
        onPaintObjects() {

        }

        //Called every frame between paint_ground_items and paint_npcs
        onPaintNpcs() {

        }
        
        //These are used inside functions instead of being called directly by FMP
        additionalMethods() {
            //content can be html text or a function that returns html text
            FlatMMOPlus.addPanel("id","Title","content");

            //Sends messages to game server
            FlatMMOPlus.sendMessage("message");

            //You can have screen notifications
            //FlatMMOPlus.addNotification(notificationName, imageSrc, title, text, ticks, textColor);
            FlatMMOPlus.addNotification("test", "https://flatmmo.com/images/ui/hp_med.png", "TEST", "I'm a message", 18000, "blue");

            const sheet = new AnimationSheetPlus("name", 5, "", 50, ["url.png","url2.png", "..."])
        }
        
        
    }
    
    const plugin = new SamplePlugin();
    FlatMMOPlus.registerPlugin(plugin);
 
})();