// ==UserScript==
// @name         bahn.de+
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Zeigt durchschnittliche Verspätung (by zugfinder.de) und den vorrausichtlich eingesetzten Zugtyp für durch die DB betriebene Fernverkehrszüge an
// @author       kingjan1999
// @match        *://reiseauskunft.bahn.de/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      zugfinder.de
// @connect      grahnert.de
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.26.0/polyfill.min.js
// @downloadURL https://update.greasyfork.org/scripts/38595/bahnde%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/38595/bahnde%2B.meta.js
// ==/UserScript==
(function () {
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Zugfinder = __webpack_require__(2);

var _States = _interopRequireDefault(__webpack_require__(3));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

GM_addStyle(_States.default.toString());
$(function () {
  $("tr.details ").bind("DOMSubtreeModified", function () {
    $(this).find(".products").each(function () {
      var item = $(this);

      if (item.hasClass("erledigt")) {
        return;
      }

      item.addClass("erledigt");
      var product = item.text().replace(/ +(?= )/g, '');
      product = product.replace(/^\s+|\s+$/g, '');

      if (product !== 'Produkte' && product.trim().length > 1) {
        console.log("Produkt: " + product); // Hier haben wir die Zugnummer

        var fernverkehr_regex = /(IC|ICE|EC|EN|RJ)\s[0-9]+/g;

        if (product.match(fernverkehr_regex) !== null) {
          if (product.match(fernverkehr_regex).length > 1) {
            // mehrere Zugnummer (z.B. ICE 633 ICE 683)
            product = product.match(fernverkehr_regex)[0];
          }

          var zugnummer = product.split(" ")[1];
          console.log(zugnummer);
          console.log("Fernverkehr!");
          (0, _Zugfinder.resolveZugTyp)(product).then(function (typ) {
            if (typ) {
              item.append("<br /> Zugtyp (vorraus.): " + typ);
            }
          });
          (0, _Zugfinder.resolveDelay)(product).then(function (_ref) {
            var average = _ref.average,
                quote = _ref.quote;
            var quote_zahl = parseInt(quote);

            if (quote_zahl > 95) {
              item.addClass("immer_puenktlich");
            } else if (quote_zahl >= 90) {
              item.addClass("fast_puenktlich");
            } else if (quote_zahl >= 80) {
              item.addClass("puenktlich");
            } else if (quote_zahl >= 70) {
              item.addClass("leicht_unpuenktlich");
            } else if (quote_zahl < 70) {
              item.addClass("unpuenktlich");
            }

            if (average.length > 0) {
              item.append("<br /> &empty; Verspätung: " + average);
            }

            if (quote.length > 0) {
              item.append("<br /> Quote: " + quote + "%");
            }
          });
        }
      }
    });
  });
});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveDelay = exports.resolveZugTyp = void 0;

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var zugtyp =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(product) {
    var regex, zugnummer, year, pad, zugid, data, typ;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            regex = /^(ICE|IC)\s([0-9]+)$/g;

            if (!(product.match(regex) === null)) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return", null);

          case 3:
            zugnummer = regex.exec(product)[2];
            year = new Date().getFullYear();
            pad = '00000';
            zugid = year + "01" + pad.substring(0, pad.length - zugnummer.length) + zugnummer; // 01 = erstes Ergebnis

            _context.next = 9;
            return makeGMRequest("http://grahnert.de/fernbahn/datenbank/suche/index.php?zug_id=".concat(zugid));

          case 9:
            data = _context.sent;
            typ = jQuery(data).find("#stammdaten p strong:contains('IC/ICE-Typ')").next().text();
            console.log("Typ: " + typ);
            return _context.abrupt("return", typ);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function zugtyp(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.resolveZugTyp = zugtyp;

var delay =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(product) {
    var data, average, quote;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return makeGMRequest("https://www.zugfinder.de/zuginfo.php?zugnr=".concat(product));

          case 2:
            data = _context2.sent;
            average = $(data).find('.uhrbig').first().text().trim();
            quote = $(data).find('[itemprop="ratingValue"]').text().trim();
            quote = quote.substring(0, quote.length - 1); // remove % sign

            return _context2.abrupt("return", {
              average: average,
              quote: quote
            });

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function delay(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.resolveDelay = delay;

function makeGMRequest(url) {
  return new Promise(function (resolve, reject) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function onload(res) {
        return resolve(res.responseText);
      },
      onerror: function onerror(res) {
        return reject(res);
      }
    });
  });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(4)(false);
// imports


// module
exports.push([module.i, "#content div.detailContainer table.result tr td.immer_puenktlich {\n  background-color: #3b5323; }\n\n#content div.detailContainer table.result tr td.fast_puenktlich {\n  background-color: #6e9b41; }\n\n#content div.detailContainer table.result tr td.puenktlich {\n  background-color: #a1c77a; }\n\n#content div.detailContainer table.result tr td.leicht_unpuenktlich {\n  background-color: #d04343; }\n\n#content div.detailContainer table.result tr td.unpuenktlich {\n  background-color: #8b2323;\n  color: white; }\n  #content div.detailContainer table.result tr td.unpuenktlich a {\n    color: white; }\n", ""]);

// exports


/***/ }),
/* 4 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ })
/******/ ]);
})();