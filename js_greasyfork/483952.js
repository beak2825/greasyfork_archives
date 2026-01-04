// ==UserScript==
// @name        Furaffinity-Request-Helper
// @namespace   Violentmonkey Scripts
// @require     https://update.greasyfork.org/scripts/525666/1549449/Furaffinity-Prototype-Extensions.js
// @grant       none
// @version     1.4.4
// @author      Midori Dragon
// @description Library to simplify requests to Furaffinity
// @icon        https://www.furaffinity.net/themes/beta/img/banners/fa_logo.png
// @license     MIT
// @homepageURL https://greasyfork.org/scripts/483952-furaffinity-request-helper
// @supportURL  https://greasyfork.org/scripts/483952-furaffinity-request-helper/feedback
// ==/UserScript==
// jshint esversion: 8
(() => {
    "use strict";
    class Semaphore {
        constructor(maxConcurrency) {
            this.maxConcurrency = maxConcurrency;
            this.currentConcurrency = 0;
            this.waitingQueue = [];
        }
        acquire() {
            return new Promise(resolve => {
                if (this.currentConcurrency < this.maxConcurrency) {
                    this.currentConcurrency++;
                    resolve();
                } else {
                    this.waitingQueue.push(resolve);
                }
            });
        }
        release() {
            if (this.waitingQueue.length > 0) {
                const nextResolve = this.waitingQueue.shift();
                if (null != nextResolve) {
                    nextResolve();
                }
            } else {
                this.currentConcurrency--;
            }
        }
    }
    class PercentHelper {
        constructor() {
            throw new Error("The PercentHelper class is static and cannot be instantiated.");
        }
        static setPercentValue(id, value) {
            if (value && PercentHelper._percentAll.hasOwnProperty(id)) {
                PercentHelper._percentAll[id] = value;
                return true;
            }
            return false;
        }
        static getPercentValue(id, decimalPlaces = 2) {
            if (null == id) {
                return -1;
            }
            const percent = PercentHelper._percentAll[id];
            if (!percent) {
                return -1;
            } else {
                return parseFloat(percent.toFixed(decimalPlaces));
            }
        }
        static createPercentValue(uniqueId) {
            PercentHelper._percentAll[uniqueId] = 0;
        }
        static deletePercentValue(id) {
            if (PercentHelper._percentAll.hasOwnProperty(id)) {
                delete PercentHelper._percentAll[id];
            }
        }
        static updatePercentValue(id, value, totalValue) {
            if (null != id && "" !== id && -1 !== id) {
                const progress = value / totalValue * 100;
                PercentHelper.setPercentValue(id, progress);
            }
        }
    }
    PercentHelper._percentAll = {};
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
    class WaitAndCallAction {
        constructor(action, delay) {
            this.delay = 10;
            this._running = false;
            this._action = action;
            if (null != delay) {
                this.delay = delay;
            }
        }
        start() {
            if (null != this._action && false === this._running) {
                this._running = true;
                this._intervalId = setInterval(() => {
                    var _a;
                    this._action(PercentHelper.getPercentValue(null === (_a = this._intervalId) || void 0 === _a ? void 0 : _a.toString()));
                }, this.delay);
                PercentHelper.createPercentValue(this._intervalId.toString());
                return this._intervalId;
            }
        }
        stop() {
            if (this._running) {
                this._running = false;
                clearInterval(this._intervalId);
                if (null != this._intervalId) {
                    PercentHelper.deletePercentValue(this._intervalId.toString());
                }
            }
        }
        static callFunctionAsync(functionToCall_1, params_1, action_1, delay_1) {
            return __awaiter(this, arguments, void 0, function*(functionToCall, params, action, delay, usePercent = false) {
                if (null == action) {
                    return yield functionToCall(...params);
                }
                const waitAndCallAction = new WaitAndCallAction(action, delay);
                const percentId = waitAndCallAction.start();
                if (usePercent) {
                    params.push(percentId);
                }
                const result = yield functionToCall(...params);
                waitAndCallAction.stop();
                return result;
            });
        }
        static callFunction(functionToCall, params, action, delay, usePercent = false) {
            if (null == action) {
                return functionToCall(...params);
            }
            const waitAndCallAction = new WaitAndCallAction(action, delay);
            const percentId = waitAndCallAction.start();
            if (usePercent) {
                params.push(percentId);
            }
            const result = functionToCall(...params);
            waitAndCallAction.stop();
            return result;
        }
    }
    class IdArray {
        constructor() {
            throw new Error("The IdArray class is static and cannot be instantiated.");
        }
        static getTillId(collection, toId, attributeName = "id") {
            const result = [];
            toId = toId.toString();
            for (const elem of collection) {
                result.push(elem);
                const attribute = elem.getAttribute(attributeName);
                if (null != attribute && attribute.replace("sid-", "") === toId) {
                    break;
                }
            }
            return result;
        }
        static getSinceId(collection, fromId, attributeName = "id") {
            const array = collection;
            array.reverse();
            const result = [];
            fromId = fromId.toString();
            for (const elem of array) {
                result.push(elem);
                const attribute = elem.getAttribute(attributeName);
                if (null != attribute && attribute.replace("sid-", "") === fromId) {
                    break;
                }
            }
            result.reverse();
            return result;
        }
        static getBetweenIds(collection, fromId, toId, attributeName = "id") {
            const array = collection;
            let startIndex = -1;
            let endIndex = -1;
            fromId = fromId.toString();
            toId = toId.toString();
            for (let i = 0; i < array.length; i++) {
                const attribute = array[i].getAttribute(attributeName);
                if (null != attribute && attribute.replace("sid-", "") === fromId) {
                    startIndex = i;
                }
                if (null != attribute && attribute.replace("sid-", "") === toId) {
                    endIndex = i;
                }
                if (-1 !== startIndex && -1 !== endIndex) {
                    break;
                }
            }
            if (-1 === startIndex && -1 === endIndex) {
                return array;
            }
            if (-1 === startIndex) {
                startIndex = 0;
            }
            if (-1 === endIndex) {
                endIndex = array.length - 1;
            }
            const result = [];
            for (let i = startIndex; i <= endIndex; i++) {
                result.push(array[i]);
            }
            return result;
        }
        static containsId(collection, id, attributeName = "id") {
            id = id.toString();
            for (const elem of collection) {
                const attribute = elem.getAttribute(attributeName);
                if (null != attribute && attribute.replace("sid-", "") === id) {
                    return true;
                }
            }
            return false;
        }
    }
    function convertToNumber(value) {
        if (null == value) {
            return;
        }
        const number = parseInt(value.toString());
        if (!isNaN(number)) {
            return number;
        }
    }
    var Scraps_awaiter = function(thisArg, _arguments, P, generator) {
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
    class Scraps {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/scraps/";
        }
        getSubmissionPageNo(username_1, submissionId_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Scraps_awaiter(this, arguments, void 0, function*(username, submissionId, fromPageNumber, toPageNumber, action, delay = 100) {
                submissionId = convertToNumber(submissionId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getSubmissionPageNo, [ username, submissionId, void 0, fromPageNumber, toPageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay);
            });
        }
        getFiguresBetweenIds(username_1, fromId_1, toId_1, action_1) {
            return Scraps_awaiter(this, arguments, void 0, function*(username, fromId, toId, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillId, [ username, void 0, toId, void 0, GalleryType.SCRAPS, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSinceId, [ username, void 0, fromId, void 0, GalleryType.SCRAPS, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenIds, [ username, void 0, fromId, toId, void 0, void 0, GalleryType.SCRAPS, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenIdsBetweenPages(username_1, fromId_1, toId_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Scraps_awaiter(this, arguments, void 0, function*(username, fromId, toId, fromPageNumber, toPageNumber, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillId, [ username, void 0, toId, fromPageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSinceId, [ username, void 0, fromId, toPageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenIds, [ username, void 0, fromId, toId, fromPageNumber, toPageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenPages(username_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Scraps_awaiter(this, arguments, void 0, function*(username, fromPageNumber, toPageNumber, action, delay = 100) {
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillPage, [ username, void 0, toPageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay, true);
                } else if (null == toPageNumber || toPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSincePage, [ username, void 0, fromPageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenPages, [ username, void 0, fromPageNumber, toPageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay, true);
                }
            });
        }
        getFigures(username_1, pageNumber_1, action_1) {
            return Scraps_awaiter(this, arguments, void 0, function*(username, pageNumber, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFigures, [ username, void 0, pageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay);
            });
        }
        getPage(username_1, pageNumber_1, action_1) {
            return Scraps_awaiter(this, arguments, void 0, function*(username, pageNumber, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(Page.getGalleryPage, [ username, void 0, pageNumber, GalleryType.SCRAPS, this._semaphore ], action, delay);
            });
        }
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
    var Favorites_awaiter = function(thisArg, _arguments, P, generator) {
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
    class Favorites {
        constructor(semaphore) {
            this.semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/favorites/";
        }
        getSubmissionDataFavId(username_1, submissionId_1, fromDataFavId_1, toDataFavId_1, maxPageNo_1, action_1) {
            return Favorites_awaiter(this, arguments, void 0, function*(username, submissionId, fromDataFavId, toDataFavId, maxPageNo, action, delay = 100) {
                submissionId = convertToNumber(submissionId);
                fromDataFavId = convertToNumber(fromDataFavId);
                toDataFavId = convertToNumber(toDataFavId);
                maxPageNo = convertToNumber(maxPageNo);
                return yield WaitAndCallAction.callFunctionAsync(getSubmissionDataFavId, [ username, submissionId, fromDataFavId, toDataFavId, maxPageNo, this.semaphore ], action, delay);
            });
        }
        getFiguresBetweenIds(username_1, fromId_1, toId_1, maxPageNo_1, action_1) {
            return Favorites_awaiter(this, arguments, void 0, function*(username, fromId, toId, maxPageNo, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                maxPageNo = convertToNumber(maxPageNo);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresTillId, [ username, toId, void 0, maxPageNo, this.semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresSinceId, [ username, fromId, void 0, maxPageNo, this.semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresBetweenIds, [ username, fromId, toId, void 0, void 0, maxPageNo, this.semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenIdsBetweenPages(username_1, fromId_1, toId_1, fromDataFavId_1, toDataFavId_1, maxPageNo_1, action_1) {
            return Favorites_awaiter(this, arguments, void 0, function*(username, fromId, toId, fromDataFavId, toDataFavId, maxPageNo, action, delay = 100) {
                return yield this.getFiguresBetweenIdsBetweenDataIds(username, fromId, toId, fromDataFavId, toDataFavId, maxPageNo, action, delay);
            });
        }
        getFiguresBetweenIdsBetweenDataIds(username_1, fromId_1, toId_1, fromDataFavId_1, toDataFavId_1, maxPageNo_1, action_1) {
            return Favorites_awaiter(this, arguments, void 0, function*(username, fromId, toId, fromDataFavId, toDataFavId, maxPageNo, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                fromDataFavId = convertToNumber(fromDataFavId);
                toDataFavId = convertToNumber(toDataFavId);
                maxPageNo = convertToNumber(maxPageNo);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresTillId, [ username, toId, fromDataFavId, maxPageNo, this.semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresSinceId, [ username, fromId, toDataFavId, maxPageNo, this.semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresBetweenIds, [ username, fromId, toId, fromDataFavId, toDataFavId, maxPageNo, this.semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenPages(username_1, fromDataFavId_1, toDataFavId_1, maxPageNo_1, action_1) {
            return Favorites_awaiter(this, arguments, void 0, function*(username, fromDataFavId, toDataFavId, maxPageNo, action, delay = 100) {
                fromDataFavId = convertToNumber(fromDataFavId);
                toDataFavId = convertToNumber(toDataFavId);
                maxPageNo = convertToNumber(maxPageNo);
                if (null == fromDataFavId || fromDataFavId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresTillPage, [ username, toDataFavId, maxPageNo, this.semaphore ], action, delay, true);
                } else if (null == toDataFavId || toDataFavId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresSincePage, [ username, fromDataFavId, maxPageNo, this.semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(getFavoritesFiguresBetweenPages, [ username, fromDataFavId, toDataFavId, maxPageNo, this.semaphore ], action, delay, true);
                }
            });
        }
        getFigures(username_1, fromDataFavId_1, direction_1, action_1) {
            return Favorites_awaiter(this, arguments, void 0, function*(username, fromDataFavId, direction, action, delay = 100) {
                fromDataFavId = convertToNumber(fromDataFavId);
                direction = convertToNumber(direction);
                return yield WaitAndCallAction.callFunctionAsync(getFavoritesFigures, [ username, fromDataFavId, direction, this.semaphore ], action, delay);
            });
        }
        getPage(username_1, fromDataFavId_1, direction_1, action_1) {
            return Favorites_awaiter(this, arguments, void 0, function*(username, fromDataFavId, direction, action, delay = 100) {
                fromDataFavId = convertToNumber(fromDataFavId);
                direction = convertToNumber(direction);
                return yield WaitAndCallAction.callFunctionAsync(Page.getFavoritesPage, [ username, fromDataFavId, direction, this.semaphore ], action, delay);
            });
        }
    }
    function getSubmissionDataFavId(username, submissionId, fromDataFavId, toDataFavId, maxPageNo, semaphore) {
        return Favorites_awaiter(this, void 0, void 0, function*() {
            if (null == submissionId || submissionId <= 0) {
                Logger.logError("No submissionId given");
                return -1;
            }
            if (null == fromDataFavId || fromDataFavId <= 0) {
                Logger.logWarning("fromDataFavId must be greater than 0. Using default 1 instead.");
                fromDataFavId = -1;
            }
            if (null == toDataFavId || toDataFavId <= 0) {
                Logger.logWarning("toDataFavId must be greater than 0. Using default 1 instead.");
                toDataFavId = -1;
            }
            if (null == maxPageNo || maxPageNo <= 0) {
                Logger.logWarning("maxPageNo must be greater than 0. Using default " + Number.MAX_SAFE_INTEGER + " instead.");
                maxPageNo = Number.MAX_SAFE_INTEGER;
            }
            let dataFavId = fromDataFavId;
            let running = true;
            let i = 0;
            for (;running && i < maxPageNo; ) {
                const figures = yield getFavoritesFigures(username, dataFavId, 1, semaphore);
                let currFigureId;
                if (0 !== figures.length) {
                    currFigureId = figures[0].id;
                    const dataFavIdString = figures[figures.length - 1].getAttribute("data-fav-id");
                    if (null == dataFavIdString) {
                        running = false;
                        break;
                    }
                    dataFavId = parseInt(dataFavIdString);
                    const resultFigure = figures.find(figure => figure.id.trimStart("sid-") === submissionId.toString());
                    if (null != resultFigure) {
                        return parseInt(resultFigure.getAttribute("data-fav-id"));
                    }
                }
                if (undefined === currFigureId) {
                    running = false;
                }
                i++;
            }
            if (i >= maxPageNo) {
                Logger.logWarning("Max page number reached. Aborting.");
            }
            return -1;
        });
    }
    function getFavoritesFiguresTillId(username, toId, fromDataFavId, maxPageNo, semaphore) {
        return Favorites_awaiter(this, void 0, void 0, function*() {
            if (null == toId || toId <= 0) {
                Logger.logError("No toId given");
                return [];
            }
            if (null == fromDataFavId || fromDataFavId <= 0) {
                Logger.logWarning("No fromDataFavId given. Using default 1 instead.");
                fromDataFavId = -1;
            }
            if (null == maxPageNo || maxPageNo <= 0) {
                Logger.logWarning("maxPageNo must be greater than 0. Using default " + Number.MAX_SAFE_INTEGER + " instead.");
                maxPageNo = Number.MAX_SAFE_INTEGER;
            }
            let running = true;
            let dataFavId = fromDataFavId;
            const allFigures = [];
            let i = 0;
            for (;running && i < maxPageNo; ) {
                const figures = yield getFavoritesFigures(username, dataFavId, 1, semaphore);
                let currFigureId;
                if (0 !== figures.length) {
                    currFigureId = figures[0].id;
                    const dataFavIdString = figures[figures.length - 1].getAttribute("data-fav-id");
                    if (null == dataFavIdString) {
                        running = false;
                        break;
                    }
                    dataFavId = parseInt(dataFavIdString);
                }
                if (undefined === currFigureId) {
                    running = false;
                } else if (IdArray.containsId(figures, toId)) {
                    allFigures.push(IdArray.getTillId(figures, toId));
                    running = false;
                } else {
                    allFigures.push(figures);
                }
                i++;
            }
            if (i >= maxPageNo) {
                Logger.logWarning("Max page number reached. Aborting.");
            }
            return allFigures;
        });
    }
    function getFavoritesFiguresSinceId(username, fromId, toDataFavId, maxPageNo, semaphore) {
        return Favorites_awaiter(this, void 0, void 0, function*() {
            if (null == fromId || fromId <= 0) {
                Logger.logError("No fromId given");
                return [];
            }
            if (null == toDataFavId || toDataFavId <= 0) {
                Logger.logWarning("No toDataFavId given. Using default 1 instead.");
                toDataFavId = -1;
            }
            if (null == maxPageNo || maxPageNo <= 0) {
                Logger.logWarning("maxPageNo must be greater than 0. Using default " + Number.MAX_SAFE_INTEGER + " instead.");
                maxPageNo = Number.MAX_SAFE_INTEGER;
            }
            let dataFavId = toDataFavId >= 0 ? toDataFavId : -1;
            const direction = toDataFavId >= 0 ? -1 : 1;
            let running = true;
            let i = 0;
            if (toDataFavId < 0) {
                for (;running && i < maxPageNo; ) {
                    const figures = yield getFavoritesFigures(username, dataFavId, direction, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else if (IdArray.containsId(figures, fromId)) {
                        running = false;
                        const dataFavIdString = figures[figures.length - 1].getAttribute("data-fav-id");
                        if (null == dataFavIdString) {
                            running = false;
                            break;
                        }
                        dataFavId = parseInt(dataFavIdString);
                    }
                    i++;
                }
                if (i >= maxPageNo) {
                    Logger.logWarning("Max page number reached. Aborting.");
                }
                running = true;
                i = 0;
            }
            const allFigures = [];
            for (;running && i < maxPageNo; ) {
                const figures = yield getFavoritesFigures(username, dataFavId, direction, semaphore);
                let currFigureId;
                if (0 !== figures.length) {
                    currFigureId = figures[0].id;
                    const dataFavIdString = direction >= 0 ? figures[figures.length - 1].getAttribute("data-fav-id") : figures[0].getAttribute("data-fav-id");
                    if (null == dataFavIdString) {
                        running = false;
                        break;
                    }
                    dataFavId = parseInt(dataFavIdString);
                }
                if (undefined === currFigureId) {
                    running = false;
                } else if (direction < 0) {
                    if (IdArray.containsId(figures, fromId)) {
                        allFigures.push(IdArray.getSinceId(figures, fromId).reverse());
                        running = false;
                    } else {
                        allFigures.push(Array.from(figures).reverse());
                    }
                } else if (IdArray.containsId(figures, toDataFavId, "data-fav-id")) {
                    allFigures.push(IdArray.getTillId(figures, toDataFavId, "data-fav-id"));
                    running = false;
                } else {
                    allFigures.push(figures);
                }
                i++;
            }
            if (direction < 0) {
                allFigures.reverse();
            }
            if (i >= maxPageNo) {
                Logger.logWarning("Max page number reached. Aborting.");
            }
            return allFigures;
        });
    }
    function getFavoritesFiguresBetweenIds(username, fromId, toId, fromDataFavId, toDataFavId, maxPageNo, semaphore) {
        return Favorites_awaiter(this, void 0, void 0, function*() {
            if (null == fromId || fromId <= 0) {
                Logger.logError("No fromId given");
                return [];
            }
            if (null == toId || toId <= 0) {
                Logger.logError("No toId given");
                return [];
            }
            if (null == fromDataFavId || fromDataFavId <= 0) {
                Logger.logWarning("No fromDataFavId given. Using default 1 instead.");
                fromDataFavId = -1;
            }
            if (null == toDataFavId || toDataFavId <= 0) {
                Logger.logWarning("No toDataFavId given. Using default 1 instead.");
                toDataFavId = -1;
            }
            if (null == maxPageNo || maxPageNo <= 0) {
                Logger.logWarning("maxPageNo must be greater than 0. Using default " + Number.MAX_SAFE_INTEGER + " instead.");
                maxPageNo = Number.MAX_SAFE_INTEGER;
            }
            const direction = fromDataFavId >= 0 ? 1 : toDataFavId >= 0 ? -1 : 1;
            let dataFavId = fromDataFavId >= 0 ? fromDataFavId : toDataFavId;
            let lastFigureId;
            let running = true;
            let i = 0;
            if (fromDataFavId < 0 && toDataFavId < 0) {
                for (;running && i < maxPageNo; ) {
                    const figures = yield getFavoritesFigures(username, dataFavId, direction, semaphore);
                    let currFigureId = lastFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                        const dataFavIdString = figures[figures.length - 1].getAttribute("data-fav-id");
                        if (null == dataFavIdString) {
                            running = false;
                            break;
                        }
                        dataFavId = parseInt(dataFavIdString);
                    }
                    if (currFigureId === lastFigureId) {
                        running = false;
                    } else if (IdArray.containsId(figures, fromId)) {
                        running = false;
                    }
                    i++;
                }
                if (i >= maxPageNo) {
                    Logger.logWarning("Max page number reached. Aborting.");
                }
                running = true;
                i = 0;
            }
            const allFigures = [];
            lastFigureId = void 0;
            for (;running && i < maxPageNo; ) {
                const figures = yield getFavoritesFigures(username, dataFavId, direction, semaphore);
                let currFigureId = lastFigureId;
                if (0 !== figures.length) {
                    currFigureId = figures[0].id;
                    const dataFavIdString = direction >= 0 ? figures[figures.length - 1].getAttribute("data-fav-id") : figures[0].getAttribute("data-fav-id");
                    if (null == dataFavIdString) {
                        running = false;
                        break;
                    }
                    dataFavId = parseInt(dataFavIdString);
                }
                if (currFigureId === lastFigureId) {
                    running = false;
                } else if (direction < 0) {
                    if (IdArray.containsId(figures, fromId)) {
                        allFigures.push(IdArray.getSinceId(figures, fromId).reverse());
                        running = false;
                    } else if (IdArray.containsId(figures, toId)) {
                        allFigures.push(IdArray.getTillId(figures, toId).reverse());
                    } else {
                        allFigures.push(Array.from(figures).reverse());
                    }
                } else if (IdArray.containsId(figures, toId)) {
                    allFigures.push(IdArray.getTillId(figures, toId));
                    running = false;
                } else if (IdArray.containsId(figures, fromId)) {
                    allFigures.push(IdArray.getSinceId(figures, fromId));
                } else {
                    allFigures.push(figures);
                }
                i++;
            }
            if (i >= maxPageNo) {
                Logger.logWarning("Max page number reached. Aborting.");
            }
            if (direction < 0) {
                allFigures.reverse();
            }
            return allFigures;
        });
    }
    function getFavoritesFiguresTillPage(username, toDataFavId, maxPageNo, semaphore) {
        return Favorites_awaiter(this, void 0, void 0, function*() {
            if (null == toDataFavId || toDataFavId <= 0) {
                Logger.logWarning("toDataFavId must be greater than 0. Using default 1 instead.");
                toDataFavId = -1;
            }
            if (null == maxPageNo || maxPageNo <= 0) {
                Logger.logWarning("maxPageNo must be greater than 0. Using default " + Number.MAX_SAFE_INTEGER + " instead.");
                maxPageNo = Number.MAX_SAFE_INTEGER;
            }
            let dataFavId = toDataFavId;
            const allFigures = [];
            let running = true;
            let i = 0;
            for (;running && i < maxPageNo; ) {
                const figures = yield getFavoritesFigures(username, dataFavId, 1, semaphore);
                let currFigureId;
                if (0 !== figures.length) {
                    currFigureId = figures[0].id;
                    const dataFavIdString = figures[figures.length - 1].getAttribute("data-fav-id");
                    if (null == dataFavIdString) {
                        running = false;
                        break;
                    }
                    dataFavId = parseInt(dataFavIdString);
                }
                if (undefined === currFigureId) {
                    running = false;
                } else if (IdArray.containsId(figures, toDataFavId, "data-fav-id")) {
                    allFigures.push(IdArray.getTillId(figures, toDataFavId, "data-fav-id"));
                    running = false;
                } else {
                    allFigures.push(figures);
                }
                i++;
            }
            if (i >= maxPageNo) {
                Logger.logWarning("Max page number reached. Aborting.");
            }
            return allFigures;
        });
    }
    function getFavoritesFiguresSincePage(username, fromDataFavId, maxPageNo, semaphore) {
        return Favorites_awaiter(this, void 0, void 0, function*() {
            if (null == fromDataFavId || fromDataFavId <= 0) {
                Logger.logWarning("fromDataFavId must be greater than 0. Using default 1 instead.");
                fromDataFavId = -1;
            }
            if (null == maxPageNo || maxPageNo <= 0) {
                Logger.logWarning("maxPageNo must be greater than 0. Using default " + Number.MAX_SAFE_INTEGER + " instead.");
                maxPageNo = Number.MAX_SAFE_INTEGER;
            }
            let dataFavId = fromDataFavId;
            const allFigures = [];
            let running = true;
            let i = 0;
            for (;running && i < maxPageNo; ) {
                const figures = yield getFavoritesFigures(username, dataFavId, 1, semaphore);
                let currFigureId;
                if (0 !== figures.length) {
                    currFigureId = figures[0].id;
                    const dataFavIdString = figures[figures.length - 1].getAttribute("data-fav-id");
                    if (null == dataFavIdString) {
                        running = false;
                        break;
                    }
                    dataFavId = parseInt(dataFavIdString);
                }
                if (undefined === currFigureId) {
                    running = false;
                } else if (IdArray.containsId(figures, fromDataFavId, "data-fav-id")) {
                    allFigures.push(IdArray.getSinceId(figures, fromDataFavId, "data-fav-id"));
                } else {
                    allFigures.push(figures);
                }
                i++;
            }
            if (i >= maxPageNo) {
                Logger.logWarning("Max page number reached. Aborting.");
            }
            return allFigures;
        });
    }
    function getFavoritesFiguresBetweenPages(username, fromDataFavId, toDataFavId, maxPageNo, semaphore) {
        return Favorites_awaiter(this, void 0, void 0, function*() {
            if (null == fromDataFavId || fromDataFavId <= 0) {
                Logger.logWarning("fromDataFavId must be greater than 0. Using default 1 instead.");
                fromDataFavId = -1;
            }
            if (null == toDataFavId || toDataFavId <= 0) {
                Logger.logWarning("toDataFavId must be greater than 0. Using default 1 instead.");
                toDataFavId = -1;
            }
            if (null == maxPageNo || maxPageNo <= 0) {
                Logger.logWarning("maxPageNo must be greater than 0. Using default " + Number.MAX_SAFE_INTEGER + " instead.");
                maxPageNo = Number.MAX_SAFE_INTEGER;
            }
            let dataFavId = fromDataFavId;
            const allFigures = [];
            let running = true;
            let i = 0;
            for (;running && i < maxPageNo; ) {
                const figures = yield getFavoritesFigures(username, dataFavId, 1, semaphore);
                let currFigureId;
                if (0 !== figures.length) {
                    currFigureId = figures[0].id;
                    const dataFavIdString = figures[figures.length - 1].getAttribute("data-fav-id");
                    if (null == dataFavIdString) {
                        running = false;
                        break;
                    }
                    dataFavId = parseInt(dataFavIdString);
                }
                if (undefined === currFigureId) {
                    running = false;
                } else if (IdArray.containsId(figures, fromDataFavId, "data-fav-id")) {
                    allFigures.push(IdArray.getSinceId(figures, fromDataFavId, "data-fav-id"));
                } else if (IdArray.containsId(figures, toDataFavId, "data-fav-id")) {
                    allFigures.push(IdArray.getTillId(figures, toDataFavId, "data-fav-id"));
                    running = false;
                } else {
                    allFigures.push(figures);
                }
                i++;
            }
            if (i >= maxPageNo) {
                Logger.logWarning("Max page number reached. Aborting.");
            }
            return allFigures;
        });
    }
    function getFavoritesFigures(username, dataFavId, direction, semaphore) {
        return Favorites_awaiter(this, void 0, void 0, function*() {
            Logger.logInfo(`Getting Favorites of "${username}" since id "${dataFavId}" and direction "${direction}".`);
            const galleryDoc = yield Page.getFavoritesPage(username, dataFavId, direction, semaphore);
            if (!galleryDoc || !(galleryDoc instanceof Document) || galleryDoc.getElementById("no-images")) {
                Logger.logInfo(`No images found at favorites of "${username}" on page "${dataFavId}".`);
                return [];
            }
            const figures = galleryDoc.getElementsByTagName("figure");
            if (null == figures || 0 === figures.length) {
                Logger.logInfo(`No figures found at favorites of "${username}" on page "${dataFavId}".`);
                return [];
            }
            return Array.from(figures);
        });
    }
    var Journals_awaiter = function(thisArg, _arguments, P, generator) {
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
    class Journals {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/journals/";
        }
        getJournalPageNo(username_1, journalId_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Journals_awaiter(this, arguments, void 0, function*(username, journalId, fromPageNumber, toPageNumber, action, delay = 100) {
                journalId = convertToNumber(journalId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                return yield WaitAndCallAction.callFunctionAsync(getJournalPageNo, [ username, journalId, fromPageNumber, toPageNumber, this._semaphore ], action, delay);
            });
        }
        getFiguresBetweenIds(username_1, fromId_1, toId_1, action_1) {
            return Journals_awaiter(this, arguments, void 0, function*(username, fromId, toId, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsTillId, [ username, toId, void 0, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsSinceId, [ username, fromId, void 0, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsBetweenIds, [ username, fromId, toId, void 0, void 0, this._semaphore ], action, delay);
                }
            });
        }
        getFiguresBetweenIdsBetweenPages(username_1, fromId_1, toId_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Journals_awaiter(this, arguments, void 0, function*(username, fromId, toId, fromPageNumber, toPageNumber, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsTillId, [ username, toId, fromPageNumber, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsSinceId, [ username, fromId, toPageNumber, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsBetweenIds, [ username, fromId, toId, fromPageNumber, toPageNumber, this._semaphore ], action, delay);
                }
            });
        }
        getSectionsBetweenPages(username_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Journals_awaiter(this, arguments, void 0, function*(username, fromPageNumber, toPageNumber, action, delay = 100) {
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsTillPage, [ username, toPageNumber, this._semaphore ], action, delay, true);
                } else if (null == toPageNumber || toPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsSincePage, [ username, fromPageNumber, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(getJournalsSectionsBetweenPages, [ username, fromPageNumber, toPageNumber, this._semaphore ], action, delay, true);
                }
            });
        }
        getSections(username_1, pageNumber_1, action_1) {
            return Journals_awaiter(this, arguments, void 0, function*(username, pageNumber, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(getJournalsSections, [ username, pageNumber, this._semaphore ], action, delay);
            });
        }
        getPage(username_1, pageNumber_1, action_1) {
            return Journals_awaiter(this, arguments, void 0, function*(username, pageNumber, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(Page.getJournalsPage, [ username, pageNumber, this._semaphore ], action, delay);
            });
        }
    }
    function getJournalPageNo(username, journalId, fromPageNumber, toPageNumber, semaphore, percentId) {
        return Journals_awaiter(this, void 0, void 0, function*() {
            if (null == journalId || journalId <= 0) {
                Logger.logError("No journalId given");
                return -1;
            }
            if (null == fromPageNumber || fromPageNumber <= 0) {
                Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                fromPageNumber = 1;
            }
            if (null == toPageNumber || 0 === toPageNumber) {
                Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                toPageNumber = 1;
            } else if (toPageNumber < 0) {
                toPageNumber = Number.MAX_SAFE_INTEGER;
            }
            const direction = fromPageNumber <= toPageNumber ? 1 : -1;
            const totalPages = Math.abs(toPageNumber - fromPageNumber) + 1;
            let completedPages = 0;
            for (let i = fromPageNumber; i <= toPageNumber; i += direction) {
                const figures = yield getJournalsSections(username, i, semaphore);
                if (0 === figures.length) {
                    i = toPageNumber;
                } else {
                    if (null != figures.find(figure => figure.id.trimStart("jid-") === journalId.toString())) {
                        return i;
                    }
                }
                completedPages++;
                PercentHelper.updatePercentValue(percentId, completedPages, totalPages);
            }
            return -1;
        });
    }
    function getJournalsSectionsTillId(username, toId, fromPage, semaphore) {
        return Journals_awaiter(this, void 0, void 0, function*() {
            if (null == toId || toId <= 0) {
                Logger.logError("No toId given");
                return [];
            }
            const allSections = [];
            let running = true;
            let i = 1;
            if (null != fromPage && fromPage >= 1) {
                i = fromPage;
            }
            for (;running; ) {
                const sections = yield getJournalsSections(username, i, semaphore);
                let currSectionId;
                if (0 !== sections.length) {
                    currSectionId = sections[0].id;
                }
                if (undefined === currSectionId) {
                    running = false;
                } else if (IdArray.containsId(sections, toId)) {
                    allSections.push(IdArray.getTillId(sections, toId));
                    running = false;
                } else {
                    allSections.push(sections);
                    i++;
                }
            }
            return allSections;
        });
    }
    function getJournalsSectionsSinceId(username, fromId, toPage, semaphore) {
        return Journals_awaiter(this, void 0, void 0, function*() {
            if (null == fromId || fromId <= 0) {
                Logger.logError("No fromId given");
                return [];
            }
            const direction = null == toPage || toPage <= 0 ? -1 : 1;
            let lastSectionId;
            let running = true;
            let i = null == toPage || toPage <= 0 ? 1 : toPage;
            if (null == toPage || toPage <= 0) {
                for (;running; ) {
                    const figures = yield getJournalsSections(username, i, semaphore);
                    let currSectionId = lastSectionId;
                    if (0 !== figures.length) {
                        currSectionId = figures[0].id;
                    }
                    if (currSectionId === lastSectionId) {
                        running = false;
                    } else if (IdArray.containsId(figures, fromId)) {
                        running = false;
                    } else {
                        i++;
                    }
                }
            }
            const allSections = [];
            lastSectionId = void 0;
            running = true;
            for (;running; ) {
                const figures = yield getJournalsSections(username, i, semaphore);
                let currSectionId = lastSectionId;
                if (0 !== figures.length) {
                    currSectionId = figures[0].id;
                }
                if (currSectionId === lastSectionId) {
                    running = false;
                } else {
                    if (IdArray.containsId(figures, fromId)) {
                        const figuresPush = IdArray.getSinceId(figures, fromId);
                        if (direction < 0) {
                            figuresPush.reverse();
                            running = false;
                        }
                        allSections.push(figuresPush);
                    } else {
                        if (direction < 0) {
                            figures.reverse();
                        }
                        allSections.push(figures);
                    }
                    i += direction;
                }
            }
            if (direction < 0) {
                allSections.reverse();
            }
            return allSections;
        });
    }
    function getJournalsSectionsBetweenIds(username, fromId, toId, fromPage, toPage, semaphore, percentId) {
        return Journals_awaiter(this, void 0, void 0, function*() {
            if (null == fromId || fromId <= 0) {
                Logger.logError("No fromId given");
                return [];
            }
            if (null == toId || toId <= 0) {
                Logger.logError("No toId given");
                return [];
            }
            if (null == fromPage || fromPage <= 0 || null == toPage || toPage <= 1) {
                Logger.logWarning("No fromPage or toPage given. Percentages can not be calculated.");
                percentId = void 0;
            }
            let i = 1;
            if (null != fromPage && fromPage >= 1) {
                i = fromPage;
            }
            const allSections = [];
            let running = true;
            let completedPages = 0;
            for (;running; ) {
                if (null != toPage && toPage >= 1 && i >= toPage) {
                    running = false;
                }
                const sections = yield getJournalsSections(username, i, semaphore);
                let currSectionId;
                if (0 !== sections.length) {
                    currSectionId = sections[0].id;
                }
                if (undefined === currSectionId) {
                    running = false;
                } else {
                    if (IdArray.containsId(sections, fromId)) {
                        allSections.push(IdArray.getSinceId(sections, fromId));
                    }
                    if (IdArray.containsId(sections, toId)) {
                        allSections.push(IdArray.getBetweenIds(sections, fromId, toId));
                        running = false;
                    } else {
                        allSections.push(sections);
                        i++;
                    }
                }
                completedPages++;
                if (null != toPage && toPage >= 1) {
                    PercentHelper.updatePercentValue(percentId, completedPages, toPage);
                }
            }
            return allSections;
        });
    }
    function getJournalsSectionsTillPage(username, toPageNumber, semaphore, percentId) {
        return Journals_awaiter(this, void 0, void 0, function*() {
            if (null == toPageNumber || 0 === toPageNumber) {
                Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                toPageNumber = 1;
            } else if (toPageNumber < 0) {
                toPageNumber = Number.MAX_SAFE_INTEGER;
            }
            const allSections = [];
            let completedPages = 0;
            for (let i = 1; i <= toPageNumber; i++) {
                const sections = yield getJournalsSections(username, i, semaphore);
                if (0 === sections.length) {
                    i = toPageNumber;
                } else {
                    allSections.push(sections);
                }
                completedPages++;
                PercentHelper.updatePercentValue(percentId, completedPages, toPageNumber);
            }
            return allSections;
        });
    }
    function getJournalsSectionsSincePage(username, fromPageNumber, semaphore) {
        return Journals_awaiter(this, void 0, void 0, function*() {
            if (null == fromPageNumber || fromPageNumber <= 0) {
                Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                fromPageNumber = 1;
            }
            const allSections = [];
            let running = true;
            let i = fromPageNumber;
            for (;running; ) {
                const sections = yield getJournalsSections(username, i, semaphore);
                let currSectionId;
                if (0 !== sections.length) {
                    currSectionId = sections[0].id;
                }
                if (undefined === currSectionId) {
                    running = false;
                } else {
                    allSections.push(sections);
                    i++;
                }
            }
            return allSections;
        });
    }
    function getJournalsSectionsBetweenPages(username, fromPageNumber, toPageNumber, semaphore, percentId) {
        return Journals_awaiter(this, void 0, void 0, function*() {
            if (null == fromPageNumber || fromPageNumber <= 0) {
                Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                fromPageNumber = 1;
            }
            if (null == toPageNumber || 0 === toPageNumber) {
                Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                toPageNumber = 1;
            } else if (toPageNumber < 0) {
                toPageNumber = Number.MAX_SAFE_INTEGER;
            }
            const allSections = [];
            const direction = fromPageNumber < toPageNumber ? 1 : -1;
            const totalPages = Math.abs(toPageNumber - fromPageNumber) + 1;
            let completedPages = 0;
            for (let i = fromPageNumber; i <= toPageNumber; i += direction) {
                const sections = yield getJournalsSections(username, i, semaphore);
                if (0 === sections.length) {
                    i = toPageNumber;
                } else {
                    allSections.push(sections);
                }
                completedPages++;
                PercentHelper.updatePercentValue(percentId, completedPages, totalPages);
            }
            return allSections;
        });
    }
    function getJournalsSections(username, pageNumber, semaphore) {
        return Journals_awaiter(this, void 0, void 0, function*() {
            if (null == pageNumber || pageNumber <= 0) {
                Logger.logWarning("pageNumber must be greater than 0. Using default 1 instead.");
                pageNumber = 1;
            }
            Logger.logInfo(`Getting Journals of "${username}" on page "${pageNumber}".`);
            const galleryDoc = yield Page.getJournalsPage(username, pageNumber, semaphore);
            if (!galleryDoc) {
                Logger.logWarning(`No journals found at "${username}" on page "${pageNumber}".`);
                return [];
            }
            const columnPage = galleryDoc.getElementById("columnpage");
            if (!columnPage) {
                Logger.logWarning(`No column page found at "${username}" on page "${pageNumber}".`);
                return [];
            }
            const sections = columnPage.getElementsByTagName("section");
            if (null == sections || 0 === sections.length) {
                Logger.logWarning(`No journals found at "${username}" on page "${pageNumber}".`);
                return [];
            }
            return Array.from(sections);
        });
    }
    var Search_awaiter = function(thisArg, _arguments, P, generator) {
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
    class Search {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/search/";
        }
        get newSearchOptions() {
            return new SearchOptions;
        }
        static get newSearchOptions() {
            return new SearchOptions;
        }
        get SearchOptions() {
            return SearchOptions;
        }
        static get SearchOptions() {
            return SearchOptions;
        }
        getFiguresBetweenIds(fromId_1, toId_1, searchOptions_1, action_1) {
            return Search_awaiter(this, arguments, void 0, function*(fromId, toId, searchOptions, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresTillId, [ toId, void 0, searchOptions, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresSinceId, [ fromId, void 0, searchOptions, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresBetweenIds, [ fromId, toId, void 0, void 0, searchOptions, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenIdsBetweenPages(fromId_1, toId_1, fromPageNumber_1, toPageNumber_1, searchOptions_1, action_1) {
            return Search_awaiter(this, arguments, void 0, function*(fromId, toId, fromPageNumber, toPageNumber, searchOptions, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresTillId, [ toId, fromPageNumber, searchOptions, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresSinceId, [ fromId, toPageNumber, searchOptions, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresBetweenIds, [ fromId, toId, fromPageNumber, toPageNumber, searchOptions, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenPages(fromPageNumber_1, toPageNumber_1, searchOptions_1, action_1) {
            return Search_awaiter(this, arguments, void 0, function*(fromPageNumber, toPageNumber, searchOptions, action, delay = 100) {
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresTillPage, [ toPageNumber, searchOptions, this._semaphore ], action, delay, true);
                } else if (null == toPageNumber || toPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresSincePage, [ fromPageNumber, searchOptions, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFiguresBetweenPages, [ fromPageNumber, toPageNumber, searchOptions, this._semaphore ], action, delay, true);
                }
            });
        }
        getFigures(pageNumber_1, searchOptions_1, action_1) {
            return Search_awaiter(this, arguments, void 0, function*(pageNumber, searchOptions, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getSearchFigures, [ pageNumber, searchOptions, this._semaphore ], action, delay);
            });
        }
        getPage(pageNumber_1, searchOptions_1, action_1) {
            return Search_awaiter(this, arguments, void 0, function*(pageNumber, searchOptions, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(Page.getSearchPage, [ pageNumber, searchOptions, this._semaphore ], action, delay);
            });
        }
    }
    class SearchOptions {
        constructor() {
            this.ratingGeneral = true;
            this.ratingMature = true;
            this.ratingAdult = true;
            this.typeArt = true;
            this.typeMusic = true;
            this.typeFlash = true;
            this.typeStory = true;
            this.typePhotos = true;
            this.typePoetry = true;
            this.input = "";
            this.perPage = 72;
            this.orderBy = SearchOptions.orderBy.relevancy;
            this.orderDirection = SearchOptions.orderDirection.descending;
            this.category = BrowseOptions.category.all;
            this.type = BrowseOptions.type.all;
            this.species = BrowseOptions.species.any;
            this.range = SearchOptions.range.alltime;
            this.rangeFrom = void 0;
            this.rangeTo = void 0;
            this.matching = SearchOptions.matching.all;
        }
        static get orderBy() {
            return {
                relevancy: "relevancy",
                date: "date",
                popularity: "popularity"
            };
        }
        static get orderDirection() {
            return {
                ascending: "asc",
                descending: "desc"
            };
        }
        static get range() {
            return {
                "1day": "1day",
                "3days": "3days",
                "7days": "7days",
                "30days": "30days",
                "90days": "90days",
                "1year": "1year",
                "3years": "3years",
                "5years": "5years",
                alltime: "all",
                manual: "manual"
            };
        }
        static get matching() {
            return {
                all: "all",
                any: "any",
                extended: "extended"
            };
        }
    }
    var SearchRequests_awaiter = function(thisArg, _arguments, P, generator) {
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
    class SearchRequests {
        constructor(semaphore) {
            this._semaphore = semaphore;
            this.Browse = new Browse(this._semaphore);
            this.Search = new Search(this._semaphore);
        }
        static getBrowseFiguresTillId(toId, fromPage, browseOptions, semaphore) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == toId || toId <= 0) {
                    Logger.logError("No toId given");
                    return [];
                }
                let allFigures = [];
                let running = true;
                let i = 1;
                if (null != fromPage && fromPage >= 1) {
                    i = fromPage;
                }
                for (;running; ) {
                    const figures = yield SearchRequests.getBrowseFigures(i, browseOptions, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else if (IdArray.containsId(figures, toId)) {
                        allFigures.push(IdArray.getTillId(figures, toId));
                        running = false;
                    } else {
                        allFigures.push(figures);
                        i++;
                    }
                }
                return allFigures;
            });
        }
        static getBrowseFiguresSinceId(fromId, toPage, browseOptions, semaphore) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromId || fromId <= 0) {
                    Logger.logError("No fromId given");
                    return [];
                }
                const direction = null == toPage || toPage <= 0 ? -1 : 1;
                let lastFigureId;
                let running = true;
                let i = null == toPage || toPage <= 0 ? 1 : toPage;
                if (null == toPage || toPage <= 0) {
                    for (;running; ) {
                        const figures = yield SearchRequests.getBrowseFigures(i, browseOptions, semaphore);
                        let currFigureId = lastFigureId;
                        if (0 !== figures.length) {
                            currFigureId = figures[0].id;
                        }
                        if (currFigureId === lastFigureId) {
                            running = false;
                        } else if (IdArray.containsId(figures, fromId)) {
                            running = false;
                        } else {
                            i++;
                        }
                    }
                }
                let allFigures = [];
                lastFigureId = void 0;
                running = true;
                for (;running; ) {
                    const figures = yield SearchRequests.getBrowseFigures(i, browseOptions, semaphore);
                    let currFigureId = lastFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (currFigureId === lastFigureId) {
                        running = false;
                    } else {
                        if (IdArray.containsId(figures, fromId)) {
                            const figuresPush = IdArray.getSinceId(figures, fromId);
                            if (direction < 0) {
                                figuresPush.reverse();
                                running = false;
                            }
                            allFigures.push(figuresPush);
                        } else {
                            if (direction < 0) {
                                figures.reverse();
                            }
                            allFigures.push(figures);
                        }
                        i += direction;
                    }
                }
                if (direction < 0) {
                    allFigures.reverse();
                }
                return allFigures;
            });
        }
        static getBrowseFiguresBetweenIds(fromId, toId, fromPage, toPage, browseOptions, semaphore, percentId) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromId || fromId <= 0) {
                    Logger.logError("No fromId given");
                    return [];
                }
                if (null == toId || toId <= 0) {
                    Logger.logError("No toId given");
                    return [];
                }
                if (null == fromPage || fromPage <= 0 || null == toPage || toPage <= 1) {
                    Logger.logWarning("No fromPage or toPage given. Percentages can not be calculated.");
                    percentId = void 0;
                }
                let i = 1;
                if (null != fromPage && fromPage >= 1) {
                    i = fromPage;
                }
                const allFigures = [];
                let running = true;
                let completedPages = 0;
                for (;running; ) {
                    if (null != toPage && toPage >= 1 && i >= toPage) {
                        running = false;
                    }
                    const figures = yield SearchRequests.getBrowseFigures(i, browseOptions, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else {
                        if (IdArray.containsId(figures, fromId)) {
                            allFigures.push(IdArray.getSinceId(figures, fromId));
                        }
                        if (IdArray.containsId(figures, toId)) {
                            allFigures.push(IdArray.getBetweenIds(figures, fromId, toId));
                            running = false;
                        } else {
                            allFigures.push(figures);
                            i++;
                        }
                    }
                    completedPages++;
                    if (null != toPage && toPage >= 1) {
                        PercentHelper.updatePercentValue(percentId, completedPages, toPage);
                    }
                }
                return allFigures;
            });
        }
        static getBrowseFiguresTillPage(toPageNumber, browseOptions, semaphore, percentId) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == toPageNumber || toPageNumber <= 0) {
                    Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                    toPageNumber = 1;
                }
                const allFigures = [];
                let completedPages = 0;
                for (let i = 1; i <= toPageNumber; i++) {
                    const figures = yield SearchRequests.getBrowseFigures(i, browseOptions, semaphore);
                    if (0 !== figures.length) {
                        allFigures.push(figures);
                    }
                    completedPages++;
                    PercentHelper.updatePercentValue(percentId, completedPages, toPageNumber);
                }
                return allFigures;
            });
        }
        static getBrowseFiguresSincePage(fromPageNumber, browseOptions, semaphore) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                    fromPageNumber = 1;
                }
                const allFigures = [];
                let running = true;
                let i = fromPageNumber;
                for (;running; ) {
                    const figures = yield SearchRequests.getBrowseFigures(i, browseOptions, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else {
                        allFigures.push(figures);
                        i++;
                    }
                }
                return allFigures;
            });
        }
        static getBrowseFiguresBetweenPages(fromPageNumber, toPageNumber, browseOptions, semaphore, percentId) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                    fromPageNumber = 1;
                }
                if (null == toPageNumber || toPageNumber <= 0) {
                    Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                    toPageNumber = 1;
                }
                const allFigures = [];
                const direction = fromPageNumber <= toPageNumber ? 1 : -1;
                const totalPages = Math.abs(toPageNumber - fromPageNumber) + 1;
                for (let i = fromPageNumber; i <= toPageNumber; i += direction) {
                    const figures = yield SearchRequests.getBrowseFigures(i, browseOptions, semaphore);
                    if (0 !== figures.length) {
                        allFigures.push(figures);
                    }
                    PercentHelper.updatePercentValue(percentId, 0, totalPages);
                }
                return allFigures;
            });
        }
        static getBrowseFigures(pageNumber, browseOptions, semaphore) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == pageNumber || pageNumber <= 0) {
                    Logger.logWarning("No pageNumber given. Using default value of 1.");
                    pageNumber = 1;
                }
                const galleryDoc = yield Page.getBrowsePage(pageNumber, browseOptions, semaphore);
                if (!galleryDoc || !(galleryDoc instanceof Document) || galleryDoc.getElementById("no-images")) {
                    Logger.logInfo(`No images found at browse on page "${pageNumber}".`);
                    return [];
                }
                const figures = galleryDoc.getElementsByTagName("figure");
                if (null == figures || 0 === figures.length) {
                    Logger.logInfo(`No figures found at browse on page "${pageNumber}".`);
                    return [];
                }
                return Array.from(figures);
            });
        }
        static getSearchFiguresTillId(toId, fromPage, searchOptions, semaphore) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == toId || toId <= 0) {
                    Logger.logError("No toId given");
                    return [];
                }
                let allFigures = [];
                let running = true;
                let i = 1;
                if (null != fromPage && fromPage >= 1) {
                    i = fromPage;
                }
                for (;running; ) {
                    const figures = yield SearchRequests.getSearchFigures(i, searchOptions, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else if (IdArray.containsId(figures, toId)) {
                        allFigures.push(IdArray.getTillId(figures, toId));
                        running = false;
                    } else {
                        allFigures.push(figures);
                        i++;
                    }
                }
                return allFigures;
            });
        }
        static getSearchFiguresSinceId(fromId, toPage, searchOptions, semaphore) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromId || fromId <= 0) {
                    Logger.logError("No fromId given");
                    return [];
                }
                const direction = null == toPage || toPage <= 0 ? -1 : 1;
                let lastFigureId;
                let running = true;
                let i = null == toPage || toPage <= 0 ? 1 : toPage;
                if (null == toPage || toPage <= 0) {
                    for (;running; ) {
                        const figures = yield SearchRequests.getSearchFigures(i, searchOptions, semaphore);
                        let currFigureId = lastFigureId;
                        if (0 !== figures.length) {
                            currFigureId = figures[0].id;
                        }
                        if (currFigureId === lastFigureId) {
                            running = false;
                        } else if (IdArray.containsId(figures, fromId)) {
                            running = false;
                        } else {
                            i++;
                        }
                    }
                }
                let allFigures = [];
                lastFigureId = void 0;
                running = true;
                for (;running; ) {
                    const figures = yield SearchRequests.getSearchFigures(i, searchOptions, semaphore);
                    let currFigureId = lastFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (currFigureId === lastFigureId) {
                        running = false;
                    } else {
                        if (IdArray.containsId(figures, fromId)) {
                            const figuresPush = IdArray.getSinceId(figures, fromId);
                            if (direction < 0) {
                                figuresPush.reverse();
                                running = false;
                            }
                            allFigures.push(figuresPush);
                        } else {
                            if (direction < 0) {
                                figures.reverse();
                            }
                            allFigures.push(figures);
                        }
                        i += direction;
                    }
                }
                if (direction < 0) {
                    allFigures.reverse();
                }
                return allFigures;
            });
        }
        static getSearchFiguresBetweenIds(fromId, toId, fromPage, toPage, searchOptions, semaphore, percentId) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromId || fromId <= 0) {
                    Logger.logError("No fromId given");
                    return [];
                }
                if (null == toId || toId <= 0) {
                    Logger.logError("No toId given");
                    return [];
                }
                if (null == fromPage || fromPage <= 0 || null == toPage || toPage <= 1) {
                    Logger.logWarning("No fromPage or toPage given. Percentages can not be calculated.");
                    percentId = void 0;
                }
                let i = 1;
                if (null != fromPage && fromPage >= 1) {
                    i = fromPage;
                }
                const allFigures = [];
                let running = true;
                let completedPages = 0;
                for (;running; ) {
                    if (null != toPage && toPage >= 1 && i >= toPage) {
                        running = false;
                    }
                    const figures = yield SearchRequests.getSearchFigures(i, searchOptions, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else {
                        if (IdArray.containsId(figures, fromId)) {
                            allFigures.push(IdArray.getSinceId(figures, fromId));
                        }
                        if (IdArray.containsId(figures, toId)) {
                            allFigures.push(IdArray.getBetweenIds(figures, fromId, toId));
                            running = false;
                        } else {
                            allFigures.push(figures);
                            i++;
                        }
                    }
                    completedPages++;
                    if (null != toPage && toPage >= 1) {
                        PercentHelper.updatePercentValue(percentId, completedPages, toPage);
                    }
                }
                return allFigures;
            });
        }
        static getSearchFiguresTillPage(toPageNumber, searchOptions, semaphore, percentId) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == toPageNumber || toPageNumber <= 0) {
                    Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                    toPageNumber = 1;
                }
                const allFigures = [];
                let completedPages = 0;
                for (let i = 1; i <= toPageNumber; i++) {
                    const figures = yield SearchRequests.getSearchFigures(i, searchOptions, semaphore);
                    if (0 !== figures.length) {
                        allFigures.push(figures);
                    }
                    completedPages++;
                    PercentHelper.updatePercentValue(percentId, completedPages, toPageNumber);
                }
                return allFigures;
            });
        }
        static getSearchFiguresSincePage(fromPageNumber, searchOptions, semaphore) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                    fromPageNumber = 1;
                }
                const allFigures = [];
                let running = true;
                let i = fromPageNumber;
                for (;running; ) {
                    const figures = yield SearchRequests.getSearchFigures(i, searchOptions, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else {
                        allFigures.push(figures);
                        i++;
                    }
                }
                return allFigures;
            });
        }
        static getSearchFiguresBetweenPages(fromPageNumber, toPageNumber, searchOptions, semaphore, percentId) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                    fromPageNumber = 1;
                }
                if (null == toPageNumber || toPageNumber <= 0) {
                    Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                    toPageNumber = 1;
                }
                const allFigures = [];
                const direction = fromPageNumber <= toPageNumber ? 1 : -1;
                const totalPages = Math.abs(toPageNumber - fromPageNumber) + 1;
                let completedPages = 0;
                for (let i = fromPageNumber; i <= toPageNumber; i += direction) {
                    const figures = yield SearchRequests.getSearchFigures(i, searchOptions, semaphore);
                    if (0 !== figures.length) {
                        allFigures.push(figures);
                    }
                    completedPages++;
                    PercentHelper.updatePercentValue(percentId, completedPages, totalPages);
                }
                return allFigures;
            });
        }
        static getSearchFigures(pageNumber, searchOptions, semaphore) {
            return SearchRequests_awaiter(this, void 0, void 0, function*() {
                if (null == pageNumber || pageNumber <= 0) {
                    Logger.logWarning("No pageNumber given. Using default value of 1.");
                    pageNumber = 1;
                }
                const galleryDoc = yield Page.getSearchPage(pageNumber, searchOptions, semaphore);
                if (!galleryDoc || !(galleryDoc instanceof Document) || galleryDoc.getElementById("no-images")) {
                    Logger.logInfo(`No images found at search on page "${pageNumber}".`);
                    return [];
                }
                const figures = galleryDoc.getElementsByTagName("figure");
                if (null == figures || 0 === figures.length) {
                    Logger.logInfo(`No figures found at search on page "${pageNumber}".`);
                    return [];
                }
                return Array.from(figures);
            });
        }
    }
    var Browse_awaiter = function(thisArg, _arguments, P, generator) {
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
    class Browse {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/browse/";
        }
        get newBrowseOptions() {
            return new BrowseOptions;
        }
        static get newBrowseOptions() {
            return new BrowseOptions;
        }
        get BrowseOptions() {
            return BrowseOptions;
        }
        static get BrowseOptions() {
            return BrowseOptions;
        }
        getFiguresBetweenIds(fromId_1, toId_1, browseOptions_1, action_1) {
            return Browse_awaiter(this, arguments, void 0, function*(fromId, toId, browseOptions, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresTillId, [ toId, void 0, browseOptions, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresSinceId, [ fromId, void 0, browseOptions, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresBetweenIds, [ fromId, toId, void 0, void 0, browseOptions, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenIdsBetweenPages(fromId_1, toId_1, fromPageNumber_1, toPageNumber_1, browseOptions_1, action_1) {
            return Browse_awaiter(this, arguments, void 0, function*(fromId, toId, fromPageNumber, toPageNumber, browseOptions, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresTillId, [ toId, fromPageNumber, browseOptions, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresSinceId, [ fromId, toPageNumber, browseOptions, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresBetweenIds, [ fromId, toId, fromPageNumber, toPageNumber, browseOptions, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenPages(fromPageNumber_1, toPageNumber_1, browseOptions_1, action_1) {
            return Browse_awaiter(this, arguments, void 0, function*(fromPageNumber, toPageNumber, browseOptions, action, delay = 100) {
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresTillPage, [ toPageNumber, browseOptions, this._semaphore ], action, delay, true);
                } else if (null == toPageNumber || toPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresSincePage, [ fromPageNumber, browseOptions, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFiguresBetweenPages, [ fromPageNumber, toPageNumber, browseOptions, this._semaphore ], action, delay, true);
                }
            });
        }
        getFigures(pageNumber_1, browseOptions_1, action_1) {
            return Browse_awaiter(this, arguments, void 0, function*(pageNumber, browseOptions, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(SearchRequests.getBrowseFigures, [ pageNumber, browseOptions, this._semaphore ], action, delay);
            });
        }
        getPage(pageNumber_1, browseOptions_1, action_1) {
            return Browse_awaiter(this, arguments, void 0, function*(pageNumber, browseOptions, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(Page.getBrowsePage, [ pageNumber, browseOptions, this._semaphore ], action, delay);
            });
        }
    }
    class BrowseOptions {
        constructor() {
            this.ratingGeneral = true;
            this.ratingMature = true;
            this.ratingAdult = true;
            this.category = BrowseOptions.category.all;
            this.type = BrowseOptions.type.all;
            this.species = BrowseOptions.species.any;
            this.gender = BrowseOptions.gender.any;
            this.perPage = BrowseOptions.results[72];
        }
        static get category() {
            return {
                all: 1,
                "3d-models": 34,
                "artwork-digital": 2,
                "artwork-traditional": 3,
                "cel-shading": 4,
                crafting: 5,
                designs: 6,
                "food-recipes": 32,
                fursuiting: 8,
                icons: 9,
                mosaics: 10,
                photography: 11,
                "pixel-art": 36,
                sculpting: 12,
                "virtual-photography": 35,
                "2d-animation": 37,
                "3d-animation": 38,
                "pixel-animation": 39,
                flash: 7,
                "interactive-media": 40,
                story: 13,
                poetry: 14,
                prose: 15,
                music: 16,
                podcasts: 17,
                skins: 18,
                handhelds: 19,
                resources: 20,
                adoptables: 21,
                auctions: 22,
                contests: 23,
                "current-events": 24,
                desktops: 25,
                stockart: 26,
                screenshots: 27,
                scraps: 28,
                wallpaper: 29,
                "ych-sale": 30,
                other: 31
            };
        }
        static get type() {
            return {
                all: 1,
                abstract: 2,
                "animal-related-non-anthro": 3,
                anime: 4,
                comics: 5,
                doodle: 6,
                fanart: 7,
                fantasy: 8,
                human: 9,
                portraits: 10,
                scenery: 11,
                "still-life": 12,
                tutorials: 13,
                miscellaneous: 14,
                "general-furry-art": 100,
                abduction: 122,
                "baby-fur": 101,
                bondage: 102,
                digimon: 103,
                "fat-furs": 104,
                "fetish-other": 105,
                fursuit: 106,
                gore: 119,
                hyper: 107,
                hypnosis: 121,
                inflation: 108,
                micro: 109,
                muscle: 110,
                "my-little-pony": 111,
                paw: 112,
                pokemon: 113,
                pregnancy: 114,
                sonic: 115,
                transformation: 116,
                "tf-tg": 120,
                vore: 117,
                "water-sports": 118,
                techno: 201,
                trance: 202,
                house: 203,
                "90s": 204,
                "80s": 205,
                "70s": 206,
                "60s": 207,
                "pre-60s": 208,
                classical: 209,
                "game-music": 210,
                rock: 211,
                pop: 212,
                rap: 213,
                industrial: 214,
                "other-music": 200
            };
        }
        static get species() {
            return {
                any: 1,
                "airborne-vehicle": 10001,
                alien: 5001,
                amphibian: 1e3,
                aquatic: 2e3,
                avian: 3e3,
                bear: 6002,
                bovine: 6007,
                canine: 6017,
                cervine: 6018,
                dog: 6010,
                dragon: 4e3,
                equine: 10009,
                exotic: 5e3,
                feline: 6030,
                fox: 6075,
                slime: 10007,
                "hybrid-species": 10002,
                inanimate: 10006,
                insect: 8003,
                "land-vehicle": 10003,
                mammal: 6e3,
                marsupial: 6042,
                mustelid: 6051,
                plant: 10008,
                primate: 6058,
                reptilian: 7e3,
                robot: 10004,
                rodent: 6067,
                "sea-vehicle": 10005,
                taur: 5025,
                vulpine: 6015,
                "original-species": 11014,
                character: 11015,
                aeromorph: 11001,
                "angel-dragon": 11002,
                avali: 11012,
                chakat: 5003,
                citra: 5005,
                crux: 5006,
                dracat: 5009,
                dutch: 11003,
                felkin: 11011,
                ferrin: 11004,
                jogauni: 11005,
                langurhali: 5014,
                nevrean: 11006,
                protogen: 11007,
                rexouium: 11016,
                sergal: 5021,
                synx: 11010,
                wickerbeast: 11013,
                yinglet: 11009,
                zorgoia: 11008,
                angel: 12001,
                centaur: 12002,
                cerberus: 12003,
                "shape-shifter": 12038,
                chimera: 12004,
                chupacabra: 12005,
                cockatrice: 12006,
                daemon: 5007,
                demon: 12007,
                "displacer-beast": 12008,
                dragonborn: 12009,
                drow: 12010,
                dwarf: 12011,
                "eastern-dragon": 4001,
                elf: 5011,
                gargoyle: 5012,
                goblin: 12012,
                golem: 12013,
                gryphon: 3007,
                harpy: 12014,
                hellhound: 12015,
                hippogriff: 12016,
                hobbit: 12017,
                hydra: 4002,
                imp: 12018,
                incubus: 12019,
                jackalope: 12020,
                kirin: 12021,
                kitsune: 12022,
                kobold: 12023,
                lamia: 12024,
                manticore: 12025,
                minotaur: 12026,
                naga: 5016,
                nephilim: 12027,
                orc: 5018,
                pegasus: 12028,
                peryton: 12029,
                phoenix: 3010,
                sasquatch: 12030,
                satyr: 5020,
                sphinx: 12031,
                succubus: 12032,
                tiefling: 12033,
                troll: 12034,
                unicorn: 5023,
                "water-dragon": 12035,
                werewolf: 12036,
                "western-dragon": 4004,
                wyvern: 4005,
                yokai: 12037,
                alicorn: 13001,
                argonian: 5002,
                asari: 13002,
                bangaa: 13003,
                "bubble-dragon": 13004,
                burmecian: 13005,
                charr: 13006,
                chiss: 13007,
                chocobo: 5004,
                deathclaw: 13008,
                digimon: 5008,
                draenei: 5010,
                drell: 13009,
                elcor: 13010,
                ewok: 13011,
                hanar: 13012,
                hrothgar: 13013,
                iksar: 5013,
                kaiju: 5015,
                kelpie: 13041,
                kemonomimi: 13014,
                khajiit: 13015,
                koopa: 13016,
                krogan: 13017,
                lombax: 13018,
                mimiga: 13019,
                mobian: 13020,
                moogle: 5017,
                neopet: 13021,
                "nu-mou": 13022,
                pokemon: 5019,
                "pony-mlp": 13023,
                protoss: 13024,
                quarian: 13025,
                ronso: 13026,
                salarian: 13027,
                sangheili: 13028,
                tauntaun: 13029,
                tauren: 13030,
                trandoshan: 13031,
                transformer: 13032,
                turian: 13033,
                twilek: 13034,
                viera: 13035,
                wookiee: 13036,
                xenomorph: 5024,
                yautja: 13037,
                yordle: 13038,
                yoshi: 13039,
                zerg: 13040,
                aardvark: 14001,
                aardwolf: 14002,
                "african-wild-dog": 14003,
                akita: 14004,
                albatross: 14005,
                crocodile: 7001,
                alpaca: 14006,
                anaconda: 14007,
                anteater: 14008,
                antelope: 6004,
                arachnid: 8e3,
                "arctic-fox": 14009,
                armadillo: 14010,
                axolotl: 14011,
                baboon: 14012,
                badger: 6045,
                bat: 6001,
                beaver: 6064,
                bee: 14013,
                binturong: 14014,
                bison: 14015,
                "blue-jay": 14016,
                "border-collie": 14017,
                "brown-bear": 14018,
                buffalo: 14019,
                "buffalo-bison": 14020,
                "bull-terrier": 14021,
                butterfly: 14022,
                caiman: 14023,
                camel: 6074,
                capybara: 14024,
                caribou: 14025,
                caterpillar: 14026,
                cephalopod: 2001,
                chameleon: 14027,
                cheetah: 6021,
                chicken: 14028,
                chimpanzee: 14029,
                chinchilla: 14030,
                chipmunk: 14031,
                civet: 14032,
                "clouded-leopard": 14033,
                coatimundi: 14034,
                cockatiel: 14035,
                corgi: 14036,
                corvid: 3001,
                cougar: 6022,
                cow: 6003,
                coyote: 6008,
                crab: 14037,
                crane: 14038,
                crayfish: 14039,
                crow: 3002,
                crustacean: 14040,
                dalmatian: 14041,
                deer: 14042,
                dhole: 14043,
                dingo: 6011,
                dinosaur: 8001,
                doberman: 6009,
                dolphin: 2002,
                donkey: 6019,
                duck: 3003,
                eagle: 3004,
                eel: 14044,
                elephant: 14045,
                falcon: 3005,
                fennec: 6072,
                ferret: 6046,
                finch: 14046,
                fish: 2005,
                flamingo: 14047,
                fossa: 14048,
                frog: 1001,
                gazelle: 6005,
                gecko: 7003,
                genet: 14049,
                "german-shepherd": 6012,
                gibbon: 14050,
                giraffe: 6031,
                goat: 6006,
                goose: 3006,
                gorilla: 6054,
                "gray-fox": 14051,
                "great-dane": 14052,
                "grizzly-bear": 14053,
                "guinea-pig": 14054,
                hamster: 14055,
                hawk: 3008,
                hedgehog: 6032,
                heron: 14056,
                hippopotamus: 6033,
                honeybee: 14057,
                horse: 6034,
                housecat: 6020,
                human: 6055,
                humanoid: 14058,
                hummingbird: 14059,
                husky: 6014,
                hyena: 6035,
                iguana: 7004,
                impala: 14060,
                jackal: 6013,
                jaguar: 6023,
                kangaroo: 6038,
                "kangaroo-mouse": 14061,
                "kangaroo-rat": 14062,
                kinkajou: 14063,
                "kit-fox": 14064,
                koala: 6039,
                "kodiak-bear": 14065,
                "komodo-dragon": 14066,
                labrador: 14067,
                lemur: 6056,
                leopard: 6024,
                liger: 14068,
                linsang: 14069,
                lion: 6025,
                lizard: 7005,
                llama: 6036,
                lobster: 14070,
                "longhair-cat": 14071,
                lynx: 6026,
                magpie: 14072,
                "maine-coon": 14073,
                malamute: 14074,
                "mammal-feline": 14075,
                "mammal-herd": 14076,
                "mammal-marsupial": 14077,
                "mammal-mustelid": 14078,
                "mammal-other predator": 14079,
                "mammal-prey": 14080,
                "mammal-primate": 14081,
                "mammal-rodent": 14082,
                manatee: 14083,
                mandrill: 14084,
                "maned-wolf": 14085,
                mantid: 8004,
                marmoset: 14086,
                marten: 14087,
                meerkat: 6043,
                mink: 6048,
                mole: 14088,
                mongoose: 6044,
                "monitor-lizard": 14089,
                monkey: 6057,
                moose: 14090,
                moth: 14091,
                mouse: 6065,
                "musk-deer": 14092,
                "musk-ox": 14093,
                newt: 1002,
                ocelot: 6027,
                octopus: 14094,
                okapi: 14095,
                olingo: 14096,
                opossum: 6037,
                orangutan: 14097,
                orca: 14098,
                oryx: 14099,
                ostrich: 14100,
                otter: 6047,
                owl: 3009,
                panda: 6052,
                pangolin: 14101,
                panther: 6028,
                parakeet: 14102,
                parrot: 14103,
                peacock: 14104,
                penguin: 14105,
                "persian-cat": 14106,
                pig: 6053,
                pigeon: 14107,
                pika: 14108,
                "pine-marten": 14109,
                platypus: 14110,
                "polar-bear": 14111,
                pony: 6073,
                poodle: 14112,
                porcupine: 14113,
                porpoise: 2004,
                procyonid: 14114,
                puffin: 14115,
                quoll: 6040,
                rabbit: 6059,
                raccoon: 6060,
                rat: 6061,
                ray: 14116,
                "red-fox": 14117,
                "red-panda": 6062,
                reindeer: 14118,
                reptillian: 14119,
                rhinoceros: 6063,
                robin: 14120,
                rottweiler: 14121,
                sabercats: 14122,
                sabertooth: 14123,
                salamander: 1003,
                scorpion: 8005,
                seagull: 14124,
                seahorse: 14125,
                seal: 6068,
                "secretary-bird": 14126,
                "serpent-dragon": 4003,
                serval: 14127,
                shark: 2006,
                sheep: 14128,
                "shiba-inu": 14129,
                "shorthair-cat": 14130,
                shrew: 14131,
                siamese: 14132,
                sifaka: 14133,
                "silver-fox": 14134,
                skunk: 6069,
                sloth: 14135,
                snail: 14136,
                "snake-serpent": 7006,
                "snow-leopard": 14137,
                sparrow: 14138,
                squid: 14139,
                squirrel: 6070,
                stoat: 14140,
                stork: 14141,
                "sugar-glider": 14142,
                "sun-bear": 14143,
                swan: 3011,
                "swift-fox": 14144,
                tanuki: 5022,
                tapir: 14145,
                "tasmanian-devil": 14146,
                thylacine: 14147,
                tiger: 6029,
                toucan: 14148,
                turtle: 7007,
                vulture: 14149,
                wallaby: 6041,
                walrus: 14150,
                wasp: 14151,
                weasel: 6049,
                whale: 2003,
                wolf: 6016,
                wolverine: 6050,
                zebra: 6071
            };
        }
        static get gender() {
            return {
                any: "",
                male: "male",
                female: "female",
                "trans-male": "trans_male",
                "trans-female": "trans_female",
                intersex: "intersex",
                "non-binary": "non_binary"
            };
        }
        static get results() {
            return {
                24: 24,
                48: 48,
                72: 72,
                96: 96,
                128: 128
            };
        }
    }
    function checkTags(element) {
        var _a;
        if (!("1" === document.body.getAttribute("data-user-logged-in"))) {
            Logger.logWarning("User is not logged in, skipping tag check");
            setBlockedState(element, false);
            return;
        }
        const tagsHideMissingTags = "1" === document.body.getAttribute("data-tag-blocklist-hide-tagless");
        const tags = null === (_a = element.getAttribute("data-tags")) || void 0 === _a ? void 0 : _a.trim().split(/\s+/);
        let blockReason = "";
        if (null != tags && tags.length > 0 && "" !== tags[0]) {
            const blockedTags = function getBannedTags(tags) {
                var _a;
                const blockedTags = null !== (_a = document.body.getAttribute("data-tag-blocklist")) && void 0 !== _a ? _a : "";
                const tagsBlocklist = Array.from(blockedTags.split(" "));
                let bTags = [];
                if (null == tags || 0 === tags.length) {
                    return [];
                }
                for (const tag of tags) {
                    for (const blockedTag of tagsBlocklist) {
                        if (tag === blockedTag) {
                            bTags.push(blockedTag);
                        }
                    }
                }
                return [ ...new Set(bTags) ];
            }(tags);
            if (blockedTags.length <= 0) {
                setBlockedState(element, false);
            } else {
                setBlockedState(element, true);
                Logger.logInfo(`${element.id} blocked tags: ${blockedTags.join(", ")}`);
                blockReason = "Blocked tags:\n";
                for (const tag of blockedTags) {
                    blockReason += "• " + tag + "\n";
                }
            }
        } else {
            setBlockedState(element, tagsHideMissingTags);
            if (tagsHideMissingTags) {
                blockReason = "Content is missing tags.";
            }
        }
        if ("" !== blockReason && "submissionImg" !== element.id) {
            element.setAttribute("title", blockReason);
        }
    }
    function setBlockedState(element, isBlocked) {
        element.classList[isBlocked ? "add" : "remove"]("blocked-content");
    }
    function checkTagsAll(doc) {
        if (null == doc) {
            return;
        }
        doc.querySelectorAll("img[data-tags]").forEach(element => checkTags(element));
    }
    var Page_awaiter = function(thisArg, _arguments, P, generator) {
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
    class Page {
        static getGalleryPage(username, folderId, pageNumber, galleryType, semaphore) {
            return Page_awaiter(this, void 0, void 0, function*() {
                if (galleryType === GalleryType.FAVORITES) {
                    const dataFavId = null !== folderId && void 0 !== folderId ? folderId : pageNumber;
                    return yield Page.getFavoritesPage(username, dataFavId, pageNumber, semaphore);
                } else if (galleryType === GalleryType.JOURNALS) {
                    return yield Page.getJournalsPage(username, pageNumber, semaphore);
                } else if (galleryType === GalleryType.BROWSE) {
                    return yield Page.getBrowsePage(pageNumber, void 0, semaphore);
                } else if (galleryType === GalleryType.SEARCH) {
                    return yield Page.getSearchPage(pageNumber, void 0, semaphore);
                }
                if (null == username) {
                    Logger.logError("No username given");
                    return;
                }
                if (null == pageNumber || pageNumber <= 0) {
                    Logger.logWarning("No page number given. Using default value of 1.");
                    pageNumber = 1;
                }
                let url;
                if (!username.endsWith("/")) {
                    username += "/";
                }
                switch (galleryType) {
                  case GalleryType.GALLERY:
                    url = Gallery.hardLink + username;
                    break;

                  case GalleryType.SCRAPS:
                    url = Scraps.hardLink + username;
                }
                if (null != folderId && -1 !== folderId) {
                    url += `folder/${folderId}/`;
                }
                const page = yield FuraffinityRequests.getHTML(url + pageNumber, semaphore);
                checkTagsAll(page);
                return page;
            });
        }
        static getFavoritesPage(username, dataFavId, direction, semaphore) {
            return Page_awaiter(this, void 0, void 0, function*() {
                if (null == username) {
                    Logger.logError("No username given");
                    return;
                }
                if (null == direction) {
                    Logger.logWarning("No direction given. Using default 1 instead.");
                    direction = 1;
                }
                if (!username.endsWith("/")) {
                    username += "/";
                }
                let url = Favorites.hardLink;
                if (null != dataFavId && dataFavId >= 0) {
                    url += `${username}${dataFavId}/`;
                } else {
                    Logger.logWarning("No last data fav id given. Using default 1 instead.");
                    url += username;
                }
                if (direction >= 0) {
                    url += "next/";
                } else {
                    url += "prev/";
                }
                const page = yield FuraffinityRequests.getHTML(url, semaphore);
                checkTagsAll(page);
                return page;
            });
        }
        static getJournalsPage(username, pageNumber, semaphore) {
            return Page_awaiter(this, void 0, void 0, function*() {
                if (null == username) {
                    Logger.logError("No username given");
                    return;
                }
                if (null == pageNumber || pageNumber <= 0) {
                    Logger.logWarning("Page number must be greater than 0. Using default 1 instead.");
                    pageNumber = 1;
                }
                if (!username.endsWith("/")) {
                    username += "/";
                }
                const url = Journals.hardLink + username;
                return yield FuraffinityRequests.getHTML(url + pageNumber, semaphore);
            });
        }
        static getBrowsePage(pageNumber, browseOptions, semaphore) {
            return Page_awaiter(this, void 0, void 0, function*() {
                if (null == pageNumber || pageNumber <= 0) {
                    Logger.logWarning("Page number must be greater than 0. Using default 1 instead.");
                    pageNumber = 1;
                }
                if (null == browseOptions) {
                    browseOptions = new BrowseOptions;
                }
                const payload = {
                    cat: browseOptions.category,
                    atype: browseOptions.type,
                    species: browseOptions.species,
                    gender: browseOptions.gender,
                    perpage: browseOptions.perPage,
                    page: pageNumber,
                    rating_general: browseOptions.ratingGeneral ? "on" : "off",
                    rating_mature: browseOptions.ratingMature ? "on" : "off",
                    rating_adult: browseOptions.ratingAdult ? "on" : "off"
                };
                for (const key in payload) {
                    if (null == payload[key] || 0 === payload[key] || "off" === payload[key]) {
                        delete payload[key];
                    }
                }
                const payloadArray = Object.entries(payload).map(([key, value]) => {
                    var _a;
                    return [ key, null !== (_a = null === value || void 0 === value ? void 0 : value.toString()) && void 0 !== _a ? _a : "" ];
                });
                const url = Browse.hardLink;
                const page = yield FuraffinityRequests.postHTML(url, payloadArray, semaphore);
                checkTagsAll(page);
                return page;
            });
        }
        static getSearchPage(pageNumber, searchOptions, semaphore) {
            return Page_awaiter(this, void 0, void 0, function*() {
                if (null == pageNumber || pageNumber <= 0) {
                    Logger.logWarning("Page number must be greater than 0. Using default 1 instead.");
                    pageNumber = 1;
                }
                if (null == searchOptions) {
                    searchOptions = new SearchOptions;
                }
                const payload = {
                    page: pageNumber,
                    q: searchOptions.input,
                    perpage: searchOptions.perPage,
                    "order-by": searchOptions.orderBy,
                    "order-direction": searchOptions.orderDirection,
                    category: searchOptions.category,
                    arttype: searchOptions.type,
                    species: searchOptions.species,
                    range: searchOptions.range,
                    range_from: void 0,
                    range_to: void 0,
                    "rating-general": searchOptions.ratingGeneral ? 1 : 0,
                    "rating-mature": searchOptions.ratingMature ? 1 : 0,
                    "rating-adult": searchOptions.ratingAdult ? 1 : 0,
                    "type-art": searchOptions.typeArt ? 1 : 0,
                    "type-music": searchOptions.typeMusic ? 1 : 0,
                    "type-flash": searchOptions.typeFlash ? 1 : 0,
                    "type-story": searchOptions.typeStory ? 1 : 0,
                    "type-photos": searchOptions.typePhotos ? 1 : 0,
                    "type-poetry": searchOptions.typePoetry ? 1 : 0,
                    mode: searchOptions.matching
                };
                if (searchOptions.rangeFrom instanceof Date && null != searchOptions.rangeFrom) {
                    const formattedDate = `${searchOptions.rangeFrom.getFullYear()}-${(searchOptions.rangeFrom.getMonth() + 1).toString().padStart(2, "0")}-${searchOptions.rangeFrom.getDate().toString().padStart(2, "0")}`;
                    payload.range_from = formattedDate;
                } else if ("string" == typeof searchOptions.rangeFrom && searchOptions.rangeFrom) {
                    payload.range_from = searchOptions.rangeFrom;
                }
                if (searchOptions.rangeTo instanceof Date && null != searchOptions.rangeTo) {
                    const formattedDate = `${searchOptions.rangeTo.getFullYear()}-${(searchOptions.rangeTo.getMonth() + 1).toString().padStart(2, "0")}-${searchOptions.rangeTo.getDate().toString().padStart(2, "0")}`;
                    payload.range_to = formattedDate;
                } else if ("string" == typeof searchOptions.rangeTo && searchOptions.rangeTo) {
                    payload.range_to = searchOptions.rangeTo;
                }
                for (const key in payload) {
                    if (null == payload[key] || 0 === payload[key] || "off" === payload[key]) {
                        delete payload[key];
                    }
                }
                const payloadArray = Object.entries(payload).map(([key, value]) => {
                    var _a;
                    return [ key, null !== (_a = null === value || void 0 === value ? void 0 : value.toString()) && void 0 !== _a ? _a : "" ];
                });
                const url = Search.hardLink;
                const page = yield FuraffinityRequests.postHTML(url, payloadArray, semaphore);
                checkTagsAll(page);
                return page;
            });
        }
    }
    var Gallery_awaiter = function(thisArg, _arguments, P, generator) {
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
    class Gallery {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/gallery/";
        }
        getSubmissionPageNo(username_1, submissionId_1, folderId_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, submissionId, folderId, fromPageNumber, toPageNumber, action, delay = 100) {
                submissionId = convertToNumber(submissionId);
                folderId = convertToNumber(folderId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getSubmissionPageNo, [ username, submissionId, folderId, fromPageNumber, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
            });
        }
        getFiguresBetweenIds(username_1, fromId_1, toId_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, fromId, toId, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillId, [ username, void 0, toId, void 0, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSinceId, [ username, void 0, fromId, void 0, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenIds, [ username, void 0, fromId, toId, void 0, void 0, GalleryType.GALLERY, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresInFolderBetweenIds(username_1, folderId_1, fromId_1, toId_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, folderId, fromId, toId, action, delay = 100) {
                folderId = convertToNumber(folderId);
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillId, [ username, folderId, toId, void 0, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSinceId, [ username, folderId, fromId, void 0, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenIds, [ username, folderId, fromId, toId, void 0, void 0, GalleryType.GALLERY, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenIdsBetweenPages(username_1, fromId_1, toId_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, fromId, toId, fromPageNumber, toPageNumber, action, delay = 100) {
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillId, [ username, void 0, toId, fromPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSinceId, [ username, void 0, fromId, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenIds, [ username, void 0, fromId, toId, fromPageNumber, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresInFolderBetweenIdsBetweenPages(username_1, folderId_1, fromId_1, toId_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, folderId, fromId, toId, fromPageNumber, toPageNumber, action, delay = 100) {
                folderId = convertToNumber(folderId);
                fromId = convertToNumber(fromId);
                toId = convertToNumber(toId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromId || fromId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillId, [ username, folderId, toId, fromPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else if (null == toId || toId <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSinceId, [ username, folderId, fromId, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenIds, [ username, folderId, fromId, toId, fromPageNumber, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresBetweenPages(username_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, fromPageNumber, toPageNumber, action, delay = 100) {
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillPage, [ username, void 0, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay, true);
                } else if (null == toPageNumber || toPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSincePage, [ username, void 0, fromPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenPages, [ username, void 0, fromPageNumber, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay, true);
                }
            });
        }
        getFiguresInFolderBetweenPages(username_1, folderId_1, fromPageNumber_1, toPageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, folderId, fromPageNumber, toPageNumber, action, delay = 100) {
                folderId = convertToNumber(folderId);
                fromPageNumber = convertToNumber(fromPageNumber);
                toPageNumber = convertToNumber(toPageNumber);
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresTillPage, [ username, folderId, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay, true);
                } else if (null == toPageNumber || toPageNumber <= 0) {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresSincePage, [ username, folderId, fromPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
                } else {
                    return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFiguresBetweenPages, [ username, folderId, fromPageNumber, toPageNumber, GalleryType.GALLERY, this._semaphore ], action, delay, true);
                }
            });
        }
        getFigures(username_1, pageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, pageNumber, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFigures, [ username, void 0, pageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
            });
        }
        getFiguresInFolder(username_1, folderId_1, pageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, folderId, pageNumber, action, delay = 100) {
                folderId = convertToNumber(folderId);
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(GalleryRequests.getGalleryFigures, [ username, folderId, pageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
            });
        }
        getPage(username_1, pageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, pageNumber, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(Page.getGalleryPage, [ username, void 0, pageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
            });
        }
        getPageInFolder(username_1, folderId_1, pageNumber_1, action_1) {
            return Gallery_awaiter(this, arguments, void 0, function*(username, folderId, pageNumber, action, delay = 100) {
                folderId = convertToNumber(folderId);
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(Page.getGalleryPage, [ username, folderId, pageNumber, GalleryType.GALLERY, this._semaphore ], action, delay);
            });
        }
    }
    var GalleryRequests_awaiter = function(thisArg, _arguments, P, generator) {
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
    class GalleryRequests {
        constructor(semaphore) {
            this._semaphore = semaphore;
            this.Gallery = new Gallery(this._semaphore);
            this.Scraps = new Scraps(this._semaphore);
            this.Favorites = new Favorites(this._semaphore);
            this.Journals = new Journals(this._semaphore);
        }
        static getSubmissionPageNo(username, submissionId, folderId, fromPageNumber, toPageNumber, galleryType, semaphore, percentId) {
            return GalleryRequests_awaiter(this, void 0, void 0, function*() {
                if (null == submissionId || submissionId <= 0) {
                    Logger.logError("No submissionId given");
                    return -1;
                }
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                    fromPageNumber = 1;
                }
                if (null == toPageNumber || 0 === toPageNumber) {
                    Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                    toPageNumber = 1;
                } else if (toPageNumber < 0) {
                    toPageNumber = Number.MAX_SAFE_INTEGER;
                }
                const direction = fromPageNumber <= toPageNumber ? 1 : -1;
                const totalPages = Math.abs(toPageNumber - fromPageNumber) + 1;
                let completedPages = 0;
                for (let i = fromPageNumber; i <= toPageNumber; i += direction) {
                    const figures = yield GalleryRequests.getGalleryFigures(username, folderId, i, galleryType, semaphore);
                    if (0 === figures.length) {
                        i = toPageNumber;
                    } else {
                        if (null != figures.find(figure => figure.id.trimStart("sid-") === submissionId.toString())) {
                            return i;
                        }
                    }
                    completedPages++;
                    PercentHelper.updatePercentValue(percentId, completedPages, totalPages);
                }
                return -1;
            });
        }
        static getGalleryFiguresTillId(username, folderId, toId, fromPage, galleryType, semaphore) {
            return GalleryRequests_awaiter(this, void 0, void 0, function*() {
                if (null == toId || toId <= 0) {
                    Logger.logError("No toId given");
                    return [];
                }
                const allFigures = [];
                let running = true;
                let i = 1;
                if (null != fromPage && fromPage >= 1) {
                    i = fromPage;
                }
                for (;running; ) {
                    const figures = yield GalleryRequests.getGalleryFigures(username, folderId, i, galleryType, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else if (IdArray.containsId(figures, toId)) {
                        allFigures.push(IdArray.getTillId(figures, toId));
                        running = false;
                    } else {
                        allFigures.push(figures);
                        i++;
                    }
                }
                return allFigures;
            });
        }
        static getGalleryFiguresSinceId(username, folderId, fromId, toPage, galleryType, semaphore) {
            return GalleryRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromId || fromId <= 0) {
                    Logger.logError("No fromId given");
                    return [];
                }
                const direction = null == toPage || toPage <= 0 ? -1 : 1;
                let lastFigureId;
                let running = true;
                let i = null == toPage || toPage <= 0 ? 1 : toPage;
                if (null == toPage || toPage <= 0) {
                    for (;running; ) {
                        const figures = yield GalleryRequests.getGalleryFigures(username, folderId, i, galleryType, semaphore);
                        let currFigureId = lastFigureId;
                        if (0 !== figures.length) {
                            currFigureId = figures[0].id;
                        }
                        if (currFigureId === lastFigureId) {
                            running = false;
                        } else if (IdArray.containsId(figures, fromId)) {
                            running = false;
                        } else {
                            i++;
                        }
                    }
                }
                const allFigures = [];
                lastFigureId = void 0;
                running = true;
                for (;running; ) {
                    const figures = yield GalleryRequests.getGalleryFigures(username, folderId, i, galleryType, semaphore);
                    let currFigureId = lastFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (currFigureId === lastFigureId) {
                        running = false;
                    } else {
                        if (IdArray.containsId(figures, fromId)) {
                            const figuresPush = IdArray.getSinceId(figures, fromId);
                            if (direction < 0) {
                                figuresPush.reverse();
                                running = false;
                            }
                            allFigures.push(figuresPush);
                        } else {
                            if (direction < 0) {
                                figures.reverse();
                            }
                            allFigures.push(figures);
                        }
                        i += direction;
                    }
                }
                if (direction < 0) {
                    allFigures.reverse();
                }
                return allFigures;
            });
        }
        static getGalleryFiguresBetweenIds(username, folderId, fromId, toId, fromPage, toPage, galleryType, semaphore, percentId) {
            return GalleryRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromId || fromId <= 0) {
                    Logger.logError("No fromId given");
                    return [];
                }
                if (null == toId || toId <= 0) {
                    Logger.logError("No toId given");
                    return [];
                }
                if (null == fromPage || fromPage <= 0 || null == toPage || toPage <= 1) {
                    Logger.logWarning("No fromPage or toPage given. Percentages can not be calculated.");
                    percentId = void 0;
                }
                let i = 1;
                if (null != fromPage && fromPage >= 1) {
                    i = fromPage;
                }
                const allFigures = [];
                let running = true;
                let completedPages = 0;
                for (;running; ) {
                    if (null != toPage && toPage >= 1 && i >= toPage) {
                        running = false;
                    }
                    const figures = yield GalleryRequests.getGalleryFigures(username, folderId, i, galleryType, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else {
                        if (IdArray.containsId(figures, fromId)) {
                            allFigures.push(IdArray.getSinceId(figures, fromId));
                        }
                        if (IdArray.containsId(figures, toId)) {
                            allFigures.push(IdArray.getBetweenIds(figures, fromId, toId));
                            running = false;
                        } else {
                            allFigures.push(figures);
                            i++;
                        }
                    }
                    completedPages++;
                    if (null != toPage && toPage >= 1) {
                        PercentHelper.updatePercentValue(percentId, completedPages, toPage);
                    }
                }
                return allFigures;
            });
        }
        static getGalleryFiguresTillPage(username, folderId, toPageNumber, galleryType, semaphore, percentId) {
            return GalleryRequests_awaiter(this, void 0, void 0, function*() {
                if (null == toPageNumber || 0 === toPageNumber) {
                    Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                    toPageNumber = 1;
                } else if (toPageNumber < 0) {
                    toPageNumber = Number.MAX_SAFE_INTEGER;
                }
                const allFigures = [];
                let completedPages = 0;
                for (let i = 1; i <= toPageNumber; i++) {
                    const figures = yield GalleryRequests.getGalleryFigures(username, folderId, i, galleryType, semaphore);
                    if (0 === figures.length) {
                        i = toPageNumber;
                    } else {
                        allFigures.push(figures);
                    }
                    completedPages++;
                    PercentHelper.updatePercentValue(percentId, completedPages, toPageNumber);
                }
                return allFigures;
            });
        }
        static getGalleryFiguresSincePage(username, folderId, fromPageNumber, galleryType, semaphore) {
            return GalleryRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                    fromPageNumber = 1;
                }
                const allFigures = [];
                let running = true;
                let i = fromPageNumber;
                for (;running; ) {
                    const figures = yield GalleryRequests.getGalleryFigures(username, folderId, i, galleryType, semaphore);
                    let currFigureId;
                    if (0 !== figures.length) {
                        currFigureId = figures[0].id;
                    }
                    if (undefined === currFigureId) {
                        running = false;
                    } else {
                        allFigures.push(figures);
                        i++;
                    }
                }
                return allFigures;
            });
        }
        static getGalleryFiguresBetweenPages(username, folderId, fromPageNumber, toPageNumber, galleryType, semaphore, percentId) {
            return GalleryRequests_awaiter(this, void 0, void 0, function*() {
                if (null == fromPageNumber || fromPageNumber <= 0) {
                    Logger.logWarning("fromPageNumber must be greater than 0. Using default 1 instead.");
                    fromPageNumber = 1;
                }
                if (null == toPageNumber || 0 === toPageNumber) {
                    Logger.logWarning("toPageNumber must be greater than 0. Using default 1 instead.");
                    toPageNumber = 1;
                } else if (toPageNumber < 0) {
                    toPageNumber = Number.MAX_SAFE_INTEGER;
                }
                const allFigures = [];
                const direction = fromPageNumber <= toPageNumber ? 1 : -1;
                const totalPages = Math.abs(toPageNumber - fromPageNumber) + 1;
                let completedPages = 0;
                for (let i = fromPageNumber; i <= toPageNumber; i += direction) {
                    const figures = yield GalleryRequests.getGalleryFigures(username, folderId, i, galleryType, semaphore);
                    if (0 === figures.length) {
                        i = toPageNumber;
                    } else {
                        allFigures.push(figures);
                    }
                    completedPages++;
                    PercentHelper.updatePercentValue(percentId, completedPages, totalPages);
                }
                return allFigures;
            });
        }
        static getGalleryFigures(username, folderId, pageNumber, galleryType, semaphore) {
            return GalleryRequests_awaiter(this, void 0, void 0, function*() {
                if (null == pageNumber || pageNumber <= 0) {
                    Logger.logWarning("No pageNumber given. Using default value of 1.");
                    pageNumber = 1;
                }
                if (null == folderId || folderId <= 0) {
                    Logger.logInfo(`Getting ${galleryType} of "${username}" on page "${pageNumber}".`);
                } else {
                    Logger.logInfo(`Getting ${galleryType} of "${username}" in folder "${folderId}" on page "${pageNumber}".`);
                }
                const galleryDoc = yield Page.getGalleryPage(username, folderId, pageNumber, galleryType, semaphore);
                if (!galleryDoc || !(galleryDoc instanceof Document) || galleryDoc.getElementById("no-images")) {
                    Logger.logInfo(`No images found at ${galleryType} of "${username}" on page "${pageNumber}".`);
                    return [];
                }
                const figures = galleryDoc.getElementsByTagName("figure");
                if (null == figures || 0 === figures.length) {
                    Logger.logInfo(`No figures found at ${galleryType} of "${username}" on page "${pageNumber}".`);
                    return [];
                }
                return Array.from(figures);
            });
        }
    }
    var GalleryType;
    !function(GalleryType) {
        GalleryType.GALLERY = "gallery";
        GalleryType.FAVORITES = "favorites";
        GalleryType.SCRAPS = "scraps";
        GalleryType.JOURNALS = "journals";
        GalleryType.BROWSE = "browse";
        GalleryType.SEARCH = "search";
    }(GalleryType || (GalleryType = {}));
    var UserRequests_awaiter = function(thisArg, _arguments, P, generator) {
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
    class UserRequests {
        constructor(semaphore) {
            this._semaphore = semaphore;
            this.GalleryRequests = new GalleryRequests(this._semaphore);
            this.SearchRequests = new SearchRequests(this._semaphore);
        }
        static get hardLinks() {
            return {
                user: FuraffinityRequests.fullUrl + "/user/",
                watch: FuraffinityRequests.fullUrl + "/watch/",
                unwatch: FuraffinityRequests.fullUrl + "/unwatch/",
                block: FuraffinityRequests.fullUrl + "/block/",
                unblock: FuraffinityRequests.fullUrl + "/unblock/"
            };
        }
        getUserPage(username_1, action_1) {
            return UserRequests_awaiter(this, arguments, void 0, function*(username, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(getUserPageLocal, [ username, this._semaphore ], action, delay);
            });
        }
        watchUser(username_1, watchKey_1, action_1) {
            return UserRequests_awaiter(this, arguments, void 0, function*(username, watchKey, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(watchUserLocal, [ username, watchKey, this._semaphore ], action, delay);
            });
        }
        unwatchUser(username_1, unwatchKey_1, action_1) {
            return UserRequests_awaiter(this, arguments, void 0, function*(username, unwatchKey, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(unwatchUserLocal, [ username, unwatchKey, this._semaphore ], action, delay);
            });
        }
        blockUser(username_1, blockKey_1, action_1) {
            return UserRequests_awaiter(this, arguments, void 0, function*(username, blockKey, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(blockUserLocal, [ username, blockKey, this._semaphore ], action, delay);
            });
        }
        unblockUser(username_1, unblockKey_1, action_1) {
            return UserRequests_awaiter(this, arguments, void 0, function*(username, unblockKey, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(unblockUserLocal, [ username, unblockKey, this._semaphore ], action, delay);
            });
        }
    }
    function getUserPageLocal(username, semaphore) {
        return UserRequests_awaiter(this, void 0, void 0, function*() {
            if (null == username) {
                Logger.logWarning("No username given");
                return;
            }
            const url = UserRequests.hardLinks.user + username;
            return yield FuraffinityRequests.getHTML(url, semaphore);
        });
    }
    function watchUserLocal(username, watchKey, semaphore) {
        return UserRequests_awaiter(this, void 0, void 0, function*() {
            if (null == username || "" === username) {
                Logger.logError("No username given");
                return false;
            }
            if (null == watchKey || "" === watchKey || -1 === watchKey) {
                Logger.logError("No watch key given");
                return false;
            }
            const url = UserRequests.hardLinks.watch + username + "?key=" + watchKey;
            return null == (yield FuraffinityRequests.getHTML(url, semaphore));
        });
    }
    function unwatchUserLocal(username, unwatchKey, semaphore) {
        return UserRequests_awaiter(this, void 0, void 0, function*() {
            if (null == username || "" === username) {
                Logger.logError("No username given");
                return false;
            }
            if (null == unwatchKey || "" === unwatchKey || -1 === unwatchKey) {
                Logger.logError("No unwatch key given");
                return false;
            }
            const url = UserRequests.hardLinks.unwatch + username + "?key=" + unwatchKey;
            return null == (yield FuraffinityRequests.getHTML(url, semaphore));
        });
    }
    function blockUserLocal(username, blockKey, semaphore) {
        return UserRequests_awaiter(this, void 0, void 0, function*() {
            if (null == username || "" === username) {
                Logger.logError("No username given");
                return false;
            }
            if (null == blockKey || "" === blockKey || -1 === blockKey) {
                Logger.logError("No block key given");
                return false;
            }
            const url = UserRequests.hardLinks.block + username + "?key=" + blockKey;
            return null == (yield FuraffinityRequests.getHTML(url, semaphore));
        });
    }
    function unblockUserLocal(username, unblockKey, semaphore) {
        return UserRequests_awaiter(this, void 0, void 0, function*() {
            if (null == username || "" === username) {
                Logger.logError("No username given");
                return false;
            }
            if (null == unblockKey || "" === unblockKey || -1 === unblockKey) {
                Logger.logError("No unblock key given");
                return false;
            }
            const url = UserRequests.hardLinks.unblock + username + "?key=" + unblockKey;
            return null == (yield FuraffinityRequests.getHTML(url, semaphore));
        });
    }
    var NewSubmissions_awaiter = function(thisArg, _arguments, P, generator) {
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
    class NewSubmissions {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/msg/submissions/";
        }
        getSubmissionsPage(firstSubmissionId_1, action_1) {
            return NewSubmissions_awaiter(this, arguments, void 0, function*(firstSubmissionId, action, delay = 100) {
                firstSubmissionId = convertToNumber(firstSubmissionId);
                return yield WaitAndCallAction.callFunctionAsync(getSubmissionsPageLocal, [ firstSubmissionId, this._semaphore ], action, delay);
            });
        }
        removeSubmissions(submissionIds_1, action_1) {
            return NewSubmissions_awaiter(this, arguments, void 0, function*(submissionIds, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(removeSubmissionsLocal, [ submissionIds, this._semaphore ], action, delay);
            });
        }
        nukeSubmissions(action_1) {
            return NewSubmissions_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(nukeSubmissionsLocal, [ this._semaphore ], action, delay);
            });
        }
    }
    function getSubmissionsPageLocal(firstSubmissionId, semaphore) {
        return NewSubmissions_awaiter(this, void 0, void 0, function*() {
            if (null == firstSubmissionId || firstSubmissionId <= 0) {
                return yield FuraffinityRequests.getHTML(`${NewSubmissions.hardLink}new@72/`, semaphore);
            } else {
                return yield FuraffinityRequests.getHTML(`${NewSubmissions.hardLink}new~${firstSubmissionId}@72/`, semaphore);
            }
        });
    }
    function removeSubmissionsLocal(submissionIds, semaphore) {
        return NewSubmissions_awaiter(this, void 0, void 0, function*() {
            if (null == submissionIds || 0 === submissionIds.length) {
                Logger.logError("No submission ids to remove");
                return;
            }
            const payload = [ [ "messagecenter-action", Message.hardActions.remove ] ];
            for (const submissionId of submissionIds) {
                payload.push([ "submissions[]", submissionId.toString() ]);
            }
            return yield FuraffinityRequests.postHTML(`${NewSubmissions.hardLink}new@72/`, payload, semaphore);
        });
    }
    function nukeSubmissionsLocal(semaphore) {
        return NewSubmissions_awaiter(this, void 0, void 0, function*() {
            const payload = {
                "messagecenter-action": Message.hardActions.nuke
            };
            const payloadArray = Object.entries(payload).map(([key, value]) => {
                var _a;
                return [ key, null !== (_a = null === value || void 0 === value ? void 0 : value.toString()) && void 0 !== _a ? _a : "" ];
            });
            return yield FuraffinityRequests.postHTML(`${NewSubmissions.hardLink}new@72/`, payloadArray, semaphore);
        });
    }
    var NewWatches_awaiter = function(thisArg, _arguments, P, generator) {
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
    class NewWatches {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/msg/others/";
        }
        static get hardActions() {
            return {
                remove: [ "remove-watches", "Remove Selected Watches" ],
                nuke: [ "nuke-watches", "Nuke Watches" ]
            };
        }
        removeMessages(userIds_1, action_1) {
            return NewWatches_awaiter(this, arguments, void 0, function*(userIds, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(removeWatchMessagesLocal, [ userIds, this._semaphore ], action, delay);
            });
        }
        nukeMessages(action_1) {
            return NewWatches_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(nukeWatchMessagesLocal, [ this._semaphore ], action, delay);
            });
        }
    }
    function removeWatchMessagesLocal(userIds, semaphore) {
        return NewWatches_awaiter(this, void 0, void 0, function*() {
            if (null == userIds || 0 === userIds.length) {
                Logger.logError("No submission ids to remove");
                return;
            }
            const payload = [ NewWatches.hardActions.remove ];
            for (const submissionId of userIds) {
                payload.push([ "watches[]", submissionId.toString() ]);
            }
            return yield FuraffinityRequests.postHTML(NewWatches.hardLink, payload, semaphore);
        });
    }
    function nukeWatchMessagesLocal(semaphore) {
        return NewWatches_awaiter(this, void 0, void 0, function*() {
            const payload = [ NewWatches.hardActions.nuke ];
            return yield FuraffinityRequests.postHTML(NewWatches.hardLink, payload, semaphore);
        });
    }
    var NewJournalComments_awaiter = function(thisArg, _arguments, P, generator) {
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
    class NewJournalComments {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/msg/others/";
        }
        static get hardActions() {
            return {
                remove: [ "remove-journal-comments", "Remove Selected Comments" ],
                nuke: [ "nuke-journal-comments", "Nuke Journal Comments" ]
            };
        }
        removeMessages(commentIds_1, action_1) {
            return NewJournalComments_awaiter(this, arguments, void 0, function*(commentIds, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(removeJournalCommentMessagesLocal, [ commentIds, this._semaphore ], action, delay);
            });
        }
        nukeMessages(action_1) {
            return NewJournalComments_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(nukeJournalCommentMessagesLocal, [ this._semaphore ], action, delay);
            });
        }
    }
    function removeJournalCommentMessagesLocal(commentIds, semaphore) {
        return NewJournalComments_awaiter(this, void 0, void 0, function*() {
            if (null == commentIds || 0 === commentIds.length) {
                Logger.logError("No submission ids to remove");
                return;
            }
            const payload = [ NewJournalComments.hardActions.remove ];
            for (const submissionId of commentIds) {
                payload.push([ "comments-journals[]", submissionId.toString() ]);
            }
            return yield FuraffinityRequests.postHTML(NewJournalComments.hardLink, payload, semaphore);
        });
    }
    function nukeJournalCommentMessagesLocal(semaphore) {
        return NewJournalComments_awaiter(this, void 0, void 0, function*() {
            const payload = [ NewJournalComments.hardActions.nuke ];
            return yield FuraffinityRequests.postHTML(NewJournalComments.hardLink, payload, semaphore);
        });
    }
    var NewShouts_awaiter = function(thisArg, _arguments, P, generator) {
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
    class NewShouts {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/msg/others/";
        }
        static get hardActions() {
            return {
                remove: [ "remove-shouts", "Remove Selected Shouts" ],
                nuke: [ "nuke-shouts", "Nuke Shouts" ]
            };
        }
        removeMessages(shoutIds_1, action_1) {
            return NewShouts_awaiter(this, arguments, void 0, function*(shoutIds, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(removeShoutMessagesLocal, [ shoutIds, this._semaphore ], action, delay);
            });
        }
        nukeMessages(action_1) {
            return NewShouts_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(nukeShoutMessagesLocal, [ this._semaphore ], action, delay);
            });
        }
    }
    function removeShoutMessagesLocal(shoutIds, semaphore) {
        return NewShouts_awaiter(this, void 0, void 0, function*() {
            if (null == shoutIds || 0 === shoutIds.length) {
                Logger.logError("No submission ids to remove");
                return;
            }
            const payload = [ NewShouts.hardActions.remove ];
            for (const submissionId of shoutIds) {
                payload.push([ "shouts[]", submissionId.toString() ]);
            }
            return yield FuraffinityRequests.postHTML(NewShouts.hardLink, payload, semaphore);
        });
    }
    function nukeShoutMessagesLocal(semaphore) {
        return NewShouts_awaiter(this, void 0, void 0, function*() {
            const payload = [ NewShouts.hardActions.nuke ];
            return yield FuraffinityRequests.postHTML(NewShouts.hardLink, payload, semaphore);
        });
    }
    var NewFavorites_awaiter = function(thisArg, _arguments, P, generator) {
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
    class NewFavorites {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/msg/others/";
        }
        static get hardActions() {
            return {
                remove: [ "remove-favorites", "Remove Selected Favorites" ],
                nuke: [ "nuke-favorites", "Nuke Favorites" ]
            };
        }
        removeMessages(submissionIds_1, action_1) {
            return NewFavorites_awaiter(this, arguments, void 0, function*(submissionIds, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(removeFavoriteMessagesLocal, [ submissionIds, this._semaphore ], action, delay);
            });
        }
        nukeMessages(action_1) {
            return NewFavorites_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(nukeFavoriteMessagesLocal, [ this._semaphore ], action, delay);
            });
        }
    }
    function removeFavoriteMessagesLocal(submissionIds, semaphore) {
        return NewFavorites_awaiter(this, void 0, void 0, function*() {
            if (null == submissionIds || 0 === submissionIds.length) {
                Logger.logError("No submission ids to remove");
                return;
            }
            const payload = [ NewFavorites.hardActions.remove ];
            for (const submissionId of submissionIds) {
                payload.push([ "favorites[]", submissionId.toString() ]);
            }
            return yield FuraffinityRequests.postHTML(NewFavorites.hardLink, payload, semaphore);
        });
    }
    function nukeFavoriteMessagesLocal(semaphore) {
        return NewFavorites_awaiter(this, void 0, void 0, function*() {
            const payload = [ NewFavorites.hardActions.nuke ];
            return yield FuraffinityRequests.postHTML(NewFavorites.hardLink, payload, semaphore);
        });
    }
    var NewJournals_awaiter = function(thisArg, _arguments, P, generator) {
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
    class NewJournals {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/msg/others/";
        }
        static get hardActions() {
            return {
                remove: [ "remove-journals", "Remove Selected Journals" ],
                nuke: [ "nuke-journals", "Nuke Journals" ]
            };
        }
        removeMessages(journalIds_1, action_1) {
            return NewJournals_awaiter(this, arguments, void 0, function*(journalIds, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(removeJournalMessagesLocal, [ journalIds, this._semaphore ], action, delay);
            });
        }
        nukeMessages(action_1) {
            return NewJournals_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(nukeJournalMessagesLocal, [ this._semaphore ], action, delay);
            });
        }
    }
    function removeJournalMessagesLocal(journalIds, semaphore) {
        return NewJournals_awaiter(this, void 0, void 0, function*() {
            if (null == journalIds || 0 === journalIds.length) {
                Logger.logError("No submission ids to remove");
                return;
            }
            const payload = [ NewJournals.hardActions.remove ];
            for (const submissionId of journalIds) {
                payload.push([ "journals[]", submissionId.toString() ]);
            }
            return yield FuraffinityRequests.postHTML(NewJournals.hardLink, payload, semaphore);
        });
    }
    function nukeJournalMessagesLocal(semaphore) {
        return NewJournals_awaiter(this, void 0, void 0, function*() {
            const payload = [ NewJournals.hardActions.nuke ];
            return yield FuraffinityRequests.postHTML(NewJournals.hardLink, payload, semaphore);
        });
    }
    var NewMessages_awaiter = function(thisArg, _arguments, P, generator) {
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
    class NewMessages {
        constructor(semaphore) {
            this._semaphore = semaphore;
            this.Watches = new NewWatches(this._semaphore);
            this.JournalComments = new NewJournalComments(this._semaphore);
            this.Shouts = new NewShouts(this._semaphore);
            this.Favorites = new NewFavorites(this._semaphore);
            this.Journals = new NewJournals(this._semaphore);
        }
        static get hardLink() {
            return FuraffinityRequests.fullUrl + "/msg/others/";
        }
        static get hardActions() {
            return {
                remove: [ "remove-all", "Remove Selected" ],
                nuke: [ "nuke-all", "Nuke Selected" ]
            };
        }
        getMessagesPage(action_1) {
            return NewMessages_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(getMessagesPageLocal, [ this._semaphore ], action, delay);
            });
        }
        removeMessages(userIds_1, journalCommentIds_1, shoutIds_1, favoriteIds_1, journalIds_1, action_1) {
            return NewMessages_awaiter(this, arguments, void 0, function*(userIds, journalCommentIds, shoutIds, favoriteIds, journalIds, action, delay = 100) {
                null !== userIds && void 0 !== userIds || (userIds = []);
                null !== journalCommentIds && void 0 !== journalCommentIds || (journalCommentIds = []);
                null !== shoutIds && void 0 !== shoutIds || (shoutIds = []);
                null !== favoriteIds && void 0 !== favoriteIds || (favoriteIds = []);
                null !== journalIds && void 0 !== journalIds || (journalIds = []);
                return yield WaitAndCallAction.callFunctionAsync(removeMessagesLocal, [ userIds, journalCommentIds, shoutIds, favoriteIds, journalIds, this._semaphore ], action, delay);
            });
        }
    }
    function getMessagesPageLocal(semaphore) {
        return NewMessages_awaiter(this, void 0, void 0, function*() {
            return yield FuraffinityRequests.getHTML(NewMessages.hardLink, semaphore);
        });
    }
    function removeMessagesLocal(userIds, journalCommentIds, shoutIds, favoriteIds, journalIds, semaphore) {
        return NewMessages_awaiter(this, void 0, void 0, function*() {
            const payload = [ NewMessages.hardActions.remove ];
            if (null != userIds && 0 !== userIds.length) {
                for (const submissionId of userIds) {
                    payload.push([ "watches[]", submissionId.toString() ]);
                }
            }
            if (null != journalCommentIds && 0 !== journalCommentIds.length) {
                for (const submissionId of journalCommentIds) {
                    payload.push([ "journalcomments[]", submissionId.toString() ]);
                }
            }
            if (null != shoutIds && 0 !== shoutIds.length) {
                for (const submissionId of shoutIds) {
                    payload.push([ "shouts[]", submissionId.toString() ]);
                }
            }
            if (null != favoriteIds && 0 !== favoriteIds.length) {
                for (const submissionId of favoriteIds) {
                    payload.push([ "favorites[]", submissionId.toString() ]);
                }
            }
            if (null != journalIds && 0 !== journalIds.length) {
                for (const submissionId of journalIds) {
                    payload.push([ "journals[]", submissionId.toString() ]);
                }
            }
            if (0 !== payload.length) {
                return yield FuraffinityRequests.postHTML(NewMessages.hardLink, payload, semaphore);
            } else {
                Logger.logError("No messages to remove");
            }
        });
    }
    class Message {
        constructor(semaphore) {
            this._semaphore = semaphore;
            this.NewSubmissions = new NewSubmissions(this._semaphore);
            this.NewMessages = new NewMessages(this._semaphore);
        }
        static get hardActions() {
            return {
                remove: "remove_checked",
                nuke: "nuke_notifications"
            };
        }
    }
    var AccountInformation_awaiter = function(thisArg, _arguments, P, generator) {
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
    class AccountInformation {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLinks() {
            return {
                settings: FuraffinityRequests.fullUrl + "/controls/settings/",
                siteSettings: FuraffinityRequests.fullUrl + "/controls/site-settings/",
                userSettings: FuraffinityRequests.fullUrl + "/controls/user-settings/"
            };
        }
        getSettingsPage(action_1) {
            return AccountInformation_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ AccountInformation.hardLinks.settings, this._semaphore ], action, delay);
            });
        }
        getSiteSettingsPage(action_1) {
            return AccountInformation_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ AccountInformation.hardLinks.siteSettings, this._semaphore ], action, delay);
            });
        }
        getUserSettingsPage(action_1) {
            return AccountInformation_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ AccountInformation.hardLinks.userSettings, this._semaphore ], action, delay);
            });
        }
    }
    var UserProfile_awaiter = function(thisArg, _arguments, P, generator) {
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
    class UserProfile {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLinks() {
            return {
                profile: FuraffinityRequests.fullUrl + "/controls/profile/",
                profilebanner: FuraffinityRequests.fullUrl + "/controls/profilebanner/",
                contacts: FuraffinityRequests.fullUrl + "/controls/contacts/",
                avatar: FuraffinityRequests.fullUrl + "/controls/avatar/"
            };
        }
        getProfilePage(action_1) {
            return UserProfile_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ UserProfile.hardLinks.profile, this._semaphore ], action, delay);
            });
        }
        getProfilebannerPage(action_1) {
            return UserProfile_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ UserProfile.hardLinks.profilebanner, this._semaphore ], action, delay);
            });
        }
        getContactsPage(action_1) {
            return UserProfile_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ UserProfile.hardLinks.contacts, this._semaphore ], action, delay);
            });
        }
        getAvatarPage(action_1) {
            return UserProfile_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ UserProfile.hardLinks.avatar, this._semaphore ], action, delay);
            });
        }
    }
    var ManageContent_awaiter = function(thisArg, _arguments, P, generator) {
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
    class ManageContent {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLinks() {
            return {
                submissions: FuraffinityRequests.fullUrl + "/controls/submissions/",
                folders: FuraffinityRequests.fullUrl + "/controls/folders/submissions/",
                journals: FuraffinityRequests.fullUrl + "/controls/journal/",
                favorites: FuraffinityRequests.fullUrl + "/controls/favorites/",
                buddylist: FuraffinityRequests.fullUrl + "/controls/buddylist/",
                shouts: FuraffinityRequests.fullUrl + "/controls/shouts/",
                badges: FuraffinityRequests.fullUrl + "/controls/badges/"
            };
        }
        getFoldersPages(action_1) {
            return ManageContent_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ ManageContent.hardLinks.folders, this._semaphore ], action, delay);
            });
        }
        getAllWatchesPages(action_1) {
            return ManageContent_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(getContentAllWatchesPagesLocal, [ this._semaphore ], action, delay);
            });
        }
        getWatchesPage(pageNumber_1, action_1) {
            return ManageContent_awaiter(this, arguments, void 0, function*(pageNumber, action, delay = 100) {
                pageNumber = convertToNumber(pageNumber);
                return yield WaitAndCallAction.callFunctionAsync(getWatchesPageLocal, [ pageNumber, this._semaphore ], action, delay);
            });
        }
    }
    function getContentAllWatchesPagesLocal(semaphore) {
        return ManageContent_awaiter(this, void 0, void 0, function*() {
            let usersDoc = yield FuraffinityRequests.getHTML(ManageContent.hardLinks.buddylist + "x", semaphore);
            const columnPage = null === usersDoc || void 0 === usersDoc ? void 0 : usersDoc.getElementById("columnpage");
            const sectionBody = null === columnPage || void 0 === columnPage ? void 0 : columnPage.querySelector('div[class="section-body"');
            const paginationLinks = null === sectionBody || void 0 === sectionBody ? void 0 : sectionBody.querySelector('div[class*="pagination-links"]');
            const pages = null === paginationLinks || void 0 === paginationLinks ? void 0 : paginationLinks.querySelectorAll(":scope > a");
            const userPageDocs = [];
            if (null != pages) {
                for (let i = 1; i <= pages.length; i++) {
                    usersDoc = yield getWatchesPageLocal(i, semaphore);
                    if (usersDoc) {
                        userPageDocs.push(usersDoc);
                    }
                }
            }
            return userPageDocs;
        });
    }
    function getWatchesPageLocal(pageNumber, semaphore) {
        return ManageContent_awaiter(this, void 0, void 0, function*() {
            if (null == pageNumber || pageNumber <= 0) {
                Logger.logWarning("No page number given. Using default 1 instead.");
                pageNumber = 1;
            }
            return yield FuraffinityRequests.getHTML(ManageContent.hardLinks.buddylist + pageNumber, semaphore);
        });
    }
    var Security_awaiter = function(thisArg, _arguments, P, generator) {
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
    class Security {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLinks() {
            return {
                sessions: FuraffinityRequests.fullUrl + "/controls/sessions/logins/",
                logs: FuraffinityRequests.fullUrl + "/controls/logs/",
                labels: FuraffinityRequests.fullUrl + "/controls/labels/"
            };
        }
        getSessionsPage(action_1) {
            return Security_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ Security.hardLinks.sessions, this._semaphore ], action, delay);
            });
        }
        getLogsPage(action_1) {
            return Security_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ Security.hardLinks.logs, this._semaphore ], action, delay);
            });
        }
        getLabelsPage(action_1) {
            return Security_awaiter(this, arguments, void 0, function*(action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(FuraffinityRequests.getHTML, [ Security.hardLinks.labels, this._semaphore ], action, delay);
            });
        }
    }
    class PersonalUserRequests {
        constructor(semaphore) {
            this._semaphore = semaphore;
            this.MessageRequests = new Message(this._semaphore);
            this.AccountInformation = new AccountInformation(this._semaphore);
            this.UserProfile = new UserProfile(this._semaphore);
            this.ManageContent = new ManageContent(this._semaphore);
            this.Security = new Security(this._semaphore);
        }
    }
    var SubmissionRequests_awaiter = function(thisArg, _arguments, P, generator) {
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
    class SubmissionRequests {
        constructor(semaphore) {
            this._semaphore = semaphore;
        }
        static get hardLinks() {
            return {
                view: FuraffinityRequests.fullUrl + "/view/",
                fav: FuraffinityRequests.fullUrl + "/fav/",
                unfav: FuraffinityRequests.fullUrl + "/unfav/",
                journal: FuraffinityRequests.fullUrl + "/journal/"
            };
        }
        getSubmissionPage(submissionId_1, action_1) {
            return SubmissionRequests_awaiter(this, arguments, void 0, function*(submissionId, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(getSubmissionPageLocal, [ submissionId, this._semaphore ], action, delay);
            });
        }
        favSubmission(submissionId_1, favKey_1, action_1) {
            return SubmissionRequests_awaiter(this, arguments, void 0, function*(submissionId, favKey, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(favSubmissionLocal, [ submissionId, favKey, this._semaphore ], action, delay);
            });
        }
        unfavSubmission(submissionId_1, unfavKey_1, action_1) {
            return SubmissionRequests_awaiter(this, arguments, void 0, function*(submissionId, unfavKey, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(unfavSubmissionLocal, [ submissionId, unfavKey, this._semaphore ], action, delay);
            });
        }
        getJournalPage(journalId_1, action_1) {
            return SubmissionRequests_awaiter(this, arguments, void 0, function*(journalId, action, delay = 100) {
                return yield WaitAndCallAction.callFunctionAsync(getJournalPageLocal, [ journalId, this._semaphore ], action, delay);
            });
        }
    }
    function getSubmissionPageLocal(submissionId, semaphore) {
        return SubmissionRequests_awaiter(this, void 0, void 0, function*() {
            if (null == submissionId || "" === submissionId || -1 === submissionId) {
                Logger.logError("No submissionId given");
                return;
            }
            const url = SubmissionRequests.hardLinks.view + submissionId;
            return yield FuraffinityRequests.getHTML(url, semaphore);
        });
    }
    function favSubmissionLocal(submissionId, favKey, semaphore) {
        return SubmissionRequests_awaiter(this, void 0, void 0, function*() {
            var _a, _b;
            if (null == submissionId || "" === submissionId || -1 === submissionId) {
                Logger.logError("No submissionId given");
                return;
            }
            if (null == favKey || "" === favKey || -1 === favKey) {
                Logger.logError("No favKey given");
                return;
            }
            const url = SubmissionRequests.hardLinks.fav + submissionId + "?key=" + favKey;
            const resultDoc = yield FuraffinityRequests.getHTML(url, semaphore);
            if (null != resultDoc) {
                try {
                    const standardpage = resultDoc.getElementById("standardpage");
                    if (standardpage) {
                        const blocked = standardpage.querySelector('div[class="redirect-message"]');
                        if (null !== (_b = null === (_a = null === blocked || void 0 === blocked ? void 0 : blocked.textContent) || void 0 === _a ? void 0 : _a.includes("blocked")) && void 0 !== _b ? _b : false) {
                            return;
                        }
                    }
                    return getFavKeyLocal(resultDoc);
                } catch (_c) {}
            }
        });
    }
    function unfavSubmissionLocal(submissionId, unfavKey, semaphore) {
        return SubmissionRequests_awaiter(this, void 0, void 0, function*() {
            if (null == submissionId || "" === submissionId || -1 === submissionId) {
                Logger.logError("No submissionId given");
                return;
            }
            if (null == unfavKey || "" === unfavKey || -1 === unfavKey) {
                Logger.logError("No unfavKey given");
                return;
            }
            const url = SubmissionRequests.hardLinks.unfav + submissionId + "?key=" + unfavKey;
            const resultDoc = yield FuraffinityRequests.getHTML(url, semaphore);
            if (resultDoc) {
                return getFavKeyLocal(resultDoc);
            }
        });
    }
    function getJournalPageLocal(journalId, semaphore) {
        return SubmissionRequests_awaiter(this, void 0, void 0, function*() {
            if (null == journalId || "" === journalId || -1 === journalId) {
                Logger.logError("No journalId given");
                return;
            }
            const url = SubmissionRequests.hardLinks.journal + journalId;
            return yield FuraffinityRequests.getHTML(url, semaphore);
        });
    }
    function getFavKeyLocal(doc) {
        var _a, _b, _c;
        const columnPage = doc.getElementById("columnpage");
        const navbar = null === columnPage || void 0 === columnPage ? void 0 : columnPage.querySelector('div[class*="favorite-nav"');
        const buttons = null === navbar || void 0 === navbar ? void 0 : navbar.querySelectorAll('a[class*="button"][href]');
        if (!buttons || 0 === buttons.length) {
            return;
        }
        let favButton;
        for (const button of Array.from(buttons)) {
            if (null !== (_b = null === (_a = null === button || void 0 === button ? void 0 : button.textContent) || void 0 === _a ? void 0 : _a.toLowerCase().includes("fav")) && void 0 !== _b ? _b : false) {
                favButton = button;
            }
        }
        if (null != favButton) {
            return null === (_c = favButton.getAttribute("href")) || void 0 === _c ? void 0 : _c.split("?key=")[1];
        }
    }
    var FuraffinityRequests_awaiter = function(thisArg, _arguments, P, generator) {
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
    class FuraffinityRequests {
        constructor(maxAmountRequests = 2) {
            this._semaphore = new Semaphore(maxAmountRequests);
            this.UserRequests = new UserRequests(this._semaphore);
            this.PersonalUserRequests = new PersonalUserRequests(this._semaphore);
            this.SubmissionRequests = new SubmissionRequests(this._semaphore);
        }
        set maxAmountRequests(value) {
            if (this._semaphore.maxConcurrency !== value) {
                this._semaphore.maxConcurrency = value;
            }
        }
        get maxAmountRequests() {
            return this._semaphore.maxConcurrency;
        }
        static set useHttps(value) {
            if (FuraffinityRequests._useHttps !== value) {
                FuraffinityRequests._useHttps = value;
                if (value) {
                    FuraffinityRequests._httpsString = "https://";
                } else {
                    FuraffinityRequests._httpsString = "http://";
                }
            }
        }
        static get useHttps() {
            return FuraffinityRequests._useHttps;
        }
        static get fullUrl() {
            return FuraffinityRequests._httpsString + FuraffinityRequests._domain;
        }
        static getHTML(url_1, semaphore_1, action_1) {
            return FuraffinityRequests_awaiter(this, arguments, void 0, function*(url, semaphore, action, delay = 100) {
                if (null != url && "" !== url) {
                    return yield WaitAndCallAction.callFunctionAsync(getHTMLLocal, [ url, semaphore ], action, delay);
                } else {
                    Logger.logError("No url given");
                }
            });
        }
        static postHTML(url_1, payload_1, semaphore_1, action_1) {
            return FuraffinityRequests_awaiter(this, arguments, void 0, function*(url, payload, semaphore, action, delay = 100) {
                if (null != url && "" !== url) {
                    return yield WaitAndCallAction.callFunctionAsync(postHTMLLocal, [ url, payload, semaphore ], action, delay);
                } else {
                    Logger.logError("No url given");
                }
            });
        }
    }
    FuraffinityRequests.logLevel = 1;
    FuraffinityRequests.Types = {
        BrowseOptions,
        SearchOptions
    };
    FuraffinityRequests._useHttps = window.location.protocol.includes("https");
    FuraffinityRequests._httpsString = window.location.protocol.trimEnd(":") + "://";
    FuraffinityRequests._domain = window.location.hostname;
    function getHTMLLocal(url, semaphore) {
        return FuraffinityRequests_awaiter(this, void 0, void 0, function*() {
            Logger.logInfo(`Requesting '${url}'`);
            const semaphoreActive = null != semaphore && semaphore.maxConcurrency > 0;
            if (semaphoreActive) {
                yield semaphore.acquire();
            }
            try {
                const response = yield fetch(url);
                const html = yield response.text();
                const parser = new DOMParser;
                return parser.parseFromString(html, "text/html");
            } catch (error) {
                Logger.logError(error);
            } finally {
                if (semaphoreActive) {
                    semaphore.release();
                }
            }
        });
    }
    function postHTMLLocal(url, payload, semaphore) {
        return FuraffinityRequests_awaiter(this, void 0, void 0, function*() {
            const semaphoreActive = null != semaphore && semaphore.maxConcurrency > 0;
            if (semaphoreActive) {
                yield semaphore.acquire();
            }
            try {
                const response = yield fetch(url, {
                    method: "POST",
                    body: new URLSearchParams(payload).toString(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
                if (!response.ok) {
                    Logger.logError(`HTTP error! Status: ${response.status}`);
                    return;
                }
                const responseData = yield response.text();
                try {
                    const parser = new DOMParser;
                    return parser.parseFromString(responseData, "text/html");
                } catch (_a) {
                    Logger.logError(`Failed to parse response data as HTML: ${responseData}`);
                }
            } catch (error) {
                Logger.logError(error);
            } finally {
                if (semaphoreActive) {
                    semaphore.release();
                }
            }
        });
    }
    Object.defineProperties(window, {
        FARequestHelper: {
            get: () => FuraffinityRequests
        }
    });
})();