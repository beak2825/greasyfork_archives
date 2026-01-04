// ==UserScript==
// @name         Trailforks Map Free
// @namespace    http://tampermonkey.net/
// @version      2024-03-28
// @description  Make all pro map features free on the webpage!!
// @author       Don Reo,am
// @match        https://www.trailforks.com/trails/map/?nearby=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trailforks.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491121/Trailforks%20Map%20Free.user.js
// @updateURL https://update.greasyfork.org/scripts/491121/Trailforks%20Map%20Free.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Get rid of the bit in the address bar that tells the map we are not premium :P
document.querySelector('#eventpremium_checkbox').removeAttribute('value');

    //Styles - All the styles cuz we gotz stlye XD
document.querySelector('#display_ridden').setAttribute("class", "display_ridden");
document.querySelector('#display_popularity').setAttribute("class", "display_popularity");
document.querySelector('#display_direction').setAttribute("class", "display_direction");
document.querySelector('#display_flow').setAttribute("class", "display_flow");
    //Basemaps - Yes, I'd like all the basemaps please ;)
document.querySelector('#basemap_trailforks-dark').removeAttribute('class');
document.querySelector('#basemap_satellite-streets').removeAttribute('class');
document.querySelector('#basemap_hybrid').removeAttribute('class');
document.querySelector('#basemap_arc-world_imagery').removeAttribute('class');
document.querySelector('#basemap_arc').removeAttribute('class');
document.querySelector('#basemap_OSMCycleMapHD').removeAttribute('class');
document.querySelector('#basemap_GaiaTopoRasterFeet').removeAttribute('class');
document.querySelector('#basemap_GaiaTopoLiteRasterFeet').removeAttribute('class');
    //Layers - Let's get these all for free!! :D
document.querySelector('#heatmap_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#basemap_hybrid').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#trails_top_checkbox').setAttribute("class", "markertype contentlayer");
document.querySelector('#region_friend_counts_checkbox').setAttribute("class", "markertype contentlayer");
document.querySelector('#route_checkbox').setAttribute("class", "markertype layerstype contentlayer");
document.querySelector('#report_checkbox').setAttribute("class", "markertype contentlayer");
document.querySelector('#strava_checkbox').setAttribute("class", "layerstype contentlayer mapOverlay mlu");
document.querySelector('#activityrecordings_checkbox').setAttribute("class", "null");
document.querySelector('#landowner_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#darksky_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#elevation_colors_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#slope_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#mvum_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#usfs_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#jumpsheatmap_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#vztrailhex_checkbox').setAttribute("class", "layerstype mapOverlay");
document.querySelector('#trailsridden_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#vzrideheat_checkbox').setAttribute("class", "layerstype mapOverlay mlu");
document.querySelector('#air-quality-tomorrow_checkbox').setAttribute("class", "layerstype mapOverlay mlu dl gaia");
document.querySelector('#macrostrat-bedrock_checkbox').setAttribute("class", "layerstype mapOverlay mlu dl gaia");
document.querySelector('#qpf24_checkbox').setAttribute("class", "layerstype mapOverlay mlu dl gaia");
document.querySelector('#snow50p24_checkbox').setAttribute("class", "layerstype mapOverlay mlu dl gaia");
document.querySelector('#cell-coverage-all_checkbox').setAttribute("class", "layerstype mapOverlay mlu dl gaia");
document.querySelector('#NHD_checkbox').setAttribute("class", "layerstype mapOverlay mlu dl gaia");
document.querySelector('#ca.bc.fires_checkbox').setAttribute("class", "layerstype mapOverlay mlu dl gaia");
document.querySelector('#usfires_checkbox').setAttribute("class", "layerstype mapOverlay mlu dl gaia");

})();