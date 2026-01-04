/******/
(function() { // webpackBootstrap
    /******/
    "use strict";
    /******/
    var __webpack_modules__ = ({
        /***/
        "./src/configs/templates/columns.ts":
            /*!******************************************!*\
              !*** ./src/configs/templates/columns.ts ***!
              \******************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                var columnsTemplate = {
                    showDisplay: "block",
                    warns: {
                        appendNode: "menu.appendNode is undefined. Without this, the menu will not be added to HTML. MenuID: [m_id]"
                    },
                    column: {
                        defaultX: 20,
                        defaultY: 20,
                        defaultWidth: 200,
                        defaultHeight: 400,
                        defaultMaxHeight: 400,
                        dragMouseKey: 0,
                        header: {
                            defaultWidth: 200,
                            defaultHeight: 30,
                            openMouseKey: 2,
                            colors: {
                                main: "rgba(26, 26, 26, 1)",
                                text: "rgba(255, 255, 255, 1)"
                            }
                        },
                        container: {
                            showDisplay: "flex",
                            colors: {
                                main: "rgba(26, 26, 26, 1)",
                                text: "rgba(255, 255, 255, 1)"
                            }
                        },
                        optionsContainer: {
                            showDisplay: "flex",
                            colors: {
                                main: "rgba(26, 26, 26, 1)",
                                text: "rgba(255, 255, 255, 1)"
                            }
                        },
                        checkbox: {
                            toggleKey: 0,
                            openOptionsKey: 2
                        }
                    }
                };
                /* harmony default export */
                __webpack_exports__["default"] = (columnsTemplate);
                /***/
            }),
        /***/
        "./src/menu/Menu.ts":
            /*!**************************!*\
              !*** ./src/menu/Menu.ts ***!
              \**************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _layout_htmlLayout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./layout/htmlLayout */ "./src/menu/layout/htmlLayout.ts");
                var Menu = /** @class */ (function() {
                    function Menu(_a) {
                        var id = _a.id,
                            config = _a.config,
                            toggleKey = _a.toggleKey,
                            appendNode = _a.appendNode;
                        this.id = id;
                        this.config = config;
                        this.toggleKey = toggleKey;
                        this.appendNode = appendNode;
                        if (!this.appendNode) {
                            console.warn(this.config.warns.appendNode.replace(/\[m_id\]/g, this.id));
                        }
                        this.holder = document.createElement("div");
                        this.showDisplay = this.config.showDisplay;
                        this.columns = new Map();
                        this.isMenu = true;
                        this.modelsActionEvents = new Map();
                        this.append();
                        this.hide();
                        console.log("Menu created.");
                    }
                    Object.defineProperty(Menu.prototype, "isVisible", {
                        get: function() {
                            return this.holder.style.display === this.showDisplay;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Menu.prototype, "visibleStatus", {
                        get: function() {
                            return this.isVisible ? "show" : "hide";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Menu.prototype, "wrapper", {
                        get: function() {
                            return this.holder.querySelector(".menu-wrapper");
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Menu.prototype.getModel = function(key) {
                        var model = null;
                        this.columns.forEach(function(column) {
                            column.container.models.forEach(function(_model) {
                                if (!_model.options.size || !_model.options.get(key))
                                    return;
                                model = _model.options.get(key);
                                return;
                            });
                            column.container.models.get(key) && (model = column.container.models.get(key));
                        });
                        return model;
                    };
                    Menu.prototype.getModelActive = function(key) {
                        var _a;
                        return (_a = this.getModel(key)) === null || _a === void 0 ? void 0 : _a.isActive;
                    };
                    Menu.prototype.getModelValue = function(key) {
                        var _a;
                        return (_a = this.getModel(key)) === null || _a === void 0 ? void 0 : _a.value;
                    };
                    Menu.prototype.setModelActive = function(key, state) {
                        var model = this.getModel(key);
                        typeof(model === null || model === void 0 ? void 0 : model.isActive) !== 'undefined' && model.setActive(state);
                    };
                    Menu.prototype.setModelValue = function(key, value) {
                        var model = this.getModel(key);
                        typeof(model === null || model === void 0 ? void 0 : model.value) !== 'undefined' && model.setValue(value);
                    };
                    Menu.prototype.onModelsAction = function(callback) {
                        this.modelsActionEvents.set(this.modelsActionEvents.size + 1, callback);
                    };
                    Menu.prototype.add = function() {
                        var _this = this;
                        var columns = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            columns[_i] = arguments[_i];
                        }
                        if (!columns.length)
                            return;
                        for (var _a = 0, columns_1 = columns; _a < columns_1.length; _a++) {
                            var column = columns_1[_a];
                            column.id = this.columns.size + 1;
                            column.build();
                            column.setTo(column.width * (column.id - 1) + 10 * (column.id), column.y);
                            this.wrapper.appendChild(column.element);
                            this.columns.set(column.id, column);
                            column.container.models.forEach(function(model) {
                                model.on("click", function(state) {
                                    _this.modelsActionEvents.forEach(function(callback) {
                                        callback(model.key, state, "click", model);
                                    });
                                });
                                if (model.options.size) {
                                    model.options.forEach(function(option) {
                                        var _loop_1 = function(event_1) {
                                            if (option.events.has(event_1)) {
                                                option.on(event_1, function(value) {
                                                    _this.modelsActionEvents.forEach(function(callback) {
                                                        callback(option.key, value, event_1, option);
                                                    });
                                                });
                                            }
                                        };
                                        for (var _i = 0, _a = ["click", "change", "input"]; _i < _a.length; _i++) {
                                            var event_1 = _a[_i];
                                            _loop_1(event_1);
                                        }
                                    });
                                }
                                return;
                            });
                            console.log("Menu \"".concat(column.header.text, "\" has been added"));
                        }
                    };
                    Menu.prototype.destroy = function() {};
                    Menu.prototype.show = function() {
                        this.holder.style.display = this.showDisplay;
                    };
                    Menu.prototype.hide = function() {
                        this.holder.style.display = "none";
                    };
                    Menu.prototype.toggle = function() {
                        if (this.isVisible)
                            return this.hide();
                        this.show();
                    };
                    Menu.prototype.build = function() {
                        this.holder.classList.add("menu-holder", "absolute", "wh-100", "no-pointer");
                        this.holder.insertAdjacentHTML("beforeend", _layout_htmlLayout__WEBPACK_IMPORTED_MODULE_0__["default"]);
                        this.initEvents();
                    };
                    Menu.prototype.initEvents = function() {
                        var _this = this;
                        var isPressed = false;
                        var isMatchesToggleKey = function(event) {
                            for (var _i = 0, _a = Object.entries(_this.toggleKey); _i < _a.length; _i++) {
                                var entrie = _a[_i];
                                if (event[entrie[0]] !== entrie[1])
                                    continue;
                                return true;
                            }
                            return false;
                        };
                        window.addEventListener("keydown", function(event) {
                            if (!isMatchesToggleKey(event) || isPressed)
                                return;
                            _this.toggle();
                            isPressed = true;
                        });
                        window.addEventListener("keyup", function(event) {
                            if (!isMatchesToggleKey(event))
                                return;
                            isPressed = false;
                        });
                    };
                    Menu.prototype.append = function() {
                        var _this = this;
                        var appendNode = this.appendNode;
                        if (typeof appendNode === 'string') {
                            if (!/whenload/.test(appendNode))
                                return;
                            var constructType = /\(\w+\)/.exec(appendNode)[0].replace(/(\(|\))/g, "");
                            var appendChild = appendNode.split(":")[1];
                            switch (constructType) {
                                case "Node": {
                                    appendNode = eval(appendChild);
                                }
                                break;
                                case "Selector": {
                                    appendNode = document.querySelector(appendChild);
                                }
                                break;
                            }
                            return window.addEventListener("DOMContentLoaded", function() {
                                return appendNode.appendChild(_this.holder);
                            });
                        }
                        appendNode.appendChild(this.holder);
                        this.build();
                    };
                    return Menu;
                }());
                /* harmony default export */
                __webpack_exports__["default"] = (Menu);
                /***/
            }),
        /***/
        "./src/menu/column/Column.ts":
            /*!***********************************!*\
              !*** ./src/menu/column/Column.ts ***!
              \***********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../configs/templates/columns */ "./src/configs/templates/columns.ts");
                /* harmony import */
                var _Container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./Container */ "./src/menu/column/Container.ts");
                /* harmony import */
                var _DragSystem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./DragSystem */ "./src/menu/column/DragSystem.ts");
                /* harmony import */
                var _Header__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./Header */ "./src/menu/column/Header.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();

                function hexToRGBA(hex, alpha) {
                    var r = parseInt(hex.slice(1, 3), 16);
                    var g = parseInt(hex.slice(3, 5), 16);
                    var b = parseInt(hex.slice(5, 7), 16);
                    return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(alpha, ")");
                }
                var Column = /** @class */ (function(_super) {
                    __extends(Column, _super);

                    function Column() {
                        var _this = this;
                        var element = document.createElement("div");
                        var config = _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__["default"].column;
                        var container = new _Container__WEBPACK_IMPORTED_MODULE_1__["default"](element, config.defaultX, config.defaultY, config.header.defaultWidth, "auto");
                        var header = new _Header__WEBPACK_IMPORTED_MODULE_3__["default"](element, config.defaultX, config.defaultY, config.header.defaultWidth, config.header.defaultHeight, container);
                        _this = _super.call(this, header.element, element, config.defaultX, config.defaultY, config.defaultWidth, config.defaultHeight, header.width, header.height) || this;
                        _this.id = NaN;
                        _this.element = element;
                        _this.config = config;
                        _this.header = header;
                        _this.container = container;
                        return _this;
                    }
                    Column.prototype.setMaxHeight = function(maxHeight) {
                        this.container.maxHeight = Math.abs(maxHeight - this.header.height);
                        this.container.updateStyles();
                        this.updateStyles();
                        return this;
                    };
                    Column.prototype.setSize = function(width, height) {
                        this.width = width;
                        this.height = height;
                        this.updateStyles();
                        return this;
                    };
                    Column.prototype.setHeaderShadowActive = function(state) {
                        this.header.isShadowActive = state;
                        return this;
                    };
                    Column.prototype.setHeaderIconURL = function(iconURL) {
                        this.header.iconURL = iconURL;
                        return this;
                    };
                    Column.prototype.setHeaderSize = function(width, height) {
                        this.header.width = width;
                        this.header.height = height;
                        this.header.updateStyles();
                        return this;
                    };
                    Column.prototype.setHeaderText = function(value) {
                        this.header.text = value === null || value === void 0 ? void 0 : value.toString();
                        this.header.updateStyles();
                        return this;
                    };
                    Column.prototype.setHeaderBgColor = function(hex) {
                        this.header.bgColor = hexToRGBA(hex === null || hex === void 0 ? void 0 : hex.toString(), 1);
                        this.header.updateStyles();
                        return this;
                    };
                    Column.prototype.setHeaderTextColor = function(hex) {
                        this.header.textColor = hexToRGBA(hex === null || hex === void 0 ? void 0 : hex.toString(), 1);
                        this.header.updateStyles();
                        return this;
                    };
                    Column.prototype.setContainerBgColor = function(hex) {
                        this.container.bgColor = hexToRGBA(hex === null || hex === void 0 ? void 0 : hex.toString(), 1);
                        this.container.updateStyles();
                        return this;
                    };
                    Column.prototype.setContainerTextColor = function(hex) {
                        this.container.textColor = hexToRGBA(hex === null || hex === void 0 ? void 0 : hex.toString(), 1);
                        this.container.updateStyles();
                        return this;
                    };
                    Column.prototype.updateStyles = function() {
                        this.element.style.width = "".concat(this.width, "px");
                        this.element.style.height = "".concat(this.height, "px");
                        this.element.style.maxHeight = "".concat(this.maxHeight, "px");
                    };
                    Column.prototype.add = function(uiModel) {
                        return this.container.add(uiModel);
                    };
                    Column.prototype.build = function() {
                        this.element.classList.add("menu-column", "absolute", "flex", "fcolumn");
                        this.element.oncontextmenu = function() {
                            return false;
                        };
                        this.updateStyles();
                        this.header.build();
                        this.container.build();
                        this.setMaxHeight(this.height);
                        this._initEvents();
                    };
                    return Column;
                }(_DragSystem__WEBPACK_IMPORTED_MODULE_2__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (Column);
                /***/
            }),
        /***/
        "./src/menu/column/Container.ts":
            /*!**************************************!*\
              !*** ./src/menu/column/Container.ts ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../configs/templates/columns */ "./src/configs/templates/columns.ts");
                /* harmony import */
                var _StyleSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./StyleSystem */ "./src/menu/column/StyleSystem.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var Container = /** @class */ (function(_super) {
                    __extends(Container, _super);

                    function Container(parent, x, y, width, height) {
                        var _this = this;
                        var element = document.createElement("container");
                        var config = _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__["default"].column;
                        _this = _super.call(this, element, config.container.colors) || this;
                        _this.parent = parent;
                        _this.x = x;
                        _this.y = y;
                        _this.width = width;
                        _this.height = height;
                        _this.parent = parent;
                        _this.x = x;
                        _this.y = y;
                        _this.width = width;
                        _this.height = height;
                        _this.element = element;
                        _this.config = config;
                        _this.maxHeight = 0;
                        _this.models = new Map();
                        return _this;
                    }
                    Object.defineProperty(Container.prototype, "isVisible", {
                        get: function() {
                            return this.element.style.display === this.config.container.showDisplay;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Container.prototype, "visibleStatus", {
                        get: function() {
                            return this.isVisible ? "show" : "hide";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Container.prototype.show = function() {
                        this.element.style.display = this.config.container.showDisplay;
                    };
                    Container.prototype.hide = function() {
                        this.element.style.display = "none";
                    };
                    Container.prototype.toggle = function() {
                        if (this.isVisible)
                            return this.hide();
                        this.show();
                    };
                    Container.prototype.add = function(uiModel) {
                        if (!uiModel.key)
                            return;
                        uiModel.setParent(this.element);
                        return this.models.set(uiModel.key, uiModel).get(uiModel.key);
                    };
                    Container.prototype.updateStyles = function() {
                        var _this = this;
                        this._updateStyles(this.width, this.height);
                        this.element.style.maxHeight = "".concat(this.maxHeight, "px");
                        this.models.forEach(function(model) {
                            model.bgColor = _this.bgColor;
                            model.textColor = _this.textColor;
                            model._updateStyles("intial", "auto");
                            if (model.options.size) {
                                model.optionsContainer.bgColor = _this.bgColor;
                                model.optionsContainer.textColor = _this.textColor;
                                model.optionsContainer.updateStyles();
                            }
                        });
                    };
                    Container.prototype.build = function() {
                        this.element.classList.add("column-container", "flex", "fcolumn", "all-pointer");
                        this.parent.appendChild(this.element);
                        this.models.forEach(function(model) {
                            model.build();
                        });
                        this.hide();
                        this.updateStyles();
                    };
                    return Container;
                }(_StyleSystem__WEBPACK_IMPORTED_MODULE_1__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (Container);
                /***/
            }),
        /***/
        "./src/menu/column/DragSystem.ts":
            /*!***************************************!*\
              !*** ./src/menu/column/DragSystem.ts ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../configs/templates/columns */ "./src/configs/templates/columns.ts");
                var DragSystem = /** @class */ (function() {
                    function DragSystem(targetNode, node, x, y, width, height, collisionWidth, collisionHeight) {
                        this.targetNode = targetNode;
                        this.node = node;
                        this.x = x;
                        this.y = y;
                        this.width = width;
                        this.height = height;
                        this.collisionWidth = collisionWidth;
                        this.collisionHeight = collisionHeight;
                        this.targetNode = targetNode;
                        this.node = node;
                        this.x = x;
                        this.y = y;
                        this.width = width;
                        this.height = height;
                        this.collisionWidth = collisionWidth;
                        this.collisionHeight = collisionHeight;
                        this._config = _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__["default"].column;
                        this.isDragging = false;
                        this.setTo(this.x, this.y);
                    }
                    DragSystem.prototype.fixXY = function() {
                        this.x <= 0 && (this.x = 0);
                        this.y <= 0 && (this.y = 0);
                        this.x + this.collisionWidth >= window.innerWidth && (this.x = window.innerWidth - this.collisionWidth);
                        this.y + this.collisionHeight >= window.innerHeight && (this.y = window.innerHeight - this.collisionHeight);
                    };
                    DragSystem.prototype.setTo = function(x, y, checkCollision) {
                        typeof checkCollision === 'undefined' && (checkCollision = true);
                        this.x = x;
                        this.y = y;
                        checkCollision && this.fixXY();
                        this.node.style.left = "".concat(this.x, "px");
                        this.node.style.top = "".concat(this.y, "px");
                    };
                    DragSystem.prototype._initEvents = function() {
                        var _this = this;
                        var mousePressed = false;
                        this.targetNode.addEventListener("mousedown", function(event) {
                            if (mousePressed || event.button !== _this._config.dragMouseKey)
                                return;
                            _this.isDragging = true;
                            mousePressed = true;
                        });
                        window.addEventListener("mouseup", function(event) {
                            if (event.button !== _this._config.dragMouseKey)
                                return;
                            _this.isDragging = false;
                            mousePressed = false;
                        });
                        window.addEventListener("mousemove", function(event) {
                            if (!_this.isDragging)
                                return;
                            var x = event.clientX - parseInt(_this.targetNode.style.width) / 2;
                            var y = event.clientY - parseInt(_this.targetNode.style.height) / 2;
                            _this.setTo(x, y);
                        });
                        window.addEventListener("resize", function() {
                            _this.setTo(_this.x, _this.y);
                        });
                    };
                    return DragSystem;
                }());
                /* harmony default export */
                __webpack_exports__["default"] = (DragSystem);
                /***/
            }),
        /***/
        "./src/menu/column/Header.ts":
            /*!***********************************!*\
              !*** ./src/menu/column/Header.ts ***!
              \***********************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../configs/templates/columns */ "./src/configs/templates/columns.ts");
                /* harmony import */
                var _StyleSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./StyleSystem */ "./src/menu/column/StyleSystem.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var Header = /** @class */ (function(_super) {
                    __extends(Header, _super);

                    function Header(parent, x, y, width, height, targetContainer) {
                        var _this = this;
                        var element = document.createElement("header");
                        var config = _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__["default"].column;
                        _this = _super.call(this, element, config.header.colors) || this;
                        _this.parent = parent;
                        _this.x = x;
                        _this.y = y;
                        _this.width = width;
                        _this.height = height;
                        _this.targetContainer = targetContainer;
                        _this.parent = parent;
                        _this.x = x;
                        _this.y = y;
                        _this.width = width;
                        _this.height = height;
                        _this.targetContainer = targetContainer;
                        _this.element = element;
                        _this.config = config;
                        _this.text = "ColumnMenu";
                        _this.iconURL = "";
                        return _this;
                    }
                    Object.defineProperty(Header.prototype, "textElement", {
                        get: function() {
                            return this.element.querySelector(".header-text");
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Header.prototype, "iconElement", {
                        get: function() {
                            return this.element.querySelector(".header-icon");
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Header.prototype, "html", {
                        get: function() {
                            return "\n        ".concat(/^https?\:\/{2}/.test(this.iconURL) ? "<img class=\"header-icon\" src=\"".concat(this.iconURL, "\">") : "", "\n        <span class=\"header-text\">").concat(this.text, "</span>\n        ");
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Header.prototype.updateStyles = function() {
                        this._updateStyles(this.width, this.height);
                        if (this.iconElement instanceof HTMLImageElement) {
                            this.iconElement.src !== this.iconURL && (this.iconElement.src = this.iconURL);
                        }
                        if (this.textElement instanceof HTMLSpanElement) {
                            this.textElement.innerText = this.text;
                        }
                    };
                    Header.prototype.initEvents = function() {
                        var _this = this;
                        var mousePressed = false;
                        this.element.addEventListener("mousedown", function(event) {
                            if (mousePressed || event.button !== _this.config.header.openMouseKey)
                                return;
                            _this.targetContainer.toggle();
                            mousePressed = true;
                        });
                        window.addEventListener("mouseup", function(event) {
                            if (event.button !== _this.config.header.openMouseKey)
                                return;
                            mousePressed = false;
                        });
                    };
                    Header.prototype.build = function() {
                        this.element.classList.add("column-header", "flex", "fcenter", "all-pointer");
                        this.parent.appendChild(this.element);
                        this.element.insertAdjacentHTML("beforeend", this.html);
                        this.updateStyles();
                        this.initEvents();
                    };
                    return Header;
                }(_StyleSystem__WEBPACK_IMPORTED_MODULE_1__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (Header);
                /***/
            }),
        /***/
        "./src/menu/column/StyleSystem.ts":
            /*!****************************************!*\
              !*** ./src/menu/column/StyleSystem.ts ***!
              \****************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                var StyleSystem = /** @class */ (function() {
                    function StyleSystem(node, colors) {
                        this.node = node;
                        this.colors = colors;
                        this.node = node;
                        this.colors = colors;
                        this.bgColor = this.colors.main;
                        this.textColor = this.colors.text;
                        this.isShadowActive = false;
                    }
                    Object.defineProperty(StyleSystem.prototype, "alphaReg", {
                        get: function() {
                            return /\,\s?\d(\.\d+)?\)/gm;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(StyleSystem.prototype, "onlyRGBReg", {
                        get: function() {
                            return /(?!\d+\)$)\d+/ig;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    StyleSystem.prototype.getBorderColor = function() {
                        return this.bgColor.replace(this.alphaReg, ",1)").replace(this.onlyRGBReg, function(value) {
                            var offset = 1;
                            return value >> offset <= 255 && value >> offset >= 0 ? value >> offset : value;
                        });
                    };
                    StyleSystem.prototype.getBackgroundColor = function() {
                        return this.bgColor.replace(this.alphaReg, ",0.7)");
                    };
                    StyleSystem.prototype._updateStyles = function(width, height) {
                        var backgroundColor = this.getBackgroundColor();
                        var borderColor = this.getBorderColor();
                        this.node.style.width = typeof width === 'number' ? "".concat(width, "px") : width;
                        this.node.style.height = typeof height === 'number' ? "".concat(height, "px") : height;
                        this.node.style.backgroundColor = backgroundColor;
                        this.node.style.borderColor = borderColor;
                        this.node.style.boxShadow = this.isShadowActive ? "inset 0px 0px 6px 2px ".concat(borderColor) : "";
                        this.node.style.color = this.textColor;
                    };
                    return StyleSystem;
                }());
                /* harmony default export */
                __webpack_exports__["default"] = (StyleSystem);
                /***/
            }),
        /***/
        "./src/menu/column/models/Checkbox.ts":
            /*!********************************************!*\
              !*** ./src/menu/column/models/Checkbox.ts ***!
              \********************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _UIModel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./UIModel */ "./src/menu/column/models/UIModel.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var Checkbox = /** @class */ (function(_super) {
                    __extends(Checkbox, _super);

                    function Checkbox(_a) {
                        var key = _a.key,
                            name = _a.name,
                            description = _a.description,
                            _b = _a.options,
                            options = _b === void 0 ? [] : _b,
                            _c = _a.isActive,
                            isActive = _c === void 0 ? false : _c,
                            _d = _a.isDisabled,
                            isDisabled = _d === void 0 ? false : _d;
                        var _this = this;
                        var element = document.createElement("box");
                        _this = _super.call(this, {
                            key: key,
                            name: name,
                            description: description,
                            options: options,
                            node: element
                        }) || this;
                        _this.isActive = isActive;
                        _this.isDisabled = isDisabled;
                        _this.element = element;
                        _this.events = new Map([
                            ["click", new Map()]
                        ]);
                        return _this;
                    }
                    Object.defineProperty(Checkbox.prototype, "html", {
                        get: function() {
                            return "\n        <span class=\"ui-model-text\">".concat(this.name, "</span>\n        ");
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Checkbox.prototype.on = function(event, callback) {
                        var eventMap = this.events.get(event);
                        eventMap.set(eventMap.size + 1, callback);
                    };
                    Checkbox.prototype.setActive = function(activeState) {
                        this.isActive = activeState;
                        this.updateClasses();
                    };
                    Checkbox.prototype.setDisabled = function(activeState) {
                        this.isDisabled = activeState;
                        this.updateClasses();
                    };
                    Checkbox.prototype.toggle = function() {
                        var _this = this;
                        this.setActive(!this.isActive);
                        var eventMap = this.events.get("click");
                        eventMap.forEach(function(callback) {
                            callback(_this.isActive, _this.element);
                        });
                        return this.isActive;
                    };
                    Checkbox.prototype.initEvents = function() {
                        var _this = this;
                        var mousePressed = false;
                        this.element.addEventListener("mousedown", function(event) {
                            if (mousePressed)
                                return;
                            if (event.button === _this.config.checkbox.toggleKey && !_this.isDisabled) {
                                _this.toggle();
                            }
                            if (event.button === _this.config.checkbox.openOptionsKey) {
                                _this.toggleOptions();
                            }
                            mousePressed = true;
                        });
                        window.addEventListener("mouseup", function(event) {
                            if (event.button !== _this.config.checkbox.toggleKey &&
                                event.button !== _this.config.checkbox.openOptionsKey)
                                return;
                            mousePressed = false;
                        });
                    };
                    Checkbox.prototype.updateClasses = function() {
                        var activeClass = function(isActive) {
                            return isActive ? "active" : "inactive";
                        };
                        this.element.classList.remove(activeClass(!this.isActive));
                        this.element.classList.add(activeClass(this.isActive));
                        if (this.isDisabled) {
                            this.element.classList.add("disabled");
                        } else {
                            this.element.classList.remove("disabled");
                        }
                        this.options.size && this.element.classList.add("has-options");
                    };
                    Checkbox.prototype.build = function() {
                        this.element.classList.add("ui-model", "checkbox-model");
                        this.updateClasses();
                        this.parent.appendChild(this.element);
                        this.element.insertAdjacentHTML("beforeend", this.html);
                        this.initOptions();
                        this.initEvents();
                        this.element.title = "".concat(this.description);
                    };
                    return Checkbox;
                }(_UIModel__WEBPACK_IMPORTED_MODULE_0__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (Checkbox);
                /***/
            }),
        /***/
        "./src/menu/column/models/UIModel.ts":
            /*!*******************************************!*\
              !*** ./src/menu/column/models/UIModel.ts ***!
              \*******************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../configs/templates/columns */ "./src/configs/templates/columns.ts");
                /* harmony import */
                var _StyleSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../StyleSystem */ "./src/menu/column/StyleSystem.ts");
                /* harmony import */
                var _option_OptionsContainer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./option/OptionsContainer */ "./src/menu/column/models/option/OptionsContainer.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var UIModel = /** @class */ (function(_super) {
                    __extends(UIModel, _super);

                    function UIModel(_a) {
                        var key = _a.key,
                            name = _a.name,
                            description = _a.description,
                            options = _a.options,
                            node = _a.node;
                        var _this = this;
                        var config = _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__["default"].column;
                        _this = _super.call(this, node, config.container.colors) || this;
                        _this.key = key;
                        _this.name = name;
                        _this.description = description;
                        _this.options = new Map(options.map(function(option) {
                            return [option.key, option];
                        }));
                        _this.config = config;
                        _this.parent = null;
                        return _this;
                    }
                    UIModel.prototype.setParent = function(parentElement) {
                        this.parent = parentElement;
                    };
                    UIModel.prototype.showOptions = function() {
                        this.optionsContainer.show();
                    };
                    UIModel.prototype.hideOptions = function() {
                        this.optionsContainer.hide();
                    };
                    UIModel.prototype.toggleOptions = function() {
                        if (!this.node.classList.contains("has-options"))
                            return;
                        if (this.node.classList.contains("show-options")) {
                            this.node.classList.remove("show-options");
                            return this.hideOptions();
                        }
                        this.node.classList.add("show-options");
                        this.showOptions();
                    };
                    UIModel.prototype.initOptions = function() {
                        var _this = this;
                        this._updateStyles("initial", "auto");
                        if (this.options.size) {
                            this.optionsContainer = new _option_OptionsContainer__WEBPACK_IMPORTED_MODULE_2__["default"](this.node, this.key);
                        }
                        this.options.forEach(function(option) {
                            _this.optionsContainer.add(option);
                        });
                        if (this.options.size) {
                            this.optionsContainer.build();
                        }
                    };
                    return UIModel;
                }(_StyleSystem__WEBPACK_IMPORTED_MODULE_1__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (UIModel);
                /***/
            }),
        /***/
        "./src/menu/column/models/option/Option.ts":
            /*!*************************************************!*\
              !*** ./src/menu/column/models/option/Option.ts ***!
              \*************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../configs/templates/columns */ "./src/configs/templates/columns.ts");
                /* harmony import */
                var _StyleSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../../StyleSystem */ "./src/menu/column/StyleSystem.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var Option = /** @class */ (function(_super) {
                    __extends(Option, _super);

                    function Option(_a) {
                        var key = _a.key,
                            name = _a.name,
                            description = _a.description,
                            node = _a.node;
                        var _this = this;
                        var config = _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__["default"].column;
                        _this = _super.call(this, node, config.container.colors) || this;
                        _this.key = key;
                        _this.name = name;
                        _this.description = description;
                        _this.config = config;
                        _this.parent = null;
                        return _this;
                    }
                    Option.prototype.setParent = function(parentElement) {
                        this.parent = parentElement;
                    };
                    return Option;
                }(_StyleSystem__WEBPACK_IMPORTED_MODULE_1__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (Option);
                /***/
            }),
        /***/
        "./src/menu/column/models/option/OptionCheckbox.ts":
            /*!*********************************************************!*\
              !*** ./src/menu/column/models/option/OptionCheckbox.ts ***!
              \*********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _Option__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Option */ "./src/menu/column/models/option/Option.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var OptionCheckbox = /** @class */ (function(_super) {
                    __extends(OptionCheckbox, _super);

                    function OptionCheckbox(_a) {
                        var key = _a.key,
                            name = _a.name,
                            description = _a.description,
                            _b = _a.isActive,
                            isActive = _b === void 0 ? false : _b,
                            _c = _a.isDisabled,
                            isDisabled = _c === void 0 ? false : _c;
                        var _this = this;
                        var element = document.createElement("box");
                        _this = _super.call(this, {
                            key: key,
                            name: name,
                            description: description,
                            node: element
                        }) || this;
                        _this.isActive = isActive;
                        _this.isDisabled = isDisabled;
                        _this.element = element;
                        _this.events = new Map([
                            ["click", new Map()]
                        ]);
                        return _this;
                    }
                    Object.defineProperty(OptionCheckbox.prototype, "html", {
                        get: function() {
                            return "\n        <span class=\"ui-option-text\">".concat(this.name, "</span>\n        ");
                        },
                        enumerable: false,
                        configurable: true
                    });
                    OptionCheckbox.prototype.on = function(event, callback) {
                        var eventMap = this.events.get(event);
                        eventMap.set(eventMap.size + 1, callback);
                    };
                    OptionCheckbox.prototype.setActive = function(activeState) {
                        this.isActive = activeState;
                        this.updateClasses();
                    };
                    OptionCheckbox.prototype.setDisabled = function(activeState) {
                        this.isDisabled = activeState;
                        this.updateClasses();
                    };
                    OptionCheckbox.prototype.toggle = function() {
                        var _this = this;
                        this.setActive(!this.isActive);
                        var eventMap = this.events.get("click");
                        eventMap.forEach(function(callback) {
                            callback(_this.isActive, _this.element);
                        });
                        return this.isActive;
                    };
                    OptionCheckbox.prototype.initEvents = function() {
                        var _this = this;
                        var mousePressed = false;
                        this.element.addEventListener("mousedown", function(event) {
                            if (mousePressed)
                                return;
                            if (event.button === _this.config.checkbox.toggleKey && !_this.isDisabled) {
                                _this.toggle();
                            }
                            mousePressed = true;
                        });
                        window.addEventListener("mouseup", function(event) {
                            if (event.button !== _this.config.checkbox.toggleKey &&
                                event.button !== _this.config.checkbox.openOptionsKey)
                                return;
                            mousePressed = false;
                        });
                    };
                    OptionCheckbox.prototype.updateClasses = function() {
                        var activeClass = function(isActive) {
                            return isActive ? "active" : "inactive";
                        };
                        this.element.classList.remove(activeClass(!this.isActive));
                        this.element.classList.add(activeClass(this.isActive));
                        if (this.isDisabled) {
                            this.element.classList.add("disabled");
                        } else {
                            this.element.classList.remove("disabled");
                        }
                    };
                    OptionCheckbox.prototype.build = function() {
                        this.element.classList.add("ui-model", "checkbox-model");
                        this.updateClasses();
                        this.parent.appendChild(this.element);
                        this.element.insertAdjacentHTML("beforeend", this.html);
                        this.initEvents();
                        this.element.title = "".concat(this.description);
                    };
                    return OptionCheckbox;
                }(_Option__WEBPACK_IMPORTED_MODULE_0__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (OptionCheckbox);
                /***/
            }),
        /***/
        "./src/menu/column/models/option/OptionIColor.ts":
            /*!*******************************************************!*\
              !*** ./src/menu/column/models/option/OptionIColor.ts ***!
              \*******************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _Option__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Option */ "./src/menu/column/models/option/Option.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var OptionIColor = /** @class */ (function(_super) {
                    __extends(OptionIColor, _super);

                    function OptionIColor(_a) {
                        var key = _a.key,
                            name = _a.name,
                            description = _a.description,
                            _b = _a.value,
                            value = _b === void 0 ? "" : _b,
                            _c = _a.isDisabled,
                            isDisabled = _c === void 0 ? false : _c;
                        var _this = this;
                        var element = document.createElement("box");
                        element.setAttribute("data-name", name);
                        _this = _super.call(this, {
                            key: key,
                            name: name,
                            description: description,
                            node: element
                        }) || this;
                        _this.value = value;
                        _this.isDisabled = isDisabled;
                        _this.element = element;
                        _this.inputElement = null;
                        _this.events = new Map([
                            ["change", new Map()],
                            ["input", new Map()]
                        ]);
                        return _this;
                    }
                    Object.defineProperty(OptionIColor.prototype, "html", {
                        get: function() {
                            return "\n        <input type=\"color\" class=\"ui-option-input-color\">\n        ";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    OptionIColor.prototype.on = function(event, callback) {
                        var eventMap = this.events.get(event);
                        eventMap.set(eventMap.size + 1, callback);
                    };
                    OptionIColor.prototype.setValue = function(value) {
                        this.value = value;
                        this.inputElement.value = this.value;
                    };
                    OptionIColor.prototype.setDisabled = function(activeState) {
                        this.isDisabled = activeState;
                        this.updateClasses();
                    };
                    OptionIColor.prototype.onChange = function(event) {
                        var _this = this;
                        this.setValue(this.inputElement.value);
                        var eventMap = this.events.get("change");
                        eventMap.forEach(function(callback) {
                            callback(_this.value, event, _this.inputElement);
                        });
                        return this.value;
                    };
                    OptionIColor.prototype.onInput = function(event) {
                        this.onChange(event);
                    };
                    OptionIColor.prototype.initEvents = function() {
                        this.inputElement.addEventListener("change", this.onInput.bind(this));
                        this.inputElement.addEventListener("focus", this.onInput.bind(this));
                        this.inputElement.addEventListener("input", this.onInput.bind(this));
                    };
                    OptionIColor.prototype.updateClasses = function() {
                        if (this.isDisabled) {
                            this.element.classList.add("disabled");
                            this.inputElement.disabled = true;
                        } else {
                            this.element.classList.remove("disabled");
                            this.inputElement.disabled = false;
                        }
                    };
                    OptionIColor.prototype.build = function() {
                        this.element.classList.add("ui-model", "input-color-model", "inactive");
                        this.parent.appendChild(this.element);
                        this.element.insertAdjacentHTML("beforeend", this.html);
                        this.inputElement = this.element.querySelector("input");
                        this.setValue(this.value);
                        this.updateClasses();
                        this.initEvents();
                        this.element.title = "".concat(this.description);
                    };
                    return OptionIColor;
                }(_Option__WEBPACK_IMPORTED_MODULE_0__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (OptionIColor);
                /***/
            }),
        /***/
        "./src/menu/column/models/option/OptionIRange.ts":
            /*!*******************************************************!*\
              !*** ./src/menu/column/models/option/OptionIRange.ts ***!
              \*******************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _Option__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Option */ "./src/menu/column/models/option/Option.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var OptionIRange = /** @class */ (function(_super) {
                    __extends(OptionIRange, _super);

                    function OptionIRange(_a) {
                        var key = _a.key,
                            name = _a.name,
                            description = _a.description,
                            _b = _a.min,
                            min = _b === void 0 ? 0 : _b,
                            _c = _a.max,
                            max = _c === void 0 ? 100 : _c,
                            _d = _a.value,
                            value = _d === void 0 ? "" : _d,
                            _e = _a.fixValue,
                            fixValue = _e === void 0 ? 0 : _e,
                            _f = _a.isDisabled,
                            isDisabled = _f === void 0 ? false : _f;
                        var _this = this;
                        var element = document.createElement("box");
                        element.setAttribute("data-name", name);
                        _this = _super.call(this, {
                            key: key,
                            name: name,
                            description: description,
                            node: element
                        }) || this;
                        _this.min = min;
                        _this.max = max;
                        _this.value = value;
                        _this.fixValue = fixValue;
                        _this.isDisabled = isDisabled;
                        _this.element = element;
                        _this.inputElement = null;
                        _this.events = new Map([
                            ["input", new Map()]
                        ]);
                        return _this;
                    }
                    Object.defineProperty(OptionIRange.prototype, "html", {
                        get: function() {
                            return "\n        <div class=\"ui-input-range-holder\">\n            <div class=\"ui-input-range-info\">\n                <span>".concat(this.name, "</span>\n                <span id=\"").concat(this.key, "_value\">").concat(this.value, "</span>\n            </div>\n            \n            <input type=\"range\" class=\"ui-option-input-range\" min=\"").concat(this.min, "\" max=\"").concat(this.max, "\">\n        </div>\n        ");
                        },
                        enumerable: false,
                        configurable: true
                    });
                    OptionIRange.prototype.on = function(event, callback) {
                        var eventMap = this.events.get(event);
                        eventMap.set(eventMap.size + 1, callback);
                    };
                    OptionIRange.prototype.setValue = function(value) {
                        var valueInfo = document.getElementById("".concat(this.key, "_value"));
                        this.value = value;
                        this.inputElement.value = this.value;
                        valueInfo && (valueInfo.innerText = this.value);
                    };
                    OptionIRange.prototype.setDisabled = function(activeState) {
                        this.isDisabled = activeState;
                        this.updateClasses();
                    };
                    OptionIRange.prototype.onInput = function() {
                        var _this = this;
                        var eventMap = this.events.get("input");
                        eventMap.forEach(function(callback) {
                            callback(_this.value, _this.inputElement);
                        });
                        return this.value;
                    };
                    OptionIRange.prototype.updateBackgroundSize = function() {
                        var value = +this.value;
                        var min = +this.min;
                        var max = +this.max;
                        this.inputElement.style.backgroundSize = (value - min) * 100 / (max - min) + '% 100%';
                    };
                    OptionIRange.prototype.getValueByMouseX = function(mouseX) {
                        var rect = this.element.getBoundingClientRect();
                        var min = +this.min;
                        var max = +this.max;
                        var newValue = ((mouseX / rect.width) * max).toFixed(this.fixValue);
                        return Math.min(Math.max(+newValue, min), max);
                    };
                    OptionIRange.prototype.updateInputValue = function(event) {
                        var value = this.getValueByMouseX(event.offsetX);
                        this.setValue(value);
                        this.onInput();
                        this.inputElement.dispatchEvent(new InputEvent("input"));
                    };
                    OptionIRange.prototype.initEvents = function() {
                        var _this = this;
                        var menuHolder = document.querySelector(".menu-holder");
                        var isPressed = false;
                        this.updateBackgroundSize();
                        this.element.addEventListener("mousedown", function(event) {
                            isPressed = true;
                        });
                        window.addEventListener("mouseup", function(event) {
                            if (!isPressed)
                                return;
                            isPressed = false;
                        });
                        menuHolder.addEventListener("mousemove", function(event) {
                            if (!isPressed)
                                return;
                            _this.updateInputValue(event);
                        });
                        this.inputElement.addEventListener("input", function() {
                            _this.updateBackgroundSize();
                        });
                    };
                    OptionIRange.prototype.updateClasses = function() {
                        if (this.isDisabled) {
                            this.element.classList.add("disabled");
                            this.inputElement.disabled = true;
                        } else {
                            this.element.classList.remove("disabled");
                            this.inputElement.disabled = false;
                        }
                    };
                    OptionIRange.prototype.build = function() {
                        this.element.classList.add("ui-model", "input-range-model", "inactive");
                        this.parent.appendChild(this.element);
                        this.element.insertAdjacentHTML("beforeend", this.html);
                        this.inputElement = this.element.querySelector("input");
                        this.setValue(this.value);
                        this.updateClasses();
                        this.initEvents();
                        this.element.title = "".concat(this.description);
                    };
                    return OptionIRange;
                }(_Option__WEBPACK_IMPORTED_MODULE_0__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (OptionIRange);
                /***/
            }),
        /***/
        "./src/menu/column/models/option/OptionIText.ts":
            /*!******************************************************!*\
              !*** ./src/menu/column/models/option/OptionIText.ts ***!
              \******************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _Option__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./Option */ "./src/menu/column/models/option/Option.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var OptionIText = /** @class */ (function(_super) {
                    __extends(OptionIText, _super);

                    function OptionIText(_a) {
                        var key = _a.key,
                            name = _a.name,
                            description = _a.description,
                            _b = _a.value,
                            value = _b === void 0 ? "" : _b,
                            _c = _a.isDisabled,
                            isDisabled = _c === void 0 ? false : _c;
                        var _this = this;
                        var element = document.createElement("box");
                        _this = _super.call(this, {
                            key: key,
                            name: name,
                            description: description,
                            node: element
                        }) || this;
                        _this.value = value;
                        _this.isDisabled = isDisabled;
                        _this.element = element;
                        _this.inputElement = null;
                        _this.events = new Map([
                            ["input", new Map()]
                        ]);
                        return _this;
                    }
                    Object.defineProperty(OptionIText.prototype, "html", {
                        get: function() {
                            return "\n        <input class=\"ui-option-input-text\" placeholder=\"".concat(this.name, "\">\n        ");
                        },
                        enumerable: false,
                        configurable: true
                    });
                    OptionIText.prototype.on = function(event, callback) {
                        var eventMap = this.events.get(event);
                        eventMap.set(eventMap.size + 1, callback);
                    };
                    OptionIText.prototype.setValue = function(value) {
                        this.value = value;
                        this.inputElement.value = this.value;
                    };
                    OptionIText.prototype.setDisabled = function(activeState) {
                        this.isDisabled = activeState;
                        this.updateClasses();
                    };
                    OptionIText.prototype.onInput = function(event) {
                        var _this = this;
                        this.setValue(this.inputElement.value);
                        var eventMap = this.events.get("input");
                        eventMap.forEach(function(callback) {
                            callback(_this.value, event, _this.inputElement);
                        });
                        return this.value;
                    };
                    OptionIText.prototype.initEvents = function() {
                        this.inputElement.addEventListener("input", this.onInput.bind(this));
                    };
                    OptionIText.prototype.updateClasses = function() {
                        if (this.isDisabled) {
                            this.element.classList.add("disabled");
                            this.inputElement.disabled = true;
                        } else {
                            this.element.classList.remove("disabled");
                            this.inputElement.disabled = false;
                        }
                    };
                    OptionIText.prototype.build = function() {
                        this.element.classList.add("ui-model", "input-text-model", "inactive");
                        this.parent.appendChild(this.element);
                        this.element.insertAdjacentHTML("beforeend", this.html);
                        this.inputElement = this.element.querySelector("input");
                        this.setValue(this.value);
                        this.updateClasses();
                        this.initEvents();
                        this.element.title = "".concat(this.description);
                    };
                    return OptionIText;
                }(_Option__WEBPACK_IMPORTED_MODULE_0__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (OptionIText);
                /***/
            }),
        /***/
        "./src/menu/column/models/option/OptionsContainer.ts":
            /*!***********************************************************!*\
              !*** ./src/menu/column/models/option/OptionsContainer.ts ***!
              \***********************************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ../../../../configs/templates/columns */ "./src/configs/templates/columns.ts");
                /* harmony import */
                var _StyleSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ../../StyleSystem */ "./src/menu/column/StyleSystem.ts");
                var __extends = (undefined && undefined.__extends) || (function() {
                    var extendStatics = function(d, b) {
                        extendStatics = Object.setPrototypeOf ||
                            ({
                                    __proto__: []
                                }
                                instanceof Array && function(d, b) {
                                    d.__proto__ = b;
                                }) ||
                            function(d, b) {
                                for (var p in b)
                                    if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
                            };
                        return extendStatics(d, b);
                    };
                    return function(d, b) {
                        if (typeof b !== "function" && b !== null)
                            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
                        extendStatics(d, b);

                        function __() {
                            this.constructor = d;
                        }
                        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
                    };
                })();
                var OptionsContainer = /** @class */ (function(_super) {
                    __extends(OptionsContainer, _super);

                    function OptionsContainer(parent, parentKey) {
                        var _this = this;
                        var element = document.createElement("container");
                        var config = _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__["default"].column;
                        _this = _super.call(this, element, config.container.colors) || this;
                        _this.parent = parent;
                        _this.parentKey = parentKey;
                        _this.element = element;
                        _this.config = config;
                        _this.models = new Map();
                        return _this;
                    }
                    Object.defineProperty(OptionsContainer.prototype, "isVisible", {
                        get: function() {
                            return this.element.style.display === this.config.optionsContainer.showDisplay;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(OptionsContainer.prototype, "visibleStatus", {
                        get: function() {
                            return this.isVisible ? "show" : "hide";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    OptionsContainer.prototype.show = function() {
                        this.element.style.display = this.config.container.showDisplay;
                    };
                    OptionsContainer.prototype.hide = function() {
                        this.element.style.display = "none";
                    };
                    OptionsContainer.prototype.toggle = function() {
                        if (this.isVisible)
                            return this.hide();
                        this.show();
                    };
                    OptionsContainer.prototype.add = function(option) {
                        return this.models.set(option.key, option).get(option.key);
                    };
                    OptionsContainer.prototype.updateStyles = function() {
                        var _this = this;
                        this._updateStyles("100%", "auto");
                        this.models.forEach(function(model) {
                            model.bgColor = _this.bgColor;
                            model.textColor = _this.textColor;
                            model._updateStyles("intial", "auto");
                        });
                    };
                    OptionsContainer.prototype.build = function() {
                        var _this = this;
                        this.element.classList.add("options-container", "flex", "fcolumn");
                        this.element.id = "".concat(this.parentKey, "_container");
                        this.parent.insertAdjacentHTML("afterend", this.element.outerHTML);
                        this.element = this.parent.nextElementSibling;
                        this.node = this.element;
                        this.models.forEach(function(model) {
                            model.setParent(_this.element);
                            model.build();
                        });
                        this.hide();
                        this.updateStyles();
                    };
                    return OptionsContainer;
                }(_StyleSystem__WEBPACK_IMPORTED_MODULE_1__["default"]));
                /* harmony default export */
                __webpack_exports__["default"] = (OptionsContainer);
                /***/
            }),
        /***/
        "./src/menu/layout/cssLayout.ts":
            /*!**************************************!*\
              !*** ./src/menu/layout/cssLayout.ts ***!
              \**************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                var cssLayout = "\n.menu-holder {\n    z-index: 99999999;\n}\n\n.ui-input-range-holder {\n    display: flex;\n    flex-direction: column;\n    width: 100%;\n    gap: 1.5px;\n    cursor: default;\n}\n\n.ui-input-range-info {\n    display: flex;\n    justify-content: space-between;\n    pointer-events: none;\n    cursor: default;\n}\n\n.ui-option-input-range {\n    -webkit-appearance: none;\n    appearance: none;\n    cursor: pointer;\n    height: 3px;\n    width: 100%;\n    filter: invert(.2);\n    background-image: linear-gradient(currentColor, currentColor);\n    background-size: 0% 100%;\n    background-repeat: no-repeat;\n    margin: 0;\n    padding: 0;\n}\n\n.ui-option-input-range::-webkit-slider-runnable-track {\n    display: none;\n    height: 0;\n}\n  \n.ui-option-input-range::-moz-range-track {\n    display: none;\n    height: 0;\n}\n\n.ui-option-input-text {\n    width: initial;\n    height: initial;\n    background: none;\n    border: none;\n    outline: 0;\n    padding: 0;\n    color: currentColor;\n    font-size: 14px;\n}\n\n.ui-option-input-color {\n    -webkit-appearance: none;\n    width: 100%;\n    height: 100%;\n    background: none;\n    border: none;\n    outline: 0;\n    padding: 0;\n    overflow: hidden;\n    height: 22.5px !important;\n}\n\n.ui-option-input-color::-webkit-color-swatch-wrapper {\n    padding: 0;    \n}\n\n.ui-option-input-color::-webkit-color-swatch {\n    border: none;\n}\n\n.input-color-model {\n    padding: 0 !important;\n}\n\n.input-color-model::before {\n    content: attr(data-name);\n    position: absolute;\n    color: currentColor;\n    pointer-events: none;\n    left: 6.5px;\n}\n\n.input-text-model, .input-color-model {\n    cursor: default !important;\n}\n\n.options-container {\n    border: 1.5px solid;\n    border-top: none;\n    box-sizing: border-box;\n    padding: 2.5px;\n    gap: 2.5px;\n    margin-top: -2.5px;\n}\n\n.options-container::-webkit-scrollbar {\n    width: 6px;\n}\n\n.options-container::-webkit-scrollbar-thumb {\n    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);\n}\n\n.ui-model {\n    display: flex;\n    align-items: center;\n    width: initial;\n    height: 20px !important;\n    cursor: pointer;\n    border: 1.5px solid;\n    font-size: 16px;\n    gap: 5px;\n    padding: 2px 5px;\n    color: inherit !important;\n}\n\n.ui-model.has-options::before {\n    content: \">\";\n    transform: rotate(0deg) scaleY(1.35);\n    cursor: pointer;\n}\n\n.ui-model.has-options.show-options::before {\n    transform: rotate(90deg) scaleY(1.35);\n}\n\n.ui-model.disabled {\n    cursor: default;\n    filter: invert(.15);\n}\n\n.ui-model.active, \n.ui-model.active > .ui-model-text,\n.ui-model.active > .ui-option-text,\n.ui-model.active > .ui-model.has-options::before {\n    filter: invert(0);\n}\n\n.ui-model.inactive {\n    filter: invert(.075);\n}\n\n.ui-model.inactive > .ui-model-text,\n.ui-model.inactive > .ui-option-text,\n.ui-model.inactive.has-options::before {\n    filter: invert(.3);\n}\n\n.column-container {\n    border: 1.5px solid;\n    border-top: none;\n    box-sizing: border-box;\n    padding: 2.5px;\n    gap: 2.5px;\n    overflow-y: auto;\n}\n\n.column-container::-webkit-scrollbar {\n    width: 6px;\n}\n\n.column-container::-webkit-scrollbar-thumb {\n    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);\n}\n\n.column-header {\n    cursor: pointer;\n    border: 1px solid;\n    box-sizing: border-box;\n    transition: .1s filter;\n}\n\n.column-header:hover {\n    filter: grayscale(0.15);\n}\n\n.header-text {\n    font-size: 16px;\n    font-weight: 1000;\n}\n\n.no-pointer {\n    pointer-events: none;\n}\n\n.all-pointer {\n    pointer-events: all;\n}\n\n.wh-inherit {\n    width: inherit;\n    height: inherit;\n}\n\n.absolute {\n    position: absolute;\n    top: 0;\n    left: 0;\n}\n\n.wh-100 {\n    width: 100%;\n    height: 100%;\n}\n\n.flex {\n    display: flex;\n}\n\n.flex.fcolumn {\n    flex-direction: column\n}\n\n.flex.fcenter {\n    align-items: center;\n    justify-content: center;\n}\n";
                /* harmony default export */
                __webpack_exports__["default"] = (cssLayout);
                /***/
            }),
        /***/
        "./src/menu/layout/htmlLayout.ts":
            /*!***************************************!*\
              !*** ./src/menu/layout/htmlLayout.ts ***!
              \***************************************/
            /***/
            (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */
                var _cssLayout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./cssLayout */ "./src/menu/layout/cssLayout.ts");
                var htmlLayout = "\n<style>".concat(_cssLayout__WEBPACK_IMPORTED_MODULE_0__["default"].toString(), "</style>\n\n<div class=\"menu-wrapper wh-inherit flex\">\n\n</div>\n");
                /* harmony default export */
                __webpack_exports__["default"] = (htmlLayout);
                /***/
            })
        /******/
    });
    /************************************************************************/
    /******/ // The module cache
    /******/
    var __webpack_module_cache__ = {};
    /******/
    /******/ // The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/ // Check if module is in cache
        /******/
        var cachedModule = __webpack_module_cache__[moduleId];
        /******/
        if (cachedModule !== undefined) {
            /******/
            return cachedModule.exports;
            /******/
        }
        /******/ // Create a new module (and put it into the cache)
        /******/
        var module = __webpack_module_cache__[moduleId] = {
            /******/ // no module.id needed
            /******/ // no module.loaded needed
            /******/
            exports: {}
            /******/
        };
        /******/
        /******/ // Execute the module function
        /******/
        __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
        /******/
        /******/ // Return the exports of the module
        /******/
        return module.exports;
        /******/
    }
    /******/
    /************************************************************************/
    /******/
    /* webpack/runtime/make namespace object */
    /******/
    ! function() {
        /******/ // define __esModule on exports
        /******/
        __webpack_require__.r = function(exports) {
            /******/
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                /******/
                Object.defineProperty(exports, Symbol.toStringTag, {
                    value: 'Module'
                });
                /******/
            }
            /******/
            Object.defineProperty(exports, '__esModule', {
                value: true
            });
            /******/
        };
        /******/
    }();
    /******/
    /************************************************************************/
    var __webpack_exports__ = {};
    // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
    ! function() {
        /*!**********************!*\
          !*** ./src/index.ts ***!
          \**********************/
        __webpack_require__.r(__webpack_exports__);
        /* harmony import */
        var _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__( /*! ./configs/templates/columns */ "./src/configs/templates/columns.ts");
        /* harmony import */
        var _menu_Menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__( /*! ./menu/Menu */ "./src/menu/Menu.ts");
        /* harmony import */
        var _menu_column_Column__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__( /*! ./menu/column/Column */ "./src/menu/column/Column.ts");
        /* harmony import */
        var _menu_column_models_Checkbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__( /*! ./menu/column/models/Checkbox */ "./src/menu/column/models/Checkbox.ts");
        /* harmony import */
        var _menu_column_models_option_OptionCheckbox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__( /*! ./menu/column/models/option/OptionCheckbox */ "./src/menu/column/models/option/OptionCheckbox.ts");
        /* harmony import */
        var _menu_column_models_option_OptionIColor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__( /*! ./menu/column/models/option/OptionIColor */ "./src/menu/column/models/option/OptionIColor.ts");
        /* harmony import */
        var _menu_column_models_option_OptionIRange__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__( /*! ./menu/column/models/option/OptionIRange */ "./src/menu/column/models/option/OptionIRange.ts");
        /* harmony import */
        var _menu_column_models_option_OptionIText__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__( /*! ./menu/column/models/option/OptionIText */ "./src/menu/column/models/option/OptionIText.ts");
        var MooUI = (function() {
            this.list = new Map();
            this.Column = _menu_column_Column__WEBPACK_IMPORTED_MODULE_2__["default"];
            this.Checkbox = _menu_column_models_Checkbox__WEBPACK_IMPORTED_MODULE_3__["default"];
            this.OptionCheckbox = _menu_column_models_option_OptionCheckbox__WEBPACK_IMPORTED_MODULE_4__["default"];
            this.OptionIText = _menu_column_models_option_OptionIText__WEBPACK_IMPORTED_MODULE_7__["default"];
            this.OptionIColor = _menu_column_models_option_OptionIColor__WEBPACK_IMPORTED_MODULE_5__["default"];
            this.OptionIRange = _menu_column_models_option_OptionIRange__WEBPACK_IMPORTED_MODULE_6__["default"];
            this.createMenu = function(_a) {
                var _this = this;
                var toggleKey = _a.toggleKey,
                    appendNode = _a.appendNode;
                var id = this.list.size + 1;
                var menu = new _menu_Menu__WEBPACK_IMPORTED_MODULE_1__["default"]({
                    id: id,
                    config: _configs_templates_columns__WEBPACK_IMPORTED_MODULE_0__["default"],
                    toggleKey: toggleKey,
                    appendNode: appendNode
                });
                menu.destroy = function() {
                    menu.holder.remove();
                    _this.list.delete(menu.id);
                };
                return this.list.set(id, menu).get(id);
            };
            this.eachAllMenu = function(callback, predicate) {
                typeof predicate === 'undefined' && (predicate = function() {
                    return true;
                });
                Array.from(this.list.values()).filter(function(item) {
                    return item.isMenu && predicate(item);
                }).forEach(function(menu) {
                    return callback(menu);
                });
            };
            this.toggleAllMenu = function(action) {
                this.eachAllMenu(function(menu) {
                    menu[action]();
                }, function(menu) {
                    return action === "show" ? !menu.isVisible : menu.isVisible;
                });
            };
            this.showAllMenu = function() {
                this.toggleAllMenu("show");
            };
            this.hideAllMenu = function() {
                this.toggleAllMenu("hide");
            };
            console.log("MooUI.js v1.0.0");
            return this;
        }).call(Object.create({}));
        window.MooUI = MooUI;
    }();
    /******/
})();
//# sourceMappingURL=bundle.js.map