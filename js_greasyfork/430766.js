// ==UserScript==
// @name         Wanikani Integrated Custom SRS
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  Adding custom cards to your review queue
// @author       Gorbit99
// @include      /^https?://((www|preview).)?wanikani.com/
// @icon         https://www.google.com/s2/favicons?domain=wanikani.com
// @grant        GM.xmlHttpRequest
// @connect      jisho.org
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/430766/Wanikani%20Integrated%20Custom%20SRS.user.js
// @updateURL https://update.greasyfork.org/scripts/430766/Wanikani%20Integrated%20Custom%20SRS.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 747:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".addCardsPanelOuter {\n  position: fixed !important;\n  display: flex;\n  justify-content: center !important;\n  align-items: center !important;\n  left: 0 !important;\n  top: 0 !important;\n  width: 100vw !important;\n  height: 100vh !important;\n}\n\n.addCardsPanel {\n  width: 80% !important;\n  height: 80% !important;\n  background: white !important;\n  max-width: 120ch !important;\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  border: 5px solid grey !important;\n  border-radius: 5px !important;\n  overflow-y: scroll !important;\n}\n\n.addTypeForm {\n  width: 60% !important;\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n}\n\n.addCardsRadioGroup {\n  display: flex !important;\n  flex-direction: row !important;\n  align-items: baseline !important;\n  width: 100% !important;\n}\n\n.addCardsRadio {\n  margin-left: auto !important;\n}\n\n.addCardsRadioLabel {\n  margin-left: 1rem !important;\n  margin-right: auto !important;\n}\n\n.additionForm {\n  width: 80% !important;\n  height: 80% !important;\n}\n\n.additionForm textarea {\n  width: 100% !important;\n}\n\n.arrayInput {\n  background-color: lightgrey;\n  display: flex;\n  flex-direction: column;\n  border-radius: 0.5rem;\n}\n\n.arrayInput .arrayInputRow {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n.arrayInput .arrayInputInput,\n.arrayInputRemove {\n  margin: 0.5rem 2rem;\n}\n\n.arrayInput .arrayInputRemove {\n  width: 2rem;\n}\n\n.arrayInput .arrayInputAdd {\n  margin: 0.5rem 1rem;\n}\n\n.arrayInput label + .arrayInputInput {\n  margin-left: 1rem;\n  width: 100%;\n}\n\n.arrayInput label {\n  margin-left: 1rem;\n}\n\n.kanjiComposition {\n  background-color: lightgrey;\n  display: flex;\n  flex-direction: column;\n  border-radius: 0.5rem;\n  padding: 1rem;\n}\n\n.kanjiComposition .kanjiCompositionElement {\n  display: flex;\n  flex-direction: row;\n  align-items: baseline;\n}\n\n.kanjiComposition .kanjiCompositionElement .kanjiCompositionKanji {\n  width: 2rem;\n}\n\n.kanjiComposition .kanjiCompositionElement label {\n  margin: 0 1rem;\n}\n", "",{"version":3,"sources":["webpack://./src/stylesheet.css"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B,aAAa;EACb,kCAAkC;EAClC,8BAA8B;EAC9B,kBAAkB;EAClB,iBAAiB;EACjB,uBAAuB;EACvB,wBAAwB;AAC1B;;AAEA;EACE,qBAAqB;EACrB,sBAAsB;EACtB,4BAA4B;EAC5B,2BAA2B;EAC3B,wBAAwB;EACxB,iCAAiC;EACjC,8BAA8B;EAC9B,iCAAiC;EACjC,6BAA6B;EAC7B,6BAA6B;AAC/B;;AAEA;EACE,qBAAqB;EACrB,aAAa;EACb,mBAAmB;EACnB,sBAAsB;AACxB;;AAEA;EACE,wBAAwB;EACxB,8BAA8B;EAC9B,gCAAgC;EAChC,sBAAsB;AACxB;;AAEA;EACE,4BAA4B;AAC9B;;AAEA;EACE,4BAA4B;EAC5B,6BAA6B;AAC/B;;AAEA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,2BAA2B;EAC3B,aAAa;EACb,sBAAsB;EACtB,qBAAqB;AACvB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,mBAAmB;AACrB;;AAEA;;EAEE,mBAAmB;AACrB;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,iBAAiB;EACjB,WAAW;AACb;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,2BAA2B;EAC3B,aAAa;EACb,sBAAsB;EACtB,qBAAqB;EACrB,aAAa;AACf;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,qBAAqB;AACvB;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,cAAc;AAChB","sourcesContent":[".addCardsPanelOuter {\n  position: fixed !important;\n  display: flex;\n  justify-content: center !important;\n  align-items: center !important;\n  left: 0 !important;\n  top: 0 !important;\n  width: 100vw !important;\n  height: 100vh !important;\n}\n\n.addCardsPanel {\n  width: 80% !important;\n  height: 80% !important;\n  background: white !important;\n  max-width: 120ch !important;\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  border: 5px solid grey !important;\n  border-radius: 5px !important;\n  overflow-y: scroll !important;\n}\n\n.addTypeForm {\n  width: 60% !important;\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n}\n\n.addCardsRadioGroup {\n  display: flex !important;\n  flex-direction: row !important;\n  align-items: baseline !important;\n  width: 100% !important;\n}\n\n.addCardsRadio {\n  margin-left: auto !important;\n}\n\n.addCardsRadioLabel {\n  margin-left: 1rem !important;\n  margin-right: auto !important;\n}\n\n.additionForm {\n  width: 80% !important;\n  height: 80% !important;\n}\n\n.additionForm textarea {\n  width: 100% !important;\n}\n\n.arrayInput {\n  background-color: lightgrey;\n  display: flex;\n  flex-direction: column;\n  border-radius: 0.5rem;\n}\n\n.arrayInput .arrayInputRow {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n}\n\n.arrayInput .arrayInputInput,\n.arrayInputRemove {\n  margin: 0.5rem 2rem;\n}\n\n.arrayInput .arrayInputRemove {\n  width: 2rem;\n}\n\n.arrayInput .arrayInputAdd {\n  margin: 0.5rem 1rem;\n}\n\n.arrayInput label + .arrayInputInput {\n  margin-left: 1rem;\n  width: 100%;\n}\n\n.arrayInput label {\n  margin-left: 1rem;\n}\n\n.kanjiComposition {\n  background-color: lightgrey;\n  display: flex;\n  flex-direction: column;\n  border-radius: 0.5rem;\n  padding: 1rem;\n}\n\n.kanjiComposition .kanjiCompositionElement {\n  display: flex;\n  flex-direction: row;\n  align-items: baseline;\n}\n\n.kanjiComposition .kanjiCompositionElement .kanjiCompositionKanji {\n  width: 2rem;\n}\n\n.kanjiComposition .kanjiCompositionElement label {\n  margin: 0 1rem;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 15:
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "F": () => (/* binding */ database)
});

;// CONCATENATED MODULE: ./src/database.ts
class Database {
    data;
    constructor() {
        this.data = [];
    }
    load() {
        this.data = $.jStorage.get("customCards", []);
    }
    save() {
        $.jStorage.set("customCards", this.data);
    }
    migrate() {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawData = this.data;
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        rawData.map((item) => {
            if (item.version === undefined) {
                if (item.voc !== undefined && item.collocations === undefined) {
                    item.collocations = [];
                }
                if (item.voc !== undefined && item.kanji === undefined) {
                    item.kanji = [];
                }
                if (item.kan !== undefined && item.radicals === undefined) {
                    item.radicals = [];
                }
                if (item.kan !== undefined && item.vocabulary === undefined) {
                    item.vocabulary = [];
                }
                if (item.metadata === undefined) {
                    if (item.voc !== undefined) {
                        const metadata = {
                            stroke: item.stroke,
                            meaning_explanation: item.meaning_explanation,
                            reading_explanation: item.reading_explanation,
                            en: item.en.join(", "),
                            kana: item.kana.join(", "),
                            sentences: item.sentences,
                            meaning_note: item.meaning_note,
                            reading_note: item.reading_note,
                            parts_of_speech: item.parts_of_speech,
                            audio: item.audio,
                            related: item.related,
                        };
                        delete item.stroke;
                        delete item.meaning_explanation;
                        delete item.reading_explanation;
                        delete item.sentences;
                        delete item.meaning_note;
                        delete item.reading_note;
                        delete item.parts_of_speech;
                        delete item.audio;
                        delete item.related;
                        item.metadata = metadata;
                    }
                    else if (item.kan !== undefined) {
                        const metadata = {
                            stroke: item.stroke,
                            meaning_mnemonic: item.meaning_mnemonic,
                            meaning_hint: item.meaning_hint,
                            reading_mnemonic: item.reading_mnemonic,
                            reading_hint: item.reading_hint,
                            en: item.en.join(", "),
                            meaning_note: item.meaning_note,
                            reading_note: item.reading_note,
                            related: item.related,
                        };
                        item.metadata = metadata;
                        delete item.stroke;
                        delete item.meaning_mnemonic;
                        delete item.meaning_hint;
                        delete item.reading_mnemonic;
                        delete item.reading_hint;
                        delete item.meaning_note;
                        delete item.reading_note;
                        delete item.related;
                    }
                }
                const jsonData = item.metadata;
                delete item.metadata;
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const lessonData = {};
                //eslint-disable-next-line @typescript-eslint/no-explicit-any
                const reviewData = {};
                for (const key in item) {
                    if (key === "collocations" || key === "kanji") {
                        lessonData[key] = item[key];
                    }
                    else {
                        reviewData[key] = item[key];
                    }
                    delete item[key];
                }
                if (reviewData.voc !== undefined) {
                    lessonData.aud = reviewData.aud;
                    lessonData.auxiliary_meanings = reviewData.auxiliary_meanings;
                    lessonData.auxiliary_readings = reviewData.auxiliary_readings;
                    lessonData.en = reviewData.en;
                    lessonData.id = reviewData.id;
                    lessonData.kana = reviewData.kana;
                    lessonData.mmne = reviewData.meaning_explanation;
                    lessonData.parts_of_speech = reviewData.parts_of_speech;
                    lessonData.rmne = reviewData.reading_explanation;
                    lessonData.sentences = reviewData.sentences;
                    lessonData.voc = reviewData.voc;
                }
                else if (reviewData.kan !== undefined) {
                    lessonData.auxiliary_meanings = reviewData.auxiliary_meanings;
                    lessonData.auxiliary_readings = reviewData.auxiliary_readings;
                    lessonData.emph = reviewData.emph;
                    lessonData.en = reviewData.en;
                    lessonData.id = reviewData.id;
                    lessonData.kan = reviewData.kan;
                    lessonData.kun = reviewData.kun;
                    lessonData.mhnt = reviewData.meaning_hint;
                    lessonData.mmne = reviewData.meaning_explanation;
                    lessonData.nanori = reviewData.nanori;
                    lessonData.on = reviewData.on;
                    lessonData.radicals = reviewData.radicals;
                    lessonData.rhnt = reviewData.rhnt;
                    lessonData.rmne = reviewData.rmne;
                    lessonData.vocabulary = reviewData.vocabulary;
                }
                item.lessonData = lessonData;
                item.reviewData = reviewData;
                item.jsonData = jsonData;
                item.version = 1;
            }
            if (item.reviewData.voc !== undefined) {
                return item;
            }
            else {
                return item;
            }
        });
        this.save();
    }
    getDueReviews() {
        return this.data.filter((item) => (!item.reviewData.due_date ||
            new Date(item.reviewData.due_date) <= new Date()) &&
            !item.reviewData.burned &&
            item.reviewData.srs !== 0);
    }
    getDueLessons() {
        const items = this.data.filter((item) => item.reviewData.srs === 0);
        return items;
    }
    get(id) {
        return this.data.find((item) => item.reviewData.id === id);
    }
    getIndex(id) {
        return this.data.findIndex((item) => item.reviewData.id === id);
    }
    find(predicate) {
        return this.data.find(predicate);
    }
    add(entry) {
        this.data.push(entry);
    }
    getNextId() {
        const max = Math.max(...this.data.map((item) => parseInt(item.reviewData.id.slice(1))));
        if (!isFinite(max)) {
            return 0;
        }
        return max + 1;
    }
    fromJSONEndpoint(endpoint) {
        const id = endpoint.slice(endpoint.lastIndexOf("/") + 1);
        return this.get(id)?.jsonData;
    }
}

;// CONCATENATED MODULE: ./src/sessions.ts

function handleReviewCompleted(id, data) {
    const item = database.get(id);
    if (item === undefined) {
        return;
    }
    let srs = item.reviewData.srs;
    let incorrectMeaning = data[0] ?? 0;
    let incorrectReading = data[1] ?? 0;
    if (incorrectReading == "") {
        incorrectReading = 0;
    }
    const incorrectAmount = incorrectMeaning + incorrectReading;
    if (incorrectAmount === 0 || srs === 0) {
        srs++;
        if (srs === 9) {
            item.reviewData.burned = true;
        }
    }
    else {
        let stepsDown = Math.ceil(incorrectAmount / 2);
        while (stepsDown > 0 && srs > 1) {
            srs -= srs >= 5 ? 2 : 1;
            stepsDown--;
        }
    }
    item.reviewData.srs = srs;
    item.reviewData.due_date = calculateNextDueDate(item.reviewData.srs);
    database.save();
}
function handleLessonCompleted(id) {
    const item = database.get(id);
    if (item === undefined) {
        return;
    }
    item.reviewData.srs = 1;
    item.reviewData.due_date = calculateNextDueDate(item.reviewData.srs);
    database.save();
}
const millisecondsInHour = 60 * 60 * 1000;
function calculateNextDueDate(srs) {
    return new Date(Math.floor(new Date().getTime() / millisecondsInHour) * millisecondsInHour +
        getSrsInterval(srs));
}
function getSrsInterval(srs) {
    const hours = [0, 4, 8, 23, 47, 167, 335, 719, 2879];
    return (hours[srs] ?? 0) * millisecondsInHour;
}

;// CONCATENATED MODULE: ./src/addCardsPanel.html
// Module
var code = "<div class=\"addCardsPanel\"> <h1>Add Cards</h1> <form class=\"addTypeForm\"> <div class=\"addCardsRadioGroup\"> <input type=\"radio\" name=\"addType\" id=\"radioAdd\" value=\"add\" checked=\"checked\" class=\"addCardsRadio\"/> <label for=\"radioAdd\" class=\"addCardsRadioLabel\">Add</label> <input type=\"radio\" name=\"addType\" id=\"radioImport\" value=\"import\" class=\"addCardsRadio\"/> <label for=\"radioImport\" class=\"addCardsRadioLabel\">Import</label> </div> <div class=\"addCardsRadioGroup\"> <input type=\"radio\" name=\"itemType\" id=\"radioVocab\" value=\"vocab\" checked=\"checked\" class=\"addCardsRadio\"/> <label for=\"radioVocab\" class=\"addCardsRadioLabel\">Vocab</label> <input type=\"radio\" name=\"itemType\" id=\"radioKanji\" value=\"kanji\" class=\"addCardsRadio\"/> <label for=\"radioKanji\" class=\"addCardsRadioLabel\">Kanji</label> </div> </form> <form class=\"additionForm\"></form> </div> ";
// Exports
/* harmony default export */ const addCardsPanel = (code);
;// CONCATENATED MODULE: ./src/addVocab.html
// Module
var addVocab_code = "<fieldset> <legend>Required</legend> <label for=\"vocab\">Vocab</label> <input type=\"text\" id=\"vocab\" name=\"vocab\" required/> <label for=\"meaning\">Meaning</label> <div class=\"arrayInput\" name=\"meaning\" id=\"meaning\" required=\"true\"> <template class=\"arrayInputTemplate\"> <div class=\"arrayInputRow\"> <input type=\"text\" class=\"arrayInputInput\"/> <button class=\"arrayInputRemove\">-</button> </div> </template> </div> <label for=\"reading\">Reading</label> <div class=\"arrayInput\" name=\"reading\" id=\"reading\" required=\"true\"> <template class=\"arrayInputTemplate\"> <div class=\"arrayInputRow\"> <input type=\"text\" class=\"arrayInputInput\"/> <button class=\"arrayInputRemove\">-</button> </div> </template> </div> </fieldset> <fieldset> <legend>Optional</legend> <label for=\"meaningMnemonic\">Meaning mnemonic</label> <textarea id=\"meaningMnemonic\" name=\"meaningMnemonic\"></textarea> <label for=\"readingMnemonic\">Reading mnemonic</label> <textarea id=\"readingMnemonic\" name=\"readingMnemonic\"></textarea> <label for=\"partsOfSpeech\">Parts of speech</label> <div class=\"arrayInput\" name=\"partsOfSpeech\" id=\"partsOfSpeech\"> <template class=\"arrayInputTemplate\"> <div class=\"arrayInputRow\"> <input type=\"text\" class=\"arrayInputInput\"/> <button class=\"arrayInputRemove\">-</button> </div> </template> </div> <label for=\"sentences\">Sentences</label> <div class=\"arrayInput\" name=\"sentences\" id=\"sentences\"> <template class=\"arrayInputTemplate\"> <div class=\"arrayInputRow\"> <label>jp</label> <input type=\"text\" class=\"arrayInputInput\"/> <label>en</label> <input type=\"text\" class=\"arrayInputInput\"/> <button class=\"arrayInputRemove\">-</button> </div> </template> </div> <label for=\"kanjiComposition\">Kanji composition</label> <div class=\"arrayInput\" name=\"kanjiComposition\" id=\"kanjiComposition\" generated=\"true\"> <template class=\"arrayInputTemplate\"> <div class=\"arrayInputRow\"> <input type=\"text\" class=\"kanjiCompositionKanji arrayInputInput\" readonly=\"readonly\"/> <label>Meaning:</label> <input type=\"text\" class=\"kanjiCompositionMeaning arrayInputInput\"/> <label>Reading:</label> <input type=\"text\" class=\"kanjiCompositionReading arrayInputInput\"/> </div> </template> </div> </fieldset> <input type=\"submit\" value=\"Add Vocab\"/> ";
// Exports
/* harmony default export */ const addVocab = (addVocab_code);
;// CONCATENATED MODULE: ./src/addKanji.html
// Module
var addKanji_code = "<fieldset> <legend>Required</legend> <label for=\"kanji\">Kanji</label> <input type=\"text\" id=\"kanji\" name=\"kanji\" required/> <label for=\"meaning\">Meaning</label> <div class=\"arrayInput\" name=\"meaning\" id=\"meaning\" required=\"true\"> <template class=\"arrayInputTemplate\"> <div class=\"arrayInputRow\"> <input type=\"text\" class=\"arrayInputInput\"/> <button class=\"arrayInputRemove\">-</button> </div> </template> </div> <label for=\"onyomi\">Onyomi</label> <div class=\"arrayInput\" name=\"onyomi\" id=\"onyomi\" required=\"true\"> <template class=\"arrayInputTemplate\"> <div class=\"arrayInputRow\"> <input type=\"text\" class=\"arrayInputInput\"/> <button class=\"arrayInputRemove\">-</button> </div> </template> </div> <label for=\"kunyomi\">Kunyomi</label> <div class=\"arrayInput\" name=\"kunyomi\" id=\"kunyomi\"> <template class=\"arrayInputTemplate\"> <div class=\"arrayInputRow\"> <input type=\"text\" class=\"arrayInputInput\"/> <button class=\"arrayInputRemove\">-</button> </div> </template> </div> <label for=\"emphasis\">Emphasis on</label> <select name=\"emphasis\" id=\"emphasis\" required> <option value=\"onyomi\">Onyomi</option> <option value=\"kunyomi\">Kunyomi</option> </select> </fieldset> <fieldset> <legend>Optional</legend> <label for=\"meaningMnemonic\">Meaning mnemonic</label> <textarea id=\"meaningMnemonic\" name=\"meaningMnemonic\"></textarea> <label for=\"meaningHint\">Meaning hint</label> <textarea id=\"meaningHint\" name=\"meaningHint\"></textarea> <label for=\"readingMnemonic\">Reading mnemonic</label> <textarea id=\"readingMnemonic\" name=\"readingMnemonic\"></textarea> <label for=\"readingHint\">Reading hint</label> <textarea id=\"readingHint\" name=\"readingHint\"></textarea> </fieldset> <input type=\"submit\" value=\"Add Kanji\"/> ";
// Exports
/* harmony default export */ const addKanji = (addKanji_code);
;// CONCATENATED MODULE: ./src/importVocab.html
// Module
var importVocab_code = "<fieldset> <legend>Required</legend> <label for=\"vocab\">Vocab</label> <select id=\"vocab\" name=\"vocab\" to-fill=\"true\" required></select> <label for=\"meaning\">Meaning</label> <select id=\"meaning\" name=\"meaning\" to-fill=\"true\" required></select> <label for=\"reading\">Reading</label> <select id=\"reading\" name=\"reading\" to-fill=\"true\" required></select> </fieldset> <fieldset> <legend>Optional</legend> <label for=\"meaningMnemonic\">Meaning mnemonic</label> <select id=\"meaningMnemonic\" name=\"meaningMnemonic\" to-fill=\"true\"> <option value=\"-1\">None</option> </select> <label for=\"readingMnemonic\">Reading mnemonic</label> <select id=\"readingMnemonic\" name=\"readingMnemonic\" to-fill=\"true\"> <option value=\"-1\">None</option> </select> </fieldset> <input type=\"submit\" value=\"Import Vocab\"/> ";
// Exports
/* harmony default export */ const importVocab = (importVocab_code);
;// CONCATENATED MODULE: ./src/importKanji.html
// Module
var importKanji_code = "<fieldset> <legend>Required</legend> <label for=\"kanji\">Kanji</label> <select id=\"kanji\" name=\"kanji\" required to-fill=\"true\"></select> <label for=\"meaning\">Meaning</label> <select id=\"meaning\" name=\"meaning\" required to-fill=\"true\"></select> <label for=\"onyomi\">Onyomi</label> <select id=\"onyomi\" name=\"onyomi\" required to-fill=\"true\"></select> <label for=\"kunyomi\">Kunyomi</label> <select id=\"kunyomi\" name=\"kunyomi\" required to-fill=\"true\"></select> </fieldset> <fieldset> <legend>Optional</legend> <label for=\"meaningMnemonic\">Meaning mnemonic</label> <select id=\"meaningMnemonic\" name=\"meaningMnemonic\" to-fill=\"true\"> <option value=\"-1\">None</option> </select> <label for=\"meaningHint\">Meaning hint</label> <select id=\"meaningHint\" name=\"meaningHint\" to-fill=\"true\"> <option value=\"-1\">None</option> </select> <label for=\"readingMnemonic\">Reading mnemonic</label> <select id=\"readingMnemonic\" name=\"readingMnemonic\" to-fill=\"true\"> <option value=\"-1\">None</option> </select> <label for=\"readingHint\">Reading hint</label> <select id=\"readingHint\" name=\"readingHint\" to-fill=\"true\"> <option value=\"-1\">None</option> </select> </fieldset> <input type=\"submit\" value=\"Import Vocab\"/> ";
// Exports
/* harmony default export */ const importKanji = (importKanji_code);
// EXTERNAL MODULE: ./src/stylesheet.css
var stylesheet = __webpack_require__(747);
;// CONCATENATED MODULE: ./src/arrayInput.ts
class ArrayInput {
    rootElement;
    required;
    generated;
    name;
    template;
    constructor(arrayInput) {
        this.rootElement = arrayInput;
        this.required = arrayInput.getAttribute("required") === "true";
        this.generated = arrayInput.getAttribute("generated") === "true";
        this.name = arrayInput.getAttribute("name") + "[]";
        this.template = arrayInput.querySelector(".arrayInputTemplate");
    }
    static setupElementsOn(element) {
        element.querySelectorAll(".arrayInput").forEach((element) => {
            const arrayInput = new ArrayInput(element);
            arrayInput.setup();
        });
    }
    setup() {
        const inputFields = this.template.content.querySelectorAll(".arrayInputInput");
        inputFields.forEach((elem) => {
            const inputElem = elem;
            inputElem.name = this.name;
            inputElem.required = true;
        });
        if (!this.generated) {
            const addButton = document.createElement("button");
            this.rootElement.appendChild(addButton);
            addButton.classList.add("arrayInputAdd");
            addButton.textContent = "+";
            addButton.onclick = () => {
                this.addField();
            };
        }
        if (this.required) {
            this.addField();
        }
        if (this.required) {
            const removeButton = this.rootElement.querySelector(".arrayInputRemove");
            removeButton.onclick = this.removeAction;
        }
    }
    addField() {
        const newEntry = this.template.content.cloneNode(true);
        const arrayInputRow = newEntry.querySelector(".arrayInputRow");
        if (!this.generated) {
            const addButton = this.rootElement.querySelector(".arrayInputAdd");
            this.rootElement.insertBefore(newEntry, addButton);
        }
        else {
            this.rootElement.appendChild(newEntry);
        }
        if (this.required) {
            this.rootElement.querySelectorAll(".arrayInputRemove").forEach((elem) => {
                const buttonElem = elem;
                buttonElem.disabled = false;
            });
        }
        const removeButton = arrayInputRow.querySelector(".arrayInputRemove");
        if (removeButton) {
            removeButton.onclick = this.removeAction;
        }
        return arrayInputRow;
    }
    removeAction(event) {
        const target = event.target;
        if (target.parentNode === null) {
            console.error("Somehow a button was attached to nothing?");
            return;
        }
        const parentNode = target.parentNode;
        parentNode.remove();
        if (this.required) {
            const buttons = this.rootElement.querySelectorAll(".arrayInputRemove");
            if (buttons[0] !== undefined) {
                buttons[0].disabled = true;
            }
        }
    }
    getValues() {
        const result = [
            ...this.rootElement.querySelectorAll(`[name="${this.name}"]`),
        ].map((element) => element.value);
        return result;
    }
    clear() {
        this.rootElement
            .querySelectorAll(".arrayInputRow")
            .forEach((row) => row.remove());
        if (this.required) {
            this.addField();
        }
    }
    fill(count, dataFunc) {
        if (count === 0) {
            this.clear();
            return;
        }
        this.rootElement
            .querySelectorAll(".arrayInputRow")
            .forEach((row) => row.remove());
        for (let i = 0; i < count; i++) {
            const newEntry = this.addField();
            dataFunc(newEntry, i);
        }
    }
}

;// CONCATENATED MODULE: ./src/kanji.ts


class Kanji {
    static addKanji(form) {
        const formData = new FormData(form);
        if (database.find((elem) => "kan" in elem.reviewData &&
            elem.reviewData.kan === formData.get("kanji")) !== undefined) {
            alert("That kanji has been added before!");
            return false;
        }
        const meaningArrayInput = new ArrayInput(form.querySelector("#meaning"));
        const onyomiArrayInput = new ArrayInput(form.querySelector("#onyomi"));
        const kunyomiArrayInput = new ArrayInput(form.querySelector("#kunyomi"));
        const meanings = meaningArrayInput.getValues();
        const meaning_mnemonic = formData.get("meaningMnemonic") ||
            "No meaning mnemonic was given.";
        const meaning_hint = formData.get("meaningHint") || "No meaning hint was given.";
        const reading_mnemonic = formData.get("readingMnemonic") ||
            "No reading mnemonic was given.";
        const reading_hint = formData.get("readingHint") || "No reading hint was given.";
        const newEntry = {
            version: 1,
            reviewData: {
                auxiliary_meanings: [],
                auxiliary_readings: [],
                emph: formData.get("emphasis"),
                en: meanings,
                id: "c" + database.getNextId(),
                kan: formData.get("kanji"),
                kun: kunyomiArrayInput.getValues(),
                nanori: [],
                on: onyomiArrayInput.getValues(),
                radicals: [],
                srs: 0,
                syn: [],
                vocabulary: [],
                due_date: new Date(),
                burned: false,
            },
            jsonData: {
                en: meanings.join(", "),
                meaning_hint: meaning_hint,
                meaning_mnemonic: meaning_mnemonic,
                meaning_note: null,
                reading_hint: reading_hint,
                reading_mnemonic: reading_mnemonic,
                reading_note: null,
                related: [],
                stroke: 0,
            },
            lessonData: {
                auxiliary_meanings: [],
                auxiliary_readings: [],
                emph: formData.get("emphasis"),
                en: meanings,
                id: "c" + database.getNextId(),
                kan: formData.get("kanji"),
                kun: kunyomiArrayInput.getValues(),
                mhnt: meaning_hint,
                mmne: meaning_mnemonic,
                nanori: [],
                on: onyomiArrayInput.getValues(),
                radicals: [],
                rhnt: reading_hint,
                rmne: reading_mnemonic,
                vocabulary: [],
            },
        };
        database.add(newEntry);
        database.save();
        return true;
    }
    static importKanji(form) {
        const formData = new FormData(form);
        const chooseDeckInput = document.querySelector("#chooseDeck");
        const file = chooseDeckInput.files?.[0];
        const fileReader = new FileReader();
        let nextId = database.getNextId();
        fileReader.onload = (event) => {
            const target = event.target;
            const text = target.result;
            const lines = text.split("\n").map((line) => line.split("\t"));
            for (const line of lines) {
                const kanji = line[parseInt(formData.get("vocab"))];
                if (database.find((elem) => "kan" in elem.reviewData && elem.reviewData.kan === kanji) !== undefined) {
                    continue;
                }
                const meaning_mnemonicId = parseInt(formData.get("meaningMnemonic"));
                const reading_mnemonicId = parseInt(formData.get("readingMnemonic"));
                const meaning_hintId = parseInt(formData.get("meaningHint"));
                const reading_hintId = parseInt(formData.get("readingHint"));
                const meaning_mnemonic = meaning_mnemonicId === -1
                    ? "No meaning mnemonic was given."
                    : line[meaning_mnemonicId] ?? "";
                const meaning_hint = meaning_hintId === -1
                    ? "No meaning hint was given."
                    : line[meaning_hintId] ?? "";
                const reading_mnemonic = reading_mnemonicId === -1
                    ? "No reading mnemonic was given."
                    : line[reading_mnemonicId] ?? "";
                const reading_hint = reading_hintId === -1
                    ? "No reading hint was given."
                    : line[reading_hintId] ?? "";
                const getField = (field) => {
                    return line[parseInt(formData.get(field))] ?? "";
                };
                const newEntry = {
                    version: 1,
                    reviewData: {
                        auxiliary_meanings: [],
                        auxiliary_readings: [],
                        emph: getField("emphasis"),
                        en: [getField("meaning")],
                        id: "c" + nextId,
                        kan: getField("kanji"),
                        kun: [getField("kunyomi")],
                        nanori: [],
                        on: [getField("onyomi")],
                        srs: 0,
                        syn: [],
                        radicals: [],
                        vocabulary: [],
                        due_date: new Date(),
                        burned: false,
                    },
                    jsonData: {
                        stroke: 0,
                        meaning_mnemonic: meaning_mnemonic,
                        meaning_hint: meaning_hint,
                        reading_mnemonic: reading_mnemonic,
                        reading_hint: reading_hint,
                        en: getField("meaning"),
                        meaning_note: null,
                        reading_note: null,
                        related: [],
                    },
                    lessonData: {
                        auxiliary_meanings: [],
                        auxiliary_readings: [],
                        emph: getField("emphasis"),
                        en: [getField("meaning")],
                        id: "c" + nextId,
                        kan: getField("kanji"),
                        kun: [getField("kunyomi")],
                        nanori: [],
                        on: [getField("onyomi")],
                        mmne: meaning_mnemonic,
                        mhnt: meaning_hint,
                        rmne: reading_mnemonic,
                        rhnt: reading_hint,
                        radicals: [],
                        vocabulary: [],
                    },
                };
                database.add(newEntry);
                nextId++;
            }
            database.save();
        };
        if (file === undefined) {
            return false;
        }
        fileReader.readAsText(file);
        return true;
    }
}

;// CONCATENATED MODULE: ./src/vocab.ts


class Vocab {
    static addVocab(form) {
        const formData = new FormData(form);
        if (database.find((elem) => {
            return ("voc" in elem.reviewData &&
                elem.reviewData.voc === formData.get("vocab"));
        }) !== undefined) {
            alert("That vocab has been added before!");
            return false;
        }
        const meaningArrayInput = new ArrayInput(form.querySelector("#meaning"));
        const readingArrayInput = new ArrayInput(form.querySelector("#reading"));
        const sentencesArrayInput = new ArrayInput(form.querySelector("#sentences"));
        const meanings = meaningArrayInput.getValues();
        const readings = readingArrayInput.getValues();
        const sentencesRaw = sentencesArrayInput.getValues();
        const sentences = [];
        for (let i = 0, len = sentencesRaw.length / 2; i < len; i++) {
            sentences.push([
                sentencesRaw[i * 2] ?? "",
                sentencesRaw[i * 2 + 1] ?? "",
            ]);
        }
        const kanjiCompositionArrayInput = new ArrayInput(form.querySelector("#kanjiComposition"));
        const kanjiCompositionRaw = kanjiCompositionArrayInput.getValues();
        const meaning_mnemonic = formData.get("meaningMnemonic") ||
            "No meaning mnemonic was given.";
        const reading_mnemonic = formData.get("readingMnemonic") ||
            "No reading mnemonic was given.";
        const kanjiComposition = [];
        for (let i = 0; i < kanjiCompositionRaw.length / 3; i++) {
            const kanji = kanjiCompositionRaw[i * 3] ?? "";
            const meaning = kanjiCompositionRaw[i * 3 + 1] ?? "";
            const reading = kanjiCompositionRaw[i * 3 + 2] ?? "";
            kanjiComposition.push({
                kan: kanji,
                en: meaning,
                slug: kanji,
                ja: reading,
            });
        }
        const partsOfSpeechArrayInput = new ArrayInput(form.querySelector("#partsOfSpeech"));
        const newEntry = {
            version: 1,
            reviewData: {
                aud: [],
                auxiliary_meanings: [],
                auxiliary_readings: [],
                en: meanings,
                id: "c" + database.getNextId(),
                kana: readings,
                srs: 0,
                syn: [],
                voc: formData.get("vocab"),
                due_date: new Date(),
                burned: false,
            },
            jsonData: {
                audio: [],
                en: meanings.join(", "),
                kana: readings.join(", "),
                meaning_explanation: meaning_mnemonic,
                meaning_note: null,
                parts_of_speech: partsOfSpeechArrayInput.getValues(),
                reading_explanation: reading_mnemonic,
                reading_note: null,
                related: kanjiComposition,
                sentences: sentences,
                stroke: 0, //No need
            },
            lessonData: {
                aud: [],
                auxiliary_meanings: [],
                auxiliary_readings: [],
                collocations: [],
                en: meanings,
                id: "c" + database.getNextId(),
                kana: readings,
                kanji: kanjiComposition,
                mmne: meaning_mnemonic,
                parts_of_speech: partsOfSpeechArrayInput.getValues(),
                rmne: reading_mnemonic,
                sentences: sentences,
                voc: formData.get("vocab"),
            },
        };
        database.add(newEntry);
        database.save();
        return true;
    }
    static importVocab(form) {
        const formData = new FormData(form);
        const chooseDeckElem = document.querySelector("#chooseDeck");
        if (chooseDeckElem.files === null) {
            return false;
        }
        const file = chooseDeckElem.files[0];
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const target = event.target;
            const text = target.result;
            const lines = text.split("\n").map((line) => line.split("\t"));
            let nextId = database.getNextId();
            for (const line of lines) {
                const vocab = line[parseInt(formData.get("vocab"))] ?? "";
                if (database.find((elem) => "voc" in elem.reviewData && elem.reviewData.voc === vocab) !== undefined) {
                    continue;
                }
                const getField = (field) => {
                    return line[parseInt(formData.get(field))] ?? "";
                };
                const meaning_explanationId = parseInt(formData.get("meaningMnemonic"));
                const reading_explanationId = parseInt(formData.get("readingMnemonic"));
                const meaning_mnemonic = meaning_explanationId === -1
                    ? "No meaning mnemonic was given."
                    : line[meaning_explanationId] ?? "";
                const reading_mnemonic = reading_explanationId === -1
                    ? "No reading mnemonic was given."
                    : line[reading_explanationId] ?? "";
                const newEntry = {
                    version: 1,
                    reviewData: {
                        aud: [],
                        auxiliary_meanings: [],
                        auxiliary_readings: [],
                        en: [getField("meaning")],
                        id: "c" + nextId,
                        kana: [getField("reading")],
                        srs: 0,
                        syn: [],
                        voc: vocab,
                        due_date: new Date(),
                        burned: false,
                    },
                    jsonData: {
                        stroke: 0,
                        meaning_explanation: meaning_mnemonic,
                        reading_explanation: reading_mnemonic,
                        en: getField("meaning"),
                        kana: getField("reading"),
                        sentences: [],
                        meaning_note: null,
                        reading_note: null,
                        parts_of_speech: [],
                        audio: [],
                        related: [],
                    },
                    lessonData: {
                        aud: [],
                        auxiliary_meanings: [],
                        auxiliary_readings: [],
                        en: [getField("meaning")],
                        id: "c" + nextId,
                        kana: [getField("reading")],
                        voc: vocab,
                        collocations: [],
                        kanji: [],
                        mmne: meaning_mnemonic,
                        rmne: reading_mnemonic,
                        parts_of_speech: [],
                        sentences: [],
                    },
                };
                database.add(newEntry);
                nextId++;
            }
            database.save();
            return true;
        };
        if (file === undefined) {
            return false;
        }
        fileReader.readAsText(file);
        return true;
    }
}

;// CONCATENATED MODULE: ./src/kanjiapi.ts
class KanjiApi {
    static getKanji(kanji) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `https://kanjiapi.dev/v1/kanji/${kanji}`,
                type: 'get',
                dataType: 'json',
            })
                .fail(reject)
                .done(resolve);
        });
    }
}

;// CONCATENATED MODULE: ./src/utils.ts
function katakanaToHiragana(katakana) {
    const katakanaFirst = "ァ".codePointAt(0) ?? 0;
    const katakanaLast = "ヶ".codePointAt(0) ?? 0;
    const hiraganaFirst = "ぁ".codePointAt(0) ?? 0;
    return [...katakana]
        .map((chr) => {
        const chrCodePoint = chr.codePointAt(0) ?? 0;
        if (chrCodePoint >= katakanaFirst && chrCodePoint <= katakanaLast) {
            return String.fromCodePoint(chrCodePoint - katakanaFirst + hiraganaFirst);
        }
        else {
            return chr;
        }
    })
        .join("");
}
function titleCase(str) {
    return str
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.substr(1).toLowerCase())
        .join(" ");
}

;// CONCATENATED MODULE: ./src/jisho.ts
class Jisho {
    static queryTerm(searchTerm) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                url: `https://jisho.org/api/v1/search/words?keyword=${searchTerm}`,
                method: "GET",
                onload: (response) => resolve(JSON.parse(response.responseText)),
                onerror: reject,
            });
        });
    }
}

;// CONCATENATED MODULE: ./src/ui.ts












class UI {
    static outerDiv;
    static addCardsPanel;
    static addTypeForm;
    static additionForm;
    static setup() {
        UI.outerDiv = document.body.appendChild(document.createElement("div"));
        UI.outerDiv.classList.add("addCardsPanelOuter");
        UI.outerDiv.innerHTML = addCardsPanel;
        const style = document.head.appendChild(document.createElement("style"));
        style.innerHTML = stylesheet/* default */.Z;
        UI.addCardsPanel = UI.outerDiv.querySelector(".addCardsPanel");
        UI.addTypeForm = UI.outerDiv.querySelector(".addTypeForm");
        UI.additionForm = UI.outerDiv.querySelector(".additionForm");
        UI.addTypeForm.onchange = UI.addTypeChange;
        UI.displayOptionsAddVocab();
        UI.toggleAddDisplay();
        window.addEventListener("DOMContentLoaded", () => {
            const sitemap = document.querySelector("#sitemap");
            if (sitemap) {
                const firstChild = sitemap.firstChild;
                const listItem = sitemap.insertBefore(document.createElement("li"), firstChild);
                listItem.classList.add("sitemap__section");
                const listButton = listItem.appendChild(document.createElement("button"));
                listButton.classList.add("sitemap__section-header");
                listButton.innerHTML = `
                <span lang="ja">???</span>
                <span lang="en" class="font-sans">Add Custom</span>
            `;
                listButton.addEventListener("click", UI.toggleAddDisplay);
            }
            UI.changeReviewElementCount();
        });
    }
    static toggleAddDisplay() {
        const outerDiv = document.querySelector(".addCardsPanelOuter");
        const display = outerDiv.style["display"];
        outerDiv.style["display"] = display === "none" ? "flex" : "none";
    }
    static addTypeChange() {
        const form = document.querySelector(".addTypeForm");
        const formData = new FormData(form);
        const addType = formData.get("addType");
        const itemType = formData.get("itemType");
        UI.removeAddDisplay();
        if (addType === "add") {
            if (itemType === "vocab") {
                UI.displayOptionsAddVocab();
            }
            else {
                UI.displayOptionsAddKanji();
            }
        }
        else {
            if (itemType === "vocab") {
                UI.displayOptionsImportVocab();
            }
            else {
                UI.displayOptionsImportKanji();
            }
        }
    }
    static removeAddDisplay() {
        const chooseDeck = document.querySelector("#chooseDeck");
        chooseDeck && chooseDeck.remove();
        const chooseDeckLabel = document.querySelector("#chooseDeckLabel");
        chooseDeckLabel && chooseDeckLabel.remove();
        UI.additionForm.innerHTML = "";
    }
    static displayOptionsAddVocab() {
        UI.additionForm.innerHTML = addVocab;
        UI.additionForm.onsubmit = (submitEvent) => {
            submitEvent.preventDefault();
            const form = submitEvent.target;
            if (Vocab.addVocab(form)) {
                UI.addTypeChange();
            }
        };
        const vocab = UI.additionForm.querySelector("#vocab");
        vocab.addEventListener("keyup", (keyboardEvent) => {
            if (keyboardEvent.code === "Enter") {
                UI.onVocabChange(keyboardEvent);
            }
        });
        ArrayInput.setupElementsOn(UI.additionForm);
    }
    static onVocabChange(changeEvent) {
        const kanji = UI.additionForm.querySelector("#kanjiComposition");
        console.log(changeEvent);
        const vocab = changeEvent.target;
        const vocabWord = vocab.value;
        (async () => {
            const kanjiCompositionArrayInput = new ArrayInput(kanji);
            kanjiCompositionArrayInput.clear();
            const regex = /[\u4e00-\u9faf]/g;
            vocabWord
                .match(regex)
                ?.filter((c, index, self) => self.indexOf(c) === index)
                ?.forEach(async (c) => {
                const newEntry = kanjiCompositionArrayInput.addField();
                const kanjiCharacter = newEntry.querySelector(".kanjiCompositionKanji");
                kanjiCharacter.value = c;
                const kanjiData = await KanjiApi.getKanji(c);
                const kanjiMeaning = newEntry.querySelector(".kanjiCompositionMeaning");
                kanjiMeaning.value = titleCase(kanjiData.meanings[0] ?? "");
                const kanjiReading = newEntry.querySelector(".kanjiCompositionReading");
                kanjiReading.value = katakanaToHiragana(kanjiData.on_readings[0] ?? "");
            });
        })();
        (async () => {
            const jishoResult = await Jisho.queryTerm(vocabWord);
            if (jishoResult.meta.status !== 200) {
                return;
            }
            const result = jishoResult.data[0];
            if (result === undefined) {
                return;
            }
            const filteredSenses = result.senses.filter((sense) => !sense.parts_of_speech.includes("Wikipedia definition"));
            const meanings = filteredSenses
                .map((sense) => sense.english_definitions[0] ?? "")
                .map((meaning) => titleCase(meaning));
            const meaningElement = UI.additionForm.querySelector("#meaning");
            const meaningArrayInput = new ArrayInput(meaningElement);
            meaningArrayInput.fill(meanings.length, (container, i) => {
                const inputField = container.querySelector(".arrayInputInput");
                inputField.value = meanings[i] ?? "";
            });
            const partsOfSpeech = filteredSenses
                .map((sense) => sense.parts_of_speech)
                .flat()
                .filter((val, i, self) => self.indexOf(val) === i);
            const partsOfSpeechElement = UI.additionForm.querySelector("#partsOfSpeech");
            const partsOfSpeechArrayInput = new ArrayInput(partsOfSpeechElement);
            partsOfSpeechArrayInput.fill(partsOfSpeech.length, (container, i) => {
                const inputField = container.querySelector(".arrayInputInput");
                inputField.value = partsOfSpeech[i];
            });
            const readings = result.japanese
                .filter((japanese) => japanese.word === vocabWord)
                .map((japanese) => japanese.reading);
            if (readings.length > 0) {
                const readingElement = UI.additionForm.querySelector("#reading");
                const readingArrayInput = new ArrayInput(readingElement);
                readingArrayInput.fill(readings.length, (container, i) => {
                    const inputField = container.querySelector(".arrayInputInput");
                    inputField.value = readings[i];
                });
            }
        })();
    }
    static displayOptionsAddKanji() {
        UI.additionForm.innerHTML = addKanji;
        UI.additionForm.onsubmit = (submitEvent) => {
            submitEvent.preventDefault();
            const target = submitEvent.target;
            if (Kanji.addKanji(target)) {
                UI.addTypeChange();
            }
        };
        ArrayInput.setupElementsOn(UI.additionForm);
    }
    static displayOptionsImportVocab() {
        const buttonLabel = UI.outerDiv.insertBefore(document.createElement("label"), UI.additionForm);
        buttonLabel.htmlFor = "chooseDeck";
        buttonLabel.textContent = "Choose deck";
        buttonLabel.id = "chooseDeckLabel";
        const buttonInput = UI.outerDiv.insertBefore(document.createElement("input"), UI.additionForm);
        buttonInput.type = "file";
        buttonInput.accept = "text/plain";
        buttonInput.id = "chooseDeck";
        buttonInput.onchange = UI.importVocabFileChange;
    }
    static importVocabFileChange(changeEvent) {
        const target = changeEvent.target;
        if (target.files === null) {
            return;
        }
        const file = target.files[0];
        if (file === undefined) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const target = event.target;
            const result = target.result;
            const firstLine = result.split("\n")[0] ?? "";
            const possibleOptions = firstLine.split("\t");
            const selectOptions = possibleOptions
                .map((elem, index) => {
                return `<option value="${index}">${elem}</option>`;
            })
                .join("\n");
            UI.additionForm.innerHTML = importVocab;
            UI.additionForm.onsubmit = (submitEvent) => {
                submitEvent.preventDefault();
                const form = submitEvent.target;
                if (Vocab.importVocab(form)) {
                    UI.addTypeChange();
                }
            };
            [...UI.additionForm.querySelectorAll("[to-fill='true']")].map((item) => (item.innerHTML += selectOptions));
        };
        fileReader.readAsText(file);
    }
    static displayOptionsImportKanji() {
        const buttonLabel = UI.outerDiv.insertBefore(document.createElement("label"), UI.additionForm);
        buttonLabel.htmlFor = "chooseDeck";
        buttonLabel.textContent = "Choose deck";
        buttonLabel.id = "chooseDeckLabel";
        const buttonInput = UI.outerDiv.insertBefore(document.createElement("input"), UI.additionForm);
        buttonInput.type = "file";
        buttonInput.accept = "text/plain";
        buttonInput.id = "chooseDeck";
        buttonInput.onchange = UI.importKanjiFileChange;
    }
    static importKanjiFileChange(changeEvent) {
        const target = changeEvent.target;
        const file = target.files?.[0];
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const target = event.target;
            const result = target.result;
            const firstLine = result.split("\n")[0] ?? "";
            const possibleOptions = firstLine.split("\t");
            const selectOptions = possibleOptions
                .map((elem, index) => {
                return `<option value="${index}">${elem}</option>`;
            })
                .join("\n");
            UI.additionForm.innerHTML = importKanji;
            UI.additionForm.onsubmit = (submitEvent) => {
                submitEvent.preventDefault();
                const form = submitEvent.target;
                if (Kanji.importKanji(form)) {
                    UI.addTypeChange();
                }
            };
            [...UI.additionForm.querySelectorAll("[to-fill='true']")].map((item) => (item.innerHTML += selectOptions));
        };
        if (file === undefined) {
            return;
        }
        fileReader.readAsText(file);
    }
    static changeReviewElementCount() {
        const reviewButton = document.querySelector(".lessons-and-reviews__reviews-button");
        if (reviewButton) {
            $.getJSON("/review/queue", (data) => {
                const count = data.length;
                UI.reviewCountToButtonClass(count, reviewButton);
                const numberSpan = document.querySelector(".lessons-and-reviews__reviews-button > span");
                numberSpan.textContent = count;
            });
            const lessonButton = document.querySelector(".lessons-and-reviews__lessons-button");
            $.getJSON("/lesson/queue", (data) => {
                const count = data.queue.length;
                UI.lessonCountToButtonClass(count, lessonButton);
                const numberSpan = document.querySelector(".lessons-and-reviews__lessons-button > span");
                numberSpan.textContent = count;
            });
        }
        const startReviewQueueCount = document.querySelector("#review-queue-count");
        if (startReviewQueueCount) {
            $.getJSON("/review/queue", (data) => {
                const count = data.length;
                const startReviewButton = document.querySelector("#start-session > a");
                if (count !== 0) {
                    startReviewButton.classList.remove("disabled");
                    startReviewButton.replaceWith(startReviewButton.cloneNode(true));
                }
                startReviewQueueCount.textContent = count;
            });
        }
        const startLessonQueueCount = document.querySelector("#lesson-queue-count");
        if (startLessonQueueCount) {
            $.getJSON("/lesson/queue", (data) => {
                const count = data.queue.length;
                const startLessonButton = document.querySelector("#start-session > a");
                if (count !== 0) {
                    startLessonButton.classList.remove("disabled");
                    startLessonButton.replaceWith(startLessonButton.cloneNode(true));
                }
                startLessonQueueCount.textContent = count;
            });
        }
    }
    static reviewCountToButtonClass(count, node) {
        const reviewStages = [0, 1, 50, 100, 250, 500, 1000];
        UI.countToButtonClass(count, node, "lessons-and-reviews__reviews-button--", reviewStages);
    }
    static lessonCountToButtonClass(count, node) {
        const lessonStages = [0, 1, 25, 50, 100, 250, 500];
        UI.countToButtonClass(count, node, "lessons-and-reviews__lessons-button--", lessonStages);
    }
    static countToButtonClass(count, node, base, stages) {
        for (const stage of stages) {
            node.classList.remove(base + stage);
        }
        for (let i = 0, len = stages.length - 1; i < len; i++) {
            if (count < (stages[i + 1] ?? 0)) {
                node.classList.add(base + stages[i]);
                return;
            }
        }
        node.classList.add(base + stages[stages.length - 1]);
    }
}

;// CONCATENATED MODULE: ./src/userscript.ts



const database = new Database();
(function () {
    "use strict";
    if ($ === undefined || $.jStorage === undefined) {
        return;
    }
    UI.setup();
    database.load();
    database.migrate();
    const originalAjax = $.ajax;
    $.ajax = ajaxOverride;
    function ajaxOverride(a, b) {
        if (typeof a === "string") {
            return originalAjax(a, b);
        }
        const data = a;
        if (data.url === "/json/progress" &&
            data.type === "PUT" &&
            data.dataType === "json") {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const incorrectData = data.data;
            for (const item in incorrectData) {
                if (item.startsWith("c")) {
                    const incorrectArray = incorrectData[item];
                    handleReviewCompleted(item, incorrectArray);
                    delete incorrectData[item];
                }
            }
            return originalAjax(data);
        }
        else if (data.url === "/json/lesson/completed" && data.type === "PUT") {
            //eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sessionData = data.data;
            for (const item of sessionData.keys.filter((id) => typeof id === "string" && id.startsWith("c"))) {
                handleLessonCompleted(item);
            }
            sessionData.keys = sessionData.keys.filter((item) => typeof item !== "string" || !item.startsWith("c"));
            return originalAjax(data);
        }
        else if (data.url === "/review/queue" &&
            data.type === "get" &&
            data.dataType === "json") {
            const originalSuccess = data.success;
            if (originalSuccess !== undefined) {
                data.success = (items, status, jqXHR) => {
                    originalSuccess(items.concat(database.getDueReviews().map((item) => {
                        return item.reviewData;
                    })), status, jqXHR);
                };
            }
            return originalAjax(data);
        }
        else if (data.url === "/lesson/queue" &&
            data.type === "get" &&
            data.dataType === "json") {
            const originalSuccess = data.success;
            data.success = (items, status, jqXHR) => {
                const additionalQueue = database.getDueLessons();
                const additionalRadicals = 0;
                const additionalKanji = additionalQueue.filter((item) => "kan" in item.reviewData).length;
                const additionalVocab = additionalQueue.filter((item) => "voc" in item.reviewData).length;
                items.count.rad += additionalRadicals;
                items.count.kan += additionalKanji;
                items.count.voc += additionalVocab;
                items.queue = items.queue.concat(additionalQueue.map((item) => item.lessonData));
                originalSuccess(items, status, jqXHR);
            };
            return originalAjax(data);
        }
        else if (data.url?.startsWith("/json/") &&
            data.type === "get" &&
            data.dataType === "json") {
            const result = database.fromJSONEndpoint(data.url);
            if (result) {
                const success = data.success;
                success(result);
                return originalAjax({});
            }
        }
        return originalAjax(data);
    }
})();

})();

/******/ })()
;