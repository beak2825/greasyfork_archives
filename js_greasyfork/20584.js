// ==UserScript==
// @name         WME KY 511 Lookup
// @namespace    https://greasyfork.org/users/45389
// @version      0.2
// @description  Click link in WME footer to open KY 511 map at the same location.
// @author       MapOMatic
// @license      GNU GPLv3
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @grant        none
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/20584/WME%20KY%20511%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/20584/WME%20KY%20511%20Lookup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var alertUpdate = true;
    var debugLevel = 0;
    var ky511LookupVersion = "0.1";
    var ky511LookupChanges = "WME KY 511 Lookup\nv" + ky511LookupVersion + "\n\nWhat's New\n------------------------------";
    ky511LookupChanges += '\n- Add a link for KY 511 in the WME footer.';

    function log(message, level) {
        if (message && level <= debugLevel) {
            console.log('KY 511 Lookup: ' + message);
        }
    }
    function ky511Button_click() {
        var wazeExt = W.map.getExtent();
        var topLeft = new OL.LonLat(wazeExt.left, wazeExt.top);
        var bottomRight = new OL.LonLat(wazeExt.right, wazeExt.bottom);
        topLeft.transform('EPSG:900913','EPSG:4326');
        bottomRight.transform('EPSG:900913','EPSG:4326');
        var url = 'http://511.ky.gov/kyhb/#roadReports/area/';
        url += 'minLat=' + bottomRight.lat + '/';
        url += 'minLon=' + topLeft.lon + '/';
        url += 'maxLat=' + topLeft.lat + '/';
        url += 'maxLon=' + bottomRight.lon + '/';
        url += 'placeSearchAllowed=true?timeFrame=TODAY&layers=allReports%2CroadReports%2CwazeReports%2CwinterDriving%2CweatherWarnings';
        console.log(url);
        window.open(url, '_blank');
    }

    function init() {
        'use strict';

        /* Check version and alert on update */
        if (alertUpdate && ('undefined' === window.localStorage.ky511LookupVersion ||
                            ky511LookupVersion !== window.localStorage.ky511LookupVersion)) {
            alert(ky511LookupChanges);
            window.localStorage.ky511LookupVersion = ky511LookupVersion;
        }

        $('.WazeControlPermalink').prepend(
            $('<div>').css({float:'left',dispaly:'inline-block', padding:'0px 5px 0px 3px'}).append(
                $('<a>',{id:'ky511-button',title:'Open the KY 511 map in a new window'}).text('KY 511').attr('href','javascript:void(0)').css({float:'left',textDecoration:'none', color:'darkred', fontWeight:'bold'}).click(ky511Button_click)
            )
        );

        log('Initialized.', 0);
    }

    function bootstrap() {
        if (W && W.loginManager &&
            W.loginManager.events.register &&
            W.map) {
            log('Initializing...', 0);
            init();
        } else {
            log('Bootstrap failed. Trying again...', 0);
            window.setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    log('Bootstrap...', 0);
    bootstrap();
})();