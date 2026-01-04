// ==UserScript==
// @name         IdlePixel Bait Thrower
// @namespace    lbtechnology.info
// @version      1.0.5
// @description  Opens x amount of bait at once and collates the loot
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/478580/IdlePixel%20Bait%20Thrower.user.js
// @updateURL https://update.greasyfork.org/scripts/478580/IdlePixel%20Bait%20Thrower.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class BaitPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("baitplugin", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
			this.tracking_bait = false
			this.total_bait_loots = 0
			this.bait_counter = 0
			this.bait_loot = {}
        }

        onLogin(){
            $(`itembox[data-item="bait"]`).attr("onClick", "IdlePixelPlus.plugins.baitplugin.open_input_dialogue('BAIT')")
            $(`itembox[data-item="super_bait"]`).attr("onClick", "IdlePixelPlus.plugins.baitplugin.open_input_dialogue('SUPER_BAIT')")
            $(`itembox[data-item="mega_bait"]`).attr("onClick", "IdlePixelPlus.plugins.baitplugin.open_input_dialogue('MEGA_BAIT')")
        }
        
        onMessageReceived(data){
            if(this.tracking_bait && data.startsWith("OPEN_LOOT_DIALOGUE")){
                const values = data.split("=")[1]
                const values_array = values.split("~")
                    
                const items = this.parseItemData(values_array)
                this.bait_loot = this.addToLoot(this.bait_loot, items)
                    
                this.bait_counter++;
                if (this.bait_counter>=this.total_bait_loots){
                    this.tracking_bait = false
                    this.createLootPopup()
                }
            }
        }
    
        open_input_dialogue(bait_type){
            const prettyBaitName = bait_type.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            document.getElementById("modal-input-image").src = get_image(`images/${bait_type.toLowerCase()}.png`);
            document.getElementById("modal-input-description").innerHTML = `How many ${prettyBaitName} do you want to throw?`;
            document.getElementById("modal-input-text").value = 0;
            document.getElementById("modal-input-button-text").innerHTML = "Throw!";
    
            document.getElementById("modal-input-button").onclick = function()
            {
                IdlePixelPlus.plugins.baitplugin.throwBait(bait_type, parseInt(document.getElementById("modal-input-text").value));
            }
    
            Modals.toggle("modal-item-input");
        }
    
        throwBait(bait_type, num){
            this.bait_counter = 0;
            this.bait_loot = {}
            this.tracking_bait = true

            const currentBait = window[`var_${bait_type.toLowerCase()}`]

            if(num > currentBait){
                this.total_bait_loots = currentBait
            } else {
                this.total_bait_loots = num
            }
    
            for (let i = 0; i < this.total_bait_loots; i++) {
                websocket.send(`THROW_${bait_type}`);
            }
        }
    
        addToLoot(totalLoot, newLoot){
            for (let [itemName, value] of Object.entries(newLoot)) {
                if (totalLoot.hasOwnProperty(itemName)){
                    totalLoot[itemName].number = totalLoot[itemName].number + value.number
                } else {
                    totalLoot[itemName] = value
                }
            }
            return totalLoot
        }
        
        parseItemData(values_array){
            const items = {}
            
            let background = ""
                
            for(let i = 2; i < values_array.length; i+=0){
                const image = values_array[i];
                i++;
                let [number, ...label] = values_array[i].split(" ");
                number = parseInt(number)
                label = label.join(" ")
                i++;
                background = values_array[i];
                i++;
                items[image] = {
                    number: number,
                    label: label,
                    background: background
                }
            }
                return items
            }
    
        createLootPopup(){
            const images = [];
            const labels = [];
            const background = [];
            for (let [itemName, value] of Object.entries(this.bait_loot)){
                images.push(itemName);
                const newLabel = `${value.number} ${value.label}`
                labels.push(newLabel);
                background.push(value.background);
            }

            this.open_loot_dialogue(images, labels, background);
        }
    
        open_loot_dialogue(loot_images_array, loot_labels_array, loot_background_color_array){
            const loot_body = document.getElementById("modal-loot-body");
    
            let html = "";
            for(let i = 0; i < loot_images_array.length; i++)
            {
                let image = loot_images_array[i];
                let label = loot_labels_array[i];
                let background_color = loot_background_color_array[i];
    
                if(!isNaN(label))
                    label = "+" + format_number(label);
    
                if(label.endsWith("(NEW)"))
                {
                    label = label.substring(0, label.length-5);
                    label += " <img class='blink' src='https://idlepixel.s3.us-east-2.amazonaws.com/images/new.png' />"
                }
                if(label.endsWith("(UNIQUE)"))
                {
                    label = label.substring(0, label.length-8);
                    label += " <img class='blink' src='https://idlepixel.s3.us-east-2.amazonaws.com/images/unique.png' />"
                }
                html += "<div class='loot' style='background-color:"+background_color+"'>";
                html += "<img src='https://idlepixel.s3.us-east-2.amazonaws.com/"+image+"' class='w50 me-3' />";
                html += label;
                html += "</div>";
            }
            loot_body.innerHTML = html;
            if($('#modal-loot:visible').length == 0){
                Modals.toggle("modal-loot");
            }
        }
    }

    const plugin = new BaitPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})(); 