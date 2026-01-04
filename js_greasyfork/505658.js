// ==UserScript==
// @name           Scribble Hub: Display Series Word Count on Series Page
// @namespace      https://github.com/w4tchdoge
// @version        1.0.0-20240829_004816
// @description    Displays the word count of the current series next to the chapter count
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://www.scribblehub.com/series/*
// @run-at         document-start
// @license        AGPL-3.0-or-later
// @history        1.0.0 — Initial commit
// @downloadURL https://update.greasyfork.org/scripts/505658/Scribble%20Hub%3A%20Display%20Series%20Word%20Count%20on%20Series%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/505658/Scribble%20Hub%3A%20Display%20Series%20Word%20Count%20on%20Series%20Page.meta.js
// ==/UserScript==

(async function () {
	`use strict`;

	// from https://stackoverflow.com/a/61511955/11750206
	function waitForElm(selector, search_root = document) {
		return new Promise(resolve => {
			if (search_root.querySelector(selector)) {
				return resolve(search_root.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (search_root.querySelector(selector)) {
					observer.disconnect();
					resolve(search_root.querySelector(selector));
				}
			});

			// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		});
	}

	const current_page = new URL(window.location);
	const wordcount_xpath = `.//div[contains(concat(" ",normalize-space(@class)," ")," wi_novel_details ")]//table/tbody/tr/th[contains(translate(normalize-space(), 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'),translate("Word Count", 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]/following-sibling::*[1]/self::td`;

	const word_count = await (async () => {
		if (current_page.pathname.includes(`/stats`) == false) {

			// const statsPG_fetch_url = new URL((`${current_page.href.replace(/\/$/i, ``)}/stats`));
			const statsPG_fetch_url = `./stats`;
			const statsPG_resp_txt = await (async () => {
				const fetch_resp = await fetch(statsPG_fetch_url);
				const resp_text = await fetch_resp.text();
				return resp_text;
			})();

			const html_parser = new DOMParser();
			const statsPG_html = html_parser.parseFromString(statsPG_resp_txt, `text/html`);
			const wordcount_str = document.evaluate(wordcount_xpath, statsPG_html, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim();
			return wordcount_str;

		}
		else {

			const stats_table_elmParent = await waitForElm(`.fic_row:has(.wi_novel_details)`);

			const wordcount_str = document.evaluate(wordcount_xpath, stats_table_elmParent, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent.trim();
			return wordcount_str;

		}
	})();

	const chap_elm = document.querySelector(`div.fic_stats > span.st_item:has(> i.fa-list-alt)`);
	const word_count_elm = (() => {

		// const svg_elm = Object.assign(document.createElementNS(`http://www.w3.org/2000/svg`, `svg`), {
		// 	innerHTML: `<path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"></path>`
		// });
		// svg_elm.setAttribute(`viewBox`, `0 0 384 512`);
		// svg_elm.setAttribute(`style`, `width: 1em; height: 1em; vertical-align: -0.125em;`);
		// const svg_elm = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width: 1em; height: 1em; vertical-align: -0.125em;"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentColor" d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L64 0zM96 64l192 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L96 160c-17.7 0-32-14.3-32-32l0-32c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"></path></svg>`;
		const svg_elm = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 1em; height: 1em; vertical-align: -0.125em;"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="currentColor" d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>`;

		const wc_element = chap_elm.cloneNode(true);
		// wc_element.replaceChild(calc_svg, wc_element.querySelector(`*:has(~ span.mb_stat)`));
		wc_element.innerHTML = `${svg_elm} ${word_count} <span class="mb_stat">Words</span>`;

		return wc_element;

	})();

	chap_elm.after(word_count_elm);

})();
