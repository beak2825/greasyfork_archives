// ==UserScript==
// @name         X Block List Counter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Counts the number of accounts in your X block list, handling pagination
// @author       adamlproductions
// @match        https://x.com/settings/blocked/all
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534747/X%20Block%20List%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/534747/X%20Block%20List%20Counter.meta.js
// ==/UserScript==
// jshint        esversion: 8

(function() {
    'use strict';
    let textColor = '#FFFFFF';

    async function countBlockedAccounts() {
        let blockedCount = 0;
        let seenUserIds = new Set();
        let lastHeight = document.body.scrollHeight;
        let noNewContentCount = 0;

        const counterDiv = document.createElement('div');
        counterDiv.style.position = 'fixed';
        counterDiv.style.top = '10px';
        counterDiv.style.right = '10px';
        counterDiv.style.color = textColor;
        counterDiv.style.padding = '10px';
        counterDiv.style.border = `1px solid ${textColor}`;
        counterDiv.style.zIndex = '1000';
        counterDiv.innerText = 'Counting blocked accounts...';
        document.body.appendChild(counterDiv);

        while (noNewContentCount < 3) {
            if(window.location.href != 'https://x.com/settings/blocked/all'){
                console.log('X block list counting aborted.');
                break;
            }
            const blockedAccounts = document.querySelectorAll('div[data-testid="cellInnerDiv"]');

            for (const account of blockedAccounts) {
                const userLink = account.querySelector('a[href*="/"]');
                const userId = userLink ? userLink.getAttribute('href') : null;
                if (userId && !seenUserIds.has(userId)) {
                    seenUserIds.add(userId);
                    blockedCount++;
                }
            }

            counterDiv.innerText = `Blocked accounts: ${blockedCount}`;

            window.scrollTo(0, document.body.scrollHeight);
            await new Promise(resolve => setTimeout(resolve, 1500));

            const newHeight = document.body.scrollHeight;
            if (newHeight === lastHeight) {
                noNewContentCount++;
            } else {
                noNewContentCount = 0;
            }
            lastHeight = newHeight;
        }

        counterDiv.innerText = `Total blocked accounts: ${blockedCount}`;
        console.log(`Total blocked accounts: ${blockedCount}`);
    }

    window.addEventListener('load', () => {
        let sum = rgbSum(window.getComputedStyle(document.body).backgroundColor);
        if(sum != 0){
            textColor = '#000000';
        }
        countBlockedAccounts().catch(error => {
            console.error('Error counting blocked accounts:', error);
            const errorDiv = document.createElement('div');
            errorDiv.style.position = 'fixed';
            errorDiv.style.top = '50px';
            errorDiv.style.right = '10px';
            errorDiv.style.color = textColor;
            errorDiv.style.padding = '10px';
            errorDiv.style.border = '1px solid #f00';
            errorDiv.style.zIndex = '1000';
            errorDiv.innerText = 'Error counting blocked accounts. Check console for details.';
            document.body.appendChild(errorDiv);
        });
    });

    function rgbSum(rgb) {
        const rgbValues = rgb.match(/\d+/g);
        const r = parseInt(rgbValues[0]).toString(16).padStart(2, '0');
        const g = parseInt(rgbValues[1]).toString(16).padStart(2, '0');
        const b = parseInt(rgbValues[2]).toString(16).padStart(2, '0');

        return r + g + b;
    }
})();