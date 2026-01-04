// ==UserScript==
// @name         gamedev latex support
// @namespace    e6y
// @description  latex.codecogs.com, chart.apis.google
// @version      0.7
// @include      /^https?://(www.)?gamedev\.ru\/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403178/gamedev%20latex%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/403178/gamedev%20latex%20support.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
	process([
		filter_google,
		filter_codecogs,
	]).catch(console.log.bind(console));

	async function process(filters) {
		for (let fn of filters) {
			for (let {node, tex} of fn()) {
				await load_katex_once();
				let container = document.createElement('span');
				tex = tex.trim().replace(/^\\\[/, '').replace(/\\]$/, '');
				try {
					container.innerHTML = katex.renderToString(tex, {throwOnError: true});
					container.title = tex;
					node.replaceWith(container);
				} catch (e) {
					console.log(e.message);
				}
			}
		}
	}

	async function load_katex_once() {
		if (!load_katex_once.loaded) {
			await load_katex();
			load_katex_once.loaded = true;
		}
	}

	async function load_katex() {
		let css = document.createElement('link');
		css.rel = 'stylesheet';
		css.href = 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css';
		document.head.appendChild(css);

		return new Promise((resolve, reject) => {
			let script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js';
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	function* filter_codecogs() {
		for (let img of [...document.querySelectorAll('img[src^="https://latex.codecogs.com"]')]) {
			let tex = decodeURIComponent(img.src)
				.replace(/^https:\/\/latex\.codecogs\.com\/[^.]+?\.latex\?/, '')
				.replace('\\bg_white', '')
				.replace(/\\inline/g, '')
			;
			yield {node: img, tex: tex};
		}
	}

	function* filter_google() {
		for (let img of [...document.querySelectorAll('img[src^="https://chart.apis.google.com/chart?"]')]) {
			let chl = (new URL(img.src)).searchParams.get('chl');
			if (chl) {
				let tex = decodeURIComponent(chl);
				yield {node: img, tex: tex};
			}
		}
	}
})();
