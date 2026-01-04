// ==UserScript==
// @name         Geoguessr 5k radius displayer
// @description  Adds the 5k radius to map and challenge pages
// @version      0.3.1
// @license      MIT
// @author       irrational
// @match        https://www.geoguessr.com/*
// @require      https://greasyfork.org/scripts/460322-geoguessr-styles-scan/code/Geoguessr%20Styles%20Scan.js?version=1151668
// @namespace    https://greasyfork.org/users/1501600
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/544640/Geoguessr%205k%20radius%20displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/544640/Geoguessr%205k%20radius%20displayer.meta.js
// ==/UserScript==


const USERSCRIPT_RADIUS_BLOCK_CLASS = "___userscript-radius-block";

const I18N = {
    'fivek_radius': {"en": "5k radius", "de": "5k-Radius",
                     "es": "radio de 5k", "fr": "rayon de 5k",
                     "it": "raggio di 5k", "nl": "5k straal",
                     "pt": "raio de 5k","sv": "5k radie",
                     "tr": "5k yarıçap", "ja": "5k半径",
                     "pl": "promień 5k", "ko": "5k 반경"},
    'show_on_maps': {"en": "Show on map pages", "de": "Auf Kartenseiten anzeigen",
                     "es": "Mostrar en páginas de mapas", "fr": "Afficher sur les pages de cartes",
                     "it": "Mostra sulle pagine delle mappe", "nl": "Weergeven op kaartpagina's",
                     "pt": "Mostrar nas páginas de mapas", "sv": "Visa på kartsidor",
                     "tr": "Harita sayfalarında göster", "ja": "地図ページに表示",
                     "pl": "Pokaż na stronach map", "ko": "지도 페이지에 표시"},
    'hide_on_maps': {"en": "Hide on map pages", "de": "Auf Kartenseiten ausblenden",
                     "es": "Ocultar en páginas de mapas", "fr": "Masquer sur les pages de cartes",
                     "it": "Nascondi sulle pagine delle mappe", "nl": "Verbergen op kaartpagina's",
                     "pt": "Ocultar nas páginas de mapas", "sv": "Dölj på kartsidor",
                     "tr": "Harita sayfalarında gizle", "ja": "地図ページで非表示",
                     "pl": "Ukryj na stronach map", "ko": "지도 페이지에서 숨기기"},
    'show_on_challenges': {"en": "Show on challenge pages", "de": "Auf Herausforderungsseiten anzeigen",
                           "es": "Mostrar en páginas de desafíos", "fr": "Afficher sur les pages de défis",
                           "it": "Mostra sulle pagine delle sfide", "nl": "Weergeven op uitdagingpagina's",
                           "pt": "Mostrar nas páginas de desafios", "sv": "Visa på utmaningssidor",
                           "tr": "Meydan okuma sayfalarında göster", "ja": "チャレンジページに表示",
                           "pl": "Pokaż na stronach wyzwań", "ko": "도전 페이지에 표시"},
    'hide_on_challenges': {"en": "Hide on challenge pages", "de": "Auf Herausforderungsseiten ausblenden",
                           "es": "Ocultar en páginas de desafíos", "fr": "Masquer sur les pages de défis",
                           "it": "Nascondi sulle pagine delle sfide", "nl": "Verbergen op uitdagingpagina's",
                           "pt": "Ocultar nas páginas de desafios", "sv": "Dölj på utmaningssidor",
                           "tr": "Meydan okuma sayfalarında gizle", "ja": "チャレンジページで非表示",
                           "pl": "Ukryj na stronach wyzwań", "ko": "도전 페이지에서 숨기기"}
}


const getLanguage = () => {
    if (location.pathname.startsWith('/maps/') || location.pathname.startsWith('/challenges/')) return 'en';
    return location.pathname.substring(1, 3);
}

const i18n = (key) => I18N[key][getLanguage()] || I18N[key].en;


/* Run only on maps and challenge pages. Because the Geoguessr frontend is a React application,
   URL updates are not always registered (by Tampermonkey on Firefox at least) for the purpose of
   finding out whether the script should be loaded at all. So unfortunately, we must @match on
   the entire website. */
const checkURL = () => location.pathname.match(/^\/([a-z]{2}\/)?maps\//) ? 'map' :
                       location.pathname.match(/^\/([a-z]{2}\/)?challenge\//) ? 'challenge' : null;


const runOn = { map: GM_getValue('run_on_map', true),
                challenge: GM_getValue('run_on_challenge', true) };
const menuId = {map: null, challenge: null};
const makeMenuHandler = (pageType, runOnPage, newText) => {
    return (event) => {
        GM_setValue('run_on_' + pageType, runOnPage);
        runOn[pageType] = runOnPage;
        GM_registerMenuCommand(newText,
                               makeMenuHandler(pageType, ! runOnPage,
                                               i18n((runOnPage ? 'show' : 'hide') + `_on_${pageType}s`)),
                               {id: menuId[pageType]});
        if (checkURL() == pageType) location.reload();
    }
}
menuId.map =
    GM_registerMenuCommand(i18n((runOn.map ? 'hide' : 'show') + '_on_maps'),
                           makeMenuHandler('map', ! runOn.map,
                                           i18n((runOn.map ? 'show' : 'hide') + '_on_maps')));
menuId.challenge =
    GM_registerMenuCommand(i18n((runOn.challenge ? 'hide' : 'show') + '_on_challenges'),
                           makeMenuHandler('challenge', ! runOn.challenge,
                                           i18n((runOn.challenge ? 'show' : 'hide') + '_on_challenges')));


const fetchMap = async (mapType, mapId) => {
    if (mapType == "community") {
        /* The __NEXT_DATA__ approach below in principle also works with community maps, but
           using the API endpoint (a) feels like less of a hack and (b) can be done before
           the __NEXT_DATA__ element appears in the DOM. */
        return fetch("https://www.geoguessr.com/api/maps/" + mapId)
            .then(out => out.json())
            .catch(err => { console.log("5k radius displayer in fetchMap():", err); return null; });
    } else {
        /* The most stable way to fetch offical map data appears to be to parse the __NEXT_DATA__
           element in the server-supplied HTML itself, which we don't need to fetch if we have a
           proper page load rather than React reusing document elements from a previous map page. */
        let next_data = JSON.parse(document.getElementById("__NEXT_DATA__").innerText);
        if (next_data.props.pageProps.map && next_data.props.pageProps.map.slug == mapId) {
            return Promise.resolve(next_data.props.pageProps.map);
        } else {
            return fetch("https://www.geoguessr.com/maps/" + mapId)
                .then(out => out.text())
                .then(text => {
                   const parser = new DOMParser();
                   const doc = parser.parseFromString(text, "text/html");
                   next_data = JSON.parse(doc.getElementById("__NEXT_DATA__").innerText);
                   return next_data.props.pageProps.map; })
                .catch(err => { console.log("5k radius displayer in fetchMap():", err); return null; });
        }
    }
}


const fetchChallengeMap = async (challengeId) => {
    return fetch("https://www.geoguessr.com/api/v3/challenges/" + challengeId)
        .then(out => out.json())
        .then(challenge => challenge.map)
        .catch(err => { console.log("5k radius displayer in fetchChallenge():", err); return null; });
}


const fetchDistanceUnit = async () => {
    return fetch("https://www.geoguessr.com/api/v3/profiles")
        .then(out => out.json())
        .then(profile => profile.distanceUnit == 1 ? 'yd' : 'm')
        .catch(err => { console.log("5k radius displayer in fetchDistanceUnit():", err); return null; });
}


const createRadiusBlock = (mapType) => {
    let radiusBlock = document.createElement('div');
    radiusBlock.className = cn(mapType + "-map-stat_mapStat__") + " " + USERSCRIPT_RADIUS_BLOCK_CLASS;
    let statIcon = document.createElement('div');
    statIcon.className = cn(mapType + "-map-stat_icon__");
    let statValue = document.createElement('div');
    statValue.className = cn(mapType + "-map-stat_value__");
    statValue.style.textAlign = "center";
    let statTitle = document.createElement('div');
    statTitle.className = cn(mapType + "-map-stat_title__");
    radiusBlock.appendChild(statIcon);
    if (mapType == "community") {
        let statContent = document.createElement('div');
        statContent.className = cn("community-map-stat_content__");
        statContent.appendChild(statValue);
        statContent.appendChild(statTitle);
        radiusBlock.appendChild(statContent);
    } else {
        radiusBlock.appendChild(statValue);
        radiusBlock.appendChild(statTitle);
    }
    if (mapType == "official") {
        // The background should remain skewed, but the icon shouldn't be.
        let unskewingDiv = document.createElement('div');
        unskewingDiv.innerHTML = String.fromCodePoint(0x1F4CD); // round pushpin emoji
        unskewingDiv.style.transform = "skewX(13deg)";
        statIcon.appendChild(unskewingDiv);
    } else statIcon.innerHTML = String.fromCodePoint(0x1F4CD);
    statTitle.innerHTML = i18n('fivek_radius');
    return radiusBlock;
}


const fillRadiusBlock = (mapType, radiusBlock, content, fontStyle = null) => {
    let statValue = radiusBlock.querySelector("." + cn(mapType + "-map-stat_value__"));
    statValue.innerHTML = content;
    if (fontStyle) statValue.style.fontStyle = fontStyle;
}


const createChallengeRadiusBlock = () => {
    let radiusBlock = document.createElement('li');
    radiusBlock.className = cn('game-settings-list_setting__') + " " + USERSCRIPT_RADIUS_BLOCK_CLASS;
    let settingIcon = document.createElement('div');
    settingIcon.className = cn('game-settings-list_settingIcon__');
    let settingLabel = document.createElement('div');
    settingLabel.className = cn('game-settings-list_settingLabel__');
    radiusBlock.appendChild(settingIcon);
    radiusBlock.appendChild(settingLabel);
    settingIcon.innerHTML = String.fromCodePoint(0x1F4CD); // round pushpin emoji
    settingIcon.style.fontSize = 'calc(var(--setting-icon-size) * 0.75)';
    settingLabel.style.textTransform = 'none';
    return radiusBlock;
}


const formatRadius = (map, distanceUnit, language) => {
    /* It doesn't sound like it, but maxErrorDistance is in effect faked by maps that set the 5k
       radius manually. Thus, we can always use it to determine the 5k radius. */
    let radius = Math.log(5000/4999.5) * map.maxErrorDistance / 10; // in m
    radius = radius < 25 ? 25 : radius;

    if (distanceUnit == 'yd') {
        radius = Math.round(radius / 0.0254); // in inches, rounded to inches
        const yd = Math.trunc(radius / 36);
        const ft = Math.trunc((radius - 36 * yd) / 12);
        const in_ = radius - 36 * yd - 12 * ft;
        return in_ > 0 ? `${yd} yd ${ft}′ ${in_}″` :
                ft > 0 ? `${yd} yd ${ft}′` :
                         `${yd} yd`;
    } else {
        radius = Math.round(radius * 100) / 100; // in m, rounded to cm
        return new Intl.NumberFormat(language).format(radius) + " m";
    }
};


var lastMapId = null;
var lastLanguage = null;

const runOnMapPage = () => {
    let mapId = location.pathname.split('/').pop();
    let mapType = mapId.match(/^[0-9a-fA-F]{24}$/) ? 'community' : 'official';

    const statsContainer = document.querySelector("." + cn(mapType + "-map-block_mapStatsContainer__"));
    /* Before there is a stats container in the DOM, there is nothing to do. */
    if (! statsContainer) return;

    /* On official maps, the __NEXT_DATA__ element either contains our map data or tells us
       that we need to fetch it, so we need to wait for it. */
    if (mapType == "official" && ! document.getElementById("__NEXT_DATA__")) return;

    /* Multiple mutations may occur and trigger this function before we have created
       the radius block, so acquire a lock and release it once we've created and filled
       the block in order to avoid adding multiple. */
    navigator.locks.request("userscript_map_radius_block", async (lock) => {
        let radiusBlock = document.querySelector("." + USERSCRIPT_RADIUS_BLOCK_CLASS);

        // If we have a radius block, and the language setting changes, we need to recreate it.
        let language = getLanguage();
        if (radiusBlock && language != lastLanguage) radiusBlock.remove();
        lastLanguage = language;

        /* We don't want API requests on every mutation. However, React reuses document
           elements, e.g. when a new map is selected from search results when a map page is
           already open. So, upon mutation, check if the map ID has changed to see if new
           API requests are worth it. */
        if (radiusBlock && mapId == lastMapId) return;
        lastMapId = mapId;

        if (! radiusBlock) {
            radiusBlock = createRadiusBlock(mapType);
            statsContainer.appendChild(radiusBlock);
            if (mapType == "community") {
                /* At a screen width of 1020px or higher, the mapInfo box has a two-column format
                   where we have to adjust the height to make space for the additional element in
                   the mapStatsContainer. */
                const mapInfoContainer = document.querySelector("." + cn("community-map-block_mapInfo__"));
                const style = document.createElement('style');
                // current height + radius block height + gap = 14.625rem + 3rem + 0.5rem = 18.125rem
                style.innerText = "@media screen and (width >= 1020px) { " +
                    "." + cn("community-map-block_mapInfo__") + " { height: 18.125rem; } }";
                mapInfoContainer.appendChild(style);
            }
        }
        fillRadiusBlock(mapType, radiusBlock, "\u2026"); // ellipsis

        Promise.all([fetchDistanceUnit(), fetchMap(mapType, mapId)]).then(([distanceUnit, map]) => {
            if (! (distanceUnit && map)) { // We probably were rate-limited.
                fillRadiusBlock(mapType, radiusBlock, "\u274C", "normal"); // cross mark emoji
                return;
            }

            const radius = formatRadius(map, distanceUnit, language);
            fillRadiusBlock(mapType, radiusBlock, radius);
        });
    });
}


// Challenges have proper page loads, so this is sufficient.
var haveChallengeRadiusBlock = false;

const runOnChallengePage = () => {
    let gameSettings = document.querySelector("." + cn('game-settings-list_settings__'));
    if (!gameSettings) return;

    let challengeId = location.pathname.split('/').pop();
    navigator.locks.request("userscript_challenge_radius_block", async (lock) => {
        if (haveChallengeRadiusBlock) return;
        haveChallengeRadiusBlock = true;

        const radiusBlock = createChallengeRadiusBlock();
        Promise.all([fetchChallengeMap(challengeId), fetchDistanceUnit()]).then(([map, distanceUnit]) => {
            if (! (map && distanceUnit)) return;
            const radius = formatRadius(map, distanceUnit, getLanguage());
            const label = radiusBlock.querySelector("." + cn('game-settings-list_settingLabel__'));
            label.innerHTML = radius;
            gameSettings.appendChild(radiusBlock);
        });
    });
}


const run = async (page) => {
    if (page == 'map' && runOn.map) {
        scanStyles().then(runOnMapPage);
    } else if (page == 'challenge' && runOn.challenge) {
        scanStyles().then(runOnChallengePage);
    }
}

new MutationObserver((mutations) => {
    run(checkURL());
}).observe(document.body, { subtree: true, childList: true });

/* Make sure to run at least once, in case the MutationObserver was created too late
  (which tends to happen on challenge pages). */
run(checkURL());