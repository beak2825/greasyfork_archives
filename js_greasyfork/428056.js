// ==UserScript==
// @name        OpenStreetMap on rent.591.com.tw
// @namespace   https://github.com/gslin/openstreetmap-on-rent.591.com.tw
// @match       https://rent.591.com.tw/home/*
// @grant       GM_xmlhttpRequest
// @version     0.20210901.0
// @author      Gea-Suan Lin <gslin@gslin.com>
// @description Embed OpenStreetMap on rent.591.com.tw.
// @require     https://unpkg.com/leaflet@1.7.1/dist/leaflet.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/428056/OpenStreetMap%20on%20rent591comtw.user.js
// @updateURL https://update.greasyfork.org/scripts/428056/OpenStreetMap%20on%20rent591comtw.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const icon = L.icon({iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png'});

    let sem = 0;
    let ob = new window.MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (sem > 0) {
                    return;
                }

                let addr_el = document.querySelector('div.address * + span');
                if (!addr_el) {
                    return;
                }

                // Uninstall
                ob.disconnect();
                sem++;

                let addr = addr_el.innerText;

                let url = 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(addr) + '&format=json';
                GM_xmlhttpRequest({
                    headers: {
                        'User-Agent': 'OpenStreetMapOnRent591ComTw/' + GM_info.script.version + ' (https://github.com/gslin/openstreetmap-on-rent.591.com.tw)',
                    },
                    method: 'GET',
                    onload: res => {
                        let r = JSON.parse(res.responseText);
                        let r0 = r[0];

                        // leaflet css
                        let leaflet_css_el = document.createElement('link');
                        leaflet_css_el.setAttribute('href', 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css');
                        leaflet_css_el.setAttribute('rel', 'stylesheet');
                        document.getElementsByTagName('head')[0].appendChild(leaflet_css_el);

                        // Handle z-index issue.
                        let custom_css_el = document.createElement('style');
                        custom_css_el.setAttribute('type', 'text/css');
                        custom_css_el.innerHTML = '.leaflet-pane{z-index:1;} .leaflet-control,.leaflet-bottom.leaflet-right{z-index:2}';
                        document.getElementsByTagName('head')[0].appendChild(custom_css_el);

                        // leaflet map element
                        let map_el = document.createElement('div');
                        map_el.setAttribute('style', 'height: 400px; width: 800px;');
                        addr_el.parentElement.insertAdjacentElement('afterend', map_el);

                        let map = L.map(map_el).setView([r0.lat, r0.lon], 17);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                        L.marker([r0.lat, r0.lon], {icon: icon}).addTo(map);
                    },
                    url: url,
                });
            });
        });
    });

    ob.observe(document, {
        childList: true,
        subtree: true,
    });
})();
