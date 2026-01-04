// ==UserScript==
// @name        Internet Roadtrip Autopilot
// @namespace   nlurker
// @match       https://neal.fun/internet-roadtrip/*
// @version     1.4
// @author      nlurker
// @description After you set a Pathfinder destination, Autopilot will vote for each turn along the path.
// @license     MIT
// @grant       GM.setValues
// @grant       GM.getValues
// @icon        https://files.catbox.moe/jhdqzq.png
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/543918/Internet%20Roadtrip%20Autopilot.user.js
// @updateURL https://update.greasyfork.org/scripts/543918/Internet%20Roadtrip%20Autopilot.meta.js
// ==/UserScript==

// This works together with irf.d.ts to give us type hints
/* globals IRF */
/**
  * Internet Roadtrip Framework
  * @typedef {typeof import('internet-roadtrip-framework')} IRF
  */

(async function() {
	if (!IRF?.isInternetRoadtrip) return;

	// Get map methods and various objects
	const container = await IRF.vdom.container;
	const optionsBody = await IRF.dom.options;
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	class Autopilot {
		async setup() {
			container.state.changeStop = new Proxy(container.methods.changeStop, {
				apply: async (target, thisArg, args) => {
					const returnValue = Reflect.apply(target, thisArg, args);
					this.navigate(args[5]);
					return returnValue;
				}
			});
		};
		async navigate(options) {
			if (settings.autopilot_enabled && options.length > 1) {
				await sleep(settings.voting_delay * 1000);
				let option = optionsBody.querySelector(".pathfinder-chosen-option");
				if (option && !container.data.voted) {
					setTimeout(async () => this.vote(option), 1000);
				}
			}
		}
		async vote(option) {
			option.click();
		}
	}
	//
	// Settings
	const settings = {
		"autopilot_enabled": true,
		"voting_delay": 3.0,
	};
	const storedSettings = await GM.getValues(Object.keys(settings));
	Object.assign(settings, storedSettings);
	await GM.setValues(settings);

	// settings panel
	let gm_info = GM.info;
	gm_info.script.name = "Autopilot";
	const irf_settings = IRF.ui.panel.createTabFor(gm_info, { tabName: "Autopilot" });
	const info_el = document.createElement("p");
	info_el.innerText = "After you set a Pathfinder destination, Autopilot will vote for each turn along the path.";
	irf_settings.container.appendChild(info_el);
	add_checkbox("Enable Autopilot", "autopilot_enabled");
 	add_slider("Voting delay (seconds)", "voting_delay", undefined, [0.5, 5.5, 0.1]);

	function add_checkbox(name, identifier, callback=undefined, settings_container=irf_settings.container) {
		let label = document.createElement("label");

		let checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = settings[identifier];
		checkbox.className = IRF.ui.panel.styles.toggle;
		label.appendChild(checkbox);

		let text = document.createElement("span");
		text.innerText = " " + name;
		label.appendChild(text);

		checkbox.addEventListener("change", () => {
			settings[identifier] = checkbox.checked;
			GM.setValues(settings);
			if (callback) callback(checkbox.checked);
		});

		settings_container.appendChild(label);
		settings_container.appendChild(document.createElement("br"));
		settings_container.appendChild(document.createElement("br"));

		return checkbox;
	}

 	function add_slider(name, identifier, callback=undefined, slider_bits=[0, 100, 1]) {
		let label = document.createElement("label");

		let text = document.createElement("span");
		text.innerText = " " + name + ": ";
		label.appendChild(text);

		let value_label = document.createElement("span");
		value_label.innerText = settings[identifier];
		label.appendChild(value_label);

		let slider = document.createElement("input");
		slider.type = "range";
		slider.min = slider_bits[0];
		slider.max = slider_bits[1];
		slider.step = slider_bits[2];
		slider.value = settings[identifier];
		slider.className = IRF.ui.panel.styles.slider;
		label.appendChild(slider);

		slider.oninput = () => {
			settings[identifier] = slider.value;
			value_label.innerText = slider.value;
			GM.setValues(settings);
			if (callback) callback(slider.value);
		}
		slider.onmousedown = (e) => {e.stopPropagation()}

		irf_settings.container.appendChild(label);
		irf_settings.container.appendChild(document.createElement("br"));
		irf_settings.container.appendChild(document.createElement("br"));
	}

	const autopilotInstance = new Autopilot();
	await autopilotInstance.setup();
})();
