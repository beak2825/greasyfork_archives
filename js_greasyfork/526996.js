// ==UserScript==
// @name                GeoSHPer
// @namespace           https://github.com/JS55CT
// @description         GeoSHPer is a JavaScript library for converting shapefile data into GeoJSON. It reads ZIP archives containing .shp, .dbf, and .prj files, parses geographic features and attributes, and supports coordinate transformation using Proj4js. The result is a GeoJSON FeatureCollection, enabling easy integration with web mapping libraries.
// @version             1.0.0
// @author              JS55CT
// @license             MIT
// @match              *://this-library-is-not-supposed-to-run.com/*
// @require             https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.15.0/proj4-src.js
// ==/UserScript==

/**********
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
 *  This software utilizes and requires external libraries:
 *  - proj4.js (MIT licensed) for handling projections: http://proj4js.org/
 *
 *  This software was derived from:
 *  - shpjs (MIT licensed) https://github.com/calvinmetcalf/shapefile-js
 *
 *  Each library is subject to its own license and must be used in accordance
 *  with their respective terms. This code adapts and extends functionalities
 *  from shpjs to convert shapefile data into GeoJSON.
 **********/

/**********
 * This script is part of a library-based codebase.
 * Please note that Proj4-src.js version 2.15.0 cannot be loaded using the @require directive within this environment.
 * You need to add the the @require directive for Proj4-src.js directly to the top-level project to ensure it functions correctly.
 * In cases where the .prj file is missing in the .ZIP file or empty, the Proj4 library defaults to EPSG:4326 WGS 84 (latitude/longitude).
 *******/

var GeoSHPer = (function () {
  /**
   * GeoSHPer constructor function.
   * @param {Object} obj - Optional object to wrap.
   * @returns {GeoSHPer} - An instance of GeoSHPer.
   */
  function GeoSHPer(obj) {
    if (obj instanceof GeoSHPer) return obj;
    if (!(this instanceof GeoSHPer)) return new GeoSHPer(obj);
    this._wrapped = obj;
  }

  /**
   * Parses ZIP entries from a given buffer.
   *
   * This generator function iterates over the entries of a ZIP file provided as a buffer.
   * It yields objects representing each entry, containing the filename, comment, and a read function.
   *
   * @param {Uint8Array} buffer - The byte buffer containing the ZIP file data.
   * @yields {Object} - An object representing a ZIP entry.
   * @yields {string} return.filename - The name of the file in the ZIP entry.
   * @yields {string} return.comment - The comment associated with the ZIP entry.
   * @yields {Function} return.read - A function that returns the uncompressed data.
   *   If the data is compressed and the environment supports DecompressionStream,
   *   the data is decompressed using that mechanism.
   * @throws Will throw an error if the ZIP format is invalid or if decompression fails.
   */
  function* parseZipEntries(buffer) {
    const textDecoder = new TextDecoder();

    const decodeText = (buffer) => textDecoder.decode(buffer);

    const findEndOfCentralDirectory = (buffer) => {
      let offset = buffer.length - 20;
      const minSearchOffset = Math.max(offset - 65516, 2);
      while ((offset = buffer.lastIndexOf(80, offset - 1)) !== -1 && !(buffer[offset + 1] === 75 && buffer[offset + 2] === 5 && buffer[offset + 3] === 6) && offset > minSearchOffset);
      return offset;
    };

    const throwError = (message) => {
      throw new Error("unzip-error: " + message);
    };

    let decompressWithDecompressionStream;
    const compressionFormat = "deflate-raw";

    try {
      new self.DecompressionStream(compressionFormat);
      decompressWithDecompressionStream = async (compressedData) => {
        const decompressionStream = new self.DecompressionStream(compressionFormat);
        const writer = decompressionStream.writable.getWriter();
        const reader = decompressionStream.readable.getReader();

        writer.write(compressedData);
        writer.close();

        const decompressedChunks = [];
        let totalLength = 0;
        let position = 0;
        let readResult;

        while (!(readResult = await reader.read()).done) {
          const chunk = readResult.value;
          decompressedChunks.push(chunk);
          totalLength += chunk.length;
        }

        if (decompressedChunks.length > 1) {
          const combinedArray = new Uint8Array(totalLength);
          for (const chunk of decompressedChunks) {
            combinedArray.set(chunk, position);
            position += chunk.length;
          }
          return combinedArray;
        } else {
          return decompressedChunks[0];
        }
      };
    } catch {
      console.error("DecompressionStream is unsupported or initialization failed.");
    }

    let centralDirectoryEnd = findEndOfCentralDirectory(buffer);

    if (centralDirectoryEnd === -1) {
      throwError(2);
    }

    const subarray = (start, length) => buffer.subarray((centralDirectoryEnd += start), (centralDirectoryEnd += length));
    const dataView = new DataView(buffer.buffer, buffer.byteOffset);
    const getUint16 = (offset) => dataView.getUint16(offset + centralDirectoryEnd, true);
    const getUint32 = (offset) => dataView.getUint32(offset + centralDirectoryEnd, true);

    let numberOfEntries = getUint16(10);

    if (numberOfEntries !== getUint16(8)) {
      throwError(3);
    }

    centralDirectoryEnd = getUint32(16);

    while (numberOfEntries--) {
      let compressionType = getUint16(10),
        filenameLength = getUint16(28),
        extraFieldLength = getUint16(30),
        fileCommentLength = getUint16(32),
        compressedSize = getUint32(20),
        localHeaderOffset = getUint32(42),
        filename = decodeText(subarray(46, filenameLength)),
        comment = decodeText(subarray(extraFieldLength, fileCommentLength)),
        previousCentralDirectoryEnd = centralDirectoryEnd,
        compressedData;

      centralDirectoryEnd = localHeaderOffset;
      compressedData = subarray(30 + getUint16(26) + getUint16(28), compressedSize);

      yield {
        filename,
        comment,
        read: () => {
          if (compressionType & 8) {
            return decompressWithDecompressionStream(compressedData);
          } else if (compressionType) {
            throwError(1);
          } else {
            return compressedData;
          }
        },
      };

      centralDirectoryEnd = previousCentralDirectoryEnd;
    }
  }

  /**
   * Asynchronously unzips and processes ESRI Shapefile components from a given buffer.
   *
   * This function extracts relevant ESRI Shapefile components (.shp, .dbf, .prj, .cpg)
   * from a ZIP archive contained in a binary buffer and decodes their contents.
   *
   * ESRI Shapefiles:
   * - .shp: Contains geometry data of the features.
   * - .shx: A positional index for the geometry data. Not needed for conversion to GeoJSON.
   * - .dbf: Attribute format in dBASE format, storing metadata or attributes for each shape.
   * - .prj: Contains coordinate system and projection information in plain text.
   * - .cpg: Used to specify the character encoding of the attribute data in the .dbf file.
   *
   * @param {Uint8Array} buffer - The byte buffer containing the ZIP file data.
   * @returns {Promise<Object>} - A promise that resolves to an object containing the decoded contents of the shapefile components:
   *   - File extensions `.shp` and `.dbf` are represented as DataView objects.
   *   - File extensions `.prj` and `.cpg` are represented as UTF-8 decoded strings.
   *
   * @throws Will throw or reject if an error occurs during file reading or processing.
   */
  const unzip = async (buffer) => {
    const fileTypeRegex = /.+\.(shp|dbf|prj|cpg)$/i;
    const files = {};
    const promises = [];
    for (const entry of parseZipEntries(buffer)) {
      if (!fileTypeRegex.test(entry.filename)) {
        continue;
      }
      promises.push(Promise.resolve(entry.read()).then((bytes) => (files[entry.filename] = bytes)));
    }
    await Promise.all(promises);
    const output = {};
    const decoder = new TextDecoder();
    for (const [key, value] of Object.entries(files)) {
      if (key.slice(-3).toLowerCase() === "shp" || key.slice(-3).toLowerCase() === "dbf") {
        output[key] = new DataView(value.buffer, value.byteOffset, value.byteLength);
      } else {
        output[key] = decoder.decode(value);
      }
    }
    return output;
  };

  /**
   * Parses point data to convert it into a GeoJSON Point object.
   *
   * @param {DataView} data - The data view containing point data from a shapefile.
   * @returns {Object} - A GeoJSON Point object with "type" and "coordinates" properties.
   */
  ParseShp.prototype.parsePoint = function (data) {
    return {
      type: "Point",
      coordinates: this.parseCoord(data, 0),
    };
  };

  /**
   * Parses 3D point data (with Z-coordinates) to convert it into a GeoJSON Point object.
   *
   * @param {DataView} data - The data view containing 3D point data from a shapefile.
   * @returns {Object} - A GeoJSON Point object with "type" and "coordinates" properties, including Z-coordinate.
   */
  ParseShp.prototype.parseZPoint = function (data) {
    const pointXY = this.parsePoint(data);
    pointXY.coordinates.push(data.getFloat64(16, true));
    return pointXY;
  };

  /**
   * Parses an array of point coordinates from the data view.
   *
   * @param {DataView} data - The data view containing multiple point data from a shapefile.
   * @param {number} offset - The starting offset in the data view for parsing points.
   * @param {number} num - The number of points to parse.
   * @returns {Array<Array<number>>} - An array of coordinate arrays for each point.
   */
  ParseShp.prototype.parsePointArray = function (data, offset, num) {
    const out = [];
    let done = 0;
    while (done < num) {
      out.push(this.parseCoord(data, offset));
      offset += 16;
      done++;
    }
    return out;
  };

  /**
   * Parses Z-coordinates and adds them to an existing array of point coordinates.
   *
   * @param {DataView} data - The data view containing Z-coordinate data.
   * @param {number} zOffset - The starting offset in the data view for parsing Z-coordinates.
   * @param {number} num - The number of Z-coordinates to parse.
   * @param {Array<Array<number>>} coordinates - The existing coordinate arrays to which Z-coordinates are added.
   * @returns {Array<Array<number>>} - The modified coordinate arrays with Z-coordinates included.
   */
  ParseShp.prototype.parseZPointArray = function (data, zOffset, num, coordinates) {
    let i = 0;
    while (i < num) {
      coordinates[i].push(data.getFloat64(zOffset, true));
      i++;
      zOffset += 8;
    }
    return coordinates;
  };

  /**
   * Parses and groups an array of points from the shapefile data considering the parts specified.
   *
   * @param {DataView} data - The data view containing point data from a shapefile.
   * @param {number} offset - The starting offset in the data view for parsing points.
   * @param {number} partOffset - The offset in the data for the part index.
   * @param {number} num - The number of parts to parse.
   * @param {number} tot - The total number of points to parse.
   * @returns {Array<Array<Array<number>>>} - An array of arrays of coordinate arrays for each grouped part.
   */
  ParseShp.prototype.parseArrayGroup = function (data, offset, partOffset, num, tot) {
    const out = [];
    let done = 0;
    let curNum;
    let nextNum = 0;
    let pointNumber;
    while (done < num) {
      done++;
      partOffset += 4;
      curNum = nextNum;
      if (done === num) {
        nextNum = tot;
      } else {
        nextNum = data.getInt32(partOffset, true);
      }
      pointNumber = nextNum - curNum;
      if (!pointNumber) {
        continue;
      }
      out.push(this.parsePointArray(data, offset, pointNumber));
      offset += pointNumber << 4;
    }
    return out;
  };

  /**
   * Parses Z-coordinates for a grouped set of points and adds them to the existing coordinate arrays.
   *
   * @param {DataView} data - The data view containing Z-coordinate data.
   * @param {number} zOffset - The starting offset in the data view for parsing Z-coordinates.
   * @param {number} num - The number of parts to parse.
   * @param {Array<Array<Array<number>>>} coordinates - The existing coordinate arrays to which Z-coordinates are added.
   * @returns {Array<Array<Array<number>>>} - The modified coordinate arrays with Z-coordinates included.
   */
  ParseShp.prototype.parseZArrayGroup = function (data, zOffset, num, coordinates) {
    let i = 0;
    while (i < num) {
      coordinates[i] = this.parseZPointArray(data, zOffset, coordinates[i].length, coordinates[i]);
      zOffset += coordinates[i].length << 3;
      i++;
    }
    return coordinates;
  };

  /**
   * Parses multipoint data to convert it into a GeoJSON MultiPoint or Point object.
   *
   * @param {DataView} data - The data view containing multipoint data from a shapefile.
   * @returns {Object|null} - A GeoJSON MultiPoint or Point object with "type", "coordinates", and "bbox" properties, or null if no points are present.
   */
  ParseShp.prototype.parseMultiPoint = function (data) {
    const out = {};
    const num = data.getInt32(32, true);
    if (!num) {
      return null;
    }
    const mins = this.parseCoord(data, 0);
    const maxs = this.parseCoord(data, 16);
    out.bbox = [mins[0], mins[1], maxs[0], maxs[1]];
    const offset = 36;
    if (num === 1) {
      out.type = "Point";
      out.coordinates = this.parseCoord(data, offset);
    } else {
      out.type = "MultiPoint";
      out.coordinates = this.parsePointArray(data, offset, num);
    }
    return out;
  };

  /**
   * Parses Z-dimension multipoint data from the shapefile and converts it into a GeoJSON MultiPoint or Point object.
   *
   * @param {DataView} data - The data view containing Z-dimension multipoint data from a shapefile.
   * @returns {Object|null} - A GeoJSON MultiPoint or Point object including Z-coordinates, or null if no points are present.
   */
  ParseShp.prototype.parseZMultiPoint = function (data) {
    const geoJson = this.parseMultiPoint(data);
    if (!geoJson) {
      return null;
    }
    let num;
    if (geoJson.type === "Point") {
      geoJson.coordinates.push(data.getFloat64(72, true));
      return geoJson;
    } else {
      num = geoJson.coordinates.length;
    }
    const zOffset = 52 + (num << 4);
    geoJson.coordinates = this.parseZPointArray(data, zOffset, num, geoJson.coordinates);
    return geoJson;
  };

  /**
   * Parses polyline data from the shapefile and converts it into a GeoJSON LineString or MultiLineString object.
   *
   * @param {DataView} data - The data view containing polyline data from a shapefile.
   * @returns {Object|null} - A GeoJSON LineString or MultiLineString object with "type", "coordinates", and "bbox" properties, or null if no lines are present.
   */
  ParseShp.prototype.parsePolyline = function (data) {
    const out = {};
    const numParts = data.getInt32(32, true);
    if (!numParts) {
      return null;
    }
    const mins = this.parseCoord(data, 0);
    const maxs = this.parseCoord(data, 16);
    out.bbox = [mins[0], mins[1], maxs[0], maxs[1]];
    const num = data.getInt32(36, true);
    let offset, partOffset;
    if (numParts === 1) {
      out.type = "LineString";
      offset = 44;
      out.coordinates = this.parsePointArray(data, offset, num);
    } else {
      out.type = "MultiLineString";
      offset = 40 + (numParts << 2);
      partOffset = 40;
      out.coordinates = this.parseArrayGroup(data, offset, partOffset, numParts, num);
    }
    return out;
  };

  /**
   * Parses Z-dimension polyline data from the shapefile and converts it into a GeoJSON LineString or MultiLineString object.
   *
   * @param {DataView} data - The data view containing Z-dimension polyline data from a shapefile.
   * @returns {Object|null} - A GeoJSON LineString or MultiLineString object including Z-coordinates, or null if no lines are present.
   */
  ParseShp.prototype.parseZPolyline = function (data) {
    const geoJson = this.parsePolyline(data);
    if (!geoJson) {
      return null;
    }
    const num = geoJson.coordinates.length;
    let zOffset;
    if (geoJson.type === "LineString") {
      zOffset = 60 + (num << 4);
      geoJson.coordinates = this.parseZPointArray(data, zOffset, num, geoJson.coordinates);
      return geoJson;
    } else {
      const totalPoints = geoJson.coordinates.reduce(function (a, v) {
        return a + v.length;
      }, 0);
      zOffset = 56 + (totalPoints << 4) + (num << 2);
      geoJson.coordinates = this.parseZArrayGroup(data, zOffset, num, geoJson.coordinates);
      return geoJson;
    }
  };

  /**
   * Converts a parsed polyline GeoJSON object into a Polygon or MultiPolygon object by handling polygon rings.
   *
   * @param {Object} out - A GeoJSON-like object initially representing a LineString or MultiLineString.
   * @returns {Object|null} - A GeoJSON Polygon or MultiPolygon object with nested rings, or null if input is invalid.
   */
  ParseShp.prototype.polyFuncs = function (out) {
    if (!out) {
      return out;
    }

    if (out.type === "LineString") {
      out.type = "Polygon";
      out.coordinates = [out.coordinates];
      return out;
    }

    const isClockWise = (array) => {
      let sum = 0;
      let i = 1;
      const len = array.length;
      let prev, cur;
      const bbox = [array[0][0], array[0][1], array[0][0], array[0][1]];
      while (i < len) {
        prev = cur || array[0];
        cur = array[i];
        sum += (cur[0] - prev[0]) * (cur[1] + prev[1]);
        i++;
        bbox[0] = Math.min(bbox[0], cur[0]);
        bbox[1] = Math.min(bbox[1], cur[1]);
        bbox[2] = Math.max(bbox[2], cur[0]);
        bbox[3] = Math.max(bbox[3], cur[1]);
      }
      return {
        ring: array,
        clockWise: sum > 0,
        bbox,
        children: [],
      };
    };

    const contains = (outer, inner) => {
      if (outer.bbox[0] > inner.bbox[0]) {
        return false;
      }
      if (outer.bbox[1] > inner.bbox[1]) {
        return false;
      }
      if (outer.bbox[2] < inner.bbox[2]) {
        return false;
      }
      if (outer.bbox[3] < inner.bbox[3]) {
        return false;
      }
      return true;
    };

    const handleRings = (rings) => {
      const outers = [];
      const inners = [];
      for (const ring of rings) {
        const processed = isClockWise(ring);
        if (processed.clockWise) {
          outers.push(processed);
        } else {
          inners.push(processed);
        }
      }
      for (const inner of inners) {
        for (const outer of outers) {
          if (contains(outer, inner)) {
            outer.children.push(inner.ring);
            break;
          }
        }
      }
      const result = [];
      for (const outer of outers) {
        result.push([outer.ring].concat(outer.children));
      }
      return result;
    };

    out.coordinates = handleRings(out.coordinates);
    if (out.coordinates.length === 1) {
      out.type = "Polygon";
      out.coordinates = out.coordinates[0];
      return out;
    } else {
      out.type = "MultiPolygon";
      return out;
    }
  };

  /**
   * Parses polygon data from the shapefile and converts it into a GeoJSON Polygon or MultiPolygon object.
   *
   * @param {DataView} data - The data view containing polygon data from a shapefile.
   * @returns {Object|null} - A GeoJSON Polygon or MultiPolygon object, or null if no polygons are present.
   */
  ParseShp.prototype.parsePolygon = function (data) {
    return this.polyFuncs(this.parsePolyline(data));
  };

  /**
   * Parses Z-dimension polygon data and converts it into a GeoJSON Polygon or MultiPolygon object.
   *
   * @param {DataView} data - The data view containing Z-dimension polygon data from a shapefile.
   * @returns {Object|null} - A GeoJSON Polygon or MultiPolygon object with Z-coordinates, or null if no polygons are present.
   */
  ParseShp.prototype.parseZPolygon = function (data) {
    return this.polyFuncs(this.parseZPolyline(data));
  };

  /**
   * Sets up appropriate parsing functions within the ParseShp object based on the shapefile type, with optional coordinate transformation.
   *
   * @param {Object} [tran] - Optional coordinate transformation object with an inverse method.
   */
  ParseShp.prototype.shpFuncs = function (tran) {
    const shpFuncObj = {
      1: "parsePoint",
      3: "parsePolyline",
      5: "parsePolygon",
      8: "parseMultiPoint",
      11: "parseZPoint",
      13: "parseZPolyline",
      15: "parseZPolygon",
      18: "parseZMultiPoint",
    };

    let num = this.headers.shpCode;
    if (num > 20) {
      num -= 20;
    }
    if (!(num in shpFuncObj)) {
      throw new Error(`I don't know shp type "${num}"`);
    }

    this.parseFunc = this[shpFuncObj[num]];

    const makeParseCoord = (trans) => {
      if (trans) {
        return function (data, offset) {
          const args = [data.getFloat64(offset, true), data.getFloat64(offset + 8, true)];
          return trans.inverse(args);
        };
      } else {
        return function (data, offset) {
          return [data.getFloat64(offset, true), data.getFloat64(offset + 8, true)];
        };
      }
    };

    this.parseCoord = makeParseCoord(tran);
  };

  /**
   * Retrieves the shapefile code from the shapefile header.
   *
   * @returns {number} - The shapefile type code indicating the type of shapes contained.
   */
  ParseShp.prototype.getShpCode = function () {
    return this.parseHeader().shpCode;
  };

  /**
   * Parses the header of the shapefile to extract metadata about the file.
   *
   * @returns {Object} - An object containing the shapefile's length, version, shape type code, and bounding box.
   */
  ParseShp.prototype.parseHeader = function () {
    const view = this.buffer;
    return {
      length: view.getInt32(6 << 2) << 1,
      version: view.getInt32(7 << 2, true),
      shpCode: view.getInt32(8 << 2, true),
      bbox: [view.getFloat64(9 << 2, true), view.getFloat64(11 << 2, true), view.getFloat64(13 << 2, true), view.getFloat64(15 << 2, true)],
    };
  };

  /**
   * Iterates over the records in the shapefile buffer, parsing each using the appropriate function.
   *
   * @returns {Array<(Object|null)>} - An array of parsed shape objects, or null for unrecognized shapes.
   */
  ParseShp.prototype.getRows = function () {
    let offset = 100;
    const len = this.buffer.byteLength - 8;
    const out = [];
    let current;
    while (offset <= len) {
      current = this.getRow(offset);
      if (!current) {
        break;
      }
      offset += 8;
      offset += current.len;
      if (current.type) {
        out.push(this.parseFunc(current.data));
      } else {
        out.push(null);
      }
    }
    return out;
  };

  /**
   * Retrieves information about a specific row (record) in the shapefile, starting from the given offset.
   *
   * @param {number} offset - The byte offset to start reading the row.
   * @returns {Object|undefined} - An object containing the row id, length, data, and type, or undefined if invalid.
   */
  ParseShp.prototype.getRow = function (offset) {
    const id = this.buffer.getInt32(offset);
    const len = this.buffer.getInt32(offset + 4) << 1;
    if (len === 0) {
      return {
        id: id,
        len: len,
        type: 0,
      };
    }

    if (offset + len + 8 > this.buffer.byteLength) {
      return;
    }
    return {
      id: id,
      len: len,
      data: new DataView(this.buffer.buffer, this.buffer.byteOffset + offset + 12, len - 4),
      type: this.buffer.getInt32(offset + 8, true),
    };
  };

  /**
   * Constructor function for parsing a shapefile buffer and initializing its metadata and shape rows.
   *
   * @constructor
   * @param {DataView} buffer - The DataView containing the binary content of the shapefile.
   * @param {Object} [trans] - Optional coordinate transformation object.
   * @returns {ParseShp} - A new `ParseShp` instance with parsed headers and rows.
   */
  function ParseShp(buffer, trans) {
    if (!(this instanceof ParseShp)) {
      return new ParseShp(buffer, trans);
    }
    this.buffer = buffer;
    this.headers = this.parseHeader();
    this.shpFuncs(trans);
    this.rows = this.getRows();
  }

  /**
   * Function for parsing a shapefile and returning the parsed rows using the `ParseShp` class.
   *
   * @param {DataView} buffer - The DataView containing the binary content of the shapefile.
   * @param {Object} [trans] - Optional coordinate transformation object.
   * @returns {Array<Object|null>} - An array of parsed shape objects.
   */
  function parseShp(buffer, trans) {
    return new ParseShp(buffer, trans).rows;
  }

  /**
   * Creates a decoder function based on the provided character encoding, for converting binary data to text.
   *
   * @param {string} encoding - The character encoding to be used (e.g., "UTF-8").
   * @param {boolean} [second] - Internal flag for recursion, when determining fallback encodings.
   * @returns {function} - A function that decodes buffers using the specified encoding or a default fallback.
   */
  function createDecoder(encoding, second) {
    var regex = /^(?:ANSI\s)?(\d+)$/m;
    if (!encoding) {
      return browserDecoder;
    }
    try {
      new TextDecoder(encoding.trim());
    } catch (e) {
      var match = regex.exec(encoding);
      if (match && !second) {
        return createDecoder("windows-" + match[1], true);
      } else {
        encoding = undefined;
        return browserDecoder;
      }
    }
    return browserDecoder;

    function browserDecoder(buffer) {
      var decoder = new TextDecoder(encoding ? encoding : undefined);
      var out = decoder.decode(buffer, { stream: true }) + decoder.decode();
      return out.replace(/\0/g, "").trim();
    }
  }

  /**
   * Parses a DBF file buffer and decodes its records into JavaScript objects.
   *
   * @param {DataView} buffer - The DataView containing the binary content of the DBF file.
   * @param {string} encoding - The character encoding used to decode text fields in the DBF file (e.g., "UTF-8").
   * @returns {Array<Object>} - An array of records, where each record is an object with field names as keys and field values.
   */
  function parseDbf(buffer, encoding) {
    const decoder = createDecoder(encoding);

    const dbfHeader = (data) => {
      return {
        lastUpdated: new Date(data.getUint8(1) + 1900, data.getUint8(2), data.getUint8(3)),
        records: data.getUint32(4, true),
        headerLen: data.getUint16(8, true),
        recLen: data.getUint16(10, true),
      };
    };

    const dbfRowHeader = (data, headerLen, decoder) => {
      const out = [];
      let offset = 32;
      while (offset < headerLen) {
        out.push({
          name: decoder(new Uint8Array(data.buffer.slice(data.byteOffset + offset, data.byteOffset + offset + 11))),
          dataType: String.fromCharCode(data.getUint8(offset + 11)),
          len: data.getUint8(offset + 16),
          decimal: data.getUint8(offset + 17),
        });
        if (data.getUint8(offset + 32) === 13) {
          break;
        }
        offset += 32;
      }
      return out;
    };

    const parseRow = (buffer, offset, rowHeaders, decoder) => {
      const rowFuncs = (buffer, offset, len, type, decoder) => {
        const data = new Uint8Array(buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + len));
        const textData = decoder(data);
        switch (type) {
          case "N": // Numeric
          case "F": // Floating point
          case "O": // Double
            return parseFloat(textData);
          case "D": // Date
            return new Date(textData.slice(0, 4), parseInt(textData.slice(4, 6), 10) - 1, textData.slice(6, 8));
          case "L": // Logical (Boolean)
            return textData.toLowerCase() === "y" || textData.toLowerCase() === "t";
          default: // Default case for Character and other text-based fields
            return textData;
        }
      };

      const out = {};
      let i = 0;
      const len = rowHeaders.length;

      while (i < len) {
        const header = rowHeaders[i];
        const field = rowFuncs(buffer, offset, header.len, header.dataType, decoder);
        offset += header.len;
        if (typeof field !== "undefined") {
          out[header.name] = field;
        }
        i++;
      }
      return out;
    };

    const header = dbfHeader(buffer);
    const rowHeaders = dbfRowHeader(buffer, header.headerLen - 1, decoder);

    let offset = ((rowHeaders.length + 1) << 5) + 2;
    const recLen = header.recLen;
    let records = header.records;
    const out = [];

    while (records) {
      out.push(parseRow(buffer, offset, rowHeaders, decoder));
      offset += recLen;
      records--;
    }

    return out;
  }

  /**
   * Checks whether the provided object is an ArrayBuffer.
   *
   * @param {*} subject - The object to be checked.
   * @returns {boolean} - Returns true if the object is an ArrayBuffer, false otherwise.
   */
  function isArrayBuffer(subject) {
    return subject instanceof globalThis.ArrayBuffer || Object.prototype.toString.call(subject) === "[object ArrayBuffer]";
  }

  /**
   * Reads and processes a zipped shapefile buffer, extracting and organizing its component files.
   *
   * @param {ArrayBuffer|Uint8Array} buffer - A buffer containing the zipped shapefile data.
   * @returns {Promise<void>} - A promise that resolves once the shapefile components are extracted and processed.
   * @throws {Error} - Throws an error if no buffer is passed, if an invalid buffer-like object is provided, or if no shape layers are found.
   */
  GeoSHPer.prototype.read = async function (buffer) {
    const toUint8Array = (buffer) => {
      if (!buffer) {
        throw new Error("forgot to pass buffer");
      }
      if (isArrayBuffer(buffer)) {
        return new Uint8Array(buffer);
      }
      if (isArrayBuffer(buffer.buffer)) {
        if (buffer.BYTES_PER_ELEMENT === 1) {
          return buffer;
        }
        return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
      }
      throw new Error("invalid buffer like object");
    };

    buffer = toUint8Array(buffer);

    const zip = await unzip(buffer);

    const names = [];
    let esriWKT = null;

    for (let key in zip) {
      if (key.indexOf("__MACOSX") !== -1) {
        continue;
      }
      if (key.slice(-4).toLowerCase() === ".shp") {
        names.push(key.slice(0, -4));
        zip[key.slice(0, -3) + key.slice(-3).toLowerCase()] = zip[key];
      } else if (key.slice(-4).toLowerCase() === ".prj") {
        try {
          esriWKT = zip[key];
          const projData = proj4(esriWKT);
          const projKey = key.slice(0, -3) + key.slice(-3).toLowerCase();
          zip[projKey] = projData;
        } catch (error) {
          console.error(`Failed to parse WKT for ${key}:`, error);
        }
      } else if (key.slice(-4).toLowerCase() === ".dbf" || key.slice(-4).toLowerCase() === ".cpg") {
        zip[key.slice(0, -3) + key.slice(-3).toLowerCase()] = zip[key];
      }
    }

    if (!names.length) {
      throw new Error("no layers found");
    }

    this.internalData = { names, zip, esriWKT };
  };

  /**
   * Converts the internal shapefile data into a GeoJSON representation.
   *
   * @returns {Object|Array<Object>} - A GeoJSON FeatureCollection object, or an array of such objects if multiple shapefiles were read.
   * @throws {Error} - Throws an error if shapefile data has not been read yet.
   */
  GeoSHPer.prototype.toGeoJSON = function () {
    if (!this.internalData) {
      throw new Error("Data not read yet. Make sure to call 'read' first.");
    }

    const combineFeatures = function ([shp, dbf, esriWKT]) {
      const out = {
        type: "FeatureCollection",
        features: [],
        crs: {
          type: "name",
          properties: {
            name: "EPSG:4326", // Defaulting to EPSG:4326
          },
        },
        extraProperties: {
          transformFrom: {
            esriWKT: esriWKT,
          },
        },
      };

      const len = shp.length;
      dbf = dbf || [];

      for (let i = 0; i < len; i++) {
        out.features.push({
          type: "Feature",
          geometry: shp[i],
          properties: dbf[i] || {},
        });
      }
      return out;
    };

    const { names, zip, esriWKT } = this.internalData;
    const geojson = names.map((name) => {
      let parsed, dbf, prj;

      if (zip[name + ".dbf"]) {
        dbf = parseDbf(zip[name + ".dbf"], zip[name + ".cpg"]);
      }
      if (zip[name + ".prj"]) {
        prj = zip[name + ".prj"];
      }
      parsed = combineFeatures([parseShp(zip[name + ".shp"], prj), dbf, esriWKT]);
      parsed.fileName = name;
      return parsed;
    });

    return geojson.length === 1 ? geojson[0] : geojson;
  };

  return GeoSHPer;
})();
