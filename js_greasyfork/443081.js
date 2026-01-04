// ==UserScript==
// @name         Penpa Streaming Layout
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Upates Penpa+ layout for better streaming.
// @author       Orphis
// @match        https://swaroopg92.github.io/penpa-edit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443081/Penpa%20Streaming%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/443081/Penpa%20Streaming%20Layout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hide_element_by_id(s) {
        let element = document.getElementById(s);
        element.parentElement.style.display = 'none';
    }

    window.addEventListener('load', function() {
        // Use flex display in the app-container element for easy positioning
        let appContainer = document.getElementById('app-container');
        appContainer.style.display = 'flex';
        // Use left depending on your cropping settings in OBS
        appContainer.style.justifyContent = 'left';
        // Use flex-start or flex-end to move the element on top or bottom of the screen,
        // making room for a camera possibly
        appContainer.style.alignItems = 'flex-start';
        // Remove if you want the toolbox, grid and rules in this order,
        // Remember to tweak margins if you do
        appContainer.style.flexDirection = 'row-reverse';
        appContainer.style.marginLeft = '30px';

        // Add margins around the tool-container so it's not touching the grid
        let toolContainer = document.getElementById('tool-container');
        toolContainer.style.marginLeft = '20px';
        toolContainer.style.marginRight = '20px';
        toolContainer.style.marginTop = '6px';
        let buttons = document.getElementById('buttons');
        buttons.style.width = '600px';
        buttons.style.minHeight = '200px';
        buttons.style.marginLeft = '0px';

        // Extract rules and format them
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let puzzleDescription = decrypt_data(urlParams.get('p').replace(/ /g, '+')).split("\n")[0].split(',');

        if (puzzleDescription[18]) {
            let rules = puzzleDescription[18].replace(/%2C/g, ',').replace(/%2D/g, '</span><br><span style="user-select:text">').replace(/%2E/g, '&').replace(/%2F/g, '=');

            // Add rules to the page, making them selectable
            let div = document.createElement('div');
            div.id = 'rules_div';
            let p = document.createElement('p');
            div.appendChild(p);
            div.style.userSelect = 'text';
            div.style.marginTop = '20px';
            div.style.maxWidth = '800px';
            p.innerHTML = "<span style=\"user-select:text\">" + rules + "</span>";
            toolContainer.firstElementChild.appendChild(div);
            hide_element_by_id('puzzlerules');
        }

        // Make the title bigger, hide the show rules button
        if (puzzleDescription[16]) {
            let title = puzzleDescription[15].replace(/Title: /, '');
            let author = puzzleDescription[16].replace(/Author: /, '');

            let puzzleInfo = document.getElementById('puzzleinfo');
            puzzleInfo.style.width = 'auto';
            let newTitle = document.createElement('h1');
            newTitle.textContent = title;
            if (author.length > 0)
                newTitle.textContent += " - " + author;

            puzzleInfo.prepend(newTitle);

            hide_element_by_id('puzzletitle');
            hide_element_by_id('puzzleauthor');
        }

        console.log("Custom Penpa styles applied.");
    }, false);
})();