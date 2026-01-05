// ==UserScript==
// @name         Ads DOM Remover Runner
// @namespace    sagiegurari
// @version      0.14
// @author       Sagie Gur-Ari
// @description  Library - Removes Ad Containers from DOM (doesn't replace adblocker extension, but blocks dynamic content which the adblocker fails to block by removing whole sections from the HTML DOM.)
// @homepage     https://github.com/sagiegurari/userscripts-ads-dom-remover
// @supportURL   https://github.com/sagiegurari/userscripts-ads-dom-remover/issues
// @grant        none
// @license      MIT License
// ==/UserScript==

(function initADR() {
    'use strict';

    /**
     * This class invokes the ads removing process based on provided options.
     *
     * @author Sagie Gur-Ari
     * @class ADRService
     * @public
     * @param {object} $ - The jquery library
     * @param {object} [options] - The process options
     * @param {function} [options.getSelectorDefinitions] - Returns all selector definitions per host
     * @param {number} [options.loops=10] - The amount of loops to run (will be invoked twice)
     * @param {number} [options.interval=250] - Time in millies between each loop
     * @param {number} [options.secondLoopInterval=2500] - Time in millies between each bulk of loops
     * @param {function} [options.onDone] - Invoked at the end of all loops
     */
    var Service = function ($, options) {
        this.$ = $;
        options = options || {};
        this.loops = options.loops || 10;
        this.interval = options.interval || 250;
        this.secondLoopInterval = options.secondLoopInterval || 2500;
        this.onDone = options.onDone || this.noop;

        var hostname = document.location.hostname;
        if (window.adrRunner && window.adrRunner.mockHostname) {
            hostname = window.adrRunner.mockHostname;
        }

        var getSelectorDefinitions = options.getSelectorDefinitions || this.noop;
        this.selectorDefinitions = getSelectorDefinitions() || {};

        // find default selectors
        this.defaultSelectors = null;
        var index;
        var id;
        this.ids = Object.keys(this.selectorDefinitions);
        for (index = 0; index < this.ids.length; index++) {
            id = this.ids[index];

            this.selectorDefinitions[id].id = id;

            if (this.selectorDefinitions[id].hostNames === true) {
                this.defaultSelectors = this.selectorDefinitions[id];
            }
        }

        this.defaultSelectors = this.defaultSelectors || [];

        this.state = {
            intervalID: null,
            counter: 0,
            secondLoop: false
        };

        var selectors = this.getSelectors(hostname);
        if (selectors) {
            if ((!Array.isArray(selectors)) && selectors.selectors) {
                if (selectors.id) {
                    console.debug(
                        '[user script][Ads DOM Remover][hideElements] Using Selectors:',
                        selectors.id
                    );
                }

                if (selectors.options) {
                    this.loops = selectors.options.loops || this.loops;
                    this.interval = selectors.options.interval || this.interval;
                }

                selectors = selectors.selectors;
            }

            this.state.currentSelectors = selectors;
        }
    };

    /**
     * Empty function
     *
     * @function
     * @memberof! ADRService
     * @private
     * @returns {undefined} Always undefined
     */
    Service.prototype.noop = function () {
        return undefined;
    };

    /**
     * Returns the selectors to remove based on the provided host name.
     *
     * @function
     * @memberof! ADRService
     * @private
     * @param {string} hostName - The current host name
     * @returns {Array} Array of selectors (or objects) to remove from the DOM
     */
    Service.prototype.getSelectors = function (hostName) {
        var selectors;

        try {
            var definitionIndex;
            var hostNameIndex;
            var id;
            var hostNames;
            for (definitionIndex = 0; definitionIndex < this.ids.length; definitionIndex++) {
                id = this.ids[definitionIndex];
                hostNames = this.selectorDefinitions[id].hostNames;

                if ((typeof hostNames === 'string') && (hostName.indexOf(hostNames) !== -1)) {
                    selectors = this.selectorDefinitions[id];
                } else if (Array.isArray(hostNames)) {
                    for (hostNameIndex = 0; hostNameIndex < hostNames.length; hostNameIndex++) {
                        if (hostName.indexOf(hostNames[hostNameIndex]) !== -1) {
                            selectors = this.selectorDefinitions[id];
                            break;
                        }
                    }
                }

                if (selectors) {
                    break;
                }
            }
        } catch (error) {
            console.error(
                '[user script][Ads DOM Remover][getSelectors] Error:',
                error
            );
        }

        if (!selectors) {
            selectors = this.defaultSelectors;
        }

        return selectors || [];
    };

    /**
     * Hides the elements by removing them from the DOM completely.
     *
     * @function
     * @memberof! ADRService
     * @private
     * @returns {boolean} True if any element was removed during this invocation
     */
    Service.prototype.hideElements = function () {
        var self = this;
        var found = false;

        var selectors = self.state.currentSelectors || [];

        selectors.forEach(function (selector) {
            var selectorString = selector.selector || selector;

            var $element;
            try {
                $element = self.$(selectorString);
            } catch (error) {
                console.error(
                    '[user script][Ads DOM Remover][hideElements] Error while running selector:',
                    selectorString,
                    error
                );
            }

            if ($element && $element.length) {
                found = true;

                if (selector.fineTuneSelector && (typeof selector.fineTuneSelector === 'function')) {
                    $element = selector.fineTuneSelector($element);
                }

                if (selector.pre && (typeof selector.pre === 'function')) {
                    selector.pre($element);
                }

                var remove = true;
                if (selector.filter && (typeof selector.filter === 'function')) {
                    $element = selector.filter($element);
                    remove = !!$element.length;
                }

                if (remove) {
                    $element.removeAttr('style');
                    $element.css(
                        'display',
                        'none !important'
                    );

                    $element.remove();

                    console.debug(
                        '[user script][Ads DOM Remover][hideElements] Found:',
                        selector,
                        'count:',
                        $element.length,
                        'in website and removed it.'
                    );
                } else {
                    console.debug(
                        '[user script][Ads DOM Remover][hideElements] Found:',
                        selector,
                        'count:',
                        $element.length,
                        'in website but not removing.'
                    );
                }
            }
        });

        return found;
    };

    /**
     * Invoked each interval to run the main library logic.
     *
     * @function
     * @memberof! ADRService
     * @private
     */
    Service.prototype.actionLoop = function () {
        this.state.counter++;
        var stopInterval = this.state.intervalID && (this.state.counter > this.loops);
        console.debug(
            '[user script][Ads DOM Remover][actionLoop] Running loop:',
            this.state.counter,
            'state:',
            this.state,
            'stop interval:',
            stopInterval
        );

        this.hideElements();

        if (stopInterval) {
            console.debug(
                '[user script][Ads DOM Remover][actionLoop] Clearing interval ID:',
                this.state.intervalID
            );
            clearInterval(this.state.intervalID);
            this.state.intervalID = null;

            if (!this.state.secondLoop) {
                this.startActionLoop(
                    false,
                    this.secondLoopInterval
                );
            } else {
                this.onDone();
            }
        }
    };

    /**
     * Starts the interval invocations.
     *
     * @function
     * @memberof! ADRService
     * @private
     * @param {boolean} firstTime - If this function was called for the first time
     * @param {number} delay - The delay to wait before setting the interval
     */
    Service.prototype.startActionLoop = function (firstTime, delay) {
        var self = this;

        self.state.secondLoop = !firstTime;
        self.state.counter = 0;

        setTimeout(
            function () {
                self.state.intervalID = setInterval(
                    function () {
                        self.actionLoop();
                    },
                    self.interval
                );

                setTimeout(
                    function () {
                        self.hideElements();
                    },
                    15000
                );
            },
            delay
        );
    };

    /**
     * Starts the service run.
     *
     * @function
     * @memberof! ADRService
     * @private
     */
    Service.prototype.start = function () {
        this.startActionLoop(
            true,
            10
        );
    };

    /**
     * Starts the service run.
     *
     * @function
     * @namespace ADRRunner
     * @public
     * @param {object} $ - The jquery library
     * @param {object} options - The process options
     * @param {function} options.getSelectorDefinitions - Returns all selector definitions per host
     * @param {number} [options.loops=10] - The amount of loops to run (will be invoked twice)
     * @param {number} [options.interval=250] - Time in millies between each loop
     */
    window.adrRunner = function adrRunner($, options) {
        if ($ && (typeof $ === 'function') && options && options.getSelectorDefinitions && (typeof options.getSelectorDefinitions === 'function')) {
            var service = new Service(
                $,
                options
            );
            service.start();
        }
    };
}());
