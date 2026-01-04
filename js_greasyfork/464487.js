// ==UserScript==
// @name         Jira touch scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  Someone had to do it... Atlassian, please fix.
// @author       Creta Park
// @match        https://*.atlassian.net/jira/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464487/Jira%20touch%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/464487/Jira%20touch%20scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Smoothness of swiping gesture for scroll.
    let swipeSmoothness = 4;

    swipeSmoothness = 1 + (1 / swipeSmoothness);
    if (swipeSmoothness < 0)
        swipeSmoothness = NaN;

    function addTouchScrolling(element) {
        let startY;
        let deltaY;
        let swipeID = 0;

        element.addEventListener("touchstart", (e) => {
            clearTimeout(swipeID);
            e.preventDefault();
            startY = e.touches[0].clientY;
        });

        element.addEventListener("touchmove", (e) => {
            deltaY = startY - e.touches[0].clientY;
            element.scrollTop += deltaY;
            startY = e.touches[0].clientY;
        });

        element.addEventListener("touchend", (e) => {
            if (!isNaN(swipeSmoothness))
                swipeID = setTimeout(swipeScroll, 16, deltaY);
        });

        function swipeScroll(deltaY) {
            element.scrollTop += deltaY;
            swipeID = setTimeout(swipeScroll, 16, deltaY / swipeSmoothness);
        }
    }
    
    //TODO : Maybe better use MutationObserver, but I have no time for doing it...
    //       This trying registers touch event for these each second.
    var registered = [];

    setInterval(() => {

        var list = Array.from(document.querySelectorAll('[data-component-selector*="full-size-mode-column"]'));

        for (var el of list) {

            if (registered.includes(el))
                continue;

            registered.push(el);
            addTouchScrolling(el.parentElement);
        }

    }, 1000);

    console.log("Confluence story touch scroll enabled.");
})();