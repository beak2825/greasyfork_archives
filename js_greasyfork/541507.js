// ==UserScript==
// @name         Tipsport Golf displayName Fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fetch GraphQL and remove invalid rows without names.
// @author       MK
// @match        https://tipsport.apps.imgarena.com/golf/6.x/full/?eventId=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgarena.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/541507/Tipsport%20Golf%20displayName%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/541507/Tipsport%20Golf%20displayName%20Fix.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const interceptURL = "btec-http.services.imgarena.com";
	const interceptKey = "LeaderboardGetGolfTournamentLeaderboard";
	const DELAY_MS = 3000;

	const activateInterceptor = () => {
		if (window.fetch.toString().includes("IMGArenaIntercept")) {
			console.log("⚠️ Interceptor už aktivní");
			return;
		}

		const originalFetch = window.fetch;

		const interceptedFetch = async function (...args) {
			const [url, options] = args;

			const isTarget =
				typeof url === "string" &&
				url.includes(interceptURL) &&
				options?.method === "POST" &&
				options?.body?.includes(interceptKey);

			const response = await originalFetch.apply(this, args);

			if (!isTarget) return response;

			try {
				const cloned = response.clone();
				const json = await cloned.json();

				const standings = json?.data?.getGolfTournamentLeaderboard?.standingsFeed?.standings;
				if (Array.isArray(standings)) {
					const before = standings.length;
					const filtered = standings.filter(t => t.players?.[0]?.displayName);

					json.data.getGolfTournamentLeaderboard.standingsFeed.standings = filtered;

					console.log(`🧹 Upraveno: odstraněno ${before - filtered.length} týmů bez displayName`);

					return new Response(JSON.stringify(json), {
						status: response.status,
						statusText: response.statusText,
						headers: response.headers
					});
				}
			} catch (err) {
				console.warn("⚠️ Chyba při zpracování interceptu:", err);
			}

			return response;
		};

		// Nepřepisovatelná verze
		Object.defineProperty(window, "fetch", {
			configurable: false,
			enumerable: true,
			writable: false,
			value: interceptedFetch
		});

		console.log("✅ Interceptor fetch() IMGArena aktivní");
	};

	// Aktivace až po úplném načtení
	window.addEventListener("load", () => {
		console.log(`⏳ Počkám ${DELAY_MS} ms před aktivací interceptu...`);
		setTimeout(activateInterceptor, DELAY_MS);
	});
})();
