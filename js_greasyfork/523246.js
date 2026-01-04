// ==UserScript==
// @name         Open YT videos in a new tab
// @description  Opens YouTube video links in a new tab in the background
// @namespace    https://greasyfork.org/users/124677-pabli
// @author       Pabli
// @version      1.0.2
// @license      MIT
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://youtube.com/*
// @match        *://youtu.be/*
// @run-at       document-start
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgODg3LjkgNjEyLjMiPjxwYXRoIGZpbGw9IiNmMDMiIGQ9Ik00NDMuNSA2MTIuM3MyNzguMiAwIDM0Ny4xLTE4LjRhMTEwLjggMTEwLjggMCAwIDAgNzguMy03Ny41YzE5LTY4IDE5LTIxMSAxOS0yMTFzMC0xNDIuMS0xOS0yMDkuNGExMDkgMTA5IDAgMCAwLTc4LjMtNzcuNUM3MjEuNiAwIDQ0My41IDAgNDQzLjUgMFMxNjYgMCA5Ny4zIDE4LjdhMTExLjggMTExLjggMCAwIDAtNzkgNzcuNEMwIDE2My41IDAgMzA1LjYgMCAzMDUuNnMwIDE0Mi45IDE4LjMgMjEwLjljMTAuOSAzNyA0MC43IDY3LjEgNzguOSA3Ny41IDY4LjcgMTguNCAzNDYuMiAxOC40IDM0Ni4yIDE4LjRaIi8+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iOTIuNiIgZD0iTTI2OSAzMDYuMmgzNTBtLTE3NSAxNzV2LTM1MCIvPjwvc3ZnPg==
// @grant        GM_info
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/523246/Open%20YT%20videos%20in%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/523246/Open%20YT%20videos%20in%20a%20new%20tab.meta.js
// ==/UserScript==

(async () => {
'use strict';

let settings = {
	loadInBackground: {
		value: await GM_getValue('loadInBackground', true),
		label: 'Open a new tab in the background',
	},
	subscriptionsPageOnly: {
		value: await GM_getValue('subscriptionsPageOnly', false),
		label: 'Subscriptions page only',
	},
};
let menuCommands = {};
async function updateMenu() {
	Object.keys(menuCommands).forEach(key => GM_unregisterMenuCommand(menuCommands[key]));
	Object.entries(settings).forEach(([key, config]) => {
		menuCommands[key] = GM_registerMenuCommand(
			`${config.value ? '☑' : '☐'} ${config.label}`,
			async () => {
				settings[key].value = !settings[key].value;
				await GM_setValue(key, settings[key].value);
				GM_notification(`${config.value ? 'Enabled' : 'Disabled'} - ${config.label}`, GM_info.script.name, GM_info.script.icon);
				updateMenu();
			}
		);
	});
}
updateMenu();

window.addEventListener('click', (e) => {
	if (settings.subscriptionsPageOnly.value === true && window.location.pathname !== '/feed/subscriptions') return;

	if (e.button > 0 || e.altKey || e.metaKey) return;

	const link = e.target.closest('[href^="/watch"], [href^="/shorts"]');
	if (!link) return;

	if (new URL(window.location.href).searchParams.get('v') === new URL(link.href).searchParams.get('v')) return;

	e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();

	GM_openInTab(link.href, settings.loadInBackground.value);
}, true);

})();