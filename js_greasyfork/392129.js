// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
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
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"FFtY":[function(require,module,exports) {
"use strict"; // ==UserScript==
// @name         极客学院md文档中文版图片显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不知到什么原因 http://wiki.jikexueyuan.com/project/material-design/whatis-material-design/material-properties.html 的文档加载不出图片，于是我将他图片的地址修改为github的
// @author       崮生
// @match        http://wiki.jikexueyuan.com/project/material-design/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392129/%E6%9E%81%E5%AE%A2%E5%AD%A6%E9%99%A2md%E6%96%87%E6%A1%A3%E4%B8%AD%E6%96%87%E7%89%88%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/392129/%E6%9E%81%E5%AE%A2%E5%AD%A6%E9%99%A2md%E6%96%87%E6%A1%A3%E4%B8%AD%E6%96%87%E7%89%88%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
// parcel build --no-minify --no-source-maps .\极客学院md文档中文版图片显示\极客学院md文档中文版图片显示.ts

(function () {
  'use strict';

  var imgs = Array.from(document.getElementsByTagName("img"));
  imgs.filter(function (el) {
    return el.src.includes("/project/material-design");
  }).forEach(function (img) {
    img.src = "https://github.com/1sters/material_design_zh_2/blob/master/material-design".concat(img.src.split("project/material-design")[1], "?raw=true");
  });
})();
},{}]},{},["FFtY"], null)