// ==UserScript==
// @name                GeoKMLer
// @namespace           https://github.com/JS55CT
// @description         geoKMLer is a JavaScript library designed to convert KML data into GeoJSON format efficiently. It supports conversion of Placemarks containing Point, LineString, Polygon, and MultiGeometry elements.
// @version             2.3.0
// @author              JS55CT
// @license             MIT
// @match              *://this-library-is-not-supposed-to-run.com/*
// ==/UserScript==

/***********************************************************
 * ## Project Home < https://github.com/JS55CT/GeoKMLer >
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
 **************************************************************/
var GeoKMLer = (function () {
  /**
   * GeoKMLer constructor function.
   * @param {Object} obj - Optional object to wrap.
   * @returns {GeoKMLer} - An instance of GeoKMLer.
   */
  function GeoKMLer(obj) {
    if (obj instanceof GeoKMLer) return obj;
    if (!(this instanceof GeoKMLer)) return new GeoKMLer(obj);
    this._wrapped = obj;
  }

  /**
   * Parses a KML string into an XML DOM.
   * @param {string} kmlText - The KML text to parse.
   * @returns {Document} - The parsed XML document.
   */
  GeoKMLer.prototype.read = function (kmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, "application/xml");

    // Check for parsing errors by looking for parser error tags
    const parseErrors = xmlDoc.getElementsByTagName("parsererror");
    if (parseErrors.length > 0) {
      // If there are parsing errors, log them and throw an error
      const errorMessages = Array.from(parseErrors)
        .map((errorElement, index) => {
          return `Parsing Error ${index + 1}: ${errorElement.textContent}`;
        })
        .join("\n");

      console.error(errorMessages);

      // Throw an error to indicate parsing failure
      throw new Error("Failed to parse KML. See console for details.");
    }

    // If parsing is successful, return the parsed XML document
    return xmlDoc;
  };

  /**
   * Converts a KML document to a GeoJSON FeatureCollection.
   * @param {Document} document - The KML document to convert.
   * @param {boolean} includeCrs - Optional boolean to determine if CRS should be included.
   * @returns {Object} - The resulting GeoJSON FeatureCollection.
   *
   * NOTE:
   * KML files inherently assume the use of the EPSG:4326 (WGS 84) coordinate reference system
   * for all geographic coordinates. As such, when converting from KML to GeoJSON, the coordinates
   * are retained in the standard WGS 84 format.
   *
   * The GeoJSON output will conform to this CRS standard, and no additional CRS transformation are needed.
   * Users can rely on the spatial information being accurate with respect to the WGS 84 datum.
   *
   * Additionally, this function includes an option to add CRS information explicitly to the GeoJSON output (none standard).
   * By setting the `includeCrs` parameter to `true`, the resulting GeoJSON will include a 'crs' property
   * that specifies the use of EPSG:4326:  the geoJSON standard.
   *
   * crs: {
   *   type: "name",
   *   properties: {
   *     name: "EPSG:4326",
   *   },
   * }
   */
  GeoKMLer.prototype.toGeoJSON = function (document, includeCrs = false) {
    const features = [];
    for (const placemark of document.getElementsByTagName("Placemark")) {
      features.push(...this.handlePlacemark(placemark));
    }

    const geoJson = {
      type: "FeatureCollection",
      features: features,
    };

    if (includeCrs) {
      geoJson.crs = {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      };
    }

    return geoJson;
  };

  /**
   * Processes a KML Placemark and converts its geometries to GeoJSON features.
   * @param {Element} placemark - The Placemark element to process.
   * @returns {Array} - An array of GeoJSON features.
   */
  GeoKMLer.prototype.handlePlacemark = function (placemark) {
    const features = [];
    const properties = this.extractProperties(placemark);
    // Merge extended data directly into the properties without an additional 'ExtendedData' entry
    Object.assign(properties, this.extractExtendedData(placemark));

    for (let i = 0; i < placemark.children.length; i++) {
      const element = placemark.children[i];
      switch (element.tagName) {
        case "Point":
          features.push(this.pointToPoint(element, placemark, properties));
          break;
        case "LineString":
          features.push(this.lineStringToLineString(element, placemark, properties));
          break;
        case "Polygon":
          features.push(this.polygonToPolygon(element, placemark, properties));
          break;
        case "MultiGeometry":
          features.push(...this.handleMultiGeometry(element, placemark, properties));
          break;
      }
    }
    return features;
  };

  /**
   * Converts coordinate strings into arrays of [longitude, latitude].
   * @param {string} coordString - The coordinate string from KML.
   * @returns {Array} - An array of [longitude, latitude] pairs.
   */
  GeoKMLer.prototype.coordFromString = function (coordString) {
    return coordString.trim().split(/\s+/).map((coord) => {
        const [lon, lat, ele] = coord.split(",").map(parseFloat);
        return Number.isFinite(ele) ? [lon, lat, ele] : [lon, lat];
      });
  };

  /**
   * Parses a single coordinate string into a numeric array.
   * @param {string} v - The coordinate string.
   * @returns {Array} - An array of parsed coordinate values.
   */
  GeoKMLer.prototype.coord1 = function (v) {
    const removeSpace = /\s*/g;
    return v.replace(removeSpace, "").split(",").map(parseFloat);
  };

  /**
   * Parses multiple coordinate strings into an array of coordinate arrays.
   * @param {string} v - The coordinate string with multiple coordinates.
   * @returns {Array} - A nested array of parsed coordinate values.
   */
  GeoKMLer.prototype.coord = function (v) {
    const trimSpace = /^\s*|\s*$/g;
    const splitSpace = /\s+/;
    const coords = v.replace(trimSpace, "").split(splitSpace);
    return coords.map((coord) => this.coord1(coord));
  };

  /**
   * Extracts extended data from a KML placemark.
   * @param {Element} placemark - The Placemark element to extract from.
   * @returns {Object} - An object containing extended data properties.
   */
  GeoKMLer.prototype.extractExtendedData = function (placemark) {
    const extendedData = {};
    const extendedDataTag = this.getChildNode(placemark, "ExtendedData");
    if (!extendedDataTag) return extendedData;

    const simpleDatas = this.getChildNodes(extendedDataTag, "SimpleData");
    simpleDatas.forEach((data) => {
      const name = data.getAttribute("name");
      const value = this.nodeVal(data);
      if (name && value !== null) {
        extendedData[`ex_${name}`] = value.trim();
      }
    });

    return extendedData;
  };

  /**
   * Fetches the value of a text node.
   * @param {Node} x - The node to extract the value from.
   * @returns {string} - The text content of the node.
   */
  GeoKMLer.prototype.nodeVal = function (x) {
    return x ? x.textContent || "" : "";
  };

  /**
   * Retrieves a single child node of a specified tag name.
   * @param {Element} x - The parent element.
   * @param {string} y - The tag name of the child node.
   * @returns {Element|null} - The first matching child node or null if none are found.
   */
  GeoKMLer.prototype.getChildNode = function (x, y) {
    const nodeList = x.getElementsByTagName(y);
    return nodeList.length ? nodeList[0] : null;
  };

  /**
   * Retrieves all child nodes of a specified tag name.
   * @param {Element} x - The parent element.
   * @param {string} y - The tag name of the child nodes.
   * @returns {Array} - An array of matching child nodes.
   */
  GeoKMLer.prototype.getChildNodes = function (x, y) {
    return Array.from(x.getElementsByTagName(y));
  };

  /**
   * Retrieves an attribute value from an element.
   * @param {Element} x - The element to extract the attribute from.
   * @param {string} y - The name of the attribute.
   * @returns {string|null} - The attribute value or null if not present.
   */
  GeoKMLer.prototype.attr = function (x, y) {
    return x.getAttribute(y);
  };

  /**
   * Retrieves a floating-point attribute value from an element.
   * @param {Element} x - The element to extract the attribute from.
   * @param {string} y - The name of the attribute.
   * @returns {number} - The parsed floating-point attribute value.
   */
  GeoKMLer.prototype.attrf = function (x, y) {
    return parseFloat(this.attr(x, y));
  };

  /**
   * Normalizes an XML node to combine adjacent text nodes.
   * @param {Node} el - The XML node to normalize.
   * @returns {Node} - The normalized node.
   */
  GeoKMLer.prototype.norm = function (el) {
    if (el.normalize) el.normalize();
    return el;
  };

  /**
   * Creates a GeoJSON feature for a given geometry type and coordinates.
   * @param {string} type - The geometry type (Point, LineString, Polygon).
   * @param {Array} coords - The coordinates for the geometry.
   * @param {Object} props - The properties of the feature.
   * @returns {Object} - The created GeoJSON feature.
   */
  GeoKMLer.prototype.makeFeature = function (type, coords, props) {
    return {
      type: "Feature",
      geometry: {
        type: type,
        coordinates: coords,
      },
      properties: props,
    };
  };

  /**
   * Converts a KML Point to a GeoJSON Point feature.
   * @param {Element} node - The Point element.
   * @param {Element} placemark - The parent Placemark element.
   * @param {Object} props - The properties of the feature.
   * @returns {Object} - A GeoJSON Point feature.
   */
  GeoKMLer.prototype.pointToPoint = function (node, placemark, props) {
    const coord = this.coordFromString(node.getElementsByTagName("coordinates")[0].textContent)[0];
    return this.makeFeature("Point", coord, props);
  };

  /**
   * Converts a KML LineString to a GeoJSON LineString feature.
   * @param {Element} node - The LineString element.
   * @param {Element} placemark - The parent Placemark element.
   * @param {Object} props - The properties of the feature.
   * @returns {Object} - A GeoJSON LineString feature.
   */
  GeoKMLer.prototype.lineStringToLineString = function (node, placemark, props) {
    const coords = this.coordFromString(node.getElementsByTagName("coordinates")[0].textContent);
    return this.makeFeature("LineString", coords, props);
  };

  /**
   * Converts a KML Polygon to a GeoJSON Polygon feature.
   * @param {Element} node - The Polygon element.
   * @param {Element} placemark - The parent Placemark element.
   * @param {Object} props - The properties of the feature.
   * @returns {Object} - A GeoJSON Polygon feature.
   */
  GeoKMLer.prototype.polygonToPolygon = function (node, placemark, props) {
    const coords = [];
    for (const boundary of node.getElementsByTagName("LinearRing")) {
      coords.push(this.coordFromString(boundary.getElementsByTagName("coordinates")[0].textContent));
    }
    return this.makeFeature("Polygon", coords, props);
  };

  /**
   * Processes a MultiGeometry and converts its geometries to GeoJSON features.
   * @param {Element} node - The MultiGeometry element.
   * @param {Element} placemark - The parent Placemark element.
   * @param {Object} props - The properties of the features.
   * @returns {Array} - An array of GeoJSON features.
   */
  GeoKMLer.prototype.handleMultiGeometry = function (node, placemark, props) {
    const features = [];
    for (const element of node.children) {
      switch (element.tagName) {
        case "Point":
          features.push(this.pointToPoint(element, placemark, props));
          break;
        case "LineString":
          features.push(this.lineStringToLineString(element, placemark, props));
          break;
        case "Polygon":
          features.push(this.polygonToPolygon(element, placemark, props));
          break;
        case "MultiGeometry":
          features.push(...this.handleMultiGeometry(element, placemark, props));
          break;
      }
    }
    return features;
  };

  /**
   * Extracts properties from a Placemark, excluding geometry elements.
   * @param {Element} placemark - The Placemark element to extract properties from.
   * @returns {Object} - An object containing placemark properties.
   */
  GeoKMLer.prototype.extractProperties = function (placemark) {
    const props = {};
    for (const n of placemark.children) {
      if (!["Point", "LineString", "Polygon", "MultiGeometry", "LinearRing", "style", "styleMap", "styleUrl", "TimeSpan", "TimeStamp"].includes(n.tagName)) {
        // Ensure "ExtendedData" is not added directly.
        if (n.tagName !== "ExtendedData") {
          props[n.tagName] = n.textContent.trim();
        }
      }
    }
    return props;
  };

  return GeoKMLer;
})();
