// ==UserScript==
// @name            Open WME in EST
// @description     Opens the current Waze Map Editor view in Estonian Land Board Geoportal
// @version         2.0
// @grant           none
// @match           *://*.waze.com/*editor*
// @include         https://xgis.maaamet.ee/maps/*
// @include         https://xgis.maaamet.ee/xgis2/page/app/*
// @require         https://greasyfork.org/scripts/383120-proj4-wazedev/code/proj4-Wazedev.js
// @author          script is based from orignal google maps script, modified by rain101 & LihtsaltMats
// @namespace       https://greasyfork.org/users/207621
// @license         GPLv3
// @downloadURL https://update.greasyfork.org/scripts/371530/Open%20WME%20in%20EST.user.js
// @updateURL https://update.greasyfork.org/scripts/371530/Open%20WME%20in%20EST.meta.js
// ==/UserScript==

/* global proj4 */

console.log("WME_EE BEGINNING");

let wmeSDK;
window.SDK_INITIALIZED.then(() => {
    wmeSDK = getWmeSdk({ scriptId: "open-wme-in-est", scriptName: "Open WME in EST" });
    wmeSDK.Events.once({ eventName: "wme-ready" }).then(init);
});

const ESTONIAN_PROJECTION = '+proj=lcc +lat_1=59.33333333333334 +lat_2=58 +lat_0=57.51755393055556 +lon_0=24 +x_0=500000 +y_0=6375000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
const WGS84 = 'WGS84'

const LANDBOARD = 'LANDBOARD';
const AERIAL = 'AERIAL';

const FLAG_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAMCAYAAABiDJ37AAAArUlEQVQokbXMPQ6CMBxA8X80EMpgcdBRowaMB2NquKKLxEQ08WOCiR4BptLpeYjqS37rk5OpyU1Dbm7BjuaK5ObGzrzYmWegF7lpkKK6s68+7Kt3oA9F9UAO5ZlNWbMtL4FqDuUZUYs1syRjrpZBZklGslghcRwjIj8RRdEfhlprlFKkaRpEKYXWGmnbFmstfd8HsdbSdR3inONXOef+MByGAe890zQF8d4zjiNfdeREmfFbjlgAAAAASUVORK5CYII=';
const PLANE_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAOlJREFUOE+l08EqhFEYxvHfXIHsFNdgPXZyB1Y2GlmOhNIkq+EWpCE7FNmwZINcCKNETZQFxcJCbx01HcPHfGd5znP+73ue9zkVJVcluz+DOg6w8Rd2DhhCEy+4xGkRJAeEfhfL2MQq2r9BArCAI3SScAKjOMQOpvD+EyQA0eotZpMo9k4wiSpqyZeejBDv4QkD+EiqMSzhAnMYx3NGeEArACs4x3UmeOtqfbBH+WGslwGMYC0A+3js4wn32ArAFW7KmLiIY9z1O8bcnwhSA9spUIVB6gZ8Rfk1Tebsv1GexnyZz1RU8Nv5J34QOZVIUV5/AAAAAElFTkSuQmCC'

function gen_url(type) {
    const { lon, lat } = wmeSDK.Map.getMapCenter();

    let zoom = wmeSDK.Map.getZoomLevel(); // Waze zoom levels start from 4 to 22 now

    // Normal Flash Estonian Landboard page
    // return 'http://xgis.maaamet.ee/xGIS/XGis?app_id=UU82&user_id=at&punkt=' + point.x + ',' + point.y + '&moot=4000';

    // HTML5 Estonian Landboard page
    // return 'http://xgis.maaamet.ee/maps/XGis?app_id=UU82A&user_id=at&zlevel=' + zoom + ',' + point.x + ',' + point.y;

    //https://xgis.maaamet.ee/xgis2/page/app/maainfo?punkt=542228.98,6588663.63&moot=2000
    //https://xgis.maaamet.ee/xgis2/page/app/maainfo?punkt=6580101.69,549967.00&moot=100
    if (type === LANDBOARD) {
        const [x, y] = proj4(WGS84, ESTONIAN_PROJECTION, [lon, lat]);
        zoom = zoom - 12; // Waze zoom levels start from 4 to 22 now
        if (zoom < 0) {
            zoom = 0;
        }
        const array = [61440, 30720, 15360, 7680, 3840, 1920, 960, 480, 240, 120, 60];
        return `https://xgis.maaamet.ee/xgis2/page/app/maainfo?punkt=${x},${y}&moot=${array[zoom]}`;
    }
    if (type === AERIAL) {
        zoom = zoom - 4; // seems to keep aerial photo height on WME level
        return `https://fotoladu.maaamet.ee/?basemap=hybriidk&zlevel=${zoom},${lon},${lat}`;
    }
    throw new Error(`Unknown type: ${type}`);
}

function init() {
    const section = document.createElement('div');
    section.style.padding = '8px 16px';

    section.innerHTML = `
        <span id="WMEtoEE" style="display: inline-block;">
            <img src="${FLAG_ICON}" alt="EE" id="WMEtoEEImg" title="Open in Estonian Landboard" style="cursor: pointer; float: left; margin: 2px 5px 0 3px;">
            <img src="${PLANE_ICON}" alt="Aero" id="WMEtoAero" title="Open Aerial Photos" style="cursor: pointer; float: left; margin: 2px 5px 0 3px;">
        </span>
    `;

    const insertPath = '.WazeControlPermalink';
    document.querySelector(insertPath).prepend(section);

    document.getElementById('WMEtoEEImg').addEventListener('click', function () {
        window.open(gen_url(LANDBOARD), '_blank');
    });

    document.getElementById('WMEtoAero').addEventListener('click', function () {
        window.open(gen_url(AERIAL), '_blank');
    });

    console.log("WME_EE done");
}