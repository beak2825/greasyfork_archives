// ==UserScript==
// @name         WME KYTC Lookup
// @namespace
// @version      2020.07.21.002
// @description  Look up KY road info from KYTC.  Mouse over a road and hit 'ALT+k'.
// @author       MapOMatic
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// eslint-disable-next-line max-len
// @icon         data:image/png;base64,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
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/20058/WME%20KYTC%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/20058/WME%20KYTC%20Lookup.meta.js
// ==/UserScript==

/* global W */
/* global $ */
/* global WazeWrap */

function log(message) {
    console.log('KYTC Lookup:', message);
}
function logDebug(message) {
    console.debug('KYTC Lookup:', message);
}

function processKYTCRouteInfo(routeInfos) {
    $('#kytc-button').text('KYTC').css('color', 'blue');
    if (routeInfos.RouteInfos.length > 0) {
        const routeInfo = routeInfos.RouteInfos[0];
        const match = routeInfo.RTUnique.match(/\d+-(.*-\d+)\s+/);
        const number = (match && match.length) > 1 ? match[1] : routeInfo.RTUnique;
        WazeWrap.Alerts.info(null,
            $('<table>').append(
                [
                    ['NUMBER:', number],
                    ['NAME:', routeInfo.Routename],
                    ['COUNTY:', routeInfo.CountyName],
                    ['DISTRICT:', routeInfo.District],
                    ['MILE POINT:', routeInfo.MilePoint],
                    ['GOV LEVEL:', routeInfo.GovLevelValue],
                    ['FC:', routeInfo.FunctionalClass],
                    ['POSTED SL:', routeInfo.PostedSpeedLimit]
                ].map(itm => $('<tr>').append(
                    $('<td class="kytc-lookup-row-header">').text(itm[0]),
                    $('<td>').text(itm[1])
                ))
            ).prop('outerHTML'), true);
    } else {
        WazeWrap.Alerts.error(null, 'No road found at this location.  Try again, or click the KYTC button in the footer to open the KYTC map.');
    }
}

async function processKYTCCoords(coordsIn) {
    const jsonCoords = coordsIn;
    const searchRadius = W.map.zoom <= 6 ? 640 / (W.map.zoom ** 2) : 10;
    const url = `https://maps.kytc.ky.gov/arcgis/rest/services/MeasuredRoute/MapServer/exts/KYTCGISREST/GetRouteInfo?X=${
        jsonCoords.geometries[0].x}&Y=${jsonCoords.geometries[0].y}&SearchRadius=${searchRadius}&f=json`;
    const routes = await $.getJSON(url);
    processKYTCRouteInfo(routes);
}

async function checkKeyDown(e) {
    if (e.keyCode === 75 && e.altKey) {
        $('#kytc-button').text('KYTC...').css('color', 'gray');
        const mousePosition = $('.mouse-position').text().split(' ');
        logDebug(`looking up road at coordinate ${mousePosition}`);
        const url = `https://kygisserver.ky.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer/project?inSR=4326&outSR=102763&geometries=${
            mousePosition[0]}%2C${mousePosition[1]}&transformation=&transformForward=true&f=json`;
        logDebug(url);
        const coords = await $.getJSON(url);
        processKYTCCoords(coords);
    }
}

async function kytcButtonClick() {
    const wazeExt = W.map.getExtent();
    // let url = `https://maps.kytc.ky.gov/arcgis/rest/services/Utilities/Geometry/GeometryServer/project?inSR=3857&outSR=102763&geometries=${
    //     wazeExt.left}%2C${wazeExt.bottom}%2C${wazeExt.right}%2C${wazeExt.top}&transformation=&transformForward=true&f=json`;
    // logDebug(url);
    // const result = await $.getJSON(url);
    // const pts = result.geometries;
    const url = `https://maps.kytc.ky.gov/functionalclass/?xmin=${wazeExt.left}&ymin=${wazeExt.bottom}&xmax=${wazeExt.right}&ymax=${wazeExt.top}`;
    logDebug(url);
    window.open(url, '_blank');
}

function init() {
    $('.WazeControlPermalink').prepend(
        $('<div>').css({ float: 'left', dispaly: 'inline-block', padding: '0px 5px 0px 3px' }).append(
            $('<a>', { id: 'kytc-button', title: 'Open the KYTC map in a new window' })
                // eslint-disable-next-line no-script-url
                .text('KYTC').attr('href', 'javascript:void(0)')
                .css({
                    float: 'left', textDecoration: 'none', color: 'blue', fontWeight: 'bold'
                })
                .click(kytcButtonClick)
        )
    );

    $('head').append([
        '<style type="text/css">',
        '.kytc-lookup-row-header { padding-right: 5px; }',
        '</style>'
    ].join(' '));


    /* Event listeners */
    W.loginManager.events.register('afterloginchanged', this, init);
    document.addEventListener('keydown', checkKeyDown, false);

    log('Initialized.');
}

function bootstrap() {
    if (W && W.loginManager
        && W.loginManager.events.register
        && W.map) {
        log('Initializing...');
        init();
    } else {
        log('Bootstrap failed. Trying again...');
        window.setTimeout(bootstrap, 1000);
    }
}

log('Bootstrap...');
bootstrap();
