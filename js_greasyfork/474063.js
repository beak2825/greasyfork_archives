// ==UserScript==
// @name         新浪邮箱广告去除器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可以去除新浪邮箱网页版里的广告
// @author       Firepup6500
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474063/%E6%96%B0%E6%B5%AA%E9%82%AE%E7%AE%B1%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/474063/%E6%96%B0%E6%B5%AA%E9%82%AE%E7%AE%B1%E5%B9%BF%E5%91%8A%E5%8E%BB%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (() => {
        let oldPushState = history.pushState;
        history.pushState = function pushState() {
            let ret = oldPushState.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };

        let oldReplaceState = history.replaceState;
        history.replaceState = function replaceState() {
            let ret = oldReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });
    })();
    let sites = {
        /*
        'example.com': { // website domain, can be regex.
            remove: ['.some-class','#some-element'], // Hide these elements (used for ads) - (DOES NOT REMOVE THEM, JUST HIDES THEM)
            click: ['.class','#element'], // Click these elements (used for cookie consent)
            interaction: true, // Move mouse cursor to trigger `onmousemove` ads
            timeout: 2000, // In MS, how long to wait before doing anything
            interval: 0, // In MS, how long to wait before redoing everything (Ignored if 0 or missing) (used if ads are added onscroll or timeout)
            onChange: true, // Redo everything once page changes, but no refresh/reload occurs (IE: Discourse)
            antiVignette: true, // Auto fix google vignette based issues
            trueRemove: true // Actually remove elements instead of hiding them (WARNING: Might trigger adblock detection!)
            background: '#ffffff' // Set a background-color, overflow:scroll, and position (used for custom fullpage ads)
        },
        */
        '.*\.?mail.sina\.com': {
            remove: ['#sinaadToolkitBox0', '.extendAd', 'div.extendAd','.top-ads-container','.bottom-ads-container','#WikiaBar','.notifications-placeholder','.gpt-ad'],
            interaction: true,
            timeout: 5000,
            interval: 2000,
            trueRemove: true
        },
    }

    let interval = null;

    let hostname = document.location.hostname;

    let loaded = false;

    function cleanup() {
        console.log("Running cleanup...");
        if(sites[hostname].interaction) {
            document.body.dispatchEvent(new MouseEvent('mousemove'));
        }

        if(sites[hostname].remove) {
            let selectors = sites[hostname].remove;

            selectors.forEach(function(selector) {
                let elements = document.querySelectorAll(selector);

                console.log(selector, elements);

                elements.forEach(function(elem) {
                    if (!sites[hostname].trueRemove) {
                        elem.style.visibility = 'hidden';
                        elem.style.width = '1px';
                        elem.style.height = '1px';
                        elem.style.overflow = 'hidden';
                        elem.style.opacity = 0;
                    } else {
                        elem.remove();
                    }
                });
            });
        }

        if(sites[hostname].background) {
            document.body.style.background = sites[hostname].background;
            document.body.style.overflow = 'scroll';
            document.body.style.position = 'static';
        }

        if(sites[hostname].click) {
            let selectors = sites[hostname].click;

            selectors.forEach(function(selector) {
                let element = document.querySelector(selector);

                if(!!element) {
                    element.click();
                }
            });
        }

        if(sites[hostname].antiVignette && window.location.hash && window.location.hash == "#google_vignette") {
            window.location.href = window.location.href.split("#")[0]
        }
    }

    if (!Object.keys(sites).indexOf(hostname) >= 0) {
        for (const site in sites) {
            const regex = new RegExp(site, "i");
            if(regex.test(hostname)) {
                hostname = site;
            }
        }
    }

    if(Object.keys(sites).indexOf(hostname) >= 0) {

        let timeout = 0;
        if(sites[hostname].timeout) {
            timeout = sites[hostname].timeout;
        }

        window.setTimeout(function(){
            cleanup();
        }, timeout);

        if(sites[hostname].interval && !interval) {
            interval = window.setInterval(function(){
                cleanup();
            }, sites[hostname].interval);
        }

        if(sites[hostname].onChange && !loaded) {
            loaded = true;
            window.addEventListener('locationchange', function () {
                window.setTimeout(function(){
                    cleanup();
                }, timeout);
            });
        }
    }
})();