// ==UserScript==
// @name         IdlePixel Loot Popup Remover
// @namespace    lbtechnology.info
// @version      1.1.1
// @description  Stops vanilla loot popups, leaving only loot log
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/478639/IdlePixel%20Loot%20Popup%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/478639/IdlePixel%20Loot%20Popup%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class NoLootPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("noloot", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
				},
				config: [
					{
						label: `<div class="d-flex w-100"><span class="align-self-center col-6">Allowed Popups</span><span class="col-6"><button class="btn btn-primary" type="button" onclick="IdlePixelPlus.plugins.noloot.showModal(&quot;noloot&quot;, &quot;allowedPopups&quot;)">Edit List</button></span></div>`,
						type: "label"
					}
				]
            });
            this.previous = "";
			this.allowedPopups = new Set()
        }

    	onLogin(){
			this.addStyles()
			this.loadAllowed()
			this.createModal()
			
			this.originalOpenLootDialogue = Modals.open_loot_dialogue;
			
            Modals.open_loot_dialogue = this.openLootDialogue;
        }
	
		openLootDialogue(loot_images_array, loot_labels_array, loot_background_color_array, extra_data, levelups_data){
			const allowedSet = IdlePixelPlus.plugins.noloot.allowedPopups
			let showModal = loot_labels_array.some(label => {
				return [...allowedSet].some(filterItem => {
					return label.toLowerCase().includes(filterItem.toLowerCase())
				})
			});
			
			if (showModal){
				IdlePixelPlus.plugins.noloot.originalOpenLootDialogue(loot_images_array, loot_labels_array, loot_background_color_array, extra_data, levelups_data)
				return;
			}
			
			var logger = []
			for(var i = 0; i < loot_images_array.length; i++){
				var image = loot_images_array[i];
				var label = loot_labels_array[i];
				var background_color = loot_background_color_array[i];

				logger.push({
					'image': image,
					'label': label,
					'color': background_color,
				})
			}

			try {
				var logObj = new LogManager()
				logObj.add_entry('monster_drop', logger);
			} catch (error) {
				console.log(error);
			}
		}
	
		createModal(){
			const modalString = `
<div id="listHandleModal" class="modal fade" role="dialog" tabindex="-1"">
    <div class="modal-dialog" role="document">
        <div id="listHandleModalInner" class="modal-content">
            <div class="modal-body">
                <div id="listHandleList" class="overflow-auto"></div>
            </div>
            <div id="listHandleModalFooter">
                <form style="margin-right: 10px;margin-left: 10px;" onsubmit="event.preventDefault(); IdlePixelPlus.plugins.noloot.addItemModal();">
                    <div class="row d-flex flex-fill">
                        <div class="col-10"><input id="listHandleInput" class="form-control w-100" type="text" /></div>
                        <div class="col-2"><input id="listHandleButton" class="w-100 h-100 rounded-pill" type="submit" value="Add" /></div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
			`
			
			const modalElement = $.parseHTML(modalString)
			$(document.body).append(modalElement)
		}
	
		loadAllowed(){
			const allowedJSON = localStorage.getItem("noLootAllowed")
			
			if (allowedJSON){
				const allowedList = JSON.parse(allowedJSON)
				allowedList.forEach(item=>{this.allowedPopups.add(item)})
			}
		}
	
		saveAllowed(){
			const allowedSet = this.allowedPopups
			const allowedJSON = JSON.stringify([...allowedSet])
			localStorage.setItem("noLootAllowed", allowedJSON)
		}
	
		addStyles(){
			let backgroundColour
			let textColour

			if ("ui-tweaks" in IdlePixelPlus.plugins){
				backgroundColour = IdlePixelPlus.plugins["ui-tweaks"].config["color-chat-area"]
				textColour = IdlePixelPlus.plugins["ui-tweaks"].config["font-color-chat-area"]
			} else {
				backgroundColour = "white"
				textColour = "black"
			}
			const styles = `
#listHandleModalFooter {
  padding: calc(var(--bs-modal-padding) - var(--bs-modal-footer-gap) * .5);
  background-color: var(--bs-modal-footer-bg);
  border-top: var(--bs-modal-footer-border-width) solid var(--bs-modal-footer-border-color);
  border-bottom-right-radius: var(--bs-modal-inner-border-radius);
  border-bottom-left-radius: var(--bs-modal-inner-border-radius);
}

.listItem {
  background-color: RGBA(1, 150, 150, 0.5);
  margin-bottom: 2px;
}

.listHandleCross {
  border-right-style: ridge;
  margin-left: 5px;
  padding-right: 3px;
}

.listHandleText {
  margin-left: 6px;
}

#listHandleModalInner {
  background-color: ${backgroundColour};
  color: ${textColour};
}
`
			const styleElement = `<style id="styles-lootRemover">${styles}</style>`
			$("head").append(styleElement)
		}
	
		addItemModal(){
			const inputBox = $("#listHandleInput")
			const newItem = inputBox.val()
			inputBox.val("")
			
			this.addItem(newItem)
		}
	
		addItem(newItem){
			this.allowedPopups.add(newItem)
			const newItemString = `<div class="listItem rounded-pill" id="${newItem}" onclick="event.preventDefault(); IdlePixelPlus.plugins.noloot.removeItem(this.getAttribute(&#39;id&#39;))"><span class="listHandleCross">❌</span><span class="listHandleText">${newItem}</span></div>`
			const newItemElement = $.parseHTML(newItemString)
			$("#listHandleList").append(newItemElement)
			this.saveAllowed()
		}
	
		removeItem(removedItem){
			const listHandleModal = $('#listHandleModal')
			const currentPlugin = listHandleModal.attr("data-lh-plugin")
			const currentList = listHandleModal.attr("data-lh-listName")
			
			this[currentList].delete(removedItem)
			
			$(`#${removedItem}`).remove()
			this.saveAllowed()
		}
	
		showModal(plugin, listName){
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			$("#listHandleList").empty()
			this[listName].forEach(listItem=>{this.addItem(listItem)})
			
			const listHandleModal = $('#listHandleModal')
			listHandleModal.attr("data-lh-plugin", plugin)
			listHandleModal.attr("data-lh-listName", listName)
			listHandleModal.modal('show');
		}
    }
	
    const plugin = new NoLootPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();