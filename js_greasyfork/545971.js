// ==UserScript==
// @name        Wplace Dark Mode
// @namespace   Violentmonkey Scripts
// @match       https://wplace.live/*
// @grant       GM_addStyle
// @grant       unsafeWindow
// @version     1.3
// @author      Dylan Dang
// @description 8/15/2025, 4:49:32 AM
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545971/Wplace%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/545971/Wplace%20Dark%20Mode.meta.js
// ==/UserScript==

const originalFetch = window.fetch;
const root = unsafeWindow || window;
root.fetch = async (req, options) => {
  const res = await originalFetch(req, options);
  if (res.url !== 'https://maps.wplace.live/styles/liberty') return res;
  const json = await res.json();
  json.layers.forEach((layer) => {
    switch (layer.id) {
      case 'background':
        layer.paint['background-color'] = '#272e40';
        break;

      case 'water':
        layer.paint['fill-color'] = '#000d2a';
        break;

      case 'waterway_tunnel':
      case 'waterway_river':
      case 'waterway_other':
        layer.paint['line-color'] = '#000d2a';
        break;

      case 'natural_earth':
        layer.paint['raster-brightness-max'] = 0.4;
        break;

      case 'landcover_ice':
        layer.paint['fill-color'] = '#475677';
        break;

      case 'landcover_sand':
        layer.paint['fill-color'] = '#775f47';
        break;

      case 'park':
        layer.paint = {
          'fill-color': '#0e4957',
          'fill-opacity': 0.7,
        };
        break;

      case 'park_outline':
        layer.paint['line-opacity'] = 0;
        break;

      case 'landuse_pitch':
      case 'landuse_track':
      case 'landuse_school':
        layer.paint['fill-color'] = '#3e4966';
        break;

      case 'landuse_cemetery':
        layer.paint['fill-color'] = '#3b3b57';
        break;

      case 'landuse_hospital':
        layer.paint['fill-color'] = '#663e3e';
        break;

      case 'building':
        layer.paint['fill-color'] = '#1c3b69';
        break;

      case 'building_3d':
        layer.paint['fill-extrusion-color'] = '#1c3b69';
        break;

      case 'waterway_line_label':
      case 'water_name_point_label':
      case 'water_name_line_label':
        layer.paint['text-color'] = '#8bb6f8';
        layer.paint['text-halo-color'] = 'rgba(0,0,0,0.7)';
        break;

      case 'tunnel_path_pedestrian':
      case 'road_path_pedestrian':
      case 'bridge_path_pedestrian':
        layer.paint['line-color'] = '#7c8493';
        break;

      case 'bridge_path_pedestrian_casing':
        layer.paint['line-color'] = '#3b4d65';
        break;

      case 'road_minor':
      case 'tunnel_service_track':
      case 'tunnel_minor':
      case 'road_service_track':
      case 'bridge_service_track':
      case 'bridge_street':
        layer.paint['line-color'] = '#3b4d65';
        break;

      case 'tunnel_link':
      case 'tunnel_secondary_tertiary':
      case 'tunnel_trunk_primary':
      case 'tunnel_motorway':
        layer.paint['line-color'] = '#4a627e';
        break;

      case 'label_other':
      case 'label_state':
        layer.paint['text-color'] = '#91a0b5';
        layer.paint['text-halo-color'] = 'rgba(0,0,0,0.7)';
        break;

      case 'poi_r20':
      case 'poi_r7':
      case 'poi_r1':
        layer.paint['text-color'] = '#91a0b5';
        layer.paint['text-halo-color'] = 'rgba(0,0,0,0.7)';
        break;

      case 'poi_transit':
        layer.paint['text-color'] = '#cde0fe';
        layer.paint['text-halo-color'] = 'rgba(0,0,0,0.7)';
        break;

      case 'highway_name_path':
      case 'highway_name_major':
        layer.paint['text-color'] = '#cde0fe';
        layer.paint['text-halo-color'] = 'rgba(0,0,0,0.7)';
        break;

      case 'highway_name_minor':
        layer.paint['text-color'] = '#91a0b5';
        layer.paint['text-halo-color'] = 'rgba(0,0,0,0.7)';
        break;

      case 'label_village':
      case 'label_town':
      case 'label_city':
      case 'label_city_capital':
      case 'label_country_3':
      case 'label_country_2':
      case 'label_country_1':
        layer.paint['text-color'] = '#e4e5e9';
        layer.paint['text-halo-color'] = 'rgba(0,0,0,0.7)';
        break;

      case 'airport':
        layer.paint['text-color'] = '#92b7fe';
        layer.paint['text-halo-color'] = 'rgba(0,0,0,0.7)';
        break;

      case 'aeroway_fill':
        layer.paint['fill-color'] = '#2a486c';
        break;

      case 'aeroway_runway':
        layer.paint['line-color'] = '#253d61';
        break;

      case 'aeroway_taxiway':
        layer.paint['line-color'] = '#3d5b77';
        break;

      case 'boundary_3':
        layer.paint['line-color'] = '#707784';
        break;
    }
  });
  const text = JSON.stringify(json)
    .replaceAll('#e9ac77', '#476889') // road
    .replaceAll('#fc8', '#476889') // primary roads
    .replaceAll('#fea', '#3d5b77') // secondary roads
    .replaceAll('#cfcdca', '#3b4d65'); // casing
  return new Response(text, {
    headers: res.headers,
    status: res.status,
    statusText: res.statusText,
  });
};

GM_addStyle(/* css */ `
  :root {
    --color-base-100: #1b1e24;
    --color-base-200: #262b36;
    --color-base-300: #151922;
    --color-base-content: #f5f6f9;
    --noise: 0;
  }
  /* transparent color selector */
  #color-0 {
    background-color: white !important;
  }
`);
