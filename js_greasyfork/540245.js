// ==UserScript==
// @name         Inara Elite Dangerous Station Popover
// @namespace    moonbeeper's greasy scripts
// @match        https://inara.cz/elite/*
// @grant        GM_xmlhttpRequest
// @version      1.0
// @author       moonbeeper
// @description  Show a popover with station info when hovering over station links
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540245/Inara%20Elite%20Dangerous%20Station%20Popover.user.js
// @updateURL https://update.greasyfork.org/scripts/540245/Inara%20Elite%20Dangerous%20Station%20Popover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bgColor = '#2a2a2a';
    const popover = document.createElement('div');
    popover.style.cssText = `
        position: absolute;
        background: ${bgColor};
        padding: 12px;
        border-radius: 3px;
        box-shadow: 5px 5px 10px 0px rgba(0,0,0,.05);
        max-width: 300px;
        z-index: 99999999999999999999999999999999999999999999; // yup, that's enough
        display: none;
        pointer-events: none;
        border: 1px solid #3a3a3a;
    `;

    const arrow = document.createElement('div');
    arrow.id = 'greasty-inara-arrow';

    function getArrow(pointingUp) {
        let arrow = popover.querySelector('#greasty-inara-arrow');
        if (!arrow) {
            const arrow = document.createElement('div');
            arrow.id = 'greasty-inara-arrow';
            popover.appendChild(newArrow);
            arrow = newArrow;
        }

        if (pointingUp) {
            arrow.style.cssText = `
                position: absolute;
                top: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-bottom: 6px solid ${bgColor};
            `;
            console.log('arrow pointing up');
        } else {
            arrow.style.cssText = `
                position: absolute;
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid ${bgColor};
            `;
            console.log('arrow pointing down');
        }
    }

    popover.appendChild(arrow);
    document.body.appendChild(popover);

    function getStationId(href) {
        const match = href.match(/\/elite\/station(?:-market)?\/(\d+)\//);
        return match ? match[1] : null;
    }

    async function showPopover2(stationId, link) {
        popover.innerHTML = `
        <div style="margin-bottom: 8px; font-weight: bold;">Fetching station data...</div>
        <div style="font-size: 12px; opacity: 0.8;">Station ID: ${stationId}</div>
        ` + arrow.outerHTML;

        requestAnimationFrame(() => positionPopover(link));
        try {
            const data = await fetchStationData(stationId);
            if (!data) {
                console.warn(`No data found for station ID ${stationId}`);
                throw new Error(`No data found for station ID ${stationId}`);
            }

            let servicesHtml = '';
            // not really possible to have no services, but just in case :)
            if (data.services.length > 0) {
                const displayServices = data.services.slice(0, 8); // show first 8
                const remainingCount = data.services.length - 8;

                servicesHtml = `
                ${itemPar('Station Services', '')}
                <div class="tagcontainer">
                    ${displayServices.map(service =>
                        `<span class="tag taginline minor nowrap">${service}</span>`
                    ).join('')}
                    ${remainingCount > 0 ? `<span style="font-size: 11px; color: #a0a09e;">+${remainingCount} more</span>` : ''}
                </div>
                `;
            }

            popover.innerHTML = `
            <div style="margin-bottom: 8px;">
                ${/*itemPar('Station Name', data.name)*/ ''}
                ${itemPar('System', data.system)}
                ${itemPar('Station Type', data.stationType)}
                ${itemPar('Landing Pad', data.landingPad)}
                ${itemPar('Allegiance', data.allegiance)}
                ${itemPar('Minor Faction', data.faction)}
                ${itemPar('Last Update', data.lastUpdate)}
                ${servicesHtml}
            </div>
            <div style="font-size: 12px; opacity: 0.8;">Station ID: ${stationId}</div>
            ` + arrow.outerHTML;

            requestAnimationFrame(() => positionPopover(link));
        } catch (error) {
            console.error('Error fetching station data:', error);
            popover.innerHTML = `
            <div style="margin-bottom: 8px; color: #f54040; font-weight: bold;">Error fetching station data</div>
            <div style="font-size: 12px; opacity: 0.8;">Station ID: ${stationId}</div>
            ` + arrow.outerHTML;

            requestAnimationFrame(() => positionPopover(link));
        }

    }

    function itemPar(label, value) {
        if (!value) {
            return '';
        }

        return `
        <div class="itempaircontainer">
            <div class="itempairlabel" style="width: 150px;">${label}</div>
            <div class="itempairvalue">${value}</div>
        </div>
        `
    }

    function positionPopover(link) {
        const linkBoundingBox = link.getBoundingClientRect();
        const popoverBoundingBox = popover.getBoundingClientRect();

        let top = linkBoundingBox.top + window.scrollY - popoverBoundingBox.height - 8;
        let left = linkBoundingBox.left + window.scrollX + (linkBoundingBox.width / 2) - (popoverBoundingBox.width / 2);

        // if the a tag is too close to the edge, move it to the right
        if (left < 10) {
            left = 10;
        }

        // if there's not enough space above, position below
        if (linkBoundingBox.top < popoverBoundingBox.height + 20) {
            top = linkBoundingBox.bottom + window.scrollY + 8;
            getArrow(true);
        } else {
            getArrow(false);
        }
        popover.style.left = left + 'px';
        popover.style.top = top + 'px';
    }

    const stationFetchCache = new Map();
    async function fetchStationData(stationId) {
        if (stationFetchCache.has(stationId)) {
            return stationFetchCache.get(stationId);
        }

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://inara.cz/elite/station/${stationId}/`,
                onload: function(response) {
                    if (response.status === 200) {
                        const stationData = parseStationData(response.responseText);
                        stationFetchCache.set(stationId, stationData);
                        resolve(stationData);
                    } else {
                        resolve(null);
                    }
                },
                onerror: function() {
                    resolve(null);
                }
            });
        });
    }

    function parseStationData(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const data = {
            name: '',
            system: '',
            stationType: '',
            landingPad: '',
            services: [],
            allegiance: '',
            faction: '',
            lastUpdate: ''
        };

        try {
            const getTextContent = (element) => element?.textContent?.trim() || '';

            // get station name
            const stationNameElement = doc.querySelector('h2 a.standardcolor');
            data.name = getTextContent(stationNameElement);

            // get system name
            const systemElement = doc.querySelector('h2 a[href*="/elite/starsystem/"]');
            data.system = getTextContent(systemElement);

            // get basic station info from the mini grid below the station name
            const itemPairs = doc.querySelectorAll('.itempaircontainer');
            console.log('itemPairs', itemPairs);

            const labelMap = {
                'Landing pad': 'landingPad',
                'Station type': 'stationType',
                'Allegiance': 'allegiance',
                'Minor faction': 'faction',
                'Station update': 'lastUpdate'
            };
            itemPairs.forEach(pair => {
                const label = pair.querySelector('.itempairlabel');
                const value = pair.querySelector('.itempairvalue');

                if (label && value) {
                    const labelText = getTextContent(label);
                    const valueText = getTextContent(value);

                    const dataKey = labelMap[labelText];
                    if (dataKey && valueText) {
                        if (dataKey === 'faction') {
                            const factionElement = value.querySelector('a[href*="/elite/minorfaction/"]');
                            if (factionElement) {
                                data[dataKey] = getTextContent(factionElement);
                            }
                        } else {
                            data[dataKey] = valueText;
                        }
                    }
                }
            });

            const tagContainers = doc.querySelectorAll('.tagcontainer');
            const servicesSet = new Set(); // no duplicate services
            console.log('tagContainers', tagContainers);

            tagContainers.forEach(container => {
                const serviceTags = container.querySelectorAll('.tag');
                serviceTags.forEach(tag => {
                    const serviceText = getTextContent(tag);

                    const isGrayedOut = tag.style.opacity === '0.25';
                    if (serviceText &&
                        serviceText.length > 0 &&
                        serviceText.length < 100 &&
                        !isGrayedOut) {
                        servicesSet.add(serviceText);
                    }
                });
            });

            data.services = Array.from(servicesSet);
        } catch (error) {
            console.error('Error parsing station data:', error);
            return {
                name: 'Parse Error',
                system: '',
                stationType: '',
                distance: '',
                landingPad: '',
                services: [],
                economy: '',
                allegiance: '',
                government: '',
                faction: '',
                lastUpdate: ''
            };
        }
        console.log('Parsed station data:', data);
        return data;
    }

    document.addEventListener('mouseover', function(event) {
        const link = event.target.closest('a[href*="/elite/station/"], a[href*="/elite/station-market/"]');

        if (!link) return;

        const stationId = getStationId(link.href);
        console.log('Station ID:', stationId);
        if (!stationId) return;

        showPopover2(stationId, link);
        popover.style.display = 'block';

        requestAnimationFrame(() => positionPopover(link));
    });

    document.addEventListener('mouseout', function(event) {
        const link = event.target.closest('a[href*="/elite/station/"], a[href*="/elite/station-market/"]');
        if (!link) return;

        popover.style.display = 'none';
    });

    document.addEventListener('scroll', function() {
        popover.style.display = 'none';
    });

})();