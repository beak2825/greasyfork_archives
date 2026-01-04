// ==UserScript==
// @name         Morningstar Premium
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Get morningstar premium data
// @author       You
// @match        http://www.morningstar.com/stocks/*/*/quote.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368907/Morningstar%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/368907/Morningstar%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(document).ready(function () {
    var href = window.location.href.split('/');
    var ticker = href[5];
    $.ajax('https://morningstar-api.herokuapp.com/analysisData?ticker=' + ticker, {
        success: function (data) {
            var options = { year: 'numeric', month: 'long', day: 'numeric' };
            var html = '<div class="sal-columns sal-small-6 sal-medium-4 sal-large-2">\
                            <div class="dp-label ng-binding" ng-class="' + (data.isQuan ? 'quant-superscript' : '') + '">Assessment</div>\
                            <div class="update-date ng-binding">' + new Date(data.valuation.assessmentDate).toLocaleDateString('en', options) + '</div>\
                            <div class="dp-value ng-binding ng-scope" ng-if="true" data-linkbinding="assessment"> ' + data.valuation.assessment + '</div>\
                            <div class="dp-desc ng-binding ng-scope" ng-if="true">' + Math.abs(data.valuation.premDiscDelta) + '% ' + data.valuation.premiumDisc + '</div>\
                        </div>\
                        ';
            $('.sal-row.valuation-dps').html(html);
        }
    });
});
})();