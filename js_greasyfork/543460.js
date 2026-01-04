// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"49CxU":[function(require,module,exports) {
// BANNER GUARD
// ==UserScript==
// BANNER GUARD
// @locale       english
// @name         yt_clipper
// @version      5.37.0
// @description  Mark up YouTube videos and quickly generate clipped webms.
// @author       elwm
// @namespace    https://github.com/exwm
// @homepage     https://github.com/exwm/yt_clipper
// @supportURL   https://github.com/exwm/yt_clipper/issues
// @icon         https://raw.githubusercontent.com/exwm/yt_clipper/master/assets/image/pepe-clipper.gif
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jszip@3.4.0/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/gh/exwm/Chart.js@141fe542034bc127b0a932de25d0c4f351f3bce1/dist/Chart.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js
// @require      https://cdn.jsdelivr.net/gh/exwm/chartjs-plugin-zoom@b1adf6115d5816cabf0d82fba87950a32f7f965e/dist/chartjs-plugin-zoom.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.7.0/dist/chartjs-plugin-datalabels.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-style@0.5.0/dist/chartjs-plugin-style.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@0.5.7/chartjs-plugin-annotation.min.js
// @run-at       document-end
// @match        http*://*.youtube.com/*
// @match        http*://*.vlive.tv/video/*
// @match        http*://*.vlive.tv/post/*
// @match        http*://weverse.io/*
// @match        https*://tv.naver.com/*
// @match        https*://*.afreecatv.com/*
// @match        https*://exwm.github.io/yt_clipper/*
// @noframes
// dummy grant to enable sandboxing
// @grant         GM_getValue
// BANNER GUARD
// @downloadURL https://update.greasyfork.org/scripts/543460/yt_clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/543460/yt_clipper.meta.js
// ==/UserScript==
// BANNER GUARD
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "player", ()=>player);
parcelHelpers.export(exports, "video", ()=>video);
parcelHelpers.export(exports, "markerPairs", ()=>markerPairs);
parcelHelpers.export(exports, "prevSelectedMarkerPairIndex", ()=>prevSelectedMarkerPairIndex);
parcelHelpers.export(exports, "isCropChartLoopingOn", ()=>isCropChartLoopingOn);
parcelHelpers.export(exports, "triggerCropChartLoop", ()=>triggerCropChartLoop);
var _chartJs = require("chart.js");
var _util = require("./util/util");
var _commonTags = require("common-tags");
var _d3Ease = require("d3-ease");
var _fileSaver = require("file-saver");
var _fs = require("fs");
var _immer = require("immer");
var _jszip = require("jszip");
var _jszipDefault = parcelHelpers.interopDefault(_jszip);
var _lodashClonedeep = require("lodash.clonedeep");
var _lodashClonedeepDefault = parcelHelpers.interopDefault(_lodashClonedeep);
var _misc = require("./actions/misc");
var _crop = require("./crop/crop");
var _common = require("./platforms/blockers/common");
var _youtube = require("./platforms/blockers/youtube");
var _platforms = require("./platforms/platforms");
var _chartJsDragDataPlugin = require("./ui/chart/chart.js-drag-data-plugin");
var _chartutil = require("./ui/chart/chartutil");
var _cropChartSpec = require("./ui/chart/cropchart/cropChartSpec");
var _scatterChartSpec = require("./ui/chart/scatterChartSpec");
var _speedChartSpec = require("./ui/chart/speedchart/speedChartSpec");
var _css = require("./ui/css/css");
var _tooltips = require("./ui/tooltips");
var _undoredo = require("./util/undoredo");
var _cropPreview = require("./crop/crop-preview");
const __version__ = "5.37.0";
const ytClipperCSS = ":root {\n  --lighter-grey: rgb(235, 235, 235);\n  --light-grey: rgb(210, 210, 210);\n  --med-light-grey: rgb(160, 160, 160);\n  --med-grey: rgb(110, 110, 110);\n  --med-dark-grey: rgb(90, 90, 90);\n  --dark-grey: rgb(40, 40, 40);\n  --darker-grey: rgb(10, 10, 10);\n  --bright-red: rgb(255, 0, 0);\n  --dark-red: rgb(50, 0, 0);\n  --marker-pair-editor-accent: rgb(245, 118, 0);\n  --global-editor-accent: rgb(245, 0, 0);\n  --inherited-accent: dimgrey;\n}\n\n@keyframes valid-input {\n  0% {\n    background-color: tomato;\n  }\n  100% {\n    background-color: lightgreen;\n  }\n}\n\n@keyframes invalid-input {\n  0% {\n    background-color: lightgreen;\n  }\n  100% {\n    background-color: tomato;\n  }\n}\n\n@keyframes flash {\n  0% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n\n.msg-div,\n.long-msg-div,\n.long-msg-div input:not([type='file']) {\n  display: inline-block;\n  margin: 4px;\n  padding: 4px;\n  color: var(--light-grey);\n  background: var(--dark-grey);\n  box-shadow: 2px 2px 3px 0px var(--darker-grey);\n  border-radius: 2px;\n  border-color: var(--med-grey);\n  border-width: 1px 0px 0px 1px;\n  font-size: 10pt;\n  font-weight: 500;\n}\n\n.long-msg-div {\n  display: block;\n}\n\n.flash-div {\n  animation-name: flash;\n  animation-duration: 5s;\n  animation-fill-mode: forwards;\n}\n\n.marker {\n  width: 1px;\n  height: 14px;\n}\n\n.start-marker {\n  fill: lime;\n  pointer-events: none;\n}\n\n.end-marker {\n  fill: gold;\n  pointer-events: visibleFill;\n}\n\n.end-marker:hover {\n  fill: var(--bright-red);\n}\n\n.selected-marker-overlay {\n  fill: black;\n  width: 1px;\n  height: 8px;\n  pointer-events: none;\n}\n.selected-marker-overlay-hidden {\n  fill-opacity: 0.3;\n}\n\n#settings-editor-div {\n  display: flex;\n}\n\n.settings-editor-panel {\n  display: inline;\n  flex-grow: 1;\n  color: var(--med-grey);\n  font-size: 12pt;\n  margin: 3px;\n  padding: 2px 6px 0px 4px;\n  border: 2px solid var(--med-grey);\n  border-radius: 5px;\n  background: var(--dark-red);\n}\n\n.settings-editor-panel > legend {\n  display: block;\n  width: fit-content;\n  font-size: 12pt;\n  text-shadow:\n    -1px -1px 0 black,\n    1px -1px black,\n    -1px 1px 0 black,\n    1px 1px 0 black,\n    -1px 0px 0px black,\n    0px -1px 0px black,\n    1px 0px 0px black,\n    0px 1px 0px black;\n  padding: 0px 4px 0px 4px;\n  margin-left: 12px;\n}\n\n.settings-editor-input-div {\n  display: inline-block;\n  color: grey;\n  font-size: 11.5pt;\n  margin: 0px 0px 6px 2px;\n  padding: 4px 10px 4px 4px;\n  background: var(--dark-grey);\n  box-shadow: 2px 2px 3px 0px var(--darker-grey);\n  border-radius: 2px;\n  border-color: var(--med-grey);\n  border-style: solid;\n  border-width: 1px 0px 0px 1px;\n  vertical-align: top;\n}\n\n.settings-editor-input-div span {\n  display: block;\n  color: var(--light-grey);\n  margin-bottom: 2px;\n}\n\n.settings-editor-input-div select option {\n  color: black;\n}\n\n.settings-editor-input-div select option:first-child {\n  color: dimgrey;\n}\n\n.multi-input-div {\n  display: inline-flex;\n  width: fit-content;\n}\n\n.settings-editor-input-div > div {\n  display: inline-block;\n  margin-right: 6px;\n}\n.settings-editor-input-div > div:last-of-type {\n  margin-right: -4px;\n}\n\n.settings-editor-input-div select,\n.settings-editor-input-div input:not([type='radio']),\n#marker-pair-number-input {\n  display: block;\n  font-weight: bold;\n  background: var(--lighter-grey);\n  width: 100%;\n  border: none;\n  box-shadow: #151515 2px 2px 2px 0px;\n}\n\n.settings-editor-input-div input:not([type='radio']),\n#marker-pair-number-input {\n  border-radius: 5px;\n  padding-right: 4px;\n  padding-left: 2px;\n}\n\n.settings-info-display span,\n#global-settings-rotate label,\n#merge-list-div input,\n#global-settings-rotate input,\n#marker-pair-number-input {\n  display: inline;\n  width: auto;\n}\n\n#marker-pair-number-input {\n  vertical-align: top;\n  border: 1px solid black;\n}\n\n.settings-editor-input-div input:valid,\n#marker-pair-number-input:valid {\n  animation-name: valid-input;\n  animation-duration: 1s;\n  animation-fill-mode: forwards;\n}\n\n.settings-editor-input-div input:invalid,\n#marker-pair-number-input:invalid {\n  animation-name: invalid-input;\n  animation-duration: 1s;\n  animation-fill-mode: forwards;\n}\n\n.marker-pair-settings-editor-highlighted-div {\n  border: 2px solid var(--marker-pair-editor-accent) !important;\n}\n\n.global-settings-editor-highlighted-div {\n  border: 2px solid var(--global-editor-accent) !important;\n}\n\n.marker-pair-settings-editor-highlighted-label {\n  color: var(--marker-pair-editor-accent) !important;\n}\n\n.global-settings-editor-highlighted-label {\n  color: var(--global-editor-accent) !important;\n}\n\n.inherited-settings-highlighted-label {\n  color: var(--inherited-accent);\n}\n\n#markers-svg,\n#selected-marker-pair-overlay,\n#start-marker-numberings,\n#end-marker-numberings {\n  font-size: 6.5pt;\n  width: 100%;\n  height: 300%;\n  top: -5px;\n  position: absolute;\n  z-index: 99;\n  paint-order: stroke;\n  stroke: rgba(0, 0, 0, 0.25);\n  stroke-width: 2px;\n}\n\n#selected-marker-pair-overlay {\n  pointer-events: none;\n}\n\n#start-marker-numberings {\n  top: -19px;\n}\n\n#end-marker-numberings {\n  top: 5px;\n}\n\n.markerNumbering {\n  pointer-events: visibleFill;\n  user-select: none;\n}\n.markerNumbering:hover {\n  fill: var(--bright-red);\n  cursor: pointer;\n}\n\n.startMarkerNumbering {\n  fill: lime;\n}\n\n.endMarkerNumbering {\n  fill: gold;\n}\n\n#crop-div {\n  pointer-events: none;\n  z-index: 10;\n}\n\n#begin-crop-preview-div {\n  pointer-events: none;\n  z-index: 11;\n}\n\n#crop-svg,\n#begin-crop-preview-svg {\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  position: absolute;\n}\n\n#cropChartCanvas {\n  background-color: rgb(24, 24, 24);\n}\n\n#shortcutsTableToggleButton {\n  cursor: help;\n  position: relative;\n  float: left;\n}\n\n.ytc-modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.8);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 9999;\n}\n\n.ytc-modal.hidden {\n  display: none;\n}\n\n.ytc-modal-content {\n  position: relative;\n  width: 90vw;\n  height: 90vh;\n  background: black;\n  border-radius: 0px;\n  overflow: hidden;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.ytc-canvas-wrapper {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n#ytc-zoom-canvas {\n  width: 100%;\n  height: 100%;\n  object-fit: contain; /* Maintain aspect ratio */\n  background: black; /* Letterboxing */\n}\n";
const shortcutsTableHTML = '<h2>Basic Features</h2>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Marker Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="essential-row">\n      <td>Toggle shortcuts on/off</td>\n      <td><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Add marker at current time</td>\n      <td><kbd>A</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Toggle targeted end marker\'s editor</td>\n      <td><kbd>Shift</kbd> + <kbd>Mouseover</kbd></td>\n    </tr>\n    <tr>\n      <td>Jump to marker numbering and open marker pair\'s editor</td>\n      <td><kbd>Click</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle marker pair overrides editor</td>\n      <td><kbd>Shift</kbd> + <kbd>W</kbd></td>\n    </tr>\n    <tr>\n      <td>Duplicate selected or previously selected marker pair</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Undo/redo last marker</td>\n      <td><kbd>Z</kbd> / <kbd>Shift</kbd> + <kbd>Z</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Delete selected marker pair</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Move start/end marker to current time</td>\n      <td><kbd>Shift</kbd> + <kbd>Q</kbd>/<kbd>A</kbd></td>\n    </tr>\n    <tr>\n      <td>Drag start/end marker numbering to new time</td>\n      <td><kbd>Alt</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Move start/end marker a frame when on left/right half of window</td>\n      <td><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Mousewheel</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Undo/redo time, speed, and crop changes of selected pair</td>\n      <td><kbd>Alt</kbd> + <kbd>Z</kbd> / <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle marker pair selection</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Up</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle auto-hiding unselected marker pairs</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Down</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Jump to nearest next/previous marker</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Left</kbd>/<kbd>Right</kbd></td>\n    </tr>\n    <tr>\n      <td>Select next/previous marker pair</td>\n      <td><kbd>Alt</kbd> + <kbd>Left</kbd>/<kbd>Right</kbd></td>\n    </tr>\n    <tr>\n      <td>Select next/previous marker pair and jump to start marker</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Left</kbd>/<kbd>Right</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Global Settings Editor Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="essential-row">\n      <td>Toggle global settings editor</td>\n      <td><kbd>W</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle encoding settings editor</td>\n      <td><kbd>Shift</kbd> + <kbd>W</kbd></td>\n    </tr>\n    <tr>\n      <td>Update all markers to default new marker speed/crop</td>\n      <td><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Q</kbd>/<kbd>X</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Cropping Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="essential-row">\n      <td>Begin drawing crop</td>\n      <td><kbd>X</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Draw crop</td>\n      <td><kbd>Click</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Move or resize crop</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Click</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Cycle crop dim opacity up by 0.25</td>\n      <td><kbd>Ctrl</kbd> + <kbd>X</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle crop crosshair</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd></td>\n    </tr>\n    <tr>\n      <td>Crop-aspect-ratio-locked resize/draw of crop</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Center-out resize/draw of crop</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Horizontally-fixed (Y-only) drag of crop</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Vertically-fixed (X-only) drag of crop</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle crop adjustment with arrow keys</td>\n      <td><kbd>Alt</kbd> + <kbd>X</kbd></td>\n    </tr>\n    <tr>\n      <td>Adjust crop input string with arrow keys</td>\n      <td><pre>Place cursor on target value</pre></td>\n    </tr>\n    <tr>\n      <td>Change crop change amount from 10 to 1/50/100</td>\n      <td><kbd>Alt</kbd> / <kbd>Shift</kbd> / <kbd>Alt</kbd> + <kbd>Shift</kbd></td>\n    </tr>\n    <tr>\n      <td>Modify crop width/height instead of x/y offset</td>\n      <td><kbd>Ctrl</kbd> + <kbd>ArrowKey</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Preview Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="essential-row">\n      <td>Seek video frame by frame</td>\n      <td><kbd>&lt;</kbd> / <kbd>&gt;</kbd> or <kbd>Shift</kbd> + <kbd>Mousewheel</kbd></td>\n    </tr>\n    <tr>\n      <td>Cycle seek rate (1-3 frames)</td>\n      <td><kbd>Shift</kbd> + <kbd>Mousewheel-click</kbd></td>\n    </tr>\n    <tr>\n      <td>Scrub video time left or right</td>\n      <td><kbd>Alt</kbd> + <kbd>Click</kbd> + <kbd> Drag</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Toggle previewing speed</td>\n      <td><kbd>C</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Toggle auto marker pair looping</td>\n      <td><kbd>Shift</kbd> + <kbd>C</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Toggle previewing crop in modal window</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>X</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle auto crop chart section looping</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle previewing gamma</td>\n      <td><kbd>Alt</kbd> + <kbd>C</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle previewing fade loop</td>\n      <td><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Toggle all previews</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle force setting video speed</td>\n      <td><kbd>Q</kbd></td>\n    </tr>\n    <tr>\n      <td>Cycle force set video speed value down by 0.25</td>\n      <td><kbd>Alt</kbd> + <kbd>Q</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle previewing rotation 90&deg; clockwise/anti-clockwise</td>\n      <td><kbd>R</kbd> / <kbd>Alt</kbd> + <kbd>R</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle big video preview thumbnails</td>\n      <td><kbd>Shift</kbd> + <kbd>R</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Frame Capturer Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Capture frame</td>\n      <td><kbd>E</kbd></td>\n    </tr>\n    <tr>\n      <td>Zip and download captured frames</td>\n      <td><kbd>Alt</kbd> + <kbd>E</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Saving and Loading Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="essential-row">\n      <td>Save markers data as json</td>\n      <td><kbd>S</kbd></td>\n    </tr>\n    <tr>\n      <td>Copy markers data to clipboard</td>\n      <td><kbd>Alt</kbd> + <kbd>S</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle markers data commands (loading, restoring, and clearing).</td>\n      <td><kbd>G</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Miscellaneous Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Flatten VR Video</td>\n      <td><kbd>Shift</kbd> + <kbd>F</kbd></td>\n    </tr>\n  </tbody>\n  <tbody>\n    <tr>\n      <td>Open YouTube subtitles editor (supports creating, downloading and uploading).</td>\n      <td><kbd>Alt</kbd> + <kbd>F</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<h2>Advanced Features</h2>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">General Chart Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="essential-row">\n      <td>Add point</td>\n      <td><kbd>Shift</kbd> + <kbd>Click</kbd></td>\n    </tr>\n    <tr>\n      <td>Add point at current time.</td>\n      <td><kbd>Alt</kbd> + <kbd>A</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Delete point</td>\n      <td><kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Click</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Move point or pan chart</td>\n      <td><kbd>Click</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Zoom in and out</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Mousewheel</kbd></td>\n    </tr>\n    <tr>\n      <td>Reset zoom</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Click</kbd></td>\n    </tr>\n    <tr>\n      <td>Seek to time on time-axis</td>\n      <td><kbd>Right-Click</kbd></td>\n    </tr>\n    <tr>\n      <td>Set chart loop start/end marker</td>\n      <td><kbd>Shift</kbd>/<kbd>Alt</kbd> + <kbd>Right-click</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle chart marker looping</td>\n      <td><kbd>Shift</kbd> + <kbd>D</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Speed Chart Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="essential-row">\n      <td>Toggle speed chart</td>\n      <td><kbd>D</kbd></td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">Crop Chart Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr class="essential-row">\n      <td>Toggle crop chart</td>\n      <td><kbd>Alt</kbd> + <kbd>D</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Toggle auto crop chart section looping</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>C</kbd></td>\n    </tr>\n    <tr class="essential-row">\n      <td>Select point as start/end of crop section</td>\n      <td><kbd>Ctrl/Alt</kbd> + <kbd>Mouseover</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle start/end mode. If in end mode also select prev point</td>\n      <td><kbd>Alt</kbd> + <kbd>Mousewheel Down</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle start/end mode. If in start mode also select next point</td>\n      <td><kbd>Alt</kbd> + <kbd>Mousewheel Up</kbd></td>\n    </tr>\n    <tr>\n      <td>Set current point\'s crop to next/prev point\'s crop</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>Mousewheel Up/Down</kbd></td>\n    </tr>\n    <tr>\n      <td>Toggle crop point ease in between auto and instant</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Click</kbd></td>\n    </tr>\n    <tr>\n      <td>\n        Set target crop component of all points following/preceding selected point. Select crop\n        component with cursor in crop input field.\n      </td>\n      <td>\n        <pre><kbd>a</kbd> / <kbd>Shift</kbd> + <kbd>A</kbd></pre>\n      </td>\n    </tr>\n  </tbody>\n</table>\n\n<table>\n  <thead>\n    <tr>\n      <th colspan="2">ZoomPan Mode Crop Chart Shortcuts</th>\n    </tr>\n    <tr>\n      <th>Action</th>\n      <th>Shortcut</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Crop-aspect-ratio-locked resize of crop</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Freely resize crop</td>\n      <td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Crop-aspect-ratio-locked draw crop</td>\n      <td><kbd>X</kbd>, <kbd>Click</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n    <tr>\n      <td>Freely draw crop</td>\n      <td><kbd>X</kbd>, <kbd>Alt</kbd> + <kbd>Click</kbd> + <kbd>Drag</kbd></td>\n    </tr>\n  </tbody>\n</table>\n';
const shortcutsTableStyle = ":root {\n  --lighter-grey: rgb(235, 235, 235);\n  --light-grey: rgb(210, 210, 210);\n  --med-grey: rgb(110, 110, 110);\n  --dark-grey: rgb(40, 40, 40);\n  --darker-grey: rgb(10, 10, 10);\n  --bright-red: rgb(237, 28, 63);\n  --marker-pair-editor-accent: rgb(245, 118, 0);\n  --essential-red: rgb(200, 40, 40);\n}\n\n#shortcutsTableContainer {\n  text-align: center;\n  position: relative;\n}\n\n#shortcutsTableContainer table {\n  text-align: left;\n  line-height: 32px;\n  border-collapse: separate;\n  border-spacing: 0;\n  border: 2px solid var(--bright-red);\n  width: 640px;\n  margin: 8px auto;\n  border-radius: 0.25rem;\n  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n  font-size: 13px;\n  font-weight: 500;\n  background-color: #222;\n  color: #ddd;\n}\n\n#shortcutsTableContainer thead tr:first-child {\n  background: var(--bright-red);\n  color: var(--lighter-grey);\n  border: none;\n}\n\n#shortcutsTableContainer thead tr:nth-child(2) {\n  text-align: center;\n}\n\n#shortcutsTableContainer tr:nth-child(even) {\n  background-color: #333;\n}\n\n#shortcutsTableContainer th:first-child,\ntd:first-child {\n  padding: 0 5px;\n}\n\n#shortcutsTableContainer th {\n  font-size: 14px;\n  font-weight: 600;\n}\n\n#shortcutsTableContainer thead tr:last-child th {\n  border-bottom: 3px solid #777;\n}\n\n#shortcutsTableContainer tbody tr:hover {\n  background-color: #444;\n}\n\n#shortcutsTableContainer tbody tr:first-child {\n  border-bottom: 1px solid #666;\n  border-right: 2px solid #666;\n}\n\n#shortcutsTableContainer td {\n  border-bottom: 1px solid #666;\n}\n\n#shortcutsTableContainer td:first-child {\n  border-right: 2px solid #666;\n}\n\n#shortcutsTableContainer td:last-child {\n  text-align: right;\n  padding-right: 5px;\n}\n\n#shortcutsTableContainer kbd {\n  border: 1px solid #999;\n  border-radius: 2px;\n  font-weight: bold;\n  padding: 2px 4px;\n  margin: 1px;\n  background-color: #e0e0e0;\n  color: #333;\n}\n\n#shortcutsTableContainer tr.essential-row {\n  color: var(--bright-red);\n}\n\n#shortcutsTableContainer h2 {\n  color: var(--lighter-grey);\n  margin: 10px;\n}\n";
const shortcutsTableToggleButtonHTML = '<button\n  id="shortcutsTableToggleButton"\n  class="ytp-button"\n  title="Toggle yt_clipper Shortcuts Table"\n>\n  <svg version="1.1" viewbox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">\n    <path\n      d="M19.66 21.528l5.425 3.972c0.447 0.335 1.26 0.599 1.818 0.599h3.149l-13.319-9.773c0.073-0.27 0.116-0.579 0.116-0.899 0-1.964-1.592-3.556-3.556-3.556s-3.556 1.592-3.556 3.556c0 1.964 1.592 3.556 3.556 3.556 0.759 0 1.462-0.237 2.039-0.643l-0.011 0.008 2.265 1.656-2.265 1.656c-0.568-0.403-1.276-0.644-2.040-0.644-1.964 0-3.556 1.592-3.556 3.556s1.592 3.556 3.556 3.556c1.964 0 3.556-1.592 3.556-3.556 0-0.316-0.041-0.623-0.119-0.915l0.005 0.025 2.946-2.154zM13.29 16.957c-0.841 0-1.524-0.682-1.524-1.524s0.682-1.524 1.524-1.524v0c0.841 0 1.524 0.682 1.524 1.524s-0.682 1.524-1.524 1.524v0zM13.29 26.1c-0.841 0-1.524-0.682-1.524-1.524s0.682-1.524 1.524-1.524v0c0.841 0 1.524 0.682 1.524 1.524s-0.682 1.524-1.524 1.524v0zM25.075 14.508c0.515-0.348 1.143-0.567 1.82-0.599l0.008-0h3.149l-7.619 5.587-2.083-1.524 4.724-3.464z"\n      fill="#fff"\n    ></path>\n  </svg>\n</button>\n';
let player;
let video;
let markerPairs = [];
let prevSelectedMarkerPairIndex = null;
let isCropChartLoopingOn = false;
let shouldTriggerCropChartLoop = false;
function triggerCropChartLoop() {
    shouldTriggerCropChartLoop = true;
}
const platform = (0, _platforms.getPlatform)();
loadytClipper();
async function loadytClipper() {
    console.log("Loading yt_clipper markup script...");
    function hotkeys(e) {
        if (isHotkeysEnabled) switch(e.code){
            case "KeyA":
                if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    addMarker();
                } else if (!e.ctrlKey && e.shiftKey && !e.altKey && markerHotkeysEnabled) {
                    (0, _util.blockEvent)(e);
                    moveMarker(enableMarkerHotkeys.endMarker);
                } else if (!e.ctrlKey && !e.shiftKey && e.altKey && markerHotkeysEnabled) {
                    (0, _util.blockEvent)(e);
                    addChartPoint();
                } else if (e.ctrlKey && e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    duplicateSelectedMarkerPair();
                }
                break;
            case "KeyS":
                if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    saveMarkersAndSettings();
                } else if (!e.ctrlKey && e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    (0, _util.copyToClipboard)(getClipperInputJSON());
                }
                break;
            case "KeyQ":
                if (!e.ctrlKey && !e.altKey && e.shiftKey && markerHotkeysEnabled) {
                    (0, _util.blockEvent)(e);
                    moveMarker(enableMarkerHotkeys.startMarker);
                } else if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    toggleForceSetSpeed();
                } else if (!e.ctrlKey && e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    cycleForceSetSpeedValueDown();
                } else if (!e.ctrlKey && e.altKey && e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    updateAllMarkerPairSpeeds(settings.newMarkerSpeed);
                }
                break;
            case "KeyE":
                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    captureFrame();
                } else if (!e.ctrlKey && e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    saveCapturedFrames();
                }
                break;
            case "KeyW":
                if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleGlobalSettingsEditor();
                } else if (!e.ctrlKey && e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleMarkerPairOverridesEditor();
                }
                break;
            case "KeyC":
                if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleMarkerPairSpeedPreview();
                } else if (!e.ctrlKey && e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleMarkerPairLoop();
                } else if (!e.ctrlKey && !e.shiftKey && e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleGammaPreview();
                } else if (!e.ctrlKey && e.shiftKey && e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleFadeLoopPreview();
                } else if (e.ctrlKey && e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleCropChartLooping();
                } else if (e.ctrlKey && e.shiftKey && e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleAllPreviews();
                }
                break;
            case "KeyG":
                if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleMarkersDataCommands();
                }
                break;
            case "KeyD":
                // alt+shift+D does not work in chrome 75.0.3770.100
                if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleChart(speedChartInput);
                } else if (!e.ctrlKey && e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleChartLoop();
                } else if (!e.ctrlKey && !e.shiftKey && e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleChart(cropChartInput);
                }
                break;
            case "KeyZ":
                if (!e.ctrlKey && !e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    undoMarker();
                } else if (!e.ctrlKey && e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    redoMarker();
                } else if (!e.ctrlKey && !e.shiftKey && e.altKey) {
                    (0, _util.blockEvent)(e);
                    undoRedoMarkerPairChange("undo");
                } else if (!e.ctrlKey && e.shiftKey && e.altKey) {
                    (0, _util.blockEvent)(e);
                    undoRedoMarkerPairChange("redo");
                } else if (e.ctrlKey && e.shiftKey && e.altKey && markerHotkeysEnabled) {
                    (0, _util.blockEvent)(e);
                    deleteMarkerPair();
                }
                break;
            case "KeyX":
                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    drawCrop();
                } else if (!e.ctrlKey && e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    toggleArrowKeyCropAdjustment();
                } else if (!e.ctrlKey && e.altKey && e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    updateAllMarkerPairCrops(settings.newMarkerCrop);
                } else if (e.ctrlKey && !e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    cycleCropDimOpacity();
                } else if (e.ctrlKey && !e.altKey && e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    toggleCropCrossHair();
                } else if (e.ctrlKey && e.altKey && !e.shiftKey) {
                    (0, _util.blockEvent)(e);
                    toggleCropPreview();
                }
                break;
            case "KeyR":
                if (!e.ctrlKey && !e.shiftKey && !e.altKey && isTheatreMode()) {
                    (0, _util.blockEvent)(e);
                    rotateVideo("clock");
                } else if (!e.ctrlKey && !e.shiftKey && e.altKey && isTheatreMode()) {
                    (0, _util.blockEvent)(e);
                    rotateVideo("cclock");
                } else if (!e.ctrlKey && e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    toggleBigVideoPreviews();
                } else if (!e.ctrlKey && !e.shiftKey && !isTheatreMode()) {
                    (0, _util.blockEvent)(e);
                    (0, _util.flashMessage)("Please switch to theater mode to rotate video.", "red");
                }
                break;
            case "KeyF":
                if (!e.ctrlKey && e.shiftKey && !e.altKey) {
                    (0, _util.blockEvent)(e);
                    (0, _misc.flattenVRVideo)(hooks.videoContainer, video);
                } else if (!e.ctrlKey && !e.shiftKey && e.altKey) {
                    (0, _util.blockEvent)(e);
                    (0, _misc.openSubsEditor)(settings.videoID);
                }
                break;
            case "ArrowLeft":
            case "ArrowRight":
                jumpToNearestMarkerOrPair(e, e.code);
                break;
            case "ArrowUp":
                if (e.ctrlKey && !arrowKeyCropAdjustmentEnabled) {
                    (0, _util.blockEvent)(e);
                    togglePrevSelectedMarkerPair();
                }
                break;
            case "ArrowDown":
                toggleAutoHideUnselectedMarkerPairs(e);
                break;
        }
        if (!e.ctrlKey && e.shiftKey && e.altKey && e.code === "KeyA") {
            isHotkeysEnabled = !isHotkeysEnabled;
            initOnce();
            if (isHotkeysEnabled) {
                showShortcutsTableToggleButton();
                (0, _common.enableCommonBlockers)();
                if (platform === (0, _platforms.VideoPlatforms).youtube) (0, _youtube.enableYTBlockers)();
                (0, _util.flashMessage)("Enabled Hotkeys", "green");
            } else {
                hideShortcutsTableToggleButton();
                (0, _common.disableCommonBlockers)();
                if (platform === (0, _platforms.VideoPlatforms).youtube) (0, _youtube.disableYTBlockers)();
                (0, _util.flashMessage)("Disabled Hotkeys", "red");
            }
        }
    }
    let start = true;
    let markerHotkeysEnabled = false;
    let isSettingsEditorOpen = false;
    let wasGlobalSettingsEditorOpen = false;
    let isCropOverlayVisible = false;
    let isCurrentChartVisible = false;
    let markerPairsHistory = [];
    let startTime = 0.0;
    let isHotkeysEnabled = false;
    let prevSelectedEndMarker = null;
    const initOnce = (0, _util.once)(init, this);
    function init() {
        //immer
        (0, _immer.enableAllPlugins)();
        //yt-clipper
        (0, _util.injectCSS)(ytClipperCSS, "yt-clipper-css");
        (0, _util.injectCSS)((0, _platforms.videoPlatformDataRecords)[platform].css, "platform-css");
        initHooks();
        initVideoInfo();
        initObservers();
        initMarkersContainer();
        initChartHooks();
        addForeignEventListeners();
        injectToggleShortcutsTableButton();
        addCropMouseManipulationListener();
        addScrubVideoHandler();
        loopMarkerPair();
    }
    let autoSaveIntervalId;
    function initAutoSave() {
        if (autoSaveIntervalId == null) {
            (0, _util.flashMessage)("Initializing auto saving of markers data to local storage...", "olive");
            autoSaveIntervalId = setInterval(()=>{
                saveClipperInputDataToLocalStorage();
            }, 5000);
        }
    }
    const localStorageKeyPrefix = "yt_clipper";
    function saveClipperInputDataToLocalStorage() {
        const date = Date.now(); /*  */ 
        const key = `${localStorageKeyPrefix}_${settings.videoTag}`;
        const data = getClipperInputData(date);
        try {
            localStorage.setItem(key, JSON.stringify(data, null, 2));
        } catch (e) {
            if (e instanceof DOMException && e.code == DOMException.QUOTA_EXCEEDED_ERR) {
                const markersDataFiles = getMarkersDataEntriesFromLocalStorage();
                (0, _util.flashMessage)(`Failed to save markers data.
          Browser local storage quota exceeded with ${markersDataFiles?.length} markers data files.
          Try clearing auto-saved markers data after backing it up (see marker data commands menu (shortcut: G).`, "red", 4500);
            } else (0, _util.flashMessage)(`Failed to save markers data. Error: ${e}`, "red");
        }
    }
    function loadClipperInputDataFromLocalStorage() {
        if (markerPairs.length === 0) {
            const key = `${localStorageKeyPrefix}_${settings.videoTag}`;
            const clipperInputJSON = localStorage.getItem(key);
            if (clipperInputJSON != null) {
                const clipperInputData = JSON.parse(clipperInputJSON);
                const date = new Date(clipperInputData.date);
                const confirmLoad = confirm((0, _commonTags.stripIndent)`
        The last auto-saved markers data for video ${settings.videoTag} will be restored.
        This data was saved on ${date}.
        It contains ${clipperInputData.markerPairs.length} marker pair(s).\n
        Proceed to restore markers data?
      `);
                if (confirmLoad) {
                    loadClipperInputJSON(clipperInputJSON);
                    deleteMarkersDataCommands();
                }
            } else (0, _util.flashMessage)(`No markers data found in local storage for video ${settings.videoTag}.`, "red");
        } else (0, _util.flashMessage)("Please delete all marker pairs before restoring markers data.", "red");
    }
    function getMarkersDataEntriesFromLocalStorage() {
        const entries = Object.entries(localStorage).map((x)=>x[0]).filter((x)=>x.startsWith(localStorageKeyPrefix));
        return entries;
    }
    function clearYTClipperLocalStorage() {
        const entries = getMarkersDataEntriesFromLocalStorage();
        const nEntries = entries.length;
        const clearAll = confirm((0, _commonTags.stripIndent)`
      The following markers data files will be cleared from local storage:
      ${entries.map((entry)=>entry.replace(localStorageKeyPrefix + "_", "")).join(", ")}\n
      Proceed to clear all (${nEntries}) markers data files from local storage?
    `);
        if (clearAll) {
            entries.map((x)=>localStorage.removeItem(x));
            (0, _util.flashMessage)(`Cleared ${nEntries} markers data files.`, "olive");
        }
    }
    function downloadAutoSavedMarkersData() {
        const entries = Object.entries(localStorage).map((x)=>x[0]).filter((x)=>x.startsWith(localStorageKeyPrefix));
        const nEntries = entries.length;
        if (nEntries === 0) {
            (0, _util.flashMessage)("No markers data in local storage to zip.", "olive");
            return;
        }
        (0, _util.flashMessage)(`Zipping ${nEntries} markers data files.`, "olive");
        const now = new Date();
        const zip = new (0, _jszipDefault.default)();
        const markersZipFolderName = "yt_clipper_markers_data_" + now.toISOString();
        const markersZip = zip.folder(markersZipFolderName);
        entries.forEach((entry)=>{
            markersZip.file(entry.replace(localStorageKeyPrefix, "") + ".json", localStorage.getItem(entry), {
                binary: false
            });
        });
        const progressDiv = injectProgressBar("green", "Markers Data");
        const progressSpan = progressDiv.firstElementChild;
        zip.generateAsync({
            type: "blob"
        }, (metadata)=>{
            const percent = metadata.percent.toFixed(2) + "%";
            progressSpan.textContent = `Markers Data Zipping Progress: ${percent}`;
        }).then((blob)=>{
            (0, _fileSaver.saveAs)(blob, markersZipFolderName + ".zip");
            progressDiv.dispatchEvent(new Event("done"));
        });
    }
    function addEventListeners() {
        document.addEventListener("keydown", hotkeys, true);
        document.addEventListener("keydown", addCropHoverListener, true);
        document.addEventListener("keyup", removeCropHoverListener, true);
        document.body.addEventListener("wheel", mouseWheelFrameSkipHandler);
        document.body.addEventListener("mousedown", changeMouseWheelFrameSkipRateHandler);
        document.body.addEventListener("wheel", moveMarkerByFrameHandler);
        document.body.addEventListener("wheel", selectCropPoint, {
            passive: false
        });
        document.body.addEventListener("wheel", inheritCropPointCrop, {
            passive: false
        });
    }
    const selectors = (0, _platforms.videoPlatformDataRecords)[platform].selectors;
    player = await (0, _util.retryUntilTruthyResult)(()=>document.querySelector(selectors.player));
    if (platform === (0, _platforms.VideoPlatforms).yt_clipper) {
        video = await (0, _util.retryUntilTruthyResult)(()=>document.querySelector(selectors.video));
        player = await (0, _util.retryUntilTruthyResult)(()=>document.querySelector(selectors.player));
    } else video = await (0, _util.retryUntilTruthyResult)(()=>player.querySelector(selectors.video));
    await (0, _util.retryUntilTruthyResult)(()=>video.readyState != 0);
    await (0, _util.retryUntilTruthyResult)(()=>video.videoWidth * video.videoHeight * (0, _util.getVideoDuration)(platform, video));
    if (platform === "vlive") {
        await (0, _util.retryUntilTruthyResult)(()=>!video.src.startsWith("data:video"));
        await (0, _util.retryUntilTruthyResult)(()=>video.videoWidth * video.videoHeight * (0, _util.getVideoDuration)(platform, video));
    }
    video.classList.add("yt-clipper-video");
    let settingsEditorHook;
    let hooks = {};
    function initHooks() {
        hooks = (0, _platforms.getVideoPlatformHooks)(selectors);
        (0, _util.setFlashMessageHook)(hooks.flashMessage);
        updateSettingsEditorHook();
        hooks.progressBar.removeAttribute("draggable");
    }
    function isTheatreMode() {
        if (platform === (0, _platforms.VideoPlatforms).youtube) return hooks.theaterModeIndicator.theater;
        else if (platform === (0, _platforms.VideoPlatforms).yt_clipper) return true;
    }
    const videoInfo = {};
    function initVideoInfo() {
        videoInfo.aspectRatio = video.videoWidth / video.videoHeight;
        videoInfo.isVerticalVideo = videoInfo.aspectRatio <= 1;
        const url = window.location.origin + window.location.pathname;
        videoInfo.videoUrl = url;
        videoInfo.fps = getFPS();
        video.seekTo = (time)=>video.currentTime = time;
        video.getCurrentTime = ()=>{
            return video.currentTime;
        };
        if (platform === (0, _platforms.VideoPlatforms).youtube) {
            const playerData = player.getVideoData();
            videoInfo.id = playerData.video_id;
            videoInfo.videoUrl += "?v=" + videoInfo.id;
            videoInfo.title = playerData.title;
            video.seekTo = (time)=>player.seekTo(time);
        } else if (platform === (0, _platforms.VideoPlatforms).vlive) {
            const location1 = window.location;
            const preloadedState = unsafeWindow.__PRELOADED_STATE__;
            const videoParams = preloadedState?.postDetail?.post?.officialVideo;
            videoInfo.id = videoParams?.videoSeq;
            videoInfo.title = videoParams?.title;
            if (location1.pathname.includes("video")) {
                if (videoInfo.id == null) videoInfo.id = location1.pathname.split("/")[2];
                if (videoInfo.title == null) videoInfo.title = document.querySelector('[class*="video_title"]')?.textContent;
            }
        } else if (platform === (0, _platforms.VideoPlatforms).naver_tv) {
            videoInfo.id = location.pathname.split("/")[2];
            videoInfo.title = document.querySelector("h2[class*=ArticleSection_article_title]")?.textContent;
        } else if (platform === (0, _platforms.VideoPlatforms).weverse) {
            videoInfo.title = document.querySelector("h2[class*=TitleView_title]")?.textContent;
            if (location.pathname.includes("media") || location.pathname.includes("live")) {
                if (videoInfo.id == null) videoInfo.id = location.pathname.split("/")[3];
            }
        } else if (platform === (0, _platforms.VideoPlatforms).yt_clipper) {
            videoInfo.id = "unknown";
            videoInfo.title = document.querySelector("#ytc-video-title").textContent;
        } else if (platform === (0, _platforms.VideoPlatforms).afreecatv) {
            videoInfo.id = location.pathname.split("/")[2];
            videoInfo.title = document.querySelector("div[class~=broadcast_title]")?.textContent;
            video.getCurrentTime = ()=>{
                return unsafeWindow.vodCore.playerController._playingTime;
            };
            video.seekTo = (time)=>{
                unsafeWindow.vodCore.seek(time);
            };
        }
        if (videoInfo.id == null) {
            (0, _util.flashMessage)("Could not get video ID.", "red");
            throw new Error("Could not get video ID.");
        }
    }
    function initObservers() {
        new ResizeObserver(resizeCropOverlay).observe(hooks.videoContainer);
        if (platform === (0, _platforms.VideoPlatforms).afreecatv) (0, _util.observeVideoElementChange)(hooks.videoContainer, (addedNodes)=>{
            video = addedNodes[0];
            video.classList.add("yt-clipper-video");
            initVideoInfo();
        });
    }
    function updateSettingsEditorHook() {
        if (isTheatreMode()) settingsEditorHook = hooks.settingsEditorTheater;
        else settingsEditorHook = hooks.settingsEditor;
    }
    addEventListeners();
    function addCropHoverListener(e) {
        const isCropBlockingChartVisible = isCurrentChartVisible && currentChartInput && currentChartInput.type !== "crop";
        if ((e.key === "Control" || e.key === "Meta") && isHotkeysEnabled && !e.repeat && isCropOverlayVisible && !isDrawingCrop && !isCropBlockingChartVisible) document.addEventListener("pointermove", cropHoverHandler, true);
    }
    function removeCropHoverListener(e) {
        if (e.key === "Control" || e.key === "Meta") {
            document.removeEventListener("pointermove", cropHoverHandler, true);
            showPlayerControls();
            hooks.cropMouseManipulation.style.removeProperty("cursor");
        }
    }
    function cropHoverHandler(e) {
        if (isSettingsEditorOpen && isCropOverlayVisible && !isDrawingCrop) updateCropHoverCursor(e);
    }
    function updateCropHoverCursor(e) {
        const cursor = getMouseCropHoverRegion(e);
        if (cursor) {
            hidePlayerControls();
            hooks.cropMouseManipulation.style.cursor = cursor;
        } else {
            showPlayerControls();
            hooks.cropMouseManipulation.style.removeProperty("cursor");
        }
    }
    function togglePrevSelectedMarkerPair() {
        if (enableMarkerHotkeys.endMarker) toggleMarkerPairEditor(enableMarkerHotkeys.endMarker);
        else if (prevSelectedEndMarker) toggleMarkerPairEditor(prevSelectedEndMarker);
        else {
            const firstEndMarker = markersSvg.firstElementChild ? markersSvg.firstElementChild.nextElementSibling : null;
            if (firstEndMarker) toggleMarkerPairEditor(firstEndMarker);
        }
    }
    let mouseWheelFrameSkipRate = 1;
    function mouseWheelFrameSkipHandler(event) {
        if (isHotkeysEnabled && !event.ctrlKey && !event.altKey && event.shiftKey && Math.abs(event.deltaY) > 0) {
            let fps = getFPS();
            if (event.deltaY < 0) (0, _util.seekBySafe)(video, mouseWheelFrameSkipRate / fps);
            else if (event.deltaY > 0) (0, _util.seekBySafe)(video, -mouseWheelFrameSkipRate / fps);
        }
    }
    function changeMouseWheelFrameSkipRateHandler(event) {
        if (isHotkeysEnabled && !event.ctrlKey && !event.altKey && event.shiftKey && event.button == 1) {
            event.preventDefault();
            mouseWheelFrameSkipRate += 1;
            if (mouseWheelFrameSkipRate > 4) mouseWheelFrameSkipRate = 1;
            (0, _util.flashMessage)(`Mouse wheel frame skip rate set to ${mouseWheelFrameSkipRate}`, "green");
        }
    }
    function moveMarkerByFrameHandler(event) {
        if (isHotkeysEnabled && !event.ctrlKey && event.altKey && event.shiftKey && Math.abs(event.deltaY) > 0 && isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && prevSelectedEndMarker) {
            const fps = getFPS();
            let targetMarker = prevSelectedEndMarker;
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            let targetMarkerTime = markerPair.end;
            if (event.pageX < window.innerWidth / 2) {
                targetMarker = prevSelectedEndMarker.previousElementSibling;
                targetMarkerTime = markerPair.start;
            }
            let newMarkerTime;
            if (event.deltaY > 0) {
                newMarkerTime = targetMarkerTime - 1 / fps;
                moveMarker(targetMarker, Math.max(0, newMarkerTime));
            } else if (event.deltaY < 0) {
                newMarkerTime = targetMarkerTime + 1 / fps;
                moveMarker(targetMarker, Math.min((0, _util.getVideoDuration)(platform, video), newMarkerTime));
            }
            video.pause();
            (0, _util.seekToSafe)(video, newMarkerTime);
        }
    }
    function selectCropPoint(e) {
        if (isHotkeysEnabled && !e.ctrlKey && e.altKey && !e.shiftKey) (0, _util.blockEvent)(e);
        else return;
        const cropChart = cropChartInput.chart;
        const cropChartData = cropChart.data.datasets[0].data;
        if (Math.abs(e.deltaY) > 0 && isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && prevSelectedEndMarker && cropChartInput.chart) {
            if (e.deltaY < 0) {
                if ((0, _cropChartSpec.currentCropChartMode) === (0, _cropChartSpec.cropChartMode).Start) (0, _cropChartSpec.setCurrentCropPoint)(cropChart, (0, _cropChartSpec.currentCropPointIndex) + 1, (0, _cropChartSpec.cropChartMode).End);
                else (0, _cropChartSpec.setCurrentCropPoint)(cropChart, (0, _cropChartSpec.currentCropPointIndex), (0, _cropChartSpec.cropChartMode).Start);
            } else if (e.deltaY > 0) {
                if ((0, _cropChartSpec.currentCropChartMode) === (0, _cropChartSpec.cropChartMode).End) (0, _cropChartSpec.setCurrentCropPoint)(cropChart, (0, _cropChartSpec.currentCropPointIndex) - 1, (0, _cropChartSpec.cropChartMode).Start);
                else (0, _cropChartSpec.setCurrentCropPoint)(cropChart, (0, _cropChartSpec.currentCropPointIndex), (0, _cropChartSpec.cropChartMode).End);
            }
        }
        if (!isCropChartLoopingOn) triggerCropChartLoop();
        const cropPoint = cropChartData[0, _cropChartSpec.currentCropPointIndex];
        setCropInputValue(cropPoint.crop);
        highlightSpeedAndCropInputs();
        if (isCurrentChartVisible && currentChartInput.type === "crop") currentChartInput?.chart?.update();
    }
    function setCropInputValue(cropString) {
        const rotatedCropString = getRotatedCropString(cropString);
        if (rotatedCropString !== cropString) cropInputLabel.textContent = `Crop (Rotated: ${rotatedCropString})`;
        cropInput.value = cropString;
    }
    function inheritCropPointCrop(e) {
        if (isHotkeysEnabled && e.ctrlKey && e.altKey && e.shiftKey && Math.abs(e.deltaY) > 0 && isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && prevSelectedEndMarker && cropChartInput.chart) {
            (0, _util.blockEvent)(e);
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const cropMap = markerPair.cropMap;
            const cropPoint = cropMap[0, _cropChartSpec.currentCropPointIndex];
            const oldCrop = cropPoint.crop;
            let newCrop;
            if (e.deltaY < 0) {
                const nextCropPoint = cropMap[Math.min((0, _cropChartSpec.currentCropPointIndex) + 1, cropMap.length - 1)];
                newCrop = nextCropPoint.crop;
            } else if (e.deltaY > 0) {
                const prevCropPoint = cropMap[Math.max((0, _cropChartSpec.currentCropPointIndex) - 1, 0)];
                newCrop = prevCropPoint.crop;
            }
            const draftCropMap = (0, _immer.createDraft)(cropMap);
            const initCropMap = (0, _immer.finishDraft)(draftCropMap);
            const shouldUpdateCropChart = oldCrop !== newCrop;
            updateCropString(newCrop, shouldUpdateCropChart, false, initCropMap);
        }
    }
    let settings;
    let markersSvg;
    let markersDiv;
    let markerNumberingsDiv;
    let selectedMarkerPairOverlay;
    let startMarkerNumberings;
    let endMarkerNumberings;
    function initMarkersContainer() {
        settings = {
            platform: platform,
            videoID: videoInfo.id,
            videoTitle: videoInfo.title,
            videoUrl: videoInfo.videoUrl,
            newMarkerSpeed: 1.0,
            newMarkerCrop: "0:0:iw:ih",
            videoTag: `[${platform}@${videoInfo.id}]`,
            titleSuffix: `[${platform}@${videoInfo.id}]`,
            isVerticalVideo: videoInfo.isVerticalVideo,
            markerPairMergeList: "",
            ...getDefaultCropRes()
        };
        markersDiv = document.createElement("div");
        markersDiv.setAttribute("id", "markers-div");
        (0, _util.safeSetInnerHtml)(markersDiv, `
        <svg id="markers-svg"></svg>
        <svg id="selected-marker-pair-overlay" style="display:none">
          <rect id="selected-start-marker-overlay"  class="selected-marker-overlay" width="1px" height="8px" y="3.5px" shape-rendering="crispEdges"></rect>
          <rect id="selected-end-marker-overlay"  class="selected-marker-overlay" width="1px" height="8px" y="3.5px" shape-rendering="crispEdges"></rect>
        </svg>
      `);
        markersSvg = markersDiv.children[0];
        selectedMarkerPairOverlay = markersDiv.children[1];
        markerNumberingsDiv = document.createElement("div");
        markerNumberingsDiv.setAttribute("id", "marker-numberings-div");
        (0, _util.safeSetInnerHtml)(markerNumberingsDiv, `
        <svg id="start-marker-numberings"></svg>
        <svg id="end-marker-numberings"></svg>
      `);
        startMarkerNumberings = markerNumberingsDiv.children[0];
        endMarkerNumberings = markerNumberingsDiv.children[1];
        if ([
            (0, _platforms.VideoPlatforms).weverse,
            (0, _platforms.VideoPlatforms).naver_tv,
            (0, _platforms.VideoPlatforms).yt_clipper
        ].includes(platform)) {
            hooks.markerNumberingsDiv.prepend(markerNumberingsDiv);
            hooks.markersDiv.prepend(markersDiv);
        } else {
            hooks.markersDiv.appendChild(markersDiv);
            hooks.markerNumberingsDiv.appendChild(markerNumberingsDiv);
        }
        videoInfo.fps = getFPS();
    }
    function getDefaultCropRes() {
        const cropResWidth = videoInfo.isVerticalVideo ? Math.round(1920 * videoInfo.aspectRatio) : 1920;
        const cropResHeight = videoInfo.isVerticalVideo ? 1920 : Math.round(1920 / videoInfo.aspectRatio);
        const cropRes = `${cropResWidth}x${cropResHeight}`;
        return {
            cropResWidth,
            cropResHeight,
            cropRes
        };
    }
    let rotatedVideoCSS;
    let fullscreenRotatedVideoCSS;
    let rotatedVideoPreviewsCSS;
    let rotatedVideoStyle;
    let adjustRotatedVideoPositionStyle;
    let fullscreenRotatedVideoStyle;
    let rotatedVideoPreviewsStyle;
    let rotation = 0;
    function rotateVideo(direction) {
        if (direction === "clock") rotation = rotation === 0 ? 90 : 0;
        else if (direction === "cclock") rotation = rotation === 0 ? -90 : 0;
        if (rotation === 90 || rotation === -90) {
            let scale = 1;
            scale = 1 / videoInfo.aspectRatio;
            rotatedVideoCSS = (0, _css.getRotatedVideoCSS)(rotation);
            rotatedVideoPreviewsCSS = `\
        .ytp-tooltip {
          transform: translateY(-15%) rotate(${rotation}deg) !important;
        }
        .ytp-tooltip-text-wrapper {
          transform: rotate(${-rotation}deg) !important;
          opacity: 0.6;
        }
      `;
            fullscreenRotatedVideoCSS = `
      .yt-clipper-video {
        transform: rotate(${rotation}deg) scale(${scale}) !important;
        margin-left: auto;
      }
      `;
            if (!document.fullscreen) {
                adjustRotatedVideoPositionStyle = (0, _util.injectCSS)((0, _css.adjustRotatedVideoPositionCSS), "adjust-rotated-video-position-css");
                rotatedVideoStyle = (0, _util.injectCSS)(rotatedVideoCSS, "yt-clipper-rotate-video-css");
                window.dispatchEvent(new Event("resize"));
            } else fullscreenRotatedVideoStyle = (0, _util.injectCSS)(fullscreenRotatedVideoCSS, "fullscreen-rotated-video-css");
            rotatedVideoPreviewsStyle = (0, _util.injectCSS)(rotatedVideoPreviewsCSS, "yt-clipper-rotated-video-previews-css");
            (0, _util.deleteElement)(bigVideoPreviewsStyle);
            bigVideoPreviewsStyle = null;
            window.dispatchEvent(new Event("resize"));
            document.addEventListener("fullscreenchange", fullscreenRotateVideoHandler);
        } else {
            (0, _util.deleteElement)(rotatedVideoStyle);
            (0, _util.deleteElement)(adjustRotatedVideoPositionStyle);
            (0, _util.deleteElement)(fullscreenRotatedVideoStyle);
            (0, _util.deleteElement)(rotatedVideoPreviewsStyle);
            (0, _util.deleteElement)(bigVideoPreviewsStyle);
            bigVideoPreviewsStyle = null;
            window.dispatchEvent(new Event("resize"));
            document.removeEventListener("fullscreenchange", fullscreenRotateVideoHandler);
        }
        resizeCropOverlay();
    }
    function fullscreenRotateVideoHandler() {
        if (document.fullscreen) {
            (0, _util.deleteElement)(rotatedVideoStyle);
            (0, _util.deleteElement)(adjustRotatedVideoPositionStyle);
            fullscreenRotatedVideoStyle = (0, _util.injectCSS)(fullscreenRotatedVideoCSS, "fullscreen-rotated-video-css");
        } else {
            (0, _util.deleteElement)(fullscreenRotatedVideoStyle);
            adjustRotatedVideoPositionStyle = (0, _util.injectCSS)((0, _css.adjustRotatedVideoPositionCSS), "adjust-rotated-video-position-css");
            rotatedVideoStyle = (0, _util.injectCSS)(rotatedVideoCSS, "yt-clipper-rotate-video-css");
            document.removeEventListener("fullscreenchange", fullscreenRotateVideoHandler);
            window.dispatchEvent(new Event("resize"));
        }
    }
    let bigVideoPreviewsStyle;
    function toggleBigVideoPreviews() {
        const bigVideoPreviewsCSS = `\
    .ytp-tooltip {
      left: 45% !important;
      transform: ${rotation ? `translateY(-285%) rotate(${rotation}deg)` : "translateY(-160%) "} scale(4) !important;
      padding: 1px !important;
      border-radius: 1px !important;
    }
    .ytp-tooltip-text-wrapper {
      transform: scale(0.5) ${rotation ? `rotate(${-rotation}deg)` : ""}!important;
      opacity: 0.6;
    }
    `;
        if (bigVideoPreviewsStyle) {
            (0, _util.deleteElement)(bigVideoPreviewsStyle);
            bigVideoPreviewsStyle = null;
        } else bigVideoPreviewsStyle = (0, _util.injectCSS)(bigVideoPreviewsCSS, "yt-clipper-big-video-previews-css");
    }
    function addForeignEventListeners() {
        const selectors = [
            'input[type="text"',
            "textarea"
        ];
        selectors.forEach((selector)=>{
            const inputs = document.querySelectorAll(selector);
            for (const input of Array.from(inputs))if (isHotkeysEnabled) {
                input.addEventListener("focus", ()=>isHotkeysEnabled = false, {
                    capture: true
                });
                input.addEventListener("blur", ()=>isHotkeysEnabled = true, {
                    capture: true
                });
            }
        });
    }
    function getShortestActiveMarkerPair(currentTime) {
        if (currentTime == null) currentTime = video.getCurrentTime();
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && prevSelectedMarkerPairIndex != null) {
            const selectedMarkerPair = markerPairs[prevSelectedMarkerPairIndex];
            if (currentTime >= Math.floor(selectedMarkerPair.start * 1e6) / 1e6 && currentTime <= Math.ceil(selectedMarkerPair.end * 1e6) / 1e6) return selectedMarkerPair;
        }
        const activeMarkerPairs = markerPairs.filter((markerPair)=>{
            if (currentTime >= Math.floor(markerPair.start * 1e6) / 1e6 && currentTime <= Math.ceil(markerPair.end * 1e6) / 1e6) return true;
            return false;
        });
        if (activeMarkerPairs.length === 0) return null;
        const shortestActiveMarkerPair = activeMarkerPairs.reduce((prev, cur)=>{
            if (cur.end - cur.start < prev.end - prev.start) return cur;
            return prev;
        });
        return shortestActiveMarkerPair;
    }
    let isSpeedPreviewOn = false;
    const toggleMarkerPairSpeedPreview = ()=>{
        if (isSpeedPreviewOn) {
            isSpeedPreviewOn = false;
            (0, _util.flashMessage)("Marker pair speed preview disabled", "red");
        } else {
            isSpeedPreviewOn = true;
            if (!isForceSetSpeedOn) requestAnimationFrame(updateSpeed);
            (0, _util.flashMessage)("Marker pair speed preview enabled", "green");
        }
    };
    let prevSpeed = 1;
    const defaultRoundSpeedMapEasing = 0.05;
    function updateSpeed() {
        if (!isSpeedPreviewOn && !isForceSetSpeedOn) {
            video.playbackRate = 1;
            prevSpeed = 1;
            updateSpeedInputLabel("Speed");
            return;
        }
        if (isForceSetSpeedOn) {
            if (prevSpeed !== forceSetSpeedValue) {
                video.playbackRate = forceSetSpeedValue;
                prevSpeed = forceSetSpeedValue;
                updateSpeedInputLabel(`Speed (${forceSetSpeedValue.toFixed(2)})`);
            }
            requestAnimationFrame(updateSpeed);
            return;
        }
        const shortestActiveMarkerPair = getShortestActiveMarkerPair();
        let newSpeed = prevSpeed;
        if (shortestActiveMarkerPair) {
            let markerPairSpeed;
            if (isVariableSpeed(shortestActiveMarkerPair.speedMap)) markerPairSpeed = getSpeedMapping(shortestActiveMarkerPair.speedMap, video.getCurrentTime());
            else markerPairSpeed = shortestActiveMarkerPair.speed;
            // console.log(markerPairSpeed);
            if (prevSpeed !== markerPairSpeed) newSpeed = markerPairSpeed;
        } else newSpeed = 1;
        if (prevSpeed !== newSpeed) {
            video.playbackRate = newSpeed;
            prevSpeed = newSpeed;
            updateSpeedInputLabel("Speed");
        }
        requestAnimationFrame(updateSpeed);
    }
    function updateSpeedInputLabel(text) {
        if (isSettingsEditorOpen && speedInputLabel != null) speedInputLabel.textContent = text;
    }
    const defaultSpeedRoundPrecision = 2;
    function getSpeedMapping(speedMap, time, roundMultiple = defaultRoundSpeedMapEasing, roundPrecision = defaultSpeedRoundPrecision) {
        let len = speedMap.length;
        if (len === 2 && speedMap[0].y === speedMap[1].y) return speedMap[0].y;
        len--;
        let left;
        let right;
        for(let i = 0; i < len; ++i)if (speedMap[i].x <= time && time <= speedMap[i + 1].x) {
            left = speedMap[i];
            right = speedMap[i + 1];
            break;
        }
        if (left && right) {
            if (left.y === right.y) return left.y;
            const speed = getInterpolatedSpeed(left, right, video.getCurrentTime(), roundMultiple, roundPrecision);
            return speed;
        } else return 1;
    }
    function getInterpolatedSpeed(left, right, time, roundMultiple = defaultRoundSpeedMapEasing, roundPrecision = defaultSpeedRoundPrecision) {
        const elapsed = time - left.x;
        const duration = right.x - left.x;
        let easedTimePercentage;
        if (easingMode === "cubicInOut") easedTimePercentage = (0, _d3Ease.easeCubicInOut)(elapsed / duration);
        else if (easingMode === "linear") easedTimePercentage = elapsed / duration;
        const change = right.y - left.y;
        const rawSpeed = left.y + change * easedTimePercentage || right.y;
        const roundedSpeed = roundMultiple > 0 ? (0, _util.roundValue)(rawSpeed, roundMultiple, roundPrecision) : rawSpeed;
        return roundedSpeed;
    }
    let isMarkerLoopPreviewOn = false;
    function toggleMarkerPairLoop() {
        if (isMarkerLoopPreviewOn) {
            isMarkerLoopPreviewOn = false;
            (0, _util.flashMessage)("Auto marker looping disabled", "red");
        } else {
            isMarkerLoopPreviewOn = true;
            (0, _util.flashMessage)("Auto marker looping enabled", "green");
        }
    }
    function loopMarkerPair() {
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen) {
            if (prevSelectedMarkerPairIndex != null) {
                const markerPair = markerPairs[prevSelectedMarkerPairIndex];
                const chartLoop = currentChartInput ? markerPair[currentChartInput.chartLoopKey] : null;
                if (chartLoop && chartLoop.enabled && chartLoop.start > markerPair.start && chartLoop.end < markerPair.end && chartLoop.start < chartLoop.end) {
                    const isTimeBetweenChartLoop = chartLoop.start <= video.getCurrentTime() && video.getCurrentTime() <= chartLoop.end;
                    if (!isTimeBetweenChartLoop) (0, _util.seekToSafe)(video, chartLoop.start);
                } else if (isCropChartLoopingOn && isCurrentChartVisible && currentChartInput.type === "crop" || cropChartInput.chart && (isMouseManipulatingCrop || isDrawingCrop)) {
                    shouldTriggerCropChartLoop = false;
                    cropChartSectionLoop();
                } else if (isMarkerLoopPreviewOn) {
                    const isTimeBetweenMarkerPair = markerPair.start <= video.getCurrentTime() && video.getCurrentTime() <= markerPair.end;
                    if (!isTimeBetweenMarkerPair) (0, _util.seekToSafe)(video, markerPair.start);
                }
            }
        }
        setTimeout(loopMarkerPair, 4);
    }
    let gammaFilterDiv;
    let isGammaPreviewOn = false;
    let gammaR;
    let gammaG;
    let gammaB;
    let gammaFilterSvg;
    function toggleGammaPreview() {
        if (!gammaFilterDiv) {
            gammaFilterDiv = document.createElement("div");
            gammaFilterDiv.setAttribute("id", "gamma-filter-div");
            (0, _util.safeSetInnerHtml)(gammaFilterDiv, `
      <svg id="gamma-filter-svg" xmlns="http://www.w3.org/2000/svg" width="0" height="0">
        <defs>
          <filter id="gamma-filter">
            <feComponentTransfer id="gamma-filter-comp-transfer">
              <feFuncR id="gamma-r" type="gamma" offset="0" amplitude="1"></feFuncR>
              <feFuncG id="gamma-g" type="gamma" offset="0" amplitude="1"></feFuncG>
              <feFuncB id="gamma-b" type="gamma" offset="0" amplitude="1"></feFuncB>
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
      `);
            document.body.appendChild(gammaFilterDiv);
            gammaFilterSvg = gammaFilterDiv.firstElementChild;
            gammaR = document.getElementById("gamma-r");
            gammaG = document.getElementById("gamma-g");
            gammaB = document.getElementById("gamma-b");
        }
        if (!isGammaPreviewOn) {
            video.style.filter = "url(#gamma-filter)";
            isGammaPreviewOn = true;
            requestAnimationFrame(gammaPreviewHandler);
            (0, _util.flashMessage)("Gamma preview enabled", "green");
        } else {
            video.style.filter = null;
            isGammaPreviewOn = false;
            (0, _util.flashMessage)("Gamma preview disabled", "red");
        }
    }
    let prevGammaVal = 1;
    function gammaPreviewHandler() {
        const shortestActiveMarkerPair = getShortestActiveMarkerPair();
        const markerPairGamma = shortestActiveMarkerPair && shortestActiveMarkerPair.overrides.gamma || settings.gamma || 1;
        if (markerPairGamma == 1) {
            if (video.style.filter) video.style.filter = null;
            prevGammaVal = 1;
        } else if (prevGammaVal !== markerPairGamma) {
            // console.log(`Updating gamma from ${prevGammaVal} to ${markerPairGamma}`);
            gammaR.exponent.baseVal = markerPairGamma;
            gammaG.exponent.baseVal = markerPairGamma;
            gammaB.exponent.baseVal = markerPairGamma;
            // force re-render of filter (possible bug with chrome and other browsers?)
            if (!video.style.filter) video.style.filter = "url(#gamma-filter)";
            gammaFilterSvg.setAttribute("width", "0");
            prevGammaVal = markerPairGamma;
        }
        if (isGammaPreviewOn) requestAnimationFrame(gammaPreviewHandler);
    }
    let isFadeLoopPreviewOn = false;
    function toggleFadeLoopPreview() {
        if (!isFadeLoopPreviewOn) {
            isFadeLoopPreviewOn = true;
            requestAnimationFrame(fadeLoopPreviewHandler);
            (0, _util.flashMessage)("Fade loop preview enabled", "green");
        } else {
            isFadeLoopPreviewOn = false;
            video.style.opacity = "1";
            (0, _util.flashMessage)("Fade loop preview disabled", "red");
        }
    }
    function fadeLoopPreviewHandler() {
        const currentTime = video.getCurrentTime();
        const shortestActiveMarkerPair = getShortestActiveMarkerPair();
        if (shortestActiveMarkerPair && (shortestActiveMarkerPair.overrides.loop === "fade" || shortestActiveMarkerPair.overrides.loop == null && settings.loop === "fade")) {
            const currentTimeP = getFadeBounds(shortestActiveMarkerPair, currentTime);
            if (currentTimeP == null) video.style.opacity = "1";
            else {
                let currentTimeEased = Math.max(0.1, (0, _d3Ease.easeCubicInOut)(currentTimeP));
                video.style.opacity = currentTimeEased.toString();
            // console.log(video.style.opacity);
            }
        } else video.style.opacity = "1";
        isFadeLoopPreviewOn ? requestAnimationFrame(fadeLoopPreviewHandler) : video.style.opacity = "1";
    }
    function getFadeBounds(markerPair, currentTime) {
        const start = Math.floor(markerPair.start * 1e6) / 1e6;
        const end = Math.ceil(markerPair.end * 1e6) / 1e6;
        const inputDuration = end - start;
        const outputDuration = markerPair.outputDuration;
        let fadeDuration = markerPair.overrides.fadeDuration || settings.fadeDuration || 0.5;
        fadeDuration = Math.min(fadeDuration, 0.4 * outputDuration);
        const fadeInStartP = 0;
        const fadeInEndP = fadeDuration / outputDuration;
        const fadeOutStartP = (outputDuration - fadeDuration) / outputDuration;
        const fadeOutEndP = outputDuration / outputDuration;
        let currentTimeP = (currentTime - start) / inputDuration;
        if (currentTimeP >= fadeInStartP && currentTimeP <= fadeInEndP) {
            currentTimeP = (currentTime - start) / fadeDuration;
            return currentTimeP;
        } else if (currentTimeP >= fadeOutStartP && currentTimeP <= fadeOutEndP) {
            currentTimeP = 1 - (currentTime - start - (inputDuration - fadeDuration)) / fadeDuration;
            return currentTimeP;
        } else return null;
    }
    let isAllPreviewsOn = false;
    function toggleAllPreviews() {
        isAllPreviewsOn = isSpeedPreviewOn && isMarkerLoopPreviewOn && isGammaPreviewOn && isFadeLoopPreviewOn && isCropChartLoopingOn;
        if (!isAllPreviewsOn) {
            !isSpeedPreviewOn && toggleMarkerPairSpeedPreview();
            !isMarkerLoopPreviewOn && toggleMarkerPairLoop();
            !isGammaPreviewOn && toggleGammaPreview();
            !isFadeLoopPreviewOn && toggleFadeLoopPreview();
            !isCropChartLoopingOn && toggleCropChartLooping();
            isAllPreviewsOn = true;
        } else {
            isSpeedPreviewOn && toggleMarkerPairSpeedPreview();
            isMarkerLoopPreviewOn && toggleMarkerPairLoop();
            isGammaPreviewOn && toggleGammaPreview();
            isFadeLoopPreviewOn && toggleFadeLoopPreview();
            isCropChartLoopingOn && toggleCropChartLooping();
            isAllPreviewsOn = false;
        }
    }
    function jumpToNearestMarkerOrPair(e, keyCode) {
        if (!arrowKeyCropAdjustmentEnabled) {
            if (e.ctrlKey && !e.altKey && !e.shiftKey) jumpToNearestMarker(e, video.getCurrentTime(), keyCode);
            else if (e.altKey && !e.shiftKey) {
                if (!e.ctrlKey && !(isSettingsEditorOpen && !wasGlobalSettingsEditorOpen)) {
                    (0, _util.blockEvent)(e);
                    togglePrevSelectedMarkerPair();
                }
                if (enableMarkerHotkeys.endMarker) jumpToNearestMarkerPair(e, enableMarkerHotkeys.endMarker, keyCode);
            }
        }
    }
    function jumpToNearestMarkerPair(e, targetEndMarker, keyCode) {
        (0, _util.blockEvent)(e);
        let index = parseInt(targetEndMarker.getAttribute("data-idx")) - 1;
        if (keyCode === "ArrowLeft" && index > 0) {
            targetEndMarker = enableMarkerHotkeys.endMarker.previousElementSibling.previousElementSibling;
            targetEndMarker && toggleMarkerPairEditor(targetEndMarker);
            if (e.ctrlKey) {
                index--;
                (0, _util.seekToSafe)(video, markerPairs[index].start);
            }
        } else if (keyCode === "ArrowRight" && index < markerPairs.length - 1) {
            targetEndMarker = enableMarkerHotkeys.endMarker.nextElementSibling.nextElementSibling;
            targetEndMarker && toggleMarkerPairEditor(targetEndMarker);
            if (e.ctrlKey) {
                index++;
                (0, _util.seekToSafe)(video, markerPairs[index].start);
            }
        }
    }
    let dblJump = 0;
    let prevJumpKeyCode;
    let prevTime;
    function jumpToNearestMarker(e, currentTime, keyCode) {
        (0, _util.blockEvent)(e);
        let minTime;
        currentTime = prevTime != null ? prevTime : currentTime;
        let markerTimes = [];
        markerPairs.forEach((markerPair)=>{
            markerTimes.push(markerPair.start);
            markerTimes.push(markerPair.end);
        });
        if (start === false) markerTimes.push(startTime);
        markerTimes = markerTimes.map((markerTime)=>parseFloat(markerTime.toFixed(6)));
        if (keyCode === "ArrowLeft") {
            markerTimes = markerTimes.filter((markerTime)=>markerTime < currentTime);
            minTime = Math.max(...markerTimes);
            if (dblJump != 0 && markerTimes.length > 0 && prevJumpKeyCode === "ArrowLeft") {
                markerTimes = markerTimes.filter((markerTime)=>markerTime < minTime);
                minTime = Math.max(...markerTimes);
            }
            prevJumpKeyCode = "ArrowLeft";
        } else if (keyCode === "ArrowRight") {
            markerTimes = markerTimes.filter((markerTime)=>markerTime > currentTime);
            minTime = Math.min(...markerTimes);
            if (dblJump != 0 && markerTimes.length > 0 && prevJumpKeyCode === "ArrowRight") {
                markerTimes = markerTimes.filter((markerTime)=>markerTime > minTime);
                minTime = Math.min(...markerTimes);
            }
            prevJumpKeyCode = "ArrowRight";
        }
        if (dblJump !== 0) {
            clearTimeout(dblJump);
            dblJump = 0;
            prevTime = null;
            if (minTime !== currentTime && minTime != Infinity && minTime != -Infinity) (0, _util.seekToSafe)(video, minTime);
        } else {
            prevTime = currentTime;
            if (minTime !== currentTime && minTime != Infinity && minTime != -Infinity) (0, _util.seekToSafe)(video, minTime);
            dblJump = setTimeout(()=>{
                dblJump = 0;
                prevTime = null;
            }, 150);
        }
    }
    function saveMarkersAndSettings() {
        const settingsJSON = getClipperInputJSON();
        const blob = new Blob([
            settingsJSON
        ], {
            type: "application/json;charset=utf-8"
        });
        (0, _fileSaver.saveAs)(blob, `${settings.titleSuffix || `[${settings.videoID}]`}.json`);
    }
    function getClipperInputData(date) {
        markerPairs.forEach((markerPair, index)=>{
            const speed = markerPair.speed;
            if (typeof speed === "string") {
                markerPair.speed = Number(speed);
                console.log(`Converted marker pair ${index}'s speed from String to Number`);
            }
        });
        const markerPairsNumbered = markerPairs.map((markerPair, idx)=>{
            const markerPairNumbered = {
                number: idx + 1,
                ...markerPair,
                speedMapLoop: undefined,
                speedMap: isVariableSpeed(markerPair.speedMap) ? markerPair.speedMap : undefined,
                speedChartLoop: undefined,
                cropMap: !isStaticCrop(markerPair.cropMap) ? markerPair.cropMap : undefined,
                cropChartLoop: undefined,
                undoredo: undefined,
                startNumbering: undefined,
                endNumbering: undefined,
                moveHistory: undefined,
                outputDuration: undefined
            };
            return markerPairNumbered;
        });
        const clipperInputData = {
            ...settings,
            version: __version__,
            markerPairs: markerPairsNumbered,
            date: date ?? undefined
        };
        return clipperInputData;
    }
    function getClipperInputJSON() {
        const settingsJSON = JSON.stringify(getClipperInputData(), undefined, 2);
        return settingsJSON;
    }
    function isVariableSpeed(speedMap) {
        if (speedMap.length < 2) return false;
        let isVariableSpeed = speedMap.some((speedPoint, i)=>{
            if (i === speedMap.length - 1) return false;
            return speedPoint.y !== speedMap[i + 1].y;
        });
        return isVariableSpeed;
    }
    function deleteMarkersDataCommands() {
        const markersDataCommandsDiv = document.getElementById("markers-data-commands-div");
        if (markersDataCommandsDiv) {
            (0, _util.deleteElement)(markersDataCommandsDiv);
            return true;
        }
        return false;
    }
    function toggleMarkersDataCommands() {
        if (!deleteMarkersDataCommands()) {
            const markersDataCommandsDiv = document.createElement("div");
            markersDataCommandsDiv.setAttribute("id", "markers-data-commands-div");
            const markersUploadDiv = document.createElement("div");
            markersUploadDiv.setAttribute("class", "long-msg-div");
            (0, _util.safeSetInnerHtml)(markersUploadDiv, `
        <fieldset>
          <legend>Load markers data from an uploaded markers .json file.</legend>
          <input type="file" id="markers-json-input" />
          <input type="button" id="upload-markers-json" value="Load" />
        </fieldset>
        <fieldset hidden>
          <legend>Upload a markers array file.</legend>
          <input type="file" id="markers-array-input" />
          <input type="button" id="upload-markers-array" value="Load" />
        </fieldset>
      `);
            const restoreMarkersDataDiv = document.createElement("div");
            restoreMarkersDataDiv.setAttribute("class", "long-msg-div");
            const markersDataFiles = getMarkersDataEntriesFromLocalStorage();
            (0, _util.safeSetInnerHtml)(restoreMarkersDataDiv, `
        <fieldset>
          <legend>Restore auto-saved markers data from browser local storage.</legend>
          <input type="button" id="restore-markers-data" value="Restore" />
        </fieldset>
        <fieldset>
          <legend>
            Zip and download ${markersDataFiles?.length} auto-saved markers data files from browser
            local storage.
          </legend>
          <input type="button" id="download-markers-data" value="Download" />
        </fieldset>
      `);
            const clearMarkersDataDiv = document.createElement("div");
            clearMarkersDataDiv.setAttribute("class", "long-msg-div");
            (0, _util.safeSetInnerHtml)(clearMarkersDataDiv, `
        <fieldset>
          <legend>Clear all markers data files from browser local storage.</legend>
          <input type="button" id="clear-markers-data" value="Clear" style="color:red" />
        </fieldset>
      `);
            markersDataCommandsDiv.appendChild(markersUploadDiv);
            markersDataCommandsDiv.appendChild(restoreMarkersDataDiv);
            markersDataCommandsDiv.appendChild(clearMarkersDataDiv);
            injectYtcWidget(markersDataCommandsDiv);
            const fileUploadButton = document.getElementById("upload-markers-json");
            fileUploadButton.onclick = loadMarkersJson;
            const markersArrayUploadButton = document.getElementById("upload-markers-array");
            markersArrayUploadButton.onclick = loadMarkersArray;
            const restoreMarkersDataButton = document.getElementById("restore-markers-data");
            restoreMarkersDataButton.onclick = loadClipperInputDataFromLocalStorage;
            const downloadMarkersDataButton = document.getElementById("download-markers-data");
            downloadMarkersDataButton.onclick = downloadAutoSavedMarkersData;
            const clearMarkersDataButton = document.getElementById("clear-markers-data");
            clearMarkersDataButton.onclick = clearYTClipperLocalStorage;
        }
    }
    function injectYtcWidget(widget) {
        updateSettingsEditorHook();
        if (isTheatreMode()) settingsEditorHook.insertAdjacentElement("afterend", widget);
        else {
            widget.style.position = "relative";
            settingsEditorHook.insertAdjacentElement("beforebegin", widget);
        }
    }
    function loadMarkersJson() {
        const input = document.getElementById("markers-json-input");
        if (input.files.length === 0) return;
        console.log(input.files);
        const file = input.files[0];
        const fr = new FileReader();
        fr.onload = (e)=>loadClipperInputJSON(e.target.result);
        fr.readAsText(file);
        deleteMarkersDataCommands();
    }
    function loadMarkersArray() {
        const input = document.getElementById("markers-array-input");
        if (input.files.length === 0) return;
        console.log(input.files);
        const file = input.files[0];
        const fr = new FileReader();
        fr.onload = receivedMarkersArray;
        fr.readAsText(file);
        deleteMarkersDataCommands();
    }
    function loadClipperInputJSON(json) {
        const markersData = JSON.parse(json);
        console.log(markersData);
        (0, _util.flashMessage)("Loading markers data...", "green");
        if (markersData) {
            // move markers field to marker Pairs for backwards compat)
            if (markersData.markers && !markersData.markerPairs) {
                markersData.markerPairs = markersData.markers;
                delete markersData.markers;
            }
            if (!markersData.markerPairs) (0, _util.flashMessage)("Could not find markers or markerPairs field. Could not load marker data.", "red");
            // copy markersJson to settings object less markerPairs field
            const { markerPairs: _markerPairs, ...loadedSettings } = markersData;
            delete loadedSettings.videoID;
            delete loadedSettings.videoTitle;
            delete loadedSettings.isVerticalVideo;
            delete loadedSettings.version;
            settings = {
                ...settings,
                ...loadedSettings
            };
            addMarkerPairs(markersData.markerPairs);
        }
    }
    function addMarkerPairs(markerPairs) {
        markerPairs.forEach((markerPair)=>{
            const startMarkerConfig = {
                time: markerPair.start,
                type: "start"
            };
            const endMarkerConfig = {
                time: markerPair.end,
                type: "end",
                speed: markerPair.speed,
                speedMap: markerPair.speedMap,
                speedChartLoop: markerPair.speedChartLoop,
                crop: markerPair.crop,
                cropMap: markerPair.cropMap,
                cropChartLoop: markerPair.cropChartLoop,
                enableZoomPan: markerPair.enableZoomPan,
                overrides: markerPair.overrides,
                undoredo: markerPair.undoredo
            };
            addMarker(startMarkerConfig);
            addMarker(endMarkerConfig);
        });
    }
    function receivedMarkersArray(e) {
        const lines = e.target.result;
        const markersJson = JSON.parse(lines);
        console.log(markersJson);
        (0, _util.flashMessage)("Loading markers...", "green");
        markersJson.markerPairs = markersJson.markerPairs.flat(1);
        for(let i = 0; i < markersJson.markerPairs.length; i = i + 4){
            console.log(markerPairs);
            const start = (0, _util.timeRounder)(markersJson.markerPairs[i]);
            const end = (0, _util.timeRounder)(markersJson.markerPairs[i + 1]);
            const speed = (0, _util.speedRounder)(1 / markersJson.markerPairs[i + 2]);
            const cropString = markersJson.markerPairs[i + 3];
            // const crop = Crop.fromCropString(cropString, settings.cropRes);
            const startMarkerConfig = {
                time: start,
                type: "start"
            };
            const endMarkerConfig = {
                time: end,
                type: "end",
                crop: cropString,
                speed: speed
            };
            addMarker(startMarkerConfig);
            addMarker(endMarkerConfig);
        }
    }
    // set width and height attributes for browsers not supporting svg 2
    const marker_attrs = {
        class: "marker",
        width: "1px",
        height: "14px",
        "shape-rendering": "crispEdges"
    };
    function addMarker(markerConfig = {}) {
        const preciseCurrentTime = markerConfig.time ?? video.getCurrentTime();
        // TODO: Calculate video fps precisely so current frame time
        // is accurately determined.
        // const currentFrameTime = getCurrentFrameTime(roughCurrentTime);
        const currentFrameTime = preciseCurrentTime;
        const progressPos = currentFrameTime / (0, _util.getVideoDuration)(platform, video) * 100;
        if (!start && currentFrameTime <= startTime) {
            (0, _util.flashMessage)("End marker must be after start marker.", "red");
            return;
        }
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        markersSvg.appendChild(marker);
        (0, _util.setAttributes)(marker, marker_attrs);
        marker.setAttribute("x", `${progressPos}%`);
        const rectIdx = markerPairs.length + 1;
        marker.setAttribute("data-idx", rectIdx.toString());
        if (start === true) {
            marker.classList.add("start-marker");
            marker.setAttribute("type", "start");
            marker.setAttribute("z-index", "1");
            startTime = currentFrameTime;
        } else {
            marker.addEventListener("pointerover", toggleMarkerPairEditorHandler, false);
            marker.classList.add("end-marker");
            marker.setAttribute("type", "end");
            marker.setAttribute("z-index", "2");
            const startProgressPos = startTime / (0, _util.getVideoDuration)(platform, video) * 100;
            const [startNumbering, endNumbering] = addMarkerPairNumberings(rectIdx, startProgressPos, progressPos, marker);
            pushMarkerPairsArray(currentFrameTime, {
                ...markerConfig,
                startNumbering,
                endNumbering
            });
            updateMarkerPairEditor();
        }
        start = !start;
        console.log(markerPairs);
    }
    let prevVideoWidth;
    function getFPS(defaultFPS = 60) {
        let fps;
        try {
            if (videoInfo.fps != null && video.videoWidth != null && prevVideoWidth === video.videoWidth) fps = videoInfo.fps;
            else if (platform === (0, _platforms.VideoPlatforms).youtube) {
                videoInfo.fps = parseFloat(player.getStatsForNerds().resolution.match(/@(\d+)/)[1]);
                fps = videoInfo.fps;
            } else fps = defaultFPS;
        } catch (e) {
            console.log("Could not detect fps", e);
            fps = defaultFPS; // by default parameter value assume high fps to avoid skipping frames
        }
        prevVideoWidth = video.videoWidth;
        return fps;
    }
    function getCurrentFrameTimeOrCurrentTime(currentTime) {
        let currentFrameTime;
        let fps = getFPS(null);
        // If fps cannot be detected use precise time reported by video player
        // instead of estimating nearest frame time
        fps ? currentFrameTime = Math.floor(currentTime * fps) / fps : currentFrameTime = currentTime;
        return currentFrameTime;
    }
    function getFrameTimeBetweenLeftFrames(currentTime) {
        let fps = getFPS();
        const leftFrameIndex = Math.floor(currentTime * fps);
        const midpointTime = (leftFrameIndex - 0.5) / fps;
        return midpointTime;
    }
    function pushMarkerPairsArray(currentTime, markerPairConfig) {
        const speed = markerPairConfig.speed || settings.newMarkerSpeed;
        const crop = markerPairConfig.crop || settings.newMarkerCrop;
        const newMarkerPair = {
            start: startTime,
            end: currentTime,
            speed,
            speedMap: markerPairConfig.speedMap || [
                {
                    x: startTime,
                    y: speed
                },
                {
                    x: currentTime,
                    y: speed
                }
            ],
            speedChartLoop: markerPairConfig.speedChartLoop || {
                enabled: true
            },
            crop,
            cropMap: markerPairConfig.cropMap || [
                {
                    x: startTime,
                    y: 0,
                    crop: crop
                },
                {
                    x: currentTime,
                    y: 0,
                    crop: crop
                }
            ],
            cropChartLoop: markerPairConfig.cropChartLoop || {
                enabled: true
            },
            enableZoomPan: markerPairConfig.enableZoomPan ?? false,
            cropRes: settings.cropRes,
            outputDuration: markerPairConfig.outputDuration || currentTime - startTime,
            startNumbering: markerPairConfig.startNumbering,
            endNumbering: markerPairConfig.endNumbering,
            overrides: markerPairConfig.overrides || {},
            undoredo: markerPairConfig.undoredo || {
                history: [],
                index: -1
            }
        };
        if (newMarkerPair.undoredo.history.length === 0) {
            const draft = (0, _immer.createDraft)((0, _undoredo.getMarkerPairHistory)(newMarkerPair));
            (0, _undoredo.saveMarkerPairHistory)(draft, newMarkerPair);
        }
        markerPairs.push(newMarkerPair);
        initAutoSave();
    }
    function updateMarkerPairEditor() {
        if (isSettingsEditorOpen) {
            const markerPairCountLabel = document.getElementById("marker-pair-count-label");
            if (markerPairCountLabel) {
                markerPairCountLabel.textContent = markerPairs.length.toString();
                markerPairNumberInput.setAttribute("max", markerPairs.length.toString());
            }
        }
    }
    function addMarkerPairNumberings(idx, startProgressPos, endProgressPos, endMarker) {
        let startNumbering = (0, _util.htmlToSVGElement)(`\
        <svg>\
        <text class="markerNumbering startMarkerNumbering" data-idx="${idx}"\
          x="${startProgressPos}%" y="11.5px"
          text-anchor="middle"
        >\
        ${idx}\
        </text>\
        </svg>\
        `);
        startNumbering = startNumbering.children[0];
        let endNumbering = (0, _util.htmlToSVGElement)(`\
        <svg>\
        <text class="markerNumbering endMarkerNumbering" data-idx="${idx}"\
          x="${endProgressPos}%" y="11.5px"
          text-anchor="middle"
        >\
        ${idx}\
        </text>\
        </svg>\
        `);
        endNumbering = endNumbering.children[0];
        const startNumberingText = startMarkerNumberings.appendChild(startNumbering);
        const endNumberingText = endMarkerNumberings.appendChild(endNumbering);
        endNumberingText.marker = endMarker;
        startNumberingText.marker = endMarker;
        endNumberingText.addEventListener("pointerover", markerNumberingMouseOverHandler, false);
        startNumberingText.addEventListener("pointerdown", markerNumberingMouseDownHandler, true);
        endNumberingText.addEventListener("pointerdown", markerNumberingMouseDownHandler, true);
        return [
            startNumberingText,
            endNumberingText
        ];
    }
    function undoMarker() {
        const targetMarker = markersSvg.lastElementChild;
        if (!targetMarker) return;
        const targetMarkerType = targetMarker.getAttribute("type");
        // toggle off marker pair editor before undoing a selected marker pair
        if (targetMarkerType === "end" && prevSelectedMarkerPairIndex >= markerPairs.length - 1) {
            if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen) toggleOffMarkerPairEditor(true);
            else hideSelectedMarkerPairOverlay(true);
            clearPrevSelectedMarkerPairReferences();
        }
        (0, _util.deleteElement)(targetMarker);
        if (targetMarkerType === "end") {
            const markerPair = markerPairs[markerPairs.length - 1];
            (0, _util.deleteElement)(markerPair.startNumbering);
            (0, _util.deleteElement)(markerPair.endNumbering);
            startTime = markerPair.start;
            markerPairsHistory.push(markerPairs.pop());
            console.log(markerPairs);
            updateMarkerPairEditor();
        }
        start = !start;
    }
    function redoMarker() {
        if (markerPairsHistory.length > 0) {
            const markerPairToRestore = markerPairsHistory[markerPairsHistory.length - 1];
            if (start) addMarker({
                time: markerPairToRestore.start
            });
            else {
                markerPairsHistory.pop();
                addMarker({
                    ...markerPairToRestore,
                    time: markerPairToRestore.end
                });
            }
        }
    }
    function duplicateSelectedMarkerPair() {
        const markerPairIndex = prevSelectedMarkerPairIndex;
        if (markerPairIndex != null) {
            const markerPair = (0, _lodashClonedeepDefault.default)(markerPairs[markerPairIndex]);
            addMarkerPairs([
                markerPair
            ]);
            (0, _util.flashMessage)(`Duplicated marker pair ${markerPairIndex + 1}.`, "green");
        } else (0, _util.flashMessage)(`No selected or previously selected marker pair to duplicate.`, "red");
    }
    function addChartPoint() {
        if (isChartEnabled && isCurrentChartVisible) {
            if (currentChartInput.type == "speed") (0, _scatterChartSpec.addSpeedPoint).call(currentChartInput.chart, video.getCurrentTime(), 1);
            else if (currentChartInput.type == "crop") (0, _scatterChartSpec.addCropPoint).call(currentChartInput.chart, video.getCurrentTime());
        }
    }
    let forceSetSpeedValue = 1;
    function cycleForceSetSpeedValueDown() {
        forceSetSpeedValue = forceSetSpeedValue - 0.25;
        if (forceSetSpeedValue <= 0) forceSetSpeedValue = 1;
        (0, _util.flashMessage)(`Force set video speed value set to ${forceSetSpeedValue}`, "green");
    }
    let isForceSetSpeedOn = false;
    function toggleForceSetSpeed() {
        if (isForceSetSpeedOn) {
            isForceSetSpeedOn = false;
            updateSpeedInputLabel(`Speed`);
            (0, _util.flashMessage)("Force set speed disabled", "red");
        } else {
            isForceSetSpeedOn = true;
            updateSpeedInputLabel(`Speed (${forceSetSpeedValue.toFixed(2)})`);
            if (!isSpeedPreviewOn) requestAnimationFrame(updateSpeed);
            (0, _util.flashMessage)("Force set speed enabled", "green");
        }
    }
    function toggleGlobalSettingsEditor() {
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen) toggleOffMarkerPairEditor();
        if (wasGlobalSettingsEditorOpen) toggleOffGlobalSettingsEditor();
        else createGlobalSettingsEditor();
    }
    function toggleOffGlobalSettingsEditor() {
        deleteSettingsEditor();
        hideCropOverlay();
        hideChart();
    }
    function createGlobalSettingsEditor() {
        createCropOverlay(settings.newMarkerCrop);
        const globalSettingsEditorDiv = document.createElement("div");
        const cropInputValidation = `\\d+:\\d+:(\\d+|iw):(\\d+|ih)`;
        const [x, y, w, h] = getCropComponents(settings.newMarkerCrop);
        const cropAspectRatio = (w / h).toFixed(13);
        const numOrRange = `(\\d{1,2})|(\\d{1,2}-\\d{1,2})`;
        const csvRange = `(${numOrRange})*(,(${numOrRange}))*`;
        const csvRangeReq = `(${numOrRange}){1}(,(${numOrRange}))*`;
        const mergeListInputValidation = `^(${csvRange})(;${csvRangeReq})*$`;
        const gte100 = `([1-9]\\d{3}|[1-9]\\d{2})`;
        const cropResInputValidation = `${gte100}x${gte100}`;
        const { cropRes, cropResWidth, cropResHeight } = getDefaultCropRes();
        const cropResX2 = `${cropResWidth * 2}x${cropResHeight * 2}`;
        const resList = `<option value="${cropRes}"><option value="${cropResX2}">`;
        const minterpMode = settings.minterpMode;
        const minterpFPS = settings.minterpFPS;
        const denoise = settings.denoise;
        const denoiseDesc = denoise ? denoise.desc : null;
        const vidstab = settings.videoStabilization;
        const vidstabDesc = vidstab ? vidstab.desc : null;
        const vidstabDynamicZoomEnabled = settings.videoStabilizationDynamicZoom;
        const markerPairMergelistDurations = getMarkerPairMergeListDurations();
        const globalEncodeSettingsEditorDisplay = isExtraSettingsEditorEnabled ? "block" : "none";
        globalSettingsEditorDiv.setAttribute("id", "settings-editor-div");
        (0, _util.safeSetInnerHtml)(globalSettingsEditorDiv, `
    <fieldset id="new-marker-defaults-inputs"
      class="settings-editor-panel global-settings-editor global-settings-editor-highlighted-div">
      <legend class="global-settings-editor-highlighted-label">New Marker Settings</legend>
      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).speedTooltip}">
        <span>Speed</span>
        <input id="speed-input" type="number" placeholder="speed" value="${settings.newMarkerSpeed}" step="0.05" min="0.05" max="2" style="width:7ch">
      </div>
      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).cropTooltip}">
        <span>Crop</span>
        <input id="crop-input" value="${settings.newMarkerCrop}" pattern="${cropInputValidation}" style="width:21ch" required>
      </div>
      <div class="settings-editor-input-div  settings-info-display">
        <span>Crop Aspect Ratio</span>
        <span id="crop-aspect-ratio">${cropAspectRatio}</span>
      </div>
    </fieldset>
    <fieldset id="global-marker-settings"
    class="settings-editor-panel global-settings-editor global-settings-editor-highlighted-div">
      <legend class="global-settings-editor-highlighted-label settings-editor-panel-label">Global Settings</legend>
      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).titleSuffixTooltip}">
        <span>Title Suffix</span>
        <input id="title-suffix-input" value="${settings.titleSuffix}" style="background-color:lightgreen;min-width:20em;text-align:right" required>
      </div>
      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).cropResolutionTooltip}">
        <span>Crop Resolution</span>
        <input id="crop-res-input" list="resolutions" pattern="${cropResInputValidation}" value="${settings.cropRes}" style="width:14ch" required>
        <datalist id="resolutions" autocomplete="off">${resList}</datalist>
      </div>
      <div id="global-settings-rotate" class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).rotateTooltip}">
        <span style="display:inline">Rotate: </span>
        <input id="rotate-0" type="radio" name="rotate" value="0" ${settings.rotate == null || settings.rotate === "0" ? "checked" : ""}></input>
        <label for="rotate-0">0&#x00B0; </label>
        <input id="rotate-90-clock" type="radio" value="clock" name="rotate" ${settings.rotate === "clock" ? "checked" : ""}></input>
        <label for="rotate-90-clock">90&#x00B0; &#x27F3;</label>
        <input id="rotate-90-counterclock" type="radio" value="cclock" name="rotate" ${settings.rotate === "cclock" ? "checked" : ""}></input>
        <label for="rotate-90-counterclock">90&#x00B0; &#x27F2;</label>
      </div>
      <div id="merge-list-div" class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).mergeListTooltip}">
          <span style="display:inline">Merge List: </span>
          <input id="merge-list-input" pattern="${mergeListInputValidation}" value="${settings.markerPairMergeList != null ? settings.markerPairMergeList : ""}" placeholder="None" style="min-width:15em">
      </div>
      <div class="settings-editor-input-div">
        <span style="display:inline">Merge Durations: </span>
        <span id="merge-list-durations" style="display:inline">${markerPairMergelistDurations}</span>
      </div>
    </fieldset>
    <fieldset id="global-encode-settings"
      class="settings-editor-panel global-settings-editor global-settings-editor-highlighted-div" style="display:${globalEncodeSettingsEditorDisplay}">
      <legend class="global-settings-editor-highlighted-label">Encode Settings</legend>
      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).audioTooltip}">
        <span>Audio</span>
        <select id="audio-input">
          <option value="Default" ${settings.audio == null ? "selected" : ""}>(Disabled)</option>
          <option ${settings.audio === false ? "selected" : ""}>Disabled</option>
          <option ${settings.audio ? "selected" : ""}>Enabled</option>
        </select>
      </div>
      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).encodeSpeedTooltip}">
        <span>Encode Speed (0-5)</span>
        <input id="encode-speed-input" type="number" min="0" max="5" step="1" value="${settings.encodeSpeed != null ? settings.encodeSpeed : ""}" placeholder="Auto" style="min-width:4em"></input>
      </div>
      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).CRFTooltip}">
        <span>CRF (0-63)</span>
        <input id="crf-input" type="number" min="0" max="63" step="1" value="${settings.crf != null ? settings.crf : ""}" placeholder="Auto" style="min-width:4em"></input>
      </div>
      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).targetBitrateTooltip}">
        <span>Target Bitrate (kb/s)</span>
        <input id="target-max-bitrate-input" type="number" min="0" max="1e5"step="100" value="${settings.targetMaxBitrate != null ? settings.targetMaxBitrate : ""}" placeholder="Auto" style="min-width:4em"></input>
      </div>

      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).twoPassTooltip}">
        <span>Two-Pass</span>
        <select id="two-pass-input">
          <option value="Default" ${settings.twoPass == null ? "selected" : ""}>(Disabled)</option>
          <option ${settings.twoPass === false ? "selected" : ""}>Disabled</option>
          <option ${settings.twoPass ? "selected" : ""}>Enabled</option>
        </select>
      </div>

      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).gammaTooltip}">
        <span>Gamma (0-4)</span>
        <input id="gamma-input" type="number" min="0.01" max="4.00" step="0.01" value="${settings.gamma != null ? settings.gamma : ""}" placeholder="1" style="min-width:4em"></input>
      </div>

      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).hdrTooltip}">
        <span>Enable HDR</span>
        <select id="enable-hdr-input">
          <option value="Default" ${settings.enableHDR == null ? "selected" : ""}>(Disabled)</option>
          <option ${settings.enableHDR === false ? "selected" : ""}>Disabled</option>
          <option ${settings.enableHDR ? "selected" : ""}>Enabled</option>
        </select>
      </div>

      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).denoiseTooltip}">
        <span>Denoise</span>
        <select id="denoise-input">
          <option value="Inherit" ${denoiseDesc == null ? "selected" : ""}>(Disabled)</option>
          <option ${denoiseDesc === "Very Weak" ? "selected" : ""}>Very Weak</option>
          <option ${denoiseDesc === "Weak" ? "selected" : ""}>Weak</option>
          <option ${denoiseDesc === "Medium" ? "selected" : ""}>Medium</option>
          <option ${denoiseDesc === "Strong" ? "selected" : ""}>Strong</option>
          <option ${denoiseDesc === "Very Strong" ? "selected" : ""}>Very Strong</option>
        </select>
      </div>
      <div class="settings-editor-input-div">
        <div  title="${(0, _tooltips.Tooltips).minterpModeTooltip}">
          <span>Minterpolation</span>
          <select id="minterp-mode-input">
            <option value="Default" ${minterpMode == null ? "selected" : ""}>(Numeric)</option>
            <option ${minterpMode === "None" ? "selected" : ""}>None</option>
            <option value="MaxSpeed" ${minterpMode == "MaxSpeed" ? "selected" : ""}>MaxSpeed</option>
            <option value="VideoFPS" ${minterpMode == "VideoFPS" ? "selected" : ""}>VideoFPS</option>
            <option value="MaxSpeedx2" ${minterpMode == "MaxSpeedx2" ? "selected" : ""}>MaxSpeedx2</option>
            <option value="VideoFPSx2" ${minterpMode == "VideoFPSx2" ? "selected" : ""}>VideoFPSx2</option>
          </select>
        </div>
        <div  title="${(0, _tooltips.Tooltips).minterpFPSTooltip}">
          <span>FPS</span>
          <input id="minterp-fps-input" type="number" min="10" max="120" step="1" value="${minterpFPS ?? ""}" placeholder="" style="min-width:2em"></input>
        </div>
      </div>
      <div class="settings-editor-input-div multi-input-div" title="${(0, _tooltips.Tooltips).vidstabTooltip}">
        <div>
          <span>Stabilization</span>
          <select id="video-stabilization-input">
            <option value="Inherit" ${vidstabDesc == null ? "selected" : ""}>(Disabled)</option>
            <option ${vidstabDesc === "Very Weak" ? "selected" : ""}>Very Weak</option>
            <option ${vidstabDesc === "Weak" ? "selected" : ""}>Weak</option>
            <option ${vidstabDesc === "Medium" ? "selected" : ""}>Medium</option>
            <option ${vidstabDesc === "Strong" ? "selected" : ""}>Strong</option>
            <option ${vidstabDesc === "Very Strong" ? "selected" : ""}>Very Strong</option>
            <option ${vidstabDesc === "Strongest" ? "selected" : ""}>Strongest</option>
          </select>
        </div>
        <div title="${(0, _tooltips.Tooltips).dynamicZoomTooltip}">
          <span>Dynamic Zoom</span>
          <select id="video-stabilization-dynamic-zoom-input">
            <option value="Default" ${vidstabDynamicZoomEnabled == null ? "selected" : ""}>(Disabled)</option>
            <option ${vidstabDynamicZoomEnabled === false ? "selected" : ""}>Disabled</option>
            <option ${vidstabDynamicZoomEnabled ? "selected" : ""}>Enabled</option>
          </select>
        </div>
      </div>
      <div class="settings-editor-input-div multi-input-div" title="${(0, _tooltips.Tooltips).loopTooltip}">
        <div>
          <span>Loop</span>
          <select id="loop-input">
          <option value="Default" ${settings.loop == null ? "selected" : ""}>(none)</option>
          <option ${settings.loop === "none" ? "selected" : ""}>none</option>
            <option ${settings.loop === "fwrev" ? "selected" : ""}>fwrev</option>
            <option ${settings.loop === "fade" ? "selected" : ""}>fade</option>
          </select>
        </div>
        <div title="${(0, _tooltips.Tooltips).fadeDurationTooltip}">
          <span>Fade Duration</span>
          <input id="fade-duration-input" type="number" min="0.1" step="0.1" value="${settings.fadeDuration != null ? settings.fadeDuration : ""}" placeholder="0.7" style="width:7em"></input>
        </div>
      </div>
    </fieldset>
    `);
        injectYtcWidget(globalSettingsEditorDiv);
        const settingsInputsConfigs = [
            [
                "crop-res-input",
                "cropRes",
                "string"
            ]
        ];
        const settingsInputsConfigsHighlightable = [
            [
                "crop-input",
                "newMarkerCrop",
                "string"
            ],
            [
                "speed-input",
                "newMarkerSpeed",
                "number"
            ],
            [
                "title-suffix-input",
                "titleSuffix",
                "string"
            ],
            [
                "merge-list-input",
                "markerPairMergeList",
                "string"
            ],
            [
                "enable-hdr-input",
                "enableHDR",
                "ternary"
            ],
            [
                "gamma-input",
                "gamma",
                "number"
            ],
            [
                "encode-speed-input",
                "encodeSpeed",
                "number"
            ],
            [
                "crf-input",
                "crf",
                "number"
            ],
            [
                "target-max-bitrate-input",
                "targetMaxBitrate",
                "number"
            ],
            [
                "rotate-0",
                "rotate",
                "string"
            ],
            [
                "rotate-90-clock",
                "rotate",
                "string"
            ],
            [
                "rotate-90-counterclock",
                "rotate",
                "string"
            ],
            [
                "two-pass-input",
                "twoPass",
                "ternary"
            ],
            [
                "audio-input",
                "audio",
                "ternary"
            ],
            [
                "denoise-input",
                "denoise",
                "preset"
            ],
            [
                "minterp-mode-input",
                "minterpMode",
                "inheritableString"
            ],
            [
                "minterp-fps-input",
                "minterpFPS",
                "number"
            ],
            [
                "video-stabilization-input",
                "videoStabilization",
                "preset"
            ],
            [
                "video-stabilization-dynamic-zoom-input",
                "videoStabilizationDynamicZoom",
                "ternary"
            ],
            [
                "loop-input",
                "loop",
                "inheritableString"
            ],
            [
                "fade-duration-input",
                "fadeDuration",
                "number"
            ]
        ];
        addSettingsInputListeners(settingsInputsConfigs, settings, false);
        addSettingsInputListeners(settingsInputsConfigsHighlightable, settings, true);
        cropInput = document.getElementById("crop-input");
        cropAspectRatioSpan = document.getElementById("crop-aspect-ratio");
        wasGlobalSettingsEditorOpen = true;
        isSettingsEditorOpen = true;
        addMarkerPairMergeListDurationsListener();
        addCropInputHotkeys();
        highlightModifiedSettings(settingsInputsConfigsHighlightable, settings);
    }
    function addSettingsInputListeners(inputs, target, highlightable = false) {
        inputs.forEach((input)=>{
            const id = input[0];
            const targetProperty = input[1];
            const valueType = input[2] || "string";
            const inputElem = document.getElementById(id);
            inputElem.addEventListener("focus", ()=>isHotkeysEnabled = false, false);
            inputElem.addEventListener("blur", ()=>isHotkeysEnabled = true, false);
            inputElem.addEventListener("change", (e)=>updateSettingsValue(e, id, target, targetProperty, valueType, highlightable), false);
        });
    }
    function deleteSettingsEditor() {
        const settingsEditorDiv = document.getElementById("settings-editor-div");
        hideCropOverlay();
        (0, _util.deleteElement)(settingsEditorDiv);
        isSettingsEditorOpen = false;
        wasGlobalSettingsEditorOpen = false;
        markerHotkeysEnabled = false;
    }
    let isExtraSettingsEditorEnabled = false;
    function toggleMarkerPairOverridesEditor() {
        if (isSettingsEditorOpen) {
            const markerPairOverridesEditor = document.getElementById("marker-pair-overrides");
            if (markerPairOverridesEditor) {
                if (markerPairOverridesEditor.style.display === "none") {
                    markerPairOverridesEditor.style.display = "block";
                    isExtraSettingsEditorEnabled = true;
                } else {
                    markerPairOverridesEditor.style.display = "none";
                    isExtraSettingsEditorEnabled = false;
                }
            }
            const globalEncodeSettingsEditor = document.getElementById("global-encode-settings");
            if (globalEncodeSettingsEditor) {
                if (globalEncodeSettingsEditor.style.display === "none") {
                    globalEncodeSettingsEditor.style.display = "block";
                    isExtraSettingsEditorEnabled = true;
                } else if (globalEncodeSettingsEditor.style.display === "block") {
                    globalEncodeSettingsEditor.style.display = "none";
                    isExtraSettingsEditorEnabled = false;
                }
            }
        }
    }
    function markerNumberingMouseOverHandler(e) {
        const targetMarker = e.target.marker;
        toggleMarkerPairEditorHandler(e, targetMarker);
    }
    function markerNumberingMouseDownHandler(e) {
        if (!(e.button === 0)) return;
        (0, _util.blockEvent)(e);
        const numbering = e.target;
        const numberingType = numbering.classList.contains("startMarkerNumbering") ? "start" : "end";
        const targetEndMarker = numbering.marker;
        const targetStartMarker = targetEndMarker.previousSibling;
        const targetMarker = numberingType === "start" ? targetStartMarker : targetEndMarker;
        const markerPairIndex = parseInt(numbering.getAttribute("data-idx")) - 1;
        const markerPair = markerPairs[markerPairIndex];
        const markerTime = numberingType === "start" ? markerPair.start : markerPair.end;
        // open editor of target marker corresponding to clicked numbering
        if (!isSettingsEditorOpen) toggleOnMarkerPairEditor(targetEndMarker);
        else {
            if (wasGlobalSettingsEditorOpen) {
                toggleOffGlobalSettingsEditor();
                toggleOnMarkerPairEditor(targetEndMarker);
            } else if (prevSelectedEndMarker != targetEndMarker) {
                toggleOffMarkerPairEditor();
                toggleOnMarkerPairEditor(targetEndMarker);
            }
        }
        (0, _util.seekToSafe)(video, markerTime);
        if (!e.altKey) return;
        const pointerId = e.pointerId;
        numbering.setPointerCapture(pointerId);
        const numberingRect = numbering.getBoundingClientRect();
        const progressBarRect = hooks.progressBar.getBoundingClientRect();
        const offsetX = e.pageX - numberingRect.left - numberingRect.width / 2;
        const offsetY = e.pageY - numberingRect.top;
        let prevPageX = e.pageX;
        let prevZoom = 1;
        function getDragTime(e) {
            let newTime = (0, _util.getVideoDuration)(platform, video) * (e.pageX - offsetX - progressBarRect.left) / progressBarRect.width;
            let prevTime = (0, _util.getVideoDuration)(platform, video) * (prevPageX - offsetX - progressBarRect.left) / progressBarRect.width;
            const zoom = (0, _util.clampNumber)((e.pageY - offsetY) / video.clientHeight, 0, 1);
            const zoomDelta = Math.abs(zoom - prevZoom);
            prevZoom = zoom;
            prevPageX = e.pageX;
            if (zoomDelta >= 0.0001) return video.getCurrentTime();
            let timeDelta = (0, _util.roundValue)(zoom * (newTime - prevTime), 0.01, 2);
            if (Math.abs(timeDelta) < 0.01) return video.getCurrentTime();
            let time = video.getCurrentTime() + timeDelta;
            time = numberingType === "start" ? (0, _util.clampNumber)(time, 0, markerPair.end - 1e-3) : (0, _util.clampNumber)(time, markerPair.start + 1e-3, (0, _util.getVideoDuration)(platform, video));
            return time;
        }
        function dragNumbering(e) {
            const time = getDragTime(e);
            if (Math.abs(time - video.getCurrentTime()) < 0.01) return;
            moveMarker(targetMarker, time, false, false);
            (0, _util.seekToSafe)(video, time);
        }
        document.addEventListener("pointermove", dragNumbering);
        document.addEventListener("pointerup", (e)=>{
            document.removeEventListener("pointermove", dragNumbering);
            numbering.releasePointerCapture(pointerId);
            const time = getDragTime(e);
            if (Math.abs(time - markerTime) < 0.001) return;
            moveMarker(targetMarker, time, true, true);
        }, {
            once: true,
            capture: true
        });
    }
    function toggleMarkerPairEditorHandler(e, targetMarker) {
        targetMarker = targetMarker ?? e.target;
        if (targetMarker && e.shiftKey) toggleMarkerPairEditor(targetMarker);
    }
    let isChartEnabled = false;
    function toggleMarkerPairEditor(targetMarker) {
        // if target marker is previously selected marker: toggle target on/off
        if (prevSelectedEndMarker === targetMarker && !wasGlobalSettingsEditorOpen) isSettingsEditorOpen ? toggleOffMarkerPairEditor() : toggleOnMarkerPairEditor(targetMarker);
        else {
            // delete current settings editor appropriately
            if (isSettingsEditorOpen) wasGlobalSettingsEditorOpen ? toggleOffGlobalSettingsEditor() : toggleOffMarkerPairEditor();
            // create new marker pair settings editor
            toggleOnMarkerPairEditor(targetMarker);
        }
    }
    function toggleOnMarkerPairEditor(targetMarker) {
        prevSelectedEndMarker = targetMarker;
        const selectedMarkerPairIndex = parseInt(prevSelectedEndMarker.getAttribute("data-idx")) - 1;
        if (selectedMarkerPairIndex !== prevSelectedMarkerPairIndex) (0, _cropChartSpec.setCurrentCropPoint)(null, 0);
        prevSelectedMarkerPairIndex = selectedMarkerPairIndex;
        highlightSelectedMarkerPair(targetMarker);
        enableMarkerHotkeys(targetMarker);
        // creating editor sets isSettingsEditorOpen to true
        createMarkerPairEditor(targetMarker);
        addCropInputHotkeys();
        loadChartData(speedChartInput);
        loadChartData(cropChartInput);
        showCropOverlay();
        if (isChartEnabled) showChart();
        targetMarker.classList.add("selected-marker");
        targetMarker.previousElementSibling.classList.add("selected-marker");
        const markerPair = markerPairs[prevSelectedMarkerPairIndex];
        markerPair.startNumbering.classList.add("selectedMarkerNumbering");
        markerPair.endNumbering.classList.add("selectedMarkerNumbering");
        if (isAutoHideUnselectedMarkerPairsOn) autoHideUnselectedMarkerPairsStyle = (0, _util.injectCSS)((0, _css.autoHideUnselectedMarkerPairsCSS), "auto-hide-unselected-marker-pairs-css");
    }
    function toggleOffMarkerPairEditor(hardHide = false) {
        deleteSettingsEditor();
        hideSelectedMarkerPairOverlay(hardHide);
        hideCropOverlay();
        hideChart();
        prevSelectedEndMarker.classList.remove("selected-marker");
        prevSelectedEndMarker.previousElementSibling.classList.remove("selected-marker");
        const markerPair = markerPairs[prevSelectedMarkerPairIndex];
        markerPair.startNumbering.classList.remove("selectedMarkerNumbering");
        markerPair.endNumbering.classList.remove("selectedMarkerNumbering");
        if (isAutoHideUnselectedMarkerPairsOn) (0, _util.deleteElement)(autoHideUnselectedMarkerPairsStyle);
    }
    let autoHideUnselectedMarkerPairsStyle;
    let isAutoHideUnselectedMarkerPairsOn = false;
    function toggleAutoHideUnselectedMarkerPairs(e) {
        if (e.ctrlKey && !arrowKeyCropAdjustmentEnabled) {
            (0, _util.blockEvent)(e);
            if (!isAutoHideUnselectedMarkerPairsOn) {
                autoHideUnselectedMarkerPairsStyle = (0, _util.injectCSS)((0, _css.autoHideUnselectedMarkerPairsCSS), "auto-hide-unselected-marker-pairs-css");
                isAutoHideUnselectedMarkerPairsOn = true;
                (0, _util.flashMessage)("Auto-hiding of unselected marker pairs enabled", "green");
            } else {
                (0, _util.deleteElement)(autoHideUnselectedMarkerPairsStyle);
                isAutoHideUnselectedMarkerPairsOn = false;
                (0, _util.flashMessage)("Auto-hiding of unselected marker pairs disabled", "red");
            }
        }
    }
    let speedInputLabel;
    let cropInputLabel;
    let cropInput;
    let speedInput;
    let enableZoomPanInput;
    let cropAspectRatioSpan;
    let markerPairNumberInput;
    function createMarkerPairEditor(targetMarker) {
        const markerPairIndex = parseInt(targetMarker.getAttribute("data-idx"), 10) - 1;
        const markerPair = markerPairs[markerPairIndex];
        const startTime = (0, _util.toHHMMSSTrimmed)(markerPair.start);
        const endTime = (0, _util.toHHMMSSTrimmed)(markerPair.end);
        const speed = markerPair.speed;
        const duration = (0, _util.toHHMMSSTrimmed)(markerPair.end - markerPair.start);
        const speedAdjustedDuration = (0, _util.toHHMMSSTrimmed)((markerPair.end - markerPair.start) / speed);
        const crop = markerPair.crop;
        const cropInputValidation = `\\d+:\\d+:(\\d+|iw):(\\d+|ih)`;
        const [x, y, w, h] = getCropComponents(crop);
        const cropAspectRatio = (w / h).toFixed(13);
        const settingsEditorDiv = document.createElement("div");
        const overrides = markerPair.overrides;
        const vidstab = overrides.videoStabilization;
        const vidstabDesc = vidstab ? vidstab.desc : null;
        const vidstabDescGlobal = settings.videoStabilization ? `(${settings.videoStabilization.desc})` : "(Disabled)";
        const vidstabDynamicZoomEnabled = overrides.videoStabilizationDynamicZoom;
        const minterpMode = overrides.minterpMode;
        const minterpFPS = overrides.minterpFPS;
        const denoise = overrides.denoise;
        const denoiseDesc = denoise ? denoise.desc : null;
        const denoiseDescGlobal = settings.denoise ? `(${settings.denoise.desc})` : "(Disabled)";
        const overridesEditorDisplay = isExtraSettingsEditorEnabled ? "block" : "none";
        createCropOverlay(crop);
        settingsEditorDiv.setAttribute("id", "settings-editor-div");
        (0, _util.safeSetInnerHtml)(settingsEditorDiv, `
      <fieldset class="settings-editor-panel marker-pair-settings-editor-highlighted-div">
        <legend class="marker-pair-settings-editor-highlighted-label">Marker Pair
          <input id="marker-pair-number-input"
            title="${(0, _tooltips.Tooltips).markerPairNumberTooltip}"
            type="number" value="${markerPairIndex + 1}"
            step="1" min="1" max="${markerPairs.length}" style="width:3em" required>
          </input>
          /
          <span id="marker-pair-count-label">${markerPairs.length}</span>
          Settings\
        </legend>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).speedTooltip}">
          <span id="speed-input-label">Speed</span>
          <input id="speed-input"type="number" placeholder="speed" value="${speed}"
            step="0.05" min="0.05" max="2" style="width:7ch" required></input>
        </div>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).cropTooltip}">
          <span id="crop-input-label">Crop</span>
          <input id="crop-input" value="${crop}" pattern="${cropInputValidation}"
          style="width:20ch" required></input>
        </div>
        <div class="settings-editor-input-div settings-info-display">
          <span>Crop Aspect Ratio</span>
          <br>
          <span id="crop-aspect-ratio">${cropAspectRatio}</span>
        </div>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).titlePrefixTooltip}">
          <span>Title Prefix</span>
          <input id="title-prefix-input" value="${overrides.titlePrefix != null ? overrides.titlePrefix : ""}" placeholder="None" style="width:20ch;text-align:right"></input>
        </div>
        <div class="settings-editor-input-div settings-info-display" title="${(0, _tooltips.Tooltips).timeDurationTooltip}">
          <span>Time:</span>
          <span id="start-time">${startTime}</span>
          <span> - </span>
          <span id="end-time">${endTime}</span>
          <br>
          <span>Duration: </span>
          <span id="duration">${duration}/${markerPair.speed} = ${speedAdjustedDuration}</span>
        </div>
      </fieldset>
      <fieldset id="marker-pair-overrides" class="settings-editor-panel marker-pair-settings-editor-highlighted-div" style="display:${overridesEditorDisplay}">
        <legend class="marker-pair-settings-editor-highlighted-label">Overrides</legend>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).audioTooltip}">
          <span>Audio</span>
          <select id="audio-input">
            <option value="Default" ${overrides.audio == null ? "selected" : ""}>${(0, _util.ternaryToString)(settings.audio)}</option>
            <option ${overrides.audio === false ? "selected" : ""}>Disabled</option>
            <option ${overrides.audio ? "selected" : ""}>Enabled</option>
          </select>
        </div>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).encodeSpeedTooltip}">
          <span>Encode Speed (0-5)</span>
          <input id="encode-speed-input" type="number" min="0" max="5" step="1" value="${overrides.encodeSpeed != null ? overrides.encodeSpeed : ""}" placeholder="${settings.encodeSpeed || "Auto"}"  style="min-width:4em"></input>
        </div>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).CRFTooltip}">
          <span>CRF (0-63)</span>
          <input id="crf-input" type="number" min="0" max="63" step="1" value="${overrides.crf != null ? overrides.crf : ""}" placeholder="${settings.crf != null ? settings.crf : "Auto"}" style="min-width:4em"></input>
        </div>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).targetBitrateTooltip}">
          <span>Bitrate (kb/s)</span>
          <input id="target-max-bitrate-input" type="number" min="0" max="10e5" step="100" value="${overrides.targetMaxBitrate != null ? overrides.targetMaxBitrate : ""}" placeholder="${settings.targetMaxBitrate || "Auto"}" style="min-width:4em"></input>
        </div>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).twoPassTooltip}">
          <span>Two-Pass</span>
          <select id="two-pass-input">
            <option value="Default" ${overrides.twoPass == null ? "selected" : ""}>
              ${(0, _util.ternaryToString)(settings.twoPass)}
            </option>
            <option ${overrides.twoPass === false ? "selected" : ""}>Disabled</option>
            <option ${overrides.twoPass ? "selected" : ""}>Enabled</option>
          </select>
        </div>

      <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).hdrTooltip}">
        <span>Enable HDR</span>
        <select id="enable-hdr-input">
          <option value="Default" ${overrides.enableHDR == null ? "selected" : ""}>
            ${(0, _util.ternaryToString)(settings.enableHDR)}
          </option>
          <option ${overrides.enableHDR === false ? "selected" : ""}>Disabled</option>
          <option ${overrides.enableHDR ? "selected" : ""}>Enabled</option>
        </select>
      </div>

      </div>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).gammaTooltip}">
          <span>Gamma (0-4)</span>
          <input id="gamma-input" type="number" min="0.01" max="4.00" step="0.01" value="${overrides.gamma != null ? overrides.gamma : ""}" placeholder="${settings.gamma != null ? settings.gamma : "1"}" style="min-width:4em"></input>
        </div>

        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).denoiseTooltip}">
          <span>Denoise</span>
          <select id="denoise-input">
            <option value="Inherit" ${denoiseDesc == null ? "selected" : ""}>${denoiseDescGlobal}</option>
            <option value="Disabled" ${denoiseDesc == "Disabled" ? "selected" : ""}>Disabled</option>
            <option ${denoiseDesc === "Very Weak" ? "selected" : ""}>Very Weak</option>
            <option ${denoiseDesc === "Weak" ? "selected" : ""}>Weak</option>
            <option ${denoiseDesc === "Medium" ? "selected" : ""}>Medium</option>
            <option ${denoiseDesc === "Strong" ? "selected" : ""}>Strong</option>
            <option ${denoiseDesc === "Very Strong" ? "selected" : ""}>Very Strong</option>
          </select>
        </div>
        <div class="settings-editor-input-div">
          <div title="${(0, _tooltips.Tooltips).minterpModeTooltip}">
            <span>Minterpolation</span>
            <select id="minterp-mode-input">
              <option value="Default" ${minterpMode == null ? "selected" : ""}>${settings.minterpMode != null ? `(${settings.minterpMode})` : "(Numeric)"}</option>
              <option ${minterpMode === "None" ? "selected" : ""}>None</option>
              <option ${minterpMode === "Numeric" ? "selected" : ""}>Numeric</option>
              <option value="MaxSpeed" ${minterpMode == "MaxSpeed" ? "selected" : ""}>MaxSpeed</option>
              <option value="VideoFPS" ${minterpMode == "VideoFPS" ? "selected" : ""}>VideoFPS</option>
              <option value="MaxSpeedx2" ${minterpMode == "MaxSpeedx2" ? "selected" : ""}>MaxSpeedx2</option>
              <option value="VideoFPSx2" ${minterpMode == "VideoFPSx2" ? "selected" : ""}>VideoFPSx2</option>
            </select>
          </div>
          <div title="${(0, _tooltips.Tooltips).minterpFPSTooltip}">
            <span>FPS</span>
            <input id="minterp-fps-input" type="number" min="10" max="120" step="1" value="${minterpFPS ?? ""}" placeholder="" style="min-width:2em"></input>
          </div>
        </div>
        <div class="settings-editor-input-div multi-input-div" title="${(0, _tooltips.Tooltips).vidstabTooltip}">
        <div>
          <span>Stabilization</span>
          <select id="video-stabilization-input">
              <option value="Inherit" ${vidstabDesc == null ? "selected" : ""}>${vidstabDescGlobal}</option>
              <option value="Disabled" ${vidstabDesc == "Disabled" ? "selected" : ""}>Disabled</option>
              <option ${vidstabDesc === "Very Weak" ? "selected" : ""}>Very Weak</option>
              <option ${vidstabDesc === "Weak" ? "selected" : ""}>Weak</option>
              <option ${vidstabDesc === "Medium" ? "selected" : ""}>Medium</option>
              <option ${vidstabDesc === "Strong" ? "selected" : ""}>Strong</option>
              <option ${vidstabDesc === "Very Strong" ? "selected" : ""}>Very Strong</option>
              <option ${vidstabDesc === "Strongest" ? "selected" : ""}>Strongest</option>
            </select>
          </div>
          <div title="${(0, _tooltips.Tooltips).dynamicZoomTooltip}">
            <span>Dynamic Zoom</span>
            <select id="video-stabilization-dynamic-zoom-input">
              <option value="Default" ${vidstabDynamicZoomEnabled == null ? "selected" : ""}>${(0, _util.ternaryToString)(settings.videoStabilizationDynamicZoom)}</option>
              <option ${vidstabDynamicZoomEnabled === false ? "selected" : ""}>Disabled</option>
              <option ${vidstabDynamicZoomEnabled ? "selected" : ""}>Enabled</option>
            </select>
          </div>
        </div>
        <div class="settings-editor-input-div multi-input-div" title="${(0, _tooltips.Tooltips).loopTooltip}">
          <div>
            <span>Loop</span>
            <select id="loop-input">
              <option value="Default" ${overrides.loop == null ? "selected" : ""}>${settings.loop != null ? `(${settings.loop})` : "(none)"}</option>
              <option ${overrides.loop === "none" ? "selected" : ""}>none</option>
              <option ${overrides.loop === "fwrev" ? "selected" : ""}>fwrev</option>
              <option ${overrides.loop === "fade" ? "selected" : ""}>fade</option>
            </select>
          </div>
          <div title="${(0, _tooltips.Tooltips).fadeDurationTooltip}">
            <span>Fade Duration</span>
            <input id="fade-duration-input" type="number" min="0.1" step="0.1" value="${overrides.fadeDuration != null ? overrides.fadeDuration : ""}" placeholder="${settings.fadeDuration != null ? settings.fadeDuration : "0.7"}" style="width:7em"></input>
          </div>
        </div>
        <div class="settings-editor-input-div" title="${(0, _tooltips.Tooltips).enableZoomPanTooltip}">
          <span>ZoomPan</span>
            <select id="enable-zoom-pan-input">
              <option ${!markerPair.enableZoomPan ? "selected" : ""}>Disabled</option>
              <option ${markerPair.enableZoomPan ? "selected" : ""}>Enabled</option>
            </select>
        </div>
      </fieldset>
      `);
        injectYtcWidget(settingsEditorDiv);
        const inputConfigs = [
            [
                "speed-input",
                "speed",
                "number"
            ],
            [
                "crop-input",
                "crop",
                "string"
            ],
            [
                "enable-zoom-pan-input",
                "enableZoomPan",
                "bool"
            ]
        ];
        addSettingsInputListeners(inputConfigs, markerPair, true);
        const overrideInputConfigs = [
            [
                "title-prefix-input",
                "titlePrefix",
                "string"
            ],
            [
                "enable-hdr-input",
                "enableHDR",
                "ternary"
            ],
            [
                "gamma-input",
                "gamma",
                "number"
            ],
            [
                "encode-speed-input",
                "encodeSpeed",
                "number"
            ],
            [
                "crf-input",
                "crf",
                "number"
            ],
            [
                "target-max-bitrate-input",
                "targetMaxBitrate",
                "number"
            ],
            [
                "two-pass-input",
                "twoPass",
                "ternary"
            ],
            [
                "audio-input",
                "audio",
                "ternary"
            ],
            [
                "minterp-mode-input",
                "minterpMode",
                "inheritableString"
            ],
            [
                "minterp-fps-input",
                "minterpFPS",
                "number"
            ],
            [
                "denoise-input",
                "denoise",
                "preset"
            ],
            [
                "video-stabilization-input",
                "videoStabilization",
                "preset"
            ],
            [
                "video-stabilization-dynamic-zoom-input",
                "videoStabilizationDynamicZoom",
                "ternary"
            ],
            [
                "loop-input",
                "loop",
                "inheritableString"
            ],
            [
                "fade-duration-input",
                "fadeDuration",
                "number"
            ]
        ];
        addSettingsInputListeners(overrideInputConfigs, markerPair.overrides, true);
        markerPairNumberInput = document.getElementById("marker-pair-number-input");
        markerPairNumberInput.addEventListener("change", markerPairNumberInputHandler);
        speedInputLabel = document.getElementById("speed-input-label");
        speedInput = document.getElementById("speed-input");
        cropInputLabel = document.getElementById("crop-input-label");
        cropInput = document.getElementById("crop-input");
        cropAspectRatioSpan = document.getElementById("crop-aspect-ratio");
        enableZoomPanInput = document.getElementById("enable-zoom-pan-input");
        isSettingsEditorOpen = true;
        wasGlobalSettingsEditorOpen = false;
        if (isForceSetSpeedOn) updateSpeedInputLabel(`Speed (${forceSetSpeedValue.toFixed(2)})`);
        highlightModifiedSettings(inputConfigs, markerPair);
        highlightModifiedSettings(overrideInputConfigs, markerPair.overrides);
    }
    function markerPairNumberInputHandler(e) {
        const markerPair = markerPairs[prevSelectedMarkerPairIndex];
        const startNumbering = markerPair.startNumbering;
        const endNumbering = markerPair.endNumbering;
        const newIdx = e.target.value - 1;
        markerPairs.splice(newIdx, 0, ...markerPairs.splice(prevSelectedMarkerPairIndex, 1));
        let targetMarkerRect = markersSvg.children[newIdx * 2];
        let targetStartNumbering = startMarkerNumberings.children[newIdx];
        let targetEndNumbering = endMarkerNumberings.children[newIdx];
        // if target succeedes current marker pair, move pair after target
        if (newIdx > prevSelectedMarkerPairIndex) {
            targetMarkerRect = targetMarkerRect.nextElementSibling.nextElementSibling;
            targetStartNumbering = targetStartNumbering.nextElementSibling;
            targetEndNumbering = targetEndNumbering.nextElementSibling;
        }
        const prevSelectedStartMarker = prevSelectedEndMarker.previousElementSibling;
        // if target precedes current marker pair, move pair before target
        markersSvg.insertBefore(prevSelectedStartMarker, targetMarkerRect);
        markersSvg.insertBefore(prevSelectedEndMarker, targetMarkerRect);
        startMarkerNumberings.insertBefore(startNumbering, targetStartNumbering);
        endMarkerNumberings.insertBefore(endNumbering, targetEndNumbering);
        renumberMarkerPairs();
        prevSelectedMarkerPairIndex = newIdx;
    }
    function highlightModifiedSettings(inputs, target) {
        if (isSettingsEditorOpen) {
            const markerPairSettingsLabelHighlight = "marker-pair-settings-editor-highlighted-label";
            const globalSettingsLabelHighlight = "global-settings-editor-highlighted-label";
            const inheritedSettingsLabelHighlight = "inherited-settings-highlighted-label";
            let markerPair;
            if (!wasGlobalSettingsEditorOpen && prevSelectedMarkerPairIndex != null) markerPair = markerPairs[prevSelectedMarkerPairIndex];
            inputs.forEach((input)=>{
                const [id, targetProperty, valueType] = input;
                const inputElem = document.getElementById(id);
                const storedTargetValue = target[targetProperty];
                let label = inputElem.previousElementSibling;
                if (id === "rotate-90-clock" || id === "rotate-90-counterclock") label = inputElem.parentElement.getElementsByTagName("span")[0];
                if (storedTargetValue == null) inputElem.classList.add(inheritedSettingsLabelHighlight);
                else inputElem.classList.remove(inheritedSettingsLabelHighlight);
                let shouldRemoveHighlight = storedTargetValue == null || storedTargetValue === "" || valueType === "bool" && storedTargetValue === false;
                if (target === settings) shouldRemoveHighlight ||= id === "title-suffix-input" && storedTargetValue == `[${settings.videoID}]` || id === "speed-input" && storedTargetValue === 1 || id === "crop-input" && (storedTargetValue === "0:0:iw:ih" || storedTargetValue === `0:0:${settings.cropResWidth}:${settings.cropResHeight}`) || id === "rotate-0";
                if (shouldRemoveHighlight) {
                    label.classList.remove(globalSettingsLabelHighlight);
                    label.classList.remove(markerPairSettingsLabelHighlight);
                    return;
                }
                if (target === settings) label.classList.add(globalSettingsLabelHighlight);
                else {
                    let settingsProperty = targetProperty;
                    if (targetProperty === "speed") settingsProperty = "newMarkerSpeed";
                    if (targetProperty === "crop") settingsProperty = "newMarkerCrop";
                    let globalValue = settings[settingsProperty];
                    let shouldApplyGlobalHighlight = storedTargetValue === globalValue;
                    if (targetProperty === "crop") {
                        shouldApplyGlobalHighlight = cropStringsEqual(storedTargetValue, globalValue);
                        shouldApplyGlobalHighlight = shouldApplyGlobalHighlight && isStaticCrop(markerPair.cropMap);
                    }
                    if (shouldApplyGlobalHighlight) {
                        label.classList.add(globalSettingsLabelHighlight);
                        label.classList.remove(markerPairSettingsLabelHighlight);
                    } else {
                        label.classList.add(markerPairSettingsLabelHighlight);
                        label.classList.remove(globalSettingsLabelHighlight);
                    }
                }
            });
        }
    }
    function enableMarkerHotkeys(endMarker) {
        markerHotkeysEnabled = true;
        enableMarkerHotkeys.endMarker = endMarker;
        enableMarkerHotkeys.startMarker = endMarker.previousSibling;
    }
    function moveMarker(marker, newTime, storeHistory = true, adjustCharts = true) {
        const type = marker.getAttribute("type");
        const idx = parseInt(marker.getAttribute("data-idx")) - 1;
        const markerPair = markerPairs[idx];
        const toTime = newTime != null ? newTime : video.getCurrentTime();
        if (type === "start" && toTime >= markerPair.end) {
            (0, _util.flashMessage)("Start marker cannot be placed after or at end marker", "red");
            return;
        }
        if (type === "end" && toTime <= markerPair.start) {
            (0, _util.flashMessage)("End marker cannot be placed before or at start marker", "red");
            return;
        }
        const initialState = (0, _undoredo.getMarkerPairHistory)(markerPair);
        const draft = (0, _immer.createDraft)(initialState);
        const lastState = (0, _undoredo.peekLastState)(markerPair.undoredo);
        const isStretch = type === "start" ? toTime <= lastState.start : toTime >= lastState.end;
        draft[type] = toTime;
        if (adjustCharts) {
            if (isStretch) {
                draft.speedMap = stretchPointMap(draft, draft.speedMap, "speed", toTime, type);
                draft.cropMap = stretchPointMap(draft, draft.cropMap, "crop", toTime, type);
            } else {
                draft.speedMap = shrinkPointMap(draft, draft.speedMap, "speed", toTime, type);
                draft.cropMap = shrinkPointMap(draft, draft.cropMap, "crop", toTime, type);
            }
        }
        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair, storeHistory);
        renderSpeedAndCropUI(adjustCharts, adjustCharts);
    }
    function stretchPointMap(draft, pointMap, pointType, toTime, type) {
        const maxIndex = pointMap.length - 1;
        const [sectStart, sectEnd] = type === "start" ? [
            0,
            1
        ] : [
            maxIndex - 1,
            maxIndex
        ];
        const leftPoint = pointMap[sectStart];
        const rightPoint = pointMap[sectEnd];
        const targetPoint = type === "start" ? leftPoint : rightPoint;
        const isSectionStatic = pointType === "crop" ? cropStringsEqual(leftPoint.crop, rightPoint.crop) : leftPoint.y === rightPoint.y;
        if (isSectionStatic) targetPoint.x = toTime;
        else {
            const targetPointCopy = (0, _lodashClonedeepDefault.default)(targetPoint);
            targetPointCopy.x = toTime;
            type === "start" ? pointMap.unshift(targetPointCopy) : pointMap.push(targetPointCopy);
        }
        return pointMap;
    }
    function shrinkPointMap(draft, pointMap, pointType, toTime, type) {
        const maxIndex = pointMap.length - 1;
        const searchPoint = {
            x: toTime,
            y: 0,
            crop: ""
        };
        let [sectStart, sectEnd] = (0, _util.bsearch)(pointMap, searchPoint, (0, _chartutil.sortX));
        if (sectStart <= 0) [sectStart, sectEnd] = [
            0,
            1
        ];
        else if (sectStart >= maxIndex) [sectStart, sectEnd] = [
            maxIndex - 1,
            maxIndex
        ];
        else [sectStart, sectEnd] = [
            sectStart,
            sectStart + 1
        ];
        const leftPoint = pointMap[sectStart];
        const rightPoint = pointMap[sectEnd];
        const targetPointIndex = type === "start" ? sectStart : sectEnd;
        const targetPoint = pointMap[targetPointIndex];
        if (pointType === "crop") {
            let toCropString = getInterpolatedCrop(leftPoint, rightPoint, toTime);
            let [x, y, w, h] = getCropComponents(targetPoint.crop);
            const toCrop = new (0, _crop.Crop)(x, y, w, h, settings.cropResWidth, settings.cropResHeight);
            toCrop.setCropStringSafe(toCropString, draft.enableZoomPan);
            targetPoint.crop = toCrop.cropString;
            setAspectRatioForAllPoints(toCrop.aspectRatio, pointMap, pointMap, targetPointIndex);
            if (type === "start") draft.crop = toCrop.cropString;
        } else {
            const speed = getInterpolatedSpeed(leftPoint, rightPoint, toTime);
            targetPoint.y = speed;
            if (type === "start") draft.speed = speed;
        }
        targetPoint.x = toTime;
        pointMap = pointMap.filter((point)=>{
            const keepPoint = point === targetPoint || (type === "start" ? point.x > toTime : point.x < toTime);
            return keepPoint;
        });
        return pointMap;
    }
    function renderMarkerPair(markerPair, markerPairIndex) {
        const startMarker = markersSvg.querySelector(`.start-marker[data-idx="${markerPairIndex + 1}"]`);
        const endMarker = markersSvg.querySelector(`.end-marker[data-idx="${markerPairIndex + 1}"]`);
        const startMarkerNumbering = startMarkerNumberings.children[markerPairIndex];
        const endMarkerNumbering = endMarkerNumberings.children[markerPairIndex];
        const startProgressPos = markerPair.start / (0, _util.getVideoDuration)(platform, video) * 100;
        const endProgressPos = markerPair.end / (0, _util.getVideoDuration)(platform, video) * 100;
        startMarker.setAttribute("x", `${startProgressPos}%`);
        startMarkerNumbering.setAttribute("x", `${startProgressPos}%`);
        selectedStartMarkerOverlay.setAttribute("x", `${startProgressPos}%`);
        endMarker.setAttribute("x", `${endProgressPos}%`);
        endMarkerNumbering.setAttribute("x", `${endProgressPos}%`);
        selectedEndMarkerOverlay.setAttribute("x", `${endProgressPos}%`);
        const startMarkerTimeSpan = document.getElementById(`start-time`);
        const endMarkerTimeSpan = document.getElementById(`end-time`);
        startMarkerTimeSpan.textContent = `${(0, _util.toHHMMSSTrimmed)(markerPair.start)}`;
        endMarkerTimeSpan.textContent = `${(0, _util.toHHMMSSTrimmed)(markerPair.end)}`;
        updateMarkerPairDuration(markerPair);
    }
    function updateCharts(markerPair, rerender = true) {
        const speedChart = speedChartInput.chart;
        if (speedChart) {
            speedChart.config.data.datasets[0].data = markerPair.speedMap;
            updateChartBounds(speedChart.config, markerPair.start, markerPair.end);
        }
        const cropChart = cropChartInput.chart;
        if (cropChart) {
            cropChart.config.data.datasets[0].data = markerPair.cropMap;
            updateChartBounds(cropChart.config, markerPair.start, markerPair.end);
        }
        if (rerender) rerenderCurrentChart();
    }
    function rerenderCurrentChart() {
        if (isCurrentChartVisible && currentChartInput && currentChartInput.chart) currentChartInput.chart.update();
    }
    const presetsMap = {
        videoStabilization: {
            Disabled: {
                desc: "Disabled",
                enabled: false
            },
            "Very Weak": {
                desc: "Very Weak",
                enabled: true,
                shakiness: 2,
                smoothing: 2,
                zoomspeed: 0.05
            },
            Weak: {
                desc: "Weak",
                enabled: true,
                shakiness: 4,
                smoothing: 4,
                zoomspeed: 0.1
            },
            Medium: {
                desc: "Medium",
                enabled: true,
                shakiness: 6,
                smoothing: 6,
                zoomspeed: 0.2
            },
            Strong: {
                desc: "Strong",
                enabled: true,
                shakiness: 8,
                smoothing: 10,
                zoomspeed: 0.3
            },
            "Very Strong": {
                desc: "Very Strong",
                enabled: true,
                shakiness: 10,
                smoothing: 16,
                zoomspeed: 0.4
            },
            Strongest: {
                desc: "Strongest",
                enabled: true,
                shakiness: 10,
                smoothing: 22,
                zoomspeed: 0.5
            }
        },
        denoise: {
            Disabled: {
                enabled: false,
                desc: "Disabled"
            },
            "Very Weak": {
                enabled: true,
                lumaSpatial: 1,
                desc: "Very Weak"
            },
            Weak: {
                enabled: true,
                lumaSpatial: 2,
                desc: "Weak"
            },
            Medium: {
                enabled: true,
                lumaSpatial: 4,
                desc: "Medium"
            },
            Strong: {
                enabled: true,
                lumaSpatial: 6,
                desc: "Strong"
            },
            "Very Strong": {
                enabled: true,
                lumaSpatial: 8,
                desc: "Very Strong"
            }
        }
    };
    function updateSettingsValue(e, id, target, targetProperty, valueType, highlightable) {
        if (e.target.reportValidity()) {
            const prevValue = e.target.value;
            let newValue = e.target.value;
            if (newValue != null) {
                if (targetProperty !== "titleSuffix" && targetProperty !== "markerPairMergeList" && newValue === "") {
                    delete target[targetProperty];
                    newValue = undefined;
                } else if (valueType === "number") newValue = parseFloat(newValue);
                else if (valueType === "bool") {
                    if (newValue === "Enabled") newValue = true;
                    else if (newValue === "Disabled") newValue = false;
                } else if (valueType === "ternary" || valueType === "inheritableString") {
                    if (newValue === "Default" || newValue === "Inherit") {
                        delete target[targetProperty];
                        newValue = undefined;
                    } else if (newValue === "Enabled") newValue = true;
                    else if (newValue === "Disabled") newValue = false;
                } else if (valueType === "preset") {
                    if (newValue === "Inherit") {
                        delete target[targetProperty];
                        newValue = undefined;
                    } else newValue = presetsMap[targetProperty][newValue];
                }
            }
            if (![
                "crop",
                "enableZoomPan",
                "cropRes"
            ].includes(targetProperty)) target[targetProperty] = newValue;
            if (targetProperty === "newMarkerCrop") {
                const newCrop = transformCropWithPushBack(prevValue, newValue);
                updateCropString(newCrop, true);
            }
            if (targetProperty === "cropRes") {
                const { cropMultipleX, cropMultipleY, newWidth, newHeight } = getCropMultiples(settings.cropRes, newValue);
                settings.cropRes = newValue;
                settings.cropResWidth = newWidth;
                settings.cropResHeight = newHeight;
                (0, _crop.Crop)._minW = Math.round((0, _crop.Crop).minW * cropMultipleX);
                (0, _crop.Crop)._minH = Math.round((0, _crop.Crop).minH * cropMultipleY);
                multiplyAllCrops(cropMultipleX, cropMultipleY);
            }
            if (targetProperty === "crop") {
                const markerPair = target;
                setCropString(markerPair, newValue);
            }
            if (targetProperty === "speed") {
                const markerPair = markerPairs[prevSelectedMarkerPairIndex];
                updateMarkerPairSpeed(markerPair, newValue);
                renderSpeedAndCropUI();
            }
            if (targetProperty === "enableZoomPan") {
                const markerPair = markerPairs[prevSelectedMarkerPairIndex];
                const cropMap = markerPair.cropMap;
                const draft = (0, _immer.createDraft)((0, _undoredo.getMarkerPairHistory)(markerPair));
                const cropString = cropMap[0, _cropChartSpec.currentCropPointIndex].crop;
                const enableZoomPan = newValue;
                const cropRes = settings.cropRes;
                if (!enableZoomPan && (0, _crop.isVariableSize)(cropMap, cropRes)) {
                    video.pause();
                    const { minSizeW, minSizeH, maxSizeW, maxSizeH, avgSizeW, avgSizeH } = (0, _crop.getMinMaxAvgCropPoint)(cropMap, cropRes);
                    const crop = (0, _crop.Crop).fromCropString(cropString, settings.cropRes);
                    const tooltip = (0, _tooltips.Tooltips).zoomPanToPanOnlyTooltip(minSizeW, minSizeH, maxSizeW, maxSizeH, avgSizeW, avgSizeH);
                    const desiredSize = prompt(tooltip, "s");
                    let w;
                    let h;
                    switch(desiredSize){
                        case "s":
                            [w, h] = [
                                minSizeW,
                                minSizeH
                            ];
                            break;
                        case "l":
                            [w, h] = [
                                maxSizeW,
                                maxSizeH
                            ];
                            break;
                        case "a":
                            [w, h] = [
                                avgSizeW,
                                avgSizeH
                            ];
                            break;
                        case null:
                            (0, _util.flashMessage)("Zoompan not disabled (canceled).", "olive");
                            e.target.value = "Enabled";
                            return;
                        default:
                            (0, _util.flashMessage)("Zoompan not disabled. Please enter 's' for smallest, 'l' for largest, or 'a' for average.", "red");
                            e.target.value = "Enabled";
                            return;
                    }
                    draft.enableZoomPan = false;
                    (0, _undoredo.saveMarkerPairHistory)(draft, markerPair, false);
                    crop.setCropStringSafe((0, _util.getCropString)(crop.x, crop.y, w, h));
                    setCropString(markerPair, crop.cropString, true);
                    (0, _util.flashMessage)(`Zoompan disabled. All crop points set to size ${w}x${h}.`, "green");
                } else {
                    draft.enableZoomPan = enableZoomPan;
                    (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
                    renderSpeedAndCropUI();
                }
            }
        }
        if (highlightable) highlightModifiedSettings([
            [
                id,
                targetProperty,
                valueType
            ]
        ], target);
    }
    function setCropString(markerPair, newCrop, forceCropConstraints = false) {
        const prevCrop = markerPair.cropMap[0, _cropChartSpec.currentCropPointIndex].crop;
        const { isDynamicCrop, enableZoomPan, initCropMap } = getCropMapProperties();
        const shouldMaintainCropAspectRatio = enableZoomPan && isDynamicCrop;
        const crop = transformCropWithPushBack(prevCrop, newCrop, shouldMaintainCropAspectRatio);
        updateCropString(crop, true, forceCropConstraints, initCropMap);
    }
    function getCropMultiples(oldCropRes, newCropRes) {
        const [oldWidth, oldHeight] = oldCropRes.split("x").map((str)=>parseInt(str), 10);
        const [newWidth, newHeight] = newCropRes.split("x").map((str)=>parseInt(str), 10);
        const cropMultipleX = newWidth / oldWidth;
        const cropMultipleY = newHeight / oldHeight;
        return {
            cropMultipleX,
            cropMultipleY,
            newWidth,
            newHeight
        };
    }
    function multiplyAllCrops(cropMultipleX, cropMultipleY) {
        const cropString = settings.newMarkerCrop;
        const multipliedCropString = multiplyCropString(cropMultipleX, cropMultipleY, cropString);
        settings.newMarkerCrop = multipliedCropString;
        setCropInputValue(multipliedCropString);
        markerPairs.forEach((markerPair)=>{
            multiplyMarkerPairCrops(markerPair, cropMultipleX, cropMultipleY);
        });
    }
    function multiplyMarkerPairCrops(markerPair, cropMultipleX, cropMultipleY) {
        markerPair.cropRes = settings.cropRes;
        const draft = (0, _immer.createDraft)((0, _undoredo.getMarkerPairHistory)(markerPair));
        draft.cropMap.forEach((cropPoint, idx)=>{
            const multipliedCropString = multiplyCropString(cropMultipleX, cropMultipleY, cropPoint.crop);
            cropPoint.crop = multipliedCropString;
            if (idx === 0) draft.crop = multipliedCropString;
        });
        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair, false);
    }
    function multiplyCropString(cropMultipleX, cropMultipleY, cropString) {
        let [x, y, w, h] = cropString.split(":");
        x = Math.round(x * cropMultipleX);
        y = Math.round(y * cropMultipleY);
        w = w !== "iw" ? Math.round(w * cropMultipleX) : w;
        h = h !== "ih" ? Math.round(h * cropMultipleY) : h;
        const multipliedCropString = [
            x,
            y,
            w,
            h
        ].join(":");
        return multipliedCropString;
    }
    function getMarkerPairMergeListDurations(markerPairMergeList = settings.markerPairMergeList) {
        const durations = [];
        for (let merge of markerPairMergeList.split(";")){
            let duration = 0;
            for (let mergeRange of merge.split(","))if (mergeRange.includes("-")) {
                let [mergeRangeStart, mergeRangeEnd] = mergeRange.split("-").map((str)=>parseInt(str, 10) - 1);
                if (mergeRangeStart > mergeRangeEnd) [mergeRangeStart, mergeRangeEnd] = [
                    mergeRangeEnd,
                    mergeRangeStart
                ];
                for(let idx = mergeRangeStart; idx <= mergeRangeEnd; idx++)if (!isNaN(idx) && idx >= 0 && idx < markerPairs.length) {
                    const marker = markerPairs[idx];
                    duration += (marker.end - marker.start) / marker.speed;
                }
            } else {
                const idx = parseInt(mergeRange, 10) - 1;
                if (!isNaN(idx) && idx >= 0 && idx < markerPairs.length) {
                    const marker = markerPairs[idx];
                    duration += (marker.end - marker.start) / marker.speed;
                }
            }
            durations.push(duration);
        }
        const markerPairMergelistDurations = durations.map((0, _util.toHHMMSSTrimmed)).join(" ; ");
        return markerPairMergelistDurations;
    }
    function addCropInputHotkeys() {
        cropInput.addEventListener("keydown", (ke)=>{
            if (ke.code === "Space" || !ke.ctrlKey && !ke.altKey && 66 <= ke.which && ke.which <= 90 && !(ke.code === "KeyI" || ke.code === "KeyW" || ke.code === "KeyH") || ke.which === 65 && (ke.ctrlKey || ke.altKey) // blur on KeyA with ctrl or alt modifiers
            ) {
                (0, _util.blockEvent)(ke);
                cropInput.blur();
                (0, _util.flashMessage)("Auto blurred crop input focus", "olive");
                return;
            }
            if (ke.code === "ArrowUp" || ke.code === "ArrowDown" || ke.code === "KeyA" && !ke.ctrlKey && !ke.altKey) {
                (0, _util.blockEvent)(ke);
                let cropString = cropInput.value;
                let cropStringArray = cropString.split(":");
                const initialCropArray = getCropComponents(cropString);
                let cropArray = [
                    ...initialCropArray
                ];
                const cropStringCursorPos = ke.target.selectionStart;
                let cropComponentCursorPos = cropStringCursorPos;
                let cropTarget = 0;
                while(cropComponentCursorPos - (cropStringArray[cropTarget].length + 1) >= 0){
                    cropComponentCursorPos -= cropStringArray[cropTarget].length + 1;
                    cropTarget++;
                }
                const isValidCropTarget = cropTarget >= 0 && cropTarget <= cropArray.length - 1 && typeof cropArray[cropTarget] === "number";
                if (!isValidCropTarget) return;
                if (ke.code === "KeyA" && !wasGlobalSettingsEditorOpen) {
                    const markerPair = markerPairs[prevSelectedMarkerPairIndex];
                    const initState = (0, _undoredo.getMarkerPairHistory)(markerPair);
                    const draft = (0, _immer.createDraft)(initState);
                    const draftCropMap = draft.cropMap;
                    const { enableZoomPan } = getCropMapProperties();
                    const [ix, iy, iw, ih] = initialCropArray;
                    if (cropTarget === 0 || cropTarget === 1 || enableZoomPan && (cropTarget === 2 || cropTarget === 3)) {
                        draftCropMap.forEach((cropPoint, idx)=>{
                            if (!ke.shiftKey && idx <= (0, _cropChartSpec.currentCropPointIndex) || ke.shiftKey && idx >= (0, _cropChartSpec.currentCropPointIndex)) return;
                            let [x, y, w, h] = getCropComponents(cropPoint.crop);
                            if (cropTarget === 0) x = ix;
                            if (cropTarget === 1) y = iy;
                            if (cropTarget === 2 || cropTarget === 3) {
                                w = iw;
                                h = ih;
                            }
                            cropPoint.crop = [
                                x,
                                y,
                                w,
                                h
                            ].join(":");
                            if (idx === 0) draft.crop = cropPoint.crop;
                        });
                        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
                        renderSpeedAndCropUI();
                    }
                    const targetPointsMsg = `${ke.shiftKey ? "preceding" : "following"} point ${(0, _cropChartSpec.currentCropPointIndex) + 1}`;
                    if (cropTarget === 0) (0, _util.flashMessage)(`Updated X values of crop points ${targetPointsMsg} to ${ix}`, "green");
                    if (cropTarget === 1) (0, _util.flashMessage)(`Updated Y values crop points ${targetPointsMsg} Y values to ${iy}`, "green");
                    if (enableZoomPan && (cropTarget === 2 || cropTarget === 3)) (0, _util.flashMessage)(`Updated size of all crop points ${targetPointsMsg} to ${iw}x${ih}`, "green");
                    if (!enableZoomPan && (cropTarget === 2 || cropTarget === 3)) (0, _util.flashMessage)(`All crop points have the same size in pan-only mode`, "olive");
                } else if (ke.code === "ArrowUp" || ke.code === "ArrowDown") {
                    let changeAmount;
                    let [ix, iy, iw, ih] = getCropComponents(cropInput.value);
                    if (!ke.altKey && !ke.shiftKey) changeAmount = 10;
                    else if (ke.altKey && !ke.shiftKey) changeAmount = 1;
                    else if (!ke.altKey && ke.shiftKey) changeAmount = 50;
                    else if (ke.altKey && ke.shiftKey) changeAmount = 100;
                    const { isDynamicCrop, enableZoomPan } = getCropMapProperties();
                    const shouldMaintainCropAspectRatio = enableZoomPan && isDynamicCrop;
                    const cropResWidth = settings.cropResWidth;
                    const cropResHeight = settings.cropResHeight;
                    const crop = new (0, _crop.Crop)(ix, iy, iw, ih, cropResWidth, cropResHeight);
                    // without modifiers move crop x/y offset
                    // with ctrl key modifier expand/shrink crop width/height
                    if (cropTarget === 0) ke.code === "ArrowUp" ? crop.panX(changeAmount) : crop.panX(-changeAmount);
                    else if (cropTarget === 1) ke.code === "ArrowUp" ? crop.panY(changeAmount) : crop.panY(-changeAmount);
                    else {
                        let cursor;
                        if (cropTarget === 2) cursor = "e-resize";
                        if (cropTarget === 3) cursor = "s-resize";
                        if (ke.code === "ArrowDown") changeAmount = -changeAmount;
                        resizeCrop(crop, cursor, changeAmount, changeAmount, shouldMaintainCropAspectRatio);
                    }
                    const { initCropMap } = getCropMapProperties();
                    updateCropString(crop.cropString, true, false, initCropMap);
                    const updatedCropString = cropInput.value;
                    let newCursorPos = cropStringCursorPos - cropComponentCursorPos;
                    if (cropTarget === 3 && cropStringArray[3] === "ih") {
                        const cropStringLengthDelta = updatedCropString.length - cropString.length;
                        const cursorPosAdjustment = cropStringLengthDelta - cropComponentCursorPos;
                        newCursorPos += cursorPosAdjustment;
                    }
                    cropInput.selectionStart = newCursorPos;
                    cropInput.selectionEnd = newCursorPos;
                }
            }
        });
    }
    function addMarkerPairMergeListDurationsListener() {
        const markerPairMergeListInput = document.getElementById("merge-list-input");
        const markerPairMergeListDurationsSpan = document.getElementById("merge-list-durations");
        markerPairMergeListInput.addEventListener("change", ()=>{
            const markerPairMergelistDurations = getMarkerPairMergeListDurations();
            markerPairMergeListDurationsSpan.textContent = markerPairMergelistDurations;
        });
    }
    let shortcutsTableToggleButton;
    function injectToggleShortcutsTableButton() {
        shortcutsTableToggleButton = (0, _util.htmlToElement)(shortcutsTableToggleButtonHTML);
        shortcutsTableToggleButton.onclick = toggleShortcutsTable;
        if ([
            (0, _platforms.VideoPlatforms).weverse,
            (0, _platforms.VideoPlatforms).naver_tv
        ].includes(platform)) shortcutsTableToggleButton.classList.add("pzp-button", "pzp-subtitle-button", "pzp-pc-subtitle-button", "pzp-pc__subtitle-button");
        if ([
            (0, _platforms.VideoPlatforms).afreecatv
        ].includes(platform)) shortcutsTableToggleButton.classList.add("btn_statistics");
        if (platform === (0, _platforms.VideoPlatforms).yt_clipper) hooks.shortcutsTableButton.parentElement.insertBefore(shortcutsTableToggleButton, hooks.shortcutsTableButton);
        else hooks.shortcutsTableButton.insertAdjacentElement("afterbegin", shortcutsTableToggleButton);
    }
    function showShortcutsTableToggleButton() {
        if (shortcutsTableToggleButton) shortcutsTableToggleButton.style.display = "inline-block";
    }
    function hideShortcutsTableToggleButton() {
        if (shortcutsTableToggleButton) shortcutsTableToggleButton.style.display = "none";
    }
    let shortcutsTableContainer;
    function toggleShortcutsTable() {
        if (!shortcutsTableContainer) {
            (0, _util.injectCSS)(shortcutsTableStyle, "shortcutsTableStyle");
            shortcutsTableContainer = document.createElement("div");
            shortcutsTableContainer.setAttribute("id", "shortcutsTableContainer");
            (0, _util.safeSetInnerHtml)(shortcutsTableContainer, shortcutsTableHTML);
            hooks.shortcutsTable.insertAdjacentElement("beforebegin", shortcutsTableContainer);
        } else if (shortcutsTableContainer.style.display !== "none") shortcutsTableContainer.style.display = "none";
        else shortcutsTableContainer.style.display = "block";
    }
    const frameCaptureViewerHeadHTML = `
      <title>yt_clipper Frame Capture Viewer</title>
      <style>
        body {
          margin: 0px;
          text-align: center;
        }
        #frames-div {
          font-family: Helvetica;
          background-color: rgb(160,50,20);
          margin: 0 auto;
          padding: 2px;
          width: 99%;
          text-align: center;
        }
        .frame-div {
          margin: 2px;
          padding: 2px;
          border: 2px black solid;
          font-weight: bold;
          color: black;
          text-align: center;
        }
        figcaption {
          display: inline-block;
          margin: 2px;
        }
        button {
          display: inline-block;
          font-weight: bold;
          margin-bottom: 2px;
          cursor: pointer;
          border: 2px solid black;
          border-radius: 4px;
        }
        button.download {
          background-color: rgb(66, 134, 244);
        }
        button.delete {
          background-color: red;
        }
        button:hover {
          box-shadow: 2px 4px 4px 0 rgba(0,0,0,0.2);
        }
        canvas {
          display: block;
          margin: 0 auto;
          ${videoInfo.aspectRatio > 1 ? "width: 98%;" : "height: 96vh;"}
        }
        @keyframes flash {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }
        .flash-div {
          animation-name: flash;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }
        </style>
      `;
    const frameCaptureViewerBodyHTML = `\
        <div id="frames-div"><strong></strong></div>
        `;
    let frameCaptureViewerWindow;
    let frameCaptureViewerDoc;
    async function captureFrame() {
        const currentTime = video.getCurrentTime();
        for(let i = 0; i < video.buffered.length; i++){
            console.log(video.buffered.start(i), video.buffered.end(i));
            if (video.buffered.start(i) <= currentTime && currentTime <= video.buffered.end(i)) break;
            if (i === video.buffered.length - 1) {
                (0, _util.flashMessage)("Frame not captured. Video has not yet buffered the frame.", "red");
                return;
            }
        }
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        let resString;
        if (isSettingsEditorOpen) {
            const cropMultipleX = video.videoWidth / settings.cropResWidth;
            const cropMultipleY = video.videoHeight / settings.cropResHeight;
            if (!wasGlobalSettingsEditorOpen) {
                const idx = parseInt(prevSelectedEndMarker.getAttribute("data-idx"), 10) - 1;
                const markerPair = markerPairs[idx];
                resString = multiplyCropString(cropMultipleX, cropMultipleY, markerPair.crop);
            } else resString = multiplyCropString(cropMultipleX, cropMultipleY, settings.newMarkerCrop);
            const cropRes = (0, _crop.Crop).getMultipliedCropRes(settings.cropRes, cropMultipleX, cropMultipleY);
            const [x, y, w, h] = (0, _crop.Crop).getCropComponents(resString, cropRes);
            canvas.width = w;
            canvas.height = h;
            if (h > w) {
                canvas.style.height = "96vh";
                canvas.style.width = "auto";
            }
            context.drawImage(video, x, y, w, h, 0, 0, w, h);
            resString = `x${x}y${y}w${w}h${h}`;
        } else {
            resString = `x0y0w${video.videoWidth}h${video.videoHeight}`;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        }
        if (!frameCaptureViewerWindow || !frameCaptureViewerDoc || frameCaptureViewerWindow.closed) {
            frameCaptureViewerWindow = window.open("", "window", `height=${window.innerHeight}, width=${window.innerWidth}`);
            frameCaptureViewerDoc = frameCaptureViewerWindow.document;
            (0, _util.safeSetInnerHtml)(frameCaptureViewerDoc.head, frameCaptureViewerHeadHTML, true);
            (0, _util.safeSetInnerHtml)(frameCaptureViewerDoc.body, frameCaptureViewerBodyHTML, true);
        }
        const frameDiv = document.createElement("div");
        frameDiv.setAttribute("class", "frame-div");
        const frameCount = getFrameCount(currentTime);
        const frameFileName = `${settings.titleSuffix}-${resString}-@${currentTime}s(${(0, _util.toHHMMSSTrimmed)(currentTime).replace(":", ";")})-f${frameCount.frameNumber}(${frameCount.totalFrames})`;
        (0, _util.safeSetInnerHtml)(frameDiv, `
      <figcaption>Resolution: ${canvas.width}x${canvas.height} Name: ${frameFileName}</figcaption>
      <button class="download">Download Frame</button>
      <button class="delete">Delete Frame</button>
      `);
        canvas.fileName = `${frameFileName}.png`;
        frameDiv.appendChild(canvas);
        frameDiv.getElementsByClassName("download")[0].onclick = ()=>{
            canvas.toBlob((blob)=>(0, _fileSaver.saveAs)(blob, canvas.fileName));
        };
        frameDiv.getElementsByClassName("delete")[0].onclick = ()=>{
            frameDiv.setAttribute("class", "frame-div flash-div");
            setTimeout(()=>(0, _util.deleteElement)(frameDiv), 300);
        };
        const framesDiv = frameCaptureViewerDoc.getElementById("frames-div");
        framesDiv.appendChild(frameDiv);
        (0, _util.flashMessage)(`Captured frame: ${frameFileName}`, "green");
    }
    function getFrameCount(seconds) {
        let fps = getFPS(null);
        let frameNumber;
        let totalFrames;
        if (fps) {
            frameNumber = Math.floor(seconds * fps);
            totalFrames = Math.floor((0, _util.getVideoDuration)(platform, video) * fps);
        } else {
            frameNumber = "Unknown";
            totalFrames = "Unknown";
        }
        return {
            frameNumber,
            totalFrames
        };
    }
    function canvasBlobToPromise(canvas) {
        return new Promise((resolve)=>{
            canvas.toBlob((blob)=>resolve(blob));
        });
    }
    let isFrameCapturerZippingInProgress = false;
    function saveCapturedFrames() {
        if (isFrameCapturerZippingInProgress) {
            (0, _util.flashMessage)("Frame Capturer zipping already in progress. Please wait before trying to zip again.", "red");
            return;
        }
        if (!frameCaptureViewerWindow || frameCaptureViewerWindow.closed || !frameCaptureViewerDoc) {
            (0, _util.flashMessage)("Frame capturer not open. Please capture a frame before zipping.", "olive");
            return;
        }
        const zip = new (0, _jszipDefault.default)();
        const framesZip = zip.folder(settings.titleSuffix).folder("frames");
        const frames = frameCaptureViewerDoc.getElementsByTagName("canvas");
        if (frames.length === 0) {
            (0, _util.flashMessage)("No frames to zip.", "olive");
            return;
        }
        isFrameCapturerZippingInProgress = true;
        Array.from(frames).forEach((frame)=>{
            framesZip.file(frame.fileName, canvasBlobToPromise(frame), {
                binary: true
            });
        });
        const progressDiv = injectProgressBar("green", "Frame Capturer");
        const progressSpan = progressDiv.firstElementChild;
        zip.generateAsync({
            type: "blob"
        }, (metadata)=>{
            const percent = metadata.percent.toFixed(2) + "%";
            progressSpan.textContent = `Frame Capturer Zipping Progress: ${percent}`;
        }).then((blob)=>{
            (0, _fileSaver.saveAs)(blob, `${settings.titleSuffix}-frames.zip`);
            progressDiv.dispatchEvent(new Event("done"));
            isFrameCapturerZippingInProgress = false;
        });
    }
    function injectProgressBar(color, tag) {
        const progressDiv = document.createElement("div");
        progressDiv.setAttribute("class", "msg-div");
        progressDiv.addEventListener("done", ()=>{
            progressDiv.setAttribute("class", "msg-div flash-div");
            setTimeout(()=>(0, _util.deleteElement)(progressDiv), 2500);
        });
        (0, _util.safeSetInnerHtml)(progressDiv, `<span class="flash-msg" style="color:${color}"> ${tag} Zipping Progress: 0%</span>`);
        hooks.frameCapturerProgressBar.insertAdjacentElement("beforebegin", progressDiv);
        return progressDiv;
    }
    let cropDiv;
    let cropSvg;
    let cropDim;
    let cropRect;
    let cropRectBorder;
    let cropRectBorderBlack;
    let cropRectBorderWhite;
    let cropChartSectionStart;
    let cropChartSectionStartBorderGreen;
    let cropChartSectionStartBorderWhite;
    let cropChartSectionEnd;
    let cropChartSectionEndBorderYellow;
    let cropChartSectionEndBorderWhite;
    let cropCrossHair;
    let cropCrossHairXBlack;
    let cropCrossHairXWhite;
    let cropCrossHairYBlack;
    let cropCrossHairYWhite;
    let cropCrossHairs;
    function createCropOverlay(cropString) {
        deleteCropOverlay();
        cropDiv = document.createElement("div");
        cropDiv.setAttribute("id", "crop-div");
        (0, _util.safeSetInnerHtml)(cropDiv, `
        <svg id="crop-svg">
          <defs>
            <mask id="cropMask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect id="cropRect" x="0" y="0" width="100%" height="100%" fill="black" />
            </mask>
          </defs>
          <rect id="cropDim" mask="url(#cropMask)" x="0" y="0" width="100%" height="100%"
            fill="black" fill-opacity="${cropDims[cropDimIndex]}"
          />

          <g id="cropChartSectionStart" opacity="0.7" shape-rendering="geometricPrecision">
            <rect id="cropChartSectionStartBorderGreen" x="0" y="0" width="0%" height="0%" fill="none"
              stroke="lime" stroke-width="1px"
            />
            <rect id="cropChartSectionStartBorderWhite" x="0" y="0" width="0%" height="0%" fill="none"
              stroke="black" stroke-width="1px" stroke-dasharray="5 10"
            />
          </g>
          <g id="cropChartSectionEnd" opacity="0.7" shape-rendering="geometricPrecision">
            <rect id="cropChartSectionEndBorderYellow" x="0" y="0" width="0%" height="0%" fill="none"
              stroke="yellow" stroke-width="1px"
            />
            <rect id="cropChartSectionEndBorderWhite" x="0" y="0" width="0%" height="0%" fill="none"
              stroke="black" stroke-width="1px" stroke-dasharray="5 10"
            />
          </g>

          <g id="cropRectBorder" opacity="1" shape-rendering="geometricPrecision">
            <rect id="cropRectBorderBlack" x="0" y="0" width="100%" height="100%" fill="none"
              stroke="black" stroke-width="1px" stroke-opacity="0.8"
            />
            <rect id="cropRectBorderWhite" x="0" y="0" width="100%" height="100%" fill="none"
            stroke="white" stroke-width="1px" stroke-dasharray="5 5" stroke-opacity="0.8"
            >
            </rect>
            <g id="cropCrossHair" opacity="0.9" stroke="white" display="${cropCrossHairEnabled ? "block" : "none"}">
              <line id="cropCrossHairXBlack" x1="0" y1="50%" x2="100%" y2="50%" stroke="black" stroke-width="1px" type="x"/>
              <line id="cropCrossHairXWhite" x1="0" y1="50%" x2="100%" y2="50%" stroke-width="1px" stroke-dasharray="5 5" type="x"/>

              <line id="cropCrossHairYBlack" x1="50%" y1="0" x2="50%" y2="100%" stroke="black" stroke-width="1px" type="y"/>
              <line id="cropCrossHairYWhite" x1="50%" y1="0" x2="50%" y2="100%" stroke-width="1px" stroke-dasharray="5 5" type="y"/>
            </g>
          </g>
        </svg>
      `);
        resizeCropOverlay();
        hooks.cropOverlay.insertAdjacentElement("afterend", cropDiv);
        cropSvg = cropDiv.firstElementChild;
        cropDim = document.getElementById("cropDim");
        cropRect = document.getElementById("cropRect");
        cropRectBorder = document.getElementById("cropRectBorder");
        cropRectBorderBlack = document.getElementById("cropRectBorderBlack");
        cropRectBorderWhite = document.getElementById("cropRectBorderWhite");
        cropChartSectionStart = document.getElementById("cropChartSectionStart");
        cropChartSectionStartBorderGreen = document.getElementById("cropChartSectionStartBorderGreen");
        cropChartSectionStartBorderWhite = document.getElementById("cropChartSectionStartBorderWhite");
        cropChartSectionEnd = document.getElementById("cropChartSectionEnd");
        cropChartSectionEndBorderYellow = document.getElementById("cropChartSectionEndBorderYellow");
        cropChartSectionEndBorderWhite = document.getElementById("cropChartSectionEndBorderWhite");
        cropCrossHair = document.getElementById("cropCrossHair");
        cropCrossHairXBlack = document.getElementById("cropCrossHairXBlack");
        cropCrossHairXWhite = document.getElementById("cropCrossHairXWhite");
        cropCrossHairYBlack = document.getElementById("cropCrossHairYBlack");
        cropCrossHairYWhite = document.getElementById("cropCrossHairYWhite");
        cropCrossHairs = [
            cropCrossHairXBlack,
            cropCrossHairXWhite,
            cropCrossHairYBlack,
            cropCrossHairYWhite
        ];
        [
            cropRect,
            cropRectBorderBlack,
            cropRectBorderWhite
        ].map((cropRect)=>setCropOverlay(cropRect, cropString));
        cropCrossHairs.map((cropCrossHair)=>setCropCrossHair(cropCrossHair, cropString));
        isCropOverlayVisible = true;
    }
    function resizeCropOverlay() {
        requestAnimationFrame(forceRerenderCrop);
    }
    function forceRerenderCrop() {
        centerVideo();
        if (cropDiv) {
            const videoRect = video.getBoundingClientRect();
            const videoContainerRect = hooks.videoContainer.getBoundingClientRect();
            let { width, height, top, left } = videoRect;
            top = top - videoContainerRect.top;
            left = left - videoContainerRect.left;
            [width, height, top, left] = [
                width,
                height,
                top,
                left
            ].map((e)=>`${Math.floor(e)}px`);
            Object.assign(cropDiv.style, {
                width,
                height,
                top,
                left,
                position: "absolute"
            });
            if (cropSvg) cropSvg.setAttribute("width", "0");
            const cropString = getRelevantCropString();
            setCropOverlay(cropRect, cropString);
            setCropOverlay(cropRectBorder, cropString);
            setCropOverlay(cropRectBorderBlack, cropString);
            setCropOverlay(cropRectBorderWhite, cropString);
        }
    }
    function centerVideo() {
        const videoContainerRect = hooks.videoContainer.getBoundingClientRect();
        let width, height;
        if (rotation === 0) {
            height = videoContainerRect.height;
            width = height * videoInfo.aspectRatio;
            width = Math.floor(Math.min(width, videoContainerRect.width));
            height = Math.floor(width / videoInfo.aspectRatio);
        } else {
            width = videoContainerRect.height;
            height = width / videoInfo.aspectRatio;
            height = Math.floor(Math.min(height, videoContainerRect.width));
            width = Math.floor(height * videoInfo.aspectRatio);
        }
        let left = videoContainerRect.width / 2 - width / 2;
        let top = videoContainerRect.height / 2 - height / 2;
        [width, height, top, left] = [
            width,
            height,
            top,
            left
        ].map((e)=>`${Math.round(e)}px`);
        Object.assign(video.style, {
            width,
            height,
            top,
            left,
            position: "absolute"
        });
    }
    function setCropOverlay(cropRect, cropString) {
        const [x, y, w, h] = getCropComponents(cropString);
        setCropOverlayDimensions(cropRect, x, y, w, h);
    }
    function setCropOverlayDimensions(cropRect, inX, inY, inW, inH) {
        if (cropRect) {
            let x = inX / settings.cropResWidth * 100;
            let y = inY / settings.cropResHeight * 100;
            let w = inW / settings.cropResWidth * 100;
            let h = inH / settings.cropResHeight * 100;
            [x, y, w, h] = getRotatedCropComponents([
                x,
                y,
                w,
                h
            ], 100, 100);
            const cropRectAttrs = {
                x: `${x}%`,
                y: `${y}%`,
                width: `${w}%`,
                height: `${h}%`
            };
            (0, _util.setAttributes)(cropRect, cropRectAttrs);
        }
    }
    function setCropCrossHair(cropCrossHair, cropString) {
        const [x, y, w, h] = getRotatedCropComponents(getCropComponents(cropString));
        if (cropCrossHair) {
            const [x1M, x2M, y1M, y2M] = cropCrossHair.getAttribute("type") === "x" ? [
                0,
                1,
                0.5,
                0.5
            ] : [
                0.5,
                0.5,
                0,
                1
            ];
            let cropCrossHairAttrs = {
                x1: `${(x + x1M * w) / settings.cropResWidth * 100}%`,
                x2: `${(x + x2M * w) / settings.cropResWidth * 100}%`,
                y1: `${(y + y1M * h) / settings.cropResHeight * 100}%`,
                y2: `${(y + y2M * h) / settings.cropResHeight * 100}%`
            };
            if (rotation === 90 || rotation === -90) cropCrossHairAttrs = {
                x1: `${(x + x1M * w) / settings.cropResHeight * 100}%`,
                x2: `${(x + x2M * w) / settings.cropResHeight * 100}%`,
                y1: `${(y + y1M * h) / settings.cropResWidth * 100}%`,
                y2: `${(y + y2M * h) / settings.cropResWidth * 100}%`
            };
            (0, _util.setAttributes)(cropCrossHair, cropCrossHairAttrs);
        }
    }
    const cropDims = [
        0,
        0.25,
        0.5,
        0.75,
        0.9,
        1
    ];
    let cropDimIndex = 2;
    function cycleCropDimOpacity() {
        cropDimIndex = (cropDimIndex + 1) % cropDims.length;
        cropDim.setAttribute("fill-opacity", cropDims[cropDimIndex].toString());
    }
    function showCropOverlay() {
        if (cropSvg) {
            cropSvg.style.display = "block";
            isCropOverlayVisible = true;
        }
    }
    function hideCropOverlay() {
        if (isDrawingCrop) finishDrawingCrop(true);
        if (isMouseManipulatingCrop) endCropMouseManipulation(null, true);
        if (cropSvg) {
            cropSvg.style.display = "none";
            isCropOverlayVisible = false;
        }
    }
    function deleteCropOverlay() {
        const cropDiv = document.getElementById("crop-div");
        (0, _util.deleteElement)(cropDiv);
        isCropOverlayVisible = false;
    }
    function hidePlayerControls() {
        hooks.controls.originalDisplay = hooks.controls.originalDisplay ?? hooks.controls.style.display;
        hooks.controlsGradient.originalDisplay = hooks.controlsGradient.originalDisplay ?? hooks.controlsGradient.style.display;
        hooks.controls.style.display = "none";
        hooks.controlsGradient.style.display = "none";
    }
    function showPlayerControls() {
        hooks.controls.style.display = hooks.controls.originalDisplay;
        hooks.controlsGradient.style.display = hooks.controlsGradient.originalDisplay;
    }
    function getRelevantCropString() {
        if (!isSettingsEditorOpen) return null;
        if (!wasGlobalSettingsEditorOpen) return markerPairs[prevSelectedMarkerPairIndex].cropMap[0, _cropChartSpec.currentCropPointIndex].crop;
        else return settings.newMarkerCrop;
    }
    function getRelevantCropRect() {
        if (!isSettingsEditorOpen) return null;
        if (!updateDynamicCropOverlays) {
            if (!wasGlobalSettingsEditorOpen) return cropRect;
            else return;
        }
    }
    function addScrubVideoHandler() {
        hooks.cropMouseManipulation.addEventListener("pointerdown", scrubVideoHandler, {
            capture: true
        });
    }
    function scrubVideoHandler(e) {
        const isCropBlockingChartVisible = isCurrentChartVisible && currentChartInput && currentChartInput.type !== "crop";
        if (!e.ctrlKey && e.altKey && !e.shiftKey && !isMouseManipulatingCrop && !isDrawingCrop && !isCropBlockingChartVisible) {
            (0, _util.blockEvent)(e);
            document.addEventListener("click", blockVideoPause, {
                once: true,
                capture: true
            });
            const videoRect = video.getBoundingClientRect();
            let prevClickPosX = e.clientX - videoRect.left;
            let prevClickPosY = e.clientY - videoRect.top;
            const pointerId = e.pointerId;
            video.setPointerCapture(pointerId);
            const baseWidth = 1920;
            function dragHandler(e) {
                (0, _util.blockEvent)(e);
                const pixelRatio = window.devicePixelRatio;
                const widthMultiple = baseWidth / screen.width;
                const dragPosX = e.clientX - videoRect.left;
                const dragPosY = e.clientY - videoRect.top;
                const changeX = (dragPosX - prevClickPosX) * pixelRatio * widthMultiple;
                const seekBy = changeX * (1 / videoInfo.fps);
                (0, _util.seekBySafe)(video, seekBy);
                prevClickPosX = e.clientX - videoRect.left;
            }
            function endDragHandler(e) {
                (0, _util.blockEvent)(e);
                document.removeEventListener("pointermove", dragHandler);
                video.releasePointerCapture(pointerId);
            }
            document.addEventListener("pointermove", dragHandler);
            document.addEventListener("pointerup", endDragHandler, {
                once: true,
                capture: true
            });
        }
    }
    let isMouseManipulatingCrop = false;
    let endCropMouseManipulation;
    function ctrlOrCommand(e) {
        return e.ctrlKey || e.metaKey;
    }
    function addCropMouseManipulationListener() {
        hooks.cropMouseManipulation.addEventListener("pointerdown", cropMouseManipulationHandler, {
            capture: true
        });
        function cropMouseManipulationHandler(e) {
            const isCropBlockingChartVisible = isCurrentChartVisible && currentChartInput && currentChartInput.type !== "crop";
            if (ctrlOrCommand(e) && isSettingsEditorOpen && isCropOverlayVisible && !isDrawingCrop && !isCropBlockingChartVisible) {
                const cropString = getRelevantCropString();
                const [ix, iy, iw, ih] = getCropComponents(cropString);
                const cropResWidth = settings.cropResWidth;
                const cropResHeight = settings.cropResHeight;
                const videoRect = video.getBoundingClientRect();
                const clickPosX = e.clientX - videoRect.left;
                const clickPosY = e.clientY - videoRect.top;
                const cursor = getMouseCropHoverRegion(e, cropString);
                const pointerId = e.pointerId;
                const { isDynamicCrop, enableZoomPan, initCropMap } = getCropMapProperties();
                endCropMouseManipulation = (e, forceEnd = false)=>{
                    if (forceEnd) document.removeEventListener("pointerup", endCropMouseManipulation, {
                        capture: true
                    });
                    isMouseManipulatingCrop = false;
                    hooks.cropMouseManipulation.releasePointerCapture(pointerId);
                    if (!wasGlobalSettingsEditorOpen) {
                        const markerPair = markerPairs[prevSelectedMarkerPairIndex];
                        const draft = (0, _immer.createDraft)((0, _undoredo.getMarkerPairHistory)(markerPair));
                        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
                    }
                    renderSpeedAndCropUI();
                    document.removeEventListener("pointermove", dragCropHandler);
                    document.removeEventListener("pointermove", cropResizeHandler);
                    showPlayerControls();
                    if (!forceEnd && ctrlOrCommand(e)) {
                        if (cursor) hooks.cropMouseManipulation.style.cursor = cursor;
                        updateCropHoverCursor(e);
                        document.addEventListener("pointermove", cropHoverHandler, true);
                    } else hooks.cropMouseManipulation.style.removeProperty("cursor");
                    document.addEventListener("keyup", removeCropHoverListener, true);
                    document.addEventListener("keydown", addCropHoverListener, true);
                };
                if (!cursor) return;
                let cropResizeHandler;
                document.addEventListener("click", blockVideoPause, {
                    once: true,
                    capture: true
                });
                document.removeEventListener("pointermove", cropHoverHandler, true);
                document.removeEventListener("keydown", addCropHoverListener, true);
                document.removeEventListener("keyup", removeCropHoverListener, true);
                e.preventDefault();
                hooks.cropMouseManipulation.setPointerCapture(pointerId);
                if (cursor === "grab") {
                    hooks.cropMouseManipulation.style.cursor = "grabbing";
                    document.addEventListener("pointermove", dragCropHandler);
                } else {
                    cropResizeHandler = (e)=>getCropResizeHandler(e, cursor);
                    document.addEventListener("pointermove", cropResizeHandler);
                }
                document.addEventListener("pointerup", endCropMouseManipulation, {
                    once: true,
                    capture: true
                });
                hidePlayerControls();
                isMouseManipulatingCrop = true;
                function dragCropHandler(e) {
                    const shouldMaintainCropX = e.shiftKey;
                    const shouldMaintainCropY = e.altKey;
                    const dragPosX = e.clientX - videoRect.left;
                    const dragPosY = e.clientY - videoRect.top;
                    const changeX = dragPosX - clickPosX;
                    const changeY = dragPosY - clickPosY;
                    let changeXScaled = Math.round(changeX / videoRect.width * cropResWidth);
                    let changeYScaled = Math.round(changeY / videoRect.height * cropResHeight);
                    let crop = new (0, _crop.Crop)(ix, iy, iw, ih, cropResWidth, cropResHeight);
                    if (rotation === 90) {
                        changeXScaled = Math.round(changeX / videoRect.width * cropResHeight);
                        changeYScaled = Math.round(changeY / videoRect.height * cropResWidth);
                        crop = new (0, _crop.Crop)(cropResHeight - iy - ih, ix, ih, iw, cropResHeight, cropResWidth);
                    } else if (rotation === -90) {
                        changeXScaled = Math.round(changeX / videoRect.width * cropResHeight);
                        changeYScaled = Math.round(changeY / videoRect.height * cropResWidth);
                        crop = new (0, _crop.Crop)(iy, cropResWidth - ix - iw, ih, iw, cropResHeight, cropResWidth);
                    }
                    if (shouldMaintainCropX) changeXScaled = 0;
                    if (shouldMaintainCropY) changeYScaled = 0;
                    crop.panX(changeXScaled);
                    crop.panY(changeYScaled);
                    updateCropStringWithCrop(crop, false, false, initCropMap);
                }
                function getCropResizeHandler(e, cursor) {
                    const shouldMaintainCropAspectRatio = (!enableZoomPan || !isDynamicCrop) && e.altKey || enableZoomPan && isDynamicCrop && !e.altKey;
                    const dragPosX = e.clientX - videoRect.left;
                    const changeX = dragPosX - clickPosX;
                    const dragPosY = e.clientY - videoRect.top;
                    const changeY = dragPosY - clickPosY;
                    let changeXScaled = changeX / videoRect.width * settings.cropResWidth;
                    let changeYScaled = changeY / videoRect.height * settings.cropResHeight;
                    const shouldResizeCenterOut = e.shiftKey;
                    let crop = new (0, _crop.Crop)(ix, iy, iw, ih, cropResWidth, cropResHeight);
                    if (rotation === 90) {
                        changeXScaled = changeX / videoRect.width * cropResHeight;
                        changeYScaled = changeY / videoRect.height * cropResWidth;
                        crop = new (0, _crop.Crop)(cropResHeight - iy - ih, ix, ih, iw, cropResHeight, cropResWidth);
                    } else if (rotation === -90) {
                        changeXScaled = Math.round(changeX / videoRect.width * cropResHeight);
                        changeYScaled = Math.round(changeY / videoRect.height * cropResWidth);
                        crop = new (0, _crop.Crop)(iy, cropResWidth - ix - iw, ih, iw, cropResHeight, cropResWidth);
                    }
                    resizeCrop(crop, cursor, changeXScaled, changeYScaled, shouldMaintainCropAspectRatio, shouldResizeCenterOut);
                    updateCropStringWithCrop(crop, false, false, initCropMap);
                }
            }
        }
    }
    // mutates crop
    function resizeCrop(crop, cursor, deltaX, deltaY, shouldMaintainCropAspectRatio = false, shouldResizeCenterOut = false) {
        const isWResize = [
            "w-resize",
            "nw-resize",
            "sw-resize"
        ].includes(cursor);
        const isNResize = [
            "n-resize",
            "nw-resize",
            "ne-resize"
        ].includes(cursor);
        if (isWResize) deltaX = -deltaX;
        if (isNResize) deltaY = -deltaY;
        const isDiagonalResize = [
            "ne-resize",
            "se-resize",
            "sw-resize",
            "nw-resize"
        ].includes(cursor);
        if (shouldMaintainCropAspectRatio && shouldResizeCenterOut) crop.resizeNESWAspectRatioLocked(deltaY, deltaX);
        else if (shouldResizeCenterOut && isDiagonalResize) crop.resizeNESW(deltaY, deltaX);
        else switch(cursor){
            case "n-resize":
                shouldMaintainCropAspectRatio ? crop.resizeNAspectRatioLocked(deltaY) : shouldResizeCenterOut ? crop.resizeNS(deltaY) : crop.resizeN(deltaY);
                break;
            case "ne-resize":
                shouldMaintainCropAspectRatio ? crop.resizeNEAspectRatioLocked(deltaY, deltaX) : crop.resizeNE(deltaY, deltaX);
                break;
            case "e-resize":
                shouldMaintainCropAspectRatio ? crop.resizeEAspectRatioLocked(deltaX) : shouldResizeCenterOut ? crop.resizeEW(deltaX) : crop.resizeE(deltaX);
                break;
            case "se-resize":
                shouldMaintainCropAspectRatio ? crop.resizeSEAspectRatioLocked(deltaY, deltaX) : crop.resizeSE(deltaY, deltaX);
                break;
            case "s-resize":
                shouldMaintainCropAspectRatio ? crop.resizeSAspectRatioLocked(deltaY) : shouldResizeCenterOut ? crop.resizeNS(deltaY) : crop.resizeS(deltaY);
                break;
            case "sw-resize":
                shouldMaintainCropAspectRatio ? crop.resizeSWAspectRatioLocked(deltaY, deltaX) : crop.resizeSW(deltaY, deltaX);
                break;
            case "w-resize":
                shouldMaintainCropAspectRatio ? crop.resizeWAspectRatioLocked(deltaX) : shouldResizeCenterOut ? crop.resizeEW(deltaX) : crop.resizeW(deltaX);
                break;
            case "nw-resize":
                shouldMaintainCropAspectRatio ? crop.resizeNWAspectRatioLocked(deltaY, deltaX) : crop.resizeNW(deltaY, deltaX);
                break;
        }
    }
    function getClickPosScaled(e) {
        const videoRect = video.getBoundingClientRect();
        let { width, height, top, left } = videoRect;
        let clickPosX = e.clientX - left;
        let clickPosY = e.clientY - top;
        let clickPosXScaled = clickPosX / width * settings.cropResWidth;
        let clickPosYScaled = clickPosY / height * settings.cropResHeight;
        if (rotation === 90 || rotation === -90) {
            clickPosXScaled = clickPosX / width * settings.cropResHeight;
            clickPosYScaled = clickPosY / height * settings.cropResWidth;
        }
        return [
            clickPosXScaled,
            clickPosYScaled
        ];
    }
    function rotateCropComponentsClockWise(cropComponents, maxHeight) {
        if (maxHeight == null) maxHeight = settings.cropResHeight;
        let [x, y, w, h] = cropComponents;
        y = maxHeight - (y + h);
        [x, y, w, h] = [
            y,
            x,
            h,
            w
        ];
        return [
            x,
            y,
            w,
            h
        ];
    }
    function rotateCropComponentsCounterClockWise(cropComponents, maxWidth) {
        if (maxWidth == null) maxWidth = settings.cropResWidth;
        let [x, y, w, h] = cropComponents;
        x = maxWidth - (x + w);
        [x, y, w, h] = [
            y,
            x,
            h,
            w
        ];
        return [
            x,
            y,
            w,
            h
        ];
    }
    function getMouseCropHoverRegion(e, cropString) {
        cropString = cropString ?? getRelevantCropString();
        let [x, y, w, h] = getCropComponents(cropString);
        const [clickPosXScaled, clickPosYScaled] = getClickPosScaled(e);
        if (rotation === 90) [x, y, w, h] = rotateCropComponentsClockWise([
            x,
            y,
            w,
            h
        ]);
        else if (rotation === -90) [x, y, w, h] = rotateCropComponentsCounterClockWise([
            x,
            y,
            w,
            h
        ]);
        const slMultiplier = Math.min(settings.cropResWidth, settings.cropResHeight) / 1080;
        const sl = Math.ceil(Math.min(w, h) * slMultiplier * 0.1);
        const edgeOffset = 30 * slMultiplier;
        let cursor;
        let mouseCropColumn;
        if (x - edgeOffset < clickPosXScaled && clickPosXScaled < x + sl) mouseCropColumn = 1;
        else if (x + sl < clickPosXScaled && clickPosXScaled < x + w - sl) mouseCropColumn = 2;
        else if (x + w - sl < clickPosXScaled && clickPosXScaled < x + w + edgeOffset) mouseCropColumn = 3;
        let mouseCropRow;
        if (y - edgeOffset < clickPosYScaled && clickPosYScaled < y + sl) mouseCropRow = 1;
        else if (y + sl < clickPosYScaled && clickPosYScaled < y + h - sl) mouseCropRow = 2;
        else if (y + h - sl < clickPosYScaled && clickPosYScaled < y + h + edgeOffset) mouseCropRow = 3;
        const isMouseInCropCenter = mouseCropColumn === 2 && mouseCropRow === 2;
        const isMouseInCropN = mouseCropColumn === 2 && mouseCropRow === 1;
        const isMouseInCropNE = mouseCropColumn === 3 && mouseCropRow === 1;
        const isMouseInCropE = mouseCropColumn === 3 && mouseCropRow === 2;
        const isMouseInCropSE = mouseCropColumn === 3 && mouseCropRow === 3;
        const isMouseInCropS = mouseCropColumn === 2 && mouseCropRow === 3;
        const isMouseInCropSW = mouseCropColumn === 1 && mouseCropRow === 3;
        const isMouseInCropW = mouseCropColumn === 1 && mouseCropRow === 2;
        const isMouseInCropNW = mouseCropColumn === 1 && mouseCropRow === 1;
        if (isMouseInCropCenter) cursor = "grab";
        if (isMouseInCropN) cursor = "n-resize";
        if (isMouseInCropNE) cursor = "ne-resize";
        if (isMouseInCropE) cursor = "e-resize";
        if (isMouseInCropSE) cursor = "se-resize";
        if (isMouseInCropS) cursor = "s-resize";
        if (isMouseInCropSW) cursor = "sw-resize";
        if (isMouseInCropW) cursor = "w-resize";
        if (isMouseInCropNW) cursor = "nw-resize";
        return cursor;
    }
    let isDrawingCrop = false;
    let prevNewMarkerCrop = "0:0:iw:ih";
    let initDrawCropMap;
    let beginDrawHandler;
    function drawCrop() {
        if (isDrawingCrop) finishDrawingCrop(true);
        else if (isCurrentChartVisible && currentChartInput && currentChartInput.type !== "crop") (0, _util.flashMessage)("Please toggle off the speed chart before drawing crop", "olive");
        else if (isMouseManipulatingCrop) (0, _util.flashMessage)("Please finish dragging or resizing before drawing crop", "olive");
        else if (isSettingsEditorOpen && isCropOverlayVisible) {
            isDrawingCrop = true;
            ({ initCropMap: initDrawCropMap } = getCropMapProperties());
            prevNewMarkerCrop = settings.newMarkerCrop;
            (0, _crop.Crop).shouldConstrainMinDimensions = false;
            document.removeEventListener("keydown", addCropHoverListener, true);
            document.removeEventListener("pointermove", cropHoverHandler, true);
            hidePlayerControls();
            hooks.cropMouseManipulation.style.removeProperty("cursor");
            hooks.cropMouseManipulation.style.cursor = "crosshair";
            beginDrawHandler = (e)=>beginDraw(e);
            hooks.cropMouseManipulation.addEventListener("pointerdown", beginDrawHandler, {
                once: true,
                capture: true
            });
            (0, _util.flashMessage)("Begin drawing crop", "green");
        } else (0, _util.flashMessage)("Please open the global settings or a marker pair editor before drawing crop", "olive");
    }
    let drawCropHandler;
    let shouldFinishDrawMaintainAspectRatio = false;
    function beginDraw(e) {
        if (e.button === 0 && !drawCropHandler) {
            e.preventDefault();
            hooks.cropMouseManipulation.setPointerCapture(e.pointerId);
            const cropResWidth = settings.cropResWidth;
            const cropResHeight = settings.cropResHeight;
            const videoRect = video.getBoundingClientRect();
            const clickPosX = e.clientX - videoRect.left;
            const clickPosY = e.clientY - videoRect.top;
            const [clickPosXScaled, clickPosYScaled] = getClickPosScaled(e);
            const { isDynamicCrop, enableZoomPan } = getCropMapProperties();
            const prevCrop = !wasGlobalSettingsEditorOpen ? initDrawCropMap[0, _cropChartSpec.currentCropPointIndex].crop : prevNewMarkerCrop;
            const shouldMaintainCropAspectRatio = (!enableZoomPan || !isDynamicCrop) && e.altKey || enableZoomPan && isDynamicCrop && !e.altKey;
            shouldFinishDrawMaintainAspectRatio = shouldMaintainCropAspectRatio;
            // rotate aspect ratio in rotated mode?
            let [prevCropX, prevCropY, prevCropW, prevCropH] = getCropComponents(prevCrop);
            if (rotation === 90 || rotation === -90) [prevCropW, prevCropH] = [
                prevCropH,
                prevCropH
            ];
            const prevCropAspectRatio = prevCropW <= 0 || prevCropH <= 0 ? 1 : prevCropW / prevCropH;
            let crop = new (0, _crop.Crop)(clickPosXScaled, clickPosYScaled, (0, _crop.Crop).minW, (0, _crop.Crop).minH, cropResWidth, cropResHeight);
            if (rotation === 90 || rotation === -90) // We already rotated clickPosXScaled and clickPosYScaled, so we don't need to do it again here
            crop = new (0, _crop.Crop)(clickPosXScaled, clickPosYScaled, (0, _crop.Crop).minH, (0, _crop.Crop).minW, cropResHeight, cropResWidth);
            updateCropStringWithCrop(crop, false, false, initDrawCropMap);
            const { initCropMap: zeroCropMap } = getCropMapProperties();
            drawCropHandler = (e)=>{
                const shouldMaintainCropAspectRatio = (!enableZoomPan || !isDynamicCrop) && e.altKey || enableZoomPan && isDynamicCrop && !e.altKey;
                shouldFinishDrawMaintainAspectRatio = shouldMaintainCropAspectRatio;
                const shouldResizeCenterOut = e.shiftKey;
                const dragPosX = e.clientX - videoRect.left;
                const changeX = dragPosX - clickPosX;
                const dragPosY = e.clientY - videoRect.top;
                const changeY = dragPosY - clickPosY;
                let changeXScaled = changeX / videoRect.width * cropResWidth;
                let changeYScaled = changeY / videoRect.height * cropResHeight;
                let crop = new (0, _crop.Crop)(clickPosXScaled, clickPosYScaled, (0, _crop.Crop).minW, (0, _crop.Crop).minH, cropResWidth, cropResHeight);
                if (rotation === 90 || rotation === -90) {
                    changeXScaled = changeX / videoRect.width * cropResHeight;
                    changeYScaled = changeY / videoRect.height * cropResWidth;
                    crop = new (0, _crop.Crop)(clickPosXScaled, clickPosYScaled, (0, _crop.Crop).minH, (0, _crop.Crop).minW, cropResHeight, cropResWidth);
                }
                crop.defaultAspectRatio = prevCropAspectRatio;
                let cursor;
                if (changeXScaled >= 0 && changeYScaled < 0) cursor = "ne-resize";
                if (changeXScaled >= 0 && changeYScaled >= 0) cursor = "se-resize";
                if (changeXScaled < 0 && changeYScaled >= 0) cursor = "sw-resize";
                if (changeXScaled < 0 && changeYScaled < 0) cursor = "nw-resize";
                resizeCrop(crop, cursor, changeXScaled, changeYScaled, shouldMaintainCropAspectRatio, shouldResizeCenterOut);
                updateCropStringWithCrop(crop, false, false, zeroCropMap);
            };
            document.addEventListener("pointermove", drawCropHandler);
            document.addEventListener("pointerup", endDraw, {
                once: true,
                capture: true
            });
            // exact event listener reference only added once so remove not required
            document.addEventListener("click", blockVideoPause, {
                once: true,
                capture: true
            });
        } else finishDrawingCrop(true);
    }
    function blockVideoPause(e) {
        e.stopImmediatePropagation();
    }
    function endDraw(e) {
        if (e.button === 0) finishDrawingCrop(false, e.pointerId);
        else finishDrawingCrop(true, e.pointerId);
        if (ctrlOrCommand(e)) document.addEventListener("pointermove", cropHoverHandler, true);
    }
    function finishDrawingCrop(shouldRevertCrop, pointerId) {
        (0, _crop.Crop).shouldConstrainMinDimensions = true;
        if (pointerId != null) hooks.cropMouseManipulation.releasePointerCapture(pointerId);
        hooks.cropMouseManipulation.style.cursor = "auto";
        hooks.cropMouseManipulation.removeEventListener("pointerdown", beginDrawHandler, true);
        document.removeEventListener("pointermove", drawCropHandler);
        document.removeEventListener("pointerup", endDraw, true);
        drawCropHandler = null;
        isDrawingCrop = false;
        showPlayerControls();
        document.addEventListener("keydown", addCropHoverListener, true);
        if (wasGlobalSettingsEditorOpen) {
            if (shouldRevertCrop) settings.newMarkerCrop = prevNewMarkerCrop;
            else {
                const newCrop = transformCropWithPushBack(prevNewMarkerCrop, settings.newMarkerCrop, shouldFinishDrawMaintainAspectRatio);
                settings.newMarkerCrop = newCrop;
            }
            updateCropString(settings.newMarkerCrop, true);
        }
        if (!wasGlobalSettingsEditorOpen) {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const cropMap = markerPair.cropMap;
            if (shouldRevertCrop) {
                const draft = (0, _immer.createDraft)((0, _undoredo.getMarkerPairHistory)(markerPair));
                draft.cropMap = initDrawCropMap;
                (0, _undoredo.saveMarkerPairHistory)(draft, markerPair, false);
                renderSpeedAndCropUI();
            } else {
                const newCrop = transformCropWithPushBack(initDrawCropMap[0, _cropChartSpec.currentCropPointIndex].crop, cropMap[0, _cropChartSpec.currentCropPointIndex].crop, shouldFinishDrawMaintainAspectRatio);
                updateCropString(newCrop, true, false, initDrawCropMap);
            }
        }
        shouldRevertCrop ? (0, _util.flashMessage)("Drawing crop canceled", "red") : (0, _util.flashMessage)("Finished drawing crop", "green");
    }
    function transformCropWithPushBack(oldCrop, newCrop, shouldMaintainCropAspectRatio = false) {
        const [, , iw, ih] = getCropComponents(oldCrop);
        const [nx, ny, nw, nh] = getCropComponents(newCrop);
        const dw = nw - iw;
        const dh = nh - ih;
        const crop = (0, _crop.Crop).fromCropString((0, _util.getCropString)(0, 0, iw, ih), settings.cropRes);
        shouldMaintainCropAspectRatio ? crop.resizeSEAspectRatioLocked(dh, dw) : crop.resizeSE(dh, dw);
        crop.panX(nx);
        crop.panY(ny);
        return crop.cropString;
    }
    let cropCrossHairEnabled = false;
    function toggleCropCrossHair() {
        if (cropCrossHairEnabled) {
            (0, _util.flashMessage)("Disabled crop crosshair", "red");
            cropCrossHairEnabled = false;
            cropCrossHair && (cropCrossHair.style.display = "none");
        } else {
            (0, _util.flashMessage)("Enabled crop crosshair", "green");
            cropCrossHairEnabled = true;
            cropCrossHair && (cropCrossHair.style.display = "block");
            renderSpeedAndCropUI(false, false);
        }
    }
    let cropPreviewEnabled = false;
    function toggleCropPreview() {
        if (cropPreviewEnabled) {
            (0, _util.flashMessage)("Disabled crop preview", "red");
            cropPreviewEnabled = false;
            (0, _cropPreview.disableCropPreview)();
        } else {
            (0, _util.flashMessage)("Enabled crop preview", "green");
            cropPreviewEnabled = true;
            (0, _cropPreview.injectModal)(video, toggleCropPreview, getCropPreviewMouseTimeSetter);
            enableCropPreview();
        }
    }
    function enableCropPreview() {
        (0, _cropPreview.startDrawZoomedRegion)(getZoomRegion);
    }
    function getZoomRegion() {
        const dynamicCropComponents = getDynamicCropComponents();
        if (dynamicCropComponents == null) {
            const cropString = getRelevantCropString();
            const scaledCropComponents = getVideoScaledCropComponentsFromCropString(cropString);
            return scaledCropComponents;
        } else return getVideoScaledCropComponents(dynamicCropComponents);
    }
    let arrowKeyCropAdjustmentEnabled = false;
    function toggleArrowKeyCropAdjustment() {
        if (arrowKeyCropAdjustmentEnabled) {
            document.removeEventListener("keydown", arrowKeyCropAdjustmentHandler, true);
            (0, _util.flashMessage)("Disabled crop adjustment with arrow keys", "red");
            arrowKeyCropAdjustmentEnabled = false;
        } else {
            document.addEventListener("keydown", arrowKeyCropAdjustmentHandler, true);
            (0, _util.flashMessage)("Enabled crop adjustment with arrow keys", "green");
            arrowKeyCropAdjustmentEnabled = true;
        }
    }
    function arrowKeyCropAdjustmentHandler(ke) {
        if (isSettingsEditorOpen) {
            if (cropInput !== document.activeElement && [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight"
            ].indexOf(ke.code) > -1) {
                (0, _util.blockEvent)(ke);
                let [ix, iy, iw, ih] = getCropComponents(cropInput.value);
                let changeAmount;
                if (!ke.altKey && !ke.shiftKey) changeAmount = 10;
                else if (ke.altKey && !ke.shiftKey) changeAmount = 1;
                else if (!ke.altKey && ke.shiftKey) changeAmount = 50;
                else if (ke.altKey && ke.shiftKey) changeAmount = 100;
                const { isDynamicCrop, enableZoomPan, initCropMap } = getCropMapProperties();
                const shouldMaintainCropAspectRatio = enableZoomPan && isDynamicCrop;
                const cropResWidth = settings.cropResWidth;
                const cropResHeight = settings.cropResHeight;
                const crop = new (0, _crop.Crop)(ix, iy, iw, ih, cropResWidth, cropResHeight);
                // without modifiers move crop x/y offset
                // with ctrl key modifier expand/shrink crop width/height
                if (!ke.ctrlKey) switch(ke.code){
                    case "ArrowUp":
                        crop.panY(-changeAmount);
                        break;
                    case "ArrowDown":
                        crop.panY(changeAmount);
                        break;
                    case "ArrowLeft":
                        crop.panX(-changeAmount);
                        break;
                    case "ArrowRight":
                        crop.panX(changeAmount);
                        break;
                }
                else {
                    let cursor;
                    switch(ke.code){
                        case "ArrowUp":
                            cursor = "s-resize";
                            changeAmount = -changeAmount;
                            break;
                        case "ArrowDown":
                            cursor = "s-resize";
                            break;
                        case "ArrowLeft":
                            cursor = "e-resize";
                            changeAmount = -changeAmount;
                            break;
                        case "ArrowRight":
                            cursor = "e-resize";
                            break;
                    }
                    resizeCrop(crop, cursor, changeAmount, changeAmount, shouldMaintainCropAspectRatio);
                }
                updateCropString(crop.cropString, true, false, initCropMap);
            }
        }
    }
    function getCropMapProperties() {
        let isDynamicCrop = false;
        let enableZoomPan = false;
        let initCropMap = null;
        if (!wasGlobalSettingsEditorOpen) {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const cropMap = markerPair.cropMap;
            const draftCropMap = (0, _immer.createDraft)(cropMap);
            initCropMap = (0, _immer.finishDraft)(draftCropMap);
            isDynamicCrop = !isStaticCrop(cropMap) || cropMap.length === 2 && (0, _cropChartSpec.currentCropPointIndex) === 1;
            enableZoomPan = markerPair.enableZoomPan;
        }
        return {
            isDynamicCrop,
            enableZoomPan,
            initCropMap
        };
    }
    function getCropComponents(cropString) {
        if (!cropString && isSettingsEditorOpen) {
            if (!wasGlobalSettingsEditorOpen && prevSelectedMarkerPairIndex != null) cropString = markerPairs[prevSelectedMarkerPairIndex].crop;
            else cropString = settings.newMarkerCrop;
        }
        if (!cropString) {
            console.error("No valid crop string to extract components from.");
            cropString = "0:0:iw:ih";
        }
        const cropArray = cropString.split(":").map((cropStringComponent, i)=>{
            let cropComponent;
            if (cropStringComponent === "iw") cropComponent = settings.cropResWidth;
            else if (cropStringComponent === "ih") cropComponent = settings.cropResHeight;
            else if (i % 2 == 0) {
                cropComponent = parseFloat(cropStringComponent);
                cropComponent = Math.min(Math.round(cropComponent), settings.cropResWidth);
            } else {
                cropComponent = parseFloat(cropStringComponent);
                cropComponent = Math.min(Math.round(cropComponent), settings.cropResHeight);
            }
            return cropComponent;
        });
        return cropArray;
    }
    function getVideoScaledCropComponentsFromCropString(cropString) {
        const cropComponents = getCropComponents(cropString);
        return getVideoScaledCropComponents(cropComponents);
    }
    function getVideoScaledCropComponents(cropComponents) {
        const [x, y, w, h] = cropComponents;
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        return [
            videoWidth * (x / settings.cropResWidth),
            videoHeight * (y / settings.cropResHeight),
            videoWidth * (w / settings.cropResWidth),
            videoHeight * (h / settings.cropResHeight)
        ];
    }
    function getRotatedCropComponents(cropComponents, maxWidth, maxHeight) {
        let [x, y, w, h] = cropComponents;
        if (rotation === 90) [x, y, w, h] = rotateCropComponentsClockWise([
            x,
            y,
            w,
            h
        ], maxWidth);
        else if (rotation === -90) [x, y, w, h] = rotateCropComponentsCounterClockWise([
            x,
            y,
            w,
            h
        ], maxHeight);
        return [
            x,
            y,
            w,
            h
        ];
    }
    function getRotatedCropString(cropString) {
        let [x, y, w, h] = getCropComponents(cropString);
        [x, y, w, h] = getRotatedCropComponents([
            x,
            y,
            w,
            h
        ]);
        return (0, _util.getCropString)(x, y, w, h);
    }
    function getNumericCropString(cropString) {
        const [x, y, w, h] = getCropComponents(cropString);
        return (0, _util.getCropString)(x, y, w, h);
    }
    function updateCropStringWithCrop(crop, shouldRerenderCharts = false, forceCropConstraints = false, initCropMap) {
        let newCropString;
        if (rotation === 90) newCropString = crop.rotatedCropStringCounterClockWise;
        else if (rotation === -90) newCropString = crop.rotatedCropStringClockWise;
        else newCropString = crop.cropString;
        return updateCropString(newCropString, shouldRerenderCharts, forceCropConstraints, initCropMap);
    }
    function updateCropString(cropString, shouldRerenderCharts = false, forceCropConstraints = false, initCropMap) {
        if (!isSettingsEditorOpen) throw new Error("No editor was open when trying to update crop.");
        let draft;
        const [nx, ny, nw, nh] = getCropComponents(cropString);
        cropString = (0, _util.getCropString)(nx, ny, nw, nh);
        let wasDynamicCrop = false;
        let enableZoomPan = false;
        if (!wasGlobalSettingsEditorOpen) {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            enableZoomPan = markerPair.enableZoomPan;
            const initState = (0, _undoredo.getMarkerPairHistory)(markerPair);
            draft = (0, _immer.createDraft)(initState);
            if (initCropMap == null) throw new Error("No initial crop map given when modifying marker pair crop.");
            const draftCropMap = draft.cropMap;
            wasDynamicCrop = !isStaticCrop(initCropMap) || initCropMap.length === 2 && (0, _cropChartSpec.currentCropPointIndex) === 1;
            const draftCropPoint = draftCropMap[0, _cropChartSpec.currentCropPointIndex];
            const initCrop = initCropMap[0, _cropChartSpec.currentCropPointIndex].crop;
            if (initCrop == null) throw new Error("Init crop undefined.");
            draftCropPoint.crop = cropString;
            if (wasDynamicCrop) {
                if (!enableZoomPan || forceCropConstraints) setCropComponentForAllPoints({
                    w: nw,
                    h: nh
                }, draftCropMap, initCropMap);
                else if (enableZoomPan || forceCropConstraints) {
                    const aspectRatio = nw / nh;
                    setAspectRatioForAllPoints(aspectRatio, draftCropMap, initCropMap);
                }
            }
            const maxIndex = draftCropMap.length - 1;
            const isSecondLastPoint = (0, _cropChartSpec.currentCropPointIndex) === maxIndex - 1;
            const isLastSectionStatic = cropStringsEqual(initCrop, initCropMap[maxIndex].crop);
            if (isSecondLastPoint && isLastSectionStatic) draftCropMap[maxIndex].crop = cropString;
            draft.crop = draftCropMap[0].crop;
        } else settings.newMarkerCrop = cropString;
        if (!wasGlobalSettingsEditorOpen) {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            (0, _undoredo.saveMarkerPairHistory)(draft, markerPair, shouldRerenderCharts);
        }
        renderSpeedAndCropUI(shouldRerenderCharts);
    }
    function renderSpeedAndCropUI(rerenderCharts = true, updateCurrentCropPoint = false) {
        if (isSettingsEditorOpen) {
            if (!wasGlobalSettingsEditorOpen) {
                const markerPair = markerPairs[prevSelectedMarkerPairIndex];
                updateCharts(markerPair, rerenderCharts);
                // avoid updating current crop point unless crop map times have changed
                if (updateCurrentCropPoint) setCurrentCropPointWithCurrentTime();
                renderMarkerPair(markerPair, prevSelectedMarkerPairIndex);
                speedInput.value = markerPair.speed.toString();
                const cropMap = markerPair.cropMap;
                const crop = cropMap[0, _cropChartSpec.currentCropPointIndex].crop;
                const isDynamicCrop = !isStaticCrop(cropMap);
                renderCropForm(crop);
                if (!isDynamicCrop) renderStaticCropOverlay(crop);
                else updateDynamicCropOverlays(cropMap, video.getCurrentTime(), isDynamicCrop);
                const enableZoomPan = markerPair.enableZoomPan;
                enableZoomPanInput.value = enableZoomPan ? "Enabled" : "Disabled";
                const formatter = enableZoomPan ? (0, _cropChartSpec.cropPointFormatter) : (0, _cropChartSpec.cropPointXYFormatter);
                if (cropChartInput.chart) cropChartInput.chart.options.plugins.datalabels.formatter = formatter;
                else cropChartInput.chartSpec = (0, _cropChartSpec.getCropChartConfig)(enableZoomPan);
            } else {
                const crop = settings.newMarkerCrop;
                renderCropForm(crop);
                renderStaticCropOverlay(crop);
            }
            highlightSpeedAndCropInputs();
        }
    }
    function renderStaticCropOverlay(crop) {
        const [x, y, w, h] = getCropComponents(crop);
        [
            cropRect,
            cropRectBorderBlack,
            cropRectBorderWhite
        ].map((cropRect)=>setCropOverlayDimensions(cropRect, x, y, w, h));
        if (cropCrossHairEnabled && cropCrossHair) {
            cropCrossHairs.map((cropCrossHair)=>setCropCrossHair(cropCrossHair, (0, _util.getCropString)(x, y, w, h)));
            cropCrossHair.style.stroke = "white";
        }
    }
    function renderCropForm(crop) {
        const [x, y, w, h] = getCropComponents(crop);
        setCropInputValue(crop);
        const cropAspectRatio = (w / h).toFixed(13);
        cropAspectRatioSpan && (cropAspectRatioSpan.textContent = cropAspectRatio);
    }
    function highlightSpeedAndCropInputs() {
        if (wasGlobalSettingsEditorOpen) highlightModifiedSettings([
            [
                "crop-input",
                "newMarkerCrop",
                "string"
            ],
            [
                "speed-input",
                "newMarkerSpeed",
                "number"
            ]
        ], settings);
        else {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            highlightModifiedSettings([
                [
                    "crop-input",
                    "crop",
                    "string"
                ],
                [
                    "speed-input",
                    "speed",
                    "number"
                ],
                [
                    "enable-zoom-pan-input",
                    "enableZoomPan",
                    "bool"
                ]
            ], markerPair);
        }
    }
    function setCropComponentForAllPoints(newCrop, draftCropMap, initialCropMap) {
        draftCropMap.forEach((cropPoint, i)=>{
            if (i === (0, _cropChartSpec.currentCropPointIndex)) return;
            const initCrop = initialCropMap[i].crop;
            const [ix, iy, iw, ih] = getCropComponents(initCrop ?? cropPoint.crop);
            const nw = newCrop.w ?? iw;
            const nh = newCrop.h ?? ih;
            const nx = newCrop.x ?? (0, _util.clampNumber)(ix, 0, settings.cropResWidth - nw);
            const ny = newCrop.y ?? (0, _util.clampNumber)(iy, 0, settings.cropResHeight - nh);
            cropPoint.crop = `${nx}:${ny}:${nw}:${nh}`;
        });
    }
    function setAspectRatioForAllPoints(aspectRatio, draftCropMap, initialCropMap, referencePointIndex = (0, _cropChartSpec.currentCropPointIndex)) {
        (0, _crop.Crop).shouldConstrainMinDimensions = false;
        const cropResWidth = settings.cropResWidth;
        const cropResHeight = settings.cropResHeight;
        draftCropMap.forEach((cropPoint, i)=>{
            if (i === referencePointIndex) return;
            const initCrop = initialCropMap[i].crop;
            const [ix, iy, iw, ih] = getCropComponents(initCrop ?? cropPoint.crop);
            const crop = new (0, _crop.Crop)(0, 0, 0, 0, cropResWidth, cropResHeight);
            crop.defaultAspectRatio = aspectRatio;
            if (ih >= iw) crop.resizeSAspectRatioLocked(ih);
            else crop.resizeEAspectRatioLocked(iw);
            crop.panX(ix);
            crop.panY(iy);
            cropPoint.crop = crop.cropString;
        });
        (0, _crop.Crop).shouldConstrainMinDimensions = true;
    }
    function isStaticCrop(cropMap) {
        return cropMap.length === 2 && cropStringsEqual(cropMap[0].crop, cropMap[1].crop);
    }
    function cropStringsEqual(a, b) {
        const [ax, ay, aw, ah] = getCropComponents(a);
        const [bx, by, bw, bh] = getCropComponents(b);
        return ax === bx && ay === by && aw === bw && ah === bh;
    }
    function updateChart(type = "crop") {
        if (isCurrentChartVisible && currentChartInput && currentChartInput.chart && currentChartInput.type === type) currentChartInput.chart.update();
    }
    let speedChartInput = {
        chart: null,
        type: "speed",
        chartContainer: null,
        chartContainerId: "speedChartContainer",
        chartContainerHook: null,
        chartContainerHookPosition: "afterend",
        chartContainerStyle: "width: 100%; height: calc(100% - 20px); position: relative; z-index: 55; opacity:0.8;",
        chartCanvasHTML: `<canvas id="speedChartCanvas" width="1600px" height="900px"></canvas>`,
        chartSpec: (0, _speedChartSpec.speedChartSpec),
        chartCanvasId: "speedChartCanvas",
        minBound: 0,
        maxBound: 0,
        chartLoopKey: "speedChartLoop",
        dataMapKey: "speedMap"
    };
    let cropChartInput = {
        chart: null,
        type: "crop",
        chartContainer: null,
        chartContainerId: "cropChartContainer",
        chartContainerHook: null,
        chartContainerHookPosition: "beforebegin",
        chartContainerStyle: "display:flex",
        chartCanvasHTML: `<canvas id="cropChartCanvas" width="1600px" height="87px"></canvas>`,
        chartCanvasId: "cropChartCanvas",
        chartSpec: (0, _cropChartSpec.getCropChartConfig)(false),
        minBound: 0,
        maxBound: 0,
        chartLoopKey: "cropChartLoop",
        dataMapKey: "cropMap"
    };
    let currentChartInput;
    function initChartHooks() {
        speedChartInput.chartContainerHook = hooks.speedChartContainer;
        cropChartInput.chartContainerHook = hooks.cropChartContainer;
    }
    (0, _chartJs.Chart).helpers.merge((0, _chartJs.Chart).defaults.global, (0, _scatterChartSpec.scatterChartDefaults));
    function toggleChart(chartInput) {
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && prevSelectedMarkerPairIndex != null) {
            if (!chartInput.chart) {
                if (currentChartInput && isCurrentChartVisible) hideChart();
                currentChartInput = chartInput;
                initializeChartData(chartInput.chartSpec, chartInput.dataMapKey);
                chartInput.chartContainer = (0, _util.htmlToElement)(`
            <div
              id="${chartInput.chartContainerId}"
              style="${chartInput.chartContainerStyle}"
            ></div>
          `);
                (0, _util.safeSetInnerHtml)(chartInput.chartContainer, chartInput.chartCanvasHTML);
                chartInput.chartContainerHook.insertAdjacentElement(chartInput.chartContainerHookPosition, chartInput.chartContainer);
                chartInput.chart = new (0, _chartJs.Chart)(chartInput.chartCanvasId, chartInput.chartSpec);
                chartInput.chart.renderSpeedAndCropUI = renderSpeedAndCropUI;
                chartInput.chart.canvas.removeEventListener("wheel", chartInput.chart.$zoom._wheelHandler);
                const wheelHandler = chartInput.chart.$zoom._wheelHandler;
                chartInput.chart.$zoom._wheelHandler = (e)=>{
                    if (e.ctrlKey && !e.altKey && !e.shiftKey) wheelHandler(e);
                };
                chartInput.chart.ctx.canvas.addEventListener("wheel", chartInput.chart.$zoom._wheelHandler);
                chartInput.chart.ctx.canvas.addEventListener("contextmenu", (e)=>{
                    (0, _util.blockEvent)(e);
                }, true);
                chartInput.chart.ctx.canvas.addEventListener("pointerdown", getMouseChartTimeAnnotationSetter(chartInput), true);
                isCurrentChartVisible = true;
                isChartEnabled = true;
                updateChartTimeAnnotation();
                cropChartPreviewHandler();
            // console.log(chartInput.chart);
            } else {
                if (currentChartInput.type !== chartInput.type) {
                    hideChart();
                    currentChartInput = chartInput;
                }
                toggleCurrentChartVisibility();
                isChartEnabled = isCurrentChartVisible;
            }
        } else (0, _util.flashMessage)("Please open a marker pair editor before toggling a chart input.", "olive");
    }
    function getCropPreviewMouseTimeSetter(modalContainer) {
        function getSeekTime(e) {
            const rect = modalContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const scaledX = x / rect.width;
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const duration = markerPair.end - markerPair.start;
            const seekTime = markerPair.start + scaledX * duration;
            return seekTime;
        }
        return function seekHandler(e) {
            if (e.buttons !== 2) return;
            (0, _util.blockEvent)(e);
            // shift+right-click context menu opens screenshot tool in firefox 67.0.2
            function seekDragHandler(e) {
                const seekTime = (0, _util.timeRounder)(getSeekTime(e));
                if (Math.abs(video.getCurrentTime() - seekTime) >= 0.01) (0, _util.seekToSafe)(video, seekTime);
            }
            seekDragHandler(e);
            function seekDragEnd(e) {
                (0, _util.blockEvent)(e);
                modalContainer.releasePointerCapture(e.pointerId);
                document.removeEventListener("pointermove", seekDragHandler);
            }
            modalContainer.setPointerCapture(e.pointerId);
            document.addEventListener("pointermove", seekDragHandler);
            document.addEventListener("pointerup", seekDragEnd, {
                once: true
            });
            document.addEventListener("contextmenu", (0, _util.blockEvent), {
                once: true,
                capture: true
            });
        };
    }
    function getMouseChartTimeAnnotationSetter(chartInput) {
        return function mouseChartTimeAnnotationSetter(e) {
            if (e.buttons !== 2) return;
            (0, _util.blockEvent)(e);
            const chart = chartInput.chart;
            const chartLoop = markerPairs[prevSelectedMarkerPairIndex][chartInput.chartLoopKey];
            // shift+right-click context menu opens screenshot tool in firefox 67.0.2
            function chartTimeAnnotationDragHandler(e) {
                const time = (0, _util.timeRounder)(chart.scales["x-axis-1"].getValueForPixel(e.offsetX));
                chart.config.options.annotation.annotations[0].value = time;
                if (Math.abs(video.getCurrentTime() - time) >= 0.01) (0, _util.seekToSafe)(video, time);
                if (!e.ctrlKey && !e.altKey && e.shiftKey) {
                    chart.config.options.annotation.annotations[1].value = time;
                    chartLoop.start = time;
                    chart.update();
                } else if (!e.ctrlKey && e.altKey && !e.shiftKey) {
                    chart.config.options.annotation.annotations[2].value = time;
                    chartLoop.end = time;
                    chart.update();
                }
            }
            chartTimeAnnotationDragHandler(e);
            function chartTimeAnnotationDragEnd(e) {
                (0, _util.blockEvent)(e);
                chart.ctx.canvas.releasePointerCapture(e.pointerId);
                document.removeEventListener("pointermove", chartTimeAnnotationDragHandler);
            }
            chart.ctx.canvas.setPointerCapture(e.pointerId);
            document.addEventListener("pointermove", chartTimeAnnotationDragHandler);
            document.addEventListener("pointerup", chartTimeAnnotationDragEnd, {
                once: true
            });
            document.addEventListener("contextmenu", (0, _util.blockEvent), {
                once: true,
                capture: true
            });
        };
    }
    let easingMode = "linear";
    function toggleSpeedChartEasing(chartInput) {
        const chart = chartInput.chart;
        if (chart) {
            if (easingMode === "linear") {
                chart.data.datasets[0].lineTension = (0, _chartutil.cubicInOutTension);
                easingMode = "cubicInOut";
            } else {
                chart.data.datasets[0].lineTension = 0;
                easingMode = "linear";
            }
            chart.update();
        }
    }
    function toggleChartLoop() {
        if (currentChartInput && isCurrentChartVisible && prevSelectedMarkerPairIndex != null) {
            const chart = currentChartInput.chart;
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const chartLoop = markerPair[currentChartInput.chartLoopKey];
            if (chartLoop.enabled) {
                chartLoop.enabled = false;
                chart.config.options.annotation.annotations[1].borderColor = "rgba(0, 255, 0, 0.4)";
                chart.config.options.annotation.annotations[2].borderColor = "rgba(255, 215, 0, 0.4)";
                (0, _util.flashMessage)("Speed chart looping disabled", "red");
            } else {
                chartLoop.enabled = true;
                chart.config.options.annotation.annotations[1].borderColor = "rgba(0, 255, 0, 0.9)";
                chart.config.options.annotation.annotations[2].borderColor = "rgba(255, 215, 0, 0.9)";
                (0, _util.flashMessage)("Speed chart looping enabled", "green");
            }
            chart.update();
        }
    }
    function initializeChartData(chartConfig, dataMapKey) {
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && prevSelectedMarkerPairIndex != null) {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const dataMap = markerPair[dataMapKey];
            chartConfig.data.datasets[0].data = dataMap;
            updateChartBounds(chartConfig, markerPair.start, markerPair.end);
        }
    }
    function loadChartData(chartInput) {
        if (chartInput && chartInput.chart) {
            if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && prevSelectedMarkerPairIndex != null) {
                const markerPair = markerPairs[prevSelectedMarkerPairIndex];
                const dataMapKey = chartInput.dataMapKey;
                const dataMap = markerPair[dataMapKey];
                const chart = chartInput.chart;
                chart.data.datasets[0].data = dataMap;
                updateChartBounds(chart.config, markerPair.start, markerPair.end);
                if (isCurrentChartVisible && currentChartInput === chartInput) chart.update();
            }
        }
    }
    function updateChartBounds(chartConfig, start, end) {
        if (cropChartInput) {
            cropChartInput.minBound = start;
            cropChartInput.maxBound = end;
        }
        if (speedChartInput) {
            speedChartInput.minBound = start;
            speedChartInput.maxBound = end;
        }
        chartConfig.options.scales.xAxes[0].ticks.min = start;
        chartConfig.options.scales.xAxes[0].ticks.max = end;
        chartConfig.options.plugins.zoom.pan.rangeMin.x = start;
        chartConfig.options.plugins.zoom.pan.rangeMax.x = end;
        chartConfig.options.plugins.zoom.zoom.rangeMin.x = start;
        chartConfig.options.plugins.zoom.zoom.rangeMax.x = end;
    }
    let prevChartTime;
    function updateChartTimeAnnotation() {
        if (isCurrentChartVisible) {
            if (prevChartTime !== video.getCurrentTime()) {
                const time = video.getCurrentTime();
                prevChartTime = time;
                const chart = currentChartInput.chart;
                chart.config.options.annotation.annotations[0].value = (0, _util.clampNumber)(time, currentChartInput.minBound, currentChartInput.maxBound);
                const timeAnnotation = Object.values(chart.annotation.elements)[0];
                timeAnnotation.options.value = (0, _util.clampNumber)(time, currentChartInput.minBound, currentChartInput.maxBound);
                timeAnnotation.configure();
                chart.render();
            }
        }
        requestAnimationFrame(updateChartTimeAnnotation);
    }
    function toggleCropChartLooping() {
        if (!isCropChartLoopingOn) {
            isCropChartLoopingOn = true;
            (0, _util.flashMessage)("Dynamic crop looping enabled", "green");
        } else {
            isCropChartLoopingOn = false;
            (0, _util.flashMessage)("Dynamic crop looping  disabled", "red");
        }
    }
    function cropChartPreviewHandler() {
        const chart = cropChartInput.chart;
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && chart) {
            const chartData = chart?.data.datasets[0].data;
            const time = video.getCurrentTime();
            const isDynamicCrop = !isStaticCrop(chartData);
            const isCropChartVisible = currentChartInput && currentChartInput.type == "crop" && isCurrentChartVisible;
            if (shouldTriggerCropChartLoop || // assume auto time-based update not required for crop chart section if looping section
            isCropChartLoopingOn && isCropChartVisible || cropChartInput.chart && (isMouseManipulatingCrop || isDrawingCrop)) {
                shouldTriggerCropChartLoop = false;
                cropChartSectionLoop();
            } else if (isDynamicCrop) setCurrentCropPointWithCurrentTime();
            if (isDynamicCrop || (0, _cropChartSpec.currentCropPointIndex) > 0) cropInputLabel.textContent = `Crop Point ${(0, _cropChartSpec.currentCropPointIndex) + 1}`;
            else cropInputLabel.textContent = `Crop`;
            updateDynamicCropOverlays(chartData, time, isDynamicCrop);
        }
        video.requestVideoFrameCallback(cropChartPreviewHandler);
    }
    function setCurrentCropPointWithCurrentTime() {
        const cropChart = cropChartInput.chart;
        if (cropChart) {
            const chartData = cropChart.data.datasets[0].data;
            const time = video.getCurrentTime();
            const searchCropPoint = {
                x: time,
                y: 0,
                crop: ""
            };
            let [istart, iend] = (0, _cropChartSpec.currentCropChartSection);
            let [start, end] = (0, _util.bsearch)(chartData, searchCropPoint, (0, _chartutil.sortX));
            if ((0, _cropChartSpec.currentCropChartMode) === (0, _cropChartSpec.cropChartMode).Start) {
                if (start === end && end === iend) start--;
                (0, _cropChartSpec.setCurrentCropPoint)(cropChart, Math.min(start, chartData.length - 2));
            } else if ((0, _cropChartSpec.currentCropChartMode) === (0, _cropChartSpec.cropChartMode).End) {
                if (start === end && start === istart) end++;
                (0, _cropChartSpec.setCurrentCropPoint)(cropChart, Math.max(end, 1));
            }
        }
    }
    function getDynamicCropComponents() {
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen) {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const cropMap = markerPair.cropMap;
            const chartData = cropMap;
            const isDynamicCrop = !isStaticCrop(cropMap);
            if (!isDynamicCrop) return null;
            const sectStart = chartData[(0, _cropChartSpec.currentCropChartSection)[0]];
            const sectEnd = chartData[(0, _cropChartSpec.currentCropChartSection)[1]];
            return getEasedCropComponents(sectStart, sectEnd);
        }
        return null;
    }
    function getEasedCropComponents(sectStart, sectEnd) {
        const [startX, startY, startW, startH] = getCropComponents(sectStart.crop);
        const [endX, endY, endW, endH] = getCropComponents(sectEnd.crop);
        const currentTime = video.getCurrentTime();
        const clampedCurrentTime = (0, _util.clampNumber)(currentTime, sectStart.x, sectEnd.x);
        const easingFunc = sectEnd.easeIn == "instant" ? easeInInstant : (0, _d3Ease.easeSinInOut);
        const startTime = sectStart.x;
        const endTime = getFrameTimeBetweenLeftFrames(sectEnd.x);
        const [easedX, easedY, easedW, easedH] = [
            [
                startX,
                endX
            ],
            [
                startY,
                endY
            ],
            [
                startW,
                endW
            ],
            [
                startH,
                endH
            ]
        ].map((pair)=>(0, _util.getEasedValue)(easingFunc, pair[0], pair[1], startTime, endTime, clampedCurrentTime));
        return [
            easedX,
            easedY,
            easedW,
            easedH
        ];
    }
    // Hold the left point and then instantly transition to the right point once we reach it
    const easeInInstant = (timePercentage)=>{
        return timePercentage >= 1 ? 1 : 0;
    };
    function updateDynamicCropOverlays(chartData, currentTime, isDynamicCrop) {
        if (isDynamicCrop || (0, _cropChartSpec.currentCropPointIndex) > 0) {
            cropChartSectionStart.style.display = "block";
            cropChartSectionEnd.style.display = "block";
            cropRectBorder.style.opacity = "0.6";
        } else {
            cropChartSectionStart.style.display = "none";
            cropChartSectionEnd.style.display = "none";
            cropRectBorder.style.opacity = "1";
            return;
        }
        const sectStart = chartData[(0, _cropChartSpec.currentCropChartSection)[0]];
        const sectEnd = chartData[(0, _cropChartSpec.currentCropChartSection)[1]];
        [
            cropChartSectionStartBorderGreen,
            cropChartSectionStartBorderWhite
        ].map((cropRect)=>setCropOverlay(cropRect, sectStart.crop));
        [
            cropChartSectionEndBorderYellow,
            cropChartSectionEndBorderWhite
        ].map((cropRect)=>setCropOverlay(cropRect, sectEnd.crop));
        const currentCropPoint = chartData[0, _cropChartSpec.currentCropPointIndex];
        if (cropCrossHairEnabled && cropCrossHair) {
            cropCrossHairs.map((cropCrossHair)=>setCropCrossHair(cropCrossHair, currentCropPoint.crop));
            cropCrossHair.style.stroke = (0, _cropChartSpec.currentCropChartMode) === (0, _cropChartSpec.cropChartMode).Start ? "lime" : "yellow";
        }
        if ((0, _cropChartSpec.currentCropChartMode) === (0, _cropChartSpec.cropChartMode).Start) {
            cropChartSectionStart.setAttribute("opacity", "0.8");
            cropChartSectionEnd.setAttribute("opacity", "0.3");
        } else if ((0, _cropChartSpec.currentCropChartMode) === (0, _cropChartSpec.cropChartMode).End) {
            cropChartSectionStart.setAttribute("opacity", "0.3");
            cropChartSectionEnd.setAttribute("opacity", "0.8");
        }
        const [easedX, easedY, easedW, easedH] = getEasedCropComponents(sectStart, sectEnd);
        [
            cropRect,
            cropRectBorderBlack,
            cropRectBorderWhite
        ].map((cropRect)=>setCropOverlayDimensions(cropRect, easedX, easedY, easedW, easedH));
    }
    function getInterpolatedCrop(sectStart, sectEnd, time) {
        const [startX, startY, startW, startH] = getCropComponents(sectStart.crop);
        const [endX, endY, endW, endH] = getCropComponents(sectEnd.crop);
        const clampedTime = (0, _util.clampNumber)(time, sectStart.x, sectEnd.x);
        const easingFunc = sectEnd.easeIn == "instant" ? easeInInstant : (0, _d3Ease.easeSinInOut);
        const startTime = sectStart.x;
        const endTime = getFrameTimeBetweenLeftFrames(sectEnd.x);
        const [x, y, w, h] = [
            [
                startX,
                endX
            ],
            [
                startY,
                endY
            ],
            [
                startW,
                endW
            ],
            [
                startH,
                endH
            ]
        ].map(([startValue, endValue])=>{
            const eased = (0, _util.getEasedValue)(easingFunc, startValue, endValue, startTime, endTime, clampedTime);
            return eased;
        });
        // return [x, y, w, h];
        return (0, _util.getCropString)(x, y, w, h);
    }
    function cropChartSectionLoop() {
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen) {
            if (prevSelectedMarkerPairIndex != null) {
                const chart = cropChartInput.chart;
                if (chart == null) return;
                const chartData = chart.data.datasets[0].data;
                const [start, end] = (0, _cropChartSpec.currentCropChartSection);
                const sectStart = chartData[start].x;
                const sectEnd = chartData[end].x;
                const isTimeBetweenCropChartSection = sectStart <= video.getCurrentTime() && video.getCurrentTime() <= sectEnd;
                if (!isTimeBetweenCropChartSection) (0, _util.seekToSafe)(video, sectStart);
            }
        }
    }
    function updateAllMarkerPairSpeeds(newSpeed) {
        markerPairs.forEach((markerPair)=>{
            updateMarkerPairSpeed(markerPair, newSpeed);
        });
        if (isSettingsEditorOpen) {
            if (wasGlobalSettingsEditorOpen) {
                const markerPairMergeListInput = document.getElementById("merge-list-input");
                markerPairMergeListInput.dispatchEvent(new Event("change"));
            } else {
                speedInput.value = newSpeed.toString();
                renderSpeedAndCropUI();
            }
        }
        (0, _util.flashMessage)(`All marker speeds updated to ${newSpeed}`, "olive");
    }
    function updateMarkerPairSpeed(markerPair, newSpeed) {
        const draft = (0, _immer.createDraft)((0, _undoredo.getMarkerPairHistory)(markerPair));
        draft.speed = newSpeed;
        const speedMap = draft.speedMap;
        if (speedMap.length === 2 && speedMap[0].y === speedMap[1].y) speedMap[1].y = newSpeed;
        speedMap[0].y = newSpeed;
        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
    }
    function updateAllMarkerPairCrops(newCrop) {
        markerPairs.forEach((markerPair)=>{
            const draft = (0, _immer.createDraft)((0, _undoredo.getMarkerPairHistory)(markerPair));
            const cropMap = draft.cropMap;
            if (isStaticCrop(cropMap)) {
                draft.crop = newCrop;
                cropMap[0].crop = newCrop;
                cropMap[1].crop = newCrop;
            }
            (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
        });
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen) {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const cropMap = markerPair.cropMap;
            if (isStaticCrop(cropMap)) {
                setCropInputValue(newCrop);
                renderSpeedAndCropUI();
            }
        }
        (0, _util.flashMessage)(`All static marker crops updated to ${newCrop}`, "olive");
    }
    function undoRedoMarkerPairChange(dir) {
        if (isSettingsEditorOpen && !wasGlobalSettingsEditorOpen && prevSelectedMarkerPairIndex != null) {
            const markerPair = markerPairs[prevSelectedMarkerPairIndex];
            const newState = dir === "undo" ? (0, _undoredo.undo)(markerPair.undoredo, ()=>null) : (0, _undoredo.redo)(markerPair.undoredo, ()=>null);
            if (newState == null) (0, _util.flashMessage)(`Nothing left to ${dir}.`, "red");
            else {
                Object.assign(markerPair, newState);
                if (markerPair.cropRes !== settings.cropRes) {
                    const { cropMultipleX, cropMultipleY } = getCropMultiples(markerPair.cropRes, settings.cropRes);
                    multiplyMarkerPairCrops(markerPair, cropMultipleX, cropMultipleY);
                }
                renderSpeedAndCropUI(true, true);
                (0, _util.flashMessage)(`Applied ${dir}.`, "green");
            }
        } else (0, _util.flashMessage)("Please select a marker pair editor for undo/redo.", "olive");
    }
    function deleteMarkerPair(idx) {
        if (idx == null) idx = prevSelectedMarkerPairIndex;
        const markerPair = markerPairs[idx];
        const me = new PointerEvent("pointerover", {
            shiftKey: true
        });
        enableMarkerHotkeys.endMarker.dispatchEvent(me);
        (0, _util.deleteElement)(enableMarkerHotkeys.endMarker);
        (0, _util.deleteElement)(enableMarkerHotkeys.startMarker);
        (0, _util.deleteElement)(markerPair.startNumbering);
        (0, _util.deleteElement)(markerPair.endNumbering);
        hideSelectedMarkerPairOverlay(true);
        renumberMarkerPairs();
        markerPairs.splice(idx, 1);
        clearPrevSelectedMarkerPairReferences();
    }
    function clearPrevSelectedMarkerPairReferences() {
        prevSelectedMarkerPairIndex = null;
        prevSelectedEndMarker = null;
        enableMarkerHotkeys.startMarker = null;
        enableMarkerHotkeys.endMarker = null;
        markerHotkeysEnabled = false;
    }
    let selectedStartMarkerOverlay;
    let selectedEndMarkerOverlay;
    function highlightSelectedMarkerPair(currentMarker) {
        if (!selectedStartMarkerOverlay) selectedStartMarkerOverlay = document.getElementById("selected-start-marker-overlay");
        if (!selectedEndMarkerOverlay) selectedEndMarkerOverlay = document.getElementById("selected-end-marker-overlay");
        const startMarker = currentMarker.previousSibling;
        selectedStartMarkerOverlay.setAttribute("x", startMarker.getAttribute("x"));
        selectedEndMarkerOverlay.setAttribute("x", currentMarker.getAttribute("x"));
        selectedStartMarkerOverlay.classList.remove("selected-marker-overlay-hidden");
        selectedEndMarkerOverlay.classList.remove("selected-marker-overlay-hidden");
        selectedMarkerPairOverlay.style.display = "block";
    }
    function updateMarkerPairDuration(markerPair) {
        const speedAdjustedDurationSpan = document.getElementById("duration");
        const duration = markerPair.end - markerPair.start;
        const durationHHMMSS = (0, _util.toHHMMSSTrimmed)(duration);
        const speed = markerPair.speed;
        const speedMap = markerPair.speedMap;
        if (isVariableSpeed(speedMap)) {
            const outputDuration = (0, _util.getOutputDuration)(markerPair.speedMap, getFPS());
            const outputDurationHHMMSS = (0, _util.toHHMMSSTrimmed)(outputDuration);
            if (speedAdjustedDurationSpan) speedAdjustedDurationSpan.textContent = `${durationHHMMSS} (${outputDurationHHMMSS})`;
            markerPair.outputDuration = outputDuration;
        } else {
            const outputDuration = duration / speed;
            const outputDurationHHMMSS = (0, _util.toHHMMSSTrimmed)(outputDuration);
            if (speedAdjustedDurationSpan) speedAdjustedDurationSpan.textContent = `${durationHHMMSS}/${speed} = ${outputDurationHHMMSS}`;
            markerPair.outputDuration = outputDuration;
        }
    }
    function renumberMarkerPairs() {
        const markersSvg = document.getElementById("markers-svg");
        markersSvg.childNodes.forEach((markerRect, idx)=>{
            // renumber markers by pair starting with index 1
            const newIdx = Math.floor((idx + 2) / 2);
            markerRect.setAttribute("data-idx", newIdx);
        });
        startMarkerNumberings.childNodes.forEach((startNumbering, idx)=>{
            const newIdx = idx + 1;
            startNumbering.setAttribute("data-idx", newIdx);
            startNumbering.textContent = newIdx.toString();
        });
        endMarkerNumberings.childNodes.forEach((endNumbering, idx)=>{
            const newIdx = idx + 1;
            endNumbering.setAttribute("data-idx", newIdx);
            endNumbering.textContent = newIdx.toString();
        });
    }
    function hideSelectedMarkerPairOverlay(hardHide = false) {
        if (hardHide) selectedMarkerPairOverlay.style.display = "none";
        else {
            selectedStartMarkerOverlay.classList.add("selected-marker-overlay-hidden");
            selectedEndMarkerOverlay.classList.add("selected-marker-overlay-hidden");
        }
    }
    function showChart() {
        if (currentChartInput && currentChartInput.chartContainer) {
            if (isDrawingCrop) finishDrawingCrop(true);
            currentChartInput.chartContainer.style.display = "block";
            isCurrentChartVisible = true;
            currentChartInput.chart.update();
            // force chart time annotation to update
            prevChartTime = -1;
        }
    }
    function hideChart() {
        if (currentChartInput && currentChartInput.chartContainer) {
            currentChartInput.chartContainer.style.display = "none";
            isCurrentChartVisible = false;
        }
    }
    function toggleCurrentChartVisibility() {
        if (!isCurrentChartVisible) showChart();
        else hideChart();
    }
}

},{"chart.js":"fyX24","./util/util":"jxJ0L","common-tags":"6nh3m","d3-ease":"fZo6p","file-saver":"hxp2F","fs":"fDIL2","immer":"2hRSJ","jszip":"5NCup","lodash.clonedeep":"gYt8g","./actions/misc":"4u9J9","./crop/crop":"4Y6Yu","./platforms/blockers/common":"6RVIe","./platforms/blockers/youtube":"7bvM2","./platforms/platforms":"dzgHD","./ui/chart/chart.js-drag-data-plugin":"7L08I","./ui/chart/chartutil":"fsMdw","./ui/chart/cropchart/cropChartSpec":"ir1Wi","./ui/chart/scatterChartSpec":"f6y72","./ui/chart/speedchart/speedChartSpec":"2B8mY","./ui/css/css":"2yfyw","./ui/tooltips":"l5HCU","./util/undoredo":"hHDBZ","./crop/crop-preview":"bailj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"fyX24":[function(require,module,exports) {
module.exports = Chart;

},{}],"jxJ0L":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "sanitizeHtml", ()=>sanitizeHtml);
parcelHelpers.export(exports, "safeSetInnerHtml", ()=>safeSetInnerHtml);
parcelHelpers.export(exports, "setFlashMessageHook", ()=>setFlashMessageHook);
parcelHelpers.export(exports, "flashMessage", ()=>flashMessage);
parcelHelpers.export(exports, "retryUntilTruthyResult", ()=>retryUntilTruthyResult);
parcelHelpers.export(exports, "sleep", ()=>sleep);
parcelHelpers.export(exports, "injectCSS", ()=>injectCSS);
parcelHelpers.export(exports, "htmlToElement", ()=>htmlToElement);
parcelHelpers.export(exports, "htmlToSVGElement", ()=>htmlToSVGElement);
parcelHelpers.export(exports, "deleteElement", ()=>deleteElement);
parcelHelpers.export(exports, "querySelectors", ()=>querySelectors);
parcelHelpers.export(exports, "once", ()=>once);
parcelHelpers.export(exports, "setAttributes", ()=>setAttributes);
parcelHelpers.export(exports, "copyToClipboard", ()=>copyToClipboard);
parcelHelpers.export(exports, "getRounder", ()=>getRounder);
parcelHelpers.export(exports, "roundValue", ()=>roundValue);
parcelHelpers.export(exports, "speedRounder", ()=>speedRounder);
parcelHelpers.export(exports, "timeRounder", ()=>timeRounder);
parcelHelpers.export(exports, "clampNumber", ()=>clampNumber);
parcelHelpers.export(exports, "toHHMMSS", ()=>toHHMMSS);
parcelHelpers.export(exports, "toHHMMSSTrimmed", ()=>toHHMMSSTrimmed);
parcelHelpers.export(exports, "mod", ()=>mod);
parcelHelpers.export(exports, "bsearch", ()=>bsearch);
parcelHelpers.export(exports, "getEasedValue", ()=>getEasedValue);
parcelHelpers.export(exports, "seekToSafe", ()=>seekToSafe);
parcelHelpers.export(exports, "seekBySafe", ()=>seekBySafe);
parcelHelpers.export(exports, "blockEvent", ()=>blockEvent);
parcelHelpers.export(exports, "getCropString", ()=>getCropString);
parcelHelpers.export(exports, "ternaryToString", ()=>ternaryToString);
parcelHelpers.export(exports, "arrayEquals", ()=>arrayEquals);
parcelHelpers.export(exports, "getOutputDuration", ()=>getOutputDuration);
parcelHelpers.export(exports, "onLoadVideoPage", ()=>onLoadVideoPage);
parcelHelpers.export(exports, "observeVideoElementChange", ()=>observeVideoElementChange);
parcelHelpers.export(exports, "parseTimeStringToSeconds", ()=>parseTimeStringToSeconds);
parcelHelpers.export(exports, "getVideoDuration", ()=>getVideoDuration);
var _dompurify = require("dompurify");
var _dompurifyDefault = parcelHelpers.interopDefault(_dompurify);
var _platforms = require("../platforms/platforms");
function sanitizeHtml(html, forceBody = false) {
    const trustedHtml = (0, _dompurifyDefault.default).sanitize(html, {
        USE_PROFILES: {
            html: true,
            svg: true,
            svgFilters: true
        },
        RETURN_TRUSTED_TYPE: Boolean(window.TrustedHTML),
        FORCE_BODY: forceBody
    });
    if ((0, _dompurifyDefault.default).removed.length > 0) console.warn("Sanitized html. removed elements = ", (0, _dompurifyDefault.default).removed);
    if (window.TrustedHTML) return trustedHtml;
    else return trustedHtml.toString();
}
function safeSetInnerHtml(e, html, forceBody = false) {
    e.innerHTML = sanitizeHtml(html, forceBody);
}
let flashMessageHook;
function setFlashMessageHook(hook) {
    flashMessageHook = hook;
}
function flashMessage(msg, color, lifetime = 3000) {
    const flashDiv = document.createElement("div");
    flashDiv.setAttribute("class", "msg-div flash-div");
    safeSetInnerHtml(flashDiv, `<span class="flash-msg" style="color:${color}">${msg}</span>`);
    flashMessageHook.insertAdjacentElement("beforebegin", flashDiv);
    setTimeout(()=>deleteElement(flashDiv), lifetime);
}
async function retryUntilTruthyResult(fn, wait = 200) {
    let result = fn();
    while(!result){
        console.debug(`Retrying function: ${fn.name || "arrow"} with body ${fn.toString()} because result was ${result}`);
        result = fn();
        await sleep(wait);
    }
    return result;
}
function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
function injectCSS(css, id) {
    const style = document.createElement("style");
    style.setAttribute("id", id);
    safeSetInnerHtml(style, css);
    document.body.appendChild(style);
    return style;
}
function htmlToElement(html) {
    const template = document.createElement("template");
    html = html.trim(); // Never return a text node of whitespace as the result
    safeSetInnerHtml(template, html);
    return template.content.firstChild;
}
function htmlToSVGElement(html) {
    const template = document.createElementNS("http://www.w3.org/2000/svg", "template");
    html = html.trim(); // Never return a text node of whitespace as the result
    safeSetInnerHtml(template, html);
    return template.firstElementChild;
}
function deleteElement(elem) {
    if (elem && elem.parentElement) elem.parentElement.removeChild(elem);
}
function querySelectors(selectors, root = document) {
    const elements = {};
    for(const key in selectors)elements[key] = root.querySelector(selectors[key]);
    return elements;
}
function once(fn, context) {
    var result;
    return function() {
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    };
}
function setAttributes(el, attrs) {
    Object.keys(attrs).forEach((key)=>el.setAttribute(key, attrs[key]));
}
function copyToClipboard(str) {
    const el = document.createElement("textarea");
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
}
function getRounder(multiple, precision) {
    return (value)=>{
        const roundedValue = Math.round(value / multiple) * multiple;
        const roundedValueFixedPrecision = +roundedValue.toFixed(precision);
        return roundedValueFixedPrecision;
    };
}
function roundValue(value, multiple, precision) {
    return getRounder(multiple, precision)(value);
}
const speedRounder = getRounder(5e-2, 2);
const timeRounder = getRounder(1e-6, 6);
function clampNumber(number, min, max) {
    return Math.max(min, Math.min(number, max));
}
function toHHMMSS(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 12);
}
function toHHMMSSTrimmed(seconds) {
    return toHHMMSS(seconds).replace(/(00:)+(.*)/, "$2");
}
function mod(dividend, divisor) {
    return (dividend % divisor + divisor) % divisor;
}
function bsearch(haystack, needle, comparator, low, high) {
    var mid, cmp;
    if (low === undefined) low = 0;
    else {
        low = low | 0;
        if (low < 0 || low >= haystack.length) throw new RangeError("invalid lower bound");
    }
    if (high === undefined) high = haystack.length - 1;
    else {
        high = high | 0;
        if (high < low || high >= haystack.length) throw new RangeError("invalid upper bound");
    }
    while(low <= high){
        // The naive `low + high >>> 1` could fail for array lengths > 2**31
        // because `>>>` converts its operands to int32. `low + (high - low >>> 1)`
        // works for array lengths <= 2**32-1 which is also Javascript's max array
        // length.
        mid = low + (high - low >>> 1);
        cmp = +comparator(haystack[mid], needle, mid, haystack);
        // Too low.
        if (cmp < 0.0) low = mid + 1;
        else if (cmp > 0.0) high = mid - 1;
        else return [
            mid,
            mid
        ];
    }
    // Key not found.
    return [
        high,
        low
    ];
}
function getEasedValue(easingFunc, startValue, endValue, startTime, endTime, currentTime) {
    const elapsed = currentTime - startTime;
    const duration = endTime - startTime;
    const valueDelta = endValue - startValue;
    let easedValuePercentage;
    easedValuePercentage = easingFunc(elapsed / duration);
    const easedValue = startValue + valueDelta * easedValuePercentage;
    return easedValue;
}
function seekToSafe(video, newTime) {
    newTime = clampNumber(newTime, 0, video.duration);
    if (!isNaN(newTime) && video.getCurrentTime() != newTime && !video.seeking) try {
        video.seekTo(newTime);
    } catch (e) {
        console.error(e);
    }
}
function seekBySafe(video, timeDelta) {
    const newTime = video.getCurrentTime() + timeDelta;
    seekToSafe(video, newTime);
}
function blockEvent(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
}
function getCropString(x, y, w, h) {
    return `${x}:${y}:${w}:${h}`;
}
function ternaryToString(ternary, def) {
    if (ternary == null) return def != null ? def : "(Disabled)";
    else if (ternary === true) return "(Enabled)";
    else if (ternary === false) return "(Disabled)";
    else return null;
}
function arrayEquals(a, b) {
    return a.length === b.length && a.every((v, i)=>v === b[i]);
}
function getOutputDuration(speedMap, fps = 30) {
    let outputDuration = 0;
    const frameDur = 1 / fps;
    const nSects = speedMap.length - 1;
    // Account for marker pair start time as trim filter sets start time to ~0
    const speedMapStartTime = speedMap[0].x;
    // Account for first input frame delay due to potentially imprecise trim
    const startt = Math.ceil(speedMapStartTime / frameDur) * frameDur - speedMapStartTime;
    for(let sect = 0; sect < nSects; ++sect){
        const left = speedMap[sect];
        const right = speedMap[sect + 1];
        const startSpeed = left.y;
        const endSpeed = right.y;
        const speedChange = endSpeed - startSpeed;
        const sectStart = left.x - speedMapStartTime - startt;
        let sectEnd = right.x - speedMapStartTime - startt;
        // Account for last input frame delay due to potentially imprecise trim
        if (sect === nSects - 1) {
            sectEnd = Math.floor(right["x"] / frameDur) * frameDur;
            // When trim is frame-precise, the frame that begins at the marker pair end time is not included
            if (right.x - sectEnd < 1e-10) sectEnd = sectEnd - frameDur;
            sectEnd = sectEnd - speedMapStartTime - startt;
            sectEnd = Math.floor(sectEnd * 1000000) / 1000000;
        }
        const sectDuration = sectEnd - sectStart;
        if (sectDuration === 0) continue;
        const m = speedChange / sectDuration;
        const b = startSpeed - m * sectStart;
        if (speedChange === 0) outputDuration += sectDuration / endSpeed;
        else // Integrate the reciprocal of the linear time vs speed function for the current section
        outputDuration += 1 / m * (Math.log(Math.abs(m * sectEnd + b)) - Math.log(Math.abs(m * sectStart + b)));
    }
    // Each output frame time is rounded to the nearest multiple of a frame's duration at the given fps
    outputDuration = Math.round(outputDuration / frameDur) * frameDur;
    // The last included frame is held for a single frame's duration
    outputDuration += frameDur;
    outputDuration = Math.round(outputDuration * 1000) / 1000;
    return outputDuration;
}
async function onLoadVideoPage(callback) {
    const ytdapp = await retryUntilTruthyResult(()=>document.getElementsByTagName("ytd-app")[0]);
    if (ytdapp.hasAttribute("is-watch-page")) {
        console.log("watch page loaded");
        callback();
        return;
    }
    const observer = new MutationObserver((mutationList)=>{
        mutationList.forEach((mutation)=>{
            if (mutation.type === "attributes" && mutation.attributeName === "is-watch-page" && ytdapp.hasAttribute("is-watch-page")) {
                console.log("watch page loaded");
                observer.disconnect();
                callback();
            }
        });
    });
    const config = {
        attributeFilter: [
            "is-watch-page"
        ]
    };
    console.log(`Waiting for video page load before calling ${callback.name}`);
    observer.observe(ytdapp, config);
}
function observeVideoElementChange(videoContainer, callback) {
    const observer = new MutationObserver((mutationList)=>{
        mutationList.forEach((mutation)=>{
            if (mutation.type === "childList") {
                console.log("observed mutation in video container", mutation);
                callback(mutation.addedNodes);
            }
        });
    });
    console.log(`Watching for changes to video container nodes. callback=${callback.name}`);
    observer.observe(videoContainer, {
        childList: true
    });
}
function parseTimeStringToSeconds(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
let videoDuration = NaN;
function getVideoDuration(platform, video) {
    if (!Number.isNaN(videoDuration)) return videoDuration;
    if (platform === (0, _platforms.VideoPlatforms).afreecatv) {
        let duration = 0;
        for (let videoPart of unsafeWindow.vodCore.playerController.fileItems)duration += videoPart.duration;
        videoDuration = duration;
    } else videoDuration = video.duration;
    return videoDuration;
}

},{"dompurify":"exVt1","../platforms/platforms":"dzgHD","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"exVt1":[function(require,module,exports) {
/*! @license DOMPurify 3.2.6 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.6/LICENSE */ (function(global, factory) {
    module.exports = factory();
})(this, function() {
    "use strict";
    const { entries, setPrototypeOf, isFrozen, getPrototypeOf, getOwnPropertyDescriptor } = Object;
    let { freeze, seal, create } = Object; // eslint-disable-line import/no-mutable-exports
    let { apply, construct } = typeof Reflect !== "undefined" && Reflect;
    if (!freeze) freeze = function freeze(x) {
        return x;
    };
    if (!seal) seal = function seal(x) {
        return x;
    };
    if (!apply) apply = function apply(fun, thisValue, args) {
        return fun.apply(thisValue, args);
    };
    if (!construct) construct = function construct(Func, args) {
        return new Func(...args);
    };
    const arrayForEach = unapply(Array.prototype.forEach);
    const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
    const arrayPop = unapply(Array.prototype.pop);
    const arrayPush = unapply(Array.prototype.push);
    const arraySplice = unapply(Array.prototype.splice);
    const stringToLowerCase = unapply(String.prototype.toLowerCase);
    const stringToString = unapply(String.prototype.toString);
    const stringMatch = unapply(String.prototype.match);
    const stringReplace = unapply(String.prototype.replace);
    const stringIndexOf = unapply(String.prototype.indexOf);
    const stringTrim = unapply(String.prototype.trim);
    const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
    const regExpTest = unapply(RegExp.prototype.test);
    const typeErrorCreate = unconstruct(TypeError);
    /**
   * Creates a new function that calls the given function with a specified thisArg and arguments.
   *
   * @param func - The function to be wrapped and called.
   * @returns A new function that calls the given function with a specified thisArg and arguments.
   */ function unapply(func) {
        return function(thisArg) {
            if (thisArg instanceof RegExp) thisArg.lastIndex = 0;
            for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
            return apply(func, thisArg, args);
        };
    }
    /**
   * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
   *
   * @param func - The constructor function to be wrapped and called.
   * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
   */ function unconstruct(func) {
        return function() {
            for(var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++)args[_key2] = arguments[_key2];
            return construct(func, args);
        };
    }
    /**
   * Add properties to a lookup table
   *
   * @param set - The set to which elements will be added.
   * @param array - The array containing elements to be added to the set.
   * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
   * @returns The modified set with added elements.
   */ function addToSet(set, array) {
        let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
        if (setPrototypeOf) // Make 'in' and truthy checks like Boolean(set.constructor)
        // independent of any properties defined on Object.prototype.
        // Prevent prototype setters from intercepting set as a this value.
        setPrototypeOf(set, null);
        let l = array.length;
        while(l--){
            let element = array[l];
            if (typeof element === "string") {
                const lcElement = transformCaseFunc(element);
                if (lcElement !== element) {
                    // Config presets (e.g. tags.js, attrs.js) are immutable.
                    if (!isFrozen(array)) array[l] = lcElement;
                    element = lcElement;
                }
            }
            set[element] = true;
        }
        return set;
    }
    /**
   * Clean up an array to harden against CSPP
   *
   * @param array - The array to be cleaned.
   * @returns The cleaned version of the array
   */ function cleanArray(array) {
        for(let index = 0; index < array.length; index++){
            const isPropertyExist = objectHasOwnProperty(array, index);
            if (!isPropertyExist) array[index] = null;
        }
        return array;
    }
    /**
   * Shallow clone an object
   *
   * @param object - The object to be cloned.
   * @returns A new object that copies the original.
   */ function clone(object) {
        const newObject = create(null);
        for (const [property, value] of entries(object)){
            const isPropertyExist = objectHasOwnProperty(object, property);
            if (isPropertyExist) {
                if (Array.isArray(value)) newObject[property] = cleanArray(value);
                else if (value && typeof value === "object" && value.constructor === Object) newObject[property] = clone(value);
                else newObject[property] = value;
            }
        }
        return newObject;
    }
    /**
   * This method automatically checks if the prop is function or getter and behaves accordingly.
   *
   * @param object - The object to look up the getter function in its prototype chain.
   * @param prop - The property name for which to find the getter function.
   * @returns The getter function found in the prototype chain or a fallback function.
   */ function lookupGetter(object, prop) {
        while(object !== null){
            const desc = getOwnPropertyDescriptor(object, prop);
            if (desc) {
                if (desc.get) return unapply(desc.get);
                if (typeof desc.value === "function") return unapply(desc.value);
            }
            object = getPrototypeOf(object);
        }
        function fallbackValue() {
            return null;
        }
        return fallbackValue;
    }
    const html$1 = freeze([
        "a",
        "abbr",
        "acronym",
        "address",
        "area",
        "article",
        "aside",
        "audio",
        "b",
        "bdi",
        "bdo",
        "big",
        "blink",
        "blockquote",
        "body",
        "br",
        "button",
        "canvas",
        "caption",
        "center",
        "cite",
        "code",
        "col",
        "colgroup",
        "content",
        "data",
        "datalist",
        "dd",
        "decorator",
        "del",
        "details",
        "dfn",
        "dialog",
        "dir",
        "div",
        "dl",
        "dt",
        "element",
        "em",
        "fieldset",
        "figcaption",
        "figure",
        "font",
        "footer",
        "form",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "head",
        "header",
        "hgroup",
        "hr",
        "html",
        "i",
        "img",
        "input",
        "ins",
        "kbd",
        "label",
        "legend",
        "li",
        "main",
        "map",
        "mark",
        "marquee",
        "menu",
        "menuitem",
        "meter",
        "nav",
        "nobr",
        "ol",
        "optgroup",
        "option",
        "output",
        "p",
        "picture",
        "pre",
        "progress",
        "q",
        "rp",
        "rt",
        "ruby",
        "s",
        "samp",
        "section",
        "select",
        "shadow",
        "small",
        "source",
        "spacer",
        "span",
        "strike",
        "strong",
        "style",
        "sub",
        "summary",
        "sup",
        "table",
        "tbody",
        "td",
        "template",
        "textarea",
        "tfoot",
        "th",
        "thead",
        "time",
        "tr",
        "track",
        "tt",
        "u",
        "ul",
        "var",
        "video",
        "wbr"
    ]);
    const svg$1 = freeze([
        "svg",
        "a",
        "altglyph",
        "altglyphdef",
        "altglyphitem",
        "animatecolor",
        "animatemotion",
        "animatetransform",
        "circle",
        "clippath",
        "defs",
        "desc",
        "ellipse",
        "filter",
        "font",
        "g",
        "glyph",
        "glyphref",
        "hkern",
        "image",
        "line",
        "lineargradient",
        "marker",
        "mask",
        "metadata",
        "mpath",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "radialgradient",
        "rect",
        "stop",
        "style",
        "switch",
        "symbol",
        "text",
        "textpath",
        "title",
        "tref",
        "tspan",
        "view",
        "vkern"
    ]);
    const svgFilters = freeze([
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feDropShadow",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence"
    ]);
    // List of SVG elements that are disallowed by default.
    // We still need to know them so that we can do namespace
    // checks properly in case one wants to add them to
    // allow-list.
    const svgDisallowed = freeze([
        "animate",
        "color-profile",
        "cursor",
        "discard",
        "font-face",
        "font-face-format",
        "font-face-name",
        "font-face-src",
        "font-face-uri",
        "foreignobject",
        "hatch",
        "hatchpath",
        "mesh",
        "meshgradient",
        "meshpatch",
        "meshrow",
        "missing-glyph",
        "script",
        "set",
        "solidcolor",
        "unknown",
        "use"
    ]);
    const mathMl$1 = freeze([
        "math",
        "menclose",
        "merror",
        "mfenced",
        "mfrac",
        "mglyph",
        "mi",
        "mlabeledtr",
        "mmultiscripts",
        "mn",
        "mo",
        "mover",
        "mpadded",
        "mphantom",
        "mroot",
        "mrow",
        "ms",
        "mspace",
        "msqrt",
        "mstyle",
        "msub",
        "msup",
        "msubsup",
        "mtable",
        "mtd",
        "mtext",
        "mtr",
        "munder",
        "munderover",
        "mprescripts"
    ]);
    // Similarly to SVG, we want to know all MathML elements,
    // even those that we disallow by default.
    const mathMlDisallowed = freeze([
        "maction",
        "maligngroup",
        "malignmark",
        "mlongdiv",
        "mscarries",
        "mscarry",
        "msgroup",
        "mstack",
        "msline",
        "msrow",
        "semantics",
        "annotation",
        "annotation-xml",
        "mprescripts",
        "none"
    ]);
    const text = freeze([
        "#text"
    ]);
    const html = freeze([
        "accept",
        "action",
        "align",
        "alt",
        "autocapitalize",
        "autocomplete",
        "autopictureinpicture",
        "autoplay",
        "background",
        "bgcolor",
        "border",
        "capture",
        "cellpadding",
        "cellspacing",
        "checked",
        "cite",
        "class",
        "clear",
        "color",
        "cols",
        "colspan",
        "controls",
        "controlslist",
        "coords",
        "crossorigin",
        "datetime",
        "decoding",
        "default",
        "dir",
        "disabled",
        "disablepictureinpicture",
        "disableremoteplayback",
        "download",
        "draggable",
        "enctype",
        "enterkeyhint",
        "face",
        "for",
        "headers",
        "height",
        "hidden",
        "high",
        "href",
        "hreflang",
        "id",
        "inputmode",
        "integrity",
        "ismap",
        "kind",
        "label",
        "lang",
        "list",
        "loading",
        "loop",
        "low",
        "max",
        "maxlength",
        "media",
        "method",
        "min",
        "minlength",
        "multiple",
        "muted",
        "name",
        "nonce",
        "noshade",
        "novalidate",
        "nowrap",
        "open",
        "optimum",
        "pattern",
        "placeholder",
        "playsinline",
        "popover",
        "popovertarget",
        "popovertargetaction",
        "poster",
        "preload",
        "pubdate",
        "radiogroup",
        "readonly",
        "rel",
        "required",
        "rev",
        "reversed",
        "role",
        "rows",
        "rowspan",
        "spellcheck",
        "scope",
        "selected",
        "shape",
        "size",
        "sizes",
        "span",
        "srclang",
        "start",
        "src",
        "srcset",
        "step",
        "style",
        "summary",
        "tabindex",
        "title",
        "translate",
        "type",
        "usemap",
        "valign",
        "value",
        "width",
        "wrap",
        "xmlns",
        "slot"
    ]);
    const svg = freeze([
        "accent-height",
        "accumulate",
        "additive",
        "alignment-baseline",
        "amplitude",
        "ascent",
        "attributename",
        "attributetype",
        "azimuth",
        "basefrequency",
        "baseline-shift",
        "begin",
        "bias",
        "by",
        "class",
        "clip",
        "clippathunits",
        "clip-path",
        "clip-rule",
        "color",
        "color-interpolation",
        "color-interpolation-filters",
        "color-profile",
        "color-rendering",
        "cx",
        "cy",
        "d",
        "dx",
        "dy",
        "diffuseconstant",
        "direction",
        "display",
        "divisor",
        "dur",
        "edgemode",
        "elevation",
        "end",
        "exponent",
        "fill",
        "fill-opacity",
        "fill-rule",
        "filter",
        "filterunits",
        "flood-color",
        "flood-opacity",
        "font-family",
        "font-size",
        "font-size-adjust",
        "font-stretch",
        "font-style",
        "font-variant",
        "font-weight",
        "fx",
        "fy",
        "g1",
        "g2",
        "glyph-name",
        "glyphref",
        "gradientunits",
        "gradienttransform",
        "height",
        "href",
        "id",
        "image-rendering",
        "in",
        "in2",
        "intercept",
        "k",
        "k1",
        "k2",
        "k3",
        "k4",
        "kerning",
        "keypoints",
        "keysplines",
        "keytimes",
        "lang",
        "lengthadjust",
        "letter-spacing",
        "kernelmatrix",
        "kernelunitlength",
        "lighting-color",
        "local",
        "marker-end",
        "marker-mid",
        "marker-start",
        "markerheight",
        "markerunits",
        "markerwidth",
        "maskcontentunits",
        "maskunits",
        "max",
        "mask",
        "media",
        "method",
        "mode",
        "min",
        "name",
        "numoctaves",
        "offset",
        "operator",
        "opacity",
        "order",
        "orient",
        "orientation",
        "origin",
        "overflow",
        "paint-order",
        "path",
        "pathlength",
        "patterncontentunits",
        "patterntransform",
        "patternunits",
        "points",
        "preservealpha",
        "preserveaspectratio",
        "primitiveunits",
        "r",
        "rx",
        "ry",
        "radius",
        "refx",
        "refy",
        "repeatcount",
        "repeatdur",
        "restart",
        "result",
        "rotate",
        "scale",
        "seed",
        "shape-rendering",
        "slope",
        "specularconstant",
        "specularexponent",
        "spreadmethod",
        "startoffset",
        "stddeviation",
        "stitchtiles",
        "stop-color",
        "stop-opacity",
        "stroke-dasharray",
        "stroke-dashoffset",
        "stroke-linecap",
        "stroke-linejoin",
        "stroke-miterlimit",
        "stroke-opacity",
        "stroke",
        "stroke-width",
        "style",
        "surfacescale",
        "systemlanguage",
        "tabindex",
        "tablevalues",
        "targetx",
        "targety",
        "transform",
        "transform-origin",
        "text-anchor",
        "text-decoration",
        "text-rendering",
        "textlength",
        "type",
        "u1",
        "u2",
        "unicode",
        "values",
        "viewbox",
        "visibility",
        "version",
        "vert-adv-y",
        "vert-origin-x",
        "vert-origin-y",
        "width",
        "word-spacing",
        "wrap",
        "writing-mode",
        "xchannelselector",
        "ychannelselector",
        "x",
        "x1",
        "x2",
        "xmlns",
        "y",
        "y1",
        "y2",
        "z",
        "zoomandpan"
    ]);
    const mathMl = freeze([
        "accent",
        "accentunder",
        "align",
        "bevelled",
        "close",
        "columnsalign",
        "columnlines",
        "columnspan",
        "denomalign",
        "depth",
        "dir",
        "display",
        "displaystyle",
        "encoding",
        "fence",
        "frame",
        "height",
        "href",
        "id",
        "largeop",
        "length",
        "linethickness",
        "lspace",
        "lquote",
        "mathbackground",
        "mathcolor",
        "mathsize",
        "mathvariant",
        "maxsize",
        "minsize",
        "movablelimits",
        "notation",
        "numalign",
        "open",
        "rowalign",
        "rowlines",
        "rowspacing",
        "rowspan",
        "rspace",
        "rquote",
        "scriptlevel",
        "scriptminsize",
        "scriptsizemultiplier",
        "selection",
        "separator",
        "separators",
        "stretchy",
        "subscriptshift",
        "supscriptshift",
        "symmetric",
        "voffset",
        "width",
        "xmlns"
    ]);
    const xml = freeze([
        "xlink:href",
        "xml:id",
        "xlink:title",
        "xml:space",
        "xmlns:xlink"
    ]);
    // eslint-disable-next-line unicorn/better-regex
    const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
    const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
    const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm); // eslint-disable-line unicorn/better-regex
    const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
    const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
    const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
    );
    const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
    const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
    );
    const DOCTYPE_NAME = seal(/^html$/i);
    const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
    var EXPRESSIONS = /*#__PURE__*/ Object.freeze({
        __proto__: null,
        ARIA_ATTR: ARIA_ATTR,
        ATTR_WHITESPACE: ATTR_WHITESPACE,
        CUSTOM_ELEMENT: CUSTOM_ELEMENT,
        DATA_ATTR: DATA_ATTR,
        DOCTYPE_NAME: DOCTYPE_NAME,
        ERB_EXPR: ERB_EXPR,
        IS_ALLOWED_URI: IS_ALLOWED_URI,
        IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
        MUSTACHE_EXPR: MUSTACHE_EXPR,
        TMPLIT_EXPR: TMPLIT_EXPR
    });
    /* eslint-disable @typescript-eslint/indent */ // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    const NODE_TYPE = {
        element: 1,
        attribute: 2,
        text: 3,
        cdataSection: 4,
        entityReference: 5,
        // Deprecated
        entityNode: 6,
        // Deprecated
        progressingInstruction: 7,
        comment: 8,
        document: 9,
        documentType: 10,
        documentFragment: 11,
        notation: 12 // Deprecated
    };
    const getGlobal = function getGlobal() {
        return typeof window === "undefined" ? null : window;
    };
    /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param trustedTypes The policy factory.
   * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
   * @return The policy created (or null, if Trusted Types
   * are not supported or creating the policy failed).
   */ const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
        if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") return null;
        // Allow the callers to control the unique policy name
        // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
        // Policy creation with duplicate names throws in Trusted Types.
        let suffix = null;
        const ATTR_NAME = "data-tt-policy-suffix";
        if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) suffix = purifyHostElement.getAttribute(ATTR_NAME);
        const policyName = "dompurify" + (suffix ? "#" + suffix : "");
        try {
            return trustedTypes.createPolicy(policyName, {
                createHTML (html) {
                    return html;
                },
                createScriptURL (scriptUrl) {
                    return scriptUrl;
                }
            });
        } catch (_) {
            // Policy creation failed (most likely another DOMPurify script has
            // already run). Skip creating the policy, as this will only cause errors
            // if TT are enforced.
            console.warn("TrustedTypes policy " + policyName + " could not be created.");
            return null;
        }
    };
    const _createHooksMap = function _createHooksMap() {
        return {
            afterSanitizeAttributes: [],
            afterSanitizeElements: [],
            afterSanitizeShadowDOM: [],
            beforeSanitizeAttributes: [],
            beforeSanitizeElements: [],
            beforeSanitizeShadowDOM: [],
            uponSanitizeAttribute: [],
            uponSanitizeElement: [],
            uponSanitizeShadowNode: []
        };
    };
    function createDOMPurify() {
        let window1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
        const DOMPurify = (root)=>createDOMPurify(root);
        DOMPurify.version = "3.2.6";
        DOMPurify.removed = [];
        if (!window1 || !window1.document || window1.document.nodeType !== NODE_TYPE.document || !window1.Element) {
            // Not running in a browser, provide a factory function
            // so that you can pass your own Window
            DOMPurify.isSupported = false;
            return DOMPurify;
        }
        let { document } = window1;
        const originalDocument = document;
        const currentScript = originalDocument.currentScript;
        const { DocumentFragment, HTMLTemplateElement, Node, Element, NodeFilter, NamedNodeMap = window1.NamedNodeMap || window1.MozNamedAttrMap, HTMLFormElement, DOMParser, trustedTypes } = window1;
        const ElementPrototype = Element.prototype;
        const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
        const remove = lookupGetter(ElementPrototype, "remove");
        const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
        const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
        const getParentNode = lookupGetter(ElementPrototype, "parentNode");
        // As per issue #47, the web-components registry is inherited by a
        // new document created via createHTMLDocument. As per the spec
        // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
        // a new empty registry is used when creating a template contents owner
        // document, so we use that as our parent document to ensure nothing
        // is inherited.
        if (typeof HTMLTemplateElement === "function") {
            const template = document.createElement("template");
            if (template.content && template.content.ownerDocument) document = template.content.ownerDocument;
        }
        let trustedTypesPolicy;
        let emptyHTML = "";
        const { implementation, createNodeIterator, createDocumentFragment, getElementsByTagName } = document;
        const { importNode } = originalDocument;
        let hooks = _createHooksMap();
        /**
     * Expose whether this browser supports running the full DOMPurify.
     */ DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== undefined;
        const { MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR, DATA_ATTR, ARIA_ATTR, IS_SCRIPT_OR_DATA, ATTR_WHITESPACE, CUSTOM_ELEMENT } = EXPRESSIONS;
        let { IS_ALLOWED_URI: IS_ALLOWED_URI$1 } = EXPRESSIONS;
        /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */ /* allowed element names */ let ALLOWED_TAGS = null;
        const DEFAULT_ALLOWED_TAGS = addToSet({}, [
            ...html$1,
            ...svg$1,
            ...svgFilters,
            ...mathMl$1,
            ...text
        ]);
        /* Allowed attribute names */ let ALLOWED_ATTR = null;
        const DEFAULT_ALLOWED_ATTR = addToSet({}, [
            ...html,
            ...svg,
            ...mathMl,
            ...xml
        ]);
        /*
     * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
     * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
     * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
     * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
     */ let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
            tagNameCheck: {
                writable: true,
                configurable: false,
                enumerable: true,
                value: null
            },
            attributeNameCheck: {
                writable: true,
                configurable: false,
                enumerable: true,
                value: null
            },
            allowCustomizedBuiltInElements: {
                writable: true,
                configurable: false,
                enumerable: true,
                value: false
            }
        }));
        /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */ let FORBID_TAGS = null;
        /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */ let FORBID_ATTR = null;
        /* Decide if ARIA attributes are okay */ let ALLOW_ARIA_ATTR = true;
        /* Decide if custom data attributes are okay */ let ALLOW_DATA_ATTR = true;
        /* Decide if unknown protocols are okay */ let ALLOW_UNKNOWN_PROTOCOLS = false;
        /* Decide if self-closing tags in attributes are allowed.
     * Usually removed due to a mXSS issue in jQuery 3.0 */ let ALLOW_SELF_CLOSE_IN_ATTR = true;
        /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */ let SAFE_FOR_TEMPLATES = false;
        /* Output should be safe even for XML used within HTML and alike.
     * This means, DOMPurify removes comments when containing risky content.
     */ let SAFE_FOR_XML = true;
        /* Decide if document with <html>... should be returned */ let WHOLE_DOCUMENT = false;
        /* Track whether config is already set on this instance of DOMPurify. */ let SET_CONFIG = false;
        /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */ let FORCE_BODY = false;
        /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */ let RETURN_DOM = false;
        /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */ let RETURN_DOM_FRAGMENT = false;
        /* Try to return a Trusted Type object instead of a string, return a string in
     * case Trusted Types are not supported  */ let RETURN_TRUSTED_TYPE = false;
        /* Output should be free from DOM clobbering attacks?
     * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
     */ let SANITIZE_DOM = true;
        /* Achieve full DOM Clobbering protection by isolating the namespace of named
     * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
     *
     * HTML/DOM spec rules that enable DOM Clobbering:
     *   - Named Access on Window (§7.3.3)
     *   - DOM Tree Accessors (§3.1.5)
     *   - Form Element Parent-Child Relations (§4.10.3)
     *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
     *   - HTMLCollection (§4.2.10.2)
     *
     * Namespace isolation is implemented by prefixing `id` and `name` attributes
     * with a constant string, i.e., `user-content-`
     */ let SANITIZE_NAMED_PROPS = false;
        const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
        /* Keep element content when removing element? */ let KEEP_CONTENT = true;
        /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */ let IN_PLACE = false;
        /* Allow usage of profiles like html, svg and mathMl */ let USE_PROFILES = {};
        /* Tags to ignore content of when KEEP_CONTENT is true */ let FORBID_CONTENTS = null;
        const DEFAULT_FORBID_CONTENTS = addToSet({}, [
            "annotation-xml",
            "audio",
            "colgroup",
            "desc",
            "foreignobject",
            "head",
            "iframe",
            "math",
            "mi",
            "mn",
            "mo",
            "ms",
            "mtext",
            "noembed",
            "noframes",
            "noscript",
            "plaintext",
            "script",
            "style",
            "svg",
            "template",
            "thead",
            "title",
            "video",
            "xmp"
        ]);
        /* Tags that are safe for data: URIs */ let DATA_URI_TAGS = null;
        const DEFAULT_DATA_URI_TAGS = addToSet({}, [
            "audio",
            "video",
            "img",
            "source",
            "image",
            "track"
        ]);
        /* Attributes safe for values like "javascript:" */ let URI_SAFE_ATTRIBUTES = null;
        const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
            "alt",
            "class",
            "for",
            "id",
            "label",
            "name",
            "pattern",
            "placeholder",
            "role",
            "summary",
            "title",
            "value",
            "style",
            "xmlns"
        ]);
        const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
        const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
        const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
        /* Document namespace */ let NAMESPACE = HTML_NAMESPACE;
        let IS_EMPTY_INPUT = false;
        /* Allowed XHTML+XML namespaces */ let ALLOWED_NAMESPACES = null;
        const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [
            MATHML_NAMESPACE,
            SVG_NAMESPACE,
            HTML_NAMESPACE
        ], stringToString);
        let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, [
            "mi",
            "mo",
            "mn",
            "ms",
            "mtext"
        ]);
        let HTML_INTEGRATION_POINTS = addToSet({}, [
            "annotation-xml"
        ]);
        // Certain elements are allowed in both SVG and HTML
        // namespace. We need to specify them explicitly
        // so that they don't get erroneously deleted from
        // HTML namespace.
        const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, [
            "title",
            "style",
            "font",
            "a",
            "script"
        ]);
        /* Parsing of strict XHTML documents */ let PARSER_MEDIA_TYPE = null;
        const SUPPORTED_PARSER_MEDIA_TYPES = [
            "application/xhtml+xml",
            "text/html"
        ];
        const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
        let transformCaseFunc = null;
        /* Keep a reference to config to pass to hooks */ let CONFIG = null;
        /* Ideally, do not touch anything below this line */ /* ______________________________________________ */ const formElement = document.createElement("form");
        const isRegexOrFunction = function isRegexOrFunction(testValue) {
            return testValue instanceof RegExp || testValue instanceof Function;
        };
        /**
     * _parseConfig
     *
     * @param cfg optional config literal
     */ // eslint-disable-next-line complexity
        const _parseConfig = function _parseConfig() {
            let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            if (CONFIG && CONFIG === cfg) return;
            /* Shield configuration object from tampering */ if (!cfg || typeof cfg !== "object") cfg = {};
            /* Shield configuration object from prototype pollution */ cfg = clone(cfg);
            PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
            SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
            // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
            transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
            /* Set configuration parameters */ ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
            ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
            ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
            URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
            DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
            FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
            FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
            FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
            USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
            ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
            ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
            ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
            ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
            SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
            SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
            WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
            RETURN_DOM = cfg.RETURN_DOM || false; // Default false
            RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
            RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
            FORCE_BODY = cfg.FORCE_BODY || false; // Default false
            SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
            SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
            KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
            IN_PLACE = cfg.IN_PLACE || false; // Default false
            IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
            NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
            MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
            HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
            CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
            if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
            if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
            if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
            if (SAFE_FOR_TEMPLATES) ALLOW_DATA_ATTR = false;
            if (RETURN_DOM_FRAGMENT) RETURN_DOM = true;
            /* Parse profile info */ if (USE_PROFILES) {
                ALLOWED_TAGS = addToSet({}, text);
                ALLOWED_ATTR = [];
                if (USE_PROFILES.html === true) {
                    addToSet(ALLOWED_TAGS, html$1);
                    addToSet(ALLOWED_ATTR, html);
                }
                if (USE_PROFILES.svg === true) {
                    addToSet(ALLOWED_TAGS, svg$1);
                    addToSet(ALLOWED_ATTR, svg);
                    addToSet(ALLOWED_ATTR, xml);
                }
                if (USE_PROFILES.svgFilters === true) {
                    addToSet(ALLOWED_TAGS, svgFilters);
                    addToSet(ALLOWED_ATTR, svg);
                    addToSet(ALLOWED_ATTR, xml);
                }
                if (USE_PROFILES.mathMl === true) {
                    addToSet(ALLOWED_TAGS, mathMl$1);
                    addToSet(ALLOWED_ATTR, mathMl);
                    addToSet(ALLOWED_ATTR, xml);
                }
            }
            /* Merge configuration parameters */ if (cfg.ADD_TAGS) {
                if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) ALLOWED_TAGS = clone(ALLOWED_TAGS);
                addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
            }
            if (cfg.ADD_ATTR) {
                if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) ALLOWED_ATTR = clone(ALLOWED_ATTR);
                addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
            }
            if (cfg.ADD_URI_SAFE_ATTR) addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
            if (cfg.FORBID_CONTENTS) {
                if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) FORBID_CONTENTS = clone(FORBID_CONTENTS);
                addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
            }
            /* Add #text in case KEEP_CONTENT is set to true */ if (KEEP_CONTENT) ALLOWED_TAGS["#text"] = true;
            /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */ if (WHOLE_DOCUMENT) addToSet(ALLOWED_TAGS, [
                "html",
                "head",
                "body"
            ]);
            /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */ if (ALLOWED_TAGS.table) {
                addToSet(ALLOWED_TAGS, [
                    "tbody"
                ]);
                delete FORBID_TAGS.tbody;
            }
            if (cfg.TRUSTED_TYPES_POLICY) {
                if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
                if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
                // Overwrite existing TrustedTypes policy.
                trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
                // Sign local variables required by `sanitize`.
                emptyHTML = trustedTypesPolicy.createHTML("");
            } else {
                // Uninitialized policy, attempt to initialize the internal dompurify policy.
                if (trustedTypesPolicy === undefined) trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
                // If creating the internal policy succeeded sign internal variables.
                if (trustedTypesPolicy !== null && typeof emptyHTML === "string") emptyHTML = trustedTypesPolicy.createHTML("");
            }
            // Prevent further manipulation of configuration.
            // Not available in IE8, Safari 5, etc.
            if (freeze) freeze(cfg);
            CONFIG = cfg;
        };
        /* Keep track of all possible SVG and MathML tags
     * so that we can perform the namespace checks
     * correctly. */ const ALL_SVG_TAGS = addToSet({}, [
            ...svg$1,
            ...svgFilters,
            ...svgDisallowed
        ]);
        const ALL_MATHML_TAGS = addToSet({}, [
            ...mathMl$1,
            ...mathMlDisallowed
        ]);
        /**
     * @param element a DOM element whose namespace is being checked
     * @returns Return false if the element has a
     *  namespace that a spec-compliant parser would never
     *  return. Return true otherwise.
     */ const _checkValidNamespace = function _checkValidNamespace(element) {
            let parent = getParentNode(element);
            // In JSDOM, if we're inside shadow DOM, then parentNode
            // can be null. We just simulate parent in this case.
            if (!parent || !parent.tagName) parent = {
                namespaceURI: NAMESPACE,
                tagName: "template"
            };
            const tagName = stringToLowerCase(element.tagName);
            const parentTagName = stringToLowerCase(parent.tagName);
            if (!ALLOWED_NAMESPACES[element.namespaceURI]) return false;
            if (element.namespaceURI === SVG_NAMESPACE) {
                // The only way to switch from HTML namespace to SVG
                // is via <svg>. If it happens via any other tag, then
                // it should be killed.
                if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "svg";
                // The only way to switch from MathML to SVG is via`
                // svg if parent is either <annotation-xml> or MathML
                // text integration points.
                if (parent.namespaceURI === MATHML_NAMESPACE) return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
                // We only allow elements that are defined in SVG
                // spec. All others are disallowed in SVG namespace.
                return Boolean(ALL_SVG_TAGS[tagName]);
            }
            if (element.namespaceURI === MATHML_NAMESPACE) {
                // The only way to switch from HTML namespace to MathML
                // is via <math>. If it happens via any other tag, then
                // it should be killed.
                if (parent.namespaceURI === HTML_NAMESPACE) return tagName === "math";
                // The only way to switch from SVG to MathML is via
                // <math> and HTML integration points
                if (parent.namespaceURI === SVG_NAMESPACE) return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
                // We only allow elements that are defined in MathML
                // spec. All others are disallowed in MathML namespace.
                return Boolean(ALL_MATHML_TAGS[tagName]);
            }
            if (element.namespaceURI === HTML_NAMESPACE) {
                // The only way to switch from SVG to HTML is via
                // HTML integration points, and from MathML to HTML
                // is via MathML text integration points
                if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) return false;
                if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) return false;
                // We disallow tags that are specific for MathML
                // or SVG and should never appear in HTML namespace
                return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
            }
            // For XHTML and XML documents that support custom namespaces
            if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) return true;
            // The code should never reach this place (this means
            // that the element somehow got namespace that is not
            // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
            // Return false just in case.
            return false;
        };
        /**
     * _forceRemove
     *
     * @param node a DOM node
     */ const _forceRemove = function _forceRemove(node) {
            arrayPush(DOMPurify.removed, {
                element: node
            });
            try {
                // eslint-disable-next-line unicorn/prefer-dom-node-remove
                getParentNode(node).removeChild(node);
            } catch (_) {
                remove(node);
            }
        };
        /**
     * _removeAttribute
     *
     * @param name an Attribute name
     * @param element a DOM node
     */ const _removeAttribute = function _removeAttribute(name, element) {
            try {
                arrayPush(DOMPurify.removed, {
                    attribute: element.getAttributeNode(name),
                    from: element
                });
            } catch (_) {
                arrayPush(DOMPurify.removed, {
                    attribute: null,
                    from: element
                });
            }
            element.removeAttribute(name);
            // We void attribute values for unremovable "is" attributes
            if (name === "is") {
                if (RETURN_DOM || RETURN_DOM_FRAGMENT) try {
                    _forceRemove(element);
                } catch (_) {}
                else try {
                    element.setAttribute(name, "");
                } catch (_) {}
            }
        };
        /**
     * _initDocument
     *
     * @param dirty - a string of dirty markup
     * @return a DOM, filled with the dirty markup
     */ const _initDocument = function _initDocument(dirty) {
            /* Create a HTML document */ let doc = null;
            let leadingWhitespace = null;
            if (FORCE_BODY) dirty = "<remove></remove>" + dirty;
            else {
                /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */ const matches = stringMatch(dirty, /^[\r\n\t ]+/);
                leadingWhitespace = matches && matches[0];
            }
            if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
            dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
            const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
            /*
       * Use the DOMParser API by default, fallback later if needs be
       * DOMParser not work for svg when has multiple root element.
       */ if (NAMESPACE === HTML_NAMESPACE) try {
                doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
            } catch (_) {}
            /* Use createHTMLDocument in case DOMParser is not available */ if (!doc || !doc.documentElement) {
                doc = implementation.createDocument(NAMESPACE, "template", null);
                try {
                    doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
                } catch (_) {
                // Syntax error if dirtyPayload is invalid xml
                }
            }
            const body = doc.body || doc.documentElement;
            if (dirty && leadingWhitespace) body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
            /* Work on whole document or just its body */ if (NAMESPACE === HTML_NAMESPACE) return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
            return WHOLE_DOCUMENT ? doc.documentElement : body;
        };
        /**
     * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
     *
     * @param root The root element or node to start traversing on.
     * @return The created NodeIterator
     */ const _createNodeIterator = function _createNodeIterator(root) {
            return createNodeIterator.call(root.ownerDocument || root, root, // eslint-disable-next-line no-bitwise
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
        };
        /**
     * _isClobbered
     *
     * @param element element to check for clobbering attacks
     * @return true if clobbered, false if safe
     */ const _isClobbered = function _isClobbered(element) {
            return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
        };
        /**
     * Checks whether the given object is a DOM node.
     *
     * @param value object to check whether it's a DOM node
     * @return true is object is a DOM node
     */ const _isNode = function _isNode(value) {
            return typeof Node === "function" && value instanceof Node;
        };
        function _executeHooks(hooks, currentNode, data) {
            arrayForEach(hooks, (hook)=>{
                hook.call(DOMPurify, currentNode, data, CONFIG);
            });
        }
        /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     * @param currentNode to check for permission to exist
     * @return true if node was killed, false if left alive
     */ const _sanitizeElements = function _sanitizeElements(currentNode) {
            let content = null;
            /* Execute a hook if present */ _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
            /* Check if element is clobbered or can clobber */ if (_isClobbered(currentNode)) {
                _forceRemove(currentNode);
                return true;
            }
            /* Now let's check the element's type and name */ const tagName = transformCaseFunc(currentNode.nodeName);
            /* Execute a hook if present */ _executeHooks(hooks.uponSanitizeElement, currentNode, {
                tagName,
                allowedTags: ALLOWED_TAGS
            });
            /* Detect mXSS attempts abusing namespace confusion */ if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
                _forceRemove(currentNode);
                return true;
            }
            /* Remove any occurrence of processing instructions */ if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
                _forceRemove(currentNode);
                return true;
            }
            /* Remove any kind of possibly harmful comments */ if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
                _forceRemove(currentNode);
                return true;
            }
            /* Remove element if anything forbids its presence */ if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
                /* Check if we have a custom element to handle */ if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
                    if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) return false;
                    if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) return false;
                }
                /* Keep content except for bad-listed elements */ if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
                    const parentNode = getParentNode(currentNode) || currentNode.parentNode;
                    const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
                    if (childNodes && parentNode) {
                        const childCount = childNodes.length;
                        for(let i = childCount - 1; i >= 0; --i){
                            const childClone = cloneNode(childNodes[i], true);
                            childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
                            parentNode.insertBefore(childClone, getNextSibling(currentNode));
                        }
                    }
                }
                _forceRemove(currentNode);
                return true;
            }
            /* Check whether element has a valid namespace */ if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
                _forceRemove(currentNode);
                return true;
            }
            /* Make sure that older browsers don't get fallback-tag mXSS */ if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
                _forceRemove(currentNode);
                return true;
            }
            /* Sanitize element content to be template-safe */ if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
                /* Get the element's text content */ content = currentNode.textContent;
                arrayForEach([
                    MUSTACHE_EXPR,
                    ERB_EXPR,
                    TMPLIT_EXPR
                ], (expr)=>{
                    content = stringReplace(content, expr, " ");
                });
                if (currentNode.textContent !== content) {
                    arrayPush(DOMPurify.removed, {
                        element: currentNode.cloneNode()
                    });
                    currentNode.textContent = content;
                }
            }
            /* Execute a hook if present */ _executeHooks(hooks.afterSanitizeElements, currentNode, null);
            return false;
        };
        /**
     * _isValidAttribute
     *
     * @param lcTag Lowercase tag name of containing element.
     * @param lcName Lowercase attribute name.
     * @param value Attribute value.
     * @return Returns true if `value` is valid, otherwise false.
     */ // eslint-disable-next-line complexity
        const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
            /* Make sure attribute cannot clobber */ if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document || value in formElement)) return false;
            /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */ if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ;
            else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ;
            else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
                if (// First condition does a very basic check if a) it's basically a valid custom element tagname AND
                // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
                // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
                _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
                // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
                lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ;
                else return false;
            /* Check value is safe. First, is attr inert? If so, is safe */ } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
            else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ""))) ;
            else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
            else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ""))) ;
            else if (value) return false;
            return true;
        };
        /**
     * _isBasicCustomElement
     * checks if at least one dash is included in tagName, and it's not the first char
     * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
     *
     * @param tagName name of the tag of the node to sanitize
     * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
     */ const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
            return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT);
        };
        /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param currentNode to sanitize
     */ const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
            /* Execute a hook if present */ _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
            const { attributes } = currentNode;
            /* Check if we have attributes; if not we might have a text node */ if (!attributes || _isClobbered(currentNode)) return;
            const hookEvent = {
                attrName: "",
                attrValue: "",
                keepAttr: true,
                allowedAttributes: ALLOWED_ATTR,
                forceKeepAttr: undefined
            };
            let l = attributes.length;
            /* Go backwards over all attributes; safely remove bad ones */ while(l--){
                const attr = attributes[l];
                const { name, namespaceURI, value: attrValue } = attr;
                const lcName = transformCaseFunc(name);
                const initValue = attrValue;
                let value = name === "value" ? initValue : stringTrim(initValue);
                /* Execute a hook if present */ hookEvent.attrName = lcName;
                hookEvent.attrValue = value;
                hookEvent.keepAttr = true;
                hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
                _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
                value = hookEvent.attrValue;
                /* Full DOM Clobbering protection via namespace isolation,
         * Prefix id and name attributes with `user-content-`
         */ if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
                    // Remove the attribute with this value
                    _removeAttribute(name, currentNode);
                    // Prefix the value and later re-create the attribute with the sanitized value
                    value = SANITIZE_NAMED_PROPS_PREFIX + value;
                }
                /* Work around a security issue with comments inside attributes */ if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title)/i, value)) {
                    _removeAttribute(name, currentNode);
                    continue;
                }
                /* Did the hooks approve of the attribute? */ if (hookEvent.forceKeepAttr) continue;
                /* Did the hooks approve of the attribute? */ if (!hookEvent.keepAttr) {
                    _removeAttribute(name, currentNode);
                    continue;
                }
                /* Work around a security issue in jQuery 3.0 */ if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
                    _removeAttribute(name, currentNode);
                    continue;
                }
                /* Sanitize attribute content to be template-safe */ if (SAFE_FOR_TEMPLATES) arrayForEach([
                    MUSTACHE_EXPR,
                    ERB_EXPR,
                    TMPLIT_EXPR
                ], (expr)=>{
                    value = stringReplace(value, expr, " ");
                });
                /* Is `value` valid for this attribute? */ const lcTag = transformCaseFunc(currentNode.nodeName);
                if (!_isValidAttribute(lcTag, lcName, value)) {
                    _removeAttribute(name, currentNode);
                    continue;
                }
                /* Handle attributes that require Trusted Types */ if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
                    if (namespaceURI) ;
                    else switch(trustedTypes.getAttributeType(lcTag, lcName)){
                        case "TrustedHTML":
                            value = trustedTypesPolicy.createHTML(value);
                            break;
                        case "TrustedScriptURL":
                            value = trustedTypesPolicy.createScriptURL(value);
                            break;
                    }
                }
                /* Handle invalid data-* attribute set by try-catching it */ if (value !== initValue) try {
                    if (namespaceURI) currentNode.setAttributeNS(namespaceURI, name, value);
                    else /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */ currentNode.setAttribute(name, value);
                    if (_isClobbered(currentNode)) _forceRemove(currentNode);
                    else arrayPop(DOMPurify.removed);
                } catch (_) {
                    _removeAttribute(name, currentNode);
                }
            }
            /* Execute a hook if present */ _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
        };
        /**
     * _sanitizeShadowDOM
     *
     * @param fragment to iterate over recursively
     */ const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
            let shadowNode = null;
            const shadowIterator = _createNodeIterator(fragment);
            /* Execute a hook if present */ _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
            while(shadowNode = shadowIterator.nextNode()){
                /* Execute a hook if present */ _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
                /* Sanitize tags and elements */ _sanitizeElements(shadowNode);
                /* Check attributes next */ _sanitizeAttributes(shadowNode);
                /* Deep shadow DOM detected */ if (shadowNode.content instanceof DocumentFragment) _sanitizeShadowDOM(shadowNode.content);
            }
            /* Execute a hook if present */ _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
        };
        // eslint-disable-next-line complexity
        DOMPurify.sanitize = function(dirty) {
            let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            let body = null;
            let importedNode = null;
            let currentNode = null;
            let returnNode = null;
            /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */ IS_EMPTY_INPUT = !dirty;
            if (IS_EMPTY_INPUT) dirty = "<!-->";
            /* Stringify, in case dirty is an object */ if (typeof dirty !== "string" && !_isNode(dirty)) {
                if (typeof dirty.toString === "function") {
                    dirty = dirty.toString();
                    if (typeof dirty !== "string") throw typeErrorCreate("dirty is not a string, aborting");
                } else throw typeErrorCreate("toString is not a function");
            }
            /* Return dirty HTML if DOMPurify cannot run */ if (!DOMPurify.isSupported) return dirty;
            /* Assign config vars */ if (!SET_CONFIG) _parseConfig(cfg);
            /* Clean up removed elements */ DOMPurify.removed = [];
            /* Check if dirty is correctly typed for IN_PLACE */ if (typeof dirty === "string") IN_PLACE = false;
            if (IN_PLACE) /* Do some early pre-sanitization to avoid unsafe root nodes */ {
                if (dirty.nodeName) {
                    const tagName = transformCaseFunc(dirty.nodeName);
                    if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
                }
            } else if (dirty instanceof Node) {
                /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */ body = _initDocument("<!---->");
                importedNode = body.ownerDocument.importNode(dirty, true);
                if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") /* Node is already a body, use as is */ body = importedNode;
                else if (importedNode.nodeName === "HTML") body = importedNode;
                else // eslint-disable-next-line unicorn/prefer-dom-node-append
                body.appendChild(importedNode);
            } else {
                /* Exit directly if we have nothing to do */ if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
                dirty.indexOf("<") === -1) return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
                /* Initialize the document to work on */ body = _initDocument(dirty);
                /* Check we have a DOM node from the data */ if (!body) return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
            }
            /* Remove first element node (ours) if FORCE_BODY is set */ if (body && FORCE_BODY) _forceRemove(body.firstChild);
            /* Get node iterator */ const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
            /* Now start iterating over the created document */ while(currentNode = nodeIterator.nextNode()){
                /* Sanitize tags and elements */ _sanitizeElements(currentNode);
                /* Check attributes next */ _sanitizeAttributes(currentNode);
                /* Shadow DOM detected, sanitize it */ if (currentNode.content instanceof DocumentFragment) _sanitizeShadowDOM(currentNode.content);
            }
            /* If we sanitized `dirty` in-place, return it. */ if (IN_PLACE) return dirty;
            /* Return sanitized string or DOM */ if (RETURN_DOM) {
                if (RETURN_DOM_FRAGMENT) {
                    returnNode = createDocumentFragment.call(body.ownerDocument);
                    while(body.firstChild)// eslint-disable-next-line unicorn/prefer-dom-node-append
                    returnNode.appendChild(body.firstChild);
                } else returnNode = body;
                if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) /*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */ returnNode = importNode.call(originalDocument, returnNode, true);
                return returnNode;
            }
            let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
            /* Serialize doctype if allowed */ if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
            /* Sanitize final string template-safe */ if (SAFE_FOR_TEMPLATES) arrayForEach([
                MUSTACHE_EXPR,
                ERB_EXPR,
                TMPLIT_EXPR
            ], (expr)=>{
                serializedHTML = stringReplace(serializedHTML, expr, " ");
            });
            return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
        };
        DOMPurify.setConfig = function() {
            let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            _parseConfig(cfg);
            SET_CONFIG = true;
        };
        DOMPurify.clearConfig = function() {
            CONFIG = null;
            SET_CONFIG = false;
        };
        DOMPurify.isValidAttribute = function(tag, attr, value) {
            /* Initialize shared config vars if necessary. */ if (!CONFIG) _parseConfig({});
            const lcTag = transformCaseFunc(tag);
            const lcName = transformCaseFunc(attr);
            return _isValidAttribute(lcTag, lcName, value);
        };
        DOMPurify.addHook = function(entryPoint, hookFunction) {
            if (typeof hookFunction !== "function") return;
            arrayPush(hooks[entryPoint], hookFunction);
        };
        DOMPurify.removeHook = function(entryPoint, hookFunction) {
            if (hookFunction !== undefined) {
                const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
                return index === -1 ? undefined : arraySplice(hooks[entryPoint], index, 1)[0];
            }
            return arrayPop(hooks[entryPoint]);
        };
        DOMPurify.removeHooks = function(entryPoint) {
            hooks[entryPoint] = [];
        };
        DOMPurify.removeAllHooks = function() {
            hooks = _createHooksMap();
        };
        return DOMPurify;
    }
    var purify = createDOMPurify();
    return purify;
});

},{}],"dzgHD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "VideoPlatforms", ()=>VideoPlatforms);
parcelHelpers.export(exports, "getVideoPlatformHooks", ()=>getVideoPlatformHooks);
parcelHelpers.export(exports, "getPlatform", ()=>getPlatform);
parcelHelpers.export(exports, "videoPlatformDataRecords", ()=>videoPlatformDataRecords);
var _util = require("../util/util");
var _fs = require("fs");
const youtubeCSS = "";
const vliveCSS = "#shortcutsTableToggleButton {\n  width: 30px;\n  top: -7px;\n  left: 10px;\n}\n\n#markers-upload-div input[type='file'],\n#settings-editor-div input[type='checkbox'],\n#settings-editor-div input[type='radio'] {\n  position: static;\n  width: auto;\n  height: auto;\n  opacity: 1;\n  appearance: auto;\n  -webkit-appearance: auto;\n  -moz-appearance: auto;\n}\n\n._click_zone[data-title-container] {\n  pointer-events: none !important;\n}\n\ndiv[class*='layout_main'] {\n  width: 100% !important;\n  margin: 5px auto 0px;\n}\ndiv[class*='layout_content'] {\n  width: 98% !important;\n  margin-left: 1%;\n}\ndiv[class*='lnb'] {\n  display: none;\n}\n\n@media (min-width: 1024px) {\n  div[class*='snb'] {\n    display: none;\n  }\n}\n";
const naver_tvCSS = "#shortcutsTableToggleButton {\n  width: 40px;\n  display: inline-block;\n  background-color: transparent;\n  border: transparent;\n  top: -3px;\n}\n\n#markers-div {\n  height: 11px;\n}\n\n#markers-svg,\n#selected-marker-pair-overlay,\n#start-marker-numberings,\n#end-marker-numberings {\n  font-size: 6.5pt;\n  width: 100%;\n  height: 300%;\n  top: 2px;\n  position: absolute;\n  z-index: 99;\n  paint-order: stroke;\n  stroke: rgba(0, 0, 0, 0.25);\n  stroke-width: 2px;\n}\n\n#start-marker-numberings {\n  top: -13px;\n  height: 13px;\n}\n\n#end-marker-numberings {\n  top: 13px;\n  height: 13px;\n}\n";
const weverseCSS = "#shortcutsTableToggleButton {\n  width: 40px;\n  display: inline-block;\n  background-color: transparent;\n  border: transparent;\n}\n\n#markers-svg,\n#selected-marker-pair-overlay,\n#start-marker-numberings,\n#end-marker-numberings {\n  font-size: 6.5pt;\n  width: 100%;\n  height: 100%;\n  top: 2px;\n  position: absolute;\n  z-index: 99;\n  paint-order: stroke;\n  stroke: rgba(0, 0, 0, 0.25);\n  stroke-width: 2px;\n}\n\n.slider {\n  padding-bottom: 15px !important;\n}\n\n\n#start-marker-numberings {\n  top: -13px;\n}\n\n#end-marker-numberings {\n  top: 13px;\n}\n\n.pzp-pc__bottom-buttons {\n  top: 8px;\n}\n";
const afreecatvCSS = "#shortcutsTableToggleButton {\n  width: 40px;\n  display: inline-block;\n  background-color: transparent;\n  border: transparent;\n  top: -3px;\n}\n\n#markers-div {\n  height: 14px;\n  position: relative;\n  top: -6px;\n}\n\n#markers-svg,\n#selected-marker-pair-overlay,\n#start-marker-numberings,\n#end-marker-numberings {\n  font-size: 6.5pt;\n  width: 100%;\n  height: 300%;\n  top: 2px;\n  z-index: 99;\n  position: absolute;\n  paint-order: stroke;\n  stroke: rgba(0, 0, 0, 0.25);\n  stroke-width: 2px;\n}\n\n\n\n.progress {\n  padding-bottom: 25px !important;\n}\n\n#start-marker-numberings {\n  top: -20px;\n  height: 13px;\n}\n\n#end-marker-numberings {\n  top: 8px;\n  height: 13px;\n}\n";
const ytclipperCSS = "#markers-svg,\n#selected-marker-pair-overlay,\n#start-marker-numberings,\n#end-marker-numberings {\n  font-size: 6.5pt;\n  width: 100%;\n  height: 20px;\n  top: 8px;\n  z-index: 99;\n  position: absolute;\n  paint-order: stroke;\n  stroke: rgba(0, 0, 0, 0.25);\n  stroke-width: 2px;\n  pointer-events: none;\n}\n\n#start-marker-numberings {\n  top: -5px;\n  height: 13px;\n}\n\n#end-marker-numberings {\n  top: 20px;\n  height: 13px;\n}\n\n#shortcutsTableToggleButton {\n  width: 40px;\n}\n";
var VideoPlatforms;
(function(VideoPlatforms) {
    VideoPlatforms["youtube"] = "youtube";
    VideoPlatforms["vlive"] = "vlive";
    VideoPlatforms["weverse"] = "weverse";
    VideoPlatforms["naver_tv"] = "naver_tv";
    VideoPlatforms["afreecatv"] = "afreecatv";
    VideoPlatforms["yt_clipper"] = "ytc_generic";
})(VideoPlatforms || (VideoPlatforms = {}));
function getVideoPlatformHooks(selectors) {
    return (0, _util.querySelectors)(selectors);
}
function getPlatform() {
    const host = window.location.hostname;
    if (host.includes("youtube")) return "youtube";
    else if (host.includes("vlive")) return "vlive";
    else if (host.includes("weverse")) return "weverse";
    else if (host.includes("tv.naver")) return "naver_tv";
    else if (host.includes("afreecatv.com")) return "afreecatv";
    else if (host.includes("exwm.github.io") || host.includes("127.0.0.1") || host.includes("localhost")) return "ytc_generic";
    else return "youtube";
}
const youtubeSelectors = {
    playerContainer: "#ytd-player #container",
    player: "#movie_player",
    videoContainer: "#ytd-player #container",
    video: "video",
    markersDiv: ".ytp-progress-bar",
    theaterModeIndicator: "ytd-watch-flexy",
    progressBar: ".ytp-progress-bar",
    settingsEditor: "#below",
    settingsEditorTheater: "#full-bleed-container",
    shortcutsTable: "#below",
    frameCapturerProgressBar: "#below",
    flashMessage: "#below",
    cropOverlay: ".html5-video-container",
    cropMouseManipulation: ".html5-video-container",
    speedChartContainer: ".html5-video-container",
    cropChartContainer: "#columns",
    markerNumberingsDiv: ".ytp-chrome-bottom",
    controls: ".ytp-chrome-bottom",
    controlsGradient: ".ytp-gradient-bottom",
    shortcutsTableButton: ".ytp-right-controls",
    playerClickZone: ".html5-video-container"
};
const vliveSelectors = {
    playerContainer: "div[class*=player_area]",
    player: 'div[id$="videoArea"]',
    videoContainer: 'div[id$="videoArea"]',
    video: "video",
    progressBar: ".u_rmc_progress_bar",
    markersDiv: ".u_rmc_progress_bar",
    theaterModeIndicator: "placeholder",
    settingsEditor: "div[class*=player_area]",
    settingsEditorTheater: "div[class*=player_area]",
    shortcutsTable: '[class*="video_title"]',
    frameCapturerProgressBar: '[class*="video_title"]',
    flashMessage: '[class*="video_title"]',
    cropOverlay: 'div[id$="videoArea"]',
    cropMouseManipulation: "._click_zone[data-video-overlay]",
    speedChartContainer: "._click_zone[data-video-overlay]",
    cropChartContainer: '[class*="video_title"]',
    markerNumberingsDiv: ".u_rmc_progress_bar_container",
    controls: ".u_rmcplayer_control",
    controlsGradient: ".u_rmcplayer_control_bg._click_zone",
    shortcutsTableButton: "div[class*=video_content]",
    playerClickZone: "._click_zone[data-video-overlay]"
};
const naver_tvSelectors = {
    playerContainer: "div[class=webplayer-internal-source-shadow]",
    player: "div[class=webplayer-internal-source-wrapper]",
    playerClickZone: ".webplayer-internal-source-wrapper",
    videoContainer: "div[class=webplayer-internal-source-wrapper]",
    video: "video",
    progressBar: ".pzp-pc__progress-slider",
    markersDiv: ".pzp-ui-slider__wrap",
    markerNumberingsDiv: ".pzp-ui-slider__wrap",
    theaterModeIndicator: "placeholder",
    settingsEditor: "div[class*=ArticleSection_article_section]",
    settingsEditorTheater: "div[class*=ArticleSection_article_section]",
    shortcutsTable: "div[class*=ArticleSection_article_section]",
    frameCapturerProgressBar: "div[class*=ArticleSection_article_section]",
    flashMessage: "div[class*=ArticleSection_article_section]",
    cropOverlay: ".webplayer-internal-source-wrapper",
    cropMouseManipulation: ".webplayer-internal-source-wrapper",
    speedChartContainer: ".webplayer-internal-video",
    cropChartContainer: "div[class*=ArticleSection_article_section]",
    controls: ".pzp-pc__bottom",
    controlsGradient: ".pzp-pc__bottom-shadow",
    shortcutsTableButton: ".pzp-pc__bottom-buttons-right"
};
const weverseSelectors = {
    playerContainer: "div[class=webplayer-internal-source-shadow]",
    player: "div[class=webplayer-internal-source-wrapper]",
    playerClickZone: ".webplayer-internal-source-wrapper",
    videoContainer: "div[class=webplayer-internal-source-wrapper]",
    video: "video",
    progressBar: ".pzp-pc__progress-slider",
    markersDiv: ".pzp-pc__progress-slider",
    markerNumberingsDiv: ".pzp-pc__progress-slider",
    theaterModeIndicator: "placeholder",
    settingsEditor: "div[class*=HeaderView_container]",
    settingsEditorTheater: "div[class*=HeaderView_container]",
    shortcutsTable: 'div[class*="HeaderView_container"]',
    frameCapturerProgressBar: 'div[class*="HeaderView_container"]',
    flashMessage: 'div[class*="HeaderView_container"]',
    cropOverlay: ".webplayer-internal-source-wrapper",
    cropMouseManipulation: ".webplayer-internal-source-wrapper",
    speedChartContainer: ".webplayer-internal-video",
    cropChartContainer: 'div[class*="HeaderView_container"]',
    controls: ".pzp-pc__bottom-buttons",
    controlsGradient: ".pzp-pc__bottom-buttons",
    shortcutsTableButton: ".pzp-pc__bottom-buttons-right"
};
const afreecaPlayerItemListSelector = "div[class~=player_item_list]";
const afreecatvSelectors = {
    playerContainer: "div[class~=htmlplayer_wrap]",
    player: "div[id=afreecatv_player]",
    playerClickZone: "div[id=afreecatv_player]",
    videoContainer: "div[id=videoLayer]",
    video: "video[id=video]",
    progressBar: "div[class~=progress_track]",
    markersDiv: "div[class~=progress_track]",
    markerNumberingsDiv: "div[class~=progress_track]",
    theaterModeIndicator: "placeholder",
    settingsEditor: afreecaPlayerItemListSelector,
    settingsEditorTheater: afreecaPlayerItemListSelector,
    shortcutsTable: afreecaPlayerItemListSelector,
    frameCapturerProgressBar: afreecaPlayerItemListSelector,
    flashMessage: afreecaPlayerItemListSelector,
    cropOverlay: "div[id=afreecatv_player]",
    cropMouseManipulation: "div[id=afreecatv_player]",
    speedChartContainer: "div[id=videoLayer]",
    cropChartContainer: afreecaPlayerItemListSelector,
    controls: "div[class~=ctrl]",
    controlsGradient: "div[class~=ctrl]",
    shortcutsTableButton: "div[class~=right_ctrl]"
};
const ytclipperSelectors = {
    playerContainer: "div[id=ytc-media-player-container]",
    player: "#my-video",
    playerClickZone: "div[id=ytc-media-player-container]",
    videoContainer: "div[id=ytc-media-player-container]",
    video: "video",
    progressBar: ".vjs-progress-control",
    markersDiv: ".vjs-progress-control",
    markerNumberingsDiv: ".vjs-progress-control",
    theaterModeIndicator: "placeholder",
    settingsEditor: "#ytc-editor",
    settingsEditorTheater: "#ytc-editor",
    shortcutsTable: "#ytc-editor",
    frameCapturerProgressBar: "#ytc-editor",
    flashMessage: "#ytc-editor",
    cropOverlay: "#my-video",
    cropMouseManipulation: "#my-video",
    speedChartContainer: "video",
    cropChartContainer: "#ytc-editor",
    controls: ".vjs-control-bar",
    controlsGradient: ".vjs-control-bar",
    shortcutsTableButton: ".vjs-fullscreen-control"
};
const youtubeData = {
    selectors: youtubeSelectors,
    css: youtubeCSS
};
const vliveData = {
    selectors: vliveSelectors,
    css: vliveCSS
};
const weverseData = {
    selectors: weverseSelectors,
    css: weverseCSS
};
const naver_tvData = {
    selectors: naver_tvSelectors,
    css: naver_tvCSS
};
const afreecaData = {
    selectors: afreecatvSelectors,
    css: afreecatvCSS
};
const ytclipperData = {
    selectors: ytclipperSelectors,
    css: ytclipperCSS
};
const videoPlatformDataRecords = {
    ["youtube"]: youtubeData,
    ["weverse"]: weverseData,
    ["vlive"]: vliveData,
    ["naver_tv"]: naver_tvData,
    ["afreecatv"]: afreecaData,
    ["ytc_generic"]: ytclipperData
};

},{"../util/util":"jxJ0L","fs":"fDIL2","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"fDIL2":[function(require,module,exports) {
"use strict";

},{}],"j0WhR":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"6nh3m":[function(require,module,exports) {
// core
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "TemplateTag", ()=>(0, _templateTagDefault.default));
parcelHelpers.export(exports, "trimResultTransformer", ()=>(0, _trimResultTransformerDefault.default));
parcelHelpers.export(exports, "stripIndentTransformer", ()=>(0, _stripIndentTransformerDefault.default));
parcelHelpers.export(exports, "replaceResultTransformer", ()=>(0, _replaceResultTransformerDefault.default));
parcelHelpers.export(exports, "replaceSubstitutionTransformer", ()=>(0, _replaceSubstitutionTransformerDefault.default));
parcelHelpers.export(exports, "replaceStringTransformer", ()=>(0, _replaceStringTransformerDefault.default));
parcelHelpers.export(exports, "inlineArrayTransformer", ()=>(0, _inlineArrayTransformerDefault.default));
parcelHelpers.export(exports, "splitStringTransformer", ()=>(0, _splitStringTransformerDefault.default));
parcelHelpers.export(exports, "removeNonPrintingValuesTransformer", ()=>(0, _removeNonPrintingValuesTransformerDefault.default));
parcelHelpers.export(exports, "commaLists", ()=>(0, _commaListsDefault.default));
parcelHelpers.export(exports, "commaListsAnd", ()=>(0, _commaListsAndDefault.default));
parcelHelpers.export(exports, "commaListsOr", ()=>(0, _commaListsOrDefault.default));
parcelHelpers.export(exports, "html", ()=>(0, _htmlDefault.default));
parcelHelpers.export(exports, "codeBlock", ()=>(0, _codeBlockDefault.default));
parcelHelpers.export(exports, "source", ()=>(0, _sourceDefault.default));
parcelHelpers.export(exports, "safeHtml", ()=>(0, _safeHtmlDefault.default));
parcelHelpers.export(exports, "oneLine", ()=>(0, _oneLineDefault.default));
parcelHelpers.export(exports, "oneLineTrim", ()=>(0, _oneLineTrimDefault.default));
parcelHelpers.export(exports, "oneLineCommaLists", ()=>(0, _oneLineCommaListsDefault.default));
parcelHelpers.export(exports, "oneLineCommaListsOr", ()=>(0, _oneLineCommaListsOrDefault.default));
parcelHelpers.export(exports, "oneLineCommaListsAnd", ()=>(0, _oneLineCommaListsAndDefault.default));
parcelHelpers.export(exports, "inlineLists", ()=>(0, _inlineListsDefault.default));
parcelHelpers.export(exports, "oneLineInlineLists", ()=>(0, _oneLineInlineListsDefault.default));
parcelHelpers.export(exports, "stripIndent", ()=>(0, _stripIndentDefault.default));
parcelHelpers.export(exports, "stripIndents", ()=>(0, _stripIndentsDefault.default));
var _templateTag = require("./TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
// transformers
var _trimResultTransformer = require("./trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _stripIndentTransformer = require("./stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _replaceResultTransformer = require("./replaceResultTransformer");
var _replaceResultTransformerDefault = parcelHelpers.interopDefault(_replaceResultTransformer);
var _replaceSubstitutionTransformer = require("./replaceSubstitutionTransformer");
var _replaceSubstitutionTransformerDefault = parcelHelpers.interopDefault(_replaceSubstitutionTransformer);
var _replaceStringTransformer = require("./replaceStringTransformer");
var _replaceStringTransformerDefault = parcelHelpers.interopDefault(_replaceStringTransformer);
var _inlineArrayTransformer = require("./inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _splitStringTransformer = require("./splitStringTransformer");
var _splitStringTransformerDefault = parcelHelpers.interopDefault(_splitStringTransformer);
var _removeNonPrintingValuesTransformer = require("./removeNonPrintingValuesTransformer");
var _removeNonPrintingValuesTransformerDefault = parcelHelpers.interopDefault(_removeNonPrintingValuesTransformer);
// tags
var _commaLists = require("./commaLists");
var _commaListsDefault = parcelHelpers.interopDefault(_commaLists);
var _commaListsAnd = require("./commaListsAnd");
var _commaListsAndDefault = parcelHelpers.interopDefault(_commaListsAnd);
var _commaListsOr = require("./commaListsOr");
var _commaListsOrDefault = parcelHelpers.interopDefault(_commaListsOr);
var _html = require("./html");
var _htmlDefault = parcelHelpers.interopDefault(_html);
var _codeBlock = require("./codeBlock");
var _codeBlockDefault = parcelHelpers.interopDefault(_codeBlock);
var _source = require("./source");
var _sourceDefault = parcelHelpers.interopDefault(_source);
var _safeHtml = require("./safeHtml");
var _safeHtmlDefault = parcelHelpers.interopDefault(_safeHtml);
var _oneLine = require("./oneLine");
var _oneLineDefault = parcelHelpers.interopDefault(_oneLine);
var _oneLineTrim = require("./oneLineTrim");
var _oneLineTrimDefault = parcelHelpers.interopDefault(_oneLineTrim);
var _oneLineCommaLists = require("./oneLineCommaLists");
var _oneLineCommaListsDefault = parcelHelpers.interopDefault(_oneLineCommaLists);
var _oneLineCommaListsOr = require("./oneLineCommaListsOr");
var _oneLineCommaListsOrDefault = parcelHelpers.interopDefault(_oneLineCommaListsOr);
var _oneLineCommaListsAnd = require("./oneLineCommaListsAnd");
var _oneLineCommaListsAndDefault = parcelHelpers.interopDefault(_oneLineCommaListsAnd);
var _inlineLists = require("./inlineLists");
var _inlineListsDefault = parcelHelpers.interopDefault(_inlineLists);
var _oneLineInlineLists = require("./oneLineInlineLists");
var _oneLineInlineListsDefault = parcelHelpers.interopDefault(_oneLineInlineLists);
var _stripIndent = require("./stripIndent");
var _stripIndentDefault = parcelHelpers.interopDefault(_stripIndent);
var _stripIndents = require("./stripIndents");
var _stripIndentsDefault = parcelHelpers.interopDefault(_stripIndents);

},{"./TemplateTag":"2bjtX","./trimResultTransformer":"iqen2","./stripIndentTransformer":"5UJ4O","./replaceResultTransformer":"7Y6hj","./replaceSubstitutionTransformer":"hBYtU","./replaceStringTransformer":"7d4k5","./inlineArrayTransformer":"lGv86","./splitStringTransformer":"048rM","./removeNonPrintingValuesTransformer":"5ICzM","./commaLists":"bXQgC","./commaListsAnd":"fZncs","./commaListsOr":"jVIW1","./html":"JBxxZ","./codeBlock":"kbj7m","./source":"4mmIa","./safeHtml":"fuzZK","./oneLine":"8E6Xj","./oneLineTrim":"aCeIA","./oneLineCommaLists":"6qkCc","./oneLineCommaListsOr":"k7SVA","./oneLineCommaListsAnd":"jjYVM","./inlineLists":"2legI","./oneLineInlineLists":"bRmGD","./stripIndent":"jYP6Y","./stripIndents":"2TzWl","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"2bjtX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _templateTagDefault.default));
var _templateTag = require("./TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);

},{"./TemplateTag":"5nFHL","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"5nFHL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _createClass = function() {
    function defineProperties(target, props) {
        for(var i = 0; i < props.length; i++){
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();
var _templateObject = _taggedTemplateLiteral([
    "",
    ""
], [
    "",
    ""
]);
function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
/**
 * @class TemplateTag
 * @classdesc Consumes a pipeline of composable transformer plugins and produces a template tag.
 */ var TemplateTag = function() {
    /**
   * constructs a template tag
   * @constructs TemplateTag
   * @param  {...Object} [...transformers] - an array or arguments list of transformers
   * @return {Function}                    - a template tag
   */ function TemplateTag() {
        var _this = this;
        for(var _len = arguments.length, transformers = Array(_len), _key = 0; _key < _len; _key++)transformers[_key] = arguments[_key];
        _classCallCheck(this, TemplateTag);
        this.tag = function(strings) {
            for(var _len2 = arguments.length, expressions = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++)expressions[_key2 - 1] = arguments[_key2];
            if (typeof strings === "function") // if the first argument passed is a function, assume it is a template tag and return
            // an intermediary tag that processes the template using the aforementioned tag, passing the
            // result to our tag
            return _this.interimTag.bind(_this, strings);
            if (typeof strings === "string") // if the first argument passed is a string, just transform it
            return _this.transformEndResult(strings);
            // else, return a transformed end result of processing the template with our tag
            strings = strings.map(_this.transformString.bind(_this));
            return _this.transformEndResult(strings.reduce(_this.processSubstitutions.bind(_this, expressions)));
        };
        // if first argument is an array, extrude it as a list of transformers
        if (transformers.length > 0 && Array.isArray(transformers[0])) transformers = transformers[0];
        // if any transformers are functions, this means they are not initiated - automatically initiate them
        this.transformers = transformers.map(function(transformer) {
            return typeof transformer === "function" ? transformer() : transformer;
        });
        // return an ES2015 template tag
        return this.tag;
    }
    /**
   * Applies all transformers to a template literal tagged with this method.
   * If a function is passed as the first argument, assumes the function is a template tag
   * and applies it to the template, returning a template tag.
   * @param  {(Function|String|Array<String>)} strings        - Either a template tag or an array containing template strings separated by identifier
   * @param  {...*}                            ...expressions - Optional list of substitution values.
   * @return {(String|Function)}                              - Either an intermediary tag function or the results of processing the template.
   */ _createClass(TemplateTag, [
        {
            key: "interimTag",
            /**
     * An intermediary template tag that receives a template tag and passes the result of calling the template with the received
     * template tag to our own template tag.
     * @param  {Function}        nextTag          - the received template tag
     * @param  {Array<String>}   template         - the template to process
     * @param  {...*}            ...substitutions - `substitutions` is an array of all substitutions in the template
     * @return {*}                                - the final processed value
     */ value: function interimTag(previousTag, template) {
                for(var _len3 = arguments.length, substitutions = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++)substitutions[_key3 - 2] = arguments[_key3];
                return this.tag(_templateObject, previousTag.apply(undefined, [
                    template
                ].concat(substitutions)));
            }
        },
        {
            key: "processSubstitutions",
            value: function processSubstitutions(substitutions, resultSoFar, remainingPart) {
                var substitution = this.transformSubstitution(substitutions.shift(), resultSoFar);
                return "".concat(resultSoFar, substitution, remainingPart);
            }
        },
        {
            key: "transformString",
            value: function transformString(str) {
                var cb = function cb(res, transform) {
                    return transform.onString ? transform.onString(res) : res;
                };
                return this.transformers.reduce(cb, str);
            }
        },
        {
            key: "transformSubstitution",
            value: function transformSubstitution(substitution, resultSoFar) {
                var cb = function cb(res, transform) {
                    return transform.onSubstitution ? transform.onSubstitution(res, resultSoFar) : res;
                };
                return this.transformers.reduce(cb, substitution);
            }
        },
        {
            key: "transformEndResult",
            value: function transformEndResult(endResult) {
                var cb = function cb(res, transform) {
                    return transform.onEndResult ? transform.onEndResult(res) : res;
                };
                return this.transformers.reduce(cb, endResult);
            }
        }
    ]);
    return TemplateTag;
}();
exports.default = TemplateTag;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"iqen2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _trimResultTransformerDefault.default));
var _trimResultTransformer = require("./trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);

},{"./trimResultTransformer":"lDTWn","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"lDTWn":[function(require,module,exports) {
/**
 * TemplateTag transformer that trims whitespace on the end result of a tagged template
 * @param  {String} side = '' - The side of the string to trim. Can be 'start' or 'end' (alternatively 'left' or 'right')
 * @return {Object}           - a TemplateTag transformer
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var trimResultTransformer = function trimResultTransformer() {
    var side = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    return {
        onEndResult: function onEndResult(endResult) {
            if (side === "") return endResult.trim();
            side = side.toLowerCase();
            if (side === "start" || side === "left") return endResult.replace(/^\s*/, "");
            if (side === "end" || side === "right") return endResult.replace(/\s*$/, "");
            throw new Error("Side not supported: " + side);
        }
    };
};
exports.default = trimResultTransformer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"5UJ4O":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _stripIndentTransformerDefault.default));
var _stripIndentTransformer = require("./stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);

},{"./stripIndentTransformer":"9N5jO","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"9N5jO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
        for(var i = 0, arr2 = Array(arr.length); i < arr.length; i++)arr2[i] = arr[i];
        return arr2;
    } else return Array.from(arr);
}
/**
 * strips indentation from a template literal
 * @param  {String} type = 'initial' - whether to remove all indentation or just leading indentation. can be 'all' or 'initial'
 * @return {Object}                  - a TemplateTag transformer
 */ var stripIndentTransformer = function stripIndentTransformer() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "initial";
    return {
        onEndResult: function onEndResult(endResult) {
            if (type === "initial") {
                // remove the shortest leading indentation from each line
                var match = endResult.match(/^[^\S\n]*(?=\S)/gm);
                var indent = match && Math.min.apply(Math, _toConsumableArray(match.map(function(el) {
                    return el.length;
                })));
                if (indent) {
                    var regexp = new RegExp("^.{" + indent + "}", "gm");
                    return endResult.replace(regexp, "");
                }
                return endResult;
            }
            if (type === "all") // remove all indentation from each line
            return endResult.replace(/^[^\S\n]+/gm, "");
            throw new Error("Unknown type: " + type);
        }
    };
};
exports.default = stripIndentTransformer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"7Y6hj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _replaceResultTransformerDefault.default));
var _replaceResultTransformer = require("./replaceResultTransformer");
var _replaceResultTransformerDefault = parcelHelpers.interopDefault(_replaceResultTransformer);

},{"./replaceResultTransformer":"3Nsjs","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"3Nsjs":[function(require,module,exports) {
/**
 * Replaces tabs, newlines and spaces with the chosen value when they occur in sequences
 * @param  {(String|RegExp)} replaceWhat - the value or pattern that should be replaced
 * @param  {*}               replaceWith - the replacement value
 * @return {Object}                      - a TemplateTag transformer
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var replaceResultTransformer = function replaceResultTransformer(replaceWhat, replaceWith) {
    return {
        onEndResult: function onEndResult(endResult) {
            if (replaceWhat == null || replaceWith == null) throw new Error("replaceResultTransformer requires at least 2 arguments.");
            return endResult.replace(replaceWhat, replaceWith);
        }
    };
};
exports.default = replaceResultTransformer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"hBYtU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _replaceSubstitutionTransformerDefault.default));
var _replaceSubstitutionTransformer = require("./replaceSubstitutionTransformer");
var _replaceSubstitutionTransformerDefault = parcelHelpers.interopDefault(_replaceSubstitutionTransformer);

},{"./replaceSubstitutionTransformer":"vYY9M","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"vYY9M":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var replaceSubstitutionTransformer = function replaceSubstitutionTransformer(replaceWhat, replaceWith) {
    return {
        onSubstitution: function onSubstitution(substitution, resultSoFar) {
            if (replaceWhat == null || replaceWith == null) throw new Error("replaceSubstitutionTransformer requires at least 2 arguments.");
            // Do not touch if null or undefined
            if (substitution == null) return substitution;
            else return substitution.toString().replace(replaceWhat, replaceWith);
        }
    };
};
exports.default = replaceSubstitutionTransformer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"7d4k5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _replaceStringTransformerDefault.default));
var _replaceStringTransformer = require("./replaceStringTransformer");
var _replaceStringTransformerDefault = parcelHelpers.interopDefault(_replaceStringTransformer);

},{"./replaceStringTransformer":"aCU4c","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"aCU4c":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var replaceStringTransformer = function replaceStringTransformer(replaceWhat, replaceWith) {
    return {
        onString: function onString(str) {
            if (replaceWhat == null || replaceWith == null) throw new Error("replaceStringTransformer requires at least 2 arguments.");
            return str.replace(replaceWhat, replaceWith);
        }
    };
};
exports.default = replaceStringTransformer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"lGv86":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _inlineArrayTransformerDefault.default));
var _inlineArrayTransformer = require("./inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);

},{"./inlineArrayTransformer":"9zZYI","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"9zZYI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var defaults = {
    separator: "",
    conjunction: "",
    serial: false
};
/**
 * Converts an array substitution to a string containing a list
 * @param  {String} [opts.separator = ''] - the character that separates each item
 * @param  {String} [opts.conjunction = '']  - replace the last separator with this
 * @param  {Boolean} [opts.serial = false] - include the separator before the conjunction? (Oxford comma use-case)
 *
 * @return {Object}                     - a TemplateTag transformer
 */ var inlineArrayTransformer = function inlineArrayTransformer() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
    return {
        onSubstitution: function onSubstitution(substitution, resultSoFar) {
            // only operate on arrays
            if (Array.isArray(substitution)) {
                var arrayLength = substitution.length;
                var separator = opts.separator;
                var conjunction = opts.conjunction;
                var serial = opts.serial;
                // join each item in the array into a string where each item is separated by separator
                // be sure to maintain indentation
                var indent = resultSoFar.match(/(\n?[^\S\n]+)$/);
                if (indent) substitution = substitution.join(separator + indent[1]);
                else substitution = substitution.join(separator + " ");
                // if conjunction is set, replace the last separator with conjunction, but only if there is more than one substitution
                if (conjunction && arrayLength > 1) {
                    var separatorIndex = substitution.lastIndexOf(separator);
                    substitution = substitution.slice(0, separatorIndex) + (serial ? separator : "") + " " + conjunction + substitution.slice(separatorIndex + 1);
                }
            }
            return substitution;
        }
    };
};
exports.default = inlineArrayTransformer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"048rM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _splitStringTransformerDefault.default));
var _splitStringTransformer = require("./splitStringTransformer");
var _splitStringTransformerDefault = parcelHelpers.interopDefault(_splitStringTransformer);

},{"./splitStringTransformer":"k7dAy","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"k7dAy":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var splitStringTransformer = function splitStringTransformer(splitBy) {
    return {
        onSubstitution: function onSubstitution(substitution, resultSoFar) {
            if (splitBy != null && typeof splitBy === "string") {
                if (typeof substitution === "string" && substitution.includes(splitBy)) substitution = substitution.split(splitBy);
            } else throw new Error("You need to specify a string character to split by.");
            return substitution;
        }
    };
};
exports.default = splitStringTransformer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"5ICzM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _removeNonPrintingValuesTransformerDefault.default));
var _removeNonPrintingValuesTransformer = require("./removeNonPrintingValuesTransformer");
var _removeNonPrintingValuesTransformerDefault = parcelHelpers.interopDefault(_removeNonPrintingValuesTransformer);

},{"./removeNonPrintingValuesTransformer":"eMbTU","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"eMbTU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var isValidValue = function isValidValue(x) {
    return x != null && !Number.isNaN(x) && typeof x !== "boolean";
};
var removeNonPrintingValuesTransformer = function removeNonPrintingValuesTransformer() {
    return {
        onSubstitution: function onSubstitution(substitution) {
            if (Array.isArray(substitution)) return substitution.filter(isValidValue);
            if (isValidValue(substitution)) return substitution;
            return "";
        }
    };
};
exports.default = removeNonPrintingValuesTransformer;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"bXQgC":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _commaListsDefault.default));
var _commaLists = require("./commaLists");
var _commaListsDefault = parcelHelpers.interopDefault(_commaLists);

},{"./commaLists":"53uXj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"53uXj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _stripIndentTransformer = require("../stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var commaLists = new (0, _templateTagDefault.default)((0, _inlineArrayTransformerDefault.default)({
    separator: ","
}), (0, _stripIndentTransformerDefault.default), (0, _trimResultTransformerDefault.default));
exports.default = commaLists;

},{"../TemplateTag":"2bjtX","../stripIndentTransformer":"5UJ4O","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"fZncs":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _commaListsAndDefault.default));
var _commaListsAnd = require("./commaListsAnd");
var _commaListsAndDefault = parcelHelpers.interopDefault(_commaListsAnd);

},{"./commaListsAnd":"ec3RM","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"ec3RM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _stripIndentTransformer = require("../stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var commaListsAnd = new (0, _templateTagDefault.default)((0, _inlineArrayTransformerDefault.default)({
    separator: ",",
    conjunction: "and"
}), (0, _stripIndentTransformerDefault.default), (0, _trimResultTransformerDefault.default));
exports.default = commaListsAnd;

},{"../TemplateTag":"2bjtX","../stripIndentTransformer":"5UJ4O","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"jVIW1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _commaListsOrDefault.default));
var _commaListsOr = require("./commaListsOr");
var _commaListsOrDefault = parcelHelpers.interopDefault(_commaListsOr);

},{"./commaListsOr":"byvWK","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"byvWK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _stripIndentTransformer = require("../stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var commaListsOr = new (0, _templateTagDefault.default)((0, _inlineArrayTransformerDefault.default)({
    separator: ",",
    conjunction: "or"
}), (0, _stripIndentTransformerDefault.default), (0, _trimResultTransformerDefault.default));
exports.default = commaListsOr;

},{"../TemplateTag":"2bjtX","../stripIndentTransformer":"5UJ4O","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"JBxxZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _htmlDefault.default));
var _html = require("./html");
var _htmlDefault = parcelHelpers.interopDefault(_html);

},{"./html":"ewgJP","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"ewgJP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _stripIndentTransformer = require("../stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _splitStringTransformer = require("../splitStringTransformer");
var _splitStringTransformerDefault = parcelHelpers.interopDefault(_splitStringTransformer);
var _removeNonPrintingValuesTransformer = require("../removeNonPrintingValuesTransformer");
var _removeNonPrintingValuesTransformerDefault = parcelHelpers.interopDefault(_removeNonPrintingValuesTransformer);
var html = new (0, _templateTagDefault.default)((0, _splitStringTransformerDefault.default)("\n"), (0, _removeNonPrintingValuesTransformerDefault.default), (0, _inlineArrayTransformerDefault.default), (0, _stripIndentTransformerDefault.default), (0, _trimResultTransformerDefault.default));
exports.default = html;

},{"../TemplateTag":"2bjtX","../stripIndentTransformer":"5UJ4O","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","../splitStringTransformer":"048rM","../removeNonPrintingValuesTransformer":"5ICzM","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"kbj7m":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _htmlDefault.default));
var _html = require("../html");
var _htmlDefault = parcelHelpers.interopDefault(_html);

},{"../html":"JBxxZ","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"4mmIa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _htmlDefault.default));
var _html = require("../html");
var _htmlDefault = parcelHelpers.interopDefault(_html);

},{"../html":"JBxxZ","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"fuzZK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _safeHtmlDefault.default));
var _safeHtml = require("./safeHtml");
var _safeHtmlDefault = parcelHelpers.interopDefault(_safeHtml);

},{"./safeHtml":"gSBO5","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"gSBO5":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _stripIndentTransformer = require("../stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _splitStringTransformer = require("../splitStringTransformer");
var _splitStringTransformerDefault = parcelHelpers.interopDefault(_splitStringTransformer);
var _replaceSubstitutionTransformer = require("../replaceSubstitutionTransformer");
var _replaceSubstitutionTransformerDefault = parcelHelpers.interopDefault(_replaceSubstitutionTransformer);
var safeHtml = new (0, _templateTagDefault.default)((0, _splitStringTransformerDefault.default)("\n"), (0, _inlineArrayTransformerDefault.default), (0, _stripIndentTransformerDefault.default), (0, _trimResultTransformerDefault.default), (0, _replaceSubstitutionTransformerDefault.default)(/&/g, "&amp;"), (0, _replaceSubstitutionTransformerDefault.default)(/</g, "&lt;"), (0, _replaceSubstitutionTransformerDefault.default)(/>/g, "&gt;"), (0, _replaceSubstitutionTransformerDefault.default)(/"/g, "&quot;"), (0, _replaceSubstitutionTransformerDefault.default)(/'/g, "&#x27;"), (0, _replaceSubstitutionTransformerDefault.default)(/`/g, "&#x60;"));
exports.default = safeHtml;

},{"../TemplateTag":"2bjtX","../stripIndentTransformer":"5UJ4O","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","../splitStringTransformer":"048rM","../replaceSubstitutionTransformer":"hBYtU","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"8E6Xj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _oneLineDefault.default));
var _oneLine = require("./oneLine");
var _oneLineDefault = parcelHelpers.interopDefault(_oneLine);

},{"./oneLine":"akRyj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"akRyj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _replaceResultTransformer = require("../replaceResultTransformer");
var _replaceResultTransformerDefault = parcelHelpers.interopDefault(_replaceResultTransformer);
var oneLine = new (0, _templateTagDefault.default)((0, _replaceResultTransformerDefault.default)(/(?:\n(?:\s*))+/g, " "), (0, _trimResultTransformerDefault.default));
exports.default = oneLine;

},{"../TemplateTag":"2bjtX","../trimResultTransformer":"iqen2","../replaceResultTransformer":"7Y6hj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"aCeIA":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _oneLineTrimDefault.default));
var _oneLineTrim = require("./oneLineTrim");
var _oneLineTrimDefault = parcelHelpers.interopDefault(_oneLineTrim);

},{"./oneLineTrim":"36Fjp","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"36Fjp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _replaceResultTransformer = require("../replaceResultTransformer");
var _replaceResultTransformerDefault = parcelHelpers.interopDefault(_replaceResultTransformer);
var oneLineTrim = new (0, _templateTagDefault.default)((0, _replaceResultTransformerDefault.default)(/(?:\n\s*)/g, ""), (0, _trimResultTransformerDefault.default));
exports.default = oneLineTrim;

},{"../TemplateTag":"2bjtX","../trimResultTransformer":"iqen2","../replaceResultTransformer":"7Y6hj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"6qkCc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _oneLineCommaListsDefault.default));
var _oneLineCommaLists = require("./oneLineCommaLists");
var _oneLineCommaListsDefault = parcelHelpers.interopDefault(_oneLineCommaLists);

},{"./oneLineCommaLists":"gKIMd","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"gKIMd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _replaceResultTransformer = require("../replaceResultTransformer");
var _replaceResultTransformerDefault = parcelHelpers.interopDefault(_replaceResultTransformer);
var oneLineCommaLists = new (0, _templateTagDefault.default)((0, _inlineArrayTransformerDefault.default)({
    separator: ","
}), (0, _replaceResultTransformerDefault.default)(/(?:\s+)/g, " "), (0, _trimResultTransformerDefault.default));
exports.default = oneLineCommaLists;

},{"../TemplateTag":"2bjtX","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","../replaceResultTransformer":"7Y6hj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"k7SVA":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _oneLineCommaListsOrDefault.default));
var _oneLineCommaListsOr = require("./oneLineCommaListsOr");
var _oneLineCommaListsOrDefault = parcelHelpers.interopDefault(_oneLineCommaListsOr);

},{"./oneLineCommaListsOr":"cirhY","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"cirhY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _replaceResultTransformer = require("../replaceResultTransformer");
var _replaceResultTransformerDefault = parcelHelpers.interopDefault(_replaceResultTransformer);
var oneLineCommaListsOr = new (0, _templateTagDefault.default)((0, _inlineArrayTransformerDefault.default)({
    separator: ",",
    conjunction: "or"
}), (0, _replaceResultTransformerDefault.default)(/(?:\s+)/g, " "), (0, _trimResultTransformerDefault.default));
exports.default = oneLineCommaListsOr;

},{"../TemplateTag":"2bjtX","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","../replaceResultTransformer":"7Y6hj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"jjYVM":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _oneLineCommaListsAndDefault.default));
var _oneLineCommaListsAnd = require("./oneLineCommaListsAnd");
var _oneLineCommaListsAndDefault = parcelHelpers.interopDefault(_oneLineCommaListsAnd);

},{"./oneLineCommaListsAnd":"dJleJ","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"dJleJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _replaceResultTransformer = require("../replaceResultTransformer");
var _replaceResultTransformerDefault = parcelHelpers.interopDefault(_replaceResultTransformer);
var oneLineCommaListsAnd = new (0, _templateTagDefault.default)((0, _inlineArrayTransformerDefault.default)({
    separator: ",",
    conjunction: "and"
}), (0, _replaceResultTransformerDefault.default)(/(?:\s+)/g, " "), (0, _trimResultTransformerDefault.default));
exports.default = oneLineCommaListsAnd;

},{"../TemplateTag":"2bjtX","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","../replaceResultTransformer":"7Y6hj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"2legI":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _inlineListsDefault.default));
var _inlineLists = require("./inlineLists");
var _inlineListsDefault = parcelHelpers.interopDefault(_inlineLists);

},{"./inlineLists":"hQQDo","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"hQQDo":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _stripIndentTransformer = require("../stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var inlineLists = new (0, _templateTagDefault.default)((0, _inlineArrayTransformerDefault.default), (0, _stripIndentTransformerDefault.default), (0, _trimResultTransformerDefault.default));
exports.default = inlineLists;

},{"../TemplateTag":"2bjtX","../stripIndentTransformer":"5UJ4O","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"bRmGD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _oneLineInlineListsDefault.default));
var _oneLineInlineLists = require("./oneLineInlineLists");
var _oneLineInlineListsDefault = parcelHelpers.interopDefault(_oneLineInlineLists);

},{"./oneLineInlineLists":"iVZB7","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"iVZB7":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _inlineArrayTransformer = require("../inlineArrayTransformer");
var _inlineArrayTransformerDefault = parcelHelpers.interopDefault(_inlineArrayTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var _replaceResultTransformer = require("../replaceResultTransformer");
var _replaceResultTransformerDefault = parcelHelpers.interopDefault(_replaceResultTransformer);
var oneLineInlineLists = new (0, _templateTagDefault.default)((0, _inlineArrayTransformerDefault.default), (0, _replaceResultTransformerDefault.default)(/(?:\s+)/g, " "), (0, _trimResultTransformerDefault.default));
exports.default = oneLineInlineLists;

},{"../TemplateTag":"2bjtX","../inlineArrayTransformer":"lGv86","../trimResultTransformer":"iqen2","../replaceResultTransformer":"7Y6hj","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"jYP6Y":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _stripIndentDefault.default));
var _stripIndent = require("./stripIndent");
var _stripIndentDefault = parcelHelpers.interopDefault(_stripIndent);

},{"./stripIndent":"a4cJP","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"a4cJP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _stripIndentTransformer = require("../stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var stripIndent = new (0, _templateTagDefault.default)((0, _stripIndentTransformerDefault.default), (0, _trimResultTransformerDefault.default));
exports.default = stripIndent;

},{"../TemplateTag":"2bjtX","../stripIndentTransformer":"5UJ4O","../trimResultTransformer":"iqen2","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"2TzWl":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>(0, _stripIndentsDefault.default));
var _stripIndents = require("./stripIndents");
var _stripIndentsDefault = parcelHelpers.interopDefault(_stripIndents);

},{"./stripIndents":"277bi","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"277bi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var _templateTag = require("../TemplateTag");
var _templateTagDefault = parcelHelpers.interopDefault(_templateTag);
var _stripIndentTransformer = require("../stripIndentTransformer");
var _stripIndentTransformerDefault = parcelHelpers.interopDefault(_stripIndentTransformer);
var _trimResultTransformer = require("../trimResultTransformer");
var _trimResultTransformerDefault = parcelHelpers.interopDefault(_trimResultTransformer);
var stripIndents = new (0, _templateTagDefault.default)((0, _stripIndentTransformerDefault.default)("all"), (0, _trimResultTransformerDefault.default));
exports.default = stripIndents;

},{"../TemplateTag":"2bjtX","../stripIndentTransformer":"5UJ4O","../trimResultTransformer":"iqen2","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"fZo6p":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "easeLinear", ()=>(0, _linearJs.linear));
parcelHelpers.export(exports, "easeQuad", ()=>(0, _quadJs.quadInOut));
parcelHelpers.export(exports, "easeQuadIn", ()=>(0, _quadJs.quadIn));
parcelHelpers.export(exports, "easeQuadOut", ()=>(0, _quadJs.quadOut));
parcelHelpers.export(exports, "easeQuadInOut", ()=>(0, _quadJs.quadInOut));
parcelHelpers.export(exports, "easeCubic", ()=>(0, _cubicJs.cubicInOut));
parcelHelpers.export(exports, "easeCubicIn", ()=>(0, _cubicJs.cubicIn));
parcelHelpers.export(exports, "easeCubicOut", ()=>(0, _cubicJs.cubicOut));
parcelHelpers.export(exports, "easeCubicInOut", ()=>(0, _cubicJs.cubicInOut));
parcelHelpers.export(exports, "easePoly", ()=>(0, _polyJs.polyInOut));
parcelHelpers.export(exports, "easePolyIn", ()=>(0, _polyJs.polyIn));
parcelHelpers.export(exports, "easePolyOut", ()=>(0, _polyJs.polyOut));
parcelHelpers.export(exports, "easePolyInOut", ()=>(0, _polyJs.polyInOut));
parcelHelpers.export(exports, "easeSin", ()=>(0, _sinJs.sinInOut));
parcelHelpers.export(exports, "easeSinIn", ()=>(0, _sinJs.sinIn));
parcelHelpers.export(exports, "easeSinOut", ()=>(0, _sinJs.sinOut));
parcelHelpers.export(exports, "easeSinInOut", ()=>(0, _sinJs.sinInOut));
parcelHelpers.export(exports, "easeExp", ()=>(0, _expJs.expInOut));
parcelHelpers.export(exports, "easeExpIn", ()=>(0, _expJs.expIn));
parcelHelpers.export(exports, "easeExpOut", ()=>(0, _expJs.expOut));
parcelHelpers.export(exports, "easeExpInOut", ()=>(0, _expJs.expInOut));
parcelHelpers.export(exports, "easeCircle", ()=>(0, _circleJs.circleInOut));
parcelHelpers.export(exports, "easeCircleIn", ()=>(0, _circleJs.circleIn));
parcelHelpers.export(exports, "easeCircleOut", ()=>(0, _circleJs.circleOut));
parcelHelpers.export(exports, "easeCircleInOut", ()=>(0, _circleJs.circleInOut));
parcelHelpers.export(exports, "easeBounce", ()=>(0, _bounceJs.bounceOut));
parcelHelpers.export(exports, "easeBounceIn", ()=>(0, _bounceJs.bounceIn));
parcelHelpers.export(exports, "easeBounceOut", ()=>(0, _bounceJs.bounceOut));
parcelHelpers.export(exports, "easeBounceInOut", ()=>(0, _bounceJs.bounceInOut));
parcelHelpers.export(exports, "easeBack", ()=>(0, _backJs.backInOut));
parcelHelpers.export(exports, "easeBackIn", ()=>(0, _backJs.backIn));
parcelHelpers.export(exports, "easeBackOut", ()=>(0, _backJs.backOut));
parcelHelpers.export(exports, "easeBackInOut", ()=>(0, _backJs.backInOut));
parcelHelpers.export(exports, "easeElastic", ()=>(0, _elasticJs.elasticOut));
parcelHelpers.export(exports, "easeElasticIn", ()=>(0, _elasticJs.elasticIn));
parcelHelpers.export(exports, "easeElasticOut", ()=>(0, _elasticJs.elasticOut));
parcelHelpers.export(exports, "easeElasticInOut", ()=>(0, _elasticJs.elasticInOut));
var _linearJs = require("./linear.js");
var _quadJs = require("./quad.js");
var _cubicJs = require("./cubic.js");
var _polyJs = require("./poly.js");
var _sinJs = require("./sin.js");
var _expJs = require("./exp.js");
var _circleJs = require("./circle.js");
var _bounceJs = require("./bounce.js");
var _backJs = require("./back.js");
var _elasticJs = require("./elastic.js");

},{"./linear.js":false,"./quad.js":false,"./cubic.js":"93H3U","./poly.js":false,"./sin.js":"epwyb","./exp.js":false,"./circle.js":false,"./bounce.js":false,"./back.js":false,"./elastic.js":false,"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"93H3U":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "cubicIn", ()=>cubicIn);
parcelHelpers.export(exports, "cubicOut", ()=>cubicOut);
parcelHelpers.export(exports, "cubicInOut", ()=>cubicInOut);
function cubicIn(t) {
    return t * t * t;
}
function cubicOut(t) {
    return --t * t * t + 1;
}
function cubicInOut(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"epwyb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "sinIn", ()=>sinIn);
parcelHelpers.export(exports, "sinOut", ()=>sinOut);
parcelHelpers.export(exports, "sinInOut", ()=>sinInOut);
var pi = Math.PI, halfPi = pi / 2;
function sinIn(t) {
    return +t === 1 ? 1 : 1 - Math.cos(t * halfPi);
}
function sinOut(t) {
    return Math.sin(t * halfPi);
}
function sinInOut(t) {
    return (1 - Math.cos(pi * t)) / 2;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"hxp2F":[function(require,module,exports) {
var global = arguments[3];
(function(a, b) {
    if ("function" == typeof define && define.amd) define([], b);
    else b();
})(this, function() {
    "use strict";
    function b(a, b) {
        return "undefined" == typeof b ? b = {
            autoBom: !1
        } : "object" != typeof b && (console.warn("Deprecated: Expected third argument to be a object"), b = {
            autoBom: !b
        }), b.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob([
            "\uFEFF",
            a
        ], {
            type: a.type
        }) : a;
    }
    function c(a, b, c) {
        var d = new XMLHttpRequest;
        d.open("GET", a), d.responseType = "blob", d.onload = function() {
            g(d.response, b, c);
        }, d.onerror = function() {
            console.error("could not download file");
        }, d.send();
    }
    function d(a) {
        var b = new XMLHttpRequest;
        b.open("HEAD", a, !1);
        try {
            b.send();
        } catch (a) {}
        return 200 <= b.status && 299 >= b.status;
    }
    function e(a) {
        try {
            a.dispatchEvent(new MouseEvent("click"));
        } catch (c) {
            var b = document.createEvent("MouseEvents");
            b.initMouseEvent("click", !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), a.dispatchEvent(b);
        }
    }
    var f = "object" == typeof window && window.window === window ? window : "object" == typeof self && self.self === self ? self : "object" == typeof global && global.global === global ? global : void 0, a = f.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent), g = f.saveAs || ("object" != typeof window || window !== f ? function() {} : "download" in HTMLAnchorElement.prototype && !a ? function(b, g, h) {
        var i = f.URL || f.webkitURL, j = document.createElement("a");
        g = g || b.name || "download", j.download = g, j.rel = "noopener", "string" == typeof b ? (j.href = b, j.origin === location.origin ? e(j) : d(j.href) ? c(b, g, h) : e(j, j.target = "_blank")) : (j.href = i.createObjectURL(b), setTimeout(function() {
            i.revokeObjectURL(j.href);
        }, 4E4), setTimeout(function() {
            e(j);
        }, 0));
    } : "msSaveOrOpenBlob" in navigator ? function(f, g, h) {
        if (g = g || f.name || "download", "string" != typeof f) navigator.msSaveOrOpenBlob(b(f, h), g);
        else if (d(f)) c(f, g, h);
        else {
            var i = document.createElement("a");
            i.href = f, i.target = "_blank", setTimeout(function() {
                e(i);
            });
        }
    } : function(b, d, e, g) {
        if (g = g || open("", "_blank"), g && (g.document.title = g.document.body.innerText = "downloading..."), "string" == typeof b) return c(b, d, e);
        var h = "application/octet-stream" === b.type, i = /constructor/i.test(f.HTMLElement) || f.safari, j = /CriOS\/[\d]+/.test(navigator.userAgent);
        if ((j || h && i || a) && "undefined" != typeof FileReader) {
            var k = new FileReader;
            k.onloadend = function() {
                var a = k.result;
                a = j ? a : a.replace(/^data:[^;]*;/, "data:attachment/file;"), g ? g.location.href = a : location = a, g = null;
            }, k.readAsDataURL(b);
        } else {
            var l = f.URL || f.webkitURL, m = l.createObjectURL(b);
            g ? g.location = m : location.href = m, g = null, setTimeout(function() {
                l.revokeObjectURL(m);
            }, 4E4);
        }
    });
    f.saveAs = g.saveAs = g, module.exports = g;
});

},{}],"2hRSJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Immer", ()=>un);
parcelHelpers.export(exports, "applyPatches", ()=>pn);
parcelHelpers.export(exports, "castDraft", ()=>K);
parcelHelpers.export(exports, "castImmutable", ()=>$);
parcelHelpers.export(exports, "createDraft", ()=>ln);
parcelHelpers.export(exports, "current", ()=>R);
parcelHelpers.export(exports, "enableAllPlugins", ()=>J);
parcelHelpers.export(exports, "enableES5", ()=>F);
parcelHelpers.export(exports, "enableMapSet", ()=>C);
parcelHelpers.export(exports, "enablePatches", ()=>T);
parcelHelpers.export(exports, "finishDraft", ()=>dn);
parcelHelpers.export(exports, "freeze", ()=>d);
parcelHelpers.export(exports, "immerable", ()=>L);
parcelHelpers.export(exports, "isDraft", ()=>r);
parcelHelpers.export(exports, "isDraftable", ()=>t);
parcelHelpers.export(exports, "nothing", ()=>H);
parcelHelpers.export(exports, "original", ()=>e);
parcelHelpers.export(exports, "produce", ()=>fn);
parcelHelpers.export(exports, "produceWithPatches", ()=>cn);
parcelHelpers.export(exports, "setAutoFreeze", ()=>sn);
parcelHelpers.export(exports, "setUseProxies", ()=>vn);
function n(n) {
    for(var r = arguments.length, t = Array(r > 1 ? r - 1 : 0), e = 1; e < r; e++)t[e - 1] = arguments[e];
    var i, o;
    throw Error("[Immer] minified error nr: " + n + (t.length ? " " + t.map(function(n) {
        return "'" + n + "'";
    }).join(",") : "") + ". Find the full error at: https://bit.ly/3cXEKWf");
}
function r(n) {
    return !!n && !!n[Q];
}
function t(n) {
    var r;
    return !!n && (function(n) {
        if (!n || "object" != typeof n) return !1;
        var r = Object.getPrototypeOf(n);
        if (null === r) return !0;
        var t = Object.hasOwnProperty.call(r, "constructor") && r.constructor;
        return t === Object || "function" == typeof t && Function.toString.call(t) === Z;
    }(n) || Array.isArray(n) || !!n[L] || !!(null === (r = n.constructor) || void 0 === r ? void 0 : r[L]) || s(n) || v(n));
}
function e(t) {
    return r(t) || n(23, t), t[Q].t;
}
function i(n, r, t) {
    void 0 === t && (t = !1), 0 === o(n) ? (t ? Object.keys : nn)(n).forEach(function(e) {
        t && "symbol" == typeof e || r(e, n[e], n);
    }) : n.forEach(function(t, e) {
        return r(e, t, n);
    });
}
function o(n) {
    var r = n[Q];
    return r ? r.i > 3 ? r.i - 4 : r.i : Array.isArray(n) ? 1 : s(n) ? 2 : v(n) ? 3 : 0;
}
function u(n, r) {
    return 2 === o(n) ? n.has(r) : Object.prototype.hasOwnProperty.call(n, r);
}
function a(n, r) {
    return 2 === o(n) ? n.get(r) : n[r];
}
function f(n, r, t) {
    var e = o(n);
    2 === e ? n.set(r, t) : 3 === e ? n.add(t) : n[r] = t;
}
function c(n, r) {
    return n === r ? 0 !== n || 1 / n == 1 / r : n != n && r != r;
}
function s(n) {
    return X && n instanceof Map;
}
function v(n) {
    return q && n instanceof Set;
}
function p(n) {
    return n.o || n.t;
}
function l(n) {
    if (Array.isArray(n)) return Array.prototype.slice.call(n);
    var r = rn(n);
    delete r[Q];
    for(var t = nn(r), e = 0; e < t.length; e++){
        var i = t[e], o = r[i];
        !1 === o.writable && (o.writable = !0, o.configurable = !0), (o.get || o.set) && (r[i] = {
            configurable: !0,
            writable: !0,
            enumerable: o.enumerable,
            value: n[i]
        });
    }
    return Object.create(Object.getPrototypeOf(n), r);
}
function d(n, e) {
    return void 0 === e && (e = !1), y(n) || r(n) || !t(n) || (o(n) > 1 && (n.set = n.add = n.clear = n.delete = h), Object.freeze(n), e && i(n, function(n, r) {
        return d(r, !0);
    }, !0)), n;
}
function h() {
    n(2);
}
function y(n) {
    return null == n || "object" != typeof n || Object.isFrozen(n);
}
function b(r) {
    var t = tn[r];
    return t || n(18, r), t;
}
function m(n, r) {
    tn[n] || (tn[n] = r);
}
function _() {
    return U;
}
function j(n, r) {
    r && (b("Patches"), n.u = [], n.s = [], n.v = r);
}
function g(n) {
    O(n), n.p.forEach(S), n.p = null;
}
function O(n) {
    n === U && (U = n.l);
}
function w(n) {
    return U = {
        p: [],
        l: U,
        h: n,
        m: !0,
        _: 0
    };
}
function S(n) {
    var r = n[Q];
    0 === r.i || 1 === r.i ? r.j() : r.g = !0;
}
function P(r, e) {
    e._ = e.p.length;
    var i = e.p[0], o = void 0 !== r && r !== i;
    return e.h.O || b("ES5").S(e, r, o), o ? (i[Q].P && (g(e), n(4)), t(r) && (r = M(e, r), e.l || x(e, r)), e.u && b("Patches").M(i[Q].t, r, e.u, e.s)) : r = M(e, i, []), g(e), e.u && e.v(e.u, e.s), r !== H ? r : void 0;
}
function M(n, r, t) {
    if (y(r)) return r;
    var e = r[Q];
    if (!e) return i(r, function(i, o) {
        return A(n, e, r, i, o, t);
    }, !0), r;
    if (e.A !== n) return r;
    if (!e.P) return x(n, e.t, !0), e.t;
    if (!e.I) {
        e.I = !0, e.A._--;
        var o = 4 === e.i || 5 === e.i ? e.o = l(e.k) : e.o, u = o, a = !1;
        3 === e.i && (u = new Set(o), o.clear(), a = !0), i(u, function(r, i) {
            return A(n, e, o, r, i, t, a);
        }), x(n, o, !1), t && n.u && b("Patches").N(e, t, n.u, n.s);
    }
    return e.o;
}
function A(e, i, o, a, c, s, v) {
    if (r(c)) {
        var p = M(e, c, s && i && 3 !== i.i && !u(i.R, a) ? s.concat(a) : void 0);
        if (f(o, a, p), !r(p)) return;
        e.m = !1;
    } else v && o.add(c);
    if (t(c) && !y(c)) {
        if (!e.h.D && e._ < 1) return;
        M(e, c), i && i.A.l || x(e, c);
    }
}
function x(n, r, t) {
    void 0 === t && (t = !1), !n.l && n.h.D && n.m && d(r, t);
}
function z(n, r) {
    var t = n[Q];
    return (t ? p(t) : n)[r];
}
function I(n, r) {
    if (r in n) for(var t = Object.getPrototypeOf(n); t;){
        var e = Object.getOwnPropertyDescriptor(t, r);
        if (e) return e;
        t = Object.getPrototypeOf(t);
    }
}
function k(n) {
    n.P || (n.P = !0, n.l && k(n.l));
}
function E(n) {
    n.o || (n.o = l(n.t));
}
function N(n, r, t) {
    var e = s(r) ? b("MapSet").F(r, t) : v(r) ? b("MapSet").T(r, t) : n.O ? function(n, r) {
        var t = Array.isArray(n), e = {
            i: t ? 1 : 0,
            A: r ? r.A : _(),
            P: !1,
            I: !1,
            R: {},
            l: r,
            t: n,
            k: null,
            o: null,
            j: null,
            C: !1
        }, i = e, o = en;
        t && (i = [
            e
        ], o = on);
        var u = Proxy.revocable(i, o), a = u.revoke, f = u.proxy;
        return e.k = f, e.j = a, f;
    }(r, t) : b("ES5").J(r, t);
    return (t ? t.A : _()).p.push(e), e;
}
function R(e) {
    return r(e) || n(22, e), function n(r) {
        if (!t(r)) return r;
        var e, u = r[Q], c = o(r);
        if (u) {
            if (!u.P && (u.i < 4 || !b("ES5").K(u))) return u.t;
            u.I = !0, e = D(r, c), u.I = !1;
        } else e = D(r, c);
        return i(e, function(r, t) {
            u && a(u.t, r) === t || f(e, r, n(t));
        }), 3 === c ? new Set(e) : e;
    }(e);
}
function D(n, r) {
    switch(r){
        case 2:
            return new Map(n);
        case 3:
            return Array.from(n);
    }
    return l(n);
}
function F() {
    function t(n, r) {
        var t = s[n];
        return t ? t.enumerable = r : s[n] = t = {
            configurable: !0,
            enumerable: r,
            get: function() {
                var r = this[Q];
                return en.get(r, n);
            },
            set: function(r) {
                var t = this[Q];
                en.set(t, n, r);
            }
        }, t;
    }
    function e(n) {
        for(var r = n.length - 1; r >= 0; r--){
            var t = n[r][Q];
            if (!t.P) switch(t.i){
                case 5:
                    a(t) && k(t);
                    break;
                case 4:
                    o(t) && k(t);
            }
        }
    }
    function o(n) {
        for(var r = n.t, t = n.k, e = nn(t), i = e.length - 1; i >= 0; i--){
            var o = e[i];
            if (o !== Q) {
                var a = r[o];
                if (void 0 === a && !u(r, o)) return !0;
                var f = t[o], s = f && f[Q];
                if (s ? s.t !== a : !c(f, a)) return !0;
            }
        }
        var v = !!r[Q];
        return e.length !== nn(r).length + (v ? 0 : 1);
    }
    function a(n) {
        var r = n.k;
        if (r.length !== n.t.length) return !0;
        var t = Object.getOwnPropertyDescriptor(r, r.length - 1);
        if (t && !t.get) return !0;
        for(var e = 0; e < r.length; e++)if (!r.hasOwnProperty(e)) return !0;
        return !1;
    }
    function f(r) {
        r.g && n(3, JSON.stringify(p(r)));
    }
    var s = {};
    m("ES5", {
        J: function(n, r) {
            var e = Array.isArray(n), i = function(n, r) {
                if (n) {
                    for(var e = Array(r.length), i = 0; i < r.length; i++)Object.defineProperty(e, "" + i, t(i, !0));
                    return e;
                }
                var o = rn(r);
                delete o[Q];
                for(var u = nn(o), a = 0; a < u.length; a++){
                    var f = u[a];
                    o[f] = t(f, n || !!o[f].enumerable);
                }
                return Object.create(Object.getPrototypeOf(r), o);
            }(e, n), o = {
                i: e ? 5 : 4,
                A: r ? r.A : _(),
                P: !1,
                I: !1,
                R: {},
                l: r,
                t: n,
                k: i,
                o: null,
                g: !1,
                C: !1
            };
            return Object.defineProperty(i, Q, {
                value: o,
                writable: !0
            }), i;
        },
        S: function(n, t, o) {
            o ? r(t) && t[Q].A === n && e(n.p) : (n.u && function n(r) {
                if (r && "object" == typeof r) {
                    var t = r[Q];
                    if (t) {
                        var e = t.t, o = t.k, f = t.R, c = t.i;
                        if (4 === c) i(o, function(r) {
                            r !== Q && (void 0 !== e[r] || u(e, r) ? f[r] || n(o[r]) : (f[r] = !0, k(t)));
                        }), i(e, function(n) {
                            void 0 !== o[n] || u(o, n) || (f[n] = !1, k(t));
                        });
                        else if (5 === c) {
                            if (a(t) && (k(t), f.length = !0), o.length < e.length) for(var s = o.length; s < e.length; s++)f[s] = !1;
                            else for(var v = e.length; v < o.length; v++)f[v] = !0;
                            for(var p = Math.min(o.length, e.length), l = 0; l < p; l++)o.hasOwnProperty(l) || (f[l] = !0), void 0 === f[l] && n(o[l]);
                        }
                    }
                }
            }(n.p[0]), e(n.p));
        },
        K: function(n) {
            return 4 === n.i ? o(n) : a(n);
        }
    });
}
function T() {
    function e(n) {
        if (!t(n)) return n;
        if (Array.isArray(n)) return n.map(e);
        if (s(n)) return new Map(Array.from(n.entries()).map(function(n) {
            return [
                n[0],
                e(n[1])
            ];
        }));
        if (v(n)) return new Set(Array.from(n).map(e));
        var r = Object.create(Object.getPrototypeOf(n));
        for(var i in n)r[i] = e(n[i]);
        return u(n, L) && (r[L] = n[L]), r;
    }
    function f(n) {
        return r(n) ? e(n) : n;
    }
    var c = "add";
    m("Patches", {
        $: function(r, t) {
            return t.forEach(function(t) {
                for(var i = t.path, u = t.op, f = r, s = 0; s < i.length - 1; s++){
                    var v = o(f), p = i[s];
                    "string" != typeof p && "number" != typeof p && (p = "" + p), 0 !== v && 1 !== v || "__proto__" !== p && "constructor" !== p || n(24), "function" == typeof f && "prototype" === p && n(24), "object" != typeof (f = a(f, p)) && n(15, i.join("/"));
                }
                var l = o(f), d = e(t.value), h = i[i.length - 1];
                switch(u){
                    case "replace":
                        switch(l){
                            case 2:
                                return f.set(h, d);
                            case 3:
                                n(16);
                            default:
                                return f[h] = d;
                        }
                    case c:
                        switch(l){
                            case 1:
                                return "-" === h ? f.push(d) : f.splice(h, 0, d);
                            case 2:
                                return f.set(h, d);
                            case 3:
                                return f.add(d);
                            default:
                                return f[h] = d;
                        }
                    case "remove":
                        switch(l){
                            case 1:
                                return f.splice(h, 1);
                            case 2:
                                return f.delete(h);
                            case 3:
                                return f.delete(t.value);
                            default:
                                return delete f[h];
                        }
                    default:
                        n(17, u);
                }
            }), r;
        },
        N: function(n, r, t, e) {
            switch(n.i){
                case 0:
                case 4:
                case 2:
                    return function(n, r, t, e) {
                        var o = n.t, s = n.o;
                        i(n.R, function(n, i) {
                            var v = a(o, n), p = a(s, n), l = i ? u(o, n) ? "replace" : c : "remove";
                            if (v !== p || "replace" !== l) {
                                var d = r.concat(n);
                                t.push("remove" === l ? {
                                    op: l,
                                    path: d
                                } : {
                                    op: l,
                                    path: d,
                                    value: p
                                }), e.push(l === c ? {
                                    op: "remove",
                                    path: d
                                } : "remove" === l ? {
                                    op: c,
                                    path: d,
                                    value: f(v)
                                } : {
                                    op: "replace",
                                    path: d,
                                    value: f(v)
                                });
                            }
                        });
                    }(n, r, t, e);
                case 5:
                case 1:
                    return function(n, r, t, e) {
                        var i = n.t, o = n.R, u = n.o;
                        if (u.length < i.length) {
                            var a = [
                                u,
                                i
                            ];
                            i = a[0], u = a[1];
                            var s = [
                                e,
                                t
                            ];
                            t = s[0], e = s[1];
                        }
                        for(var v = 0; v < i.length; v++)if (o[v] && u[v] !== i[v]) {
                            var p = r.concat([
                                v
                            ]);
                            t.push({
                                op: "replace",
                                path: p,
                                value: f(u[v])
                            }), e.push({
                                op: "replace",
                                path: p,
                                value: f(i[v])
                            });
                        }
                        for(var l = i.length; l < u.length; l++){
                            var d = r.concat([
                                l
                            ]);
                            t.push({
                                op: c,
                                path: d,
                                value: f(u[l])
                            });
                        }
                        i.length < u.length && e.push({
                            op: "replace",
                            path: r.concat([
                                "length"
                            ]),
                            value: i.length
                        });
                    }(n, r, t, e);
                case 3:
                    return function(n, r, t, e) {
                        var i = n.t, o = n.o, u = 0;
                        i.forEach(function(n) {
                            if (!o.has(n)) {
                                var i = r.concat([
                                    u
                                ]);
                                t.push({
                                    op: "remove",
                                    path: i,
                                    value: n
                                }), e.unshift({
                                    op: c,
                                    path: i,
                                    value: n
                                });
                            }
                            u++;
                        }), u = 0, o.forEach(function(n) {
                            if (!i.has(n)) {
                                var o = r.concat([
                                    u
                                ]);
                                t.push({
                                    op: c,
                                    path: o,
                                    value: n
                                }), e.unshift({
                                    op: "remove",
                                    path: o,
                                    value: n
                                });
                            }
                            u++;
                        });
                    }(n, r, t, e);
            }
        },
        M: function(n, r, t, e) {
            t.push({
                op: "replace",
                path: [],
                value: r === H ? void 0 : r
            }), e.push({
                op: "replace",
                path: [],
                value: n
            });
        }
    });
}
function C() {
    function r(n, r) {
        function t() {
            this.constructor = n;
        }
        a(n, r), n.prototype = (t.prototype = r.prototype, new t);
    }
    function e(n) {
        n.o || (n.R = new Map, n.o = new Map(n.t));
    }
    function o(n) {
        n.o || (n.o = new Set, n.t.forEach(function(r) {
            if (t(r)) {
                var e = N(n.A.h, r, n);
                n.p.set(r, e), n.o.add(e);
            } else n.o.add(r);
        }));
    }
    function u(r) {
        r.g && n(3, JSON.stringify(p(r)));
    }
    var a = function(n, r) {
        return (a = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(n, r) {
            n.__proto__ = r;
        } || function(n, r) {
            for(var t in r)r.hasOwnProperty(t) && (n[t] = r[t]);
        })(n, r);
    }, f = function() {
        function n(n, r) {
            return this[Q] = {
                i: 2,
                l: r,
                A: r ? r.A : _(),
                P: !1,
                I: !1,
                o: void 0,
                R: void 0,
                t: n,
                k: this,
                C: !1,
                g: !1
            }, this;
        }
        r(n, Map);
        var o = n.prototype;
        return Object.defineProperty(o, "size", {
            get: function() {
                return p(this[Q]).size;
            }
        }), o.has = function(n) {
            return p(this[Q]).has(n);
        }, o.set = function(n, r) {
            var t = this[Q];
            return u(t), p(t).has(n) && p(t).get(n) === r || (e(t), k(t), t.R.set(n, !0), t.o.set(n, r), t.R.set(n, !0)), this;
        }, o.delete = function(n) {
            if (!this.has(n)) return !1;
            var r = this[Q];
            return u(r), e(r), k(r), r.t.has(n) ? r.R.set(n, !1) : r.R.delete(n), r.o.delete(n), !0;
        }, o.clear = function() {
            var n = this[Q];
            u(n), p(n).size && (e(n), k(n), n.R = new Map, i(n.t, function(r) {
                n.R.set(r, !1);
            }), n.o.clear());
        }, o.forEach = function(n, r) {
            var t = this;
            p(this[Q]).forEach(function(e, i) {
                n.call(r, t.get(i), i, t);
            });
        }, o.get = function(n) {
            var r = this[Q];
            u(r);
            var i = p(r).get(n);
            if (r.I || !t(i)) return i;
            if (i !== r.t.get(n)) return i;
            var o = N(r.A.h, i, r);
            return e(r), r.o.set(n, o), o;
        }, o.keys = function() {
            return p(this[Q]).keys();
        }, o.values = function() {
            var n, r = this, t = this.keys();
            return (n = {})[V] = function() {
                return r.values();
            }, n.next = function() {
                var n = t.next();
                return n.done ? n : {
                    done: !1,
                    value: r.get(n.value)
                };
            }, n;
        }, o.entries = function() {
            var n, r = this, t = this.keys();
            return (n = {})[V] = function() {
                return r.entries();
            }, n.next = function() {
                var n = t.next();
                if (n.done) return n;
                var e = r.get(n.value);
                return {
                    done: !1,
                    value: [
                        n.value,
                        e
                    ]
                };
            }, n;
        }, o[V] = function() {
            return this.entries();
        }, n;
    }(), c = function() {
        function n(n, r) {
            return this[Q] = {
                i: 3,
                l: r,
                A: r ? r.A : _(),
                P: !1,
                I: !1,
                o: void 0,
                t: n,
                k: this,
                p: new Map,
                g: !1,
                C: !1
            }, this;
        }
        r(n, Set);
        var t = n.prototype;
        return Object.defineProperty(t, "size", {
            get: function() {
                return p(this[Q]).size;
            }
        }), t.has = function(n) {
            var r = this[Q];
            return u(r), r.o ? !!r.o.has(n) || !(!r.p.has(n) || !r.o.has(r.p.get(n))) : r.t.has(n);
        }, t.add = function(n) {
            var r = this[Q];
            return u(r), this.has(n) || (o(r), k(r), r.o.add(n)), this;
        }, t.delete = function(n) {
            if (!this.has(n)) return !1;
            var r = this[Q];
            return u(r), o(r), k(r), r.o.delete(n) || !!r.p.has(n) && r.o.delete(r.p.get(n));
        }, t.clear = function() {
            var n = this[Q];
            u(n), p(n).size && (o(n), k(n), n.o.clear());
        }, t.values = function() {
            var n = this[Q];
            return u(n), o(n), n.o.values();
        }, t.entries = function() {
            var n = this[Q];
            return u(n), o(n), n.o.entries();
        }, t.keys = function() {
            return this.values();
        }, t[V] = function() {
            return this.values();
        }, t.forEach = function(n, r) {
            for(var t = this.values(), e = t.next(); !e.done;)n.call(r, e.value, e.value, this), e = t.next();
        }, n;
    }();
    m("MapSet", {
        F: function(n, r) {
            return new f(n, r);
        },
        T: function(n, r) {
            return new c(n, r);
        }
    });
}
function J() {
    F(), C(), T();
}
function K(n) {
    return n;
}
function $(n) {
    return n;
}
var G, U, W = "undefined" != typeof Symbol && "symbol" == typeof Symbol("x"), X = "undefined" != typeof Map, q = "undefined" != typeof Set, B = "undefined" != typeof Proxy && void 0 !== Proxy.revocable && "undefined" != typeof Reflect, H = W ? Symbol.for("immer-nothing") : ((G = {})["immer-nothing"] = !0, G), L = W ? Symbol.for("immer-draftable") : "__$immer_draftable", Q = W ? Symbol.for("immer-state") : "__$immer_state", V = "undefined" != typeof Symbol && Symbol.iterator || "@@iterator", Y = {
    0: "Illegal state",
    1: "Immer drafts cannot have computed properties",
    2: "This object has been frozen and should not be mutated",
    3: function(n) {
        return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + n;
    },
    4: "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
    5: "Immer forbids circular references",
    6: "The first or second argument to `produce` must be a function",
    7: "The third argument to `produce` must be a function or undefined",
    8: "First argument to `createDraft` must be a plain object, an array, or an immerable object",
    9: "First argument to `finishDraft` must be a draft returned by `createDraft`",
    10: "The given draft is already finalized",
    11: "Object.defineProperty() cannot be used on an Immer draft",
    12: "Object.setPrototypeOf() cannot be used on an Immer draft",
    13: "Immer only supports deleting array indices",
    14: "Immer only supports setting array indices and the 'length' property",
    15: function(n) {
        return "Cannot apply patch, path doesn't resolve: " + n;
    },
    16: 'Sets cannot have "replace" patches.',
    17: function(n) {
        return "Unsupported patch operation: " + n;
    },
    18: function(n) {
        return "The plugin for '" + n + "' has not been loaded into Immer. To enable the plugin, import and call `enable" + n + "()` when initializing your application.";
    },
    20: "Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",
    21: function(n) {
        return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '" + n + "'";
    },
    22: function(n) {
        return "'current' expects a draft, got: " + n;
    },
    23: function(n) {
        return "'original' expects a draft, got: " + n;
    },
    24: "Patching reserved attributes like __proto__, prototype and constructor is not allowed"
}, Z = "" + Object.prototype.constructor, nn = "undefined" != typeof Reflect && Reflect.ownKeys ? Reflect.ownKeys : void 0 !== Object.getOwnPropertySymbols ? function(n) {
    return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n));
} : Object.getOwnPropertyNames, rn = Object.getOwnPropertyDescriptors || function(n) {
    var r = {};
    return nn(n).forEach(function(t) {
        r[t] = Object.getOwnPropertyDescriptor(n, t);
    }), r;
}, tn = {}, en = {
    get: function(n, r) {
        if (r === Q) return n;
        var e = p(n);
        if (!u(e, r)) return function(n, r, t) {
            var e, i = I(r, t);
            return i ? "value" in i ? i.value : null === (e = i.get) || void 0 === e ? void 0 : e.call(n.k) : void 0;
        }(n, e, r);
        var i = e[r];
        return n.I || !t(i) ? i : i === z(n.t, r) ? (E(n), n.o[r] = N(n.A.h, i, n)) : i;
    },
    has: function(n, r) {
        return r in p(n);
    },
    ownKeys: function(n) {
        return Reflect.ownKeys(p(n));
    },
    set: function(n, r, t) {
        var e = I(p(n), r);
        if (null == e ? void 0 : e.set) return e.set.call(n.k, t), !0;
        if (!n.P) {
            var i = z(p(n), r), o = null == i ? void 0 : i[Q];
            if (o && o.t === t) return n.o[r] = t, n.R[r] = !1, !0;
            if (c(t, i) && (void 0 !== t || u(n.t, r))) return !0;
            E(n), k(n);
        }
        return n.o[r] === t && (void 0 !== t || r in n.o) || Number.isNaN(t) && Number.isNaN(n.o[r]) || (n.o[r] = t, n.R[r] = !0), !0;
    },
    deleteProperty: function(n, r) {
        return void 0 !== z(n.t, r) || r in n.t ? (n.R[r] = !1, E(n), k(n)) : delete n.R[r], n.o && delete n.o[r], !0;
    },
    getOwnPropertyDescriptor: function(n, r) {
        var t = p(n), e = Reflect.getOwnPropertyDescriptor(t, r);
        return e ? {
            writable: !0,
            configurable: 1 !== n.i || "length" !== r,
            enumerable: e.enumerable,
            value: t[r]
        } : e;
    },
    defineProperty: function() {
        n(11);
    },
    getPrototypeOf: function(n) {
        return Object.getPrototypeOf(n.t);
    },
    setPrototypeOf: function() {
        n(12);
    }
}, on = {};
i(en, function(n, r) {
    on[n] = function() {
        return arguments[0] = arguments[0][0], r.apply(this, arguments);
    };
}), on.deleteProperty = function(r, t) {
    return on.set.call(this, r, t, void 0);
}, on.set = function(r, t, e) {
    return en.set.call(this, r[0], t, e, r[0]);
};
var un = function() {
    function e(r) {
        var e = this;
        this.O = B, this.D = !0, this.produce = function(r, i, o) {
            if ("function" == typeof r && "function" != typeof i) {
                var u = i;
                i = r;
                var a = e;
                return function(n) {
                    var r = this;
                    void 0 === n && (n = u);
                    for(var t = arguments.length, e = Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)e[o - 1] = arguments[o];
                    return a.produce(n, function(n) {
                        var t;
                        return (t = i).call.apply(t, [
                            r,
                            n
                        ].concat(e));
                    });
                };
            }
            var f;
            if ("function" != typeof i && n(6), void 0 !== o && "function" != typeof o && n(7), t(r)) {
                var c = w(e), s = N(e, r, void 0), v = !0;
                try {
                    f = i(s), v = !1;
                } finally{
                    v ? g(c) : O(c);
                }
                return "undefined" != typeof Promise && f instanceof Promise ? f.then(function(n) {
                    return j(c, o), P(n, c);
                }, function(n) {
                    throw g(c), n;
                }) : (j(c, o), P(f, c));
            }
            if (!r || "object" != typeof r) {
                if (void 0 === (f = i(r)) && (f = r), f === H && (f = void 0), e.D && d(f, !0), o) {
                    var p = [], l = [];
                    b("Patches").M(r, f, p, l), o(p, l);
                }
                return f;
            }
            n(21, r);
        }, this.produceWithPatches = function(n, r) {
            if ("function" == typeof n) return function(r) {
                for(var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++)i[o - 1] = arguments[o];
                return e.produceWithPatches(r, function(r) {
                    return n.apply(void 0, [
                        r
                    ].concat(i));
                });
            };
            var t, i, o = e.produce(n, r, function(n, r) {
                t = n, i = r;
            });
            return "undefined" != typeof Promise && o instanceof Promise ? o.then(function(n) {
                return [
                    n,
                    t,
                    i
                ];
            }) : [
                o,
                t,
                i
            ];
        }, "boolean" == typeof (null == r ? void 0 : r.useProxies) && this.setUseProxies(r.useProxies), "boolean" == typeof (null == r ? void 0 : r.autoFreeze) && this.setAutoFreeze(r.autoFreeze);
    }
    var i = e.prototype;
    return i.createDraft = function(e) {
        t(e) || n(8), r(e) && (e = R(e));
        var i = w(this), o = N(this, e, void 0);
        return o[Q].C = !0, O(i), o;
    }, i.finishDraft = function(r, t) {
        var e = r && r[Q];
        var i = e.A;
        return j(i, t), P(void 0, i);
    }, i.setAutoFreeze = function(n) {
        this.D = n;
    }, i.setUseProxies = function(r) {
        r && !B && n(20), this.O = r;
    }, i.applyPatches = function(n, t) {
        var e;
        for(e = t.length - 1; e >= 0; e--){
            var i = t[e];
            if (0 === i.path.length && "replace" === i.op) {
                n = i.value;
                break;
            }
        }
        e > -1 && (t = t.slice(e + 1));
        var o = b("Patches").$;
        return r(n) ? o(n, t) : this.produce(n, function(n) {
            return o(n, t);
        });
    }, e;
}(), an = new un, fn = an.produce, cn = an.produceWithPatches.bind(an), sn = an.setAutoFreeze.bind(an), vn = an.setUseProxies.bind(an), pn = an.applyPatches.bind(an), ln = an.createDraft.bind(an), dn = an.finishDraft.bind(an);
exports.default = fn;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"5NCup":[function(require,module,exports) {
module.exports = JSZip;

},{}],"gYt8g":[function(require,module,exports) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as the size to enable large array optimizations. */ var global = arguments[3];
var LARGE_ARRAY_SIZE = 200;
/** Used to stand-in for `undefined` hash values. */ var HASH_UNDEFINED = "__lodash_hash_undefined__";
/** Used as references for various `Number` constants. */ var MAX_SAFE_INTEGER = 9007199254740991;
/** `Object#toString` result references. */ var argsTag = "[object Arguments]", arrayTag = "[object Array]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", objectTag = "[object Object]", promiseTag = "[object Promise]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */ var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to match `RegExp` flags from their coerced string values. */ var reFlags = /\w*$/;
/** Used to detect host constructors (Safari). */ var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
/** Used to identify `toStringTag` values supported by `_.clone`. */ var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
/** Detect free variable `global` from Node.js. */ var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
/** Detect free variable `self`. */ var freeSelf = typeof self == "object" && self && self.Object === Object && self;
/** Used as a reference to the global object. */ var root = freeGlobal || freeSelf || Function("return this")();
/** Detect free variable `exports`. */ var freeExports = exports && !exports.nodeType && exports;
/** Detect free variable `module`. */ var freeModule = freeExports && true && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */ var moduleExports = freeModule && freeModule.exports === freeExports;
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */ function addMapEntry(map, pair) {
    // Don't return `map.set` because it's not chainable in IE 11.
    map.set(pair[0], pair[1]);
    return map;
}
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */ function addSetEntry(set, value) {
    // Don't return `set.add` because it's not chainable in IE 11.
    set.add(value);
    return set;
}
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */ function arrayEach(array, iteratee) {
    var index = -1, length = array ? array.length : 0;
    while(++index < length){
        if (iteratee(array[index], index, array) === false) break;
    }
    return array;
}
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */ function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while(++index < length)array[offset + index] = values[index];
    return array;
}
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */ function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array ? array.length : 0;
    if (initAccum && length) accumulator = array[++index];
    while(++index < length)accumulator = iteratee(accumulator, array[index], index, array);
    return accumulator;
}
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */ function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n)result[index] = iteratee(index);
    return result;
}
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */ function getValue(object, key) {
    return object == null ? undefined : object[key];
}
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */ function isHostObject(value) {
    // Many host objects are `Object` objects that can coerce to strings
    // despite having improperly defined `toString` methods.
    var result = false;
    if (value != null && typeof value.toString != "function") try {
        result = !!(value + "");
    } catch (e) {}
    return result;
}
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */ function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
        result[++index] = [
            key,
            value
        ];
    });
    return result;
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */ function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
        result[++index] = value;
    });
    return result;
}
/** Used for built-in method references. */ var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to detect overreaching core-js shims. */ var coreJsData = root["__core-js_shared__"];
/** Used to detect methods masquerading as native. */ var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
}();
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var objectToString = objectProto.toString;
/** Used to detect if a method is native. */ var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
/** Built-in value references. */ var Buffer = moduleExports ? root.Buffer : undefined, Symbol = root.Symbol, Uint8Array = root.Uint8Array, getPrototype = overArg(Object.getPrototypeOf, Object), objectCreate = Object.create, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined, nativeKeys = overArg(Object.keys, Object);
/* Built-in method references that are verified to be native. */ var DataView = getNative(root, "DataView"), Map = getNative(root, "Map"), Promise = getNative(root, "Promise"), Set = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
/** Used to detect maps, sets, and weakmaps. */ var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
/** Used to convert symbols to primitives and strings. */ var symbolProto = Symbol ? Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function Hash(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */ function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
}
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function hashDelete(key) {
    return this.has(key) && delete this.__data__[key];
}
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
}
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */ function hashSet(key, value) {
    var data = this.__data__;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
}
// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function ListCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */ function listCacheClear() {
    this.__data__ = [];
}
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) return false;
    var lastIndex = data.length - 1;
    if (index == lastIndex) data.pop();
    else splice.call(data, index, 1);
    return true;
}
/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
}
/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
}
/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */ function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) data.push([
        key,
        value
    ]);
    else data[index][1] = value;
    return this;
}
// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function MapCache(entries) {
    var index = -1, length = entries ? entries.length : 0;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */ function mapCacheClear() {
    this.__data__ = {
        "hash": new Hash,
        "map": new (Map || ListCache),
        "string": new Hash
    };
}
/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function mapCacheDelete(key) {
    return getMapData(this, key)["delete"](key);
}
/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function mapCacheGet(key) {
    return getMapData(this, key).get(key);
}
/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function mapCacheHas(key) {
    return getMapData(this, key).has(key);
}
/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */ function mapCacheSet(key, value) {
    getMapData(this, key).set(key, value);
    return this;
}
// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function Stack(entries) {
    this.__data__ = new ListCache(entries);
}
/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */ function stackClear() {
    this.__data__ = new ListCache;
}
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function stackDelete(key) {
    return this.__data__["delete"](key);
}
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function stackGet(key) {
    return this.__data__.get(key);
}
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function stackHas(key) {
    return this.__data__.has(key);
}
/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */ function stackSet(key, value) {
    var cache = this.__data__;
    if (cache instanceof ListCache) {
        var pairs = cache.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([
                key,
                value
            ]);
            return this;
        }
        cache = this.__data__ = new MapCache(pairs);
    }
    cache.set(key, value);
    return this;
}
// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */ function arrayLikeKeys(value, inherited) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    // Safari 9 makes `arguments.length` enumerable in strict mode.
    var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
    var length = result.length, skipIndexes = !!length;
    for(var key in value)if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && (key == "length" || isIndex(key, length)))) result.push(key);
    return result;
}
/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */ function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) object[key] = value;
}
/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function assocIndexOf(array, key) {
    var length = array.length;
    while(length--){
        if (eq(array[length][0], key)) return length;
    }
    return -1;
}
/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */ function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
}
/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */ function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
    var result;
    if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
    if (result !== undefined) return result;
    if (!isObject(value)) return value;
    var isArr = isArray(value);
    if (isArr) {
        result = initCloneArray(value);
        if (!isDeep) return copyArray(value, result);
    } else {
        var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
        if (isBuffer(value)) return cloneBuffer(value, isDeep);
        if (tag == objectTag || tag == argsTag || isFunc && !object) {
            if (isHostObject(value)) return object ? value : {};
            result = initCloneObject(isFunc ? {} : value);
            if (!isDeep) return copySymbols(value, baseAssign(result, value));
        } else {
            if (!cloneableTags[tag]) return object ? value : {};
            result = initCloneByTag(value, tag, baseClone, isDeep);
        }
    }
    // Check for circular references and return its corresponding clone.
    stack || (stack = new Stack);
    var stacked = stack.get(value);
    if (stacked) return stacked;
    stack.set(value, result);
    if (!isArr) var props = isFull ? getAllKeys(value) : keys(value);
    arrayEach(props || value, function(subValue, key) {
        if (props) {
            key = subValue;
            subValue = value[key];
        }
        // Recursively populate clone (susceptible to call stack limits).
        assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
    });
    return result;
}
/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */ function baseCreate(proto) {
    return isObject(proto) ? objectCreate(proto) : {};
}
/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */ function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ function baseGetTag(value) {
    return objectToString.call(value);
}
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */ function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) return false;
    var pattern = isFunction(value) || isHostObject(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
}
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function baseKeys(object) {
    if (!isPrototype(object)) return nativeKeys(object);
    var result = [];
    for(var key in Object(object))if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
    return result;
}
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */ function cloneBuffer(buffer, isDeep) {
    if (isDeep) return buffer.slice();
    var result = new buffer.constructor(buffer.length);
    buffer.copy(result);
    return result;
}
/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */ function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
}
/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */ function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */ function cloneMap(map, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
    return arrayReduce(array, addMapEntry, new map.constructor);
}
/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */ function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
}
/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */ function cloneSet(set, isDeep, cloneFunc) {
    var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
    return arrayReduce(array, addSetEntry, new set.constructor);
}
/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */ function cloneSymbol(symbol) {
    return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */ function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */ function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while(++index < length)array[index] = source[index];
    return array;
}
/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */ function copyObject(source, props, object, customizer) {
    object || (object = {});
    var index = -1, length = props.length;
    while(++index < length){
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;
        assignValue(object, key, newValue === undefined ? source[key] : newValue);
    }
    return object;
}
/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */ function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
}
/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */ function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
}
/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */ function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */ function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
}
/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */ var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ var getTag = baseGetTag;
// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set) != setTag || WeakMap && getTag(new WeakMap) != weakMapTag) getTag = function(value) {
    var result = objectToString.call(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : undefined;
    if (ctorString) switch(ctorString){
        case dataViewCtorString:
            return dataViewTag;
        case mapCtorString:
            return mapTag;
        case promiseCtorString:
            return promiseTag;
        case setCtorString:
            return setTag;
        case weakMapCtorString:
            return weakMapTag;
    }
    return result;
};
/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */ function initCloneArray(array) {
    var length = array.length, result = array.constructor(length);
    // Add properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == "string" && hasOwnProperty.call(array, "index")) {
        result.index = array.index;
        result.input = array.input;
    }
    return result;
}
/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */ function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */ function initCloneByTag(object, tag, cloneFunc, isDeep) {
    var Ctor = object.constructor;
    switch(tag){
        case arrayBufferTag:
            return cloneArrayBuffer(object);
        case boolTag:
        case dateTag:
            return new Ctor(+object);
        case dataViewTag:
            return cloneDataView(object, isDeep);
        case float32Tag:
        case float64Tag:
        case int8Tag:
        case int16Tag:
        case int32Tag:
        case uint8Tag:
        case uint8ClampedTag:
        case uint16Tag:
        case uint32Tag:
            return cloneTypedArray(object, isDeep);
        case mapTag:
            return cloneMap(object, isDeep, cloneFunc);
        case numberTag:
        case stringTag:
            return new Ctor(object);
        case regexpTag:
            return cloneRegExp(object);
        case setTag:
            return cloneSet(object, isDeep, cloneFunc);
        case symbolTag:
            return cloneSymbol(object);
    }
}
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */ function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */ function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */ function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
}
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */ function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
}
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */ function toSource(func) {
    if (func != null) {
        try {
            return funcToString.call(func);
        } catch (e) {}
        try {
            return func + "";
        } catch (e) {}
    }
    return "";
}
/**
 * This method is like `_.clone` except that it recursively clones `value`.
 *
 * @static
 * @memberOf _
 * @since 1.0.0
 * @category Lang
 * @param {*} value The value to recursively clone.
 * @returns {*} Returns the deep cloned value.
 * @see _.clone
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var deep = _.cloneDeep(objects);
 * console.log(deep[0] === objects[0]);
 * // => false
 */ function cloneDeep(value) {
    return baseClone(value, true, true);
}
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */ function eq(value, other) {
    return value === other || value !== value && other !== other;
}
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */ function isArguments(value) {
    // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
    return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */ function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */ function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
}
/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */ var isBuffer = nativeIsBuffer || stubFalse;
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */ function isFunction(value) {
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 8-9 which returns 'object' for typed array and other constructors.
    var tag = isObject(value) ? objectToString.call(value) : "";
    return tag == funcTag || tag == genTag;
}
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */ function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return !!value && (type == "object" || type == "function");
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return !!value && typeof value == "object";
}
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */ function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */ function stubArray() {
    return [];
}
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */ function stubFalse() {
    return false;
}
module.exports = cloneDeep;

},{}],"4u9J9":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "flattenVRVideo", ()=>flattenVRVideo);
parcelHelpers.export(exports, "openSubsEditor", ()=>openSubsEditor);
var _util = require("../util/util");
function flattenVRVideo(videoContainer, video) {
    let isVRVideo = true;
    const VRCanvas = videoContainer.getElementsByClassName("webgl")[0];
    VRCanvas != null ? (0, _util.deleteElement)(VRCanvas) : isVRVideo = false;
    const VRControl = document.getElementsByClassName("ytp-webgl-spherical-control")[0];
    VRControl != null ? (0, _util.deleteElement)(VRControl) : isVRVideo = false;
    if (isVRVideo) {
        videoContainer.style.cursor = "auto";
        video.style.display = "block";
        (0, _util.flashMessage)("Flattened VR video.", "green");
    } else (0, _util.flashMessage)("Not a VR video or already flattened.", "red");
}
function openSubsEditor(videoID) {
    const url = `https://www.youtube.com/timedtext_video?ref=player&v=${videoID}`;
    window.open(url, "_blank");
}

},{"../util/util":"jxJ0L","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"4Y6Yu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Crop", ()=>Crop);
parcelHelpers.export(exports, "getCropSize", ()=>getCropSize);
parcelHelpers.export(exports, "getMinMaxAvgCropPoint", ()=>getMinMaxAvgCropPoint);
parcelHelpers.export(exports, "isVariableSize", ()=>isVariableSize);
var _util = require("../util/util");
class Crop {
    static #_ = this.minX = 0;
    static #_2 = this.minY = 0;
    static #_3 = this._minW = 20;
    static #_4 = this._minH = 20;
    static #_5 = this.shouldConstrainMinDimensions = true;
    static get minW() {
        return Crop.shouldConstrainMinDimensions ? Crop._minW : 0;
    }
    static get minH() {
        return Crop.shouldConstrainMinDimensions ? Crop._minH : 0;
    }
    constructor(_x, _y, _w, _h, maxW, maxH // private _minW: number, // private _minH: number
    ){
        this._x = _x;
        this._y = _y;
        this._w = _w;
        this._h = _h;
        this.maxW = maxW;
        this.maxH = maxH;
        this._history = [];
        this._defaultAspectRatio = 1;
        this._x = Math.max(Crop.minX, _x);
        this._y = Math.max(Crop.minY, _y);
        // this._minW = Crop.minW;
        // this._minW = Crop.minW;
        this.maxW = Math.max(Crop.minW, maxW);
        this.maxH = Math.max(Crop.minH, maxH);
        this._w = (0, _util.clampNumber)(_w, Crop.minW, this.maxW);
        this._h = (0, _util.clampNumber)(_h, Crop.minH, this.maxH);
    }
    static fromCropString(cropString, cropRes) {
        const [x, y, w, h] = Crop.getCropComponents(cropString);
        const [maxW, maxH] = Crop.getMaxDimensions(cropRes);
        return new this(x, y, w, h, maxW, maxH);
    }
    get cropString() {
        return this.cropComponents.join(":");
    }
    set cropString(cropString) {
        [this._x, this._y, this._w, this._h] = Crop.getCropComponents(cropString);
    }
    get rotatedCropStringClockWise() {
        let [x, y, w, h] = this.cropComponents;
        // bottom edge
        y = this.maxH - (y + h);
        [x, y, w, h] = [
            y,
            x,
            h,
            w
        ];
        return [
            x,
            y,
            w,
            h
        ].join(":");
    }
    get rotatedCropStringCounterClockWise() {
        let [x, y, w, h] = this.cropComponents;
        // right edge
        x = this.maxW - (x + w);
        [x, y, w, h] = [
            y,
            x,
            h,
            w
        ];
        return [
            x,
            y,
            w,
            h
        ].join(":");
    }
    setCropStringSafe(cropString, shouldMaintainCropAspectRatio = false) {
        const [nx, ny, nw, nh] = Crop.getCropComponents(cropString);
        const isDrag = nw === this._w && nh === this._h;
        const maxX = isDrag ? this.maxW - this._w : this.maxW - Crop.minW;
        const maxY = isDrag ? this.maxH - this._h : this.maxH - Crop.minH;
        let cx = (0, _util.clampNumber)(nx, Crop.minX, maxX);
        let cy = (0, _util.clampNumber)(ny, Crop.minY, maxY);
        const maxW = this.maxW - cx;
        const maxH = this.maxH - cy;
        let cw = isDrag ? this._w : (0, _util.clampNumber)(nw, Crop.minW, maxW);
        let ch = isDrag ? this._h : (0, _util.clampNumber)(nh, Crop.minH, maxH);
        if (shouldMaintainCropAspectRatio) {
            const ar = this.aspectRatio;
            const ph = Math.floor(cw / ar);
            const pw = Math.floor(ch * ar);
            const phWithinBounds = Crop.minH <= ph && ph <= this.maxH;
            const pwWithinBounds = Crop.minW <= pw && pw <= this.maxW;
            if (!phWithinBounds && !pwWithinBounds) throw new Error("Could not determine a valid aspect-ratio-constrained crop.");
            if (phWithinBounds) ch = ph;
            else cw = pw;
        }
        this.cropString = (0, _util.getCropString)(cx, cy, cw, ch);
    }
    static getCropComponents(cropString, cropRes) {
        let maxW, maxH;
        if (cropRes != null) [maxW, maxH] = Crop.getMaxDimensions(cropRes);
        const cropArr = cropString.split(":").map((cropComponent)=>{
            if (cropComponent === "iw") return maxW;
            if (cropComponent === "ih") return maxH;
            return parseInt(cropComponent, 10);
        });
        return cropArr;
    }
    static getMaxDimensions(cropRes) {
        const maxDimensions = cropRes.split("x").map((dim)=>parseInt(dim, 10));
        return maxDimensions;
    }
    static getMultipliedCropRes(cropRes, cropMultipleX, cropMultipleY) {
        let [maxW, maxH] = Crop.getMaxDimensions(cropRes);
        maxW = maxW * cropMultipleX;
        maxH = maxH * cropMultipleY;
        return `${maxW}x${maxH}`;
    }
    get cropComponents() {
        return [
            this._x,
            this._y,
            this._w,
            this._h
        ];
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get w() {
        return this._w;
    }
    get h() {
        return this._h;
    }
    get r() {
        return this._x + this._w;
    }
    get b() {
        return this._y + this._h;
    }
    panX(delta) {
        delta = (0, _util.clampNumber)(delta, -this._x, this.maxW - this.r);
        this._x += delta;
    }
    panY(delta) {
        delta = (0, _util.clampNumber)(delta, -this._y, this.maxH - this.b);
        this._y += delta;
    }
    set defaultAspectRatio(aspectRatio) {
        this._defaultAspectRatio = aspectRatio;
    }
    get aspectRatio() {
        return this._w == 0 || this._h == 0 ? this._defaultAspectRatio : this._w / this._h;
    }
    get minResizeS() {
        return -(this.b - (this._y + Crop.minH));
    }
    get maxResizeS() {
        return this.maxH - this.b;
    }
    get minResizeE() {
        return -(this.r - (this._x + Crop.minW));
    }
    get maxResizeE() {
        return this.maxW - this.r;
    }
    get minResizeN() {
        return -(this.b - Crop.minH - this._y);
    }
    get maxResizeN() {
        return this._y;
    }
    get minResizeW() {
        return -(this.r - Crop.minW - this._x);
    }
    get maxResizeW() {
        return this._x;
    }
    get cx() {
        return this._x + this._w / 2;
    }
    get cy() {
        return this._y + this._h / 2;
    }
    clampResizeN(delta) {
        delta = (0, _util.clampNumber)(delta, this.minResizeN, this.maxResizeN);
        return delta;
    }
    clampResizeE(delta) {
        delta = (0, _util.clampNumber)(delta, this.minResizeE, this.maxResizeE);
        return delta;
    }
    clampResizeS(delta) {
        delta = (0, _util.clampNumber)(delta, this.minResizeS, this.maxResizeS);
        return delta;
    }
    clampResizeW(delta) {
        delta = (0, _util.clampNumber)(delta, this.minResizeW, this.maxResizeW);
        return delta;
    }
    resizeN(delta, shouldClamp = true) {
        delta = this.clampResizeN(delta);
        this._y -= delta;
        this._h += delta;
        return delta;
    }
    resizeW(delta, shouldClamp = true) {
        if (shouldClamp) delta = (0, _util.clampNumber)(delta, this.minResizeW, this.maxResizeW);
        this._x -= delta;
        this._w += delta;
        return delta;
    }
    resizeS(delta, shouldClamp = true) {
        if (shouldClamp) delta = (0, _util.clampNumber)(delta, this.minResizeS, this.maxResizeS);
        this._h += delta;
        return delta;
    }
    resizeE(delta, shouldClamp = true) {
        if (shouldClamp) delta = (0, _util.clampNumber)(delta, this.minResizeE, this.maxResizeE);
        this._w += delta;
        return delta;
    }
    resizeNE(deltaY, deltaX) {
        this.resizeN(deltaY);
        this.resizeE(deltaX);
    }
    resizeSE(deltaY, deltaX) {
        this.resizeS(deltaY);
        this.resizeE(deltaX);
    }
    resizeSW(deltaY, deltaX) {
        this.resizeS(deltaY);
        this.resizeW(deltaX);
    }
    resizeNW(deltaY, deltaX) {
        this.resizeN(deltaY);
        this.resizeW(deltaX);
    }
    resizeNS(delta) {
        if (delta >= 0) {
            delta = this.clampResizeN(delta);
            delta = this.clampResizeS(delta);
        } else delta = Math.max(delta, -(this.b - this.cy - Crop.minH / 2));
        this.resizeN(delta, false);
        this.resizeS(delta, false);
    }
    resizeEW(delta) {
        if (delta >= 0) {
            delta = this.clampResizeE(delta);
            delta = this.clampResizeW(delta);
        } else delta = Math.max(delta, -(this.r - this.cx - Crop.minW / 2));
        this.resizeE(delta, false);
        this.resizeW(delta, false);
    }
    resizeNESW(deltaY, deltaX) {
        if (deltaY >= 0) {
            deltaY = this.clampResizeN(deltaY);
            deltaY = this.clampResizeS(deltaY);
        } else deltaY = Math.max(deltaY, -(this.b - this.cy - Crop.minH / 2));
        if (deltaX >= 0) {
            deltaX = this.clampResizeE(deltaX);
            deltaX = this.clampResizeW(deltaX);
        } else deltaX = Math.max(deltaX, -(this.r - this.cx - Crop.minW / 2));
        this.resizeN(deltaY, false);
        this.resizeS(deltaY, false);
        this.resizeE(deltaX, false);
        this.resizeW(deltaX, false);
    }
    resizeNAspectRatioLocked(delta) {
        const aspectRatio = this.aspectRatio;
        delta = this.clampResizeN(delta);
        delta *= aspectRatio;
        delta = Math.round(delta);
        delta = this.resizeE(delta);
        delta /= aspectRatio;
        delta = Math.round(delta);
        this.resizeN(delta);
    }
    resizeEAspectRatioLocked(delta) {
        const aspectRatio = this.aspectRatio;
        delta = this.clampResizeE(Math.round(delta));
        delta /= aspectRatio;
        delta = Math.round(delta);
        delta = this.resizeS(Math.round(delta));
        delta *= aspectRatio;
        delta = Math.round(delta);
        this.resizeE(delta);
    }
    resizeSAspectRatioLocked(delta) {
        const aspectRatio = this.aspectRatio;
        delta = this.clampResizeS(delta);
        delta *= aspectRatio;
        delta = Math.round(delta);
        delta = this.resizeE(delta);
        delta /= aspectRatio;
        delta = Math.round(delta);
        this.resizeS(delta);
    }
    resizeWAspectRatioLocked(delta) {
        const aspectRatio = this.aspectRatio;
        delta = this.clampResizeW(delta);
        delta /= aspectRatio;
        delta = Math.round(delta);
        delta = this.resizeS(delta);
        delta *= aspectRatio;
        delta = Math.round(delta);
        this.resizeW(delta);
    }
    get aspectRatioPair() {
        const a = this.aspectRatio / (this.aspectRatio + 1);
        const b = 1 - a;
        return [
            a,
            b
        ];
    }
    resizeSEAspectRatioLocked(deltaY, deltaX) {
        const [a, b] = this.aspectRatioPair;
        deltaX *= a;
        deltaY *= b;
        deltaY += deltaX / this.aspectRatio;
        deltaY = this.clampResizeS(deltaY);
        deltaX = deltaY * this.aspectRatio;
        deltaX = Math.round(deltaX);
        deltaX = this.clampResizeE(deltaX);
        deltaY = deltaX / this.aspectRatio;
        deltaY = Math.round(deltaY);
        deltaY = this.clampResizeS(deltaY);
        this.resizeS(deltaY, false);
        this.resizeE(deltaX, false);
    }
    resizeSWAspectRatioLocked(deltaY, deltaX) {
        const [a, b] = this.aspectRatioPair;
        deltaX *= a;
        deltaY *= b;
        deltaY += deltaX / this.aspectRatio;
        deltaY = this.clampResizeS(deltaY);
        deltaX = deltaY * this.aspectRatio;
        deltaX = Math.round(deltaX);
        deltaX = this.clampResizeW(deltaX);
        deltaY = deltaX / this.aspectRatio;
        deltaY = Math.round(deltaY);
        deltaY = this.clampResizeS(deltaY);
        this.resizeS(deltaY, false);
        this.resizeW(deltaX, false);
    }
    resizeNEAspectRatioLocked(deltaY, deltaX) {
        const [a, b] = this.aspectRatioPair;
        deltaX *= a;
        deltaY *= b;
        deltaY += deltaX / this.aspectRatio;
        deltaY = this.clampResizeN(deltaY);
        deltaX = deltaY * this.aspectRatio;
        deltaX = Math.round(deltaX);
        deltaX = this.clampResizeE(deltaX);
        deltaY = deltaX / this.aspectRatio;
        deltaY = Math.round(deltaY);
        deltaY = this.clampResizeN(deltaY);
        this.resizeN(deltaY, false);
        this.resizeE(deltaX, false);
    }
    resizeNWAspectRatioLocked(deltaY, deltaX) {
        const [a, b] = this.aspectRatioPair;
        deltaX *= a;
        deltaY *= b;
        deltaY += deltaX / this.aspectRatio;
        deltaY = this.clampResizeN(deltaY);
        deltaX = deltaY * this.aspectRatio;
        deltaX = Math.round(deltaX);
        deltaX = this.clampResizeW(deltaX);
        deltaY = deltaX / this.aspectRatio;
        deltaY = Math.round(deltaY);
        deltaY = this.clampResizeN(deltaY);
        this.resizeN(deltaY, false);
        this.resizeW(deltaX, false);
    }
    resizeNESWAspectRatioLocked(deltaY, deltaX) {
        const [a, b] = this.aspectRatioPair;
        let isExpand = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX >= 0 : deltaY >= 0;
        deltaX *= a;
        deltaY *= b;
        if (isExpand) {
            deltaY += deltaX / this.aspectRatio;
            deltaY = this.clampResizeN(deltaY);
            deltaY = this.clampResizeS(deltaY);
            deltaX = deltaY * this.aspectRatio;
            deltaX = Math.round(deltaX);
            deltaX = this.clampResizeE(deltaX);
            deltaX = this.clampResizeW(deltaX);
            deltaY = deltaX / this.aspectRatio;
            deltaY = Math.round(deltaY);
            deltaY = this.clampResizeN(deltaY);
            deltaY = this.clampResizeS(deltaY);
        } else {
            deltaY += deltaX / this.aspectRatio;
            deltaY = Math.max(deltaY, -(this.b - this.cy - Crop.minH / 2));
            deltaX = deltaY * this.aspectRatio;
            deltaX = Math.round(deltaX);
            deltaX = Math.max(deltaX, -(this.r - this.cx - Crop.minW / 2));
            deltaY = deltaX / this.aspectRatio;
            deltaY = Math.round(deltaY);
            deltaY = Math.max(deltaY, -(this.b - this.cy - Crop.minH / 2));
        }
        this.resizeN(deltaY, false);
        this.resizeE(deltaX, false);
        this.resizeS(deltaY, false);
        this.resizeW(deltaX, false);
    }
}
function getCropSize(crop, cropRes) {
    const [, , w, h] = Crop.getCropComponents(crop, cropRes);
    const size = w * h;
    const aspectRatio = w / h;
    return {
        w,
        h,
        size,
        aspectRatio
    };
}
function getMinMaxAvgCropPoint(cropMap, cropRes) {
    const { aspectRatio } = getCropSize(cropMap[0].crop, cropRes);
    let [minSize, minSizeW, minSizeH] = [
        Infinity,
        Infinity,
        Infinity
    ];
    let [maxSize, maxSizeW, maxSizeH] = [
        -Infinity,
        -Infinity,
        -Infinity
    ];
    let [avgSize, avgSizeW, avgSizeH] = [
        0,
        0,
        0
    ];
    cropMap.forEach((cropPoint, i)=>{
        const { w, h, size } = getCropSize(cropPoint.crop, cropRes);
        if (size < minSize) [minSizeW, minSizeH, minSize] = [
            w,
            h,
            size
        ];
        if (size > maxSize) [maxSizeW, maxSizeH, maxSize] = [
            w,
            h,
            size
        ];
        avgSizeW += (w - avgSizeW) / (i + 1);
    });
    avgSizeH = Math.floor(avgSizeW / aspectRatio);
    avgSizeW = Math.floor(avgSizeW);
    avgSize = avgSizeW * avgSizeH;
    return {
        minSizeW,
        minSizeH,
        minSize,
        maxSizeW,
        maxSizeH,
        maxSize,
        avgSizeW,
        avgSizeH,
        avgSize
    };
}
function isVariableSize(cropMap, cropRes) {
    const { size } = getCropSize(cropMap[0].crop, cropRes);
    const isVariableSize = cropMap.some((cropPoint)=>{
        return size !== getCropSize(cropPoint.crop, cropRes).size;
    });
    return isVariableSize;
}

},{"../util/util":"jxJ0L","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"6RVIe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "enableCommonBlockers", ()=>enableCommonBlockers);
parcelHelpers.export(exports, "disableCommonBlockers", ()=>disableCommonBlockers);
function enableCommonBlockers() {
    enablePreventMouseZoom();
    enablePreventSpaceScroll();
}
function disableCommonBlockers() {
    disablePreventMouseZoom();
    disablePreventSpaceScroll();
}
function enablePreventMouseZoom() {
    window.addEventListener("mousewheel", stopWheelZoom, {
        passive: false
    });
    window.addEventListener("DOMMouseScroll", stopWheelZoom, {
        passive: false
    });
}
function disablePreventMouseZoom() {
    window.removeEventListener("mousewheel", stopWheelZoom);
    window.removeEventListener("DOMMouseScroll", stopWheelZoom);
}
function stopWheelZoom(e) {
    if (e.ctrlKey || e.shiftKey) e.preventDefault();
}
function enablePreventSpaceScroll() {
    window.addEventListener("keydown", preventSpaceScrollHandler);
}
function disablePreventSpaceScroll() {
    window.removeEventListener("keydown", preventSpaceScrollHandler);
}
function preventSpaceScrollHandler(e) {
    if (e.code === "Space" && e.target == document.body && !e.ctrlKey && !e.shiftKey && !e.altKey) e.preventDefault();
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"7bvM2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "enableYTBlockers", ()=>enableYTBlockers);
parcelHelpers.export(exports, "disableYTBlockers", ()=>disableYTBlockers);
function enableYTBlockers() {
    enablePreventSideBarPull();
    enablePreventAltDefault();
}
function disableYTBlockers() {
    disablePreventSideBarPull();
    disablePreventAltDefault();
}
function enablePreventAltDefault() {
    window.addEventListener("keyup", preventAltDefaultHandler, true);
}
function disablePreventAltDefault() {
    window.removeEventListener("keyup", preventAltDefaultHandler, true);
}
function enablePreventSideBarPull() {
    const sideBar = document.getElementById("contentContainer");
    const sideBarContent = document.getElementById("guide-content");
    sideBarContent.style.pointerEvents = "auto";
    if (sideBar != null) sideBar.style.pointerEvents = "none";
}
function disablePreventSideBarPull() {
    const sideBar = document.getElementById("contentContainer");
    if (sideBar != null) sideBar.style.removeProperty("pointer-events");
}
function preventAltDefaultHandler(e) {
    if (e.code === "AltLeft" && !e.ctrlKey && !e.shiftKey) e.preventDefault();
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"7L08I":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "createRounder", ()=>createRounder);
parcelHelpers.export(exports, "roundValue", ()=>roundValue);
var _chartJs = require("chart.js");
var _chartJsDefault = parcelHelpers.interopDefault(_chartJs);
var _d3Drag = require("d3-drag");
var _d3Selection = require("d3-selection");
var _immer = require("immer");
var _ytClipper = require("../../yt_clipper");
let element, scale, scaleX, radar;
function getElement(chartInstance, callback) {
    return ()=>{
        if (0, _d3Selection.event) {
            const e = (0, _d3Selection.event).sourceEvent;
            element = chartInstance.getElementAtEvent(e)[0];
            radar = chartInstance.config.type == "radar";
            let scaleName = radar ? "_scale" : "_yScale";
            if (element) {
                if (chartInstance.data.datasets[element["_datasetIndex"]].dragData === false || element[scaleName].options.dragData === false) {
                    element = null;
                    return;
                }
                scale = element[scaleName].id;
                if (element["_xScale"]) scaleX = element["_xScale"].id;
                if (typeof callback === "function" && element) {
                    const datasetIndex = element["_datasetIndex"];
                    const index = element["_index"];
                    const value = chartInstance.data.datasets[datasetIndex].data[index];
                    if (callback(e, chartInstance, element, value) === false) element = null;
                }
            }
        }
    };
}
function createRounder(multiple, precision) {
    return (value)=>{
        const roundedValue = Math.round(value / multiple) * multiple;
        const roundedValueFixedPrecision = +roundedValue.toFixed(precision);
        return roundedValueFixedPrecision;
    };
}
function roundValue(value, multiple, precision) {
    return createRounder(multiple, precision)(value);
}
function updateData(chartInstance, callback) {
    return ()=>{
        if (element && (0, _d3Selection.event)) {
            const e = (0, _d3Selection.event).sourceEvent;
            const datasetIndex = element["_datasetIndex"];
            const index = element["_index"];
            const roundMultipleX = chartInstance.options.dragDataRoundMultipleX;
            const roundPrecisionX = chartInstance.options.dragDataRoundPrecisionX;
            const roundMultipleY = chartInstance.options.dragDataRoundMultipleY;
            const roundPrecisionY = chartInstance.options.dragDataRoundPrecisionY;
            const roundX = createRounder(roundMultipleX, roundPrecisionX);
            const roundY = createRounder(roundMultipleY, roundPrecisionY);
            let x;
            let y;
            const initialState = chartInstance.data.datasets[datasetIndex].data;
            const dataRef = (0, _immer.createDraft)(initialState);
            let datumRef = dataRef[index];
            let proposedDatum = {
                x: datumRef.x,
                y: datumRef.y
            };
            if (radar) {
                let v;
                if (e.touches) {
                    x = e.touches[0].clientX - chartInstance.canvas.getBoundingClientRect().left;
                    y = e.touches[0].clientY - chartInstance.canvas.getBoundingClientRect().top;
                } else {
                    x = e.clientX - chartInstance.canvas.getBoundingClientRect().left;
                    y = e.clientY - chartInstance.canvas.getBoundingClientRect().top;
                }
                let rScale = chartInstance.scales[scale];
                let d = Math.sqrt(Math.pow(x - rScale.xCenter, 2) + Math.pow(y - rScale.yCenter, 2));
                let scalingFactor = rScale.drawingArea / (rScale.max - rScale.min);
                if (rScale.options.ticks.reverse) v = rScale.max - d / scalingFactor;
                else v = rScale.min + d / scalingFactor;
                v = roundValue(v, chartInstance.options.dragDataRound, 2);
                v = Math.min(v, chartInstance.scale.max);
                v = Math.max(v, chartInstance.scale.min);
                proposedDatum = v;
            } else {
                if (e.touches) {
                    x = chartInstance.scales[scaleX].getValueForPixel(e.touches[0].clientX - chartInstance.canvas.getBoundingClientRect().left);
                    y = chartInstance.scales[scale].getValueForPixel(e.touches[0].clientY - chartInstance.canvas.getBoundingClientRect().top);
                } else {
                    x = chartInstance.scales[scaleX].getValueForPixel(e.clientX - chartInstance.canvas.getBoundingClientRect().left);
                    y = chartInstance.scales[scale].getValueForPixel(e.clientY - chartInstance.canvas.getBoundingClientRect().top);
                }
                x = roundX(x);
                y = roundY(y);
                x = Math.min(x, chartInstance.scales[scaleX].max);
                x = Math.max(x, chartInstance.scales[scaleX].min);
                y = Math.min(y, chartInstance.scales[scale].max);
                y = Math.max(y, chartInstance.scales[scale].min);
                proposedDatum.x = x;
                if (datumRef.y !== undefined) proposedDatum.y = y;
                else proposedDatum = y;
            }
            let shouldChartUpdateX = chartInstance.options.dragX && datumRef.x !== undefined;
            let shouldChartUpdateY = chartInstance.options.dragY;
            let shouldChartUpdate;
            if (typeof callback === "function") {
                shouldChartUpdate = callback(e, chartInstance, datasetIndex, index, datumRef, proposedDatum);
                shouldChartUpdateX = shouldChartUpdateX && shouldChartUpdate.dragX;
                shouldChartUpdateY = shouldChartUpdateY && shouldChartUpdate.dragY;
            }
            if (shouldChartUpdateX !== false) datumRef.x = proposedDatum.x;
            if (shouldChartUpdateY !== false) {
                if (datumRef.y !== undefined) datumRef.y = proposedDatum.y;
                else datumRef = proposedDatum;
            }
            const newState = (0, _immer.finishDraft)(dataRef);
            const markerPair = (0, _ytClipper.markerPairs)[0, _ytClipper.prevSelectedMarkerPairIndex];
            chartInstance.data.datasets[datasetIndex].data = newState;
            shouldChartUpdate.chartType === "crop" ? markerPair.cropMap = newState : markerPair.speedMap = newState;
            if (shouldChartUpdateX !== false || shouldChartUpdateY !== false) chartInstance.update(0);
        }
    };
}
function dragEndCallback(chartInstance, callback) {
    return ()=>{
        if (typeof callback === "function" && element) {
            const e = (0, _d3Selection.event).sourceEvent;
            const datasetIndex = element["_datasetIndex"];
            const index = element["_index"];
            const value = chartInstance.data.datasets[datasetIndex].data[index];
            return callback(e, chartInstance, datasetIndex, index, value);
        }
    };
}
const ChartJSdragDataPlugin = {
    beforeDatasetsUpdate: function(chartInstance) {
        if (chartInstance.options.dragData) (0, _d3Selection.select)(chartInstance.chart.canvas).call((0, _d3Drag.drag)().container(chartInstance.chart.canvas).on("start", getElement(chartInstance, chartInstance.options.onDragStart)).on("drag", updateData(chartInstance, chartInstance.options.onDrag)).on("end", dragEndCallback(chartInstance, chartInstance.options.onDragEnd)));
    }
};
(0, _chartJsDefault.default).pluginService.register(ChartJSdragDataPlugin);
exports.default = ChartJSdragDataPlugin;

},{"chart.js":"fyX24","d3-drag":"1a2NL","d3-selection":"96u45","immer":"2hRSJ","../../yt_clipper":"49CxU","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"1a2NL":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "drag", ()=>(0, _dragJsDefault.default));
parcelHelpers.export(exports, "dragDisable", ()=>(0, _nodragJsDefault.default));
parcelHelpers.export(exports, "dragEnable", ()=>(0, _nodragJs.yesdrag));
var _dragJs = require("./drag.js");
var _dragJsDefault = parcelHelpers.interopDefault(_dragJs);
var _nodragJs = require("./nodrag.js");
var _nodragJsDefault = parcelHelpers.interopDefault(_nodragJs);

},{"./drag.js":"dOXNT","./nodrag.js":false,"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"dOXNT":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        var filter = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {}, listeners = (0, _d3Dispatch.dispatch)("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
        function drag(selection) {
            selection.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
        }
        function mousedowned() {
            if (touchending || !filter.apply(this, arguments)) return;
            var gesture = beforestart("mouse", container.apply(this, arguments), (0, _d3Selection.mouse), this, arguments);
            if (!gesture) return;
            (0, _d3Selection.select)((0, _d3Selection.event).view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
            (0, _nodragJsDefault.default)((0, _d3Selection.event).view);
            (0, _noeventJs.nopropagation)();
            mousemoving = false;
            mousedownx = (0, _d3Selection.event).clientX;
            mousedowny = (0, _d3Selection.event).clientY;
            gesture("start");
        }
        function mousemoved() {
            (0, _noeventJsDefault.default)();
            if (!mousemoving) {
                var dx = (0, _d3Selection.event).clientX - mousedownx, dy = (0, _d3Selection.event).clientY - mousedowny;
                mousemoving = dx * dx + dy * dy > clickDistance2;
            }
            gestures.mouse("drag");
        }
        function mouseupped() {
            (0, _d3Selection.select)((0, _d3Selection.event).view).on("mousemove.drag mouseup.drag", null);
            (0, _nodragJs.yesdrag)((0, _d3Selection.event).view, mousemoving);
            (0, _noeventJsDefault.default)();
            gestures.mouse("end");
        }
        function touchstarted() {
            if (!filter.apply(this, arguments)) return;
            var touches = (0, _d3Selection.event).changedTouches, c = container.apply(this, arguments), n = touches.length, i, gesture;
            for(i = 0; i < n; ++i)if (gesture = beforestart(touches[i].identifier, c, (0, _d3Selection.touch), this, arguments)) {
                (0, _noeventJs.nopropagation)();
                gesture("start");
            }
        }
        function touchmoved() {
            var touches = (0, _d3Selection.event).changedTouches, n = touches.length, i, gesture;
            for(i = 0; i < n; ++i)if (gesture = gestures[touches[i].identifier]) {
                (0, _noeventJsDefault.default)();
                gesture("drag");
            }
        }
        function touchended() {
            var touches = (0, _d3Selection.event).changedTouches, n = touches.length, i, gesture;
            if (touchending) clearTimeout(touchending);
            touchending = setTimeout(function() {
                touchending = null;
            }, 500); // Ghost clicks are delayed!
            for(i = 0; i < n; ++i)if (gesture = gestures[touches[i].identifier]) {
                (0, _noeventJs.nopropagation)();
                gesture("end");
            }
        }
        function beforestart(id, container, point, that, args) {
            var p = point(container, id), s, dx, dy, sublisteners = listeners.copy();
            if (!(0, _d3Selection.customEvent)(new (0, _eventJsDefault.default)(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
                if (((0, _d3Selection.event).subject = s = subject.apply(that, args)) == null) return false;
                dx = s.x - p[0] || 0;
                dy = s.y - p[1] || 0;
                return true;
            })) return;
            return function gesture(type) {
                var p0 = p, n;
                switch(type){
                    case "start":
                        gestures[id] = gesture, n = active++;
                        break;
                    case "end":
                        delete gestures[id], --active; // nobreak
                    case "drag":
                        p = point(container, id), n = active;
                        break;
                }
                (0, _d3Selection.customEvent)(new (0, _eventJsDefault.default)(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [
                    type,
                    that,
                    args
                ]);
            };
        }
        drag.filter = function(_) {
            return arguments.length ? (filter = typeof _ === "function" ? _ : (0, _constantJsDefault.default)(!!_), drag) : filter;
        };
        drag.container = function(_) {
            return arguments.length ? (container = typeof _ === "function" ? _ : (0, _constantJsDefault.default)(_), drag) : container;
        };
        drag.subject = function(_) {
            return arguments.length ? (subject = typeof _ === "function" ? _ : (0, _constantJsDefault.default)(_), drag) : subject;
        };
        drag.touchable = function(_) {
            return arguments.length ? (touchable = typeof _ === "function" ? _ : (0, _constantJsDefault.default)(!!_), drag) : touchable;
        };
        drag.on = function() {
            var value = listeners.on.apply(listeners, arguments);
            return value === listeners ? drag : value;
        };
        drag.clickDistance = function(_) {
            return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
        };
        return drag;
    });
var _d3Dispatch = require("d3-dispatch");
var _d3Selection = require("d3-selection");
var _nodragJs = require("./nodrag.js");
var _nodragJsDefault = parcelHelpers.interopDefault(_nodragJs);
var _noeventJs = require("./noevent.js");
var _noeventJsDefault = parcelHelpers.interopDefault(_noeventJs);
var _constantJs = require("./constant.js");
var _constantJsDefault = parcelHelpers.interopDefault(_constantJs);
var _eventJs = require("./event.js");
var _eventJsDefault = parcelHelpers.interopDefault(_eventJs);
// Ignore right-click, since that should open the context menu.
function defaultFilter() {
    return !(0, _d3Selection.event).ctrlKey && !(0, _d3Selection.event).button;
}
function defaultContainer() {
    return this.parentNode;
}
function defaultSubject(d) {
    return d == null ? {
        x: (0, _d3Selection.event).x,
        y: (0, _d3Selection.event).y
    } : d;
}
function defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
}

},{"d3-dispatch":"55jQS","d3-selection":"96u45","./nodrag.js":"iyYwd","./noevent.js":"hb21F","./constant.js":"1v7Zp","./event.js":"1phwa","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"55jQS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "dispatch", ()=>(0, _dispatchJsDefault.default));
var _dispatchJs = require("./dispatch.js");
var _dispatchJsDefault = parcelHelpers.interopDefault(_dispatchJs);

},{"./dispatch.js":"5pbkn","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"5pbkn":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
var noop = {
    value: function() {}
};
function dispatch() {
    for(var i = 0, n = arguments.length, _ = {}, t; i < n; ++i){
        if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
    }
    return new Dispatch(_);
}
function Dispatch(_) {
    this._ = _;
}
function parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {
            type: t,
            name: name
        };
    });
}
Dispatch.prototype = dispatch.prototype = {
    constructor: Dispatch,
    on: function(typename, callback) {
        var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
            while(++i < n)if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
            return;
        }
        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while(++i < n){
            if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
            else if (callback == null) for(t in _)_[t] = set(_[t], typename.name, null);
        }
        return this;
    },
    copy: function() {
        var copy = {}, _ = this._;
        for(var t in _)copy[t] = _[t].slice();
        return new Dispatch(copy);
    },
    call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for(var args = new Array(n), i = 0, n, t; i < n; ++i)args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(var t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    }
};
function get(type, name) {
    for(var i = 0, n = type.length, c; i < n; ++i){
        if ((c = type[i]).name === name) return c.value;
    }
}
function set(type, name, callback) {
    for(var i = 0, n = type.length; i < n; ++i)if (type[i].name === name) {
        type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
    }
    if (callback != null) type.push({
        name: name,
        value: callback
    });
    return type;
}
exports.default = dispatch;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"96u45":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "create", ()=>(0, _createDefault.default));
parcelHelpers.export(exports, "creator", ()=>(0, _creatorDefault.default));
parcelHelpers.export(exports, "local", ()=>(0, _localDefault.default));
parcelHelpers.export(exports, "matcher", ()=>(0, _matcherDefault.default));
parcelHelpers.export(exports, "mouse", ()=>(0, _mouseDefault.default));
parcelHelpers.export(exports, "namespace", ()=>(0, _namespaceDefault.default));
parcelHelpers.export(exports, "namespaces", ()=>(0, _namespacesDefault.default));
parcelHelpers.export(exports, "clientPoint", ()=>(0, _pointDefault.default));
parcelHelpers.export(exports, "select", ()=>(0, _selectDefault.default));
parcelHelpers.export(exports, "selectAll", ()=>(0, _selectAllDefault.default));
parcelHelpers.export(exports, "selection", ()=>(0, _indexDefault.default));
parcelHelpers.export(exports, "selector", ()=>(0, _selectorDefault.default));
parcelHelpers.export(exports, "selectorAll", ()=>(0, _selectorAllDefault.default));
parcelHelpers.export(exports, "style", ()=>(0, _style.styleValue));
parcelHelpers.export(exports, "touch", ()=>(0, _touchDefault.default));
parcelHelpers.export(exports, "touches", ()=>(0, _touchesDefault.default));
parcelHelpers.export(exports, "window", ()=>(0, _windowDefault.default));
parcelHelpers.export(exports, "event", ()=>(0, _on.event));
parcelHelpers.export(exports, "customEvent", ()=>(0, _on.customEvent));
var _create = require("./create");
var _createDefault = parcelHelpers.interopDefault(_create);
var _creator = require("./creator");
var _creatorDefault = parcelHelpers.interopDefault(_creator);
var _local = require("./local");
var _localDefault = parcelHelpers.interopDefault(_local);
var _matcher = require("./matcher");
var _matcherDefault = parcelHelpers.interopDefault(_matcher);
var _mouse = require("./mouse");
var _mouseDefault = parcelHelpers.interopDefault(_mouse);
var _namespace = require("./namespace");
var _namespaceDefault = parcelHelpers.interopDefault(_namespace);
var _namespaces = require("./namespaces");
var _namespacesDefault = parcelHelpers.interopDefault(_namespaces);
var _point = require("./point");
var _pointDefault = parcelHelpers.interopDefault(_point);
var _select = require("./select");
var _selectDefault = parcelHelpers.interopDefault(_select);
var _selectAll = require("./selectAll");
var _selectAllDefault = parcelHelpers.interopDefault(_selectAll);
var _index = require("./selection/index");
var _indexDefault = parcelHelpers.interopDefault(_index);
var _selector = require("./selector");
var _selectorDefault = parcelHelpers.interopDefault(_selector);
var _selectorAll = require("./selectorAll");
var _selectorAllDefault = parcelHelpers.interopDefault(_selectorAll);
var _style = require("./selection/style");
var _touch = require("./touch");
var _touchDefault = parcelHelpers.interopDefault(_touch);
var _touches = require("./touches");
var _touchesDefault = parcelHelpers.interopDefault(_touches);
var _window = require("./window");
var _windowDefault = parcelHelpers.interopDefault(_window);
var _on = require("./selection/on");

},{"./create":false,"./creator":false,"./local":false,"./matcher":false,"./mouse":"g5NrP","./namespace":false,"./namespaces":false,"./point":false,"./select":"Q2XYu","./selectAll":false,"./selection/index":false,"./selector":false,"./selectorAll":false,"./selection/style":false,"./touch":"l0pVh","./touches":false,"./window":false,"./selection/on":"21PiG","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"7rW4Q":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(name) {
        var fullname = (0, _namespaceDefault.default)(name);
        return (fullname.local ? creatorFixed : creatorInherit)(fullname);
    });
var _namespace = require("./namespace");
var _namespaceDefault = parcelHelpers.interopDefault(_namespace);
var _namespaces = require("./namespaces");
function creatorInherit(name) {
    return function() {
        var document = this.ownerDocument, uri = this.namespaceURI;
        return uri === (0, _namespaces.xhtml) && document.documentElement.namespaceURI === (0, _namespaces.xhtml) ? document.createElement(name) : document.createElementNS(uri, name);
    };
}
function creatorFixed(fullname) {
    return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
}

},{"./namespace":"8OpTc","./namespaces":"03RX1","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"8OpTc":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(name) {
        var prefix = name += "", i = prefix.indexOf(":");
        if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
        return (0, _namespacesDefault.default).hasOwnProperty(prefix) ? {
            space: (0, _namespacesDefault.default)[prefix],
            local: name
        } : name;
    });
var _namespaces = require("./namespaces");
var _namespacesDefault = parcelHelpers.interopDefault(_namespaces);

},{"./namespaces":"03RX1","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"03RX1":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "xhtml", ()=>xhtml);
var xhtml = "http://www.w3.org/1999/xhtml";
exports.default = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: xhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"dDo1S":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(selector) {
        return function() {
            return this.matches(selector);
        };
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"g5NrP":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(node) {
        var event = (0, _sourceEventDefault.default)();
        if (event.changedTouches) event = event.changedTouches[0];
        return (0, _pointDefault.default)(node, event);
    });
var _sourceEvent = require("./sourceEvent");
var _sourceEventDefault = parcelHelpers.interopDefault(_sourceEvent);
var _point = require("./point");
var _pointDefault = parcelHelpers.interopDefault(_point);

},{"./sourceEvent":"jLhFH","./point":"gkMYa","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"jLhFH":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        var current = (0, _on.event), source;
        while(source = current.sourceEvent)current = source;
        return current;
    });
var _on = require("./selection/on");

},{"./selection/on":"21PiG","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"21PiG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "event", ()=>event);
parcelHelpers.export(exports, "default", ()=>function(typename, value, capture) {
        var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;
        if (arguments.length < 2) {
            var on = this.node().__on;
            if (on) for(var j = 0, m = on.length, o; j < m; ++j)for(i = 0, o = on[j]; i < n; ++i){
                if ((t = typenames[i]).type === o.type && t.name === o.name) return o.value;
            }
            return;
        }
        on = value ? onAdd : onRemove;
        if (capture == null) capture = false;
        for(i = 0; i < n; ++i)this.each(on(typenames[i], value, capture));
        return this;
    });
parcelHelpers.export(exports, "customEvent", ()=>customEvent);
var filterEvents = {};
var event = null;
if (typeof document !== "undefined") {
    var element = document.documentElement;
    if (!("onmouseenter" in element)) filterEvents = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
}
function filterContextListener(listener, index, group) {
    listener = contextListener(listener, index, group);
    return function(event) {
        var related = event.relatedTarget;
        if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) listener.call(this, event);
    };
}
function contextListener(listener, index, group) {
    return function(event1) {
        var event0 = event; // Events can be reentrant (e.g., focus).
        event = event1;
        try {
            listener.call(this, this.__data__, index, group);
        } finally{
            event = event0;
        }
    };
}
function parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {
            type: t,
            name: name
        };
    });
}
function onRemove(typename) {
    return function() {
        var on = this.__on;
        if (!on) return;
        for(var j = 0, i = -1, m = on.length, o; j < m; ++j)if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) this.removeEventListener(o.type, o.listener, o.capture);
        else on[++i] = o;
        if (++i) on.length = i;
        else delete this.__on;
    };
}
function onAdd(typename, value, capture) {
    var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
    return function(d, i, group) {
        var on = this.__on, o, listener = wrap(value, i, group);
        if (on) {
            for(var j = 0, m = on.length; j < m; ++j)if ((o = on[j]).type === typename.type && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.capture);
                this.addEventListener(o.type, o.listener = listener, o.capture = capture);
                o.value = value;
                return;
            }
        }
        this.addEventListener(typename.type, listener, capture);
        o = {
            type: typename.type,
            name: typename.name,
            value: value,
            listener: listener,
            capture: capture
        };
        if (!on) this.__on = [
            o
        ];
        else on.push(o);
    };
}
function customEvent(event1, listener, that, args) {
    var event0 = event;
    event1.sourceEvent = event;
    event = event1;
    try {
        return listener.apply(that, args);
    } finally{
        event = event0;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"gkMYa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(node, event) {
        var svg = node.ownerSVGElement || node;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = event.clientX, point.y = event.clientY;
            point = point.matrixTransform(node.getScreenCTM().inverse());
            return [
                point.x,
                point.y
            ];
        }
        var rect = node.getBoundingClientRect();
        return [
            event.clientX - rect.left - node.clientLeft,
            event.clientY - rect.top - node.clientTop
        ];
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"Q2XYu":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(selector) {
        return typeof selector === "string" ? new (0, _index.Selection)([
            [
                document.querySelector(selector)
            ]
        ], [
            document.documentElement
        ]) : new (0, _index.Selection)([
            [
                selector
            ]
        ], (0, _index.root));
    });
var _index = require("./selection/index");

},{"./selection/index":"dzdeG","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"dzdeG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "root", ()=>root);
parcelHelpers.export(exports, "Selection", ()=>Selection);
var _select = require("./select");
var _selectDefault = parcelHelpers.interopDefault(_select);
var _selectAll = require("./selectAll");
var _selectAllDefault = parcelHelpers.interopDefault(_selectAll);
var _filter = require("./filter");
var _filterDefault = parcelHelpers.interopDefault(_filter);
var _data = require("./data");
var _dataDefault = parcelHelpers.interopDefault(_data);
var _enter = require("./enter");
var _enterDefault = parcelHelpers.interopDefault(_enter);
var _exit = require("./exit");
var _exitDefault = parcelHelpers.interopDefault(_exit);
var _join = require("./join");
var _joinDefault = parcelHelpers.interopDefault(_join);
var _merge = require("./merge");
var _mergeDefault = parcelHelpers.interopDefault(_merge);
var _order = require("./order");
var _orderDefault = parcelHelpers.interopDefault(_order);
var _sort = require("./sort");
var _sortDefault = parcelHelpers.interopDefault(_sort);
var _call = require("./call");
var _callDefault = parcelHelpers.interopDefault(_call);
var _nodes = require("./nodes");
var _nodesDefault = parcelHelpers.interopDefault(_nodes);
var _node = require("./node");
var _nodeDefault = parcelHelpers.interopDefault(_node);
var _size = require("./size");
var _sizeDefault = parcelHelpers.interopDefault(_size);
var _empty = require("./empty");
var _emptyDefault = parcelHelpers.interopDefault(_empty);
var _each = require("./each");
var _eachDefault = parcelHelpers.interopDefault(_each);
var _attr = require("./attr");
var _attrDefault = parcelHelpers.interopDefault(_attr);
var _style = require("./style");
var _styleDefault = parcelHelpers.interopDefault(_style);
var _property = require("./property");
var _propertyDefault = parcelHelpers.interopDefault(_property);
var _classed = require("./classed");
var _classedDefault = parcelHelpers.interopDefault(_classed);
var _text = require("./text");
var _textDefault = parcelHelpers.interopDefault(_text);
var _html = require("./html");
var _htmlDefault = parcelHelpers.interopDefault(_html);
var _raise = require("./raise");
var _raiseDefault = parcelHelpers.interopDefault(_raise);
var _lower = require("./lower");
var _lowerDefault = parcelHelpers.interopDefault(_lower);
var _append = require("./append");
var _appendDefault = parcelHelpers.interopDefault(_append);
var _insert = require("./insert");
var _insertDefault = parcelHelpers.interopDefault(_insert);
var _remove = require("./remove");
var _removeDefault = parcelHelpers.interopDefault(_remove);
var _clone = require("./clone");
var _cloneDefault = parcelHelpers.interopDefault(_clone);
var _datum = require("./datum");
var _datumDefault = parcelHelpers.interopDefault(_datum);
var _on = require("./on");
var _onDefault = parcelHelpers.interopDefault(_on);
var _dispatch = require("./dispatch");
var _dispatchDefault = parcelHelpers.interopDefault(_dispatch);
var root = [
    null
];
function Selection(groups, parents) {
    this._groups = groups;
    this._parents = parents;
}
function selection() {
    return new Selection([
        [
            document.documentElement
        ]
    ], root);
}
Selection.prototype = selection.prototype = {
    constructor: Selection,
    select: (0, _selectDefault.default),
    selectAll: (0, _selectAllDefault.default),
    filter: (0, _filterDefault.default),
    data: (0, _dataDefault.default),
    enter: (0, _enterDefault.default),
    exit: (0, _exitDefault.default),
    join: (0, _joinDefault.default),
    merge: (0, _mergeDefault.default),
    order: (0, _orderDefault.default),
    sort: (0, _sortDefault.default),
    call: (0, _callDefault.default),
    nodes: (0, _nodesDefault.default),
    node: (0, _nodeDefault.default),
    size: (0, _sizeDefault.default),
    empty: (0, _emptyDefault.default),
    each: (0, _eachDefault.default),
    attr: (0, _attrDefault.default),
    style: (0, _styleDefault.default),
    property: (0, _propertyDefault.default),
    classed: (0, _classedDefault.default),
    text: (0, _textDefault.default),
    html: (0, _htmlDefault.default),
    raise: (0, _raiseDefault.default),
    lower: (0, _lowerDefault.default),
    append: (0, _appendDefault.default),
    insert: (0, _insertDefault.default),
    remove: (0, _removeDefault.default),
    clone: (0, _cloneDefault.default),
    datum: (0, _datumDefault.default),
    on: (0, _onDefault.default),
    dispatch: (0, _dispatchDefault.default)
};
exports.default = selection;

},{"./select":"8mjbb","./selectAll":"eI1i6","./filter":"fsEV7","./data":"3G4pp","./enter":"h3BLx","./exit":"8kfOB","./join":"bZ2zk","./merge":"dZmd3","./order":"34L2f","./sort":"41qnN","./call":"gmmYW","./nodes":"232IW","./node":"2ytEJ","./size":"d0yc4","./empty":"582Qs","./each":"7oZF2","./attr":"7UuYG","./style":"jy5gJ","./property":"1WBqE","./classed":"3hyNv","./text":"g0MXD","./html":"sF6VO","./raise":"4DmcV","./lower":"1Jz6j","./append":"ktpdE","./insert":"42wUw","./remove":"lXh0p","./clone":"hTiqe","./datum":"fS6SR","./on":"21PiG","./dispatch":"8YHaz","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"8mjbb":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(select) {
        if (typeof select !== "function") select = (0, _selectorDefault.default)(select);
        for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i)if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
                if ("__data__" in node) subnode.__data__ = node.__data__;
                subgroup[i] = subnode;
            }
        }
        return new (0, _index.Selection)(subgroups, this._parents);
    });
var _index = require("./index");
var _selector = require("../selector");
var _selectorDefault = parcelHelpers.interopDefault(_selector);

},{"./index":"dzdeG","../selector":"eXEej","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"eXEej":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(selector) {
        return selector == null ? none : function() {
            return this.querySelector(selector);
        };
    });
function none() {}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"eI1i6":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(select) {
        if (typeof select !== "function") select = (0, _selectorAllDefault.default)(select);
        for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i)if (node = group[i]) {
                subgroups.push(select.call(node, node.__data__, i, group));
                parents.push(node);
            }
        }
        return new (0, _index.Selection)(subgroups, parents);
    });
var _index = require("./index");
var _selectorAll = require("../selectorAll");
var _selectorAllDefault = parcelHelpers.interopDefault(_selectorAll);

},{"./index":"dzdeG","../selectorAll":"d7DPK","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"d7DPK":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(selector) {
        return selector == null ? empty : function() {
            return this.querySelectorAll(selector);
        };
    });
function empty() {
    return [];
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"fsEV7":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(match) {
        if (typeof match !== "function") match = (0, _matcherDefault.default)(match);
        for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i)if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
        }
        return new (0, _index.Selection)(subgroups, this._parents);
    });
var _index = require("./index");
var _matcher = require("../matcher");
var _matcherDefault = parcelHelpers.interopDefault(_matcher);

},{"./index":"dzdeG","../matcher":"dDo1S","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"3G4pp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(value, key) {
        if (!value) {
            data = new Array(this.size()), j = -1;
            this.each(function(d) {
                data[++j] = d;
            });
            return data;
        }
        var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
        if (typeof value !== "function") value = (0, _constantDefault.default)(value);
        for(var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j){
            var parent = parents[j], group = groups[j], groupLength = group.length, data = value.call(parent, parent && parent.__data__, j, parents), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
            bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
            // Now connect the enter nodes to their following update node, such that
            // appendChild can insert the materialized enter node before this node,
            // rather than at the end of the parent node.
            for(var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0)if (previous = enterGroup[i0]) {
                if (i0 >= i1) i1 = i0 + 1;
                while(!(next = updateGroup[i1]) && ++i1 < dataLength);
                previous._next = next || null;
            }
        }
        update = new (0, _index.Selection)(update, parents);
        update._enter = enter;
        update._exit = exit;
        return update;
    });
var _index = require("./index");
var _enter = require("./enter");
var _constant = require("../constant");
var _constantDefault = parcelHelpers.interopDefault(_constant);
var keyPrefix = "$"; // Protect against keys like “__proto__”.
function bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;
    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for(; i < dataLength; ++i)if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
    } else enter[i] = new (0, _enter.EnterNode)(parent, data[i]);
    // Put any non-null nodes that don’t fit into exit.
    for(; i < groupLength; ++i)if (node = group[i]) exit[i] = node;
}
function bindKey(parent, group, enter, update, exit, data, key) {
    var i, node, nodeByKeyValue = {}, groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for(i = 0; i < groupLength; ++i)if (node = group[i]) {
        keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
        if (keyValue in nodeByKeyValue) exit[i] = node;
        else nodeByKeyValue[keyValue] = node;
    }
    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for(i = 0; i < dataLength; ++i){
        keyValue = keyPrefix + key.call(parent, data[i], i, data);
        if (node = nodeByKeyValue[keyValue]) {
            update[i] = node;
            node.__data__ = data[i];
            nodeByKeyValue[keyValue] = null;
        } else enter[i] = new (0, _enter.EnterNode)(parent, data[i]);
    }
    // Add any remaining nodes that were not bound to data to exit.
    for(i = 0; i < groupLength; ++i)if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) exit[i] = node;
}

},{"./index":"dzdeG","./enter":"h3BLx","../constant":"lGEds","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"h3BLx":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        return new (0, _index.Selection)(this._enter || this._groups.map((0, _sparseDefault.default)), this._parents);
    });
parcelHelpers.export(exports, "EnterNode", ()=>EnterNode);
var _sparse = require("./sparse");
var _sparseDefault = parcelHelpers.interopDefault(_sparse);
var _index = require("./index");
function EnterNode(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
}
EnterNode.prototype = {
    constructor: EnterNode,
    appendChild: function(child) {
        return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
        return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector) {
        return this._parent.querySelector(selector);
    },
    querySelectorAll: function(selector) {
        return this._parent.querySelectorAll(selector);
    }
};

},{"./sparse":"guJnj","./index":"dzdeG","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"guJnj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(update) {
        return new Array(update.length);
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"lGEds":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(x) {
        return function() {
            return x;
        };
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"8kfOB":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        return new (0, _index.Selection)(this._exit || this._groups.map((0, _sparseDefault.default)), this._parents);
    });
var _sparse = require("./sparse");
var _sparseDefault = parcelHelpers.interopDefault(_sparse);
var _index = require("./index");

},{"./sparse":"guJnj","./index":"dzdeG","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"bZ2zk":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(onenter, onupdate, onexit) {
        var enter = this.enter(), update = this, exit = this.exit();
        enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
        if (onupdate != null) update = onupdate(update);
        if (onexit == null) exit.remove();
        else onexit(exit);
        return enter && update ? enter.merge(update).order() : update;
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"dZmd3":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(selection) {
        for(var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
            for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i)if (node = group0[i] || group1[i]) merge[i] = node;
        }
        for(; j < m0; ++j)merges[j] = groups0[j];
        return new (0, _index.Selection)(merges, this._parents);
    });
var _index = require("./index");

},{"./index":"dzdeG","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"34L2f":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        for(var groups = this._groups, j = -1, m = groups.length; ++j < m;){
            for(var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;)if (node = group[i]) {
                if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
                next = node;
            }
        }
        return this;
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"41qnN":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(compare) {
        if (!compare) compare = ascending;
        function compareNode(a, b) {
            return a && b ? compare(a.__data__, b.__data__) : !a - !b;
        }
        for(var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j){
            for(var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i)if (node = group[i]) sortgroup[i] = node;
            sortgroup.sort(compareNode);
        }
        return new (0, _index.Selection)(sortgroups, this._parents).order();
    });
var _index = require("./index");
function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

},{"./index":"dzdeG","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"gmmYW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        var callback = arguments[0];
        arguments[0] = this;
        callback.apply(null, arguments);
        return this;
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"232IW":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        var nodes = new Array(this.size()), i = -1;
        this.each(function() {
            nodes[++i] = this;
        });
        return nodes;
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"2ytEJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j)for(var group = groups[j], i = 0, n = group.length; i < n; ++i){
            var node = group[i];
            if (node) return node;
        }
        return null;
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"d0yc4":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        var size = 0;
        this.each(function() {
            ++size;
        });
        return size;
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"582Qs":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        return !this.node();
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"7oZF2":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(callback) {
        for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
            for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i)if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
        return this;
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"7UuYG":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(name, value) {
        var fullname = (0, _namespaceDefault.default)(name);
        if (arguments.length < 2) {
            var node = this.node();
            return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
        }
        return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
    });
var _namespace = require("../namespace");
var _namespaceDefault = parcelHelpers.interopDefault(_namespace);
function attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function attrConstant(name, value) {
    return function() {
        this.setAttribute(name, value);
    };
}
function attrConstantNS(fullname, value) {
    return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
    };
}
function attrFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
    };
}
function attrFunctionNS(fullname, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
    };
}

},{"../namespace":"8OpTc","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"jy5gJ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(name, value, priority) {
        return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
    });
parcelHelpers.export(exports, "styleValue", ()=>styleValue);
var _window = require("../window");
var _windowDefault = parcelHelpers.interopDefault(_window);
function styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function styleConstant(name, value, priority) {
    return function() {
        this.style.setProperty(name, value, priority);
    };
}
function styleFunction(name, value, priority) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
    };
}
function styleValue(node, name) {
    return node.style.getPropertyValue(name) || (0, _windowDefault.default)(node).getComputedStyle(node, null).getPropertyValue(name);
}

},{"../window":"gFDDS","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"gFDDS":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(node) {
        return node.ownerDocument && node.ownerDocument.defaultView // node is a Node
         || node.document && node // node is a Window
         || node.defaultView; // node is a Document
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"1WBqE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(name, value) {
        return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
    });
function propertyRemove(name) {
    return function() {
        delete this[name];
    };
}
function propertyConstant(name, value) {
    return function() {
        this[name] = value;
    };
}
function propertyFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"3hyNv":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(name, value) {
        var names = classArray(name + "");
        if (arguments.length < 2) {
            var list = classList(this.node()), i = -1, n = names.length;
            while(++i < n)if (!list.contains(names[i])) return false;
            return true;
        }
        return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
    });
function classArray(string) {
    return string.trim().split(/^|\s+/);
}
function classList(node) {
    return node.classList || new ClassList(node);
}
function ClassList(node) {
    this._node = node;
    this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
    add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
            this._names.push(name);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
            this._names.splice(i, 1);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    contains: function(name) {
        return this._names.indexOf(name) >= 0;
    }
};
function classedAdd(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.add(names[i]);
}
function classedRemove(node, names) {
    var list = classList(node), i = -1, n = names.length;
    while(++i < n)list.remove(names[i]);
}
function classedTrue(names) {
    return function() {
        classedAdd(this, names);
    };
}
function classedFalse(names) {
    return function() {
        classedRemove(this, names);
    };
}
function classedFunction(names, value) {
    return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"g0MXD":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(value) {
        return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
    });
function textRemove() {
    this.textContent = "";
}
function textConstant(value) {
    return function() {
        this.textContent = value;
    };
}
function textFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"sF6VO":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(value) {
        return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
    });
function htmlRemove() {
    this.innerHTML = "";
}
function htmlConstant(value) {
    return function() {
        this.innerHTML = value;
    };
}
function htmlFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
    };
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"4DmcV":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        return this.each(raise);
    });
function raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"1Jz6j":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        return this.each(lower);
    });
function lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"ktpdE":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(name) {
        var create = typeof name === "function" ? name : (0, _creatorDefault.default)(name);
        return this.select(function() {
            return this.appendChild(create.apply(this, arguments));
        });
    });
var _creator = require("../creator");
var _creatorDefault = parcelHelpers.interopDefault(_creator);

},{"../creator":"7rW4Q","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"42wUw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(name, before) {
        var create = typeof name === "function" ? name : (0, _creatorDefault.default)(name), select = before == null ? constantNull : typeof before === "function" ? before : (0, _selectorDefault.default)(before);
        return this.select(function() {
            return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
        });
    });
var _creator = require("../creator");
var _creatorDefault = parcelHelpers.interopDefault(_creator);
var _selector = require("../selector");
var _selectorDefault = parcelHelpers.interopDefault(_selector);
function constantNull() {
    return null;
}

},{"../creator":"7rW4Q","../selector":"eXEej","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"lXh0p":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function() {
        return this.each(remove);
    });
function remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"hTiqe":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(deep) {
        return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
    });
function selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"fS6SR":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(value) {
        return arguments.length ? this.property("__data__", value) : this.node().__data__;
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"8YHaz":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(type, params) {
        return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
    });
var _window = require("../window");
var _windowDefault = parcelHelpers.interopDefault(_window);
function dispatchEvent(node, type, params) {
    var window = (0, _windowDefault.default)(node), event = window.CustomEvent;
    if (typeof event === "function") event = new event(type, params);
    else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
    }
    node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
    return function() {
        return dispatchEvent(this, type, params);
    };
}
function dispatchFunction(type, params) {
    return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
    };
}

},{"../window":"gFDDS","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"l0pVh":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(node, touches, identifier) {
        if (arguments.length < 3) identifier = touches, touches = (0, _sourceEventDefault.default)().changedTouches;
        for(var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i){
            if ((touch = touches[i]).identifier === identifier) return (0, _pointDefault.default)(node, touch);
        }
        return null;
    });
var _sourceEvent = require("./sourceEvent");
var _sourceEventDefault = parcelHelpers.interopDefault(_sourceEvent);
var _point = require("./point");
var _pointDefault = parcelHelpers.interopDefault(_point);

},{"./sourceEvent":"jLhFH","./point":"gkMYa","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"iyYwd":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(view) {
        var root = view.document.documentElement, selection = (0, _d3Selection.select)(view).on("dragstart.drag", (0, _noeventJsDefault.default), true);
        if ("onselectstart" in root) selection.on("selectstart.drag", (0, _noeventJsDefault.default), true);
        else {
            root.__noselect = root.style.MozUserSelect;
            root.style.MozUserSelect = "none";
        }
    });
parcelHelpers.export(exports, "yesdrag", ()=>yesdrag);
var _d3Selection = require("d3-selection");
var _noeventJs = require("./noevent.js");
var _noeventJsDefault = parcelHelpers.interopDefault(_noeventJs);
function yesdrag(view, noclick) {
    var root = view.document.documentElement, selection = (0, _d3Selection.select)(view).on("dragstart.drag", null);
    if (noclick) {
        selection.on("click.drag", (0, _noeventJsDefault.default), true);
        setTimeout(function() {
            selection.on("click.drag", null);
        }, 0);
    }
    if ("onselectstart" in root) selection.on("selectstart.drag", null);
    else {
        root.style.MozUserSelect = root.__noselect;
        delete root.__noselect;
    }
}

},{"d3-selection":"96u45","./noevent.js":"hb21F","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"hb21F":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "nopropagation", ()=>nopropagation);
parcelHelpers.export(exports, "default", ()=>function() {
        (0, _d3Selection.event).preventDefault();
        (0, _d3Selection.event).stopImmediatePropagation();
    });
var _d3Selection = require("d3-selection");
function nopropagation() {
    (0, _d3Selection.event).stopImmediatePropagation();
}

},{"d3-selection":"96u45","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"1v7Zp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>function(x) {
        return function() {
            return x;
        };
    });

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"1phwa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>DragEvent);
function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
    this.target = target;
    this.type = type;
    this.subject = subject;
    this.identifier = id;
    this.active = active;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this._ = dispatch;
}
DragEvent.prototype.on = function() {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
};

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"fsMdw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "sortX", ()=>sortX);
parcelHelpers.export(exports, "lightgrey", ()=>lightgrey);
parcelHelpers.export(exports, "medgrey", ()=>medgrey);
parcelHelpers.export(exports, "grey", ()=>grey);
parcelHelpers.export(exports, "cubicInOutTension", ()=>cubicInOutTension);
parcelHelpers.export(exports, "roundX", ()=>roundX);
parcelHelpers.export(exports, "roundY", ()=>roundY);
parcelHelpers.export(exports, "inputId", ()=>inputId);
parcelHelpers.export(exports, "setInputId", ()=>setInputId);
parcelHelpers.export(exports, "getInputUpdater", ()=>getInputUpdater);
var _util = require("../../util/util");
const sortX = (a, b)=>{
    if (a.x < b.x) return -1;
    if (a.x > b.x) return 1;
    return 0;
};
const lightgrey = (opacity)=>`rgba(120, 120, 120, ${opacity})`;
const medgrey = (opacity)=>`rgba(90, 90, 90, ${opacity})`;
const grey = (opacity)=>`rgba(50, 50, 50, ${opacity})`;
const cubicInOutTension = 0.6;
const roundX = (0, _util.getRounder)(0.01, 2);
const roundY = (0, _util.getRounder)(0.05, 2);
let inputId = null;
function setInputId(Id) {
    inputId = Id;
}
function getInputUpdater(inputId) {
    return function(newValue) {
        const input = document.getElementById(inputId);
        if (input) {
            if (newValue != null) input.value = newValue.toString();
        } else console.log(`Input with Id ${inputId} not found.`);
    };
}

},{"../../util/util":"jxJ0L","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"ir1Wi":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "currentCropPointIndex", ()=>currentCropPointIndex);
parcelHelpers.export(exports, "cropChartMode", ()=>cropChartMode);
parcelHelpers.export(exports, "currentCropChartMode", ()=>currentCropChartMode);
parcelHelpers.export(exports, "setCropChartMode", ()=>setCropChartMode);
parcelHelpers.export(exports, "setCurrentCropPoint", ()=>setCurrentCropPoint);
parcelHelpers.export(exports, "currentCropChartSection", ()=>currentCropChartSection);
parcelHelpers.export(exports, "setCurrentCropChartSection", ()=>setCurrentCropChartSection);
parcelHelpers.export(exports, "updateCurrentCropPoint", ()=>updateCurrentCropPoint);
parcelHelpers.export(exports, "cropPointFormatter", ()=>cropPointFormatter);
parcelHelpers.export(exports, "cropPointXYFormatter", ()=>cropPointXYFormatter);
parcelHelpers.export(exports, "getCropChartConfig", ()=>getCropChartConfig);
var _chartJs = require("chart.js");
var _chartJsDefault = parcelHelpers.interopDefault(_chartJs);
var _util = require("../../../util/util");
var _chartutil = require("../chartutil");
var _scatterChartSpec = require("../scatterChartSpec");
var _lodashIsequal = require("lodash.isequal");
var _lodashIsequalDefault = parcelHelpers.interopDefault(_lodashIsequal);
const inputId = "crop-input";
let currentCropPointIndex = 0;
var cropChartMode;
(function(cropChartMode) {
    cropChartMode[cropChartMode["Start"] = 0] = "Start";
    cropChartMode[cropChartMode["End"] = 1] = "End";
})(cropChartMode || (cropChartMode = {}));
let currentCropChartMode = 0;
function setCropChartMode(mode) {
    currentCropChartMode = mode;
}
function setCurrentCropPoint(cropChart, cropPointIndex, mode) {
    const maxIndex = cropChart ? cropChart.data.datasets[0].data.length - 1 : 1;
    const newCropPointIndex = (0, _util.clampNumber)(cropPointIndex, 0, maxIndex);
    const cropPointIndexChanged = currentCropPointIndex !== newCropPointIndex;
    currentCropPointIndex = newCropPointIndex;
    const oldCropChartSection = currentCropChartSection;
    if (currentCropPointIndex <= 0) {
        setCropChartMode(0);
        setCurrentCropChartSection(cropChart, [
            0,
            1
        ]);
    } else if (currentCropPointIndex >= maxIndex) {
        setCropChartMode(1);
        setCurrentCropChartSection(cropChart, [
            maxIndex - 1,
            maxIndex
        ]);
    } else {
        if (mode != null) currentCropChartMode = mode;
        currentCropChartMode === 0 ? setCurrentCropChartSection(cropChart, [
            currentCropPointIndex,
            currentCropPointIndex + 1
        ]) : setCurrentCropChartSection(cropChart, [
            currentCropPointIndex - 1,
            currentCropPointIndex
        ]);
    }
    const cropChartSectionChanged = !(0, _lodashIsequalDefault.default)(currentCropChartSection, oldCropChartSection);
    if ((cropPointIndexChanged || cropChartSectionChanged) && cropChart) cropChart.renderSpeedAndCropUI(true, false);
}
let currentCropChartSection = [
    0,
    1
];
function setCurrentCropChartSection(cropChart, [left, right]) {
    const maxIndex = cropChart ? cropChart.data.datasets[0].data.length - 1 : 1;
    if (left <= 0) currentCropChartSection = [
        0,
        1
    ];
    else if (left >= maxIndex) currentCropChartSection = [
        maxIndex - 1,
        maxIndex
    ];
    else if (left === right) currentCropChartSection = [
        left,
        left + 1
    ];
    else currentCropChartSection = [
        left,
        right
    ];
}
const updateCurrentCropPoint = function(cropChart, cropString) {
    const cropChartData = cropChart.data.datasets[0].data;
    const cropPoint = cropChartData[currentCropPointIndex];
    cropPoint.crop = cropString;
    cropChart.update();
};
const cropPointFormatter = (point)=>{
    return `T:${point.x.toFixed(2)}\nC:${point.crop}`;
};
const cropPointXYFormatter = (point, ctx)=>{
    const [x, y, w, h] = point.crop.split(":");
    const index = ctx.dataIndex;
    const label = index === 0 ? `T:${point.x.toFixed(2)}\nC:${x}:${y}:${w}:${h}` : `T:${point.x.toFixed(2)}\nC:${x}:${y}`;
    return label;
};
function getCropPointStyle(ctx) {
    const index = ctx.dataIndex;
    return index === currentCropPointIndex ? "rectRounded" : "circle";
}
function getCropPointColor(ctx) {
    const index = ctx.dataIndex;
    if (index === currentCropChartSection[0]) return "green";
    else if (index === currentCropChartSection[1]) return "yellow";
    else return "red";
}
function getCropPointBackgroundOverlayColor(ctx) {
    const cropPoint = ctx.dataset.data[ctx.dataIndex];
    return cropPoint.easeIn === "instant" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)";
}
function getCropPointBorderColor(ctx) {
    const index = ctx.dataIndex;
    return index === currentCropPointIndex ? "black" : (0, _chartutil.medgrey)(0.9);
}
function getCropPointBorderWidth(ctx) {
    const index = ctx.dataIndex;
    return index === currentCropPointIndex ? 2 : 1;
}
function getCropPointRadius(ctx) {
    const index = ctx.dataIndex;
    return index === currentCropPointIndex ? 6 : 4;
}
const cropChartConfig = {
    data: {
        datasets: [
            {
                label: "Crop",
                lineTension: 0,
                data: [],
                showLine: true,
                pointBackgroundColor: getCropPointColor,
                pointBorderColor: getCropPointBorderColor,
                pointBorderWidth: getCropPointBorderWidth,
                pointStyle: getCropPointStyle,
                pointRadius: getCropPointRadius,
                backgroundOverlayColor: getCropPointBackgroundOverlayColor,
                backgroundOverlayMode: "multiply",
                pointHitRadius: 3
            }
        ]
    },
    options: {
        scales: {
            yAxes: [
                {
                    display: false
                }
            ]
        },
        plugins: {
            datalabels: {
                formatter: cropPointFormatter,
                font: {
                    size: 10,
                    weight: "normal"
                }
            }
        },
        dragY: false,
        dragX: true
    }
};
function getCropChartConfig(isCropChartPanOnly) {
    let cropChartConfigOverrides = {};
    if (isCropChartPanOnly) cropChartConfigOverrides = {
        options: {
            plugins: {
                datalabels: {
                    formatter: cropPointXYFormatter
                }
            }
        }
    };
    else cropChartConfigOverrides = {
        options: {
            plugins: {
                datalabels: {
                    formatter: cropPointFormatter
                }
            }
        }
    };
    const cropChartConfigOverridden = (0, _chartJsDefault.default).helpers.merge(cropChartConfig, cropChartConfigOverrides);
    return (0, _chartJsDefault.default).helpers.merge((0, _scatterChartSpec.scatterChartSpec)("crop", inputId), cropChartConfigOverridden);
}

},{"chart.js":"fyX24","../../../util/util":"jxJ0L","../chartutil":"fsMdw","../scatterChartSpec":"f6y72","lodash.isequal":"51TpO","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"f6y72":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "scatterChartDefaults", ()=>scatterChartDefaults);
parcelHelpers.export(exports, "getScatterPointColor", ()=>getScatterPointColor);
parcelHelpers.export(exports, "addSpeedPoint", ()=>addSpeedPoint);
parcelHelpers.export(exports, "addCropPoint", ()=>addCropPoint);
parcelHelpers.export(exports, "scatterChartSpec", ()=>scatterChartSpec);
var _immer = require("immer");
var _undoredo = require("../../util/undoredo");
var _util = require("../../util/util");
var _ytClipper = require("../../yt_clipper");
var _chartutil = require("./chartutil");
var _cropChartSpec = require("./cropchart/cropChartSpec");
const scatterChartDefaults = {
    defaultColor: "rgba(255, 255, 255, 1)",
    defaultFontSize: 16,
    defaultFontStyle: "bold",
    defaultFontColor: (0, _chartutil.lightgrey)(1),
    maintainAspectRatio: false,
    hover: {
        mode: "nearest"
    },
    animation: {
        duration: 0
    }
};
function getScatterPointColor(context) {
    var index = context.dataIndex;
    var value = context.dataset.data[index];
    return value.y <= 1 ? `rgba(255, ${100 * value.y}, 100, 0.9)` : `rgba(${130 - 90 * (value.y - 1)}, 100, 245, 0.9)`;
}
function getScatterChartBounds(chartInstance) {
    const scatterChartBounds = {
        XMinBound: chartInstance.options.scales.xAxes[0].ticks.min,
        XMaxBound: chartInstance.options.scales.xAxes[0].ticks.max,
        YMinBound: 0.05,
        YMaxBound: 2
    };
    return scatterChartBounds;
}
function displayDataLabel(context) {
    return context.active ? true : "auto";
}
function alignDataLabel(context) {
    const index = context.dataIndex;
    // const value = context.dataset.data[index];
    if (index === 0) return "right";
    else if (index === context.dataset.data.length - 1) return "left";
    else if (context.dataset.data[context.dataIndex].y > 1.85) return "start";
    else return "end";
}
const addSpeedPoint = function(time, speed) {
    // console.log(element, dataAtClick);
    if (time && speed) {
        const scatterChartBounds = getScatterChartBounds(this);
        if (time <= scatterChartBounds.XMinBound || time >= scatterChartBounds.XMaxBound || speed < scatterChartBounds.YMinBound || speed > scatterChartBounds.YMaxBound) return;
        time = (0, _chartutil.roundX)(time);
        speed = (0, _chartutil.roundY)(speed);
        const markerPair = (0, _ytClipper.markerPairs)[0, _ytClipper.prevSelectedMarkerPairIndex];
        const initialState = (0, _undoredo.getMarkerPairHistory)(markerPair);
        const draft = (0, _immer.createDraft)(initialState);
        draft.speedMap.push({
            x: time,
            y: speed
        });
        draft.speedMap.sort((0, _chartutil.sortX));
        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
        this.renderSpeedAndCropUI(true);
    }
};
const addCropPoint = function(time) {
    // console.log(element, dataAtClick);
    if (time) {
        const scatterChartBounds = getScatterChartBounds(this);
        if (time <= scatterChartBounds.XMinBound || time >= scatterChartBounds.XMaxBound) return;
        time = (0, _chartutil.roundX)(time);
        const markerPair = (0, _ytClipper.markerPairs)[0, _ytClipper.prevSelectedMarkerPairIndex];
        const initialState = (0, _undoredo.getMarkerPairHistory)(markerPair);
        const draft = (0, _immer.createDraft)(initialState);
        draft.cropMap.push({
            x: time,
            y: 0,
            crop: "0:0:iw:ih"
        });
        draft.cropMap.sort((0, _chartutil.sortX));
        const cropPointIndex = draft.cropMap.map((cropPoint)=>cropPoint.x).indexOf(time);
        // console.log(currentCropPointIndex, cropPointIndex);
        if ((0, _cropChartSpec.currentCropPointIndex) >= cropPointIndex) (0, _cropChartSpec.setCurrentCropPoint)(this, (0, _cropChartSpec.currentCropPointIndex) + 1);
        if (cropPointIndex > 0) {
            const prevCropPointIndex = cropPointIndex - 1;
            draft.cropMap[cropPointIndex].crop = draft.cropMap[prevCropPointIndex].crop;
        }
        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
        this.renderSpeedAndCropUI(true);
    }
};
function scatterChartSpec(chartType, inputId) {
    const updateInput = (0, _chartutil.getInputUpdater)(inputId);
    const onDragStart = function(e, chartInstance, element, value) {
        // console.log(arguments);
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
            chartInstance.options.plugins.zoom.pan.enabled = false;
            e.target.style.cursor = "grabbing";
            if (chartType === "crop") (0, _util.seekToSafe)((0, _ytClipper.video), (0, _util.timeRounder)(value.x));
            chartInstance.update();
        }
    };
    const onDrag = function(e, chartInstance, datasetIndex, index, fromValue, toValue) {
        // console.log(datasetIndex, index, fromValue, toValue);
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
            const shouldDrag = {
                dragX: true,
                dragY: true,
                chartType
            };
            const scatterChartBounds = getScatterChartBounds(chartInstance);
            if (fromValue.x <= scatterChartBounds.XMinBound || fromValue.x >= scatterChartBounds.XMaxBound || toValue.x <= scatterChartBounds.XMinBound || toValue.x >= scatterChartBounds.XMaxBound) shouldDrag.dragX = false;
            if (chartType === "crop" || toValue.y < scatterChartBounds.YMinBound || toValue.y > scatterChartBounds.YMaxBound) shouldDrag.dragY = false;
            if (chartType === "crop" && shouldDrag.dragX && fromValue.x != toValue.x) (0, _util.seekToSafe)((0, _ytClipper.video), (0, _util.timeRounder)(toValue.x));
            return shouldDrag;
        } else return {
            dragX: false,
            dragY: false,
            chartType
        };
    };
    const onDragEnd = function(e, chartInstance, datasetIndex, index, value) {
        // console.log(datasetIndex, index, value);
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
            const markerPair = (0, _ytClipper.markerPairs)[0, _ytClipper.prevSelectedMarkerPairIndex];
            const draft = (0, _immer.createDraft)((0, _undoredo.getMarkerPairHistory)(markerPair));
            const draftMap = chartType === "crop" ? draft.cropMap : draft.speedMap;
            let currentCropPointXPreSort = chartType === "crop" ? draftMap[0, _cropChartSpec.currentCropPointIndex].x : null;
            draftMap.sort((0, _chartutil.sortX));
            if (index === 0 && chartType === "speed") draft.speed = value.y;
            if (chartType === "crop") {
                const newCurrentCropPointIndex = draftMap.map((cropPoint)=>cropPoint.x).indexOf(currentCropPointXPreSort);
                (0, _cropChartSpec.setCurrentCropPoint)(chartInstance, newCurrentCropPointIndex);
            }
            chartInstance.options.plugins.zoom.pan.enabled = true;
            e.target.style.cursor = "default";
            (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
            chartInstance.renderSpeedAndCropUI(true);
        }
    };
    const onClick = function(event, dataAtClick) {
        event.stopImmediatePropagation();
        // add chart points on shift+left-click
        if (event.button === 0 && !event.ctrlKey && !event.altKey && event.shiftKey && dataAtClick.length === 0) {
            const time = this.scales["x-axis-1"].getValueForPixel(event.offsetX);
            if (chartType === "speed") {
                const speed = this.scales["y-axis-1"].getValueForPixel(event.offsetY);
                addSpeedPoint.call(this, time, speed);
            } else if (chartType === "crop") addCropPoint.call(this, time);
        }
        // delete chart points on alt+shift+left-click
        if (event.button === 0 && !event.ctrlKey && event.altKey && event.shiftKey && dataAtClick.length === 1) {
            const datum = dataAtClick[0];
            if (datum) {
                const datasetIndex = datum["_datasetIndex"];
                const index = datum["_index"];
                let scatterChartMinBound = this.options.scales.xAxes[0].ticks.min;
                let scatterChartMaxBound = this.options.scales.xAxes[0].ticks.max;
                const markerPair = (0, _ytClipper.markerPairs)[0, _ytClipper.prevSelectedMarkerPairIndex];
                const initialState = (0, _undoredo.getMarkerPairHistory)(markerPair);
                const draft = (0, _immer.createDraft)(initialState);
                let dataRef;
                if (chartType === "crop") dataRef = draft.cropMap;
                else dataRef = draft.speedMap;
                if (dataRef[index].x !== scatterChartMinBound && dataRef[index].x !== scatterChartMaxBound) {
                    dataRef.splice(index, 1);
                    if (chartType === "crop") {
                        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
                        this.data.datasets[0].data = markerPair.cropMap;
                        if ((0, _cropChartSpec.currentCropPointIndex) >= index) (0, _cropChartSpec.setCurrentCropPoint)(this, (0, _cropChartSpec.currentCropPointIndex) - 1);
                        updateInput(markerPair.cropMap[0, _cropChartSpec.currentCropPointIndex].crop);
                    } else {
                        (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
                        this.data.datasets[0].data = markerPair.speedMap;
                        updateInput();
                    }
                    this.renderSpeedAndCropUI(true);
                }
            }
        }
        // change crop point ease in function
        if (event.button === 0 && event.ctrlKey && !event.altKey && event.shiftKey && dataAtClick.length === 1) {
            if (chartType === "crop") {
                const datum = dataAtClick[0];
                if (datum) {
                    const datasetIndex = datum["_datasetIndex"];
                    const index = datum["_index"];
                    const markerPair = (0, _ytClipper.markerPairs)[0, _ytClipper.prevSelectedMarkerPairIndex];
                    const initialState = (0, _undoredo.getMarkerPairHistory)(markerPair);
                    const draft = (0, _immer.createDraft)(initialState);
                    if (draft.cropMap[index].easeIn == null) draft.cropMap[index].easeIn = "instant";
                    else delete draft.cropMap[index].easeIn;
                    (0, _undoredo.saveMarkerPairHistory)(draft, markerPair);
                    this.renderSpeedAndCropUI(true);
                }
            }
        }
        if (event.ctrlKey && !event.altKey && !event.shiftKey) this.resetZoom();
    };
    function onHover(e, chartElements) {
        e.target.style.cursor = chartElements[0] ? "grab" : "default";
        if (chartType === "crop" && !e.shiftKey && chartElements.length === 1) {
            let mode;
            if (e.ctrlKey && !e.altKey) mode = (0, _cropChartSpec.cropChartMode).Start;
            else if (!e.ctrlKey && e.altKey) mode = (0, _cropChartSpec.cropChartMode).End;
            else return;
            const datum = chartElements[0];
            if (datum) {
                const index = datum["_index"];
                (0, _cropChartSpec.setCurrentCropPoint)(this, index, mode);
                (0, _ytClipper.triggerCropChartLoop)();
            }
        }
    }
    return {
        type: "scatter",
        options: {
            elements: {
                line: {
                    fill: true,
                    backgroundColor: "rgba(160,0, 255, 0.05)",
                    borderColor: (0, _chartutil.lightgrey)(0.8),
                    borderWidth: 2,
                    borderDash: [
                        5,
                        2
                    ]
                }
            },
            legend: {
                display: false
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 15,
                    bottom: 0
                }
            },
            tooltips: {
                enabled: false
            },
            scales: {
                xAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: "Time (s)",
                            fontSize: 12,
                            padding: -4
                        },
                        position: "bottom",
                        gridLines: {
                            color: (0, _chartutil.medgrey)(0.6),
                            lineWidth: 1
                        },
                        ticks: {
                            min: 0,
                            max: 10,
                            maxTicksLimit: 100,
                            autoSkip: false,
                            maxRotation: 60,
                            minRotation: 0,
                            major: {},
                            minor: {}
                        }
                    }
                ]
            },
            plugins: {
                datalabels: {
                    clip: false,
                    clamp: true,
                    font: {
                        size: 14,
                        weight: "bold"
                    },
                    textStrokeWidth: 2,
                    textStrokeColor: (0, _chartutil.grey)(0.9),
                    textAlign: "center",
                    display: displayDataLabel,
                    align: alignDataLabel,
                    color: getScatterPointColor
                },
                zoom: {
                    pan: {
                        enabled: true,
                        mode: "x",
                        rangeMin: {
                            x: 0,
                            y: 0
                        },
                        rangeMax: {
                            x: 10,
                            y: 2
                        }
                    },
                    zoom: {
                        enabled: true,
                        mode: "x",
                        drag: false,
                        speed: 0.1,
                        rangeMin: {
                            x: 0,
                            y: 0
                        },
                        rangeMax: {
                            x: 10,
                            y: 2
                        }
                    }
                }
            },
            annotation: {
                drawTime: "afterDraw",
                annotations: [
                    {
                        label: "time",
                        type: "line",
                        mode: "vertical",
                        scaleID: "x-axis-1",
                        value: -1,
                        borderColor: "rgba(255, 0, 0, 0.9)",
                        borderWidth: 1
                    },
                    {
                        label: "start",
                        type: "line",
                        display: true,
                        mode: "vertical",
                        scaleID: "x-axis-1",
                        value: -1,
                        borderColor: "rgba(0, 255, 0, 0.9)",
                        borderWidth: 1
                    },
                    {
                        label: "end",
                        type: "line",
                        display: true,
                        mode: "vertical",
                        scaleID: "x-axis-1",
                        value: -1,
                        borderColor: "rgba(255, 215, 0, 0.9)",
                        borderWidth: 1
                    }
                ]
            },
            onHover: onHover,
            dragData: true,
            dragY: true,
            dragX: true,
            dragDataRound: 0.5,
            dragDataRoundMultipleX: 0.01,
            dragDataRoundPrecisionX: 2,
            dragDataRoundMultipleY: 0.05,
            dragDataRoundPrecisionY: 2,
            dragDataSort: false,
            dragDataSortFunction: (0, _chartutil.sortX),
            onDragStart: onDragStart,
            onDrag: onDrag,
            onDragEnd: onDragEnd,
            onClick: onClick
        }
    };
}

},{"immer":"2hRSJ","../../util/undoredo":"hHDBZ","../../util/util":"jxJ0L","../../yt_clipper":"49CxU","./chartutil":"fsMdw","./cropchart/cropChartSpec":"ir1Wi","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"hHDBZ":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "pushState", ()=>pushState);
parcelHelpers.export(exports, "undo", ()=>undo);
parcelHelpers.export(exports, "redo", ()=>redo);
parcelHelpers.export(exports, "peekLastState", ()=>peekLastState);
parcelHelpers.export(exports, "getMarkerPairHistory", ()=>getMarkerPairHistory);
parcelHelpers.export(exports, "saveMarkerPairHistory", ()=>saveMarkerPairHistory);
var _immer = require("immer");
const historySize = 100;
function pushState(undoredo, state) {
    undoredo.history.splice(undoredo.index + 1);
    undoredo.history.push(state);
    if (undoredo.history.length > historySize) undoredo.history.shift();
    else undoredo.index++;
}
var RestoreDirection;
(function(RestoreDirection) {
    RestoreDirection[RestoreDirection["undo"] = 0] = "undo";
    RestoreDirection[RestoreDirection["redo"] = 1] = "redo";
})(RestoreDirection || (RestoreDirection = {}));
function undo(undoredo, restore) {
    if (undoredo.index <= 0) return null;
    else {
        undoredo.index--;
        const state = undoredo.history[undoredo.index];
        restore(state, 0);
        return state;
    }
}
function redo(undoredo, restore) {
    if (undoredo.index >= undoredo.history.length - 1) return null;
    else {
        undoredo.index++;
        const state = undoredo.history[undoredo.index];
        restore(state, 1);
        return state;
    }
}
function peekLastState(undoredo) {
    const state = undoredo.history[undoredo.index];
    return state;
}
function getMarkerPairHistory(markerPair) {
    const { start, end, speed, speedMap, crop, cropMap, enableZoomPan, cropRes } = markerPair;
    const history = {
        start,
        end,
        speed,
        speedMap,
        crop,
        cropMap,
        enableZoomPan,
        cropRes
    };
    return history;
}
function saveMarkerPairHistory(draft, markerPair, storeHistory = true) {
    const newState = (0, _immer.finishDraft)(draft);
    Object.assign(markerPair, newState);
    if (storeHistory) pushState(markerPair.undoredo, newState);
}

},{"immer":"2hRSJ","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"51TpO":[function(require,module,exports) {
/**
 * Lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright JS Foundation and other contributors <https://js.foundation/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */ /** Used as the size to enable large array optimizations. */ var global = arguments[3];
var LARGE_ARRAY_SIZE = 200;
/** Used to stand-in for `undefined` hash values. */ var HASH_UNDEFINED = "__lodash_hash_undefined__";
/** Used to compose bitmasks for value comparisons. */ var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
/** Used as references for various `Number` constants. */ var MAX_SAFE_INTEGER = 9007199254740991;
/** `Object#toString` result references. */ var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag = "[object Symbol]", undefinedTag = "[object Undefined]", weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */ var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */ var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used to detect unsigned integer values. */ var reIsUint = /^(?:0|[1-9]\d*)$/;
/** Used to identify `toStringTag` values of typed arrays. */ var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
/** Detect free variable `global` from Node.js. */ var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
/** Detect free variable `self`. */ var freeSelf = typeof self == "object" && self && self.Object === Object && self;
/** Used as a reference to the global object. */ var root = freeGlobal || freeSelf || Function("return this")();
/** Detect free variable `exports`. */ var freeExports = exports && !exports.nodeType && exports;
/** Detect free variable `module`. */ var freeModule = freeExports && true && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */ var moduleExports = freeModule && freeModule.exports === freeExports;
/** Detect free variable `process` from Node.js. */ var freeProcess = moduleExports && freeGlobal.process;
/** Used to access faster Node.js helpers. */ var nodeUtil = function() {
    try {
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {}
}();
/* Node.js helper references. */ var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */ function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while(++index < length){
        var value = array[index];
        if (predicate(value, index, array)) result[resIndex++] = value;
    }
    return result;
}
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */ function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while(++index < length)array[offset + index] = values[index];
    return array;
}
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */ function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while(++index < length){
        if (predicate(array[index], index, array)) return true;
    }
    return false;
}
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */ function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while(++index < n)result[index] = iteratee(index);
    return result;
}
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */ function baseUnary(func) {
    return function(value) {
        return func(value);
    };
}
/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function cacheHas(cache, key) {
    return cache.has(key);
}
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */ function getValue(object, key) {
    return object == null ? undefined : object[key];
}
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */ function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
        result[++index] = [
            key,
            value
        ];
    });
    return result;
}
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */ function overArg(func, transform) {
    return function(arg) {
        return func(transform(arg));
    };
}
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */ function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
        result[++index] = value;
    });
    return result;
}
/** Used for built-in method references. */ var arrayProto = Array.prototype, funcProto = Function.prototype, objectProto = Object.prototype;
/** Used to detect overreaching core-js shims. */ var coreJsData = root["__core-js_shared__"];
/** Used to resolve the decompiled source of functions. */ var funcToString = funcProto.toString;
/** Used to check objects for own properties. */ var hasOwnProperty = objectProto.hasOwnProperty;
/** Used to detect methods masquerading as native. */ var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
}();
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */ var nativeObjectToString = objectProto.toString;
/** Used to detect if a method is native. */ var reIsNative = RegExp("^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
/** Built-in value references. */ var Buffer = moduleExports ? root.Buffer : undefined, Symbol = root.Symbol, Uint8Array = root.Uint8Array, propertyIsEnumerable = objectProto.propertyIsEnumerable, splice = arrayProto.splice, symToStringTag = Symbol ? Symbol.toStringTag : undefined;
/* Built-in method references for those with the same name as other `lodash` methods. */ var nativeGetSymbols = Object.getOwnPropertySymbols, nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined, nativeKeys = overArg(Object.keys, Object);
/* Built-in method references that are verified to be native. */ var DataView = getNative(root, "DataView"), Map = getNative(root, "Map"), Promise = getNative(root, "Promise"), Set = getNative(root, "Set"), WeakMap = getNative(root, "WeakMap"), nativeCreate = getNative(Object, "create");
/** Used to detect maps, sets, and weakmaps. */ var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
/** Used to convert symbols to primitives and strings. */ var symbolProto = Symbol ? Symbol.prototype : undefined, symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */ function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
}
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
}
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty.call(data, key) ? data[key] : undefined;
}
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */ function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED : value;
    return this;
}
// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */ function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
}
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) return false;
    var lastIndex = data.length - 1;
    if (index == lastIndex) data.pop();
    else splice.call(data, index, 1);
    --this.size;
    return true;
}
/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? undefined : data[index][1];
}
/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
}
/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */ function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
        ++this.size;
        data.push([
            key,
            value
        ]);
    } else data[index][1] = value;
    return this;
}
// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while(++index < length){
        var entry = entries[index];
        this.set(entry[0], entry[1]);
    }
}
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */ function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
        "hash": new Hash,
        "map": new (Map || ListCache),
        "string": new Hash
    };
}
/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
}
/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function mapCacheGet(key) {
    return getMapData(this, key).get(key);
}
/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function mapCacheHas(key) {
    return getMapData(this, key).has(key);
}
/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */ function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
}
// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */ function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache;
    while(++index < length)this.add(values[index]);
}
/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */ function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
}
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */ function setCacheHas(value) {
    return this.__data__.has(value);
}
// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */ function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
}
/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */ function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
}
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */ function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
}
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */ function stackGet(key) {
    return this.__data__.get(key);
}
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */ function stackHas(key) {
    return this.__data__.has(key);
}
/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */ function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([
                key,
                value
            ]);
            this.size = ++data.size;
            return this;
        }
        data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
}
// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */ function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for(var key in value)if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex(key, length)))) result.push(key);
    return result;
}
/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */ function assocIndexOf(array, key) {
    var length = array.length;
    while(length--){
        if (eq(array[length][0], key)) return length;
    }
    return -1;
}
/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */ function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ function baseGetTag(value) {
    if (value == null) return value === undefined ? undefinedTag : nullTag;
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */ function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
}
/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */ function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) return true;
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */ function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) return false;
        objIsArr = true;
        objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
        stack || (stack = new Stack);
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack);
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
    }
    if (!isSameTag) return false;
    stack || (stack = new Stack);
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */ function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) return false;
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
}
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */ function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */ function baseKeys(object) {
    if (!isPrototype(object)) return nativeKeys(object);
    var result = [];
    for(var key in Object(object))if (hasOwnProperty.call(object, key) && key != "constructor") result.push(key);
    return result;
}
/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */ function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
    // Assume cyclic values are equal.
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) return stacked == other;
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache : undefined;
    stack.set(array, other);
    stack.set(other, array);
    // Ignore non-index properties.
    while(++index < arrLength){
        var arrValue = array[index], othValue = other[index];
        if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        if (compared !== undefined) {
            if (compared) continue;
            result = false;
            break;
        }
        // Recursively compare arrays (susceptible to call stack limits).
        if (seen) {
            if (!arraySome(other, function(othValue, othIndex) {
                if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
            })) {
                result = false;
                break;
            }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result = false;
            break;
        }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
}
/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */ function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch(tag){
        case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
            object = object.buffer;
            other = other.buffer;
        case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) return false;
            return true;
        case boolTag:
        case dateTag:
        case numberTag:
            // Coerce booleans to `1` or `0` and dates to milliseconds.
            // Invalid dates are coerced to `NaN`.
            return eq(+object, +other);
        case errorTag:
            return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
            // Coerce regexes to strings and treat strings, primitives and objects,
            // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
            // for more details.
            return object == other + "";
        case mapTag:
            var convert = mapToArray;
        case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) return false;
            // Assume cyclic values are equal.
            var stacked = stack.get(object);
            if (stacked) return stacked == other;
            bitmask |= COMPARE_UNORDERED_FLAG;
            // Recursively compare objects (susceptible to call stack limits).
            stack.set(object, other);
            var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result;
        case symbolTag:
            if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
    }
    return false;
}
/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */ function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) return false;
    var index = objLength;
    while(index--){
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) return stacked == other;
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while(++index < objLength){
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        // Recursively compare objects (susceptible to call stack limits).
        if (!(compared === undefined ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result = false;
            break;
        }
        skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        // Non `Object` object instances with different constructors are not equal.
        if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
}
/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */ function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
}
/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */ function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */ function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
}
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */ function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
        value[symToStringTag] = undefined;
        var unmasked = true;
    } catch (e) {}
    var result = nativeObjectToString.call(value);
    if (unmasked) {
        if (isOwn) value[symToStringTag] = tag;
        else delete value[symToStringTag];
    }
    return result;
}
/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */ var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) return [];
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
    });
};
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */ var getTag = baseGetTag;
// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map) != mapTag || Promise && getTag(Promise.resolve()) != promiseTag || Set && getTag(new Set) != setTag || WeakMap && getTag(new WeakMap) != weakMapTag) getTag = function(value) {
    var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : undefined, ctorString = Ctor ? toSource(Ctor) : "";
    if (ctorString) switch(ctorString){
        case dataViewCtorString:
            return dataViewTag;
        case mapCtorString:
            return mapTag;
        case promiseCtorString:
            return promiseTag;
        case setCtorString:
            return setTag;
        case weakMapCtorString:
            return weakMapTag;
    }
    return result;
};
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */ function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length && (typeof value == "number" || reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */ function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */ function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
}
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */ function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
    return value === proto;
}
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */ function objectToString(value) {
    return nativeObjectToString.call(value);
}
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */ function toSource(func) {
    if (func != null) {
        try {
            return funcToString.call(func);
        } catch (e) {}
        try {
            return func + "";
        } catch (e) {}
    }
    return "";
}
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */ function eq(value, other) {
    return value === other || value !== value && other !== other;
}
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */ var isArguments = baseIsArguments(function() {
    return arguments;
}()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
};
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */ var isArray = Array.isArray;
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */ function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */ var isBuffer = nativeIsBuffer || stubFalse;
/**
 * Performs a deep comparison between two values to determine if they are
 * equivalent.
 *
 * **Note:** This method supports comparing arrays, array buffers, booleans,
 * date objects, error objects, maps, numbers, `Object` objects, regexes,
 * sets, strings, symbols, and typed arrays. `Object` objects are compared
 * by their own, not inherited, enumerable properties. Functions and DOM
 * nodes are compared by strict equality, i.e. `===`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.isEqual(object, other);
 * // => true
 *
 * object === other;
 * // => false
 */ function isEqual(value, other) {
    return baseIsEqual(value, other);
}
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */ function isFunction(value) {
    if (!isObject(value)) return false;
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */ function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */ function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */ function isObjectLike(value) {
    return value != null && typeof value == "object";
}
/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */ var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */ function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */ function stubArray() {
    return [];
}
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */ function stubFalse() {
    return false;
}
module.exports = isEqual;

},{}],"2B8mY":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "speedChartSpec", ()=>speedChartSpec);
var _chartJs = require("chart.js");
var _chartJsDefault = parcelHelpers.interopDefault(_chartJs);
var _chartutil = require("../chartutil");
var _scatterChartSpec = require("../scatterChartSpec");
const inputId = "speed-input";
const speedPointFormatter = (point)=>{
    return `T:${point.x.toFixed(2)}\nS:${+point.y.toFixed(2)}`;
};
const speedChartConfig = {
    data: {
        datasets: [
            {
                label: "Speed",
                lineTension: 0,
                data: [],
                showLine: true,
                pointBackgroundColor: (0, _scatterChartSpec.getScatterPointColor),
                pointBorderColor: (0, _chartutil.medgrey)(0.9),
                pointRadius: 5,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 1.5,
                pointHoverBorderColor: (0, _chartutil.lightgrey)(0.8),
                pointHitRadius: 4
            }
        ]
    },
    options: {
        scales: {
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: "Speed",
                        fontSize: 12,
                        padding: 0
                    },
                    gridLines: {
                        color: (0, _chartutil.medgrey)(0.6),
                        lineWidth: 1
                    },
                    ticks: {
                        stepSize: 0.1,
                        min: 0,
                        max: 2
                    }
                }
            ]
        },
        plugins: {
            datalabels: {
                formatter: speedPointFormatter,
                font: {
                    size: 10,
                    weight: "normal"
                }
            }
        }
    }
};
const speedChartSpec = (0, _chartJsDefault.default).helpers.merge((0, _scatterChartSpec.scatterChartSpec)("speed", inputId), speedChartConfig);

},{"chart.js":"fyX24","../chartutil":"fsMdw","../scatterChartSpec":"f6y72","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"2yfyw":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "autoHideUnselectedMarkerPairsCSS", ()=>autoHideUnselectedMarkerPairsCSS);
parcelHelpers.export(exports, "adjustRotatedVideoPositionCSS", ()=>adjustRotatedVideoPositionCSS);
parcelHelpers.export(exports, "getRotatedVideoCSS", ()=>getRotatedVideoCSS);
const autoHideUnselectedMarkerPairsCSS = `
    rect.marker {
      opacity: 0.25;
    }
    text.markerNumbering {
      opacity: 0.25;
      pointer-events: none;
    }

    rect.selected-marker {
      opacity: 1;
    }
    text.selectedMarkerNumbering {
      opacity: 1;
      pointer-events: visibleFill;
    }

    rect.marker.end-marker {
      pointer-events: none;
    }
    rect.selected-marker.end-marker {
      pointer-events: visibleFill;
    }
    `;
const adjustRotatedVideoPositionCSS = `\

    `;
function getRotatedVideoCSS(rotation) {
    return `
        .yt-clipper-video {
          transform: rotate(${rotation}deg) !important;
        }
        #full-bleed-container {
          height: 85vh !important;
          max-height: none !important;
        }
        #page-manager {
          margin-top: 0px !important;
        }
        #masthead {
          display: none !important;
        }
      `;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"l5HCU":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Tooltips", ()=>Tooltips);
var _commonTags = require("common-tags");
var Tooltips;
(function(Tooltips) {
    Tooltips.markerPairNumberTooltip = (0, _commonTags.stripIndent)`
    Enter a new marker pair number here to reorder marker pairs.
    Does not automatically update merge list.
    `;
    Tooltips.speedTooltip = (0, _commonTags.stripIndent)`
    Toggle speed previewing with C.
    When audio is enabled, speeds below 0.5 are not yet supported.
    YouTube can only preview speeds that are multiples of 0.05 (e.g., 0.75 or 0.45).
    YouTube does not support previewing speeds below 0.25.
    `;
    Tooltips.timeDurationTooltip = (0, _commonTags.stripIndent)`
      When speed is constant (static) the duration is formatted as <in-duration>/<speed> = <out-duration>.
      When speed is variable (dynamic) the duration is formatted as <in-duration> (<out-duration>).
      Durations are formatted as HH:MM:SS.MS omitting insignificant 0s on the left.
    `;
    Tooltips.cropTooltip = (0, _commonTags.stripIndent)`
    Crop values are given as x-offset:y-offset:width:height. Each value is a positive integer in pixels.
    Width and height can also be 'iw' and 'ih' respectively for input width and input height.
    Use Ctrl+Click+Drag on the crop preview to adjust the crop with the mouse instead.
    Increment/decrement values in the crop input with the up/down keys by ±10.
    The cursor position within the crop string determines the crop component to change.
    Use modifier keys to alter the change amount: Alt: ±1, Shift: ±50, Alt+Shift: ±100.
    `;
    Tooltips.titlePrefixTooltip = (0, _commonTags.stripIndent)`
    Specify a title prefix to be prepended to the tile suffix of the file name generated by this marker pair.
    `;
    Tooltips.titleSuffixTooltip = (0, _commonTags.stripIndent)`
    Specify a title suffix to be appended to the title prefixes specified for each marker pair.
    The title suffix is followed by the marker pair number in the final file name for each marker pair.
    The title suffix is also the the file name stem of the markers data json file saved with S.
    The markers data file name is used as the title suffix when running the clipper script.
    Thus it can be renamed to change the title suffix without editing the json data.
    `;
    Tooltips.cropResolutionTooltip = (0, _commonTags.stripIndent)`
    The crop resolution specifies the scaling of crop strings, which should match the input video's resolution.
    However, lower crop resolutions can be easier to work with.
    The clipper script will automatically scale the crop resolution if a mismatch is detected.
    `;
    Tooltips.rotateTooltip = (0, _commonTags.stripIndent)`
    Correct video rotation by rotating the input video clockwise or counterclockwise by 90 degrees.
    Note that the YouTube video rotate preview using the R/Alt+R shortcuts does NOT affect the output video.
    `;
    Tooltips.mergeListTooltip = (0, _commonTags.stripIndent)`
    Specify which marker pairs if any you would like to merge/concatenate.
    Each merge is a comma separated list of marker pair numbers or ranges (e.g., '1-3,5,9' = '1,2,3,5,9').
    Multiple merges are separated with semicolons (e.g., '1-3,5,9;6-2,8' will create two merged webms).
    Merge occurs successfully only after successful generation of each required generated webm.
    Merge does not require reencoding and simply orders each webm into one container.
    `;
    Tooltips.audioTooltip = (0, _commonTags.stripIndent)`
    Enable audio.
    Not yet compatible with special loop behaviors or time-variable speed.
    `;
    Tooltips.encodeSpeedTooltip = (0, _commonTags.stripIndent)`
    Higher values will speed up encoding at the cost of some quality.
    Very high values will also reduce bitrate control effectiveness, which may increase file sizes.
    `;
    Tooltips.CRFTooltip = (0, _commonTags.stripIndent)`
    Constant Rate Factor or CRF allows the video bitrate to vary while maintaining roughly constant quality.
    Lower CRF values result in higher quality but larger file sizes.
    A CRF around 25 (~30 for 4k) usually results in file size compression that does not visibly reduce quality.
    When the target bitrate is set to 0 (unlimited), the bitrate is unconstrained and operates in constant quality mode .
    When the target bitrate is set to auto or a positive value in kbps, the script operates in constrained quality mode.
    Constrained quality mode keeps file sizes reasonable even when low CRF values are specified.
    `;
    Tooltips.targetBitrateTooltip = (0, _commonTags.stripIndent)`
    Specify the target bitrate in kbps of the output video.
    The bitrate determines how much data is used to encode each second of video and thus the final file size.
    If the bitrate is too low then the compression of the video will visibly reduce quality.
    When the target bitrate is set to 0 for unlimited, the script operates in constant quality mode.
    When the target bitrate is set to auto or a positive value in kbps, the script operates in constrained quality mode.
    Constrained quality mode keeps file sizes reasonable even when low CRF values are specified.
    `;
    Tooltips.twoPassTooltip = (0, _commonTags.stripIndent)`
    Encode in two passes for improved bitrate control which can reduce filesizes.
    Results in better quality, with diminishing returns for high bitrate video.
    Significantly reduces encode speed.
    `;
    Tooltips.hdrTooltip = (0, _commonTags.stripIndent)`
    Enabling HDR (high dynamic range) may improve the output video's image vibrancy and colors at the expense of file size and playback compatibility.
    `;
    Tooltips.gammaTooltip = (0, _commonTags.stripIndent)`
    A gamma function is used to map input luminance values to output luminance values or vice versa.
    Note that the gamma preview is not accurate. Use the offline previewer for more accurate gamma preview.
    The gamma value is an exponent applied to the input luminance values.
    A gamma value of 1 is neutral and does not modify the video.
    A gamma value greater than 1 can be used to darken the video and enhance highlight detail.
    A gamma value less than 1 can be used to lighten the video and enhance shadow detail.
    Even small changes in gamma can have large effects (smallest possible change is 0.01).
    Use the gamma preview toggle (Alt+C) to set the gamma to taste.
    `;
    Tooltips.denoiseTooltip = (0, _commonTags.stripIndent)`
    Reduce noise, static, and blockiness at the cost of some encoding speed.
    Improves compression efficiency and thus reduces file sizes.
    Higher strength presets may result in oversmoothing of details.
    `;
    Tooltips.minterpModeTooltip = (0, _commonTags.stripIndent)`
    Motion interpolation (minterp for short) is sometimes called optical flow, super slowmo, or just interpolation.
    Motion interpolation is typically used to increase fps and achieve smoother slow motion.
    Motion interpolation is in Numeric mode by default. This requires a valid fps (10-120) input to work.
    A higher fps value requires more resources and time to encode.
    Motion interpolation can and will introduce artifacting (visual glitches).
    Artifacting increases with the speed and complexity of the video.
    In MaxSpeed mode, motion interpolation targets the fps of the highest speed seen in the dynamic speed chart.
    This helps smooth out motion when using dynamic speed with reasonable resource efficiency.
    In VideoFPS mode, motion interpolation targets the fps of the input video.
    MaxSpeedx2 and VideoFPSx2 modes double the target fps from the previous two modes.
    `;
    Tooltips.minterpFPSTooltip = (0, _commonTags.stripIndent)`
    Input an fps value from 10-120 to add interpolated frames and achieve smooth slow motion.
    Motion interpolation mode must be set to Numeric.
    Motion interpolation is resource intensive and will take longer to process the higher the target fps.
    Motion interpolation can and will introduce artifacting (visual glitches).
    Artifacting increases with the speed and complexity of the video.
    `;
    Tooltips.vidstabTooltip = (0, _commonTags.stripIndent)`
    Video stabilization tries to smooth out the motion in the video and reduce shaking.
    Usually requires cropping and zooming the video.
    Higher strength presets result in more cropping and zooming.
    Low contrast video or video with flashing lights may give poor results.
    Video stabilization may cause static elements within the cropped region to shake.
    `;
    Tooltips.dynamicZoomTooltip = (0, _commonTags.stripIndent)`
    Allow cropping and zooming of video to vary with the need for stabilization over time.
    `;
    Tooltips.speedMapTooltip = (0, _commonTags.stripIndent)`
    Time-variable speed maps are enabled by default, but can be force enabled/disabled with this setting.
    A speed map may be specified using the speed chart (toggled with D).
    `;
    Tooltips.enableZoomPanTooltip = (0, _commonTags.stripIndent)`
    Enable or disable dynamic crop zoompan mode.
    When disabled, dynamic crop is in pan-only mode.
    In pan-only mode, crop points all have the same size.
    In zoompan mode, crop points can have different sizes but have the same aspect ratio.
    Switching from zoompan to pan-only mode requires removing zooms and a prompt may appear.
  `;
    function zoomPanToPanOnlyTooltip(sw, sh, lw, lh, aw, ah) {
        return (0, _commonTags.stripIndent)`
    Switching from zoompan to pan-only mode requires removing zooms.
    That is, all crop points must be made to have the same size.
    This can be the (s)mallest, (l)argest or (a)verage size in the crop map.

    Enter 's' for ${sw}x${sh}, 'l' for ${lw}x${lh}, or 'a' for ${aw}x${ah}.

    *Note that choosing (l)argest or (a)verage will shift crops as necessary.
  `;
    }
    Tooltips.zoomPanToPanOnlyTooltip = zoomPanToPanOnlyTooltip;
    Tooltips.loopTooltip = (0, _commonTags.stripIndent)`
    Enable one of the special loop behaviors.
    fwrev loops will play the video normally once, then immediately play it in reverse.
    fade loops will crossfade the end of the video into the start of the video.
    fade loops can make short clips easier on the eyes and reduce the perceived jerkiness when the video repeats.
    `;
    Tooltips.fadeDurationTooltip = (0, _commonTags.stripIndent)`
    The duration to cut from the beginning and end of the output video to produce the crossfade for fade loops.
    Will be clamped to a minimum of 0.1 seconds and a maximum of 40% of the output clip duration.
    Only applicable when loop is set to fade.
    `;
})(Tooltips || (Tooltips = {}));

},{"common-tags":"6nh3m","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}],"bailj":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "injectModal", ()=>injectModal);
parcelHelpers.export(exports, "disableCropPreview", ()=>disableCropPreview);
parcelHelpers.export(exports, "startDrawZoomedRegion", ()=>startDrawZoomedRegion);
var _commonTags = require("common-tags");
var _util = require("../util/util");
var _ytClipper = require("../yt_clipper");
function injectModal(video, toggleCallback, getCropPreviewMouseTimeSetter) {
    const modalHTML = (0, _commonTags.html)`
    <div id="ytc-zoom-modal" class="ytc-modal">
      <div id="ytc-modal-content" class="ytc-modal-content">
        <div class="ytc-canvas-wrapper">
          <canvas id="ytc-zoom-canvas"></canvas>
        </div>
      </div>
    </div>
  `;
    const modalElement = (0, _util.htmlToElement)(modalHTML);
    document.body.insertAdjacentElement("afterbegin", modalElement);
    const modalContent = document.getElementById("ytc-modal-content");
    modalElement.addEventListener("click", (e)=>{
        if (!modalContent.contains(e.target)) toggleCallback();
    });
    modalElement.addEventListener("click", (e)=>{
        if (modalContent.contains(e.target)) {
            if (video.paused) video.play();
            else video.pause();
        }
    });
    const cropPreviewMouseTimeSetter = getCropPreviewMouseTimeSetter(modalContent);
    modalElement.addEventListener("pointerdown", cropPreviewMouseTimeSetter, true);
}
function disableCropPreview() {
    const modal = document.getElementById("ytc-zoom-modal");
    (0, _util.deleteElement)(modal);
}
function startDrawZoomedRegion(getZoomRegion) {
    const canvas = document.getElementById("ytc-zoom-canvas");
    const ctx = canvas.getContext("2d");
    const modal = document.getElementById("ytc-zoom-modal");
    const modalContent = document.getElementsByClassName("ytc-modal-content")[0];
    const [x, y, w, h] = getZoomRegion();
    canvas.width = w;
    canvas.height = h;
    drawZoomedRegion(getZoomRegion, canvas, ctx, modal, modalContent);
}
function drawZoomedRegion(getZoomRegion, canvas, ctx, modal, modalContent) {
    if (modal && modal.isConnected && !modal.classList.contains("hidden")) {
        const [x, y, w, h] = getZoomRegion();
        canvas.width = w;
        canvas.height = h;
        resizeModalToAspect(modalContent, w, h);
        ctx.drawImage((0, _ytClipper.video), x, y, w, h, 0, 0, canvas.width, canvas.height);
        (0, _ytClipper.video).requestVideoFrameCallback(()=>drawZoomedRegion(getZoomRegion, canvas, ctx, modal, modalContent));
    }
}
function resizeModalToAspect(modalContent, width, height) {
    const maxWidth = window.innerWidth * 0.95;
    const maxHeight = window.innerHeight * 0.95;
    const aspectRatio = width / height;
    let modalWidth = maxWidth;
    let modalHeight = modalWidth / aspectRatio;
    if (modalHeight > maxHeight) {
        modalHeight = maxHeight;
        modalWidth = modalHeight * aspectRatio;
    }
    modalContent.style.width = `${modalWidth}px`;
    modalContent.style.height = `${modalHeight}px`;
}

},{"common-tags":"6nh3m","../util/util":"jxJ0L","../yt_clipper":"49CxU","@parcel/transformer-js/src/esmodule-helpers.js":"j0WhR"}]},["49CxU"], "49CxU", "parcelRequiree4af")

//# sourceMappingURL=yt_clipper.js.map
