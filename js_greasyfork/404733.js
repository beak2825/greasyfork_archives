// ==UserScript==
// @name         PowerApps Studio Optimizations
// @namespace    https://rjb.solutions/
// @version      0.1
// @description  Fixes and productivity optimizations for PowerApps Studio
// @author       Remy Blok
// @match        https://*.create.powerapps.com/studio/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404733/PowerApps%20Studio%20Optimizations.user.js
// @updateURL https://update.greasyfork.org/scripts/404733/PowerApps%20Studio%20Optimizations.meta.js
// ==/UserScript==

"use strict";
class PowerAppsStudioImprovements {
    constructor(window) {
        this.checks = {};
        this.intervals = {};
        this.initiateStop = false;
        this.instanceId = Math.round(Math.random() * 1000);
        this.window = window;
        this.$ = window.$;
    }
    start() {
        console.log(`${this.instanceId}: PowerAppsStudioImprovements start`);
        const propertyCombo = this.$('#powerapps-property-combo-box');
        propertyCombo.css("minWidth", "300px");
        this.$('[class*=formulaBarEqualsSign_]').remove(); // remove =
        this.$("[data-icon-name=FnDiscovery]").remove(); // remove fx.
        const formulaBar = this.$("#formulabar");
        formulaBar.css("maxWidth", "calc(100% - 640px");
        this.checkElementAndAttach("#expandCollapseButton", "click", this.formulaBarExpandCollapseClick, this.formulaBarExpandCollapseClick, this.formulaBarTrayClosed);
        this.checkElementAndAttach("#watchViewClickRegion", "click", this.formulaBarWatchClick, this.formulaBarWatchClick, this.formulaBarWatchClosed);
        console.log(`${this.instanceId}: PowerAppsStudioImprovements started`);
    }
    stop() {
        console.log(`${this.instanceId}: PowerAppsStudioImprovements stoping`);
        this.initiateStop = true;
    }
    formulaBarExpandCollapseClick() {
        console.log(`${this.instanceId}: formulaBarExpandCollapseClick`);
        const formulaEditor = this.$("#reactFormulaEditor *[data-mode-id]");
        const formulaEditorCoords = this.getCoords(formulaEditor);
        const bottomArea = this.$("[class*=bottomAreaContainer_]");
        if (formulaEditorCoords.height > 500) {
            const bottomAreaCoords = this.getCoords(bottomArea);
            const newHeight = bottomAreaCoords.top + (bottomAreaCoords.height - 32) -
                formulaEditorCoords.top -
                (this.$("#formatTextClickRegion").height() || 0);
            console.log(`${this.instanceId}: formulaBarExpandCollapseClick setting height: ${newHeight}`);
            formulaEditor.height(newHeight);
            bottomArea.css("visibility", "hidden");
        }
        else {
            console.log(`${this.instanceId}: formulaBarExpandCollapseClick reset`);
            bottomArea.css("visibility", "initial");
        }
    }
    formulaBarTrayClosed() {
        console.log(`${this.instanceId}: formulaBarTrayClosed`);
        this.$("[class*=bottomAreaContainer_]").css("visibility", "initial");
    }
    formulaBarWatchClick(e, retry = 0) {
        console.log(`${this.instanceId}: formulaBarWatchClick`);
        const watchWindow = this.$("#formatTextClickRegion").next();
        const transformCss = this.$("[class*=tableChevron_]", watchWindow).css("transform") || "";
        const isOpen = transformCss.indexOf("180deg") > 0;
        if (!isOpen) {
            this.formulaBarExpandCollapseClick();
            return;
        }
        const formulaEditor = this.$("#reactFormulaEditor *[data-mode-id]");
        const formulaEditorHeight = formulaEditor.height() || 0;
        if (formulaEditorHeight <= 500)
            return;
        const watchWindowHeight = watchWindow.height() || 0;
        console.log(`${this.instanceId}: formulaBarWatchClick watchWindow.height(): ${watchWindowHeight}`);
        if (watchWindowHeight <= 32) {
            if (retry < 10)
                this.window.setTimeout(() => this.formulaBarWatchClick(e, retry++), 100);
            return;
        }
        formulaEditor.height(formulaEditorHeight - watchWindowHeight);
    }
    formulaBarWatchClosed() {
        console.log(`${this.instanceId}: formulaBarWatchClosed`);
        this.formulaBarExpandCollapseClick();
    }
    checkElementAndAttach(selector, event, callback, callbackElemAttached = undefined, callbackElemGone = undefined, checkInterval = 1000, executeTimeout = 10) {
        const runElemGone = () => {
            if (callbackElemGone)
                callbackElemGone.call(this);
        };
        const attachToElem = (element) => {
            this.checks[selector] = {
                element: element[0],
                handler: executeTimeout ? e => this.window.setTimeout(() => callback.call(this, e), executeTimeout) : callback.bind(this)
            };
            element[0].addEventListener(event, this.checks[selector].handler, { capture: true, passive: true });
            if (callbackElemAttached)
                callbackElemAttached.call(this);
        };
        const interval = this.window.setInterval(() => {
            console.debug(`${this.instanceId}: checkElementAndAttach interval for ${selector}`);
            const element = this.$(selector);
            if (element.length > 0) {
                if (this.initiateStop && this.checks[selector]) {
                    console.debug(`${this.instanceId}: checkElementAndAttach initiate stop for ${selector}`);
                    element[0].removeEventListener(event, this.checks[selector].handler);
                    runElemGone();
                }
                else if (!this.checks[selector]) {
                    console.debug(`${this.instanceId}: checkElementAndAttach element found for ${selector}`);
                    attachToElem(element);
                }
                else if (element[0] != this.checks[selector].element) {
                    console.debug(`${this.instanceId}: checkElementAndAttach element changed for ${selector}`);
                    runElemGone();
                    attachToElem(element);
                }
            }
            else if (element.length == 0 && this.checks[selector]) {
                console.debug(`${this.instanceId}: checkElementAndAttach element gone for ${selector}`);
                delete this.checks[selector];
                runElemGone();
            }
            if (this.initiateStop)
                this.window.clearInterval(this.intervals[selector]);
        }, checkInterval);
        this.intervals[selector] = interval;
    }
    ;
    getCoords(elem) {
        let element;
        if (elem instanceof HTMLElement) {
            element = elem;
            elem = this.$(elem);
        }
        else
            element = elem[0];
        const box = element.getBoundingClientRect();
        const body = document.body;
        const docEl = document.documentElement;
        const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        const clientTop = docEl.clientTop || body.clientTop || 0;
        const clientLeft = docEl.clientLeft || body.clientLeft || 0;
        const top = box.top + scrollTop - clientTop;
        const left = box.left + scrollLeft - clientLeft;
        return {
            top: Math.round(top),
            left: Math.round(left),
            width: elem.width() || 0,
            height: elem.height() || 0
        };
    }
}
class PowerAppsStudioImprovementsInitialization {
    constructor(window) {
        console.log("Initializing PowerAppsStudioImprovements");
        this.window = window;
    }
    start(onStartCallback) {
        this.onStartCallback = onStartCallback;
        if (!this.checkStart())
            this.checkStartInterval = window.setInterval(() => this.checkStart(), 1000);
    }
    stop() {
        if (this.improvements)
            this.improvements.stop();
    }
    restart() {
        this.stop();
        this.start();
    }
    debug() {
        debugger;
    }
    checkStart() {
        console.log("PowerAppsStudioImprovementsInitialization check start...");
        if (this.window.$ && this.window.$("#formulabar").length > 0) {
            console.log("PowerAppsStudioImprovementsInitialization starting");
            this.window.clearInterval(this.checkStartInterval);
            this.window.setTimeout(() => {
                this.improvements = new PowerAppsStudioImprovements(this.window);
                this.improvements.start();
                if (this.onStartCallback)
                    this.onStartCallback();
            }, 1000);
            return true;
        }
        return false;
    }
}
window.improvements = new PowerAppsStudioImprovementsInitialization(window);
if (!window.improvementsDynamic)
    window.improvements.start();
