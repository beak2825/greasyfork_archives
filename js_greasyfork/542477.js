// ==UserScript==
// @name                wmeGisLBBOX
// @namespace           https://github.com/JS55CT/
// @author              JS55CT
// @description         Determines which geographical divisions are in a Viewport intersect with the given BBOX.
// @version             2026.07.14.00
// @license             MIT
// @grant               GM_xmlhttpRequest
// @connect             github.io
// @match              *://this-library-is-not-supposed-to-run.com/*
// @contributionURL     https://github.com/WazeDev/Thank-The-Authors
// ==/UserScript==

var wmeGisLBBOX = (function () {
  // Constructor for the wmeGisLBBOX class
  const funcName = 'wmeGisLBBOX';

  const BASE_URL = `https://WazeDev.github.io/wmeGisLBBOX/`;
  const BASE_URL_BBOX = `${BASE_URL}BBOX%20JSON/`;
  const BASE_URL_GEOJSON = `${BASE_URL}GEOJSON/`;

  function wmeGisLBBOX() {
    // Ensure class instantiation with 'new'
    if (!(this instanceof wmeGisLBBOX)) {
      return new wmeGisLBBOX();
    }
    this.cache = {}; // Cache for storing fetched JSON / geoJSON data
  }

  /**
   * Fetches JSON data from a specified URL, utilizing caching to store and reuse fetched data.
   *
   * This function makes an HTTP GET request to retrieve data from a given URL and employs caching
   * to improve efficiency by storing previously fetched results. It uses `GM_xmlhttpRequest` for
   * cross-domain requests when running in a userscript environment.
   *
   * Process Overview:
   * 1. Checks the cache for existing data associated with the URL.
   * 2. If cached data is available, returns it immediately.
   * 3. If no cache is found, performs an HTTP request to fetch the data.
   * 4. On successful fetch, parses the JSON, stores it in cache, and resolves with the data.
   * 5. Handles errors, rejecting the Promise with an appropriate error message if the fetch fails.
   *
   * @param {string} url - The URL from which to fetch JSON data.
   * @returns {Promise<Object>} - A Promise resolving to the parsed JSON data.
   **/
  wmeGisLBBOX.prototype.fetchJsonWithCache = function (url) {
    if (this.cache[url]) {
      return Promise.resolve(this.cache[url]);
    }
    // Fetch data using GM_xmlhttpRequest
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            // Parse and store fetched data in cache
            const data = JSON.parse(response.responseText);
            this.cache[url] = data;
            resolve(data);
          } else {
            reject(new Error(`${funcName}: Failed to fetch data from ${url}, status: ${response.status}`));
          }
        },
        onerror: (error) => {
          reject(new Error(`${funcName}: Failed to fetch data from ${url}, error: ${error}`));
        },
      });
    });
  };

  /**
   * Determines whether two bounding boxes intersect.
   *
   * This function checks for intersection between two bounding boxes `bbox1` and `bbox2`
   * by evaluating both latitude and longitude overlapping scenarios. Special handling is included
   * to manage cases where bounding boxes wrap the antimeridian (180 degrees longitude).
   *
   * Process Overview:
   * 1. Checks latitude intersection by evaluating if latitude ranges overlap.
   * 2. Checks longitude intersection, considering whether a bounding box wraps the antimeridian.
   * 3. Returns true if both latitude and longitude intersections occur; false otherwise.
   *
   * Longitude Intersection Scenarios:
   * - Standard check if neither bounding box wraps the antimeridian.
   * - Special checks for when one or both bounding boxes wrap the antimeridian.
   *
   * @param {Object} bbox1 - The first bounding box with properties minLat, maxLat, minLon, maxLon.
   * @param {Object} bbox2 - The second bounding box with properties minLat, maxLat, minLon, maxLon.
   * @returns {boolean} - True if the bounding boxes intersect, false otherwise.
   **/
  function checkIntersection(bbox1, bbox2) {
    // Check for Latitude Intersection
    const latIntersects = !(bbox1.maxLat < bbox2.minLat || bbox1.minLat > bbox2.maxLat);
    if (!latIntersects) {
      return false;
    }
    // Check for Longitude Intersection
    const bbox1Wraps = bbox1.minLon > bbox1.maxLon;
    const bbox2Wraps = bbox2.minLon > bbox2.maxLon;
    let lonIntersects = false;
    if (!bbox1Wraps && !bbox2Wraps) {
      // Neither box wraps the antimeridian - standard overlap check
      lonIntersects = !(bbox1.maxLon < bbox2.minLon || bbox1.minLon > bbox2.maxLon);
    } else if (bbox1Wraps && !bbox2Wraps) {
      // bbox1 wraps and bbox2 does not
      const separated = bbox1.maxLon < bbox2.minLon && bbox1.minLon > bbox2.maxLon;
      lonIntersects = !separated;
    } else if (!bbox1Wraps && bbox2Wraps) {
      // bbox2 wraps and bbox1 does not
      const separated = bbox2.maxLon < bbox1.minLon && bbox2.minLon > bbox1.maxLon;
      lonIntersects = !separated;
    } else {
      lonIntersects = true; // Both boxes wrap the antimeridian
    }
    return lonIntersects; // Return true if both latitude and longitude intersect
  }

  /**
   * Identifies countries intersecting with the specified viewport bounding box.
   *
   * This function fetches a list of countries defined by their bounding boxes,
   * checks for intersection with the current viewport, and returns details for
   * countries that intersect.
   *
   * Process Overview:
   * 1. Fetches country bounding box data from a specified JSON URL.
   * 2. Iterates over country data, checking each one's bounding boxes against the viewport.
   * 3. Collects information on countries that intersect, including ISO codes and names.
   *
   * viewportBbox: {minLon: number, minLat: number, maxLon: number, maxLat: number}
   *
   * Error Handling:
   * - Logs errors during the fetch process and returns an empty array if issues occur.
   *
   * @param {Object} viewportBbox - The bounding box defining the current viewport.
   * @returns {Array} - An array of objects representing countries intersecting with the viewport.
   **/
  wmeGisLBBOX.prototype.getIntersectingCountries = async function (viewportBbox) {
    const url = `${BASE_URL_BBOX}COUNTRIES_BBOX_ESPG4326.json`;
    return this.fetchJsonWithCache(url)
      .then((COUNTRY_DATA) => {
        const intersectingCountries = Object.keys(COUNTRY_DATA).flatMap((code) => {
          const countryData = COUNTRY_DATA[code];
          for (const bbox of countryData.bbox) {
            if (checkIntersection(bbox, viewportBbox)) {
              return [
                {
                  ISO_ALPHA2: countryData['ISO_ALPHA2'],
                  ISO_ALPHA3: countryData['ISO_ALPHA3'],
                  name: countryData['name'],
                  Sub_level: countryData['Sub_level'],
                  source: 'BBOX',
                },
              ];
            }
          }
          return [];
        });

        return intersectingCountries;
      })
      .catch((error) => {
        console.error(`${funcName}: Error fetching country data:`, error);
        return [];
      });
  };

  /**
   * Fetches and augments country data with subdivision information in parallel.
   *
   * This asynchronous function retrieves the base country information JSON, and then
   * concurrently fetches first-level subdivision data for all countries that have
   * subdivisions (`Sub_level > 0`). It augments each country's data object with
   * the respective subdivisions (as `subL1`), or an empty object if none exist.
   *
   * @returns {Promise<Object>} - Resolves to a comprehensive data object containing
   *    the country details and, where applicable, an added `subL1` property with
   *    first-level subdivision data.
   *
   * Process Overview:
   * 1. Fetches country data from a static JSON file.
   * 2. For each country with subdivisions (Sub_level > 0), concurrently fetches subdivision JSON data.
   * 3. Sets an empty `subL1` object for countries with `Sub_level === 0`.
   * 4. Populates the `subL1` property of each country.
   *
   * Error Handling:
   * - Logs a warning if fetching country or subdivision data fails.
   * - Returns an empty object if the initial country fetch fails.
   * - If a subdivision fetch fails or does not exist, initializes subL1 as an empty object.
   *
   * URLs:
   * - Country Data: Static JSON at `${BASE_URL_BBOX}COUNTRIES_BBOX_ESPG4326.json`
   * - Subdivision Data: `${BASE_URL_BBOX}{ISO_ALPHA3}/{ISO_ALPHA3}_BBOX_ESPG4326.json` (for Sub_level > 0)
   */
  wmeGisLBBOX.prototype.getCountriesAndSubsJson = async function () {
    const url = `${BASE_URL_BBOX}COUNTRIES_BBOX_ESPG4326.json`;
    const funcName = 'getCountriesAndSubsJson';

    try {
      // Fetch the country data
      const COUNTRY_DATA = await this.fetchJsonWithCache(url);

      if (!COUNTRY_DATA) {
        console.warn(`${funcName}: No country data found.`);
        return {};
      }

      const countryCodes = Object.keys(COUNTRY_DATA);

      // Prepare subdivision fetches for countries with Sub_level > 0
      const subFetchPromises = countryCodes.map((countryCode) => {
        const country = COUNTRY_DATA[countryCode];
        if (country.Sub_level > 0) {
          const isoAlpha3 = country.ISO_ALPHA3;
          const subL1Url = `${BASE_URL_BBOX}${isoAlpha3}/${isoAlpha3}_BBOX_ESPG4326.json`;
          return this.fetchJsonWithCache(subL1Url)
            .then((subL1Data) => ({ countryCode, subL1Data }))
            .catch((subError) => {
              console.warn(`${funcName}: Error fetching subL1 for ${countryCode}:`, subError);
              return { countryCode, subL1Data: {} };
            });
        } else {
          // No subdivisions, so set as empty object, return as a resolved promise!
          return Promise.resolve({ countryCode, subL1Data: {} });
        }
      });

      // Await all subdivision fetches in parallel
      const allSubdivisions = await Promise.all(subFetchPromises);

      // Assign the fetched subdivision data
      allSubdivisions.forEach(({ countryCode, subL1Data }) => {
        COUNTRY_DATA[countryCode].subL1 = subL1Data || {};
      });

      return COUNTRY_DATA;
    } catch (error) {
      console.warn(`${funcName}: Error fetching country data:`, error);
      return {};
    }
  };

  /**
   * Cleans intersecting country data by pruning empty subdivisions across different levels.
   *
   * This function processes country data that intersects with a given geographic area,
   * handling hierarchical subdivision structures and removing any empty or null subdivisions.
   * It dynamically adapts to the subdivision level identified for each country.
   *
   * Process Overview:
   * 1. Iterates through intersecting country data.
   * 2. Applies cleaning logic based on subdivision levels (subLevel) present.
   * 3. Specifically handles multi-level subdivisions, including special logic for deep levels.
   * 4. Recursively prunes subdivisions that lack content, ensuring only relevant data remains.
   *
   * Cleaning Logic by Subdivision Level:
   * - Sub_Level = 1: Retains countries and sub-level 1 if they contain valid subdivisions.
   * - Sub_Level = 2: Further inspects sub-level 2; if empty, removes it and reveals sub-level 1 if needed.
   * - Sub_Level = 3: Examines sub-level 3 within applicable countries, removing them if empty and ensuring sub-level 2 remains relevant.
   * - Undetected or Sub_Level = 0: Completely removes countries with unidentified subdivisions.
   *
   * @param {Object} intersectingCountries - Object containing intersecting country data.
   *
   * Modifications:
   * - Directly alters the `intersectingCountries` object by removing empty subdivisions.
   * - Ensures structural integrity by retaining populated subdivisions and appropriate country entries.
   */
  wmeGisLBBOX.prototype.cleanIntersectingData = function (intersectingCountries) {
    for (const countryName in intersectingCountries) {
      const country = intersectingCountries[countryName];
      const subLevel = country.Sub_level || 0; // Default to 0 if Sub_level is not provided
      // Handle Sub_level = 0: Return the country directly
      if (subLevel === 0) {
        continue; // This means we should retain the country as is without further checks
      }
      // Proceed with cleanup based on sub-level hierarchy
      if (subLevel >= 3) {
        for (const sub1Name in country.subL1) {
          const subL1 = country.subL1[sub1Name];
          for (const sub2Name in subL1.subL2) {
            const subL2 = subL1.subL2[sub2Name];
            if (!subL2.subL3 || Object.keys(subL2.subL3).length === 0) {
              delete subL1.subL2[sub2Name];
            }
          }
        }
      }
      if (subLevel >= 2) {
        for (const sub1Name in country.subL1) {
          const subL1 = country.subL1[sub1Name];
          if (!subL1.subL2 || Object.keys(subL1.subL2).length === 0) {
            delete country.subL1[sub1Name];
          }
        }
      }
      if (subLevel >= 1) {
        if (!country.subL1 || Object.keys(country.subL1).length === 0) {
          delete intersectingCountries[countryName];
        }
      }
    }
  };

  /**
   * Fetches GeoJSON data for a specified region and checks for intersection with a given viewport.
   *
   * This asynchronous function retrieves GeoJSON data based on the specified country, subdivision,
   * and sub-subdivision codes. It then checks whether the geometries in the GeoJSON intersect
   * with the provided viewport bounding box, returning intersection results or the full GeoJSON data.
   *
   * Process Overview:
   * 1. Constructs the URL for the GeoJSON file based on provided codes.
   * 2. Fetches the GeoJSON data using the constructed URL.
   * 3. Defines the viewport area as a polygon using the specified bounding box coordinates.
   * 4. Iterates through GeoJSON features, checking if their geometries intersect with the viewport.
   * 5. Returns either the full GeoJSON data or a boolean indicating intersection presence based on a flag.
   *
   * Supported Geometry Types:
   * - Polygon: Directly checks for intersection with the viewport polygon.
   * - MultiPolygon: Iterates through component polygons to check for intersection.
   * - Logs a warning if any unsupported geometry types are encountered.
   *
   * Error Handling:
   * - Logs an error message if fetching or processing the GeoJSON fails, returns `false`.
   *
   * viewportBbox: {minLon: number, minLat: number, maxLon: number, maxLat: number}
   *
   * @param {string} countyCode - The country code corresponding to the GeoJSON data.
   * @param {string} subCode - The subdivision code for the GeoJSON data.
   * @param {string} subSubCode - The sub-subdivision code for the GeoJSON data.
   * @param {Object} viewportBbox - The bounding box of the viewport.
   * @param {boolean} [returnGeoJson=false] - Flag to determine if the full GeoJSON data should be returned.
   * @returns {boolean|Object} - Returns true or false for intersection presence, or the full GeoJSON data.
   **/
  wmeGisLBBOX.prototype.fetchAndCheckGeoJsonIntersection = async function (countyCode, subCode, subSubCode, viewportBbox, returnGeoJson = false) {
    const url = `${BASE_URL_GEOJSON}${countyCode}/${subCode}/${countyCode}-${subCode}-${subSubCode}_EPSG4326.geojson`;

    try {
      const geoJsonData = await this.fetchJsonWithCache(url);
      // Define the viewport as a polygon.
      const viewportPolygon = [
        [viewportBbox.minLon, viewportBbox.minLat],
        [viewportBbox.minLon, viewportBbox.maxLat],
        [viewportBbox.maxLon, viewportBbox.maxLat],
        [viewportBbox.maxLon, viewportBbox.minLat],
        [viewportBbox.minLon, viewportBbox.minLat],
      ];

      // Iterate through each feature in the GeoJSON data
      for (const feature of geoJsonData.features) {
        const featureGeometry = feature.geometry;
        // Check if the geometry type is Polygon or MultiPolygon
        if (featureGeometry.type === 'Polygon') {
          for (const polygon of featureGeometry.coordinates) {
            if (hasIntersection(polygon, viewportPolygon)) {
              return returnGeoJson ? geoJsonData : true; // Return the GeoJSON data or intersection boolean
            }
          }
        } else if (featureGeometry.type === 'MultiPolygon') {
          for (const multiPolygon of featureGeometry.coordinates) {
            for (const polygon of multiPolygon) {
              if (hasIntersection(polygon, viewportPolygon)) {
                return returnGeoJson ? geoJsonData : true; // Return the GeoJSON data or intersection boolean
              }
            }
          }
        } else {
          console.warn(`${funcName}: Unsupported geometry type:`, featureGeometry.type);
          continue; // Skip unsupported geometry types
        }
      }
      return false; // No intersection found
    } catch (error) {
      console.error(`${funcName}: Error fetching or processing GeoJSON from ${url}:`, error);
      return false;
    }
  };

  /**
   * Identifies US states and counties that intersect with the given viewport bounding box.
   *
   * This asynchronous function fetches state and county bounding box data, identifies which states
   * and counties intersect with a specified viewport, and optionally checks for more precise
   * intersections using GeoJSON data.
   *
   * Process Overview:
   * 1. Retrieves bounding box data for US states.
   * 2. Checks each state's bounding box against the viewport for intersections.
   * 3. For intersecting states, fetches county bounding box data and identifies intersecting counties.
   * 4. If `highPrecision` is true, uses GeoJSON data to refine intersection checks.
   * 5. Constructs an object that maps intersecting states to their respective intersecting counties and subdivisions.
   *
   * Optional Features:
   * - High precision mode uses GeoJSON data to confirm intersections and update data sources.
   * - Supports returning GeoJSON data if intersections occur and `returnGeoJson` is true.
   *
   * viewportBbox: {minLon: number, minLat: number, maxLon: number, maxLat: number}
   *
   * Error Handling:
   * - Logs a message if fetching or processing bounding box or GeoJSON data fails.
   *
   * @param {Object} viewportBbox - The bounding box of the viewport.
   * @param {boolean} [highPrecision=false] - Flag to activate high precision intersection checks using GeoJSON.
   * @param {boolean} [returnGeoJson=false] - Flag to indicate if GeoJSON data should be returned when intersecting.
   * @returns {Object} - A structured object detailing intersecting states, counties, and subdivisions.
   **/
  wmeGisLBBOX.prototype.getIntersectingStatesAndCounties = async function (viewportBbox, highPrecision = false, returnGeoJson = false) {
    const STATES_URL = `${BASE_URL_BBOX}USA/USA_BBOX_ESPG4326.json`;
    const intersectingRegions = {};

    try {
      const US_States = await this.fetchJsonWithCache(STATES_URL);
      for (const stateCode in US_States) {
        const stateData = US_States[stateCode];
        if (checkIntersection(stateData.bbox, viewportBbox)) {
          const intersectingCounties = {};
          const countiesUrl = `${BASE_URL_BBOX}USA/USA-${stateCode}_BBOX_ESPG4326.json`;
          const countiesData = await this.fetchJsonWithCache(countiesUrl);
          for (const countyEntry of countiesData) {
            const countyName = Object.keys(countyEntry)[0];
            const countyData = countyEntry[countyName];
            if (checkIntersection(countyData.bbox, viewportBbox)) {
              const intersectingSubCounties = countyData.subdivisions
                .filter((sub) => sub.bbox && checkIntersection(sub.bbox, viewportBbox))
                .reduce((acc, sub) => {
                  acc[sub.name] = {
                    subL3_num: sub.sub_num,
                    source: 'BBOX',
                  };
                  return acc;
                }, {});
              if (Object.keys(intersectingSubCounties).length > 0) {
                let source = 'BBOX';
                let geoJsonData = null;
                if (highPrecision) {
                  const intersectsGeoJson = await this.fetchAndCheckGeoJsonIntersection('USA', stateCode, countyData.sub_num, viewportBbox, returnGeoJson);
                  if (returnGeoJson && intersectsGeoJson) {
                    geoJsonData = intersectsGeoJson;
                    source = 'GEOJSON';
                  } else if (intersectsGeoJson) {
                    source = 'GEOJSON';
                  } else {
                    continue;
                  }
                }
                intersectingCounties[countyName] = {
                  subL2_num: countyData.sub_num,
                  subL3: intersectingSubCounties,
                  source: source,
                };
                if (geoJsonData) {
                  intersectingCounties[countyName].geoJsonData = geoJsonData;
                }
              }
            }
          }
          if (Object.keys(intersectingCounties).length > 0) {
            let stateSource = 'BBOX';
            if (highPrecision) {
              const anyCountyWithGeoJson = Object.values(intersectingCounties).some((county) => county.source === 'GEOJSON');
              if (anyCountyWithGeoJson) {
                stateSource = 'GEOJSON';
              }
            }
            intersectingRegions[stateData.name] = {
              subL1_id: stateData.sub_id,
              subL1_num: stateData.sub_num,
              subL2: intersectingCounties,
              source: stateSource,
            };
          }
        }
      }
    } catch (error) {
      console.error(`${funcName}: Failed to fetch or process data:`, error);
    }
    return intersectingRegions;
  };

  /**
   * Retrieves and identifies subdivisions that intersect with a given viewport bounding box.
   *
   * This asynchronous function fetches hierarchical subdivision data for a specified country based
   * on the subdivisions level (`Sub_level`). It checks for intersections at both first and second subdivision levels
   * (if applicable) and returns structured data detailing the intersecting areas.
   *
   * Process Overview:
   * 1. Constructs the URL for the country's first-level subdivision data.
   * 2. Fetches and checks first-level subdivisions for intersection with the viewport.
   * 3. For intersecting first-level subdivisions and if `Sub_level` is 2, constructs URLs for second-level data.
   * 4. Checks second-level subdivisions for intersection and integrate results into the output.
   * 5. Builds and returns a comprehensive object of intersecting subdivisions.
   *
   * Parameters:
   * - `viewportBbox`: {minLon: number, minLat: number, maxLon: number, maxLat: number}
   * Represents the geographic viewport for intersection checks.
   *
   * Error Handling:
   * - Logs warnings if no first-level or second-level data are found.
   * - Logs errors for issues with fetching or processing subdivisions.
   *
   * @param {Object} countryObj - An object containing details about the country, including ISO code and Sub_level.
   * @param {Object} viewportBbox - The bounding box of the viewport to check against.
   * @returns {Object} - An object containing details of intersecting subdivisions, organized by hierarchy.
   */
  wmeGisLBBOX.prototype.getIntersectingSubdivisions = async function (countryObj, viewportBbox) {
    const subdivisionsResult = {};
    const countryCode = countryObj.ISO_ALPHA3;
    const subL1Url = `${BASE_URL_BBOX}${countryCode}/${countryCode}_BBOX_ESPG4326.json`;
    const funcName = 'getIntersectingSubdivisions';
    try {
      // Check Sub_Level to decide how to handle subdivisions
      if (!countryObj.Sub_level) {
        return subdivisionsResult; // Return {} if Sub_Level is 0 or undefined
      }
      if (countryObj.Sub_level >= 1) {
        // Fetch first-level subdivision data
        const subL1Data = await this.fetchJsonWithCache(subL1Url);
        if (!subL1Data) {
          console.warn(`${funcName}: No first-level subdivision data found for country code: ${countryCode}`);
          return subdivisionsResult;
        }
        for (const subdivisionID in subL1Data) {
          const subdivision = subL1Data[subdivisionID];
          // Check intersection for first-level subdivisions
          if (checkIntersection(subdivision.bbox, viewportBbox)) {
            const subdivisionName = subdivision['name'];
            // Initialize data for this subdivision
            subdivisionsResult[subdivisionName] = {
              subL1_num: subdivision['sub_num'],
              subL1_id: subdivisionID,
              source: 'BBOX',
              subL2: {}, // Placeholder for second-level subdivisions
            };
            // If Sub_Level is 2, fetch second-level subdivision data
            if (countryObj.Sub_level === 2) {
              const subL2Url = `${BASE_URL_BBOX}${countryCode}/${countryCode}-${subdivisionID}_BBOX_ESPG4326.json`;
              try {
                const subL2Data = await this.fetchJsonWithCache(subL2Url);
                if (!subL2Data) {
                  console.warn(`${funcName}: No second-level subdivision data found for ${subdivisionName} (${subdivisionID}) in country: ${countryCode}`);
                } else {
                  // Process second-level subdivisions
                  for (const subsubDivision of subL2Data) {
                    const subsubID = Object.keys(subsubDivision)[0];
                    const subsub = subsubDivision[subsubID];
                    // Check intersection for second-level subdivisions
                    if (checkIntersection(subsub.bbox, viewportBbox)) {
                      const subsubName = subsub['name'];
                      // Add intersecting second-level subdivisions
                      subdivisionsResult[subdivisionName].subL2[subsubName] = {
                        subL2_num: subsub['sub_num'],
                        source: 'BBOX',
                      };
                    }
                  }
                }
              } catch (subError) {
                console.warn(`${funcName}: Error fetching second-level data for ${subdivisionName} (${subdivisionID}) in country: ${countryCode} - ${subError.message}`);
              }
            } // End of Sub_Level 2 check
          }
        }
      }
    } catch (error) {
      console.error(`${funcName}: Error fetching or processing subdivisions for country code ${countryCode} - ${error.message}`);
    }
    return subdivisionsResult;
  };

  /**
   * Determines regions within the viewport by identifying intersecting countries and their subdivisions.
   *
   * This asynchronous function analyzes a given viewport bounding box to determine which countries
   * and internal subdivisions, such as states and counties, are visible. It accommodates the USA
   * specifically and uses different handling for other countries.
   *
   * Process Overview:
   * 1. Fetches countries that intersect with the viewport.
   * 2. If no intersecting countries are found, logs a warning.
   * 3. For the USA, retrieves intersecting states and counties; for other countries, retrieves subdivisions.
   * 4. Cleans up intersecting data to ensure only relevant information is retained.
   * 5. Constructs a results object that maps visible countries to their intersecting subdivisions.
   *
   * Features:
   * - Supports high precision checks using GeoJSON data if specified.
   * - Integration of subdivision logic for both the USA and other countries.
   *
   * viewportBbox: {minLon: number, minLat: number, maxLon: number, maxLat: number}
   *
   * Error Handling:
   * - Logs errors encountered during the fetching and processing of intersecting regions.
   *
   * @param {Object} viewportBbox - The bounding box defining the current viewport.
   * @param {boolean} [highPrecision=false] - Flag to use high precision intersection checks.
   * @param {boolean} [returnGeoJson=false] - Flag to determine if GeoJSON data should be returned.
   * @returns {Object} - Structured results identifying regions within the viewport.
   **/
  wmeGisLBBOX.prototype.whatsInView = async function (viewportBbox, highPrecision = false, returnGeoJson = false) {
    const results = {};
    const funcName = 'whatsInView';
    try {
      const countries = await this.getIntersectingCountries(viewportBbox);
      if (!countries || Object.keys(countries).length === 0) {
        console.warn(`${funcName}: Viewport does not intersect with any known countries.`);
        return results;
      }
      for (const countryCode in countries) {
        const country = countries[countryCode];
        // Handle the case when Sub_level is 0
        if (country.Sub_level === 0) {
          results[country.name] = {
            ISO_ALPHA2: country.ISO_ALPHA2,
            ISO_ALPHA3: country.ISO_ALPHA3,
            Sub_level: country.Sub_level,
            source: country.source,
            subL1: {}, // Leave subL1 empty when Sub_level is 0
          };
          continue;
        }
        if (country.ISO_ALPHA3 === 'USA') {
          const statesAndCounties = await this.getIntersectingStatesAndCounties(viewportBbox, highPrecision, returnGeoJson);
          if (statesAndCounties && Object.keys(statesAndCounties).length > 0) {
            results[country.name] = {
              ISO_ALPHA2: country.ISO_ALPHA2,
              ISO_ALPHA3: country.ISO_ALPHA3,
              Sub_level: country.Sub_level,
              subL1: statesAndCounties,
            };
            this.cleanIntersectingData(results);
          }
        } else {
          const subdivisions = await this.getIntersectingSubdivisions(country, viewportBbox);
          if (subdivisions && Object.keys(subdivisions).length > 0) {
            results[country.name] = {
              ISO_ALPHA2: country.ISO_ALPHA2,
              ISO_ALPHA3: country.ISO_ALPHA3,
              Sub_level: country.Sub_level,
              subL1: subdivisions,
            };
            this.cleanIntersectingData(results);
          }
        }
      }
    } catch (error) {
      console.error(`${funcName}: Error during finding intersecting regions:`, error);
    }
    return results;
  };

  /**
   * Determines if a given point is inside a polygon using the ray-casting algorithm.
   *
   * This function checks whether a point, defined by its coordinates, is inside a polygon.
   * The polygon is represented by an array of vertices (points), and the function uses the
   * ray-casting technique to toggle the state whenever the ray crosses a polygon edge.
   *
   * Process Overview:
   * 1. Iterates over each edge of the polygon using vertex pairs (xi, yi) and (xj, yj).
   * 2. Uses logical conditions to check if a horizontal ray extending from the point intersects
   *    with the polygon's edge.
   * 3. Toggles 'inside' state whenever an intersection is detected, flipping between true and false.
   * 4. Returns the final 'inside' state, indicating whether the point lies within the polygon.
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

  /**
   * Calculates the intersection point, if any, between two line segments defined by endpoints.
   *
   * This function checks whether two line segments, one defined by (p1, p2) and the other by (q1, q2),
   * intersect. The method utilizes linear algebra to derive intersection coordinates and subsequently
   * verifies that the intersection falls within the bounds of both segments.
   *
   * Process Overview:
   * 1. Computes coefficients for the line equations using segment endpoints.
   * 2. Determines if the lines are parallel (denominator = 0), in which case no intersection exists.
   * 3. Calculates potential intersection coordinates using determinant-based formulae.
   * 4. Verifies if the intersection coordinates lie within the bounds of both line segments.
   * 5. Returns the intersection point if valid, or null if no intersection exists within segment limits.
   *
   * @param {Array} p1 - [x, y] coordinates of the first endpoint of the first segment.
   * @param {Array} p2 - [x, y] coordinates of the second endpoint of the first segment.
   * @param {Array} q1 - [x, y] coordinates of the first endpoint of the second segment.
   * @param {Array} q2 - [x, y] coordinates of the second endpoint of the second segment.
   * @returns {Array|null} - [x, y] coordinates of the intersection point, or null if no intersection.
   **/
  function segmentIntersection(p1, p2, q1, q2) {
    // Calculate coefficients
    const a1 = p2[1] - p1[1];
    const b1 = p1[0] - p2[0];
    const c1 = a1 * p1[0] + b1 * p1[1];

    const a2 = q2[1] - q1[1];
    const b2 = q1[0] - q2[0];
    const c2 = a2 * q1[0] + b2 * q1[1];

    const denominator = a1 * b2 - a2 * b1;

    if (denominator === 0) {
      return null; // Parallel lines
    }

    const intersectX = (b2 * c1 - b1 * c2) / denominator;
    const intersectY = (a1 * c2 - a2 * c1) / denominator;

    // Check if the intersection is within the bounds of the line segments
    const withinBounds = (value, end1, end2) => Math.min(end1, end2) <= value && value <= Math.max(end1, end2);

    if (withinBounds(intersectX, p1[0], p2[0]) && withinBounds(intersectY, p1[1], p2[1]) && withinBounds(intersectX, q1[0], q2[0]) && withinBounds(intersectY, q1[1], q2[1])) {
      return [intersectX, intersectY];
    }

    return null; // Intersection point is not within the line segments
  }

  /**
   * Checks for intersection between two polygons.
   *
   * This function determines if two polygons intersect by examining:
   * 1. If any edges from `polygon1` intersect with any edges from `polygon2`.
   * 2. If any point from `polygon1` is contained within `polygon2`.
   * 3. If any point from `polygon2` is contained within `polygon1`.
   *
   * The function uses helper methods `segmentIntersection` to check edge intersections
   * and `isPointInPolygon` to evaluate point containment.
   *
   * Process Overview:
   * - Iterates over edges of both polygons, checking for intersection using the `segmentIntersection` function.
   * - Verifies point containment using the `isPointInPolygon` function to see if any point from one polygon is inside the other.
   * - Returns true if any intersection or containment is found; otherwise, returns false.
   *
   * @param {Array} polygon1 - An array of points defining the first polygon, where each point is an {x, y} object.
   * @param {Array} polygon2 - An array of points defining the second polygon, where each point is an {x, y} object.
   * @returns {boolean} - True if an intersection or containment is found between the polygons, false otherwise.
   **/
  function hasIntersection(polygon1, polygon2) {
    // Check each edge of polygon1 against each edge of polygon2
    for (let i = 0; i < polygon1.length - 1; i++) {
      for (let j = 0; j < polygon2.length - 1; j++) {
        const intersection = segmentIntersection(polygon1[i], polygon1[i + 1], polygon2[j], polygon2[j + 1]);

        if (intersection) {
          return true; // An intersection is found
        }
      }
    }

    // Check if any point of polygon1 is inside polygon2
    for (const point of polygon1) {
      if (isPointInPolygon(point, polygon2)) {
        return true; // A contained point is found
      }
    }

    // Check if any point of polygon2 is inside polygon1
    for (const point of polygon2) {
      if (isPointInPolygon(point, polygon1)) {
        return true; // A contained point is found
      }
    }

    return false; // No intersection found
  }

  return wmeGisLBBOX;
})();
