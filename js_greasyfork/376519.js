// ==UserScript==
// @name         WME Non-Validated Segments Finder
// @namespace    Dude495
// @version      2019.01.09.03
// @description  Identify Non-Verified Segment IDs.
// @author       Dude495
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376519/WME%20Non-Validated%20Segments%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/376519/WME%20Non-Validated%20Segments%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function findSegments() {
        if (W.map.zoom <= 3) {
            alert('Minimum Zoom Lvl 4 Required. Please Zoom In.');
            console.error('Minimum Zoom Lvl 4 Required. Please Zoom In.');
        }
        if (W.map.zoom >= 4) {
            var center = W.map.center.clone().transform(W.map.projection.projCode, W.map.displayProjection.projCode);
            var LON = center.lon;
            var LAT = center.lat;
            var ZOOM = W.map.zoom;
            var ENVL = $('#sidepanel-prefs > div > div > form > div:nth-child(4) > select')[0].value;
            var ENV = $('#env-select > div > select')[0].value;
            var SegList = W.model.segments.additionalInfo;
            console.log('Scanning ' + SegList.length + ' segments..........')
            if (!SegList) {
                alert('No Segments Located.');
                sessionStorage.setItem('Alert', 'NoS')
            };
            if (SegList) {
                let i;
                for (i = 0; i < SegList.length; i++) {
                    if (SegList[i].attributes.validated == false) {
                        console.warn('Segment ID ' + SegList[i].attributes.id + ' not verified! PermaLink Below:');
                        console.log('https://www.waze.com/' + ENVL + '/editor?env=' + ENV + '&lon=' + LON + '&lat=' + LAT + '&zoom=' + ZOOM + '&segments=' + SegList[i].attributes.id);
                        sessionStorage.setItem('Alert', 'Yes')
                        sessionStorage.setItem('SegList', SegList[i]);
                    };
                };
                console.log('Scan Completed.');
            };
            if (sessionStorage.getItem('Alert') == 'Yes') {
                alert('Non-Verified Segments Found! Please open the Developer Console to view details.')
                sessionStorage.removeItem('Alert');
            } else if (!sessionStorage.getItem('SegList')) {
                alert('No Non-Verified Segments Found.');
                sessionStorage.removeItem('Alert');
            } else if (sessionStorage.getItem('Alert') == 'NoS') {
                alert('No Segments Located, Please move the map to another location and try again.');
                sessionStorage.removeItem('Alert');
            };
        };
    };
    function init()
    {
        var $section = $('<div>');
        $section.html([
            '<div id="NVFS-title">',
            '<h3>Non-Validated Segment Finder!</h2>',
            '</div>',
        ].join(' '));
        new WazeWrap.Interface.Tab('NVSF', $section.html());
        var btn = document.createElement("BUTTON");
        btn.id = 'NVFSBtn';
        var Button = document.getElementById('NVFSBtn');
        btn.textContent = 'Activate';
        var Title = document.getElementById('NVFS-title');
        Title.after(btn);
        btn.onclick = function() { findSegments() }
    }

    function initializeSettings()
    {
    }
    function bootstrap() {
        if (W && W.loginManager && W.loginManager.user) {
            init();
            console.log(GM_info.script.name, 'Initialized');
        } else {
            console.log(GM_info.script.name, 'Bootstrap failed.  Trying again...');
            window.setTimeout(() => bootstrap(), 500);
        }
    }
    bootstrap();
})();
