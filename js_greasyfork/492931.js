// ==UserScript==
// @name        Furaffinity-Submission-Image-Viewer
// @namespace   Violentmonkey Scripts
// @grant       GM_info
// @version     1.2.0
// @author      Midori Dragon
// @description Library for creating custom image elements on Furaffinity
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/492931-furaffinity-submission-image-viewer
// @supportURL  https://greasyfork.org/scripts/492931-furaffinity-submission-image-viewer/feedback
// ==/UserScript==
// jshint esversion: 8
(() => {
    "use strict";
    var __webpack_modules__ = {
        56: (module, __unused_webpack_exports, __webpack_require__) => {
            module.exports = function setAttributesWithoutAttributes(styleElement) {
                var nonce = true ? __webpack_require__.nc : 0;
                if (nonce) styleElement.setAttribute("nonce", nonce);
            };
        },
        72: module => {
            var stylesInDOM = [];
            function getIndexByIdentifier(identifier) {
                for (var result = -1, i = 0; i < stylesInDOM.length; i++) if (stylesInDOM[i].identifier === identifier) {
                    result = i;
                    break;
                }
                return result;
            }
            function modulesToDom(list, options) {
                for (var idCountMap = {}, identifiers = [], i = 0; i < list.length; i++) {
                    var item = list[i], id = options.base ? item[0] + options.base : item[0], count = idCountMap[id] || 0, identifier = "".concat(id, " ").concat(count);
                    idCountMap[id] = count + 1;
                    var indexByIdentifier = getIndexByIdentifier(identifier), obj = {
                        css: item[1],
                        media: item[2],
                        sourceMap: item[3],
                        supports: item[4],
                        layer: item[5]
                    };
                    if (-1 !== indexByIdentifier) {
                        stylesInDOM[indexByIdentifier].references++;
                        stylesInDOM[indexByIdentifier].updater(obj);
                    } else {
                        var updater = addElementStyle(obj, options);
                        options.byIndex = i;
                        stylesInDOM.splice(i, 0, {
                            identifier,
                            updater,
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
                return function updater(newObj) {
                    if (newObj) {
                        if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) return;
                        api.update(obj = newObj);
                    } else api.remove();
                };
            }
            module.exports = function(list, options) {
                var lastIdentifiers = modulesToDom(list = list || [], options = options || {});
                return function update(newList) {
                    newList = newList || [];
                    for (var i = 0; i < lastIdentifiers.length; i++) {
                        var index = getIndexByIdentifier(lastIdentifiers[i]);
                        stylesInDOM[index].references--;
                    }
                    for (var newLastIdentifiers = modulesToDom(newList, options), _i = 0; _i < lastIdentifiers.length; _i++) {
                        var _index = getIndexByIdentifier(lastIdentifiers[_i]);
                        if (0 === stylesInDOM[_index].references) {
                            stylesInDOM[_index].updater();
                            stylesInDOM.splice(_index, 1);
                        }
                    }
                    lastIdentifiers = newLastIdentifiers;
                };
            };
        },
        113: module => {
            module.exports = function styleTagTransform(css, styleElement) {
                if (styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                    for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                    styleElement.appendChild(document.createTextNode(css));
                }
            };
        },
        314: module => {
            module.exports = function(cssWithMappingToString) {
                var list = [];
                list.toString = function toString() {
                    return this.map(function(item) {
                        var content = "", needLayer = void 0 !== item[5];
                        if (item[4]) content += "@supports (".concat(item[4], ") {");
                        if (item[2]) content += "@media ".concat(item[2], " {");
                        if (needLayer) content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
                        content += cssWithMappingToString(item);
                        if (needLayer) content += "}";
                        if (item[2]) content += "}";
                        if (item[4]) content += "}";
                        return content;
                    }).join("");
                };
                list.i = function i(modules, media, dedupe, supports, layer) {
                    if ("string" == typeof modules) modules = [ [ null, modules, void 0 ] ];
                    var alreadyImportedModules = {};
                    if (dedupe) for (var k = 0; k < this.length; k++) {
                        var id = this[k][0];
                        if (null != id) alreadyImportedModules[id] = true;
                    }
                    for (var _k = 0; _k < modules.length; _k++) {
                        var item = [].concat(modules[_k]);
                        if (!dedupe || !alreadyImportedModules[item[0]]) {
                            if (void 0 !== layer) if (void 0 === item[5]) item[5] = layer; else {
                                item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
                                item[5] = layer;
                            }
                            if (media) if (!item[2]) item[2] = media; else {
                                item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
                                item[2] = media;
                            }
                            if (supports) if (!item[4]) item[4] = "".concat(supports); else {
                                item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
                                item[4] = supports;
                            }
                            list.push(item);
                        }
                    }
                };
                return list;
            };
        },
        540: module => {
            module.exports = function insertStyleElement(options) {
                var element = document.createElement("style");
                options.setAttributes(element, options.attributes);
                options.insert(element, options.options);
                return element;
            };
        },
        601: module => {
            module.exports = function(i) {
                return i[1];
            };
        },
        656: (module, __webpack_exports__, __webpack_require__) => {
            __webpack_require__.d(__webpack_exports__, {
                A: () => __WEBPACK_DEFAULT_EXPORT__
            });
            var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601), _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = __webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__), _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314), ___CSS_LOADER_EXPORT___ = __webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__)()(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default());
            ___CSS_LOADER_EXPORT___.push([ module.id, ".siv-image-main {\n    object-fit: cover;\n}\n\n.siv-image-preview {\n    object-fit: cover;\n    image-rendering: pixelated;\n}\n\n.siv-image-container {\n    width: 0px;\n    height: 0px;\n    overflow: hidden;\n}\n\n.siv-parent-container {\n    overflow: hidden;\n}\n\n.zoomable-image {\n    transition: transform 0.3s;\n    transform-origin: center;\n}\n", "" ]);
            const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;
        },
        659: module => {
            var memo = {};
            module.exports = function insertBySelector(insert, style) {
                var target = function getTarget(target) {
                    if (void 0 === memo[target]) {
                        var styleTarget = document.querySelector(target);
                        if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) try {
                            styleTarget = styleTarget.contentDocument.head;
                        } catch (e) {
                            styleTarget = null;
                        }
                        memo[target] = styleTarget;
                    }
                    return memo[target];
                }(insert);
                if (!target) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                target.appendChild(style);
            };
        },
        825: module => {
            module.exports = function domAPI(options) {
                if ("undefined" == typeof document) return {
                    update: function update() {},
                    remove: function remove() {}
                };
                var styleElement = options.insertStyleElement(options);
                return {
                    update: function update(obj) {
                        !function apply(styleElement, options, obj) {
                            var css = "";
                            if (obj.supports) css += "@supports (".concat(obj.supports, ") {");
                            if (obj.media) css += "@media ".concat(obj.media, " {");
                            var needLayer = void 0 !== obj.layer;
                            if (needLayer) css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
                            css += obj.css;
                            if (needLayer) css += "}";
                            if (obj.media) css += "}";
                            if (obj.supports) css += "}";
                            var sourceMap = obj.sourceMap;
                            if (sourceMap && "undefined" != typeof btoa) css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
                            options.styleTagTransform(css, styleElement, options.options);
                        }(styleElement, options, obj);
                    },
                    remove: function remove() {
                        !function removeStyleElement(styleElement) {
                            if (null === styleElement.parentNode) return false;
                            styleElement.parentNode.removeChild(styleElement);
                        }(styleElement);
                    }
                };
            };
        }
    }, __webpack_module_cache__ = {};
    function __webpack_require__(moduleId) {
        var cachedModule = __webpack_module_cache__[moduleId];
        if (void 0 !== cachedModule) return cachedModule.exports;
        var module = __webpack_module_cache__[moduleId] = {
            id: moduleId,
            exports: {}
        };
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        return module.exports;
    }
    __webpack_require__.n = module => {
        var getter = module && module.__esModule ? () => module.default : () => module;
        __webpack_require__.d(getter, {
            a: getter
        });
        return getter;
    };
    __webpack_require__.d = (exports, definition) => {
        for (var key in definition) if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key]
        });
    };
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    __webpack_require__.nc = void 0;
    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    "function" == typeof SuppressedError && SuppressedError;
    if ("undefined" != typeof window) {
        if (window.NodeList && !NodeList.prototype.forEach) NodeList.prototype.forEach = Array.prototype.forEach;
        if ("function" != typeof window.CustomEvent) window.CustomEvent = function CustomEvent(event, params) {
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: null
            };
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };
    }
    var divStyle, isIE = "undefined" != typeof document && !!document.documentMode;
    function createStyle() {
        if (divStyle) return divStyle; else return divStyle = document.createElement("div").style;
    }
    var prefixes = [ "webkit", "moz", "ms" ], prefixCache = {};
    function getPrefixedName(name) {
        if (prefixCache[name]) return prefixCache[name];
        var divStyle = createStyle();
        if (name in divStyle) return prefixCache[name] = name;
        for (var capName = name[0].toUpperCase() + name.slice(1), i = prefixes.length; i--; ) {
            var prefixedName = "".concat(prefixes[i]).concat(capName);
            if (prefixedName in divStyle) return prefixCache[name] = prefixedName;
        }
    }
    function getCSSNum(name, style) {
        return parseFloat(style[getPrefixedName(name)]) || 0;
    }
    function getBoxStyle(elem, name, style) {
        if (void 0 === style) style = window.getComputedStyle(elem);
        var suffix = "border" === name ? "Width" : "";
        return {
            left: getCSSNum("".concat(name, "Left").concat(suffix), style),
            right: getCSSNum("".concat(name, "Right").concat(suffix), style),
            top: getCSSNum("".concat(name, "Top").concat(suffix), style),
            bottom: getCSSNum("".concat(name, "Bottom").concat(suffix), style)
        };
    }
    function setStyle(elem, name, value) {
        elem.style[getPrefixedName(name)] = value;
    }
    function getDimensions(elem) {
        var parent = elem.parentNode, style = window.getComputedStyle(elem), parentStyle = window.getComputedStyle(parent), rectElem = elem.getBoundingClientRect(), rectParent = parent.getBoundingClientRect();
        return {
            elem: {
                style,
                width: rectElem.width,
                height: rectElem.height,
                top: rectElem.top,
                bottom: rectElem.bottom,
                left: rectElem.left,
                right: rectElem.right,
                margin: getBoxStyle(elem, "margin", style),
                border: getBoxStyle(elem, "border", style)
            },
            parent: {
                style: parentStyle,
                width: rectParent.width,
                height: rectParent.height,
                top: rectParent.top,
                bottom: rectParent.bottom,
                left: rectParent.left,
                right: rectParent.right,
                padding: getBoxStyle(parent, "padding", parentStyle),
                border: getBoxStyle(parent, "border", parentStyle)
            }
        };
    }
    var events = {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup mouseleave"
    };
    if ("undefined" != typeof window) if ("function" == typeof window.PointerEvent) events = {
        down: "pointerdown",
        move: "pointermove",
        up: "pointerup pointerleave pointercancel"
    }; else if ("function" == typeof window.TouchEvent) events = {
        down: "touchstart",
        move: "touchmove",
        up: "touchend touchcancel"
    };
    function onPointer(event, elem, handler, eventOpts) {
        events[event].split(" ").forEach(function(name) {
            elem.addEventListener(name, handler, eventOpts);
        });
    }
    function destroyPointer(event, elem, handler) {
        events[event].split(" ").forEach(function(name) {
            elem.removeEventListener(name, handler);
        });
    }
    function findEventIndex(pointers, event) {
        for (var i = pointers.length; i--; ) if (pointers[i].pointerId === event.pointerId) return i;
        return -1;
    }
    function addPointer(pointers, event) {
        var i;
        if (!event.touches) {
            if ((i = findEventIndex(pointers, event)) > -1) pointers.splice(i, 1);
            pointers.push(event);
        } else {
            i = 0;
            for (var _i = 0, _a = event.touches; _i < _a.length; _i++) {
                var touch = _a[_i];
                touch.pointerId = i++;
                addPointer(pointers, touch);
            }
        }
    }
    function getMiddle(pointers) {
        for (var event2, event1 = (pointers = pointers.slice(0)).pop(); event2 = pointers.pop(); ) event1 = {
            clientX: (event2.clientX - event1.clientX) / 2 + event1.clientX,
            clientY: (event2.clientY - event1.clientY) / 2 + event1.clientY
        };
        return event1;
    }
    function getDistance(pointers) {
        if (pointers.length < 2) return 0;
        var event1 = pointers[0], event2 = pointers[1];
        return Math.sqrt(Math.pow(Math.abs(event2.clientX - event1.clientX), 2) + Math.pow(Math.abs(event2.clientY - event1.clientY), 2));
    }
    function hasClass(elem, className) {
        return 1 === elem.nodeType && " ".concat(function getClass(elem) {
            return (elem.getAttribute("class") || "").trim();
        }(elem), " ").indexOf(" ".concat(className, " ")) > -1;
    }
    var rsvg = /^http:[\w\.\/]+svg$/;
    var defaultOptions = {
        animate: false,
        canvas: false,
        cursor: "move",
        disablePan: false,
        disableZoom: false,
        disableXAxis: false,
        disableYAxis: false,
        duration: 200,
        easing: "ease-in-out",
        exclude: [],
        excludeClass: "panzoom-exclude",
        handleStartEvent: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },
        maxScale: 4,
        minScale: .125,
        overflow: "hidden",
        panOnlyWhenZoomed: false,
        pinchAndPan: false,
        relative: false,
        setTransform: function setTransform(elem, _a, _options) {
            var x = _a.x, y = _a.y, scale = _a.scale, isSVG = _a.isSVG;
            setStyle(elem, "transform", "scale(".concat(scale, ") translate(").concat(x, "px, ").concat(y, "px)"));
            if (isSVG && isIE) {
                var matrixValue = window.getComputedStyle(elem).getPropertyValue("transform");
                elem.setAttribute("transform", matrixValue);
            }
        },
        startX: 0,
        startY: 0,
        startScale: 1,
        step: .3,
        touchAction: "none"
    };
    function Panzoom(elem, options) {
        if (!elem) throw new Error("Panzoom requires an element as an argument");
        if (1 !== elem.nodeType) throw new Error("Panzoom requires an element with a nodeType of 1");
        if (!function isAttached(node) {
            for (var currentNode = node; currentNode && currentNode.parentNode; ) {
                if (currentNode.parentNode === document) return true;
                currentNode = currentNode.parentNode instanceof ShadowRoot ? currentNode.parentNode.host : currentNode.parentNode;
            }
            return false;
        }(elem)) throw new Error("Panzoom should be called on elements that have been attached to the DOM");
        options = __assign(__assign({}, defaultOptions), options);
        var isSVG = function isSVGElement(elem) {
            return rsvg.test(elem.namespaceURI) && "svg" !== elem.nodeName.toLowerCase();
        }(elem), parent = elem.parentNode;
        parent.style.overflow = options.overflow;
        parent.style.userSelect = "none";
        parent.style.touchAction = options.touchAction;
        (options.canvas ? parent : elem).style.cursor = options.cursor;
        elem.style.userSelect = "none";
        elem.style.touchAction = options.touchAction;
        setStyle(elem, "transformOrigin", "string" == typeof options.origin ? options.origin : isSVG ? "0 0" : "50% 50%");
        var origX, origY, startClientX, startClientY, startScale, startDistance, x = 0, y = 0, scale = 1, isPanning = false;
        zoom(options.startScale, {
            animate: false,
            force: true
        });
        setTimeout(function() {
            pan(options.startX, options.startY, {
                animate: false,
                force: true
            });
        });
        function trigger(eventName, detail, opts) {
            if (!opts.silent) {
                var event = new CustomEvent(eventName, {
                    detail
                });
                elem.dispatchEvent(event);
            }
        }
        function setTransformWithEvent(eventName, opts, originalEvent) {
            var value = {
                x,
                y,
                scale,
                isSVG,
                originalEvent
            };
            requestAnimationFrame(function() {
                if ("boolean" == typeof opts.animate) if (opts.animate) !function setTransition(elem, options) {
                    var transform = getPrefixedName("transform");
                    setStyle(elem, "transition", "".concat(transform, " ").concat(options.duration, "ms ").concat(options.easing));
                }(elem, opts); else setStyle(elem, "transition", "none");
                opts.setTransform(elem, value, opts);
                trigger(eventName, value, opts);
                trigger("panzoomchange", value, opts);
            });
            return value;
        }
        function constrainXY(toX, toY, toScale, panOptions) {
            var opts = __assign(__assign({}, options), panOptions), result = {
                x,
                y,
                opts
            };
            if (!opts.force && (opts.disablePan || opts.panOnlyWhenZoomed && scale === opts.startScale)) return result;
            toX = parseFloat(toX);
            toY = parseFloat(toY);
            if (!opts.disableXAxis) result.x = (opts.relative ? x : 0) + toX;
            if (!opts.disableYAxis) result.y = (opts.relative ? y : 0) + toY;
            if (opts.contain) {
                var dims = getDimensions(elem), realWidth = dims.elem.width / scale, realHeight = dims.elem.height / scale, scaledWidth = realWidth * toScale, scaledHeight = realHeight * toScale, diffHorizontal = (scaledWidth - realWidth) / 2, diffVertical = (scaledHeight - realHeight) / 2;
                if ("inside" === opts.contain) {
                    var minX = (-dims.elem.margin.left - dims.parent.padding.left + diffHorizontal) / toScale, maxX = (dims.parent.width - scaledWidth - dims.parent.padding.left - dims.elem.margin.left - dims.parent.border.left - dims.parent.border.right + diffHorizontal) / toScale;
                    result.x = Math.max(Math.min(result.x, maxX), minX);
                    var minY = (-dims.elem.margin.top - dims.parent.padding.top + diffVertical) / toScale, maxY = (dims.parent.height - scaledHeight - dims.parent.padding.top - dims.elem.margin.top - dims.parent.border.top - dims.parent.border.bottom + diffVertical) / toScale;
                    result.y = Math.max(Math.min(result.y, maxY), minY);
                } else if ("outside" === opts.contain) {
                    minX = (-(scaledWidth - dims.parent.width) - dims.parent.padding.left - dims.parent.border.left - dims.parent.border.right + diffHorizontal) / toScale, 
                    maxX = (diffHorizontal - dims.parent.padding.left) / toScale;
                    result.x = Math.max(Math.min(result.x, maxX), minX);
                    minY = (-(scaledHeight - dims.parent.height) - dims.parent.padding.top - dims.parent.border.top - dims.parent.border.bottom + diffVertical) / toScale, 
                    maxY = (diffVertical - dims.parent.padding.top) / toScale;
                    result.y = Math.max(Math.min(result.y, maxY), minY);
                }
            }
            if (opts.roundPixels) {
                result.x = Math.round(result.x);
                result.y = Math.round(result.y);
            }
            return result;
        }
        function constrainScale(toScale, zoomOptions) {
            var opts = __assign(__assign({}, options), zoomOptions), result = {
                scale,
                opts
            };
            if (!opts.force && opts.disableZoom) return result;
            var minScale = options.minScale, maxScale = options.maxScale;
            if (opts.contain) {
                var dims = getDimensions(elem), elemWidth = dims.elem.width / scale, elemHeight = dims.elem.height / scale;
                if (elemWidth > 1 && elemHeight > 1) {
                    var elemScaledWidth = (dims.parent.width - dims.parent.border.left - dims.parent.border.right) / elemWidth, elemScaledHeight = (dims.parent.height - dims.parent.border.top - dims.parent.border.bottom) / elemHeight;
                    if ("inside" === options.contain) maxScale = Math.min(maxScale, elemScaledWidth, elemScaledHeight); else if ("outside" === options.contain) minScale = Math.max(minScale, elemScaledWidth, elemScaledHeight);
                }
            }
            result.scale = Math.min(Math.max(toScale, minScale), maxScale);
            return result;
        }
        function pan(toX, toY, panOptions, originalEvent) {
            var result = constrainXY(toX, toY, scale, panOptions);
            if (x !== result.x || y !== result.y) {
                x = result.x;
                y = result.y;
                return setTransformWithEvent("panzoompan", result.opts, originalEvent);
            }
            return {
                x,
                y,
                scale,
                isSVG,
                originalEvent
            };
        }
        function zoom(toScale, zoomOptions, originalEvent) {
            var result = constrainScale(toScale, zoomOptions), opts = result.opts;
            if (opts.force || !opts.disableZoom) {
                toScale = result.scale;
                var toX = x, toY = y;
                if (opts.focal) {
                    var focal = opts.focal;
                    toX = (focal.x / toScale - focal.x / scale + x * toScale) / toScale;
                    toY = (focal.y / toScale - focal.y / scale + y * toScale) / toScale;
                }
                var panResult = constrainXY(toX, toY, toScale, {
                    relative: false,
                    force: true
                });
                x = panResult.x;
                y = panResult.y;
                scale = toScale;
                return setTransformWithEvent("panzoomzoom", opts, originalEvent);
            }
        }
        function zoomInOut(isIn, zoomOptions) {
            var opts = __assign(__assign(__assign({}, options), {
                animate: true
            }), zoomOptions);
            return zoom(scale * Math.exp((isIn ? 1 : -1) * opts.step), opts);
        }
        function zoomToPoint(toScale, point, zoomOptions, originalEvent) {
            var dims = getDimensions(elem), effectiveArea_width = dims.parent.width - dims.parent.padding.left - dims.parent.padding.right - dims.parent.border.left - dims.parent.border.right, effectiveArea_height = dims.parent.height - dims.parent.padding.top - dims.parent.padding.bottom - dims.parent.border.top - dims.parent.border.bottom, clientX = point.clientX - dims.parent.left - dims.parent.padding.left - dims.parent.border.left - dims.elem.margin.left, clientY = point.clientY - dims.parent.top - dims.parent.padding.top - dims.parent.border.top - dims.elem.margin.top;
            if (!isSVG) {
                clientX -= dims.elem.width / scale / 2;
                clientY -= dims.elem.height / scale / 2;
            }
            var focal = {
                x: clientX / effectiveArea_width * (effectiveArea_width * toScale),
                y: clientY / effectiveArea_height * (effectiveArea_height * toScale)
            };
            return zoom(toScale, __assign(__assign({}, zoomOptions), {
                animate: false,
                focal
            }), originalEvent);
        }
        var pointers = [];
        function handleDown(event) {
            if (!function isExcluded(elem, options) {
                for (var cur = elem; null != cur; cur = cur.parentNode) if (hasClass(cur, options.excludeClass) || options.exclude.indexOf(cur) > -1) return true;
                return false;
            }(event.target, options)) {
                addPointer(pointers, event);
                isPanning = true;
                options.handleStartEvent(event);
                origX = x;
                origY = y;
                trigger("panzoomstart", {
                    x,
                    y,
                    scale,
                    isSVG,
                    originalEvent: event
                }, options);
                var point = getMiddle(pointers);
                startClientX = point.clientX;
                startClientY = point.clientY;
                startScale = scale;
                startDistance = getDistance(pointers);
            }
        }
        function handleMove(event) {
            if (isPanning && void 0 !== origX && void 0 !== origY && void 0 !== startClientX && void 0 !== startClientY) {
                addPointer(pointers, event);
                var current = getMiddle(pointers), hasMultiple = pointers.length > 1, toScale = scale;
                if (hasMultiple) {
                    if (0 === startDistance) startDistance = getDistance(pointers);
                    zoomToPoint(toScale = constrainScale((getDistance(pointers) - startDistance) * options.step / 80 + startScale).scale, current, {
                        animate: false
                    }, event);
                }
                if (!hasMultiple || options.pinchAndPan) pan(origX + (current.clientX - startClientX) / toScale, origY + (current.clientY - startClientY) / toScale, {
                    animate: false
                }, event);
            }
        }
        function handleUp(event) {
            if (1 === pointers.length) trigger("panzoomend", {
                x,
                y,
                scale,
                isSVG,
                originalEvent: event
            }, options);
            !function removePointer(pointers, event) {
                if (!event.touches) {
                    var i = findEventIndex(pointers, event);
                    if (i > -1) pointers.splice(i, 1);
                } else for (;pointers.length; ) pointers.pop();
            }(pointers, event);
            if (isPanning) {
                isPanning = false;
                origX = origY = startClientX = startClientY = void 0;
            }
        }
        var bound = false;
        function bind() {
            if (!bound) {
                bound = true;
                onPointer("down", options.canvas ? parent : elem, handleDown);
                onPointer("move", document, handleMove, {
                    passive: true
                });
                onPointer("up", document, handleUp, {
                    passive: true
                });
            }
        }
        if (!options.noBind) bind();
        return {
            bind,
            destroy: function destroy() {
                bound = false;
                destroyPointer("down", options.canvas ? parent : elem, handleDown);
                destroyPointer("move", document, handleMove);
                destroyPointer("up", document, handleUp);
            },
            eventNames: events,
            getPan: function() {
                return {
                    x,
                    y
                };
            },
            getScale: function() {
                return scale;
            },
            getOptions: function() {
                return function shallowClone(obj) {
                    var clone = {};
                    for (var key in obj) if (obj.hasOwnProperty(key)) clone[key] = obj[key];
                    return clone;
                }(options);
            },
            handleDown,
            handleMove,
            handleUp,
            pan,
            reset: function reset(resetOptions) {
                var opts = __assign(__assign(__assign({}, options), {
                    animate: true,
                    force: true
                }), resetOptions);
                scale = constrainScale(opts.startScale, opts).scale;
                var panResult = constrainXY(opts.startX, opts.startY, scale, opts);
                x = panResult.x;
                y = panResult.y;
                return setTransformWithEvent("panzoomreset", opts);
            },
            resetStyle: function resetStyle() {
                parent.style.overflow = "";
                parent.style.userSelect = "";
                parent.style.touchAction = "";
                parent.style.cursor = "";
                elem.style.cursor = "";
                elem.style.userSelect = "";
                elem.style.touchAction = "";
                setStyle(elem, "transformOrigin", "");
            },
            setOptions: function setOptions(opts) {
                if (void 0 === opts) opts = {};
                for (var key in opts) if (opts.hasOwnProperty(key)) options[key] = opts[key];
                if (opts.hasOwnProperty("cursor") || opts.hasOwnProperty("canvas")) {
                    parent.style.cursor = elem.style.cursor = "";
                    (options.canvas ? parent : elem).style.cursor = options.cursor;
                }
                if (opts.hasOwnProperty("overflow")) parent.style.overflow = opts.overflow;
                if (opts.hasOwnProperty("touchAction")) {
                    parent.style.touchAction = opts.touchAction;
                    elem.style.touchAction = opts.touchAction;
                }
            },
            setStyle: function(name, value) {
                return setStyle(elem, name, value);
            },
            zoom,
            zoomIn: function zoomIn(zoomOptions) {
                return zoomInOut(true, zoomOptions);
            },
            zoomOut: function zoomOut(zoomOptions) {
                return zoomInOut(false, zoomOptions);
            },
            zoomToPoint,
            zoomWithWheel: function zoomWithWheel(event, zoomOptions) {
                event.preventDefault();
                var opts = __assign(__assign(__assign({}, options), zoomOptions), {
                    animate: false
                }), wheel = (0 === event.deltaY && event.deltaX ? event.deltaX : event.deltaY) < 0 ? 1 : -1;
                return zoomToPoint(constrainScale(scale * Math.exp(wheel * opts.step / 3), opts).scale, event, opts, event);
            }
        };
    }
    Panzoom.defaultOptions = defaultOptions;
    class FAImage {
        constructor(zoomEnabled = true, panEnabled = true) {
            this.panzoom = null;
            this._zoomEnabled = true;
            this._panEnabled = true;
            this.wheelHandler = null;
            this.clickBlocker = null;
            this._currentScale = 1;
            this._downPos = null;
            this._draggedSinceDown = false;
            this.pointerDownHandler = null;
            this.pointerMoveHandler = null;
            this.pointerUpHandler = null;
            this._panzoomInitialized = false;
            this._zoomIdleTimer = null;
            this.imgElem = document.createElement("img");
            this.imgElem.classList.add("siv-fa-image", "blocked-content");
            this.imgElem.draggable = false;
            this._zoomEnabled = zoomEnabled;
            this._panEnabled = panEnabled;
            if (zoomEnabled || panEnabled) this.initializePanzoom();
        }
        initializePanzoom() {
            const setupWhenReady = () => {
                if (this.imgElem.parentElement && this.imgElem.complete) {
                    this.setupPanzoom();
                    return true;
                }
                return false;
            };
            if (setupWhenReady()) return;
            this.imgElem.addEventListener("load", () => {
                if (setupWhenReady()) return;
                const observer = new MutationObserver(() => {
                    if (setupWhenReady()) observer.disconnect();
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }, {
                once: true
            });
            const observer = new MutationObserver(() => {
                if (setupWhenReady()) observer.disconnect();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        applyCursor(cursor) {
            this.imgElem.style.setProperty("cursor", cursor, "important");
        }
        setupPanzoom() {
            if (this.imgElem.parentElement) {
                this.panzoom = Panzoom(this.imgElem, {
                    maxScale: 10,
                    minScale: 1,
                    cursor: "",
                    disablePan: !this._panEnabled,
                    disableZoom: !this._zoomEnabled,
                    panOnlyWhenZoomed: true,
                    startScale: 1,
                    startX: 0,
                    startY: 0
                });
                this.applyCursor("pointer");
                this.imgElem.addEventListener("panzoomstart", () => {
                    this.applyCursor("grabbing");
                });
                this.imgElem.addEventListener("panzoomend", () => {
                    this.applyCursor("pointer");
                });
                this.imgElem.addEventListener("panzoomchange", e => {
                    this._currentScale = e.detail.scale;
                    if (null != this._zoomIdleTimer) clearTimeout(this._zoomIdleTimer);
                    this._zoomIdleTimer = setTimeout(() => {
                        var _a;
                        this._zoomIdleTimer = null;
                        if (Math.abs(this._currentScale - 1) < FAImage.SCALE_EPS) null === (_a = this.panzoom) || void 0 === _a || _a.reset({
                            animate: true
                        });
                    }, FAImage.ZOOM_IDLE_MS);
                });
                this.pointerDownHandler = e => {
                    var _a, _b;
                    this._downPos = {
                        x: e.clientX,
                        y: e.clientY
                    };
                    this._draggedSinceDown = false;
                    try {
                        null === (_b = (_a = e.currentTarget).setPointerCapture) || void 0 === _b || _b.call(_a, e.pointerId);
                    } catch (_c) {}
                };
                this.pointerMoveHandler = e => {
                    if (!this._downPos) return;
                    const dx = e.clientX - this._downPos.x, dy = e.clientY - this._downPos.y;
                    if (dx * dx + dy * dy >= FAImage.DRAG_SLOP_PX * FAImage.DRAG_SLOP_PX) this._draggedSinceDown = true;
                };
                this.pointerUpHandler = e => {
                    var _a, _b;
                    this._downPos = null;
                    try {
                        null === (_b = (_a = e.currentTarget).releasePointerCapture) || void 0 === _b || _b.call(_a, e.pointerId);
                    } catch (_c) {}
                };
                this.imgElem.addEventListener("pointerdown", this.pointerDownHandler);
                this.imgElem.addEventListener("pointermove", this.pointerMoveHandler);
                this.imgElem.addEventListener("pointerup", this.pointerUpHandler);
                this.imgElem.addEventListener("pointercancel", this.pointerUpHandler);
                if (!this.clickBlocker) {
                    this.clickBlocker = e => {
                        if (this._draggedSinceDown) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                        this._draggedSinceDown = false;
                    };
                    this.imgElem.addEventListener("click", this.clickBlocker, {
                        capture: true
                    });
                }
                if (this._zoomEnabled && !this.wheelHandler) {
                    this.wheelHandler = e => {
                        e.preventDefault();
                        this.panzoom.zoomWithWheel(e);
                    };
                    this.imgElem.addEventListener("wheel", this.wheelHandler, {
                        passive: false
                    });
                }
            }
        }
        get dataFullviewSrc() {
            var _a;
            return null !== (_a = this.imgElem.getAttribute("data-fullview-src")) && void 0 !== _a ? _a : "";
        }
        set dataFullviewSrc(value) {
            this.imgElem.setAttribute("data-fullview-src", value);
        }
        get dataPreviewSrc() {
            var _a;
            return null !== (_a = this.imgElem.getAttribute("data-preview-src")) && void 0 !== _a ? _a : "";
        }
        set dataPreviewSrc(value) {
            if (null != value) this.imgElem.setAttribute("data-preview-src", value);
        }
        set src(value) {
            this.imgElem.src = value;
            this.dataFullviewSrc = value;
        }
        get zoomEnabled() {
            return this._zoomEnabled;
        }
        set zoomEnabled(value) {
            var _a;
            this._zoomEnabled = value;
            if (!this._panzoomInitialized) this.initializePanzoom();
            null === (_a = this.panzoom) || void 0 === _a || _a.setOptions({
                disableZoom: !value
            });
            if (value) {
                if (!this.wheelHandler) {
                    this.wheelHandler = e => {
                        var _a;
                        e.preventDefault();
                        null === (_a = this.panzoom) || void 0 === _a || _a.zoomWithWheel(e);
                    };
                    this.imgElem.addEventListener("wheel", this.wheelHandler, {
                        passive: false
                    });
                }
            } else if (this.wheelHandler) {
                this.imgElem.removeEventListener("wheel", this.wheelHandler);
                this.wheelHandler = null;
            }
        }
        get panEnabled() {
            return this._panEnabled;
        }
        set panEnabled(value) {
            var _a;
            this._panEnabled = value;
            if (!this._panzoomInitialized) this.initializePanzoom();
            null === (_a = this.panzoom) || void 0 === _a || _a.setOptions({
                disablePan: !value
            });
        }
        reset() {
            if (this.panzoom) this.panzoom.reset();
            this._currentScale = 1;
            this._downPos = null;
            this._draggedSinceDown = false;
        }
        destroy() {
            var _a;
            if (this.wheelHandler) {
                this.imgElem.removeEventListener("wheel", this.wheelHandler);
                this.wheelHandler = null;
            }
            if (this.clickBlocker) {
                this.imgElem.removeEventListener("click", this.clickBlocker, {
                    capture: true
                });
                this.clickBlocker = null;
            }
            if (null != this.pointerDownHandler) {
                this.imgElem.removeEventListener("pointerdown", this.pointerDownHandler);
                this.pointerDownHandler = null;
            }
            if (null != this.pointerMoveHandler) {
                this.imgElem.removeEventListener("pointermove", this.pointerMoveHandler);
                this.pointerMoveHandler = null;
            }
            if (null != this.pointerUpHandler) {
                this.imgElem.removeEventListener("pointerup", this.pointerUpHandler);
                this.pointerUpHandler = null;
            }
            this.imgElem.removeEventListener("pointercancel", this.pointerUpHandler);
            this.imgElem.style.removeProperty("cursor");
            null === (_a = this.panzoom) || void 0 === _a || _a.destroy();
            this.panzoom = null;
        }
    }
    FAImage.DRAG_SLOP_PX = 6;
    FAImage.SCALE_EPS = .001;
    FAImage.ZOOM_IDLE_MS = 400;
    function waitForCondition(condition) {
        return new Promise(resolve => {
            const check = () => {
                if (condition()) resolve(); else requestAnimationFrame(check);
            };
            check();
        });
    }
    var injectStylesIntoStyleTag = __webpack_require__(72), injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag), styleDomAPI = __webpack_require__(825), styleDomAPI_default = __webpack_require__.n(styleDomAPI), insertBySelector = __webpack_require__(659), insertBySelector_default = __webpack_require__.n(insertBySelector), setAttributesWithoutAttributes = __webpack_require__(56), setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes), insertStyleElement = __webpack_require__(540), insertStyleElement_default = __webpack_require__.n(insertStyleElement), styleTagTransform = __webpack_require__(113), styleTagTransform_default = __webpack_require__.n(styleTagTransform), Style = __webpack_require__(656), options = {};
    options.styleTagTransform = styleTagTransform_default();
    options.setAttributes = setAttributesWithoutAttributes_default();
    options.insert = insertBySelector_default().bind(null, "head");
    options.domAPI = styleDomAPI_default();
    options.insertStyleElement = insertStyleElement_default();
    injectStylesIntoStyleTag_default()(Style.A, options);
    Style.A && Style.A.locals && Style.A.locals;
    var LogLevel;
    !function(LogLevel) {
        LogLevel[LogLevel.Error = 1] = "Error";
        LogLevel[LogLevel.Warning = 2] = "Warning";
        LogLevel[LogLevel.Info = 3] = "Info";
    }(LogLevel || (LogLevel = {}));
    class Logger {
        static log(logLevel = LogLevel.Warning, ...args) {
            if (null == window.__FF_GLOBAL_LOG_LEVEL__) window.__FF_GLOBAL_LOG_LEVEL__ = LogLevel.Error;
            if (!(logLevel > window.__FF_GLOBAL_LOG_LEVEL__)) switch (logLevel) {
              case LogLevel.Error:
                console.error(...args);
                break;

              case LogLevel.Warning:
                console.warn(...args);
                break;

              case LogLevel.Info:
                console.log(...args);
            }
        }
        static setLogLevel(logLevel) {
            window.__FF_GLOBAL_LOG_LEVEL__ = logLevel;
        }
        static logError(...args) {
            Logger.log(LogLevel.Error, ...args);
        }
        static logWarning(...args) {
            Logger.log(LogLevel.Warning, ...args);
        }
        static logInfo(...args) {
            Logger.log(LogLevel.Info, ...args);
        }
    }
    function checkTags(element) {
        var _a;
        if (!("1" === document.body.getAttribute("data-user-logged-in"))) {
            Logger.logWarning("User is not logged in, skipping tag check");
            setBlockedState(element, false);
            return;
        }
        const tagsHideMissingTags = "1" === document.body.getAttribute("data-tag-blocklist-hide-tagless"), tags = null === (_a = element.getAttribute("data-tags")) || void 0 === _a ? void 0 : _a.trim().split(/\s+/);
        let blockReason = "";
        if (null != tags && tags.length > 0 && "" !== tags[0]) {
            const blockedTags = function getBannedTags(tags) {
                var _a;
                const blockedTags = null !== (_a = document.body.getAttribute("data-tag-blocklist")) && void 0 !== _a ? _a : "", tagsBlocklist = Array.from(blockedTags.split(" "));
                let bTags = [];
                if (null == tags || 0 === tags.length) return [];
                for (const tag of tags) for (const blockedTag of tagsBlocklist) if (tag === blockedTag) bTags.push(blockedTag);
                return [ ...new Set(bTags) ];
            }(tags);
            if (blockedTags.length <= 0) setBlockedState(element, false); else {
                setBlockedState(element, true);
                Logger.logInfo(`${element.id} blocked tags: ${blockedTags.join(", ")}`);
                blockReason = "Blocked tags:\n";
                for (const tag of blockedTags) blockReason += "• " + tag + "\n";
            }
        } else {
            setBlockedState(element, tagsHideMissingTags);
            if (tagsHideMissingTags) blockReason = "Content is missing tags.";
        }
        if ("" !== blockReason && "submissionImg" !== element.id) element.setAttribute("title", blockReason);
    }
    function setBlockedState(element, isBlocked) {
        element.classList[isBlocked ? "add" : "remove"]("blocked-content");
    }
    var __awaiter = function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator.throw(value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : function adopt(value) {
                    return value instanceof P ? value : new P(function(resolve) {
                        resolve(value);
                    });
                }(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class CustomImageViewer extends EventTarget {
        get onImageLoad() {
            return this._onImageLoad;
        }
        set onImageLoad(handler) {
            this._onImageLoad = handler;
        }
        get onImageLoadStart() {
            return this._onImageLoadStart;
        }
        set onImageLoadStart(handler) {
            this._onImageLoadStart = handler;
        }
        get onPreviewImageLoad() {
            return this._onPreviewImageLoad;
        }
        set onPreviewImageLoad(handler) {
            this._onPreviewImageLoad = handler;
        }
        constructor(parentContainer, imageUrl, previewUrl) {
            super();
            Object.setPrototypeOf(this, CustomImageViewer.prototype);
            this.imageUrl = imageUrl;
            this.previewUrl = previewUrl;
            this.parentContainer = parentContainer;
            this.parentContainer.classList.add("siv-parent-container");
            this.faImage = new FAImage;
            this.faImage.imgElem.classList.add("siv-image-main");
            this.faImage.imgElem.addEventListener("load", this.faImageLoaded.bind(this));
            this.faImagePreview = new FAImage(false, false);
            this.faImagePreview.imgElem.classList.add("siv-image-preview");
            this._invisibleContainer = document.createElement("div");
            this._invisibleContainer.classList.add("siv-image-container");
            this._imageLoaded = false;
            this.reset();
        }
        get imageLoaded() {
            return this._imageLoaded;
        }
        set imageLoaded(value) {
            if (this._imageLoaded !== value) {
                this._imageLoaded = value;
                if (value) this.invokeImageLoad();
            }
        }
        reset() {
            var _a, _b;
            this.imageLoaded = false;
            null === (_a = this.faImage.imgElem.parentNode) || void 0 === _a || _a.removeChild(this.faImage.imgElem);
            null === (_b = this.faImagePreview.imgElem.parentNode) || void 0 === _b || _b.removeChild(this.faImagePreview.imgElem);
            this.faImage.src = this.imageUrl;
            this.faImage.dataPreviewSrc = this.previewUrl;
            if (null == this.previewUrl) this.faImagePreview.src = ""; else {
                this.faImagePreview.src = this.previewUrl;
                this.faImagePreview.imgElem.addEventListener("load", this.invokePreviewImageLoad.bind(this));
            }
        }
        destroy() {
            this.faImage.destroy();
            this.faImagePreview.destroy();
        }
        destroyPreview() {
            this.faImagePreview.destroy();
        }
        load() {
            return __awaiter(this, void 0, void 0, function*() {
                this.reset();
                checkTags(this.faImage.imgElem);
                this._invisibleContainer.appendChild(this.faImage.imgElem);
                document.body.appendChild(this._invisibleContainer);
                if (null != this.previewUrl && !this.imageLoaded) {
                    checkTags(this.faImagePreview.imgElem);
                    yield this.checkImageLoadStart();
                }
            });
        }
        checkImageLoadStart() {
            return __awaiter(this, void 0, void 0, function*() {
                yield waitForCondition(() => 0 !== this.faImage.imgElem.offsetWidth);
                this.faImagePreview.imgElem.style.width = this.faImage.imgElem.offsetWidth + "px";
                this.faImagePreview.imgElem.style.height = this.faImage.imgElem.offsetHeight + "px";
                if (!this.imageLoaded) {
                    this.parentContainer.appendChild(this.faImagePreview.imgElem);
                    const previewCondition = () => 0 !== this.faImagePreview.imgElem.offsetWidth;
                    yield waitForCondition(previewCondition);
                    this.invokeImageLoadStart();
                }
            });
        }
        faImageLoaded() {
            var _a, _b;
            null === (_a = this.faImagePreview.imgElem.parentNode) || void 0 === _a || _a.removeChild(this.faImagePreview.imgElem);
            this.parentContainer.appendChild(this.faImage.imgElem);
            null === (_b = this._invisibleContainer.parentNode) || void 0 === _b || _b.removeChild(this._invisibleContainer);
            this.imageLoaded = true;
        }
        invokeImageLoad() {
            var _a;
            null === (_a = this._onImageLoad) || void 0 === _a || _a.call(this);
            this.dispatchEvent(new Event("image-load"));
        }
        invokeImageLoadStart() {
            var _a;
            null === (_a = this._onImageLoadStart) || void 0 === _a || _a.call(this);
            this.dispatchEvent(new Event("image-load-start"));
        }
        invokePreviewImageLoad() {
            var _a;
            null === (_a = this._onPreviewImageLoad) || void 0 === _a || _a.call(this);
            this.dispatchEvent(new Event("preview-image-load"));
        }
    }
    Object.defineProperties(window, {
        FAImageViewer: {
            get: () => CustomImageViewer
        }
    });
})();