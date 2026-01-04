// ==UserScript==
// @name                GeoWKTer
// @namespace           https://github.com/JS55CT
// @description         geoWKTer is a JavaScript library designed to convert WKT data into GeoJSON format efficiently. It supports conversion of Point, LineString, Polygon, and MultiGeometry elements.
// @version             2.3.0
// @author              JS55CT
// @license             MIT
// @match              *://this-library-is-not-supposed-to-run.com/*
// ==/UserScript==

/***************************************
 * GeoWKTer Constructor Function
 * The `GeoWKTer` function serves as a constructor for creating instances that
 * manage the conversion of Well-Known Text (WKT) strings into GeoJSON representations.
 * It initializes regex patterns used for parsing WKT, and offers a structure to hold
 * spatial features processed from those strings.
 *
 *  MIT License
 * Copyright (c) 2022 hu de yi
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * GeoWKTer inspired by the work of Wicket.js <https://github.com/arthur-e/Wicket> (GPL-3.0 licensed)
 * and terraformer <https://github.com/terraformer-js/terraformer/tree/main> (MIT licensed)
 ****************************************/
var GeoWKTer = (function () {
  function GeoWKTer() {
    this.features = []; // Initialize an array to store parsed feature data
    this.regExes = {
      // Regular expressions for parsing WKT strings
      typeStr: /^\s*(\w+)\s*\((.*)\)\s*$/, // Capture geometry type and contents
      spaces: /\s+|\+/, // Detect spaces or plus signs for splitting coordinates
      comma: /\s*,\s*/, // Capture commas surrounded by optional whitespace
      parenComma: /\)\s*,\s*\(/, // Split on closing parentheses followed by a comma and opening parentheses
    };
  }

  /*****************************************
   * Clean WKT String
   *
   * This function processes a Well-Known Text (WKT) string,
   * removing unnecessary spaces and newlines within
   * parenthesized coordinate lists. It ensures commas have
   * consistent spacing, typically immediately following
   * coordinate values. Primarily targets complex geometries
   * like MULTIPOLYGON, optimizing coordinate definition
   * clarity and compactness.
   *
   * @param {string} wkt - The WKT string to clean.
   * @returns {string} - The cleaned WKT string, with optimized spacing.
   *****************************************/
  GeoWKTer.prototype.cleanWKTString = function (wkt) {
    return wkt
      .replace(/[\n\r]+/g, " ") // Replace newlines with a single space
      .replace(/\s\s+/g, " ") // Replace multiple spaces with a single space
      .replace(/([A-Z]+)\s*\(/g, "$1(") // Ensure no space between type and opening parenthesis
      .replace(/\(\s+/g, "(") // Remove spaces after opening parentheses
      .replace(/\s+\)/g, ")") // Remove spaces before closing parentheses
      .replace(/,\s+/g, ",") // Remove spaces after commas
      .replace(/\s+,/g, ",") // Remove spaces before commas
      .trim(); // Trim leading and trailing whitespaces
  };

  /***************************************
   * Read WKT and Convert to Internal Representation
   * This function takes a Well-Known Text (WKT) string, processes it to produce
   * a cleaned and standardized version, and then converts it to an internal data
   * structure that represents the geometry for further processing or transformation
   * to GeoJSON. This step is crucial for understanding and manipulating spatial data.
   *
   * @param {string} wktText - The original WKT string representing a geometry or
   *                           collection of geometries (e.g., POINT, POLYGON).
   * @param {string} label - A descriptive label or identifier associated with the
   *                         geometry, which will be stored for use in GeoJSON properties.
   * @returns {Object[]} - An array containing a single object with:
   *                        - type: the type of geometry (e.g., POINT, POLYGON).
   *                        - components: the coordinates or geometries depending on type.
   *                        - label: the provided label for this geometry.
   * @throws {Error} - Throws an error if the WKT is malformed or cannot be processed,
   *                   indicating the WKT string is invalid or unsupported.
   *
   * Procedure:
   * 1. Clean WKT String: Utilize `cleanWKTString` to standardize the WKT input,
   *    handling cases like whitespace normalization, and ensuring it matches expected format.
   *
   * 2. Convert to GeoJSON: Pass the cleaned WKT string to `wktToGeoJSON` for transformation
   *    into a GeoJSON-like structure. This process involves parsing the WKT syntax into
   *    an object with a `type` and relevant coordinates or geometries attribute.
   *
   * 3. Construct Internal Representation: Return the parsed structure as a new object with:
   *    - `type`: Captured from the GeoJSON object.
   *    - `components`: The coordinates (or geometries array) reflecting the parsed data.
   *    - `label`: Passed through for later use in properties or identifications.
   *
   * 4. Error Handling: Any failure in parsing triggers an exception with a descriptive message,
   *    alerting the user or developer to malformed or unsupported inputs.
   ****************************************/
  GeoWKTer.prototype.read = function (wktText, label) {
    try {
      // Clean and standardize the input WKT string
      const cleanedWKT = this.cleanWKTString(wktText);

      // Convert the cleaned WKT to a GeoJSON-like structure
      const geoJSON = this.wktToGeoJSON(cleanedWKT);

      // Return the internal representation with the given label
      return [
        {
          type: geoJSON.type, // Extract the geometry type
          components: geoJSON.coordinates || geoJSON.geometries, // Choose coordinates or geometries attribute based on type
          label, // Add the provided label for future reference
        },
      ];
    } catch (error) {
      // Handle and throw errors related to malformed or unsupported WKT
      throw new Error(error.message);
    }
  };

  /***************************************
   * Convert Internal Data Array to GeoJSON
   * This function takes an array of internal data objects—each representing
   * parsed WKT geometries—and converts them into a valid GeoJSON object.
   * Specifically, it structures these geometries into GeoJSON features within
   * a FeatureCollection, appropriately handling both individual geometries
   * and collections of geometries.
   *
   * @param {Object[]} dataArray - An array of objects where each contains:
   *                                - type: the geometric type (e.g., POINT, POLYGON).
   *                                - components: either the coordinates of a
   *                                  single geometry or an array of geometries.
   *                                - label: optional description used as a property.
   * @returns {Object} - GeoJSON object formatted as a FeatureCollection, comprising
   *                     individual features with their associated geometries and properties.
   *
   * Steps Involved:
   * 1. Initialize `features`: Accumulate each processed geometry into this array
   *    as a GeoJSON `Feature`, maintaining a list to be included in the final
   *    `FeatureCollection`.
   *
   * 2. Iterate Over Data Array: For each geometry object from the parsed internal
   *    data:
   *
   *    - **Geometry Collections**:
   *      - Identify the `GEOMETRYCOLLECTION` type and ensure `components` is an array.
   *      - Iterate through each geometry in the collection, converting each into
   *        a GeoJSON `Feature` by specifying its type and coordinates, and pushing
   *        it to the `features` list.
   *
   *    - **Other Geometries**:
   *      - Construct a GeoJSON `Feature` using the individual geometry's `type` and
   *        `coordinates` directly.
   *      - Append each to `features`, ensuring they include property details.
   *
   * 3. Construct FeatureCollection: Wrap the accumulated features array into a
   *    GeoJSON formatted object by designating it as a `FeatureCollection`.
   *
   * WARNING: The input WKT geometries do not include spatial reference system (SRS) information.
   * This function purely reformats the WKT to GeoJSON without assuming or verifying any particular
   * coordinate reference system. If the input geometries are not in the standard EPSG:4326 (WGS 84),
   * the resulting GeoJSON will also lack standard CRS information, which may lead to incorrect spatial
   * data representation or interpretation.
   * Users should ensure that the input data is in the intended coordinate system for their applications.
   ****************************************/
  GeoWKTer.prototype.toGeoJSON = function (dataArray) {
    // Mapping object for GeoJSON type conversion
    const geoJSONTypeMap = {
      POINT: "Point",
      LINESTRING: "LineString",
      POLYGON: "Polygon",
      MULTIPOINT: "MultiPoint",
      MULTILINESTRING: "MultiLineString",
      MULTIPOLYGON: "MultiPolygon",
      GEOMETRYCOLLECTION: "GeometryCollection",
    };

    // Reduce the internal data array into a GeoJSON features array
    const features = dataArray.reduce((accum, data) => {
      const { type, components, label } = data; // Destructure for ease of use

      // Convert type to uppercase and map to correct GeoJSON type
      const geoJSONType = geoJSONTypeMap[type.toUpperCase()];

      if (geoJSONType === "GeometryCollection" && Array.isArray(components)) {
        // If it's a geometry collection, iterate over its components
        components.forEach((geometry) => {
          const geometryType = geoJSONTypeMap[geometry.type.toUpperCase()];
          accum.push({
            type: "Feature",
            geometry: {
              type: geometryType,
              coordinates: geometry.coordinates,
            },
            properties: {
              Name: label || "",
            },
          });
        });
      } else if (geoJSONType) {
        // Handle non-collection geometries directly as a single GeoJSON feature
        accum.push({
          type: "Feature",
          geometry: {
            type: geoJSONType,
            coordinates: components,
          },
          properties: {
            Name: label || "",
          },
        });
      }

      return accum; // Return the accumulator for the next iteration
    }, []);

    // Return the complete GeoJSON FeatureCollection with CRS info
    return {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      },
      features: features,
    };
  };

  /***************************************
   * Convert WKT to GeoJSON
   * @param {string} wkt - The WKT string.
   * @returns {Object} - GeoJSON object.
   * @throws {Error} - Throws if WKT is unsupported or invalid.
   ****************************************/
  GeoWKTer.prototype.wktToGeoJSON = function (wkt) {
    const match = this.regExes.typeStr.exec(wkt);
    if (!match) throw new Error("Invalid WKT");

    const type = match[1].toUpperCase();
    const data = match[2];

    const parsers = {
      POINT: this.parsePoint,
      LINESTRING: this.parseLineString,
      POLYGON: this.parsePolygon,
      MULTIPOINT: this.parseMultiPoint,
      MULTILINESTRING: this.parseMultiLineString,
      MULTIPOLYGON: this.parseMultiPolygon,
      GEOMETRYCOLLECTION: this.parseGeometryCollection,
    };

    if (!parsers[type]) {
      throw new Error(`Unsupported WKT type: ${type}`);
    }

    const result = parsers[type].call(this, data);
    if (type === "GEOMETRYCOLLECTION") {
      return { type, geometries: result };
    }

    return { type, coordinates: result };
  };

  /***************************************
   * Parse Point Geometry
   * @param {string} str - The WKT coordinates string.
   * @returns {number[]} - Array of numbers representing the point.
   ****************************************/
  GeoWKTer.prototype.parsePoint = function (str) {
    return str.trim().split(" ").map(Number);
  };

  /***************************************
   * Parse LineString Geometry
   * @param {string} str - The WKT coordinates string.
   * @returns {number[][]} - Array of arrays representing the linestring.
   ****************************************/
  GeoWKTer.prototype.parseLineString = function (str) {
    return str.split(",").map((pair) => {
      return pair.trim().split(" ").map(Number);
    });
  };

  /***************************************
   * Parse Polygon Geometry
   * @param {string} str - The WKT coordinates string.
   * @returns {number[][][]} - Array of arrays representing the polygon.
   ****************************************/
  GeoWKTer.prototype.parsePolygon = function (str) {
    return str.match(/\([^()]+\)/g).map((ring) => {
      return ring
        .replace(/[()]/g, "")
        .split(",")
        .map((pair) => {
          return pair.trim().split(" ").map(Number);
        });
    });
  };

  /***************************************
   * Parse MultiPoint Geometry
   * @param {string} str - The WKT coordinates string.
   * @returns {number[][]} - Array of points representing the multipoint.
   ****************************************/
  GeoWKTer.prototype.parseMultiPoint = function (str) {
    // If the WKT includes nested parentheses
    const matchParenPoints = str.match(/\(\s*([^()]+)\s*\)/g);
    if (matchParenPoints) {
      return matchParenPoints.map((pointStr) => {
        return this.parsePoint(pointStr.replace(/[()]/g, "").trim());
      });
    } else {
      return str.split(",").map(this.parsePoint.bind(this));
    }
  };

  /***************************************
   * Parse MultiLineString Geometry
   * @param {string} str - The WKT coordinates string.
   * @returns {number[][][]} - Array of linestrings representing the multilinestring.
   ****************************************/
  GeoWKTer.prototype.parseMultiLineString = function (str) {
    return str.match(/\(([^()]+)\)/g).map((linestring) => {
      return this.parseLineString(linestring.replace(/[()]/g, "").trim());
    });
  };

  /***************************************
   * Parse MultiPolygon Geometry
   * @param {string} str - The WKT coordinates string.
   * @returns {number[][][][]} - Array of polygons representing the multipolygon.
   ****************************************/
  GeoWKTer.prototype.parseMultiPolygon = function (str) {
    // Match groups of polygons within MULTIPOLYGON
    const polygonMatches = str.match(/\(\([^)]+\)\)/g);

    if (!polygonMatches) {
      throw new Error("Invalid MULTIPOLYGON WKT format");
    }

    return polygonMatches.map((polygonStr) => {
      // Each match represents a polygon, stripping the outer parentheses
      const cleanedPolygonStr = polygonStr.slice(1, -1); // Removes the outermost two parenthesis levels
      return this.parsePolygon(cleanedPolygonStr);
    });
  };

  /***************************************
   * Extract Geometries from WKT GeometryCollection
   * This function scans through a WKT formatted string that represents a
   * GEOMETRYCOLLECTION and identifies individual geometry components within
   * it. The function splits the string into manageable parts, each corresponding
   * to a distinct geometry (e.g., POINT, LINESTRING).
   *
   * @param {string} str - The WKT string containing the collection of geometries.
   * @returns {string[]} - An array of WKT strings, each representing a
   *                       single geometry component from the GEOMETRYCOLLECTION.
   *
   * Procedure:
   * 1. Initialize an array `geometries` to collect extracted WKT segments.
   * 2. Define `geometryTypes`, an array containing the WKT keywords for supported
   *    geometry types, which are POINT, LINESTRING, POLYGON, MULTIPOINT,
   *    MULTILINESTRING, and MULTIPOLYGON.
   * 3. Utilize two variables, `depth` and `start`, to track the nesting level
   *    of parentheses and the start position of each geometry component.
   *
   * Main Loop:
   * - Iterate over each character in the string.
   * - Adjust `depth` to reflect the current level of parenthesis nesting,
   *   incrementing with '(' and decrementing with ')'.
   * - Upon reaching `depth` 0, examine the current location in the string
   *   for potential geometry type keywords.
   * - When a geometry type is detected at `depth` 0, mark the end of the
   *   preceding geometry segment, if any, and append it to `geometries`.
   * - Set `start` to the current index, marking the beginning of the next geometry.
   *
   * Finalization:
   * - After exiting the loop, capture any remaining geometry from `start` to
   *   the end of the string, appending it to the `geometries` list.
   *
   * This approach ensures each nested geometry in a GEOMETRYCOLLECTION is
   * accurately isolated as its own distinct WKT segment, ready for parsing.
   ****************************************/
  GeoWKTer.prototype.extractGeometries = function (str) {
    const geometries = []; // Array to store each extracted geometry WKT
    const geometryTypes = ["POINT", "LINESTRING", "POLYGON", "MULTIPOINT", "MULTILINESTRING", "MULTIPOLYGON"]; // Known geometry types
    let depth = 0; // Tracks current depth level of parentheses
    let start = 0; // Marks the start index of the current geometry segment

    // Iterate over each character in the WKT string
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "(") depth++; // Increment depth for each opening parenthesis
      if (str[i] === ")") depth--; // Decrement depth for each closing parenthesis

      // Check if we're at a zero depth, potentially between geometries
      if (depth === 0) {
        // Explore possible starts of a new geometry type
        geometryTypes.forEach((type) => {
          if (str.startsWith(type, i)) {
            // Check if this point indicates a new geometry type
            if (i > start) {
              // Ensure there's a segment before this new start
              const geometry = str.slice(start, i).trim(); // Extract the previous geometry segment
              if (geometry) {
                // Ensure it's non-empty
                geometries.push(geometry); // Add to the list of extracted geometries
              }
            }
            start = i; // Update start to the current position for the new geometry
          }
        });
      }
    }

    // Process the final segment if there's any left
    if (start < str.length) {
      const geometry = str.slice(start).trim(); // Extract remaining geometry segment
      if (geometry) {
        // Ensure non-empty
        geometries.push(geometry); // Add last geometry
      }
    }

    return geometries; // Return all extracted geometry components
  };

  /***************************************
   * Parse GeometryCollection
   * This function processes a Well-Known Text (WKT) input string that represents
   * a GEOMETRYCOLLECTION, and converts it into an array of geometry objects
   * (not features at this stage) with identifying characteristics to be
   * transformed into GeoJSON later.
   *
   * @param {string} str - The WKT string for the geometry collection, usually in the form
   *                       'GEOMETRYCOLLECTION(POINT(...), LINESTRING(...), ...)'.
   * @param {string} [label] - An optional label for each geometry parsed, which may be used
   *                           later as a name property in GeoJSON.
   * @returns {Object[]} - An array of geometry objects, each containing:
   *                        - type: the type of geometry (e.g., POINT, LINESTRING).
   *                        - coordinates: numerical array(s) representing the geometry's
   *                          spatial data.
   *
   * The following steps are performed:
   * 1. Setting up parsers: Retrieve the appropriate parsing functions for each
   *    known geometry type, such as POINT or POLYGON, from a predefined map of
   *    methods.
   *
   * 2. Extract geometries: Invoke `extractGeometries` to decompose the WKT string
   *    into its respective geometry components based on delimiters and nesting,
   *    isolating each geometry's WKT sub-string.
   *
   * 3. Parse each geometry: Iterate through the extracted geometries:
   *    - Use regular expressions to identify the type and retrieve the coordinate details.
   *    - Apply the corresponding parser to transform WKT coordinates into numerical arrays.
   *    - Store the result as an object with `type` and `coordinates` attributes.
   *
   * 4. Error Handling: If a geometry type is unsupported or if parsing fails, an
   *    exception is raised to indicate incorrect or unsupported formatting.
   *
   * This function does not wrap the geometries in GeoJSON features but prepares
   * the data in a way that can be easily transformed into GeoJSON format by
   * following processes.
   ****************************************/
  GeoWKTer.prototype.parseGeometryCollection = function (str, label = "") {
    const components = []; // Array to hold parsed geometry objects

    // Map for geometry type to the appropriate parsing function
    const parsers = {
      POINT: this.parsePoint,
      LINESTRING: this.parseLineString,
      POLYGON: this.parsePolygon,
      MULTIPOINT: this.parseMultiPoint,
      MULTILINESTRING: this.parseMultiLineString,
      MULTIPOLYGON: this.parseMultiPolygon,
    };

    // Extract each geometry from the GeometryCollection WKT string
    const geometries = this.extractGeometries(str);

    // Process each individual WKT geometry
    geometries.forEach((geometryWKT) => {
      // Match the geometry type and coordinate section
      const match = geometryWKT.match(/([A-Z]+)\s*\((.*)\)/i);
      if (match) {
        const type = match[1].toUpperCase(); // Capture geometry type
        const parser = parsers[type]; // Get parser for this geometry type
        if (parser) {
          // Parse coordinates using the relevant parser function
          const coordinates = parser.call(this, match[2].trim());
          components.push({
            type: type, // Store geometry type
            coordinates: coordinates, // Store parsed coordinates
          });
        } else {
          // Raise error if unsupported geometry type is encountered
          throw new Error(`Unsupported geometry type: ${type}`);
        }
      } else {
        // Raise error if WKT parsing fails
        throw new Error("Failed to parse geometry WKT");
      }
    });

    return components; // Return the array of parsed geometry objects
  };

  return GeoWKTer;
})();
