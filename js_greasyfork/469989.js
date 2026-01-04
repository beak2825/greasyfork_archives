// ==UserScript==
// @name          Cowordle Solver
// @namespace     https://tampermonkey.net/
// @version       1.0.1
// @description   Get the competitive edge in Cowordle! Receive word suggestions based on the results of your previous answers (bad letters, valid letters, correct letters)!
// @author        Rijndael
// @license       Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)
// @match         https://cowordle.org/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=cowordle.org
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/469989/Cowordle%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/469989/Cowordle%20Solver.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.watermark {
  width: 1000px;
  max-width: 100%;
  padding: 0 15px;
  font-size: 10px;
  margin: 0 auto 4px;
}
.watermark-link {
  text-decoration: none;
  color: inherit;
}
.watermark-link:hover {
  text-decoration: underline;
}
.cowordle-solver-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  background: #414458;
  padding: 16px;
  border-radius: 16px;
  font-weight: 600;
  color: white;
}
`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__("./node_modules/style-loader/dist/runtime/styleDomAPI.js");
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
var insertBySelector = __webpack_require__("./node_modules/style-loader/dist/runtime/insertBySelector.js");
var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__("./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__("./node_modules/style-loader/dist/runtime/insertStyleElement.js");
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__("./node_modules/style-loader/dist/runtime/styleTagTransform.js");
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less
var main = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/less-loader/dist/cjs.js!./src/style/main.less");
;// CONCATENATED MODULE: ./src/style/main.less

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(main/* default */.Z, options);




       /* harmony default export */ const style_main = (main/* default */.Z && main/* default */.Z.locals ? main/* default */.Z.locals : undefined);

;// CONCATENATED MODULE: ./data/words.json
const words_namespaceObject = JSON.parse('["AAHED","AALII","AARGH","ABACA","ABACI","ABACK","ABAFT","ABAKA","ABAMP","ABASE","ABASH","ABATE","ABAYA","ABBAS","ABBES","ABBEY","ABBOT","ABEAM","ABELE","ABETS","ABHOR","ABIDE","ABLED","ABLER","ABLES","ABMHO","ABODE","ABOHM","ABOIL","ABOMA","ABOON","ABORT","ABOUT","ABOVE","ABRIS","ABUSE","ABUTS","ABUZZ","ABYES","ABYSM","ABYSS","ACAIS","ACARI","ACERB","ACETA","ACHED","ACHES","ACHOO","ACIDS","ACIDY","ACING","ACINI","ACKEE","ACMES","ACMIC","ACNED","ACNES","ACOCK","ACOLD","ACORN","ACRED","ACRES","ACRID","ACROS","ACTED","ACTIN","ACTOR","ACUTE","ACYLS","ADAGE","ADAPT","ADBOT","ADDAX","ADDED","ADDER","ADDLE","ADEEM","ADEPT","ADIEU","ADIOS","ADITS","ADMAN","ADMEN","ADMIN","ADMIT","ADMIX","ADOBE","ADOBO","ADOPT","ADORE","ADORN","ADOWN","ADOZE","ADULT","ADUNC","ADUST","ADYTA","ADZED","ADZES","AECIA","AEDES","AEGIS","AEONS","AERIE","AFARS","AFFIX","AFIRE","AFOOT","AFORE","AFOUL","AFRIT","AFROS","AFTER","AGAIN","AGAMA","AGAPE","AGARS","AGATE","AGAVE","AGAZE","AGENE","AGENT","AGERS","AGGER","AGGIE","AGGRO","AGHAS","AGILE","AGING","AGIOS","AGISM","AGIST","AGITA","AGLEE","AGLET","AGLEY","AGLOO","AGLOW","AGLUS","AGMAS","AGONE","AGONS","AGONY","AGORA","AGREE","AGRIA","AGROS","AGUED","AGUES","AHEAD","AHING","AHOLD","AHULL","AIDED","AIDER","AIDES","AILED","AIMED","AIMER","AIOLI","AIRED","AIRER","AIRNS","AIRTH","AIRTS","AISLE","AITCH","AIVER","AIYEE","AJIVA","AJUGA","AKEES","AKELA","AKENE","ALACK","ALAMO","ALAND","ALANE","ALANG","ALANS","ALANT","ALARM","ALARY","ALATE","ALBAS","ALBUM","ALCID","ALDER","ALDOL","ALECS","ALEFS","ALEPH","ALERT","ALFAS","ALGAE","ALGAL","ALGAS","ALGID","ALGIN","ALGOR","ALGUM","ALIAS","ALIBI","ALIEN","ALIFS","ALIGN","ALIKE","ALINE","ALIST","ALIVE","ALIYA","ALKIE","ALKYD","ALKYL","ALLAY","ALLEE","ALLEY","ALLOD","ALLOT","ALLOW","ALLOY","ALLYL","ALMAH","ALMAS","ALMEH","ALMES","ALMUD","ALMUG","ALOES","ALOFT","ALOHA","ALOIN","ALONE","ALONG","ALOOF","ALOUD","ALPHA","ALTAR","ALTER","ALTHO","ALTOS","ALULA","ALUMS","ALVAR","ALWAY","AMAHS","AMAIN","AMASS","AMAZE","AMBER","AMBIT","AMBLE","AMBOS","AMBRY","AMEBA","AMEER","AMEND","AMENS","AMENT","AMIAS","AMICE","AMICI","AMIDE","AMIDO","AMIDS","AMIES","AMIGA","AMIGO","AMINE","AMINO","AMINS","AMIRS","AMISS","AMITY","AMMOS","AMNIA","AMNIC","AMNIO","AMOKS","AMOLE","AMONG","AMORT","AMOUR","AMPED","AMPLE","AMPLY","AMPUL","AMRIT","AMUCK","AMUSE","AMYLS","ANCHO","ANCON","ANDRO","ANEAR","ANELE","ANENT","ANGAS","ANGEL","ANGER","ANGLE","ANGLO","ANGRY","ANGST","ANILE","ANILS","ANIMA","ANIME","ANIMI","ANION","ANISE","ANKHS","ANKLE","ANKUS","ANLAS","ANNAL","ANNAS","ANNEX","ANNOY","ANNUL","ANOAS","ANODE","ANOLE","ANOMY","ANSAE","ANTAE","ANTAS","ANTED","ANTES","ANTIC","ANTIS","ANTRA","ANTRE","ANTSY","ANURA","ANVIL","ANYON","AORTA","APACE","APART","APEAK","APEEK","APERS","APERY","APHID","APHIS","APIAN","APING","APISH","APNEA","APODS","APORT","APPAL","APPEL","APPLE","APPLY","APRES","APRON","APSES","APSIS","APTER","APTLY","AQUAE","AQUAS","ARAKS","ARAME","ARBOR","ARCED","ARCHI","ARCUS","ARDEB","ARDOR","AREAE","AREAL","AREAS","ARECA","AREIC","ARENA","ARENE","AREPA","ARETE","ARGAL","ARGIL","ARGLE","ARGOL","ARGON","ARGOT","ARGUE","ARGUS","ARHAT","ARIAS","ARIEL","ARILS","ARISE","ARLES","ARMED","ARMER","ARMET","ARMOR","AROID","AROMA","AROSE","ARPEN","ARRAS","ARRAY","ARRIS","ARROW","ARROZ","ARSES","ARSIS","ARSON","ARTAL","ARTEL","ARTSY","ARUMS","ARVAL","ARVOS","ARYLS","ASANA","ASCON","ASCOT","ASCUS","ASDIC","ASHED","ASHEN","ASHES","ASIDE","ASKED","ASKER","ASKEW","ASKOI","ASKOS","ASPEN","ASPER","ASPIC","ASPIS","ASSAI","ASSAY","ASSES","ASSET","ASTER","ASTIR","ASURA","ASWIM","ASYLA","ATAPS","ATAXY","ATIGI","ATILT","ATLAS","ATMAN","ATMAS","ATOLL","ATOMS","ATOMY","ATONE","ATONY","ATOPY","ATRIA","ATRIP","ATTAR","ATTIC","AUDAD","AUDIO","AUDIT","AUGER","AUGHT","AUGUR","AULIC","AUNTS","AUNTY","AURAE","AURAL","AURAR","AURAS","AUREI","AURES","AURIC","AURIS","AURUM","AUTOS","AUXIN","AVAIL","AVANT","AVAST","AVENS","AVERS","AVERT","AVGAS","AVIAN","AVION","AVISO","AVOID","AVOWS","AWAIT","AWAKE","AWARD","AWARE","AWASH","AWFUL","AWING","AWNED","AWOKE","AWOLS","AXELS","AXIAL","AXILE","AXILS","AXING","AXIOM","AXION","AXITE","AXLED","AXLES","AXMAN","AXMEN","AXONE","AXONS","AYAHS","AYAYA","AYINS","AZANS","AZIDE","AZIDO","AZINE","AZLON","AZOIC","AZOLE","AZONS","AZOTE","AZOTH","AZUKI","AZURE","BAAED","BAALS","BABAS","BABEL","BABES","BABKA","BABOO","BABUL","BABUS","BACCA","BACCY","BACKS","BACON","BADDY","BADGE","BADLY","BAFFS","BAFFY","BAGEL","BAGGY","BAHTS","BAILS","BAIRN","BAITH","BAITS","BAIZA","BAIZE","BAKED","BAKER","BAKES","BALAS","BALDS","BALDY","BALED","BALER","BALES","BALKS","BALKY","BALLS","BALLY","BALMS","BALMY","BALSA","BALTI","BANAL","BANCO","BANCS","BANDA","BANDS","BANDY","BANED","BANES","BANGS","BANJO","BANKS","BANNS","BANTY","BARBE","BARBS","BARCA","BARDE","BARDS","BARED","BARER","BARES","BARFI","BARFS","BARGE","BARIC","BARKS","BARKY","BARMS","BARMY","BARNS","BARNY","BARON","BARRE","BARRY","BARYE","BASAL","BASED","BASER","BASES","BASIC","BASIL","BASIN","BASIS","BASKS","BASSI","BASSO","BASSY","BASTE","BASTS","BATCH","BATED","BATES","BATHE","BATHS","BATIK","BATON","BATTS","BATTU","BATTY","BAUDS","BAULK","BAWDS","BAWDY","BAWKS","BAWLS","BAWNS","BAWTY","BAYED","BAYER","BAYOU","BAZAR","BAZOO","BEACH","BEADS","BEADY","BEAKS","BEAKY","BEALS","BEAMS","BEAMY","BEANO","BEANS","BEARD","BEARS","BEAST","BEATS","BEAUS","BEAUT","BEAUX","BEBOP","BECAP","BECKS","BEDAD","BEDEL","BEDEW","BEDIM","BEECH","BEEDI","BEEFS","BEEFY","BEEPS","BEERS","BEERY","BEETS","BEFIT","BEFOG","BEGAD","BEGAN","BEGAT","BEGEM","BEGET","BEGIN","BEGOT","BEGUM","BEGUN","BEIGE","BEIGY","BEING","BELAY","BELCH","BELGA","BELIE","BELLE","BELLS","BELLY","BELON","BELOW","BELTS","BEMAS","BEMIX","BENCH","BENDS","BENDY","BENES","BENNE","BENNI","BENNY","BENTO","BENTS","BERET","BERGS","BERKS","BERME","BERMS","BERRY","BERTH","BERYL","BESES","BESET","BESOM","BESOT","BESTS","BETAS","BETEL","BETHS","BETON","BETTA","BEVEL","BEVOR","BEVVY","BEWIG","BEZEL","BEZIL","BHAJI","BHANG","BHOOT","BHUTS","BIALI","BIALY","BIBBS","BIBES","BIBLE","BICEP","BICES","BIDDY","BIDED","BIDER","BIDES","BIDET","BIDIS","BIELD","BIERS","BIFFS","BIFFY","BIFID","BIGGY","BIGHT","BIGLY","BIGOS","BIGOT","BIJOU","BIKED","BIKER","BIKES","BIKIE","BILBO","BILBY","BILES","BILGE","BILGY","BILKS","BILLS","BILLY","BIMAH","BIMAS","BIMBO","BINAL","BINDI","BINDS","BINER","BINES","BINGE","BINGO","BINIT","BINTS","BIOGS","BIOME","BIONT","BIOTA","BIPED","BIPOD","BIRCH","BIRDS","BIRKS","BIRLE","BIRLS","BIROS","BIRRS","BIRSE","BIRTH","BISES","BISKS","BISON","BITCH","BITER","BITES","BITSY","BITTS","BITTY","BIZES","BLABS","BLACK","BLADE","BLAFF","BLAGS","BLAHS","BLAIN","BLAME","BLAMS","BLAND","BLANK","BLARE","BLASE","BLAST","BLATE","BLATS","BLAWN","BLAWS","BLAZE","BLEAK","BLEAR","BLEAT","BLEBS","BLECH","BLEED","BLEEP","BLEND","BLENT","BLESS","BLEST","BLETS","BLIMP","BLIMY","BLIND","BLING","BLINI","BLINK","BLINY","BLIPS","BLISS","BLITE","BLITZ","BLOAT","BLOBS","BLOCK","BLOCS","BLOGS","BLOKE","BLOND","BLOOD","BLOOM","BLOOP","BLOTS","BLOWN","BLOWS","BLOWY","BLUBS","BLUED","BLUER","BLUES","BLUET","BLUEY","BLUFF","BLUME","BLUNT","BLURB","BLURS","BLURT","BLUSH","BLYPE","BOARD","BOARS","BOART","BOAST","BOATS","BOBBY","BOBOS","BOCCE","BOCCI","BOCHE","BOCKS","BODED","BODES","BOEUF","BOFFO","BOFFS","BOGAN","BOGEY","BOGGY","BOGIE","BOGLE","BOGUS","BOHEA","BOHOS","BOILS","BOING","BOINK","BOITE","BOLAR","BOLAS","BOLDS","BOLES","BOLLS","BOLOS","BOLTS","BOLUS","BOMBE","BOMBS","BONCE","BONDS","BONED","BONER","BONES","BONEY","BONGO","BONGS","BONKS","BONNE","BONNY","BONUS","BONZE","BOOBS","BOOBY","BOODY","BOOED","BOOGY","BOOKS","BOOMS","BOOMY","BOONS","BOORS","BOOST","BOOTH","BOOTS","BOOTY","BOOZE","BOOZY","BOPPY","BORAL","BORAS","BORAX","BORED","BORER","BORES","BORIC","BORKS","BORNE","BORON","BORTS","BORTY","BORTZ","BOSKS","BOSKY","BOSOM","BOSON","BOSSY","BOSUN","BOTAS","BOTCH","BOTEL","BOTHY","BOTTS","BOUGH","BOULE","BOULT","BOUND","BOURG","BOURN","BOUSE","BOUSY","BOUTS","BOVID","BOWED","BOWEL","BOWER","BOWLS","BOWSE","BOXED","BOXER","BOXES","BOXLA","BOYAR","BOYLA","BOYOS","BOZOS","BRACE","BRACH","BRACT","BRADS","BRAES","BRAGS","BRAID","BRAIL","BRAIN","BRAKE","BRAKY","BRAND","BRANK","BRANS","BRANT","BRASH","BRASS","BRATS","BRAVA","BRAVE","BRAVI","BRAVO","BRAWL","BRAWN","BRAWS","BRAXY","BRAYS","BRAZA","BRAZE","BREAD","BREAK","BREAM","BREDE","BREED","BREES","BRENS","BRENT","BREVE","BREWS","BRIAR","BRIBE","BRICK","BRIDE","BRIEF","BRIER","BRIES","BRIGS","BRILL","BRIMS","BRINE","BRING","BRINK","BRINS","BRINY","BRIOS","BRISK","BRISS","BRITH","BRITS","BRITT","BROAD","BROCH","BROCK","BROIL","BROKE","BROME","BROMO","BRONC","BROOD","BROOK","BROOM","BROOS","BROSE","BROSY","BROTH","BROWN","BROWS","BRUGH","BRUIN","BRUIT","BRUME","BRUNG","BRUNT","BRUSH","BRUSK","BRUTE","BRUTS","BUBAL","BUBBA","BUBBE","BUBBY","BUBUS","BUCKO","BUCKS","BUDDY","BUDGE","BUFFI","BUFFO","BUFFS","BUFFY","BUGGY","BUGLE","BUHLS","BUHRS","BUILD","BUILT","BULBS","BULGE","BULGY","BULKS","BULKY","BULLA","BULLS","BULLY","BUMFS","BUMPH","BUMPS","BUMPY","BUNAS","BUNCH","BUNCO","BUNDS","BUNDT","BUNGS","BUNKO","BUNKS","BUNNS","BUNNY","BUNTS","BUNYA","BUOYS","BUPPY","BURAN","BURAS","BURBS","BURDS","BURET","BURFI","BURGH","BURGS","BURIN","BURKA","BURKE","BURKS","BURLS","BURLY","BURNS","BURNT","BURPS","BURQA","BURRO","BURRS","BURRY","BURSA","BURSE","BURST","BUSBY","BUSED","BUSES","BUSHY","BUSKS","BUSTS","BUSTY","BUTCH","BUTEO","BUTES","BUTLE","BUTOH","BUTTE","BUTTS","BUTTY","BUTUT","BUTYL","BUXOM","BUYER","BUZZY","BWANA","BYLAW","BYRES","BYRLS","BYSSI","BYTES","BYWAY","CABAL","CABBY","CABER","CABIN","CABLE","CABOB","CACAO","CACAS","CACHE","CACTI","CADDY","CADES","CADET","CADGE","CADGY","CADIS","CADRE","CAECA","CAFES","CAFFS","CAGED","CAGER","CAGES","CAGEY","CAHOW","CAIDS","CAINS","CAIRD","CAIRN","CAJON","CAKED","CAKES","CAKEY","CALFS","CALIF","CALIX","CALKS","CALLA","CALLS","CALMS","CALOS","CALVE","CALYX","CAMAS","CAMEL","CAMEO","CAMES","CAMIS","CAMOS","CAMPI","CAMPO","CAMPS","CAMPY","CANAL","CANDY","CANED","CANER","CANES","CANID","CANNA","CANNY","CANOE","CANON","CANSO","CANST","CANTO","CANTS","CANTY","CAPED","CAPER","CAPES","CAPHS","CAPIZ","CAPON","CAPOS","CAPOT","CAPRI","CAPUT","CARAT","CARBO","CARBS","CARDS","CARED","CARER","CARES","CARET","CAREX","CARGO","CARKS","CARLE","CARLS","CARNS","CARNY","CAROB","CAROL","CAROM","CARPI","CARPS","CARRS","CARRY","CARSE","CARTE","CARTS","CARVE","CASAS","CASED","CASES","CASKS","CASKY","CASTE","CASTS","CASUS","CATCH","CATER","CATES","CATTY","CAULD","CAULK","CAULS","CAURI","CAUSE","CAVAS","CAVED","CAVER","CAVES","CAVIE","CAVIL","CAWED","CEASE","CEBID","CECAL","CECUM","CEDAR","CEDED","CEDER","CEDES","CEDIS","CEIBA","CEILI","CEILS","CELEB","CELLA","CELLI","CELLO","CELLS","CELOM","CELTS","CENSE","CENTO","CENTS","CENTU","CEORL","CEPES","CERCI","CERED","CERES","CERIA","CERIC","CEROS","CERTS","CESTA","CESTI","CETES","CHADS","CHAFE","CHAFF","CHAIN","CHAIR","CHAIS","CHALK","CHAMP","CHAMS","CHANA","CHANG","CHANT","CHAOS","CHAPE","CHAPS","CHAPT","CHARD","CHARE","CHARK","CHARM","CHARR","CHARS","CHART","CHARY","CHASE","CHASM","CHATS","CHAWS","CHAYS","CHEAP","CHEAT","CHECK","CHEEK","CHEEP","CHEER","CHEFS","CHELA","CHEMO","CHEMS","CHERT","CHESS","CHEST","CHETH","CHEVY","CHEWS","CHEWY","CHIAO","CHIAS","CHICA","CHICK","CHICO","CHICS","CHIDE","CHIEF","CHIEL","CHILD","CHILE","CHILI","CHILL","CHIMB","CHIME","CHIMP","CHINA","CHINE","CHING","CHINK","CHINO","CHINS","CHIPS","CHIRK","CHIRM","CHIRO","CHIRP","CHIRR","CHIRU","CHITS","CHIVE","CHIVY","CHOCK","CHOCS","CHOIL","CHOIR","CHOKE","CHOKY","CHOLA","CHOLI","CHOLO","CHOMP","CHONS","CHOOK","CHOPS","CHORD","CHORE","CHOSE","CHOTT","CHOWS","CHUBS","CHUCK","CHUFA","CHUFF","CHUGS","CHUMP","CHUMS","CHUNK","CHURL","CHURN","CHURR","CHUSE","CHUTE","CHYLE","CHYME","CIBOL","CIDER","CIGAR","CIGGY","CILIA","CIMEX","CINCH","CINES","CINQS","CIONS","CIRCA","CIRCS","CIRES","CIRRI","CISCO","CISSY","CISTS","CITED","CITER","CITES","CIVET","CIVIC","CIVIE","CIVIL","CIVVY","CLACH","CLACK","CLADE","CLADS","CLAGS","CLAIM","CLAMP","CLAMS","CLANG","CLANK","CLANS","CLAPS","CLAPT","CLARO","CLARY","CLASH","CLASP","CLASS","CLAST","CLAVE","CLAVI","CLAWS","CLAYS","CLEAN","CLEAR","CLEAT","CLEEK","CLEFS","CLEFT","CLEGS","CLEPE","CLEPT","CLERK","CLEWS","CLICK","CLIFF","CLIFT","CLIMB","CLIME","CLINE","CLING","CLINK","CLIPS","CLIPT","CLITS","CLOAK","CLOCK","CLODS","CLOGS","CLOMB","CLOMP","CLONE","CLONK","CLONS","CLOOT","CLOPS","CLOSE","CLOTH","CLOTS","CLOUD","CLOUR","CLOUT","CLOVE","CLOWN","CLOYS","CLOZE","CLUBS","CLUCK","CLUED","CLUES","CLUMP","CLUNG","CLUNK","CNIDA","COACH","COACT","COADY","COALA","COALS","COALY","COAPT","COAST","COATI","COATS","COBBS","COBBY","COBIA","COBLE","COBRA","COCAS","COCCI","COCKS","COCKY","COCOA","COCOS","CODAS","CODEC","CODED","CODEN","CODER","CODES","CODEX","CODON","COEDS","COFFS","COGON","COHOE","COHOG","COHOS","COIFS","COIGN","COILS","COINS","COIRS","COKED","COKES","COLAS","COLBY","COLDS","COLED","COLES","COLIC","COLIN","COLLY","COLOG","COLON","COLOR","COLTS","COLZA","COMAE","COMAL","COMAS","COMBE","COMBI","COMBO","COMBS","COMER","COMES","COMET","COMFY","COMIC","COMIX","COMMA","COMMO","COMMS","COMMY","COMPO","COMPS","COMPT","COMTE","CONCH","CONDO","CONED","CONES","CONEY","CONGA","CONGE","CONGO","CONIC","CONIN","CONKS","CONKY","CONNS","CONTE","CONTO","CONUS","COOCH","COOED","COOEE","COOER","COOEY","COOFS","COOKS","COOKY","COOLS","COOLY","COOMB","COONS","COOPS","COOPT","COOTS","COPAL","COPAY","COPED","COPEN","COPER","COPES","COPRA","COPSE","COPSY","COQUI","CORAL","CORBY","CORDS","CORED","CORER","CORES","CORGI","CORIA","CORKS","CORKY","CORMS","CORNS","CORNU","CORNY","CORPS","CORSE","COSEC","COSES","COSET","COSEY","COSIE","COSTA","COSTS","COTAN","COTED","COTES","COTTA","COUCH","COUDE","COUGH","COULD","COUNT","COUPE","COUPS","COURT","COUTH","COVED","COVEN","COVER","COVES","COVET","COVEY","COVIN","COWED","COWER","COWLS","COWRY","COXAE","COXAL","COXED","COXES","COYAU","COYED","COYER","COYLY","COYPU","COZEN","COZES","COZEY","COZIE","CRAAL","CRABS","CRACK","CRAFT","CRAGS","CRAKE","CRAMP","CRAMS","CRANE","CRANK","CRAPE","CRAPS","CRASH","CRASS","CRATE","CRAVE","CRAWL","CRAWS","CRAZE","CRAZY","CREAK","CREAM","CREDO","CREDS","CREED","CREEK","CREEL","CREEP","CREME","CREPE","CREPT","CREPY","CRESS","CREST","CREWS","CRIBS","CRICK","CRIED","CRIER","CRIES","CRIME","CRIMP","CRIPE","CRIPS","CRISP","CRITS","CROAK","CROCI","CROCK","CROCS","CROFT","CRONE","CRONY","CROOK","CROON","CROPS","CRORE","CROSS","CROUP","CROWD","CROWN","CROWS","CROZE","CRUCK","CRUDE","CRUDO","CRUDS","CRUEL","CRUET","CRUFT","CRUMB","CRUMP","CRUNK","CRUOR","CRURA","CRUSE","CRUSH","CRUST","CRWTH","CRYER","CRYPT","CUBBY","CUBEB","CUBED","CUBER","CUBES","CUBIC","CUBIT","CUDDY","CUFFS","CUIFS","CUING","CUISH","CUKES","CULCH","CULET","CULEX","CULLS","CULLY","CULMS","CULPA","CULTI","CULTS","CUMIN","CUNIT","CUNTS","CUPEL","CUPID","CUPPA","CUPPY","CURBS","CURCH","CURDS","CURDY","CURED","CURER","CURES","CURET","CURFS","CURIA","CURIE","CURIO","CURLS","CURLY","CURNS","CURRS","CURRY","CURSE","CURST","CURVE","CURVY","CUSEC","CUSHY","CUSKS","CUSPS","CUSSO","CUTCH","CUTER","CUTES","CUTEY","CUTIE","CUTIN","CUTIS","CUTTY","CUTUP","CUVEE","CUZES","CYANO","CYANS","CYBER","CYCAD","CYCAS","CYCLE","CYCLO","CYDER","CYLIX","CYMAE","CYMAR","CYMAS","CYMES","CYMOL","CYNIC","CYSTS","CYTON","CZARS","DACES","DACHA","DADAS","DADDY","DADOS","DAFFS","DAFFY","DAGGA","DAGOS","DAHLS","DAILY","DAIRY","DAISY","DALES","DALLY","DAMAN","DAMAR","DAMES","DAMNS","DAMPS","DANCE","DANDY","DANGS","DANIO","DARBS","DARED","DARER","DARES","DARIC","DARKS","DARKY","DARNS","DARTS","DASHI","DASHY","DATED","DATER","DATES","DATOS","DATTO","DATUM","DAUBE","DAUBS","DAUBY","DAUNT","DAUTS","DAVEN","DAVIT","DAWED","DAWEN","DAWKS","DAWNS","DAWTS","DAZED","DAZES","DEADS","DEAIR","DEALS","DEALT","DEANS","DEARS","DEARY","DEASH","DEATH","DEAVE","DEBAG","DEBAR","DEBIT","DEBTS","DEBUG","DEBUR","DEBUT","DEBYE","DECAF","DECAL","DECAN","DECAY","DECKS","DECOR","DECOS","DECOY","DECRY","DEDAL","DEEDS","DEEDY","DEEMS","DEEPS","DEERS","DEETS","DEFAT","DEFER","DEFIS","DEFOG","DEGAS","DEGUM","DEICE","DEIFY","DEIGN","DEILS","DEISM","DEIST","DEITY","DEKED","DEKES","DEKKO","DELAY","DELED","DELES","DELFS","DELFT","DELIS","DELLS","DELLY","DELTA","DELTS","DELVE","DEMES","DEMIC","DEMIT","DEMOB","DEMOI","DEMON","DEMOS","DEMUR","DENAR","DENES","DENIM","DENSE","DENTS","DEOXY","DEPOT","DEPTH","DERAT","DERAY","DERBY","DERMA","DERMS","DERRY","DESEX","DESHI","DESIS","DESKS","DETER","DETOX","DEUCE","DEVAS","DEVEL","DEVIL","DEVIS","DEVON","DEWAN","DEWAR","DEWAX","DEWED","DEXES","DEXIE","DHAKS","DHALS","DHIKR","DHOBI","DHOLE","DHOTI","DHOWS","DHUTI","DIALS","DIARY","DIAZO","DICED","DICER","DICES","DICEY","DICKS","DICKY","DICOT","DICTA","DICTY","DIDIE","DIDOS","DIDST","DIENE","DIETS","DIFFS","DIGHT","DIGIT","DIKED","DIKER","DIKES","DIKEY","DILDO","DILLS","DILLY","DIMER","DIMES","DIMLY","DINAR","DINED","DINER","DINES","DINGE","DINGO","DINGS","DINGY","DINKS","DINKY","DINOS","DINTS","DIODE","DIOLS","DIPPY","DIPSO","DIRAM","DIRER","DIRGE","DIRKS","DIRLS","DIRTS","DIRTY","DISCI","DISCO","DISCS","DISHY","DISKS","DISME","DITAS","DITCH","DITES","DITSY","DITTO","DITTY","DITZY","DIVAN","DIVAS","DIVED","DIVER","DIVES","DIVOT","DIVVY","DIWAN","DIXIT","DIZEN","DIZZY","DJINN","DJINS","DOATS","DOBBY","DOBES","DOBIE","DOBLA","DOBRA","DOBRO","DOCKS","DODGE","DODGY","DODOS","DOERS","DOEST","DOETH","DOFFS","DOGAN","DOGES","DOGEY","DOGGO","DOGGY","DOGIE","DOGMA","DOILY","DOING","DOITS","DOJOS","DOLCE","DOLCI","DOLED","DOLES","DOLLS","DOLLY","DOLMA","DOLOR","DOLTS","DOMAL","DOMED","DOMES","DOMIC","DONAS","DONEE","DONGA","DONGS","DONNA","DONNE","DONOR","DONSY","DONUT","DOOBS","DOODY","DOOLY","DOOMS","DOOMY","DOORS","DOOZY","DOPAS","DOPED","DOPER","DOPES","DOPEY","DORES","DORKS","DORKY","DORMS","DORMY","DORPS","DORRS","DORSA","DORTY","DOSAI","DOSAS","DOSED","DOSER","DOSES","DOSHA","DOTAL","DOTED","DOTER","DOTES","DOTTY","DOUBT","DOUCE","DOUGH","DOULA","DOUMA","DOUMS","DOURA","DOUSE","DOUTS","DOVEN","DOVES","DOWDY","DOWED","DOWEL","DOWER","DOWIE","DOWNS","DOWNY","DOWRY","DOWSE","DOXIE","DOYEN","DOYLY","DOZED","DOZEN","DOZER","DOZES","DRABS","DRAFF","DRAFT","DRAGS","DRAIL","DRAIN","DRAKE","DRAMA","DRAMS","DRANK","DRAPE","DRATS","DRAVE","DRAWL","DRAWN","DRAWS","DRAYS","DREAD","DREAM","DREAR","DRECK","DREED","DREES","DREGS","DREKS","DRESS","DREST","DRIBS","DRIED","DRIER","DRIES","DRIFT","DRILL","DRILY","DRINK","DRIPS","DRIPT","DRIVE","DROID","DROIT","DROKE","DROLL","DRONE","DROOL","DROOP","DROPS","DROPT","DROSS","DROUK","DROVE","DROWN","DRUBS","DRUGS","DRUID","DRUMS","DRUNK","DRUPE","DRUSE","DRYAD","DRYAS","DRYER","DRYLY","DUADS","DUALS","DUCAL","DUCAT","DUCES","DUCHY","DUCKS","DUCKY","DUCTS","DUDDY","DUDED","DUDES","DUELS","DUETS","DUFFS","DUFUS","DUITS","DUKED","DUKES","DULCE","DULIA","DULLS","DULLY","DULSE","DUMAS","DUMBO","DUMBS","DUMKA","DUMKY","DUMMY","DUMPS","DUMPY","DUNAM","DUNCE","DUNCH","DUNES","DUNGS","DUNGY","DUNKS","DUNNO","DUNTS","DUOMI","DUOMO","DUPED","DUPER","DUPES","DUPLE","DURAL","DURAS","DURED","DURES","DURNS","DUROC","DUROS","DURRA","DURRS","DURST","DURUM","DUSKS","DUSKY","DUSTS","DUSTY","DUTCH","DUVET","DWALE","DWARF","DWEEB","DWELL","DWELT","DWINE","DYADS","DYERS","DYING","DYKED","DYKES","DYKEY","DYNEL","DYNES","EAGER","EAGLE","EAGRE","EARED","EARLS","EARLY","EARNS","EARTH","EASED","EASEL","EASER","EASES","EASTS","EATEN","EATER","EAVED","EAVES","EBBED","EBBET","EBONS","EBONY","EBOOK","ECHED","ECHES","ECHOS","ECLAT","ECRUS","EDEMA","EDGED","EDGER","EDGES","EDICT","EDIFY","EDILE","EDITS","EDUCE","EDUCT","EEJIT","EENSY","EERIE","EGADS","EGERS","EGEST","EGGAR","EGGED","EGGER","EGRET","EIDER","EIDOS","EIGHT","EIKON","EJECT","EJIDO","EKING","EKKAS","ELAIN","ELAND","ELANS","ELATE","ELBOW","ELDER","ELECT","ELEGY","ELEMI","ELFIN","ELIDE","ELINT","ELITE","ELOIN","ELOPE","ELUDE","ELUTE","ELVEN","ELVER","ELVES","EMAIL","EMBAR","EMBAY","EMBED","EMBER","EMBOW","EMCEE","EMEER","EMEND","EMERG","EMERY","EMEUS","EMICS","EMIRS","EMITS","EMMER","EMMET","EMMYS","EMOTE","EMPTY","EMYDE","EMYDS","ENACT","ENATE","ENDED","ENDER","ENDOW","ENDUE","ENEMA","ENEMY","ENJOY","ENNUI","ENOKI","ENOLS","ENORM","ENOWS","ENROL","ENSKY","ENSUE","ENTER","ENTIA","ENTRY","ENURE","ENVOI","ENVOY","ENZYM","EOSIN","EPACT","EPEES","EPHAH","EPHAS","EPHOD","EPHOR","EPICS","EPOCH","EPODE","EPOXY","EQUAL","EQUES","EQUID","EQUIP","ERASE","ERECT","ERGOT","ERICA","ERNES","ERODE","EROSE","ERRED","ERROR","ERSES","ERUCT","ERUGO","ERUPT","ERUVS","ERVIL","ESCAR","ESCOT","ESKAR","ESKER","ESNES","ESSAY","ESSES","ESTER","ESTOP","ETAPE","ETHER","ETHIC","ETHOS","ETHYL","ETICS","ETNAS","ETUDE","ETUIS","ETWEE","ETYMA","EUROS","EVADE","EVENS","EVENT","EVERT","EVERY","EVICT","EVILS","EVITE","EVOKE","EWERS","EXACT","EXALT","EXAMS","EXCEL","EXECS","EXERT","EXILE","EXINE","EXING","EXIST","EXITS","EXONS","EXPAT","EXPEL","EXPOS","EXTOL","EXTRA","EXUDE","EXULT","EXURB","EYASS","EYERS","EYING","EYRAS","EYRES","EYRIE","EYRIR","FABLE","FACED","FACER","FACES","FACET","FACIA","FACTA","FACTS","FADDY","FADED","FADER","FADES","FADGE","FADOS","FAENA","FAERY","FAFFS","FAGGY","FAGIN","FAGOT","FAILS","FAINT","FAIRS","FAIRY","FAITH","FAKED","FAKER","FAKES","FAKEY","FAKIE","FAKIR","FALLS","FALSE","FAMED","FAMES","FANCY","FANES","FANGA","FANGS","FANNY","FANON","FANOS","FANUM","FAQIR","FARAD","FARCE","FARCI","FARCY","FARDS","FARED","FARER","FARES","FARLE","FARLS","FARMS","FAROS","FARTS","FASTS","FATAL","FATED","FATES","FATLY","FATSO","FATTY","FATWA","FAUGH","FAULD","FAULT","FAUNA","FAUNS","FAUVE","FAVAS","FAVES","FAVOR","FAVUS","FAWNS","FAWNY","FAXED","FAXES","FAYED","FAZED","FAZES","FEARS","FEASE","FEAST","FEATS","FEAZE","FECAL","FECES","FECKS","FEDEX","FEEBS","FEEDS","FEELS","FEEZE","FEIGN","FEINT","FEIST","FELID","FELLA","FELLS","FELLY","FELON","FELTS","FELTY","FEMES","FEMME","FEMUR","FENCE","FENDS","FENNY","FEODS","FEOFF","FERAL","FERES","FERIA","FERLY","FERMI","FERNS","FERNY","FERRY","FESSE","FESTA","FESTS","FETAL","FETAS","FETCH","FETED","FETES","FETID","FETOR","FETUS","FEUAR","FEUDS","FEUED","FEVER","FEWER","FEYER","FEYLY","FEZES","FEZZY","FIARS","FIATS","FIBER","FIBRE","FICES","FICHE","FICHU","FICIN","FICUS","FIDGE","FIDOS","FIEFS","FIELD","FIEND","FIERY","FIFED","FIFER","FIFES","FIFTH","FIFTY","FIGHT","FILAR","FILCH","FILED","FILER","FILES","FILET","FILKS","FILLE","FILLO","FILLS","FILLY","FILMI","FILMS","FILMY","FILOS","FILTH","FILUM","FINAL","FINCA","FINCH","FINDS","FINED","FINER","FINES","FINIS","FINKS","FINNY","FINOS","FIORD","FIQUE","FIRED","FIRER","FIRES","FIRMS","FIRNS","FIRRY","FIRST","FIRTH","FISCS","FISHY","FISTS","FITCH","FITLY","FIVER","FIVES","FIXED","FIXER","FIXES","FIXIT","FIZZY","FJELD","FJORD","FLABS","FLACK","FLAGS","FLAIL","FLAIR","FLAKE","FLAKS","FLAKY","FLAME","FLAMS","FLAMY","FLANK","FLANS","FLAPS","FLARE","FLASH","FLASK","FLATS","FLAVA","FLAWS","FLAWY","FLAXY","FLAYS","FLEAM","FLEAS","FLECK","FLEER","FLEES","FLEET","FLESH","FLEWS","FLEYS","FLICK","FLICS","FLIED","FLIER","FLIES","FLING","FLINT","FLIPS","FLIRS","FLIRT","FLITE","FLITS","FLOAT","FLOCK","FLOCS","FLOES","FLOGS","FLONG","FLOOD","FLOOR","FLOPS","FLORA","FLOSS","FLOTA","FLOUR","FLOUT","FLOWN","FLOWS","FLUBS","FLUED","FLUES","FLUFF","FLUID","FLUKE","FLUKY","FLUME","FLUMP","FLUNG","FLUNK","FLUOR","FLUSH","FLUTE","FLUTY","FLUYT","FLYBY","FLYER","FLYTE","FOALS","FOAMS","FOAMY","FOCAL","FOCUS","FOEHN","FOGEY","FOGGY","FOGIE","FOHNS","FOILS","FOINS","FOIST","FOLDS","FOLEY","FOLIA","FOLIC","FOLIO","FOLKS","FOLKY","FOLLY","FONDS","FONDU","FONTS","FOODS","FOOLS","FOOTS","FOOTY","FORAM","FORAY","FORBS","FORBY","FORCE","FORDO","FORDS","FORES","FOREX","FORGE","FORGO","FORKS","FORKY","FORME","FORMS","FORTE","FORTH","FORTS","FORTY","FORUM","FOSSA","FOSSE","FOULS","FOUND","FOUNT","FOURS","FOVEA","FOWLS","FOXED","FOXES","FOYER","FRACK","FRAGS","FRAIL","FRAME","FRANC","FRANK","FRAPS","FRASS","FRATS","FRAUD","FRAYS","FREAK","FREED","FREER","FREES","FREMD","FRENA","FREON","FRERE","FRESH","FRETS","FRIAR","FRIED","FRIER","FRIES","FRIGS","FRILL","FRISE","FRISK","FRITH","FRITS","FRITT","FRITZ","FRIZZ","FROCK","FROES","FROGS","FROND","FRONS","FRONT","FRORE","FROSH","FROST","FROTH","FROWN","FROWS","FROZE","FRUGS","FRUIT","FRUMP","FRYER","FUBAR","FUBSY","FUCKS","FUCUS","FUDDY","FUDGE","FUDGY","FUELS","FUGAL","FUGGY","FUGIO","FUGLE","FUGUE","FUGUS","FUJIS","FULLS","FULLY","FUMED","FUMER","FUMES","FUMET","FUNDI","FUNDS","FUNGI","FUNGO","FUNKS","FUNKY","FUNNY","FURAN","FURLS","FUROR","FURRY","FURZE","FURZY","FUSED","FUSEE","FUSEL","FUSES","FUSIL","FUSSY","FUSTY","FUTON","FUZED","FUZEE","FUZES","FUZIL","FUZZY","FYCES","FYKES","FYTTE","GABBA","GABBY","GABLE","GADDI","GADID","GADIS","GADJE","GADJO","GAFFE","GAFFS","GAGED","GAGER","GAGES","GAILY","GAINS","GAITS","GALAH","GALAS","GALAX","GALEA","GALED","GALES","GALLS","GALLY","GALOP","GAMAS","GAMAY","GAMBA","GAMBE","GAMBS","GAMED","GAMER","GAMES","GAMEY","GAMIC","GAMIN","GAMMA","GAMMY","GAMPS","GAMUT","GANEF","GANEV","GANGS","GANJA","GANOF","GAOLS","GAPED","GAPER","GAPES","GAPPY","GARBS","GARDA","GARNI","GARTH","GASES","GASPS","GASSY","GASTS","GATCH","GATED","GATER","GATES","GATOR","GAUCH","GAUDS","GAUDY","GAUGE","GAULT","GAUMS","GAUNT","GAURS","GAUSS","GAUZE","GAUZY","GAVEL","GAVOT","GAWKS","GAWKY","GAWPS","GAWSY","GAYAL","GAYER","GAYLY","GAZAR","GAZED","GAZER","GAZES","GAZOO","GEANS","GEARS","GECKO","GECKS","GEEKS","GEEKY","GEESE","GEEST","GELDS","GELEE","GELID","GELLY","GELTS","GEMMA","GEMMY","GEMOT","GENES","GENET","GENIC","GENIE","GENII","GENIP","GENOA","GENOM","GENRE","GENRO","GENTS","GENUA","GENUS","GEODE","GEOID","GERAH","GERMS","GERMY","GESSO","GESTE","GESTS","GETAS","GETUP","GEUMS","GHAST","GHATS","GHAUT","GHAZI","GHEES","GHOST","GHOUL","GHYLL","GIANT","GIBED","GIBER","GIBES","GIDDY","GIFTS","GIGAS","GIGHE","GIGOT","GIGUE","GILDS","GILLS","GILLY","GILTS","GIMEL","GIMME","GIMPS","GIMPY","GINCH","GINKS","GINNY","GINZO","GIPON","GIPSY","GIRDS","GIRLS","GIRLY","GIRNS","GIRON","GIROS","GIRSH","GIRTH","GIRTS","GISMO","GISTS","GITCH","GITES","GIVEN","GIVER","GIVES","GIZMO","GLACE","GLADE","GLADS","GLADY","GLAIR","GLAMS","GLAND","GLANS","GLARE","GLARY","GLASS","GLAZE","GLAZY","GLEAM","GLEAN","GLEBA","GLEBE","GLEDE","GLEDS","GLEED","GLEEK","GLEES","GLEET","GLENS","GLEYS","GLIAL","GLIAS","GLIDE","GLIFF","GLIME","GLIMS","GLINT","GLITZ","GLOAM","GLOAT","GLOBE","GLOBS","GLOGG","GLOMS","GLOOM","GLOOP","GLOPS","GLORY","GLOSS","GLOST","GLOUT","GLOVE","GLOWS","GLOZE","GLUED","GLUER","GLUES","GLUEY","GLUGS","GLUME","GLUMS","GLUON","GLUTE","GLUTS","GLYPH","GNARL","GNARR","GNARS","GNASH","GNATS","GNAWN","GNAWS","GNOME","GOADS","GOALS","GOATS","GOATY","GOBAN","GOBOS","GODET","GODLY","GOERS","GOEST","GOETH","GOFER","GOGOS","GOING","GOJIS","GOLDS","GOLEM","GOLFS","GOLLY","GOMBO","GOMER","GONAD","GONCH","GONEF","GONER","GONGS","GONIA","GONIF","GONOF","GONZO","GOODS","GOODY","GOOEY","GOOFS","GOOFY","GOOKS","GOOKY","GOOLY","GOONS","GOONY","GOOPS","GOOPY","GOOSE","GOOSY","GOPIK","GORAL","GORED","GORES","GORGE","GORMS","GORPS","GORSE","GORSY","GOTCH","GOTHS","GOUGE","GOURD","GOUTS","GOUTY","GOWAN","GOWDS","GOWKS","GOWNS","GOXES","GOYIM","GRAAL","GRABS","GRACE","GRADE","GRADS","GRAFT","GRAIL","GRAIN","GRAMA","GRAMP","GRAMS","GRANA","GRAND","GRANS","GRANT","GRAPE","GRAPH","GRAPY","GRASP","GRASS","GRATE","GRAVE","GRAVY","GRAYS","GRAZE","GREAT","GREBE","GREED","GREEK","GREEN","GREES","GREET","GREGO","GREYS","GRIDE","GRIDS","GRIEF","GRIFF","GRIFT","GRIGS","GRILL","GRIME","GRIMY","GRIND","GRINS","GRIOT","GRIPE","GRIPS","GRIPT","GRIPY","GRIST","GRITH","GRITS","GROAN","GROAT","GRODY","GROGS","GROIN","GROKS","GROOM","GROPE","GROSS","GROSZ","GROTS","GROUP","GROUT","GROVE","GROVY","GROWL","GROWN","GROWS","GRRRL","GRUBS","GRUEL","GRUES","GRUFF","GRUME","GRUMP","GRUNT","GUACO","GUANO","GUANS","GUARD","GUARS","GUAVA","GUCKS","GUDES","GUESS","GUEST","GUFFS","GUIDE","GUIDS","GUILD","GUILE","GUILT","GUIRO","GUISE","GULAG","GULAR","GULCH","GULES","GULFS","GULFY","GULLS","GULLY","GULPS","GULPY","GUMBO","GUMMA","GUMMI","GUMMY","GUNGE","GUNGY","GUNKS","GUNKY","GUNNY","GUPPY","GURDY","GURGE","GURRY","GURSH","GURUS","GUSHY","GUSSY","GUSTO","GUSTS","GUSTY","GUTSY","GUTTA","GUTTY","GUYED","GUYOT","GWINE","GYBED","GYBES","GYNIE","GYNOS","GYOZA","GYPOS","GYPPO","GYPSY","GYRAL","GYRED","GYRES","GYRON","GYROS","GYRUS","GYVED","GYVES","HAAFS","HAARS","HABIT","HABUS","HACEK","HACKS","HADAL","HADED","HADES","HADJI","HADST","HAEMS","HAETS","HAFIZ","HAFTS","HAHAS","HAICK","HAIKA","HAIKS","HAIKU","HAILS","HAINT","HAIRS","HAIRY","HAJES","HAJIS","HAJJI","HAKES","HAKIM","HAKUS","HALAL","HALED","HALER","HALES","HALID","HALLO","HALLS","HALMA","HALMS","HALON","HALOS","HALTS","HALVA","HALVE","HALWA","HAMAL","HAMES","HAMMY","HAMZA","HANCE","HANDS","HANDY","HANGS","HANKS","HANKY","HANSA","HANSE","HANTS","HAOLE","HAPAX","HAPLY","HAPPI","HAPPY","HARAM","HARDS","HARDY","HARED","HAREM","HARES","HARKS","HARLS","HARMS","HARPS","HARPY","HARRY","HARSH","HARTS","HASPS","HASTE","HASTY","HATCH","HATED","HATER","HATES","HAUGH","HAULM","HAULS","HAUNT","HAUTE","HAVEN","HAVER","HAVES","HAVOC","HAWED","HAWKS","HAWSE","HAYED","HAYER","HAYEY","HAZAN","HAZED","HAZEL","HAZER","HAZES","HEADS","HEADY","HEALS","HEAPS","HEAPY","HEARD","HEARS","HEART","HEATH","HEATS","HEAVE","HEAVY","HEBES","HECKS","HEDER","HEDGE","HEDGY","HEEDS","HEELS","HEEZE","HEFTS","HEFTY","HEIGH","HEILS","HEIRS","HEIST","HELIO","HELIX","HELLO","HELLS","HELMS","HELOS","HELOT","HELPS","HELVE","HEMAL","HEMES","HEMIC","HEMIN","HEMPS","HEMPY","HENCE","HENGE","HENNA","HENRY","HENTS","HERBS","HERBY","HERDS","HERES","HERLS","HERMA","HERMS","HERNS","HERON","HEROS","HERRY","HERTZ","HESTS","HETHS","HEUCH","HEUGH","HEVEA","HEWED","HEWER","HEXAD","HEXED","HEXER","HEXES","HEXYL","HICKS","HIDED","HIDER","HIDES","HIGHS","HIGHT","HIJAB","HIJRA","HIKED","HIKER","HIKES","HILAR","HILLO","HILLS","HILLY","HILTS","HILUM","HILUS","HIMBO","HINDS","HINGE","HINKY","HINNY","HINTS","HIPLY","HIPPO","HIPPY","HIRED","HIREE","HIRER","HIRES","HISSY","HISTS","HITCH","HIVED","HIVES","HOAGY","HOARD","HOARS","HOARY","HOBBY","HOBOS","HOCKS","HOCUS","HODAD","HOERS","HOGAN","HOGGS","HOICK","HOISE","HOIST","HOKED","HOKES","HOKEY","HOKKU","HOKUM","HOLDS","HOLED","HOLES","HOLEY","HOLKS","HOLLA","HOLLO","HOLLY","HOLME","HOLMS","HOLOS","HOLTS","HOMAS","HOMED","HOMER","HOMES","HOMEY","HOMIE","HOMOS","HONAN","HONDA","HONED","HONER","HONES","HONEY","HONGI","HONGS","HONKS","HONKY","HONOR","HOOCH","HOODS","HOODY","HOOEY","HOOFS","HOOKA","HOOKS","HOOKY","HOOLY","HOOPS","HOOTS","HOOTY","HOPAK","HOPED","HOPER","HOPES","HOPPY","HORAH","HORAL","HORAS","HORDE","HORKS","HORNS","HORNY","HORSE","HORST","HORSY","HOSED","HOSEL","HOSEN","HOSER","HOSES","HOSEY","HOSTA","HOSTS","HOTCH","HOTEL","HOTLY","HOTTY","HOUND","HOURI","HOURS","HOUSE","HOVEL","HOVER","HOWDY","HOWES","HOWFF","HOWFS","HOWKS","HOWLS","HOYAS","HOYLE","HUBBY","HUCKS","HUFFS","HUFFY","HUGER","HUGGY","HULAS","HULKS","HULKY","HULLO","HULLS","HUMAN","HUMIC","HUMID","HUMOR","HUMPH","HUMPS","HUMPY","HUMUS","HUNCH","HUNKS","HUNKY","HUNTS","HURDS","HURLS","HURLY","HURRY","HURST","HURTS","HUSKS","HUSKY","HUSSY","HUTCH","HUZZA","HWYLS","HYDRA","HYDRO","HYENA","HYING","HYLAS","HYMEN","HYMNS","HYOID","HYPED","HYPER","HYPES","HYPHA","HYPOS","HYRAX","HYSON","IAMBI","IAMBS","ICHOR","ICIER","ICILY","ICING","ICKER","ICONS","ICTIC","ICTUS","IDEAL","IDEAS","IDENT","IDIOM","IDIOT","IDLED","IDLER","IDLES","IDOLS","IDYLL","IDYLS","IGGED","IGLOO","IGLUS","IHRAM","IKATS","IKONS","ILEAC","ILEAL","ILEUM","ILEUS","ILIAC","ILIAD","ILIAL","ILIUM","ILLER","IMAGE","IMAGO","IMAMS","IMAUM","IMBED","IMBUE","IMIDE","IMIDO","IMIDS","IMINE","IMINO","IMMIX","IMPED","IMPEL","IMPIS","IMPLY","IMPRO","INANE","INAPT","INARM","INBOX","INBYE","INCOG","INCUR","INCUS","INDEX","INDIE","INDOL","INDOW","INDRI","INDUE","INEPT","INERT","INFER","INFIX","INFOS","INFRA","INGLE","INGOT","INION","INKED","INKER","INKLE","INLAY","INLET","INNED","INNER","INPUT","INRUN","INSET","INTER","INTIS","INTRO","INURE","INURN","INVAR","IODIC","IODID","IODIN","IONIC","IOTAS","IRADE","IRATE","IRIDS","IRING","IRKED","IROKO","IRONE","IRONS","IRONY","ISBAS","ISLED","ISLES","ISLET","ISSEI","ISSUE","ISTLE","ITCHY","ITEMS","ITHER","IVIED","IVIES","IVORY","IXIAS","IXNAY","IXORA","IXTLE","IZARD","IZARS","JABOT","JACAL","JACKS","JACKY","JADED","JADES","JAGER","JAGGS","JAGGY","JAGRA","JAILS","JAKER","JAKES","JALAP","JALOP","JAMBE","JAMBS","JAMMY","JANES","JANNY","JANTY","JAPAN","JAPED","JAPER","JAPES","JARLS","JATOS","JAUKS","JAUNT","JAUPS","JAVAS","JAWAN","JAWED","JAZZY","JEANS","JEBEL","JEEPS","JEERS","JEEZE","JEFES","JEHAD","JEHUS","JELLO","JELLS","JELLY","JEMMY","JENNY","JERID","JERKS","JERKY","JERRY","JESSE","JESTS","JETES","JETON","JETTY","JEWED","JEWEL","JIBBA","JIBBS","JIBED","JIBER","JIBES","JIFFS","JIFFY","JIGGY","JIHAD","JILLS","JILTS","JIMMY","JIMPY","JINGO","JINKS","JINNI","JINNS","JIRDS","JISMS","JIVED","JIVER","JIVES","JIVEY","JNANA","JOCKO","JOCKS","JOCKY","JOEYS","JOHNS","JOINS","JOINT","JOIST","JOKED","JOKER","JOKES","JOKEY","JOLES","JOLLY","JOLTS","JOLTY","JOMON","JONES","JOOKS","JORAM","JORUM","JOTAS","JOTTY","JOUAL","JOUKS","JOULE","JOUST","JOWAR","JOWED","JOWLS","JOWLY","JOYED","JUBAS","JUBES","JUCOS","JUDAS","JUDGE","JUDOS","JUGAL","JUGUM","JUICE","JUICY","JUJUS","JUKED","JUKES","JUKUS","JULEP","JUMAR","JUMBO","JUMPS","JUMPY","JUNCO","JUNKS","JUNKY","JUNTA","JUNTO","JUPES","JUPON","JURAL","JURAT","JUREL","JUROR","JUSTS","JUTES","JUTTY","JUVIE","KABAB","KABAR","KABOB","KADIS","KAFIR","KAGUS","KAIAK","KAIFS","KAILS","KAINS","KAKAS","KAKIS","KALAM","KALES","KALIF","KALPA","KAMES","KAMIK","KANAS","KANES","KANJI","KANZU","KAONS","KAPAS","KAPHS","KAPOK","KAPOW","KAPPA","KAPUS","KAPUT","KARAT","KARMA","KARNS","KAROO","KARRI","KARST","KARTS","KASHA","KATAS","KAURI","KAURY","KAVAS","KAYAK","KAYOS","KAZOO","KBARS","KEBAB","KEBAR","KEBOB","KECKS","KEDGE","KEEFS","KEEKS","KEELS","KEENS","KEEPS","KEETS","KEEVE","KEFIR","KEIRS","KELEP","KELIM","KELLY","KELPS","KELPY","KELTS","KEMPS","KEMPT","KEMPY","KENAF","KENCH","KENDO","KENOS","KENTE","KEPIS","KERBS","KERFS","KERNE","KERNS","KERRY","KETAS","KETCH","KETOL","KEVEL","KEVIL","KEXES","KEYED","KEYER","KHADI","KHAFS","KHAKI","KHANS","KHAPH","KHATS","KHEDA","KHETH","KHETS","KHOUM","KIACK","KIANG","KIBBE","KIBBI","KIBEI","KIBES","KIBLA","KICKS","KICKY","KIDDO","KIDDY","KIEFS","KIERS","KIKES","KILIM","KILLS","KILNS","KILOS","KILTS","KILTY","KINAS","KINDA","KINDS","KINES","KINGS","KININ","KINKS","KINKY","KINOS","KIOSK","KIPPA","KIRKS","KIRNS","KISSY","KISTS","KITED","KITER","KITES","KITHE","KITHS","KITTY","KIVAS","KIWIS","KLICK","KLIEG","KLIKS","KLONG","KLOOF","KLUGE","KLUTZ","KNACK","KNAPS","KNARS","KNAUR","KNAVE","KNAWE","KNEAD","KNEED","KNEEL","KNEES","KNELL","KNELT","KNIFE","KNISH","KNITS","KNOBS","KNOCK","KNOLL","KNOPS","KNOSP","KNOTS","KNOUT","KNOWN","KNOWS","KNURL","KNURR","KNURS","KOALA","KOANS","KOBOS","KOELS","KOFTA","KOHLS","KOINE","KOJIS","KOKAM","KOKUM","KOLAS","KOLOS","KOMBU","KONKS","KOOKS","KOOKY","KOPEK","KOPHS","KOPJE","KOPPA","KORAI","KORAS","KORAT","KORMA","KORUN","KOTOS","KOTOW","KRAAL","KRAFT","KRAIS","KRAIT","KRAUT","KRAYS","KREEP","KREWE","KRILL","KRONA","KRONE","KROON","KRUBI","KUBIE","KUDOS","KUDUS","KUDZU","KUFIS","KUGEL","KUKRI","KULAK","KULFI","KUMIS","KUMYS","KURTA","KURUS","KUSSO","KVASS","KVELL","KYACK","KYAKS","KYARS","KYATS","KYLIN","KYLIX","KYRIE","KYTES","KYTHE","LAARI","LABEL","LABIA","LABOR","LABRA","LACED","LACER","LACES","LACEY","LACKS","LADDY","LADED","LADEN","LADER","LADES","LADLE","LAEVO","LAGAN","LAGER","LAHAL","LAHAR","LAICH","LAICS","LAIGH","LAIRD","LAIRS","LAIRY","LAITH","LAITY","LAKED","LAKER","LAKES","LAKHS","LALLS","LAMAS","LAMBS","LAMBY","LAMED","LAMER","LAMES","LAMIA","LAMPS","LANAI","LANCE","LANCH","LANDS","LANES","LANKY","LAPEL","LAPIN","LAPIS","LAPSE","LARCH","LARDS","LARDY","LAREE","LARES","LARGE","LARGO","LARIS","LARKS","LARKY","LARNS","LARNT","LARUM","LARVA","LASED","LASER","LASES","LASSI","LASSO","LASSY","LASTS","LATCH","LATED","LATEN","LATER","LATEX","LATHE","LATHI","LATHS","LATHY","LATKE","LATTE","LAUAN","LAUDS","LAUGH","LAURA","LAVAS","LAVED","LAVER","LAVES","LAWED","LAWNS","LAWNY","LAXER","LAXES","LAXLY","LAYED","LAYER","LAYIN","LAYUP","LAZAR","LAZED","LAZES","LEACH","LEADS","LEADY","LEAFS","LEAFY","LEAKS","LEAKY","LEANS","LEANT","LEAPS","LEAPT","LEARN","LEARS","LEARY","LEASE","LEASH","LEAST","LEAVE","LEAVY","LEBEN","LEDES","LEDGE","LEDGY","LEECH","LEEKS","LEERS","LEERY","LEETS","LEFTS","LEFTY","LEGAL","LEGER","LEGES","LEGGY","LEGIT","LEHRS","LEHUA","LEMAN","LEMMA","LEMON","LEMUR","LENDS","LENES","LENIS","LENOS","LENSE","LENTO","LEONE","LEPER","LEPTA","LESBO","LESES","LETCH","LETHE","LETUP","LEUDS","LEVAS","LEVEE","LEVEL","LEVER","LEVIN","LEVIS","LEWIS","LEXES","LEXIS","LEZZY","LIANA","LIANE","LIANG","LIARD","LIARS","LIBEL","LIBER","LIBRA","LIBRI","LICHI","LICHT","LICIT","LICKS","LIDAR","LIDOS","LIEGE","LIENS","LIERS","LIEUS","LIEVE","LIFER","LIFTS","LIGAN","LIGER","LIGHT","LIKED","LIKEN","LIKER","LIKES","LILAC","LILOS","LILTS","LIMAN","LIMAS","LIMBA","LIMBI","LIMBO","LIMBS","LIMBY","LIMED","LIMEN","LIMES","LIMEY","LIMIT","LIMNS","LIMOS","LIMPA","LIMPS","LINAC","LINDY","LINED","LINEN","LINER","LINES","LINEY","LINGA","LINGO","LINGS","LINGY","LININ","LINKS","LINKY","LINNS","LINNY","LINOS","LINTS","LINTY","LINUM","LIONS","LIPAS","LIPID","LIPIN","LIPOS","LIPPY","LIRAS","LIROT","LISLE","LISPS","LISTS","LITAI","LITAS","LITER","LITES","LITHE","LITHO","LITRE","LIVED","LIVEN","LIVER","LIVES","LIVID","LIVRE","LLAMA","LLANO","LOACH","LOADS","LOAFS","LOAMS","LOAMY","LOANS","LOATH","LOBAR","LOBBY","LOBED","LOBES","LOBOS","LOCAL","LOCHE","LOCHS","LOCIE","LOCIS","LOCKS","LOCOS","LOCUM","LOCUS","LODEN","LODES","LODGE","LOESS","LOFTS","LOFTY","LOGAN","LOGES","LOGGY","LOGIA","LOGIC","LOGIN","LOGOI","LOGON","LOGOS","LOIDS","LOINS","LOLLS","LOLLY","LONER","LONGE","LONGS","LOOBY","LOOED","LOOEY","LOOFA","LOOFS","LOOIE","LOOKS","LOOKY","LOOMS","LOONS","LOONY","LOOPS","LOOPY","LOOSE","LOOTS","LOPED","LOPER","LOPES","LOPPY","LORAL","LORAN","LORDS","LORES","LORIS","LORRY","LOSEL","LOSER","LOSES","LOSSY","LOTAH","LOTAS","LOTIC","LOTOS","LOTSA","LOTTA","LOTTE","LOTTO","LOTUS","LOUGH","LOUIE","LOUIS","LOUMA","LOUPE","LOUPS","LOURS","LOURY","LOUSE","LOUSY","LOUTS","LOVAT","LOVED","LOVER","LOVES","LOVEY","LOWED","LOWER","LOWES","LOWLY","LOWSE","LOXED","LOXES","LOYAL","LUAUS","LUBED","LUBES","LUCES","LUCID","LUCKS","LUCKY","LUCRE","LUDES","LUDIC","LUDOS","LUFFA","LUFFS","LUGED","LUGER","LUGES","LULLS","LULUS","LUMAS","LUMEN","LUMPS","LUMPY","LUNAR","LUNAS","LUNCH","LUNES","LUNET","LUNGE","LUNGI","LUNGS","LUNKS","LUNTS","LUPIN","LUPUS","LURCH","LURED","LURER","LURES","LUREX","LURID","LURKS","LUSTS","LUSTY","LUSUS","LUTEA","LUTED","LUTES","LUVED","LUVVY","LUXER","LUXES","LWEIS","LYARD","LYART","LYASE","LYCEA","LYCEE","LYCRA","LYING","LYMPH","LYNCH","LYRES","LYRIC","LYSED","LYSES","LYSIN","LYSIS","LYSSA","LYTIC","LYTTA","MAARS","MABES","MACAW","MACED","MACER","MACES","MACHE","MACHO","MACHS","MACKS","MACLE","MACON","MACRO","MADAM","MADLY","MADRE","MAFIA","MAFIC","MAGES","MAGIC","MAGMA","MAGOT","MAGUS","MAHOE","MAHUA","MAHWA","MAIDS","MAILE","MAILL","MAILS","MAIMS","MAINS","MAIRS","MAIST","MAIZE","MAJOR","MAKAR","MAKER","MAKES","MAKIS","MAKOS","MALAR","MALES","MALIC","MALLS","MALMS","MALMY","MALTS","MALTY","MAMAS","MAMBA","MAMBO","MAMEE","MAMEY","MAMIE","MAMMA","MAMMY","MANAS","MANAT","MANEB","MANED","MANES","MANGA","MANGE","MANGO","MANGY","MANIA","MANIC","MANKY","MANLY","MANNA","MANOR","MANOS","MANSE","MANTA","MANUS","MAPLE","MAQUI","MARAS","MARCH","MARCS","MARES","MARGE","MARIA","MARKA","MARKS","MARLS","MARLY","MARRY","MARSE","MARSH","MARTS","MARVY","MASAS","MASER","MASES","MASHY","MASKS","MASON","MASSA","MASSE","MASSY","MASTS","MATCH","MATED","MATER","MATES","MATEY","MATHS","MATIN","MATTE","MATTS","MATZA","MATZO","MAUDS","MAULS","MAUND","MAUSY","MAUTS","MAUVE","MAUZY","MAVEN","MAVIE","MAVIN","MAVIS","MAWED","MAXED","MAXES","MAXIM","MAXIS","MAYAN","MAYAS","MAYBE","MAYED","MAYOR","MAYOS","MAYST","MAZED","MAZER","MAZES","MBIRA","MEADS","MEALS","MEALY","MEANS","MEANT","MEANY","MEATS","MEATY","MECCA","MECHS","MEDAL","MEDIA","MEDIC","MEDII","MEEDS","MEETS","MEINY","MELDS","MELEE","MELIC","MELLS","MELON","MELTS","MELTY","MEMES","MEMOS","MENAD","MENDS","MENSA","MENSE","MENSH","MENTA","MENTO","MENUS","MEOUS","MEOWS","MERCH","MERCS","MERCY","MERDE","MERER","MERES","MERGE","MERIT","MERKS","MERLE","MERLS","MERRY","MESAS","MESHY","MESIC","MESNE","MESON","MESSY","METAL","METED","METER","METES","METHS","METIS","METOL","METRE","METRO","MEWED","MEWLS","MEZES","MEZZO","MIAOU","MIAOW","MIASM","MIAUL","MICAS","MICHE","MICKS","MICKY","MICRA","MICRO","MIDDY","MIDGE","MIDIS","MIDST","MIENS","MIFFS","MIFFY","MIGGS","MIGHT","MIKED","MIKES","MIKRA","MIKVA","MILCH","MILDS","MILER","MILES","MILIA","MILKS","MILKY","MILLE","MILLS","MILOS","MILPA","MILTS","MILTY","MIMED","MIMEO","MIMER","MIMES","MIMIC","MINAE","MINAS","MINCE","MINCY","MINDS","MINED","MINER","MINES","MINGY","MINIM","MINIS","MINKE","MINKS","MINNY","MINOR","MINTS","MINTY","MINUS","MIRED","MIRES","MIREX","MIRID","MIRIN","MIRKS","MIRKY","MIRTH","MIRZA","MISDO","MISER","MISES","MISOS","MISSY","MISTS","MISTY","MITER","MITES","MITIS","MITRE","MITTS","MIXED","MIXER","MIXES","MIXUP","MIZEN","MOANS","MOATS","MOCHA","MOCHI","MOCKS","MODAL","MODEL","MODEM","MODES","MODUS","MOFOS","MOGGY","MOGUL","MOHEL","MOHOS","MOHUR","MOILS","MOIRA","MOIRE","MOIST","MOJOS","MOKES","MOLAL","MOLAR","MOLAS","MOLDS","MOLDY","MOLES","MOLLS","MOLLY","MOLTO","MOLTS","MOLYS","MOMES","MOMMA","MOMMY","MOMUS","MONAD","MONAS","MONDE","MONDO","MONEY","MONGO","MONIC","MONIE","MONKS","MONOS","MONTE","MONTH","MONTY","MOOCH","MOODS","MOODY","MOOED","MOOKS","MOOLA","MOOLS","MOONS","MOONY","MOORS","MOORY","MOOSE","MOOTS","MOPED","MOPER","MOPES","MOPEY","MOPPY","MORAE","MORAL","MORAS","MORAY","MOREL","MORES","MORNS","MORON","MORPH","MORRO","MORSE","MORTS","MOSEY","MOSKS","MOSSO","MOSSY","MOSTE","MOSTS","MOTEL","MOTES","MOTET","MOTEY","MOTHS","MOTHY","MOTIF","MOTOR","MOTTE","MOTTO","MOTTS","MOUCH","MOUES","MOULD","MOULT","MOUND","MOUNT","MOURN","MOUSE","MOUSY","MOUTH","MOVED","MOVER","MOVES","MOVIE","MOWED","MOWER","MOXAS","MOXIE","MOZOS","MUCHO","MUCID","MUCIN","MUCKS","MUCKY","MUCOR","MUCRO","MUCUS","MUDDY","MUDRA","MUFFS","MUFTI","MUGGS","MUGGY","MUHLY","MUJIK","MULCH","MULCT","MULED","MULES","MULEY","MULIE","MULLA","MULLS","MUMMS","MUMMY","MUMPS","MUMSY","MUMUS","MUNCH","MUNGO","MUNGS","MUNIS","MUONS","MURAL","MURAS","MURED","MURES","MUREX","MURID","MURKS","MURKY","MURRA","MURRE","MURRS","MURRY","MUSCA","MUSED","MUSER","MUSES","MUSHY","MUSIC","MUSKS","MUSKY","MUSOS","MUSSY","MUSTH","MUSTS","MUSTY","MUTCH","MUTED","MUTER","MUTES","MUTHA","MUTON","MUTTS","MUXED","MUXES","MUZAK","MUZZY","MYLAR","MYNAH","MYNAS","MYOID","MYOMA","MYOPE","MYOPY","MYRRH","MYSID","MYTHS","MYTHY","NAANS","NABES","NABIS","NABOB","NACHO","NACRE","NADAS","NADIR","NAEVI","NAFFS","NAGAS","NAGGY","NAIAD","NAIFS","NAILS","NAIRA","NAIRU","NAIVE","NAKED","NAKFA","NALAS","NALED","NAMED","NAMER","NAMES","NANAS","NANCE","NANCY","NANNA","NANNY","NANOS","NAPAS","NAPES","NAPPA","NAPPE","NAPPY","NARCO","NARCS","NARDS","NARES","NARIC","NARIS","NARKS","NARKY","NASAL","NASTY","NATAL","NATCH","NATES","NATTY","NAVAL","NAVAR","NAVEL","NAVES","NAVVY","NAWAB","NAZIS","NEAPS","NEARS","NEATH","NEATS","NECKS","NEDDY","NEEDS","NEEDY","NEEMS","NEEPS","NEGUS","NEIFS","NEIGH","NEIST","NELLY","NEMAS","NENES","NEONS","NERDS","NERDY","NEROL","NERTS","NERTZ","NERVE","NERVY","NESTS","NETOP","NETTS","NETTY","NEUKS","NEUME","NEUMS","NEVER","NEVES","NEVUS","NEWBS","NEWEL","NEWER","NEWIE","NEWLY","NEWSY","NEWTS","NEXTS","NEXUS","NGWEE","NICAD","NICER","NICHE","NICKS","NICOL","NIDAL","NIDED","NIDES","NIDUS","NIECE","NIEVE","NIFFS","NIFFY","NIFTY","NIGHS","NIGHT","NIHIL","NIKAH","NILLS","NIMBI","NINER","NINES","NINJA","NINNY","NINON","NINTH","NIPAS","NIPPY","NIQAB","NISEI","NISUS","NITER","NITES","NITID","NITON","NITRE","NITRO","NITTY","NIVAL","NIXED","NIXES","NIXIE","NIZAM","NOBBY","NOBLE","NOBLY","NOCKS","NODAL","NODDY","NODES","NODUS","NOELS","NOGGS","NOHOW","NOILS","NOILY","NOIRS","NOISE","NOISY","NOLOS","NOMAD","NOMAS","NOMEN","NOMES","NOMOI","NOMOS","NONAS","NONCE","NONES","NONET","NONYL","NOOKS","NOOKY","NOONS","NOOSE","NOPAL","NORIA","NORIS","NORMS","NORTH","NOSED","NOSES","NOSEY","NOTAL","NOTCH","NOTED","NOTER","NOTES","NOTUM","NOUNS","NOVAE","NOVAS","NOVEL","NOWAY","NOWTS","NOYAU","NUBBY","NUBIA","NUCHA","NUDER","NUDES","NUDGE","NUDIE","NUDZH","NUFFS","NUKED","NUKES","NULLS","NUMBS","NUMEN","NUMMY","NURDS","NURLS","NURSE","NUTSO","NUTSY","NUTTY","NYALA","NYLON","NYMPH","OAKED","OAKEN","OAKUM","OARED","OASES","OASIS","OASTS","OATEN","OATER","OATHS","OAVES","OBEAH","OBELI","OBESE","OBEYS","OBIAS","OBITS","OBJET","OBOES","OBOLE","OBOLI","OBOLS","OCCUR","OCEAN","OCHER","OCHES","OCHRE","OCHRY","OCKER","OCREA","OCTAD","OCTAL","OCTAN","OCTET","OCTYL","OCULI","ODAHS","ODDER","ODDLY","ODEON","ODEUM","ODIST","ODIUM","ODORS","ODOUR","ODYLE","ODYLS","OFAYS","OFFAL","OFFED","OFFER","OFTEN","OFTER","OGAMS","OGEED","OGEES","OGHAM","OGIVE","OGLED","OGLER","OGLES","OGRES","OHIAS","OHING","OHMIC","OIDIA","OILED","OILER","OINKS","OKAPI","OKAYS","OKEHS","OKRAS","OLDEN","OLDER","OLDIE","OLEIC","OLEIN","OLEOS","OLEUM","OLIOS","OLIVE","OLLAS","OLLIE","OLOGY","OMASA","OMBER","OMBRE","OMEGA","OMENS","OMERS","OMITS","ONCET","ONERY","ONION","ONIUM","ONLAY","ONSET","ONTIC","OOHED","OOMPH","OORIE","OOTID","OOZED","OOZES","OPAHS","OPALS","OPENS","OPERA","OPINE","OPING","OPIUM","OPSIN","OPTED","OPTIC","ORACH","ORACY","ORALS","ORANG","ORATE","ORBED","ORBIT","ORCAS","ORCIN","ORDER","ORDOS","OREAD","ORGAN","ORGIC","ORIBI","ORIEL","ORLES","ORLON","ORLOP","ORMER","ORNIS","ORPIN","ORRIS","ORTHO","ORZOS","OSCAR","OSIER","OSMIC","OSMOL","OSSIA","OSTIA","OTAKU","OTHER","OTTAR","OTTER","OTTOS","OUGHT","OUNCE","OUPHE","OUPHS","OURIE","OUSEL","OUSTS","OUTBY","OUTDO","OUTED","OUTER","OUTGO","OUTRE","OUTRO","OUTTA","OUZEL","OUZOS","OVALS","OVARY","OVATE","OVENS","OVERS","OVERT","OVINE","OVOID","OVOLI","OVOLO","OVULE","OWING","OWLET","OWNED","OWNER","OWSEN","OXBOW","OXERS","OXEYE","OXIDE","OXIDS","OXIME","OXIMS","OXLIP","OXTER","OYERS","OZONE","PAANS","PACAS","PACED","PACER","PACES","PACEY","PACHA","PACKS","PACTS","PADDY","PADIS","PADLE","PADRE","PADRI","PAEAN","PAEON","PAGAN","PAGED","PAGER","PAGES","PAGOD","PAIKS","PAILS","PAINS","PAINT","PAIRS","PAISA","PAISE","PALEA","PALED","PALER","PALES","PALET","PALIS","PALLS","PALLY","PALMS","PALMY","PALPI","PALPS","PALSA","PALSY","PAMPA","PANDA","PANDY","PANED","PANEL","PANES","PANGA","PANGS","PANIC","PANNE","PANSY","PANTO","PANTS","PANTY","PAPAL","PAPAS","PAPAW","PAPER","PAPPI","PAPPY","PARAE","PARAS","PARCH","PARDI","PARDS","PARDY","PARED","PAREN","PAREO","PARER","PARES","PAREU","PARGE","PARGO","PARIS","PARKA","PARKS","PARKY","PARLE","PAROL","PARRS","PARRY","PARSE","PARTS","PARTY","PARVE","PARVO","PASEO","PASES","PASHA","PASHM","PASKA","PASSE","PASTA","PASTE","PASTS","PASTY","PATCH","PATED","PATEN","PATER","PATES","PATHS","PATIN","PATIO","PATLY","PATSY","PATTY","PAUAS","PAUSE","PAVAN","PAVED","PAVER","PAVES","PAVID","PAVIN","PAVIS","PAWED","PAWER","PAWKY","PAWLS","PAWNS","PAXES","PAYED","PAYEE","PAYER","PAYOR","PEACE","PEACH","PEAGE","PEAGS","PEAKS","PEAKY","PEALS","PEANS","PEARL","PEARS","PEART","PEASE","PEATS","PEATY","PEAVY","PECAN","PECHS","PECKS","PECKY","PEDAL","PEDES","PEDRO","PEEKS","PEELS","PEENS","PEEPS","PEERS","PEERY","PEEVE","PEINS","PEISE","PEKAN","PEKES","PEKIN","PEKOE","PELAU","PELES","PELFS","PELON","PELTS","PENAL","PENCE","PENDS","PENES","PENGO","PENIS","PENNA","PENNE","PENNI","PENNY","PEONS","PEONY","PEPLA","PEPOS","PEPPY","PEPSI","PERCH","PERCS","PERDU","PERDY","PEREA","PERES","PERIL","PERIS","PERKS","PERKY","PERMS","PERPS","PERRY","PERSE","PERVO","PERVS","PERVY","PESKY","PESOS","PESTO","PESTS","PESTY","PETAL","PETER","PETIT","PETTI","PETTO","PETTY","PEWEE","PEWIT","PHAGE","PHASE","PHIAL","PHISH","PHIZZ","PHLOX","PHONE","PHONO","PHONS","PHONY","PHOTO","PHOTS","PHPHT","PHUTS","PHYLA","PHYLE","PIANI","PIANO","PIANS","PIBAL","PICAL","PICAS","PICKS","PICKY","PICOT","PICUL","PIECE","PIERS","PIETA","PIETY","PIEZO","PIGGY","PIGMY","PIING","PIKAS","PIKED","PIKER","PIKES","PIKIS","PILAF","PILAR","PILAU","PILAW","PILEA","PILED","PILEI","PILES","PILIS","PILLS","PILOT","PILUS","PIMAS","PIMPS","PINAS","PINCH","PINED","PINES","PINEY","PINGO","PINGS","PINKO","PINKS","PINKY","PINNA","PINNY","PINON","PINOT","PINTA","PINTO","PINTS","PINUP","PIONS","PIOUS","PIPAL","PIPAS","PIPED","PIPER","PIPES","PIPET","PIPIT","PIQUE","PIRNS","PIROG","PISCO","PISOS","PISSY","PISTE","PITAS","PITCH","PITHS","PITHY","PITON","PITOT","PITTA","PIVOT","PIXEL","PIXES","PIXIE","PIZZA","PLACE","PLACK","PLAGE","PLAID","PLAIN","PLAIT","PLANE","PLANK","PLANS","PLANT","PLASH","PLASM","PLATE","PLATS","PLATY","PLAYA","PLAYS","PLAZA","PLEAD","PLEAS","PLEAT","PLEBE","PLEBS","PLENA","PLEON","PLEWS","PLICA","PLIED","PLIER","PLIES","PLINK","PLODS","PLONK","PLOPS","PLOTS","PLOTZ","PLOWS","PLOYE","PLOYS","PLUCK","PLUGS","PLUMB","PLUME","PLUMP","PLUMS","PLUMY","PLUNK","PLUOT","PLUSH","PLYER","POACH","POBOY","POCKS","POCKY","PODGY","PODIA","POEMS","POESY","POETS","POGEY","POGOS","POILU","POIND","POINT","POISE","POKED","POKER","POKES","POKEY","POLAR","POLED","POLER","POLES","POLIO","POLIS","POLKA","POLLS","POLOS","POLYP","POLYS","POMBE","POMES","POMMY","POMOS","POMPS","PONCE","PONCY","PONDS","PONES","PONGO","PONGS","PONGY","PONZU","POOCH","POODS","POOED","POOFS","POOFY","POOHS","POOJA","POOKA","POOLS","POONS","POOPS","POOPY","POORI","POOVE","POPES","POPPA","POPPY","POPSY","PORCH","PORED","PORES","PORGY","PORIN","PORKS","PORKY","PORNO","PORNS","PORNY","PORTS","POSED","POSER","POSES","POSEY","POSIT","POSSE","POSTS","POTSY","POTTO","POTTY","POUCH","POUFF","POUFS","POULT","POUND","POURS","POUTS","POUTY","POWER","POXED","POXES","POYOU","PRAAM","PRAHU","PRAMS","PRANA","PRANG","PRANK","PRAOS","PRASE","PRATE","PRATS","PRAUS","PRAWN","PRAYS","PREED","PREEN","PREES","PREOP","PREPS","PRESA","PRESE","PRESS","PREST","PREXY","PREYS","PRICE","PRICK","PRICY","PRIDE","PRIED","PRIER","PRIES","PRIGS","PRILL","PRIMA","PRIME","PRIMI","PRIMO","PRIMP","PRIMS","PRINK","PRINT","PRION","PRIOR","PRISE","PRISM","PRISS","PRIVY","PRIZE","PROAS","PROBE","PROBS","PRODS","PROEM","PROFS","PROGS","PROLE","PROMO","PROMS","PRONE","PRONG","PROOF","PROPS","PROSE","PROSO","PROSS","PROST","PROSY","PROUD","PROVE","PROWL","PROWS","PROXY","PRUDE","PRUNE","PRUTA","PRYER","PSALM","PSEUD","PSHAW","PSOAE","PSOAI","PSOAS","PSYCH","PUBES","PUBIC","PUBIS","PUCES","PUCKA","PUCKS","PUDGE","PUDGY","PUDIC","PUDUS","PUFFS","PUFFY","PUGGY","PUJAH","PUJAS","PUKED","PUKES","PUKEY","PUKKA","PULAO","PULAS","PULED","PULER","PULES","PULIK","PULIS","PULKA","PULKS","PULLS","PULPS","PULPY","PULSE","PUMAS","PUMPS","PUNAS","PUNCH","PUNGS","PUNJI","PUNKA","PUNKS","PUNKY","PUNNY","PUNTO","PUNTS","PUNTY","PUPAE","PUPAL","PUPAS","PUPIL","PUPPY","PUPUS","PURDA","PUREE","PURER","PURGE","PURIN","PURIS","PURLS","PURRS","PURSE","PURSY","PURTY","PUSES","PUSHY","PUSSY","PUTON","PUTTI","PUTTO","PUTTS","PUTTY","PYGMY","PYINS","PYLON","PYOID","PYRAN","PYRES","PYREX","PYRIC","PYROS","PYXES","PYXIE","PYXIS","PZAZZ","QADIS","QAIDS","QAJAQ","QANAT","QIBLA","QOPHS","QUACK","QUADS","QUAFF","QUAGS","QUAIL","QUAIS","QUAKE","QUAKY","QUALE","QUALM","QUANT","QUARE","QUARK","QUART","QUASH","QUASI","QUASS","QUATE","QUAYS","QUBIT","QUEAN","QUEEN","QUEER","QUELL","QUERN","QUERY","QUEST","QUEUE","QUEYS","QUICK","QUIDS","QUIET","QUIFF","QUILL","QUILT","QUINS","QUINT","QUIPS","QUIPU","QUIRE","QUIRK","QUIRT","QUITE","QUITS","QUODS","QUOIN","QUOIT","QUOLL","QUOTA","QUOTE","QUOTH","QURSH","RABAT","RABBI","RABIC","RABID","RACED","RACER","RACES","RACKS","RACON","RADAR","RADII","RADIO","RADIX","RADON","RAFFS","RAFTS","RAGAS","RAGED","RAGEE","RAGER","RAGES","RAGGA","RAGGS","RAGGY","RAGIS","RAIAS","RAIDS","RAILS","RAINS","RAINY","RAISE","RAITA","RAJAH","RAJAS","RAJES","RAKED","RAKEE","RAKER","RAKES","RAKIS","RAKUS","RALES","RALLY","RALPH","RAMAL","RAMEE","RAMEN","RAMET","RAMIE","RAMIN","RAMMY","RAMPS","RAMUS","RANCE","RANCH","RANDS","RANDY","RANEE","RANGE","RANGS","RANGY","RANID","RANIS","RANKS","RANTS","RAPED","RAPER","RAPES","RAPHE","RAPID","RARED","RARER","RARES","RASED","RASER","RASES","RASPS","RASPY","RATAL","RATAN","RATCH","RATED","RATEL","RATER","RATES","RATHE","RATIO","RATOS","RATTY","RAVED","RAVEL","RAVEN","RAVER","RAVES","RAVEY","RAVIN","RAWER","RAWIN","RAWLY","RAXED","RAXES","RAYAH","RAYAS","RAYED","RAYON","RAZED","RAZEE","RAZER","RAZES","RAZOR","REACH","REACT","READD","READS","READY","REALM","REALS","REAMS","REAPS","REARM","REARS","REATA","REAVE","REBAR","REBBE","REBEC","REBEL","REBID","REBOP","REBUS","REBUT","REBUY","RECAP","RECCE","RECIT","RECKS","RECON","RECTA","RECTI","RECTO","RECUR","RECUT","REDAN","REDDS","REDDY","REDED","REDES","REDIA","REDID","REDIP","REDLY","REDON","REDOS","REDOX","REDRY","REDUB","REDUX","REDYE","REEDS","REEDY","REEFS","REEFY","REEKS","REEKY","REELS","REEST","REEVE","REFED","REFEL","REFER","REFIT","REFIX","REFLY","REFRY","REGAL","REGES","REGIE","REGMA","REGNA","REHAB","REHEM","REIFS","REIFY","REIGN","REIKI","REINK","REINS","REIVE","REJIG","REKEY","RELAX","RELAY","RELET","RELIC","RELIT","REMAN","REMAP","REMET","REMEX","REMIT","REMIX","RENAL","RENDS","RENEW","RENIG","RENIN","RENOS","RENTE","RENTS","REOIL","REORG","REPAY","REPEG","REPEL","REPIN","REPLY","REPOS","REPOT","REPPS","REPRO","RERAN","RERIG","RERUN","RESAT","RESAW","RESAY","RESEE","RESES","RESET","RESEW","RESID","RESIN","RESIT","RESOD","RESOW","RESTS","RETAG","RETAX","RETCH","RETEM","RETIA","RETIE","RETRO","RETRY","REUSE","REVEL","REVET","REVUE","REWAN","REWAX","REWED","REWET","REWIN","REWON","REXES","REZES","RHEAS","RHEME","RHEUM","RHINO","RHOMB","RHUMB","RHYME","RHYTA","RIALS","RIANT","RIATA","RIBBY","RIBES","RICED","RICER","RICES","RICIN","RICKS","RIDER","RIDES","RIDGE","RIDGY","RIELS","RIFER","RIFFS","RIFLE","RIFTS","RIGHT","RIGID","RIGOR","RILED","RILES","RILEY","RILLE","RILLS","RIMED","RIMER","RIMES","RINDS","RINDY","RINGS","RINKS","RINSE","RIOJA","RIOTS","RIPED","RIPEN","RIPER","RIPES","RISEN","RISER","RISES","RISHI","RISKS","RISKY","RISUS","RITES","RITZY","RIVAL","RIVED","RIVEN","RIVER","RIVES","RIVET","RIYAL","ROACH","ROADS","ROAMS","ROANS","ROARS","ROAST","ROBED","ROBES","ROBIN","ROBLE","ROBOT","ROCKS","ROCKY","RODEO","RODES","ROGER","ROGUE","ROILS","ROILY","ROLES","ROLFS","ROLLS","ROMAN","ROMEO","ROMPS","RONDE","RONDO","RONIN","ROODS","ROOFS","ROOKS","ROOKY","ROOMS","ROOMY","ROOSE","ROOST","ROOTS","ROOTY","ROPED","ROPER","ROPES","ROPEY","ROQUE","ROSED","ROSES","ROSET","ROSHI","ROSIN","ROSTI","ROTAS","ROTCH","ROTES","ROTIS","ROTLS","ROTOR","ROTOS","ROTTE","ROUEN","ROUES","ROUGE","ROUGH","ROUND","ROUPS","ROUPY","ROUSE","ROUST","ROUTE","ROUTH","ROUTS","ROVED","ROVEN","ROVER","ROVES","ROWAN","ROWDY","ROWED","ROWEL","ROWEN","ROWER","ROWTH","ROYAL","RUANA","RUBBY","RUBEL","RUBES","RUBLE","RUBLI","RUBUS","RUCHE","RUCKS","RUDDS","RUDDY","RUDER","RUERS","RUFFE","RUFFS","RUGAE","RUGAL","RUGBY","RUING","RUINS","RUKHS","RULED","RULER","RULES","RUMBA","RUMEN","RUMLY","RUMMY","RUMOR","RUMPS","RUNES","RUNGS","RUNIC","RUNNY","RUNTS","RUNTY","RUPEE","RURAL","RUSES","RUSHY","RUSKS","RUSTS","RUSTY","RUTHS","RUTIN","RUTTY","RYKED","RYKES","RYNDS","RYOTS","SABAL","SABED","SABER","SABES","SABIN","SABIR","SABLE","SABOT","SABRA","SABRE","SACKS","SACRA","SADES","SADHE","SADHU","SADIS","SADLY","SAFER","SAFES","SAGAS","SAGER","SAGES","SAGGY","SAGOS","SAGUM","SAHIB","SAICE","SAIDS","SAIGA","SAILS","SAINS","SAINT","SAITH","SAJOU","SAKER","SAKES","SAKIS","SAKTI","SALAD","SALAL","SALAT","SALEP","SALES","SALIC","SALLY","SALMI","SALOL","SALON","SALPA","SALPS","SALSA","SALTS","SALTY","SALUT","SALVE","SALVO","SAMBA","SAMBO","SAMEK","SAMEY","SAMFU","SAMPS","SANDS","SANDY","SANED","SANER","SANES","SANGA","SANGH","SANTO","SAPID","SAPOR","SAPPY","SARAN","SARDS","SAREE","SARGE","SARGO","SARIN","SARIS","SARKS","SARKY","SAROD","SAROS","SASIN","SASSY","SATAY","SATED","SATEM","SATES","SATIN","SATIS","SATYR","SAUCE","SAUCH","SAUCY","SAUGH","SAULS","SAULT","SAUNA","SAURY","SAUTE","SAVED","SAVER","SAVES","SAVIN","SAVOR","SAVOY","SAVVY","SAWED","SAWER","SAXES","SAYED","SAYER","SAYID","SAYST","SCABS","SCADS","SCAGS","SCALD","SCALE","SCALL","SCALP","SCALY","SCAMP","SCAMS","SCANS","SCANT","SCAPE","SCARE","SCARF","SCARP","SCARS","SCART","SCARY","SCATS","SCATT","SCAUP","SCAUR","SCENA","SCEND","SCENE","SCENT","SCHAV","SCHMO","SCHUL","SCHWA","SCION","SCOFF","SCOLD","SCONE","SCOOP","SCOOT","SCOPA","SCOPE","SCOPS","SCORE","SCORN","SCOTS","SCOUR","SCOUT","SCOWL","SCOWS","SCRAG","SCRAM","SCRAN","SCRAP","SCREE","SCREW","SCRIM","SCRIP","SCROB","SCROD","SCRUB","SCRUM","SCUBA","SCUDI","SCUDO","SCUDS","SCUFF","SCULK","SCULL","SCULP","SCUMS","SCUPS","SCURF","SCUTA","SCUTE","SCUTS","SCUZZ","SEALS","SEAMS","SEAMY","SEARS","SEATS","SEBUM","SECCO","SECTS","SEDAN","SEDER","SEDGE","SEDGY","SEDUM","SEEDS","SEEDY","SEEKS","SEELS","SEELY","SEEMS","SEEPS","SEEPY","SEERS","SEGNI","SEGNO","SEGOS","SEGUE","SEIFS","SEINE","SEISE","SEISM","SEIZA","SEIZE","SELAH","SELFS","SELLE","SELLS","SELVA","SEMEE","SEMEN","SEMES","SEMIS","SENDS","SENES","SENGI","SENNA","SENOR","SENSA","SENSE","SENTE","SENTI","SENTS","SEPAL","SEPIA","SEPIC","SEPOY","SEPTA","SEPTS","SERAC","SERAI","SERAL","SERED","SERER","SERES","SERFS","SERGE","SERIF","SERIN","SEROW","SERRY","SERUM","SERVE","SERVO","SETAE","SETAL","SETON","SETTS","SETUP","SEVEN","SEVER","SEWAN","SEWAR","SEWED","SEWER","SEXED","SEXER","SEXES","SEXTO","SEXTS","SHACK","SHADE","SHADS","SHADY","SHAFT","SHAGS","SHAHS","SHAKE","SHAKO","SHAKY","SHALE","SHALL","SHALT","SHALY","SHAME","SHAMS","SHANK","SHAPE","SHARD","SHARE","SHARK","SHARN","SHARP","SHAUL","SHAVE","SHAWL","SHAWM","SHAWN","SHAWS","SHAYS","SHEAF","SHEAL","SHEAR","SHEAS","SHEDS","SHEEN","SHEEP","SHEER","SHEET","SHEIK","SHELF","SHELL","SHEND","SHENT","SHEOL","SHERD","SHERO","SHEWN","SHEWS","SHIED","SHIEL","SHIER","SHIES","SHIFT","SHILL","SHILY","SHIMS","SHINE","SHINS","SHINY","SHIPS","SHIRE","SHIRK","SHIRR","SHIRT","SHIST","SHITE","SHITS","SHIUR","SHIVA","SHIVE","SHIVS","SHLEP","SHLUB","SHMOE","SHOAL","SHOAT","SHOCK","SHOED","SHOER","SHOES","SHOGI","SHOGS","SHOJI","SHOJO","SHONE","SHOOK","SHOOL","SHOON","SHOOS","SHOOT","SHOPS","SHORE","SHORL","SHORN","SHORT","SHOTE","SHOTS","SHOTT","SHOUT","SHOVE","SHOWN","SHOWS","SHOWY","SHOYU","SHRED","SHREW","SHRIS","SHRUB","SHRUG","SHTIK","SHTUM","SHTUP","SHUCK","SHULN","SHULS","SHUNS","SHUNT","SHURA","SHUSH","SHUTE","SHUTS","SHWAS","SHYER","SHYLY","SIALS","SIBBS","SIBYL","SICES","SICKO","SICKS","SICKY","SIDED","SIDES","SIDHE","SIDLE","SIEGE","SIEUR","SIEVE","SIFTS","SIGHS","SIGHT","SIGIL","SIGLA","SIGMA","SIGNA","SIGNS","SIKAS","SIKER","SIKES","SILDS","SILEX","SILKS","SILKY","SILLS","SILLY","SILOS","SILTS","SILTY","SILVA","SIMAR","SIMAS","SIMPS","SINCE","SINES","SINEW","SINGE","SINGS","SINHS","SINKS","SINUS","SIPED","SIPES","SIRED","SIREE","SIREN","SIRES","SIRRA","SIRUP","SISAL","SISES","SISSY","SITAR","SITED","SITES","SITUP","SITUS","SIVER","SIXER","SIXES","SIXMO","SIXTE","SIXTH","SIXTY","SIZAR","SIZED","SIZER","SIZES","SKAGS","SKALD","SKANK","SKATE","SKATS","SKEAN","SKEDS","SKEED","SKEEN","SKEES","SKEET","SKEGS","SKEIN","SKELL","SKELM","SKELP","SKENE","SKEPS","SKEWS","SKIDS","SKIED","SKIER","SKIES","SKIEY","SKIFF","SKILL","SKIMO","SKIMP","SKIMS","SKINK","SKINS","SKINT","SKIPS","SKIRL","SKIRR","SKIRT","SKITE","SKITS","SKIVE","SKOAL","SKOLS","SKORT","SKOSH","SKUAS","SKULK","SKULL","SKUNK","SKYED","SKYEY","SLABS","SLACK","SLAGS","SLAIN","SLAKE","SLAMS","SLANG","SLANK","SLANT","SLAPS","SLASH","SLATE","SLATS","SLATY","SLAVE","SLAWS","SLAYS","SLEDS","SLEEK","SLEEP","SLEET","SLEPT","SLEWS","SLICE","SLICK","SLIDE","SLIER","SLILY","SLIME","SLIMS","SLIMY","SLING","SLINK","SLIPE","SLIPS","SLIPT","SLITS","SLOBS","SLOES","SLOGS","SLOID","SLOJD","SLOMO","SLOOP","SLOPE","SLOPS","SLOSH","SLOTH","SLOTS","SLOWS","SLOYD","SLUBS","SLUED","SLUES","SLUFF","SLUGS","SLUMP","SLUMS","SLUNG","SLUNK","SLURB","SLURP","SLURS","SLUSH","SLUTS","SLYER","SLYLY","SLYPE","SMACK","SMALL","SMALT","SMARM","SMART","SMASH","SMAZE","SMEAR","SMEEK","SMELL","SMELT","SMERK","SMEWS","SMILE","SMIRK","SMITE","SMITH","SMOCK","SMOGS","SMOKE","SMOKY","SMOLT","SMORG","SMOTE","SMUSH","SMUTS","SNACK","SNAFU","SNAGS","SNAIL","SNAKE","SNAKY","SNAPS","SNARE","SNARF","SNARK","SNARL","SNASH","SNATH","SNAWS","SNEAK","SNEAP","SNECK","SNEDS","SNEER","SNELL","SNIBS","SNICK","SNIDE","SNIFF","SNIPE","SNIPS","SNITS","SNOBS","SNOGS","SNOOD","SNOOK","SNOOL","SNOOP","SNOOT","SNORE","SNORT","SNOTS","SNOUT","SNOWS","SNOWY","SNUBS","SNUCK","SNUFF","SNUGS","SNYES","SOAKS","SOAPS","SOAPY","SOARS","SOAVE","SOBAS","SOBER","SOCAS","SOCES","SOCKO","SOCKS","SOCLE","SODAS","SODDY","SODIC","SODOM","SOFAR","SOFAS","SOFTA","SOFTS","SOFTY","SOGGY","SOILS","SOJAS","SOJUS","SOKES","SOKOL","SOLAN","SOLAR","SOLAS","SOLDI","SOLDO","SOLED","SOLEI","SOLES","SOLID","SOLON","SOLOS","SOLUM","SOLUS","SOLVE","SOMAN","SOMAS","SONAR","SONDE","SONES","SONGS","SONIC","SONLY","SONNY","SONSY","SOOEY","SOOKS","SOOTH","SOOTS","SOOTY","SOPHS","SOPHY","SOPOR","SOPPY","SORAS","SORBS","SORDS","SORED","SOREL","SORER","SORES","SORGO","SORNS","SORRY","SORTA","SORTS","SORUS","SOTHS","SOTOL","SOUGH","SOUKS","SOULS","SOUND","SOUPS","SOUPY","SOURS","SOUSE","SOUTH","SOWAR","SOWED","SOWER","SOYAS","SOYUZ","SOZIN","SPACE","SPACY","SPADE","SPADO","SPAED","SPAES","SPAHI","SPAIL","SPAIT","SPAKE","SPALE","SPALL","SPAMS","SPANG","SPANK","SPANS","SPARE","SPARK","SPARS","SPASM","SPATE","SPATS","SPAWN","SPAYS","SPAZZ","SPEAK","SPEAN","SPEAR","SPECK","SPECS","SPECT","SPEED","SPEEL","SPEER","SPEIL","SPEIR","SPELL","SPELT","SPEND","SPENT","SPERM","SPEWS","SPICA","SPICE","SPICK","SPICS","SPICY","SPIED","SPIEL","SPIER","SPIES","SPIFF","SPIKE","SPIKS","SPIKY","SPILE","SPILL","SPILT","SPINE","SPINS","SPINY","SPIRE","SPIRT","SPIRY","SPITE","SPITS","SPITZ","SPIVS","SPLAT","SPLAY","SPLIT","SPODE","SPOIL","SPOKE","SPOOF","SPOOK","SPOOL","SPOON","SPOOR","SPORE","SPORT","SPOTS","SPOUT","SPRAG","SPRAT","SPRAY","SPREE","SPRIG","SPRIT","SPROG","SPRUE","SPRUG","SPUDS","SPUED","SPUES","SPUME","SPUMY","SPUNK","SPURN","SPURS","SPURT","SPUTA","SQUAB","SQUAD","SQUAT","SQUAW","SQUEG","SQUIB","SQUID","STABS","STACK","STADE","STAFF","STAGE","STAGS","STAGY","STAID","STAIG","STAIN","STAIR","STAKE","STALE","STALK","STALL","STAMP","STAND","STANE","STANG","STANK","STAPH","STARE","STARK","STARS","START","STASH","STATE","STATS","STAVE","STAYS","STEAD","STEAK","STEAL","STEAM","STEED","STEEK","STEEL","STEEP","STEER","STEIN","STELA","STELE","STEMS","STENO","STENT","STEPS","STERE","STERN","STETS","STEWS","STEWY","STICH","STICK","STIED","STIES","STIFF","STILE","STILL","STILT","STIME","STIMY","STING","STINK","STINT","STIPE","STIRK","STIRP","STIRS","STOAE","STOAI","STOAS","STOAT","STOBS","STOCK","STOGY","STOIC","STOKE","STOLE","STOMA","STOMP","STONE","STONK","STONY","STOOD","STOOK","STOOL","STOOP","STOPE","STOPS","STOPT","STORE","STORK","STORM","STORY","STOSS","STOTS","STOTT","STOUP","STOUR","STOUT","STOVE","STOWP","STOWS","STRAP","STRAW","STRAY","STREP","STREW","STRIA","STRIP","STROP","STROW","STROY","STRUM","STRUT","STUBS","STUCK","STUDS","STUDY","STUFF","STULL","STUMP","STUMS","STUNG","STUNK","STUNS","STUNT","STUPA","STUPE","STURT","STYED","STYES","STYLE","STYLI","STYMY","SUAVE","SUBAH","SUBAS","SUBER","SUCKS","SUCKY","SUCRE","SUDDS","SUDOR","SUDSY","SUEDE","SUERS","SUETE","SUETS","SUETY","SUGAR","SUGHS","SUING","SUINT","SUITE","SUITS","SUKHS","SULCI","SULFA","SULFO","SULKS","SULKY","SULLY","SULUS","SUMAC","SUMIS","SUMMA","SUMOS","SUMPS","SUNNA","SUNNS","SUNNY","SUNUP","SUPER","SUPES","SUPRA","SURAH","SURAL","SURAS","SURDS","SURER","SURFS","SURFY","SURGE","SURGY","SURLY","SURRA","SUSED","SUSES","SUSHI","SUTRA","SUTTA","SWABS","SWAGE","SWAGS","SWAIL","SWAIN","SWALE","SWAMI","SWAMP","SWAMY","SWANG","SWANK","SWANS","SWAPS","SWARD","SWARE","SWARF","SWARM","SWART","SWASH","SWATH","SWATS","SWAYS","SWEAR","SWEAT","SWEDE","SWEEP","SWEER","SWEET","SWELL","SWEPT","SWIFT","SWIGS","SWILE","SWILL","SWIMS","SWINE","SWING","SWINK","SWIPE","SWIRL","SWISH","SWISS","SWITH","SWIVE","SWOBS","SWOON","SWOOP","SWOPS","SWORD","SWORE","SWORN","SWOTS","SWOUN","SWUNG","SYCEE","SYCES","SYCON","SYKES","SYLIS","SYLPH","SYLVA","SYNCH","SYNCS","SYNOD","SYNTH","SYPHS","SYREN","SYRUP","SYSOP","TABBY","TABER","TABES","TABID","TABLA","TABLE","TABOO","TABOR","TABUN","TABUS","TACAN","TACES","TACET","TACHE","TACHS","TACIT","TACKS","TACKY","TACOS","TACTS","TAELS","TAFFY","TAFIA","TAHRS","TAIGA","TAIKO","TAILS","TAINS","TAINT","TAJES","TAKAS","TAKEN","TAKER","TAKES","TAKIN","TALAR","TALAS","TALCS","TALCY","TALER","TALES","TALKS","TALKY","TALLS","TALLY","TALON","TALUK","TALUS","TAMAL","TAMED","TAMER","TAMES","TAMIS","TAMMY","TAMPS","TANGA","TANGO","TANGS","TANGY","TANKA","TANKS","TANSY","TANTO","TAPAS","TAPED","TAPER","TAPES","TAPIR","TAPIS","TARDO","TARDY","TARED","TARES","TARGA","TARGE","TARNS","TAROC","TAROK","TAROS","TAROT","TARPS","TARRE","TARRY","TARSI","TARTS","TARTY","TASED","TASER","TASES","TASKS","TASSE","TASSO","TASTE","TASTY","TATAR","TATER","TATES","TATTY","TAUNT","TAUON","TAUPE","TAUTS","TAWED","TAWER","TAWIE","TAWNY","TAWSE","TAXED","TAXER","TAXES","TAXIS","TAXOL","TAXON","TAXUS","TAYRA","TAZZA","TAZZE","TEACH","TEAKS","TEALS","TEAMS","TEARS","TEARY","TEASE","TEATS","TECHS","TECHY","TECTA","TEDDY","TEELS","TEEMS","TEENS","TEENY","TEETH","TEFFS","TEGGS","TEGUA","TEGUS","TEIID","TEIND","TEINS","TELAE","TELCO","TELES","TELEX","TELIA","TELIC","TELLS","TELLY","TELOI","TELOS","TEMPI","TEMPO","TEMPS","TEMPT","TENCH","TENDS","TENDU","TENET","TENGE","TENIA","TENNE","TENNO","TENNY","TENON","TENOR","TENSE","TENTH","TENTS","TENTY","TEPAL","TEPAS","TEPEE","TEPID","TEPOY","TERAI","TERCE","TERES","TERGA","TERMS","TERNE","TERNS","TERRA","TERRY","TERSE","TESLA","TESTA","TESTS","TESTY","TETHS","TETRA","TETRI","TEUCH","TEUGH","TEWED","TEXAS","TEXTS","THACK","THALI","THANE","THANG","THANK","THARM","THAWS","THEBE","THECA","THEFT","THEGN","THEIN","THEIR","THEME","THENS","THERE","THERM","THESE","THESP","THETA","THEWS","THEWY","THICK","THIEF","THIGH","THILL","THINE","THING","THINK","THINS","THIOL","THIRD","THIRL","THOLE","THONG","THORN","THORO","THORP","THOSE","THOUS","THRAW","THREE","THREW","THRIP","THROB","THROE","THROW","THRUM","THUDS","THUGS","THUJA","THUMB","THUMP","THUNK","THURL","THUYA","THYME","THYMI","THYMY","TIANS","TIARA","TIBIA","TICAL","TICKS","TIDAL","TIDED","TIDES","TIERS","TIFFS","TIGER","TIGHT","TIGON","TIKES","TIKIS","TIKKA","TILAK","TILDE","TILED","TILER","TILES","TILLS","TILTH","TILTS","TIMED","TIMER","TIMES","TIMID","TINCT","TINEA","TINED","TINES","TINGE","TINGS","TINNY","TINTS","TIPIS","TIPPY","TIPSY","TIRED","TIRES","TIRLS","TIROS","TITAN","TITCH","TITER","TITHE","TITIS","TITLE","TITRE","TITTY","TIYIN","TIYNS","TIZES","TIZZY","TOADS","TOADY","TOAST","TOCKS","TOCOS","TODAY","TODDY","TOEAS","TOFFS","TOFFY","TOFTS","TOFUS","TOGAE","TOGAS","TOGUE","TOILE","TOILS","TOITS","TOKAY","TOKED","TOKEN","TOKER","TOKES","TOLAN","TOLAR","TOLAS","TOLED","TOLES","TOLLS","TOLTS","TOLUS","TOLYL","TOMAN","TOMBS","TOMES","TOMMY","TONAL","TONDI","TONDO","TONED","TONER","TONES","TONEY","TONGA","TONGS","TONIC","TONNE","TONUS","TOOLS","TOONS","TOOTH","TOOTS","TOPAZ","TOPED","TOPEE","TOPER","TOPES","TOPHE","TOPHI","TOPHS","TOPIC","TOPIS","TOPOI","TOPOS","TOQUE","TORAH","TORAS","TORCH","TORCS","TORES","TORIC","TORII","TOROS","TOROT","TORRS","TORSE","TORSI","TORSK","TORSO","TORTA","TORTE","TORTS","TORUS","TOSAS","TOTAL","TOTED","TOTEM","TOTER","TOTES","TOTTY","TOUCH","TOUGH","TOURS","TOUSE","TOUTS","TOWED","TOWEL","TOWER","TOWIE","TOWNS","TOWNY","TOXIC","TOXIN","TOYED","TOYER","TOYON","TOYOS","TRACE","TRACK","TRACT","TRADE","TRADS","TRAGI","TRAIK","TRAIL","TRAIN","TRAIT","TRAMP","TRAMS","TRANK","TRANQ","TRANS","TRAPS","TRAPT","TRASH","TRASS","TRAVE","TRAWL","TRAYF","TRAYS","TREAD","TREAT","TREED","TREEN","TREES","TREFA","TREKS","TREMS","TREND","TRESS","TRETS","TREWS","TREYF","TREYS","TRIAC","TRIAD","TRIAL","TRIBE","TRICE","TRICK","TRIED","TRIER","TRIES","TRIGO","TRIGS","TRIKE","TRILL","TRIMS","TRINE","TRIOL","TRIOS","TRIPE","TRIPS","TRITE","TROAK","TROCK","TRODE","TROGS","TROIS","TROKE","TROLL","TROMP","TRONA","TRONE","TROOP","TROOZ","TROPE","TROTH","TROTS","TROUT","TROVE","TROWS","TROYS","TRUCE","TRUCK","TRUED","TRUER","TRUES","TRUGS","TRULL","TRULY","TRUMP","TRUNK","TRUSS","TRUST","TRUTH","TRYMA","TRYST","TSADE","TSADI","TSARS","TSKED","TSUBA","TSUBO","TUBAE","TUBAL","TUBAS","TUBBY","TUBED","TUBER","TUBES","TUCKS","TUFAS","TUFFS","TUFTS","TUFTY","TUILE","TULES","TULIP","TULLE","TULSI","TUMID","TUMMY","TUMOR","TUMPS","TUNAS","TUNED","TUNER","TUNES","TUNGS","TUNIC","TUNNY","TUPIK","TUQUE","TURBO","TURDS","TURFS","TURFY","TURKS","TURNS","TURPS","TURRS","TUSHY","TUSKS","TUSKY","TUTEE","TUTOR","TUTTI","TUTTY","TUTUS","TUXES","TUYER","TWAES","TWAIN","TWANG","TWATS","TWEAK","TWEED","TWEEN","TWEEP","TWEER","TWEET","TWERP","TWICE","TWIER","TWIGS","TWILL","TWINE","TWINK","TWINS","TWINY","TWIRL","TWIRP","TWIST","TWITS","TWIXT","TWYER","TYEES","TYERS","TYING","TYIYN","TYKES","TYNED","TYNES","TYPAL","TYPED","TYPES","TYPEY","TYPIC","TYPOS","TYPPS","TYRED","TYRES","TYROS","TYTHE","TZARS","UDDER","UDONS","UHLAN","UKASE","ULAMA","ULANS","ULCER","ULEMA","ULNAD","ULNAE","ULNAR","ULNAS","ULPAN","ULTRA","ULVAS","UMAMI","UMBEL","UMBER","UMBOS","UMBRA","UMIAC","UMIAK","UMIAQ","UMMAH","UMMAS","UMMED","UMPED","UMPHS","UMPTY","UNAIS","UNAPT","UNARM","UNARY","UNAUS","UNBAN","UNBAR","UNBID","UNBOX","UNCAP","UNCIA","UNCLE","UNCOS","UNCOY","UNCUS","UNCUT","UNDEE","UNDER","UNDID","UNDOS","UNDUE","UNFED","UNFIT","UNFIX","UNGOT","UNHAT","UNHIP","UNICA","UNIFY","UNION","UNITE","UNITS","UNITY","UNJAM","UNLAY","UNLED","UNLET","UNLIT","UNMAN","UNMET","UNMEW","UNMIX","UNPEG","UNPEN","UNPIN","UNRIG","UNRIP","UNSAY","UNSET","UNSEW","UNSEX","UNTIE","UNTIL","UNWED","UNWET","UNWIT","UNWON","UNZIP","UPBOW","UPBYE","UPDOS","UPDRY","UPEND","UPLIT","UPPED","UPPER","UPSET","URAEI","URARE","URARI","URASE","URATE","URBAN","URBIA","UREAL","UREAS","UREDO","UREIC","URGED","URGER","URGES","URIAL","URINE","URPED","URSAE","URSID","USAGE","USERS","USHER","USING","USNEA","USQUE","USUAL","USURP","USURY","UTERI","UTILE","UTTER","UVEAL","UVEAS","UVULA","VACUA","VAGAL","VAGUE","VAGUS","VAILS","VAIRS","VAKIL","VALES","VALET","VALID","VALOR","VALSE","VALUE","VALVE","VAMPS","VAMPY","VANDA","VANED","VANES","VANGS","VAPID","VAPOR","VARAS","VAREC","VARIA","VARIX","VARNA","VARUS","VARVE","VASAL","VASES","VASTS","VASTY","VATIC","VATUS","VAULT","VAUNT","VEALS","VEALY","VEENA","VEEPS","VEERS","VEERY","VEGAN","VEGAS","VEGES","VEGIE","VEILS","VEINS","VEINY","VELAR","VELDS","VELDT","VELUM","VENAE","VENAL","VENDS","VENDU","VENGE","VENIN","VENOM","VENTS","VENUE","VENUS","VERBS","VERGE","VERSE","VERSO","VERST","VERTS","VERTU","VERVE","VESTA","VESTS","VETCH","VEXED","VEXER","VEXES","VEXIL","VIALS","VIAND","VIBES","VICAR","VICED","VICES","VICHY","VIDEO","VIERS","VIEWS","VIEWY","VIFFS","VIGAS","VIGIA","VIGIL","VIGOR","VILER","VILLA","VILLI","VILLS","VIMEN","VINAL","VINAS","VINCA","VINED","VINES","VINIC","VINOS","VINYL","VIOLA","VIOLS","VIPER","VIRAL","VIREO","VIRES","VIRGA","VIRID","VIRLS","VIRTU","VIRUS","VISAS","VISED","VISES","VISIT","VISOR","VISTA","VITAE","VITAL","VITTA","VIVAS","VIVAT","VIVID","VIXEN","VIZIR","VIZOR","VLEIS","VLOGS","VOCAB","VOCAL","VOCES","VODKA","VODOU","VODUN","VOGIE","VOGUE","VOICE","VOIDS","VOILA","VOILE","VOLAR","VOLED","VOLES","VOLKS","VOLTA","VOLTE","VOLTI","VOLTS","VOLVA","VOMER","VOMIT","VOTED","VOTER","VOTES","VOUCH","VOWED","VOWEL","VOWER","VOXEL","VROOM","VROUW","VROWS","VUGGS","VUGGY","VUGHS","VULGO","VULNS","VULVA","VYING","WACKE","WACKO","WACKS","WACKY","WADDY","WADED","WADER","WADES","WADIS","WAFER","WAFFS","WAFTS","WAGED","WAGER","WAGES","WAGON","WAHOO","WAIFS","WAILS","WAINS","WAIRS","WAIST","WAITS","WAIVE","WAKED","WAKEN","WAKER","WAKES","WALED","WALER","WALES","WALIS","WALKS","WALLA","WALLS","WALLY","WALTZ","WAMES","WAMUS","WANDS","WANED","WANES","WANEY","WANKS","WANLY","WANTS","WARDS","WARED","WARES","WAREZ","WARKS","WARMS","WARNS","WARPS","WARTS","WARTY","WASHY","WASPS","WASPY","WASTE","WASTS","WATAP","WATCH","WATER","WATTS","WAUGH","WAUKS","WAULS","WAVED","WAVER","WAVES","WAVEY","WAWLS","WAXED","WAXEN","WAXER","WAXES","WAZOO","WEALD","WEALS","WEANS","WEARS","WEARY","WEAVE","WEBBY","WEBER","WECHT","WEDEL","WEDGE","WEDGY","WEEDS","WEEDY","WEEKS","WEENS","WEENY","WEEPS","WEEPY","WEEST","WEETS","WEFTS","WEIGH","WEIRD","WEIRS","WEKAS","WELCH","WELDS","WELLS","WELLY","WELSH","WELTS","WENCH","WENDS","WENNY","WESTS","WETAS","WETLY","WHACK","WHALE","WHAMO","WHAMS","WHANG","WHAPS","WHARF","WHATS","WHAUP","WHEAL","WHEAT","WHEEL","WHEEN","WHEEP","WHELK","WHELM","WHELP","WHENS","WHERE","WHETS","WHEWS","WHEYS","WHICH","WHIDS","WHIFF","WHIGS","WHILE","WHIMS","WHINE","WHINS","WHINY","WHIPS","WHIPT","WHIRL","WHIRR","WHIRS","WHISH","WHISK","WHIST","WHITE","WHITS","WHITY","WHIZZ","WHOLE","WHOMP","WHOOF","WHOOP","WHOPS","WHORE","WHORL","WHORT","WHOSE","WHOSO","WHUMP","WHUPS","WHYDA","WICCA","WICKS","WIDDY","WIDEN","WIDER","WIDES","WIDOW","WIDTH","WIELD","WIFED","WIFES","WIFEY","WIFTY","WIGAN","WIGGY","WIGHT","WIKIS","WILCO","WILDS","WILED","WILES","WILLS","WILLY","WILTS","WIMPS","WIMPY","WINCE","WINCH","WINDS","WINDY","WINED","WINES","WINEY","WINGS","WINGY","WINKS","WINOS","WINZE","WIPED","WIPER","WIPES","WIRED","WIRER","WIRES","WIRRA","WISED","WISER","WISES","WISHA","WISPS","WISPY","WISTS","WITAN","WITCH","WITED","WITES","WITHE","WITHY","WITTY","WIVED","WIVER","WIVES","WIZEN","WIZES","WOADS","WOALD","WODGE","WOFUL","WOKEN","WOLDS","WOLFS","WOMAN","WOMBS","WOMBY","WOMEN","WOMYN","WONKS","WONKY","WONTS","WOODS","WOODY","WOOED","WOOER","WOOFS","WOOLS","WOOLY","WOOPS","WOOPY","WOOSH","WOOZY","WORDS","WORDY","WORKS","WORLD","WORMS","WORMY","WORRY","WORSE","WORST","WORTH","WORTS","WOULD","WOUND","WOVEN","WOWED","WOWEE","WRACK","WRANG","WRAPS","WRAPT","WRATH","WREAK","WRECK","WRENS","WREST","WRICK","WRIED","WRIER","WRIES","WRING","WRIST","WRITE","WRITS","WRONG","WROTE","WROTH","WRUNG","WRYER","WRYLY","WURST","WUSHU","WUSSY","WYLED","WYLES","WYNDS","WYNNS","WYTED","WYTES","XEBEC","XENIA","XENIC","XENON","XERIC","XEROX","XERUS","XYLAN","XYLEM","XYLOL","XYLYL","XYSTI","XYSTS","YABBY","YACHT","YACKS","YAFFS","YAGER","YAGES","YAGIS","YAHOO","YAIRD","YAMEN","YAMUN","YANGS","YANKS","YAPOK","YAPON","YAPPY","YARAK","YARDS","YARER","YARNS","YAUDS","YAULD","YAUPS","YAWED","YAWEY","YAWLS","YAWNS","YAWPS","YCLAD","YEAHS","YEANS","YEARN","YEARS","YEAST","YECCH","YECHS","YECHY","YEESH","YEGGS","YELKS","YELLS","YELPS","YENTA","YENTE","YERBA","YERKS","YESES","YETIS","YETTS","YEUKS","YEUKY","YIELD","YIKES","YILLS","YINCE","YIPES","YIRDS","YIRRS","YIRTH","YLEMS","YOBBO","YOBBY","YOCKS","YODEL","YODHS","YODLE","YOGAS","YOGEE","YOGHS","YOGIC","YOGIN","YOGIS","YOKED","YOKEL","YOKES","YOLKS","YOLKY","YOMIM","YOMPS","YONIC","YONIS","YONKS","YOOFS","YORES","YOUNG","YOURN","YOURS","YOUSE","YOUTH","YOWED","YOWES","YOWIE","YOWLS","YUANS","YUCAS","YUCCA","YUCCH","YUCKS","YUCKY","YUGAS","YUKKY","YULAN","YULES","YUMMY","YUPON","YUPPY","YURTA","YURTS","YUZUS","ZAIDA","ZAIDY","ZAIRE","ZAKAT","ZAMIA","ZANZA","ZAPPY","ZARFS","ZAXES","ZAYIN","ZAZEN","ZEALS","ZEBEC","ZEBRA","ZEBUS","ZEDAS","ZEINS","ZENDO","ZERKS","ZEROS","ZESTS","ZESTY","ZETAS","ZIBET","ZILCH","ZILLS","ZINCO","ZINCS","ZINCY","ZINEB","ZINES","ZINGS","ZINGY","ZINKY","ZIPPO","ZIPPY","ZIRAM","ZITIS","ZIZIT","ZLOTE","ZLOTY","ZOEAE","ZOEAL","ZOEAS","ZOMBI","ZONAE","ZONAL","ZONED","ZONER","ZONES","ZONKS","ZOOEY","ZOOID","ZOOKS","ZOOMS","ZOONS","ZOOTY","ZORIL","ZORIS","ZOUKS","ZOWEE","ZOWIE","ZUPPA","ZUZIM","ZYMES"]');
;// CONCATENATED MODULE: ./src/view/SolverView.ts
class SolverView {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'container cowordle-solver-container';
        this.watermark = document.createElement('div');
        this.watermark.className = 'watermark';
        const link = document.createElement('a');
        link.href = 'https://kielking.com';
        link.target = '_blank';
        link.textContent = 'made with ❤️ by Rijndael (AKA KielKing)';
        link.className = 'watermark-link';
        this.watermark.appendChild(link);
    }
    inject(element) {
        this.injectWatermark(element);
        if (element.contains(this.container)) {
            return;
        }
        element.appendChild(this.container);
    }
    injectWatermark(element) {
        if (element.contains(this.watermark)) {
            return;
        }
        element.appendChild(this.watermark);
    }
    update(data) {
        this.container.innerHTML = '';
        for (const word of data) {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            this.container.appendChild(wordElement);
        }
    }
}
/* harmony default export */ const view_SolverView = (SolverView);

;// CONCATENATED MODULE: ./src/model/SolverModel.ts
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SolverModel_view;


class SolverModel {
    constructor() {
        this.suggestedWords = [];
        this.correctLetters = [];
        this.elsewhereLetters = [];
        this.absentLetters = [];
        _SolverModel_view.set(this, void 0);
        __classPrivateFieldSet(this, _SolverModel_view, new view_SolverView(), "f");
        this.suggestedWords = words_namespaceObject;
        // const debugButton = document.createElement('button');
        // debugButton.textContent = 'Dump State';
        // debugButton.addEventListener('click', () => {
        //     console.log('correctLetters', this.correctLetters);
        //     console.log('elsewhereLetters', this.elsewhereLetters);
        //     console.log('absentLetters', this.absentLetters);
        // });
        // document.evaluate('/html/body/div[1]/div/section', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.appendChild(debugButton);
    }
    getSuggestedWords() {
        return this.suggestedWords;
    }
    setSuggestedWords(words) {
        this.suggestedWords = words;
        __classPrivateFieldGet(this, _SolverModel_view, "f").update(this.suggestedWords);
    }
    updateState(letters) {
        for (const letter of letters) {
            switch (letter.status) {
                case 'absent':
                    if (this.absentLetters.find(x => x.index === letter.index && x.letter.toUpperCase() === letter.letter.toUpperCase())) {
                        continue;
                    }
                    this.absentLetters.push(letter);
                    break;
                case 'elsewhere':
                    if (this.elsewhereLetters.find(x => x.index === letter.index && x.letter.toUpperCase() === letter.letter.toUpperCase())) {
                        continue;
                    }
                    this.elsewhereLetters.push(letter);
                    break;
                case 'correct':
                    for (const [index, elsewhereLetter] of this.elsewhereLetters.entries()) {
                        if (elsewhereLetter.index === letter.index) {
                            this.elsewhereLetters.splice(index, 1);
                        }
                    }
                    const correctLetterAtSameIndex = this.correctLetters.find(x => x.index === letter.index);
                    if (correctLetterAtSameIndex && correctLetterAtSameIndex.letter.toUpperCase() === letter.letter.toUpperCase()) {
                        continue;
                    }
                    else if (correctLetterAtSameIndex) {
                        const index = this.correctLetters.findIndex(x => x.index === letter.index);
                        this.correctLetters.splice(index, 1);
                    }
                    this.correctLetters.push(letter);
                    break;
            }
        }
    }
    calculateSuggestedWords(letters) {
        this.updateState(letters);
        const suggestedWords = [];
        wordsLoop: for (const word of words_namespaceObject) {
            const wordLetters = word.split('');
            for (const correctLetter of this.correctLetters) {
                if (wordLetters[correctLetter.index].toUpperCase() !== correctLetter.letter.toUpperCase()) {
                    continue wordsLoop;
                }
            }
            for (const elsewhereLetter of this.elsewhereLetters) {
                if (!wordLetters.some((letter) => letter.toUpperCase() === elsewhereLetter.letter.toUpperCase())) {
                    continue wordsLoop;
                }
            }
            for (const absentLetter of this.absentLetters) {
                const wordLetterIndex = wordLetters.findIndex((letter) => letter.toUpperCase() === absentLetter.letter.toUpperCase());
                if (wordLetterIndex !== -1) {
                    if (this.correctLetters.find(x => x.letter.toUpperCase() === absentLetter.letter.toUpperCase())) {
                        if (wordLetterIndex === absentLetter.index) {
                            continue wordsLoop;
                        }
                    }
                    else {
                        continue wordsLoop;
                    }
                }
            }
            suggestedWords.push(word);
        }
        this.setSuggestedWords(suggestedWords);
    }
    reset() {
        this.correctLetters = [];
        this.elsewhereLetters = [];
        this.absentLetters = [];
        this.setSuggestedWords(words_namespaceObject);
    }
    inject(element) {
        __classPrivateFieldGet(this, _SolverModel_view, "f").inject(element);
    }
}
_SolverModel_view = new WeakMap();
/* harmony default export */ const model_SolverModel = (SolverModel);

;// CONCATENATED MODULE: ./src/controller/SolverController.ts
var SolverController_classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var SolverController_classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SolverController_model, _SolverController_observer;

const PLAYER_GAME_ROWS_XPATH = '/html/body/div[1]/div/section/div/div[1]/div/div/div/div/div[2]/div[1]/div/div[1]/div/div[1]';
const LETTER_ABSENT_CLASS = 'letter-absent';
const LETTER_CORRECT_CLASS = 'letter-correct';
const LETTER_ELSEWHERE_CLASS = 'letter-elsewhere';
class SolverController {
    constructor() {
        _SolverController_model.set(this, void 0);
        _SolverController_observer.set(this, void 0);
        SolverController_classPrivateFieldSet(this, _SolverController_model, new model_SolverModel(), "f");
        this.playerGameRows = document.evaluate(PLAYER_GAME_ROWS_XPATH, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        SolverController_classPrivateFieldSet(this, _SolverController_observer, new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName !== 'class') {
                    return;
                }
                const target = mutation.target;
                if (!(target instanceof HTMLElement)) {
                    return;
                }
                const index = Array.from(target.parentElement.children).indexOf(target);
                const letter = target.textContent;
                const status = target.classList.contains(LETTER_ABSENT_CLASS) ? 'absent' :
                    target.classList.contains(LETTER_CORRECT_CLASS) ? 'correct' :
                        target.classList.contains(LETTER_ELSEWHERE_CLASS) ? 'elsewhere' : 'unknown';
                if (status === 'unknown') {
                    return;
                }
                SolverController_classPrivateFieldGet(this, _SolverController_model, "f").calculateSuggestedWords([{
                        index,
                        letter,
                        status
                    }]);
            });
        }), "f");
        SolverController_classPrivateFieldGet(this, _SolverController_observer, "f").observe(this.playerGameRows, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }
    reset() {
        SolverController_classPrivateFieldGet(this, _SolverController_model, "f").reset();
    }
    inject(element) {
        SolverController_classPrivateFieldGet(this, _SolverController_model, "f").inject(element);
    }
}
_SolverController_model = new WeakMap(), _SolverController_observer = new WeakMap();
/* harmony default export */ const controller_SolverController = (SolverController);

;// CONCATENATED MODULE: ./src/index.ts


const COWORDLE_CONTAINER_XPATH = '/html/body/div[1]/div/section';
const COWORDLE_ADVERTISEMENT_BANNER_XPATH = '/html/body/div[1]/div/section/div[1]/div[2]';
const src_main = async () => {
    const advertisementBanner = document.evaluate(COWORDLE_ADVERTISEMENT_BANNER_XPATH, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (advertisementBanner) {
        advertisementBanner.parentNode.removeChild(advertisementBanner);
    }
    const controller = new controller_SolverController();
    controller.inject(document.evaluate(COWORDLE_CONTAINER_XPATH, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    document.addEventListener('click', event => {
        const target = event.target;
        if (!(target instanceof HTMLButtonElement) ||
            target.getAttribute('type') !== 'button' ||
            (target.textContent !== 'New Game' && target.textContent !== 'Play' && target.textContent !== 'Rematch')) {
            return;
        }
        controller.reset();
    });
};
src_main().catch((error) => {
    console.log(error);
});

})();

/******/ })()
;