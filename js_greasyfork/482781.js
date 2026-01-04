// ==UserScript==
// @name         Coub.com Auto Scroll
// @namespace    coub-auto-scroll-h1ghsyst3m
// @version      0.6
// @license      MIT
// @description  Auto-scroll in Coub.com all 20 Seconds.
// @author       H1ghSyst3m
// @match        https://coub.com
// @match        https://coub.com/*
// @exclude      https://coub.com/view/*
// @exclude      https://coub.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482781/Coubcom%20Auto%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/482781/Coubcom%20Auto%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var scrollInterval;
    var intervalTime = 20000; // 20 seconds
    var isAutoScrollPaused = false;

    function setScrollInterval() {
        clearScrollInterval();
        if (!isAutoScrollPaused) {
            scrollInterval = setInterval(scrollNextCoub, intervalTime);
        }
    }

    function clearScrollInterval() {
        clearInterval(scrollInterval);
    }

    function scrollNextCoub() {
        var nextCoub = document.querySelector("div.coub.active").nextSibling;
        nextCoub.scrollIntoView({ behavior: 'smooth', block: 'end' });
        setScrollInterval();
    }

    function scrollPrevCoub() {
        var prevCoub = document.querySelector("div.coub.active").previousSibling;
        prevCoub.scrollIntoView({ behavior: 'smooth', block: 'end' });
        setScrollInterval();
    }

    function toggleAutoScroll() {
        isAutoScrollPaused = !isAutoScrollPaused;
        isAutoScrollPaused ? clearScrollInterval() : setScrollInterval();
        pauseButton.innerHTML = isAutoScrollPaused ? '▶' : '⏸';
    }

    // Add scroll controls
    var scrollDown = createButton('↓', scrollNextCoub);
    var scrollUp = createButton('↑', scrollPrevCoub);
    var pauseButton = createButton('⏸', toggleAutoScroll);

    // Utility function to create a button
    function createButton(symbol, onClickFunction) {
        var button = document.createElement("div");
        button.style = "position:fixed;z-index:9900;right:20px;bottom:100px;opacity:70%;background-color:#2196F3;color:white;border:2px solid white;font-weight:bold;display:flex;align-items:center;justify-content:center;width:50px;height:50px;border-radius:25px;font-size:20pt;cursor:pointer;margin-bottom:10px;";
        button.innerHTML = symbol;
        button.onclick = onClickFunction;
        document.body.appendChild(button);
        return button;
    }

    // Positioning the buttons
    scrollDown.style.bottom = '100px';
    scrollUp.style.bottom = '160px';
    pauseButton.style.bottom = '220px';

    // Initialize the auto-scroll interval
    setScrollInterval();
})();