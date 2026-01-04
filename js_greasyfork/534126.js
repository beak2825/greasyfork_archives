// ==UserScript==
// @name         AllTrails KML Exporter
// @namespace    http://tampermonkey.net/
// @version      2025-05-04
// @description  This script adds a "Download KML" button to any trail on AllTrails.com, or the explorer view. In the explorer view it will download the KML for all trails currently showing. KML can be imported into Google Maps and other mapping programs.
// @match        https://www.alltrails.com/trail/*
// @match        https://www.alltrails.com/explore*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/mapbox-polyline/1.1.1/polyline.min.js
// @connect      alltrails.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/534126/AllTrails%20KML%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/534126/AllTrails%20KML%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractBoundingBoxFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const b_br_lat = parseFloat(urlParams.get("b_br_lat"));
        const b_br_lng = parseFloat(urlParams.get("b_br_lng"));
        const b_tl_lat = parseFloat(urlParams.get("b_tl_lat"));
        const b_tl_lng = parseFloat(urlParams.get("b_tl_lng"));

        if ([b_br_lat, b_br_lng, b_tl_lat, b_tl_lng].some(isNaN)) return null;

        return {
            topLeft: { lat: b_tl_lat, lng: b_tl_lng },
            bottomRight: { lat: b_br_lat, lng: b_br_lng },
        };
    }

    async function fetchSearchResults(location) {
        const body = {
            filters: {},
            location: {
                mapRotation: 0,
                ...location
            },
            recordTypesToReturn: ["trail"],
            sort: "best_match",
            recordAttributesToRetrieve: ["ID", "name", "slug"],
            resultsToInclude: ["searchResults"]
        };

        const response = await fetch("https://www.alltrails.com/api/alltrails/explore/v1/search?", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return data.searchResults || [];
    }

    function fetchTrailData(trailSlug){
        return new Promise((resolve, reject) => {
            const mapUrl = `https://www.alltrails.com/${trailSlug}`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: mapUrl,
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: reject
            });
        });
    }

    function extractTrailDetails(trailHTML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(trailHTML, 'text/html');
        const details = {
            length: '',
            elevation: '',
            time: '',
            type: ''
        };

        const statBlocks = doc.querySelectorAll('.TrailStats_stat__O2GvM');

        statBlocks.forEach(stat => {
            const labelEl = stat.querySelector('.TrailStats_statLabel__vKMLy');
            const valueEl = stat.querySelector('.TrailStats_statValueSm__HlKIU');

            if (!labelEl) return;

            const label = labelEl.textContent.trim().toLowerCase();

            if (label.includes('length')) {
                details.length = valueEl?.textContent.trim() || '';
            } else if (label.includes('elevation')) {
                details.elevation = valueEl?.textContent.trim() || '';
            } else if (label.includes('estimated time')) {
                details.time = valueEl?.textContent.trim() || '';
            } else if (label.match(/loop|out.*back|point.*point/i)) {
                details.type = labelEl.textContent.trim();
            }
        });

        // If type still empty, try to grab from last stat label if it's a standalone type
        if (!details.type) {
            statBlocks.forEach(stat => {
                const labelEl = stat.querySelector('.TrailStats_statLabel__vKMLy');
                if (labelEl && ['loop', 'out & back', 'point to point'].includes(labelEl.textContent.trim().toLowerCase())) {
                    details.type = labelEl.textContent.trim();
                }
            });
        }

        // Extract difficulty
        const difficultyEl = doc.querySelector('[data-testid="trail-difficulty"]');
        if (difficultyEl) {
            details.difficulty = difficultyEl.textContent.trim();
        }
        return details;
    }

    function fetchTrailMapData(trailSlug) {
        return new Promise((resolve, reject) => {
            const mapSlug = trailSlug.replace('trail/', 'explore/trail/');
            const mapUrl = `https://www.alltrails.com/${mapSlug}?mobileMap=false&initFlyover=true&flyoverReturnToTrail`;

            GM_xmlhttpRequest({
                method: 'GET',
                url: mapUrl,
                onload: function (response) {
                    const html = response.responseText;
                    const match = html.match(/<div data-react-class="SearchApp" data-react-props="({.+?})"/);
                    if (match && match[1]) {
                        try {
                            const props = JSON.parse(match[1].replace(/&quot;/g, '"'));
                            resolve({ slug: trailSlug, data: props.initialExploreMap });
                        } catch (e) {
                            console.error(`Failed to parse JSON for ${trailSlug}`, e);
                            reject(e);
                        }
                    } else {
                        console.error(`No map data found for ${trailSlug}`);
                        reject();
                    }
                },
                onerror: reject
            });
        });
    }

    function generateKML(trailMaps,location) {
        let kml = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n`;

        trailMaps.forEach(({ slug, map, details }) => {
            const name = map.name;
            const waypoints = map.waypoints || [];
            const routes = map.routes || [];

            const description = `
            Difficulty: ${details.difficulty || 'N/A'}<br/>
            Length: ${details.length || 'N/A'}<br/>
            Elevation Gain: ${details.elevation || 'N/A'}<br/>
            Estimated Time: ${details.time || 'N/A'}<br/>
            Type: ${details.type || 'N/A'}<br/><br/>
            https://alltrails.com/${slug}
        `.trim();

            routes.forEach(route => {
                route.lineSegments.forEach(segment => {
                    const points = segment.polyline.pointsData;
                    if (typeof points === 'string') {
                        const decoded = polyline.decode(points);
                        const coords = decoded.map(p => `${p[1]},${p[0]},0`).join(' ');
                        kml += `
                        <Placemark>
                            <name>${name}</name>
                            <Style>
                              <IconStyle>
                                <scale>1</scale>
                                <Icon>
                                  <href>https://maps.google.com/mapfiles/kml/paddle/grn-blank.png</href>
                                </Icon>
                              </IconStyle>
                             </Style>
                            <description><![CDATA[${description}]]></description>
                            <LineString><coordinates>${coords}</coordinates></LineString>
                        </Placemark>
                    `;
                    }
                });
            });

            waypoints.forEach(waypoint => {
                kml += `
                <Placemark>
                <name>${waypoint.name}</name>
                <Style>
                 <IconStyle>
                   <scale>1</scale>
                   <Icon>
                    <href>https://maps.google.com/mapfiles/kml/paddle/ylw-blank.png</href>
                   </Icon>
                 </IconStyle>
                </Style>
                <Point>
                    <coordinates>${waypoint.location.longitude},${waypoint.location.latitude},0</coordinates>
                </Point>
                <description><![CDATA[${waypoint.description || ''}]]></description>
            </Placemark>
            `;
            });
        });

        kml += `</Document>\n</kml>`;

        const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateKMLDownloadName(trailMaps, location);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    function generateKMLDownloadName(trailMaps, location){
        if(trailMaps.length === 1 ){
            return `${trailMaps[0].slug.split('/').pop()}.kml`
        } else {
            return `alltrails_trails_${location.topLeft.lat}_${location.topLeft.lng}.kml`;
        }
    }
    function isIndividualTrail(){
        return (document.location.pathname.startsWith('/trail'));
    }

    function createKMLButton() {
        const button = document.createElement('button');
        button.textContent = `Download ${((isIndividualTrail())?'':'All ')}KML`;
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 15px';
        button.style.background = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';

        button.onclick = async () => {
            button.textContent = `Fetching trail${((isIndividualTrail())?'':'s')}...`;
            try {
                const slugs = [];
                let location = null;
                if(isIndividualTrail()){
                    slugs.push(document.location.pathname);
                } else {
                    location = extractBoundingBoxFromURL();
                    if (!location) return alert("Invalid map bounding box.");
                    const trails = await fetchSearchResults(location);
                    trails.map(t => slugs.push(t.slug));
                }

                const trailData = await Promise.allSettled(slugs.map(async (slug) => {
                    const [map, html] = await Promise.all([
                        fetchTrailMapData(slug),
                        fetchTrailData(slug)
                    ]);
                    const details = extractTrailDetails(html);
                    return {
                        slug,
                        map: map.data,
                        details
                    };
                }));

                const successful = trailData
                .filter(r => r.status === 'fulfilled')
                .map(r => r.value);

                generateKML(successful, location);
                button.textContent = `Download ${((isIndividualTrail())?'':'All ')}KML`;
            } catch (err) {
                console.error("Failed to process trails:", err);
                alert("Something went wrong.");
                button.textContent = `Download ${((isIndividualTrail())?'':'All ')}KML`;
            }
        };

        document.body.appendChild(button);
    }

    window.addEventListener("load", createKMLButton);
})();
