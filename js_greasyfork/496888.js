// ==UserScript==
/* Adicione uma url para cada instância do seu Radarr*/
const RADARR_URLS = [
    'http://localhost:7878',
    'http://192.168.18.111:7879',
    'https://example.org',
];
/* Adicione uma url para cada instância do seu Sonarr*/
const SONARR_URLS = [
    'http://localhost:8989',
    'http://192.168.18.111:8990',
    'https://example.org',
];
/* Adicione uma linha de @include para cada instância do seu Radarr/Sonarr */
// @include      http://localhost:7878/*
// @include      http://localhost:8989/*
// @include      http://192.168.18.111:7879/*
// @include      http://192.168.18.111:8990/*
// @include      https://example.org/*
// @name         Rrequest
// @author       a1Th
// @namespace    https://github.com/a1Thiago
// @description  Preenchimento automático para pedidos
// @version      0.06
// @icon         https://www.a1th.dev/favicon.ico
// @grant        none
// @license      MIT
// @match        https://capybarabr.com/requests/create
// @match        https://locadora.cc/requests/create
// @match        https://bj-share.info/requests.php?action=new
// @match        https://cliente.amigos-share.club/pedidos.php?action=pedir
// @match        https://beyond-hd.me/request/add
// @match        https://blutopia.cc/requests/create
// @match        https://broadcasthe.net/requests.php?action=new
// @match        https://cinemaz.to/request/torrent
// @match        https://filelist.io/viewrequests.php?add_request=1
// @match        https://greatposterwall.com/requests.php?action=new
// @match        https://hd-torrents.org/requests_new.php
// @match        https://hdbits.org/requests/add_request
// @match        https://passthepopcorn.me/requests.php?action=new
// @match        https://privatehd.to/request/torrent
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496888/Rrequest.user.js
// @updateURL https://update.greasyfork.org/scripts/496888/Rrequest.meta.js
// ==/UserScript==
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    if (isRadarrUrl() || isSonarrUrl()) {
        renderRrequestDiv();
    }
    window.addEventListener('message', receiveData);
})();
function sendData(requestUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(isRadarrUrl || isSonarrUrl))
            return;
        triggerLinkHoverActions();
        let dataToPass = {};
        if (isRadarrUrl()) {
            dataToPass = extractDataFromRadarr();
        }
        if (isSonarrUrl()) {
            dataToPass = yield extractDataFromSonarr();
        }
        const newWindow = window.open(requestUrl, '_blank');
        // Send the data after a short delay to ensure the new window is fully loaded
        if (newWindow) {
            setTimeout(() => {
                newWindow.postMessage(dataToPass, requestUrl);
            }, 2000);
        }
    });
}
function receiveData(event) {
    const isRadarrEventOrigin = RADARR_URLS.some((radarrUrl) => radarrUrl === event.origin);
    const isSonarrEventOrigin = SONARR_URLS.some((sonarrUrl) => sonarrUrl === event.origin);
    const receivedData = event.data;
    if (!receivedData)
        return;
    if (isRadarrUrl() || isSonarrUrl())
        return;
    if (isRadarrEventOrigin || isSonarrEventOrigin) {
        console.log('Data received from rrequest:', receivedData);
        if (document.URL.includes('capybara')) {
            cbrFillOutForm(receivedData, event);
        }
        if (document.URL.includes('locadora')) {
            lcdFillOutForm(receivedData, event);
        }
        if (document.URL.includes('bj-share')) {
            bjFillOutForm(receivedData, event);
        }
        if (document.URL.includes('amigos-share')) {
            ascFillOutForm(receivedData, event);
        }
        ////////////
        if (document.URL.includes('beyond-hd')) {
            bhdFillOutForm(receivedData, event);
        }
        if (document.URL.includes('blutopia')) {
            bluFillOutForm(receivedData, event);
        }
        if (document.URL.includes('broadcasthe')) {
            btnFillOutForm(receivedData, event);
        }
        if (document.URL.includes('cinemaz')) {
            czFillOutForm(receivedData, event);
        }
        if (document.URL.includes('filelist')) {
            flFillOutForm(receivedData, event);
        }
        if (document.URL.includes('greatposterwall')) {
            gpwFillOutForm(receivedData);
        }
        if (document.URL.includes('hd-torrents')) {
            hdtFillOutForm(receivedData);
        }
        if (document.URL.includes('hdbits')) {
            hdbFillOutForm(receivedData, event);
        }
        if (document.URL.includes('passthepopcorn')) {
            ptpFillOutForm(receivedData);
        }
        if (document.URL.includes('privatehd')) {
            phdFillOutForm(receivedData, event);
        }
    }
}

function tmdb2mal(tmdbId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!tmdbId)
            return '0';
        const request = yield fetch(`https://www.a1th.dev/a1descr/api/tmdb2mal/${tmdbId}`);
        const response = yield request.json();
        if (!response || !response.data || response.data.length === 0) {
            return '0';
        }
        const malId = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0].mal_id;
        return malId;
    });
}
function tvdb2tmdb(tvdbId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tvdbId)
            return '0';
        const request = yield fetch(`https://www.a1th.dev/a1descr/api/tvdb2tmdb/${tvdbId}`);
        const response = yield request.json();
        if (!response || !response.tv_results || response.tv_results.length === 0) {
            return '0';
        }
        const tmdbId = response.tv_results[0].id;
        return tmdbId;
    });
}
function toggleDisplay(element, displayValue) {
    if (element) {
        element.style.display = displayValue;
    }
}
function extractLinks(anchors) {
    const domainKeys = {
        'themoviedb.org': 'tmdbUrl',
        'imdb.com': 'imdbUrl',
        'thetvdb.com': 'tvdbUrl',
        'tvmaze.com': 'tvmazeUrl',
        'youtube.com': 'youtubeUrl'
    };
    const result = {};
    for (const anchor of anchors) {
        // Check if the anchor href matches any of the domains
        for (const [domain, key] of Object.entries(domainKeys)) {
            if (anchor.href.includes(domain)) {
                result[key] = anchor.href;
            }
        }
    }
    return result;
}
function extractIdsFromLinks(url) {
    var _a;
    if (!url)
        return;
    const linkIdRegex = /(\/|tt|id=)(\d+)(\/|\b)/;
    const id = (_a = url.match(linkIdRegex)) === null || _a === void 0 ? void 0 : _a[2];
    return id;
}
function triggerLinkHoverActions() {
    const linksTrigger = document.querySelector('svg[data-icon="up-right-from-square"]');
    const mouseOverEvent = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    const mouseOutEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    if (linksTrigger) {
        linksTrigger.dispatchEvent(mouseOverEvent);
        const radarrLinksElement = document.querySelector(RADARR_LINKS_SELECTOR);
        const sonarrLinksElement = document.querySelector(SONARR_LINKS_SELECTOR);
        toggleDisplay(radarrLinksElement, 'none');
        toggleDisplay(sonarrLinksElement, 'none');
        setTimeout(() => {
            linksTrigger.dispatchEvent(mouseOutEvent);
            toggleDisplay(radarrLinksElement, '');
            toggleDisplay(sonarrLinksElement, '');
        }, 500);
    }
}
function triggerGenresHoverActions() {
    const genresTrigger = document.querySelector('span.SeriesGenres-genres-biVzl');
    const mouseOverEvent = new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    const mouseOutEvent = new MouseEvent('mouseout', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    if (genresTrigger) {
        genresTrigger.dispatchEvent(mouseOverEvent);
        const sonarrGenresElement = document.querySelector(SONARR_GENRES_SELECTOR);
        toggleDisplay(sonarrGenresElement, 'none');
        setTimeout(() => {
            genresTrigger.dispatchEvent(mouseOutEvent);
            toggleDisplay(sonarrGenresElement, '');
        }, 500);
    }
}
function isRadarrEventOrigin(event) {
    return RADARR_URLS.some(radarrUrl => radarrUrl === event.origin);
}
function isSonarrEventOrigin(event) {
    return SONARR_URLS.some(sonarrUrl => sonarrUrl === event.origin);
}

function renderRrequestDiv() {
    const rrequestDiv = document.createElement('div');
    document.body.append(rrequestDiv);
    rrequestDiv.id = 'requestDiv';
    rrequestDiv.style.position = 'fixed';
    rrequestDiv.style.top = '25vh';
    rrequestDiv.style.zIndex = '100';
    rrequestDiv.style.display = 'grid';
    rrequestDiv.style.gridTemplateColumns = 'auto auto';
    rrequestDiv.style.background = '#202020';
    rrequestDiv.style.padding = '4px';
    rrequestDiv.style.borderRadius = '8px';
    rrequestDiv.style.fontWeight = '600';
    rrequestDiv.style.letterSpacing = '.1rem';
    rrequestDiv.style.alignItems = 'center';
    rrequestDiv.style.right = '-64px';
    rrequestDiv.style.opacity = '80%';
    rrequestDiv.innerHTML += `<span style='writing-mode: vertical-lr;'>Rrequest</span>`;
    rrequestDiv.addEventListener('mouseenter', () => {
        rrequestDiv.style.right = '8px';
        rrequestDiv.style.opacity = '100%';
    });
    // Hide the buttons when mouse leaves the div
    rrequestDiv.addEventListener('mouseleave', () => {
        rrequestDiv.style.right = '-64px';
        rrequestDiv.style.opacity = '80%';
    });
    const buttonsDiv = document.createElement('div');
    buttonsDiv.id = 'requestButtonsDiv';
    buttonsDiv.style.display = 'grid';
    buttonsDiv.style.gap = '8px';
    rrequestDiv.appendChild(buttonsDiv);
    TRACKERS().forEach(tracker => {
        const sonarrTrackers = ['BTN'];
        const radarrTrackers = ['PTP', 'GPW'];
        if (isRadarrUrl() && sonarrTrackers.some(name => name === tracker.name)) {
            return;
        }
        if (isSonarrUrl() && radarrTrackers.some(name => name === tracker.name)) {
            return;
        }
        const button = renderRrequestButton(tracker.name, tracker.icon, tracker.request);
        buttonsDiv.appendChild(button);
    });
    return rrequestDiv;
}
//
function renderRrequestButton(label, imgUrl, sendData) {
    //const rrequestLink = document.createElement('a')
    //rrequestLink.href = ''
    // rrequestLink.addEventListener('click', e => e.preventDefault())
    const rrequestButton = document.createElement('button');
    rrequestButton.addEventListener('click', sendData);
    rrequestButton.id = label;
    rrequestButton.style.display = 'flex';
    rrequestButton.style.alignItems = 'center';
    rrequestButton.style.gap = '8px';
    rrequestButton.style.justifyContent = 'space-between';
    rrequestButton.style.cursor = 'pointer';
    rrequestButton.style.fontWeight = '600';
    rrequestButton.style.borderRadius = '4px';
    rrequestButton.style.background = '#cccccc';
    rrequestButton.style.color = '#000000';
    rrequestButton.title = `Enviar dados para ${label}`;
    rrequestButton.innerHTML += `<span>${label}</span>`;
    rrequestButton.innerHTML += `<img style='width:20px;' src='${imgUrl}'>`;
    //rrequestLink.appendChild(rrequestButton)
    return rrequestButton;
}

function isSonarrUrl() {
    //TODO
    //const sonarrSeriesPage = new RegExp(`${SONARR_SOURCE_URL}/series/[\\w\\d]+`, 'i')
    //const isSonarrSeriesPage = sonarrSeriesPage.test(document.URL)
    //return isSonarrSeriesPage
    return SONARR_URLS.some(sonarrUrl => document.URL.includes(sonarrUrl));
}
const SONARR_LINKS_SELECTOR = 'div.SeriesDetailsLinks-links-cHw2_';
const SONARR_GENRES_SELECTOR = 'div.Tooltip-inverse-Tdtfn .Tooltip-body-EY7l7';
function extractDataFromSonarr() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const sonarrLinksElement = document.querySelector(SONARR_LINKS_SELECTOR);
        //TODO
        if (!sonarrLinksElement)
            return {};
        const anchorElements = Array.from(sonarrLinksElement.querySelectorAll('a'));
        const links = extractLinks(anchorElements);
        const imdbId = extractIdsFromLinks(links.imdbUrl || '');
        const tvdbId = extractIdsFromLinks(links.tvdbUrl || '');
        const tmdbId = yield tvdb2tmdb(tvdbId || '');
        triggerGenresHoverActions();
        const sonarrGenresElement = document.querySelector(SONARR_GENRES_SELECTOR);
        const malId = sonarrGenresElement && ((_b = (_a = sonarrGenresElement.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes('anime'))
            ? yield tmdb2mal(tmdbId)
            : '0';
        const title = (_c = document.querySelector('div.SeriesDetails-title-pJv1g')) === null || _c === void 0 ? void 0 : _c.textContent;
        const year = (_f = (_e = (_d = document.querySelector('div.SeriesDetails-details-jRNp_ > div > span:last-child')) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.match(/(\d+)-/)) === null || _f === void 0 ? void 0 : _f[1];
        return { imdbId, tmdbId, tvdbId, title, year, malId };
    });
}

function isRadarrUrl() {
    return RADARR_URLS.some(radarrUrl => document.URL.includes(radarrUrl));
}
const RADARR_LINKS_SELECTOR = 'div.MovieDetailsLinks-links-eFF77';
function extractDataFromRadarr() {
    var _a;
    const radarrLinksElement = document.querySelector(RADARR_LINKS_SELECTOR);
    if (!radarrLinksElement)
        return {};
    const anchorElements = Array.from(radarrLinksElement.querySelectorAll('a'));
    const links = extractLinks(anchorElements);
    const imdbId = extractIdsFromLinks(links.imdbUrl || '');
    const tmdbId = extractIdsFromLinks(links.tmdbUrl || '');
    const titles = getTitlesFromRadarr();
    const year = (_a = document.querySelector('span.MovieDetails-year-FZGC1')) === null || _a === void 0 ? void 0 : _a.textContent;
    return Object.assign({ imdbId, tmdbId, originalTitle: titles.originalTitle, title: titles.title, year }, (links.youtubeUrl && { youtube: links.youtubeUrl }));
}
function getTitlesFromRadarr() {
    var _a, _b;
    const regexPattern = /Original Title: .*/;
    // Select all <span> elements with a title attribute that matches the regex pattern
    const spansWithOriginalTitle = document.querySelectorAll('span[title]');
    // Filter out the elements whose title attribute doesn't match the pattern
    const matchingSpans = Array.from(spansWithOriginalTitle).filter(span => {
        return regexPattern.test(span.getAttribute('title') || '');
    });
    const titles = matchingSpans[0];
    const originalTitle = titles
        ? (_a = titles.title.match(/Original Title:\s(.+)/)) === null || _a === void 0 ? void 0 : _a[1]
        : null;
    const title = titles
        ? titles === null || titles === void 0 ? void 0 : titles.innerText
        : (_b = document.querySelector('div.MovieDetails-title-yaEzx')) === null || _b === void 0 ? void 0 : _b.textContent;
    return { originalTitle, title };
}

function TRACKERS() {
    return [
        {
            name: 'CBR',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAHUUExURQAAAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP6xAP///6lIOpEAAACadFJOUwAGEwFJbAxu1XJRhUU9QDQaA2T49c/e8Pf22pUnKOD7tm2I3dAOn/rNcZbpfUgmBy+jwde8BB5Hjop3WZf04gtLodz97disP7Neeuu/xLqcXBYdChWp/pjSFIKy0erz/PGiGaTjNiNlEoE1YrvLxuRhsRy0LU0hfq6lH8jOY8Iz1gKedqrfG4OgGFBPgDjUDb7yLjd8CU6bkmgK5bJNAAAAAWJLR0Sb79hXhAAAAAd0SU1FB+gGCAMkKyMlSL8AAAGlSURBVDjLY2AYGMDIxMzCyoZHATsHJxc3Dy8fv4AgdgVCwiKiYuISkuJS0jJYFcjKySsoKinPmiWiwo1NXlVtlrqGppb2rFk6unqY0voGhvKzoMDI2AQubmpmzsptYWllzWVjOwsB7KDS9g6OTsJgEWcXVwkkBW5gaUF3D5FZWIGIJ0iezcsbi5y4j6+ff4A9UD7QXx2bZuOgYH1mkP6Q0DCspjsJQJzHFo5dflZEJERBlAR2+VnRjBAFMdilY31YoSHgGYcqE58AphI5k2AB74emNRnkppTUNDNYGHuhKpBKlwSSNhmZWTAF2SBh4fDwnFzRvBy5WXK6+bNm2RYUGhfBFESBFBSXZJeWBfKUV1SyVlXPmlVTK19nD5WvbwDKi7n7zxJmZ8gIZGtkaEyeNaupeZYbLLW1AOVbHdo0Zs0KFYQ7SrN9lj/Mho5Zwsn8DAyporMaOiEiXfLx3eWzpGEKembJVYFo8zhbXohIibdIb+2scLgnnPvAgd4/YZYmRIRJZeKkySLJzFAFBuFTpoIZ06ZbQxMf+4witsyZjUTmMsoBALnn62TLrxigAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI0LTA2LTA4VDAzOjM2OjQzKzAwOjAwImYPQQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNC0wNi0wOFQwMzozNjo0MyswMDowMFM7t/0AAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjQtMDYtMDhUMDM6MzY6NDMrMDA6MDAELpYiAAAAAElFTkSuQmCC',
            request: () => sendData('https://capybarabr.com/requests/create'),
        },
        {
            name: 'LCD',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAaySURBVFjD7ZdrjNVXFcV/+5xz753nHUgLF2xCa4tF3tWkqR0eoVIeGYbUqjwLrRQGxKiJBJBWjWLbxKTaYgnlZcFCeUrkMcMw0yLM0BaNBJASayUKbQQ6dxhamAFm7r3/c7ZfxgYM4ExtP5i4P5+z9jpr77WzD/wvx/S6JvdofZP9bzCksxdG1zTmtUZaGlTHKPQGFDhhRWoKnPyhdmz37KdGYER1umfW608Uxqtyi0IcCEZIA60CVQkrT+8vS53rKKbp6MGR1ekuWa/PK9zhRKY6I4+JcMoKa/KtDHUiMxVGZrw+O2pPY1FHcV1HD2YCU4JSHjMy6fXyVB3A0Kp0PyPU7ytLnQROllY27A3Kt1u97gPWfWIKjK5pLPaqkxQKFb0LYGxNY1FQvdur3l9W25g3ojp9h8I9CtarThlT05j/iSmQ8foZVT4H4JXHh1alb2vOhb5eGS1K2YVsKLUiBwWOCNyp0DcbtDvw3txHWgpDoI+1HHvxlWL/sRTwSgLIN0Jl3Mh0I+xU6A4kFIoVcgnLCwfH95jnjPxAQBTyAZzjNh/pwmxGR3VIgUfrz8uH2ZAArBMy2x/sFjnhohfOW5HN9eNSxwFKKxt+K9Af8ALpgV1jLXsBgQagSWN6ce5XW3pcuaxPGcNfQ2BOxcTms6u3Jt+6Ot9HNhxb0xi74vVLUdCHgYHtr2swwr48I9WtXn8OvN8lbhZlghZmPd8EDouQDqozrZXtCeSdliisEUj37upmxJbEF3rPM2I44iy7Q6C3dcxftTl59hoCI/ekk22Rfj/AVFVKFLoAiHBa4BLQ4EQORqrfAE4AhVak5o3y1I8Bxvymse8tb8SnmYjcqbFt9xBjycBVhR9m0F2q9AIwhj3G8rYGEvG4PLF8Y/ElAHnotXOxpjb/0wBjnMhCIzTlgi5WKEpYmWvgUpvXZxSGWJHDUdDxCoVG2JkokBkDVhZErV7nh8D3gEzopgvoFbbZo/bFEJh+ldrBWtaLkFU4VVQsz/5yTXFkPsiEkV6ZY0R2v16e2ls/LvUnI6y1Qk1dWerEvrLUWSOyKyh3BlWJGZlnhGMqDC48ab/SGulSH3gSIadQZJpkYeyYXRCUh/694b1nEtACDLrcopMBpLSyYb1XphlhR4GTWbcmbPPpy9EPA9yfMDJXhCsZr4u9UiHwfsLJKE1qult9fHzymJulOUrFcCzm2OADd/uIx9pLe12Li3DeOZaHQH9rWS6llQ1/9ko/Ed5zIjVBtXtQHlQoEuGEE9mp6NmgjFMYFhOZ2H9VQTZr9bkAfY3hNWM56iO+biwHULp4z8M3cXWwllfjCVkaAk0OKBTheNzITCOcyXoWKBT9q0GdsKJuXI9Tw19tqKJVvturNjEkY3WGQom1bBThgo+YrUpXH9HDxVhplDdDYMhVSVWEcyK8aQw7raUukcfpJS8VewecMXD8wLjUIYBhVeltAZ2AkhNoFqENoP/GggvZVjRk+Q5Cm7OsVKV7FDELSLQnKvQRU53jJVVuVaWPCGeNZZk17E7kyTtLXy7OXFOSIVUNTwZlXNzI487QkPU8AjQ6w8FcYAJWk30q87dpWhaHwNdEeNc5tnjPfSEw4nrTVIS/OMeOKKICUOeYvnprsvZ69TAxI+sBzXitvhzpvki1LG7Zs78sdTY/JutSR+MtoVFeDoEJxnDYOTZGEeUh8GVuMMpV6esDg63j16p0iyKenz25ecB1CdSVpf7hRBYh5FT5oioDcoFB910+4z67Ie+ukkNujnruNYZaY/ldFDFDlYE3aTJEOGMMbwfPgPZxd+lGZD8axcN3pwdFQecHZbQILQh/L7hojty+I29wiCizlg0IUbvNbpb8Leeo9J6xIfAFY9jlYixYtTn5t5sSABhb25hojbR3UD4PFBLTE302FTT7ZtapMtA5VoVA/xB44Hr2Mob9xnLIR0xWpaexrIjH5ekVG4ubbkiYDkTFxObhUcQrQJFzrIwiylW5uqZt1rJdhPPeMw0IxvJUXp6sWLa+uO1m2B3aB1ZvTR6wlicAG0VMdI6dIpxpl/wD5/gVQBQxGzhvLbNKSuSF/5QcOrETJktky8ULerv3LPaeUdaxyXtGW0t18NwbAg+I4ffOMW/1luQfO4rbqbX8W9Naitpa9bkQqDCGaueoy+WYrko/Y9jmYixatTn5bmcwO/0xmTOlpWcuq2tDYBRCK4pYy9J4Qn62fEPxhc7idZoAwOxJzQNyOTYBPYzlR3l5snbZ+mtH7KdKAKBiUvMwlPxkiez9xeri8HFx/h//BBJRC/RST1PZAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI0LTA2LTA4VDAzOjM0OjI5KzAwOjAwRIyJtQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNC0wNi0wOFQwMzozNDoyOSswMDowMDXRMQkAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjQtMDYtMDhUMDM6MzQ6MjkrMDA6MDBixBDWAAAAAElFTkSuQmCC',
            request: () => sendData('https://locadora.cc/requests/create'),
        },
        {
            name: 'BJ',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAHvUExURQAAAKkODqUKCqQLC6oREaoJCawMDLMREa4MDLkPD7QMDK8ICK4ICLcNDboJCbYJCbUICLYICL4GBr8GBrwHB70HB8QnJ8IHB78ICL4ICL8PD8kNDcMGBsUHB8gJCcELC8IHB8MGBswzM8wKCsoFBcsKCssHB8oGBskICMoGBsoGBtENDckHB8oGBsoICMwHB9MREc8FBdQJCdAEBM4FBdAGBtAFBf9/f9UEBNUFBdsJCdcFBdYEBNYEBOMJCdcEBNcEBNUEBNYEBN0REd0KCtwEBOAGBuEHB94HB+kHB+ADA+wJCeMDA+gEBOgEBOkFBekFBegEBOcEBOcEBOgFBecFBegEBP///+oEBOoDA/QHB/AEBPACAvACAvEDA+4CAvACAu4CAvIGBvgCAvgCAv8HB/wBAf8HB/8HB/8EBP8AAP8AAP8EBP8AAMUJCcUICMkICLcICNwICNUICNYHB9kHB8oGBs0GBtwHB9YGBtAFBdMFBd4FBdQFBd8FBeEFBfQGBv0GBuMFBd0FBfIGBugFBeAEBNgEBOYFBdwEBOQFBfIEBOoEBOUEBOMEBOEEBPYEBOcEBOQEBO8DA/8EBPIDA/MDA/EDA+4DA+YDA+wDA/0EBP0DA/wDA/oCAvgCAvsCAv8CAvwCAv8BAf////Spr54AAABudFJOUwASSi0P5jssPCEp5pgnb6W+28V94Y8Ni5WSIBPxtThX4qMKS+xKrJ+coKkniaSarx3rNpm9nskEmdZOZn32HHVz5/gPS/5URUYklRyTfNbBwr+ttsXMewLP3Ea/1s7E1tnjKHtuQbojRDk5Oj8HIS4MwgAAAAFiS0dEV30K2R8AAAAHdElNRQfoBggDHQyIq3BuAAAA8UlEQVQoz2NgoANgZGLGLsHCmsfGzsGJRYYrn5unoJAXiwxfEb9AsSA204RKhEVKRRF8MXEJSSkQQ7pMRra8Qg4uIa+goKgEZilXVlWrqKqpa2hqaevoamjq6RtA1RjW1BoZV9XVN5iYNjbVNbeYmUPELVrbLK2sbdo7bO3sHRw7u5ycIeIu3W2unT29ff0T3BgY3CdO6vaAiHtOnjJ12rTpMyZP8WJg8J45a7YP1AJfP/+AwKDgkNAwBobwiDlzI1H8EhUdExsXn5A4b/6CJGTx5IVQsGhhCrJ46mI4SEMxKD0jMzMzC4izc3LpEddQAAA62UXHwSnWOAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0wNi0wOFQwMzoyOToxMSswMDowMM2clEEAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMDYtMDhUMDM6Mjk6MTErMDA6MDC8wSz9AAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI0LTA2LTA4VDAzOjI5OjEyKzAwOjAw2jwXvwAAAABJRU5ErkJggg==',
            request: () => sendData('https://bj-share.info/requests.php?action=new'),
        },
        {
            name: 'ASC',
            icon: 'data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAACMuAAAjLgAAAAAAAAAAAACyahT/oV8S/6JhFP+cWw3/klED/5VUBP+UUwT/lFME/5RTBP+VVAT/kVAB/5FQAv+hYBL/oF8S/6FgEv+yahT/oWAT/x0WDf8LCQT/lJCL/9XRzP/Fwbz/yMS//8jEv//HxL//yMXA/7u3sv9nY17/DwoF/xMQC/8cFQz/oWAS/6BfEv8UEQz/AAAA/zY2Nf/09PT///////7+/v/////////////////9/f3//////1tbWv8AAAD/FRIN/6BfEv+gXxH/FBAJ/wwLCf8FBAP/ERAO/yQjH/8hIBz/IiAc/yQiHv8XFRH/qKem//////+RkI7/AAAA/xgUDf+gXxH/oF8R/xYRCv8EBAL/JSQh/6alpP/f3t7/6urp/+jo5//o6Oj/6Ojo//n5+f//////WllX/wAAAP8XEwz/oF8R/6BfEP8XEwv/AAAA/6ampP//////ubi3/3V0cf9/fnv/fXx5/39+e/9zcm7/Pjw5/wcGA/8JCQf/FBAI/6BfEP+gXxD/FxIL/wAAAP+3t7X//////7i4tv96eXf/hIOA/4KBfv+CgX7/h4WC/yAfHf8GBAD/DAwJ/xQPCP+gXxD/oF8Q/xcSC/8AAAD/PTw6/+Tk4////////v7+/////////////f39///////IyMb/CggG/wEBAf8WEQn/oF8Q/6FgEf8QCwT/JiYk/y0rJ/8yMCz/R0VB/3Nybv9mZGD/Z2Zi/2lnY/9qaWX/d3Vy/0lHQ/8gIB7/EQwF/6FgEf+jYhP/CgUA/0VFRP/+/f3//////0tKRv+sq6r///////39/f/7+/v/8fHw/+/v7v/7+/v/RkZF/woFAP+jYhL/oF8Q/xcTDP8AAAD/goKA///////c3Nv/RUM//6empP+ioZ//urq4////////////iYmH/wAAAP8XEwv/oF8Q/6BfEf8VEAr/CgoI/wcGBP+/vr3//////62tq/8AAAD/AAAA/6inpf//////x8fG/woJB/8JCQf/FRAK/6BfEf+gXxH/FRAK/w0NC/8FAwD/LCsp/+/u7v//////a2po/2ZlY///////9vX1/zY1M/8DAQD/DQ0L/xQQCf+gXxH/oF8S/xIPCv8HCAn/Dw4M/wAAAP9kZGT///////Dw7//u7u3//////3V1df8AAAD/Dw4M/wcICf8SDwr/oF8S/6FgE/8cFQz/Eg8K/xUQCv8XEwz/BwIA/6uopP///////////7+8uP8MBwL/FhEL/xUQCv8SDwr/HBUL/6FgEv+yahT/oWAT/6BfEv+gXxH/oWAS/55cDf+kZRj/58+y/+zYwf+qbST/nFoK/6JhE/+gXxH/oF8S/6FgE/+yahT/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
            request: () => sendData('https://cliente.amigos-share.club/pedidos.php?action=pedir'),
        },
        ////////////////
        {
            name: 'BHD',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAACMVBMVEUAAAAJIO///wAAAP8IGvAWQ9wWQdsYSNgYSNkWQNgUPd4vgrlGuZU6n6w1kbMVPdwVPdsZRNEYRNUWQtkVQNkGGPGu/zQIHugZStkeV9EhXc4iYcwiYsshYMwgXM4eVdEYRtgSOeEeVtIiYcwkZskkZskiYMwdU9MRNuEVP9wgWs8jZcojZcofWdAUPt4RMt4fWs4kZskkZskQMeMeVc8kZckjZModU9IiYMsiYMwXRdkeVc8fZMcdVNAhW8qxwvNljuBTg9o/dtUgW80iX8n+/v/6+v709f7K1fgiYMsiYMoiYssiYMsiYssiX8siYMsgXMwgW8weVM8kZckdUs8XQtciYMwXQtgdU9MjZModVNEQMeIfWM0fWM0QMOEVOtQfWc0fWM4UOtkSNt4cUtEhXswkZckiYcsdVNARNt4WQNgdUs4gWswhXssiYcoiYcsiYMogXMweVs8YSNUkZ8klaMgkZ8glaMklZ8kkaMglZ8gjZ8hbidxJfNgtbM3B0PSete8kZssiZsgfZMdnkt729/7j5/xGeNkpacw6c9JMf9dnkd7N2vX//////v8ras0jZshKetrL1fjx8/36+v7+/v9GetYnaMp0muLr7/z+/v7k6vpnk9wjZslrk+Du8f3p7vxfi9w0cNDY4PnZ4vk1cdBNgdbu8vzv8f3s7/xJftYhZchgjdzr7f2vwPJVgtxTgtulufDo6/1mkN5GeNhcht4oZ8wmZstUgttHetgkZsmOuILKAAAAdHRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcbLvo9O3DcR4IXcz6+9JmCQ6N9viWEQeN/P0KXfX4aM3TIm7+dbr+/v7+wOf+/v7+6/T28/fr7L++cvtzIdEhafdjCZGMCA+RjA4IYNL6zF0IH2697Pb057prG30aCesAAAABYktHRI0bDOLVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QQKBwYCrXu2GgAAAXtJREFUGNNjYGBgYGSSkJSSlpGRlZNXYGZhAANWRSVllZJSIChTVVPXYAOJsWtqaZeWlpeXlZWXl5bq6OpxMDBw6hsYllaUl1eWlABlKkqNdI25GLhNTEFiVdU1tdUVIFEzcx4GBQuQWElZXX1DY2U5SNTSisFapbS8rLqpuaW1rd2mqbqsvFTVlsGurLyso7Oru6e3z97B0akfyHVmcCktnzBx0uQpU3t7Xd3cPaZNKC/1ZPAC6p4+Y2bvrN6pU3tnz6kA6vdm8AE5ce68+b1AsGBhE8ixvgx+QMHy6kWLQYJLllZXAQX9GQLKqqrKm5Yt752/onflqiagirJAhqDg0qry1WvWrlu/YeOmzavLq0qDQxhC1UqrSids2bqtqWn7jp0TgI4PC2fgjdABKt0FsqGsCSQWGcXHwB8dAwwQUDABAZARHBsnwMAgGJ8QCRUDBp12YpIQKECFk1NS08pAgVyikp6RKQIJelHmrOyc3Lz8gsKiYjFxoAAAdfCapAG3hnMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDQtMTBUMDc6MDY6MDIrMDA6MDCSiKOlAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA0LTEwVDA3OjA2OjAyKzAwOjAw49UbGQAAAABJRU5ErkJggg==',
            request: () => sendData('https://beyond-hd.me/request/add'),
        },
        {
            name: 'BLU',
            icon: 'data:image/png;base64,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',
            request: () => sendData('https://blutopia.cc/requests/create'),
        },
        {
            name: 'BTN',
            icon: 'data:image/png;base64,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',
            request: () => sendData('https://broadcasthe.net/requests.php?action=new'),
        },
        {
            name: 'CZ',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAQAAAD8fJRsAAAABGdBTUEAALGPC/xhBQAAAAJiS0dEAP+Hj8y/AAAAB3RJTUUH5QwGCikNXab0zAAAAL1JREFUGNNlyi1IA3EAxuFnHzoE3WSw4hBsBpOIzWTUZBaFlctL64LdImJfH1ZBZ7YLNneMQ8OF3dzcQNC/QZGh7y8+bwFbTkVKEg0ndsRScjZdSiR2DS26ta7iSMyFKws4lNnDsjtN8mpeTNGX6SOTqlJQciyzpGlD1bN9B87FzGsZGBvpmhhJReZUoK4nCD4FwYNtZ9qw6kn4bagnuC/6u7IyPvL/4N0bct8wy7HIjdcixrrWhJ/Lo45rK18qoT8Iilms5wAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0xMi0wNlQxMDo0MToxMyswMDowMGagtagAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMTItMDZUMTA6NDE6MTMrMDA6MDAX/Q0UAAAAAElFTkSuQmCC',
            request: () => sendData('https://cinemaz.to/request/torrent'),
        },
        {
            name: 'FL',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABAlBMVEUsg6Qsg6MsgqMsWWssRU8sR1IsJiYsKSosLS8sLC4rLS8rLjErLjArLTAsKSkrMjYpSVcjeZsig6oihKsje54oS1okb40nWGwsKissKCkrNDknV2ofm8sifqIlaYQkbIglZ4IoUWIhj7okbIknVWgglsQoTFstIiAoT18laoUrNTogl8UmWm8qNz4qNz0qNjwmXnQglMElaYUsKCgqOkIlaIIfmsogmMcglMIjfJ8mYXgsJycpQUwfnMwpSFUqPkclZ4EsJSQsKy0rKisqNj0oTl4sJCIrMDMnUWIgkb0hi7Ula4glaoYpP0grNDojdZUpRlMsKiosLC0igqgpRlL///+rTVq6AAAAAWJLR0RVkwS4MwAAAAd0SU1FB+UEDAMIEgwtfPAAAADJSURBVBjTbZHHFoIwFAUDAoGoqGAv2BV7r1iw9+7/f4uKiKDMIos5bzM3AGD4DxgAmIUgDRAWDOAEBQ1QBA5wEtIGIKlIRkMnEbK+QDY7o0nW4XRxHO/2eH1+TQaCoXBEiMbiiSSrk6l0JkshMZGDX5n3FYqlcqVaq39lo9lqd7q9TF8vpYF7KIijsbctTyCczt6X82p4sWRX6822vtsfJEXO/MfT+YKYq8xz3O1OqUXIhhj6+SoJahH9DlRTP/J/ELPpTEc2+44Hf1AYDR9uHSMAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDQtMTJUMDM6MDg6MTgrMDA6MDCjgoMzAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA0LTEyVDAzOjA4OjE4KzAwOjAw0t87jwAAAABJRU5ErkJggg==',
            request: () => sendData('https://filelist.io/viewrequests.php?add_request=1'),
        },
        {
            name: 'GPW',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAYCAMAAADJYP15AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABVlBMVEUAAAAvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMEvnMH////T/m9bAAAAcHRSTlMAABScbxoq5/nNlouiawwn4/36fQENv7PZH3D85e83GcnmK5OtCcbdOWzyWjjfowdURS3wQ3PcxQ8bYuGdBChjj5rWqqu2ICRMCL0y29cCprcje/v30U/+znJJX/boSPQGEsM6CpX1hBGN4FCw6p41N9CYMAAAAAFiS0dEca8HXOIAAAAHdElNRQflBg8QJipZPSzlAAABIUlEQVQoz13R11bCQBAG4AyCYkGToKImWBAsCAQLKmLsLRbsohKw9zbvf+WWILv+V3u+zJmdnSgKCfga/AGgUcRAY1OwuaW1LdQuOXSoiKhperhTdOjqJhyJYE+vxNBnIJomRvvlLgODSDMUkxmGGccTMvtGqI6O/Sse14kmJ0C+MZWmxRmrrlYsOzlF58PpGaE2N2sk0wbluXmB8wsF5FmkncFesoE1Xg5yXmGcWE2xiyG/xnndZtUbm1vbO+Tg7HJW9yhDzthXD8iheOg1PzomG3dOTs/OL+j3sMely6vrctytZAOsefXGc9R0Mmrmlg0Kd/coxHzgKwAou3V1/bU/BI9PRk2fX5y/t8LrW5Rf+h5yhA2A9fH5VdIK3z9Frr/KLlYZgS4NmAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNi0xNVQxNjozODo0MiswMDowMN+dGPkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDYtMTVUMTY6Mzg6NDIrMDA6MDCuwKBFAAAAAElFTkSuQmCC',
            request: () => sendData('https://greatposterwall.com/requests.php?action=new'),
        },
        {
            name: 'HDT',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQflBAoHLibMJfxhAAABTklEQVQoz4XSz2oTURzF8c+dyUwSqSUKitJuqq5cFxfWt/BpfCxfwa2CC3VjsUWptYUqJmlmzEzujIuk+SNIzg/u6svh3PP7BSQSrS0KEq+8UG0DSb3Wbp/Ounn6j0erWWZagpkducDSBGqlWrsC+/btm4mIolpEpuvKD5N1cOBYgSBq5DJRqWvP3RUYpGpXDlz76UBuz67SNx/RE7Q3YKvS9cxXlUMDDxUmHrsUzVYgqVyw44GhXbkzb5ReemRsuvp1kMpE9z13pO+DPxpDx3pG6s16glThrU+eKhWmOnouVIuiOjfVRsHQqXe6BvqeqGW+CxKYv/N6K5+dmzpz4rc7bvviAtmq8EYjl3svap0Izt0ycSnom61vpjBxqFSj0WrQc0/fL+P1jIVTI6l2EaTRChLRyPU62BgrZMLGBbeL7W/UMz+G/yvZftlz/QVf65MTdoZVvQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNC0xMFQwNzo0NjozOCswMDowMAiuiIoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDQtMTBUMDc6NDY6MzgrMDA6MDB58zA2AAAAAElFTkSuQmCC',
            request: () => sendData('https://hd-torrents.org/requests_new.php'),
        },
        {
            name: 'HDB',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACUlBMVEWwxdaswdKswtKtwtKtwdKtwtOovc6juMmit8miuMmes8SftMWtv86qvMues8Omucmwwc+htcaywtC3xtO3x9Oxw9CYrb6fs8Pd5OnQ2uKXrL29y9Xn7PCpusiousjq7vHs8PPi6Ozo7PDp7vHDz9qdscGSp7iarr7g5uvS2+KTp7mRpre8ydTs8PKltsXF0NmesMCktsTG0dry9fbCzteTqLmMobKVqLje5OnP2N+LoLGJnrC3xM/r7vGgscC4xc+Jn7GLoLKOo7PN1t2ZrLuFmqyPorLd4ufY3+SfsL6er73Fz9ebrLrq7fC1wsyEmauGm6yFmquot8P3+PmltMF/lKWJnKzb4OX19/jk6ezw8vTs7/GVp7WWp7Xp7O+xvsh+k6SAlaZ+k6Wpt8N4jZ+DlqbZ3+TO1dyHmqmFmKi1wcro6+6QorDn6+6tusR3jZ55jp94jZ6Yqbb2+PmdrLlyh5h9kaDX3eLFztVwhpeptcDm6u2LnauptsBxhpdziJlyh5m2wcqGmKdxh5hsgZJ3i5rW2+DDy9NtgZNrgJGlsr3l6eyGl6WntL5ug5Nyh5eYp7O6xMxxhZZme4xyhZXU2t+/yM9ne4xkeougrrjk6OuCk6GBkqDk5+vP1tvV29/d4uW5w8p0h5ZnfIxgdYZleYqLm6eCkqBhdoZhdod2iJeRn6trf49rfo6Uoq2dqrWeqrWWo69/kJ5hdYdbcIFZbn9Zb4Bab4BYbn9ab4FYbX9YbX5XbX9Wa3xRZndNYnJMYnJNYXJNYXNNYnNJXm////9b9tfLAAAAAWJLR0TFYwsrdwAAAAd0SU1FB+UECgcqMrKT7RgAAAFGSURBVBjTY2DABhjBgImRkRlEszAyszIyMbBhAQzsSICDkxNMM3Bx8/DycXHxCwgKCgmLiPJzAQGDmLiEpJiYlLSMrJy8gqKSsoqqmBiDmrqGppaato6unp6CvoGhkbGJqRqDmbmFpZWVtY2tnZ2tvYOjk7OSixWDq5u7h6enl7e8j4+vn39AYFBwSCBDaFh4RGRkZFR0TGxcfEJiUmxwcihDSmpaekZGZlZ2Tk5uXn5BYVFxSSFDaVl5RWlpZVV1TU11bV19Q6NvUzNDS2tbe0dHZ1d3T093b1//hOqJk1oYJk+ZOm369BkzZ82ekz133vwFCxdNXsywZOmy5StWLlm1es3ades3bNy0dMmKzQxbtmzdtmXLlu07dm7ZtXvPDhB7C8NeLIBhHxbAsP/AgYP79x86fPjggcOHDwHpw/sPMxzBAgDlBZmERX8RVgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMS0wNC0xMFQwNzo0Mjo1MCswMDowMPTFbxAAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjEtMDQtMTBUMDc6NDI6NTArMDA6MDCFmNesAAAAAElFTkSuQmCC',
            request: () => sendData('https://hdbits.org/requests/add_request'),
        },
        {
            name: 'PTP',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABU1BMVEUAAAACAgIEBAQDAwMBAQF7e3u+vr56enoXFxecnJy6urpSUlIuLi6vr6+xsbH///+wsLAhISHg4OB2dnZCQkL8/Px6fHy8vr95ensWFhebm528vL1UVFQuLS6xr7C9vbydnJsXFxZ7e3q/v718fHsXDAoiFQ8gGQ4eHAwfHw4LCwYIDQgQGw8PGxMPHBYNHBkHDg0GCAoOFx0MEBgODxgSDxoOChIDAQGcSj7oh1zgrVng0VrU2lk6Ohc4WzB2x29auXpZv5Fc0rcpY1gXKDVYl8Vae7ZYYqhwXKxZPnYBAQKxVkj/nWv/yWf+8Wj1+WhDQxtAaTiI5oFp145n3alr89Qwc2YaLj1mr+RojtJmcsODa8hoSIkCAQOxVEf/mmn/xWX+7Wbx92ZBQho/ZzeG4X5n04tm2aVp7tAvcGQaLTxkrN9mi85kb7+AacRmR4YCAQJn073lAAAAAWJLR0QPGLoA2QAAAAd0SU1FB+UEDAMAJuVAAk0AAAC+SURBVBjTY2BgZGJkYGZiYWFmZmFhYgZzGRhZ2dg5OLm4eXh5ebi5ODnY2ViBivj4BQSF+IVFREVFhPmFBAX4+YDKxcQlJKWkZWTl5GRl5BUUlZRVgPpV1dQ1NLW0dXT19A0MjYxNTM0YGMwtLK2sbWzt7B0cnZxdXN3cPTy9GMy9fXz9/AMCg4JDQsPCIyKjomNiGczj4hMSk5JTUtPSMzKzsnNy8/IL6CiI1UnYHI/Vm1gDBHvQYQtkbNEBAFOfVLHCxSMQAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTA0LTEyVDAzOjAwOjM4KzAwOjAw8nDEugAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wNC0xMlQwMzowMDozOCswMDowMIMtfAYAAAAASUVORK5CYII=',
            request: () => sendData('https://passthepopcorn.me/requests.php?action=new'),
        },
        {
            name: 'PHD',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACDVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAQFGPyRwZTsXFQxVTS1nXTYpJRVwZTp5bT93az52aj51aj14bD9NRSgEAwIhHQ7FrlbUvF4rJhMDAwGfjUblymWPfj7RuV3jyWXiyGPgxmPfxmLLtFktJxM1LRDWt0HRskAqJA2chTDmxUaskzTPsD/Ss0B/bipwYSZ5aCnHqj7YuUJCORQ0LAzUsTDPri82LQwMCgIODAISDwOfhSTivjSojSbMqy/CoywcFwYPDQOxlSjYtTFCNw80KwnQrCbXsSe5mSGxkh+ykx/NqiXbtSiliR7JpiTAnyMbFwUPDQKwkiDWsSdBNgw0KgfQqhzYsB3Bnhu7mRq8mhrbsx6lhxbJpBvAnRobFgMQDQKxkRjXsB1CNgk1KgXVrBTSqRM8MAYSDwIVEQIYFAKigg/kuBWqiRDOphPEnhIcFgIQDQGzkBDarxRDNgY1KgPZrQzTqQwrIgIDAwCefgnpug2uiwnRpwvUqgyAZgZwWQV5YAXKoQvbrwxDNgMiGwHKoAXZrAUsIwEEAwCigATquQaSdATWqQXouAXntwbltQbltQXRpQUuJAECAQBJOQB0WwEYEgBYRQBrVAErIgBzWwB9YwF7YQF6YAF8YQFQPwD///9sRWxwAAAAE3RSTlMAD2jG8P0cpvgOpWf292nCxe3vW6icJgAAAAFiS0dErrlrk6cAAAAHdElNRQflBR0MDgqXgh1XAAABKUlEQVQY02NgYGBkYmZhFYYCVhZmJkYGIGBj5xBGARzsbAwMnFzCGICdk4GbB1OYl4+BXxgLEGAQxCYsxMAqIiomLiwsIiEpJS0jKycvL6egqMTKIKysoqomLKyuoamlraOrp6+vp2dgKMwgbGRsYgoUNjO3sLSytrGxsbWzdwAKOzo5u7i6uXt4enn7+ALN9fMPCAQKBwWHhIaFh0dERkXHxAKF4+ITEoHCSckpqWlp6ckZmVnZOUDh3Lz8AqBwYVFxSWlZeUVlVXVNLVC4rr6hESjc1NzSKizc1t7R2dXd09vb29c/YSJQeNLkKVOFhadNnzFz1uw5c+fNmztv/gJhBtaFixYvERZeuHTZ8hUrV60GgjVrp7Hi8jyOoMIRsDiiAUekYY9iAOujViqpcnSrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTA1LTI5VDEyOjE0OjEwKzAwOjAw1eU6iAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wNS0yOVQxMjoxNDoxMCswMDowMKS4gjQAAAAASUVORK5CYII=',
            request: () => sendData('https://privatehd.to/request/torrent'),
        },
    ];
}
function cbrFillOutForm(receivedData, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, originalTitle, year, imdbId, tmdbId, tvdbId, malId } = receivedData;
        const inputTitle = document.querySelector('input#title');
        const selectCategory = document.querySelector('select#category_id');
        const inputTmdb = document.querySelector('input#autotmdb');
        const inputImdb = document.querySelector('input#autoimdb');
        const inputTvdb = document.querySelector('input#autotvdb');
        const inputMal = document.querySelector('input#automal');
        if (isSonarrEventOrigin(event)) {
            if (selectCategory) {
                const event = new Event('change');
                selectCategory.value = malId === '0' ? '2' : '4';
                //handle category change event
                selectCategory.dispatchEvent(event);
                yield new Promise((resolve) => setTimeout(resolve, 200));
            }
        }
        if (inputTitle) {
            if (originalTitle) {
                inputTitle.value = `${title} - ${originalTitle} (${year})`;
            }
            else {
                inputTitle.value = `${title} (${year})`;
            }
        }
        if (inputTmdb && tmdbId) {
            inputTmdb.value = tmdbId;
        }
        if (inputImdb && imdbId) {
            inputImdb.value = imdbId;
        }
        if (inputTvdb && tvdbId) {
            inputTvdb.value = tvdbId;
        }
        if (inputMal && malId) {
            inputMal.value = malId;
        }
    });
}
function lcdFillOutForm(receivedData, event) {
    const { title, originalTitle, year, imdbId, tmdbId, tvdbId, malId } = receivedData;
    const inputTitle = document.querySelector('input[name="name"]');
    const selectCategory = document.querySelector('select[name="category_id"]');
    const inputTmdb = document.querySelector('input#autotmdb');
    const inputImdb = document.querySelector('input#autoimdb');
    const inputTvdb = document.querySelector('input#autotvdb');
    const inputMal = document.querySelector('input[name="mal"]');
    if (inputTitle) {
        if (originalTitle) {
            inputTitle.value = `${title} - ${originalTitle} (${year})`;
        }
        else {
            inputTitle.value = `${title} (${year})`;
        }
    }
    if (inputTmdb && tmdbId) {
        inputTmdb.value = tmdbId;
    }
    if (inputImdb && imdbId) {
        inputImdb.value = imdbId;
    }
    if (inputTvdb && tvdbId) {
        inputTvdb.value = tvdbId;
    }
    if (inputMal && malId) {
        inputMal.value = malId;
    }
    if (isRadarrEventOrigin(event)) {
        if (selectCategory) {
            selectCategory.value = '1';
        }
    }
    if (isSonarrEventOrigin(event)) {
        if (selectCategory) {
            selectCategory.value = malId === '0' ? '2' : '6';
        }
    }
}
//FIX
function bjFillOutForm(receivedData, event) {
    const { title, originalTitle, year, imdbId, malId } = receivedData;
    const selectCategory = document.querySelector('select#categories');
    const SelectXXX = document.querySelector('select#adulto');
    const inputImdb = document.querySelector('input#imdblink');
    const inputOriginalTitle = document.querySelector('input#title');
    const inputTitle = document.querySelector('input#titulobrasileiro');
    const inputYear = document.querySelector('input#year');
    const isAnime = malId !== '0';
    if (isRadarrEventOrigin(event)) {
        if (selectCategory) {
            selectCategory.value = 'Filmes';
        }
    }
    if (isSonarrEventOrigin(event)) {
        if (selectCategory) {
            selectCategory.value = isAnime ? 'Animes' : 'Seriados';
        }
    }
    //@ts-ignore
    Categories();
    if (SelectXXX) {
        SelectXXX.value = '2';
    }
    if (inputImdb && imdbId) {
        inputImdb.value = 'tt' + imdbId;
    }
    // if (isSonarrOrigin(event && isAnime) {
    //   if (inputOriginalTitle && title) {
    //     inputOriginalTitle.value = title
    //   }
    // }
    if (inputOriginalTitle) {
        inputOriginalTitle.value = originalTitle !== null && originalTitle !== void 0 ? originalTitle : title;
    }
    if (inputTitle && title) {
        inputTitle.value = title;
    }
    if (inputYear && year) {
        inputYear.value = year;
    }
}
function ascFillOutForm(receivedData, event) {
    const { title, originalTitle, year, imdbId, tmdbId, tvdbId, malId, youtube } = receivedData;
    const inputTitle = document.querySelector('input[name="titulo"]');
    const selectCategory = document.querySelector('select#cat');
    const textAreaDescription = document.querySelector('div.wysibb-text div[contenteditable="true"]');
    const isAnime = malId !== '0';
    if (isRadarrEventOrigin(event)) {
        if (selectCategory) {
            selectCategory.value = '119';
        }
    }
    if (isSonarrEventOrigin(event)) {
        if (selectCategory) {
            selectCategory.value = isAnime ? '69' : '120';
        }
    }
    if (inputTitle) {
        if (originalTitle) {
            inputTitle.value = `${title} - ${originalTitle} (${year})`;
        }
        else {
            inputTitle.value = `${title} (${year})`;
        }
    }
    let descriptionText = '';
    if (imdbId) {
        descriptionText += `[url=https://www.imdb.com/title/tt${imdbId}]https://www.imdb.com/title/tt${imdbId}[/url]\n`;
    }
    if (tmdbId) {
        const tmdbType = isRadarrEventOrigin(event) ? 'movie' : 'tv';
        descriptionText += `[url=https://themoviedb.org/${tmdbType}/${tmdbId}]https://themoviedb.org/${tmdbType}/${tmdbId}[/url]\n`;
    }
    if (tvdbId) {
        descriptionText += `[url=http://www.thetvdb.com/?tab=series&id=${tvdbId}]http://www.thetvdb.com/?tab=series&id=${tvdbId}[/url]\n`;
    }
    if (malId && isAnime) {
        descriptionText += `[url=https://myanimelist.net/anime/${malId}]https://myanimelist.net/anime/${malId}[/url]\n`;
    }
    if (youtube) {
        descriptionText += `[video]${youtube}[/video]\n`;
    }
    if (textAreaDescription) {
        textAreaDescription.innerText += descriptionText;
    }
}
////////////////////
function bhdFillOutForm(receivedData, event) {
    const { title, originalTitle, year, imdbId, tmdbId, tvdbId, malId, youtube } = receivedData;
    const inputTitle = document.querySelector('input[name="name"]');
    const selectCategory = document.querySelector('select[name="category_id"]');
    const inputTmdb = document.querySelector('input#tmdbauto');
    const inputImdb = document.querySelector('input#imdbauto');
    const textAreaDescription = document.querySelector('#request-form-description');
    const isAnime = malId !== '0';
    if (inputTitle) {
        inputTitle.value = `${originalTitle !== null && originalTitle !== void 0 ? originalTitle : title} (${year})`;
    }
    if (inputTmdb && tmdbId) {
        inputTmdb.value = tmdbId;
    }
    if (inputImdb && imdbId) {
        inputImdb.value = 'tt' + imdbId;
    }
    console.log(selectCategory, isRadarrEventOrigin(event));
    if (selectCategory) {
        if (isRadarrEventOrigin(event)) {
            selectCategory.value = '1';
        }
        else {
            selectCategory.value = '2';
        }
    }
    let descriptionText = '';
    if (tvdbId) {
        descriptionText += `http://www.thetvdb.com/?tab=series&id=${tvdbId}\n`;
    }
    if (malId && isAnime) {
        descriptionText += `https://myanimelist.net/anime/${malId}\n`;
    }
    if (youtube) {
        descriptionText += `${youtube}\n`;
    }
    if (textAreaDescription) {
        textAreaDescription.innerHTML += descriptionText;
    }
}
function bluFillOutForm(receivedData, event) {
    const { title, originalTitle, year, imdbId, tmdbId, tvdbId, malId } = receivedData;
    const inputTitle = document.querySelector('input[name="name"]');
    const selectCategory = document.querySelector('select[name="category_id"]');
    const inputTmdb = document.querySelector('input#autotmdb');
    const inputImdb = document.querySelector('input#autoimdb');
    const inputTvdb = document.querySelector('input#autotvdb');
    const inputMal = document.querySelector('input#automal');
    if (inputTitle) {
        inputTitle.value = `${originalTitle !== null && originalTitle !== void 0 ? originalTitle : title} (${year})`;
    }
    if (inputTmdb && tmdbId) {
        inputTmdb.value = tmdbId;
    }
    if (inputImdb && imdbId) {
        inputImdb.value = imdbId;
    }
    if (inputTvdb && tvdbId) {
        inputTvdb.value = tvdbId;
    }
    if (inputMal && malId) {
        inputMal.value = malId;
    }
    if (selectCategory) {
        if (isRadarrEventOrigin(event)) {
            selectCategory.value = '1';
        }
        else {
            selectCategory.value = '2';
        }
    }
}
function btnFillOutForm(receivedData, event) {
    const { title, originalTitle, year, imdbId, tmdbId, tvdbId, malId, youtube } = receivedData;
    const inputTitle = document.querySelector('input[name="artist"]');
    const selectCategory = document.querySelector('select#categories');
    const textAreaDescription = document.querySelector('textarea[name="description"]');
    const isAnime = malId !== '0';
    if (selectCategory) {
        selectCategory.value = 'Season';
    }
    if (inputTitle) {
        inputTitle.value = `${originalTitle !== null && originalTitle !== void 0 ? originalTitle : title} (${year})`;
    }
    let descriptionText = '';
    if (imdbId) {
        descriptionText += `https://www.imdb.com/title/tt${imdbId}\n`;
    }
    if (tmdbId) {
        const tmdbType = isRadarrEventOrigin(event) ? 'movie' : 'tv';
        descriptionText += `https://themoviedb.org/${tmdbType}/${tmdbId}\n`;
    }
    if (tvdbId) {
        descriptionText += `http://www.thetvdb.com/?tab=series&id=${tvdbId}\n`;
    }
    if (malId && isAnime) {
        descriptionText += `https://myanimelist.net/anime/${malId}\n`;
    }
    if (youtube) {
        descriptionText += `${youtube}\n`;
    }
    if (textAreaDescription) {
        textAreaDescription.innerHTML += descriptionText;
    }
}
function czFillOutForm(receivedData, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, originalTitle, year, imdbId, tmdbId, tvdbId } = receivedData;
        const inputTitle = document.querySelector('input#title');
        const selectCategory = document.querySelector('select#type');
        const tvSeasonBlock = document.querySelector('div#tv_season_block');
        const inputImdb = document.querySelector('input#imdb_id');
        const inputTmdb = document.querySelector('input[name="tmdb_id"]');
        const inputTvdb = document.querySelector('input[name="tvdb_id"]');
        if (selectCategory) {
            if (isSonarrEventOrigin(event)) {
                selectCategory.value = 'tv';
                tvSeasonBlock.style.display = '';
            }
            yield new Promise((resolve) => setTimeout(resolve, 200));
        }
        if (inputTitle) {
            inputTitle.value = `${originalTitle !== null && originalTitle !== void 0 ? originalTitle : title} (${year})`;
        }
        if (inputImdb && imdbId) {
            inputImdb.value = 'tt' + imdbId;
        }
        if (inputTmdb && tmdbId) {
            inputTmdb.value = tmdbId;
        }
        if (inputTvdb && tvdbId) {
            inputTvdb.value = tvdbId;
        }
    });
}
function flFillOutForm(receivedData, event) {
    const { title, originalTitle, year, imdbId, tmdbId, tvdbId, malId, youtube } = receivedData;
    const inputTitle = document.querySelector('input[name="requesttitle"]');
    const selectCategory = document.querySelector('select[name="category"]');
    const textAreaDescription = document.querySelector('textarea[name="body"]');
    const isAnime = malId !== '0';
    if (isRadarrEventOrigin(event)) {
        if (selectCategory) {
            selectCategory.value = '4';
        }
    }
    if (isSonarrEventOrigin(event)) {
        if (selectCategory) {
            selectCategory.value = isAnime ? '24' : '21';
        }
    }
    if (inputTitle) {
        inputTitle.value = `${originalTitle !== null && originalTitle !== void 0 ? originalTitle : title} (${year})`;
    }
    let descriptionText = '';
    if (imdbId) {
        descriptionText += `[url=https://www.imdb.com/title/tt${imdbId}]https://www.imdb.com/title/tt${imdbId}[/url]\n`;
    }
    if (tmdbId) {
        const tmdbType = isRadarrEventOrigin(event) ? 'movie' : 'tv';
        descriptionText += `[url=https://themoviedb.org/${tmdbType}/${tmdbId}]https://themoviedb.org/${tmdbType}/${tmdbId}[/url]\n`;
    }
    if (tvdbId) {
        descriptionText += `[url=http://www.thetvdb.com/?tab=series&id=${tvdbId}]http://www.thetvdb.com/?tab=series&id=${tvdbId}[/url]\n`;
    }
    if (malId && isAnime) {
        descriptionText += `[url=https://myanimelist.net/anime/${malId}]https://myanimelist.net/anime/${malId}[/url]\n`;
    }
    if (youtube) {
        descriptionText += `[video]${youtube}[/video]\n`;
    }
    if (textAreaDescription) {
        textAreaDescription.innerHTML += descriptionText;
    }
}
function gpwFillOutForm(receivedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { imdbId } = receivedData;
        const inputImdbAutoFill = document.querySelector('input#imdb');
        const buttonImdbAutoFill = document.querySelector('button#imdb_button');
        if (inputImdbAutoFill && buttonImdbAutoFill) {
            inputImdbAutoFill.value = 'tt' + imdbId;
            yield new Promise((resolve) => setTimeout(resolve, 200));
            buttonImdbAutoFill.click();
        }
    });
}
function hdtFillOutForm(receivedData) {
    const { title, originalTitle, year, imdbId, youtube } = receivedData;
    const inputTitle = document.querySelector('input[name="requesttitle"]');
    //const selectCategory = document.querySelector<HTMLSelectElement>('select[name="category"]')
    const inputImdbUrl = document.querySelector('input[name="infosite"]');
    //const textAreaDescription = document.querySelector<HTMLDivElement>('textarea[name="true"]')
    if (inputTitle) {
        inputTitle.value = `${originalTitle !== null && originalTitle !== void 0 ? originalTitle : title} (${year})`;
    }
    if (inputImdbUrl) {
        inputImdbUrl.value = 'https://www.imdb.com/title/tt' + imdbId;
    }
    let descriptionText = '';
    if (youtube) {
        descriptionText += `[video]${youtube}[/video]\n`;
    }
}
function hdbFillOutForm(receivedData, event) {
    const { title, originalTitle, year, imdbId, tmdbId, tvdbId, malId } = receivedData;
    const inputTitle = document.querySelector('input[name="name"]');
    const selectCategory = document.querySelector('select#type_category');
    const inputImdbLink = document.querySelector('input#imdb');
    const inputTvdb = document.querySelector('input#tvdb');
    const textAreaDescription = document.querySelector('textarea#description');
    const isAnime = malId !== '0';
    if (inputTitle) {
        inputTitle.value = `${originalTitle !== null && originalTitle !== void 0 ? originalTitle : title} (${year})`;
    }
    if (inputImdbLink && imdbId) {
        inputImdbLink.value = 'https://www.imdb.com/title/tt' + imdbId;
    }
    if (inputTvdb && tvdbId) {
        inputTvdb.value = tvdbId;
    }
    if (selectCategory) {
        if (isRadarrEventOrigin(event)) {
            selectCategory.value = '1';
        }
        else {
            selectCategory.value = '2';
        }
    }
    let descriptionText = '';
    if (tmdbId) {
        const tmdbType = isRadarrEventOrigin(event) ? 'movie' : 'tv';
        descriptionText += `[url=https://themoviedb.org/${tmdbType}/${tmdbId}]https://themoviedb.org/${tmdbType}/${tmdbId}[/url]\n`;
    }
    if (malId && isAnime) {
        descriptionText += `[url=https://myanimelist.net/anime/${malId}]https://myanimelist.net/anime/${malId}[/url]\n`;
    }
    if (textAreaDescription) {
        textAreaDescription.innerHTML += descriptionText;
    }
}
function ptpFillOutForm(receivedData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { imdbId } = receivedData;
        const inputImdbAutoFill = document.querySelector('input#imdb');
        const buttonImdbAutoFill = document.querySelector('input#autofill');
        if (inputImdbAutoFill && buttonImdbAutoFill) {
            inputImdbAutoFill.value = 'https://www.imdb.com/title/tt' + imdbId;
            yield new Promise((resolve) => setTimeout(resolve, 200));
            buttonImdbAutoFill.click();
        }
    });
}
function phdFillOutForm(receivedData, event) {
    return __awaiter(this, void 0, void 0, function* () {
        const { title, originalTitle, year, imdbId, tmdbId, tvdbId } = receivedData;
        const inputTitle = document.querySelector('input#title');
        const selectCategory = document.querySelector('select#type');
        const tvSeasonBlock = document.querySelector('div#tv_season_block');
        const inputImdb = document.querySelector('input#imdb_id');
        const inputTmdb = document.querySelector('input[name="tmdb_id"]');
        const inputTvdb = document.querySelector('input[name="tvdb_id"]');
        if (selectCategory) {
            if (isSonarrEventOrigin(event)) {
                selectCategory.value = 'tv';
                tvSeasonBlock.style.display = '';
            }
            yield new Promise((resolve) => setTimeout(resolve, 200));
        }
        if (inputTitle) {
            inputTitle.value = `${originalTitle !== null && originalTitle !== void 0 ? originalTitle : title} (${year})`;
        }
        if (inputImdb && imdbId) {
            inputImdb.value = 'tt' + imdbId;
        }
        if (inputTmdb && tmdbId) {
            inputTmdb.value = tmdbId;
        }
        if (inputTvdb && tvdbId) {
            inputTvdb.value = tvdbId;
        }
    });
}

