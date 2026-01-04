// ==UserScript==
// @name         𝐹𝒶𝓃𝒸𝓎 𝓇𝒶𝒾𝓃𝒷𝑜𝓌
// @namespace    http://tampermonkey.net/
// @version      2025-07-18-v2
// @description  Fancy rainbow MWI chat extravaganza
// @license      MIT
// @author       sentientmilk
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542915/%F0%9D%90%B9%F0%9D%92%B6%F0%9D%93%83%F0%9D%92%B8%F0%9D%93%8E%20%F0%9D%93%87%F0%9D%92%B6%F0%9D%92%BE%F0%9D%93%83%F0%9D%92%B7%F0%9D%91%9C%F0%9D%93%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/542915/%F0%9D%90%B9%F0%9D%92%B6%F0%9D%93%83%F0%9D%92%B8%F0%9D%93%8E%20%F0%9D%93%87%F0%9D%92%B6%F0%9D%92%BE%F0%9D%93%83%F0%9D%92%B7%F0%9D%91%9C%F0%9D%93%8C.meta.js
// ==/UserScript==

(function() {
	const style = `<style>
		.CharacterName_characterName__2FqyZ .CharacterName_name__1amXp.CharacterName_rainbow__1GTos {
			-webkit-text-fill-color: transparent;

			-background: white repeating-linear-gradient(90deg,
				#14ffe9,
				#ffc800,
				#ff00e0,
				#14ffe9,
				#ffc800,
				#ff00e0,
				#14ffe9
			);

			background: repeating-linear-gradient(90deg,
				var(--color-coral-500),
				var(--color-orange-300) 12.5%,
				var(--color-jade-500) 25%,
				var(--color-ocean-400) 37.3%,
				var(--color-space-400) 43.5%,
				var(--color-burble-300),
				var(--color-coral-500),
				var(--color-orange-300) 62.5%,
				var(--color-jade-500) 75%,
				var(--color-ocean-400) 87.5%,
				var(--color-space-400) 93.5%,
				var(--color-burble-300),
				var(--color-coral-500)
			);

			background-clip: text !important;
			background-size: 200% 100%;
			animation: move 5s linear infinite;
		}

		@keyframes move{
			0% { background-position-x: 100%; }
			100% { background-position-x: -100%; }
		}
	</style>`;

	document.body.insertAdjacentHTML("beforeend", style)
})();

