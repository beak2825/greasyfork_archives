// ==UserScript==
// @name         Collapse Sidebar in Academic Websites
// @namespace    https://github.com/henflower/Sci-scripts/blob/main/Collapse-sidebar.js
// @version      0.27
// @description  Make elements on multiple websites collapsible
// @author       Henflower
// @match        *://*nature.com/articles/*
// @match        *://*sciencedirect.com/*
// @match        *://*ncbi.nlm.nih.gov/pmc/articles/*
// @match        *://*science.org/doi/*
// @match        *://*academic.oup.com/*
// @match        *://*onlinelibrary.wiley.com/doi/*
// @match        *://*biomedcentral.com/articles/*
// @match        *://*.virtual.anu.edu.au/* //Here is hostname of my school's virtual vpn, replace it with your's
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471245/Collapse%20Sidebar%20in%20Academic%20Websites.user.js
// @updateURL https://update.greasyfork.org/scripts/471245/Collapse%20Sidebar%20in%20Academic%20Websites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a style element to hold CSS for the collapsible button
    const style = document.createElement('style');
    style.textContent = `
        .collapsible-button {
            position: fixed !important;
            top: 10px !important;
            right: 10px !important;
            z-index: 9999 !important;
            width: 25px !important;
            height: 25px !important;
            border-radius: 50% !important;
            opacity: 0.8 !important;
            text-align: center !important;
        }
    `;
    // Append the style element to the document head
    document.head.appendChild(style);

    // Define the elements that should be collapsible on each website
    const collapsibleElements = [
        {
            hostname: /nature.com/,
            selector: '.c-article-extras.u-hide-print',
            articleSelector: 'main.c-article-main-column'
        },
        {
            hostname: /sciencedirect.com/,
            selector: '.u-show-from-lg, .u-show-from-md',
            articleSelector: '.col-lg-12, .row>.col-lg-12'
        },
        {
            hostname: /ncbi.nlm.nih.gov/,
            selector: '.pmc-sidebar, .usa-nav',
            articleSelector: '.pmc-article'
        },
        {
            hostname: /academic.oup.com/,
            selector: '.page-column--left, .page-column--right',
            articleSelector: '.page-column--center'
        },
        {
            hostname: /onlinelibrary.wiley.com/,
            selector: '.article-row-right',
            articleSelector: '.article-row-left'
        },
        {
            hostname: /biomedcentral.com/,
            selector: '.c-article-extras',
            articleSelector: '.c-article-main-column'
        }
        // Additional websites can be added here
    ];

    // Function to add a collapsible button to the specified elements
    function addCollapsibleButton(element, article) {
        // Create a button element
        const button = document.createElement('button');
        button.innerText = '-';
        button.classList.add('collapsible-button');
        // Add a click event listener to toggle the display of the sidebar
        button.addEventListener('click', () => {
            if (element.style.display === 'none') {
                // If the sidebar is hidden, show it and reset styles
                element.style.display = 'block';
                element.style.position = ''; // Reset the position of the element
                article.style.width = ''; // Reset the width of the article
                button.innerText = '-';
            } else {
                // If the sidebar is visible, hide it and adjust styles
                element.style.setProperty('display', 'none', 'important');
                element.style.setProperty('position', 'static', 'important');
                article.style.setProperty('width', '100%', 'important');
                button.innerText = '+';
            }
        });
        // Append the button to the document body
        document.body.appendChild(button);
    }

    // Get the current hostname from the window location
    const currentHostname = window.location.hostname;
    // Filter the collapsible elements for the current website
    const currentCollapsibleElements = collapsibleElements.filter(
        (element) => element.hostname.test(currentHostname)
    );
    // For each collapsible element, add a button to toggle its display
    currentCollapsibleElements.forEach((element) => {
        const el = document.querySelector(element.selector);
        const article = document.querySelector(element.articleSelector);
        if (el && article) {
            addCollapsibleButton(el, article);
        }
    });
})();
