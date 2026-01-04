// ==UserScript==
// @name                GeoGPXer
// @namespace           https://github.com/JS55CT
// @description         GeoGPXer is a JavaScript library designed to convert GPX data into GeoJSON format efficiently. It supports the conversion of waypoints, tracks, and routes, with additional handling for GPX extensions.
// @version             2.1.1
// @author              JS55CT
// @license             GNU General Public License v3.0
// @match              *://this-library-is-not-supposed-to-run.com/*
// ==/UserScript==

/***********************************************************
 * ## Project Home < https://github.com/JS55CT/WME-GeoFile/tree/main/GeoGPXer >
 *  Derived from logic of https://github.com/M-Reimer/gpx2geojson/tree/master (LGPL-3.0 license)
 **************************************************************/

/**
 * @desc The GeoGPXer namespace.
 * @namespace
 * @global
 */
var GeoGPXer = (function () {
  // Define the GeoGPXer constructor
  function GeoGPXer(obj) {
    if (obj instanceof GeoGPXer) return obj;
    if (!(this instanceof GeoGPXer)) return new GeoGPXer(obj);
    this._wrapped = obj;
  }

  /**
   * @desc Compares two coordinate arrays to determine if they are identical.
   *        Assumes coordinates are arrays of numbers representing geographic points.
   * @param {Array} coord1 - First coordinate array.
   * @param {Array} coord2 - Second coordinate array.
   * @return {Boolean} Returns true if both coordinates are identical, false otherwise.
   */
  function areCoordsSame(coord1, coord2) {
    if (coord1.length !== coord2.length) return false;
    for (let i = 0; i < coord1.length; i++) {
      if (coord1[i] !== coord2[i]) return false;
    }
    return true;
  }

  /**
   * @desc Parses GPX text and returns an XML Document.
   * @param {String} gpxText - The GPX data as a string.
   * @return {Document} Parsed XML Document.
   */
  GeoGPXer.prototype.read = function (gpxText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxText, 'application/xml');

    // Check for parsing errors by looking for parser error tags
    const parseErrors = xmlDoc.getElementsByTagName('parsererror');
    if (parseErrors.length > 0) {
      // If there are parsing errors, log them and throw an error
      const errorMessages = Array.from(parseErrors)
        .map((errorElement, index) => {
          return `Parsing Error ${index + 1}: ${errorElement.textContent}`;
        })
        .join('\n');

      console.error(errorMessages);
      throw new Error('Failed to parse GPX. See console for details.');
    }

    // If parsing is successful, return the parsed XML document
    return xmlDoc;
  };

  /**
   * @desc Converts an XML Document to GeoJSON FeatureCollection.
   * @param {Document} document - Parsed XML document of GPX data.
   * @param {Boolean} includeElevation - Whether to include elevation data in coordinates.
   * @return {Object} GeoJSON FeatureCollection.
   */
  GeoGPXer.prototype.toGeoJSON = function (document, includeElevation = false) {
    const features = [];
    for (const n of document.firstChild.childNodes) {
      switch (n.tagName) {
        case 'wpt':
          features.push(this.wptToPoint(n, includeElevation));
          break;
        case 'trk':
          features.push(...this.trkToMultiLineStringOrPolygon(n, includeElevation));
          break;
        case 'rte':
          const routeFeature = this.rteToLineStringOrPolygon(n, includeElevation);
          if (routeFeature) {
            features.push(routeFeature);
          }
          break;
      }
    }
    return {
      type: 'FeatureCollection',
      features: features,
    };
  };

  /**
   * @desc Extracts coordinates from a node.
   * @param {Node} node - GPX node containing coordinates.
   * @param {Boolean} includeElevation - Whether to include elevation data.
   * @return {Array} Array of coordinates [longitude, latitude, elevation].
   */
  GeoGPXer.prototype.coordFromNode = function (node, includeElevation = false) {
    const coords = [parseFloat(node.getAttribute('lon')), parseFloat(node.getAttribute('lat'))];
    if (includeElevation) {
      const eleNode = node.getElementsByTagName('ele')[0];
      const elevation = eleNode ? parseFloat(eleNode.textContent) : 0;
      coords.push(elevation);
    }
    return coords;
  };

  /**
   * @desc Creates a GeoJSON feature.
   * @param {String} type - Type of geometry (Point, LineString, etc.).
   * @param {Array} coords - Coordinates for the geometry.
   * @param {Object} props - Properties of the feature.
   * @return {Object} GeoJSON feature.
   */
  GeoGPXer.prototype.makeFeature = function (type, coords, props) {
    return {
      type: 'Feature',
      geometry: {
        type: type,
        coordinates: coords,
      },
      properties: props,
    };
  };

  /**
   * @desc Converts a waypoint node to a GeoJSON Point feature.
   * @param {Node} node - GPX waypoint node.
   * @param {Boolean} includeElevation - Whether to include elevation data.
   * @return {Object} GeoJSON Point feature.
   */
  GeoGPXer.prototype.wptToPoint = function (node, includeElevation = false) {
    const coord = this.coordFromNode(node, includeElevation);
    const props = this.extractProperties(node);
    return this.makeFeature('Point', coord, props);
  };

  /**
   * @desc Converts a track node to a GeoJSON Polygon or MultiLineString features.
   *        Determines if each track segment should be converted to a Polygon by
   *        checking if it has four or more coordinate pairs with the first and last
   *        coordinates being the same. If not, it remains a MultiLineString.
   * @param {Node} node - GPX track node.
   * @param {Boolean} includeElevation - Whether to include elevation data in coordinates.
   * @return {Array} Array of GeoJSON features which could either be Polygons or MultiLineStrings.
   */
  GeoGPXer.prototype.trkToMultiLineStringOrPolygon = function (node, includeElevation = false) {
    const features = [];
    const props = this.extractProperties(node);
    for (const n of node.childNodes) {
      if (n.tagName === 'trkseg') {
        const coords = [];
        for (const trkpt of n.getElementsByTagName('trkpt')) {
          coords.push(this.coordFromNode(trkpt, includeElevation));
        }

        if (coords.length >= 4 && areCoordsSame(coords[0], coords[coords.length - 1])) {
          // Convert to Polygon if conditions are met
          features.push(this.makeFeature('Polygon', [coords], props));
        } else {
          // Otherwise treat as MultiLineString
          features.push(this.makeFeature('MultiLineString', [coords], props));
        }
      }
    }
    return features;
  };

  /**
   * @desc Converts a route node to a GeoJSON feature as either a Polygon or LineString.
   *        Determines whether the route can be converted into a Polygon by checking
   *        if it has four or more coordinate pairs with the first and last coordinates
   *        being the same. If not, it treats the route as a LineString.
   * @param {Node} node - GPX route node.
   * @param {Boolean} includeElevation - Whether to include elevation data in coordinates.
   * @return {Object} GeoJSON feature, which could be a Polygon or LineString.
   */
  GeoGPXer.prototype.rteToLineStringOrPolygon = function (node, includeElevation = false) {
    const coords = [];
    const props = this.extractProperties(node);
    for (const n of node.childNodes) {
      if (n.tagName === 'rtept') {
        coords.push(this.coordFromNode(n, includeElevation));
      }
    }

    if (coords.length >= 4 && areCoordsSame(coords[0], coords[coords.length - 1])) {
      // Convert to Polygon if conditions are met
      return this.makeFeature('Polygon', [coords], props);
    } else {
      // Otherwise treat as LineString
      return this.makeFeature('LineString', coords, props);
    }
  };

  /**
   * @desc Extracts properties from a GPX node.
   * @param {Node} node - GPX node.
   * @return {Object} Properties extracted from the node.
   */
  GeoGPXer.prototype.extractProperties = function (node) {
    const props = {};
    for (const n of node.childNodes) {
      if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'extensions') {
        props[n.tagName] = n.textContent;
      }
    }
    const extensions = node.getElementsByTagName('extensions');
    if (extensions.length > 0) {
      for (const ext of extensions[0].childNodes) {
        if (ext.nodeType === Node.ELEMENT_NODE) {
          props[`ex_${ext.tagName}`] = ext.textContent;
        }
      }
    }
    return props;
  };

  return GeoGPXer; // Return the GeoGPXer constructor
})();
