// ==UserScript==
// @name                GeoKMZer
// @namespace           https://github.com/JS55CT
// @description         geoKMZer is a JavaScript library designed to convert KMZ into KML files, use with GeoKMLer to convert to GeoJSON.
// @version             1.1.0
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
var GeoKMZer = (function () {
  /**
   * GeoKMZer constructor function, which optionally wraps an object.
   * @param {Object} [obj] - Optional object to wrap.
   * @returns {GeoKMZer} - An instance of GeoKMZer.
   */
  function GeoKMZer(obj) {
    if (obj instanceof GeoKMZer) return obj;
    if (!(this instanceof GeoKMZer)) return new GeoKMZer(obj);
    this._wrapped = obj; // Optional: wrap any input object if needed
  }

  /**
   * Converts a buffer of various types to a Uint8Array.
   * @param {ArrayBuffer|TypedArray} buffer - The buffer to convert.
   * @returns {Uint8Array} - The converted Uint8Array.
   * @throws Will throw an error if the buffer is not a valid buffer-like object.
   */
  function toUint8Array(buffer) {
    if (!buffer) {
      throw new Error("forgot to pass buffer");
    }
    if (ArrayBuffer.isView(buffer)) {
      // Buffer is a typed array view like Uint8Array
      return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    }
    if (buffer instanceof ArrayBuffer) {
      // Buffer is an ArrayBuffer
      return new Uint8Array(buffer);
    }
    throw new Error("invalid buffer like object");
  }

  /**
   * Yields entries from a ZIP archive contained in a buffer.
   * @generator
   * @param {Uint8Array} buffer - The buffer representing the ZIP file.
   * @yields {Object} - An object containing filename, comment, and a read() method to get file content.
   */
  GeoKMZer.prototype.parseZipEntries = function* (buffer) {
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

    // Declare the decompression handling function
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
  };

  /**
   * Unzips a KMZ buffer, potentially recursively, and retrieves contained KML files.
   * @param {ArrayBuffer|TypedArray} buffer - The buffer of the KMZ file.
   * @param {string} [parentFile=''] - Name of the parent file if dealing with nested KMZ files.
   * @returns {Object} - An object containing file names and their corresponding data buffers.
   * @throws Will throw an error if no KML files are found.
   */
  GeoKMZer.prototype.unzipKMZ = async function (buffer, parentFile = "") {
    const files = {};
    const kmlFileRegex = /.+\.kml$/i;
    const kmzFileRegex = /.+\.kmz$/i;
    const uint8Buffer = toUint8Array(buffer);

    for (const entry of this.parseZipEntries(uint8Buffer)) {
      if (kmlFileRegex.test(entry.filename)) {
        files[entry.filename] = await entry.read();
      } else if (kmzFileRegex.test(entry.filename)) {
        // Handle nested KMZ file
        try {
          const nestedKMZBuffer = await entry.read();
          const nestedFiles = await this.unzipKMZ(nestedKMZBuffer, entry.filename);
          Object.assign(files, nestedFiles); // Merge files found in nested archives
        } catch (nestedError) {
          console.error(`Error reading nested KMZ file "${entry.filename}":`, nestedError);
        }
      } 
    }

    if (Object.keys(files).length === 0) {
      throw new Error("No KML file found in the KMZ archive.");
    }

    return files;
  };

  /**
   * Reads a KMZ buffer and extracts KML files into an array of textual contents.
   * @param {ArrayBuffer|TypedArray} buffer - The buffer of the KMZ file.
   * @returns {Array} - An array of objects, each containing the filename and content of a KML file.
   * @throws Will log errors if any occur during KMZ reading.
   */
  GeoKMZer.prototype.read = async function (buffer) {
    try {
      const kmlFiles = await this.unzipKMZ(buffer);
      const textDecoder = new TextDecoder();
      const kmlContentsArray = [];

      for (const [kmlFilename, kmlBuffer] of Object.entries(kmlFiles)) {
        const kmlContent = textDecoder.decode(kmlBuffer); // Decode the KML buffer to text
        kmlContentsArray.push({ filename: kmlFilename, content: kmlContent }); // Store each content with its filename
      }

      return kmlContentsArray;
    } catch (error) {
      console.error("Error during KMZ reading:", error);
    }
  };

  return GeoKMZer;
})();
