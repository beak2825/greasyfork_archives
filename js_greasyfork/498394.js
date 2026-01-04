// ==UserScript==
// @name         Idle-Pixel Teams Notifier
// @namespace    lbtechnology.info
// @version      1.3.0
// @description  Plugin for sending notifications to the team discord server.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20240616
// @require		 https://greasyfork.org/scripts/484046/code/IdlePixel%2B%20Custom%20Handling.js?anticache=20240616
// @require		 https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20240616
// @downloadURL https://update.greasyfork.org/scripts/498394/Idle-Pixel%20Teams%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/498394/Idle-Pixel%20Teams%20Notifier.meta.js
// ==/UserScript==

(function() {
	'use strict';

	class TeamsNotifier extends IdlePixelPlusPlugin {
		constructor() {
			super("teamsnotifier", {
				about: {
					name: `${GM_info.script.name} (ver: ${GM_info.script.version})`,
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description
				},
			})
			this.settings = {}
			this.loadSettings()
		}
		
		gen_default_settings(){
			return {
				discord_id: "",
				team_hook: "",
				player_hook: "",
				enabled_notifications: {
					full_fp: true,
					angel_orb: true,
					gems: true,
					trees: true,
					plants: true,
					map: true,
					green_map: true,
					red_map: true
				}
			}
		}
		
		gen_main_notif_map(){
			return {
				full_fp: {
					display: "Full Fight Points",
					enabled: this.settings.enabled_notifications.full_fp,
					condition(){return parseInt(window["var_fight_points"]) === parseInt(window["var_max_fight_points"])},
					reset_condition(){return parseInt(window["var_fight_points"]) < parseInt(window["var_max_fight_points"])},
					message: `<@${this.settings.discord_id}>: ${window["var_username"]}'s FP is full!`,
					notified: true
				},
				angel_orb: {
					display: "Angel Orb Ready",
					enabled: this.settings.enabled_notifications.angel_orb,
					condition(){return typeof window["var_crystal_ball_timer"] != 'undefined' && window["var_crystal_ball_timer"] === "0"},
					reset_condition(){return typeof window["var_crystal_ball_timer"] != 'undefined' && window["var_crystal_ball_timer"] !== "0"},
					message: `<@${this.settings.discord_id}>: ${window["var_username"]}'s angel orb is ready!`,
					notified: true
				},
				trees: {
					display: "Trees Ready",
					enabled: this.settings.enabled_notifications.trees,
					condition(){return IdlePixelPlus.plugins.teamsnotifier.all_trees_ready()},
					reset_condition(){return !IdlePixelPlus.plugins.teamsnotifier.all_trees_ready()},
					message: `<@${this.settings.discord_id}>: ${window["var_username"]}'s trees are ready!`,
					notified: true
				},
				plants: {
					display: "Farms Ready",
					enabled: this.settings.enabled_notifications.plants,
					condition(){return IdlePixelPlus.plugins.teamsnotifier.all_plants_ready()},
					reset_condition(){return !IdlePixelPlus.plugins.teamsnotifier.all_plants_ready()},
					message: `<@${this.settings.discord_id}>: ${window["var_username"]}'s farming plots are ready!`,
					notified: true
				},
				map: {
					display: "Map Found",
					enabled: this.settings.enabled_notifications.plants,
					condition(){return typeof window["var_treasure_map"] !== "undefined" && parseInt(window["var_treasure_map"]) >= 1},
					reset_condition(){return typeof window["var_treasure_map"] !== "undefined" && parseInt(window["var_treasure_map"]) < 1},
					message: `<@${this.settings.discord_id}>: ${window["var_username"]} found a treasure map!`,
					notified: true
				},
				green_map: {
					display: "Green Map Found",
					enabled: this.settings.enabled_notifications.plants,
					condition(){return typeof window["var_green_treasure_map"] !== "undefined" && parseInt(window["var_green_treasure_map"]) >= 1},
					reset_condition(){return typeof window["var_green_treasure_map"] !== "undefined" && parseInt(window["var_green_treasure_map"]) < 1},
					message: `<@${this.settings.discord_id}>: ${window["var_username"]} found a green treasure map!`,
					notified: true
				},
				red_map: {
					display: "Red Map Found",
					enabled: this.settings.enabled_notifications.plants,
					condition(){return typeof window["var_red_treasure_map"] !== "undefined" && parseInt(window["var_red_treasure_map"]) >= 1},
					reset_condition(){return typeof window["var_red_treasure_map"] !== "undefined" && parseInt(window["var_red_treasure_map"]) < 1},
					message: `<@${this.settings.discord_id}>: ${window["var_username"]} found a red treasure map!`,
					notified: true
				},
			}
		}
		
		all_trees_ready(){
			const plot_template = "var_tree_stage_"
			for(let i = 1; i < 4; i++) {
				if(window[`${plot_template}${i}`] !== "4"){
					return false
				}
			}
			return true
		}
		
		all_plants_ready(){
			const plot_template = "var_farm_stage_"
			for(let i = 1; i < 4; i++) {
				if(window[`${plot_template}${i}`] !== "4"){
					return false
				}
			}
			return true
		}
		
		gen_other_notif_map(){
			return {
				gems: {
					enabled: this.settings.enabled_notifications.gems,
					display: "Gems Found"
				}	
			}
		}

		onLogin() {
			if(!this.settings.player_hook){
				Customs.sendBasicCustom("luxbot", "teamsnotif", "hook", "player")
			}
			if(!this.settings.team_hook){
				Customs.sendBasicCustom("luxbot", "teamsnotif", "hook", "team")
			}
			this.createPanel()
			this.populatePanel()
			Paneller.registerPanel("teamsnotifier", "Teams Notifier")
			this.notifications = this.gen_main_notif_map()
		}
		
		onMessageReceived(message) {
			if(window["var_team_name"] !== "AmyAndTheFeralCats"){return}
			if(message.startsWith("SET_ITEMS")){
				for (const [ident, data] of Object.entries(this.notifications)) {
					if(!data.enabled){continue}
					if(data.condition() && !(data.notified)){
						this.sendWebhook(this.settings.player_hook, data.message)
						this.notifications[ident].notified = true
					} else if (data.notified && data.reset_condition()){
						this.notifications[ident].notified = false
					}
				}
			}
			if(message.startsWith("OPEN_DIALOGUE")){
				if(!this.other_notifications.gems.enabled){return}
				const value = message.slice(14).split("~")[0].toLowerCase()
				if(["sapphire", "emerald", "ruby", "diamond", "blood_diamond"].includes(value)){
					const gem_map = {
						"sapphire": "<:sapphire:1259880351807967292>",
						"emerald": "<:emerald:1259880426051469383>",
						"ruby": "<:ruby:1259880401749414038>",
						"diamond": "💎",
					}
					this.sendWebhook(this.settings.team_hook, `${window["var_username"]} found a ${value} ${gem_map[value]}`)
				}
			}
		}
	
		onCustomMessageReceived(player, content, callbackId) {
			const customData = Customs.parseCustom(player, content, callbackId)        // Parses custom data into an object, assumes the Anwinity Standard
			if (!(customData.plugin === "teamnotif" || customData.anwinFormatted)){      // Checks if custom is formatted in the correct way, and from the correct plugin
				return
			}
			if (customData.player === "luxbot"){      // Checks if custom is received from the correct player
				if (customData.command === "player_hook"){     // Runs relevant command code, replace with switch statment if using many commands
					this.settings.player_hook = customData.payload
					this.saveSettings()
				} else if (customData.command === "team_hook"){     // Runs relevant command code, replace with switch statment if using many commands
					this.settings.team_hook = customData.payload
					this.saveSettings()
				}
			}
		}
		
		saveSettings(){
			const settingsJSON = JSON.stringify(this.settings)
			localStorage.setItem("teamNotifySettings", settingsJSON)
		}
		
		loadSettings(){
			const settingsJSON = localStorage.getItem("teamNotifySettings")
			if (settingsJSON){
				this.settings = JSON.parse(settingsJSON)
			} else {
				this.settings = this.gen_default_settings()
				this.saveSettings()
			}
			this.notifications = this.gen_main_notif_map()
			this.other_notifications = this.gen_other_notif_map()
		}
		
		sendWebhook(target, message){
			$.ajax({
			    url: target,
			    type: 'post',
			    data: JSON.stringify({
					"content": message,
					"allowed_mentions": {
					    "parse": ["users", "roles"]
					}
			    }),
			    headers: {
					"content-type": "application/json"
			    },
				error: function (e){console.log(e)}
			})
		}
		
		createPanel(){
			IdlePixelPlus.addPanel("teamsnotifier", "Teams Notifications Settings", function() {
				return `
					<div class="container">
					    <div class="row" style="margin:20px 0;">
					        <div class="col-12 d-flex">
					            <div class="input-group"><span class="input-group-text">Discord ID</span><input id="teamsnotif_discord" class="form-control" type="text" /></div>
					        </div>
					    </div>
					    <div id="teamsnotif_main_checks" class="row d-flex justify-content-around" style="margin:20px 0;"></div>
					    <div id="teamsnotif_other_checks" class="row d-flex justify-content-around" style="margin:20px 0;"></div>
					    <div class="row" style="margin:20px 0">
					        <div class="col d-flex justify-content-center"><button id="teamsnotif_save" class="btn btn-primary" type="button">Save</button></div>
					    </div>
					</div>
				`
			});
		}
		
		populatePanel(){
			$("#teamsnotif_discord").val(this.settings.discord_id)
			for (const [ident, data] of Object.entries(this.notifications)) {
				const element_string = `<div class="col-3 d-flex justify-content-center"><div class="form-check"><input id="${ident}_check" class="form-check-input" type="checkbox" ${data.enabled? "checked":""}/><label class="form-check-label" for="${ident}_check" style="margin-left:10px;">${data.display}</label></div></div>`
				const element = $.parseHTML(element_string)
				$(`#teamsnotif_main_checks`).append(element)
			}
			for (const [ident, data] of Object.entries(this.other_notifications)) {
				const element_string = `<div class="col-3 d-flex justify-content-center"><div class="form-check"><input id="${ident}_check" class="form-check-input" type="checkbox" ${data.enabled? "checked":""}/><label class="form-check-label" for="${ident}_check" style="margin-left:10px;">${data.display}</label></div></div>`
				const element = $.parseHTML(element_string)
				$(`#teamsnotif_other_checks`).append(element)
			}
			
			$("#teamsnotif_save").click(this.getSettingsFromPanel)
		}
		
		getSettingsFromPanel(){
			const self = IdlePixelPlus.plugins.teamsnotifier
			const main_notifs = $(".form-check-input", $("#teamsnotif_main_checks"))
			const other_notifs = $(".form-check-input", $("#teamsnotif_other_checks"))
			self.settings.discord_id = $("#teamsnotif_discord").val()
			
			main_notifs.each((index, obj)=>{
				const ele = $(obj)
				const ident = ele.attr('id').slice(0, -6)
				
				self.settings.enabled_notifications[ident] = ele.prop("checked")
			})
			
			other_notifs.each((index, obj)=>{
				const ele = $(obj)
				const ident = ele.attr('id').slice(0, -6)
				
				self.settings.enabled_notifications[ident] = ele.prop("checked")
			})
			
			self.saveSettings()
			self.notifications = self.gen_main_notif_map()
			self.other_notifications = self.gen_other_notif_map()
		}
		
		get_socket_gems(){
			const gem_map = {
				"sapphire": ":sapphire:",
				"emerald": ":emerald:",
				"ruby": ":ruby:",
				"diamond": ":gem:",
				"None": ":sad:"
			}
			const socket_levels = {}
			$("img", ".socket-scroll-row").each((index, obj)=>{
				const ele = $(obj)
				const title = ele.attr('title')
				const gem = title.split("_")[0]
				if (Object.keys(gem_map).includes(gem)){
					const item = title.replace(`${gem}_`, "")
					let tool = ""
					item.split("_").forEach(word=>{tool += `${word.charAt(0).toUpperCase()}${word.substring(1)} `})
					socket_levels[tool] = gem
				} else {
					let tool = ""
					title.split("_").forEach(word=>{tool += `${word.charAt(0).toUpperCase()}${word.substring(1)} `})
					socket_levels[tool] = "None"
				}
			})
			let fp_level = "None"
			if(Items.getItem("sapphire_fight_points") == 1){fp_level="sapphire"}
			if(Items.getItem("emerald_fight_points") == 1){fp_level="emerald"}
			if(Items.getItem("ruby_fight_points") == 1){fp_level="ruby"}
			if(Items.getItem("diamond_fight_points") == 1){fp_level="diamond"}
			
			socket_levels["FP Medallion "] = fp_level
			
			let output = "\n\n"
			for (const [tool, gem] of Object.entries(socket_levels)) {
				const new_line = `${tool}- ${gem_map[gem]}\n`
				output += new_line
			}
			console.log(output)
		}
	}

	const plugin = new TeamsNotifier();
	IdlePixelPlus.registerPlugin(plugin);
})();
