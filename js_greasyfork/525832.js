// ==UserScript==
// @name         mf-adblock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a basic anti-adblock workaround that can remove or click elements on a website
// @author       Hasan-Abbas
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525832/mf-adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/525832/mf-adblock.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // here is the config ... just an example
    let sites = {
        'www.a-website.com': { // website domain
            click: ['.class', '#element'], // click this elements (used for cookie consent)
            remove: ['.ad', '#banner'], // hide this elements (used for ads)
            interaction: true, // move mouse cursor to trigger onmousemove ads
            timeout: 0, // in ms wait timeout before doing something
            interval: 0, // in ms interval redo everything after this time (used if ads are added onscroll or timeout)
            background: '#ffffff' // set a background-color, overflow:scroll and position for custom fullpage ads
        },
    }

    let interval = null;

    let hostname = document.location.hostname;

    function cleanup() {

        if (sites[hostname].interaction) {
            document.body.dispatchEvent(new MouseEvent('mousemove'));
        }

        if (sites[hostname].remove) {
            let selectors = sites[hostname].remove;

            selectors.forEach(function (selector) {
                let elements = document.querySelectorAll(selector);

                console.log(selector, elements);

                elements.forEach(function (elem) {
                    elem.style.visibility = 'hidden';
                    elem.style.width = '1px';
                    elem.style.height = '1px';
                    elem.style.overflow = 'hidden';
                    elem.style.opacity = 0;
                });
            });
        }

        if (sites[hostname].background) {
            document.body.style.background = sites[hostname].background;
            document.body.style.overflow = 'scroll';
            document.body.style.position = 'static';
        }

        if (sites[hostname].click) {
            let selectors = sites[hostname].click;

            selectors.forEach(function (selector) {
                let element = document.querySelector(selector);

                if (element !== null) {
                    element.click();
                }
            });
        }
    }

    if (Object.keys(sites).indexOf(hostname) >= 0) {

        let timeout = 0;
        if (sites[hostname].timeout) {
            timeout = sites[hostname].timeout;
        }

        window.setTimeout(function () {
            cleanup();
        }, timeout);

        if (sites[hostname].interval) {
            if (interval === null) {
                interval = window.setInterval(function () {
                    cleanup();
                }, sites[hostname].interval);
            }
        }
    }
})();