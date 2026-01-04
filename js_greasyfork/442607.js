// ==UserScript==
// @name         KOTD Place Overlay
// @namespace    https://greastfork.org
// @version      1.64
// @description  Shows an overlay for KOTD. Might not be perfect due to Hamis changes.
// @author       r/PlaceTux
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/442607/KOTD%20Place%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/442607/KOTD%20Place%20Overlay.meta.js
// ==/UserScript==
const w = 2000;
const h = 2000;
const img = "https://images2.imgbox.com/91/af/OggCQ5Pu_o.png";
if (window.top !== window.self) {
	window.addEventListener(
		"load",
		() => {
			document
				.getElementsByTagName("mona-lisa-embed")[0]
				.shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0]
				.shadowRoot.children[0].appendChild(
					(function () {
						const i = document.createElement("img");
						i.style = `width: ${w}px;height: ${h};position: absolute;left: 0;top: 0;image-rendering: pixelated;`;
						i.src = img;
						return i;
					})()
				);
		},
		false
	);
}
