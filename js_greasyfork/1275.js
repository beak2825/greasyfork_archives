// ==UserScript==
// @name       4chan Image Viewer
// @namespace  IdontKnowWhatToDoWithThis
// @description Opens current thread Images in 4chan into a popup viewer, tested in Tampermonkey
// @match   *://*.4chan.org/*/res/*
// @match   *://*.4chan.org/*/thread/*
// @match   *://*.4channel.org/*/thread/*
// @version 8.4
// @copyright  2019+, Nicholas Perkins
// @source https://github.com/nicholas-s-perkins/4chanImageViewer
// @downloadURL https://update.greasyfork.org/scripts/1275/4chan%20Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/1275/4chan%20Image%20Viewer.meta.js
// ==/UserScript==
"use strict";
var Viewer;
(function (Viewer) {
    /**
     * Didn't want to use any external libraries.  This is my handy library for dealing with the DOM
     */
    var DomUtil = /** @class */ (function () {
        function DomUtil(obj) {
            this._elements = [];
            this._listeners = [];
            if (obj) {
                if (obj instanceof NodeList) {
                    for (var i = 0; i < obj.length; ++i) {
                        this._elements.push(obj[i]);
                    }
                }
                else {
                    this._elements.push(obj);
                }
            }
        }
        Object.defineProperty(DomUtil.prototype, "elementList", {
            get: function () {
                return this._elements;
            },
            enumerable: true,
            configurable: true
        });
        DomUtil.prototype.concat = function (collection) {
            if (collection instanceof DomUtil) {
                this._elements = this._elements.concat(collection._elements);
            }
            else {
                this._elements = this._elements.concat(DomUtil.formatNodeList(collection));
            }
            return this;
        };
        /** Adds a click handler */
        DomUtil.prototype.on = function (handler, func) {
            var _this = this;
            var handlers = handler.split(' ');
            this.each(function (element) {
                for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
                    var handler_1 = handlers_1[_i];
                    _this._listeners.push(new Listener(element, handler_1, func));
                    element.addEventListener(handler_1, func, false);
                }
            });
            return this;
        };
        DomUtil.prototype.appendTo = function (obj) {
            if (typeof obj === 'string') {
                DomUtil.get(obj).append(this);
            }
            else if (obj instanceof DomUtil) {
                obj.append(this);
            }
            else {
                new DomUtil(obj).append(this);
            }
            return this;
        };
        DomUtil.prototype.off = function (handlerType) {
            var remaining = [];
            for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                if (handlerType == null || listener.type === handlerType) {
                    listener.element.removeEventListener(listener.type, listener.func);
                }
                else {
                    remaining.push(listener);
                }
            }
            this._listeners = remaining;
            return this;
        };
        DomUtil.prototype.remove = function () {
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var element = _a[_i];
                if (element.parentElement) {
                    element.parentElement.removeChild(element);
                }
            }
            return this;
        };
        DomUtil.prototype.prepend = function (obj) {
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var thisElement = _a[_i];
                for (var _b = 0, _c = obj._elements; _b < _c.length; _b++) {
                    var objElement = _c[_b];
                    if (thisElement.parentElement) {
                        thisElement.parentElement.insertBefore(objElement, thisElement);
                    }
                }
            }
            return this;
        };
        DomUtil.prototype.append = function (obj) {
            if (typeof obj === 'string') {
                this.each(function (element) {
                    element.insertAdjacentHTML('beforeend', obj);
                });
            }
            else if (obj instanceof DomUtil) {
                for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                    var element = _a[_i];
                    for (var _b = 0, _c = obj._elements; _b < _c.length; _b++) {
                        var objEle = _c[_b];
                        element.appendChild(objEle);
                    }
                }
            }
            else {
                for (var _d = 0, _e = this._elements; _d < _e.length; _d++) {
                    var element = _e[_d];
                    element.appendChild(obj);
                }
            }
            return this;
        };
        DomUtil.prototype.empty = function () {
            this.each(function (element) {
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            });
            return this;
        };
        DomUtil.prototype.scrollToTop = function () {
            if (this._elements.length > 0) {
                this._elements[0].scrollTop = 0;
            }
            return this;
        };
        DomUtil.prototype.focus = function () {
            if (this._elements.length > 0) {
                this._elements[0].focus();
            }
            return this;
        };
        Object.defineProperty(DomUtil.prototype, "tabIndex", {
            set: function (index) {
                if (this._elements.length > 0) {
                    this._elements[0].tabIndex = index;
                }
            },
            enumerable: true,
            configurable: true
        });
        DomUtil.prototype.setAttr = function (attr, value) {
            this.each(function (element) {
                element[attr] = value;
            });
            return this;
        };
        DomUtil.prototype.setText = function (text) {
            this.each(function (element) { return element.innerText = "" + text; });
            return this;
        };
        DomUtil.prototype.setStyle = function (styleConfig) {
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var element = _a[_i];
                for (var propName in styleConfig) {
                    // @ts-ignore
                    element.style[propName] = styleConfig[propName];
                }
            }
            return this;
        };
        DomUtil.prototype.setData = function (data) {
            var _loop_1 = function (element) {
                Object.keys(data).forEach(function (propName) {
                    element.dataset[propName] = data[propName];
                });
            };
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var element = _a[_i];
                _loop_1(element);
            }
            return this;
        };
        DomUtil.prototype.replaceWith = function (replacement) {
            var replaceEle = replacement._elements;
            this.each(function (element) {
                if (element.parentElement) {
                    for (var i = replaceEle.length - 1; i >= 0; i--) {
                        element.parentElement.insertBefore(replaceEle[i], element);
                    }
                    element.parentElement.removeChild(element);
                }
            });
            return this;
        };
        DomUtil.prototype.html = function (html) {
            if (typeof html === 'string') {
                for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                    var element = _a[_i];
                    element.innerHTML = html;
                }
            }
            else {
                this.each(function (element) {
                    DomUtil.get(element).remove();
                });
                this.append(html);
            }
            return this;
        };
        Object.defineProperty(DomUtil.prototype, "length", {
            get: function () {
                return this._elements.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DomUtil.prototype, "id", {
            get: function () {
                return this._elements.length > 0 ? this._elements[0].id : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DomUtil.prototype, "clientHeight", {
            get: function () {
                return this._elements.length > 0 ? this._elements[0].clientHeight : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DomUtil.prototype, "clientWidth", {
            get: function () {
                return this._elements.length > 0 ? this._elements[0].clientWidth : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DomUtil.prototype, "offsetHeight", {
            get: function () {
                return this._elements.length > 0 ? this._elements[0].offsetHeight : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DomUtil.prototype, "offsetWidth", {
            get: function () {
                return this._elements.length > 0 ? this._elements[0].offsetWidth : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DomUtil.prototype, "tagName", {
            get: function () {
                return this._elements.length > 0 ? this._elements[0].tagName : null;
            },
            enumerable: true,
            configurable: true
        });
        DomUtil.prototype.hasClass = function (className) {
            return this._elements.length > 0 ? this._elements[0].classList.contains(className) : false;
        };
        DomUtil.prototype.getAttr = function (attr) {
            if (this._elements.length > 0) {
                var ele = this._elements[0];
                return ele[attr];
            }
            else {
                return null;
            }
        };
        DomUtil.prototype.lightClone = function () {
            var newCollection = new DomUtil();
            this.each(function (element) {
                var newEle = document.createElement(element.tagName);
                newEle.className = element.className;
                newEle.innerHTML = element.innerHTML;
                newCollection._elements.push(newEle);
            });
            return newCollection;
        };
        DomUtil.prototype.addClass = function () {
            var classNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classNames[_i] = arguments[_i];
            }
            this.each(function (element) {
                element.classList.add.apply(element.classList, classNames);
            });
            return this;
        };
        DomUtil.prototype.removeClass = function () {
            var classNames = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                classNames[_i] = arguments[_i];
            }
            this.each(function (element) {
                element.classList.remove.apply(element.classList, classNames);
            });
            return this;
        };
        DomUtil.prototype.each = function (func) {
            for (var i = 0; i < this._elements.length; ++i) {
                func(this._elements[i], i);
            }
            return this;
        };
        /** Finds all sub-elements matching the queryString */
        DomUtil.prototype.find = function (queryString) {
            var collection = new DomUtil();
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var element = _a[_i];
                collection.concat(element.querySelectorAll(queryString));
            }
            return collection;
        };
        Object.defineProperty(DomUtil.prototype, "exists", {
            get: function () {
                return this._elements.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        /** because screw node lists */
        DomUtil.formatNodeList = function (nodes) {
            var arr = [];
            for (var i = 0; i < nodes.length; ++i) {
                arr.push(nodes[i]);
            }
            return arr;
        };
        DomUtil.get = function (query) {
            if (typeof query === 'string') {
                switch (query) {
                    case 'body':
                        return new DomUtil(document.body);
                    case 'head':
                        return new DomUtil(document.head);
                    default:
                        var nodes = document.querySelectorAll(query);
                        return new DomUtil(nodes);
                }
            }
            else {
                return new DomUtil(query);
            }
        };
        DomUtil.getById = function (id) {
            var ele = document.getElementById(id);
            return new DomUtil(ele);
        };
        DomUtil.createElement = function (tagName, props) {
            var newEle = document.createElement(tagName);
            if (props) {
                Object.keys(props).forEach(function (propName) {
                    if (propName == "style") {
                        newEle.style.cssText = props.style.cssText;
                    }
                    else {
                        newEle[propName] = props[propName];
                    }
                });
            }
            return new DomUtil(newEle);
        };
        return DomUtil;
    }());
    Viewer.DomUtil = DomUtil;
    var Listener = /** @class */ (function () {
        function Listener(element, type, func) {
            this.type = type;
            this.func = func;
            this.element = element;
        }
        return Listener;
    }());
    Viewer.Listener = Listener;
})(Viewer || (Viewer = {}));
var Viewer;
(function (Viewer) {
    //IDs for important elements
    Viewer.VIEW_ID = "mainView";
    Viewer.IMG_ID = "mainImg";
    Viewer.CENTER_BOX_ID = "imageBox";
    Viewer.TOP_LAYER_ID = "viewerTopLayer";
    Viewer.IMG_WRAPPER_ID = 'mainImgWrapper';
    Viewer.TEXT_WRAPPER_ID = 'viewerTextWrapper';
    Viewer.STYLE_ID = 'viewerStyle';
    Viewer.MENU_ID = 'viewerBottomMenu';
    Viewer.LEFT_ARROW = 'previousImageButton';
    Viewer.RIGHT_ARROW = 'nextImageButton';
    Viewer.TOP_MENU_ID = 'viewerMenuHeader';
    Viewer.VIEWER_PAGE_DISPLAY = "viewerPageDisplay";
    Viewer.VIEWER_TOTAL_DISPLAY = "viewerTotalDisplay";
    Viewer.VIEWER_IMG_NAME_DISPLAY = "viewerNameDisplay";
    Viewer.STYLE_TEXT = "\n        div.reply.highlight,div.reply.highlight-anti{z-index:100 !important;position:fixed !important; top:1%;left:1%;}\n        body{overflow:hidden !important;}\n        #quote-preview{z-index:100;}\n        a.quotelink, div.viewerBacklinks a.quotelink{color:#5c5cff !important;}\n        a.quotelink:hover, div.viewerBacklinks a:hover{color:red !important;}\n        #" + Viewer.IMG_ID + "{display:block !important; margin:auto;max-width:100%;height:auto;-webkit-user-select: none;cursor:pointer;}\n        #" + Viewer.VIEW_ID + "{\n            background-color:rgba(0,0,0,0.9);\n            z-index:10;\n            position:fixed;\n            top:0;left:0;bottom:0;right:0;\n            overflow:auto;\n            text-align:center;\n            -webkit-user-select: none;\n        }\n        #" + Viewer.CENTER_BOX_ID + " {display:flex;align-items:center;justify-content:center;flex-direction: column;min-height:100%;}\n        #" + Viewer.IMG_WRAPPER_ID + " {width:100%;}\n        #" + Viewer.TOP_LAYER_ID + "{position:fixed;top:0;bottom:0;left:0;right:0;z-index:20;opacity:0;visibility:hidden;transition:all .25s ease;}\n        .viewerBlockQuote{color:white;}\n        #" + Viewer.TEXT_WRAPPER_ID + "{max-width:60em;display:inline-block; color:gray;-webkit-user-select: all;}\n        .bottomMenuShow{visibility:visible;}\n        #" + Viewer.MENU_ID + "{box-shadow: -1px -1px 5px #888888;font-size:20px;padding:5px;background-color:white;position:fixed;bottom:0;right:0;z-index:200;}\n        #" + Viewer.TOP_MENU_ID + "{font-size:20px;padding:5px;background-color:white;position:fixed;top:0;left:0;text-align:center;width:100%;color:black;z-index:200;}\n        .hideCursor{cursor:none !important;}\n        .hidden{visibility:hidden}\n        .displayNone{display:none;}\n        .pagingButtons{font-size:100px;color:white;text-shadow: 1px 1px 10px #27E3EB;z-index: 11;top: 50%;position: fixed;margin-top: -57px;width:100px;cursor:pointer;-webkit-user-select: none;}\n        .pagingButtons:hover{color:#27E3EB;text-shadow: 1px 1px 10px #000}\n        #" + Viewer.LEFT_ARROW + "{left:0;text-align:left;}\n        #" + Viewer.RIGHT_ARROW + "{right:0;text-align:right;}\n        @-webkit-keyframes flashAnimation{0%{ text-shadow: none;}100%{text-shadow: 0px 0px 5px blue;}}\n        .flash{-webkit-animation: flashAnimation 1s alternate infinite  linear;cursor:pointer;}\n        .disableClick, .disableClick a{pointer-events: none;}\n        ";
})(Viewer || (Viewer = {}));
var Viewer;
(function (Viewer) {
    //cookieInfo
    var INDEX_KEY = "imageBrowserIndexCookie";
    var THREAD_KEY = "imageBrowserThreadCookie";
    var WIDTH_KEY = "imageBrowserWidthCookie";
    var HEIGHT_KEY = "imageBrowserHeightCookie";
    //keycode object.  Better than remembering what each code does.
    var KEYS = { 38: 'up', 40: 'down', 37: 'left', 39: 'right', 27: 'esc', 86: 'v' };
    var BODY = Viewer.DomUtil.get(document.body);
    var WINDOW = Viewer.DomUtil.get(window);
    var UNSAFE_WINDOW = Viewer.DomUtil.get(typeof unsafeWindow === 'undefined' ? window : unsafeWindow);
    var MainView = /** @class */ (function () {
        function MainView(imagePostIndex) {
            var _this = this;
            this.postData = [];
            this.linkIndex = 0;
            /** Determines if pre-loading can happen*/
            this.canPreload = false;
            /** determines if height of the image should be fit */
            this.shouldFitHeight = false;
            this.lastMousePos = { x: 0, y: 0 };
            console.log("Building 4chan Image Viewer");
            var currentThreadId = Viewer.DomUtil.get('.thread').id;
            if (imagePostIndex != undefined) {
                this.linkIndex = imagePostIndex;
                MainView.setPersistentValue(INDEX_KEY, imagePostIndex);
            }
            //check if its the last thread opened, if so, remember where the index was.
            else if (MainView.getPersistentValue(THREAD_KEY) === currentThreadId) {
                var savedVal = MainView.getPersistentValue(INDEX_KEY);
                if (savedVal != undefined) {
                    this.linkIndex = parseInt(savedVal);
                }
                else {
                    this.linkIndex = 0;
                }
            }
            else {
                this.linkIndex = 0;
                MainView.setPersistentValue(INDEX_KEY, 0);
            }
            //set thread id
            MainView.setPersistentValue(THREAD_KEY, currentThreadId);
            //Create postData based on 4chan posts
            this.postData = Viewer.PostData.getImagePosts(true);
            if (this.linkIndex > (this.postData.length - 1)) {
                alert('Last saved image index is too large, a thread may have been deleted.  Index will be reset. ');
                this.linkIndex = 0;
                MainView.setPersistentValue(INDEX_KEY, 0);
            }
            //set shouldFit Height so image can know about it if it loads before menuInit()
            var isHeight = MainView.getPersistentValue(HEIGHT_KEY);
            this.shouldFitHeight = isHeight ? true : false;
            var menuHtml = "\n                <label><input id=\"" + WIDTH_KEY + "\" type=\"checkbox\" checked=\"checked\" />Fit Image to Width</label>\n                <span>|</span>\n                <label><input id=\"" + HEIGHT_KEY + "\" type=\"checkbox\" />Fit Image to Height</label>\n            ";
            var viewFrag = "\n                <style id=\"" + Viewer.STYLE_ID + "\">" + Viewer.STYLE_TEXT + "</style>\n                <div id=\"" + Viewer.TOP_MENU_ID + "\" class=\"hidden\">\n                  <div><span id=\"" + Viewer.VIEWER_PAGE_DISPLAY + "\"></span><span> of </span><span id=\"" + Viewer.VIEWER_TOTAL_DISPLAY + "\"></span></div>\n                  <div><span id=\"" + Viewer.VIEWER_IMG_NAME_DISPLAY + "\"></span></div>\n                </div>\n                <div id=\"" + Viewer.VIEW_ID + "\">\n                    <div id=\"" + Viewer.CENTER_BOX_ID + "\">\n                        <div id=\"" + Viewer.IMG_WRAPPER_ID + "\">\n                            <img id=\"" + Viewer.IMG_ID + "\" class=\"hideCursor\"/>\n                        </div>\n                        <div id=\"" + Viewer.TEXT_WRAPPER_ID + "\"></div>\n                    </div>\n                    <div id=\"" + Viewer.LEFT_ARROW + "\" class=\"pagingButtons hidden\"><span>&#9001;</span></div>\n                    <div id=\"" + Viewer.RIGHT_ARROW + "\" class=\"pagingButtons hidden\"><span>&#9002;</span></div>\n                </div>\n                <div id=\"" + Viewer.TOP_LAYER_ID + "\">&nbsp;</div>\n                <form id=\"" + Viewer.MENU_ID + "\" class=\"hidden\">" + menuHtml + "</form>\n            ";
            BODY.append(viewFrag);
            this.mainView = Viewer.DomUtil.getById(Viewer.VIEW_ID);
            this.centerBox = Viewer.DomUtil.getById(Viewer.CENTER_BOX_ID);
            this.mainImg = Viewer.DomUtil.getById(Viewer.IMG_ID);
            this.textWrapper = Viewer.DomUtil.getById(Viewer.TEXT_WRAPPER_ID);
            this.topLayer = Viewer.DomUtil.getById(Viewer.TOP_LAYER_ID);
            this.customStyle = Viewer.DomUtil.getById(Viewer.STYLE_ID);
            this.bottomMenu = Viewer.DomUtil.getById(Viewer.MENU_ID);
            this.leftArrow = Viewer.DomUtil.getById(Viewer.LEFT_ARROW);
            this.rightArrow = Viewer.DomUtil.getById(Viewer.RIGHT_ARROW);
            this.topMenu = Viewer.DomUtil.getById(Viewer.TOP_MENU_ID);
            this.pageDisplay = Viewer.DomUtil.getById(Viewer.VIEWER_PAGE_DISPLAY);
            this.totalDisplay = Viewer.DomUtil.getById(Viewer.VIEWER_TOTAL_DISPLAY);
            this.nameDisplay = Viewer.DomUtil.getById(Viewer.VIEWER_IMG_NAME_DISPLAY);
            //add handlers
            this.centerBox.on('click', function () {
                _this.confirmExit();
            });
            this.textWrapper.on('click', function (event) {
                _this.eventStopper(event);
            });
            this.bottomMenu.on('click', function () {
                _this.menuClickHandler();
            });
            this.leftArrow.on('click', function (event) {
                event.stopImmediatePropagation();
                _this.previousImg();
            });
            this.rightArrow.on('click', function (event) {
                event.stopImmediatePropagation();
                _this.nextImg();
            });
            //build first image/video tag
            this.changeData(0);
            //initialize menu
            this.menuInit();
            //start preloading to next image index
            this.canPreload = true;
            window.setTimeout(function () {
                _this.runImagePreloading(_this.linkIndex);
            }, 100);
            //some fixes for weird browser behaviors
            this.centerBox.setStyle({ outline: '0' });
            this.centerBox.tabIndex = 1;
            this.centerBox.focus();
            //add keybinding listener, unsafeWindow is used here instead because at least in Tampermonkey
            //the safe window can fail to remove event listeners.
            UNSAFE_WINDOW
                .on('keydown', function (event) {
                _this.arrowKeyListener(event);
            })
                .on('mousemove', function (event) {
                _this.menuWatcher(event);
            });
        }
        MainView.prototype.menuInit = function () {
            var _this = this;
            var menuControls = this.bottomMenu.find('input');
            menuControls.each(function (input) {
                var typedInput = input;
                var cookieValue = MainView.getPersistentValue(input.id);
                if (cookieValue === 'true') {
                    typedInput.checked = true;
                }
                else if (cookieValue === 'false') {
                    typedInput.checked = false;
                }
                typedInput.parentElement.classList.toggle('flash', typedInput.checked);
                switch (typedInput.id) {
                    case WIDTH_KEY:
                        _this.setFitToScreenWidth(typedInput.checked);
                        break;
                    case HEIGHT_KEY:
                        _this.setFitToScreenHeight(typedInput.checked);
                        break;
                }
            });
        };
        MainView.prototype.menuClickHandler = function () {
            var _this = this;
            var menuControls = this.bottomMenu.find('input');
            menuControls.each(function (ele) {
                var input = ele;
                switch (input.id) {
                    case WIDTH_KEY:
                        _this.setFitToScreenWidth(input.checked);
                        break;
                    case HEIGHT_KEY:
                        _this.setFitToScreenHeight(input.checked);
                        break;
                }
                input.parentElement.classList.toggle('flash', input.checked);
                MainView.setPersistentValue(input.id, input.checked);
            });
        };
        MainView.prototype.windowClick = function (event) {
            if (!this) {
                return;
            }
            event.preventDefault();
            event.stopImmediatePropagation();
            this.nextImg();
        };
        /* Event function for determining behavior of viewer keypresses */
        MainView.prototype.arrowKeyListener = function (event) {
            switch (KEYS[event.keyCode]) {
                case 'right':
                    this.nextImg();
                    break;
                case 'left':
                    this.previousImg();
                    break;
                case 'esc':
                    this.destroy();
                    break;
            }
        };
        /* preloads images starting with the index provided */
        MainView.prototype.runImagePreloading = function (index) {
            var _this = this;
            if (this && index < this.postData.length) {
                if (this.canPreload) {
                    //console.log('preloading: ' + index +' of '+(this.postData.length - 1) +' | '+ this.postData[index].imgSrc);
                    var loadFunc = function () {
                        _this.runImagePreloading(index + 1);
                    };
                    //have yet to figure out how to properly preload video, skip for now
                    if (this.postData[index].tagType === Viewer.TagType.VIDEO) {
                        window.setTimeout(loadFunc, 1);
                    }
                    else {
                        var newImage = document.createElement(this.postData[index].tagTypeName);
                        switch (this.postData[index].tagType) {
                            case Viewer.TagType.VIDEO:
                                newImage.oncanplaythrough = loadFunc;
                                break;
                            case Viewer.TagType.IMG:
                                newImage.onload = loadFunc;
                                break;
                        }
                        newImage.onerror = function () {
                            console.log("imageError");
                            _this.runImagePreloading(index + 1);
                        };
                        newImage.src = this.postData[index].imgSrc;
                    }
                }
            }
        };
        /* Sets the img and message to the next one in the list*/
        MainView.prototype.nextImg = function () {
            var _this = this;
            if (this.linkIndex === this.postData.length - 1) {
                this.topLayer.setStyle({
                    background: 'linear-gradient(to right,rgba(0,0,0,0) 90%,rgba(125,185,232,1) 100%)',
                    opacity: '.5',
                    visibility: 'visible'
                });
                window.setTimeout(function () {
                    _this.topLayer.setStyle({
                        opacity: '0',
                        visibility: 'hidden'
                    });
                }, 500);
            }
            else {
                this.changeData(1);
            }
        };
        /* Sets the img and message to the previous one in the list*/
        MainView.prototype.previousImg = function () {
            var _this = this;
            if (this.linkIndex === 0) {
                this.topLayer.setStyle({
                    background: 'linear-gradient(to left,rgba(0,0,0,0) 90%,rgba(125,185,232,1) 100%)',
                    opacity: '.5',
                    visibility: 'visible'
                });
                window.setTimeout(function () {
                    _this.topLayer.setStyle({ opacity: '0' });
                    window.setTimeout(function () {
                        _this.topLayer.setStyle({ visibility: 'hidden' });
                    }, 200);
                }, 500);
            }
            else {
                this.changeData(-1);
            }
        };
        MainView.prototype.changeData = function (delta) {
            MainView.cleanLinks();
            //ignore out of bounds
            var newIndex = this.linkIndex + delta;
            if (newIndex > this.postData.length - 1 || newIndex < 0) {
                return;
            }
            if (this.postData[newIndex].tagTypeName !== this.mainImg.tagName || delta === 0) {
                this.mainImg = this.replaceElement(this.mainImg, this.postData[newIndex].tagTypeName);
            }
            //console.log('Opening: "' + this.postData[this.linkIndex].imgSrc +'" at index ' + this.linkIndex);
            this.mainImg.setAttr('src', this.postData[newIndex].imgSrc);
            var nextLinks = this.postData[newIndex].linksContainer;
            var nextQuote = this.postData[newIndex].quoteContainer;
            this.textWrapper.empty();
            this.textWrapper.append(nextLinks);
            this.textWrapper.append(nextQuote);
            this.linkIndex = newIndex;
            this.mainView.scrollToTop();
            MainView.setPersistentValue(INDEX_KEY, this.linkIndex);
            //update menu info
            this.pageDisplay.setText(this.linkIndex + 1);
            this.totalDisplay.setText(this.postData.length);
            this.nameDisplay.setText(this.postData[newIndex].imgSrc);
        };
        MainView.cleanLinks = function () {
            var links = document.getElementsByClassName('quotelink');
            for (var i = 0; i < links.length; ++i) {
                links[i].dispatchEvent(new MouseEvent('mouseout'));
            }
        };
        MainView.prototype.replaceElement = function (element, newTagType) {
            var _this = this;
            var rawElement = element.elementList[0];
            var newElement = Viewer.DomUtil.createElement(newTagType, {
                id: element.id,
                className: rawElement.className,
                style: rawElement.style,
                autoplay: true,
                controls: false,
                loop: true
            });
            newElement
                .on('click', function (event) {
                event.stopPropagation();
                _this.nextImg();
            })
                .on('load', function () {
                _this.imageLoadHandler();
            })
                .on('progress', function (e) {
                //console.log(e);
            });
            element.prepend(newElement);
            element.remove();
            return newElement;
        };
        MainView.prototype.eventStopper = function (event) {
            event.stopPropagation();
            if (event.target.nodeName === 'A') {
                var confirmed = this.confirmExit('Exit Viewer to navigate to link?');
                if (!confirmed) {
                    event.preventDefault();
                }
            }
        };
        MainView.prototype.confirmExit = function (message) {
            var confirmed = window.confirm(message || 'Exit Viewer?');
            if (confirmed) {
                this.destroy();
            }
            return confirmed;
        };
        /* Removes the view and cleans up handlers*/
        MainView.prototype.destroy = function () {
            MainView.cleanLinks();
            UNSAFE_WINDOW.off();
            WINDOW.off();
            BODY.off();
            this.topLayer.remove();
            this.mainView.remove();
            this.customStyle.remove();
            this.bottomMenu.remove();
            BODY.setStyle({ overflow: 'auto' });
            this.canPreload = false;
        };
        /*Mouse-move Handler that watches for when menus should appear and mouse behavior*/
        MainView.prototype.menuWatcher = function (event) {
            var _this = this;
            var height_offset = window.innerHeight - this.bottomMenu.offsetHeight;
            var width_offset = window.innerWidth - this.bottomMenu.offsetWidth;
            var center = window.innerHeight / 2;
            var halfArrow = this.leftArrow.offsetHeight / 2;
            if (event.clientX >= width_offset && event.clientY >= height_offset) {
                this.bottomMenu.removeClass('hidden').addClass('bottomMenuShow');
                this.topMenu.removeClass('hidden').addClass('bottomMenuShow');
            }
            else if (this.bottomMenu.hasClass('bottomMenuShow')) {
                this.bottomMenu.removeClass('bottomMenuShow').addClass('hidden');
                this.topMenu.removeClass('bottomMenuShow').addClass('hidden');
            }
            if ((event.clientX <= (100) || event.clientX >= (window.innerWidth - 100)) &&
                (event.clientY <= (center + halfArrow) && event.clientY >= (center - halfArrow))) {
                this.rightArrow.removeClass('hidden');
                this.leftArrow.removeClass('hidden');
            }
            else {
                this.rightArrow.addClass('hidden');
                this.leftArrow.addClass('hidden');
            }
            //avoids chrome treating mouseclicks as mousemoves
            if (event.clientX !== this.lastMousePos.x && event.clientY !== this.lastMousePos.y) {
                //mouse click moves to next image when invisible
                this.mainImg.removeClass('hideCursor');
                window.clearTimeout(this.mouseTimer);
                BODY.off('click');
                BODY.removeClass('hideCursor');
                this.textWrapper.removeClass('disableClick');
                this.mainImg.removeClass('disableClick');
                this.centerBox.removeClass('disableClick');
                if (event.target.id === this.mainImg.id) {
                    //hide cursor if it stops, show if it moves
                    this.mouseTimer = window.setTimeout(function () {
                        _this.mainImg.addClass('hideCursor');
                        _this.textWrapper.addClass('disableClick');
                        _this.mainImg.addClass('disableClick');
                        _this.centerBox.addClass('disableClick');
                        BODY.addClass('hideCursor')
                            .on('click', function (event) {
                            _this.windowClick(event);
                        });
                    }, 200);
                }
            }
            this.lastMousePos.x = event.clientX;
            this.lastMousePos.y = event.clientY;
        };
        /*Stores a key value pair as a cookie*/
        MainView.setPersistentValue = function (key, value) {
            document.cookie = key + '=' + value + ';expires=Thu, 01 Jan 3000 00:00:00 UTC;domain=.4chan.org;path=/';
        };
        /* Retrieves a cookie value via its key*/
        MainView.getPersistentValue = function (key) {
            var cookieMatch = document.cookie.match(new RegExp(key + '\\s*=\\s*([^;]+)'));
            if (cookieMatch) {
                return cookieMatch[1];
            }
            else {
                return undefined;
            }
        };
        MainView.prototype.setFitToScreenHeight = function (shouldFitImage) {
            this.shouldFitHeight = shouldFitImage;
            //ignore if image has no height as it is likely not loaded.
            if (shouldFitImage && this.mainImg.getAttr('naturalHeight')) {
                this.fitHeightToScreen();
            }
            else {
                this.mainImg.setStyle({ maxHeight: '' });
            }
        };
        ;
        MainView.prototype.setFitToScreenWidth = function (shouldFitImage) {
            this.mainImg.setStyle({
                maxWidth: shouldFitImage ? '100%' : 'none'
            });
        };
        MainView.prototype.imageLoadHandler = function () {
            if (this.shouldFitHeight) {
                this.fitHeightToScreen();
            }
        };
        /* Fits image to screen height*/
        MainView.prototype.fitHeightToScreen = function () {
            //sets the changeable properties to the image's real size
            var height = this.mainImg.getAttr('naturalHeight');
            this.mainImg.setStyle({ maxHeight: (height + 'px') });
            //actually tests if it is too high including padding
            var heightDiff = (this.mainImg.clientHeight > height) ?
                this.mainImg.clientHeight - this.mainView.clientHeight :
                height - this.mainView.clientHeight;
            if (heightDiff > 0) {
                this.mainImg.setStyle({ maxHeight: (height - heightDiff) + 'px' });
            }
            else {
                this.mainImg.setStyle({ maxHeight: (height + 'px') });
            }
        };
        return MainView;
    }());
    Viewer.MainView = MainView;
})(Viewer || (Viewer = {}));
var Viewer;
(function (Viewer) {
    var TagType;
    (function (TagType) {
        TagType[TagType["IMG"] = 0] = "IMG";
        TagType[TagType["VIDEO"] = 1] = "VIDEO";
    })(TagType = Viewer.TagType || (Viewer.TagType = {}));
    var PostData = /** @class */ (function () {
        function PostData(imgSrc, quoteContainer, linksContainer, imageLink) {
            this.imgSrc = imgSrc;
            this.linksContainer = linksContainer;
            this.quoteContainer = quoteContainer;
            this.tagType = PostData.getElementType(imgSrc);
            this.imageLink = imageLink;
        }
        Object.defineProperty(PostData.prototype, "tagTypeName", {
            get: function () {
                return TagType[this.tagType];
            },
            enumerable: true,
            configurable: true
        });
        PostData.getElementType = function (src) {
            if (src.match(/\.(?:(?:webm)|(?:ogg)|(?:mp4))$/)) {
                return TagType.VIDEO;
            }
            else {
                return TagType.IMG;
            }
        };
        PostData.add4chanListenersToLinks = function (linkCollection) {
            linkCollection.find('.quotelink')
                .on('mouseover', Main.onThreadMouseOver)
                .on('mouseout', Main.onThreadMouseOut);
        };
        PostData.getImagePosts = function (asCopy) {
            var postData = [];
            var postFiles = Viewer.DomUtil.get('#delform').find('.postContainer');
            postFiles.each(function (post) {
                var _post = Viewer.DomUtil.get(post);
                var currentLinkTag = _post.find('.file .fileThumb');
                var currentLink = currentLinkTag.getAttr('href');
                if (!currentLink) {
                    return;
                }
                var currentPostBlock = _post.find('.postMessage');
                var currentPostBacklinks = _post.find('.backlink');
                var newPostBlock = currentPostBlock;
                var newBackLinks = currentPostBacklinks;
                if (asCopy) {
                    if (currentPostBlock.exists) {
                        newPostBlock = currentPostBlock.lightClone();
                        newPostBlock.addClass('viewerBlockQuote');
                        PostData.add4chanListenersToLinks(newPostBlock);
                    }
                    if (currentPostBacklinks.exists) {
                        newBackLinks = currentPostBacklinks.lightClone();
                        newBackLinks.addClass('viewerBacklinks');
                        PostData.add4chanListenersToLinks(newBackLinks);
                    }
                }
                postData.push(new PostData(currentLink, newPostBlock, newBackLinks, currentLinkTag));
            });
            return postData;
        };
        return PostData;
    }());
    Viewer.PostData = PostData;
})(Viewer || (Viewer = {}));
/// <reference path="../MetaData.ts"/>
/// <reference path="DomUtil.ts"/>
/// <reference path="Css.ts"/>
/// <reference path="MainView.ts"/>
/// <reference path="PostData.ts"/>
var Viewer;
(function (Viewer) {
    function main() {
        // ========= Build the main Button ========= //
        Viewer.DomUtil.createElement('button')
            .setStyle({ position: 'fixed', bottom: '0', right: '0', })
            .html("Open Viewer")
            .on('click', function () {
            new Viewer.MainView();
        })
            .appendTo(document.body);
        // ========= Build buttons for each image thumbnail ========= //
        var posts = Viewer.PostData.getImagePosts(false);
        var imagePostCount = 0;
        for (var _i = 0, posts_1 = posts; _i < posts_1.length; _i++) {
            var post = posts_1[_i];
            Viewer.DomUtil.createElement('button')
                .setStyle({
                display: 'inline',
                float: 'left',
                clear: 'both',
                fontSize: '11px',
                cursor: 'pointer'
            })
                .setData({
                postIndex: imagePostCount
            })
                .html('Open Viewer')
                .on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                //make the viewer and put it on the window so we can clean it up later
                new Viewer.MainView(parseInt(this.dataset.postIndex));
            })
                .appendTo(post.imageLink);
            ++imagePostCount;
        }
    }
    Viewer.main = main;
})(Viewer || (Viewer = {}));
//run the module
Viewer.main();
//# sourceMappingURL=viewer.js.map