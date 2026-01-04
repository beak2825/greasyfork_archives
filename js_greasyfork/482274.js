// ==UserScript==
// @name         timetable2lua
// @namespace    https://dvxg.de/
// @version      0.1.3
// @author       davidxuang
// @description  Export timetable data as lua table.
// @license      AGPL-3.0-only
// @icon         https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji/assets/Metro/3D/metro_3d.png
// @homepage     https://github.com/davidxuang/timetable2lua
// @homepageURL  https://github.com/davidxuang/timetable2lua
// @match        https://www.cqmetro.cn/smbsj.html
// @downloadURL https://update.greasyfork.org/scripts/482274/timetable2lua.user.js
// @updateURL https://update.greasyfork.org/scripts/482274/timetable2lua.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  var wcwidth$3 = { exports: {} };
  var clone$1 = { exports: {} };
  (function(module) {
    var clone2 = function() {
      function clone3(parent, circular, depth, prototype) {
        if (typeof circular === "object") {
          depth = circular.depth;
          prototype = circular.prototype;
          circular.filter;
          circular = circular.circular;
        }
        var allParents = [];
        var allChildren = [];
        var useBuffer = typeof Buffer != "undefined";
        if (typeof circular == "undefined")
          circular = true;
        if (typeof depth == "undefined")
          depth = Infinity;
        function _clone(parent2, depth2) {
          if (parent2 === null)
            return null;
          if (depth2 == 0)
            return parent2;
          var child;
          var proto;
          if (typeof parent2 != "object") {
            return parent2;
          }
          if (clone3.__isArray(parent2)) {
            child = [];
          } else if (clone3.__isRegExp(parent2)) {
            child = new RegExp(parent2.source, __getRegExpFlags(parent2));
            if (parent2.lastIndex)
              child.lastIndex = parent2.lastIndex;
          } else if (clone3.__isDate(parent2)) {
            child = new Date(parent2.getTime());
          } else if (useBuffer && Buffer.isBuffer(parent2)) {
            if (Buffer.allocUnsafe) {
              child = Buffer.allocUnsafe(parent2.length);
            } else {
              child = new Buffer(parent2.length);
            }
            parent2.copy(child);
            return child;
          } else {
            if (typeof prototype == "undefined") {
              proto = Object.getPrototypeOf(parent2);
              child = Object.create(proto);
            } else {
              child = Object.create(prototype);
              proto = prototype;
            }
          }
          if (circular) {
            var index = allParents.indexOf(parent2);
            if (index != -1) {
              return allChildren[index];
            }
            allParents.push(parent2);
            allChildren.push(child);
          }
          for (var i in parent2) {
            var attrs;
            if (proto) {
              attrs = Object.getOwnPropertyDescriptor(proto, i);
            }
            if (attrs && attrs.set == null) {
              continue;
            }
            child[i] = _clone(parent2[i], depth2 - 1);
          }
          return child;
        }
        return _clone(parent, depth);
      }
      clone3.clonePrototype = function clonePrototype(parent) {
        if (parent === null)
          return null;
        var c = function() {
        };
        c.prototype = parent;
        return new c();
      };
      function __objToStr(o) {
        return Object.prototype.toString.call(o);
      }
      clone3.__objToStr = __objToStr;
      function __isDate(o) {
        return typeof o === "object" && __objToStr(o) === "[object Date]";
      }
      clone3.__isDate = __isDate;
      function __isArray(o) {
        return typeof o === "object" && __objToStr(o) === "[object Array]";
      }
      clone3.__isArray = __isArray;
      function __isRegExp(o) {
        return typeof o === "object" && __objToStr(o) === "[object RegExp]";
      }
      clone3.__isRegExp = __isRegExp;
      function __getRegExpFlags(re) {
        var flags = "";
        if (re.global)
          flags += "g";
        if (re.ignoreCase)
          flags += "i";
        if (re.multiline)
          flags += "m";
        return flags;
      }
      clone3.__getRegExpFlags = __getRegExpFlags;
      return clone3;
    }();
    if (module.exports) {
      module.exports = clone2;
    }
  })(clone$1);
  var cloneExports = clone$1.exports;
  var clone = cloneExports;
  var defaults$2 = function(options, defaults3) {
    options = options || {};
    Object.keys(defaults3).forEach(function(key) {
      if (typeof options[key] === "undefined") {
        options[key] = clone(defaults3[key]);
      }
    });
    return options;
  };
  var combining$2 = [
    [768, 879],
    [1155, 1158],
    [1160, 1161],
    [1425, 1469],
    [1471, 1471],
    [1473, 1474],
    [1476, 1477],
    [1479, 1479],
    [1536, 1539],
    [1552, 1557],
    [1611, 1630],
    [1648, 1648],
    [1750, 1764],
    [1767, 1768],
    [1770, 1773],
    [1807, 1807],
    [1809, 1809],
    [1840, 1866],
    [1958, 1968],
    [2027, 2035],
    [2305, 2306],
    [2364, 2364],
    [2369, 2376],
    [2381, 2381],
    [2385, 2388],
    [2402, 2403],
    [2433, 2433],
    [2492, 2492],
    [2497, 2500],
    [2509, 2509],
    [2530, 2531],
    [2561, 2562],
    [2620, 2620],
    [2625, 2626],
    [2631, 2632],
    [2635, 2637],
    [2672, 2673],
    [2689, 2690],
    [2748, 2748],
    [2753, 2757],
    [2759, 2760],
    [2765, 2765],
    [2786, 2787],
    [2817, 2817],
    [2876, 2876],
    [2879, 2879],
    [2881, 2883],
    [2893, 2893],
    [2902, 2902],
    [2946, 2946],
    [3008, 3008],
    [3021, 3021],
    [3134, 3136],
    [3142, 3144],
    [3146, 3149],
    [3157, 3158],
    [3260, 3260],
    [3263, 3263],
    [3270, 3270],
    [3276, 3277],
    [3298, 3299],
    [3393, 3395],
    [3405, 3405],
    [3530, 3530],
    [3538, 3540],
    [3542, 3542],
    [3633, 3633],
    [3636, 3642],
    [3655, 3662],
    [3761, 3761],
    [3764, 3769],
    [3771, 3772],
    [3784, 3789],
    [3864, 3865],
    [3893, 3893],
    [3895, 3895],
    [3897, 3897],
    [3953, 3966],
    [3968, 3972],
    [3974, 3975],
    [3984, 3991],
    [3993, 4028],
    [4038, 4038],
    [4141, 4144],
    [4146, 4146],
    [4150, 4151],
    [4153, 4153],
    [4184, 4185],
    [4448, 4607],
    [4959, 4959],
    [5906, 5908],
    [5938, 5940],
    [5970, 5971],
    [6002, 6003],
    [6068, 6069],
    [6071, 6077],
    [6086, 6086],
    [6089, 6099],
    [6109, 6109],
    [6155, 6157],
    [6313, 6313],
    [6432, 6434],
    [6439, 6440],
    [6450, 6450],
    [6457, 6459],
    [6679, 6680],
    [6912, 6915],
    [6964, 6964],
    [6966, 6970],
    [6972, 6972],
    [6978, 6978],
    [7019, 7027],
    [7616, 7626],
    [7678, 7679],
    [8203, 8207],
    [8234, 8238],
    [8288, 8291],
    [8298, 8303],
    [8400, 8431],
    [12330, 12335],
    [12441, 12442],
    [43014, 43014],
    [43019, 43019],
    [43045, 43046],
    [64286, 64286],
    [65024, 65039],
    [65056, 65059],
    [65279, 65279],
    [65529, 65531],
    [68097, 68099],
    [68101, 68102],
    [68108, 68111],
    [68152, 68154],
    [68159, 68159],
    [119143, 119145],
    [119155, 119170],
    [119173, 119179],
    [119210, 119213],
    [119362, 119364],
    [917505, 917505],
    [917536, 917631],
    [917760, 917999]
  ];
  var defaults$1 = defaults$2;
  var combining$1 = combining$2;
  var DEFAULTS$1 = {
    nul: 0,
    control: 0
  };
  wcwidth$3.exports = function wcwidth(str) {
    return wcswidth$1(str, DEFAULTS$1);
  };
  wcwidth$3.exports.config = function(opts) {
    opts = defaults$1(opts || {}, DEFAULTS$1);
    return function wcwidth3(str) {
      return wcswidth$1(str, opts);
    };
  };
  function wcswidth$1(str, opts) {
    if (typeof str !== "string")
      return wcwidth$1(str, opts);
    var s = 0;
    for (var i = 0; i < str.length; i++) {
      var n = wcwidth$1(str.charCodeAt(i), opts);
      if (n < 0)
        return -1;
      s += n;
    }
    return s;
  }
  function wcwidth$1(ucs, opts) {
    if (ucs === 0)
      return opts.nul;
    if (ucs < 32 || ucs >= 127 && ucs < 160)
      return opts.control;
    if (bisearch$1(ucs))
      return 0;
    return 1 + (ucs >= 4352 && (ucs <= 4447 || // Hangul Jamo init. consonants
    ucs == 9001 || ucs == 9002 || ucs >= 11904 && ucs <= 42191 && ucs != 12351 || // CJK ... Yi
    ucs >= 44032 && ucs <= 55203 || // Hangul Syllables
    ucs >= 63744 && ucs <= 64255 || // CJK Compatibility Ideographs
    ucs >= 65040 && ucs <= 65049 || // Vertical forms
    ucs >= 65072 && ucs <= 65135 || // CJK Compatibility Forms
    ucs >= 65280 && ucs <= 65376 || // Fullwidth Forms
    ucs >= 65504 && ucs <= 65510 || ucs >= 131072 && ucs <= 196605 || ucs >= 196608 && ucs <= 262141));
  }
  function bisearch$1(ucs) {
    var min = 0;
    var max = combining$1.length - 1;
    var mid;
    if (ucs < combining$1[0][0] || ucs > combining$1[max][1])
      return false;
    while (max >= min) {
      mid = Math.floor((min + max) / 2);
      if (ucs > combining$1[mid][1])
        min = mid + 1;
      else if (ucs < combining$1[mid][0])
        max = mid - 1;
      else
        return true;
    }
    return false;
  }
  var wcwidthExports = wcwidth$3.exports;
  const wcwidth$2 = /* @__PURE__ */ getDefaultExportFromCjs(wcwidthExports);
  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function(obj2) {
        return typeof obj2;
      };
    } else {
      _typeof = function(obj2) {
        return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
      };
    }
    return _typeof(obj);
  }
  function createCommonjsModule(fn, module) {
    return module = { exports: {} }, fn(module, module.exports), module.exports;
  }
  var clone_1 = createCommonjsModule(function(module) {
    var clone2 = function() {
      function clone3(parent, circular, depth, prototype) {
        if (_typeof(circular) === "object") {
          depth = circular.depth;
          prototype = circular.prototype;
          circular.filter;
          circular = circular.circular;
        }
        var allParents = [];
        var allChildren = [];
        var useBuffer = typeof Buffer != "undefined";
        if (typeof circular == "undefined")
          circular = true;
        if (typeof depth == "undefined")
          depth = Infinity;
        function _clone(parent2, depth2) {
          if (parent2 === null)
            return null;
          if (depth2 == 0)
            return parent2;
          var child;
          var proto;
          if (_typeof(parent2) != "object") {
            return parent2;
          }
          if (clone3.__isArray(parent2)) {
            child = [];
          } else if (clone3.__isRegExp(parent2)) {
            child = new RegExp(parent2.source, __getRegExpFlags(parent2));
            if (parent2.lastIndex)
              child.lastIndex = parent2.lastIndex;
          } else if (clone3.__isDate(parent2)) {
            child = new Date(parent2.getTime());
          } else if (useBuffer && Buffer.isBuffer(parent2)) {
            if (Buffer.allocUnsafe) {
              child = Buffer.allocUnsafe(parent2.length);
            } else {
              child = new Buffer(parent2.length);
            }
            parent2.copy(child);
            return child;
          } else {
            if (typeof prototype == "undefined") {
              proto = Object.getPrototypeOf(parent2);
              child = Object.create(proto);
            } else {
              child = Object.create(prototype);
              proto = prototype;
            }
          }
          if (circular) {
            var index = allParents.indexOf(parent2);
            if (index != -1) {
              return allChildren[index];
            }
            allParents.push(parent2);
            allChildren.push(child);
          }
          for (var i in parent2) {
            var attrs;
            if (proto) {
              attrs = Object.getOwnPropertyDescriptor(proto, i);
            }
            if (attrs && attrs.set == null) {
              continue;
            }
            child[i] = _clone(parent2[i], depth2 - 1);
          }
          return child;
        }
        return _clone(parent, depth);
      }
      clone3.clonePrototype = function clonePrototype(parent) {
        if (parent === null)
          return null;
        var c = function c2() {
        };
        c.prototype = parent;
        return new c();
      };
      function __objToStr(o) {
        return Object.prototype.toString.call(o);
      }
      clone3.__objToStr = __objToStr;
      function __isDate(o) {
        return _typeof(o) === "object" && __objToStr(o) === "[object Date]";
      }
      clone3.__isDate = __isDate;
      function __isArray(o) {
        return _typeof(o) === "object" && __objToStr(o) === "[object Array]";
      }
      clone3.__isArray = __isArray;
      function __isRegExp(o) {
        return _typeof(o) === "object" && __objToStr(o) === "[object RegExp]";
      }
      clone3.__isRegExp = __isRegExp;
      function __getRegExpFlags(re) {
        var flags = "";
        if (re.global)
          flags += "g";
        if (re.ignoreCase)
          flags += "i";
        if (re.multiline)
          flags += "m";
        return flags;
      }
      clone3.__getRegExpFlags = __getRegExpFlags;
      return clone3;
    }();
    if (module.exports) {
      module.exports = clone2;
    }
  });
  var defaults = function defaults2(options, _defaults) {
    options = options || {};
    Object.keys(_defaults).forEach(function(key) {
      if (typeof options[key] === "undefined") {
        options[key] = clone_1(_defaults[key]);
      }
    });
    return options;
  };
  var combining = [[768, 879], [1155, 1158], [1160, 1161], [1425, 1469], [1471, 1471], [1473, 1474], [1476, 1477], [1479, 1479], [1536, 1539], [1552, 1557], [1611, 1630], [1648, 1648], [1750, 1764], [1767, 1768], [1770, 1773], [1807, 1807], [1809, 1809], [1840, 1866], [1958, 1968], [2027, 2035], [2305, 2306], [2364, 2364], [2369, 2376], [2381, 2381], [2385, 2388], [2402, 2403], [2433, 2433], [2492, 2492], [2497, 2500], [2509, 2509], [2530, 2531], [2561, 2562], [2620, 2620], [2625, 2626], [2631, 2632], [2635, 2637], [2672, 2673], [2689, 2690], [2748, 2748], [2753, 2757], [2759, 2760], [2765, 2765], [2786, 2787], [2817, 2817], [2876, 2876], [2879, 2879], [2881, 2883], [2893, 2893], [2902, 2902], [2946, 2946], [3008, 3008], [3021, 3021], [3134, 3136], [3142, 3144], [3146, 3149], [3157, 3158], [3260, 3260], [3263, 3263], [3270, 3270], [3276, 3277], [3298, 3299], [3393, 3395], [3405, 3405], [3530, 3530], [3538, 3540], [3542, 3542], [3633, 3633], [3636, 3642], [3655, 3662], [3761, 3761], [3764, 3769], [3771, 3772], [3784, 3789], [3864, 3865], [3893, 3893], [3895, 3895], [3897, 3897], [3953, 3966], [3968, 3972], [3974, 3975], [3984, 3991], [3993, 4028], [4038, 4038], [4141, 4144], [4146, 4146], [4150, 4151], [4153, 4153], [4184, 4185], [4448, 4607], [4959, 4959], [5906, 5908], [5938, 5940], [5970, 5971], [6002, 6003], [6068, 6069], [6071, 6077], [6086, 6086], [6089, 6099], [6109, 6109], [6155, 6157], [6313, 6313], [6432, 6434], [6439, 6440], [6450, 6450], [6457, 6459], [6679, 6680], [6912, 6915], [6964, 6964], [6966, 6970], [6972, 6972], [6978, 6978], [7019, 7027], [7616, 7626], [7678, 7679], [8203, 8207], [8234, 8238], [8288, 8291], [8298, 8303], [8400, 8431], [12330, 12335], [12441, 12442], [43014, 43014], [43019, 43019], [43045, 43046], [64286, 64286], [65024, 65039], [65056, 65059], [65279, 65279], [65529, 65531], [68097, 68099], [68101, 68102], [68108, 68111], [68152, 68154], [68159, 68159], [119143, 119145], [119155, 119170], [119173, 119179], [119210, 119213], [119362, 119364], [917505, 917505], [917536, 917631], [917760, 917999]];
  var DEFAULTS = {
    nul: 0,
    control: 0
  };
  var config = function config2(opts) {
    opts = defaults(opts || {}, DEFAULTS);
    return function wcwidth3(str) {
      return wcswidth(str, opts);
    };
  };
  function wcswidth(str, opts) {
    if (typeof str !== "string")
      return wcwidth2(str, opts);
    var s = 0;
    for (var i = 0; i < str.length; i++) {
      var n = wcwidth2(str.charCodeAt(i), opts);
      if (n < 0)
        return -1;
      s += n;
    }
    return s;
  }
  function wcwidth2(ucs, opts) {
    if (ucs === 0)
      return opts.nul;
    if (ucs < 32 || ucs >= 127 && ucs < 160)
      return opts.control;
    if (bisearch(ucs))
      return 0;
    return 1 + (ucs >= 4352 && (ucs <= 4447 || // Hangul Jamo init. consonants
    ucs == 9001 || ucs == 9002 || ucs >= 11904 && ucs <= 42191 && ucs != 12351 || // CJK ... Yi
    ucs >= 44032 && ucs <= 55203 || // Hangul Syllables
    ucs >= 63744 && ucs <= 64255 || // CJK Compatibility Ideographs
    ucs >= 65040 && ucs <= 65049 || // Vertical forms
    ucs >= 65072 && ucs <= 65135 || // CJK Compatibility Forms
    ucs >= 65280 && ucs <= 65376 || // Fullwidth Forms
    ucs >= 65504 && ucs <= 65510 || ucs >= 131072 && ucs <= 196605 || ucs >= 196608 && ucs <= 262141));
  }
  function bisearch(ucs) {
    var min = 0;
    var max = combining.length - 1;
    var mid;
    if (ucs < combining[0][0] || ucs > combining[max][1])
      return false;
    while (max >= min) {
      mid = Math.floor((min + max) / 2);
      if (ucs > combining[mid][1])
        min = mid + 1;
      else if (ucs < combining[mid][0])
        max = mid - 1;
      else
        return true;
    }
    return false;
  }
  var _pad;
  _pad = function pad(text, length, options) {
    var escapecolor, invert, padlength, textnocolors;
    if (options == null) {
      options = {};
    }
    invert = typeof text === "number";
    if (invert) {
      var _ref = [text, length];
      length = _ref[0];
      text = _ref[1];
    }
    if (typeof options === "string") {
      options = {
        "char": options
      };
    }
    if (options["char"] == null) {
      options["char"] = " ";
    }
    if (options.strip == null) {
      options.strip = false;
    }
    if (typeof text !== "string") {
      text = text.toString();
    }
    textnocolors = null;
    _pad = "";
    if (options.colors) {
      escapecolor = /\x1B\[(?:[0-9]{1,2}(?:;[0-9]{1,2})?)?[m|K]/g;
      textnocolors = text.replace(escapecolor, "");
    }
    padlength = options.fixed_width ? length - (textnocolors || text).length : length - config(options.wcwidth_options)(textnocolors || text);
    if (padlength < 0) {
      if (options.strip) {
        if (invert) {
          return text.substr(length * -1);
        } else {
          return text.substr(0, length);
        }
      }
      return text;
    }
    _pad += options["char"].repeat(padlength);
    if (invert) {
      return _pad + text;
    } else {
      return text + _pad;
    }
  };
  var _pad$1 = _pad;
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }
  function compareNestedStringArray(x, y) {
    if (x instanceof Array) {
      if (x.length != y.length) {
        return false;
      } else {
        return x.filter((v, i) => !compareNestedStringArray(v, y[i])).length == 0;
      }
    } else {
      return x === y;
    }
  }
  function deduplicateDays(timetable) {
    let dedup = true;
    timetable.forEach((days) => {
      if (days.length > 1) {
        days.slice(1).forEach((day) => {
          if (!compareNestedStringArray(days[0], day)) {
            dedup = false;
          }
        });
      }
    });
    if (dedup) {
      return new Map(
        Array.from(timetable.entries()).map(([station, days]) => [
          station,
          [days[0]]
        ])
      );
    } else {
      return timetable;
    }
  }
  function luaifyNestedStringArray(array, padding = 0) {
    if (array instanceof Array) {
      return `{ ${array.map((child) => luaifyNestedStringArray(child, padding)).join(", ")} }`;
    } else if (array == "nil") {
      return _pad$1(padding, `nil`);
    } else {
      return _pad$1(padding, `'${array}'`);
    }
  }
  function luaifyTimetable(timetable, padding) {
    timetable = deduplicateDays(timetable);
    return `
			stations = ${luaifyNestedStringArray([...timetable.keys()])},
			data = {
${Array.from(timetable).map(
    ([key, value]) => `				${_pad$1(`['${key}']`, padding)} = ${luaifyNestedStringArray(value, 7)},`
  ).join("\n")}
			}`;
  }
  function getItemsTextByIndex(items, terminalOffset, dayOffset, closed) {
    if (terminalOffset instanceof Array) {
      return terminalOffset.map(
        (index) => items[index + dayOffset].innerHTML.trim().replace("--", closed ? "nil" : "")
      );
    } else {
      return items[terminalOffset + dayOffset].innerHTML.trim().replace("--", closed ? "nil" : "");
    }
  }
  const CRT = {
    bootstrap: () => {
      document.querySelectorAll(".line-time-table").forEach((table) => {
        let caption = table.querySelector("caption");
        let copyData = () => {
          let [days, termini, child_termini] = [0, 1, 2].map(
            (r) => Array.from(
              table.tHead.rows[r].querySelectorAll(".bg-f7f7f7")
            ).filter((th) => th.innerText.trim().length > 2)
          );
          if (days.length == 0) {
            days.push(document.createElement("th"));
            days[0].colSpan = termini.map((g) => g.colSpan).reduce((p, c) => p + c, 0);
          }
          assert([1, 2].includes(days.length), "Invalid # of days.");
          assert(
            termini.length % days.length == 0 && termini.length >= 2,
            "Invalid # of termini."
          );
          assert(
            child_termini.length % days.length == 0 && child_termini.length >= 2,
            "Invalid # of child termini."
          );
          let dayWidth = days[0].colSpan;
          let dayOffsets = [];
          for (let i = 0; i < days.length; i++) {
            assert(days[i].colSpan == dayWidth);
            dayOffsets.push(i * dayWidth);
          }
          let terminalOffsets = [1, 2, 3, 4];
          if (termini.length / days.length == 2 && child_termini.length / termini.length == 2)
            ;
          else if (termini.length / days.length >= 2) {
            terminalOffsets = [[], [], [], []];
            let i = 0;
            let dayWidth2 = days[0].colSpan;
            for (var orientation of termini) {
              let orientationWidth = orientation.colSpan;
              if (orientation.innerHTML.trim().startsWith("首班车")) {
                for (let j = 0; j < orientationWidth; j++) {
                  let terminusText = child_termini[i + j].innerHTML.trim();
                  if (terminusText.includes("↓") || terminusText.includes("内环")) {
                    terminalOffsets[0].push(i + j + 1);
                  } else {
                    terminalOffsets[1].push(i + j + 1);
                  }
                }
              } else {
                for (let j = 0; j < orientationWidth; j++) {
                  let terminusText = child_termini[i + j].innerHTML.trim();
                  if (terminusText.includes("↓") || terminusText.includes("内环")) {
                    terminalOffsets[2].push(i + j + 1);
                  } else {
                    terminalOffsets[3].push(i + j + 1);
                  }
                }
              }
              i += orientationWidth;
              if (i >= dayWidth2) {
                break;
              }
            }
            for (let i2 = 0; i2 < terminalOffsets.length; i2++) {
              const v = terminalOffsets[i2];
              terminalOffsets[i2] = v instanceof Array && v.length == 1 ? v[0] : v;
            }
          } else {
            throw termini.length;
          }
          let rows = Array.from(table.tBodies[0].rows).map(
            (row2) => Array.from(row2.cells)
          );
          let timetable = /* @__PURE__ */ new Map();
          for (var row of rows) {
            if (row.length == 0) {
              break;
            }
            let name = row[0].innerHTML.trim().replace("航站楼", "");
            if (!name || name == "--") {
              break;
            }
            timetable.set(
              name,
              dayOffsets.map((dayOffset) => {
                let closed = (
                  // 判断车站是否关闭
                  row.slice(1).filter((cell) => cell.innerHTML.trim().length > 2).length == 0
                );
                return [
                  [
                    getItemsTextByIndex(
                      row,
                      terminalOffsets[0],
                      dayOffset,
                      closed
                    ),
                    getItemsTextByIndex(
                      row,
                      terminalOffsets[1],
                      dayOffset,
                      closed
                    )
                  ],
                  [
                    getItemsTextByIndex(
                      row,
                      terminalOffsets[2],
                      dayOffset,
                      closed
                    ),
                    getItemsTextByIndex(
                      row,
                      terminalOffsets[3],
                      dayOffset,
                      closed
                    )
                  ]
                ];
              })
            );
          }
          navigator.clipboard.writeText(
            luaifyTimetable(
              timetable,
              Math.max(...[...timetable.keys()].map((str) => wcwidth$2(str))) + 4
            )
          );
        };
        let button = document.createElement("a");
        button.append("导出");
        button.addEventListener("click", copyData, false);
        button.style.cursor = "pointer";
        button.style.position = "absolute";
        button.style.zIndex = "1";
        button.style.color = "white";
        button.style.opacity = ".75";
        button.style.paddingInlineStart = ".5em";
        caption?.appendChild(button);
      });
    }
  };
  switch (new URL(document.URL).hostname) {
    case "www.cqmetro.cn":
      CRT.bootstrap();
      break;
  }

})();