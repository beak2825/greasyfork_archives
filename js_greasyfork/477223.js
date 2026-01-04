// ==UserScript==
// @name         Bitkong Faucets Rotator
// @namespace    Roberto Mario Gómez y Bolaños
// @version      1.8
// @description  Automatically clicks the "Claim" button for faucet refill on BitKong, LuckyDice, and SimpleDice.
// @match        https://bitkong.com/pt/app/bonuses
// @match        https://luckydice.com/pt/app/bonuses
// @match        https://simpledice.com/pt/app/bonuses
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477223/Bitkong%20Faucets%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/477223/Bitkong%20Faucets%20Rotator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let resgatarSpanClicked = false;

    function findSpansByText(text) {
        const spans = document.querySelectorAll('span');
        const matchingSpans = [];

        for (const span of spans) {
            if (span.textContent.includes(text)) {
                matchingSpans.push(span);
            }
        }

        return matchingSpans;
    }

    function findNearestResgatarSpan(increaseSpan) {
        const nearestResgatarSpan = increaseSpan.closest('div').querySelector('span');
        return nearestResgatarSpan && nearestResgatarSpan.textContent.includes('Resgatar') ? nearestResgatarSpan : null;
    }

    function clickFirstResgatarSpanNearIncreaseSpan() {
        const increaseSpans = findSpansByText('Increase');

        for (const increaseSpan of increaseSpans) {
            if (!resgatarSpanClicked) {
                const nearestResgatarSpan = findNearestResgatarSpan(increaseSpan);

                if (nearestResgatarSpan) {
                    nearestResgatarSpan.click();
                    resgatarSpanClicked = true;
                    break;
                } else {
                    console.log('No "Resgatar" span near the first "Increase" span found.');
                }
            }
        }
    }

    async function startAutomation() {
        window.onload = function() {
            const initialWait = Math.random() * (30000 - 10000) + 10000;
            setTimeout(function() {
                resgatarSpanClicked = false;

                const spanElements = document.querySelectorAll('span');
                let spanElement;
                for (const element of spanElements) {
                    if (element.textContent === "Faucet grátis") {
                        spanElement = element;
                        break;
                    }
                }

                if (spanElement) {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    spanElement.dispatchEvent(clickEvent);
                    setTimeout(function() {
                        clickFirstResgatarSpanNearIncreaseSpan();
                    }, 5000);
                }
            }, initialWait);
        };
    }

    async function startAutomation1() {
        const checkInterval = 5000;
        let startTime = new Date().getTime();
        setInterval(() => {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= 600000) {
                window.location.reload();
            }
            const randomWait = Math.random() * (220000 - 120000) + 120000;

            if (window.location.host.includes('luckydice.com') && resgatarSpanClicked === false) {
                setTimeout(() => {
                    window.location.href = 'https://simpledice.com/pt/app/bonuses';
                }, randomWait);
            } else if (window.location.host.includes('simpledice.com') && resgatarSpanClicked === true) {
                resgatarSpanClicked = false;
                setTimeout(() => {
                    window.location.href = 'https://bitkong.com/pt/app/bonuses';
                }, randomWait);
            } else if (window.location.host.includes('bitkong.com') && resgatarSpanClicked === true) {
                resgatarSpanClicked = false;
                setTimeout(() => {
                    window.location.href = 'https://luckydice.com/pt/app/bonuses';
                }, randomWait);
            }
        }, checkInterval);
    }

    try {
        startAutomation();
        startAutomation1();
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
