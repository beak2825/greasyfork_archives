// ==UserScript==
// @name         Fuck YouTube logo
// @namespace    Violentmonkey Scripts
// @version      1.2
// @description  Replace the YouTube logo with a custom logo styled to resemble the original logo but with the text "Fuck YouTube"
// @author       Nairdah
// @license      MIT
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/508890/Fuck%20YouTube%20logo.user.js
// @updateURL https://update.greasyfork.org/scripts/508890/Fuck%20YouTube%20logo.meta.js
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
        customSVG.setAttribute('viewBox', '0 0 545 143');
        customSVG.setAttribute('fill', 'none');
        customSVG.setAttribute('xmlns', svgNamespace);

        // SVG paths
        const paths = [
            { d: "M198.626 22.3187C196.28 13.5739 189.372 6.65644 180.64 4.30711C164.87 0 101.398 0 101.398 0C101.398 0 37.9266 0.130518 22.1564 4.43763C13.4242 6.78696 6.5166 13.7044 4.17063 22.4492C-3.10736e-07 38.2419 0 71.2631 0 71.2631C0 71.2631 -3.10736e-07 104.284 4.30096 120.208C6.64693 128.952 13.5545 135.87 22.2868 138.219C38.057 142.526 101.529 142.526 101.529 142.526C101.529 142.526 165 142.526 180.771 138.219C189.503 135.87 196.41 128.952 198.756 120.208C203.057 104.415 203.057 71.2631 203.057 71.2631C203.057 71.2631 202.927 38.2419 198.626 22.3187Z", fill: "#FF0033" }, // Red background path
            { d: "M275.408 116.749C272.223 114.588 269.962 111.296 268.627 106.768C267.291 102.241 266.674 96.2731 266.674 88.7619V78.5754C266.674 71.0642 267.394 64.8905 268.935 60.3632C270.476 55.733 272.839 52.4404 276.127 50.3825C279.415 48.3247 283.628 47.1928 288.868 47.1928C294.005 47.1928 298.218 48.2218 301.3 50.3825C304.382 52.5433 306.746 55.8359 308.184 60.3632C309.623 64.8905 310.342 70.9613 310.342 78.4725V88.659C310.342 96.1702 309.623 102.138 308.184 106.665C306.746 111.193 304.485 114.485 301.3 116.646C298.115 118.704 293.8 119.836 288.457 119.836C282.908 119.939 278.593 118.807 275.408 116.749ZM293.183 105.739C294.108 103.476 294.519 99.6686 294.519 94.5239V72.6076C294.519 67.5658 294.108 63.8616 293.183 61.5979C292.258 59.2314 290.717 58.0996 288.559 58.0996C286.402 58.0996 284.963 59.2314 284.039 61.5979C283.114 63.9645 282.703 67.5658 282.703 72.6076V94.5239C282.703 99.6686 283.114 103.476 283.936 105.739C284.758 108.003 286.299 109.135 288.559 109.135C290.717 109.135 292.258 108.003 293.183 105.739ZM518.404 88.9677V92.5689L518.815 102.755C519.123 105.019 519.637 106.665 520.459 107.694C521.281 108.723 522.616 109.238 524.363 109.238C526.726 109.238 528.37 108.312 529.192 106.46C530.117 104.607 530.528 101.521 530.631 97.3021L544.296 98.1252C544.399 98.7426 544.399 99.5657 544.399 100.595C544.399 107.077 542.652 111.913 539.056 115.103C535.46 118.292 530.528 119.939 524.055 119.939C516.246 119.939 510.8 117.469 507.718 112.633C504.636 107.797 502.992 100.183 502.992 89.9966V77.5465C502.992 67.0513 504.636 59.3343 507.821 54.4983C511.109 49.6623 516.657 47.1928 524.466 47.1928C529.911 47.1928 534.021 48.2218 536.898 50.1768C539.775 52.1317 541.83 55.2185 543.063 59.4372C544.296 63.6558 544.81 69.4179 544.81 76.8262V88.8648H518.404V88.9677ZM520.459 59.3343C519.637 60.3632 519.123 61.9066 518.815 64.1703C518.506 66.434 518.404 69.8294 518.404 74.4597V79.5014H529.911V74.4597C529.911 69.9323 529.809 66.5368 529.5 64.1703C529.192 61.8037 528.678 60.1574 527.856 59.2314C527.034 58.3054 525.802 57.7909 524.158 57.7909C522.411 57.8938 521.178 58.4082 520.459 59.3343ZM236.981 87.63L219 22.6013H234.72L240.988 52.0288C242.632 59.3343 243.762 65.5079 244.584 70.5497H244.995C245.509 66.8455 246.742 60.7748 248.591 52.1317L255.064 22.6013H270.784L252.598 87.5272V118.704H237.083V87.63H236.981Z", fill: fillColor},
            { d: "M139.93 71.1483H127.053C127.1 69.8163 127.123 68.8517 127.123 68.2545C127.123 64.9933 126.96 62.6967 126.634 61.3646C125.98 58.7923 124.138 57.5062 121.105 57.5062C116.953 57.5062 114.877 60.7445 114.877 67.2211V96.7789C114.877 103.256 116.929 106.494 121.035 106.494C124.114 106.494 125.98 105.07 126.634 102.222C126.96 100.752 127.123 98.2488 127.123 94.712C127.123 94.023 127.1 92.9435 127.053 91.4737H139.93C139.977 93.8163 140 95.2172 140 95.6766C140 99.9943 139.673 103.233 139.02 105.391C137.714 109.617 135.218 112.878 131.532 115.175C128.5 117.058 125.141 118 121.455 118C117.349 118 113.57 116.852 110.118 114.555C106.479 112.075 104.099 108.653 102.98 104.289C102.327 101.809 102 98.4555 102 94.2297V69.7014C102 62.2603 103.353 56.7713 106.059 53.2344C107.878 50.8459 110.328 49.0086 113.407 47.7225C116.02 46.5742 118.749 46 121.595 46C125.934 46 129.736 47.2172 133.002 49.6517C136.314 52.0861 138.437 55.3933 139.37 59.5732C139.79 61.5483 140 64.2584 140 67.7033C140 68.3005 139.977 69.4488 139.93 71.1483Z", fill: "white" },
            { d: "M161.179 117H149V21H161.179V72.9046L173.62 45.4821H185.933L173.764 69.3852L187 116.992H175.076L166.498 83.7614L161.179 94.1568V117Z", fill: "white" },
            { d: "M93 48V117.875H82.012L80.8217 109.281H80.547C77.5253 115.726 73.0386 119 67.0868 119C62.9663 119 59.853 117.465 57.9301 114.396C55.9157 111.327 55 106.621 55 100.176V48H69.1012V99.255C69.1012 102.324 69.3759 104.575 70.0169 105.905C70.6578 107.235 71.6651 107.849 73.0386 107.849C74.2289 107.849 75.4193 107.439 76.5181 106.621C77.6169 105.803 78.441 104.677 78.9904 103.45V48H93Z", fill: "white" },
            { d: "M30.7114 118H17V23H51.8058L52 35.459H30.7114V61.9344H46.5322V75.1721H30.7114V118Z", fill: "white" },
            { d: "M361.304 48.5305V118.807H348.975L347.639 110.164H347.331C343.94 116.646 338.905 119.939 332.227 119.939C327.603 119.939 324.11 118.395 321.952 115.308C319.692 112.222 318.664 107.489 318.664 101.006V48.5305H334.487V100.08C334.487 103.167 334.796 105.431 335.515 106.768C336.234 108.106 337.364 108.723 338.905 108.723C340.241 108.723 341.577 108.312 342.81 107.489C344.043 106.665 344.967 105.534 345.584 104.299V48.5305H361.304Z", fill: fillColor },
            { d: "M404.252 35.3601H388.532V118.807H373.12V35.3601H357.4V22.6013H404.15V35.3601H404.252ZM494.567 59.7459C493.642 55.3215 492.101 52.1318 489.943 50.0739C487.785 48.1189 484.908 47.09 481.107 47.09C478.23 47.09 475.456 47.9131 472.99 49.5594C470.421 51.2057 468.572 53.3665 467.133 56.0417H467.03V19H451.824V118.704H464.873L466.517 112.016H466.825C468.058 114.382 469.907 116.235 472.271 117.675C474.758 119.04 477.551 119.748 480.388 119.733C485.73 119.733 489.635 117.263 492.203 112.325C494.669 107.386 496.005 99.6686 496.005 89.2764V78.1638C496.005 70.3439 495.491 64.1703 494.567 59.7459ZM480.079 88.4532C480.079 93.5979 479.874 97.6108 479.463 100.492C479.052 103.373 478.333 105.431 477.305 106.665C476.278 107.9 474.942 108.517 473.298 108.517C471.962 108.517 470.832 108.209 469.702 107.591C468.572 106.974 467.75 106.048 467.03 104.813V64.8906C467.544 62.9356 468.469 61.3922 469.805 60.1575C471.14 58.9227 472.476 58.3054 474.017 58.3054C475.661 58.3054 476.894 58.9227 477.716 60.1575C478.641 61.3922 479.155 63.553 479.566 66.5369C479.874 69.5208 480.079 73.7394 480.079 79.2957V88.4532Z", fill: fillColor },
            { d: "M442.371 48.5305V118.807H430.042L428.706 110.164H428.398C425.007 116.646 419.972 119.939 413.294 119.939C408.67 119.939 405.177 118.395 403.019 115.308C400.759 112.222 399.731 107.489 399.731 101.006V48.5305H415.554V100.08C415.554 103.167 415.863 105.431 416.582 106.768C417.301 108.106 418.431 108.723 419.972 108.723C421.308 108.723 422.644 108.312 423.877 107.489C425.11 106.665 426.035 105.534 426.651 104.299V48.5305H442.371Z", fill: fillColor }
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