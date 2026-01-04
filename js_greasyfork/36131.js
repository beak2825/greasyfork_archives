// ==UserScript==
// @name        save WEB page to PDF
// @description save HTML to PDF
// @namespace   null
// @author amormaid
// @version     0.0.2
// @include     *
// @run-at document-end
// @grant       GM_xmlhttpRequest
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/36131/save%20WEB%20page%20to%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/36131/save%20WEB%20page%20to%20PDF.meta.js
// ==/UserScript==


/*
require
	https://greasyfork.org/scripts/15924-jspdf/code/jsPDF.js
	https://github.com/MrRio/jsPDF/blob/master/dist/jspdf.min.js
	http://html2canvas.hertzen.com/dist/html2canvas.js

	https://rawgit.com/MrRio/jsPDF/master/docs/module-addImage.html#~addImage
*/

//  --------------------  utility function  --------------------

/* eslint-disable no-console */
/* global saveAs, define, RGBColor */
// eslint-disable-next-line no-unused-vars
var jsPDF = (function(global) {
  "use strict";

  /**
   * jsPDF's Internal PubSub Implementation.
   * Backward compatible rewritten on 2014 by
   * Diego Casorran, https://github.com/diegocr
   *
   * @class
   * @name PubSub
   * @ignore
   */
  function PubSub(context) {
    if (typeof context !== "object") {
      throw new Error(
        "Invalid Context passed to initialize PubSub (jsPDF-module)"
      );
    }
    var topics = {};

    this.subscribe = function(topic, callback, once) {
      once = once || false;
      if (
        typeof topic !== "string" ||
        typeof callback !== "function" ||
        typeof once !== "boolean"
      ) {
        throw new Error(
          "Invalid arguments passed to PubSub.subscribe (jsPDF-module)"
        );
      }

      if (!topics.hasOwnProperty(topic)) {
        topics[topic] = {};
      }

      var token = Math.random().toString(35);
      topics[topic][token] = [callback, !!once];

      return token;
    };

    this.unsubscribe = function(token) {
      for (var topic in topics) {
        if (topics[topic][token]) {
          delete topics[topic][token];
          if (Object.keys(topics[topic]).length === 0) {
            delete topics[topic];
          }
          return true;
        }
      }
      return false;
    };

    this.publish = function(topic) {
      if (topics.hasOwnProperty(topic)) {
        var args = Array.prototype.slice.call(arguments, 1),
          tokens = [];

        for (var token in topics[topic]) {
          var sub = topics[topic][token];
          try {
            sub[0].apply(context, args);
          } catch (ex) {
            if (global.console) {
              console.error("jsPDF PubSub Error", ex.message, ex);
            }
          }
          if (sub[1]) tokens.push(token);
        }
        if (tokens.length) tokens.forEach(this.unsubscribe);
      }
    };

    this.getTopics = function() {
      return topics;
    };
  }

  /**
   * Creates new jsPDF document object instance.
   * @name jsPDF
   * @class
   * @param {Object} [options] - Collection of settings initializing the jsPDF-instance
   * @param {string} [options.orientation=portrait] - Orientation of the first page. Possible values are "portrait" or "landscape" (or shortcuts "p" or "l").<br />
   * @param {string} [options.unit=mm] Measurement unit (base unit) to be used when coordinates are specified.<br />
   * Possible values are "pt" (points), "mm", "cm", "m", "in" or "px".
   * @param {string/Array} [options.format=a4] The format of the first page. Can be:<ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
   * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array, e.g. [595.28, 841.89]
   * @param {boolean} [options.putOnlyUsedFonts=false] Only put fonts into the PDF, which were used.
   * @param {boolean} [options.compress=false] Compress the generated PDF.
   * @param {number} [options.precision=16] Precision of the element-positions.
   * @param {number} [options.userUnit=1.0] Not to be confused with the base unit. Please inform yourself before you use it.
   * @param {number|"smart"} [options.floatPrecision=16]
   * @returns {jsPDF} jsPDF-instance
   * @description
   * ```
   * {
   *  orientation: 'p',
   *  unit: 'mm',
   *  format: 'a4',
   *  putOnlyUsedFonts:true,
   *  floatPrecision: 16 // or "smart", default is 16
   * }
   * ```
   *
   * @constructor
   */
  function jsPDF(options) {
    var orientation = typeof arguments[0] === "string" ? arguments[0] : "p";
    var unit = arguments[1];
    var format = arguments[2];
    var compressPdf = arguments[3];
    var filters = [];
    var userUnit = 1.0;
    var precision;
    var floatPrecision = 16;
    var defaultPathOperation = "S";

    options = options || {};

    if (typeof options === "object") {
      orientation = options.orientation;
      unit = options.unit || unit;
      format = options.format || format;
      compressPdf = options.compress || options.compressPdf || compressPdf;
      userUnit =
        typeof options.userUnit === "number" ? Math.abs(options.userUnit) : 1.0;
      if (typeof options.precision !== "undefined") {
        precision = options.precision;
      }
      if (typeof options.floatPrecision !== "undefined") {
        floatPrecision = options.floatPrecision;
      }
      defaultPathOperation = options.defaultPathOperation || "S";
    }

    filters =
      options.filters || (compressPdf === true ? ["FlateEncode"] : filters);

    unit = unit || "mm";
    orientation = ("" + (orientation || "P")).toLowerCase();
    var putOnlyUsedFonts = options.putOnlyUsedFonts || false;
    var usedFonts = {};

    var API = {
      internal: {},
      __private__: {}
    };

    API.__private__.PubSub = PubSub;

    var pdfVersion = "1.3";
    var getPdfVersion = (API.__private__.getPdfVersion = function() {
      return pdfVersion;
    });

    API.__private__.setPdfVersion = function(value) {
      pdfVersion = value;
    };

    // Size in pt of various paper formats
    var pageFormats = {
      a0: [2383.94, 3370.39],
      a1: [1683.78, 2383.94],
      a2: [1190.55, 1683.78],
      a3: [841.89, 1190.55],
      a4: [595.28, 841.89],
      a5: [419.53, 595.28],
      a6: [297.64, 419.53],
      a7: [209.76, 297.64],
      a8: [147.4, 209.76],
      a9: [104.88, 147.4],
      a10: [73.7, 104.88],
      b0: [2834.65, 4008.19],
      b1: [2004.09, 2834.65],
      b2: [1417.32, 2004.09],
      b3: [1000.63, 1417.32],
      b4: [708.66, 1000.63],
      b5: [498.9, 708.66],
      b6: [354.33, 498.9],
      b7: [249.45, 354.33],
      b8: [175.75, 249.45],
      b9: [124.72, 175.75],
      b10: [87.87, 124.72],
      c0: [2599.37, 3676.54],
      c1: [1836.85, 2599.37],
      c2: [1298.27, 1836.85],
      c3: [918.43, 1298.27],
      c4: [649.13, 918.43],
      c5: [459.21, 649.13],
      c6: [323.15, 459.21],
      c7: [229.61, 323.15],
      c8: [161.57, 229.61],
      c9: [113.39, 161.57],
      c10: [79.37, 113.39],
      dl: [311.81, 623.62],
      letter: [612, 792],
      "government-letter": [576, 756],
      legal: [612, 1008],
      "junior-legal": [576, 360],
      ledger: [1224, 792],
      tabloid: [792, 1224],
      "credit-card": [153, 243]
    };

    API.__private__.getPageFormats = function() {
      return pageFormats;
    };

    var getPageFormat = (API.__private__.getPageFormat = function(value) {
      return pageFormats[value];
    });

    format = format || "a4";

    var ApiMode = {
      COMPAT: "compat",
      ADVANCED: "advanced"
    };
    var apiMode = ApiMode.COMPAT;

    function advancedAPI() {
      // prepend global change of basis matrix
      // (Now, instead of converting every coordinate to the pdf coordinate system, we apply a matrix
      // that does this job for us (however, texts, images and similar objects must be drawn bottom up))
      this.saveGraphicsState();
      out(
        new Matrix(
          scaleFactor,
          0,
          0,
          -scaleFactor,
          0,
          getPageHeight() * scaleFactor
        ).toString() + " cm"
      );
      this.setFontSize(this.getFontSize() / scaleFactor);

      // The default in MrRio's implementation is "S" (stroke), whereas the default in the yWorks implementation
      // was "n" (none). Although this has nothing to do with transforms, we should use the API switch here.
      defaultPathOperation = "n";

      apiMode = ApiMode.ADVANCED;
    }

    function compatAPI() {
      this.restoreGraphicsState();
      defaultPathOperation = "S";
      apiMode = ApiMode.COMPAT;
    }

    /**
     * @callback ApiSwitchBody
     * @param {jsPDF} pdf
     */

    /**
     * For compatibility reasons jsPDF offers two API modes which differ in the way they convert between the the usual
     * screen coordinates and the PDF coordinate system.
     *   - "compat": Offers full compatibility across all plugins but does not allow arbitrary transforms
     *   - "advanced": Allows arbitrary transforms and more advanced features like pattern fills. Some plugins might
     *     not support this mode, though.
     * Initial mode is "compat".
     *
     * You can either provide a callback to the body argument, which means that jsPDF will automatically switch back to
     * the original API mode afterwards; or you can omit the callback and switch back manually using {@link compatAPI}.
     *
     * Note, that the calls to {@link saveGraphicsState} and {@link restoreGraphicsState} need to be balanced within the
     * callback or between calls of this method and its counterpart {@link compatAPI}. Calls to {@link beginFormObject}
     * or {@link beginTilingPattern} need to be closed by their counterparts before switching back to "compat" API mode.
     *
     * @param {ApiSwitchBody=} body When provided, this callback will be called after the API mode has been switched.
     * The API mode will be switched back automatically afterwards.
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name advancedAPI
     */
    API.advancedAPI = function(body) {
      var doSwitch = apiMode === ApiMode.COMPAT;

      if (doSwitch) {
        advancedAPI.call(this);
      }

      if (typeof body !== "function") {
        return this;
      }

      body(this);

      if (doSwitch) {
        compatAPI.call(this);
      }

      return this;
    };

    /**
     * Switches to "compat" API mode. See {@link advancedAPI} for more details.
     *
     * @param {ApiSwitchBody=} body When provided, this callback will be called after the API mode has been switched.
     * The API mode will be switched back automatically afterwards.
     * @return {jsPDF}
     * @memberof jsPDF#
     * @name compatApi
     */
    API.compatAPI = function(body) {
      var doSwitch = apiMode === ApiMode.ADVANCED;

      if (doSwitch) {
        compatAPI.call(this);
      }

      if (typeof body !== "function") {
        return this;
      }

      body(this);

      if (doSwitch) {
        advancedAPI.call(this);
      }

      return this;
    };

    /**
     * @return {boolean} True iff the current API mode is "advanced". See {@link advancedAPI}.
     * @memberof jsPDF#
     * @name isAdvancedAPI
     */
    API.isAdvancedAPI = function() {
      return apiMode === ApiMode.ADVANCED;
    };

    var advancedApiModeTrap = function(methodName) {
      if (apiMode !== ApiMode.ADVANCED) {
        throw new Error(
          methodName +
            " is only available in 'advanced' API mode. " +
            "You need to call advancedAPI() first."
        );
      }
    };

    var roundToPrecision = (API.roundToPrecision = API.__private__.roundToPrecision = function(
      number,
      parmPrecision
    ) {
      var tmpPrecision = precision || parmPrecision;
      if (isNaN(number) || isNaN(tmpPrecision)) {
        throw new Error("Invalid argument passed to jsPDF.roundToPrecision");
      }
      return number.toFixed(tmpPrecision).replace(/0+$/, "");
    });

    // high precision float
    var hpf;
    if (typeof floatPrecision === "number") {
      hpf = API.hpf = API.__private__.hpf = function(number) {
        if (isNaN(number)) {
          throw new Error("Invalid argument passed to jsPDF.hpf");
        }
        return roundToPrecision(number, floatPrecision);
      };
    } else if (floatPrecision === "smart") {
      hpf = API.hpf = API.__private__.hpf = function(number) {
        if (isNaN(number)) {
          throw new Error("Invalid argument passed to jsPDF.hpf");
        }
        if (number > -1 && number < 1) {
          return roundToPrecision(number, 16);
        } else {
          return roundToPrecision(number, 5);
        }
      };
    } else {
      hpf = API.hpf = API.__private__.hpf = function(number) {
        if (isNaN(number)) {
          throw new Error("Invalid argument passed to jsPDF.hpf");
        }
        return roundToPrecision(number, 16);
      };
    }
    var f2 = (API.f2 = API.__private__.f2 = function(number) {
      if (isNaN(number)) {
        throw new Error("Invalid argument passed to jsPDF.f2");
      }
      return roundToPrecision(number, 2);
    });

    var f3 = (API.__private__.f3 = function(number) {
      if (isNaN(number)) {
        throw new Error("Invalid argument passed to jsPDF.f3");
      }
      return roundToPrecision(number, 3);
    });

    var scale = (API.scale = API.__private__.scale = function(number) {
      if (isNaN(number)) {
        throw new Error("Invalid argument passed to jsPDF.scale");
      }
      if (apiMode === ApiMode.COMPAT) {
        return number * scaleFactor;
      } else if (apiMode === ApiMode.ADVANCED) {
        return number;
      }
    });

    var transformY = function(y) {
      if (apiMode === ApiMode.COMPAT) {
        return getPageHeight() - y;
      } else if (apiMode === ApiMode.ADVANCED) {
        return y;
      }
    };

    var transformScaleY = function(y) {
      return scale(transformY(y));
    };

    /**
     * @name setPrecision
     * @memberof jsPDF#
     * @function
     * @instance
     * @param {string} precision
     * @returns {jsPDF}
     */
    API.__private__.setPrecision = API.setPrecision = function(value) {
      if (typeof parseInt(value, 10) === "number") {
        precision = parseInt(value, 10);
      }
    };

    var fileId = "00000000000000000000000000000000";

    var getFileId = (API.__private__.getFileId = function() {
      return fileId;
    });

    var setFileId = (API.__private__.setFileId = function(value) {
      if (typeof value !== "undefined" && /^[a-fA-F0-9]{32}$/.test(value)) {
        fileId = value.toUpperCase();
      } else {
        fileId = fileId
          .split("")
          .map(function() {
            return "ABCDEF0123456789".charAt(Math.floor(Math.random() * 16));
          })
          .join("");
      }
      return fileId;
    });

    /**
     * @name setFileId
     * @memberof jsPDF#
     * @function
     * @instance
     * @param {string} value GUID.
     * @returns {jsPDF}
     */
    API.setFileId = function(value) {
      setFileId(value);
      return this;
    };

    /**
     * @name getFileId
     * @memberof jsPDF#
     * @function
     * @instance
     *
     * @returns {string} GUID.
     */
    API.getFileId = function() {
      return getFileId();
    };

    var creationDate;

    var convertDateToPDFDate = (API.__private__.convertDateToPDFDate = function(
      parmDate
    ) {
      var result = "";
      var tzoffset = parmDate.getTimezoneOffset(),
        tzsign = tzoffset < 0 ? "+" : "-",
        tzhour = Math.floor(Math.abs(tzoffset / 60)),
        tzmin = Math.abs(tzoffset % 60),
        timeZoneString = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join(
          ""
        );

      result = [
        "D:",
        parmDate.getFullYear(),
        padd2(parmDate.getMonth() + 1),
        padd2(parmDate.getDate()),
        padd2(parmDate.getHours()),
        padd2(parmDate.getMinutes()),
        padd2(parmDate.getSeconds()),
        timeZoneString
      ].join("");
      return result;
    });

    var convertPDFDateToDate = (API.__private__.convertPDFDateToDate = function(
      parmPDFDate
    ) {
      var year = parseInt(parmPDFDate.substr(2, 4), 10);
      var month = parseInt(parmPDFDate.substr(6, 2), 10) - 1;
      var date = parseInt(parmPDFDate.substr(8, 2), 10);
      var hour = parseInt(parmPDFDate.substr(10, 2), 10);
      var minutes = parseInt(parmPDFDate.substr(12, 2), 10);
      var seconds = parseInt(parmPDFDate.substr(14, 2), 10);
      // var timeZoneHour = parseInt(parmPDFDate.substr(16, 2), 10);
      // var timeZoneMinutes = parseInt(parmPDFDate.substr(20, 2), 10);

      var resultingDate = new Date(
        year,
        month,
        date,
        hour,
        minutes,
        seconds,
        0
      );
      return resultingDate;
    });

    var setCreationDate = (API.__private__.setCreationDate = function(date) {
      var tmpCreationDateString;
      var regexPDFCreationDate = /^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|-0[0-9]|-1[0-1])'(0[0-9]|[1-5][0-9])'?$/;
      if (typeof date === "undefined") {
        date = new Date();
      }

      if (date instanceof Date) {
        tmpCreationDateString = convertDateToPDFDate(date);
      } else if (regexPDFCreationDate.test(date)) {
        tmpCreationDateString = date;
      } else {
        throw new Error("Invalid argument passed to jsPDF.setCreationDate");
      }
      creationDate = tmpCreationDateString;
      return creationDate;
    });

    var getCreationDate = (API.__private__.getCreationDate = function(type) {
      var result = creationDate;
      if (type === "jsDate") {
        result = convertPDFDateToDate(creationDate);
      }
      return result;
    });

    /**
     * @name setCreationDate
     * @memberof jsPDF#
     * @function
     * @instance
     * @param {Object} date
     * @returns {jsPDF}
     */
    API.setCreationDate = function(date) {
      setCreationDate(date);
      return this;
    };

    /**
     * @name getCreationDate
     * @memberof jsPDF#
     * @function
     * @instance
     * @param {Object} type
     * @returns {Object}
     */
    API.getCreationDate = function(type) {
      return getCreationDate(type);
    };

    var padd2 = (API.__private__.padd2 = function(number) {
      return ("0" + parseInt(number)).slice(-2);
    });

    var padd2Hex = (API.__private__.padd2Hex = function(hexString) {
      hexString = hexString.toString();
      return ("00" + hexString).substr(hexString.length);
    });

    var objectNumber = 0; // 'n' Current object number
    var offsets = []; // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
    var content = [];
    var contentLength = 0;
    var additionalObjects = [];

    var pages = [];
    var currentPage;
    var hasCustomDestination = false;
    var outputDestination = content;

    var resetDocument = function() {
      //reset fields relevant for objectNumber generation and xref.
      objectNumber = 0;
      contentLength = 0;
      content = [];
      offsets = [];
      additionalObjects = [];

      rootDictionaryObjId = newObjectDeferred();
      resourceDictionaryObjId = newObjectDeferred();
    };

    API.__private__.setCustomOutputDestination = function(destination) {
      hasCustomDestination = true;
      outputDestination = destination;
    };
    var setOutputDestination = function(destination) {
      if (!hasCustomDestination) {
        outputDestination = destination;
      }
    };

    API.__private__.resetCustomOutputDestination = function() {
      hasCustomDestination = false;
      outputDestination = content;
    };

    var out = (API.__private__.out = function(string) {
      string = string.toString();
      contentLength += string.length + 1;
      outputDestination.push(string);

      return outputDestination;
    });

    var write = (API.__private__.write = function(value) {
      return out(
        arguments.length === 1
          ? value.toString()
          : Array.prototype.join.call(arguments, " ")
      );
    });

    var getArrayBuffer = (API.__private__.getArrayBuffer = function(data) {
      var len = data.length,
        ab = new ArrayBuffer(len),
        u8 = new Uint8Array(ab);

      while (len--) u8[len] = data.charCodeAt(len);
      return ab;
    });

    var standardFonts = [
      ["Helvetica", "helvetica", "normal", "WinAnsiEncoding"],
      ["Helvetica-Bold", "helvetica", "bold", "WinAnsiEncoding"],
      ["Helvetica-Oblique", "helvetica", "italic", "WinAnsiEncoding"],
      ["Helvetica-BoldOblique", "helvetica", "bolditalic", "WinAnsiEncoding"],
      ["Courier", "courier", "normal", "WinAnsiEncoding"],
      ["Courier-Bold", "courier", "bold", "WinAnsiEncoding"],
      ["Courier-Oblique", "courier", "italic", "WinAnsiEncoding"],
      ["Courier-BoldOblique", "courier", "bolditalic", "WinAnsiEncoding"],
      ["Times-Roman", "times", "normal", "WinAnsiEncoding"],
      ["Times-Bold", "times", "bold", "WinAnsiEncoding"],
      ["Times-Italic", "times", "italic", "WinAnsiEncoding"],
      ["Times-BoldItalic", "times", "bolditalic", "WinAnsiEncoding"],
      ["ZapfDingbats", "zapfdingbats", "normal", null],
      ["Symbol", "symbol", "normal", null]
    ];

    API.__private__.getStandardFonts = function() {
      return standardFonts;
    };

    var activeFontSize = options.fontSize || 16;

    /**
     * Sets font size for upcoming text elements.
     *
     * @param {number} size Font size in points.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setFontSize
     */
    API.__private__.setFontSize = API.setFontSize = function(size) {
      if (apiMode === ApiMode.ADVANCED) {
        activeFontSize = size / scaleFactor;
      } else {
        activeFontSize = size;
      }
      return this;
    };

    /**
     * Gets the fontsize for upcoming text elements.
     *
     * @function
     * @instance
     * @returns {number}
     * @memberof jsPDF#
     * @name getFontSize
     */
    var getFontSize = (API.__private__.getFontSize = API.getFontSize = function() {
      if (apiMode === ApiMode.COMPAT) {
        return activeFontSize;
      } else {
        return activeFontSize * scaleFactor;
      }
    });

    var R2L = options.R2L || false;

    /**
     * Set value of R2L functionality.
     *
     * @param {boolean} value
     * @function
     * @instance
     * @returns {jsPDF} jsPDF-instance
     * @memberof jsPDF#
     * @name setR2L
     */
    API.__private__.setR2L = API.setR2L = function(value) {
      R2L = value;
      return this;
    };

    /**
     * Get value of R2L functionality.
     *
     * @function
     * @instance
     * @returns {boolean} jsPDF-instance
     * @memberof jsPDF#
     * @name getR2L
     */
    API.__private__.getR2L = API.getR2L = function() {
      return R2L;
    };

    var zoomMode; // default: 1;

    var setZoomMode = (API.__private__.setZoomMode = function(zoom) {
      var validZoomModes = [
        undefined,
        null,
        "fullwidth",
        "fullheight",
        "fullpage",
        "original"
      ];

      if (/^\d*\.?\d*%$/.test(zoom)) {
        zoomMode = zoom;
      } else if (!isNaN(zoom)) {
        zoomMode = parseInt(zoom, 10);
      } else if (validZoomModes.indexOf(zoom) !== -1) {
        zoomMode = zoom;
      } else {
        throw new Error(
          'zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "' +
            zoom +
            '" is not recognized.'
        );
      }
    });

    API.__private__.getZoomMode = function() {
      return zoomMode;
    };

    var pageMode; // default: 'UseOutlines';
    var setPageMode = (API.__private__.setPageMode = function(pmode) {
      var validPageModes = [
        undefined,
        null,
        "UseNone",
        "UseOutlines",
        "UseThumbs",
        "FullScreen"
      ];

      if (validPageModes.indexOf(pmode) == -1) {
        throw new Error(
          'Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' +
            pmode +
            '" is not recognized.'
        );
      }
      pageMode = pmode;
    });

    API.__private__.getPageMode = function() {
      return pageMode;
    };

    var layoutMode; // default: 'continuous';
    var setLayoutMode = (API.__private__.setLayoutMode = function(layout) {
      var validLayoutModes = [
        undefined,
        null,
        "continuous",
        "single",
        "twoleft",
        "tworight",
        "two"
      ];

      if (validLayoutModes.indexOf(layout) == -1) {
        throw new Error(
          'Layout mode must be one of continuous, single, twoleft, tworight. "' +
            layout +
            '" is not recognized.'
        );
      }
      layoutMode = layout;
    });

    API.__private__.getLayoutMode = function() {
      return layoutMode;
    };

    /**
     * Set the display mode options of the page like zoom and layout.
     *
     * @name setDisplayMode
     * @memberof jsPDF#
     * @function
     * @instance
     * @param {integer|String} zoom   You can pass an integer or percentage as
     * a string. 2 will scale the document up 2x, '200%' will scale up by the
     * same amount. You can also set it to 'fullwidth', 'fullheight',
     * 'fullpage', or 'original'.
     *
     * Only certain PDF readers support this, such as Adobe Acrobat.
     *
     * @param {string} layout Layout mode can be: 'continuous' - this is the
     * default continuous scroll. 'single' - the single page mode only shows one
     * page at a time. 'twoleft' - two column left mode, first page starts on
     * the left, and 'tworight' - pages are laid out in two columns, with the
     * first page on the right. This would be used for books.
     * @param {string} pmode 'UseOutlines' - it shows the
     * outline of the document on the left. 'UseThumbs' - shows thumbnails along
     * the left. 'FullScreen' - prompts the user to enter fullscreen mode.
     *
     * @returns {jsPDF}
     */
    API.__private__.setDisplayMode = API.setDisplayMode = function(
      zoom,
      layout,
      pmode
    ) {
      setZoomMode(zoom);
      setLayoutMode(layout);
      setPageMode(pmode);
      return this;
    };

    var documentProperties = {
      title: "",
      subject: "",
      author: "",
      keywords: "",
      creator: ""
    };

    API.__private__.getDocumentProperty = function(key) {
      if (Object.keys(documentProperties).indexOf(key) === -1) {
        throw new Error("Invalid argument passed to jsPDF.getDocumentProperty");
      }
      return documentProperties[key];
    };

    API.__private__.getDocumentProperties = function() {
      return documentProperties;
    };

    /**
     * Adds a properties to the PDF document.
     *
     * @param {Object} A property_name-to-property_value object structure.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setDocumentProperties
     */
    API.__private__.setDocumentProperties = API.setProperties = API.setDocumentProperties = function(
      properties
    ) {
      // copying only those properties we can render.
      for (var property in documentProperties) {
        if (
          documentProperties.hasOwnProperty(property) &&
          properties[property]
        ) {
          documentProperties[property] = properties[property];
        }
      }
      return this;
    };

    API.__private__.setDocumentProperty = function(key, value) {
      if (Object.keys(documentProperties).indexOf(key) === -1) {
        throw new Error(
          "Invalid arguments passed to jsPDF.setDocumentProperty"
        );
      }
      return (documentProperties[key] = value);
    };

    var fonts = {}; // collection of font objects, where key is fontKey - a dynamically created label for a given font.
    var fontmap = {}; // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
    var activeFontKey; // will be string representing the KEY of the font as combination of fontName + fontStyle
    var fontStateStack = []; //
    var patterns = {}; // collection of pattern objects
    var patternMap = {}; // see fonts
    var gStates = {}; // collection of graphic state objects
    var gStatesMap = {}; // see fonts
    var activeGState = null;
    var scaleFactor; // Scale factor
    var page = 0;
    var pagesContext = [];
    var events = new PubSub(API);
    var hotfixes = options.hotfixes || [];

    var renderTargets = {};
    var renderTargetMap = {};
    var renderTargetStack = [];
    var pageX;
    var pageY;
    var pageMatrix; // only used for FormObjects

    /**
     * A matrix object for 2D homogenous transformations: <br>
     * | a b 0 | <br>
     * | c d 0 | <br>
     * | e f 1 | <br>
     * pdf multiplies matrices righthand: v' = v x m1 x m2 x ...
     *
     * @class
     * @name Matrix
     * @param {number} sx
     * @param {number} shy
     * @param {number} shx
     * @param {number} sy
     * @param {number} tx
     * @param {number} ty
     * @constructor
     */
    var Matrix = function(sx, shy, shx, sy, tx, ty) {
      if (!(this instanceof Matrix)) {
        return new Matrix(sx, shy, shx, sy, tx, ty);
      }

      var _matrix = [];

      /**
       * @name sx
       * @memberof Matrix#
       */
      Object.defineProperty(this, "sx", {
        get: function() {
          return _matrix[0];
        },
        set: function(value) {
          _matrix[0] = value;
        }
      });

      /**
       * @name shy
       * @memberof Matrix#
       */
      Object.defineProperty(this, "shy", {
        get: function() {
          return _matrix[1];
        },
        set: function(value) {
          _matrix[1] = value;
        }
      });

      /**
       * @name shx
       * @memberof Matrix#
       */
      Object.defineProperty(this, "shx", {
        get: function() {
          return _matrix[2];
        },
        set: function(value) {
          _matrix[2] = value;
        }
      });

      /**
       * @name sy
       * @memberof Matrix#
       */
      Object.defineProperty(this, "sy", {
        get: function() {
          return _matrix[3];
        },
        set: function(value) {
          _matrix[3] = value;
        }
      });

      /**
       * @name tx
       * @memberof Matrix#
       */
      Object.defineProperty(this, "tx", {
        get: function() {
          return _matrix[4];
        },
        set: function(value) {
          _matrix[4] = value;
        }
      });

      /**
       * @name ty
       * @memberof Matrix#
       */
      Object.defineProperty(this, "ty", {
        get: function() {
          return _matrix[5];
        },
        set: function(value) {
          _matrix[5] = value;
        }
      });

      Object.defineProperty(this, "a", {
        get: function() {
          return _matrix[0];
        },
        set: function(value) {
          _matrix[0] = value;
        }
      });

      Object.defineProperty(this, "b", {
        get: function() {
          return _matrix[1];
        },
        set: function(value) {
          _matrix[1] = value;
        }
      });

      Object.defineProperty(this, "c", {
        get: function() {
          return _matrix[2];
        },
        set: function(value) {
          _matrix[2] = value;
        }
      });

      Object.defineProperty(this, "d", {
        get: function() {
          return _matrix[3];
        },
        set: function(value) {
          _matrix[3] = value;
        }
      });

      Object.defineProperty(this, "e", {
        get: function() {
          return _matrix[4];
        },
        set: function(value) {
          _matrix[4] = value;
        }
      });

      Object.defineProperty(this, "f", {
        get: function() {
          return _matrix[5];
        },
        set: function(value) {
          _matrix[5] = value;
        }
      });

      /**
       * @name rotation
       * @memberof Matrix#
       */
      Object.defineProperty(this, "rotation", {
        get: function() {
          return Math.atan2(this.shx, this.sx);
        }
      });

      /**
       * @name scaleX
       * @memberof Matrix#
       */
      Object.defineProperty(this, "scaleX", {
        get: function() {
          return this.decompose().scale.sx;
        }
      });

      /**
       * @name scaleY
       * @memberof Matrix#
       */
      Object.defineProperty(this, "scaleY", {
        get: function() {
          return this.decompose().scale.sy;
        }
      });

      /**
       * @name isIdentity
       * @memberof Matrix#
       */
      Object.defineProperty(this, "isIdentity", {
        get: function() {
          if (this.sx !== 1) {
            return false;
          }
          if (this.shy !== 0) {
            return false;
          }
          if (this.shx !== 0) {
            return false;
          }
          if (this.sy !== 1) {
            return false;
          }
          if (this.tx !== 0) {
            return false;
          }
          if (this.ty !== 0) {
            return false;
          }
          return true;
        }
      });

      this.sx = !isNaN(sx) ? sx : 1;
      this.shy = !isNaN(shy) ? shy : 0;
      this.shx = !isNaN(shx) ? shx : 0;
      this.sy = !isNaN(sy) ? sy : 1;
      this.tx = !isNaN(tx) ? tx : 0;
      this.ty = !isNaN(ty) ? ty : 0;

      return this;
    };

    /**
     * Join the Matrix Values to a String
     *
     * @function join
     * @param {string} separator Specifies a string to separate each pair of adjacent elements of the array. The separator is converted to a string if necessary. If omitted, the array elements are separated with a comma (","). If separator is an empty string, all elements are joined without any characters in between them.
     * @returns {string} A string with all array elements joined.
     * @memberof Matrix#
     */
    Matrix.prototype.join = function(separator) {
      return [this.sx, this.shy, this.shx, this.sy, this.tx, this.ty]
        .map(hpf)
        .join(separator);
    };

    /**
     * Multiply the matrix with given Matrix
     *
     * @function multiply
     * @param matrix
     * @returns {Matrix}
     * @memberof Matrix#
     */
    Matrix.prototype.multiply = function(matrix) {
      var sx = matrix.sx * this.sx + matrix.shy * this.shx;
      var shy = matrix.sx * this.shy + matrix.shy * this.sy;
      var shx = matrix.shx * this.sx + matrix.sy * this.shx;
      var sy = matrix.shx * this.shy + matrix.sy * this.sy;
      var tx = matrix.tx * this.sx + matrix.ty * this.shx + this.tx;
      var ty = matrix.tx * this.shy + matrix.ty * this.sy + this.ty;

      return new Matrix(sx, shy, shx, sy, tx, ty);
    };

    /**
     * @function decompose
     * @memberof Matrix#
     */
    Matrix.prototype.decompose = function() {
      var a = this.sx;
      var b = this.shy;
      var c = this.shx;
      var d = this.sy;
      var e = this.tx;
      var f = this.ty;

      var scaleX = Math.sqrt(a * a + b * b);
      a /= scaleX;
      b /= scaleX;

      var shear = a * c + b * d;
      c -= a * shear;
      d -= b * shear;

      var scaleY = Math.sqrt(c * c + d * d);
      c /= scaleY;
      d /= scaleY;
      shear /= scaleY;

      if (a * d < b * c) {
        a = -a;
        b = -b;
        shear = -shear;
        scaleX = -scaleX;
      }

      return {
        scale: new Matrix(scaleX, 0, 0, scaleY, 0, 0),
        translate: new Matrix(1, 0, 0, 1, e, f),
        rotate: new Matrix(a, b, -b, a, 0, 0),
        skew: new Matrix(1, 0, shear, 1, 0, 0)
      };
    };

    /**
     * @function toString
     * @memberof Matrix#
     */
    Matrix.prototype.toString = function(parmPrecision) {
      return this.join(" ");
    };

    /**
     * @function inversed
     * @memberof Matrix#
     */
    Matrix.prototype.inversed = function() {
      var a = this.sx,
        b = this.shy,
        c = this.shx,
        d = this.sy,
        e = this.tx,
        f = this.ty;

      var quot = 1 / (a * d - b * c);

      var aInv = d * quot;
      var bInv = -b * quot;
      var cInv = -c * quot;
      var dInv = a * quot;
      var eInv = -aInv * e - cInv * f;
      var fInv = -bInv * e - dInv * f;

      return new Matrix(aInv, bInv, cInv, dInv, eInv, fInv);
    };

    /**
     * @function applyToPoint
     * @memberof Matrix#
     */
    Matrix.prototype.applyToPoint = function(pt) {
      var x = pt.x * this.sx + pt.y * this.shx + this.tx;
      var y = pt.x * this.shy + pt.y * this.sy + this.ty;
      return new Point(x, y);
    };

    /**
     * @function applyToRectangle
     * @memberof Matrix#
     */
    Matrix.prototype.applyToRectangle = function(rect) {
      var pt1 = this.applyToPoint(rect);
      var pt2 = this.applyToPoint(new Point(rect.x + rect.w, rect.y + rect.h));
      return new Rectangle(pt1.x, pt1.y, pt2.x - pt1.x, pt2.y - pt1.y);
    };

    /**
     * Clone the Matrix
     *
     * @function clone
     * @memberof Matrix#
     * @name clone
     * @instance
     */
    Matrix.prototype.clone = function() {
      var sx = this.sx;
      var shy = this.shy;
      var shx = this.shx;
      var sy = this.sy;
      var tx = this.tx;
      var ty = this.ty;

      return new Matrix(sx, shy, shx, sy, tx, ty);
    };

    API.Matrix = Matrix;

    /**
     * Multiplies two matrices. (see {@link Matrix})
     * @param {Matrix} m1
     * @param {Matrix} m2
     * @memberof jsPDF#
     * @name matrixMult
     */
    var matrixMult = (API.matrixMult = function(m1, m2) {
      return m2.multiply(m1);
    });

    /**
     * The identity matrix (equivalent to new Matrix(1, 0, 0, 1, 0, 0)).
     * @type {Matrix}
     * @memberof! jsPDF#
     * @name identityMatrix
     */
    var identityMatrix = new Matrix(1, 0, 0, 1, 0, 0);
    API.unitMatrix = API.identityMatrix = identityMatrix;

    var Pattern = function(gState, matrix) {
      this.gState = gState;
      this.matrix = matrix;

      this.id = ""; // set by addPattern()
      this.objectNumber = -1; // will be set by putPattern()
    };

    /**
     * Adds a new pattern for later use.
     * @param {String} key The key by it can be referenced later. The keys must be unique!
     * @param {API.Pattern} pattern The pattern
     */
    var addPattern = function(key, pattern) {
      // only add it if it is not already present (the keys provided by the user must be unique!)
      if (patternMap[key]) return;

      var prefix = pattern instanceof API.ShadingPattern ? "Sh" : "P";
      var patternKey = prefix + (Object.keys(patterns).length + 1).toString(10);
      pattern.id = patternKey;

      patternMap[key] = patternKey;
      patterns[patternKey] = pattern;

      events.publish("addPattern", pattern);
    };

    /**
     * A pattern describing a shading pattern.
     *
     * Only available in "advanced" API mode.
     *
     * @param {String} type One of "axial" or "radial"
     * @param {Array<Number>} coords Either [x1, y1, x2, y2] for "axial" type describing the two interpolation points
     * or [x1, y1, r, x2, y2, r2] for "radial" describing inner and the outer circle.
     * @param {Array<Object>} colors An array of objects with the fields "offset" and "color". "offset" describes
     * the offset in parameter space [0, 1]. "color" is an array of length 3 describing RGB values in [0, 255].
     * @param {GState=} gState An additional graphics state that gets applied to the pattern (optional).
     * @param {Matrix=} matrix A matrix that describes the transformation between the pattern coordinate system
     * and the use coordinate system (optional).
     * @constructor
     * @extends API.Pattern
     */
    API.ShadingPattern = function ShadingPattern(
      type,
      coords,
      colors,
      gState,
      matrix
    ) {
      advancedApiModeTrap("ShadingPattern");

      if (!(this instanceof ShadingPattern)) {
        return new ShadingPattern(type, coords, colors, gState, matrix);
      }

      // see putPattern() for information how they are realized
      this.type = type === "axial" ? 2 : 3;
      this.coords = coords;
      this.colors = colors;

      Pattern.call(this, gState, matrix);
    };

    /**
     * A PDF Tiling pattern.
     *
     * Only available in "advanced" API mode.
     *
     * @param {Array.<Number>} boundingBox The bounding box at which one pattern cell gets clipped.
     * @param {Number} xStep Horizontal spacing between pattern cells.
     * @param {Number} yStep Vertical spacing between pattern cells.
     * @param {API.GState=} gState An additional graphics state that gets applied to the pattern (optional).
     * @param {Matrix=} matrix A matrix that describes the transformation between the pattern coordinate system
     * and the use coordinate system (optional).
     * @constructor
     * @extends API.Pattern
     */
    API.TilingPattern = function TilingPattern(
      boundingBox,
      xStep,
      yStep,
      gState,
      matrix
    ) {
      advancedApiModeTrap("TilingPattern");

      if (!(this instanceof TilingPattern)) {
        return new TilingPattern(boundingBox, xStep, yStep, gState, matrix);
      }

      this.boundingBox = boundingBox;
      this.xStep = xStep;
      this.yStep = yStep;

      this.stream = ""; // set by endTilingPattern();

      this.cloneIndex = 0;

      Pattern.call(this, gState, matrix);
    };

    API.TilingPattern.prototype = {
      createClone: function(patternKey, boundingBox, xStep, yStep, matrix) {
        var clone = new API.TilingPattern(
          boundingBox || this.boundingBox,
          xStep || this.xStep,
          yStep || this.yStep,
          this.gState,
          matrix || this.matrix
        );
        clone.stream = this.stream;
        var key = patternKey + "$$" + this.cloneIndex++ + "$$";
        addPattern(key, clone);
        return clone;
      }
    };

    /**
     * Adds a new {@link API.ShadingPattern} for later use. Only available in "advanced" API mode.
     * @param {String} key
     * @param {Pattern} pattern
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name addPattern
     */
    API.addShadingPattern = function(key, pattern) {
      advancedApiModeTrap("addShadingPattern()");

      addPattern(key, pattern);
      return this;
    };

    /**
     * Begins a new tiling pattern. All subsequent render calls are drawn to this pattern until {@link API.endTilingPattern}
     * gets called. Only available in "advanced" API mode.
     * @param {API.Pattern} pattern
     * @memberof jsPDF#
     * @name beginTilingPattern
     */
    API.beginTilingPattern = function(pattern) {
      advancedApiModeTrap("beginTilingPattern()");

      beginNewRenderTarget(
        pattern.boundingBox[0],
        pattern.boundingBox[1],
        pattern.boundingBox[2] - pattern.boundingBox[0],
        pattern.boundingBox[3] - pattern.boundingBox[1],
        pattern.matrix
      );
    };

    /**
     * Ends a tiling pattern and sets the render target to the one active before {@link API.beginTilingPattern} has been called.
     *
     * Only available in "advanced" API mode.
     *
     * @param {string} key A unique key that is used to reference this pattern at later use.
     * @param {API.Pattern} pattern The pattern to end.
     * @memberof jsPDF#
     * @name endTilingPattern
     */
    API.endTilingPattern = function(key, pattern) {
      advancedApiModeTrap("endTilingPattern()");

      // retrieve the stream
      pattern.stream = pages[currentPage].join("\n");

      addPattern(key, pattern);

      events.publish("endTilingPattern", pattern);

      // restore state from stack
      renderTargetStack.pop().restore();
    };

    var newObject = (API.__private__.newObject = function() {
      var oid = newObjectDeferred();
      newObjectDeferredBegin(oid, true);
      return oid;
    });

    // Does not output the object.  The caller must call newObjectDeferredBegin(oid) before outputing any data
    var newObjectDeferred = (API.__private__.newObjectDeferred = function() {
      objectNumber++;
      offsets[objectNumber] = function() {
        return contentLength;
      };
      return objectNumber;
    });

    var newObjectDeferredBegin = function(oid, doOutput) {
      doOutput = typeof doOutput === "boolean" ? doOutput : false;
      offsets[oid] = contentLength;
      if (doOutput) {
        out(oid + " 0 obj");
      }
      return oid;
    };
    // Does not output the object until after the pages have been output.
    // Returns an object containing the objectId and content.
    // All pages have been added so the object ID can be estimated to start right after.
    // This does not modify the current objectNumber;  It must be updated after the newObjects are output.
    var newAdditionalObject = (API.__private__.newAdditionalObject = function() {
      var objId = newObjectDeferred();
      var obj = {
        objId: objId,
        content: ""
      };
      additionalObjects.push(obj);
      return obj;
    });

    var rootDictionaryObjId = newObjectDeferred();
    var resourceDictionaryObjId = newObjectDeferred();

    /////////////////////
    // Private functions
    /////////////////////

    var decodeColorString = (API.__private__.decodeColorString = function(
      color
    ) {
      var colorEncoded = color.split(" ");
      if (
        colorEncoded.length === 2 &&
        (colorEncoded[1] === "g" || colorEncoded[1] === "G")
      ) {
        // convert grayscale value to rgb so that it can be converted to hex for consistency
        var floatVal = parseFloat(colorEncoded[0]);
        colorEncoded = [floatVal, floatVal, floatVal, "r"];
      } else if (
        colorEncoded.length === 5 &&
        (colorEncoded[4] === "k" || colorEncoded[4] === "K")
      ) {
        // convert CMYK values to rbg so that it can be converted to hex for consistency
        var red = (1.0 - colorEncoded[0]) * (1.0 - colorEncoded[3]);
        var green = (1.0 - colorEncoded[1]) * (1.0 - colorEncoded[3]);
        var blue = (1.0 - colorEncoded[2]) * (1.0 - colorEncoded[3]);

        colorEncoded = [red, green, blue, "r"];
      }
      var colorAsRGB = "#";
      for (var i = 0; i < 3; i++) {
        colorAsRGB += (
          "0" + Math.floor(parseFloat(colorEncoded[i]) * 255).toString(16)
        ).slice(-2);
      }
      return colorAsRGB;
    });

    var encodeColorString = (API.__private__.encodeColorString = function(
      options
    ) {
      var color;

      if (typeof options === "string") {
        options = {
          ch1: options
        };
      }
      var ch1 = options.ch1;
      var ch2 = options.ch2;
      var ch3 = options.ch3;
      var ch4 = options.ch4;
      var letterArray =
        options.pdfColorType === "draw" ? ["G", "RG", "K"] : ["g", "rg", "k"];

      if (typeof ch1 === "string" && ch1.charAt(0) !== "#") {
        var rgbColor = new RGBColor(ch1);
        if (rgbColor.ok) {
          ch1 = rgbColor.toHex();
        } else if (!/^\d*\.?\d*$/.test(ch1)) {
          throw new Error(
            'Invalid color "' + ch1 + '" passed to jsPDF.encodeColorString.'
          );
        }
      }
      //convert short rgb to long form
      if (typeof ch1 === "string" && /^#[0-9A-Fa-f]{3}$/.test(ch1)) {
        ch1 = "#" + ch1[1] + ch1[1] + ch1[2] + ch1[2] + ch1[3] + ch1[3];
      }

      if (typeof ch1 === "string" && /^#[0-9A-Fa-f]{6}$/.test(ch1)) {
        var hex = parseInt(ch1.substr(1), 16);
        ch1 = (hex >> 16) & 255;
        ch2 = (hex >> 8) & 255;
        ch3 = hex & 255;
      }

      if (
        typeof ch2 === "undefined" ||
        (typeof ch4 === "undefined" && ch1 === ch2 && ch2 === ch3)
      ) {
        // Gray color space.
        if (typeof ch1 === "string") {
          color = ch1 + " " + letterArray[0];
        } else {
          switch (options.precision) {
            case 2:
              color = f2(ch1 / 255) + " " + letterArray[0];
              break;
            case 3:
            default:
              color = f3(ch1 / 255) + " " + letterArray[0];
          }
        }
      } else if (typeof ch4 === "undefined" || typeof ch4 === "object") {
        // assume RGBA
        if (ch4 && !isNaN(ch4.a)) {
          //TODO Implement transparency.
          //WORKAROUND use white for now, if transparent, otherwise handle as rgb
          if (ch4.a === 0) {
            color = ["1.", "1.", "1.", letterArray[1]].join(" ");
            return color;
          }
        }
        // assume RGB
        if (typeof ch1 === "string") {
          color = [ch1, ch2, ch3, letterArray[1]].join(" ");
        } else {
          switch (options.precision) {
            case 2:
              color = [
                f2(ch1 / 255),
                f2(ch2 / 255),
                f2(ch3 / 255),
                letterArray[1]
              ].join(" ");
              break;
            default:
            case 3:
              color = [
                f3(ch1 / 255),
                f3(ch2 / 255),
                f3(ch3 / 255),
                letterArray[1]
              ].join(" ");
          }
        }
      } else {
        // assume CMYK
        if (typeof ch1 === "string") {
          color = [ch1, ch2, ch3, ch4, letterArray[2]].join(" ");
        } else {
          switch (options.precision) {
            case 2:
              color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), letterArray[2]].join(
                " "
              );
              break;
            case 3:
            default:
              color = [f3(ch1), f3(ch2), f3(ch3), f3(ch4), letterArray[2]].join(
                " "
              );
          }
        }
      }
      return color;
    });

    var getFilters = (API.__private__.getFilters = function() {
      return filters;
    });

    var putStream = (API.__private__.putStream = function(options) {
      options = options || {};
      var data = options.data || "";
      var filters = options.filters || getFilters();
      var alreadyAppliedFilters = options.alreadyAppliedFilters || [];
      var addLength1 = options.addLength1 || false;
      var valueOfLength1 = data.length;

      var processedData = {};
      if (filters === true) {
        filters = ["FlateEncode"];
      }
      var keyValues = options.additionalKeyValues || [];
      if (typeof jsPDF.API.processDataByFilters !== "undefined") {
        processedData = jsPDF.API.processDataByFilters(data, filters);
      } else {
        processedData = { data: data, reverseChain: [] };
      }
      var filterAsString =
        processedData.reverseChain +
        (Array.isArray(alreadyAppliedFilters)
          ? alreadyAppliedFilters.join(" ")
          : alreadyAppliedFilters.toString());

      if (processedData.data.length !== 0) {
        keyValues.push({
          key: "Length",
          value: processedData.data.length
        });
        if (addLength1 === true) {
          keyValues.push({
            key: "Length1",
            value: valueOfLength1
          });
        }
      }

      if (filterAsString.length != 0) {
        if (filterAsString.split("/").length - 1 === 1) {
          keyValues.push({
            key: "Filter",
            value: filterAsString
          });
        } else {
          keyValues.push({
            key: "Filter",
            value: "[" + filterAsString + "]"
          });

          for (var j = 0; j < keyValues.length; j += 1) {
            if (keyValues[j].key === "DecodeParms") {
              var decodeParmsArray = [];

              for (
                var i = 0;
                i < processedData.reverseChain.split("/").length - 1;
                i += 1
              ) {
                decodeParmsArray.push("null");
              }

              decodeParmsArray.push(keyValues[j].value);
              keyValues[j].value = "[" + decodeParmsArray.join(" ") + "]";
            }
          }
        }
      }

      out("<<");
      for (var k = 0; k < keyValues.length; k++) {
        out("/" + keyValues[k].key + " " + keyValues[k].value);
      }
      out(">>");
      if (processedData.data.length !== 0) {
        out("stream");
        out(processedData.data);
        out("endstream");
      }
    });

    var putPage = (API.__private__.putPage = function(page) {
      var pageNumber = page.number;
      var data = page.data;
      var pageObjectNumber = page.objId;
      var pageContentsObjId = page.contentsObjId;

      newObjectDeferredBegin(pageObjectNumber, true);
      out("<</Type /Page");
      out("/Parent " + page.rootDictionaryObjId + " 0 R");
      out("/Resources " + page.resourceDictionaryObjId + " 0 R");
      out(
        "/MediaBox [" +
          parseFloat(hpf(page.mediaBox.bottomLeftX)) +
          " " +
          parseFloat(hpf(page.mediaBox.bottomLeftY)) +
          " " +
          hpf(page.mediaBox.topRightX) +
          " " +
          hpf(page.mediaBox.topRightY) +
          "]"
      );
      if (page.cropBox !== null) {
        out(
          "/CropBox [" +
            hpf(page.cropBox.bottomLeftX) +
            " " +
            hpf(page.cropBox.bottomLeftY) +
            " " +
            hpf(page.cropBox.topRightX) +
            " " +
            hpf(page.cropBox.topRightY) +
            "]"
        );
      }

      if (page.bleedBox !== null) {
        out(
          "/BleedBox [" +
            hpf(page.bleedBox.bottomLeftX) +
            " " +
            hpf(page.bleedBox.bottomLeftY) +
            " " +
            hpf(page.bleedBox.topRightX) +
            " " +
            hpf(page.bleedBox.topRightY) +
            "]"
        );
      }

      if (page.trimBox !== null) {
        out(
          "/TrimBox [" +
            hpf(page.trimBox.bottomLeftX) +
            " " +
            hpf(page.trimBox.bottomLeftY) +
            " " +
            hpf(page.trimBox.topRightX) +
            " " +
            hpf(page.trimBox.topRightY) +
            "]"
        );
      }

      if (page.artBox !== null) {
        out(
          "/ArtBox [" +
            hpf(page.artBox.bottomLeftX) +
            " " +
            hpf(page.artBox.bottomLeftY) +
            " " +
            hpf(page.artBox.topRightX) +
            " " +
            hpf(page.artBox.topRightY) +
            "]"
        );
      }

      if (typeof page.userUnit === "number" && page.userUnit !== 1.0) {
        out("/UserUnit " + page.userUnit);
      }

      events.publish("putPage", {
        objId: pageObjectNumber,
        pageContext: pagesContext[pageNumber],
        pageNumber: pageNumber,
        page: data
      });
      out("/Contents " + pageContentsObjId + " 0 R");
      out(">>");
      out("endobj");
      // Page content
      var pageContent = data.join("\n");

      if (apiMode === ApiMode.ADVANCED) {
        // if the user forgot to switch back to COMPAT mode, we must balance the graphics stack again
        pageContent += "\nQ";
      }

      newObjectDeferredBegin(pageContentsObjId, true);
      putStream({
        data: pageContent,
        filters: getFilters()
      });
      out("endobj");
      return pageObjectNumber;
    });

    var putPages = (API.__private__.putPages = function() {
      var n,
        i,
        pageObjectNumbers = [];

      for (n = 1; n <= page; n++) {
        pagesContext[n].objId = newObjectDeferred();
        pagesContext[n].contentsObjId = newObjectDeferred();
      }

      for (n = 1; n <= page; n++) {
        pageObjectNumbers.push(
          putPage({
            number: n,
            data: pages[n],
            objId: pagesContext[n].objId,
            contentsObjId: pagesContext[n].contentsObjId,
            mediaBox: pagesContext[n].mediaBox,
            cropBox: pagesContext[n].cropBox,
            bleedBox: pagesContext[n].bleedBox,
            trimBox: pagesContext[n].trimBox,
            artBox: pagesContext[n].artBox,
            userUnit: pagesContext[n].userUnit,
            rootDictionaryObjId: rootDictionaryObjId,
            resourceDictionaryObjId: resourceDictionaryObjId
          })
        );
      }
      newObjectDeferredBegin(rootDictionaryObjId, true);
      out("<</Type /Pages");
      var kids = "/Kids [";
      for (i = 0; i < page; i++) {
        kids += pageObjectNumbers[i] + " 0 R ";
      }
      out(kids + "]");
      out("/Count " + page);
      out(">>");
      out("endobj");
      events.publish("postPutPages");
    });

    var putFont = function(font) {
      var pdfEscapeWithNeededParanthesis = function(text, flags) {
        var addParanthesis = text.indexOf(" ") !== -1;
        return addParanthesis
          ? "(" + pdfEscape(text, flags) + ")"
          : pdfEscape(text, flags);
      };

      events.publish("putFont", {
        font: font,
        out: out,
        newObject: newObject,
        putStream: putStream,
        pdfEscapeWithNeededParanthesis: pdfEscapeWithNeededParanthesis
      });

      if (font.isAlreadyPutted !== true) {
        font.objectNumber = newObject();
        out("<<");
        out("/Type /Font");
        out(
          "/BaseFont /" + pdfEscapeWithNeededParanthesis(font.postScriptName)
        );
        out("/Subtype /Type1");
        if (typeof font.encoding === "string") {
          out("/Encoding /" + font.encoding);
        }
        out("/FirstChar 32");
        out("/LastChar 255");
        out(">>");
        out("endobj");
      }
    };

    var putFonts = function() {
      for (var fontKey in fonts) {
        if (fonts.hasOwnProperty(fontKey)) {
          if (
            putOnlyUsedFonts === false ||
            (putOnlyUsedFonts === true && usedFonts.hasOwnProperty(fontKey))
          ) {
            putFont(fonts[fontKey]);
          }
        }
      }
    };

    var putXObject = function(xObject) {
      xObject.objectNumber = newObject();

      var options = [];
      options.push({ key: "Type", value: "/XObject" });
      options.push({ key: "Subtype", value: "/Form" });
      options.push({
        key: "BBox",
        value:
          "[" +
          [
            hpf(xObject.x),
            hpf(xObject.y),
            hpf(xObject.x + xObject.width),
            hpf(xObject.y + xObject.height)
          ].join(" ") +
          "]"
      });
      options.push({
        key: "Matrix",
        value: "[" + xObject.matrix.toString() + "]"
      });
      // TODO: /Resources

      var stream = xObject.pages[1].join("\n");
      putStream({
        data: stream,
        additionalKeyValues: options
      });
      out("endobj");
    };

    var putXObjects = function() {
      for (var xObjectKey in renderTargets) {
        if (renderTargets.hasOwnProperty(xObjectKey)) {
          putXObject(renderTargets[xObjectKey]);
        }
      }
    };

    var interpolateAndEncodeRGBStream = function(colors, numberSamples) {
      var tValues = [];
      var t;
      var dT = 1.0 / (numberSamples - 1);
      for (t = 0.0; t < 1.0; t += dT) {
        tValues.push(t);
      }
      tValues.push(1.0);
      // add first and last control point if not present
      if (colors[0].offset != 0.0) {
        var c0 = {
          offset: 0.0,
          color: colors[0].color
        };
        colors.unshift(c0);
      }
      if (colors[colors.length - 1].offset != 1.0) {
        var c1 = {
          offset: 1.0,
          color: colors[colors.length - 1].color
        };
        colors.push(c1);
      }
      var out = "";
      var index = 0;

      for (var i = 0; i < tValues.length; i++) {
        t = tValues[i];
        while (t > colors[index + 1].offset) index++;
        var a = colors[index].offset;
        var b = colors[index + 1].offset;
        var d = (t - a) / (b - a);

        var aColor = colors[index].color;
        var bColor = colors[index + 1].color;

        out +=
          padd2Hex(
            Math.round((1 - d) * aColor[0] + d * bColor[0]).toString(16)
          ) +
          padd2Hex(
            Math.round((1 - d) * aColor[1] + d * bColor[1]).toString(16)
          ) +
          padd2Hex(
            Math.round((1 - d) * aColor[2] + d * bColor[2]).toString(16)
          );
      }
      return out.trim();
    };

    var putShadingPattern = function(pattern, numberSamples) {
      /*
       Axial patterns shade between the two points specified in coords, radial patterns between the inner
       and outer circle.
       The user can specify an array (colors) that maps t-Values in [0, 1] to RGB colors. These are now
       interpolated to equidistant samples and written to pdf as a sample (type 0) function.
       */
      // The number of color samples that should be used to describe the shading.
      // The higher, the more accurate the gradient will be.
      numberSamples || (numberSamples = 21);
      var funcObjectNumber = newObject();
      var stream = interpolateAndEncodeRGBStream(pattern.colors, numberSamples);

      var options = [];
      options.push({ key: "FunctionType", value: "0" });
      options.push({ key: "Domain", value: "[0.0 1.0]" });
      options.push({ key: "Size", value: "[" + numberSamples + "]" });
      options.push({ key: "BitsPerSample", value: "8" });
      options.push({ key: "Range", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" });
      options.push({ key: "Decode", value: "[0.0 1.0 0.0 1.0 0.0 1.0]" });

      putStream({
        data: stream,
        additionalKeyValues: options,
        alreadyAppliedFilters: ["/ASCIIHexDecode"]
      });
      out("endobj");

      pattern.objectNumber = newObject();
      out("<< /ShadingType " + pattern.type);
      out("/ColorSpace /DeviceRGB");
      var coords =
        "/Coords [" +
        hpf(parseFloat(pattern.coords[0])) +
        " " + // x1
        hpf(parseFloat(pattern.coords[1])) +
        " "; // y1
      if (pattern.type === 2) {
        // axial
        coords +=
          hpf(parseFloat(pattern.coords[2])) +
          " " + // x2
          hpf(parseFloat(pattern.coords[3])); // y2
      } else {
        // radial
        coords +=
          hpf(parseFloat(pattern.coords[2])) +
          " " + // r1
          hpf(parseFloat(pattern.coords[3])) +
          " " + // x2
          hpf(parseFloat(pattern.coords[4])) +
          " " + // y2
          hpf(parseFloat(pattern.coords[5])); // r2
      }
      coords += "]";
      out(coords);

      if (pattern.matrix) {
        out("/Matrix [" + pattern.matrix.toString() + "]");
      }
      out("/Function " + funcObjectNumber + " 0 R");
      out("/Extend [true true]");
      out(">>");
      out("endobj");
    };

    var putTilingPattern = function(pattern, deferredResourceDictionaryIds) {
      var resourcesObjectId = newObjectDeferred();
      var patternObjectId = newObject();

      deferredResourceDictionaryIds.push({
        resourcesOid: resourcesObjectId,
        objectOid: patternObjectId
      });

      pattern.objectNumber = patternObjectId;
      var options = [];
      options.push({ key: "Type", value: "/Pattern" });
      options.push({ key: "PatternType", value: "1" }); // tiling pattern
      options.push({ key: "PaintType", value: "1" }); // colored tiling pattern
      options.push({ key: "TilingType", value: "1" }); // constant spacing
      options.push({
        key: "BBox",
        value: "[" + pattern.boundingBox.map(hpf).join(" ") + "]"
      });
      options.push({ key: "XStep", value: hpf(pattern.xStep) });
      options.push({ key: "YStep", value: hpf(pattern.yStep) });
      options.push({ key: "Resources", value: resourcesObjectId + " 0 R" });
      if (pattern.matrix) {
        options.push({
          key: "Matrix",
          value: "[" + pattern.matrix.toString() + "]"
        });
      }

      putStream({
        data: pattern.stream,
        additionalKeyValues: options
      });
      out("endobj");
    };

    var putPatterns = function(deferredResourceDictionaryIds) {
      var patternKey;
      for (patternKey in patterns) {
        if (patterns.hasOwnProperty(patternKey)) {
          if (patterns[patternKey] instanceof API.ShadingPattern) {
            putShadingPattern(patterns[patternKey]);
          } else if (patterns[patternKey] instanceof API.TilingPattern) {
            putTilingPattern(
              patterns[patternKey],
              deferredResourceDictionaryIds
            );
          }
        }
      }
    };

    var putGState = function(gState) {
      gState.objectNumber = newObject();
      out("<<");
      for (var p in gState) {
        switch (p) {
          case "opacity":
            out("/ca " + f2(gState[p]));
            break;
          case "stroke-opacity":
            out("/CA " + f2(gState[p]));
            break;
        }
      }
      out(">>");
      out("endobj");
    };

    var putGStates = function() {
      var gStateKey;
      for (gStateKey in gStates) {
        if (gStates.hasOwnProperty(gStateKey)) {
          putGState(gStates[gStateKey]);
        }
      }
    };

    var putXobjectDict = function() {
      out("/XObject <<");
      for (var xObjectKey in renderTargets) {
        if (
          renderTargets.hasOwnProperty(xObjectKey) &&
          renderTargets[xObjectKey].objectNumber >= 0
        ) {
          out(
            "/" +
              xObjectKey +
              " " +
              renderTargets[xObjectKey].objectNumber +
              " 0 R"
          );
        }
      }

      // Loop through images, or other data objects
      events.publish("putXobjectDict");
      out(">>");
    };

    var putFontDict = function() {
      out("/Font <<");

      for (var fontKey in fonts) {
        if (fonts.hasOwnProperty(fontKey)) {
          if (
            putOnlyUsedFonts === false ||
            (putOnlyUsedFonts === true && usedFonts.hasOwnProperty(fontKey))
          ) {
            out("/" + fontKey + " " + fonts[fontKey].objectNumber + " 0 R");
          }
        }
      }
      out(">>");
    };

    var putShadingPatternDict = function() {
      if (Object.keys(patterns).length > 0) {
        out("/Shading <<");
        for (var patternKey in patterns) {
          if (
            patterns.hasOwnProperty(patternKey) &&
            patterns[patternKey] instanceof API.ShadingPattern &&
            patterns[patternKey].objectNumber >= 0
          ) {
            out(
              "/" +
                patternKey +
                " " +
                patterns[patternKey].objectNumber +
                " 0 R"
            );
          }
        }

        events.publish("putShadingPatternDict");
        out(">>");
      }
    };

    var putTilingPatternDict = function(objectOid) {
      if (Object.keys(patterns).length > 0) {
        out("/Pattern <<");
        for (var patternKey in patterns) {
          if (
            patterns.hasOwnProperty(patternKey) &&
            patterns[patternKey] instanceof API.TilingPattern &&
            patterns[patternKey].objectNumber >= 0 &&
            patterns[patternKey].objectNumber < objectOid // prevent cyclic dependencies
          ) {
            out(
              "/" +
                patternKey +
                " " +
                patterns[patternKey].objectNumber +
                " 0 R"
            );
          }
        }
        events.publish("putTilingPatternDict");
        out(">>");
      }
    };

    var putGStatesDict = function() {
      if (Object.keys(gStates).length > 0) {
        var gStateKey;
        out("/ExtGState <<");
        for (gStateKey in gStates) {
          if (
            gStates.hasOwnProperty(gStateKey) &&
            gStates[gStateKey].objectNumber >= 0
          ) {
            out(
              "/" + gStateKey + " " + gStates[gStateKey].objectNumber + " 0 R"
            );
          }
        }

        events.publish("putGStateDict");
        out(">>");
      }
    };

    var putResourceDictionary = function(objectIds) {
      newObjectDeferredBegin(objectIds.resourcesOid, true);
      out("<<");
      out("/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]");
      putFontDict();
      putShadingPatternDict();
      putTilingPatternDict(objectIds.objectOid);
      putGStatesDict();
      putXobjectDict();
      out(">>");
      out("endobj");
    };

    var putResources = function() {
      // FormObjects, Patterns etc. might use other FormObjects/Patterns/Images
      // which means their resource dictionaries must contain the already resolved
      // object ids. For this reason we defer the serialization of the resource
      // dicts until all objects have been serialized and have object ids.
      //
      // In order to prevent cyclic dependencies (which Adobe Reader doesn't like),
      // we only put all oids that are smaller than the oid of the object the
      // resource dict belongs to. This is correct behavior, since the streams
      // may only use other objects that have already been defined and thus appear
      // earlier in their respective collection.
      // Currently, this only affects tiling patterns, but a (more) correct
      // implementation of FormObjects would also define their own resource dicts.
      var deferredResourceDictionaryIds = [];

      putFonts();
      putGStates();
      putXObjects();
      putPatterns(deferredResourceDictionaryIds);

      events.publish("putResources");
      deferredResourceDictionaryIds.forEach(putResourceDictionary);
      putResourceDictionary({
        resourcesOid: resourceDictionaryObjId,
        objectOid: Number.MAX_SAFE_INTEGER // output all objects
      });
      events.publish("postPutResources");
    };

    var putAdditionalObjects = function() {
      events.publish("putAdditionalObjects");
      for (var i = 0; i < additionalObjects.length; i++) {
        var obj = additionalObjects[i];
        newObjectDeferredBegin(obj.objId, true);
        out(obj.content);
        out("endobj");
      }
      events.publish("postPutAdditionalObjects");
    };

    var addFontToFontDictionary = function(font) {
      fontmap[font.fontName] = fontmap[font.fontName] || {};
      fontmap[font.fontName][font.fontStyle] = font.id;
    };

    var addFont = function(
      postScriptName,
      fontName,
      fontStyle,
      encoding,
      isStandardFont
    ) {
      var font = {
        id: "F" + (Object.keys(fonts).length + 1).toString(10),
        postScriptName: postScriptName,
        fontName: fontName,
        fontStyle: fontStyle,
        encoding: encoding,
        isStandardFont: isStandardFont || false,
        metadata: {}
      };
      var instance = this;

      events.publish("addFont", {
        font: font,
        instance: instance
      });

      fonts[font.id] = font;
      addFontToFontDictionary(font);
      return font.id;
    };

    var addFonts = function(arrayOfFonts) {
      for (var i = 0, l = standardFonts.length; i < l; i++) {
        var fontKey = addFont(
          arrayOfFonts[i][0],
          arrayOfFonts[i][1],
          arrayOfFonts[i][2],
          standardFonts[i][3],
          true
        );

        if (putOnlyUsedFonts === false) {
          usedFonts[fontKey] = true;
        }
        // adding aliases for standard fonts, this time matching the capitalization
        var parts = arrayOfFonts[i][0].split("-");
        addFontToFontDictionary({
          id: fontKey,
          fontName: parts[0],
          fontStyle: parts[1] || ""
        });
      }
      events.publish("addFonts", {
        fonts: fonts,
        dictionary: fontmap
      });
    };

    var SAFE = function __safeCall(fn) {
      fn.foo = function __safeCallWrapper() {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          var stack = e.stack || "";
          if (~stack.indexOf(" at ")) stack = stack.split(" at ")[1];
          var m =
            "Error in function " +
            stack.split("\n")[0].split("<")[0] +
            ": " +
            e.message;
          if (global.console) {
            global.console.error(m, e);
            if (global.alert) alert(m);
          } else {
            throw new Error(m);
          }
        }
      };
      fn.foo.bar = fn;
      return fn.foo;
    };

    var to8bitStream = function(text, flags) {
      /**
       * PDF 1.3 spec:
       * "For text strings encoded in Unicode, the first two bytes must be 254 followed by
       * 255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
       * with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
       * to be a meaningful beginning of a word or phrase.) The remainder of the
       * string consists of Unicode character codes, according to the UTF-16 encoding
       * specified in the Unicode standard, version 2.0. Commonly used Unicode values
       * are represented as 2 bytes per character, with the high-order byte appearing first
       * in the string."
       *
       * In other words, if there are chars in a string with char code above 255, we
       * recode the string to UCS2 BE - string doubles in length and BOM is prepended.
       *
       * HOWEVER!
       * Actual *content* (body) text (as opposed to strings used in document properties etc)
       * does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)
       *
       * Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
       * a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
       * fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
       * code page. There, however, all characters in the stream are treated as GIDs,
       * including BOM, which is the reason we need to skip BOM in content text (i.e. that
       * that is tied to a font).
       *
       * To signal this "special" PDFEscape / to8bitStream handling mode,
       * API.text() function sets (unless you overwrite it with manual values
       * given to API.text(.., flags) )
       * flags.autoencode = true
       * flags.noBOM = true
       *
       * ===================================================================================
       * `flags` properties relied upon:
       *   .sourceEncoding = string with encoding label.
       *                     "Unicode" by default. = encoding of the incoming text.
       *                     pass some non-existing encoding name
       *                     (ex: 'Do not touch my strings! I know what I am doing.')
       *                     to make encoding code skip the encoding step.
       *   .outputEncoding = Either valid PDF encoding name
       *                     (must be supported by jsPDF font metrics, otherwise no encoding)
       *                     or a JS object, where key = sourceCharCode, value = outputCharCode
       *                     missing keys will be treated as: sourceCharCode === outputCharCode
       *   .noBOM
       *       See comment higher above for explanation for why this is important
       *   .autoencode
       *       See comment higher above for explanation for why this is important
       */

      var i,
        l,
        sourceEncoding,
        encodingBlock,
        outputEncoding,
        newtext,
        isUnicode,
        ch,
        bch;

      flags = flags || {};
      sourceEncoding = flags.sourceEncoding || "Unicode";
      outputEncoding = flags.outputEncoding;

      // This 'encoding' section relies on font metrics format
      // attached to font objects by, among others,
      // "Willow Systems' standard_font_metrics plugin"
      // see jspdf.plugin.standard_font_metrics.js for format
      // of the font.metadata.encoding Object.
      // It should be something like
      //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
      //   .widths = {0:width, code:width, ..., 'fof':divisor}
      //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
      if (
        (flags.autoencode || outputEncoding) &&
        fonts[activeFontKey].metadata &&
        fonts[activeFontKey].metadata[sourceEncoding] &&
        fonts[activeFontKey].metadata[sourceEncoding].encoding
      ) {
        encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

        // each font has default encoding. Some have it clearly defined.
        if (!outputEncoding && fonts[activeFontKey].encoding) {
          outputEncoding = fonts[activeFontKey].encoding;
        }

        // Hmmm, the above did not work? Let's try again, in different place.
        if (!outputEncoding && encodingBlock.codePages) {
          outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
        }

        if (typeof outputEncoding === "string") {
          outputEncoding = encodingBlock[outputEncoding];
        }
        // we want output encoding to be a JS Object, where
        // key = sourceEncoding's character code and
        // value = outputEncoding's character code.
        if (outputEncoding) {
          isUnicode = false;
          newtext = [];
          for (i = 0, l = text.length; i < l; i++) {
            ch = outputEncoding[text.charCodeAt(i)];
            if (ch) {
              newtext.push(String.fromCharCode(ch));
            } else {
              newtext.push(text[i]);
            }

            // since we are looping over chars anyway, might as well
            // check for residual unicodeness
            if (newtext[i].charCodeAt(0) >> 8) {
              /* more than 255 */
              isUnicode = true;
            }
          }
          text = newtext.join("");
        }
      }

      i = text.length;
      // isUnicode may be set to false above. Hence the triple-equal to undefined
      while (isUnicode === undefined && i !== 0) {
        if (text.charCodeAt(i - 1) >> 8) {
          /* more than 255 */
          isUnicode = true;
        }
        i--;
      }
      if (!isUnicode) {
        return text;
      }

      newtext = flags.noBOM ? [] : [254, 255];
      for (i = 0, l = text.length; i < l; i++) {
        ch = text.charCodeAt(i);
        bch = ch >> 8; // divide by 256
        if (bch >> 8) {
          /* something left after dividing by 256 second time */
          throw new Error(
            "Character at position " +
              i +
              " of string '" +
              text +
              "' exceeds 16bits. Cannot be encoded into UCS-2 BE"
          );
        }
        newtext.push(bch);
        newtext.push(ch - (bch << 8));
      }
      return String.fromCharCode.apply(undefined, newtext);
    };

    var pdfEscape = (API.__private__.pdfEscape = API.pdfEscape = function(
      text,
      flags
    ) {
      /**
       * Replace '/', '(', and ')' with pdf-safe versions
       *
       * Doing to8bitStream does NOT make this PDF display unicode text. For that
       * we also need to reference a unicode font and embed it - royal pain in the rear.
       *
       * There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
       * which JavaScript Strings are happy to provide. So, while we still cannot display
       * 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
       * 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
       * is still parseable.
       * This will allow immediate support for unicode in document properties strings.
       */
      return to8bitStream(text, flags)
        .replace(/\\/g, "\\\\")
        .replace(/\(/g, "\\(")
        .replace(/\)/g, "\\)");
    });

    var beginPage = (API.__private__.beginPage = function(format) {
      pages[++page] = [];
      pagesContext[page] = {
        objId: 0,
        contentsObjId: 0,
        userUnit: Number(userUnit),
        artBox: null,
        bleedBox: null,
        cropBox: null,
        trimBox: null,
        mediaBox: {
          bottomLeftX: 0,
          bottomLeftY: 0,
          topRightX: Number(format[0]),
          topRightY: Number(format[1])
        }
      };
      _setPage(page);
      setOutputDestination(pages[currentPage]);
    });

    var _addPage = function(parmFormat, parmOrientation) {
      var dimensions, width, height;

      orientation = parmOrientation || orientation;

      if (typeof parmFormat === "string") {
        dimensions = getPageFormat(parmFormat.toLowerCase());
        if (Array.isArray(dimensions)) {
          width = dimensions[0];
          height = dimensions[1];
        }
      }

      if (Array.isArray(parmFormat)) {
        width = parmFormat[0] * scaleFactor;
        height = parmFormat[1] * scaleFactor;
      }

      if (isNaN(width)) {
        width = format[0];
        height = format[1];
      }

      if (width > 14400 || height > 14400) {
        console.warn(
          "A page in a PDF can not be wider or taller than 14400 userUnit. jsPDF limits the width/height to 14400"
        );
        width = Math.min(14400, width);
        height = Math.min(14400, height);
      }

      format = [width, height];

      switch (orientation.substr(0, 1)) {
        case "l":
          if (height > width) {
            format = [height, width];
          }
          break;
        case "p":
          if (width > height) {
            format = [height, width];
          }
          break;
      }

      beginPage(format);

      // Set line width
      setLineWidth(lineWidth);
      // Set draw color
      out(strokeColor);
      // resurrecting non-default line caps, joins
      if (lineCapID !== 0) {
        out(lineCapID + " J");
      }
      if (lineJoinID !== 0) {
        out(lineJoinID + " j");
      }
      events.publish("addPage", {
        pageNumber: page
      });
    };

    var _deletePage = function(n) {
      if (n > 0 && n <= page) {
        pages.splice(n, 1);
        pagesContext.splice(n, 1);
        page--;
        if (currentPage > page) {
          currentPage = page;
        }
        this.setPage(currentPage);
      }
    };

    var _setPage = function(n) {
      if (n > 0 && n <= page) {
        currentPage = n;
      }
    };

    var getNumberOfPages = (API.__private__.getNumberOfPages = API.getNumberOfPages = function() {
      return pages.length - 1;
    });

    /**
     * Returns a document-specific font key - a label assigned to a
     * font name + font type combination at the time the font was added
     * to the font inventory.
     *
     * Font key is used as label for the desired font for a block of text
     * to be added to the PDF document stream.
     * @private
     * @function
     * @param fontName {string} can be undefined on "falthy" to indicate "use current"
     * @param fontStyle {string} can be undefined on "falthy" to indicate "use current"
     * @returns {string} Font key.
     * @ignore
     */
    var getFont = function(fontName, fontStyle, options) {
      var key = undefined,
        fontNameLowerCase;
      options = options || {};

      fontName =
        fontName !== undefined ? fontName : fonts[activeFontKey].fontName;
      fontStyle =
        fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;
      fontNameLowerCase = fontName.toLowerCase();

      if (
        fontmap[fontNameLowerCase] !== undefined &&
        fontmap[fontNameLowerCase][fontStyle] !== undefined
      ) {
        key = fontmap[fontNameLowerCase][fontStyle];
      } else if (
        fontmap[fontName] !== undefined &&
        fontmap[fontName][fontStyle] !== undefined
      ) {
        key = fontmap[fontName][fontStyle];
      } else {
        if (options.disableWarning === false) {
          console.warn(
            "Unable to look up font label for font '" +
              fontName +
              "', '" +
              fontStyle +
              "'. Refer to getFontList() for available fonts."
          );
        }
      }

      if (!key && !options.noFallback) {
        key = fontmap["times"][fontStyle];
        if (key == null) {
          key = fontmap["times"]["normal"];
        }
      }
      return key;
    };

    var putInfo = (API.__private__.putInfo = function() {
      newObject();
      out("<<");
      out("/Producer (jsPDF " + jsPDF.version + ")");
      for (var key in documentProperties) {
        if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
          out(
            "/" +
              key.substr(0, 1).toUpperCase() +
              key.substr(1) +
              " (" +
              pdfEscape(documentProperties[key]) +
              ")"
          );
        }
      }
      out("/CreationDate (" + creationDate + ")");
      out(">>");
      out("endobj");
    });

    var putCatalog = (API.__private__.putCatalog = function(options) {
      options = options || {};
      var tmpRootDictionaryObjId =
        options.rootDictionaryObjId || rootDictionaryObjId;
      newObject();
      out("<<");
      out("/Type /Catalog");
      out("/Pages " + tmpRootDictionaryObjId + " 0 R");
      // PDF13ref Section 7.2.1
      if (!zoomMode) zoomMode = "fullwidth";
      switch (zoomMode) {
        case "fullwidth":
          out("/OpenAction [3 0 R /FitH null]");
          break;
        case "fullheight":
          out("/OpenAction [3 0 R /FitV null]");
          break;
        case "fullpage":
          out("/OpenAction [3 0 R /Fit]");
          break;
        case "original":
          out("/OpenAction [3 0 R /XYZ null null 1]");
          break;
        default:
          var pcn = "" + zoomMode;
          if (pcn.substr(pcn.length - 1) === "%")
            zoomMode = parseInt(zoomMode) / 100;
          if (typeof zoomMode === "number") {
            out("/OpenAction [3 0 R /XYZ null null " + f2(zoomMode) + "]");
          }
      }
      if (!layoutMode) layoutMode = "continuous";
      switch (layoutMode) {
        case "continuous":
          out("/PageLayout /OneColumn");
          break;
        case "single":
          out("/PageLayout /SinglePage");
          break;
        case "two":
        case "twoleft":
          out("/PageLayout /TwoColumnLeft");
          break;
        case "tworight":
          out("/PageLayout /TwoColumnRight");
          break;
      }
      if (pageMode) {
        /**
         * A name object specifying how the document should be displayed when opened:
         * UseNone      : Neither document outline nor thumbnail images visible -- DEFAULT
         * UseOutlines  : Document outline visible
         * UseThumbs    : Thumbnail images visible
         * FullScreen   : Full-screen mode, with no menu bar, window controls, or any other window visible
         */
        out("/PageMode /" + pageMode);
      }
      events.publish("putCatalog");
      out(">>");
      out("endobj");
    });

    var putTrailer = (API.__private__.putTrailer = function() {
      out("trailer");
      out("<<");
      out("/Size " + (objectNumber + 1));
      out("/Root " + objectNumber + " 0 R");
      out("/Info " + (objectNumber - 1) + " 0 R");
      out("/ID [ <" + fileId + "> <" + fileId + "> ]");
      out(">>");
    });

    var putHeader = (API.__private__.putHeader = function() {
      out("%PDF-" + pdfVersion);
      out("%\xBA\xDF\xAC\xE0");
    });

    var putXRef = (API.__private__.putXRef = function() {
      var p = "0000000000";

      out("xref");
      out("0 " + (objectNumber + 1));
      out("0000000000 65535 f");
      for (var i = 1; i <= objectNumber; i++) {
        var offset = offsets[i];
        if (typeof offset === "function") {
          out((p + offsets[i]()).slice(-10) + " 00000 n");
        } else {
          if (typeof offsets[i] !== "undefined") {
            out((p + offsets[i]).slice(-10) + " 00000 n");
          } else {
            out("0000000000 00000 n");
          }
        }
      }
    });

    var buildDocument = (API.__private__.buildDocument = function() {
      resetDocument();
      setOutputDestination(content);

      events.publish("buildDocument");

      putHeader();
      putPages();
      putAdditionalObjects();
      putResources();
      putInfo();
      putCatalog();

      var offsetOfXRef = contentLength;
      putXRef();
      putTrailer();
      out("startxref");
      out("" + offsetOfXRef);
      out("%%EOF");

      setOutputDestination(pages[currentPage]);

      return content.join("\n");
    });

    var getBlob = (API.__private__.getBlob = function(data) {
      return new Blob([getArrayBuffer(data)], {
        type: "application/pdf"
      });
    });

    /**
     * Generates the PDF document.
     *
     * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
     *
     * @param {string} type A string identifying one of the possible output types. Possible values are 'arraybuffer', 'blob', 'bloburi'/'bloburl', 'datauristring'/'dataurlstring', 'datauri'/'dataurl', 'dataurlnewwindow', 'pdfobjectnewwindow', 'pdfjsnewwindow'.
     * @param {Object} options An object providing some additional signalling to PDF generator. Possible options are 'filename'.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name output
     */
    var output = (API.output = API.__private__.output = SAFE(function output(
      type,
      options
    ) {
      options = options || {};

      if (typeof options === "string") {
        options = {
          filename: options
        };
      } else {
        options.filename = options.filename || "generated.pdf";
      }

      switch (type) {
        case undefined:
          return buildDocument();
        case "save":
          API.save(options.filename);
          break;
        case "arraybuffer":
          return getArrayBuffer(buildDocument());
        case "blob":
          return getBlob(buildDocument());
        case "bloburi":
        case "bloburl":
          // Developer is responsible of calling revokeObjectURL
          if (
            typeof global.URL !== "undefined" &&
            typeof global.URL.createObjectURL === "function"
          ) {
            return (
              (global.URL &&
                global.URL.createObjectURL(getBlob(buildDocument()))) ||
              void 0
            );
          } else {
            console.warn(
              "bloburl is not supported by your system, because URL.createObjectURL is not supported by your browser."
            );
          }
          break;
        case "datauristring":
        case "dataurlstring":
          var dataURI = "";
          var pdfDocument = buildDocument();
          try {
            dataURI = btoa(pdfDocument);
          } catch (e) {
            dataURI = btoa(unescape(encodeURIComponent(pdfDocument)));
          }
          return (
            "data:application/pdf;filename=" +
            options.filename +
            ";base64," +
            dataURI
          );
        case "pdfobjectnewwindow":
          if (Object.prototype.toString.call(global) === "[object Window]") {
            var pdfObjectUrl =
              options.pdfObjectUrl ||
              "https://cdnjs.cloudflare.com/ajax/libs/pdfobject/2.1.1/pdfobject.min.js";
            var htmlForNewWindow =
              "<html>" +
              '<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style><body><script src="' +
              pdfObjectUrl +
              '"></script><script >PDFObject.embed("' +
              this.output("dataurlstring") +
              '", ' +
              JSON.stringify(options) +
              ");</script></body></html>";
            var nW = global.open();

            if (nW !== null) {
              nW.document.write(htmlForNewWindow);
            }
            return nW;
          } else {
            throw new Error(
              "The option pdfobjectnewwindow just works in a browser-environment."
            );
          }
        case "pdfjsnewwindow":
          if (Object.prototype.toString.call(global) === "[object Window]") {
            var pdfJsUrl =
              options.pdfJsUrl || "examples/PDF.js/web/viewer.html";
            var htmlForPDFjsNewWindow =
              "<html>" +
              "<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>" +
              '<body><iframe id="pdfViewer" src="' +
              pdfJsUrl +
              '?file=" width="500px" height="400px" />' +
              "</body></html>";
            var PDFjsNewWindow = global.open();

            if (PDFjsNewWindow !== null) {
              PDFjsNewWindow.document.write(htmlForPDFjsNewWindow);
              var scope = this;
              PDFjsNewWindow.document.documentElement.querySelector(
                "#pdfViewer"
              ).onload = function() {
                PDFjsNewWindow.document.documentElement
                  .querySelector("#pdfViewer")
                  .contentWindow.PDFViewerApplication.open(
                    scope.output("bloburl")
                  );
              };
            }
            return PDFjsNewWindow;
          } else {
            throw new Error(
              "The option pdfjsnewwindow just works in a browser-environment."
            );
          }
        case "dataurlnewwindow":
          if (Object.prototype.toString.call(global) === "[object Window]") {
            var htmlForDataURLNewWindow =
              "<html>" +
              "<style>html, body { padding: 0; margin: 0; } iframe { width: 100%; height: 100%; border: 0;}  </style>" +
              "<body>" +
              '<iframe src="' +
              this.output("datauristring", options) +
              '"></iframe>' +
              "</body></html>";
            var dataURLNewWindow = global.open();
            if (dataURLNewWindow !== null) {
              dataURLNewWindow.document.write(htmlForDataURLNewWindow);
            }
            if (dataURLNewWindow || typeof safari === "undefined")
              return dataURLNewWindow;
          } else {
            throw new Error(
              "The option dataurlnewwindow just works in a browser-environment."
            );
          }
          break;
        case "datauri":
        case "dataurl":
          return (global.document.location.href = this.output(
            "datauristring",
            options
          ));
        default:
          return null;
      }
    }));

    /**
     * Used to see if a supplied hotfix was requested when the pdf instance was created.
     * @param {string} hotfixName - The name of the hotfix to check.
     * @returns {boolean}
     */
    var hasHotfix = function(hotfixName) {
      return (
        Array.isArray(hotfixes) === true && hotfixes.indexOf(hotfixName) > -1
      );
    };

    switch (unit) {
      case "pt":
        scaleFactor = 1;
        break;
      case "mm":
        scaleFactor = 72 / 25.4;
        break;
      case "cm":
        scaleFactor = 72 / 2.54;
        break;
      case "in":
        scaleFactor = 72;
        break;
      case "px":
        if (hasHotfix("px_scaling") == true) {
          scaleFactor = 72 / 96;
        } else {
          scaleFactor = 96 / 72;
        }
        break;
      case "pc":
        scaleFactor = 12;
        break;
      case "em":
        scaleFactor = 12;
        break;
      case "ex":
        scaleFactor = 6;
        break;
      default:
        throw new Error("Invalid unit: " + unit);
    }

    setCreationDate();
    setFileId();

    //---------------------------------------
    // Public API

    var getPageInfo = (API.__private__.getPageInfo = API.getPageInfo = function(
      pageNumberOneBased
    ) {
      if (isNaN(pageNumberOneBased) || pageNumberOneBased % 1 !== 0) {
        throw new Error("Invalid argument passed to jsPDF.getPageInfo");
      }
      var objId = pagesContext[pageNumberOneBased].objId;
      return {
        objId: objId,
        pageNumber: pageNumberOneBased,
        pageContext: pagesContext[pageNumberOneBased]
      };
    });

    var getPageInfoByObjId = (API.__private__.getPageInfoByObjId = function(
      objId
    ) {
      if (isNaN(objId) || objId % 1 !== 0) {
        throw new Error("Invalid argument passed to jsPDF.getPageInfoByObjId");
      }
      for (var pageNumber in pagesContext) {
        if (pagesContext[pageNumber].objId === objId) {
          break;
        }
      }
      return getPageInfo(pageNumber);
    });

    var getCurrentPageInfo = (API.__private__.getCurrentPageInfo = API.getCurrentPageInfo = function() {
      return {
        objId: pagesContext[currentPage].objId,
        pageNumber: currentPage,
        pageContext: pagesContext[currentPage]
      };
    });

    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @param format {String/Array} The format of the new page. Can be: <ul><li>a0 - a10</li><li>b0 - b10</li><li>c0 - c10</li><li>dl</li><li>letter</li><li>government-letter</li><li>legal</li><li>junior-legal</li><li>ledger</li><li>tabloid</li><li>credit-card</li></ul><br />
     * Default is "a4". If you want to use your own format just pass instead of one of the above predefined formats the size as an number-array, e.g. [595.28, 841.89]
     * @param orientation {string} Orientation of the new page. Possible values are "portrait" or "landscape" (or shortcuts "p" (Default), "l").
     * @function
     * @instance
     * @returns {jsPDF}
     *
     * @memberof jsPDF#
     * @name addPage
     */
    API.addPage = function() {
      _addPage.apply(this, arguments);
      return this;
    };
    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @function
     * @instance
     * @returns {jsPDF}
     *
     * @memberof jsPDF#
     * @name setPage
     * @param {number} page Switch the active page to the page number specified (indexed starting at 1).
     * @example
     * doc = jsPDF()
     * doc.addPage()
     * doc.addPage()
     * doc.text('I am on page 3', 10, 10)
     * doc.setPage(1)
     * doc.text('I am on page 1', 10, 10)
     */
    API.setPage = function() {
      _setPage.apply(this, arguments);
      setOutputDestination.call(this, pages[currentPage]);
      return this;
    };

    /**
     * @name insertPage
     * @memberof jsPDF#
     *
     * @function
     * @instance
     * @param {Object} beforePage
     * @returns {jsPDF}
     */
    API.insertPage = function(beforePage) {
      this.addPage();
      this.movePage(currentPage, beforePage);
      return this;
    };

    /**
     * @name movePage
     * @memberof jsPDF#
     * @function
     * @instance
     * @param {number} targetPage
     * @param {number} beforePage
     * @returns {jsPDF}
     */
    API.movePage = function(targetPage, beforePage) {
      var tmpPages, tmpPagesContext;
      if (targetPage > beforePage) {
        tmpPages = pages[targetPage];
        tmpPagesContext = pagesContext[targetPage];
        for (var i = targetPage; i > beforePage; i--) {
          pages[i] = pages[i - 1];
          pagesContext[i] = pagesContext[i - 1];
        }
        pages[beforePage] = tmpPages;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      } else if (targetPage < beforePage) {
        tmpPages = pages[targetPage];
        tmpPagesContext = pagesContext[targetPage];
        for (var j = targetPage; j < beforePage; j++) {
          pages[j] = pages[j + 1];
          pagesContext[j] = pagesContext[j + 1];
        }
        pages[beforePage] = tmpPages;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      }
      return this;
    };

    /**
     * Deletes a page from the PDF.
     * @name deletePage
     * @memberof jsPDF#
     * @function
     * @param {number} targetPage
     * @instance
     * @returns {jsPDF}
     */
    API.deletePage = function() {
      _deletePage.apply(this, arguments);
      return this;
    };

    /**
     * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
     *
     * @function
     * @instance
     * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page.
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page.
     * @param {Object} [options] - Collection of settings signaling how the text must be encoded.
     * @param {string} [options.align=left] - The alignment of the text, possible values: left, center, right, justify.
     * @param {string} [options.baseline=alphabetic] - Sets text baseline used when drawing the text, possible values: alphabetic, ideographic, bottom, top, middle, hanging
     * @param {string} [options.angle=0] - Rotate the text clockwise or counterclockwise. Expects the angle in degree.
     * @param {string} [options.rotationDirection=1] - Direction of the rotation. 0 = clockwise, 1 = counterclockwise.
     * @param {string} [options.charSpace=0] - The space between each letter.
     * @param {string} [options.lineHeightFactor=1.15] - The lineheight of each line.
     * @param {string} [options.flags] - Flags for to8bitStream.
     * @param {string} [options.flags.noBOM=true] - Don't add BOM to Unicode-text.
     * @param {string} [options.flags.autoencode=true] - Autoencode the Text.
     * @param {string} [options.maxWidth=0] - Split the text by given width, 0 = no split.
     * @param {string} [options.renderingMode=fill] - Set how the text should be rendered, possible values: fill, stroke, fillThenStroke, invisible, fillAndAddForClipping, strokeAndAddPathForClipping, fillThenStrokeAndAddToPathForClipping, addToPathForClipping.
     * @param {boolean} [options.isInputVisual] - Option for the BidiEngine
     * @param {boolean} [options.isOutputVisual] - Option for the BidiEngine
     * @param {boolean} [options.isInputRtl] - Option for the BidiEngine
     * @param {boolean} [options.isOutputRtl] - Option for the BidiEngine
     * @param {boolean} [options.isSymmetricSwapping] - Option for the BidiEngine
     * @param {number|Matrix} transform If transform is a number the text will be rotated by this value around the anchor set by x and y.
     *
     * If it is a Matrix, this matrix gets directly applied to the text, which allows shearing
     * effects etc.; the x and y offsets are then applied AFTER the coordinate system has been established by this
     * matrix. This means passing a rotation matrix that is equivalent to some rotation angle will in general yield a
     * DIFFERENT result. A matrix is only allowed in "advanced" API mode.
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name text
     */
    API.__private__.text = API.text = function(text, x, y, options, transform) {
      /*
       * Inserts something like this into PDF
       *   BT
       *    /F1 16 Tf  % Font name + size
       *    16 TL % How many units down for next line in multiline text
       *    0 g % color
       *    28.35 813.54 Td % position
       *    (line one) Tj
       *    T* (line two) Tj
       *    T* (line three) Tj
       *   ET
       */
      options = options || {};
      var scope = options.scope || this;
      var payload, da, angle, align, charSpace, maxWidth, flags;

      // Pre-August-2012 the order of arguments was function(x, y, text, flags)
      // in effort to make all calls have similar signature like
      //   function(data, coordinates... , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (
        typeof text === "number" &&
        typeof x === "number" &&
        (typeof y === "string" || Array.isArray(y))
      ) {
        var tmp = y;
        y = x;
        x = text;
        text = tmp;
      }

      var transformationMatrix;

      if (arguments[3] instanceof Matrix === false) {
        flags = arguments[3];
        angle = arguments[4];
        align = arguments[5];

        if (typeof flags !== "object" || flags === null) {
          if (typeof angle === "string") {
            align = angle;
            angle = null;
          }
          if (typeof flags === "string") {
            align = flags;
            flags = null;
          }
          if (typeof flags === "number") {
            angle = flags;
            flags = null;
          }
          options = {
            flags: flags,
            angle: angle,
            align: align
          };
        }
      } else {
        advancedApiModeTrap(
          "The transform parameter of text() with a Matrix value"
        );
        transformationMatrix = transform;
      }

      if (
        isNaN(x) ||
        isNaN(y) ||
        typeof text === "undefined" ||
        text === null
      ) {
        throw new Error("Invalid arguments passed to jsPDF.text");
      }

      if (text.length === 0) {
        return scope;
      }

      var xtra = "";
      var isHex = false;
      var lineHeight =
        typeof options.lineHeightFactor === "number"
          ? options.lineHeightFactor
          : lineHeightFactor;
      var scaleFactor = scope.internal.scaleFactor;

      function ESC(s) {
        s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
        return pdfEscape(s, flags);
      }

      function transformTextToSpecialArray(text) {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
          curDa = sa.shift();
          if (typeof curDa === "string") {
            da.push(curDa);
          } else {
            if (
              Array.isArray(text) &&
              (curDa.length === 1 ||
                (curDa[1] === undefined && curDa[2] === undefined))
            ) {
              da.push(curDa[0]);
            } else {
              da.push([curDa[0], curDa[1], curDa[2]]);
            }
          }
        }
        return da;
      }

      function processTextByFunction(text, processingFunction) {
        var result;
        if (typeof text === "string") {
          result = processingFunction(text)[0];
        } else if (Array.isArray(text)) {
          //we don't want to destroy original text array, so cloning it
          var sa = text.concat();
          var da = [];
          var len = sa.length;
          var curDa;
          var tmpResult;
          //we do array.join('text that must not be PDFescaped")
          //thus, pdfEscape each component separately
          while (len--) {
            curDa = sa.shift();
            if (typeof curDa === "string") {
              da.push(processingFunction(curDa)[0]);
            } else if (Array.isArray(curDa) && typeof curDa[0] === "string") {
              tmpResult = processingFunction(curDa[0], curDa[1], curDa[2]);
              da.push([tmpResult[0], tmpResult[1], tmpResult[2]]);
            }
          }
          result = da;
        }
        return result;
      }

      //Check if text is of type String
      var textIsOfTypeString = false;
      var tmpTextIsOfTypeString = true;

      if (typeof text === "string") {
        textIsOfTypeString = true;
      } else if (Array.isArray(text)) {
        //we don't want to destroy original text array, so cloning it
        var sa = text.concat();
        da = [];
        var len = sa.length;
        var curDa;
        //we do array.join('text that must not be PDFescaped")
        //thus, pdfEscape each component separately
        while (len--) {
          curDa = sa.shift();
          if (
            typeof curDa !== "string" ||
            (Array.isArray(curDa) && typeof curDa[0] !== "string")
          ) {
            tmpTextIsOfTypeString = false;
          }
        }
        textIsOfTypeString = tmpTextIsOfTypeString;
      }
      if (textIsOfTypeString === false) {
        throw new Error(
          'Type of text must be string or Array. "' +
            text +
            '" is not recognized.'
        );
      }

      //If there are any newlines in text, we assume
      //the user wanted to print multiple lines, so break the
      //text up into an array. If the text is already an array,
      //we assume the user knows what they are doing.
      //Convert text into an array anyway to simplify
      //later code.

      if (typeof text === "string") {
        if (text.match(/[\r?\n]/)) {
          text = text.split(/\r\n|\r|\n/g);
        } else {
          text = [text];
        }
      }

      //baseline
      var height = activeFontSize / scope.internal.scaleFactor;
      var descent = height * (lineHeightFactor - 1);
      switch (options.baseline) {
        case "bottom":
          y -= descent;
          break;
        case "top":
          y += height - descent;
          break;
        case "hanging":
          y += height - 2 * descent;
          break;
        case "middle":
          y += height / 2 - descent;
          break;
        case "ideographic":
        case "alphabetic":
        default:
          // do nothing, everything is fine
          break;
      }

      //multiline
      maxWidth = options.maxWidth || 0;

      if (maxWidth > 0) {
        if (typeof text === "string") {
          text = scope.splitTextToSize(text, maxWidth);
        } else if (Object.prototype.toString.call(text) === "[object Array]") {
          text = scope.splitTextToSize(text.join(" "), maxWidth);
        }
      }

      //creating Payload-Object to make text byRef
      payload = {
        text: text,
        x: x,
        y: y,
        options: options,
        mutex: {
          pdfEscape: pdfEscape,
          activeFontKey: activeFontKey,
          fonts: fonts,
          activeFontSize: activeFontSize
        }
      };
      events.publish("preProcessText", payload);

      text = payload.text;
      options = payload.options;

      //angle
      angle = options.angle;

      if (
        transformationMatrix instanceof Matrix === false &&
        angle &&
        typeof angle === "number"
      ) {
        angle *= Math.PI / 180;

        if (options.rotationDirection === 0) {
          angle = -angle;
        }

        if (apiMode === ApiMode.ADVANCED) {
          angle = -angle;
        }

        var c = Math.cos(angle);
        var s = Math.sin(angle);
        transformationMatrix = new Matrix(c, s, -s, c, 0, 0);
      } else if (angle && angle instanceof Matrix) {
        transformationMatrix = angle;
      }

      if (apiMode === ApiMode.ADVANCED && !transformationMatrix) {
        transformationMatrix = identityMatrix;
      }

      //charSpace

      charSpace = options.charSpace || activeCharSpace;

      if (typeof charSpace !== "undefined") {
        xtra += hpf(scale(charSpace)) + " Tc\n";
        this.setCharSpace(this.getCharSpace() || 0);
      }

      //lang

      var lang = options.lang;

      if (lang) {
        //    xtra += "/Lang (" + lang +")\n";
      }

      //renderingMode
      var renderingMode = -1;
      var parmRenderingMode =
        typeof options.renderingMode !== "undefined"
          ? options.renderingMode
          : options.stroke;
      var pageContext = scope.internal.getCurrentPageInfo().pageContext;

      switch (parmRenderingMode) {
        case 0:
        case false:
        case "fill":
          renderingMode = 0;
          break;
        case 1:
        case true:
        case "stroke":
          renderingMode = 1;
          break;
        case 2:
        case "fillThenStroke":
          renderingMode = 2;
          break;
        case 3:
        case "invisible":
          renderingMode = 3;
          break;
        case 4:
        case "fillAndAddForClipping":
          renderingMode = 4;
          break;
        case 5:
        case "strokeAndAddPathForClipping":
          renderingMode = 5;
          break;
        case 6:
        case "fillThenStrokeAndAddToPathForClipping":
          renderingMode = 6;
          break;
        case 7:
        case "addToPathForClipping":
          renderingMode = 7;
          break;
      }

      var usedRenderingMode =
        typeof pageContext.usedRenderingMode !== "undefined"
          ? pageContext.usedRenderingMode
          : -1;

      //if the coder wrote it explicitly to use a specific
      //renderingMode, then use it
      if (renderingMode !== -1) {
        xtra += renderingMode + " Tr\n";
        //otherwise check if we used the rendering Mode already
        //if so then set the rendering Mode...
      } else if (usedRenderingMode !== -1) {
        xtra += "0 Tr\n";
      }

      if (renderingMode !== -1) {
        pageContext.usedRenderingMode = renderingMode;
      }

      //align
      align = options.align || "left";
      var leading = activeFontSize * lineHeight;
      var pageWidth = scope.internal.pageSize.getWidth();
      var activeFont = fonts[activeFontKey];
      charSpace = options.charSpace || activeCharSpace;
      maxWidth = options.maxWidth || 0;

      var lineWidths;
      flags = {};
      var wordSpacingPerLine = [];

      if (Object.prototype.toString.call(text) === "[object Array]") {
        da = transformTextToSpecialArray(text);
        var newY;
        if (align !== "left") {
          lineWidths = da.map(function(v) {
            return (
              (scope.getStringUnitWidth(v, {
                font: activeFont,
                charSpace: charSpace,
                fontSize: activeFontSize,
                doKerning: false
              }) *
                activeFontSize) /
              scaleFactor
            );
          });
        }
        //The first line uses the "main" Td setting,
        //and the subsequent lines are offset by the
        //previous line's x coordinate.
        var prevWidth = 0;
        var newX;
        if (align === "right") {
          //The passed in x coordinate defines the
          //rightmost point of the text.
          x -= lineWidths[0];
          text = [];
          len = da.length;
          for (var i = 0; i < len; i++) {
            if (i === 0) {
              newX = getHorizontalCoordinate(x);
              newY = getVerticalCoordinate(y);
            } else {
              newX = scale(prevWidth - lineWidths[i]);
              newY = -leading;
            }
            text.push([da[i], newX, newY]);
            prevWidth = lineWidths[i];
          }
        } else if (align === "center") {
          //The passed in x coordinate defines
          //the center point.
          x -= lineWidths[0] / 2;
          text = [];
          len = da.length;
          for (var j = 0; j < len; j++) {
            if (j === 0) {
              newX = getHorizontalCoordinate(x);
              newY = getVerticalCoordinate(y);
            } else {
              newX = scale((prevWidth - lineWidths[j]) / 2);
              newY = -leading;
            }
            text.push([da[j], newX, newY]);
            prevWidth = lineWidths[j];
          }
        } else if (align === "left") {
          text = [];
          len = da.length;
          for (var h = 0; h < len; h++) {
            text.push(da[h]);
          }
        } else if (align === "justify") {
          text = [];
          len = da.length;
          maxWidth = maxWidth !== 0 ? maxWidth : pageWidth;

          for (var l = 0; l < len; l++) {
            newY = l === 0 ? getVerticalCoordinate(y) : -leading;
            newX = l === 0 ? getHorizontalCoordinate(x) : 0;
            if (l < len - 1) {
              wordSpacingPerLine.push(
                hpf(
                  scale(
                    (maxWidth - lineWidths[l]) / (da[l].split(" ").length - 1)
                  )
                )
              );
            }
            text.push([da[l], newX, newY]);
          }
        } else {
          throw new Error(
            'Unrecognized alignment option, use "left", "center", "right" or "justify".'
          );
        }
      }

      //R2L
      var doReversing = typeof options.R2L === "boolean" ? options.R2L : R2L;
      if (doReversing === true) {
        text = processTextByFunction(text, function(text, posX, posY) {
          return [
            text
              .split("")
              .reverse()
              .join(""),
            posX,
            posY
          ];
        });
      }

      //creating Payload-Object to make text byRef
      payload = {
        text: text,
        x: x,
        y: y,
        options: options,
        mutex: {
          pdfEscape: pdfEscape,
          activeFontKey: activeFontKey,
          fonts: fonts,
          activeFontSize: activeFontSize
        }
      };
      events.publish("postProcessText", payload);

      text = payload.text;
      isHex = payload.mutex.isHex || false;

      //Escaping
      var activeFontEncoding = fonts[activeFontKey].encoding;

      if (
        activeFontEncoding === "WinAnsiEncoding" ||
        activeFontEncoding === "StandardEncoding"
      ) {
        text = processTextByFunction(text, function(text, posX, posY) {
          return [ESC(text), posX, posY];
        });
      }

      da = transformTextToSpecialArray(text);

      text = [];
      var STRING = 0;
      var ARRAY = 1;
      var variant = Array.isArray(da[0]) ? ARRAY : STRING;
      var posX;
      var posY;
      var content;
      var wordSpacing = "";

      var generatePosition = function(
        parmPosX,
        parmPosY,
        parmTransformationMatrix
      ) {
        var position = "";
        if (parmTransformationMatrix instanceof Matrix) {
          // It is kind of more intuitive to apply a plain rotation around the text anchor set by x and y
          // but when the user supplies an arbitrary transformation matrix, the x and y offsets should be applied
          // in the coordinate system established by this matrix
          if (typeof options.angle === "number") {
            parmTransformationMatrix = matrixMult(
              parmTransformationMatrix,
              new Matrix(1, 0, 0, 1, parmPosX, parmPosY)
            );
          } else {
            parmTransformationMatrix = matrixMult(
              new Matrix(1, 0, 0, 1, parmPosX, parmPosY),
              parmTransformationMatrix
            );
          }

          if (apiMode === ApiMode.ADVANCED) {
            parmTransformationMatrix = matrixMult(
              new Matrix(1, 0, 0, -1, 0, 0),
              parmTransformationMatrix
            );
          }

          position = parmTransformationMatrix.join(" ") + " Tm\n";
        } else {
          position = hpf(parmPosX) + " " + hpf(parmPosY) + " Td\n";
        }
        return position;
      };

      for (var lineIndex = 0; lineIndex < da.length; lineIndex++) {
        wordSpacing = "";

        switch (variant) {
          case ARRAY:
            content =
              (isHex ? "<" : "(") + da[lineIndex][0] + (isHex ? ">" : ")");
            posX = parseFloat(da[lineIndex][1]);
            posY = parseFloat(da[lineIndex][2]);
            break;
          case STRING:
            content = (isHex ? "<" : "(") + da[lineIndex] + (isHex ? ">" : ")");
            posX = getHorizontalCoordinate(x);
            posY = getVerticalCoordinate(y);
            break;
        }

        if (
          typeof wordSpacingPerLine !== "undefined" &&
          typeof wordSpacingPerLine[lineIndex] !== "undefined"
        ) {
          wordSpacing = wordSpacingPerLine[lineIndex] + " Tw\n";
        }

        if (lineIndex === 0) {
          text.push(
            wordSpacing +
              generatePosition(posX, posY, transformationMatrix) +
              content
          );
        } else if (variant === STRING) {
          text.push(wordSpacing + content);
        } else if (variant === ARRAY) {
          text.push(
            wordSpacing +
              generatePosition(posX, posY, transformationMatrix) +
              content
          );
        }
      }

      text = variant === STRING ? text.join(" Tj\nT* ") : text.join(" Tj\n");
      text += " Tj\n";

      var result = "BT\n/";
      result += activeFontKey + " " + activeFontSize + " Tf\n"; // font face, style, size
      result += hpf(activeFontSize * lineHeight) + " TL\n"; // line spacing
      result += textColor + "\n";
      result += xtra;
      result += text;
      result += "ET";

      out(result);
      usedFonts[activeFontKey] = true;
      return scope;
    };

    /**
     * Letter spacing method to print text with gaps
     *
     * @function
     * @instance
     * @param {String|Array} text String to be added to the page.
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} spacing Spacing (in units declared at inception)
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name lstext
     * @deprecated We'll be removing this function. It doesn't take character width into account.
     */
    API.__private__.lstext = API.lstext = function(text, x, y, charSpace) {
      return this.text(text, x, y, {
        charSpace: charSpace
      });
    };

    // PDF supports these path painting and clip path operators:
    //
    // S - stroke
    // s - close/stroke
    // f (F) - fill non-zero
    // f* - fill evenodd
    // B - fill stroke nonzero
    // B* - fill stroke evenodd
    // b - close fill stroke nonzero
    // b* - close fill stroke evenodd
    // n - nothing (consume path)
    // W - clip nonzero
    // W* - clip evenodd
    //
    // In order to keep the API small, we omit the close-and-fill/stroke operators and provide a separate close()
    // method.
    /**
     *
     * @name clip
     * @function
     * @instance
     * @param {string} rule Only possible value is 'evenodd'
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @description All .clip() after calling drawing ops with a style argument of null.
     */
    var clip = (API.__private__.clip = API.clip = function(rule) {
      // Call .clip() after calling drawing ops with a style argument of null
      // W is the PDF clipping op
      if ("evenodd" === rule) {
        out("W*");
      } else {
        out("W");
      }
      return this;
    });

    /**
     * @name clipEvenOdd
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @description Modify the current clip path by intersecting it with the current path using the even-odd rule. Note
     * that this will NOT consume the current path. In order to only use this path for clipping call
     * {@link API.discardPath} afterwards.
     */
    API.clipEvenOdd = function() {
      return clip("evenodd");
    };

    /**
     * This fixes the previous function clip(). Perhaps the 'stroke path' hack was due to the missing 'n' instruction?
     * We introduce the fixed version so as to not break API.
     * @param fillRule
     * @deprecated
     * @ignore
     */
    API.__private__.clip_fixed = API.clip_fixed = function(rule) {
      return API.clip(rule);
    };

    /**
     * Consumes the current path without any effect. Mainly used in combination with {@link clip} or
     * {@link clipEvenOdd}. The PDF "n" operator.
     * @name discardPath
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     */
    API.__private__.discardPath = API.discardPath = function() {
      out("n");
      return this;
    };

    var isValidStyle = (API.__private__.isValidStyle = function(style) {
      var validStyleVariants = [
        undefined,
        null,
        "S",
        "D",
        "F",
        "DF",
        "FD",
        "f",
        "f*",
        "B",
        "B*",
        "n"
      ];
      var result = false;
      if (validStyleVariants.indexOf(style) !== -1) {
        result = true;
      }
      return result;
    });

    API.__private__.setDefaultPathOperation = API.setDefaultPathOperation = function(
      operator
    ) {
      if (isValidStyle(operator)) {
        defaultPathOperation = operator;
      }
      return this;
    };

    var getStyle = (API.__private__.getStyle = API.getStyle = function(style) {
      // see path-painting operators in PDF spec
      var op = defaultPathOperation; // stroke

      switch (style) {
        case "D":
        case "S":
          op = "S"; // stroke
          break;
        case "F":
          op = "f"; // fill
          break;
        case "FD":
        case "DF":
          op = "B";
          break;
        case "f":
        case "f*":
        case "B":
        case "B*":
          /*
               Allow direct use of these PDF path-painting operators:
               - f    fill using nonzero winding number rule
               - f*    fill using even-odd rule
               - B    fill then stroke with fill using non-zero winding number rule
               - B*    fill then stroke with fill using even-odd rule
               */
          op = style;
          break;
      }
      return op;
    });

    /**
     * Close the current path. The PDF "h" operator.
     * @name close
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     */
    var close = (API.close = function() {
      out("h");
      return this;
    });

    /**
     * Stroke the path. The PDF "S" operator.
     * @name stroke
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     */
    API.stroke = function() {
      out("S");
      return this;
    };

    /**
     * Fill the current path using the nonzero winding number rule. If a pattern is provided, the path will be filled
     * with this pattern, otherwise with the current fill color. Equivalent to the PDF "f" operator.
     * @name fill
     * @function
     * @instance
     * @param {PatternData=} pattern If provided the path will be filled with this pattern
     * @returns {jsPDF}
     * @memberof jsPDF#
     */
    API.fill = function(pattern) {
      fillWithOptionalPattern("f", pattern);
      return this;
    };

    /**
     * Fill the current path using the even-odd rule. The PDF f* operator.
     * @see API.fill
     * @name fillEvenOdd
     * @function
     * @instance
     * @param {PatternData=} pattern If provided the path will be filled with this pattern
     * @returns {jsPDF}
     * @memberof jsPDF#
     */
    API.fillEvenOdd = function(pattern) {
      fillWithOptionalPattern("f*", pattern);
      return this;
    };

    /**
     * Fill using the nonzero winding number rule and then stroke the current Path. The PDF "B" operator.
     * @see API.fill
     * @name fillStroke
     * @function
     * @instance
     * @param {PatternData=} pattern If provided the path will be stroked with this pattern
     * @returns {jsPDF}
     * @memberof jsPDF#
     */
    API.fillStroke = function(pattern) {
      fillWithOptionalPattern("B", pattern);
      return this;
    };

    /**
     * Fill using the even-odd rule and then stroke the current Path. The PDF "B" operator.
     * @see API.fill
     * @name fillStrokeEvenOdd
     * @function
     * @instance
     * @param {PatternData=} pattern If provided the path will be fill-stroked with this pattern
     * @returns {jsPDF}
     * @memberof jsPDF#
     */
    API.fillStrokeEvenOdd = function(pattern) {
      fillWithOptionalPattern("B*", pattern);
      return this;
    };

    var fillWithOptionalPattern = function(style, pattern) {
      if (typeof pattern === "object") {
        fillWithPattern(pattern, style);
      } else {
        out(style);
      }
    };

    var putStyle = function(style, patternKey, patternData) {
      if (
        style === null ||
        (apiMode === ApiMode.ADVANCED && style === undefined)
      ) {
        return;
      }

      style = getStyle(style);

      // stroking / filling / both the path
      if (!patternKey) {
        out(style);
        return;
      }

      if (!patternData) {
        patternData = { matrix: identityMatrix };
      }

      if (patternData instanceof Matrix) {
        patternData = { matrix: patternData };
      }

      patternData.key = patternKey;

      patternData || (patternData = identityMatrix);

      fillWithPattern(patternData, style);
    };

    var fillWithPattern = function(patternData, style) {
      var patternId = patternMap[patternData.key];
      var pattern = patterns[patternId];

      if (pattern instanceof API.ShadingPattern) {
        out("q");

        out(clipRuleFromStyle(style));

        if (pattern.gState) {
          API.setGState(pattern.gState);
        }
        out(patternData.matrix.toString() + " cm");
        out("/" + patternId + " sh");
        out("Q");
      } else if (pattern instanceof API.TilingPattern) {
        // pdf draws patterns starting at the bottom left corner and they are not affected by the global transformation,
        // so we must flip them
        var matrix = new Matrix(1, 0, 0, -1, 0, getPageHeight());

        if (patternData.matrix) {
          matrix = matrix.multiply(patternData.matrix || identityMatrix);
          // we cannot apply a matrix to the pattern on use so we must abuse the pattern matrix and create new instances
          // for each use
          patternId = pattern.createClone(
            patternData.key,
            patternData.boundingBox,
            patternData.xStep,
            patternData.yStep,
            matrix
          ).id;
        }

        out("q");
        out("/Pattern cs");
        out("/" + patternId + " scn");

        if (pattern.gState) {
          API.setGState(pattern.gState);
        }

        out(style);
        out("Q");
      }
    };

    var clipRuleFromStyle = function(style) {
      switch (style) {
        case "f":
        case "F":
          return "W n";
        case "f*":
          return "W* n";
        case "B":
          return "W S";
        case "B*":
          return "W* S";

        // these two are for compatibility reasons (in the past, calling any primitive method with a shading pattern
        // and "n"/"S" as style would still fill/fill and stroke the path)
        case "S":
          return "W S";
        case "n":
          return "W n";
      }
    };

    /**
     * Begin a new subpath by moving the current point to coordinates (x, y). The PDF "m" operator.
     * @param {number} x
     * @param {number} y
     * @name moveTo
     * @function
     * @instance
     * @memberof jsPDF#
     * @returns {jsPDF}
     */
    var moveTo = (API.moveTo = function(x, y) {
      out(hpf(scale(x)) + " " + hpf(transformScaleY(y)) + " m");
      return this;
    });

    /**
     * Append a straight line segment from the current point to the point (x, y). The PDF "l" operator.
     * @param {number} x
     * @param {number} y
     * @memberof jsPDF#
     * @name lineTo
     * @function
     * @instance
     * @memberof jsPDF#
     * @returns {jsPDF}
     */
    var lineTo = (API.lineTo = function(x, y) {
      out(hpf(scale(x)) + " " + hpf(transformScaleY(y)) + " l");
      return this;
    });

    /**
     * Append a cubic Bézier curve to the current path. The curve shall extend from the current point to the point
     * (x3, y3), using (x1, y1) and (x2, y2) as Bézier control points. The new current point shall be (x3, x3).
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @memberof jsPDF#
     * @name curveTo
     * @function
     * @instance
     * @memberof jsPDF#
     * @returns {jsPDF}
     */
    var curveTo = (API.curveTo = function(x1, y1, x2, y2, x3, y3) {
      out(
        [
          hpf(scale(x1)),
          hpf(transformScaleY(y1)),
          hpf(scale(x2)),
          hpf(transformScaleY(y2)),
          hpf(scale(x3)),
          hpf(transformScaleY(y3)),
          "c"
        ].join(" ")
      );
      return this;
    });

    /**
     * Draw a line on the current page.
     *
     * @name line
     * @function
     * @instance
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {string} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument. default: 'S'
     * @returns {jsPDF}
     * @memberof jsPDF#
     */
    API.__private__.line = API.line = function(x1, y1, x2, y2, style) {
      if (
        isNaN(x1) ||
        isNaN(y1) ||
        isNaN(x2) ||
        isNaN(y2) ||
        !isValidStyle(style)
      ) {
        throw new Error("Invalid arguments passed to jsPDF.line");
      }
      if (apiMode === ApiMode.COMPAT) {
        return this.lines([[x2 - x1, y2 - y1]], x1, y1, [1, 1], style || "S");
      } else {
        return this.lines([[x2 - x1, y2 - y1]], x1, y1, [1, 1]).stroke();
      }
    };

    /**
     * @typedef {Object} PatternData
     * {Matrix|undefined} matrix
     * {Number|undefined} xStep
     * {Number|undefined} yStep
     * {Array.<Number>|undefined} boundingBox
     */

    /**
     * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
     * All data points in `lines` are relative to last line origin.
     * `x`, `y` become x1,y1 for first line / curve in the set.
     * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
     * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
     *
     * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, [1,1], 'F', false) // line, line, bezier curve, line
     * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
     * @param {string=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {Boolean=} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the path. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name lines
     */
    API.__private__.lines = API.lines = function(
      lines,
      x,
      y,
      scale,
      style,
      closed,
      patternKey,
      patternData
    ) {
      var scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4, tmp;

      // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
      // in effort to make all calls have similar signature like
      //   function(content, coordinateX, coordinateY , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof lines === "number") {
        tmp = y;
        y = x;
        x = lines;
        lines = tmp;
      }

      scale = scale || [1, 1];
      closed = closed || false;

      if (
        isNaN(x) ||
        isNaN(y) ||
        !Array.isArray(lines) ||
        !Array.isArray(scale) ||
        !isValidStyle(style) ||
        typeof closed !== "boolean"
      ) {
        throw new Error("Invalid arguments passed to jsPDF.lines");
      }

      // starting point
      moveTo(x, y);

      scalex = scale[0];
      scaley = scale[1];
      l = lines.length;
      //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
      //, x3, y3 // bezier only. In page default measurement "units", *after* scaling
      // ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
      x4 = x; // last / ending point = starting point for first item.
      y4 = y; // last / ending point = starting point for first item.

      for (i = 0; i < l; i++) {
        leg = lines[i];
        if (leg.length === 2) {
          // simple line
          x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
          y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
          lineTo(x4, y4);
        } else {
          // bezier curve
          x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
          y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
          x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
          y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
          x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
          y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
          curveTo(x2, y2, x3, y3, x4, y4);
        }
      }

      if (closed) {
        close();
      }

      putStyle(style, patternKey, patternData);
      return this;
    };

    /**
     * Similar to {@link API.lines} but all coordinates are interpreted as absolute coordinates instead of relative.
     * @param {Array<Object>} lines An array of {op: operator, c: coordinates} object, where op is one of "m" (move to), "l" (line to)
     * "c" (cubic bezier curve) and "h" (close (sub)path)). c is an array of coordinates. "m" and "l" expect two, "c"
     * six and "h" an empty array (or undefined).
     * @param {String=} style  The style. Deprecated!
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the path. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name path
     */
    API.path = function(lines, style, patternKey, patternData) {
      for (var i = 0; i < lines.length; i++) {
        var leg = lines[i];
        var coords = leg.c;
        switch (leg.op) {
          case "m":
            moveTo(coords[0], coords[1]);
            break;
          case "l":
            lineTo(coords[0], coords[1]);
            break;
          case "c":
            curveTo.apply(this, coords);
            break;
          case "h":
            close();
            break;
        }
      }

      putStyle(style, patternKey, patternData);
      return this;
    };

    /**
     * Adds a rectangle to PDF.
     *
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} w Width (in units declared at inception of PDF document)
     * @param {number} h Height (in units declared at inception of PDF document)
     * @param {string=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name rect
     */
    API.__private__.rect = API.rect = function(
      x,
      y,
      w,
      h,
      style,
      patternKey,
      patternData
    ) {
      if (
        isNaN(x) ||
        isNaN(y) ||
        isNaN(w) ||
        isNaN(h) ||
        !isValidStyle(style)
      ) {
        throw new Error("Invalid arguments passed to jsPDF.rect");
      }
      if (apiMode === ApiMode.COMPAT) {
        h = -h;
      }

      out(
        [
          hpf(scale(x)),
          hpf(transformScaleY(y)),
          hpf(scale(w)),
          hpf(scale(h)),
          "re"
        ].join(" ")
      );

      putStyle(style, patternKey, patternData);
      return this;
    };

    /**
     * Adds a triangle to PDF.
     *
     * @param {number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {string=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name triangle
     */
    API.__private__.triangle = API.triangle = function(
      x1,
      y1,
      x2,
      y2,
      x3,
      y3,
      style,
      patternKey,
      patternData
    ) {
      if (
        isNaN(x1) ||
        isNaN(y1) ||
        isNaN(x2) ||
        isNaN(y2) ||
        isNaN(x3) ||
        isNaN(y3) ||
        !isValidStyle(style)
      ) {
        throw new Error("Invalid arguments passed to jsPDF.triangle");
      }
      this.lines(
        [
          [x2 - x1, y2 - y1], // vector to point 2
          [x3 - x2, y3 - y2], // vector to point 3
          [x1 - x3, y1 - y3] // closing vector back to point 1
        ],
        x1,
        y1, // start of path
        [1, 1],
        style,
        true,
        patternKey,
        patternData
      );
      return this;
    };

    /**
     * Adds a rectangle with rounded corners to PDF.
     *
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} w Width (in units declared at inception of PDF document)
     * @param {number} h Height (in units declared at inception of PDF document)
     * @param {number} rx Radius along x axis (in units declared at inception of PDF document)
     * @param {number} ry Radius along y axis (in units declared at inception of PDF document)
     * @param {string=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name roundedRect
     */
    API.__private__.roundedRect = API.roundedRect = function(
      x,
      y,
      w,
      h,
      rx,
      ry,
      style,
      patternKey,
      patternData
    ) {
      if (
        isNaN(x) ||
        isNaN(y) ||
        isNaN(w) ||
        isNaN(h) ||
        isNaN(rx) ||
        isNaN(ry) ||
        !isValidStyle(style)
      ) {
        throw new Error("Invalid arguments passed to jsPDF.roundedRect");
      }
      var MyArc = (4 / 3) * (Math.SQRT2 - 1);

      rx = Math.min(rx, w * 0.5);
      ry = Math.min(ry, h * 0.5);

      this.lines(
        [
          [w - 2 * rx, 0],
          [rx * MyArc, 0, rx, ry - ry * MyArc, rx, ry],
          [0, h - 2 * ry],
          [0, ry * MyArc, -(rx * MyArc), ry, -rx, ry],
          [-w + 2 * rx, 0],
          [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry],
          [0, -h + 2 * ry],
          [0, -(ry * MyArc), rx * MyArc, -ry, rx, -ry]
        ],
        x + rx,
        y, // start of path
        [1, 1],
        style,
        true,
        patternKey,
        patternData
      );
      return this;
    };

    /**
     * Adds an ellipse to PDF.
     *
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} rx Radius along x axis (in units declared at inception of PDF document)
     * @param {number} ry Radius along y axis (in units declared at inception of PDF document)
     * @param {string=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name ellipse
     */
    API.__private__.ellipse = API.ellipse = function(
      x,
      y,
      rx,
      ry,
      style,
      patternKey,
      patternData
    ) {
      if (
        isNaN(x) ||
        isNaN(y) ||
        isNaN(rx) ||
        isNaN(ry) ||
        !isValidStyle(style)
      ) {
        throw new Error("Invalid arguments passed to jsPDF.ellipse");
      }
      var lx = (4 / 3) * (Math.SQRT2 - 1) * rx,
        ly = (4 / 3) * (Math.SQRT2 - 1) * ry;

      moveTo(x + rx, y);
      curveTo(x + rx, y - ly, x + lx, y - ry, x, y - ry);
      curveTo(x - lx, y - ry, x - rx, y - ly, x - rx, y);
      curveTo(x - rx, y + ly, x - lx, y + ry, x, y + ry);
      curveTo(x + lx, y + ry, x + rx, y + ly, x + rx, y);

      putStyle(style, patternKey, patternData);
      return this;
    };

    /**
     * Adds an circle to PDF.
     *
     * @param {number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {number} r Radius (in units declared at inception of PDF document)
     * @param {string=} style A string specifying the painting style or null. Valid styles include:
     * 'S' [default] - stroke,
     * 'F' - fill,
     * and 'DF' (or 'FD') -  fill then stroke.
     * In "compat" API mode, a null value postpones setting the style so that a shape may be composed using multiple
     * method calls. The last drawing method call used to define the shape should not have a null style argument.
     *
     * In "advanced" API mode this parameter is deprecated.
     * @param {String=} patternKey The pattern key for the pattern that should be used to fill the primitive. Deprecated!
     * @param {(Matrix|PatternData)=} patternData The matrix that transforms the pattern into user space, or an object that
     * will modify the pattern on use. Deprecated!
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name circle
     */
    API.__private__.circle = API.circle = function(
      x,
      y,
      r,
      style,
      patternKey,
      patternData
    ) {
      if (isNaN(x) || isNaN(y) || isNaN(r) || !isValidStyle(style)) {
        throw new Error("Invalid arguments passed to jsPDF.circle");
      }
      return this.ellipse(x, y, r, r, style, patternKey, patternData);
    };

    /**
     * Sets text font face, variant for upcoming text elements.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {string} fontName Font name or family. Example: "times".
     * @param {string} fontStyle Font style or variant. Example: "italic".
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setFont
     */
    API.setFont = function(fontName, fontStyle) {
      activeFontKey = getFont(fontName, fontStyle, {
        disableWarning: false
      });
      return this;
    };

    /**
     * Gets text font face, variant for upcoming text elements.
     *
     * @function
     * @instance
     * @returns {Object}
     * @memberof jsPDF#
     * @name getFont
     */
    var getFontEntry = (API.__private__.getFont = API.getFont = function() {
      return fonts[getFont.apply(API, arguments)];
    });

    /**
     * Switches font style or variant for upcoming text elements,
     * while keeping the font face or family same.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {string} style Font style or variant. Example: "italic".
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @deprecated
     * @name setFontStyle
     */
    API.setFontStyle = API.setFontType = function(style) {
      activeFontKey = getFont(undefined, style);
      // if font is not found, the above line blows up and we never go further
      return this;
    };

    /**
     * Returns an object - a tree of fontName to fontStyle relationships available to
     * active PDF document.
     *
     * @public
     * @function
     * @instance
     * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
     * @memberof jsPDF#
     * @name getFontList
     */
    API.__private__.getFontList = API.getFontList = function() {
      var list = {},
        fontName,
        fontStyle;

      for (fontName in fontmap) {
        if (fontmap.hasOwnProperty(fontName)) {
          list[fontName] = [];
          for (fontStyle in fontmap[fontName]) {
            if (fontmap[fontName].hasOwnProperty(fontStyle)) {
              list[fontName].push(fontStyle);
            }
          }
        }
      }
      return list;
    };

    /**
     * Add a custom font to the current instance.
     *
     * @property {string} postScriptName PDF specification full name for the font.
     * @property {string} id PDF-document-instance-specific label assinged to the font.
     * @property {string} fontStyle Style of the Font.
     * @property {Object} encoding Encoding_name-to-Font_metrics_object mapping.
     * @function
     * @instance
     * @memberof jsPDF#
     * @name addFont
     * @returns {string} fontId
     */
    API.addFont = function(postScriptName, fontName, fontStyle, encoding) {
      encoding = encoding || "Identity-H";
      return addFont.call(this, postScriptName, fontName, fontStyle, encoding);
    };

    var lineWidth = options.lineWidth || 0.200025; // 2mm
    /**
     * Sets line width for upcoming lines.
     *
     * @param {number} width Line width (in units declared at inception of PDF document).
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setLineWidth
     */
    var setLineWidth = (API.__private__.setLineWidth = API.setLineWidth = function(
      width
    ) {
      out(hpf(scale(width)) + " w");
      return this;
    });

    /**
     * Sets the dash pattern for upcoming lines.
     *
     * To reset the settings simply call the method without any parameters.
     * @param {Array<number>} dashArray An array containing 0-2 numbers. The first number sets the length of the
     * dashes, the second number the length of the gaps. If the second number is missing, the gaps are considered
     * to be as long as the dashes. An empty array means solid, unbroken lines.
     * @param {number} dashPhase The phase lines start with.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setLineDashPattern
     */
    API.__private__.setLineDash = jsPDF.API.setLineDash = jsPDF.API.setLineDashPattern = function(
      dashArray,
      dashPhase
    ) {
      dashArray = dashArray || [];
      dashPhase = dashPhase || 0;

      if (isNaN(dashPhase) || !Array.isArray(dashArray)) {
        throw new Error("Invalid arguments passed to jsPDF.setLineDash");
      }

      dashArray = dashArray
        .map(function(x) {
          return hpf(scale(x));
        })
        .join(" ");
      dashPhase = hpf(scale(dashPhase));

      out("[" + dashArray + "] " + dashPhase + " d");
      return this;
    };

    var lineHeightFactor;

    var getLineHeight = (API.__private__.getLineHeight = API.getLineHeight = function() {
      return activeFontSize * lineHeightFactor;
    });

    API.__private__.getLineHeight = API.getLineHeight = function() {
      return activeFontSize * lineHeightFactor;
    };

    /**
     * Sets the LineHeightFactor of proportion.
     *
     * @param {number} value LineHeightFactor value. Default: 1.15.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setLineHeightFactor
     */
    var setLineHeightFactor = (API.__private__.setLineHeightFactor = API.setLineHeightFactor = function(
      value
    ) {
      value = value || 1.15;
      if (typeof value === "number") {
        lineHeightFactor = value;
      }
      return this;
    });

    /**
     * Gets the LineHeightFactor, default: 1.15.
     *
     * @function
     * @instance
     * @returns {number} lineHeightFactor
     * @memberof jsPDF#
     * @name getLineHeightFactor
     */
    var getLineHeightFactor = (API.__private__.getLineHeightFactor = API.getLineHeightFactor = function() {
      return lineHeightFactor;
    });

    setLineHeightFactor(options.lineHeight);

    var getHorizontalCoordinate = (API.__private__.getHorizontalCoordinate = function(
      value
    ) {
      return scale(value);
    });

    var getVerticalCoordinate = (API.__private__.getVerticalCoordinate = function(
      value
    ) {
      if (apiMode === ApiMode.ADVANCED) {
        return value;
      } else {
        var pageHeight =
          pagesContext[currentPage].mediaBox.topRightY -
          pagesContext[currentPage].mediaBox.bottomLeftY;
        return pageHeight - scale(value);
      }
    });

    var getHorizontalCoordinateString = (API.__private__.getHorizontalCoordinateString = API.getHorizontalCoordinateString = function(
      value
    ) {
      return hpf(getHorizontalCoordinate(value));
    });

    var getVerticalCoordinateString = (API.__private__.getVerticalCoordinateString = API.getVerticalCoordinateString = function(
      value
    ) {
      return hpf(getVerticalCoordinate(value));
    });

    var strokeColor = options.strokeColor || "0 G";

    /**
     *  Gets the stroke color for upcoming elements.
     *
     * @function
     * @instance
     * @returns {string} colorAsHex
     * @memberof jsPDF#
     * @name getDrawColor
     */
    API.__private__.getStrokeColor = API.getDrawColor = function() {
      return decodeColorString(strokeColor);
    };

    /**
     * Sets the stroke color for upcoming elements.
     *
     * Depending on the number of arguments given, Gray, RGB, or CMYK
     * color space is implied.
     *
     * When only ch1 is given, "Gray" color space is implied and it
     * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
     * if values are communicated as String types, or in range from 0 (black)
     * to 255 (white) if communicated as Number type.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
     * value must be in the range from 0.00 (minimum intensity) to to 1.00
     * (max intensity) if values are communicated as String types, or
     * from 0 (min intensity) to to 255 (max intensity) if values are communicated
     * as Number types.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
     * value must be a in the range from 0.00 (0% concentration) to to
     * 1.00 (100% concentration)
     *
     * Because JavaScript treats fixed point numbers badly (rounds to
     * floating point nearest to binary representation) it is highly advised to
     * communicate the fractional numbers as String types, not JavaScript Number type.
     *
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
     * @param {Number} ch2 Color channel value.
     * @param {Number} ch3 Color channel value.
     * @param {Number} ch4 Color channel value.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setDrawColor
     */
    API.__private__.setStrokeColor = API.setDrawColor = function(
      ch1,
      ch2,
      ch3,
      ch4
    ) {
      var options = {
        ch1: ch1,
        ch2: ch2,
        ch3: ch3,
        ch4: ch4,
        pdfColorType: "draw",
        precision: 2
      };

      strokeColor = encodeColorString(options);
      out(strokeColor);
      return this;
    };

    var fillColor = options.fillColor || "0 g";

    /**
     * Gets the fill color for upcoming elements.
     *
     * @function
     * @instance
     * @returns {string} colorAsHex
     * @memberof jsPDF#
     * @name getFillColor
     */
    API.__private__.getFillColor = API.getFillColor = function() {
      return decodeColorString(fillColor);
    };

    /**
     * Sets the fill color for upcoming elements.
     *
     * Depending on the number of arguments given, Gray, RGB, or CMYK
     * color space is implied.
     *
     * When only ch1 is given, "Gray" color space is implied and it
     * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
     * if values are communicated as String types, or in range from 0 (black)
     * to 255 (white) if communicated as Number type.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
     * value must be in the range from 0.00 (minimum intensity) to to 1.00
     * (max intensity) if values are communicated as String types, or
     * from 0 (min intensity) to to 255 (max intensity) if values are communicated
     * as Number types.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
     * value must be a in the range from 0.00 (0% concentration) to to
     * 1.00 (100% concentration)
     *
     * Because JavaScript treats fixed point numbers badly (rounds to
     * floating point nearest to binary representation) it is highly advised to
     * communicate the fractional numbers as String types, not JavaScript Number type.
     *
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
     * @param {Number} ch2 Color channel value.
     * @param {Number} ch3 Color channel value.
     * @param {Number} ch4 Color channel value.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setFillColor
     */
    API.__private__.setFillColor = API.setFillColor = function(
      ch1,
      ch2,
      ch3,
      ch4
    ) {
      var options = {
        ch1: ch1,
        ch2: ch2,
        ch3: ch3,
        ch4: ch4,
        pdfColorType: "fill",
        precision: 2
      };

      fillColor = encodeColorString(options);
      out(fillColor);
      return this;
    };

    var textColor = options.textColor || "0 g";
    /**
     * Gets the text color for upcoming elements.
     *
     * @function
     * @instance
     * @returns {string} colorAsHex
     * @memberof jsPDF#
     * @name getTextColor
     */
    var getTextColor = (API.__private__.getTextColor = API.getTextColor = function() {
      return decodeColorString(textColor);
    });
    /**
     * Sets the text color for upcoming elements.
     *
     * Depending on the number of arguments given, Gray, RGB, or CMYK
     * color space is implied.
     *
     * When only ch1 is given, "Gray" color space is implied and it
     * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
     * if values are communicated as String types, or in range from 0 (black)
     * to 255 (white) if communicated as Number type.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
     * value must be in the range from 0.00 (minimum intensity) to to 1.00
     * (max intensity) if values are communicated as String types, or
     * from 0 (min intensity) to to 255 (max intensity) if values are communicated
     * as Number types.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
     * value must be a in the range from 0.00 (0% concentration) to to
     * 1.00 (100% concentration)
     *
     * Because JavaScript treats fixed point numbers badly (rounds to
     * floating point nearest to binary representation) it is highly advised to
     * communicate the fractional numbers as String types, not JavaScript Number type.
     *
     * @param {Number|String} ch1 Color channel value or {string} ch1 color value in hexadecimal, example: '#FFFFFF'.
     * @param {Number} ch2 Color channel value.
     * @param {Number} ch3 Color channel value.
     * @param {Number} ch4 Color channel value.
     *
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setTextColor
     */
    API.__private__.setTextColor = API.setTextColor = function(
      ch1,
      ch2,
      ch3,
      ch4
    ) {
      var options = {
        ch1: ch1,
        ch2: ch2,
        ch3: ch3,
        ch4: ch4,
        pdfColorType: "text",
        precision: 3
      };
      textColor = encodeColorString(options);

      return this;
    };

    var activeCharSpace = options.charSpace;

    /**
     * Get global value of CharSpace.
     *
     * @function
     * @instance
     * @returns {number} charSpace
     * @memberof jsPDF#
     * @name getCharSpace
     */
    var getCharSpace = (API.__private__.getCharSpace = API.getCharSpace = function() {
      return parseFloat(activeCharSpace || 0);
    });

    /**
     * Set global value of CharSpace.
     *
     * @param {number} charSpace
     * @function
     * @instance
     * @returns {jsPDF} jsPDF-instance
     * @memberof jsPDF#
     * @name setCharSpace
     */
    API.__private__.setCharSpace = API.setCharSpace = function(charSpace) {
      if (isNaN(charSpace)) {
        throw new Error("Invalid argument passed to jsPDF.setCharSpace");
      }
      activeCharSpace = charSpace;
      return this;
    };

    var lineCapID = 0;
    /**
     * Is an Object providing a mapping from human-readable to
     * integer flag values designating the varieties of line cap
     * and join styles.
     *
     * @memberof jsPDF#
     * @name CapJoinStyles
     */
    API.CapJoinStyles = {
      0: 0,
      butt: 0,
      but: 0,
      miter: 0,
      1: 1,
      round: 1,
      rounded: 1,
      circle: 1,
      2: 2,
      projecting: 2,
      project: 2,
      square: 2,
      bevel: 2
    };

    /**
     * Sets the line cap styles.
     * See {jsPDF.CapJoinStyles} for variants.
     *
     * @param {String|Number} style A string or number identifying the type of line cap.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setLineCap
     */
    API.__private__.setLineCap = API.setLineCap = function(style) {
      var id = API.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error(
          "Line cap style of '" +
            style +
            "' is not recognized. See or extend .CapJoinStyles property for valid styles"
        );
      }
      lineCapID = id;
      out(id + " J");

      return this;
    };

    var lineJoinID = 0;
    /**
     * Sets the line join styles.
     * See {jsPDF.CapJoinStyles} for variants.
     *
     * @param {String|Number} style A string or number identifying the type of line join.
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setLineJoin
     */
    API.__private__.setLineJoin = API.setLineJoin = function(style) {
      var id = API.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error(
          "Line join style of '" +
            style +
            "' is not recognized. See or extend .CapJoinStyles property for valid styles"
        );
      }
      lineJoinID = id;
      out(id + " j");

      return this;
    };

    var miterLimit;
    /**
     * Sets the miterLimit property, which effects the maximum miter length.
     *
     * @param {number} length The length of the miter
     * @function
     * @instance
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setLineMiterLimit
     */
    API.__private__.setLineMiterLimit = API.__private__.setMiterLimit = API.setLineMiterLimit = API.setMiterLimit = function(
      length
    ) {
      length = length || 0;
      if (isNaN(length)) {
        throw new Error("Invalid argument passed to jsPDF.setLineMiterLimit");
      }
      out(hpf(scale(length)) + " M");

      return this;
    };

    /**
     * An object representing a pdf graphics state.
     * @class GState
     */

    /**
     *
     * @param parameters A parameter object that contains all properties this graphics state wants to set.
     * Supported are: opacity, stroke-opacity
     * @constructor
     */
    API.GState = function GState(parameters) {
      if (!(this instanceof GState)) {
        return new GState(parameters);
      }

      /**
       * @name GState#opacity
       * @type {any}
       */
      /**
       * @name GState#stroke-opacity
       * @type {any}
       */
      var supported = "opacity,stroke-opacity".split(",");
      for (var p in parameters) {
        if (parameters.hasOwnProperty(p) && supported.indexOf(p) >= 0) {
          this[p] = parameters[p];
        }
      }
      /**
       * @name GState#id
       * @type {string}
       */
      this.id = ""; // set by addGState()
      /**
       * @name GState#objectNumber
       * @type {number}
       */
      this.objectNumber = -1; // will be set by putGState()
    };

    API.GState.prototype.equals = function equals(other) {
      var ignore = "id,objectNumber,equals";
      var p;
      if (!other || typeof other !== typeof this) return false;
      var count = 0;
      for (p in this) {
        if (ignore.indexOf(p) >= 0) continue;
        if (this.hasOwnProperty(p) && !other.hasOwnProperty(p)) return false;
        if (this[p] !== other[p]) return false;
        count++;
      }
      for (p in other) {
        if (other.hasOwnProperty(p) && ignore.indexOf(p) < 0) count--;
      }
      return count === 0;
    };

    /**
     * Sets a either previously added {@link GState} (via {@link addGState}) or a new {@link GState}.
     * @param {String|GState} gState If type is string, a previously added GState is used, if type is GState
     * it will be added before use.
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setGState
     */
    API.setGState = function(gState) {
      if (typeof gState === "string") {
        gState = gStates[gStatesMap[gState]];
      } else {
        gState = addGState(null, gState);
      }

      if (!gState.equals(activeGState)) {
        out("/" + gState.id + " gs");
        activeGState = gState;
      }
    };

    /**
     * Adds a new Graphics State. Duplicates are automatically eliminated.
     * @param {String} key Might also be null, if no later reference to this gState is needed
     * @param {Object} gState The gState object
     */
    var addGState = function(key, gState) {
      // only add it if it is not already present (the keys provided by the user must be unique!)
      if (key && gStatesMap[key]) return;
      var duplicate = false;
      for (var s in gStates) {
        if (gStates.hasOwnProperty(s)) {
          if (gStates[s].equals(gState)) {
            duplicate = true;
            break;
          }
        }
      }

      if (duplicate) {
        gState = gStates[s];
      } else {
        var gStateKey = "GS" + (Object.keys(gStates).length + 1).toString(10);
        gStates[gStateKey] = gState;
        gState.id = gStateKey;
      }

      // several user keys may point to the same GState object
      key && (gStatesMap[key] = gState.id);

      events.publish("addGState", gState);

      return gState;
    };

    /**
     * Adds a new {@link GState} for later use. See {@link setGState}.
     * @param {String} key
     * @param {GState} gState
     * @function
     * @instance
     * @returns {jsPDF}
     *
     * @memberof jsPDF#
     * @name addGState
     */
    API.addGState = function(key, gState) {
      addGState(key, gState);
      return this;
    };

    /**
     * Saves the current graphics state ("pushes it on the stack"). It can be restored by {@link restoreGraphicsState}
     * later. Here, the general pdf graphics state is meant, also including the current transformation matrix,
     * fill and stroke colors etc.
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name saveGraphicsState
     */
    API.saveGraphicsState = function() {
      out("q");
      // as we cannot set font key and size independently we must keep track of both
      fontStateStack.push({
        key: activeFontKey,
        size: activeFontSize,
        color: textColor
      });
      return this;
    };

    /**
     * Restores a previously saved graphics state saved by {@link saveGraphicsState} ("pops the stack").
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name restoreGraphicsState
     */
    API.restoreGraphicsState = function() {
      out("Q");

      // restore previous font state
      var fontState = fontStateStack.pop();
      activeFontKey = fontState.key;
      activeFontSize = fontState.size;
      textColor = fontState.color;

      activeGState = null;

      return this;
    };

    /**
     * Appends this matrix to the left of all previously applied matrices.
     *
     * @param {Matrix} matrix
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name setCurrentTransformationMatrix
     */
    API.setCurrentTransformationMatrix = function(matrix) {
      out(matrix.toString() + " cm");
      return this;
    };

    /**
     * Inserts a debug comment into the generated pdf.
     * @function
     * @instance
     * @param {String} text
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name comment
     */
    API.comment = function(text) {
      out("#" + text);
      return this;
    };

    /**
     * Point
     */
    var Point = function(x, y) {
      var _x = x || 0;
      Object.defineProperty(this, "x", {
        enumerable: true,
        get: function() {
          return _x;
        },
        set: function(value) {
          if (!isNaN(value)) {
            _x = parseFloat(value);
          }
        }
      });

      var _y = y || 0;
      Object.defineProperty(this, "y", {
        enumerable: true,
        get: function() {
          return _y;
        },
        set: function(value) {
          if (!isNaN(value)) {
            _y = parseFloat(value);
          }
        }
      });

      var _type = "pt";
      Object.defineProperty(this, "type", {
        enumerable: true,
        get: function() {
          return _type;
        },
        set: function(value) {
          _type = value.toString();
        }
      });
      return this;
    };

    /**
     * Rectangle
     */
    var Rectangle = function(x, y, w, h) {
      Point.call(this, x, y);
      this.type = "rect";

      var _w = w || 0;
      Object.defineProperty(this, "w", {
        enumerable: true,
        get: function() {
          return _w;
        },
        set: function(value) {
          if (!isNaN(value)) {
            _w = parseFloat(value);
          }
        }
      });

      var _h = h || 0;
      Object.defineProperty(this, "h", {
        enumerable: true,
        get: function() {
          return _h;
        },
        set: function(value) {
          if (!isNaN(value)) {
            _h = parseFloat(value);
          }
        }
      });

      return this;
    };

    /**
     * FormObject/RenderTarget
     */

    var RenderTarget = function() {
      this.page = page;
      this.currentPage = currentPage;
      this.pages = pages.slice(0);
      this.pagesContext = pagesContext.slice(0);
      this.x = pageX;
      this.y = pageY;
      this.matrix = pageMatrix;
      this.width = getPageWidth(currentPage);
      this.height = getPageHeight(currentPage);
      this.outputDestination = outputDestination;

      this.id = ""; // set by endFormObject()
      this.objectNumber = -1; // will be set by putXObject()
    };

    RenderTarget.prototype.restore = function() {
      page = this.page;
      currentPage = this.currentPage;
      pagesContext = this.pagesContext;
      pages = this.pages;
      pageX = this.x;
      pageY = this.y;
      pageMatrix = this.matrix;
      setPageWidth(currentPage, this.width);
      setPageHeight(currentPage, this.height);
      outputDestination = this.outputDestination;
    };

    var beginNewRenderTarget = function(x, y, width, height, matrix) {
      // save current state
      renderTargetStack.push(new RenderTarget());

      // clear pages
      page = currentPage = 0;
      pages = [];
      pageX = x;
      pageY = y;

      pageMatrix = matrix;

      beginPage([width, height]);
    };

    var endFormObject = function(key) {
      // only add it if it is not already present (the keys provided by the user must be unique!)
      if (renderTargetMap[key]) return;

      // save the created xObject
      var newXObject = new RenderTarget();

      var xObjectId =
        "Xo" + (Object.keys(renderTargets).length + 1).toString(10);
      newXObject.id = xObjectId;

      renderTargetMap[key] = xObjectId;
      renderTargets[xObjectId] = newXObject;

      events.publish("addFormObject", newXObject);

      // restore state from stack
      renderTargetStack.pop().restore();
    };

    /**
     * Starts a new pdf form object, which means that all consequent draw calls target a new independent object
     * until {@link endFormObject} is called. The created object can be referenced and drawn later using
     * {@link doFormObject}. Nested form objects are possible.
     * x, y, width, height set the bounding box that is used to clip the content.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {Matrix} matrix The matrix that will be applied to convert the form objects coordinate system to
     * the parent's.
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name beginFormObject
     */
    API.beginFormObject = function(x, y, width, height, matrix) {
      // The user can set the output target to a new form object. Nested form objects are possible.
      // Currently, they use the resource dictionary of the surrounding stream. This should be changed, as
      // the PDF-Spec states:
      // "In PDF 1.2 and later versions, form XObjects may be independent of the content streams in which
      // they appear, and this is strongly recommended although not requiredIn PDF 1.2 and later versions,
      // form XObjects may be independent of the content streams in which they appear, and this is strongly
      // recommended although not required"
      beginNewRenderTarget(x, y, width, height, matrix);
      return this;
    };

    /**
     * Completes and saves the form object.
     * @param {String} key The key by which this form object can be referenced.
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name endFormObject
     */
    API.endFormObject = function(key) {
      endFormObject(key);
      return this;
    };

    /**
     * Draws the specified form object by referencing to the respective pdf XObject created with
     * {@link API.beginFormObject} and {@link endFormObject}.
     * The location is determined by matrix.
     *
     * @param {String} key The key to the form object.
     * @param {Matrix} matrix The matrix applied before drawing the form object.
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name doFormObject
     */
    API.doFormObject = function(key, matrix) {
      var xObject = renderTargets[renderTargetMap[key]];
      out("q");
      out(matrix.toString() + " cm");
      out("/" + xObject.id + " Do");
      out("Q");
      return this;
    };

    /**
     * Returns the form object specified by key.
     * @param key {String}
     * @returns {{x: number, y: number, width: number, height: number, matrix: Matrix}}
     * @function
     * @returns {jsPDF}
     * @memberof jsPDF#
     * @name getFormObject
     */
    API.getFormObject = function(key) {
      var xObject = renderTargets[renderTargetMap[key]];
      return {
        x: xObject.x,
        y: xObject.y,
        width: xObject.width,
        height: xObject.height,
        matrix: xObject.matrix
      };
    };

    /**
     * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf').
     * Uses FileSaver.js-method saveAs.
     *
     * @memberof jsPDF#
     * @name save
     * @function
     * @instance
     * @param  {string} filename The filename including extension.
     * @param  {Object} options An Object with additional options, possible options: 'returnPromise'.
     * @returns {jsPDF} jsPDF-instance     */
    API.save = function(filename, options) {
      filename = filename || "generated.pdf";

      options = options || {};
      options.returnPromise = options.returnPromise || false;

      if (options.returnPromise === false) {
        saveAs(getBlob(buildDocument()), filename);
        if (typeof saveAs.unload === "function") {
          if (global.setTimeout) {
            setTimeout(saveAs.unload, 911);
          }
        }
      } else {
        return new Promise(function(resolve, reject) {
          try {
            var result = saveAs(getBlob(buildDocument()), filename);
            if (typeof saveAs.unload === "function") {
              if (global.setTimeout) {
                setTimeout(saveAs.unload, 911);
              }
            }
            resolve(result);
          } catch (e) {
            reject(e.message);
          }
        });
      }
    };

    // applying plugins (more methods) ON TOP of built-in API.
    // this is intentional as we allow plugins to override
    // built-ins
    for (var plugin in jsPDF.API) {
      if (jsPDF.API.hasOwnProperty(plugin)) {
        if (plugin === "events" && jsPDF.API.events.length) {
          (function(events, newEvents) {
            // jsPDF.API.events is a JS Array of Arrays
            // where each Array is a pair of event name, handler
            // Events were added by plugins to the jsPDF instantiator.
            // These are always added to the new instance and some ran
            // during instantiation.
            var eventname, handler_and_args, i;

            for (i = newEvents.length - 1; i !== -1; i--) {
              // subscribe takes 3 args: 'topic', function, runonce_flag
              // if undefined, runonce is false.
              // users can attach callback directly,
              // or they can attach an array with [callback, runonce_flag]
              // that's what the "apply" magic is for below.
              eventname = newEvents[i][0];
              handler_and_args = newEvents[i][1];
              events.subscribe.apply(
                events,
                [eventname].concat(
                  typeof handler_and_args === "function"
                    ? [handler_and_args]
                    : handler_and_args
                )
              );
            }
          })(events, jsPDF.API.events);
        } else {
          API[plugin] = jsPDF.API[plugin];
        }
      }
    }

    var getPageWidth = (API.getPageWidth = function(pageNumber) {
      pageNumber = pageNumber || currentPage;
      return (
        (pagesContext[pageNumber].mediaBox.topRightX -
          pagesContext[pageNumber].mediaBox.bottomLeftX) /
        scaleFactor
      );
    });

    var setPageWidth = (API.setPageWidth = function(pageNumber, value) {
      pagesContext[pageNumber].mediaBox.topRightX =
        value * scaleFactor + pagesContext[pageNumber].mediaBox.bottomLeftX;
    });

    var getPageHeight = (API.getPageHeight = function(pageNumber) {
      pageNumber = pageNumber || currentPage;
      return (
        (pagesContext[pageNumber].mediaBox.topRightY -
          pagesContext[pageNumber].mediaBox.bottomLeftY) /
        scaleFactor
      );
    });

    var setPageHeight = (API.setPageHeight = function(pageNumber, value) {
      pagesContext[pageNumber].mediaBox.topRightY =
        value * scaleFactor + pagesContext[pageNumber].mediaBox.bottomLeftY;
    });

    /**
     * Object exposing internal API to plugins
     * @public
     * @ignore
     */
    API.internal = {
      pdfEscape: pdfEscape,
      getStyle: getStyle,
      getFont: getFontEntry,
      getFontSize: getFontSize,
      getCharSpace: getCharSpace,
      getTextColor: getTextColor,
      getLineHeight: getLineHeight,
      getLineHeightFactor: getLineHeightFactor,
      write: write,
      getHorizontalCoordinate: getHorizontalCoordinate,
      getVerticalCoordinate: getVerticalCoordinate,
      getCoordinateString: getHorizontalCoordinateString,
      getVerticalCoordinateString: getVerticalCoordinateString,
      collections: {},
      newObject: newObject,
      newAdditionalObject: newAdditionalObject,
      newObjectDeferred: newObjectDeferred,
      newObjectDeferredBegin: newObjectDeferredBegin,
      getFilters: getFilters,
      putStream: putStream,
      events: events,
      scaleFactor: scaleFactor,
      pageSize: {
        getWidth: function() {
          return getPageWidth(currentPage);
        },
        setWidth: function(value) {
          setPageWidth(currentPage, value);
        },
        getHeight: function() {
          return getPageHeight(currentPage);
        },
        setHeight: function(value) {
          setPageHeight(currentPage, value);
        }
      },
      output: output,
      getNumberOfPages: getNumberOfPages,
      pages: pages,
      out: out,
      f2: f2,
      f3: f3,
      getPageInfo: getPageInfo,
      getPageInfoByObjId: getPageInfoByObjId,
      getCurrentPageInfo: getCurrentPageInfo,
      getPDFVersion: getPdfVersion,
      Point: Point,
      Rectangle: Rectangle,
      Matrix: Matrix,
      hasHotfix: hasHotfix //Expose the hasHotfix check so plugins can also check them.
    };

    Object.defineProperty(API.internal.pageSize, "width", {
      get: function() {
        return getPageWidth(currentPage);
      },
      set: function(value) {
        setPageWidth(currentPage, value);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(API.internal.pageSize, "height", {
      get: function() {
        return getPageHeight(currentPage);
      },
      set: function(value) {
        setPageHeight(currentPage, value);
      },
      enumerable: true,
      configurable: true
    });

    //////////////////////////////////////////////////////
    // continuing initialization of jsPDF Document object
    //////////////////////////////////////////////////////
    // Add the first page automatically
    addFonts(standardFonts);
    activeFontKey = "F1";
    _addPage(format, orientation);

    events.publish("initialized");
    return API;
  }

  /**
   * jsPDF.API is a STATIC property of jsPDF class.
   * jsPDF.API is an object you can add methods and properties to.
   * The methods / properties you add will show up in new jsPDF objects.
   *
   * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
   * callbacks to this object. These will be reassigned to all new instances of jsPDF.
   *
   * @static
   * @public
   * @memberof jsPDF#
   * @name API
   *
   * @example
   * jsPDF.API.mymethod = function(){
   *   // 'this' will be ref to internal API object. see jsPDF source
   *   // , so you can refer to built-in methods like so:
   *   //     this.line(....)
   *   //     this.text(....)
   * }
   * var pdfdoc = new jsPDF()
   * pdfdoc.mymethod() // <- !!!!!!
   */
  jsPDF.API = {
    events: []
  };
  /**
   * The version of jsPDF.
   * @name version
   * @type {string}
   * @memberof jsPDF#
   */
  jsPDF.version = "0.0.0";

  if (typeof define === "function" && define.amd) {
    define(function() {
      return jsPDF;
    });
  } else if (typeof module !== "undefined" && module.exports) {
    module.exports = jsPDF;
    module.exports.jsPDF = jsPDF;
  } else {
    global.jsPDF = jsPDF;
  }
  return jsPDF;
})(
  (typeof self !== "undefined" && self) ||
    (typeof window !== "undefined" && window) ||
    (typeof global !== "undefined" && global) ||
    Function('return typeof this === "object" && this.content')() ||
    Function("return this")()
);
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window



/*!
 * html2canvas 1.0.0-rc.5 <https://html2canvas.hertzen.com>
 * Copyright (c) 2020 Niklas von Hertzen <https://hertzen.com>
 * Released under MIT License
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.html2canvas = factory());
}(this, function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var Bounds = /** @class */ (function () {
        function Bounds(x, y, w, h) {
            this.left = x;
            this.top = y;
            this.width = w;
            this.height = h;
        }
        Bounds.prototype.add = function (x, y, w, h) {
            return new Bounds(this.left + x, this.top + y, this.width + w, this.height + h);
        };
        Bounds.fromClientRect = function (clientRect) {
            return new Bounds(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
        };
        return Bounds;
    }());
    var parseBounds = function (node) {
        return Bounds.fromClientRect(node.getBoundingClientRect());
    };
    var parseDocumentSize = function (document) {
        var body = document.body;
        var documentElement = document.documentElement;
        if (!body || !documentElement) {
            throw new Error("Unable to get document size");
        }
        var width = Math.max(Math.max(body.scrollWidth, documentElement.scrollWidth), Math.max(body.offsetWidth, documentElement.offsetWidth), Math.max(body.clientWidth, documentElement.clientWidth));
        var height = Math.max(Math.max(body.scrollHeight, documentElement.scrollHeight), Math.max(body.offsetHeight, documentElement.offsetHeight), Math.max(body.clientHeight, documentElement.clientHeight));
        return new Bounds(0, 0, width, height);
    };

    /*
     * css-line-break 1.1.1 <https://github.com/niklasvh/css-line-break#readme>
     * Copyright (c) 2019 Niklas von Hertzen <https://hertzen.com>
     * Released under MIT License
     */
    var toCodePoints = function (str) {
        var codePoints = [];
        var i = 0;
        var length = str.length;
        while (i < length) {
            var value = str.charCodeAt(i++);
            if (value >= 0xd800 && value <= 0xdbff && i < length) {
                var extra = str.charCodeAt(i++);
                if ((extra & 0xfc00) === 0xdc00) {
                    codePoints.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
                }
                else {
                    codePoints.push(value);
                    i--;
                }
            }
            else {
                codePoints.push(value);
            }
        }
        return codePoints;
    };
    var fromCodePoint = function () {
        var codePoints = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            codePoints[_i] = arguments[_i];
        }
        if (String.fromCodePoint) {
            return String.fromCodePoint.apply(String, codePoints);
        }
        var length = codePoints.length;
        if (!length) {
            return '';
        }
        var codeUnits = [];
        var index = -1;
        var result = '';
        while (++index < length) {
            var codePoint = codePoints[index];
            if (codePoint <= 0xffff) {
                codeUnits.push(codePoint);
            }
            else {
                codePoint -= 0x10000;
                codeUnits.push((codePoint >> 10) + 0xd800, codePoint % 0x400 + 0xdc00);
            }
            if (index + 1 === length || codeUnits.length > 0x4000) {
                result += String.fromCharCode.apply(String, codeUnits);
                codeUnits.length = 0;
            }
        }
        return result;
    };
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    // Use a lookup table to find the index.
    var lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
    for (var i = 0; i < chars.length; i++) {
        lookup[chars.charCodeAt(i)] = i;
    }
    var decode = function (base64) {
        var bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
        if (base64[base64.length - 1] === '=') {
            bufferLength--;
            if (base64[base64.length - 2] === '=') {
                bufferLength--;
            }
        }
        var buffer = typeof ArrayBuffer !== 'undefined' &&
            typeof Uint8Array !== 'undefined' &&
            typeof Uint8Array.prototype.slice !== 'undefined'
            ? new ArrayBuffer(bufferLength)
            : new Array(bufferLength);
        var bytes = Array.isArray(buffer) ? buffer : new Uint8Array(buffer);
        for (i = 0; i < len; i += 4) {
            encoded1 = lookup[base64.charCodeAt(i)];
            encoded2 = lookup[base64.charCodeAt(i + 1)];
            encoded3 = lookup[base64.charCodeAt(i + 2)];
            encoded4 = lookup[base64.charCodeAt(i + 3)];
            bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
            bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
            bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
        }
        return buffer;
    };
    var polyUint16Array = function (buffer) {
        var length = buffer.length;
        var bytes = [];
        for (var i = 0; i < length; i += 2) {
            bytes.push((buffer[i + 1] << 8) | buffer[i]);
        }
        return bytes;
    };
    var polyUint32Array = function (buffer) {
        var length = buffer.length;
        var bytes = [];
        for (var i = 0; i < length; i += 4) {
            bytes.push((buffer[i + 3] << 24) | (buffer[i + 2] << 16) | (buffer[i + 1] << 8) | buffer[i]);
        }
        return bytes;
    };

    /** Shift size for getting the index-2 table offset. */
    var UTRIE2_SHIFT_2 = 5;
    /** Shift size for getting the index-1 table offset. */
    var UTRIE2_SHIFT_1 = 6 + 5;
    /**
     * Shift size for shifting left the index array values.
     * Increases possible data size with 16-bit index values at the cost
     * of compactability.
     * This requires data blocks to be aligned by UTRIE2_DATA_GRANULARITY.
     */
    var UTRIE2_INDEX_SHIFT = 2;
    /**
     * Difference between the two shift sizes,
     * for getting an index-1 offset from an index-2 offset. 6=11-5
     */
    var UTRIE2_SHIFT_1_2 = UTRIE2_SHIFT_1 - UTRIE2_SHIFT_2;
    /**
     * The part of the index-2 table for U+D800..U+DBFF stores values for
     * lead surrogate code _units_ not code _points_.
     * Values for lead surrogate code _points_ are indexed with this portion of the table.
     * Length=32=0x20=0x400>>UTRIE2_SHIFT_2. (There are 1024=0x400 lead surrogates.)
     */
    var UTRIE2_LSCP_INDEX_2_OFFSET = 0x10000 >> UTRIE2_SHIFT_2;
    /** Number of entries in a data block. 32=0x20 */
    var UTRIE2_DATA_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_2;
    /** Mask for getting the lower bits for the in-data-block offset. */
    var UTRIE2_DATA_MASK = UTRIE2_DATA_BLOCK_LENGTH - 1;
    var UTRIE2_LSCP_INDEX_2_LENGTH = 0x400 >> UTRIE2_SHIFT_2;
    /** Count the lengths of both BMP pieces. 2080=0x820 */
    var UTRIE2_INDEX_2_BMP_LENGTH = UTRIE2_LSCP_INDEX_2_OFFSET + UTRIE2_LSCP_INDEX_2_LENGTH;
    /**
     * The 2-byte UTF-8 version of the index-2 table follows at offset 2080=0x820.
     * Length 32=0x20 for lead bytes C0..DF, regardless of UTRIE2_SHIFT_2.
     */
    var UTRIE2_UTF8_2B_INDEX_2_OFFSET = UTRIE2_INDEX_2_BMP_LENGTH;
    var UTRIE2_UTF8_2B_INDEX_2_LENGTH = 0x800 >> 6; /* U+0800 is the first code point after 2-byte UTF-8 */
    /**
     * The index-1 table, only used for supplementary code points, at offset 2112=0x840.
     * Variable length, for code points up to highStart, where the last single-value range starts.
     * Maximum length 512=0x200=0x100000>>UTRIE2_SHIFT_1.
     * (For 0x100000 supplementary code points U+10000..U+10ffff.)
     *
     * The part of the index-2 table for supplementary code points starts
     * after this index-1 table.
     *
     * Both the index-1 table and the following part of the index-2 table
     * are omitted completely if there is only BMP data.
     */
    var UTRIE2_INDEX_1_OFFSET = UTRIE2_UTF8_2B_INDEX_2_OFFSET + UTRIE2_UTF8_2B_INDEX_2_LENGTH;
    /**
     * Number of index-1 entries for the BMP. 32=0x20
     * This part of the index-1 table is omitted from the serialized form.
     */
    var UTRIE2_OMITTED_BMP_INDEX_1_LENGTH = 0x10000 >> UTRIE2_SHIFT_1;
    /** Number of entries in an index-2 block. 64=0x40 */
    var UTRIE2_INDEX_2_BLOCK_LENGTH = 1 << UTRIE2_SHIFT_1_2;
    /** Mask for getting the lower bits for the in-index-2-block offset. */
    var UTRIE2_INDEX_2_MASK = UTRIE2_INDEX_2_BLOCK_LENGTH - 1;
    var slice16 = function (view, start, end) {
        if (view.slice) {
            return view.slice(start, end);
        }
        return new Uint16Array(Array.prototype.slice.call(view, start, end));
    };
    var slice32 = function (view, start, end) {
        if (view.slice) {
            return view.slice(start, end);
        }
        return new Uint32Array(Array.prototype.slice.call(view, start, end));
    };
    var createTrieFromBase64 = function (base64) {
        var buffer = decode(base64);
        var view32 = Array.isArray(buffer) ? polyUint32Array(buffer) : new Uint32Array(buffer);
        var view16 = Array.isArray(buffer) ? polyUint16Array(buffer) : new Uint16Array(buffer);
        var headerLength = 24;
        var index = slice16(view16, headerLength / 2, view32[4] / 2);
        var data = view32[5] === 2
            ? slice16(view16, (headerLength + view32[4]) / 2)
            : slice32(view32, Math.ceil((headerLength + view32[4]) / 4));
        return new Trie(view32[0], view32[1], view32[2], view32[3], index, data);
    };
    var Trie = /** @class */ (function () {
        function Trie(initialValue, errorValue, highStart, highValueIndex, index, data) {
            this.initialValue = initialValue;
            this.errorValue = errorValue;
            this.highStart = highStart;
            this.highValueIndex = highValueIndex;
            this.index = index;
            this.data = data;
        }
        /**
         * Get the value for a code point as stored in the Trie.
         *
         * @param codePoint the code point
         * @return the value
         */
        Trie.prototype.get = function (codePoint) {
            var ix;
            if (codePoint >= 0) {
                if (codePoint < 0x0d800 || (codePoint > 0x0dbff && codePoint <= 0x0ffff)) {
                    // Ordinary BMP code point, excluding leading surrogates.
                    // BMP uses a single level lookup.  BMP index starts at offset 0 in the Trie2 index.
                    // 16 bit data is stored in the index array itself.
                    ix = this.index[codePoint >> UTRIE2_SHIFT_2];
                    ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
                    return this.data[ix];
                }
                if (codePoint <= 0xffff) {
                    // Lead Surrogate Code Point.  A Separate index section is stored for
                    // lead surrogate code units and code points.
                    //   The main index has the code unit data.
                    //   For this function, we need the code point data.
                    // Note: this expression could be refactored for slightly improved efficiency, but
                    //       surrogate code points will be so rare in practice that it's not worth it.
                    ix = this.index[UTRIE2_LSCP_INDEX_2_OFFSET + ((codePoint - 0xd800) >> UTRIE2_SHIFT_2)];
                    ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
                    return this.data[ix];
                }
                if (codePoint < this.highStart) {
                    // Supplemental code point, use two-level lookup.
                    ix = UTRIE2_INDEX_1_OFFSET - UTRIE2_OMITTED_BMP_INDEX_1_LENGTH + (codePoint >> UTRIE2_SHIFT_1);
                    ix = this.index[ix];
                    ix += (codePoint >> UTRIE2_SHIFT_2) & UTRIE2_INDEX_2_MASK;
                    ix = this.index[ix];
                    ix = (ix << UTRIE2_INDEX_SHIFT) + (codePoint & UTRIE2_DATA_MASK);
                    return this.data[ix];
                }
                if (codePoint <= 0x10ffff) {
                    return this.data[this.highValueIndex];
                }
            }
            // Fall through.  The code point is outside of the legal range of 0..0x10ffff.
            return this.errorValue;
        };
        return Trie;
    }());

    var base64 = 'KwAAAAAAAAAACA4AIDoAAPAfAAACAAAAAAAIABAAGABAAEgAUABYAF4AZgBeAGYAYABoAHAAeABeAGYAfACEAIAAiACQAJgAoACoAK0AtQC9AMUAXgBmAF4AZgBeAGYAzQDVAF4AZgDRANkA3gDmAOwA9AD8AAQBDAEUARoBIgGAAIgAJwEvATcBPwFFAU0BTAFUAVwBZAFsAXMBewGDATAAiwGTAZsBogGkAawBtAG8AcIBygHSAdoB4AHoAfAB+AH+AQYCDgIWAv4BHgImAi4CNgI+AkUCTQJTAlsCYwJrAnECeQKBAk0CiQKRApkCoQKoArACuALAAsQCzAIwANQC3ALkAjAA7AL0AvwCAQMJAxADGAMwACADJgMuAzYDPgOAAEYDSgNSA1IDUgNaA1oDYANiA2IDgACAAGoDgAByA3YDfgOAAIQDgACKA5IDmgOAAIAAogOqA4AAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAK8DtwOAAIAAvwPHA88D1wPfAyAD5wPsA/QD/AOAAIAABAQMBBIEgAAWBB4EJgQuBDMEIAM7BEEEXgBJBCADUQRZBGEEaQQwADAAcQQ+AXkEgQSJBJEEgACYBIAAoASoBK8EtwQwAL8ExQSAAIAAgACAAIAAgACgAM0EXgBeAF4AXgBeAF4AXgBeANUEXgDZBOEEXgDpBPEE+QQBBQkFEQUZBSEFKQUxBTUFPQVFBUwFVAVcBV4AYwVeAGsFcwV7BYMFiwWSBV4AmgWgBacFXgBeAF4AXgBeAKsFXgCyBbEFugW7BcIFwgXIBcIFwgXQBdQF3AXkBesF8wX7BQMGCwYTBhsGIwYrBjMGOwZeAD8GRwZNBl4AVAZbBl4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAGMGXgBqBnEGXgBeAF4AXgBeAF4AXgBeAF4AXgB5BoAG4wSGBo4GkwaAAIADHgR5AF4AXgBeAJsGgABGA4AAowarBrMGswagALsGwwbLBjAA0wbaBtoG3QbaBtoG2gbaBtoG2gblBusG8wb7BgMHCwcTBxsHCwcjBysHMAc1BzUHOgdCB9oGSgdSB1oHYAfaBloHaAfaBlIH2gbaBtoG2gbaBtoG2gbaBjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHbQdeAF4ANQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQd1B30HNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B4MH2gaKB68EgACAAIAAgACAAIAAgACAAI8HlwdeAJ8HpweAAIAArwe3B14AXgC/B8UHygcwANAH2AfgB4AA6AfwBz4B+AcACFwBCAgPCBcIogEYAR8IJwiAAC8INwg/CCADRwhPCFcIXwhnCEoDGgSAAIAAgABvCHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIfQh3CHgIeQh6CHsIfAh9CHcIeAh5CHoIewh8CH0Idwh4CHkIegh7CHwIhAiLCI4IMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlggwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAANQc1BzUHNQc1BzUHNQc1BzUHNQc1B54INQc1B6II2gaqCLIIugiAAIAAvgjGCIAAgACAAIAAgACAAIAAgACAAIAAywiHAYAA0wiAANkI3QjlCO0I9Aj8CIAAgACAAAIJCgkSCRoJIgknCTYHLwk3CZYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiWCJYIlgiAAIAAAAFAAXgBeAGAAcABeAHwAQACQAKAArQC9AJ4AXgBeAE0A3gBRAN4A7AD8AMwBGgEAAKcBNwEFAUwBXAF4QkhCmEKnArcCgAHHAsABz4LAAcABwAHAAd+C6ABoAG+C/4LAAcABwAHAAc+DF4MAAcAB54M3gweDV4Nng3eDaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAGgAaABoAEeDqABVg6WDqABoQ6gAaABoAHXDvcONw/3DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DvcO9w73DncPAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcABwAHAAcAB7cPPwlGCU4JMACAAIAAgABWCV4JYQmAAGkJcAl4CXwJgAkwADAAMAAwAIgJgACLCZMJgACZCZ8JowmrCYAAswkwAF4AXgB8AIAAuwkABMMJyQmAAM4JgADVCTAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAqwYWBNkIMAAwADAAMADdCeAJ6AnuCR4E9gkwAP4JBQoNCjAAMACAABUK0wiAAB0KJAosCjQKgAAwADwKQwqAAEsKvQmdCVMKWwowADAAgACAALcEMACAAGMKgABrCjAAMAAwADAAMAAwADAAMAAwADAAMAAeBDAAMAAwADAAMAAwADAAMAAwADAAMAAwAIkEPQFzCnoKiQSCCooKkAqJBJgKoAqkCokEGAGsCrQKvArBCjAAMADJCtEKFQHZCuEK/gHpCvEKMAAwADAAMACAAIwE+QowAIAAPwEBCzAAMAAwADAAMACAAAkLEQswAIAAPwEZCyELgAAOCCkLMAAxCzkLMAAwADAAMAAwADAAXgBeAEELMAAwADAAMAAwADAAMAAwAEkLTQtVC4AAXAtkC4AAiQkwADAAMAAwADAAMAAwADAAbAtxC3kLgAuFC4sLMAAwAJMLlwufCzAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAApwswADAAMACAAIAAgACvC4AAgACAAIAAgACAALcLMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAvwuAAMcLgACAAIAAgACAAIAAyguAAIAAgACAAIAA0QswADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAANkLgACAAIAA4AswADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACJCR4E6AswADAAhwHwC4AA+AsADAgMEAwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMACAAIAAGAwdDCUMMAAwAC0MNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQw1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHPQwwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADUHNQc1BzUHNQc1BzUHNQc2BzAAMAA5DDUHNQc1BzUHNQc1BzUHNQc1BzUHNQdFDDAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAgACAAIAATQxSDFoMMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAF4AXgBeAF4AXgBeAF4AYgxeAGoMXgBxDHkMfwxeAIUMXgBeAI0MMAAwADAAMAAwAF4AXgCVDJ0MMAAwADAAMABeAF4ApQxeAKsMswy7DF4Awgy9DMoMXgBeAF4AXgBeAF4AXgBeAF4AXgDRDNkMeQBqCeAM3Ax8AOYM7Az0DPgMXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgBeAF4AXgCgAAANoAAHDQ4NFg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAeDSYNMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAIAAgACAAIAAgACAAC4NMABeAF4ANg0wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwAD4NRg1ODVYNXg1mDTAAbQ0wADAAMAAwADAAMAAwADAA2gbaBtoG2gbaBtoG2gbaBnUNeg3CBYANwgWFDdoGjA3aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gaUDZwNpA2oDdoG2gawDbcNvw3HDdoG2gbPDdYN3A3fDeYN2gbsDfMN2gbaBvoN/g3aBgYODg7aBl4AXgBeABYOXgBeACUG2gYeDl4AJA5eACwO2w3aBtoGMQ45DtoG2gbaBtoGQQ7aBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDjUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B1EO2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQdZDjUHNQc1BzUHNQc1B2EONQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHaA41BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B3AO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gY1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1BzUHNQc1B2EO2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gZJDtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBtoG2gbaBkkOeA6gAKAAoAAwADAAMAAwAKAAoACgAKAAoACgAKAAgA4wADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAAwADAAMAD//wQABAAEAAQABAAEAAQABAAEAA0AAwABAAEAAgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAKABMAFwAeABsAGgAeABcAFgASAB4AGwAYAA8AGAAcAEsASwBLAEsASwBLAEsASwBLAEsAGAAYAB4AHgAeABMAHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAFgAbABIAHgAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYADQARAB4ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAUABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkAFgAaABsAGwAbAB4AHQAdAB4ATwAXAB4ADQAeAB4AGgAbAE8ATwAOAFAAHQAdAB0ATwBPABcATwBPAE8AFgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAFAATwBAAE8ATwBPAEAATwBQAFAATwBQAB4AHgAeAB4AHgAeAB0AHQAdAB0AHgAdAB4ADgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgBQAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAJAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAkACQAJAAkACQAJAAkABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgAeAFAAHgAeAB4AKwArAFAAUABQAFAAGABQACsAKwArACsAHgAeAFAAHgBQAFAAUAArAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAAQABAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUAAeAB4AHgAeAB4AHgArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwAYAA0AKwArAB4AHgAbACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQADQAEAB4ABAAEAB4ABAAEABMABAArACsAKwArACsAKwArACsAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAKwArACsAKwArAFYAVgBWAB4AHgArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AGgAaABoAGAAYAB4AHgAEAAQABAAEAAQABAAEAAQABAAEAAQAEwAEACsAEwATAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABLAEsASwBLAEsASwBLAEsASwBLABoAGQAZAB4AUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABMAUAAEAAQABAAEAAQABAAEAB4AHgAEAAQABAAEAAQABABQAFAABAAEAB4ABAAEAAQABABQAFAASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUAAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAFAABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQAUABQAB4AHgAYABMAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAFAABAAEAAQABAAEAFAABAAEAAQAUAAEAAQABAAEAAQAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAArACsAHgArAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAAQABAANAA0ASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAKwArACsAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAUAArACsAKwArACsAKwArACsABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAGgAaAFAAUABQAFAAUABMAB4AGwBQAB4AKwArACsABAAEAAQAKwBQAFAAUABQAFAAUAArACsAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUAArAFAAUAArACsABAArAAQABAAEAAQABAArACsAKwArAAQABAArACsABAAEAAQAKwArACsABAArACsAKwArACsAKwArAFAAUABQAFAAKwBQACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwAEAAQAUABQAFAABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUAArAFAAUABQAFAAUAArACsABABQAAQABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQAKwArAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeABsAKwArACsAKwArACsAKwBQAAQABAAEAAQABAAEACsABAAEAAQAKwBQAFAAUABQAFAAUABQAFAAKwArAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArAAQABAArACsABAAEAAQAKwArACsAKwArACsAKwArAAQABAArACsAKwArAFAAUAArAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwAeAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwAEAFAAKwBQAFAAUABQAFAAUAArACsAKwBQAFAAUAArAFAAUABQAFAAKwArACsAUABQACsAUAArAFAAUAArACsAKwBQAFAAKwArACsAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwAEAAQABAAEAAQAKwArACsABAAEAAQAKwAEAAQABAAEACsAKwBQACsAKwArACsAKwArAAQAKwArACsAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAB4AHgAeAB4AHgAeABsAHgArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArAFAAUABQACsAKwArACsAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAB4AUAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQACsAKwAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABAArACsAKwArACsAKwArAAQABAArACsAKwArACsAKwArAFAAKwBQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAFAABAAEAAQABAAEAAQABAArAAQABAAEACsABAAEAAQABABQAB4AKwArACsAKwBQAFAAUAAEAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwBLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQABoAUABQAFAAUABQAFAAKwArAAQABAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQACsAUAArACsAUABQAFAAUABQAFAAUAArACsAKwAEACsAKwArACsABAAEAAQABAAEAAQAKwAEACsABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgAqACsAKwArACsAGwBcAFwAXABcAFwAXABcACoAKgAqACoAKgAqACoAKgAeAEsASwBLAEsASwBLAEsASwBLAEsADQANACsAKwArACsAKwBcAFwAKwBcACsAKwBcAFwAKwBcACsAKwBcACsAKwArACsAKwArAFwAXABcAFwAKwBcAFwAXABcAFwAXABcACsAXABcAFwAKwBcACsAXAArACsAXABcACsAXABcAFwAXAAqAFwAXAAqACoAKgAqACoAKgArACoAKgBcACsAKwBcAFwAXABcAFwAKwBcACsAKgAqACoAKgAqACoAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArAFwAXABcAFwAUAAOAA4ADgAOAB4ADgAOAAkADgAOAA0ACQATABMAEwATABMACQAeABMAHgAeAB4ABAAEAB4AHgAeAB4AHgAeAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAFAAUAANAAQAHgAEAB4ABAAWABEAFgARAAQABABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAAQABAAEAAQABAANAAQABABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsADQANAB4AHgAeAB4AHgAeAAQAHgAeAB4AHgAeAB4AKwAeAB4ADgAOAA0ADgAeAB4AHgAeAB4ACQAJACsAKwArACsAKwBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqAFwASwBLAEsASwBLAEsASwBLAEsASwANAA0AHgAeAB4AHgBcAFwAXABcAFwAXAAqACoAKgAqAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAKgAqACoAKgAqACoAKgBcAFwAXAAqACoAKgAqAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgAqACoAXAAqAEsASwBLAEsASwBLAEsASwBLAEsAKgAqACoAKgAqACoAUABQAFAAUABQAFAAKwBQACsAKwArACsAKwBQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQACsAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwAEAAQABAAeAA0AHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQABYAEQArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAADQANAA0AUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAA0ADQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQACsABAAEACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoADQANABUAXAANAB4ADQAbAFwAKgArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAB4AHgATABMADQANAA4AHgATABMAHgAEAAQABAAJACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAUABQAFAAUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwAeACsAKwArABMAEwBLAEsASwBLAEsASwBLAEsASwBLAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwBcAFwAXABcAFwAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcACsAKwArACsAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBcACsAKwArACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEACsAKwAeAB4AXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAKgAqACoAKgAqACoAKgArACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsABABLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKgAqACoAKgAqACoAKgBcACoAKgAqACoAKgAqACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAUABQAFAAUABQAFAAUAArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsADQANAB4ADQANAA0ADQAeAB4AHgAeAB4AHgAeAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArAAQABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAEsASwBLAEsASwBLAEsASwBLAEsAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAHgAeAB4AHgBQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwANAA0ADQANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwBQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAANAA0AUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsABAAEAAQAHgAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAFAAUABQAFAABABQAFAAUABQAAQABAAEAFAAUAAEAAQABAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAKwBQACsAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAFAAHgAeAB4AUABQAFAAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAKwArAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAKwAeAB4AHgAeAB4AHgAeAA4AHgArAA0ADQANAA0ADQANAA0ACQANAA0ADQAIAAQACwAEAAQADQAJAA0ADQAMAB0AHQAeABcAFwAWABcAFwAXABYAFwAdAB0AHgAeABQAFAAUAA0AAQABAAQABAAEAAQABAAJABoAGgAaABoAGgAaABoAGgAeABcAFwAdABUAFQAeAB4AHgAeAB4AHgAYABYAEQAVABUAFQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgANAB4ADQANAA0ADQAeAA0ADQANAAcAHgAeAB4AHgArAAQABAAEAAQABAAEAAQABAAEAAQAUABQACsAKwBPAFAAUABQAFAAUAAeAB4AHgAWABEATwBQAE8ATwBPAE8AUABQAFAAUABQAB4AHgAeABYAEQArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAaABsAGwAbABsAGgAbABsAGgAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsAGwAbABsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgBQABoAHgAdAB4AUAAeABoAHgAeAB4AHgAeAB4AHgAeAB4ATwAeAFAAGwAeAB4AUABQAFAAUABQAB4AHgAeAB0AHQAeAFAAHgBQAB4AUAAeAFAATwBQAFAAHgAeAB4AHgAeAB4AHgBQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AUABQAFAAUABPAE8AUABQAFAAUABQAE8AUABQAE8AUABPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAFAAUABQAE8ATwBPAE8ATwBPAE8ATwBPAE8AUABQAFAAUABQAFAAUABQAFAAHgAeAFAAUABQAFAATwAeAB4AKwArACsAKwAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB0AHQAeAB4AHgAdAB0AHgAeAB0AHgAeAB4AHQAeAB0AGwAbAB4AHQAeAB4AHgAeAB0AHgAeAB0AHQAdAB0AHgAeAB0AHgAdAB4AHQAdAB0AHQAdAB0AHgAdAB4AHgAeAB4AHgAdAB0AHQAdAB4AHgAeAB4AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAeAB4AHgAdAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHgAdAB0AHQAdAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHQAeAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAFgARAB4AHgAeAB4AHgAeAB0AHgAeAB4AHgAeAB4AHgAlACUAHgAeAB4AHgAeAB4AHgAeAB4AFgARAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBQAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeAB0AHQAdAB0AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAdAB0AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAdAB0AHgAeAB0AHQAeAB4AHgAeAB0AHQAeAB4AHgAeAB0AHQAdAB4AHgAdAB4AHgAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAeAB0AHQAeAB4AHQAeAB4AHgAeAB0AHQAeAB4AHgAeACUAJQAdAB0AJQAeACUAJQAlACAAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAHgAeAB4AHgAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB4AHQAdAB0AHgAdACUAHQAdAB4AHQAdAB4AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB0AHQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAHQAdAB0AHQAlAB4AJQAlACUAHQAlACUAHQAdAB0AJQAlAB0AHQAlAB0AHQAlACUAJQAeAB0AHgAeAB4AHgAdAB0AJQAdAB0AHQAdAB0AHQAlACUAJQAlACUAHQAlACUAIAAlAB0AHQAlACUAJQAlACUAJQAlACUAHgAeAB4AJQAlACAAIAAgACAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAdAB4AHgAeABcAFwAXABcAFwAXAB4AEwATACUAHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAWABEAFgARAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAWABEAFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAFgARABYAEQAWABEAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFgARABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeABYAEQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHQAdAB0AHQAdAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAeAB4AKwArACsAKwArABMADQANAA0AUAATAA0AUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUAANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAA0ADQANAA0ADQANAA0ADQAeAA0AFgANAB4AHgAXABcAHgAeABcAFwAWABEAFgARABYAEQAWABEADQANAA0ADQATAFAADQANAB4ADQANAB4AHgAeAB4AHgAMAAwADQANAA0AHgANAA0AFgANAA0ADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArAA0AEQARACUAJQBHAFcAVwAWABEAFgARABYAEQAWABEAFgARACUAJQAWABEAFgARABYAEQAWABEAFQAWABEAEQAlAFcAVwBXAFcAVwBXAFcAVwBXAAQABAAEAAQABAAEACUAVwBXAFcAVwA2ACUAJQBXAFcAVwBHAEcAJQAlACUAKwBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBRAFcAUQBXAFEAVwBXAFcAVwBXAFcAUQBXAFcAVwBXAFcAVwBRAFEAKwArAAQABAAVABUARwBHAFcAFQBRAFcAUQBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFEAVwBRAFcAUQBXAFcAVwBXAFcAVwBRAFcAVwBXAFcAVwBXAFEAUQBXAFcAVwBXABUAUQBHAEcAVwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACUAJQBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwArACUAJQAlACUAKwArACsAKwArACsAKwArACsAKwArACsAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQBRAFEAUQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAVwBXAFcAVwBXAFcAVwBXAFcAVwAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAE8ATwBPAE8ATwBPAE8ATwAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADQATAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABLAEsASwBLAEsASwBLAEsASwBLAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAABAAEAAQABAAeAAQABAAEAAQABAAEAAQABAAEAAQAHgBQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUABQAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAeAA0ADQANAA0ADQArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAB4AHgAeAB4AHgAeAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAB4AHgAeAB4AHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAAQAUABQAFAABABQAFAAUABQAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAeAB4AHgAeACsAKwArACsAUABQAFAAUABQAFAAHgAeABoAHgArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAADgAOABMAEwArACsAKwArACsAKwArACsABAAEAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwANAA0ASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUAAeAB4AHgBQAA4AUAArACsAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAA0ADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArAB4AWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYAFgAWABYACsAKwArAAQAHgAeAB4AHgAeAB4ADQANAA0AHgAeAB4AHgArAFAASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArAB4AHgBcAFwAXABcAFwAKgBcAFwAXABcAFwAXABcAFwAXABcAEsASwBLAEsASwBLAEsASwBLAEsAXABcAFwAXABcACsAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArAFAAUABQAAQAUABQAFAAUABQAFAAUABQAAQABAArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAHgANAA0ADQBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAKgAqACoAXAAqACoAKgBcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAAqAFwAKgAqACoAXABcACoAKgBcAFwAXABcAFwAKgAqAFwAKgBcACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcACoAKgBQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAA0ADQBQAFAAUAAEAAQAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQADQAEAAQAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAVABVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBUAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVAFUAVQBVACsAKwArACsAKwArACsAKwArACsAKwArAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAWQBZAFkAKwArACsAKwBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAWgBaAFoAKwArACsAKwAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYABgAGAAYAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArACsAKwArAFYABABWAFYAVgBWAFYAVgBWAFYAVgBWAB4AVgBWAFYAVgBWAFYAVgBWAFYAVgBWAFYAVgArAFYAVgBWAFYAVgArAFYAKwBWAFYAKwBWAFYAKwBWAFYAVgBWAFYAVgBWAFYAVgBWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAEQAWAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUAAaAB4AKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAGAARABEAGAAYABMAEwAWABEAFAArACsAKwArACsAKwAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACUAJQAlACUAJQAWABEAFgARABYAEQAWABEAFgARABYAEQAlACUAFgARACUAJQAlACUAJQAlACUAEQAlABEAKwAVABUAEwATACUAFgARABYAEQAWABEAJQAlACUAJQAlACUAJQAlACsAJQAbABoAJQArACsAKwArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAcAKwATACUAJQAbABoAJQAlABYAEQAlACUAEQAlABEAJQBXAFcAVwBXAFcAVwBXAFcAVwBXABUAFQAlACUAJQATACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXABYAJQARACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwAWACUAEQAlABYAEQARABYAEQARABUAVwBRAFEAUQBRAFEAUQBRAFEAUQBRAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAEcARwArACsAVwBXAFcAVwBXAFcAKwArAFcAVwBXAFcAVwBXACsAKwBXAFcAVwBXAFcAVwArACsAVwBXAFcAKwArACsAGgAbACUAJQAlABsAGwArAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwAEAAQABAAQAB0AKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsADQANAA0AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgBQAFAAHgAeAB4AKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQBQAFAAUABQACsAKwArACsAUABQAFAAUABQAFAAUABQAA0AUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAArACsAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArAFAAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAA0AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AHgBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsADQBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwBQAFAAUABQAFAABAAEAAQAKwAEAAQAKwArACsAKwArAAQABAAEAAQAUABQAFAAUAArAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsABAAEAAQAKwArACsAKwAEAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsADQANAA0ADQANAA0ADQANAB4AKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAB4AUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEACsAKwArACsAUABQAFAAUABQAA0ADQANAA0ADQANABQAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwANAA0ADQANAA0ADQANAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAHgAeAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQAeAB4AHgAeAB4AKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQABAAEAAQABAAeAB4AHgANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAKwArAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsASwBLAEsASwBLAEsASwBLAEsASwANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAeAA4AUAArACsAKwArACsAKwArACsAKwAEAFAAUABQAFAADQANAB4ADQAeAAQABAAEAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsAUAAOAFAADQANAA0AKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAANAA0AHgANAA0AHgAEACsAUABQAFAAUABQAFAAUAArAFAAKwBQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAA0AKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsABAAEAAQABAArAFAAUABQAFAAUABQAFAAUAArACsAUABQACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAArACsABAAEACsAKwAEAAQABAArACsAUAArACsAKwArACsAKwAEACsAKwArACsAKwBQAFAAUABQAFAABAAEACsAKwAEAAQABAAEAAQABAAEACsAKwArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABABQAFAAUABQAA0ADQANAA0AHgBLAEsASwBLAEsASwBLAEsASwBLACsADQArAB4AKwArAAQABAAEAAQAUABQAB4AUAArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEACsAKwAEAAQABAAEAAQABAAEAAQABAAOAA0ADQATABMAHgAeAB4ADQANAA0ADQANAA0ADQANAA0ADQANAA0ADQANAA0AUABQAFAAUAAEAAQAKwArAAQADQANAB4AUAArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwAOAA4ADgAOAA4ADgAOAA4ADgAOAA4ADgAOACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXABcAFwAXAArACsAKwAqACoAKgAqACoAKgAqACoAKgAqACoAKgAqACoAKgArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAXABcAA0ADQANACoASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwBQAFAABAAEAAQABAAEAAQABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAFAABAAEAAQABAAOAB4ADQANAA0ADQAOAB4ABAArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQAUABQAFAAUAArACsAUABQAFAAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAA0ADQANACsADgAOAA4ADQANACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAABAAEAAQABAAEAAQABAAEACsABAAEAAQABAAEAAQABAAEAFAADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwAOABMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQACsAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAArACsAKwAEACsABAAEACsABAAEAAQABAAEAAQABABQAAQAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsADQANAA0ADQANACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABIAEgAQwBDAEMAUABQAFAAUABDAFAAUABQAEgAQwBIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAASABDAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABIAEMAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAEsASwBLAEsASwBLAEsASwBLAEsAKwArACsAKwANAA0AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArAAQABAAEAAQABAANACsAKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAEAAQABAAEAAQABAAEAA0ADQANAB4AHgAeAB4AHgAeAFAAUABQAFAADQAeACsAKwArACsAKwArACsAKwArACsASwBLAEsASwBLAEsASwBLAEsASwArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAUAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAEcARwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwArACsAKwArACsAKwArACsAKwArACsAKwArAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwBQAFAAUABQAFAAUABQAFAAUABQACsAKwAeAAQABAANAAQABAAEAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAeAB4AHgArACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAEAAQABAAEAB4AHgAeAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQAHgAeAAQABAAEAAQABAAEAAQAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAEAAQABAAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwArACsAKwArACsAKwArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUAArACsAUAArACsAUABQACsAKwBQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AKwBQACsAUABQAFAAUABQAFAAUAArAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwAeAB4AUABQAFAAUABQACsAUAArACsAKwBQAFAAUABQAFAAUABQACsAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgArACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUAAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAHgAeAB4AHgAeAB4AHgAeAB4AKwArAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsASwBLAEsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4ABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAB4AHgAeAB4AHgAeAB4AHgAEAB4AHgAeAB4AHgAeAB4AHgAeAB4ABAAeAB4ADQANAA0ADQAeACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAArAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsABAAEAAQABAAEAAQABAArAAQABAArAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwBQAFAAUABQAFAAKwArAFAAUABQAFAAUABQAFAAUABQAAQABAAEAAQABAAEAAQAKwArACsAKwArACsAKwArACsAHgAeAB4AHgAEAAQABAAEAAQABAAEACsAKwArACsAKwBLAEsASwBLAEsASwBLAEsASwBLACsAKwArACsAFgAWAFAAUABQAFAAKwBQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUAArAFAAKwBQACsAKwArACsAKwArAFAAKwArACsAKwBQACsAUAArAFAAKwBQAFAAUAArAFAAUAArAFAAKwArAFAAKwBQACsAUAArAFAAKwBQACsAUABQACsAUAArACsAUABQAFAAUAArAFAAUABQAFAAUABQAFAAKwBQAFAAUABQACsAUABQAFAAUAArAFAAKwBQAFAAUABQAFAAUABQAFAAUABQACsAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQACsAKwArACsAKwBQAFAAUAArAFAAUABQAFAAUAArAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUABQAFAAUAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArAB4AHgArACsAKwArACsAKwArACsAKwArACsAKwArACsATwBPAE8ATwBPAE8ATwBPAE8ATwBPAE8ATwAlACUAJQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAeACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHgAeACUAJQAlACUAHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdAB0AHQAdACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQApACkAKQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeACUAJQAlACUAJQAeACUAJQAlACUAJQAgACAAIAAlACUAIAAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIQAhACEAIQAhACUAJQAgACAAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAIAAlACUAJQAlACAAJQAgACAAIAAgACAAIAAgACAAIAAlACUAJQAgACUAJQAlACUAIAAgACAAJQAgACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeACUAHgAlAB4AJQAlACUAJQAlACAAJQAlACUAJQAeACUAHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACAAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAIAAgACAAIAAgAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AFwAXABcAFQAVABUAHgAeAB4AHgAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAIAAgACAAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAIAAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAJQAlAB4AHgAeAB4AHgAeAB4AHgAeAB4AJQAlACUAJQAlACUAHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeAB4AHgAeACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAlACAAIAAlACUAJQAlACUAJQAgACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAIAAgACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACsAKwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAVwBXAFcAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQAlACUAJQArAAQAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAAEAAQABAArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsAKwArACsA';

    /* @flow */
    var LETTER_NUMBER_MODIFIER = 50;
    // Non-tailorable Line Breaking Classes
    var BK = 1; //  Cause a line break (after)
    var CR = 2; //  Cause a line break (after), except between CR and LF
    var LF = 3; //  Cause a line break (after)
    var CM = 4; //  Prohibit a line break between the character and the preceding character
    var NL = 5; //  Cause a line break (after)
    var WJ = 7; //  Prohibit line breaks before and after
    var ZW = 8; //  Provide a break opportunity
    var GL = 9; //  Prohibit line breaks before and after
    var SP = 10; // Enable indirect line breaks
    var ZWJ = 11; // Prohibit line breaks within joiner sequences
    // Break Opportunities
    var B2 = 12; //  Provide a line break opportunity before and after the character
    var BA = 13; //  Generally provide a line break opportunity after the character
    var BB = 14; //  Generally provide a line break opportunity before the character
    var HY = 15; //  Provide a line break opportunity after the character, except in numeric context
    var CB = 16; //   Provide a line break opportunity contingent on additional information
    // Characters Prohibiting Certain Breaks
    var CL = 17; //  Prohibit line breaks before
    var CP = 18; //  Prohibit line breaks before
    var EX = 19; //  Prohibit line breaks before
    var IN = 20; //  Allow only indirect line breaks between pairs
    var NS = 21; //  Allow only indirect line breaks before
    var OP = 22; //  Prohibit line breaks after
    var QU = 23; //  Act like they are both opening and closing
    // Numeric Context
    var IS = 24; //  Prevent breaks after any and before numeric
    var NU = 25; //  Form numeric expressions for line breaking purposes
    var PO = 26; //  Do not break following a numeric expression
    var PR = 27; //  Do not break in front of a numeric expression
    var SY = 28; //  Prevent a break before; and allow a break after
    // Other Characters
    var AI = 29; //  Act like AL when the resolvedEAW is N; otherwise; act as ID
    var AL = 30; //  Are alphabetic characters or symbols that are used with alphabetic characters
    var CJ = 31; //  Treat as NS or ID for strict or normal breaking.
    var EB = 32; //  Do not break from following Emoji Modifier
    var EM = 33; //  Do not break from preceding Emoji Base
    var H2 = 34; //  Form Korean syllable blocks
    var H3 = 35; //  Form Korean syllable blocks
    var HL = 36; //  Do not break around a following hyphen; otherwise act as Alphabetic
    var ID = 37; //  Break before or after; except in some numeric context
    var JL = 38; //  Form Korean syllable blocks
    var JV = 39; //  Form Korean syllable blocks
    var JT = 40; //  Form Korean syllable blocks
    var RI = 41; //  Keep pairs together. For pairs; break before and after other classes
    var SA = 42; //  Provide a line break opportunity contingent on additional, language-specific context analysis
    var XX = 43; //  Have as yet unknown line breaking behavior or unassigned code positions
    var BREAK_MANDATORY = '!';
    var BREAK_NOT_ALLOWED = '×';
    var BREAK_ALLOWED = '÷';
    var UnicodeTrie = createTrieFromBase64(base64);
    var ALPHABETICS = [AL, HL];
    var HARD_LINE_BREAKS = [BK, CR, LF, NL];
    var SPACE = [SP, ZW];
    var PREFIX_POSTFIX = [PR, PO];
    var LINE_BREAKS = HARD_LINE_BREAKS.concat(SPACE);
    var KOREAN_SYLLABLE_BLOCK = [JL, JV, JT, H2, H3];
    var HYPHEN = [HY, BA];
    var codePointsToCharacterClasses = function (codePoints, lineBreak) {
        if (lineBreak === void 0) { lineBreak = 'strict'; }
        var types = [];
        var indicies = [];
        var categories = [];
        codePoints.forEach(function (codePoint, index) {
            var classType = UnicodeTrie.get(codePoint);
            if (classType > LETTER_NUMBER_MODIFIER) {
                categories.push(true);
                classType -= LETTER_NUMBER_MODIFIER;
            }
            else {
                categories.push(false);
            }
            if (['normal', 'auto', 'loose'].indexOf(lineBreak) !== -1) {
                // U+2010, – U+2013, 〜 U+301C, ゠ U+30A0
                if ([0x2010, 0x2013, 0x301c, 0x30a0].indexOf(codePoint) !== -1) {
                    indicies.push(index);
                    return types.push(CB);
                }
            }
            if (classType === CM || classType === ZWJ) {
                // LB10 Treat any remaining combining mark or ZWJ as AL.
                if (index === 0) {
                    indicies.push(index);
                    return types.push(AL);
                }
                // LB9 Do not break a combining character sequence; treat it as if it has the line breaking class of
                // the base character in all of the following rules. Treat ZWJ as if it were CM.
                var prev = types[index - 1];
                if (LINE_BREAKS.indexOf(prev) === -1) {
                    indicies.push(indicies[index - 1]);
                    return types.push(prev);
                }
                indicies.push(index);
                return types.push(AL);
            }
            indicies.push(index);
            if (classType === CJ) {
                return types.push(lineBreak === 'strict' ? NS : ID);
            }
            if (classType === SA) {
                return types.push(AL);
            }
            if (classType === AI) {
                return types.push(AL);
            }
            // For supplementary characters, a useful default is to treat characters in the range 10000..1FFFD as AL
            // and characters in the ranges 20000..2FFFD and 30000..3FFFD as ID, until the implementation can be revised
            // to take into account the actual line breaking properties for these characters.
            if (classType === XX) {
                if ((codePoint >= 0x20000 && codePoint <= 0x2fffd) || (codePoint >= 0x30000 && codePoint <= 0x3fffd)) {
                    return types.push(ID);
                }
                else {
                    return types.push(AL);
                }
            }
            types.push(classType);
        });
        return [indicies, types, categories];
    };
    var isAdjacentWithSpaceIgnored = function (a, b, currentIndex, classTypes) {
        var current = classTypes[currentIndex];
        if (Array.isArray(a) ? a.indexOf(current) !== -1 : a === current) {
            var i = currentIndex;
            while (i <= classTypes.length) {
                i++;
                var next = classTypes[i];
                if (next === b) {
                    return true;
                }
                if (next !== SP) {
                    break;
                }
            }
        }
        if (current === SP) {
            var i = currentIndex;
            while (i > 0) {
                i--;
                var prev = classTypes[i];
                if (Array.isArray(a) ? a.indexOf(prev) !== -1 : a === prev) {
                    var n = currentIndex;
                    while (n <= classTypes.length) {
                        n++;
                        var next = classTypes[n];
                        if (next === b) {
                            return true;
                        }
                        if (next !== SP) {
                            break;
                        }
                    }
                }
                if (prev !== SP) {
                    break;
                }
            }
        }
        return false;
    };
    var previousNonSpaceClassType = function (currentIndex, classTypes) {
        var i = currentIndex;
        while (i >= 0) {
            var type = classTypes[i];
            if (type === SP) {
                i--;
            }
            else {
                return type;
            }
        }
        return 0;
    };
    var _lineBreakAtIndex = function (codePoints, classTypes, indicies, index, forbiddenBreaks) {
        if (indicies[index] === 0) {
            return BREAK_NOT_ALLOWED;
        }
        var currentIndex = index - 1;
        if (Array.isArray(forbiddenBreaks) && forbiddenBreaks[currentIndex] === true) {
            return BREAK_NOT_ALLOWED;
        }
        var beforeIndex = currentIndex - 1;
        var afterIndex = currentIndex + 1;
        var current = classTypes[currentIndex];
        // LB4 Always break after hard line breaks.
        // LB5 Treat CR followed by LF, as well as CR, LF, and NL as hard line breaks.
        var before = beforeIndex >= 0 ? classTypes[beforeIndex] : 0;
        var next = classTypes[afterIndex];
        if (current === CR && next === LF) {
            return BREAK_NOT_ALLOWED;
        }
        if (HARD_LINE_BREAKS.indexOf(current) !== -1) {
            return BREAK_MANDATORY;
        }
        // LB6 Do not break before hard line breaks.
        if (HARD_LINE_BREAKS.indexOf(next) !== -1) {
            return BREAK_NOT_ALLOWED;
        }
        // LB7 Do not break before spaces or zero width space.
        if (SPACE.indexOf(next) !== -1) {
            return BREAK_NOT_ALLOWED;
        }
        // LB8 Break before any character following a zero-width space, even if one or more spaces intervene.
        if (previousNonSpaceClassType(currentIndex, classTypes) === ZW) {
            return BREAK_ALLOWED;
        }
        // LB8a Do not break between a zero width joiner and an ideograph, emoji base or emoji modifier.
        if (UnicodeTrie.get(codePoints[currentIndex]) === ZWJ && (next === ID || next === EB || next === EM)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB11 Do not break before or after Word joiner and related characters.
        if (current === WJ || next === WJ) {
            return BREAK_NOT_ALLOWED;
        }
        // LB12 Do not break after NBSP and related characters.
        if (current === GL) {
            return BREAK_NOT_ALLOWED;
        }
        // LB12a Do not break before NBSP and related characters, except after spaces and hyphens.
        if ([SP, BA, HY].indexOf(current) === -1 && next === GL) {
            return BREAK_NOT_ALLOWED;
        }
        // LB13 Do not break before ‘]’ or ‘!’ or ‘;’ or ‘/’, even after spaces.
        if ([CL, CP, EX, IS, SY].indexOf(next) !== -1) {
            return BREAK_NOT_ALLOWED;
        }
        // LB14 Do not break after ‘[’, even after spaces.
        if (previousNonSpaceClassType(currentIndex, classTypes) === OP) {
            return BREAK_NOT_ALLOWED;
        }
        // LB15 Do not break within ‘”[’, even with intervening spaces.
        if (isAdjacentWithSpaceIgnored(QU, OP, currentIndex, classTypes)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB16 Do not break between closing punctuation and a nonstarter (lb=NS), even with intervening spaces.
        if (isAdjacentWithSpaceIgnored([CL, CP], NS, currentIndex, classTypes)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB17 Do not break within ‘——’, even with intervening spaces.
        if (isAdjacentWithSpaceIgnored(B2, B2, currentIndex, classTypes)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB18 Break after spaces.
        if (current === SP) {
            return BREAK_ALLOWED;
        }
        // LB19 Do not break before or after quotation marks, such as ‘ ” ’.
        if (current === QU || next === QU) {
            return BREAK_NOT_ALLOWED;
        }
        // LB20 Break before and after unresolved CB.
        if (next === CB || current === CB) {
            return BREAK_ALLOWED;
        }
        // LB21 Do not break before hyphen-minus, other hyphens, fixed-width spaces, small kana, and other non-starters, or after acute accents.
        if ([BA, HY, NS].indexOf(next) !== -1 || current === BB) {
            return BREAK_NOT_ALLOWED;
        }
        // LB21a Don't break after Hebrew + Hyphen.
        if (before === HL && HYPHEN.indexOf(current) !== -1) {
            return BREAK_NOT_ALLOWED;
        }
        // LB21b Don’t break between Solidus and Hebrew letters.
        if (current === SY && next === HL) {
            return BREAK_NOT_ALLOWED;
        }
        // LB22 Do not break between two ellipses, or between letters, numbers or exclamations and ellipsis.
        if (next === IN && ALPHABETICS.concat(IN, EX, NU, ID, EB, EM).indexOf(current) !== -1) {
            return BREAK_NOT_ALLOWED;
        }
        // LB23 Do not break between digits and letters.
        if ((ALPHABETICS.indexOf(next) !== -1 && current === NU) || (ALPHABETICS.indexOf(current) !== -1 && next === NU)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB23a Do not break between numeric prefixes and ideographs, or between ideographs and numeric postfixes.
        if ((current === PR && [ID, EB, EM].indexOf(next) !== -1) ||
            ([ID, EB, EM].indexOf(current) !== -1 && next === PO)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB24 Do not break between numeric prefix/postfix and letters, or between letters and prefix/postfix.
        if ((ALPHABETICS.indexOf(current) !== -1 && PREFIX_POSTFIX.indexOf(next) !== -1) ||
            (PREFIX_POSTFIX.indexOf(current) !== -1 && ALPHABETICS.indexOf(next) !== -1)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB25 Do not break between the following pairs of classes relevant to numbers:
        if (
        // (PR | PO) × ( OP | HY )? NU
        ([PR, PO].indexOf(current) !== -1 &&
            (next === NU || ([OP, HY].indexOf(next) !== -1 && classTypes[afterIndex + 1] === NU))) ||
            // ( OP | HY ) × NU
            ([OP, HY].indexOf(current) !== -1 && next === NU) ||
            // NU ×	(NU | SY | IS)
            (current === NU && [NU, SY, IS].indexOf(next) !== -1)) {
            return BREAK_NOT_ALLOWED;
        }
        // NU (NU | SY | IS)* × (NU | SY | IS | CL | CP)
        if ([NU, SY, IS, CL, CP].indexOf(next) !== -1) {
            var prevIndex = currentIndex;
            while (prevIndex >= 0) {
                var type = classTypes[prevIndex];
                if (type === NU) {
                    return BREAK_NOT_ALLOWED;
                }
                else if ([SY, IS].indexOf(type) !== -1) {
                    prevIndex--;
                }
                else {
                    break;
                }
            }
        }
        // NU (NU | SY | IS)* (CL | CP)? × (PO | PR))
        if ([PR, PO].indexOf(next) !== -1) {
            var prevIndex = [CL, CP].indexOf(current) !== -1 ? beforeIndex : currentIndex;
            while (prevIndex >= 0) {
                var type = classTypes[prevIndex];
                if (type === NU) {
                    return BREAK_NOT_ALLOWED;
                }
                else if ([SY, IS].indexOf(type) !== -1) {
                    prevIndex--;
                }
                else {
                    break;
                }
            }
        }
        // LB26 Do not break a Korean syllable.
        if ((JL === current && [JL, JV, H2, H3].indexOf(next) !== -1) ||
            ([JV, H2].indexOf(current) !== -1 && [JV, JT].indexOf(next) !== -1) ||
            ([JT, H3].indexOf(current) !== -1 && next === JT)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB27 Treat a Korean Syllable Block the same as ID.
        if ((KOREAN_SYLLABLE_BLOCK.indexOf(current) !== -1 && [IN, PO].indexOf(next) !== -1) ||
            (KOREAN_SYLLABLE_BLOCK.indexOf(next) !== -1 && current === PR)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB28 Do not break between alphabetics (“at”).
        if (ALPHABETICS.indexOf(current) !== -1 && ALPHABETICS.indexOf(next) !== -1) {
            return BREAK_NOT_ALLOWED;
        }
        // LB29 Do not break between numeric punctuation and alphabetics (“e.g.”).
        if (current === IS && ALPHABETICS.indexOf(next) !== -1) {
            return BREAK_NOT_ALLOWED;
        }
        // LB30 Do not break between letters, numbers, or ordinary symbols and opening or closing parentheses.
        if ((ALPHABETICS.concat(NU).indexOf(current) !== -1 && next === OP) ||
            (ALPHABETICS.concat(NU).indexOf(next) !== -1 && current === CP)) {
            return BREAK_NOT_ALLOWED;
        }
        // LB30a Break between two regional indicator symbols if and only if there are an even number of regional
        // indicators preceding the position of the break.
        if (current === RI && next === RI) {
            var i = indicies[currentIndex];
            var count = 1;
            while (i > 0) {
                i--;
                if (classTypes[i] === RI) {
                    count++;
                }
                else {
                    break;
                }
            }
            if (count % 2 !== 0) {
                return BREAK_NOT_ALLOWED;
            }
        }
        // LB30b Do not break between an emoji base and an emoji modifier.
        if (current === EB && next === EM) {
            return BREAK_NOT_ALLOWED;
        }
        return BREAK_ALLOWED;
    };
    var cssFormattedClasses = function (codePoints, options) {
        if (!options) {
            options = { lineBreak: 'normal', wordBreak: 'normal' };
        }
        var _a = codePointsToCharacterClasses(codePoints, options.lineBreak), indicies = _a[0], classTypes = _a[1], isLetterNumber = _a[2];
        if (options.wordBreak === 'break-all' || options.wordBreak === 'break-word') {
            classTypes = classTypes.map(function (type) { return ([NU, AL, SA].indexOf(type) !== -1 ? ID : type); });
        }
        var forbiddenBreakpoints = options.wordBreak === 'keep-all'
            ? isLetterNumber.map(function (letterNumber, i) {
                return letterNumber && codePoints[i] >= 0x4e00 && codePoints[i] <= 0x9fff;
            })
            : undefined;
        return [indicies, classTypes, forbiddenBreakpoints];
    };
    var Break = /** @class */ (function () {
        function Break(codePoints, lineBreak, start, end) {
            this.codePoints = codePoints;
            this.required = lineBreak === BREAK_MANDATORY;
            this.start = start;
            this.end = end;
        }
        Break.prototype.slice = function () {
            return fromCodePoint.apply(void 0, this.codePoints.slice(this.start, this.end));
        };
        return Break;
    }());
    var LineBreaker = function (str, options) {
        var codePoints = toCodePoints(str);
        var _a = cssFormattedClasses(codePoints, options), indicies = _a[0], classTypes = _a[1], forbiddenBreakpoints = _a[2];
        var length = codePoints.length;
        var lastEnd = 0;
        var nextIndex = 0;
        return {
            next: function () {
                if (nextIndex >= length) {
                    return { done: true, value: null };
                }
                var lineBreak = BREAK_NOT_ALLOWED;
                while (nextIndex < length &&
                    (lineBreak = _lineBreakAtIndex(codePoints, classTypes, indicies, ++nextIndex, forbiddenBreakpoints)) ===
                        BREAK_NOT_ALLOWED) { }
                if (lineBreak !== BREAK_NOT_ALLOWED || nextIndex === length) {
                    var value = new Break(codePoints, lineBreak, lastEnd, nextIndex);
                    lastEnd = nextIndex;
                    return { value: value, done: false };
                }
                return { done: true, value: null };
            },
        };
    };

    // https://www.w3.org/TR/css-syntax-3
    var TokenType;
    (function (TokenType) {
        TokenType[TokenType["STRING_TOKEN"] = 0] = "STRING_TOKEN";
        TokenType[TokenType["BAD_STRING_TOKEN"] = 1] = "BAD_STRING_TOKEN";
        TokenType[TokenType["LEFT_PARENTHESIS_TOKEN"] = 2] = "LEFT_PARENTHESIS_TOKEN";
        TokenType[TokenType["RIGHT_PARENTHESIS_TOKEN"] = 3] = "RIGHT_PARENTHESIS_TOKEN";
        TokenType[TokenType["COMMA_TOKEN"] = 4] = "COMMA_TOKEN";
        TokenType[TokenType["HASH_TOKEN"] = 5] = "HASH_TOKEN";
        TokenType[TokenType["DELIM_TOKEN"] = 6] = "DELIM_TOKEN";
        TokenType[TokenType["AT_KEYWORD_TOKEN"] = 7] = "AT_KEYWORD_TOKEN";
        TokenType[TokenType["PREFIX_MATCH_TOKEN"] = 8] = "PREFIX_MATCH_TOKEN";
        TokenType[TokenType["DASH_MATCH_TOKEN"] = 9] = "DASH_MATCH_TOKEN";
        TokenType[TokenType["INCLUDE_MATCH_TOKEN"] = 10] = "INCLUDE_MATCH_TOKEN";
        TokenType[TokenType["LEFT_CURLY_BRACKET_TOKEN"] = 11] = "LEFT_CURLY_BRACKET_TOKEN";
        TokenType[TokenType["RIGHT_CURLY_BRACKET_TOKEN"] = 12] = "RIGHT_CURLY_BRACKET_TOKEN";
        TokenType[TokenType["SUFFIX_MATCH_TOKEN"] = 13] = "SUFFIX_MATCH_TOKEN";
        TokenType[TokenType["SUBSTRING_MATCH_TOKEN"] = 14] = "SUBSTRING_MATCH_TOKEN";
        TokenType[TokenType["DIMENSION_TOKEN"] = 15] = "DIMENSION_TOKEN";
        TokenType[TokenType["PERCENTAGE_TOKEN"] = 16] = "PERCENTAGE_TOKEN";
        TokenType[TokenType["NUMBER_TOKEN"] = 17] = "NUMBER_TOKEN";
        TokenType[TokenType["FUNCTION"] = 18] = "FUNCTION";
        TokenType[TokenType["FUNCTION_TOKEN"] = 19] = "FUNCTION_TOKEN";
        TokenType[TokenType["IDENT_TOKEN"] = 20] = "IDENT_TOKEN";
        TokenType[TokenType["COLUMN_TOKEN"] = 21] = "COLUMN_TOKEN";
        TokenType[TokenType["URL_TOKEN"] = 22] = "URL_TOKEN";
        TokenType[TokenType["BAD_URL_TOKEN"] = 23] = "BAD_URL_TOKEN";
        TokenType[TokenType["CDC_TOKEN"] = 24] = "CDC_TOKEN";
        TokenType[TokenType["CDO_TOKEN"] = 25] = "CDO_TOKEN";
        TokenType[TokenType["COLON_TOKEN"] = 26] = "COLON_TOKEN";
        TokenType[TokenType["SEMICOLON_TOKEN"] = 27] = "SEMICOLON_TOKEN";
        TokenType[TokenType["LEFT_SQUARE_BRACKET_TOKEN"] = 28] = "LEFT_SQUARE_BRACKET_TOKEN";
        TokenType[TokenType["RIGHT_SQUARE_BRACKET_TOKEN"] = 29] = "RIGHT_SQUARE_BRACKET_TOKEN";
        TokenType[TokenType["UNICODE_RANGE_TOKEN"] = 30] = "UNICODE_RANGE_TOKEN";
        TokenType[TokenType["WHITESPACE_TOKEN"] = 31] = "WHITESPACE_TOKEN";
        TokenType[TokenType["EOF_TOKEN"] = 32] = "EOF_TOKEN";
    })(TokenType || (TokenType = {}));
    var FLAG_UNRESTRICTED = 1 << 0;
    var FLAG_ID = 1 << 1;
    var FLAG_INTEGER = 1 << 2;
    var FLAG_NUMBER = 1 << 3;
    var LINE_FEED = 0x000a;
    var SOLIDUS = 0x002f;
    var REVERSE_SOLIDUS = 0x005c;
    var CHARACTER_TABULATION = 0x0009;
    var SPACE$1 = 0x0020;
    var QUOTATION_MARK = 0x0022;
    var EQUALS_SIGN = 0x003d;
    var NUMBER_SIGN = 0x0023;
    var DOLLAR_SIGN = 0x0024;
    var PERCENTAGE_SIGN = 0x0025;
    var APOSTROPHE = 0x0027;
    var LEFT_PARENTHESIS = 0x0028;
    var RIGHT_PARENTHESIS = 0x0029;
    var LOW_LINE = 0x005f;
    var HYPHEN_MINUS = 0x002d;
    var EXCLAMATION_MARK = 0x0021;
    var LESS_THAN_SIGN = 0x003c;
    var GREATER_THAN_SIGN = 0x003e;
    var COMMERCIAL_AT = 0x0040;
    var LEFT_SQUARE_BRACKET = 0x005b;
    var RIGHT_SQUARE_BRACKET = 0x005d;
    var CIRCUMFLEX_ACCENT = 0x003d;
    var LEFT_CURLY_BRACKET = 0x007b;
    var QUESTION_MARK = 0x003f;
    var RIGHT_CURLY_BRACKET = 0x007d;
    var VERTICAL_LINE = 0x007c;
    var TILDE = 0x007e;
    var CONTROL = 0x0080;
    var REPLACEMENT_CHARACTER = 0xfffd;
    var ASTERISK = 0x002a;
    var PLUS_SIGN = 0x002b;
    var COMMA = 0x002c;
    var COLON = 0x003a;
    var SEMICOLON = 0x003b;
    var FULL_STOP = 0x002e;
    var NULL = 0x0000;
    var BACKSPACE = 0x0008;
    var LINE_TABULATION = 0x000b;
    var SHIFT_OUT = 0x000e;
    var INFORMATION_SEPARATOR_ONE = 0x001f;
    var DELETE = 0x007f;
    var EOF = -1;
    var ZERO = 0x0030;
    var a = 0x0061;
    var e = 0x0065;
    var f = 0x0066;
    var u = 0x0075;
    var z = 0x007a;
    var A = 0x0041;
    var E = 0x0045;
    var F = 0x0046;
    var U = 0x0055;
    var Z = 0x005a;
    var isDigit = function (codePoint) { return codePoint >= ZERO && codePoint <= 0x0039; };
    var isSurrogateCodePoint = function (codePoint) { return codePoint >= 0xd800 && codePoint <= 0xdfff; };
    var isHex = function (codePoint) {
        return isDigit(codePoint) || (codePoint >= A && codePoint <= F) || (codePoint >= a && codePoint <= f);
    };
    var isLowerCaseLetter = function (codePoint) { return codePoint >= a && codePoint <= z; };
    var isUpperCaseLetter = function (codePoint) { return codePoint >= A && codePoint <= Z; };
    var isLetter = function (codePoint) { return isLowerCaseLetter(codePoint) || isUpperCaseLetter(codePoint); };
    var isNonASCIICodePoint = function (codePoint) { return codePoint >= CONTROL; };
    var isWhiteSpace = function (codePoint) {
        return codePoint === LINE_FEED || codePoint === CHARACTER_TABULATION || codePoint === SPACE$1;
    };
    var isNameStartCodePoint = function (codePoint) {
        return isLetter(codePoint) || isNonASCIICodePoint(codePoint) || codePoint === LOW_LINE;
    };
    var isNameCodePoint = function (codePoint) {
        return isNameStartCodePoint(codePoint) || isDigit(codePoint) || codePoint === HYPHEN_MINUS;
    };
    var isNonPrintableCodePoint = function (codePoint) {
        return ((codePoint >= NULL && codePoint <= BACKSPACE) ||
            codePoint === LINE_TABULATION ||
            (codePoint >= SHIFT_OUT && codePoint <= INFORMATION_SEPARATOR_ONE) ||
            codePoint === DELETE);
    };
    var isValidEscape = function (c1, c2) {
        if (c1 !== REVERSE_SOLIDUS) {
            return false;
        }
        return c2 !== LINE_FEED;
    };
    var isIdentifierStart = function (c1, c2, c3) {
        if (c1 === HYPHEN_MINUS) {
            return isNameStartCodePoint(c2) || isValidEscape(c2, c3);
        }
        else if (isNameStartCodePoint(c1)) {
            return true;
        }
        else if (c1 === REVERSE_SOLIDUS && isValidEscape(c1, c2)) {
            return true;
        }
        return false;
    };
    var isNumberStart = function (c1, c2, c3) {
        if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
            if (isDigit(c2)) {
                return true;
            }
            return c2 === FULL_STOP && isDigit(c3);
        }
        if (c1 === FULL_STOP) {
            return isDigit(c2);
        }
        return isDigit(c1);
    };
    var stringToNumber = function (codePoints) {
        var c = 0;
        var sign = 1;
        if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {
            if (codePoints[c] === HYPHEN_MINUS) {
                sign = -1;
            }
            c++;
        }
        var integers = [];
        while (isDigit(codePoints[c])) {
            integers.push(codePoints[c++]);
        }
        var int = integers.length ? parseInt(fromCodePoint.apply(void 0, integers), 10) : 0;
        if (codePoints[c] === FULL_STOP) {
            c++;
        }
        var fraction = [];
        while (isDigit(codePoints[c])) {
            fraction.push(codePoints[c++]);
        }
        var fracd = fraction.length;
        var frac = fracd ? parseInt(fromCodePoint.apply(void 0, fraction), 10) : 0;
        if (codePoints[c] === E || codePoints[c] === e) {
            c++;
        }
        var expsign = 1;
        if (codePoints[c] === PLUS_SIGN || codePoints[c] === HYPHEN_MINUS) {
            if (codePoints[c] === HYPHEN_MINUS) {
                expsign = -1;
            }
            c++;
        }
        var exponent = [];
        while (isDigit(codePoints[c])) {
            exponent.push(codePoints[c++]);
        }
        var exp = exponent.length ? parseInt(fromCodePoint.apply(void 0, exponent), 10) : 0;
        return sign * (int + frac * Math.pow(10, -fracd)) * Math.pow(10, expsign * exp);
    };
    var LEFT_PARENTHESIS_TOKEN = {
        type: TokenType.LEFT_PARENTHESIS_TOKEN
    };
    var RIGHT_PARENTHESIS_TOKEN = {
        type: TokenType.RIGHT_PARENTHESIS_TOKEN
    };
    var COMMA_TOKEN = { type: TokenType.COMMA_TOKEN };
    var SUFFIX_MATCH_TOKEN = { type: TokenType.SUFFIX_MATCH_TOKEN };
    var PREFIX_MATCH_TOKEN = { type: TokenType.PREFIX_MATCH_TOKEN };
    var COLUMN_TOKEN = { type: TokenType.COLUMN_TOKEN };
    var DASH_MATCH_TOKEN = { type: TokenType.DASH_MATCH_TOKEN };
    var INCLUDE_MATCH_TOKEN = { type: TokenType.INCLUDE_MATCH_TOKEN };
    var LEFT_CURLY_BRACKET_TOKEN = {
        type: TokenType.LEFT_CURLY_BRACKET_TOKEN
    };
    var RIGHT_CURLY_BRACKET_TOKEN = {
        type: TokenType.RIGHT_CURLY_BRACKET_TOKEN
    };
    var SUBSTRING_MATCH_TOKEN = { type: TokenType.SUBSTRING_MATCH_TOKEN };
    var BAD_URL_TOKEN = { type: TokenType.BAD_URL_TOKEN };
    var BAD_STRING_TOKEN = { type: TokenType.BAD_STRING_TOKEN };
    var CDO_TOKEN = { type: TokenType.CDO_TOKEN };
    var CDC_TOKEN = { type: TokenType.CDC_TOKEN };
    var COLON_TOKEN = { type: TokenType.COLON_TOKEN };
    var SEMICOLON_TOKEN = { type: TokenType.SEMICOLON_TOKEN };
    var LEFT_SQUARE_BRACKET_TOKEN = {
        type: TokenType.LEFT_SQUARE_BRACKET_TOKEN
    };
    var RIGHT_SQUARE_BRACKET_TOKEN = {
        type: TokenType.RIGHT_SQUARE_BRACKET_TOKEN
    };
    var WHITESPACE_TOKEN = { type: TokenType.WHITESPACE_TOKEN };
    var EOF_TOKEN = { type: TokenType.EOF_TOKEN };
    var Tokenizer = /** @class */ (function () {
        function Tokenizer() {
            this._value = [];
        }
        Tokenizer.prototype.write = function (chunk) {
            this._value = this._value.concat(toCodePoints(chunk));
        };
        Tokenizer.prototype.read = function () {
            var tokens = [];
            var token = this.consumeToken();
            while (token !== EOF_TOKEN) {
                tokens.push(token);
                token = this.consumeToken();
            }
            return tokens;
        };
        Tokenizer.prototype.consumeToken = function () {
            var codePoint = this.consumeCodePoint();
            switch (codePoint) {
                case QUOTATION_MARK:
                    return this.consumeStringToken(QUOTATION_MARK);
                case NUMBER_SIGN:
                    var c1 = this.peekCodePoint(0);
                    var c2 = this.peekCodePoint(1);
                    var c3 = this.peekCodePoint(2);
                    if (isNameCodePoint(c1) || isValidEscape(c2, c3)) {
                        var flags = isIdentifierStart(c1, c2, c3) ? FLAG_ID : FLAG_UNRESTRICTED;
                        var value = this.consumeName();
                        return { type: TokenType.HASH_TOKEN, value: value, flags: flags };
                    }
                    break;
                case DOLLAR_SIGN:
                    if (this.peekCodePoint(0) === EQUALS_SIGN) {
                        this.consumeCodePoint();
                        return SUFFIX_MATCH_TOKEN;
                    }
                    break;
                case APOSTROPHE:
                    return this.consumeStringToken(APOSTROPHE);
                case LEFT_PARENTHESIS:
                    return LEFT_PARENTHESIS_TOKEN;
                case RIGHT_PARENTHESIS:
                    return RIGHT_PARENTHESIS_TOKEN;
                case ASTERISK:
                    if (this.peekCodePoint(0) === EQUALS_SIGN) {
                        this.consumeCodePoint();
                        return SUBSTRING_MATCH_TOKEN;
                    }
                    break;
                case PLUS_SIGN:
                    if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {
                        this.reconsumeCodePoint(codePoint);
                        return this.consumeNumericToken();
                    }
                    break;
                case COMMA:
                    return COMMA_TOKEN;
                case HYPHEN_MINUS:
                    var e1 = codePoint;
                    var e2 = this.peekCodePoint(0);
                    var e3 = this.peekCodePoint(1);
                    if (isNumberStart(e1, e2, e3)) {
                        this.reconsumeCodePoint(codePoint);
                        return this.consumeNumericToken();
                    }
                    if (isIdentifierStart(e1, e2, e3)) {
                        this.reconsumeCodePoint(codePoint);
                        return this.consumeIdentLikeToken();
                    }
                    if (e2 === HYPHEN_MINUS && e3 === GREATER_THAN_SIGN) {
                        this.consumeCodePoint();
                        this.consumeCodePoint();
                        return CDC_TOKEN;
                    }
                    break;
                case FULL_STOP:
                    if (isNumberStart(codePoint, this.peekCodePoint(0), this.peekCodePoint(1))) {
                        this.reconsumeCodePoint(codePoint);
                        return this.consumeNumericToken();
                    }
                    break;
                case SOLIDUS:
                    if (this.peekCodePoint(0) === ASTERISK) {
                        this.consumeCodePoint();
                        while (true) {
                            var c = this.consumeCodePoint();
                            if (c === ASTERISK) {
                                c = this.consumeCodePoint();
                                if (c === SOLIDUS) {
                                    return this.consumeToken();
                                }
                            }
                            if (c === EOF) {
                                return this.consumeToken();
                            }
                        }
                    }
                    break;
                case COLON:
                    return COLON_TOKEN;
                case SEMICOLON:
                    return SEMICOLON_TOKEN;
                case LESS_THAN_SIGN:
                    if (this.peekCodePoint(0) === EXCLAMATION_MARK &&
                        this.peekCodePoint(1) === HYPHEN_MINUS &&
                        this.peekCodePoint(2) === HYPHEN_MINUS) {
                        this.consumeCodePoint();
                        this.consumeCodePoint();
                        return CDO_TOKEN;
                    }
                    break;
                case COMMERCIAL_AT:
                    var a1 = this.peekCodePoint(0);
                    var a2 = this.peekCodePoint(1);
                    var a3 = this.peekCodePoint(2);
                    if (isIdentifierStart(a1, a2, a3)) {
                        var value = this.consumeName();
                        return { type: TokenType.AT_KEYWORD_TOKEN, value: value };
                    }
                    break;
                case LEFT_SQUARE_BRACKET:
                    return LEFT_SQUARE_BRACKET_TOKEN;
                case REVERSE_SOLIDUS:
                    if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                        this.reconsumeCodePoint(codePoint);
                        return this.consumeIdentLikeToken();
                    }
                    break;
                case RIGHT_SQUARE_BRACKET:
                    return RIGHT_SQUARE_BRACKET_TOKEN;
                case CIRCUMFLEX_ACCENT:
                    if (this.peekCodePoint(0) === EQUALS_SIGN) {
                        this.consumeCodePoint();
                        return PREFIX_MATCH_TOKEN;
                    }
                    break;
                case LEFT_CURLY_BRACKET:
                    return LEFT_CURLY_BRACKET_TOKEN;
                case RIGHT_CURLY_BRACKET:
                    return RIGHT_CURLY_BRACKET_TOKEN;
                case u:
                case U:
                    var u1 = this.peekCodePoint(0);
                    var u2 = this.peekCodePoint(1);
                    if (u1 === PLUS_SIGN && (isHex(u2) || u2 === QUESTION_MARK)) {
                        this.consumeCodePoint();
                        this.consumeUnicodeRangeToken();
                    }
                    this.reconsumeCodePoint(codePoint);
                    return this.consumeIdentLikeToken();
                case VERTICAL_LINE:
                    if (this.peekCodePoint(0) === EQUALS_SIGN) {
                        this.consumeCodePoint();
                        return DASH_MATCH_TOKEN;
                    }
                    if (this.peekCodePoint(0) === VERTICAL_LINE) {
                        this.consumeCodePoint();
                        return COLUMN_TOKEN;
                    }
                    break;
                case TILDE:
                    if (this.peekCodePoint(0) === EQUALS_SIGN) {
                        this.consumeCodePoint();
                        return INCLUDE_MATCH_TOKEN;
                    }
                    break;
                case EOF:
                    return EOF_TOKEN;
            }
            if (isWhiteSpace(codePoint)) {
                this.consumeWhiteSpace();
                return WHITESPACE_TOKEN;
            }
            if (isDigit(codePoint)) {
                this.reconsumeCodePoint(codePoint);
                return this.consumeNumericToken();
            }
            if (isNameStartCodePoint(codePoint)) {
                this.reconsumeCodePoint(codePoint);
                return this.consumeIdentLikeToken();
            }
            return { type: TokenType.DELIM_TOKEN, value: fromCodePoint(codePoint) };
        };
        Tokenizer.prototype.consumeCodePoint = function () {
            var value = this._value.shift();
            return typeof value === 'undefined' ? -1 : value;
        };
        Tokenizer.prototype.reconsumeCodePoint = function (codePoint) {
            this._value.unshift(codePoint);
        };
        Tokenizer.prototype.peekCodePoint = function (delta) {
            if (delta >= this._value.length) {
                return -1;
            }
            return this._value[delta];
        };
        Tokenizer.prototype.consumeUnicodeRangeToken = function () {
            var digits = [];
            var codePoint = this.consumeCodePoint();
            while (isHex(codePoint) && digits.length < 6) {
                digits.push(codePoint);
                codePoint = this.consumeCodePoint();
            }
            var questionMarks = false;
            while (codePoint === QUESTION_MARK && digits.length < 6) {
                digits.push(codePoint);
                codePoint = this.consumeCodePoint();
                questionMarks = true;
            }
            if (questionMarks) {
                var start_1 = parseInt(fromCodePoint.apply(void 0, digits.map(function (digit) { return (digit === QUESTION_MARK ? ZERO : digit); })), 16);
                var end = parseInt(fromCodePoint.apply(void 0, digits.map(function (digit) { return (digit === QUESTION_MARK ? F : digit); })), 16);
                return { type: TokenType.UNICODE_RANGE_TOKEN, start: start_1, end: end };
            }
            var start = parseInt(fromCodePoint.apply(void 0, digits), 16);
            if (this.peekCodePoint(0) === HYPHEN_MINUS && isHex(this.peekCodePoint(1))) {
                this.consumeCodePoint();
                codePoint = this.consumeCodePoint();
                var endDigits = [];
                while (isHex(codePoint) && endDigits.length < 6) {
                    endDigits.push(codePoint);
                    codePoint = this.consumeCodePoint();
                }
                var end = parseInt(fromCodePoint.apply(void 0, endDigits), 16);
                return { type: TokenType.UNICODE_RANGE_TOKEN, start: start, end: end };
            }
            else {
                return { type: TokenType.UNICODE_RANGE_TOKEN, start: start, end: start };
            }
        };
        Tokenizer.prototype.consumeIdentLikeToken = function () {
            var value = this.consumeName();
            if (value.toLowerCase() === 'url' && this.peekCodePoint(0) === LEFT_PARENTHESIS) {
                this.consumeCodePoint();
                return this.consumeUrlToken();
            }
            else if (this.peekCodePoint(0) === LEFT_PARENTHESIS) {
                this.consumeCodePoint();
                return { type: TokenType.FUNCTION_TOKEN, value: value };
            }
            return { type: TokenType.IDENT_TOKEN, value: value };
        };
        Tokenizer.prototype.consumeUrlToken = function () {
            var value = [];
            this.consumeWhiteSpace();
            if (this.peekCodePoint(0) === EOF) {
                return { type: TokenType.URL_TOKEN, value: '' };
            }
            var next = this.peekCodePoint(0);
            if (next === APOSTROPHE || next === QUOTATION_MARK) {
                var stringToken = this.consumeStringToken(this.consumeCodePoint());
                if (stringToken.type === TokenType.STRING_TOKEN) {
                    this.consumeWhiteSpace();
                    if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
                        this.consumeCodePoint();
                        return { type: TokenType.URL_TOKEN, value: stringToken.value };
                    }
                }
                this.consumeBadUrlRemnants();
                return BAD_URL_TOKEN;
            }
            while (true) {
                var codePoint = this.consumeCodePoint();
                if (codePoint === EOF || codePoint === RIGHT_PARENTHESIS) {
                    return { type: TokenType.URL_TOKEN, value: fromCodePoint.apply(void 0, value) };
                }
                else if (isWhiteSpace(codePoint)) {
                    this.consumeWhiteSpace();
                    if (this.peekCodePoint(0) === EOF || this.peekCodePoint(0) === RIGHT_PARENTHESIS) {
                        this.consumeCodePoint();
                        return { type: TokenType.URL_TOKEN, value: fromCodePoint.apply(void 0, value) };
                    }
                    this.consumeBadUrlRemnants();
                    return BAD_URL_TOKEN;
                }
                else if (codePoint === QUOTATION_MARK ||
                    codePoint === APOSTROPHE ||
                    codePoint === LEFT_PARENTHESIS ||
                    isNonPrintableCodePoint(codePoint)) {
                    this.consumeBadUrlRemnants();
                    return BAD_URL_TOKEN;
                }
                else if (codePoint === REVERSE_SOLIDUS) {
                    if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                        value.push(this.consumeEscapedCodePoint());
                    }
                    else {
                        this.consumeBadUrlRemnants();
                        return BAD_URL_TOKEN;
                    }
                }
                else {
                    value.push(codePoint);
                }
            }
        };
        Tokenizer.prototype.consumeWhiteSpace = function () {
            while (isWhiteSpace(this.peekCodePoint(0))) {
                this.consumeCodePoint();
            }
        };
        Tokenizer.prototype.consumeBadUrlRemnants = function () {
            while (true) {
                var codePoint = this.consumeCodePoint();
                if (codePoint === RIGHT_PARENTHESIS || codePoint === EOF) {
                    return;
                }
                if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                    this.consumeEscapedCodePoint();
                }
            }
        };
        Tokenizer.prototype.consumeStringSlice = function (count) {
            var SLICE_STACK_SIZE = 60000;
            var value = '';
            while (count > 0) {
                var amount = Math.min(SLICE_STACK_SIZE, count);
                value += fromCodePoint.apply(void 0, this._value.splice(0, amount));
                count -= amount;
            }
            this._value.shift();
            return value;
        };
        Tokenizer.prototype.consumeStringToken = function (endingCodePoint) {
            var value = '';
            var i = 0;
            do {
                var codePoint = this._value[i];
                if (codePoint === EOF || codePoint === undefined || codePoint === endingCodePoint) {
                    value += this.consumeStringSlice(i);
                    return { type: TokenType.STRING_TOKEN, value: value };
                }
                if (codePoint === LINE_FEED) {
                    this._value.splice(0, i);
                    return BAD_STRING_TOKEN;
                }
                if (codePoint === REVERSE_SOLIDUS) {
                    var next = this._value[i + 1];
                    if (next !== EOF && next !== undefined) {
                        if (next === LINE_FEED) {
                            value += this.consumeStringSlice(i);
                            i = -1;
                            this._value.shift();
                        }
                        else if (isValidEscape(codePoint, next)) {
                            value += this.consumeStringSlice(i);
                            value += fromCodePoint(this.consumeEscapedCodePoint());
                            i = -1;
                        }
                    }
                }
                i++;
            } while (true);
        };
        Tokenizer.prototype.consumeNumber = function () {
            var repr = [];
            var type = FLAG_INTEGER;
            var c1 = this.peekCodePoint(0);
            if (c1 === PLUS_SIGN || c1 === HYPHEN_MINUS) {
                repr.push(this.consumeCodePoint());
            }
            while (isDigit(this.peekCodePoint(0))) {
                repr.push(this.consumeCodePoint());
            }
            c1 = this.peekCodePoint(0);
            var c2 = this.peekCodePoint(1);
            if (c1 === FULL_STOP && isDigit(c2)) {
                repr.push(this.consumeCodePoint(), this.consumeCodePoint());
                type = FLAG_NUMBER;
                while (isDigit(this.peekCodePoint(0))) {
                    repr.push(this.consumeCodePoint());
                }
            }
            c1 = this.peekCodePoint(0);
            c2 = this.peekCodePoint(1);
            var c3 = this.peekCodePoint(2);
            if ((c1 === E || c1 === e) && (((c2 === PLUS_SIGN || c2 === HYPHEN_MINUS) && isDigit(c3)) || isDigit(c2))) {
                repr.push(this.consumeCodePoint(), this.consumeCodePoint());
                type = FLAG_NUMBER;
                while (isDigit(this.peekCodePoint(0))) {
                    repr.push(this.consumeCodePoint());
                }
            }
            return [stringToNumber(repr), type];
        };
        Tokenizer.prototype.consumeNumericToken = function () {
            var _a = this.consumeNumber(), number = _a[0], flags = _a[1];
            var c1 = this.peekCodePoint(0);
            var c2 = this.peekCodePoint(1);
            var c3 = this.peekCodePoint(2);
            if (isIdentifierStart(c1, c2, c3)) {
                var unit = this.consumeName();
                return { type: TokenType.DIMENSION_TOKEN, number: number, flags: flags, unit: unit };
            }
            if (c1 === PERCENTAGE_SIGN) {
                this.consumeCodePoint();
                return { type: TokenType.PERCENTAGE_TOKEN, number: number, flags: flags };
            }
            return { type: TokenType.NUMBER_TOKEN, number: number, flags: flags };
        };
        Tokenizer.prototype.consumeEscapedCodePoint = function () {
            var codePoint = this.consumeCodePoint();
            if (isHex(codePoint)) {
                var hex = fromCodePoint(codePoint);
                while (isHex(this.peekCodePoint(0)) && hex.length < 6) {
                    hex += fromCodePoint(this.consumeCodePoint());
                }
                if (isWhiteSpace(this.peekCodePoint(0))) {
                    this.consumeCodePoint();
                }
                var hexCodePoint = parseInt(hex, 16);
                if (hexCodePoint === 0 || isSurrogateCodePoint(hexCodePoint) || hexCodePoint > 0x10ffff) {
                    return REPLACEMENT_CHARACTER;
                }
                return hexCodePoint;
            }
            if (codePoint === EOF) {
                return REPLACEMENT_CHARACTER;
            }
            return codePoint;
        };
        Tokenizer.prototype.consumeName = function () {
            var result = '';
            while (true) {
                var codePoint = this.consumeCodePoint();
                if (isNameCodePoint(codePoint)) {
                    result += fromCodePoint(codePoint);
                }
                else if (isValidEscape(codePoint, this.peekCodePoint(0))) {
                    result += fromCodePoint(this.consumeEscapedCodePoint());
                }
                else {
                    this.reconsumeCodePoint(codePoint);
                    return result;
                }
            }
        };
        return Tokenizer;
    }());

    var Parser = /** @class */ (function () {
        function Parser(tokens) {
            this._tokens = tokens;
        }
        Parser.create = function (value) {
            var tokenizer = new Tokenizer();
            tokenizer.write(value);
            return new Parser(tokenizer.read());
        };
        Parser.parseValue = function (value) {
            return Parser.create(value).parseComponentValue();
        };
        Parser.parseValues = function (value) {
            return Parser.create(value).parseComponentValues();
        };
        Parser.prototype.parseComponentValue = function () {
            var token = this.consumeToken();
            while (token.type === TokenType.WHITESPACE_TOKEN) {
                token = this.consumeToken();
            }
            if (token.type === TokenType.EOF_TOKEN) {
                throw new SyntaxError("Error parsing CSS component value, unexpected EOF");
            }
            this.reconsumeToken(token);
            var value = this.consumeComponentValue();
            do {
                token = this.consumeToken();
            } while (token.type === TokenType.WHITESPACE_TOKEN);
            if (token.type === TokenType.EOF_TOKEN) {
                return value;
            }
            throw new SyntaxError("Error parsing CSS component value, multiple values found when expecting only one");
        };
        Parser.prototype.parseComponentValues = function () {
            var values = [];
            while (true) {
                var value = this.consumeComponentValue();
                if (value.type === TokenType.EOF_TOKEN) {
                    return values;
                }
                values.push(value);
                values.push();
            }
        };
        Parser.prototype.consumeComponentValue = function () {
            var token = this.consumeToken();
            switch (token.type) {
                case TokenType.LEFT_CURLY_BRACKET_TOKEN:
                case TokenType.LEFT_SQUARE_BRACKET_TOKEN:
                case TokenType.LEFT_PARENTHESIS_TOKEN:
                    return this.consumeSimpleBlock(token.type);
                case TokenType.FUNCTION_TOKEN:
                    return this.consumeFunction(token);
            }
            return token;
        };
        Parser.prototype.consumeSimpleBlock = function (type) {
            var block = { type: type, values: [] };
            var token = this.consumeToken();
            while (true) {
                if (token.type === TokenType.EOF_TOKEN || isEndingTokenFor(token, type)) {
                    return block;
                }
                this.reconsumeToken(token);
                block.values.push(this.consumeComponentValue());
                token = this.consumeToken();
            }
        };
        Parser.prototype.consumeFunction = function (functionToken) {
            var cssFunction = {
                name: functionToken.value,
                values: [],
                type: TokenType.FUNCTION
            };
            while (true) {
                var token = this.consumeToken();
                if (token.type === TokenType.EOF_TOKEN || token.type === TokenType.RIGHT_PARENTHESIS_TOKEN) {
                    return cssFunction;
                }
                this.reconsumeToken(token);
                cssFunction.values.push(this.consumeComponentValue());
            }
        };
        Parser.prototype.consumeToken = function () {
            var token = this._tokens.shift();
            return typeof token === 'undefined' ? EOF_TOKEN : token;
        };
        Parser.prototype.reconsumeToken = function (token) {
            this._tokens.unshift(token);
        };
        return Parser;
    }());
    var isDimensionToken = function (token) { return token.type === TokenType.DIMENSION_TOKEN; };
    var isNumberToken = function (token) { return token.type === TokenType.NUMBER_TOKEN; };
    var isIdentToken = function (token) { return token.type === TokenType.IDENT_TOKEN; };
    var isStringToken = function (token) { return token.type === TokenType.STRING_TOKEN; };
    var isIdentWithValue = function (token, value) {
        return isIdentToken(token) && token.value === value;
    };
    var nonWhiteSpace = function (token) { return token.type !== TokenType.WHITESPACE_TOKEN; };
    var nonFunctionArgSeparator = function (token) {
        return token.type !== TokenType.WHITESPACE_TOKEN && token.type !== TokenType.COMMA_TOKEN;
    };
    var parseFunctionArgs = function (tokens) {
        var args = [];
        var arg = [];
        tokens.forEach(function (token) {
            if (token.type === TokenType.COMMA_TOKEN) {
                if (arg.length === 0) {
                    throw new Error("Error parsing function args, zero tokens for arg");
                }
                args.push(arg);
                arg = [];
                return;
            }
            if (token.type !== TokenType.WHITESPACE_TOKEN) {
                arg.push(token);
            }
        });
        if (arg.length) {
            args.push(arg);
        }
        return args;
    };
    var isEndingTokenFor = function (token, type) {
        if (type === TokenType.LEFT_CURLY_BRACKET_TOKEN && token.type === TokenType.RIGHT_CURLY_BRACKET_TOKEN) {
            return true;
        }
        if (type === TokenType.LEFT_SQUARE_BRACKET_TOKEN && token.type === TokenType.RIGHT_SQUARE_BRACKET_TOKEN) {
            return true;
        }
        return type === TokenType.LEFT_PARENTHESIS_TOKEN && token.type === TokenType.RIGHT_PARENTHESIS_TOKEN;
    };

    var isLength = function (token) {
        return token.type === TokenType.NUMBER_TOKEN || token.type === TokenType.DIMENSION_TOKEN;
    };

    var isLengthPercentage = function (token) {
        return token.type === TokenType.PERCENTAGE_TOKEN || isLength(token);
    };
    var parseLengthPercentageTuple = function (tokens) {
        return tokens.length > 1 ? [tokens[0], tokens[1]] : [tokens[0]];
    };
    var ZERO_LENGTH = {
        type: TokenType.NUMBER_TOKEN,
        number: 0,
        flags: FLAG_INTEGER
    };
    var FIFTY_PERCENT = {
        type: TokenType.PERCENTAGE_TOKEN,
        number: 50,
        flags: FLAG_INTEGER
    };
    var HUNDRED_PERCENT = {
        type: TokenType.PERCENTAGE_TOKEN,
        number: 100,
        flags: FLAG_INTEGER
    };
    var getAbsoluteValueForTuple = function (tuple, width, height) {
        var x = tuple[0], y = tuple[1];
        return [getAbsoluteValue(x, width), getAbsoluteValue(typeof y !== 'undefined' ? y : x, height)];
    };
    var getAbsoluteValue = function (token, parent) {
        if (token.type === TokenType.PERCENTAGE_TOKEN) {
            return (token.number / 100) * parent;
        }
        if (isDimensionToken(token)) {
            switch (token.unit) {
                case 'rem':
                case 'em':
                    return 16 * token.number; // TODO use correct font-size
                case 'px':
                default:
                    return token.number;
            }
        }
        return token.number;
    };

    var DEG = 'deg';
    var GRAD = 'grad';
    var RAD = 'rad';
    var TURN = 'turn';
    var angle = {
        name: 'angle',
        parse: function (value) {
            if (value.type === TokenType.DIMENSION_TOKEN) {
                switch (value.unit) {
                    case DEG:
                        return (Math.PI * value.number) / 180;
                    case GRAD:
                        return (Math.PI / 200) * value.number;
                    case RAD:
                        return value.number;
                    case TURN:
                        return Math.PI * 2 * value.number;
                }
            }
            throw new Error("Unsupported angle type");
        }
    };
    var isAngle = function (value) {
        if (value.type === TokenType.DIMENSION_TOKEN) {
            if (value.unit === DEG || value.unit === GRAD || value.unit === RAD || value.unit === TURN) {
                return true;
            }
        }
        return false;
    };
    var parseNamedSide = function (tokens) {
        var sideOrCorner = tokens
            .filter(isIdentToken)
            .map(function (ident) { return ident.value; })
            .join(' ');
        switch (sideOrCorner) {
            case 'to bottom right':
            case 'to right bottom':
            case 'left top':
            case 'top left':
                return [ZERO_LENGTH, ZERO_LENGTH];
            case 'to top':
            case 'bottom':
                return deg(0);
            case 'to bottom left':
            case 'to left bottom':
            case 'right top':
            case 'top right':
                return [ZERO_LENGTH, HUNDRED_PERCENT];
            case 'to right':
            case 'left':
                return deg(90);
            case 'to top left':
            case 'to left top':
            case 'right bottom':
            case 'bottom right':
                return [HUNDRED_PERCENT, HUNDRED_PERCENT];
            case 'to bottom':
            case 'top':
                return deg(180);
            case 'to top right':
            case 'to right top':
            case 'left bottom':
            case 'bottom left':
                return [HUNDRED_PERCENT, ZERO_LENGTH];
            case 'to left':
            case 'right':
                return deg(270);
        }
        return 0;
    };
    var deg = function (deg) { return (Math.PI * deg) / 180; };

    var color = {
        name: 'color',
        parse: function (value) {
            if (value.type === TokenType.FUNCTION) {
                var colorFunction = SUPPORTED_COLOR_FUNCTIONS[value.name];
                if (typeof colorFunction === 'undefined') {
                    throw new Error("Attempting to parse an unsupported color function \"" + value.name + "\"");
                }
                return colorFunction(value.values);
            }
            if (value.type === TokenType.HASH_TOKEN) {
                if (value.value.length === 3) {
                    var r = value.value.substring(0, 1);
                    var g = value.value.substring(1, 2);
                    var b = value.value.substring(2, 3);
                    return pack(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16), 1);
                }
                if (value.value.length === 4) {
                    var r = value.value.substring(0, 1);
                    var g = value.value.substring(1, 2);
                    var b = value.value.substring(2, 3);
                    var a = value.value.substring(3, 4);
                    return pack(parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16), parseInt(a + a, 16) / 255);
                }
                if (value.value.length === 6) {
                    var r = value.value.substring(0, 2);
                    var g = value.value.substring(2, 4);
                    var b = value.value.substring(4, 6);
                    return pack(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), 1);
                }
                if (value.value.length === 8) {
                    var r = value.value.substring(0, 2);
                    var g = value.value.substring(2, 4);
                    var b = value.value.substring(4, 6);
                    var a = value.value.substring(6, 8);
                    return pack(parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseInt(a, 16) / 255);
                }
            }
            if (value.type === TokenType.IDENT_TOKEN) {
                var namedColor = COLORS[value.value.toUpperCase()];
                if (typeof namedColor !== 'undefined') {
                    return namedColor;
                }
            }
            return COLORS.TRANSPARENT;
        }
    };
    var isTransparent = function (color) { return (0xff & color) === 0; };
    var asString = function (color) {
        var alpha = 0xff & color;
        var blue = 0xff & (color >> 8);
        var green = 0xff & (color >> 16);
        var red = 0xff & (color >> 24);
        return alpha < 255 ? "rgba(" + red + "," + green + "," + blue + "," + alpha / 255 + ")" : "rgb(" + red + "," + green + "," + blue + ")";
    };
    var pack = function (r, g, b, a) {
        return ((r << 24) | (g << 16) | (b << 8) | (Math.round(a * 255) << 0)) >>> 0;
    };
    var getTokenColorValue = function (token, i) {
        if (token.type === TokenType.NUMBER_TOKEN) {
            return token.number;
        }
        if (token.type === TokenType.PERCENTAGE_TOKEN) {
            var max = i === 3 ? 1 : 255;
            return i === 3 ? (token.number / 100) * max : Math.round((token.number / 100) * max);
        }
        return 0;
    };
    var rgb = function (args) {
        var tokens = args.filter(nonFunctionArgSeparator);
        if (tokens.length === 3) {
            var _a = tokens.map(getTokenColorValue), r = _a[0], g = _a[1], b = _a[2];
            return pack(r, g, b, 1);
        }
        if (tokens.length === 4) {
            var _b = tokens.map(getTokenColorValue), r = _b[0], g = _b[1], b = _b[2], a = _b[3];
            return pack(r, g, b, a);
        }
        return 0;
    };
    function hue2rgb(t1, t2, hue) {
        if (hue < 0) {
            hue += 1;
        }
        if (hue >= 1) {
            hue -= 1;
        }
        if (hue < 1 / 6) {
            return (t2 - t1) * hue * 6 + t1;
        }
        else if (hue < 1 / 2) {
            return t2;
        }
        else if (hue < 2 / 3) {
            return (t2 - t1) * 6 * (2 / 3 - hue) + t1;
        }
        else {
            return t1;
        }
    }
    var hsl = function (args) {
        var tokens = args.filter(nonFunctionArgSeparator);
        var hue = tokens[0], saturation = tokens[1], lightness = tokens[2], alpha = tokens[3];
        var h = (hue.type === TokenType.NUMBER_TOKEN ? deg(hue.number) : angle.parse(hue)) / (Math.PI * 2);
        var s = isLengthPercentage(saturation) ? saturation.number / 100 : 0;
        var l = isLengthPercentage(lightness) ? lightness.number / 100 : 0;
        var a = typeof alpha !== 'undefined' && isLengthPercentage(alpha) ? getAbsoluteValue(alpha, 1) : 1;
        if (s === 0) {
            return pack(l * 255, l * 255, l * 255, 1);
        }
        var t2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        var t1 = l * 2 - t2;
        var r = hue2rgb(t1, t2, h + 1 / 3);
        var g = hue2rgb(t1, t2, h);
        var b = hue2rgb(t1, t2, h - 1 / 3);
        return pack(r * 255, g * 255, b * 255, a);
    };
    var SUPPORTED_COLOR_FUNCTIONS = {
        hsl: hsl,
        hsla: hsl,
        rgb: rgb,
        rgba: rgb
    };
    var COLORS = {
        ALICEBLUE: 0xf0f8ffff,
        ANTIQUEWHITE: 0xfaebd7ff,
        AQUA: 0x00ffffff,
        AQUAMARINE: 0x7fffd4ff,
        AZURE: 0xf0ffffff,
        BEIGE: 0xf5f5dcff,
        BISQUE: 0xffe4c4ff,
        BLACK: 0x000000ff,
        BLANCHEDALMOND: 0xffebcdff,
        BLUE: 0x0000ffff,
        BLUEVIOLET: 0x8a2be2ff,
        BROWN: 0xa52a2aff,
        BURLYWOOD: 0xdeb887ff,
        CADETBLUE: 0x5f9ea0ff,
        CHARTREUSE: 0x7fff00ff,
        CHOCOLATE: 0xd2691eff,
        CORAL: 0xff7f50ff,
        CORNFLOWERBLUE: 0x6495edff,
        CORNSILK: 0xfff8dcff,
        CRIMSON: 0xdc143cff,
        CYAN: 0x00ffffff,
        DARKBLUE: 0x00008bff,
        DARKCYAN: 0x008b8bff,
        DARKGOLDENROD: 0xb886bbff,
        DARKGRAY: 0xa9a9a9ff,
        DARKGREEN: 0x006400ff,
        DARKGREY: 0xa9a9a9ff,
        DARKKHAKI: 0xbdb76bff,
        DARKMAGENTA: 0x8b008bff,
        DARKOLIVEGREEN: 0x556b2fff,
        DARKORANGE: 0xff8c00ff,
        DARKORCHID: 0x9932ccff,
        DARKRED: 0x8b0000ff,
        DARKSALMON: 0xe9967aff,
        DARKSEAGREEN: 0x8fbc8fff,
        DARKSLATEBLUE: 0x483d8bff,
        DARKSLATEGRAY: 0x2f4f4fff,
        DARKSLATEGREY: 0x2f4f4fff,
        DARKTURQUOISE: 0x00ced1ff,
        DARKVIOLET: 0x9400d3ff,
        DEEPPINK: 0xff1493ff,
        DEEPSKYBLUE: 0x00bfffff,
        DIMGRAY: 0x696969ff,
        DIMGREY: 0x696969ff,
        DODGERBLUE: 0x1e90ffff,
        FIREBRICK: 0xb22222ff,
        FLORALWHITE: 0xfffaf0ff,
        FORESTGREEN: 0x228b22ff,
        FUCHSIA: 0xff00ffff,
        GAINSBORO: 0xdcdcdcff,
        GHOSTWHITE: 0xf8f8ffff,
        GOLD: 0xffd700ff,
        GOLDENROD: 0xdaa520ff,
        GRAY: 0x808080ff,
        GREEN: 0x008000ff,
        GREENYELLOW: 0xadff2fff,
        GREY: 0x808080ff,
        HONEYDEW: 0xf0fff0ff,
        HOTPINK: 0xff69b4ff,
        INDIANRED: 0xcd5c5cff,
        INDIGO: 0x4b0082ff,
        IVORY: 0xfffff0ff,
        KHAKI: 0xf0e68cff,
        LAVENDER: 0xe6e6faff,
        LAVENDERBLUSH: 0xfff0f5ff,
        LAWNGREEN: 0x7cfc00ff,
        LEMONCHIFFON: 0xfffacdff,
        LIGHTBLUE: 0xadd8e6ff,
        LIGHTCORAL: 0xf08080ff,
        LIGHTCYAN: 0xe0ffffff,
        LIGHTGOLDENRODYELLOW: 0xfafad2ff,
        LIGHTGRAY: 0xd3d3d3ff,
        LIGHTGREEN: 0x90ee90ff,
        LIGHTGREY: 0xd3d3d3ff,
        LIGHTPINK: 0xffb6c1ff,
        LIGHTSALMON: 0xffa07aff,
        LIGHTSEAGREEN: 0x20b2aaff,
        LIGHTSKYBLUE: 0x87cefaff,
        LIGHTSLATEGRAY: 0x778899ff,
        LIGHTSLATEGREY: 0x778899ff,
        LIGHTSTEELBLUE: 0xb0c4deff,
        LIGHTYELLOW: 0xffffe0ff,
        LIME: 0x00ff00ff,
        LIMEGREEN: 0x32cd32ff,
        LINEN: 0xfaf0e6ff,
        MAGENTA: 0xff00ffff,
        MAROON: 0x800000ff,
        MEDIUMAQUAMARINE: 0x66cdaaff,
        MEDIUMBLUE: 0x0000cdff,
        MEDIUMORCHID: 0xba55d3ff,
        MEDIUMPURPLE: 0x9370dbff,
        MEDIUMSEAGREEN: 0x3cb371ff,
        MEDIUMSLATEBLUE: 0x7b68eeff,
        MEDIUMSPRINGGREEN: 0x00fa9aff,
        MEDIUMTURQUOISE: 0x48d1ccff,
        MEDIUMVIOLETRED: 0xc71585ff,
        MIDNIGHTBLUE: 0x191970ff,
        MINTCREAM: 0xf5fffaff,
        MISTYROSE: 0xffe4e1ff,
        MOCCASIN: 0xffe4b5ff,
        NAVAJOWHITE: 0xffdeadff,
        NAVY: 0x000080ff,
        OLDLACE: 0xfdf5e6ff,
        OLIVE: 0x808000ff,
        OLIVEDRAB: 0x6b8e23ff,
        ORANGE: 0xffa500ff,
        ORANGERED: 0xff4500ff,
        ORCHID: 0xda70d6ff,
        PALEGOLDENROD: 0xeee8aaff,
        PALEGREEN: 0x98fb98ff,
        PALETURQUOISE: 0xafeeeeff,
        PALEVIOLETRED: 0xdb7093ff,
        PAPAYAWHIP: 0xffefd5ff,
        PEACHPUFF: 0xffdab9ff,
        PERU: 0xcd853fff,
        PINK: 0xffc0cbff,
        PLUM: 0xdda0ddff,
        POWDERBLUE: 0xb0e0e6ff,
        PURPLE: 0x800080ff,
        REBECCAPURPLE: 0x663399ff,
        RED: 0xff0000ff,
        ROSYBROWN: 0xbc8f8fff,
        ROYALBLUE: 0x4169e1ff,
        SADDLEBROWN: 0x8b4513ff,
        SALMON: 0xfa8072ff,
        SANDYBROWN: 0xf4a460ff,
        SEAGREEN: 0x2e8b57ff,
        SEASHELL: 0xfff5eeff,
        SIENNA: 0xa0522dff,
        SILVER: 0xc0c0c0ff,
        SKYBLUE: 0x87ceebff,
        SLATEBLUE: 0x6a5acdff,
        SLATEGRAY: 0x708090ff,
        SLATEGREY: 0x708090ff,
        SNOW: 0xfffafaff,
        SPRINGGREEN: 0x00ff7fff,
        STEELBLUE: 0x4682b4ff,
        TAN: 0xd2b48cff,
        TEAL: 0x008080ff,
        THISTLE: 0xd8bfd8ff,
        TOMATO: 0xff6347ff,
        TRANSPARENT: 0x00000000,
        TURQUOISE: 0x40e0d0ff,
        VIOLET: 0xee82eeff,
        WHEAT: 0xf5deb3ff,
        WHITE: 0xffffffff,
        WHITESMOKE: 0xf5f5f5ff,
        YELLOW: 0xffff00ff,
        YELLOWGREEN: 0x9acd32ff
    };

    var PropertyDescriptorParsingType;
    (function (PropertyDescriptorParsingType) {
        PropertyDescriptorParsingType[PropertyDescriptorParsingType["VALUE"] = 0] = "VALUE";
        PropertyDescriptorParsingType[PropertyDescriptorParsingType["LIST"] = 1] = "LIST";
        PropertyDescriptorParsingType[PropertyDescriptorParsingType["IDENT_VALUE"] = 2] = "IDENT_VALUE";
        PropertyDescriptorParsingType[PropertyDescriptorParsingType["TYPE_VALUE"] = 3] = "TYPE_VALUE";
        PropertyDescriptorParsingType[PropertyDescriptorParsingType["TOKEN_VALUE"] = 4] = "TOKEN_VALUE";
    })(PropertyDescriptorParsingType || (PropertyDescriptorParsingType = {}));

    var BACKGROUND_CLIP;
    (function (BACKGROUND_CLIP) {
        BACKGROUND_CLIP[BACKGROUND_CLIP["BORDER_BOX"] = 0] = "BORDER_BOX";
        BACKGROUND_CLIP[BACKGROUND_CLIP["PADDING_BOX"] = 1] = "PADDING_BOX";
        BACKGROUND_CLIP[BACKGROUND_CLIP["CONTENT_BOX"] = 2] = "CONTENT_BOX";
    })(BACKGROUND_CLIP || (BACKGROUND_CLIP = {}));
    var backgroundClip = {
        name: 'background-clip',
        initialValue: 'border-box',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            return tokens.map(function (token) {
                if (isIdentToken(token)) {
                    switch (token.value) {
                        case 'padding-box':
                            return BACKGROUND_CLIP.PADDING_BOX;
                        case 'content-box':
                            return BACKGROUND_CLIP.CONTENT_BOX;
                    }
                }
                return BACKGROUND_CLIP.BORDER_BOX;
            });
        }
    };

    var backgroundColor = {
        name: "background-color",
        initialValue: 'transparent',
        prefix: false,
        type: PropertyDescriptorParsingType.TYPE_VALUE,
        format: 'color'
    };

    var parseColorStop = function (args) {
        var color$1 = color.parse(args[0]);
        var stop = args[1];
        return stop && isLengthPercentage(stop) ? { color: color$1, stop: stop } : { color: color$1, stop: null };
    };
    var processColorStops = function (stops, lineLength) {
        var first = stops[0];
        var last = stops[stops.length - 1];
        if (first.stop === null) {
            first.stop = ZERO_LENGTH;
        }
        if (last.stop === null) {
            last.stop = HUNDRED_PERCENT;
        }
        var processStops = [];
        var previous = 0;
        for (var i = 0; i < stops.length; i++) {
            var stop_1 = stops[i].stop;
            if (stop_1 !== null) {
                var absoluteValue = getAbsoluteValue(stop_1, lineLength);
                if (absoluteValue > previous) {
                    processStops.push(absoluteValue);
                }
                else {
                    processStops.push(previous);
                }
                previous = absoluteValue;
            }
            else {
                processStops.push(null);
            }
        }
        var gapBegin = null;
        for (var i = 0; i < processStops.length; i++) {
            var stop_2 = processStops[i];
            if (stop_2 === null) {
                if (gapBegin === null) {
                    gapBegin = i;
                }
            }
            else if (gapBegin !== null) {
                var gapLength = i - gapBegin;
                var beforeGap = processStops[gapBegin - 1];
                var gapValue = (stop_2 - beforeGap) / (gapLength + 1);
                for (var g = 1; g <= gapLength; g++) {
                    processStops[gapBegin + g - 1] = gapValue * g;
                }
                gapBegin = null;
            }
        }
        return stops.map(function (_a, i) {
            var color = _a.color;
            return { color: color, stop: Math.max(Math.min(1, processStops[i] / lineLength), 0) };
        });
    };
    var getAngleFromCorner = function (corner, width, height) {
        var centerX = width / 2;
        var centerY = height / 2;
        var x = getAbsoluteValue(corner[0], width) - centerX;
        var y = centerY - getAbsoluteValue(corner[1], height);
        return (Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2);
    };
    var calculateGradientDirection = function (angle, width, height) {
        var radian = typeof angle === 'number' ? angle : getAngleFromCorner(angle, width, height);
        var lineLength = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));
        var halfWidth = width / 2;
        var halfHeight = height / 2;
        var halfLineLength = lineLength / 2;
        var yDiff = Math.sin(radian - Math.PI / 2) * halfLineLength;
        var xDiff = Math.cos(radian - Math.PI / 2) * halfLineLength;
        return [lineLength, halfWidth - xDiff, halfWidth + xDiff, halfHeight - yDiff, halfHeight + yDiff];
    };
    var distance = function (a, b) { return Math.sqrt(a * a + b * b); };
    var findCorner = function (width, height, x, y, closest) {
        var corners = [[0, 0], [0, height], [width, 0], [width, height]];
        return corners.reduce(function (stat, corner) {
            var cx = corner[0], cy = corner[1];
            var d = distance(x - cx, y - cy);
            if (closest ? d < stat.optimumDistance : d > stat.optimumDistance) {
                return {
                    optimumCorner: corner,
                    optimumDistance: d
                };
            }
            return stat;
        }, {
            optimumDistance: closest ? Infinity : -Infinity,
            optimumCorner: null
        }).optimumCorner;
    };
    var calculateRadius = function (gradient, x, y, width, height) {
        var rx = 0;
        var ry = 0;
        switch (gradient.size) {
            case CSSRadialExtent.CLOSEST_SIDE:
                // The ending shape is sized so that that it exactly meets the side of the gradient box closest to the gradient’s center.
                // If the shape is an ellipse, it exactly meets the closest side in each dimension.
                if (gradient.shape === CSSRadialShape.CIRCLE) {
                    rx = ry = Math.min(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));
                }
                else if (gradient.shape === CSSRadialShape.ELLIPSE) {
                    rx = Math.min(Math.abs(x), Math.abs(x - width));
                    ry = Math.min(Math.abs(y), Math.abs(y - height));
                }
                break;
            case CSSRadialExtent.CLOSEST_CORNER:
                // The ending shape is sized so that that it passes through the corner of the gradient box closest to the gradient’s center.
                // If the shape is an ellipse, the ending shape is given the same aspect-ratio it would have if closest-side were specified.
                if (gradient.shape === CSSRadialShape.CIRCLE) {
                    rx = ry = Math.min(distance(x, y), distance(x, y - height), distance(x - width, y), distance(x - width, y - height));
                }
                else if (gradient.shape === CSSRadialShape.ELLIPSE) {
                    // Compute the ratio ry/rx (which is to be the same as for "closest-side")
                    var c = Math.min(Math.abs(y), Math.abs(y - height)) / Math.min(Math.abs(x), Math.abs(x - width));
                    var _a = findCorner(width, height, x, y, true), cx = _a[0], cy = _a[1];
                    rx = distance(cx - x, (cy - y) / c);
                    ry = c * rx;
                }
                break;
            case CSSRadialExtent.FARTHEST_SIDE:
                // Same as closest-side, except the ending shape is sized based on the farthest side(s)
                if (gradient.shape === CSSRadialShape.CIRCLE) {
                    rx = ry = Math.max(Math.abs(x), Math.abs(x - width), Math.abs(y), Math.abs(y - height));
                }
                else if (gradient.shape === CSSRadialShape.ELLIPSE) {
                    rx = Math.max(Math.abs(x), Math.abs(x - width));
                    ry = Math.max(Math.abs(y), Math.abs(y - height));
                }
                break;
            case CSSRadialExtent.FARTHEST_CORNER:
                // Same as closest-corner, except the ending shape is sized based on the farthest corner.
                // If the shape is an ellipse, the ending shape is given the same aspect ratio it would have if farthest-side were specified.
                if (gradient.shape === CSSRadialShape.CIRCLE) {
                    rx = ry = Math.max(distance(x, y), distance(x, y - height), distance(x - width, y), distance(x - width, y - height));
                }
                else if (gradient.shape === CSSRadialShape.ELLIPSE) {
                    // Compute the ratio ry/rx (which is to be the same as for "farthest-side")
                    var c = Math.max(Math.abs(y), Math.abs(y - height)) / Math.max(Math.abs(x), Math.abs(x - width));
                    var _b = findCorner(width, height, x, y, false), cx = _b[0], cy = _b[1];
                    rx = distance(cx - x, (cy - y) / c);
                    ry = c * rx;
                }
                break;
        }
        if (Array.isArray(gradient.size)) {
            rx = getAbsoluteValue(gradient.size[0], width);
            ry = gradient.size.length === 2 ? getAbsoluteValue(gradient.size[1], height) : rx;
        }
        return [rx, ry];
    };

    var linearGradient = function (tokens) {
        var angle$1 = deg(180);
        var stops = [];
        parseFunctionArgs(tokens).forEach(function (arg, i) {
            if (i === 0) {
                var firstToken = arg[0];
                if (firstToken.type === TokenType.IDENT_TOKEN && firstToken.value === 'to') {
                    angle$1 = parseNamedSide(arg);
                    return;
                }
                else if (isAngle(firstToken)) {
                    angle$1 = angle.parse(firstToken);
                    return;
                }
            }
            var colorStop = parseColorStop(arg);
            stops.push(colorStop);
        });
        return { angle: angle$1, stops: stops, type: CSSImageType.LINEAR_GRADIENT };
    };

    var prefixLinearGradient = function (tokens) {
        var angle$1 = deg(180);
        var stops = [];
        parseFunctionArgs(tokens).forEach(function (arg, i) {
            if (i === 0) {
                var firstToken = arg[0];
                if (firstToken.type === TokenType.IDENT_TOKEN &&
                    ['top', 'left', 'right', 'bottom'].indexOf(firstToken.value) !== -1) {
                    angle$1 = parseNamedSide(arg);
                    return;
                }
                else if (isAngle(firstToken)) {
                    angle$1 = (angle.parse(firstToken) + deg(270)) % deg(360);
                    return;
                }
            }
            var colorStop = parseColorStop(arg);
            stops.push(colorStop);
        });
        return {
            angle: angle$1,
            stops: stops,
            type: CSSImageType.LINEAR_GRADIENT
        };
    };

    var testRangeBounds = function (document) {
        var TEST_HEIGHT = 123;
        if (document.createRange) {
            var range = document.createRange();
            if (range.getBoundingClientRect) {
                var testElement = document.createElement('boundtest');
                testElement.style.height = TEST_HEIGHT + "px";
                testElement.style.display = 'block';
                document.body.appendChild(testElement);
                range.selectNode(testElement);
                var rangeBounds = range.getBoundingClientRect();
                var rangeHeight = Math.round(rangeBounds.height);
                document.body.removeChild(testElement);
                if (rangeHeight === TEST_HEIGHT) {
                    return true;
                }
            }
        }
        return false;
    };
    var testCORS = function () { return typeof new Image().crossOrigin !== 'undefined'; };
    var testResponseType = function () { return typeof new XMLHttpRequest().responseType === 'string'; };
    var testSVG = function (document) {
        var img = new Image();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        if (!ctx) {
            return false;
        }
        img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
        try {
            ctx.drawImage(img, 0, 0);
            canvas.toDataURL();
        }
        catch (e) {
            return false;
        }
        return true;
    };
    var isGreenPixel = function (data) {
        return data[0] === 0 && data[1] === 255 && data[2] === 0 && data[3] === 255;
    };
    var testForeignObject = function (document) {
        var canvas = document.createElement('canvas');
        var size = 100;
        canvas.width = size;
        canvas.height = size;
        var ctx = canvas.getContext('2d');
        if (!ctx) {
            return Promise.reject(false);
        }
        ctx.fillStyle = 'rgb(0, 255, 0)';
        ctx.fillRect(0, 0, size, size);
        var img = new Image();
        var greenImageSrc = canvas.toDataURL();
        img.src = greenImageSrc;
        var svg = createForeignObjectSVG(size, size, 0, 0, img);
        ctx.fillStyle = 'red';
        ctx.fillRect(0, 0, size, size);
        return loadSerializedSVG(svg)
            .then(function (img) {
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, size, size).data;
            ctx.fillStyle = 'red';
            ctx.fillRect(0, 0, size, size);
            var node = document.createElement('div');
            node.style.backgroundImage = "url(" + greenImageSrc + ")";
            node.style.height = size + "px";
            // Firefox 55 does not render inline <img /> tags
            return isGreenPixel(data)
                ? loadSerializedSVG(createForeignObjectSVG(size, size, 0, 0, node))
                : Promise.reject(false);
        })
            .then(function (img) {
            ctx.drawImage(img, 0, 0);
            // Edge does not render background-images
            return isGreenPixel(ctx.getImageData(0, 0, size, size).data);
        })
            .catch(function () { return false; });
    };
    var createForeignObjectSVG = function (width, height, x, y, node) {
        var xmlns = 'http://www.w3.org/2000/svg';
        var svg = document.createElementNS(xmlns, 'svg');
        var foreignObject = document.createElementNS(xmlns, 'foreignObject');
        svg.setAttributeNS(null, 'width', width.toString());
        svg.setAttributeNS(null, 'height', height.toString());
        foreignObject.setAttributeNS(null, 'width', '100%');
        foreignObject.setAttributeNS(null, 'height', '100%');
        foreignObject.setAttributeNS(null, 'x', x.toString());
        foreignObject.setAttributeNS(null, 'y', y.toString());
        foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true');
        svg.appendChild(foreignObject);
        foreignObject.appendChild(node);
        return svg;
    };
    var loadSerializedSVG = function (svg) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () { return resolve(img); };
            img.onerror = reject;
            img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));
        });
    };
    var FEATURES = {
        get SUPPORT_RANGE_BOUNDS() {
            var value = testRangeBounds(document);
            Object.defineProperty(FEATURES, 'SUPPORT_RANGE_BOUNDS', { value: value });
            return value;
        },
        get SUPPORT_SVG_DRAWING() {
            var value = testSVG(document);
            Object.defineProperty(FEATURES, 'SUPPORT_SVG_DRAWING', { value: value });
            return value;
        },
        get SUPPORT_FOREIGNOBJECT_DRAWING() {
            var value = typeof Array.from === 'function' && typeof window.fetch === 'function'
                ? testForeignObject(document)
                : Promise.resolve(false);
            Object.defineProperty(FEATURES, 'SUPPORT_FOREIGNOBJECT_DRAWING', { value: value });
            return value;
        },
        get SUPPORT_CORS_IMAGES() {
            var value = testCORS();
            Object.defineProperty(FEATURES, 'SUPPORT_CORS_IMAGES', { value: value });
            return value;
        },
        get SUPPORT_RESPONSE_TYPE() {
            var value = testResponseType();
            Object.defineProperty(FEATURES, 'SUPPORT_RESPONSE_TYPE', { value: value });
            return value;
        },
        get SUPPORT_CORS_XHR() {
            var value = 'withCredentials' in new XMLHttpRequest();
            Object.defineProperty(FEATURES, 'SUPPORT_CORS_XHR', { value: value });
            return value;
        }
    };

    var Logger = /** @class */ (function () {
        function Logger(_a) {
            var id = _a.id, enabled = _a.enabled;
            this.id = id;
            this.enabled = enabled;
            this.start = Date.now();
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Logger.prototype.debug = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.enabled) {
                // eslint-disable-next-line no-console
                if (typeof window !== 'undefined' && window.console && typeof console.debug === 'function') {
                    // eslint-disable-next-line no-console
                    console.debug.apply(console, [this.id, this.getTime() + "ms"].concat(args));
                }
                else {
                    this.info.apply(this, args);
                }
            }
        };
        Logger.prototype.getTime = function () {
            return Date.now() - this.start;
        };
        Logger.create = function (options) {
            Logger.instances[options.id] = new Logger(options);
        };
        Logger.destroy = function (id) {
            delete Logger.instances[id];
        };
        Logger.getInstance = function (id) {
            var instance = Logger.instances[id];
            if (typeof instance === 'undefined') {
                throw new Error("No logger instance found with id " + id);
            }
            return instance;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Logger.prototype.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.enabled) {
                // eslint-disable-next-line no-console
                if (typeof window !== 'undefined' && window.console && typeof console.info === 'function') {
                    // eslint-disable-next-line no-console
                    console.info.apply(console, [this.id, this.getTime() + "ms"].concat(args));
                }
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Logger.prototype.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.enabled) {
                // eslint-disable-next-line no-console
                if (typeof window !== 'undefined' && window.console && typeof console.error === 'function') {
                    // eslint-disable-next-line no-console
                    console.error.apply(console, [this.id, this.getTime() + "ms"].concat(args));
                }
                else {
                    this.info.apply(this, args);
                }
            }
        };
        Logger.instances = {};
        return Logger;
    }());

    var CacheStorage = /** @class */ (function () {
        function CacheStorage() {
        }
        CacheStorage.create = function (name, options) {
            return (CacheStorage._caches[name] = new Cache(name, options));
        };
        CacheStorage.destroy = function (name) {
            delete CacheStorage._caches[name];
        };
        CacheStorage.open = function (name) {
            var cache = CacheStorage._caches[name];
            if (typeof cache !== 'undefined') {
                return cache;
            }
            throw new Error("Cache with key \"" + name + "\" not found");
        };
        CacheStorage.getOrigin = function (url) {
            var link = CacheStorage._link;
            if (!link) {
                return 'about:blank';
            }
            link.href = url;
            link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
            return link.protocol + link.hostname + link.port;
        };
        CacheStorage.isSameOrigin = function (src) {
            return CacheStorage.getOrigin(src) === CacheStorage._origin;
        };
        CacheStorage.setContext = function (window) {
            CacheStorage._link = window.document.createElement('a');
            CacheStorage._origin = CacheStorage.getOrigin(window.location.href);
        };
        CacheStorage.getInstance = function () {
            var current = CacheStorage._current;
            if (current === null) {
                throw new Error("No cache instance attached");
            }
            return current;
        };
        CacheStorage.attachInstance = function (cache) {
            CacheStorage._current = cache;
        };
        CacheStorage.detachInstance = function () {
            CacheStorage._current = null;
        };
        CacheStorage._caches = {};
        CacheStorage._origin = 'about:blank';
        CacheStorage._current = null;
        return CacheStorage;
    }());
    var Cache = /** @class */ (function () {
        function Cache(id, options) {
            this.id = id;
            this._options = options;
            this._cache = {};
        }
        Cache.prototype.addImage = function (src) {
            var result = Promise.resolve();
            if (this.has(src)) {
                return result;
            }
            if (isBlobImage(src) || isRenderable(src)) {
                this._cache[src] = this.loadImage(src);
                return result;
            }
            return result;
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Cache.prototype.match = function (src) {
            return this._cache[src];
        };
        Cache.prototype.loadImage = function (key) {
            return __awaiter(this, void 0, void 0, function () {
                var isSameOrigin, useCORS, useProxy, src;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isSameOrigin = CacheStorage.isSameOrigin(key);
                            useCORS = !isInlineImage(key) && this._options.useCORS === true && FEATURES.SUPPORT_CORS_IMAGES && !isSameOrigin;
                            useProxy = !isInlineImage(key) &&
                                !isSameOrigin &&
                                typeof this._options.proxy === 'string' &&
                                FEATURES.SUPPORT_CORS_XHR &&
                                !useCORS;
                            if (!isSameOrigin && this._options.allowTaint === false && !isInlineImage(key) && !useProxy && !useCORS) {
                                return [2 /*return*/];
                            }
                            src = key;
                            if (!useProxy) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.proxy(src)];
                        case 1:
                            src = _a.sent();
                            _a.label = 2;
                        case 2:
                            Logger.getInstance(this.id).debug("Added image " + key.substring(0, 256));
                            return [4 /*yield*/, new Promise(function (resolve, reject) {
                                    var img = new Image();
                                    img.onload = function () { return resolve(img); };
                                    img.onerror = reject;
                                    //ios safari 10.3 taints canvas with data urls unless crossOrigin is set to anonymous
                                    if (isInlineBase64Image(src) || useCORS) {
                                        img.crossOrigin = 'anonymous';
                                    }
                                    img.src = src;
                                    if (img.complete === true) {
                                        // Inline XML images may fail to parse, throwing an Error later on
                                        setTimeout(function () { return resolve(img); }, 500);
                                    }
                                    if (_this._options.imageTimeout > 0) {
                                        setTimeout(function () { return reject("Timed out (" + _this._options.imageTimeout + "ms) loading image"); }, _this._options.imageTimeout);
                                    }
                                })];
                        case 3: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Cache.prototype.has = function (key) {
            return typeof this._cache[key] !== 'undefined';
        };
        Cache.prototype.keys = function () {
            return Promise.resolve(Object.keys(this._cache));
        };
        Cache.prototype.proxy = function (src) {
            var _this = this;
            var proxy = this._options.proxy;
            if (!proxy) {
                throw new Error('No proxy defined');
            }
            var key = src.substring(0, 256);
            return new Promise(function (resolve, reject) {
                var responseType = FEATURES.SUPPORT_RESPONSE_TYPE ? 'blob' : 'text';
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        if (responseType === 'text') {
                            resolve(xhr.response);
                        }
                        else {
                            var reader_1 = new FileReader();
                            reader_1.addEventListener('load', function () { return resolve(reader_1.result); }, false);
                            reader_1.addEventListener('error', function (e) { return reject(e); }, false);
                            reader_1.readAsDataURL(xhr.response);
                        }
                    }
                    else {
                        reject("Failed to proxy resource " + key + " with status code " + xhr.status);
                    }
                };
                xhr.onerror = reject;
                xhr.open('GET', proxy + "?url=" + encodeURIComponent(src) + "&responseType=" + responseType);
                if (responseType !== 'text' && xhr instanceof XMLHttpRequest) {
                    xhr.responseType = responseType;
                }
                if (_this._options.imageTimeout) {
                    var timeout_1 = _this._options.imageTimeout;
                    xhr.timeout = timeout_1;
                    xhr.ontimeout = function () { return reject("Timed out (" + timeout_1 + "ms) proxying " + key); };
                }
                xhr.send();
            });
        };
        return Cache;
    }());
    var INLINE_SVG = /^data:image\/svg\+xml/i;
    var INLINE_BASE64 = /^data:image\/.*;base64,/i;
    var INLINE_IMG = /^data:image\/.*/i;
    var isRenderable = function (src) { return FEATURES.SUPPORT_SVG_DRAWING || !isSVG(src); };
    var isInlineImage = function (src) { return INLINE_IMG.test(src); };
    var isInlineBase64Image = function (src) { return INLINE_BASE64.test(src); };
    var isBlobImage = function (src) { return src.substr(0, 4) === 'blob'; };
    var isSVG = function (src) { return src.substr(-3).toLowerCase() === 'svg' || INLINE_SVG.test(src); };

    var webkitGradient = function (tokens) {
        var angle = deg(180);
        var stops = [];
        var type = CSSImageType.LINEAR_GRADIENT;
        var shape = CSSRadialShape.CIRCLE;
        var size = CSSRadialExtent.FARTHEST_CORNER;
        var position = [];
        parseFunctionArgs(tokens).forEach(function (arg, i) {
            var firstToken = arg[0];
            if (i === 0) {
                if (isIdentToken(firstToken) && firstToken.value === 'linear') {
                    type = CSSImageType.LINEAR_GRADIENT;
                    return;
                }
                else if (isIdentToken(firstToken) && firstToken.value === 'radial') {
                    type = CSSImageType.RADIAL_GRADIENT;
                    return;
                }
            }
            if (firstToken.type === TokenType.FUNCTION) {
                if (firstToken.name === 'from') {
                    var color$1 = color.parse(firstToken.values[0]);
                    stops.push({ stop: ZERO_LENGTH, color: color$1 });
                }
                else if (firstToken.name === 'to') {
                    var color$1 = color.parse(firstToken.values[0]);
                    stops.push({ stop: HUNDRED_PERCENT, color: color$1 });
                }
                else if (firstToken.name === 'color-stop') {
                    var values = firstToken.values.filter(nonFunctionArgSeparator);
                    if (values.length === 2) {
                        var color$1 = color.parse(values[1]);
                        var stop_1 = values[0];
                        if (isNumberToken(stop_1)) {
                            stops.push({
                                stop: { type: TokenType.PERCENTAGE_TOKEN, number: stop_1.number * 100, flags: stop_1.flags },
                                color: color$1
                            });
                        }
                    }
                }
            }
        });
        return type === CSSImageType.LINEAR_GRADIENT
            ? {
                angle: (angle + deg(180)) % deg(360),
                stops: stops,
                type: type
            }
            : { size: size, shape: shape, stops: stops, position: position, type: type };
    };

    var CLOSEST_SIDE = 'closest-side';
    var FARTHEST_SIDE = 'farthest-side';
    var CLOSEST_CORNER = 'closest-corner';
    var FARTHEST_CORNER = 'farthest-corner';
    var CIRCLE = 'circle';
    var ELLIPSE = 'ellipse';
    var COVER = 'cover';
    var CONTAIN = 'contain';
    var radialGradient = function (tokens) {
        var shape = CSSRadialShape.CIRCLE;
        var size = CSSRadialExtent.FARTHEST_CORNER;
        var stops = [];
        var position = [];
        parseFunctionArgs(tokens).forEach(function (arg, i) {
            var isColorStop = true;
            if (i === 0) {
                var isAtPosition_1 = false;
                isColorStop = arg.reduce(function (acc, token) {
                    if (isAtPosition_1) {
                        if (isIdentToken(token)) {
                            switch (token.value) {
                                case 'center':
                                    position.push(FIFTY_PERCENT);
                                    return acc;
                                case 'top':
                                case 'left':
                                    position.push(ZERO_LENGTH);
                                    return acc;
                                case 'right':
                                case 'bottom':
                                    position.push(HUNDRED_PERCENT);
                                    return acc;
                            }
                        }
                        else if (isLengthPercentage(token) || isLength(token)) {
                            position.push(token);
                        }
                    }
                    else if (isIdentToken(token)) {
                        switch (token.value) {
                            case CIRCLE:
                                shape = CSSRadialShape.CIRCLE;
                                return false;
                            case ELLIPSE:
                                shape = CSSRadialShape.ELLIPSE;
                                return false;
                            case 'at':
                                isAtPosition_1 = true;
                                return false;
                            case CLOSEST_SIDE:
                                size = CSSRadialExtent.CLOSEST_SIDE;
                                return false;
                            case COVER:
                            case FARTHEST_SIDE:
                                size = CSSRadialExtent.FARTHEST_SIDE;
                                return false;
                            case CONTAIN:
                            case CLOSEST_CORNER:
                                size = CSSRadialExtent.CLOSEST_CORNER;
                                return false;
                            case FARTHEST_CORNER:
                                size = CSSRadialExtent.FARTHEST_CORNER;
                                return false;
                        }
                    }
                    else if (isLength(token) || isLengthPercentage(token)) {
                        if (!Array.isArray(size)) {
                            size = [];
                        }
                        size.push(token);
                        return false;
                    }
                    return acc;
                }, isColorStop);
            }
            if (isColorStop) {
                var colorStop = parseColorStop(arg);
                stops.push(colorStop);
            }
        });
        return { size: size, shape: shape, stops: stops, position: position, type: CSSImageType.RADIAL_GRADIENT };
    };

    var prefixRadialGradient = function (tokens) {
        var shape = CSSRadialShape.CIRCLE;
        var size = CSSRadialExtent.FARTHEST_CORNER;
        var stops = [];
        var position = [];
        parseFunctionArgs(tokens).forEach(function (arg, i) {
            var isColorStop = true;
            if (i === 0) {
                isColorStop = arg.reduce(function (acc, token) {
                    if (isIdentToken(token)) {
                        switch (token.value) {
                            case 'center':
                                position.push(FIFTY_PERCENT);
                                return false;
                            case 'top':
                            case 'left':
                                position.push(ZERO_LENGTH);
                                return false;
                            case 'right':
                            case 'bottom':
                                position.push(HUNDRED_PERCENT);
                                return false;
                        }
                    }
                    else if (isLengthPercentage(token) || isLength(token)) {
                        position.push(token);
                        return false;
                    }
                    return acc;
                }, isColorStop);
            }
            else if (i === 1) {
                isColorStop = arg.reduce(function (acc, token) {
                    if (isIdentToken(token)) {
                        switch (token.value) {
                            case CIRCLE:
                                shape = CSSRadialShape.CIRCLE;
                                return false;
                            case ELLIPSE:
                                shape = CSSRadialShape.ELLIPSE;
                                return false;
                            case CONTAIN:
                            case CLOSEST_SIDE:
                                size = CSSRadialExtent.CLOSEST_SIDE;
                                return false;
                            case FARTHEST_SIDE:
                                size = CSSRadialExtent.FARTHEST_SIDE;
                                return false;
                            case CLOSEST_CORNER:
                                size = CSSRadialExtent.CLOSEST_CORNER;
                                return false;
                            case COVER:
                            case FARTHEST_CORNER:
                                size = CSSRadialExtent.FARTHEST_CORNER;
                                return false;
                        }
                    }
                    else if (isLength(token) || isLengthPercentage(token)) {
                        if (!Array.isArray(size)) {
                            size = [];
                        }
                        size.push(token);
                        return false;
                    }
                    return acc;
                }, isColorStop);
            }
            if (isColorStop) {
                var colorStop = parseColorStop(arg);
                stops.push(colorStop);
            }
        });
        return { size: size, shape: shape, stops: stops, position: position, type: CSSImageType.RADIAL_GRADIENT };
    };

    var CSSImageType;
    (function (CSSImageType) {
        CSSImageType[CSSImageType["URL"] = 0] = "URL";
        CSSImageType[CSSImageType["LINEAR_GRADIENT"] = 1] = "LINEAR_GRADIENT";
        CSSImageType[CSSImageType["RADIAL_GRADIENT"] = 2] = "RADIAL_GRADIENT";
    })(CSSImageType || (CSSImageType = {}));
    var isLinearGradient = function (background) {
        return background.type === CSSImageType.LINEAR_GRADIENT;
    };
    var isRadialGradient = function (background) {
        return background.type === CSSImageType.RADIAL_GRADIENT;
    };
    var CSSRadialShape;
    (function (CSSRadialShape) {
        CSSRadialShape[CSSRadialShape["CIRCLE"] = 0] = "CIRCLE";
        CSSRadialShape[CSSRadialShape["ELLIPSE"] = 1] = "ELLIPSE";
    })(CSSRadialShape || (CSSRadialShape = {}));
    var CSSRadialExtent;
    (function (CSSRadialExtent) {
        CSSRadialExtent[CSSRadialExtent["CLOSEST_SIDE"] = 0] = "CLOSEST_SIDE";
        CSSRadialExtent[CSSRadialExtent["FARTHEST_SIDE"] = 1] = "FARTHEST_SIDE";
        CSSRadialExtent[CSSRadialExtent["CLOSEST_CORNER"] = 2] = "CLOSEST_CORNER";
        CSSRadialExtent[CSSRadialExtent["FARTHEST_CORNER"] = 3] = "FARTHEST_CORNER";
    })(CSSRadialExtent || (CSSRadialExtent = {}));
    var image = {
        name: 'image',
        parse: function (value) {
            if (value.type === TokenType.URL_TOKEN) {
                var image_1 = { url: value.value, type: CSSImageType.URL };
                CacheStorage.getInstance().addImage(value.value);
                return image_1;
            }
            if (value.type === TokenType.FUNCTION) {
                var imageFunction = SUPPORTED_IMAGE_FUNCTIONS[value.name];
                if (typeof imageFunction === 'undefined') {
                    throw new Error("Attempting to parse an unsupported image function \"" + value.name + "\"");
                }
                return imageFunction(value.values);
            }
            throw new Error("Unsupported image type");
        }
    };
    function isSupportedImage(value) {
        return value.type !== TokenType.FUNCTION || SUPPORTED_IMAGE_FUNCTIONS[value.name];
    }
    var SUPPORTED_IMAGE_FUNCTIONS = {
        'linear-gradient': linearGradient,
        '-moz-linear-gradient': prefixLinearGradient,
        '-ms-linear-gradient': prefixLinearGradient,
        '-o-linear-gradient': prefixLinearGradient,
        '-webkit-linear-gradient': prefixLinearGradient,
        'radial-gradient': radialGradient,
        '-moz-radial-gradient': prefixRadialGradient,
        '-ms-radial-gradient': prefixRadialGradient,
        '-o-radial-gradient': prefixRadialGradient,
        '-webkit-radial-gradient': prefixRadialGradient,
        '-webkit-gradient': webkitGradient
    };

    var backgroundImage = {
        name: 'background-image',
        initialValue: 'none',
        type: PropertyDescriptorParsingType.LIST,
        prefix: false,
        parse: function (tokens) {
            if (tokens.length === 0) {
                return [];
            }
            var first = tokens[0];
            if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {
                return [];
            }
            return tokens.filter(function (value) { return nonFunctionArgSeparator(value) && isSupportedImage(value); }).map(image.parse);
        }
    };

    var backgroundOrigin = {
        name: 'background-origin',
        initialValue: 'border-box',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            return tokens.map(function (token) {
                if (isIdentToken(token)) {
                    switch (token.value) {
                        case 'padding-box':
                            return 1 /* PADDING_BOX */;
                        case 'content-box':
                            return 2 /* CONTENT_BOX */;
                    }
                }
                return 0 /* BORDER_BOX */;
            });
        }
    };

    var backgroundPosition = {
        name: 'background-position',
        initialValue: '0% 0%',
        type: PropertyDescriptorParsingType.LIST,
        prefix: false,
        parse: function (tokens) {
            return parseFunctionArgs(tokens)
                .map(function (values) { return values.filter(isLengthPercentage); })
                .map(parseLengthPercentageTuple);
        }
    };

    var BACKGROUND_REPEAT;
    (function (BACKGROUND_REPEAT) {
        BACKGROUND_REPEAT[BACKGROUND_REPEAT["REPEAT"] = 0] = "REPEAT";
        BACKGROUND_REPEAT[BACKGROUND_REPEAT["NO_REPEAT"] = 1] = "NO_REPEAT";
        BACKGROUND_REPEAT[BACKGROUND_REPEAT["REPEAT_X"] = 2] = "REPEAT_X";
        BACKGROUND_REPEAT[BACKGROUND_REPEAT["REPEAT_Y"] = 3] = "REPEAT_Y";
    })(BACKGROUND_REPEAT || (BACKGROUND_REPEAT = {}));
    var backgroundRepeat = {
        name: 'background-repeat',
        initialValue: 'repeat',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            return parseFunctionArgs(tokens)
                .map(function (values) {
                return values
                    .filter(isIdentToken)
                    .map(function (token) { return token.value; })
                    .join(' ');
            })
                .map(parseBackgroundRepeat);
        }
    };
    var parseBackgroundRepeat = function (value) {
        switch (value) {
            case 'no-repeat':
                return BACKGROUND_REPEAT.NO_REPEAT;
            case 'repeat-x':
            case 'repeat no-repeat':
                return BACKGROUND_REPEAT.REPEAT_X;
            case 'repeat-y':
            case 'no-repeat repeat':
                return BACKGROUND_REPEAT.REPEAT_Y;
            case 'repeat':
            default:
                return BACKGROUND_REPEAT.REPEAT;
        }
    };

    var BACKGROUND_SIZE;
    (function (BACKGROUND_SIZE) {
        BACKGROUND_SIZE["AUTO"] = "auto";
        BACKGROUND_SIZE["CONTAIN"] = "contain";
        BACKGROUND_SIZE["COVER"] = "cover";
    })(BACKGROUND_SIZE || (BACKGROUND_SIZE = {}));
    var backgroundSize = {
        name: 'background-size',
        initialValue: '0',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            return parseFunctionArgs(tokens).map(function (values) { return values.filter(isBackgroundSizeInfoToken); });
        }
    };
    var isBackgroundSizeInfoToken = function (value) {
        return isIdentToken(value) || isLengthPercentage(value);
    };

    var borderColorForSide = function (side) { return ({
        name: "border-" + side + "-color",
        initialValue: 'transparent',
        prefix: false,
        type: PropertyDescriptorParsingType.TYPE_VALUE,
        format: 'color'
    }); };
    var borderTopColor = borderColorForSide('top');
    var borderRightColor = borderColorForSide('right');
    var borderBottomColor = borderColorForSide('bottom');
    var borderLeftColor = borderColorForSide('left');

    var borderRadiusForSide = function (side) { return ({
        name: "border-radius-" + side,
        initialValue: '0 0',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) { return parseLengthPercentageTuple(tokens.filter(isLengthPercentage)); }
    }); };
    var borderTopLeftRadius = borderRadiusForSide('top-left');
    var borderTopRightRadius = borderRadiusForSide('top-right');
    var borderBottomRightRadius = borderRadiusForSide('bottom-right');
    var borderBottomLeftRadius = borderRadiusForSide('bottom-left');

    var BORDER_STYLE;
    (function (BORDER_STYLE) {
        BORDER_STYLE[BORDER_STYLE["NONE"] = 0] = "NONE";
        BORDER_STYLE[BORDER_STYLE["SOLID"] = 1] = "SOLID";
    })(BORDER_STYLE || (BORDER_STYLE = {}));
    var borderStyleForSide = function (side) { return ({
        name: "border-" + side + "-style",
        initialValue: 'solid',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (style) {
            switch (style) {
                case 'none':
                    return BORDER_STYLE.NONE;
            }
            return BORDER_STYLE.SOLID;
        }
    }); };
    var borderTopStyle = borderStyleForSide('top');
    var borderRightStyle = borderStyleForSide('right');
    var borderBottomStyle = borderStyleForSide('bottom');
    var borderLeftStyle = borderStyleForSide('left');

    var borderWidthForSide = function (side) { return ({
        name: "border-" + side + "-width",
        initialValue: '0',
        type: PropertyDescriptorParsingType.VALUE,
        prefix: false,
        parse: function (token) {
            if (isDimensionToken(token)) {
                return token.number;
            }
            return 0;
        }
    }); };
    var borderTopWidth = borderWidthForSide('top');
    var borderRightWidth = borderWidthForSide('right');
    var borderBottomWidth = borderWidthForSide('bottom');
    var borderLeftWidth = borderWidthForSide('left');

    var color$1 = {
        name: "color",
        initialValue: 'transparent',
        prefix: false,
        type: PropertyDescriptorParsingType.TYPE_VALUE,
        format: 'color'
    };

    var display = {
        name: 'display',
        initialValue: 'inline-block',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            return tokens.filter(isIdentToken).reduce(function (bit, token) {
                return bit | parseDisplayValue(token.value);
            }, 0 /* NONE */);
        }
    };
    var parseDisplayValue = function (display) {
        switch (display) {
            case 'block':
                return 2 /* BLOCK */;
            case 'inline':
                return 4 /* INLINE */;
            case 'run-in':
                return 8 /* RUN_IN */;
            case 'flow':
                return 16 /* FLOW */;
            case 'flow-root':
                return 32 /* FLOW_ROOT */;
            case 'table':
                return 64 /* TABLE */;
            case 'flex':
            case '-webkit-flex':
                return 128 /* FLEX */;
            case 'grid':
            case '-ms-grid':
                return 256 /* GRID */;
            case 'ruby':
                return 512 /* RUBY */;
            case 'subgrid':
                return 1024 /* SUBGRID */;
            case 'list-item':
                return 2048 /* LIST_ITEM */;
            case 'table-row-group':
                return 4096 /* TABLE_ROW_GROUP */;
            case 'table-header-group':
                return 8192 /* TABLE_HEADER_GROUP */;
            case 'table-footer-group':
                return 16384 /* TABLE_FOOTER_GROUP */;
            case 'table-row':
                return 32768 /* TABLE_ROW */;
            case 'table-cell':
                return 65536 /* TABLE_CELL */;
            case 'table-column-group':
                return 131072 /* TABLE_COLUMN_GROUP */;
            case 'table-column':
                return 262144 /* TABLE_COLUMN */;
            case 'table-caption':
                return 524288 /* TABLE_CAPTION */;
            case 'ruby-base':
                return 1048576 /* RUBY_BASE */;
            case 'ruby-text':
                return 2097152 /* RUBY_TEXT */;
            case 'ruby-base-container':
                return 4194304 /* RUBY_BASE_CONTAINER */;
            case 'ruby-text-container':
                return 8388608 /* RUBY_TEXT_CONTAINER */;
            case 'contents':
                return 16777216 /* CONTENTS */;
            case 'inline-block':
                return 33554432 /* INLINE_BLOCK */;
            case 'inline-list-item':
                return 67108864 /* INLINE_LIST_ITEM */;
            case 'inline-table':
                return 134217728 /* INLINE_TABLE */;
            case 'inline-flex':
                return 268435456 /* INLINE_FLEX */;
            case 'inline-grid':
                return 536870912 /* INLINE_GRID */;
        }
        return 0 /* NONE */;
    };

    var FLOAT;
    (function (FLOAT) {
        FLOAT[FLOAT["NONE"] = 0] = "NONE";
        FLOAT[FLOAT["LEFT"] = 1] = "LEFT";
        FLOAT[FLOAT["RIGHT"] = 2] = "RIGHT";
        FLOAT[FLOAT["INLINE_START"] = 3] = "INLINE_START";
        FLOAT[FLOAT["INLINE_END"] = 4] = "INLINE_END";
    })(FLOAT || (FLOAT = {}));
    var float = {
        name: 'float',
        initialValue: 'none',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (float) {
            switch (float) {
                case 'left':
                    return FLOAT.LEFT;
                case 'right':
                    return FLOAT.RIGHT;
                case 'inline-start':
                    return FLOAT.INLINE_START;
                case 'inline-end':
                    return FLOAT.INLINE_END;
            }
            return FLOAT.NONE;
        }
    };

    var letterSpacing = {
        name: 'letter-spacing',
        initialValue: '0',
        prefix: false,
        type: PropertyDescriptorParsingType.VALUE,
        parse: function (token) {
            if (token.type === TokenType.IDENT_TOKEN && token.value === 'normal') {
                return 0;
            }
            if (token.type === TokenType.NUMBER_TOKEN) {
                return token.number;
            }
            if (token.type === TokenType.DIMENSION_TOKEN) {
                return token.number;
            }
            return 0;
        }
    };

    var LINE_BREAK;
    (function (LINE_BREAK) {
        LINE_BREAK["NORMAL"] = "normal";
        LINE_BREAK["STRICT"] = "strict";
    })(LINE_BREAK || (LINE_BREAK = {}));
    var lineBreak = {
        name: 'line-break',
        initialValue: 'normal',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (lineBreak) {
            switch (lineBreak) {
                case 'strict':
                    return LINE_BREAK.STRICT;
                case 'normal':
                default:
                    return LINE_BREAK.NORMAL;
            }
        }
    };

    var lineHeight = {
        name: 'line-height',
        initialValue: 'normal',
        prefix: false,
        type: PropertyDescriptorParsingType.TOKEN_VALUE
    };
    var computeLineHeight = function (token, fontSize) {
        if (isIdentToken(token) && token.value === 'normal') {
            return 1.2 * fontSize;
        }
        else if (token.type === TokenType.NUMBER_TOKEN) {
            return fontSize * token.number;
        }
        else if (isLengthPercentage(token)) {
            return getAbsoluteValue(token, fontSize);
        }
        return fontSize;
    };

    var listStyleImage = {
        name: 'list-style-image',
        initialValue: 'none',
        type: PropertyDescriptorParsingType.VALUE,
        prefix: false,
        parse: function (token) {
            if (token.type === TokenType.IDENT_TOKEN && token.value === 'none') {
                return null;
            }
            return image.parse(token);
        }
    };

    var LIST_STYLE_POSITION;
    (function (LIST_STYLE_POSITION) {
        LIST_STYLE_POSITION[LIST_STYLE_POSITION["INSIDE"] = 0] = "INSIDE";
        LIST_STYLE_POSITION[LIST_STYLE_POSITION["OUTSIDE"] = 1] = "OUTSIDE";
    })(LIST_STYLE_POSITION || (LIST_STYLE_POSITION = {}));
    var listStylePosition = {
        name: 'list-style-position',
        initialValue: 'outside',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (position) {
            switch (position) {
                case 'inside':
                    return LIST_STYLE_POSITION.INSIDE;
                case 'outside':
                default:
                    return LIST_STYLE_POSITION.OUTSIDE;
            }
        }
    };

    var LIST_STYLE_TYPE;
    (function (LIST_STYLE_TYPE) {
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["NONE"] = -1] = "NONE";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISC"] = 0] = "DISC";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CIRCLE"] = 1] = "CIRCLE";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["SQUARE"] = 2] = "SQUARE";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DECIMAL"] = 3] = "DECIMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_DECIMAL"] = 4] = "CJK_DECIMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DECIMAL_LEADING_ZERO"] = 5] = "DECIMAL_LEADING_ZERO";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ROMAN"] = 6] = "LOWER_ROMAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ROMAN"] = 7] = "UPPER_ROMAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_GREEK"] = 8] = "LOWER_GREEK";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ALPHA"] = 9] = "LOWER_ALPHA";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ALPHA"] = 10] = "UPPER_ALPHA";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["ARABIC_INDIC"] = 11] = "ARABIC_INDIC";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["ARMENIAN"] = 12] = "ARMENIAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["BENGALI"] = 13] = "BENGALI";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CAMBODIAN"] = 14] = "CAMBODIAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_EARTHLY_BRANCH"] = 15] = "CJK_EARTHLY_BRANCH";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_HEAVENLY_STEM"] = 16] = "CJK_HEAVENLY_STEM";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["CJK_IDEOGRAPHIC"] = 17] = "CJK_IDEOGRAPHIC";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DEVANAGARI"] = 18] = "DEVANAGARI";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["ETHIOPIC_NUMERIC"] = 19] = "ETHIOPIC_NUMERIC";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["GEORGIAN"] = 20] = "GEORGIAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["GUJARATI"] = 21] = "GUJARATI";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["GURMUKHI"] = 22] = "GURMUKHI";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["HEBREW"] = 22] = "HEBREW";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["HIRAGANA"] = 23] = "HIRAGANA";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["HIRAGANA_IROHA"] = 24] = "HIRAGANA_IROHA";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["JAPANESE_FORMAL"] = 25] = "JAPANESE_FORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["JAPANESE_INFORMAL"] = 26] = "JAPANESE_INFORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KANNADA"] = 27] = "KANNADA";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KATAKANA"] = 28] = "KATAKANA";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KATAKANA_IROHA"] = 29] = "KATAKANA_IROHA";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KHMER"] = 30] = "KHMER";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANGUL_FORMAL"] = 31] = "KOREAN_HANGUL_FORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANJA_FORMAL"] = 32] = "KOREAN_HANJA_FORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["KOREAN_HANJA_INFORMAL"] = 33] = "KOREAN_HANJA_INFORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LAO"] = 34] = "LAO";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["LOWER_ARMENIAN"] = 35] = "LOWER_ARMENIAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["MALAYALAM"] = 36] = "MALAYALAM";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["MONGOLIAN"] = 37] = "MONGOLIAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["MYANMAR"] = 38] = "MYANMAR";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["ORIYA"] = 39] = "ORIYA";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["PERSIAN"] = 40] = "PERSIAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["SIMP_CHINESE_FORMAL"] = 41] = "SIMP_CHINESE_FORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["SIMP_CHINESE_INFORMAL"] = 42] = "SIMP_CHINESE_INFORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TAMIL"] = 43] = "TAMIL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TELUGU"] = 44] = "TELUGU";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["THAI"] = 45] = "THAI";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TIBETAN"] = 46] = "TIBETAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TRAD_CHINESE_FORMAL"] = 47] = "TRAD_CHINESE_FORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["TRAD_CHINESE_INFORMAL"] = 48] = "TRAD_CHINESE_INFORMAL";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["UPPER_ARMENIAN"] = 49] = "UPPER_ARMENIAN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISCLOSURE_OPEN"] = 50] = "DISCLOSURE_OPEN";
        LIST_STYLE_TYPE[LIST_STYLE_TYPE["DISCLOSURE_CLOSED"] = 51] = "DISCLOSURE_CLOSED";
    })(LIST_STYLE_TYPE || (LIST_STYLE_TYPE = {}));
    var listStyleType = {
        name: 'list-style-type',
        initialValue: 'none',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (type) {
            switch (type) {
                case 'disc':
                    return LIST_STYLE_TYPE.DISC;
                case 'circle':
                    return LIST_STYLE_TYPE.CIRCLE;
                case 'square':
                    return LIST_STYLE_TYPE.SQUARE;
                case 'decimal':
                    return LIST_STYLE_TYPE.DECIMAL;
                case 'cjk-decimal':
                    return LIST_STYLE_TYPE.CJK_DECIMAL;
                case 'decimal-leading-zero':
                    return LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO;
                case 'lower-roman':
                    return LIST_STYLE_TYPE.LOWER_ROMAN;
                case 'upper-roman':
                    return LIST_STYLE_TYPE.UPPER_ROMAN;
                case 'lower-greek':
                    return LIST_STYLE_TYPE.LOWER_GREEK;
                case 'lower-alpha':
                    return LIST_STYLE_TYPE.LOWER_ALPHA;
                case 'upper-alpha':
                    return LIST_STYLE_TYPE.UPPER_ALPHA;
                case 'arabic-indic':
                    return LIST_STYLE_TYPE.ARABIC_INDIC;
                case 'armenian':
                    return LIST_STYLE_TYPE.ARMENIAN;
                case 'bengali':
                    return LIST_STYLE_TYPE.BENGALI;
                case 'cambodian':
                    return LIST_STYLE_TYPE.CAMBODIAN;
                case 'cjk-earthly-branch':
                    return LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH;
                case 'cjk-heavenly-stem':
                    return LIST_STYLE_TYPE.CJK_HEAVENLY_STEM;
                case 'cjk-ideographic':
                    return LIST_STYLE_TYPE.CJK_IDEOGRAPHIC;
                case 'devanagari':
                    return LIST_STYLE_TYPE.DEVANAGARI;
                case 'ethiopic-numeric':
                    return LIST_STYLE_TYPE.ETHIOPIC_NUMERIC;
                case 'georgian':
                    return LIST_STYLE_TYPE.GEORGIAN;
                case 'gujarati':
                    return LIST_STYLE_TYPE.GUJARATI;
                case 'gurmukhi':
                    return LIST_STYLE_TYPE.GURMUKHI;
                case 'hebrew':
                    return LIST_STYLE_TYPE.HEBREW;
                case 'hiragana':
                    return LIST_STYLE_TYPE.HIRAGANA;
                case 'hiragana-iroha':
                    return LIST_STYLE_TYPE.HIRAGANA_IROHA;
                case 'japanese-formal':
                    return LIST_STYLE_TYPE.JAPANESE_FORMAL;
                case 'japanese-informal':
                    return LIST_STYLE_TYPE.JAPANESE_INFORMAL;
                case 'kannada':
                    return LIST_STYLE_TYPE.KANNADA;
                case 'katakana':
                    return LIST_STYLE_TYPE.KATAKANA;
                case 'katakana-iroha':
                    return LIST_STYLE_TYPE.KATAKANA_IROHA;
                case 'khmer':
                    return LIST_STYLE_TYPE.KHMER;
                case 'korean-hangul-formal':
                    return LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL;
                case 'korean-hanja-formal':
                    return LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL;
                case 'korean-hanja-informal':
                    return LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL;
                case 'lao':
                    return LIST_STYLE_TYPE.LAO;
                case 'lower-armenian':
                    return LIST_STYLE_TYPE.LOWER_ARMENIAN;
                case 'malayalam':
                    return LIST_STYLE_TYPE.MALAYALAM;
                case 'mongolian':
                    return LIST_STYLE_TYPE.MONGOLIAN;
                case 'myanmar':
                    return LIST_STYLE_TYPE.MYANMAR;
                case 'oriya':
                    return LIST_STYLE_TYPE.ORIYA;
                case 'persian':
                    return LIST_STYLE_TYPE.PERSIAN;
                case 'simp-chinese-formal':
                    return LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL;
                case 'simp-chinese-informal':
                    return LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL;
                case 'tamil':
                    return LIST_STYLE_TYPE.TAMIL;
                case 'telugu':
                    return LIST_STYLE_TYPE.TELUGU;
                case 'thai':
                    return LIST_STYLE_TYPE.THAI;
                case 'tibetan':
                    return LIST_STYLE_TYPE.TIBETAN;
                case 'trad-chinese-formal':
                    return LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL;
                case 'trad-chinese-informal':
                    return LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL;
                case 'upper-armenian':
                    return LIST_STYLE_TYPE.UPPER_ARMENIAN;
                case 'disclosure-open':
                    return LIST_STYLE_TYPE.DISCLOSURE_OPEN;
                case 'disclosure-closed':
                    return LIST_STYLE_TYPE.DISCLOSURE_CLOSED;
                case 'none':
                default:
                    return LIST_STYLE_TYPE.NONE;
            }
        }
    };

    var marginForSide = function (side) { return ({
        name: "margin-" + side,
        initialValue: '0',
        prefix: false,
        type: PropertyDescriptorParsingType.TOKEN_VALUE
    }); };
    var marginTop = marginForSide('top');
    var marginRight = marginForSide('right');
    var marginBottom = marginForSide('bottom');
    var marginLeft = marginForSide('left');

    var OVERFLOW;
    (function (OVERFLOW) {
        OVERFLOW[OVERFLOW["VISIBLE"] = 0] = "VISIBLE";
        OVERFLOW[OVERFLOW["HIDDEN"] = 1] = "HIDDEN";
        OVERFLOW[OVERFLOW["SCROLL"] = 2] = "SCROLL";
        OVERFLOW[OVERFLOW["AUTO"] = 3] = "AUTO";
    })(OVERFLOW || (OVERFLOW = {}));
    var overflow = {
        name: 'overflow',
        initialValue: 'visible',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            return tokens.filter(isIdentToken).map(function (overflow) {
                switch (overflow.value) {
                    case 'hidden':
                        return OVERFLOW.HIDDEN;
                    case 'scroll':
                        return OVERFLOW.SCROLL;
                    case 'auto':
                        return OVERFLOW.AUTO;
                    case 'visible':
                    default:
                        return OVERFLOW.VISIBLE;
                }
            });
        }
    };

    var OVERFLOW_WRAP;
    (function (OVERFLOW_WRAP) {
        OVERFLOW_WRAP["NORMAL"] = "normal";
        OVERFLOW_WRAP["BREAK_WORD"] = "break-word";
    })(OVERFLOW_WRAP || (OVERFLOW_WRAP = {}));
    var overflowWrap = {
        name: 'overflow-wrap',
        initialValue: 'normal',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (overflow) {
            switch (overflow) {
                case 'break-word':
                    return OVERFLOW_WRAP.BREAK_WORD;
                case 'normal':
                default:
                    return OVERFLOW_WRAP.NORMAL;
            }
        }
    };

    var paddingForSide = function (side) { return ({
        name: "padding-" + side,
        initialValue: '0',
        prefix: false,
        type: PropertyDescriptorParsingType.TYPE_VALUE,
        format: 'length-percentage'
    }); };
    var paddingTop = paddingForSide('top');
    var paddingRight = paddingForSide('right');
    var paddingBottom = paddingForSide('bottom');
    var paddingLeft = paddingForSide('left');

    var TEXT_ALIGN;
    (function (TEXT_ALIGN) {
        TEXT_ALIGN[TEXT_ALIGN["LEFT"] = 0] = "LEFT";
        TEXT_ALIGN[TEXT_ALIGN["CENTER"] = 1] = "CENTER";
        TEXT_ALIGN[TEXT_ALIGN["RIGHT"] = 2] = "RIGHT";
    })(TEXT_ALIGN || (TEXT_ALIGN = {}));
    var textAlign = {
        name: 'text-align',
        initialValue: 'left',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (textAlign) {
            switch (textAlign) {
                case 'right':
                    return TEXT_ALIGN.RIGHT;
                case 'center':
                case 'justify':
                    return TEXT_ALIGN.CENTER;
                case 'left':
                default:
                    return TEXT_ALIGN.LEFT;
            }
        }
    };

    var POSITION;
    (function (POSITION) {
        POSITION[POSITION["STATIC"] = 0] = "STATIC";
        POSITION[POSITION["RELATIVE"] = 1] = "RELATIVE";
        POSITION[POSITION["ABSOLUTE"] = 2] = "ABSOLUTE";
        POSITION[POSITION["FIXED"] = 3] = "FIXED";
        POSITION[POSITION["STICKY"] = 4] = "STICKY";
    })(POSITION || (POSITION = {}));
    var position = {
        name: 'position',
        initialValue: 'static',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (position) {
            switch (position) {
                case 'relative':
                    return POSITION.RELATIVE;
                case 'absolute':
                    return POSITION.ABSOLUTE;
                case 'fixed':
                    return POSITION.FIXED;
                case 'sticky':
                    return POSITION.STICKY;
            }
            return POSITION.STATIC;
        }
    };

    var textShadow = {
        name: 'text-shadow',
        initialValue: 'none',
        type: PropertyDescriptorParsingType.LIST,
        prefix: false,
        parse: function (tokens) {
            if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {
                return [];
            }
            return parseFunctionArgs(tokens).map(function (values) {
                var shadow = {
                    color: COLORS.TRANSPARENT,
                    offsetX: ZERO_LENGTH,
                    offsetY: ZERO_LENGTH,
                    blur: ZERO_LENGTH
                };
                var c = 0;
                for (var i = 0; i < values.length; i++) {
                    var token = values[i];
                    if (isLength(token)) {
                        if (c === 0) {
                            shadow.offsetX = token;
                        }
                        else if (c === 1) {
                            shadow.offsetY = token;
                        }
                        else {
                            shadow.blur = token;
                        }
                        c++;
                    }
                    else {
                        shadow.color = color.parse(token);
                    }
                }
                return shadow;
            });
        }
    };

    var TEXT_TRANSFORM;
    (function (TEXT_TRANSFORM) {
        TEXT_TRANSFORM[TEXT_TRANSFORM["NONE"] = 0] = "NONE";
        TEXT_TRANSFORM[TEXT_TRANSFORM["LOWERCASE"] = 1] = "LOWERCASE";
        TEXT_TRANSFORM[TEXT_TRANSFORM["UPPERCASE"] = 2] = "UPPERCASE";
        TEXT_TRANSFORM[TEXT_TRANSFORM["CAPITALIZE"] = 3] = "CAPITALIZE";
    })(TEXT_TRANSFORM || (TEXT_TRANSFORM = {}));
    var textTransform = {
        name: 'text-transform',
        initialValue: 'none',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (textTransform) {
            switch (textTransform) {
                case 'uppercase':
                    return TEXT_TRANSFORM.UPPERCASE;
                case 'lowercase':
                    return TEXT_TRANSFORM.LOWERCASE;
                case 'capitalize':
                    return TEXT_TRANSFORM.CAPITALIZE;
            }
            return TEXT_TRANSFORM.NONE;
        }
    };

    var transform = {
        name: 'transform',
        initialValue: 'none',
        prefix: true,
        type: PropertyDescriptorParsingType.VALUE,
        parse: function (token) {
            if (token.type === TokenType.IDENT_TOKEN && token.value === 'none') {
                return null;
            }
            if (token.type === TokenType.FUNCTION) {
                var transformFunction = SUPPORTED_TRANSFORM_FUNCTIONS[token.name];
                if (typeof transformFunction === 'undefined') {
                    throw new Error("Attempting to parse an unsupported transform function \"" + token.name + "\"");
                }
                return transformFunction(token.values);
            }
            return null;
        }
    };
    var matrix = function (args) {
        var values = args.filter(function (arg) { return arg.type === TokenType.NUMBER_TOKEN; }).map(function (arg) { return arg.number; });
        return values.length === 6 ? values : null;
    };
    // doesn't support 3D transforms at the moment
    var matrix3d = function (args) {
        var values = args.filter(function (arg) { return arg.type === TokenType.NUMBER_TOKEN; }).map(function (arg) { return arg.number; });
        var a1 = values[0], b1 = values[1], _a = values[2], _b = values[3], a2 = values[4], b2 = values[5], _c = values[6], _d = values[7], _e = values[8], _f = values[9], _g = values[10], _h = values[11], a4 = values[12], b4 = values[13], _j = values[14], _k = values[15];
        return values.length === 16 ? [a1, b1, a2, b2, a4, b4] : null;
    };
    var SUPPORTED_TRANSFORM_FUNCTIONS = {
        matrix: matrix,
        matrix3d: matrix3d
    };

    var DEFAULT_VALUE = {
        type: TokenType.PERCENTAGE_TOKEN,
        number: 50,
        flags: FLAG_INTEGER
    };
    var DEFAULT = [DEFAULT_VALUE, DEFAULT_VALUE];
    var transformOrigin = {
        name: 'transform-origin',
        initialValue: '50% 50%',
        prefix: true,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            var origins = tokens.filter(isLengthPercentage);
            if (origins.length !== 2) {
                return DEFAULT;
            }
            return [origins[0], origins[1]];
        }
    };

    var VISIBILITY;
    (function (VISIBILITY) {
        VISIBILITY[VISIBILITY["VISIBLE"] = 0] = "VISIBLE";
        VISIBILITY[VISIBILITY["HIDDEN"] = 1] = "HIDDEN";
        VISIBILITY[VISIBILITY["COLLAPSE"] = 2] = "COLLAPSE";
    })(VISIBILITY || (VISIBILITY = {}));
    var visibility = {
        name: 'visible',
        initialValue: 'none',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (visibility) {
            switch (visibility) {
                case 'hidden':
                    return VISIBILITY.HIDDEN;
                case 'collapse':
                    return VISIBILITY.COLLAPSE;
                case 'visible':
                default:
                    return VISIBILITY.VISIBLE;
            }
        }
    };

    var WORD_BREAK;
    (function (WORD_BREAK) {
        WORD_BREAK["NORMAL"] = "normal";
        WORD_BREAK["BREAK_ALL"] = "break-all";
        WORD_BREAK["KEEP_ALL"] = "keep-all";
    })(WORD_BREAK || (WORD_BREAK = {}));
    var wordBreak = {
        name: 'word-break',
        initialValue: 'normal',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (wordBreak) {
            switch (wordBreak) {
                case 'break-all':
                    return WORD_BREAK.BREAK_ALL;
                case 'keep-all':
                    return WORD_BREAK.KEEP_ALL;
                case 'normal':
                default:
                    return WORD_BREAK.NORMAL;
            }
        }
    };

    var zIndex = {
        name: 'z-index',
        initialValue: 'auto',
        prefix: false,
        type: PropertyDescriptorParsingType.VALUE,
        parse: function (token) {
            if (token.type === TokenType.IDENT_TOKEN) {
                return { auto: true, order: 0 };
            }
            if (isNumberToken(token)) {
                return { auto: false, order: token.number };
            }
            throw new Error("Invalid z-index number parsed");
        }
    };

    var opacity = {
        name: 'opacity',
        initialValue: '1',
        type: PropertyDescriptorParsingType.VALUE,
        prefix: false,
        parse: function (token) {
            if (isNumberToken(token)) {
                return token.number;
            }
            return 1;
        }
    };

    var textDecorationColor = {
        name: "text-decoration-color",
        initialValue: 'transparent',
        prefix: false,
        type: PropertyDescriptorParsingType.TYPE_VALUE,
        format: 'color'
    };

    var textDecorationLine = {
        name: 'text-decoration-line',
        initialValue: 'none',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            return tokens
                .filter(isIdentToken)
                .map(function (token) {
                switch (token.value) {
                    case 'underline':
                        return 1 /* UNDERLINE */;
                    case 'overline':
                        return 2 /* OVERLINE */;
                    case 'line-through':
                        return 3 /* LINE_THROUGH */;
                    case 'none':
                        return 4 /* BLINK */;
                }
                return 0 /* NONE */;
            })
                .filter(function (line) { return line !== 0 /* NONE */; });
        }
    };

    var fontFamily = {
        name: "font-family",
        initialValue: '',
        prefix: false,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            return tokens.filter(isStringToken$1).map(function (token) { return token.value; });
        }
    };
    var isStringToken$1 = function (token) {
        return token.type === TokenType.STRING_TOKEN || token.type === TokenType.IDENT_TOKEN;
    };

    var fontSize = {
        name: "font-size",
        initialValue: '0',
        prefix: false,
        type: PropertyDescriptorParsingType.TYPE_VALUE,
        format: 'length'
    };

    var fontWeight = {
        name: 'font-weight',
        initialValue: 'normal',
        type: PropertyDescriptorParsingType.VALUE,
        prefix: false,
        parse: function (token) {
            if (isNumberToken(token)) {
                return token.number;
            }
            if (isIdentToken(token)) {
                switch (token.value) {
                    case 'bold':
                        return 700;
                    case 'normal':
                    default:
                        return 400;
                }
            }
            return 400;
        }
    };

    var fontVariant = {
        name: 'font-variant',
        initialValue: 'none',
        type: PropertyDescriptorParsingType.LIST,
        prefix: false,
        parse: function (tokens) {
            return tokens.filter(isIdentToken).map(function (token) { return token.value; });
        }
    };

    var FONT_STYLE;
    (function (FONT_STYLE) {
        FONT_STYLE["NORMAL"] = "normal";
        FONT_STYLE["ITALIC"] = "italic";
        FONT_STYLE["OBLIQUE"] = "oblique";
    })(FONT_STYLE || (FONT_STYLE = {}));
    var fontStyle = {
        name: 'font-style',
        initialValue: 'normal',
        prefix: false,
        type: PropertyDescriptorParsingType.IDENT_VALUE,
        parse: function (overflow) {
            switch (overflow) {
                case 'oblique':
                    return FONT_STYLE.OBLIQUE;
                case 'italic':
                    return FONT_STYLE.ITALIC;
                case 'normal':
                default:
                    return FONT_STYLE.NORMAL;
            }
        }
    };

    var contains = function (bit, value) { return (bit & value) !== 0; };

    var content = {
        name: 'content',
        initialValue: 'none',
        type: PropertyDescriptorParsingType.LIST,
        prefix: false,
        parse: function (tokens) {
            if (tokens.length === 0) {
                return [];
            }
            var first = tokens[0];
            if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {
                return [];
            }
            return tokens;
        }
    };

    var counterIncrement = {
        name: 'counter-increment',
        initialValue: 'none',
        prefix: true,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            if (tokens.length === 0) {
                return null;
            }
            var first = tokens[0];
            if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {
                return null;
            }
            var increments = [];
            var filtered = tokens.filter(nonWhiteSpace);
            for (var i = 0; i < filtered.length; i++) {
                var counter = filtered[i];
                var next = filtered[i + 1];
                if (counter.type === TokenType.IDENT_TOKEN) {
                    var increment = next && isNumberToken(next) ? next.number : 1;
                    increments.push({ counter: counter.value, increment: increment });
                }
            }
            return increments;
        }
    };

    var counterReset = {
        name: 'counter-reset',
        initialValue: 'none',
        prefix: true,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            if (tokens.length === 0) {
                return [];
            }
            var resets = [];
            var filtered = tokens.filter(nonWhiteSpace);
            for (var i = 0; i < filtered.length; i++) {
                var counter = filtered[i];
                var next = filtered[i + 1];
                if (isIdentToken(counter) && counter.value !== 'none') {
                    var reset = next && isNumberToken(next) ? next.number : 0;
                    resets.push({ counter: counter.value, reset: reset });
                }
            }
            return resets;
        }
    };

    var quotes = {
        name: 'quotes',
        initialValue: 'none',
        prefix: true,
        type: PropertyDescriptorParsingType.LIST,
        parse: function (tokens) {
            if (tokens.length === 0) {
                return null;
            }
            var first = tokens[0];
            if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {
                return null;
            }
            var quotes = [];
            var filtered = tokens.filter(isStringToken);
            if (filtered.length % 2 !== 0) {
                return null;
            }
            for (var i = 0; i < filtered.length; i += 2) {
                var open_1 = filtered[i].value;
                var close_1 = filtered[i + 1].value;
                quotes.push({ open: open_1, close: close_1 });
            }
            return quotes;
        }
    };
    var getQuote = function (quotes, depth, open) {
        if (!quotes) {
            return '';
        }
        var quote = quotes[Math.min(depth, quotes.length - 1)];
        if (!quote) {
            return '';
        }
        return open ? quote.open : quote.close;
    };

    var boxShadow = {
        name: 'box-shadow',
        initialValue: 'none',
        type: PropertyDescriptorParsingType.LIST,
        prefix: false,
        parse: function (tokens) {
            if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {
                return [];
            }
            return parseFunctionArgs(tokens).map(function (values) {
                var shadow = {
                    color: 0x000000ff,
                    offsetX: ZERO_LENGTH,
                    offsetY: ZERO_LENGTH,
                    blur: ZERO_LENGTH,
                    spread: ZERO_LENGTH,
                    inset: false
                };
                var c = 0;
                for (var i = 0; i < values.length; i++) {
                    var token = values[i];
                    if (isIdentWithValue(token, 'inset')) {
                        shadow.inset = true;
                    }
                    else if (isLength(token)) {
                        if (c === 0) {
                            shadow.offsetX = token;
                        }
                        else if (c === 1) {
                            shadow.offsetY = token;
                        }
                        else if (c === 2) {
                            shadow.blur = token;
                        }
                        else {
                            shadow.spread = token;
                        }
                        c++;
                    }
                    else {
                        shadow.color = color.parse(token);
                    }
                }
                return shadow;
            });
        }
    };

    var CSSParsedDeclaration = /** @class */ (function () {
        function CSSParsedDeclaration(declaration) {
            this.backgroundClip = parse(backgroundClip, declaration.backgroundClip);
            this.backgroundColor = parse(backgroundColor, declaration.backgroundColor);
            this.backgroundImage = parse(backgroundImage, declaration.backgroundImage);
            this.backgroundOrigin = parse(backgroundOrigin, declaration.backgroundOrigin);
            this.backgroundPosition = parse(backgroundPosition, declaration.backgroundPosition);
            this.backgroundRepeat = parse(backgroundRepeat, declaration.backgroundRepeat);
            this.backgroundSize = parse(backgroundSize, declaration.backgroundSize);
            this.borderTopColor = parse(borderTopColor, declaration.borderTopColor);
            this.borderRightColor = parse(borderRightColor, declaration.borderRightColor);
            this.borderBottomColor = parse(borderBottomColor, declaration.borderBottomColor);
            this.borderLeftColor = parse(borderLeftColor, declaration.borderLeftColor);
            this.borderTopLeftRadius = parse(borderTopLeftRadius, declaration.borderTopLeftRadius);
            this.borderTopRightRadius = parse(borderTopRightRadius, declaration.borderTopRightRadius);
            this.borderBottomRightRadius = parse(borderBottomRightRadius, declaration.borderBottomRightRadius);
            this.borderBottomLeftRadius = parse(borderBottomLeftRadius, declaration.borderBottomLeftRadius);
            this.borderTopStyle = parse(borderTopStyle, declaration.borderTopStyle);
            this.borderRightStyle = parse(borderRightStyle, declaration.borderRightStyle);
            this.borderBottomStyle = parse(borderBottomStyle, declaration.borderBottomStyle);
            this.borderLeftStyle = parse(borderLeftStyle, declaration.borderLeftStyle);
            this.borderTopWidth = parse(borderTopWidth, declaration.borderTopWidth);
            this.borderRightWidth = parse(borderRightWidth, declaration.borderRightWidth);
            this.borderBottomWidth = parse(borderBottomWidth, declaration.borderBottomWidth);
            this.borderLeftWidth = parse(borderLeftWidth, declaration.borderLeftWidth);
            this.boxShadow = parse(boxShadow, declaration.boxShadow);
            this.color = parse(color$1, declaration.color);
            this.display = parse(display, declaration.display);
            this.float = parse(float, declaration.cssFloat);
            this.fontFamily = parse(fontFamily, declaration.fontFamily);
            this.fontSize = parse(fontSize, declaration.fontSize);
            this.fontStyle = parse(fontStyle, declaration.fontStyle);
            this.fontVariant = parse(fontVariant, declaration.fontVariant);
            this.fontWeight = parse(fontWeight, declaration.fontWeight);
            this.letterSpacing = parse(letterSpacing, declaration.letterSpacing);
            this.lineBreak = parse(lineBreak, declaration.lineBreak);
            this.lineHeight = parse(lineHeight, declaration.lineHeight);
            this.listStyleImage = parse(listStyleImage, declaration.listStyleImage);
            this.listStylePosition = parse(listStylePosition, declaration.listStylePosition);
            this.listStyleType = parse(listStyleType, declaration.listStyleType);
            this.marginTop = parse(marginTop, declaration.marginTop);
            this.marginRight = parse(marginRight, declaration.marginRight);
            this.marginBottom = parse(marginBottom, declaration.marginBottom);
            this.marginLeft = parse(marginLeft, declaration.marginLeft);
            this.opacity = parse(opacity, declaration.opacity);
            var overflowTuple = parse(overflow, declaration.overflow);
            this.overflowX = overflowTuple[0];
            this.overflowY = overflowTuple[overflowTuple.length > 1 ? 1 : 0];
            this.overflowWrap = parse(overflowWrap, declaration.overflowWrap);
            this.paddingTop = parse(paddingTop, declaration.paddingTop);
            this.paddingRight = parse(paddingRight, declaration.paddingRight);
            this.paddingBottom = parse(paddingBottom, declaration.paddingBottom);
            this.paddingLeft = parse(paddingLeft, declaration.paddingLeft);
            this.position = parse(position, declaration.position);
            this.textAlign = parse(textAlign, declaration.textAlign);
            this.textDecorationColor = parse(textDecorationColor, declaration.textDecorationColor || declaration.color);
            this.textDecorationLine = parse(textDecorationLine, declaration.textDecorationLine);
            this.textShadow = parse(textShadow, declaration.textShadow);
            this.textTransform = parse(textTransform, declaration.textTransform);
            this.transform = parse(transform, declaration.transform);
            this.transformOrigin = parse(transformOrigin, declaration.transformOrigin);
            this.visibility = parse(visibility, declaration.visibility);
            this.wordBreak = parse(wordBreak, declaration.wordBreak);
            this.zIndex = parse(zIndex, declaration.zIndex);
        }
        CSSParsedDeclaration.prototype.isVisible = function () {
            return this.display > 0 && this.opacity > 0 && this.visibility === VISIBILITY.VISIBLE;
        };
        CSSParsedDeclaration.prototype.isTransparent = function () {
            return isTransparent(this.backgroundColor);
        };
        CSSParsedDeclaration.prototype.isTransformed = function () {
            return this.transform !== null;
        };
        CSSParsedDeclaration.prototype.isPositioned = function () {
            return this.position !== POSITION.STATIC;
        };
        CSSParsedDeclaration.prototype.isPositionedWithZIndex = function () {
            return this.isPositioned() && !this.zIndex.auto;
        };
        CSSParsedDeclaration.prototype.isFloating = function () {
            return this.float !== FLOAT.NONE;
        };
        CSSParsedDeclaration.prototype.isInlineLevel = function () {
            return (contains(this.display, 4 /* INLINE */) ||
                contains(this.display, 33554432 /* INLINE_BLOCK */) ||
                contains(this.display, 268435456 /* INLINE_FLEX */) ||
                contains(this.display, 536870912 /* INLINE_GRID */) ||
                contains(this.display, 67108864 /* INLINE_LIST_ITEM */) ||
                contains(this.display, 134217728 /* INLINE_TABLE */));
        };
        return CSSParsedDeclaration;
    }());
    var CSSParsedPseudoDeclaration = /** @class */ (function () {
        function CSSParsedPseudoDeclaration(declaration) {
            this.content = parse(content, declaration.content);
            this.quotes = parse(quotes, declaration.quotes);
        }
        return CSSParsedPseudoDeclaration;
    }());
    var CSSParsedCounterDeclaration = /** @class */ (function () {
        function CSSParsedCounterDeclaration(declaration) {
            this.counterIncrement = parse(counterIncrement, declaration.counterIncrement);
            this.counterReset = parse(counterReset, declaration.counterReset);
        }
        return CSSParsedCounterDeclaration;
    }());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var parse = function (descriptor, style) {
        var tokenizer = new Tokenizer();
        var value = style !== null && typeof style !== 'undefined' ? style.toString() : descriptor.initialValue;
        tokenizer.write(value);
        var parser = new Parser(tokenizer.read());
        switch (descriptor.type) {
            case PropertyDescriptorParsingType.IDENT_VALUE:
                var token = parser.parseComponentValue();
                return descriptor.parse(isIdentToken(token) ? token.value : descriptor.initialValue);
            case PropertyDescriptorParsingType.VALUE:
                return descriptor.parse(parser.parseComponentValue());
            case PropertyDescriptorParsingType.LIST:
                return descriptor.parse(parser.parseComponentValues());
            case PropertyDescriptorParsingType.TOKEN_VALUE:
                return parser.parseComponentValue();
            case PropertyDescriptorParsingType.TYPE_VALUE:
                switch (descriptor.format) {
                    case 'angle':
                        return angle.parse(parser.parseComponentValue());
                    case 'color':
                        return color.parse(parser.parseComponentValue());
                    case 'image':
                        return image.parse(parser.parseComponentValue());
                    case 'length':
                        var length_1 = parser.parseComponentValue();
                        return isLength(length_1) ? length_1 : ZERO_LENGTH;
                    case 'length-percentage':
                        var value_1 = parser.parseComponentValue();
                        return isLengthPercentage(value_1) ? value_1 : ZERO_LENGTH;
                }
        }
        throw new Error("Attempting to parse unsupported css format type " + descriptor.format);
    };

    var ElementContainer = /** @class */ (function () {
        function ElementContainer(element) {
            this.styles = new CSSParsedDeclaration(window.getComputedStyle(element, null));
            this.textNodes = [];
            this.elements = [];
            if (this.styles.transform !== null && isHTMLElementNode(element)) {
                // getBoundingClientRect takes transforms into account
                element.style.transform = 'none';
            }
            this.bounds = parseBounds(element);
            this.flags = 0;
        }
        return ElementContainer;
    }());

    var TextBounds = /** @class */ (function () {
        function TextBounds(text, bounds) {
            this.text = text;
            this.bounds = bounds;
        }
        return TextBounds;
    }());
    var parseTextBounds = function (value, styles, node) {
        var textList = breakText(value, styles);
        var textBounds = [];
        var offset = 0;
        textList.forEach(function (text) {
            if (styles.textDecorationLine.length || text.trim().length > 0) {
                if (FEATURES.SUPPORT_RANGE_BOUNDS) {
                    textBounds.push(new TextBounds(text, getRangeBounds(node, offset, text.length)));
                }
                else {
                    var replacementNode = node.splitText(text.length);
                    textBounds.push(new TextBounds(text, getWrapperBounds(node)));
                    node = replacementNode;
                }
            }
            else if (!FEATURES.SUPPORT_RANGE_BOUNDS) {
                node = node.splitText(text.length);
            }
            offset += text.length;
        });
        return textBounds;
    };
    var getWrapperBounds = function (node) {
        var ownerDocument = node.ownerDocument;
        if (ownerDocument) {
            var wrapper = ownerDocument.createElement('html2canvaswrapper');
            wrapper.appendChild(node.cloneNode(true));
            var parentNode = node.parentNode;
            if (parentNode) {
                parentNode.replaceChild(wrapper, node);
                var bounds = parseBounds(wrapper);
                if (wrapper.firstChild) {
                    parentNode.replaceChild(wrapper.firstChild, wrapper);
                }
                return bounds;
            }
        }
        return new Bounds(0, 0, 0, 0);
    };
    var getRangeBounds = function (node, offset, length) {
        var ownerDocument = node.ownerDocument;
        if (!ownerDocument) {
            throw new Error('Node has no owner document');
        }
        var range = ownerDocument.createRange();
        range.setStart(node, offset);
        range.setEnd(node, offset + length);
        return Bounds.fromClientRect(range.getBoundingClientRect());
    };
    var breakText = function (value, styles) {
        return styles.letterSpacing !== 0 ? toCodePoints(value).map(function (i) { return fromCodePoint(i); }) : breakWords(value, styles);
    };
    var breakWords = function (str, styles) {
        var breaker = LineBreaker(str, {
            lineBreak: styles.lineBreak,
            wordBreak: styles.overflowWrap === OVERFLOW_WRAP.BREAK_WORD ? 'break-word' : styles.wordBreak
        });
        var words = [];
        var bk;
        while (!(bk = breaker.next()).done) {
            if (bk.value) {
                words.push(bk.value.slice());
            }
        }
        return words;
    };

    var TextContainer = /** @class */ (function () {
        function TextContainer(node, styles) {
            this.text = transform$1(node.data, styles.textTransform);
            this.textBounds = parseTextBounds(this.text, styles, node);
        }
        return TextContainer;
    }());
    var transform$1 = function (text, transform) {
        switch (transform) {
            case TEXT_TRANSFORM.LOWERCASE:
                return text.toLowerCase();
            case TEXT_TRANSFORM.CAPITALIZE:
                return text.replace(CAPITALIZE, capitalize);
            case TEXT_TRANSFORM.UPPERCASE:
                return text.toUpperCase();
            default:
                return text;
        }
    };
    var CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;
    var capitalize = function (m, p1, p2) {
        if (m.length > 0) {
            return p1 + p2.toUpperCase();
        }
        return m;
    };

    var ImageElementContainer = /** @class */ (function (_super) {
        __extends(ImageElementContainer, _super);
        function ImageElementContainer(img) {
            var _this = _super.call(this, img) || this;
            _this.src = img.currentSrc || img.src;
            _this.intrinsicWidth = img.naturalWidth;
            _this.intrinsicHeight = img.naturalHeight;
            CacheStorage.getInstance().addImage(_this.src);
            return _this;
        }
        return ImageElementContainer;
    }(ElementContainer));

    var CanvasElementContainer = /** @class */ (function (_super) {
        __extends(CanvasElementContainer, _super);
        function CanvasElementContainer(canvas) {
            var _this = _super.call(this, canvas) || this;
            _this.canvas = canvas;
            _this.intrinsicWidth = canvas.width;
            _this.intrinsicHeight = canvas.height;
            return _this;
        }
        return CanvasElementContainer;
    }(ElementContainer));

    var SVGElementContainer = /** @class */ (function (_super) {
        __extends(SVGElementContainer, _super);
        function SVGElementContainer(img) {
            var _this = _super.call(this, img) || this;
            var s = new XMLSerializer();
            _this.svg = "data:image/svg+xml," + encodeURIComponent(s.serializeToString(img));
            _this.intrinsicWidth = img.width.baseVal.value;
            _this.intrinsicHeight = img.height.baseVal.value;
            CacheStorage.getInstance().addImage(_this.svg);
            return _this;
        }
        return SVGElementContainer;
    }(ElementContainer));

    var LIElementContainer = /** @class */ (function (_super) {
        __extends(LIElementContainer, _super);
        function LIElementContainer(element) {
            var _this = _super.call(this, element) || this;
            _this.value = element.value;
            return _this;
        }
        return LIElementContainer;
    }(ElementContainer));

    var OLElementContainer = /** @class */ (function (_super) {
        __extends(OLElementContainer, _super);
        function OLElementContainer(element) {
            var _this = _super.call(this, element) || this;
            _this.start = element.start;
            _this.reversed = typeof element.reversed === 'boolean' && element.reversed === true;
            return _this;
        }
        return OLElementContainer;
    }(ElementContainer));

    var CHECKBOX_BORDER_RADIUS = [
        {
            type: TokenType.DIMENSION_TOKEN,
            flags: 0,
            unit: 'px',
            number: 3
        }
    ];
    var RADIO_BORDER_RADIUS = [
        {
            type: TokenType.PERCENTAGE_TOKEN,
            flags: 0,
            number: 50
        }
    ];
    var reformatInputBounds = function (bounds) {
        if (bounds.width > bounds.height) {
            return new Bounds(bounds.left + (bounds.width - bounds.height) / 2, bounds.top, bounds.height, bounds.height);
        }
        else if (bounds.width < bounds.height) {
            return new Bounds(bounds.left, bounds.top + (bounds.height - bounds.width) / 2, bounds.width, bounds.width);
        }
        return bounds;
    };
    var getInputValue = function (node) {
        var value = node.type === PASSWORD ? new Array(node.value.length + 1).join('\u2022') : node.value;
        return value.length === 0 ? node.placeholder || '' : value;
    };
    var CHECKBOX = 'checkbox';
    var RADIO = 'radio';
    var PASSWORD = 'password';
    var INPUT_COLOR = 0x2a2a2aff;
    var InputElementContainer = /** @class */ (function (_super) {
        __extends(InputElementContainer, _super);
        function InputElementContainer(input) {
            var _this = _super.call(this, input) || this;
            _this.type = input.type.toLowerCase();
            _this.checked = input.checked;
            _this.value = getInputValue(input);
            if (_this.type === CHECKBOX || _this.type === RADIO) {
                _this.styles.backgroundColor = 0xdededeff;
                _this.styles.borderTopColor = _this.styles.borderRightColor = _this.styles.borderBottomColor = _this.styles.borderLeftColor = 0xa5a5a5ff;
                _this.styles.borderTopWidth = _this.styles.borderRightWidth = _this.styles.borderBottomWidth = _this.styles.borderLeftWidth = 1;
                _this.styles.borderTopStyle = _this.styles.borderRightStyle = _this.styles.borderBottomStyle = _this.styles.borderLeftStyle =
                    BORDER_STYLE.SOLID;
                _this.styles.backgroundClip = [BACKGROUND_CLIP.BORDER_BOX];
                _this.styles.backgroundOrigin = [0 /* BORDER_BOX */];
                _this.bounds = reformatInputBounds(_this.bounds);
            }
            switch (_this.type) {
                case CHECKBOX:
                    _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = CHECKBOX_BORDER_RADIUS;
                    break;
                case RADIO:
                    _this.styles.borderTopRightRadius = _this.styles.borderTopLeftRadius = _this.styles.borderBottomRightRadius = _this.styles.borderBottomLeftRadius = RADIO_BORDER_RADIUS;
                    break;
            }
            return _this;
        }
        return InputElementContainer;
    }(ElementContainer));

    var SelectElementContainer = /** @class */ (function (_super) {
        __extends(SelectElementContainer, _super);
        function SelectElementContainer(element) {
            var _this = _super.call(this, element) || this;
            var option = element.options[element.selectedIndex || 0];
            _this.value = option ? option.text || '' : '';
            return _this;
        }
        return SelectElementContainer;
    }(ElementContainer));

    var TextareaElementContainer = /** @class */ (function (_super) {
        __extends(TextareaElementContainer, _super);
        function TextareaElementContainer(element) {
            var _this = _super.call(this, element) || this;
            _this.value = element.value;
            return _this;
        }
        return TextareaElementContainer;
    }(ElementContainer));

    var parseColor = function (value) { return color.parse(Parser.create(value).parseComponentValue()); };
    var IFrameElementContainer = /** @class */ (function (_super) {
        __extends(IFrameElementContainer, _super);
        function IFrameElementContainer(iframe) {
            var _this = _super.call(this, iframe) || this;
            _this.src = iframe.src;
            _this.width = parseInt(iframe.width, 10) || 0;
            _this.height = parseInt(iframe.height, 10) || 0;
            _this.backgroundColor = _this.styles.backgroundColor;
            try {
                if (iframe.contentWindow &&
                    iframe.contentWindow.document &&
                    iframe.contentWindow.document.documentElement) {
                    _this.tree = parseTree(iframe.contentWindow.document.documentElement);
                    // http://www.w3.org/TR/css3-background/#special-backgrounds
                    var documentBackgroundColor = iframe.contentWindow.document.documentElement
                        ? parseColor(getComputedStyle(iframe.contentWindow.document.documentElement)
                            .backgroundColor)
                        : COLORS.TRANSPARENT;
                    var bodyBackgroundColor = iframe.contentWindow.document.body
                        ? parseColor(getComputedStyle(iframe.contentWindow.document.body).backgroundColor)
                        : COLORS.TRANSPARENT;
                    _this.backgroundColor = isTransparent(documentBackgroundColor)
                        ? isTransparent(bodyBackgroundColor)
                            ? _this.styles.backgroundColor
                            : bodyBackgroundColor
                        : documentBackgroundColor;
                }
            }
            catch (e) { }
            return _this;
        }
        return IFrameElementContainer;
    }(ElementContainer));

    var LIST_OWNERS = ['OL', 'UL', 'MENU'];
    var parseNodeTree = function (node, parent, root) {
        for (var childNode = node.firstChild, nextNode = void 0; childNode; childNode = nextNode) {
            nextNode = childNode.nextSibling;
            if (isTextNode(childNode) && childNode.data.trim().length > 0) {
                parent.textNodes.push(new TextContainer(childNode, parent.styles));
            }
            else if (isElementNode(childNode)) {
                var container = createContainer(childNode);
                if (container.styles.isVisible()) {
                    if (createsRealStackingContext(childNode, container, root)) {
                        container.flags |= 4 /* CREATES_REAL_STACKING_CONTEXT */;
                    }
                    else if (createsStackingContext(container.styles)) {
                        container.flags |= 2 /* CREATES_STACKING_CONTEXT */;
                    }
                    if (LIST_OWNERS.indexOf(childNode.tagName) !== -1) {
                        container.flags |= 8 /* IS_LIST_OWNER */;
                    }
                    parent.elements.push(container);
                    if (!isTextareaElement(childNode) && !isSVGElement(childNode) && !isSelectElement(childNode)) {
                        parseNodeTree(childNode, container, root);
                    }
                }
            }
        }
    };
    var createContainer = function (element) {
        if (isImageElement(element)) {
            return new ImageElementContainer(element);
        }
        if (isCanvasElement(element)) {
            return new CanvasElementContainer(element);
        }
        if (isSVGElement(element)) {
            return new SVGElementContainer(element);
        }
        if (isLIElement(element)) {
            return new LIElementContainer(element);
        }
        if (isOLElement(element)) {
            return new OLElementContainer(element);
        }
        if (isInputElement(element)) {
            return new InputElementContainer(element);
        }
        if (isSelectElement(element)) {
            return new SelectElementContainer(element);
        }
        if (isTextareaElement(element)) {
            return new TextareaElementContainer(element);
        }
        if (isIFrameElement(element)) {
            return new IFrameElementContainer(element);
        }
        return new ElementContainer(element);
    };
    var parseTree = function (element) {
        var container = createContainer(element);
        container.flags |= 4 /* CREATES_REAL_STACKING_CONTEXT */;
        parseNodeTree(element, container, container);
        return container;
    };
    var createsRealStackingContext = function (node, container, root) {
        return (container.styles.isPositionedWithZIndex() ||
            container.styles.opacity < 1 ||
            container.styles.isTransformed() ||
            (isBodyElement(node) && root.styles.isTransparent()));
    };
    var createsStackingContext = function (styles) { return styles.isPositioned() || styles.isFloating(); };
    var isTextNode = function (node) { return node.nodeType === Node.TEXT_NODE; };
    var isElementNode = function (node) { return node.nodeType === Node.ELEMENT_NODE; };
    var isHTMLElementNode = function (node) {
        return typeof node.style !== 'undefined';
    };
    var isSVGElementNode = function (element) {
        return typeof element.className === 'object';
    };
    var isLIElement = function (node) { return node.tagName === 'LI'; };
    var isOLElement = function (node) { return node.tagName === 'OL'; };
    var isInputElement = function (node) { return node.tagName === 'INPUT'; };
    var isHTMLElement = function (node) { return node.tagName === 'HTML'; };
    var isSVGElement = function (node) { return node.tagName === 'svg'; };
    var isBodyElement = function (node) { return node.tagName === 'BODY'; };
    var isCanvasElement = function (node) { return node.tagName === 'CANVAS'; };
    var isImageElement = function (node) { return node.tagName === 'IMG'; };
    var isIFrameElement = function (node) { return node.tagName === 'IFRAME'; };
    var isStyleElement = function (node) { return node.tagName === 'STYLE'; };
    var isScriptElement = function (node) { return node.tagName === 'SCRIPT'; };
    var isTextareaElement = function (node) { return node.tagName === 'TEXTAREA'; };
    var isSelectElement = function (node) { return node.tagName === 'SELECT'; };

    var CounterState = /** @class */ (function () {
        function CounterState() {
            this.counters = {};
        }
        CounterState.prototype.getCounterValue = function (name) {
            var counter = this.counters[name];
            if (counter && counter.length) {
                return counter[counter.length - 1];
            }
            return 1;
        };
        CounterState.prototype.getCounterValues = function (name) {
            var counter = this.counters[name];
            return counter ? counter : [];
        };
        CounterState.prototype.pop = function (counters) {
            var _this = this;
            counters.forEach(function (counter) { return _this.counters[counter].pop(); });
        };
        CounterState.prototype.parse = function (style) {
            var _this = this;
            var counterIncrement = style.counterIncrement;
            var counterReset = style.counterReset;
            var canReset = true;
            if (counterIncrement !== null) {
                counterIncrement.forEach(function (entry) {
                    var counter = _this.counters[entry.counter];
                    if (counter && entry.increment !== 0) {
                        canReset = false;
                        counter[Math.max(0, counter.length - 1)] += entry.increment;
                    }
                });
            }
            var counterNames = [];
            if (canReset) {
                counterReset.forEach(function (entry) {
                    var counter = _this.counters[entry.counter];
                    counterNames.push(entry.counter);
                    if (!counter) {
                        counter = _this.counters[entry.counter] = [];
                    }
                    counter.push(entry.reset);
                });
            }
            return counterNames;
        };
        return CounterState;
    }());
    var ROMAN_UPPER = {
        integers: [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
        values: ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
    };
    var ARMENIAN = {
        integers: [
            9000,
            8000,
            7000,
            6000,
            5000,
            4000,
            3000,
            2000,
            1000,
            900,
            800,
            700,
            600,
            500,
            400,
            300,
            200,
            100,
            90,
            80,
            70,
            60,
            50,
            40,
            30,
            20,
            10,
            9,
            8,
            7,
            6,
            5,
            4,
            3,
            2,
            1
        ],
        values: [
            'Ք',
            'Փ',
            'Ւ',
            'Ց',
            'Ր',
            'Տ',
            'Վ',
            'Ս',
            'Ռ',
            'Ջ',
            'Պ',
            'Չ',
            'Ո',
            'Շ',
            'Ն',
            'Յ',
            'Մ',
            'Ճ',
            'Ղ',
            'Ձ',
            'Հ',
            'Կ',
            'Ծ',
            'Խ',
            'Լ',
            'Ի',
            'Ժ',
            'Թ',
            'Ը',
            'Է',
            'Զ',
            'Ե',
            'Դ',
            'Գ',
            'Բ',
            'Ա'
        ]
    };
    var HEBREW = {
        integers: [
            10000,
            9000,
            8000,
            7000,
            6000,
            5000,
            4000,
            3000,
            2000,
            1000,
            400,
            300,
            200,
            100,
            90,
            80,
            70,
            60,
            50,
            40,
            30,
            20,
            19,
            18,
            17,
            16,
            15,
            10,
            9,
            8,
            7,
            6,
            5,
            4,
            3,
            2,
            1
        ],
        values: [
            'י׳',
            'ט׳',
            'ח׳',
            'ז׳',
            'ו׳',
            'ה׳',
            'ד׳',
            'ג׳',
            'ב׳',
            'א׳',
            'ת',
            'ש',
            'ר',
            'ק',
            'צ',
            'פ',
            'ע',
            'ס',
            'נ',
            'מ',
            'ל',
            'כ',
            'יט',
            'יח',
            'יז',
            'טז',
            'טו',
            'י',
            'ט',
            'ח',
            'ז',
            'ו',
            'ה',
            'ד',
            'ג',
            'ב',
            'א'
        ]
    };
    var GEORGIAN = {
        integers: [
            10000,
            9000,
            8000,
            7000,
            6000,
            5000,
            4000,
            3000,
            2000,
            1000,
            900,
            800,
            700,
            600,
            500,
            400,
            300,
            200,
            100,
            90,
            80,
            70,
            60,
            50,
            40,
            30,
            20,
            10,
            9,
            8,
            7,
            6,
            5,
            4,
            3,
            2,
            1
        ],
        values: [
            'ჵ',
            'ჰ',
            'ჯ',
            'ჴ',
            'ხ',
            'ჭ',
            'წ',
            'ძ',
            'ც',
            'ჩ',
            'შ',
            'ყ',
            'ღ',
            'ქ',
            'ფ',
            'ჳ',
            'ტ',
            'ს',
            'რ',
            'ჟ',
            'პ',
            'ო',
            'ჲ',
            'ნ',
            'მ',
            'ლ',
            'კ',
            'ი',
            'თ',
            'ჱ',
            'ზ',
            'ვ',
            'ე',
            'დ',
            'გ',
            'ბ',
            'ა'
        ]
    };
    var createAdditiveCounter = function (value, min, max, symbols, fallback, suffix) {
        if (value < min || value > max) {
            return createCounterText(value, fallback, suffix.length > 0);
        }
        return (symbols.integers.reduce(function (string, integer, index) {
            while (value >= integer) {
                value -= integer;
                string += symbols.values[index];
            }
            return string;
        }, '') + suffix);
    };
    var createCounterStyleWithSymbolResolver = function (value, codePointRangeLength, isNumeric, resolver) {
        var string = '';
        do {
            if (!isNumeric) {
                value--;
            }
            string = resolver(value) + string;
            value /= codePointRangeLength;
        } while (value * codePointRangeLength >= codePointRangeLength);
        return string;
    };
    var createCounterStyleFromRange = function (value, codePointRangeStart, codePointRangeEnd, isNumeric, suffix) {
        var codePointRangeLength = codePointRangeEnd - codePointRangeStart + 1;
        return ((value < 0 ? '-' : '') +
            (createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, isNumeric, function (codePoint) {
                return fromCodePoint(Math.floor(codePoint % codePointRangeLength) + codePointRangeStart);
            }) +
                suffix));
    };
    var createCounterStyleFromSymbols = function (value, symbols, suffix) {
        if (suffix === void 0) { suffix = '. '; }
        var codePointRangeLength = symbols.length;
        return (createCounterStyleWithSymbolResolver(Math.abs(value), codePointRangeLength, false, function (codePoint) { return symbols[Math.floor(codePoint % codePointRangeLength)]; }) + suffix);
    };
    var CJK_ZEROS = 1 << 0;
    var CJK_TEN_COEFFICIENTS = 1 << 1;
    var CJK_TEN_HIGH_COEFFICIENTS = 1 << 2;
    var CJK_HUNDRED_COEFFICIENTS = 1 << 3;
    var createCJKCounter = function (value, numbers, multipliers, negativeSign, suffix, flags) {
        if (value < -9999 || value > 9999) {
            return createCounterText(value, LIST_STYLE_TYPE.CJK_DECIMAL, suffix.length > 0);
        }
        var tmp = Math.abs(value);
        var string = suffix;
        if (tmp === 0) {
            return numbers[0] + string;
        }
        for (var digit = 0; tmp > 0 && digit <= 4; digit++) {
            var coefficient = tmp % 10;
            if (coefficient === 0 && contains(flags, CJK_ZEROS) && string !== '') {
                string = numbers[coefficient] + string;
            }
            else if (coefficient > 1 ||
                (coefficient === 1 && digit === 0) ||
                (coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_COEFFICIENTS)) ||
                (coefficient === 1 && digit === 1 && contains(flags, CJK_TEN_HIGH_COEFFICIENTS) && value > 100) ||
                (coefficient === 1 && digit > 1 && contains(flags, CJK_HUNDRED_COEFFICIENTS))) {
                string = numbers[coefficient] + (digit > 0 ? multipliers[digit - 1] : '') + string;
            }
            else if (coefficient === 1 && digit > 0) {
                string = multipliers[digit - 1] + string;
            }
            tmp = Math.floor(tmp / 10);
        }
        return (value < 0 ? negativeSign : '') + string;
    };
    var CHINESE_INFORMAL_MULTIPLIERS = '十百千萬';
    var CHINESE_FORMAL_MULTIPLIERS = '拾佰仟萬';
    var JAPANESE_NEGATIVE = 'マイナス';
    var KOREAN_NEGATIVE = '마이너스';
    var createCounterText = function (value, type, appendSuffix) {
        var defaultSuffix = appendSuffix ? '. ' : '';
        var cjkSuffix = appendSuffix ? '、' : '';
        var koreanSuffix = appendSuffix ? ', ' : '';
        var spaceSuffix = appendSuffix ? ' ' : '';
        switch (type) {
            case LIST_STYLE_TYPE.DISC:
                return '•' + spaceSuffix;
            case LIST_STYLE_TYPE.CIRCLE:
                return '◦' + spaceSuffix;
            case LIST_STYLE_TYPE.SQUARE:
                return '◾' + spaceSuffix;
            case LIST_STYLE_TYPE.DECIMAL_LEADING_ZERO:
                var string = createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);
                return string.length < 4 ? "0" + string : string;
            case LIST_STYLE_TYPE.CJK_DECIMAL:
                return createCounterStyleFromSymbols(value, '〇一二三四五六七八九', cjkSuffix);
            case LIST_STYLE_TYPE.LOWER_ROMAN:
                return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, LIST_STYLE_TYPE.DECIMAL, defaultSuffix).toLowerCase();
            case LIST_STYLE_TYPE.UPPER_ROMAN:
                return createAdditiveCounter(value, 1, 3999, ROMAN_UPPER, LIST_STYLE_TYPE.DECIMAL, defaultSuffix);
            case LIST_STYLE_TYPE.LOWER_GREEK:
                return createCounterStyleFromRange(value, 945, 969, false, defaultSuffix);
            case LIST_STYLE_TYPE.LOWER_ALPHA:
                return createCounterStyleFromRange(value, 97, 122, false, defaultSuffix);
            case LIST_STYLE_TYPE.UPPER_ALPHA:
                return createCounterStyleFromRange(value, 65, 90, false, defaultSuffix);
            case LIST_STYLE_TYPE.ARABIC_INDIC:
                return createCounterStyleFromRange(value, 1632, 1641, true, defaultSuffix);
            case LIST_STYLE_TYPE.ARMENIAN:
            case LIST_STYLE_TYPE.UPPER_ARMENIAN:
                return createAdditiveCounter(value, 1, 9999, ARMENIAN, LIST_STYLE_TYPE.DECIMAL, defaultSuffix);
            case LIST_STYLE_TYPE.LOWER_ARMENIAN:
                return createAdditiveCounter(value, 1, 9999, ARMENIAN, LIST_STYLE_TYPE.DECIMAL, defaultSuffix).toLowerCase();
            case LIST_STYLE_TYPE.BENGALI:
                return createCounterStyleFromRange(value, 2534, 2543, true, defaultSuffix);
            case LIST_STYLE_TYPE.CAMBODIAN:
            case LIST_STYLE_TYPE.KHMER:
                return createCounterStyleFromRange(value, 6112, 6121, true, defaultSuffix);
            case LIST_STYLE_TYPE.CJK_EARTHLY_BRANCH:
                return createCounterStyleFromSymbols(value, '子丑寅卯辰巳午未申酉戌亥', cjkSuffix);
            case LIST_STYLE_TYPE.CJK_HEAVENLY_STEM:
                return createCounterStyleFromSymbols(value, '甲乙丙丁戊己庚辛壬癸', cjkSuffix);
            case LIST_STYLE_TYPE.CJK_IDEOGRAPHIC:
            case LIST_STYLE_TYPE.TRAD_CHINESE_INFORMAL:
                return createCJKCounter(value, '零一二三四五六七八九', CHINESE_INFORMAL_MULTIPLIERS, '負', cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
            case LIST_STYLE_TYPE.TRAD_CHINESE_FORMAL:
                return createCJKCounter(value, '零壹貳參肆伍陸柒捌玖', CHINESE_FORMAL_MULTIPLIERS, '負', cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
            case LIST_STYLE_TYPE.SIMP_CHINESE_INFORMAL:
                return createCJKCounter(value, '零一二三四五六七八九', CHINESE_INFORMAL_MULTIPLIERS, '负', cjkSuffix, CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
            case LIST_STYLE_TYPE.SIMP_CHINESE_FORMAL:
                return createCJKCounter(value, '零壹贰叁肆伍陆柒捌玖', CHINESE_FORMAL_MULTIPLIERS, '负', cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS | CJK_HUNDRED_COEFFICIENTS);
            case LIST_STYLE_TYPE.JAPANESE_INFORMAL:
                return createCJKCounter(value, '〇一二三四五六七八九', '十百千万', JAPANESE_NEGATIVE, cjkSuffix, 0);
            case LIST_STYLE_TYPE.JAPANESE_FORMAL:
                return createCJKCounter(value, '零壱弐参四伍六七八九', '拾百千万', JAPANESE_NEGATIVE, cjkSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
            case LIST_STYLE_TYPE.KOREAN_HANGUL_FORMAL:
                return createCJKCounter(value, '영일이삼사오육칠팔구', '십백천만', KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
            case LIST_STYLE_TYPE.KOREAN_HANJA_INFORMAL:
                return createCJKCounter(value, '零一二三四五六七八九', '十百千萬', KOREAN_NEGATIVE, koreanSuffix, 0);
            case LIST_STYLE_TYPE.KOREAN_HANJA_FORMAL:
                return createCJKCounter(value, '零壹貳參四五六七八九', '拾百千', KOREAN_NEGATIVE, koreanSuffix, CJK_ZEROS | CJK_TEN_COEFFICIENTS | CJK_TEN_HIGH_COEFFICIENTS);
            case LIST_STYLE_TYPE.DEVANAGARI:
                return createCounterStyleFromRange(value, 0x966, 0x96f, true, defaultSuffix);
            case LIST_STYLE_TYPE.GEORGIAN:
                return createAdditiveCounter(value, 1, 19999, GEORGIAN, LIST_STYLE_TYPE.DECIMAL, defaultSuffix);
            case LIST_STYLE_TYPE.GUJARATI:
                return createCounterStyleFromRange(value, 0xae6, 0xaef, true, defaultSuffix);
            case LIST_STYLE_TYPE.GURMUKHI:
                return createCounterStyleFromRange(value, 0xa66, 0xa6f, true, defaultSuffix);
            case LIST_STYLE_TYPE.HEBREW:
                return createAdditiveCounter(value, 1, 10999, HEBREW, LIST_STYLE_TYPE.DECIMAL, defaultSuffix);
            case LIST_STYLE_TYPE.HIRAGANA:
                return createCounterStyleFromSymbols(value, 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわゐゑをん');
            case LIST_STYLE_TYPE.HIRAGANA_IROHA:
                return createCounterStyleFromSymbols(value, 'いろはにほへとちりぬるをわかよたれそつねならむうゐのおくやまけふこえてあさきゆめみしゑひもせす');
            case LIST_STYLE_TYPE.KANNADA:
                return createCounterStyleFromRange(value, 0xce6, 0xcef, true, defaultSuffix);
            case LIST_STYLE_TYPE.KATAKANA:
                return createCounterStyleFromSymbols(value, 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲン', cjkSuffix);
            case LIST_STYLE_TYPE.KATAKANA_IROHA:
                return createCounterStyleFromSymbols(value, 'イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセス', cjkSuffix);
            case LIST_STYLE_TYPE.LAO:
                return createCounterStyleFromRange(value, 0xed0, 0xed9, true, defaultSuffix);
            case LIST_STYLE_TYPE.MONGOLIAN:
                return createCounterStyleFromRange(value, 0x1810, 0x1819, true, defaultSuffix);
            case LIST_STYLE_TYPE.MYANMAR:
                return createCounterStyleFromRange(value, 0x1040, 0x1049, true, defaultSuffix);
            case LIST_STYLE_TYPE.ORIYA:
                return createCounterStyleFromRange(value, 0xb66, 0xb6f, true, defaultSuffix);
            case LIST_STYLE_TYPE.PERSIAN:
                return createCounterStyleFromRange(value, 0x6f0, 0x6f9, true, defaultSuffix);
            case LIST_STYLE_TYPE.TAMIL:
                return createCounterStyleFromRange(value, 0xbe6, 0xbef, true, defaultSuffix);
            case LIST_STYLE_TYPE.TELUGU:
                return createCounterStyleFromRange(value, 0xc66, 0xc6f, true, defaultSuffix);
            case LIST_STYLE_TYPE.THAI:
                return createCounterStyleFromRange(value, 0xe50, 0xe59, true, defaultSuffix);
            case LIST_STYLE_TYPE.TIBETAN:
                return createCounterStyleFromRange(value, 0xf20, 0xf29, true, defaultSuffix);
            case LIST_STYLE_TYPE.DECIMAL:
            default:
                return createCounterStyleFromRange(value, 48, 57, true, defaultSuffix);
        }
    };

    var IGNORE_ATTRIBUTE = 'data-html2canvas-ignore';
    var DocumentCloner = /** @class */ (function () {
        function DocumentCloner(element, options) {
            this.options = options;
            this.scrolledElements = [];
            this.referenceElement = element;
            this.counters = new CounterState();
            this.quoteDepth = 0;
            if (!element.ownerDocument) {
                throw new Error('Cloned element does not have an owner document');
            }
            this.documentElement = this.cloneNode(element.ownerDocument.documentElement);
        }
        DocumentCloner.prototype.toIFrame = function (ownerDocument, windowSize) {
            var _this = this;
            var iframe = createIFrameContainer(ownerDocument, windowSize);
            if (!iframe.contentWindow) {
                return Promise.reject("Unable to find iframe window");
            }
            var scrollX = ownerDocument.defaultView.pageXOffset;
            var scrollY = ownerDocument.defaultView.pageYOffset;
            var cloneWindow = iframe.contentWindow;
            var documentClone = cloneWindow.document;
            /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
             if window url is about:blank, we can assign the url to current by writing onto the document
             */
            var iframeLoad = iframeLoader(iframe).then(function () { return __awaiter(_this, void 0, void 0, function () {
                var onclone;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.scrolledElements.forEach(restoreNodeScroll);
                            if (cloneWindow) {
                                cloneWindow.scrollTo(windowSize.left, windowSize.top);
                                if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent) &&
                                    (cloneWindow.scrollY !== windowSize.top || cloneWindow.scrollX !== windowSize.left)) {
                                    documentClone.documentElement.style.top = -windowSize.top + 'px';
                                    documentClone.documentElement.style.left = -windowSize.left + 'px';
                                    documentClone.documentElement.style.position = 'absolute';
                                }
                            }
                            onclone = this.options.onclone;
                            if (typeof this.clonedReferenceElement === 'undefined') {
                                return [2 /*return*/, Promise.reject("Error finding the " + this.referenceElement.nodeName + " in the cloned document")];
                            }
                            if (!(documentClone.fonts && documentClone.fonts.ready)) return [3 /*break*/, 2];
                            return [4 /*yield*/, documentClone.fonts.ready];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            if (typeof onclone === 'function') {
                                return [2 /*return*/, Promise.resolve()
                                        .then(function () { return onclone(documentClone); })
                                        .then(function () { return iframe; })];
                            }
                            return [2 /*return*/, iframe];
                    }
                });
            }); });
            documentClone.open();
            documentClone.write(serializeDoctype(document.doctype) + "<html></html>");
            // Chrome scrolls the parent document for some reason after the write to the cloned window???
            restoreOwnerScroll(this.referenceElement.ownerDocument, scrollX, scrollY);
            documentClone.replaceChild(documentClone.adoptNode(this.documentElement), documentClone.documentElement);
            documentClone.close();
            return iframeLoad;
        };
        DocumentCloner.prototype.createElementClone = function (node) {
            if (isCanvasElement(node)) {
                return this.createCanvasClone(node);
            }
            /*
            if (isIFrameElement(node)) {
                return this.createIFrameClone(node);
            }
    */
            if (isStyleElement(node)) {
                return this.createStyleClone(node);
            }
            return node.cloneNode(false);
        };
        DocumentCloner.prototype.createStyleClone = function (node) {
            try {
                var sheet = node.sheet;
                if (sheet && sheet.cssRules) {
                    var css = [].slice.call(sheet.cssRules, 0).reduce(function (css, rule) {
                        if (rule && typeof rule.cssText === 'string') {
                            return css + rule.cssText;
                        }
                        return css;
                    }, '');
                    var style = node.cloneNode(false);
                    style.textContent = css;
                    return style;
                }
            }
            catch (e) {
                // accessing node.sheet.cssRules throws a DOMException
                Logger.getInstance(this.options.id).error('Unable to access cssRules property', e);
                if (e.name !== 'SecurityError') {
                    throw e;
                }
            }
            return node.cloneNode(false);
        };
        DocumentCloner.prototype.createCanvasClone = function (canvas) {
            if (this.options.inlineImages && canvas.ownerDocument) {
                var img = canvas.ownerDocument.createElement('img');
                try {
                    img.src = canvas.toDataURL();
                    return img;
                }
                catch (e) {
                    Logger.getInstance(this.options.id).info("Unable to clone canvas contents, canvas is tainted");
                }
            }
            var clonedCanvas = canvas.cloneNode(false);
            try {
                clonedCanvas.width = canvas.width;
                clonedCanvas.height = canvas.height;
                var ctx = canvas.getContext('2d');
                var clonedCtx = clonedCanvas.getContext('2d');
                if (clonedCtx) {
                    if (ctx) {
                        clonedCtx.putImageData(ctx.getImageData(0, 0, canvas.width, canvas.height), 0, 0);
                    }
                    else {
                        clonedCtx.drawImage(canvas, 0, 0);
                    }
                }
                return clonedCanvas;
            }
            catch (e) { }
            return clonedCanvas;
        };
        /*
        createIFrameClone(iframe: HTMLIFrameElement) {
            const tempIframe = <HTMLIFrameElement>iframe.cloneNode(false);
            const iframeKey = generateIframeKey();
            tempIframe.setAttribute('data-html2canvas-internal-iframe-key', iframeKey);

            const {width, height} = parseBounds(iframe);

            this.resourceLoader.cache[iframeKey] = getIframeDocumentElement(iframe, this.options)
                .then(documentElement => {
                    return this.renderer(
                        documentElement,
                        {
                            allowTaint: this.options.allowTaint,
                            backgroundColor: '#ffffff',
                            canvas: null,
                            imageTimeout: this.options.imageTimeout,
                            logging: this.options.logging,
                            proxy: this.options.proxy,
                            removeContainer: this.options.removeContainer,
                            scale: this.options.scale,
                            foreignObjectRendering: this.options.foreignObjectRendering,
                            useCORS: this.options.useCORS,
                            target: new CanvasRenderer(),
                            width,
                            height,
                            x: 0,
                            y: 0,
                            windowWidth: documentElement.ownerDocument.defaultView.innerWidth,
                            windowHeight: documentElement.ownerDocument.defaultView.innerHeight,
                            scrollX: documentElement.ownerDocument.defaultView.pageXOffset,
                            scrollY: documentElement.ownerDocument.defaultView.pageYOffset
                        },
                    );
                })
                .then(
                    (canvas: HTMLCanvasElement) =>
                        new Promise((resolve, reject) => {
                            const iframeCanvas = document.createElement('img');
                            iframeCanvas.onload = () => resolve(canvas);
                            iframeCanvas.onerror = (event) => {
                                // Empty iframes may result in empty "data:," URLs, which are invalid from the <img>'s point of view
                                // and instead of `onload` cause `onerror` and unhandled rejection warnings
                                // https://github.com/niklasvh/html2canvas/issues/1502
                                iframeCanvas.src == 'data:,' ? resolve(canvas) : reject(event);
                            };
                            iframeCanvas.src = canvas.toDataURL();
                            if (tempIframe.parentNode && iframe.ownerDocument && iframe.ownerDocument.defaultView) {
                                tempIframe.parentNode.replaceChild(
                                    copyCSSStyles(
                                        iframe.ownerDocument.defaultView.getComputedStyle(iframe),
                                        iframeCanvas
                                    ),
                                    tempIframe
                                );
                            }
                        })
                );
            return tempIframe;
        }
    */
        DocumentCloner.prototype.cloneNode = function (node) {
            if (isTextNode(node)) {
                return document.createTextNode(node.data);
            }
            if (!node.ownerDocument) {
                return node.cloneNode(false);
            }
            var window = node.ownerDocument.defaultView;
            if (isHTMLElementNode(node) && window) {
                var clone = this.createElementClone(node);
                var style = window.getComputedStyle(node);
                var styleBefore = window.getComputedStyle(node, ':before');
                var styleAfter = window.getComputedStyle(node, ':after');
                if (this.referenceElement === node) {
                    this.clonedReferenceElement = clone;
                }
                if (isBodyElement(clone)) {
                    createPseudoHideStyles(clone);
                }
                var counters = this.counters.parse(new CSSParsedCounterDeclaration(style));
                var before = this.resolvePseudoContent(node, clone, styleBefore, PseudoElementType.BEFORE);
                for (var child = node.firstChild; child; child = child.nextSibling) {
                    if (!isElementNode(child) ||
                        (!isScriptElement(child) &&
                            !child.hasAttribute(IGNORE_ATTRIBUTE) &&
                            (typeof this.options.ignoreElements !== 'function' || !this.options.ignoreElements(child)))) {
                        if (!this.options.copyStyles || !isElementNode(child) || !isStyleElement(child)) {
                            clone.appendChild(this.cloneNode(child));
                        }
                    }
                }
                if (before) {
                    clone.insertBefore(before, clone.firstChild);
                }
                var after = this.resolvePseudoContent(node, clone, styleAfter, PseudoElementType.AFTER);
                if (after) {
                    clone.appendChild(after);
                }
                this.counters.pop(counters);
                if (style && this.options.copyStyles && !isIFrameElement(node)) {
                    copyCSSStyles(style, clone);
                }
                //this.inlineAllImages(clone);
                if (node.scrollTop !== 0 || node.scrollLeft !== 0) {
                    this.scrolledElements.push([clone, node.scrollLeft, node.scrollTop]);
                }
                if ((isTextareaElement(node) || isSelectElement(node)) &&
                    (isTextareaElement(clone) || isSelectElement(clone))) {
                    clone.value = node.value;
                }
                return clone;
            }
            return node.cloneNode(false);
        };
        DocumentCloner.prototype.resolvePseudoContent = function (node, clone, style, pseudoElt) {
            var _this = this;
            if (!style) {
                return;
            }
            var value = style.content;
            var document = clone.ownerDocument;
            if (!document || !value || value === 'none' || value === '-moz-alt-content' || style.display === 'none') {
                return;
            }
            this.counters.parse(new CSSParsedCounterDeclaration(style));
            var declaration = new CSSParsedPseudoDeclaration(style);
            var anonymousReplacedElement = document.createElement('html2canvaspseudoelement');
            copyCSSStyles(style, anonymousReplacedElement);
            declaration.content.forEach(function (token) {
                if (token.type === TokenType.STRING_TOKEN) {
                    anonymousReplacedElement.appendChild(document.createTextNode(token.value));
                }
                else if (token.type === TokenType.URL_TOKEN) {
                    var img = document.createElement('img');
                    img.src = token.value;
                    img.style.opacity = '1';
                    anonymousReplacedElement.appendChild(img);
                }
                else if (token.type === TokenType.FUNCTION) {
                    if (token.name === 'attr') {
                        var attr = token.values.filter(isIdentToken);
                        if (attr.length) {
                            anonymousReplacedElement.appendChild(document.createTextNode(node.getAttribute(attr[0].value) || ''));
                        }
                    }
                    else if (token.name === 'counter') {
                        var _a = token.values.filter(nonFunctionArgSeparator), counter = _a[0], counterStyle = _a[1];
                        if (counter && isIdentToken(counter)) {
                            var counterState = _this.counters.getCounterValue(counter.value);
                            var counterType = counterStyle && isIdentToken(counterStyle)
                                ? listStyleType.parse(counterStyle.value)
                                : LIST_STYLE_TYPE.DECIMAL;
                            anonymousReplacedElement.appendChild(document.createTextNode(createCounterText(counterState, counterType, false)));
                        }
                    }
                    else if (token.name === 'counters') {
                        var _b = token.values.filter(nonFunctionArgSeparator), counter = _b[0], delim = _b[1], counterStyle = _b[2];
                        if (counter && isIdentToken(counter)) {
                            var counterStates = _this.counters.getCounterValues(counter.value);
                            var counterType_1 = counterStyle && isIdentToken(counterStyle)
                                ? listStyleType.parse(counterStyle.value)
                                : LIST_STYLE_TYPE.DECIMAL;
                            var separator = delim && delim.type === TokenType.STRING_TOKEN ? delim.value : '';
                            var text = counterStates
                                .map(function (value) { return createCounterText(value, counterType_1, false); })
                                .join(separator);
                            anonymousReplacedElement.appendChild(document.createTextNode(text));
                        }
                    }
                }
                else if (token.type === TokenType.IDENT_TOKEN) {
                    switch (token.value) {
                        case 'open-quote':
                            anonymousReplacedElement.appendChild(document.createTextNode(getQuote(declaration.quotes, _this.quoteDepth++, true)));
                            break;
                        case 'close-quote':
                            anonymousReplacedElement.appendChild(document.createTextNode(getQuote(declaration.quotes, --_this.quoteDepth, false)));
                            break;
                        default:
                            // safari doesn't parse string tokens correctly because of lack of quotes
                            anonymousReplacedElement.appendChild(document.createTextNode(token.value));
                    }
                }
            });
            anonymousReplacedElement.className = PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
            var newClassName = pseudoElt === PseudoElementType.BEFORE
                ? " " + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE
                : " " + PSEUDO_HIDE_ELEMENT_CLASS_AFTER;
            if (isSVGElementNode(clone)) {
                clone.className.baseValue += newClassName;
            }
            else {
                clone.className += newClassName;
            }
            return anonymousReplacedElement;
        };
        DocumentCloner.destroy = function (container) {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
                return true;
            }
            return false;
        };
        return DocumentCloner;
    }());
    var PseudoElementType;
    (function (PseudoElementType) {
        PseudoElementType[PseudoElementType["BEFORE"] = 0] = "BEFORE";
        PseudoElementType[PseudoElementType["AFTER"] = 1] = "AFTER";
    })(PseudoElementType || (PseudoElementType = {}));
    var createIFrameContainer = function (ownerDocument, bounds) {
        var cloneIframeContainer = ownerDocument.createElement('iframe');
        cloneIframeContainer.className = 'html2canvas-container';
        cloneIframeContainer.style.visibility = 'hidden';
        cloneIframeContainer.style.position = 'fixed';
        cloneIframeContainer.style.left = '-10000px';
        cloneIframeContainer.style.top = '0px';
        cloneIframeContainer.style.border = '0';
        cloneIframeContainer.width = bounds.width.toString();
        cloneIframeContainer.height = bounds.height.toString();
        cloneIframeContainer.scrolling = 'no'; // ios won't scroll without it
        cloneIframeContainer.setAttribute(IGNORE_ATTRIBUTE, 'true');
        ownerDocument.body.appendChild(cloneIframeContainer);
        return cloneIframeContainer;
    };
    var iframeLoader = function (iframe) {
        return new Promise(function (resolve, reject) {
            var cloneWindow = iframe.contentWindow;
            if (!cloneWindow) {
                return reject("No window assigned for iframe");
            }
            var documentClone = cloneWindow.document;
            cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = function () {
                cloneWindow.onload = iframe.onload = documentClone.onreadystatechange = null;
                var interval = setInterval(function () {
                    if (documentClone.body.childNodes.length > 0 && documentClone.readyState === 'complete') {
                        clearInterval(interval);
                        resolve(iframe);
                    }
                }, 50);
            };
        });
    };
    var copyCSSStyles = function (style, target) {
        // Edge does not provide value for cssText
        for (var i = style.length - 1; i >= 0; i--) {
            var property = style.item(i);
            // Safari shows pseudoelements if content is set
            if (property !== 'content') {
                target.style.setProperty(property, style.getPropertyValue(property));
            }
        }
        return target;
    };
    var serializeDoctype = function (doctype) {
        var str = '';
        if (doctype) {
            str += '<!DOCTYPE ';
            if (doctype.name) {
                str += doctype.name;
            }
            if (doctype.internalSubset) {
                str += doctype.internalSubset;
            }
            if (doctype.publicId) {
                str += "\"" + doctype.publicId + "\"";
            }
            if (doctype.systemId) {
                str += "\"" + doctype.systemId + "\"";
            }
            str += '>';
        }
        return str;
    };
    var restoreOwnerScroll = function (ownerDocument, x, y) {
        if (ownerDocument &&
            ownerDocument.defaultView &&
            (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
            ownerDocument.defaultView.scrollTo(x, y);
        }
    };
    var restoreNodeScroll = function (_a) {
        var element = _a[0], x = _a[1], y = _a[2];
        element.scrollLeft = x;
        element.scrollTop = y;
    };
    var PSEUDO_BEFORE = ':before';
    var PSEUDO_AFTER = ':after';
    var PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = '___html2canvas___pseudoelement_before';
    var PSEUDO_HIDE_ELEMENT_CLASS_AFTER = '___html2canvas___pseudoelement_after';
    var PSEUDO_HIDE_ELEMENT_STYLE = "{\n    content: \"\" !important;\n    display: none !important;\n}";
    var createPseudoHideStyles = function (body) {
        createStyles(body, "." + PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + PSEUDO_BEFORE + PSEUDO_HIDE_ELEMENT_STYLE + "\n         ." + PSEUDO_HIDE_ELEMENT_CLASS_AFTER + PSEUDO_AFTER + PSEUDO_HIDE_ELEMENT_STYLE);
    };
    var createStyles = function (body, styles) {
        var document = body.ownerDocument;
        if (document) {
            var style = document.createElement('style');
            style.textContent = styles;
            body.appendChild(style);
        }
    };

    var PathType;
    (function (PathType) {
        PathType[PathType["VECTOR"] = 0] = "VECTOR";
        PathType[PathType["BEZIER_CURVE"] = 1] = "BEZIER_CURVE";
    })(PathType || (PathType = {}));
    var equalPath = function (a, b) {
        if (a.length === b.length) {
            return a.some(function (v, i) { return v === b[i]; });
        }
        return false;
    };
    var transformPath = function (path, deltaX, deltaY, deltaW, deltaH) {
        return path.map(function (point, index) {
            switch (index) {
                case 0:
                    return point.add(deltaX, deltaY);
                case 1:
                    return point.add(deltaX + deltaW, deltaY);
                case 2:
                    return point.add(deltaX + deltaW, deltaY + deltaH);
                case 3:
                    return point.add(deltaX, deltaY + deltaH);
            }
            return point;
        });
    };

    var Vector = /** @class */ (function () {
        function Vector(x, y) {
            this.type = PathType.VECTOR;
            this.x = x;
            this.y = y;
        }
        Vector.prototype.add = function (deltaX, deltaY) {
            return new Vector(this.x + deltaX, this.y + deltaY);
        };
        return Vector;
    }());

    var lerp = function (a, b, t) {
        return new Vector(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    };
    var BezierCurve = /** @class */ (function () {
        function BezierCurve(start, startControl, endControl, end) {
            this.type = PathType.BEZIER_CURVE;
            this.start = start;
            this.startControl = startControl;
            this.endControl = endControl;
            this.end = end;
        }
        BezierCurve.prototype.subdivide = function (t, firstHalf) {
            var ab = lerp(this.start, this.startControl, t);
            var bc = lerp(this.startControl, this.endControl, t);
            var cd = lerp(this.endControl, this.end, t);
            var abbc = lerp(ab, bc, t);
            var bccd = lerp(bc, cd, t);
            var dest = lerp(abbc, bccd, t);
            return firstHalf ? new BezierCurve(this.start, ab, abbc, dest) : new BezierCurve(dest, bccd, cd, this.end);
        };
        BezierCurve.prototype.add = function (deltaX, deltaY) {
            return new BezierCurve(this.start.add(deltaX, deltaY), this.startControl.add(deltaX, deltaY), this.endControl.add(deltaX, deltaY), this.end.add(deltaX, deltaY));
        };
        BezierCurve.prototype.reverse = function () {
            return new BezierCurve(this.end, this.endControl, this.startControl, this.start);
        };
        return BezierCurve;
    }());
    var isBezierCurve = function (path) { return path.type === PathType.BEZIER_CURVE; };

    var BoundCurves = /** @class */ (function () {
        function BoundCurves(element) {
            var styles = element.styles;
            var bounds = element.bounds;
            var _a = getAbsoluteValueForTuple(styles.borderTopLeftRadius, bounds.width, bounds.height), tlh = _a[0], tlv = _a[1];
            var _b = getAbsoluteValueForTuple(styles.borderTopRightRadius, bounds.width, bounds.height), trh = _b[0], trv = _b[1];
            var _c = getAbsoluteValueForTuple(styles.borderBottomRightRadius, bounds.width, bounds.height), brh = _c[0], brv = _c[1];
            var _d = getAbsoluteValueForTuple(styles.borderBottomLeftRadius, bounds.width, bounds.height), blh = _d[0], blv = _d[1];
            var factors = [];
            factors.push((tlh + trh) / bounds.width);
            factors.push((blh + brh) / bounds.width);
            factors.push((tlv + blv) / bounds.height);
            factors.push((trv + brv) / bounds.height);
            var maxFactor = Math.max.apply(Math, factors);
            if (maxFactor > 1) {
                tlh /= maxFactor;
                tlv /= maxFactor;
                trh /= maxFactor;
                trv /= maxFactor;
                brh /= maxFactor;
                brv /= maxFactor;
                blh /= maxFactor;
                blv /= maxFactor;
            }
            var topWidth = bounds.width - trh;
            var rightHeight = bounds.height - brv;
            var bottomWidth = bounds.width - brh;
            var leftHeight = bounds.height - blv;
            var borderTopWidth = styles.borderTopWidth;
            var borderRightWidth = styles.borderRightWidth;
            var borderBottomWidth = styles.borderBottomWidth;
            var borderLeftWidth = styles.borderLeftWidth;
            var paddingTop = getAbsoluteValue(styles.paddingTop, element.bounds.width);
            var paddingRight = getAbsoluteValue(styles.paddingRight, element.bounds.width);
            var paddingBottom = getAbsoluteValue(styles.paddingBottom, element.bounds.width);
            var paddingLeft = getAbsoluteValue(styles.paddingLeft, element.bounds.width);
            this.topLeftBorderBox =
                tlh > 0 || tlv > 0
                    ? getCurvePoints(bounds.left, bounds.top, tlh, tlv, CORNER.TOP_LEFT)
                    : new Vector(bounds.left, bounds.top);
            this.topRightBorderBox =
                trh > 0 || trv > 0
                    ? getCurvePoints(bounds.left + topWidth, bounds.top, trh, trv, CORNER.TOP_RIGHT)
                    : new Vector(bounds.left + bounds.width, bounds.top);
            this.bottomRightBorderBox =
                brh > 0 || brv > 0
                    ? getCurvePoints(bounds.left + bottomWidth, bounds.top + rightHeight, brh, brv, CORNER.BOTTOM_RIGHT)
                    : new Vector(bounds.left + bounds.width, bounds.top + bounds.height);
            this.bottomLeftBorderBox =
                blh > 0 || blv > 0
                    ? getCurvePoints(bounds.left, bounds.top + leftHeight, blh, blv, CORNER.BOTTOM_LEFT)
                    : new Vector(bounds.left, bounds.top + bounds.height);
            this.topLeftPaddingBox =
                tlh > 0 || tlv > 0
                    ? getCurvePoints(bounds.left + borderLeftWidth, bounds.top + borderTopWidth, Math.max(0, tlh - borderLeftWidth), Math.max(0, tlv - borderTopWidth), CORNER.TOP_LEFT)
                    : new Vector(bounds.left + borderLeftWidth, bounds.top + borderTopWidth);
            this.topRightPaddingBox =
                trh > 0 || trv > 0
                    ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borderLeftWidth), bounds.top + borderTopWidth, topWidth > bounds.width + borderLeftWidth ? 0 : trh - borderLeftWidth, trv - borderTopWidth, CORNER.TOP_RIGHT)
                    : new Vector(bounds.left + bounds.width - borderRightWidth, bounds.top + borderTopWidth);
            this.bottomRightPaddingBox =
                brh > 0 || brv > 0
                    ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - borderLeftWidth), bounds.top + Math.min(rightHeight, bounds.height + borderTopWidth), Math.max(0, brh - borderRightWidth), brv - borderBottomWidth, CORNER.BOTTOM_RIGHT)
                    : new Vector(bounds.left + bounds.width - borderRightWidth, bounds.top + bounds.height - borderBottomWidth);
            this.bottomLeftPaddingBox =
                blh > 0 || blv > 0
                    ? getCurvePoints(bounds.left + borderLeftWidth, bounds.top + leftHeight, Math.max(0, blh - borderLeftWidth), blv - borderBottomWidth, CORNER.BOTTOM_LEFT)
                    : new Vector(bounds.left + borderLeftWidth, bounds.top + bounds.height - borderBottomWidth);
            this.topLeftContentBox =
                tlh > 0 || tlv > 0
                    ? getCurvePoints(bounds.left + borderLeftWidth + paddingLeft, bounds.top + borderTopWidth + paddingTop, Math.max(0, tlh - (borderLeftWidth + paddingLeft)), Math.max(0, tlv - (borderTopWidth + paddingTop)), CORNER.TOP_LEFT)
                    : new Vector(bounds.left + borderLeftWidth + paddingLeft, bounds.top + borderTopWidth + paddingTop);
            this.topRightContentBox =
                trh > 0 || trv > 0
                    ? getCurvePoints(bounds.left + Math.min(topWidth, bounds.width + borderLeftWidth + paddingLeft), bounds.top + borderTopWidth + paddingTop, topWidth > bounds.width + borderLeftWidth + paddingLeft ? 0 : trh - borderLeftWidth + paddingLeft, trv - (borderTopWidth + paddingTop), CORNER.TOP_RIGHT)
                    : new Vector(bounds.left + bounds.width - (borderRightWidth + paddingRight), bounds.top + borderTopWidth + paddingTop);
            this.bottomRightContentBox =
                brh > 0 || brv > 0
                    ? getCurvePoints(bounds.left + Math.min(bottomWidth, bounds.width - (borderLeftWidth + paddingLeft)), bounds.top + Math.min(rightHeight, bounds.height + borderTopWidth + paddingTop), Math.max(0, brh - (borderRightWidth + paddingRight)), brv - (borderBottomWidth + paddingBottom), CORNER.BOTTOM_RIGHT)
                    : new Vector(bounds.left + bounds.width - (borderRightWidth + paddingRight), bounds.top + bounds.height - (borderBottomWidth + paddingBottom));
            this.bottomLeftContentBox =
                blh > 0 || blv > 0
                    ? getCurvePoints(bounds.left + borderLeftWidth + paddingLeft, bounds.top + leftHeight, Math.max(0, blh - (borderLeftWidth + paddingLeft)), blv - (borderBottomWidth + paddingBottom), CORNER.BOTTOM_LEFT)
                    : new Vector(bounds.left + borderLeftWidth + paddingLeft, bounds.top + bounds.height - (borderBottomWidth + paddingBottom));
        }
        return BoundCurves;
    }());
    var CORNER;
    (function (CORNER) {
        CORNER[CORNER["TOP_LEFT"] = 0] = "TOP_LEFT";
        CORNER[CORNER["TOP_RIGHT"] = 1] = "TOP_RIGHT";
        CORNER[CORNER["BOTTOM_RIGHT"] = 2] = "BOTTOM_RIGHT";
        CORNER[CORNER["BOTTOM_LEFT"] = 3] = "BOTTOM_LEFT";
    })(CORNER || (CORNER = {}));
    var getCurvePoints = function (x, y, r1, r2, position) {
        var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
        var ox = r1 * kappa; // control point offset horizontal
        var oy = r2 * kappa; // control point offset vertical
        var xm = x + r1; // x-middle
        var ym = y + r2; // y-middle
        switch (position) {
            case CORNER.TOP_LEFT:
                return new BezierCurve(new Vector(x, ym), new Vector(x, ym - oy), new Vector(xm - ox, y), new Vector(xm, y));
            case CORNER.TOP_RIGHT:
                return new BezierCurve(new Vector(x, y), new Vector(x + ox, y), new Vector(xm, ym - oy), new Vector(xm, ym));
            case CORNER.BOTTOM_RIGHT:
                return new BezierCurve(new Vector(xm, y), new Vector(xm, y + oy), new Vector(x + ox, ym), new Vector(x, ym));
            case CORNER.BOTTOM_LEFT:
            default:
                return new BezierCurve(new Vector(xm, ym), new Vector(xm - ox, ym), new Vector(x, y + oy), new Vector(x, y));
        }
    };
    var calculateBorderBoxPath = function (curves) {
        return [curves.topLeftBorderBox, curves.topRightBorderBox, curves.bottomRightBorderBox, curves.bottomLeftBorderBox];
    };
    var calculateContentBoxPath = function (curves) {
        return [
            curves.topLeftContentBox,
            curves.topRightContentBox,
            curves.bottomRightContentBox,
            curves.bottomLeftContentBox
        ];
    };
    var calculatePaddingBoxPath = function (curves) {
        return [
            curves.topLeftPaddingBox,
            curves.topRightPaddingBox,
            curves.bottomRightPaddingBox,
            curves.bottomLeftPaddingBox
        ];
    };

    var TransformEffect = /** @class */ (function () {
        function TransformEffect(offsetX, offsetY, matrix) {
            this.type = 0 /* TRANSFORM */;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.matrix = matrix;
            this.target = 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */;
        }
        return TransformEffect;
    }());
    var ClipEffect = /** @class */ (function () {
        function ClipEffect(path, target) {
            this.type = 1 /* CLIP */;
            this.target = target;
            this.path = path;
        }
        return ClipEffect;
    }());
    var isTransformEffect = function (effect) {
        return effect.type === 0 /* TRANSFORM */;
    };
    var isClipEffect = function (effect) { return effect.type === 1 /* CLIP */; };

    var StackingContext = /** @class */ (function () {
        function StackingContext(container) {
            this.element = container;
            this.inlineLevel = [];
            this.nonInlineLevel = [];
            this.negativeZIndex = [];
            this.zeroOrAutoZIndexOrTransformedOrOpacity = [];
            this.positiveZIndex = [];
            this.nonPositionedFloats = [];
            this.nonPositionedInlineLevel = [];
        }
        return StackingContext;
    }());
    var ElementPaint = /** @class */ (function () {
        function ElementPaint(element, parentStack) {
            this.container = element;
            this.effects = parentStack.slice(0);
            this.curves = new BoundCurves(element);
            if (element.styles.transform !== null) {
                var offsetX = element.bounds.left + element.styles.transformOrigin[0].number;
                var offsetY = element.bounds.top + element.styles.transformOrigin[1].number;
                var matrix = element.styles.transform;
                this.effects.push(new TransformEffect(offsetX, offsetY, matrix));
            }
            if (element.styles.overflowX !== OVERFLOW.VISIBLE) {
                var borderBox = calculateBorderBoxPath(this.curves);
                var paddingBox = calculatePaddingBoxPath(this.curves);
                if (equalPath(borderBox, paddingBox)) {
                    this.effects.push(new ClipEffect(borderBox, 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */));
                }
                else {
                    this.effects.push(new ClipEffect(borderBox, 2 /* BACKGROUND_BORDERS */));
                    this.effects.push(new ClipEffect(paddingBox, 4 /* CONTENT */));
                }
            }
        }
        ElementPaint.prototype.getParentEffects = function () {
            var effects = this.effects.slice(0);
            if (this.container.styles.overflowX !== OVERFLOW.VISIBLE) {
                var borderBox = calculateBorderBoxPath(this.curves);
                var paddingBox = calculatePaddingBoxPath(this.curves);
                if (!equalPath(borderBox, paddingBox)) {
                    effects.push(new ClipEffect(paddingBox, 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */));
                }
            }
            return effects;
        };
        return ElementPaint;
    }());
    var parseStackTree = function (parent, stackingContext, realStackingContext, listItems) {
        parent.container.elements.forEach(function (child) {
            var treatAsRealStackingContext = contains(child.flags, 4 /* CREATES_REAL_STACKING_CONTEXT */);
            var createsStackingContext = contains(child.flags, 2 /* CREATES_STACKING_CONTEXT */);
            var paintContainer = new ElementPaint(child, parent.getParentEffects());
            if (contains(child.styles.display, 2048 /* LIST_ITEM */)) {
                listItems.push(paintContainer);
            }
            var listOwnerItems = contains(child.flags, 8 /* IS_LIST_OWNER */) ? [] : listItems;
            if (treatAsRealStackingContext || createsStackingContext) {
                var parentStack = treatAsRealStackingContext || child.styles.isPositioned() ? realStackingContext : stackingContext;
                var stack = new StackingContext(paintContainer);
                if (child.styles.isPositioned() || child.styles.opacity < 1 || child.styles.isTransformed()) {
                    var order_1 = child.styles.zIndex.order;
                    if (order_1 < 0) {
                        var index_1 = 0;
                        parentStack.negativeZIndex.some(function (current, i) {
                            if (order_1 > current.element.container.styles.zIndex.order) {
                                index_1 = i;
                                return false;
                            }
                            else if (index_1 > 0) {
                                return true;
                            }
                            return false;
                        });
                        parentStack.negativeZIndex.splice(index_1, 0, stack);
                    }
                    else if (order_1 > 0) {
                        var index_2 = 0;
                        parentStack.positiveZIndex.some(function (current, i) {
                            if (order_1 > current.element.container.styles.zIndex.order) {
                                index_2 = i + 1;
                                return false;
                            }
                            else if (index_2 > 0) {
                                return true;
                            }
                            return false;
                        });
                        parentStack.positiveZIndex.splice(index_2, 0, stack);
                    }
                    else {
                        parentStack.zeroOrAutoZIndexOrTransformedOrOpacity.push(stack);
                    }
                }
                else {
                    if (child.styles.isFloating()) {
                        parentStack.nonPositionedFloats.push(stack);
                    }
                    else {
                        parentStack.nonPositionedInlineLevel.push(stack);
                    }
                }
                parseStackTree(paintContainer, stack, treatAsRealStackingContext ? stack : realStackingContext, listOwnerItems);
            }
            else {
                if (child.styles.isInlineLevel()) {
                    stackingContext.inlineLevel.push(paintContainer);
                }
                else {
                    stackingContext.nonInlineLevel.push(paintContainer);
                }
                parseStackTree(paintContainer, stackingContext, realStackingContext, listOwnerItems);
            }
            if (contains(child.flags, 8 /* IS_LIST_OWNER */)) {
                processListItems(child, listOwnerItems);
            }
        });
    };
    var processListItems = function (owner, elements) {
        var numbering = owner instanceof OLElementContainer ? owner.start : 1;
        var reversed = owner instanceof OLElementContainer ? owner.reversed : false;
        for (var i = 0; i < elements.length; i++) {
            var item = elements[i];
            if (item.container instanceof LIElementContainer &&
                typeof item.container.value === 'number' &&
                item.container.value !== 0) {
                numbering = item.container.value;
            }
            item.listValue = createCounterText(numbering, item.container.styles.listStyleType, true);
            numbering += reversed ? -1 : 1;
        }
    };
    var parseStackingContexts = function (container) {
        var paintContainer = new ElementPaint(container, []);
        var root = new StackingContext(paintContainer);
        var listItems = [];
        parseStackTree(paintContainer, root, root, listItems);
        processListItems(paintContainer.container, listItems);
        return root;
    };

    var parsePathForBorder = function (curves, borderSide) {
        switch (borderSide) {
            case 0:
                return createPathFromCurves(curves.topLeftBorderBox, curves.topLeftPaddingBox, curves.topRightBorderBox, curves.topRightPaddingBox);
            case 1:
                return createPathFromCurves(curves.topRightBorderBox, curves.topRightPaddingBox, curves.bottomRightBorderBox, curves.bottomRightPaddingBox);
            case 2:
                return createPathFromCurves(curves.bottomRightBorderBox, curves.bottomRightPaddingBox, curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox);
            case 3:
            default:
                return createPathFromCurves(curves.bottomLeftBorderBox, curves.bottomLeftPaddingBox, curves.topLeftBorderBox, curves.topLeftPaddingBox);
        }
    };
    var createPathFromCurves = function (outer1, inner1, outer2, inner2) {
        var path = [];
        if (isBezierCurve(outer1)) {
            path.push(outer1.subdivide(0.5, false));
        }
        else {
            path.push(outer1);
        }
        if (isBezierCurve(outer2)) {
            path.push(outer2.subdivide(0.5, true));
        }
        else {
            path.push(outer2);
        }
        if (isBezierCurve(inner2)) {
            path.push(inner2.subdivide(0.5, true).reverse());
        }
        else {
            path.push(inner2);
        }
        if (isBezierCurve(inner1)) {
            path.push(inner1.subdivide(0.5, false).reverse());
        }
        else {
            path.push(inner1);
        }
        return path;
    };

    var paddingBox = function (element) {
        var bounds = element.bounds;
        var styles = element.styles;
        return bounds.add(styles.borderLeftWidth, styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth), -(styles.borderTopWidth + styles.borderBottomWidth));
    };
    var contentBox = function (element) {
        var styles = element.styles;
        var bounds = element.bounds;
        var paddingLeft = getAbsoluteValue(styles.paddingLeft, bounds.width);
        var paddingRight = getAbsoluteValue(styles.paddingRight, bounds.width);
        var paddingTop = getAbsoluteValue(styles.paddingTop, bounds.width);
        var paddingBottom = getAbsoluteValue(styles.paddingBottom, bounds.width);
        return bounds.add(paddingLeft + styles.borderLeftWidth, paddingTop + styles.borderTopWidth, -(styles.borderRightWidth + styles.borderLeftWidth + paddingLeft + paddingRight), -(styles.borderTopWidth + styles.borderBottomWidth + paddingTop + paddingBottom));
    };

    var calculateBackgroundPositioningArea = function (backgroundOrigin, element) {
        if (backgroundOrigin === 0 /* BORDER_BOX */) {
            return element.bounds;
        }
        if (backgroundOrigin === 2 /* CONTENT_BOX */) {
            return contentBox(element);
        }
        return paddingBox(element);
    };
    var calculateBackgroundPaintingArea = function (backgroundClip, element) {
        if (backgroundClip === BACKGROUND_CLIP.BORDER_BOX) {
            return element.bounds;
        }
        if (backgroundClip === BACKGROUND_CLIP.CONTENT_BOX) {
            return contentBox(element);
        }
        return paddingBox(element);
    };
    var calculateBackgroundRendering = function (container, index, intrinsicSize) {
        var backgroundPositioningArea = calculateBackgroundPositioningArea(getBackgroundValueForIndex(container.styles.backgroundOrigin, index), container);
        var backgroundPaintingArea = calculateBackgroundPaintingArea(getBackgroundValueForIndex(container.styles.backgroundClip, index), container);
        var backgroundImageSize = calculateBackgroundSize(getBackgroundValueForIndex(container.styles.backgroundSize, index), intrinsicSize, backgroundPositioningArea);
        var sizeWidth = backgroundImageSize[0], sizeHeight = backgroundImageSize[1];
        var position = getAbsoluteValueForTuple(getBackgroundValueForIndex(container.styles.backgroundPosition, index), backgroundPositioningArea.width - sizeWidth, backgroundPositioningArea.height - sizeHeight);
        var path = calculateBackgroundRepeatPath(getBackgroundValueForIndex(container.styles.backgroundRepeat, index), position, backgroundImageSize, backgroundPositioningArea, backgroundPaintingArea);
        var offsetX = Math.round(backgroundPositioningArea.left + position[0]);
        var offsetY = Math.round(backgroundPositioningArea.top + position[1]);
        return [path, offsetX, offsetY, sizeWidth, sizeHeight];
    };
    var isAuto = function (token) { return isIdentToken(token) && token.value === BACKGROUND_SIZE.AUTO; };
    var hasIntrinsicValue = function (value) { return typeof value === 'number'; };
    var calculateBackgroundSize = function (size, _a, bounds) {
        var intrinsicWidth = _a[0], intrinsicHeight = _a[1], intrinsicProportion = _a[2];
        var first = size[0], second = size[1];
        if (isLengthPercentage(first) && second && isLengthPercentage(second)) {
            return [getAbsoluteValue(first, bounds.width), getAbsoluteValue(second, bounds.height)];
        }
        var hasIntrinsicProportion = hasIntrinsicValue(intrinsicProportion);
        if (isIdentToken(first) && (first.value === BACKGROUND_SIZE.CONTAIN || first.value === BACKGROUND_SIZE.COVER)) {
            if (hasIntrinsicValue(intrinsicProportion)) {
                var targetRatio = bounds.width / bounds.height;
                return targetRatio < intrinsicProportion !== (first.value === BACKGROUND_SIZE.COVER)
                    ? [bounds.width, bounds.width / intrinsicProportion]
                    : [bounds.height * intrinsicProportion, bounds.height];
            }
            return [bounds.width, bounds.height];
        }
        var hasIntrinsicWidth = hasIntrinsicValue(intrinsicWidth);
        var hasIntrinsicHeight = hasIntrinsicValue(intrinsicHeight);
        var hasIntrinsicDimensions = hasIntrinsicWidth || hasIntrinsicHeight;
        // If the background-size is auto or auto auto:
        if (isAuto(first) && (!second || isAuto(second))) {
            // If the image has both horizontal and vertical intrinsic dimensions, it's rendered at that size.
            if (hasIntrinsicWidth && hasIntrinsicHeight) {
                return [intrinsicWidth, intrinsicHeight];
            }
            // If the image has no intrinsic dimensions and has no intrinsic proportions,
            // it's rendered at the size of the background positioning area.
            if (!hasIntrinsicProportion && !hasIntrinsicDimensions) {
                return [bounds.width, bounds.height];
            }
            // TODO If the image has no intrinsic dimensions but has intrinsic proportions, it's rendered as if contain had been specified instead.
            // If the image has only one intrinsic dimension and has intrinsic proportions, it's rendered at the size corresponding to that one dimension.
            // The other dimension is computed using the specified dimension and the intrinsic proportions.
            if (hasIntrinsicDimensions && hasIntrinsicProportion) {
                var width_1 = hasIntrinsicWidth
                    ? intrinsicWidth
                    : intrinsicHeight * intrinsicProportion;
                var height_1 = hasIntrinsicHeight
                    ? intrinsicHeight
                    : intrinsicWidth / intrinsicProportion;
                return [width_1, height_1];
            }
            // If the image has only one intrinsic dimension but has no intrinsic proportions,
            // it's rendered using the specified dimension and the other dimension of the background positioning area.
            var width_2 = hasIntrinsicWidth ? intrinsicWidth : bounds.width;
            var height_2 = hasIntrinsicHeight ? intrinsicHeight : bounds.height;
            return [width_2, height_2];
        }
        // If the image has intrinsic proportions, it's stretched to the specified dimension.
        // The unspecified dimension is computed using the specified dimension and the intrinsic proportions.
        if (hasIntrinsicProportion) {
            var width_3 = 0;
            var height_3 = 0;
            if (isLengthPercentage(first)) {
                width_3 = getAbsoluteValue(first, bounds.width);
            }
            else if (isLengthPercentage(second)) {
                height_3 = getAbsoluteValue(second, bounds.height);
            }
            if (isAuto(first)) {
                width_3 = height_3 * intrinsicProportion;
            }
            else if (!second || isAuto(second)) {
                height_3 = width_3 / intrinsicProportion;
            }
            return [width_3, height_3];
        }
        // If the image has no intrinsic proportions, it's stretched to the specified dimension.
        // The unspecified dimension is computed using the image's corresponding intrinsic dimension,
        // if there is one. If there is no such intrinsic dimension,
        // it becomes the corresponding dimension of the background positioning area.
        var width = null;
        var height = null;
        if (isLengthPercentage(first)) {
            width = getAbsoluteValue(first, bounds.width);
        }
        else if (second && isLengthPercentage(second)) {
            height = getAbsoluteValue(second, bounds.height);
        }
        if (width !== null && (!second || isAuto(second))) {
            height =
                hasIntrinsicWidth && hasIntrinsicHeight
                    ? (width / intrinsicWidth) * intrinsicHeight
                    : bounds.height;
        }
        if (height !== null && isAuto(first)) {
            width =
                hasIntrinsicWidth && hasIntrinsicHeight
                    ? (height / intrinsicHeight) * intrinsicWidth
                    : bounds.width;
        }
        if (width !== null && height !== null) {
            return [width, height];
        }
        throw new Error("Unable to calculate background-size for element");
    };
    var getBackgroundValueForIndex = function (values, index) {
        var value = values[index];
        if (typeof value === 'undefined') {
            return values[0];
        }
        return value;
    };
    var calculateBackgroundRepeatPath = function (repeat, _a, _b, backgroundPositioningArea, backgroundPaintingArea) {
        var x = _a[0], y = _a[1];
        var width = _b[0], height = _b[1];
        switch (repeat) {
            case BACKGROUND_REPEAT.REPEAT_X:
                return [
                    new Vector(Math.round(backgroundPositioningArea.left), Math.round(backgroundPositioningArea.top + y)),
                    new Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(backgroundPositioningArea.top + y)),
                    new Vector(Math.round(backgroundPositioningArea.left + backgroundPositioningArea.width), Math.round(height + backgroundPositioningArea.top + y)),
                    new Vector(Math.round(backgroundPositioningArea.left), Math.round(height + backgroundPositioningArea.top + y))
                ];
            case BACKGROUND_REPEAT.REPEAT_Y:
                return [
                    new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top)),
                    new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top)),
                    new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top)),
                    new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.height + backgroundPositioningArea.top))
                ];
            case BACKGROUND_REPEAT.NO_REPEAT:
                return [
                    new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top + y)),
                    new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top + y)),
                    new Vector(Math.round(backgroundPositioningArea.left + x + width), Math.round(backgroundPositioningArea.top + y + height)),
                    new Vector(Math.round(backgroundPositioningArea.left + x), Math.round(backgroundPositioningArea.top + y + height))
                ];
            default:
                return [
                    new Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.top)),
                    new Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.top)),
                    new Vector(Math.round(backgroundPaintingArea.left + backgroundPaintingArea.width), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top)),
                    new Vector(Math.round(backgroundPaintingArea.left), Math.round(backgroundPaintingArea.height + backgroundPaintingArea.top))
                ];
        }
    };

    var SMALL_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    var SAMPLE_TEXT = 'Hidden Text';
    var FontMetrics = /** @class */ (function () {
        function FontMetrics(document) {
            this._data = {};
            this._document = document;
        }
        FontMetrics.prototype.parseMetrics = function (fontFamily, fontSize) {
            var container = this._document.createElement('div');
            var img = this._document.createElement('img');
            var span = this._document.createElement('span');
            var body = this._document.body;
            container.style.visibility = 'hidden';
            container.style.fontFamily = fontFamily;
            container.style.fontSize = fontSize;
            container.style.margin = '0';
            container.style.padding = '0';
            body.appendChild(container);
            img.src = SMALL_IMAGE;
            img.width = 1;
            img.height = 1;
            img.style.margin = '0';
            img.style.padding = '0';
            img.style.verticalAlign = 'baseline';
            span.style.fontFamily = fontFamily;
            span.style.fontSize = fontSize;
            span.style.margin = '0';
            span.style.padding = '0';
            span.appendChild(this._document.createTextNode(SAMPLE_TEXT));
            container.appendChild(span);
            container.appendChild(img);
            var baseline = img.offsetTop - span.offsetTop + 2;
            container.removeChild(span);
            container.appendChild(this._document.createTextNode(SAMPLE_TEXT));
            container.style.lineHeight = 'normal';
            img.style.verticalAlign = 'super';
            var middle = img.offsetTop - container.offsetTop + 2;
            body.removeChild(container);
            return { baseline: baseline, middle: middle };
        };
        FontMetrics.prototype.getMetrics = function (fontFamily, fontSize) {
            var key = fontFamily + " " + fontSize;
            if (typeof this._data[key] === 'undefined') {
                this._data[key] = this.parseMetrics(fontFamily, fontSize);
            }
            return this._data[key];
        };
        return FontMetrics;
    }());

    var MASK_OFFSET = 10000;
    var CanvasRenderer = /** @class */ (function () {
        function CanvasRenderer(options) {
            this._activeEffects = [];
            this.canvas = options.canvas ? options.canvas : document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.options = options;
            if (!options.canvas) {
                this.canvas.width = Math.floor(options.width * options.scale);
                this.canvas.height = Math.floor(options.height * options.scale);
                this.canvas.style.width = options.width + "px";
                this.canvas.style.height = options.height + "px";
            }
            this.fontMetrics = new FontMetrics(document);
            this.ctx.scale(this.options.scale, this.options.scale);
            this.ctx.translate(-options.x + options.scrollX, -options.y + options.scrollY);
            this.ctx.textBaseline = 'bottom';
            this._activeEffects = [];
            Logger.getInstance(options.id).debug("Canvas renderer initialized (" + options.width + "x" + options.height + " at " + options.x + "," + options.y + ") with scale " + options.scale);
        }
        CanvasRenderer.prototype.applyEffects = function (effects, target) {
            var _this = this;
            while (this._activeEffects.length) {
                this.popEffect();
            }
            effects.filter(function (effect) { return contains(effect.target, target); }).forEach(function (effect) { return _this.applyEffect(effect); });
        };
        CanvasRenderer.prototype.applyEffect = function (effect) {
            this.ctx.save();
            if (isTransformEffect(effect)) {
                this.ctx.translate(effect.offsetX, effect.offsetY);
                this.ctx.transform(effect.matrix[0], effect.matrix[1], effect.matrix[2], effect.matrix[3], effect.matrix[4], effect.matrix[5]);
                this.ctx.translate(-effect.offsetX, -effect.offsetY);
            }
            if (isClipEffect(effect)) {
                this.path(effect.path);
                this.ctx.clip();
            }
            this._activeEffects.push(effect);
        };
        CanvasRenderer.prototype.popEffect = function () {
            this._activeEffects.pop();
            this.ctx.restore();
        };
        CanvasRenderer.prototype.renderStack = function (stack) {
            return __awaiter(this, void 0, void 0, function () {
                var styles;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            styles = stack.element.container.styles;
                            if (!styles.isVisible()) return [3 /*break*/, 2];
                            this.ctx.globalAlpha = styles.opacity;
                            return [4 /*yield*/, this.renderStackContent(stack)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        CanvasRenderer.prototype.renderNode = function (paint) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!paint.container.styles.isVisible()) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.renderNodeBackgroundAndBorders(paint)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.renderNodeContent(paint)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        CanvasRenderer.prototype.renderTextWithLetterSpacing = function (text, letterSpacing) {
            var _this = this;
            if (letterSpacing === 0) {
                this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
            }
            else {
                var letters = toCodePoints(text.text).map(function (i) { return fromCodePoint(i); });
                letters.reduce(function (left, letter) {
                    _this.ctx.fillText(letter, left, text.bounds.top + text.bounds.height);
                    return left + _this.ctx.measureText(letter).width;
                }, text.bounds.left);
            }
        };
        CanvasRenderer.prototype.createFontStyle = function (styles) {
            var fontVariant = styles.fontVariant
                .filter(function (variant) { return variant === 'normal' || variant === 'small-caps'; })
                .join('');
            var fontFamily = styles.fontFamily.join(', ');
            var fontSize = isDimensionToken(styles.fontSize)
                ? "" + styles.fontSize.number + styles.fontSize.unit
                : styles.fontSize.number + "px";
            return [
                [styles.fontStyle, fontVariant, styles.fontWeight, fontSize, fontFamily].join(' '),
                fontFamily,
                fontSize
            ];
        };
        CanvasRenderer.prototype.renderTextNode = function (text, styles) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, font, fontFamily, fontSize;
                var _this = this;
                return __generator(this, function (_b) {
                    _a = this.createFontStyle(styles), font = _a[0], fontFamily = _a[1], fontSize = _a[2];
                    this.ctx.font = font;
                    text.textBounds.forEach(function (text) {
                        _this.ctx.fillStyle = asString(styles.color);
                        _this.renderTextWithLetterSpacing(text, styles.letterSpacing);
                        var textShadows = styles.textShadow;
                        if (textShadows.length && text.text.trim().length) {
                            textShadows
                                .slice(0)
                                .reverse()
                                .forEach(function (textShadow) {
                                _this.ctx.shadowColor = asString(textShadow.color);
                                _this.ctx.shadowOffsetX = textShadow.offsetX.number * _this.options.scale;
                                _this.ctx.shadowOffsetY = textShadow.offsetY.number * _this.options.scale;
                                _this.ctx.shadowBlur = textShadow.blur.number;
                                _this.ctx.fillText(text.text, text.bounds.left, text.bounds.top + text.bounds.height);
                            });
                            _this.ctx.shadowColor = '';
                            _this.ctx.shadowOffsetX = 0;
                            _this.ctx.shadowOffsetY = 0;
                            _this.ctx.shadowBlur = 0;
                        }
                        if (styles.textDecorationLine.length) {
                            _this.ctx.fillStyle = asString(styles.textDecorationColor || styles.color);
                            styles.textDecorationLine.forEach(function (textDecorationLine) {
                                switch (textDecorationLine) {
                                    case 1 /* UNDERLINE */:
                                        // Draws a line at the baseline of the font
                                        // TODO As some browsers display the line as more than 1px if the font-size is big,
                                        // need to take that into account both in position and size
                                        var baseline = _this.fontMetrics.getMetrics(fontFamily, fontSize).baseline;
                                        _this.ctx.fillRect(text.bounds.left, Math.round(text.bounds.top + baseline), text.bounds.width, 1);
                                        break;
                                    case 2 /* OVERLINE */:
                                        _this.ctx.fillRect(text.bounds.left, Math.round(text.bounds.top), text.bounds.width, 1);
                                        break;
                                    case 3 /* LINE_THROUGH */:
                                        // TODO try and find exact position for line-through
                                        var middle = _this.fontMetrics.getMetrics(fontFamily, fontSize).middle;
                                        _this.ctx.fillRect(text.bounds.left, Math.ceil(text.bounds.top + middle), text.bounds.width, 1);
                                        break;
                                }
                            });
                        }
                    });
                    return [2 /*return*/];
                });
            });
        };
        CanvasRenderer.prototype.renderReplacedElement = function (container, curves, image) {
            if (image && container.intrinsicWidth > 0 && container.intrinsicHeight > 0) {
                var box = contentBox(container);
                var path = calculatePaddingBoxPath(curves);
                this.path(path);
                this.ctx.save();
                this.ctx.clip();
                this.ctx.drawImage(image, 0, 0, container.intrinsicWidth, container.intrinsicHeight, box.left, box.top, box.width, box.height);
                this.ctx.restore();
            }
        };
        CanvasRenderer.prototype.renderNodeContent = function (paint) {
            return __awaiter(this, void 0, void 0, function () {
                var container, curves, styles, _i, _a, child, image, e_1, image, e_2, iframeRenderer, canvas, size, bounds, x, textBounds, img, image, url, e_3, bounds;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.applyEffects(paint.effects, 4 /* CONTENT */);
                            container = paint.container;
                            curves = paint.curves;
                            styles = container.styles;
                            _i = 0, _a = container.textNodes;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            child = _a[_i];
                            return [4 /*yield*/, this.renderTextNode(child, styles)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            if (!(container instanceof ImageElementContainer)) return [3 /*break*/, 8];
                            _b.label = 5;
                        case 5:
                            _b.trys.push([5, 7, , 8]);
                            return [4 /*yield*/, this.options.cache.match(container.src)];
                        case 6:
                            image = _b.sent();
                            this.renderReplacedElement(container, curves, image);
                            return [3 /*break*/, 8];
                        case 7:
                            e_1 = _b.sent();
                            Logger.getInstance(this.options.id).error("Error loading image " + container.src);
                            return [3 /*break*/, 8];
                        case 8:
                            if (container instanceof CanvasElementContainer) {
                                this.renderReplacedElement(container, curves, container.canvas);
                            }
                            if (!(container instanceof SVGElementContainer)) return [3 /*break*/, 12];
                            _b.label = 9;
                        case 9:
                            _b.trys.push([9, 11, , 12]);
                            return [4 /*yield*/, this.options.cache.match(container.svg)];
                        case 10:
                            image = _b.sent();
                            this.renderReplacedElement(container, curves, image);
                            return [3 /*break*/, 12];
                        case 11:
                            e_2 = _b.sent();
                            Logger.getInstance(this.options.id).error("Error loading svg " + container.svg.substring(0, 255));
                            return [3 /*break*/, 12];
                        case 12:
                            if (!(container instanceof IFrameElementContainer && container.tree)) return [3 /*break*/, 14];
                            iframeRenderer = new CanvasRenderer({
                                id: this.options.id,
                                scale: this.options.scale,
                                backgroundColor: container.backgroundColor,
                                x: 0,
                                y: 0,
                                scrollX: 0,
                                scrollY: 0,
                                width: container.width,
                                height: container.height,
                                cache: this.options.cache,
                                windowWidth: container.width,
                                windowHeight: container.height
                            });
                            return [4 /*yield*/, iframeRenderer.render(container.tree)];
                        case 13:
                            canvas = _b.sent();
                            if (container.width && container.height) {
                                this.ctx.drawImage(canvas, 0, 0, container.width, container.height, container.bounds.left, container.bounds.top, container.bounds.width, container.bounds.height);
                            }
                            _b.label = 14;
                        case 14:
                            if (container instanceof InputElementContainer) {
                                size = Math.min(container.bounds.width, container.bounds.height);
                                if (container.type === CHECKBOX) {
                                    if (container.checked) {
                                        this.ctx.save();
                                        this.path([
                                            new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79),
                                            new Vector(container.bounds.left + size * 0.16, container.bounds.top + size * 0.5549),
                                            new Vector(container.bounds.left + size * 0.27347, container.bounds.top + size * 0.44071),
                                            new Vector(container.bounds.left + size * 0.39694, container.bounds.top + size * 0.5649),
                                            new Vector(container.bounds.left + size * 0.72983, container.bounds.top + size * 0.23),
                                            new Vector(container.bounds.left + size * 0.84, container.bounds.top + size * 0.34085),
                                            new Vector(container.bounds.left + size * 0.39363, container.bounds.top + size * 0.79)
                                        ]);
                                        this.ctx.fillStyle = asString(INPUT_COLOR);
                                        this.ctx.fill();
                                        this.ctx.restore();
                                    }
                                }
                                else if (container.type === RADIO) {
                                    if (container.checked) {
                                        this.ctx.save();
                                        this.ctx.beginPath();
                                        this.ctx.arc(container.bounds.left + size / 2, container.bounds.top + size / 2, size / 4, 0, Math.PI * 2, true);
                                        this.ctx.fillStyle = asString(INPUT_COLOR);
                                        this.ctx.fill();
                                        this.ctx.restore();
                                    }
                                }
                            }
                            if (isTextInputElement(container) && container.value.length) {
                                this.ctx.font = this.createFontStyle(styles)[0];
                                this.ctx.fillStyle = asString(styles.color);
                                this.ctx.textBaseline = 'middle';
                                this.ctx.textAlign = canvasTextAlign(container.styles.textAlign);
                                bounds = contentBox(container);
                                x = 0;
                                switch (container.styles.textAlign) {
                                    case TEXT_ALIGN.CENTER:
                                        x += bounds.width / 2;
                                        break;
                                    case TEXT_ALIGN.RIGHT:
                                        x += bounds.width;
                                        break;
                                }
                                textBounds = bounds.add(x, 0, 0, -bounds.height / 2 + 1);
                                this.ctx.save();
                                this.path([
                                    new Vector(bounds.left, bounds.top),
                                    new Vector(bounds.left + bounds.width, bounds.top),
                                    new Vector(bounds.left + bounds.width, bounds.top + bounds.height),
                                    new Vector(bounds.left, bounds.top + bounds.height)
                                ]);
                                this.ctx.clip();
                                this.renderTextWithLetterSpacing(new TextBounds(container.value, textBounds), styles.letterSpacing);
                                this.ctx.restore();
                                this.ctx.textBaseline = 'bottom';
                                this.ctx.textAlign = 'left';
                            }
                            if (!contains(container.styles.display, 2048 /* LIST_ITEM */)) return [3 /*break*/, 20];
                            if (!(container.styles.listStyleImage !== null)) return [3 /*break*/, 19];
                            img = container.styles.listStyleImage;
                            if (!(img.type === CSSImageType.URL)) return [3 /*break*/, 18];
                            image = void 0;
                            url = img.url;
                            _b.label = 15;
                        case 15:
                            _b.trys.push([15, 17, , 18]);
                            return [4 /*yield*/, this.options.cache.match(url)];
                        case 16:
                            image = _b.sent();
                            this.ctx.drawImage(image, container.bounds.left - (image.width + 10), container.bounds.top);
                            return [3 /*break*/, 18];
                        case 17:
                            e_3 = _b.sent();
                            Logger.getInstance(this.options.id).error("Error loading list-style-image " + url);
                            return [3 /*break*/, 18];
                        case 18: return [3 /*break*/, 20];
                        case 19:
                            if (paint.listValue && container.styles.listStyleType !== LIST_STYLE_TYPE.NONE) {
                                this.ctx.font = this.createFontStyle(styles)[0];
                                this.ctx.fillStyle = asString(styles.color);
                                this.ctx.textBaseline = 'middle';
                                this.ctx.textAlign = 'right';
                                bounds = new Bounds(container.bounds.left, container.bounds.top + getAbsoluteValue(container.styles.paddingTop, container.bounds.width), container.bounds.width, computeLineHeight(styles.lineHeight, styles.fontSize.number) / 2 + 1);
                                this.renderTextWithLetterSpacing(new TextBounds(paint.listValue, bounds), styles.letterSpacing);
                                this.ctx.textBaseline = 'bottom';
                                this.ctx.textAlign = 'left';
                            }
                            _b.label = 20;
                        case 20: return [2 /*return*/];
                    }
                });
            });
        };
        CanvasRenderer.prototype.renderStackContent = function (stack) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, child, _b, _c, child, _d, _e, child, _f, _g, child, _h, _j, child, _k, _l, child, _m, _o, child;
                return __generator(this, function (_p) {
                    switch (_p.label) {
                        case 0:
                        // https://www.w3.org/TR/css-position-3/#painting-order
                        // 1. the background and borders of the element forming the stacking context.
                        return [4 /*yield*/, this.renderNodeBackgroundAndBorders(stack.element)];
                        case 1:
                            // https://www.w3.org/TR/css-position-3/#painting-order
                            // 1. the background and borders of the element forming the stacking context.
                            _p.sent();
                            _i = 0, _a = stack.negativeZIndex;
                            _p.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            child = _a[_i];
                            return [4 /*yield*/, this.renderStack(child)];
                        case 3:
                            _p.sent();
                            _p.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5:
                        // 3. For all its in-flow, non-positioned, block-level descendants in tree order:
                        return [4 /*yield*/, this.renderNodeContent(stack.element)];
                        case 6:
                            // 3. For all its in-flow, non-positioned, block-level descendants in tree order:
                            _p.sent();
                            _b = 0, _c = stack.nonInlineLevel;
                            _p.label = 7;
                        case 7:
                            if (!(_b < _c.length)) return [3 /*break*/, 10];
                            child = _c[_b];
                            return [4 /*yield*/, this.renderNode(child)];
                        case 8:
                            _p.sent();
                            _p.label = 9;
                        case 9:
                            _b++;
                            return [3 /*break*/, 7];
                        case 10:
                            _d = 0, _e = stack.nonPositionedFloats;
                            _p.label = 11;
                        case 11:
                            if (!(_d < _e.length)) return [3 /*break*/, 14];
                            child = _e[_d];
                            return [4 /*yield*/, this.renderStack(child)];
                        case 12:
                            _p.sent();
                            _p.label = 13;
                        case 13:
                            _d++;
                            return [3 /*break*/, 11];
                        case 14:
                            _f = 0, _g = stack.nonPositionedInlineLevel;
                            _p.label = 15;
                        case 15:
                            if (!(_f < _g.length)) return [3 /*break*/, 18];
                            child = _g[_f];
                            return [4 /*yield*/, this.renderStack(child)];
                        case 16:
                            _p.sent();
                            _p.label = 17;
                        case 17:
                            _f++;
                            return [3 /*break*/, 15];
                        case 18:
                            _h = 0, _j = stack.inlineLevel;
                            _p.label = 19;
                        case 19:
                            if (!(_h < _j.length)) return [3 /*break*/, 22];
                            child = _j[_h];
                            return [4 /*yield*/, this.renderNode(child)];
                        case 20:
                            _p.sent();
                            _p.label = 21;
                        case 21:
                            _h++;
                            return [3 /*break*/, 19];
                        case 22:
                            _k = 0, _l = stack.zeroOrAutoZIndexOrTransformedOrOpacity;
                            _p.label = 23;
                        case 23:
                            if (!(_k < _l.length)) return [3 /*break*/, 26];
                            child = _l[_k];
                            return [4 /*yield*/, this.renderStack(child)];
                        case 24:
                            _p.sent();
                            _p.label = 25;
                        case 25:
                            _k++;
                            return [3 /*break*/, 23];
                        case 26:
                            _m = 0, _o = stack.positiveZIndex;
                            _p.label = 27;
                        case 27:
                            if (!(_m < _o.length)) return [3 /*break*/, 30];
                            child = _o[_m];
                            return [4 /*yield*/, this.renderStack(child)];
                        case 28:
                            _p.sent();
                            _p.label = 29;
                        case 29:
                            _m++;
                            return [3 /*break*/, 27];
                        case 30: return [2 /*return*/];
                    }
                });
            });
        };
        CanvasRenderer.prototype.mask = function (paths) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(this.canvas.width, 0);
            this.ctx.lineTo(this.canvas.width, this.canvas.height);
            this.ctx.lineTo(0, this.canvas.height);
            this.ctx.lineTo(0, 0);
            this.formatPath(paths.slice(0).reverse());
            this.ctx.closePath();
        };
        CanvasRenderer.prototype.path = function (paths) {
            this.ctx.beginPath();
            this.formatPath(paths);
            this.ctx.closePath();
        };
        CanvasRenderer.prototype.formatPath = function (paths) {
            var _this = this;
            paths.forEach(function (point, index) {
                var start = isBezierCurve(point) ? point.start : point;
                if (index === 0) {
                    _this.ctx.moveTo(start.x, start.y);
                }
                else {
                    _this.ctx.lineTo(start.x, start.y);
                }
                if (isBezierCurve(point)) {
                    _this.ctx.bezierCurveTo(point.startControl.x, point.startControl.y, point.endControl.x, point.endControl.y, point.end.x, point.end.y);
                }
            });
        };
        CanvasRenderer.prototype.renderRepeat = function (path, pattern, offsetX, offsetY) {
            this.path(path);
            this.ctx.fillStyle = pattern;
            this.ctx.translate(offsetX, offsetY);
            this.ctx.fill();
            this.ctx.translate(-offsetX, -offsetY);
        };
        CanvasRenderer.prototype.resizeImage = function (image, width, height) {
            if (image.width === width && image.height === height) {
                return image;
            }
            var canvas = this.canvas.ownerDocument.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
            return canvas;
        };
        CanvasRenderer.prototype.renderBackgroundImage = function (container) {
            return __awaiter(this, void 0, void 0, function () {
                var index, _loop_1, this_1, _i, _a, backgroundImage;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            index = container.styles.backgroundImage.length - 1;
                            _loop_1 = function (backgroundImage) {
                                var image, url, e_4, _a, path, x, y, width, height, pattern, _b, path, x, y, width, height, _c, lineLength, x0, x1, y0, y1, canvas, ctx, gradient_1, pattern, _d, path, left, top_1, width, height, position, x, y, _e, rx, ry, radialGradient_1, midX, midY, f, invF;
                                return __generator(this, function (_f) {
                                    switch (_f.label) {
                                        case 0:
                                            if (!(backgroundImage.type === CSSImageType.URL)) return [3 /*break*/, 5];
                                            image = void 0;
                                            url = backgroundImage.url;
                                            _f.label = 1;
                                        case 1:
                                            _f.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this_1.options.cache.match(url)];
                                        case 2:
                                            image = _f.sent();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            e_4 = _f.sent();
                                            Logger.getInstance(this_1.options.id).error("Error loading background-image " + url);
                                            return [3 /*break*/, 4];
                                        case 4:
                                            if (image) {
                                                _a = calculateBackgroundRendering(container, index, [
                                                    image.width,
                                                    image.height,
                                                    image.width / image.height
                                                ]), path = _a[0], x = _a[1], y = _a[2], width = _a[3], height = _a[4];
                                                pattern = this_1.ctx.createPattern(this_1.resizeImage(image, width, height), 'repeat');
                                                this_1.renderRepeat(path, pattern, x, y);
                                            }
                                            return [3 /*break*/, 6];
                                        case 5:
                                            if (isLinearGradient(backgroundImage)) {
                                                _b = calculateBackgroundRendering(container, index, [null, null, null]), path = _b[0], x = _b[1], y = _b[2], width = _b[3], height = _b[4];
                                                _c = calculateGradientDirection(backgroundImage.angle, width, height), lineLength = _c[0], x0 = _c[1], x1 = _c[2], y0 = _c[3], y1 = _c[4];
                                                canvas = document.createElement('canvas');
                                                canvas.width = width;
                                                canvas.height = height;
                                                ctx = canvas.getContext('2d');
                                                gradient_1 = ctx.createLinearGradient(x0, y0, x1, y1);
                                                processColorStops(backgroundImage.stops, lineLength).forEach(function (colorStop) {
                                                    return gradient_1.addColorStop(colorStop.stop, asString(colorStop.color));
                                                });
                                                ctx.fillStyle = gradient_1;
                                                ctx.fillRect(0, 0, width, height);
                                                if (width > 0 && height > 0) {
                                                    pattern = this_1.ctx.createPattern(canvas, 'repeat');
                                                    this_1.renderRepeat(path, pattern, x, y);
                                                }
                                            }
                                            else if (isRadialGradient(backgroundImage)) {
                                                _d = calculateBackgroundRendering(container, index, [
                                                    null,
                                                    null,
                                                    null
                                                ]), path = _d[0], left = _d[1], top_1 = _d[2], width = _d[3], height = _d[4];
                                                position = backgroundImage.position.length === 0 ? [FIFTY_PERCENT] : backgroundImage.position;
                                                x = getAbsoluteValue(position[0], width);
                                                y = getAbsoluteValue(position[position.length - 1], height);
                                                _e = calculateRadius(backgroundImage, x, y, width, height), rx = _e[0], ry = _e[1];
                                                if (rx > 0 && rx > 0) {
                                                    radialGradient_1 = this_1.ctx.createRadialGradient(left + x, top_1 + y, 0, left + x, top_1 + y, rx);
                                                    processColorStops(backgroundImage.stops, rx * 2).forEach(function (colorStop) {
                                                        return radialGradient_1.addColorStop(colorStop.stop, asString(colorStop.color));
                                                    });
                                                    this_1.path(path);
                                                    this_1.ctx.fillStyle = radialGradient_1;
                                                    if (rx !== ry) {
                                                        midX = container.bounds.left + 0.5 * container.bounds.width;
                                                        midY = container.bounds.top + 0.5 * container.bounds.height;
                                                        f = ry / rx;
                                                        invF = 1 / f;
                                                        this_1.ctx.save();
                                                        this_1.ctx.translate(midX, midY);
                                                        this_1.ctx.transform(1, 0, 0, f, 0, 0);
                                                        this_1.ctx.translate(-midX, -midY);
                                                        this_1.ctx.fillRect(left, invF * (top_1 - midY) + midY, width, height * invF);
                                                        this_1.ctx.restore();
                                                    }
                                                    else {
                                                        this_1.ctx.fill();
                                                    }
                                                }
                                            }
                                            _f.label = 6;
                                        case 6:
                                            index--;
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, _a = container.styles.backgroundImage.slice(0).reverse();
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            backgroundImage = _a[_i];
                            return [5 /*yield**/, _loop_1(backgroundImage)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CanvasRenderer.prototype.renderBorder = function (color, side, curvePoints) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.path(parsePathForBorder(curvePoints, side));
                    this.ctx.fillStyle = asString(color);
                    this.ctx.fill();
                    return [2 /*return*/];
                });
            });
        };
        CanvasRenderer.prototype.renderNodeBackgroundAndBorders = function (paint) {
            return __awaiter(this, void 0, void 0, function () {
                var styles, hasBackground, borders, backgroundPaintingArea, side, _i, borders_1, border;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.applyEffects(paint.effects, 2 /* BACKGROUND_BORDERS */);
                            styles = paint.container.styles;
                            hasBackground = !isTransparent(styles.backgroundColor) || styles.backgroundImage.length;
                            borders = [
                                { style: styles.borderTopStyle, color: styles.borderTopColor },
                                { style: styles.borderRightStyle, color: styles.borderRightColor },
                                { style: styles.borderBottomStyle, color: styles.borderBottomColor },
                                { style: styles.borderLeftStyle, color: styles.borderLeftColor }
                            ];
                            backgroundPaintingArea = calculateBackgroundCurvedPaintingArea(getBackgroundValueForIndex(styles.backgroundClip, 0), paint.curves);
                            if (!(hasBackground || styles.boxShadow.length)) return [3 /*break*/, 2];
                            this.ctx.save();
                            this.path(backgroundPaintingArea);
                            this.ctx.clip();
                            if (!isTransparent(styles.backgroundColor)) {
                                this.ctx.fillStyle = asString(styles.backgroundColor);
                                this.ctx.fill();
                            }
                            return [4 /*yield*/, this.renderBackgroundImage(paint.container)];
                        case 1:
                            _a.sent();
                            this.ctx.restore();
                            styles.boxShadow
                                .slice(0)
                                .reverse()
                                .forEach(function (shadow) {
                                _this.ctx.save();
                                var borderBoxArea = calculateBorderBoxPath(paint.curves);
                                var maskOffset = shadow.inset ? 0 : MASK_OFFSET;
                                var shadowPaintingArea = transformPath(borderBoxArea, -maskOffset + (shadow.inset ? 1 : -1) * shadow.spread.number, (shadow.inset ? 1 : -1) * shadow.spread.number, shadow.spread.number * (shadow.inset ? -2 : 2), shadow.spread.number * (shadow.inset ? -2 : 2));
                                if (shadow.inset) {
                                    _this.path(borderBoxArea);
                                    _this.ctx.clip();
                                    _this.mask(shadowPaintingArea);
                                }
                                else {
                                    _this.mask(borderBoxArea);
                                    _this.ctx.clip();
                                    _this.path(shadowPaintingArea);
                                }
                                _this.ctx.shadowOffsetX = shadow.offsetX.number + maskOffset;
                                _this.ctx.shadowOffsetY = shadow.offsetY.number;
                                _this.ctx.shadowColor = asString(shadow.color);
                                _this.ctx.shadowBlur = shadow.blur.number;
                                _this.ctx.fillStyle = shadow.inset ? asString(shadow.color) : 'rgba(0,0,0,1)';
                                _this.ctx.fill();
                                _this.ctx.restore();
                            });
                            _a.label = 2;
                        case 2:
                            side = 0;
                            _i = 0, borders_1 = borders;
                            _a.label = 3;
                        case 3:
                            if (!(_i < borders_1.length)) return [3 /*break*/, 7];
                            border = borders_1[_i];
                            if (!(border.style !== BORDER_STYLE.NONE && !isTransparent(border.color))) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.renderBorder(border.color, side, paint.curves)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            side++;
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 3];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        CanvasRenderer.prototype.render = function (element) {
            return __awaiter(this, void 0, void 0, function () {
                var stack;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.options.backgroundColor) {
                                this.ctx.fillStyle = asString(this.options.backgroundColor);
                                this.ctx.fillRect(this.options.x - this.options.scrollX, this.options.y - this.options.scrollY, this.options.width, this.options.height);
                            }
                            stack = parseStackingContexts(element);
                            return [4 /*yield*/, this.renderStack(stack)];
                        case 1:
                            _a.sent();
                            this.applyEffects([], 2 /* BACKGROUND_BORDERS */);
                            return [2 /*return*/, this.canvas];
                    }
                });
            });
        };
        return CanvasRenderer;
    }());
    var isTextInputElement = function (container) {
        if (container instanceof TextareaElementContainer) {
            return true;
        }
        else if (container instanceof SelectElementContainer) {
            return true;
        }
        else if (container instanceof InputElementContainer && container.type !== RADIO && container.type !== CHECKBOX) {
            return true;
        }
        return false;
    };
    var calculateBackgroundCurvedPaintingArea = function (clip, curves) {
        switch (clip) {
            case BACKGROUND_CLIP.BORDER_BOX:
                return calculateBorderBoxPath(curves);
            case BACKGROUND_CLIP.CONTENT_BOX:
                return calculateContentBoxPath(curves);
            case BACKGROUND_CLIP.PADDING_BOX:
            default:
                return calculatePaddingBoxPath(curves);
        }
    };
    var canvasTextAlign = function (textAlign) {
        switch (textAlign) {
            case TEXT_ALIGN.CENTER:
                return 'center';
            case TEXT_ALIGN.RIGHT:
                return 'right';
            case TEXT_ALIGN.LEFT:
            default:
                return 'left';
        }
    };

    var ForeignObjectRenderer = /** @class */ (function () {
        function ForeignObjectRenderer(options) {
            this.canvas = options.canvas ? options.canvas : document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.options = options;
            this.canvas.width = Math.floor(options.width * options.scale);
            this.canvas.height = Math.floor(options.height * options.scale);
            this.canvas.style.width = options.width + "px";
            this.canvas.style.height = options.height + "px";
            this.ctx.scale(this.options.scale, this.options.scale);
            this.ctx.translate(-options.x + options.scrollX, -options.y + options.scrollY);
            Logger.getInstance(options.id).debug("EXPERIMENTAL ForeignObject renderer initialized (" + options.width + "x" + options.height + " at " + options.x + "," + options.y + ") with scale " + options.scale);
        }
        ForeignObjectRenderer.prototype.render = function (element) {
            return __awaiter(this, void 0, void 0, function () {
                var svg, img;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            svg = createForeignObjectSVG(Math.max(this.options.windowWidth, this.options.width) * this.options.scale, Math.max(this.options.windowHeight, this.options.height) * this.options.scale, this.options.scrollX * this.options.scale, this.options.scrollY * this.options.scale, element);
                            return [4 /*yield*/, loadSerializedSVG$1(svg)];
                        case 1:
                            img = _a.sent();
                            if (this.options.backgroundColor) {
                                this.ctx.fillStyle = asString(this.options.backgroundColor);
                                this.ctx.fillRect(0, 0, this.options.width * this.options.scale, this.options.height * this.options.scale);
                            }
                            this.ctx.drawImage(img, -this.options.x * this.options.scale, -this.options.y * this.options.scale);
                            return [2 /*return*/, this.canvas];
                    }
                });
            });
        };
        return ForeignObjectRenderer;
    }());
    var loadSerializedSVG$1 = function (svg) {
        return new Promise(function (resolve, reject) {
            var img = new Image();
            img.onload = function () {
                resolve(img);
            };
            img.onerror = reject;
            img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));
        });
    };

    var _this = undefined;
    var parseColor$1 = function (value) { return color.parse(Parser.create(value).parseComponentValue()); };
    var html2canvas = function (element, options) {
        if (options === void 0) { options = {}; }
        return renderElement(element, options);
    };
    if (typeof window !== "undefined") {
        CacheStorage.setContext(window);
    }
    var renderElement = function (element, opts) { return __awaiter(_this, void 0, void 0, function () {
        var ownerDocument, defaultView, instanceName, _a, width, height, left, top, defaultResourceOptions, resourceOptions, defaultOptions, options, windowBounds, documentCloner, clonedElement, container, documentBackgroundColor, bodyBackgroundColor, bgColor, defaultBackgroundColor, backgroundColor, renderOptions, canvas, renderer, root, renderer;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ownerDocument = element.ownerDocument;
                    if (!ownerDocument) {
                        throw new Error("Element is not attached to a Document");
                    }
                    defaultView = ownerDocument.defaultView;
                    if (!defaultView) {
                        throw new Error("Document is not attached to a Window");
                    }
                    instanceName = (Math.round(Math.random() * 1000) + Date.now()).toString(16);
                    _a = isBodyElement(element) || isHTMLElement(element) ? parseDocumentSize(ownerDocument) : parseBounds(element), width = _a.width, height = _a.height, left = _a.left, top = _a.top;
                    defaultResourceOptions = {
                        allowTaint: false,
                        imageTimeout: 15000,
                        proxy: undefined,
                        useCORS: false
                    };
                    resourceOptions = __assign({}, defaultResourceOptions, opts);
                    defaultOptions = {
                        backgroundColor: '#ffffff',
                        cache: opts.cache ? opts.cache : CacheStorage.create(instanceName, resourceOptions),
                        logging: true,
                        removeContainer: true,
                        foreignObjectRendering: false,
                        scale: defaultView.devicePixelRatio || 1,
                        windowWidth: defaultView.innerWidth,
                        windowHeight: defaultView.innerHeight,
                        scrollX: defaultView.pageXOffset,
                        scrollY: defaultView.pageYOffset,
                        x: left,
                        y: top,
                        width: Math.ceil(width),
                        height: Math.ceil(height),
                        id: instanceName
                    };
                    options = __assign({}, defaultOptions, resourceOptions, opts);
                    windowBounds = new Bounds(options.scrollX, options.scrollY, options.windowWidth, options.windowHeight);
                    Logger.create({ id: instanceName, enabled: options.logging });
                    Logger.getInstance(instanceName).debug("Starting document clone");
                    documentCloner = new DocumentCloner(element, {
                        id: instanceName,
                        onclone: options.onclone,
                        ignoreElements: options.ignoreElements,
                        inlineImages: options.foreignObjectRendering,
                        copyStyles: options.foreignObjectRendering
                    });
                    clonedElement = documentCloner.clonedReferenceElement;
                    if (!clonedElement) {
                        return [2 /*return*/, Promise.reject("Unable to find element in cloned iframe")];
                    }
                    return [4 /*yield*/, documentCloner.toIFrame(ownerDocument, windowBounds)];
                case 1:
                    container = _b.sent();
                    documentBackgroundColor = ownerDocument.documentElement
                        ? parseColor$1(getComputedStyle(ownerDocument.documentElement).backgroundColor)
                        : COLORS.TRANSPARENT;
                    bodyBackgroundColor = ownerDocument.body
                        ? parseColor$1(getComputedStyle(ownerDocument.body).backgroundColor)
                        : COLORS.TRANSPARENT;
                    bgColor = opts.backgroundColor;
                    defaultBackgroundColor = typeof bgColor === 'string' ? parseColor$1(bgColor) : bgColor === null ? COLORS.TRANSPARENT : 0xffffffff;
                    backgroundColor = element === ownerDocument.documentElement
                        ? isTransparent(documentBackgroundColor)
                            ? isTransparent(bodyBackgroundColor)
                                ? defaultBackgroundColor
                                : bodyBackgroundColor
                            : documentBackgroundColor
                        : defaultBackgroundColor;
                    renderOptions = {
                        id: instanceName,
                        cache: options.cache,
                        canvas: options.canvas,
                        backgroundColor: backgroundColor,
                        scale: options.scale,
                        x: options.x,
                        y: options.y,
                        scrollX: options.scrollX,
                        scrollY: options.scrollY,
                        width: options.width,
                        height: options.height,
                        windowWidth: options.windowWidth,
                        windowHeight: options.windowHeight
                    };
                    if (!options.foreignObjectRendering) return [3 /*break*/, 3];
                    Logger.getInstance(instanceName).debug("Document cloned, using foreign object rendering");
                    renderer = new ForeignObjectRenderer(renderOptions);
                    return [4 /*yield*/, renderer.render(clonedElement)];
                case 2:
                    canvas = _b.sent();
                    return [3 /*break*/, 5];
                case 3:
                    Logger.getInstance(instanceName).debug("Document cloned, using computed rendering");
                    CacheStorage.attachInstance(options.cache);
                    Logger.getInstance(instanceName).debug("Starting DOM parsing");
                    root = parseTree(clonedElement);
                    CacheStorage.detachInstance();
                    if (backgroundColor === root.styles.backgroundColor) {
                        root.styles.backgroundColor = COLORS.TRANSPARENT;
                    }
                    Logger.getInstance(instanceName).debug("Starting renderer");
                    renderer = new CanvasRenderer(renderOptions);
                    return [4 /*yield*/, renderer.render(root)];
                case 4:
                    canvas = _b.sent();
                    _b.label = 5;
                case 5:
                    if (options.removeContainer === true) {
                        if (!DocumentCloner.destroy(container)) {
                            Logger.getInstance(instanceName).error("Cannot detach cloned iframe as it is not in the DOM anymore");
                        }
                    }
                    Logger.getInstance(instanceName).debug("Finished rendering");
                    Logger.destroy(instanceName);
                    CacheStorage.destroy(instanceName);
                    return [2 /*return*/, canvas];
            }
        });
    }); };

    return html2canvas;

}));
//# sourceMappingURL=html2canvas.js.map




/* global jsPDF */
/** @license
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 James Robb, https://github.com/jamesbrobb
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/**
 * @name addImage
 * @module
 */
(function(jsPDFAPI) {
  "use strict";
  var namespace = "addImage_";
  jsPDFAPI.__addimage__ = {};
  var UNKNOWN = "UNKNOWN";
  var imageFileTypeHeaders = {
    PNG: [[0x89, 0x50, 0x4e, 0x47]],
    TIFF: [
      [0x4d, 0x4d, 0x00, 0x2a], //Motorola
      [0x49, 0x49, 0x2a, 0x00] //Intel
    ],
    JPEG: [
      [
        0xff,
        0xd8,
        0xff,
        0xe0,
        undefined,
        undefined,
        0x4a,
        0x46,
        0x49,
        0x46,
        0x00
      ], //JFIF
      [
        0xff,
        0xd8,
        0xff,
        0xe1,
        undefined,
        undefined,
        0x45,
        0x78,
        0x69,
        0x66,
        0x00,
        0x00
      ], //Exif
      [0xff, 0xd8, 0xff, 0xdb], //JPEG RAW
      [0xff, 0xd8, 0xff, 0xee] //EXIF RAW
    ],
    JPEG2000: [[0x00, 0x00, 0x00, 0x0c, 0x6a, 0x50, 0x20, 0x20]],
    GIF87a: [[0x47, 0x49, 0x46, 0x38, 0x37, 0x61]],
    GIF89a: [[0x47, 0x49, 0x46, 0x38, 0x39, 0x61]],
    WEBP: [
      [
        0x52,
        0x49,
        0x46,
        0x46,
        undefined,
        undefined,
        undefined,
        undefined,
        0x57,
        0x45,
        0x42,
        0x50
      ]
    ],
    BMP: [
      [0x42, 0x4d], //BM - Windows 3.1x, 95, NT, ... etc.
      [0x42, 0x41], //BA - OS/2 struct bitmap array
      [0x43, 0x49], //CI - OS/2 struct color icon
      [0x43, 0x50], //CP - OS/2 const color pointer
      [0x49, 0x43], //IC - OS/2 struct icon
      [0x50, 0x54] //PT - OS/2 pointer
    ]
  };
  /**
   * Recognize filetype of Image by magic-bytes
   *
   * https://en.wikipedia.org/wiki/List_of_file_signatures
   *
   * @name getImageFileTypeByImageData
   * @public
   * @function
   * @param {string|arraybuffer} imageData imageData as binary String or arraybuffer
   * @param {string} format format of file if filetype-recognition fails, e.g. 'JPEG'
   *
   * @returns {string} filetype of Image
   */
  var getImageFileTypeByImageData = (jsPDFAPI.__addimage__.getImageFileTypeByImageData = function(
    imageData,
    fallbackFormat
  ) {
    fallbackFormat = fallbackFormat || UNKNOWN;
    var i;
    var j;
    var result = UNKNOWN;
    var headerSchemata;
    var compareResult;
    var fileType;
    if (isArrayBufferView(imageData)) {
      for (fileType in imageFileTypeHeaders) {
        headerSchemata = imageFileTypeHeaders[fileType];
        for (i = 0; i < headerSchemata.length; i += 1) {
          compareResult = true;
          for (j = 0; j < headerSchemata[i].length; j += 1) {
            if (headerSchemata[i][j] === undefined) {
              continue;
            }
            if (headerSchemata[i][j] !== imageData[j]) {
              compareResult = false;
              break;
            }
          }
          if (compareResult === true) {
            result = fileType;
            break;
          }
        }
      }
    } else {
      for (fileType in imageFileTypeHeaders) {
        headerSchemata = imageFileTypeHeaders[fileType];
        for (i = 0; i < headerSchemata.length; i += 1) {
          compareResult = true;
          for (j = 0; j < headerSchemata[i].length; j += 1) {
            if (headerSchemata[i][j] === undefined) {
              continue;
            }
            if (headerSchemata[i][j] !== imageData.charCodeAt(j)) {
              compareResult = false;
              break;
            }
          }
          if (compareResult === true) {
            result = fileType;
            break;
          }
        }
      }
    }
    if (result === UNKNOWN && fallbackFormat !== UNKNOWN) {
      result = fallbackFormat;
    }
    return result;
  });
  // Image functionality ported from pdf.js
  var putImage = function(image) {
    var out = this.internal.write;
    var putStream = this.internal.putStream;
    var getFilters = this.internal.getFilters;
    var filter = getFilters();
    while (filter.indexOf("FlateEncode") !== -1) {
      filter.splice(filter.indexOf("FlateEncode"), 1);
    }
    image.objectId = this.internal.newObject();
    var additionalKeyValues = [];
    additionalKeyValues.push({ key: "Type", value: "/XObject" });
    additionalKeyValues.push({ key: "Subtype", value: "/Image" });
    additionalKeyValues.push({ key: "Width", value: image.width });
    additionalKeyValues.push({ key: "Height", value: image.height });
    if (image.colorSpace === color_spaces.INDEXED) {
      additionalKeyValues.push({
        key: "ColorSpace",
        value:
          "[/Indexed /DeviceRGB " +
          // if an indexed png defines more than one colour with transparency, we've created a sMask
          (image.palette.length / 3 - 1) +
          " " +
          ("sMask" in image && typeof image.sMask !== "undefined"
            ? image.objectId + 2
            : image.objectId + 1) +
          " 0 R]"
      });
    } else {
      additionalKeyValues.push({
        key: "ColorSpace",
        value: "/" + image.colorSpace
      });
      if (image.colorSpace === color_spaces.DEVICE_CMYK) {
        additionalKeyValues.push({ key: "Decode", value: "[1 0 1 0 1 0 1 0]" });
      }
    }
    additionalKeyValues.push({
      key: "BitsPerComponent",
      value: image.bitsPerComponent
    });
    if (
      "decodeParameters" in image &&
      typeof image.decodeParameters !== "undefined"
    ) {
      additionalKeyValues.push({
        key: "DecodeParms",
        value: "<<" + image.decodeParameters + ">>"
      });
    }
    if ("transparency" in image && Array.isArray(image.transparency)) {
      var transparency = "",
        i = 0,
        len = image.transparency.length;
      for (; i < len; i++)
        transparency +=
          image.transparency[i] + " " + image.transparency[i] + " ";
      additionalKeyValues.push({
        key: "Mask",
        value: "[" + transparency + "]"
      });
    }
    if (typeof image.sMask !== "undefined") {
      additionalKeyValues.push({
        key: "SMask",
        value: image.objectId + 1 + " 0 R"
      });
    }
    var alreadyAppliedFilters =
      typeof image.filter !== "undefined" ? ["/" + image.filter] : undefined;
    putStream({
      data: image.data,
      additionalKeyValues: additionalKeyValues,
      alreadyAppliedFilters: alreadyAppliedFilters
    });
    out("endobj");
    // Soft mask
    if ("sMask" in image && typeof image.sMask !== "undefined") {
      var decodeParameters =
        "/Predictor " +
        image.predictor +
        " /Colors 1 /BitsPerComponent " +
        image.bitsPerComponent +
        " /Columns " +
        image.width;
      var sMask = {
        width: image.width,
        height: image.height,
        colorSpace: "DeviceGray",
        bitsPerComponent: image.bitsPerComponent,
        decodeParameters: decodeParameters,
        data: image.sMask
      };
      if ("filter" in image) {
        sMask.filter = image.filter;
      }
      putImage.call(this, sMask);
    }
    //Palette
    if (image.colorSpace === color_spaces.INDEXED) {
      this.internal.newObject();
      //out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
      //putStream(zlib.compress(img['pal']));
      putStream({
        data: arrayBufferToBinaryString(new Uint8Array(image.palette))
      });
      out("endobj");
    }
  };
  var putResourcesCallback = function() {
    var images = this.internal.collections[namespace + "images"];
    for (var i in images) {
      putImage.call(this, images[i]);
    }
  };
  var putXObjectsDictCallback = function() {
    var images = this.internal.collections[namespace + "images"],
      out = this.internal.write,
      image;
    for (var i in images) {
      image = images[i];
      out("/I" + image.index, image.objectId, "0", "R");
    }
  };
  var checkCompressValue = function(value) {
    if (value && typeof value === "string") value = value.toUpperCase();
    return value in jsPDFAPI.image_compression ? value : image_compression.NONE;
  };
  var initialize = function() {
    if (!this.internal.collections[namespace + "images"]) {
      this.internal.collections[namespace + "images"] = {};
      this.internal.events.subscribe("putResources", putResourcesCallback);
      this.internal.events.subscribe("putXobjectDict", putXObjectsDictCallback);
    }
  };
  var getImages = function() {
    var images = this.internal.collections[namespace + "images"];
    initialize.call(this);
    return images;
  };
  var getImageIndex = function() {
    return Object.keys(this.internal.collections[namespace + "images"]).length;
  };
  var notDefined = function(value) {
    return typeof value === "undefined" || value === null || value.length === 0;
  };
  var generateAliasFromImageData = function(imageData) {
    if (typeof imageData === "string" || isArrayBufferView(imageData)) {
      return sHashCode(imageData);
    }
    return null;
  };
  var isImageTypeSupported = function(type) {
    return typeof jsPDFAPI["process" + type.toUpperCase()] === "function";
  };
  var isDOMElement = function(object) {
    return typeof object === "object" && object.nodeType === 1;
  };
  var getImageDataFromElement = function(element, format) {
    //if element is an image which uses data url definition, just return the dataurl
    if (element.nodeName === "IMG" && element.hasAttribute("src")) {
      var src = "" + element.getAttribute("src");
      //is base64 encoded dataUrl, directly process it
      if (src.indexOf("data:image/") === 0) {
        return atob(
          unescape(src)
            .split("base64,")
            .pop()
        );
      }
      //it is probably an url, try to load it
      var tmpImageData = jsPDFAPI.loadFile(src, true);
      if (tmpImageData !== undefined) {
        return tmpImageData;
      }
    }
    if (element.nodeName === "CANVAS") {
      var mimeType;
      switch (format) {
        case "PNG":
          mimeType = "image/png";
          break;
        case "WEBP":
          mimeType = "image/webp";
          break;
        case "JPEG":
        case "JPG":
        default:
          mimeType = "image/jpeg";
          break;
      }
      return atob(
        element
          .toDataURL(mimeType, 1.0)
          .split("base64,")
          .pop()
      );
    }
  };
  var checkImagesForAlias = function(alias) {
    var images = this.internal.collections[namespace + "images"];
    if (images) {
      for (var e in images) {
        if (alias === images[e].alias) {
          return images[e];
        }
      }
    }
  };
  var determineWidthAndHeight = function(width, height, image) {
    if (!width && !height) {
      width = -96;
      height = -96;
    }
    if (width < 0) {
      width = (-1 * image.width * 72) / width / this.internal.scaleFactor;
    }
    if (height < 0) {
      height = (-1 * image.height * 72) / height / this.internal.scaleFactor;
    }
    if (width === 0) {
      width = (height * image.width) / image.height;
    }
    if (height === 0) {
      height = (width * image.height) / image.width;
    }
    return [width, height];
  };
  var writeImageToPDF = function(x, y, width, height, image, rotation) {
    var dims = determineWidthAndHeight.call(this, width, height, image),
      coord = this.internal.getCoordinateString,
      vcoord = this.internal.getVerticalCoordinateString;
    var images = getImages.call(this);
    width = dims[0];
    height = dims[1];
    images[image.index] = image;
    if (rotation) {
      rotation *= Math.PI / 180;
      var c = Math.cos(rotation);
      var s = Math.sin(rotation);
      //like in pdf Reference do it 4 digits instead of 2
      var f4 = function(number) {
        return number.toFixed(4);
      };
      var rotationTransformationMatrix = [
        f4(c),
        f4(s),
        f4(s * -1),
        f4(c),
        0,
        0,
        "cm"
      ];
    }
    this.internal.write("q"); //Save graphics state
    if (rotation) {
      this.internal.write(
        [1, "0", "0", 1, coord(x), vcoord(y + height), "cm"].join(" ")
      ); //Translate
      this.internal.write(rotationTransformationMatrix.join(" ")); //Rotate
      this.internal.write(
        [coord(width), "0", "0", coord(height), "0", "0", "cm"].join(" ")
      ); //Scale
    } else {
      this.internal.write(
        [
          coord(width),
          "0",
          "0",
          coord(height),
          coord(x),
          vcoord(y + height),
          "cm"
        ].join(" ")
      ); //Translate and Scale
    }
    if (this.isAdvancedAPI()) {
      // draw image bottom up when in "advanced" API mode
      this.internal.write([1, 0, 0, -1, 0, 0, "cm"].join(" "));
    }
    this.internal.write("/I" + image.index + " Do"); //Paint Image
    this.internal.write("Q"); //Restore graphics state
  };
  /**
   * COLOR SPACES
   */
  var color_spaces = (jsPDFAPI.color_spaces = {
    DEVICE_RGB: "DeviceRGB",
    DEVICE_GRAY: "DeviceGray",
    DEVICE_CMYK: "DeviceCMYK",
    CAL_GREY: "CalGray",
    CAL_RGB: "CalRGB",
    LAB: "Lab",
    ICC_BASED: "ICCBased",
    INDEXED: "Indexed",
    PATTERN: "Pattern",
    SEPARATION: "Separation",
    DEVICE_N: "DeviceN"
  });
  /**
   * DECODE METHODS
   */
  jsPDFAPI.decode = {
    DCT_DECODE: "DCTDecode",
    FLATE_DECODE: "FlateDecode",
    LZW_DECODE: "LZWDecode",
    JPX_DECODE: "JPXDecode",
    JBIG2_DECODE: "JBIG2Decode",
    ASCII85_DECODE: "ASCII85Decode",
    ASCII_HEX_DECODE: "ASCIIHexDecode",
    RUN_LENGTH_DECODE: "RunLengthDecode",
    CCITT_FAX_DECODE: "CCITTFaxDecode"
  };
  /**
   * IMAGE COMPRESSION TYPES
   */
  var image_compression = (jsPDFAPI.image_compression = {
    NONE: "NONE",
    FAST: "FAST",
    MEDIUM: "MEDIUM",
    SLOW: "SLOW"
  });
  /**
   * @name sHashCode
   * @function
   * @param {string} data
   * @returns {string}
   */
  var sHashCode = (jsPDFAPI.__addimage__.sHashCode = function(data) {
    var hash = 0,
      i,
      len;
    if (typeof data === "string") {
      len = data.length;
      for (i = 0; i < len; i++) {
        hash = (hash << 5) - hash + data.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
    } else if (isArrayBufferView(data)) {
      len = data.byteLength / 2;
      for (i = 0; i < len; i++) {
        hash = (hash << 5) - hash + data[i];
        hash |= 0; // Convert to 32bit integer
      }
    }
    return hash;
  });
  /**
   * Validates if given String is a valid Base64-String
   *
   * @name validateStringAsBase64
   * @public
   * @function
   * @param {String} possible Base64-String
   *
   * @returns {boolean}
   */
  var validateStringAsBase64 = (jsPDFAPI.__addimage__.validateStringAsBase64 = function(
    possibleBase64String
  ) {
    possibleBase64String = possibleBase64String || "";
    possibleBase64String.toString().trim();
    var result = true;
    if (possibleBase64String.length === 0) {
      result = false;
    }
    if (possibleBase64String.length % 4 !== 0) {
      result = false;
    }
    if (
      /^[A-Za-z0-9+/]+$/.test(
        possibleBase64String.substr(0, possibleBase64String.length - 2)
      ) === false
    ) {
      result = false;
    }
    if (
      /^[A-Za-z0-9/][A-Za-z0-9+/]|[A-Za-z0-9+/]=|==$/.test(
        possibleBase64String.substr(-2)
      ) === false
    ) {
      result = false;
    }
    return result;
  });
  /**
   * Strips out and returns info from a valid base64 data URI
   *
   * @name extractImageFromDataUrl
   * @function
   * @param {string} dataUrl a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
   * @returns {Array}an Array containing the following
   * [0] the complete data URI
   * [1] <MIME-type>
   * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
   * [4] <data>
   */
  var extractImageFromDataUrl = (jsPDFAPI.__addimage__.extractImageFromDataUrl = function(
    dataUrl
  ) {
    dataUrl = dataUrl || "";
    var dataUrlParts = dataUrl.split("base64,");
    var result = null;
    if (dataUrlParts.length === 2) {
      var extractedInfo = /^data:(\w*\/\w*);*(charset=[\w=-]*)*;*$/.exec(
        dataUrlParts[0]
      );
      if (Array.isArray(extractedInfo)) {
        result = {
          mimeType: extractedInfo[1],
          charset: extractedInfo[2],
          data: dataUrlParts[1]
        };
      }
    }
    return result;
  });
  /**
   * Check to see if ArrayBuffer is supported
   *
   * @name supportsArrayBuffer
   * @function
   * @returns {boolean}
   */
  var supportsArrayBuffer = (jsPDFAPI.__addimage__.supportsArrayBuffer = function() {
    return (
      typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined"
    );
  });
  /**
   * Tests supplied object to determine if ArrayBuffer
   *
   * @name isArrayBuffer
   * @function
   * @param {Object} object an Object
   *
   * @returns {boolean}
   */
  jsPDFAPI.__addimage__.isArrayBuffer = function(object) {
    return supportsArrayBuffer() && object instanceof ArrayBuffer;
  };
  /**
   * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
   *
   * @name isArrayBufferView
   * @function
   * @param {Object} object an Object
   * @returns {boolean}
   */
  var isArrayBufferView = (jsPDFAPI.__addimage__.isArrayBufferView = function(
    object
  ) {
    return (
      supportsArrayBuffer() &&
      typeof Uint32Array !== "undefined" &&
      (object instanceof Int8Array ||
        object instanceof Uint8Array ||
        (typeof Uint8ClampedArray !== "undefined" &&
          object instanceof Uint8ClampedArray) ||
        object instanceof Int16Array ||
        object instanceof Uint16Array ||
        object instanceof Int32Array ||
        object instanceof Uint32Array ||
        object instanceof Float32Array ||
        object instanceof Float64Array)
    );
  });
  /**
   * Convert Binary String to ArrayBuffer
   *
   * @name binaryStringToUint8Array
   * @public
   * @function
   * @param {string} BinaryString with ImageData
   * @returns {Uint8Array}
   */
  var binaryStringToUint8Array = (jsPDFAPI.__addimage__.binaryStringToUint8Array = function(
    binary_string
  ) {
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  });
  /**
   * Convert the Buffer to a Binary String
   *
   * @name arrayBufferToBinaryString
   * @public
   * @function
   * @param {ArrayBuffer} ArrayBuffer with ImageData
   *
   * @returns {String}
   */
  var arrayBufferToBinaryString = (jsPDFAPI.__addimage__.arrayBufferToBinaryString = function(
    buffer
  ) {
    try {
      return atob(btoa(String.fromCharCode.apply(null, buffer)));
    } catch (e) {
      if (
        typeof Uint8Array !== "undefined" &&
        typeof Uint8Array.prototype.reduce !== "undefined"
      ) {
        return new Uint8Array(buffer)
          .reduce(function(data, byte) {
            return data.push(String.fromCharCode(byte)), data;
          }, [])
          .join("");
      }
    }
  });
  /**
   * Adds an Image to the PDF.
   *
   * @name addImage
   * @public
   * @function
   * @param {string|HTMLImageElement|HTMLCanvasElement|Uint8Array} imageData imageData as base64 encoded DataUrl or Image-HTMLElement or Canvas-HTMLElement
   * @param {string} format format of file if filetype-recognition fails or in case of a Canvas-Element needs to be specified (default for Canvas is JPEG), e.g. 'JPEG', 'PNG', 'WEBP'
   * @param {number} x x Coordinate (in units declared at inception of PDF document) against left edge of the page
   * @param {number} y y Coordinate (in units declared at inception of PDF document) against upper edge of the page
   * @param {number} width width of the image (in units declared at inception of PDF document)
   * @param {number} height height of the Image (in units declared at inception of PDF document)
   * @param {string} alias alias of the image (if used multiple times)
   * @param {string} compression compression of the generated JPEG, can have the values 'NONE', 'FAST', 'MEDIUM' and 'SLOW'
   * @param {number} rotation rotation of the image in degrees (0-359)
   *
   * @returns jsPDF
   */
  jsPDFAPI.addImage = function() {
    var imageData, format, x, y, w, h, alias, compression, rotation;
    imageData = arguments[0];
    if (typeof arguments[1] === "number") {
      format = UNKNOWN;
      x = arguments[1];
      y = arguments[2];
      w = arguments[3];
      h = arguments[4];
      alias = arguments[5];
      compression = arguments[6];
      rotation = arguments[7];
    } else {
      format = arguments[1];
      x = arguments[2];
      y = arguments[3];
      w = arguments[4];
      h = arguments[5];
      alias = arguments[6];
      compression = arguments[7];
      rotation = arguments[8];
    }
    if (
      typeof imageData === "object" &&
      !isDOMElement(imageData) &&
      "imageData" in imageData
    ) {
      var options = imageData;
      imageData = options.imageData;
      format = options.format || format || UNKNOWN;
      x = options.x || x || 0;
      y = options.y || y || 0;
      w = options.w || options.width || w;
      h = options.h || options.height || h;
      alias = options.alias || alias;
      compression = options.compression || compression;
      rotation = options.rotation || options.angle || rotation;
    }
    //If compression is not explicitly set, determine if we should use compression
    var filter = this.internal.getFilters();
    if (compression === undefined && filter.indexOf("FlateEncode") !== -1) {
      compression = "SLOW";
    }
    if (isNaN(x) || isNaN(y)) {
      throw new Error("Invalid coordinates passed to jsPDF.addImage");
    }
    initialize.call(this);
    var image = processImageData.call(
      this,
      imageData,
      format,
      alias,
      compression
    );
    writeImageToPDF.call(this, x, y, w, h, image, rotation);
    return this;
  };
  var processImageData = function(imageData, format, alias, compression) {
    var result, dataAsBinaryString;
    if (
      typeof imageData === "string" &&
      getImageFileTypeByImageData(imageData) === UNKNOWN
    ) {
      imageData = unescape(imageData);
      var tmpImageData = convertBase64ToBinaryString(imageData, false);
      if (tmpImageData !== "") {
        imageData = tmpImageData;
      } else {
        tmpImageData = jsPDFAPI.loadFile(imageData, true);
        if (tmpImageData !== undefined) {
          imageData = tmpImageData;
        }
      }
    }
    if (isDOMElement(imageData)) {
      imageData = getImageDataFromElement(imageData, format);
    }
    format = getImageFileTypeByImageData(imageData, format);
    if (!isImageTypeSupported(format)) {
      throw new Error(
        "addImage does not support files of type '" +
          format +
          "', please ensure that a plugin for '" +
          format +
          "' support is added."
      );
    }
    // now do the heavy lifting
    if (notDefined(alias)) {
      alias = generateAliasFromImageData(imageData);
    }
    result = checkImagesForAlias.call(this, alias);
    if (!result) {
      if (supportsArrayBuffer()) {
        // no need to convert if imageData is already uint8array
        if (!(imageData instanceof Uint8Array)) {
          dataAsBinaryString = imageData;
          imageData = binaryStringToUint8Array(imageData);
        }
      }
      result = this["process" + format.toUpperCase()](
        imageData,
        getImageIndex.call(this),
        alias,
        checkCompressValue(compression),
        dataAsBinaryString
      );
    }
    if (!result) {
      throw new Error("An unknown error occurred whilst processing the image.");
    }
    return result;
  };
  /**
   * @name convertBase64ToBinaryString
   * @function
   * @param {string} stringData
   * @returns {string} binary string
   */
  var convertBase64ToBinaryString = (jsPDFAPI.__addimage__.convertBase64ToBinaryString = function(
    stringData,
    throwError
  ) {
    throwError = typeof throwError === "boolean" ? throwError : true;
    var base64Info;
    var imageData = "";
    var rawData;
    if (typeof stringData === "string") {
      base64Info = extractImageFromDataUrl(stringData);
      rawData = base64Info !== null ? base64Info.data : stringData;
      try {
        imageData = atob(rawData);
      } catch (e) {
        if (throwError) {
          if (!validateStringAsBase64(rawData)) {
            throw new Error(
              "Supplied Data is not a valid base64-String jsPDF.convertBase64ToBinaryString "
            );
          } else {
            throw new Error(
              "atob-Error in jsPDF.convertBase64ToBinaryString " + e.message
            );
          }
        }
      }
    }
    return imageData;
  });
  /**
   * @name getImageProperties
   * @function
   * @param {Object} imageData
   * @returns {Object}
   */
  jsPDFAPI.getImageProperties = function(imageData) {
    var image;
    var tmpImageData = "";
    var format;
    if (isDOMElement(imageData)) {
      imageData = getImageDataFromElement(imageData);
    }
    if (
      typeof imageData === "string" &&
      getImageFileTypeByImageData(imageData) === UNKNOWN
    ) {
      tmpImageData = convertBase64ToBinaryString(imageData, false);
      if (tmpImageData === "") {
        tmpImageData = jsPDFAPI.loadFile(imageData) || "";
      }
      imageData = tmpImageData;
    }
    format = getImageFileTypeByImageData(imageData);
    if (!isImageTypeSupported(format)) {
      throw new Error(
        "addImage does not support files of type '" +
          format +
          "', please ensure that a plugin for '" +
          format +
          "' support is added."
      );
    }
    if (supportsArrayBuffer() && !(imageData instanceof Uint8Array)) {
      imageData = binaryStringToUint8Array(imageData);
    }
    image = this["process" + format.toUpperCase()](imageData);
    if (!image) {
      throw new Error("An unknown error occurred whilst processing the image");
    }
    image.fileType = format;
    return image;
  };
})(jsPDF.API);




/* global jsPDF */
/**
 * @license
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */
/**
 * jsPDF jpeg Support PlugIn
 *
 * @name jpeg_support
 * @module
 */
(function(jsPDFAPI) {
  "use strict";
  /**
   * 0xc0 (SOF) Huffman  - Baseline DCT
   * 0xc1 (SOF) Huffman  - Extended sequential DCT
   * 0xc2 Progressive DCT (SOF2)
   * 0xc3 Spatial (sequential) lossless (SOF3)
   * 0xc4 Differential sequential DCT (SOF5)
   * 0xc5 Differential progressive DCT (SOF6)
   * 0xc6 Differential spatial (SOF7)
   * 0xc7
   */
  var markers = [0xc0, 0xc1, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7];
  //takes a string imgData containing the raw bytes of
  //a jpeg image and returns [width, height]
  //Algorithm from: http://www.64lines.com/jpeg-width-height
  var getJpegInfo = function(imgData) {
    var width, height, numcomponents;
    var blockLength = imgData.charCodeAt(4) * 256 + imgData.charCodeAt(5);
    var len = imgData.length;
    var result = { width: 0, height: 0, numcomponents: 1 };
    for (var i = 4; i < len; i += 2) {
      i += blockLength;
      if (markers.indexOf(imgData.charCodeAt(i + 1)) !== -1) {
        height = imgData.charCodeAt(i + 5) * 256 + imgData.charCodeAt(i + 6);
        width = imgData.charCodeAt(i + 7) * 256 + imgData.charCodeAt(i + 8);
        numcomponents = imgData.charCodeAt(i + 9);
        result = { width: width, height: height, numcomponents: numcomponents };
        break;
      } else {
        blockLength =
          imgData.charCodeAt(i + 2) * 256 + imgData.charCodeAt(i + 3);
      }
    }
    return result;
  };
  /**
   * @ignore
   */
  jsPDFAPI.processJPEG = function(
    data,
    index,
    alias,
    compression,
    dataAsBinaryString,
    colorSpace
  ) {
    var filter = this.decode.DCT_DECODE,
      bpc = 8,
      dims,
      result = null;
    if (
      typeof data === "string" ||
      this.__addimage__.isArrayBuffer(data) ||
      this.__addimage__.isArrayBufferView(data)
    ) {
      // if we already have a stored binary string rep use that
      data = dataAsBinaryString || data;
      data = this.__addimage__.isArrayBuffer(data)
        ? new Uint8Array(data)
        : data;
      data = this.__addimage__.isArrayBufferView(data)
        ? this.__addimage__.arrayBufferToBinaryString(data)
        : data;
      dims = getJpegInfo(data);
      switch (dims.numcomponents) {
        case 1:
          colorSpace = this.color_spaces.DEVICE_GRAY;
          break;
        case 4:
          colorSpace = this.color_spaces.DEVICE_CMYK;
          break;
        case 3:
          colorSpace = this.color_spaces.DEVICE_RGB;
          break;
      }
      result = {
        data: data,
        width: dims.width,
        height: dims.height,
        colorSpace: colorSpace,
        bitsPerComponent: bpc,
        filter: filter,
        index: index,
        alias: alias
      };
    }
    return result;
  };
})(jsPDF.API);


/*  filesaver */
(function(global, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.FileSaver = mod.exports;
  }
})(this, function() {
  "use strict";

  /*
   * FileSaver.js
   * A saveAs() FileSaver implementation.
   *
   * By Eli Grey, http://eligrey.com
   *
   * License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
   * source  : http://purl.eligrey.com/github/FileSaver.js
   */
  // The one and only way of getting global scope in all environments
  // https://stackoverflow.com/q/3277182/1008999
  var _global =
    typeof window === "object" && window.window === window
      ? window
      : typeof self === "object" && self.self === self
      ? self
      : typeof global === "object" && global.global === global
      ? global
      : void 0;

  function bom(blob, opts) {
    if (typeof opts === "undefined")
      opts = {
        autoBom: false
      };
    else if (typeof opts !== "object") {
      console.warn("Deprecated: Expected third argument to be a object");
      opts = {
        autoBom: !opts
      };
    } // prepend BOM for UTF-8 XML and text/* types (including HTML)
    // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF

    if (
      opts.autoBom &&
      /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(
        blob.type
      )
    ) {
      return new Blob([String.fromCharCode(0xfeff), blob], {
        type: blob.type
      });
    }

    return blob;
  }

  function download(url, name, opts) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";

    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };

    xhr.onerror = function() {
      console.error("could not download file");
    };

    xhr.send();
  }

  function corsEnabled(url) {
    var xhr = new XMLHttpRequest(); // use sync to avoid popup blocker

    xhr.open("HEAD", url, false);
    xhr.send();
    return xhr.status >= 200 && xhr.status <= 299;
  } // `a.click()` doesn't work for all browsers (#465)

  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      var evt = document.createEvent("MouseEvents");
      evt.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        80,
        20,
        false,
        false,
        false,
        false,
        0,
        null
      );
      node.dispatchEvent(evt);
    }
  }

  var saveAs =
    _global.saveAs || // probably in some web worker
    (typeof window !== "object" || window !== _global
      ? function saveAs() {}
      : /* noop */
      // Use download attribute first if possible (#193 Lumia mobile)
      "download" in HTMLAnchorElement.prototype
      ? function saveAs(blob, name, opts) {
          var URL = _global.URL || _global.webkitURL;
          var a = document.createElement("a");
          name = name || blob.name || "download";
          a.download = name;
          a.rel = "noopener"; // tabnabbing
          // TODO: detect chrome extensions & packaged apps
          // a.target = '_blank'

          if (typeof blob === "string") {
            // Support regular links
            a.href = blob;

            if (a.origin !== location.origin) {
              corsEnabled(a.href)
                ? download(blob, name, opts)
                : click(a, (a.target = "_blank"));
            } else {
              click(a);
            }
          } else {
            // Support blobs
            a.href = URL.createObjectURL(blob);
            setTimeout(function() {
              URL.revokeObjectURL(a.href);
            }, 4e4); // 40s

            setTimeout(function() {
              click(a);
            }, 0);
          }
        } // Use msSaveOrOpenBlob as a second approach
      : "msSaveOrOpenBlob" in navigator
      ? function saveAs(blob, name, opts) {
          name = name || blob.name || "download";

          if (typeof blob === "string") {
            if (corsEnabled(blob)) {
              download(blob, name, opts);
            } else {
              var a = document.createElement("a");
              a.href = blob;
              a.target = "_blank";
              setTimeout(function() {
                click(a);
              });
            }
          } else {
            navigator.msSaveOrOpenBlob(bom(blob, opts), name);
          }
        } // Fallback to using FileReader and a popup
      : function saveAs(blob, name, opts, popup) {
          // Open a popup immediately do go around popup blocker
          // Mostly only available on user interaction and the fileReader is async so...
          popup = popup || open("", "_blank");

          if (popup) {
            popup.document.title = popup.document.body.innerText =
              "downloading...";
          }

          if (typeof blob === "string") return download(blob, name, opts);
          var force = blob.type === "application/octet-stream";

          var isSafari =
            /constructor/i.test(_global.HTMLElement) || _global.safari;

          var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

          if (
            (isChromeIOS || (force && isSafari)) &&
            typeof FileReader === "object"
          ) {
            // Safari doesn't allow downloading of blob URLs
            var reader = new FileReader();

            reader.onloadend = function() {
              var url = reader.result;
              url = isChromeIOS
                ? url
                : url.replace(/^data:[^;]*;/, "data:attachment/file;");
              if (popup) popup.location.href = url;
              else location = url;
              popup = null; // reverse-tabnabbing #460
            };

            reader.readAsDataURL(blob);
          } else {
            var URL = _global.URL || _global.webkitURL;
            var url = URL.createObjectURL(blob);
            if (popup) popup.location = url;
            else location.href = url;
            popup = null; // reverse-tabnabbing #460

            setTimeout(function() {
              URL.revokeObjectURL(url);
            }, 4e4); // 40s
          }
        });
  _global.saveAs = saveAs.saveAs = saveAs;

  if (typeof module !== "undefined") {
    module.exports = saveAs;
  }
});





// console.log('jsPDF', jsPDF);
// console.log('html2canvas', html2canvas);
// var pdf = new jsPDF('', 'pt', 'a4');
// console.log('jsPDF addImage', pdf.addImage);

//  --------------------  my function  --------------------


function PDF_button() {
	var btn = document.createElement("input");
	btn.type = "button";
	btn.value = "PDF";
	btn.style = "position:fixed;top:0px;right:0px;";
	btn.onclick = downloadPdf;
	document.body.appendChild(btn)
}
function title_searcher() {
	if (document.title) return document.title;
	var title = document.querySelector('h1').innerText || document.querySelector('h2').innerText || document.querySelector('h1').innerText || document.querySelector('h3').innerText || document.querySelector('h4').innerText || document.querySelector('h5').innerText;
	if (title) return title;
	return Math.random().toString(32).slice(2)
}


function getBlankImage() {
	const A4_width = 595.28;
	var margin_top = 20;
	let blank_canvas = document.createElement("CANVAS");
	blank_canvas.width = A4_width;
	blank_canvas.height = margin_top;
	let context = blank_canvas.getContext("2d") ;
	context.fillStyle="#FFF";
	context.fillRect(0,0,A4_width,margin_top);
	// document.body.appendChild(blank_canvas);
	return blank_canvas.toDataURL('image/jpeg', 1.0);
}

async function main () {
	const canvas = await html2canvas(document.body)
    document.body.appendChild(canvas);
	console.log('html2canvas onrendered')
    var contentWidth = canvas.width;
    var contentHeight = canvas.height;
	// 根据A4纸尺寸是210毫米×297毫米，而1英寸=2.54厘米，我们可以得出当分辨率是多少像素时，得出A4纸大小尺寸为多少毫米。
	// 如下是我们较长用到的规格尺寸： 当分辨率是72像素/英寸时，A4纸像素长宽分别是842×595；
	// 595.28 * 841.89
	const A4_width = 595.28;
	const A4_height = 841.89;

    var position = 0;
	var margin_left = 10;
	var margin_top = 20;

    var imgWidth = A4_width - margin_left * 2;
    var imgHeight = imgWidth / contentWidth * contentHeight;

    var pageData = canvas.toDataURL('image/jpeg', 1.0);
    var pdf = new jsPDF('', 'pt', 'a4');

    console.table({contentWidth, contentHeight, position, imgWidth, imgHeight })
	const pages = Math.ceil( imgHeight / (A4_height - margin_top*2 ) );
    console.log('pages', pages)

    try {
        for (let page_index = 1;page_index <=pages; page_index++ ) {
            // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
            // x Coordinate (in units declared at inception of PDF document) against left edge of the page
            // y Coordinate (in units declared at inception of PDF document) against upper edge of the page
            pdf.addImage(pageData, 'JPEG', margin_left, 0 - A4_height * (page_index -1) + margin_top * (2 * page_index -1), imgWidth, imgHeight);
            // pdf.addImage(getBlankImage(), 'JPEG', 0, A4_height * (1 - page_index)  , A4_width, margin_top);
            // pdf.addImage(getBlankImage(), 'JPEG', 0, A4_height * (1 - page_index ) + A4_height - margin_top , A4_width, margin_top);
            pdf.addImage(getBlankImage(), 'JPEG', 0, 0  , A4_width, margin_top);
            pdf.addImage(getBlankImage(), 'JPEG', 0, A4_height - margin_top , A4_width, margin_top);
            // position = 0 - A4_height * page_index;
            if (page_index < pages) {
                pdf.addPage();
            }
        }
    } catch (e) {
       console.log(e)
    }
	const fileName = '' + title_searcher() + '.pdf'
    pdf.save(fileName);
}

main()