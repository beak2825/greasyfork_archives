// ==UserScript==
// @name         Amazon Category Expander
// @namespace    https://lewisch.io/
// @version      1.0
// @description  The Category Expander expands all categories on the daily offers page of Amazon
// @author       Thomas Lewisch
// @match        *.amazon.de/gp/angebote*
// @require      https://code.jquery.com/jquery-2.2.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16939/Amazon%20Category%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/16939/Amazon%20Category%20Expander.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var CategoryExpander = function(options) {
    this.options = options || {};

    this.defaults = {
        selectors: {                               // the selectors used to find the categories
            expander: '.a-expander-header span',   // the selector for the category expander
            categoryContainer: '#widgetFilters',   // the selector for the category container
        },
    };

    this.settings = jQuery.extend({}, this.defaults, options);
};

/**
 * starts the category selector
 *
 * @return {void}
 */
CategoryExpander.prototype.run = function () {
    var self = this,
        exists = window.setInterval(function() {
            if (self.filters().length) {
                self.expandCategories();
                window.clearInterval(exists);
            }
        }, 100);
};

/**
 * gets the container element that holds the filters
 *
 * @return {jQuery element|array}
 */
CategoryExpander.prototype.filters = function () {
    return jQuery(document).find(this.settings.selectors.categoryContainer);
};

/**
 * expands the categories to display all categories
 *
 * @return {void}
 */
CategoryExpander.prototype.expandCategories = function () {
    this.filters().find(this.settings.selectors.expander).trigger('click');
};

/**
 * initializes a new category expander
 *
 * @param  {object} options
 * @return {CategoryExpander}
 */
CategoryExpander.init = function(options) {
    var expander = new CategoryExpander(options);

    expander.run();

    return expander;
};

jQuery(document).ready(function($) {
    CategoryExpander.init();
});
