// ==UserScript==
// @name          Nepali WMS layers
// @version       2025.12.27.03
// @author        kid4rm90s
// @description   Displays layers from Nepali WMS services in WME
// @match         https://*.waze.com/*/editor*
// @match         https://*.waze.com/editor
// @exclude       https://*.waze.com/user/editor*
// @run-at        document-end
// @namespace     https://greasyfork.org/en/users/1087400-kid4rm90s
// @license       MIT
// @grant         GM_xmlhttpRequest
// @require       https://greasyfork.org/scripts/560385/code/WazeToastr.js
// @require      https://update.greasyfork.org/scripts/516445/1480246/Make%20GM%20xhr%20more%20parallel%20again.js
// @connect       geoserver.softwel.com.np
// @connect       admin.nationalgeoportal.gov.np
// @connect       localhost:8080
// @connect       greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/521924/Nepali%20WMS%20layers.user.js
// @updateURL https://update.greasyfork.org/scripts/521924/Nepali%20WMS%20layers.meta.js
// ==/UserScript==

/*  Scripts modified from Czech WMS layers (https://greasyfork.org/cs/scripts/35069-czech-wms-layers; https://greasyfork.org/en/scripts/34720-private-czech-wms-layers, https://greasyfork.org/en/scripts/28160) 
orgianl authors: petrjanik, d2-mac, MajkiiTelini, and Croatian WMS layers (https://greasyfork.org/en/scripts/519676-croatian-wms-layers) author: JS55CT */

/* global W */
/* global WazeToastr */
/* global $ */
/* global OpenLayers */
/* global require */

(function main() {
  ('use strict');
  const updateMessage = '<strong>Fixed :</strong><br> - Temporary fix for alerts not displaying properly.';
  const scriptName = GM_info.script.name;
  const scriptVersion = GM_info.script.version;
  const downloadUrl = 'https://greasyfork.org/scripts/521924-nepali-wms-layers/code/nepali-wms-layers.user.js';
  let wmeSDK;

  var WMSLayersTechSource = {};
  var W;
  var OL;
  var I18n;
  var ZIndexes = {};
  var WMSLayerTogglers = {};

  async function init() {
    console.log(`${scriptName} initializing.`);
    W = unsafeWindow.W;
    OL = unsafeWindow.OpenLayers;
    I18n = unsafeWindow.I18n;

    WMSLayersTechSource.tileSizeG = new OL.Size(512, 512);
    WMSLayersTechSource.resolutions = [
      156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613,
      38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.298582141697406, 0.149291070848703, 0.0746455354243515, 0.0373227677121757,
    ];
    ZIndexes.base = W.map.olMap.Z_INDEX_BASE.Overlay + 20;
    ZIndexes.overlay = W.map.olMap.Z_INDEX_BASE.Overlay + 100;
    ZIndexes.popup = W.map.olMap.Z_INDEX_BASE.Overlay + 500;

    // adresy WMS služeb * WMS service addresses
    var service_wms_PL2023 = {
      type: 'WMS',
      url: 'https://geoserver.softwel.com.np/geoserver/ows/wms?CQL_FILTER=dyear%3D%272023%27',
      attribution: '© DoR / Softwel.com.np',
      comment: 'ssrn_PavementLayer2023',
    };

    var service_wms_softwel = {
      type: 'WMS',
      url: 'https://geoserver.softwel.com.np/geoserver/ows/wms?',
      attribution: '© DoR Nepal/Softwel.com.np',
      comment: 'geoserver softwel.com.np',
    };

    var service_wms_geoportal = {
      type: 'WMS',
      url: 'https://admin.nationalgeoportal.gov.np/geoserver/wms?',
      attribution: '© National Geoportal Nepal',
      comment: 'Municipalities names and boundaries',
    };
    var service_wms_geo_lalitpur = {
      type: 'WMS_4326',
      url: 'http://localhost:8080/geoserver/geo-lalitpur/wms?',
      attribution: '© Geonp.com.np / LMC',
      comment: 'Lalitpur House numbers and boundaries',
    };

    //skupiny vrstev v menu * MapTile service addresses
    var service_xyz_livemap = {
      type: 'XYZ',
      url: ['https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png?highres=true', 'https://worldtiles2.waze.com/tiles/${z}/${x}/${y}.png?highres=true', 'https://worldtiles3.waze.com/tiles/${z}/${x}/${y}.png?highres=true'],
      attribution: "© 2006-2023 Waze Mobile. Všechna práva vyhrazena. <a href='https://www.waze.com/legal/notices' target='_blank'>Poznámky</a>",
      comment: 'Waze Livemapa',
    };
    var service_xyz_google = {
      type: 'XYZ',
      url: [
        'https://mts0.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}',
        'https://mts1.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}',
        'https://mts2.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}',
        'https://mts3.googleapis.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}',
      ],
      attribution: "Mapová data ©2023 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Terms and conditions</a>",
      comment: 'Google Mapy',
    };
    var service_xyz_google_terrain = {
      type: 'XYZ',
      url: [
        'https://mts0.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}',
        'https://mts1.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}',
        'https://mts2.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}',
        'https://mts3.googleapis.com/vt/lyrs=p&x=${x}&y=${y}&z=${z}',
      ],
      attribution: "Mapová data ©2023 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Terms and conditions</a>",
      comment: 'Google Terénní Mapy',
    };
    var service_xyz_google_hybrid = {
      type: 'XYZ',
      url: [
        'https://mts0.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}',
        'https://mts1.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}',
        'https://mts2.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}',
        'https://mts3.googleapis.com/vt/lyrs=y&x=${x}&y=${y}&z=${z}',
      ],
      attribution: "Snímky ©2023 Landsat / Copernicus, Google, GEODIS Brno, Mapová data ©2023 GeoBasis-DE/BKG (©2009),Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Terms and conditions</a>",
      comment: 'Google Hybridní Mapy',
    };
    var service_xyz_google_streetview = {
      type: 'XYZ',
      url: [
        'https://mts0.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40',
        'https://mts1.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40',
        'https://mts2.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40',
        'https://mts3.google.com/mapslt?lyrs=svv&&x=${x}&y=${y}&z=${z}&style=40',
      ],
      attribution: "Google <a href='https://www.google.com/intl/cs_cz/help/terms_maps.html' target='_blank'>Terms and conditions</a>",
      comment: 'Google Streetview',
    };
    var service_xyz_osm = {
      type: 'XYZ',
      maxZoom: 20,
      url: ['https://tile.openstreetmap.org/${z}/${x}/${y}.png'],
      attribution: "© Contributors <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap</a>",
      comment: 'OpenStreetMaps',
    };
    var service_xyz_april = {
      type: 'XYZ',
      maxZoom: 19,
      url: [
        'https://worldtiles1.waze.com/tiles/${z}/${x}/${y}.png?highres=true',
        'https://mts0.googleapis.com/vt/lyrs=m&z=${z}&x=${x}&y=${y}',
        'https://mts0.googleapis.com/vt/lyrs=p&z=${z}&x=${x}&y=${y}',
        'https://tile.openstreetmap.org/${z}/${x}/${y}.png',
      ],
      attribution: 'mišmaš',
      comment: 'mišmaš',
    };

    //skupiny vrstev v menu * layer groups in the menu
    var groupTogglerPlaces = addGroupToggler(true, 'layer-switcher-group_places');
    var groupTogglerRoad = addGroupToggler(true, 'layer-switcher-group_road');
    // var groupTogglerDisplay = addGroupToggler(true, "layer-switcher-group_display");
    var groupTogglerNames = addGroupToggler(false, 'layer-switcher-group_names', 'NP names and addresses');
    var groupTogglerBorders = addGroupToggler(false, 'layer-switcher-group_borders', 'NP Borders');
    var groupTogglerExternal = addGroupToggler(false, 'layer-switcher-group_external', 'External Maps!!!');
    var groupTogglerLalitpur = addGroupToggler(false, 'layer-switcher-group_lalitpur', 'Lalitpur MC HN!');
    //vrstvy v menu * layers in the menu
    /************************How To add LayerTogglers***************************
	WMSLayerTogglers.*(1)* = addLayerToggler(groupTogglerPlaces, "*(2)*", false, [addNewLayer("*(1)*", *(3)*, "*(4)*")]);
	INDEX:
	*(1)* : LAYER NAME
	*(2)* : LAYER DISPLAY NAME AT LIST
	*(3)* : SERVICE URL NAME TO PULL DATA FROM
	*(4)* : SERVICE URL LAYER NAME TO PULL DATA FROM
	****************************************************************************/

    //MÍSTA * PLACES
    WMSLayerTogglers.wms_rivers = addLayerToggler(groupTogglerPlaces, 'Rivers', false, [addNewLayer('wms_rivers', service_wms_softwel, 'ssrn:ssrn_major_river,npgp:river_nepal')]);
    WMSLayerTogglers.wms_airport = addLayerToggler(groupTogglerPlaces, 'Geoportal Airports', false, [addNewLayer('wms_airport', service_wms_geoportal, 'geonode:Transportation', ZIndexes.popup)]);
    // Separate education facility layers to avoid duplicate labels
    WMSLayerTogglers.wms_prtmp_education = addLayerToggler(groupTogglerPlaces, 'Education Facilities (PRTMP)', false, [addNewLayer('wms_prtmp_education', service_wms_softwel, 'prtmp_01:prtmp_education', ZIndexes.popup)]);
    WMSLayerTogglers.wms_prtmp_health = addLayerToggler(groupTogglerPlaces, 'Health Facilities (PRTMP)', false, [addNewLayer('wms_prtmp_health', service_wms_softwel, 'prtmp_01:health_facilities', ZIndexes.popup)]);
	WMSLayerTogglers.wms_geoportal_health = addLayerToggler(groupTogglerPlaces, 'Health Facilities (Geoportal)', false, [addNewLayer('wms_geoportal_health', service_wms_geoportal, 'geonode:health_facilities', ZIndexes.popup)]);
    WMSLayerTogglers.wms_geoportal_police = addLayerToggler(groupTogglerPlaces, 'Police Units (Geoportal)', false, [addNewLayer('wms_geoportal_police', service_wms_geoportal, 'geonode:All_Nepal_Final_short', ZIndexes.popup)]);
    WMSLayerTogglers.wms_prtmp_palika = addLayerToggler(groupTogglerPlaces, 'Palika Centre (PRTMP)', false, [addNewLayer('wms_prtmp_palika', service_wms_softwel, 'prtmp_01:palika_center,prtmp_01:palika_center_name', ZIndexes.popup)]);
    WMSLayerTogglers.wms_prtmp_ward = addLayerToggler(groupTogglerPlaces, 'Ward Centre (PRTMP)', false, [addNewLayer('wms_prtmp_ward', service_wms_softwel, 'prtmp_01:prtmp_ward_center', ZIndexes.popup)]);
    WMSLayerTogglers.wms_prtmp_tourist = addLayerToggler(groupTogglerPlaces, 'Tourist Attraction', false, [addNewLayer('wms_prtmp_tourist', service_wms_softwel, 'prtmp_01:tourist_attraction', ZIndexes.popup)]);
    WMSLayerTogglers.wms_prtmp_customs = addLayerToggler(groupTogglerPlaces, 'Customs Office', false, [addNewLayer('wms_prtmp_customs', service_wms_softwel, 'prtmp_01:trade_transit', ZIndexes.popup)]);

    //SILNICE * ROAD
    WMSLayerTogglers.wms_PL2023 = addLayerToggler(groupTogglerRoad, 'SSRN Highway 2023', false, [addNewLayer('wms_PL2023', service_wms_PL2023, 'ssrn:ssrn_pavementstatus')]);
    WMSLayerTogglers.wms_PRTMP_NH = addLayerToggler(groupTogglerRoad, 'NH 2023 (BSM/PRTMP)', false, [addNewLayer('wms_PRTMP_NH', service_wms_softwel, 'prtmp_01:road_network,prtmp_01:road_network_name', "road_class='NH';road_class='NH'")]);
    WMSLayerTogglers.wms_PRTMP_PH = addLayerToggler(groupTogglerRoad, 'PH 2023 (BSM/PRTMP)', false, [addNewLayer('wms_PRTMP_PH', service_wms_softwel, 'prtmp_01:road_network,prtmp_01:road_network_name', "road_class='PH';road_class='PH'")]);
    WMSLayerTogglers.wms_PRTMP_PR = addLayerToggler(groupTogglerRoad, 'PR 2023 (BSM/PRTMP)', false, [addNewLayer('wms_PRTMP_PR', service_wms_softwel, 'prtmp_01:road_network,prtmp_01:road_network_name', "road_class='PR';road_class='PR'")]);
    WMSLayerTogglers.wms_BSM_Bridge = addLayerToggler(groupTogglerRoad, 'Bridges (BSM)', false, [addNewLayer('wms_BSM_Bridge', service_wms_softwel, 'bsm:bsm_nc_primary_detail,bsm:nc_primary_detail_code,bsm:bsm_bi_primary_detail', ZIndexes.popup)]);
    WMSLayerTogglers.wms_prtmp_bridge = addLayerToggler(groupTogglerRoad, 'Bridges (PRTMP)', false, [addNewLayer('wms_prtmp_bridge', service_wms_softwel, 'prtmp_01:bridge_inventory_local,prtmp_01:local_bridge,prtmp_01:major_bridge', ZIndexes.popup)]);

    //ZOBRAZENÍ * DISPLAY
    // WMSLayerTogglers.wms_orto = addLayerToggler(groupTogglerDisplay, "Ortofoto ČUZK", true, [addNewLayer("wms_orto", service_wms_orto, "GR_ORTFOTORGB", ZIndexes.base)]);

    //ČÚZK NÁZVY A ADRESY * ČÚZK NAMES AND ADDRESSES
    WMSLayerTogglers.wms_mun_name = addLayerToggler(groupTogglerNames, 'BSM Municipality Names', false, [addNewLayer('wms_mun_name', service_wms_softwel, 'bsm:bsm_localbodies_label')]);
    WMSLayerTogglers.wms_junction_name = addLayerToggler(groupTogglerNames, 'SSRN Junction Names', false, [addNewLayer('wms_junction_name', service_wms_softwel, 'ssrn:ssrn_junction_name')]);
    WMSLayerTogglers.wms_lalitpur_metric_house = addLayerToggler(groupTogglerNames, 'Lalitpur Metric House', false, [
      addNewLayer(
        'wms_lalitpur_metric_house',
        service_wms_geo_lalitpur,
        'geo-lalitpur:lmc_w-01_metric_house,geo-lalitpur:lmc_w-02_metric_house,geo-lalitpur:lmc_w-03_metric_house,geo-lalitpur:lmc_w-04_metric_house,geo-lalitpur:lmc_w-05_metric_house,geo-lalitpur:lmc_w-06_metric_house,geo-lalitpur:lmc_w-07_metric_house,geo-lalitpur:lmc_w-08_metric_house,geo-lalitpur:lmc_w-09_metric_house,geo-lalitpur:lmc_w-10_metric_house,geo-lalitpur:lmc_w-11_metric_house,geo-lalitpur:lmc_w-12_metric_house,geo-lalitpur:lmc_w-13_metric_house,geo-lalitpur:lmc_w-14_metric_house,geo-lalitpur:lmc_w-15_metric_house,geo-lalitpur:lmc_w-16_metric_house,geo-lalitpur:lmc_w-17_metric_house,geo-lalitpur:lmc_w-18_metric_house,geo-lalitpur:lmc_w-19_metric_house,geo-lalitpur:lmc_w-20_metric_house,geo-lalitpur:lmc_w-22_metric_house,geo-lalitpur:lmc_w-23_metric_house,geo-lalitpur:lmc_w-24_metric_house,geo-lalitpur:lmc_w-25_metric_house,geo-lalitpur:lmc_w-26_metric_house,geo-lalitpur:lmc_w-27_metric_house,geo-lalitpur:lmc_w-28_metric_house,geo-lalitpur:lmc_w-29_metric_house'
      ),
    ]);

    //ČÚZK HRANICE * BORDER BOARD
    WMSLayerTogglers.wms_geonational = addLayerToggler(groupTogglerBorders, 'Geoportal National Border', false, [addNewLayer('wms_geonational', service_wms_geoportal, 'geonode:nepal')]);
    WMSLayerTogglers.wms_national = addLayerToggler(groupTogglerBorders, 'SSRN National Border', false, [addNewLayer('wms_national', service_wms_softwel, 'ssrn:ssrn_national_boundary_line')]);
    WMSLayerTogglers.wms_geoprovince = addLayerToggler(groupTogglerBorders, 'Geoportal Province Border', false, [addNewLayer('wms_geoprovince', service_wms_geoportal, 'geonode:province')]);
    WMSLayerTogglers.wms_province = addLayerToggler(groupTogglerBorders, 'SSRN Province Border', false, [addNewLayer('wms_province', service_wms_softwel, 'ssrn:ssrn_province_line')]);
    WMSLayerTogglers.wms_geodistrict = addLayerToggler(groupTogglerBorders, 'Geoportal District Border', false, [addNewLayer('wms_geodistrict', service_wms_geoportal, 'geonode:districts')]);
    WMSLayerTogglers.wms_district = addLayerToggler(groupTogglerBorders, 'SSRN District Border', false, [addNewLayer('wms_district', service_wms_softwel, 'ssrn:ssrn_district_boundary_line')]);
    WMSLayerTogglers.wms_geomunicipality = addLayerToggler(groupTogglerBorders, 'Geoportal Municipality Border', false, [addNewLayer('wms_geomunicipality', service_wms_geoportal, 'geonode:NepalLocalUnits0')]);
    WMSLayerTogglers.wms_municipality = addLayerToggler(groupTogglerBorders, 'BSM Municipality Border', false, [addNewLayer('wms_municipality', service_wms_softwel, 'bsm:bsm_localbodies_line')]);
    WMSLayerTogglers.wms_lalitpur_boundary = addLayerToggler(groupTogglerBorders, 'Lalitpur Ward Boundary', false, [
      addNewLayer(
        'wms_lalitpur_boundary',
        service_wms_geo_lalitpur,
        'geo-lalitpur:lmc_w-01_boundary,geo-lalitpur:lmc_w-02_boundary,geo-lalitpur:lmc_w-03_boundary,geo-lalitpur:lmc_w-04_boundary,geo-lalitpur:lmc_w-05_boundary,geo-lalitpur:lmc_w-06_boundary,geo-lalitpur:lmc_w-07_boundary,geo-lalitpur:lmc_w-08_boundary,geo-lalitpur:lmc_w-09_boundary,geo-lalitpur:lmc_w-10_boundary,geo-lalitpur:lmc_w-11_boundary,geo-lalitpur:lmc_w-12_boundary,geo-lalitpur:lmc_w-13_boundary,geo-lalitpur:lmc_w-14_boundary,geo-lalitpur:lmc_w-15_boundary,geo-lalitpur:lmc_w-16_boundary,geo-lalitpur:lmc_w-17_boundary,geo-lalitpur:lmc_w-18_boundary,geo-lalitpur:lmc_w-19_boundary,geo-lalitpur:lmc_w-20_boundary,geo-lalitpur:lmc_w-22_boundary,geo-lalitpur:lmc_w-23_boundary,geo-lalitpur:lmc_w-24_boundary,geo-lalitpur:lmc_w-25_boundary,geo-lalitpur:lmc_w-26_boundary,geo-lalitpur:lmc_w-27_boundary,geo-lalitpur:lmc_w-28_boundary,geo-lalitpur:lmc_w-29_boundary'
      ),
    ]);

    //EXTERNÍ MAPY * EXTERNAL MAPS
    WMSLayerTogglers.xyz_livemap = addLayerToggler(groupTogglerExternal, 'Waze LiveMap', false, [addNewLayer('xyz_livemap', service_xyz_livemap)]);
    WMSLayerTogglers.xyz_google = addLayerToggler(groupTogglerExternal, 'Google Maps', false, [addNewLayer('xyz_google', service_xyz_google)]);
    WMSLayerTogglers.xyz_google_terrain = addLayerToggler(groupTogglerExternal, 'Google Terrain Maps', false, [addNewLayer('xyz_google_terrain', service_xyz_google_terrain)]);
    WMSLayerTogglers.xyz_google_hybrid = addLayerToggler(groupTogglerExternal, 'Google Hybrid Maps', false, [addNewLayer('xyz_google_hybrid', service_xyz_google_hybrid)]);
    WMSLayerTogglers.xyz_google_streetview = addLayerToggler(groupTogglerExternal, 'Google StreetView', false, [addNewLayer('xyz_google_streetview', service_xyz_google_streetview, null, ZIndexes.popup)]);
    WMSLayerTogglers.xyz_osm = addLayerToggler(groupTogglerExternal, 'OpenStreetMaps', false, [addNewLayer('xyz_osm', service_xyz_osm)]);
    WMSLayerTogglers.xyz_april = addLayerToggler(groupTogglerExternal, 'Apríl !!!', false, [addNewLayer('xyz_april', service_xyz_april)]);

    //LALITPUR METRO CITY METRIC HOUSE NUMBERING
    WMSLayerTogglers.wms_lmc_ward1 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 1', false, [addNewLayer('wms_lmc_ward1', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-01_metric_house,geo-lalitpur:lmc_w-01_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward2 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 2', false, [addNewLayer('wms_lmc_ward2', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-02_metric_house,geo-lalitpur:lmc_w-02_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward3 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 3', false, [addNewLayer('wms_lmc_ward3', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-03_metric_house,geo-lalitpur:lmc_w-03_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward4 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 4', false, [addNewLayer('wms_lmc_ward4', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-04_metric_house,geo-lalitpur:lmc_w-04_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward5 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 5', false, [addNewLayer('wms_lmc_ward5', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-05_metric_house,geo-lalitpur:lmc_w-05_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward6 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 6', false, [addNewLayer('wms_lmc_ward6', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-06_metric_house,geo-lalitpur:lmc_w-06_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward7 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 7', false, [addNewLayer('wms_lmc_ward7', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-07_metric_house,geo-lalitpur:lmc_w-07_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward8 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 8', false, [addNewLayer('wms_lmc_ward8', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-08_metric_house,geo-lalitpur:lmc_w-08_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward9 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 9', false, [addNewLayer('wms_lmc_ward9', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-09_metric_house,geo-lalitpur:lmc_w-09_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward10 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 10', false, [addNewLayer('wms_lmc_ward10', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-10_metric_house,geo-lalitpur:lmc_w-10_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward11 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 11', false, [addNewLayer('wms_lmc_ward11', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-11_metric_house,geo-lalitpur:lmc_w-11_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward12 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 12', false, [addNewLayer('wms_lmc_ward12', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-12_metric_house,geo-lalitpur:lmc_w-12_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward13 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 13', false, [addNewLayer('wms_lmc_ward13', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-13_metric_house,geo-lalitpur:lmc_w-13_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward14 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 14', false, [addNewLayer('wms_lmc_ward14', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-14_metric_house,geo-lalitpur:lmc_w-14_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward15 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 15', false, [addNewLayer('wms_lmc_ward15', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-15_metric_house,geo-lalitpur:lmc_w-15_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward16 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 16', false, [addNewLayer('wms_lmc_ward16', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-16_metric_house,geo-lalitpur:lmc_w-16_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward17 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 17', false, [addNewLayer('wms_lmc_ward17', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-17_metric_house,geo-lalitpur:lmc_w-17_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward18 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 18', false, [addNewLayer('wms_lmc_ward18', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-18_metric_house,geo-lalitpur:lmc_w-18_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward19 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 19', false, [addNewLayer('wms_lmc_ward19', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-19_metric_house,geo-lalitpur:lmc_w-19_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward20 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 20', false, [addNewLayer('wms_lmc_ward20', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-20_metric_house,geo-lalitpur:lmc_w-20_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward21 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 21', false, [addNewLayer('wms_lmc_ward21', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-21_metric_house,geo-lalitpur:lmc_w-21_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward22 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 22', false, [addNewLayer('wms_lmc_ward22', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-22_metric_house,geo-lalitpur:lmc_w-22_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward23 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 23', false, [addNewLayer('wms_lmc_ward23', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-23_metric_house,geo-lalitpur:lmc_w-23_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward24 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 24', false, [addNewLayer('wms_lmc_ward24', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-24_metric_house,geo-lalitpur:lmc_w-24_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward25 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 25', false, [addNewLayer('wms_lmc_ward25', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-25_metric_house,geo-lalitpur:lmc_w-25_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward26 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 26', false, [addNewLayer('wms_lmc_ward26', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-26_metric_house,geo-lalitpur:lmc_w-26_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward27 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 27', false, [addNewLayer('wms_lmc_ward27', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-27_metric_house,geo-lalitpur:lmc_w-27_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward28 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 28', false, [addNewLayer('wms_lmc_ward28', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-28_metric_house,geo-lalitpur:lmc_w-28_boundary',ZIndexes.base)]);
    WMSLayerTogglers.wms_lmc_ward29 = addLayerToggler(groupTogglerLalitpur, 'LMC Ward 29', false, [addNewLayer('wms_lmc_ward29', service_wms_geo_lalitpur, 'geo-lalitpur:lmc_w-29_metric_house,geo-lalitpur:lmc_w-29_boundary',ZIndexes.base)]);

    // --- Layer toggler state persistence ---
    function saveLayerTogglerStates() {
      if (!localStorage) return;
      const state = {};
      for (const key in WMSLayerTogglers) {
        const togglerId = WMSLayerTogglers[key].htmlItem;
        const toggler = document.getElementById(togglerId);
        if (toggler) state[key] = toggler.checked;
      }
      localStorage.WMSLayers = JSON.stringify(state);
    }

    function restoreLayerTogglerStates() {
      if (!localStorage.WMSLayers) return;
      const state = JSON.parse(localStorage.WMSLayers);
      for (const key in state) {
        if (WMSLayerTogglers[key]) {
          const togglerId = WMSLayerTogglers[key].htmlItem;
          const toggler = document.getElementById(togglerId);
          if (toggler && toggler.checked !== state[key]) {
            toggler.checked = state[key];
            toggler.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }
    }

    // Attach change listeners to save state on toggle
    for (const key in WMSLayerTogglers) {
      const togglerId = WMSLayerTogglers[key].htmlItem;
      const toggler = document.getElementById(togglerId);
      if (toggler) {
        toggler.addEventListener('change', saveLayerTogglerStates);
      }
    }
    // Restore state after togglers are created

    restoreLayerTogglerStates();
    /*********************  start of popup code ***************************/
    // --- WMS GetFeatureInfo popup for SSRN Pavement Layer ---
    const map = W.map.olMap;

    // Helper: get all visible supported WMS layers for popup
    function getAllVisibleWMSLayerInfo() {
      const supported = [
        { key: 'wms_rivers', service: service_wms_softwel, queryLayer: 'ssrn:ssrn_major_river,npgp:river_nepal', displayName: 'Rivers', formatFn: (feature) => formatFeatureInfo('RIVER', feature) },
        { key: 'wms_prtmp_education', service: service_wms_softwel, queryLayer: 'prtmp_01:prtmp_education', displayName: 'Education Facilities (PRTMP)', formatFn: (feature) => formatFeatureInfo('EDUCATION', feature) },
        { key: 'wms_prtmp_health', service: service_wms_softwel, queryLayer: 'prtmp_01:health_facilities', displayName: 'Health Facilities (PRTMP)', formatFn: (feature) => formatFeatureInfo('HEALTH', feature) },
        { key: 'wms_geoportal_health', service: service_wms_geoportal, queryLayer: 'geonode:health_facilities', displayName: 'Health Facilities (Geoportal)', formatFn: (feature) => formatFeatureInfo('GEO_HEALTH', feature) },
        { key: 'wms_geoportal_police', service: service_wms_geoportal, queryLayer: 'geonode:All_Nepal_Final_short', displayName: 'Police Units (Geoportal)', formatFn: (feature) => formatFeatureInfo('GEO_POLICE', feature) },
        { key: 'wms_prtmp_palika', service: service_wms_softwel, queryLayer: 'prtmp_01:palika_center', displayName: 'Palika Centre (PRTMP)', formatFn: (feature) => formatFeatureInfo('PALIKA', feature) },
        { key: 'wms_prtmp_ward', service: service_wms_softwel, queryLayer: 'prtmp_01:prtmp_ward_center', displayName: 'Ward Centre (PRTMP)', formatFn: (feature) => formatFeatureInfo('WARD', feature) },
        { key: 'wms_prtmp_tourist', service: service_wms_softwel, queryLayer: 'prtmp_01:tourist_attraction', displayName: 'Tourist Attraction', formatFn: (feature) => formatFeatureInfo('TOURIST', feature) },
        { key: 'wms_prtmp_customs', service: service_wms_softwel, queryLayer: 'prtmp_01:trade_transit', displayName: 'Customs Office', formatFn: (feature) => formatFeatureInfo('CUSTOMS', feature) },
        { key: 'wms_PL2023', service: service_wms_PL2023, queryLayer: 'ssrn:ssrn_pavementstatus', displayName: 'SSRN Highway 2023', formatFn: (feature) => formatFeatureInfo('SSRN', feature) },
        { key: 'wms_PRTMP_NH', service: service_wms_softwel, queryLayer: 'prtmp_01:road_network', displayName: 'NH 2023 (BSM/PRTMP)', formatFn: (feature) => formatFeatureInfo('BSM', feature), cqlFilter: "road_class='NH'" },
        { key: 'wms_PRTMP_PH', service: service_wms_softwel, queryLayer: 'prtmp_01:road_network', displayName: 'PH 2023 (BSM/PRTMP)', formatFn: (feature) => formatFeatureInfo('BSM', feature), cqlFilter: "road_class='PH'" },
        { key: 'wms_PRTMP_PR', service: service_wms_softwel, queryLayer: 'prtmp_01:road_network', displayName: 'PR 2023 (BSM/PRTMP)', formatFn: (feature) => formatFeatureInfo('BSM', feature), cqlFilter: "road_class='PR'" },
        {
          key: 'wms_BSM_Bridge',
          service: service_wms_softwel,
          queryLayer: 'bsm:bsm_nc_primary_detail,bsm:nc_primary_detail_code,bsm:bsm_bi_primary_detail',
          displayName: 'Bridges (BSM)',
          formatFn: (feature) => formatFeatureInfo('BRIDGE', feature),
        },
        {
          key: 'wms_prtmp_bridge',
          service: service_wms_softwel,
          queryLayer: 'prtmp_01:bridge_inventory_local,prtmp_01:local_bridge,prtmp_01:major_bridge',
          displayName: 'Bridges (PRTMP)',
          formatFn: (feature) => formatFeatureInfo('BRIDGE', feature),
        },
      ];
      const visible = [];
      for (const s of supported) {
        const toggler = WMSLayerTogglers[s.key];
        if (!toggler) {
          continue;
        }
        const layer = toggler.layerArray && toggler.layerArray[0] && toggler.layerArray[0].layer;
        if (layer && layer.getVisibility()) {
          visible.push({ layer, service: s.service, queryLayer: s.queryLayer, formatFn: s.formatFn, key: s.key, displayName: s.displayName, cqlFilter: s.cqlFilter });
        }
      }
      return visible;
    }

    // Helper: build GetFeatureInfo URL for any supported WMS layer
    function buildGetFeatureInfoUrl(service, queryLayer, evt, cqlFilter = null) {
      const wmsUrl = service.url;
      const bbox = map.getExtent();
      const width = map.size.w;
      const height = map.size.h;
      const x = Math.round(evt.xy.x);
      const y = Math.round(evt.xy.y);

      // Handle CQL filters - priority: parameter > service URL
      let cql = '';
      if (cqlFilter) {
        cql = 'CQL_FILTER=' + encodeURIComponent(cqlFilter);
        console.log('[WMS DEBUG] Using layer-specific CQL filter for GetFeatureInfo:', cqlFilter);
      } else if (wmsUrl.includes('CQL_FILTER=')) {
        const match = wmsUrl.match(/CQL_FILTER=([^&]*)/);
        if (match) {
          cql = 'CQL_FILTER=' + match[1];
          console.log('[WMS DEBUG] Using service URL CQL filter for GetFeatureInfo:', decodeURIComponent(match[1]));
        }
      }

      // Determine CRS: use map.projection or fallback to EPSG:3857
      let crs = 'EPSG:3857';
      if (map.projection && (map.projection === 'EPSG:4326' || map.projection === 'EPSG:3857')) {
        crs = map.projection;
      }
      // Optionally add FEATURE_COUNT if present in service config
      let featureCount = '';
      if (service.featureCount) {
        featureCount = 'FEATURE_COUNT=' + service.featureCount;
      }
      const params = [
        'SERVICE=WMS',
        'VERSION=1.3.0',
        'REQUEST=GetFeatureInfo',
        'FORMAT=image/png',
        'TRANSPARENT=true',
        'QUERY_LAYERS=' + encodeURIComponent(queryLayer),
        'LAYERS=' + encodeURIComponent(queryLayer),
        'INFO_FORMAT=application/json',
        cql,
        'STYLES=',
        'TILED=true',
        'buffer=10',
        'CRS=' + crs,
        'WIDTH=' + width,
        'HEIGHT=' + height,
        'BBOX=' + bbox.left + ',' + bbox.bottom + ',' + bbox.right + ',' + bbox.top,
        'I=' + x,
        'J=' + y,
        featureCount,
      ].filter(Boolean);

      const finalUrl = wmsUrl.split('?')[0] + '?' + params.join('&');
      if (cqlFilter) {
        console.log('[WMS DEBUG] GetFeatureInfo URL with CQL filter:', finalUrl);
      }
      return finalUrl;
    }

    // Helper: show popup at pixel position with content (custom HTML popup)
    function showWMSPopupAtPixel(pixel, html) {
      let popup = document.getElementById('wms-info-popup');
      if (!popup) {
        popup = document.createElement('div');
        popup.id = 'wms-info-popup';
        popup.style.position = 'absolute';
        popup.style.zIndex = 9999;
        popup.style.background = 'white';
        popup.style.border = '2px solid #333';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        popup.style.padding = '10px 14px 10px 10px';
        popup.style.minWidth = '220px';
        popup.style.maxWidth = '350px';
        popup.style.pointerEvents = 'auto';
        popup.style.fontSize = '11px';
        popup.style.fontFamily = 'inherit';
        popup.style.display = 'block';
        popup.innerHTML = '';
        document.body.appendChild(popup);
      }
      // Add close button and table styling
      popup.innerHTML = `
        <a href="#" id="wms-info-popup-close" style="position:absolute;top:4px;right:8px;font-size:16px;text-decoration:none;color:#888;">&times;</a>
        <style>
          #wms-info-popup table { border-collapse: collapse; width: 100%; margin-top: 8px; font-size: 11px; }
          #wms-info-popup th, #wms-info-popup td { border: 1px solid #ccc; padding: 2px 6px; text-align: left; font-size: 11px; }
          #wms-info-popup th { background: #f0f0f0; font-weight: bold; font-size: 11px; }
          #wms-info-popup tr.alert-success th { background: #d4edda; color: #155724; text-align: center; font-size: 11px; }
        </style>
        ${html}
      `;
      // Position popup (pixel is {x, y} relative to map viewport)
      const mapDiv = map.div;
      const rect = mapDiv.getBoundingClientRect();
      popup.style.left = rect.left + pixel.x + 10 + 'px';
      popup.style.top = rect.top + pixel.y - 10 + 'px';
      popup.style.display = 'block';
      // Close handler
      document.getElementById('wms-info-popup-close').onclick = function (e) {
        e.preventDefault();
        popup.style.display = 'none';
      };
    }

    // Helper: show popup at pixel position with content (custom HTML popup), unique per layer
    function showWMSPopupAtPixelForLayer(pixel, html, layerKey) {
      let popupId = 'wms-info-popup-' + layerKey;
      let popup = document.getElementById(popupId);
      if (!popup) {
        popup = document.createElement('div');
        popup.id = popupId;
        popup.style.position = 'absolute';
        popup.style.zIndex = 9999;
        popup.style.background = 'white';
        popup.style.border = '2px solid #333';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        popup.style.padding = '10px 14px 10px 10px';
        popup.style.minWidth = '220px';
        popup.style.maxWidth = '350px';
        popup.style.pointerEvents = 'auto';
        popup.style.fontSize = '11px';
        popup.style.fontFamily = 'inherit';
        popup.style.display = 'block';
        popup.innerHTML = '';
        document.body.appendChild(popup);
      }
      // Add close button and table styling
      popup.innerHTML = `
        <a href="#" id="${popupId}-close" style="position:absolute;top:4px;right:8px;font-size:16px;text-decoration:none;color:#888;">&times;</a>
        <style>
          #${popupId} table { border-collapse: collapse; width: 100%; margin-top: 8px; font-size: 11px; }
          #${popupId} th, #${popupId} td { border: 1px solid #ccc; padding: 2px 6px; text-align: left; font-size: 11px; }
          #${popupId} th { background: #f0f0f0; font-weight: bold; font-size: 11px; }
          #${popupId} tr.alert-success th { background: #d4edda; color: #155724; text-align: center; font-size: 11px; }
        </style>
        ${html}
      `;
      // Position popup (pixel is {x, y} relative to map viewport)
      const mapDiv = map.div;
      const rect = mapDiv.getBoundingClientRect();
      // Offset each popup horizontally so they don't overlap
      let offsetX = 10 + 260 * ['wms_PL2023', 'wms_PRTMP_PH', 'wms_PRTMP_PR'].indexOf(layerKey);
      popup.style.left = rect.left + pixel.x + offsetX + 'px';
      popup.style.top = rect.top + pixel.y - 10 + 'px';
      popup.style.display = 'block';
      // Close handler
      document.getElementById(`${popupId}-close`).onclick = function (e) {
        e.preventDefault();
        popup.style.display = 'none';
      };
    }
    // Helper: format feature info for popup based on type
    function formatFeatureInfo(type, feature) {
      // Define field sets and titles for each type
      const configs = {
        SSRN: {
          title: (feature) => feature.layerName || 'Strategic Road Network',
          fields: [
            ['road_code', 'Road Code'],
            ['link_name', 'Link Name'],
            ['road_name', 'Road Name'],
            ['from_ch', 'From chainage'],
            ['to_ch', 'To chainage'],
            ['pave_type', 'Pavement type'],
            ['last_resurface', 'Last Resurface Year'],
            ['pave_width', 'Pave Width'],
            ['dyear', 'Year'],
            ['add_date', 'Added'],
          ],
        },
        BSM: {
          title: (feature) => feature.layerName || 'BSM Province Road Info',
          fields: [
            ['road_code', 'Road Code'],
            ['road_class', 'Road Class'],
            ['road_name', 'Road Name'],
            ['pcode', 'Province'],
            ['start_ch', 'From chainage'],
            ['end_ch', 'To chainage'],
            ['dyear', 'Year'],
            ['add_date', 'Added'],
          ],
        },
        EDUCATION: {
          title: (feature) => feature.layerName || 'Education Facilities',
          fields: [
            ['name', 'School Name'],
            ['loc_bodies', 'Mun Name'],
            ['district', 'District'],
          ],
        },
        HEALTH: {
          title: (feature) => feature.layerName || 'Health Facilities',
          fields: [
            ['hf_name', 'Name'],
            ['category', 'Category'],
            ['loc_bodies', 'Mun Name'],
            ['ward', 'Ward'],
            ['district', 'District'],
            ['province', 'Province'],
          ],
        },
        GEO_HEALTH: {
          title: (feature) => feature.layerName || 'Health Facilities',
          fields: [
            ['health_fac', 'Name'],
            ['Categorise', 'Category'],
            ['status_lev', 'Status Level'],
            ['local_gove', 'Mun Name'],
            ['District', 'District'],
            ['Province', 'Province'],
          ],
        },
        GEO_POLICE: {
          title: (feature) => feature.layerName || 'Police Units',
          fields: [
            ['EngName', 'Name'],
            ['Nepali_Nam', 'Nep Name'],
            ['dis', 'District'],
            ['Provinces', 'Province'],
          ],
        },
        RIVER: {
          title: (feature) => feature.layerName || 'River Features',
          fields: [['riv_name', 'Name']],
        },
        PALIKA: {
          title: (feature) => feature.layerName || 'Palika Centre',
          fields: [
            ['loc_bod', 'Name Eng'],
            ['dist_name', 'District Eng'],
            ['province', 'Province'],
            ['palika_nep', 'Palika NP'],
            ['dist_nep', 'District NP'],
          ],
        },
        WARD: {
          title: (feature) => feature.layerName || 'Ward Centre',
          fields: [
            ['pcode', 'Province'],
            ['loc_name', 'Name'],
            ['type_gn', 'Type'],
            ['ward_no', 'Ward No'],
          ],
        },
        TOURIST: {
          title: (feature) => feature.layerName || 'Tourist Attraction',
          fields: [
            ['pcode', 'Province'],
            ['name', 'Name'],
            ['district', 'District'],
          ],
        },
        CUSTOMS: {
          title: (feature) => feature.layerName || 'Customs Office',
          fields: [
            ['pcode', 'Province'],
            ['name', 'Name'],
            ['district', 'District'],
          ],
        },
        BRIDGE: {
          title: (feature) => feature.layerName || 'Bridge',
          fields: [
            ['pcode', 'Province'],
            [['name', 'bridge_name'], 'Bridge Name'], // Array of fallback field names
            [['bridge_id', 'bridge_no', 'new_bridge_no'], 'Bridge ID'], // Array of fallback field names
            ['bridge_length', 'Bridge Length'],
            [['river', 'river_name'], 'River'], // Array of fallback field names
            ['road', 'Road Name'], // Array of fallback field names
            ['district', 'District'],
            ['updated_date', 'Updated Date'],
          ],
        },
      };

      const config = configs[type];
      if (!config) return '<div>No info available</div>';

      // Always use user-friendly display name if present
      let layerTitle = feature.layerName; // || (typeof config.title === 'function' ? config.title(feature) : config.title);

      let html = '<table class="link-table"><tbody>';
      html += `<tr class="alert-success text-center"><th colspan="2">${layerTitle}</th></tr>`;
      for (const [key, label] of config.fields) {
        let value = '';
        if (Array.isArray(key)) {
          // Handle fallback field names - try each key until we find a value
          for (const fallbackKey of key) {
            if (feature.properties[fallbackKey]) {
              value = feature.properties[fallbackKey];
              break;
            }
          }
        } else {
          // Single field name
          value = feature.properties[key] || '';
        }
        html += `<tr><td>${label}: </td><td>${value}</td></tr>`;
      }
      html += '</tbody></table>';
      return '<div id="popup-content">' + html + '</div>';
    }

    // Map click handler
    map.events.register('click', map, function (evt) {
      console.log('[WMS] Map clicked at', evt.xy, evt.lonlat);
      const visibleLayers = getAllVisibleWMSLayerInfo();
      if (!visibleLayers.length) {
        console.log('[WMS] No supported WMS layer visible for popup.');
        return;
      }
      let responses = 0;
      let foundFeatures = [];
      let total = visibleLayers.length;
      for (const info of visibleLayers) {
        const url = buildGetFeatureInfoUrl(info.service, info.queryLayer, evt, info.cqlFilter);
        console.log(`[WMS] GetFeatureInfo URL for ${info.key}:`, url);
        GM_xmlhttpRequest({
          method: 'GET',
          url: url,
          headers: { Accept: 'application/json' },
          onload: function (response) {
            responses++;
            try {
              const data = JSON.parse(response.responseText);
              console.log(`[WMS] GetFeatureInfo response for ${info.key}:`, data);
              if (data.features && data.features.length > 0) {
                // For combined layers, deduplicate features by name to avoid showing identical entries
                const uniqueFeatures = [];
                const seenNames = new Set();

                for (let feature of data.features) {
                  // Use the facility name as the deduplication key
                  const facilityName = feature.properties?.name || feature.properties?.hf_name || feature.properties?.riv_name || 'unnamed';

                  if (!seenNames.has(facilityName)) {
                    seenNames.add(facilityName);
                    feature.layerName = info.displayName;
                    uniqueFeatures.push({ info, feature });
                  }
                }

                // Add all unique features to the foundFeatures array
                foundFeatures.push(...uniqueFeatures);
              }
            } catch (e) {
              console.error(`[WMS] Error parsing GetFeatureInfo response for ${info.key}:`, e);
            }
            if (responses === total) {
              if (foundFeatures.length > 0) {
                // Show all found features in one popup at the click location
                let html = foundFeatures.map((f) => f.info.formatFn(f.feature)).join('<hr style="margin:6px 0;">');
                showWMSPopupAtPixel(evt.xy, html);
                console.log('[WMS] Popup shown for features:', foundFeatures);
              }
            }
          },
          onerror: function (err) {
            responses++;
            console.error(`[WMS] GetFeatureInfo request failed for ${info.key}:`, err);
            if (responses === total) {
              if (foundFeatures.length > 0) {
                let html = foundFeatures.map((f) => f.info.formatFn(f.feature)).join('<hr style="margin:6px 0;">');
                showWMSPopupAtPixel(evt.xy, html);
              }
            }
          },
        });
      }
    });
    /*end of pop up code*/

    var GSVlayer = WMSLayerTogglers.xyz_google_streetview.layerArray[0].layer;
    var enteringStreetView = false;
    var ignoreStreetViewExit = false;
    var previousDisplayState = true;
    var controlObserver = new MutationObserver(function (mutationRecords) {
      if (!document.getElementById('layer-switcher-item_Google_StreetView').checked) {
        if (mutationRecords[0].target.classList.contains('overlay-button-active') == previousDisplayState) {
          if (previousDisplayState == true && !ignoreStreetViewExit) {
            previousDisplayState = !mutationRecords[0].target.classList.contains('overlay-button-active');
            W.map.addLayer(GSVlayer);
            enteringStreetView = true;
            GSVlayer.setVisibility(true);
            enteringStreetView = false;
          } else if (previousDisplayState == false) {
            previousDisplayState = !mutationRecords[0].target.classList.contains('overlay-button-active');
            GSVlayer.setVisibility(false);
            W.map.removeLayer(GSVlayer);
          }
        }
      }
    });
    controlObserver.observe(document.querySelector('.street-view-control'), { attributes: true, attributeFilter: ['class'] });
    GSVlayer.events.register('visibilitychanged', null, function () {
      if (!enteringStreetView && GSVlayer.getVisibility()) {
        ignoreStreetViewExit = true;
      }
      if (!GSVlayer.getVisibility()) {
        ignoreStreetViewExit = false;
      }
    });

    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab('wms-NP-layers');
    tabLabel.innerText = 'WMS-NP';
    tabLabel.title = 'Nepali WMS Layers';
    tabLabel.id = 'sidepanel-wms';
    tabPane.innerHTML = "<b><u><a href='https://greasyfork.org/en/scripts/521924' target='_blank'>" + GM_info.script.name + '</a></u></b> &nbsp; v' + GM_info.script.version;
    var section = document.createElement('section');
    section.style.fontSize = '13px';
    section.id = 'WMS';
    section.style.marginBottom = '15px';
    section.appendChild(document.createElement('br'));
    section.appendChild(document.createTextNode('WMS layer: '));
    var WMSSelect = document.createElement('select');
    WMSSelect.id = 'WMSLayersSelect';
    section.appendChild(WMSSelect);
    var opacityRange = document.createElement('input');
    var opacityLabel = document.createElement('label');
    opacityRange.type = 'range';
    opacityRange.min = 0;
    opacityRange.max = 100;
    opacityRange.value = 100;
    opacityRange.id = 'WMSOpacity';
    opacityLabel.textContent = 'Layer transparency: ' + opacityRange.value + ' %';
    opacityLabel.id = 'WMSOpacityLabel';
    opacityLabel.htmlFor = opacityRange.id;
    section.appendChild(opacityLabel);
    section.appendChild(opacityRange);

    // Add shift controls
    var shiftContainer = document.createElement('div');
    shiftContainer.style.marginTop = '10px';
    shiftContainer.style.display = 'flex';
    shiftContainer.style.flexDirection = 'column';
    shiftContainer.style.alignItems = 'flex-start';

    var distanceLabel = document.createElement('label');
    distanceLabel.textContent = 'Shift distance (meters): ';
    distanceLabel.style.marginRight = '5px';
    var distanceInput = document.createElement('input');
    distanceInput.type = 'number';
    distanceInput.value = 1;
    distanceInput.min = 1;
    distanceInput.style.width = '60px';
    distanceInput.id = 'WMSShiftDistance';
    distanceLabel.appendChild(distanceInput);
    shiftContainer.appendChild(distanceLabel);

    var btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '5px';
    btnRow.style.marginTop = '5px';

    var btnUp = document.createElement('button');
    btnUp.textContent = '↑';
    btnUp.title = 'Shift Up';
    var btnDown = document.createElement('button');
    btnDown.textContent = '↓';
    btnDown.title = 'Shift Down';
    var btnLeft = document.createElement('button');
    btnLeft.textContent = '←';
    btnLeft.title = 'Shift Left';
    var btnRight = document.createElement('button');
    btnRight.textContent = '→';
    btnRight.title = 'Shift Right';

    // Diagonal buttons
    var btnUpLeft = document.createElement('button');
    btnUpLeft.textContent = '↖';
    btnUpLeft.title = 'Shift Up-Left';
    var btnUpRight = document.createElement('button');
    btnUpRight.textContent = '↗';
    btnUpRight.title = 'Shift Up-Right';
    var btnDownLeft = document.createElement('button');
    btnDownLeft.textContent = '↙';
    btnDownLeft.title = 'Shift Down-Left';
    var btnDownRight = document.createElement('button');
    btnDownRight.textContent = '↘';
    btnDownRight.title = 'Shift Down-Right';

    // Add reset button
    var btnReset = document.createElement('button');
    btnReset.textContent = 'Reset';
    btnReset.title = 'Reset Shift';
    btnRow.appendChild(btnReset);

    // Arrange buttons in a grid
    var btnGrid = document.createElement('div');
    btnGrid.style.display = 'grid';
    btnGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    btnGrid.style.gap = '2px';
    btnGrid.appendChild(btnUpLeft);
    btnGrid.appendChild(btnUp);
    btnGrid.appendChild(btnUpRight);
    btnGrid.appendChild(btnLeft);
    var emptyCell = document.createElement('div');
    btnGrid.appendChild(emptyCell); // center cell empty
    btnGrid.appendChild(btnRight);
    btnGrid.appendChild(btnDownLeft);
    btnGrid.appendChild(btnDown);
    btnGrid.appendChild(btnDownRight);
    shiftContainer.appendChild(btnGrid);
    shiftContainer.appendChild(btnRow);
    section.appendChild(shiftContainer);

    // Helper: store per-layer offset
    var wmsLayerOffsets = {};

    // Helper: store original offset for each layer
    var wmsLayerOriginalOffsets = {};

    // Helper: patch getURL to apply offset
    function patchWMSLayerGetURL(layer) {
      if (!layer || layer._wmsShiftPatched) return;
      const origGetURL = layer.getURL;
      layer._wmsShiftPatched = true;
      layer.getURL = function (bounds) {
        const offset = wmsLayerOffsets?.[layer.name] ?? { x: 0, y: 0 };
        const newBounds = bounds.clone();
        newBounds.right += offset.x;
        newBounds.left += offset.x;
        newBounds.top += offset.y;
        newBounds.bottom += offset.y;
        return origGetURL.call(this, newBounds);
      };
    }

    // Helper to shift layer (now accepts dx, dy)
    function shiftLayer(direction, customDx, customDy) {
      var value = document.getElementById('WMSLayersSelect').value;
      var dist = parseFloat(document.getElementById('WMSShiftDistance').value) || 0;
      if (!value || value === 'undefined' || dist === 0) return;
      var layer = W.map.getLayerByName(value);
      if (!layer) return;
      patchWMSLayerGetURL(layer);
      var map = W.map;
      var proj = map.getProjectionObject();
      var dx = 0,
        dy = 0;
      var diag = dist * 0.7071; // sqrt(2)/2 for diagonal
      if (typeof customDx === 'number' && typeof customDy === 'number') {
        dx = customDx;
        dy = customDy;
      } else if (proj && proj.projCode === 'EPSG:4326') {
        var centerLat = map.getCenter().lat;
        var metersPerDegreeLat = 111320;
        var metersPerDegreeLon = (40075000 * Math.cos((centerLat * Math.PI) / 180)) / 360;
        switch (direction) {
          case 'up':
            dy = -dist / metersPerDegreeLat;
            break;
          case 'down':
            dy = dist / metersPerDegreeLat;
            break;
          case 'left':
            dx = dist / metersPerDegreeLon;
            break;
          case 'right':
            dx = -dist / metersPerDegreeLon;
            break;
          case 'upleft':
            dx = diag / metersPerDegreeLon;
            dy = -diag / metersPerDegreeLat;
            break;
          case 'upright':
            dx = -diag / metersPerDegreeLon;
            dy = -diag / metersPerDegreeLat;
            break;
          case 'downleft':
            dx = diag / metersPerDegreeLon;
            dy = diag / metersPerDegreeLat;
            break;
          case 'downright':
            dx = -diag / metersPerDegreeLon;
            dy = diag / metersPerDegreeLat;
            break;
        }
      } else {
        switch (direction) {
          case 'up':
            dy = -dist;
            break;
          case 'down':
            dy = dist;
            break;
          case 'left':
            dx = dist;
            break;
          case 'right':
            dx = -dist;
            break;
          case 'upleft':
            dx = diag;
            dy = -diag;
            break;
          case 'upright':
            dx = -diag;
            dy = -diag;
            break;
          case 'downleft':
            dx = diag;
            dy = diag;
            break;
          case 'downright':
            dx = -diag;
            dy = diag;
            break;
        }
      }
      if (!wmsLayerOffsets[layer.name]) wmsLayerOffsets[layer.name] = { x: 0, y: 0 };
      wmsLayerOffsets[layer.name].x += dx;
      wmsLayerOffsets[layer.name].y += dy;
      // Store original offset if not already stored
      if (!wmsLayerOriginalOffsets[layer.name]) {
        wmsLayerOriginalOffsets[layer.name] = { x: 0, y: 0 };
      }
      // Show WazeToastr alert
      WazeToastr.Alerts.info('Layer Shifted', `Layer shifted to ${dist} metres ${direction}. Please wait for fully load.`, false, false, 2000);
      layer.redraw();
    }
    btnUp.addEventListener('click', function () {
      shiftLayer('up');
    });
    btnDown.addEventListener('click', function () {
      shiftLayer('down');
    });
    btnLeft.addEventListener('click', function () {
      shiftLayer('left');
    });
    btnRight.addEventListener('click', function () {
      shiftLayer('right');
    });
    btnUpLeft.addEventListener('click', function () {
      shiftLayer('upleft');
    });
    btnUpRight.addEventListener('click', function () {
      shiftLayer('upright');
    });
    btnDownLeft.addEventListener('click', function () {
      shiftLayer('downleft');
    });
    btnDownRight.addEventListener('click', function () {
      shiftLayer('downright');
    });

    // Reset shift for selected layer
    btnReset.addEventListener('click', function () {
      var value = document.getElementById('WMSLayersSelect').value;
      if (!value || value === 'undefined') return;
      var layer = W.map.getLayerByName(value);
      if (!layer) return;
      patchWMSLayerGetURL(layer);
      wmsLayerOffsets[layer.name] = { x: 0, y: 0 };
      layer.redraw();
      // Show WazeToastr alert on reset
      WazeToastr.Alerts.info('Layer Reset', 'Layer shift has been reset to default.', false, false, 2000);
    });

    tabPane.appendChild(section);
    await W.userscripts.waitForElementConnected(tabPane);
    fillWMSLayersSelectList();
    opacityRange.addEventListener('input', function () {
      var value = document.getElementById('WMSLayersSelect').value;
      if (value !== '' && value !== 'undefined') {
        var layer = W.map.getLayerByName(value);
        layer.setOpacity(opacityRange.value / 100);
        document.getElementById('WMSOpacityLabel').textContent = 'Layer transparency: ' + document.getElementById('WMSOpacity').value + ' %';
      }
    });
    WMSSelect.addEventListener('change', function () {
      var selectedLayer = W.map.layers.filter((layer) => layer.name == WMSSelect.value)[0];
      if (selectedLayer) {
        opacityRange.value = selectedLayer.opacity * 100;
        document.getElementById('WMSOpacityLabel').textContent = 'Layer transparency: ' + document.getElementById('WMSOpacity').value + ' %';
      }
    });
    setZOrdering(WMSLayerTogglers);
    W.map.events.register('addlayer', null, fillWMSLayersSelectList);
    W.map.events.register('removelayer', null, fillWMSLayersSelectList);
    W.map.events.register('addlayer', null, setZOrdering(WMSLayerTogglers));
    W.map.events.register('removelayer', null, setZOrdering(WMSLayerTogglers));
    W.map.events.register('moveend', null, setZOrdering(WMSLayerTogglers));
  }

  function fillWMSLayersSelectList() {
    const select = document.getElementById('WMSLayersSelect');
    const value = select.value;
    let htmlCode = '';
    W.map.layers.filter((layer) => layer.params?.SERVICE === 'WMS').forEach((layer) => (htmlCode += `<option value='${layer.name}'>${layer.name}</option><br>`));
    select.innerHTML = htmlCode;
    select.value = value;
  }

  function addNewLayer(id, service, serviceLayers, zIndex = 0, opacity = 1) {
    var newLayer = {};
    newLayer.serviceType = service.type;
    if ((service.type == 'XYZ') & (zIndex == 0)) {
      newLayer.zIndex = ZIndexes.base;
    } else {
      newLayer.zIndex = zIndex == 0 ? ZIndexes.popup : zIndex;
    }
    switch (service.type) {
      case 'WMS':
        // Debug log for WMS request URL and filter
        if (typeof zIndex === 'string' && zIndex.includes("road_class='")) {
          console.log('[WMS DEBUG] Creating WMS Layer:', id);
          console.log('[WMS DEBUG] Service URL:', service.url);
          console.log('[WMS DEBUG] Layers:', serviceLayers);
          console.log('[WMS DEBUG] Filter:', zIndex);
        }
        newLayer.layer = new OL.Layer.WMS(
          id,
          service.url,
          {
            layers: serviceLayers,
            transparent: 'true',
            format: 'image/png',
            version: service.version || '1.3.0', // Use service.version if provided, else default to 1.3.0 use WMS 1.3.0 + EPSG:3857
            CQL_FILTER: typeof zIndex === 'string' ? zIndex : undefined,
          },
          {
            opacity: opacity,
            tileSize: WMSLayersTechSource.tileSizeG || new OL.Size(256, 256), // Use service-defined tile size if available
            isBaseLayer: false,
            visibility: false,
            transitionEffect: 'resize',
            attribution: service.attribution,
            projection: new OL.Projection('EPSG:3857'), //alternativa defaultní EPSG:900913
          }
        );
        break;
      case 'WMS_4326':
        newLayer.layer = new OL.Layer.WMS(
          id,
          service.url,
          {
            layers: serviceLayers,
            transparent: 'true',
            format: 'image/png',
            version: service.version || '1.1.1', //use WMS 1.1.1 + EPSG:4326
            CQL_FILTER: typeof zIndex === 'string' ? zIndex : undefined,
          },
          {
            opacity: opacity,
            tileSize: WMSLayersTechSource.tileSizeG || new OL.Size(256, 256), // Use service-defined tile size if available
            isBaseLayer: false,
            visibility: false,
            transitionEffect: 'resize',
            attribution: service.attribution,
            epsg4326: new OL.Projection('EPSG:4326'),
            getURL: getUrl4326,
            getFullRequestString: getFullRequestString4326,
          }
        );
        break;
      case 'XYZ':
        newLayer.layer = new OL.Layer.XYZ(id, service.url, {
          sphericalMercator: true,
          isBaseLayer: false,
          visibility: false,
          RESOLUTION_PROPERTIES: {},
          resolutions: WMSLayersTechSource.resolutions,
          serverResolutions: WMSLayersTechSource.resolutions.slice(0, 'maxZoom' in service && service.maxZoom > 0 ? service.maxZoom : 23),
          transitionEffect: 'resize',
          attribution: service.attribution,
        });
        break;
      default:
        newLayer.layer = null;
    }
    return newLayer;
  }
  /*For GeoServer WMS:

WMS 1.1.1 prefers coordinates in EPSG:4326 (longitude, latitude order).
WMS 1.3.0 uses EPSG:4326 (latitude, longitude order) and supports EPSG:3857 (Web Mercator) natively.
Recommendations:

If your client expects (longitude, latitude) order, use WMS 1.1.1 with EPSG:4326.
If your client expects (latitude, longitude) order or uses web maps (Google, OSM), use WMS 1.3.0 with EPSG:3857.
Summary:

For web mapping (slippy maps), use WMS 1.3.0 + EPSG:3857.
For GIS tools or legacy clients, use WMS 1.1.1 + EPSG:4326.*/

  function addGroupToggler(isDefault, layerSwitcherGroupItemName, layerGroupVisibleName) {
    var group;
    if (isDefault === true) {
      group = document.getElementById(layerSwitcherGroupItemName).parentElement.parentElement;
    } else {
      var layerGroupsList = document.getElementsByClassName('list-unstyled togglers')[0];
      group = document.createElement('li');
      group.className = 'group';
      var togglerContainer = document.createElement('div');
      togglerContainer.className = 'layer-switcher-toggler-tree-category';
      var groupButton = document.createElement('wz-button');
      groupButton.color = 'clear-icon';
      groupButton.size = 'xs';
      var iCaretDown = document.createElement('i');
      iCaretDown.className = 'toggle-category w-icon w-icon-caret-down';
      iCaretDown.dataset.groupId = layerSwitcherGroupItemName.replace('layer-switcher-', '').toUpperCase();
      var togglerSwitch = document.createElement('wz-toggle-switch');
      togglerSwitch.className = layerSwitcherGroupItemName + ' hydrated';
      togglerSwitch.id = layerSwitcherGroupItemName;
      togglerSwitch.checked = true;
      var label = document.createElement('label');
      label.className = 'label-text';
      label.htmlFor = togglerSwitch.id;
      var togglerChildrenList = document.createElement('ul');
      togglerChildrenList.className = 'collapsible-' + layerSwitcherGroupItemName.replace('layer-switcher-', '').toUpperCase();
      label.appendChild(document.createTextNode(layerGroupVisibleName));
      groupButton.addEventListener('click', layerTogglerGroupMinimizerEventHandler(iCaretDown));
      togglerSwitch.addEventListener('click', layerTogglerGroupMinimizerEventHandler(iCaretDown));
      groupButton.appendChild(iCaretDown);
      togglerContainer.appendChild(groupButton);
      togglerContainer.appendChild(togglerSwitch);
      togglerContainer.appendChild(label);
      group.appendChild(togglerContainer);
      group.appendChild(togglerChildrenList);
      layerGroupsList.appendChild(group);
    }
    return group;
  }

  function addLayerToggler(groupToggler, layerName, isPublic, layerArray) {
    var layerToggler = {};
    layerToggler.layerName = layerName;
    layerToggler.serviceType =
      layerArray.filter(function (e) {
        return e.serviceType == 'XYZ';
      }).length > 0
        ? 'XYZ'
        : 'WMS';
    var layerShortcut = layerName.replace(/ /g, '_').replace('.', '');
    layerToggler.htmlItem = 'layer-switcher-item_' + layerShortcut;
    layerToggler.layerArray = layerArray;
    var layer_container = groupToggler.getElementsByTagName('UL')[0];
    var layerGroupCheckbox = groupToggler.getElementsByClassName('layer-switcher-toggler-tree-category')[0].getElementsByTagName('wz-toggle-switch')[0];
    var toggler = document.createElement('li');
    var togglerCheckbox = document.createElement('wz-checkbox');
    togglerCheckbox.id = layerToggler.htmlItem;
    togglerCheckbox.className = 'hydrated';
    var labelSymbol = document.createElement('span');
    labelSymbol.className = isPublic ? 'fa fa-location-arrow' : 'fa fa-lock';
    togglerCheckbox.appendChild(labelSymbol);
    togglerCheckbox.appendChild(document.createTextNode(layerName));
    toggler.appendChild(togglerCheckbox);
    layer_container.appendChild(toggler);
    for (var i = 0; i < layerArray.length; i++) {
      togglerCheckbox.addEventListener('change', layerTogglerEventHandler(layerArray[i]));
      layerGroupCheckbox.addEventListener('change', layerTogglerGroupEventHandler(togglerCheckbox, layerArray[i]));
      layerArray[i].layer.name = layerName + (layerArray.length > 1 ? ' ' + i : '');
    }
    registerKeyShortcut('WMS: ' + layerName, layerKeyShortcutEventHandler(layerGroupCheckbox, togglerCheckbox), layerShortcut);
    return layerToggler;
  }

  function registerKeyShortcut(actionName, callback, keyName) {
    I18n.translations[I18n.locale].keyboard_shortcuts.groups.default.members[keyName] = actionName;
    W.accelerators.addAction(keyName, { group: 'default' });
    W.accelerators.events.register(keyName, null, callback);
    W.accelerators._registerShortcuts({ ['name']: keyName });
  }

  function layerTogglerEventHandler(layerType) {
    return function () {
      if (this.checked) {
        W.map.addLayer(layerType.layer);
        layerType.layer.setVisibility(this.checked);
      } else {
        layerType.layer.setVisibility(this.checked);
        W.map.removeLayer(layerType.layer);
      }
    };
  }

  function layerKeyShortcutEventHandler(groupCheckbox, checkbox) {
    return function () {
      if (!groupCheckbox.disabled) {
        checkbox.click();
      }
    };
  }

  function layerTogglerGroupEventHandler(checkbox, layerType) {
    return function () {
      if (this.checked) {
        if (checkbox.checked) {
          W.map.addLayer(layerType.layer);
          layerType.layer.setVisibility(this.checked && checkbox.checked);
        }
      } else {
        if (checkbox.checked) {
          layerType.layer.setVisibility(this.checked && checkbox.checked);
          W.map.removeLayer(layerType.layer);
        }
      }
      checkbox.disabled = !this.checked;
    };
  }

  function layerTogglerGroupMinimizerEventHandler(iCaretDown) {
    return function () {
      var ulCollapsible = iCaretDown.parentElement.parentElement.parentElement.getElementsByTagName('UL')[0];
      if (!iCaretDown.classList.contains('upside-down')) {
        iCaretDown.classList.add('upside-down');
        ulCollapsible.classList.add('collapse-layer-switcher-group');
      } else {
        iCaretDown.classList.remove('upside-down');
        ulCollapsible.classList.remove('collapse-layer-switcher-group');
      }
    };
  }

  function setZOrdering(layerTogglers) {
    return function () {
      for (var key in layerTogglers) {
        for (var j = 0; j < layerTogglers[key].layerArray.length; j++) {
          if (layerTogglers[key].layerArray[j].zIndex > 0) {
            var l = W.map.getLayerByName(layerTogglers[key].layerName);
            if (l !== undefined) {
              l.setZIndex(layerTogglers[key].layerArray[j].zIndex);
            }
          }
        }
      }
    };
  }

  function getUrl4326(bounds) {
    var newParams = {};
    bounds.transform(this.projection, this.epsg4326);
    newParams.BBOX = bounds.toArray(this.reverseAxisOrder());
    var imageSize = this.getImageSize(bounds);
    newParams.WIDTH = imageSize.w;
    newParams.HEIGHT = imageSize.h;
    // newParams.WIDTH = 742;
    // newParams.HEIGHT = 485;
    //from geoserver
    // newParams.WIDTH = 648;
    // newParams.HEIGHT = 768;
    var requestString = this.getFullRequestString(newParams);
    return requestString;
  }

  function getFullRequestString4326(newParams) {
    this.params.SRS = 'EPSG:4326';
    return OL.Layer.Grid.prototype.getFullRequestString.apply(this, arguments);
  }

  // After all WMSLayerTogglers are created:

  // --- Layer toggler state persistence ---
  // Utility to save all toggler states
  function saveLayerTogglerStates() {
    if (!localStorage) return;
    const state = {};
    for (const key in WMSLayerTogglers) {
      const togglerId = WMSLayerTogglers[key].htmlItem;
      const toggler = document.getElementById(togglerId);
      if (toggler) state[key] = toggler.checked;
    }
    localStorage.WMSLayers = JSON.stringify(state);
  }

  // Utility to restore all toggler states
  function restoreLayerTogglerStates() {
    if (!localStorage.WMSLayers) return;
    const state = JSON.parse(localStorage.WMSLayers);
    for (const key in state) {
      if (WMSLayerTogglers[key]) {
        const togglerId = WMSLayerTogglers[key].htmlItem;
        const toggler = document.getElementById(togglerId);
        if (toggler && toggler.checked !== state[key]) {
          toggler.checked = state[key];
          toggler.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    }
  }

  // Attach change listeners to save state on toggle
  for (const key in WMSLayerTogglers) {
    const togglerId = WMSLayerTogglers[key].htmlItem;
    const toggler = document.getElementById(togglerId);
    if (toggler) {
      toggler.addEventListener('change', saveLayerTogglerStates);
    }
  }
  // Restore state after togglers are created
  restoreLayerTogglerStates();

function scriptupdatemonitor() {
  if (WazeToastr?.Ready) {
    // Create and start the ScriptUpdateMonitor
    const updateMonitor = new WazeToastr.Alerts.ScriptUpdateMonitor(scriptName, scriptVersion, downloadUrl, GM_xmlhttpRequest);

    // Check immediately on page load, then every 2 hours
    updateMonitor.start(2, true); // checkImmediately = true

    // Show the update dialog for the current version
    WazeToastr.Interface.ShowScriptUpdate(scriptName, scriptVersion, updateMessage, downloadUrl);
  } else {
    setTimeout(scriptupdatemonitor, 250);
  }
}
scriptupdatemonitor();
console.log(`${scriptName} initialized.`);

  //document.addEventListener('wme-map-data-loaded', init, { once: true });
  document.addEventListener('wme-map-data-loaded', () => setTimeout(init, 2000), { once: true });
  /*
changeLog
2025.12.27.00
- Temporary Fix for alert not displaying issue.
2025.12.05.01
- Added delayed loading of WMS layers to ensure map data is fully loaded.
2025.11.29.01
- Added layers: Health Facilities from National Geoportal, Police Units from National Geoportal.
2025.08.30.01
- ZIndex update for : Education Facilities (PRTMP),<br> Health Facilities (PRTMP),<br> Palika Centre (PRTMP),<br> Ward Centre (PRTMP),<br> Tourist Attraction,<br> Customs Office <br> Bridges (BSM),<br> Bridges (PRTMP),<br> and Lalitpur Metropolitan City (LMC) layers.
version: 2025.07.27.1 - Added Layers:
  - Rivers
  - Education Facilities (PRTMP)
  - Health Facilities (PRTMP)
  - Palika Centre (PRTMP)
  - Ward Centre (PRTMP)
  - Tourist Attraction
  - Customs Office
  - National Highways 2023
  - Province Highways 2023
  - Province Roads 2023
  - Bridges (BSM)
  - Bridges (PRTMP)
  - and popup support for above layers and more.
version: 2025.07.24.01 - It now supports to display popup for highway with various information.
version: 2025.06.23.01 - Added diagonal (↖, ↗, ↙, ↘) shift buttons for WMS layers.
                       - Shows alert when the shift is reset to default.
version: 2025.06.08.01 - Now the WMS layer can be shifted by a specified distance in meters.
Version: 2025.06.06.02 - Added Bridge Management System bridge locations!
                       - Loaded layers will be reloaded even after the page refresh.
Version: 2025.06.06.01 - Added Bridge Management System bridge locations!
version: 2025.05.11.01 - Fixed Z-ordering
version: 2025.04.13.01 - Fixed Combatible with the latest wme beta v2.287-5! Now it monitors the script update!
version: 2025.03.06.01 - Now LMC HN can be filtered by ward
version: 2025.02.03.01 - Line modification
version: 2025.02.01.02 - Added support for WazeToastr update dialogue box
version: 2025.02.01.01 - Modified how WMS 4326 image is displayed
version: "1.0", message: "Initial Version"

*/
})();
