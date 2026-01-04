// ==UserScript==
// @name         WME Wax Basemap
// @namespace    https://fxzfun.com/
// @version      1.1
// @description  adds the aerial photos from the Waxahachie gis as a basemap layer
// @author       FXZFun
// @match        https://*.waze.com/*/editor*
// @match        https://*.waze.com/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/459638/WME%20Wax%20Basemap.user.js
// @updateURL https://update.greasyfork.org/scripts/459638/WME%20Wax%20Basemap.meta.js
// ==/UserScript==

/* global W, OL, WazeWrap */

(function() {
    'use strict';

    var errorOccurred;
    var waxBasemap;
    var layerEnabled = false;

    function addLayer() {
        if (waxBasemap == null) {
            waxBasemap = new OL.Layer.XYZ(
                'Wax GIS Basemap',
                "https://api.nearmap.com/tiles/v3/Vert/${z}/${x}/${y}.img?apikey=OWQ1NjZjZjAtYzU0MS00NjBhLWE4NzktNTEzZDM2NDc3MmRk",
                {
                    isBaseLayer: false,
                    uniqueName: 'waxgis',
                    tileSize: new OL.Size(256,256),
                    transitionEffect: 'resize',
                    displayInLayerSwitcher: true,
                    opacity: 1,
                    visibility: false
                });
            W.map.addLayer(waxBasemap);
            W.map.setLayerIndex(waxBasemap, 3);
        } else {
            waxBasemap.url = "https://api.nearmap.com/tiles/v3/Vert/${z}/${x}/${y}.img?apikey=OWQ1NjZjZjAtYzU0MS00NjBhLWE4NzktNTEzZDM2NDc3MmRk";
        }
    }

    function toggleBasemap() {
        W.map.getLayerByName("Wax GIS Basemap").setVisibility(layerEnabled);
        layerEnabled = !layerEnabled;
    }

    // load layer
    var wmeI = setInterval(() => {
        if (WazeWrap != null && WazeWrap.Ready) {
            clearInterval(wmeI);
            console.log("WME Wax Basemap: Start");
            WazeWrap.Interface.AddLayerCheckbox(
                "display",
                "Wax GIS Basemap",
                false,
                toggleBasemap,
                W.map.getLayerByName("WME Wax Basemap"));
            addLayer();
            new WazeWrap.Interface.Shortcut('WaxBasemapDisplay', 'Toggle Wax Basemap',
                                            'layers', 'layersToggleWaxBasemapDisplay', "Shift+W", toggleBasemap, null).add();
        }
    }, 500);
})();