// ==UserScript==
// @name           NVIDIA: Driver Download Direct Link
// @namespace      https://github.com/w4tchdoge
// @version        1.0.0-20240807_185503
// @description    Add a Direct Download link to nvidia.com/Download/driverResults.aspx/* pages
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://www.nvidia.com/Download/driverResults.aspx/*
// @match          *://nvidia.com/Download/driverResults.aspx/*
// @license        AGPL-3.0-or-later
// @history        1.0.0 — Initial commit
// @downloadURL https://update.greasyfork.org/scripts/502873/NVIDIA%3A%20Driver%20Download%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/502873/NVIDIA%3A%20Driver%20Download%20Direct%20Link.meta.js
// ==/UserScript==

(async function () {
	`use strict`;

	// Get the original DL button
	const DL_pg_btn = document.querySelector(`td:has(> a#lnkDwnldBtn)`);

	// Make the download page link
	const DL_pg_link = new URL(DL_pg_btn.querySelector(`#lnkDwnldBtn`).getAttribute(`href`), window.location.origin);

	// Fetch DL Page
	const DL_pg_resp_text = await (async () => {
		const fetch_resp = await fetch(DL_pg_link);
		const resp_text = await fetch_resp.text();
		return resp_text;
	})();
	// console.log(DL_pg_resp_text);

	// Parse the DL page for the Direct Download Link
	const html_parser = new DOMParser();
	const DL_pg_HTML = html_parser.parseFromString(DL_pg_resp_text, `text/html`);
	const DDL_link = DL_pg_HTML.querySelector(`a[href*="download.nvidia.com"]`).href;

	// Create DDL element
	const DDL_elem = (() => {
		let output_elm = Object.assign(document.createElement(`td`), {
			innerHTML: (() => {
				const element = Object.assign(document.createElement(`a`), {
					href: `${DDL_link}`,
					id: `drctLnkDwnldBtn`,
					innerHTML: `<btn_drvr_lnk_txt class="btn_drvr_lnk_txt">Direct Download</btn_drvr_lnk_txt>`
				});
				return element.outerHTML;
			})()
		});

		// Modified from https://stackoverflow.com/a/54579530/11750206
		const orig_elm_attrs = DL_pg_btn.getAttributeNames()
			.reduce((obj, name) => ({
				...obj,
				[name]: DL_pg_btn.getAttribute(name)
			}), {});

		// Assign the aforementioned attributes to the new DDL element
		Object.entries(orig_elm_attrs).forEach(([key, value]) => {
			output_elm.setAttribute(key, value);
		});

		return output_elm;
	})();

	// Add DDL element after original DL element
	DL_pg_btn.after(DDL_elem);
})();
