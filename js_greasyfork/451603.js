// ==UserScript==
// @name           Filmweb.pl - Check on IMDb, RottenTomatoes and more
// @name:pl        Filmweb.pl - Zobacz na IMDb, RottenTomatoes i innych
// @description    Adds buttons to imdb.com, rottentomatoes.com, metacritic.com, upflix.pl, boxofficemojo.com
// @description:pl Dodaje przyciski do imdb.com, rottentomatoes.com, metacritic.com, upflix.pl, boxofficemojo.com
// @version        1.0.1
// @author         Pabli
// @namespace      https://greasyfork.org/users/124677-pabli
// @homepageURL    https://greasyfork.org/scripts/451603-filmweb-pl-check-on-imdb-rottentomatoes-and-more
// @supportURL     https://greasyfork.org/scripts/451603-filmweb-pl-check-on-imdb-rottentomatoes-and-more/feedback
// @license        MIT
// @icon           https://icons.duckduckgo.com/ip3/www.filmweb.pl.ico

// @match          https://www.filmweb.pl/serial/*
// @match          https://www.filmweb.pl/film/*
// @match          https://www.filmweb.pl/tvshow/*

// @match          https://www.imdb.com/*
// @match          https://www.rottentomatoes.com/*
// @match          https://www.metacritic.com/*
// @match          https://www.boxofficemojo.com/*
// @match          https://upflix.pl/*

// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @grant          GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/451603/Filmwebpl%20-%20Check%20on%20IMDb%2C%20RottenTomatoes%20and%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/451603/Filmwebpl%20-%20Check%20on%20IMDb%2C%20RottenTomatoes%20and%20more.meta.js
// ==/UserScript==

(async () => {
'use strict';

let settings = {
	clickFirstSearchResult: {
		value: await GM_getValue('clickFirstSearchResult', true),
		label: 'Automatycznie kliknij pierwszy wynik wyszukiwania',
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

const hostName = window.location.hostname;
const urlParams = new URLSearchParams(window.location.search);

const param = 'cfsr';

if (hostName === 'www.filmweb.pl') {

	let title = document.querySelector('.filmCoverSection__originalTitle')?.firstChild?.textContent || document.querySelector('.filmCoverSection__title')?.textContent;
	if (!title) return;

	title = encodeURIComponent(title);
	const year = document.querySelector('.filmCoverSection__year').innerText;

	const section = document.querySelector('.filmCoverSection__filmPreview');
	let linkDiv = document.createElement("div");
	linkDiv.setAttribute("id", "zobaczna");

	const path = window.location.pathname.split('/');

	const movieTv = path[1] === 'film' ? 'movie' : 'tv';
	const imdbMovieTv = path[1] === 'film' ? 'ft&ref_=fn_mov' : 'tv&ref_=fn_tv';
	const mcMovieTv = path[1] === 'film' ? '2' : '1';
	const upflixMovieTv = path[1] === 'film' ? 'film' : 'serial';

	function link(search, website, name) {
		let button = `<a href="${search}" title="Zobacz na ${website}" target="_blank"><img src="https://icons.duckduckgo.com/ip3/${website}.ico" width="16"><span>${name}</span></a>`;
		linkDiv.innerHTML += button;
	}

	link(`https://www.imdb.com/find?q=${title} ${year}&s=tt&ttype=${imdbMovieTv}&${param}`, 'imdb.com', 'IMDb');
	link(`https://www.rottentomatoes.com/search/?search=${title}&${param}=${movieTv}`, 'rottentomatoes.com', 'Rotten Tomatoes');
	link(`https://www.metacritic.com/search/${title}/?page=1&category=${mcMovieTv}&${param}`, 'metacritic.com', 'metacritic');
	link(`https://upflix.pl/${upflixMovieTv}/${title}?${param}`, 'upflix.pl', 'upflix');
	if (path[1] === 'film') link(`https://www.boxofficemojo.com/search/?q=${title} ${year}&${param}`, 'boxofficemojo.com', 'BoxOfficeMojo');

	GM_addStyle(`
		#zobaczna {
			max-width: 705px;
		}
		#zobaczna a {
			display: inline-flex;
			align-items: center;
			margin-top: 5px;
			margin-right: 5px;
			color: #ccc;
			border-radius: 0.125rem;
			border: 1px solid var(--main-border-color, rgba(172, 172, 172, .3));
			transition: border-color .3s cubic-bezier(.25,.46,.45,.94);
			padding: 5px 10px;
		}
		#zobaczna a:hover {
			border-color: #888;
		}
		#zobaczna img {
			width: 16px;
			margin-right: 5px;
		}
		.filmCoverSection__ratings {
			height: auto !important;
		}
	`);

	section.appendChild(linkDiv);
}

if (settings.clickFirstSearchResult.value && hostName !== 'www.filmweb.pl') {
	if (urlParams.has(param)) {

		const movieTv = urlParams.get(param) === 'movie' ? 'movie' : 'tvSeries';

		urlParams.delete(param);
		history.replaceState(null, '', '?' + urlParams);

		switch (hostName) {
			case 'www.imdb.com':
				document.querySelector('section .ipc-title-link-wrapper').click();
				break;
			case 'www.rottentomatoes.com':
				document.querySelector(`[type="${movieTv}"] search-page-media-row:nth-child(1) a`).click();
				break;
			case 'www.metacritic.com':
				setTimeout(() => {
					document.querySelector('.c-pageSiteSearch-results a').click();
				}, 500);
				break;
			case 'upflix.pl':
				setTimeout(() => {
					document.querySelector('.MuiContainer-root div[class*="_video_"] h3 > a').click();
				}, 2000);
				break;
			case 'www.boxofficemojo.com':
				document.querySelector('.a-size-medium.a-link-normal.a-text-bold').click();
				break;
		}
	}

	// Make it possible to go back to the search results
	document.addEventListener('mouseup', (e) => {
		if (e.button === 3) { // Mouse backward button
			history.back();
		}
	});
	document.addEventListener('keydown', (e) => {
		if ((e.altKey && e.code === 'ArrowLeft')) {
			history.back();
		}
	});
}

})();