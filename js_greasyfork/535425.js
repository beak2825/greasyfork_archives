// ==UserScript==
// @name         Full Ignore bitcointalk users
// @version      0.1
// @description  Ignore quotes from users you already ignore on the forum
// @author       TryNinja
// @match        https://bitcointalk.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcointalk.org
// @grant GM_setValue
// @grant GM_getValue

// @namespace https://greasyfork.org/users/1070272
// @downloadURL https://update.greasyfork.org/scripts/535425/Full%20Ignore%20bitcointalk%20users.user.js
// @updateURL https://update.greasyfork.org/scripts/535425/Full%20Ignore%20bitcointalk%20users.meta.js
// ==/UserScript==

(async function () {
	'use strict';

	let list;

	const isLogged = document.querySelector('#hellomember') !== null;
	if (!isLogged) return;

	const getCachedList = () => {
		const cached = GM_getValue('ignoreListCache');
		if (cached) {
			const parsed = JSON.parse(cached);
			const cacheDate = new Date(parsed.date);
			const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

			if (cacheDate > oneHourAgo) {
				return parsed;
			}
		}
		return null;
	};

	const setCachedList = (list) => {
		return GM_setValue('ignoreListCache', JSON.stringify({ list, date: new Date().toISOString() }));
	};

	const fetchIgnoreList = async () => {
		const res = await fetch('https://bitcointalk.org/index.php?action=profile;sa=ignprefs');
		const html = await res.text();
		const parser = new DOMParser();
		const page = parser.parseFromString(html, 'text/html');
		const ignoreListTextArea = page.querySelector('#ign_ignore_list');
		const ignoreListUsers = ignoreListTextArea?.textContent?.split('\n');
		return ignoreListUsers;
	};

	const cached = getCachedList();
	if (cached) {
		list = cached.list;
	} else {
    console.log('No cached ignore list, fetching now...')
		list = await fetchIgnoreList();
		setCachedList(list);    
	}

	console.log('ignore list', { list });

  const quoteHeaders = document.querySelectorAll('.post .quoteheader')

  for (const quoteHeader of quoteHeaders) {
    const quoteBody = quoteHeader.nextElementSibling
    const authorMatch = quoteHeader.getHTML().match(/Quote from: (.*) on/)
    if (authorMatch && authorMatch[1]) {
      if (list.includes(authorMatch[1]) && quoteBody) {
        quoteBody.innerHTML = 'USER IS IGNORED'
      }
    }
  }
})();
