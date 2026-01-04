// ==UserScript==
// @name         WME Cities Overlay
// @namespace    https://greasyfork.org/en/users/166843-wazedev
// @version      2025.08.18.00
// @description  Adds a city overlay for selected states
// @author       WazeDev
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/editor*
// @match        https://beta.waze.com/*
// @exclude      https://www.waze.com/*user/*editor/*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @require      https://update.greasyfork.org/scripts/546306/1644332/WME%20Cities%20Overlay_DB.js
// @require      https://update.greasyfork.org/scripts/524747/1542062/GeoKMLer.js
// @license      GNU GPLv3
// @grant        GM_xmlhttpRequest
// @connect      api.github.com
// @connect      raw.githubusercontent.com
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/40837/WME%20Cities%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/40837/WME%20Cities%20Overlay.meta.js
// ==/UserScript==

/* ecmaVersion 2017 */
/* global $ */
/* global idbKeyval */
/* global WazeWrap */
/* global I18n */
/* eslint curly: ["warn", "multi-or-nest"] */

(function () {
  'use strict';
  const debug = false;
  const scriptMetadata = GM_info.script;
  const scriptName = scriptMetadata.name;
  const repoOwner = scriptMetadata.author; // Change this to a different repo username when testing a forked branch!

  const _settingsStoreName = '_wme_cities';
  let _settings;

  let _kml; // Holds the raw input KML File data
  let _layer = null; // Holds the geoJSON converted features to map with the SDK
  const layerid = scriptName.replace(/[^a-z0-9_-]/gi, '_');

  //Default settings
  const _color = '#E6E6E6';
  const defaultFillOpacity = 0.3;
  const defaultStrokeOpacity = 0.6;
  const noFillStrokeOpacity = 0.9;
  let currState = '';
  let currCity = [];
  let kmlCache = {};

  loadSettings();

  const _US_States = {
    Alabama: 'AL',
    Alaska: 'AK',
    Arizona: 'AZ',
    Arkansas: 'AR',
    California: 'CA',
    Colorado: 'CO',
    Connecticut: 'CT',
    'District of Columbia': 'DC',
    Delaware: 'DE',
    Florida: 'FL',
    Georgia: 'GA',
    Hawaii: 'HI',
    Idaho: 'ID',
    Illinois: 'IL',
    Indiana: 'IN',
    Iowa: 'IA',
    Kansas: 'KS',
    Kentucky: 'KY',
    Louisiana: 'LA',
    Maine: 'ME',
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
    Ohio: 'OH',
    Oklahoma: 'OK',
    Oregon: 'OR',
    Pennsylvania: 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    Tennessee: 'TN',
    Texas: 'TX',
    Utah: 'UT',
    Vermont: 'VT',
    Virginia: 'VA',
    Washington: 'WA',
    'West Virginia': 'WV',
    Wisconsin: 'WI',
    Wyoming: 'WY',
    getAbbreviation: function (state) {
      return this[state];
    },
    getStateFromAbbr: function (abbr) {
      return Object.entries(_US_States).filter((x) => {
        if (x[1] == abbr) return x;
      })[0][0];
    },
    getStatesArray: function () {
      return Object.keys(_US_States).filter((x) => {
        if (typeof _US_States[x] !== 'function') return x;
      });
    },
    getStateAbbrArray: function () {
      return Object.values(_US_States).filter((x) => {
        if (typeof x !== 'function') return x;
      });
    },
  };

  const _MX_States = {
    Aguascalientes: 'AGS',
    'Baja California': 'BC',
    'Baja California Sur': 'BCS',
    Campeche: 'CAM',
    'Coahuila de Zaragoza': 'COAH',
    Colima: 'COL',
    Chiapas: 'CHIS',
    Durango: 'DGO',
    'Ciudad de México': 'CDMX',
    Guanajuato: 'GTO',
    Guerrero: 'GRO',
    Hidalgo: 'HGO',
    Jalisco: 'JAL',
    'Estado de México': 'EM',
    'Michoacán de Ocampo': 'MICH',
    Morelos: 'MOR',
    Nayarit: 'NAY',
    'Nuevo León': 'NL',
    Oaxaca: 'OAX',
    Puebla: 'PUE',
    'Quintana Roo': 'QROO',
    Querétaro: 'QRO',
    'San Luis Potosí': 'SLP',
    Sinaloa: 'SIN',
    Sonora: 'SON',
    Tabasco: 'TAB',
    Tamaulipas: 'TAM',
    Tlaxcala: 'TLAX',
    'Veracruz Ignacio de la Llave': 'VER',
    Yucatán: 'YUC',
    Zacatecas: 'ZAC',
    getAbbreviation: function (state) {
      return this[state];
    },
    getStateFromAbbr: function (abbr) {
      return Object.entries(_MX_States).filter((x) => {
        if (x[1] == abbr) return x;
      })[0][0];
    },
    getStatesArray: function () {
      return Object.keys(_MX_States).filter((x) => {
        if (typeof _MX_States[x] !== 'function') return x;
      });
    },
    getStateAbbrArray: function () {
      return Object.values(_MX_States).filter((x) => {
        if (typeof x !== 'function') return x;
      });
    },
  };


  const _CA_States = {
    Alberta: 'AB',
    'British Columbia': 'BC',
    'Manitoba': 'MB',
    'New Brunswick': 'NB',
    'Newfoundland and Labrador': 'NL',
    'Nova Scotia': 'NS',
    Nunavut: 'NT',
    'Northwest Territories': 'NU',
    Ontario: 'ON',
    'Prince Edward Island': 'PE',
    Quebec: 'QC',
    Saskatchewan: 'SK',
    Yukon: 'YT',
    getAbbreviation: function (state) {
      return this[state];
    },
    getStateFromAbbr: function (abbr) {
      return Object.entries(_CA_States).filter((x) => {
        if (x[1] == abbr) return x;
      })[0][0];
    },
    getStatesArray: function () {
      return Object.keys(_CA_States).filter((x) => {
        if (typeof _CA_States[x] !== 'function') return x;
      });
    },
    getStateAbbrArray: function () {
      return Object.values(_CA_States).filter((x) => {
        if (typeof x !== 'function') return x;
      });
    },
  };

  let wmeSDK; // Declare wmeSDK globally

  // Ensure SDK_INITIALIZED is available
  if (unsafeWindow.SDK_INITIALIZED) {
    unsafeWindow.SDK_INITIALIZED.then(bootstrap).catch((err) => {
      console.error(`${scriptName}: SDK initialization failed`, err);
    });
  } else {
    console.warn(`${scriptName}: SDK_INITIALIZED is undefined`);
  }

  function bootstrap() {
    wmeSDK = unsafeWindow.getWmeSdk({
      scriptId: scriptName.replaceAll(' ', ''),
      scriptName: scriptName,
    });

    // Use Promise.all to check readiness of all dependencies
    Promise.all([isWmeReady(), isWazeWrapReady(), isGeoKMLerReady()])
      .then(() => {
        console.log(`${scriptName}: All dependencies are ready.`);
        init();
        console.log(`${scriptName}: Initialized`);
      })
      .catch((error) => {
        console.error(`${scriptName}: Error during bootstrap -`, error);
      });
  }

  function isWmeReady() {
    return new Promise((resolve, reject) => {
      if (wmeSDK && wmeSDK.State.isReady() && wmeSDK.Sidebar && wmeSDK.LayerSwitcher && wmeSDK.Shortcuts && wmeSDK.Events) {
        console.log(`${scriptName}: WME is already ready.`);
        resolve();
      } else {
        wmeSDK.Events.once({ eventName: 'wme-ready' })
          .then(() => {
            if (wmeSDK.Sidebar && wmeSDK.LayerSwitcher && wmeSDK.Shortcuts && wmeSDK.Events) {
              console.log(`${scriptName}: WME is fully ready now.`);
              resolve();
            } else {
              reject(`${scriptName}: Some SDK components are not loaded.`);
            }
          })
          .catch((error) => {
            console.error(`${scriptName}: Error while waiting for WME to be ready:`, error);
            reject(error);
          });
      }
    });
  }

  function isWazeWrapReady() {
    return new Promise((resolve, reject) => {
      const maxTries = 1000;
      const checkInterval = 500;

      (function check(tries = 0) {
        if (unsafeWindow.WazeWrap && unsafeWindow.WazeWrap.Ready) {
          console.log(`${scriptName}: WazeWrap is successfully loaded.`);
          resolve();
        } else if (tries < maxTries) {
          setTimeout(() => check(++tries), checkInterval);
        } else {
          reject(`${scriptName}: WazeWrap took too long to load.`);
        }
      })();
    });
  }

  function isGeoKMLerReady() {
    return new Promise((resolve, reject) => {
      try {
        if (typeof GeoKMLer !== 'undefined') {
          const geoKMLer = new GeoKMLer();
          if (geoKMLer) {
            console.log(`${scriptName}: GeoKMLer is successfully loaded and ready.`);
            resolve();
          } else {
            reject(`${scriptName}: GeoKMLer instance could not be created.`);
          }
        } else {
          reject(`${scriptName}: GeoKMLer is not defined.`);
        }
      } catch (error) {
        console.error(`${scriptName}: Error during GeoKMLer readiness check:`, error);
        reject(error);
      }
    });
  }

  function isChecked(checkboxId) {
    return $('#' + checkboxId).is(':checked');
  }

  function setChecked(checkboxId, checked) {
    $('#' + checkboxId).prop('checked', checked);
  }

  function loadSettings() {
    _settings = $.parseJSON(localStorage.getItem(_settingsStoreName));
    let _defaultsettings = {
      layerVisible: true,
      ShowCityLabels: true,
      FillPolygons: true,
      HighlightFocusedCity: true,
      AutoUpdateKMLs: true,
    };
    if (!_settings) _settings = _defaultsettings;
    for (var prop in _defaultsettings) {
      if (!_settings.hasOwnProperty(prop)) _settings[prop] = _defaultsettings[prop];
    }
  }

  function saveSettings() {
    if (localStorage) {
      var settings = {
        layerVisible: _settings.layerVisible,
        ShowCityLabels: _settings.ShowCityLabels,
        FillPolygons: _settings.FillPolygons,
        HighlightFocusedCity: _settings.HighlightFocusedCity,
        AutoUpdateKMLs: _settings.AutoUpdateKMLs,
      };
      localStorage.setItem(_settingsStoreName, JSON.stringify(settings));
    }
  }

  function stripElevation(coordinates) {
    if (Array.isArray(coordinates[0])) {
      // If coordinates are nested, recursively strip elevation
      return coordinates.map((coord) => stripElevation(coord));
    }
    // Remove third element from a single set of coordinates
    return coordinates.slice(0, 2);
  }

  /**
   * Function: flattenGeoJSON
   * ------------------------
   * Flattens a GeoJSON "FeatureCollection" into an array of individual GeoJSON features, ensuring consistent
   * type casing and performing property cleanup, including the removal of unwanted characters.
   *
   * Parameters:
   * @param {Object} geoJson - The GeoJSON object to be flattened, expected to be a FeatureCollection.
   * @returns {Array} - An array of individual GeoJSON features, each with cleaned properties and standardized types.
   *
   * Throws:
   * - {Error} Throws an error if the GeoJSON input is invalid by not being a FeatureCollection.
   *
   * Description:
   * - Processes a FeatureCollection by iterating over each feature using `geomEach` to handle various geometry types.
   * - Geometry types such as MultiPoint, MultiLineString, and MultiPolygon are decomposed into individual features.
   * - Cleans feature properties, stripping unwanted markers and creating a `labelText` from the `name` attribute.
   * - Supports these GeoJSON geometry types: Point, LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon, GeometryCollection.
   *
   * Internal Functions:
   * - `updateGeoJSONType`: Ensures consistent casing of GeoJSON types using a lookup map.
   * - `stripElevation`: Removes elevation data from coordinates for more straightforward processing.
   *
   * Example Usage:
   * ```
   * const flattenedFeatures = flattenGeoJSON(myGeoJSON);
   * ```
   */
  function flattenGeoJSON(geoJson) {
    // Verify and extract features array from the input GeoJSON
    if (geoJson.type !== 'FeatureCollection' || !Array.isArray(geoJson.features)) {
      throw new Error('Invalid GeoJSON input: expected a FeatureCollection.');
    }

    const features = geoJson.features;

    const geoJSONTypeMap = {
      FEATURECOLLECTION: 'FeatureCollection',
      FEATURE: 'Feature',
      GEOMETRYCOLLECTION: 'GeometryCollection',
      POINT: 'Point',
      LINESTRING: 'LineString',
      POLYGON: 'Polygon',
      MULTIPOINT: 'MultiPoint',
      MULTILINESTRING: 'MultiLineString',
      MULTIPOLYGON: 'MultiPolygon',
    };

    const updateGeoJSONType = (type) => geoJSONTypeMap[type.toUpperCase()] || type;

    return features.flatMap((feature) => {
      const flattenedGeometries = [];

      if (feature.properties) {
        const nameKey = ['name', 'Name', 'NAME'].find((key) => feature.properties[key]);
        if (nameKey) {
          feature.properties[nameKey] = feature.properties[nameKey].replace(/<at><openparen>/gi, '').replace(/<closeparen>/gi, '');
          feature.properties.labelText = feature.properties[nameKey];
        }
      }

      geomEach(feature.geometry, (geometry) => {
        const type = geometry === null ? null : updateGeoJSONType(geometry.type);
        switch (type) {
          case 'Point':
          case 'LineString':
          case 'Polygon':
            flattenedGeometries.push({
              type: updateGeoJSONType('Feature'),
              geometry: {
                type: type,
                coordinates: stripElevation(geometry.coordinates),
              },
              properties: feature.properties,
            });
            break;
          case 'MultiPoint':
          case 'MultiLineString':
          case 'MultiPolygon':
            const geomType = updateGeoJSONType(type.split('Multi')[1]);
            geometry.coordinates.forEach((coordinate) => {
              flattenedGeometries.push({
                type: updateGeoJSONType('Feature'),
                geometry: {
                  type: geomType,
                  coordinates: stripElevation(coordinate),
                },
                properties: feature.properties,
              });
            });
            break;
          case 'GeometryCollection':
            geometry.geometries.forEach((geom) => {
              const updatedType = updateGeoJSONType(geom.type);
              flattenedGeometries.push({
                type: updateGeoJSONType('Feature'),
                geometry: {
                  type: updatedType,
                  coordinates: stripElevation(geom.coordinates),
                },
                properties: feature.properties,
              });
            });
            break;
          default:
            throw new Error(`Unknown Geometry Type: ${type}`);
        }
      });

      return flattenedGeometries;
    });
  }

  /**
   * Function: geomEach
   * ------------------
   * Iterates over each geometry within a feature, handling different types of geometries
   * and their coordinate structures, and executing a specified callback function.
   *
   * This function supports:
   * - Simple geometries: Point, LineString, Polygon
   * - Compound geometries: MultiPoint, MultiLineString, MultiPolygon
   * - Geometry collections: GeometryCollection
   *
   * Parameters:
   * @param {Object} geometry - The geometry object extracted from a feature, containing
   *                            type and coordinates or sub-geometries.
   * @param {Function} callback - A callback function to execute for each geometry type,
   *                              receiving a geometry object as an argument.
   *
   * Notes:
   * - For compound geometries, coordinates are processed individually, and elevation data
   *   is stripped using `stripElevation`.
   * - Throws an error if an unknown geometry type is encountered.
   **/
  function geomEach(geometry, callback) {
    const type = geometry === null ? null : geometry.type;
    switch (type) {
      case 'Point':
      case 'LineString':
      case 'Polygon':
        callback(geometry);
        break;
      case 'MultiPoint':
      case 'MultiLineString':
      case 'MultiPolygon':
        geometry.coordinates.forEach((coordinate) => {
          callback({
            type: type.split('Multi')[1],
            coordinates: stripElevation(coordinate), // Use stripElevation here
          });
        });
        break;
      case 'GeometryCollection':
        geometry.geometries.forEach(callback);
        break;
      default:
        throw new Error(`Unknown Geometry Type: ${type}`);
    }
  }

  function GetFeaturesFromKMLString(strKML) {
    const geoKMLer = new GeoKMLer();
    const kmlDoc = geoKMLer.read(strKML);
    const GeoJSONflat = flattenGeoJSON(geoKMLer.toGeoJSON(kmlDoc, false)); // false = don't need the added CRS info section
    return GeoJSONflat;
  }

  /**
   * Function: findCurrCity
   * ----------------------
   * Determines the current city based on the map's center point, identifying its feature
   * within GeoJSON layers, and handling DOM element retrieval for the current feature.
   *
   * Steps:
   * 1. Initialize the `cityData` object with default properties.
   * 2. Retrieve the current map center coordinates using `wmeSDK.Map`.
   * 3. Iterate over all features in the global `_layer` array to check if the map center is
   *    within any polygon feature using `isPointInPolygon`.
   *     - If a match is found, update `cityData` with the feature's details.
   * 4. Perform a debug-only operation to find the DOM element associated with the feature:
   *     - Retrieve using `wmeSDK.Map.getFeatureDomElement` if the `featureId` is valid.
   *     - Handle cases where the DOM element is not found or retrieval errors occur.
   * 5. Log the finalized `cityData` object for debugging purposes.
   *
   * Globals:
   * - `scriptName`: Used for logging errors and debug information.
   * - `_layer`: Array of GeoJSON features representing map polygons and properties.
   * - `debug`: Flag to enable additional logging for troubleshooting.
   * - `layerid`: Identifier for the map layer, needed for DOM element retrieval.
   *
   * Error Handling and Debugging:
   * - Includes additional logging and checks to address missing elements and potential errors.
   * - Detailed console warnings and errors facilitate debugging when `debug` mode is activated.
   *
   * Returns:
   * - `cityData`: An object containing the current city's name, associated feature ID, and optional DOM element.
   */
  function findCurrCity() {
    let cityData = {
      name: '',
      featureId: '',
      domElement: null, // Initialize as null for safety
    };

    // Get the current map center using wmeSDK
    const mapCenter = wmeSDK.Map.getMapCenter(); // Returns { lat: number, lon: number }
    const mapCenterPoint = [mapCenter.lon, mapCenter.lat];

    // Check if _layer is defined and not null before proceeding
    if (!_layer || !_layer.length) {
      if (debug) console.warn(`${scriptName}: _layer is null or undefined. Unable to find current city.`);
      return cityData;
    }

    for (let i = 0; i < _layer.length; i++) {
      const feature = _layer[i];
      const geometry = feature.geometry;
      const properties = feature.properties;
      const id = feature.id;

      // Check if the map center point is inside the feature's geometry (polygon)
      if (isPointInPolygon(mapCenterPoint, geometry.coordinates[0])) {
        cityData.name = properties.name;
        cityData.featureId = id;
        if (debug) {
          cityData.geojson = feature;
        }
        break;
      }
    }

    if (debug) {
      // Only attempt to get the DOM element if a valid featureId has been set
      if (cityData.featureId) {
        try {
          const currCityFeatureDomElement = wmeSDK.Map.getFeatureDomElement({
            featureId: cityData.featureId,
            layerName: layerid,
          });

          if (currCityFeatureDomElement !== null) {
            cityData.domElement = currCityFeatureDomElement;
          } else {
            console.warn(`${scriptName}: DOM element for feature ID ${cityData.featureId} not found.`);
          }
        } catch (error) {
          console.error(`${scriptName}: Error retrieving DOM element for feature ID ${cityData.featureId}:`, error);
        }
      }
    }

    if (debug) {
      console.log(`${scriptName}: Current Focused City Object is:`, cityData);
    }

    return cityData;
  }

  /**
   * Function: updateCitiesLayer
   * ---------------------------
   * Asynchronously updates the cities layer on the map based on the current state and zoom level,
   * ensuring proper display of city polygons and region names.
   *
   * Steps:
   * 1. Check the map's current zoom level and exit early if it's below 12, as detailed city view is unnecessary.
   * 2. Retrieve the top state from the map data model. If different from the current state (`currState`),
   *    invoke `updateCityPolygons` to refresh city polygon data.
   * 3. Identify the current city using `findCurrCity`. Ensure the city data is valid before proceeding.
   * 4. Update the display name of the district or region using `updateDistrictNameDisplay`.
   * 5. Redraw the map layer to reflect the updated city data.
   *
   * Error Handling:
   * - Try-catch block used to handle any runtime errors gracefully, logging details for debugging.
   * - Checks for valid `currCity` and `currCity.name` to prevent operations on missing data.
   *
   * Globals:
   * - `scriptName`: Used for logging errors and operation details.
   * - `currState`: Tracks the name of the state currently being processed.
   * - `layerid`: Identifier for the target layer where cities are displayed.
   * - `currCity`: Object to store the currently identified city, utilized in display logic.
   */
  async function updateCitiesLayer() {
    try {
      const zoom = wmeSDK.Map.getZoomLevel();
      if (zoom < 12) {
        return;
      }

      const topState = wmeSDK.DataModel.States.getTopState();
      if (!topState) {
        if (debug) console.log(`${scriptName}: topState is null. Skipping updateCityPolygons.`);
        return;
      }

      if (currState !== topState.name) {
        await updateCityPolygons();
      }

      currCity = findCurrCity();

      if (!currCity || !currCity.name) {
        if (debug) console.log(`${scriptName}: No Current city Polygon found for this location....`);
        return;
      }

      updateDistrictNameDisplay();
      wmeSDK.Map.redrawLayer({ layerName: layerid });
    } catch (error) {
      console.error(`${scriptName}: Error in updateCitiesLayer -`, error);
    }
  }

  function updateDistrictNameDisplay() {
    // Remove existing district name displays
    $('.wmecitiesoverlay-region').remove();

    // Verify if _layer has features and a current city is specified
    if (Array.isArray(_layer) && _layer.length > 0 && currCity.name != '') {
      let color = '#00ffff';

      // Create a new div element for displaying the current city
      var $div = $('<div>', {
        id: 'wmecitiesoverlay',
        class: 'wmecitiesoverlay-region',
        style: 'float:left; margin-left:10px;',
      }).css({
        color: color,
        cursor: 'pointer',
      });

      var $span = $('<span>').css({ display: 'inline-block' });
      $span.text(currCity.name).appendTo($div);

      // Append the new element after the location-info-region
      $('.location-info-region').after($div);
    }
  }

  /**
   * Determines if a given point is inside a polygon using the ray-casting algorithm.
   *
   * This function checks whether a point, defined by its coordinates, is inside a polygon.
   * The polygon is represented by an array of vertices (points), and the function uses the
   * ray-casting technique to toggle the state whenever the ray crosses a polygon edge.
   *
   * @param {Array} point - An array [x, y] representing the coordinates of the point to test.
   * @param {Array} vs - An array of vertices, where each vertex is represented as [x, y].
   * @returns {boolean} - True if the point is inside the polygon, false otherwise.
   **/
  function isPointInPolygon(point, vs) {
    const [x, y] = point;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const [xi, yi] = vs[i];
      const [xj, yj] = vs[j];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  async function fetch(url) {
    //return await $.get(url);
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: url,
        method: 'GET',
        onload(res) {
          if (res.status < 400) {
            resolve(res.responseText);
          } else {
            reject(res);
          }
        },
        onerror(res) {
          reject(res);
        },
      });
    });
  }

  /**
   * Function: updateAllMaps
   * -----------------------
   * Asynchronously updates KML data for all states in the current country, comparing
   * local storage against the latest content available in a GitHub repository.
   *
   * Steps:
   * 1. Get the top country from the map data model and retrieve its abbreviation.
   * 2. Fetch the keys for all states' city data stored locally.
   * 3. Determine the appropriate state abbreviation object based on the country's abbreviation.
   * 4. Retrieve the list of KML files from the GitHub repository, parsing the response.
   * 5. For each state in local storage, check if the KML file size differs from the server's version.
   *    If so, fetch the updated KML file, update local storage, and cache if necessary.
   * 6. Log the count and names of states updated in the user's interface.
   * 7. Finally, refresh city layers using `updateCitiesLayer`.
   *
   * Note:
   * - Utilizes persistent local storage (`idbKeyval`) and caching (`kmlCache`) to reduce unnecessary data loads.
   * - Updates DOM element `#WMECOupdateStatus` to reflect operation results, aiding user interaction and feedback.
   *
   * Globals:
   * - `scriptName`: The name used for logging and user feedback.
   * - `repoOwner`: Identifier for the GitHub repository owner, used for URL generation.
   * - `currState`: Tracks the current state being processed, updated during KML fetching.
   * - `_kml`: Stores KML data when a matching state is currently active.
   * - `layerid`: Identifier for the map layer where updates are applied.
   * - `_US_States` and `_MX_States`: Objects managing state abbreviation lookup.
   * - `kmlCache`: Object to locally cache loaded KML data for efficient retrieval.
   */
  async function updateAllMaps() {
    const topCountry = wmeSDK.DataModel.Countries.getTopCountry();
    let countryAbbr = topCountry.abbr;
    let keys = await idbKeyval.keys(`${countryAbbr}_states_cities`);
    let updatedCount = 0;
    let updatedStates = '';
    let countryAbbrObj;

    if (countryAbbr === 'US') countryAbbrObj = _US_States;
    else if (countryAbbr === 'MX') countryAbbrObj = _MX_States;
    else if (countryAbbr === 'CA') countryAbbrObj = _CA_States;

    let KMLinfoArr = await fetch(`https://api.github.com/repos/${repoOwner}/WME-Cities-Overlay/contents/KMLs/${countryAbbr}`);
    KMLinfoArr = $.parseJSON(KMLinfoArr);
    let state;
    for (let i = 0; i < keys.length; i++) {
      state = keys[i];

      for (let j = 0; j < KMLinfoArr.length; j++) {
        if (KMLinfoArr[j].name === `${state}_Cities.kml`) {
          //check the size in db against server - if different, update db
          let stateObj = await idbKeyval.get(`${countryAbbr}_states_cities`, state);

          if (stateObj.kmlsize !== KMLinfoArr[j].size) {
            let kml = await fetch(`https://raw.githubusercontent.com/${repoOwner}/WME-Cities-Overlay/master/KMLs/${countryAbbr}/${state}_Cities.kml`);

            if (state === countryAbbrObj.getAbbreviation(currState)) _kml = kml;

            await idbKeyval.set(`${countryAbbr}_states_cities`, {
              kml: kml,
              state: state,
              kmlsize: KMLinfoArr[j].size,
            });
            if (kmlCache[state] != null) kmlCache[state] = _kml;
            if (updatedStates != '') updatedStates += `, ${state}`;
            else updatedStates += state;
            updatedCount += 1;
          }
          break;
        }
      }
    }
    if (updatedCount > 0) $('#WMECOupdateStatus').text(`${updatedCount} state file${updatedCount > 1 ? 's' : ''} updated - ${updatedStates}`);
    else $('#WMECOupdateStatus').text('No updates available');

    updateCitiesLayer();
  }

  async function init() {
    initTab();
    //I18n.translations[I18n.locale].layers.name[layerid] = "Cities Overlay";
    const layerConfig = {
      styleRules: [
        {
          predicate: () => true,
          style: {
            strokeDashstyle: 'solid',
            strokeColor: '${dynamicStrokeColor}',
            strokeOpacity: '${dynamicStrokeOpacity}',
            strokeWidth: '${dynamicStrokeWidth}',
            fillOpacity: '${dynamicFillOpacity}',
            fillColor: '${dynamicFillColor}',
            fontColor: '#ffffff',
            label: '${formatLabel}',
            labelOutlineColor: '#000000',
            labelOutlineWidth: 4,
            labelAlign: 'cm',
            fontSize: '16px',
          },
        },
      ],
      styleContext: {
        dynamicStrokeColor: (context) => {
          // Check if focused city highlighting is enabled and feature matches currCity
          if (_settings.HighlightFocusedCity && context.feature.id === currCity.featureId) {
            return '#f7ad25'; // Highlight stroke color
          }
          return _color; // Default stroke color
        },
        dynamicFillColor: (context) => {
          // Check if focused city highlighting is enabled and feature matches currCity
          if (_settings.HighlightFocusedCity && context.feature.id === currCity.featureId) {
            return '#f7ad25'; // Highlight fill color
          }
          return _color; // Default fill color
        },
        dynamicStrokeWidth: (context) => {
          // Increase stroke width if focused city highlighting is enabled and feature matches currCity
          if (_settings.HighlightFocusedCity && context.feature.id === currCity.featureId) {
            return 6; // Highlight stroke width
          }
          return 2; // Default stroke width
        },
        dynamicStrokeOpacity: () => {
          return _settings.FillPolygons ? defaultStrokeOpacity : noFillStrokeOpacity;
        },
        dynamicFillOpacity: () => {
          return _settings.FillPolygons ? defaultFillOpacity : 0;
        },
        formatLabel: (context) => {
          let labelTemplate = '';
          if (!_settings.ShowCityLabels) {
            return ''; // Skip rendering if disabled in settings
          }
          // Confirm necessary properties exist in the context
          if (!context || !context.feature || !context.feature.properties || !context.feature.properties.labelText) {
            console.error(`${scriptName}: Invalid context or missing 'labelText' property.`);
            return '';
          }
          // Direct assignment of label text
          labelTemplate = context.feature.properties.labelText.trim();
          return labelTemplate; // Return trimmed label for display
        },
      },
    };

    wmeSDK.Map.addLayer({
      layerName: layerid,
      styleRules: layerConfig.styleRules,
      styleContext: layerConfig.styleContext,
      zIndexing: true,
    });

    // Set visibility to true for the layer
    wmeSDK.Map.setLayerVisibility({ layerName: layerid, visibility: _settings.layerVisible });
    wmeSDK.LayerSwitcher.addLayerCheckbox({ name: 'Cities Overlay' });
    wmeSDK.LayerSwitcher.setLayerCheckboxChecked({ name: 'Cities Overlay', isChecked: _settings.layerVisible });
    wmeSDK.Events.on({ eventName: 'wme-layer-checkbox-toggled', eventHandler: layerToggled });
    wmeSDK.Events.on({ eventName: 'wme-map-move-end', eventHandler: onMapMove });

    if (_settings.layerVisible) {
      await updateCityPolygons();
      currCity = findCurrCity();
      if (_settings.AutoUpdateKMLs) {
        updateAllMaps();
      }
    }
  } // END int() function

  function initTab() {
    // Create the section element using jQuery
    var $section = $('<div>', {
      style: 'padding:8px 16px',
      id: 'WMECitiesOverlaySettings',
    });

    // Function to inject custom CSS
    function addCustomStyles() {
      const style = document.createElement('style');
      style.textContent = `
    .wmecoSettingsCheckbox {
      margin-right: 5px;  /* Adds space to the right of the checkbox */
      cursor: pointer;  /* Pointer indicates interactivity */
      appearance: none;  /* Remove default styling */
      width: 16px;  /* Width of checkbox */
      height: 16px;  /* Height of checkbox */
      background-color: #e0e0e0;  /* Light gray background for unselected state */
      border: 2px solid #bbb;  /* Soft border */
      border-radius: 4px;  /* Slight rounded corners */
      position: relative;  /* Position relative for inner elements */
      transition: all 0.3s ease;  /* Smooth transition for hover effects */
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);  /* Adds a subtle shadow */
    }
    
    .wmecoSettingsCheckbox:hover {
      background-color: #d1d1d1;  /* Slightly darker on hover */
      border-color: #999;  /* Darker border on hover */
      margin-right: 5px;

    }
    
    .wmecoSettingsCheckbox:checked {
      background-color: #4caf50;  /* Green background for checked state */
      border-color: #3e8e41;  /* Darker green border for checked */
      margin-right: 5px;
    }
    
    .wmecoSettingsCheckbox:checked::after {
      content: '';  /* Content for checkmark */
      position: absolute;
      left: 4px;  /* Horizontal position for checkmark */
      top: 0px;  /* Vertical position for checkmark */
      width: 12px;  /* Width of checkmark */
      height: 12px;  /* Height of checkmark */
      border: solid white;  /* White checkmark */
      border-width: 0 3px 3px 0;
      transform: rotate(45deg);  /* Rotation to create checkmark */
      margin-right: 5px;
    }
  `;
      document.head.appendChild(style);
    }

    // Append the HTML content to the section
    $section.append(
      `<h4 style="margin-bottom:0px;">
    <i id="citiesPower" class="fa fa-power-off" aria-hidden="true" 
       style="color:${_settings.layerVisible ? 'rgb(0,180,0)' : 'rgb(255, 0, 0)'}; cursor:pointer;">
    </i> 
    <b>WME Cities Overlay</b>
  </h4>`,
      `<h6 style="margin-top:0px;">${GM_info.script.version}</h6>`,
      '<div id="divWMECOFillPolygons"><input type="checkbox" id="_cbCOFillPolygons" class="wmecoSettingsCheckbox" /><label for="_cbCOFillPolygons">Fill polygons</label></div>',
      '<div id="divWMECOShowCityLabels"><input type="checkbox" id="_cbCOShowCityLabels" class="wmecoSettingsCheckbox" /><label for="_cbCOShowCityLabels">Show city labels</label></div>',
      '<div id="divWMECOHighlightFocusedCity"><input type="checkbox" id="_cbCOHighlightFocusedCity" class="wmecoSettingsCheckbox" /><label for="_cbCOHighlightFocusedCity">Highlight focused city</label></div>',
      '<fieldset id="fieldUpdates" style="border: 1px solid silver; padding: 8px; border-radius: 4px;">' +
        '<legend style="margin-bottom:0px; border-bottom-style:none;width:auto;"><h4>Update Settings</h4></legend>' +
        '<div id="divWMECOUpdateMaps" title="Checks for new state files for the current country"><button id="WMECOupdateMaps" type="button">Refresh / Update database</button></div>' +
        '<div id="WMECOupdateStatus"></div>' +
        '<div id="divWMECOAutoUpdateKMLs" title="Checks for updated state files for the current country when WME loads"><input type="checkbox" id="_cbCOAutoUpdateKMLs" class="wmecoSettingsCheckbox" /><label for="_cbCOAutoUpdateKMLs">Automatically update database</label></div>' +
        '</fieldset>'
    );

    // Add styles
    addCustomStyles();

    // Register the script tab with the sidebar
    wmeSDK.Sidebar.registerScriptTab()
      .then(({ tabLabel, tabPane }) => {
        // Set the tab label and title
        tabLabel.textContent = 'Cities';
        tabLabel.title = scriptName;

        // Append the section to the tab pane
        tabPane.appendChild($section.get(0));

        // Set initial checkbox states based on settings
        setChecked('_cbCOShowCityLabels', _settings.ShowCityLabels);
        setChecked('_cbCOFillPolygons', _settings.FillPolygons);
        setChecked('_cbCOHighlightFocusedCity', _settings.HighlightFocusedCity);
        setChecked('_cbCOAutoUpdateKMLs', _settings.AutoUpdateKMLs);

        // Add event listeners
        $('.wmecoSettingsCheckbox').change(function () {
          var settingName = $(this)[0].id.substr(5);
          _settings[settingName] = this.checked;
          saveSettings();
        });

        $('#citiesPower').click(function () {
          layerToggled();
        });

        $('#WMECOupdateMaps').click(updateAllMaps);

        $('#_cbCOFillPolygons').change(function () {
          _settings.FillPolygons = this.checked;
          saveSettings();
          wmeSDK.Map.redrawLayer({ layerName: layerid });
        });

        $('#_cbCOShowCityLabels').change(function () {
          _settings.ShowCityLabels = this.checked;
          saveSettings();
          wmeSDK.Map.redrawLayer({ layerName: layerid });
        });

        $('#_cbCOHighlightFocusedCity').change(function () {
          _settings.HighlightFocusedCity = this.checked;
          saveSettings();
          wmeSDK.Map.redrawLayer({ layerName: layerid });
        });
      })
      .catch((error) => {
        console.error(`${scriptName}: Error registering the script tab:`, error);
      });
  }

  function onMapMove() {
    if (_settings.layerVisible) {
      updateCitiesLayer();
    }
  }

  function layerToggled() {
    // Toggle the visibility state
    _settings.layerVisible = !_settings.layerVisible;
    const visible = _settings.layerVisible;

    wmeSDK.Map.setLayerVisibility({ layerName: layerid, visibility: visible });
    wmeSDK.LayerSwitcher.setLayerCheckboxChecked({ name: 'Cities Overlay', isChecked: visible });

    if (visible) {
      $('#citiesPower').css('color', 'rgb(0,180,0)');
      // Add a custom event listener for visibility changes
      document.getElementById('citiesPower').addEventListener('visibilityChange', updateCitiesLayer);
      // Dispatch or trigger the custom event
      const visibilityChangeEvent = new Event('visibilityChange');
      document.getElementById('citiesPower').dispatchEvent(visibilityChangeEvent);
    } else {
      $('#citiesPower').css('color', 'rgb(255, 0, 0)'); // Dark mode color
      $('.wmecitiesoverlay-region').remove(); // Remove existing district name displays
      // Remove the custom event listener when not visible
      document.getElementById('citiesPower').removeEventListener('visibilityChange', updateCitiesLayer);
    }
    saveSettings();
  }

  /**
   * Function: updateCityPolygons
   * ----------------------------
   * Asynchronously loads and updates city polygons for the top state on the map,
   * utilizing local storage and caching strategies to optimize data retrieval.
   *
   * Steps:
   * 1. Retrieve the current top state and check if it differs from `currState`.
   *    If so, proceed to load new city polygon data.
   * 2. Clear existing features from the map layer to prepare for new data.
   * 3. Determine the state abbreviation based on the country's abbreviation.
   * 4. Check local storage for cached KML data; if absent, fetch from a remote
   *    GitHub repository and cache it locally.
   * 5. Use the KML data to update the map layer's polygons with `updatePolygons`.
   * 6. Log the loading time and redraw the map layer to reflect updates.
   *
   * Note:
   * - Utilizes caching (`kmlCache`) and persistent storage (`idbKeyval`) for data
   *   efficiency across function executions.
   * - Displays console logs and timers to assist with monitoring load times and debugging.
   *
   * Globals:
   * - `scriptName`: Name used for logging.
   * - `_kml`: KML data used for polygon updates.
   * - `currState`: Tracks the currently processed state name.
   * - `layerid`: Identifier for the target map layer.
   * - `repoOwner`: GitHub repository owner used for remote KML extraction.
   * - `debug`: Flag to enable detailed logging for troubleshooting.
   * - `_US_States` and `_MX_States`: Modules for state abbreviation lookup.
   * - `kmlCache`: Object to store loaded KML data for future use.
   */
  async function updateCityPolygons() {
    const topState = wmeSDK.DataModel.States.getTopState();

    if (!topState) {
      if (debug) console.warn(`${scriptName}: topState is null. Exiting update.`);
      return;
    }

    if (currState !== topState.name) {
      const topCountry = wmeSDK.DataModel.Countries.getTopCountry();

      if (!topCountry) {
        if (debug) console.warn(`${scriptName}: topCountry is null. Exiting update.`);
        return;
      }

      // Start loading indicator
      console.log(`${scriptName}: Loading City Polygons for ${topState.name}`);
      console.time(`${scriptName}: Loaded City Polygons for ${topState.name} in`);

      // Clear all features from layer before loading new data
      wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: layerid });
      currState = topState.name;

      let countryAbbr = topCountry.abbr;
      let stateAbbr;

      if (countryAbbr === 'US') stateAbbr = _US_States.getAbbreviation(currState);
      else if (countryAbbr === 'MX') stateAbbr = _MX_States.getAbbreviation(currState);
      else if (countryAbbr === 'CA') stateAbbr = _CA_States.getAbbreviation(currState);

      if (typeof stateAbbr !== 'undefined') {
        if (typeof kmlCache[stateAbbr] === 'undefined') {
          // Try to retrieve state info from local storage
          var request = await idbKeyval.get(`${countryAbbr}_states_cities`, stateAbbr);

          if (!request) {
            // Fetch from GitHub if not found locally
            let kmlURL = `https://raw.githubusercontent.com/${repoOwner}/WME-Cities-Overlay/master/KMLs/${countryAbbr}/${stateAbbr}_Cities.kml`;

            if (debug) console.log(`${scriptName}: KML URL`, kmlURL);

            let kml = await fetch(kmlURL);
            _kml = kml;
            updatePolygons();

            await idbKeyval.set(`${countryAbbr}_states_cities`, {
              kml: kml,
              state: stateAbbr,
              kmlsize: 0,
            });

            kmlCache[stateAbbr] = _kml; // Cache KML data locally
          } else {
            _kml = request.kml;
            kmlCache[stateAbbr] = _kml; // Cache locally if already fetched
            updatePolygons();
          }
        } else {
          _kml = kmlCache[stateAbbr];
          updatePolygons();
        }
      }

      // End loading indicator
      console.timeEnd(`${scriptName}: Loaded City Polygons for ${topState.name} in`);
    } else {
      wmeSDK.Map.redrawLayer({ layerName: layerid });
    }
  }

  /**
   * Function: updatePolygons
   * -------------------------
   * This function updates the map layer with GeoJSON features derived from a KML string,
   * replacing existing features and handling potential errors during feature addition.
   *
   * Steps:
   * 1. Convert the KML string into GeoJSON features and store them in the `_layer` variable.
   * 2. Remove all current features from the specified layer using `wmeSDK.Map`.
   * 3. Map these features with unique IDs based on their index to prepare them for loading.
   * 4. Attempt to add each feature to the target layer while tracking successes and errors.
   * 5. Populate the global `_layer` variable with successfully loaded features.
   * 6. Log the number of successfully added and skipped features and display loaded layers.
   *
   * Error Handling:
   * - Catch and log errors occurring during the feature removal and addition process.
   * - Differentiate between `InvalidStateError` for missing layers and `ValidationError`
   *   for issues with feature data, providing specific details for troubleshooting.
   *
   * Globals:
   * - `scriptName`: Name used for logging.
   * - `_kml`: The KML string serving as the data source.
   * - `_layer`: Global state to track currently loaded features.
   * - `layerid`: Identifier for the target layer.
   * - `debug`: Flag to enable detailed logging for troubleshooting.
   */
  function updatePolygons() {
    // Retrieve GeoJSON features from the KML string; conversion handled inside GetFeaturesFromKMLString
    _layer = GetFeaturesFromKMLString(_kml);
    // Remove all existing features from the specified layer
    try {
      wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: layerid });
      if (debug) console.log(`${scriptName}: All features removed from layer: ${layerid}`);
    } catch (error) {
      console.error(`${scriptName}: Error removing features from layer: ${layerid}`, error);
    }

    // Map features array with unique index-based IDs
    const featuresToLoad = _layer.map((f, index) => ({
      type: f.type,
      id: `${layerid}_${index}`, // Use feature index for uniqueness
      geometry: f.geometry,
      properties: f.properties,
    }));

    wmeSDK.Map.dangerouslyAddFeaturesToLayerWithoutValidation({
          features: featuresToLoad,
          layerName: layerid,
        });

    _layer = featuresToLoad; // populates the global _layer
    if (debug) console.log(`${scriptName}: Current State is ${currState}`);

    // Log completion
    console.log(`${scriptName}: ${featuresToLoad.length} Towns added`);
    if (debug) console.log(`${scriptName}: Layers Loaded are:`, _layer);
  }
})();
