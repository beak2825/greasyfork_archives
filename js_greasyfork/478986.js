// ==UserScript==
// @name         Hide ads elements Fly.inc
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Full Hide ads elements Fly.inc
// @author       Alberto
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478986/Hide%20ads%20elements%20Flyinc.user.js
// @updateURL https://update.greasyfork.org/scripts/478986/Hide%20ads%20elements%20Flyinc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var globalRules = [
        { selector: 'form > center', action: 'display: none' },
        { selector: 'form.text.center > center', action: 'display: none' },
        //{ selector: 'center:nth-of-type(1)', action: 'display: none' },
        //{ selector: 'center:nth-of-type(2)', action: 'display: none' },
        //{ selector: 'center:nth-of-type(3)', action: 'display: none' },
        //{ selector: 'center:nth-of-type(4)', action: 'display: none' },
        //{ selector: 'center:nth-of-type(5)', action: 'display: none' },
        { selector: 'center:nth-of-type(6)', action: 'display: none' },
        { selector: '.a', action: 'display: none' }
    ];

    var currentHostname = window.location.hostname;

    var allowedPages = [
        'allcryptoz.net',
        'batmanfactor.com',
        'crewus.net',
        'gametechreviewer.com',
        'misterio.ro',
        'phineypet.com',
        'rsadnetworkinfo.com',
        'rseducationinfo.com',
        'rshostinginfo.com',
        'rsfinanceinfo.com',
        'rsinsuranceinfo.com',
        'rssoftwareinfo.com',
        'shinbhu.net',
        'talkforfitness.com',
        'techedifier.com',
        'thumb8.net',
        'thumb9.net',
        'topcryptoz.net',
        'ultraten.net',
        'uniqueten.net'
    ];

    allowedPages.sort();

    if (allowedPages.includes(currentHostname)) {
        globalRules.forEach(function(rule) {
            var elementsToHide = document.querySelectorAll(rule.selector);
            elementsToHide.forEach(function(element) {
                element.style = rule.action;
            });
        });
    }
})();
