// ==UserScript==
// @name         V2ex supper helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make v2ex easyer to use
// @author       You
// @match        https://v2ex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447882/V2ex%20supper%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447882/V2ex%20supper%20helper.meta.js
// ==/UserScript==
class PageManager {
    constructor() {
        this.conditionalWorks = [];
        this.activeConditionWork = null;
        setInterval(() => {
            this.conditionalWorks.forEach(cw => {
                cw.conditionWork.report();
            });
        }, 1000);
    }

    stage(name) {
        var conditionalWork = new ConditionalWork(name);
        this.conditionalWorks.push({
            name: name,
            conditionWork: conditionalWork,
        });
        return conditionalWork;
    }

    off(name) {
        var check = this.conditionalWorks.find(cw => cw.name === name);
        if (check) {
            check.conditionWork.off();
        }
    }
}

class ConditionalWork {

    constructor(name) {
        this.__name = name;
        this.__conditionFn = null;
        this.__actionFn = null;
        this.__running = false;
        this.__timeDuration = 0;
        this.__intervalMethod = 'interval';
        this.__handlerId = null;
        this.__logLevel = 0;
        this.__log = console.log;
    }

    log = (message, level) => {
        if (isNaN(level)) level = 1;
        if (this.__logLevel > 0 && level >= this.__logLevel) {
            this.__log(message);
        }
    }

    __checkBeforeRun() {
        if (!this.__conditionFn) {
            throw new Error("Condition function must be defined");
        }
        if (!this.__timeDuration) {
            throw new Error(`${this.__intervalMethod} must be defined`);
        }
    }

    __complete() {
        this.__running = false;
        this.__handlerId = null;
    }

    logLevel(level) {
        this.__logLevel = level;
        return this;
    }

    asTimeout(timeout) {
        if (this.__intervalMethod === 'interval') {
            // initial set for timeout
            if (isNaN(timeout)) {
                throw new Error("Timeout must be a number");
            } else {
                if (timeout < 1) {
                    throw new Error("timeout must be greater than 0");
                } else {
                    timeout = Math.floor(timeout);
                }
            }
        } else {
            throw new Error("Interval already set");
        }
        this.__timeDuration = timeout;
        this.__intervalMethod = 'timeout';
        return this;
    }

    on(conditionFn) {
        if (typeof conditionFn !== "function") {
            throw new Error("Condition function must be a function");
        }
        if (typeof this.__conditionFn === "function") {
            throw new Error("Condition function already defined");
        }
        this.__conditionFn = conditionFn;
        return this;
    }

    act(actionFn) {
        // on must be called before act
        if (typeof this.__conditionFn !== "function") {
            throw new Error("Condition function must be defined first");
        }
        if (typeof actionFn !== "function") {
            throw new Error("Action function must be a function");
        }
        this.__actionFn = actionFn;
        return this;
    }

    every(interval) {
        if (!isNaN(this.__timeDuration) && this.__timeDuration !== 0) {
            throw new Error("Interval already set");
        }

        if (isNaN(interval)) {
            throw new Error("Interval must be a number");
        } else {
            if (interval < 1) {
                throw new Error("Interval must be greater than 0");
            } else {
                interval = Math.floor(interval);
            }
        }

        this.__timeDuration = interval;
        return this;
    }

    __hanlder = (cancelFn) => {
        let shouldContinue = false;
        if (this.__conditionFn()) {
            shouldContinue = this.__actionFn(this.log);
        } else {
            shouldContinue = true;
        }
        if (shouldContinue === false) {
            cancelFn(this.__handlerId);
            this.__complete();
        }
    }

    __timeoutHanlder = () => {
        this.__hanlder(clearTimeout);
        setTimeout(() => {
            this.__timeoutHanlder();
        }, this.__timeDuration);
    }

    __intervalHandler = () => {
        if (!this.__handlerId) {
            this.__handlerId = setInterval(this.__intervalHandler, this.__timeDuration);
        } else {
            this.__hanlder(clearInterval);
        }
    }

    run = () => {
        // check basic configurations: interval, conditionFn, isRunning
        this.__checkBeforeRun();
        if (this.__running) {
            this.log("Work is already running", 1);
            return;
        }
        switch (this.__intervalMethod) {
            case 'interval':
                this.__intervalHandler();
                this.__running = true;
                break;
            case 'timeout':
                this.__timeoutHanlder();
                this.__running = true;
            default:
                throw new Error("Interval method not defined");
        }
    }

    report() {
        if (this.__running) {
            this.log(`${this.__name} is running`, 1);
        } else {
            this.log(`${this.__name} is not running`, 2);
        }
    }
}

(function () {
    // 'use strict';
    GM_addStyle(`
        .cell.read {
            background-color: antiquewhite;
        }
    `);

    function getWebsite() {
        // Get website domain
        return window.location.hostname;
    }

    function getJsonDataObject() {
        return JSON.parse(GM_getValue(getWebsite(), '{}'));
    }

    function setUrlRead(url) {
        // Set url as read
        var data = getJsonDataObject();
        data[url] = true;
        GM_setValue(getWebsite(), JSON.stringify(data));
    }

    function isUrlRead(url) {
        // Check if url is read
        var data = getJsonDataObject();
        return data[url] === true;
    }

    function getMainPageCells() {
        // Get main page cells
        return document.querySelectorAll('#Main div.cell.item');
    }

    function getTopicsPageCells() {
        // Get topics page cells
        return document.querySelectorAll('#TopicsNode .cell');
    }

    function getCells() {
        const mainCells = getMainPageCells();
        const topicsCells = getTopicsPageCells();
        if (mainCells.length > 0) {
            return mainCells;
        }
        if (topicsCells.length > 0) {
            return topicsCells;
        }
        return [];
    }

    function findLinks() {
        return Array.from(getCells()).map((cell) => { return cell.querySelector('.item_title a').href; });
    }

    var pm = new PageManager();

    const condition = () => {
        return findLinks().length > 0;
    }

    // record current page as read
    setUrlRead(window.location.href);

    pm.stage('Add color to viewd topics')
        .on(condition)
        .logLevel(1)
        .act((logger) => {
            logger('Add color to viewd topics');
            // find all cells
            var cells = getCells();
            // add color to read topics
            Array.from(cells).forEach((cell) => {
                const link = cell.querySelector('.item_title a').href;
                logger(`${link} is ${isUrlRead(link) ? 'read' : 'unread'}`);
                if (isUrlRead(link)) {
                    cell.classList.add('read');
                }
            });
            logger('Done', 2);
            return false;
        })
        .every(1000)
        .run();

})();