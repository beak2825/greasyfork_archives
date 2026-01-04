// ==UserScript==
// @name         ProNounProject
// @namespace    https://fodi.be/
// @version      0.2
// @description  Enhanced UI for TheNounProject.com
// @author       https://fodi.be
// @match        https://thenounproject.com/browse/*
// @match        https://thenounproject.com/search/*
// @icon         https://static.production.thenounproject.com/img/favicons/apple-touch-icon.7fb1143e988e.png
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447667/ProNounProject.user.js
// @updateURL https://update.greasyfork.org/scripts/447667/ProNounProject.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CONFIG STARTS HERE
    var AUTOCLICKER_INTERVAL_SECONDS = 5;
    // CONFIG ENDS HERE

    var loadNextAutoClicker;
    var loadNextPages = 500;

    GM_registerMenuCommand('Load 5 pages', startLoadNextAutoClicker5, '1');
    GM_registerMenuCommand('Load 50 pages', startLoadNextAutoClicker50, '2');
    GM_registerMenuCommand('Load 500 pages', startLoadNextAutoClicker500, '3');
    GM_registerMenuCommand('Load X pages', startLoadNextAutoClickerX, 'x');
    GM_registerMenuCommand('Stop loading', stopLoadNextAutoClicker, 's');
    GM_registerMenuCommand('Add keywords to icons', addKeywordsToIcons, 'k');

    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    function loadNextClicker() {

        scrollToBottom();

        var nextButtonCount = 0;

        if(loadNextPages > 0) {
            document.querySelectorAll("button").forEach(function(el) {
                if(el.innerText.includes("Load Next")) {
                    nextButtonCount++;
                    loadNextPages--;
                    el.click();
                    setTimeout(scrollToBottom, 500);
                }
            });
        }

        // clear autoclicker interval if necessary
        if(!nextButtonCount && loadNextAutoClicker) {
            clearInterval(loadNextAutoClicker);
        }
    }

    function startLoadNextAutoClicker5() {
        loadNextPages = 5;
        startLoadNextAutoClicker();
    }

    function startLoadNextAutoClicker50() {
        loadNextPages = 50;
        startLoadNextAutoClicker();
    }

    function startLoadNextAutoClicker500() {
         loadNextPages = 500;
        startLoadNextAutoClicker();
    }

    function startLoadNextAutoClickerX() {
        loadNextPages = parseInt(prompt("How many pages to load?"));
        startLoadNextAutoClicker();
    }

    function startLoadNextAutoClicker() {
        loadNextClicker();
        loadNextAutoClicker = setInterval(loadNextClicker, AUTOCLICKER_INTERVAL_SECONDS * 1000);
    }

    function stopLoadNextAutoClicker() {
        clearInterval(loadNextAutoClicker);
        scrollToBottom();
    }

    function addKeywordsToIcons() {
        document.querySelectorAll(".pronounproject-keyword").forEach(function(el) {
            el.remove();
        });

        document.querySelectorAll("img").forEach(function(el) {
			if(el.src.includes("https://static.thenounproject.com/png/")) {
				var desc = document.createElement("span");
                desc.className = 'pronounproject-keyword';
				desc.innerHTML = el.getAttribute("alt");
				el.parentElement.appendChild(desc);
			}
		});
    }
})();