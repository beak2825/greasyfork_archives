// ==UserScript==
// @name         Add Newest Tab and NSFW filter back to Gumroad
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds the "Newest" tab, and the NSFW filter option back to Gumroad
// @author       TohruTheDragon
// @match        https://gumroad.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509153/Add%20Newest%20Tab%20and%20NSFW%20filter%20back%20to%20Gumroad.user.js
// @updateURL https://update.greasyfork.org/scripts/509153/Add%20Newest%20Tab%20and%20NSFW%20filter%20back%20to%20Gumroad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addNewestTab() {
        var tabList = document.querySelector('.tab-pills[role="tablist"]');
        if (tabList) {
            var newestTab = document.createElement('div');
            newestTab.setAttribute('role', 'tab');
            newestTab.setAttribute('aria-selected', 'false');
            newestTab.textContent = 'Newest';
            newestTab.style.cursor = 'pointer';

            newestTab.addEventListener('click', function () {
                window.location.href = '?sort=newest';
            });

            tabList.appendChild(newestTab);
        }
    }

    function addNSFWSwitch() {
        var detailsElements = document.querySelectorAll('.stack details');
        var lastDetails = detailsElements[detailsElements.length - 1];

        if (lastDetails) {
            var toggleContainer = document.createElement('div');
            toggleContainer.style.display = 'flex';
            toggleContainer.style.alignItems = 'center';
            toggleContainer.style.marginTop = '10px';

            var label = document.createElement('label');
            label.textContent = 'NSFW Content';
            toggleContainer.appendChild(label);

            var toggleSwitch = document.createElement('input');
            toggleSwitch.type = 'checkbox';
            toggleSwitch.style.marginLeft = '10px';
            toggleSwitch.style.border = '1px solid white';
            toggleContainer.appendChild(toggleSwitch);

            lastDetails.appendChild(toggleContainer);

            function updateAndRedirect() {
                var currentURL = new URL(window.location.href);
                currentURL.searchParams.set('show_nsfw', toggleSwitch.checked ? 'yes' : 'no');
                window.location.href = currentURL.toString();
            }

            toggleSwitch.addEventListener('change', updateAndRedirect);

            var currentURLParams = new URLSearchParams(window.location.search);
            if (currentURLParams.get('show_nsfw') === 'yes') {
                toggleSwitch.checked = true;
            } else {
                toggleSwitch.checked = false;
            }
        }
    }

    window.addEventListener('DOMContentLoaded', function () {
        setTimeout(function() {
            addNewestTab();
            addNSFWSwitch();
        }, 500);
    });
})();
