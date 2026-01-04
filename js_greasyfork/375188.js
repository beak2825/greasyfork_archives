// ==UserScript==
// @name         Die Die Hard
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Get rid of all this Die Hard shit
// @author       Ian Page Hands
// @match        https://www.facebook.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.8.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/375188/Die%20Die%20Hard.user.js
// @updateURL https://update.greasyfork.org/scripts/375188/Die%20Die%20Hard.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jQuery = window.jQuery;
    var SEENT = 'ddhSeent';
    var REGEX = /die[\s]*hard/i;

    var warn = '<div class="ddhShowAnyway" style="background-color: #ffeaea; padding: 1em;">' +
        '<strong>Warning:</strong> This post contains Die Hard shit' +
        '<a style="float: right;" href="#">show anyway</a>' +
        '</div>';

    function kill() {
        var wrappers = jQuery('.userContentWrapper:not(.' + SEENT + ')');
        if (wrappers && wrappers.length > 0) {
            wrappers.addClass(SEENT);
            wrappers.each(function () {
                var wrapper = jQuery(this);
                var text = wrapper.text();
                if (text.match(REGEX)) {
                    wrapper.prepend(warn);
                    wrapper.find('div:not(.ddhShowAnyway)').hide();

                    var toggler = wrapper.find('.ddhShowAnyway a');
                    toggler.click(function () {
                        wrapper.find('div:not(.ddhShowAnyway)').toggle();
                        if (toggler.text() === 'show anyway') { toggler.text('nah fuck it, hide this'); }
                        else { toggler.text('show anyway'); }
                    });
                }
            });
        }
    }

    function slightDelay(fn, delay) {
        var timeout = delay || 50;
        window.setTimeout(fn, 50);
    }

    jQuery(function() {
        slightDelay(function () {
            jQuery('body').bind('DOMSubtreeModified', function (e) {
                if (e.target.innerHTML.length > 0) {
                    // delay again so the sizes for the comment
                    // sections get set in the dom
                    slightDelay(kill, 10);
                }
            });
            kill();
        });
    });
})();