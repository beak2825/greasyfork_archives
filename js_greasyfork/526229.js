// ==UserScript==
// @name                GeoGMLer
// @namespace           https://github.com/JS55CT
// @description         GeoGMLer is a JavaScript library for converting GML data into GeoJSON. It translates FeatureMembers with Points, LineStrings, and Polygons, handling coordinates via gml:coordinates and gml:posList. Supports multi-geometries to ensure conversion to GeoJSON's FeatureCollection.
// @version             2.1.0
// @author              JS55CT
// @license             MIT
// @match              *://this-library-is-not-supposed-to-run.com/*
// ==/UserScript==

/***********************************************************
 * ## Project Home < https://github.com/JS55CT/GeoGMLer >
 *  MIT License
 * Copyright (c) 2025 Justin
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
 * - Project was inspired by the work of [gml2geojson](https://github.com/deyihu/gml2geojson) (MIT licensed)
 *  and builds upon the concepts and implementations found there
 **************************************************************/

/** TO DO:  intergrate pro4.js to convert to ESPG:4326 standerd
 * The default Coordinate Reference System (CRS) for GeoJSON is WGS 84, which is represented by the EPSG code 4326.
 * This means that coordinates in a GeoJSON file are expected to be in longitude and latitude format, following the WGS 84 datum.
 * In the GeoJSON format, the coordinates are typically ordered as [longitude, latitude].
 * It's important to adhere to this order to ensure proper geospatial data interpretation and interoperability with GIS tools
 * and applications that conform to the GeoJSON specification.
 *
 * While GeoJSON does allow specifying other coordinate reference systems through extensions,
 * the use of any CRS other than WGS 84 is not recommended as it breaks the convention and could impact interoperability
 * and usability across services and applications that expect WGS 84.
 */

var GeoGMLer = (function () {
  /**
   * GeoGMLer constructor function.
   * @returns {GeoGMLer} - An instance of GeoGMLer.
   */
  function GeoGMLer(obj) {
    if (obj instanceof GeoGMLer) return obj;
    if (!(this instanceof GeoGMLer)) return new GeoGMLer(obj);
    this._wrapped = obj;
  }

  const GEONODENAMES = ["geometryproperty", "geometryProperty"];

  /**
   * Reads a GML string and prepares it for conversion by extracting
   * both the parsed XML document and its coordinate reference system (CRS).
   * @param {string} str - The GML string to read.
   * @returns {Object} - An object containing the parsed XML document and CRS name.
   * @property {Document} xmlDoc - The parsed XML document.
   * @property {string} crsName - The name of the coordinate reference system extracted from the GML.
   */
  GeoGMLer.prototype.read = function (gmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gmlText, "application/xml");

    // Check for parsing errors by looking for parser error tags
    const parseErrors = xmlDoc.getElementsByTagName("parsererror");
    if (parseErrors.length > 0) {
      const errorMessages = Array.from(parseErrors)
        .map((errorElement, index) => {
          return `Parsing Error ${index + 1}: ${errorElement.textContent}`;
        })
        .join("\n");

      console.error(errorMessages);
      throw new Error("Failed to parse GML. See console for details.");
    }

    // Extract the CRS directly within the read function if parsing is successful
    const crsName = this.getCRS(xmlDoc);

    // Return both the XML document and the CRS
    return {
      xmlDoc,
      crsName,
    };
  };

  /**
   * Converts a parsed GML XML document to a GeoJSON object, incorporating the specified CRS.
   * @param {Object} params - The parameters required for conversion.
   * @param {Document} params.xmlDoc - The parsed XML document to convert.
   * @param {string} params.crsName - The name of the coordinate reference system.
   * @returns {Object} - The GeoJSON object representing the features and their CRS.
   *
   * WARNING: The input GML geometries may specify a spatial reference system (SRS) through the `srsName` attribute.
   * This function extracts the `srsName` and includes it in the GeoJSON output under the 'crs' property:
   *
   * crs: {
   *   type: "name",
   *   properties: {
   *     name: crsName,
   *   },
   * },
   *
   * However, the function does not transform the coordinate values to match the EPSG:4326 (WGS 84) geoJSON standard.
   * This means the coordinate values remain in the original SRS specified by `srsName`.
   * Users should be aware that the GeoJSON output may not conform to expected standards if the original SRS
   * is not compatible with their intended use. It is essential to handle coordinate transformations as needed
   * for accurate spatial data representation.
   */
  GeoGMLer.prototype.toGeoJSON = function ({ xmlDoc, crsName }) {
    const geojson = {
      type: "FeatureCollection",
      features: [],
      crs: {
        type: "name",
        properties: {
          name: crsName,
        },
      },
    };

    // Get the main element of the feature collection
    const featureCollectionEle = xmlDoc.children[0];

    // Check if the node is a FeatureCollection, considering possible namespace prefixes
    const nodeName = this.getNodeName(featureCollectionEle); // this returns lowercase by default
    const isFeatureCollection = featureCollectionEle && featureCollectionEle.nodeName && nodeName.includes("featurecollection");

    // Validate the document structure
    if (!isFeatureCollection) {
      console.error("Invalid GML structure: The document does not contain a valid FeatureCollection element.");
      return geojson; // Return empty GeoJSON if the structure is incorrect
    }

    const features = [];

    // Iterate over each child node to extract feature members
    for (let i = 0; i < featureCollectionEle.children.length; i++) {
      const featureEle = featureCollectionEle.children.item(i);

      if (featureEle) {
        const childNodeName = this.getNodeName(featureEle);

        // Identify and collect feature member elements
        if (childNodeName.includes("featuremember") && featureEle.children[0]) {
          features.push(featureEle.children[0]);
        }
      }
    }

    // Process each feature member to extract properties and geometry
    for (let i = 0, len = features.length; i < len; i++) {
      const f = features[i];

      const properties = this.getFeatureEleProperties(f); // Extract properties
      const geometry = this.getFeatureEleGeometry(f, crsName); // Extract geometry using the provided CRS

      if (!geometry || !properties) {
        console.error(`Skipping feature ${i + 1} due to missing geometry or properties.`);
        continue; // Skip if geometry or properties are missing
      }

      const feature = {
        type: "Feature",
        geometry,
        properties,
      };
      geojson.features.push(feature); // Add the feature to the GeoJSON features array
    }

    return geojson; // Return the constructed GeoJSON object
  };

  /**
   * Retrieves the CRS (Coordinate Reference System) from GML.
   * @param {string} gmlString - The GML string.
   * @returns {string|null} - The CRS name or null.
   */
  // Enhanced getCRS function to search for srsName attribute in various geometry nodes
  GeoGMLer.prototype.getCRS = function (xmlDoc) {
    // Define a list of common GML geometry elements to check for srsName attribute
    const geometryTags = [
      "gml:Envelope",
      "gml:Point",
      "gml:LineString",
      "gml:Polygon",
      "gml:MultiPoint",
      "gml:MultiLineString",
      "gml:MultiPolygon",
      "gml:Surface",
      "gml:Solid",
      // Add other geometry types as needed
    ];

    for (const tag of geometryTags) {
      const elements = xmlDoc.getElementsByTagName(tag);
      for (let i = 0; i < elements.length; i++) {
        const srsName = elements[i].getAttribute("srsName");
        if (srsName) {
          return srsName.trim();
        }
      }
    }

    // Consider additional handling or logging if no srsName is found
    return null;
  };

  /**
   * Extracts the geometry from a GML feature element.
   * @param {Element} featureEle - The feature element.
   * @param {string} crsName - The name of the CRS.
   * @returns {Object|null} - The geometry object or null.
   */
  GeoGMLer.prototype.getFeatureEleGeometry = function (featureEle, crsName) {
    const children = featureEle.children || [];
    let type;
    let coordinates = [];

    for (let i = 0, len = children.length; i < len; i++) {
      const node = children[i];
      const nodeName = this.getNodeName(node);
      if (!this.isGeoAttribute(nodeName)) {
        continue;
      }

      if (node.children && node.children[0]) {
        type = node.children[0].nodeName.split("gml:")[1] || "";
        if (!type) {
          continue;
        }
        const geoElement = node.children[0];

        if (type === "Point") {
          coordinates = this.processPoint(geoElement, crsName);
          break;
        } else if (type === "MultiPoint") {
          coordinates = this.processMultiPoint(geoElement, crsName);
          break;
        } else if (type === "MultiSurface" || type === "MultiPolygon") {
          coordinates = this.processMultiSurface(geoElement, crsName);
          break;
        } else if (type === "MultiCurve" || type === "MultiLineString") {
          coordinates = this.processMultiCurve(geoElement, crsName);
          break;
        } else if (geoElement.children.length > 0) {
          let geoNodes = Array.from(geoElement.children);
          if (this.isMulti(this.getNodeName(geoNodes[0]))) {
            geoNodes = this.flatMultiGeoNodes(geoNodes);
          }

          if (geoNodes.length) {
            geoNodes.forEach((geoNode) => {
              let coords = this.parseGeoCoordinates(geoNode.children, crsName);
              if (!this.geoIsPolygon(type) && this.isMultiLine(type)) {
                coords = coords[0];
              }
              coordinates.push(coords);
            });
            break;
          }
        }
      }
    }

    if (!type || !coordinates.length) {
      return null;
    }

    return {
      type: this.mapGmlTypeToGeoJson(type),
      coordinates,
    };
  };

  /**
   * Processes a multi-surface element to extract polygons.
   * @param {Element} multiSurfaceElement - The multi-surface element.
   * @param {string} crsName - The name of the CRS.
   * @returns {Array} - Array of polygons.
   */
  GeoGMLer.prototype.processMultiSurface = function (multiSurfaceElement, crsName) {
    const polygons = [];
    const surfaceMembers = multiSurfaceElement.getElementsByTagName("gml:surfaceMember");

    for (let j = 0; j < surfaceMembers.length; j++) {
      const polygon = this.processPolygon(surfaceMembers[j].getElementsByTagName("gml:Polygon")[0], crsName);
      if (polygon) {
        polygons.push(polygon);
      }
    }
    return polygons;
  };

  /**
   * Processes a polygon element.
   * @param {Element} polygonElement - The polygon element.
   * @param {string} crsName - The name of the CRS.
   * @returns {Array} - Array representing the polygon.
   */
  GeoGMLer.prototype.processPolygon = function (polygonElement, crsName) {
    const polygon = [];
    const exteriorElements = polygonElement.getElementsByTagName("gml:exterior");

    if (exteriorElements.length > 0) {
      const exterior = this.parseRing(exteriorElements[0], crsName);
      if (exterior) {
        polygon.push(exterior);
      }
    }

    const interiorElements = polygonElement.getElementsByTagName("gml:interior");
    for (let k = 0; k < interiorElements.length; k++) {
      const interior = this.parseRing(interiorElements[k], crsName);
      if (interior) {
        polygon.push(interior);
      }
    }
    return polygon;
  };

  /**
   * Parses a ring element to extract coordinates.
   * @param {Element} ringElement - The ring element.
   * @param {string} crsName - The name of the CRS.
   * @returns {Array} - Array of coordinates.
   */
  GeoGMLer.prototype.parseRing = function (ringElement, crsName) {
    const coordNodes = ringElement.getElementsByTagName("gml:posList");
    if (coordNodes.length > 0) {
      return this.parseGeoCoordinates(coordNodes, crsName);
    }
    return [];
  };

  /**
   * Processes a multi-curve element to extract line strings.
   * @param {Element} multiCurveElement - The multi-curve element.
   * @param {string} crsName - The name of the CRS.
   * @returns {Array} - Array of line strings.
   */
  GeoGMLer.prototype.processMultiCurve = function (multiCurveElement, crsName) {
    const lineStrings = [];
    const curveMembers = multiCurveElement.getElementsByTagName("gml:curveMember");

    for (let j = 0; j < curveMembers.length; j++) {
      const lineStringElement = curveMembers[j].getElementsByTagName("gml:LineString")[0];
      if (lineStringElement) {
        const lineString = this.processLineString(lineStringElement, crsName);
        if (lineString) {
          lineStrings.push(lineString);
        }
      }
    }
    return lineStrings;
  };

  /**
   * Processes a line string element.
   * @param {Element} lineStringElement - The line string element.
   * @param {string} crsName - The name of the CRS.
   * @returns {Array} - Array of coordinates representing the line string.
   */
  GeoGMLer.prototype.processLineString = function (lineStringElement, crsName) {
    const coordNodes = lineStringElement.getElementsByTagName("gml:posList");
    if (coordNodes.length > 0) {
      return this.parseGeoCoordinates(coordNodes, crsName);
    }
    return [];
  };

  /**
   * Processes a GML Point geometry element to extract its coordinates.
   *
   * @param {Element} geoElement - The GML element representing the Point geometry.
   * @param {string} crsName - The coordinate reference system (CRS) name, used to determine if coordinate order needs to be reversed.
   *
   * @returns {Array} An array containing the coordinates for the Point. If no valid coordinates are found, an empty array is returned.
   *
   * The function first attempts to find the coordinates using the `<gml:pos>` element. If that is not available,
   * it looks for the `<gml:coordinates>` element instead. It utilizes the `parseGeoCoordinates` method to convert
   * the raw coordinate text into an array of numbers, considering the specified CRS.
   */
  GeoGMLer.prototype.processPoint = function (geoElement, crsName) {
    let coordNode = geoElement.getElementsByTagName("gml:pos");

    if (coordNode.length === 0) {
      coordNode = geoElement.getElementsByTagName("gml:coordinates");
    }

    if (coordNode.length > 0) {
      // Parse the coordinates
      const parsedCoords = this.parseGeoCoordinates([coordNode[0]], crsName);
      // Flatten them if necessary (should only be length 1 for a valid Point)
      return parsedCoords.length > 0 ? parsedCoords[0] : [];
    } else {
      return [];
    }
  };

  /**
   * Processes a multi-point element to extract the coordinates of each point.
   * @param {Element} multiPointElement - The element representing the MultiPoint geometry.
   * @param {string} crsName - The coordinate reference system (CRS) name.
   * @returns {Array} - An array of coordinate arrays for the multipoint.
   */
  GeoGMLer.prototype.processMultiPoint = function (multiPointElement, crsName) {
    const points = [];
    const pointMembers = multiPointElement.getElementsByTagName("gml:pointMember");

    for (let j = 0; j < pointMembers.length; j++) {
      const pointElement = pointMembers[j].getElementsByTagName("gml:Point")[0];
      if (pointElement) {
        const coordinates = this.processPoint(pointElement, crsName);
        if (coordinates.length > 0) {
          points.push(coordinates);
        }
      }
    }

    return points;
  };

  /**
   * Parses coordinate nodes into arrays of coordinates, considering the coordinate reference system (CRS)
   * and the coordinate formatting requirements.
   *
   * @param {HTMLCollection} coordNodes - The collection of coordinate nodes to be parsed.
   * @param {string} crsName - The name of the coordinate reference system (CRS).
   * @returns {Array} - An array of parsed coordinates.
   *
   * The `needsReversal` flag is determined by the CRS name. It is set to true for common geographic
   * coordinate systems like "EPSG:4326", "CRS84", or "WGS84", which typically use a "latitude, longitude"
   * format. Reversing is necessary when converting to systems expecting the "longitude, latitude" order
   * like geoJSON.
   *
   * The `isCommaSeparated` flag is used to determine the delimiter in the coordinate parsing. It checks
   * if the coordinates node is named with ":coordinates", which indicates that commas are used to
   * separate coordinate values (older versions of GML). This is essential for correctly interpreting data where commas are
   * the delimiter, distinguishing from systems using whitespace (GML3.X) with :pos and :posList.
   */
  GeoGMLer.prototype.parseGeoCoordinates = function (coordNodes, crsName) {
    const coordinates = [];
    const needsReversal = crsName.includes("4326") || crsName.includes("CRS84") || crsName.includes("WGS84");

    if (coordNodes.length === 0) {
    }

    for (let i = 0, len = coordNodes.length; i < len; i++) {
      const coordNode = this.findCoordsNode(coordNodes[i]);

      if (!coordNode) {
        continue;
      }

      const isCommaSeparated = this.getNodeName(coordNode).indexOf(":coordinates") > -1;
      const textContent = coordNode.textContent.trim();
      const coords = this.parseCoordinates(textContent, isCommaSeparated, needsReversal);

      coordinates.push(...coords);
    }
    return coordinates;
  };

  /**
   * Parses a coordinate string into an array of coordinate pairs, considering whether the input
   * uses commas as separators and whether the coordinate pair order needs to be reversed.
   *
   * @param {string} text - The text containing coordinates, which may be in different formats
   * based on the input data (e.g., comma-separated or space-separated).
   * @param {boolean} isCommaSeparated - A flag indicating if the coordinate string uses commas as
   * separators between individual coordinates. This is often observed in older data formats where
   * coordinates are presented as "x,y".
   * @param {boolean} needsReversal - A flag indicating if the latitude and longitude values need to
   * be reversed in order, which is particularly necessary for compatibility with modern formats like
   * GeoJSON. Older versions of GML (such as 1 and 2), when using the :coordinates tag and a CRS like
   * "EPSG:4326", often present coordinates in "latitude, longitude" format. In contrast, GeoJSON and
   * other modern systems require "longitude, latitude". However, in GML 3.x, it is more common to use
   * elements like :pos and :posList, which typically follow the "longitude, latitude" order, aligning
   * with modern geographic data representations regardless of the projection system used.
   * @returns {Array} - An array of coordinate pairs, where each pair is represented as an array of the
   * form [longitude, latitude] or [latitude, longitude] depending on the `needsReversal` flag.
   */
  GeoGMLer.prototype.parseCoordinates = function (text, isCommaSeparated, needsReversal) {
    if (!text) return [];

    const coords = text.trim().split(/\s+/);
    const coordinates = [];

    for (let i = 0; i < coords.length; i++) {
      let c1, c2;
      const coord = coords[i];

      if (isCommaSeparated) {
        if (coord.includes(",")) {
          const [x, y] = coord.split(",");
          c1 = this.trimAndParse(x);
          c2 = this.trimAndParse(y);
          coordinates.push(needsReversal ? [c1, c2] : [c2, c1]);
        }
      } else {
        c1 = this.trimAndParse(coord);
        c2 = this.trimAndParse(coords[i + 1]);
        i++; // Skip the next coordinate since it's already processed
        coordinates.push(needsReversal ? [c2, c1] : [c1, c2]);
      }
    }
    return coordinates;
  };

  /**
   * Trims and parses a string into a float.
   * @param {string} str - The string to parse.
   * @returns {number} - The parsed float.
   */
  GeoGMLer.prototype.trimAndParse = function (str) {
    return parseFloat(str.replace(/\s+/g, ""));
  };

  /**
   * Finds the coordinate node within a given node.
   * @param {Node} node - The node to search.
   * @returns {Node} - The coordinate node found.
   */
  GeoGMLer.prototype.findCoordsNode = function (node) {
    let nodeName = this.getNodeName(node);

    while (nodeName.indexOf(":coordinates") === -1 && nodeName.indexOf(":posList") === -1 && nodeName.indexOf(":pos") === -1) {
      node = node.children[0];
      nodeName = this.getNodeName(node);
    }
    return node;
  };

  /**
   * Retrieves the node name.
   * @param {Node} node - The node object.
   * @param {boolean} [lowerCase=true] - Whether to convert the name to lower case.
   * @returns {string} - The node name.
   */
  GeoGMLer.prototype.getNodeName = function (node, lowerCase = true) {
    if (lowerCase) {
      return (node.nodeName || "").toLocaleLowerCase();
    } else {
      return node.nodeName || "";
    }
  };

  /**
   * Checks if the geometry type is a polygon.
   * @param {string} type - The geometry type.
   * @returns {boolean} - True if the type is a polygon.
   */
  GeoGMLer.prototype.geoIsPolygon = function (type) {
    return type.indexOf("Polygon") > -1;
  };

  /**
   * Maps GML geometry types to GeoJSON types.
   * @param {string} type - The GML type.
   * @returns {string} - The corresponding GeoJSON type.
   */
  GeoGMLer.prototype.mapGmlTypeToGeoJson = function (type) {
    switch (type) {
      case "MultiCurve":
        return "MultiLineString";
      case "MultiSurface":
        return "MultiPolygon";
      default:
        return type; // Return as-is for matching types
    }
  };

  /**
   * Extracts feature element properties.
   * @param {Element} featureEle - The feature element.
   * @returns {Object} - The properties object.
   */
  GeoGMLer.prototype.getFeatureEleProperties = function (featureEle) {
    const children = featureEle.children || [];
    const properties = {};

    for (let i = 0, len = children.length; i < len; i++) {
      const node = children[i];
      const nodeName = this.getNodeName(node);

      // Skip geometry-related attributes
      if (this.isGeoAttribute(nodeName) && node.children.length) {
        continue;
      }

      // Skip boundedBy or other GML-specific elements
      if (nodeName === "gml:boundedby" || nodeName === "gml:geometryproperty") {
        continue;
      }

      // Extract feature properties
      const key = node.nodeName.includes(":") ? node.nodeName.split(":")[1] : node.nodeName;
      if (!key) {
        continue;
      }

      const value = node.textContent || "";
      properties[key] = value;
    }
    return properties;
  };

  /**
   * Flattens multi-geometry nodes.
   * @param {Array} nodes - The multi-geometry nodes.
   * @returns {Array} - Array of geometry nodes.
   */
  GeoGMLer.prototype.flatMultiGeoNodes = function (nodes) {
    const geoNodes = [];
    for (let i = 0, len = nodes.length; i < len; i++) {
      const children = nodes[i].children;
      for (let j = 0, len1 = children.length; j < len1; j++) {
        geoNodes.push(children[j].children[0]);
      }
    }
    return geoNodes;
  };

  /**
   * Checks if the node name indicates a multi-geometry.
   * @param {string} nodeName - The node name.
   * @returns {boolean} - True if the node denotes a multi-geometry.
   */
  GeoGMLer.prototype.isMulti = function (nodeName) {
    return nodeName.indexOf("member") > -1;
  };

  /**
   * Checks if the geometry type is a multi-line.
   * @param {string} type - The geometry type.
   * @returns {boolean} - True if the type is a multi-line.
   */
  GeoGMLer.prototype.isMultiLine = function (type) {
    return type === "MultiCurve" || type === "MultiLineString";
  };

  /**
   * Checks if the node name is a geometry attribute.
   * @param {string} nodeName - The node name.
   * @returns {boolean} - True if the attribute is geometry-related.
   */
  GeoGMLer.prototype.isGeoAttribute = function (nodeName) {
    return GEONODENAMES.some((geoName) => nodeName.indexOf(geoName) > -1);
  };

  return GeoGMLer;
})();
