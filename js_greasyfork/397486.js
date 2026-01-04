// ==UserScript==
// @name         BezierCurveVisibleGenerator
// @namespace    https://github.com/BokunoMasayume/BezierCurveVisibleGenerator
// @version      1.0
// @description  run it and click it
// @author       BokunoMasayume
// @include      *
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397486/BezierCurveVisibleGenerator.user.js
// @updateURL https://update.greasyfork.org/scripts/397486/BezierCurveVisibleGenerator.meta.js
// ==/UserScript==

window.贝塞尔曲线生成监听 = document.addEventListener('keydown', (e)=>{
    if(e.altKey && e.key==='c'){
        document.removeEventListener('keydown', window.贝塞尔曲线生成监听);
       }else{
           return;
       }
    alert("使用贝塞尔曲线生成器");
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("document.body.innerHTML = \"\"; // document.body.style.height = '100%';\n\n/**\r\n * wrap\r\n *  */\n\nvar wrap = document.createElement('div');\nwrap.style.position = \"fixed\";\nwrap.style.top = \"0\";\nwrap.style.left = \"0\";\nwrap.style.right = \"0\";\nwrap.style.bottom = \"0\";\nwrap.style.zIndex = \"999\";\ndocument.body.appendChild(wrap); // wrap.style.backgroundColor = \"red\";\n\n/**\r\n * controller \r\n */\n\nvar controller = document.createElement('div');\ncontroller.style.height = \"80px\";\nwrap.appendChild(controller);\ncontroller.style.backgroundColor = \"blue\";\n/**\r\n * svg\r\n */\n\nvar svg = document.createElementNS(\"http://www.w3.org/2000/svg\", 'svg');\nsvg.setAttribute('width', window.innerWidth);\nsvg.setAttribute('height', window.innerHeight - 80); // svg.style.width = window.innerWidth+\"px\";\n// svg.style.height = window.innerHeight+\"px\";\n\nsvg.setAttribute('viewBox', \"0 0 \" + window.innerWidth + \" \" + (window.innerHeight - 80));\nwrap.appendChild(svg);\nsvg.style.border = \"2px solid black\"; // var testcir = document.createElementNS(\"http://www.w3.org/2000/svg\",'circle');\n// testcir.setAttribute('r', \"100\");\n// testcir.setAttribute(\"cx\",\"200\");\n// testcir.setAttribute(\"cy\",\"300\");\n// svg.appendChild(testcir);\n\n/**\r\n * bezier curve anchor points\r\n * anchors[i] is the attr of i/2 th point\r\n * i%2 ==0  anchors[i] is x attr else is y attr \r\n */\n\nvar anchors = []; // var anchors = [100,100,     150,150,        200,150,    250,200];\n\n/**\r\n * layer points\r\n * 1st dimension is layer\r\n * 2nd dimension is points of this layer\r\n * \r\n * point is{\r\n *      x:\r\n *      y:\r\n *      el:\r\n * }\r\n */\n\nvar layerPoints = [];\n/**\r\n * layer lines\r\n * 1st dimension is layer\r\n * 2nd dimension is lines of this layer\r\n * \r\n * line is{\r\n *      p1:\r\n *      p2:\r\n *      el:\r\n * }\r\n */\n\nvar layerLines = [];\n/**\r\n * timing start\r\n */\n\nvar start,\n    duration = 5000; //5s\n\n/**\r\n * stop animation id\r\n */\n\nvar stopAnimId;\n/**\r\n * path \r\n */\n\nvar path = document.createElementNS(\"http://www.w3.org/2000/svg\", 'path');\npath.setAttribute('d', 'M 0 0 ');\nsvg.appendChild(path);\n/**\r\n * define property\r\n */\n\nfunction cookSVGobj(obj) {\n  Object.defineProperty(obj, 'x', {\n    enumerable: true,\n    configurable: true,\n    set: function set(value) {\n      this.el.setAttribute('cx', value);\n    },\n    get: function get() {\n      return this.el.getAttribute('cx');\n    }\n  });\n  Object.defineProperty(obj, 'y', {\n    enumerable: true,\n    configurable: true,\n    set: function set(value) {\n      this.el.setAttribute('cy', value);\n    },\n    get: function get() {\n      return this.el.getAttribute('cy');\n    }\n  });\n  Object.defineProperty(obj, 'x1', {\n    enumerable: true,\n    configurable: true,\n    set: function set(value) {\n      this.el.setAttribute('x1', value);\n    },\n    get: function get() {\n      return this.el.getAttribute('x1');\n    }\n  });\n  Object.defineProperty(obj, 'y1', {\n    enumerable: true,\n    configurable: true,\n    set: function set(value) {\n      this.el.setAttribute('y1', value);\n    },\n    get: function get() {\n      return this.el.getAttribute('y1');\n    }\n  });\n  Object.defineProperty(obj, 'x2', {\n    enumerable: true,\n    configurable: true,\n    set: function set(value) {\n      this.el.setAttribute('x2', value);\n    },\n    get: function get() {\n      return this.el.getAttribute('x2');\n    }\n  });\n  Object.defineProperty(obj, 'y2', {\n    enumerable: true,\n    configurable: true,\n    set: function set(value) {\n      this.el.setAttribute('y2', value);\n    },\n    get: function get() {\n      return this.el.getAttribute('y2');\n    }\n  });\n}\n/**\r\n * init polys into svg tag\r\n * init layer points and lines\r\n */\n\n\nfunction init() {\n  svg.innerHTML = \"\";\n  path = document.createElementNS(\"http://www.w3.org/2000/svg\", 'path');\n  path.setAttribute('d', \"M \".concat(anchors[anchors.length - 2], \" \").concat(anchors[anchors.length - 1]));\n  path.setAttribute('fill', 'none');\n  path.setAttribute('stroke', 'black');\n  path.setAttribute('stroke-width', '6'); // stroke=\"black\" fill=\"none\"\n\n  svg.appendChild(path);\n  layerPoints = Array.from({\n    length: anchors.length / 2\n  });\n\n  for (var i = 0; i < layerPoints.length; i++) {\n    layerPoints[i] = Array.from({\n      length: i + 1\n    });\n\n    for (var j = 0; j < layerPoints[i].length; j++) {\n      layerPoints[i][j] = {};\n      cookSVGobj(layerPoints[i][j]);\n      layerPoints[i][j].el = document.createElementNS(\"http://www.w3.org/2000/svg\", 'circle');\n      layerPoints[i][j].el.setAttribute('fill', \"rgb(\".concat(Math.floor(Math.random() * 256), \" , \").concat(Math.floor(Math.random() * 256), \" , \").concat(Math.floor(Math.random() * 256), \")\"));\n      layerPoints[i][j].el.setAttribute('r', \"4\");\n      svg.appendChild(layerPoints[i][j].el);\n    }\n  }\n\n  layerLines = Array.from({\n    length: anchors.length / 2\n  });\n\n  for (var _i = 0; _i < layerLines.length; _i++) {\n    layerLines[_i] = Array.from({\n      length: _i\n    });\n\n    for (var _j = 0; _j < layerLines[_i].length; _j++) {\n      layerLines[_i][_j] = {};\n      cookSVGobj(layerLines[_i][_j]);\n      layerLines[_i][_j].el = document.createElementNS(\"http://www.w3.org/2000/svg\", 'line');\n\n      layerLines[_i][_j].el.setAttribute('stroke', \"rgb(\".concat(Math.floor(Math.random() * 256), \" , \").concat(Math.floor(Math.random() * 256), \" , \").concat(Math.floor(Math.random() * 256), \")\")); // layerLines[i][j].x1 = layerPoints[i][j].x;\n      // layerLines[i][j].y1 = layerPoints[i][j].y;\n      // layerLines[i][j].x2 = layerPoints[i][j+1].x;\n      // layerLines[i][j].y2 = layerPoints[i][j+1].y;\n\n\n      svg.appendChild(layerLines[_i][_j].el);\n    }\n  }\n}\n\nfunction render() {\n  var t = (new Date().getTime() - start) / duration; // console.log(t)\n\n  if (t > 1) return;\n  var anc = anchors.slice();\n\n  for (var i = 0; i < anc.length / 2; i++) {\n    layerPoints[anc.length / 2 - 1][i].x = anc[i * 2];\n    layerPoints[anc.length / 2 - 1][i].y = anc[i * 2 + 1];\n\n    if (i > 0) {\n      layerLines[anc.length / 2 - 1][i - 1].x1 = layerPoints[anc.length / 2 - 1][i - 1].x;\n      layerLines[anc.length / 2 - 1][i - 1].y1 = layerPoints[anc.length / 2 - 1][i - 1].y;\n      layerLines[anc.length / 2 - 1][i - 1].x2 = layerPoints[anc.length / 2 - 1][i].x;\n      layerLines[anc.length / 2 - 1][i - 1].y2 = layerPoints[anc.length / 2 - 1][i].y;\n    }\n  }\n\n  for (var _i2 = anc.length / 2 - 2; _i2 >= 0; _i2--) {\n    for (var j = 0; j <= _i2; j++) {\n      layerPoints[_i2][j].x = t * layerPoints[_i2 + 1][j].x + (1 - t) * layerPoints[_i2 + 1][j + 1].x;\n      layerPoints[_i2][j].y = t * layerPoints[_i2 + 1][j].y + (1 - t) * layerPoints[_i2 + 1][j + 1].y;\n\n      if (j > 0) {\n        layerLines[_i2][j - 1].x1 = layerPoints[_i2][j - 1].x;\n        layerLines[_i2][j - 1].y1 = layerPoints[_i2][j - 1].y;\n        layerLines[_i2][j - 1].x2 = layerPoints[_i2][j].x;\n        layerLines[_i2][j - 1].y2 = layerPoints[_i2][j].y;\n      }\n    }\n  }\n\n  path.setAttribute('d', path.getAttribute('d') + \"L \".concat(layerPoints[0][0].x, \" \").concat(layerPoints[0][0].y, \" \"));\n  stopAnimId = requestAnimationFrame(render);\n}\n\nsvg.onclick = function (e) {\n  if (stopAnimId) cancelAnimationFrame(stopAnimId);\n  anchors.push(e.offsetX);\n  anchors.push(e.offsetY);\n  init();\n  start = new Date().getTime();\n  stopAnimId = requestAnimationFrame(render);\n}; // init();\n// start = new Date().getTime();\n// stopAnimId = requestAnimationFrame(render);\n// console.log(layerPoints);\n// console.log(layerLines);\n\n//# sourceURL=webpack:///./src/main.js?");

/***/ })

/******/ })

});