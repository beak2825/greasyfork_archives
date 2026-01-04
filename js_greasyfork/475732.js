// ==UserScript==
// @name         Auto TGM Courses 2BHIT
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Öffnet alle Kurse für die 2BHIT und wartet bis sie geladen haben und schließt sie wieder. So wird den Lehrern angezeigt das du im Kurs warst.
// @author       Marschi.xyz
// @match        https://elearning.tgm.ac.at/*
// @icon         https://elearning.tgm.ac.at/pluginfile.php/1/theme_boost_union/logocompact/300x300/1678884806/tgm_logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475732/Auto%20TGM%20Courses%202BHIT.user.js
// @updateURL https://update.greasyfork.org/scripts/475732/Auto%20TGM%20Courses%202BHIT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define an array of URLs you want to open
    const linksToOpen = [
        'https://elearning.tgm.ac.at/course/view.php?id=1469',
        'https://elearning.tgm.ac.at/course/view.php?id=101',
        'https://elearning.tgm.ac.at/course/view.php?id=2077',
        'https://elearning.tgm.ac.at/course/view.php?id=1684',
        'https://elearning.tgm.ac.at/course/view.php?id=1648',
        'https://elearning.tgm.ac.at/course/view.php?id=2194',
        'https://elearning.tgm.ac.at/course/view.php?id=1826',
        'https://elearning.tgm.ac.at/course/view.php?id=1524',
        'https://elearning.tgm.ac.at/course/view.php?id=1544',
        'https://elearning.tgm.ac.at/course/view.php?id=1629',
        'https://elearning.tgm.ac.at/course/view.php?id=1986',
        'https://elearning.tgm.ac.at/course/view.php?id=1681',
        'https://elearning.tgm.ac.at/course/view.php?id=199',
    ];

    // Function to open the links in new tabs and store their references
    const openedTabs = [];
    function openLinksInTabs() {
        for (const link of linksToOpen) {
            const tab = window.open(link, '_blank');
            openedTabs.push(tab);
        }
        checkTabsLoaded();
    }

    // Function to check if all opened tabs have loaded
    function checkTabsLoaded() {
        let allTabsLoaded = true;
        for (const tab of openedTabs) {
            if (tab && !tab.closed && tab.document.readyState !== 'complete') {
                allTabsLoaded = false;
                break;
            }
        }

        if (allTabsLoaded) {
            setTimeout(closeTabs, 5000); // Close tabs after 5 seconds
        } else {
            setTimeout(checkTabsLoaded, 100); // Check again after 100 milliseconds
        }
    }

    // Function to close the opened tabs
    function closeTabs() {
        for (const tab of openedTabs) {
            if (tab && !tab.closed) {
                tab.close();
            }
        }
    }

    // Create a button element
    const openAndCloseCoursesButton = document.createElement('button');
    openAndCloseCoursesButton.innerText = 'Open All';
    openAndCloseCoursesButton.style.padding = '10px';
    openAndCloseCoursesButton.style.backgroundColor = 'white';
    openAndCloseCoursesButton.style.color = 'black';
    openAndCloseCoursesButton.style.border = 'none';
    openAndCloseCoursesButton.style.cursor = 'pointer';

    // Add a click event listener to the button
    openAndCloseCoursesButton.addEventListener('click', openLinksInTabs);

    // Append the button to the specific page
    const targetElement = document.querySelector('.navbar');
    if (targetElement) {
        targetElement.appendChild(openAndCloseCoursesButton);
    }
})();