// ==UserScript==
// @name            WME Zoom Level Indicator
// @name:es         WME Indicador de Nivel de Zoom
// @description     Adds a zoom level indicator between plus and minus zoom buttons.
// @description:es  Agrega un indicador de nivel de zoom en medio de los botones de aumentar y disminuir el zoom.

// @namespace       https://greasyfork.org/en/users/670818-edward-navarro
// @version         2022.11.17.01

// @author          EdwardNavarro
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/editor*
// @include         https://beta.waze.com/*/editor*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @grant           none
// @icon            https://www.edwardnavarro.com/cdn/wme/wme_zli_icon.svg
// @run-at          document-body
// @downloadURL https://update.greasyfork.org/scripts/409926/WME%20Zoom%20Level%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/409926/WME%20Zoom%20Level%20Indicator.meta.js
// ==/UserScript==

/* jshint -W097 */
'use strict';

// CREATE THE ZOOM LEVEL INDICATOR CONTAINER AND ADDS A CHILD NODE FOR ZOOM LEVEL NUMBER.
function ZoomLevelIndicator() {
    var zoomBarContainer = document.getElementsByClassName("zoom-bar-container");
    var zoomLevelContainer = document.createElement('div');
    var zoomMinusBtn = document.getElementsByClassName('zoom-minus-button');

    zoomLevelContainer.style.verticalAlign = "middle";
    zoomLevelContainer.style.borderRadius = "0";
    zoomLevelContainer.style.borderTop = "none";
    zoomLevelContainer.style.borderBottom = "none";
    zoomLevelContainer.className = "overlay-button zoom-level-button";

    zoomLevelContainer.innerHTML =
        '<div id="zoom-level-indicator" style="background: rgba(0,0,0,.5); border-radius: 100%; border: 2px solid #FFF; box-shadow: 0px 0px 5px #888; ' +
        'margin: 0; width: 25px; height: 25px; vertical-align: middle; text-align: center; ' +
        'color: #FFF; font-weight: bold; font-size: 14px; line-height: 22px;">#</div>';

    zoomBarContainer[0].insertBefore(zoomLevelContainer, zoomBarContainer[0].lastElementChild);

    updateZoomLevel();

    W.map.events.register("zoomend", W.map, updateZoomLevel);
};

// UPDATE THE ZOOM LEVEL NUMBER.
function updateZoomLevel() {
    document.getElementById("zoom-level-indicator").innerHTML = W.map.olMap.zoom;
};

// INITIALIZE THE SCRIPT
var waitCount = 0;
var maxWait = 60; //60 seconds

function init_ZOOM_LEVEL_IND() {
    try {
        if ("undefined" !== typeof W &&
            "undefined" !== typeof W.map &&
            "undefined" !== typeof W.map.olMap.zoom &&
            "undefined" !== typeof W.map.events &&
            "undefined" !== typeof W.map.events.register &&
            document.getElementsByClassName("zoom-bar-container").length === 1) {
            ZoomLevelIndicator();
            console.info('%c%s','background:green;color:white;padding:5px 10px;','[SUCCESS] WME ZOOM LEVEL INDICATOR >> INITIALIZED');
        } else if (waitCount++ < maxWait) {
            setTimeout(init_ZOOM_LEVEL_IND, 1000);
        } else {
            console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] WME ZOOM LEVEL INDICATOR >> Could not find necessary Waze map objets.');
        }
    } catch (err) {
        console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] WME ZOOM LEVEL INDICATOR >> Failed to initialize.');
        console.error('%c%s','background:red;color:white;padding:5px 10px;','[ERROR] WME ZOOM LEVEL INDICATOR >> Error details: ', err);
    }
};

init_ZOOM_LEVEL_IND();
