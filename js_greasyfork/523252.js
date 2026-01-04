// ==UserScript==
// @name           Wikipedia skins
// @name:pl        Wikipedia skins
// @description    Restore the old Wikipedia look or choose between other available skins: Vector 2022, Vector legacy 2010, MinervaNeue, MonoBook, Timeless, Modern, Cologne Blue
// @description:pl Przywróć stary wygląd Wikipedii lub wybierz spośród innych dostępnych skórek: Vector 2022, Vector legacy 2010, MinervaNeue, MonoBook, Timeless, Modern, Cologne Blue
// @version        1.3.2
// @author         Pabli
// @homepageURL    https://greasyfork.org/scripts/523252-wikipedia-skins
// @supportURL     https://greasyfork.org/scripts/523252-wikipedia-skins/feedback
// @namespace      https://github.com/pabli24
// @license        MIT
// @match          *://*.wikipedia.org/*
// @match          *://*.wiktionary.org/*
// @match          *://*.wikiquote.org/*
// @match          *://*.wikinews.org/*
// @match          *://*.wikidata.org/*
// @match          *://*.wikivoyage.org/*
// @match          *://*.wikiversity.org/*
// @match          *://*.wikifunctions.org/*
// @match          *://*.wikisource.org/*
// @match          *://*.wikibooks.org/*
// @match          *://*.wikimedia.org/*
// @match          *://*.mediawiki.org/*
// @match          *://www.google.com/search*
// @match          *://duckduckgo.com/*
// @run-at         document-start
// @icon           data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDk3LjggOTcuOCI+PHJlY3Qgd2lkdGg9Ijk3LjgiIGhlaWdodD0iOTcuOCIgZmlsbD0iI2ZmZiIgcng9IjQ4LjkiIHRyYW5zZm9ybT0ibWF0cml4KC45IDAgMCAuOSA0LjkgNC45KSIvPjxwYXRoIGQ9Ik00OC45IDBhNDguOSA0OC45IDAgMSAwIDAgOTcuOCA0OC45IDQ4LjkgMCAwIDAgMC05Ny44em0yOC44IDM3LjUtMTcgMzkuMWgtMS41bC04LjktMjFjLTMuNSA3LTcuNSAxNC4xLTEwLjggMjFoLTEuN2MtNS0xMi0xMC40LTIzLjktMTUuNi0zNS45LTEuMi0yLjktNS40LTcuNi04LjItNy42di0xLjVoMTcuNlYzM2MtMiAuMS01LjYgMS40LTQuNyAzLjcgMi41IDUuNCAxMS4zIDI2LjIgMTMuNyAzMS41bDguMi0xNS42Yy0xLjUtMy02LjQtMTQuNS04LTE3LjQtMS0yLTMuOS0yLjEtNi0yLjJ2LTEuNWgxNS41VjMzYy0yIDAtNCAuOC0zLjIgMi44IDIuMSA0LjQgMy4zIDcuNCA1LjMgMTEuNWw1LjItMTFjMS0yLjMtLjQtMy4yLTQuMi0zLjN2LTEuNUg2N1YzM2MtMi41IDAtNSAxLjQtNi40IDMuNEw1NCA1MGw3LjYgMTdMNzUgMzYuMmMtMS0yLjUtNC0zLTUuMi0zLjF2LTEuNWgxNHYxLjVjLTMgMC01IDEuNy02LjEgNC40eiIvPjwvc3ZnPg==
// @grant          GM_info
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/523252/Wikipedia%20skins.user.js
// @updateURL https://update.greasyfork.org/scripts/523252/Wikipedia%20skins.meta.js
// ==/UserScript==
(async () => {
'use strict';

// https://en.wikipedia.org/wiki/Wikipedia:Skin
const skin = await GM_getValue('skin', 'vector');
if (window.location.hostname !== 'www.google.com' && window.location.hostname !== 'duckduckgo.com') {
	const skins = {
		'vector-2022': 'Vector 2022 (default on desktop from 2022)',
		vector: 'Vector legacy 2010 (default on desktop from 2010 to 2021)',
		minerva: 'MinervaNeue (mobile)',
		monobook: 'MonoBook (default from 2004 to 2009)',
		timeless: 'Timeless',
		modern: 'Modern (created in 2008 and deprecated in 2021)',
		cologneblue: 'Cologne Blue (created in 2002 and deprecated in 2019)'
	};
	const options = {
		nostalgia: {
			value: await GM_getValue('nostalgia', true),
			label: 'Nostalgia on the nostalgia.wikipedia.org (original skin from 2001)',
		},
		cleanUrl: {
			value: await GM_getValue('cleanUrl', true),
			label: 'Clean URL (remove ?useskin=skinname from the URL)',
		},
	};

	Object.entries(skins).forEach(([key, label]) => {
		GM_registerMenuCommand(
			`${skin === key ? '◉' : '○'} ${label}`,
			async () => {
				await GM_setValue('skin', key);

				const url = new URL(window.location.href);
				url.searchParams.append('useskin', key);
				window.location.href = url;
			}
		);
	});
	Object.entries(options).forEach(([key, config]) => {
		GM_registerMenuCommand(
			`${config.value ? '☑' : '☐'} ${config.label}`,
			async () => {
				options[key].value = !options[key].value;
				await GM_setValue(key, options[key].value);

				deleteUseskinParam()
				window.location.reload();
			}
		);
	});

	if (options.nostalgia.value && window.location.hostname === 'nostalgia.wikipedia.org') return;

	function deleteUseskinParam() {
		const url = new URL(window.location.href);
		if (!url.searchParams.has('useskin')) return;

		url.searchParams.delete('useskin');
		window.history.replaceState({}, '', url);
	}

	const url = new URL(window.location.href);
	if (!url.searchParams.has('useskin') && url.pathname !== '/') {
		url.searchParams.append('useskin', skin);
		window.location.href = url;

	} else if (options.cleanUrl.value) {
		deleteUseskinParam();
		let lastUrl = window.location.href;

		const interval = setInterval(() => {
			if (window.location.href === lastUrl) return;

			deleteUseskinParam();
			lastUrl = window.location.href;
		}, 200);

		setTimeout(() => clearInterval(interval), 3000);
	}
}

const matches = GM_info.script.matches.slice(0, -2); // Remove google, ddg
const userMatches = GM_info.script?.options?.override?.use_matches || []; // Tampermonkey only
const allMatches = [...matches, ...userMatches];
const domains = allMatches.map(url => url.replace(/^.+\:\/\/\*?\.?([^\/]+)\/.*$/, '$1'));

function linkUseskin(e) {
	let link = e.target.closest('a[href]:not([href^="#"])');
	if (!link || link.dataset.useskin || 
	    !domains.some(domain => link.hostname.endsWith(`.${domain}`) || link.hostname === domain)) return;

	const url = new URL(link.href);
	if (url.searchParams.has('useskin')) {
		url.searchParams.delete('useskin');
	}
	url.searchParams.append('useskin', skin);
	link.href = url.toString();
	link.dataset.useskin = true;
}
document.addEventListener('mouseover', linkUseskin);
document.addEventListener('focusin', linkUseskin);

})();