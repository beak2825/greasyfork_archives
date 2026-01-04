// ==UserScript==
// @name         Apple Music Context menu Replacer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces the browser context menu with the apple music one
// @author       Cadentem
// @match        https://*.music.apple.com/*
// @icon         https://www.google.com/s2/favicons?domain=music.apple.com
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/432617/Apple%20Music%20Context%20menu%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/432617/Apple%20Music%20Context%20menu%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let simulateClick = function (element, clientX, clientY) {
        // calling .click() does not work

        let event = new MouseEvent('click', {
            clientX: clientX,
            clientY: clientY
        });

        element.dispatchEvent(event);
    };

    let run = function() {
        // do a maximum of 10 tries
        let maxWait = 5000;

        let waitFor = (...selectors) => new Promise(resolve => {
            let delay = 500

            let resolver = () => {
                // make sure the required elements are loaded
                let songControlls = document.getElementsByClassName("songs-list-row");

                if (songControlls.length === 0) {
                    // Titles page
                    songControlls = document.getElementsByClassName("library-track");
                }

                if (songControlls.length > 0 || maxWait <= 0) {
                    resolve(songControlls)
                } else {
                    maxWait = maxWait - delay;
                    setTimeout(resolver, delay)
                }
            }

            resolver();
        });

        waitFor().then((songControlls) => {
            for (let songControll of songControlls) {
                songControll.addEventListener('contextmenu', function(event) {
                    event.preventDefault();

                    let controll = songControll.getElementsByClassName("context-menu__overflow ")[0];

                    if (controll) {
                        simulateClick(controll, event.clientX, event.clientY);
                    }
                });
            }
        });
    }

    if (window.onurlchange === null) {
        window.addEventListener('urlchange', (info) => {
            run()
        });
    }

    run();
})();