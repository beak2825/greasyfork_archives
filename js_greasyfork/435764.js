// ==UserScript==
// @name         Themes - Bonk.io
// @description  Recolors elements in Bonk.io to customizable colors, and allows toggling your theme with a hotkey
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480
// @license      GPL-3.0
// @version      0.1.28
// @match        https://bonk.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.4.6/jscolor.min.js
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/435764/Themes%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/435764/Themes%20-%20Bonkio.meta.js
// ==/UserScript==

(() => {
	const experimental_gmmaker_support = true;
	const configuration_metadata_map = {
		enabled: {
			default_dark: 1,
			default_light: 1,
			description: "Determines if theme is enabled by default when the page loads or if it syncs to system theme",
			datatype: "dropdown",
			options: ["Off", "On", "Sync with system"]
		},
		hotkey: {
			default_dark: "d",
			default_light: "d",
			description: "Hotkey used to toggle the theme on and off\n(Ctrl + Alt + <key>) or (Ctrl + Shift + <key>)",
			datatype: "char"
		},
		colored_text: {
			default_dark: "#40c99e",
			default_light: "#032a71",
			description: "Text color of Custom game rooms with friends online in the room, and 'Added by' in picks",
			datatype: "color"
		},
		primary_text: {
			default_dark: "#f8fafd",
			default_light: "#000000",
			description: "Primary text color",
			datatype: "color"
		},
		secondary_text: {
			default_dark: "#bebebe",
			default_light: "#505050",
			description: "Secondary text color\nNote: Some of the texts are lightened by 'brightness_lighter' above\nthis will have no affect on such texts (Eg: Chat usernames)",
			datatype: "color"
		},
		text_selection_color: {
			default_dark: "#7c7c7c",
			default_light: "#338fff",
			description: "Background of text when it is selected",
			datatype: "color"
		},
		text_selection_text: {
			default_dark: "#f8fafd",
			default_light: "#f8fafd",
			description: "Text color when text is selected",
			datatype: "color"
		},
		window_color: {
			default_dark: "#2b6351",
			default_light: "#009688",
			description: "Color of window titles\n(Eg: Custom games, Leave Game, Chat, Level Select, ...)",
			datatype: "color"
		},
		window_text: {
			default_dark: "#f8fafd",
			default_light: "#ffffff",
			description: "Color of text in window titles\n(Eg: Custom games, Leave Game, Chat, Level Select, ...)",
			datatype: "color"
		},
		page_background: {
			default_dark: "#111111",
			default_light: "#1a2733",
			description: "Used for the main page's background",
			datatype: "color"
		},
		primary_background: {
			default_dark: "#222222",
			default_light: "#e2e2e2",
			description: "Used as the main background color of windows\n(Eg: Chat background, Leave lobby background, Login page)",
			datatype: "color"
		},
		secondary_background: {
			default_dark: "#333333",
			default_light: "#f3f3f3",
			description: "Secondary background color for things inside windows\n(Eg: Auto login, Joining room status text, Map Editor inputs, ...)",
			datatype: "color"
		},
		behind_lobby_background: {
			default_dark: "#131313",
			default_light: "#1a2733",
			description: "Color for the Lobby's background\n(Eg: Behind the Lobby and Map Editor)",
			datatype: "color"
		},
		red_text: {
			default_dark: "#e14747",
			default_light: "#cc3333",
			description: "Used for player nerf indicator in the lobby",
			datatype: "color"
		},
		blue_text: {
			default_dark: "#179be8",
			default_light: "#0955c7",
			description: "Used for [Load] when a map is suggested, and Copy link is clicked",
			datatype: "color"
		},
		green_text: {
			default_dark: "#17e88b",
			default_light: "#155824",
			description: "Used for player buff and in chat friend requests",
			datatype: "color"
		},
		purple_text: {
			default_dark: "#8f68e8",
			default_light: "#6033cc",
			description: "Used for output of /curate",
			datatype: "color"
		},
		magenta_text: {
			default_dark: "#d23cfb",
			default_light: "#800d6e",
			description: "Used for when [Load] is clicked, or when you are now the host of the game",
			datatype: "color"
		},
		button_color: {
			default_dark: "#4f382f",
			default_light: "#795548",
			description: "Button/dropdown color",
			datatype: "color"
		},
		button_outline_color: {
			default_dark: "#4f382f00",
			default_light: "#79554800",
			description: "Button/dropdown outline color",
			datatype: "color"
		},
		hover_button_color: {
			default_dark: "#3a2a24",
			default_light: "#7f5d51",
			description: "Button/dropdown hover color",
			datatype: "color"
		},
		active_button_color: {
			default_dark: "#362620",
			default_light: "#4b252b",
			description: "Button/dropdown click color",
			datatype: "color"
		},
		disabled_button_color: {
			default_dark: "#444444",
			default_light: "#777777",
			description: "Button/dropdown disabled color",
			datatype: "color"
		},
		button_text: {
			default_dark: "#f8fafd",
			default_light: "#ffffff",
			description: "Button/dropdown text color",
			datatype: "color"
		},
		// button_radius: {
		// 	default_dark: "2",
		// 	default_light: "2",
		// 	description: "Button/dropdown radius",
		// 	datatype: "radius"
		// },
		xp_bar_fill: {
			default_dark: "#473aaf",
			default_light: "#473aaf",
			description: "XP bar fill color at the top of your screen whilst in-game",
			datatype: "color"
		},
		bonk_header_color: {
			default_dark: "#333333",
			default_light: "#000000",
			description: "Color of the bonk.io header at the top of the page",
			datatype: "color"
		},
		bonk_header_text: {
			default_dark: "#bebebe",
			default_light: "#4c474a",
			description: "Color of the text in the bonk.io header at the top of the page",
			datatype: "color"
		},
		top_bar_color: {
			default_dark: "#333333c7",
			default_light: "#273749c7",
			description: "Color of the 'top bar'\nMake sure this value is dark, the icon colors are white and can't really be easily changed",
			datatype: "color"
		},
		top_bar_hover_color: {
			default_dark: "#222222",
			default_light: "#2d435a",
			description: "Color of buttons in the 'top bar' when hovered",
			datatype: "color"
		},
		top_bar_active_color: {
			default_dark: "#191919",
			default_light: "#1e2c3c",
			description: "Color of buttons in the 'top bar' when active",
			datatype: "color"
		},
		top_bar_text: {
			default_dark: "#bebebe",
			default_light: "#bebebe",
			description: "Color of text in the 'top bar'",
			datatype: "color"
		},
		football_background: {
			default_dark: "#161616",
			default_light: "#5a7f64",
			description: "Color for the Football gamemode's background\n(Note: Requires restarting the football to apply)\nWarning: Unstable, experimental",
			datatype: "color"
		},
		border_color: {
			default_dark: "#333333",
			default_light: "#a5acb0",
			description: "Color used for subtile borders\n(Eg. Settings border, line separating chat and messages in lobby, and Skin Editor shadows)",
			datatype: "color"
		},
		mini_menu_color: {
			default_dark: "#191919",
			default_light: "#1e2833",
			description: "Used for Tooltips and 'Filter by' in Custom Games",
			datatype: "color"
		},
		mini_menu_text: {
			default_dark: "#bebebe",
			default_light: "#ffffff",
			description: "Used for Tooltips and 'Filter by' in Custom Games",
			datatype: "color"
		},
		scrollbar_background: {
			default_dark: "#191919",
			default_light: "#dddddd",
			description: "Used for the scrollbar's background (Chromium only)",
			datatype: "color"
		},
		scrollbar_thumb: {
			default_dark: "#555555",
			default_light: "#aaaaaa",
			description: "Used for the scrollbar's thumb - which is the thing you drag (Chromium only)",
			datatype: "color"
		},
		list_headers: {
			default_dark: "#2b3839",
			default_light: "#a8bcc0",
			description: "Used for the colors of lists\n(Eg: Friends list and the sections in the Map Editor, ...)",
			datatype: "color"
		},
		table_color: {
			default_dark: "#444444",
			default_light: "#c1cdd2",
			description: "Stripe color for use in tables\n(Eg: Custom games, Friends list, Map Editor, Skin Editor, ...)",
			datatype: "color"
		},
		table_alt_color: {
			default_dark: "#333333",
			default_light: "#d2dbde",
			description: "Alternative stripe color used in tables",
			datatype: "color"
		},
		table_hover_color: {
			default_dark: "#222222",
			default_light: "#aac5d7",
			description: "Color used when a row in a table is hovered",
			datatype: "color"
		},
		table_active_color: {
			default_dark: "#111111",
			default_light: "#9cc8d6",
			description: "Color used when a row in a table is selected",
			datatype: "color"
		},
		brightness_lighter: {
			default_dark: "2.5",
			default_light: "1",
			description: "Used to lighten text that have bad contrast with dark colors\nNote: Change to 1 if making a light theme\n(0.5 = 50%, 1.5 = 150% brightness)",
			datatype: "brightness"
		},
		brightness_darker: {
			default_dark: "0.6",
			default_light: "1",
			description: "Used to darken images that that are too bright\nNote: Change to 1 if making a light theme\n(0.5 = 50%, 1.5 = 150% brightness)",
			datatype: "brightness"
		}
	};

	const datatype_metadata_map = {
		"color": {
			value: "value",
			attributes: {
				type: "text",
				"data-jscolor": ""
			}
		},
		"percentage": {
			value: "value",
			attributes: {
				type: "number",
				max: 1,
				min: 0,
				step: 0.01
			}
		},
		"brightness": {
			value: "value",
			attributes: {
				type: "number",
				max: 10,
				min: 0,
				step: 0.05
			}
		},
		"radius": {
			value: "value",
			attributes: {
				type: "number",
				max: 60,
				min: 0,
				step: 1
			}
		},
		"char": {
			value: "value",
			attributes: { 
				type: "text" ,
				maxLength: 1 
			}
		},
		"dropdown": {
			value: "selectedIndex",
			attributes: {}
		}
	};

	const default_configuration = {};
	for (const [key, value] of Object.entries(configuration_metadata_map)) 
		default_configuration[key] = value.default_dark;

	// Get the currently applied theme
	const get_stored_configuration = () => {
		// Get the stored theme, if it doesn't exist, it will be null
		let stored_theme = localStorage.getItem("bonk_theme");
		try {
			stored_theme = JSON.parse(stored_theme);
		} catch (er) {
			// If the stored theme is somehow corrupted - use blank theme
			console.log("[Themes] Failed to load theme from localstorage");
			console.log(`[Themes] ${stored_theme}`);
			console.error(er);
			alert("[Themes] Failed to load theme from localstorage");
			stored_theme = {};
		}
		// Merge the stored theme with the default (if null, it will overwrite)
		return {...default_configuration, ...stored_theme};
	};

	// Get the stored theme when the page loads
	const configuration = get_stored_configuration();

	let is_theme_enabled;
	const set_default_theme_enabled = () => {
		switch (configuration.enabled) {
			case 0:
				is_theme_enabled = false;
				break;
			case 1:
				is_theme_enabled = true;
				break;
			case 2:
				// Set to system theme
				is_theme_enabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
				break;
		};
	};
	// Set is_theme_enabled at page load
	set_default_theme_enabled();

	// Function that enables/disabled theme
	const toggle_theme = () => {
		const maingameframe_classList = document.getElementById("maingameframe")?.contentDocument?.body?.classList;
		if (is_theme_enabled) {
			document.body.classList.add("themed-colors");
			maingameframe_classList?.add("themed-colors");
		} else {
			document.body.classList.remove("themed-colors");
			maingameframe_classList?.remove("themed-colors");
		}
	};
  
	// If running inside maingameframe, inject our injectors
	if (unsafeWindow.parent !== unsafeWindow) {
		if (!unsafeWindow.bonk_theme) unsafeWindow.bonk_theme = {
      // Null checks in case maingameframe loads before the parent page
			is_on: () => { return unsafeWindow?.parent?.window?.bonk_theme?.is_on() || false },
			get_football_background: () => parseInt(getComputedStyle(document.documentElement)
				.getPropertyValue("--bonk_theme_football_background").trim().slice(1), 16),
			get_hotkey: () => getComputedStyle(document.documentElement)
				.getPropertyValue("--bonk_theme_hotkey").trim() || default_configuration.hotkey
		};

		// Injector for football mode, if it doesn't work, ...well football will be bright
		if (!unsafeWindow.bonkCodeInjectors) unsafeWindow.bonkCodeInjectors = [];
		unsafeWindow.bonkCodeInjectors.push(bonkCode => {
			try {
				// Default football background color, not used elsewhere (yet?)
				const FOOTBALL_BACKGROUND_COLOR = "0x5a7f64";
				// Few things why I haven't implemented team colors

				// first off, like football, you wouldn't be able to toggle the colors on and off without
				// either reloading, or exiting to the lobby and going back, this script is very very stable yet,
				// I wish to allow a hotkey to completely disable the script live
				
				// secondly, I feel like team colors isn't a vital thing people would want to customize, unlike
				// football, as football's background is larger than team colors and might be blinding at night
				
				// thirdly, I wish to modify as little of bonk.io's code as possible

				// eslint-disable-next-line no-unused-vars
				const TEAM_COLORS = {
					RED: "0xf44336",
					BLUE: "0x2196f3",
					GREEN: "0x4caf50",
					YELLOW: "0xffeb3b"
				};

				let newBonkCode = bonkCode;
				newBonkCode = newBonkCode
					.replace(
						FOOTBALL_BACKGROUND_COLOR,
						`(window.bonk_theme.is_on() ? window.bonk_theme.get_football_background() : ${FOOTBALL_BACKGROUND_COLOR})`
					)
					.replace(
						FOOTBALL_BACKGROUND_COLOR,
						`(window.bonk_theme.is_on() ? window.bonk_theme.get_football_background() : ${FOOTBALL_BACKGROUND_COLOR})`
					);
				if (bonkCode === newBonkCode) throw "[Themes] Injection failed!";

				console.log("Themes injector run");
				return newBonkCode;
			} catch (er) {
				// Silently ignore errors, only football's background will be affected
				// which is not that big of a deal
				console.log("[Themes] Failed to inject");
				console.error(er);
				return bonkCode;
			}
		});
	}

	// Toggle theme ASAP as soon as body exists
	const observer = new MutationObserver((_, observer) => {
		// Detect if body element exists
		if (document.body) {
			toggle_theme();
			observer.disconnect();
		}
	});

	observer.observe(document, { childList: true, subtree: true  });

	// Run when the page is loaded
	document.addEventListener("DOMContentLoaded", () => {
		observer.disconnect();
    
		// Check if the script is running inside maingameframe or not
		if (unsafeWindow.parent === unsafeWindow) {
			// Outer bonk.io website
			const maingameframe = document.getElementById("maingameframe");
			toggle_theme();
			// Hotkey to turn the script on and off
			const hotkey_handler = evt => {
				if (!evt.ctrlKey || !(evt.altKey || evt.shiftKey) || !maingameframe.contentWindow.bonk_theme) return;
				if (evt.key?.toLowerCase() === maingameframe.contentWindow.bonk_theme.get_hotkey()) {
					is_theme_enabled = !is_theme_enabled;
					toggle_theme();
				}
			};
			document.addEventListener("keydown", hotkey_handler);
			maingameframe.addEventListener("load", () => {
				maingameframe.contentDocument.addEventListener("keydown", hotkey_handler);
			});

			// Sync theme with browser/OS theme
			window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
				if (configuration.enabled === 2) {
					is_theme_enabled = event.matches;
					toggle_theme();
				}
			});
			
			if (!unsafeWindow.bonk_theme) unsafeWindow.bonk_theme = {
				// So that maingameframe can access is_on
				is_on: () => is_theme_enabled
			};
      
			// Flag to check whether the theme container already exists
			let theme_container_created = false;
			// Create the menu only when someone clicks on the thing in the menu
			// Show the theme container when you click the menu command thing
			unsafeWindow.bonk_theme.open_editor = () => {
				// Creating a new theme_container, don't make new ones after this
				if (theme_container_created) return document.getElementById("theme_container").style.display = "block";
				theme_container_created = true;

				// Create the theme menu. This is really ugly but there's like no other way idk.
				const theme_container = document.createElement("div");
				const theme_container_title = document.createElement("p");
				const configuration_container = document.createElement("div");
				const configuration_container_label = document.createElement("label");
				const configuration_list = document.createElement("div");
				const configuration_json = document.createElement("textarea");
				const configuration_json_label = document.createElement("label");
				const theme_cancel = document.createElement("div");
				const theme_save = document.createElement("div");
				const theme_reset_dark = document.createElement("div");
				const theme_reset_light = document.createElement("div");
		
				// Add the IDs so we can style them with CSS
				theme_container_title.id = "theme_container_title";
				theme_container.id = "theme_container";
				configuration_container_label.id = "configuration_container_label";
				configuration_list.id = "configuration_list";
				configuration_json.id = "configuration_json";
				theme_cancel.id = "theme_cancel";
				theme_save.id = "theme_save";
				theme_reset_dark.class = "theme_reset";
				theme_reset_light.class = "theme_reset";

				// Add the classes
				theme_container_title.classList.add("classicTopBar");
				theme_cancel.classList.add("brownButton", "brownButton_classic", "buttonShadow");
				theme_save.classList.add("brownButton", "brownButton_classic", "buttonShadow");
				theme_reset_dark.classList.add("brownButton", "brownButton_classic", "buttonShadow");
				theme_reset_light.classList.add("brownButton", "brownButton_classic", "buttonShadow");

				// Add text to buttons and titles
				theme_container_title.textContent = "Theme Editor";
				theme_cancel.textContent = "CANCEL";
				theme_save.textContent = "SAVE";
				theme_reset_dark.textContent = "RESET THEME TO DARK PRESET";
				theme_reset_light.textContent = "RESET THEME TO LIGHT PRESET";
				configuration_container_label.textContent = "Hover over settings for more info";
				configuration_json_label.textContent = "Share, Backup or Import theme data - Copy or paste themes from/into the textbox below";
				configuration_json_label.for = "configuration_json";
				configuration_json.value = JSON.stringify(configuration);
				
				theme_container.appendChild(theme_container_title);

				configuration_list.appendChild(configuration_container_label);
				configuration_list.appendChild(document.createElement("br"));

				// Populate the themes list with the theme that is currently loaded
				for (const [key, value] of Object.entries(configuration)) {
					// Check if the setting exists
					if (!configuration_metadata_map[key]) continue;
					const datatype = configuration_metadata_map[key].datatype;
					const datatype_metadata = datatype_metadata_map[datatype];
					const configuration_container = document.createElement("div");
					const configuration_name = document.createElement("p");
          
					configuration_container.classList.add("configuration_container");
					configuration_name.classList.add("configuration_name");
					configuration_container.dataset["configuration_name"] = key;
					configuration_container.title = configuration_metadata_map[key].description ?? "No description";
					configuration_name.textContent = key.replace(/_/g, " ");

					let configuration_value;
					if (datatype === "dropdown") {
						configuration_value = document.createElement("select");
						configuration_value[datatype_metadata.value] = value;
						
						for (const [option_value, label] of Object.entries(configuration_metadata_map[key].options)) {
							const option = document.createElement("option");
							option.innerText = label;
							option.value = option_value;
							option.selected = value == option_value;
							configuration_value.appendChild(option);
						}
					} else {
						// All other <input> datatypes
						configuration_value = document.createElement("input");

						for (const [key, value] of Object.entries(datatype_metadata.attributes))
							configuration_value.setAttribute(key, value);

						configuration_value.classList.add("configuration_value");
						configuration_value[datatype_metadata.value] = value;
					}
					
					configuration_value.addEventListener("input", () => {
						if (!datatype_metadata.ignore_change) {
							// Store it in the current configuration (so it can be saved later)
							configuration[key] = configuration_value[datatype_metadata.value];
							
							if (key === "enabled") {
								set_default_theme_enabled();
								toggle_theme();
							} else {
								// Update the CSS variable on both bonk.io and maingameframe
								document.documentElement.style
									.setProperty(`--bonk_theme_${key}`, configuration_value.value);
								maingameframe.contentDocument.documentElement.style
									.setProperty(`--bonk_theme_${key}`, configuration_value.value);								
							}
							
						}

						// Update the data at the bottom
						configuration_json.value = JSON.stringify(configuration);
					});

					// Add the current config to the list of settings
					configuration_container.appendChild(configuration_name);
					configuration_container.appendChild(configuration_value);
					configuration_list.appendChild(configuration_container);
				}

				// Add the Save and Cancel buttons
				configuration_container.appendChild(theme_cancel);
				configuration_container.appendChild(theme_save);

				configuration_list.appendChild(document.createElement("br")); // this
				configuration_list.appendChild(configuration_container);
				configuration_list.appendChild(document.createElement("br")); // is
				configuration_list.appendChild(configuration_json_label);
				configuration_list.appendChild(document.createElement("br")); // so
				configuration_list.appendChild(configuration_json);
				configuration_list.appendChild(document.createElement("br")); // bad
				configuration_list.appendChild(theme_reset_dark);
				configuration_list.appendChild(theme_reset_light);
				theme_container.appendChild(configuration_list);

				// When save is clicked, try save theme to localstorage
				theme_save.addEventListener("click", () => {
					try {
						localStorage.setItem("bonk_theme", JSON.stringify(configuration));
						theme_container.style.display = "none";
					} catch (er) {
						console.log("[Themes] Failed to save theme to localstorage");
						console.log(`[Themes] ${JSON.stringify(configuration)}`);
						console.error(er);
						alert("Failed to save theme to localstorage");
					}
				});

				// Reset the state of configuration from localstorage
				theme_cancel.addEventListener("click", () => {
					configuration_json.value = JSON.stringify(get_stored_configuration());
					configuration_json.dispatchEvent(new CustomEvent("input"));
					theme_container.style.display = "none";
				});

				// Get the currently saved theme, and overwrite everything with it
				theme_reset_dark.addEventListener("click", () => {
					configuration_json.value = JSON.stringify(default_configuration);
					configuration_json.dispatchEvent(new CustomEvent("input"));
				});

				theme_reset_light.addEventListener("click", () => {
					// Light theme defaults are not calculated by default, so we need to calculate it here now
					const default_light_configuration = {};
					for (const [key, value] of Object.entries(configuration_metadata_map)) 
						default_light_configuration[key] = value.default_light;

					configuration_json.value = JSON.stringify(default_light_configuration);
					configuration_json.dispatchEvent(new CustomEvent("input"));
				});

				configuration_json.addEventListener("input", () => {
					try {
						const new_theme = JSON.parse(configuration_json.value);
						// Update the configurations
						const configuration_list_children = Array.from(configuration_list.children);
						for (const configuration_container of configuration_list_children) {
							const key = configuration_container.dataset["configuration_name"];
							const value = new_theme[key];
							if (!value) continue;

							const configuration_value = configuration_container.children[1];
							const datatype_meta = datatype_metadata_map[configuration_metadata_map[key].datatype];
						
							configuration_value[datatype_meta.value] = value;
							configuration_value.dispatchEvent(new CustomEvent("input"));
						}

						// If success, remove the border
						configuration_json.style.setProperty("border", "none");
					} catch (er) {
						console.log("[Themes] Failed to load theme from <textarea>");
						console.log(`[Themes] ${configuration_json.value}`);
						console.error(er);
						// If there is an error, set a red border
						configuration_json.style.setProperty("border", "3px solid var(--bonk_theme_red)", "important");
					}
				});

				// Add the theme dialog to body
				document.body.appendChild(theme_container);

				// eslint-disable-next-line no-undef
				JSColor.presets.default = {
					width: 250, 
					height: 250, 
					padding: 12,
					sliderSize: 24,
					format: "hexa",
					uppercase: false,
					mode: "HVS",
					position: "left",
					alphaChannel: true,
					borderRadius: 3,
					backgroundColor: "var(--bonk_theme_mini_menu_color)",
					controlBorderColor: "var(--bonk_theme_border_color)",
					borderColor: "transparent",
					previewSize: 24
				};
				
				// eslint-disable-next-line no-undef
				JSColor.install();
			};

			// eslint-disable-next-line no-undef
			GM_registerMenuCommand("Edit theme", unsafeWindow.bonk_theme.open_editor);
		} else {
			const bonk_theme_button = document.createElement("div");
			const pretty_top_bar = document.getElementById("pretty_top_bar");
			const button_count = document.querySelectorAll("#pretty_top_bar>.pretty_top_button.niceborderleft").length;

			bonk_theme_button.id = "pretty_top_bonk_theme";
			bonk_theme_button.classList.add("pretty_top_button", "niceborderleft");
			pretty_top_bar.appendChild(bonk_theme_button);

			// eslint-disable-next-line no-undef
			GM_addStyle(`
				#pretty_top_bonk_theme {
					width: 58px;
					height: 34px;
					background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' viewBox='0 0 24 24'%3E%3Cpath d='M18 4V3c0-.6-.5-1-1-1H5a1 1 0 0 0-1 1v4c0 .6.5 1 1 1h12c.6 0 1-.5 1-1V6h1v4H9v11c0 .6.5 1 1 1h2c.6 0 1-.5 1-1v-9h8V4h-3z'/%3E%3C/svg%3E");
					background-size: 24px 24px;
					background-repeat: no-repeat;
					background-position: center;
					position: absolute;
					right: ${(button_count * 58) + 1}px;
					top: 0;
				}
			`);	

			bonk_theme_button.addEventListener("click", () => {
				unsafeWindow.parent.window.bonk_theme.open_editor();
			});
		}
	});
	
	// List of default CSS variables
	let root_vars = [];
	for (const [key, value] of Object.entries(configuration))
		root_vars.push(`--bonk_theme_${key}: ${value};`);

	// eslint-disable-next-line no-undef
	GM_addStyle(`
	/* CSS Variables, so we can edit their values on the fly */
	:root {
		${root_vars.join("\n		")}
	}

	/* Page background color */
	.themed-colors #pagecontainer,
	body.themed-colors { 
		background-color: var(--bonk_theme_page_background) !important;
	}

	:root .themed-colors {
		--kkleeMultiSelectColour: var(--bonk_theme_colored_text) !important;
		--kkleeErrorColour: var(--bonk_theme_red_text) !important;
		--kkleeCheckboxTfsTrue: var(--bonk_theme_green_text) !important;
		--kkleeCheckboxTfsFalse: var(--bonk_theme_red_text) !important;
		--kkleePreviewSliderDefaultMarkerColour: var(--bonk_theme_button_color) !important;
		--kkleePreviewSliderMarkerBackground: linear-gradient(90deg, transparent 36%, var(--kkleePreviewSliderDefaultMarkerColour), transparent 42%) !important;
		--gm_primary_text: var(--bonk_theme_primary_text) !important;
		--gm_secondary_text: var(--bonk_theme_secondary_text) !important;
		--gm_window_color: var(--bonk_theme_window_color) !important;
		--gm_window_text: var(--bonk_theme_window_text) !important;
		--gm_primary_background: var(--bonk_theme_primary_background) !important;
		--gm_behind_lobby_background: var(--bonk_theme_behind_lobby_background) !important;
		--gm_list_headers: var(--bonk_theme_list_headers) !important;
		--gm_table_color: var(--bonk_theme_table_color) !important;
		--gm_table_alt_color: var(--bonk_theme_table_alt_color) !important;
		--gm_button_text: var(--bonk_theme_button_text) !important;
		--gm_button_primary_color: var(--bonk_theme_button_color) !important;
		--gm_button_secondary_color: var(--bonk_theme_active_button_color) !important;
		--gm_button_top_bar_color: var(--bonk_theme_top_bar_color) !important;
	}

	/* Cloudflare error page stying when bonk.io is down */
    .themed-colors #cf-wrapper {
        background-color: var(--bonk_theme_primary_background) !important;
 	}

    .themed-colors #cf-wrapper #cf-error-details > div:nth-child(2) {
        color: var(--bonk_theme_primary_text) !important;
        background-color: var(--bonk_theme_secondary_background) !important;
        background-image: none !important;
 	}

	.themed-colors #cf-wrapper .text-black-dark {
	    color: var(--bonk_theme_primary_text) !important;
	}

	.themed-colors #cf-wrapper,
	.themed-colors #cf-wrapper .text-gray-600 {
	    color: var(--bonk_theme_secondary_text);
	}

	.themed-colors #cf-wrapper .text-red-error {
		color: var(--bonk_theme_red_text) !important;
	}

	.themed-colors #cf-wrapper .text-green-success {
		color: var(--bonk_theme_green_text) !important;
	}

	.themed-colors #cf-wrapper a {
		color: var(--bonk_theme_blue_text);
	}

	.themed-colors #cf-wrapper .cf-error-source:after {
		box-shadow: 0 0 4px 4px var(--bonk_theme_primary_background);
		background-color: var(--bonk_theme_primary_background) !important;
	}

	.themed-colors #cf-wrapper .border-gray-300 {
		border-color: var(--bonk_theme_border_color) !important;
	}

	/* Dark scroll bar tracks on Firefox and Chromium-based browsers */
	.themed-colors {
		scrollbar-color: var(--bonk_theme_scrollbar_thumb) var(--bonk_theme_scrollbar_background) !important;
	}

	.themed-colors ::-webkit-scrollbar-track {
		background-color: var(--bonk_theme_scrollbar_background) !important;
	}

	.themed-colors ::-webkit-scrollbar-thumb {
		background-color: var(--bonk_theme_scrollbar_thumb) !important;
	}

	/* Blockly Scrollbar theming support (for gmmaker by SneezingCactus) */
	${experimental_gmmaker_support ? "" : "/*"}
	.themed-colors .blocklyScrollbarBackground {
		fill: var(--bonk_theme_scrollbar_background) !important;
	}

	.themed-colors .blocklyScrollbarHandle {
		fill: var(--bonk_theme_scrollbar_thumb) !important;
	}
	${experimental_gmmaker_support ? "" : "*/"}

	/* Text selection color */
	.themed-colors ::selection {
		color: var(--bonk_theme_text_selection_text) !important;
		background: var(--bonk_theme_text_selection_color) !important;
	}

	/* Color tooltips */
	${experimental_gmmaker_support ? "" : "/*"}
	.themed-colors .blocklyDropDownDiv,
	.themed-colors .blocklyMenuItem,
	${experimental_gmmaker_support ? "" : "*/"}
	.themed-colors #friendsToolTip,
	.themed-colors #pretty_top_replay_report_tooltip,
	.themed-colors #pretty_top_replay_fav_tooltip,
	.themed-colors #newbonklobby_tooltip,
	.themed-colors #mapeditor_rightbox_shapeaddmenucontainer,
	.themed-colors #mapeditor_leftbox_createmenucontainerleft,
	.themed-colors #mapeditor_leftbox_createmenucontainerright,
	.themed-colors #mapeditor_leftbox_copywindow,
	.themed-colors #mapeditor_rightbox_newjointmenu,
	.themed-colors .newbonklobby_playerentry_menu,
	.themed-colors .newbonklobby_playerentry_menu_submenu {
		background-color: var(--bonk_theme_mini_menu_color) !important;
		color: var(--bonk_theme_mini_menu_text) !important;
	}

	/* Color the lobby's background */
	.themed-colors .bt-behind-lobby-background,
	.themed-colors #bonkiocontainer {
		background-color: var(--bonk_theme_behind_lobby_background) !important;
	}
	
	/* Dialogs - I can just do windowShadow, but it might break things if new things are added */
	/* It's better to have a new thing visibly light rather than broken */
	${experimental_gmmaker_support ? "" : "/*"} .themed-colors #gmeditorwindow, ${experimental_gmmaker_support ? "" : "*/"}
	.themed-colors .bt-primary-background,
	.themed-colors #autoLoginContainer,
	.themed-colors #guestOrAccountContainer_accountBox,
	.themed-colors #guestOrAccountContainer_guestBox,
	.themed-colors #guestContainer, 
	.themed-colors .accountContainer,
	.themed-colors #registerwindow_remember_label,
	.themed-colors #loginwindow_remember_label,
	.themed-colors #loginwindow,
	.themed-colors #registerwindow,
	.themed-colors #settingsContainer,
	.themed-colors .settingsHeading,
	.themed-colors .redefineControls_selectionCell:hover,
	.themed-colors #newswindow,
	.themed-colors #skinmanager,
	.themed-colors .skineditor_shapewindow,
	.themed-colors .skineditor_shapewindow_imagecontainer,
	.themed-colors #skineditor_propertiesbox,
	.themed-colors #skineditor_propertiesbox_table,
	.themed-colors #skineditor_previewbox,
	.themed-colors #skineditor_layerbox,
	.themed-colors #skineditor_layerbox_baselabel,
	.themed-colors #quickPlayWindow,
	.themed-colors #roomlistcreatewindow,
	.themed-colors .roomlistcreatewindowlabel,
	.themed-colors #roomlistjoinpasswordwindow,
	.themed-colors #sm_connectingWindow,
	.themed-colors #newbonklobby_specbox,
	.themed-colors #newbonklobby_playerbox,
	.themed-colors #newbonklobby_chatbox,
	.themed-colors #newbonklobby_settingsbox,
	.themed-colors #newbonklobby_votewindow,
	.themed-colors #newbonklobby_votewindow_maptitle,
	.themed-colors #newbonklobby_votewindow_mapauthor,
	.themed-colors #leaveconfirmwindow,
	.themed-colors #leaveconfirmwindow_text2,
	.themed-colors #hostleaveconfirmwindow,
	.themed-colors #hostleaveconfirmwindow_text2,
	.themed-colors #maploadwindow,
	.themed-colors #maploadwindowgreybar,
	.themed-colors #maploadwindowstatustext,
	.themed-colors #mapeditor_leftbox,
	.themed-colors #mapeditor_midbox,
	.themed-colors #mapeditor_rightbox,
	.themed-colors #mapeditor_save_window,
	.themed-colors #kkleeRoot,
	.themed-colors #skineditor_colorpicker,
	.themed-colors #mapeditor_colorpicker,
	.themed-colors #friendsSendWindow,
	.themed-colors #roomlistfilterwindow,
	.themed-colors #ingamecountdown,
	.themed-colors #mapeditor_save_overwrite_window,
	.themed-colors .newbonklobby_elementcontainer,
	.themed-colors #passwordChangeContainer,
	.themed-colors .passwordChange_fieldlabel,
	#theme_container {
		background-color: var(--bonk_theme_primary_background) !important;
		color: var(--bonk_theme_primary_text) !important;
	}

	/* Lighter backgrounds for some menus and stuff */
	.themed-colors .bt-secondary-background,
	.themed-colors .windowTopBar_classic,
	.themed-colors #autoLogin_text,
	.themed-colors .guestOrAccountContainerLabelBox,
	.themed-colors #guest_nametext,
	.themed-colors #loginwindow_username,
	.themed-colors #loginwindow_password,
	.themed-colors #registerwindow_username,
	.themed-colors #registerwindow_password,
	.themed-colors #guest_skinbox,
	.themed-colors #skineditor_propertiesbox_blocker,
	.themed-colors #newswindow_white,
	.themed-colors .quickPlayWindowModeDiv,
	.themed-colors .quickPlayWindowText1,
	.themed-colors .quickPlayWindowText2,
	.themed-colors .quickPlayWindowText3,
	.themed-colors #roomlist,
	.themed-colors #roomlisttableheadercontainer,
	.themed-colors .roomlistcreatewindowinput,
	.themed-colors .whiteInputField,
	.themed-colors #sm_connectingWindow_text,
	.themed-colors #friendsContainer,
	.themed-colors .friends_table,
	.themed-colors .skinmanager_icon,
	.themed-colors #maploadwindowsearchinput,
	.themed-colors .maploadwindowmapdiv,
	.themed-colors #mapeditor_midbox_explain,
	.themed-colors #mapeditor_rightbox_namefield,
	.themed-colors #descriptioninner,
	.themed-colors #passwordChange_statuslabel,
	.themed-colors .passwordChange_field,
	.themed-colors .control_indicator,
	.configuration_value,
	#configuration_json {
		border-color: transparent !important;
		background-color: var(--bonk_theme_secondary_background) !important;
		color: var(--bonk_theme_primary_text) !important;
	}

	${experimental_gmmaker_support ? "" : "/*"}
	.themed-colors .blocklyToolboxDiv {
		background-color: var(--bonk_theme_mini_menu_color) !important;
		color: var(--bonk_theme_mini_menu_text) !important;
	}

	.themed-colors .blocklyMainBackground {
		stroke: none !important;
		fill: var(--bonk_theme_secondary_background) !important;
	}

	.themed-colors .blocklyFlyoutBackground {
		fill: var(--bonk_theme_mini_menu_color) !important;
	}

	.themed-colors .blocklyFlyoutLabelText {
		fill: var(--bonk_theme_mini_menu_text) !important;
	}
	${experimental_gmmaker_support ? "" : "*/"}

	/* Style checkboxes */
	.themed-colors .control_indicator:after {
		border-color: var(--bonk_theme_primary_text) !important;
	}

	.themed-colors #descriptioninner {
		background-image: none !important;
		box-shadow: -1px -1px 0 rgb(0 0 0 / 10%), -3px -3px 0 var(--bonk_theme_border_color), -4px -4px 0 rgb(0 0 0 / 13%), -6px -6px 0 var(--bonk_theme_border_color), -7px -7px 0 rgb(0 0 0 / 15%), -9px -9px 0 var(--bonk_theme_border_color), -10px -10px 0 rgb(0 0 0 / 18%), 4px 4px 5px var(--bonk_theme_border_color)
	}
	
	.themed-colors .mapeditor_field,
	.themed-colors .skineditor_field,
	.themed-colors .mapeditor_rightbox_table_shape_headerfield {
		border-color: transparent;
		background-color: var(--bonk_theme_secondary_background);
		color: var(--bonk_theme_primary_text);
	}
	
	${experimental_gmmaker_support ? "" : "/* :not([style]) is to ignore blockly color blocks"}
	.themed-colors .blocklyEditableText>rect:not([style]) {
		fill: var(--bonk_theme_secondary_background) !important;
	}

	.themed-colors .blocklyEditableText>text {
		fill: var(--bonk_theme_primary_text) !important;
	}
	${experimental_gmmaker_support ? "" : "*/"}

	.themed-colors .newbonklobby_playerentry_name,
	.themed-colors #newbonklobby_modetext,
	.themed-colors #newbonklobby_roundslabel,
	.themed-colors .maploadwindowtext,
	.themed-colors #roomliststatustext, 
	.themed-colors #roomlisttable,
	.themed-colors .mapeditor_rightbox_table_leftcell,
	.themed-colors .mapeditor_rightbox_table_rightcell,
	.themed-colors .mapeditor_rightbox_table,
	.themed-colors #ingamecountdown_text,
	.themed-colors #bonkiobugemail,
	.themed-colors .maploadwindowtext_picks {
		color: var(--bonk_theme_primary_text) !important;
	}

	.themed-colors .newbonklobby_mapsuggest_high,
	.themed-colors .newbonklobby_chat_msg_name {
		color: var(--bonk_theme_primary_text);
	}

	.themed-colors .newbonklobby_playerentry_level,
	.themed-colors .newbonklobby_playerentry_pingtext, 
	.themed-colors #newbonklobby_chat_lowerinstruction,
	.themed-colors #newbonklobby_chat_lowerline, 
	.themed-colors .newbonklobby_chat_msg_txt,
	.themed-colors #newbonklobby_chat_input,
	.themed-colors #newbonklobby_maptext,
	.themed-colors #newbonklobby_roundsinput,
	.themed-colors #newbonklobby_mapauthortext,
	.themed-colors #newbonklobby_votewindow_maptitle_by,
	.themed-colors #hostleaveconfirmwindow_text1,
	.themed-colors #leaveconfirmwindow_text1,
	.themed-colors .maploadwindowtextmode_picks,
	.themed-colors .maploadwindowtextmode,
	.themed-colors .maploadwindowtextauthor,
	.themed-colors .maploadwindowtextauthor_picks,
	.themed-colors .roomlisttablejoined {
		color: var(--bonk_theme_secondary_text) !important;
	}

	/* Lobby chat */
	.themed-colors .newbonklobby_mapsuggest_low {
		color: var(--bonk_theme_secondary_text);
	}

	/* Copy link */
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(9, 85, 199);"],
	.themed-colors .newbonklobby_chat_link {
		color: var(--bonk_theme_blue_text) !important;
	}

	/* /help, player join */
	.themed-colors .newbonklobby_playerentry_balance_nerf,
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(204, 48, 48);"],
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(204, 68, 68);"],
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(204, 51, 51);"],
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(255, 0, 0);"] {
		color: var(--bonk_theme_red_text) !important;
	}

	/* Friend requests */
	.themed-colors .newbonklobby_playerentry_balance_buff,
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(0, 103, 93);"] {
		color: var(--bonk_theme_green_text) !important;
	}

	/* /curate */
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(96, 51, 204);"] {
		color: var(--bonk_theme_purple_text) !important;
	}

	/* "You are now host" */
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(122, 25, 154);"],
	.themed-colors #newbonklobby_chat_content span[style="color: rgb(128, 13, 110);"] {
		color: var(--bonk_theme_magenta_text) !important;
	}

	${experimental_gmmaker_support ? "" : "/*"} .themed-colors .blocklyMenuItemCheckbox, ${experimental_gmmaker_support ? "" : "*/"} 
	.themed-colors .newbonklobby_chat_status:not([style]) {
		filter: brightness(var(--bonk_theme_brightness_lighter)) !important;
	}

	.themed-colors #descriptioncontainer,
	.themed-colors #gamethumbbox,
	.themed-colors #bgreplay {
		filter: brightness(var(--bonk_theme_brightness_darker)) !important;
	}

	/* Style sliders */
	.themed-colors .compactSlider,
	.themed-colors .newbonklobby_playerentry_balancetext {
		background-color: transparent !important;
		color: var(--bonk_theme_button_text) !important;
	}
	
	.themed-colors.compactSlider::-webkit-slider-runnable-track {
		background: var(--bonk_theme_secondary_background);
	}
	
	.compactSlider::-webkit-slider-thumb {
		background: var(--bonk_theme_primary_text);
	}

	.compactSlider:focus::-webkit-slider-runnable-track {
		background: var(--bonk_theme_secondary_background);
	}

	.compactSlider::-moz-range-track {
		background: var(--bonk_theme_secondary_background);
	}

	.compactSlider::-moz-range-thumb {
		background: var(--bonk_theme_primary_text);
	}
	
	.compactSlider::-ms-fill-lower {
		background: var(--bonk_theme_secondary_background);
	}

	.compactSlider::-ms-fill-upper {
		background: var(--bonk_theme_secondary_background);
	}

	.compactSlider::-ms-thumb {
		background: var(--bonk_theme_primary_text);
	}

	.compactSlider:focus::-ms-fill-lower {
		background: var(--bonk_theme_secondary_background);
	}

	.compactSlider:focus::-ms-fill-upper {
		background: var(--bonk_theme_secondary_background);
	}

	/* Style buttons & dropdowns */
	.themed-colors .brownButton_classic,
	.themed-colors .dropdown_classic,
	.themed-colors .skineditor_field_button,
	.themed-colors .mapeditor_field_button,
	.themed-colors .skineditor_basiccolorpicker_closebutton,
	#theme_save, #theme_cancel, .theme_reset {
		background-color: var(--bonk_theme_button_color) !important;
		color: var(--bonk_theme_button_text) !important;
	}

	.themed-colors .brownButton_classic,
	.themed-colors .dropdown-title,
	.themed-colors .skineditor_field_button,
	.themed-colors .mapeditor_field_button,
	.themed-colors .skineditor_basiccolorpicker_closebutton,
	#theme_save, #theme_cancel, .theme_reset {
		outline: 2px solid var(--bonk_theme_button_outline_color) !important;
		outline-offset: -1px !important;
	}

	.themed-colors .brownButtonDisabled,
	.themed-colors .brownButton_disabled_classic,
	.themed-colors .dropdown-option-disabled {
		background-color: var(--bonk_theme_disabled_button_color) !important;
		color: var(--bonk_theme_button_text) !important;
	}

	.themed-colors .brownButton_classic:hover,
	.themed-colors .dropdown_classic:hover,
	.themed-colors .skineditor_basiccolorpicker_closebutton:hover,
	#theme_save:hover, #theme_cancel:hover, .theme_reset:hover {
		background-color: var(--bonk_theme_hover_button_color) !important;
		color: var(--bonk_theme_button_text) !important;
	}

	.themed-colors .brownButton_classic:active,
	.themed-colors .dropdown_classic:active,
	.themed-colors .newbonklobby_teamlockbutton_warn,
	.themed-colors .skineditor_basiccolorpicker_closebutton:active,
	#theme_save:active, #theme_cancel:active, .theme_reset:active {
		background-color: var(--bonk_theme_active_button_color) !important;
		color: var(--bonk_theme_button_text) !important;
	}

	/* Remove border in buttons in the Map and Skin editor, and round them */
	.themed-colors .skineditor_field_button,
	.themed-colors .mapeditor_field_button {
		border-radius: 2px !important;
		border-color: transparent !important;
	}

	.themed-colors .dropdown-title {
		border-radius: 2px !important;
	}

	/* Not sure why there is a white background - removed */
	.themed-colors #maploadtypedropdown {
		background: none !important;
	}

	/* Tables in the game - Skin editor, Map Editor and Custom game list */
	.themed-colors #roomlisttable tr:nth-child(odd),
	.themed-colors .friends_table>tbody:nth-child(odd),
	.themed-colors #skineditor_layerbox_layertable tr:nth-child(odd),
	.themed-colors #mapeditor_leftbox_platformtable tr:nth-child(odd),
	.themed-colors #mapeditor_leftbox_spawntable tr:nth-child(odd),
	.themed-colors #redefineControls_table tr:nth-child(odd),
	.themed-colors .roomlistfilterwindow_a,
	.themed-colors #redefineControls_table th,
	.themed-colors #hostPlayerMenuControls > table > tbody > tr{
		background-color: var(--bonk_theme_table_color) !important;
		color: var(--bonk_theme_primary_text) !important;
	}

	.themed-colors #roomlisttable tr:nth-child(even),
	.themed-colors .friends_table tr:nth-child(even),
	.themed-colors #skineditor_layerbox_layertable tr:nth-child(even),
	.themed-colors #mapeditor_leftbox_platformtable tr:nth-child(even),
	.themed-colors #mapeditor_leftbox_spawntable tr:nth-child(even),
	.themed-colors #redefineControls_table tr:nth-child(even),
	.themed-colors #roomlisttableheadercontainer,
	.themed-colors .roomlistfilterwindow_b {
		background-color: var(--bonk_theme_table_alt_color) !important;
		color: var(--bonk_theme_primary_text) !important;
	}

	.themed-colors #roomlisttable tr.FRIENDSPRESENT,
	.themed-colors .maploadwindowtextaddedby_picks {
		color: var(--bonk_theme_colored_text) !important;
	}

	.themed-colors tr.HOVERUNSELECTED:hover td {
		background-color: var(--bonk_theme_table_hover_color) !important;
	}

	.themed-colors tr.HOVERSELECTED td,
	.themed-colors tr.SELECTED td {
		background-color: var(--bonk_theme_table_active_color) !important;
	}

	/* "popup" color, custom room list top bar */
	.themed-colors .bt-titlebar,
	.themed-colors .windowTopBar_classic, 
	.themed-colors .classicTopBar,
	.themed-colors .newbonklobby_boxtop, 
	.themed-colors .newbonklobby_boxtop_classic,
	.themed-colors .friends_topbar,
	.themed-colors #newbonklobby_votewindow_top,
	.themed-colors #hostleaveconfirmwindow_top,
	.themed-colors #leaveconfirmwindow_top,
	.themed-colors #ingamecountdown_top,
	.themed-colors #roomlisthidepasswordedcheckboxlabel,
	#theme_container_title {
		background-color: var(--bonk_theme_window_color) !important;
		color: var(--bonk_theme_window_text) !important;
	}

	/* Style the bonk.io header */
	.themed-colors #bonkioheader {
		background-color: var(--bonk_theme_bonk_header_color) !important;
		color: var(--bonk_theme_bonk_header_text) !important;
	}

	/* Style the top bar */
	.themed-colors #pretty_top_bar {
		background-color: var(--bonk_theme_top_bar_color) !important;
		color: var(--bonk_theme_top_bar_text) !important;
	}

	.themed-colors .pretty_top_button,
	.themed-colors #pretty_top_name,
	.themed-colors #pretty_top_name,
	.themed-colors #pretty_top_level,
	.themed-colors #pretty_top_playercount {
		color: var(--bonk_theme_top_bar_text) !important;
	}

	.themed-colors #pretty_top_replay>.pretty_top_button,
	.themed-colors #pretty_top_volume>.pretty_top_button {
		background-color: var(--bonk_theme_top_bar_color) !important;
	}

	.themed-colors .pretty_top_button:hover,
	.themed-colors #pretty_top_replay>.pretty_top_button:hover,
	.themed-colors #pretty_top_volume>.pretty_top_button:hover {
		background-color: var(--bonk_theme_top_bar_hover_color) !important;
	}

	.themed-colors .pretty_top_button:active,
	.themed-colors #pretty_top_replay>.pretty_top_button:active,
	.themed-colors #pretty_top_volume>.pretty_top_button:active {
		background-color: var(--bonk_theme_top_bar_active_color) !important;
	}

	/* Change color of borders in settings and the map editor */
	${experimental_gmmaker_support ? "" : "/*"} .themed-colors .blocklyDropDownDiv, ${experimental_gmmaker_support ? "" : "*/"}
	.themed-colors .mapeditor_rightbox_table_shape_container,
	.themed-colors #redefineControls_table td,
	.themed-colors #redefineControls_table th,
	.themed-colors #redefineControls_table,
	.themed-colors .descriptionthumbl,
	.themed-colors .descriptionthumbr {
		border: 1px solid var(--bonk_theme_border_color) !important;
	}

	/* Change shadow colors */
	.themed-colors .skinmanager_icon,
	.themed-colors #skineditor_previewbox_skincontainer {
		box-shadow: 2px 2px 3px var(--bonk_theme_border_color) !important;
	}

	/* Players in lobby */
	.themed-colors .newbonklobby_playerentry {
		border-left: 4px solid var(--bonk_theme_primary_background) !important;
		border-top: 4px solid var(--bonk_theme_primary_background) !important;
		border-right: 4px solid var(--bonk_theme_primary_background) !important;
		background-color: var(--bonk_theme_primary_background) !important;
		color: var(--bonk_theme_primary_text) !important;
	}

	.themed-colors .newbonklobby_playerentry:hover {
		border-left: 4px solid var(--bonk_theme_secondary_background) !important;
		border-top: 4px solid var(--bonk_theme_secondary_background) !important;
		border-right: 4px solid var(--bonk_theme_secondary_background) !important;
		background-color: var(--bonk_theme_secondary_background) !important;
	}

	.themed-colors #newbonklobby_chat_lowerline {
		border-top: 1px solid var(--bonk_theme_border_color) !important;
	}

	.themed-colors #newbonklobby_playerbox_middleline {
		border-left: 1px solid var(--bonk_theme_border_color) !important;
	}

	/* Headings in the Map Editor and stuff */
	.themed-colors .friends_titles,
	.themed-colors .mapeditor_table_heading_div {
		background-color: var(--bonk_theme_list_headers) !important;
	}

	/* Change the XP bar to use the colors we want */
	.themed-colors #xpbarfill {
		background-color: var(--bonk_theme_xp_bar_fill) !important;
	}

	/* Below is CSS for our theme editor thing */
	#theme_container {
		border-radius: 3px 0px 3px 3px;
		z-index: 999;
		font-family: "futurept_b1";
		padding: 0px;
		right: 0px;
		top: 0px;
		position: fixed;
		overflow-y: scroll;
		max-height: 100vh;
		width: 20em;
	}

	#configuration_list {
		padding: 1.5em;
		display: flex;
		flex-direction: column;
	}

	#theme_container_title {
		text-align: center;
		margin: 0px;
		font-size: 20px;
		line-height: 32px;
		font-family: "futurept_b1"
	}

	.configuration_container {
		white-space: pre-line;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 2.25em;
	}

	.configuration_name {
		text-transform: capitalize;
		float: left;
		width: 70%;
	}

	.configuration_value {
		float: right;
		width: 25%;
	}

	.configuration_value.jscolor {
		border-left: none !important;
	}

	#theme_cancel {
		float: left;
	}

	#theme_save {
		float: right;
	}

	#theme_save,
	#theme_cancel {
		width: 45%;
		height: 30px;
		line-height: 30px;
	}

	#configuration_json {
		align-self: center;
		resize: none;
		width: 100%;
		height: 15em;
	}
	`);
})();