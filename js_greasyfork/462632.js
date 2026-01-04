// ==UserScript==
// @name        FA Infini-Gallery
// @namespace   Violentmonkey Scripts
// @match       *://*.furaffinity.net/*
// @require     https://update.greasyfork.org/scripts/525666/1549449/Furaffinity-Prototype-Extensions.js
// @require     https://update.greasyfork.org/scripts/483952/1672922/Furaffinity-Request-Helper.js
// @require     https://update.greasyfork.org/scripts/485827/1549457/Furaffinity-Match-List.js
// @require     https://update.greasyfork.org/scripts/485153/1549461/Furaffinity-Loading-Animations.js
// @require     https://update.greasyfork.org/scripts/475041/1617223/Furaffinity-Custom-Settings.js
// @grant       GM_info
// @version     2.2.7
// @author      Midori Dragon
// @description Automatically loads the next page of the gallery as you reach the bottom
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/462632-fa-infini-gallery
// @supportURL  https://greasyfork.org/scripts/462632-fa-infini-gallery/feedback
// @downloadURL https://update.greasyfork.org/scripts/462632/FA%20Infini-Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/462632/FA%20Infini-Gallery.meta.js
// ==/UserScript==
// jshint esversion: 8
(() => {
    "use strict";
    var __webpack_require__ = {};
    __webpack_require__.d = (exports, definition) => {
        for (var key in definition) {
            if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                Object.defineProperty(exports, key, {
                    enumerable: true,
                    get: definition[key]
                });
            }
        }
    };
    __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    __webpack_require__.d({}, {
        I4: () => pageSeparatorTextSetting,
        uL: () => requestHelper,
        kG: () => showPageSeparatorSetting
    });
    function createSeparatorElem(pageNo) {
        const nextPageDescContainer = document.createElement("div");
        nextPageDescContainer.className = "folder-description";
        nextPageDescContainer.style.marginTop = "6px";
        nextPageDescContainer.style.marginBottom = "6px";
        const nextPageDesc = document.createElement("div");
        nextPageDesc.className = "container-item-top";
        const nextPageDescText = document.createElement("h3");
        const pageString = pageSeparatorTextSetting.value.replace(/%page%/g, pageNo.toString());
        nextPageDescText.textContent = pageString;
        nextPageDesc.appendChild(nextPageDescText);
        nextPageDescContainer.appendChild(nextPageDesc);
        return nextPageDescContainer;
    }
    function getFiguresFromPage(page) {
        const figures = page.querySelectorAll('figure[class*="t"]');
        return null == figures ? [] : Array.from(figures).map(figure => figure);
    }
    function getUserNameFromUrl(url) {
        if (url.includes("?")) {
            url = url.substring(0, url.indexOf("?"));
        }
        return (url = url.trimEnd("/")).substring(url.lastIndexOf("/") + 1);
    }
    var LogLevel;
    !function(LogLevel) {
        LogLevel[LogLevel.Error = 1] = "Error";
        LogLevel[LogLevel.Warning = 2] = "Warning";
        LogLevel[LogLevel.Info = 3] = "Info";
    }(LogLevel || (LogLevel = {}));
    class Logger {
        static log(logLevel = LogLevel.Warning, ...args) {
            if (null == window.__FF_GLOBAL_LOG_LEVEL__) {
                window.__FF_GLOBAL_LOG_LEVEL__ = LogLevel.Error;
            }
            if (!(logLevel > window.__FF_GLOBAL_LOG_LEVEL__)) {
                switch (logLevel) {
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
    class BrowsePage {
        constructor(pageNo) {
            this.pageNo = pageNo;
            this.gallery = document.querySelector('section[id*="gallery"]');
        }
        getPage() {
            return __awaiter(this, void 0, void 0, function*() {
                Logger.logInfo(`Getting page BrowsePage '${this.pageNo}'`);
                return yield requestHelper.UserRequests.SearchRequests.Browse.getPage(this.pageNo, this.getBrowseOptions());
            });
        }
        getBrowseOptions() {
            var _a, _b, _c, _d;
            const currBrowseOptions = requestHelper.UserRequests.SearchRequests.Browse.newBrowseOptions;
            const sideBar = document.getElementById("sidebar-options");
            const optionContainers = null === sideBar || void 0 === sideBar ? void 0 : sideBar.querySelectorAll('div[class*="browse-search-flex-item"]');
            for (const optionContainer of Array.from(null !== optionContainers && void 0 !== optionContainers ? optionContainers : [])) {
                try {
                    let optionName = null !== (_c = null === (_b = null === (_a = null === optionContainer || void 0 === optionContainer ? void 0 : optionContainer.querySelector("strong")) || void 0 === _a ? void 0 : _a.textContent) || void 0 === _b ? void 0 : _b.toLowerCase()) && void 0 !== _c ? _c : "";
                    optionName = optionName.trimEnd(":");
                    const optionValue = null === (_d = null === optionContainer || void 0 === optionContainer ? void 0 : optionContainer.querySelector("option[selected]")) || void 0 === _d ? void 0 : _d.getAttribute("value");
                    if (null == optionValue) {
                        continue;
                    }
                    switch (optionName) {
                      case "category":
                        currBrowseOptions.category = parseInt(optionValue);
                        break;

                      case "type":
                        currBrowseOptions.type = parseInt(optionValue);
                        break;

                      case "species":
                        currBrowseOptions.species = parseInt(optionValue);
                        break;

                      case "gender":
                        currBrowseOptions.gender = optionValue;
                        break;

                      case "results":
                        currBrowseOptions.perPage = parseInt(optionValue);
                        break;

                      case "ratingGeneral":
                        currBrowseOptions.ratingGeneral = "true" === optionValue;
                        break;

                      case "ratingMature":
                        currBrowseOptions.ratingMature = "true" === optionValue;
                        break;

                      case "ratingAdult":
                        currBrowseOptions.ratingAdult = "true" === optionValue;
                    }
                } catch (_e) {}
            }
            const checkBoxes = null === sideBar || void 0 === sideBar ? void 0 : sideBar.querySelectorAll('input[type="checkbox"]');
            for (const checkbox of Array.from(null !== checkBoxes && void 0 !== checkBoxes ? checkBoxes : [])) {
                switch (checkbox.getAttribute("name")) {
                  case "rating_general":
                    currBrowseOptions.ratingGeneral = checkbox.hasAttribute("checked");
                    break;

                  case "rating_mature":
                    currBrowseOptions.ratingMature = checkbox.hasAttribute("checked");
                    break;

                  case "rating_adult":
                    currBrowseOptions.ratingAdult = checkbox.hasAttribute("checked");
                }
            }
            return currBrowseOptions;
        }
        loadPage(prevFigures) {
            return __awaiter(this, void 0, void 0, function*() {
                const page = yield this.getPage();
                if (null == page) {
                    throw new Error("No page found");
                }
                null !== prevFigures && void 0 !== prevFigures || (prevFigures = []);
                const prevSids = prevFigures.map(figure => figure.id);
                let figures = getFiguresFromPage(page);
                figures = figures.filter(figure => !prevSids.includes(figure.id));
                if (0 !== figures.length) {
                    if (showPageSeparatorSetting.value) {
                        const separator = createSeparatorElem(this.pageNo);
                        this.gallery.appendChild(separator);
                    }
                    for (const figure of figures) {
                        this.gallery.appendChild(figure);
                    }
                } else {
                    throw new Error("No figures found");
                }
                window.dispatchEvent(new CustomEvent("ei-update-embedded"));
                return figures;
            });
        }
    }
    var FavoritesPage_awaiter = function(thisArg, _arguments, P, generator) {
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
    class FavoritesPage {
        constructor(dataFavId, pageNo) {
            this.dataFavId = dataFavId;
            this.pageNo = pageNo;
            this.gallery = document.querySelector('section[id*="gallery"]');
        }
        getPage() {
            return FavoritesPage_awaiter(this, void 0, void 0, function*() {
                Logger.logInfo(`Getting page FavoritesPage '${this.pageNo}'`);
                const username = getUserNameFromUrl(window.location.toString());
                return yield requestHelper.UserRequests.GalleryRequests.Favorites.getPage(username, this.dataFavId);
            });
        }
        loadPage(prevFigures) {
            return FavoritesPage_awaiter(this, void 0, void 0, function*() {
                const page = yield this.getPage();
                if (null == page) {
                    throw new Error("No page found");
                }
                null !== prevFigures && void 0 !== prevFigures || (prevFigures = []);
                const prevSids = prevFigures.map(figure => figure.id);
                let figures = getFiguresFromPage(page);
                figures = figures.filter(figure => !prevSids.includes(figure.id));
                if (0 !== figures.length) {
                    if (this.dataFavId === figures[figures.length - 1].getAttribute("data-fav-id")) {
                        throw new Error("Last page reached");
                    }
                    if (showPageSeparatorSetting.value) {
                        const separator = createSeparatorElem(this.pageNo);
                        this.gallery.appendChild(separator);
                    }
                    for (const figure of figures) {
                        this.gallery.appendChild(figure);
                    }
                } else {
                    throw new Error("No figures found");
                }
                window.dispatchEvent(new CustomEvent("ei-update-embedded"));
                return figures;
            });
        }
    }
    var GalleryPage_awaiter = function(thisArg, _arguments, P, generator) {
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
    class GalleryPage {
        constructor(pageNo) {
            this.pageNo = pageNo;
            this.gallery = document.querySelector('section[id*="gallery"]');
            this.isInFolder = window.location.toString().includes("/folder/");
        }
        getPage() {
            return GalleryPage_awaiter(this, void 0, void 0, function*() {
                Logger.logInfo(`Getting page GalleryPage '${this.pageNo}'`);
                const username = getUserNameFromUrl(window.location.toString());
                let page;
                if (true === this.isInFolder) {
                    let folderId;
                    page = yield requestHelper.UserRequests.GalleryRequests.Gallery.getPageInFolder(username, folderId, this.pageNo);
                } else {
                    page = yield requestHelper.UserRequests.GalleryRequests.Gallery.getPage(username, this.pageNo);
                }
                return page;
            });
        }
        loadPage(prevFigures) {
            return GalleryPage_awaiter(this, void 0, void 0, function*() {
                const page = yield this.getPage();
                if (null == page) {
                    throw new Error("No page found");
                }
                null !== prevFigures && void 0 !== prevFigures || (prevFigures = []);
                const prevSids = prevFigures.map(figure => figure.id);
                let figures = getFiguresFromPage(page);
                figures = figures.filter(figure => !prevSids.includes(figure.id));
                if (0 !== figures.length) {
                    if (showPageSeparatorSetting.value) {
                        const separator = createSeparatorElem(this.pageNo);
                        this.gallery.appendChild(separator);
                    }
                    for (const figure of figures) {
                        this.gallery.appendChild(figure);
                    }
                } else {
                    throw new Error("No figures found");
                }
                window.dispatchEvent(new CustomEvent("ei-update-embedded"));
                return figures;
            });
        }
    }
    var ScrapsPage_awaiter = function(thisArg, _arguments, P, generator) {
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
    class ScrapsPage {
        constructor(pageNo) {
            this.pageNo = pageNo;
            this.gallery = document.querySelector('section[id*="gallery"]');
        }
        getPage() {
            return ScrapsPage_awaiter(this, void 0, void 0, function*() {
                Logger.logInfo(`Getting page ScrapsPage '${this.pageNo}'`);
                const username = getUserNameFromUrl(window.location.toString());
                return yield requestHelper.UserRequests.GalleryRequests.Scraps.getPage(username, this.pageNo);
            });
        }
        loadPage(prevFigures) {
            return ScrapsPage_awaiter(this, void 0, void 0, function*() {
                const page = yield this.getPage();
                if (null == page) {
                    throw new Error("No page found");
                }
                null !== prevFigures && void 0 !== prevFigures || (prevFigures = []);
                const prevSids = prevFigures.map(figure => figure.id);
                let figures = getFiguresFromPage(page);
                figures = figures.filter(figure => !prevSids.includes(figure.id));
                if (0 !== figures.length) {
                    if (showPageSeparatorSetting.value) {
                        const separator = createSeparatorElem(this.pageNo);
                        this.gallery.appendChild(separator);
                    }
                    for (const figure of figures) {
                        this.gallery.appendChild(figure);
                    }
                } else {
                    throw new Error("No figures found");
                }
                window.dispatchEvent(new CustomEvent("ei-update-embedded"));
                return figures;
            });
        }
    }
    var SearchPage_awaiter = function(thisArg, _arguments, P, generator) {
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
    class SearchPage {
        constructor(pageNo) {
            this.pageNo = pageNo;
            this.gallery = document.querySelector('section[id*="gallery"]');
        }
        getPage() {
            return SearchPage_awaiter(this, void 0, void 0, function*() {
                Logger.logInfo(`Getting page SearchPage '${this.pageNo}'`);
                return yield requestHelper.UserRequests.SearchRequests.Search.getPage(this.pageNo, this.getSearchOptionsNew());
            });
        }
        getSearchOptionsNew() {
            var _a, _b, _c, _d, _e;
            const searchOptions = requestHelper.UserRequests.SearchRequests.Search.newSearchOptions;
            const sideBarOptions = document.getElementById("sidebar-options");
            if (null == sideBarOptions) {
                return searchOptions;
            }
            const searchInput = sideBarOptions.querySelector('textarea[class*="search-query"]');
            if (null != searchInput && searchInput instanceof HTMLTextAreaElement) {
                searchOptions.input = searchInput.value;
            }
            const searchContainer = document.getElementById("search-advanced");
            if (null == searchContainer) {
                return searchOptions;
            }
            const options = searchContainer.querySelectorAll("option[selected]");
            for (const option of Array.from(options)) {
                let name = null === (_a = option.parentElement) || void 0 === _a ? void 0 : _a.getAttribute("name");
                null !== name && void 0 !== name || (name = null === (_c = null === (_b = option.parentElement) || void 0 === _b ? void 0 : _b.parentElement) || void 0 === _c ? void 0 : _c.getAttribute("name"));
                const value = option.getAttribute("value");
                if (null != value) {
                    switch (name) {
                      case "order-by":
                        searchOptions.orderBy = value;
                        break;

                      case "order-direction":
                        searchOptions.orderDirection = value;
                        break;

                      case "perpage":
                        searchOptions.perPage = parseInt(value);
                        break;

                      case "category":
                        searchOptions.category = parseInt(value);
                        break;

                      case "arttype":
                        searchOptions.type = parseInt(value);
                        break;

                      case "species":
                        searchOptions.species = parseInt(value);
                    }
                }
            }
            const radioButtons = searchContainer.querySelectorAll('input[type="radio"][checked]');
            for (const radioButton of Array.from(radioButtons)) {
                const name = radioButton.getAttribute("name");
                const value = radioButton.getAttribute("value");
                switch (name) {
                  case "range":
                    searchOptions.range = null !== value && void 0 !== value ? value : void 0;
                    if ("manual" === value) {
                        const rangeContainer = searchContainer.querySelector('div[class*="jsManualRangeContainer"]');
                        const rangeFrom = null === rangeContainer || void 0 === rangeContainer ? void 0 : rangeContainer.querySelector('input[type="date"][name="range_from"]');
                        searchOptions.rangeFrom = null !== (_d = null === rangeFrom || void 0 === rangeFrom ? void 0 : rangeFrom.getAttribute("value")) && void 0 !== _d ? _d : void 0;
                        const rangeTo = null === rangeContainer || void 0 === rangeContainer ? void 0 : rangeContainer.querySelector('input[type="date"][name="range_to"]');
                        searchOptions.rangeTo = null !== (_e = null === rangeTo || void 0 === rangeTo ? void 0 : rangeTo.getAttribute("value")) && void 0 !== _e ? _e : void 0;
                    }
                    break;

                  case "mode":
                    searchOptions.matching = null !== value && void 0 !== value ? value : void 0;
                }
            }
            const checkBoxes = null === searchContainer || void 0 === searchContainer ? void 0 : searchContainer.querySelectorAll('input[type="checkbox"]');
            for (const checkBox of Array.from(null !== checkBoxes && void 0 !== checkBoxes ? checkBoxes : [])) {
                switch (checkBox.getAttribute("name")) {
                  case "rating-general":
                    searchOptions.ratingGeneral = checkBox.hasAttribute("checked");
                    break;

                  case "rating-mature":
                    searchOptions.ratingMature = checkBox.hasAttribute("checked");
                    break;

                  case "rating-adult":
                    searchOptions.ratingAdult = checkBox.hasAttribute("checked");
                    break;

                  case "type-art":
                    searchOptions.typeArt = checkBox.hasAttribute("checked");
                    break;

                  case "type-music":
                    searchOptions.typeMusic = checkBox.hasAttribute("checked");
                    break;

                  case "type-flash":
                    searchOptions.typeFlash = checkBox.hasAttribute("checked");
                    break;

                  case "type-story":
                    searchOptions.typeStory = checkBox.hasAttribute("checked");
                    break;

                  case "type-photo":
                    searchOptions.typePhotos = checkBox.hasAttribute("checked");
                    break;

                  case "type-poetry":
                    searchOptions.typePoetry = checkBox.hasAttribute("checked");
                }
            }
            return searchOptions;
        }
        getSearchOptions() {
            var _a, _b, _c;
            const searchOptions = requestHelper.UserRequests.SearchRequests.Search.newSearchOptions;
            const input = document.getElementById("q");
            searchOptions.input = null !== (_a = null === input || void 0 === input ? void 0 : input.getAttribute("value")) && void 0 !== _a ? _a : "";
            const searchContainer = document.getElementById("search-advanced");
            const options = null === searchContainer || void 0 === searchContainer ? void 0 : searchContainer.querySelectorAll("option[selected]");
            for (const option of Array.from(null !== options && void 0 !== options ? options : [])) {
                const name = option.parentNode.getAttribute("name");
                const value = option.getAttribute("value");
                switch (name) {
                  case "order-by":
                    searchOptions.orderBy = null !== value && void 0 !== value ? value : void 0;
                    break;

                  case "order-direction":
                    searchOptions.orderDirection = null !== value && void 0 !== value ? value : void 0;
                }
            }
            const radioButtons = null === searchContainer || void 0 === searchContainer ? void 0 : searchContainer.querySelectorAll('input[type="radio"][checked]');
            for (const radioButton of Array.from(null !== radioButtons && void 0 !== radioButtons ? radioButtons : [])) {
                const name = radioButton.getAttribute("name");
                const value = radioButton.getAttribute("value");
                switch (name) {
                  case "range":
                    searchOptions.range = null !== value && void 0 !== value ? value : void 0;
                    break;

                  case "mode":
                    searchOptions.matching = null !== value && void 0 !== value ? value : void 0;
                }
                if ("manual" === value) {
                    const rangeFrom = null === searchContainer || void 0 === searchContainer ? void 0 : searchContainer.querySelector('input[type="date"][name="range_from"]');
                    searchOptions.rangeFrom = null !== (_b = null === rangeFrom || void 0 === rangeFrom ? void 0 : rangeFrom.getAttribute("value")) && void 0 !== _b ? _b : void 0;
                    const rangeTo = null === searchContainer || void 0 === searchContainer ? void 0 : searchContainer.querySelector('input[type="date"][name="range_to"]');
                    searchOptions.rangeTo = null !== (_c = null === rangeTo || void 0 === rangeTo ? void 0 : rangeTo.getAttribute("value")) && void 0 !== _c ? _c : void 0;
                }
            }
            const checkBoxes = null === searchContainer || void 0 === searchContainer ? void 0 : searchContainer.querySelectorAll('input[type="checkbox"]');
            for (const checkBox of Array.from(null !== checkBoxes && void 0 !== checkBoxes ? checkBoxes : [])) {
                switch (checkBox.getAttribute("name")) {
                  case "rating-general":
                    searchOptions.ratingGeneral = checkBox.hasAttribute("checked");
                    break;

                  case "rating-mature":
                    searchOptions.ratingMature = checkBox.hasAttribute("checked");
                    break;

                  case "rating-adult":
                    searchOptions.ratingAdult = checkBox.hasAttribute("checked");
                    break;

                  case "type-art":
                    searchOptions.typeArt = checkBox.hasAttribute("checked");
                    break;

                  case "type-music":
                    searchOptions.typeMusic = checkBox.hasAttribute("checked");
                    break;

                  case "type-flash":
                    searchOptions.typeFlash = checkBox.hasAttribute("checked");
                    break;

                  case "type-story":
                    searchOptions.typeStory = checkBox.hasAttribute("checked");
                    break;

                  case "type-photo":
                    searchOptions.typePhotos = checkBox.hasAttribute("checked");
                    break;

                  case "type-poetry":
                    searchOptions.typePoetry = checkBox.hasAttribute("checked");
                }
            }
            return searchOptions;
        }
        loadPage(prevFigures) {
            return SearchPage_awaiter(this, void 0, void 0, function*() {
                const page = yield this.getPage();
                if (null == page) {
                    throw new Error("No page found");
                }
                null !== prevFigures && void 0 !== prevFigures || (prevFigures = []);
                const prevSids = prevFigures.map(figure => figure.id);
                let figures = getFiguresFromPage(page);
                figures = figures.filter(figure => !prevSids.includes(figure.id));
                if (0 !== figures.length) {
                    if (showPageSeparatorSetting.value) {
                        const separator = createSeparatorElem(this.pageNo);
                        this.gallery.appendChild(separator);
                    }
                    for (const figure of figures) {
                        this.gallery.appendChild(figure);
                    }
                } else {
                    throw new Error("No figures found");
                }
                window.dispatchEvent(new CustomEvent("ei-update-embedded"));
                return figures;
            });
        }
    }
    var WatchesPage_awaiter = function(thisArg, _arguments, P, generator) {
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
    class WatchesPage {
        constructor(pageNo) {
            this.pageNo = pageNo;
            const columnpage = document.getElementById("columnpage");
            this.gallery = columnpage.querySelector('div[class="section-body"]');
            this.gallery.style.display = "flex";
            this.gallery.style.flexWrap = "wrap";
        }
        getPage() {
            return WatchesPage_awaiter(this, void 0, void 0, function*() {
                Logger.logInfo(`Getting page WatchesPage '${this.pageNo}'`);
                return yield requestHelper.PersonalUserRequests.ManageContent.getWatchesPage(this.pageNo);
            });
        }
        loadPage(prevWatches) {
            return WatchesPage_awaiter(this, void 0, void 0, function*() {
                const page = yield this.getPage();
                if (null == page) {
                    throw new Error("No page found");
                }
                null !== prevWatches && void 0 !== prevWatches || (prevWatches = []);
                const prevHrefs = prevWatches.map(watch => {
                    var _a;
                    return null === (_a = watch.querySelector("a[href]")) || void 0 === _a ? void 0 : _a.href;
                });
                let watches = function getWatchesFromPage(page) {
                    try {
                        const watchList = [];
                        const watches = page.getElementById("columnpage").querySelector('div[class="section-body"]').querySelector('div[class="flex-watchlist"]').querySelectorAll('div[class="flex-item-watchlist aligncenter"]');
                        for (const watch of Array.from(watches).map(elem => elem)) {
                            watchList.push(watch);
                        }
                        return watchList;
                    } catch (_a) {
                        return [];
                    }
                }(page);
                watches = watches.filter(watch => {
                    var _a;
                    return !prevHrefs.includes(null === (_a = watch.querySelector("a[href]")) || void 0 === _a ? void 0 : _a.href);
                });
                if (0 !== watches.length) {
                    if (showPageSeparatorSetting.value) {
                        const separator = createSeparatorElem(this.pageNo);
                        separator.style.width = "fit-content";
                        separator.style.margin = "14px auto";
                        this.gallery.appendChild(document.createElement("br"));
                        this.gallery.appendChild(separator);
                        this.gallery.appendChild(document.createElement("br"));
                    }
                    const watchesContainer = document.createElement("div");
                    watchesContainer.className = "flex-watchlist";
                    this.gallery.appendChild(watchesContainer);
                    watchesContainer.append(...watches);
                } else {
                    throw new Error("No watches found");
                }
                return watches;
            });
        }
    }
    var GalleryManager_awaiter = function(thisArg, _arguments, P, generator) {
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
    class GalleryManager {
        constructor() {
            this.pageNo = 1;
            this.prevFigures = [];
            this.currDataFavId = "";
            this.isGallery = window.location.toString().toLowerCase().includes("net/gallery");
            this.isFavorites = window.location.toString().toLowerCase().includes("net/favorites");
            this.isScraps = window.location.toString().toLowerCase().includes("net/scraps");
            this.isBrowse = window.location.toString().toLowerCase().includes("net/browse");
            if (this.isBrowse) {
                const pageOption = document.getElementById("manual-page");
                if (pageOption instanceof HTMLInputElement) {
                    this.pageNo = parseInt(pageOption.value);
                }
            }
            this.isSearch = window.location.toString().toLowerCase().includes("net/search");
            if (this.isSearch) {
                const searchAdvanced = document.getElementById("search-advanced");
                const pageStartInput = null === searchAdvanced || void 0 === searchAdvanced ? void 0 : searchAdvanced.querySelector('input[class*="js-pageNumInput"]');
                if (null != pageStartInput && pageStartInput instanceof HTMLInputElement) {
                    this.pageNo = parseInt(pageStartInput.value);
                }
            }
            this.isWatches = window.location.toString().toLowerCase().includes("net/controls/buddylist");
            if (this.isWatches) {
                const columnpage = document.getElementById("columnpage");
                const gallery = null === columnpage || void 0 === columnpage ? void 0 : columnpage.querySelector('div[class="section-body"]');
                const paginationLinks = null === gallery || void 0 === gallery ? void 0 : gallery.querySelector('div[class*="pagination-links"]');
                if (null != paginationLinks) {
                    const paginationLinksElem = paginationLinks;
                    paginationLinksElem.style.display = "none";
                    paginationLinksElem.insertBeforeThis(document.createElement("br"));
                }
            }
        }
        loadNextPage() {
            return GalleryManager_awaiter(this, void 0, void 0, function*() {
                this.pageNo++;
                if (this.isFavorites) {
                    const gallery = document.body.querySelector('section[id*="gallery"]');
                    const figures = null === gallery || void 0 === gallery ? void 0 : gallery.getElementsByTagName("figure");
                    if (null != figures && 0 !== figures.length) {
                        const lastFigureFavId = figures[figures.length - 1].getAttribute("data-fav-id");
                        if (null != lastFigureFavId) {
                            this.currDataFavId = lastFigureFavId;
                        }
                    }
                }
                let nextPage;
                if (this.isGallery) {
                    nextPage = new GalleryPage(this.pageNo);
                } else if (this.isFavorites) {
                    nextPage = new FavoritesPage(this.currDataFavId, this.pageNo);
                } else if (this.isScraps) {
                    nextPage = new ScrapsPage(this.pageNo);
                } else if (this.isBrowse) {
                    nextPage = new BrowsePage(this.pageNo);
                } else if (this.isSearch) {
                    nextPage = new SearchPage(this.pageNo);
                } else if (this.isWatches) {
                    nextPage = new WatchesPage(this.pageNo);
                }
                if (null != nextPage) {
                    const spacer = document.createElement("div");
                    spacer.style.height = "20px";
                    nextPage.gallery.appendChild(spacer);
                    const loadingSpinner = new window.FALoadingSpinner(nextPage.gallery);
                    loadingSpinner.spinnerThickness = 5;
                    loadingSpinner.size = 50;
                    loadingSpinner.visible = true;
                    try {
                        this.prevFigures = yield nextPage.loadPage(this.prevFigures);
                    } finally {
                        loadingSpinner.visible = false;
                        loadingSpinner.dispose();
                        nextPage.gallery.removeChild(spacer);
                    }
                }
            });
        }
    }
    var InfiniGallery_awaiter = function(thisArg, _arguments, P, generator) {
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
    class InfiniGallery {
        constructor() {
            this.scanInterval = -1;
            this.scanElem = document.getElementById("footer");
            this.galleryManager = new GalleryManager;
            window.addEventListener("ig-stop-detection", () => {
                this.stopScrollDetection();
            });
        }
        startScrollDetection() {
            this.scanInterval = setInterval(() => {
                if (function isElementOnScreen(element) {
                    const rect = element.getBoundingClientRect();
                    const windowHeight = 2 * (window.innerHeight || document.documentElement.clientHeight);
                    return rect.top <= windowHeight && rect.top + rect.height >= 0;
                }(this.scanElem)) {
                    this.stopScrollDetection();
                    this.loadNextPage();
                }
            }, 100);
        }
        stopScrollDetection() {
            clearInterval(this.scanInterval);
        }
        loadNextPage() {
            return InfiniGallery_awaiter(this, void 0, void 0, function*() {
                try {
                    yield this.galleryManager.loadNextPage();
                    this.startScrollDetection();
                } catch (_a) {
                    this.stopScrollDetection();
                }
            });
        }
    }
    const customSettings = new window.FACustomSettings("Furaffinity Features Settings", "FA Infini-Gallery Settings");
    const showPageSeparatorSetting = customSettings.newSetting(window.FASettingType.Boolean, "Page Separator");
    showPageSeparatorSetting.description = "Set wether a Page Separator is shown for each new Page loaded. Default: Show Page Separators";
    showPageSeparatorSetting.defaultValue = true;
    const pageSeparatorTextSetting = customSettings.newSetting(window.FASettingType.Text, "Page Separator Text");
    pageSeparatorTextSetting.description = "The Text that is displayed when a new Infini-Gallery Page is loaded (if shown). Number of Page gets inserted instead of: %page% .";
    pageSeparatorTextSetting.defaultValue = "Infini-Gallery Page: %page%";
    pageSeparatorTextSetting.verifyRegex = /%page%/;
    customSettings.loadSettings();
    const requestHelper = new window.FARequestHelper(2);
    if (customSettings.isFeatureEnabled) {
        const matchList = new window.FAMatchList(customSettings);
        matchList.matches = [ "net/gallery", "net/favorites", "net/scraps", "net/browse", "net/search", "net/controls/buddylist" ];
        matchList.runInIFrame = false;
        if (matchList.hasMatch) {
            (new InfiniGallery).startScrollDetection();
        }
    }
})();