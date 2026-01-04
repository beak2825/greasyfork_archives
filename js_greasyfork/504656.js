// ==UserScript==
// @name 			WME-MapLinks
// @description 	Adds links to other maps
// @namespace 		http://tampermonkey.net/
// @author          Robin Breman | L4 Waze NL | @robbre | https://github.com/RobinBreman/WME-MapLinks
// @match           *://*.waze.com/*editor*
// @exclude         *://*.waze.com/user/editor*
// @grant 			none
// @require         https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.8.0/proj4.js
// @version 		1.3.2
// @downloadURL https://update.greasyfork.org/scripts/504656/WME-MapLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/504656/WME-MapLinks.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const version = '1.3.1';

    const mapLinksRegistry = [
        {
            id: 'BAG',
            icon: 'https://www.kadaster.nl/favicon.ico',
            title: 'BAG',
            handler: gotoBAGViewer
        },
        {
            id: 'George',
            icon: 'https://wegkenmerken.staging.ndw.nu/favicon.ico',
            title: 'George',
            handler: gotoGeorge
        },
        {
            id: 'GoogleMaps',
            icon: 'https://www.google.com/favicon.ico',
            title: 'Google Maps',
            handler: gotoGoogleMaps
        },
        {
            id: 'MatrixNL',
            icon: 'https://matrixnl.nl/favicon.ico',
            title: 'MatrixNL',
            handler: gotoMatrixNL
        },
        {
            id: 'Mapillary',
            icon: 'https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/tMT3WIParw8.png',
            title: 'Mapillary',
            handler: gotoMapillary
        },
        {
            id: 'Melvin',
            icon: 'https://melvin.ndw.nu/assets/icon/favicon-32.png',
            title: 'Melvin',
            handler: gotoMelvin
        },
        {
            id: 'NDW',
            icon: 'https://www.arcgis.com/favicon.ico',
            title: 'NDW',
            handler: gotoNDW
        },
        {
            id: 'Omgevingswet',
            icon: 'https://omgevingswet.overheid.nl/favicon.ico',
            title: 'Omgevingswet',
            handler: gotoOmgevingswet
        },
        {
            id: 'Satellietdataportaal',
            icon: 'https://www.satellietdataportaal.nl/favicon.ico',
            title: 'Satellietdataportaal',
            handler: gotoSDP
        },
        {
            id: 'Wegstatus',
            icon: 'https://www.wegstatus.nl/favicon.ico',
            title: 'Wegstatus',
            handler: gotoWegstatus
        }
    ];

    function wmescript_bootstrap() {
        const wazeapi = window.W;
        if (!wazeapi || !wazeapi.map) {
            setTimeout(wmescript_bootstrap, 1000);
            return;
        }
        addMapLinks();
    }

    function addMapLinks() {
        const buttonHTML = $(`
            <style>
                #WMEMapLinksButtons img { height: 50%; }
            </style>
            <div id='MapLinksDiv'>
                <div id='WMEMapLinksButtons'></div>
            </div>
        `);

        $('.secondary-toolbar').prepend(buttonHTML);

        mapLinksRegistry.forEach(linkItem => {
            const btn = $(`
                <button id='WMEMapLinksButton_${linkItem.id}' title='${linkItem.title}'>
                    <img src='${linkItem.icon}'>
                </button>
            `);
            btn.click(linkItem.handler);
            $('#WMEMapLinksButtons').append(btn);
        });
    }

    function getMapCoordinates() {
        const pl = $('.permalink')[0]?.href || '';
        const latMatch = pl.match(/lat=([0-9]+\.[0-9]+)/);
        const lonMatch = pl.match(/lon=([0-9]+\.[0-9]+)/);
        return {
            y: latMatch ? parseFloat(latMatch[1]) : 0,
            x: lonMatch ? parseFloat(lonMatch[1]) : 0
        };
    }

    function getMapZoomlevel() {
        const pl = $('.permalink')[0]?.href || '';
        const zoomMatch = pl.match(/zoomLevel=([0-9]+)/);
        return zoomMatch ? parseFloat(zoomMatch[1]) : 14;
    }

    function gotoMelvin() {
        const coords = getMapCoordinates();
        const url = `https://melvin.ndw.nu/public?sw=${coords.y},${coords.x}&ne=${coords.y},${coords.x}`;
        window.open(url, '_blank');
    }

    function gotoOmgevingswet() {
        const coords = getMapCoordinates();
        const url = `https://omgevingswet.overheid.nl/regels-op-de-kaart/documenten?regelsandere=regels&locatie-stelsel=ETRS89&locatie-x=${coords.x}&locatie-y=${coords.y}`;
        window.open(url, '_blank');
    }

    function gotoBAGViewer() {
        proj4.defs(
            'EPSG:28992',
            '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.2369,50.0087,465.658,0.406857330322398,0.350732676542563,-1.87034738360657,4.0812 +units=m +no_defs'
        );
        const coords = getMapCoordinates();
        const rdCoords = proj4('EPSG:4326', 'EPSG:28992', [coords.x, coords.y]);
        const url = `https://bagviewer.kadaster.nl/lvbag/bag-viewer/?theme=BRT+Achtergrond&geometry.x=${rdCoords[0]}&geometry.y=${rdCoords[1]}&zoomlevel=13.776830703977048`;
        window.open(url, '_blank');
    }

    function gotoMapillary() {
        const coords = getMapCoordinates();
        const zoom = getMapZoomlevel();
        const url = `https://www.mapillary.com/app/?lat=${coords.y}&lng=${coords.x}&z=${zoom}`;
        window.open(url, '_blank');
    }

    function gotoSDP() {
        const coords = getMapCoordinates();
        const zoom = getMapZoomlevel();
        const url = `https://viewer.satellietdataportaal.nl/@${coords.y},${coords.x},${zoom}`;
        window.open(url, '_blank');
    }

    function gotoWegstatus() {
        const coords = getMapCoordinates();
        const lat = coords.y.toString().replace('.', 'd');
        const lon = coords.x.toString().replace('.', 'd');
        const url = `https://www.wegstatus.nl/dashboardnl_old/lat=${lat}%7Clon=${lon}`;
        window.open(url, '_blank');
    }

    function gotoGeorge() {
        const coords = getMapCoordinates();
        const url = `https://wegkenmerken.staging.ndw.nu/verkeersborden?identifier=1,${coords.x},${coords.y}`;
        window.open(url, '_blank');
    }

    function gotoNDW() {
        const coords = getMapCoordinates();
        const url = `https://www.arcgis.com/apps/instant/interactivelegend/index.html?appid=d9382ea7bf574c4ba2d5a740469c504f&center=${coords.x},${coords.y}`;
        window.open(url, '_blank');
    }

    function gotoGoogleMaps() {
        const coords = getMapCoordinates();
        const zoom = getMapZoomlevel();
        const url = `https://www.google.com/maps/@${coords.y},${coords.x},${zoom}z`;
        window.open(url, '_blank');
    }

    function gotoMatrixNL() {
        const coords = getMapCoordinates();
        const zoom = getMapZoomlevel();
        const url = `https://matrixnl.nl/index.php?center=${coords.y},${coords.x}&zoom=${zoom}`;
        window.open(url, '_blank');
    }

    setTimeout(wmescript_bootstrap, 5000);
})();
