// ==UserScript==
// @name         Deezer - Fix favorite tracks sorting
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.deezer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377110/Deezer%20-%20Fix%20favorite%20tracks%20sorting.user.js
// @updateURL https://update.greasyfork.org/scripts/377110/Deezer%20-%20Fix%20favorite%20tracks%20sorting.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function rafAsync() {
        return new Promise(resolve => {
            requestAnimationFrame(resolve); //faster than set time out
        });
    }

    function checkElement(selector) {
        if (document.querySelector(selector) === null) {
            return rafAsync().then(() => checkElement(selector));
        } else {
            return Promise.resolve(true);
        }
    }

    let sortTracks = () => {
        checkElement('.dropdown .dropdown-toggle')
            .then((element) => {
            document.querySelectorAll('.dropdown .dropdown-toggle')[0].click();
            document.querySelectorAll('.dropdown .dropdown-menu .dropdown-item a')[0].click();
        });
    };

    (function(history){
        var pushState = history.pushState;
        history.pushState = function(state) {
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            if (arguments[2].match(/loved$/)) {
                sortTracks();
            }
            return pushState.apply(history, arguments);
        };
    })(window.history);

    if (window.location.href.match(/loved$/)) {
        sortTracks();
    }
})();