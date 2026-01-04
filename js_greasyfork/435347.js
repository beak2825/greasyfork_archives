// ==UserScript==
// @name         Spacing.js
// @namespace    https://github.com/stevenlei
// @version      1.0.5
// @description  A JavaScript utility for measuring the spacing between elements on webpage.
// @author       Steven Lei <contact@stevenlei.com>
// @run-at       document-start
// @include      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435347/Spacingjs.user.js
// @updateURL https://update.greasyfork.org/scripts/435347/Spacingjs.meta.js
// ==/UserScript==
'use strict';
/*!
 * Spacing.js v1.0.5
 * Copyright (c) 2021 Steven Lei
 * Released under the MIT License.
*/
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

;// CONCATENATED MODULE: ./src/rect.ts
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Rect = /*#__PURE__*/function () {
  function Rect(rect) {
    _classCallCheck(this, Rect);

    this.top = rect.top;
    this.left = rect.left;
    this.width = rect.width;
    this.height = rect.height;
    this.right = rect.right;
    this.bottom = rect.bottom;
  }

  _createClass(Rect, [{
    key: "colliding",
    value: function colliding(other) {
      return !(this.top > other.bottom || this.right < other.left || this.bottom < other.top || this.left > other.right);
    }
  }, {
    key: "containing",
    value: function containing(other) {
      return this.left <= other.left && other.left < this.width && this.top <= other.top && other.top < this.height;
    }
  }, {
    key: "inside",
    value: function inside(other) {
      return other.top <= this.top && this.top <= other.bottom && other.top <= this.bottom && this.bottom <= other.bottom && other.left <= this.left && this.left <= other.right && other.left <= this.right && this.right <= other.right;
    }
  }]);

  return Rect;
}();


;// CONCATENATED MODULE: ./src/placeholder.ts
function createPlaceholderElement(type, width, height, top, left, color) {
  var placeholder = document.createElement('div');
  placeholder.classList.add("spacing-js-".concat(type, "-placeholder"));
  placeholder.style.border = "2px solid ".concat(color);
  placeholder.style.position = 'fixed';
  placeholder.style.background = 'none';
  placeholder.style.borderRadius = '2px';
  placeholder.style.padding = '0';
  placeholder.style.margin = '0';
  placeholder.style.width = "".concat(width - 2, "px");
  placeholder.style.height = "".concat(height - 2, "px");
  placeholder.style.top = "".concat(top - 1, "px");
  placeholder.style.left = "".concat(left - 1, "px");
  placeholder.style.pointerEvents = 'none';
  placeholder.style.zIndex = '9999';
  placeholder.style.boxSizing = 'content-box';
  document.body.appendChild(placeholder);
}
function clearPlaceholderElement(type) {
  var _document$querySelect;

  (_document$querySelect = document.querySelector(".spacing-js-".concat(type, "-placeholder"))) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.remove();
}
;// CONCATENATED MODULE: ./src/marker.ts
function createLine(width, height, top, left, text) {
  var border = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'none';
  var marker = document.createElement('span');
  marker.style.backgroundColor = 'red';
  marker.style.position = 'fixed';
  marker.classList.add("spacing-js-marker");
  marker.style.width = "".concat(width, "px");
  marker.style.height = "".concat(height, "px");

  if (border === 'x') {
    marker.style.borderLeft = '1px solid rgba(255, 255, 255, .8)';
    marker.style.borderRight = '1px solid rgba(255, 255, 255, .8)';
  }

  if (border === 'y') {
    marker.style.borderTop = '1px solid rgba(255, 255, 255, .8)';
    marker.style.borderBottom = '1px solid rgba(255, 255, 255, .8)';
  }

  marker.style.pointerEvents = 'none';
  marker.style.top = "".concat(top, "px");
  marker.style.left = "".concat(left, "px");
  marker.style.zIndex = '9998';
  marker.style.boxSizing = 'content-box';
  var value = document.createElement('span');
  value.classList.add("spacing-js-value");
  value.style.backgroundColor = 'red';
  value.style.color = 'white';
  value.style.fontSize = '10px';
  value.style.display = 'inline-block';
  value.style.fontFamily = 'Helvetica, sans-serif';
  value.style.fontWeight = 'bold';
  value.style.borderRadius = '20px';
  value.style.position = 'fixed';
  value.style.width = '42px';
  value.style.lineHeight = '15px';
  value.style.height = '16px';
  value.style.textAlign = 'center';
  value.style.zIndex = '10000';
  value.style.pointerEvents = 'none';
  value.innerText = text;
  value.style.boxSizing = 'content-box';

  if (border === 'x') {
    // Prevent the badge moved outside the screen
    var topOffset = top + height / 2 - 7;

    if (topOffset > document.documentElement.clientHeight - 20) {
      topOffset = document.documentElement.clientHeight - 20;
    }

    if (topOffset < 0) {
      topOffset = 6;
    }

    value.style.top = "".concat(topOffset, "px");
    value.style.left = "".concat(left + 6, "px");
  } else if (border === 'y') {
    // Prevent the badge moved outside the screen
    var leftOffset = left + width / 2 - 20;

    if (leftOffset > document.documentElement.clientWidth - 48) {
      leftOffset = document.documentElement.clientWidth - 48;
    }

    if (leftOffset < 0) {
      leftOffset = 6;
    }

    value.style.top = "".concat(top + 6, "px");
    value.style.left = "".concat(leftOffset, "px");
  }

  document.body.appendChild(marker);
  document.body.appendChild(value);
}

function placeMark(rect1, rect2, direction, value) {
  var edgeToEdge = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  if (direction === 'top') {
    var width = 1;
    var height = Math.abs(rect1.top - rect2.top);
    var left = Math.floor((Math.min(rect1.right, rect2.right) + Math.max(rect1.left, rect2.left)) / 2);
    var top = Math.min(rect1.top, rect2.top);

    if (edgeToEdge) {
      if (rect1.top < rect2.top) {
        return;
      } // If not colliding


      if (rect1.right < rect2.left || rect1.left > rect2.right) {
        return;
      }

      height = Math.abs(rect2.bottom - rect1.top);
      top = Math.min(rect2.bottom, rect1.top);
    }

    createLine(width, height, top, left, value, 'x');
  } else if (direction === 'left') {
    var _width = Math.abs(rect1.left - rect2.left);

    var _height = 1;

    var _top = Math.floor((Math.min(rect1.bottom, rect2.bottom) + Math.max(rect1.top, rect2.top)) / 2);

    var _left = Math.min(rect1.left, rect2.left);

    if (edgeToEdge) {
      if (rect1.left < rect2.left) {
        return;
      } // If not overlapping


      if (rect1.bottom < rect2.top || rect1.top > rect2.bottom) {
        return;
      }

      _width = Math.abs(rect1.left - rect2.right);
      _left = Math.min(rect2.right, rect1.left);
    }

    createLine(_width, _height, _top, _left, value, 'y');
  } else if (direction === 'right') {
    var _width2 = Math.abs(rect1.right - rect2.right);

    var _height2 = 1;

    var _top2 = Math.floor((Math.min(rect1.bottom, rect2.bottom) + Math.max(rect1.top, rect2.top)) / 2);

    var _left2 = Math.min(rect1.right, rect2.right);

    if (edgeToEdge) {
      if (rect1.left > rect2.right) {
        return;
      } // If not overlapping


      if (rect1.bottom < rect2.top || rect1.top > rect2.bottom) {
        return;
      }

      _width2 = Math.abs(rect1.right - rect2.left);
    }

    createLine(_width2, _height2, _top2, _left2, value, 'y');
  } else if (direction === 'bottom') {
    var _width3 = 1;

    var _height3 = Math.abs(rect1.bottom - rect2.bottom);

    var _top3 = Math.min(rect1.bottom, rect2.bottom);

    var _left3 = Math.floor((Math.min(rect1.right, rect2.right) + Math.max(rect1.left, rect2.left)) / 2);

    if (edgeToEdge) {
      if (rect2.bottom < rect1.top) {
        return;
      } // If not overlapping


      if (rect1.right < rect2.left || rect1.left > rect2.right) {
        return;
      }

      _height3 = Math.abs(rect1.bottom - rect2.top);
    }

    createLine(_width3, _height3, _top3, _left3, value, 'x');
  }
}
function removeMarks() {
  document.querySelectorAll('.spacing-js-marker').forEach(function (element) {
    element.remove();
  });
  document.querySelectorAll('.spacing-js-value').forEach(function (element) {
    element.remove();
  });
}
;// CONCATENATED MODULE: ./src/spacing.ts



var active = false;
var selectedElement;
var targetElement;
var originalBodyOverflow;
var Spacing = {
  start: function start() {
    if (!document.body) {
      console.warn("Unable to initialise, document.body does not exist.");
      return;
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Alt' && !active) {
        e.preventDefault();
        active = true;
        setSelectedElement();
        preventPageScroll(true);
      }
    });
    window.addEventListener('keyup', function (e) {
      active = false;
      clearPlaceholderElement('selected');
      clearPlaceholderElement('target');
      selectedElement = null;
      targetElement = null;
      removeMarks();
      preventPageScroll(false);
    });
    window.addEventListener('mousemove', function (e) {
      setTargetElement().then(function () {
        if (selectedElement != null && targetElement != null) {
          // Do the calculation
          var selectedElementRect = selectedElement.getBoundingClientRect();
          var targetElementRect = targetElement.getBoundingClientRect();
          var selected = new Rect(selectedElementRect);
          var target = new Rect(targetElementRect);
          removeMarks();
          var top, bottom, left, right, outside;

          if (selected.containing(target) || selected.inside(target) || selected.colliding(target)) {
            console.log("containing || inside || colliding");
            top = Math.round(Math.abs(selectedElementRect.top - targetElementRect.top));
            bottom = Math.round(Math.abs(selectedElementRect.bottom - targetElementRect.bottom));
            left = Math.round(Math.abs(selectedElementRect.left - targetElementRect.left));
            right = Math.round(Math.abs(selectedElementRect.right - targetElementRect.right));
            outside = false;
          } else {
            console.log("outside");
            top = Math.round(Math.abs(selectedElementRect.top - targetElementRect.bottom));
            bottom = Math.round(Math.abs(selectedElementRect.bottom - targetElementRect.top));
            left = Math.round(Math.abs(selectedElementRect.left - targetElementRect.right));
            right = Math.round(Math.abs(selectedElementRect.right - targetElementRect.left));
            outside = true;
          }

          placeMark(selected, target, 'top', "".concat(top, "px"), outside);
          placeMark(selected, target, 'bottom', "".concat(bottom, "px"), outside);
          placeMark(selected, target, 'left', "".concat(left, "px"), outside);
          placeMark(selected, target, 'right', "".concat(right, "px"), outside);
        }
      });
    });
  }
};

function setSelectedElement() {
  var elements = document.querySelectorAll(':hover');
  var el = elements[elements.length - 1];

  if (el !== selectedElement) {
    selectedElement = el;
    clearPlaceholderElement('selected');
    var rect = selectedElement.getBoundingClientRect();
    createPlaceholderElement('selected', rect.width, rect.height, rect.top, rect.left, "red");
  }
}

function setTargetElement() {
  return new Promise(function (resolve, reject) {
    var elements = document.querySelectorAll(':hover');
    var el = elements[elements.length - 1];

    if (active && el !== selectedElement && el !== targetElement) {
      targetElement = el;
      clearPlaceholderElement('target');
      var rect = targetElement.getBoundingClientRect();
      createPlaceholderElement('target', rect.width, rect.height, rect.top, rect.left, 'blue');
      resolve();
    }
  });
}

function preventPageScroll(active) {
  if (active) {
    window.addEventListener('DOMMouseScroll', scrollingPreventDefault, false);
    window.addEventListener('wheel', scrollingPreventDefault, {
      passive: false
    });
    window.addEventListener('mousewheel', scrollingPreventDefault, {
      passive: false
    });
  } else {
    window.removeEventListener('DOMMouseScroll', scrollingPreventDefault);
    window.removeEventListener('wheel', scrollingPreventDefault);
    window.removeEventListener('mousewheel', scrollingPreventDefault);
  }
}

function scrollingPreventDefault(e) {
  e.preventDefault();
}

/* harmony default export */ const spacing = (Spacing);
;// CONCATENATED MODULE: ./src/index.ts
 // Simple, Start.

spacing.start();
window.Spacing = __webpack_exports__;
/******/ })()
;