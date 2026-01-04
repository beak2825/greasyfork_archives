// ==UserScript==
// @name         IdlePixel All the Gems!
// @namespace    lbtechnology.info
// @version      1.0.2
// @description  Opens all gem goblin bags with right click
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/480905/IdlePixel%20All%20the%20Gems%21.user.js
// @updateURL https://update.greasyfork.org/scripts/480905/IdlePixel%20All%20the%20Gems%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class GemBagPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("gembagplugin", {
                about: {
                    name: `${GM_info.script.name} (ver: ${GM_info.script.version})`,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            })
        }

        onLogin(){
            this.vars = {
                tracking_bags: false,
                total_bags: 0,
                bags_opened: 0,
                gems_acquired: {}
            }
            
            $(`itembox[data-item="gem_bag"]`).attr("oncontextmenu", "event.preventDefault(); IdlePixelPlus.plugins.gembagplugin.openAll()")
        }
        
        onMessageReceived(data){
            if(!this.vars){return}
            if(this.vars.tracking_bags && data.startsWith("OPEN_LOOT_DIALOGUE")){
                const values = data.split("=")[1]
                const values_array = values.split("~")
                    
                const items = this.parseItemData(values_array)
                this.vars.gems_acquired = this.addToLoot(this.vars.gems_acquired, items)
                    
                this.vars.bags_opened++;
                if (this.vars.bags_opened>=this.vars.total_bags){
                    this.vars.tracking_bags = false
                    this.createLootPopup()
                }
            }
        }
    
        openAll(){
            this.vars = {
                tracking_bags: true,
                total_bags: 0,
                bags_opened: 0,
                gems_acquired: {}
            }

            this.vars.total_bags = window[`var_gem_bag`]
   
            for (let i = 0; i < this.vars.total_bags; i++) {
                websocket.send(`OPEN_GEM_BAG`);
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

			for(let i = 2; i < values_array.length; i+=0){
				const image = values_array[i];
				i++;
				let [number, ...label] = values_array[i].split(" ");
				number = parseInt(number)
				label = label.join(" ")
				i++;
				const background = values_array[i];
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
            for (let [itemName, value] of Object.entries(this.vars.gems_acquired)){
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

    const plugin = new GemBagPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})(); 