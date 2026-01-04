// ==UserScript==
// @name        Link MyAnimeList to AniList
// @namespace   https://greasyfork.org/en/users/1195345-necodes
// @author      NECOdes
// @description Adds Anilist anime/manga link to their MyAnimeList page
// @version     0.0.2
// @match		https://myanimelist.net/anime/*
// @match       https://myanimelist.net/manga/*
// @grant		GM_xmlhttpRequest
// @connect		graphql.anilist.co
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543794/Link%20MyAnimeList%20to%20AniList.user.js
// @updateURL https://update.greasyfork.org/scripts/543794/Link%20MyAnimeList%20to%20AniList.meta.js
// ==/UserScript==

'use strict';

(async function() {
	const match = window.location.pathname.match(/\/(anime|manga)\/(\d+)/);
	if (!match) return;

	const type = match[1] === 'anime' ? 'ANIME' : 'MANGA';
	const malId = parseInt(match[2], 10);

	const anilistLogo = 'https://raw.githubusercontent.com/NECOtype/userscripts/8b9a59a9ebdf048838f2a5a9fffeb9228569e46d/assets/anilist-icon.png';

	const query = `
		query ($malId: Int, $type: MediaType) {
			Media(idMal: $malId, type: $type) {
				siteUrl
			}
		}
	`;
	const variables = { malId, type };

	// GM_xmlhttpRequest Promise to use with async/await
	const gmFetch = (options) => {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				...options,
				onload: (response) => {
					if (response.status >= 200 && response.status < 3000) {
						resolve(response);
					} else {
						reject(new Error(`Request failed with status ${response.status}: ${response.statusText}`));
					}
				},
				onerror: (error) => reject(error),
				ontimeout: () => reject(new Error('Request timed out.')),
			});
		});
	};

	try {
		const response = await gmFetch({
			method: 'POST',
			url: 'https://graphql.anilist.co',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			data: JSON.stringify({ query, variables }),
		})

		const json = JSON.parse(response.responseText);
		const anilistUrl = json?.data?.Media?.siteUrl;
		if (!anilistUrl) {
			console.warn('Anilist URL not found for this entry.')
			return;
		};

		const isDarkMode = document.documentElement.classList.contains('dark-mode');

		// Creates and appends the Anilist link to the external_links container
		const createAnilistLink = (container) => {
			// prevents duplicate links
			if (container.querySelector('.anilist-button')) {
				return true;
			}
			const secondChild = container.children[1];

			const newButton = document.createElement('a');
			newButton.href = anilistUrl;
			newButton.target = '_blank';
			newButton.classList.add('link', 'ga-click', 'anilist-button');
			newButton.style.backgroundColor = isDarkMode ? '#1e2630' : '#fefefe';
			newButton.style.color = isDarkMode ? '#fefefe' : '#1e2630';
			newButton.style.borderRadius = '4px';
			newButton.style.display = 'flex';
			newButton.style.justifyContent = 'center';
			newButton.style.fontFamily = 'inherit';
			newButton.style.fontSize = 'inherit';
			newButton.style.padding = '6px 0';
			newButton.style.marginBlock = '4px 0';
			newButton.style.textDecoration = 'none';
			newButton.style.textAlign = 'center';
			newButton.style.width = '100%';

			const newImg = document.createElement('img');
			newImg.src = anilistLogo;
			newImg.classList.add('link_icon');
			newImg.alt = 'anilist icon';
			newImg.style.width = '16px';
			newImg.style.paddingInline = '3px';

			const newDiv = document.createElement('div');
			newDiv.textContent = 'View on Anilist';
			newDiv.classList.add('caption');

			newButton.appendChild(newImg);
			newButton.appendChild(newDiv);

			container.insertBefore(newButton, secondChild)
			return true;
		}

		const observer = new MutationObserver((mutations, obs) => {
			const container = document.querySelector('.leftside');

			if (container) {
				if (createAnilistLink(container)) {
					obs.disconnect();
				}
			}
		})

		observer.observe(document.body, { childList: true, subtree: true });
	} catch (err) {
		console.error('Anilist API request failed: ', err);
	}
})();