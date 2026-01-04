/* This work is free. You can redistribute it and/or modify it under the
terms of the Do What The Fuck You Want To Public License, Version 2,
as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.*/

// ==UserScript==
// @name         YouTube - hide controls
// @namespace    http://ttmyller.azurewebsites.net/
// @license      WTFPL; http://www.wtfpl.net/
// @version      0.3
// @description  Add button in YouTube video player controls for hiding/showing controls. (They do not auto-hide when video is paused.)
// @author       ttmyller
// @include      https://www.youtube.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372924/YouTube%20-%20hide%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/372924/YouTube%20-%20hide%20controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var setupButton = function(hidden) {
        btn.prop('title', hidden ? 'Show controls' : 'Hide controls');
        btn.html(hidden ? '' : 'hide');
        btn.css('background-color', hidden ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0)');
        btn.prop('aria-pressed', hidden);
    };

    // create button
    var btn = $('<button class="ytp-button" />');
    setupButton(false);
    btn.css('float', 'left');
    btn.click(function (e) {
        var hidden = btn.prop('aria-pressed');
        $('.ytp-gradient-bottom').toggle(hidden);
        $('.ytp-gradient-top').toggle(hidden);
        $('.ytp-chrome-top').toggle(hidden);
        $('.ytp-progress-bar-container').toggle(hidden);
        $('.ytp-left-controls').toggle(hidden);
        $('.ytp-right-controls').toggle(hidden);
        $('.ytp-pause-overlay').toggle(hidden);
        $('.ytp-large-play-button').toggle(hidden);
        $('.ytp-button.ytp-expand').toggle(hidden);
        $('.video-annotations').toggle(hidden);
        setupButton(!hidden);
    });

    $('.ytp-chrome-controls').prepend(btn);
})();