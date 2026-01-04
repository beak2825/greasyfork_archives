// ==UserScript==
// @name         lemures Geoguessr Mode
// @version      1.0
// @description  only for lemures
// @author       lemures
// @icon         https://s2.loli.net/2024/01/17/4nqsveVoH8A1mTB.png
// @match        https://www.geoguessr.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1241829
// @downloadURL https://update.greasyfork.org/scripts/485150/lemures%20Geoguessr%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/485150/lemures%20Geoguessr%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceURLs() {
        var links = document.querySelectorAll('a, img, link, script');
        var originalURL = '/static/avatars/tiers/low-quality/tier-60.webp';
        var targetURL = 'https://s2.loli.net/2024/01/18/4Cjvk3UnN6d821f.png';
        links.forEach(function(element) {
            var currentURL = element.getAttribute('href') || element.getAttribute('src');
            if (currentURL && currentURL.indexOf(originalURL) !== -1) {
                var newURL = currentURL.replace(originalURL, targetURL);
                element.setAttribute('href', newURL);
                element.setAttribute('src', newURL);
            }
        });
    var elements = document.querySelectorAll('.startpage_globe__6kSa4');
        elements.forEach(function(el) {
            el.parentNode.removeChild(el);
        });
        var elements1 = document.querySelectorAll('.maprunner-signed-in-start-page_playDailyReminder__qh8I3');
        elements1.forEach(function(el) {
        });
    var root = document.querySelector('body');
        if(root) {
            var colorProperties = [
                { key: '--ds-color-green-80', value: '#9b1712' },
                { key: '--ds-color-white', value: '#FECE1B' },
                { key: '--ds-color-purple-20', value: '#9b1712' },
                { key: '--ds-color-purple-50', value: '#9b1712' },
                { key: '--ds-color-purple-80', value: '#2e2401' },
                { key: '--ds-color-white-40', value: '#000000' },
                { key: '--darkreader-text--ds-color-purple-20', value: '#9b1712' },
            ];

            colorProperties.forEach(function(prop) {
                var color = getComputedStyle(root).getPropertyValue(prop.key);
                if(color) {
                    root.style.setProperty(prop.key, prop.value);
                }
            });
            var statusInner = document.querySelector('.slanted-wrapper_root__2eaEs');
            if (statusInner) {
                statusInner.style.setProperty('--variant-background-color', 'url("https://s2.loli.net/2024/01/07/7qTBPfNpiLbyQnG.png")');
            }
        }
        var elements12 = document.querySelectorAll('.startpage_globe__6kSa4');
        elements12.forEach(function(el) {
            el.parentNode.removeChild(el);
        });
        var elements123 = document.querySelectorAll('.maprunner-signed-in-start-page_playDailyReminder__qh8I3');
        elements123.forEach(function(el) {
        });
      }
    setInterval(replaceURLs, 1);
})();
