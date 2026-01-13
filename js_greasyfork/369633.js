// ==UserScript==
// @name         WME FC Layer
// @namespace    https://greasyfork.org/users/45389
// @version      2025.11.21.000
// @description  Adds a Functional Class layer for states that publish ArcGIS FC data.
// @author       MapOMatic / JS55CT
// @match        *://*.waze.com/*editor*
// @exclude      *://*.waze.com/user/editor*
// @exclude      *://*.waze.com/editor/sdk/*
// @license      GNU GPLv3
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @require      https://greasyfork.org/scripts/39002-bluebird/code/Bluebird.js?version=255146
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7/turf.min.js
// @require      https://update.greasyfork.org/scripts/509664/WME%20Utils%20-%20Bootstrap.js
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @connect      arcgis.com
// @connect      gis.ardot.gov
// @connect      azdot.gov
// @connect      ca.gov
// @connect      coloradodot.info
// @connect      delaware.gov
// @connect      dc.gov
// @connect      ga.gov
// @connect      uga.edu
// @connect      hawaii.gov
// @connect      idaho.gov
// @connect      in.gov
// @connect      iowadot.gov
// @connect      illinois.gov
// @connect      ksdot.org
// @connect      ky.gov
// @connect      la.gov
// @connect      maine.gov
// @connect      md.gov
// @connect      ma.us
// @connect      mn.us
// @connect      nv.gov
// @connect      memphistn.gov
// @connect      state.mi.us
// @connect      modot.org
// @connect      mt.gov
// @connect      unh.edu
// @connect      nh.gov
// @connect      ny.gov
// @connect      ncdot.gov
// @connect      nd.gov
// @connect      oh.us
// @connect      or.us
// @connect      penndot.gov
// @connect      sd.gov
// @connect      shelbycountytn.gov
// @connect      utah.gov
// @connect      vermont.gov
// @connect      wa.gov
// @connect      wv.gov
// @connect      wyoroad.info
// @downloadURL https://update.greasyfork.org/scripts/369633/WME%20FC%20Layer.user.js
// @updateURL https://update.greasyfork.org/scripts/369633/WME%20FC%20Layer.meta.js
// ==/UserScript==

/* global turf */
/* global bootstrap */
/* global $ */

(async function main() {
  'use strict';
  /**
   * @typedef {Object} FetchContext
   * @property {Object} parentContext - Context of parent request, includes cancel flag, call counts, etc.
   * @property {string} stateAbbr - State abbreviation (e.g., 'CA').
   * @property {Object} state - State configuration (from STATE_SETTINGS).
   * @property {Object} mapContext - Map context, includes `zoom` (number) and `extent` ([number, number, number, number]).
   * @property {Object} layer - Layer metadata/config.
   *
   * @typedef {Object} ArcGISFeature
   * @property {Object} geometry - Geometry information (with paths property).
   * @property {Object} attributes - Feature data fields.
   *
   * @typedef {Object} StateLayerConfig
   * @property {number} layerID
   * @property {string} fcPropName
   * @property {string} idPropName
   * @property {string[]} outFields
   * @property {Object} roadTypeMap
   * @property {number} maxRecordCount
   * @property {boolean} supportsPagination
   *
   * @typedef {Object} StateSetting
   * @property {string} baseUrl
   * @property {Object} defaultColors
   * @property {StateLayerConfig[]} fcMapLayers
   * @property {function(): boolean} [isPermitted]
   * @property {function(ArcGISFeature, StateLayerConfig): string} getFeatureRoadType
   * @property {function(string, StateLayerConfig): string} [getRoadTypeFromFC]
   * @property {function(FetchContext): string|null} [getWhereClause]
   * @property {function(string, number): StateLayerConfig|undefined} [getMapLayer]
   * @property {Object} [information]
   * @property {string[]} [roadTypes]
   * @property {any} [key]
   */

  /** @type {string} Name of localStorage key holding user settings */
  const settingsStoreName = 'wme_fc_layer';

  /** @type {boolean} Enable debug logging */
  const debug = false;

  /** @type {string} Script version (for display in UI) */
  const scriptVersion = GM_info.script.version;

  /** @type {string} Userscript update URL */
  const downloadUrl = 'https://greasyfork.org/scripts/369633-wme-fc-layer/code/WME%20FC%20Layer.user.js';

  /** @type {string} Layer name registered with SDK and displayed in layer controls */
  const layerName = 'FC Layer';

  /**
   * @type {boolean} True if current user is an Area Manager.
   */
  let isAM = false;

  /**
   * @type {string} Lowercased Waze editor username for current user.
   */
  let userNameLC;

  /**
   * @type {Object} Stores UI/user script settings loaded from localStorage.
   */
  let settings = {};

  /**
   * @type {number} User's editor rank (Waze "rank" in the SDK is 0 based so + 1).
   */
  let rank;

  /**
   * @type {number} Z-index for the FC Layer (ensures it is below roads).
   */
  let MAP_LAYER_Z_INDEX;

  /**
   * @constant
   * @type {number} Minimum zoom level at which FC Layer will show.
   */
  const MIN_ZOOM_LEVEL = 11;

  /**
   * @type {number|null} Current WME map zoom level (used in style predicates).
   */
  let CURRENT_ZOOM = null;

  /**
   * @type {Object} Reference to WME Utils Bootstrap SDK, asynchronously loaded.
   */
  const sdk = await bootstrap({ scriptUpdateMonitor: { downloadUrl } });

  /**
   * Mapping of State full names to abbreviations.
   * @type {Object.<string, string>}
   */
  const STATES_HASH = {
    Alabama: 'AL',
    Alaska: 'AK',
    'American Samoa': 'AS',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    Delaware: 'DE',
    'District of Columbia': 'DC',
    'Federated States Of Micronesia': 'FM',
    Florida: 'FL',
    Georgia: 'GA',
    Guam: 'GU',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
    'Marshall Islands': 'MH',
    Maryland: 'MD',
    Massachusetts: 'MA',
    Michigan: 'MI',
    Minnesota: 'MN',
    Mississippi: 'MS',
    Missouri: 'MO',
    Montana: 'MT',
    Nebraska: 'NE',
    Nevada: 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Palau: 'PW',
    Pennsylvania: 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    'Virgin Islands': 'VI',
    Virginia: 'VA',
    Washington: 'WA',
    'West Virginia': 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY',
  };

  function reverseStatesHash(stateAbbr) {
    // eslint-disable-next-line no-restricted-syntax
    for (const stateName in STATES_HASH) {
      if (STATES_HASH[stateName] === stateAbbr) return stateName;
    }
    throw new Error(`FC Layer: reverseStatesHash function did not return a value for ${stateAbbr}.`);
  }

  /**
   * STATE_SETTINGS maps state abbreviations to layer configuration and FC business logic for each supported state.
   * Keys are US state abbreviations, values are objects defining fetch URLs, color schemes, query strategies, handler functions, etc.
   * @type {Object.<string, StateSetting>}
   */
  const STATE_SETTINGS = {
    global: {
      roadTypes: ['St', 'PS', 'PS2', 'mH', 'MH', 'Ew', 'Rmp', 'Fw'], // Ew = Expressway.  For FC's that make it uncertain if they should be MH or FW.
      getFeatureRoadType(feature, layer) {
        const fc = feature.attributes[layer.fcPropName];
        return this.getRoadTypeFromFC(fc, layer);
      },
      getRoadTypeFromFC(fc, layer) {
        return Object.keys(layer.roadTypeMap).find((rt) => layer.roadTypeMap[rt].indexOf(fc) !== -1);
      },
      isPermitted(stateAbbr) {
        const state = STATE_SETTINGS[stateAbbr];
        if (state.isPermitted) return state.isPermitted();
        return (rank >= 3 && isAM) || rank >= 4;
      },
      getMapLayer(stateAbbr, layerID) {
        let returnValue;
        STATE_SETTINGS[stateAbbr].fcMapLayers.forEach((layer) => {
          if (layer.layerID === layerID) {
            returnValue = layer;
          }
        });
        return returnValue;
      },
    },
    AL: {
      baseUrl: 'https://services.arcgis.com/LZzQi3xDiclG6XvQ/arcgis/rest/services/HPMS_Year2017_F_System_Data/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'F_SYSTEM_V',
          idPropName: 'OBJECTID',
          outFields: ['FID', 'F_SYSTEM_V', 'State_Sys'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 3;
      },
      information: { Source: 'ALDOT', Permission: 'Visible to R3+', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} <> 7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let fc = parseInt(feature.attributes[layer.fcPropName], 10);
        if (fc > 4 && feature.attributes.State_Sys === 'YES') {
          fc = 4;
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    AK: {
      baseUrl: 'https://services.arcgis.com/r4A0V7UzH9fcLVvv/ArcGIS/rest/services/AKDOTPF_Route_Data/FeatureServer/',
      defaultColors: {
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 13,
          fcPropName: 'Functional_Class',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'Functional_Class'],
          roadTypeMap: {
            Ew: [1, 2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'Alaska DOT&PF', Permission: 'Visible to R4+ or R3-AM', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} <> 7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    AZ: {
      baseUrl: 'https://services1.arcgis.com/XAiBIVuto7zeZj1B/arcgis/rest/services/ATIS_prod_gdb/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#ff00c5',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1] },
      fcMapLayers: [
        {
          layerID: 38,
          fcPropName: 'FunctionalClass',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FunctionalClass', 'RouteId'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'ADOT', Permission: 'Visible to R4+ or R3-AM' },
      getWhereClause() {
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        const roadID = attr.RouteId.trim().replace(/  +/g, ' ');
        const roadNum = parseInt(roadID.substring(2, 5), 10);
        let fc = attr[layer.fcPropName];
        switch (fc) {
          case 'Rural Principal Arterial - Interstate':
          case 'Urban Principal Arterial - Interstate':
            fc = 1;
            break;
          case 'Rural Principal Arterial - Other Fwys & Expwys':
          case 'Urban Principal Arterial - Other Fwys & Expwys':
            fc = 2;
            break;
          case 'Rural Principal Arterial - Other':
          case 'Urban Principal Arterial - Other':
            fc = 3;
            break;
          case 'Rural Minor Arterial':
          case 'Urban Minor Arterial':
            fc = 4;
            break;
          case 'Rural Major Collector':
          case 'Urban Major Collector':
            fc = 5;
            break;
          case 'Rural Minor Collector':
          case 'Urban Minor Collector':
            fc = 6;
            break;
          default:
            fc = 7;
        }
        const azIH = [8, 10, 11, 17, 19, 40]; // Interstate hwys in AZ
        const isUS = /^U\D\d{3}\b/.test(roadID);
        const isState = /^S\D\d{3}\b/.test(roadID);
        const isBiz = /^SB\d{3}\b/.test(roadID);
        if (fc > 4 && isState && azIH.includes(roadNum) && isBiz) fc = 4;
        else if (fc > 4 && isUS) fc = isBiz ? 6 : 4;
        else if (fc > 6 && isState) fc = isBiz ? 7 : 6;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    AR: {
      baseUrl: 'https://gis.ardot.gov/hosting/rest/services/SIR_TIS/RoadInvDissolves/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FunctionalClass',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FunctionalClass', 'AH_Route', 'AH_Section'],
          roadTypeMap: {
            Fw: [1, 2],
            Ew: [],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'ARDOT', Permission: 'Visible to R4+ or R3-AM' },
      getWhereClause() {
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = parseInt(attr[layer.fcPropName], 10);
        const roadID = parseInt(attr.AH_Route, 10);
        const usHwys = [49, 59, 61, 62, 63, 64, 65, 67, 70, 71, 79, 82, 165, 167, 270, 271, 278, 371, 412, 425];
        const isUS = usHwys.includes(roadID);
        const isState = roadID < 613;
        const isBiz = attr.AH_Section[attr.AH_Section.length - 1] === 'B';
        if (fc > 3 && isUS) fc = isBiz ? 4 : 3;
        else if (fc > 4 && isState) fc = isBiz ? 5 : 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    CA: {
      baseUrl: 'https://caltrans-gis.dot.ca.gov/arcgis/rest/services/CHhighway/CRS_Functional_Classification/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'F_System',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'F_System'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return ['mapomatic', 'turbomkt', 'tonestertm', 'ottonomy', 'jemay', 'ojlaw', 'js55ct'].includes(userNameLC);
      },
      information: { Source: 'Caltrans', Permission: 'Visible to ?', Description: '' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} <> 7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const fc = parseInt(feature.attributes[layer.fcPropName], 10);
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    CO: {
      baseUrl: 'https://dtdapps.coloradodot.info/arcgis/rest/services/CPLAN/open_data_sde/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 11,
          fcPropName: 'FUNCCLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCCLASS', 'ROUTE', 'REFPT'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 14,
          fcPropName: 'FUNCCLASSID',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCCLASSID', 'ROUTE', 'FIPSCOUNTY'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 17,
          fcPropName: 'FUNCCLASSID',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCCLASSID', 'ROUTE', 'FIPSCOUNTY'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 3;
      },
      information: {
        Source: 'CDOT',
        Permission: 'Visible to R3+',
        Description: 'Please consult with a state manager before making any changes to road types based on the data presented.',
      },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} <> '7'`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = parseInt(attr[layer.fcPropName], 10);
        const route = attr.ROUTE.replace(/  +/g, ' ');
        if (layer.layerID === 7) {
          const rtnum = parseInt(route.slice(0, 3), 10);
          const refpt = attr.REFPT;
          const hwys = [6, 24, 25, 34, 36, 40, 50, 70, 84, 85, 87, 138, 160, 285, 287, 350, 385, 400, 491, 550];
          // Exceptions first, then normal classification
          const doNothing = ['024D', '040G'];
          const notNothing = ['070K', '070L', '070O', '070Q', '070R'];
          const doMin = ['024E', '050D', '070O', '085F', '160D'];
          if (doNothing.includes(route) || (rtnum === 70 && route !== '070K' && !notNothing.includes(route))) {
            // do nothing
          } else if (doMin.includes(route) || (rtnum === 40 && refpt > 320 && refpt < 385) || (rtnum === 36 && refpt > 79 && refpt < 100.99) || (route === '034D' && refpt > 11)) {
            fc = 4;
          } else if (hwys.includes(rtnum)) {
            fc = Math.min(fc, 3);
          } else {
            fc = Math.min(fc, 4);
          }
        } else {
          // All exceptions
          const fips = parseInt(attr.FIPSCOUNTY, 10);
          if ((fips === 19 && route === 'COLORADO BD') || (fips === 37 && (route === 'GRAND AV' || route === 'S H6'))) {
            fc = 3;
          } else if (fips === 67 && route === 'BAYFIELDPAY') {
            fc = 4;
          }
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    CT: {
      baseUrl: 'https://services1.arcgis.com/FCaUeJ5SOVtImake/ArcGIS/rest/services/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 3,
          layerPath: 'CTDOT_Roadway_Classification_and_Characteristic_Data/FeatureServer/',
          fcPropName: 'FC_FC_CODE',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FC_FC_CODE'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 0,
          layerPath: 'CTDOT_State_Routes_and_Local_Roads/FeatureServer/',
          fcPropName: 'ROUTE_PREFIX',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'ROUTE_PREFIX'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 3;
      },
      information: { Source: 'CTDOT', Permission: 'Visible to R3+', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          if (context.layer.layerID === 3) {
            return `${context.layer.fcPropName} <> 7`;
          }
          if (context.layer.layerID === 'CTDOT_State_Routes_and_Local_Roads/FeatureServer/0') {
            return `${context.layer.fcPropName} IN ('I', 'CT', 'SR', 'US')`;
          }
          return null;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let fc;
        let primaryFc;
        let secondaryFc;

        if (layer.layerID === 3) {
          // Extract primary FC based on 'FC_FC_CODE'
          primaryFc = parseInt(feature.attributes[layer.fcPropName], 10);
        } else if (layer.layerID === 0) {
          // Determine secondary FC using 'ROUTE_PREFIX'
          const prefix = feature.attributes[layer.fcPropName];

          if (prefix === 'I') {
            secondaryFc = 1;
          } else if (prefix === 'US') {
            secondaryFc = 3;
          } else if (prefix === 'CT' || prefix === 'SR') {
            secondaryFc = 4;
          }
        }

        // Determine fc based on available values
        if (typeof primaryFc !== 'undefined' && typeof secondaryFc !== 'undefined') {
          fc = Math.min(primaryFc, secondaryFc);
        } else if (typeof primaryFc !== 'undefined') {
          fc = primaryFc;
        } else if (typeof secondaryFc !== 'undefined') {
          fc = secondaryFc;
        } else {
          fc = null; // Default if both are undefined, decide handling of null based on safeguards or other logic
        }

        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    DE: {
      baseUrl: 'https://enterprise.firstmap.delaware.gov/arcgis/rest/services/Transportation/DE_Roadways_Main/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 16,
          fcPropName: 'VALUE_TEXT',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'VALUE_TEXT'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: {
            Fw: ['Interstate'],
            Ew: ['Other Expressways & Freeway'],
            MH: ['Other Principal Arterials'],
            mH: ['Minor Arterial'],
            PS: ['Major Collector', 'Minor Collector'],
            St: ['Local'],
          },
        },
      ],
      information: { Source: 'Delaware FirstMap', Permission: 'Visible to R4+ or R3-AM', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} <> 'Local'`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    DC: {
      baseUrl: 'https://maps2.dcgis.dc.gov/dcgis/rest/services/DCGIS_DATA/Transportation_WebMercator/MapServer/',
      supportsPagination: false,
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#149ece',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fetchAllFC: false,
      fcMapLayers: [
        {
          layerID: 48,
          fcPropName: 'FHWAFUNCTIONALCLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FHWAFUNCTIONALCLASS'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
        },
      ],
      information: { Source: 'DDOT', Permission: 'Visible to R4+ or R3-AM' },
      getWhereClause() {
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    FL: {
      baseUrl: 'https://services1.arcgis.com/O1JpcwDW8sjYuddV/ArcGIS/rest/services/Functional_Classification_TDA/FeatureServer/',
      supportsPagination: false,
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fetchAllFC: false,
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FUNCLASS',
          idPropName: 'FID',
          outFields: ['FID', 'FUNCLASS'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: {
            Fw: ['01', '11'],
            Ew: ['02', '12'],
            MH: ['04', '14'],
            mH: ['06', '16'],
            PS: ['07', '08', '17', '18'],
          },
        },
      ],
      information: { Source: 'FDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Raw unmodified FC data.' },
      getWhereClause() {
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    GA: {
      baseUrl: 'https://maps.itos.uga.edu/arcgis/rest/services/GDOT/GDOT_FunctionalClass/mapserver/',
      supportsPagination: true,
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fetchAllFC: false,
      /* eslint-disable object-curly-newline */
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'SYSTEM_CODE'],
          maxRecordCount: 1000,
          supportsPagination: true,
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6] },
        },
        {
          layerID: 1,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'SYSTEM_CODE'],
          maxRecordCount: 1000,
          supportsPagination: true,
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6] },
        },
        {
          layerID: 2,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'SYSTEM_CODE'],
          maxRecordCount: 1000,
          supportsPagination: true,
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6] },
        },
        {
          layerID: 3,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'SYSTEM_CODE'],
          maxRecordCount: 1000,
          supportsPagination: true,
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6] },
        },
        {
          layerID: 4,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'SYSTEM_CODE'],
          maxRecordCount: 1000,
          supportsPagination: true,
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6] },
        },
        {
          layerID: 5,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'SYSTEM_CODE'],
          maxRecordCount: 1000,
          supportsPagination: true,
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6] },
        },
        {
          layerID: 6,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'SYSTEM_CODE'],
          maxRecordCount: 1000,
          supportsPagination: true,
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6] },
        },
      ],
      /* eslint-enable object-curly-newline */
      information: { Source: 'GDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause() {
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        const attr = feature.attributes;
        const fc = attr.FUNCTIONAL_CLASS;
        if (attr.SYSTEM_CODE === '1' && fc > 4) {
          return STATE_SETTINGS.global.getRoadTypeFromFC(4, layer);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    HI: {
      baseUrl: 'https://geodata.hawaii.gov/arcgis/rest/services/Transportation/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 12,
          fcPropName: 'f_system',
          idPropName: 'objectid',
          outFields: ['objectid', 'f_system'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'HDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    ID: {
      baseUrl: 'https://gisportalp.itd.idaho.gov/xserver/rest/services/RH_GeneralService/MapServer/',
      supportsPagination: false,
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#149ece',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fetchAllFC: true,
      /* eslint-disable object-curly-newline */
      fcMapLayers: [
        {
          layerID: 67,
          fcPropName: 'FunctionalClass',
          idPropName: 'ObjectId',
          outFields: ['ObjectId', 'FunctionalClass'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6] },
        },
      ],
      /* eslint-enable object-curly-newline */
      information: { Source: 'ITD', Permission: 'Visible to R4+ or R3-AM', Description: 'Raw unmodified FC data.' },
      getWhereClause() {
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    IL: {
      baseUrl: 'https://gis1.dot.illinois.gov/arcgis/rest/services/AdministrativeData/FunctionalClass/MapServer/',
      supportsPagination: false,
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#ff00c5',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1] },
      fcMapLayers: [
        {
          layerID: 0,
          idPropName: 'OBJECTID',
          fcPropName: 'FC',
          outFields: ['FC'],
          roadTypeMap: {
            Fw: ['1'],
            Ew: ['2'],
            MH: ['3'],
            mH: ['4'],
            PS: ['5', '6'],
            St: ['7'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 4;
      },
      information: { Source: 'IDOT', Permission: 'Visible to R4+', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        return context.mapContext.zoom < 16 ? 'FC<>7' : null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    IN: {
      baseUrl: 'https://gis.indot.in.gov/ro/rest/services/DOT/INDOT_LTAP/MapServer/',
      supportsPagination: false,
      overrideUrl: '1Sbwc7e6BfHpZWSTfU3_1otXGSxHrdDYcbn7fOf1VjpA',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#149ece',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: {
        maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1],
        excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []],
        hideRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []],
      },
      fcMapLayers: [
        {
          layerID: 10,
          idPropName: 'OBJECTID',
          fcPropName: 'FUNCTIONAL_CLASS',
          outFields: ['FUNCTIONAL_CLASS', 'OBJECTID', 'TO_DATE'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 100000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return true;
      },
      information: { Source: 'INDOT', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        let whereParts = ['TO_DATE IS NULL'];
        if (context.mapContext.zoom < 16) {
          whereParts += ` AND ${context.layer.fcPropName} <> 7`;
        }
        return whereParts;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    IA: {
      baseUrl: 'https://gis.iowadot.gov/agshost/rest/services/RAMS/Road_Network/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#149ece',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
        PSGr: '#cc6533',
        StGr: '#e99cb6',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FED_FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FED_FUNCTIONAL_CLASS', 'STATE_ROUTE_NAME_1', 'ACCESS_CONTROL', 'SURFACE_TYPE'],
          roadTypeMap: {
            Fw: [1],
            MH: [2, 3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'Iowa DOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Additional colors denote unpaved PS and LS segements.' },
      getWhereClause(context) {
        let theWhereClause = 'FACILITY_TYPE<>7'; // Removed proposed roads
        if (context.mapContext.zoom < 16) {
          theWhereClause += ` AND ${context.layer.fcPropName}<7`;
        }
        return theWhereClause;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = parseInt(attr[layer.fcPropName], 10);
        const isFw = attr.ACCESS_CONTROL === 1;
        const isUS = /^STATE OF IOWA, US/.test(attr.STATE_ROUTE_NAME_1);
        const isState = /^STATE OF IOWA, IA/.test(attr.STATE_ROUTE_NAME_1);
        if (isFw) fc = 1;
        else if (fc > 3 && isUS) fc = 3;
        else if (fc > 4 && isState) fc = 4;
        if (fc > 4 && attr.SURFACE_TYPE === 20) {
          return fc < 7 ? 'PSGr' : 'StGr';
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    KS: {
      baseUrl: 'http://wfs.ksdot.org/arcgis_web_adaptor/rest/services/Transportation/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 3,
          layerPath: 'Functional_Classification/MapServer/',
          idPropName: 'Id',
          fcPropName: 'FunctionalClassification',
          outFields: ['FunctionalClassification', 'Id'],
          roadTypeMap: {
            Fw: [1],
            MH: [2, 3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },

        // 2024-03-20 (mapomatic) The "non-state system" layer was removed from the KS server,
        // so we're forced to use the function_classification layer (above) which doesn't include
        // any metadata for US/state road designations. I'm leaving the old layers commented below
        // in case they're of use in the future.

        // {
        //     layerID: 0,
        //     layerPath: 'Non_State_System/MapServer/',
        //     idPropName: 'ID2',
        //     fcPropName: 'FUNCLASS',
        //     outFields: ['FUNCLASS', 'ID2', 'ROUTE_ID'],
        //     roadTypeMap: {
        //         Fw: [1], MH: [2, 3], mH: [4], PS: [5, 6], St: [7]
        //     },
        //     maxRecordCount: 1000,
        //     supportsPagination: false
        // },
        {
          layerID: 0,
          layerPath: 'State_System/MapServer/',
          idPropName: 'OBJECTID',
          fcPropName: 'FUN_CLASS_CD',
          outFields: ['FUN_CLASS_CD', 'OBJECTID', 'NHS'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 3 || isAM;
      },
      information: { Source: 'KDOT', Permission: 'Visible to area managers', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<>'7'`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = parseInt(attr[layer.fcPropName], 10);
        const roadNHS = attr.NHS;
        const isUS = roadNHS === 'YES';
        const isState = roadNHS === 'NO';
        if (fc > 3 && isUS) fc = 3;
        else if (fc > 4 && isState) fc = 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    KY: {
      baseUrl: 'https://maps.kytc.ky.gov/arcgis/rest/services/BaseMap/System/MapServer/',
      supportsPagination: false,
      defaultColors: {
        Fw: '#ffaac5',
        Ew: '#ff00c5',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1] },
      /* eslint-disable object-curly-newline */
      fcMapLayers: [
        {
          layerID: 0,
          idPropName: 'OBJECTID',
          fcPropName: 'FC',
          outFields: ['FC', 'OBJECTID', 'RT_PREFIX', 'RT_SUFFIX'],
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6], St: [7] },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return true;
      },
      information: { Source: 'KYTC', Permission: 'Visible to All', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = parseInt(attr[layer.fcPropName], 10);
        if (fc > 3 && attr.RT_PREFIX === 'US') {
          const suffix = attr.RT_SUFFIX;
          fc = suffix && suffix.indexOf('X') > -1 ? 4 : 3;
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    LA: {
      baseUrl: 'https://maps.dotd.la.gov/road/rest/services/Roads_and_Highways_OpenData/FeatureServer/',
      supportsPagination: false,
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      /* eslint-disable object-curly-newline */
      fcMapLayers: [
        {
          layerID: 84,
          fcPropName: 'FunctionalSystem',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FunctionalSystem', 'RouteID'],
          roadTypeMap: { Fw: [1], Ew: [2], MH: [3], mH: [4], PS: [5, 6], St: [7] },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      /* eslint-enable object-curly-newline */
      information: { Source: 'LaDOTD', Permission: 'Visible to R4+ or R3-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let fc = feature.attributes[layer.fcPropName];
        if (fc === '2a' || fc === '2b') {
          fc = 2;
        }
        fc = parseInt(fc, 10);
        const route = feature.attributes.RouteID.split('_')[1].trim();
        const isUS = /^US \d/.test(route);
        const isState = /^LA \d/.test(route);
        const isBiz = / BUS$/.test(route);
        if (fc > 3 && isUS) fc = isBiz ? 4 : 3;
        else if (fc > 4 && isState) fc = isBiz ? 5 : 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    ME: {
      baseUrl: 'https://arcgisserver.maine.gov/arcgis/rest/services/mdot/MaineDOT_Dynamic/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 6,
          fcPropName: 'fedfunccls',
          idPropName: 'objectid',
          outFields: ['objectid', 'fedfunccls'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'MaineDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Raw unmodified FC data.' },
      isPermitted() {
        return rank >= 4 || (rank === 3 && isAM);
      },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<>'Local'`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = attr[layer.fcPropName];
        switch (fc) {
          case 'Interstate':
            fc = 1;
            break;
          case 'Other Freeway or Expressway':
            fc = 2;
            break;
          case 'Other Principal Arterial':
            fc = 3;
            break;
          case 'Minor Arterial':
            fc = 4;
            break;
          case 'Major Collector':
          case 'Minor Collector':
            fc = 5;
            break;
          default:
            fc = 7;
        }
        // 2024-6-28 (mapomatic) MaineDOT removed the prirtename field so we can't "upgrade" FC anymore.
        // const route = attr.prirtename;
        // const isUS = /^US \d/.test(route);
        // const isState = /^ST RTE \d/.test(route);
        // const isBiz = (isUS && /(1B|1BS)$/.test(route)) || (isState && /(15B|24B|25B|137B)$/.test(route));
        // if (fc > 3 && isUS) fc = isBiz ? 4 : 3;
        // else if (fc > 4 && isState) fc = isBiz ? 5 : 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    MD: {
      baseUrl: 'https://services.arcgis.com/njFNhDsUCentVYJW/arcgis/rest/services/MDOT_SHA_Roadway_Functional_Classification/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#ffff00',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'ID_PREFIX', 'MP_SUFFIX'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'MDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return "(FUNCTIONAL_CLASS < 7 OR ID_PREFIX IN('MD'))";
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = parseInt(attr.FUNCTIONAL_CLASS, 10);
        const isUS = attr.ID_PREFIX === 'US';
        const isState = attr.ID_PREFIX === 'MD';
        const isBiz = attr.MP_SUFFIX === 'BU';
        if (fc > 3 && isUS) fc = isBiz ? 4 : 3;
        else if (fc > 4 && isState) fc = isBiz ? 5 : 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    MA: {
      baseUrl: 'https://gis.massdot.state.ma.us/arcgis/rest/services/Roads/RoadInventory/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'F_F_Class',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'F_F_Class', 'route_id'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'MDOT', Permission: 'Visible to R2+', Description: 'Federal and State highways set to a minimum of mH.' },
      isPermitted() {
        return rank >= 2;
      },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<>7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = parseInt(attr[layer.fcPropName], 10);
        const route = attr.route_id;
        const isUS = /^US\d/.test(route);
        const isState = /^SR\d/.test(route);
        if (fc > 3 && isUS) fc = 3;
        else if (fc > 4 && isState) fc = 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    MI: {
      baseUrl: 'https://mdotgis.state.mi.us/arcgis/rest/services/DataAccess/NfcNhsPub/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#149ece',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 353,
          idPropName: 'OBJECTID',
          fcPropName: 'FunctionalSystem',
          outFields: ['FunctionalSystem'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return true;
      },
      information: { Source: 'MDOT', Permission: 'Visible to All', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    MN: {
      baseUrl: 'https://webgis.dot.state.mn.us/lrsfed1/rest/services/emma/emma_op/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#149ece',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 13,
          idPropName: 'OBJECTID',
          fcPropName: 'FUNCTIONAL_CLASS',
          outFields: ['FUNCTIONAL_CLASS', 'ROUTE_ID'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return true;
      },
      information: { Source: 'MnDOT', Permission: 'Visible to All', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<>7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    MO: {
      baseUrl: 'https://mapping.modot.org/arcgis/rest/services/BaseMap/TmsUtility/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 5,
          fcPropName: 'FUNC_CLASS_NAME',
          idPropName: 'SS_PAVEMENT_ID',
          outFields: ['SS_PAVEMENT_ID', 'FUNC_CLASS_NAME', 'TRAVELWAY_DESG', 'TRAVELWAY_NAME', 'ACCESS_CAT_NAME'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 3 || (rank >= 2 && isAM);
      },
      information: { Source: 'MoDOT', Permission: 'Visible to R3+ or R2-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 13) {
          return '1=0'; // WME very laggy at zoom 0
        }
        // Remove duplicate rows, but suss out interstate business loops
        return "FUNC_CLASS_NAME <> ' ' AND (TRAVELWAY_ID = CNTL_TW_ID OR (TRAVELWAY_ID <> CNTL_TW_ID AND TRAVELWAY_DESG = 'LP'))";
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = attr[layer.fcPropName];
        const rtType = attr.TRAVELWAY_DESG;
        const route = attr.TRAVELWAY_NAME;
        switch (fc) {
          case 'INTERSTATE':
            fc = 1;
            break;
          case 'FREEWAY':
            fc = 2;
            break;
          case 'PRINCIPAL ARTERIAL':
            fc = 3;
            break;
          case 'MINOR ARTERIAL':
            fc = 4;
            break;
          case 'MAJOR COLLECTOR':
            fc = 5;
            break;
          case 'MINOR COLLECTOR':
            fc = 6;
            break;
          default:
            fc = 8; // not a typo
        }
        const usHwys = ['24', '36', '40', '50', '54', '56', '59', '60', '61', '62', '63', '65', '67', '69', '71', '136', '159', '160', '166', '169', '275', '400', '412'];
        const isUS = ['US', 'LP'].includes(rtType); // is US or interstate biz
        const isState = ['MO', 'AL'].includes(rtType);
        const isSup = rtType === 'RT';
        const isBiz = ['BU', 'SP'].includes(rtType) || /BUSINESS .+ \d/.test(route);
        const isUSBiz = isBiz && usHwys.includes(route);
        if ((fc === 2 && attr.ACCESS_CAT_NAME !== 'FULL') || (fc > 3 && isUS)) fc = 3;
        else if (fc > 4 && (isState || isUSBiz)) fc = 4;
        else if (fc > 6 && (isSup || isBiz)) fc = 6;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    MT: {
      baseUrl: 'https://app.mdt.mt.gov/arcgis/rest/services/Standard/FUNCTIONAL_CLASS/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNC_CLASS', 'SIGN_ROUTE', 'ROUTE_NAME'],
          roadTypeMap: {
            Fw: ['1-Interstate'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 1,
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNC_CLASS', 'SIGN_ROUTE', 'ROUTE_NAME'],
          roadTypeMap: {
            MH: ['3-Principal Arterial - Other'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 2,
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNC_CLASS', 'SIGN_ROUTE', 'ROUTE_NAME'],
          roadTypeMap: {
            mH: ['4-Minor Arterial'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 3,
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNC_CLASS', 'SIGN_ROUTE', 'ROUTE_NAME'],
          roadTypeMap: {
            PS: ['5-Major Collector'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 4,
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNC_CLASS', 'SIGN_ROUTE', 'ROUTE_NAME'],
          roadTypeMap: {
            PS: ['6-Minor Collector'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 5,
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNC_CLASS', 'SIGN_ROUTE', 'ROUTE_NAME'],
          roadTypeMap: {
            St: ['7-Local'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        /* return _r >= 3; */ return ['mapomatic', 'bobc455', 'js55ct'].includes(userNameLC);
      },
      information: { Source: 'MDT', Permission: '?', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<>'LOCAL'`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let rt = STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
        const roadID = feature.attributes.SIGN_ROUTE || feature.attributes.ROUTE_NAME;
        const isUS = /^US[ -]?\d+/.test(roadID);
        const isState = /^MONTANA \d+|ROUTE \d+|S-\d{3}\b/.test(roadID);
        if (isUS && ['St', 'PS', 'mH'].includes(rt)) {
          rt = 'MH';
        } else if (isState && ['St', 'PS'].includes(rt)) {
          rt = 'mH';
        }
        return rt;
      },
    },
    NV: {
      baseUrl: 'https://gis.dot.nv.gov/rhgis/rest/services/GeoHub/FSystem/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FSystem',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FSystem'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return ['mapomatic', 'turbomkt', 'tonestertm', 'geopgeop', 'ojlaw', 'js55ct'].includes(userNameLC);
      },
      information: { Source: 'NDOT', Permission: '?', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const fc = parseInt(feature.attributes[layer.fcPropName], 10);
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    NH: {
      baseUrl: 'https://maps.dot.nh.gov/arcgis_server/rest/services/Highways/NHDOT_ROUTES_Annual/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
        Rmp: '#999999',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 1, // 0
          fcPropName: 'FUNCT_SYSTEM',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCT_SYSTEM', 'STREET', 'STREET_ALIASES', 'TIER', 'SRI_TYPE'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7, 0],
            Rmp: [9],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 2;
      },
      information: { Source: 'NH GRANIT', Permission: 'Visible to R2+', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}>0 AND ${context.layer.fcPropName}<7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let fc = parseInt(feature.attributes[layer.fcPropName], 10);
        if (!(fc > 0)) {
          fc = 7;
        }
        const route = feature.attributes.STREET_ALIASES;
        const isRamp = feature.attributes.SRI_TYPE === 'Ramp';
        const isCircHwy = /^Circumferential H/i.test(feature.attributes.STREET.trim());
        const isUS = /US /.test(route);
        const isState = /NH /.test(route);
        // Ramp and CircHwy overrides first
        if (isRamp) {
          fc = 9;
        } else if (isCircHwy) {
          fc = 1;
        } else if (fc === 2) {
          fc = feature.attributes.TIER === 1 ? 1 : 3;
        } else if (fc > 3 && isUS) {
          fc = /US 3B/.test(route) ? 4 : 3;
        } else if (fc > 4 && isState) {
          fc = 4;
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    NM: {
      baseUrl: 'https://services.arcgis.com/hOpd7wfnKm16p9D9/ArcGIS/rest/services/NMDOT_Functional_Class/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#ff00c5',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FSystem',
          idPropName: 'OBJECTID',
          maxRecordCount: 1000,
          supportsPagination: false,
          outFields: ['OBJECTID', 'FSystem', 'RouteID'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7, 0],
          },
        },
      ],
      isPermitted() {
        return true;
      },
      information: { Source: 'NMDOT', Permission: 'Visible to All', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}>0 AND ${context.layer.fcPropName}<7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let fc = parseInt(feature.attributes[layer.fcPropName], 10);
        const roadType = feature.attributes.RouteID.substring(0, 2); // Get first two characters
        const isBiz = roadType === 'BL'; // Interstate Business Loop
        const isUS = roadType === 'US';
        const isState = roadType === 'NM';

        if (roadType === 'IX') {
          fc = 0;
        } else if (fc > 3 && (isBiz || isUS)) {
          fc = 3;
        } else if (fc > 4 && isState) {
          fc = 4;
        }

        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    NY: {
      // https://gis.dot.ny.gov/hostingny/rest/services/Basemap/MapServer/21
      baseUrl: 'https://gis.dot.ny.gov/hostingny/rest/services/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#5f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1] },
      fcMapLayers: [
        {
          layerID: 1,
          layerPath: 'Geocortex/FC/MapServer/',
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNC_CLASS', 'SEGMENT_NAME', 'ROUTE_NO'],
          roadTypeMap: {
            Fw: [1, 11],
            Ew: [2, 12],
            MH: [4, 14],
            mH: [6, 16],
            PS: [7, 8, 17, 18],
            St: [9, 19],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 21,
          layerPath: 'Basemap/MapServer/',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'SHIELD'],
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'NYSDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.layer.layerID === 21) {
          return "SHIELD IN ('C','CT')";
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let roadType;
        if (layer.layerID === 21) {
          roadType = 'PS';
        } else {
          roadType = STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
          const routeNo = feature.attributes.ROUTE_NO;
          if (/^NY.*/.test(routeNo)) {
            if (roadType === 'PS') roadType = 'mH';
          } else if (/^US.*/.test(routeNo)) {
            if (roadType === 'PS' || roadType === 'mH') roadType = 'MH';
          }
        }
        return roadType;
      },
    },
    NC: {
      baseUrl: 'https://gis11.services.ncdot.gov/arcgis/rest/services/NCDOT_FunctionalClassQtr/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Rmp: '#999999',
        Ew: '#5f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FuncClass',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FuncClass', 'RouteClass', 'RouteQualifier'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          zoomLevels: [3, 4, 5, 6, 7, 8, 9, 10],
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 3;
      },
      information: { Source: 'NCDOT', Permission: 'Visible to R3+', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          const clause = `(${context.layer.fcPropName} < 7 OR RouteClass IN ('I','FED','NC','RMP','US'))`;
          return clause;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const fc = feature.attributes[layer.fcPropName];
        let roadType;
        switch (this.getHwySys(feature)) {
          case 'interstate':
            if (fc <= 2 || !this.isBusinessRoute(feature)) roadType = 'Fw';
            else roadType = 'MH';
            break;
          case 'us':
            if (fc <= 2) roadType = 'Ew';
            else if (fc === 3 || !this.isBusinessRoute(feature)) roadType = 'MH';
            else roadType = 'mH';
            break;
          case 'state':
            if (fc <= 2) roadType = 'Ew';
            else if (fc === 3) roadType = 'MH';
            else if (fc === 4 || !this.isBusinessRoute(feature)) roadType = 'mH';
            else roadType = 'PS';
            break;
          case 'ramp':
            roadType = 'Rmp';
            break;
          default:
            if (fc === 2) roadType = 'Ew';
            else if (fc === 3) roadType = 'MH';
            else if (fc === 4) roadType = 'mH';
            else if (fc <= 6) roadType = 'PS';
            else roadType = 'St';
          // roadType = fc === 2 ? 'Ew' : (fc === 3 ? 'MH' : (fc === 4 ? 'mH' : (fc <= 6 ? 'PS' : 'St')));
        }
        return roadType;
      },
      getHwySys(feature) {
        let hwySys;
        switch (feature.attributes.RouteClass.toString()) {
          case '1':
            hwySys = 'interstate';
            break;
          case '2':
            hwySys = 'us';
            break;
          case '3':
            hwySys = 'state';
            break;
          case '80':
            hwySys = 'ramp';
            break;
          default:
            hwySys = 'local';
        }
        return hwySys;
      },
      isBusinessRoute(feature) {
        const qual = feature.attributes.RouteQualifier.toString();
        return qual === '9';
      },
    },
    ND: {
      baseUrl: 'https://ndgishub.nd.gov/arcgis/rest/services/Basemap_General/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#149ece',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 193,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS'],
          roadTypeMap: {
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 192,
          fcPropName: 'RTE_SIN',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'RTE_SIN'],
          roadTypeMap: {
            Fw: ['I'],
            MH: ['U'],
            mH: ['S'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'NDDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          if (context.layer.layerID === 193) {
            return `${context.layer.fcPropName} < 7`;
          }
          if (context.layer.layerID === 192) {
            return "RTE_SIN IN ('I','U','S')";
          }
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    OH: {
      baseUrl: 'https://tims.dot.state.oh.us/ags/rest/services/Roadway_Information/Functional_Class/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },

      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FUNCTION_CLASS_CD',
          idPropName: 'OBJECTID',
          outFields: ['FUNCTION_CLASS_CD', 'ROUTE_TYPE', 'ROUTE_NBR', 'OBJECTID'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
        },
      ],
      isPermitted() {
        return true;
      },
      information: { Source: 'ODOT', Permission: 'Visible to All', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          const clause = `(${context.layer.fcPropName} < 7 OR ROUTE_TYPE IN ('CR','SR','US')) AND ${context.layer.fcPropName} IS NOT NULL`;
          return clause;
        }
        return `${context.layer.fcPropName} IS NOT NULL`;
      },
      getFeatureRoadType(feature, layer) {
        let fc = feature.attributes[layer.fcPropName];
        const prefix = feature.attributes.ROUTE_TYPE;
        const isUS = prefix === 'US';
        const isState = prefix === 'SR';
        const isCounty = prefix === 'CR';
        if (isUS && fc > 3) {
          fc = 3;
        }
        if (isState && fc > 4) {
          fc = 4;
        }
        if (isCounty && fc > 6) {
          fc = 6;
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    OK: {
      baseUrl: 'https://services6.arcgis.com/RBtoEUQ2lmN0K3GY/arcgis/rest/services/Roadways/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FUNCTIONALCLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONALCLASS', 'FHWAPRIMARYROUTE', 'ODOTROUTECLASS', 'ACCESSCONTROL'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
        },
      ],
      information: { Source: 'ODOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} < 7 OR ODOTROUTECLASS IN ('U','S','I')`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let fc = feature.attributes[layer.fcPropName];
        const route = (feature.attributes.FHWAPRIMARYROUTE || '').trim();
        const isBusinessOrSpur = /BUS$|SPR$/i.test(route);
        const prefix = isBusinessOrSpur ? route.substring(0, 1) : feature.attributes.ODOTROUTECLASS;
        const isFw = parseInt(feature.attributes.ACCESSCONTROL, 10) === 1;
        const isInterstate = prefix === 'I';
        const isUS = prefix === 'U';
        const isState = prefix === 'S';
        if (isFw) fc = 1;
        else if (fc > 3 && ((isUS && !isBusinessOrSpur) || (isInterstate && isBusinessOrSpur))) fc = 3;
        else if (fc > 4 && ((isUS && isBusinessOrSpur) || (isState && !isBusinessOrSpur))) fc = 4;
        else if (fc > 5 && isState && isBusinessOrSpur) fc = 5;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    OR: {
      baseUrl: 'https://gis.odot.state.or.us/arcgis1006/rest/services/transgis/catalog/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 171,
          fcPropName: 'NEW_FC_CD',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'NEW_FC_CD'],
          roadTypeMap: {
            Fw: ['1'],
            Ew: ['2'],
            MH: ['3'],
            mH: ['4'],
            PS: ['5', '6'],
            St: ['7'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 173,
          fcPropName: 'NEW_FC_CD',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'NEW_FC_CD'],
          roadTypeMap: {
            Fw: ['1'],
            Ew: ['2'],
            MH: ['3'],
            mH: ['4'],
            PS: ['5', '6'],
            St: ['7'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'ODOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} < 7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    PA: {
      baseUrl: 'https://gis.penndot.gov/arcgis/rest/services/opendata/roadwayadmin/MapServer/',
      supportsPagination: false,
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          features: new Map(),
          fcPropName: 'FUNC_CLS',
          idPropName: 'MSLINK',
          outFields: ['MSLINK', 'FUNC_CLS'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: {
            Fw: ['01', '11'],
            Ew: ['12'],
            MH: ['02', '14'],
            mH: ['06', '16'],
            PS: ['07', '08', '17'],
            St: ['09', '19'],
          },
        },
      ],
      isPermitted() {
        return rank >= 4;
      },
      information: { Source: 'PennDOT', Permission: 'Visible to R4+', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        return context.mapContext.zoom < 16 ? `${context.layer.fcPropName} NOT IN ('09','19')` : null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        const fc = feature.attributes[layer.fcPropName];
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    RI: {
      baseUrl: 'https://services2.arcgis.com/S8zZg9pg23JUEexQ/arcgis/rest/services/RIDOT_Roads_2016/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [[], [], [], [], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'F_SYSTEM',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'F_SYSTEM', 'ROADTYPE', 'RTNO'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7, 0],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      isPermitted() {
        return rank >= 2;
      },
      information: { Source: 'RIDOT', Permission: 'Visible to R2+', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        return context.mapContext.zoom < 16 ? `${context.layer.fcPropName} NOT IN (7,0)` : null;
      },
      getFeatureRoadType(feature, layer) {
        let fc = parseInt(feature.attributes[layer.fcPropName], 10);
        const type = feature.attributes.ROADTYPE;
        const rtnum = feature.attributes.RTNO;
        if (fc === 2 && ['10', '24', '37', '78', '99', '138', '403'].includes(rtnum)) fc = 1; // isFW
        else if ((fc > 3 && type === 'US') || rtnum === '1') fc = 3; // isUS
        else if (fc > 4 && rtnum.trim() !== '') fc = 4; // isState
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    SC: {
      baseUrl: 'https://services1.arcgis.com/VaY7cY9pvUYUP1Lf/ArcGIS/rest/services/FunctionalClass/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'Functional',
          idPropName: 'FID',
          outFields: ['FID', 'Functional', 'RouteType'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: {
            Fw: [1, 11],
            Ew: [6, 12],
            MH: [2, 13],
            mH: [3, 14],
            PS: [4, 5, 15, 16],
            St: [],
          },
        },
      ],
      isPermitted() {
        return rank >= 4;
      },
      information: { Source: 'SCDOT', Permission: 'Visible to R4+', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause() {
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const SCroadType = feature.attributes.RouteType;
        const isFw = SCroadType === 1;
        const isUS = SCroadType === 2;
        const isState = SCroadType === 4;

        let roadType = STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
        if (roadType === 'Fw' || roadType === 'Ew' || isFw) {
          roadType = 'Fw';
        } else if ((roadType === 'mH' || roadType === 'PS') && isUS) {
          roadType = 'MH';
        } else if (roadType === 'PS' && isState) {
          roadType = 'mH';
        }
        return roadType;
      },
    },
    SD: {
      baseUrl: 'https://arcgis.sd.gov/arcgis/rest/services/SD_All/Transportation_Roads/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#149ece',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
        PSGr: '#cc6533',
        StGr: '#e99cb6',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 1,
          fcPropName: 'HighwayClass',
          idPropName: 'GisHighwayCategoryID',
          maxRecordCount: 1000,
          supportsPagination: false,
          outFields: ['GisHighwayCategoryID', 'HighwayClass'],
          roadTypeMap: {
            Fw: ['IN'],
            MH: ['US'],
            mH: ['SD'],
          },
        },
        {
          layerID: 2,
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          maxRecordCount: 1000,
          supportsPagination: false,
          outFields: ['OBJECTID', 'FUNC_CLASS', 'SURFACE_TYPE', 'ROADNAME'],
          roadTypeMap: {
            Fw: [1, 11],
            Ew: [2, 12],
            MH: [4, 14],
            mH: [6, 16],
            PS: [7, 8, 17],
            St: [9, 19],
          },
        },
      ],
      information: { Source: 'SDDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Additional colors denote unpaved PS and LS segements.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          if (context.layer.layerID === 2) {
            return `${context.layer.fcPropName} NOT IN (9,19)`;
          }
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = attr[layer.fcPropName];
        const fc2 = parseInt(fc, 10) % 10;

        const isUS = /^US HWY /i.test(attr.ROADNAME);
        const isState = /^SD HWY /i.test(attr.ROADNAME);
        const isBiz = /^(US|SD) HWY .* (E|W)?(B|L)$/i.test(attr.ROADNAME);
        const isPaved = parseInt(attr.SURFACE_TYPE, 10) > 5;

        if (fc2 > 4 && isUS) fc = isBiz ? 6 : 4;
        else if (fc2 > 6 && isState) fc = isBiz ? 7 : 6;
        if (fc2 > 6 && !isPaved) {
          return fc < 9 ? 'PSGr' : 'StGr';
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    TN: {
      baseUrl: 'https://',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        PS2: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1] },
      fcMapLayers: [
        {
          layerPath: 'services2.arcgis.com/nf3p7v7Zy4fTOh6M/ArcGIS/rest/services/Road_Segment/FeatureServer/',
          maxRecordCount: 1000,
          supportsPagination: false,
          layerID: 0,
          fcPropName: 'FUNC_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNC_CLASS', 'NBR_RTE', 'NBR_US_RTE'],
          getWhereClause(context) {
            if (context.mapContext.zoom < 16) {
              return `${context.layer.fcPropName} NOT LIKE '%Local'`;
            }
            return null;
          },
          roadTypeMap: {
            Fw: ['Urban Interstate', 'Rural Interstate'],
            Ew: ['Urban Freeway or Expressway', 'Rural Freeway or Expressway'],
            MH: ['Urban Other Principal Arterial', 'Rural Other Principal Arterial'],
            mH: ['Urban Minor Arterial', 'Rural Minor Arterial'],
            PS: ['Urban Major Collector', 'Rural Major Collector'],
            PS2: ['Urban Minor Collector', 'Rural Minor Collector'],
            St: ['Urban Local', 'Rural Local'],
          },
        },
      ],
      information: {
        Source: 'Memphis, Nashville Area MPO',
        Permission: 'Visible to R4+ or R3-AM',
        Description: 'Raw unmodified FC data for the Memphis and Nashville regions only.',
      },
      getWhereClause(context) {
        if (context.layer.getWhereClause) {
          return context.layer.getWhereClause(context);
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        let fc = STATE_SETTINGS.global.getRoadTypeFromFC(feature.attributes.FUNC_CLASS, layer);
        if ((fc === 'PS' || fc === 'mH') && feature.attributes.NBR_US_RTE != null) {
          fc = feature.attributes.NBR_US_RTE.endsWith('BR') ? 'mH' : 'MH';
        } else if (fc === 'PS' && (feature.attributes.NBR_RTE.startsWith('SR') || feature.attributes.NBR_RTE.startsWith('TN'))) {
          fc = 'mH';
        }
        return fc;
      },
    },
    TX: {
      baseUrl: 'https://services.arcgis.com/KTcxiTD9dsQw4r7Z/ArcGIS/rest/services/TxDOT_Functional_Classification/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'F_SYSTEM',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'F_SYSTEM', 'RTE_PRFX'],
          maxRecordCount: 1000,
          supportsPagination: false,
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
        },
      ],
      isPermitted() {
        return rank >= 2;
      },
      information: { Source: 'TxDOT', Permission: 'Visible to R2+', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        let where = ' F_SYSTEM IS NOT NULL AND RTE_PRFX IS NOT NULL';
        if (context.mapContext.zoom < 16) {
          where += ` AND ${context.layer.fcPropName} <> 7`;
        }
        return where;
      },
      getFeatureRoadType(feature, layer) {
        // On-System:
        // IH=Interstate BF=Business FM
        // US=US Highway FM=Farm to Mkt
        // UA=US Alt. RM=Ranch to Mkt
        // UP=US Spur RR=Ranch Road
        // SH=State Highway PR=Park Road
        // SA=State Alt. RE=Rec Road
        // SL=State Loop RP=Rec Rd Spur
        // SS=State Spur FS=FM Spur
        // BI=Business IH RS=RM Spur
        // BU=Business US RU=RR Spur
        // BS=Business State PA=Principal Arterial
        // Off-System:
        // TL=Off-System Tollroad CR=County Road
        // FC=Func. Classified St. LS=Local Street
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        let fc = feature.attributes[layer.fcPropName];
        const type = feature.attributes.RTE_PRFX.substring(0, 2).toUpperCase();
        if (type === 'IH' && fc > 1) {
          fc = 1;
        } else if ((type === 'US' || type === 'BI' || type === 'UA') && fc > 3) {
          fc = 3;
        } else if ((type === 'UP' || type === 'BU' || type === 'SH' || type === 'SA') && fc > 4) {
          fc = 4;
        } else if ((type === 'SL' || type === 'SS' || type === 'BS') && fc > 6) {
          fc = 6;
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    UT: {
      baseUrl: 'https://roads.udot.utah.gov/server/rest/services/Public/Functional_Class/MapServer/0',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCTIONAL_CLASS', 'route_id'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'UDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      getWhereClause(context) {
        return `${context.layer.fcPropName} NOT LIKE 'Proposed%'`;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = attr[layer.fcPropName];
        const routeID = attr.route_id;
        const roadNum = parseInt(routeID.substring(0, 4), 10);
        switch (fc) {
          case 'Interstate':
            fc = 1;
            break;
          case 'Other Freeways and Expressways':
            fc = 2;
            break;
          case 'Other Principal Arterial':
            fc = 3;
            break;
          case 'Minor Arterial':
            fc = 4;
            break;
          case 'Major Collector':
            fc = 5;
            break;
          case 'Minor Collector':
            fc = 6;
            break;
          default:
            fc = 7;
        }
        const re = /^(6|40|50|89|91|163|189|191|491)$/;
        if (re.test(roadNum) && fc > 3) {
          // US highway
          fc = 3;
        } else if (roadNum <= 491 && fc > 4) {
          // State highway
          fc = 4;
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    VT: {
      baseUrl: 'https://maps.vtrans.vermont.gov/arcgis/rest/services/Master/General/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 39,
          fcPropName: 'FUNCL',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FUNCL', 'HWYSIGN'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'VTrans', Permission: 'Visible to R2+' },
      isPermitted() {
        return rank >= 2;
      },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<>7 AND ${context.layer.fcPropName}<>0`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const roadID = feature.attributes.HWYSIGN;
        let fc = feature.attributes[layer.fcPropName];
        if (!(fc > 0)) {
          fc = 7;
        }
        const isUS = /^U/.test(roadID);
        const isState = /^V/.test(roadID);
        const isUSBiz = /^B/.test(roadID);
        if (fc > 3 && isUS) fc = 3;
        else if (fc > 4 && (isUSBiz || isState)) fc = 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    VA: {
      baseUrl: 'https://services.arcgis.com/p5v98VHDX9Atv3l7/arcgis/rest/services/FC_2014_FHWA_Submittal1/FeatureServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#ff00c5',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 0,
          fcPropName: 'STATE_FUNCT_CLASS_ID',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'STATE_FUNCT_CLASS_ID', 'RTE_NM'],
          maxRecordCount: 2000,
          supportsPagination: true,
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
        },
        {
          layerID: 1,
          fcPropName: 'STATE_FUNCT_CLASS_ID',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'STATE_FUNCT_CLASS_ID', 'Opp_RTE_NM', 'ROUTE_NO'],
          maxRecordCount: 2000,
          supportsPagination: true,
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
        },
        {
          layerID: 3,
          fcPropName: 'TMPD_FC',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'TMPD_FC', 'RTE_NM'],
          maxRecordCount: 2000,
          supportsPagination: true,
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
        },
      ],
      information: { Source: 'VDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Federal and State highways set to a minimum of mH.' },
      srExceptions: [
        217, 302, 303, 305, 308, 310, 313, 314, 315, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 339, 341, 342, 343, 344, 345, 346, 347, 348,
        350, 353, 355, 357, 358, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 396,
        397, 398, 399, 785, 895,
      ],
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName}<7`;
        }
        // NOTE: As of 9/14/2016 there does not appear to be any US/SR/VA labeled routes with FC = 7.
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        let fc = parseInt(feature.attributes[layer.fcPropName], 10);
        const rtName = feature.attributes.RTE_NM || feature.attributes.Opp_RTE_NM;
        const match = /^R-VA\s*(US|VA|SR)(\d{5})..(BUS)?/.exec(rtName);
        const isBusiness = match && match !== null && match[3] === 'BUS';
        const isState = match && match !== null && (match[1] === 'VA' || match[1] === 'SR');
        let rtNumText;
        if (layer.layerID === 1) {
          rtNumText = feature.attributes.ROUTE_NO;
        } else if (match) {
          // eslint-disable-next-line prefer-destructuring
          rtNumText = match[2];
        } else {
          rtNumText = '99999';
        }
        const rtNum = parseInt(rtNumText, 10);
        const rtPrefix = match && match[1];
        if (fc > 3 && rtPrefix === 'US') {
          fc = isBusiness ? 4 : 3;
        } else if (isState && fc > 4 && this.srExceptions.indexOf(rtNum) === -1 && rtNum < 600) {
          fc = isBusiness ? 5 : 4;
        }
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    WA: {
      baseUrl: 'https://data.wsdot.wa.gov/arcgis/rest/services/FunctionalClass/WSDOTFunctionalClassMap/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 2,
          fcPropName: 'FederalFunctionalClassCode',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FederalFunctionalClassCode'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 1,
          fcPropName: 'FederalFunctionalClassCode',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FederalFunctionalClassCode'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 4,
          fcPropName: 'FederalFunctionalClassCode',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FederalFunctionalClassCode'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'WSDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Raw unmodified FC data.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} <> 7`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        return STATE_SETTINGS.global.getFeatureRoadType(feature, layer);
      },
    },
    WI: {
      baseUrl: 'https://services5.arcgis.com/0pgGLzT0Nh7FVjon/ArcGIS/rest/services/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 1,
          layerPath: 'WI_Local_Roads_Flood_Damage_Assessment_Snapshot/FeatureServer/',
          fcPropName: 'Functional_Class_Descr',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'Functional_Class_Descr', 'ST_PRMY_SYMB_TY'],
          roadTypeMap: {
            Fw: ['09', '14', '15', '24', '25', '34', '49', '50', '51', '52', '53', '54', '55'],
            Ew: [],
            MH: ['10', '60', '61', '62'],
            mH: ['20', '70', '71', '72', '73', '74', '75', '76', '77', '78', '80', '81', '82', '83'],
            PS: ['30', '31', '32', '33', '40', '41', '90', '91', '92', '93', '94', '95'],
            St: ['45', '97'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 0,
          layerPath: 'FFCL_gdb/FeatureServer/',
          fcPropName: 'FFCL_CD',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'FFCL_CD'],
          roadTypeMap: {
            Fw: ['09', '14', '15', '24', '25', '34', '49', '50', '51', '52', '53', '54', '55'],
            Ew: [],
            MH: ['10', '60', '61', '62'],
            mH: ['20', '70', '71', '72', '73', '74', '75', '76', '77', '78', '80', '81', '82', '83'],
            PS: ['30', '31', '32', '33', '40', '41', '90', '91', '92', '93', '94', '95'],
            St: ['45', '97'],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: {
        Source: 'WisDOT',
        Permission: 'Visible to R4+ or R3-AM',
        Description: 'Federal and State highways set to a minimum of mH. Some US-XX routes might highlight as mH (green), but they should be mapped MH (blue).',
      },
      isPermitted() {
        return rank >= 3 || (rank >= 2 && isAM);
      },
      getWhereClause(context) {
        return null;
      },
      getFeatureRoadType(feature, layer) {
        let roadType = STATE_SETTINGS.global.getFeatureRoadType(feature, layer);

        if (layer.layerPath === 'WI_Local_Roads_Flood_Damage_Assessment_Snapshot/FeatureServer/') {
          // ST_PRMY_SYMB_TY:
          // IH=Interstate
          // USH=US Highway
          // STH=State Highway PR=Park Road
          const SymType = feature.attributes.ST_PRMY_SYMB_TY;
          if (SymType === 'IH' && roadType != 'Fw') {
            roadType = 'Fw';
          } else if (SymType === 'USH' && roadType != 'Fw') {
            roadType = 'MH';
          } else if (SymType === 'STH' && (roadType != 'Fw' || roadType != 'MH')) {
            roadType = 'Mh';
          }
          return roadType;
        }
        return roadType;
      },
    },
    WV: {
      baseUrl: 'https://gis.transportation.wv.gov/arcgis/rest/services/Routes/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#ff00c5',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 2,
          fcPropName: 'NAT_FUNCTIONAL_CLASS',
          idPropName: 'OBJECTID',
          outFields: ['OBJECTID', 'NAT_FUNCTIONAL_CLASS', 'ROUTE_ID'],
          maxRecordCount: 1000,
          supportsPagination: true,
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
        },
      ],
      information: { Source: 'WV DOT' },
      isPermitted() {
        return true;
      },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} NOT IN (9,19)`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        if (layer.getFeatureRoadType) {
          return layer.getFeatureRoadType(feature);
        }
        const fcCode = feature.attributes[layer.fcPropName];
        let fc = fcCode;
        if (fcCode === 11) fc = 1;
        else if (fcCode === 4 || fcCode === 12) fc = 2;
        else if (fcCode === 2 || fcCode === 14) fc = 3;
        else if (fcCode === 6 || fcCode === 16) fc = 4;
        else if (fcCode === 7 || fcCode === 17 || fcCode === 8 || fcCode === 18) fc = 5;
        else fc = 7;
        const id = feature.attributes.ROUTE_ID;
        const prefix = id.substr(2, 1);
        const isInterstate = prefix === '1';
        const isUS = prefix === '2';
        const isState = prefix === '3';
        if (fc > 1 && isInterstate) fc = 1;
        else if (fc > 3 && isUS) fc = 3;
        else if (fc > 4 && isState) fc = 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
    WY: {
      baseUrl: 'https://gisservices.wyoroad.info/arcgis/rest/services/ITSM/ITSM_Data_Layers/MapServer/',
      defaultColors: {
        Fw: '#ff00c5',
        Ew: '#4f33df',
        MH: '#149ece',
        mH: '#4ce600',
        PS: '#cfae0e',
        St: '#eeeeee',
      },
      zoomSettings: { maxOffset: [30, 15, 8, 4, 2, 1, 1, 1, 1, 1], excludeRoadTypes: [['St'], ['St'], ['St'], ['St'], [], [], [], [], [], [], []] },
      fcMapLayers: [
        {
          layerID: 20,
          fcPropName: 'classification',
          idPropName: 'objectid',
          outFields: ['objectid', 'classification', 'common_route_name'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 21,
          fcPropName: 'classification',
          idPropName: 'objectid',
          outFields: ['objectid', 'classification', 'common_route_name'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 22,
          fcPropName: 'classification',
          idPropName: 'objectid',
          outFields: ['objectid', 'classification', 'common_route_name'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 23,
          fcPropName: 'classification',
          idPropName: 'objectid',
          outFields: ['objectid', 'classification', 'common_route_name'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 24,
          fcPropName: 'classification',
          idPropName: 'objectid',
          outFields: ['objectid', 'classification', 'common_route_name'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 25,
          fcPropName: 'classification',
          idPropName: 'objectid',
          outFields: ['objectid', 'classification', 'common_route_name'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
        {
          layerID: 26,
          fcPropName: 'classification',
          idPropName: 'objectid',
          outFields: ['objectid', 'classification', 'common_route_name'],
          roadTypeMap: {
            Fw: [1],
            Ew: [2],
            MH: [3],
            mH: [4],
            PS: [5, 6],
            St: [7],
          },
          maxRecordCount: 1000,
          supportsPagination: false,
        },
      ],
      information: { Source: 'WYDOT', Permission: 'Visible to R4+ or R3-AM', Description: 'Minimum suggested FC.' },
      getWhereClause(context) {
        if (context.mapContext.zoom < 16) {
          return `${context.layer.fcPropName} <> 'Local'`;
        }
        return null;
      },
      getFeatureRoadType(feature, layer) {
        const attr = feature.attributes;
        let fc = parseInt(attr[layer.fcPropName], 10);
        const route = attr.common_route_name;
        const isIntBiz = /I (25|80) BUS/.test(route);
        const isUS = /US \d+/.test(route);
        const isUSBiz = /US \d+ BUS/.test(route);
        const isState = /WY \d+/.test(route);
        const isStateBiz = /WY \d+ BUS/.test(route);
        if (fc > 3 && (isUS || isIntBiz)) fc = isUSBiz ? 4 : 3;
        else if (fc > 4 && isState) fc = isStateBiz ? 5 : 4;
        return STATE_SETTINGS.global.getRoadTypeFromFC(fc, layer);
      },
    },
  };

  /**
   * Logs a message to the console (always).
   * @param {string} message - Text to log.
   * @param {*} [object] - Optional data to log.
   */
  function log(message, object) {
    if (object !== undefined) {
      console.log('FC Layer:', message, object);
    } else {
      console.log('FC Layer:', message);
    }
  }

  /**
   * Logs a debug message to the console if debug is enabled.
   * @param {string} message - Debug text to log.
   * @param {*} [object] - Optional data to log.
   */
  function debugLog(message, object) {
    if (debug) {
      if (object !== undefined) {
        console.debug('FC Layer:', message, object);
      } else {
        console.debug('FC Layer:', message);
      }
    }
  }

  /**
   * Logs an error to the console.
   * @param {string} message - Error text to log.
   * @param {*} [object] - Optional data to log.
   */
  function errorLog(message, object) {
    if (object !== undefined) {
      console.error('FC Layer:', message, object);
    } else {
      console.error('FC Layer:', message);
    }
  }

  /**
   * Loads persistent settings from browser storage.
   * Merges loaded values with defaults if missing.
   */
  function loadSettingsFromStorage() {
    const storedSettings = $.parseJSON(localStorage.getItem(settingsStoreName)) || {};
    const defaultSettings = {
      layerVisible: true,
      activeStateAbbr: 'ALL',
      hideStreet: false,
    };
    settings = { ...defaultSettings, ...storedSettings };
  }

  /**
   * Saves current settings to browser storage.
   */
  function saveSettingsToStorage() {
    if (localStorage) {
      // In case the layer is turned off some other way...
      settings.layerVisible = sdk.Map.isLayerVisible({ layerName });
      localStorage.setItem(settingsStoreName, JSON.stringify(settings));
    }
  }

  /**
   * Sorts array elements with lexicographical order.
   * @param {Array} array - Array to sort.
   */
  function sortArray(array) {
    array.sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }

  /**
   * Returns abbreviations for states visible to the user based on permissions/settings.
   * @returns {string[]} Array of visible state abbreviations.
   */
  function getVisibleStateAbbreviations() {
    const { activeStateAbbr } = settings;
    return sdk.DataModel.States.getAll()
      .map((state) => STATES_HASH[state.name])
      .filter((stateAbbr) => STATE_SETTINGS[stateAbbr] && STATE_SETTINGS.global.isPermitted(stateAbbr) && (!activeStateAbbr || activeStateAbbr === 'ALL' || activeStateAbbr === stateAbbr));
  }

  /**
   * Wrapper around GM_xmlhttpRequest for making async HTTP GET requests.
   * @param {string} url - The fetch URL.
   * @param {Object} context - Context object for request.
   * @returns {Promise<Object>} Resolves with `{responseText, context}`.
   */
  function getAsync(url, context) {
    debugLog(
      `Fetching data for ${context.stateAbbr} from ${context.state.baseUrl}
        ${context.layer.layerPath ? context.layer.layerPath : ''}${context.layer.layerID ? context.layer.layerID : ''}`,
      context
    );

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        context,
        method: 'GET',
        url,
        onload(res) {
          if (res.status.toString() === '200') {
            const parsedResponse = JSON.parse(res.responseText);
            if (parsedResponse.error) {
              reject(new Error(`API Error: ${parsedResponse.error.message}`));
            } else {
              resolve({ responseText: res.responseText, context });
            }
          } else {
            reject(new Error(`HTTP ${res.status}: ${res.responseText}`));
          }
        },
        onerror() {
          reject(new Error('Network Error'));
        },
      });
    });
  }

  /**
   * Constructs a query URL for ESRI REST Layer given context and query type.
   * @param {Object} context - Contains map, layer, state info.
   * @param {string} queryType - "countOnly", "idsOnly", "idRange", etc.
   * @param {Object} [queryParams] - Additional query params such as id ranges.
   * @returns {string} Query URL.
   */
  function getUrl(context, queryType, queryParams) {
    const { extent } = context.mapContext;
    const { zoom } = context.mapContext;
    const { layer } = context;
    const { state } = context;

    const whereParts = [];

    const geometry = {
      xmin: extent[0],
      ymin: extent[1],
      xmax: extent[2],
      ymax: extent[3],
      spatialReference: {
        wkid: 4326,
      },
    };
    const geometryStr = JSON.stringify(geometry);
    const stateWhereClause = state.getWhereClause(context);
    const layerPath = layer.layerPath || '';
    let url = `${state.baseUrl + layerPath + layer.layerID}/query?geometry=${encodeURIComponent(geometryStr)}`;

    if (queryType === 'countOnly') {
      url += '&returnCountOnly=true';
    } else if (queryType === 'idsOnly') {
      url += '&returnIdsOnly=true';
    } else if (queryType === 'paged') {
      // TODO
    } else {
      // Convert to degrees (4326) from the old Meters (3857)
      url += `&returnGeometry=true&maxAllowableOffset=${state.zoomSettings.maxOffset[zoom - 12] / 111000}`;
      url += `&outFields=${encodeURIComponent(layer.outFields.join(','))}`;
      if (queryType === 'idRange') {
        whereParts.push(`(${queryParams.idFieldName}>=${queryParams.range[0]} AND ${queryParams.idFieldName}<=${queryParams.range[1]})`);
      }
    }
    if (stateWhereClause) whereParts.push(stateWhereClause);
    if (whereParts.length > 0) url += `&where=${encodeURIComponent(whereParts.join(' AND '))}`;
    url += '&spatialRel=esriSpatialRelIntersects&geometryType=esriGeometryEnvelope&inSR=4326&outSR=4326&f=json'; // &geometryPrecision=7  Not needed as it scales with maxAllowableOffset
    // debugLog(`URL Fetch Type = ${queryType}`, url );
    return url;
  }

  /**
   * Converts a feature (geometry from FC layer) to one or more turf LineString objects.
   * Adds road type and color attributes.
   * @param {Object} feature - ArcGIS feature object.
   * @param {Object} context - Context for state, layer, etc.
   * @returns {Array} Array of turf LineString objects.
   */
  function convertFcToRoadTypeLineStrings(feature, context) {
    const { state, stateAbbr, layer } = context;
    const roadType = state.getFeatureRoadType(feature, layer);
    const attr = {
      state: stateAbbr,
      layerID: layer.layerID,
      roadType,
      color: state.defaultColors[roadType],
    };

    const lineStrings = feature.geometry.paths.map((path) => {
      const line = turf.lineString(path, attr);
      line.id = 0;
      return line;
    });

    return lineStrings;
  }

  /**
   * Fetches features for a given FC layer, using "idsOnly" strategy, then batch fetches by ID ranges.
   * @param {Object} context - Layer context, map extent, state, etc.
   * @returns {Promise<Array>} Promise resolving to array of features (LineStrings).
   */
  function fetchLayerFC(context) {
    const url = getUrl(context, 'idsOnly');
    context.idsOnlyURL = url;
    if (!context.parentContext.cancel) {
      return getAsync(url, context)
        .bind(context)
        .then((res) => {
          try {
            const ids = JSON.parse(res.responseText);
            if (!ids.objectIds) ids.objectIds = [];
            if (ids.objectIds.length === 0) {
              debugLog(`objectIds array is empty or undefined for State "${context.stateAbbr}" Layer "${context.layer.layerID}" with context:`, context);
            }
            sortArray(ids.objectIds);
            // debugLog(``,ids);
            return ids;
          } catch (err) {
            errorLog(`Error parsing URL response JSON for State "${context.stateAbbr}" Layer "${context.layer.layerID}" with context:`, context);
            throw err;
          }
        })
        .then((res) => {
          const idRanges = [];
          if (res.objectIds) {
            const len = res.objectIds ? res.objectIds.length : 0;
            let currentIndex = 0;
            const offset = Math.min(context.layer.maxRecordCount, 1000);
            while (currentIndex < len) {
              let nextIndex = currentIndex + offset;
              if (nextIndex >= len) nextIndex = len - 1;
              idRanges.push({
                range: [res.objectIds[currentIndex], res.objectIds[nextIndex]],
                idFieldName: res.objectIdFieldName,
              });
              currentIndex = nextIndex + 1;
            }
          }
          return idRanges;
        })
        .map((idRange) => {
          if (!context.parentContext.cancel) {
            const newUrl = getUrl(context, 'idRange', idRange);
            context.idRangeURL = newUrl;
            return getAsync(newUrl, context).then((res) => {
              if (!context.parentContext.cancel) {
                let { features } = JSON.parse(res.responseText);
                context.parentContext.callCount++;
                features = features || [];
                return features.map((feature) => convertFcToRoadTypeLineStrings(feature, context)).filter((feature) => !(feature[0].properties.roadType === 'St' && settings.hideStreet));
              }
              return null;
            });
          }
          // debugLog('Async call cancelled');
          return null;
        });
    }
    return null;
  }

  /**
   * Fetches all FC features for every Map Layer defined in a single state.
   * @param {Object} context - State/fetch context.
   * @returns {Promise<Array[]>} Promise resolving to array of feature arrays, one per layer.
   */
  function fetchStateFC(context) {
    const state = STATE_SETTINGS[context.stateAbbr];
    const contexts = state.fcMapLayers.map((layer) => ({
      parentContext: context.parentContext,
      layer,
      state,
      stateAbbr: context.stateAbbr,
      mapContext: context.mapContext,
    }));

    return Promise.map(contexts, (ctx) =>
      fetchLayerFC(ctx).catch((err) => {
        const errorMessage = `
        | Failed to fetch layer:
        | State: ${ctx.stateAbbr}
        | layerID: ${ctx.layer.layerID}
        | Base URL: ${ctx.state.baseUrl}.
        | ${err.message}.
      `;
        return Promise.reject(new Error(errorMessage.trim()));
      })
    );
  }

  let _lastPromise = null;
  let _lastContext = null;
  let _fcCallCount = 0;

  /**
   * Computes how deeply an array is nested.
   * @param {Array} arr - The array.
   * @returns {number} Depth value.
   */
  function getArrayDepth(arr) {
    if (Array.isArray(arr)) {
      return 1 + Math.max(0, ...arr.map(getArrayDepth));
    }
    return 0;
  }

  /**
   * Main routine to fetch all FC features for every visible state and add to the map layer.
   * Uses current zoom and extent.
   */
  function fetchAllFC() {
    if (!sdk.Map.isLayerVisible({ layerName })) return;

    if (_lastPromise) {
      _lastPromise.cancel();
    }
    $('#fc-loading-indicator').css('color', 'green').html('<span>Loading FC Layers ...</span>');

    const mapContext = { zoom: sdk.Map.getZoomLevel(), extent: sdk.Map.getMapExtent() };
    CURRENT_ZOOM = mapContext.zoom; // store globally so it can be used in map styling predicate
    if (mapContext.zoom > MIN_ZOOM_LEVEL) {
      const parentContext = { callCount: 0, startTime: Date.now() };

      if (_lastContext) _lastContext.cancel = true;
      _lastContext = parentContext;

      const contexts = getVisibleStateAbbreviations().map((stateAbbr) => ({ parentContext, stateAbbr, mapContext }));
      let errorOccurred = false; // Flag to track error state
      let featureCount = 0;

      const map = Promise.map(contexts, (ctx) => fetchStateFC(ctx))
        .then((statesLineStringArrays) => {
          if (!parentContext.cancel) {
            sdk.Map.removeAllFeaturesFromLayer({ layerName });

            // Determine the depth of the nested array structure
            const depth = getArrayDepth(statesLineStringArrays);
            debugLog(`Detected array depth: ${depth}`);

            // Flatten the array based on the detected depth
            const flattenedFeatures = statesLineStringArrays.flat(depth);
            featureCount = flattenedFeatures.length;

            // Add all features to the layer at once
            sdk.Map.dangerouslyAddFeaturesToLayerWithoutValidation({
              layerName,
              features: flattenedFeatures,
            });
          }
          return statesLineStringArrays;
        })
        .catch((e) => {
          const formattedMessage = e.message.replace(/\|/g, '<br>');
          $('#fc-loading-indicator').css('color', 'red').html(`${formattedMessage}`);
          errorOccurred = true;
          errorLog(e.message);
        })
        .finally(() => {
          _fcCallCount -= 1;
          if (_fcCallCount === 0 && !errorOccurred) {
            $('#fc-loading-indicator').html('<span></span>');
          }

          const endTime = Date.now();
          const durationSeconds = (endTime - parentContext.startTime) / 1000;
          debugLog(`Loaded ${featureCount} features in ${durationSeconds.toFixed(2)} seconds`);
        });

      _fcCallCount += 1;
      _lastPromise = map;
    } else {
      // if zoomed out too far, clear the layer
      sdk.Map.removeAllFeaturesFromLayer({ layerName });
    }
  }

  /**
   * Handles layer visibility checkbox state change.
   * @param {Object} args - Object with "checked" property.
   */
  function onLayerCheckboxChanged(args) {
    setEnabled(args.checked);
  }

  /**
   * Ensures the layer z-index stays below roads (hack/workaround).
   */
  function checkLayerZIndex() {
    try {
      if (sdk.Map.getLayerZIndex({ layerName }) !== MAP_LAYER_Z_INDEX) {
        // ("ADJUSTED FC LAYER Z-INDEX " + mapLayerZIndex + ', ' + mapLayer.getZIndex());
        sdk.Map.setLayerZIndex({ layerName, zIndex: MAP_LAYER_Z_INDEX });
      }
    } catch {
      // ignore this hack if it crashes
    }
  }

  /**
   * Initializes the FC Layer, creates style rules, adds layer to map.
   */
  function initLayer() {
    const styleRules = [
      {
        style: {
          strokeColor: 'black',
          strokeDashstyle: 'solid',
          strokeOpacity: 1.0,
          strokeWidth: '15',
        },
      },
    ];
    for (let zoom = 12; zoom < 22; zoom++) {
      styleRules.push({
        // eslint-disable-next-line no-loop-func
        predicate: () => CURRENT_ZOOM === zoom,
        style: {
          strokeWidth: 12 * 1.15 ** (zoom - 13),
        },
      });
    }
    Object.values(STATE_SETTINGS)
      .filter((state) => !!state.defaultColors)
      .forEach((state) =>
        Object.values(state.defaultColors).forEach((color) => {
          if (!styleRules.some((rule) => rule.style.strokeColor === color)) {
            styleRules.push({
              predicate: (props) => props.color === color,
              style: { strokeColor: color },
            });
          }
        })
      );

    STATE_SETTINGS.global.roadTypes.forEach((roadType, index) => {
      styleRules.push({
        predicate: (props) => props.roadType === roadType,
        style: { graphicZIndex: index * 100 },
      });
    });
    sdk.Map.addLayer({
      layerName,
      styleRules,
      zIndexing: true,
    });

    sdk.Map.setLayerOpacity({ layerName, opacity: 0.5 });
    sdk.Map.setLayerVisibility({ layerName, visibility: settings.layerVisible });
    MAP_LAYER_Z_INDEX = sdk.Map.getLayerZIndex({ layerName: 'roads' }) - 3;
    sdk.Map.setLayerZIndex({ layerName, zIndex: MAP_LAYER_Z_INDEX });

    window.addEventListener('beforeunload', () => saveSettingsToStorage);

    sdk.LayerSwitcher.addLayerCheckbox({ name: 'FC Layer' });
    sdk.LayerSwitcher.setLayerCheckboxChecked({ name: 'FC Layer', isChecked: settings.layerVisible });
    sdk.Events.on({ eventName: 'wme-layer-checkbox-toggled', eventHandler: onLayerCheckboxChanged });

    // Hack to fix layer zIndex.  Some other code is changing it sometimes but I have not been able to figure out why.
    // It may be that the FC layer is added to the map before some Waze code loads the base layers and forces other layers higher. (?)
    setInterval(checkLayerZIndex, 1000);

    sdk.Events.on({ eventName: 'wme-map-move-end', eventHandler: fetchAllFC });
  }

  /**
   * Click handler for street hiding control. Updates settings, refreshes features.
   */
  function onHideStreetsClicked() {
    settings.hideStreet = $(this).is(':checked');
    saveSettingsToStorage();
    sdk.Map.removeAllFeaturesFromLayer({ layerName });
    fetchAllFC();
  }

  /**
   * Handles dropdown change for state selection. Updates GUI and reloads.
   */
  function onStateSelectionChanged() {
    settings.activeStateAbbr = this.value;
    saveSettingsToStorage();
    loadStateFCInfo();
    fetchAllFC();
  }

  /**
   * Enables/disables the FC Layer, updates checkbox and settings, may reload.
   * @param {boolean} value - True to enable, false to disable.
   */
  function setEnabled(value) {
    sdk.Map.setLayerVisibility({ layerName, visibility: value });
    settings.layerVisible = value;
    saveSettingsToStorage();

    const color = value ? '#00bd00' : '#ccc';
    $('span#fc-layer-power-btn').css({ color });
    if (value) fetchAllFC();
    sdk.LayerSwitcher.setLayerCheckboxChecked({ name: 'FC Layer', isChecked: value });
  }

  /**
   * Initializes user panel and sidebar tab, creates controls.
   */
  async function initUserPanel() {
    const $panel = $('<div>');
    // Updated to play better with DarkMode
    const $stateSelect = $('<select>', {
      id: 'fcl-state-select',
      class: 'form-control disabled',
      style: `
        border-radius: 4px;
        padding: 6px 12px;
        background-color: var(--background_default); /* Use dark mode background */
        color: var(--content_default); /* Use dark mode content color */
        border: 1px solid var(--separator_default); /* Dark mode border color */
        transition: background-color 0.3s, color 0.3s, border-color 0.3s;
        outline: none;
        cursor: pointer;
        font-weight: bold;
    `,
    }).append($('<option>', { value: 'ALL' }).text('All'));

    Object.keys(STATE_SETTINGS).forEach((stateAbbr) => {
      if (stateAbbr !== 'global') {
        $stateSelect.append($('<option>', { value: stateAbbr }).text(reverseStatesHash(stateAbbr)));
      }
    });

    $stateSelect.val(settings.activeStateAbbr ? settings.activeStateAbbr : 'ALL');

    const $hideStreet = $('<div>', { id: 'fcl-hide-street-container', class: 'controls-container' })
      .append($('<input>', { type: 'checkbox', name: 'fcl-hide-street', id: 'fcl-hide-street' }).prop('checked', settings.hideStreet).click(onHideStreetsClicked))
      .append($('<label>', { for: 'fcl-hide-street' }).text('Hide local street highlights'));

    $panel.append(
      $('<div>', { class: 'form-group' })
        .append($('<label>', { class: 'control-label' }).text('Select a state'))
        .append($('<div>', { class: 'controls', id: 'fcl-state-select-container' }).append($('<div>').append($stateSelect))),
      $hideStreet,
      $('<div>', { id: 'fcl-table-container' })
    );

    $panel.append(
      $('<div>', {
        class: 'loading-indicator',
        id: 'fc-loading-indicator',
        style: 'margin-top:10px; margin-right:10px; font-weight:bold; color:green; font-size:0.9em;',
      }).html('<span></span>')
    );

    $panel.append($('<div>', { id: 'fcl-state-info' }));

    $panel.append(
      $('<div>', { style: 'margin-top:10px;font-size:10px;color:#999999;' })
        .append($('<div>').text(`version ${scriptVersion}`))
        .append($('<div>').append($('<a>', { href: '#' /* , target:'__blank' */ }).text('Discussion Forum (currently n/a)')))
    );

    const { tabLabel, tabPane } = await sdk.Sidebar.registerScriptTab();
    $(tabLabel).text('FC');
    $(tabPane).append($panel);

    // append the power button
    if (!$('#fc-layer-power-btn').length) {
      const color = settings.layerVisible ? '#00bd00' : '#ccc';
      $(tabLabel).prepend(
        $('<span>', {
          class: 'fa fa-power-off',
          id: 'fc-layer-power-btn',
          style: `margin-right: 5px;cursor: pointer;color: ${color};font-size: 13px;`,
          title: 'Toggle FC Layer',
        }).click((evt) => {
          evt.stopPropagation();
          setEnabled(!settings.layerVisible);
        })
      );
    }

    $('#fcl-state-select').change(onStateSelectionChanged);
    loadStateFCInfo();
  }

  /**
   * Loads information about the currently active state into info panel.
   */
  function loadStateFCInfo() {
    $('#fcl-state-info').empty();
    if (STATE_SETTINGS[settings.activeStateAbbr]) {
      const stateInfo = STATE_SETTINGS[settings.activeStateAbbr].information;
      const $panelStateInfo = $('<dl>');
      Object.keys(stateInfo).forEach((propertyName) => {
        $panelStateInfo.append($('<dt>', { style: 'margin-top:1em;color:#777777' }).text(propertyName)).append($('<dd>').text(stateInfo[propertyName]));
      });
      $('#fcl-state-info').append($panelStateInfo);
    }
  }

  /**
   * Initializes GUI: layer, controls, sidebar tab.
   */
  async function initGui() {
    initLayer();
    await initUserPanel();
  }

  /**
   * Main startup routine; loads user/area info, settings, and initializes GUI.
   */
  async function init() {
    if (debug && Promise.config) {
      Promise.config({
        warnings: true,
        longStackTraces: true,
        cancellation: true,
        monitoring: false,
      });
    } else {
      Promise.config({
        warnings: false,
        longStackTraces: false,
        cancellation: true,
        monitoring: false,
      });
    }

    const u = sdk.State.getUserInfo();
    rank = u.rank + 1;
    isAM = u.isAreaManager;
    userNameLC = u.userName.toLowerCase();

    loadSettingsFromStorage();
    await initGui();
    fetchAllFC();
    log('Initialized.');
  }

  init();
})();
