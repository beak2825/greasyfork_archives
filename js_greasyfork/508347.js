// ==UserScript==
// @name         Torn Colorblind Help
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Replace Energy, Nerve, Happy, and Life bars with colorblind-friendly versions and apply global color changes for accessibility.
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508347/Torn%20Colorblind%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/508347/Torn%20Colorblind%20Help.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const colorMappings = {
        'rgb(130, 201, 30)': 'rgba(0, 102, 204, 0.5)',
        'rgb(229, 76, 25)': 'rgba(255, 153, 51, 0.5)',
        'rgb(0, 165, 0)': 'rgba(51, 170, 255, 0.5)',
        'rgba(0, 102, 204, 0.5)': 'rgba(51, 170, 255, 0.5)',
        'rgb(255, 107, 107)': 'rgba(255, 204, 102, 0.5)',
        'rgb(216, 53, 0)': 'rgba(255, 153, 0, 0.5)',
        '#6cad2b': 'rgba(52, 152, 219, 0.5)',
        '#4d7c1e': 'rgba(31, 97, 141, 0.5)'
    };

    const gradientMappings = {
        'linear-gradient(180deg, #6cad2b, #4d7c1e)': 'linear-gradient(180deg, rgba(52, 152, 219, 0.5), rgba(31, 97, 141, 0.5))',
        'linear-gradient(180deg, #d83500, #ff6b6b)': 'linear-gradient(180deg, rgba(255, 153, 51, 0.5), rgba(255, 204, 102, 0.5))',
        'linear-gradient(180deg, #f1c40f, #b7950b)': 'linear-gradient(180deg, rgba(241, 196, 15, 0.5), rgba(183, 149, 11, 0.5))',
        'linear-gradient(180deg, #2ecc71, #1e8449)': 'linear-gradient(180deg, rgba(46, 204, 113, 0.5), rgba(30, 132, 73, 0.5))'
    };

    const progressBarColors = {
        energy: {
            filledColor: 'rgba(52, 152, 219, 1)',
            borderColor: 'rgba(31, 97, 141, 1)'
        },
        nerve: {
            filledColor: 'rgba(255, 153, 51, 1)',
            borderColor: 'rgba(160, 64, 0, 1)'
        },
        happy: {
            filledColor: 'rgba(241, 196, 15, 1)',
            borderColor: 'rgba(183, 149, 11, 1)'
        },
        life: {
            filledColor: 'rgba(46, 204, 113, 1)',
            borderColor: 'rgba(30, 132, 73, 1)'
        }
    };

    function isOutsideTabMenu(element) {
        return !element.closest('#tab-menu');
    }

    function replaceColor(element) {
        if (!isOutsideTabMenu(element)) return;
        const computedStyle = window.getComputedStyle(element);
        if (colorMappings[computedStyle.color]) {
            element.style.color = colorMappings[computedStyle.color];
        }
        if (colorMappings[computedStyle.backgroundColor]) {
            element.style.backgroundColor = colorMappings[computedStyle.backgroundColor];
        }
        if (colorMappings[computedStyle.borderColor]) {
            element.style.borderColor = colorMappings[computedStyle.borderColor];
        }
        if (computedStyle.backgroundImage && gradientMappings[computedStyle.backgroundImage]) {
            element.style.backgroundImage = gradientMappings[computedStyle.backgroundImage];
        }
    }

    function disableGradient(element) {
        if (!isOutsideTabMenu(element)) return;
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.backgroundImage && computedStyle.backgroundImage.includes('linear-gradient')) {
            element.style.backgroundImage = 'none';
        }
    }

    function replaceProgressBarColor(element, scheme) {
        if (!isOutsideTabMenu(element)) return;
        const progressLine = element.querySelector('.progress-line___FhcBg');
        const progressLineTimer = element.querySelector('.progress-line-timer___uV1ZZ');
        if (progressLine) {
            progressLine.style.backgroundColor = scheme.filledColor;
            progressLine.style.borderColor = scheme.borderColor;
            progressLine.style.opacity = '1';
        }
        if (progressLineTimer) {
            progressLineTimer.style.backgroundColor = scheme.filledColor;
            progressLineTimer.style.borderColor = scheme.borderColor;
            progressLineTimer.style.opacity = '0.5';
        }
    }

    function updateBarNameColors() {
        const elements = document.querySelectorAll('.tt-highlight-energy-refill [class*="bar__"][class*="energy__"] p[class*="bar-name_"]');
        elements.forEach(element => {
            if (!isOutsideTabMenu(element)) return;
            element.style.color = 'rgb(0, 102, 204)';
            element.style.borderColor = 'rgba(31, 97, 141, 1)';
        });
    }

    function updateProgressLineColors() {
        const elements = document.querySelectorAll('.bar___Bv5Ho.energy___hsTnO .progress-line___FhcBg, .bar-desktop___p5Cas .progress___z5tk3 .progress-line___FhcBg, .bar-mobile___yMict .progress___z5tk3 .progress-line___FhcBg, div.progress-line___FhcBg[style*="border-color: rgb(31, 97, 141); background-color: rgb(52, 152, 219);"], div.progress-line___FhcBg[style*="border-color: rgba(0, 102, 204, 0.5);"]');
        elements.forEach(element => {
            if (!isOutsideTabMenu(element)) return;
            element.style.borderColor = colorMappings['rgb(31, 97, 141)'];
            element.style.backgroundColor = colorMappings['rgb(52, 152, 219)'];
            if (element.style.background.includes('#6cad2b') || element.style.background.includes('#4d7c1e')) {
                element.style.background = element.style.background.replace('#6cad2b', colorMappings['#6cad2b']).replace('#4d7c1e', colorMappings['#4d7c1e']);
            }
            disableGradient(element);
            element.style.opacity = '0.5';
        });
    }

    function updateMessageWrapperColors() {
        const elements = document.querySelectorAll('.messageWrapper___mxBvg p.gained___WpPiS');
        elements.forEach(element => {
            element.style.color = 'rgba(0, 102, 204, 0.5)';
        });
    }

    function updateInlineStyles() {
        const elements = document.querySelectorAll('[style*="color:"], [style*="background-color:"], [style*="border-color:"], [style*="border:"]');
        elements.forEach(element => {
            if (!isOutsideTabMenu(element)) return;
            const style = element.getAttribute('style');
            if (style.includes('border-color: rgba(0, 102, 204, 0.5);') ||
                style.includes('color:') ||
                style.includes('background-color:') ||
                style.includes('border:')) {
                replaceColor(element);
            }
        });
    }

    function applyChangesToAll() {
        const allElements = document.querySelectorAll('*:not(.chat-box___mHm01 *)');
        allElements.forEach(element => {
            if (!isOutsideTabMenu(element)) return;
            replaceColor(element);
        });
        updateProgressLineColors();
        updateBarNameColors();
        updateMessageWrapperColors();
        updateInlineStyles();
    }

    function replaceAllBars() {
        const energyBar = document.querySelector('.bar___Bv5Ho.energy___hsTnO.bar-desktop___p5Cas');
        const nerveBar = document.querySelector('.bar___Bv5Ho.nerve___AyYv_.bar-desktop___p5Cas');
        const happyBar = document.querySelector('.bar___Bv5Ho.happy___g3XML.bar-desktop___p5Cas');
        const lifeBar = document.querySelector('.bar___Bv5Ho.life___PlnzK.bar-desktop___p5Cas');
        if (energyBar) replaceProgressBarColor(energyBar, progressBarColors.energy);
        if (nerveBar) replaceProgressBarColor(nerveBar, progressBarColors.nerve);
        if (happyBar) replaceProgressBarColor(happyBar, progressBarColors.happy);
        if (lifeBar) replaceProgressBarColor(lifeBar, progressBarColors.life);
    }

    let mutationTimeout;
    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            if (mutationTimeout) clearTimeout(mutationTimeout);
            mutationTimeout = setTimeout(() => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && !node.closest('.chat-box___mHm01')) {
                            applyChangesToAll();
                            replaceAllBars();
                        }
                    });
                });
            }, 200);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    applyChangesToAll();
    replaceAllBars();
    observeDOMChanges();

})();