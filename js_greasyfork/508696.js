// ==UserScript==
// @name         FuckYou logo on YouTube
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Replace the YouTube logo with a custom logo styled to resemble the original logo but with the text "FuckYou."
// @author       Nairdah
// @license      MIT
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/508696/FuckYou%20logo%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/508696/FuckYou%20logo%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const svgNamespace = "http://www.w3.org/2000/svg";
    const darkModeColor = "#FFFFFF"; // White for dark mode
    const lightModeColor = "#212121"; // Dark color for light mode
    const videoPageColor = "#FFFFFF"; // White for video pages

    // Create the custom SVG logo
    function createCustomLogo(fillColor) {
        const customSVG = document.createElementNS(svgNamespace, 'svg');
        customSVG.setAttribute('width', '100');
        customSVG.setAttribute('height', '24');
        customSVG.setAttribute('viewBox', '0 0 688 240');
        customSVG.setAttribute('fill', 'none');
        customSVG.setAttribute('xmlns', svgNamespace);

        // SVG paths
        const paths = [
            { d: "M680.559 37.4794C676.619 22.7945 665.019 11.1781 650.355 7.23287C623.873 0 517.285 0 517.285 0C517.285 0 410.698 0.219178 384.216 7.45205C369.552 11.3973 357.952 23.0137 354.012 37.6986C347.009 64.2191 347.009 119.671 347.009 119.671C347.009 119.671 347.009 175.123 354.231 201.863C358.171 216.548 369.771 228.164 384.435 232.109C410.917 239.342 517.504 239.342 517.504 239.342C517.504 239.342 624.092 239.342 650.574 232.109C665.238 228.164 676.838 216.548 680.777 201.863C688 175.342 688 119.671 688 119.671C688 119.671 687.781 64.2191 680.559 37.4794Z", fill: "#FF0033" }, // Red background path
            { d: "M636 80V199.082H615.47L613.246 184.437H612.733C607.087 195.421 598.704 201 587.583 201C579.884 201 574.067 198.385 570.475 193.154C566.711 187.924 565 179.903 565 168.919V80H591.347V167.35C591.347 172.581 591.86 176.416 593.058 178.683C594.255 180.95 596.137 181.996 598.704 181.996C600.928 181.996 603.152 181.298 605.205 179.903C607.258 178.509 608.798 176.591 609.824 174.499V80H636Z", fill: "white" },  // Paths that change color
            { d: "M491.485 195.751C486.15 192.085 482.363 186.498 480.126 178.816C477.889 171.134 476.856 161.008 476.856 148.262V130.978C476.856 118.233 478.061 107.757 480.642 100.075C483.224 92.2185 487.182 86.6316 492.69 83.1397C498.197 79.6479 505.253 77.7274 514.03 77.7274C522.636 77.7274 529.692 79.4733 534.855 83.1397C540.018 86.8062 543.976 92.3931 546.386 100.075C548.795 107.757 550 118.058 550 130.803V148.088C550 160.833 548.795 170.959 546.386 178.641C543.976 186.323 540.19 191.91 534.855 195.577C529.52 199.069 522.291 200.989 513.342 200.989C504.048 201.164 496.82 199.243 491.485 195.751ZM521.259 177.07C522.808 173.229 523.496 166.769 523.496 158.04V120.852C523.496 112.297 522.808 106.011 521.259 102.17C519.71 98.1546 517.128 96.2341 513.514 96.2341C509.9 96.2341 507.49 98.1546 505.942 102.17C504.393 106.186 503.704 112.297 503.704 120.852V158.04C503.704 166.769 504.393 173.229 505.769 177.07C507.146 180.911 509.728 182.832 513.514 182.832C517.128 182.832 519.71 180.911 521.259 177.07ZM427.118 146.342L397 36H423.332L433.83 85.9332C436.584 98.3292 438.477 108.805 439.854 117.36H440.542C441.403 111.074 443.468 100.773 446.566 86.1078L457.408 36H483.74L453.278 146.167V199.069H427.29V146.342H427.118Z", fill: "white" },
            { d: "M231.867 120.962H207.47C207.558 118.686 207.602 117.038 207.602 116.018C207.602 110.447 207.293 106.523 206.674 104.248C205.436 99.8536 201.945 97.6565 196.199 97.6565C188.331 97.6565 184.398 103.189 184.398 114.253V164.747C184.398 175.811 188.287 181.344 196.066 181.344C201.901 181.344 205.436 178.911 206.674 174.046C207.293 171.535 207.602 167.258 207.602 161.216C207.602 160.039 207.558 158.195 207.47 155.684H231.867C231.956 159.686 232 162.079 232 162.864C232 170.24 231.381 175.772 230.144 179.46C227.669 186.679 222.939 192.251 215.956 196.174C210.21 199.391 203.845 201 196.862 201C189.083 201 181.923 199.038 175.381 195.115C168.486 190.878 163.978 185.032 161.856 177.577C160.619 173.34 160 167.611 160 160.392V118.49C160 105.778 162.564 96.401 167.691 90.3589C171.138 86.2785 175.779 83.1397 181.613 80.9426C186.564 78.9809 191.735 78 197.127 78C205.348 78 212.552 80.0794 218.74 84.2383C225.017 88.3971 229.039 94.0469 230.807 101.188C231.602 104.562 232 109.191 232 115.077C232 116.097 231.956 118.058 231.867 120.962Z", fill: fillColor },
            { d: "M270.717 200H247V37H270.717V125.13L294.943 78.5686H318.922L295.224 119.154L321 199.987H297.78L281.074 143.564L270.717 161.214V200Z", fill: fillColor },
            { d: "M145 82V201.082H124.47L122.246 186.437H121.733C116.087 197.421 107.704 203 96.5832 203C88.8844 203 83.0675 200.385 79.4747 195.154C75.7109 189.924 74 181.903 74 170.919V82H100.347V169.35C100.347 174.581 100.86 178.416 102.058 180.683C103.255 182.95 105.137 183.996 107.704 183.996C109.928 183.996 112.152 183.298 114.205 181.903C116.258 180.509 117.798 178.591 118.824 176.499V82H145Z", fill: fillColor },
            { d: "M25.8557 201H0V39H65.6337L66 60.2459H25.8557V105.393H55.6892V127.967H25.8557V201Z", fill: fillColor },
        ];

        paths.forEach((pathData) => {
            const path = document.createElementNS(svgNamespace, 'path');
            path.setAttribute('d', pathData.d);
            path.setAttribute('fill', pathData.fill);
            customSVG.appendChild(path);
        });

        return customSVG;
    }

    // Replace the YouTube logo
    function replaceLogo(fillColor) {
        const logoLink = document.querySelector('a#logo');
        if (logoLink) {
            // Hide the existing YouTube logo
            const originalLogo = logoLink.querySelector('yt-icon');
            if (originalLogo) {
                originalLogo.style.display = 'none';
            }

            // Remove existing custom SVG if present
            const existingSVG = logoLink.querySelector('svg.custom-logo');
            if (existingSVG) {
                existingSVG.remove();
            }

            // Delay the appearance of the new custom SVG
            setTimeout(() => {
                // Insert the new custom SVG
                const customSVG = createCustomLogo(fillColor);
                customSVG.classList.add('custom-logo'); // Mark the custom SVG to prevent duplication
                logoLink.appendChild(customSVG);
            }, 0); // Adjust the delay as needed
        }
    }

    // Function to get the current color from the yt-icon-button
    function getGuideButtonColor() {
        const guideButton = document.querySelector('#guide-button');
        return guideButton ? window.getComputedStyle(guideButton).color : '';
    }

    // Function to get the appropriate fill color based on the guide button color
    function getCurrentFillColor() {
        const buttonColor = getGuideButtonColor();
    if (buttonColor === 'rgb(255, 255, 255)') {
        return darkModeColor;
    }
    if (buttonColor === 'rgb(3, 3, 3)') {
        return lightModeColor;
    }
        return lightModeColor; // Default to light mode color if color is not recognized
    }

    // Function to check if the user is on a video page
    function isVideoPage() {
        return window.location.href.includes('/watch');
    }

    // Function to update the logo color based on the current theme mode or page
    function updateLogo() {
        const fillColor = getCurrentFillColor();
        replaceLogo(fillColor);
    }

    // Observe AJAX page changes to detect when the user navigates to a video page
    function observePageChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                setTimeout(() => updateLogo(), 1500); // Delay to ensure the theme and header color are updated
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Observe theme (light/dark mode) changes by watching changes to the guide button
    function observeThemeChanges() {
        const guideButton = document.querySelector('#guide-button');
        if (guideButton) {
            new MutationObserver(() => {
                updateLogo(); // Update logo when the guide button color changes
            }).observe(guideButton, { attributes: true, attributeFilter: ['style'] });
        }
    }
    // Initial setup
    window.addEventListener('load', () => {
        updateLogo(); // Set the initial logo color
        observePageChanges(); // Watch for navigation changes
        observeThemeChanges(); // Watch for theme changes
    });

})();