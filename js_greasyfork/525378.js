// ==UserScript==
// @name         IdlePixel UI Tweaks (Lite)
// @namespace    luxferre.dev
// @version      0.9.1
// @description  Adds some options to change details about the IdlePixel user interface.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play/
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20250125
// @require		 https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20250129
// @downloadURL https://update.greasyfork.org/scripts/525378/IdlePixel%20UI%20Tweaks%20%28Lite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525378/IdlePixel%20UI%20Tweaks%20%28Lite%29.meta.js
// ==/UserScript==

//	Original Author: Anwinity || Original fork by: GodofNades || Rewritten with ♡ by: Lux-ferre

(function () {
	"use strict";

	class UITweaksPlugin extends IdlePixelPlusPlugin {
		constructor() {
			super("ui-tweaks-lite", {
				about: {
					name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description,
				},
			})
			this.loaded = false

			this.get_selectors()
			this.get_default_colours()
			this.get_default_settings()
			this.load_settings()
			this.generate_user_stylesheet()
			this.modify_dom()
			this.replace_yell_method()

			this.smelt_times = {
				copper: 3 - 1,
				iron: 6 - 1,
				silver: 10 - 1,
				gold: 50 - 1,
				promethium: 100 - 1,
				titanium: 500 - 1,
				ancient_ore: 1800 - 1,
				dragon_ore: 3600 - 1,
			}
			this.smelt_timer = null;
		}

		create_settings_modal() {
			const modal_string = `<div class="modal fade" id="uit_settings" tabindex="-1" data-bs-theme="dark">
    <div class="modal-dialog" style="max-width: 50vw; max-height: 75vh; transform: translate(-20%)">
        <div class="modal-content" style="height: 75vh;">
            <ul class="nav nav-tabs" id="controlPanelTabs">
                <li class="nav-item">
                    <button class="uit_tab_button nav-link active" id="toggles-tab" data-bs-toggle="tab" data-bs-target="#toggles" type="button">
                        <i class="fas fa-toggle-on me-2"></i>Toggles
                    </button>
                </li>
                <li class="nav-item">
                    <button class="uit_tab_button nav-link" id="misc-settings-tab" data-bs-toggle="tab" data-bs-target="#misc_settings" type="button">
                        <i class="fas fa-list-check me-2"></i>Misc
                    </button>
                </li>
                <li class="nav-item">
                    <button class="uit_tab_button nav-link" id="bg-colours-tab" data-bs-toggle="tab" data-bs-target="#bg_colours" type="button">
                        <i class="fas fa-palette me-2"></i>Background Colours
                    </button>
                </li>
                <li class="nav-item">
                    <button class="uit_tab_button nav-link" id="text-colors-tab" data-bs-toggle="tab" data-bs-target="#text_colours" type="button">
                        <i class="fas fa-font me-2"></i>Text Colours
                    </button>
                </li>
            </ul>
            <div class="px-3">
                <div class="tab-content mt-3" id="controlPanelTabContent">
                    <div class="tab-pane fade show active" id="toggles">
                        <div class="row g-4 d-flex justify-content-around text-center">
                            <!-- Toggles will be dynamically inserted here -->
                        </div>
                    </div>
                    <div class="tab-pane fade" id="misc_settings">
                        <div class="row g-4 d-flex justify-content-around text-center">
                            <!-- Settings will be dynamically inserted here -->
                        </div>
                    </div>
                    <div class="tab-pane fade" id="bg_colours">
                        <div class="row g-4 d-flex justify-content-around text-center">
                            <!-- Color pickers will be dynamically inserted here -->
                        </div>
                    </div>
                    <div class="tab-pane fade" id="text_colours">
                        <div class="row g-4 d-flex justify-content-around text-center">
                            <!-- Color pickers will be dynamically inserted here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`
			document.body.insertAdjacentHTML("beforeend", modal_string);
		}

		populate_settings() {
			this.ps_background_colours()
			this.ps_text_colours()
			this.ps_toggles()
			this.ps_misc()
		}

		ps_background_colours() {
			function rgb_to_hex(rgb) {
				const [r, g, b] = rgb.match(/\d+/g).map(Number);
				return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
			}

			function create_colour_picker(colour, self) {
				let colour_value = self.settings.get(colour.id) || "rgb(0, 0, 0)"
				if (colour_value.startsWith('rgb')) {
					colour_value = rgb_to_hex(colour_value)
				}

				return `
            <div class="col d-flex align-items-center justify-content-center p-1" style="min-width: 250px; max-width: 250px; border: 2px outset gray">
                <input type="color" class="color-picker form-control me-1" id="uitl_${colour.id}" data-ident="${colour.id}" value="${colour_value}">
                <label for="uitl_${colour.id}" class="form-label m-0">${colour.label}</label>
            </div>
        `
			}

			const bg_colours = [
				{id: "main_background", label: "Main Background"},
				{id: "panel_background", label: "Panel Background"},
				{id: "top_bar_background", label: "Top Bar Background"},
				{id: "upper_stats_bar_background", label: "Upper Stats Bar Background"},
				{id: "lower_stats_bar_background", label: "Lower Top Bar Background"},
				{id: "left_bar_background", label: "Left Bar Background"},
				{id: "chat_inner_background", label: "Chat Inner Background"},
				{id: "chat_outer_background", label: "Chat Outer Background"},
				{id: "chat_border", label: "Chat Border"},
				{id: "server_message_tag", label: "Server Message Tag"},
				{id: "chat_raid_link_background", label: "Chat Raid Link Background"},
			]

			const background_container = document.querySelector('#bg_colours .row')
			background_container.innerHTML = ""

			bg_colours.forEach(colour => {
				background_container.innerHTML += create_colour_picker(colour, this);
			})

			background_container.querySelectorAll("input").forEach(input => {
				const self = IdlePixelPlus.plugins["ui-tweaks-lite"]
				input.addEventListener("input", (e) => {
					const ident = e.target.dataset.ident
					const prop = ident === "chat_border" ? "border-color" : "background-color"
					self.update_css(self.selector_map[ident], prop, e.target.value)
					self.update_setting(ident, e.target.value)
				})
			})
		}

		ps_text_colours() {
			function rgb_to_hex(rgb) {
				const [r, g, b] = rgb.match(/\d+/g).map(Number);
				return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
			}

			function create_colour_picker(colour, self) {
				let colour_value = self.settings.get(colour.id) || "rgb(0, 0, 0)"
				if (colour_value.startsWith('rgb')) {
					colour_value = rgb_to_hex(colour_value)
				}

				return `
            <div class="col d-flex align-items-center justify-content-center p-1" style="min-width: 250px; max-width: 250px; border: 2px outset gray">
                <input type="color" class="color-picker form-control me-1" id="uitl_${colour.id}" data-ident="${colour.id}" value="${colour_value}">
                <label for="uitl_${colour.id}" class="form-label m-0">${colour.label}</label>
            </div>
        `
			}

			const text_colours = [
				{id: "chat_text", label: "Chat Text"},
				{id: "chat_timestamp_text", label: "Chat Timestamp Text"},
				{id: "chat_username_text", label: "Chat Username Text"},
				{id: "chat_level_text", label: "Chat Level Text"},
				{id: "server_message_text", label: "Server Message Text"},
				{id: "server_message_tag_text", label: "Server Message Tag Text"},
				{id: "chat_raid_link_text", label: "Chat Raid Link Text"},
				{id: "panel_text_1", label: "Panel Text 1"},
				{id: "panel_text_2", label: "Panel Text 2"},
				{id: "skill_level_text", label: "Skill Level Text"}
			]

			const text_container = document.querySelector('#text_colours .row');
			text_container.innerHTML = ""

			text_colours.forEach(colour => {
				text_container.innerHTML += create_colour_picker(colour, this);
			})

			text_container.querySelectorAll("input").forEach(input => {
				const self = IdlePixelPlus.plugins["ui-tweaks-lite"]
				input.addEventListener("input", (e) => {
					const ident = e.target.dataset.ident
					const prop = "color"
					self.update_css(self.selector_map[ident], prop, e.target.value)
					self.update_setting(ident, e.target.value)
				})
			})
		}

		ps_toggles() {
			function createToggle(toggle) {
				return `
            <div class="col d-flex align-items-center justify-content-center p-1" style="min-width: 250px; max-width: 250px; border: 2px inset gray">
                <div class="form-check form-switch">
                    <input class="form-check-input me-1" type="checkbox" id="uitl_${toggle.id}">
                    <label class="form-check-label" for="uitl_${toggle.id}">${toggle.label}</label>
                </div>
            </div>
        `
			}

			const toggles = [];
			const toggles_container = document.querySelector('#toggles .row');
			toggles_container.innerHTML = ""

			toggles.forEach(toggle => {
				toggles_container.innerHTML += createToggle(toggle);
			})
		}

		ps_misc() {
			const misc_container = document.querySelector('#misc_settings .row');
			misc_container.innerHTML = ""

			let user_font = this.settings.get("font") || "IdlePixel Default"

			misc_container.innerHTML += `
				<div class="col d-flex align-items-center justify-content-center p-1" style="min-width: 250px; max-width: 250px; border: 2px outset gray">
					<label for="font_picker" class="form-label m-0 me-2">Font</label>
					<select class="form-select font_picker" id="font_picker"></select>
				</div>
			`
			this.font_list.forEach(font => {
				const selected_attr = font === user_font ? "selected" : ""
				const option_str = `<option ${selected_attr} value="${font}">${font}</option>`
				document.getElementById("font_picker").innerHTML += option_str
			})

			document.getElementById("font_picker").addEventListener("change", function (event) {
				const self = IdlePixelPlus.plugins["ui-tweaks-lite"]
				user_font = event.target.value
				if (user_font === "IdlePixel Default") {
					user_font = self.default_settings["font"]
				}
				self.update_css("body.font-famlies", "font-family", user_font)
				self.update_css("#chat-area", "font-family", user_font)
				self.update_setting("font", user_font)
			});
		}

		show_modal() {
			IdlePixelPlus.plugins["ui-tweaks-lite"].populate_settings()
			$("#uit_settings").modal("show")
		}

		get_default_colours() {
			$("#chat-area").append($.parseHTML(`<div id="temp_chat_colour_picker"><div class="chat-username"></div><div class="server_message"></div><div class="server_message_text"></div></div>`))
			this.default_colours = {
				main_background: "rgb(200, 247, 248)",
				panel_background: getComputedStyle(document.querySelector("#panels")).backgroundColor,
				top_bar_background: getComputedStyle(document.querySelector(".game-top-bar")).backgroundColor,
				upper_stats_bar_background: getComputedStyle(document.querySelector(".game-top-bar-lower")).backgroundColor,
				lower_stats_bar_background: getComputedStyle(document.querySelector(".game-top-bar-optional-lower")).backgroundColor,
				left_bar_background: getComputedStyle(document.querySelector("#menu-bar")).backgroundColor,
				chat_inner_background: getComputedStyle(document.querySelector("#chat-area")).backgroundColor,
				chat_outer_background: getComputedStyle(document.querySelector("#game-chat")).backgroundColor,
				chat_border: getComputedStyle(document.querySelector("#game-chat.chat.m-3")).borderColor,
				server_message_tag: getComputedStyle(document.querySelector(".server_message")).backgroundColor,
				server_message_tag_text: getComputedStyle(document.querySelector(".server_message")).color,
				chat_text: getComputedStyle(document.querySelector("#chat-area")).color,
				chat_timestamp_text: "rgb(0, 128, 0)",
				chat_username_text: getComputedStyle(document.querySelector(".chat-username")).color,
				chat_level_text: "rgb(128, 128, 128)",
				server_message_text: getComputedStyle(document.querySelector(".server_message")).color,
				chat_raid_link_text: "rgb(197 186 186)",
				chat_raid_link_background: "rgb(139, 0, 0)",
				panel_text_1: getComputedStyle(document.querySelector("#panels")).color,
				panel_text_2: "rgb(128, 128, 128)",
				skill_level_text: getComputedStyle(document.querySelector("#panels .font-large")).color,
			}
			const ele = document.getElementById("temp_chat_colour_picker")
			if (ele) {
				ele.remove()
			}
		}

		get_font_list() {
			const possible_fonts = new Set(
				[
					// Windows 10
					"Arial",
					"Arial Black",
					"Bahnschrift",
					"Calibri",
					"Cambria",
					"Cambria Math",
					"Candara",
					"Comic Sans MS",
					"Consolas",
					"Constantia",
					"Corbel",
					"Courier New",
					"Ebrima",
					"Franklin Gothic Medium",
					"Gabriola",
					"Gadugi",
					"Georgia",
					"HoloLens MDL2 Assets",
					"Impact",
					"Ink Free",
					"Javanese Text",
					"Leelawadee UI",
					"Lucida Console",
					"Lucida Sans Unicode",
					"Malgun Gothic",
					"Marlett",
					"Microsoft Himalaya",
					"Microsoft JhengHei",
					"Microsoft New Tai Lue",
					"Microsoft PhagsPa",
					"Microsoft Sans Serif",
					"Microsoft Tai Le",
					"Microsoft YaHei",
					"Microsoft Yi Baiti",
					"MingLiU-ExtB",
					"Mongolian Baiti",
					"MS Gothic",
					"MV Boli",
					"Myanmar Text",
					"Nirmala UI",
					"Palatino Linotype",
					"Segoe MDL2 Assets",
					"Segoe Print",
					"Segoe Script",
					"Segoe UI",
					"Segoe UI Historic",
					"Segoe UI Emoji",
					"Segoe UI Symbol",
					"SimSun",
					"Sitka",
					"Sylfaen",
					"Symbol",
					"Tahoma",
					"Times New Roman",
					"Trebuchet MS",
					"Verdana",
					"Webdings",
					"Wingdings",
					"Yu Gothic",
					// macOS
					"American Typewriter",
					"Andale Mono",
					"Arial",
					"Arial Black",
					"Arial Narrow",
					"Arial Rounded MT Bold",
					"Arial Unicode MS",
					"Avenir",
					"Avenir Next",
					"Avenir Next Condensed",
					"Baskerville",
					"Big Caslon",
					"Bodoni 72",
					"Bodoni 72 Oldstyle",
					"Bodoni 72 Smallcaps",
					"Bradley Hand",
					"Brush Script MT",
					"Chalkboard",
					"Chalkboard SE",
					"Chalkduster",
					"Charter",
					"Cochin",
					"Comic Sans MS",
					"Copperplate",
					"Courier",
					"Courier New",
					"Didot",
					"DIN Alternate",
					"DIN Condensed",
					"Futura",
					"Geneva",
					"Georgia",
					"Gill Sans",
					"Helvetica",
					"Helvetica Neue",
					"Herculanum",
					"Hoefler Text",
					"Impact",
					"Lucida Grande",
					"Luminari",
					"Marker Felt",
					"Menlo",
					"Microsoft Sans Serif",
					"Monaco",
					"Noteworthy",
					"Optima",
					"Palatino",
					"Papyrus",
					"Phosphate",
					"Rockwell",
					"Savoye LET",
					"SignPainter",
					"Skia",
					"Snell Roundhand",
					"Tahoma",
					"Times",
					"Times New Roman",
					"Trattatello",
					"Trebuchet MS",
					"Verdana",
					"Zapfino",
					// other
					"Helvetica",
					"Garamond",
				].sort()
			)

			this.font_list = []

			for (const font of possible_fonts.values()) {
				if (document.fonts.check(`12px "${font}"`)) {
					this.font_list.push(font);
				}
			}
			this.font_list.unshift("IdlePixel Default")
		}

		get_default_settings() {
			this.default_settings = {
				font: getComputedStyle(document.querySelector("body")).fontFamily,
				good_moon: 300000,
				good_sun: 120000000
			}
		}

		get_selectors() {
			this.selector_map = {
				main_background: ".background-game",
				panel_background: "#panels",
				top_bar_background: ".game-top-bar",
				upper_stats_bar_background: ".game-top-bar-lower",
				lower_stats_bar_background: ".game-top-bar-optional-lower",
				left_bar_background: "#menu-bar",
				chat_inner_background: "#chat-area",
				chat_outer_background: "#game-chat",
				chat_border: "#game-chat",
				server_message_tag: ".server_message",
				server_message_tag_text: ".server_message",
				chat_text: "#chat-area",
				chat_timestamp_text: "#chat-area .color-green",
				chat_username_text: ".chat-username",
				chat_level_text: "#chat-area .color-grey",
				server_message_text: ".server_message_text",
				chat_raid_link_text: ".raid-link",
				chat_raid_link_background: ".raid-link",
				panel_text_1: "#panels",
				panel_text_2: "#panels .color-grey",
				skill_level_text: "#panels .font-large"
			}

		}

		load_settings() {
			this.settings = new Map([
				...Object.entries(this.default_colours),
				...Object.entries(this.default_settings),
			])
			const stored_settings = localStorage.getItem("uit-lite-settings")
			if (stored_settings) {
				const parsed_settings = JSON.parse(stored_settings)
				this.settings.forEach((value, key) => {
					if (parsed_settings.hasOwnProperty(key)) {
						this.settings.set(key, parsed_settings[key])
					} else {
						console.log("Unknown setting key: " + key)
					}
				})
				console.log("Lite settings loaded.")
			} else {
				const uit_configs = JSON.parse(localStorage.getItem("idlepixelplus.ui-tweaks.config"))
				if (uit_configs) {
					console.log("Legacy UIT settings loaded.")
					try {
						this.get_uit_configs()
					} catch (e) {
						console.error(`Error loading UIT configs: ${e}`)
					}
				} else {
					console.log("Only default settings loaded.")
				}
			}
			this.save_settings()
		}

		save_settings() {
			const json_settings = JSON.stringify(Object.fromEntries(this.settings))
			localStorage.setItem("uit-lite-settings", json_settings)
		}

		get_uit_configs() {
			const uit_configs = JSON.parse(localStorage.getItem("idlepixelplus.ui-tweaks.config"))
			this.settings
				.set("main_background", uit_configs["color-body"] || this.default_colours.main_background)
				.set("panel_background", uit_configs["color-panels"] || this.default_colours.panel_background)
				.set("top_bar_background", uit_configs["color-top-bar"] || this.default_colours.top_bar_background)
				.set("left_bar_background", uit_configs["color-menu-bar"] || this.default_colours.left_bar_background)
				.set("chat_inner_background", uit_configs["color-chat-area"] || this.default_colours.chat_inner_background)
				.set("chat_outer_background", uit_configs["color-game-chat"] || this.default_colours.chat_outer_background)
				.set("chat_border", uit_configs["chatBorderOverrideColor"] || this.default_colours.chat_border)
				.set("server_message_tag", uit_configs["color-chat-area-server_message"] || this.default_colours.server_message_tag)
				.set("server_message_tag_text", uit_configs["serverMessageTextOverrideColor"] || this.default_colours.server_message_tag_text)
				.set("chat_text", uit_configs["font-color-chat-area"] || this.default_colours.chat_text)
				.set("chat_timestamp_text", uit_configs["font-color-chat-area-color-green"] || this.default_colours.chat_timestamp_text)
				.set("chat_username_text", uit_configs["font-color-chat-area-chat-username"] || this.default_colours.chat_username_text)
				.set("chat_level_text", uit_configs["font-color-chat-area-color-grey"] || this.default_colours.chat_level_text)
				.set("server_message_text", uit_configs["serverMessageTextOverrideColor"] || this.default_colours.server_message_text)
				.set("chat_raid_link_text", uit_configs["font-color-chat-area-chat-raid-password"] || this.default_colours.chat_raid_link_text)
				.set("chat_raid_link_background", uit_configs["background-color-chat-area-raid-password"] || this.default_colours.chat_raid_link_background)
				.set("panel_text_1", uit_configs["font-color-panels"] || this.default_colours.panel_text_1)
				.set("panel_text_2", uit_configs["font-color-panels-color-grey"] || this.default_colours.panel_text_2)
				.set("skill_level_text", uit_configs["font-color-panels-font-large"] || this.default_colours.skill_level_text)
				.set("font", uit_configs["font"] || this.default_settings.font)
		}

		apply_set_styles() {
			const style = document.createElement("style")
			style.id = "uit-lite-set-styles"
			style.textContent = `														
				#content.side-chat #game-chat > :first-child {
				  display: grid;
				  column-gap: 0;
				  row-gap: 0;
				  grid-template-columns: 1fr;
				  grid-template-rows: auto 1fr auto;
				  height: calc(100% - 16px);
				}
								
				.farming-plot-wrapper.condensed {
                  min-width: 115px;
				  display: flex;
				  flex-direction: row;
				  justify-items: flex-start;
				  width: fit-content;
                  height: unset;
                  min-height: unset;
                  max-height: unset;
				}
				
				.farming-plot-wrapper.condensed > span {
				  width: 100px;
				  max-height: 200px;
				}
				
				.farming-plot-wrapper.condensed img {
				  width: 100px;
				}
				
				#panel-gathering .gathering-box.condensed {
				  height: 240px;
				  position: relative;
				  margin: 4px auto;
				  padding-left: 4px;
				  padding-right: 4px;
				}
				
				#panel-gathering .gathering-box.condensed img.gathering-area-image {
				  position: absolute;
				  top: 10px;
				  left: 10px;
				  width: 68px;
				  height: 68px;
				}
				
				#panel-mining.add-arrow-controls itembox {
				  position: relative;
				}
				
				#panel-mining:not(.add-arrow-controls) itembox .arrow-controls {
				  display: none !important;
				}
				
				itembox .arrow-controls {
				  position: absolute;
				  top: 0px;
				  right: 2px;
				  height: 100%;
				  padding: 2px;
				  display: flex;
				  flex-direction: column;
				  justify-content: space-around;
				  align-items: center;
				}
				
				itembox .arrow {
				  border: solid white;
				  border-width: 0 4px 4px 0;
				  display: inline-block;
				  padding: 6px;
				  cursor: pointer;
				  opacity: 0.85;
				}
				
				itembox .arrow:hover {
				  opacity: 1;
				  border-color: yellow;
				}
				
				itembox .arrow.up {
				  transform: rotate(-135deg);
				  -webkit-transform: rotate(-135deg);
				  margin-top: 3px;
				}
				
				itembox .arrow.down {
				  transform: rotate(45deg);
				  -webkit-transform: rotate(45deg);
				  margin-bottom: 3px;
				}

                .itembox-large {
                  width: 204px;
                  margin-bottom: 15px;
                }
								
				.game-menu-bar-left-table-btn tr
				{
				  background-color: transparent !important;
				  font-size:medium;
				}
				
				.hover-menu-bar-item:hover {
				  background: unset;
				  font-size: medium;
				}
				
				.thin-progress-bar {
				  background:#437b7c !important;
				  border:0 !important;
				  height:unset;
				}
				
				.thin-progress-bar-inner {
				  background:#88e8ea !important;
				}
				
				.game-menu-bar-left-table-btn td{
				  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				}

                .game-menu-bar-left-table-btn div td{
				  padding-left:20px !important;
				  padding:unset;
				  margin:0px;
				  font-size:medium;
				  background-color: transparent !important;
				}

				.game-menu-bar-left-table-btn {
				  background-color: transparent !important;
				}
				
				.left-menu-item {
				  margin-bottom:unset;
				  font-size:medium;
				}
				
				.left-menu-item > img {
				  margin-left: 20px;
				  margin-right: 20px;
				}
				
				.color-picker {
					width: 40px;
					height: 40px;
					padding: 0;
					border: solid 2px black;
					border-radius: 50%;
					cursor: pointer;
				}
				.color-picker::-webkit-color-swatch-wrapper {
					padding: 0;
				}
				.color-picker::-webkit-color-swatch {
					border: none;
					border-radius: 4px;
				}
				.uit_tab_button {
					border: none;
    				box-shadow: none;
    				border-radius: none;
				}
				#uit_settings .active {
					background-color:inherit !important;
					color:white !important;
				}
				.left_menu_divider {
					border-bottom: lightgray 1px outset;
				}
				#notifications-area {
					overflow-y: auto;
					height: 140px;
				}
				.uit_hidden {
					display: none;
				}	
				`

			document.head.appendChild(style)
		}

		generate_user_stylesheet() {
			const style = document.createElement("style")
			style.id = "uit-lite-user-styles"
			style.textContent = `
				body.font-famlies {
					font-family: ${this.settings.get("font")};
				}
				
				.background-game {
					background-color: ${this.settings.get("main_background")};
				}
				
				#panels {
					background-color: ${this.settings.get("panel_background")};
					color: ${this.settings.get("panel_text_1")};
				}
				
				.game-top-bar {
					background-color: ${this.settings.get("top_bar_background")};
				}
				
				.game-top-bar-lower {
					background-color: ${this.settings.get("upper_stats_bar_background")};
				}
				
				.game-top-bar-optional-lower {
					background-color: ${this.settings.get("lower_stats_bar_background")};
				}
				
				#menu-bar {
					background-color: ${this.settings.get("left_bar_background")};
				}
				
				#chat-area {
					background-color: ${this.settings.get("chat_inner_background")};
					color: ${this.settings.get("chat_text")};
					font-family: ${this.settings.get("font")};
				}
				
				#game-chat {
					background-color: ${this.settings.get("chat_outer_background")};
					border-color: ${this.settings.get("chat_border")};
				}
				
				.server_message {
					background-color: ${this.settings.get("server_message_tag")};
					color: ${this.settings.get("server_message_tag_text")};
				}
				
				.server_message_text {
					color: ${this.settings.get("server_message_text")};
				}
				
				#chat-area .color-green {
					color: ${this.settings.get("chat_timestamp_text")};
				}
				
				.chat-username {
					color: ${this.settings.get("chat_username_text")};
				}
				
				#chat-area .color-grey {
					color: ${this.settings.get("chat_level_text")};
				}
				
				.raid-link {
					background-color: ${this.settings.get("chat_raid_link_background")};
					color: ${this.settings.get("chat_raid_link_text")};
				}
				
				#panels .color-grey {
					color: ${this.settings.get("panel_text_2")};
				}
				
				#panels .font-large {
					color: ${this.settings.get("skill_level_text")};
				}
				
				.sun_distance{}
				.moon_distance{}
				`

			document.head.appendChild(style)
		}

		modify_dom() {
			// DOM modifications to allow stylesheet rule overrides
			// Removes inline styles from levels on skill panels.
			document.querySelectorAll("#panels .font-large").forEach(element => {
				element.removeAttribute("style")
			})

			const moon_distance = document.getElementById("top-bar-moon-distance")
			moon_distance.classList.add("moon_distance")
			moon_distance.removeAttribute("style")
			document.body.appendChild(document.createElement("div")).id = "top-bar-moon-distance"	// Creates a new element to be targeted by colouration code
			moon_distance.removeAttribute("id")	// Removes ID to prevent future inline styles being applies

			const sun_distance = document.getElementById("top-bar-sun-distance")
			sun_distance.classList.add("sun_distance")
			document.body.appendChild(document.createElement("div")).id = "top-bar-sun-distance"	// Creates a new element to be targeted by colouration code
			sun_distance.removeAttribute("id")	// Removes ID to prevent future inline styles being applies
			sun_distance.querySelector("item-display").removeAttribute("id")	// ID is duplicated to inner element. -.-
		}

		restructure_chat() {
			const chat = document.querySelector("#game-chat > :first-child");
			const chatTop = document.createElement("div");
			chatTop.id = "chat-top";
			const chatArea = document.querySelector("#chat-area");
			const chatBottom = document.querySelector(
				"#game-chat > :first-child > :last-child"
			);

			while (chat.firstChild) {
				chatTop.appendChild(chat.firstChild);
			}

			chat.appendChild(chatTop);
			chat.appendChild(chatArea);
			chat.appendChild(chatBottom);
		}

		show_extended_levels() {
			window.refresh_skill_levels_menu_bar = function (skill) {
				const level = get_level(Items.getItem(`${skill}_xp`), true);

				if (level >= 100) {
					document.getElementById("menu-bar-" + skill + "-level").innerHTML = `<span style='color:cyan;'>Level 100 (${level})</span>`
				} else {
					document.getElementById("menu-bar-" + skill + "-level").innerHTML = `Level ${level}`
				}
			}

			window.refresh_xp_required_labels = function () {
				const skills = ["mining", "crafting", "gathering", "farming", "brewing", "woodcutting", "cooking", "fishing", "breeding", "invention", "melee", "archery", "magic"]
				let global_level = 0

				skills.forEach(skill => {
					const current_xp = Items.getItem(skill + "_xp");
					const current_level = get_level(current_xp, true);
					const xp_required = get_xp_required(current_level + 1);
					if (current_level >= 100) hide_element("next-level-" + skill + "-xp-required")
					document.getElementById("next-level-" + skill + "-xp-required").innerHTML = format_number(xp_required - current_xp) + " xp until next level";

					global_level += current_level
				})
				window.var_global_level_ext = global_level
			}

			const ele = document.createElement("span")
			ele.innerHTML = `(<item-display class="font-small" data-key="global_level_ext"></item-display>)`
			ele.classList.add("color-silver")
			document.querySelector(".game-top-bar-upper > a:nth-child(4) > item-display").insertAdjacentElement("afterend", ele)
		}

		replace_yell_method() {
			Chat.yell_to_chat_box = function (data) {
				var data_array = data.split("~");
				var tag = "Server message";
				var tag_css_class = tag.toLowerCase().replaceAll(" ", "_");
				var sigil_image = "none";
				var usernameSource = data_array[0];
				var message = data_array[1];

				if (Items.getItem("team_chat_on") == 1 && usernameSource != "none") {
					var teamUsernames = Items.getItem("team_usernames").split(",");
					var found = false;
					for (var i = 0; i < teamUsernames.length; i++) {

						if (teamUsernames[i] == usernameSource) {
							found = true;
							break;
						}
					}

					if (!found)
						return;
				}

				var html = "";
				html += "<span class='color-green'>" + Chat._get_time() + "</span>";
				if (sigil_image != "none") html += " <img src='https://cdn.idle-pixel.com/images/" + sigil_image + ".png' /> ";
				if (tag != "none") html += "<span class='" + tag_css_class + " shadow'>" + tag + "</span> ";
				html += sanitize_input(message);

				$("#chat-area").append("<div class='server_message_text'>" + html + "</div>")

				if (Chat._auto_scroll)
					$("#chat-area").scrollTop($("#chat-area")[0].scrollHeight)
			};
		}

		move_plugins_button() {
			document.getElementById("menu-bar-idlepixelplus-icon")?.parentElement.remove()
			Paneller.registerPanel("idlepixelplus", "IP+ Plugin Settings")
		}

		update_css(selector, property, new_value) {
			const stylesheet = document.getElementById("uit-lite-user-styles").sheet
			const rules = stylesheet.cssRules
			for (let i = 0; i < rules.length; i++) {
				const rule = rules[i];
				if (rule.selectorText === selector) {
					rule.style.setProperty(property, new_value);
					break;
				}
			}
		}

		update_setting(setting, value) {
			IdlePixelPlus.plugins["ui-tweaks-lite"].settings.set(setting, value);
			IdlePixelPlus.plugins["ui-tweaks-lite"].save_settings()
		}

		condense_ui() {
			let leftbar = document.getElementById("menu-bar-buttons");

			let styleElement = document.getElementById("condensed-ui-tweaks");

			if (styleElement) {
				styleElement.parentNode.removeChild(styleElement);
			}
			document
				.getElementById("menu-bar-buttons")
				.querySelectorAll(".font-small")
				.forEach(function (smallFont) {
					let classInfo = smallFont.className.replaceAll(
						"font-small",
						"font-medium"
					);
					smallFont.className = classInfo;
				})

			leftbar.querySelectorAll("img").forEach(function (img) {
				img.className = "w20";
			});
		}

		condense_woodcutting_patches() {
			let patch_container = document.createElement("div")
			patch_container.classList.add("d-flex")
			const woodcutting_plots = document.querySelectorAll("#panel-woodcutting .farming-plot-wrapper")
			woodcutting_plots.forEach((plot) => {
				plot.classList.add("condensed")
				document
					.querySelectorAll("#panel-woodcutting .farming-plot-wrapper img[id^='img-tree_shiny']")
					.forEach(function (el) {
						el.removeAttribute("width");
						el.removeAttribute("height");
					})
				patch_container.appendChild(plot)
			})
			document.getElementById("panel-woodcutting").appendChild(patch_container)
		}

		condense_farming_patches() {
			let patch_container = document.createElement("div")
			patch_container.classList.add("d-flex")
			const farming_patch_container = document.querySelectorAll("#panel-farming .farming-plot-wrapper")
			farming_patch_container.forEach((plot) => {
				plot.classList.add("condensed");
				document
					.querySelectorAll("#panel-farming .farming-plot-wrapper img[id^='img-farm_shiny']")
					.forEach(function (el) {
						el.removeAttribute("width");
						el.removeAttribute("height");
					})
				patch_container.appendChild(plot)
			})
			document.getElementById("panel-farming").appendChild(patch_container)
		}

		condense_gathering_boxes() {
			const gathering_boxes = document.querySelectorAll("#panel-gathering .gathering-box")
			gathering_boxes.forEach(function (box) {
				box.classList.add("condensed")
				box.querySelector("hr").style.display = "none"
				box.querySelectorAll(".color-silver").forEach(element => {
					element.style.display = "none"
				})
				const unique_items = box.querySelector(".color-orange")
				unique_items.style.display = ""

				//	Remove new lines after unique items to make progress bar fit.
				let next_sibling = unique_items.nextSibling
				while (next_sibling) {
					if (next_sibling.tagName === "BR") {
						const element_to_remove = next_sibling
						next_sibling = next_sibling.nextSibling
						element_to_remove.remove()
					} else {
						next_sibling = next_sibling.nextSibling
					}
				}
			})
		}

		give_images_titles() {
			const images = document.querySelectorAll("img");
			images.forEach(function (el) {
				const src = el.getAttribute("src");
				if (src && src !== "x") {
					const title = src.replace(/.*\//, "").replace(/\.\w+$/, "");
					el.setAttribute("title", title);
				}
			})
		}

		add_labels_to_table_items() {
			document.querySelectorAll(`#invention-table tbody tr[data-tablette-required]`).forEach(row => {
				row.querySelectorAll(`td:nth-child(4) item-invention-table`).forEach(output => {
					const label = output.getAttribute("data-materials-item").replaceAll("_", " ")
					output.textContent = `${Number(output.textContent).toLocaleString()} (${label})`
				})
			})

			document.querySelectorAll(`#crafting-table tbody tr[data-crafting-item]`).forEach(row => {
				row.querySelectorAll(`td:nth-child(3) item-crafting-table`).forEach(output => {
					const label = output.getAttribute("data-materials-item").replaceAll("_", " ")
					output.textContent = `${Number(output.textContent).toLocaleString()} (${label})`
				})
			})

			document.querySelectorAll(`#brewing-table tbody tr[data-brewing-item]`).forEach(row => {
				row.querySelectorAll(`td:nth-child(3) item-brewing-table`).forEach(output => {
					const label = output.getAttribute("data-materials-item").replaceAll("_", " ")
					output.textContent = `${Number(output.textContent).toLocaleString()} (${label})`
				})
			})
		}

		create_machinery_arrow_template() {
			const arrow_template_str = `
				<template id="uit_arrow_template">
					<div class="arrow-controls" onclick="event.stopPropagation()">
						<div class="arrow up"></div>
						<item-display data-format="number">1</item-display>
						<div class="arrow down"></div>
					</div>
				</template>
			`
			$("body").append($(arrow_template_str))
		}

		add_mining_machine_arrows() {
			const machineryList = [
				"drill",
				"crusher",
				"giant_drill",
				"excavator",
				"giant_excavator",
				"massive_excavator",
			]

			document.querySelector("#panel-mining").classList.add("add-arrow-controls")

			const template = document.getElementById("uit_arrow_template")

			machineryList.forEach((machine) => {
				const itemBox = document.querySelector(`itembox[data-item=${machine}]`)
				let clone = template.content.cloneNode(true)
				if (itemBox) {
					clone.querySelector(".up").onclick = function (event) {
						event.stopPropagation()
						IdlePixelPlus.sendMessage(`MACHINERY=${machine}~increase`)
					}

					clone.querySelector("item-display").setAttribute("data-key", `${machine}_on`)

					clone.querySelector(".down").onclick = function (event) {
						event.stopPropagation()
						IdlePixelPlus.sendMessage(`MACHINERY=${machine}~decrease`)
					};

					itemBox.appendChild(clone)
				}
			})
		}

		make_uuid_clickable() {
			const regex = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
			let chatArea = document.getElementById("chat-area");
			let lastMessageElement = chatArea.lastChild;
			let player = lastMessageElement.querySelector('.chat-username').innerText;

			if (lastMessageElement && 'innerHTML' in lastMessageElement) {
				let lastMessage = lastMessageElement.innerHTML
				lastMessage = lastMessage.replace(regex, function (match) {
					return `<a href="#" class="raid-link" onclick="IdlePixelPlus.plugins['ui-tweaks-lite'].click_raid_link(event)" data-uuid="${match}">${player} Raid</a>`;
				})
				lastMessageElement.innerHTML = lastMessage;
			}
		}

		click_raid_link(event) {
			event.preventDefault()
			websocket.send(`JOIN_RAID_TEAM=${event.target.dataset.uuid}`)
			switch_panels('panel-combat');
			document.getElementById('game-panels-combat-items-area').style.display = 'none';
			document.getElementById('combat-stats').style.display = 'none';
			document.getElementById('game-panels-combat-raids').style.display = '';
		}

		add_dividers_to_left_menu() {
			document.getElementById("left-menu-bar-labels").classList.add("left_menu_divider")
			document.getElementById("left-panel-item_panel-teams")?.classList.add("left_menu_divider")
			document.getElementById("left-panel-item_panel-magic").classList.add("left_menu_divider")
			document.getElementById("left-panel-item_panel-criptoe-market").classList.add("left_menu_divider")
		}

		clone_dust_pots() {
			const dust_pots = document.getElementById("panel-brewing").querySelectorAll(".dust-box")
			dust_pots.forEach((element) => {
				if (element.dataset.item.startsWith("cooks")) {
					const chefs_hat = document.getElementById("panel-cooking").querySelector('itembox[data-item="chefs_hat"]')
					const clone = element.cloneNode(true)
					chefs_hat.insertAdjacentElement("afterend", clone)
					clone.insertAdjacentHTML("beforebegin", `\n\n`)
				}
				if (element.dataset.item.startsWith("tree")) {
					const chop_all_tree = document.getElementById("panel-woodcutting").querySelector('itembox[data-item="chop_all_ent_special"]')
					const clone = element.cloneNode(true)
					chop_all_tree.insertAdjacentElement("afterend", clone)
					clone.insertAdjacentHTML("beforebegin", `\n\n`)
				}
				if (element.dataset.item.startsWith("fight")) {
					const combat_badges = document.getElementById("combat-badge-itembox")
					const clone = element.cloneNode(true)
					combat_badges.insertAdjacentElement("beforebegin", clone)
					clone.insertAdjacentHTML("afterend", `\n\n`)
				}
				if (element.dataset.item.startsWith("farm")) {
					const compactor = document.getElementById("panel-farming").querySelector('itembox[data-item="seed_compactor"]')
					const clone = element.cloneNode(true)
					compactor.insertAdjacentElement("afterend", clone)
					clone.insertAdjacentHTML("beforebegin", `\n\n`)
				}
			})
		}

		add_extra_data_to_combat(){
			const extra_data = `
			<br>
			<div class="td-combat-stat-entry">
				<img class="img-15" src="https://cdn.idle-pixel.com/images/combat_loot_potion.png" title="combat_loot_potion">
				<span style="color:white">Loot Pot: </span>
				<span id="combat_info_loot_pot"></span>
			</div>
			<div class="td-combat-stat-entry">
				<img class="img-15" src="https://cdn.idle-pixel.com/images/rare_monster_potion.png" title="rare_monster_potion">
				<span style="color:white">Rare Pot: </span>
				<span id="combat_info_rare_pot"></span>
			</div>
			<div class="td-combat-stat-entry">
				<img class="img-15" src="https://cdn.idle-pixel.com/images/fight_points.png" title="fight_points">
				<span style="color:white">FP: </span>
				<span id="combat_info_fps"></span>
			</div>
			`
			document.getElementById("menu-bar-idle-hero-arrows-area-2").insertAdjacentHTML("afterend", extra_data)
		}

		create_mixer_notification(){
			const potion_element = document.getElementById("notification-potion-guardian_key_potion_timer")
			let clone = potion_element.cloneNode(true)
			clone.id = "uit_notification_mixer"
			clone.style = ""
			clone.classList.add("hover")

			let img = clone.querySelector("img")
			img.setAttribute("src", get_image("images/brewing_xp_mixer.png"))
			img.setAttribute("title", "Brewing Mixer")

			clone.querySelector("item-display").setAttribute("data-key", "next_day_timer")

			let span = clone.querySelector("span")
			span.id = ""
			span.innerHTML = `<item-display data-format="number" data-key="mixer_charges_remaining"></item-display>/5`

			clone.onclick = function () {Modals.clicks_brewing_xp_mixer();}
			potion_element.insertAdjacentElement("afterend", clone)
		}

		create_merchant_notification(){
			const ready_element = document.getElementById("notification-robot_waves-ready")
			let clone = ready_element.cloneNode(true)
			clone.id = "uit_notification_merchant"
			clone.style.display = ""

			let img = clone.querySelector("img")
			img.setAttribute("src", get_image("images/merchant.png"))
			img.setAttribute("title", "Merchant")

			img.insertAdjacentHTML("afterend", `<item-display class="color-white" data-format="timer" data-key="merchant_timer"></item-display>`)

			clone.querySelector("span").remove()

			clone.onclick = function () {switch_panels("panel-shop");}

			ready_element.insertAdjacentElement("afterend", clone)
		}

		create_oil_notification(){
			const notification = `
			<div id="uit_notification_oil" class="notification hover">
			  <img src="${get_image("images/oil.png")}" class="w20" title="Oil Delta">
			  <item-display id="uit_oil_notif_label" class="color-white" data-key="uit_oil_notif_label">0</item-display>
			  <item-display id="uit_oil_notif_timer" class="color-white" data-format="timer" data-key="uit_oil_notif_timer">0</item-display>
		   	</div>`
			document.getElementById("notification-massive_excavator").insertAdjacentHTML("afterend", notification)
		}

		update_oil_notification(){
			const oil = parseInt(window.var_oil)
			const oil_delta = parseInt(window.var_oil_in) - parseInt(window.var_oil_out)
			window.var_oil_delta = `${oil_delta}`
			const max_oil = parseInt(window.var_max_oil)
			window.var_uit_oil_notif_label = ""
			if (oil_delta===0){
				window.var_uit_oil_notif_label = "Balanced"
				document.getElementById("uit_oil_notif_timer").style.display = "none"
			} else if (oil_delta>0){
				if(oil >= max_oil){
					window.var_uit_oil_notif_label = "Oil Full"
					document.getElementById("uit_oil_notif_timer").style.display = "none"
				} else {
					window.var_uit_oil_notif_label = "Oil Increasing"
					window.var_uit_oil_notif_timer = `${(max_oil - oil) / oil_delta}`
					document.getElementById("uit_oil_notif_timer").style.display = ""
					document.getElementById("uit_oil_notif_timer").style.color = "green"
				}
			} else {
				if(oil <= 0){
					window.var_uit_oil_notif_label = "Oil Empty"
					document.getElementById("uit_oil_notif_timer").style.display = "none"
				} else {
					window.var_uit_oil_notif_label = "Oil Decreasing"
					window.var_uit_oil_notif_timer = `${oil / -oil_delta}`
					document.getElementById("uit_oil_notif_timer").style.display = ""
					document.getElementById("uit_oil_notif_timer").style.color = "red"
				}
			}
		}

		add_timer_to_smelt_notification(){
			const timer_html = ` (<item-display class="color-white" data-format="timer" data-key="furnace_timer_remaining"></item-display>)`
			document.getElementById("notification-furnace-running").querySelector("span").insertAdjacentHTML("afterend", timer_html)
		}

		handle_smelt_timer(valueBefore, valueAfter){
			if(valueAfter === "none"){
				if(this.smelt_timer){
					clearInterval(this.smelt_timer)
					this.smelt_timer = null
				}
			} else if (valueBefore !== valueAfter && valueAfter) {
				const bar_time = this.smelt_times[valueAfter]
				const bars_to_smelt = parseInt(window.var_furnace_ore_amount_set)
				if(this.smelt_timer){	// Just in case
					clearInterval(this.smelt_timer)
					this.smelt_timer = null
				}
				window.var_furnace_timer_remaining = `${bar_time * bars_to_smelt}`
				this.smelt_timer = setInterval(() => {
					const new_time = parseInt(window.var_furnace_timer_remaining) - 1
					window.var_furnace_timer_remaining = `${new_time}`

					if(new_time <= 0){
						clearInterval(this.smelt_timer)
						this.smelt_timer = null
					}
				}, 1000)
			}
		}

		hide_active_machinery(){
			const machinery_list = ["drill", "crusher", "giant_drill", "excavator", "giant_excavator", "massive_excavator"]

			machinery_list.forEach(machine => {
				document.getElementById(`notification-${machine}`).classList.add("uit_hidden")
			})
		}

		fix_left_menu(){
			document.getElementById("left-panel-item_panel-archery").classList.remove("game-menu-bar-left-table-btn-borderless")
			document.getElementById("left-panel-item_panel-archery").classList.add("game-menu-bar-left-table-btn")
			document.getElementById("left-panel-item_panel-magic").classList.remove("game-menu-bar-left-table-btn-borderless")
			document.getElementById("left-panel-item_panel-magic").classList.add("game-menu-bar-left-table-btn")

			let labels = document.getElementById("left-menu-bar-labels");
			labels.style.padding = "unset";
		}

		create_left_menu_extras(){
			const container_html = `<div style="padding: unset;" class="left_menu_divider" id="left_menu_extras"></div>`
			document.getElementById("left-menu-bar-labels").insertAdjacentHTML("afterend", container_html)

			const rocket_html = `<div style="padding: unset;" class="left_menu_divider" id="left_menu_rocket_extras"></div>`
			document.getElementById("left_menu_extras").insertAdjacentHTML("afterend", rocket_html)

			const lower_top_bar = document.getElementById("top-menu-bar-optional-labels")

			const top_extras = lower_top_bar.querySelectorAll(".top-bar-entry")

			top_extras.forEach(element => {
				let new_element = element.cloneNode(true);
				const orig_id = new_element.id
				new_element.id = ""
				new_element.classList.remove("top-bar-entry")
				new_element.classList.add("left-menu-item")

				if(orig_id.startsWith("rocket")){
					new_element.classList.add("hover")
					new_element.setAttribute("onclick", "Modals.clicks_rocket()")
					document.getElementById("left_menu_rocket_extras").appendChild(new_element)
				} else {
					document.getElementById("left_menu_extras").appendChild(new_element)
				}
			})

			this.update_css(".game-top-bar-optional-lower", "display", "none")
		}

		purple_key_extras(){
			const purple_key_element = document.getElementById("guardian-key-3-extra-label")

			purple_key_element.classList.add("hover")

			purple_key_element.setAttribute("onclick", `websocket.send("CASTLE_MISC=guardian_purple_key_hint")`)

			const timer_html = ` ⏲️<item-display data-format="timer" data-key="nades_purple_key_timer"></item-display>`
			purple_key_element.querySelector("span").insertAdjacentHTML("afterend", timer_html)
		}

		rocket_extras(){
			const top_moon = document.getElementById("rocket-distance-extra-label-moon")
			top_moon.classList.add("hover")
			top_moon.setAttribute("onclick", "Modals.clicks_rocket()")

			const top_sun = document.getElementById("rocket-distance-extra-label-sun")
			top_sun.classList.add("hover")
			top_sun.setAttribute("onclick", "Modals.clicks_rocket()")

			const fuel_element = $.parseHTML(
				`<div class="left-menu-item hover" id="left_menu_fuel">
						<img src="${get_image("images/rocket_fuel.png")}" title="fuel" class="w20">
						<span>Rocket Fuel - </span>
						<item-display data-format="number" data-key="rocket_fuel"></item-display>
                	</div>`
			)
			const rocket_container = $("#left_menu_rocket_extras")
			rocket_container.append(fuel_element)

			document.getElementById("left_menu_fuel").addEventListener("click", ()=>{
				Modals.open_input_dialogue("rocket_fuel", "Crafting", "How many do you want to craft?", "CRAFT")
			})

			const rocket_pot_element = $.parseHTML(
				`<div class="left-menu-item hover" id="left_menu_rocket_pot">
						<img src="${get_image("images/rocket_potion.png")}" title="rocket potion" class="w20">
						<span>Rocket Potion - </span>
						<item-display data-format="number" data-key="rocket_potion"></item-display>
                	</div>`
			)
			rocket_container.append(rocket_pot_element)

			document.getElementById("left_menu_rocket_pot").addEventListener("click", ()=>{
				if(window.var_rocket_potion > 0){
					Brewing.potion_clicked("rocket_potion")
				} else {
					Modals.open_brew_dialogue("rocket_potion")
				}
			})
		}

		update_moon_colour(){
			const moon_dist = parseInt(window.var_moon_distance)
			if(moon_dist <= this.settings.get("good_moon")){
				this.update_css(".moon_distance", "color", "lime")
			} else {
				this.update_css(".moon_distance", "color", "red")
			}
		}

		update_sun_colour(){
			const sun_dist = parseInt(window.var_sun_distance)
			if(sun_dist <= this.settings.get("good_sun")){
				this.update_css(".sun_distance", "color", "lime")
			} else {
				this.update_css(".sun_distance", "color", "red")
			}
		}

		update_ui() {
			this.condense_woodcutting_patches()
			this.condense_farming_patches()
			this.condense_gathering_boxes()
			this.give_images_titles()
			this.add_labels_to_table_items()
			this.condense_ui()
			this.create_machinery_arrow_template()
			this.add_mining_machine_arrows()
			this.restructure_chat()
			this.move_plugins_button()
			this.show_extended_levels()
			this.add_dividers_to_left_menu()
			this.clone_dust_pots()
			this.add_extra_data_to_combat()
			this.hide_active_machinery()
			this.create_mixer_notification()
			this.create_merchant_notification()
			this.fix_left_menu()
			this.create_oil_notification()
			this.add_timer_to_smelt_notification()
			this.purple_key_extras()
			this.create_left_menu_extras()
			this.rocket_extras()
		}

		criptoe_extras(){
			const clock = `<item-display data-format="timer" data-key="utc_time"></item-display>`
			document.getElementById("criptoe_path_selected-left-label").insertAdjacentHTML("beforebegin", clock)
			const now = new Date()
			window.var_utc_time = `${now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()}`

			this.utc_clock = setInterval(() => {
				let new_time = parseInt(window.var_utc_time) + 1
				if (new_time >= 86400){
					new_time = 0
				}
				window.var_utc_time = `${new_time}`
			}, 1000)

			const wallets = document.getElementById("panel-criptoe-market").querySelectorAll(".CToe-chart-table")
			wallets.forEach((wallet, idx)=>{
				const previous_element = wallet.querySelector("item-display")
				const returns_element = `<br><b>Current Payout: </b><span id="wallet_${idx+1}_payout"></span>`
				previous_element.insertAdjacentHTML("afterend", returns_element)
			})
		}

		update_criptoe_payouts(){
			const test = document.getElementById(`criptoe-wallet-1-percentage`).innerText
			if(test==="%0.00"){
				setTimeout(IdlePixelPlus.plugins["ui-tweaks-lite"].update_criptoe_payouts, 1000)
				return
			}
			const wallets = document.getElementById("panel-criptoe-market").querySelectorAll(".CToe-chart-table")
			wallets.forEach((wallet, idx)=>{
				let payout
				const invested = parseInt(window[`var_wallet${idx+1}_invested`]) || 0

				if (invested===0){
					payout = "No investment"
				} else {
					let percentage = document.getElementById(`criptoe-wallet-${idx+1}-percentage`).innerText.split(" ")[0]
					percentage = 1 + (parseFloat(percentage) / 100)

					if (percentage <= -100) {
						payout = "No return"
					} else {
						payout = `${Math.floor(percentage * invested).toLocaleString()}`
					}
				}

				document.getElementById(`wallet_${idx+1}_payout`).innerText = payout
			})
		}

		limitChat() {
			const chatArea = document.getElementById("chat-area");
			const chatLength = chatArea.innerHTML.length;

			if (chatLength > 190000) {
				const children = chatArea.children;

				for (let i = 0; i < 3; i++) {
					try {
						chatArea.removeChild(children[i]);
					} catch (err) {
						console.error("Error cleaning up chat", err);
					}
				}
			}
		}

		onLogin() {
			Paneller.registerPanel("uit_lite_settings", "UIT Lite Settings", IdlePixelPlus.plugins["ui-tweaks-lite"].show_modal)
			this.get_font_list()
			this.create_settings_modal()
			this.apply_set_styles()
			this.update_ui()
			this.criptoe_extras()

			window.var_mixer_charges_remaining = 5
			window.var_uit_oil_notif_label = "Balanced"

			this.loaded = true
		}

		onChat(data) {
			IdlePixelPlus.plugins["ui-tweaks-lite"].limitChat()
			this.make_uuid_clickable()
		}

		onPanelChanged(panelBefore, panelAfter) {
			if (panelAfter === "combat-canvas-raids" || panelAfter === "combat-canvas") {
				document.getElementById("game-chat").style.display = ""
			}
			if (panelAfter === "combat-canvas") {
				document.getElementById("combat_info_fps").textContent = window.var_fight_points
				document.getElementById("combat_info_rare_pot").textContent = window.var_rare_monster_potion_timer || "Inactive"
				document.getElementById("combat_info_loot_pot").textContent = window.var_combat_loot_potion_active === "1" ? "Active" : "Inactive"
			}
			if (panelAfter === "criptoe-market"){
				this.update_criptoe_payouts()
			}
		}

		onVariableSet(key, valueBefore, valueAfter)  {
			if(!this.loaded){return;}
			if (Globals.currentPanel === "panel-combat-canvas") {
				if (key === "fight_points") {
					document.getElementById("combat_info_fps").textContent = `${valueAfter.toLocaleString()}`
				} else if (key === "rare_monster_potion_timer") {
					document.getElementById("combat_info_rare_pot").textContent = valueAfter
				} else if (key === "combat_loot_potion_active") {
					document.getElementById("combat_info_loot_pot").textContent = valueAfter === "1" ? "Active" : "Inactive"
				}
			}

			if (key==="playtime"){
				window.var_next_day_timer = 86400 - valueAfter % 86400
			}
			else if (key==="brewing_xp_mixer_used"){
				window.var_mixer_charges_remaining = 5 - valueAfter
			}
			else if (key === "oil"){
				this.update_oil_notification()
			}
			else if (key === "furnace_ore_type"){
				this.handle_smelt_timer(valueBefore, valueAfter)
			}
			else if (key === "moon_distance"){
				this.update_moon_colour()
			}
			else if (key === "sun_distance"){
				this.update_sun_colour()
			}
		}
	}

	const plugin = new UITweaksPlugin();
	IdlePixelPlus.registerPlugin(plugin);
})();
