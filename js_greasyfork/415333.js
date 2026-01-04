// ==UserScript==
// @name         Rickroll Detect
// @version      0.2
// @namespace    http://tampermonkey.net/
// @description  Highlights rickrolls on the WaniKani forums
// @author       BIsTheAnswer
// @include      https://community.wanikani.com/*
// @license      MIT; http://opensource.org/licenses/MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415333/Rickroll%20Detect.user.js
// @updateURL https://update.greasyfork.org/scripts/415333/Rickroll%20Detect.meta.js
// ==/UserScript==

(function() {
    /* global $ */
    /* eslint curly: off */

    'use strict';

    var rickroll_array = [
        'dQw4w9WgXcQ',
        'doEqUhFiQS4',
        'oHg5SJYRHA0'
    ];

    var rickroll_regex = /(https?:\/\/)?(www\.)?youtube\.[a-z]+\/watch\?v=([a-zA-Z0-9]+)([^a-zA-Z0-9].*)?/i;
    var rickroll_regex_short = /(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9]+)([^a-zA-Z0-9].*)?/i

    function mark_rickrolls() {
        $('a').filter(function() {
            var regex_result = this.href.match(rickroll_regex);
            if(regex_result == null) {
                regex_result = this.href.match(rickroll_regex_short);
                if(regex_result == null)
                    return false;
            }
            return rickroll_array.includes(regex_result[3]);
        }).css('background-color', 'rgb(255, 0, 0, 0.5)').css('border-bottom', '1px solid rgb(255,0,0,0.5)');
    }

    mark_rickrolls();

    var dom_watch = new MutationObserver(function() {
        mark_rickrolls();
    });
    dom_watch.observe(document.body, {childList: true, subtree: true});
})();