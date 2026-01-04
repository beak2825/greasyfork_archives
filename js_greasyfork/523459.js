// ==UserScript==
// @name         BTN Series link parser
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Replaces series ID and torrent ID links with their names in forum posts.
// @author       darisk
// @match        https://broadcasthe.net/forums.php*
// @icon         https://broadcasthe.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523459/BTN%20Series%20link%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/523459/BTN%20Series%20link%20parser.meta.js
// ==/UserScript==

const CACHE_EXPIRY_TIME = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

const loadCache = (cacheName) => {
    const cachedData = localStorage.getItem(cacheName);
    return cachedData ? JSON.parse(cachedData) : {};
};

const saveCache = (cacheName, cache) => {
    localStorage.setItem(cacheName, JSON.stringify(cache));
};

const seriesNameCache = loadCache('seriesNameCache');
const torrentNameCache = loadCache('torrentNameCache');

const fetchSeriesName = async (seriesId) => {
    if (seriesNameCache[seriesId] && Date.now() - seriesNameCache[seriesId].timestamp <= CACHE_EXPIRY_TIME) {
        return seriesNameCache[seriesId].name;
    }

    try {
        const url = `https://broadcasthe.net/series.php?id=${seriesId}`;
        const response = await fetch(url);
        if (!response.ok) return "Error fetching name";

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const title = doc.querySelector("title");
        const seriesName = title ? title.textContent.split(" :: ")[0] : `Unknown (${seriesId})`;

        seriesNameCache[seriesId] = { name: seriesName, timestamp: Date.now() };
        saveCache('seriesNameCache', seriesNameCache);
        return seriesName;
    } catch (error) {
        console.error('Error fetching series name:', error);
        return "Error fetching name";
    }
};

const fetchTorrentName = async (torrentId) => {
    if (torrentNameCache[torrentId] && Date.now() - torrentNameCache[torrentId].timestamp <= CACHE_EXPIRY_TIME) {
        return torrentNameCache[torrentId].name;
    }

    try {
        const url = `https://broadcasthe.net/torrents.php?id=${torrentId}`;
        const response = await fetch(url);
        if (!response.ok) return "Error fetching name";

        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const title = doc.querySelector("title");
        const torrentName = title ? title.textContent.split(" :: ")[0] : `Unknown (${torrentId})`;

        torrentNameCache[torrentId] = { name: torrentName, timestamp: Date.now() };
        saveCache('torrentNameCache', torrentNameCache);
        return torrentName;
    } catch (error) {
        console.error('Error fetching torrent name:', error);
        return "Error fetching name";
    }
};

const replaceLinks = async () => {
    const links = document.querySelectorAll('td.body a');

    for (const link of links) {
        if (link.querySelector('img')) continue;

        const seriesMatch = link.href.match(/series\.php\?id=(\d+)/);
        const torrentMatch = link.href.match(/torrents\.php\?id=(\d+)/);

        if (seriesMatch) {
            const seriesId = seriesMatch[1];
            const seriesName = await fetchSeriesName(seriesId);
            link.textContent = seriesName;
        } else if (torrentMatch) {
            const torrentId = torrentMatch[1];
            const torrentName = await fetchTorrentName(torrentId);
            link.textContent = torrentName;
        }
    }
};

window.onload = () => {
    replaceLinks();
};
