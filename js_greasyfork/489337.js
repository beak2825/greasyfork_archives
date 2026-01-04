// ==UserScript==
// @name         IdlePixel Mine All Meteors!
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Opens all meteors with right click
// @author       Cammyrock
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/489337/IdlePixel%20Mine%20All%20Meteors%21.user.js
// @updateURL https://update.greasyfork.org/scripts/489337/IdlePixel%20Mine%20All%20Meteors%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class MeteorPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("meteorplugin", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.previous = "";
        }

        onLogin(){
            this.vars = {
                tracking_meteors: false,
                total_meteors: 0,
                meteors_opened: 0,
                items_acquired: {}
            }

            $(`itembox[data-item="meteor"]`).attr("oncontextmenu", "event.preventDefault(); IdlePixelPlus.plugins.meteorplugin.openAll()")
        }

        onMessageReceived(data){
            if(!this.vars){return}
            if(this.vars.tracking_meteors && data.startsWith("OPEN_LOOT_DIALOGUE")){
                const values = data.split("=")[1]
                const values_array = values.split("~")

                const items = this.parseItemData(values_array)
                this.vars.items_acquired = this.addToLoot(this.vars.items_acquired, items)

                this.vars.meteors_opened++;
                if (this.vars.meteors_opened>=this.vars.total_meteors){
                    this.vars.tracking_meteors = false
                    this.createLootPopup()
                }
            }
        }

        openAll(){
            this.vars = {
                tracking_meteors: true,
                total_meteors: 0,
                meteors_opened: 0,
                items_acquired: {}
            }

            this.vars.total_meteors = window[`var_meteor`]

            for (let i = 0; i < this.vars.total_meteors; i++) {
                websocket.send(`MINE_METEOR`);
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
            let items = {}

            let image = ""
            let number = ""
            let label = ""
            let background = ""

            for(let i = 1; i < values_array.length; i+=0){
                image = values_array[i];
                i++;
                [number, ...label] = values_array[i].split(" ");
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
            for (let [itemName, value] of Object.entries(this.vars.items_acquired)){
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

    const plugin = new MeteorPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();