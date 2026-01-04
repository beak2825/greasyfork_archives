// ==UserScript==
// @name         Idle-Pixel Teams Storage Manager
// @namespace    luxferre.dev
// @version      1.3.0
// @description  Library for parsing teams storage data.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// ==/UserScript==

(function() {
	if(window.TStore) {
		// already loaded
		return;
	}

	class TeamStore extends IdlePixelPlusPlugin {
		constructor() {
			super("teamstore", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            })
			this.store = {}
			this.item_list = []
			this.category_map = {}
			this.categories = {
				"brewing": [],
				"mining": [],
				"crafting": [],
				"farming": [],
				"gathering": [],
				"woodcutting": [],
				"cooking": [],
				"fishing": [],
				"combat": [],
				"invention": [],
				"chests": [],
				"other": []
			}
		}
		
		onLogin(){
			if (window.var_team_name == null){
				delete IdlePixelPlus.plugins.teamstore
				return
			}
			this.spawn_observer()
			Modals.clicksAddItemTeamStorage()
			IdlePixelPlus.sendMessage("TEAM_REFRESH_STORAGE")
		}
		
		onMessageReceived(message) {
			if(TStore.item_list.length === 0 && message.startsWith("TEAMS_TRADABLES_MODAL")){
				TStore.item_list = message.split("=")[1].split("~")
				TStore.create_categories()
			}
			if(message.startsWith("TEAMS_STORAGE_DATA")){
				this.parse_and_update(message.split("=")[1])
			}
		}
		
		spawn_observer(){
			const targetNode = document.getElementById("modal-teamstorage-select-item")

			const config = { attributes: true, childList: true, subtree: true }
			const callback = function(mutationsList, observer) {
				$("#modal-teamstorage-select-item").modal("hide")
				observer.disconnect()
			}
			
			const observer = new MutationObserver(callback);
			observer.observe(targetNode, config);
		}
				
		parse_and_update(storage_string){
			TStore.store = {}
			const data_array = storage_string.split("~")
			for (let i = 0; i<data_array.length - 1; i+=2) {
				TStore.store[data_array[i]] = data_array[i+1]
			}
		}
		
		create_categories(){
			const unsorted_items = new Set(this.item_list)
			const panel_list = ["brewing", "mining", "crafting", "farming", "gathering", "woodcutting", "cooking", "fishing", "combat", "invention"]
			
			panel_list.forEach(panel =>{
				$("itembox", $(`#panel-${panel}`)).each((index, obj)=>{
				    const item_name = $(obj).data("item")
					if(unsorted_items.has(item_name)){
						TStore.category_map[item_name] = panel
						TStore.categories[panel].push(item_name)
						unsorted_items.delete(item_name)
					}
				})
			})
			unsorted_items.forEach(item_name=>{
				if(item_name.includes("gaurdian")){
					TStore.category_map[item_name] = "combat"
					TStore.categories.combat.push(item_name)
					unsorted_items.delete(item_name)
				} else if(["key", "orb", "chest"].some(type=>{
					if(item_name.includes(type)){
						TStore.category_map[item_name] = "chests";
						TStore.categories.chests.push(item_name);
						unsorted_items.delete(item_name)
						return true
					}
				})){} else {
					TStore.category_map[item_name] = "other"
					TStore.categories.other.push(item_name)
				}
			})
		}
	}

	// Add to window and init
	window.TStore = new TeamStore()
	IdlePixelPlus.registerPlugin(TStore);
})();