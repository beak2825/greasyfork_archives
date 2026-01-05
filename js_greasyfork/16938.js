// ==UserScript==
// @name         Amazon Category Selector
// @namespace    https://lewisch.io/
// @version      1.0
// @description  Automatically redirects to the daily sales page with preselected categories
// @author       Thomas Lewisch
// @match        *.amazon.de/gp/angebote*
// @require      https://code.jquery.com/jquery-2.2.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16938/Amazon%20Category%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/16938/Amazon%20Category%20Selector.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var CategorySelector = function(options) {
    this.options = options || {};

    this.defaults = {
        url: 'http://www.amazon.de/gp/angebote', // the base url for daily offers,
        sortOrder: 'BY_SCORE', // the sort order for displaying the offers
        categories: [  // the category-ids to auto-select
            340843031, // pc
            300992,    // games
            284266,    // movies
            562066,    // electronics
        ],
        keys: {                               // the keys to use for building the url
            base: 'gb_f_GB-SUPPLE',           // the base query string argument used by amazon
            sortOrder: 'sortOrder',           // the key for the sort order
            categories: 'enforcedCategories', // the key for the categories
        },
        concatenators: {     // the concatenators to concatenate the different parts of the url
            qs: '?',         // the concatentor for the query string
            kv: ':',         // the key-value concatenator for different arguments
            ba: '=',         // the base-arguments concatentator for the base key to the other arguments
            args: ',',       // the arguments concatentator for joining various arguments
            values: '%252C', // the concatentor for the values of a single argument
        },
        selectors: {                               // the selectors used to find the categories
            categoryContainer: '#widgetFilters',   // the selector for the category container
            activeCategories: ':checkbox:checked', // the selector for the active categories
        },
    };

    this.settings = jQuery.extend({}, this.defaults, options);
};

/**
 * starts the category selector
 *
 * @return {void}
 */
CategorySelector.prototype.run = function () {
    var self = this,
        exists = window.setInterval(function() {
            if (self.filters().length) {
                self.redirectIfNecessary();
                window.clearInterval(exists);
            }
        }, 100);
};

/**
 * redirects the browser to the filtered
 * daily offers page if necessary
 *
 * @return {void}
 */
CategorySelector.prototype.redirectIfNecessary = function () {
    if (this.hasActiveCategories()) {
        return;
    }

    window.location.replace(this.buildUrl());
};

/**
 * builds the url to redirect to
 *
 * @return {string}
 */
CategorySelector.prototype.buildUrl = function () {
    var args = [];

    if (! this.hasSettings()) {
        return this.settings.url;
    }

    if (this.hasSortOrder()) {
        args.push(this.settings.keys.sortOrder + this.settings.concatenators.kv + this.settings.sortOrder);
    }

    if (this.hasCategories()) {
        args.push(this.settings.keys.categories + this.settings.concatenators.kv + this.buildCategoryString());
    }

    return this.settings.url +
        this.settings.concatenators.qs +
        this.settings.keys.base +
        this.settings.concatenators.ba +
        args.join(this.settings.concatenators.args);
};

/**
 * gets the active categories
 *
 * @return {jQuery element|array}
 */
CategorySelector.prototype.activeCategories = function () {
    return this.filters().find(this.settings.selectors.activeCategories);
};

/**
 * checks if categories are currently active
 *
 * @return {boolean}
 */
CategorySelector.prototype.hasActiveCategories = function () {
    return this.activeCategories().length > 0;
};

/**
 * checks if settings have been supplied to
 * build a custom url and redirect
 *
 * @return {boolean}
 */
CategorySelector.prototype.hasSettings = function () {
    return this.hasSortOrder() || this.hasCategories();
};

/**
 * checks of a sort order has been supplied
 *
 * @return {boolean}
 */
CategorySelector.prototype.hasSortOrder = function () {
    return this.settings.sortOrder !== false && this.settings.sortOrder !== null;
};

/**
 * checks if categories have been supplied
 *
 * @return {boolean}
 */
CategorySelector.prototype.hasCategories = function () {
    return jQuery.isArray(this.settings.categories) && this.settings.categories.length > 0;
};

/**
 * builds the category string for the url
 *
 * @return {string}
 */
CategorySelector.prototype.buildCategoryString = function () {
    return this.settings.categories.join(this.settings.concatenators.values);
};

/**
 * gets the container element that holds the filters
 *
 * @return {jQuery element|array}
 */
CategorySelector.prototype.filters = function () {
    return jQuery(document).find(this.settings.selectors.categoryContainer);
};

/**
 * initializes a new category selector
 *
 * @param  {Object} options
 * @return {CategorySelector}
 */
CategorySelector.init = function(options) {
    var selector = new CategorySelector(options);

    selector.run();

    return selector;
};

jQuery(document).ready(function($) {
    CategorySelector.init();
});
