// ==UserScript==
// @name         Disable video autoplay in messenger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  To play the video just click the play button in the bottom controls bar :)
// @author       You
// @match        https://www.messenger.com/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/27000/Disable%20video%20autoplay%20in%20messenger.user.js
// @updateURL https://update.greasyfork.org/scripts/27000/Disable%20video%20autoplay%20in%20messenger.meta.js
// ==/UserScript==

/*!
 * jQuery initialize - v1.0.0 - 12/14/2016
 * https://github.com/adampietrasiak/jquery.initialize
 *
 * Copyright (c) 2015-2016 Adam Pietrasiak
 * Released under the MIT license
 * https://github.com/timpler/jquery.initialize/blob/master/LICENSE
 */
;(function ($) {
    // MutationSelectorObserver represents a selector and it's associated initialization callback.
    var MutationSelectorObserver = function (selector, callback) {
        this.selector = selector;
        this.callback = callback;
    };

    // List of MutationSelectorObservers.
    var msobservers = [];
    msobservers.initialize = function (selector, callback) {

        // Wrap the callback so that we can ensure that it is only
        // called once per element.
        var seen = [];
        callbackOnce = function () {
            if (seen.indexOf(this) == -1) {
                seen.push(this);
                $(this).each(callback);
            }
        };

        // See if the selector matches any elements already on the page.
        $(selector).each(callbackOnce);

        // Then, add it to the list of selector observers.
        this.push(new MutationSelectorObserver(selector, callbackOnce));
    };

    // The MutationObserver watches for when new elements are added to the DOM.
    var observer = new MutationObserver(function (mutations) {

        // For each MutationSelectorObserver currently registered.
        for (var j = 0; j < msobservers.length; j++) {
            $(msobservers[j].selector).each(msobservers[j].callback);
        }
    });

    // Observe the entire document.
    observer.observe(document.documentElement, {childList: true, subtree: true, attributes: true});

    // Handle .initialize() calls.
    $.fn.initialize = function (callback) {
        msobservers.initialize(this.selector, callback);
    };
})(jQuery);

(function() {
    'use strict';
    var disablePlay = true;
    $('video').initialize(function() {
        $(this).attr('preload', 'none');
        $(this).attr('muted', '0');
        $(this).on('play', function (e) {
            if (disablePlay)
                $(this)[0].pause();
            else {
                $(this)[0].volume = 1;
                $(this)[0].muted = 0;
            }
        });
        $(this).on('pause', function (e) {
            disablePlay = true;
            $(this)[0].volume = 0;
        });
    });
    $('[data-testid=play_pause_control]').initialize(function() {
        $(this).on('click', function(e) {
            disablePlay = !disablePlay;
        });
    });
})();