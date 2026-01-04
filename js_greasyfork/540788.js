// ==UserScript==
// @name         MyHeritage: Flag injector with country detection
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Add country flags to each node of your MyHeritage family tree using birthplaces. With caching and AJAX throttling.
// @author       ciricuervo
// @match        https://www.myheritage.com/*
// @match        https://www.myheritage.es/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=myheritage.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540788/MyHeritage%3A%20Flag%20injector%20with%20country%20detection.user.js
// @updateURL https://update.greasyfork.org/scripts/540788/MyHeritage%3A%20Flag%20injector%20with%20country%20detection.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const svgNS = 'http://www.w3.org/2000/svg';
    const xlinkNS = 'http://www.w3.org/1999/xlink';
    const clientDate = new Date().toISOString().slice(0, 10);

    const csrf_token = window.mhXsrfToken;
    const siteId = window.currentSiteId;
    const lang = window.languageCode;

    const countryCache = new Map();
    const queue = [];
    let processing = false;
    let queueUpdated = false;

    const countryMap = new Map([
        ['alemania', 'de'],
        ['germany', 'de'],
        ['argentina', 'ar'],
        ['australia', 'au'],
        ['austria', 'at'],
        ['bolivia', 'bo'],
        ['brasil', 'br'],
        ['brazil', 'br'],
        ['bulgaria', 'bg'],
        ['bélgica', 'be'],
        ['belgium', 'be'],
        ['checoslovaquia', 'cz'], // dissolved
        ['czechoslovakia', 'cz'], // dissolved
        ['chile', 'cl'],
        ['china', 'cn'],
        ['croacia', 'hr'],
        ['croatia', 'hr'],
        ['dinamarca', 'dk'],
        ['denmark', 'dk'],
        ['ecuador', 'ec'],
        ['escocia', 'gb-sct'],
        ['scotland', 'gb-sct'],
        ['españa', 'es'],
        ['spain', 'es'],
        ['estados unidos', 'us'],
        ['united states', 'us'],
        ['eeuu', 'us'],
        ['usa', 'us'],
        ['francia', 'fr'],
        ['france', 'fr'],
        ['guatemala', 'gt'],
        ['hungría', 'hu'],
        ['hungary', 'hu'],
        ['inglaterra', 'gb-eng'],
        ['england', 'gb-eng'],
        ['irlanda', 'ie'],
        ['ireland', 'ie'],
        ['irlanda del norte', 'gb-nir'],
        ['northern ireland', 'gb-nir'],
        ['italia', 'it'],
        ['italy', 'it'],
        ['jamaica', 'jm'],
        ['japón', 'jp'],
        ['japan', 'jp'],
        ['líbano', 'lb'],
        ['lebanon', 'lb'],
        ['marruecos', 'ma'],
        ['morocco', 'ma'],
        ['nicaragua', 'ni'],
        ['paraguay', 'py'],
        ['países bajos', 'nl'],
        ['netherlands', 'nl'],
        ['perú', 'pe'],
        ['peru', 'pe'],
        ['polonia', 'pl'],
        ['poland', 'pl'],
        ['portugal', 'pt'],
        ['reino unido', 'gb'],
        ['united kingdom', 'gb'],
        ['ru', 'gb'],
        ['uk', 'gb'],
        ['república checa', 'cz'],
        ['czech republic', 'cz'],
        ['chequia', 'cz'],
        ['czechia', 'cz'],
        ['república dominicana', 'do'],
        ['dominican republic', 'do'],
        ['rusia', 'ru'],
        ['russia', 'ru'],
        ['siria', 'sy'],
        ['syria', 'sy'],
        ['sudáfrica', 'za'],
        ['south africa', 'za'],
        ['suiza', 'ch'],
        ['switzerland', 'ch'],
        ['uruguay', 'uy'],
        ['yugoslavia', 'hr'], // dissolved
    ]);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function extractCountryFromPlace(place) {
        if (!place) return null;
        const parts = place.toLowerCase().split(',').map(p => p.trim());
        if (!parts.length) return null;
        if (parts.length > 1) {
            // Some countries belong to a major region, like: 'England, United Kingdom', in that case return 'england'
            const region = parts[parts.length - 1];
            const country = parts[parts.length - 2];
            if (region === 'reino unido' || region === 'united kingdom' || region === 'ru' || region === 'uk') return country;
        }
        return parts[parts.length - 1];
    }

    function countryToCode(country) {
        if (!country) return null;
        return countryMap.get(country) || null;
    }

    async function fetchCountryCode(individualID) {
        const url = `/FP/API/FamilyTree/get-extended-card-content.php?allEventsForIndividual=0&clientDate=${clientDate}&dataLang=&discoveries=0&dna=0&facts=0&individualID=${individualID}&lang=${lang}&matches=0&photos=0&relatives=0&s=${siteId}&sites=0&csrf_token=${csrf_token}`;

        try {
            const res = await fetch(url);
            const json = await res.json();
            const birthPlace = json.birthPlace;
            const country = extractCountryFromPlace(birthPlace);
            const code = countryToCode(country);
            return code;
        } catch (e) {
            console.warn('Error fetching country for ID:', individualID, e);
            return null;
        }
    }

    function processCachedNodes() {
        for (let i = queue.length - 1; i >= 0; i--) {
            const { node, individualID } = queue[i];
            const countryCode = countryCache.get(individualID);
            if (countryCode) {
                injectFlag(node, countryCode);
                queue.splice(i, 1);
            }
        }
    }

    async function processQueue() {
        queueUpdated = true;
        if (processing) return;
        processing = true;

        while (queue.length > 0) {
            if (queueUpdated) {
                // Process cached nodes first (inject without delay)
                processCachedNodes();
                queueUpdated = false;
                continue;
            }

            // Fetch the uncached (new nodes to process) and null-cached (that may have changed)
            const { node, individualID } = queue.shift();
            let countryCode = await fetchCountryCode(individualID);
            countryCache.set(individualID, countryCode); // can be null
            if (countryCode) injectFlag(node, countryCode);
            await sleep(300); // throttling

            // If by the time it wakes up (after the throttling/delay) there was a re-queue,
            // the `queueUpdated` flag will take care of processing the cached nodes first.
        }

        processing = false;
    }

    function injectFlag(outerNode, countryCode) {
        if (outerNode.querySelector('.country-flag')) return;

        let onTopNode = outerNode.querySelector('g[data-type="_svgOnTopGroup"]');
        if (!onTopNode) {
            onTopNode = document.createElementNS(svgNS, 'g');
            onTopNode.setAttribute('data-type', '_svgOnTopGroup');
            outerNode.appendChild(onTopNode);
        }

        const img = document.createElementNS(svgNS, 'image');
        img.setAttribute('filter', 'url(#outline)'); // the filter that adds the border to the country flag
        img.setAttribute('x', '0');
        img.setAttribute('y', '0');
        img.setAttribute('width', '28');
        img.setAttribute('height', '28');
        img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        img.setAttributeNS(xlinkNS, 'xlink:href', `https://flagcdn.com/w40/${countryCode}.png`);
        img.classList.add('country-flag');

        // If outer node has a width less than 200, we assume it is using vertical cards display
        //  - Horizontal cards display: (180, 86.5)
        //  - Vertical cards display: (100, -13.5)
        const outerNodeWidth = outerNode.getBBox().width;
        const flagNodeX = outerNodeWidth < 200 ? 100.0 : 180.0;
        const flagNodeY = outerNodeWidth < 200 ? -13.5 : 86.5;

        const flagNode = document.createElementNS(svgNS, 'g');
        flagNode.setAttribute('data-type', 'onTopGroup');
        flagNode.setAttribute('transform', `matrix(1.0, 0.0, 0.0, 1.0, ${flagNodeX}, ${flagNodeY})`);
        flagNode.appendChild(img);

        onTopNode.appendChild(flagNode);
    }

    function addAllFlags() {
        const outerNodes = document.querySelectorAll('g.cardWrapper[id^="card"]');

        outerNodes.forEach(node => {
            const match = node.id.match(/^card(\d+)/);
            if (!match) return;

            const individualID = match[1];
            queue.push({ node: node.closest('g[data-type="_svgOuterGroup"]'), individualID });
        });

        processQueue();
    }

    // This filter will be added only once to the SVG defs section
    // It is used to add a border to the country flags
    function appendOutlineFilter() {
        const svgDefs = document.querySelector('#NewTreeVector > svg > defs');
        if (svgDefs) {
            const parser = new DOMParser();
            const filterString = `
    <filter id="outline">
      <feMorphology in="SourceAlpha" result="expanded" operator="dilate" radius="1"/>
      <feFlood flood-color="lightgray"/>
      <feComposite in2="expanded" operator="in"/>
      <feComposite in="SourceGraphic"/>
    </filter>
  `;
            const filterElement = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${filterString}</svg>`, 'image/svg+xml').querySelector('filter');
            svgDefs.appendChild(filterElement);
        }
    }

    // Wait for the SVG node to become available, with retries
    async function waitForTreeNode(maxRetries = 8, delayMs = 400) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const treeNode = document.querySelector('#NewTreeVector > svg > g');
            if (treeNode) return treeNode;
            await sleep(delayMs);
        }
        return null;
    }

    // Each time the observer detects a change it will re-queue the visible nodes
    const observer = new MutationObserver(() => {
        queue.length = 0;
        addAllFlags();
    });

    // Start of the script
    (async function init() {
        const treeNode = await waitForTreeNode();
        if (!treeNode) {
            console.warn('MyHeritage flag injector: SVG tree not found after retries.');
            return;
        }

        appendOutlineFilter();
        observer.observe(treeNode, { childList: true, subtree: false });
        addAllFlags();
    })();
})();
