// ==UserScript==
// @name         Filmweb 1337x
// @version      0.1.1
// @namespace    eitho
// @description  Skrypt dodaje do Filmweba linki do szybkiego pobierania filmu/serialu z 1337x
// @author       Eitho
// @match        https://www.filmweb.pl/serial/*
// @match        https://www.filmweb.pl/film/*
// @icon         https://fwcdn.pl/front/ogfx/icons2/fw-favicons.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447323/Filmweb%201337x.user.js
// @updateURL https://update.greasyfork.org/scripts/447323/Filmweb%201337x.meta.js
// ==/UserScript==

(function() {
    'use strict';

	/*
		Autor: Eitho
		Data: 2022-07-02
		W planach było dodanie kilku innych serwisów oprócz 1337x i zmiana wyglądu przycisków.
		Skrypt obecnie nie jest już rozwijany - Filmweb działa tak powoli, że nie ma sensu przez niego się przeklikiwać.
		Planuję zrobić prostą stronę korzystającą z API TV Time, do której użytkownik by się logował swoim kontem - posiadałaby interfejs podobny do tego z aplikacji TV Time na Androida (webowy jest taki sobie) z automatycznym wyszukiwaniem odcinków na popularnych stronach z torrentami, a może też z streamingami.

		Jeśli chcesz się ze mną skontaktować:
			Discord: Eitho#9637
			GitHub: https://github.com/Eithoo
	*/

	const page = document.querySelector('.page__content');

	function getType() {
		const div = page.querySelector('.filmCoverSection__type');
		const type = div.innerText.trim().toLowerCase(); // serial, film, gra
		return type;
	}

	function isValidType() {
		const type = getType();
		return type === 'serial' || type === 'film';
	}

	function isTvShow() {
		return getType() === 'serial';
	}

	function getName() {
		const originalTitle = page.querySelector('.filmCoverSection__originalTitle');
		const translatedTitle = page.querySelector('.filmCoverSection__title');
		const title = originalTitle || translatedTitle;
		return title.innerText.trim();
	}

	function getNewestEpisodes() {
		const newestEpisodes = page.querySelector('div[data-section=newestEpisodes]');
		const isHidden = page.querySelector('div.filmCoverSection__year').innerText.trim().includes('-');
		const episodesDOM = [...newestEpisodes.querySelectorAll('div.episodePreview')];
		if (!episodesDOM || episodesDOM.length == 0) return false;
		const episodes = episodesDOM.map(episode => {
			const num = episode.querySelector('.episodePreview__subTitle').innerText.trim();
			const dateText = episode.querySelector('.episodePreview__date').innerText.trim();
			let ret = { num: num, dom: episode, premiere: dateText };
			if (dateText?.includes('.')) {
				const dateSplit = dateText.split('.');
				const day = parseInt(dateSplit[0]);
				const month = parseInt(dateSplit[1]);
				const year = parseInt(dateSplit[2]);
				const date = new Date(year, month - 1, day);
				if (date > new Date()) ret.beforePremiere = true;
			} else {
				ret.beforePremiere =  true;
			}
			return ret;
		});
		return {episodes: episodes, isHidden: isHidden};
	}

	function searchLink(name, num) {
		let query = num ? `${name} ${num}` : name;
		return `https://1337x.to/search/${encodeURIComponent(query)}/1/`;
	}

	function createButton_newestEpisodes(name, num) {
		const link = searchLink(name, num);
		const button = document.createElement('a');
		button.href = link;
		button.style.display = 'flex';
		button.style.alignItems = 'center';
		button.style.gap = '0.5em';
		button.target = '_blank';
		const text = document.createElement('span');
		text.innerText = 'Sprawdź dostępność na: ';
		const img = document.createElement('img');
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/1337X_logo.svg/320px-1337X_logo.svg.png';
		img.style.maxHeight = '2.5em';
		button.append(text);
		button.append(img);
		return button;
	}

	function createButton_desc(name, num) {
		const link = searchLink(name, num);
		const button = document.createElement('a');
		button.href = link;
		button.style.display = 'flex';
		button.style.alignItems = 'center';
		button.style.gap = '0.5em';
		button.target = '_blank';
		button.style.marginTop = '1em';
		const text = document.createElement('span');
		text.innerText = num ? 'Sprawdź dostępność ostatniego odcinka' : 'Sprawdź dostępność';
		if (num) {
			const text2 = document.createElement('p');
			text2.innerText = `(${num})`;
			text.style.textAlign = 'center';
			text.append(text2);
		}
		const img = document.createElement('img');
		img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/1337X_logo.svg/320px-1337X_logo.svg.png';
		img.style.maxHeight = '2.5em';
		button.append(img);
		button.append(text);
		return button;
	}

	function waitForElem(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}
	
			const observer = new MutationObserver(mutations => {
				if (document.querySelector(selector)) {
					resolve(document.querySelector(selector));
					observer.disconnect();
				}
			});
	
			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}


	async function main() {
		console.log('%c❰❰ Filmweb - 1337x uruchomiony ❱❱', 'background-color: #ccc; color: white; text-shadow: 2px 2px 4px #000000; font-size: 4em; text-align: center;');
		if (!isValidType()) return;
		const name = getName();
		console.log(name);
		if (isTvShow()) {
			const newestEpisodes = getNewestEpisodes();
			if (!newestEpisodes) return;
			console.log(newestEpisodes);
			const place = page.querySelector('div.filmPosterSection__serialSeasons'); // pod opisem serialu i sezonami
			const newestAiredEpisode = newestEpisodes.episodes.find(episode => !episode.beforePremiere);
			const elem = createButton_desc(name, newestAiredEpisode.num);
			place.append(elem);

			// pozniej wywalic to do osobnej funkcji i zrobic zeby obserwowalo zmiany i dodawalo to jeszcze raz bo filmweb przy zmianie zakładki w serialach nie ukrywa elementow tylko je całkowicie usuwa a pozniej od nowa dodaje
			if (!newestEpisodes.isHidden) {
				await waitForElem('.navList__text[data-value="Najnowsze odcinki"]');
				await new Promise(r => setTimeout(r, 50)); // filmweb jest powalony
				for (const episode of newestEpisodes.episodes) {
					if (episode.beforePremiere) continue;
					const newDOM = page.querySelector(`.page__navContent .episodePreview[data-id="${episode.dom.getAttribute('data-id')}"]`);
					const date = newDOM.querySelector('.episodePreview__date');
					const elem = createButton_newestEpisodes(name, episode.num);
					date.after(elem);
				}
			} 
			
		} else {
			const place = page.querySelector('div.filmPosterSection__plot'); // pod opisem filmu
			const year = page.querySelector('div.filmCoverSection__year').innerText.trim();
			const elem = createButton_desc(`${name} ${year}`);
			place.append(elem);
		}
	}
	main();
})();