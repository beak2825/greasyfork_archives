// ==UserScript==
// @name Romeo Additions User Locator
// @name:de Romeo Additions Benutzerortung
// @namespace https://greasyfork.org/en/users/723211-ray/
// @version 9.3.1
// @description Adds a user locator to the Romeo Additions
// @description:de Fügt eine Benutzerortung zu den Romeo Additions hinzu
// @author -Ray-
// @match *://*.romeo.com/*
// @license MIT
// @grant none
// @iconURL https://www.romeo.com/assets/favicons/711cd1957a9d865b45974099a6fc413e3bd323fa5fc48d9a964854ad55754ca1/favicon.ico
// @supportURL https://greasyfork.org/en/scripts/521150
// @downloadURL https://update.greasyfork.org/scripts/521150/Romeo%20Additions%20User%20Locator.user.js
// @updateURL https://update.greasyfork.org/scripts/521150/Romeo%20Additions%20User%20Locator.meta.js
// ==/UserScript==

const selTileDiscover = `section.js-content main > section > ul > li > a[href^="/profile/"]`; // li
const selTileRadarSmall = `div.js-search-results div.tile > div.reactView > a[href^="/profile/"]`; // div.tile (query first)
const selTileRadarLarge = `div.js-search-results div.tile--plus > div.reactView > a[href^="/profile/"]`; // div.search-results__item
const selTileRadarImage = `div.js-search-results div.tile > div.reactView > div.SMALL`; // div.tile
const selTileVisitors = `main#visitors a[href^="/profile/"]`; // li
const selTileVisited = `main#visited-grid a[href^="/profile/"]`; // li
const selTileLikes = `main#likers-list a[href^="/profile/"]`; // li
const selTileFriends = `section.js-profile-stats li > a[href^="/profile/"]`; // li
const selTileFriendsList = `main#friends-list li > a[href^="/profile/"]`; // li
const selTilePicLikes = `main#liked-by-list a[href^="/profile/"]`; // li
const selTileSearch = `div.js-results a[href^="/profile/"]`; // div.tile
const selTileActivity = `div.js-as-content div.tile a[href^="/profile/"]`; // div.listitem

let userLat = 0;
let userLon = 0;

function ext()
{
	str.strings["locateUser"] =
	{
		de: "Benutzer orten",
		en: "Locate user",
	};

	menu.on(selTileDiscover, a =>
	{
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on(selTileRadarLarge, a =>
	{
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on(selTileRadarSmall, a =>
	{
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on([selTileVisitors, selTileVisited].join(","), a =>
	{
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on([selTileFriends, selTileFriendsList].join(","), a =>
	{
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on([selTileLikes, selTilePicLikes].join(","), a =>
	{
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on(selTileSearch, a =>
	{
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on(selTileActivity, a =>
	{
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on(".js-chat .reactView", el =>
	{
		const a = el.querySelector(`a[href^="/profile/"]`);
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	menu.on(".js-contacts .reactView", el =>
	{
		const a = el.querySelector(`a[href^="/profile/"]`);
		const username = romeo.getUsernameFromHref(a.href);
		return createTileMenu(username);
	});

	net.on("xhr:load", "GET /api/v4/session", e =>
	{
		if (e.body.data?.profile_location)
		{
			userLat = e.body.data.profile_location.lat;
			userLon = e.body.data.profile_location.long;
		}
	});
}

function createTileMenu(username)
{
	return [
		menu.item("location-pin", "locateUser", async () =>
		{
			const [lat, lon] = await locateUser(username, [romeo.userLat, romeo.userLon]);
			open(`https://www.google.com/maps/search/?api=1&query=${lat}%2C${lon}`, "_blank");
		})
	];
}

async function locateUser(username, initLatlon)
{
	async function getDistances(latlons)
	{
		return await Promise.all(latlons.map(async latlon =>
		{
			const response = JSON.parse(await romeo.sendXhr("GET /api/v4/profiles", {
				filter:
				{
					fulltext: "@" + username,
					fulltext_search_mode: "EXACT",
					location: { lat: latlon[0], long: latlon[1] },
				},
				pick: "items.*.location.distance",
			}));
			return response.items[0].location.distance;
		}));
	}

	// Start by querying initial distance to user.
	let [e, n, zn, zl] = utm.fromLatlon(...initLatlon);
	let m = (await getDistances([initLatlon]))[0];
	romeo.log(`inited location for ${username} at ${initLatlon[0]}, ${initLatlon[1]} with ${m}m distance`);

	// Repeat stepping to closest NESW location until maximum granularity is reached.
	while (m > 50)
	{
		const d = Math.min(2000 * 1000, m);
		const latlons = [
			utm.toLatlon(e, n - d, zn, zl),
			utm.toLatlon(e + d, n, zn, zl),
			utm.toLatlon(e, n + d, zn, zl),
			utm.toLatlon(e - d, n, zn, zl),
		];
		const ms = await getDistances(latlons);

		let min = 0;
		for (let i = 1; i < 4; ++i)
			if (ms[i] < ms[min])
				min = i;
		[e, n, zn, zl] = utm.fromLatlon(...latlons[min]);
		m = m === ms[min] ? ms[min] / 2 + 1 : ms[min]; // fix stuck at 100m

		romeo.log(`stepped to ${latlons[min][0]}, ${latlons[min][1]} with ${m}m distance`);
	}

	return utm.toLatlon(e, n, zn, zl);
}

(window.romeoExts ??= []).push(ext);
if (window.romeo)
	ext();
