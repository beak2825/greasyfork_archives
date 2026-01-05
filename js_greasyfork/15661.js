// ==UserScript==
// @name            WME Zoom Level
// @namespace       https://greasyfork.org/users/11629-TheLastTaterTot
// @version         0.2.4
// @description     Places a numeric zoom level indicator on top of the WME zoom slider.
// @author          TheLastTaterTot
// @include         https://editor-beta.waze.com/*editor/*
// @include         https://www.waze.com/*editor/*
// @exclude         https://www.waze.com/*user/editor/*
// @grant           none
// @icon            data:image/png;base64,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
// @run-at          document-body
// @downloadURL https://update.greasyfork.org/scripts/15661/WME%20Zoom%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/15661/WME%20Zoom%20Level.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
var updateZoom = function () {
    document.getElementById("zoomIndicator").innerHTML = Waze.map.zoom;
};

var ZoomLevelIndicator = function () {
    var zoomSlider = document.getElementsByClassName("slider")[0],
        insertZoom = document.createElement('span');

    insertZoom.style.position = "relative";
    insertZoom.style.top = "-5px";
    insertZoom.style.width = "100%";
    insertZoom.style.display = "inline-block";
    insertZoom.style.alignContent = "center";
    insertZoom.style.verticalAlign = "middle";
    insertZoom.style.lineHeight = "14px";
    insertZoom.innerHTML =
        '<div id="zoomIndicator" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); ' +
        'background: rgba(0,0,0,.5); border-radius: 100%; border: 2px solid #FFF; box-shadow: 0px 0px 5px #888; ' +
        'margin: 0; padding: auto; width: 25px; height: 25px; vertical-align: middle; text-align: center; ' +
        'color: #FFF; font-weight: bold; font-size: 14px; line-height: 22px;">#</div>';
    zoomSlider.appendChild(insertZoom);

    updateZoom();

    Waze.map.events.register("zoomend", Waze.map, updateZoom);
};

var waitCount = 0,
    maxWait = 60; //60 seconds

var tryInit_WMEZL = function () {
    try {
        if ("undefined" !== typeof Waze && Waze.map && Waze.map.zoom &&
                Waze.map.events && Waze.map.events.register &&
                document.getElementsByClassName("slider")) {
            ZoomLevelIndicator();
        } else if (waitCount++ < maxWait) {
            setTimeout(tryInit_WMEZL, 1000);
        } else {
            console.error('WMEZL:',
                'Zoom Level Indicator could not find necessary Waze map objects.');
        }
    } catch (err) {
        console.error(
            'WMEZL:',
            'WME Zoom Level Indicator failed to load due to some kind of technical script error. :(');
        console.error(err);
    }
};

tryInit_WMEZL();
