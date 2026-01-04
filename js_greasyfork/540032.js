// ==UserScript==
// @name         Internet Road Trip: Street View Layers
// @namespace    irt-street-view-layers
// @version      0.1
// @description  Add Street View Layers to in-game map for Internet Road Trip
// @match        https://neal.fun/internet-roadtrip/*
// @grant        none
// @license MIT
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/540032/Internet%20Road%20Trip%3A%20Street%20View%20Layers.user.js
// @updateURL https://update.greasyfork.org/scripts/540032/Internet%20Road%20Trip%3A%20Street%20View%20Layers.meta.js
// ==/UserScript==

(async function() {
    const map = await IRF.vdom.map;
    const ml_map = map.data.map;
    ml_map.on("load", function() {
        ml_map.addSource('sv', {
            type: 'raster',
            'tiles': [
                'https://mts.googleapis.com/vt?pb=%211m4%211m3%211i{z}%212i{x}%213i{y}%212m8%211e2%212ssvv%214m2%211scc%212s*211m3*211e2*212b1*213e2*212b1*214b1%214m2%211ssvl%212s*212b1%213m11%212sen%213sUS%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%215m1%215f2'],
            'tileSize': 256});
        ml_map.addSource('ugc_sv', {
            type: 'raster',
            'tiles': [
                'https://mts.googleapis.com/vt?pb=%211m4%211m3%211i{z}%212i{x}%213i{y}%212m8%211e2%212ssvv%214m2%211scc%212s%2A211m3%2A211e3%2A212b1%2A213e2%2A211m3%2A211e10%2A212b1%2A213e2%2A212b1%2A214b1%214m2%211ssvl%212s%2A212b1%213m16%212sen%213sUS%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212ss.e%7Cp.c%3A%23ff0000%2Cs.e%3Ag.f%7Cp.c%3A%23bd5f1b%2Cs.e%3Ag.s%7Cp.c%3A%23f7ca9e%2C%215m1%215f2%0A'
            ], 'tileSize': 256});
        ml_map.addLayer(
            {
                'id': 'sv-tiles',
                'type': 'raster',
                'source': 'sv',
                'minzoom': 0,
                'maxzoom': 22,
                'paint': {'raster-opacity': 0.6},
            }, "route");
        ml_map.addLayer(
            {
                'id': 'svugc-tiles',
                'type': 'raster',
                'source': 'ugc_sv',
                'paint': {'raster-opacity': 0.6},
                'minzoom': 0,
                'maxzoom': 22
            }, "route");
    });

})();