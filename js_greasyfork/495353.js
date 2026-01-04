// ==UserScript==
// @name Steam Hunters Assistant
// @description General-purpose userscript for Steam Hunters.
// @version 1.3.3
// @author Rudey
// @homepage https://github.com/RudeySH/steam-hunters-assistant#readme
// @supportURL https://github.com/RudeySH/steam-hunters-assistant/issues
// @match https://steamhunters.com/*
// @match https://store.steampowered.com/*
// @connect steamhunters.com
// @connect store.steampowered.com
// @grant GM.getValue
// @grant GM.setValue
// @grant GM.xmlHttpRequest
// @icon https://steamhunters.com/content/img/steam_hunters.svg
// @license AGPL-3.0-or-later
// @namespace https://github.com/RudeySH/steam-hunters-assistant
// @downloadURL https://update.greasyfork.org/scripts/495353/Steam%20Hunters%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/495353/Steam%20Hunters%20Assistant.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/classes/HttpService.ts
class HttpService {
    ensureSuccessStatusCode(response) {
        if (response.status >= 200 && response.status < 300) {
            return;
        }
        throw `Response status code does not indicate success: ${response.status} (${response.statusText}).`;
    }
    async getJSON(url, details) {
        const response = await this.xmlHttpRequest({
            method: 'GET',
            overrideMimeType: 'application/json',
            url,
            ...details,
        });
        this.ensureSuccessStatusCode(response);
        return JSON.parse(response.responseText);
    }
    async postJSON(url, data) {
        const response = await this.xmlHttpRequest({
            method: 'POST',
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(data),
        });
        return response;
    }
    async xmlHttpRequest(details) {
        console.debug(`${details.method} ${details.url}`);
        const response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                onabort: reject,
                onerror: reject,
                ontimeout: reject,
                onload: resolve,
                ...details,
            });
        });
        console.info(`${details.method} ${details.url} ${response.status}`);
        return response;
    }
}

;// CONCATENATED MODULE: ./src/index.ts

const versionKey = 'v1_2_3';
const httpService = new HttpService();
ensureDOMContentLoaded().then(() => {
    const steamId = getSteamId();
    if (steamId === undefined) {
        console.log('Steam ID not found. Are you signed in?');
        return;
    }
    runIfLastRunWasOverAnHourAgo(async () => {
        const userData = await getUserData();
        await submitOwnedAppIds(steamId, userData);
        await submitIgnoredAppIds(steamId, userData);
    });
    if (location.host === 'store.steampowered.com') {
        const hiddenButton = document.querySelector('#ignoreBtn [style="display: none;"]');
        if (hiddenButton !== null) {
            const observer = new MutationObserver(async () => {
                const userData = await getUserData();
                submitIgnoredAppIds(steamId, userData);
            });
            observer.observe(hiddenButton, { attributeFilter: ['style'] });
        }
    }
});
function ensureDOMContentLoaded() {
    return new Promise(resolve => {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            resolve();
            return;
        }
        document.addEventListener('readystatechange', function listener() {
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                document.removeEventListener('readystatechange', listener);
                resolve();
            }
        });
    });
}
function getSteamId() {
    switch (location.host) {
        case 'steamhunters.com':
            return unsafeWindow.app?.identity?.steamId;
        case 'store.steampowered.com':
            if (unsafeWindow.g_AccountID === undefined) {
                return undefined;
            }
            return (76561197960265728n + BigInt(unsafeWindow.g_AccountID)).toString();
        default:
            return undefined;
    }
}
async function runIfLastRunWasOverAnHourAgo(run) {
    const key = `lastRunDate_${versionKey}`;
    const lastRunDateString = await GM.getValue(key, '');
    if (lastRunDateString) {
        const lastRunDate = new Date(lastRunDateString);
        if (new Date().getTime() - lastRunDate.getTime() < 3600000) {
            return;
        }
    }
    await run();
    await GM.setValue(key, new Date().toISOString());
}
async function getUserData() {
    const userData = await httpService.getJSON('https://store.steampowered.com/dynamicstore/userdata/', {
        headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
        },
    });
    if (!userData?.rgOwnedApps?.length) {
        throw 'Unable to retrieve userdata. Are you signed in on store.steampowered.com?';
    }
    return userData;
}
async function submitOwnedAppIds(steamId, userData) {
    const response = await httpService.postJSON(`https://steamhunters.com/api/steam-users/${steamId}/update/owned`, userData.rgOwnedApps);
    httpService.ensureSuccessStatusCode(response);
}
async function submitIgnoredAppIds(steamId, userData) {
    const ignoredAppIds = Object.keys(userData.rgIgnoredApps).map(x => parseInt(x));
    const response = await httpService.postJSON(`https://steamhunters.com/api/steam-users/${steamId}/update/ignored`, ignoredAppIds);
    httpService.ensureSuccessStatusCode(response);
}

/******/ })()
;