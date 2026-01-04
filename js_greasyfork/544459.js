// ==UserScript==
// @name               ACT.Perplexity.DM.Stop-Auto-Reload(Refresh)
// @name:zh-CN         ACT.Perplexity.DM.停止自动刷新
// @description        Prevent unexpected annoying automatic reloads (refreshes) and updates (Updated to latest version) from occurring.
// @description:zh-CN  防止意外的恼人的自动重新加载（刷新）和更新（更新到最新版本）发生。
// @author             ACTCD
// @version            20250803.1
// @license            GPL-3.0-or-later
// @namespace          ACTCD/Userscripts
// @supportURL         https://github.com/ACTCD/Userscripts#contact
// @homepageURL        https://github.com/ACTCD/Userscripts
// @match              https://www.perplexity.ai/*
// @grant              none
// @inject-into        page
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/544459/ACTPerplexityDMStop-Auto-Reload%28Refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544459/ACTPerplexityDMStop-Auto-Reload%28Refresh%29.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const _fetch = window.fetch;
	window.fetch = async function (input, init) {
		/** @type {URL} */
		let url;
		if (typeof input === "string") {
			url = new URL(input, location.href);
		}
		if (input instanceof Request) {
			url = new URL(input.url, location.href);
		}
		if (input instanceof URL) {
			url = input;
		}
		if (url.pathname === "/api/version") {
			const version = window.__PPL_CONFIG__.version;
			if (version) {
				return new Response(`{"version":"${version}"}`);
			} else {
				return Promise.reject();
			}
		}
		return _fetch(input, init);
	};
})();
