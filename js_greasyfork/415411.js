// ==UserScript==
// @name         Bandcamp Toggle Playback With Spacebar
// @namespace    https://openuserjs.org/users/burn
// @version      1.11.0
// @description  Press spacebar on Bandcamp to control music playback.
// @author       burn
// @copyright    2020, burn (https://openuserjs.org/users/burn)
// @license      MIT
// @match        https://*.bandcamp.com/*
// @include      https://*.bandcamp.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/415411/Bandcamp%20Toggle%20Playback%20With%20Spacebar.user.js
// @updateURL https://update.greasyfork.org/scripts/415411/Bandcamp%20Toggle%20Playback%20With%20Spacebar.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author burn
// ==/OpenUserJS==

(function() {
    'use strict';
    const DBG = false;

    let log = function(s) {
            return (DBG && console.log(s));
        },
        qS = function(el, scope) {
            scope = (typeof scope === 'object') ? scope : document;
            return scope.querySelector(el) || false;
        },
        qSall = function(els, scope) {
            scope = (typeof scope === 'object') ? scope : document;
            return scope.querySelectorAll(els) || false;
        },
        hidden, visibilityChange, state,
        tabFocused = function(evt) {
            log("tab has focus!");
            if (document !== evt.target) {
                log("warning, document not equal to document. it is ");
                log(evt.target); // should be document
            }
            if (evt.target.body !== document.activeElement) {
                log("warning, document.activeElement not equal to document.body. it is ");
                log(evt.target.body); // should be document.body
            }
        },
        elmTarget = qS("#trackInfoInner > div.inline_player > table > tbody > tr:nth-child(1) > td.play_cell > a > div");
    if (!elmTarget) {
        log('main play button not found, exiting');
        return;
    }

    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
    }

    if ('undefined' === typeof hidden) {
        log('document.hidden not found, exiting');
        return;
    }

    document.addEventListener(visibilityChange, function(e) {
        return (false === document[hidden]) && tabFocused(e);
    });
    window.addEventListener('keydown', function(e) {
        log("in keydown");
        if(e.key === " " && e.target === document.body) {
            log("keydown ok");
            e.preventDefault();
        }
    });
    qS('body').addEventListener("keyup", function(e) {
        log("in keyup");
        if (e.key === " " && e.target === document.body) {
            e.preventDefault();
            elmTarget.focus();
            elmTarget.click();
            elmTarget.blur();
            log("keyup ok");
        }
    });
})();
