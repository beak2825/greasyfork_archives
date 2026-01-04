// ==UserScript==
// @name           Filmweb.pl - Disables auto-reload and ads
// @name:pl        Filmweb.pl - Brak Automatycznego odświeżania i reklam
// @description    Adds ?audit=true to the URL to remove ads and prevent the page from auto-reload
// @description:pl Dodaje ?audit=true do url, który zapobiega auto odświeżaniu strony i usuwa reklamy
// @version        1.0.0
// @author         Pabli
// @namespace      https://greasyfork.org/users/124677-pabli
// @license        MIT
// @match          https://www.filmweb.pl/*
// @match          https://www.google.com/search*
// @match          https://duckduckgo.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=filmweb.pl
// @run-at         document-start
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/493166/Filmwebpl%20-%20Brak%20Automatycznego%20od%C5%9Bwie%C5%BCania%20i%20reklam.user.js
// @updateURL https://update.greasyfork.org/scripts/493166/Filmwebpl%20-%20Brak%20Automatycznego%20od%C5%9Bwie%C5%BCania%20i%20reklam.meta.js
// ==/UserScript==
(async () => {
'use strict';

let settings = {
	cleanUrl: {
		value: await GM_getValue('cleanUrl', false),
		label: 'Usuń ?audit=true z URL po załadowaniu strony',
	}
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
				updateMenu();
			}
		);
	});
}
updateMenu();

Object.defineProperty(document, 'hidden', { value: false, writable: false });
Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: false });

const url = new URL(window.location.href);

if (window.location.hostname === 'www.filmweb.pl') {
	if (!url.searchParams.has('audit')) {
		document.addEventListener('DOMContentLoaded', () => {
			url.searchParams.append('audit', 'true');
			window.location.href = url;
		});
	} else if (settings.cleanUrl.value) {
		setTimeout(() => {
			url.searchParams.delete('audit')
			window.history.replaceState({}, '', url);
		}, 3000);
	}
}

function auditParam(e) {
	const link = e.target;
	if (link.tagName === 'A' && link.hostname === 'www.filmweb.pl') {
		if (!link.dataset.audit) {
			const url = new URL(link.href);
			url.searchParams.append('audit', 'true');
			link.href = url.toString();
			link.dataset.audit = true;
		}
	}
}
document.addEventListener('mouseover', auditParam);
document.addEventListener('focusin', auditParam);

})();