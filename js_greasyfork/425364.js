// ==UserScript==
// @name         Transparent Navigation Bar
// @namespace    http://tampermonkey.net/
// @version      0.1.0.3
// @description  Transform supported site's navigation bar into an acrylic nav bar.
// @author       Z.H. Shing
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425364/Transparent%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/425364/Transparent%20Navigation%20Bar.meta.js
// ==/UserScript==

(function() {
    const currentDomain = window.location.hostname;
    const path = window.location.pathname;
    const fullPath = currentDomain + path;


    // commonly used styles
    const commonStyles = {
        whiteBackgroundColor: 'rgba(255, 255, 255, 0.7)',
        blackBackgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilters: 'blur(50px) saturate(180%)'
    };


    // matching
    // You should add supported sites here. All items shall be sorted alphabetically.

    // Cambridge Dictionary
    if (currentDomain.match(/dictionary\.cambridge\.org/) !== null) {
        cambridgeDictionary();
        return;
    }

    // Google Classroom
    if (currentDomain.match(/classroom\.google\.com/) !== null) {
        googleClassroom();
        return;
    }

    // Google Search
    if (fullPath.match(/www\.google\..*\/search/) !== null) {
        googleSearch();
        return;
    }

    // UK Royal Family
    if (currentDomain.match(/www\.royal\.uk/) !== null) {
        ukRoyalFamily();
        return;
    }

    // W3Schools
    if (currentDomain.match(/www\.w3schools\.com/) !== null) {
        wThreeSchools();
        return;
    }

    // YouTube
    if (currentDomain.match(/www\.youtube\.com/) !== null) {
        youTube();
        return;
    }


    // applies styles
    // Define functions for applying styles for your sites
    function cambridgeDictionary() {
        let navBar = document.querySelector('#header');
        navBar.style.background = 'rgba(29, 42, 87, 0.7)';
        navBar.style.backdropFilter = commonStyles.backdropFilters;

        // Remove sub item style override
        let navChildren = navBar.querySelectorAll(':scope > div')
        for (let i = 0; i < navChildren.length; i++) {
            let subElement = navChildren[i];
            subElement.classList.remove('bh');
            subElement.classList.remove('bs');
        }

        // Fix navbar text colour
        let navLinks = document.querySelectorAll('li.hdib');
        for (let i = 0; i < navLinks.length - 1; i++) {
            navLinks[i].childNodes[0].style.color = 'white';
        }
    }

    async function googleClassroom() {
        let navbar = document.querySelector('nav.joJglb');
        applyStyleToNavBar(navbar);

        // wait until page is loaded
        await sleep(5000)

        // side menu
        let sidemenu = document.querySelector('div.ETRkCe');
        applyStyleToNavBar(sidemenu);
    }

    function googleSearch() {
        // Finds the navigation bar
        let navBar = document.querySelector('div.sfbg'); // Google search
        if (navBar === null) navBar = document.querySelector('#kO001e'); // Google image search

        applyStyleToNavBar(navBar, true);
    }

    function ukRoyalFamily() {
        let navBar = document.querySelector('#nav-main');

        applyStyleToNavBar(navBar, true);
    }

    function wThreeSchools() {
        let navBar = document.querySelector('#topnav');
        navBar.style.background = 'rgba(95, 95, 95, 0.7)';
        navBar.style.backdropFilter = commonStyles.backdropFilters;
    }

    function youTube() {
        let navBar = document.querySelector('ytd-masthead#masthead');
        applyStyleToNavBar(navBar);
        document.querySelector('#chips-wrapper').style.background = "rgba(200, 200, 200, 0.7)";
        document.querySelector('#chips-wrapper').style.backdropFilter = commonStyles.backdropFilters;
    }


    // commonly used functions
    function applyStyleToNavBar(navBar, applyWhiteBg = true) {
        navBar.style.background = applyWhiteBg ? commonStyles.whiteBackgroundColor : commonStyles.blackBackgroundColor;
        navBar.style.backdropFilter = commonStyles.backdropFilters;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();