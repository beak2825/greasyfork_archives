// ==UserScript==
// @name MissAV 去广告 | 影院模式 (单手播放器)5.14存档
// @description MissAV去广告|单手模式|MissAV自动展开详情|MissAV自动高画质|MissAV重定向支持|MissAV自动登录|定制播放器 支持 jable po*nhub 等通用
// @version 5.1.4
// @author Chris_C
// @match *://*.missav.ws/*
// @match *://*.missav.ai/*
// @match *://*.jable.tv/*
// @match *://*/*
// @grant none
// @icon https://missav.ws/img/favicon.ico
// @license MIT
// @namespace loadingi.local
// @noframes 
// @run-at document-start 
// @downloadURL https://update.greasyfork.org/scripts/534929/MissAV%20%E5%8E%BB%E5%B9%BF%E5%91%8A%20%7C%20%E5%BD%B1%E9%99%A2%E6%A8%A1%E5%BC%8F%20%28%E5%8D%95%E6%89%8B%E6%92%AD%E6%94%BE%E5%99%A8%29514%E5%AD%98%E6%A1%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/534929/MissAV%20%E5%8E%BB%E5%B9%BF%E5%91%8A%20%7C%20%E5%BD%B1%E9%99%A2%E6%A8%A1%E5%BC%8F%20%28%E5%8D%95%E6%89%8B%E6%92%AD%E6%94%BE%E5%99%A8%29514%E5%AD%98%E6%A1%A3.meta.js
// ==/UserScript==

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 56:
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

/***/ 72:
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

/***/ 113:
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

/***/ }),

/***/ 169:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root{
    --shadcn-background:0 0% 0%;
    --shadcn-foreground:0 0% 100%;
    --shadcn-card:0 0% 5%;
    --shadcn-card-foreground:0 0% 95%;
    --shadcn-popover:0 0% 10%;
    --shadcn-popover-foreground:0 0% 95%;
    --shadcn-primary:210 10% 90%;
    --shadcn-primary-foreground:210 20% 10%;
    --shadcn-secondary:0 0% 15%;
    --shadcn-secondary-foreground:0 0% 95%;
    --shadcn-muted:0 0% 30%;
    --shadcn-muted-foreground:0 0% 70%;
    --shadcn-accent:212 40% 30%;
    --shadcn-accent-foreground:0 0% 95%;
    --shadcn-destructive:0 50% 40%;
    --shadcn-destructive-foreground:0 0% 95%;
    --shadcn-border:0 0% 30%;
    --shadcn-input:0 0% 15%;
    --shadcn-ring:212 70% 45%;
    --shadcn-green:142 50% 45%;
    --shadcn-green-foreground:0 0% 95%;
    --shadcn-blue:211 70% 55%;
    --shadcn-blue-foreground:0 0% 95%;
    --shadcn-red:0 60% 50%;
    --shadcn-red-foreground:0 0% 95%;
    --shadcn-orange:25 80% 50%;
    --shadcn-orange-foreground:0 0% 95%;
    --shadcn-purple:262 60% 60%;
    --shadcn-purple-foreground:0 0% 95%;
    --shadcn-radius:0.5rem;
    --shadcn-radius-sm:0.3rem;
    --shadcn-radius-lg:0.8rem;
    --button-sm:20px;
    --button-md:32px;
    --button-lg:40px;
    --button-xl:48px;
    --anim-quick:0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --anim-smooth:0.3s cubic-bezier(0.16, 1, 0.3, 1);
    --anim-bounce:0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    --shadow-sm:0 2px 5px rgba(0, 0, 0, 0.2);
    --shadow-md:0 4px 10px rgba(0, 0, 0, 0.25);
    --shadow-lg:0 8px 20px rgba(0, 0, 0, 0.3);
    --font-sans:"SF Pro Display", "SF Pro", "Segoe UI", "Microsoft YaHei", "微软雅黑", "PingFang SC", "苹方", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
html, body, button, input, select, textarea{
    font-family:var(--font-sans);
}
*, *::before, *::after{
    font-family:inherit;
}

.tm-video-overlay *{
    font-family:var(--font-sans);
}
.tm-floating-button{
    position:fixed;
    bottom:30px;
    left:50%;
    transform:translateX(-50%);
    padding:0;
    width:56px;
    height:56px;
    border-radius:50%;
    background-color:transparent;
    color:rgb(254, 98, 142);
    border:none;
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9980;
    cursor:pointer;
    transition:all var(--anim-smooth);
    overflow:visible;
}

.tm-floating-button svg{
    width:48px;
    height:48px;
    filter:drop-shadow(0 0 10px rgba(254, 98, 142, 0.9));
    transition:all var(--anim-smooth);
    animation:breathing-glow 3s infinite ease-in-out;
}

.tm-floating-button:hover{
    transform:translateX(-50%) scale(1.1);
}

.tm-floating-button:hover svg{
    animation-play-state:paused;
    filter:drop-shadow(0 0 20px rgba(254, 98, 142, 1.0));
}

.tm-floating-button:active{
    transform:translateX(-50%) scale(0.95);
}
@keyframes breathing-glow{
    0%{
        filter:drop-shadow(0 0 8px rgba(254, 98, 142, 0.7));
        transform:scale(0.97);
    }
    50%{
        filter:drop-shadow(0 0 25px rgba(254, 98, 142, 1.0));
        transform:scale(1.03);
    }
    100%{
        filter:drop-shadow(0 0 8px rgba(254, 98, 142, 0.7));
        transform:scale(0.97);
    }
}
@media screen and (orientation: landscape){
    .tm-floating-button{
        left:auto;
        right:20px;
        transform:translateX(0);
    }
    
    .tm-floating-button:hover{
        transform:translateX(0) scale(1.1);
    }
    
    .tm-floating-button:active{
        transform:translateX(0) scale(0.95);
    }
    
    .tm-floating-button svg{
        animation:breathing-glow-landscape 3s infinite ease-in-out;
    }
}
@keyframes breathing-glow-landscape{
    0%{
        filter:drop-shadow(0 0 8px rgba(254, 98, 142, 0.7));
        transform:scale(0.97);
    }
    50%{
        filter:drop-shadow(0 0 25px rgba(254, 98, 142, 1.0));
        transform:scale(1.03);
    }
    100%{
        filter:drop-shadow(0 0 8px rgba(254, 98, 142, 0.7));
        transform:scale(0.97);
    }
}
.tm-video-overlay{
    position:fixed;
    top:0;
    left:0;
    right:0;
    height:100vh;
    background-color:rgba(35, 17, 29, 0.8);
    z-index:9990;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    backdrop-filter:blur(30px);
    -webkit-backdrop-filter:blur(30px);
    padding:0;
}
.tm-player-container{
    position:fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    width:100%;
    background-color:transparent;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:flex-start;
    z-index:9991;
    height:100%;
    overflow:visible;
    pointer-events:auto;
}
.tm-button-container{
    width:100%;
    display:flex;
    justify-content:space-between;
    padding:6px 10px;
    box-sizing:border-box;
    z-index:9993;
    position:absolute;
    top:0;
    left:0;
}

.tm-video-container{
    position:relative;
    overflow:hidden;
    width:100%;
    height:auto;
    max-height:80vh;
    margin-top:44px;
    display:flex;
    align-items:flex-start;
    justify-content:center;
    background-color:hsl(var(--shadcn-card));
    border-radius:var(--shadcn-radius-lg);
    box-shadow:var(--shadow-lg);
    z-index:9992;
}

.tm-video-wrapper{
    position:relative;
    overflow:hidden;
    width:100%;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    will-change:transform;
    border-radius:var(--shadcn-radius) var(--shadcn-radius) 0 0;
}
.tm-video-wrapper video{
    width:auto !important; 
    height:100% !important; 
    max-width:none !important; 
    object-fit:contain !important; 
    transition:transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    touch-action:pan-y; 
    cursor:grab; 
}
.tm-handle-container{
    left:0;
    right:0;
    bottom:10px;
    height:30px;
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:9992;
    width:100%;
}

.tm-resize-handle{
    position:absolute;
    height:5px;
    width:134px;
    max-width:134px;
    background-color:hsla(var(--shadcn-foreground) / 0.6);
    border-radius:2.5px;
    cursor:ns-resize;
    touch-action:none;
    opacity:0.5;
    will-change:transform;
    transition:all var(--anim-quick);
    box-shadow:none;
}

.tm-resize-handle::after{
    content:'';
    position:absolute;
    left:-10px;
    right:-10px;
    top:-15px;
    bottom:-15px;
    background:transparent;
}

.tm-resize-handle:hover{
    opacity:1;
    background-color:hsla(var(--shadcn-foreground) / 0.8);
}
.tm-control-button-base{
    color:hsl(var(--shadcn-secondary-foreground));
    border-radius:50%;
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    transition:all var(--anim-quick);
    backdrop-filter:blur(12px);
    -webkit-backdrop-filter:blur(12px);
    box-shadow:var(--shadow-sm);
}
.tm-close-button{
    position:relative;
    width:var(--button-md);
    height:var(--button-md);
    border-radius:calc(var(--button-md) / 2);
    background-color:hsla(var(--shadcn-secondary) / 0.5);
    color:hsl(var(--shadcn-secondary-foreground));
    border:1px solid hsla(var(--shadcn-border) / 0.1);
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    transition:all var(--anim-smooth);
    z-index:9994;
}

.tm-close-button:hover{
    background-color:hsl(var(--shadcn-destructive));
    transform:scale(1.1);
    box-shadow:var(--shadow-md);
}

.tm-close-button:active{
    transform:scale(0.9);
}
.tm-settings-button{
    position:relative;
    width:var(--button-md);
    height:var(--button-md);
    border-radius:calc(var(--button-md) / 2);
    background-color:hsla(var(--shadcn-secondary) / 0.7);
    color:hsl(var(--shadcn-secondary-foreground));
    border:1px solid hsla(var(--shadcn-border) / 0.2);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9993;
    cursor:pointer;
    transition:all var(--anim-quick);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
    box-shadow:var(--shadow-sm);
}

.tm-settings-button:hover{
    background-color:hsla(var(--shadcn-accent) / 0.9);
    transform:scale(1.1) rotate(30deg);
    box-shadow:var(--shadow-md);
}

.tm-settings-button:active{
    transform:scale(0.9);
}
.tm-settings-panel{
    position:absolute;
    top:calc(env(safe-area-inset-top, 8px) + 60px);
    right:16px;
    background-color:hsla(var(--shadcn-card) / 0.7);
    backdrop-filter:blur(15px);
    -webkit-backdrop-filter:blur(15px);
    border-radius:var(--shadcn-radius);
    border:1px solid hsla(var(--shadcn-border) / 0.1);
    padding:12px;
    box-shadow:var(--shadow-md);
    z-index:9996;
    min-width:200px;
    transform:translateY(-10px);
    opacity:0;
    pointer-events:none;
    transition:transform var(--anim-smooth), opacity var(--anim-smooth);
}

.tm-settings-panel.active{
    transform:translateY(0);
    opacity:1;
    pointer-events:auto;
}
.tm-settings-option{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:10px;
    border-radius:var(--shadcn-radius-sm);
    margin-bottom:8px;
    transition:background-color var(--anim-quick);
}

.tm-settings-option:hover{
    background-color:hsla(var(--shadcn-muted) / 0.5);
}

.tm-settings-option:last-child{
    margin-bottom:0;
}

.tm-settings-label{
    font-family:var(--font-sans);
    font-size:14px;
    color:hsl(var(--shadcn-foreground));
}
.tm-toggle-switch{
    position:relative;
    display:inline-block;
    width:40px;
    height:24px;
}

.tm-toggle-switch input{
    opacity:0;
    width:0;
    height:0;
}

.tm-toggle-slider{
    position:absolute;
    cursor:pointer;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background-color:hsla(var(--shadcn-muted) / 0.7);
    border-radius:12px;
    transition:var(--anim-quick);
}

.tm-toggle-slider:before{
    position:absolute;
    content:"";
    height:20px;
    width:20px;
    left:2px;
    bottom:2px;
    background-color:hsl(var(--shadcn-foreground));
    border-radius:50%;
    transition:var(--anim-quick);
    box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);
}

.tm-toggle-slider.checked{
    background-color:hsl(var(--shadcn-blue));
}

.tm-toggle-slider.checked:before{
    transform:translateX(16px);
}
.tm-playback-rate-slider{
    display:flex;
    align-items:center;
    margin-left:0;
    height:var(--button-md);
    width:100%;
    background:hsl(var(--shadcn-card) / 0.85);
    border-radius:8px;
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
    position:relative;
    overflow:hidden;
    box-shadow:0 2px 8px rgba(0, 0, 0, 0.1);
    transition:box-shadow 0.3s ease, transform 0.2s ease;
    cursor:pointer;
}

.tm-playback-rate-slider:hover{
    box-shadow:0 4px 12px rgba(0, 0, 0, 0.15);
    transform:translateY(-1px);
}

.tm-playback-rate-slider.dragging{
    box-shadow:var(--shadow-md);
    background:hsla(var(--shadcn-card) / 0.9);
}

.tm-slider-container{
    width:100%;
    height:100%;
    background:hsla(var(--shadcn-secondary) / 0.8);
    position:relative;
    overflow:hidden;
    display:flex;
    align-items:center;
}

.tm-slider-level{
    position:absolute;
    top:0;
    left:0;
    height:100%;
    background:hsl(0 0% 50% / 1);
    width:50%;
    transform-origin:left;
    transition:width 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index:1;
}

.tm-slider-text{
    display:flex;
    justify-content:space-between;
    width:100%;
    padding:0 12px;
    z-index:2;
    position:relative;
}

.tm-speed-label{
    color:hsl(var(--shadcn-muted-foreground));
    font-size:13px;
    font-weight:500;
    transition:color 0.3s ease;
}

.tm-speed-value{
    color:hsl(var(--shadcn-foreground));
    font-size:13px;
    font-weight:600;
    font-variant-numeric:tabular-nums;
}
.tm-speed-label{
    color:hsl(var(--shadcn-muted-foreground));
    font-size:13px;
    font-weight:400;
    transition:color var(--anim-quick);
}

.tm-playback-rate-slider:hover .tm-speed-label{
    color:hsl(var(--shadcn-foreground));
}

.tm-speed-value{
    color:hsl(var(--shadcn-foreground));
    font-size:13px;
    font-weight:600;
    font-variant-numeric:tabular-nums;
}
.tm-speed-value.fast{
    color:hsl(var(--shadcn-orange));
}

.tm-speed-value.slow{
    color:hsl(var(--shadcn-blue));
}

.tm-speed-value.normal{
    color:hsl(var(--shadcn-foreground));
}
.tm-progress-controls{
    position:relative;
    width:100%;
    bottom:0;
    left:0;
    right:0;
    display:flex;
    flex-direction:column;
    z-index:9991;
    border-radius:0 0 var(--shadcn-radius-lg) var(--shadcn-radius-lg);
    font-family:var(--font-sans);
    transition:opacity var(--anim-smooth);
}
.tm-progress-bar-container{
    position:relative;
    height:12px;
    display:flex;
    align-items:center;
    cursor:pointer;
    user-select:none;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    touch-action:none;
}
.tm-progress-bar{
    width:100%;
    height:8px;
    background-color:hsla(var(--shadcn-muted) / 0.5);
    border-radius:8px;
    overflow:hidden;
    position:relative;
    transition:height 0.15s;
}

.tm-progress-bar:hover{
    height:6px;
}
.tm-progress-bar-expanded{
    height:16px !important;
}

.tm-progress-bar-normal{
    height:8px !important;
}
.tm-progress-bar.tm-dragging{
    height:16px !important;
    background-color:hsla(var(--shadcn-muted-foreground) / 0.7);
    cursor:grabbing;
}
.tm-progress-bar-container:has(.tm-dragging){
    cursor:grabbing;
}
.tm-progress-indicator{
    height:100%;
    width:0%;
    background-color:hsla(var(--shadcn-muted) / 0.8);
    border-radius:0;
    position:absolute;
    left:0;
    top:0;
    transition:width 0.1s linear;
    overflow:hidden;
}
.tm-dragging .tm-progress-indicator{
    background-color:hsl(var(--shadcn-card-foreground));
    box-shadow:none;
    transition:none;
}
.tm-progress-bar{
    overflow:hidden;
}
.tm-progress-handle{
    width:12px;
    height:12px;
    background-color:hsl(var(--shadcn-blue));
    border:2px solid hsl(var(--shadcn-card));
    border-radius:50%;
    position:absolute;
    top:50%;
    left:0%;
    transform:translate(0, -50%);
    z-index:2;
    opacity:1;
    transition:opacity 0.15s, width 0.15s, height 0.15s, box-shadow 0.15s;
    box-shadow:0 0 0 4px hsl(var(--shadcn-blue) / 0.2);
    cursor:grab;
}

.tm-progress-handle:hover,
.tm-progress-handle.dragging{
    transform:translate(0, -50%) scale(1.1);
    box-shadow:0 0 0 6px hsl(var(--shadcn-blue) / 0.3);
}
.tm-loop-marker{
    position:absolute;
    width:4px;
    height:100%;
    top:0;
    transform:translateX(-50%);
    z-index:3;
    transition:opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
}
.tm-loop-start-marker{
    background-color:hsla(var(--shadcn-green) / 0.5);
    border-radius:2px;
    box-shadow:0 0 6px hsla(var(--shadcn-green) / 0.3);
}
.tm-loop-end-marker{
    background-color:hsla(var(--shadcn-orange) / 0.5);
    border-radius:2px;
    box-shadow:0 0 6px hsla(var(--shadcn-orange) / 0.3);
}
.tm-loop-marker:hover{
    cursor:pointer;
    z-index:4;
}

.tm-loop-start-marker:hover{
    background-color:hsla(var(--shadcn-green) / 0.7);
    box-shadow:0 0 10px hsla(var(--shadcn-green) / 0.5);
}

.tm-loop-end-marker:hover{
    background-color:hsla(var(--shadcn-orange) / 0.7);
    box-shadow:0 0 10px hsla(var(--shadcn-orange) / 0.5);
}
.tm-loop-marker.active{
    opacity:1;
}

.tm-loop-marker:not(.active){
    opacity:0.7;
}
.tm-loop-marker::before{
    content:attr(data-label);
    position:absolute;
    top:-24px;
    left:50%;
    transform:translateX(-50%);
    background-color:hsla(var(--shadcn-card) / 0.7);
    color:hsl(var(--shadcn-card-foreground));
    font-size:10px;
    font-weight:600;
    padding:2px 8px;
    border-radius:10px;
    opacity:0;
    transition:opacity 0.2s ease, transform 0.2s ease;
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
    box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);
    border:1px solid hsla(var(--shadcn-border) / 0.1);
    white-space:nowrap;
    z-index:5;
}

.tm-loop-start-marker::before{
    content:"循环起点";
}

.tm-loop-end-marker::before{
    content:"循环终点";
}

.tm-loop-marker:hover::before{
    opacity:1;
    transform:translateX(-50%) translateY(-4px);
}
.tm-start-time-container-hover{
    background-color:hsl(var(--shadcn-green) / 0.1);
    border-color:hsl(var(--shadcn-green) / 0.3);
}

.tm-start-time-container-default{
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    border-color:hsl(var(--shadcn-border) / 0.1);
}

.tm-end-time-container-hover{
    background-color:hsl(var(--shadcn-orange) / 0.1);
    border-color:hsl(var(--shadcn-orange) / 0.3);
}

.tm-end-time-container-default{
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    border-color:hsl(var(--shadcn-border) / 0.1);
}
.tm-loop-button-hover{
    background-color:hsl(var(--shadcn-accent) / 0.3);
    transform:translateY(-1px);
}

.tm-loop-button-active{
    background-color:hsl(var(--shadcn-muted) / 0.7);
}

.tm-loop-button-default{
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    transform:translateY(0);
}
.tm-indicator-base{
    position:absolute;
    padding:8px 16px;
    background-color:hsla(var(--shadcn-card) / 0.6);
    color:hsl(var(--shadcn-card-foreground));
    border-radius:var(--shadcn-radius);
    opacity:0;
    backdrop-filter:blur(15px);
    -webkit-backdrop-filter:blur(15px);
    box-shadow:var(--shadow-md);
    border:1px solid hsla(var(--shadcn-border) / 0.1);
    transform:translateY(20px);
    transition:opacity var(--anim-smooth), transform var(--anim-smooth);
    pointer-events:none;
    z-index:9994;
    font-size:15px;
    font-weight:500;
}

.tm-indicator-base.visible{
    opacity:1;
    transform:translateY(0);
    pointer-events:auto;
}
.tm-pause-indicator{
    width:80px;
    height:80px;
}
.tm-playback-rate-indicator{
    top:30%;
    border-radius:var(--shadcn-radius);
    padding:10px 16px;
    font-size:16px;
    font-weight:bold;
}
.tm-progress-row{
    display:flex;
    flex-direction:column;
    width:100%;
    box-sizing:border-box;
}

.tm-seek-control-row{
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    width:100%;
    box-sizing:border-box;
}

.tm-loop-control-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    width:100%;
    box-sizing:border-box;
    position:relative;
}

.tm-playback-control-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    position:relative;
    width:100%;
}
.tm-left-controls, .tm-center-controls, .tm-right-controls{
    flex:1;
    display:flex;
}

.tm-left-controls{
    justify-content:flex-start;
}

.tm-center-controls{
    justify-content:center;
}

.tm-right-controls{
    justify-content:flex-end;
}
.tm-time-display{
    display:flex;
    justify-content:space-between;
    color:hsl(var(--shadcn-foreground) / 0.9);
    font-size:12px;
    margin-top:-2px;
    font-variant-numeric:tabular-nums;
    gap:8px;
}

.tm-time-display-container{
    display:flex;
    justify-content:space-between;
    width:100%;
    padding:0px 1px;
    margin-bottom:4px;
}

.tm-current-time, .tm-total-duration{
    color:hsl(var(--shadcn-card-foreground) / 0.9);
    font-size:0.8rem;
    min-width:60px;
    font-variant-numeric:tabular-nums;
    font-weight:400;
    line-height:1;
}

.tm-current-time{
    text-align:left;
}

.tm-total-duration{
    text-align:right;
}

.tm-loop-control{
    display:flex;
    align-items:center;
    gap:6px;
}

.tm-start-time-container, .tm-end-time-container{
    display:flex;
    align-items:center;
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    border:1px solid hsl(var(--shadcn-border) / 0.1);
    border-radius:6px;
    padding:4px 4px;
    cursor:pointer;
    transition:all 0.2s ease;
}
.tm-start-time-container:hover{
    background-color:hsl(var(--shadcn-green) / 0.1);
    border-color:hsl(var(--shadcn-green) / 0.3);
    transform:translateY(-1px);
}

.tm-end-time-container:hover{
    background-color:hsl(var(--shadcn-orange) / 0.1);
    border-color:hsl(var(--shadcn-orange) / 0.3);
    transform:translateY(-1px);
}

.tm-set-loop-start-label, .tm-set-loop-end-label{
    font-size:1rem;
    font-weight:600;
    padding:0px 4px;
    display:flex;
    align-items:center;
    justify-content:center;
}
.tm-set-loop-start-label{
    color:hsl(var(--shadcn-green));
}
.tm-set-loop-end-label{
    color:hsl(var(--shadcn-orange));
}

.tm-loop-toggle-button{
    display:flex;
    align-items:center;
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    border:1px solid hsl(var(--shadcn-border) / 0.1);
    border-radius:6px;
    padding:4px 8px;
    font-size:0.875rem;
    cursor:pointer;
    transition:all 0.2s ease;
    font-weight:500;
    gap:6px;
    color:hsl(var(--shadcn-foreground));
}
.tm-loop-toggle-label{
    font-size:1rem;
    font-weight:600;
    padding:0px 4px;
    display:flex;
    align-items:center;
    justify-content:center;
    color:hsl(var(--shadcn-muted-foreground) / 0.9);
    transition:color 0.2s ease;
}
.tm-loop-toggle-label.active{
    color:hsl(var(--shadcn-red));
}
.tm-loop-toggle-button.active{
    background-color:hsl(var(--shadcn-red) / 0.1);
    border-color:hsl(var(--shadcn-red) / 0.3);
}

.tm-loop-toggle-button:not(.active){
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    border-color:hsl(var(--shadcn-border) / 0.1);
}


.tm-loop-toggle-button:active{
    transform:scale(0.98);
}

.tm-loop-indicator-circle{
    transition:fill 0.2s ease;
}


.tm-loop-toggle-button.active .tm-loop-indicator-circle{
    fill:hsl(var(--shadcn-red));
}
.tm-rewind-group, .tm-forward-group{
    display:flex;
    flex-direction:column;
    width:50%;
    gap:8px;
    align-items:center;
}

.tm-rewind-buttons-container{
    display:flex;
    flex-direction:row-reverse;
    flex-wrap:wrap;
    width:100%;
    justify-content:flex-end;
    align-content:flex-start;
    gap:6px;
}

.tm-forward-buttons-container{
    display:flex;
    flex-direction:row;
    flex-wrap:wrap;
    width:100%;
    justify-content:flex-end;
    align-content:flex-start;
    gap:6px;
}
.tm-loop-start-position, .tm-loop-end-position{
    color:hsl(var(--shadcn-muted-foreground));
    font-size:0.875rem;
    min-width:70px;
    text-align:center;
    display:inline-block;
    font-variant-numeric:tabular-nums;
}
.tm-time-control-button{
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    color:hsl(var(--shadcn-secondary-foreground));
    border:1px solid hsl(var(--shadcn-border) / 0.1);
    border-radius:var(--shadcn-radius-sm);
    padding:0;
    font-size:0.75rem;
    cursor:pointer;
    transition:all 0.2s cubic-bezier(.25,.8,.25,1);
    white-space:nowrap;
    font-weight:500;
    box-shadow:0 1px 2px rgba(0,0,0,0.05);
    width:var(--button-xl);
    height:var(--button-lg);
    display:flex;
    align-items:center;
    justify-content:center;
    flex:0 0 auto;
}

.tm-time-control-button:hover{
    background-color:hsl(var(--shadcn-accent) / 0.6);
    transform:translateY(-1px);
    box-shadow:0 2px 4px rgba(0,0,0,0.1);
}

.tm-time-control-button:active{
    transform:scale(0.95);
    box-shadow:none;
}

.tm-time-control-button-active{
    transform:scale(0.95);
    box-shadow:none;
}

.tm-time-control-button-after-active{
    transform:none;
    box-shadow:0 2px 5px rgba(0, 0, 0, 0.15);
}

.tm-time-control-button-inner{
    display:flex;
    align-items:center;
    justify-content:center;
}

.tm-rewind-icon{
    margin-right:-2px;
}

.tm-forward-icon{
    margin-left:-2px;
}

.tm-time-text-margin-left{
    margin-left:2px;
}

.tm-time-text-margin-right{
    margin-right:2px;
}
.tm-control-button-hover{
    background-color:hsl(var(--shadcn-accent) / 0.3);
    transform:none;
}

.tm-control-button-default{
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    transform:none;
}
.tm-control-buttons{
    position:absolute;
    bottom:calc(10px + env(safe-area-inset-bottom, 0px));
    left:50%;
    transform:translateX(-50%);
    width:95%;
    max-width:700px;
    min-width:350px;
    background-color:hsla(var(--shadcn-card) / 0.8);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
    z-index:9991;
    padding:12px;
    padding-bottom:12px;
    border-radius:12px;
    border:1px solid hsla(var(--shadcn-border) / 0.1);
    box-shadow:0 2px 10px rgba(0, 0, 0, 0.2);
    transition:opacity 0.3s ease, transform 0.3s ease;
    gap:10px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
}
body.controls-hidden .tm-player-container .tm-control-buttons{
    opacity:0;
    transform:translateX(-50%) translateY(20px);
    pointer-events:none;
}
body:not(.controls-hidden) .tm-player-container .tm-control-buttons{
    opacity:1;
    transform:translateX(-50%) translateY(0);
    pointer-events:auto;
}
body.controls-hidden .tm-player-container .tm-button-container{
    opacity:0;
    transform:translateY(-20px);
    pointer-events:none;
}
body:not(.controls-hidden) .tm-player-container .tm-button-container{
    opacity:1;
    transform:translateY(0);
    pointer-events:auto;
}
.tm-control-button{
    position:relative;
    width:var(--button-md);
    height:var(--button-md);
    border-radius:calc(var(--button-md) / 2);
    background-color:hsla(var(--shadcn-secondary) / 0.6);
    color:hsl(var(--shadcn-secondary-foreground));
    border:1px solid hsla(var(--shadcn-border) / 0.1);
    display:flex;
    align-items:center;
    justify-content:center;
    cursor:pointer;
    transition:all var(--anim-quick);
}

.tm-control-button:hover{
    background-color:hsla(var(--shadcn-accent) / 0.7);
    transform:translateY(-2px);
    box-shadow:var(--shadow-sm);
}

.tm-control-button:active{
    transform:scale(0.95);
    box-shadow:none;
}

.tm-control-button.active{
    background-color:hsla(var(--shadcn-blue) / 0.7);
    color:hsl(var(--shadcn-blue-foreground));
    box-shadow:0 0 0 2px hsla(var(--shadcn-blue) / 0.3);
}

.tm-control-button svg,
.tm-control-button img{
    width:16px;
    height:16px;
}
.tm-control-row{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:8px;
    margin-top:4px;
    opacity:1;
    transition:opacity var(--anim-quick), height var(--anim-quick);
    height:auto;
    overflow:hidden;
}

.tm-control-row.hidden{
    opacity:0;
    height:0;
    margin:0;
}
.tm-time-control-button-hover{
    background-color:hsl(var(--shadcn-accent) / 0.6);
    transform:none;
    box-shadow:0 2px 4px rgba(0,0,0,0.1);
}

.tm-time-control-button-active{
    transform:scale(0.95);
    box-shadow:none;
}

.tm-time-control-button-default{
    transform:translateY(0);
    box-shadow:0 1px 2px rgba(0,0,0,0.05);
}

.tm-time-control-button-after-active{
    transform:none;
    box-shadow:0 2px 5px rgba(0, 0, 0, 0.15);
}
@media screen and (orientation: landscape){
    .tm-video-container{
        width:100%;
        height:100vh !important;
        max-height:100vh !important;
        min-height:auto !important;
        margin:0;
        padding:0;
        padding-left:env(safe-area-inset-left, 16px);
        padding-right:env(safe-area-inset-right, 16px);
        border-radius:0;
        box-shadow:none;
        display:flex;
        justify-content:center;
        align-items:center;
        background-color:black;
    }
    .tm-video-wrapper{
        width:100%;
        height:100%;
        border-radius:0;
        display:flex;
        justify-content:center;
        align-items:center;
        overflow:hidden;
    }
    .tm-video-wrapper video{
        width:100% !important;
        height:auto !important;
        max-height:100vh !important;
        object-fit:contain !important;
    }
    .tm-video-wrapper.video-portrait video{
        width:auto !important;
        height:100% !important;
        max-width:100% !important;
    }
    .tm-button-container{
        position:absolute;
        top:0;
        left:0;
        right:0;
        z-index:9995;
        background-color:transparent;
        padding:16px;
        padding-top:calc(env(safe-area-inset-top, 8px) + 8px);
        display:flex;
        justify-content:space-between;
        transition:opacity 0.3s ease, transform 0.3s ease;
    }
    .tm-video-overlay.controls-hidden .tm-button-container{
        opacity:0;
        transform:translateY(-20px);
        pointer-events:none;
    }
    .tm-video-overlay .tm-button-container{
        opacity:1;
        transform:translateY(0);
        pointer-events:auto;
    }
    .tm-settings-button{
        display:flex;
        background-color:hsla(var(--shadcn-secondary) / 0.3);
        backdrop-filter:blur(4px);
        -webkit-backdrop-filter:blur(4px);
    }
    .tm-close-button{
        background-color:hsla(var(--shadcn-secondary) / 0.3);
        backdrop-filter:blur(4px);
        -webkit-backdrop-filter:blur(4px);
    }
    .tm-control-buttons{
        position:absolute;
        bottom:calc(10px + env(safe-area-inset-bottom, 0px));
        left:50%;
        transform:translateX(-50%);
        width:90%;
        max-width:700px;
        min-width:350px;
        background-color:hsla(var(--shadcn-card) / 0.3);
        backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);
        z-index:9994;
        padding:12px;
        padding-bottom:12px;
        border-radius:12px;
        border:1px solid hsla(var(--shadcn-border) / 0.1);
        box-shadow:0 2px 10px rgba(0, 0, 0, 0.2);
        transition:opacity 0.3s ease, transform 0.3s ease;
    }
    .tm-video-overlay.controls-hidden .tm-control-buttons{
        opacity:0;
        transform:translateX(-50%) translateY(20px);
        pointer-events:none;
    }
    .tm-video-overlay .tm-control-buttons{
        opacity:1;
        transform:translateX(-50%) translateY(0);
        pointer-events:auto;
    }
    .tm-video-overlay{
        background-color:black;
        backdrop-filter:none;
        -webkit-backdrop-filter:none;
    }
    .tm-floating-button{
        bottom:30px;
        left:50%;
        transform:translateX(-50%);
        padding:0;
        width:calc(var(--button-xl));
        height:calc(var(--button-xl));
    }
}
.tm-time-indicator{
    position:absolute;
    background-color:hsla(var(--shadcn-card) / 0.8);
    color:hsl(var(--shadcn-card-foreground));
    padding:4px 8px;
    border-radius:4px;
    font-size:12px;
    font-weight:500;
    pointer-events:none;
    z-index:9995;
    opacity:0;
    transform:translateY(-8px);
    transition:opacity 0.2s, transform 0.2s;
    box-shadow:0 2px 8px rgba(0, 0, 0, 0.2);
    border:1px solid hsla(var(--shadcn-border) / 0.1);
    backdrop-filter:blur(8px);
    -webkit-backdrop-filter:blur(8px);
}
.tm-start-time-container.active{
    background-color:hsl(var(--shadcn-green) / 0.15);
    border-color:hsl(var(--shadcn-green) / 0.4);
}

.tm-start-time-container:not(.active){
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    border-color:hsl(var(--shadcn-border) / 0.1);
}
.tm-end-time-container.active{
    background-color:hsl(var(--shadcn-orange) / 0.15);
    border-color:hsl(var(--shadcn-orange) / 0.4);
}

.tm-end-time-container:not(.active){
    background-color:hsl(var(--shadcn-secondary) / 0.5);
    border-color:hsl(var(--shadcn-border) / 0.1);
}
.tm-set-loop-start-label.active{
    color:hsl(var(--shadcn-green));
    opacity:1;
}

.tm-set-loop-start-label:not(.active){
    opacity:0.9;
}
.tm-set-loop-end-label.active{
    color:hsl(var(--shadcn-orange));
    opacity:1;
}

.tm-set-loop-end-label:not(.active){
    opacity:0.9;
}
.tm-loop-start-position.active, .tm-loop-end-position.active{
    color:hsl(var(--shadcn-foreground));
    opacity:1;
}

.tm-loop-start-position:not(.active), .tm-loop-end-position:not(.active){
    color:hsl(var(--shadcn-muted-foreground));
    opacity:0.9;
}
.tm-loop-toggle-button.active{
    background-color:hsl(var(--shadcn-red) / 0.1);
    border-color:hsl(var(--shadcn-red) / 0.3);
}


.tm-loop-toggle-button:active{
    transform:scale(0.98);
}
.tm-loop-range{
    position:absolute;
    height:4px;
    background:linear-gradient(90deg, 
        hsla(var(--shadcn-green) / 0.3) 0%, 
        hsla(var(--shadcn-orange) / 0.3) 100%);
    top:50%;
    transform:translateY(-50%);
    border-radius:2px;
    opacity:0;
    transition:opacity 0.3s ease;
    z-index:1;
    pointer-events:none;
}

.tm-loop-range.active{
    opacity:0.7;
    box-shadow:0 0 8px rgba(0, 0, 0, 0.1);
}
.tm-progress-bar-container:hover .tm-loop-range.active{
    opacity:0.9;
    height:6px;
}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 212:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(72);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(825);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(659);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(56);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(540);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(113);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(169);

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());
options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A, options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A && _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals ? _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_1_use_1_node_modules_postcss_loader_dist_cjs_js_ruleSet_1_rules_1_use_2_style_css__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .A.locals : undefined);


/***/ }),

/***/ 314:
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

/***/ 540:
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

/***/ 601:
/***/ ((module) => {



module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ 659:
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

/***/ 825:
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

// UNUSED EXPORTS: ModularVideoPlayer, UserExperienceEnhancer, Utils, VideoSwipeManager, default

;// ./src/constants/index.js
/**
 * 加载CSS样式
 */
function initCSSVariables() {
  // 直接导入 CSS 文件，webpack 会通过 style-loader 处理
  __webpack_require__(212);
}
;// ./src/utils/utils.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 工具类 - 通用功能函数集合
 */
var Utils = /*#__PURE__*/function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }
  return _createClass(Utils, null, [{
    key: "throttle",
    value:
    /**
     * 节流函数 - 限制函数执行频率
     * @param {Function} fn - 要执行的函数
     * @param {number} delay - 延迟时间(ms)
     * @returns {Function} - 节流后的函数
     */
    function throttle(fn) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
      var lastCall = 0;
      return function () {
        var now = Date.now();
        if (now - lastCall < delay) return;
        lastCall = now;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return fn.apply(this, args);
      };
    }

    /**
     * 防抖函数 - 延迟执行直到操作停止
     * @param {Function} fn - 要执行的函数
     * @param {number} delay - 延迟时间(ms)
     * @returns {Function} - 防抖后的函数
     */
  }, {
    key: "debounce",
    value: function debounce(fn) {
      var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
      var timer = null;
      return function () {
        var _this = this;
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(_this, args);
          timer = null;
        }, delay);
      };
    }

    /**
     * 检测是否为iOS设备
     * @returns {boolean} - 是否为iOS设备
     */
  }, {
    key: "isIOS",
    value: function isIOS() {
      if (this._cache.isIOS === null) {
        this._cache.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      }
      return this._cache.isIOS;
    }

    /**
     * 检测是否为Safari浏览器
     * @returns {boolean} - 是否为Safari浏览器
     */
  }, {
    key: "isSafari",
    value: function isSafari() {
      return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

    /**
     * 检测是否为竖屏模式
     * @returns {boolean} - 是否为竖屏模式
     */
  }, {
    key: "isPortrait",
    value: function isPortrait() {
      return window.innerHeight > window.innerWidth;
    }

    /**
     * 检查设备和屏幕方向
     * @returns {boolean} - 当前是否为竖屏状态
     */
  }, {
    key: "checkDeviceAndOrientation",
    value: function checkDeviceAndOrientation() {
      return this.isPortrait();
    }

    /**
     * 获取设备安全区域尺寸
     * @returns {Object} - 安全区域尺寸 {top, right, bottom, left}
     */
  }, {
    key: "getSafeAreaInsets",
    value: function getSafeAreaInsets() {
      var defaultTopInset = 44; // 默认顶部安全区域
      var defaultBottomInset = 34; // 默认底部安全区域
      var defaultSideInset = 16; // 默认左右安全区域

      var style = window.getComputedStyle(document.documentElement);
      return {
        top: parseInt(style.getPropertyValue('--sat') || style.getPropertyValue('--safe-area-inset-top') || '0', 10) || defaultTopInset,
        right: parseInt(style.getPropertyValue('--sar') || style.getPropertyValue('--safe-area-inset-right') || '0', 10) || defaultSideInset,
        bottom: parseInt(style.getPropertyValue('--sab') || style.getPropertyValue('--safe-area-inset-bottom') || '0', 10) || defaultBottomInset,
        left: parseInt(style.getPropertyValue('--sal') || style.getPropertyValue('--safe-area-inset-left') || '0', 10) || defaultSideInset
      };
    }

    /**
     * 创建带样式的HTML元素
     * @param {string} tag - HTML标签名
     * @param {string} className - CSS类名
     * @param {string} style - 内联样式
     * @returns {HTMLElement} - 创建的元素
     */
  }, {
    key: "createElementWithStyle",
    value: function createElementWithStyle(tag, className, style) {
      var element = document.createElement(tag);
      if (className) element.className = className;
      if (style) element.style.cssText = style;
      return element;
    }

    /**
     * 创建SVG图标
     * @param {string} path - SVG路径
     * @param {number} size - 图标大小
     * @returns {SVGElement} - SVG图标元素
     */
  }, {
    key: "createSVGIcon",
    value: function createSVGIcon(path) {
      var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 24;
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      var pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('d', path);
      svg.appendChild(pathElement);
      return svg;
    }

    /**
     * 检测页面中是否存在视频元素
     * @returns {HTMLVideoElement|null} - 找到的视频元素或null
     */
  }, {
    key: "findVideoElement",
    value: function findVideoElement() {
      // 常见视频选择器
      var specificSelectors = ['#player video',
      // 常见ID
      '#video video',
      // 常见ID
      'div.plyr__video-wrapper video',
      // Plyr
      '.video-js video',
      // Video.js
      '#player > video',
      // 直接子元素
      '#video-player > video',
      // 另一个常见ID
      'video[preload]:not([muted])',
      // 可能是主要内容的视频
      'video[src]',
      // 带有src属性的视频
      'video.video-main',
      // 主视频类
      'main video',
      // 主要内容区域中的视频
      'video' // 所有视频（最低优先级）
      ];

      // 按优先级顺序查找视频元素
      for (var _i = 0, _specificSelectors = specificSelectors; _i < _specificSelectors.length; _i++) {
        var selector = _specificSelectors[_i];
        var videos = document.querySelectorAll(selector);
        if (videos.length > 0) {
          console.log("[Utils] \u627E\u5230\u89C6\u9891\u5143\u7D20\uFF1A".concat(selector));
          return videos[0]; // 返回第一个匹配的视频元素
        }
      }
      return null; // 未找到视频元素
    }

    /**
     * 格式化时间为 mm:ss 或 hh:mm:ss
     * @param {number} seconds - 秒数
     * @returns {string} - 格式化后的时间字符串
     */
  }, {
    key: "formatTime",
    value: function formatTime(seconds) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor(seconds % 3600 / 60);
      var secs = Math.floor(seconds % 60);
      if (hours > 0) {
        return "".concat(hours, ":").concat(minutes < 10 ? '0' : '').concat(minutes, ":").concat(secs < 10 ? '0' : '').concat(secs);
      }
      return "".concat(minutes, ":").concat(secs < 10 ? '0' : '').concat(secs);
    }

    /**
     * 设置或更新Safari的主题色
     * @param {string} color - 主题色
     * @param {boolean} saveOriginal - 是否保存原始颜色值
     */
  }, {
    key: "updateSafariThemeColor",
    value: function updateSafariThemeColor() {
      var color = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '#000000';
      var saveOriginal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // 仅在Safari浏览器中执行
      if (!this.isSafari() && !this.isIOS()) return;

      // 获取当前主题色标签
      var metaThemeColor = document.querySelector('meta[name="theme-color"]');

      // 保存原始颜色值（如果需要）
      if (saveOriginal && metaThemeColor && !this._theme.original.dark) {
        this._theme.original.dark = metaThemeColor.content;
      }

      // 如果标签不存在，创建新标签
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
      }

      // 设置颜色值
      metaThemeColor.content = color;
    }

    /**
     * 恢复Safari的原始主题色
     */
  }, {
    key: "restoreSafariThemeColor",
    value: function restoreSafariThemeColor() {
      // 仅在有保存的原始颜色时恢复
      if (this._theme.original.dark) {
        this.updateSafariThemeColor(this._theme.original.dark);
      } else {
        // 如果没有原始颜色，移除主题色标签
        var metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor && metaThemeColor.parentNode) {
          metaThemeColor.parentNode.removeChild(metaThemeColor);
        }
      }
    }
  }]);
}();
// 缓存常用的检测结果
_defineProperty(Utils, "_cache", {
  isIOS: null,
  safeAreaInsets: null,
  lastOrientation: null
});
// 主题颜色相关
_defineProperty(Utils, "_theme", {
  original: {
    light: null,
    dark: null
  }
});
;// ./src/player/core/PlayerCore.js
function PlayerCore_typeof(o) { "@babel/helpers - typeof"; return PlayerCore_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, PlayerCore_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { PlayerCore_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function PlayerCore_defineProperty(e, r, t) { return (r = PlayerCore_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function PlayerCore_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function PlayerCore_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, PlayerCore_toPropertyKey(o.key), o); } }
function PlayerCore_createClass(e, r, t) { return r && PlayerCore_defineProperties(e.prototype, r), t && PlayerCore_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function PlayerCore_toPropertyKey(t) { var i = PlayerCore_toPrimitive(t, "string"); return "symbol" == PlayerCore_typeof(i) ? i : i + ""; }
function PlayerCore_toPrimitive(t, r) { if ("object" != PlayerCore_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != PlayerCore_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * 播放器核心类 - 负责播放器的基本功能和状态管理
 */
var PlayerCore = /*#__PURE__*/function () {
  function PlayerCore() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    PlayerCore_classCallCheck(this, PlayerCore);
    console.log('[PlayerCore] 初始化...');

    // 常量定义
    this.defaultPlaybackRate = 1.0; // 默认播放速度

    // 状态变量
    this.targetVideo = null; // 目标视频元素
    this.videoState = {
      currentTime: 0,
      isPlaying: false,
      volume: 1,
      playbackRate: 1
    };

    // 配置和选项
    this.options = Object.assign({
      containerId: 'tm-video-container',
      startLooped: false,
      startMuted: false
    }, options);

    // 保存调用按钮
    this.callingButton = this.options.callingButton || null;

    // 状态标记
    this.initialized = false;
  }

  /**
   * 初始化播放器
   */
  return PlayerCore_createClass(PlayerCore, [{
    key: "init",
    value: function init() {
      if (this.initialized) return;

      // 清理可能存在的旧overlay
      this.cleanupExistingOverlays();

      // 查找目标视频
      this.targetVideo = this.findTargetVideo();
      if (!this.targetVideo) {
        console.error('[PlayerCore] 未找到视频元素');
        // 如果是从浮动按钮调用的，则重新显示按钮
        if (this.callingButton) {
          this.callingButton.style.display = 'flex';
        }
        return;
      }

      // 保存视频状态
      this.saveVideoState();

      // 初始化完成标记
      this.initialized = true;
      console.log('[PlayerCore] 核心初始化完成');
      return this.targetVideo;
    }

    /**
     * 清理可能存在的旧overlay元素
     */
  }, {
    key: "cleanupExistingOverlays",
    value: function cleanupExistingOverlays() {
      // 查找所有现有的overlay元素
      var existingOverlays = document.querySelectorAll('.tm-video-overlay');
      if (existingOverlays.length > 0) {
        console.log("[PlayerCore] \u6E05\u7406 ".concat(existingOverlays.length, " \u4E2A\u73B0\u6709overlay\u5143\u7D20"));
        existingOverlays.forEach(function (overlay) {
          if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        });
      }
    }

    /**
     * 查找页面中的视频元素
     * @returns {HTMLVideoElement|null} 找到的视频元素或null
     */
  }, {
    key: "findTargetVideo",
    value: function findTargetVideo() {
      var potentialVideo = null;

      // --- Strategy 1: Specific known selectors ---
      var specificSelectors = ['#player video',
      // Common ID
      '#video video',
      // Common ID
      'div.plyr__video-wrapper video',
      // Plyr
      '.video-js video',
      // Video.js
      '#player > video',
      // Direct child
      '#video-player > video',
      // Another common ID
      'video[preload]:not([muted])' // Videos likely to be main content
      ];
      for (var _i = 0, _specificSelectors = specificSelectors; _i < _specificSelectors.length; _i++) {
        var selector = _specificSelectors[_i];
        potentialVideo = document.querySelector(selector);
        if (potentialVideo) {
          console.log('[PlayerCore] 通过选择器找到视频:', selector);
          return potentialVideo;
        }
      }

      // --- Strategy 2: Find all videos and prioritize ---
      var allVideos = Array.from(document.querySelectorAll('video'));
      console.log('[PlayerCore] 找到视频元素数量:', allVideos.length);
      if (allVideos.length === 0) {
        console.log('[PlayerCore] 未找到视频元素');
        return null;
      }
      if (allVideos.length === 1) {
        console.log('[PlayerCore] 找到单个视频元素');
        return allVideos[0];
      }

      // Filter out potentially hidden or invalid videos and calculate area
      var visibleVideos = allVideos.map(function (video) {
        return {
          element: video,
          rect: video.getBoundingClientRect()
        };
      }).filter(function (item) {
        return item.rect.width > 50 && item.rect.height > 50;
      }) // Basic visibility/size check
      .map(function (item) {
        return _objectSpread(_objectSpread({}, item), {}, {
          area: item.rect.width * item.rect.height
        });
      }).sort(function (a, b) {
        return b.area - a.area;
      }); // Sort by area descending

      if (visibleVideos.length > 0) {
        console.log('[PlayerCore] 选择最大的可见视频');
        return visibleVideos[0].element;
      }

      // --- Strategy 3: Fallback to first video if filtering fails ---
      console.log('[PlayerCore] 回退到第一个视频元素');
      return allVideos[0];
    }

    /**
     * 保存视频状态
     */
  }, {
    key: "saveVideoState",
    value: function saveVideoState() {
      if (!this.targetVideo) return;
      this.originalParent = this.targetVideo.parentNode;
      this.originalIndex = Array.from(this.originalParent.children).indexOf(this.targetVideo);
      this.videoState = {
        currentTime: this.targetVideo.currentTime,
        isPaused: this.targetVideo.paused,
        videoSrc: this.targetVideo.src,
        posterSrc: this.targetVideo.poster,
        wasMuted: this.targetVideo.muted,
        controls: this.targetVideo.controls // 保存原始控制组件状态
      };
    }

    /**
     * 恢复视频状态
     */
  }, {
    key: "restoreVideoState",
    value: function restoreVideoState() {
      try {
        // 设置默认播放速度
        this.targetVideo.playbackRate = this.defaultPlaybackRate;

        // 恢复播放位置
        this.targetVideo.currentTime = this.videoState.currentTime;

        // 尝试播放视频
        var playPromise = this.targetVideo.play();
        if (playPromise !== undefined) {
          playPromise["catch"](function (error) {
            console.log('视频自动播放被阻止: ', error);
            // 不再尝试静音播放，保持暂停状态
            // 可以考虑在这里添加一个UI提示，告知用户手动点击播放按钮
          });
        }
      } catch (e) {
        console.error('尝试播放时出错: ', e);
      }
    }

    /**
     * 关闭播放器并恢复原始视频
     */
  }, {
    key: "close",
    value: function close(overlay, container, playerContainer) {
      if (!overlay) return;

      // 保存当前视频状态以便下次打开
      this.videoState.currentTime = this.targetVideo.currentTime;
      this.videoState.isPlaying = !this.targetVideo.paused;
      this.videoState.volume = this.targetVideo.volume;
      this.videoState.playbackRate = this.targetVideo.playbackRate;

      // 如果视频正在播放，暂停它
      if (!this.targetVideo.paused) {
        this.targetVideo.pause();
      }

      // 恢复原始的视频样式
      if (this.originalParent && this.targetVideo && this.targetVideo.parentNode) {
        if (this.targetVideo.parentNode !== this.originalParent) {
          // 移动回原始位置
          if (this.originalIndex !== -1 && this.originalParent.childNodes.length > this.originalIndex) {
            this.originalParent.insertBefore(this.targetVideo, this.originalParent.childNodes[this.originalIndex]);
          } else {
            this.originalParent.appendChild(this.targetVideo);
          }

          // 移除自定义样式
          this.targetVideo.style.width = '';
          this.targetVideo.style.height = '';
          this.targetVideo.style.maxHeight = '';
          this.targetVideo.style.margin = '';
          this.targetVideo.style.position = '';
        }
      }

      // 移除叠加层
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }

      // 移除播放器容器
      if (playerContainer && playerContainer.parentNode) {
        playerContainer.parentNode.removeChild(playerContainer);
      }

      // 移除body上的控制状态类
      document.body.classList.remove('controls-hidden');

      // 如果添加了全屏切换样式，移除它
      var fullscreenStyle = document.getElementById('tm-fullscreen-style');
      if (fullscreenStyle) {
        fullscreenStyle.parentNode.removeChild(fullscreenStyle);
      }

      // 重置状态
      this.initialized = false;

      // 恢复Safari主题色
      Utils.restoreSafariThemeColor();

      // 如果是从浮动按钮调用的，则重新显示按钮
      if (this.callingButton) {
        this.callingButton.style.display = 'flex';
      }
    }
  }]);
}();
;// ./src/player/ui/UIManager.js
function UIManager_typeof(o) { "@babel/helpers - typeof"; return UIManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, UIManager_typeof(o); }
function UIManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function UIManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, UIManager_toPropertyKey(o.key), o); } }
function UIManager_createClass(e, r, t) { return r && UIManager_defineProperties(e.prototype, r), t && UIManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function UIManager_toPropertyKey(t) { var i = UIManager_toPrimitive(t, "string"); return "symbol" == UIManager_typeof(i) ? i : i + ""; }
function UIManager_toPrimitive(t, r) { if ("object" != UIManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != UIManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * UI管理器类 - 负责创建和管理播放器UI元素
 */
var UIManager = /*#__PURE__*/function () {
  function UIManager(playerCore) {
    UIManager_classCallCheck(this, UIManager);
    // 核心播放器引用
    this.playerCore = playerCore;
    this.targetVideo = playerCore.targetVideo;

    // UI 元素引用
    this.overlay = null; // 背景遮罩
    this.container = null; // 主容器
    this.playerContainer = null; // 播放器容器
    this.videoWrapper = null; // 视频包装器
    this.handleContainer = null; // 句柄容器
    this.handle = null; // 句柄元素
    this.closeBtn = null; // 关闭按钮
    this.settingsBtn = null; // 设置按钮
    this.settingsPanel = null; // 设置面板
    this.buttonContainer = null; // 按钮容器

    // 窗口和安全区
    this.safeArea = {
      top: 44,
      bottom: 34
    }; // 默认安全区域值

    // 屏幕方向状态
    this.isLandscape = false;

    // 控制界面状态
    this.controlsVisible = true;
    this.controlsHideTimeout = null;
    this.isMouseOverControls = false; // 鼠标是否在控制面板上

    // 导入样式
    this.loadStyles();
  }

  /**
   * 加载所需的样式文件
   */
  return UIManager_createClass(UIManager, [{
    key: "loadStyles",
    value: function loadStyles() {
      // 导入音量控制样式
      var volumeControlStyles = document.createElement('style');
      volumeControlStyles.textContent = "\n            /* \u97F3\u91CF\u63A7\u5236\u5BB9\u5668 */\n            .tm-volume-control {\n                position: relative;\n                display: flex;\n                align-items: center;\n                gap: 8px;\n                height: 40px;\n                padding: 0;\n                background-color: transparent;\n                transition: all 0.3s ease;\n                z-index: 1;\n            }\n\n            /* \u97F3\u91CF\u6309\u94AE - \u7EE7\u627F\u901A\u7528\u6309\u94AE\u6837\u5F0F */\n            .tm-volume-button {\n                z-index: 2;\n            }\n\n            /* \u6ED1\u6746\u5BB9\u5668 */\n            .tm-volume-slider-container {\n                position: relative;\n                width: 0;\n                height: 40px;\n                display: flex;\n                align-items: center;\n                overflow: hidden;\n                transition: all 0.3s ease;\n                opacity: 0;\n                margin-left: -8px;\n            }\n\n            /* \u5728PC\u7AEFhover\u65F6\u663E\u793A\u6ED1\u6746 */\n            @media (hover: hover) {\n                .tm-volume-control:hover .tm-volume-slider-container,\n                .tm-volume-control.expanded .tm-volume-slider-container {\n                    width: 80px;\n                    opacity: 1;\n                    margin-left: 0;\n                }\n\n                .tm-volume-control:hover .tm-volume-button,\n                .tm-volume-control.expanded .tm-volume-button {\n                    background-color: hsla(var(--shadcn-secondary) / 0.2);\n                }\n            }\n\n            /* \u5728\u79FB\u52A8\u7AEF\u5C55\u5F00\u548C\u62D6\u52A8\u65F6\u663E\u793A\u6ED1\u6746 */\n            .tm-volume-control.expanded .tm-volume-slider-container,\n            .tm-volume-control.dragging .tm-volume-slider-container {\n                width: 80px;\n                opacity: 1;\n                margin-left: 0;\n            }\n\n            .tm-volume-control.expanded .tm-volume-button,\n            .tm-volume-control.dragging .tm-volume-button {\n                background-color: hsla(var(--shadcn-secondary) / 0.2);\n            }\n\n            /* \u6ED1\u6746\u8F68\u9053 */\n            .tm-volume-slider-track {\n                position: relative;\n                width: 100%;\n                height: 24px;\n                cursor: pointer;\n                display: flex;\n                align-items: center;\n                padding: 0 2px;\n            }\n\n            .tm-volume-slider-track::before {\n                content: '';\n                position: absolute;\n                left: 0;\n                right: 0;\n                height: 4px;\n                background-color: hsla(var(--shadcn-secondary) / 0.3);\n                border-radius: 2px;\n                transition: all 0.2s ease;\n            }\n\n            .tm-volume-slider-track:hover::before,\n            .tm-volume-control.dragging .tm-volume-slider-track::before {\n                height: 6px;\n                background-color: hsla(var(--shadcn-secondary) / 0.4);\n            }\n\n            /* \u6ED1\u6746\u586B\u5145\u6761 */\n            .tm-volume-slider-level {\n                position: absolute;\n                left: 2px;\n                height: 4px;\n                background-color: #fff;\n                border-radius: 2px;\n                pointer-events: none;\n                transition: all 0.2s ease;\n            }\n\n            .tm-volume-slider-track:hover .tm-volume-slider-level,\n            .tm-volume-control.dragging .tm-volume-slider-level {\n                height: 6px;\n            }\n\n            /* \u97F3\u91CF\u503C\u663E\u793A */\n            .tm-volume-value {\n                position: absolute;\n                top: -30px;\n                left: 50%;\n                transform: translateX(-50%) scale(0.9);\n                background-color: hsla(var(--shadcn-secondary) / 0.8);\n                color: #fff;\n                padding: 4px 8px;\n                border-radius: 4px;\n                font-size: 12px;\n                opacity: 0;\n                transition: all 0.2s ease;\n                pointer-events: none;\n                backdrop-filter: blur(4px);\n                white-space: nowrap;\n                font-weight: 500;\n            }\n\n            /* \u62D6\u52A8\u548C\u5C55\u5F00\u65F6\u663E\u793A\u97F3\u91CF\u503C */\n            .tm-volume-control.dragging .tm-volume-value,\n            .tm-volume-control.expanded .tm-volume-value {\n                opacity: 1;\n                transform: translateX(-50%) scale(1);\n            }\n\n            /* \u89E6\u6478\u8BBE\u5907\u9002\u914D */\n            @media (hover: none) {\n                .tm-volume-control {\n                    touch-action: none;\n                }\n                \n                .tm-volume-slider-track {\n                    height: 32px;\n                }\n\n                .tm-volume-control.expanded .tm-volume-button,\n                .tm-volume-control.dragging .tm-volume-button {\n                    background-color: hsla(var(--shadcn-secondary) / 0.2);\n                }\n\n                /* \u786E\u4FDD\u5728\u89E6\u6478\u8BBE\u5907\u4E0A\u6ED1\u6746\u5C55\u5F00\u65F6\u7684\u663E\u793A\u6548\u679C */\n                .tm-volume-control.expanded .tm-volume-slider-container {\n                    width: 80px;\n                    opacity: 1;\n                    margin-left: 0;\n                    pointer-events: auto;\n                }\n\n                .tm-volume-slider-track::before {\n                    height: 6px;\n                }\n\n                .tm-volume-slider-level {\n                    height: 6px;\n                }\n            }\n\n            /* \u6697\u8272\u4E3B\u9898\u9002\u914D */\n            @media (prefers-color-scheme: dark) {\n                .tm-volume-slider-level {\n                    background-color: hsl(var(--shadcn-primary));\n                }\n\n                .tm-volume-value {\n                    background-color: hsla(var(--shadcn-secondary) / 0.9);\n                }\n            }\n        ";
      document.head.appendChild(volumeControlStyles);

      // 添加播放控制行按钮的统一样式
      var controlButtonStyles = document.createElement('style');
      controlButtonStyles.textContent = "\n            /* \u64AD\u653E\u63A7\u5236\u884C\u6309\u94AE\u57FA\u7840\u6837\u5F0F */\n            .tm-playback-control-row button {\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                width: 40px;\n                height: 40px;\n                padding: 8px;\n                border: none;\n                border-radius: 50%;\n                background-color: transparent;\n                color: #fff;\n                cursor: pointer;\n                transition: all 0.2s ease;\n            }\n\n            .tm-playback-control-row button:hover {\n                background-color: hsla(var(--shadcn-secondary) / 0.2);\n                transform: scale(1.05);\n            }\n\n            .tm-playback-control-row button svg {\n                width: 24px;\n                height: 24px;\n                stroke: currentColor;\n                stroke-width: 2;\n                fill: none;\n            }\n\n            /* \u79FB\u52A8\u7AEF\u9002\u914D */\n            @media (hover: none) {\n                .tm-playback-control-row button {\n                    width: 44px;\n                    height: 44px;\n                }\n            }\n\n            /* \u6697\u8272\u4E3B\u9898\u9002\u914D */\n            @media (prefers-color-scheme: dark) {\n                .tm-playback-control-row button svg {\n                    stroke: hsl(var(--shadcn-primary));\n                }\n            }\n        ";
      document.head.appendChild(controlButtonStyles);
    }

    /**
     * 创建UI界面
     */
  }, {
    key: "createUI",
    value: function createUI() {
      console.log('[UIManager] createUI started.');
      // 创建遮罩和视频容器
      this.createOverlayAndContainer();

      // 创建播放器容器
      this.createPlayerContainer();

      // 创建视频包装器
      this.createVideoWrapper();

      // 创建调整手柄
      this.createResizeHandle();

      // 创建关闭按钮
      this.createCloseButton();

      // 创建设置按钮
      this.createSettingsButton();

      // 创建按钮容器
      this.createButtonContainer();

      // 创建设置面板
      this.createSettingsPanel();

      // 添加屏幕方向变化监听（只设置window事件，overlay相关事件在组装DOM后设置）
      this.setupOrientationListener();
      console.log('[UIManager] UI基础元素创建完成');
      return {
        overlay: this.overlay,
        container: this.container,
        playerContainer: this.playerContainer,
        videoWrapper: this.videoWrapper,
        handleContainer: this.handleContainer,
        handle: this.handle,
        closeBtn: this.closeBtn,
        settingsBtn: this.settingsBtn,
        settingsPanel: this.settingsPanel,
        buttonContainer: this.buttonContainer
      };
    }

    /**
     * 创建遮罩和容器
     */
  }, {
    key: "createOverlayAndContainer",
    value: function createOverlayAndContainer() {
      // 创建遮罩层 - 使用预定义样式类
      this.overlay = document.createElement('div');
      this.overlay.className = 'tm-video-overlay';

      // 显式设置z-index，确保在任何情况下都高于浮动按钮
      this.overlay.style.zIndex = '9990';

      // 不再手动添加paddingTop和paddingBottom，使用CSS的safe-area-inset变量

      // 计算默认高度和最小高度
      var defaultHeight = window.innerWidth * (4 / 5);
      var defaultMinHeight = window.innerWidth * (9 / 16); // 默认16:9比例

      // 创建视频容器 - 使用预定义样式类
      this.container = document.createElement('div');
      this.container.className = 'tm-video-container';
      this.container.style.height = "".concat(defaultHeight, "px");
      this.container.style.minHeight = "".concat(defaultMinHeight, "px");
      console.log('[UIManager] Container element created:', this.container);
      console.log('[UIManager] createOverlayAndContainer finished.');
    }

    /**
     * 创建播放器容器
     */
  }, {
    key: "createPlayerContainer",
    value: function createPlayerContainer() {
      this.playerContainer = document.createElement('div');
      this.playerContainer.className = 'tm-player-container';
      console.log('[UIManager] Player container created:', this.playerContainer);
    }

    /**
     * 创建视频包装器
     */
  }, {
    key: "createVideoWrapper",
    value: function createVideoWrapper() {
      var _this = this;
      this.videoWrapper = document.createElement('div');
      this.videoWrapper.className = 'tm-video-wrapper';

      // 如果已经存在视频元素，先从父节点移除
      if (this.targetVideo && this.targetVideo.parentNode) {
        this.targetVideo.parentNode.removeChild(this.targetVideo);
      }

      // 禁用原生视频控件
      this.targetVideo.controls = false;

      // 添加视频到包装器
      this.videoWrapper.appendChild(this.targetVideo);

      // 添加视频元数据加载事件，用于检测视频比例
      this.targetVideo.addEventListener('loadedmetadata', function () {
        _this.updateVideoAspectRatio();
      });

      // 长按检测变量
      var longPressTimer = null;
      var isLongPress = false;
      var originalPlaybackRate = 1.0;

      // 鼠标/触摸按下事件 - 开始检测长按
      var handlePointerDown = function handlePointerDown(e) {
        // 确保点击事件不是从控制按钮冒泡上来的
        if (e.target.closest('.tm-control-buttons, .tm-button-container, .tm-control-button, .tm-close-button, .tm-settings-button')) {
          return;
        }

        // 清除可能存在的定时器
        if (longPressTimer) {
          clearTimeout(longPressTimer);
        }

        // 记录原始播放速度
        originalPlaybackRate = _this.playerCore.targetVideo.playbackRate;
        isLongPress = false;

        // 设置长按定时器 (3秒)
        longPressTimer = setTimeout(function () {
          // 触发长按事件
          isLongPress = true;
          // 保存当前播放速度
          originalPlaybackRate = _this.playerCore.targetVideo.playbackRate;
          // 设置为3倍速
          _this.playerCore.targetVideo.playbackRate = 3.0;

          // 添加视觉提示
          var speedIndicator = document.createElement('div');
          speedIndicator.className = 'tm-speed-indicator';
          speedIndicator.textContent = '3x';
          speedIndicator.style.position = 'absolute';
          speedIndicator.style.top = '50%';
          speedIndicator.style.left = '50%';
          speedIndicator.style.transform = 'translate(-50%, -50%)';
          speedIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
          speedIndicator.style.color = 'white';
          speedIndicator.style.padding = '8px 16px';
          speedIndicator.style.borderRadius = '4px';
          speedIndicator.style.fontSize = '24px';
          speedIndicator.style.fontWeight = 'bold';
          speedIndicator.style.zIndex = '9999';
          _this.videoWrapper.appendChild(speedIndicator);

          // 触觉反馈
          if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
          }

          // 如果视频当前是暂停的，开始播放
          if (_this.playerCore.targetVideo.paused) {
            _this.playerCore.targetVideo.play();
          }
        }, 800); // 800ms的长按时间，减少等待感
      };

      // 鼠标/触摸释放事件 - 结束长按
      var handlePointerUp = function handlePointerUp(e) {
        // 清除长按定时器
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }

        // 如果是长按状态，恢复原始播放速度并阻止冒泡
        if (isLongPress) {
          // 恢复原始播放速度
          _this.playerCore.targetVideo.playbackRate = originalPlaybackRate;

          // 移除速度指示器
          var speedIndicator = _this.videoWrapper.querySelector('.tm-speed-indicator');
          if (speedIndicator) {
            speedIndicator.remove();
          }

          // 防止触发点击事件
          e.preventDefault();
          e.stopPropagation();
          isLongPress = false;
          return;
        }
      };

      // 鼠标/触摸移动离开事件 - 结束长按
      var handlePointerLeave = function handlePointerLeave(e) {
        // 在鼠标/触摸离开视频区域时也要清除长按
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }

        // 如果是长按状态，恢复原始播放速度
        if (isLongPress) {
          _this.playerCore.targetVideo.playbackRate = originalPlaybackRate;

          // 移除速度指示器
          var speedIndicator = _this.videoWrapper.querySelector('.tm-speed-indicator');
          if (speedIndicator) {
            speedIndicator.remove();
          }
          isLongPress = false;
        }
      };

      // 添加鼠标事件监听
      this.videoWrapper.addEventListener('mousedown', handlePointerDown);
      this.videoWrapper.addEventListener('mouseup', handlePointerUp);
      this.videoWrapper.addEventListener('mouseleave', handlePointerLeave);

      // 添加触摸事件监听
      this.videoWrapper.addEventListener('touchstart', handlePointerDown, {
        passive: true
      });
      this.videoWrapper.addEventListener('touchend', handlePointerUp);
      this.videoWrapper.addEventListener('touchcancel', handlePointerLeave);

      // 添加点击事件用于显示/隐藏控制界面（横竖屏均有效）
      this.videoWrapper.addEventListener('click', function (e) {
        // 如果是长按触发的，不执行点击操作
        if (isLongPress) {
          return;
        }

        // 确保点击事件不是从控制按钮冒泡上来的
        if (e.target.closest('.tm-control-buttons, .tm-button-container, .tm-control-button, .tm-close-button, .tm-settings-button')) {
          return;
        }

        // 播放/暂停切换函数
        var togglePlayPause = function togglePlayPause() {
          if (!_this.playerCore.targetVideo) return;
          if (_this.playerCore.targetVideo.paused) {
            _this.playerCore.targetVideo.play();
          } else {
            _this.playerCore.targetVideo.pause();
            if (_this.playerCore.controlManager) {
              _this.playerCore.controlManager.showPauseIndicator();
            }
          }
          if (_this.playerCore.controlManager) {
            _this.playerCore.controlManager.updatePlayPauseButton();
          }
        };
        if (_this.isLandscape) {
          // 横屏模式下，如果控制界面当前是隐藏状态，则只显示控制界面而不触发暂停
          if (!_this.controlsVisible) {
            _this.showControls();
            _this.autoHideControls();
            return;
          }

          // 横屏模式下，如果控制界面已显示，则切换播放/暂停状态
          togglePlayPause();
        } else {
          // 竖屏模式下，直接触发暂停/播放功能
          togglePlayPause();
        }
      });
    }

    /**
     * 创建拖动调整手柄
     */
  }, {
    key: "createResizeHandle",
    value: function createResizeHandle() {
      var _this2 = this;
      // 创建手柄容器
      this.handleContainer = document.createElement('div');
      this.handleContainer.className = 'tm-handle-container';

      // 创建手柄
      this.handle = document.createElement('div');
      this.handle.className = 'tm-resize-handle';

      // 添加透明的更大点击区域
      this.handle.insertAdjacentHTML('beforeend', "\n            <div style=\"\n                position: absolute;\n                left: -10px;\n                right: -10px;\n                top: -15px;\n                bottom: -15px;\n                background: transparent;\n            \"></div>\n        ");

      // 悬停效果
      this.handle.addEventListener('mouseenter', function () {
        _this2.handle.style.opacity = '1';
        _this2.handle.style.backgroundColor = 'hsla(var(--shadcn-foreground) / 0.8)';
      });
      this.handle.addEventListener('mouseleave', function () {
        if (!_this2.isDraggingHandle) {
          _this2.handle.style.opacity = '0.5';
          _this2.handle.style.backgroundColor = 'hsla(var(--shadcn-foreground) / 0.6)';
        }
      });

      // 添加拖动时的 grabbing 光标
      this.handle.addEventListener('mousedown', function () {
        _this2.handle.style.cursor = 'grabbing';
        // 添加震动反馈
        if (window.navigator.vibrate) {
          window.navigator.vibrate(5);
        }
      });

      // 鼠标松开或移出手柄时恢复 grab
      document.addEventListener('mouseup', function () {
        if (!_this2.isDraggingHandle) {
          _this2.handle.style.cursor = 'grab';
        }
      });

      // 添加触摸事件处理
      this.handle.addEventListener('touchstart', function () {
        _this2.handle.style.opacity = '1';
        _this2.handle.style.backgroundColor = 'hsla(var(--shadcn-foreground) / 0.8)';
        // 添加震动反馈
        if (window.navigator.vibrate) {
          window.navigator.vibrate(5);
        }
      }, {
        passive: true
      });
      this.handle.addEventListener('touchend', function () {
        if (!_this2.isDraggingHandle) {
          _this2.handle.style.opacity = '0.5';
          _this2.handle.style.backgroundColor = 'hsla(var(--shadcn-foreground) / 0.6)';
        }
      });

      // 将手柄添加到其容器中
      this.handleContainer.appendChild(this.handle);
    }

    /**
     * 创建关闭按钮
     */
  }, {
    key: "createCloseButton",
    value: function createCloseButton() {
      var _this3 = this;
      this.closeBtn = document.createElement('button');
      this.closeBtn.className = 'tm-close-button tm-control-button-base';

      // 现代化的关闭图标
      var closeIcon = "\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M18 6L6 18M6 6L18 18\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            </svg>\n        ";
      this.closeBtn.innerHTML = closeIcon;

      // 添加悬停效果
      this.closeBtn.addEventListener('mouseenter', function () {
        _this3.closeBtn.style.backgroundColor = 'hsla(var(--shadcn-destructive) / 0.9)';
        _this3.closeBtn.style.transform = 'scale(1.1)';
      });
      this.closeBtn.addEventListener('mouseleave', function () {
        _this3.closeBtn.style.backgroundColor = 'hsla(var(--shadcn-background) / 0.7)';
        _this3.closeBtn.style.transform = 'scale(1)';
      });
    }

    /**
     * 创建设置按钮
     */
  }, {
    key: "createSettingsButton",
    value: function createSettingsButton() {
      var _this4 = this;
      this.settingsBtn = document.createElement('button');
      this.settingsBtn.className = 'tm-settings-button tm-control-button-base';

      // 现代化的设置图标
      var settingsIcon = "\n            <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                <path d=\"M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1837 17.2737 20.4009 17.7994 20.4009 18.345C20.4009 18.8906 20.1837 19.4163 19.79 19.81C19.4163 20.2037 18.8906 20.4209 18.345 20.4209C17.7994 20.4209 17.2737 20.2037 16.91 19.81L16.85 19.75C16.3678 19.2783 15.6471 19.1477 15.03 19.42C14.4301 19.6801 14.0386 20.2502 14.03 20.89V21C14.03 21.5304 13.8193 22.0391 13.4442 22.4142C13.0691 22.7893 12.5604 23 12.03 23C11.4996 23 10.9909 22.7893 10.6158 22.4142C10.2407 22.0391 10.03 21.5304 10.03 21V20.91C10.0112 20.2556 9.5979 19.6818 8.98 19.43C8.36289 19.1577 7.64221 19.2883 7.16 19.76L7.1 19.82C6.73629 20.2137 6.21056 20.4309 5.665 20.4309C5.11944 20.4309 4.59371 20.2137 4.23 19.82C3.83628 19.4463 3.61911 18.9206 3.61911 18.375C3.61911 17.8294 3.83628 17.3037 4.23 16.93L4.29 16.87C4.76167 16.3878 4.89231 15.6671 4.62 15.05C4.35995 14.4501 3.78985 14.0586 3.15 14.05H3C2.46957 14.05 1.96086 13.8393 1.58579 13.4642C1.21071 13.0891 1 12.5804 1 12.05C1 11.5196 1.21071 11.0109 1.58579 10.6358C1.96086 10.2607 2.46957 10.05 3 10.05H3.09C3.74435 10.0312 4.31814 9.61788 4.57 9C4.84231 8.38289 4.71167 7.66221 4.24 7.18L4.18 7.12C3.78628 6.75629 3.56911 6.23056 3.56911 5.685C3.56911 5.13944 3.78628 4.61371 4.18 4.25C4.55371 3.85628 5.07944 3.63911 5.625 3.63911C6.17056 3.63911 6.69629 3.85628 7.07 4.25L7.13 4.31C7.61221 4.78167 8.33289 4.91231 8.95 4.64H9C9.59994 4.37995 9.99144 3.80985 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0086 3.72985 14.4001 4.29995 15 4.56C15.6171 4.83231 16.3378 4.70167 16.82 4.23L16.88 4.17C17.2437 3.77628 17.7694 3.55911 18.325 3.55911C18.8806 3.55911 19.4063 3.77628 19.77 4.17C20.1637 4.54371 20.3809 5.06944 20.3809 5.615C20.3809 6.16056 20.1637 6.68629 19.77 7.06L19.71 7.12C19.2383 7.60221 19.1077 8.32289 19.38 8.94L19.4 9C19.66 9.59994 20.2301 9.99144 20.87 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.2702 14.0086 19.7001 14.4001 19.44 15H19.4Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            </svg>\n        ";
      this.settingsBtn.innerHTML = settingsIcon;

      // 添加悬停效果
      this.settingsBtn.addEventListener('mouseenter', function () {
        _this4.settingsBtn.style.backgroundColor = 'hsla(var(--shadcn-accent) / 0.9)';
        _this4.settingsBtn.style.transform = 'rotate(45deg)';
      });
      this.settingsBtn.addEventListener('mouseleave', function () {
        _this4.settingsBtn.style.backgroundColor = 'hsla(var(--shadcn-background) / 0.7)';
        _this4.settingsBtn.style.transform = 'rotate(0deg)';
      });
    }

    /**
     * 创建设置面板
     */
  }, {
    key: "createSettingsPanel",
    value: function createSettingsPanel() {
      this.settingsPanel = document.createElement('div');
      this.settingsPanel.className = 'tm-settings-panel';
      this.settingsPanel.style.display = 'none';

      // 这里只创建面板，具体设置项由SettingsManager管理
    }

    /**
     * 创建按钮容器
     */
  }, {
    key: "createButtonContainer",
    value: function createButtonContainer() {
      this.buttonContainer = document.createElement('div');
      this.buttonContainer.className = 'tm-button-container';
      this.buttonContainer.style.display = 'flex';
      this.buttonContainer.style.alignItems = 'center';
      this.buttonContainer.style.gap = '10px';
      this.buttonContainer.style.zIndex = '99999';
    }

    /**
     * 设置屏幕方向变化监听器
     */
  }, {
    key: "setupOrientationListener",
    value: function setupOrientationListener() {
      var _this5 = this;
      // 检测当前屏幕方向
      this.checkOrientation();

      // 添加屏幕方向变化监听
      window.addEventListener('orientationchange', function () {
        // 等待方向变化完成后再判断屏幕方向
        setTimeout(function () {
          _this5.checkOrientation();
        }, 300);
      });

      // 添加窗口大小变化监听（用于桌面端模拟和某些不支持orientationchange的设备）
      window.addEventListener('resize', function () {
        _this5.checkOrientation();
      });
    }

    /**
     * 设置交互事件监听器（在DOM组装后调用）
     */
  }, {
    key: "setupInteractionListeners",
    value: function setupInteractionListeners() {
      var _this6 = this;
      console.log('[UIManager] 设置交互事件监听器');

      // 确保overlay已创建
      if (!this.overlay) return;

      // 添加鼠标移动和触摸移动监听，用于在横屏模式下保持控制界面可见
      this.overlay.addEventListener('mousemove', function () {
        if (_this6.isLandscape) {
          _this6.showControls();
          _this6.autoHideControls();
        }
      });
      this.overlay.addEventListener('touchmove', function () {
        if (_this6.isLandscape) {
          _this6.showControls();
          _this6.autoHideControls();
        }
      }, {
        passive: true
      });

      // 为控制按钮添加触摸开始事件，防止点击控制按钮时隐藏控制界面
      this.overlay.addEventListener('touchstart', function (e) {
        if (_this6.isLandscape && e.target.closest('.tm-control-button, .tm-time-control-button, .tm-close-button')) {
          // 触摸控制按钮时重置自动隐藏计时器
          _this6.showControls();
          _this6.autoHideControls();
          e.stopPropagation(); // 阻止冒泡到视频包装器
        }
      }, {
        passive: false
      });

      // 为控制面板添加鼠标进入和离开事件
      if (this.playerCore.controlManager && this.playerCore.controlManager.controlButtonsContainer) {
        var controlButtons = this.playerCore.controlManager.controlButtonsContainer;
        controlButtons.addEventListener('mouseenter', function () {
          _this6.isMouseOverControls = true;
          // 鼠标进入控制面板时，清除隐藏定时器
          if (_this6.controlsHideTimeout) {
            clearTimeout(_this6.controlsHideTimeout);
            _this6.controlsHideTimeout = null;
          }
        });
        controlButtons.addEventListener('mouseleave', function () {
          _this6.isMouseOverControls = false;
          // 鼠标离开控制面板时，重新设置自动隐藏
          if (_this6.isLandscape) {
            _this6.autoHideControls();
          }
        });
      }

      // 为设置按钮和按钮容器添加鼠标进入和离开事件
      if (this.settingsBtn) {
        this.settingsBtn.addEventListener('mouseenter', function () {
          _this6.isMouseOverControls = true;
          if (_this6.controlsHideTimeout) {
            clearTimeout(_this6.controlsHideTimeout);
            _this6.controlsHideTimeout = null;
          }
        });
        this.settingsBtn.addEventListener('mouseleave', function () {
          _this6.isMouseOverControls = false;
          if (_this6.isLandscape) {
            _this6.autoHideControls();
          }
        });
      }
      if (this.buttonContainer) {
        this.buttonContainer.addEventListener('mouseenter', function () {
          _this6.isMouseOverControls = true;
          if (_this6.controlsHideTimeout) {
            clearTimeout(_this6.controlsHideTimeout);
            _this6.controlsHideTimeout = null;
          }
        });
        this.buttonContainer.addEventListener('mouseleave', function () {
          _this6.isMouseOverControls = false;
          if (_this6.isLandscape) {
            _this6.autoHideControls();
          }
        });
      }

      // 为设置面板添加鼠标进入和离开事件
      if (this.settingsPanel) {
        this.settingsPanel.addEventListener('mouseenter', function () {
          _this6.isMouseOverControls = true;
          if (_this6.controlsHideTimeout) {
            clearTimeout(_this6.controlsHideTimeout);
            _this6.controlsHideTimeout = null;
          }
        });
        this.settingsPanel.addEventListener('mouseleave', function () {
          _this6.isMouseOverControls = false;
          if (_this6.isLandscape) {
            _this6.autoHideControls();
          }
        });
      }
    }

    /**
     * 检测并处理屏幕方向
     */
  }, {
    key: "checkOrientation",
    value: function checkOrientation() {
      // 通过窗口宽高比判断屏幕方向
      var isLandscapeNow = window.innerWidth > window.innerHeight;

      // 方向发生变化时处理
      if (this.isLandscape !== isLandscapeNow) {
        this.isLandscape = isLandscapeNow;
        this.handleOrientationChange();
      }
    }

    /**
     * 处理屏幕方向变化
     */
  }, {
    key: "handleOrientationChange",
    value: function handleOrientationChange() {
      console.log('[UIManager] 屏幕方向变化:', this.isLandscape ? '横屏' : '竖屏');

      // 方向变化时更新容器最小高度
      this.updateContainerMinHeight();

      // 更新视频比例相关样式
      this.updateVideoAspectRatio();

      // 如果存在控制管理器，通知其刷新UI
      if (this.playerCore.controlManager) {
        this.playerCore.controlManager.updateProgressBar();
        this.playerCore.controlManager.updateCurrentTimeDisplay();

        // 更新控制面板显示
        this.updateControlPanelVisibility();
      }

      // 横屏时隐藏调整手柄
      if (this.handleContainer) {
        this.handleContainer.style.display = this.isLandscape ? 'none' : 'flex';
      }

      // 横屏模式下自动显示控制界面，并设置定时隐藏
      if (this.isLandscape) {
        this.showControls();
        this.autoHideControls();
      } else {
        // 竖屏模式下始终显示控制界面
        this.showControls();
        // 清除任何可能存在的定时器
        if (this.controlsHideTimeout) {
          clearTimeout(this.controlsHideTimeout);
          this.controlsHideTimeout = null;
        }
      }
    }

    /**
     * 更新控制面板各行的可见性
     */
  }, {
    key: "updateControlPanelVisibility",
    value: function updateControlPanelVisibility() {
      if (!this.playerCore.controlManager) return;
      var controlButtons = this.playerCore.controlManager.controlButtonsContainer;
      if (!controlButtons) return;

      // 查找各控制行
      var progressRow = controlButtons.querySelector('.tm-progress-row');
      var seekControlRow = controlButtons.querySelector('.tm-seek-control-row');
      var loopControlRow = controlButtons.querySelector('.tm-loop-control-row');
      var playbackControlRow = controlButtons.querySelector('.tm-playback-control-row');
      if (this.isLandscape) {
        // 横屏模式下，显示所有控制行
        if (progressRow) {
          progressRow.style.display = 'flex';
          progressRow.style.backgroundColor = 'transparent';
        }
        if (seekControlRow) {
          seekControlRow.style.display = 'flex';
          seekControlRow.style.justifyContent = 'center';
          seekControlRow.style.alignItems = 'center';
          seekControlRow.style.gap = '20px';
          seekControlRow.style.backgroundColor = 'transparent';
        }
        if (loopControlRow) {
          loopControlRow.style.display = 'flex';
          loopControlRow.style.backgroundColor = 'transparent';
        }
        if (playbackControlRow) {
          playbackControlRow.style.display = 'flex';
          playbackControlRow.style.backgroundColor = 'transparent';
        }

        // 设置按钮也显示
        if (this.settingsBtn) {
          this.settingsBtn.style.display = 'flex';
          this.settingsBtn.style.backgroundColor = 'hsla(var(--shadcn-secondary) / 0.3)';
          this.settingsBtn.style.backdropFilter = 'blur(4px)';
        }

        // 调整快退快进按钮组的布局
        var rewindGroup = controlButtons.querySelector('.tm-rewind-group');
        var forwardGroup = controlButtons.querySelector('.tm-forward-group');
        if (rewindGroup) {
          rewindGroup.style.width = 'auto';
          rewindGroup.style.flex = '0 1 auto';
        }
        if (forwardGroup) {
          forwardGroup.style.width = 'auto';
          forwardGroup.style.flex = '0 1 auto';
        }
      } else {
        // 竖屏模式下恢复默认显示
        if (progressRow) progressRow.style.display = '';
        if (seekControlRow) {
          seekControlRow.style.display = '';
          seekControlRow.style.justifyContent = '';
          seekControlRow.style.alignItems = '';
          seekControlRow.style.gap = '';
        }
        if (loopControlRow) loopControlRow.style.display = '';
        if (playbackControlRow) playbackControlRow.style.display = '';

        // 恢复设置按钮样式
        if (this.settingsBtn) {
          this.settingsBtn.style.display = '';
          this.settingsBtn.style.backgroundColor = '';
          this.settingsBtn.style.backdropFilter = '';
        }

        // 恢复快退快进按钮组的布局
        var _rewindGroup = controlButtons.querySelector('.tm-rewind-group');
        var _forwardGroup = controlButtons.querySelector('.tm-forward-group');
        if (_rewindGroup) {
          _rewindGroup.style.width = '';
          _rewindGroup.style.flex = '';
        }
        if (_forwardGroup) {
          _forwardGroup.style.width = '';
          _forwardGroup.style.flex = '';
        }
      }
    }

    /**
     * 更新视频纵横比相关样式
     */
  }, {
    key: "updateVideoAspectRatio",
    value: function updateVideoAspectRatio() {
      if (!this.videoWrapper || !this.targetVideo) return;
      var videoWidth = this.targetVideo.videoWidth;
      var videoHeight = this.targetVideo.videoHeight;
      if (videoWidth && videoHeight) {
        var videoRatio = videoWidth / videoHeight;
        var isVideoPortrait = videoRatio < 1; // 视频是否为竖屏比例

        // 根据视频比例调整视频包装器样式
        if (isVideoPortrait) {
          this.videoWrapper.classList.add('video-portrait');
        } else {
          this.videoWrapper.classList.remove('video-portrait');
        }
        console.log('[UIManager] 视频比例更新:', videoRatio, isVideoPortrait ? '竖屏视频' : '横屏视频');
      }
    }

    /**
     * 显示控制界面
     */
  }, {
    key: "showControls",
    value: function showControls() {
      if (!this.overlay) return;
      this.overlay.classList.remove('controls-hidden');
      document.body.classList.remove('controls-hidden');
      this.controlsVisible = true;

      // 清除可能存在的隐藏定时器
      if (this.controlsHideTimeout) {
        clearTimeout(this.controlsHideTimeout);
        this.controlsHideTimeout = null;
      }
    }

    /**
     * 隐藏控制界面
     */
  }, {
    key: "hideControls",
    value: function hideControls() {
      if (!this.overlay || !this.isLandscape) return;
      this.overlay.classList.add('controls-hidden');
      document.body.classList.add('controls-hidden');
      this.controlsVisible = false;
    }

    /**
     * 切换控制界面显示/隐藏
     */
  }, {
    key: "toggleControlsVisibility",
    value: function toggleControlsVisibility() {
      if (this.controlsVisible) {
        this.hideControls();
      } else {
        this.showControls();
        // 显示后设置自动隐藏
        this.autoHideControls();
      }
    }

    /**
     * 设置自动隐藏控制界面
     */
  }, {
    key: "autoHideControls",
    value: function autoHideControls() {
      var _this7 = this;
      // 只在横屏模式下设置自动隐藏
      if (!this.isLandscape) return;

      // 如果鼠标在控制面板上，不设置自动隐藏
      if (this.isMouseOverControls) return;

      // 清除可能存在的定时器
      if (this.controlsHideTimeout) {
        clearTimeout(this.controlsHideTimeout);
      }

      // 设置3秒后自动隐藏
      this.controlsHideTimeout = setTimeout(function () {
        _this7.hideControls();
      }, 3000);
    }

    /**
     * 更新视频容器的最小高度
     */
  }, {
    key: "updateContainerMinHeight",
    value: function updateContainerMinHeight() {
      if (!this.container || !this.targetVideo) return;

      // 横屏模式下不需要设置最小高度，CSS会处理
      if (this.isLandscape) {
        console.log('[UIManager] 横屏模式，使用CSS样式控制高度');
        return;
      }
      var videoWidth = this.targetVideo.videoWidth || this.targetVideo.naturalWidth;
      var videoHeight = this.targetVideo.videoHeight || this.targetVideo.naturalHeight;
      if (videoWidth && videoHeight) {
        // 使用视频原始比例计算最小高度
        var minHeight = window.innerWidth * (videoHeight / videoWidth);
        this.container.style.minHeight = "".concat(minHeight, "px");
        console.log('[UIManager] 更新容器最小高度:', minHeight);
      }
    }

    /**
     * 组装DOM结构
     */
  }, {
    key: "assembleDOM",
    value: function assembleDOM() {
      // 确保先将视频包装器添加到容器
      this.container.appendChild(this.videoWrapper);

      // 将关闭按钮和设置按钮添加到按钮容器
      this.buttonContainer.appendChild(this.closeBtn);
      this.buttonContainer.appendChild(this.settingsBtn);

      // 将按钮容器添加到播放器容器
      this.playerContainer.appendChild(this.buttonContainer);

      // 将容器添加到播放器容器
      this.playerContainer.appendChild(this.container);

      // 将手柄容器添加到播放器容器
      this.playerContainer.appendChild(this.handleContainer);

      // 添加设置面板到播放器容器
      this.playerContainer.appendChild(this.settingsPanel);

      // 如果存在控制按钮，也添加到播放器容器内
      if (this.playerCore.controlManager && this.playerCore.controlManager.controlButtonsContainer) {
        this.playerContainer.appendChild(this.playerCore.controlManager.controlButtonsContainer);
      }

      // 将overlay添加到document.body
      document.body.appendChild(this.overlay);

      // 将playerContainer与overlay同级添加到document.body，而不是作为overlay的子元素
      document.body.appendChild(this.playerContainer);

      // 立即更新容器最小高度
      this.updateContainerMinHeight();

      // 在DOM组装完成后设置交互监听器
      this.setupInteractionListeners();
      console.log('[UIManager] DOM组装完成', {
        overlay: this.overlay.isConnected,
        playerContainer: this.playerContainer.isConnected,
        container: this.container.isConnected,
        videoWrapper: this.videoWrapper.isConnected,
        video: this.targetVideo.isConnected
      });
    }
  }]);
}();
;// ./src/player/managers/ControlManager.js
function ControlManager_typeof(o) { "@babel/helpers - typeof"; return ControlManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ControlManager_typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ControlManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function ControlManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, ControlManager_toPropertyKey(o.key), o); } }
function ControlManager_createClass(e, r, t) { return r && ControlManager_defineProperties(e.prototype, r), t && ControlManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function ControlManager_toPropertyKey(t) { var i = ControlManager_toPrimitive(t, "string"); return "symbol" == ControlManager_typeof(i) ? i : i + ""; }
function ControlManager_toPrimitive(t, r) { if ("object" != ControlManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != ControlManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 控制管理器类 - 负责播放器控制按钮和相关功能
 */
var ControlManager = /*#__PURE__*/function () {
  function ControlManager(playerCore, uiElements) {
    ControlManager_classCallCheck(this, ControlManager);
    // 核心引用
    this.playerCore = playerCore;
    this.targetVideo = playerCore.targetVideo;

    // UI元素引用
    this.uiElements = uiElements;

    // 控制按钮容器和元素
    this.controlButtonsContainer = null; // 控制按钮容器
    this.playPauseButton = null; // 播放/暂停按钮
    this.muteButton = null; // 静音按钮
    this.progressBarElement = null; // 进度条元素
    this.progressIndicator = null; // 进度指示器
    this.currentTimeDisplay = null; // 当前时间显示
    this.totalDurationDisplay = null; // 总时长显示
    this.timeIndicator = null; // 时间指示器
    this.progressControlsContainer = null; // 进度控制容器

    // 暂停和倍速指示器
    this.pauseIndicator = null; // 暂停指示器
    this.playbackRateIndicator = null; // 倍速指示器

    // 循环控制相关
    this.loopManager = null; // 循环管理器实例引用
    this.loopStartMarker = null;
    this.loopEndMarker = null;
    this.loopStartDisplay = null;
    this.loopEndDisplay = null;

    // 拖动状态
    this.isDraggingProgress = false; // 是否正在拖动进度条
    this.clickLock = false; // 防止快速多次点击视频区域
    this.clickLockTimeout = null; // 点击锁定计时器

    // 音量控制相关
    this.volumeSlider = null; // 音量滑杆元素
    this.volumeLevel = null; // 音量滑杆填充条
    this.volumeValue = null; // 音量值显示
    this.lastVolume = 1; // 记录静音前的音量
  }

  /**
   * 初始化控制管理器
   */
  return ControlManager_createClass(ControlManager, [{
    key: "init",
    value: function init() {
      // 创建进度条控制
      this.progressControlsContainer = this.createProgressControls();

      // 创建控制按钮容器
      this.controlButtonsContainer = this.createControlButtonsContainer();

      // 初始化事件监听器
      this.initEventListeners();

      // 返回创建的元素
      return {
        progressControlsContainer: this.progressControlsContainer,
        controlButtonsContainer: this.controlButtonsContainer
      };
    }

    /**
     * 设置循环管理器引用
     */
  }, {
    key: "setLoopManager",
    value: function setLoopManager(loopManager) {
      this.loopManager = loopManager;
    }

    /**
     * 初始化事件监听器
     */
  }, {
    key: "initEventListeners",
    value: function initEventListeners() {
      var _this = this;
      // 视频时间更新监听
      this.targetVideo.addEventListener('timeupdate', this.updateProgressBar.bind(this));
      this.targetVideo.addEventListener('timeupdate', this.updateCurrentTimeDisplay.bind(this));

      // 视频元数据加载完成监听
      this.targetVideo.addEventListener('loadedmetadata', function () {
        _this.updateProgressBar();
        _this.updateLoopTimeDisplay();
        _this.updateLoopMarkers();
      });

      // 进度条点击和拖动监听
      this.progressBarElement.addEventListener('click', this.handleProgressClick.bind(this));
      this.progressBarElement.addEventListener('mousedown', this.startProgressDrag.bind(this));
      this.progressBarElement.addEventListener('touchstart', this.startProgressDrag.bind(this), {
        passive: false
      });

      // 注释掉视频包装器点击事件，由UIManager统一处理
      // 视频包装器点击事件已移至UIManager，避免重复绑定和逻辑冲突

      // 监听视频播放状态变化，更新播放/暂停按钮
      this.targetVideo.addEventListener('play', function () {
        _this.updatePlayPauseButton();
      });
      this.targetVideo.addEventListener('pause', function () {
        _this.updatePlayPauseButton();
        _this.showPauseIndicator(); // 显示暂停指示器
      });

      // 监听视频静音状态变化
      this.targetVideo.addEventListener('volumechange', function () {
        _this.updateMuteButton();
      });

      // 监听视频倍速变化
      this.targetVideo.addEventListener('ratechange', function () {
        if (_this.playbackRateSlider) {
          var currentRate = _this.targetVideo.playbackRate;
          // 计算对应的百分比位置
          var percentage = (currentRate - 0.1) / (3.0 - 0.1) * 100;
          // 更新滑块位置（如果不是由滑块触发的变化）
          if (_this.updatePlaybackRateSlider) {
            _this.updatePlaybackRateSlider(percentage);
          }
          // 显示倍速指示器
          _this.showPlaybackRateIndicator(currentRate);
        }
      });

      // 循环功能监听
      if (this.loopManager) {
        this.targetVideo.addEventListener('timeupdate', function () {
          _this.loopManager.checkAndLoop();
        });
      }
    }

    /**
     * 创建进度条控制组件
     */
  }, {
    key: "createProgressControls",
    value: function createProgressControls() {
      var _this2 = this;
      // 创建内置进度条控制区
      this.progressControlsContainer = document.createElement('div');
      this.progressControlsContainer.className = 'tm-progress-controls';

      // 时间显示容器 - 现在放在进度条上方
      var timeDisplayContainer = document.createElement('div');
      timeDisplayContainer.className = 'tm-time-display-container';

      // 当前时间显示
      this.currentTimeDisplay = document.createElement('span');
      this.currentTimeDisplay.className = 'tm-current-time';
      this.currentTimeDisplay.textContent = '00:00:00';

      // 剩余时间显示
      this.totalDurationDisplay = document.createElement('span');
      this.totalDurationDisplay.className = 'tm-total-duration';
      this.totalDurationDisplay.textContent = '-00:00:00';

      // 进度条容器
      var progressBarContainer = document.createElement('div');
      progressBarContainer.className = 'tm-progress-bar-container';
      this.progressBarElement = document.createElement('div');
      this.progressBarElement.className = 'tm-progress-bar';

      // 进度指示器
      this.progressIndicator = document.createElement('div');
      this.progressIndicator.className = 'tm-progress-indicator';

      // 进度条和指示器的鼠标/触摸事件
      progressBarContainer.addEventListener('mouseenter', function () {
        _this2.progressBarElement.classList.add('tm-progress-bar-expanded');
      });
      progressBarContainer.addEventListener('mouseleave', function () {
        if (!_this2.isDraggingProgress) {
          _this2.progressBarElement.classList.add('tm-progress-bar-normal');
          _this2.progressBarElement.classList.remove('tm-progress-bar-expanded');
        }
      });

      // 添加触摸事件，处理触摸时进度条变高
      progressBarContainer.addEventListener('touchstart', function () {
        _this2.progressBarElement.classList.add('tm-progress-bar-expanded');
        _this2.progressBarElement.classList.remove('tm-progress-bar-normal');
      }, {
        passive: true
      });
      progressBarContainer.addEventListener('touchend', function () {
        if (!_this2.isDraggingProgress) {
          _this2.progressBarElement.classList.add('tm-progress-bar-normal');
          _this2.progressBarElement.classList.remove('tm-progress-bar-expanded');
        }
      });

      // 添加循环标记容器
      this.loopStartMarker = document.createElement('div');
      this.loopStartMarker.className = 'tm-loop-marker tm-loop-start-marker';
      this.loopStartMarker.style.display = 'none';
      this.loopEndMarker = document.createElement('div');
      this.loopEndMarker.className = 'tm-loop-marker tm-loop-end-marker';
      this.loopEndMarker.style.display = 'none';

      // 添加循环区间连接元素
      this.loopRangeElement = document.createElement('div');
      this.loopRangeElement.className = 'tm-loop-range';
      this.loopRangeElement.style.display = 'none';

      // 组装时间显示
      timeDisplayContainer.appendChild(this.currentTimeDisplay);
      timeDisplayContainer.appendChild(this.totalDurationDisplay);

      // 组装进度条组件
      this.progressBarElement.appendChild(this.progressIndicator);
      progressBarContainer.appendChild(this.progressBarElement);
      progressBarContainer.appendChild(this.loopStartMarker);
      progressBarContainer.appendChild(this.loopEndMarker);
      progressBarContainer.appendChild(this.loopRangeElement);

      // 添加到进度控制容器 - 先添加时间显示，然后是进度条
      this.progressControlsContainer.appendChild(timeDisplayContainer);
      this.progressControlsContainer.appendChild(progressBarContainer);
      return this.progressControlsContainer;
    }

    /**
     * 创建视频控制按钮容器
     */
  }, {
    key: "createControlButtonsContainer",
    value: function createControlButtonsContainer() {
      var _this3 = this;
      // 创建控制按钮容器 - 固定在页面底部
      this.controlButtonsContainer = document.createElement('div');
      this.controlButtonsContainer.className = 'tm-control-buttons';

      // 创建进度条行作为第一行
      var progressRow = document.createElement('div');
      progressRow.className = 'tm-progress-row';

      // 添加进度控制区到进度条行
      progressRow.appendChild(this.progressControlsContainer);

      // 添加进度条行作为第一行
      this.controlButtonsContainer.appendChild(progressRow);

      // 创建第一行：快退和快进按钮
      var seekControlRow = document.createElement('div');
      seekControlRow.className = 'tm-seek-control-row';

      // 创建第二行：时间显示和循环控制按钮
      var loopControlRow = document.createElement('div');
      loopControlRow.className = 'tm-loop-control-row';

      // 创建时间显示区 - 第二行左侧
      var timeDisplay = document.createElement('div');
      timeDisplay.className = 'tm-time-display';

      // 创建循环控制区 - 第二行右侧
      var loopControl = document.createElement('div');
      loopControl.className = 'tm-loop-control';

      // 创建快退按钮组 - 左侧
      var rewindGroup = document.createElement('div');
      rewindGroup.className = 'tm-rewind-group';

      // 创建快进按钮组 - 右侧
      var forwardGroup = document.createElement('div');
      forwardGroup.className = 'tm-forward-group';

      // 创建快退按钮行（响应式容器，按钮从右到左排列）
      var rewindButtonsContainer = document.createElement('div');
      rewindButtonsContainer.className = 'tm-rewind-buttons-container';

      // 创建快进按钮行（响应式容器，按钮从左到右排列）
      var forwardButtonsContainer = document.createElement('div');
      forwardButtonsContainer.className = 'tm-forward-buttons-container';

      // 将按钮容器添加到各自的组
      rewindGroup.appendChild(rewindButtonsContainer);
      forwardGroup.appendChild(forwardButtonsContainer);

      // 组装组到主行
      seekControlRow.appendChild(rewindGroup);
      seekControlRow.appendChild(forwardGroup);

      // 添加快退按钮 - 按钮将按照4,3,2,1,6,5的顺序从右到左排列
      this.addTimeControlButton(rewindButtonsContainer, '-5s', function () {
        return _this3.seekRelative(-5);
      });
      this.addTimeControlButton(rewindButtonsContainer, '-10s', function () {
        return _this3.seekRelative(-10);
      });
      this.addTimeControlButton(rewindButtonsContainer, '-30s', function () {
        return _this3.seekRelative(-30);
      });
      this.addTimeControlButton(rewindButtonsContainer, '-1m', function () {
        return _this3.seekRelative(-60);
      });
      this.addTimeControlButton(rewindButtonsContainer, '-5m', function () {
        return _this3.seekRelative(-300);
      });
      this.addTimeControlButton(rewindButtonsContainer, '-10m', function () {
        return _this3.seekRelative(-600);
      });

      // 添加快进按钮 - 按钮将按照1,2,3,4,5,6的顺序从左到右排列
      this.addTimeControlButton(forwardButtonsContainer, '+5s', function () {
        return _this3.seekRelative(5);
      });
      this.addTimeControlButton(forwardButtonsContainer, '+10s', function () {
        return _this3.seekRelative(10);
      });
      this.addTimeControlButton(forwardButtonsContainer, '+30s', function () {
        return _this3.seekRelative(30);
      });
      this.addTimeControlButton(forwardButtonsContainer, '+1m', function () {
        return _this3.seekRelative(60);
      });
      this.addTimeControlButton(forwardButtonsContainer, '+5m', function () {
        return _this3.seekRelative(300);
      });
      this.addTimeControlButton(forwardButtonsContainer, '+10m', function () {
        return _this3.seekRelative(600);
      });

      // 创建时间显示
      this.currentPositionDisplay = document.createElement('span');
      this.currentPositionDisplay.className = 'tm-loop-start-position';
      this.currentPositionDisplay.textContent = '00:00:00';

      // 循环开始点按钮 (A) - 改为纯文本标签
      this.setLoopStartButton = document.createElement('span');
      this.setLoopStartButton.className = 'tm-set-loop-start-label';
      this.setLoopStartButton.innerHTML = 'A';

      // 结束时间显示
      this.durationDisplay = document.createElement('span');
      this.durationDisplay.className = 'tm-loop-end-position';
      this.durationDisplay.textContent = '00:00:00';

      // 循环结束点按钮 (B) - 改为纯文本标签
      this.setLoopEndButton = document.createElement('span');
      this.setLoopEndButton.className = 'tm-set-loop-end-label';
      this.setLoopEndButton.innerHTML = 'B';

      // 创建开始时间容器
      var startTimeContainer = document.createElement('div');
      startTimeContainer.className = 'tm-start-time-container';

      // 创建结束时间容器
      var endTimeContainer = document.createElement('div');
      endTimeContainer.className = 'tm-end-time-container';

      // 添加开始时间容器点击事件
      startTimeContainer.addEventListener('click', function () {
        if (_this3.loopManager) {
          _this3.loopManager.setLoopStart();
        } else {
          console.error('[ControlManager] 循环管理器未设置，无法调用setLoopStart');
        }
      });

      // 简化悬停效果，使用CSS处理
      startTimeContainer.addEventListener('mouseover', function () {
        // CSS已处理悬停样式
        return; // 添加空语句以避免lint错误
      });
      startTimeContainer.addEventListener('mouseout', function () {
        // CSS已处理离开样式
        return; // 添加空语句以避免lint错误
      });

      // 添加结束时间容器点击事件
      endTimeContainer.addEventListener('click', function () {
        if (_this3.loopManager) {
          _this3.loopManager.setLoopEnd();
        } else {
          console.error('[ControlManager] 循环管理器未设置，无法调用setLoopEnd');
        }
      });

      // 简化悬停效果，使用CSS处理
      endTimeContainer.addEventListener('mouseover', function () {
        // CSS已处理悬停样式
        return; // 添加空语句以避免lint错误
      });
      endTimeContainer.addEventListener('mouseout', function () {
        // CSS已处理离开样式
        return; // 添加空语句以避免lint错误
      });

      // 组装开始时间容器
      startTimeContainer.appendChild(this.setLoopStartButton);
      startTimeContainer.appendChild(this.currentPositionDisplay);

      // 组装结束时间容器
      endTimeContainer.appendChild(this.setLoopEndButton);
      endTimeContainer.appendChild(this.durationDisplay);

      // 添加循环按钮 - 直接在 loopControl 中创建
      var loopButton = document.createElement('div');
      loopButton.className = 'tm-loop-toggle-button';
      loopButton.innerHTML = "\n            <span class=\"tm-loop-toggle-label\">Loop</span>\n            <svg width=\"12\" height=\"12\" style=\"vertical-align: middle;\">\n                <circle class=\"tm-loop-indicator-circle\" cx=\"6\" cy=\"6\" r=\"5\" fill=\"hsl(var(--shadcn-muted-foreground) / 0.5)\"></circle>\n            </svg>\n        ";
      loopControl.appendChild(loopButton);

      // 获取创建的按钮元素
      var loopToggleButtonElement = loopButton;

      // 简化悬停效果，使用CSS处理
      loopToggleButtonElement.addEventListener('mouseover', function () {
        // CSS已处理悬停样式
        return; // 添加空语句以避免lint错误
      });
      loopToggleButtonElement.addEventListener('mouseout', function () {
        // CSS已处理离开样式
        return; // 添加空语句以避免lint错误
      });

      // 添加点击事件
      loopToggleButtonElement.addEventListener('click', function () {
        if (_this3.loopManager) {
          _this3.loopManager.toggleLoop();
        } else {
          console.error('[ControlManager] 循环管理器未设置，无法调用toggleLoop');
        }
      });
      this.loopToggleButton = loopToggleButtonElement; // 存储按钮引用

      // 组装控制区域
      timeDisplay.appendChild(startTimeContainer);
      timeDisplay.appendChild(endTimeContainer);
      loopControlRow.appendChild(timeDisplay);
      loopControlRow.appendChild(loopControl);
      this.controlButtonsContainer.appendChild(seekControlRow);
      this.controlButtonsContainer.appendChild(loopControlRow);

      // 播放控制行：播放/暂停、静音和倍速按钮
      var playbackControlRow = document.createElement('div');
      playbackControlRow.className = 'tm-playback-control-row';

      // 创建左侧区域 - 放置静音按钮和音量控制
      var leftControlsArea = document.createElement('div');
      leftControlsArea.className = 'tm-left-controls';
      leftControlsArea.style.display = 'flex';
      leftControlsArea.style.alignItems = 'center';
      leftControlsArea.style.gap = '8px';
      leftControlsArea.style.flex = '1';

      // 创建音量控制滑杆
      this.createVolumeSlider(leftControlsArea);

      // 创建中间区域 - 放置播放/暂停按钮
      var centerControlsArea = document.createElement('div');
      centerControlsArea.className = 'tm-center-controls';
      centerControlsArea.style.display = 'flex';
      centerControlsArea.style.alignItems = 'center';
      centerControlsArea.style.justifyContent = 'center';
      centerControlsArea.style.flex = '1';

      // 创建右侧区域 - 放置速度控制
      var rightControlsArea = document.createElement('div');
      rightControlsArea.className = 'tm-right-controls';
      rightControlsArea.style.display = 'flex';
      rightControlsArea.style.alignItems = 'center';
      rightControlsArea.style.justifyContent = 'flex-end';
      rightControlsArea.style.flex = '1';
      rightControlsArea.style.gap = '8px';

      // 添加这些区域到控制行
      playbackControlRow.appendChild(leftControlsArea);
      playbackControlRow.appendChild(centerControlsArea);
      playbackControlRow.appendChild(rightControlsArea);

      // 播放/暂停按钮
      this.playPauseButton = this.addControlButton(centerControlsArea, '', function () {
        if (_this3.targetVideo.paused) {
          _this3.targetVideo.play();
          _this3.updatePlayPauseButton();
        } else {
          _this3.targetVideo.pause();
          _this3.updatePlayPauseButton();
        }
      });

      // 创建倍速滑块控制器
      this.createPlaybackRateSlider(rightControlsArea);

      // 设置播放控制行的样式
      playbackControlRow.style.display = 'flex';
      playbackControlRow.style.alignItems = 'center';
      this.controlButtonsContainer.appendChild(playbackControlRow);

      // 初始化按钮状态
      this.updatePlayPauseButton();
      this.updateMuteButton();
      return this.controlButtonsContainer;
    }

    /**
     * 创建倍速滑块控制器
     */
  }, {
    key: "createPlaybackRateSlider",
    value: function createPlaybackRateSlider(container) {
      var _this4 = this;
      var playbackRateSlider = document.createElement('div');
      playbackRateSlider.className = 'tm-playback-rate-slider';

      // 滑块相关常量定义
      var MIN_SPEED = 0.1;
      var MAX_SPEED = 3.0;
      var STEP = 0.1;
      var isDragging = false;
      var lastPercentage = 30; // 默认1.0倍速，范围0.1-3.0的30%
      var currentSpeed = 1.0;
      var rafId = null;

      // 滑块容器
      var sliderContainer = document.createElement('div');
      sliderContainer.className = 'tm-slider-container';

      // 滑块填充区域
      var sliderLevel = document.createElement('div');
      sliderLevel.className = 'tm-slider-level';

      // 滑块标记
      var sliderMarks = document.createElement('div');
      sliderMarks.className = 'tm-slider-marks';

      // 添加主要标记点 - 0.5x, 1.0x, 1.5x, 2.0x, 3.0x
      var marksPositions = [{
        pos: Math.round((0.5 - MIN_SPEED) / (MAX_SPEED - MIN_SPEED) * 100),
        label: '0.5x'
      }, {
        pos: Math.round((1.0 - MIN_SPEED) / (MAX_SPEED - MIN_SPEED) * 100),
        label: '1.0x'
      }, {
        pos: Math.round((1.5 - MIN_SPEED) / (MAX_SPEED - MIN_SPEED) * 100),
        label: '1.5x'
      }, {
        pos: Math.round((2.0 - MIN_SPEED) / (MAX_SPEED - MIN_SPEED) * 100),
        label: '2.0x'
      }, {
        pos: Math.round((3.0 - MIN_SPEED) / (MAX_SPEED - MIN_SPEED) * 100),
        label: '3.0x'
      }];
      marksPositions.forEach(function (_ref) {
        var pos = _ref.pos,
          label = _ref.label;
        var mark = document.createElement('div');
        mark.className = 'tm-slider-mark';
        mark.style.left = "".concat(pos, "%");
        sliderMarks.appendChild(mark);
      });

      // 滑块文本区域
      var sliderText = document.createElement('div');
      sliderText.className = 'tm-slider-text';

      // Speed标签
      var speedLabel = document.createElement('div');
      speedLabel.className = 'tm-speed-label';
      speedLabel.textContent = 'Speed';

      // 速度值显示
      var speedValue = document.createElement('div');
      speedValue.className = 'tm-speed-value';
      speedValue.textContent = '1.0x';

      // 组装DOM结构
      sliderText.appendChild(speedLabel);
      sliderText.appendChild(speedValue);
      sliderContainer.appendChild(sliderMarks);
      sliderContainer.appendChild(sliderLevel);
      sliderContainer.appendChild(sliderText);
      playbackRateSlider.appendChild(sliderContainer);

      // 将滑块添加到控制区域
      container.appendChild(playbackRateSlider);

      // 更新滑块函数
      var updateSlider = function updateSlider(percentage) {
        sliderLevel.style.width = "".concat(percentage, "%");

        // 计算速度值：从MIN_SPEED到MAX_SPEED，步长为STEP
        var speedRange = MAX_SPEED - MIN_SPEED;
        var speed = MIN_SPEED + percentage / 100 * speedRange;

        // 将速度值四舍五入到最近的STEP倍数
        speed = Math.round(speed / STEP) * STEP;

        // 确保不超出范围
        speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, speed));

        // 如果速度变化，更新显示
        if (speed !== currentSpeed) {
          currentSpeed = speed;

          // 更新视频播放速度
          _this4.targetVideo.playbackRate = speed;

          // 更新显示文本
          speedValue.textContent = "".concat(speed.toFixed(1), "x");

          // 根据速度调整颜色
          speedValue.classList.remove('tm-speed-value-fast', 'tm-speed-value-slow', 'tm-speed-value-normal');
          if (speed > 1.5) {
            speedValue.classList.add('tm-speed-value-fast');
          } else if (speed < 0.8) {
            speedValue.classList.add('tm-speed-value-slow');
          } else {
            speedValue.classList.add('tm-speed-value-normal');
          }
        }
      };

      // 拖动过程函数
      var drag = function drag(e) {
        if (!isDragging) return;
        handleDragEvent(e);
      };

      // 拖动开始函数
      var startDrag = function startDrag(e) {
        isDragging = true;
        playbackRateSlider.classList.add('dragging');
        playbackRateSlider.classList.add('tm-playback-slider-dragging');
        handleDragEvent(e);
      };

      // 拖动结束函数
      var endDrag = function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        playbackRateSlider.classList.remove('dragging');
        playbackRateSlider.classList.remove('tm-playback-slider-dragging');
        playbackRateSlider.classList.add('tm-playback-slider-default');
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      // 处理拖动事件
      var handleDragEvent = function handleDragEvent(e) {
        e.preventDefault();
        var clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        var rect = sliderContainer.getBoundingClientRect();
        var width = rect.width;
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        rafId = requestAnimationFrame(function () {
          var percentage = (clientX - rect.left) / width * 100;
          percentage = Math.max(0, Math.min(100, percentage));

          // 添加吸附效果 - 预设的倍速点
          var snapPoints = marksPositions.map(function (mark) {
            return mark.pos;
          });
          var snapThreshold = 5;
          var _iterator = _createForOfIteratorHelper(snapPoints),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var point = _step.value;
              if (Math.abs(percentage - point) < snapThreshold) {
                percentage = point;

                // 添加触觉反馈（如果设备支持）
                if (window.navigator.vibrate) {
                  window.navigator.vibrate(5);
                }
                break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          lastPercentage = percentage;
          updateSlider(percentage);
        });
      };

      // 添加事件监听
      sliderContainer.addEventListener('mousedown', startDrag, {
        passive: false
      });
      sliderContainer.addEventListener('touchstart', startDrag, {
        passive: false
      });
      window.addEventListener('mousemove', drag, {
        passive: false
      });
      window.addEventListener('touchmove', drag, {
        passive: false
      });
      window.addEventListener('mouseup', endDrag);
      window.addEventListener('touchend', endDrag);
      window.addEventListener('mouseleave', endDrag);

      // 双击重置为1.0倍速
      playbackRateSlider.addEventListener('dblclick', function () {
        lastPercentage = 30; // 30%对应1.0倍速
        updateSlider(30);
      });

      // 初始更新一次滑块
      updateSlider(30);
      this.playbackRateSlider = playbackRateSlider; // 保存引用
      this.updatePlaybackRateSlider = updateSlider; // 保存更新函数
    }

    /**
     * 创建音量控制滑杆
     * @param {HTMLElement} container 滑杆容器
     */
  }, {
    key: "createVolumeSlider",
    value: function createVolumeSlider(container) {
      var _this5 = this;
      // 创建音量控制容器
      var volumeControl = document.createElement('div');
      volumeControl.className = 'tm-volume-control';

      // 创建音量图标按钮
      var volumeButton = document.createElement('button');
      volumeButton.className = 'tm-volume-button';
      volumeButton.innerHTML = this.getVolumeIcon(this.targetVideo.volume);

      // 创建滑杆容器
      var sliderContainer = document.createElement('div');
      sliderContainer.className = 'tm-volume-slider-container';

      // 创建滑杆轨道
      var sliderTrack = document.createElement('div');
      sliderTrack.className = 'tm-volume-slider-track';

      // 创建滑杆填充条
      this.volumeLevel = document.createElement('div');
      this.volumeLevel.className = 'tm-volume-slider-level';
      this.volumeLevel.style.width = "".concat(this.targetVideo.volume * 100, "%");

      // 创建音量值显示
      this.volumeValue = document.createElement('div');
      this.volumeValue.className = 'tm-volume-value';
      this.volumeValue.textContent = "".concat(Math.round(this.targetVideo.volume * 100), "%");

      // 组装DOM结构
      sliderTrack.appendChild(this.volumeLevel);
      sliderContainer.appendChild(sliderTrack);
      sliderContainer.appendChild(this.volumeValue);
      volumeControl.appendChild(volumeButton);
      volumeControl.appendChild(sliderContainer);

      // 存储引用
      this.volumeSlider = volumeControl;

      // 滑杆交互相关变量
      var isDragging = false;
      var isExpanded = false;
      var expandTimeout = null;

      // 更新音量的函数
      var updateVolume = function updateVolume(clientX) {
        var rect = sliderTrack.getBoundingClientRect();
        var width = rect.width;
        var percentage = (clientX - rect.left) / width * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        _this5.targetVideo.volume = percentage / 100;
        _this5.targetVideo.muted = false;
        _this5.updateVolumeUI();
      };

      // 展开滑杆函数
      var expandSlider = function expandSlider() {
        if (expandTimeout) {
          clearTimeout(expandTimeout);
        }
        volumeControl.classList.add('expanded');
        isExpanded = true;
      };

      // 收起滑杆函数
      var collapseSlider = function collapseSlider() {
        if (!isDragging) {
          volumeControl.classList.remove('expanded');
          isExpanded = false;
        }
      };

      // 音量按钮点击事件
      volumeButton.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!isExpanded) {
          expandSlider();
          // 3秒后自动收起
          expandTimeout = setTimeout(collapseSlider, 3000);
        } else {
          // 如果已经展开，则切换静音状态
          if (_this5.targetVideo.volume === 0 || _this5.targetVideo.muted) {
            _this5.targetVideo.muted = false;
            _this5.targetVideo.volume = _this5.lastVolume;
          } else {
            _this5.lastVolume = _this5.targetVideo.volume;
            _this5.targetVideo.volume = 0;
          }
          _this5.updateVolumeUI();
        }
      });

      // 滑杆点击事件
      sliderTrack.addEventListener('click', function (e) {
        e.stopPropagation();
        updateVolume(e.clientX);
      });

      // 滑杆触摸事件
      sliderTrack.addEventListener('touchstart', function (e) {
        e.stopPropagation();
        isDragging = true;
        volumeControl.classList.add('dragging');
        expandSlider();
        updateVolume(e.touches[0].clientX);
      }, {
        passive: false
      });
      sliderTrack.addEventListener('touchmove', function (e) {
        if (!isDragging) return;
        e.preventDefault();
        updateVolume(e.touches[0].clientX);
      }, {
        passive: false
      });
      sliderTrack.addEventListener('touchend', function () {
        isDragging = false;
        volumeControl.classList.remove('dragging');
        // 延迟收起滑杆
        setTimeout(collapseSlider, 1500);
      });

      // 滑杆鼠标事件
      sliderTrack.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        isDragging = true;
        volumeControl.classList.add('dragging');
        expandSlider();
        updateVolume(e.clientX);
      });
      document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        e.preventDefault();
        updateVolume(e.clientX);
      });
      document.addEventListener('mouseup', function () {
        if (isDragging) {
          isDragging = false;
          volumeControl.classList.remove('dragging');
          // 延迟收起滑杆
          setTimeout(collapseSlider, 1500);
        }
      });

      // 添加到容器
      container.appendChild(volumeControl);
    }

    /**
     * 获取音量图标
     * @param {number} volume 当前音量值
     * @returns {string} 音量图标的SVG字符串
     */
  }, {
    key: "getVolumeIcon",
    value: function getVolumeIcon(volume) {
      if (volume === 0 || this.targetVideo.muted) {
        return "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M11 5L6 9H2V15H6L11 19V5Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                <path d=\"M23 9L17 15\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                <path d=\"M17 9L23 15\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            </svg>";
      } else if (volume < 0.5) {
        return "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M11 5L6 9H2V15H6L11 19V5Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                <path d=\"M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            </svg>";
      } else {
        return "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M11 5L6 9H2V15H6L11 19V5Z\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                <path d=\"M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                <path d=\"M19.07 4.93C20.9447 6.80527 21.9979 9.34855 21.9979 12C21.9979 14.6515 20.9447 17.1947 19.07 19.07\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n            </svg>";
      }
    }

    /**
     * 更新音量UI
     */
  }, {
    key: "updateVolumeUI",
    value: function updateVolumeUI() {
      if (!this.volumeSlider) return;
      var volume = this.targetVideo.muted ? 0 : this.targetVideo.volume;
      var volumeButton = this.volumeSlider.querySelector('.tm-volume-button');

      // 更新音量图标
      if (volumeButton) {
        volumeButton.innerHTML = this.getVolumeIcon(volume);
      }

      // 更新滑杆
      if (this.volumeLevel) {
        // 确保滑杆宽度从2px开始（与CSS中的left: 2px对应）
        var levelWidth = Math.max(0, Math.min(100, volume * 100));
        this.volumeLevel.style.width = "calc(".concat(levelWidth, "% - 2px)");
      }

      // 更新音量值显示
      if (this.volumeValue) {
        // 显示百分比，四舍五入到整数
        var volumePercent = Math.round(volume * 100);
        this.volumeValue.textContent = "".concat(volumePercent, "%");

        // 根据音量值添加不同的类名
        this.volumeValue.classList.remove('volume-high', 'volume-medium', 'volume-low', 'volume-muted');
        if (volume === 0 || this.targetVideo.muted) {
          this.volumeValue.classList.add('volume-muted');
        } else if (volume < 0.3) {
          this.volumeValue.classList.add('volume-low');
        } else if (volume < 0.7) {
          this.volumeValue.classList.add('volume-medium');
        } else {
          this.volumeValue.classList.add('volume-high');
        }
      }
    }

    /**
     * 更新播放/暂停按钮状态
     */
  }, {
    key: "updatePlayPauseButton",
    value: function updatePlayPauseButton() {
      if (!this.playPauseButton) return;

      // 根据当前视频状态更新图标
      if (this.targetVideo.paused) {
        this.playPauseButton.innerHTML = "\n                <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M18 12L7 5V19L18 12Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                </svg>\n            ";
      } else {
        this.playPauseButton.innerHTML = "\n                <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M10 4H6V20H10V4Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                    <path d=\"M18 4H14V20H18V4Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                </svg>\n            ";
      }
    }

    /**
     * 更新静音按钮状态
     */
  }, {
    key: "updateMuteButton",
    value: function updateMuteButton() {
      if (!this.muteButton) return;

      // 根据当前视频状态更新图标
      if (this.targetVideo.muted) {
        this.muteButton.innerHTML = "\n                <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M11 5L6 9H2V15H6L11 19V5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                    <path d=\"M23 9L17 15\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                    <path d=\"M17 9L23 15\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                </svg>\n            ";
      } else {
        this.muteButton.innerHTML = "\n                <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                    <path d=\"M11 5L6 9H2V15H6L11 19V5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                    <path d=\"M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                    <path d=\"M18.54 5.46C20.4246 7.34535 21.4681 9.90302 21.4681 12.575C21.4681 15.247 20.4246 17.8047 18.54 19.69\" stroke=\"currentColor\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n                </svg>\n            ";
      }
    }

    /**
     * 更新进度条
     */
  }, {
    key: "updateProgressBar",
    value: function updateProgressBar() {
      if (!this.targetVideo || !this.progressBarElement || !this.progressIndicator) return;
      var currentTime = this.targetVideo.currentTime;
      var duration = this.targetVideo.duration;
      if (isNaN(duration) || duration <= 0) return;

      // 计算进度百分比
      var progressPercent = currentTime / duration * 100;

      // 更新进度指示器的宽度
      this.progressIndicator.style.width = "".concat(progressPercent, "%");

      // 更新时间显示
      this.updateCurrentTimeDisplay();

      // 如果启用了循环播放，检查是否需要循环
      if (this.loopManager && this.loopManager.loopActive && this.loopManager.loopStartTime !== null && this.loopManager.loopEndTime !== null) {
        if (currentTime >= this.loopManager.loopEndTime) {
          // 回到循环起点
          this.targetVideo.currentTime = this.loopManager.loopStartTime;
        }
      }
    }

    /**
     * 更新当前时间显示
     */
  }, {
    key: "updateCurrentTimeDisplay",
    value: function updateCurrentTimeDisplay() {
      if (!this.targetVideo || !this.currentTimeDisplay || !this.totalDurationDisplay) return;
      var currentTime = this.targetVideo.currentTime;
      var duration = this.targetVideo.duration;
      if (isNaN(duration)) return;

      // 更新当前时间显示
      this.currentTimeDisplay.textContent = this.formatTime(currentTime);

      // 计算并显示剩余时长，而不是总时长
      var remainingTime = duration - currentTime;
      this.totalDurationDisplay.textContent = "-".concat(this.formatTime(remainingTime));
    }

    /**
     * 添加时间控制按钮
     * @param {HTMLElement} container 按钮容器
     * @param {string} text 按钮文本
     * @param {Function} callback 点击回调函数
     * @returns {HTMLElement} 创建的按钮元素
     */
  }, {
    key: "addTimeControlButton",
    value: function addTimeControlButton(container, text, callback) {
      // 计算透明度：根据跳转时间计算透明度
      var calculateOpacity = function calculateOpacity(text) {
        // 提取时间值和单位
        var value = parseInt(text.replace(/[+-]/g, ''));
        var unit = text.includes('m') ? 'm' : 's';

        // 定义透明度区间
        var opacity = 0.5; // 默认透明度

        // 秒级跳转按钮透明度较低
        if (unit === 's') {
          if (value <= 5) opacity = 0.5;else if (value <= 10) opacity = 0.6;else opacity = 0.7; // 30s
        }
        // 分钟级跳转按钮透明度较高
        else if (unit === 'm') {
          if (value === 1) opacity = 0.8;else if (value === 5) opacity = 0.9;else opacity = 1.0; // 10m
        }
        return opacity;
      };
      var opacity = calculateOpacity(text);
      var button = document.createElement('button');
      button.className = 'tm-time-control-button';
      button.style.backgroundColor = "hsl(var(--shadcn-secondary) / ".concat(opacity, ")");

      // 检查文本是否包含时间指示
      var isRewind = text.includes('-');
      var isForward = text.includes('+');
      var pureText = text.replace(/[+-]/g, ''); // 移除加减号

      // 创建SVG图标
      var rewindSvg = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 12 24\" fill=\"none\" class=\"tm-rewind-icon\">\n            <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M3.70711 4.29289C3.31658 3.90237 2.68342 3.90237 2.29289 4.29289L-4.70711 11.2929C-5.09763 11.6834 -5.09763 12.3166 -4.70711 12.7071L2.29289 19.7071C2.68342 20.0976 3.31658 20.0976 3.70711 19.7071C4.09763 19.3166 4.09763 18.6834 3.70711 18.2929L-2.58579 12L3.70711 5.70711C4.09763 5.31658 4.09763 4.68342 3.70711 4.29289Z\" fill=\"currentColor\"/>\n        </svg>";
      var forwardSvg = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 12 24\" fill=\"none\" class=\"tm-forward-icon\">\n            <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M8.29289 4.29289C8.68342 3.90237 9.31658 3.90237 9.70711 4.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L9.70711 19.7071C9.31658 20.0976 8.68342 20.0976 8.29289 19.7071C7.90237 19.3166 7.90237 18.6834 8.29289 18.2929L14.5858 12L8.29289 5.70711C7.90237 5.31658 7.90237 4.68342 8.29289 4.29289Z\" fill=\"currentColor\"/>\n        </svg>";

      // 设置按钮内容
      if (isRewind) {
        button.innerHTML = "<div class=\"tm-time-control-button-inner\">".concat(rewindSvg, "<span class=\"tm-time-text-margin-left\">").concat(pureText, "</span></div>");
      } else if (isForward) {
        button.innerHTML = "<div class=\"tm-time-control-button-inner\"><span class=\"tm-time-text-margin-right\">".concat(pureText, "</span>").concat(forwardSvg, "</div>");
      } else {
        button.textContent = text;
      }
      button.addEventListener('click', callback);

      // 添加悬停效果
      button.addEventListener('mouseover', function () {
        button.classList.add('tm-time-control-button-hover');
        button.classList.remove('tm-time-control-button-default');
      });
      button.addEventListener('mouseout', function () {
        button.classList.add('tm-time-control-button-default');
        button.classList.remove('tm-time-control-button-hover', 'tm-time-control-button-active', 'tm-time-control-button-after-active');
      });

      // 点击效果
      button.addEventListener('mousedown', function () {
        button.classList.add('tm-time-control-button-active');
        button.classList.remove('tm-time-control-button-hover', 'tm-time-control-button-default', 'tm-time-control-button-after-active');
      });
      button.addEventListener('mouseup', function () {
        button.classList.add('tm-time-control-button-after-active');
        button.classList.remove('tm-time-control-button-active', 'tm-time-control-button-hover', 'tm-time-control-button-default');
      });
      container.appendChild(button);
      return button;
    }

    /**
     * 相对时间跳转
     * @param {number} seconds 跳转的秒数，正数表示向前，负数表示向后
     */
  }, {
    key: "seekRelative",
    value: function seekRelative(seconds) {
      if (!this.targetVideo) return;
      var newTime = Math.max(0, Math.min(this.targetVideo.duration, this.targetVideo.currentTime + seconds));
      this.targetVideo.currentTime = newTime;
    }

    /**
     * 格式化时间
     */
  }, {
    key: "formatTime",
    value: function formatTime(seconds) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor(seconds % 3600 / 60);
      var remainingSeconds = Math.floor(seconds % 60);
      return "".concat(hours, ":").concat(minutes.toString().padStart(2, '0'), ":").concat(remainingSeconds.toString().padStart(2, '0'));
    }

    /**
     * 添加控制按钮
     * @param {HTMLElement} container 按钮容器
     * @param {string} text 按钮文本
     * @param {Function} callback 点击回调函数
     * @returns {HTMLElement} 创建的按钮元素
     */
  }, {
    key: "addControlButton",
    value: function addControlButton(container, text, callback) {
      var button = document.createElement('button');
      button.className = 'tm-control-button';
      button.textContent = text;
      button.addEventListener('click', callback);

      // 添加悬停效果
      button.addEventListener('mouseover', function () {
        button.classList.add('tm-control-button-hover');
        button.classList.remove('tm-control-button-default');
      });
      button.addEventListener('mouseout', function () {
        button.classList.add('tm-control-button-default');
        button.classList.remove('tm-control-button-hover');
      });
      container.appendChild(button);
      return button;
    }

    /**
     * 显示暂停指示器
     */
  }, {
    key: "showPauseIndicator",
    value: function showPauseIndicator() {
      var _this6 = this;
      // 如果指示器已存在，则移除它
      if (this.pauseIndicator) {
        if (this.pauseIndicator.parentNode) {
          this.pauseIndicator.parentNode.removeChild(this.pauseIndicator);
        }
        this.pauseIndicator = null;
      }

      // 创建暂停指示器元素
      this.pauseIndicator = document.createElement('div');
      this.pauseIndicator.className = 'tm-indicator-base tm-pause-indicator';

      // 设置样式定位到视频中心
      this.pauseIndicator.style.position = 'absolute';
      this.pauseIndicator.style.top = '50%';
      this.pauseIndicator.style.left = '50%';
      this.pauseIndicator.style.transform = 'translate(-50%, -50%)';
      this.pauseIndicator.style.display = 'flex';
      this.pauseIndicator.style.justifyContent = 'center';
      this.pauseIndicator.style.alignItems = 'center';

      // 添加暂停图标
      this.pauseIndicator.innerHTML = "\n            <svg width=\"32\" height=\"32\" viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                <path d=\"M14,6v20c0,1.1-0.9,2-2,2H8c-1.1,0-2-0.9-2-2V6c0-1.1,0.9-2,2-2h4C13.1,4,14,4.9,14,6z M24,4h-4\n                c-1.1,0-2,0.9-2,2v20c0,1.1,0.9,2,2,2h4c1.1,0,2-0.9,2-2V6C26,4.9,25.1,4,24,4z\" fill=\"white\"/>\n            </svg>\n        ";

      // 添加到视频包装器
      this.uiElements.videoWrapper.appendChild(this.pauseIndicator);

      // 延迟一帧后显示，确保过渡动画生效
      requestAnimationFrame(function () {
        _this6.pauseIndicator.classList.add('visible');
      });

      // 1秒后开始淡出
      setTimeout(function () {
        if (_this6.pauseIndicator) {
          _this6.pauseIndicator.classList.remove('visible');

          // 等待过渡效果完成后移除元素
          setTimeout(function () {
            if (_this6.pauseIndicator && _this6.pauseIndicator.parentNode) {
              _this6.pauseIndicator.parentNode.removeChild(_this6.pauseIndicator);
              _this6.pauseIndicator = null;
            }
          }, 300); // 过渡效果持续时间
        }
      }, 1000);
    }

    /**
     * 显示播放倍速指示器
     * @param {number} rate - 当前播放速度
     */
  }, {
    key: "showPlaybackRateIndicator",
    value: function showPlaybackRateIndicator(rate) {
      var _this7 = this;
      // 如果指示器已存在，清除之前的定时器并移除它
      if (this.playbackRateIndicator) {
        clearTimeout(this.playbackRateIndicator.hideTimeout);
        if (this.playbackRateIndicator.parentNode) {
          this.playbackRateIndicator.parentNode.removeChild(this.playbackRateIndicator);
        }
        this.playbackRateIndicator = null;
      }

      // 创建倍速指示器
      this.playbackRateIndicator = document.createElement('div');
      this.playbackRateIndicator.className = 'tm-indicator-base tm-playback-rate-indicator';

      // 设置样式
      this.playbackRateIndicator.style.position = 'absolute';
      this.playbackRateIndicator.style.top = '20%';
      this.playbackRateIndicator.style.left = '50%';
      this.playbackRateIndicator.style.transform = 'translateX(-50%)';

      // 设置倍速文本
      this.playbackRateIndicator.textContent = "".concat(rate.toFixed(1), "x");

      // 根据速度调整颜色
      if (rate > 1.5) {
        this.playbackRateIndicator.style.color = 'hsl(var(--shadcn-orange))';
      } else if (rate < 0.8) {
        this.playbackRateIndicator.style.color = 'hsl(var(--shadcn-blue))';
      }

      // 添加到视频包装器
      this.uiElements.videoWrapper.appendChild(this.playbackRateIndicator);

      // 延迟一帧后显示，确保过渡动画生效
      requestAnimationFrame(function () {
        _this7.playbackRateIndicator.classList.add('visible');
      });

      // 1.5秒后开始淡出
      this.playbackRateIndicator.hideTimeout = setTimeout(function () {
        if (_this7.playbackRateIndicator) {
          _this7.playbackRateIndicator.classList.remove('visible');

          // 等待过渡效果完成后移除元素
          setTimeout(function () {
            if (_this7.playbackRateIndicator && _this7.playbackRateIndicator.parentNode) {
              _this7.playbackRateIndicator.parentNode.removeChild(_this7.playbackRateIndicator);
              _this7.playbackRateIndicator = null;
            }
          }, 300); // 过渡效果持续时间
        }
      }, 1500);
    }
  }]);
}();
;// ./src/player/managers/DragManager.js
function DragManager_typeof(o) { "@babel/helpers - typeof"; return DragManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, DragManager_typeof(o); }
function DragManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function DragManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, DragManager_toPropertyKey(o.key), o); } }
function DragManager_createClass(e, r, t) { return r && DragManager_defineProperties(e.prototype, r), t && DragManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function DragManager_toPropertyKey(t) { var i = DragManager_toPrimitive(t, "string"); return "symbol" == DragManager_typeof(i) ? i : i + ""; }
function DragManager_toPrimitive(t, r) { if ("object" != DragManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != DragManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 拖动管理器类 - 负责拖动和大小调整功能
 */
var DragManager = /*#__PURE__*/function () {
  function DragManager(playerCore, uiElements) {
    DragManager_classCallCheck(this, DragManager);
    // 核心引用
    this.playerCore = playerCore;
    this.targetVideo = playerCore.targetVideo;

    // UI元素引用
    this.uiElements = uiElements;
    this.container = uiElements.container;
    this.handle = uiElements.handle;

    // 拖动状态管理
    this.isDraggingHandle = false; // 是否正在拖动句柄
    this.startX = 0;
    this.startY = 0;
    this.startWidth = 0;
    this.startHeight = 0;
    this.handleMoveHandler = null; // 句柄移动事件处理函数
    this.handleEndHandler = null; // 句柄释放事件处理函数
  }

  /**
   * 初始化拖动管理器
   */
  return DragManager_createClass(DragManager, [{
    key: "init",
    value: function init() {
      // 设置拖动处理事件
      this.handle.addEventListener('mousedown', this.startHandleDrag.bind(this));
      this.handle.addEventListener('touchstart', this.startHandleDrag.bind(this), {
        passive: false
      });
      return this;
    }

    /**
     * 更新手柄位置
     */
  }, {
    key: "updateHandlePosition",
    value: function updateHandlePosition() {
      if (!this.uiElements.handleContainer || !this.container) return;

      // 获取视频容器的位置信息
      var containerRect = this.container.getBoundingClientRect();
      var videoWrapperRect = this.uiElements.videoWrapper.getBoundingClientRect();

      // 设置手柄位置在视频容器下方
      this.uiElements.handleContainer.style.top = "".concat(videoWrapperRect.bottom, "px");
    }

    /**
     * 开始手柄拖动 (只处理Y轴，X轴由swipeManager处理)
     */
  }, {
    key: "startHandleDrag",
    value: function startHandleDrag(e) {
      this.isDraggingHandle = true;
      this.handle.style.cursor = 'grabbing';
      var touch = e.type.includes('touch');
      this.startY = touch ? e.touches[0].clientY : e.clientY;
      this.startHeight = this.container.offsetHeight;
      var moveHandler = this._handleDragMove.bind(this);
      var endHandler = this._handleDragEnd.bind(this);
      if (touch) {
        document.addEventListener('touchmove', moveHandler, {
          passive: false
        });
        document.addEventListener('touchend', endHandler);
        document.addEventListener('touchcancel', endHandler);
      } else {
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', endHandler);
      }

      // 存储事件处理函数以便移除
      this.handleMoveHandler = moveHandler;
      this.handleEndHandler = endHandler;
      e.preventDefault();
    }

    /**
     * 手柄移动处理 (只处理Y轴)
     */
  }, {
    key: "_handleDragMove",
    value: function _handleDragMove(e) {
      if (!this.isDraggingHandle) return;
      e.preventDefault();
      var touch = e.type.includes('touch');
      var currentY = touch ? e.touches[0].clientY : e.clientY;
      var deltaY = currentY - this.startY;

      // 获取容器当前的最小高度作为约束
      var minHeight = parseFloat(this.container.style.minHeight) || window.innerWidth * (9 / 16);

      // 处理Y轴 (调整高度)
      var newHeight = Math.max(minHeight, this.startHeight + deltaY);
      this.container.style.height = newHeight + 'px';

      // updateHandlePosition会被ResizeObserver自动调用
    }

    /**
     * 手柄拖动结束
     */
  }, {
    key: "_handleDragEnd",
    value: function _handleDragEnd(e) {
      if (!this.isDraggingHandle) return;
      this.isDraggingHandle = false;
      this.handle.style.cursor = 'grab';

      // 移除监听器
      document.removeEventListener('touchmove', this.handleMoveHandler);
      document.removeEventListener('touchend', this.handleEndHandler);
      document.removeEventListener('touchcancel', this.handleEndHandler);
      document.removeEventListener('mousemove', this.handleMoveHandler);
      document.removeEventListener('mouseup', this.handleEndHandler);

      // 清理存储的引用
      this.handleMoveHandler = null;
      this.handleEndHandler = null;
      if (e.type.startsWith('touch')) {
        e.preventDefault();
      }
    }

    /**
     * 处理鼠标按下事件
     */
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(event) {
      if (event.button !== 0) return; // 只处理左键点击

      this.isDraggingHandle = true;
      this.startY = event.clientY;
      this.startHeight = this.uiElements.handleContainer.offsetHeight;
      this.handleMoveHandler = this.handleMouseMove.bind(this);
      this.handleEndHandler = this.handleMouseUp.bind(this);

      // 添加事件监听器
      document.addEventListener('mousemove', this.handleMoveHandler);
      document.addEventListener('mouseup', this.handleEndHandler);

      // 更新手柄位置
      this.updateHandlePosition();
    }

    /**
     * 处理鼠标移动事件
     */
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(event) {
      if (!this.isDraggingHandle) return;
      var deltaY = event.clientY - this.startY;
      var newHeight = this.startHeight + deltaY;
      if (newHeight < 50 || newHeight > 200) return; // 限制手柄高度范围

      this.uiElements.handleContainer.style.height = "".concat(newHeight, "px");
      this.updateHandlePosition();
    }

    /**
     * 处理鼠标释放事件
     */
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(event) {
      this.isDraggingHandle = false;

      // 移除事件监听器
      document.removeEventListener('mousemove', this.handleMoveHandler);
      document.removeEventListener('mouseup', this.handleEndHandler);

      // 更新手柄位置
      this.updateHandlePosition();
    }

    /**
     * 处理鼠标离开事件
     */
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave(event) {
      this.isDraggingHandle = false;

      // 移除事件监听器
      document.removeEventListener('mousemove', this.handleMoveHandler);
      document.removeEventListener('mouseup', this.handleEndHandler);

      // 更新手柄位置
      this.updateHandlePosition();
    }
  }]);
}();
;// ./src/player/managers/LoopManager.js
function LoopManager_typeof(o) { "@babel/helpers - typeof"; return LoopManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, LoopManager_typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || LoopManager_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function LoopManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return LoopManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? LoopManager_arrayLikeToArray(r, a) : void 0; } }
function LoopManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function LoopManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function LoopManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, LoopManager_toPropertyKey(o.key), o); } }
function LoopManager_createClass(e, r, t) { return r && LoopManager_defineProperties(e.prototype, r), t && LoopManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function LoopManager_toPropertyKey(t) { var i = LoopManager_toPrimitive(t, "string"); return "symbol" == LoopManager_typeof(i) ? i : i + ""; }
function LoopManager_toPrimitive(t, r) { if ("object" != LoopManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != LoopManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 循环管理器类 - 负责循环播放功能
 */
var LoopManager = /*#__PURE__*/function () {
  function LoopManager(playerCore, uiElements) {
    LoopManager_classCallCheck(this, LoopManager);
    // 核心引用
    this.playerCore = playerCore;
    this.targetVideo = playerCore.targetVideo;

    // UI元素引用
    this.uiElements = uiElements;

    // 循环控制相关
    this.loopStartTime = null;
    this.loopEndTime = null;
    this.loopActive = false;
    this.loopStartMarker = null;
    this.loopEndMarker = null;
    this.loopRangeElement = null;
    this.currentPositionDisplay = null;
    this.durationDisplay = null;
    this.loopToggleButton = null;

    // 时间更新处理器
    this._handleLoopTimeUpdate = this._handleLoopTimeUpdate.bind(this);
  }

  /**
   * 初始化循环管理器
   */
  return LoopManager_createClass(LoopManager, [{
    key: "init",
    value: function init(loopElements) {
      this.loopStartMarker = loopElements.loopStartMarker;
      this.loopEndMarker = loopElements.loopEndMarker;
      this.loopRangeElement = loopElements.loopRangeElement;
      this.currentPositionDisplay = loopElements.currentPositionDisplay;
      this.durationDisplay = loopElements.durationDisplay;
      this.loopToggleButton = loopElements.loopToggleButton;

      // 解析URL参数设置循环点
      this._parseUrlHashParams();
      return this;
    }

    /**
     * 状态管理方法 - 统一更新状态并触发UI更新
     * @param {Object} newState - 要更新的状态对象
     */
  }, {
    key: "setState",
    value: function setState(newState) {
      // 记录状态变化的日志（便于调试）
      console.log('[LoopManager] 状态更新:', Object.keys(newState).map(function (key) {
        return "".concat(key, ": ").concat(newState[key]);
      }).join(', '));

      // 更新状态
      Object.assign(this, newState);

      // 触发UI更新
      this._updateUI();

      // 返回this以支持链式调用
      return this;
    }

    /**
     * 解析URL hash参数并设置循环点
     */
  }, {
    key: "_parseUrlHashParams",
    value: function _parseUrlHashParams() {
      var _this = this;
      if (!window.location.hash) return;
      var hash = window.location.hash.substring(1); // 去掉#

      // 检查是否有时间区间 (格式: 00:00:09-00:00:13)
      if (hash.includes('-')) {
        var _hash$split = hash.split('-'),
          _hash$split2 = _slicedToArray(_hash$split, 2),
          startTime = _hash$split2[0],
          endTime = _hash$split2[1];
        var startSeconds = this._parseTimeString(startTime);
        var endSeconds = this._parseTimeString(endTime);
        if (startSeconds !== null && endSeconds !== null) {
          console.log("[LoopManager] \u4ECEURL\u89E3\u6790\u5FAA\u73AF\u533A\u95F4: ".concat(startTime, "-").concat(endTime));

          // 设置循环点（不使用setState避免提前更新UI）
          var newState = {
            loopStartTime: startSeconds,
            loopEndTime: endSeconds
          };

          // 等视频元数据加载完成后再跳转和启用循环
          var _handleMetadata = function handleMetadata() {
            // 直接更新时间显示，避免时序问题
            if (_this.currentPositionDisplay) {
              _this.currentPositionDisplay.textContent = _this.formatTimeWithHours(startSeconds);
              _this.currentPositionDisplay.classList.add('active');
              var startContainer = document.querySelector('.tm-start-time-container');
              if (startContainer) startContainer.classList.add('active');
            }
            if (_this.durationDisplay) {
              _this.durationDisplay.textContent = _this.formatTimeWithHours(endSeconds);
              _this.durationDisplay.classList.add('active');
              var endContainer = document.querySelector('.tm-end-time-container');
              if (endContainer) endContainer.classList.add('active');
            }

            // 跳转到开始点
            _this.targetVideo.currentTime = startSeconds;

            // 保留对missav网站的特殊检查
            if (window.location.hostname.includes('missav')) {
              // 在missav网站上，循环播放是默认启用的
              newState.loopActive = true;
              console.log('[LoopManager] 在missav网站上设置循环状态');
            } else {
              // 在其他网站上，也需要启用循环
              newState.loopActive = true;
              console.log('[LoopManager] 在其他网站上设置循环状态');
            }

            // 统一更新状态和UI（将触发_updateUI，更新所有按钮状态）
            _this.setState(newState);

            // 强制更新标记点和进度条
            _this.updateLoopMarkers();

            // 添加事件监听器
            _this.targetVideo.removeEventListener('timeupdate', _this._handleLoopTimeUpdate);
            _this.targetVideo.addEventListener('timeupdate', _this._handleLoopTimeUpdate);

            // 自动播放视频
            if (_this.targetVideo.paused) {
              _this.targetVideo.play()["catch"](function (error) {
                console.log('视频自动播放被阻止: ', error);
                // 不再尝试静音播放，保持暂停状态
              });
            }

            // 移除监听器
            _this.targetVideo.removeEventListener('loadedmetadata', _handleMetadata);
          };
          if (this.targetVideo.readyState >= 1) {
            _handleMetadata();
          } else {
            this.targetVideo.addEventListener('loadedmetadata', _handleMetadata);
          }
        }
      }
      // 检查是否只有单个时间点 (格式: 00:00:09)
      else if (hash.match(/^\d{2}:\d{2}:\d{2}$/)) {
        var _startSeconds = this._parseTimeString(hash);
        if (_startSeconds !== null) {
          console.log("[LoopManager] \u4ECEURL\u89E3\u6790\u65F6\u95F4\u70B9: ".concat(hash));

          // 等视频元数据加载完成后再跳转
          var _handleMetadata2 = function handleMetadata() {
            // 直接更新时间显示，避免时序问题
            if (_this.currentPositionDisplay) {
              _this.currentPositionDisplay.textContent = _this.formatTimeWithHours(_startSeconds);
              _this.currentPositionDisplay.classList.add('active');
              var startContainer = document.querySelector('.tm-start-time-container');
              if (startContainer) startContainer.classList.add('active');
            }

            // 跳转到指定时间点并更新状态
            _this.targetVideo.currentTime = _startSeconds;

            // 更新状态（将触发_updateUI，更新A按钮样式）
            _this.setState({
              loopStartTime: _startSeconds
            });

            // 强制更新标记点
            _this.updateLoopMarkers();

            // 移除监听器
            _this.targetVideo.removeEventListener('loadedmetadata', _handleMetadata2);
          };
          if (this.targetVideo.readyState >= 1) {
            _handleMetadata2();
          } else {
            this.targetVideo.addEventListener('loadedmetadata', _handleMetadata2);
          }
        }
      }
    }

    /**
     * 将时间字符串解析为秒数
     * @param {string} timeString - 格式为 "HH:MM:SS" 的时间字符串
     * @returns {number|null} - 解析出的秒数，或null（如果解析失败）
     */
  }, {
    key: "_parseTimeString",
    value: function _parseTimeString(timeString) {
      if (!timeString) return null;
      var match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/);
      if (!match) return null;
      var hours = parseInt(match[1], 10);
      var minutes = parseInt(match[2], 10);
      var seconds = parseInt(match[3], 10);
      return hours * 3600 + minutes * 60 + seconds;
    }

    /**
     * 更新URL，添加循环点信息
     */
  }, {
    key: "_updateUrlHash",
    value: function _updateUrlHash() {
      var hash = '';
      if (this.loopStartTime !== null) {
        hash = this.formatTimeWithHours(this.loopStartTime);
        if (this.loopEndTime !== null) {
          hash += "-".concat(this.formatTimeWithHours(this.loopEndTime));
        }
      }

      // 使用history.replaceState更新URL而不添加历史记录
      if (hash) {
        var newUrl = window.location.pathname + window.location.search + '#' + hash;
        window.history.replaceState(null, '', newUrl);
        console.log("[LoopManager] \u66F4\u65B0URL: ".concat(newUrl));
      }
    }

    // 模拟点击-复制开始时间
  }, {
    key: "_clickCopyStartTime",
    value: function _clickCopyStartTime() {
      var startTimeButton = document.querySelector('input#clip-start-time + a');
      startTimeButton.click();
    }

    // 模拟点击-复制结束时间
  }, {
    key: "_clickCopyEndTime",
    value: function _clickCopyEndTime() {
      var endTimeButton = document.querySelector('input#clip-end-time + a');
      endTimeButton.click();
    }

    // 模拟点击-切换循环播放
  }, {
    key: "_toggleLooping",
    value: function _toggleLooping() {
      var loopButton = document.querySelector('.sm\\:ml-6 button');
      loopButton.click();
    }

    /**
     * 设置循环结束点 - 复制当前播放时间
     */
  }, {
    key: "setLoopEnd",
    value: function setLoopEnd() {
      if (!this.targetVideo) return;
      var currentTime = this.targetVideo.currentTime;
      if (window.location.hostname.includes('missav')) {
        this._clickCopyEndTime();
        // 使用setState更新状态
        this.setState({
          loopEndTime: currentTime
        });
      } else {
        // 如果开始点已设置，确保结束点在开始点之后
        if (this.loopStartTime !== null && currentTime <= this.loopStartTime) {
          console.log('[LoopManager] 循环结束点必须在开始点之后');
          return;
        }

        // 使用setState更新状态
        this.setState({
          loopEndTime: currentTime
        });
        console.log("[LoopManager] \u8BBE\u7F6E\u5FAA\u73AF\u7ED3\u675F\u70B9: ".concat(this.formatTimeWithHours(currentTime)));

        // 更新URL
        this._updateUrlHash();
      }

      // 触觉反馈
      if (window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
    }

    /**
     * 设置循环开始点 - 复制当前播放时间
     */
  }, {
    key: "setLoopStart",
    value: function setLoopStart() {
      if (!this.targetVideo) return;
      var currentTime = this.targetVideo.currentTime;
      if (window.location.hostname.includes('missav')) {
        this._clickCopyStartTime();
        // 使用setState更新状态
        this.setState({
          loopStartTime: currentTime
        });
      } else {
        // 如果结束点已设置，确保开始点在结束点之前
        if (this.loopEndTime !== null && currentTime >= this.loopEndTime) {
          console.log('[LoopManager] 循环开始点必须在结束点之前');
          return;
        }

        // 使用setState更新状态
        this.setState({
          loopStartTime: currentTime
        });
        console.log("[LoopManager] \u8BBE\u7F6E\u5FAA\u73AF\u5F00\u59CB\u70B9: ".concat(this.formatTimeWithHours(currentTime)));

        // 更新URL
        this._updateUrlHash();
      }

      // 触觉反馈
      if (window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
    }

    /**
     * 启用/禁用循环播放 - 切换循环状态
     */
  }, {
    key: "toggleLoop",
    value: function toggleLoop() {
      if (window.location.hostname.includes('missav')) {
        this._toggleLooping();
      } else {
        // 检查是否已设置开始和结束时间
        if (this.loopStartTime === null || this.loopEndTime === null) {
          console.log("请先使用 A 和 B 按钮记录循环的开始和结束时间。");
          return;
        }

        // 切换循环状态
        var newLoopActive = !this.loopActive;

        // 根据新状态执行相应操作
        if (newLoopActive) {
          this.enableLoop();
        } else {
          this.disableLoop();
        }
      }
    }

    /**
     * 启用循环播放
     */
  }, {
    key: "enableLoop",
    value: function enableLoop() {
      if (!this.targetVideo || this.loopStartTime === null || this.loopEndTime === null) {
        console.log('[LoopManager] 无法启用循环: 循环点未设置');
        return;
      }
      console.log("[LoopManager] \u542F\u7528\u5FAA\u73AF\u64AD\u653E: ".concat(this.formatTimeWithHours(this.loopStartTime), " - ").concat(this.formatTimeWithHours(this.loopEndTime)));

      // 更新状态
      this.setState({
        loopActive: true
      });

      // 移除原有监听器，确保不重复添加
      this.targetVideo.removeEventListener('timeupdate', this._handleLoopTimeUpdate);

      // 添加时间更新监听器
      this.targetVideo.addEventListener('timeupdate', this._handleLoopTimeUpdate);

      // 如果当前时间不在循环范围内，跳转到循环起始点
      if (this.targetVideo.currentTime < this.loopStartTime || this.targetVideo.currentTime > this.loopEndTime) {
        this.targetVideo.currentTime = this.loopStartTime;
      }

      // 无论视频是否暂停，都开始播放
      if (this.targetVideo.paused) {
        this.targetVideo.play()["catch"](function (error) {
          console.log('视频自动播放被阻止: ', error);
          // 不再尝试静音播放，保持暂停状态
        });
      }

      // 触觉反馈
      if (window.navigator.vibrate) {
        window.navigator.vibrate([10, 30, 10]);
      }
    }

    /**
     * 禁用循环播放
     */
  }, {
    key: "disableLoop",
    value: function disableLoop() {
      if (!this.loopActive) return;
      console.log('[LoopManager] 禁用循环播放');

      // 移除事件监听器
      this.targetVideo.removeEventListener('timeupdate', this._handleLoopTimeUpdate);

      // 更新状态
      this.setState({
        loopActive: false
      });
    }

    /**
     * 循环播放时间更新处理器
     * 在播放到结束点时自动跳回开始点
     */
  }, {
    key: "_handleLoopTimeUpdate",
    value: function _handleLoopTimeUpdate() {
      if (!this.loopActive || this.loopStartTime === null || this.loopEndTime === null) return;
      var currentTime = this.targetVideo.currentTime;

      // 如果当前时间超过了循环结束点或小于开始点，跳回循环开始点
      if (currentTime >= this.loopEndTime || currentTime < this.loopStartTime) {
        this.targetVideo.currentTime = this.loopStartTime;
      }
    }

    /**
     * 更新所有UI元素
     */
  }, {
    key: "_updateUI",
    value: function _updateUI() {
      console.log('[LoopManager] 更新UI元素 - 循环状态:', this.loopActive ? '激活' : '未激活', '开始点:', this.loopStartTime !== null ? this.formatTimeWithHours(this.loopStartTime) : '未设置', '结束点:', this.loopEndTime !== null ? this.formatTimeWithHours(this.loopEndTime) : '未设置');

      // 更新循环时间显示（A和B按钮）
      this.updateLoopTimeDisplay();

      // 更新循环标记点
      this.updateLoopMarkers();

      // 更新循环按钮样式
      this._updateLoopButtonStyle();
    }

    /**
     * 更新循环开关按钮状态
     */
  }, {
    key: "_updateLoopButtonStyle",
    value: function _updateLoopButtonStyle() {
      if (!this.loopToggleButton) return;
      if (this.loopActive) {
        // 激活状态 - 使用CSS类控制样式
        this.loopToggleButton.classList.add('active');

        // 更新指示器圆圈颜色 - 通过CSS类控制
        var indicator = this.loopToggleButton.querySelector('.tm-loop-indicator-circle');
        if (indicator) {
          indicator.setAttribute('fill', 'hsl(var(--shadcn-red))');
        }

        // 更新标签样式 - 通过CSS类控制
        var label = this.loopToggleButton.querySelector('.tm-loop-toggle-label');
        if (label) {
          label.classList.add('active'); // 添加.active类
        }
      } else {
        // 非激活状态 - 移除CSS类
        this.loopToggleButton.classList.remove('active');

        // 更新指示器圆圈颜色
        var _indicator = this.loopToggleButton.querySelector('.tm-loop-indicator-circle');
        if (_indicator) {
          _indicator.setAttribute('fill', 'hsl(var(--shadcn-muted-foreground) / 0.5)');
        }

        // 更新标签样式
        var _label = this.loopToggleButton.querySelector('.tm-loop-toggle-label');
        if (_label) {
          _label.classList.remove('active'); // 移除.active类
        }
      }
    }

    /**
     * 更新开始时间容器样式
     */
  }, {
    key: "_updateStartTimeContainerStyle",
    value: function _updateStartTimeContainerStyle() {
      var startContainer = document.querySelector('.tm-start-time-container');
      if (!startContainer) return;
      if (this.loopStartTime !== null) {
        // 更新时间文本
        this.currentPositionDisplay.textContent = this.formatTimeWithHours(this.loopStartTime);

        // 添加激活样式 - 使用强制风格更新
        this.currentPositionDisplay.classList.add('active');

        // 设置容器样式 - 根据是否有开始时间添加激活类
        startContainer.classList.add('active');

        // 确保A按钮的样式已应用
        var aButton = startContainer.querySelector('.tm-loop-start-button');
        if (aButton) {
          aButton.classList.add('active');
        }
      } else {
        // 未设置开始时间的默认样式
        this.currentPositionDisplay.textContent = '00:00:00';

        // 移除激活样式
        this.currentPositionDisplay.classList.remove('active');
        this.currentPositionDisplay.style.color = '';

        // 移除激活样式
        startContainer.classList.remove('active');
        startContainer.style.backgroundColor = '';
        startContainer.style.borderColor = '';

        // 重置A按钮样式
        var _aButton = startContainer.querySelector('.tm-loop-start-button');
        if (_aButton) {
          _aButton.classList.remove('active');
        }
      }

      // 强制使样式生效的小技巧
      startContainer.offsetHeight;
    }

    /**
     * 更新结束时间容器样式
     */
  }, {
    key: "_updateEndTimeContainerStyle",
    value: function _updateEndTimeContainerStyle() {
      var endContainer = document.querySelector('.tm-end-time-container');
      if (!endContainer) return;
      if (this.loopEndTime !== null) {
        // 更新时间文本
        this.durationDisplay.textContent = this.formatTimeWithHours(this.loopEndTime);

        // 添加激活样式 - 使用强制风格更新
        this.durationDisplay.classList.add('active');

        // 设置容器样式 - 根据是否有结束时间添加激活类
        endContainer.classList.add('active');

        // 确保B按钮的样式已应用
        var bButton = endContainer.querySelector('.tm-loop-end-button');
        if (bButton) {
          bButton.classList.add('active');
        }
      } else {
        // 未设置结束时间的默认样式
        this.durationDisplay.textContent = '00:00:00';

        // 移除激活样式
        this.durationDisplay.classList.remove('active');
        this.durationDisplay.style.color = '';

        // 移除激活样式
        endContainer.classList.remove('active');
        endContainer.style.backgroundColor = '';
        endContainer.style.borderColor = '';

        // 重置B按钮样式
        var _bButton = endContainer.querySelector('.tm-loop-end-button');
        if (_bButton) {
          _bButton.classList.remove('active');
        }
      }

      // 强制使样式生效的小技巧
      endContainer.offsetHeight;
    }

    /**
     * 更新循环时间显示
     */
  }, {
    key: "updateLoopTimeDisplay",
    value: function updateLoopTimeDisplay() {
      // 更新开始时间显示
      this._updateStartTimeContainerStyle();

      // 更新结束时间显示
      this._updateEndTimeContainerStyle();
    }

    /**
     * 创建和更新循环标记点
     */
  }, {
    key: "updateLoopMarkers",
    value: function updateLoopMarkers() {
      var _this2 = this;
      if (!this.targetVideo || !this.loopStartMarker || !this.loopEndMarker) return;
      var progressBarElement = document.querySelector('.tm-progress-bar');
      if (!progressBarElement) return;
      var progressWidth = progressBarElement.offsetWidth;
      var duration = this.targetVideo.duration;
      if (duration <= 0 || !progressWidth) return;

      // 创建标记点辅助函数
      var createMarker = function createMarker(time, isStart) {
        var marker = isStart ? _this2.loopStartMarker : _this2.loopEndMarker;
        if (time !== null && !isNaN(time) && time >= 0 && time <= duration) {
          var position = time / duration * 100;
          marker.style.left = "".concat(position, "%");
          marker.style.display = 'block';

          // 更新标记状态 - 循环激活时应用active类
          if (_this2.loopActive) {
            marker.classList.add('active');
          } else {
            marker.classList.remove('active');
          }

          // 添加悬停提示
          marker.setAttribute('title', isStart ? "\u5FAA\u73AF\u8D77\u70B9: ".concat(_this2.formatTimeWithHours(time)) : "\u5FAA\u73AF\u7EC8\u70B9: ".concat(_this2.formatTimeWithHours(time)));

          // 设置额外的数据属性用于显示标签
          marker.setAttribute('data-time', _this2.formatTimeWithHours(time));
        } else {
          marker.style.display = 'none';
        }
      };

      // 更新 A 和 B 点位置
      createMarker(this.loopStartTime, true);
      createMarker(this.loopEndTime, false);

      // 如果循环已激活且两个标记点都存在，创建视觉连接效果
      if (this.loopActive && this.loopStartTime !== null && this.loopEndTime !== null) {
        // 使用CSS类管理状态
        this.loopStartMarker.classList.add('active');
        this.loopEndMarker.classList.add('active');

        // 更新循环区间连接元素
        if (this.loopRangeElement) {
          var startPosition = this.loopStartTime / duration * 100;
          var endPosition = this.loopEndTime / duration * 100;

          // 计算宽度和位置
          var width = endPosition - startPosition;
          if (width > 0) {
            this.loopRangeElement.style.left = "".concat(startPosition, "%");
            this.loopRangeElement.style.width = "".concat(width, "%");
            this.loopRangeElement.style.display = 'block';
            this.loopRangeElement.classList.add('active');
          } else {
            this.loopRangeElement.style.display = 'none';
          }
        }
      } else {
        this.loopStartMarker.classList.remove('active');
        this.loopEndMarker.classList.remove('active');

        // 隐藏循环区间连接元素
        if (this.loopRangeElement) {
          this.loopRangeElement.classList.remove('active');
          this.loopRangeElement.style.display = 'none';
        }
      }
    }

    /**
     * 格式化时间（含小时）
     */
  }, {
    key: "formatTimeWithHours",
    value: function formatTimeWithHours(timeInSeconds) {
      if (isNaN(timeInSeconds) || timeInSeconds < 0) {
        return '00:00:00';
      }
      var totalSeconds = Math.floor(timeInSeconds);
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor(totalSeconds % 3600 / 60);
      var seconds = totalSeconds % 60;
      return "".concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0'), ":").concat(seconds.toString().padStart(2, '0'));
    }
  }]);
}();
;// ./src/player/managers/ProgressManager.js
function ProgressManager_typeof(o) { "@babel/helpers - typeof"; return ProgressManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, ProgressManager_typeof(o); }
function ProgressManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function ProgressManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, ProgressManager_toPropertyKey(o.key), o); } }
function ProgressManager_createClass(e, r, t) { return r && ProgressManager_defineProperties(e.prototype, r), t && ProgressManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function ProgressManager_toPropertyKey(t) { var i = ProgressManager_toPrimitive(t, "string"); return "symbol" == ProgressManager_typeof(i) ? i : i + ""; }
function ProgressManager_toPrimitive(t, r) { if ("object" != ProgressManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != ProgressManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 进度管理器类 - 负责进度条和时间显示功能
 */
var ProgressManager = /*#__PURE__*/function () {
  function ProgressManager(playerCore, uiElements) {
    ProgressManager_classCallCheck(this, ProgressManager);
    // 核心引用
    this.playerCore = playerCore;
    this.targetVideo = playerCore.targetVideo;

    // UI元素引用
    this.uiElements = uiElements;
    this.progressBarElement = null; // 进度条元素
    this.progressIndicator = null; // 进度指示器
    this.currentTimeDisplay = null; // 当前时间显示
    this.totalDurationDisplay = null; // 总时长显示
    this.timeIndicator = null; // 时间指示器

    // 拖动状态
    this.isDraggingProgress = false; // 是否正在拖动进度条
    this.progressHandleMoveHandler = null; // 进度条移动事件处理函数
    this.progressHandleUpHandler = null; // 进度条释放事件处理函数
    this.lastDragX = 0; // 上次拖动位置的X坐标
    this.isTouchDevice = 'ontouchstart' in window; // 检测是否为触摸设备
  }

  /**
   * 初始化进度管理器
   */
  return ProgressManager_createClass(ProgressManager, [{
    key: "init",
    value: function init(progressElements) {
      this.progressBarElement = progressElements.progressBarElement;
      this.progressIndicator = progressElements.progressIndicator;
      this.currentTimeDisplay = progressElements.currentTimeDisplay;
      this.totalDurationDisplay = progressElements.totalDurationDisplay;
      this.timeIndicator = progressElements.timeIndicator;

      // 进度条容器元素 (父元素)
      this.progressBarContainer = this.progressBarElement.parentElement;

      // 添加进度条事件监听
      this.progressBarElement.addEventListener('click', this.handleProgressClick.bind(this));

      // 为整个进度条容器添加拖动事件监听，增加可点击/拖动区域
      this.progressBarContainer.addEventListener('mousedown', this.startProgressDrag.bind(this));
      this.progressBarContainer.addEventListener('touchstart', this.startProgressDrag.bind(this), {
        passive: false
      });

      // 监听视频时间更新
      this.targetVideo.addEventListener('timeupdate', this.updateProgressBar.bind(this));
      return this;
    }

    /**
     * 更新进度条
     */
  }, {
    key: "updateProgressBar",
    value: function updateProgressBar() {
      if (!this.targetVideo || !this.progressBarElement || !this.progressIndicator) return;
      var currentTime = this.targetVideo.currentTime;
      var duration = this.targetVideo.duration;
      if (isNaN(duration) || duration <= 0) return;

      // 计算进度百分比
      var progressPercent = currentTime / duration * 100;

      // 更新进度指示器的宽度
      this.progressIndicator.style.width = "".concat(progressPercent, "%");

      // 更新时间显示
      this.updateCurrentTimeDisplay();
    }

    /**
     * 更新当前时间显示
     */
  }, {
    key: "updateCurrentTimeDisplay",
    value: function updateCurrentTimeDisplay() {
      if (!this.targetVideo || !this.currentTimeDisplay || !this.totalDurationDisplay) return;
      var currentTime = this.targetVideo.currentTime;
      var duration = this.targetVideo.duration;
      if (isNaN(duration)) return;

      // 更新当前时间显示
      this.currentTimeDisplay.textContent = this.formatTime(currentTime);

      // 计算并显示剩余时长，而不是总时长
      var remainingTime = duration - currentTime;
      this.totalDurationDisplay.textContent = "-".concat(this.formatTime(remainingTime));
    }

    /**
     * 格式化时间
     */
  }, {
    key: "formatTime",
    value: function formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) {
        return '00:00:00';
      }
      var totalSeconds = Math.floor(seconds);
      var hours = Math.floor(totalSeconds / 3600);
      var minutes = Math.floor(totalSeconds % 3600 / 60);
      var remainingSeconds = totalSeconds % 60;
      return "".concat(hours.toString().padStart(2, '0'), ":").concat(minutes.toString().padStart(2, '0'), ":").concat(remainingSeconds.toString().padStart(2, '0'));
    }

    /**
     * 处理进度条点击
     */
  }, {
    key: "handleProgressClick",
    value: function handleProgressClick(e) {
      // 如果正在拖动进度条，则忽略点击事件
      if (this.isDraggingProgress) return;

      // 获取进度条的位置信息
      var rect = this.progressBarElement.getBoundingClientRect();

      // 计算点击位置相对于进度条的比例 (0-1)
      var relativePos = (e.clientX - rect.left) / rect.width;

      // 计算目标时间
      var duration = this.targetVideo.duration;
      if (isNaN(duration)) return;
      var targetTime = duration * relativePos;

      // 设置视频当前时间
      this.targetVideo.currentTime = targetTime;

      // 更新进度条
      this.updateProgressBar();
    }

    /**
     * 相对时间跳转
     */
  }, {
    key: "seekRelative",
    value: function seekRelative(seconds) {
      if (!this.targetVideo) return;
      var newTime = Math.max(0, Math.min(this.targetVideo.duration, this.targetVideo.currentTime + seconds));
      this.targetVideo.currentTime = newTime;
    }

    /**
     * 开始进度条拖动
     */
  }, {
    key: "startProgressDrag",
    value: function startProgressDrag(e) {
      // 阻止默认行为，防止选择文本或触发其他事件
      e.preventDefault();
      e.stopPropagation();

      // 设置拖动状态
      this.isDraggingProgress = true;

      // 保存初始点击位置
      this.lastDragX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

      // 保持进度条高度以获得更好的拖动体验
      this.progressBarElement.classList.add('tm-progress-bar-expanded');
      this.progressBarElement.classList.remove('tm-progress-bar-normal');

      // 添加拖动状态标记
      this.progressBarElement.classList.add('tm-dragging');

      // 显示时间指示器
      if (this.timeIndicator) {
        this.timeIndicator.style.display = 'block';
        this.timeIndicator.style.opacity = '1';
        this.updateTimeIndicator(e);
      }

      // 绑定移动和释放事件处理函数
      var moveHandler = this.handleProgressMove.bind(this);
      var upHandler = this.handleProgressUp.bind(this);

      // 清除之前可能存在的事件监听
      this.removeProgressEventListeners();

      // 添加事件监听 - 使用 document 以捕获所有移动事件，即使鼠标移出进度条
      if (e.type.includes('touch')) {
        document.addEventListener('touchmove', moveHandler, {
          passive: false
        });
        document.addEventListener('touchend', upHandler, {
          passive: false
        });
        document.addEventListener('touchcancel', upHandler, {
          passive: false
        });
      } else {
        document.addEventListener('mousemove', moveHandler);
        document.addEventListener('mouseup', upHandler);
        document.addEventListener('mouseleave', upHandler);
      }
      this.progressHandleMoveHandler = moveHandler;
      this.progressHandleUpHandler = upHandler;

      // 立即调整到点击位置（与handleProgressClick的功能一致）
      var rect = this.progressBarElement.getBoundingClientRect();
      var clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      var relativePos = (clientX - rect.left) / rect.width;
      relativePos = Math.max(0, Math.min(1, relativePos));
      var duration = this.targetVideo.duration;
      if (!isNaN(duration)) {
        var newTime = duration * relativePos;
        this.targetVideo.currentTime = newTime;
        this.progressIndicator.style.width = "".concat(relativePos * 100, "%");
        this.updateCurrentTimeDisplay();
      }
    }

    /**
     * 处理进度条拖动移动
     */
  }, {
    key: "handleProgressMove",
    value: function handleProgressMove(e) {
      // 如果不是处于拖动状态，则退出
      if (!this.isDraggingProgress) return;

      // 阻止默认行为
      e.preventDefault();

      // 获取当前位置
      var clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;

      // 更新时间指示器
      this.updateTimeIndicator(e);

      // 计算新的进度位置
      var rect = this.progressBarElement.getBoundingClientRect();

      // 确保进度条元素可见并有宽度
      if (rect.width <= 0) return;

      // 计算相对位置 (0-1)
      var relativePos = (clientX - rect.left) / rect.width;
      relativePos = Math.max(0, Math.min(1, relativePos));

      // 计算新时间
      var duration = this.targetVideo.duration;
      if (isNaN(duration)) return;
      var newTime = duration * relativePos;

      // 更新进度指示器位置
      this.progressIndicator.style.width = "".concat(relativePos * 100, "%");

      // 实时更新视频播放位置
      this.targetVideo.currentTime = newTime;

      // 更新时间显示
      this.currentTimeDisplay.textContent = this.formatTime(newTime);
      var remainingTime = duration - newTime;
      this.totalDurationDisplay.textContent = "-".concat(this.formatTime(remainingTime));

      // 更新最后拖动位置
      this.lastDragX = clientX;
    }

    /**
     * 处理进度条释放
     */
  }, {
    key: "handleProgressUp",
    value: function handleProgressUp(e) {
      // 如果不是处于拖动状态，则退出
      if (!this.isDraggingProgress) return;

      // 计算最终位置并设置视频时间
      var rect = this.progressBarElement.getBoundingClientRect();
      var clientX = e.type.includes('touch') ? e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : this.lastDragX : e.clientX || this.lastDragX;

      // 计算相对位置 (0-1)
      var relativePos = (clientX - rect.left) / rect.width;
      relativePos = Math.max(0, Math.min(1, relativePos));

      // 设置视频当前时间
      var duration = this.targetVideo.duration;
      if (!isNaN(duration)) {
        this.targetVideo.currentTime = duration * relativePos;
      }

      // 隐藏时间指示器
      if (this.timeIndicator) {
        this.timeIndicator.style.opacity = '0';
      }

      // 移除拖动状态标记
      this.progressBarElement.classList.remove('tm-dragging');

      // 恢复进度条高度
      if (!this.progressBarElement.classList.contains('tm-progress-bar-hovered')) {
        this.progressBarElement.classList.add('tm-progress-bar-normal');
        this.progressBarElement.classList.remove('tm-progress-bar-expanded');
      }

      // 清理状态和事件
      this.isDraggingProgress = false;
      this.lastDragX = 0; // 重置拖动坐标

      // 移除事件监听
      this.removeProgressEventListeners();
    }

    /**
     * 移除进度条相关事件监听
     */
  }, {
    key: "removeProgressEventListeners",
    value: function removeProgressEventListeners() {
      if (this.progressHandleMoveHandler) {
        document.removeEventListener('mousemove', this.progressHandleMoveHandler);
        document.removeEventListener('touchmove', this.progressHandleMoveHandler);
      }
      if (this.progressHandleUpHandler) {
        document.removeEventListener('mouseup', this.progressHandleUpHandler);
        document.removeEventListener('touchend', this.progressHandleUpHandler);
        document.removeEventListener('touchcancel', this.progressHandleUpHandler);
        document.removeEventListener('mouseleave', this.progressHandleUpHandler);
      }
      this.progressHandleMoveHandler = null;
      this.progressHandleUpHandler = null;
    }

    /**
     * 更新时间指示器位置和内容
     */
  }, {
    key: "updateTimeIndicator",
    value: function updateTimeIndicator(e) {
      if (!this.timeIndicator || !this.targetVideo) return;
      var clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      var clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

      // 获取视频容器的位置
      var videoRect = this.uiElements.videoWrapper.getBoundingClientRect();
      var progressRect = this.progressBarElement.getBoundingClientRect();

      // 计算指示器位置，确保始终在视频区域内部
      var leftPos = Math.max(videoRect.left + 10, Math.min(videoRect.right - 10, clientX));

      // 计算垂直位置 - 放在进度条上方一定距离
      var topPos = progressRect.top - 20;

      // 设置指示器位置
      this.timeIndicator.style.left = "".concat(leftPos, "px");
      this.timeIndicator.style.top = "".concat(topPos, "px");

      // 计算时间
      var relativePos = (clientX - progressRect.left) / progressRect.width;
      var boundedPos = Math.max(0, Math.min(1, relativePos));
      var duration = this.targetVideo.duration;
      if (isNaN(duration)) return;
      var time = duration * boundedPos;

      // 更新指示器内容
      this.timeIndicator.textContent = "".concat(this.formatTime(time), " / ").concat(this.formatTime(duration));
    }
  }]);
}();
;// ./src/player/managers/EventManager.js
function EventManager_typeof(o) { "@babel/helpers - typeof"; return EventManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, EventManager_typeof(o); }
function EventManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function EventManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, EventManager_toPropertyKey(o.key), o); } }
function EventManager_createClass(e, r, t) { return r && EventManager_defineProperties(e.prototype, r), t && EventManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function EventManager_toPropertyKey(t) { var i = EventManager_toPrimitive(t, "string"); return "symbol" == EventManager_typeof(i) ? i : i + ""; }
function EventManager_toPrimitive(t, r) { if ("object" != EventManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != EventManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 事件管理器类 - 负责事件监听和处理
 */
var EventManager = /*#__PURE__*/function () {
  function EventManager(playerCore, uiElements, managers) {
    EventManager_classCallCheck(this, EventManager);
    // 核心引用
    this.playerCore = playerCore;
    this.targetVideo = playerCore.targetVideo;

    // UI元素引用
    this.uiElements = uiElements;

    // 管理器引用
    this.managers = managers;

    // 状态变量
    this.resizeObserver = null; // ResizeObserver 实例
    this.clickLock = false; // 防止快速多次点击视频区域
    this.clickLockTimeout = null; // 点击锁定计时器
  }

  /**
   * 初始化事件管理器
   */
  return EventManager_createClass(EventManager, [{
    key: "init",
    value: function init() {
      console.log('[EventManager] 初始化事件管理器');

      // 绑定基本方法
      this.handleWindowResizeBound = this.handleWindowResize.bind(this);
      this.handleContainerResizeBound = this.handleContainerResize.bind(this);
      this.handleOverlayTouchMoveBound = function (e) {
        return e.preventDefault();
      };

      // 初始化点击状态锁
      this.clickLock = false;
      this.clickLockTimeout = null;

      // 注释绑定视频包装器点击，由UIManager统一处理
      // this.handleVideoWrapperClickBound = this.handleVideoWrapperClick.bind(this);
      // this.uiElements.videoWrapper.addEventListener('click', this.handleVideoWrapperClickBound);

      // 绑定按钮事件
      this.handleCloseButtonClickBound = this.handleCloseButtonClick.bind(this);
      if (this.uiElements.closeBtn) {
        this.uiElements.closeBtn.addEventListener('click', this.handleCloseButtonClickBound);
      }
      this.handleSettingsButtonClickBound = this.handleSettingsButtonClick.bind(this);
      if (this.uiElements.settingsBtn) {
        this.uiElements.settingsBtn.addEventListener('click', this.handleSettingsButtonClickBound);
      }

      // 添加窗口大小变化事件
      window.addEventListener('resize', this.handleWindowResizeBound);

      // 设置容器大小观察器
      if (this.uiElements.container && typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(this.handleContainerResizeBound);
        this.resizeObserver.observe(this.uiElements.container);
      }

      // 阻止overlay上的默认触摸行为，防止iOS Safari上的橡皮筋效果
      if (this.uiElements.overlay) {
        this.uiElements.overlay.addEventListener('touchmove', this.handleOverlayTouchMoveBound, {
          passive: false
        });
      }

      // 设置视频事件监听器
      this.initVideoEventListeners();
    }

    /**
     * 初始化视频事件监听器
     */
  }, {
    key: "initVideoEventListeners",
    value: function initVideoEventListeners() {
      var _this = this;
      // 视频元数据加载完成监听
      this.handleMetadataLoadedBound = function () {
        if (_this.managers.progressManager) {
          _this.managers.progressManager.updateProgressBar();
        }
        if (_this.managers.loopManager) {
          _this.managers.loopManager.updateLoopTimeDisplay();
          _this.managers.loopManager.updateLoopMarkers();
        }
        if (_this.managers.dragManager) {
          _this.managers.dragManager.updateHandlePosition();
        }
        if (_this.managers.uiManager) {
          _this.managers.uiManager.updateContainerMinHeight();
        }

        // 更新SwipeManager以处理动态视频宽度
        if (_this.managers.swipeManager) {
          _this.managers.swipeManager.updateSize();
        }
      };
      this.targetVideo.addEventListener('loadedmetadata', this.handleMetadataLoadedBound);

      // 视频可以播放时也更新容器高度
      this.handleCanPlayBound = function () {
        if (_this.managers.uiManager) {
          _this.managers.uiManager.updateContainerMinHeight();
        }

        // 更新SwipeManager以处理动态视频宽度
        if (_this.managers.swipeManager) {
          _this.managers.swipeManager.updateSize();
        }
      };
      this.targetVideo.addEventListener('canplay', this.handleCanPlayBound);

      // 视频尺寸变化时更新
      this.handleVideoResizeBound = function () {
        if (_this.managers.uiManager) {
          _this.managers.uiManager.updateContainerMinHeight();
        }

        // 更新SwipeManager以处理动态视频宽度
        if (_this.managers.swipeManager) {
          _this.managers.swipeManager.updateSize();
        }
      };
      this.targetVideo.addEventListener('resize', this.handleVideoResizeBound);

      // 监听视频播放状态变化
      this.handlePlayBound = function () {
        if (_this.managers.controlManager) {
          _this.managers.controlManager.updatePlayPauseButton();
        }
      };
      this.targetVideo.addEventListener('play', this.handlePlayBound);
      this.handlePauseBound = function () {
        if (_this.managers.controlManager) {
          _this.managers.controlManager.updatePlayPauseButton();
          _this.managers.controlManager.showPauseIndicator();
        }
      };
      this.targetVideo.addEventListener('pause', this.handlePauseBound);
    }

    /**
     * 处理视频包装器点击事件
     */
  }, {
    key: "handleVideoWrapperClick",
    value: function handleVideoWrapperClick(e) {
      var _this2 = this;
      console.log('[EventManager] 视频包装器点击事件触发');
      // 确保点击事件不被其他控制元素阻挡
      if (e.target === this.uiElements.videoWrapper || e.target === this.targetVideo) {
        // 检查锁定状态，防止快速多次触发
        if (this.clickLock) {
          console.log('[EventManager] 点击锁定中，忽略此次点击');
          return;
        }

        // 检查是否刚完成拖动操作，如果是则不触发暂停/播放
        if (this.managers.swipeManager && typeof this.managers.swipeManager.wasRecentlyDragging === 'function' && this.managers.swipeManager.wasRecentlyDragging()) {
          console.log('[EventManager] 忽略拖动后的点击');
          return;
        }

        // 设置点击锁定，防止短时间内重复触发
        this.clickLock = true;
        // 清除可能存在的旧定时器
        if (this.clickLockTimeout) {
          clearTimeout(this.clickLockTimeout);
        }
        // 500毫秒后解除锁定
        this.clickLockTimeout = setTimeout(function () {
          _this2.clickLock = false;
          _this2.clickLockTimeout = null;
        }, 500);
        console.log('[EventManager] 触发视频点击事件，当前状态:', this.targetVideo.paused ? '已暂停' : '正在播放');
        if (this.targetVideo.paused) {
          this.targetVideo.play();
        } else {
          this.targetVideo.pause();
          if (this.managers.controlManager) {
            this.managers.controlManager.showPauseIndicator();
          }
        }
        if (this.managers.controlManager) {
          this.managers.controlManager.updatePlayPauseButton();
        }
      }
    }

    /**
     * 处理关闭按钮点击事件
     */
  }, {
    key: "handleCloseButtonClick",
    value: function handleCloseButtonClick() {
      console.log('[EventManager] 处理关闭按钮点击');
      // 先移除所有事件监听器
      this.cleanup();
      // 然后关闭播放器
      this.playerCore.close(this.uiElements.overlay, this.uiElements.container, this.uiElements.playerContainer);
    }

    /**
     * 处理设置按钮点击事件
     */
  }, {
    key: "handleSettingsButtonClick",
    value: function handleSettingsButtonClick() {
      if (this.managers.settingsManager) {
        this.managers.settingsManager.toggleSettingsPanel();
      }
    }

    /**
     * 处理窗口大小变化
     */
  }, {
    key: "handleWindowResize",
    value: function handleWindowResize() {
      // 更新视频大小和位置
      if (this.managers.uiManager) {
        this.managers.uiManager.updateContainerMinHeight();
      }
      if (this.managers.dragManager) {
        this.managers.dragManager.updateHandlePosition();
      }

      // 更新SwipeManager以处理动态视频宽度
      if (this.managers.swipeManager) {
        this.managers.swipeManager.updateSize();
      }
    }

    /**
     * 处理容器大小变化 (由 ResizeObserver 触发)
     */
  }, {
    key: "handleContainerResize",
    value: function handleContainerResize() {
      // 更新拖动手柄位置
      if (this.managers.dragManager) {
        this.managers.dragManager.updateHandlePosition();
      }

      // 更新SwipeManager以处理动态视频宽度
      if (this.managers.swipeManager) {
        this.managers.swipeManager.updateSize();
      }
    }

    /**
     * 清理所有事件监听器
     */
  }, {
    key: "cleanup",
    value: function cleanup() {
      console.log('[EventManager] 清理所有事件监听器');

      // 移除窗口事件
      window.removeEventListener('resize', this.handleWindowResizeBound);

      // 停止ResizeObserver
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }

      // 清除计时器
      if (this.clickLockTimeout) {
        clearTimeout(this.clickLockTimeout);
        this.clickLockTimeout = null;
      }

      // 视频包装器点击事件已由UIManager统一处理，此处不需要移除

      // 移除关闭按钮事件
      if (this.uiElements.closeBtn) {
        this.uiElements.closeBtn.removeEventListener('click', this.handleCloseButtonClickBound);
      }

      // 移除设置按钮事件
      if (this.uiElements.settingsBtn) {
        this.uiElements.settingsBtn.removeEventListener('click', this.handleSettingsButtonClickBound);
      }

      // 移除视频事件监听器
      if (this.targetVideo) {
        this.targetVideo.removeEventListener('loadedmetadata', this.handleMetadataLoadedBound);
        this.targetVideo.removeEventListener('canplay', this.handleCanPlayBound);
        this.targetVideo.removeEventListener('resize', this.handleVideoResizeBound);
        this.targetVideo.removeEventListener('play', this.handlePlayBound);
        this.targetVideo.removeEventListener('pause', this.handlePauseBound);
      }

      // 移除overlay的touchmove事件
      if (this.uiElements.overlay) {
        this.uiElements.overlay.removeEventListener('touchmove', this.handleOverlayTouchMoveBound);
      }
    }
  }]);
}();
;// ./src/player/managers/SettingsManager.js
function SettingsManager_typeof(o) { "@babel/helpers - typeof"; return SettingsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, SettingsManager_typeof(o); }
function SettingsManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function SettingsManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, SettingsManager_toPropertyKey(o.key), o); } }
function SettingsManager_createClass(e, r, t) { return r && SettingsManager_defineProperties(e.prototype, r), t && SettingsManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function SettingsManager_toPropertyKey(t) { var i = SettingsManager_toPrimitive(t, "string"); return "symbol" == SettingsManager_typeof(i) ? i : i + ""; }
function SettingsManager_toPrimitive(t, r) { if ("object" != SettingsManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != SettingsManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 设置管理器类 - 负责播放器设置功能
 */
var SettingsManager = /*#__PURE__*/function () {
  function SettingsManager(playerCore, uiElements) {
    SettingsManager_classCallCheck(this, SettingsManager);
    // 核心引用
    this.playerCore = playerCore;
    this.targetVideo = playerCore.targetVideo;

    // UI元素引用
    this.uiElements = uiElements;
    this.settingsPanel = uiElements.settingsPanel;

    // 事件处理器
    this.overlayClickHandler = null;

    // 用户设置
    this.settings = {
      showSeekControlRow: true,
      // 显示快进快退按钮
      showLoopControlRow: true,
      // 显示循环控制按钮
      showPlaybackControlRow: true,
      // 显示播放控制按钮
      showProgressBar: true // 显示进度条
    };
  }

  /**
   * 初始化设置管理器
   */
  return SettingsManager_createClass(SettingsManager, [{
    key: "init",
    value: function init() {
      // 加载保存的设置
      this.loadSettings();

      // 创建设置面板内容
      this.createSettingsPanel();
      return this;
    }

    /**
     * 创建设置面板内容
     */
  }, {
    key: "createSettingsPanel",
    value: function createSettingsPanel() {
      var _this = this;
      // 添加设置选项
      var settingsOptions = document.createElement('div');
      settingsOptions.className = 'tm-settings-options';
      settingsOptions.style.display = 'flex';
      settingsOptions.style.flexDirection = 'column';
      settingsOptions.style.gap = '12px';

      // 添加显示进度条选项
      var progressBarOption = this.createSettingOption('显示-进度条', 'showProgressBar', this.settings.showProgressBar, function (checked) {
        _this.settings.showProgressBar = checked;
        _this.saveSettings();
        _this.updateControlRowsVisibility();
      });

      // 添加显示快进快退控制行选项
      var seekControlRowOption = this.createSettingOption('显示-进度跳转', 'showSeekControlRow', this.settings.showSeekControlRow, function (checked) {
        _this.settings.showSeekControlRow = checked;
        _this.saveSettings();
        _this.updateControlRowsVisibility();
      });

      // 添加显示循环控制行选项
      var loopControlRowOption = this.createSettingOption('显示-循环控制', 'showLoopControlRow', this.settings.showLoopControlRow, function (checked) {
        _this.settings.showLoopControlRow = checked;
        _this.saveSettings();
        _this.updateControlRowsVisibility();
      });

      // 添加显示播放控制行选项
      var playbackControlRowOption = this.createSettingOption('显示-播放倍速', 'showPlaybackControlRow', this.settings.showPlaybackControlRow, function (checked) {
        _this.settings.showPlaybackControlRow = checked;
        _this.saveSettings();
        _this.updateControlRowsVisibility();
      });
      settingsOptions.appendChild(progressBarOption);
      settingsOptions.appendChild(seekControlRowOption);
      settingsOptions.appendChild(loopControlRowOption);
      settingsOptions.appendChild(playbackControlRowOption);
      this.settingsPanel.appendChild(settingsOptions);
    }

    /**
     * 创建设置选项
     * @param {string} labelText 选项标签文本
     * @param {string} settingKey 设置键名
     * @param {boolean} initialValue 初始值
     * @param {Function} onChange 值变化时的回调函数
     * @returns {HTMLElement} 设置选项元素
     */
  }, {
    key: "createSettingOption",
    value: function createSettingOption(labelText, settingKey, initialValue, onChange) {
      var optionContainer = document.createElement('div');
      optionContainer.className = 'tm-settings-option';
      optionContainer.id = "tm-setting-".concat(settingKey);
      var label = document.createElement('label');
      label.className = 'tm-settings-label';
      label.textContent = labelText;
      label.style.cursor = 'pointer';
      label.style.flex = '1';

      // 创建一个开关样式的复选框
      var toggleContainer = document.createElement('div');
      toggleContainer.className = 'tm-toggle-switch';

      // 创建一个隐藏的复选框用于状态保存
      var toggleInput = document.createElement('input');
      toggleInput.type = 'checkbox';
      toggleInput.checked = initialValue;
      // 我们把它放在离屏位置而不是完全隐藏，确保可以被 focus
      toggleInput.style.position = 'absolute';
      toggleInput.style.left = '-9999px';
      var toggleSlider = document.createElement('span');
      toggleSlider.className = initialValue ? 'tm-toggle-slider checked' : 'tm-toggle-slider';

      // 添加 tabIndex 使其可聚焦
      optionContainer.tabIndex = 0;
      toggleContainer.appendChild(toggleInput);
      toggleContainer.appendChild(toggleSlider);

      // 添加点击处理
      var toggleSwitch = function toggleSwitch(e) {
        e.preventDefault();
        e.stopPropagation();

        // 更新复选框状态
        toggleInput.checked = !toggleInput.checked;

        // 更新样式
        if (toggleInput.checked) {
          toggleSlider.className = 'tm-toggle-slider checked';
        } else {
          toggleSlider.className = 'tm-toggle-slider';
        }

        // 执行回调函数
        if (typeof onChange === 'function') {
          onChange(toggleInput.checked);
        }
      };

      // 让整个选项可点击
      optionContainer.addEventListener('click', toggleSwitch);

      // 添加键盘支持
      optionContainer.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSwitch(e);
        }
      });
      optionContainer.appendChild(label);
      optionContainer.appendChild(toggleContainer);
      return optionContainer;
    }

    /**
     * 切换设置面板显示状态
     */
  }, {
    key: "toggleSettingsPanel",
    value: function toggleSettingsPanel() {
      var _this2 = this;
      var isVisible = this.settingsPanel.classList.contains('active');
      if (isVisible) {
        this.closeSettingsPanel();
      } else {
        this.settingsPanel.style.display = 'block';

        // 使用动画淡入
        setTimeout(function () {
          _this2.settingsPanel.classList.add('active');
        }, 10);

        // 添加点击overlay背景关闭设置面板的事件
        this.overlayClickHandler = function (e) {
          // 如果点击的不是设置面板内的元素，则关闭设置面板
          if (!_this2.settingsPanel.contains(e.target) && e.target !== _this2.uiElements.settingsBtn) {
            _this2.closeSettingsPanel();
          }
        };

        // 延迟添加事件监听器，避免与当前点击冲突
        setTimeout(function () {
          if (_this2.uiElements.overlay) {
            _this2.uiElements.overlay.addEventListener('click', _this2.overlayClickHandler);
          }
        }, 50);
      }
    }

    /**
     * 关闭设置面板
     */
  }, {
    key: "closeSettingsPanel",
    value: function closeSettingsPanel() {
      var _this3 = this;
      this.settingsPanel.classList.remove('active');

      // 移除点击事件监听器
      if (this.uiElements.overlay && this.overlayClickHandler) {
        this.uiElements.overlay.removeEventListener('click', this.overlayClickHandler);
        this.overlayClickHandler = null;
      }

      // 等待动画完成后隐藏
      setTimeout(function () {
        _this3.settingsPanel.style.display = 'none';
      }, 300);
    }

    /**
     * 加载设置
     */
  }, {
    key: "loadSettings",
    value: function loadSettings() {
      try {
        // 创建临时函数来获取设置
        var getValue = function getValue(key, defaultValue) {
          try {
            if (typeof GM_getValue === 'function') {
              return GM_getValue(key, defaultValue);
            } else {
              var value = localStorage.getItem("missNoAD_".concat(key));
              return value !== null ? JSON.parse(value) : defaultValue;
            }
          } catch (e) {
            console.debug("\u83B7\u53D6".concat(key, "\u8BBE\u7F6E\u5931\u8D25:"), e);
            return defaultValue;
          }
        };

        // 加载设置，如果不存在则使用默认值
        this.settings.showProgressBar = getValue('showProgressBar', true);
        this.settings.showSeekControlRow = getValue('showSeekControlRow', true);
        this.settings.showLoopControlRow = getValue('showLoopControlRow', true);
        this.settings.showPlaybackControlRow = getValue('showPlaybackControlRow', true);
      } catch (error) {
        console.error('加载设置时出错:', error);
      }
    }

    /**
     * 保存设置
     */
  }, {
    key: "saveSettings",
    value: function saveSettings() {
      try {
        // 创建临时函数来保存设置
        var setValue = function setValue(key, value) {
          try {
            if (typeof GM_setValue === 'function') {
              GM_setValue(key, value);
              return true;
            } else {
              localStorage.setItem("missNoAD_".concat(key), JSON.stringify(value));
              return true;
            }
          } catch (e) {
            console.debug("\u4FDD\u5B58".concat(key, "\u8BBE\u7F6E\u5931\u8D25:"), e);
            return false;
          }
        };
        setValue('showProgressBar', this.settings.showProgressBar);
        setValue('showSeekControlRow', this.settings.showSeekControlRow);
        setValue('showLoopControlRow', this.settings.showLoopControlRow);
        setValue('showPlaybackControlRow', this.settings.showPlaybackControlRow);
      } catch (error) {
        console.error('保存设置时出错:', error);
      }
    }

    /**
     * 更新控制行的可见性
     */
  }, {
    key: "updateControlRowsVisibility",
    value: function updateControlRowsVisibility() {
      var controlButtonsContainer = document.querySelector('.tm-control-buttons');
      if (!controlButtonsContainer) return;
      var seekControlRow = controlButtonsContainer.querySelector('.tm-seek-control-row');
      var loopControlRow = controlButtonsContainer.querySelector('.tm-loop-control-row');
      var playbackControlRow = controlButtonsContainer.querySelector('.tm-playback-control-row');
      var progressRow = controlButtonsContainer.querySelector('.tm-progress-row');
      if (progressRow) {
        progressRow.style.display = this.settings.showProgressBar ? 'flex' : 'none';
      }
      if (seekControlRow) {
        seekControlRow.style.display = this.settings.showSeekControlRow ? 'flex' : 'none';
      }
      if (loopControlRow) {
        loopControlRow.style.display = this.settings.showLoopControlRow ? 'flex' : 'none';
      }
      if (playbackControlRow) {
        playbackControlRow.style.display = this.settings.showPlaybackControlRow ? 'flex' : 'none';
      }
    }

    /**
     * 更新设置项
     * @param {string} key 设置键名
     * @param {any} value 设置值
     */
  }, {
    key: "updateSetting",
    value: function updateSetting(key, value) {
      if (this.settings.hasOwnProperty(key)) {
        this.settings[key] = value;
        this.saveSettings();

        // 如果涉及UI可见性，更新UI
        if (key.startsWith('show') && key.endsWith('Row')) {
          this.updateControlRowsVisibility();
        }
      }
    }
  }]);
}();
;// ./src/player/managers/videoSwipeManager.js
function videoSwipeManager_typeof(o) { "@babel/helpers - typeof"; return videoSwipeManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, videoSwipeManager_typeof(o); }
function videoSwipeManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function videoSwipeManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, videoSwipeManager_toPropertyKey(o.key), o); } }
function videoSwipeManager_createClass(e, r, t) { return r && videoSwipeManager_defineProperties(e.prototype, r), t && videoSwipeManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function videoSwipeManager_toPropertyKey(t) { var i = videoSwipeManager_toPrimitive(t, "string"); return "symbol" == videoSwipeManager_typeof(i) ? i : i + ""; }
function videoSwipeManager_toPrimitive(t, r) { if ("object" != videoSwipeManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != videoSwipeManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 视频水平移动管理器 - 全新模块化设计
 */
var VideoSwipeManager = /*#__PURE__*/function () {
  function VideoSwipeManager(videoElement, containerElement, handleElement) {
    videoSwipeManager_classCallCheck(this, VideoSwipeManager);
    // 核心元素引用
    this.video = videoElement;
    this.container = containerElement;
    this.handle = handleElement;

    // 状态管理
    this.offset = 0; // 当前水平偏移量
    this.maxOffset = 0; // 最大偏移量限制
    this.isDragging = false; // 视频拖动状态
    this.isHandleDragging = false; // 手柄拖动状态
    this.startX = 0; // 拖动起始X坐标
    this.startOffset = 0; // 拖动起始偏移量
    this.lastSnapPosition = null; // 上次吸附位置，用于判断是否需要震动
    this.wasDragging = false; // 新增：标记是否刚完成拖动操作
    this.dragEndTimestamp = 0; // 新增：记录拖动结束的时间戳
    this.dragDistance = 0; // 新增：记录拖动距离
    this.minDragDistance = 10; // 新增：最小有效拖动距离（像素）

    // 视频尺寸信息
    this.videoWidth = 0; // 视频自然宽度
    this.videoHeight = 0; // 视频自然高度
    this.containerWidth = 0; // 容器宽度
    this.containerHeight = 0; // 容器高度
    this.videoScale = 1; // 视频缩放比例

    // 惯性滚动相关
    this.velocityTracker = {
      positions: [],
      // 存储最近的位置记录
      lastTimestamp: 0,
      // 上次记录时间
      currentVelocity: 0 // 当前速度
    };

    // 手柄惯性滚动数据
    this.handleVelocityTracker = {
      positions: [],
      // 存储最近的位置记录
      lastTimestamp: 0,
      // 上次记录时间
      currentVelocity: 0 // 当前速度
    };

    // 动画状态
    this.animation = {
      active: false,
      // 是否有动画正在进行
      rafId: null,
      // requestAnimationFrame ID
      targetOffset: 0,
      // 动画目标偏移量
      startTime: 0,
      // 动画开始时间
      duration: 0 // 动画持续时间
    };

    // 事件处理函数（使用箭头函数绑定this）
    this._pointerDownHandler = this._handlePointerDown.bind(this);
    this._pointerMoveHandler = this._handlePointerMove.bind(this);
    this._pointerUpHandler = this._handlePointerUp.bind(this);

    // 手柄事件处理函数
    this._handlePointerDownHandler = this._handleHandlePointerDown.bind(this);
    this._handlePointerMoveHandler = this._handleHandlePointerMove.bind(this);
    this._handlePointerUpHandler = this._handleHandlePointerUp.bind(this);

    // 初始化
    this._init();
  }

  /**
   * 初始化管理器
   */
  return videoSwipeManager_createClass(VideoSwipeManager, [{
    key: "_init",
    value: function _init() {
      var _this = this;
      console.log('[VideoSwipeManager] 初始化管理器');
      // 设置视频元素性能相关样式，不修改原始布局样式
      this.video.style.willChange = 'transform'; // 优化性能
      this.video.style.transition = 'transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)';

      // 注意：不再设置 width, height 或 objectFit，尊重原始样式

      // 添加视频事件监听
      this.video.addEventListener('pointerdown', this._pointerDownHandler);

      // 添加手柄事件监听
      if (this.handle) {
        this.handle.style.willChange = 'transform, left'; // 优化性能
        this.handle.style.transition = 'left 0.2s cubic-bezier(0.215, 0.61, 0.355, 1), width 0.2s ease';
        this.handle.addEventListener('pointerdown', this._handlePointerDownHandler);
      }

      // 初始更新约束条件
      this._updateConstraints();

      // 视频加载或尺寸变化时更新约束
      this.video.addEventListener('loadedmetadata', function () {
        console.log('[VideoSwipeManager] 视频元数据加载完成，更新约束');
        _this._updateConstraints();
      });
      this.video.addEventListener('canplay', function () {
        console.log('[VideoSwipeManager] 视频可播放，更新约束');
        _this._updateConstraints();
      });
    }

    /**
     * 计算视频的有效边界和可移动范围
     * @private
     */
  }, {
    key: "_updateVideoDimensions",
    value: function _updateVideoDimensions() {
      // 获取视频自然尺寸
      this.videoWidth = this.video.videoWidth || this.video.naturalWidth || 0;
      this.videoHeight = this.video.videoHeight || this.video.naturalHeight || 0;

      // 获取容器尺寸
      this.containerWidth = this.container.offsetWidth;
      this.containerHeight = this.container.offsetHeight;

      // 如果视频或容器尺寸无效，则不继续计算
      if (this.videoWidth <= 0 || this.videoHeight <= 0 || this.containerWidth <= 0 || this.containerHeight <= 0) {
        this.videoScale = 1;
        this.maxOffset = 0;
        return false;
      }

      // 获取视频元素的当前实际尺寸
      var videoRect = this.video.getBoundingClientRect();
      var actualVideoWidth = videoRect.width;
      var actualVideoHeight = videoRect.height;

      // 计算视频缩放比例
      this.videoScale = actualVideoHeight / this.videoHeight;

      // 计算最大水平偏移量 (视频超出容器的部分的一半)
      var overflow = Math.max(0, actualVideoWidth - this.containerWidth);
      this.maxOffset = overflow / 2;
      return true;
    }

    /**
     * 更新约束条件（如最大偏移量）
     */
  }, {
    key: "_updateConstraints",
    value: function _updateConstraints() {
      // 更新视频尺寸和约束
      var dimensionsUpdated = this._updateVideoDimensions();

      // 如果尺寸计算失败或视频宽度不超过容器，则无需移动
      if (!dimensionsUpdated || this.maxOffset <= 0) {
        // 重置到居中位置
        this._applyOffset(0, false);
        // 更新手柄状态为禁用移动，但宽度相应设置
        this._updateHandleState(false);
        return false;
      }

      // 限制当前偏移量在新的范围内
      this.offset = Math.max(-this.maxOffset, Math.min(this.offset, this.maxOffset));

      // 应用可能调整后的偏移量
      this._applyOffset(this.offset, false);

      // 更新手柄状态为可用
      this._updateHandleState(true);
      return true;
    }

    /**
     * 应用偏移量到视频元素
     * @param {number} offset - 要应用的偏移量
     * @param {boolean} animate - 是否使用动画过渡
     */
  }, {
    key: "_applyOffset",
    value: function _applyOffset(offset) {
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      // 确保偏移量在有效范围内
      this.offset = Math.max(-this.maxOffset, Math.min(offset, this.maxOffset));
      if (animate) {
        this.video.style.transition = 'transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)';
      } else {
        this.video.style.transition = 'none';
      }

      // 使用transform而不是left，利用GPU加速
      this.video.style.transform = "translateX(".concat(this.offset, "px)");

      // 同步更新手柄位置
      this._updateHandlePosition();
      return this;
    }

    /**
     * 更新手柄状态
     * @param {boolean} enabled - 手柄是否应该启用
     */
  }, {
    key: "_updateHandleState",
    value: function _updateHandleState(enabled) {
      if (!this.handle) return;

      // 更新手柄宽度
      this._updateHandleWidth();
      if (enabled) {
        this.handle.style.cursor = 'grab';
        this.video.style.cursor = 'grab';

        // 只有在视频比容器宽时才允许移动
        var handleContainer = this.handle.parentElement;
        if (handleContainer) {
          handleContainer.style.cursor = 'grab';
        }
      } else {
        // 视频完全可见或未超出容器时，手柄宽度适应但禁用拖动
        this.handle.style.cursor = 'default';
        this.video.style.cursor = 'default';
        // 不再设置手柄位置，使用_updateHandlePosition方法统一处理
      }

      // 立即更新手柄位置以反映视频偏移
      this._updateHandlePosition();
    }

    /**
     * 更新手柄宽度
     */
  }, {
    key: "_updateHandleWidth",
    value: function _updateHandleWidth() {
      if (!this.handle) return;

      // 使用固定的手柄宽度，不再动态计算
      var handleWidthPercent = 30; // 固定宽度30%

      // 应用手柄宽度
      this.handle.style.width = "".concat(handleWidthPercent, "%");
    }

    /**
     * 更新手柄位置
     */
  }, {
    key: "_updateHandlePosition",
    value: function _updateHandlePosition() {
      if (!this.handle) return;
      var handleContainer = this.handle.parentElement;
      if (!handleContainer) return;

      // 如果视频宽度不超过容器，居中显示手柄
      if (this.maxOffset <= 0) {
        // 居中手柄
        this.handle.style.left = '50%';
        this.handle.style.transform = 'translateX(-50%)';
        return;
      }
      var containerWidth = handleContainer.offsetWidth;
      var handleWidth = this.handle.offsetWidth;

      // 计算手柄可移动的范围
      var handleMovableRange = containerWidth - handleWidth;

      // 视频偏移范围: [-maxOffset, maxOffset]
      // 手柄位置范围: [0, handleMovableRange]
      // 调整为反向移动：当视频偏移为最大负值时，手柄位置为最右侧，反之亦然
      var offsetRatio = 1 - (this.offset + this.maxOffset) / (2 * this.maxOffset);
      var handleLeftPx = offsetRatio * handleMovableRange;

      // 更新手柄位置 (使用百分比让布局更灵活)
      var handleLeftPercent = handleLeftPx / containerWidth * 100;

      // // 平滑过渡
      // if (!this.isHandleDragging) {
      //     this.handle.style.transition = 'left 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)';
      // } else {
      //     this.handle.style.transition = 'none';
      // }

      this.handle.style.left = "".concat(handleLeftPercent, "%");
      this.handle.style.transform = ''; // 清除可能存在的transform
    }

    /**
     * 记录速度数据
     * @param {number} x - 当前x坐标
     */
  }, {
    key: "_trackVelocity",
    value: function _trackVelocity(x) {
      var now = Date.now();
      var tracker = this.velocityTracker;

      // 添加新位置记录
      tracker.positions.push({
        x: x,
        time: now
      });

      // 只保留最近100ms内的记录
      while (tracker.positions.length > 1 && now - tracker.positions[0].time > 100) {
        tracker.positions.shift();
      }

      // 计算当前速度 (像素/毫秒)
      if (tracker.positions.length > 1) {
        var first = tracker.positions[0];
        var last = tracker.positions[tracker.positions.length - 1];
        var deltaTime = last.time - first.time;
        if (deltaTime > 0) {
          tracker.currentVelocity = (last.x - first.x) / deltaTime;
        }
      }
      tracker.lastTimestamp = now;
    }

    /**
     * 应用惯性滚动
     */
  }, {
    key: "_applyInertia",
    value: function _applyInertia() {
      if (Math.abs(this.velocityTracker.currentVelocity) < 0.1) return;

      // 计算最终位置
      var velocity = this.velocityTracker.currentVelocity; // 像素/毫秒
      var deceleration = 0.002; // 减速率
      var distance = velocity * velocity / (2 * deceleration) * Math.sign(velocity);

      // 计算目标偏移量（考虑边界）
      var targetOffset = this.offset + distance;
      targetOffset = Math.max(-this.maxOffset, Math.min(targetOffset, this.maxOffset));

      // 计算动画持续时间（速度越快，时间越长）
      var duration = Math.min(Math.abs(velocity / deceleration) * 0.8,
      // 基于物理的持续时间
      400 // 最大不超过400ms
      );

      // 开始动画
      this._animateTo(targetOffset, duration);
    }

    /**
     * 动画滚动到指定偏移量
     * @param {number} targetOffset - 目标偏移量
     * @param {number} duration - 动画持续时间(毫秒)
     */
  }, {
    key: "_animateTo",
    value: function _animateTo(targetOffset) {
      var _this2 = this;
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
      // 取消可能正在进行的动画
      if (this.animation.active) {
        cancelAnimationFrame(this.animation.rafId);
      }

      // 更新动画状态
      this.animation.active = true;
      this.animation.targetOffset = targetOffset;
      this.animation.startTime = Date.now();
      this.animation.duration = duration;

      // 开始动画帧循环
      var _animate = function animate() {
        var now = Date.now();
        var elapsed = now - _this2.animation.startTime;
        if (elapsed >= duration) {
          // 动画结束
          _this2._applyOffset(targetOffset, false);
          _this2.animation.active = false;
          return;
        }

        // 使用easeOutCubic缓动函数计算当前位置
        var progress = 1 - Math.pow(1 - elapsed / duration, 3);
        var currentOffset = _this2.offset + (targetOffset - _this2.offset) * progress;
        _this2._applyOffset(currentOffset, false);
        _this2.animation.rafId = requestAnimationFrame(_animate);
      };
      this.animation.rafId = requestAnimationFrame(_animate);
    }

    /**
     * 处理指针按下事件 (视频元素)
     * @param {PointerEvent} e - 指针事件
     */
  }, {
    key: "_handlePointerDown",
    value: function _handlePointerDown(e) {
      // 如果视频宽度不超过容器，则不处理
      if (this.maxOffset <= 0) return;

      // 只处理主指针
      if (!e.isPrimary) return;

      // 停止可能正在进行的动画
      if (this.animation.active) {
        cancelAnimationFrame(this.animation.rafId);
        this.animation.active = false;
      }

      // 初始化拖动状态
      this.isDragging = true;
      this.startX = e.clientX;
      this.startOffset = this.offset;
      this.dragDistance = 0; // 重置拖动距离

      // 重置速度追踪器
      this.velocityTracker.positions = [];
      this.velocityTracker.lastTimestamp = Date.now();
      this.velocityTracker.currentVelocity = 0;

      // 记录初始位置
      this._trackVelocity(e.clientX);

      // 更新视觉状态
      this.video.style.cursor = 'grabbing';
      this.video.style.transition = 'none';

      // 如果支持指针捕获，捕获指针
      if (this.video.setPointerCapture) {
        this.video.setPointerCapture(e.pointerId);
      }

      // 添加事件监听
      this.video.addEventListener('pointermove', this._pointerMoveHandler);
      this.video.addEventListener('pointerup', this._pointerUpHandler);
      this.video.addEventListener('pointercancel', this._pointerUpHandler);

      // 触觉反馈 (如果设备支持)
      if (window.navigator.vibrate) {
        window.navigator.vibrate(5);
      }

      // 阻止默认行为，如文本选择
      e.preventDefault();
    }

    /**
     * 处理指针移动事件 (视频元素)
     * @param {PointerEvent} e - 指针事件
     */
  }, {
    key: "_handlePointerMove",
    value: function _handlePointerMove(e) {
      if (!this.isDragging || !e.isPrimary) return;

      // 计算位移
      var deltaX = e.clientX - this.startX;
      this.dragDistance = Math.max(this.dragDistance, Math.abs(deltaX)); // 更新最大拖动距离

      var newOffset = Math.max(-this.maxOffset, Math.min(this.startOffset + deltaX, this.maxOffset));

      // 应用新偏移量
      this._applyOffset(newOffset, false);

      // 记录位置用于计算速度
      this._trackVelocity(e.clientX);

      // 阻止默认行为，如页面滚动
      e.preventDefault();
    }

    /**
     * 处理指针抬起/取消事件 (视频元素)
     * @param {PointerEvent} e - 指针事件
     */
  }, {
    key: "_handlePointerUp",
    value: function _handlePointerUp(e) {
      if (!this.isDragging || !e.isPrimary) return;

      // 更新状态
      this.isDragging = false;

      // 只有当拖动距离超过最小值时才设置拖动标记
      if (this.dragDistance > this.minDragDistance) {
        this.wasDragging = true;
        this.dragEndTimestamp = Date.now();
      } else {
        this.wasDragging = false;
      }

      // 释放指针捕获
      if (this.video.releasePointerCapture) {
        this.video.releasePointerCapture(e.pointerId);
      }

      // 移除事件监听
      this.video.removeEventListener('pointermove', this._pointerMoveHandler);
      this.video.removeEventListener('pointerup', this._pointerUpHandler);
      this.video.removeEventListener('pointercancel', this._pointerUpHandler);

      // 恢复视觉状态
      this.video.style.cursor = 'grab';

      // 应用惯性滚动
      this._applyInertia();

      // 阻止默认行为
      e.preventDefault();
    }

    /**
     * 处理手柄的指针按下事件
     * @param {PointerEvent} e - 指针事件
     */
  }, {
    key: "_handleHandlePointerDown",
    value: function _handleHandlePointerDown(e) {
      // 如果视频宽度不超过容器，则不处理
      if (this.maxOffset <= 0) return;

      // 只处理主指针
      if (!e.isPrimary) return;

      // 停止可能正在进行的动画
      if (this.animation.active) {
        cancelAnimationFrame(this.animation.rafId);
        this.animation.active = false;
      }

      // 初始化拖动状态
      this.isHandleDragging = true;
      this.startX = e.clientX;
      this.dragDistance = 0; // 重置拖动距离

      // 记录初始偏移和手柄位置
      this.startOffset = this.offset;
      var handleContainer = this.handle.parentElement;
      var containerWidth = handleContainer ? handleContainer.offsetWidth : 0;

      // 如果手柄容器有效，计算手柄位置比例
      if (containerWidth > 0) {
        var handleRect = this.handle.getBoundingClientRect();
        this.startHandleLeft = handleRect.left - handleContainer.getBoundingClientRect().left;
        this.startHandleLeftPercent = this.startHandleLeft / containerWidth * 100;
      } else {
        this.startHandleLeft = 0;
        this.startHandleLeftPercent = 0;
      }

      // 更新视觉状态
      this.handle.style.cursor = 'grabbing';
      this.handle.style.transition = 'none';

      // 如果支持指针捕获，捕获指针
      if (this.handle.setPointerCapture) {
        this.handle.setPointerCapture(e.pointerId);
      }

      // 添加事件监听
      this.handle.addEventListener('pointermove', this._handlePointerMoveHandler);
      this.handle.addEventListener('pointerup', this._handlePointerUpHandler);
      this.handle.addEventListener('pointercancel', this._handlePointerUpHandler);

      // 触觉反馈 (如果设备支持)
      if (window.navigator.vibrate) {
        window.navigator.vibrate(5);
      }

      // 阻止默认行为
      e.preventDefault();
    }

    /**
     * 处理手柄的指针移动事件
     * @param {PointerEvent} e - 指针事件
     */
  }, {
    key: "_handleHandlePointerMove",
    value: function _handleHandlePointerMove(e) {
      if (!this.isHandleDragging || !e.isPrimary) return;
      var handleContainer = this.handle.parentElement;
      if (!handleContainer) return;
      var containerWidth = handleContainer.offsetWidth;
      var handleWidth = this.handle.offsetWidth;

      // 如果容器或手柄宽度无效，则不处理
      if (containerWidth <= 0 || handleWidth <= 0) return;

      // 计算位移
      var deltaX = e.clientX - this.startX;
      this.dragDistance = Math.max(this.dragDistance, Math.abs(deltaX)); // 更新最大拖动距离

      // 计算手柄新位置 (像素)
      var newHandleLeft = this.startHandleLeft + deltaX;

      // 限制手柄位置在容器范围内
      var maxHandleLeft = containerWidth - handleWidth;
      newHandleLeft = Math.max(0, Math.min(newHandleLeft, maxHandleLeft));

      // 记录位置用于计算手柄速度
      this._trackHandleVelocity(newHandleLeft);

      // 定义吸附位置和阈值
      var snapPositions = [0,
      // 左侧
      maxHandleLeft / 2,
      // 中间
      maxHandleLeft // 右侧
      ];
      var snapThreshold = 15; // 吸附阈值（像素）
      var didSnap = false;

      // 检查是否需要吸附
      for (var _i = 0, _snapPositions = snapPositions; _i < _snapPositions.length; _i++) {
        var snapPos = _snapPositions[_i];
        if (Math.abs(newHandleLeft - snapPos) < snapThreshold) {
          // 距离小于阈值，进行吸附
          newHandleLeft = snapPos;
          didSnap = true;

          // 如果设备支持触觉反馈且之前未吸附到此位置
          if (window.navigator.vibrate && (!this.lastSnapPosition || this.lastSnapPosition !== snapPos)) {
            window.navigator.vibrate(15); // 较强的震动表示吸附
            this.lastSnapPosition = snapPos;
          }
          break;
        }
      }

      // 如果未吸附，重置上次吸附位置记录
      if (!didSnap) {
        this.lastSnapPosition = null;
      }

      // 计算手柄位置百分比
      var newHandleLeftPercent = newHandleLeft / containerWidth * 100;

      // 应用手柄位置
      this.handle.style.left = "".concat(newHandleLeftPercent, "%");

      // 将手柄位置映射回视频偏移 - 反向移动
      // 手柄位置范围: [0, maxHandleLeft]
      // 视频偏移范围: [-this.maxOffset, this.maxOffset]
      var handleRatio = maxHandleLeft > 0 ? newHandleLeft / maxHandleLeft : 0; // 0 到 1, 避免除零
      // 改为反向映射 (1 - handleRatio) 来反转方向
      var newOffset = (1 - handleRatio) * 2 * this.maxOffset - this.maxOffset;

      // 应用视频偏移
      this.video.style.transform = "translateX(".concat(newOffset, "px)");
      this.video.style.transition = 'none';
      this.offset = newOffset;

      // 阻止默认行为
      e.preventDefault();
    }

    /**
     * 处理手柄的指针抬起/取消事件
     * @param {PointerEvent} e - 指针事件
     */
  }, {
    key: "_handleHandlePointerUp",
    value: function _handleHandlePointerUp(e) {
      if (!this.isHandleDragging || !e.isPrimary) return;

      // 更新状态
      this.isHandleDragging = false;

      // 只有当拖动距离超过最小值时才设置拖动标记
      if (this.dragDistance > this.minDragDistance) {
        this.wasDragging = true;
        this.dragEndTimestamp = Date.now();
      } else {
        this.wasDragging = false;
      }

      // 重置上次吸附位置记录，以便下次拖动时能正确触发震动
      this.lastSnapPosition = null;

      // 释放指针捕获
      if (this.handle.releasePointerCapture) {
        this.handle.releasePointerCapture(e.pointerId);
      }

      // 移除事件监听
      this.handle.removeEventListener('pointermove', this._handlePointerMoveHandler);
      this.handle.removeEventListener('pointerup', this._handlePointerUpHandler);
      this.handle.removeEventListener('pointercancel', this._handlePointerUpHandler);

      // 恢复视觉状态
      this.handle.style.cursor = 'grab';

      // 应用手柄惯性
      this._applyHandleInertia();

      // 阻止默认行为
      e.preventDefault();
    }

    /**
     * 记录手柄速度数据
     * @param {number} position - 当前手柄位置
     */
  }, {
    key: "_trackHandleVelocity",
    value: function _trackHandleVelocity(position) {
      var now = Date.now();
      var tracker = this.handleVelocityTracker;

      // 添加新位置记录
      tracker.positions.push({
        position: position,
        time: now
      });

      // 只保留最近100ms内的记录
      while (tracker.positions.length > 1 && now - tracker.positions[0].time > 100) {
        tracker.positions.shift();
      }

      // 计算当前速度 (像素/毫秒)
      if (tracker.positions.length > 1) {
        var first = tracker.positions[0];
        var last = tracker.positions[tracker.positions.length - 1];
        var deltaTime = last.time - first.time;
        if (deltaTime > 0) {
          tracker.currentVelocity = (last.position - first.position) / deltaTime;
        }
      }
      tracker.lastTimestamp = now;
    }

    /**
     * 应用手柄惯性滚动
     */
  }, {
    key: "_applyHandleInertia",
    value: function _applyHandleInertia() {
      if (Math.abs(this.handleVelocityTracker.currentVelocity) < 0.1) return;
      var handleContainer = this.handle.parentElement;
      if (!handleContainer) return;
      var containerWidth = handleContainer.offsetWidth;
      var handleWidth = this.handle.offsetWidth;
      var maxHandleLeft = containerWidth - handleWidth;

      // 获取当前手柄位置（像素）
      var handleRect = this.handle.getBoundingClientRect();
      var containerRect = handleContainer.getBoundingClientRect();
      var currentHandleLeft = handleRect.left - containerRect.left;

      // 计算最终位置
      var velocity = this.handleVelocityTracker.currentVelocity; // 像素/毫秒
      var deceleration = 0.002; // 减速率
      var distance = velocity * velocity / (2 * deceleration) * Math.sign(velocity);

      // 计算目标手柄位置（考虑边界）
      var targetHandleLeft = currentHandleLeft + distance;
      targetHandleLeft = Math.max(0, Math.min(targetHandleLeft, maxHandleLeft));

      // 检查最终位置是否需要吸附
      var snapPositions = [0,
      // 左侧
      maxHandleLeft / 2,
      // 中间
      maxHandleLeft // 右侧
      ];
      var snapThreshold = 30; // 惯性滚动的吸附阈值更大

      // 寻找最近的吸附点
      var closestSnapPos = targetHandleLeft;
      var minDistance = Number.MAX_VALUE;
      for (var _i2 = 0, _snapPositions2 = snapPositions; _i2 < _snapPositions2.length; _i2++) {
        var snapPos = _snapPositions2[_i2];
        var _distance = Math.abs(targetHandleLeft - snapPos);
        if (_distance < snapThreshold && _distance < minDistance) {
          closestSnapPos = snapPos;
          minDistance = _distance;
        }
      }

      // 应用吸附
      if (minDistance < Number.MAX_VALUE) {
        targetHandleLeft = closestSnapPos;
      }

      // 计算手柄位置百分比
      var targetHandleLeftPercent = targetHandleLeft / containerWidth * 100;

      // 计算对应的视频偏移量 - 反向映射
      var handleRatio = maxHandleLeft > 0 ? targetHandleLeft / maxHandleLeft : 0;
      var targetOffset = (1 - handleRatio) * 2 * this.maxOffset - this.maxOffset;

      // 设置过渡效果
      this.handle.style.transition = 'left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      this.video.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      // 应用最终位置
      this.handle.style.left = "".concat(targetHandleLeftPercent, "%");
      this.video.style.transform = "translateX(".concat(targetOffset, "px)");
      this.offset = targetOffset;

      // 触觉反馈 (如果设备支持且吸附到某个位置)
      if (minDistance < Number.MAX_VALUE && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }

      // 重置速度追踪器
      this.handleVelocityTracker.positions = [];
      this.handleVelocityTracker.currentVelocity = 0;
    }

    /**
     * 设置视频偏移量
     * @param {number} offset - 要设置的偏移量
     * @param {boolean} animate - 是否使用动画过渡
     */
  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      var animate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return this._applyOffset(offset, animate);
    }

    /**
     * 重置管理器到初始状态
     * @param {boolean} animate - 是否使用动画
     * @returns {VideoSwipeManager} 当前实例，支持链式调用
     */
  }, {
    key: "reset",
    value: function reset() {
      var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this._applyOffset(0, animate);
      this.wasDragging = false; // 重置拖动标记
      return this;
    }

    /**
     * 更新尺寸和约束
     * @returns {VideoSwipeManager} 当前实例，支持链式调用
     */
  }, {
    key: "updateSize",
    value: function updateSize() {
      console.log('[VideoSwipeManager] 更新尺寸和约束');
      // 强制获取视频和容器的最新尺寸
      if (this.video && this.container) {
        // 输出诊断信息
        var videoRect = this.video.getBoundingClientRect();
        var containerRect = this.container.getBoundingClientRect();
        console.log("[VideoSwipeManager] \u89C6\u9891\u5C3A\u5BF8: ".concat(videoRect.width, "x").concat(videoRect.height, ", \u5BB9\u5668\u5C3A\u5BF8: ").concat(containerRect.width, "x").concat(containerRect.height));

        // 更新约束
        var result = this._updateConstraints();
        console.log("[VideoSwipeManager] \u7EA6\u675F\u66F4\u65B0\u7ED3\u679C: ".concat(result, ", \u6700\u5927\u504F\u79FB\u91CF: ").concat(this.maxOffset));
      } else {
        console.error('[VideoSwipeManager] 视频或容器元素不存在');
      }
      return this;
    }

    /**
     * 销毁管理器并清理资源
     */
  }, {
    key: "destroy",
    value: function destroy() {
      // 移除事件监听
      if (this.video) {
        this.video.removeEventListener('pointerdown', this._pointerDownHandler);
        this.video.style.transform = '';
        this.video.style.willChange = '';
        this.video.style.transition = '';
        this.video.style.cursor = '';
      }
      if (this.handle) {
        this.handle.removeEventListener('pointerdown', this._handlePointerDownHandler);
        this.handle.style.willChange = '';
        this.handle.style.transition = '';
        this.handle.style.left = '';
        this.handle.style.width = '';
        this.handle.style.cursor = '';
      }

      // 取消可能正在进行的动画
      if (this.animation.active) {
        cancelAnimationFrame(this.animation.rafId);
        this.animation.active = false;
      }

      // 重置标记
      this.wasDragging = false;
    }

    /**
     * 检查是否刚完成拖动操作
     * @param {number} threshold - 时间阈值（毫秒）
     * @returns {boolean} 是否刚完成拖动
     */
  }, {
    key: "wasRecentlyDragging",
    value: function wasRecentlyDragging() {
      var threshold = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 150;
      if (!this.wasDragging) return false;
      var timeSinceDragEnd = Date.now() - this.dragEndTimestamp;

      // 如果超过阈值，重置标记
      if (timeSinceDragEnd > threshold) {
        this.wasDragging = false;
        return false;
      }
      return true;
    }
  }]);
}();
;// ./src/player/CustomVideoPlayer.js
function CustomVideoPlayer_typeof(o) { "@babel/helpers - typeof"; return CustomVideoPlayer_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, CustomVideoPlayer_typeof(o); }
function CustomVideoPlayer_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function CustomVideoPlayer_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, CustomVideoPlayer_toPropertyKey(o.key), o); } }
function CustomVideoPlayer_createClass(e, r, t) { return r && CustomVideoPlayer_defineProperties(e.prototype, r), t && CustomVideoPlayer_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function CustomVideoPlayer_toPropertyKey(t) { var i = CustomVideoPlayer_toPrimitive(t, "string"); return "symbol" == CustomVideoPlayer_typeof(i) ? i : i + ""; }
function CustomVideoPlayer_toPrimitive(t, r) { if ("object" != CustomVideoPlayer_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != CustomVideoPlayer_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }











/**
 * 自定义视频播放器控制器 - 模块化重构版本
 */
var CustomVideoPlayer = /*#__PURE__*/function () {
  function CustomVideoPlayer() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    CustomVideoPlayer_classCallCheck(this, CustomVideoPlayer);
    console.log('[CustomVideoPlayer] 初始化...');

    // 创建核心播放器
    this.playerCore = new PlayerCore(options);

    // 保存调用按钮引用
    this.callingButton = options.callingButton || null;

    // 初始化管理器
    this.managers = {};

    // 初始状态
    this.initialized = false;
  }

  /**
   * 初始化播放器
   */
  return CustomVideoPlayer_createClass(CustomVideoPlayer, [{
    key: "init",
    value: function init() {
      var _this = this;
      if (this.initialized) return;

      // 如果PlayerCore不存在，重新创建
      if (!this.playerCore) {
        this.playerCore = new PlayerCore({
          callingButton: this.callingButton
        });
      }

      // 初始化核心播放器
      this.playerCore.init();
      if (!this.playerCore.targetVideo) {
        console.error('[CustomVideoPlayer] 核心初始化失败: 未找到视频元素');
        // 如果是从浮动按钮调用的，则重新显示按钮
        if (this.callingButton) {
          this.callingButton.style.display = 'flex';
        }
        return;
      }

      // 创建UI管理器
      var uiManager = new UIManager(this.playerCore);
      var uiElements = uiManager.createUI();
      this.managers.uiManager = uiManager;

      // 创建设置管理器
      var settingsManager = new SettingsManager(this.playerCore, uiElements);
      settingsManager.init();
      this.managers.settingsManager = settingsManager;

      // 创建控制管理器
      var controlManager = new ControlManager(this.playerCore, uiElements);
      var progressControls = controlManager.createProgressControls();
      var controlButtons = controlManager.createControlButtonsContainer();
      this.managers.controlManager = controlManager;

      // 将控制管理器设置到playerCore上，以便UIManager可以访问到它
      this.playerCore.controlManager = controlManager;

      // 创建进度管理器
      var progressManager = new ProgressManager(this.playerCore, uiElements);
      progressManager.init({
        progressBarElement: controlManager.progressBarElement,
        progressIndicator: controlManager.progressIndicator,
        currentTimeDisplay: controlManager.currentTimeDisplay,
        totalDurationDisplay: controlManager.totalDurationDisplay,
        timeIndicator: controlManager.timeIndicator
      });
      this.managers.progressManager = progressManager;

      // 创建循环管理器
      var loopManager = new LoopManager(this.playerCore, uiElements);
      loopManager.init({
        loopStartMarker: controlManager.loopStartMarker,
        loopEndMarker: controlManager.loopEndMarker,
        loopRangeElement: controlManager.loopRangeElement,
        currentPositionDisplay: controlManager.currentPositionDisplay,
        durationDisplay: controlManager.durationDisplay,
        loopToggleButton: controlManager.loopToggleButton
      });
      this.managers.loopManager = loopManager;

      // 设置循环管理器引用到控制管理器
      controlManager.setLoopManager(loopManager);

      // 创建拖动管理器
      var dragManager = new DragManager(this.playerCore, uiElements);
      dragManager.init();
      this.managers.dragManager = dragManager;

      // 初始化VideoSwipeManager
      if (this.playerCore.targetVideo && uiElements.videoWrapper && uiElements.handle) {
        console.log('[CustomVideoPlayer] 初始化SwipeManager...');
        this.swipeManager = new VideoSwipeManager(this.playerCore.targetVideo, uiElements.videoWrapper, uiElements.handle);
        this.managers.swipeManager = this.swipeManager;
      }

      // 创建事件管理器 - 必须在所有其他管理器之后创建
      var eventManager = new EventManager(this.playerCore, uiElements, this.managers);
      eventManager.init();
      this.managers.eventManager = eventManager;

      // 组装DOM - 移到所有管理器初始化之后
      uiManager.assembleDOM();

      // 应用设置
      settingsManager.updateControlRowsVisibility();

      // 恢复视频状态
      this.playerCore.restoreVideoState();

      // 更新进度条
      progressManager.updateProgressBar();

      // 更新当前时间显示
      progressManager.updateCurrentTimeDisplay();

      // 为iOS设备的Safari浏览器设置统一的safe area背景色
      Utils.updateSafariThemeColor('#000000', true);

      // 立即更新视频大小和各UI元素位置
      setTimeout(function () {
        if (_this.swipeManager) {
          _this.swipeManager.updateSize();
        }
        dragManager.updateHandlePosition();
      }, 100);

      // 额外的延迟检查，确保URL参数相关的UI元素都被正确更新
      setTimeout(function () {
        console.log('[CustomVideoPlayer] 执行URL参数相关UI二次检查');
        // 强制再次更新循环点时间显示
        if (loopManager) {
          loopManager._updateUI();
          loopManager.updateLoopTimeDisplay();
          loopManager.updateLoopMarkers();
        }

        // 强制更新进度条和时间显示
        if (progressManager) {
          progressManager.updateProgressBar();
          progressManager.updateCurrentTimeDisplay();
        }
      }, 500);
      this.initialized = true;
      console.log('[CustomVideoPlayer] 初始化完成');
    }

    /**
     * 关闭播放器
     */
  }, {
    key: "close",
    value: function close() {
      // 调用PlayerCore的close方法
      this.playerCore.close(this.managers.uiManager.overlay, this.managers.uiManager.container, this.managers.uiManager.playerContainer);

      // 清理事件监听器
      if (this.managers.eventManager) {
        this.managers.eventManager.cleanup();
      }

      // 清理SwipeManager
      if (this.swipeManager) {
        this.swipeManager.destroy();
        this.swipeManager = null;
      }

      // 清理所有管理器
      for (var key in this.managers) {
        if (this.managers[key] && typeof this.managers[key].cleanup === 'function') {
          this.managers[key].cleanup();
        }
        this.managers[key] = null;
      }

      // 重置状态
      this.initialized = false;
      this.managers = {};
      this.playerCore = null;
    }
  }]);
}();
;// ./src/player/index.js
/**
 * 播放器模块入口文件
 * 导出模块化的自定义视频播放器
 */

;// ./src/ui/FloatingButton.js
function FloatingButton_typeof(o) { "@babel/helpers - typeof"; return FloatingButton_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, FloatingButton_typeof(o); }
function FloatingButton_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function FloatingButton_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, FloatingButton_toPropertyKey(o.key), o); } }
function FloatingButton_createClass(e, r, t) { return r && FloatingButton_defineProperties(e.prototype, r), t && FloatingButton_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function FloatingButton_toPropertyKey(t) { var i = FloatingButton_toPrimitive(t, "string"); return "symbol" == FloatingButton_typeof(i) ? i : i + ""; }
function FloatingButton_toPrimitive(t, r) { if ("object" != FloatingButton_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != FloatingButton_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }



/**
 * 浮动按钮类
 */
var FloatingButton = /*#__PURE__*/function () {
  function FloatingButton() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    FloatingButton_classCallCheck(this, FloatingButton);
    this.button = null;
    this.videoPlayer = null;
    this.resizeTimeout = null;
    this.playerState = options.playerState || null;
    this.videoCheckInterval = null;
    this.mutationObserver = null;
  }

  /**
   * 初始化浮动按钮
   */
  return FloatingButton_createClass(FloatingButton, [{
    key: "init",
    value: function init() {
      // 清理可能存在的旧按钮
      this.cleanupExistingButtons();

      // 检查页面是否存在视频元素
      if (Utils.findVideoElement()) {
        // 创建新按钮
        this.createButton();

        // 监听窗口大小变化，更新按钮位置
        window.addEventListener('resize', this.handleResize.bind(this));

        // 监听屏幕方向变化
        window.matchMedia("(orientation: portrait)").addEventListener("change", this.handleResize.bind(this));

        // 监听DOM变化，处理视频元素的动态添加/移除
        this.setupMutationObserver();
        console.log('[FloatingButton] 已创建浮动按钮，页面中存在视频元素');
      } else {
        console.log('[FloatingButton] 页面中未检测到视频元素，不显示浮动按钮');

        // 开始周期性检查视频元素
        this.startVideoElementCheck();

        // 监听DOM变化，处理视频元素的动态添加
        this.setupMutationObserver();
      }
    }

    /**
     * 设置MutationObserver监听DOM变化
     */
  }, {
    key: "setupMutationObserver",
    value: function setupMutationObserver() {
      // 清理可能存在的旧观察者
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
      }

      // 创建新的观察者
      this.mutationObserver = new MutationObserver(this.handleDomMutations.bind(this));

      // 开始观察整个文档的变化
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    /**
     * 处理DOM变化
     */
  }, {
    key: "handleDomMutations",
    value: function handleDomMutations() {
      var _this = this;
      // 使用防抖函数限制调用频率
      if (this.mutationTimeout) clearTimeout(this.mutationTimeout);
      this.mutationTimeout = setTimeout(function () {
        var hasVideo = Utils.findVideoElement();

        // 如果有视频元素但没有按钮，创建按钮
        if (hasVideo && !_this.button) {
          _this.createButton();

          // 监听窗口大小变化，更新按钮位置
          window.addEventListener('resize', _this.handleResize.bind(_this));

          // 监听屏幕方向变化
          window.matchMedia("(orientation: portrait)").addEventListener("change", _this.handleResize.bind(_this));
          console.log('[FloatingButton] DOM变化检测到视频元素，已创建浮动按钮');
        }
        // 如果有按钮但没有视频元素，隐藏按钮
        else if (!hasVideo && _this.button) {
          _this.button.style.display = 'none';
          console.log('[FloatingButton] DOM变化检测到视频元素已移除，已隐藏浮动按钮');
        }
        // 如果有视频元素且有按钮，确保按钮显示
        else if (hasVideo && _this.button && _this.button.style.display === 'none') {
          _this.button.style.display = 'flex';
          console.log('[FloatingButton] DOM变化检测到视频元素已添加，已显示浮动按钮');
        }
      }, 300);
    }

    /**
     * 开始周期性检查视频元素
     * 针对动态加载视频的网站，可能初始加载时没有视频，但后续会加载
     */
  }, {
    key: "startVideoElementCheck",
    value: function startVideoElementCheck() {
      var _this2 = this;
      // 清除可能存在的旧计时器
      if (this.videoCheckInterval) {
        clearInterval(this.videoCheckInterval);
      }

      // 设置新计时器，每2秒检查一次
      this.videoCheckInterval = setInterval(function () {
        if (Utils.findVideoElement()) {
          // 只有当按钮不存在时才创建
          if (!_this2.button) {
            // 找到视频元素，创建按钮
            _this2.createButton();

            // 监听窗口大小变化，更新按钮位置
            window.addEventListener('resize', _this2.handleResize.bind(_this2));

            // 监听屏幕方向变化
            window.matchMedia("(orientation: portrait)").addEventListener("change", _this2.handleResize.bind(_this2));
            console.log('[FloatingButton] 定时检测到视频元素，已创建浮动按钮');
          } else if (_this2.button.style.display === 'none') {
            // 按钮存在但被隐藏，重新显示
            _this2.button.style.display = 'flex';
            console.log('[FloatingButton] 定时检测到视频元素，已显示浮动按钮');
          }

          // 停止检查
          clearInterval(_this2.videoCheckInterval);
          _this2.videoCheckInterval = null;
        }
      }, 2000);
    }

    /**
     * 清理可能存在的旧浮动按钮
     */
  }, {
    key: "cleanupExistingButtons",
    value: function cleanupExistingButtons() {
      // 查找所有现有的浮动按钮
      var existingButtons = document.querySelectorAll('.tm-floating-button');
      if (existingButtons.length > 0) {
        console.log("[FloatingButton] \u6E05\u7406 ".concat(existingButtons.length, " \u4E2A\u73B0\u6709\u6D6E\u52A8\u6309\u94AE"));
        existingButtons.forEach(function (button) {
          if (button && button.parentNode) {
            button.parentNode.removeChild(button);
          }
        });
      }
    }

    /**
     * 处理窗口大小变化
     */
  }, {
    key: "handleResize",
    value: function handleResize() {
      var _this3 = this;
      // 使用节流函数限制调用频率
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(function () {
        // 检查页面是否存在视频元素
        if (Utils.findVideoElement()) {
          // 无论横屏还是竖屏都显示按钮
          _this3.button.style.display = 'flex';

          // 更新按钮位置
          _this3.updateButtonPosition();
        } else {
          // 没有视频元素，隐藏按钮
          if (_this3.button) _this3.button.style.display = 'none';
        }
      }, 200);
    }

    /**
     * 创建浮动按钮
     */
  }, {
    key: "createButton",
    value: function createButton() {
      var _this4 = this;
      // 创建浮动按钮 - 使用CSS类而不是内联样式
      this.button = Utils.createElementWithStyle('button', 'tm-floating-button');

      // 使用更简洁的播放按钮SVG图标，颜色为rgb(254, 98, 142)
      var icon = "\n            <svg width=\"48\" height=\"48\" viewBox=\"0 0 68 48\" fill=\"none\">\n                <path class=\"tm-play-button-bg\" d=\"M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z\" fill=\"rgb(254, 98, 142)\"></path>\n                <path d=\"M 45,24 27,14 27,34\" fill=\"#fff\"></path>\n            </svg>\n        ";
      this.button.innerHTML = icon;

      // 添加点击事件处理器
      this.button.addEventListener('click', function () {
        _this4.handleButtonClick();
      });

      // 显示按钮
      this.button.style.display = 'flex';

      // 添加到文档
      document.body.appendChild(this.button);

      // 初始位置
      this.updateButtonPosition();
      return this.button;
    }

    /**
     * 更新按钮位置，考虑安全区域和屏幕方向
     */
  }, {
    key: "updateButtonPosition",
    value: function updateButtonPosition() {
      if (!this.button) return;
      var safeArea = Utils.getSafeAreaInsets();

      // 获取当前屏幕方向
      var isPortrait = Utils.isPortrait();
      if (isPortrait) {
        // 竖屏模式 - 按钮在底部居中
        this.button.style.bottom = "".concat(Math.max(20, safeArea.bottom), "px");
        this.button.style.right = 'auto';
        this.button.style.left = '50%';
        // 重置transform以保持hover和active效果正常
        this.button.style.transform = 'translateX(-50%)';
      } else {
        // 横屏模式 - 按钮在右下角且加大安全距离
        this.button.style.bottom = "".concat(Math.max(20, safeArea.bottom + 10), "px");
        this.button.style.right = "".concat(Math.max(20, safeArea.right + 10), "px");
        this.button.style.left = 'auto';
        // 重置transform以保持hover和active效果正常
        this.button.style.transform = 'translateX(0)';
      }

      // 确保z-index始终正确设置，防止在屏幕旋转时被覆盖
      this.button.style.zIndex = '9980';
    }

    /**
     * 处理按钮点击
     */
  }, {
    key: "handleButtonClick",
    value: function handleButtonClick() {
      // 隐藏按钮
      this.button.style.display = 'none';

      // 每次点击都创建新的视频播放器实例
      this.videoPlayer = new CustomVideoPlayer({
        playerState: this.playerState,
        callingButton: this.button // 确保传递按钮引用
      });

      // 初始化播放器
      this.videoPlayer.init();
    }

    /**
     * 移除浮动按钮
     */
  }, {
    key: "remove",
    value: function remove() {
      if (this.button && this.button.parentNode) {
        this.button.parentNode.removeChild(this.button);
      }

      // 移除事件监听器
      window.removeEventListener('resize', this.handleResize);

      // 清除计时器
      if (this.videoCheckInterval) {
        clearInterval(this.videoCheckInterval);
        this.videoCheckInterval = null;
      }

      // 断开MutationObserver
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }

      // 清除引用
      this.button = null;
    }
  }]);
}();
;// ./src/state/PlayerState.js
function PlayerState_typeof(o) { "@babel/helpers - typeof"; return PlayerState_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, PlayerState_typeof(o); }
function PlayerState_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function PlayerState_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, PlayerState_toPropertyKey(o.key), o); } }
function PlayerState_createClass(e, r, t) { return r && PlayerState_defineProperties(e.prototype, r), t && PlayerState_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function PlayerState_toPropertyKey(t) { var i = PlayerState_toPrimitive(t, "string"); return "symbol" == PlayerState_typeof(i) ? i : i + ""; }
function PlayerState_toPrimitive(t, r) { if ("object" != PlayerState_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != PlayerState_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


/**
 * 播放器状态管理类
 */
var PlayerState = /*#__PURE__*/function () {
  function PlayerState() {
    PlayerState_classCallCheck(this, PlayerState);
    // 播放器设置
    this.settings = {
      showSeekControlRow: true,
      // 显示快进快退控制行
      showLoopControlRow: true,
      // 显示循环控制行
      showPlaybackControlRow: true // 显示播放控制行
    };

    // 添加存储方法
    this._setupStorageMethods();
  }

  /**
   * 设置存储方法
   * @private
   */
  return PlayerState_createClass(PlayerState, [{
    key: "_setupStorageMethods",
    value: function _setupStorageMethods() {
      // 检查是否有油猴API可用
      this.hasGMAPI = typeof GM_getValue === 'function' && typeof GM_setValue === 'function';
    }

    /**
     * 安全获取存储的值
     * @param {string} key - 键名
     * @param {any} defaultValue - 默认值
     * @returns {any} - 存储的值或默认值
     */
  }, {
    key: "getValue",
    value: function getValue(key, defaultValue) {
      try {
        if (this.hasGMAPI) {
          return GM_getValue(key, defaultValue);
        } else {
          var value = localStorage.getItem("missNoAD_".concat(key));
          return value !== null ? JSON.parse(value) : defaultValue;
        }
      } catch (e) {
        console.debug('获取存储值失败:', e);
        return defaultValue;
      }
    }

    /**
     * 安全存储值
     * @param {string} key - 键名
     * @param {any} value - 要存储的值
     * @returns {boolean} - 是否成功存储
     */
  }, {
    key: "setValue",
    value: function setValue(key, value) {
      try {
        if (this.hasGMAPI) {
          GM_setValue(key, value);
          return true;
        } else {
          localStorage.setItem("missNoAD_".concat(key), JSON.stringify(value));
          return true;
        }
      } catch (e) {
        console.debug('存储值失败:', e);
        return false;
      }
    }

    /**
     * 加载保存的设置
     */
  }, {
    key: "loadSettings",
    value: function loadSettings() {
      try {
        this.settings.showSeekControlRow = this.getValue('showSeekControlRow', true);
        this.settings.showLoopControlRow = this.getValue('showLoopControlRow', true);
        this.settings.showPlaybackControlRow = this.getValue('showPlaybackControlRow', true);
      } catch (error) {
        console.error('[PlayerState] 加载设置失败:', error);
      }
    }

    /**
     * 保存设置
     */
  }, {
    key: "saveSettings",
    value: function saveSettings() {
      try {
        this.setValue('showSeekControlRow', this.settings.showSeekControlRow);
        this.setValue('showLoopControlRow', this.settings.showLoopControlRow);
        this.setValue('showPlaybackControlRow', this.settings.showPlaybackControlRow);
      } catch (error) {
        console.error('[PlayerState] 保存设置失败:', error);
      }
    }

    /**
     * 更新设置
     * @param {string} key - 设置键名
     * @param {any} value - 设置值
     */
  }, {
    key: "updateSetting",
    value: function updateSetting(key, value) {
      if (key in this.settings) {
        this.settings[key] = value;
        this.saveSettings();
      }
    }
  }]);
}();
;// ./src/autologin/utils.js
function utils_typeof(o) { "@babel/helpers - typeof"; return utils_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, utils_typeof(o); }
function utils_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function utils_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, utils_toPropertyKey(o.key), o); } }
function utils_createClass(e, r, t) { return r && utils_defineProperties(e.prototype, r), t && utils_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function utils_toPropertyKey(t) { var i = utils_toPrimitive(t, "string"); return "symbol" == utils_typeof(i) ? i : i + ""; }
function utils_toPrimitive(t, r) { if ("object" != utils_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != utils_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 工具函数集合 - 自动登录模块专用
 */
var LoginUtils = /*#__PURE__*/function () {
  function LoginUtils() {
    utils_classCallCheck(this, LoginUtils);
  }
  return utils_createClass(LoginUtils, null, [{
    key: "toast",
    value:
    /**
     * 显示Toast消息通知
     * @param {string} msg - 要显示的消息
     * @param {number} [duration=3000] - 显示持续时间(毫秒)
     * @param {string} [bgColor='rgba(0, 0, 0, 0.8)'] - 背景颜色
     * @param {string} [textColor='#fff'] - 文字颜色
     * @param {string} [position='top'] - 位置(top/bottom/center)
     */
    function toast(msg) {
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
      var bgColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgba(0, 0, 0, 0.8)';
      var textColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#fff';
      var position = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'top';
      var toast = document.createElement('div');
      toast.innerText = msg;
      toast.style.cssText = "\n            position: fixed;\n            z-index: 100000;\n            left: 50%;\n            transform: translateX(-50%);\n            padding: 10px 15px;\n            border-radius: 4px;\n            color: ".concat(textColor, ";\n            background: ").concat(bgColor, ";\n            font-size: 14px;\n            max-width: 80%;\n            text-align: center;\n            word-break: break-all;\n        ");

      // 设置位置
      if (position === 'top') {
        toast.style.top = '10%';
      } else if (position === 'bottom') {
        toast.style.bottom = '10%';
      } else if (position === 'center') {
        toast.style.top = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
      }
      document.body.appendChild(toast);
      setTimeout(function () {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(function () {
          document.body.removeChild(toast);
        }, 500);
      }, duration);
    }

    /**
     * 节流函数 - 限制函数执行频率
     * @param {Function} fn - 要执行的函数
     * @param {number} delay - 延迟时间(ms)
     * @returns {Function} - 节流后的函数
     */
  }, {
    key: "throttle",
    value: function throttle(fn, delay) {
      var lastCall = 0;
      return function () {
        var now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return fn.apply(this, args);
        }
      };
    }

    /**
     * 等待DOM元素出现
     * @param {string} selector - CSS选择器
     * @param {number} [timeout=10000] - 超时时间(ms)
     * @param {number} [interval=100] - 检查间隔(ms)
     * @returns {Promise<Element>} - 返回找到的元素
     */
  }, {
    key: "waitForElement",
    value: function waitForElement(selector) {
      var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
      var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
      return new Promise(function (resolve, reject) {
        var element = document.querySelector(selector);
        if (element) {
          return resolve(element);
        }
        var start = Date.now();
        var intervalId = setInterval(function () {
          var element = document.querySelector(selector);
          if (element) {
            clearInterval(intervalId);
            return resolve(element);
          }
          if (Date.now() - start > timeout) {
            clearInterval(intervalId);
            reject(new Error("\u7B49\u5F85\u5143\u7D20 ".concat(selector, " \u8D85\u65F6")));
          }
        }, interval);
      });
    }

    /**
     * 获取本地存储的数据
     * @param {string} key - 存储键名
     * @param {*} defaultValue - 默认值
     * @returns {*} - 存储的值或默认值
     */
  }, {
    key: "getValue",
    value: function getValue(key, defaultValue) {
      try {
        // 优先使用localStorage
        var value = localStorage.getItem("autologin_".concat(key));
        if (value !== null) {
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        }
        return defaultValue;
      } catch (e) {
        console.error('获取存储值失败:', e);
        return defaultValue;
      }
    }

    /**
     * 设置本地存储数据
     * @param {string} key - 存储键名
     * @param {*} value - 要存储的值
     */
  }, {
    key: "setValue",
    value: function setValue(key, value) {
      try {
        var storageValue = utils_typeof(value) === 'object' ? JSON.stringify(value) : value;
        localStorage.setItem("autologin_".concat(key), storageValue);
      } catch (e) {
        console.error('设置存储值失败:', e);
      }
    }
  }]);
}();
;// ./src/autologin/i18n.js
function i18n_typeof(o) { "@babel/helpers - typeof"; return i18n_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, i18n_typeof(o); }
function i18n_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function i18n_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, i18n_toPropertyKey(o.key), o); } }
function i18n_createClass(e, r, t) { return r && i18n_defineProperties(e.prototype, r), t && i18n_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function i18n_defineProperty(e, r, t) { return (r = i18n_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function i18n_toPropertyKey(t) { var i = i18n_toPrimitive(t, "string"); return "symbol" == i18n_typeof(i) ? i : i + ""; }
function i18n_toPrimitive(t, r) { if ("object" != i18n_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != i18n_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 多语言系统 - 用于自动登录功能的国际化支持
 */
var I18n = /*#__PURE__*/function () {
  function I18n() {
    i18n_classCallCheck(this, I18n);
  }
  return i18n_createClass(I18n, null, [{
    key: "userLang",
    get:
    /**
     * 获取用户浏览器当前语言
     * @returns {string} 用户当前语言代码
     */
    function get() {
      return navigator.languages && navigator.languages[0] || navigator.language || 'en';
    }

    /**
     * 语言字符串集合
     * @type {Object}
     */
  }, {
    key: "translate",
    value:
    /**
     * 翻译函数 - 将ID转换为当前语言的字符串
     * @param {string} id - 要翻译的字符串ID
     * @param {string} [lang=''] - 可选的指定语言，默认使用用户语言
     * @returns {string} 翻译后的字符串
     */
    function translate(id) {
      var lang = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var selectedLang = lang || this.userLang;
      return (this.strings[selectedLang] || this.strings.en)[id] || this.strings.en[id];
    }
  }]);
}();
i18n_defineProperty(I18n, "strings", {
  'en': {
    accountNull: 'Error: Email or password is empty.',
    loginSuccess: 'Login successful, refreshing the page.',
    networkFailed: 'Status code error.',
    loginFailed: 'Login failed, incorrect email or password. Check console for error details.',
    autoLogin: 'Auto Login'
  },
  'zh-CN': {
    accountNull: '邮箱或密码为空',
    loginSuccess: '登录成功，即将刷新页面。',
    networkFailed: '状态码错误',
    loginFailed: '登录失败，邮箱或密码错误，可以在控制台查看错误信息。',
    autoLogin: '自动登录'
  },
  'zh-TW': {
    accountNull: '郵箱或密碼為空',
    loginSuccess: '登錄成功，即將刷新頁面。',
    networkFailed: '狀態碼錯誤',
    loginFailed: '登錄失敗，郵箱或密碼錯誤，可以在控制台查看錯誤信息。',
    autoLogin: '自動登錄'
  },
  'ja': {
    accountNull: 'エラー：メールアドレスまたはパスワードが空です。',
    loginSuccess: 'ログイン成功、ページを更新します。',
    networkFailed: 'ステータスコードエラー',
    loginFailed: 'ログインに失敗しました。メールアドレスまたはパスワードが間違っています。エラーの詳細はコンソールで確認できます。',
    autoLogin: '自動ログイン'
  },
  'vi': {
    accountNull: 'Lỗi: Email hoặc mật khẩu trống.',
    loginSuccess: 'Đăng nhập thành công, đang làm mới trang.',
    networkFailed: 'Lỗi mã trạng thái.',
    loginFailed: 'Đăng nhập không thành công, email hoặc mật khẩu không chính xác. Xem chi tiết lỗi trên bảng điều khiển.',
    autoLogin: 'Đăng nhập tự động'
  }
});
;// ./src/autologin/MissavLoginProvider.js
function MissavLoginProvider_typeof(o) { "@babel/helpers - typeof"; return MissavLoginProvider_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, MissavLoginProvider_typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == MissavLoginProvider_typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(MissavLoginProvider_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function MissavLoginProvider_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function MissavLoginProvider_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, MissavLoginProvider_toPropertyKey(o.key), o); } }
function MissavLoginProvider_createClass(e, r, t) { return r && MissavLoginProvider_defineProperties(e.prototype, r), t && MissavLoginProvider_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function MissavLoginProvider_toPropertyKey(t) { var i = MissavLoginProvider_toPrimitive(t, "string"); return "symbol" == MissavLoginProvider_typeof(i) ? i : i + ""; }
function MissavLoginProvider_toPrimitive(t, r) { if ("object" != MissavLoginProvider_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != MissavLoginProvider_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * MissAV网站登录提供程序
 */


var MissavLoginProvider = /*#__PURE__*/function () {
  /**
   * 构造函数
   */
  function MissavLoginProvider() {
    MissavLoginProvider_classCallCheck(this, MissavLoginProvider);
    // 域名列表 - 支持多个平行域名
    this.domains = ['missav.ws', 'missav.ai', 'missav.com', 'thisav.com'];
  }

  /**
   * 检查当前网站是否由本提供程序支持
   * @returns {boolean} 是否支持当前网站
   */
  return MissavLoginProvider_createClass(MissavLoginProvider, [{
    key: "isSupportedSite",
    value: function isSupportedSite() {
      var currentDomain = window.location.hostname;
      return this.domains.some(function (domain) {
        return currentDomain.includes(domain);
      });
    }

    /**
     * 登录处理函数
     * @param {string} email - 用户邮箱
     * @param {string} password - 用户密码
     * @returns {Promise<boolean>} 登录是否成功
     */
  }, {
    key: "login",
    value: (function () {
      var _login = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(email, password) {
        var _response$headers$get, response, errorText, data, text;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(!email || !password)) {
                _context.next = 3;
                break;
              }
              LoginUtils.toast(I18n.translate('accountNull'), 2000, '#FF0000', '#ffffff', 'top');
              return _context.abrupt("return", false);
            case 3:
              _context.prev = 3;
              _context.next = 6;
              return fetch('https://missav.ws/cn/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  email: email,
                  password: password,
                  remember: true
                })
              });
            case 6:
              response = _context.sent;
              if (response.ok) {
                _context.next = 14;
                break;
              }
              _context.next = 10;
              return response.text();
            case 10:
              errorText = _context.sent;
              console.error('登录错误:', {
                status: response.status,
                statusText: response.statusText,
                responseText: errorText
              });
              LoginUtils.toast("\u767B\u5F55\u5931\u8D25: ".concat(errorText), 2000, '#FF0000', '#ffffff', 'top');
              throw new Error(I18n.translate('networkFailed'));
            case 14:
              if (!((_response$headers$get = response.headers.get('Content-Type')) !== null && _response$headers$get !== void 0 && _response$headers$get.includes('application/json'))) {
                _context.next = 20;
                break;
              }
              _context.next = 17;
              return response.json();
            case 17:
              data = _context.sent;
              _context.next = 26;
              break;
            case 20:
              _context.next = 22;
              return response.text();
            case 22:
              text = _context.sent;
              console.error(I18n.translate('loginFailed'), {
                status: response.status,
                statusText: response.statusText,
                responseText: text
              });
              LoginUtils.toast(I18n.translate('loginFailed'), 2000, '#FF0000', '#ffffff', 'top');
              throw new Error(I18n.translate('loginFailed'));
            case 26:
              console.log('登录成功:', data);
              LoginUtils.toast(I18n.translate('loginSuccess'), 2000, 'rgb(18, 187, 2)', '#ffffff', 'top');

              // 登录成功后刷新页面
              setTimeout(function () {
                location.reload();
              }, 1000);
              return _context.abrupt("return", true);
            case 32:
              _context.prev = 32;
              _context.t0 = _context["catch"](3);
              LoginUtils.toast("\u9519\u8BEF\u53D1\u751F: ".concat(_context.t0.message), 2000, '#FF0000', '#ffffff', 'top');
              return _context.abrupt("return", false);
            case 36:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[3, 32]]);
      }));
      function login(_x, _x2) {
        return _login.apply(this, arguments);
      }
      return login;
    }()
    /**
     * 检查登录状态
     * @returns {Promise<boolean>} 是否已登录
     */
    )
  }, {
    key: "checkLoginStatus",
    value: (function () {
      var _checkLoginStatus = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var isLoggedIn;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return this.checkLoginByAPI();
            case 3:
              isLoggedIn = _context2.sent;
              if (!(isLoggedIn !== null)) {
                _context2.next = 6;
                break;
              }
              return _context2.abrupt("return", isLoggedIn);
            case 6:
              return _context2.abrupt("return", this.checkLoginByDOM());
            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](0);
              console.error('检查登录状态时出错:', _context2.t0);
              return _context2.abrupt("return", false);
            case 13:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 9]]);
      }));
      function checkLoginStatus() {
        return _checkLoginStatus.apply(this, arguments);
      }
      return checkLoginStatus;
    }()
    /**
     * 使用API检测登录状态
     * @returns {Promise<boolean|null>} 登录状态或null(检测失败)
     */
    )
  }, {
    key: "checkLoginByAPI",
    value: (function () {
      var _checkLoginByAPI = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
        var url, response, data;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              url = 'https://missav.ws/api/actresses/1016525/view';
              _context3.next = 4;
              return fetch(url, {
                method: 'GET',
                credentials: 'include' // 确保发送cookies
              });
            case 4:
              response = _context3.sent;
              if (response.ok) {
                _context3.next = 7;
                break;
              }
              return _context3.abrupt("return", null);
            case 7:
              _context3.next = 9;
              return response.json();
            case 9:
              data = _context3.sent;
              return _context3.abrupt("return", data.user !== null);
            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](0);
              console.debug('API登录状态检查出错:', _context3.t0.message);
              return _context3.abrupt("return", null);
            case 17:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[0, 13]]);
      }));
      function checkLoginByAPI() {
        return _checkLoginByAPI.apply(this, arguments);
      }
      return checkLoginByAPI;
    }()
    /**
     * 使用DOM元素检测登录状态
     * @returns {boolean} 是否已登录
     */
    )
  }, {
    key: "checkLoginByDOM",
    value: function checkLoginByDOM() {
      try {
        // 检查页面上的各种可能表明登录状态的元素
        var loginButton = document.querySelector('button[x-on\\:click="currentPage = \'login\'"]');
        var userAvatar = document.querySelector('.relative.ml-3 img.h-8.w-8.rounded-full');
        var userMenu = document.querySelector('[x-data="{userDropdownOpen: false}"]');

        // 如果没有登录按钮或有用户相关元素，说明可能已登录
        return !loginButton || userAvatar || userMenu;
      } catch (error) {
        console.debug('DOM检测登录状态时出错:', error.message);
        return false;
      }
    }

    /**
     * 添加自动登录选项到登录表单
     * @param {Function} onLoginInfoChange - 登录信息变更回调
     * @returns {Promise<void>}
     */
  }, {
    key: "addAutoLoginOption",
    value: (function () {
      var _addAutoLoginOption = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4(onLoginInfoChange) {
        var loginRememberContainer, autoLoginDiv, rememberMeDiv, autoLogin, loginForm, loginButton;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return LoginUtils.waitForElement('form[x-show="currentPage === \'login\'"] .relative.flex.items-start.justify-between');
            case 3:
              loginRememberContainer = _context4.sent;
              // 创建自动登录选项
              autoLoginDiv = document.createElement('div');
              autoLoginDiv.className = 'flex';
              autoLoginDiv.innerHTML = "\n                <div class=\"flex items-center h-5\">\n                    <input id=\"auto_login\" type=\"checkbox\" class=\"focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded __text_mode_custom_bg__\">\n                </div>\n                <div class=\"ml-3 text-sm\">\n                    <label for=\"auto_login\" class=\"font-medium text-nord4\">".concat(I18n.translate('autoLogin'), "</label>\n                </div>\n            ");

              // 获取"记住我"元素
              rememberMeDiv = loginRememberContainer.querySelector('.flex'); // 在记住我和忘记密码之间插入自动登录选项
              rememberMeDiv.parentNode.insertBefore(autoLoginDiv, rememberMeDiv.nextSibling);

              // 加载自动登录设置状态，默认为勾选状态
              autoLogin = LoginUtils.getValue('autoLogin', true);
              document.getElementById('auto_login').checked = autoLogin;

              // 监听自动登录复选框变化
              document.getElementById('auto_login').addEventListener('change', function () {
                var isAutoLogin = document.getElementById('auto_login').checked;
                LoginUtils.setValue('autoLogin', isAutoLogin);
                if (onLoginInfoChange) {
                  onLoginInfoChange({
                    autoLogin: isAutoLogin
                  });
                }
              });

              // 监听登录表单提交
              loginForm = document.querySelector('form[x-show="currentPage === \'login\'"]');
              if (loginForm) {
                // 监听登录按钮点击
                loginButton = loginForm.querySelector('button[type="submit"]');
                if (loginButton) {
                  loginButton.addEventListener('click', function () {
                    setTimeout(function () {
                      var emailInput = document.getElementById('login_email');
                      var passwordInput = document.getElementById('login_password');
                      var autoLoginCheckbox = document.getElementById('auto_login');
                      if (emailInput && passwordInput && autoLoginCheckbox && autoLoginCheckbox.checked) {
                        var email = emailInput.value;
                        var password = passwordInput.value;

                        // 保存登录信息
                        LoginUtils.setValue('userEmail', email);
                        LoginUtils.setValue('userPassword', password);
                        if (onLoginInfoChange) {
                          onLoginInfoChange({
                            email: email,
                            password: password,
                            autoLogin: true
                          });
                        }
                      }
                    }, 100);
                  });
                }
              }
              _context4.next = 19;
              break;
            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4["catch"](0);
              console.error('添加自动登录选项时出错:', _context4.t0);
            case 19:
            case "end":
              return _context4.stop();
          }
        }, _callee4, null, [[0, 16]]);
      }));
      function addAutoLoginOption(_x3) {
        return _addAutoLoginOption.apply(this, arguments);
      }
      return addAutoLoginOption;
    }())
  }]);
}();
;// ./src/autologin/LoginManager.js
function LoginManager_typeof(o) { "@babel/helpers - typeof"; return LoginManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, LoginManager_typeof(o); }
function LoginManager_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = LoginManager_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function LoginManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return LoginManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? LoginManager_arrayLikeToArray(r, a) : void 0; } }
function LoginManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function LoginManager_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ LoginManager_regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == LoginManager_typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(LoginManager_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function LoginManager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function LoginManager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { LoginManager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { LoginManager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function LoginManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function LoginManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, LoginManager_toPropertyKey(o.key), o); } }
function LoginManager_createClass(e, r, t) { return r && LoginManager_defineProperties(e.prototype, r), t && LoginManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function LoginManager_toPropertyKey(t) { var i = LoginManager_toPrimitive(t, "string"); return "symbol" == LoginManager_typeof(i) ? i : i + ""; }
function LoginManager_toPrimitive(t, r) { if ("object" != LoginManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != LoginManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 登录管理器 - 负责管理多个网站的登录逻辑
 */


var LoginManager = /*#__PURE__*/function () {
  /**
   * 构造函数
   */
  function LoginManager() {
    LoginManager_classCallCheck(this, LoginManager);
    // 登录信息
    this.userEmail = '';
    this.userPassword = '';
    this.autoLogin = true;

    // 登录提供者列表
    this.providers = [new MissavLoginProvider()];

    // 当前活跃的提供者
    this.activeProvider = null;
  }

  /**
   * 初始化登录管理器
   */
  return LoginManager_createClass(LoginManager, [{
    key: "init",
    value: (function () {
      var _init = LoginManager_asyncToGenerator(/*#__PURE__*/LoginManager_regeneratorRuntime().mark(function _callee() {
        return LoginManager_regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              // 加载存储的登录信息
              this.loadLoginInfo();

              // 根据当前URL选择合适的登录提供者
              this.activeProvider = this.getMatchingProvider();

              // 如果没有合适的提供者，不执行后续操作
              if (this.activeProvider) {
                _context.next = 5;
                break;
              }
              console.debug('没有找到匹配的登录提供者');
              return _context.abrupt("return");
            case 5:
              _context.next = 7;
              return this.activeProvider.addAutoLoginOption(this.handleLoginInfoChange.bind(this));
            case 7:
              _context.next = 9;
              return this.checkLoginAndAutoLogin();
            case 9:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
    /**
     * 处理登录信息变更
     * @param {Object} info - 变更的登录信息
     * @param {string} [info.email] - 邮箱
     * @param {string} [info.password] - 密码
     * @param {boolean} [info.autoLogin] - 是否自动登录
     */
    )
  }, {
    key: "handleLoginInfoChange",
    value: function handleLoginInfoChange(info) {
      if (info.email !== undefined) {
        this.userEmail = info.email;
        LoginUtils.setValue('userEmail', info.email);
      }
      if (info.password !== undefined) {
        this.userPassword = info.password;
        LoginUtils.setValue('userPassword', info.password);
      }
      if (info.autoLogin !== undefined) {
        this.autoLogin = info.autoLogin;
        LoginUtils.setValue('autoLogin', info.autoLogin);
      }
    }

    /**
     * 加载存储的登录信息
     */
  }, {
    key: "loadLoginInfo",
    value: function loadLoginInfo() {
      this.userEmail = LoginUtils.getValue('userEmail', '');
      this.userPassword = LoginUtils.getValue('userPassword', '');
      this.autoLogin = LoginUtils.getValue('autoLogin', true);
    }

    /**
     * 获取匹配当前网站的登录提供者
     * @returns {Object|null} 匹配的登录提供者或null
     */
  }, {
    key: "getMatchingProvider",
    value: function getMatchingProvider() {
      var _iterator = LoginManager_createForOfIteratorHelper(this.providers),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var provider = _step.value;
          if (provider.isSupportedSite()) {
            return provider;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return null;
    }

    /**
     * 检查登录状态并执行自动登录
     */
  }, {
    key: "checkLoginAndAutoLogin",
    value: (function () {
      var _checkLoginAndAutoLogin = LoginManager_asyncToGenerator(/*#__PURE__*/LoginManager_regeneratorRuntime().mark(function _callee2() {
        var isLoggedIn;
        return LoginManager_regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (this.activeProvider) {
                _context2.next = 2;
                break;
              }
              return _context2.abrupt("return");
            case 2:
              _context2.prev = 2;
              _context2.next = 5;
              return this.activeProvider.checkLoginStatus();
            case 5:
              isLoggedIn = _context2.sent;
              if (!(!isLoggedIn && this.autoLogin && this.userEmail && this.userPassword)) {
                _context2.next = 10;
                break;
              }
              console.log('用户未登录，尝试自动登录');
              _context2.next = 10;
              return this.activeProvider.login(this.userEmail, this.userPassword);
            case 10:
              _context2.next = 15;
              break;
            case 12:
              _context2.prev = 12;
              _context2.t0 = _context2["catch"](2);
              console.error('登录检查过程出错:', _context2.t0);
            case 15:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[2, 12]]);
      }));
      function checkLoginAndAutoLogin() {
        return _checkLoginAndAutoLogin.apply(this, arguments);
      }
      return checkLoginAndAutoLogin;
    }()
    /**
     * 手动执行登录操作
     * @param {string} email - 用户邮箱
     * @param {string} password - 用户密码
     * @returns {Promise<boolean>} 登录是否成功
     */
    )
  }, {
    key: "login",
    value: (function () {
      var _login = LoginManager_asyncToGenerator(/*#__PURE__*/LoginManager_regeneratorRuntime().mark(function _callee3(email, password) {
        return LoginManager_regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (this.activeProvider) {
                _context3.next = 3;
                break;
              }
              console.error('没有匹配的登录提供者');
              return _context3.abrupt("return", false);
            case 3:
              // 更新登录信息
              this.handleLoginInfoChange({
                email: email,
                password: password
              });

              // 执行登录
              _context3.next = 6;
              return this.activeProvider.login(email, password);
            case 6:
              return _context3.abrupt("return", _context3.sent);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function login(_x, _x2) {
        return _login.apply(this, arguments);
      }
      return login;
    }())
  }]);
}();
;// ./src/autologin/index.js
function autologin_typeof(o) { "@babel/helpers - typeof"; return autologin_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, autologin_typeof(o); }
function autologin_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ autologin_regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == autologin_typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(autologin_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function autologin_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function autologin_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { autologin_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { autologin_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * 自动登录模块 - 主入口
 * 支持多个网站的自动登录功能
 */





// 导出所有模块，方便其他模块使用


/**
 * 初始化自动登录模块
 * @returns {Promise<LoginManager>} 初始化后的登录管理器实例
 */
function initAutoLogin() {
  return _initAutoLogin.apply(this, arguments);
}
function _initAutoLogin() {
  _initAutoLogin = autologin_asyncToGenerator(/*#__PURE__*/autologin_regeneratorRuntime().mark(function _callee() {
    var loginManager;
    return autologin_regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // 创建并初始化登录管理器
          loginManager = new LoginManager();
          _context.next = 4;
          return loginManager.init();
        case 4:
          return _context.abrupt("return", loginManager);
        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('自动登录模块初始化失败:', _context.t0);
          return _context.abrupt("return", null);
        case 11:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 7]]);
  }));
  return _initAutoLogin.apply(this, arguments);
}
;// ./src/utils/index.js
/**
 * 常用工具函数集合
 */

/**
 * 工具函数对象
 */
var utils_Utils = {
  /**
   * Toast 通知函数
   * @param {string} msg - 消息内容
   * @param {number} duration - 显示时长(毫秒)
   * @param {string} bgColor - 背景颜色
   * @param {string} textColor - 文字颜色
   * @param {string} position - 位置(top/bottom/center)
   */
  Toast: function Toast(msg) {
    var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
    var bgColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rgba(0, 0, 0, 0.8)';
    var textColor = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#fff';
    var position = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'top';
    var toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = "\n      position: fixed;\n      z-index: 100000;\n      left: 50%;\n      transform: translateX(-50%);\n      padding: 10px 15px;\n      border-radius: 4px;\n      color: ".concat(textColor, ";\n      background: ").concat(bgColor, ";\n      font-size: 14px;\n      max-width: 80%;\n      text-align: center;\n      word-break: break-all;\n    ");

    // 设置位置
    if (position === 'top') {
      toast.style.top = '10%';
    } else if (position === 'bottom') {
      toast.style.bottom = '10%';
    } else if (position === 'center') {
      toast.style.top = '50%';
      toast.style.transform = 'translate(-50%, -50%)';
    }
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s';
      setTimeout(function () {
        document.body.removeChild(toast);
      }, 500);
    }, duration);
  },
  /**
   * 节流函数 - 限制函数执行频率
   * @param {Function} fn - 需要节流的函数 
   * @param {number} delay - 延迟时间(毫秒)
   * @returns {Function} 节流后的函数
   */
  throttle: function throttle(fn, delay) {
    var lastCall = 0;
    return function () {
      var now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return fn.apply(this, args);
      }
    };
  },
  /**
   * 等待DOM元素出现
   * @param {string} selector - CSS选择器 
   * @param {number} timeout - 超时时间(毫秒)
   * @param {number} interval - 检查间隔(毫秒)
   * @returns {Promise<Element>} DOM元素
   */
  waitForElement: function waitForElement(selector) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
    var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
    return new Promise(function (resolve, reject) {
      var element = document.querySelector(selector);
      if (element) {
        return resolve(element);
      }
      var start = Date.now();
      var intervalId = setInterval(function () {
        var element = document.querySelector(selector);
        if (element) {
          clearInterval(intervalId);
          return resolve(element);
        }
        if (Date.now() - start > timeout) {
          clearInterval(intervalId);
          reject(new Error("\u7B49\u5F85\u5143\u7D20 ".concat(selector, " \u8D85\u65F6")));
        }
      }, interval);
    });
  },
  /**
   * 动态加载脚本
   * @param {string} url - 脚本URL
   * @returns {Promise<void>} 加载完成的Promise
   */
  loadScript: function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = url;
      script.onload = function () {
        return resolve();
      };
      script.onerror = function (e) {
        return reject(new Error("\u811A\u672C\u52A0\u8F7D\u5931\u8D25: ".concat(url)));
      };
      document.head.appendChild(script);
    });
  },
  /**
   * 检查元素是否在视口中
   * @param {Element} element - 要检查的元素
   * @returns {boolean} 是否在视口中
   */
  isInViewport: function isInViewport(element) {
    var rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
  },
  /**
   * 格式化时间
   * @param {number} seconds - 秒数
   * @returns {string} 格式化后的时间字符串
   */
  formatTime: function formatTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var hDisplay = h > 0 ? String(h).padStart(2, '0') + ':' : '';
    var mDisplay = String(m).padStart(2, '0') + ':';
    var sDisplay = String(s).padStart(2, '0');
    return hDisplay + mDisplay + sDisplay;
  }
};

// 导出其他工具，如有需要
 // 确保这行存在时，otherUtils.js文件已存在
;// ./src/adblock/AdBlockConfig.js
function AdBlockConfig_typeof(o) { "@babel/helpers - typeof"; return AdBlockConfig_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, AdBlockConfig_typeof(o); }
function AdBlockConfig_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = AdBlockConfig_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function AdBlockConfig_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return AdBlockConfig_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? AdBlockConfig_arrayLikeToArray(r, a) : void 0; } }
function AdBlockConfig_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function AdBlockConfig_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function AdBlockConfig_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, AdBlockConfig_toPropertyKey(o.key), o); } }
function AdBlockConfig_createClass(e, r, t) { return r && AdBlockConfig_defineProperties(e.prototype, r), t && AdBlockConfig_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function AdBlockConfig_toPropertyKey(t) { var i = AdBlockConfig_toPrimitive(t, "string"); return "symbol" == AdBlockConfig_typeof(i) ? i : i + ""; }
function AdBlockConfig_toPrimitive(t, r) { if ("object" != AdBlockConfig_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != AdBlockConfig_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 广告屏蔽配置管理类
 * 负责管理和提供各网站的广告屏蔽配置
 */
/**
 * 配置管理类
 */
var AdBlockConfig = /*#__PURE__*/function () {
  /**
   * 创建配置管理实例
   * @param {Object} siteConfig - 站点特定配置
   */
  function AdBlockConfig() {
    var siteConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    AdBlockConfig_classCallCheck(this, AdBlockConfig);
    // 广告选择器
    this.adSelectors = siteConfig.adSelectors || [];

    // 自定义样式
    this.customStyles = siteConfig.customStyles || [];

    // 被阻止的URL模式集合
    this.blockedUrlPatternsSet = new Set(siteConfig.blockedUrlPatterns || []);

    // 预编译的广告关键词正则表达式
    this.adKeywordsRegex = /ads|analytics|tracker|affiliate|stat|pixel|banner|pop|click|outstream\.video|vast|vmap|preroll|midroll|postroll|adserve/i;
  }

  /**
   * 检查配置是否为空
   * @returns {boolean} 是否为空配置
   */
  return AdBlockConfig_createClass(AdBlockConfig, [{
    key: "isEmpty",
    value: function isEmpty() {
      return this.adSelectors.length === 0 && this.customStyles.length === 0 && this.blockedUrlPatternsSet.size === 0;
    }

    /**
     * 检查URL是否应当被阻止
     * @param {string} url - 待检查的URL
     * @returns {boolean} 是否应当阻止
     */
  }, {
    key: "shouldBlockUrl",
    value: function shouldBlockUrl(url) {
      if (!url || typeof url !== 'string') return false;

      // 使用预编译的正则表达式检查
      if (this.adKeywordsRegex.test(url)) {
        return true;
      }

      // 使用Set的has方法更快地检查特定域名
      var _iterator = AdBlockConfig_createForOfIteratorHelper(this.blockedUrlPatternsSet),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var pattern = _step.value;
          if (url.includes(pattern)) {
            return true;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return false;
    }
  }]);
}();
/* harmony default export */ const adblock_AdBlockConfig = (AdBlockConfig);
;// ./src/adblock/StyleManager.js
function StyleManager_typeof(o) { "@babel/helpers - typeof"; return StyleManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, StyleManager_typeof(o); }
function StyleManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function StyleManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, StyleManager_toPropertyKey(o.key), o); } }
function StyleManager_createClass(e, r, t) { return r && StyleManager_defineProperties(e.prototype, r), t && StyleManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function StyleManager_toPropertyKey(t) { var i = StyleManager_toPrimitive(t, "string"); return "symbol" == StyleManager_typeof(i) ? i : i + ""; }
function StyleManager_toPrimitive(t, r) { if ("object" != StyleManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != StyleManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 样式管理类
 * 负责创建和应用广告屏蔽相关的CSS样式
 */
/**
 * 样式管理类
 */
var StyleManager = /*#__PURE__*/function () {
  /**
   * 创建样式管理实例
   * @param {Object} config - 广告屏蔽配置
   */
  function StyleManager(config) {
    StyleManager_classCallCheck(this, StyleManager);
    this.config = config;
  }

  /**
   * 创建并应用广告屏蔽样式
   */
  return StyleManager_createClass(StyleManager, [{
    key: "applyAdBlockStyles",
    value: function applyAdBlockStyles() {
      // 如果无样式，则直接返回
      if (this.config.adSelectors.length === 0 && this.config.customStyles.length === 0) {
        return;
      }

      // 创建样式元素
      var styleElement = document.createElement('style');
      styleElement.id = 'adblock-styles';
      styleElement.type = 'text/css';

      // 构建广告屏蔽CSS
      var css = '';

      // 添加广告选择器样式
      if (this.config.adSelectors.length > 0) {
        css += this.config.adSelectors.join(', ') + ' { display: none !important; visibility: hidden !important; height: 0 !important; min-height: 0 !important; }';
      }

      // 添加自定义样式
      if (this.config.customStyles.length > 0) {
        css += '\n' + this.config.customStyles.map(function (item) {
          return "".concat(item.selector, " { ").concat(item.styles, " }");
        }).join('\n');
      }

      // 设置样式内容
      styleElement.textContent = css;

      // 添加到文档头部
      document.head.appendChild(styleElement);
      console.log('已应用广告屏蔽样式');
    }
  }]);
}();
/* harmony default export */ const adblock_StyleManager = (StyleManager);
;// ./src/adblock/DOMCleaner.js
function DOMCleaner_typeof(o) { "@babel/helpers - typeof"; return DOMCleaner_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, DOMCleaner_typeof(o); }
function DOMCleaner_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function DOMCleaner_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, DOMCleaner_toPropertyKey(o.key), o); } }
function DOMCleaner_createClass(e, r, t) { return r && DOMCleaner_defineProperties(e.prototype, r), t && DOMCleaner_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function DOMCleaner_toPropertyKey(t) { var i = DOMCleaner_toPrimitive(t, "string"); return "symbol" == DOMCleaner_typeof(i) ? i : i + ""; }
function DOMCleaner_toPrimitive(t, r) { if ("object" != DOMCleaner_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != DOMCleaner_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * DOM清理类
 * 负责移除DOM中的广告元素和监控DOM变化
 */
/**
 * DOM清理类
 */
var DOMCleaner = /*#__PURE__*/function () {
  /**
   * 创建DOM清理实例
   * @param {Object} config - 广告屏蔽配置
   */
  function DOMCleaner(config) {
    DOMCleaner_classCallCheck(this, DOMCleaner);
    this.config = config;
    this.CLEANUP_THROTTLE = 500; // 节流时间：500ms
    this.observer = null; // MutationObserver实例
  }

  /**
   * 清理iframe - 优化为只清理新iframe
   * @param {NodeList} iframeElements - 可选的iframe元素列表
   */
  return DOMCleaner_createClass(DOMCleaner, [{
    key: "cleanIframes",
    value: function cleanIframes() {
      var iframeElements = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var iframes = iframeElements || document.getElementsByTagName('iframe');
      for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];
        // 只保留播放器相关iframe，移除其他广告iframe
        if (iframe.src && !iframe.src.includes('plyr.io')) {
          iframe.remove();
        }
      }
    }

    /**
     * 移除广告元素
     * @param {boolean} force - 是否强制清理
     */
  }, {
    key: "removeAdElements",
    value: function removeAdElements() {
      var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (this.config.adSelectors.length === 0) {
        return; // 无选择器，不需要清理
      }
      for (var i = 0; i < this.config.adSelectors.length; i++) {
        try {
          var elements = document.querySelectorAll(this.config.adSelectors[i]);
          for (var j = 0; j < elements.length; j++) {
            elements[j].remove();
          }
        } catch (e) {
          // 忽略选择器错误
        }
      }
    }

    /**
     * 设置DOM变化监听
     */
  }, {
    key: "observeDOMChanges",
    value: function observeDOMChanges() {
      var _this = this;
      // 如果已经在观察，则不重复设置
      if (this.observer) {
        return;
      }
      var pendingChanges = false;
      var frameChanges = false;
      var processingTimeout = null;
      var processChanges = function processChanges() {
        if (pendingChanges) {
          _this.removeAdElements();
          pendingChanges = false;
        }
        if (frameChanges) {
          _this.cleanIframes();
          frameChanges = false;
        }
        processingTimeout = null;
      };
      this.observer = new MutationObserver(function (mutations) {
        var hasNewNodes = false;
        var hasNewIframes = false;

        // 快速检查是否有相关变化
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.addedNodes.length) {
            hasNewNodes = true;
            // 检查是否有新增的iframe
            for (var j = 0; j < mutation.addedNodes.length; j++) {
              var node = mutation.addedNodes[j];
              if (node.nodeName === 'IFRAME') {
                hasNewIframes = true;
                break;
              }
            }
          }
          if (hasNewNodes && hasNewIframes) break; // 找到所需信息后立即退出循环
        }
        if (hasNewNodes) {
          pendingChanges = true;
        }
        if (hasNewIframes) {
          frameChanges = true;
        }

        // 使用节流处理DOM变化
        if ((pendingChanges || frameChanges) && !processingTimeout) {
          processingTimeout = setTimeout(processChanges, 50);
        }
      });

      // 开始观察整个文档
      this.observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
      console.log('DOM监听已启动');
    }

    /**
     * 停止DOM变化监听
     */
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
        console.log('DOM监听已停止');
      }
    }
  }]);
}();
/* harmony default export */ const adblock_DOMCleaner = (DOMCleaner);
;// ./src/adblock/RequestBlocker.js
function RequestBlocker_typeof(o) { "@babel/helpers - typeof"; return RequestBlocker_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, RequestBlocker_typeof(o); }
function RequestBlocker_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function RequestBlocker_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, RequestBlocker_toPropertyKey(o.key), o); } }
function RequestBlocker_createClass(e, r, t) { return r && RequestBlocker_defineProperties(e.prototype, r), t && RequestBlocker_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function RequestBlocker_toPropertyKey(t) { var i = RequestBlocker_toPrimitive(t, "string"); return "symbol" == RequestBlocker_typeof(i) ? i : i + ""; }
function RequestBlocker_toPrimitive(t, r) { if ("object" != RequestBlocker_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != RequestBlocker_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 请求拦截类
 * 负责拦截和阻止广告相关网络请求
 */
/**
 * 请求拦截类
 */
var RequestBlocker = /*#__PURE__*/function () {
  /**
   * 创建请求拦截实例
   * @param {Object} config - 广告屏蔽配置
   */
  function RequestBlocker(config) {
    RequestBlocker_classCallCheck(this, RequestBlocker);
    this.config = config;
  }

  /**
   * 拦截XMLHttpRequest和Fetch请求
   */
  return RequestBlocker_createClass(RequestBlocker, [{
    key: "blockTrackingRequests",
    value: function blockTrackingRequests() {
      // 拦截XMLHttpRequest
      var originalXHR = XMLHttpRequest.prototype.open;
      var config = this.config;

      // 使用普通函数而不是箭头函数，保留正确的this上下文
      XMLHttpRequest.prototype.open = function (method, url) {
        if (typeof url === 'string' && config.shouldBlockUrl(url)) {
          // 返回一个虚拟方法，避免脚本错误
          this.send = function () {};
          this.onload = null;
          this.onerror = null;
          return;
        }
        return originalXHR.apply(this, arguments);
      };

      // 拦截Fetch请求
      var originalFetch = window.fetch;
      window.fetch = function (url, options) {
        // 处理 Request 对象作为参数的情况
        var urlToCheck = url;
        if (url instanceof Request) {
          urlToCheck = url.url;
        }
        if (typeof urlToCheck === 'string' && config.shouldBlockUrl(urlToCheck)) {
          // 返回一个解析为空的Response，避免错误
          return Promise.resolve(new Response('', {
            status: 200,
            headers: {
              'Content-Type': 'text/plain'
            }
          }));
        }
        return originalFetch.apply(this, arguments);
      };
    }

    /**
     * 拦截iframe加载
     */
  }, {
    key: "blockIframeLoading",
    value: function blockIframeLoading() {
      var createElementOriginal = document.createElement;
      var config = this.config;
      document.createElement = function (tag) {
        var element = createElementOriginal.call(document, tag);
        if (tag.toLowerCase() === 'iframe') {
          // 正确实现src属性的拦截
          var originalSrc = element.src;
          Object.defineProperty(element, 'src', {
            set: function set(value) {
              if (typeof value === 'string' && config.shouldBlockUrl(value)) {
                console.log('拦截iframe:', value);
                return;
              }
              originalSrc = value;
            },
            get: function get() {
              return originalSrc;
            }
          });

          // 监控setAttribute
          var originalSetAttribute = element.setAttribute;
          element.setAttribute = function (name, value) {
            if (name === 'src' && typeof value === 'string' && config.shouldBlockUrl(value)) {
              console.log('拦截iframe setAttribute:', value);
              return;
            }
            return originalSetAttribute.call(this, name, value);
          };
        }
        return element;
      };
    }

    /**
     * 阻止弹窗
     */
  }, {
    key: "blockPopups",
    value: function blockPopups() {
      window.open = function () {
        return null;
      };
      if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.open = function () {
          return null;
        };
      }
    }

    /**
     * 初始化所有拦截功能
     */
  }, {
    key: "init",
    value: function init() {
      this.blockIframeLoading();
      this.blockTrackingRequests();
      this.blockPopups();
      console.log('请求拦截已启用');
    }
  }]);
}();
/* harmony default export */ const adblock_RequestBlocker = (RequestBlocker);
;// ./src/adblock/sites/missav.js
/**
 * Missav网站广告屏蔽配置
 * 包含特定于missav.ws/ai/com域名的广告选择器和URL模式
 */

/**
 * missav网站的广告选择器
 */
var adSelectors = ['div[class="space-y-6 mb-6"]',
// 页面右侧便 视频广告
'div[class*="root--"][class*="bottomRight--"]',
// 页面右下角视频广告 
'div[class="grid md:grid-cols-2 gap-8"]',
// 视频下方新域名推广
'ul[class="mb-4 list-none text-nord14 grid grid-cols-2 gap-2"]',
// 视频简介下方链接推广
'div[class="space-y-5 mb-5"]',
// 页面底部视频广告
'iframe[src*="ads"]', 'iframe[src*="banner"]', 'iframe[src*="pop"]', 'iframe[data-ad]', 'iframe[id*="ads"]', 'iframe[class*="ads"]', 'iframe:not([src*="plyr.io"])' // 屏蔽所有非播放器的iframe
];

/**
 * missav网站的自定义样式
 */
var customStyles = [{
  // 影片列表文字标题完整显示
  selector: 'div[class="my-2 text-sm text-nord4 truncate"]',
  styles: 'white-space: normal !important;'
}, {
  // 设置页面背景色为黑色
  selector: 'body',
  styles: 'background-color: #000000 !important;'
}, {
  // 设置z-max元素的z-index
  selector: 'div[class*="z-max"]',
  styles: 'z-index: 9000 !important;'
}];

/**
 * 需要屏蔽的URL模式
 */
var blockedUrlPatterns = ['exoclick.com', 'juicyads.com', 'popads.net', 'adsterra.com', 'trafficjunky.com', 'adnium.com', 'ad-maven.com', 'browser-update.org', 'mopvip.icu', 'toppages.pw', 'cpmstar.com', 'propellerads.com', 'tsyndicate.com', 'syndication.exosrv.com', 'ads.exosrv.com', 'tsyndicate.com/sdk', 'cdn.tsyndicate.com', 'adsco.re', 'adscpm.site', 'a-ads.com', 'ad-delivery.net', 'outbrain.com', 'taboola.com', 'mgid.com', 'revcontent.com', 'adnxs.com', 'pubmatic.com', 'rubiconproject.com', 'openx.net', 'criteo.com', 'doubleclick.net'];

// 导出missav配置
/* harmony default export */ const missav = ({
  adSelectors: adSelectors,
  customStyles: customStyles,
  blockedUrlPatterns: blockedUrlPatterns,
  // 未来可以添加网站特有的配置
  isVideoSite: true,
  domains: ['missav.ws', 'missav.ai', 'missav.com', 'thisav.com']
});
;// ./src/adblock/index.js
function adblock_typeof(o) { "@babel/helpers - typeof"; return adblock_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, adblock_typeof(o); }
function adblock_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function adblock_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, adblock_toPropertyKey(o.key), o); } }
function adblock_createClass(e, r, t) { return r && adblock_defineProperties(e.prototype, r), t && adblock_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function adblock_toPropertyKey(t) { var i = adblock_toPrimitive(t, "string"); return "symbol" == adblock_typeof(i) ? i : i + ""; }
function adblock_toPrimitive(t, r) { if ("object" != adblock_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != adblock_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 广告屏蔽模块入口
 * 此模块负责屏蔽网站上的广告内容，提供更好的用户体验
 */








/**
 * 根据网站URL获取适合的配置
 * @param {string} url - 当前网站URL
 * @returns {Object} 站点特定配置
 */
function getSiteConfig(url) {
  // 目前只支持missav，未来可以扩展
  if (/^https?:\/\/(www\.)?(missav|thisav)\.(com|ws|ai)/.test(url)) {
    return missav;
  }

  // 返回默认空配置
  return {
    adSelectors: [],
    customStyles: [],
    blockedUrlPatterns: []
  };
}

/**
 * 广告屏蔽器类
 */
var AdBlocker = /*#__PURE__*/function () {
  function AdBlocker() {
    adblock_classCallCheck(this, AdBlocker);
    var siteConfig = getSiteConfig(window.location.href);
    this.config = new adblock_AdBlockConfig(siteConfig);
    this.styleManager = new adblock_StyleManager(this.config);
    this.domCleaner = new adblock_DOMCleaner(this.config);
    this.requestBlocker = new adblock_RequestBlocker(this.config);
  }

  /**
   * 防止被检测到AdBlock
   */
  return adblock_createClass(AdBlocker, [{
    key: "preventDetection",
    value: function preventDetection() {
      window.AdBlock = false;
      window.adblock = false;
      window.adsbygoogle = {
        loaded: true
      };
      if (typeof unsafeWindow !== 'undefined') {
        unsafeWindow.AdBlock = false;
        unsafeWindow.adblock = false;
        unsafeWindow.adsbygoogle = {
          loaded: true
        };
      }
    }

    /**
     * 设置定期清理
     */
  }, {
    key: "setupPeriodicCleaning",
    value: function setupPeriodicCleaning() {
      var _this = this;
      // 首次运行强制清理
      this.domCleaner.removeAdElements(true);
      this.domCleaner.observeDOMChanges();

      // 定时检查，2秒一次
      setInterval(function () {
        return _this.domCleaner.removeAdElements();
      }, 2000);
    }

    /**
     * 初始化广告屏蔽器
     */
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;
      // 检查当前网站是否需要启用广告屏蔽
      if (this.config.isEmpty()) {
        return; // 无配置，不启用
      }
      console.log('广告屏蔽模块已启用');

      // 防止被检测
      this.preventDetection();

      // 应用样式（尽早执行）
      this.styleManager.applyAdBlockStyles();

      // 初始化请求拦截器
      this.requestBlocker.init();

      // 当DOM加载后执行
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          return _this2.setupPeriodicCleaning();
        });
      } else {
        this.setupPeriodicCleaning();
      }
    }
  }]);
}(); // 导出广告屏蔽器
/* harmony default export */ const adblock = (AdBlocker);
;// ./src/userExperienceEnhancer/DetailExpander.js
function DetailExpander_typeof(o) { "@babel/helpers - typeof"; return DetailExpander_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, DetailExpander_typeof(o); }
function DetailExpander_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function DetailExpander_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, DetailExpander_toPropertyKey(o.key), o); } }
function DetailExpander_createClass(e, r, t) { return r && DetailExpander_defineProperties(e.prototype, r), t && DetailExpander_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function DetailExpander_toPropertyKey(t) { var i = DetailExpander_toPrimitive(t, "string"); return "symbol" == DetailExpander_typeof(i) ? i : i + ""; }
function DetailExpander_toPrimitive(t, r) { if ("object" != DetailExpander_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != DetailExpander_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 详情自动展开类
 * 负责自动展开视频的详细信息
 */



/**
 * 详情展开器类
 */
var DetailExpander = /*#__PURE__*/function () {
  function DetailExpander() {
    DetailExpander_classCallCheck(this, DetailExpander);
    // 配置
    this.maxAttempts = 3; // 最大尝试次数
    this.attemptInterval = 1000; // 尝试间隔时间(ms)
  }

  /**
   * 展开详情的选择器
   * @type {string}
   */
  return DetailExpander_createClass(DetailExpander, [{
    key: "SHOW_MORE_SELECTOR",
    get: function get() {
      return 'a.text-nord13.font-medium.flex.items-center';
    }

    /**
     * 自动展开详情
     */
  }, {
    key: "autoExpandDetails",
    value: function autoExpandDetails() {
      var _this = this;
      console.log('[DetailExpander] 尝试自动展开详情');

      // 立即尝试展开一次
      this.expandDetailsSingle();

      // 多次尝试，因为有时候页面加载较慢
      var attempts = 0;
      var attemptInterval = setInterval(function () {
        if (_this.expandDetailsSingle() || ++attempts >= _this.maxAttempts) {
          clearInterval(attemptInterval);
          console.log("[DetailExpander] \u5B8C\u6210\u5C1D\u8BD5 (".concat(attempts + 1, "\u6B21)"));
        }
      }, this.attemptInterval);
    }

    /**
     * 执行单次展开尝试
     * @returns {boolean} 是否成功展开
     */
  }, {
    key: "expandDetailsSingle",
    value: function expandDetailsSingle() {
      try {
        var showMoreButton = document.querySelector(this.SHOW_MORE_SELECTOR);
        if (showMoreButton) {
          console.log('[DetailExpander] 找到"显示更多"按钮，点击展开');
          showMoreButton.click();
          return true;
        }
      } catch (error) {
        console.error('[DetailExpander] 展开详情时出错:', error);
      }
      return false;
    }
  }]);
}();
;// ./src/userExperienceEnhancer/QualityManager.js
function QualityManager_typeof(o) { "@babel/helpers - typeof"; return QualityManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, QualityManager_typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || QualityManager_unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function QualityManager_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return QualityManager_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? QualityManager_arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return QualityManager_arrayLikeToArray(r); }
function QualityManager_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function QualityManager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function QualityManager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, QualityManager_toPropertyKey(o.key), o); } }
function QualityManager_createClass(e, r, t) { return r && QualityManager_defineProperties(e.prototype, r), t && QualityManager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function QualityManager_toPropertyKey(t) { var i = QualityManager_toPrimitive(t, "string"); return "symbol" == QualityManager_typeof(i) ? i : i + ""; }
function QualityManager_toPrimitive(t, r) { if ("object" != QualityManager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != QualityManager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 视频画质管理类
 * 负责自动设置视频的最高画质
 */

/**
 * 画质管理器类
 */
var QualityManager = /*#__PURE__*/function () {
  function QualityManager() {
    QualityManager_classCallCheck(this, QualityManager);
    // 配置
    this.maxAttempts = 20; // 最大尝试次数
    this.attemptInterval = 500; // 尝试间隔时间(ms)
  }

  /**
   * 自动设置最高画质
   */
  return QualityManager_createClass(QualityManager, [{
    key: "setupAutoHighestQuality",
    value: function setupAutoHighestQuality() {
      var _this = this;
      console.log('[QualityManager] 尝试设置视频最高画质');

      // 立即尝试一次
      if (this.setHighestQualitySingle()) {
        console.log('[QualityManager] 成功设置最高画质');
        return;
      }

      // 失败则定时尝试
      var attempts = 0;
      var checkInterval = setInterval(function () {
        if (_this.setHighestQualitySingle() || ++attempts >= _this.maxAttempts) {
          clearInterval(checkInterval);
          console.log("[QualityManager] \u5B8C\u6210\u5C1D\u8BD5 (".concat(attempts + 1, "\u6B21)"));
        }
      }, this.attemptInterval);

      // 页面完全加载后再尝试一次
      window.addEventListener('load', function () {
        return _this.setHighestQualitySingle();
      });
    }

    /**
     * 执行单次设置最高画质尝试
     * @returns {boolean} 是否成功设置
     */
  }, {
    key: "setHighestQualitySingle",
    value: function setHighestQualitySingle() {
      try {
        // 检查播放器
        var player = window.player || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.player : null);
        if (!player || !player.config || !player.config.quality || !player.config.quality.options || !player.config.quality.options.length) {
          return false;
        }

        // 设置最高画质
        var maxQuality = Math.max.apply(Math, _toConsumableArray(player.config.quality.options));
        console.log('[QualityManager] 设置画质:', maxQuality);

        // 同时设置属性和方法
        player.quality = maxQuality;
        player.config.quality.selected = maxQuality;
        if (typeof player.quality === 'function') {
          player.quality(maxQuality);
        }
        return true;
      } catch (error) {
        console.error('[QualityManager] 设置最高画质时出错:', error);
        return false;
      }
    }
  }]);
}();
;// ./src/userExperienceEnhancer/UrlRedirector.js
function UrlRedirector_typeof(o) { "@babel/helpers - typeof"; return UrlRedirector_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, UrlRedirector_typeof(o); }
function UrlRedirector_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = UrlRedirector_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function UrlRedirector_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return UrlRedirector_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? UrlRedirector_arrayLikeToArray(r, a) : void 0; } }
function UrlRedirector_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function UrlRedirector_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function UrlRedirector_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, UrlRedirector_toPropertyKey(o.key), o); } }
function UrlRedirector_createClass(e, r, t) { return r && UrlRedirector_defineProperties(e.prototype, r), t && UrlRedirector_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function UrlRedirector_toPropertyKey(t) { var i = UrlRedirector_toPrimitive(t, "string"); return "symbol" == UrlRedirector_typeof(i) ? i : i + ""; }
function UrlRedirector_toPrimitive(t, r) { if ("object" != UrlRedirector_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != UrlRedirector_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * URL重定向类
 * 负责将特定域名重定向到目标域名
 */

/**
 * URL重定向器类
 */
var UrlRedirector = /*#__PURE__*/function () {
  function UrlRedirector() {
    UrlRedirector_classCallCheck(this, UrlRedirector);
    // 配置重定向规则
    this.redirectRules = [{
      pattern: /^https?:\/\/(www\.)?(missav|thisav|thisav2)\.com\//i,
      targetDomain: 'missav.ws'
    }];
  }

  /**
   * 检查当前URL并执行重定向
   * @returns {boolean} 是否执行了重定向
   */
  return UrlRedirector_createClass(UrlRedirector, [{
    key: "checkAndRedirect",
    value: function checkAndRedirect() {
      var currentUrl = window.location.href;

      // 检查每条重定向规则
      var _iterator = UrlRedirector_createForOfIteratorHelper(this.redirectRules),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var rule = _step.value;
          if (rule.pattern.test(currentUrl)) {
            console.log('[UrlRedirector] 匹配到重定向规则:', rule);

            // 执行重定向
            var newUrl = this.applyRedirect(currentUrl, rule);
            if (newUrl !== currentUrl) {
              console.log('[UrlRedirector] 重定向到:', newUrl);
              window.location.href = newUrl;
              return true;
            }
          }
        }

        // 未触发重定向
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return false;
    }

    /**
     * 应用重定向规则，生成新URL
     * @param {string} url - 当前URL
     * @param {Object} rule - 重定向规则
     * @returns {string} 重定向后的URL
     */
  }, {
    key: "applyRedirect",
    value: function applyRedirect(url, rule) {
      // 替换域名部分
      if (rule.targetDomain) {
        return url.replace(/^(https?:\/\/)(?:www\.)?(missav|thisav)\.com\//i, "$1".concat(rule.targetDomain, "/"));
      }

      // 如果有自定义替换逻辑，可以在这里添加

      return url;
    }
  }]);
}();
;// ./src/userExperienceEnhancer/index.js
function userExperienceEnhancer_typeof(o) { "@babel/helpers - typeof"; return userExperienceEnhancer_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, userExperienceEnhancer_typeof(o); }
function userExperienceEnhancer_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function userExperienceEnhancer_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, userExperienceEnhancer_toPropertyKey(o.key), o); } }
function userExperienceEnhancer_createClass(e, r, t) { return r && userExperienceEnhancer_defineProperties(e.prototype, r), t && userExperienceEnhancer_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function userExperienceEnhancer_toPropertyKey(t) { var i = userExperienceEnhancer_toPrimitive(t, "string"); return "symbol" == userExperienceEnhancer_typeof(i) ? i : i + ""; }
function userExperienceEnhancer_toPrimitive(t, r) { if ("object" != userExperienceEnhancer_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != userExperienceEnhancer_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 用户体验增强模块入口
 * 负责管理和协调各种增强用户体验的功能
 */






/**
 * 用户体验增强器类
 * 整合了自动展开详情、自动高画质、URL重定向等功能
 */
var UserExperienceEnhancer = /*#__PURE__*/function () {
  function UserExperienceEnhancer() {
    userExperienceEnhancer_classCallCheck(this, UserExperienceEnhancer);
    this.detailExpander = new DetailExpander();
    this.qualityManager = new QualityManager();
    this.urlRedirector = new UrlRedirector();
  }

  /**
   * 初始化用户体验增强功能
   */
  return userExperienceEnhancer_createClass(UserExperienceEnhancer, [{
    key: "init",
    value: function init() {
      var _this = this;
      console.log('[UserExperienceEnhancer] 初始化用户体验增强功能');

      // 首先执行URL重定向
      this.urlRedirector.checkAndRedirect();

      // DOM加载完成后执行其他功能
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
          _this.initFeatures();
        });
      } else {
        this.initFeatures();
      }
    }

    /**
     * 初始化各项功能
     */
  }, {
    key: "initFeatures",
    value: function initFeatures() {
      try {
        this.detailExpander.autoExpandDetails();
        this.qualityManager.setupAutoHighestQuality();
      } catch (error) {
        console.error('[UserExperienceEnhancer] 初始化功能时出错:', error);
      }
    }
  }]);
}();

// 导出各个组件，便于单独使用




/**
 * 初始化用户体验增强功能
 * @returns {UserExperienceEnhancer} 用户体验增强器实例
 */
function initUserExperienceEnhancer() {
  var enhancer = new UserExperienceEnhancer();
  enhancer.init();
  return enhancer;
}
;// ./src/index.js
function src_typeof(o) { "@babel/helpers - typeof"; return src_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, src_typeof(o); }
function src_regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ src_regeneratorRuntime = function _regeneratorRuntime() { return r; }; var t, r = {}, e = Object.prototype, n = e.hasOwnProperty, o = "function" == typeof Symbol ? Symbol : {}, i = o.iterator || "@@iterator", a = o.asyncIterator || "@@asyncIterator", u = o.toStringTag || "@@toStringTag"; function c(t, r, e, n) { return Object.defineProperty(t, r, { value: e, enumerable: !n, configurable: !n, writable: !n }); } try { c({}, ""); } catch (t) { c = function c(t, r, e) { return t[r] = e; }; } function h(r, e, n, o) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype); return c(a, "_invoke", function (r, e, n) { var o = 1; return function (i, a) { if (3 === o) throw Error("Generator is already running"); if (4 === o) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var u = n.delegate; if (u) { var c = d(u, n); if (c) { if (c === f) continue; return c; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (1 === o) throw o = 4, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = 3; var h = s(r, e, n); if ("normal" === h.type) { if (o = n.done ? 4 : 2, h.arg === f) continue; return { value: h.arg, done: n.done }; } "throw" === h.type && (o = 4, n.method = "throw", n.arg = h.arg); } }; }(r, n, new Context(o || [])), !0), a; } function s(t, r, e) { try { return { type: "normal", arg: t.call(r, e) }; } catch (t) { return { type: "throw", arg: t }; } } r.wrap = h; var f = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var l = {}; c(l, i, function () { return this; }); var p = Object.getPrototypeOf, y = p && p(p(x([]))); y && y !== e && n.call(y, i) && (l = y); var v = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(l); function g(t) { ["next", "throw", "return"].forEach(function (r) { c(t, r, function (t) { return this._invoke(r, t); }); }); } function AsyncIterator(t, r) { function e(o, i, a, u) { var c = s(t[o], t, i); if ("throw" !== c.type) { var h = c.arg, f = h.value; return f && "object" == src_typeof(f) && n.call(f, "__await") ? r.resolve(f.__await).then(function (t) { e("next", t, a, u); }, function (t) { e("throw", t, a, u); }) : r.resolve(f).then(function (t) { h.value = t, a(h); }, function (t) { return e("throw", t, a, u); }); } u(c.arg); } var o; c(this, "_invoke", function (t, n) { function i() { return new r(function (r, o) { e(t, n, r, o); }); } return o = o ? o.then(i, i) : i(); }, !0); } function d(r, e) { var n = e.method, o = r.i[n]; if (o === t) return e.delegate = null, "throw" === n && r.i["return"] && (e.method = "return", e.arg = t, d(r, e), "throw" === e.method) || "return" !== n && (e.method = "throw", e.arg = new TypeError("The iterator does not provide a '" + n + "' method")), f; var i = s(o, r.i, e.arg); if ("throw" === i.type) return e.method = "throw", e.arg = i.arg, e.delegate = null, f; var a = i.arg; return a ? a.done ? (e[r.r] = a.value, e.next = r.n, "return" !== e.method && (e.method = "next", e.arg = t), e.delegate = null, f) : a : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), e.delegate = null, f); } function w(t) { this.tryEntries.push(t); } function m(r) { var e = r[4] || {}; e.type = "normal", e.arg = t, r[4] = e; } function Context(t) { this.tryEntries = [[-1]], t.forEach(w, this), this.reset(!0); } function x(r) { if (null != r) { var e = r[i]; if (e) return e.call(r); if ("function" == typeof r.next) return r; if (!isNaN(r.length)) { var o = -1, a = function e() { for (; ++o < r.length;) if (n.call(r, o)) return e.value = r[o], e.done = !1, e; return e.value = t, e.done = !0, e; }; return a.next = a; } } throw new TypeError(src_typeof(r) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(v, "constructor", GeneratorFunctionPrototype), c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, u, "GeneratorFunction"), r.isGeneratorFunction = function (t) { var r = "function" == typeof t && t.constructor; return !!r && (r === GeneratorFunction || "GeneratorFunction" === (r.displayName || r.name)); }, r.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, c(t, u, "GeneratorFunction")), t.prototype = Object.create(v), t; }, r.awrap = function (t) { return { __await: t }; }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, a, function () { return this; }), r.AsyncIterator = AsyncIterator, r.async = function (t, e, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(h(t, e, n, o), i); return r.isGeneratorFunction(e) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, g(v), c(v, u, "Generator"), c(v, i, function () { return this; }), c(v, "toString", function () { return "[object Generator]"; }), r.keys = function (t) { var r = Object(t), e = []; for (var n in r) e.unshift(n); return function t() { for (; e.length;) if ((n = e.pop()) in r) return t.value = n, t.done = !1, t; return t.done = !0, t; }; }, r.values = x, Context.prototype = { constructor: Context, reset: function reset(r) { if (this.prev = this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(m), !r) for (var e in this) "t" === e.charAt(0) && n.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0][4]; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(r) { if (this.done) throw r; var e = this; function n(t) { a.type = "throw", a.arg = r, e.next = t; } for (var o = e.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i[4], u = this.prev, c = i[1], h = i[2]; if (-1 === i[0]) return n("end"), !1; if (!c && !h) throw Error("try statement without catch or finally"); if (null != i[0] && i[0] <= u) { if (u < c) return this.method = "next", this.arg = t, n(c), !0; if (u < h) return n(h), !1; } } }, abrupt: function abrupt(t, r) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var n = this.tryEntries[e]; if (n[0] > -1 && n[0] <= this.prev && this.prev < n[2]) { var o = n; break; } } o && ("break" === t || "continue" === t) && o[0] <= r && r <= o[2] && (o = null); var i = o ? o[4] : {}; return i.type = t, i.arg = r, o ? (this.method = "next", this.next = o[2], f) : this.complete(i); }, complete: function complete(t, r) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && r && (this.next = r), f; }, finish: function finish(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[2] === t) return this.complete(e[4], e[3]), m(e), f; } }, "catch": function _catch(t) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var e = this.tryEntries[r]; if (e[0] === t) { var n = e[4]; if ("throw" === n.type) { var o = n.arg; m(e); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(r, e, n) { return this.delegate = { i: x(r), r: e, n: n }, "next" === this.method && (this.arg = t), f; } }, r; }
function src_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function src_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { src_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { src_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }








/**
 * 配置viewport以支持iOS安全区域
 */
function setupViewport() {
  var viewportMeta = document.querySelector('meta[name="viewport"]');

  // 如果页面中没有viewport meta标签，则创建一个
  if (!viewportMeta) {
    viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    document.head.appendChild(viewportMeta);
  }

  // 更新viewport内容，添加viewport-fit=cover以支持安全区域
  viewportMeta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
  console.log('[Miss NoAD Player] 已配置viewport以支持安全区域');
}

/**
 * 脚本入口函数
 */
(function () {
  'use strict';

  // 全局状态管理和播放器实例
  var playerState = null;
  var videoPlayerInstance = null;

  /**
   * 注入CSS样式
   */
  function injectStyles() {
    // 确保样式只注入一次
    if (document.getElementById('tm-player-styles')) return;

    // 配置viewport以支持安全区域
    setupViewport();

    // 注入CSS变量和样式
    initCSSVariables();

    // 控制台日志 - 便于调试
    console.log('[Miss NoAD Player] 样式注入完成');
  }

  /**
   * 启动脚本
   */
  function startScript() {
    return _startScript.apply(this, arguments);
  } // 确保在 document idle 时执行
  function _startScript() {
    _startScript = src_asyncToGenerator(/*#__PURE__*/src_regeneratorRuntime().mark(function _callee() {
      var userExperienceEnhancer, floatingButton, loginManager, adBlocker;
      return src_regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            // 首先注入样式
            injectStyles();

            // 初始化用户体验增强模块（包含URL重定向功能）
            userExperienceEnhancer = initUserExperienceEnhancer();
            console.log('[Miss NoAD Player] 用户体验增强模块已初始化');

            // 创建状态管理实例
            playerState = new PlayerState();

            // 加载设置
            playerState.loadSettings();

            // 创建浮动按钮实例并初始化
            floatingButton = new FloatingButton({
              playerState: playerState
            }); // 初始化浮动按钮
            floatingButton.init();

            // 初始化自动登录模块
            _context.next = 10;
            return initAutoLogin();
          case 10:
            loginManager = _context.sent;
            if (loginManager) {
              console.log('[Miss NoAD Player] 自动登录模块已初始化');
            }

            // 初始化广告屏蔽模块
            adBlocker = new adblock();
            adBlocker.init();

            // 控制台日志 - 便于调试
            console.log('[Miss NoAD Player] 初始化完成');
            _context.next = 20;
            break;
          case 17:
            _context.prev = 17;
            _context.t0 = _context["catch"](0);
            console.error('[Miss NoAD Player] 初始化失败:', _context.t0);
            break;
          case 20:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[0, 17]]);
    }));
    return _startScript.apply(this, arguments);
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(startScript, 100); // 延迟100ms确保DOM完全加载
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      return setTimeout(startScript, 100);
    });
  }
})();

/**
 * 统一导出API，使用模块化版本
 */


// 导出工具类和其他组件




// 为兼容性考虑，同时导出为ModularVideoPlayer

/******/ })()
;