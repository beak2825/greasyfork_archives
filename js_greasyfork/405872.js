// ==UserScript==
// @name        Listography Backup
// @version     1.0.0
// @author      petracoding
// @namespace   petracoding
// @grant       none
// @include     https://listography.com/*
// @include     http://listography.com/*
// @description Adds functionality for plaintext list export for backup purposes
// @downloadURL https://update.greasyfork.org/scripts/405872/Listography%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/405872/Listography%20Backup.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 84:
/***/ ((module, exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(645);
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.id, ".backup-button{background:none;border:none;color:#777;font-family:helvetica, arial, sans-serif;font-size:12px;cursor:pointer;font-style:italic}.backup-button:hover,.backup-button:focus{text-decoration:underline}#backup-loading,.backup-popup{position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);padding:50px;background:white;z-index:999;border:2px dotted lightgray;border-radius:5px;width:500px;min-height:200px;justify-content:center;align-items:center}.backup-popup h1{margin-top:0;margin-bottom:0}.backup-popup h2{margin-top:30px}.backup-popup textarea{width:100%;min-height:300px;border:1px solid #919191;border-radius:5px;padding:10px;box-sizing:border-box}.backup-popup{width:80%;min-height:300px}.backup-popup-scrollbox{max-height:300px;overflow-y:auto;border:1px solid #919191;border-radius:5px;padding:10px}.backup-popup-overlay{content:\"\";position:fixed;z-index:99;background:rgba(0,0,0,0.7);width:100%;height:100%;top:0;left:0}\n", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ 645:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
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

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
  return "/*# ".concat(data, " */");
}

/***/ }),

/***/ 121:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var api = __webpack_require__(379);
            var content = __webpack_require__(84);

            content = content.__esModule ? content.default : content;

            if (typeof content === 'string') {
              content = [[module.id, content, '']];
            }

var options = {};

options.insert = "head";
options.singleton = false;

var update = api(content, options);



module.exports = content.locals || {};

/***/ }),

/***/ 379:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

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
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
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
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/* harmony import */ var _css_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(121);
/* harmony import */ var _css_main_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_main_scss__WEBPACK_IMPORTED_MODULE_0__);

// import "./folder/file";

const pathname = getPathOfUrl();
const userName = getPathOfUrl(document.querySelector(".user-box .title a").href).substring(1);
const userId = document.querySelector(".about img").getAttribute("src").replace("/action/user-image?uid=", "");
const indexPath = "/" + userName + "/index";

let popup;
let popupoverlay;
let listsToBackup = (/* unused pure expression or super */ null && ([]));
let output = "";
let listOutputHtml = "";
let listOutputListography = "";
let asyncForEach;

init();

function init() {
  // only if the user is on their profile
  if (document.querySelector(".global-menu .create-list")) {
    console.log("Listography Export script by petracoding loaded. => https://greasyfork.org/en/scripts/405872-listography-backup");
    HTML();

    // "forEach" is not async. here is our own async version of it.
    // usage: await asyncForEach(myArray, async () => { ... })
    asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    };

    // start backup if user clicked the backup all link and was redirected to the archive
    if (pathname == indexPath + "?backup=true") {
      startBackupAll();
    }
  }
}

////////////////////////////////////  BACKUP

async function startBackupAll() {
  const listLinksToOpen = document.querySelectorAll(".body_folder .list a");
  if (!listLinksToOpen) {
    showPopup("No lists found.", true);
    return;
  }

  startOutput();

  await asyncForEach([...listLinksToOpen], async (link) => {
    let list = await openListInArchive(link);
    await editListAndAddToOutput(list);
    readListAndAddToOutput(list);
  });

  finishOutput();
}

async function startBackupVisible() {
  const listSelector = ".list-container";
  const listSelectorInArchive = "#list_container .slot";

  const listNodes = document.querySelectorAll(listSelector + ", " + listSelectorInArchive);

  if (!listNodes || listNodes.length < 1) {
    showPopup("No visible lists found.", true);
    return;
  }

  startOutput();

  await asyncForEach([...listNodes], async (list) => {
    await editListAndAddToOutput(list);
    readListAndAddToOutput(list);
  });

  finishOutput();
}

function openListInArchive(link) {
  let listOpenPromise = new Promise(function (resolve, reject) {
    link.click();
    let listId = link.getAttribute("id").replace("list_" + userId + "_", "");

    let attempt = 1;
    let checkIfIsInEditMode = setInterval(function () {
      if (document.querySelector("#listbox-" + listId + " .menu")) {
        resolve(document.querySelector("#listbox-" + listId));
        clearInterval(checkIfIsInEditMode);
      } else {
        if (attempt > 200) {
          reject("List could not be backed up.");
          clearInterval(checkIfIsInEditMode);
        }
        attempt = attempt + 1;
      }
    }, 100);
  });

  listOpenPromise.then(
    function (list) {
      return list;
    },
    function (errorMsg) {
      alert(errorMsg);
    }
  );

  return listOpenPromise;
}

function readListAndAddToOutput(listElement) {
  const listContent = listElement.querySelector(".text_content").innerHTML;
  listOutputHtml += "<br/><br/><br/>";
  listOutputHtml += getListOutput(listElement, listContent, true);
}

function editListAndAddToOutput(listElement) {
  let listEditPromise = new Promise(function (resolve, reject) {
    const editButton = listElement.querySelector(".menu .item a[href*=edit-list]");
    if (!editButton) {
      reject("List could not be edited.");
    }
    editButton.click();

    let attempt = 1;
    let checkIfIsInEditMode = setInterval(function () {
      if (listElement.querySelector(".category_editor")) {
        let listContent = listElement.querySelector("textarea").innerHTML;
        listElement.querySelector(".cancel.button_1_of_3").click();
        resolve(listContent);
        clearInterval(checkIfIsInEditMode);
      } else {
        if (attempt > 200) {
          reject("List could not be backed up.");
          clearInterval(checkIfIsInEditMode);
        }
        attempt = attempt + 1;
      }
    }, 100);
  });

  listEditPromise.then(
    function (listContent) {
      listOutputListography += "\n\n\n--------------------------------------------------------\n\n\n";
      listOutputListography += getListOutput(listElement, listContent, false);
    },
    function (errorMsg) {
      alert(errorMsg);
    }
  );

  return listEditPromise;
}

////////////////////////////////////  HELPERS

function getPathOfUrl(url, tld) {
  let href;
  if (!url) {
    href = window.location.href;
  } else {
    href = url;
  }
  let ending;
  if (!tld) {
    ending = ".com/";
  } else {
    ending = "." + tld + "/";
  }
  return href.substring(href.indexOf(ending) + ending.length - 1);
}

function startOutput() {
  document.querySelector("#backup-loading").style.display = "block";
  popupoverlay.style.display = "block";
  const url = location.href.replace("?backup=true", "");
  output = "<h1>Here are your lists:</h1><h2>Listography Markup</h2><textarea id='backup-output'>Backup of " + url;
}

function finishOutput() {
  document.querySelector("#backup-loading").style.display = "none";
  popupoverlay.style.display = "none";
  showPopup(output + listOutputListography + "</textarea><h2>HTML</h2><div class='backup-popup-scrollbox'>" + listOutputHtml + "</div>", true);
}

function getListOutput(listEl, listContent, htmlMode) {
  if (!listEl || !listContent) return;

  let listId;
  if (listEl.querySelector(".listbox")) {
    listId = listEl.querySelector(".listbox").getAttribute("id").replace("listbox-", "");
  } else {
    listId = listEl.querySelector("[id*=listbox-content-slot]").getAttribute("id").replace("listbox-content-slot-", "");
  }

  let listLink = "Link: " + listEl.querySelector(".box-title a").getAttribute("href");

  let listTitle = listEl.querySelector(".box-title a").innerHTML.replace('<span class="box-subtitle">', "").replace("</span>", "").replace(/\s\s+/g, " ").trim();

  let listDates = "created on " + listEl.querySelector(".dates").innerHTML.replace("∞", "").replace("+", "").replace(" <br>", ", last updated on ").replace(/\s\s+/g, " ").trim();

  let listImage = listEl.querySelector(".icon");
  if (listImage) {
    listImage = "\nIcon: " + listImage.getAttribute("src").replace("&small=1", "");
  } else {
    listImage = "";
  }

  if (htmlMode) {
    return `<div class="box-title"><a href="${listLink}">${listTitle}</a></div><br />(${listDates})<br />${listImage}<br />` + adjustListContent(listContent, listId);
  }

  return listTitle + "\n" + listLink + "\n(" + listDates + ")" + listImage + "\n\n" + adjustListContent(listContent, listId);
}

function adjustListContent(listContent, listId) {
  // Add image urls
  const attachmentUrl = "https://listography.com/user/" + userId + "/list/" + listId + "/attachment/";
  listContent = listContent.replace(/\[([a-z]+)\]/g, "[$1: " + attachmentUrl + "$1]");

  return listContent;
}

////////////////////////////////////  HTML

function HTML() {
  createPopup();
  createLoading();

  createBackupAllButton();
  createBackupVisibleButton();
}

function createBackupAllButton() {
  const menu = document.querySelector(".global-menu tbody");
  const tr = document.createElement("tr");
  const td = document.createElement("td");

  const button = document.createElement("input");
  button.type = "button";
  button.value = "backup all";
  button.className = "backup-button";

  if (onIndexPage()) {
    button.onclick = startBackupAll;
  } else {
    button.onclick = goToIndex;
  }

  td.appendChild(button);
  tr.appendChild(td);
  menu.appendChild(tr);
}

function createBackupVisibleButton() {
  const menu = document.querySelector(".global-menu tbody");
  const tr = document.createElement("tr");
  const td = document.createElement("td");

  const button = document.createElement("input");
  button.type = "button";
  button.value = "backup visible";
  button.className = "backup-button";
  button.onclick = startBackupVisible;

  td.appendChild(button);
  tr.appendChild(td);
  menu.appendChild(tr);
}

function onIndexPage() {
  return pathname.startsWith(indexPath) && pathname.indexOf("?v") < 0;
}

function goToIndex() {
  location.href = indexPath + "?backup=true";
}

function createPopup() {
  popupoverlay = document.createElement("div");
  popupoverlay.className = "backup-popup-overlay";
  popup = document.createElement("div");
  popup.className = "backup-popup";

  document.body.appendChild(popup);
  document.body.appendChild(popupoverlay);

  hidePopup();
}

function createLoading() {
  let loading = document.createElement("div");
  loading.setAttribute("id", "backup-loading");
  loading.style.display = "none";
  loading.innerHTML =
    "<h1>Loading...</h1><h2>Please wait while the list contents are being copied.</h2>This may take a while if you have more than 100 lists. Don't worry, your lists are not being edited, and the date of the last edit will also not change.";

  document.body.appendChild(loading);
}

function showPopup(text, allowClosing) {
  if (text) popup.innerHTML = text;
  popupoverlay.style.display = "block";
  popup.style.display = "block";
  document.body.style.overflow = "hidden";

  if (allowClosing) {
    popupoverlay.onclick = hidePopup;
  }
}

function hidePopup() {
  popup.style.display = "none";
  popupoverlay.style.display = "none";
  document.body.style.overflow = "auto";
}

})();

/******/ })()
;