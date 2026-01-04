// ==UserScript==
// @name         Alcasthq twitch and ad video remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Blocks the Twitch video player and the side ad from loading.
// @author       You
// @match        https://alcasthq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alcasthq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467361/Alcasthq%20twitch%20and%20ad%20video%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/467361/Alcasthq%20twitch%20and%20ad%20video%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        let log = function(msg) {
            console.log('[AlCastHq Ad Remover]: ' + msg)
        }

        log('loaded')
        const elementNames = ['custom_html-15', 'nn_player']

        elementNames.forEach(function (eleName) {
            log('Searching for element "' + eleName + '"')
            const element = document.getElementById(eleName)

            if (element) {
                log('found! Removing')
                element.remove()
            } else {
                log('...couldn\'t find')
            }
        })
    }, false);
})();