// ==UserScript==
// @name         图片二维码识别/生成工具（Common QR Code）
// @namespace    xiaohuohumax/userscripts/common-qr-code
// @version      1.6.0
// @author       xiaohuohumax
// @description  右键图片，识别二维码并复制到剪贴板。右键文字，生成二维码并展示。
// @license      MIT
// @icon         https://raw.githubusercontent.com/xiaohuohumax/logo/refs/heads/main/logos/logo.svg
// @source       https://github.com/xiaohuohumax/userscripts.git
// @match        http*://*/*
// @require      https://unpkg.com/jsqr@1.4.0/dist/jsQR.js
// @require      https://unpkg.com/notiflix@3.2.8/build/notiflix-notify-aio.js
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/538539/%E5%9B%BE%E7%89%87%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7%EF%BC%88Common%20QR%20Code%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538539/%E5%9B%BE%E7%89%87%E4%BA%8C%E7%BB%B4%E7%A0%81%E8%AF%86%E5%88%AB%E7%94%9F%E6%88%90%E5%B7%A5%E5%85%B7%EF%BC%88Common%20QR%20Code%EF%BC%89.meta.js
// ==/UserScript==

(function (notiflixNotifyAio, jsQR) {
  'use strict';

  var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n) {
    if (n.__esModule) return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var browser = {};
  var canPromise;
  var hasRequiredCanPromise;
  function requireCanPromise() {
    if (hasRequiredCanPromise) return canPromise;
    hasRequiredCanPromise = 1;
    canPromise = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
    return canPromise;
  }
  var qrcode = {};
  var utils$1 = {};
  var hasRequiredUtils$1;
  function requireUtils$1() {
    if (hasRequiredUtils$1) return utils$1;
    hasRequiredUtils$1 = 1;
    let toSJISFunction;
    const CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    utils$1.getSymbolSize = function getSymbolSize(version2) {
      if (!version2) throw new Error('"version" cannot be null or undefined');
      if (version2 < 1 || version2 > 40) throw new Error('"version" should be in range from 1 to 40');
      return version2 * 4 + 17;
    };
    utils$1.getSymbolTotalCodewords = function getSymbolTotalCodewords(version2) {
      return CODEWORDS_COUNT[version2];
    };
    utils$1.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    utils$1.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    utils$1.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    utils$1.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
    return utils$1;
  }
  var errorCorrectionLevel = {};
  var hasRequiredErrorCorrectionLevel;
  function requireErrorCorrectionLevel() {
    if (hasRequiredErrorCorrectionLevel) return errorCorrectionLevel;
    hasRequiredErrorCorrectionLevel = 1;
    (function(exports) {
      exports.L = { bit: 1 };
      exports.M = { bit: 0 };
      exports.Q = { bit: 3 };
      exports.H = { bit: 2 };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "l":
          case "low":
            return exports.L;
          case "m":
          case "medium":
            return exports.M;
          case "q":
          case "quartile":
            return exports.Q;
          case "h":
          case "high":
            return exports.H;
          default:
            throw new Error("Unknown EC Level: " + string);
        }
      }
      exports.isValid = function isValid(level) {
        return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
      };
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    })(errorCorrectionLevel);
    return errorCorrectionLevel;
  }
  var bitBuffer;
  var hasRequiredBitBuffer;
  function requireBitBuffer() {
    if (hasRequiredBitBuffer) return bitBuffer;
    hasRequiredBitBuffer = 1;
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    bitBuffer = BitBuffer;
    return bitBuffer;
  }
  var bitMatrix;
  var hasRequiredBitMatrix;
  function requireBitMatrix() {
    if (hasRequiredBitMatrix) return bitMatrix;
    hasRequiredBitMatrix = 1;
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    bitMatrix = BitMatrix;
    return bitMatrix;
  }
  var alignmentPattern = {};
  var hasRequiredAlignmentPattern;
  function requireAlignmentPattern() {
    if (hasRequiredAlignmentPattern) return alignmentPattern;
    hasRequiredAlignmentPattern = 1;
    (function(exports) {
      const getSymbolSize = requireUtils$1().getSymbolSize;
      exports.getRowColCoords = function getRowColCoords(version2) {
        if (version2 === 1) return [];
        const posCount = Math.floor(version2 / 7) + 2;
        const size = getSymbolSize(version2);
        const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
        const positions = [size - 7];
        for (let i = 1; i < posCount - 1; i++) {
          positions[i] = positions[i - 1] - intervals;
        }
        positions.push(6);
        return positions.reverse();
      };
      exports.getPositions = function getPositions(version2) {
        const coords = [];
        const pos = exports.getRowColCoords(version2);
        const posLength = pos.length;
        for (let i = 0; i < posLength; i++) {
          for (let j = 0; j < posLength; j++) {
            if (i === 0 && j === 0 || // top-left
            i === 0 && j === posLength - 1 || // bottom-left
            i === posLength - 1 && j === 0) {
              continue;
            }
            coords.push([pos[i], pos[j]]);
          }
        }
        return coords;
      };
    })(alignmentPattern);
    return alignmentPattern;
  }
  var finderPattern = {};
  var hasRequiredFinderPattern;
  function requireFinderPattern() {
    if (hasRequiredFinderPattern) return finderPattern;
    hasRequiredFinderPattern = 1;
    const getSymbolSize = requireUtils$1().getSymbolSize;
    const FINDER_PATTERN_SIZE = 7;
    finderPattern.getPositions = function getPositions(version2) {
      const size = getSymbolSize(version2);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
    return finderPattern;
  }
  var maskPattern = {};
  var hasRequiredMaskPattern;
  function requireMaskPattern() {
    if (hasRequiredMaskPattern) return maskPattern;
    hasRequiredMaskPattern = 1;
    (function(exports) {
      exports.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      };
      const PenaltyScores = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
      };
      exports.isValid = function isValid(mask) {
        return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
      };
      exports.from = function from(value) {
        return exports.isValid(value) ? parseInt(value, 10) : void 0;
      };
      exports.getPenaltyN1 = function getPenaltyN1(data) {
        const size = data.size;
        let points = 0;
        let sameCountCol = 0;
        let sameCountRow = 0;
        let lastCol = null;
        let lastRow = null;
        for (let row = 0; row < size; row++) {
          sameCountCol = sameCountRow = 0;
          lastCol = lastRow = null;
          for (let col = 0; col < size; col++) {
            let module = data.get(row, col);
            if (module === lastCol) {
              sameCountCol++;
            } else {
              if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
              lastCol = module;
              sameCountCol = 1;
            }
            module = data.get(col, row);
            if (module === lastRow) {
              sameCountRow++;
            } else {
              if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
              lastRow = module;
              sameCountRow = 1;
            }
          }
          if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
          if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
        }
        return points;
      };
      exports.getPenaltyN2 = function getPenaltyN2(data) {
        const size = data.size;
        let points = 0;
        for (let row = 0; row < size - 1; row++) {
          for (let col = 0; col < size - 1; col++) {
            const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
            if (last === 4 || last === 0) points++;
          }
        }
        return points * PenaltyScores.N2;
      };
      exports.getPenaltyN3 = function getPenaltyN3(data) {
        const size = data.size;
        let points = 0;
        let bitsCol = 0;
        let bitsRow = 0;
        for (let row = 0; row < size; row++) {
          bitsCol = bitsRow = 0;
          for (let col = 0; col < size; col++) {
            bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
            if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
            bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
            if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
          }
        }
        return points * PenaltyScores.N3;
      };
      exports.getPenaltyN4 = function getPenaltyN4(data) {
        let darkCount = 0;
        const modulesCount = data.data.length;
        for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
        const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
        return k * PenaltyScores.N4;
      };
      function getMaskAt(maskPattern2, i, j) {
        switch (maskPattern2) {
          case exports.Patterns.PATTERN000:
            return (i + j) % 2 === 0;
          case exports.Patterns.PATTERN001:
            return i % 2 === 0;
          case exports.Patterns.PATTERN010:
            return j % 3 === 0;
          case exports.Patterns.PATTERN011:
            return (i + j) % 3 === 0;
          case exports.Patterns.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case exports.Patterns.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case exports.Patterns.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case exports.Patterns.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern2);
        }
      }
      exports.applyMask = function applyMask(pattern, data) {
        const size = data.size;
        for (let col = 0; col < size; col++) {
          for (let row = 0; row < size; row++) {
            if (data.isReserved(row, col)) continue;
            data.xor(row, col, getMaskAt(pattern, row, col));
          }
        }
      };
      exports.getBestMask = function getBestMask(data, setupFormatFunc) {
        const numPatterns = Object.keys(exports.Patterns).length;
        let bestPattern = 0;
        let lowerPenalty = Infinity;
        for (let p = 0; p < numPatterns; p++) {
          setupFormatFunc(p);
          exports.applyMask(p, data);
          const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
          exports.applyMask(p, data);
          if (penalty < lowerPenalty) {
            lowerPenalty = penalty;
            bestPattern = p;
          }
        }
        return bestPattern;
      };
    })(maskPattern);
    return maskPattern;
  }
  var errorCorrectionCode = {};
  var hasRequiredErrorCorrectionCode;
  function requireErrorCorrectionCode() {
    if (hasRequiredErrorCorrectionCode) return errorCorrectionCode;
    hasRequiredErrorCorrectionCode = 1;
    const ECLevel = requireErrorCorrectionLevel();
    const EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    const EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    errorCorrectionCode.getBlocksCount = function getBlocksCount(version2, errorCorrectionLevel2) {
      switch (errorCorrectionLevel2) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    errorCorrectionCode.getTotalCodewordsCount = function getTotalCodewordsCount(version2, errorCorrectionLevel2) {
      switch (errorCorrectionLevel2) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version2 - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    return errorCorrectionCode;
  }
  var polynomial = {};
  var galoisField = {};
  var hasRequiredGaloisField;
  function requireGaloisField() {
    if (hasRequiredGaloisField) return galoisField;
    hasRequiredGaloisField = 1;
    const EXP_TABLE = new Uint8Array(512);
    const LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    galoisField.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    galoisField.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    galoisField.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
    return galoisField;
  }
  var hasRequiredPolynomial;
  function requirePolynomial() {
    if (hasRequiredPolynomial) return polynomial;
    hasRequiredPolynomial = 1;
    (function(exports) {
      const GF = requireGaloisField();
      exports.mul = function mul(p1, p2) {
        const coeff = new Uint8Array(p1.length + p2.length - 1);
        for (let i = 0; i < p1.length; i++) {
          for (let j = 0; j < p2.length; j++) {
            coeff[i + j] ^= GF.mul(p1[i], p2[j]);
          }
        }
        return coeff;
      };
      exports.mod = function mod(divident, divisor) {
        let result = new Uint8Array(divident);
        while (result.length - divisor.length >= 0) {
          const coeff = result[0];
          for (let i = 0; i < divisor.length; i++) {
            result[i] ^= GF.mul(divisor[i], coeff);
          }
          let offset = 0;
          while (offset < result.length && result[offset] === 0) offset++;
          result = result.slice(offset);
        }
        return result;
      };
      exports.generateECPolynomial = function generateECPolynomial(degree) {
        let poly = new Uint8Array([1]);
        for (let i = 0; i < degree; i++) {
          poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
        }
        return poly;
      };
    })(polynomial);
    return polynomial;
  }
  var reedSolomonEncoder;
  var hasRequiredReedSolomonEncoder;
  function requireReedSolomonEncoder() {
    if (hasRequiredReedSolomonEncoder) return reedSolomonEncoder;
    hasRequiredReedSolomonEncoder = 1;
    const Polynomial = requirePolynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    reedSolomonEncoder = ReedSolomonEncoder;
    return reedSolomonEncoder;
  }
  var version = {};
  var mode = {};
  var versionCheck = {};
  var hasRequiredVersionCheck;
  function requireVersionCheck() {
    if (hasRequiredVersionCheck) return versionCheck;
    hasRequiredVersionCheck = 1;
    versionCheck.isValid = function isValid(version2) {
      return !isNaN(version2) && version2 >= 1 && version2 <= 40;
    };
    return versionCheck;
  }
  var regex = {};
  var hasRequiredRegex;
  function requireRegex() {
    if (hasRequiredRegex) return regex;
    hasRequiredRegex = 1;
    const numeric = "[0-9]+";
    const alphanumeric = "[A-Z $%*+\\-./:]+";
    let kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    const byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    regex.KANJI = new RegExp(kanji, "g");
    regex.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    regex.BYTE = new RegExp(byte, "g");
    regex.NUMERIC = new RegExp(numeric, "g");
    regex.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    const TEST_KANJI = new RegExp("^" + kanji + "$");
    const TEST_NUMERIC = new RegExp("^" + numeric + "$");
    const TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    regex.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    regex.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    regex.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
    return regex;
  }
  var hasRequiredMode;
  function requireMode() {
    if (hasRequiredMode) return mode;
    hasRequiredMode = 1;
    (function(exports) {
      const VersionCheck = requireVersionCheck();
      const Regex = requireRegex();
      exports.NUMERIC = {
        id: "Numeric",
        bit: 1 << 0,
        ccBits: [10, 12, 14]
      };
      exports.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 1 << 1,
        ccBits: [9, 11, 13]
      };
      exports.BYTE = {
        id: "Byte",
        bit: 1 << 2,
        ccBits: [8, 16, 16]
      };
      exports.KANJI = {
        id: "Kanji",
        bit: 1 << 3,
        ccBits: [8, 10, 12]
      };
      exports.MIXED = {
        bit: -1
      };
      exports.getCharCountIndicator = function getCharCountIndicator(mode2, version2) {
        if (!mode2.ccBits) throw new Error("Invalid mode: " + mode2);
        if (!VersionCheck.isValid(version2)) {
          throw new Error("Invalid version: " + version2);
        }
        if (version2 >= 1 && version2 < 10) return mode2.ccBits[0];
        else if (version2 < 27) return mode2.ccBits[1];
        return mode2.ccBits[2];
      };
      exports.getBestModeForData = function getBestModeForData(dataStr) {
        if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
        else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
        else if (Regex.testKanji(dataStr)) return exports.KANJI;
        else return exports.BYTE;
      };
      exports.toString = function toString2(mode2) {
        if (mode2 && mode2.id) return mode2.id;
        throw new Error("Invalid mode");
      };
      exports.isValid = function isValid(mode2) {
        return mode2 && mode2.bit && mode2.ccBits;
      };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "numeric":
            return exports.NUMERIC;
          case "alphanumeric":
            return exports.ALPHANUMERIC;
          case "kanji":
            return exports.KANJI;
          case "byte":
            return exports.BYTE;
          default:
            throw new Error("Unknown mode: " + string);
        }
      }
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    })(mode);
    return mode;
  }
  var hasRequiredVersion;
  function requireVersion() {
    if (hasRequiredVersion) return version;
    hasRequiredVersion = 1;
    (function(exports) {
      const Utils = requireUtils$1();
      const ECCode = requireErrorCorrectionCode();
      const ECLevel = requireErrorCorrectionLevel();
      const Mode = requireMode();
      const VersionCheck = requireVersionCheck();
      const G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
      const G18_BCH = Utils.getBCHDigit(G18);
      function getBestVersionForDataLength(mode2, length, errorCorrectionLevel2) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel2, mode2)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      function getReservedBitsCount(mode2, version2) {
        return Mode.getCharCountIndicator(mode2, version2) + 4;
      }
      function getTotalBitsFromDataArray(segments2, version2) {
        let totalBits = 0;
        segments2.forEach(function(data) {
          const reservedBits = getReservedBitsCount(data.mode, version2);
          totalBits += reservedBits + data.getBitsLength();
        });
        return totalBits;
      }
      function getBestVersionForMixedData(segments2, errorCorrectionLevel2) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          const length = getTotalBitsFromDataArray(segments2, currentVersion);
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel2, Mode.MIXED)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      exports.from = function from(value, defaultValue) {
        if (VersionCheck.isValid(value)) {
          return parseInt(value, 10);
        }
        return defaultValue;
      };
      exports.getCapacity = function getCapacity(version2, errorCorrectionLevel2, mode2) {
        if (!VersionCheck.isValid(version2)) {
          throw new Error("Invalid QR Code version");
        }
        if (typeof mode2 === "undefined") mode2 = Mode.BYTE;
        const totalCodewords = Utils.getSymbolTotalCodewords(version2);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel2);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (mode2 === Mode.MIXED) return dataTotalCodewordsBits;
        const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode2, version2);
        switch (mode2) {
          case Mode.NUMERIC:
            return Math.floor(usableBits / 10 * 3);
          case Mode.ALPHANUMERIC:
            return Math.floor(usableBits / 11 * 2);
          case Mode.KANJI:
            return Math.floor(usableBits / 13);
          case Mode.BYTE:
          default:
            return Math.floor(usableBits / 8);
        }
      };
      exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel2) {
        let seg;
        const ecl = ECLevel.from(errorCorrectionLevel2, ECLevel.M);
        if (Array.isArray(data)) {
          if (data.length > 1) {
            return getBestVersionForMixedData(data, ecl);
          }
          if (data.length === 0) {
            return 1;
          }
          seg = data[0];
        } else {
          seg = data;
        }
        return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
      };
      exports.getEncodedBits = function getEncodedBits(version2) {
        if (!VersionCheck.isValid(version2) || version2 < 7) {
          throw new Error("Invalid QR Code version");
        }
        let d = version2 << 12;
        while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
          d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
        }
        return version2 << 12 | d;
      };
    })(version);
    return version;
  }
  var formatInfo = {};
  var hasRequiredFormatInfo;
  function requireFormatInfo() {
    if (hasRequiredFormatInfo) return formatInfo;
    hasRequiredFormatInfo = 1;
    const Utils = requireUtils$1();
    const G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    const G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    const G15_BCH = Utils.getBCHDigit(G15);
    formatInfo.getEncodedBits = function getEncodedBits(errorCorrectionLevel2, mask) {
      const data = errorCorrectionLevel2.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
    return formatInfo;
  }
  var segments = {};
  var numericData;
  var hasRequiredNumericData;
  function requireNumericData() {
    if (hasRequiredNumericData) return numericData;
    hasRequiredNumericData = 1;
    const Mode = requireMode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer2) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer2.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer2.put(value, remainingNum * 3 + 1);
      }
    };
    numericData = NumericData;
    return numericData;
  }
  var alphanumericData;
  var hasRequiredAlphanumericData;
  function requireAlphanumericData() {
    if (hasRequiredAlphanumericData) return alphanumericData;
    hasRequiredAlphanumericData = 1;
    const Mode = requireMode();
    const ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer2) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer2.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer2.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    alphanumericData = AlphanumericData;
    return alphanumericData;
  }
  var byteData;
  var hasRequiredByteData;
  function requireByteData() {
    if (hasRequiredByteData) return byteData;
    hasRequiredByteData = 1;
    const Mode = requireMode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer2) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer2.put(this.data[i], 8);
      }
    };
    byteData = ByteData;
    return byteData;
  }
  var kanjiData;
  var hasRequiredKanjiData;
  function requireKanjiData() {
    if (hasRequiredKanjiData) return kanjiData;
    hasRequiredKanjiData = 1;
    const Mode = requireMode();
    const Utils = requireUtils$1();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer2) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer2.put(value, 13);
      }
    };
    kanjiData = KanjiData;
    return kanjiData;
  }
  var dijkstra = { exports: {} };
  var hasRequiredDijkstra;
  function requireDijkstra() {
    if (hasRequiredDijkstra) return dijkstra.exports;
    hasRequiredDijkstra = 1;
    (function(module) {
      var dijkstra2 = {
        single_source_shortest_paths: function(graph, s, d) {
          var predecessors = {};
          var costs = {};
          costs[s] = 0;
          var open = dijkstra2.PriorityQueue.make();
          open.push(s, 0);
          var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
          while (!open.empty()) {
            closest = open.pop();
            u = closest.value;
            cost_of_s_to_u = closest.cost;
            adjacent_nodes = graph[u] || {};
            for (v in adjacent_nodes) {
              if (adjacent_nodes.hasOwnProperty(v)) {
                cost_of_e = adjacent_nodes[v];
                cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
                cost_of_s_to_v = costs[v];
                first_visit = typeof costs[v] === "undefined";
                if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                  costs[v] = cost_of_s_to_u_plus_cost_of_e;
                  open.push(v, cost_of_s_to_u_plus_cost_of_e);
                  predecessors[v] = u;
                }
              }
            }
          }
          if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
            var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
            throw new Error(msg);
          }
          return predecessors;
        },
        extract_shortest_path_from_predecessor_list: function(predecessors, d) {
          var nodes = [];
          var u = d;
          while (u) {
            nodes.push(u);
            predecessors[u];
            u = predecessors[u];
          }
          nodes.reverse();
          return nodes;
        },
        find_path: function(graph, s, d) {
          var predecessors = dijkstra2.single_source_shortest_paths(graph, s, d);
          return dijkstra2.extract_shortest_path_from_predecessor_list(
            predecessors,
            d
          );
        },
        /**
         * A very naive priority queue implementation.
         */
        PriorityQueue: {
          make: function(opts) {
            var T = dijkstra2.PriorityQueue, t = {}, key;
            opts = opts || {};
            for (key in T) {
              if (T.hasOwnProperty(key)) {
                t[key] = T[key];
              }
            }
            t.queue = [];
            t.sorter = opts.sorter || T.default_sorter;
            return t;
          },
          default_sorter: function(a, b) {
            return a.cost - b.cost;
          },
          /**
           * Add a new item to the queue and ensure the highest priority element
           * is at the front of the queue.
           */
          push: function(value, cost) {
            var item = { value, cost };
            this.queue.push(item);
            this.queue.sort(this.sorter);
          },
          /**
           * Return the highest priority element in the queue.
           */
          pop: function() {
            return this.queue.shift();
          },
          empty: function() {
            return this.queue.length === 0;
          }
        }
      };
      {
        module.exports = dijkstra2;
      }
    })(dijkstra);
    return dijkstra.exports;
  }
  var hasRequiredSegments;
  function requireSegments() {
    if (hasRequiredSegments) return segments;
    hasRequiredSegments = 1;
    (function(exports) {
      const Mode = requireMode();
      const NumericData = requireNumericData();
      const AlphanumericData = requireAlphanumericData();
      const ByteData = requireByteData();
      const KanjiData = requireKanjiData();
      const Regex = requireRegex();
      const Utils = requireUtils$1();
      const dijkstra2 = requireDijkstra();
      function getStringByteLength(str) {
        return unescape(encodeURIComponent(str)).length;
      }
      function getSegments(regex2, mode2, str) {
        const segments2 = [];
        let result;
        while ((result = regex2.exec(str)) !== null) {
          segments2.push({
            data: result[0],
            index: result.index,
            mode: mode2,
            length: result[0].length
          });
        }
        return segments2;
      }
      function getSegmentsFromString(dataStr) {
        const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
        const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
        let byteSegs;
        let kanjiSegs;
        if (Utils.isKanjiModeEnabled()) {
          byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
          kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
        } else {
          byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
          kanjiSegs = [];
        }
        const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
        return segs.sort(function(s1, s2) {
          return s1.index - s2.index;
        }).map(function(obj) {
          return {
            data: obj.data,
            mode: obj.mode,
            length: obj.length
          };
        });
      }
      function getSegmentBitsLength(length, mode2) {
        switch (mode2) {
          case Mode.NUMERIC:
            return NumericData.getBitsLength(length);
          case Mode.ALPHANUMERIC:
            return AlphanumericData.getBitsLength(length);
          case Mode.KANJI:
            return KanjiData.getBitsLength(length);
          case Mode.BYTE:
            return ByteData.getBitsLength(length);
        }
      }
      function mergeSegments(segs) {
        return segs.reduce(function(acc, curr) {
          const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
          if (prevSeg && prevSeg.mode === curr.mode) {
            acc[acc.length - 1].data += curr.data;
            return acc;
          }
          acc.push(curr);
          return acc;
        }, []);
      }
      function buildNodes(segs) {
        const nodes = [];
        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          switch (seg.mode) {
            case Mode.NUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.ALPHANUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.KANJI:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
              break;
            case Mode.BYTE:
              nodes.push([
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
          }
        }
        return nodes;
      }
      function buildGraph(nodes, version2) {
        const table = {};
        const graph = { start: {} };
        let prevNodeIds = ["start"];
        for (let i = 0; i < nodes.length; i++) {
          const nodeGroup = nodes[i];
          const currentNodeIds = [];
          for (let j = 0; j < nodeGroup.length; j++) {
            const node = nodeGroup[j];
            const key = "" + i + j;
            currentNodeIds.push(key);
            table[key] = { node, lastCount: 0 };
            graph[key] = {};
            for (let n = 0; n < prevNodeIds.length; n++) {
              const prevNodeId = prevNodeIds[n];
              if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
                graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
                table[prevNodeId].lastCount += node.length;
              } else {
                if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
                graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version2);
              }
            }
          }
          prevNodeIds = currentNodeIds;
        }
        for (let n = 0; n < prevNodeIds.length; n++) {
          graph[prevNodeIds[n]].end = 0;
        }
        return { map: graph, table };
      }
      function buildSingleSegment(data, modesHint) {
        let mode2;
        const bestMode = Mode.getBestModeForData(data);
        mode2 = Mode.from(modesHint, bestMode);
        if (mode2 !== Mode.BYTE && mode2.bit < bestMode.bit) {
          throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode2) + ".\n Suggested mode is: " + Mode.toString(bestMode));
        }
        if (mode2 === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
          mode2 = Mode.BYTE;
        }
        switch (mode2) {
          case Mode.NUMERIC:
            return new NumericData(data);
          case Mode.ALPHANUMERIC:
            return new AlphanumericData(data);
          case Mode.KANJI:
            return new KanjiData(data);
          case Mode.BYTE:
            return new ByteData(data);
        }
      }
      exports.fromArray = function fromArray(array) {
        return array.reduce(function(acc, seg) {
          if (typeof seg === "string") {
            acc.push(buildSingleSegment(seg, null));
          } else if (seg.data) {
            acc.push(buildSingleSegment(seg.data, seg.mode));
          }
          return acc;
        }, []);
      };
      exports.fromString = function fromString(data, version2) {
        const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
        const nodes = buildNodes(segs);
        const graph = buildGraph(nodes, version2);
        const path = dijkstra2.find_path(graph.map, "start", "end");
        const optimizedSegs = [];
        for (let i = 1; i < path.length - 1; i++) {
          optimizedSegs.push(graph.table[path[i]].node);
        }
        return exports.fromArray(mergeSegments(optimizedSegs));
      };
      exports.rawSplit = function rawSplit(data) {
        return exports.fromArray(
          getSegmentsFromString(data, Utils.isKanjiModeEnabled())
        );
      };
    })(segments);
    return segments;
  }
  var hasRequiredQrcode;
  function requireQrcode() {
    if (hasRequiredQrcode) return qrcode;
    hasRequiredQrcode = 1;
    const Utils = requireUtils$1();
    const ECLevel = requireErrorCorrectionLevel();
    const BitBuffer = requireBitBuffer();
    const BitMatrix = requireBitMatrix();
    const AlignmentPattern = requireAlignmentPattern();
    const FinderPattern = requireFinderPattern();
    const MaskPattern = requireMaskPattern();
    const ECCode = requireErrorCorrectionCode();
    const ReedSolomonEncoder = requireReedSolomonEncoder();
    const Version = requireVersion();
    const FormatInfo = requireFormatInfo();
    const Mode = requireMode();
    const Segments = requireSegments();
    function setupFinderPattern(matrix, version2) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version2) {
      const pos = AlignmentPattern.getPositions(version2);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version2) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version2);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel2, maskPattern2) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel2, maskPattern2);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version2, errorCorrectionLevel2, segments2) {
      const buffer = new BitBuffer();
      segments2.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version2));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel2);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version2, errorCorrectionLevel2);
    }
    function createCodewords(bitBuffer2, version2, errorCorrectionLevel2) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version2);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version2, errorCorrectionLevel2);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version2, errorCorrectionLevel2);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer2.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version2, errorCorrectionLevel2, maskPattern2) {
      let segments2;
      if (Array.isArray(data)) {
        segments2 = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version2;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel2);
        }
        segments2 = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments2, errorCorrectionLevel2);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version2) {
        version2 = bestVersion;
      } else if (version2 < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version2, errorCorrectionLevel2, segments2);
      const moduleCount = Utils.getSymbolSize(version2);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version2);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version2);
      setupFormatInfo(modules, errorCorrectionLevel2, 0);
      if (version2 >= 7) {
        setupVersionInfo(modules, version2);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern2)) {
        maskPattern2 = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel2)
        );
      }
      MaskPattern.applyMask(maskPattern2, modules);
      setupFormatInfo(modules, errorCorrectionLevel2, maskPattern2);
      return {
        modules,
        version: version2,
        errorCorrectionLevel: errorCorrectionLevel2,
        maskPattern: maskPattern2,
        segments: segments2
      };
    }
    qrcode.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel2 = ECLevel.M;
      let version2;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel2 = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version2 = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version2, errorCorrectionLevel2, mask);
    };
    return qrcode;
  }
  var canvas = {};
  var utils = {};
  var hasRequiredUtils;
  function requireUtils() {
    if (hasRequiredUtils) return utils;
    hasRequiredUtils = 1;
    (function(exports) {
      function hex2rgba(hex) {
        if (typeof hex === "number") {
          hex = hex.toString();
        }
        if (typeof hex !== "string") {
          throw new Error("Color should be defined as hex string");
        }
        let hexCode = hex.slice().replace("#", "").split("");
        if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
          throw new Error("Invalid hex color: " + hex);
        }
        if (hexCode.length === 3 || hexCode.length === 4) {
          hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
            return [c, c];
          }));
        }
        if (hexCode.length === 6) hexCode.push("F", "F");
        const hexValue = parseInt(hexCode.join(""), 16);
        return {
          r: hexValue >> 24 & 255,
          g: hexValue >> 16 & 255,
          b: hexValue >> 8 & 255,
          a: hexValue & 255,
          hex: "#" + hexCode.slice(0, 6).join("")
        };
      }
      exports.getOptions = function getOptions(options) {
        if (!options) options = {};
        if (!options.color) options.color = {};
        const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
        const width = options.width && options.width >= 21 ? options.width : void 0;
        const scale = options.scale || 4;
        return {
          width,
          scale: width ? 4 : scale,
          margin,
          color: {
            dark: hex2rgba(options.color.dark || "#000000ff"),
            light: hex2rgba(options.color.light || "#ffffffff")
          },
          type: options.type,
          rendererOpts: options.rendererOpts || {}
        };
      };
      exports.getScale = function getScale(qrSize, opts) {
        return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
      };
      exports.getImageWidth = function getImageWidth(qrSize, opts) {
        const scale = exports.getScale(qrSize, opts);
        return Math.floor((qrSize + opts.margin * 2) * scale);
      };
      exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
        const size = qr.modules.size;
        const data = qr.modules.data;
        const scale = exports.getScale(size, opts);
        const symbolSize = Math.floor((size + opts.margin * 2) * scale);
        const scaledMargin = opts.margin * scale;
        const palette = [opts.color.light, opts.color.dark];
        for (let i = 0; i < symbolSize; i++) {
          for (let j = 0; j < symbolSize; j++) {
            let posDst = (i * symbolSize + j) * 4;
            let pxColor = opts.color.light;
            if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
              const iSrc = Math.floor((i - scaledMargin) / scale);
              const jSrc = Math.floor((j - scaledMargin) / scale);
              pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
            }
            imgData[posDst++] = pxColor.r;
            imgData[posDst++] = pxColor.g;
            imgData[posDst++] = pxColor.b;
            imgData[posDst] = pxColor.a;
          }
        }
      };
    })(utils);
    return utils;
  }
  var hasRequiredCanvas;
  function requireCanvas() {
    if (hasRequiredCanvas) return canvas;
    hasRequiredCanvas = 1;
    (function(exports) {
      const Utils = requireUtils();
      function clearCanvas(ctx, canvas2, size) {
        ctx.clearRect(0, 0, canvas2.width, canvas2.height);
        if (!canvas2.style) canvas2.style = {};
        canvas2.height = size;
        canvas2.width = size;
        canvas2.style.height = size + "px";
        canvas2.style.width = size + "px";
      }
      function getCanvasElement() {
        try {
          return document.createElement("canvas");
        } catch (e) {
          throw new Error("You need to specify a canvas element");
        }
      }
      exports.render = function render(qrData, canvas2, options) {
        let opts = options;
        let canvasEl = canvas2;
        if (typeof opts === "undefined" && (!canvas2 || !canvas2.getContext)) {
          opts = canvas2;
          canvas2 = void 0;
        }
        if (!canvas2) {
          canvasEl = getCanvasElement();
        }
        opts = Utils.getOptions(opts);
        const size = Utils.getImageWidth(qrData.modules.size, opts);
        const ctx = canvasEl.getContext("2d");
        const image = ctx.createImageData(size, size);
        Utils.qrToImageData(image.data, qrData, opts);
        clearCanvas(ctx, canvasEl, size);
        ctx.putImageData(image, 0, 0);
        return canvasEl;
      };
      exports.renderToDataURL = function renderToDataURL(qrData, canvas2, options) {
        let opts = options;
        if (typeof opts === "undefined" && (!canvas2 || !canvas2.getContext)) {
          opts = canvas2;
          canvas2 = void 0;
        }
        if (!opts) opts = {};
        const canvasEl = exports.render(qrData, canvas2, opts);
        const type = opts.type || "image/png";
        const rendererOpts = opts.rendererOpts || {};
        return canvasEl.toDataURL(type, rendererOpts.quality);
      };
    })(canvas);
    return canvas;
  }
  var svgTag = {};
  var hasRequiredSvgTag;
  function requireSvgTag() {
    if (hasRequiredSvgTag) return svgTag;
    hasRequiredSvgTag = 1;
    const Utils = requireUtils();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    svgTag.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag2 = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag2);
      }
      return svgTag2;
    };
    return svgTag;
  }
  var hasRequiredBrowser;
  function requireBrowser() {
    if (hasRequiredBrowser) return browser;
    hasRequiredBrowser = 1;
    const canPromise2 = requireCanPromise();
    const QRCode2 = requireQrcode();
    const CanvasRenderer = requireCanvas();
    const SvgRenderer = requireSvgTag();
    function renderCanvas(renderFunc, canvas2, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise2()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas2;
          canvas2 = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas2.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas2;
            canvas2 = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas2;
          canvas2 = opts = void 0;
        } else if (argsNum === 2 && !canvas2.getContext) {
          opts = text;
          text = canvas2;
          canvas2 = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas2, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas2, opts));
      } catch (e) {
        cb(e);
      }
    }
    browser.create = QRCode2.create;
    browser.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    browser.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    browser.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
    return browser;
  }
  var browserExports = requireBrowser();
  const QRCode = /* @__PURE__ */ getDefaultExportFromCjs(browserExports);
  var sweetalert_min$1 = { exports: {} };
  var sweetalert_min = sweetalert_min$1.exports;
  var hasRequiredSweetalert_min;
  function requireSweetalert_min() {
    if (hasRequiredSweetalert_min) return sweetalert_min$1.exports;
    hasRequiredSweetalert_min = 1;
    (function(module, exports) {
      !function(t, e) {
        module.exports = e();
      }(sweetalert_min, function() {
        return function(t) {
          function e(o) {
            if (n[o]) return n[o].exports;
            var r = n[o] = { i: o, l: false, exports: {} };
            return t[o].call(r.exports, r, r.exports, e), r.l = true, r.exports;
          }
          var n = {};
          return e.m = t, e.c = n, e.d = function(t2, n2, o) {
            e.o(t2, n2) || Object.defineProperty(t2, n2, { configurable: false, enumerable: true, get: o });
          }, e.n = function(t2) {
            var n2 = t2 && t2.__esModule ? function() {
              return t2.default;
            } : function() {
              return t2;
            };
            return e.d(n2, "a", n2), n2;
          }, e.o = function(t2, e2) {
            return Object.prototype.hasOwnProperty.call(t2, e2);
          }, e.p = "", e(e.s = 8);
        }([function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = "swal-button";
          e.CLASS_NAMES = { MODAL: "swal-modal", OVERLAY: "swal-overlay", SHOW_MODAL: "swal-overlay--show-modal", MODAL_TITLE: "swal-title", MODAL_TEXT: "swal-text", ICON: "swal-icon", ICON_CUSTOM: "swal-icon--custom", CONTENT: "swal-content", FOOTER: "swal-footer", BUTTON_CONTAINER: "swal-button-container", BUTTON: o, CONFIRM_BUTTON: o + "--confirm", CANCEL_BUTTON: o + "--cancel", DANGER_BUTTON: o + "--danger", BUTTON_LOADING: o + "--loading", BUTTON_LOADER: o + "__loader" }, e.default = e.CLASS_NAMES;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true }), e.getNode = function(t2) {
            var e2 = "." + t2;
            return document.querySelector(e2);
          }, e.stringToNode = function(t2) {
            var e2 = document.createElement("div");
            return e2.innerHTML = t2.trim(), e2.firstChild;
          }, e.insertAfter = function(t2, e2) {
            var n2 = e2.nextSibling;
            e2.parentNode.insertBefore(t2, n2);
          }, e.removeNode = function(t2) {
            t2.parentElement.removeChild(t2);
          }, e.throwErr = function(t2) {
            throw t2 = t2.replace(/ +(?= )/g, ""), "SweetAlert: " + (t2 = t2.trim());
          }, e.isPlainObject = function(t2) {
            if ("[object Object]" !== Object.prototype.toString.call(t2)) return false;
            var e2 = Object.getPrototypeOf(t2);
            return null === e2 || e2 === Object.prototype;
          }, e.ordinalSuffixOf = function(t2) {
            var e2 = t2 % 10, n2 = t2 % 100;
            return 1 === e2 && 11 !== n2 ? t2 + "st" : 2 === e2 && 12 !== n2 ? t2 + "nd" : 3 === e2 && 13 !== n2 ? t2 + "rd" : t2 + "th";
          };
        }, function(t, e, n) {
          function o(t2) {
            for (var n2 in t2) e.hasOwnProperty(n2) || (e[n2] = t2[n2]);
          }
          Object.defineProperty(e, "__esModule", { value: true }), o(n(25));
          var r = n(26);
          e.overlayMarkup = r.default, o(n(27)), o(n(28)), o(n(29));
          var i = n(0), a = i.default.MODAL_TITLE, s = i.default.MODAL_TEXT, c = i.default.ICON, l = i.default.FOOTER;
          e.iconMarkup = '\n  <div class="' + c + '"></div>', e.titleMarkup = '\n  <div class="' + a + '"></div>\n', e.textMarkup = '\n  <div class="' + s + '"></div>', e.footerMarkup = '\n  <div class="' + l + '"></div>\n';
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(1);
          e.CONFIRM_KEY = "confirm", e.CANCEL_KEY = "cancel";
          var r = { visible: true, text: null, value: null, className: "", closeModal: true }, i = Object.assign({}, r, { visible: false, text: "Cancel", value: null }), a = Object.assign({}, r, { text: "OK", value: true });
          e.defaultButtonList = { cancel: i, confirm: a };
          var s = function(t2) {
            switch (t2) {
              case e.CONFIRM_KEY:
                return a;
              case e.CANCEL_KEY:
                return i;
              default:
                var n2 = t2.charAt(0).toUpperCase() + t2.slice(1);
                return Object.assign({}, r, { text: n2, value: t2 });
            }
          }, c = function(t2, e2) {
            var n2 = s(t2);
            return true === e2 ? Object.assign({}, n2, { visible: true }) : "string" == typeof e2 ? Object.assign({}, n2, { visible: true, text: e2 }) : o.isPlainObject(e2) ? Object.assign({ visible: true }, n2, e2) : Object.assign({}, n2, { visible: false });
          }, l = function(t2) {
            for (var e2 = {}, n2 = 0, o2 = Object.keys(t2); n2 < o2.length; n2++) {
              var r2 = o2[n2], a2 = t2[r2], s2 = c(r2, a2);
              e2[r2] = s2;
            }
            return e2.cancel || (e2.cancel = i), e2;
          }, u = function(t2) {
            var n2 = {};
            switch (t2.length) {
              case 1:
                n2[e.CANCEL_KEY] = Object.assign({}, i, { visible: false });
                break;
              case 2:
                n2[e.CANCEL_KEY] = c(e.CANCEL_KEY, t2[0]), n2[e.CONFIRM_KEY] = c(e.CONFIRM_KEY, t2[1]);
                break;
              default:
                o.throwErr("Invalid number of 'buttons' in array (" + t2.length + ").\n      If you want more than 2 buttons, you need to use an object!");
            }
            return n2;
          };
          e.getButtonListOpts = function(t2) {
            var n2 = e.defaultButtonList;
            return "string" == typeof t2 ? n2[e.CONFIRM_KEY] = c(e.CONFIRM_KEY, t2) : Array.isArray(t2) ? n2 = u(t2) : o.isPlainObject(t2) ? n2 = l(t2) : true === t2 ? n2 = u([true, true]) : false === t2 ? n2 = u([false, false]) : void 0 === t2 && (n2 = e.defaultButtonList), n2;
          };
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(1), r = n(2), i = n(0), a = i.default.MODAL, s = i.default.OVERLAY, c = n(30), l = n(31), u = n(32), f = n(33);
          e.injectElIntoModal = function(t2) {
            var e2 = o.getNode(a), n2 = o.stringToNode(t2);
            return e2.appendChild(n2), n2;
          };
          var d = function(t2) {
            t2.className = a, t2.textContent = "";
          }, p = function(t2, e2) {
            d(t2);
            var n2 = e2.className;
            n2 && t2.classList.add(n2);
          };
          e.initModalContent = function(t2) {
            var e2 = o.getNode(a);
            p(e2, t2), c.default(t2.icon), l.initTitle(t2.title), l.initText(t2.text), f.default(t2.content), u.default(t2.buttons, t2.dangerMode);
          };
          var m = function() {
            var t2 = o.getNode(s), e2 = o.stringToNode(r.modalMarkup);
            t2.appendChild(e2);
          };
          e.default = m;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(3), r = { isOpen: false, promise: null, actions: {}, timer: null }, i = Object.assign({}, r);
          e.resetState = function() {
            i = Object.assign({}, r);
          }, e.setActionValue = function(t2) {
            if ("string" == typeof t2) return a(o.CONFIRM_KEY, t2);
            for (var e2 in t2) a(e2, t2[e2]);
          };
          var a = function(t2, e2) {
            i.actions[t2] || (i.actions[t2] = {}), Object.assign(i.actions[t2], { value: e2 });
          };
          e.setActionOptionsFor = function(t2, e2) {
            var n2 = (void 0 === e2 ? {} : e2).closeModal, o2 = void 0 === n2 || n2;
            Object.assign(i.actions[t2], { closeModal: o2 });
          }, e.default = i;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(1), r = n(3), i = n(0), a = i.default.OVERLAY, s = i.default.SHOW_MODAL, c = i.default.BUTTON, l = i.default.BUTTON_LOADING, u = n(5);
          e.openModal = function() {
            o.getNode(a).classList.add(s), u.default.isOpen = true;
          };
          var f = function() {
            o.getNode(a).classList.remove(s), u.default.isOpen = false;
          };
          e.onAction = function(t2) {
            void 0 === t2 && (t2 = r.CANCEL_KEY);
            var e2 = u.default.actions[t2], n2 = e2.value;
            if (false === e2.closeModal) {
              var i2 = c + "--" + t2;
              o.getNode(i2).classList.add(l);
            } else f();
            u.default.promise.resolve(n2);
          }, e.getState = function() {
            var t2 = Object.assign({}, u.default);
            return delete t2.promise, delete t2.timer, t2;
          }, e.stopLoading = function() {
            for (var t2 = document.querySelectorAll("." + c), e2 = 0; e2 < t2.length; e2++) {
              t2[e2].classList.remove(l);
            }
          };
        }, function(t, e) {
          var n;
          n = /* @__PURE__ */ function() {
            return this;
          }();
          try {
            n = n || Function("return this")() || (0, eval)("this");
          } catch (t2) {
            "object" == typeof window && (n = window);
          }
          t.exports = n;
        }, function(t, e, n) {
          (function(e2) {
            t.exports = e2.sweetAlert = n(9);
          }).call(e, n(7));
        }, function(t, e, n) {
          (function(e2) {
            t.exports = e2.swal = n(10);
          }).call(e, n(7));
        }, function(t, e, n) {
          "undefined" != typeof window && n(11), n(16);
          var o = n(23).default;
          t.exports = o;
        }, function(t, e, n) {
          var o = n(12);
          "string" == typeof o && (o = [[t.i, o, ""]]);
          var r = { insertAt: "top" };
          r.transform = void 0;
          n(14)(o, r);
          o.locals && (t.exports = o.locals);
        }, function(t, e, n) {
          e = t.exports = n(13)(void 0), e.push([t.i, '.swal-icon--error{border-color:#f27474;-webkit-animation:animateErrorIcon .5s;animation:animateErrorIcon .5s}.swal-icon--error__x-mark{position:relative;display:block;-webkit-animation:animateXMark .5s;animation:animateXMark .5s}.swal-icon--error__line{position:absolute;height:5px;width:47px;background-color:#f27474;display:block;top:37px;border-radius:2px}.swal-icon--error__line--left{-webkit-transform:rotate(45deg);transform:rotate(45deg);left:17px}.swal-icon--error__line--right{-webkit-transform:rotate(-45deg);transform:rotate(-45deg);right:16px}@-webkit-keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@keyframes animateErrorIcon{0%{-webkit-transform:rotateX(100deg);transform:rotateX(100deg);opacity:0}to{-webkit-transform:rotateX(0deg);transform:rotateX(0deg);opacity:1}}@-webkit-keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}@keyframes animateXMark{0%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}50%{-webkit-transform:scale(.4);transform:scale(.4);margin-top:26px;opacity:0}80%{-webkit-transform:scale(1.15);transform:scale(1.15);margin-top:-6px}to{-webkit-transform:scale(1);transform:scale(1);margin-top:0;opacity:1}}.swal-icon--warning{border-color:#f8bb86;-webkit-animation:pulseWarning .75s infinite alternate;animation:pulseWarning .75s infinite alternate}.swal-icon--warning__body{width:5px;height:47px;top:10px;border-radius:2px;margin-left:-2px}.swal-icon--warning__body,.swal-icon--warning__dot{position:absolute;left:50%;background-color:#f8bb86}.swal-icon--warning__dot{width:7px;height:7px;border-radius:50%;margin-left:-4px;bottom:-11px}@-webkit-keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}@keyframes pulseWarning{0%{border-color:#f8d486}to{border-color:#f8bb86}}.swal-icon--success{border-color:#a5dc86}.swal-icon--success:after,.swal-icon--success:before{content:"";border-radius:50%;position:absolute;width:60px;height:120px;background:#fff;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.swal-icon--success:before{border-radius:120px 0 0 120px;top:-7px;left:-33px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:60px 60px;transform-origin:60px 60px}.swal-icon--success:after{border-radius:0 120px 120px 0;top:-11px;left:30px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:0 60px;transform-origin:0 60px;-webkit-animation:rotatePlaceholder 4.25s ease-in;animation:rotatePlaceholder 4.25s ease-in}.swal-icon--success__ring{width:80px;height:80px;border:4px solid hsla(98,55%,69%,.2);border-radius:50%;box-sizing:content-box;position:absolute;left:-4px;top:-4px;z-index:2}.swal-icon--success__hide-corners{width:5px;height:90px;background-color:#fff;padding:1px;position:absolute;left:28px;top:8px;z-index:1;-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}.swal-icon--success__line{height:5px;background-color:#a5dc86;display:block;border-radius:2px;position:absolute;z-index:2}.swal-icon--success__line--tip{width:25px;left:14px;top:46px;-webkit-transform:rotate(45deg);transform:rotate(45deg);-webkit-animation:animateSuccessTip .75s;animation:animateSuccessTip .75s}.swal-icon--success__line--long{width:47px;right:8px;top:38px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-animation:animateSuccessLong .75s;animation:animateSuccessLong .75s}@-webkit-keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@keyframes rotatePlaceholder{0%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}5%{-webkit-transform:rotate(-45deg);transform:rotate(-45deg)}12%{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}to{-webkit-transform:rotate(-405deg);transform:rotate(-405deg)}}@-webkit-keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@keyframes animateSuccessTip{0%{width:0;left:1px;top:19px}54%{width:0;left:1px;top:19px}70%{width:50px;left:-8px;top:37px}84%{width:17px;left:21px;top:48px}to{width:25px;left:14px;top:45px}}@-webkit-keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}@keyframes animateSuccessLong{0%{width:0;right:46px;top:54px}65%{width:0;right:46px;top:54px}84%{width:55px;right:0;top:35px}to{width:47px;right:8px;top:38px}}.swal-icon--info{border-color:#c9dae1}.swal-icon--info:before{width:5px;height:29px;bottom:17px;border-radius:2px;margin-left:-2px}.swal-icon--info:after,.swal-icon--info:before{content:"";position:absolute;left:50%;background-color:#c9dae1}.swal-icon--info:after{width:7px;height:7px;border-radius:50%;margin-left:-3px;top:19px}.swal-icon{width:80px;height:80px;border-width:4px;border-style:solid;border-radius:50%;padding:0;position:relative;box-sizing:content-box;margin:20px auto}.swal-icon:first-child{margin-top:32px}.swal-icon--custom{width:auto;height:auto;max-width:100%;border:none;border-radius:0}.swal-icon img{max-width:100%;max-height:100%}.swal-title{color:rgba(0,0,0,.65);font-weight:600;text-transform:none;position:relative;display:block;padding:13px 16px;font-size:27px;line-height:normal;text-align:center;margin-bottom:0}.swal-title:first-child{margin-top:26px}.swal-title:not(:first-child){padding-bottom:0}.swal-title:not(:last-child){margin-bottom:13px}.swal-text{font-size:16px;position:relative;float:none;line-height:normal;vertical-align:top;text-align:left;display:inline-block;margin:0;padding:0 10px;font-weight:400;color:rgba(0,0,0,.64);max-width:calc(100% - 20px);overflow-wrap:break-word;box-sizing:border-box}.swal-text:first-child{margin-top:45px}.swal-text:last-child{margin-bottom:45px}.swal-footer{text-align:right;padding-top:13px;margin-top:13px;padding:13px 16px;border-radius:inherit;border-top-left-radius:0;border-top-right-radius:0}.swal-button-container{margin:5px;display:inline-block;position:relative}.swal-button{background-color:#7cd1f9;color:#fff;border:none;box-shadow:none;border-radius:5px;font-weight:600;font-size:14px;padding:10px 24px;margin:0;cursor:pointer}.swal-button:not([disabled]):hover{background-color:#78cbf2}.swal-button:active{background-color:#70bce0}.swal-button:focus{outline:none;box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(43,114,165,.29)}.swal-button[disabled]{opacity:.5;cursor:default}.swal-button::-moz-focus-inner{border:0}.swal-button--cancel{color:#555;background-color:#efefef}.swal-button--cancel:not([disabled]):hover{background-color:#e8e8e8}.swal-button--cancel:active{background-color:#d7d7d7}.swal-button--cancel:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(116,136,150,.29)}.swal-button--danger{background-color:#e64942}.swal-button--danger:not([disabled]):hover{background-color:#df4740}.swal-button--danger:active{background-color:#cf423b}.swal-button--danger:focus{box-shadow:0 0 0 1px #fff,0 0 0 3px rgba(165,43,43,.29)}.swal-content{padding:0 20px;margin-top:20px;font-size:medium}.swal-content:last-child{margin-bottom:20px}.swal-content__input,.swal-content__textarea{-webkit-appearance:none;background-color:#fff;border:none;font-size:14px;display:block;box-sizing:border-box;width:100%;border:1px solid rgba(0,0,0,.14);padding:10px 13px;border-radius:2px;transition:border-color .2s}.swal-content__input:focus,.swal-content__textarea:focus{outline:none;border-color:#6db8ff}.swal-content__textarea{resize:vertical}.swal-button--loading{color:transparent}.swal-button--loading~.swal-button__loader{opacity:1}.swal-button__loader{position:absolute;height:auto;width:43px;z-index:2;left:50%;top:50%;-webkit-transform:translateX(-50%) translateY(-50%);transform:translateX(-50%) translateY(-50%);text-align:center;pointer-events:none;opacity:0}.swal-button__loader div{display:inline-block;float:none;vertical-align:baseline;width:9px;height:9px;padding:0;border:none;margin:2px;opacity:.4;border-radius:7px;background-color:hsla(0,0%,100%,.9);transition:background .2s;-webkit-animation:swal-loading-anim 1s infinite;animation:swal-loading-anim 1s infinite}.swal-button__loader div:nth-child(3n+2){-webkit-animation-delay:.15s;animation-delay:.15s}.swal-button__loader div:nth-child(3n+3){-webkit-animation-delay:.3s;animation-delay:.3s}@-webkit-keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}@keyframes swal-loading-anim{0%{opacity:.4}20%{opacity:.4}50%{opacity:1}to{opacity:.4}}.swal-overlay{position:fixed;top:0;bottom:0;left:0;right:0;text-align:center;font-size:0;overflow-y:auto;background-color:rgba(0,0,0,.4);z-index:10000;pointer-events:none;opacity:0;transition:opacity .3s}.swal-overlay:before{content:" ";display:inline-block;vertical-align:middle;height:100%}.swal-overlay--show-modal{opacity:1;pointer-events:auto}.swal-overlay--show-modal .swal-modal{opacity:1;pointer-events:auto;box-sizing:border-box;-webkit-animation:showSweetAlert .3s;animation:showSweetAlert .3s;will-change:transform}.swal-modal{width:478px;opacity:0;pointer-events:none;background-color:#fff;text-align:center;border-radius:5px;position:static;margin:20px auto;display:inline-block;vertical-align:middle;-webkit-transform:scale(1);transform:scale(1);-webkit-transform-origin:50% 50%;transform-origin:50% 50%;z-index:10001;transition:opacity .2s,-webkit-transform .3s;transition:transform .3s,opacity .2s;transition:transform .3s,opacity .2s,-webkit-transform .3s}@media (max-width:500px){.swal-modal{width:calc(100% - 20px)}}@-webkit-keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}@keyframes showSweetAlert{0%{-webkit-transform:scale(1);transform:scale(1)}1%{-webkit-transform:scale(.5);transform:scale(.5)}45%{-webkit-transform:scale(1.05);transform:scale(1.05)}80%{-webkit-transform:scale(.95);transform:scale(.95)}to{-webkit-transform:scale(1);transform:scale(1)}}', ""]);
        }, function(t, e) {
          function n(t2, e2) {
            var n2 = t2[1] || "", r = t2[3];
            if (!r) return n2;
            if (e2 && "function" == typeof btoa) {
              var i = o(r);
              return [n2].concat(r.sources.map(function(t3) {
                return "/*# sourceURL=" + r.sourceRoot + t3 + " */";
              })).concat([i]).join("\n");
            }
            return [n2].join("\n");
          }
          function o(t2) {
            return "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(t2)))) + " */";
          }
          t.exports = function(t2) {
            var e2 = [];
            return e2.toString = function() {
              return this.map(function(e3) {
                var o2 = n(e3, t2);
                return e3[2] ? "@media " + e3[2] + "{" + o2 + "}" : o2;
              }).join("");
            }, e2.i = function(t3, n2) {
              "string" == typeof t3 && (t3 = [[null, t3, ""]]);
              for (var o2 = {}, r = 0; r < this.length; r++) {
                var i = this[r][0];
                "number" == typeof i && (o2[i] = true);
              }
              for (r = 0; r < t3.length; r++) {
                var a = t3[r];
                "number" == typeof a[0] && o2[a[0]] || (n2 && !a[2] ? a[2] = n2 : n2 && (a[2] = "(" + a[2] + ") and (" + n2 + ")"), e2.push(a));
              }
            }, e2;
          };
        }, function(t, e, n) {
          function o(t2, e2) {
            for (var n2 = 0; n2 < t2.length; n2++) {
              var o2 = t2[n2], r2 = m[o2.id];
              if (r2) {
                r2.refs++;
                for (var i2 = 0; i2 < r2.parts.length; i2++) r2.parts[i2](o2.parts[i2]);
                for (; i2 < o2.parts.length; i2++) r2.parts.push(u(o2.parts[i2], e2));
              } else {
                for (var a2 = [], i2 = 0; i2 < o2.parts.length; i2++) a2.push(u(o2.parts[i2], e2));
                m[o2.id] = { id: o2.id, refs: 1, parts: a2 };
              }
            }
          }
          function r(t2, e2) {
            for (var n2 = [], o2 = {}, r2 = 0; r2 < t2.length; r2++) {
              var i2 = t2[r2], a2 = e2.base ? i2[0] + e2.base : i2[0], s2 = i2[1], c2 = i2[2], l2 = i2[3], u2 = { css: s2, media: c2, sourceMap: l2 };
              o2[a2] ? o2[a2].parts.push(u2) : n2.push(o2[a2] = { id: a2, parts: [u2] });
            }
            return n2;
          }
          function i(t2, e2) {
            var n2 = v(t2.insertInto);
            if (!n2) throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
            var o2 = w[w.length - 1];
            if ("top" === t2.insertAt) o2 ? o2.nextSibling ? n2.insertBefore(e2, o2.nextSibling) : n2.appendChild(e2) : n2.insertBefore(e2, n2.firstChild), w.push(e2);
            else {
              if ("bottom" !== t2.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
              n2.appendChild(e2);
            }
          }
          function a(t2) {
            if (null === t2.parentNode) return false;
            t2.parentNode.removeChild(t2);
            var e2 = w.indexOf(t2);
            e2 >= 0 && w.splice(e2, 1);
          }
          function s(t2) {
            var e2 = document.createElement("style");
            return t2.attrs.type = "text/css", l(e2, t2.attrs), i(t2, e2), e2;
          }
          function c(t2) {
            var e2 = document.createElement("link");
            return t2.attrs.type = "text/css", t2.attrs.rel = "stylesheet", l(e2, t2.attrs), i(t2, e2), e2;
          }
          function l(t2, e2) {
            Object.keys(e2).forEach(function(n2) {
              t2.setAttribute(n2, e2[n2]);
            });
          }
          function u(t2, e2) {
            var n2, o2, r2, i2;
            if (e2.transform && t2.css) {
              if (!(i2 = e2.transform(t2.css))) return function() {
              };
              t2.css = i2;
            }
            if (e2.singleton) {
              var l2 = h++;
              n2 = g || (g = s(e2)), o2 = f.bind(null, n2, l2, false), r2 = f.bind(null, n2, l2, true);
            } else t2.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (n2 = c(e2), o2 = p.bind(null, n2, e2), r2 = function() {
              a(n2), n2.href && URL.revokeObjectURL(n2.href);
            }) : (n2 = s(e2), o2 = d.bind(null, n2), r2 = function() {
              a(n2);
            });
            return o2(t2), function(e3) {
              if (e3) {
                if (e3.css === t2.css && e3.media === t2.media && e3.sourceMap === t2.sourceMap) return;
                o2(t2 = e3);
              } else r2();
            };
          }
          function f(t2, e2, n2, o2) {
            var r2 = n2 ? "" : o2.css;
            if (t2.styleSheet) t2.styleSheet.cssText = x(e2, r2);
            else {
              var i2 = document.createTextNode(r2), a2 = t2.childNodes;
              a2[e2] && t2.removeChild(a2[e2]), a2.length ? t2.insertBefore(i2, a2[e2]) : t2.appendChild(i2);
            }
          }
          function d(t2, e2) {
            var n2 = e2.css, o2 = e2.media;
            if (o2 && t2.setAttribute("media", o2), t2.styleSheet) t2.styleSheet.cssText = n2;
            else {
              for (; t2.firstChild; ) t2.removeChild(t2.firstChild);
              t2.appendChild(document.createTextNode(n2));
            }
          }
          function p(t2, e2, n2) {
            var o2 = n2.css, r2 = n2.sourceMap, i2 = void 0 === e2.convertToAbsoluteUrls && r2;
            (e2.convertToAbsoluteUrls || i2) && (o2 = y(o2)), r2 && (o2 += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(r2)))) + " */");
            var a2 = new Blob([o2], { type: "text/css" }), s2 = t2.href;
            t2.href = URL.createObjectURL(a2), s2 && URL.revokeObjectURL(s2);
          }
          var m = {}, b = /* @__PURE__ */ function(t2) {
            var e2;
            return function() {
              return void 0 === e2 && (e2 = t2.apply(this, arguments)), e2;
            };
          }(function() {
            return window && document && document.all && !window.atob;
          }), v = /* @__PURE__ */ function(t2) {
            var e2 = {};
            return function(n2) {
              return void 0 === e2[n2] && (e2[n2] = t2.call(this, n2)), e2[n2];
            };
          }(function(t2) {
            return document.querySelector(t2);
          }), g = null, h = 0, w = [], y = n(15);
          t.exports = function(t2, e2) {
            if ("undefined" != typeof DEBUG && DEBUG && "object" != typeof document) throw new Error("The style-loader cannot be used in a non-browser environment");
            e2 = e2 || {}, e2.attrs = "object" == typeof e2.attrs ? e2.attrs : {}, e2.singleton || (e2.singleton = b()), e2.insertInto || (e2.insertInto = "head"), e2.insertAt || (e2.insertAt = "bottom");
            var n2 = r(t2, e2);
            return o(n2, e2), function(t3) {
              for (var i2 = [], a2 = 0; a2 < n2.length; a2++) {
                var s2 = n2[a2], c2 = m[s2.id];
                c2.refs--, i2.push(c2);
              }
              if (t3) {
                o(r(t3, e2), e2);
              }
              for (var a2 = 0; a2 < i2.length; a2++) {
                var c2 = i2[a2];
                if (0 === c2.refs) {
                  for (var l2 = 0; l2 < c2.parts.length; l2++) c2.parts[l2]();
                  delete m[c2.id];
                }
              }
            };
          };
          var x = /* @__PURE__ */ function() {
            var t2 = [];
            return function(e2, n2) {
              return t2[e2] = n2, t2.filter(Boolean).join("\n");
            };
          }();
        }, function(t, e) {
          t.exports = function(t2) {
            var e2 = "undefined" != typeof window && window.location;
            if (!e2) throw new Error("fixUrls requires window.location");
            if (!t2 || "string" != typeof t2) return t2;
            var n = e2.protocol + "//" + e2.host, o = n + e2.pathname.replace(/\/[^\/]*$/, "/");
            return t2.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(t3, e3) {
              var r = e3.trim().replace(/^"(.*)"$/, function(t4, e4) {
                return e4;
              }).replace(/^'(.*)'$/, function(t4, e4) {
                return e4;
              });
              if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(r)) return t3;
              var i;
              return i = 0 === r.indexOf("//") ? r : 0 === r.indexOf("/") ? n + r : o + r.replace(/^\.\//, ""), "url(" + JSON.stringify(i) + ")";
            });
          };
        }, function(t, e, n) {
          var o = n(17);
          "undefined" == typeof window || window.Promise || (window.Promise = o), n(21), String.prototype.includes || (String.prototype.includes = function(t2, e2) {
            return "number" != typeof e2 && (e2 = 0), !(e2 + t2.length > this.length) && -1 !== this.indexOf(t2, e2);
          }), Array.prototype.includes || Object.defineProperty(Array.prototype, "includes", { value: function(t2, e2) {
            if (null == this) throw new TypeError('"this" is null or not defined');
            var n2 = Object(this), o2 = n2.length >>> 0;
            if (0 === o2) return false;
            for (var r = 0 | e2, i = Math.max(r >= 0 ? r : o2 - Math.abs(r), 0); i < o2; ) {
              if (function(t3, e3) {
                return t3 === e3 || "number" == typeof t3 && "number" == typeof e3 && isNaN(t3) && isNaN(e3);
              }(n2[i], t2)) return true;
              i++;
            }
            return false;
          } }), "undefined" != typeof window && function(t2) {
            t2.forEach(function(t3) {
              t3.hasOwnProperty("remove") || Object.defineProperty(t3, "remove", { configurable: true, enumerable: true, writable: true, value: function() {
                this.parentNode.removeChild(this);
              } });
            });
          }([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
        }, function(t, e, n) {
          (function(e2) {
            !function(n2) {
              function o() {
              }
              function r(t2, e3) {
                return function() {
                  t2.apply(e3, arguments);
                };
              }
              function i(t2) {
                if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
                if ("function" != typeof t2) throw new TypeError("not a function");
                this._state = 0, this._handled = false, this._value = void 0, this._deferreds = [], f(t2, this);
              }
              function a(t2, e3) {
                for (; 3 === t2._state; ) t2 = t2._value;
                if (0 === t2._state) return void t2._deferreds.push(e3);
                t2._handled = true, i._immediateFn(function() {
                  var n3 = 1 === t2._state ? e3.onFulfilled : e3.onRejected;
                  if (null === n3) return void (1 === t2._state ? s : c)(e3.promise, t2._value);
                  var o2;
                  try {
                    o2 = n3(t2._value);
                  } catch (t3) {
                    return void c(e3.promise, t3);
                  }
                  s(e3.promise, o2);
                });
              }
              function s(t2, e3) {
                try {
                  if (e3 === t2) throw new TypeError("A promise cannot be resolved with itself.");
                  if (e3 && ("object" == typeof e3 || "function" == typeof e3)) {
                    var n3 = e3.then;
                    if (e3 instanceof i) return t2._state = 3, t2._value = e3, void l(t2);
                    if ("function" == typeof n3) return void f(r(n3, e3), t2);
                  }
                  t2._state = 1, t2._value = e3, l(t2);
                } catch (e4) {
                  c(t2, e4);
                }
              }
              function c(t2, e3) {
                t2._state = 2, t2._value = e3, l(t2);
              }
              function l(t2) {
                2 === t2._state && 0 === t2._deferreds.length && i._immediateFn(function() {
                  t2._handled || i._unhandledRejectionFn(t2._value);
                });
                for (var e3 = 0, n3 = t2._deferreds.length; e3 < n3; e3++) a(t2, t2._deferreds[e3]);
                t2._deferreds = null;
              }
              function u(t2, e3, n3) {
                this.onFulfilled = "function" == typeof t2 ? t2 : null, this.onRejected = "function" == typeof e3 ? e3 : null, this.promise = n3;
              }
              function f(t2, e3) {
                var n3 = false;
                try {
                  t2(function(t3) {
                    n3 || (n3 = true, s(e3, t3));
                  }, function(t3) {
                    n3 || (n3 = true, c(e3, t3));
                  });
                } catch (t3) {
                  if (n3) return;
                  n3 = true, c(e3, t3);
                }
              }
              var d = setTimeout;
              i.prototype.catch = function(t2) {
                return this.then(null, t2);
              }, i.prototype.then = function(t2, e3) {
                var n3 = new this.constructor(o);
                return a(this, new u(t2, e3, n3)), n3;
              }, i.all = function(t2) {
                var e3 = Array.prototype.slice.call(t2);
                return new i(function(t3, n3) {
                  function o2(i3, a2) {
                    try {
                      if (a2 && ("object" == typeof a2 || "function" == typeof a2)) {
                        var s2 = a2.then;
                        if ("function" == typeof s2) return void s2.call(a2, function(t4) {
                          o2(i3, t4);
                        }, n3);
                      }
                      e3[i3] = a2, 0 == --r2 && t3(e3);
                    } catch (t4) {
                      n3(t4);
                    }
                  }
                  if (0 === e3.length) return t3([]);
                  for (var r2 = e3.length, i2 = 0; i2 < e3.length; i2++) o2(i2, e3[i2]);
                });
              }, i.resolve = function(t2) {
                return t2 && "object" == typeof t2 && t2.constructor === i ? t2 : new i(function(e3) {
                  e3(t2);
                });
              }, i.reject = function(t2) {
                return new i(function(e3, n3) {
                  n3(t2);
                });
              }, i.race = function(t2) {
                return new i(function(e3, n3) {
                  for (var o2 = 0, r2 = t2.length; o2 < r2; o2++) t2[o2].then(e3, n3);
                });
              }, i._immediateFn = "function" == typeof e2 && function(t2) {
                e2(t2);
              } || function(t2) {
                d(t2, 0);
              }, i._unhandledRejectionFn = function(t2) {
                "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t2);
              }, i._setImmediateFn = function(t2) {
                i._immediateFn = t2;
              }, i._setUnhandledRejectionFn = function(t2) {
                i._unhandledRejectionFn = t2;
              }, void 0 !== t && t.exports ? t.exports = i : n2.Promise || (n2.Promise = i);
            }(this);
          }).call(e, n(18).setImmediate);
        }, function(t, e, n) {
          function o(t2, e2) {
            this._id = t2, this._clearFn = e2;
          }
          var r = Function.prototype.apply;
          e.setTimeout = function() {
            return new o(r.call(setTimeout, window, arguments), clearTimeout);
          }, e.setInterval = function() {
            return new o(r.call(setInterval, window, arguments), clearInterval);
          }, e.clearTimeout = e.clearInterval = function(t2) {
            t2 && t2.close();
          }, o.prototype.unref = o.prototype.ref = function() {
          }, o.prototype.close = function() {
            this._clearFn.call(window, this._id);
          }, e.enroll = function(t2, e2) {
            clearTimeout(t2._idleTimeoutId), t2._idleTimeout = e2;
          }, e.unenroll = function(t2) {
            clearTimeout(t2._idleTimeoutId), t2._idleTimeout = -1;
          }, e._unrefActive = e.active = function(t2) {
            clearTimeout(t2._idleTimeoutId);
            var e2 = t2._idleTimeout;
            e2 >= 0 && (t2._idleTimeoutId = setTimeout(function() {
              t2._onTimeout && t2._onTimeout();
            }, e2));
          }, n(19), e.setImmediate = setImmediate, e.clearImmediate = clearImmediate;
        }, function(t, e, n) {
          (function(t2, e2) {
            !function(t3, n2) {
              function o(t4) {
                "function" != typeof t4 && (t4 = new Function("" + t4));
                for (var e3 = new Array(arguments.length - 1), n3 = 0; n3 < e3.length; n3++) e3[n3] = arguments[n3 + 1];
                var o2 = { callback: t4, args: e3 };
                return l[c] = o2, s(c), c++;
              }
              function r(t4) {
                delete l[t4];
              }
              function i(t4) {
                var e3 = t4.callback, o2 = t4.args;
                switch (o2.length) {
                  case 0:
                    e3();
                    break;
                  case 1:
                    e3(o2[0]);
                    break;
                  case 2:
                    e3(o2[0], o2[1]);
                    break;
                  case 3:
                    e3(o2[0], o2[1], o2[2]);
                    break;
                  default:
                    e3.apply(n2, o2);
                }
              }
              function a(t4) {
                if (u) setTimeout(a, 0, t4);
                else {
                  var e3 = l[t4];
                  if (e3) {
                    u = true;
                    try {
                      i(e3);
                    } finally {
                      r(t4), u = false;
                    }
                  }
                }
              }
              if (!t3.setImmediate) {
                var s, c = 1, l = {}, u = false, f = t3.document, d = Object.getPrototypeOf && Object.getPrototypeOf(t3);
                d = d && d.setTimeout ? d : t3, "[object process]" === {}.toString.call(t3.process) ? function() {
                  s = function(t4) {
                    e2.nextTick(function() {
                      a(t4);
                    });
                  };
                }() : function() {
                  if (t3.postMessage && !t3.importScripts) {
                    var e3 = true, n3 = t3.onmessage;
                    return t3.onmessage = function() {
                      e3 = false;
                    }, t3.postMessage("", "*"), t3.onmessage = n3, e3;
                  }
                }() ? function() {
                  var e3 = "setImmediate$" + Math.random() + "$", n3 = function(n4) {
                    n4.source === t3 && "string" == typeof n4.data && 0 === n4.data.indexOf(e3) && a(+n4.data.slice(e3.length));
                  };
                  t3.addEventListener ? t3.addEventListener("message", n3, false) : t3.attachEvent("onmessage", n3), s = function(n4) {
                    t3.postMessage(e3 + n4, "*");
                  };
                }() : t3.MessageChannel ? function() {
                  var t4 = new MessageChannel();
                  t4.port1.onmessage = function(t5) {
                    a(t5.data);
                  }, s = function(e3) {
                    t4.port2.postMessage(e3);
                  };
                }() : f && "onreadystatechange" in f.createElement("script") ? function() {
                  var t4 = f.documentElement;
                  s = function(e3) {
                    var n3 = f.createElement("script");
                    n3.onreadystatechange = function() {
                      a(e3), n3.onreadystatechange = null, t4.removeChild(n3), n3 = null;
                    }, t4.appendChild(n3);
                  };
                }() : function() {
                  s = function(t4) {
                    setTimeout(a, 0, t4);
                  };
                }(), d.setImmediate = o, d.clearImmediate = r;
              }
            }("undefined" == typeof self ? void 0 === t2 ? this : t2 : self);
          }).call(e, n(7), n(20));
        }, function(t, e) {
          function n() {
            throw new Error("setTimeout has not been defined");
          }
          function o() {
            throw new Error("clearTimeout has not been defined");
          }
          function r(t2) {
            if (u === setTimeout) return setTimeout(t2, 0);
            if ((u === n || !u) && setTimeout) return u = setTimeout, setTimeout(t2, 0);
            try {
              return u(t2, 0);
            } catch (e2) {
              try {
                return u.call(null, t2, 0);
              } catch (e3) {
                return u.call(this, t2, 0);
              }
            }
          }
          function i(t2) {
            if (f === clearTimeout) return clearTimeout(t2);
            if ((f === o || !f) && clearTimeout) return f = clearTimeout, clearTimeout(t2);
            try {
              return f(t2);
            } catch (e2) {
              try {
                return f.call(null, t2);
              } catch (e3) {
                return f.call(this, t2);
              }
            }
          }
          function a() {
            b && p && (b = false, p.length ? m = p.concat(m) : v = -1, m.length && s());
          }
          function s() {
            if (!b) {
              var t2 = r(a);
              b = true;
              for (var e2 = m.length; e2; ) {
                for (p = m, m = []; ++v < e2; ) p && p[v].run();
                v = -1, e2 = m.length;
              }
              p = null, b = false, i(t2);
            }
          }
          function c(t2, e2) {
            this.fun = t2, this.array = e2;
          }
          function l() {
          }
          var u, f, d = t.exports = {};
          !function() {
            try {
              u = "function" == typeof setTimeout ? setTimeout : n;
            } catch (t2) {
              u = n;
            }
            try {
              f = "function" == typeof clearTimeout ? clearTimeout : o;
            } catch (t2) {
              f = o;
            }
          }();
          var p, m = [], b = false, v = -1;
          d.nextTick = function(t2) {
            var e2 = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var n2 = 1; n2 < arguments.length; n2++) e2[n2 - 1] = arguments[n2];
            m.push(new c(t2, e2)), 1 !== m.length || b || r(s);
          }, c.prototype.run = function() {
            this.fun.apply(null, this.array);
          }, d.title = "browser", d.browser = true, d.env = {}, d.argv = [], d.version = "", d.versions = {}, d.on = l, d.addListener = l, d.once = l, d.off = l, d.removeListener = l, d.removeAllListeners = l, d.emit = l, d.prependListener = l, d.prependOnceListener = l, d.listeners = function(t2) {
            return [];
          }, d.binding = function(t2) {
            throw new Error("process.binding is not supported");
          }, d.cwd = function() {
            return "/";
          }, d.chdir = function(t2) {
            throw new Error("process.chdir is not supported");
          }, d.umask = function() {
            return 0;
          };
        }, function(t, e, n) {
          n(22).polyfill();
        }, function(t, e, n) {
          function o(t2, e2) {
            if (void 0 === t2 || null === t2) throw new TypeError("Cannot convert first argument to object");
            for (var n2 = Object(t2), o2 = 1; o2 < arguments.length; o2++) {
              var r2 = arguments[o2];
              if (void 0 !== r2 && null !== r2) for (var i = Object.keys(Object(r2)), a = 0, s = i.length; a < s; a++) {
                var c = i[a], l = Object.getOwnPropertyDescriptor(r2, c);
                void 0 !== l && l.enumerable && (n2[c] = r2[c]);
              }
            }
            return n2;
          }
          function r() {
            Object.assign || Object.defineProperty(Object, "assign", { enumerable: false, configurable: true, writable: true, value: o });
          }
          t.exports = { assign: o, polyfill: r };
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(24), r = n(6), i = n(5), a = n(36), s = function() {
            for (var t2 = [], e2 = 0; e2 < arguments.length; e2++) t2[e2] = arguments[e2];
            if ("undefined" != typeof window) {
              var n2 = a.getOpts.apply(void 0, t2);
              return new Promise(function(t3, e3) {
                i.default.promise = { resolve: t3, reject: e3 }, o.default(n2), setTimeout(function() {
                  r.openModal();
                });
              });
            }
          };
          s.close = r.onAction, s.getState = r.getState, s.setActionValue = i.setActionValue, s.stopLoading = r.stopLoading, s.setDefaults = a.setDefaults, e.default = s;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(1), r = n(0), i = r.default.MODAL, a = n(4), s = n(34), c = n(35), l = n(1);
          e.init = function(t2) {
            o.getNode(i) || (document.body || l.throwErr("You can only use SweetAlert AFTER the DOM has loaded!"), s.default(), a.default()), a.initModalContent(t2), c.default(t2);
          }, e.default = e.init;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(0), r = o.default.MODAL;
          e.modalMarkup = '\n  <div class="' + r + '" role="dialog" aria-modal="true"></div>', e.default = e.modalMarkup;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(0), r = o.default.OVERLAY, i = '<div \n    class="' + r + '"\n    tabIndex="-1">\n  </div>';
          e.default = i;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(0), r = o.default.ICON;
          e.errorIconMarkup = function() {
            var t2 = r + "--error", e2 = t2 + "__line";
            return '\n    <div class="' + t2 + '__x-mark">\n      <span class="' + e2 + " " + e2 + '--left"></span>\n      <span class="' + e2 + " " + e2 + '--right"></span>\n    </div>\n  ';
          }, e.warningIconMarkup = function() {
            var t2 = r + "--warning";
            return '\n    <span class="' + t2 + '__body">\n      <span class="' + t2 + '__dot"></span>\n    </span>\n  ';
          }, e.successIconMarkup = function() {
            var t2 = r + "--success";
            return '\n    <span class="' + t2 + "__line " + t2 + '__line--long"></span>\n    <span class="' + t2 + "__line " + t2 + '__line--tip"></span>\n\n    <div class="' + t2 + '__ring"></div>\n    <div class="' + t2 + '__hide-corners"></div>\n  ';
          };
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(0), r = o.default.CONTENT;
          e.contentMarkup = '\n  <div class="' + r + '">\n\n  </div>\n';
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(0), r = o.default.BUTTON_CONTAINER, i = o.default.BUTTON, a = o.default.BUTTON_LOADER;
          e.buttonMarkup = '\n  <div class="' + r + '">\n\n    <button\n      class="' + i + '"\n    ></button>\n\n    <div class="' + a + '">\n      <div></div>\n      <div></div>\n      <div></div>\n    </div>\n\n  </div>\n';
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(4), r = n(2), i = n(0), a = i.default.ICON, s = i.default.ICON_CUSTOM, c = ["error", "warning", "success", "info"], l = { error: r.errorIconMarkup(), warning: r.warningIconMarkup(), success: r.successIconMarkup() }, u = function(t2, e2) {
            var n2 = a + "--" + t2;
            e2.classList.add(n2);
            var o2 = l[t2];
            o2 && (e2.innerHTML = o2);
          }, f = function(t2, e2) {
            e2.classList.add(s);
            var n2 = document.createElement("img");
            n2.src = t2, e2.appendChild(n2);
          }, d = function(t2) {
            if (t2) {
              var e2 = o.injectElIntoModal(r.iconMarkup);
              c.includes(t2) ? u(t2, e2) : f(t2, e2);
            }
          };
          e.default = d;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(2), r = n(4), i = function(t2) {
            navigator.userAgent.includes("AppleWebKit") && (t2.style.display = "none", t2.offsetHeight, t2.style.display = "");
          };
          e.initTitle = function(t2) {
            if (t2) {
              var e2 = r.injectElIntoModal(o.titleMarkup);
              e2.textContent = t2, i(e2);
            }
          }, e.initText = function(t2) {
            if (t2) {
              var e2 = document.createDocumentFragment();
              t2.split("\n").forEach(function(t3, n3, o2) {
                e2.appendChild(document.createTextNode(t3)), n3 < o2.length - 1 && e2.appendChild(document.createElement("br"));
              });
              var n2 = r.injectElIntoModal(o.textMarkup);
              n2.appendChild(e2), i(n2);
            }
          };
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(1), r = n(4), i = n(0), a = i.default.BUTTON, s = i.default.DANGER_BUTTON, c = n(3), l = n(2), u = n(6), f = n(5), d = function(t2, e2, n2) {
            var r2 = e2.text, i2 = e2.value, d2 = e2.className, p2 = e2.closeModal, m = o.stringToNode(l.buttonMarkup), b = m.querySelector("." + a), v = a + "--" + t2;
            if (b.classList.add(v), d2) {
              (Array.isArray(d2) ? d2 : d2.split(" ")).filter(function(t3) {
                return t3.length > 0;
              }).forEach(function(t3) {
                b.classList.add(t3);
              });
            }
            n2 && t2 === c.CONFIRM_KEY && b.classList.add(s), b.textContent = r2;
            var g = {};
            return g[t2] = i2, f.setActionValue(g), f.setActionOptionsFor(t2, { closeModal: p2 }), b.addEventListener("click", function() {
              return u.onAction(t2);
            }), m;
          }, p = function(t2, e2) {
            var n2 = r.injectElIntoModal(l.footerMarkup);
            for (var o2 in t2) {
              var i2 = t2[o2], a2 = d(o2, i2, e2);
              i2.visible && n2.appendChild(a2);
            }
            0 === n2.children.length && n2.remove();
          };
          e.default = p;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(3), r = n(4), i = n(2), a = n(5), s = n(6), c = n(0), l = c.default.CONTENT, u = function(t2) {
            t2.addEventListener("input", function(t3) {
              var e2 = t3.target, n2 = e2.value;
              a.setActionValue(n2);
            }), t2.addEventListener("keyup", function(t3) {
              if ("Enter" === t3.key) return s.onAction(o.CONFIRM_KEY);
            }), setTimeout(function() {
              t2.focus(), a.setActionValue("");
            }, 0);
          }, f = function(t2, e2, n2) {
            var o2 = document.createElement(e2), r2 = l + "__" + e2;
            o2.classList.add(r2);
            for (var i2 in n2) {
              var a2 = n2[i2];
              o2[i2] = a2;
            }
            "input" === e2 && u(o2), t2.appendChild(o2);
          }, d = function(t2) {
            if (t2) {
              var e2 = r.injectElIntoModal(i.contentMarkup), n2 = t2.element, o2 = t2.attributes;
              "string" == typeof n2 ? f(e2, n2, o2) : e2.appendChild(n2);
            }
          };
          e.default = d;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(1), r = n(2), i = function() {
            var t2 = o.stringToNode(r.overlayMarkup);
            document.body.appendChild(t2);
          };
          e.default = i;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(5), r = n(6), i = n(1), a = n(3), s = n(0), c = s.default.MODAL, l = s.default.BUTTON, u = s.default.OVERLAY, f = function(t2) {
            t2.preventDefault(), v();
          }, d = function(t2) {
            t2.preventDefault(), g();
          }, p = function(t2) {
            if (o.default.isOpen) switch (t2.key) {
              case "Escape":
                return r.onAction(a.CANCEL_KEY);
            }
          }, m = function(t2) {
            if (o.default.isOpen) switch (t2.key) {
              case "Tab":
                return f(t2);
            }
          }, b = function(t2) {
            if (o.default.isOpen) return "Tab" === t2.key && t2.shiftKey ? d(t2) : void 0;
          }, v = function() {
            var t2 = i.getNode(l);
            t2 && (t2.tabIndex = 0, t2.focus());
          }, g = function() {
            var t2 = i.getNode(c), e2 = t2.querySelectorAll("." + l), n2 = e2.length - 1, o2 = e2[n2];
            o2 && o2.focus();
          }, h = function(t2) {
            t2[t2.length - 1].addEventListener("keydown", m);
          }, w = function(t2) {
            t2[0].addEventListener("keydown", b);
          }, y = function() {
            var t2 = i.getNode(c), e2 = t2.querySelectorAll("." + l);
            e2.length && (h(e2), w(e2));
          }, x = function(t2) {
            if (i.getNode(u) === t2.target) return r.onAction(a.CANCEL_KEY);
          }, _ = function(t2) {
            var e2 = i.getNode(u);
            e2.removeEventListener("click", x), t2 && e2.addEventListener("click", x);
          }, k = function(t2) {
            o.default.timer && clearTimeout(o.default.timer), t2 && (o.default.timer = window.setTimeout(function() {
              return r.onAction(a.CANCEL_KEY);
            }, t2));
          }, O = function(t2) {
            t2.closeOnEsc ? document.addEventListener("keyup", p) : document.removeEventListener("keyup", p), t2.dangerMode ? v() : g(), y(), _(t2.closeOnClickOutside), k(t2.timer);
          };
          e.default = O;
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(1), r = n(3), i = n(37), a = n(38), s = { title: null, text: null, icon: null, buttons: r.defaultButtonList, content: null, className: null, closeOnClickOutside: true, closeOnEsc: true, dangerMode: false, timer: null }, c = Object.assign({}, s);
          e.setDefaults = function(t2) {
            c = Object.assign({}, s, t2);
          };
          var l = function(t2) {
            var e2 = t2.button, n2 = t2.buttons;
            return void 0 !== e2 && void 0 !== n2 && o.throwErr("Cannot set both 'button' and 'buttons' options!"), void 0 !== e2 ? { confirm: e2 } : n2;
          }, u = function(t2) {
            return o.ordinalSuffixOf(t2 + 1);
          }, f = function(t2, e2) {
            o.throwErr(u(e2) + " argument ('" + t2 + "') is invalid");
          }, d = function(t2, e2) {
            var n2 = t2 + 1, r2 = e2[n2];
            o.isPlainObject(r2) || void 0 === r2 || o.throwErr("Expected " + u(n2) + " argument ('" + r2 + "') to be a plain object");
          }, p = function(t2, e2) {
            var n2 = t2 + 1, r2 = e2[n2];
            void 0 !== r2 && o.throwErr("Unexpected " + u(n2) + " argument (" + r2 + ")");
          }, m = function(t2, e2, n2, r2) {
            var i2 = typeof e2, a2 = "string" === i2, s2 = e2 instanceof Element;
            if (a2) {
              if (0 === n2) return { text: e2 };
              if (1 === n2) return { text: e2, title: r2[0] };
              if (2 === n2) return d(n2, r2), { icon: e2 };
              f(e2, n2);
            } else {
              if (s2 && 0 === n2) return d(n2, r2), { content: e2 };
              if (o.isPlainObject(e2)) return p(n2, r2), e2;
              f(e2, n2);
            }
          };
          e.getOpts = function() {
            for (var t2 = [], e2 = 0; e2 < arguments.length; e2++) t2[e2] = arguments[e2];
            var n2 = {};
            t2.forEach(function(e3, o3) {
              var r2 = m(0, e3, o3, t2);
              Object.assign(n2, r2);
            });
            var o2 = l(n2);
            n2.buttons = r.getButtonListOpts(o2), delete n2.button, n2.content = i.getContentOpts(n2.content);
            var u2 = Object.assign({}, s, c, n2);
            return Object.keys(u2).forEach(function(t3) {
              a.DEPRECATED_OPTS[t3] && a.logDeprecation(t3);
            }), u2;
          };
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true });
          var o = n(1), r = { element: "input", attributes: { placeholder: "" } };
          e.getContentOpts = function(t2) {
            var e2 = {};
            return o.isPlainObject(t2) ? Object.assign(e2, t2) : t2 instanceof Element ? { element: t2 } : "input" === t2 ? r : null;
          };
        }, function(t, e, n) {
          Object.defineProperty(e, "__esModule", { value: true }), e.logDeprecation = function(t2) {
            var n2 = e.DEPRECATED_OPTS[t2], o = n2.onlyRename, r = n2.replacement, i = n2.subOption, a = n2.link, s = o ? "renamed" : "deprecated", c = 'SweetAlert warning: "' + t2 + '" option has been ' + s + ".";
            if (r) {
              c += " Please use" + (i ? ' "' + i + '" in ' : " ") + '"' + r + '" instead.';
            }
            var l = "https://sweetalert.js.org";
            c += a ? " More details: " + l + a : " More details: " + l + "/guides/#upgrading-from-1x", console.warn(c);
          }, e.DEPRECATED_OPTS = { type: { replacement: "icon", link: "/docs/#icon" }, imageUrl: { replacement: "icon", link: "/docs/#icon" }, customClass: { replacement: "className", onlyRename: true, link: "/docs/#classname" }, imageSize: {}, showCancelButton: { replacement: "buttons", link: "/docs/#buttons" }, showConfirmButton: { replacement: "button", link: "/docs/#button" }, confirmButtonText: { replacement: "button", link: "/docs/#button" }, confirmButtonColor: {}, cancelButtonText: { replacement: "buttons", link: "/docs/#buttons" }, closeOnConfirm: { replacement: "button", subOption: "closeModal", link: "/docs/#button" }, closeOnCancel: { replacement: "buttons", subOption: "closeModal", link: "/docs/#buttons" }, showLoaderOnConfirm: { replacement: "buttons" }, animation: {}, inputType: { replacement: "content", link: "/docs/#content" }, inputValue: { replacement: "content", link: "/docs/#content" }, inputPlaceholder: { replacement: "content", link: "/docs/#content" }, html: { replacement: "content", link: "/docs/#content" }, allowEscapeKey: { replacement: "closeOnEsc", onlyRename: true, link: "/docs/#closeonesc" }, allowClickOutside: { replacement: "closeOnClickOutside", onlyRename: true, link: "/docs/#closeonclickoutside" } };
        }]);
      });
    })(sweetalert_min$1);
    return sweetalert_min$1.exports;
  }
  var sweetalert_minExports = requireSweetalert_min();
  const Swal = /* @__PURE__ */ getDefaultExportFromCjs(sweetalert_minExports);
  const ID = "common-qr-code";
  const VERSION = "1.6.0";
  var ipRegex;
  var hasRequiredIpRegex;
  function requireIpRegex() {
    if (hasRequiredIpRegex) return ipRegex;
    hasRequiredIpRegex = 1;
    const word = "[a-fA-F\\d:]";
    const b = (options) => options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : "";
    const v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
    const v6seg = "[a-fA-F\\d]{1,4}";
    const v6 = `
(?:
(?:${v6seg}:){7}(?:${v6seg}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(?::${v6seg}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(?::${v6seg}){0,1}:${v4}|(?::${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(?::${v6seg}){0,2}:${v4}|(?::${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(?::${v6seg}){0,3}:${v4}|(?::${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(?::${v6seg}){0,4}:${v4}|(?::${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
    const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`);
    const v4exact = new RegExp(`^${v4}$`);
    const v6exact = new RegExp(`^${v6}$`);
    const ip = (options) => options && options.exact ? v46Exact : new RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, "g");
    ip.v4 = (options) => options && options.exact ? v4exact : new RegExp(`${b(options)}${v4}${b(options)}`, "g");
    ip.v6 = (options) => options && options.exact ? v6exact : new RegExp(`${b(options)}${v6}${b(options)}`, "g");
    ipRegex = ip;
    return ipRegex;
  }
  const require$$1 = JSON.parse('["aaa","aarp","abb","abbott","abbvie","abc","able","abogado","abudhabi","ac","academy","accenture","accountant","accountants","aco","actor","ad","ads","adult","ae","aeg","aero","aetna","af","afl","africa","ag","agakhan","agency","ai","aig","airbus","airforce","airtel","akdn","al","alibaba","alipay","allfinanz","allstate","ally","alsace","alstom","am","amazon","americanexpress","americanfamily","amex","amfam","amica","amsterdam","analytics","android","anquan","anz","ao","aol","apartments","app","apple","aq","aquarelle","ar","arab","aramco","archi","army","arpa","art","arte","as","asda","asia","associates","at","athleta","attorney","au","auction","audi","audible","audio","auspost","author","auto","autos","aw","aws","ax","axa","az","azure","ba","baby","baidu","banamex","band","bank","bar","barcelona","barclaycard","barclays","barefoot","bargains","baseball","basketball","bauhaus","bayern","bb","bbc","bbt","bbva","bcg","bcn","bd","be","beats","beauty","beer","bentley","berlin","best","bestbuy","bet","bf","bg","bh","bharti","bi","bible","bid","bike","bing","bingo","bio","biz","bj","black","blackfriday","blockbuster","blog","bloomberg","blue","bm","bms","bmw","bn","bnpparibas","bo","boats","boehringer","bofa","bom","bond","boo","book","booking","bosch","bostik","boston","bot","boutique","box","br","bradesco","bridgestone","broadway","broker","brother","brussels","bs","bt","build","builders","business","buy","buzz","bv","bw","by","bz","bzh","ca","cab","cafe","cal","call","calvinklein","cam","camera","camp","canon","capetown","capital","capitalone","car","caravan","cards","care","career","careers","cars","casa","case","cash","casino","cat","catering","catholic","cba","cbn","cbre","cc","cd","center","ceo","cern","cf","cfa","cfd","cg","ch","chanel","channel","charity","chase","chat","cheap","chintai","christmas","chrome","church","ci","cipriani","circle","cisco","citadel","citi","citic","city","ck","cl","claims","cleaning","click","clinic","clinique","clothing","cloud","club","clubmed","cm","cn","co","coach","codes","coffee","college","cologne","com","commbank","community","company","compare","computer","comsec","condos","construction","consulting","contact","contractors","cooking","cool","coop","corsica","country","coupon","coupons","courses","cpa","cr","credit","creditcard","creditunion","cricket","crown","crs","cruise","cruises","cu","cuisinella","cv","cw","cx","cy","cymru","cyou","cz","dad","dance","data","date","dating","datsun","day","dclk","dds","de","deal","dealer","deals","degree","delivery","dell","deloitte","delta","democrat","dental","dentist","desi","design","dev","dhl","diamonds","diet","digital","direct","directory","discount","discover","dish","diy","dj","dk","dm","dnp","do","docs","doctor","dog","domains","dot","download","drive","dtv","dubai","dunlop","dupont","durban","dvag","dvr","dz","earth","eat","ec","eco","edeka","edu","education","ee","eg","email","emerck","energy","engineer","engineering","enterprises","epson","equipment","er","ericsson","erni","es","esq","estate","et","eu","eurovision","eus","events","exchange","expert","exposed","express","extraspace","fage","fail","fairwinds","faith","family","fan","fans","farm","farmers","fashion","fast","fedex","feedback","ferrari","ferrero","fi","fidelity","fido","film","final","finance","financial","fire","firestone","firmdale","fish","fishing","fit","fitness","fj","fk","flickr","flights","flir","florist","flowers","fly","fm","fo","foo","food","football","ford","forex","forsale","forum","foundation","fox","fr","free","fresenius","frl","frogans","frontier","ftr","fujitsu","fun","fund","furniture","futbol","fyi","ga","gal","gallery","gallo","gallup","game","games","gap","garden","gay","gb","gbiz","gd","gdn","ge","gea","gent","genting","george","gf","gg","ggee","gh","gi","gift","gifts","gives","giving","gl","glass","gle","global","globo","gm","gmail","gmbh","gmo","gmx","gn","godaddy","gold","goldpoint","golf","goo","goodyear","goog","google","gop","got","gov","gp","gq","gr","grainger","graphics","gratis","green","gripe","grocery","group","gs","gt","gu","gucci","guge","guide","guitars","guru","gw","gy","hair","hamburg","hangout","haus","hbo","hdfc","hdfcbank","health","healthcare","help","helsinki","here","hermes","hiphop","hisamitsu","hitachi","hiv","hk","hkt","hm","hn","hockey","holdings","holiday","homedepot","homegoods","homes","homesense","honda","horse","hospital","host","hosting","hot","hotels","hotmail","house","how","hr","hsbc","ht","hu","hughes","hyatt","hyundai","ibm","icbc","ice","icu","id","ie","ieee","ifm","ikano","il","im","imamat","imdb","immo","immobilien","in","inc","industries","infiniti","info","ing","ink","institute","insurance","insure","int","international","intuit","investments","io","ipiranga","iq","ir","irish","is","ismaili","ist","istanbul","it","itau","itv","jaguar","java","jcb","je","jeep","jetzt","jewelry","jio","jll","jm","jmp","jnj","jo","jobs","joburg","jot","joy","jp","jpmorgan","jprs","juegos","juniper","kaufen","kddi","ke","kerryhotels","kerryproperties","kfh","kg","kh","ki","kia","kids","kim","kindle","kitchen","kiwi","km","kn","koeln","komatsu","kosher","kp","kpmg","kpn","kr","krd","kred","kuokgroup","kw","ky","kyoto","kz","la","lacaixa","lamborghini","lamer","lancaster","land","landrover","lanxess","lasalle","lat","latino","latrobe","law","lawyer","lb","lc","lds","lease","leclerc","lefrak","legal","lego","lexus","lgbt","li","lidl","life","lifeinsurance","lifestyle","lighting","like","lilly","limited","limo","lincoln","link","live","living","lk","llc","llp","loan","loans","locker","locus","lol","london","lotte","lotto","love","lpl","lplfinancial","lr","ls","lt","ltd","ltda","lu","lundbeck","luxe","luxury","lv","ly","ma","madrid","maif","maison","makeup","man","management","mango","map","market","marketing","markets","marriott","marshalls","mattel","mba","mc","mckinsey","md","me","med","media","meet","melbourne","meme","memorial","men","menu","merckmsd","mg","mh","miami","microsoft","mil","mini","mint","mit","mitsubishi","mk","ml","mlb","mls","mm","mma","mn","mo","mobi","mobile","moda","moe","moi","mom","monash","money","monster","mormon","mortgage","moscow","moto","motorcycles","mov","movie","mp","mq","mr","ms","msd","mt","mtn","mtr","mu","museum","music","mv","mw","mx","my","mz","na","nab","nagoya","name","navy","nba","nc","ne","nec","net","netbank","netflix","network","neustar","new","news","next","nextdirect","nexus","nf","nfl","ng","ngo","nhk","ni","nico","nike","nikon","ninja","nissan","nissay","nl","no","nokia","norton","now","nowruz","nowtv","np","nr","nra","nrw","ntt","nu","nyc","nz","obi","observer","office","okinawa","olayan","olayangroup","ollo","om","omega","one","ong","onl","online","ooo","open","oracle","orange","org","organic","origins","osaka","otsuka","ott","ovh","pa","page","panasonic","paris","pars","partners","parts","party","pay","pccw","pe","pet","pf","pfizer","pg","ph","pharmacy","phd","philips","phone","photo","photography","photos","physio","pics","pictet","pictures","pid","pin","ping","pink","pioneer","pizza","pk","pl","place","play","playstation","plumbing","plus","pm","pn","pnc","pohl","poker","politie","porn","post","pr","pramerica","praxi","press","prime","pro","prod","productions","prof","progressive","promo","properties","property","protection","pru","prudential","ps","pt","pub","pw","pwc","py","qa","qpon","quebec","quest","racing","radio","re","read","realestate","realtor","realty","recipes","red","redstone","redumbrella","rehab","reise","reisen","reit","reliance","ren","rent","rentals","repair","report","republican","rest","restaurant","review","reviews","rexroth","rich","richardli","ricoh","ril","rio","rip","ro","rocks","rodeo","rogers","room","rs","rsvp","ru","rugby","ruhr","run","rw","rwe","ryukyu","sa","saarland","safe","safety","sakura","sale","salon","samsclub","samsung","sandvik","sandvikcoromant","sanofi","sap","sarl","sas","save","saxo","sb","sbi","sbs","sc","scb","schaeffler","schmidt","scholarships","school","schule","schwarz","science","scot","sd","se","search","seat","secure","security","seek","select","sener","services","seven","sew","sex","sexy","sfr","sg","sh","shangrila","sharp","shell","shia","shiksha","shoes","shop","shopping","shouji","show","si","silk","sina","singles","site","sj","sk","ski","skin","sky","skype","sl","sling","sm","smart","smile","sn","sncf","so","soccer","social","softbank","software","sohu","solar","solutions","song","sony","soy","spa","space","sport","spot","sr","srl","ss","st","stada","staples","star","statebank","statefarm","stc","stcgroup","stockholm","storage","store","stream","studio","study","style","su","sucks","supplies","supply","support","surf","surgery","suzuki","sv","swatch","swiss","sx","sy","sydney","systems","sz","tab","taipei","talk","taobao","target","tatamotors","tatar","tattoo","tax","taxi","tc","tci","td","tdk","team","tech","technology","tel","temasek","tennis","teva","tf","tg","th","thd","theater","theatre","tiaa","tickets","tienda","tips","tires","tirol","tj","tjmaxx","tjx","tk","tkmaxx","tl","tm","tmall","tn","to","today","tokyo","tools","top","toray","toshiba","total","tours","town","toyota","toys","tr","trade","trading","training","travel","travelers","travelersinsurance","trust","trv","tt","tube","tui","tunes","tushu","tv","tvs","tw","tz","ua","ubank","ubs","ug","uk","unicom","university","uno","uol","ups","us","uy","uz","va","vacations","vana","vanguard","vc","ve","vegas","ventures","verisign","vermögensberater","vermögensberatung","versicherung","vet","vg","vi","viajes","video","vig","viking","villas","vin","vip","virgin","visa","vision","viva","vivo","vlaanderen","vn","vodka","volvo","vote","voting","voto","voyage","vu","wales","walmart","walter","wang","wanggou","watch","watches","weather","weatherchannel","webcam","weber","website","wed","wedding","weibo","weir","wf","whoswho","wien","wiki","williamhill","win","windows","wine","winners","wme","wolterskluwer","woodside","work","works","world","wow","ws","wtc","wtf","xbox","xerox","xihuan","xin","xxx","xyz","yachts","yahoo","yamaxun","yandex","ye","yodobashi","yoga","yokohama","you","youtube","yt","yun","za","zappos","zara","zero","zip","zm","zone","zuerich","zw","ελ","ευ","бг","бел","дети","ею","католик","ком","мкд","мон","москва","онлайн","орг","рус","рф","сайт","срб","укр","қаз","հայ","ישראל","קום","ابوظبي","ارامكو","الاردن","البحرين","الجزائر","السعودية","العليان","المغرب","امارات","ایران","بارت","بازار","بيتك","بھارت","تونس","سودان","سورية","شبكة","عراق","عرب","عمان","فلسطين","قطر","كاثوليك","كوم","مصر","مليسيا","موريتانيا","موقع","همراه","پاکستان","ڀارت","कॉम","नेट","भारत","भारतम्","भारोत","संगठन","বাংলা","ভারত","ভাৰত","ਭਾਰਤ","ભારત","ଭାରତ","இந்தியா","இலங்கை","சிங்கப்பூர்","భారత్","ಭಾರತ","ഭാരതം","ලංකා","คอม","ไทย","ລາວ","გე","みんな","アマゾン","クラウド","グーグル","コム","ストア","セール","ファッション","ポイント","世界","中信","中国","中國","中文网","亚马逊","企业","佛山","信息","健康","八卦","公司","公益","台湾","台灣","商城","商店","商标","嘉里","嘉里大酒店","在线","大拿","天主教","娱乐","家電","广东","微博","慈善","我爱你","手机","招聘","政务","政府","新加坡","新闻","时尚","書籍","机构","淡马锡","游戏","澳門","点看","移动","组织机构","网址","网店","网站","网络","联通","谷歌","购物","通販","集团","電訊盈科","飞利浦","食品","餐厅","香格里拉","香港","닷넷","닷컴","삼성","한국"]');
  const __viteBrowserExternal = {};
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$2 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  var lib;
  var hasRequiredLib;
  function requireLib() {
    if (hasRequiredLib) return lib;
    hasRequiredLib = 1;
    const ipRegex2 = requireIpRegex();
    const tlds = require$$1;
    const ipv4 = ipRegex2.v4().source;
    const ipv6 = ipRegex2.v6().source;
    const host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
    const domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
    const strictTld = "(?:[a-z\\u00a1-\\uffff]{2,})";
    const defaultTlds = `(?:${tlds.sort((a, b) => b.length - a.length).join("|")})`;
    const port = "(?::\\d{2,5})?";
    let RE2;
    let hasRE2;
    lib = (options) => {
      options = {
        //
        // attempt to use re2, if set to false will use RegExp
        // (we did this approach because we don't want to load in-memory re2 if users don't want it)
        // <https://github.com/spamscanner/url-regex-safe/issues/28>
        //
        re2: true,
        exact: false,
        strict: false,
        auth: false,
        localhost: true,
        parens: false,
        apostrophes: false,
        trailingPeriod: false,
        ipv4: true,
        ipv6: true,
        returnString: false,
        ...options
      };
      const SafeRegExp = options.re2 && hasRE2 !== false ? (() => {
        if (typeof RE2 === "function") return RE2;
        try {
          RE2 = require$$2;
          return typeof RE2 === "function" ? RE2 : RegExp;
        } catch {
          hasRE2 = false;
          return RegExp;
        }
      })() : RegExp;
      const protocol = `(?:(?:[a-z]+:)?//)${options.strict ? "" : "?"}`;
      const auth = options.auth ? "(?:\\S+(?::\\S*)?@)?" : "";
      const tld = `(?:\\.${options.strict ? strictTld : options.tlds ? `(?:${options.tlds.sort((a, b) => b.length - a.length).join("|")})` : defaultTlds})${options.trailingPeriod ? "\\.?" : ""}`;
      let disallowedChars = '\\s"';
      if (!options.parens) {
        disallowedChars += "\\)";
      }
      if (!options.apostrophes) {
        disallowedChars += "'";
      }
      const path = options.trailingPeriod ? `(?:[/?#][^${disallowedChars}]*)?` : `(?:(?:[/?#][^${disallowedChars}]*[^${disallowedChars}.?!])|[/])?`;
      let regex2 = `(?:${protocol}|www\\.)${auth}(?:`;
      if (options.localhost) regex2 += "localhost|";
      if (options.ipv4) regex2 += `${ipv4}|`;
      if (options.ipv6) regex2 += `${ipv6}|`;
      regex2 += `${host}${domain}${tld})${port}${path}`;
      if (options.returnString) return regex2;
      return options.exact ? new SafeRegExp(`(?:^${regex2}$)`, "i") : new SafeRegExp(regex2, "ig");
    };
    return lib;
  }
  var libExports = requireLib();
  const urlRegex = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
  const DATA_URL_DEFAULT_MIME_TYPE = "text/plain";
  const DATA_URL_DEFAULT_CHARSET = "us-ascii";
  const testParameter = (name, filters) => filters.some((filter) => filter instanceof RegExp ? filter.test(name) : filter === name);
  const supportedProtocols = /* @__PURE__ */ new Set([
    "https:",
    "http:",
    "file:"
  ]);
  const hasCustomProtocol = (urlString) => {
    try {
      const { protocol } = new URL(urlString);
      return protocol.endsWith(":") && !protocol.includes(".") && !supportedProtocols.has(protocol);
    } catch {
      return false;
    }
  };
  const normalizeDataURL = (urlString, { stripHash }) => {
    var _a;
    const match = /^data:(?<type>[^,]*?),(?<data>[^#]*?)(?:#(?<hash>.*))?$/.exec(urlString);
    if (!match) {
      throw new Error(`Invalid URL: ${urlString}`);
    }
    let { type, data, hash } = match.groups;
    const mediaType = type.split(";");
    hash = stripHash ? "" : hash;
    let isBase64 = false;
    if (mediaType[mediaType.length - 1] === "base64") {
      mediaType.pop();
      isBase64 = true;
    }
    const mimeType = ((_a = mediaType.shift()) == null ? void 0 : _a.toLowerCase()) ?? "";
    const attributes = mediaType.map((attribute) => {
      let [key, value = ""] = attribute.split("=").map((string) => string.trim());
      if (key === "charset") {
        value = value.toLowerCase();
        if (value === DATA_URL_DEFAULT_CHARSET) {
          return "";
        }
      }
      return `${key}${value ? `=${value}` : ""}`;
    }).filter(Boolean);
    const normalizedMediaType = [
      ...attributes
    ];
    if (isBase64) {
      normalizedMediaType.push("base64");
    }
    if (normalizedMediaType.length > 0 || mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE) {
      normalizedMediaType.unshift(mimeType);
    }
    return `data:${normalizedMediaType.join(";")},${isBase64 ? data.trim() : data}${hash ? `#${hash}` : ""}`;
  };
  function normalizeUrl(urlString, options) {
    options = {
      defaultProtocol: "http",
      normalizeProtocol: true,
      forceHttp: false,
      forceHttps: false,
      stripAuthentication: true,
      stripHash: false,
      stripTextFragment: true,
      stripWWW: true,
      removeQueryParameters: [/^utm_\w+/i],
      removeTrailingSlash: true,
      removeSingleSlash: true,
      removeDirectoryIndex: false,
      removeExplicitPort: false,
      sortQueryParameters: true,
      ...options
    };
    if (typeof options.defaultProtocol === "string" && !options.defaultProtocol.endsWith(":")) {
      options.defaultProtocol = `${options.defaultProtocol}:`;
    }
    urlString = urlString.trim();
    if (/^data:/i.test(urlString)) {
      return normalizeDataURL(urlString, options);
    }
    if (hasCustomProtocol(urlString)) {
      return urlString;
    }
    const hasRelativeProtocol = urlString.startsWith("//");
    const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);
    if (!isRelativeUrl) {
      urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
    }
    const urlObject = new URL(urlString);
    if (options.forceHttp && options.forceHttps) {
      throw new Error("The `forceHttp` and `forceHttps` options cannot be used together");
    }
    if (options.forceHttp && urlObject.protocol === "https:") {
      urlObject.protocol = "http:";
    }
    if (options.forceHttps && urlObject.protocol === "http:") {
      urlObject.protocol = "https:";
    }
    if (options.stripAuthentication) {
      urlObject.username = "";
      urlObject.password = "";
    }
    if (options.stripHash) {
      urlObject.hash = "";
    } else if (options.stripTextFragment) {
      urlObject.hash = urlObject.hash.replace(/#?:~:text.*?$/i, "");
    }
    if (urlObject.pathname) {
      const protocolRegex = /\b[a-z][a-z\d+\-.]{1,50}:\/\//g;
      let lastIndex = 0;
      let result = "";
      for (; ; ) {
        const match = protocolRegex.exec(urlObject.pathname);
        if (!match) {
          break;
        }
        const protocol = match[0];
        const protocolAtIndex = match.index;
        const intermediate = urlObject.pathname.slice(lastIndex, protocolAtIndex);
        result += intermediate.replace(/\/{2,}/g, "/");
        result += protocol;
        lastIndex = protocolAtIndex + protocol.length;
      }
      const remnant = urlObject.pathname.slice(lastIndex, urlObject.pathname.length);
      result += remnant.replace(/\/{2,}/g, "/");
      urlObject.pathname = result;
    }
    if (urlObject.pathname) {
      try {
        urlObject.pathname = decodeURI(urlObject.pathname);
      } catch {
      }
    }
    if (options.removeDirectoryIndex === true) {
      options.removeDirectoryIndex = [/^index\.[a-z]+$/];
    }
    if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
      let pathComponents = urlObject.pathname.split("/");
      const lastComponent = pathComponents[pathComponents.length - 1];
      if (testParameter(lastComponent, options.removeDirectoryIndex)) {
        pathComponents = pathComponents.slice(0, -1);
        urlObject.pathname = pathComponents.slice(1).join("/") + "/";
      }
    }
    if (urlObject.hostname) {
      urlObject.hostname = urlObject.hostname.replace(/\.$/, "");
      if (options.stripWWW && /^www\.(?!www\.)[a-z\-\d]{1,63}\.[a-z.\-\d]{2,63}$/.test(urlObject.hostname)) {
        urlObject.hostname = urlObject.hostname.replace(/^www\./, "");
      }
    }
    if (Array.isArray(options.removeQueryParameters)) {
      for (const key of [...urlObject.searchParams.keys()]) {
        if (testParameter(key, options.removeQueryParameters)) {
          urlObject.searchParams.delete(key);
        }
      }
    }
    if (!Array.isArray(options.keepQueryParameters) && options.removeQueryParameters === true) {
      urlObject.search = "";
    }
    if (Array.isArray(options.keepQueryParameters) && options.keepQueryParameters.length > 0) {
      for (const key of [...urlObject.searchParams.keys()]) {
        if (!testParameter(key, options.keepQueryParameters)) {
          urlObject.searchParams.delete(key);
        }
      }
    }
    if (options.sortQueryParameters) {
      urlObject.searchParams.sort();
      try {
        urlObject.search = decodeURIComponent(urlObject.search);
      } catch {
      }
    }
    if (options.removeTrailingSlash) {
      urlObject.pathname = urlObject.pathname.replace(/\/$/, "");
    }
    if (options.removeExplicitPort && urlObject.port) {
      urlObject.port = "";
    }
    const oldUrlString = urlString;
    urlString = urlObject.toString();
    if (!options.removeSingleSlash && urlObject.pathname === "/" && !oldUrlString.endsWith("/") && urlObject.hash === "") {
      urlString = urlString.replace(/\/$/, "");
    }
    if ((options.removeTrailingSlash || urlObject.pathname === "/") && urlObject.hash === "" && options.removeSingleSlash) {
      urlString = urlString.replace(/\/$/, "");
    }
    if (hasRelativeProtocol && !options.normalizeProtocol) {
      urlString = urlString.replace(/^http:\/\//, "//");
    }
    if (options.stripProtocol) {
      urlString = urlString.replace(/^(?:https?:)?\/\//, "");
    }
    return urlString;
  }
  function functionTimeout(function_) {
    const wrappedFunction = (...arguments_) => function_(...arguments_);
    Object.defineProperty(wrappedFunction, "name", {
      value: `functionTimeout(${function_.name || "<anonymous>"})`,
      configurable: true
    });
    return wrappedFunction;
  }
  function timeSpan() {
    const start = performance.now();
    const end = () => performance.now() - start;
    end.rounded = () => Math.round(end());
    end.seconds = () => end() / 1e3;
    end.nanoseconds = () => end() * 1e6;
    return end;
  }
  const { toString } = Object.prototype;
  function isRegexp(value) {
    return toString.call(value) === "[object RegExp]";
  }
  const flagMap = {
    global: "g",
    ignoreCase: "i",
    multiline: "m",
    dotAll: "s",
    sticky: "y",
    unicode: "u"
  };
  function clonedRegexp(regexp, options = {}) {
    if (!isRegexp(regexp)) {
      throw new TypeError("Expected a RegExp instance");
    }
    const flags = Object.keys(flagMap).map((flag) => (typeof options[flag] === "boolean" ? options[flag] : regexp[flag]) ? flagMap[flag] : "").join("");
    const clonedRegexp2 = new RegExp(options.source || regexp.source, flags);
    clonedRegexp2.lastIndex = typeof options.lastIndex === "number" ? options.lastIndex : regexp.lastIndex;
    return clonedRegexp2;
  }
  const resultToMatch = (result) => ({
    match: result[0],
    index: result.index,
    groups: result.slice(1),
    namedGroups: result.groups ?? {},
    input: result.input
  });
  function isMatch(regex2, string, { timeout } = {}) {
    try {
      return functionTimeout(() => clonedRegexp(regex2).test(string), { timeout })();
    } catch (error) {
      throw error;
    }
  }
  function matches(regex2, string, { timeout = Number.POSITIVE_INFINITY, matchTimeout = Number.POSITIVE_INFINITY } = {}) {
    if (!regex2.global) {
      throw new Error("The regex must have the global flag, otherwise, use `firstMatch()` instead");
    }
    return {
      *[Symbol.iterator]() {
        try {
          const matches2 = string.matchAll(regex2);
          while (true) {
            const nextMatch = functionTimeout(() => matches2.next(), { timeout: timeout !== Number.POSITIVE_INFINITY || matchTimeout !== Number.POSITIVE_INFINITY ? Math.min(timeout, matchTimeout) : void 0 });
            const end = timeSpan();
            const { value, done } = nextMatch();
            timeout -= Math.ceil(end());
            if (done) {
              break;
            }
            yield resultToMatch(value);
          }
        } catch (error) {
          {
            throw error;
          }
        }
      }
    };
  }
  const getUrlsFromQueryParameters = (url) => {
    const returnValue = /* @__PURE__ */ new Set();
    const { searchParams } = new URL(url.replace(/^(?:\/\/|(?:www\.))/i, "http://$2"));
    for (const [, value] of searchParams) {
      if (isMatch(urlRegex({ exact: true }), value, { timeout: 500 })) {
        returnValue.add(value);
      }
    }
    return returnValue;
  };
  function getUrls(text, options = {}) {
    if (typeof text !== "string") {
      throw new TypeError(`The \`text\` argument should be a string, got ${typeof text}`);
    }
    if (options.exclude !== void 0 && !Array.isArray(options.exclude)) {
      throw new TypeError("The `exclude` option must be an array");
    }
    const returnValue = /* @__PURE__ */ new Set();
    const add = (url) => {
      try {
        returnValue.add(normalizeUrl(url.trim().replace(/\.+$/, ""), options));
      } catch {
      }
    };
    const results = matches(
      urlRegex(options.requireSchemeOrWww === void 0 ? void 0 : {
        re2: false,
        strict: options.requireSchemeOrWww,
        parens: true
      }),
      text,
      {
        matchTimeout: 500
      }
    );
    for (const { match: url } of results) {
      add(url);
      if (options.extractFromQueryString) {
        const queryStringUrls = getUrlsFromQueryParameters(url);
        for (const queryStringUrl of queryStringUrls) {
          add(queryStringUrl);
        }
      }
    }
    for (const excludedItem of options.exclude ?? []) {
      const regex2 = new RegExp(excludedItem);
      for (const item of returnValue) {
        if (isMatch(regex2, item, { timeout: 500 })) {
          returnValue.delete(item);
        }
      }
    }
    return returnValue;
  }
  async function decodeQrCode(target2) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const results = [];
        const { width, height } = image;
        const canvas2 = new OffscreenCanvas(width, height);
        const context = canvas2.getContext("2d");
        context.drawImage(image, 0, 0);
        while (true) {
          const imageData = context.getImageData(0, 0, width, height);
          const code = jsQR(imageData.data, width, height);
          if (!code) {
            break;
          }
          const result = code.data.replace(/^\s+|\s+$/g, "");
          context.fillStyle = "white";
          context.beginPath();
          const { topLeftCorner, topRightCorner, bottomRightCorner, bottomLeftCorner } = code.location;
          context.moveTo(topLeftCorner.x, topLeftCorner.y);
          context.lineTo(topRightCorner.x, topRightCorner.y);
          context.lineTo(bottomRightCorner.x, bottomRightCorner.y);
          context.lineTo(bottomLeftCorner.x, bottomLeftCorner.y);
          context.lineTo(topLeftCorner.x, topLeftCorner.y);
          context.fill();
          context.closePath();
          results.push(result);
        }
        resolve(results);
      };
      image.onerror = reject;
      if (target2 instanceof HTMLImageElement || target2 instanceof URL) {
        _GM_xmlhttpRequest({
          method: "GET",
          url: target2 instanceof URL ? target2.toString() : target2.src,
          responseType: "blob",
          onload: (response) => {
            if (response.status !== 200) {
              reject(new Error(`Failed to load image: ${response.status} ${response.statusText}`));
              return;
            }
            image.src = URL.createObjectURL(response.response);
          },
          onerror: reject
        });
      } else if (target2 instanceof HTMLCanvasElement) {
        image.src = target2.toDataURL();
      }
    });
  }
  function tryGetUrls(text) {
    return Array.from(getUrls(text)).map((url) => new URL(url));
  }
  function isUrl(url) {
    return /^https?:\/\//.test(url.trimStart());
  }
  console.log(`${ID}(v${VERSION})`);
  let target = null;
  let selection = null;
  function handleDecodeQrCodeMenuClick() {
    if (selection !== null) {
      const urls = tryGetUrls(selection);
      if (urls.length === 0) {
        return notiflixNotifyAio.Notify.warning("选择的文本中未找到有效的链接, 请确认文本是否有效");
      }
      target = urls[0];
    }
    if (target === null) {
      return notiflixNotifyAio.Notify.warning("未选择图片或图片链接, 请先右键选择图片或图片链接");
    }
    decodeQrCode(target).then((results) => {
      if (results.length === 0) {
        return notiflixNotifyAio.Notify.warning("未识别到二维码, 请确认图片是否有效");
      }
      const isMultiple = results.length > 1;
      const element = document.createElement("div");
      for (const [index, result] of results.entries()) {
        const resultButton = document.createElement("button");
        resultButton.innerHTML = result;
        resultButton.style.fontSize = "16px";
        resultButton.style.maxHeight = "200px";
        resultButton.style.overflowY = "auto";
        resultButton.style.width = "100%";
        resultButton.className = "swal-button swal-button--cancel";
        if (index > 0) {
          resultButton.style.marginTop = "10px";
        }
        resultButton.dataset.result = result;
        if (isUrl(result)) {
          const div = document.createElement("div");
          div.style.display = "flex";
          const a = document.createElement("a");
          a.href = result;
          a.target = "_blank";
          a.textContent = "跳转";
          a.style.marginLeft = "10px";
          a.style.fontSize = "14px";
          a.style.flexShrink = "0";
          a.style.display = "inline-flex";
          a.style.alignItems = "center";
          a.style.justifyContent = "center";
          a.className = "swal-button swal-button--cancel";
          div.appendChild(resultButton);
          div.appendChild(a);
          element.appendChild(div);
        } else {
          element.appendChild(resultButton);
        }
      }
      element.addEventListener("click", (event) => {
        if (event.target instanceof HTMLButtonElement && event.target.dataset.result) {
          _GM_setClipboard(event.target.dataset.result, "text");
          notiflixNotifyAio.Notify.success("已复制到剪贴板");
          Swal.close();
        }
      });
      Swal({
        icon: "success",
        title: "识别成功",
        text: isMultiple ? "识别到多个二维码, 点击文本内容可单独复制" : void 0,
        content: {
          element
        },
        buttons: {
          confirm: {
            text: isMultiple ? "全部复制到剪贴板" : "复制到剪贴板",
            value: "copy"
          }
        }
      }).then((result) => {
        if (result === "copy") {
          _GM_setClipboard(results.join("\n"), "text");
          notiflixNotifyAio.Notify.success("已复制到剪贴板");
        }
      });
    }).catch((error) => {
      notiflixNotifyAio.Notify.failure("识别失败, 请检查图片是否有效");
      console.error(error);
    }).finally(() => target = null);
  }
  async function handleEncodeQrCodeMenuClick() {
    if (selection === null) {
      return notiflixNotifyAio.Notify.warning("未选择文字, 请先右键选择文字");
    }
    const dataUrl = await QRCode.toDataURL(selection);
    const element = document.createElement("img");
    element.src = dataUrl;
    element.style.margin = "0 auto";
    Swal({
      icon: "success",
      title: "生成二维码成功",
      content: {
        element
      },
      buttons: {
        confirm: {
          text: "保存到本地",
          value: "save"
        }
      }
    }).then((result) => {
      if (result === "save") {
        _GM_download({ name: "qrcode.png", url: dataUrl, saveAs: true });
      }
    }).finally(() => selection = null);
  }
  _GM_registerMenuCommand("Decode QR Code", handleDecodeQrCodeMenuClick);
  _GM_registerMenuCommand("Encode QR Code", handleEncodeQrCodeMenuClick);
  document.addEventListener("contextmenu", (event) => {
    if (event.target instanceof HTMLImageElement || event.target instanceof HTMLCanvasElement) {
      target = event.target;
    }
  });
  document.addEventListener("selectionchange", () => {
    var _a;
    selection = ((_a = document.getSelection()) == null ? void 0 : _a.toString()) || null;
  });

})(Notiflix, jsQR);