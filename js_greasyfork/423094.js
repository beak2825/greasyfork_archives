// ==UserScript==
// @name         HealthValue & FastRainbow Theme Diep.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow you to have all 4 teams disco colors and to see your health's hp value! PS: You need to put the healthvalue code in console f12 in diep for make it work.
// @author       Its Ash ;3 , for contact me ,on discord my DM are open. Ashley_#2063
// @match          http*://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423094/HealthValue%20%20FastRainbow%20Theme%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/423094/HealthValue%20%20FastRainbow%20Theme%20Diepio.meta.js
// ==/UserScript==

(() => {
	const script = document.createElement("script");
	script.src = "https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.3.7/chroma.min.js";
	document.head.append(script);

	script.addEventListener("load", () => {
		const scale = chroma.scale(["green", "forestgreen", "seagreen", "lime", "palegreen", "yellowgreen", "green"]).colors(1000);
		let index = 85;


	setInterval(() => {
			index += 100;
			if (index > scale.length) {
				index = 0;
			}

			input.execute(`net_replace_color 6 ${"0x" + scale[index].substr(1, Infinity)}`);
		});
	});
})();


(() => {
	const script = document.createElement("script");
	script.src = "https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.3.7/chroma.min.js";
	document.head.append(script);

	script.addEventListener("load", () => {
		const scale = chroma.scale(["purple", "darkviolet", "fuchsia", "mediumpurple", "rebeccapurple", "deeppink", "purple"]).colors(1000);
		let index = 85;


	setInterval(() => {
			index += 100;
			if (index > scale.length) {
				index = 0;
			}

			input.execute(`net_replace_color 5 ${"0x" + scale[index].substr(1, Infinity)}`);
		});
	});
})();


(() => {
	const script = document.createElement("script");
	script.src = "https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.3.7/chroma.min.js";
	document.head.append(script);

	script.addEventListener("load", () => {
		const scale = chroma.scale(["blue", "aqua", "steelblue", "navy", "cyan", "indigo", "blue"]).colors(1000);
		let index = 85;


	setInterval(() => {
			index += 100;
			if (index > scale.length) {
				index = 0;
			}

			input.execute(`net_replace_color 3 ${"0x" + scale[index].substr(1, Infinity)}`);
		});
	});
})();


(() => {
	const script = document.createElement("script");
	script.src = "https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.3.7/chroma.min.js";
	document.head.append(script);

	script.addEventListener("load", () => {
		const scale = chroma.scale(["red", "orange", "crimson", "firebrick", "tomato", "orangered", "red"]).colors(1000);
		let index = 85;


	setInterval(() => {
			index += 100;
			if (index > scale.length) {
				index = 0;
			}

		    input.execute(`net_replace_color 4 ${"0x" + scale[index].substr(1, Infinity)}`);
		});
	});
})();

input.set_convar("ren_raw_health_values", true)
