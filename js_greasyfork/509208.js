// ==UserScript==
// @name         Fix HKU Moodle Right Section Bug When Clicking Buttons/Hyperlinks Inside
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  fix right section popping up when clicking buttons/hyperlinks inside
// @author       SimonTheLiquid
// @match        https://moodle.hku.hk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hku.hk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509208/Fix%20HKU%20Moodle%20Right%20Section%20Bug%20When%20Clicking%20ButtonsHyperlinks%20Inside.user.js
// @updateURL https://update.greasyfork.org/scripts/509208/Fix%20HKU%20Moodle%20Right%20Section%20Bug%20When%20Clicking%20ButtonsHyperlinks%20Inside.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const drawer = document.querySelector('[class*="drawer-right"]');

    const as = drawer.querySelectorAll('a,button');
    for (var i = 0; i < as.length; i++)
    {
        as[i].onmousedown = function(event) {
            drawer.setAttribute('style', 'position:absolute');
            drawer.setAttribute('style', 'position:fixed');
        }
    }

    var observer = new MutationObserver(function(mutations) {
        const as = drawer.querySelectorAll('a,button');
        for (var i = 0; i < as.length; i++)
        {
            as[i].onmousedown = function(event) {
                drawer.setAttribute('style', 'position:absolute');
                drawer.setAttribute('style', 'position:fixed');
            }
        }
    });

    observer.observe(drawer, {
        subtree: true,
        childList: true,
    });

})();