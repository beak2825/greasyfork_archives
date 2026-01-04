/* eslint-disable max-len */
/* eslint-disable max-classes-per-file */
// ==UserScript==
// @name         WME MT GIS Map
// @namespace    https://greasyfork.org/users/166860
// @version      2025.01.23.00
// @description  Open a MT GIS map in another window, at the same location as the WME map.  Keeps the location of the GIS map synced to WME.
// @author       MapOMatic, MacroNav
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @include     /^https?:\/\/www\.arcgis\.com\/home\/webmap\/viewer\.html\?webmap=27012261362d484db5d24c5046f0ec05.*/
// @license      GNU GPLv3
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js

// @downloadURL https://update.greasyfork.org/scripts/367856/WME%20MT%20GIS%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/367856/WME%20MT%20GIS%20Map.meta.js
// ==/UserScript==

/* global W */
/* global turf */

(function main() {
    'use strict';

    class WMECode {
        static mapWindow;

        static getMercatorMapExtent() {
            const wgs84Extent = W.map.getExtent();
            const wgs84LeftBottom = [wgs84Extent[0], wgs84Extent[1]];
            const wgs84RightTop = [wgs84Extent[2], wgs84Extent[3]];
            const mercatorLeftBottom = turf.toMercator(wgs84LeftBottom);
            const mercatorRightTop = turf.toMercator(wgs84RightTop);
            return [mercatorLeftBottom[0], mercatorLeftBottom[1], mercatorRightTop[0], mercatorRightTop[1]];
        }

        static onButtonClick() {
            const wazeExt = this.getMercatorMapExtent();
            let url = 'http://www.arcgis.com/home/webmap/viewer.html?webmap=27012261362d484db5d24c5046f0ec05&extent=';
            url += `${wazeExt[0]}%2C${wazeExt[1]}%2C${wazeExt[2]}%2C${wazeExt[3]}%2C102113`;
            if (!this.mapWindow || this.mapWindow.closed) {
                this.mapWindow = window.open(null, 'mt_gis_map');
                try {
                    this.mapWindow.location?.assign(url);
                } catch (e) {
                    if (e.code === 18) {
                        // Ignore if accessing location.href is blocked by cross-domain.
                    } else {
                        throw e;
                    }
                }
            }
            this.mapWindow.focus();
            this.postMessage();
        }

        static postMessage() {
            if (this.mapWindow && !this.mapWindow.closed) {
                const extent = this.getMercatorMapExtent();
                this.mapWindow.postMessage({
                    type: 'setExtent',
                    xmin: extent[0],
                    xmax: extent[2],
                    ymin: extent[1],
                    ymax: extent[3]
                }, 'https://www.arcgis.com');
            }
        }

        static init() {
            $('.WazeControlPermalink').prepend(
                $('<div>').css({ float: 'left', display: 'inline-block', padding: '0px 5px 0px 3px' }).append(
                    $('<div>', { id: 'mt-gis-button', title: 'Open the MT GIS map in a new window' })
                        .text('MTGIS')
                        .css({
                            float: 'left', textDecoration: 'none', color: '#000000', fontWeight: 'bold', cursor: 'pointer'
                        })
                        .click(this.onButtonClick.bind(this))
                )
            );

            setInterval(() => {
                const $btn = $('#mt-gis-button');
                if ($btn.length > 0) {
                    $btn.css('color', (this.mapWindow && !this.mapWindow.closed) ? '#1e9d12' : '#000000');
                }
            }, 500);

            /* Event listeners */
            W.map.events.register('moveend', null, this.postMessage.bind(this));
        }

        static bootstrap() {
            if (typeof W === 'object' && W.userscripts?.state.isReady) {
                this.init();
            } else {
                document.addEventListener('wme-ready', this.init.bind(this), { once: true });
            }
        }
    }

    class GISMapCode {
        static Extent;
        static SpatialReference;

        static receiveMessage(message) {
            const { data } = message;
            switch (data.type) {
                case 'setExtent': {
                    const extent = new this.Extent({
                        xmin: data.xmin,
                        xmax: data.xmax,
                        ymin: data.ymin,
                        ymax: data.ymax,
                        spatialReference: new this.SpatialReference({ wkid: 102113 })
                    });
                    unsafeWindow.arcgisonline.map.main.map.setExtent(extent);
                    break;
                }
                default:
                    // Add more types as needed...
            }
        }

        static init() {
            window.addEventListener('message', this.receiveMessage.bind(this));
        }

        static bootstrap() {
            // There may be a more elegant way to check that these modules are ready...
            try {
                this.Extent = unsafeWindow.require('esri/geometry/Extent');
                this.SpatialReference = unsafeWindow.require('esri/SpatialReference');
                this.init();
            } catch {
                setTimeout(this.bootstrap.bind(this), 200);
            }
        }
    }

    function bootstrap() {
        if (window.location.host.toLowerCase() === 'www.arcgis.com') {
            GISMapCode.bootstrap();
        } else {
            WMECode.bootstrap();
        }
    }

    bootstrap();
})();
